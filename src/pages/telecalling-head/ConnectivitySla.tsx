import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import {
  useGetConnectivitySlaQuery,
  type SlaAgentRow,
  type SlaRange,
  type SlaTally,
} from '../../services/api/webCrmApi';
import { PageCardSkeleton } from '../../components/PageSkeleton';
import { ConnText, RulesBanner, StatusChip, fmtMins, fmtStamp, pctText, pctTone } from '../shared/slaUi';

/**
 * CONNECTIVITY SLA — framework Parameter 1, the head's board.
 *
 * Every registered user must get a first calling attempt within 20 minutes
 * (Mon–Sat, 09:30–18:00; after-hours sign-ups start at the next working day's
 * opening). Everything here is derived server-side by ConnectivitySla from
 * users.Created_at + call_history_ivr — per user type, per agent (with the
 * revenue they collected in the same window: Parameter 2) and per registration.
 */

const inr = (n: number) => '₹' + Math.round(n || 0).toLocaleString('en-IN');

const RANGES: Array<{ key: SlaRange; label: string }> = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: '7d', label: 'Last 7 days' },
  { key: 'month', label: 'This month' },
  { key: 'custom', label: 'Custom' },
];

const STATUS_TABS: Array<{ key: string; label: string }> = [
  { key: 'breached', label: 'Breached' },
  { key: 'not_called', label: 'Not called' },
  { key: 'late', label: 'Late' },
  { key: 'pending', label: 'Running' },
  { key: 'met', label: 'Met' },
  { key: 'all', label: 'All' },
];

const Stat: React.FC<{ label: string; value: React.ReactNode; sub?: string; tone?: string; icon: string }> = ({ label, value, sub, tone = 'text-gray-900', icon }) => (
  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
    <div className="flex items-center justify-between">
      <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">{label}</span>
      <span className="material-symbols-outlined text-[18px] text-gray-300">{icon}</span>
    </div>
    <div className={`mt-1.5 text-3xl font-black ${tone}`}>{value}</div>
    {sub && <div className="text-[11px] text-gray-500 mt-0.5">{sub}</div>}
  </div>
);

const TallyCells: React.FC<{ t: SlaTally }> = ({ t }) => (
  <>
    <td className="py-2.5 px-3 text-right text-xs font-bold text-gray-700">{t.registrations}</td>
    <td className="py-2.5 px-3 text-right text-xs font-bold text-emerald-700">{t.met}</td>
    <td className="py-2.5 px-3 text-right text-xs font-bold text-rose-700">{t.breached}</td>
    <td className="py-2.5 px-3 text-right text-xs font-bold text-sky-700">{t.pending}</td>
    <td className={`py-2.5 px-3 text-right text-sm font-black ${pctTone(t.compliance_pct)}`}>{pctText(t.compliance_pct)}</td>
    <td className="py-2.5 px-3 text-right text-xs text-gray-600 whitespace-nowrap">{fmtMins(t.avg_tat_min)}</td>
    <td className="py-2.5 px-3 text-right text-xs text-gray-600">{pctText(t.connect_rate_pct)}</td>
  </>
);

const THead: React.FC<{ first: string; extra?: string }> = ({ first, extra }) => (
  <thead>
    <tr className="text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-gray-100">
      <th className="py-2 px-3 text-left">{first}</th>
      <th className="py-2 px-3 text-right">Registered</th>
      <th className="py-2 px-3 text-right">Met</th>
      <th className="py-2 px-3 text-right">Breached</th>
      <th className="py-2 px-3 text-right">Running</th>
      <th className="py-2 px-3 text-right">SLA %</th>
      <th className="py-2 px-3 text-right">Avg 1st call</th>
      <th className="py-2 px-3 text-right">Connected</th>
      {extra && <th className="py-2 px-3 text-right">{extra}</th>}
    </tr>
  </thead>
);

