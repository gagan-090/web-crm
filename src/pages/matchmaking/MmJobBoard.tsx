import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMmJobListingsQuery, useGetMmDashboardQuery } from '../../services/api/webCrmApi';
import { useStickyState, useStickyScroll } from '../../shared/hooks/useStickyState';
import { openJobSession } from './mmJobSession';
import TransporterDetailsModal from './TransporterDetailsModal';

// ── helpers ──────────────────────────────────────────────────────────────────
const planBadge = (plan: string) => {
  if (plan === 'Super Premium') return 'bg-purple-100 text-purple-700 border-purple-200';
  if (plan === 'Premium') return 'bg-orange-100 text-orange-700 border-orange-200';
  return 'bg-gray-100 text-gray-500 border-gray-200';
};

const statusBadge = (status: string) => {
  if (status === 'OPEN') return 'bg-green-100 text-green-700';
  if (status === 'HOLD') return 'bg-amber-100 text-amber-700';
  if (status === 'CLOSED') return 'bg-gray-100 text-gray-500';
  if (status === 'EXPIRED') return 'bg-red-100 text-red-600';
  return 'bg-amber-100 text-amber-700';
};

const daysSince = (dateStr: string) => {
  const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
  return d === 0 ? 'Today' : d === 1 ? 'Yesterday' : `${d}d ago`;
};

