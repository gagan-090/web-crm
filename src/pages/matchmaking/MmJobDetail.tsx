import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  useGetMmJobDetailQuery,
  useGetMmJobTransporterDetailQuery,
  useGetMmApplicantsFullQuery,
  type MmApplicant,
} from '../../services/api/webCrmApi';
import { useMmCallFlow } from './useMmCallFlow';
import GreenlineScreeningModal from './GreenlineScreeningModal';
import DriverDetailsModal from './DriverDetailsModal';
import TransporterDetailsModal from './TransporterDetailsModal';
import ResizeHandle, { useResizablePane } from '../../shared/components/ResizeHandle';
import GreenlineApplicantList from './GreenlineApplicantList';
import MmJobBriefModal from './MmJobBriefModal';
import MmConferenceDispositionModal from './MmConferenceDispositionModal';
import MmAddToCallModal from './MmAddToCallModal';
import MmConnectionRequestModal from './MmConnectionRequestModal';
import MmBulkConnectionModal from './MmBulkConnectionModal';
import { openJobSession } from './mmJobSession';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';
import {
  MM_DRIVER_CONNECTED_OPTIONS,
  MM_TRANSPORTER_CONNECTED_OPTIONS,
  MM_GREENLINE_CONNECTED_OPTIONS,
  DWC_NOT_CONNECTED_OPTIONS,
  DWC_CALLBACK_OPTIONS,
} from '../../shared/components/cti/PostCallDispositionModal';
import {
  readPendingMmContext,
  MM_OPEN_ADD_TO_CALL_EVENT,
} from '../../shared/components/cti/mmCallContext';

type DriverRef = { driver_id: number; name: string; mobile: string; unique_id: string };

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
  // Rose, not amber: a call that did not connect is a failed attempt, and it
  // should not wear the same colour as Pending, which is work still scheduled.
  if (status === 'Not Connected') return 'bg-rose-50 text-rose-700 border-rose-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';   // Pending
};

// Agents store a disposition on the call — sometimes the human label
// ("Driver Placement Done"), sometimes the raw code ("placement_done",
// "interested_job"). This maps every known MM/DW disposition code to its label
// so the feedback filter shows a clean name whatever was saved. Unknown values
// (free text) are shown as-is.
const FEEDBACK_LABEL_MAP: Record<string, string> = {
  ...Object.fromEntries(
    [
      ...MM_DRIVER_CONNECTED_OPTIONS,
      ...MM_TRANSPORTER_CONNECTED_OPTIONS,
      ...MM_GREENLINE_CONNECTED_OPTIONS,
    ].map(o => [o.value, o.label])
  ),
  ...Object.fromEntries([...DWC_NOT_CONNECTED_OPTIONS, ...DWC_CALLBACK_OPTIONS].map(s => [s, s])),
  callback_later: 'Call Back Later',
  connected: 'Connected',
};

const prettifyFeedback = (raw: string): string =>
  FEEDBACK_LABEL_MAP[raw]
  ?? (/^[a-z0-9]+(_[a-z0-9]+)+$/.test(raw)
    ? raw.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
    : raw);

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
  isGreenline: boolean;
  /** True while a transporter call for THIS job is live — enables "Add Call". */
  canConference: boolean;
  /** Job belongs to another agent: everything stays visible, nothing may be dialled. */
  readOnly?: boolean;
  ownerName?: string | null;
  onCall: (driver: MmApplicant) => void;
  onAddToCall: (driver: MmApplicant) => void;
  onScreen: (driver: MmApplicant, mode: 'conduct' | 'view') => void;
  onViewDetails: (driver: MmApplicant) => void;
  onConnect: (driver: MmApplicant) => void;
  /** Whether this agent may send connection requests at all (own job only). */
  canConnect: boolean;
}