const ConnectivitySla: React.FC = () => {
  const [range, setRange] = useState<SlaRange>('7d');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [role, setRole] = useState('');
  const [agentId, setAgentId] = useState('');
  const [status, setStatus] = useState('breached');
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [agentOpts, setAgentOpts] = useState<Array<{ id: number | string; name: string }>>([]);

  // Debounce the search box so typing does not fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput.trim()); setPage(1); }, 400);
    return () => clearTimeout(t);
  }, [searchInput]);

  const customReady = range !== 'custom' || (from && to);
  const { data, isFetching, isLoading, isError } = useGetConnectivitySlaQuery(
    {
      range,
      ...(range === 'custom' ? { from, to } : {}),
      ...(role ? { role } : {}),
      ...(agentId ? { agent_id: agentId } : {}),
      status, ...(search ? { search } : {}), page, per_page: 25,
    },
    { skip: !customReady, pollingInterval: range === 'today' ? 60000 : 0 },
  );

  const d = data?.data;

  // Remember the roster from the unfiltered view so the agent picker survives
  // drilling into one agent (by_agent then only holds that agent).
  useEffect(() => {
    if (d && !role && !agentId) {
      setAgentOpts(d.by_agent.filter(a => a.agent_id).map(a => ({ id: a.agent_id as number, name: a.name })));
    }
  }, [d, role, agentId]);

  const resetPaging = () => setPage(1);
  const anyFilter = !!(role || agentId || search || status !== 'breached');
  const clearFilters = () => { setRole(''); setAgentId(''); setSearchInput(''); setSearch(''); setStatus('breached'); setPage(1); };

  const trend = useMemo(() => (d?.daily || []).map(x => ({ ...x, label: x.date.slice(5) })), [d]);
  const reasonMax = Math.max(1, ...(d?.reasons || []).map(r => r.count));

  if (isLoading && customReady) return <PageCardSkeleton cards={6} title="Connectivity SLA" />;

  const s = d?.summary;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[26px]">timer</span>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">Connectivity SLA</h1>
            {isFetching && <span className="material-symbols-outlined text-gray-300 text-[18px] animate-spin">progress_activity</span>}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Was every new registration called on time? Measured from registration to the agent's first dial.
          </p>
        </div>
        <Link to="/th/revenue-challenge" className="h-10 px-4 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 text-sm font-black flex items-center gap-1.5 shadow-sm">
          <span className="material-symbols-outlined text-[18px]">rocket_launch</span> Revenue targets
        </Link>
      </div>

      {d && <RulesBanner rules={d.rules} />}

      {/* ── Window + filters ── */}
      <div className="flex flex-wrap items-center gap-3 my-4">
        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 shadow-xs">
          {RANGES.map(r => (
            <button key={r.key} onClick={() => { setRange(r.key); resetPaging(); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${range === r.key ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
              {r.label}
            </button>
          ))}
        </div>
        {range === 'custom' && (
          <div className="flex items-center gap-2 text-xs">
            <input type="date" value={from} max={to || undefined} onChange={e => { setFrom(e.target.value); resetPaging(); }} className="h-9 px-2 rounded-lg border border-gray-200 bg-white" />
            <span className="text-gray-400">to</span>
            <input type="date" value={to} min={from || undefined} onChange={e => { setTo(e.target.value); resetPaging(); }} className="h-9 px-2 rounded-lg border border-gray-200 bg-white" />
          </div>
        )}
        <select value={role} onChange={e => { setRole(e.target.value); resetPaging(); }} className="h-9 px-2 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-700">
          <option value="">All user types</option>
          {(d?.by_type || []).map(t => <option key={t.key} value={t.key}>{t.label}</option>)}
        </select>
        <select value={agentId} onChange={e => { setAgentId(e.target.value); resetPaging(); }} className="h-9 px-2 rounded-lg border border-gray-200 bg-white text-xs font-bold text-gray-700">
          <option value="">All agents</option>
          <option value="unassigned">Unassigned</option>
          {agentOpts.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
        </select>
        {d && <span className="text-[11px] text-gray-400">{d.window.from} → {d.window.to}</span>}
      </div>

      {!customReady && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">Pick a start and end date to see this window.</div>
      )}
      {isError && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">Could not load the SLA report. Try again in a moment.</div>
      )}

      {d && s && (
        <>
          {s.unassigned > 0 && (
            <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-[18px]">person_off</span>
              <span><b>{s.unassigned}</b> registration{s.unassigned === 1 ? ' has' : 's have'} no assigned agent — nobody owns their SLA.</span>
              <button onClick={() => { setAgentId('unassigned'); setStatus('all'); resetPaging(); }} className="ml-auto font-black underline">Show them</button>
            </div>
          )}

          {/* ── KPIs ── */}
          <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-4">
            <Stat icon="verified" label="SLA compliance" value={pctText(s.compliance_pct)} tone={pctTone(s.compliance_pct)}
              sub={s.due ? `${s.met} of ${s.due} due users called in ${d.rules.sla_minutes} min` : 'Nothing due in this window'} />
            <Stat icon="check_circle" label="SLA met" value={s.met} tone="text-emerald-600" sub={`of ${s.registrations} registered`} />
            <Stat icon="alarm_off" label="Breached" value={s.breached} tone={s.breached ? 'text-rose-600' : 'text-gray-900'}
              sub={`${s.late} late · ${s.not_called} never called`} />
            <Stat icon="timer" label="Clocks running" value={s.pending} tone="text-sky-600" sub="Deadline still ahead" />
            <Stat icon="hourglass_top" label="Avg first call" value={fmtMins(s.avg_tat_min)} sub="Clock start → first dial" />
            <Stat icon="call" label="Connect rate" value={pctText(s.connect_rate_pct)} sub={`${s.connected} of ${s.attempted} dialled users reached`} />
          </div>

          {/* ── Trend + reasons ── */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-4">
            <div className="xl:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-2">Registrations by day — SLA outcome</h3>
              {trend.length === 0 ? (
                <div className="h-56 flex items-center justify-center text-sm text-gray-400">No registrations in this window.</div>
              ) : (
                <div className="h-56">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={trend} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef0f4" />
                      <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} allowDecimals={false} />
                      <Tooltip cursor={{ fill: 'rgba(99,102,241,0.06)' }} contentStyle={{ borderRadius: 10, fontSize: 11 }} />
                      <Bar dataKey="met" name="Met" stackId="a" fill="#10b981" />
                      <Bar dataKey="breached" name="Breached" stackId="a" fill="#f43f5e" />
                      <Bar dataKey="pending" name="Running" stackId="a" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>

            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-3">Why users are not connected</h3>
              {d.reasons.length === 0 ? (
                <div className="text-sm text-gray-400 py-8 text-center">Nothing to explain in this window.</div>
              ) : (
                <div className="space-y-2.5">
                  {d.reasons.map(r => (
                    <div key={r.key}>
                      <div className="flex justify-between text-[11px] mb-0.5">
                        <span className="font-bold text-gray-700">{r.label}</span>
                        <span className="font-black text-gray-900">{r.count}</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
                        <div className={`h-full rounded-full ${r.key === 'not_attempted' ? 'bg-rose-400' : 'bg-indigo-500'}`} style={{ width: `${Math.max(3, (r.count / reasonMax) * 100)}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── By user type ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4 overflow-x-auto">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-1">By user type</h3>
            <table className="w-full min-w-[720px]">
              <THead first="User type" />
              <tbody className="divide-y divide-gray-50">
                {d.by_type.map(t => (
                  <tr key={t.key} onClick={() => { setRole(role === t.key ? '' : t.key); resetPaging(); }}
                    className={`cursor-pointer hover:bg-slate-50/70 ${role === t.key ? 'bg-indigo-50/60' : ''}`}>
                    <td className="py-2.5 px-3 text-xs font-bold text-gray-900">{t.label}</td>
                    <TallyCells t={t} />
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── By agent — SLA beside revenue (both framework parameters) ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 mb-4 overflow-x-auto">
            <div className="flex items-center justify-between mb-1">
              <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-500">By agent — connectivity and revenue</h3>
              <span className="text-[10px] text-gray-400">Weakest SLA first · click a row to drill in</span>
            </div>
            <table className="w-full min-w-[840px]">
              <THead first="Agent" extra="Revenue" />
              <tbody className="divide-y divide-gray-50">
                {d.by_agent.length === 0 && (
                  <tr><td colSpan={9} className="py-8 text-center text-sm text-gray-400">No registrations in this window.</td></tr>
                )}
                {d.by_agent.map((a: SlaAgentRow) => (
                  <tr key={a.agent_id ?? 'none'} onClick={() => { setAgentId(a.agent_id ? String(a.agent_id) : 'unassigned'); setStatus('all'); resetPaging(); }}
                    className={`cursor-pointer hover:bg-slate-50/70 ${String(a.agent_id ?? 'unassigned') === agentId ? 'bg-indigo-50/60' : ''}`}>
                    <td className="py-2.5 px-3">
                      <div className="text-xs font-bold text-gray-900">{a.name}</div>
                      {a.desk && <div className="text-[10px] text-gray-400">{a.desk}</div>}
                    </td>
                    <TallyCells t={a} />
                    <td className="py-2.5 px-3 text-right text-xs font-black text-gray-900 whitespace-nowrap">{a.agent_id ? inr(a.revenue) : '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* ── Registration detail ── */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-1 bg-gray-50 border border-gray-200 rounded-xl p-1">
                {STATUS_TABS.map(t => (
                  <button key={t.key} onClick={() => { setStatus(t.key); resetPaging(); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors ${status === t.key ? 'bg-white text-indigo-700 shadow-sm' : 'text-gray-500 hover:text-gray-800'}`}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search name or TMID"
                  className="h-9 w-56 px-3 rounded-lg border border-gray-200 text-xs" />
                {anyFilter && <button onClick={clearFilters} className="text-xs font-black text-indigo-600 hover:underline">Clear filters</button>}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1080px]">
                <thead>
                  <tr className="text-[10px] font-black uppercase tracking-wider text-gray-400 border-b border-gray-100">
                    <th className="py-2 px-3 text-left">User</th>
                    <th className="py-2 px-3 text-left">Assigned agent</th>
                    <th className="py-2 px-3 text-left">Registered</th>
                    <th className="py-2 px-3 text-left">Due by</th>
                    <th className="py-2 px-3 text-left">First attempt</th>
                    <th className="py-2 px-3 text-right">Attempts</th>
                    <th className="py-2 px-3 text-left">Connectivity</th>
                    <th className="py-2 px-3 text-left">Reason</th>
                    <th className="py-2 px-3 text-left">SLA</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {d.list.data.length === 0 && (
                    <tr><td colSpan={9} className="py-10 text-center text-sm text-gray-400">No registrations match these filters.</td></tr>
                  )}
                  {d.list.data.map(r => (
                    <tr key={r.user_id} className="hover:bg-slate-50/70">
                      <td className="py-2.5 px-3">
                        <div className="text-xs font-bold text-gray-900">{r.name}</div>
                        <div className="text-[10px] text-gray-400">{r.tmid} · {r.type_label}</div>
                      </td>
                      <td className="py-2.5 px-3 text-xs text-gray-700">{r.assigned_name || <span className="text-amber-600 font-bold">Unassigned</span>}</td>
                      <td className="py-2.5 px-3 text-xs text-gray-600 whitespace-nowrap">
                        {fmtStamp(r.registered_at)}
                        {r.after_hours && <span title="Registered outside working hours — clock starts at the next working day's opening" className="ml-1 text-[9px] font-black uppercase text-violet-600">after hrs</span>}
                      </td>
                      <td className="py-2.5 px-3 text-xs text-gray-600 whitespace-nowrap">{fmtStamp(r.deadline)}</td>
                      <td className="py-2.5 px-3 text-xs text-gray-600 whitespace-nowrap">
                        {r.first_attempt_at ? (
                          <>
                            {fmtStamp(r.first_attempt_at)}
                            <div className="text-[10px] text-gray-400">
                              {r.first_attempt_by ? `by ${r.first_attempt_by}` : ''}{r.sla_status === 'late' && r.late_by_min ? ` · ${fmtMins(r.late_by_min)} late` : ''}
                            </div>
                          </>
                        ) : r.sla_status === 'not_called' ? (
                          <span className="text-rose-600 font-bold">{fmtMins(r.late_by_min)} overdue</span>
                        ) : '—'}
                      </td>
                      <td className="py-2.5 px-3 text-right text-xs font-bold text-gray-700">{r.attempts}</td>
                      <td className="py-2.5 px-3"><ConnText c={r.connectivity} /></td>
                      <td className="py-2.5 px-3 text-[11px] text-gray-500">{r.reason_label || '—'}</td>
                      <td className="py-2.5 px-3"><StatusChip status={r.sla_status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between mt-3 text-xs text-gray-500">
              <span>{d.list.total} registration{d.list.total === 1 ? '' : 's'}</span>
              <div className="flex items-center gap-2">
                <button disabled={d.list.page <= 1} onClick={() => setPage(d.list.page - 1)}
                  className="h-8 px-3 rounded-lg border border-gray-200 font-black disabled:opacity-40">Prev</button>
                <span className="font-bold">Page {d.list.page} of {d.list.last_page}</span>
                <button disabled={d.list.page >= d.list.last_page} onClick={() => setPage(d.list.page + 1)}
                  className="h-8 px-3 rounded-lg border border-gray-200 font-black disabled:opacity-40">Next</button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default ConnectivitySla;