// ── Job Card ─────────────────────────────────────────────────────────────────
const JobCard: React.FC<{ job: any; onClick: () => void; onViewTransporter: () => void }> = ({ job, onClick, onViewTransporter }) => (
  <div
    onClick={onClick}
    className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm hover:shadow-md hover:border-[#8E44AD]/40 transition-all cursor-pointer group"
  >
    <div className="flex justify-between items-start mb-2">
      <span className="font-mono text-[10px] font-bold text-black">{job.job_id}</span>
      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${planBadge(job.plan_type)}`}>
        {job.plan_type}
      </span>
    </div>

    <h3 className="font-extrabold text-gray-850 text-xs leading-tight line-clamp-2 group-hover:text-[#8E44AD] transition-colors mb-1">
      {job.job_title}
    </h3>

    <p className="text-gray-500 font-semibold text-[10px] flex items-center gap-1 min-w-0">
      <span className="material-symbols-outlined text-[10px] shrink-0">business</span>
      <span className="truncate">{job.transporter_name}</span>
      {/* stopPropagation so the eye opens the transporter, not the job. */}
      {!!job.transporter_id && (
        <button
          onClick={(e) => { e.stopPropagation(); onViewTransporter(); }}
          title={`View full details for ${job.transporter_name || 'this transporter'}`}
          className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center text-gray-400 hover:text-[#8E44AD] hover:bg-purple-50 transition-colors"
        >
          <span className="material-symbols-outlined text-[13px]">visibility</span>
        </button>
      )}
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

    {/* Latest transporter call outcome, and what the agent wrote about it */}
    {job.last_call_status && (
      <div className="mt-2 text-[9.5px]">
        <div className="flex items-center gap-1.5">
          <span className={`font-bold px-1.5 py-0.5 rounded capitalize ${
            job.last_call_status === 'connected' ? 'bg-green-50 text-green-700' :
            job.last_call_status === 'callback_later' ? 'bg-amber-50 text-amber-700' : 'bg-red-50 text-red-500'
          }`}>
            {String(job.last_call_status).replace('_', ' ')}
          </span>
          {job.last_call_feedback && <span className="text-gray-500 truncate" title={job.last_call_feedback}>{job.last_call_feedback}</span>}
          {job.last_call_time && <span className="text-gray-400 ml-auto shrink-0">{job.last_call_time}</span>}
        </div>
        {/* The outcome says what happened; the remark says what was agreed —
            which is the part the next agent to open this job actually needs.
            Two lines here, the whole thing on hover and in the timeline. */}
        {job.last_call_remarks && (
          <p
            className="mt-1 text-[9.5px] text-gray-500 italic line-clamp-2 leading-snug border-l-2 border-gray-200 pl-1.5"
            title={`${job.last_call_remarks}${job.last_call_by ? ` — ${job.last_call_by}` : ''}`}
          >
            “{job.last_call_remarks}”
            {job.last_call_by && <span className="not-italic text-gray-400"> — {job.last_call_by}</span>}
          </p>
        )}
      </div>
    )}

    <div className="flex justify-between items-center mt-3 pt-2.5 border-t border-gray-100">
      <div className="flex items-center gap-1.5">
        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${statusBadge(job.status)}`}
          title={
            job.job_status_remarks
              ? `${job.job_status_remarks}${job.job_status_by_name ? ` — ${job.job_status_by_name}` : ''}`
              : undefined
          }
        >
          {job.status}
        </span>
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
  // Identifies this tab+status slice so the reported count lands in the right
  // bucket in the parent.
  countKey: string;
  // Reports the real number of the caller's own jobs once they're all loaded,
  // so the tab badge and status pill can show the TRUE total instead of the
  // dashboard's out-of-sync aggregate (the "16 loaded vs 12 counted" gap).
  onLoadedCount: (key: string, count: number) => void;
}> = ({ type, statusFilter, planFilter, searchQuery, countKey, onLoadedCount }) => {
  const navigate = useNavigate();
  const [cursor, setCursor] = useState<number | null>(null);
  const [allJobs, setAllJobs] = useState<any[]>([]);
  // Transporter behind the eye icon on a job card, null when the modal is shut.
  const [transporterView, setTransporterView] = useState<
    { id: number; name?: string; tmid?: string } | null
  >(null);
  // How many pages we've auto-advanced through — capped so that a backend which
  // ignores scope='mine' (and therefore keeps returning system-wide pages) can
  // never make us walk the entire job table.
  const autoPagesRef = useRef(0);

  const { data, isLoading, isFetching, isError, refetch } = useGetMmJobListingsQuery(
    {
      type,
      // 'all' → no status restriction (shows every job); 'active' → scoped to open/non-expired
      section: statusFilter ? 'active' : 'all',
      status: statusFilter || undefined,
      plan_type: planFilter || undefined,
      search: searchQuery || undefined,
      // Board shows ONLY the signed-in agent's own jobs — never the whole
      // system. Ask the backend to filter server-side; the is_mine guard in
      // `filtered` below enforces it even if the backend ignores this param.
      scope: 'mine',
      limit: 20,
      cursor: cursor ?? undefined,
    },
    { refetchOnMountOrArgChange: true }
  );

  // Start a filter/search over from page 1. Without this, the cursor from a
  // previous filter's auto-pagination (which can end deep in the job table)
  // carried into the next query as `jobs.id < <low id>` and returned an empty
  // page — the whole board went blank and every pill read 0. Resetting on any
  // filter change guarantees each one begins at cursor=null.
  useEffect(() => {
    setCursor(null);
    setAllJobs([]);
    autoPagesRef.current = 0;
  }, [type, statusFilter, planFilter, searchQuery]);

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

  // What's actually shown, before the text-search filter.
  //
  // Regular jobs are mine-only: keep the is_mine guard as a safety net in case
  // the backend ever ignores scope=mine. Greenline (partner) jobs are a SHARED
  // pool worked by every matchmaking caller, so they must NOT be filtered by
  // ownership — doing so is what left the Partner tab blank, since those jobs
  // belong to whoever first took them (is_mine=false for everyone else).
  const mineJobs = useMemo(
    () => (type === 'greenline' ? allJobs : allJobs.filter((j: any) => j.is_mine)),
    [allJobs, type]
  );

  const filtered = useMemo(() => {
    if (!searchQuery) return mineJobs;
    const q = searchQuery.toLowerCase();
    return mineJobs.filter((j: any) =>
      j.job_title?.toLowerCase().includes(q) ||
      j.job_id?.toLowerCase().includes(q) ||
      j.transporter_name?.toLowerCase().includes(q) ||
      j.location?.toLowerCase().includes(q)
    );
  }, [mineJobs, searchQuery]);

  const pagination = data?.data?.pagination;

  // Auto-advance pagination until the server says there are no more pages, so
  // EVERY one of the caller's jobs for this filter is loaded. We deliberately
  // drive on has_more rather than any precomputed total — the dashboard's
  // aggregate has been seen to undercount (it reported 12 when the agent really
  // has 16 open jobs), and stopping at that number would hide the extra ones.
  // Capped so a backend that ignores scope='mine' can't make us walk the whole
  // job table.
  useEffect(() => {
    if (!data || isFetching) return;
    if (!pagination?.has_more) return;
    if (autoPagesRef.current >= 40) return;   // hard safety cap (~800 rows)
    autoPagesRef.current += 1;
    setCursor(pagination.next_cursor);
  }, [data, isFetching, pagination]);

  // True until all pages for this filter have been pulled.
  const stillLoadingMine = isLoading || isFetching || !!pagination?.has_more;

  // Once fully loaded, report the real total so the parent's badges match
  // what's on screen. Skipped while a text search or plan filter is narrowing
  // the set, since those would report a partial count for the tab+status.
  useEffect(() => {
    if (stillLoadingMine || searchQuery || planFilter) return;
    onLoadedCount(countKey, mineJobs.length);
  }, [stillLoadingMine, searchQuery, planFilter, mineJobs.length, countKey, onLoadedCount]);

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
            onViewTransporter={() => setTransporterView({
              id: Number(job.transporter_id),
              name: job.transporter_name,
              tmid: job.tm_user_id,
            })}
          />
        ))}
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

      {stillLoadingMine && (
        <div className="flex justify-center items-center gap-2 mt-4 text-[11px] text-gray-400">
          <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
          Loading your jobs…
        </div>
      )}

      <p className="text-center text-[10px] text-gray-400 mt-3 pb-2">
        {searchQuery
          ? `${filtered.length} match${filtered.length !== 1 ? 'es' : ''} in your jobs`
          : `${filtered.length} of your job${filtered.length !== 1 ? 's' : ''}`}
      </p>
    </>
  );
};


