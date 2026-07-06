import React from 'react';
import GateProgressWidget from '../../shared/components/incentive/GateProgressWidget';
import { useNavigate } from 'react-router-dom';
import { useGetMmDashboardQuery, useGetMmJobListingsQuery } from '../../services/api/webCrmApi';

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

  const { data: dashData, isLoading: dashLoading } = useGetMmDashboardQuery();
  const { data: jobsData, isLoading: jobsLoading } = useGetMmJobListingsQuery(
    { type: 'regular', section: 'all', limit: 20 },
    { refetchOnMountOrArgChange: true }
  );

  const stats   = dashData?.data?.stats;
  const cats    = dashData?.data?.job_categories;
  const agentName = dashData?.data?.user?.name;

  const totalJobs     = stats?.total_jobs?.count      ?? 0;
  const openJobs      = stats?.approved_jobs?.count   ?? 0;
  const closedJobs    = stats?.closed_jobs?.count     ?? 0;
  const expiredJobs   = stats?.expired_jobs?.count    ?? 0;
  const expiringSoon  = stats?.expiring_soon_jobs?.count ?? 0;
  const totalApps     = stats?.total_applicants?.count ?? 0;
  const regularJobs   = cats?.regular_jobs            ?? 0;
  const greenlineJobs = cats?.greenline_jobs          ?? 0;

  const recentJobs = jobsData?.data?.jobs?.slice(0, 8) ?? [];

  const kpis = [
    { label: 'Total Assigned', value: totalJobs,    icon: 'work',          cls: 'text-[#8E44AD]', bg: 'bg-purple-50' },
    { label: 'Open Jobs',      value: openJobs,     icon: 'check_circle',  cls: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Closed Jobs',    value: closedJobs,   icon: 'lock',          cls: 'text-gray-600',  bg: 'bg-gray-50' },
    { label: 'Expired',        value: expiredJobs,  icon: 'schedule',      cls: 'text-red-600',   bg: 'bg-red-50' },
    { label: 'Expiring Soon',  value: expiringSoon, icon: 'alarm',         cls: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Total Applicants',value: totalApps,   icon: 'people',        cls: 'text-blue-600',  bg: 'bg-blue-50' },
    { label: 'In-System Jobs', value: regularJobs,  icon: 'business_center',cls:'text-indigo-600',bg: 'bg-indigo-50' },
    { label: 'Partner Jobs',   value: greenlineJobs,icon: 'handshake',     cls: 'text-emerald-600',bg:'bg-emerald-50' },
  ];

  return (
    <main className="flex flex-col h-[calc(100vh-60px)] bg-gray-50 overflow-hidden text-xs">

      {/* Incentive Gate Progress */}
      <section className="shrink-0 px-4 pt-2 pb-0">
        <GateProgressWidget />
      </section>

      {/* Header */}
      <div className="px-5 py-2.5 shrink-0 bg-white border-b border-gray-200 flex items-center justify-between">
        <div>
          <h1 className="font-extrabold text-gray-800 text-sm uppercase tracking-wide">
            {agentName ? `Welcome, ${agentName}` : 'Matchmaking Dashboard'}
          </h1>
          <p className="text-[10px] text-gray-400">Live data from your assigned jobs and applicants</p>
        </div>
        <button
          onClick={() => navigate('/mm/mm-job-board')}
          className="flex items-center gap-1.5 bg-[#8E44AD] hover:bg-[#7D3C98] text-white px-3 py-1.5 rounded-lg font-bold shadow-sm"
        >
          <span className="material-symbols-outlined text-sm">work</span>View All Jobs
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-4 custom-scrollbar">

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

        {/* Job categories quick nav */}
        <section className="grid grid-cols-2 gap-3">
          <button onClick={() => navigate('/mm/mm-job-board')}
            className="bg-white border border-[#8E44AD]/30 rounded-xl p-4 text-left hover:bg-purple-50 transition-colors shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">In-System Jobs</p>
            <p className="text-2xl font-extrabold text-[#8E44AD] mt-1">{regularJobs}</p>
            <p className="text-[10px] text-gray-500 mt-1 font-semibold">Regular transporter jobs assigned to you</p>
          </button>
          <button onClick={() => navigate('/mm/mm-job-board')}
            className="bg-white border border-emerald-300 rounded-xl p-4 text-left hover:bg-emerald-50 transition-colors shadow-sm">
            <p className="text-[10px] font-bold text-gray-400 uppercase">Partner / Retail Jobs</p>
            <p className="text-2xl font-extrabold text-emerald-600 mt-1">{greenlineJobs}</p>
            <p className="text-[10px] text-gray-500 mt-1 font-semibold">Greenline, Mahindra & partner job slots</p>
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
                        <td className="p-3 text-gray-600 max-w-[120px] truncate">{job.transporter_name}</td>
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
        <section className="grid grid-cols-3 gap-3 pb-2">
          {[
            { label: 'Driver Bank', icon: 'account_box', path: '/mm/mm-driver-bank', color: 'bg-[#8E44AD]' },
            { label: 'Driver Search', icon: 'person_search', path: '/mm/mm-driver-search', color: 'bg-[#1A5276]' },
            { label: 'Job Board', icon: 'work', path: '/mm/mm-job-board', color: 'bg-emerald-600' },
          ].map(a => (
            <button key={a.label} onClick={() => navigate(a.path)}
              className={`${a.color} hover:opacity-90 text-white rounded-xl p-3 flex flex-col items-center gap-1.5 shadow-sm font-bold`}>
              <span className="material-symbols-outlined text-2xl">{a.icon}</span>
              <span className="text-[10px] uppercase tracking-wide">{a.label}</span>
            </button>
          ))}
        </section>

      </div>
    </main>
  );
};

export default MmHomeDashboard;
