import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  useGetMmJobDetailQuery,
  useGetMmJobTransporterDetailQuery,
  useGetMmApplicantsFullQuery,
  type MmApplicant,
} from '../../services/api/webCrmApi';
import { useMmCallFlow } from './useMmCallFlow';

// ── helpers ─────────────────────────────────────────────────────────────────
const pipelineBadge = (status: string) => {
  const map: Record<string, string> = {
    Applied: 'bg-gray-100 text-gray-600',
    'Screening Done': 'bg-blue-100 text-blue-700',
    'Online Interview Scheduled': 'bg-indigo-100 text-indigo-700',
    'Physical Interview Scheduled': 'bg-purple-100 text-purple-700',
    Selected: 'bg-green-100 text-green-700',
    Rejected: 'bg-red-100 text-red-600',
    Intransit: 'bg-teal-100 text-teal-700',
    Shortlisted: 'bg-amber-100 text-amber-700',
  };
  return map[status] || 'bg-gray-100 text-gray-500';
};

const callStatusBadge = (status: string) => {
  if (status === 'New') return 'bg-blue-50 text-blue-600 border-blue-200';
  if (status === 'Connected') return 'bg-green-50 text-green-700 border-green-200';
  if (status === 'Not Interested') return 'bg-red-50 text-red-600 border-red-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
};

// ── Query error panel (shared retry state) ──────────────────────────────────
const ErrorPanel: React.FC<{ label: string; onRetry: () => void }> = ({ label, onRetry }) => (
  <div className="flex flex-col items-center justify-center py-8 text-gray-400">
    <span className="material-symbols-outlined text-3xl mb-2 text-red-300">error</span>
    <p className="font-semibold text-[11px]">{label}</p>
    <button
      onClick={onRetry}
      className="mt-2 px-4 py-1.5 border border-[#8E44AD] text-[#8E44AD] rounded-lg font-bold text-[10px] hover:bg-purple-50"
    >
      Retry
    </button>
  </div>
);

