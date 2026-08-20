import React, { useEffect, useState } from 'react';
import {
  useGetPlacementReportQuery,
  type PlacementRow,
} from '../../services/api/webCrmApi';

// ── Interview Done · Placed Drivers ─────────────────────────────────────────
//
// A read of call_history_ivr, which is the single source of truth for a
// placement: there is no placements table in this schema, so a placement is a
// call an agent dispositioned as one. The backend matches the outcome text in
// call_feedback, call_remarks AND disposition_sub — agents type "Matchmaking
// done" into remarks as often as they pick it from the form — and merges in the
// drivers the Driver Bank itself marks as placed. See PlacementReportController.
//
// Nothing here is derived client-side; the tab counts, the job manager list and
// the rows all come from that one endpoint so they cannot disagree.

const PER_PAGE = 25;

const TABS = [
  { value: 'interview_done' as const, label: 'Interview Done', icon: 'record_voice_over' },
  { value: 'placed' as const, label: 'Placed Drivers', icon: 'handshake' },
];

const MmPlacedDrivers: React.FC = () => {
  const [tab, setTab] = useState<'interview_done' | 'placed'>('interview_done');
  const [jobManager, setJobManager] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [term, setTerm] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => { setSearch(term.trim()); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [term]);

  const { data, isFetching, isError, refetch } = useGetPlacementReportQuery({
    tab,
    job_manager: jobManager || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    search: search || undefined,
    page,
    per_page: PER_PAGE,
  });

  const rows: PlacementRow[] = data?.rows || [];
  const counts = data?.counts;
  const total = data?.pagination.total ?? 0;
  const lastPage = data?.pagination.last_page ?? 1;

  // Held across refetches: RTK Query returns undefined data while a filtered
  // request is in flight, and an emptied dropdown would reset the chosen
  // manager mid-filter.
  const [managers, setManagers] = useState<{ id: number; name: string }[]>([]);
  useEffect(() => {
    if (data?.job_managers?.length) setManagers(data.job_managers);
  }, [data?.job_managers]);

  const hasFilters = !!(jobManager || dateFrom || dateTo || search);
  const clearFilters = () => {
    setJobManager(''); setDateFrom(''); setDateTo(''); setTerm(''); setSearch(''); setPage(1);
  };

  return (
    <main className="flex flex-col h-[calc(100vh-60px)] bg-gray-50 text-xs overflow-hidden">

      {/* Tabs */}
      <div className="bg-white border-b border-gray-200 px-4 pt-3 flex items-end gap-1 shrink-0">
        {TABS.map(t => {
          const active = tab === t.value;
          const count = counts ? counts[t.value] : undefined;
          return (
            <button
              key={t.value}
              onClick={() => { setTab(t.value); setPage(1); }}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-t-lg border border-b-0 font-bold text-[11px] transition-colors ${
                active
                  ? 'bg-[#8E44AD] text-white border-[#8E44AD]'
                  : 'bg-gray-50 text-gray-500 border-gray-200 hover:bg-gray-100'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{t.icon}</span>
              {t.label}
              {count !== undefined && (
                <span className={`px-1.5 py-0.5 rounded-full font-mono text-[10px] ${
                  active ? 'bg-white/25 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-4 py-2.5 flex items-center gap-3 shrink-0 flex-wrap">
        <div className="flex-1 relative min-w-[200px] max-w-sm">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
          <input
            value={term}
            onChange={e => setTerm(e.target.value)}
            placeholder="Search job ID, TMID or name…"
            className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg outline-none focus:ring-1 focus:ring-[#8E44AD]"
          />
        </div>

        <select
          value={jobManager}
          onChange={e => { setJobManager(e.target.value); setPage(1); }}
          title="Filter by job manager"
          className={`border rounded-lg py-1.5 px-2 font-bold text-[11px] outline-none max-w-[200px] ${
            jobManager ? 'bg-purple-50 border-[#8E44AD] text-[#8E44AD]' : 'border-gray-200 bg-white text-gray-700'
          }`}
        >
          <option value="">All Job Managers</option>
          {managers.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
        </select>

        <div className="flex items-center gap-1.5">
          <span className="material-symbols-outlined text-gray-400 text-[16px]">calendar_month</span>
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

        {hasFilters && (
          <button
            onClick={clearFilters}
            className="flex items-center gap-1 border border-rose-200 bg-rose-50 text-rose-600 rounded-lg py-1.5 px-2 font-bold text-[11px] hover:bg-rose-100 transition-colors"
            title="Clear all filters"
          >
            <span className="material-symbols-outlined text-[14px]">filter_list_off</span>
            Clear
          </button>
        )}

        <button
          onClick={() => refetch()}
          disabled={isFetching}
          title="Reload"
          className="flex items-center gap-1 border border-gray-200 bg-white text-gray-600 rounded-lg py-1.5 px-2 font-bold text-[11px] hover:bg-gray-50 transition-colors disabled:opacity-60"
        >
          <span className={`material-symbols-outlined text-[14px] ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
          Refresh
        </button>

        <span className="text-gray-400 font-bold shrink-0 ml-auto">
          {isFetching ? 'Loading…' : `${total.toLocaleString()} ${tab === 'placed' ? 'placements' : 'interviews'}`}
        </span>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200 text-gray-400 font-bold uppercase text-[9px] sticky top-0 shadow-sm z-10">
              <th className="p-3 pl-4">Job ID</th>
              <th className="p-3">Driver TMID</th>
              <th className="p-3">Driver Name</th>
              <th className="p-3">Transporter TMID</th>
              <th className="p-3">{tab === 'placed' ? 'Placed' : 'Interview'} Date &amp; Time</th>
              <th className="p-3 pr-4">Job Manager Name</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {rows.map(r => (
              <tr key={r.id} className="hover:bg-white transition-colors">
                <td className="p-3 pl-4">
                  {r.job_id ? (
                    <span className="font-mono font-bold text-[#8E44AD]" title={r.job_title || undefined}>
                      {r.job_id}
                    </span>
                  ) : (
                    <span className="text-gray-300" title="The call was dispositioned without a job tagged on it">—</span>
                  )}
                </td>
                <td className="p-3">
                  {r.driver_tmid ? (
                    <span className="font-mono text-[11px]">{r.driver_tmid}</span>
                  ) : (
                    <span
                      className="text-gray-300"
                      title="Filed on the transporter's call — no column on that row names the driver"
                    >
                      —
                    </span>
                  )}
                </td>
                <td className="p-3 font-semibold text-gray-800">
                  {r.driver_name || <span className="text-gray-300">—</span>}
                  {r.in_driver_bank && (
                    <span
                      className="ml-1.5 align-middle px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[9px] font-bold uppercase"
                      title="Also recorded in the Driver Bank"
                    >
                      Bank
                    </span>
                  )}
                </td>
                <td className="p-3 font-mono text-[11px]">
                  {r.transporter_tmid || <span className="text-gray-300 font-sans">—</span>}
                </td>
                <td className="p-3 whitespace-nowrap">
                  {r.placed_at_display}
                  {r.entries > 1 && (
                    <span className="ml-1.5 text-gray-400" title={`${r.entries} calls carried this outcome; the first one is shown`}>
                      ×{r.entries}
                    </span>
                  )}
                </td>
                <td className="p-3 pr-4 font-semibold">
                  {r.job_manager || <span className="text-gray-300">—</span>}
                  <span className="block text-[10px] font-normal text-gray-400" title={r.remarks || undefined}>
                    {r.outcome}
                  </span>
                </td>
              </tr>
            ))}

            {!isFetching && rows.length === 0 && (
              <tr>
                <td colSpan={6} className="p-10 text-center text-gray-400 italic">
                  {isError
                    ? 'Could not load the report.'
                    : hasFilters
                      ? 'No rows match these filters.'
                      : `No ${tab === 'placed' ? 'placements' : 'interviews'} recorded yet.`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
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

export default MmPlacedDrivers;
