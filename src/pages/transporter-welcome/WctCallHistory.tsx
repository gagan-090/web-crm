import React, { useState } from 'react';
import { useGetWctCallHistoryQuery } from '../../services/api/webCrmApi';

// WCT-08 · Call History — real transporter call log from call_history_ivr
// (via WctCallerController::callHistory). Mirrors the Driver Welcome screen,
// retargeted to the transporter welcome caller.
export const WctCallHistory: React.FC = () => {
  const [search, setSearch] = useState('');
  const [feedback, setFeedback] = useState('all');
  const [page, setPage] = useState(1);
  const [playingId, setPlayingId] = useState<number | null>(null);

  const { data, isLoading, isFetching } = useGetWctCallHistoryQuery({
    per_page: 20,
    page,
    search: search || undefined,
    feedback: feedback !== 'all' ? feedback : undefined,
  });

  const rows = data?.data || [];
  const feedbackOptions = data?.feedback_options || [];
  const pagination = data?.pagination;

  const statusChip = (status: string) => {
    const s = (status || '').toLowerCase();
    if (s === 'connected') return 'bg-[#EAFAF1] text-[#27AE60] border-[#27AE60]/20';
    if (s === 'callback_later') return 'bg-orange-50 text-[#FB641B] border-orange-200';
    return 'bg-red-50 text-red-600 border-red-200';
  };

  const fmtDuration = (secs: number) => {
    const s = Number(secs) || 0;
    return `${Math.floor(s / 60)}m ${s % 60}s`;
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-200 pb-3">
        <div>
          <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">Transporter Welcome</p>
          <h2 className="text-2xl font-bold text-gray-800">Call History</h2>
        </div>
        <div className="flex items-center gap-2">
          {/* Feedback filter (distinct call_feedback values) */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[16px] pointer-events-none">reviews</span>
            <select
              value={feedback}
              onChange={(e) => { setFeedback(e.target.value); setPage(1); }}
              className={`pl-8 pr-3 h-10 max-w-[220px] border rounded-lg text-sm font-semibold appearance-none outline-none focus:ring-1 focus:ring-[#FB641B] ${feedback !== 'all' ? 'bg-orange-50 border-orange-300 text-[#FB641B]' : 'bg-white border-gray-200 text-gray-700'}`}
            >
              <option value="all">All Feedbacks</option>
              {feedbackOptions.map((f) => (
                <option key={f} value={f}>{f}</option>
              ))}
            </select>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search name, TMID, mobile…"
              className="pl-8 pr-3 h-10 w-full sm:w-72 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#FB641B]"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider">
              <tr>
                <th className="text-left font-semibold px-4 py-3">Transporter</th>
                <th className="text-left font-semibold px-4 py-3">Mobile</th>
                <th className="text-left font-semibold px-4 py-3">Status</th>
                <th className="text-left font-semibold px-4 py-3">Feedback</th>
                <th className="text-left font-semibold px-4 py-3">Duration</th>
                <th className="text-left font-semibold px-4 py-3">When</th>
                <th className="text-left font-semibold px-4 py-3">Recording</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400 italic">Loading call history…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="px-4 py-10 text-center text-gray-400 italic">No calls logged yet.</td></tr>
              ) : (
                rows.map((c) => (
                  <tr key={c.id} className="hover:bg-gray-50/60">
                    <td className="px-4 py-3">
                      <div className="font-bold text-gray-900">{c.name || 'Transporter'}</div>
                      <div className="font-mono text-[10px] text-gray-400">{c.tmid}</div>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{c.mobile || '—'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-full border text-[10px] font-bold uppercase ${statusChip(c.call_status)}`}>
                        {c.call_status || 'pending'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600 max-w-[180px] truncate" title={c.call_feedback}>{c.call_feedback || '—'}</td>
                    <td className="px-4 py-3 text-gray-600">{fmtDuration(c.duration_secs)}</td>
                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">{c.date_display || c.created_at}</td>
                    <td className="px-4 py-3">
                      {c.recording_url ? (
                        playingId === c.id ? (
                          <div className="flex items-center gap-2">
                            <audio src={c.recording_url} autoPlay controls className="h-8 max-w-[160px]" />
                            <button
                              onClick={() => setPlayingId(null)}
                              className="text-gray-400 hover:text-red-500"
                              title="Close player"
                            >
                              <span className="material-symbols-outlined text-lg">close</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setPlayingId(c.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#FB641B] hover:text-[#e0550f]"
                          >
                            <span className="material-symbols-outlined text-lg">play_circle</span>
                            <span>Listen</span>
                          </button>
                        )
                      ) : (
                        <span className="text-gray-300 italic text-[11px]">No recording</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-3 border-t border-gray-100 text-xs text-gray-500">
            <span>
              Page {pagination.current_page} of {pagination.last_page} · {pagination.total} calls
            </span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1 || isFetching}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 border border-gray-200 rounded-lg font-semibold disabled:opacity-40 hover:bg-gray-50"
              >
                Prev
              </button>
              <button
                disabled={page >= pagination.last_page || isFetching}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 border border-gray-200 rounded-lg font-semibold disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default WctCallHistory;
