import React, { useEffect, useMemo, useState } from 'react';
import {
  useGetTlMatchmakingBoardQuery,
  useGetTlMatchmakingCandidatesQuery,
  useAssignTlMatchmakingJobMutation,
} from '../../services/api/webCrmApi';
import type { TlBoardColumn, TlBoardJob } from '../../services/api/webCrmApi';

// ── TL Matchmaking Job Board ────────────────────────────────────────────────
//
// Every card, count and candidate on this screen is live data from
// TeamLeaderController@matchmakingBoard — real `jobs` rows with their
// transporter, their assigned specialist from `admins`, their applicants from
// `applyjobs` and their matchmaking activity from `jobs_match_making` /
// `call_history_ivr`. Column placement and the SLA clock are decided
// server-side so the board, its counts and the drawer can never disagree.

const COLUMNS: { key: TlBoardColumn; title: string; hint: string; accent: string }[] = [
  { key: 'open',        title: 'Open / Not Started', hint: 'Live jobs with no calls or matches yet', accent: 'border-t-blue-500' },
  { key: 'in_progress', title: 'In Progress',        hint: 'Matchmaking activity logged, not filled', accent: 'border-t-orange-500' },
  { key: 'sla_risk',    title: 'SLA Risk',           hint: 'Deadline closing in', accent: 'border-t-red-500 ring-1 ring-red-200' },
  { key: 'filled',      title: 'Filled',             hint: 'Closed by transporter or driver selected', accent: 'border-t-green-500' },
  { key: 'expired',     title: 'Expired / Missed',   hint: 'Deadline passed with no placement', accent: 'border-t-gray-400' },
];

/** Deadline distance, from the server's signed minutes-left. */
const slaLabel = (mins: number | null): string => {
  if (mins === null) return 'No deadline';
  const past = mins < 0;
  const m = Math.abs(mins);
  const d = Math.floor(m / 1440);
  const h = Math.floor((m % 1440) / 60);
  const text = d > 0 ? `${d}d ${h}h` : h > 0 ? `${h}h ${m % 60}m` : `${m}m`;
  return past ? `${text} overdue` : `${text} left`;
};

const slaTone = (mins: number | null): string => {
  if (mins === null) return 'text-gray-400';
  if (mins < 0) return 'text-gray-500';
  if (mins <= 24 * 60) return 'text-red-600';
  if (mins <= 7 * 24 * 60) return 'text-amber-600';
  return 'text-gray-500';
};

const planBadge = (plan: string) =>
  plan === 'SUPER PREMIUM' ? 'bg-purple-100 text-purple-700'
  : plan === 'PREMIUM' ? 'bg-amber-100 text-[#D35400]'
  : 'bg-gray-100 text-gray-600';

const fitTone = (fit: number) =>
  fit >= 75 ? 'bg-green-100 text-green-700'
  : fit >= 50 ? 'bg-amber-100 text-amber-700'
  : 'bg-gray-100 text-gray-500';

const shortDate = (v?: string | null) =>
  v ? new Date(v.replace(' ', 'T')).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

