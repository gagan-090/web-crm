import React, { useState } from 'react';
import {
  useGetRevenueChallengeQuery,
  type RcAgentRow,
  type RcCategory,
  type RcCategoryLeader,
} from '../../services/api/webCrmApi';
import { PageCardSkeleton } from '../../components/PageSkeleton';

/**
 * REVENUE CHALLENGE — September 2026 Targets & Incentives.
 *
 * The head's board for the 10-day revenue sprints. Every number is folded from
 * collection_by server-side (RevenueChallengeController): per-agent target vs
 * collected, the three sprints, category winners, and the incentive policy.
 */

const inr = (n: number) => '₹' + Math.round(n || 0).toLocaleString('en-IN');

const CATEGORY_META: Record<RcCategory, { label: string; icon: string; ring: string; chip: string; bar: string }> = {
  driver: { label: 'Driver', icon: 'local_shipping', ring: 'border-indigo-200', chip: 'bg-indigo-50 text-indigo-700 border-indigo-200', bar: 'bg-indigo-600' },
  transporter: { label: 'Transporter', icon: 'inventory_2', ring: 'border-sky-200', chip: 'bg-sky-50 text-sky-700 border-sky-200', bar: 'bg-sky-600' },
  matchmaking: { label: 'Matchmaking', icon: 'handshake', ring: 'border-amber-200', chip: 'bg-amber-50 text-amber-700 border-amber-200', bar: 'bg-amber-500' },
  other: { label: 'Other', icon: 'person', ring: 'border-gray-200', chip: 'bg-gray-100 text-gray-600 border-gray-200', bar: 'bg-gray-400' },
};

const initials = (name: string) => {
  const p = name.trim().split(/\s+/);
  return (p.length === 1 ? p[0].slice(0, 2) : p[0][0] + p[p.length - 1][0]).toUpperCase();
};

const Bar: React.FC<{ pct: number; tone?: string; h?: string }> = ({ pct, tone = 'bg-indigo-600', h = 'h-2' }) => (
  <div className={`flex-1 ${h} rounded-full bg-gray-100 overflow-hidden`}>
    <div className={`h-full rounded-full transition-all duration-500 ${pct >= 100 ? 'bg-emerald-500' : tone}`} style={{ width: `${Math.max(Math.min(pct, 100), 2)}%` }} />
  </div>
);

