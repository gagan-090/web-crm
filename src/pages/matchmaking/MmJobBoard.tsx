import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMmJobListingsQuery, useGetMmDashboardQuery } from '../../services/api/webCrmApi';

// ── helpers ──────────────────────────────────────────────────────────────────
const planBadge = (plan: string) => {
  if (plan === 'Super Premium') return 'bg-purple-100 text-purple-700 border-purple-200';
  if (plan === 'Premium') return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-gray-100 text-gray-500 border-gray-200';
};

const statusBadge = (status: string) => {
  if (status === 'OPEN') return 'bg-green-100 text-green-700';
  if (status === 'CLOSED') return 'bg-gray-100 text-gray-500';
  if (status === 'EXPIRED') return 'bg-red-100 text-red-600';
  return 'bg-amber-100 text-amber-700';
};

const daysSince = (dateStr: string) => {
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  return d === 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d}d ago`;
};

// ── Job Card ─────────────────────────────────────────────────────────────────
const JobCard: React.FC<{ job: any; onClick: () => void }> = ({ job, onClick }) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm hover:shadow-md hover:border-[#8E44AD]/40 transition-all cursor-pointer group"
  >
    <div className="flex justify-between items-start mb-2">
      <span className="font-mono text-[10px] text-gray-400">{job.job_id}</span>
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${planBadge(job.plan_type)}`}>
        {job.plan_type}
      </span>
    </div>

    <h3 className="font-extrabold text-gray-850 text-xs leading-tight line-clamp-2 group-hover:text-[#8E44AD] transition-colors mb-1">
      {job.job_title}
    </h3>

    <p className="text-gray-500 font-semibold text-[10px] truncate">
      <span className="material-symbols-outlined text-[10px] align-middle">business</span> {job.transporter_name}
    </p>
    {(job.route || job.location) && (
      <p className="text-gray-400 text-[10px] truncate mt-0.5">
        <span className="material-symbols-outlined text-[10px] align-middle">location_on</span> {job.route || job.location}
      </p>
    )}
    {job.load_details && (
      <p className="text-gray-400 text-[10px] truncate mt-0.5" title={job.load_details}>
        <span className="material-symbols-outlined text-[10px] align-middle">package_2</span> {job.load_details}
      </p>
    )}

    <div className="flex flex-wrap gap-1 mt-2">
      {job.vehicle_type && <span className="bg-blue-50 text-blue-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-blue-100">{job.vehicle_type}</span>}
      {job.license_type && <span className="bg-indigo-50 text-indigo-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-indigo-100">{job.license_type}</span>}
      {job.salary_range && <span className="bg-green-50 text-green-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-green-100">{job.salary_range}</span>}
      {job.is_greenline && <span className="bg-emerald-100 text-emerald-700 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-200">GREENLINE</span>}
      {job.match_status && (
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border capitalize ${job.match_status === 'selected' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
          MM: {String(job.match_status).replace('_', ' ')}
        </span>
      )}
    </div>

    {/* Latest transporter call outcome */}
    {job.last_call_status && (
      <div className="flex items-center gap-1.5 mt-2 text-[9.5px]">
        <span className={`font-bold px-1.5 py-0.5 rounded capitalize ${
          job.last_call_status === 'connected' ? 'bg-green-50 text-green-700' :
          job.last_call_status === 'callback_later' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-500'
        }`}>
          {String(job.last_call_status).replace('_', ' ')}
        </span>
        {job.last_call_feedback && <span className="text-gray-500 truncate" title={job.last_call_feedback}>{job.last_call_feedback}</span>}
        {job.last_call_time && <span className="text-gray-400 ml-auto shrink-0">{job.last_call_time}</span>}
      </div>
    )}

    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-100">
      <div className="flex items-center gap-1.5">
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${statusBadge(job.status)}`}>{job.status}</span>
        {job.deadline && (
          <span className="text-[9px] text-gray-400 font-semibold">
            Due {new Date(job.deadline).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-[9.5px] text-gray-400 font-semibold">
        <span className="flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[10px]">people</span>{job.applicants_count ?? 0}
        </span>
        <span>{daysSince(job.created_at)}</span>
        <span className="material-symbols-outlined text-[#8E44AD] text-sm opacity-0 group-hover:opacity-100 transition-opacity">chevron_right</span>
      </div>
    </div>
  </div>
);

// ── Jobs Grid ─────────────────────────────────────────────────────────────────
const JobsGrid: React.FC<{
  type: 'regular' | 'greenline';
  statusFilter: string;
  planFilter: string;
  searchQuery: string;
}> = ({ type, statusFilter, planFilter, searchQuery }) => {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState<number | null>(null);
  const [allJobs, setAllJobs] = useState<any[]>([]);

  const { data, isLoading, isFetching, isError, refetch } = useGetMmJobListingsQuery(
    {
      type,
      // 'all' → no status restriction (shows every job); 'active' → scoped to open/non-expired
      section: statusFilter ? 'active' : 'all',
      status: statusFilter || undefined,
      plan_type: planFilter || undefined,
      search: searchQuery || undefined,
      limit: 20,
      cursor: cursor ?? undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    const jobs = data?.data?.jobs ?? [];
    if (cursor === null) {
      setAllJobs(jobs);
    } else if (jobs.length > 0) {
      setAllJobs(prev => {
        const ids = new Set(prev.map((j: any) => j.id));
        return [...prev, ...jobs.filter((j: any) => !ids.has(j.id))];
      });
    }
  }, [data, cursor]);

  const filtered = useMemo(() => {
    if (!searchQuery) return allJobs;
    const q = searchQuery.toLowerCase();
    return allJobs.filter((j: any) =>
      j.job_title?.toLowerCase().includes(q) ||
      j.job_id?.toLowerCase().includes(q) ||
      j.transporter_name?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q)
    );
  }, [allJobs, searchQuery]);

  const pagination = data?.data?.pagination;

  if (isLoading && allJobs.length === 0) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="h-40 bg-white rounded-xl border border-gray-200 animate-pulse" />
        ))}
      </div>
    );
  }

  if (isError && allJobs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <span className="material-symbols-outlined text-5xl mb-3 text-red-300">error</span>
        <p className="font-semibold text-sm">Could not load jobs</p>
        <p className="text-[11px] mt-1">Check your connection and try again</p>
        <button
          onClick={() => refetch()}
          className="mt-4 px-6 py-2 bg-white border border-[#8E44AD] text-[#8E44AD] rounded-xl font-bold hover:bg-purple-50 text-xs"
        >
          Retry
        </button>
      </div>
    );
  }

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-gray-400">
        <span className="material-symbols-outlined text-5xl mb-3">work_off</span>
        <p className="font-semibold text-sm">No {type === 'greenline' ? 'partner' : 'in-system'} jobs found</p>
        <p className="text-[11px] mt-1">
          {searchQuery ? 'Try a different search term' : 'No jobs are assigned to you in this category'}
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
        {filtered.map((job: any) => (
          <JobCard
            key={job.id}
            job={job}
            onClick={() => navigate('/mm/mm-job-detail', { state: { jobId: job.job_id } })}
          />
        ))}
      </div>

      {pagination?.has_more && (
        <div className="flex justify-center mt-4">
          <button
            onClick={() => setCursor(pagination.next_cursor)}
            disabled={isFetching}
            className="px-6 py-2 bg-white border border-[#8E44AD] text-[#8E44AD] rounded-xl font-bold hover:bg-purple-50 disabled:opacity-50 transition-colors text-xs"
          >
            {isFetching ? 'Loading...' : `Load More (${pagination.next_cursor ? 'more available' : 'done'})`}
          </button>
        </div>
      )}

      <p className="text-center text-[10px] text-gray-400 mt-3 pb-2">
        {filtered.length} job{filtered.length !== 1 ? 's' : ''}{pagination?.has_more ? ' · more available' : ' · all loaded'}
      </p>
    </>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export const MmJobBoard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'regular' | 'greenline'>('regular');
  const [statusFilter, setStatusFilter] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [search, setSearch] = useState('');

  const { data: dashData } = useGetMmDashboardQuery();
  const stats = dashData?.data?.stats;
  const cats  = dashData?.data?.job_categories;

  const tabs = [
    {
      id: 'regular' as const,
      label: 'In-System Jobs',
      count: cats?.regular_jobs,
      icon: 'work',
      desc: 'Regular transporter jobs assigned to you',
    },
    {
      id: 'greenline' as const,
      label: 'Partner / Retail Jobs',
      count: cats?.greenline_jobs,
      icon: 'handshake',
      desc: 'Greenline, Mahindra & other partner jobs',
    },
  ];

  return (
    <main className="flex flex-col h-[calc(100vh-60px)] bg-gray-50 overflow-hidden text-xs">

      {/* Header */}
      <div className="px-5 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-4 flex-wrap">
          <div>
            <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">Matchmaking Job Board</h1>
            <p className="text-[10px] text-gray-400">Click any job to manage applicants, call transporter, and place drivers</p>
          </div>

          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search job, transporter, location..."
              className="w-full pl-8 pr-8 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#8E44AD] bg-white"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 ml-auto">
            {/* Status pills with live counts */}
            <div className="flex gap-1 flex-wrap">
              {[
                { label: 'All',           value: '',              count: stats?.total_jobs?.count },
                { label: 'Open',          value: 'open',          count: stats?.approved_jobs?.count },
                { label: 'Closed',        value: 'closed',        count: stats?.closed_jobs?.count },
                { label: 'Expired',       value: 'expired',       count: stats?.expired_jobs?.count },
                { label: 'Expiring Soon', value: 'expiring_soon', count: stats?.expiring_soon_jobs?.count, warn: true },
              ].map(f => (
                <button
                  key={f.value}
                  onClick={() => setStatusFilter(f.value)}
                  className={`px-2.5 py-1.5 rounded-lg font-bold border text-[10px] transition-colors flex items-center gap-1 ${
                    statusFilter === f.value
                      ? f.warn ? 'bg-amber-500 text-white border-amber-500' : 'bg-[#8E44AD] text-white border-[#8E44AD]'
                      : f.warn && (f.count ?? 0) > 0 ? 'bg-amber-50 text-amber-700 border-amber-200 hover:bg-amber-100' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {f.label}
                  {f.count !== undefined && (
                    <span className={`text-[9px] font-extrabold px-1 py-0.5 rounded ${statusFilter === f.value ? 'bg-white/20' : 'bg-gray-100 text-gray-600'}`}>
                      {f.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Plan filter */}
            <select
              value={planFilter}
              onChange={e => setPlanFilter(e.target.value)}
              className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none font-semibold text-gray-700 text-[10px]"
            >
              <option value="">All Plans</option>
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="super_premium">Super Premium</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tab bar */}
      <div className="flex border-b border-gray-200 bg-white shrink-0 px-5">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 font-bold text-xs border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-[#8E44AD] text-[#8E44AD]'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className="material-symbols-outlined text-base">{tab.icon}</span>
            {tab.label}
            {tab.count !== undefined && (
              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-[#8E44AD]/20 text-[#8E44AD]' : 'bg-gray-100 text-gray-500'}`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Tab description */}
      <div className="px-5 py-1.5 bg-white border-b border-gray-100 text-[10px] text-gray-400 shrink-0">
        {tabs.find(t => t.id === activeTab)?.desc}
      </div>

      {/* Job Grid */}
      <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <JobsGrid
          key={`${activeTab}-${statusFilter}-${planFilter}-${search}`}
          type={activeTab}
          statusFilter={statusFilter}
          planFilter={planFilter}
          searchQuery={search}
        />
      </div>
    </main>
  );
};

export default MmJobBoard;
