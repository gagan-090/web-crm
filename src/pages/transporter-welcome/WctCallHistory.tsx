import React, { useState } from 'react';
import { useGetWctCallHistoryQuery } from '../../services/api/webCrmApi';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';
import {
  DWC_CONNECTED_OPTIONS,
  DWC_NOT_CONNECTED_OPTIONS,
  DWC_CALLBACK_OPTIONS,
} from '../../shared/components/cti/PostCallDispositionModal';

// Full canonical disposition feedbacks, grouped like the disposition modal.
const FEEDBACK_GROUPS: Array<{ label: string; options: readonly string[] }> = [
  { label: 'Connected', options: DWC_CONNECTED_OPTIONS },
  { label: 'Not Connected', options: DWC_NOT_CONNECTED_OPTIONS },
  { label: 'Call Back Later', options: DWC_CALLBACK_OPTIONS },
];
const CANONICAL_FEEDBACKS = new Set(FEEDBACK_GROUPS.flatMap((g) => g.options));

type DirectionFilter = 'all' | 'incoming' | 'outgoing';
type StatusFilter = 'all' | 'connected' | 'not_connected' | 'callback_later';

// Rows per fetch. 'all' asks the backend for the whole filtered log in one
// page (it caps at 2000) so the agent scrolls rather than paginates — the
// default is 50, which already clears the pager for a normal day's calling.
const PAGE_SIZE_OPTIONS = [25, 50, 100, 200, 'all'] as const;
type PageSize = typeof PAGE_SIZE_OPTIONS[number];

const DATE_RANGE_OPTIONS = [
  { value: 'all', label: 'All Time' },
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'last_7_days', label: 'Last 7 Days' },
  { value: 'this_week', label: 'This Week (Mon–Sat)' },
  { value: 'this_month', label: 'This Month' },
] as const;

const fmtD = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
const getDateRange = (key: string): { date_from?: string; date_to?: string } => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (key === 'today') return { date_from: fmtD(today), date_to: fmtD(today) };
  if (key === 'yesterday') { const y = new Date(today); y.setDate(y.getDate() - 1); return { date_from: fmtD(y), date_to: fmtD(y) }; }
  if (key === 'last_7_days') { const s = new Date(today); s.setDate(s.getDate() - 6); return { date_from: fmtD(s), date_to: fmtD(today) }; }
  if (key === 'this_week') {
    const day = today.getDay();
    const mon = new Date(today); mon.setDate(mon.getDate() + (day === 0 ? -6 : 1 - day));
    const sat = new Date(mon); sat.setDate(mon.getDate() + 5);
    return { date_from: fmtD(mon), date_to: fmtD(sat) };
  }
  if (key === 'this_month') { const s = new Date(now.getFullYear(), now.getMonth(), 1); return { date_from: fmtD(s), date_to: fmtD(today) }; }
  return {};
};