// ── Category winner card ──────────────────────────────────────────────────────
const CategoryCard: React.FC<{ cat: RcCategory; leader: RcCategoryLeader | null; award: number }> = ({ cat, leader, award }) => {
  const m = CATEGORY_META[cat];
  const has = leader && leader.revenue > 0;
  return (
    <div className={`bg-white rounded-2xl border ${m.ring} shadow-sm p-4 flex flex-col`}>
      <div className="flex items-center justify-between">
        <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-1 rounded-lg border flex items-center gap-1 ${m.chip}`}>
          <span className="material-symbols-outlined text-[14px]">{m.icon}</span>
          {m.label} Category
        </span>
        <span className="text-[11px] font-black text-amber-700 flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[15px]">emoji_events</span>{inr(award)}
        </span>
      </div>
      <div className="mt-3 flex items-center gap-3">
        <div className={`w-11 h-11 rounded-full border flex items-center justify-center text-sm font-black ${has ? m.chip : 'bg-gray-50 text-gray-300 border-gray-200'}`}>
          {has ? initials(leader!.name) : '—'}
        </div>
        <div className="min-w-0">
          <div className="font-black text-gray-900 text-sm truncate">{has ? leader!.name : 'To be decided'}</div>
          <div className="text-[11px] text-gray-500">{has ? `Leading with ${inr(leader!.revenue)}` : 'No revenue in this sprint yet'}</div>
        </div>
      </div>
    </div>
  );
};

// ── Agent leaderboard row ─────────────────────────────────────────────────────
const AgentRow: React.FC<{ a: RcAgentRow }> = ({ a }) => {
  const m = CATEGORY_META[a.category];
  const gatePct = a.achievement_gate > 0 ? Math.min(100, (a.achieved_period / a.achievement_gate) * 100) : 0;
  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      <td className="py-3 px-3 text-center">
        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-[11px] font-black ${a.rank <= 3 ? 'bg-amber-100 text-amber-800' : 'bg-gray-100 text-gray-500'}`}>{a.rank}</span>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2.5">
          <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-[11px] font-black ${m.chip}`}>{initials(a.name)}</div>
          <div className="min-w-0">
            <div className="font-bold text-gray-900 text-xs flex items-center gap-1.5">
              {a.name}
              {!a.matched && <span title="No matching active roster member" className="material-symbols-outlined text-[13px] text-amber-500">help</span>}
            </div>
            <span className={`text-[8.5px] font-black uppercase px-1.5 py-0.5 rounded border ${m.chip}`}>{m.label}</span>
          </div>
        </div>
      </td>
      <td className="py-3 px-3 text-right font-bold text-gray-700 text-xs whitespace-nowrap">{inr(a.period_target)}</td>
      <td className="py-3 px-3 text-right font-black text-gray-900 text-xs whitespace-nowrap">{inr(a.achieved_period)}</td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2 min-w-[120px]">
          <Bar pct={a.pct_period} tone={m.bar} />
          <span className="text-[11px] font-black text-gray-600 w-9 text-right">{a.pct_period}%</span>
        </div>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2 min-w-[110px]">
          <Bar pct={a.pct_month} tone="bg-gray-400" h="h-1.5" />
          <span className="text-[10px] font-bold text-gray-400 w-8 text-right">{a.pct_month}%</span>
        </div>
      </td>
      <td className="py-3 px-3 whitespace-nowrap">
        {a.achievement_unlocked ? (
          <span className="text-[10px] font-black px-2 py-1 rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1 w-fit">
            <span className="material-symbols-outlined text-[13px]">verified</span>+{inr(a.achievement_reward)}
          </span>
        ) : (
          <div className="flex items-center gap-1.5 w-[130px]">
            <Bar pct={gatePct} tone="bg-amber-400" h="h-1.5" />
            <span className="text-[9px] text-amber-700 font-bold whitespace-nowrap">{inr(a.achievement_remaining)} to go</span>
          </div>
        )}
      </td>
    </tr>
  );
};

const RevenueChallenge: React.FC = () => {
  const [period, setPeriod] = useState<string>('');   // '' → server picks current sprint
  const [month, setMonth] = useState<string>('');      // '' → contest month (Sept 2026)

  const { data, isFetching, isLoading } = useGetRevenueChallengeQuery({
    ...(period ? { period } : {}),
    ...(month ? { month } : {}),
  });

  if (isLoading || !data) return <PageCardSkeleton cards={6} title="Revenue Challenge" />;

  const d = data.data;
  const { contest, period: p, sprints, agents, category_leaders, team_incentives, incentive_policy } = d;

  const SPRINT_TABS = [
    ...sprints.map(s => ({ key: s.key, label: `Sprint ${s.key.replace('p', '')}`, sub: s.label })),
    { key: 'month', label: 'Full Month', sub: 'All 3 sprints' },
  ];
  const activeKey = p.key;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-indigo-600 text-[26px]">rocket_launch</span>
            <h1 className="text-2xl font-black text-gray-900 tracking-tight">{contest.title}</h1>
            {isFetching && <span className="material-symbols-outlined text-gray-300 text-[18px] animate-spin">progress_activity</span>}
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {contest.month_label} · One Team. One Target. Monthly goal <span className="font-bold text-gray-700">{inr(contest.month_goal)}</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-[11px] font-bold text-gray-500 flex items-center gap-1.5">
            Month
            <input
              type="month"
              value={month || '2026-09'}
              onChange={e => setMonth(e.target.value)}
              className="h-9 border border-gray-200 rounded-xl px-2 text-xs outline-none focus:border-indigo-500"
            />
          </label>
        </div>
      </div>

      {/* ── Top row: month gauge + sprint ladder ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-5">
        {/* Month goal */}
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-2xl p-5 text-white shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-200">Monthly Target</span>
            <span className="material-symbols-outlined text-indigo-200">flag</span>
          </div>
          <div className="mt-2 text-3xl font-black">{inr(contest.month_goal)}</div>
          <div className="mt-3 flex items-center gap-2">
            <div className="flex-1 h-2.5 rounded-full bg-indigo-400/40 overflow-hidden">
              <div className="h-full rounded-full bg-white transition-all duration-500" style={{ width: `${Math.max(contest.month_pct, 2)}%` }} />
            </div>
            <span className="text-sm font-black">{contest.month_pct}%</span>
          </div>
          <div className="mt-2 text-[12px] text-indigo-100">
            Collected <span className="font-bold text-white">{inr(contest.month_achieved)}</span> so far
          </div>
        </div>

        {/* Sprint ladder */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-500">Three 10-Day Sprints</h3>
            <span className="text-[11px] text-gray-400">as of {new Date(contest.as_of.replace(' ', 'T')).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {sprints.map(s => {
              const active = s.key === activeKey;
              return (
                <button
                  key={s.key}
                  onClick={() => setPeriod(s.key)}
                  className={`text-left rounded-xl border p-3 transition-all ${active ? 'border-indigo-400 bg-indigo-50/60 ring-1 ring-indigo-200' : 'border-gray-200 hover:bg-gray-50'}`}
                >
                  <div className="text-[10px] font-black uppercase tracking-wide text-gray-400">{s.label}</div>
                  <div className="text-lg font-black text-gray-900 mt-0.5">{inr(s.target)}</div>
                  <div className="text-[10px] font-bold text-indigo-600 mt-0.5">{s.share}% of month</div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Sprint selector tabs ── */}
      <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-xl p-1 w-fit mb-4 shadow-xs">
        {SPRINT_TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setPeriod(t.key)}
            className={`px-3.5 py-2 rounded-lg text-xs font-black transition-colors flex flex-col items-start ${activeKey === t.key ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'}`}
          >
            <span>{t.label}</span>
            <span className={`text-[9px] font-semibold ${activeKey === t.key ? 'text-indigo-100' : 'text-gray-400'}`}>{t.sub}</span>
          </button>
        ))}
      </div>

      {/* ── Selected sprint headline ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-5">
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Sprint Target</div>
          <div className="text-xl font-black text-gray-900 mt-1">{inr(p.target)}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">{p.label} · {p.share}%</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Collected</div>
          <div className="text-xl font-black text-emerald-700 mt-1">{inr(p.achieved)}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">{p.pct}% of sprint target</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Progress</div>
          <div className="flex items-center gap-2 mt-2">
            <Bar pct={p.pct} />
            <span className="text-sm font-black text-gray-700">{p.pct}%</span>
          </div>
          <div className="text-[10px] text-gray-400 mt-1.5">{inr(Math.max(0, p.target - p.achieved))} remaining</div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4">
          <div className="text-[10px] font-black uppercase tracking-wider text-gray-400">Days Left</div>
          <div className="text-xl font-black text-gray-900 mt-1">{p.days_left}</div>
          <div className="text-[10px] text-gray-400 mt-0.5">{p.is_current ? 'Live sprint' : `${p.from} → ${p.to}`}</div>
        </div>
      </div>

      {/* ── Category winner awards ── */}
      <div className="flex items-center gap-2 mb-2">
        <span className="material-symbols-outlined text-amber-500 text-[20px]">emoji_events</span>
        <h2 className="text-sm font-black text-gray-800 uppercase tracking-wide">Category Winner Awards</h2>
        <span className="text-[11px] text-gray-400">· {inr(d.category_award)} each · highest sprint revenue per desk</span>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <CategoryCard cat="driver" leader={category_leaders.driver} award={d.category_award} />
        <CategoryCard cat="transporter" leader={category_leaders.transporter} award={d.category_award} />
        <CategoryCard cat="matchmaking" leader={category_leaders.matchmaking} award={d.category_award} />
      </div>

      {/* ── Agent leaderboard ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-6">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-baseline gap-2">
            <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Agent Leaderboard</h2>
            <span className="text-[11px] text-gray-400">· ranked by {p.label} revenue</span>
          </div>
          <span className="text-[11px] text-gray-500">
            Achievement incentive: <span className="font-bold text-emerald-700">{inr(1000)}</span> at {inr(5000)} collected
          </span>
        </div>
        <div className="overflow-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[880px] text-left">
            <thead className="bg-[#f8fafc] sticky top-0 z-10">
              <tr>
                {['#', 'Agent', 'Sprint Target', 'Collected', 'Sprint %', 'Month %', 'Achievement ₹1,000'].map((h, i) => (
                  <th key={h} className={`py-3 px-3 text-[10px] font-black uppercase tracking-wider text-gray-600 border-b border-gray-200 whitespace-nowrap ${i === 0 ? 'text-center' : i === 2 || i === 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {agents.map(a => <AgentRow key={a.name} a={a} />)}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Team incentives ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-amber-200 shadow-sm p-4">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-amber-500">handshake</span>
            <h3 className="font-black text-gray-800 text-sm">Matchmaking Team</h3>
          </div>
          <p className="text-[12px] text-gray-600 mt-2">
            <span className="font-black text-amber-700">{inr(team_incentives.matchmaking_per_joining)}</span> on every confirmed driver joining — from both Driver &amp; Transporter side. More placements confirmed, more you earn.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-emerald-200 shadow-sm p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-emerald-600">verified_user</span>
              <h3 className="font-black text-gray-800 text-sm">Verification Team</h3>
            </div>
            <span className="text-[11px] font-black text-emerald-700">{team_incentives.verification_share_pct}% share</span>
          </div>
          <p className="text-[12px] text-gray-600 mt-2">
            Earn <span className="font-black text-emerald-700">{team_incentives.verification_share_pct}%</span> of every verification plan closed. On a ₹499 plan that's ₹250.
          </p>
          <div className="mt-2 text-[11px] text-gray-500">
            This sprint's verification revenue <span className="font-bold text-gray-700">{inr(team_incentives.verification_revenue)}</span> → pool <span className="font-black text-emerald-700">{inr(team_incentives.verification_pool)}</span>
          </div>
        </div>
      </div>

      {/* ── Incentive policy reference ── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-sm font-black text-gray-900 uppercase tracking-wide">Individual Revenue Achievers — Incentive Policy</h2>
          <p className="text-[11px] text-gray-400 mt-0.5">Incentive starts only after the 1.5× salary revenue threshold. Any refund / fake sale reverses the incentive.</p>
        </div>
        <div className="overflow-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[820px] text-left text-xs">
            <thead className="bg-[#f8fafc]">
              <tr>
                {['Team', 'Product / Revenue Type', 'Price', 'Incentive', 'Eligibility Rule', 'Payment Condition'].map((h, i) => (
                  <th key={h} className={`py-2.5 px-3 text-[10px] font-black uppercase tracking-wider text-gray-600 border-b border-gray-200 whitespace-nowrap ${i === 2 || i === 3 ? 'text-right' : 'text-left'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {incentive_policy.map((r, i) => (
                <tr key={i} className="hover:bg-slate-50/70">
                  <td className="py-2.5 px-3 whitespace-nowrap">
                    <span className={`text-[9.5px] font-black uppercase px-1.5 py-0.5 rounded border ${
                      r.team.includes('Driver') ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                        : r.team.includes('Transporter') || r.team.includes('Others') ? 'bg-sky-50 text-sky-700 border-sky-200'
                          : 'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>{r.team}</span>
                  </td>
                  <td className="py-2.5 px-3 font-semibold text-gray-700">{r.product}</td>
                  <td className="py-2.5 px-3 text-right text-gray-600 whitespace-nowrap">{r.price ? inr(r.price) : '—'}</td>
                  <td className="py-2.5 px-3 text-right font-black text-emerald-700 whitespace-nowrap">{inr(r.incentive)}</td>
                  <td className="py-2.5 px-3 text-gray-500 text-[11px]">{r.rule}</td>
                  <td className="py-2.5 px-3 text-gray-500 text-[11px]">{r.condition}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RevenueChallenge;
