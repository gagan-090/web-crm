import React, { useState } from 'react';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Cell,
  PieChart, Pie, Legend, LabelList,
} from 'recharts';
import {
  useGetMyRevenueChallengeQuery,
  useGetRevenueChallengeQuery,
  type RcCategory,
} from '../../services/api/webCrmApi';
import MyConnectivitySla from './MyConnectivitySla';

/**
 * MY TARGET — the signed-in agent's personal Revenue Challenge card, with
 * charts. Everything is scoped to the logged-in telecaller server-side
 * (RevenueChallengeController@me): target vs collected, the ₹1,000 gate, their
 * revenue mix (pie), day-by-day collections (bar), desk standing, and a
 * click-through to the full contest (overview).
 */

const inr = (n: number) => '₹' + Math.round(n || 0).toLocaleString('en-IN');
const inrShort = (n: number) => {
  const v = Math.round(n || 0);
  if (v >= 100000) return '₹' + (v / 100000).toFixed(v % 100000 ? 1 : 0) + 'L';
  if (v >= 1000) return '₹' + (v / 1000).toFixed(v % 1000 ? 1 : 0) + 'k';
  return '₹' + v;
};

const CAT_LABEL: Record<RcCategory, string> = {
  driver: 'Driver Category', transporter: 'Transporter Category', matchmaking: 'Matchmaking', other: 'Your Desk',
};
const CAT_COLOR: Record<RcCategory, string> = {
  driver: '#4f46e5', transporter: '#0284c7', matchmaking: '#f59e0b', other: '#64748b',
};
const PIE_COLORS = ['#4f46e5', '#0284c7', '#f59e0b', '#059669', '#a855f7', '#ef4444', '#14b8a6', '#64748b'];

const Ring: React.FC<{ pct: number; size?: number; stroke?: number; children?: React.ReactNode }> = ({ pct, size = 120, stroke = 12, children }) => {
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const p = Math.max(0, Math.min(100, pct));
  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor" className="text-white/20" strokeWidth={stroke} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="currentColor"
          className={p >= 100 ? 'text-emerald-300' : 'text-white'} strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={c} strokeDashoffset={c - (c * p) / 100} style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">{children}</div>
    </div>
  );
};

const Meter: React.FC<{ pct: number; tone?: string; h?: string }> = ({ pct, tone = 'bg-indigo-600', h = 'h-2.5' }) => (
  <div className={`flex-1 ${h} rounded-full bg-gray-100 overflow-hidden`}>
    <div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-emerald-500' : tone}`} style={{ width: `${Math.max(Math.min(pct, 100), 2)}%` }} />
  </div>
);

const ChartTip: React.FC<any> = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-lg px-2.5 py-1.5 text-[11px]">
      {label && <div className="font-black text-gray-700 mb-0.5">{label}</div>}
      {payload.map((p: any, i: number) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color || p.payload?.fill }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-bold text-gray-800">{inr(Number(p.value))}</span>
        </div>
      ))}
    </div>
  );
};