const ApplicantCard: React.FC<ApplicantCardProps> = ({ driver, isGreenline, canConference, readOnly, ownerName, onCall, onAddToCall, onScreen, onViewDetails, onConnect, canConnect }) => {
  const [expanded, setExpanded] = useState(false);
  const timeline = driver.call_timeline ?? [];

  return (
    <div className={`bg-white border rounded-xl transition-shadow ${driver.is_matched ? 'border-green-300 shadow-green-50 shadow' : 'border-gray-200 hover:shadow-sm'}`}>
      {/* Card header.
          Wraps rather than crushes: the action group is ~350px of fixed-width
          buttons, so on a narrowed pane (the divider is drag-resizable) the old
          single-row layout squeezed the identity block to nothing — the name
          collapsed to "Ga…" and the TMID / state / experience line ran under the
          status badges. flex-wrap plus a min-width on the identity block makes
          the actions drop to their own line instead. */}
      <div
        className="p-3 flex flex-wrap items-center gap-x-3 gap-y-2 cursor-pointer"
        onClick={() => setExpanded(e => !e)}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shrink-0">
          {driver.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-[150px]">
          <div className="flex items-center gap-2 min-w-0">
            <span className="font-bold text-gray-850 text-xs truncate" title={driver.name}>{driver.name}</span>
            {driver.is_matched && (
              <span className="shrink-0 text-[9px] font-bold bg-green-100 text-green-700 px-1.5 py-0.5 rounded">MATCHED</span>
            )}
          </div>
          {/* Separators live on the chips themselves so a wrapped line never
              starts with a stray "·". */}
          <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mt-0.5 text-[10px] text-gray-400">
            <span className="font-mono truncate max-w-full">{driver.unique_id}</span>
            {driver.state && <span className="truncate">· {driver.state}</span>}
            {driver.experience && <span className="whitespace-nowrap">· {driver.experience}</span>}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-end gap-2 shrink-0 ml-auto">
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${callStatusBadge(driver.call_status)}`}>
            {driver.call_status}
          </span>
          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${pipelineBadge(driver.pipeline_status)}`}>
            {driver.pipeline_status}
          </span>
          <button
            onClick={e => { e.stopPropagation(); onViewDetails(driver); }}
            className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-[#8E44AD] hover:border-[#8E44AD] flex items-center justify-center transition-colors"
            title="View complete driver details (documents, DL/PAN/Aadhaar)"
          >
            <span className="material-symbols-outlined text-[18px]">visibility</span>
          </button>
          {/* Send Connection Request — on EVERY applicant card. Who gets one is
              the agent's decision, not something derived from an "Interested in
              the Job" disposition, so no feedback state is consulted here. */}
          {canConnect && (
            <button
              onClick={e => { e.stopPropagation(); onConnect(driver); }}
              className="w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-white hover:bg-green-600 hover:border-green-600 flex items-center justify-center transition-colors"
              title="Send Connection Request to this driver"
            >
              <span className="material-symbols-outlined text-[18px]">forward_to_inbox</span>
            </button>
          )}
          {isGreenline && (
            <button
              onClick={e => { e.stopPropagation(); onScreen(driver, driver.screening ? 'view' : 'conduct'); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] shadow-sm flex items-center gap-1"
              title={driver.screening
                ? 'Screening already done — view answers and change the result'
                : 'Conduct the Greenline screening questionnaire for this driver'}
            >
              <span className="material-symbols-outlined text-xs">fact_check</span>
              {driver.screening ? 'Result' : 'Screen'}
            </button>
          )}
          {/* Transporter call in progress → conference this applicant in
              instead of starting a separate call (mobile's con-call flow). */}
          {readOnly ? (
            <span
              className="bg-gray-100 text-gray-400 border border-gray-200 px-3 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-1 cursor-not-allowed"
              title={`This job belongs to ${ownerName || 'another agent'} — calling is disabled`}
            >
              <span className="material-symbols-outlined text-xs">phone_disabled</span>View only
            </span>
          ) : canConference ? (
            <button
              onClick={e => { e.stopPropagation(); onAddToCall(driver); }}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] shadow-sm flex items-center gap-1"
              title="Add this applicant to the live transporter call"
            >
              <span className="material-symbols-outlined text-xs">group_add</span>Add Call
            </button>
          ) : (
            <button
              onClick={e => { e.stopPropagation(); onCall(driver); }}
              className="bg-[#1A5276] hover:bg-[#154360] text-white px-3 py-1.5 rounded-lg font-bold text-[10px] shadow-sm flex items-center gap-1"
              title="Call this applicant via CTI — feedback opens automatically after the call"
            >
              <span className="material-symbols-outlined text-xs">call</span>Call
            </button>
          )}
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
              // Mobile numbers are never surfaced on matchmaking screens —
              // the agent dials through the CTI, which needs no number on show.
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
                <div key={i} className="text-[10px] text-green-800 font-semibold flex flex-wrap items-center gap-x-1.5">
                  <span className="font-mono bg-green-100 text-green-700 px-1 py-px rounded">{sj.job_id}</span>
                  {sj.transporter_name && <span className="font-extrabold">{sj.transporter_name}</span>}
                  <span className="font-normal text-green-700">
                    · {sj.job_title} · {sj.job_location} · {sj.selected_at}
                  </span>
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
                        {/* Which job (and whose) this call was about */}
                        {entry.job_id && (
                          <span className="text-[9px] font-mono font-bold text-gray-600 bg-gray-100 px-1 py-0.5 rounded">
                            {entry.job_id}
                          </span>
                        )}
                        {entry.transporter_name && (
                          <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1 py-0.5 rounded">
                            {entry.transporter_name}
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
          {driver.screening ? (
            <div className="bg-blue-50 rounded-lg p-2 border border-blue-100">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[9px] text-blue-600 uppercase font-bold">Screening</p>
                <button
                  onClick={() => onScreen(driver, 'view')}
                  className="text-[9px] font-bold text-[#8E44AD] hover:underline flex items-center gap-0.5"
                >
                  <span className="material-symbols-outlined text-[12px]">visibility</span>View / change result
                </button>
              </div>
              <p className="text-[10px] text-blue-800 font-semibold">{driver.screening.result} · {driver.screening.telecaller_status || driver.screening.status}</p>
              {driver.screening.telecaller_remarks && (
                <p className="text-[10px] text-blue-600 mt-0.5">{driver.screening.telecaller_remarks}</p>
              )}
              <p className="text-[9px] text-blue-400">{driver.screening.screened_at}</p>
            </div>
          ) : isGreenline ? (
            <button
              onClick={() => onScreen(driver, 'conduct')}
              className="w-full bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-700 rounded-lg py-2 text-[11px] font-bold flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">fact_check</span>
              Conduct Greenline Screening
            </button>
          ) : null}

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
  // Router state is lost on a reload or a bare visit to this route, so fall
  // back to the job remembered for this session.
  const jobId: string = location.state?.jobId || openJobSession.get() || '';

  // Remember it so the Job Board reopens this job when the agent returns.
  useEffect(() => {
    if (jobId) openJobSession.set(jobId);
  }, [jobId]);

  // Leaving via "← Job Board" is the one action that means "I'm done with this
  // job" — everywhere else the job stays open.
  const backToBoard = () => {
    openJobSession.clear();
    navigate('/mm/mm-job-board');
  };

  const [search, setSearch] = useState('');
  const [applicantStatus, setApplicantStatus] = useState('');
  const [applicantPage, setApplicantPage] = useState<number | null>(null);
  const [allApplicants, setAllApplicants] = useState<MmApplicant[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [screenTarget, setScreenTarget] = useState<{ driver: DriverRef; mode: 'conduct' | 'view' } | null>(null);
  const [detailsDriver, setDetailsDriver] = useState<DriverRef | null>(null);
  // Transporter behind the eye icon in the Transporter panel.
  const [transporterView, setTransporterView] = useState<
    { id: number; name?: string; tmid?: string } | null
  >(null);
  // Drag-resizable left pane. 320px is the old fixed w-80 width.
  const leftPane = useResizablePane('mm_job_detail_left_pane_w', 320, 260, 760);
  const [connectDriver, setConnectDriver] = useState<DriverRef | null>(null);
  const [showBulkConnect, setShowBulkConnect] = useState(false);
  const [showAddToCall, setShowAddToCall] = useState(false);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const { callState } = useSanCti();
  const {
    callTransporter,
    callApplicant,
    addApplicantToConference,
    jobBriefTarget,
    openJobBrief,
    closeJobBrief,
    conferenceDisposition,
    clearConferenceDisposition,
  } = useMmCallFlow({
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
    // The New/Connected/Pending filter is applied client-side on the latest
    // call status (see filteredApplicants) — the backend has no branch for
    // 'new'/'connected', and 'connected' must mean the LATEST feedback is
    // connected (not-connected / call-back are excluded). Only `search` is
    // forwarded so the server keeps returning the full applicant set.
    { jobId, per_page: 30, cursor: applicantPage ?? undefined, search: search || undefined },
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

  // Search restarts server pagination from page 1. The status filter is purely
  // client-side (below), so it must NOT reset the accumulated pages.
  useEffect(() => {
    setApplicantPage(null);
  }, [search]);

  // The feedback filter keys off `call_status`, which the backend already
  // derives from each applicant's MOST RECENT call across every source:
  //   New       → never called
  //   Connected → latest call connected
  //   Pending   → called, but the latest outcome is not-connected / call-back
  // So "Connected" shows only applicants whose latest feedback is connected;
  // a driver whose most recent status is not-connected or call-back stays out.
    // Canonical feedback key for a timeline entry: the disposition code the
    // agent picked (interested_job, placement_done…), falling back to the raw
    // call_feedback text when no code was stored.
  const entryFeedbackKey = (e: NonNullable<MmApplicant['call_timeline']>[number]): string =>
    (e.disposition_sub ?? '').trim() || (e.feedback ?? '').trim();

  // NOTE: connection requests deliberately do NOT consult the "Interested in
  // the Job" disposition any more. Who to connect is the agent's call; the
  // feedback state only drives the filter chips below.

  const matchesStatus = (a: MmApplicant): boolean => {
    // A specific agent-marked feedback (e.g. "Interested in the Job"): match
    // only on feedback the agent submitted FOR THIS job — timeline entries
    // tagged with this job_id. The applicant's history on other jobs is ignored.
    if (applicantStatus.startsWith('fb:')) {
      const target = applicantStatus.slice(3);
      return (a.call_timeline ?? []).some(e => e.job_id === jobId && entryFeedbackKey(e) === target);
    }
    switch (applicantStatus) {
      case 'new':            return a.call_status === 'New';
      case 'connected':      return a.call_status === 'Connected';
      case 'not_connected':  return a.call_status === 'Not Connected';
      case 'pending':        return a.call_status === 'Pending';
      case 'not_interested': return a.call_status === 'Not Interested';
      default:               return true; // 'All'
    }
  };

  // Coarse status buckets — shared by the chips and the top of the dropdown.
  //
  // 'Not Connected' is its own tab rather than being folded into Pending.
  // Of 45 applicants an agent needs to separate "30 answered", "10 did not
  // answer" and "5 nobody has rung" — one bucket holding the last two answers
  // neither question.
  const FEEDBACK_FILTERS: Array<{ label: string; value: string; title: string }> = [
    { label: 'All', value: '', title: 'Show every applicant' },
    { label: 'New', value: 'new', title: 'Never called' },
    { label: 'Connected', value: 'connected', title: 'Latest call connected' },
    { label: 'Not Connected', value: 'not_connected', title: 'Called, but the latest call did not connect' },
    { label: 'Pending', value: 'pending', title: 'Latest call was a scheduled call-back — still owed' },
    { label: 'Not Interested', value: 'not_interested', title: 'Latest feedback is Not Interested' },
  ];

  // Every feedback agents have marked on applicants FOR THIS JOB — drawn from
  // call-timeline entries tagged with this job_id (an applicant's history on
  // other jobs is excluded). So the whole vocabulary used on this job
  // (MatchMaking Done, Driver Not Interested, Ready for Interview, …) shows up.
  // count = how many applicants carry that feedback on this job.
  const feedbackOptions = useMemo(() => {
    const counts = new Map<string, number>();
    allApplicants.forEach(a => {
      const seen = new Set<string>();
      (a.call_timeline ?? []).forEach(e => {
        if (e.job_id !== jobId) return;
        const key = (e.disposition_sub ?? '').trim() || (e.feedback ?? '').trim();
        if (key) seen.add(key);
      });
      seen.forEach(k => counts.set(k, (counts.get(k) ?? 0) + 1));
    });
    return Array.from(counts.entries())
      .map(([value, count]) => ({ value, label: prettifyFeedback(value), count }))
      .sort((x, y) => x.label.localeCompare(y.label));
  }, [allApplicants, jobId]);

  const filteredApplicants = useMemo(() => {
    const q = search.trim().toLowerCase();
    return allApplicants.filter(a => {
      if (!matchesStatus(a)) return false;
      if (!q) return true;
      return a.name.toLowerCase().includes(q) || a.unique_id.toLowerCase().includes(q);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allApplicants, search, applicantStatus]);

  // Shortlist picker options for the transporter modal — every applicant on the
  // job, plain. No feedback state is carried: the agent ticks who to send to.
  const bulkApplicantOptions = useMemo(
    () => allApplicants.map(a => ({
      driver_id: a.driver_id,
      name: a.name,
      unique_id: a.unique_id,
    })),
    [allApplicants]
  );

  const isGreenline = !!job?.is_greenline;

  // The board is system-wide, so an agent can open a job that belongs to
  // someone else. A REGULAR job that isn't yours stays fully readable —
  // applicants, screening, call logs — but nothing may be dialled from it.
  // Greenline jobs are the exception: they are a shared pool every matchmaking
  // caller works, so ownership never restricts them.
  const jobOwnerName = job?.assigned_to_name ?? null;
  const readOnly = !!job && job.is_mine === false && !isGreenline;

  // A transporter call for THIS job is live → applicants can be conferenced in
  // rather than called separately (Task 3's transporter-first direction).
  const mmCtx = readPendingMmContext();
  const canConference =
    callState === 'connected' && mmCtx?.kind === 'transporter' && mmCtx.jobId === jobId;

  const handleCallApplicant = (driver: MmApplicant) => {
    if (readOnly) { triggerToast(`This job belongs to ${jobOwnerName || 'another agent'} — calling is disabled.`); return; }
    callApplicant({
      jobId,
      transporterName: job?.transporter_name || '',
      // Travels along so the CTI bar's "Add Call" can offer the transporter by
      // NAME — their number is used to dial but never displayed.
      transporter: tx
        ? { id: tx.id, name: tx.name, mobile: tx.mobile, unique_id: tx.unique_id }
        : undefined,
      driver: {
        driver_id: driver.driver_id,
        name: driver.name,
        mobile: driver.mobile,
        unique_id: driver.unique_id,
      },
      isGreenline,
    });
  };

  const handleAddApplicantToCall = (driver: MmApplicant) => {
    if (readOnly) { triggerToast(`This job belongs to ${jobOwnerName || 'another agent'} — calling is disabled.`); return; }
    addApplicantToConference({
      driver_id: driver.driver_id,
      name: driver.name,
      mobile: driver.mobile,
      unique_id: driver.unique_id,
    });
  };

  // The global call bar asks for the searchable picker (it has no applicant data).
  useEffect(() => {
    const open = () => setShowAddToCall(true);
    window.addEventListener(MM_OPEN_ADD_TO_CALL_EVENT, open);
    return () => window.removeEventListener(MM_OPEN_ADD_TO_CALL_EVENT, open);
  }, []);

  const handleScreen = (driver: DriverRef, mode: 'conduct' | 'view') => {
    setScreenTarget({ driver, mode });
  };

  const handleViewDetails = (driver: DriverRef) => {
    setDetailsDriver(driver);
  };

  const handleConnect = (driver: DriverRef) => {
    setConnectDriver(driver);
  };

  const handleGreenlineCall = (driver: DriverRef) => {
    if (readOnly) { triggerToast(`This job belongs to ${jobOwnerName || 'another agent'} — calling is disabled.`); return; }
    callApplicant({
      jobId,
      transporterName: job?.transporter_name || '',
      transporter: tx
        ? { id: tx.id, name: tx.name, mobile: tx.mobile, unique_id: tx.unique_id }
        : undefined,
      driver,
      isGreenline: true,
    });
  };

  if (!jobId) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-60px)] text-gray-400">
        <div className="text-center">
          <span className="material-symbols-outlined text-5xl mb-3 block">work_off</span>
          <p className="font-semibold">No job selected</p>
          <button onClick={backToBoard} className="mt-3 text-[#8E44AD] font-bold hover:underline">← Back to Job Board</button>
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
          onClick={backToBoard}
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
            <span className="font-mono font-extrabold text-gray-900 text-xs select-text">{job?.job_id}</span>
            <h1 className="font-extrabold text-gray-800 truncate">{job?.job_title}</h1>
            {job && (
              <span className="ml-auto flex items-center gap-2">
                {/* Whose job this is — always shown, since the board spans every agent. */}
                <span
                  className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                    readOnly ? 'bg-amber-100 text-amber-700'
                    : isGreenline && job.is_mine === false ? 'bg-teal-100 text-teal-700'
                    : 'bg-emerald-100 text-emerald-700'
                  }`}
                  title={
                    readOnly ? 'Assigned to another agent — read only'
                    : isGreenline && job.is_mine === false
                      ? 'Greenline jobs are a shared pool — any matchmaking caller can work them'
                      : 'Assigned to you'
                  }
                >
                  {job.is_mine === false
                    ? `${isGreenline ? 'GREENLINE · ' : ''}ASSIGNED TO ${(jobOwnerName || 'ANOTHER AGENT').toUpperCase()}`
                    : 'ASSIGNED TO YOU'}
                </span>
                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${job.closed_job ? 'bg-gray-100 text-gray-500' : 'bg-green-100 text-green-700'}`}>
                  {job.closed_job ? 'CLOSED' : 'OPEN'}
                </span>
              </span>
            )}
          </>
        )}
      </div>

      {/* Read-only strip — the job is someone else's book of work */}
      {readOnly && (
        <div className="px-4 py-2 bg-amber-50 border-b border-amber-200 flex items-center gap-2 shrink-0">
          <span className="material-symbols-outlined text-amber-600 text-[18px]">visibility</span>
          <p className="text-[11px] font-bold text-amber-800">
            View only — this in-system job is assigned to {jobOwnerName || 'another agent'}. Applicants and
            screening are visible, but you cannot call the transporter or any applicant.
          </p>
        </div>
      )}

      {/* Two-column body */}
      <div className="flex-1 flex overflow-hidden">

        {/* ── LEFT PANEL: Job Info + Transporter ─────────────────────────
            Width is drag-resizable via the handle below (border replaced by it),
            so a long Hindi load description or a wide transporter record can be
            read without squinting at a fixed 320px column. */}
        <div
          style={{ width: leftPane.width }}
          className="shrink-0 bg-white flex flex-col overflow-y-auto custom-scrollbar"
        >

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
            <div className="flex items-center justify-between gap-2">
              <h2 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Transporter</h2>
              {tx?.id && (
                <button
                  onClick={() => setTransporterView({ id: Number(tx.id), name: tx.name, tmid: tx.unique_id })}
                  title="View complete transporter details and full call timeline"
                  className="inline-flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-[#8E44AD] hover:bg-purple-50 px-1.5 py-0.5 rounded transition-colors"
                >
                  <span className="material-symbols-outlined text-[14px]">visibility</span>
                  Full details
                </button>
              )}
            </div>
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
                  disabled={readOnly}
                  onClick={() => callTransporter({
                    jobId,
                    transporter: { id: tx.id, name: tx.name, mobile: tx.mobile, unique_id: tx.unique_id },
                    isGreenline,
                  })}
                  className="w-full bg-[#8E44AD] hover:bg-[#7D3C98] text-white py-2 rounded-xl font-bold flex items-center justify-center gap-1.5 shadow-sm disabled:bg-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed"
                  title={readOnly
                    ? `This job belongs to ${jobOwnerName || 'another agent'} — calling is disabled`
                    : 'Dial via CTI — the job feedback form opens automatically when the call ends'}
                >
                  <span className="material-symbols-outlined text-sm">{readOnly ? 'phone_disabled' : 'call'}</span>
                  {readOnly ? 'Calling disabled' : 'Call Transporter'}
                </button>
                {/* The brief opens automatically when the transporter confirms
                    job details; this is the manual route the mobile screen also
                    offers from every other connected option. */}
                <button
                  disabled={readOnly}
                  onClick={() => openJobBrief(jobId, tx.name)}
                  className="w-full border border-[#8E44AD] text-[#8E44AD] py-1.5 rounded-xl font-bold flex items-center justify-center gap-1.5 hover:bg-purple-50 disabled:border-gray-200 disabled:text-gray-400 disabled:cursor-not-allowed disabled:hover:bg-transparent"
                  title={readOnly
                    ? `This job belongs to ${jobOwnerName || 'another agent'} — read only`
                    : 'Record the job details collected from the transporter'}
                >
                  <span className="material-symbols-outlined text-sm">description</span>
                  Job Brief
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

        {/* Draggable divider — replaces the left pane's old static border-r */}
        <ResizeHandle
          width={leftPane.width}
          onResize={leftPane.setWidth}
          onReset={leftPane.reset}
          min={leftPane.min}
          max={leftPane.max}
          ariaLabel="Resize job and transporter panel"
        />

        {/* ── RIGHT PANEL: Applicants ────────────────────────────────────
            min-w-0 so the flex child may shrink below its content width —
            without it, dragging the divider right is silently clamped by the
            applicant cards instead of actually resizing. */}
        <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
          {isGreenline ? (
            <GreenlineApplicantList
              jobId={jobId}
              readOnly={readOnly}
              ownerName={jobOwnerName}
              onCall={handleGreenlineCall}
              onScreen={handleScreen}
              onViewDetails={handleViewDetails}
            />
          ) : (
          <>
          {/* Applicant filter bar — wraps onto extra rows as the pane narrows.
              Without flex-wrap the search field was squeezed down to just its
              magnifier icon and the "Send Connection to Transporter" button was
              pushed clean off the right edge. */}
          <div className="px-4 py-2.5 bg-white border-b border-gray-200 flex flex-wrap items-center gap-x-3 gap-y-2 shrink-0">
            <div className="flex-1 min-w-[160px] relative">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search driver name or TMID..."
                className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#8E44AD]"
              />
              {search && (
                <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <span className="material-symbols-outlined text-sm">close</span>
                </button>
              )}
            </div>
            {/* Feedback filter — dropdown (keyed off the latest call status). */}
            <div className="relative shrink-0">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[14px] pointer-events-none">filter_list</span>
              <select
                value={applicantStatus}
                onChange={e => setApplicantStatus(e.target.value)}
                title="Filter applicants by their latest call feedback"
                className={`appearance-none pl-7 pr-7 py-1.5 rounded-lg border text-[10px] font-bold outline-none focus:ring-1 focus:ring-[#8E44AD] cursor-pointer max-w-[190px] ${applicantStatus ? 'bg-[#8E44AD] text-white border-[#8E44AD]' : 'bg-white text-gray-600 border-gray-200'}`}
              >
                <optgroup label="Status">
                  {FEEDBACK_FILTERS.map(opt => (
                    <option key={opt.value} value={opt.value} className="bg-white text-gray-700">
                      {opt.value === '' ? 'Feedback: All' : opt.label}
                    </option>
                  ))}
                </optgroup>
                {feedbackOptions.length > 0 && (
                  <optgroup label="Marked feedback">
                    {feedbackOptions.map(opt => (
                      <option key={`fb:${opt.value}`} value={`fb:${opt.value}`} className="bg-white text-gray-700">
                        {opt.label} ({opt.count})
                      </option>
                    ))}
                  </optgroup>
                )}
              </select>
              <span className={`material-symbols-outlined absolute right-1.5 top-1/2 -translate-y-1/2 text-[14px] pointer-events-none ${applicantStatus ? 'text-white' : 'text-gray-400'}`}>expand_more</span>
            </div>

            {/* …and the same filter as quick chips. */}
            <div className="flex flex-wrap gap-1.5">
              {FEEDBACK_FILTERS.filter(o => o.value !== 'not_interested').map(opt => (
                <button
                  key={opt.value}
                  title={opt.title}
                  onClick={() => setApplicantStatus(opt.value)}
                  className={`px-2.5 py-1 rounded-lg font-bold border text-[10px] transition-colors ${applicantStatus === opt.value ? 'bg-[#8E44AD] text-white border-[#8E44AD]' : 'bg-white text-gray-500 border-gray-200'}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <span className="text-gray-400 text-[10px] shrink-0 whitespace-nowrap">
              {applicantStatus || search
                ? `${filteredApplicants.length} shown · ${applicantsData?.total_applicants || 0} total`
                : `${applicantsData?.total_applicants || 0} total`}
            </span>

            {/* Send the transporter a driver shortlist. Always available; the
                agent picks the shortlist inside the modal and can opt to
                message those drivers too. No disposition state involved. */}
            {!readOnly && allApplicants.length > 0 && (
              <button
                onClick={() => setShowBulkConnect(true)}
                title="Send the transporter a shortlist of drivers for this job — and optionally notify those drivers too"
                className="shrink-0 flex items-center gap-1 bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-lg font-bold text-[10px] shadow-sm"
              >
                <span className="material-symbols-outlined text-[14px]">local_shipping</span>
                Send Connection to Transporter
              </button>
            )}
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
                    isGreenline={isGreenline}
                    canConference={canConference}
                    readOnly={readOnly}
                    ownerName={jobOwnerName}
                    onCall={handleCallApplicant}
                    onAddToCall={handleAddApplicantToCall}
                    onScreen={handleScreen}
                    onViewDetails={handleViewDetails}
                    onConnect={handleConnect}
                    canConnect={!readOnly}
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
          </>
          )}
        </div>
      </div>

      {/* Complete driver details — classic modal (eye icon) */}
      {detailsDriver && (
        <DriverDetailsModal
          open
          driverId={detailsDriver.driver_id}
          driverName={detailsDriver.name}
          uniqueId={detailsDriver.unique_id}
          onClose={() => setDetailsDriver(null)}
        />
      )}

      {transporterView && (
        <TransporterDetailsModal
          open
          transporterId={transporterView.id}
          transporterName={transporterView.name}
          uniqueId={transporterView.tmid}
          onClose={() => setTransporterView(null)}
        />
      )}

      {/* Send Connection Request — notify driver / transporter / both */}
      {connectDriver && (
        <MmConnectionRequestModal
          open
          jobId={jobId}
          driver={{
            driver_id: connectDriver.driver_id,
            name: connectDriver.name,
            unique_id: connectDriver.unique_id,
          }}
          transporterName={tx?.name ?? job?.transporter_name ?? null}
          hasTransporter={!!tx}
          onClose={() => setConnectDriver(null)}
        />
      )}

      {/* Send the transporter a driver shortlist the agent picks here */}
      {showBulkConnect && (
        <MmBulkConnectionModal
          open
          jobId={jobId}
          applicants={bulkApplicantOptions}
          hasTransporter={!!tx}
          transporterName={tx?.name ?? job?.transporter_name ?? null}
          onClose={() => setShowBulkConnect(false)}
        />
      )}

      {/* Searchable applicant picker for the conference (name / TMID) */}
      {showAddToCall && (
        <MmAddToCallModal
          open
          jobId={jobId}
          addedIds={(mmCtx?.conferenced || []).map(p => p.id)}
          onClose={() => setShowAddToCall(false)}
          onAdd={(driver) => {
            handleAddApplicantToCall(driver);
            setShowAddToCall(false);
          }}
        />
      )}

      {/* Transporter job brief → saved onto the `jobs` row */}
      {jobBriefTarget && (
        <MmJobBriefModal
          open
          jobId={jobBriefTarget.jobId}
          prefillName={jobBriefTarget.name}
          jobData={job ? {
            transporter_name: job.transporter_name,
            job_location: job.job_location,
            route: job.route,
            number_of_drivers_required: job.number_of_drivers_required,
            vehicle_type: job.vehicle_type,
            license_type: job.license_type,
            required_experience: job.required_experience,
            salary_range: job.salary_range,
            benefits: job.benefits,
          } : null}
          onClose={closeJobBrief}
          onSaved={() => {
            triggerToast('Job brief saved ✓');
            refetchJob();
          }}
        />
      )}

      {/* Disposition owed by a party conferenced into the call */}
      {conferenceDisposition && (
        <MmConferenceDispositionModal
          open
          party={conferenceDisposition.party}
          callId={conferenceDisposition.callId}
          onClose={clearConferenceDisposition}
          onSubmitted={(res) => {
            triggerToast(`Feedback saved for ${conferenceDisposition.party.name} ✓`);
            // Same rule as a directly-dialled transporter: confirming the job
            // details leads straight into the job brief.
            if (res.disposition_sub === 'tr_confirmed_job') {
              openJobBrief(conferenceDisposition.jobId, conferenceDisposition.party.name);
            }
            setApplicantPage(null);
          }}
        />
      )}

      {/* Greenline screening — conduct / view */}
      {screenTarget && (
        <GreenlineScreeningModal
          open
          mode={screenTarget.mode}
          driverId={screenTarget.driver.driver_id}
          uniqueId={screenTarget.driver.unique_id}
          driverName={screenTarget.driver.name}
          onClose={() => setScreenTarget(null)}
          onSubmitted={(res) => {
            triggerToast(`Screening saved — applicant ${res.status} (${res.score} pts)`);
            setApplicantPage(null);
          }}
        />
      )}
    </div>
  );
};

export default MmJobDetail;
