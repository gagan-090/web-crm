import React, { useState } from 'react';
import {
  useGetMmAgentPerformanceQuery,
  type MmPlacementRow,
  type MmSlaTier,
} from '../../services/api/webCrmApi';

// ── My Placements Dashboard ─────────────────────────────────────────────────
//
// Every figure here is computed server-side from real rows
// (call_history_ivr ∪ jobs_match_making, joined to jobs/payments) — see
// MmCallerController::mmAgentPerformance. Nothing on this screen is simulated.
//
// SLA rules: a super-premium job must be filled within 7 days of posting, a
// premium job within 10, and each placement carries a 1-month replacement
// liability. Whether a replacement was actually *needed* is not recorded
// anywhere in the schema, so this screen reports the liability WINDOW only and
// says so, rather than inventing a compliance number.

const PERIODS = [
  { value: 'this_month', label: 'This Month' },
  { value: 'last_month', label: 'Last Month' },
  { value: 'all', label: 'Placements History' },
];

const TIER_STYLES: Record<string, string> = {
  super_premium: 'bg-orange-50 text-orange-700 border-orange-200',
  premium: 'bg-purple-50 text-[#7D3C98] border-purple-200',
  standard: 'bg-gray-100 text-gray-600 border-gray-200',
  unknown: 'bg-gray-50 text-gray-400 border-gray-200',
};

const TIER_LABELS: Record<string, string> = {
  super_premium: 'Super Premium',
  premium: 'Premium',
  standard: 'Standard',
  unknown: 'Unknown',
};

const REJECTION_COLORS = ['#8E44AD', '#F39C12', '#3498DB', '#E74C3C', '#95A5A6', '#16A085', '#D35400', '#7F8C8D'];

const Card: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = '' }) => (
  <div className={`bg-white border border-gray-200 rounded-xl p-4 ${className}`}>
    <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
    {children}
  </div>
);

const SlaRow: React.FC<{ label: string; tier: MmSlaTier }> = ({ label, tier }) => (
  <div className="flex justify-between items-center gap-2 py-0.5">
    <span className="text-gray-600 font-semibold">
      {label} <span className="text-gray-400 font-normal">({tier.target_days}d)</span>
    </span>
    {tier.measured === 0 ? (
      <span className="text-gray-300 font-semibold italic">No measurable placements</span>
    ) : (
      <span className="font-bold text-gray-900">
        {tier.within_sla} / {tier.measured} within SLA
        <span className={tier.rate !== null && tier.rate >= 90 ? 'text-green-600' : 'text-amber-600'}>
          {' '}({tier.rate}%)
        </span>
      </span>
    )}
  </div>
);