// ── Global job lookup (ANY agent's job) ───────────────────────────────────────
//
// The board grid is scoped to the signed-in agent, but SEARCH is deliberately
// system-wide: an agent can look up ANY job in the database from whatever
// fragment they have — full or partial job id, transporter name, TMID (full or
// last digits) or mobile number. Results are badged with their owner; opening a
// job that isn't the agent's shows it read-only (details + applicants, no
// calls — enforced in MmJobDetail via is_mine). Nothing here is filtered by
// ownership, so type='any' with no scope.
const GlobalJobSearch: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState('');
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const t = setTimeout(() => setTerm(value.trim()), 350);
    return () => clearTimeout(t);
  }, [value]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  const { data, isFetching } = useGetMmJobListingsQuery(
    { type: 'any', section: 'all', search: term, limit: 25 },
    { skip: term.length < 3 }
  );
  // System-wide: every job that matches, whoever owns it.
  const results = data?.data?.jobs ?? [];

  return (
    <div ref={boxRef} className="relative flex-1 max-w-md">
      <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
      <input
        value={value}
        onChange={e => { onChange(e.target.value); setOpen(true); }}
        onFocus={() => setOpen(true)}
        placeholder="Search ANY job — job id, last 5 digits, transporter, TMID, mobile…"
        className="w-full pl-8 pr-8 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#8E44AD] bg-white"
      />
      {value && (
        <button
          onClick={() => { onChange(''); setOpen(false); }}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <span className="material-symbols-outlined text-sm">close</span>
        </button>
      )}

      {open && term.length >= 3 && (
        <div className="absolute z-40 top-full mt-1 left-0 right-0 bg-white border border-gray-200 rounded-xl shadow-xl max-h-[420px] overflow-y-auto custom-scrollbar">
          {isFetching ? (
            <p className="px-3 py-4 text-[11px] text-gray-400 text-center">Searching all jobs…</p>
          ) : results.length === 0 ? (
            <p className="px-3 py-4 text-[11px] text-gray-400 text-center">No job matches “{term}”.</p>
          ) : (
            <>
              <p className="px-3 py-1.5 text-[9px] font-extrabold text-gray-400 uppercase border-b border-gray-100 sticky top-0 bg-white">
                {results.length} job{results.length !== 1 ? 's' : ''} across all agents
              </p>
              {results.map(job => (
                <button
                  key={job.id}
                  onClick={() => {
                    setOpen(false);
                    navigate('/mm/mm-job-detail', { state: { jobId: job.job_id } });
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-purple-50 border-b border-gray-50 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] font-bold text-black shrink-0">{job.job_id}</span>
                    <span className="font-bold text-gray-800 text-[11px] truncate flex-1">{job.job_title}</span>
                    <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ${statusBadge(job.status)}`}>
                      {job.status}
                    </span>
                    {/* Ownership: YOURS (callable) vs another agent (view-only) */}
                    <span
                      className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded shrink-0 ${
                        job.is_mine ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                      }`}
                      title={job.is_mine ? 'Assigned to you' : 'Another agent — view only, no calls'}
                    >
                      {job.is_mine ? 'YOURS' : (job.assigned_to_name || 'OTHER AGENT')}
                    </span>
                  </div>
                  <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                    {job.transporter_name}
                    {job.tm_user_id ? ` · ${job.tm_user_id}` : ''}
                    {job.transporter_mobile ? ` · ${job.transporter_mobile}` : ''}
                  </p>
                  <p className="text-[9.5px] text-gray-400 truncate">
                    {[job.location, job.status, job.plan_type, `${job.applicants_count} applicants`]
                      .filter(Boolean).join(' · ')}
                  </p>
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
export const MmJobBoard: React.FC = () => {
  // Filters are sticky: opening a job unmounts this page, and without this the
  // agent came back to a reset board. They default to OPEN jobs — the only ones
  // an agent can actually action — rather than every job ever posted.
  const [activeTab, setActiveTab] = useStickyState<'regular' | 'greenline'>('mm_job_board_tab', 'regular');
  const [statusFilter, setStatusFilter] = useStickyState('mm_job_board_status', 'open');
  const [planFilter, setPlanFilter] = useStickyState('mm_job_board_plan', '');
  const [search, setSearch] = useStickyState('mm_job_board_search', '');
  const listScrollRef = useStickyScroll<HTMLDivElement>('mm_job_board_scroll');

  // A job the agent left open stays open: coming back from any other screen
  // reopens it instead of dumping the agent on the list. Read once on mount so
  // a later "← Job Board" (which clears the key) doesn't bounce straight back.
  const navigate = useNavigate();
  const [reopenJobId] = useState(() => openJobSession.get());
  useEffect(() => {
    if (reopenJobId) {
      navigate('/mm/mm-job-detail', { state: { jobId: reopenJobId }, replace: true });
    }
  }, [reopenJobId, navigate]);

  // Same as the home dashboard: the tab counts must not be pinned to whatever
  // the first fetch of the session returned.
  const { data: dashData } = useGetMmDashboardQuery(undefined, {
    skip: !!reopenJobId,
    refetchOnMountOrArgChange: true,
  });
  // The caller's assigned jobs per tab, per status. The badge follows the
  // active status pill — pick "Open 59" and the tab reads 59 — instead of
  // showing a system-wide total that answers a different question.
  const statusCounts = dashData?.data?.job_status_counts;

  // The grid reports how many of the caller's own jobs it actually loaded for a
  // given tab+status. That real, on-screen number is authoritative — the
  // dashboard's job_status_counts aggregate has been seen to undercount (12 vs
  // an actual 16). We prefer the live count wherever we have it and fall back to
  // the dashboard figure only until the grid has loaded that slice.
  const [liveCounts, setLiveCounts] = useState<Record<string, number>>({});
  const countKeyFor = (type: 'regular' | 'greenline', status: string) => `${type}:${status || 'all'}`;
  const handleLoadedCount = useCallback((key: string, count: number) => {
    setLiveCounts(prev => (prev[key] === count ? prev : { ...prev, [key]: count }));
  }, []);

  const assignedCount = (type: 'regular' | 'greenline'): number | undefined => {
    const live = liveCounts[countKeyFor(type, statusFilter)];
    if (live !== undefined) return live;
    const bucket = statusCounts?.[type];
    if (!bucket) return undefined;
    const key = (statusFilter || 'all') as keyof typeof bucket;
    return bucket[key] ?? bucket.all;
  };
  // Caller's own count for the active tab under a specific status pill. Prefers
  // the grid's live count; falls back to the dashboard's assigned totals (never
  // the system-wide `stats`, which count every job ever posted).
  const myStatusCount = (statusKey: '' | 'open' | 'hold' | 'closed' | 'expired' | 'expiring_soon'): number | undefined => {
    const live = liveCounts[countKeyFor(activeTab, statusKey)];
    if (live !== undefined) return live;
    const bucket = statusCounts?.[activeTab];
    if (!bucket) return undefined;
    return statusKey ? bucket[statusKey] : bucket.all;
  };

  // Redirecting — don't paint the board behind it.
  if (reopenJobId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-60px)] text-gray-400">
        <span className="material-symbols-outlined text-3xl animate-spin">progress_activity</span>
      </div>
    );
  }

  const tabs = [
    {
      id: 'regular' as const,
      label: 'In-System Jobs',
      count: assignedCount('regular'),
      icon: 'work',
      desc: `Regular transporter jobs assigned to you`,
    },
    {
      id: 'greenline' as const,
      label: 'Partner / Retail Jobs',
      count: assignedCount('greenline'),
      icon: 'handshake',
      desc: `Greenline, Mahindra & other partner jobs — shared across all callers`,
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

          {/* Global job lookup — every job in the system, whoever owns it */}
          <GlobalJobSearch value={search} onChange={setSearch} />

          <div className="flex items-center gap-2 ml-auto">
            {/* Status pills with live counts */}
            <div className="flex gap-1 flex-wrap">
              {[
                { label: 'All',           value: '',              count: myStatusCount('') },
                { label: 'Open',          value: 'open',          count: myStatusCount('open') },
                { label: 'Hold',          value: 'hold',          count: myStatusCount('hold') },
                { label: 'Closed',        value: 'closed',        count: myStatusCount('closed') },
                { label: 'Expired',       value: 'expired',       count: myStatusCount('expired') },
                { label: 'Expiring Soon', value: 'expiring_soon', count: myStatusCount('expiring_soon'), warn: true },
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
      <div ref={listScrollRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar">
        <JobsGrid
          key={`${activeTab}-${statusFilter}-${planFilter}-${search}`}
          type={activeTab}
          statusFilter={statusFilter}
          planFilter={planFilter}
          searchQuery={search}
          countKey={countKeyFor(activeTab, statusFilter)}
          onLoadedCount={handleLoadedCount}
        />
      </div>
    </main>
  );
};

export default MmJobBoard;
