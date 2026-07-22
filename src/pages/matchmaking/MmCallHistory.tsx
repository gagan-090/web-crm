import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMmCallHistoryQuery, type MmCallHistoryRow } from '../../services/api/webCrmApi';
import {
  MM_DRIVER_CONNECTED_OPTIONS,
  MM_GREENLINE_CONNECTED_OPTIONS,
  MM_TRANSPORTER_CONNECTED_OPTIONS,
} from '../../shared/components/cti/PostCallDispositionModal';

// ── Matchmaking Call History ────────────────────────────────────────────────
//
// Straight read of call_history_ivr for the signed-in agent (the single source
// of truth for every Web CRM call), joined to the job it was tagged with and
// the transporter that job belongs to. No mobile numbers are shown — the CTI
// dials from the record.

const PER_PAGE = 25;

const PERIODS = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'this_week', label: 'This week' },
  { value: 'this_month', label: 'This month' },
  { value: 'last_month', label: 'Last month' },
  { value: 'all', label: 'All time' },
  { value: 'custom', label: 'Custom range…' },
];

// Dispositions are stored as machine keys (tr_confirmed_job). Agents must see
// the same wording the disposition modal offered, so the canonical option lists
// are reused as the lookup and anything unmapped is title-cased rather than
// shown raw.
const DISPOSITION_LABELS: Record<string, string> = Object.fromEntries(
  [...MM_DRIVER_CONNECTED_OPTIONS, ...MM_GREENLINE_CONNECTED_OPTIONS, ...MM_TRANSPORTER_CONNECTED_OPTIONS]
    .map(o => [o.value, o.label]),
);

const humanize = (value: string | null | undefined): string => {
  if (!value) return '—';
  if (DISPOSITION_LABELS[value]) return DISPOSITION_LABELS[value];
  // Already human (contains a space or is title-cased) → leave it alone.
  if (/\s/.test(value)) return value;
  return value
    .replace(/[_-]+/g, ' ')
    .replace(/\b\w/g, c => c.toUpperCase());
};

const STATUS_STYLES: Record<string, string> = {
  connected: 'bg-green-50 text-green-700 border-green-200',
  not_connected: 'bg-red-50 text-red-600 border-red-200',
  callback_later: 'bg-amber-50 text-amber-700 border-amber-200',
};

const statusLabel = (s: string | null) =>
  !s ? 'Pending' : s.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

const formatDuration = (seconds: number) => {
  if (!seconds) return '—';
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return m ? `${m}m ${s}s` : `${s}s`;
};

