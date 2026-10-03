import React, { useEffect, useState } from 'react';
import { useGetMyConnectivitySlaQuery, type SlaRange } from '../../services/api/webCrmApi';
import { RulesBanner, fmtClock, fmtMins, fmtStamp, pctText, pctTone } from '../shared/slaUi';

/**
 * MY CONNECTIVITY SLA — the signed-in agent's side of framework Parameter 1.
 * Sits beside their revenue target on My Target: how many of the users
 * assigned to them were called inside 20 minutes, which clocks are running
 * right now (call these first) and who was never called at all.
 * Scoped server-side (ConnectivitySlaController@me) — an agent cannot read
 * anyone else's leads.
 */

const RANGES: Array<{ key: SlaRange; label: string }> = [
  { key: 'today', label: 'Today' },
  { key: '7d', label: 'Last 7 days' },
  { key: 'month', label: 'This month' },
];

const Tile: React.FC<{ label: string; value: React.ReactNode; tone?: string }> = ({ label, value, tone = 'text-gray-900' }) => (
  <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
    <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">{label}</div>
    <div className={`text-xl font-black mt-0.5 ${tone}`}>{value}</div>
  </div>
);

const MyConnectivitySla: React.FC = () => {
  const [range, setRange] = useState<SlaRange>('month');
  // Poll so a fresh registration lands in "running" without a manual refresh.
  const { data, isFetching } = useGetMyConnectivitySlaQuery({ range, status: 'all', per_page: 5 }, { pollingInterval: 30000 });

  // The server returns seconds_left as of the response; count it down locally.
  const [now, setNow] = useState(() => Date.now());
  const [arrival, setArrival] = useState(() => Date.now());
  useEffect(() => { setArrival(Date.now()); }, [data]);
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  if (!data) {
    return <div className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 text-sm text-gray-400 animate-pulse">Loading your connectivity SLA…</div>;
  }

  const d = data.data;
  const s = d.summary;
  const elapsed = (now - arrival) / 1000;

  return (
    <div className="mb-5 bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-600 text-[22px]">timer</span>
          <h2 className="text-base font-black text-gray-900">My Connectivity SLA</h2>
          {isFetching && <span className="material-symbols-outlined text-gray-300 text-[16px] animate-spin">progress_activity</span>}
        </div>
        <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
          {RANGES.map(r => (
            <button key={r.key} onClick={() => setRange(r.key)}
              className={`px-3 py-1 rounded-lg text-xs font-black transition-colors ${range === r.key ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
              {r.label}
            </button>
          ))}
        </div>
      </div>

      <RulesBanner rules={d.rules} />

      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3 mt-4">
        <Tile label="SLA compliance" value={pctText(s.compliance_pct)} tone={pctTone(s.compliance_pct)} />
        <Tile label="Assigned to me" value={s.registrations} />
        <Tile label="Called in time" value={s.met} tone="text-emerald-600" />
        <Tile label="Breached" value={s.breached} tone={s.breached ? 'text-rose-600' : 'text-gray-900'} />
        <Tile label="Clocks running" value={s.pending} tone="text-sky-600" />
        <Tile label="Avg first call" value={fmtMins(s.avg_tat_min)} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        {/* Running clocks */}
        <div className="rounded-xl border border-sky-100">
          <div className="px-3 py-2 border-b border-sky-100 bg-sky-50/60 rounded-t-xl flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-sky-800">Call these now</span>
            <span className="text-[10px] font-bold text-sky-700">{d.running.length} running</span>
          </div>
          {d.running.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-gray-400">No clocks running — every new registration assigned to you has been called.</div>
          ) : (
            <ul className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {d.running.map(r => {
                const left = (r.seconds_left ?? 0) - elapsed;
                const urgent = left < 300;
                return (
                  <li key={r.user_id} className="px-3 py-2 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <div className="text-xs font-bold text-gray-900 truncate">{r.name}</div>
                      <div className="text-[10px] text-gray-400">{r.type_label} · {r.tmid} · reg {fmtStamp(r.registered_at)}</div>
                    </div>
                    <span className={`font-mono text-sm font-black tabular-nums px-2 py-0.5 rounded-lg ${left <= 0 ? 'bg-rose-100 text-rose-700' : urgent ? 'bg-amber-100 text-amber-700' : 'bg-sky-100 text-sky-700'}`}>
                      {left <= 0 ? 'overdue' : fmtClock(left)}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Never called */}
        <div className="rounded-xl border border-rose-100">
          <div className="px-3 py-2 border-b border-rose-100 bg-rose-50/60 rounded-t-xl flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-rose-800">Overdue — never called</span>
            <span className="text-[10px] font-bold text-rose-700">{s.not_called} total</span>
          </div>
          {d.overdue.length === 0 ? (
            <div className="px-3 py-6 text-center text-xs text-gray-400">Nobody assigned to you is waiting for a first call.</div>
          ) : (
            <ul className="divide-y divide-gray-50 max-h-64 overflow-y-auto">
              {d.overdue.slice(0, 10).map(r => (
                <li key={r.user_id} className="px-3 py-2 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <div className="text-xs font-bold text-gray-900 truncate">{r.name}</div>
                    <div className="text-[10px] text-gray-400">{r.type_label} · {r.tmid} · reg {fmtStamp(r.registered_at)}</div>
                  </div>
                  <span className="text-[11px] font-black text-rose-600 whitespace-nowrap">{fmtMins(r.late_by_min)} overdue</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyConnectivitySla;
