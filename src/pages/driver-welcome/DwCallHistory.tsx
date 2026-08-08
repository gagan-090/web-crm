import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDwCallHistoryQuery } from '../../services/api/webCrmApi';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';
import {
  DWC_CONNECTED_OPTIONS,
  DWC_NOT_CONNECTED_OPTIONS,
  DWC_CALLBACK_OPTIONS,
} from '../../shared/components/cti/PostCallDispositionModal';

// Every canonical disposition feedback, grouped like the disposition modal, so
// the filter offers ALL options — not only the ones already in this caller's history.
const FEEDBACK_GROUPS: Array<{ label: string; options: readonly string[] }> = [
  { label: 'Connected', options: DWC_CONNECTED_OPTIONS },
  { label: 'Not Connected', options: DWC_NOT_CONNECTED_OPTIONS },
  { label: 'Call Back Later', options: DWC_CALLBACK_OPTIONS },
];
const CANONICAL_FEEDBACKS = new Set(FEEDBACK_GROUPS.flatMap((g) => g.options));

type DirectionFilter = 'all' | 'incoming' | 'outgoing';
type StatusFilter = 'all' | 'connected' | 'not_connected' | 'callback_later';
type DateFilter = 'all' | 'today' | 'yesterday' | 'this_week' | 'this_month';