export const WctCallHistory: React.FC = () => {
  const { dial, agentState, callState } = useSanCti();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);
  const [directionFilter, setDirectionFilter] = useState<DirectionFilter>('all');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [dateRange, setDateRange] = useState<string>('all');
  const [feedbackFilter, setFeedbackFilter] = useState<string>('all');
  const [pageSize, setPageSize] = useState<PageSize>(50);

  const range = getDateRange(dateRange);
  // EVERY filter goes to the server. Direction and status used to be applied
  // here, after the server had already cut the log into 15-row pages — so the
  // total counted rows the filter would have thrown away and each page showed
  // only the handful of its 15 rows that matched. Filtering server-side means
  // the total, the pages and the visible rows all describe the same set.
  const { data: response, isLoading, isFetching, refetch } = useGetWctCallHistoryQuery({
    page: currentPage,
    search: searchQuery || undefined,
    feedback: feedbackFilter !== 'all' ? feedbackFilter : undefined,
    date_from: range.date_from,
    date_to: range.date_to,
    direction: directionFilter !== 'all' ? directionFilter : undefined,
    call_status: statusFilter !== 'all' ? statusFilter : undefined,
    per_page: pageSize,
  });

  const records = response?.data || [];
  const feedbackOptions = response?.feedback_options || [];
  const extraFeedbacks = feedbackOptions.filter((f) => !CANONICAL_FEEDBACKS.has(f));
  const pagination = response?.pagination || { total: 0, per_page: 50, current_page: 1, last_page: 1 };

  const hasActiveFilters = directionFilter !== 'all' || statusFilter !== 'all' || dateRange !== 'all' || feedbackFilter !== 'all' || searchQuery !== '';

  const resetFilters = () => {
    setDirectionFilter('all'); setStatusFilter('all'); setDateRange('all');
    setFeedbackFilter('all'); setSearchQuery(''); setCurrentPage(1);
  };

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Re-dial straight from a row (icon / Call Again) — dials in place. lead_type
  // follows the row: transporter/driver by process, else social/campaign. Works
  // for social rows too (no users.id — dialed as a social lead).
  const handleDirectCall = (r: any) => {
    if (!r.mobile) { showToast('This record has no phone number.'); return; }
    if (agentState !== 'ready') {
      showToast(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel (bottom-left).'
        : 'CTI agent is not ready yet — please wait a moment and try again.');
      return;
    }
    if (callState !== 'idle') { showToast('Finish the current call before dialing another.'); return; }
    const proc = (r.process || '').toLowerCase();
    const leadType = proc.includes('transporter') ? 'transporter' : (r.user_id ? 'driver' : 'social_media');
    // Campaign rows dial against their social_media_leads id (resolved by the
    // API from the row's social_media_call_history link), so the callback is
    // attributed to the lead instead of being logged against nobody.
    const leadId = r.user_id ? Number(r.user_id) : Number(r.social_lead_id || 0);
    dial(r.mobile, leadId, r.name, r.tmid, leadType);
    showToast(`Dialing ${r.name || 'lead'}…`);
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'connected': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'callback_later': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'not_connected':
      default: return 'bg-rose-50 text-rose-700 border-rose-200';
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
          <span className="w-2 h-2 rounded-full bg-[#FB641B]"></span>
          {toast}
        </div>
      )}

      {/* Header */}
      <section className="border-b border-gray-200 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">Transporter Welcome</p>
            <h2 className="text-2xl font-bold text-gray-800">Completed Call Logs &amp; Feedback</h2>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button onClick={() => refetch()} disabled={isFetching}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#FB641B] border border-[#FB641B]/30 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors disabled:opacity-60"
              title="Refresh call history">
              <span className={`material-symbols-outlined text-[14px] ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
              Refresh
            </button>
            {hasActiveFilters && (
              <button onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors">
                <span className="material-symbols-outlined text-[14px]">filter_list_off</span>
                Clear all filters
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
            <input type="text" placeholder="Search name, TM ID, mobile..." value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#FB641B] focus:border-[#FB641B] outline-none transition-all" />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">swap_vert</span>
            <select value={directionFilter} onChange={(e) => { setDirectionFilter(e.target.value as DirectionFilter); setCurrentPage(1); }}
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm outline-none font-semibold appearance-none ${directionFilter !== 'all' ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}>
              <option value="all">All Directions</option>
              <option value="incoming">Incoming</option>
              <option value="outgoing">Outgoing</option>
            </select>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">call_end</span>
            <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setCurrentPage(1); }}
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm outline-none font-semibold appearance-none ${statusFilter !== 'all' ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-gray-300 text-gray-700'}`}>
              <option value="all">All Statuses</option>
              <option value="connected">Connected</option>
              <option value="not_connected">Not Connected</option>
              <option value="callback_later">Callback Later</option>
            </select>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">calendar_month</span>
            <select value={dateRange} onChange={(e) => { setDateRange(e.target.value); setCurrentPage(1); }}
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm outline-none font-semibold appearance-none ${dateRange !== 'all' ? 'bg-violet-50 border-violet-300 text-violet-700' : 'bg-white border-gray-300 text-gray-700'}`}>
              {DATE_RANGE_OPTIONS.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
            </select>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">reviews</span>
            <select value={feedbackFilter} onChange={(e) => { setFeedbackFilter(e.target.value); setCurrentPage(1); }}
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm outline-none font-semibold appearance-none max-w-[220px] ${feedbackFilter !== 'all' ? 'bg-orange-50 border-orange-300 text-[#FB641B]' : 'bg-white border-gray-300 text-gray-700'}`}>
              <option value="all">All Feedbacks</option>
              {FEEDBACK_GROUPS.map((g) => (
                <optgroup key={g.label} label={g.label}>
                  {g.options.map((f) => (<option key={f} value={f}>{f}</option>))}
                </optgroup>
              ))}
              {extraFeedbacks.length > 0 && (
                <optgroup label="Other">{extraFeedbacks.map((f) => (<option key={f} value={f}>{f}</option>))}</optgroup>
              )}
            </select>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">format_list_numbered</span>
            <select value={String(pageSize)} onChange={(e) => { const v = e.target.value; setPageSize(v === 'all' ? 'all' : Number(v) as PageSize); setCurrentPage(1); }}
              title="Rows shown per screen"
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm outline-none font-semibold appearance-none ${pageSize !== 50 ? 'bg-slate-50 border-slate-300 text-slate-700' : 'bg-white border-gray-300 text-gray-700'}`}>
              {PAGE_SIZE_OPTIONS.map((o) => (
                <option key={String(o)} value={String(o)}>{o === 'all' ? 'Show all' : `${o} per screen`}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Result count — always the filtered total, so it matches the rows below */}
        <div className="mt-3 text-xs font-semibold text-gray-500">
          {isFetching ? 'Loading…' : (
            <>
              Showing <span className="text-gray-800">{records.length}</span> of{' '}
              <span className="text-gray-800">{pagination.total}</span> call{pagination.total === 1 ? '' : 's'}
              {hasActiveFilters ? ' matching the current filters' : ''}
              {pagination.last_page > 1 ? ` · page ${pagination.current_page} of ${pagination.last_page}` : ''}
            </>
          )}
        </div>
      </section>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading || isFetching ? (
          <div className="p-16 text-center text-gray-500 font-semibold flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-4 border-t-[#FB641B] border-gray-200 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 mt-2">Retrieving call history...</p>
          </div>
        ) : records.length > 0 ? (
          <div className="overflow-auto max-h-[calc(100vh-320px)]">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Lead Details</th>
                  <th className="px-6 py-4">Direction</th>
                  <th className="px-6 py-4">Call Status</th>
                  <th className="px-6 py-4">Feedback</th>
                  <th className="px-6 py-4">Remarks</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Call Type / Process</th>
                  <th className="px-6 py-4">Date &amp; Time</th>
                  <th className="px-6 py-4">Recording</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {records.map((r: any) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button onClick={() => handleDirectCall(r)} title={`Call ${r.name || ''}`} disabled={!r.mobile}
                          className="shrink-0 w-9 h-9 rounded-full bg-[#FB641B] hover:bg-[#e4540d] text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform disabled:opacity-40">
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
                          <span className="material-symbols-outlined text-[13px] font-bold">call_received</span>Incoming
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 uppercase tracking-wider">
                          <span className="material-symbols-outlined text-[13px] font-bold">call_made</span>Outgoing
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${getStatusBadgeClass(r.call_status)}`}>
                        {r.call_status?.replace('_', ' ') || '—'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-gray-900">{r.call_feedback || '—'}</td>
                    <td className="px-6 py-4 max-w-xs truncate" title={r.call_remarks || ''}>
                      {r.call_remarks || <span className="text-gray-300 italic">No remarks</span>}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs">{formatDuration(r.duration_secs)}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-bold text-gray-800 capitalize">{r.call_type}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{r.process}</div>
                    </td>
                    <td className="px-6 py-4 text-xs font-medium text-gray-500">{r.date_display}</td>
                    <td className="px-6 py-4">
                      {r.recording_url ? (
                        playingId === r.id ? (
                          <div className="flex items-center gap-2">
                            <audio src={r.recording_url} autoPlay controls className="h-8 max-w-[160px] text-xs" />
                            <button onClick={() => setPlayingId(null)} className="text-gray-400 hover:text-red-500" title="Close Player">
                              <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                          </div>
                        ) : (
                          <button onClick={() => setPlayingId(r.id)} className="inline-flex items-center gap-1 text-xs font-bold text-[#FB641B] hover:text-[#e4540d]">
                            <span className="material-symbols-outlined text-lg">play_circle</span><span>Listen</span>
                          </button>
                        )
                      ) : (
                        <span className="text-gray-300 italic text-xs">No recording</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right flex justify-end gap-2 whitespace-nowrap">
                      <button onClick={() => setSelectedRecord(r)} title="View Call Details"
                        className="inline-flex items-center justify-center gap-1.5 px-2.5 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-xs font-bold rounded-lg shadow-sm transition-all">
                        <span className="material-symbols-outlined text-[14px]">info</span><span>Details</span>
                      </button>
                      <button onClick={() => handleDirectCall(r)} disabled={!r.mobile} title="Call Lead Again"
                        className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 bg-[#FB641B] hover:bg-[#e4540d] text-white text-xs font-bold rounded-lg shadow-sm active:scale-95 transition-transform disabled:opacity-40">
                        <span className="material-symbols-outlined text-[14px]">call</span><span>Call Again</span>
                      </button>
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
              <button onClick={resetFilters} className="mt-2 text-xs text-[#FB641B] font-bold hover:underline">Clear filters to see all records</button>
            )}
          </div>
        )}

        {pagination.last_page > 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <button disabled={currentPage <= 1} onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-gray-300 bg-white text-xs font-bold text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 select-none">Previous</button>
            <span className="text-xs font-semibold text-gray-500">
              Page {currentPage} of {pagination.last_page} ({pagination.total} matching log{pagination.total === 1 ? '' : 's'})
              <button onClick={() => { setPageSize('all'); setCurrentPage(1); }} className="ml-2 text-[#FB641B] hover:underline">Show all on one screen</button>
            </span>
            <button disabled={currentPage >= pagination.last_page} onClick={() => setCurrentPage((p) => Math.min(pagination.last_page, p + 1))}
              className="px-3 py-1.5 border border-gray-300 bg-white text-xs font-bold text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 select-none">Next</button>
          </div>
        )}
      </div>

      {/* Details Drawer */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setSelectedRecord(null)} />
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
              <div>
                <span className="text-[10px] bg-[#FB641B]/10 text-[#FB641B] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Call Log ID: #{selectedRecord.id}</span>
                <h3 className="text-lg font-bold text-gray-800 mt-1">Detailed Telephony Report</h3>
              </div>
              <button onClick={() => setSelectedRecord(null)} className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Lead Profile</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 grid grid-cols-2 gap-4">
                  <div><label className="text-[10.5px] text-gray-400 font-bold block">Full Name</label><span className="text-sm font-bold text-gray-800">{selectedRecord.name || '—'}</span></div>
                  <div><label className="text-[10.5px] text-gray-400 font-bold block">TM ID</label><span className="text-sm font-mono font-bold text-gray-800 bg-white border border-gray-200 rounded px-1.5 py-0.5 inline-block mt-0.5">{selectedRecord.tmid || '—'}</span></div>
                  <div><label className="text-[10.5px] text-gray-400 font-bold block">Mobile Number</label><span className="text-sm font-bold text-gray-800">**********</span></div>
                  <div><label className="text-[10.5px] text-gray-400 font-bold block">Database User ID</label><span className="text-sm font-mono font-bold text-gray-800">{selectedRecord.user_id || '—'}</span></div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Call Outcome &amp; Feedback</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10.5px] text-gray-400 font-bold block">Call Direction</label>
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border mt-1.5 uppercase tracking-wide ${selectedRecord.process?.toLowerCase() === 'incoming' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>
                        <span className="material-symbols-outlined text-[12px] font-bold">{selectedRecord.process?.toLowerCase() === 'incoming' ? 'call_received' : 'call_made'}</span>
                        {selectedRecord.process?.toLowerCase() === 'incoming' ? 'Incoming' : 'Outgoing'}
                      </span>
                    </div>
                    <div>
                      <label className="text-[10.5px] text-gray-400 font-bold block">Call Status</label>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide mt-1.5 ${getStatusBadgeClass(selectedRecord.call_status)}`}>{selectedRecord.call_status?.replace('_', ' ') || '—'}</span>
                    </div>
                    <div><label className="text-[10.5px] text-gray-400 font-bold block">Feedback Sub-Stage</label><span className="text-sm font-bold text-gray-800 block mt-1">{selectedRecord.call_feedback || '—'}</span></div>
                  </div>
                  <div>
                    <label className="text-[10.5px] text-gray-400 font-bold block">Detailed Call Remarks</label>
                    <p className="text-sm text-gray-700 bg-white border border-gray-150 rounded-lg p-3 mt-1.5 min-h-[60px] italic">{selectedRecord.call_remarks || 'No remarks recorded.'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Call Quality &amp; Diagnostics</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 grid grid-cols-2 gap-4">
                  <div><label className="text-[10.5px] text-gray-400 font-bold block">Duration</label><span className="text-sm text-gray-800 font-bold">{formatDuration(selectedRecord.duration_secs)} ({selectedRecord.duration_secs || 0} seconds)</span></div>
                  <div><label className="text-[10.5px] text-gray-400 font-bold block">Connection Channel</label><span className="text-sm text-gray-800 capitalize font-semibold">{selectedRecord.call_type || '—'} ({selectedRecord.process || '—'})</span></div>
                  {selectedRecord.bill_duration && (<div><label className="text-[10.5px] text-gray-400 font-bold block">Actual Call Time (Billable)</label><span className="text-sm text-gray-800 font-bold">{selectedRecord.bill_duration}</span></div>)}
                  {selectedRecord.wrapup_durn && (<div><label className="text-[10.5px] text-gray-400 font-bold block">Wrap-up Duration</label><span className="text-sm text-gray-800 font-bold">{selectedRecord.wrapup_durn}</span></div>)}
                  {selectedRecord.recording_source && (<div className="col-span-2"><label className="text-[10.5px] text-gray-400 font-bold block">Recording Source</label><span className="text-sm text-gray-800 font-semibold capitalize">{selectedRecord.recording_source === 'web-ivr' ? 'SAN (web dialer)' : selectedRecord.recording_source === 'ivr' ? 'EasyGo IVR' : 'Manual upload'}</span></div>)}
                  <div className="col-span-2"><label className="text-[10.5px] text-gray-400 font-bold block">Created Timestamp</label><span className="text-xs font-mono text-gray-700">{selectedRecord.created_at || '—'} (Display: {selectedRecord.date_display})</span></div>
                  {selectedRecord.recording_url && (<div className="col-span-2"><label className="text-[10.5px] text-gray-400 font-bold block mb-1.5">Audio Recording</label><audio src={selectedRecord.recording_url} controls className="w-full h-9 rounded" /></div>)}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setSelectedRecord(null)} className="px-4 py-2 border border-gray-300 text-xs font-bold text-gray-700 bg-white rounded-lg hover:bg-gray-100">Close details</button>
              <button onClick={() => { const rec = selectedRecord; setSelectedRecord(null); handleDirectCall(rec); }} disabled={!selectedRecord.mobile}
                className="px-4 py-2 bg-[#FB641B] hover:bg-[#e4540d] text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5 disabled:opacity-40">
                <span className="material-symbols-outlined text-[15px]">call</span>Redial Lead
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WctCallHistory;
