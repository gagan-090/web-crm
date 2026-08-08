import React, { useMemo, useState } from 'react';
import { useGetMmSubscriptionsQuery } from '../../services/api/webCrmApi';

// ── MM · My Subscriptions ────────────────────────────────────────────────────
//
// The agent's own subscription book — every payment credited to them in
// `collection_by` (the same table the incentive engine reads). Summary tiles,
// the premium / super-premium job split, the plan breakdown, the 6-month trend
// and the ledger are all live rows; nothing is derived or seeded.

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

const PERIODS = [
  { value: 'today',      label: 'Today' },
  { value: 'yesterday',  label: 'Yesterday' },
  { value: 'this_week',  label: 'This Week' },
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'all',        label: 'All Time' },
] as const;

const planTone = (key: string): string => {
  if (key === 'super_premium_job') return 'bg-purple-100 text-purple-700';
  if (key === 'premium_job')       return 'bg-amber-100 text-amber-700';
  if (key === 'standard')          return 'bg-blue-100 text-blue-700';
  if (key === 'trusted')           return 'bg-violet-100 text-violet-700';
  if (key === 'verified')          return 'bg-sky-100 text-sky-700';
  if (key === 'job_ready')         return 'bg-emerald-100 text-emerald-700';
  return 'bg-gray-100 text-gray-600';
};

