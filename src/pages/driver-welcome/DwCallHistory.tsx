import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDwCallHistoryQuery } from '../../services/api/webCrmApi';

export const DwCallHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [selectedRecord, setSelectedRecord] = useState<any | null>(null);

  // Fetch call history from backend
  const { data: response, isLoading, isFetching } = useGetDwCallHistoryQuery({
    page: currentPage,
    search: searchQuery || undefined,
    per_page: 15
  });

  const records = response?.data || [];
  const pagination = response?.pagination || { total: 0, per_page: 15, current_page: 1, last_page: 1 };

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
      
      {/* Top Header & Search Bar */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">Call History</p>
          <h2 className="text-2xl font-bold text-gray-800">Completed Call Logs & Feedback</h2>
        </div>
        
        {/* Search input */}
        <div className="relative w-full md:w-80">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search by name, TM ID, mobile, status..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] outline-none transition-all"
          />
        </div>
      </section>

      {/* Main Content Area */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden animate-in fade-in duration-300">
        {isLoading || isFetching ? (
          <div className="p-16 text-center text-gray-500 font-semibold flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-4 border-t-[#27AE60] border-gray-200 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 mt-2">Retrieving call history...</p>
          </div>
        ) : records.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-6 py-4">Driver Details</th>
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
                {records.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-gray-900">{r.name}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-xs text-gray-400 font-medium">
                        <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">{r.tmid}</span>
                        <span>•</span>
                        <span>{r.mobile}</span>
                      </div>
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
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/45 backdrop-blur-sm transition-opacity" 
            onClick={() => setSelectedRecord(null)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 ease-out">
            {/* Header */}
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

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Section 1: Lead Information */}
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
                    <span className="text-sm font-bold text-gray-800">{selectedRecord.mobile || '—'}</span>
                  </div>
                  <div>
                    <label className="text-[10.5px] text-gray-400 font-bold block">Database User ID</label>
                    <span className="text-sm font-mono font-bold text-gray-800">{selectedRecord.user_id || '—'}</span>
                  </div>
                </div>
              </div>

              {/* Section 2: Call Disposition & Feedback */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Call Outcome & Feedback</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-150 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10.5px] text-gray-400 font-bold block">Call Status</label>
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide mt-1 ${getStatusBadgeClass(selectedRecord.call_status)}`}>
                        {selectedRecord.call_status?.replace('_', ' ') || '—'}
                      </span>
                    </div>
                    <div>
                      <label className="text-[10.5px] text-gray-400 font-bold block">Feedback Sub-Stage</label>
                      <span className="text-sm font-bold text-gray-800">{selectedRecord.call_feedback || '—'}</span>
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


              {/* Section 4: Call Quality & Recording */}
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

            {/* Footer Actions */}
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