const getDateBounds = (filter: DateFilter): { start: Date; end: Date } | null => {
  if (filter === 'all') return null;
  const now = new Date();
  const start = new Date(now);
  const end = new Date(now);

  if (filter === 'today') {
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (filter === 'yesterday') {
    start.setDate(start.getDate() - 1);
    start.setHours(0, 0, 0, 0);
    end.setDate(end.getDate() - 1);
    end.setHours(23, 59, 59, 999);
  } else if (filter === 'this_week') {
    const day = start.getDay();
    start.setDate(start.getDate() - day);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  } else if (filter === 'this_month') {
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
  }
  return { start, end };
};

export const DwCallHistory: React.FC = () => {
  const navigate = useNavigate();
  const { dial, agentState, callState } = useSanCti();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateFilter, setDateFilter] = useState<DateFilter>('all');
  const [feedbackFilter, setFeedbackFilter] = useState<string>('all');

  const { data: response, isLoading, isFetching, refetch } = useGetDwCallHistoryQuery({
    page: currentPage,
    search: searchQuery || undefined,
    feedback: feedbackFilter !== 'all' ? feedbackFilter : undefined,
    per_page: 15
  });

  const records = response?.data || [];
  const feedbackOptions = response?.feedback_options || [];
  const extraFeedbacks = feedbackOptions.filter((f) => !CANONICAL_FEEDBACKS.has(f));
  const pagination = response?.pagination || { total: 0, per_page: 15, current_page: 1, last_page: 1 };

  const filteredRecords = useMemo(() => {
    const dateBounds = getDateBounds(dateFilter);
    return records.filter((r: any) => {
      // Direction
      const isIncoming = r.process?.toLowerCase() === 'incoming';
      if (directionFilter === 'incoming' && !isIncoming) return false;
      if (directionFilter === 'outgoing' && isIncoming) return false;

      // Status
      if (statusFilter !== 'all' && r.call_status?.toLowerCase() !== statusFilter) return false;

      // Date
      if (dateBounds) {
        const created = new Date(r.created_at);
        if (created < dateBounds.start || created > dateBounds.end) return false;
      }

      return true;
    });
  }, [records, directionFilter, statusFilter, dateFilter]);

  const hasActiveFilters = directionFilter !== 'all' || statusFilter !== 'all' || dateFilter !== 'all' || feedbackFilter !== 'all' || searchQuery !== '';

  const resetFilters = () => {
    setDirectionFilter('all');
    setStatusFilter('all');
    setDateFilter('all');
    setFeedbackFilter('all');
    setSearchQuery('');
    setCurrentPage(1);
  };

  const handleCallNow = (record: any) => {
    navigate('/dw/dw-active-call-focus', {
      state: {
        userId: record.user_id,
        tmid: record.tmid,
        name: record.name,
        mobile: record.mobile
      }
    });
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Dial a lead straight from a call-history row (icon next to the name), so an
  // agent can re-call without scrolling to the Actions column. lead_type follows
  // the row's process so call_history_ivr.process stays correct.
  //
  // Social / campaign rows have NO users.id — call_history_ivr stores user_id
  // NULL for them — so requiring one here (and on the button's disabled prop)
  // left the Call icon permanently greyed out on every campaign lead, even
  // though the row carries a perfectly good mobile number. They dial as
  // 'social_media' using the originating social_media_leads id the API now
  // resolves for the row.
  const handleDirectCall = (r: any) => {
    if (!r.mobile) { showToast('This record has no phone number.'); return; }
    if (agentState !== 'ready') {
      showToast(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel (bottom-left).'
        : 'CTI agent is not ready yet — please wait a moment and try again.');
      return;
    }
    if (callState !== 'idle') { showToast('Finish the current call before dialing another.'); return; }

    const isSocial = !r.user_id;
    const leadType = (r.process || '').toLowerCase().includes('transporter')
      ? 'transporter'
      : (isSocial ? 'social_media' : 'driver');
    const leadId = isSocial ? Number(r.social_lead_id || 0) : Number(r.user_id);

    dial(r.mobile, leadId, r.name, r.tmid, leadType);
    showToast(`Dialing ${r.name || r.mobile}…`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'connected':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'callback_later':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'not_connected':
      default:
        return 'bg-rose-50 text-rose-700 border-rose-200';
    }
  };

  const formatDuration = (seconds: number) => {
    if (!seconds) return '0s';
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="space-y-6 w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)]">

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#27AE60]"></span>
          {toast}
        </div>
      )}

      {/* Top Header */}
      <section className="border-b border-gray-200 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">Call History</p>
            <h2 className="text-2xl font-bold text-gray-800">Completed Call Logs & Feedback</h2>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#27AE60] border border-[#27AE60]/30 bg-[#EAFAF1] hover:bg-[#d7f5e5] rounded-lg transition-colors disabled:opacity-60"
              title="Refresh call history"
            >
              <span className={`material-symbols-outlined text-[14px] ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
              Refresh
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">filter_list_off</span>
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Filter Row 1: Search + Direction + Status */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Search name, TM ID, mobile..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
              >
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* Direction Filter */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">swap_vert</span>
            <select
              value={directionFilter}
              onChange={(e) => { setDirectionFilter(e.target.value as DirectionFilter); setCurrentPage(1); }}
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] outline-none transition-all font-semibold appearance-none ${directionFilter !== 'all' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <option value="all">All Directions</option>
              <option value="incoming">Incoming</option>
              <option value="outgoing">Outgoing</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">call_end</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setCurrentPage(1); }}
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] outline-none transition-all font-semibold appearance-none ${statusFilter !== 'all' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <option value="all">All Statuses</option>
              <option value="connected">Connected</option>
              <option value="not_connected">Not Connected</option>
              <option value="callback_later">Callback Later</option>
            </select>
          </div>

          {/* Date Filter */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">calendar_month</span>
            <select
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value as DateFilter); setCurrentPage(1); }}
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] outline-none transition-all font-semibold appearance-none ${dateFilter !== 'all' ? 'bg-violet-50 border-violet-300 text-violet-700' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <option value="all">All Dates</option>
              <option value="today">Today</option>
              <option value="yesterday">Yesterday</option>
              <option value="this_week">This Week</option>
              <option value="this_month">This Month</option>
            </select>
          </div>

          {/* Feedback Filter (distinct call_feedback values) */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">reviews</span>
            <select
              value={feedbackFilter}
              onChange={(e) => { setFeedbackFilter(e.target.value); setCurrentPage(1); }}
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] outline-none transition-all font-semibold appearance-none max-w-[220px] ${feedbackFilter !== 'all' ? 'bg-teal-50 border-teal-300 text-teal-700' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <option value="all">All Feedbacks</option>
              {FEEDBACK_GROUPS.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.options.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </optgroup>
              ))}
              {extraFeedbacks.length > 0 && (
                <optgroup label="Other">
                  {extraFeedbacks.map((f) => (
                    <option key={f} value={f}>{f}</option>
                  ))}
                </optgroup>
              )}
            </select>
          </div>
        </div>

        {/* Active filter pills */}
        {hasActiveFilters && (
          <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mr-1">Active:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-gray-100 text-gray-700 text-xs font-semibold rounded-full border border-gray-200">
                <span className="material-symbols-outlined text-[11px]">search</span>
                "{searchQuery}"
                <button onClick={() => setSearchQuery('')} className="ml-0.5 text-gray-400 hover:text-gray-600"><span className="material-symbols-outlined text-[11px]">close</span></button>
              </span>
            )}
            {directionFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full border border-blue-200">
                {directionFilter === 'incoming' ? 'Incoming' : 'Outgoing'}
                <button onClick={() => setDirectionFilter('all')} className="ml-0.5 text-blue-400 hover:text-blue-600"><span className="material-symbols-outlined text-[11px]">close</span></button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-200">
                {statusFilter.replace('_', ' ')}
                <button onClick={() => setStatusFilter('all')} className="ml-0.5 text-emerald-400 hover:text-emerald-600"><span className="material-symbols-outlined text-[11px]">close</span></button>
              </span>
            )}
            {dateFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-violet-100 text-violet-700 text-xs font-semibold rounded-full border border-violet-200">
                {dateFilter.replace('_', ' ')}
                <button onClick={() => setDateFilter('all')} className="ml-0.5 text-violet-400 hover:text-violet-600"><span className="material-symbols-outlined text-[11px]">close</span></button>
              </span>
            )}
            {feedbackFilter !== 'all' && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-semibold rounded-full border border-teal-200">
                {feedbackFilter}
                <button onClick={() => setFeedbackFilter('all')} className="ml-0.5 text-teal-400 hover:text-teal-600"><span className="material-symbols-outlined text-[11px]">close</span></button>
              </span>
            )}
            <span className="text-[10px] text-gray-400 font-semibold ml-1">
              {filteredRecords.length} result{filteredRecords.length !== 1 ? 's' : ''}
            </span>
          </div>
        )}
      </section>

      {/* Main Content Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
        {isLoading || isFetching ? (
          <div className="p-16 text-center text-gray-500 font-semibold flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-4 border-t-[#27AE60] border-gray-200 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 mt-2">Retrieving call history...</p>
          </div>
        ) : filteredRecords.length > 0 ? (
          <div className="overflow-auto max-h-[calc(100vh-300px)]">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Driver Details</th>
                  <th className="px-6 py-4">Direction</th>
                  <th className="px-6 py-4">Call Status</th>
                  <th className="px-6 py-4">Feedback</th>
                  <th className="px-6 py-4">Remarks</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Call Type / Process</th>
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Recording</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {filteredRecords.map((r: any) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDirectCall(r)}
                          title={`Call ${r.name || r.mobile}`}
                          disabled={!r.mobile}
                          className="shrink-0 w-9 h-9 rounded-full bg-[#27AE60] hover:bg-[#219653] text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform disabled:opacity-40"
                        >
                          <span className="material-symbols-outlined text-[18px]">call</span>
                        </button>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 truncate">{r.name}</div>
                          <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 font-medium">
                            <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">{r.tmid}</span>
                            <span>•</span>
                            <span>**********</span>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {r.process?.toLowerCase() === 'incoming' ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[13px] font-bold">call_received</span>
                          Incoming
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[13px] font-bold">call_made</span>
                          Outgoing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusBadgeClass(r.call_status)}`}>
                        {r.call_status?.replace('_', ' ') || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">
                      {r.call_feedback || '—'}
                    </td>
                    <td className="px-6 py-4 max-w-xs truncate" title={r.call_remarks || ''}>
                      {r.call_remarks || <span className="text-gray-300 italic">No remarks</span>}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">
                      {formatDuration(r.duration_secs)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-800 capitalize">{r.call_type}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{r.process}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500">
                      {r.date_display}
                    </td>
                    <td className="px-6 py-4">
                      {r.recording_url ? (
                        playingId === r.id ? (
                          <div className="flex items-center gap-2">
                            <audio src={r.recording_url} autoPlay controls className="h-8 max-w-[160px] text-xs" />
                            <button
                              onClick={() => setPlayingId(null)}
                              className="text-gray-400 hover:text-red-500"
                              title="Close Player"
                            >
                              <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setPlayingId(r.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#27AE60] hover:text-[#219653]"
                          >
                            <span className="material-symbols-outlined text-lg">play_circle</span>
                            <span>Listen</span>
                          </button>
                        )
                      ) : (
                        <span className="text-gray-300 italic text-xs">No recording</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2 whitespace-nowrap">
                      <button
                        onClick={() => setSelectedRecord(r)}
                        className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg shadow-sm transition-all"
                        title="View Call Details"
                      >
                        <span className="material-symbols-outlined text-[14px]">info</span>
                        <span>Details</span>
                      </button>
                      {r.id ? (
                        <button
                          onClick={() => handleCallNow(r)}
                          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-transform"
                          title="Call Lead Again"
                        >
                          <span className="material-symbols-outlined text-[14px]">call</span>
                          <span>Call Again</span>
                        </button>
                      ) : (
                        <span className="text-gray-300 italic text-xs">Cannot Dial</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-gray-400 italic flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl text-gray-300">history_toggle_off</span>
            <p className="text-sm">No call history logs found.</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="mt-2 text-xs text-[#27AE60] font-bold hover:underline">
                Clear filters to see all records
              </button>
            )}
          </div>
        )}

        {/* Pagination Footer */}
        {pagination.last_page > 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-3 py-1.5 border border-gray-300 bg-white text-xs font-bold text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white select-none transition-colors"
            >
              Previous
            </button>

            <span className="text-xs font-semibold text-gray-500">
              Page {currentPage} of {pagination.last_page} ({pagination.total} total logs)
            </span>

            <button
              disabled={currentPage >= pagination.last_page}
              onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
              className="px-3 py-1.5 border border-gray-300 bg-white text-xs font-bold text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:hover:bg-white select-none transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Slide-out Call Details Drawer */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div
            className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedRecord(null)}
          />

          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
              <div>
                <span className="text-[10px] bg-[#27AE60]/10 text-[#27AE60] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                  Call Log ID: #{selectedRecord.id}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mt-1">Detailed Telephony Report</h3>
              </div>
              <button
                onClick={() => setSelectedRecord(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors outline-none"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lead Profile</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10.5px] text-gray-400 font-bold block">Full Name</label>
                    <span className="text-sm font-bold text-gray-800">{selectedRecord.name || '—'}</span>
                  </div>
                  <div>
                    <label className="text-[10.5px] text-gray-400 font-bold block">TM ID</label>
                    <span className="text-sm font-mono font-bold text-gray-800 bg-white border border-gray-200 rounded px-1.5 py-0.5 inline-block mt-0.5">{selectedRecord.tmid || '—'}</span>
                  </div>
                  <div>
                    <label className="text-[10.5px] text-gray-400 font-bold block">Mobile Number</label>
                    <span className="text-sm font-bold text-gray-800">**********</span>
                  </div>
                  <div>
                    <label className="text-[10.5px] text-gray-400 font-bold block">Database User ID</label>
                    <span className="text-sm font-mono font-bold text-gray-800">{selectedRecord.user_id || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Call Outcome & Feedback</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10.5px] text-gray-400 font-bold block">Call Direction</label>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border mt-1.5 uppercase tracking-wide ${
                        selectedRecord.process?.toLowerCase() === 'incoming'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                          : 'bg-blue-50 text-blue-700 border-blue-200'
                      }`}>
                        <span className="material-symbols-outlined text-[12px] font-bold">
                          {selectedRecord.process?.toLowerCase() === 'incoming' ? 'call_received' : 'call_made'}
                        </span>
                        {selectedRecord.process?.toLowerCase() === 'incoming' ? 'Incoming' : 'Outgoing'}
                      </span>
                    </div>
                    <div>
                      <label className="text-[10.5px] text-gray-400 font-bold block">Call Status</label>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide mt-1.5 ${getStatusBadgeClass(selectedRecord.call_status)}`}>
                        {selectedRecord.call_status?.replace('_', ' ') || '—'}
                      </span>
                    </div>
                    <div>
                      <label className="text-[10.5px] text-gray-400 font-bold block">Feedback Sub-Stage</label>
                      <span className="text-sm font-bold text-gray-800 block mt-1">{selectedRecord.call_feedback || '—'}</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10.5px] text-gray-400 font-bold block">Detailed Call Remarks</label>
                    <p className="text-sm text-gray-700 bg-white border border-gray-150 rounded-lg p-3 mt-1.5 min-h-[60px] italic">
                      {selectedRecord.call_remarks || 'No remarks recorded.'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Call Quality & Diagnostics</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-[10.5px] text-gray-400 font-bold block">Duration</label>
                    <span className="text-sm text-gray-800 font-bold">{formatDuration(selectedRecord.duration_secs)} ({selectedRecord.duration_secs || 0} seconds)</span>
                  </div>
                  <div>
                    <label className="text-[10.5px] text-gray-400 font-bold block">Connection Channel</label>
                    <span className="text-sm text-gray-800 capitalize font-semibold">{selectedRecord.call_type || '—'} ({selectedRecord.process || '—'})</span>
                  </div>
                  {selectedRecord.bill_duration && (
                    <div>
                      <label className="text-[10.5px] text-gray-400 font-bold block">Actual Call Time (Billable)</label>
                      <span className="text-sm text-gray-800 font-bold">{selectedRecord.bill_duration}</span>
                    </div>
                  )}
                  {selectedRecord.wrapup_durn && (
                    <div>
                      <label className="text-[10.5px] text-gray-400 font-bold block">Wrap-up Duration</label>
                      <span className="text-sm text-gray-800 font-bold">{selectedRecord.wrapup_durn}</span>
                    </div>
                  )}
                  {selectedRecord.recording_source && (
                    <div className="col-span-2">
                      <label className="text-[10.5px] text-gray-400 font-bold block">Recording Source</label>
                      <span className="text-sm text-gray-800 font-semibold">
                        {selectedRecord.recording_source === 'web-ivr' ? 'SAN (web dialer)'
                          : selectedRecord.recording_source === 'ivr' ? 'EasyGo IVR'
                          : 'Manual upload'}
                      </span>
                    </div>
                  )}
                  <div className="col-span-2">
                    <label className="text-[10.5px] text-gray-400 font-bold block">Created Timestamp</label>
                    <span className="text-xs font-mono text-gray-700">{selectedRecord.created_at || '—'} (Shorted Display: {selectedRecord.date_display})</span>
                  </div>
                  {selectedRecord.recording_url && (
                    <div className="col-span-2">
                      <label className="text-[10.5px] text-gray-400 font-bold block mb-1.5">Audio Recording</label>
                      <audio src={selectedRecord.recording_url} controls className="w-full h-9 rounded" />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button
                onClick={() => setSelectedRecord(null)}
                className="px-4 py-2 border border-gray-300 text-xs font-bold text-gray-700 bg-white rounded-lg hover:bg-gray-100 transition-colors"
              >
                Close details
              </button>
              {selectedRecord.id && (
                <button
                  onClick={() => { setSelectedRecord(null); handleCallNow(selectedRecord); }}
                  className="px-4 py-2 bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <span className="material-symbols-outlined text-[15px]">call</span>
                  Redial Lead
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DwCallHistory;
