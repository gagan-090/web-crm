import React, { useState } from 'react';
import GateProgressWidget from '../../shared/components/incentive/GateProgressWidget';
import IndependenceHeaderBanner from '../../shared/components/IndependenceHeaderBanner';
import { useNavigate } from 'react-router-dom';
import { useGetMmDashboardQuery, useGetMmJobListingsQuery, useGetMmAgentStatsQuery } from '../../services/api/webCrmApi';
import TransporterDetailsModal from './TransporterDetailsModal';

// ── Agent report helpers ────────────────────────────────────────────────────
// Every figure comes from MmCallerController::mmAgentStats, which counts real
// rows in call_history_ivr + jobs_match_making + jobs/applyjobs.

const StatTile: React.FC<{
  label: string; value: number | string; sub?: string; cls?: string;
  /** Durations render as "1H 34M 25S", far too wide for the counter size. */
  valueSize?: string;
}> = ({ label, value, sub, cls = 'text-gray-800', valueSize = 'text-xl' }) => (
  // Same shell as the shared dashboard KpiTile (shadow-tile + lift on hover) so
  // matchmaking reads as one system with the other desks.
  <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-tile hover:shadow-tile-hover tm-tile">
    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{label}</p>
    <p className={`${valueSize} font-extrabold mt-0.5 ${cls} whitespace-nowrap tm-metric`}>{value}</p>
    {sub && <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>}
  </div>
);