const SectionCard: React.FC<{ title: string; sub?: string; right?: React.ReactNode; children: React.ReactNode; className?: string }> = ({ title, sub, right, children, className }) => (
  <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm p-4 ${className || ''}`}>
    <div className="flex items-center justify-between mb-2">
      <div>
        <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-500">{title}</h3>
        {sub && <p className="text-[10px] text-gray-400">{sub}</p>}
      </div>
      {right}
    </div>
    {children}
  </div>
);

// ── Contest details modal (lazy-loads the team overview) ──────────────────────
const ContestModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
  const { data, isLoading } = useGetRevenueChallengeQuery();
  const d = data?.data;

  const leaderboard = (d?.agents || []).slice(0, 13).map(a => ({
    name: a.name.split(' ')[0], collected: a.achieved_period, target: a.period_target, category: a.category,
  }));

  return (
    <div className="fixed inset-0 z-[70] bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[92vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-violet-600 text-white px-5 py-4 flex items-center justify-between z-10">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">{d?.contest.month_label} · {d?.period.label}</div>
            <h2 className="text-lg font-black">Revenue Challenge — Contest Details</h2>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white"><span className="material-symbols-outlined">close</span></button>
        </div>

        {isLoading || !d ? (
          <div className="p-10 text-center text-gray-400 animate-pulse">Loading contest…</div>
        ) : (
          <div className="p-5 space-y-5">
            {/* Month goal + sprint ladder */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
              <div className="rounded-2xl bg-indigo-600 text-white p-4">
                <div className="text-[10px] font-black uppercase tracking-wider text-indigo-200">Monthly Goal</div>
                <div className="text-2xl font-black mt-1">{inr(d.contest.month_goal)}</div>
                <div className="mt-2 h-2 rounded-full bg-indigo-400/40 overflow-hidden"><div className="h-full bg-white rounded-full" style={{ width: `${Math.max(d.contest.month_pct, 2)}%` }} /></div>
                <div className="text-[11px] text-indigo-100 mt-1">{inr(d.contest.month_achieved)} · {d.contest.month_pct}%</div>
              </div>
              {d.sprints.map(s => (
                <div key={s.key} className="rounded-2xl border border-gray-200 p-4">
                  <div className="text-[10px] font-black uppercase tracking-wide text-gray-400">{s.label}</div>
                  <div className="text-xl font-black text-gray-900 mt-0.5">{inr(s.target)}</div>
                  <div className="text-[10px] font-bold text-indigo-600 mt-0.5">{s.share}% of month</div>
                </div>
              ))}
            </div>

            {/* Category winners */}
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-2">Category Winner Awards · {inr(d.category_award)} each</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(['driver', 'transporter', 'matchmaking'] as RcCategory[]).map(cat => {
                  const l = d.category_leaders[cat as 'driver' | 'transporter' | 'matchmaking'];
                  return (
                    <div key={cat} className="rounded-xl border border-gray-200 p-3">
                      <div className="flex items-center gap-1 text-[10px] font-black uppercase" style={{ color: CAT_COLOR[cat] }}>
                        <span className="w-2 h-2 rounded-full" style={{ background: CAT_COLOR[cat] }} />{CAT_LABEL[cat]}
                      </div>
                      <div className="font-black text-gray-900 text-sm mt-1">{l && l.revenue > 0 ? l.name : 'To be decided'}</div>
                      <div className="text-[11px] text-gray-500">{l && l.revenue > 0 ? `Leading with ${inr(l.revenue)}` : 'No revenue yet'}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Team leaderboard bar */}
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-2">Team Leaderboard · {d.period.label}</h3>
              <div className="h-[360px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={leaderboard} layout="vertical" margin={{ left: 10, right: 20 }}>
                    <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#eef2f7" />
                    <XAxis type="number" tickFormatter={inrShort} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                    <YAxis type="category" dataKey="name" width={70} tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} />
                    <Tooltip content={<ChartTip />} cursor={{ fill: '#f6f3f2' }} />
                    <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="collected" name="Collected" radius={[0, 4, 4, 0]}>
                      {leaderboard.map((r, i) => <Cell key={i} fill={CAT_COLOR[r.category]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Incentive policy */}
            <div>
              <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-2">Incentive Policy</h3>
              <div className="overflow-auto custom-scrollbar rounded-xl border border-gray-200">
                <table className="w-full text-left text-xs min-w-[640px]">
                  <thead className="bg-[#f8fafc]">
                    <tr>{['Team', 'Product', 'Price', 'Incentive', 'Rule'].map((h, i) => (
                      <th key={h} className={`py-2 px-3 text-[10px] font-black uppercase tracking-wide text-gray-500 border-b border-gray-200 ${i === 2 || i === 3 ? 'text-right' : ''}`}>{h}</th>
                    ))}</tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {d.incentive_policy.map((r, i) => (
                      <tr key={i}>
                        <td className="py-2 px-3 whitespace-nowrap text-[11px] font-bold text-gray-600">{r.team}</td>
                        <td className="py-2 px-3 text-gray-700">{r.product}</td>
                        <td className="py-2 px-3 text-right text-gray-500 whitespace-nowrap">{r.price ? inr(r.price) : '—'}</td>
                        <td className="py-2 px-3 text-right font-black text-emerald-700 whitespace-nowrap">{inr(r.incentive)}</td>
                        <td className="py-2 px-3 text-[11px] text-gray-500">{r.rule}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const MyRevenueTarget: React.FC = () => {
  const [period, setPeriod] = useState<string>('');   // '' → server picks current sprint
  const [showContest, setShowContest] = useState(false);
  const { data, isLoading, isFetching } = useGetMyRevenueChallengeQuery(period ? { period } : undefined);

  if (isLoading || !data) {
    return <div className="p-8 flex items-center justify-center min-h-screen"><div className="text-gray-500 font-medium animate-pulse">Loading your target…</div></div>;
  }

  const { agent, contest, my, category_standing: cat, sprints, team, breakdown, daily } = data.data;

  const sprintChart = sprints.map(s => ({ name: s.label.replace(' ', ''), target: s.my_target, collected: s.achieved, key: s.key, is_current: s.is_current }));
  const breakdownTotal = breakdown.reduce((a, b) => a + b.amount, 0);
  const dailyMax = Math.max(1, ...daily.map(d => d.amount));

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-3 mb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[26px]">rocket_launch</span>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">My Target</h1>
            {isFetching && <span className="material-symbols-outlined text-gray-300 text-[18px] animate-spin">progress_activity</span>}
          </div>
          <p className="text-sm text-gray-500 mt-1">Hi <span className="font-bold text-gray-800">{agent.name}</span> — {contest.title}, {contest.month_label}. One Team. One Target.</p>
        </div>
        <button onClick={() => setShowContest(true)} className="h-10 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-black flex items-center gap-1.5 shadow-sm">
          <span className="material-symbols-outlined text-[18px]">emoji_events</span> View Contest
        </button>
      </div>

      {!agent.has_target && (
        <div className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-[12px] text-amber-800 flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px]">info</span>
          No personal target is mapped to your name yet — your collected revenue is still tracked below.
        </div>
      )}

      {/* ── Connectivity SLA — the other performance dimension, beside revenue ── */}
      <MyConnectivitySla />

      {/* ── Sprint selector ── */}
      <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-4 shadow-xs">
        {[...sprints.map(s => ({ key: s.key, label: `Sprint ${s.key.replace('p', '')}`, sub: s.label })), { key: 'month', label: 'Full Month', sub: 'All sprints' }].map(t => (
          <button key={t.key} onClick={() => setPeriod(t.key)}
            className={`px-3 py-1.5 rounded-lg text-xs font-black transition-colors flex flex-col items-start ${contest.sprint_key === t.key ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}>
            <span>{t.label}</span><span className={`text-[9px] font-semibold ${contest.sprint_key === t.key ? 'text-indigo-100' : 'text-gray-400'}`}>{t.sub}</span>
          </button>
        ))}
      </div>

      {/* ── Hero KPIs ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 mb-4">
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-sm flex items-center gap-4">
          <Ring pct={my.pct_month}><span className="text-2xl font-black">{my.pct_month}%</span><span className="text-[10px] text-indigo-100 uppercase tracking-wide">of month</span></Ring>
          <div className="min-w-0">
            <div className="text-[11px] font-black uppercase tracking-wider text-indigo-200">My Monthly Target</div>
            <div className="text-2xl font-black mt-0.5">{inr(my.monthly_target)}</div>
            <div className="text-[12px] text-indigo-100 mt-1">Collected <span className="font-bold text-white">{inr(my.achieved_month)}</span></div>
            <div className="text-[12px] text-indigo-100">{inr(my.remaining_month)} to go</div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Sprint · {contest.sprint_label}</span>
            <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">{contest.sprint_share}%</span>
          </div>
          <div className="mt-2 flex items-end gap-2"><div className="text-3xl font-black text-gray-900">{inr(my.achieved_period)}</div><div className="text-sm text-gray-400 mb-1">/ {inr(my.period_target)}</div></div>
          <div className="mt-2 flex items-center gap-2"><Meter pct={my.pct_period} /><span className="text-sm font-black text-gray-700">{my.pct_period}%</span></div>
          <div className="mt-2 flex items-center justify-between text-[11px] text-gray-500">
            <span>{inr(my.remaining_period)} remaining</span>
            <span className="flex items-center gap-1 font-bold text-gray-600"><span className="material-symbols-outlined text-[14px]">timer</span>{contest.days_left} day{contest.days_left === 1 ? '' : 's'} left</span>
          </div>
        </div>

        <div className={`rounded-2xl border shadow-sm p-5 ${my.achievement_unlocked ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between"><span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Achievement Incentive</span><span className="material-symbols-outlined text-amber-500">redeem</span></div>
          {my.achievement_unlocked ? (
            <>
              <div className="mt-2 text-2xl font-black text-emerald-700 flex items-center gap-1"><span className="material-symbols-outlined text-[26px]">verified</span>+{inr(my.achievement_reward)}</div>
              <div className="text-[12px] text-emerald-700 mt-1">Unlocked! You crossed {inr(my.achievement_gate)} this sprint.</div>
            </>
          ) : (
            <>
              <div className="mt-2 text-2xl font-black text-gray-900">{inr(my.achievement_reward)}</div>
              <div className="mt-2 flex items-center gap-2"><Meter pct={my.achievement_gate > 0 ? (my.achieved_period / my.achievement_gate) * 100 : 0} tone="bg-amber-400" /><span className="text-[11px] font-black text-amber-700 whitespace-nowrap">{inr(my.achievement_remaining)} to go</span></div>
              <div className="text-[11px] text-gray-500 mt-1.5">Collect {inr(my.achievement_gate)} this sprint to unlock {inr(my.achievement_reward)}.</div>
            </>
          )}
        </div>

        {/* Placement incentive — ₹100 per driver placed (Successful Recruitment). */}
        <div className={`rounded-2xl border shadow-sm p-5 ${my.placements_month > 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-white border-gray-200'}`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-gray-400">Placement Incentive</span>
            <span className="material-symbols-outlined text-emerald-500">handshake</span>
          </div>
          <div className={`mt-2 text-2xl font-black flex items-center gap-1 ${my.placements_month > 0 ? 'text-emerald-700' : 'text-gray-900'}`}>
            +{inr(my.placement_incentive_month)}
          </div>
          <div className="text-[12px] text-gray-600 mt-1">
            <span className="font-bold text-gray-900">{my.placements_month}</span> driver{my.placements_month === 1 ? '' : 's'} placed this month × {inr(my.placement_rate)}
          </div>
          <div className="text-[11px] text-gray-500 mt-1.5">
            {my.placements_period} this sprint · +{inr(my.placement_incentive_period)}
          </div>
        </div>
      </div>

      {/* ── Charts row 1: sprint bars + revenue mix pie ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <SectionCard title="My Three Sprints" sub="Target vs collected" className="lg:col-span-2"
          right={<div className="flex items-center gap-3 text-[10px] font-bold"><span className="flex items-center gap-1 text-gray-400"><span className="w-2.5 h-2.5 rounded bg-gray-200" />Target</span><span className="flex items-center gap-1 text-indigo-600"><span className="w-2.5 h-2.5 rounded bg-indigo-600" />Collected</span></div>}>
          <div className="h-[240px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sprintChart} margin={{ top: 12, right: 8, left: -8 }} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#475569', fontWeight: 700 }} axisLine={false} tickLine={false} />
                <YAxis tickFormatter={inrShort} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} />
                <Tooltip content={<ChartTip />} cursor={{ fill: '#f6f3f2' }} />
                <Bar dataKey="target" name="Target" fill="#e2e8f0" radius={[5, 5, 0, 0]} />
                <Bar dataKey="collected" name="Collected" radius={[5, 5, 0, 0]}>
                  {sprintChart.map((r, i) => <Cell key={i} fill={r.is_current ? '#4f46e5' : '#a5b4fc'} />)}
                  <LabelList dataKey="collected" position="top" formatter={(v: any) => (Number(v) > 0 ? inrShort(Number(v)) : '')} style={{ fontSize: 10, fontWeight: 800, fill: '#4f46e5' }} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </SectionCard>

        <SectionCard title="Revenue Mix" sub={`${contest.month_label} · by product`}>
          {breakdownTotal > 0 ? (
            <div className="h-[240px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={breakdown} dataKey="amount" nameKey="label" cx="50%" cy="50%" innerRadius={48} outerRadius={78} paddingAngle={2}>
                    {breakdown.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                  </Pie>
                  <Tooltip content={<ChartTip />} />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: 11 }} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[240px] flex flex-col items-center justify-center text-gray-300">
              <span className="material-symbols-outlined text-[40px]">donut_large</span>
              <p className="text-[11px] font-semibold mt-1">No revenue yet this month</p>
            </div>
          )}
        </SectionCard>
      </div>

      {/* ── Charts row 2: daily bar + standing ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">
        <SectionCard title="Daily Collections" sub={`Live sprint · ${contest.sprint_label}`} className="lg:col-span-2">
          {daily.some(d => d.amount > 0) ? (
            <div className="h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={daily} margin={{ top: 12, right: 8, left: -8 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eef2f7" />
                  <XAxis dataKey="label" tick={{ fontSize: 9, fill: '#94a3b8' }} axisLine={false} tickLine={false} interval={0} />
                  <YAxis tickFormatter={inrShort} tick={{ fontSize: 10, fill: '#94a3b8' }} axisLine={false} tickLine={false} width={44} />
                  <Tooltip content={<ChartTip />} cursor={{ fill: '#f6f3f2' }} />
                  <Bar dataKey="amount" name="Collected" radius={[5, 5, 0, 0]}>
                    {daily.map((dd, i) => <Cell key={i} fill={dd.amount >= dailyMax ? '#4f46e5' : '#818cf8'} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ) : (
            <div className="h-[220px] flex flex-col items-center justify-center text-gray-300">
              <span className="material-symbols-outlined text-[40px]">bar_chart</span>
              <p className="text-[11px] font-semibold mt-1">No collections logged this sprint yet</p>
            </div>
          )}
        </SectionCard>

        {/* Standing */}
        <SectionCard title={`${CAT_LABEL[cat.category]} Standing`} right={<span className="text-[11px] font-black text-amber-700 flex items-center gap-0.5"><span className="material-symbols-outlined text-[15px]">emoji_events</span>{inr(cat.award)}</span>}>
          {cat.is_leader ? (
            <div className="flex items-center gap-2 text-emerald-700 py-2">
              <span className="material-symbols-outlined text-[30px]">workspace_premium</span>
              <div><div className="text-lg font-black">You're leading! 🏆</div><div className="text-[12px]">Hold it to win {inr(cat.award)}.</div></div>
            </div>
          ) : (
            <div className="py-1">
              <div className="text-2xl font-black text-gray-900">Rank {cat.rank ?? '—'}<span className="text-gray-400 font-bold text-sm"> / {cat.total_peers}</span></div>
              <div className="text-[12px] text-gray-500 mt-0.5">{cat.leader_name ? <>Leader <span className="font-bold text-gray-700">{cat.leader_name}</span> · {inr(cat.leader_revenue)}</> : 'Seat open — no leader yet.'}</div>
            </div>
          )}
          {/* You vs leader mini bars */}
          <div className="mt-3 space-y-2">
            <div>
              <div className="flex justify-between text-[10px] font-bold text-gray-500"><span>You</span><span>{inr(my.achieved_period)}</span></div>
              <Meter pct={cat.leader_revenue > 0 ? (my.achieved_period / cat.leader_revenue) * 100 : (my.achieved_period > 0 ? 100 : 0)} tone="bg-indigo-600" h="h-2" />
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-bold text-gray-400"><span>Leader</span><span>{inr(cat.leader_revenue)}</span></div>
              <Meter pct={cat.leader_revenue > 0 ? 100 : 0} tone="bg-amber-400" h="h-2" />
            </div>
          </div>
          <div className="mt-3 pt-2 border-t border-gray-100 flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Team · September</span>
            <span className="font-bold text-gray-700">{inr(team.month_achieved)} / {inr(team.month_goal)}</span>
          </div>
        </SectionCard>
      </div>

      {/* ── Motivational footer ── */}
      <div className="rounded-2xl bg-gradient-to-r from-indigo-600 to-violet-600 text-white p-5 text-center shadow-sm">
        <p className="text-sm font-bold">"Targets are just numbers until we make them ours. Let's chase them together!"</p>
        <p className="text-[12px] text-indigo-100 mt-1">Every confirmed driver, every verified transporter — it all adds to your pocket and our September win.</p>
      </div>

      {showContest && <ContestModal onClose={() => setShowContest(false)} />}
    </div>
  );
};

export default MyRevenueTarget;