export const TlMatchmakingJobBoard: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [agentFilter, setAgentFilter] = useState<number | ''>('');
  const [selectedJob, setSelectedJob] = useState<TlBoardJob | null>(null);

  const [assignJob, setAssignJob] = useState<TlBoardJob | null>(null);
  const [targetAgent, setTargetAgent] = useState<number | ''>('');
  const [assignReason, setAssignReason] = useState('');

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Debounced so typing in the search box doesn't fire a board query per keystroke.
  const [debouncedSearch, setDebouncedSearch] = useState('');
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 400);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isLoading, isFetching, isError, refetch } = useGetTlMatchmakingBoardQuery({
    search: debouncedSearch || undefined,
    agent_id: agentFilter || undefined,
  });

  const board = data?.data?.board;
  const agents = useMemo(() => data?.data?.agents ?? [], [data]);
  const summary = data?.data?.summary;

  // Drawer candidates — only fetched while a job is open.
  const { data: candData, isFetching: candLoading } = useGetTlMatchmakingCandidatesQuery(
    selectedJob?.id as number,
    { skip: !selectedJob }
  );
  const candidates = candData?.data?.candidates ?? [];

  const [assign, { isLoading: isAssigning }] = useAssignTlMatchmakingJobMutation();

  const openAssign = (job: TlBoardJob) => {
    setAssignJob(job);
    setTargetAgent('');
    setAssignReason('');
  };

  const handleConfirmAssign = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!assignJob || !targetAgent) { triggerToast('Select a matchmaking specialist.'); return; }
    if (!assignReason.trim()) { triggerToast('Reason is required to execute a manual job override.'); return; }
    try {
      const res = await assign({
        job_row_id: assignJob.id,
        admin_id: Number(targetAgent),
        reason: assignReason.trim(),
      }).unwrap();
      triggerToast(res.message);
      if (res.status) {
        setAssignJob(null);
        setSelectedJob(prev => (prev && res.data && prev.id === res.data.job_row_id
          ? { ...prev, assigned_to: res.data.assigned_to, assigned_name: res.data.assigned_name }
          : prev));
      }
    } catch {
      triggerToast('Could not assign the job — please retry.');
    }
  };

  const slaRiskJobs = board?.sla_risk?.jobs ?? [];

  return (
    <main className="flex flex-col h-[calc(100vh-60px)] bg-white overflow-hidden relative">

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#F39C12]"></span>
          {toast}
        </div>
      )}

      {/* SLA alarm strip — real count of jobs inside the deadline window */}
      {!!summary && summary.sla_risk > 0 && (
        <div className="bg-red-50 border-b border-red-200 text-red-700 px-4 py-2.5 flex justify-between items-center shrink-0 text-xs font-bold">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-red-600 text-[18px]">warning</span>
            <span>
              CRITICAL: {summary.sla_risk} matchmaking job{summary.sla_risk !== 1 ? 's' : ''} inside the{' '}
              {Math.round(summary.sla_risk_hours / 24)}-day deadline window
              {slaRiskJobs.length > 0 && ` — soonest ${slaLabel(slaRiskJobs[0].sla_minutes_left)}`}. Reassign to specialists!
            </span>
          </div>
          <button
            onClick={() => { const j = slaRiskJobs[0]; if (j) setSelectedJob(j); }}
            className="underline text-[10.5px] hover:text-red-900"
          >
            View Risk Board
          </button>
        </div>
      )}

      {/* Header controls */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center gap-4 shrink-0 flex-wrap">
        <div>
          <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">TL Matchmaking Job Board</h1>
          <p className="text-[10px] text-gray-400">
            Monitor driver-shipper matchmaking queues, SLA risk status, and candidate fit
            {summary && ` · ${summary.total_on_board} jobs on board · finished jobs kept ${summary.window_days} days`}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Job, TMJB id, route, transporter, agent…"
              className="pl-7 pr-2 py-1.5 w-64 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#F39C12] bg-white"
            />
          </div>

          <select
            value={agentFilter}
            onChange={e => setAgentFilter(e.target.value ? Number(e.target.value) : '')}
            className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs bg-white font-semibold text-gray-700 outline-none"
          >
            <option value="">All specialists</option>
            {agents.map(a => (
              <option key={a.id} value={a.id}>{a.name} ({a.live_jobs} live)</option>
            ))}
          </select>

          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="bg-white border border-gray-200 hover:border-[#F39C12] text-gray-700 px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1 disabled:opacity-50"
          >
            <span className={`material-symbols-outlined text-sm ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
            <span>Sync Board</span>
          </button>
        </div>
      </div>

      {/* Board */}
      {isError ? (
        <div className="flex-1 flex flex-col items-center justify-center text-gray-400 gap-2">
          <span className="material-symbols-outlined text-4xl text-red-300">error</span>
          <p className="text-sm font-semibold">Could not load the matchmaking board</p>
          <button onClick={() => refetch()} className="text-xs font-bold text-[#F39C12] hover:underline">Retry</button>
        </div>
      ) : (
        <div className="flex-1 flex overflow-x-auto p-4 gap-4 bg-gray-50/50">
          {COLUMNS.map(col => {
            const bucket = board?.[col.key];
            const jobs = bucket?.jobs ?? [];
            return (
              <div
                key={col.key}
                className={`w-72 rounded-xl border border-gray-200 border-t-4 flex flex-col h-full shrink-0 shadow-sm bg-white/60 ${col.accent}`}
              >
                <div className="p-3 border-b border-gray-200 bg-white rounded-t-xl select-none">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-extrabold text-gray-700 uppercase tracking-wider">{col.title}</span>
                    <span className="bg-gray-100 text-gray-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {isLoading ? '…' : bucket?.total ?? 0}
                    </span>
                  </div>
                  <p className="text-[9px] text-gray-400 mt-0.5">
                    {col.key === 'sla_risk' && summary
                      ? `Deadline within ${Math.round(summary.sla_risk_hours / 24)} days`
                      : col.hint}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
                  {isLoading ? (
                    [...Array(3)].map((_, i) => <div key={i} className="h-24 bg-white border border-gray-100 rounded-xl animate-pulse" />)
                  ) : jobs.length === 0 ? (
                    <p className="text-[10px] text-gray-400 italic text-center py-6">No jobs in this stage.</p>
                  ) : (
                    jobs.map(job => {
                      const isRisk = job.column === 'sla_risk';
                      return (
                        <div
                          key={job.id}
                          onClick={() => setSelectedJob(job)}
                          className={`bg-white border rounded-xl p-3 shadow-sm hover:shadow-md transition-shadow cursor-pointer ${
                            isRisk ? 'border-red-400 ring-2 ring-red-100' : 'border-gray-200'
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1.5 text-[9px] font-extrabold gap-2">
                            <span className="text-gray-400 font-mono shrink-0">{job.job_id}</span>
                            <div className="flex items-center gap-1">
                              {job.is_greenline && (
                                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">GREENLINE</span>
                              )}
                              <span className={`px-1.5 py-0.5 rounded ${planBadge(job.plan_type)}`}>{job.plan_type}</span>
                            </div>
                          </div>

                          <p className="font-bold text-gray-800 text-xs leading-snug line-clamp-2">{job.title}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                            {job.transporter.name || 'Transporter'}
                            {job.location ? ` · ${job.location}` : ''}
                          </p>

                          <div className="mt-2 flex items-center gap-2 text-[9.5px] font-bold text-gray-500 flex-wrap">
                            <span className="bg-gray-50 border border-gray-150 rounded px-1.5 py-0.5">
                              {job.applicants_count} applied
                            </span>
                            {job.matched_count > 0 && (
                              <span className="bg-blue-50 text-blue-700 rounded px-1.5 py-0.5">{job.matched_count} matched</span>
                            )}
                            {job.selected_count > 0 && (
                              <span className="bg-green-50 text-green-700 rounded px-1.5 py-0.5">{job.selected_count} placed</span>
                            )}
                            {job.calls_count > 0 && (
                              <span className="bg-purple-50 text-purple-700 rounded px-1.5 py-0.5">{job.calls_count} calls</span>
                            )}
                          </div>

                          <div className="mt-2.5 flex justify-between items-center text-[10px] gap-2">
                            <div className={`flex items-center gap-1 font-semibold ${slaTone(job.sla_minutes_left)}`}>
                              <span className="material-symbols-outlined text-[13px]">timer</span>
                              <span>{slaLabel(job.sla_minutes_left)}</span>
                            </div>

                            {job.assigned_name ? (
                              <button
                                onClick={e => { e.stopPropagation(); openAssign(job); }}
                                title="Reassign this job"
                                className="text-[10px] text-gray-500 font-bold bg-gray-50 border border-gray-150 px-1.5 py-0.5 rounded hover:border-[#F39C12] hover:text-[#D35400] truncate max-w-[110px]"
                              >
                                {job.assigned_name}
                              </button>
                            ) : (
                              <button
                                onClick={e => { e.stopPropagation(); openAssign(job); }}
                                className="bg-orange-50 border border-[#F39C12] text-[#D35400] px-2 py-0.5 rounded text-[9.5px] font-extrabold hover:bg-[#F39C12] hover:text-white transition-colors shrink-0"
                              >
                                Assign Specialist
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}

                  {!isLoading && bucket && bucket.total > jobs.length && (
                    <p className="text-[9px] text-gray-400 text-center pt-1">
                      Showing {jobs.length} of {bucket.total}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* JOB DETAIL DRAWER */}
      {selectedJob && (
        <div className="absolute inset-y-0 right-0 w-96 bg-white border-l border-gray-200 shadow-2xl z-40 flex flex-col text-xs">
          <div className="p-4 border-b border-gray-200 flex justify-between items-start bg-gray-50 shrink-0">
            <div className="min-w-0">
              <h3 className="font-extrabold text-gray-800 uppercase tracking-wide text-xs">Job Board Detail</h3>
              <span className="text-[10px] text-gray-400 font-mono">{selectedJob.job_id}</span>
            </div>
            <button onClick={() => setSelectedJob(null)} className="text-gray-400 hover:text-gray-600 font-bold px-1 text-sm">✕</button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            <div className="space-y-1.5">
              <p className="font-bold text-gray-800 text-xs leading-snug">{selectedJob.title}</p>
              <div className="flex flex-wrap gap-1.5">
                <span className={`text-[9.5px] px-2 py-0.5 rounded font-extrabold uppercase ${planBadge(selectedJob.plan_type)}`}>
                  {selectedJob.plan_type}
                </span>
                <span className={`bg-gray-100 text-[9.5px] px-2 py-0.5 rounded font-extrabold uppercase ${slaTone(selectedJob.sla_minutes_left)}`}>
                  {slaLabel(selectedJob.sla_minutes_left)}
                </span>
                {!selectedJob.is_verified && (
                  <span className="bg-amber-100 text-amber-700 text-[9.5px] px-2 py-0.5 rounded font-extrabold uppercase">Pending verification</span>
                )}
              </div>
            </div>

            <dl className="grid grid-cols-2 gap-x-3 gap-y-2 text-[10px]">
              {([
                ['Transporter', selectedJob.transporter.name],
                ['TMID', selectedJob.transporter.tmid],
                ['Mobile', selectedJob.transporter.mobile],
                ['Location', selectedJob.location],
                ['Route', selectedJob.route],
                ['Vehicle', selectedJob.vehicle_type],
                ['Licence', selectedJob.license_type],
                ['Experience', selectedJob.experience],
                ['Salary', selectedJob.salary_range],
                ['Drivers needed', String(selectedJob.drivers_required)],
                ['Posted', shortDate(selectedJob.posted_at)],
                ['Deadline', shortDate(selectedJob.deadline)],
                ['Owner', selectedJob.assigned_name || 'Unassigned'],
                ['Last activity', shortDate(selectedJob.last_activity_at)],
              ] as [string, string | null][])
                .filter(([, v]) => v)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="text-gray-400 font-bold uppercase text-[9px]">{label}</dt>
                    <dd className="text-gray-700 font-semibold break-words">{value}</dd>
                  </div>
                ))}
            </dl>

            {/* Candidate shortlist — real applicants, scored on stored attributes */}
            <div className="space-y-2 pt-2 border-t border-gray-150">
              <div className="flex items-baseline justify-between">
                <h4 className="text-[10.5px] font-bold text-gray-800 uppercase tracking-wider">Candidate shortlist</h4>
                {candData && (
                  <span className="text-[9px] text-gray-400 font-semibold">
                    top {candData.data.shortlisted} of {candData.data.total_applicants}
                  </span>
                )}
              </div>

              {candLoading ? (
                <div className="py-8 text-center text-gray-400">
                  <span className="material-symbols-outlined text-2xl animate-spin">progress_activity</span>
                </div>
              ) : candidates.length === 0 ? (
                <p className="text-[10px] text-gray-400 italic py-4 text-center">No drivers have applied to this job yet.</p>
              ) : (
                <div className="space-y-2">
                  {candidates.map(c => (
                    <div key={c.application_id} className="p-2.5 bg-gray-50 border border-gray-150 rounded-xl space-y-1">
                      <div className="flex justify-between items-center gap-2">
                        <span className="font-bold text-gray-800 truncate">{c.name || 'Driver'}</span>
                        <span
                          className={`text-[9.5px] px-1.5 py-0.5 rounded font-extrabold shrink-0 ${fitTone(c.fit)}`}
                          title={`Vehicle ${c.fit_breakdown.vehicle}/30 · Licence ${c.fit_breakdown.licence}/25 · Experience ${c.fit_breakdown.experience}/20 · Location ${c.fit_breakdown.location}/15 · Profile ${c.fit_breakdown.profile}/10`}
                        >
                          {c.fit}% fit
                        </span>
                      </div>
                      <p className="text-[10px] text-gray-500 font-semibold">
                        {c.vehicles.slice(0, 2).join(' · ') || 'Vehicle not set'}
                        {c.experience ? ` · ${c.experience.replace('_', '–')} yrs` : ''}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {[c.city, c.state].filter(Boolean).join(', ') || 'Location not set'}
                        {c.license_type ? ` · ${c.license_type.toUpperCase()}` : ''}
                      </p>
                      <div className="pt-1 flex justify-between items-center gap-2">
                        <span className="font-mono text-gray-400 text-[9.5px] truncate">{c.tmid}</span>
                        <div className="flex items-center gap-1 shrink-0">
                          {c.match_status && (
                            <span className="text-[9px] font-bold bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-500">
                              {c.match_status}
                            </span>
                          )}
                          <span className="text-[9px] font-bold bg-white border border-gray-200 rounded px-1.5 py-0.5 text-gray-500">
                            {c.application_status}
                          </span>
                          {c.mobile && (
                            <a
                              href={`tel:${c.mobile}`}
                              className="bg-white border border-gray-200 text-gray-600 px-1.5 py-0.5 rounded hover:bg-[#F39C12] hover:text-white hover:border-[#F39C12] transition-colors text-[9.5px] font-bold"
                            >
                              {c.mobile}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50 flex gap-2 shrink-0">
            <button
              onClick={() => openAssign(selectedJob)}
              className="flex-1 bg-[#F39C12] hover:bg-[#e08e0b] text-white py-2 rounded-lg font-bold text-xs shadow"
            >
              {selectedJob.assigned_name ? 'Reassign Specialist' : 'Assign Specialist'}
            </button>
            <button
              onClick={() => setSelectedJob(null)}
              className="flex-1 bg-white border border-gray-200 text-gray-500 py-2 rounded-lg font-bold text-xs"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* ASSIGN / REASSIGN MODAL */}
      {assignJob && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100 text-xs">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-orange-600">manage_accounts</span>
              Assign Matchmaker Override
            </h3>
            <p className="text-[10px] text-gray-400 mb-4 font-mono">
              {assignJob.job_id} · currently {assignJob.assigned_name || 'unassigned'}
            </p>

            <form onSubmit={handleConfirmAssign} className="space-y-4">
              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Select Matchmaking Specialist</label>
                <select
                  value={targetAgent}
                  onChange={e => setTargetAgent(e.target.value ? Number(e.target.value) : '')}
                  required
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 bg-white outline-none font-semibold text-gray-800"
                >
                  <option value="">Select agent…</option>
                  {agents.map(a => (
                    <option key={a.id} value={a.id} disabled={a.id === assignJob.assigned_to}>
                      {a.name} · {a.live_jobs} live job{a.live_jobs !== 1 ? 's' : ''}
                      {a.id === assignJob.assigned_to ? ' (current owner)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Operational Reason</label>
                <textarea
                  value={assignReason}
                  onChange={e => setAssignReason(e.target.value)}
                  required
                  placeholder="Justify this manual assignment override (required)…"
                  rows={3}
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 outline-none font-medium text-gray-800 resize-none"
                />
                <p className="text-[9px] text-gray-400 mt-1">Stored with the handover for audit.</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setAssignJob(null)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isAssigning}
                  className="px-4 py-2 bg-[#F39C12] hover:bg-[#e08e0b] text-white rounded font-bold shadow-sm disabled:opacity-50 flex items-center gap-1.5"
                >
                  {isAssigning && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                  Assign specialist
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};

export default TlMatchmakingJobBoard;