// Shared across desks — DWC / TWC / MM each render this with their own API base.
export const MmSubscriptions: React.FC<{ basePath?: string }> = ({ basePath }) => {
  const [period, setPeriod] = useState<string>('today');
  const [type, setType] = useState<string>('all');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [page, setPage] = useState(1);

  React.useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);
  React.useEffect(() => { setPage(1); }, [period, type, debounced]);

  const { data, isFetching, isError, refetch } = useGetMmSubscriptionsQuery({
    base: basePath, period, type, search: debounced || undefined, page, per_page: 25,
  });

  const d = data?.data;
  const summary = d?.summary;
  const rows = d?.rows ?? [];
  const breakdown = useMemo(() => d?.breakdown ?? [], [d]);
  const trend = d?.trend ?? [];
  const trendMax = Math.max(1, ...trend.map(t => t.amount));
  const pagination = d?.pagination;

  const tiles = summary ? [
    { label: 'Total Collected', value: inr(summary.total_amount), sub: `${summary.total_count} subscriptions`, cls: 'text-[#8E44AD]', bg: 'bg-purple-50' },
    { label: 'Premium Jobs', value: `${summary.premium_jobs.count}`, sub: inr(summary.premium_jobs.amount), cls: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Super Premium Jobs', value: `${summary.super_premium_jobs.count}`, sub: inr(summary.super_premium_jobs.amount), cls: 'text-purple-700', bg: 'bg-purple-50' },
    { label: 'Transporter Subs', value: `${summary.transporter_subs.count}`, sub: inr(summary.transporter_subs.amount), cls: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Driver Subs', value: `${summary.driver_subs.count}`, sub: inr(summary.driver_subs.amount), cls: 'text-emerald-600', bg: 'bg-emerald-50' },
  ] : [];

  return (
    <main className="flex flex-col h-[calc(100vh-60px)] bg-gray-50 overflow-hidden text-xs">
      {/* Header */}
      <div className="px-5 py-3 bg-white border-b border-gray-200 shrink-0 flex items-center gap-4 flex-wrap">
        <div>
          <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">My Subscriptions</h1>
          <p className="text-[10px] text-gray-400">Every payment collected in your name — plans, amounts and job postings</p>
        </div>

        <div className="ml-auto flex items-center gap-2">
          <div className="flex gap-0.5 p-0.5 bg-gray-100 rounded-lg">
            {PERIODS.map(p => (
              <button
                key={p.value}
                onClick={() => setPeriod(p.value)}
                className={`px-3 py-1 rounded-md text-[11px] font-bold transition-colors ${
                  period === p.value ? 'bg-white text-[#8E44AD] shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Customer, TMID, mobile, payment id…"
              className="pl-7 pr-2 py-1.5 w-56 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#8E44AD] bg-white"
            />
          </div>
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-white border border-gray-200 hover:border-[#8E44AD] text-gray-700 px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-sm ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
            Sync
          </button>
        </div>
      </div>

      {isError ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
          <span className="material-symbols-outlined text-4xl text-red-300">error</span>
          <p className="text-sm font-semibold">Could not load your subscriptions</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-[#8E44AD] hover:underline">Retry</button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto p-5 space-y-5 custom-scrollbar">
          {/* Summary tiles */}
          <section className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {(summary ? tiles : Array.from({ length: 5 })).map((tile: any, i) => (
              <div key={i} className={`rounded-xl border border-gray-200 p-4 ${tile?.bg ?? 'bg-white'} ${!summary ? 'animate-pulse h-[86px]' : ''}`}>
                {tile && (
                  <>
                    <p className="text-[10px] font-bold text-gray-400 uppercase">{tile.label}</p>
                    <p className={`text-2xl font-extrabold mt-1 ${tile.cls}`}>{tile.value}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-semibold">{tile.sub}</p>
                  </>
                )}
              </div>
            ))}
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Plan breakdown */}
            <section className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-extrabold text-gray-700 uppercase tracking-wider text-[11px]">Breakdown by Plan</h3>
                <span className="text-[10px] text-gray-400">Tap a plan to filter the ledger</span>
              </div>
              <div className="p-3 space-y-2">
                {breakdown.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic text-center py-6">No subscriptions in this period.</p>
                ) : (
                  <>
                    <button
                      onClick={() => setType('all')}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-[11px] font-bold border ${
                        type === 'all' ? 'border-[#8E44AD] bg-purple-50 text-[#8E44AD]' : 'border-gray-100 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      <span>All plans</span>
                      <span>{summary?.total_count ?? 0} · {inr(summary?.total_amount ?? 0)}</span>
                    </button>
                    {breakdown.map(b => {
                      const share = (summary?.total_amount ?? 0) > 0 ? (b.amount / (summary!.total_amount)) * 100 : 0;
                      return (
                        <button
                          key={b.key}
                          onClick={() => setType(b.key)}
                          className={`w-full text-left px-3 py-2 rounded-lg border transition-colors ${
                            type === b.key ? 'border-[#8E44AD] bg-purple-50' : 'border-gray-100 hover:bg-gray-50'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <span className="flex items-center gap-2 min-w-0">
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${planTone(b.key)}`}>{b.label}</span>
                              {b.for && <span className="text-[9px] text-gray-400">{b.for}</span>}
                            </span>
                            <span className="text-[11px] font-bold text-gray-700 shrink-0">
                              {b.count} × · {inr(b.amount)}
                              {b.refunded_count > 0 && <span className="text-red-500 ml-1">({b.refunded_count} refunded)</span>}
                            </span>
                          </div>
                          <div className="mt-1.5 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full bg-[#8E44AD]" style={{ width: `${share}%` }} />
                          </div>
                        </button>
                      );
                    })}
                  </>
                )}
              </div>
            </section>

            {/* 6-month trend */}
            <section className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="px-4 py-3 border-b border-gray-100">
                <h3 className="font-extrabold text-gray-700 uppercase tracking-wider text-[11px]">Last 6 Months</h3>
              </div>
              <div className="p-4 space-y-2.5">
                {trend.map(t => (
                  <div key={t.month} className="flex items-center gap-2">
                    <span className="w-16 text-[10px] text-gray-500 font-semibold shrink-0">{t.month}</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full rounded-full bg-emerald-500" style={{ width: `${(t.amount / trendMax) * 100}%` }} />
                    </div>
                    <span className="w-16 text-right text-[10px] font-mono font-bold text-gray-700 shrink-0">{inr(t.amount)}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Ledger */}
          <section className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between">
              <h3 className="font-extrabold text-gray-700 uppercase tracking-wider text-[11px]">
                Subscription Ledger
                {type !== 'all' && <span className="ml-2 text-[10px] font-bold text-[#8E44AD]">· filtered</span>}
              </h3>
              <span className="text-[10px] text-gray-400">{pagination?.total ?? 0} records</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[9px] uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    <th className="px-4 py-2 font-bold">Date</th>
                    <th className="px-4 py-2 font-bold">Customer</th>
                    <th className="px-4 py-2 font-bold">Plan</th>
                    <th className="px-4 py-2 font-bold">Source</th>
                    <th className="px-4 py-2 font-bold text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {isFetching && rows.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400">Loading…</td></tr>
                  ) : rows.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 italic">No subscriptions match your filters.</td></tr>
                  ) : rows.map(r => (
                    <tr key={r.id} className={`hover:bg-gray-50/60 ${r.is_refunded ? 'opacity-60' : ''}`}>
                      <td className="px-4 py-2.5 text-[11px] text-gray-500 whitespace-nowrap">{r.date}</td>
                      <td className="px-4 py-2.5">
                        <div className="font-bold text-gray-800 text-[12px]">{r.customer_name}</div>
                        <div className="text-[10px] text-gray-400 font-mono">{r.tmid || '—'}{r.customer_mobile ? ` · ${r.customer_mobile}` : ''}</div>
                      </td>
                      <td className="px-4 py-2.5">
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${planTone(r.plan_key)}`}>{r.plan_label}</span>
                        {r.job_id && <div className="text-[9px] text-black font-bold mt-0.5 font-mono">job {r.job_id}</div>}
                      </td>
                      <td className="px-4 py-2.5">
                        <span className="text-[10px] font-semibold text-gray-500 capitalize">{r.source}</span>
                        {r.is_refunded && <span className="ml-1 text-[9px] font-bold text-red-500 uppercase">refunded</span>}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono font-bold text-gray-800 whitespace-nowrap">{inr(r.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pagination && pagination.last_page > 1 && (
              <div className="px-4 py-2.5 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">Page {pagination.current_page} of {pagination.last_page}</span>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page <= 1 || isFetching}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                    disabled={page >= pagination.last_page || isFetching}
                    className="px-3 py-1 border border-gray-200 rounded-lg text-[11px] font-bold text-gray-600 disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </section>
        </div>
      )}
    </main>
  );
};

export default MmSubscriptions;
