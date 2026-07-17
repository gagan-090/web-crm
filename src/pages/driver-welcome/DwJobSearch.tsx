import React, { useState, useMemo } from 'react';
import { useGetDwJobSearchQuery } from '../../services/api/webCrmApi';
import type { DwJob } from '../../services/api/webCrmApi';

type StatusFilter = 'open' | 'all';

export const DwJobSearch: React.FC = () => {
  const [searchInput, setSearchInput] = useState('');
  const [search, setSearch] = useState('');
  const [stateId, setStateId] = useState('');
  const [salary, setSalary] = useState('');
  const [experience, setExperience] = useState('');
  const [status, setStatus] = useState<StatusFilter>('open');
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce the free-text search
  React.useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput.trim()); setCurrentPage(1); }, 450);
    return () => clearTimeout(t);
  }, [searchInput]);

  const { data: response, isLoading, isFetching, refetch } = useGetDwJobSearchQuery({
    page: currentPage,
    per_page: 20,
    status,
    search: search || undefined,
    state_id: stateId || undefined,
    salary: salary || undefined,
    experience: experience || undefined,
  });

  const jobs: DwJob[] = response?.data?.jobs || [];
  const pagination = response?.data?.pagination || { total: 0, per_page: 20, current_page: 1, last_page: 1 };
  const filters = response?.data?.filters || { states: [], salary_ranges: [], experiences: [] };

  const hasActiveFilters = useMemo(
    () => !!(search || stateId || salary || experience || status !== 'open'),
    [search, stateId, salary, experience, status]
  );

  const resetFilters = () => {
    setSearchInput(''); setSearch('');
    setStateId(''); setSalary(''); setExperience('');
    setStatus('open');
    setCurrentPage(1);
  };

  const statusBadge = (job: DwJob) => {
    if (job.is_open) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    return 'bg-gray-100 text-gray-500 border-gray-200';
  };

  return (
    <div className="space-y-6 w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
      {/* Header */}
      <section className="border-b border-gray-200 pb-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
          <div>
            <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">Job Search</p>
            <h2 className="text-2xl font-bold text-gray-800">Open Jobs Board</h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Browse available jobs, who's handling them, and any placed driver.
            </p>
          </div>
          <div className="flex items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => refetch()}
              disabled={isFetching}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-[#27AE60] border border-[#27AE60]/30 bg-[#EAFAF1] hover:bg-[#d7f5e5] rounded-lg transition-colors disabled:opacity-60"
              title="Refresh jobs"
            >
              <span className={`material-symbols-outlined text-[14px] ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
              Refresh
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
              >
                <span className="material-symbols-outlined text-[14px]">filter_list_off</span>
                Clear filters
              </button>
            )}
          </div>
        </div>

        {/* Filter row */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Search */}
          <div className="relative flex-1 min-w-[220px] max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
            <input
              type="text"
              placeholder="Search job title, location, transporter..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] outline-none transition-all"
            />
            {searchInput && (
              <button onClick={() => setSearchInput('')} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-[16px]">close</span>
              </button>
            )}
          </div>

          {/* State */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">location_on</span>
            <select
              value={stateId}
              onChange={(e) => { setStateId(e.target.value); setCurrentPage(1); }}
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] outline-none transition-all font-semibold appearance-none ${stateId ? 'bg-blue-50 border-blue-300 text-blue-700' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <option value="">All States</option>
              {filters.states.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          {/* Salary */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">payments</span>
            <select
              value={salary}
              onChange={(e) => { setSalary(e.target.value); setCurrentPage(1); }}
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] outline-none transition-all font-semibold appearance-none ${salary ? 'bg-emerald-50 border-emerald-300 text-emerald-700' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <option value="">All Salaries</option>
              {filters.salary_ranges.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>

          {/* Experience */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">workspace_premium</span>
            <select
              value={experience}
              onChange={(e) => { setExperience(e.target.value); setCurrentPage(1); }}
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] outline-none transition-all font-semibold appearance-none ${experience ? 'bg-violet-50 border-violet-300 text-violet-700' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <option value="">All Experience</option>
              {filters.experiences.map((e) => (
                <option key={e} value={e}>{e}</option>
              ))}
            </select>
          </div>

          {/* Status */}
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-2.5 text-gray-400 text-[16px] pointer-events-none">tune</span>
            <select
              value={status}
              onChange={(e) => { setStatus(e.target.value as StatusFilter); setCurrentPage(1); }}
              className={`pl-8 pr-3 py-2 text-sm border rounded-lg shadow-sm focus:ring-2 focus:ring-[#27AE60] focus:border-[#27AE60] outline-none transition-all font-semibold appearance-none ${status !== 'open' ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-gray-300 text-gray-700'}`}
            >
              <option value="open">Open Jobs</option>
              <option value="all">All Jobs</option>
            </select>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading || isFetching ? (
          <div className="p-16 text-center text-gray-500 font-semibold flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-4 border-t-[#27AE60] border-gray-200 rounded-full animate-spin"></div>
            <p className="text-xs text-gray-400 mt-2">Loading jobs...</p>
          </div>
        ) : jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/75 border-b border-gray-200 text-xs font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-5 py-4">Job</th>
                  <th className="px-5 py-4">Transporter</th>
                  <th className="px-5 py-4">Location / State</th>
                  <th className="px-5 py-4">Salary</th>
                  <th className="px-5 py-4">Experience</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Assigned To</th>
                  <th className="px-5 py-4">Placed Driver</th>
                  <th className="px-5 py-4 text-center">Applicants</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors align-top">
                    <td className="px-5 py-4">
                      <div className="font-bold text-gray-900">{job.job_title || 'Untitled Job'}</div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-gray-400">
                        <span className="font-mono bg-gray-100 px-1 py-0.5 rounded">{job.job_id || `#${job.id}`}</span>
                        {job.vehicle_type_label && job.vehicle_type_label !== 'N/A' && (
                          <span className="truncate max-w-[140px]" title={job.vehicle_type_label}>{job.vehicle_type_label}</span>
                        )}
                      </div>
                      {job.drivers_required ? (
                        <div className="text-[11px] text-gray-500 mt-0.5">Drivers needed: <b>{job.drivers_required}</b></div>
                      ) : null}
                    </td>
                    <td className="px-5 py-4">
                      <div className="font-semibold text-gray-800">{job.transporter_name || '—'}</div>
                      {job.transporter_tmid && (
                        <div className="text-[11px] font-mono text-gray-400 mt-0.5">{job.transporter_tmid}</div>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      <div className="text-gray-800">{job.job_location || '—'}</div>
                      {job.state_name && <div className="text-[11px] text-gray-400 mt-0.5">{job.state_name}</div>}
                    </td>
                    <td className="px-5 py-4 font-semibold text-[#27AE60]">{job.salary_range || '—'}</td>
                    <td className="px-5 py-4">{job.experience || '—'}</td>
                    <td className="px-5 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold border uppercase tracking-wide ${statusBadge(job)}`}>
                        {job.is_open ? 'Open' : (job.status || 'Closed')}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      {job.assigned_telecaller ? (
                        <span className="inline-flex items-center gap-1 text-gray-700">
                          <span className="material-symbols-outlined text-[14px] text-gray-400">support_agent</span>
                          {job.assigned_telecaller}
                        </span>
                      ) : (
                        <span className="text-amber-600 font-medium text-xs">Unassigned</span>
                      )}
                    </td>
                    <td className="px-5 py-4">
                      {job.placed_driver ? (
                        <div>
                          <div className="font-semibold text-gray-800 flex items-center gap-1">
                            <span className="material-symbols-outlined text-[14px] text-[#27AE60]">how_to_reg</span>
                            {job.placed_driver.name}
                          </div>
                          <div className="text-[11px] font-mono text-gray-400 mt-0.5">{job.placed_driver.tmid}</div>
                        </div>
                      ) : (
                        <span className="text-gray-300 italic text-xs">Not placed</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[28px] px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
                        {job.applicants_count}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-gray-400 italic flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl text-gray-300">work_off</span>
            <p className="text-sm">No jobs found.</p>
            {hasActiveFilters && (
              <button onClick={resetFilters} className="mt-2 text-xs text-[#27AE60] font-bold hover:underline">
                Clear filters to see all jobs
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {pagination.last_page > 1 && (
          <div className="p-4 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-gray-300 bg-white text-xs font-bold text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 select-none transition-colors"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-gray-500">
              Page {currentPage} of {pagination.last_page} ({pagination.total} jobs)
            </span>
            <button
              disabled={currentPage >= pagination.last_page}
              onClick={() => setCurrentPage((p) => Math.min(pagination.last_page, p + 1))}
              className="px-3 py-1.5 border border-gray-300 bg-white text-xs font-bold text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50 select-none transition-colors"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DwJobSearch;