const MmCallHistory: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [period, setPeriod] = useState('all');
  const [callStatus, setCallStatus] = useState('');
  const [term, setTerm] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const t = setTimeout(() => { setSearch(term.trim()); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [term]);

  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data, isFetching, isError, refetch } = useGetMmCallHistoryQuery({
    page, per_page: PER_PAGE, period,
    call_status: callStatus || undefined,
    search: search || undefined,
    ...(period === 'custom' ? { date_from: dateFrom || undefined, date_to: dateTo || undefined } : {}),
  });

  const rows: MmCallHistoryRow[] = data?.data || [];
  const total = data?.pagination.total ?? 0;
  const lastPage = data?.pagination.last_page ?? 1;

  return (
    <main className="flex flex-col h-[calc(100vh-60px)] bg-gray-50 text-xs overflow-hidden">

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-3 shrink-0">
        <div className="flex-1 relative max-w-sm">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
          <input
            value={term}
            onChange={e => setTerm(e.target.value)}
            placeholder="Search lead name, TMID or job ID…"
            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#8E44AD]"
          />
        </div>

        <div className="flex gap-1.5">
          {[{ value: '', label: 'All' },
            { value: 'connected', label: 'Connected' },
            { value: 'not_connected', label: 'Not Connected' },
            { value: 'callback_later', label: 'Callback' }].map(opt => (
            <button
              key={opt.value}
              onClick={() => { setCallStatus(opt.value); setPage(1); }}
              className={`px-2.5 py-1 rounded-lg font-bold border text-[10px] transition-colors ${
                callStatus === opt.value ? 'bg-[#8E44AD] text-white border-[#8E44AD]' : 'bg-white text-gray-500 border-gray-200'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        <select
          value={period}
          onChange={e => { setPeriod(e.target.value); setPage(1); }}
          className="border border-gray-200 rounded-lg py-1.5 px-2 bg-white text-gray-700 font-bold text-[11px] outline-none"
        >
          {PERIODS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
        </select>

        {period === 'custom' && (
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={dateFrom}
              max={dateTo || undefined}
              onChange={e => { setDateFrom(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg py-1 px-2 text-[11px] font-semibold text-gray-700 outline-none"
            />
            <span className="text-gray-400">→</span>
            <input
              type="date"
              value={dateTo}
              min={dateFrom || undefined}
              onChange={e => { setDateTo(e.target.value); setPage(1); }}
              className="border border-gray-200 rounded-lg py-1 px-2 text-[11px] font-semibold text-gray-700 outline-none"
            />
          </div>
        )}

        <span className="text-gray-400 font-bold shrink-0 ml-auto">
          {isFetching ? 'Loading…' : `${total.toLocaleString()} calls`}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200 text-gray-400 font-bold uppercase text-[9px] sticky top-0 shadow-sm z-10">
              <th className="p-3 pl-4">Lead</th>
              <th className="p-3">Role</th>
              <th className="p-3">Job</th>
              <th className="p-3">Transporter</th>
              <th className="p-3">Outcome</th>
              <th className="p-3">Disposition</th>
              <th className="p-3">Match</th>
              <th className="p-3 text-center">Duration</th>
              <th className="p-3">Recording</th>
              <th className="p-3">Process</th>
              <th className="p-3 text-right pr-4">Called At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {rows.map(r => (
              <tr key={r.id} className="hover:bg-white transition-colors">
                <td className="p-3 pl-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-800">{r.lead_name || '—'}</span>
                    {r.lead_tmid && <span className="font-mono text-[10px] text-gray-400">{r.lead_tmid}</span>}
                  </div>
                </td>
                <td className="p-3 capitalize font-semibold text-gray-600">{r.lead_role || '—'}</td>
                <td className="p-3">
                  {r.job_id ? (
                    <button
                      onClick={() => navigate('/mm/mm-job-detail', { state: { jobId: r.job_id } })}
                      className="font-mono font-bold text-[#8E44AD] hover:underline"
                      title={r.job_title || undefined}
                    >
                      {r.job_id}
                    </button>
                  ) : <span className="text-gray-300">—</span>}
                </td>
                <td className="p-3 font-semibold text-gray-700">{r.transporter_name || '—'}</td>
                <td className="p-3">
                  <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                    STATUS_STYLES[r.call_status || ''] || 'bg-gray-100 text-gray-500 border-gray-200'
                  }`}>
                    {statusLabel(r.call_status)}
                  </span>
                </td>
                <td className="p-3 max-w-[220px]">
                  <span className="block truncate font-semibold text-gray-700" title={humanize(r.disposition_sub) || undefined}>
                    {humanize(r.disposition_sub || r.feedback)}
                  </span>
                  {r.feedback && r.disposition_sub && (
                    <span className="block truncate text-[10px] text-gray-400" title={r.feedback}>{r.feedback}</span>
                  )}
                  {r.remarks && (
                    <span className="block truncate text-[10px] text-gray-400" title={r.remarks}>{r.remarks}</span>
                  )}
                </td>
                <td className="p-3">
                  {r.match_status ? (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-indigo-50 text-indigo-700">
                      {humanize(r.match_status)}
                    </span>
                  ) : <span className="text-gray-300">—</span>}
                </td>
                <td className="p-3 text-center font-mono text-gray-600">
                  {formatDuration(r.bill_duration ? Number(r.bill_duration) : r.duration_seconds)}
                </td>
                <td className="p-3">
                  {r.recording_url ? (
                    <audio src={r.recording_url} controls preload="none" className="h-7 max-w-[170px]" />
                  ) : (
                    <span className="text-gray-300 italic">No recording</span>
                  )}
                </td>
                <td className="p-3">
                  <span className="text-[10px] text-gray-500 font-semibold">{r.process || '—'}</span>
                  {r.direction && (
                    <span className="block text-[9px] text-gray-400 uppercase">{r.direction}</span>
                  )}
                </td>
                <td className="p-3 text-right pr-4 font-mono text-gray-500 whitespace-nowrap">
                  {new Date(r.called_at).toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit',
                  })}
                </td>
              </tr>
            ))}
            {rows.length === 0 && (
              <tr>
                <td colSpan={11} className="p-10 text-center text-gray-400 italic">
                  {isFetching ? 'Loading call history…'
                    : isError ? 'Could not load call history.'
                    : 'No calls match these filters.'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {isError && (
          <div className="text-center py-3">
            <button onClick={refetch} className="px-4 py-1.5 border border-[#8E44AD] text-[#8E44AD] rounded-lg font-bold">Retry</button>
          </div>
        )}
      </div>

      {/* Pagination */}
      {total > 0 && (
        <div className="p-3 px-4 border-t border-gray-200 bg-white flex justify-between items-center shrink-0 text-gray-500 font-bold">
          <span>Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total.toLocaleString()}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page <= 1 || isFetching}
              className="px-3 py-1 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              Previous
            </button>
            <span className="font-mono">Page {page} / {lastPage}</span>
            <button
              onClick={() => setPage(p => Math.min(lastPage, p + 1))}
              disabled={page >= lastPage || isFetching}
              className="px-3 py-1 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </main>
  );
};

export default MmCallHistory;