const MmPlacementHistory: React.FC = () => {
  const [period, setPeriod] = useState('this_month');
  const { data, isFetching, isError, refetch } = useGetMmAgentPerformanceQuery({ period });

  const d = data?.data;
  const f = d?.fulfillments;
  const progress = f && f.target > 0 ? Math.min((f.total / f.target) * 100, 100) : 0;

  return (
    <main className="h-[calc(100vh-60px)] overflow-y-auto bg-gray-50 p-5 text-xs custom-scrollbar">

      {/* Header + period switch */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex justify-between items-center mb-4">
        <div>
          <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">My Placements Dashboard</h1>
          <p className="text-gray-400 mt-0.5">Placements, SLA compliance and incentive accrual — live from your call and match records.</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-0.5 shrink-0">
          {PERIODS.map(p => (
            <button
              key={p.value}
              onClick={() => setPeriod(p.value)}
              className={`px-3 py-1.5 rounded-md font-bold transition-colors ${
                period === p.value ? 'bg-[#8E44AD] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {isError ? (
        <div className="bg-white border border-red-200 rounded-xl p-8 text-center">
          <p className="text-red-500 font-bold">Could not load your performance data.</p>
          <button onClick={refetch} className="mt-2 px-4 py-1.5 border border-[#8E44AD] text-[#8E44AD] rounded-lg font-bold">Retry</button>
        </div>
      ) : isFetching && !d ? (
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => <div key={i} className="h-28 bg-white border border-gray-200 rounded-xl animate-pulse" />)}
        </div>
      ) : d && f ? (
        <>
          {/* ── Top KPI row ── */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card title="Fulfillments">
              <p className="text-2xl font-extrabold text-[#8E44AD]">
                {f.total} <span className="text-gray-400 text-base font-bold">/ {f.target} Target</span>
              </p>
              <div className="h-1.5 bg-gray-100 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-[#8E44AD] rounded-full transition-all" style={{ width: `${progress}%` }} />
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {(['super_premium', 'premium', 'standard', 'unknown'] as const).map(tier => {
                  const count = tier === 'unknown' ? f.unknown_tier : f[tier];
                  if (!count) return null;
                  return (
                    <span key={tier} className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${TIER_STYLES[tier]}`}>
                      {count} {TIER_LABELS[tier]}
                    </span>
                  );
                })}
              </div>
            </Card>

            <Card title="SLA Compliance Rate">
              {d.sla.measured === 0 ? (
                <>
                  <p className="text-2xl font-extrabold text-gray-300">—</p>
                  <p className="text-gray-400 mt-1">
                    No placement in this period sits on a paid job with a known posting date, so fill SLA cannot be measured.
                  </p>
                </>
              ) : (
                <>
                  <p className={`text-2xl font-extrabold ${(d.sla.overall_rate ?? 0) >= 90 ? 'text-green-600' : 'text-amber-600'}`}>
                    {d.sla.overall_rate}%
                  </p>
                  <p className="text-[10px] text-gray-400">{d.sla.within_sla} of {d.sla.measured} measurable placements</p>
                </>
              )}
              <div className="mt-2 space-y-0.5">
                <SlaRow label="Super Premium Fill" tier={d.sla.by_tier.super_premium} />
                <SlaRow label="Premium Fill" tier={d.sla.by_tier.premium} />
              </div>
            </Card>

            <Card title="Incentive Status">
              <p className="text-2xl font-extrabold text-gray-800">₹{d.incentive.accrued.toLocaleString()}</p>
              <p className="text-[10px] text-gray-400">
                ₹{d.incentive.rate_premium}/premium · ₹{d.incentive.rate_super_premium}/super premium
              </p>
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className={`text-[10px] font-extrabold px-2 py-1 rounded border ${
                  d.incentive.gate_crossed
                    ? 'bg-green-50 text-green-700 border-green-200'
                    : 'bg-gray-50 text-gray-500 border-gray-200'
                }`}>
                  {d.incentive.gate_crossed ? `GATE CROSSED (${f.total} PLACEMENTS)` : `GATE NOT CROSSED (${f.total}/${d.incentive.gate})`}
                </span>
                <span className="text-[10px] text-gray-400">Min gate: {d.incentive.gate}</span>
              </div>
            </Card>
          </div>

          {/* ── Replacement liability + sourcing ── */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            <Card title={`Replacement Liability (${d.sla.replacement.window_days} days)`} className="col-span-2">
              <div className="flex gap-6">
                <div>
                  <p className="text-xl font-extrabold text-amber-600">{d.sla.replacement.in_window}</p>
                  <p className="text-[10px] text-gray-400 font-bold">Still inside window</p>
                </div>
                <div>
                  <p className="text-xl font-extrabold text-gray-500">{d.sla.replacement.expired}</p>
                  <p className="text-[10px] text-gray-400 font-bold">Window expired</p>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 mt-2 italic border-t border-gray-100 pt-2">
                {d.sla.replacement.tracking_note}
              </p>
            </Card>

            <Card title="Sourcing Efficiency">
              {d.sourcing.calls_per_placement === null ? (
                <p className="text-gray-400">No placements in this period, so calls-per-placement cannot be computed.</p>
              ) : (
                <p className="text-gray-700 font-semibold leading-relaxed">
                  You make an average of{' '}
                  <span className="text-[#8E44AD] font-extrabold text-base">{d.sourcing.calls_per_placement} calls</span>{' '}
                  per successful placement.
                </p>
              )}
              <p className="text-[10px] text-gray-400 mt-1.5">
                {d.sourcing.calls_made.toLocaleString()} calls · {d.sourcing.placements} placements
              </p>
            </Card>
          </div>

          {/* ── Rejection reasons ── */}
          <Card title="Rejection Reasons Distribution" className="mb-4">
            {d.rejections.total === 0 ? (
              <p className="text-gray-400 italic">No rejected matches recorded in this period.</p>
            ) : (
              <>
                <div className="flex h-6 rounded-lg overflow-hidden mb-2">
                  {d.rejections.reasons.map((r, i) => (
                    <div
                      key={r.reason}
                      className="flex items-center justify-center text-white text-[9px] font-bold"
                      style={{ width: `${r.percent}%`, backgroundColor: REJECTION_COLORS[i % REJECTION_COLORS.length] }}
                      title={`${r.reason}: ${r.count}`}
                    >
                      {r.percent >= 7 ? `${r.percent}%` : ''}
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {d.rejections.reasons.map((r, i) => (
                    <div key={r.reason} className="flex items-center gap-1.5 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: REJECTION_COLORS[i % REJECTION_COLORS.length] }} />
                      <span className="text-gray-600 font-semibold truncate" title={r.reason}>
                        {r.reason} <span className="text-gray-400">({r.count})</span>
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </Card>

          {/* ── Placement ledger ── */}
          <Card title={`Placement Records (${d.placements.length})`}>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="text-gray-400 font-bold uppercase text-[9px] border-b border-gray-200">
                    <th className="p-2 pl-0">Placed</th>
                    <th className="p-2">Job ID</th>
                    <th className="p-2">Driver</th>
                    <th className="p-2">Tier</th>
                    <th className="p-2 text-center">Days to Fill</th>
                    <th className="p-2 text-center">Fill SLA</th>
                    <th className="p-2 text-center">Replacement</th>
                    <th className="p-2 text-right pr-0">Source</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {d.placements.map((p: MmPlacementRow, i) => (
                    <tr key={`${p.job_id}-${p.driver_id}-${i}`} className="hover:bg-gray-50/60">
                      <td className="p-2 pl-0 font-mono text-gray-500">
                        {p.placed_at ? new Date(p.placed_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}
                      </td>
                      <td className="p-2 font-mono font-bold text-gray-700">{p.job_id}</td>
                      <td className="p-2 font-semibold text-gray-800">{p.driver_name || '—'}</td>
                      <td className="p-2">
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${TIER_STYLES[p.tier]}`}>
                          {TIER_LABELS[p.tier]}
                        </span>
                      </td>
                      <td className="p-2 text-center font-mono font-bold text-gray-900">
                        {p.days_to_fill ?? '—'}
                      </td>
                      <td className="p-2 text-center">
                        {p.within_sla === null ? (
                          <span className="text-gray-300" title="No SLA applies, or the job's posting date is unavailable">n/a</span>
                        ) : (
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                            p.within_sla ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-600 border-red-200'
                          }`}>
                            {p.within_sla ? `Met (${p.sla_target_days}d)` : `Breached (${p.sla_target_days}d)`}
                          </span>
                        )}
                      </td>
                      <td className="p-2 text-center">
                        {p.in_replacement_window ? (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded uppercase">
                            Active
                          </span>
                        ) : (
                          <span className="text-gray-300">expired</span>
                        )}
                      </td>
                      <td className="p-2 text-right pr-0">
                        <span className="text-[9px] font-bold text-gray-400 uppercase">
                          {p.source === 'app' ? 'TM App' : 'Web CRM'}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {d.placements.length === 0 && (
                    <tr>
                      <td colSpan={8} className="p-6 text-center text-gray-400 italic">
                        No placements recorded in this period.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : null}
    </main>
  );
};

export default MmPlacementHistory;