/** A prioritised list of jobs the agent needs to act on. */
const JobQueueCard: React.FC<{
  title: string;
  subtitle: string;
  jobs: Array<Record<string, unknown>>;
  accent: 'amber' | 'green';
  emptyText: string;
  onOpen: (jobId: string) => void;
}> = ({ title, subtitle, jobs, accent, emptyText, onOpen }) => {
  const accents = {
    amber: { dot: 'bg-amber-500', chip: 'bg-amber-50 text-amber-700 border-amber-200' },
    green: { dot: 'bg-green-500', chip: 'bg-green-50 text-green-700 border-green-200' },
  }[accent];

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${accents.dot}`} />
          <div>
            <h2 className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">{title}</h2>
            <p className="text-[10px] text-gray-400">{subtitle}</p>
          </div>
        </div>
        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded border ${accents.chip}`}>
          {jobs.length}
        </span>
      </div>

      {jobs.length === 0 ? (
        <p className="text-gray-400 italic py-4 text-center">{emptyText}</p>
      ) : (
        <div className="space-y-1">
          {jobs.map((job, i) => (
            <button
              key={String(job.id ?? i)}
              onClick={() => onOpen(String(job.job_id))}
              className="w-full text-left flex items-center gap-2 p-2 rounded-lg hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-colors"
            >
              <span className="font-mono text-[10px] text-gray-400 shrink-0">{String(job.job_id ?? '')}</span>
              <span className="flex-1 min-w-0 font-bold text-gray-800 truncate">
                {String(job.job_title ?? 'Untitled job')}
              </span>
              {!!job.transporter_name && (
                <span className="text-[10px] text-gray-500 truncate max-w-[110px]">
                  {String(job.transporter_name)}
                </span>
              )}
              {!!job.applicants_count && (
                <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                  {String(job.applicants_count)} appl.
                </span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * One step of the funnel, width proportional to the widest step.
 * The count always sits in its own fixed column to the right of the bar —
 * printing it inside the fill clipped the digits on short bars.
 */
const FunnelStep: React.FC<{
  label: string; value: number; max: number; color: string; note?: string;
}> = ({ label, value, max, color, note }) => {
  const pct = max > 0 ? (value / max) * 100 : 0;
  return (
    <div className="flex items-center gap-2">
      <span className="w-32 shrink-0 text-gray-600 font-semibold truncate" title={label}>{label}</span>
      <div className="flex-1 bg-gray-100 rounded h-5 overflow-hidden min-w-0">
        <div
          className="h-full rounded transition-all"
          style={{ width: `${value > 0 ? Math.max(pct, 2) : 0}%`, backgroundColor: color }}
        />
      </div>
      <span className="w-16 shrink-0 text-right font-mono font-extrabold text-gray-800 tabular-nums">
        {value.toLocaleString()}
      </span>
      {note && <span className="w-20 shrink-0 text-right text-[10px] text-gray-400 truncate">{note}</span>}
    </div>
  );
};

const planBadge = (plan: string) => {
  if (plan === 'Super Premium') return 'bg-purple-50 text-purple-700 border-purple-200';
  if (plan === 'Premium') return 'bg-orange-50 text-orange-600 border-orange-200';
  return 'bg-gray-50 text-gray-500 border-gray-200';
};

const statusBadge = (s: string) => {
  if (s === 'OPEN') return 'bg-green-100 text-green-700';
  if (s === 'CLOSED') return 'bg-gray-100 text-gray-500';
  if (s === 'EXPIRED') return 'bg-red-100 text-red-600';
  return 'bg-amber-100 text-amber-700';
};

export const MmHomeDashboard: React.FC = () => {
  const navigate = useNavigate();

  // refetchOnMountOrArgChange, like every other query on this page: without it
  // RTK Query serves whatever the first fetch of the session returned, so the
  // KPI numbers stay frozen for the whole session (and survive a backend fix
  // until the tab is closed).
  const { data: dashData, isLoading: dashLoading } = useGetMmDashboardQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const { data: jobsData, isLoading: jobsLoading } = useGetMmJobListingsQuery(
    { type: 'regular', section: 'all', limit: 20 },
    { refetchOnMountOrArgChange: true }
  );

  // Work queues, in priority order: jobs awaiting approval come FIRST because
  // they block everything downstream, then the open jobs that can be sourced.
  const { data: pendingJobsData } = useGetMmJobListingsQuery(
    { type: 'regular', section: 'verification', limit: 10 },
    { refetchOnMountOrArgChange: true }
  );
  const { data: openJobsData } = useGetMmJobListingsQuery(
    { type: 'regular', section: 'active', status: 'open', limit: 10 },
    { refetchOnMountOrArgChange: true }
  );
  const pendingApprovalJobs = pendingJobsData?.data?.jobs ?? [];
  const openJobsList = openJobsData?.data?.jobs ?? [];

  const stats   = dashData?.data?.stats;
  const cats    = dashData?.data?.job_categories;

  const totalJobs     = stats?.total_jobs?.count      ?? 0;
  const openJobs      = stats?.approved_jobs?.count   ?? 0;
  const closedJobs    = stats?.closed_jobs?.count     ?? 0;
  const expiredJobs   = stats?.expired_jobs?.count    ?? 0;
  const expiringSoon  = stats?.expiring_soon_jobs?.count ?? 0;
  const totalApps     = stats?.total_applicants?.count ?? 0;
  // Board tabs list every job of a type, not just the caller's, so these cards
  // headline the same figure and show the caller's own share underneath.
  const regularJobs        = cats?.regular_jobs             ?? 0;
  const greenlineJobs      = cats?.greenline_jobs           ?? 0;
  // undefined (not 0) when the API doesn't report the split — the sub-line is
  // hidden in that case rather than claiming zero.
  const regularJobsMine    = cats?.regular_jobs_assigned;
  const greenlineJobsMine  = cats?.greenline_jobs_assigned;

  const recentJobs = jobsData?.data?.jobs?.slice(0, 8) ?? [];

  // Agent's own call report + the job funnel (real rows).
  const [statsPeriod, setStatsPeriod] = useState('this_month');
  // Transporter behind the eye icon in the Recent Assigned Jobs table.
  const [transporterView, setTransporterView] = useState<
    { id: number; name?: string; tmid?: string } | null
  >(null);
  const { data: agentStats } = useGetMmAgentStatsQuery({ period: statsPeriod });
  const calls  = agentStats?.data?.calls;
  const funnel = agentStats?.data?.funnel;
  const feedback = agentStats?.data?.feedback ?? [];
  const feedbackMax = feedback.reduce((m, f) => Math.max(m, f.count), 0);

  const kpis = [
    { label: 'Total Assigned', value: totalJobs,    icon: 'work',          cls: 'text-[#8E44AD]', bg: 'bg-purple-50' },
    { label: 'Open Jobs',      value: openJobs,     icon: 'check_circle',  cls: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Closed Jobs',    value: closedJobs,   icon: 'lock',          cls: 'text-gray-600',  bg: 'bg-gray-50' },
    { label: 'Expired',        value: expiredJobs,  icon: 'schedule',      cls: 'text-red-600',   bg: 'bg-red-50' },
    { label: 'Expiring Soon',  value: expiringSoon, icon: 'alarm',         cls: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Applicants',value: totalApps,   icon: 'people',        cls: 'text-blue-600',  bg: 'bg-blue-50' },
    // This row is the caller's own book of work — Total Assigned splits exactly
    // into these two, so they use the assigned counts, not the system totals.
    { label: 'In-System (Mine)', value: regularJobsMine ?? 0,  icon: 'business_center',cls:'text-indigo-600',bg: 'bg-indigo-50' },
    { label: 'Partner (Mine)',   value: greenlineJobsMine ?? 0,icon: 'handshake',     cls: 'text-emerald-600',bg:'bg-emerald-50' },
  ];

  return (
    // The whole page scrolls as one document — the old fixed-height shell with
    // a nested scroller trapped the KPIs above an inner scrollbar.
    <main className="min-h-[calc(100vh-60px)] bg-gray-50 text-xs">

      {/* Incentive Gate Progress */}
      <section className="shrink-0 px-4 pt-2 pb-0">
        <GateProgressWidget />
      </section>

      <div className="px-4 pt-3 pb-6 space-y-4">
        {/* Independence Day Theme Header Banner */}
        <IndependenceHeaderBanner 
          title="Matchmaking Operations Dashboard" 
          subtitle="Connecting skilled drivers with transporters across India. Swatantrata Diwas special."
        />

        {/* ── My Call Report ─────────────────────────────────────────────── */}
        <section className="mt-3">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">My Call Report</h2>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              {[
                { value: 'today', label: 'Today' },
                { value: 'yesterday', label: 'Yesterday' },
                { value: 'this_week', label: 'This Week' },
                { value: 'this_month', label: 'This Month' },
                { value: 'last_month', label: 'Last Month' },
                { value: 'all', label: 'All Time' },
              ].map(p => (
                <button
                  key={p.value}
                  onClick={() => setStatsPeriod(p.value)}
                  className={`px-2.5 py-1 rounded-md font-bold text-[10px] transition-colors ${
                    statsPeriod === p.value ? 'bg-[#8E44AD] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-9 gap-2">
            <StatTile label="Calls Made" value={(calls?.total ?? 0).toLocaleString()} cls="text-[#8E44AD]" />
            <StatTile label="Connected" value={(calls?.connected ?? 0).toLocaleString()} cls="text-green-600"
              sub={calls?.connect_rate !== null && calls?.connect_rate !== undefined ? `${calls.connect_rate}% connect rate` : undefined} />
            {/* TALK time (call_history_ivr.active_time + the mobile app's
                jobs_match_making) — connected calls only, since active_time is
                0 whenever the call never connected. */}
            <StatTile
              label="Active Call Time"
              value={calls?.active_time ?? '0H 0M 0S'}
              cls="text-teal-600"
              valueSize="text-base"
              sub={calls?.connected ? `${calls.avg_active_time} avg / connected call` : 'no connected calls yet'}
            />
            {/* HANDLING time — every call worked, dial through disposition.
                Talk time alone credited nothing for a number that rang out,
                even though the dial and the disposition cost the agent time. */}
            <StatTile
              label="Total Active Time"
              value={calls?.total_active_time ?? '0H 0M 0S'}
              cls="text-indigo-600"
              valueSize="text-base"
              sub="dial → disposition"
            />
            <StatTile label="Not Connected" value={(calls?.not_connected ?? 0).toLocaleString()} cls="text-red-600" />
            <StatTile label="Callbacks" value={(calls?.callback ?? 0).toLocaleString()} cls="text-amber-600" />
            <StatTile label="To Applicants" value={(calls?.to_drivers ?? 0).toLocaleString()} cls="text-blue-600" />
            <StatTile label="To Transporters" value={(calls?.to_transporters ?? 0).toLocaleString()} cls="text-indigo-600" />
            <StatTile
              label="Unattributed"
              value={(calls?.unattributed ?? 0).toLocaleString()}
              cls="text-gray-400"
              sub="callee not recorded"
            />
          </div>
        </section>

        {/* KPI Grid */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-3">
          {kpis.map(k => (
            <div key={k.label} className={`${k.bg} border border-white rounded-xl p-3 shadow-sm flex items-center gap-3`}>
              <div className="w-9 h-9 rounded-lg bg-white flex items-center justify-center shadow-sm shrink-0">
                <span className={`material-symbols-outlined text-base ${k.cls}`}>{k.icon}</span>
              </div>
              <div>
                {dashLoading ? (
                  <div className="h-5 w-10 bg-white/60 rounded animate-pulse mb-1" />
                ) : (
                  <p className={`text-xl font-extrabold ${k.cls}`}>{k.value}</p>
                )}
                <p className="text-[9px] font-bold text-gray-500 uppercase leading-tight">{k.label}</p>
              </div>
            </div>
          ))}
        </section>

        {/* ── Funnel + Feedback ──────────────────────────────────────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3">
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-3">Job & Match Funnel</h2>
            {funnel ? (
              <div className="space-y-1.5">
                {(() => {
                  const max = Math.max(funnel.jobs_total, funnel.applications_total, 1);
                  return (
                    <>
                      <FunnelStep label="Total jobs" value={funnel.jobs_total} max={max} color="#8E44AD" />
                      <FunnelStep label="Open jobs" value={funnel.jobs_open} max={max} color="#27AE60" />
                      <FunnelStep label="Standard" value={funnel.jobs_standard} max={max} color="#95A5A6" />
                      <FunnelStep label="Premium" value={funnel.jobs_premium} max={max} color="#F39C12" />
                      <FunnelStep label="Super premium" value={funnel.jobs_super_premium} max={max} color="#E67E22" />
                      <div className="border-t border-gray-100 my-2" />
                      <FunnelStep label="Applications" value={funnel.applications_total} max={max} color="#3498DB" />
                      <FunnelStep label="Accepted" value={funnel.applications_accepted} max={max} color="#16A085" />
                      <div className="border-t border-gray-100 my-2" />
                      <FunnelStep label="My matches" value={funnel.my_matched} max={max} color="#9B59B6" note="calls logged" />
                      <FunnelStep label="My selections" value={funnel.my_selected} max={max} color="#2ECC71" note="placed" />
                    </>
                  );
                })()}
                <p className="text-[10px] text-gray-400 pt-2 border-t border-gray-100 mt-2">
                  {funnel.jobs_assigned_to_me.toLocaleString()} jobs assigned to you ·{' '}
                  {funnel.applications_pending.toLocaleString()} applications still pending review
                </p>
              </div>
            ) : (
              <div className="space-y-2">{[...Array(6)].map((_, i) => <div key={i} className="h-5 bg-gray-100 rounded animate-pulse" />)}</div>
            )}
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-3">Call Feedback Distribution</h2>
            {feedback.length === 0 ? (
              <p className="text-gray-400 italic">No call feedback recorded in this period.</p>
            ) : (
              <div className="space-y-1.5">
                {feedback.map(f => (
                  <div key={f.label} className="flex items-center gap-2">
                    <span className="w-40 shrink-0 text-gray-600 font-semibold truncate" title={f.label}>{f.label}</span>
                    <div className="flex-1 bg-gray-100 rounded h-4 overflow-hidden">
                      <div
                        className="h-full bg-[#8E44AD] rounded"
                        style={{ width: `${feedbackMax ? (f.count / feedbackMax) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="w-10 shrink-0 text-right font-mono font-bold text-gray-700">{f.count}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Expiring Soon Alert */}
        {expiringSoon > 0 && (
          <section className="mt-3">
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-center justify-between shadow-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-base">alarm</span>
                <div>
                  <p className="font-extrabold text-red-700">SLA Alert — {expiringSoon} job{expiringSoon !== 1 ? 's' : ''} expiring within 7 days</p>
                  <p className="text-[10px] text-red-500 mt-0.5">Prioritise filling these jobs before the deadline</p>
                </div>
              </div>
              <button onClick={() => navigate('/mm/mm-job-board')}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] shadow">
                Fill Now
              </button>
            </div>
          </section>
        )}

        {/* Job categories quick nav */}
        <section className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/mm/mm-job-board')}
            className="bg-white border border-[#8E44AD]/30 rounded-xl p-4 text-left hover:bg-purple-50 transition-colors shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">In-System Jobs</p>
            <p className="text-2xl font-extrabold text-[#8E44AD] mt-1">{regularJobs.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-gray-500 mt-1 font-semibold">
              Regular transporter jobs
              {regularJobsMine !== undefined && (
                <> · <span className="text-[#8E44AD]">{regularJobsMine.toLocaleString('en-IN')} assigned to you</span></>
              )}
            </p>
          </button>
          <button onClick={() => navigate('/mm/mm-job-board')}
            className="bg-white border border-emerald-300 rounded-xl p-4 text-left hover:bg-emerald-50 transition-colors shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Partner / Retail Jobs</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{greenlineJobs.toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-gray-500 mt-1 font-semibold">
              Greenline, Mahindra & partner slots
              {greenlineJobsMine !== undefined && (
                <> · <span className="text-emerald-600">{greenlineJobsMine.toLocaleString('en-IN')} assigned to you</span></>
              )}
            </p>
          </button>
        </section>

        {/* Recent Jobs Table */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-extrabold text-gray-800 uppercase tracking-wider text-xs">Recent Assigned Jobs</h3>
            <button onClick={() => navigate('/mm/mm-job-board')}
              className="text-[#8E44AD] hover:underline font-extrabold">
              View All →
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px]">
                  <th className="p-3 pl-4">Job ID</th>
                  <th className="p-3">Title</th>
                  <th className="p-3">Transporter</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Location</th>
                  <th className="p-3 text-center">Applicants</th>
                  <th className="p-3">Deadline</th>
                  <th className="p-3 text-right pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {jobsLoading
                  ? [...Array(5)].map((_, i) => (
                      <tr key={i}>
                        {[...Array(8)].map((__, j) => (
                          <td key={j} className="p-3"><div className="h-3 bg-gray-100 rounded animate-pulse" /></td>
                        ))}
                      </tr>
                    ))
                  : recentJobs.length === 0
                    ? (
                      <tr>
                        <td colSpan={8} className="text-center py-8 text-gray-400">
                          <span className="material-symbols-outlined text-3xl block mb-1">work_off</span>
                          No jobs assigned yet
                        </td>
                      </tr>
                    )
                    : recentJobs.map((job: any) => (
                      <tr key={job.id}
                        className="hover:bg-purple-50/30 cursor-pointer transition-colors"
                        onClick={() => navigate('/mm/mm-job-detail', { state: { jobId: job.job_id } })}>
                        <td className="p-3 pl-4 font-mono font-bold text-gray-900 text-[10px]">{job.job_id}</td>
                        <td className="p-3 font-semibold text-gray-800 max-w-[180px] truncate">{job.job_title}</td>
                        <td className="p-3 text-gray-600 max-w-[150px]">
                          <div className="flex items-center gap-1 min-w-0">
                            <span className="truncate">{job.transporter_name}</span>
                            {/* stopPropagation so the eye opens the transporter,
                                not the job row's navigate-to-detail. */}
                            {!!job.transporter_id && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setTransporterView({
                                    id: Number(job.transporter_id),
                                    name: job.transporter_name,
                                    tmid: job.tm_user_id,
                                  });
                                }}
                                title={`View full details for ${job.transporter_name || 'this transporter'}`}
                                className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-[#8E44AD] hover:bg-purple-50 transition-colors"
                              >
                                <span className="material-symbols-outlined text-[14px]">visibility</span>
                              </button>
                            )}
                          </div>
                        </td>
                        <td className="p-3">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border ${planBadge(job.plan_type)}`}>
                            {job.plan_type}
                          </span>
                        </td>
                        <td className="p-3 text-gray-500 max-w-[120px] truncate">{job.location || '—'}</td>
                        <td className="p-3 text-center font-mono font-bold">{job.applicants_count ?? 0}</td>
                        <td className="p-3 text-[10px] text-gray-500">
                          {job.deadline ? new Date(job.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—'}
                        </td>
                        <td className="p-3 text-right pr-4">
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${statusBadge(job.status)}`}>
                            {job.status}
                          </span>
                        </td>
                      </tr>
                    ))
                }
              </tbody>
            </table>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 pb-2">
          {[
            { label: 'Driver Bank', icon: 'account_box', path: '/mm/mm-driver-bank', color: 'bg-[#8E44AD]' },
            { label: 'Driver Search', icon: 'person_search', path: '/mm/mm-driver-search', color: 'bg-[#1A5276]' },
            { label: 'Job Board', icon: 'work', path: '/mm/mm-job-board', color: 'bg-emerald-600' },
            { label: 'Incoming Calls', icon: 'call_received', path: '/mm/mm-incoming-calls', color: 'bg-sky-600' },
          ].map(a => (
            <button key={a.label} onClick={() => navigate(a.path)}
              className={`${a.color} hover:opacity-90 text-white rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-sm font-bold`}>
              <span className="material-symbols-outlined text-2xl">{a.icon}</span>
              <span className="text-[10px] uppercase tracking-wide">{a.label}</span>
            </button>
          ))}
        </section>


        {/* ── Work queues: pending approval first, then open jobs ────────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-3 mt-3">
          <JobQueueCard
            title="Pending Approval"
            subtitle="Blocked until verified — clear these first"
            jobs={pendingApprovalJobs}
            accent="amber"
            emptyText="Nothing waiting for approval."
            onOpen={jobId => navigate('/mm/mm-job-detail', { state: { jobId } })}
          />
          <JobQueueCard
            title="Open Jobs"
            subtitle="Live jobs you can source drivers for"
            jobs={openJobsList}
            accent="green"
            emptyText="No open jobs right now."
            onOpen={jobId => navigate('/mm/mm-job-detail', { state: { jobId } })}
          />
        </section>

      </div>

      {transporterView && (
        <TransporterDetailsModal
          open
          transporterId={transporterView.id}
          transporterName={transporterView.name}
          uniqueId={transporterView.tmid}
          onClose={() => setTransporterView(null)}
        />
      )}
    </main>
  );
};

export default MmHomeDashboard;