// ── Applicant Card ────────────────────────────────────────────────────────────
interface ApplicantCardProps {
  driver: MmApplicant;
  onCall: (driver: MmApplicant) => void;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ driver, onCall }) => {
  const [expanded, setExpanded] = useState(false);
  const timeline = driver.call_timeline ?? [];

  return (
    <div className={`bg-white border rounded-xl transition-shadow ${driver.is_matched ? 'border-green-300 shadow-green-50 shadow' : 'border-gray-200 hover:shadow-sm'}`}>
      {/* Card header */}
      <div
        className="p-3 flex items-center gap-3 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shrink-0">
          {driver.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-850 text-xs truncate">{driver.name}</span>
            {driver.is_matched && (
              <span className="shrink-0 text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">MATCHED</span>
            )}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <span className="font-mono text-[10px] text-gray-400">{driver.unique_id}</span>
            {driver.state && <span className="text-[10px] text-gray-400">· {driver.state}</span>}
            {driver.experience && <span className="text-[10px] text-gray-400">· {driver.experience}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${callStatusBadge(driver.call_status)}`}>
            {driver.call_status}
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${pipelineBadge(driver.pipeline_status)}`}>
            {driver.pipeline_status}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onCall(driver); }}
            className="bg-[#1A5276] hover:bg-[#154360] text-white px-3 py-1.5 rounded-lg font-bold text-[10px] shadow-sm flex items-center gap-1"
            title="Call this applicant via CTI — feedback opens automatically after the call"
          >
            <span className="material-symbols-outlined text-xs">call</span>Call
          </button>
          <span className={`material-symbols-outlined text-gray-400 text-sm transition-transform ${expanded ? 'rotate-180' : ''}`}>
            expand_more
          </span>
        </div>
      </div>

      {/* Expanded profile */}
      {expanded && (
        <div className="border-t border-gray-100 p-3 space-y-3 text-xs bg-gray-50/50">
          {/* Profile details */}
          <div className="grid grid-cols-3 gap-2">
            {[
              ['Mobile', driver.mobile],
              ['Age', driver.age ? `${driver.age} yrs` : null],
              ['Experience', driver.experience],
              ['Income', driver.income],
              ['State', driver.state],
              ['Applied At', driver.applied_at],
            ].filter(([, v]) => v).map(([label, val]) => (
              <div key={label as string} className="bg-white rounded-lg p-2 border border-gray-100">
                <p className="text-[9px] text-gray-400 uppercase font-bold">{label}</p>
                <p className="font-semibold text-gray-800 mt-0.5 truncate">{val}</p>
              </div>
            ))}
          </div>

          {/* Pipeline + Match Making status */}
          <div className="flex gap-2">
            <div className="flex-1 bg-white rounded-lg p-2 border border-gray-100">
              <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Pipeline</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${pipelineBadge(driver.pipeline_status)}`}>
                {driver.pipeline_status}
              </span>
              {driver.pipeline_detail && <p className="text-[10px] text-gray-500 mt-1">{driver.pipeline_detail}</p>}
            </div>
            {driver.match_making_status && (
              <div className="flex-1 bg-white rounded-lg p-2 border border-gray-100">
                <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Match Making</p>
                <span className={`text-[10px] font-bold capitalize px-2 py-0.5 rounded ${driver.match_making_status.status === 'selected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                  {driver.match_making_status.status}
                </span>
                <p className="text-[10px] text-gray-500 mt-1">{driver.match_making_status.feedback}</p>
                <p className="text-[9px] text-gray-400">{driver.match_making_status.called_at}</p>
              </div>
            )}
          </div>

          {/* Selected jobs */}
          {driver.selected_jobs?.length > 0 && (
            <div className="bg-green-50 rounded-lg p-2 border border-green-200">
              <p className="text-[9px] text-green-600 uppercase font-bold mb-1">Previously Selected For</p>
              {driver.selected_jobs.map((sj, i) => (
                <div key={i} className="text-[10px] text-green-800 font-semibold">
                  {sj.job_title} · {sj.job_location} · {sj.selected_at}
                </div>
              ))}
            </div>
          )}

          {/* Full Call Timeline */}
          {timeline.length > 0 ? (
            <div className="bg-white rounded-lg p-2 border border-gray-100">
              <p className="text-[9px] text-gray-400 uppercase font-bold mb-2">
                Call Timeline <span className="text-gray-300 font-normal">({timeline.length} entries)</span>
              </p>
              <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
                {timeline.map((entry, i) => (
                  <div key={i} className="flex gap-2 items-start text-[10px]">
                    <div className="shrink-0 mt-0.5">
                      <div className={`w-2 h-2 rounded-full mt-0.5 ${
                        entry.call_status === 'connected' ? 'bg-green-500' :
                        entry.call_status === 'not_connected' ? 'bg-red-400' : 'bg-amber-400'
                      }`} />
                      {i < timeline.length - 1 && (
                        <div className="w-px h-full bg-gray-200 ml-[3px] mt-0.5 min-h-[12px]" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`font-bold capitalize text-[9px] px-1.5 py-0.5 rounded border ${callStatusBadge(entry.call_status === 'connected' ? 'Connected' : entry.call_status === 'not_connected' ? 'Not Connected' : 'Pending')}`}>
                          {entry.call_status?.replace('_', ' ') || '—'}
                        </span>
                        {entry.match_status && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${entry.match_status === 'selected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {entry.match_status}
                          </span>
                        )}
                        {entry.process && (
                          <span className="text-[9px] text-indigo-600 font-semibold bg-indigo-50 px-1 py-0.5 rounded">
                            {entry.process}
                          </span>
                        )}
                      </div>
                      {entry.feedback && (
                        <p className="text-gray-700 font-semibold mt-0.5 truncate" title={entry.feedback}>{entry.feedback}</p>
                      )}
                      {entry.remarks && (
                        <p className="text-gray-400 mt-0.5 truncate" title={entry.remarks}>{entry.remarks}</p>
                      )}
                      <div className="flex items-center gap-2 mt-0.5 text-[9px] text-gray-400">
                        {entry.called_by && <span>by <strong className="text-gray-600">{entry.called_by}</strong></span>}
                        <span className="ml-auto">{entry.called_at}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : driver.last_call_time ? (
            <div className="bg-white rounded-lg p-2 border border-gray-100">
              <p className="text-[9px] text-gray-400 uppercase font-bold mb-1">Last Call</p>
              <div className="flex items-center gap-2">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${callStatusBadge(driver.call_status)}`}>{driver.call_status}</span>
                <span className="text-[10px] text-gray-600 font-semibold">{driver.feedback || '—'}</span>
                <span className="text-[9px] text-gray-400 ml-auto">{driver.last_call_time}</span>
              </div>
            </div>
          ) : null}

          {/* Screening */}
          {driver.screening && (
            <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
              <p className="text-[9px] text-blue-600 uppercase font-bold mb-1">Screening</p>
              <p className="text-[10px] text-blue-800 font-semibold">{driver.screening.result} · {driver.screening.status}</p>
              {driver.screening.telecaller_remarks && (
                <p className="text-[10px] text-blue-600 mt-0.5">{driver.screening.telecaller_remarks}</p>
              )}
              <p className="text-[9px] text-blue-400">{driver.screening.screened_at}</p>
            </div>
          )}

          {/* Interview */}
          {driver.interview && (
            <div className="bg-purple-50 rounded-lg p-2 border border-purple-100 space-y-1">
              <p className="text-[9px] text-purple-600 uppercase font-bold">Interview Status</p>
              {driver.interview.online_interview_timing && (
                <p className="text-[10px] text-purple-800 font-semibold">
                  Online: {driver.interview.online_interview_status} · {driver.interview.online_interview_timing}
                </p>
              )}
              {driver.interview.physical_interview_start && (
                <p className="text-[10px] text-purple-800 font-semibold">
                  Physical: {driver.interview.physical_interview_status} · {driver.interview.physical_interview_start} → {driver.interview.physical_interview_end}
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ── Main MmJobDetail Page ────────────────────────────────────────────────────
//
// Calling here mirrors the Driver Welcome flow exactly: the Call buttons dial
// via SanCti IN PLACE (no navigation). The global CallControlBar shows the
// live call, the global PostCallDispositionModal opens when it ends, and
// useMmCallFlow syncs the submitted disposition onto the job-linked MM row
// (jobs_match_making / job_details_call_logs) before the lists refresh via
// RTK tag invalidation.
const MmJobDetail: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const jobId: string = location.state?.jobId || '';

  const [search, setSearch] = useState('');
  const [applicantStatus, setApplicantStatus] = useState('');
  const [applicantPage, setApplicantPage] = useState<number | null>(null);
  const [allApplicants, setAllApplicants] = useState<MmApplicant[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const { callTransporter, callApplicant } = useMmCallFlow({
    onToast: triggerToast,
    // Lists refetch through tag invalidation; reset the cursor so the
    // accumulated pages rebuild from page 1 instead of mixing stale pages.
    onLogSaved: (p) => {
      setApplicantPage(null);
      triggerToast(`Disposition saved for ${p.name} ✓`);
    },
  });

  const {
    data: jobData,
    isLoading: jobLoading,
    isError: jobError,
    refetch: refetchJob,
  } = useGetMmJobDetailQuery(jobId, { skip: !jobId });
  const {
    data: txData,
    isLoading: txLoading,
    isError: txError,
    refetch: refetchTx,
  } = useGetMmJobTransporterDetailQuery(jobId, { skip: !jobId });
  const {
    data: applicantsData,
    isLoading: appLoading,
    isFetching: appFetching,
    isError: appError,
    refetch: refetchApplicants,
  } = useGetMmApplicantsFullQuery(
    { jobId, per_page: 30, cursor: applicantPage ?? undefined, search: search || undefined, status: applicantStatus || undefined },
    { skip: !jobId }
  );

  const job = jobData?.data;
  const tx = txData?.data?.transporter;
  const txCallLogs = txData?.data?.call_logs || [];
  const pagination = applicantsData?.pagination;

  // Accumulate cursor pages (Load More previously REPLACED the list).
  useEffect(() => {
    const rows = applicantsData?.data ?? [];
    if (applicantPage === null) {
      setAllApplicants(rows);
    } else if (rows.length > 0) {
      setAllApplicants(prev => {
        const ids = new Set(prev.map(a => a.application_id));
        return [...prev, ...rows.filter(a => !ids.has(a.application_id))];
      });
    }
  }, [applicantsData, applicantPage]);

  // Filter changes restart pagination from page 1.
  useEffect(() => {
    setApplicantPage(null);
  }, [search, applicantStatus]);

  const filteredApplicants = useMemo(() => {
    if (!search) return allApplicants;
    const q = search.toLowerCase();
    return allApplicants.filter(a =>
      a.name.toLowerCase().includes(q) ||
      a.unique_id.toLowerCase().includes(q) ||
      a.mobile?.includes(q)
    );
  }, [allApplicants, search]);

  const handleCallApplicant = (driver: MmApplicant) => {
    callApplicant({
      jobId,
      transporterName: job?.transporter_name || '',
      driver: {
        driver_id: driver.driver_id,
        name: driver.name,
        mobile: driver.mobile,
        unique_id: driver.unique_id,
      },
    });
  };

  if (!jobId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-60px)] text-gray-400">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl mb-3 block">work_off</span>
          <p className="font-semibold">No job selected</p>
          <button onClick={() => navigate('/mm/mm-job-board')} className="mt-3 text-[#8E44AD] font-bold hover:underline">← Back to Job Board</button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-gray-50 overflow-hidden text-xs">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toast}
        </div>
      )}

      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-2.5 bg-white border-b border-gray-200 shrink-0">
        <button
          onClick={() => navigate('/mm/mm-job-board')}
          className="flex items-center gap-1 text-gray-500 hover:text-[#8E44AD] font-bold transition-colors"
        >
          <span className="material-symbols-outlined text-base">arrow_back</span>
          Job Board
        </button>
        <span className="text-gray-300">|</span>
        {jobLoading ? (
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <>
            <span className="font-mono text-gray-400 text-[10px]">{job?.job_id}</span>
            <h1 className="font-extrabold text-gray-800 truncate">{job?.job_title}</h1>
            {job && (
              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ml-auto ${job.closed_job ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                {job.closed_job ? 'CLOSED' : 'OPEN'}
              </span>
            )}
          </>
        )}
      </div>

      {/* Two-column body */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT PANEL: Job Info + Transporter ───────────────────────── */}
        <div className="w-80 shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-y-auto custom-scrollbar">

          {/* Job Details */}
          <div className="p-4 space-y-3 border-b border-gray-100">
            <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Job Details</h2>
            {jobLoading ? (
              <div className="space-y-2">
                {[...Array(6)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded animate-pulse"></div>)}
              </div>
            ) : jobError ? (
              <ErrorPanel label="Failed to load job details" onRetry={refetchJob} />
            ) : job ? (
              <div className="space-y-2">
                {[
                  ['Location', job.job_location],
                  ['Route', job.route],
                  ['Vehicle', job.vehicle_type],
                  ['License', job.license_type],
                  ['Salary', job.salary_range],
                  ['Experience', job.required_experience],
                  ['Drivers Needed', job.number_of_drivers_required],
                  ['Deadline', job.application_deadline],
                ].filter(([, v]) => v).map(([label, val]) => (
                  <div key={label as string} className="flex gap-2">
                    <span className="text-gray-400 shrink-0 w-24">{label}</span>
                    <span className="font-semibold text-gray-800">{val}</span>
                  </div>
                ))}
                {job.job_description && (
                  <div className="pt-1">
                    <span className="text-gray-400 block mb-0.5">Load / Description</span>
                    <p className="font-medium text-gray-700 text-[10px] leading-relaxed">{job.job_description}</p>
                  </div>
                )}
                <div className="pt-2 grid grid-cols-2 gap-1 text-[10px]">
                  {[
                    ['ESI/PF', job.benefits?.esi_pf],
                    ['Food', job.benefits?.food_allowance],
                    ['Trip Incentive', job.benefits?.trip_incentive],
                    ['Stay', job.benefits?.rahane_ki_suvidha],
                    ['Mileage', job.benefits?.mileage],
                    ['FastTag', job.benefits?.fast_tag_road_kharcha],
                  ].map(([label, val]) => (
                    <div key={label as string} className={`rounded px-1.5 py-0.5 font-bold ${val ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-gray-400'}`}>
                      {val ? '✓' : '✗'} {label}
                    </div>
                  ))}
                </div>
                <div className="pt-1 text-[10px] text-gray-400">
                  Applicants: <strong className="text-gray-700">{job.counts?.applicants}</strong> ·
                  Call Logs: <strong className="text-gray-700">{job.counts?.call_logs}</strong> ·
                  MM Calls: <strong className="text-gray-700">{job.counts?.match_making}</strong>
                </div>
              </div>
            ) : null}
          </div>

          {/* Transporter Profile */}
          <div className="p-4 space-y-3 border-b border-gray-100">
            <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Transporter</h2>
            {txLoading ? (
              <div className="space-y-2">{[...Array(4)].map((_, i) => <div key={i} className="h-4 bg-gray-100 rounded animate-pulse"></div>)}</div>
            ) : txError ? (
              <ErrorPanel label="Failed to load transporter" onRetry={refetchTx} />
            ) : tx ? (
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-400 to-purple-700 flex items-center justify-center text-white font-extrabold shrink-0">
                    {tx.name.charAt(0)}
                  </div>
                  <div>
                    <p className="font-extrabold text-gray-800">{tx.name}</p>
                    {tx.company_name && <p className="text-[10px] text-gray-400">{tx.company_name}</p>}
                  </div>
                </div>
                {[
                  ['Mobile', tx.mobile],
                  ['TMID', tx.unique_id],
                  ['Email', tx.email],
                  ['GST', tx.gst_number],
                ].filter(([, v]) => v).map(([l, v]) => (
                  <div key={l as string} className="flex gap-2">
                    <span className="text-gray-400 w-16 shrink-0">{l}</span>
                    <span className="font-semibold text-gray-800 break-all">{v}</span>
                  </div>
                ))}
                <div className="grid grid-cols-2 gap-2 pt-1">
                  <div className="bg-purple-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-extrabold text-[#8E44AD]">{tx.stats.total_jobs_posted}</p>
                    <p className="text-[9px] text-gray-400 font-bold">Jobs Posted</p>
                  </div>
                  <div className="bg-green-50 rounded-lg p-2 text-center">
                    <p className="text-lg font-extrabold text-green-600">{tx.stats.active_jobs}</p>
                    <p className="text-[9px] text-gray-400 font-bold">Active Jobs</p>
                  </div>
                </div>
                <button
                  onClick={() => callTransporter({
                    jobId,
                    transporter: { id: tx.id, name: tx.name, mobile: tx.mobile, unique_id: tx.unique_id },
                  })}
                  className="w-full bg-[#8E44AD] hover:bg-[#7D3C98] text-white py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm"
                  title="Dial via CTI — the job feedback form opens automatically when the call ends"
                >
                  <span className="material-symbols-outlined text-sm">call</span>
                  Call Transporter
                </button>
              </div>
            ) : (
              <p className="text-gray-400 italic text-[10px]">No transporter assigned</p>
            )}
          </div>

          {/* Transporter Call Log */}
          {txCallLogs.length > 0 && (
            <div className="p-4 space-y-2">
              <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Transporter Call Log</h2>
              <div className="space-y-2">
                {txCallLogs.slice(0, 5).map((log) => (
                  <div key={log.id} className="bg-gray-50 rounded-lg p-2 text-[10px]">
                    <div className="flex justify-between">
                      <span className={`font-bold capitalize ${log.call_status === 'connected' ? 'text-green-600' : log.call_status ? 'text-gray-500' : 'text-amber-600'}`}>
                        {log.call_status || 'Feedback Pending'}
                      </span>
                      <span className="text-gray-400">{new Date(log.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' })}</span>
                    </div>
                    {log.call_feedback && <p className="text-gray-600 mt-0.5">{log.call_feedback}</p>}
                    {log.assigned_admin_name && <p className="text-gray-400">by {log.assigned_admin_name}</p>}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL: Applicants ──────────────────────────────────── */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Applicant filter bar */}
          <div className="px-4 py-2.5 bg-white border-b border-gray-200 flex items-center gap-3 shrink-0">
            <div className="flex-1 relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search driver name, TMID, mobile..."
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#8E44AD]"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
            <div className="flex gap-1.5">
              {[
                { label: 'All', value: '' },
                { label: 'New', value: 'new' },
                { label: 'Connected', value: 'connected' },
                { label: 'Pending', value: 'pending' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => setApplicantStatus(opt.value)}
                  className={`px-2.5 py-1 rounded-lg font-bold border text-[10px] transition-colors ${applicantStatus === opt.value ? 'bg-[#8E44AD] text-white border-[#8E44AD]' : 'bg-white text-gray-500 border-gray-200'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <span className="text-gray-400 text-[10px] shrink-0">
              {applicantsData?.total_applicants || 0} total
            </span>
          </div>

          {/* Applicant list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
            {appLoading && allApplicants.length === 0 ? (
              <div className="space-y-2">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="h-14 bg-white rounded-xl border border-gray-200 animate-pulse"></div>
                ))}
              </div>
            ) : appError && allApplicants.length === 0 ? (
              <ErrorPanel label="Failed to load applicants" onRetry={refetchApplicants} />
            ) : filteredApplicants.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-gray-400">
                <span className="material-symbols-outlined text-4xl mb-2">people</span>
                <p className="font-semibold">No applicants found</p>
                {search && <p className="text-[10px] mt-1">Try a different search term</p>}
              </div>
            ) : (
              <>
                {filteredApplicants.map(driver => (
                  <ApplicantCard
                    key={driver.application_id}
                    driver={driver}
                    onCall={handleCallApplicant}
                  />
                ))}
                {pagination?.has_more && (
                  <button
                    onClick={() => setApplicantPage(pagination.next_cursor)}
                    disabled={appFetching}
                    className="w-full py-2 text-[#8E44AD] font-bold border border-[#8E44AD] rounded-xl hover:bg-purple-50 transition-colors disabled:opacity-50"
                  >
                    {appFetching ? 'Loading…' : 'Load More'}
                  </button>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MmJobDetail;
