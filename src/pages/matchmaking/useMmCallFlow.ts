import { useCallback, useEffect, useState } from 'react';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';
import {
  useTagMmCallMutation,
  useLogMmConferenceCallMutation,
} from '../../services/api/webCrmApi';
import {
  readPendingMmContext,
  writePendingMmContext,
  recordMmConferenceParty,
  emitMmConferenceAdd,
  MM_CONFERENCE_EVENT,
  type PendingMmContext,
  type MmConferenceParty,
  type MmConferenceEventDetail,
} from '../../shared/components/cti/mmCallContext';

// ── Matchmaking call lifecycle (mirrors the Driver Welcome flow) ─────────────
//
// call_history_ivr is the SINGLE SOURCE OF TRUTH for all call details
// (DW / TW / MM). The SanCti provider already creates the call row on dial
// (/web-crm/call/initiate) and writes the disposition on submit
// (/web-crm/call/disposition) — exactly like the DW flow. Matchmaking adds
// three things on top:
//
//   1. after the disposition, the call row is tagged with the job it was about
//      and (for applicant calls) the match outcome —
//      /web-crm/match-making/ivr-call-tag-job;
//   2. conference ("Add Call") legs are logged as their own call_history_ivr
//      rows — /web-crm/match-making/conference-call — the same way the mobile
//      app records an `ivr_con_call`;
//   3. transporter calls collect the job brief afterwards, which lands on the
//      `jobs` row — /web-crm/match-making/job-brief.
//
// No jobs_match_making or job_details_call_logs rows are ever written.

export type { PendingMmContext } from '../../shared/components/cti/mmCallContext';

// Global modal's MM sub-options → match_status stored on call_history_ivr.
// Anything not listed falls back to 'pending' (see the resolver below).
const MATCH_STATUS_MAP: Record<string, string> = {
  placement_done: 'selected',
  matchmaking_done: 'selected',
  greenline_interview_done: 'selected',
  callback: 'callback',
  interested_callback: 'callback',
  rejected: 'rejected',
  not_genuine_driver: 'rejected',
  not_interested: 'not_interested',
  not_interested_another_job: 'not_matched',
  not_interested_salary: 'not_matched',
  not_interested_location: 'not_matched',
  not_interested_vehicle: 'not_matched',
};

// The mobile MatchmakingFeedbackScreen auto-opens the Job Brief modal when the
// transporter picks "Transporter Confirmed Job Details"; the brief stays
// reachable from every other connected option too.
const JOB_BRIEF_AUTO_OPTION = 'tr_confirmed_job';

// What SanCtiProvider.submitDisposition returns — forwarded verbatim as the
// 'san-disposition-complete' event detail by DashboardLayout.
interface DispositionCompleteDetail {
  call_id?: number | null;
  submitted?: {
    disposition: string;
    disposition_sub?: string | null;
    notes?: string | null;
  };
}

/** A transporter that was conferenced in and still owes a disposition. */
export interface PendingConferenceDisposition {
  callId: number;
  party: MmConferenceParty;
  jobId: string;
}

interface UseMmCallFlowOptions {
  onToast?: (msg: string) => void;
  // Fired after the call row is tagged (lists already refetch via RTK tag
  // invalidation; use this for e.g. cursor resets).
  onLogSaved?: (pending: PendingMmContext) => void;
}

export function useMmCallFlow({ onToast, onLogSaved }: UseMmCallFlowOptions = {}) {
  const { agentState, callState, dial, startConference, addConferenceNumber } = useSanCti();
  const [tagCall] = useTagMmCallMutation();
  const [logConferenceCall] = useLogMmConferenceCallMutation();

  // Job brief to collect once a transporter call has been dispositioned.
  const [jobBriefTarget, setJobBriefTarget] = useState<{ jobId: string; name: string } | null>(null);
  // Transporter conferenced into a driver call — still owes its own
  // disposition once the primary call has been dispositioned.
  const [conferenceDisposition, setConferenceDisposition] =
    useState<PendingConferenceDisposition | null>(null);

  const toast = useCallback((msg: string) => {
    if (onToast) onToast(msg);
    else console.warn('[MM CALL FLOW]', msg);
  }, [onToast]);

  // Same gating (and wording) as DwCallQueue.handleCallNow — the reference flow.
  const guardMessage = useCallback((): string | null => {
    if (agentState !== 'ready') {
      return agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel (bottom-left) for the reason, e.g. agent already logged in elsewhere.'
        : 'CTI agent is not ready yet — please wait a moment and try again.';
    }
    if (callState !== 'idle') {
      return 'Finish or hang up the current call before dialing another lead.';
    }
    return null;
  }, [agentState, callState]);

  /**
   * Call the job's transporter (job brief discussion).
   * The call is logged in call_history_ivr by SanCti; after disposition the
   * row is tagged with this job_id and the job brief form opens.
   */
  const callTransporter = useCallback((args: {
    jobId: string;
    transporter: { id: number; name: string; mobile: string; unique_id: string };
    isGreenline?: boolean;
  }) => {
    const { jobId, transporter, isGreenline } = args;
    const blocked = guardMessage();
    if (blocked) { toast(blocked); return; }
    if (!transporter.mobile) { toast('Transporter has no phone number on record.'); return; }

    writePendingMmContext({
      kind: 'transporter',
      jobId,
      name: transporter.name,
      isGreenline: !!isGreenline,
      conferenced: [],
    });
    dial(transporter.mobile, transporter.id, transporter.name, transporter.unique_id, 'driver');
  }, [guardMessage, toast, dial]);

  /**
   * Call a job applicant (driver matchmaking).
   * Same as the transporter flow, plus match_status is stamped on the call
   * row from the disposition's sub-option. The job's transporter travels along
   * as the conference counterpart so the CTI bar can offer "Add Call" by NAME
   * (the transporter's number is never shown — see MmCallControlBar).
   */
  const callApplicant = useCallback((args: {
    jobId: string;
    transporterName: string;
    transporter?: { id: number; name: string; mobile: string; unique_id?: string };
    driver: { driver_id: number; name: string; mobile: string; unique_id: string };
    isGreenline?: boolean;
  }) => {
    const { jobId, driver, transporter, isGreenline } = args;
    const blocked = guardMessage();
    if (blocked) { toast(blocked); return; }
    if (!driver.mobile) { toast('This applicant has no phone number on record.'); return; }

    writePendingMmContext({
      kind: 'driver',
      jobId,
      name: driver.name,
      isGreenline: !!isGreenline,
      conferenced: [],
      conferenceParty: transporter?.mobile
        ? {
            id: transporter.id,
            name: transporter.name,
            mobile: transporter.mobile,
            unique_id: transporter.unique_id,
            role: 'transporter',
          }
        : undefined,
    });
    dial(driver.mobile, driver.driver_id, driver.name, driver.unique_id, 'driver');
  }, [guardMessage, toast, dial]);

  /**
   * Bridge an applicant into the live transporter call (Task 3's direction).
   * The SAN widget performs the actual conferencing; the leg is logged through
   * the same event path the call bar uses so there is a single code path.
   */
  const addApplicantToConference = useCallback((driver: {
    driver_id: number; name: string; mobile: string; unique_id?: string;
  }) => {
    const ctx = readPendingMmContext();
    if (callState !== 'connected') {
      toast('Conference is only available while a call is connected.');
      return;
    }
    if (!ctx) { toast('No matchmaking call context for this conference.'); return; }
    if (!driver.mobile) { toast('This applicant has no phone number on record.'); return; }

    startConference();
    addConferenceNumber(driver.mobile);

    const party: MmConferenceParty = {
      id: driver.driver_id,
      name: driver.name,
      mobile: driver.mobile,
      unique_id: driver.unique_id,
      role: 'driver',
    };
    recordMmConferenceParty(party);
    emitMmConferenceAdd({ ...party, jobId: ctx.jobId });
    toast(`Adding ${driver.name} to the call…`);
  }, [callState, toast, startConference, addConferenceNumber]);

  // ── Conference leg logging ──
  // Fired by the CTI call bar (transporter added to an applicant call) and by
  // addApplicantToConference above. Each bridged party gets its OWN
  // call_history_ivr row, mirroring the mobile app's `ivr_con_call`.
  useEffect(() => {
    const handler = async (e: Event) => {
      const detail = (e as CustomEvent<MmConferenceEventDetail>).detail;
      if (!detail?.id || !detail.mobile) return;
      try {
        const res = await logConferenceCall({
          user_id: detail.id,
          phone_number: detail.mobile,
          job_id: detail.jobId,
        }).unwrap();

        // A conferenced TRANSPORTER owes a disposition + job brief exactly like
        // a directly-dialled one — queued until the primary call is disposed.
        if (detail.role === 'transporter' && res?.data?.call_id) {
          setConferenceDisposition({
            callId: res.data.call_id,
            party: detail,
            jobId: detail.jobId,
          });
        }
      } catch (err) {
        console.error('[MM CALL FLOW] Failed to log conference leg:', err);
        toast('Party added to the call, but logging it failed — check the call history.');
      }
    };

    window.addEventListener(MM_CONFERENCE_EVENT, handler);
    return () => window.removeEventListener(MM_CONFERENCE_EVENT, handler);
  }, [logConferenceCall, toast]);

  // ── Disposition bridge ──
  // When the global PostCallDispositionModal submits, /call/disposition has
  // already written call_status/feedback/remarks/duration onto the
  // call_history_ivr row. Tag that same row with the matchmaking context.
  // The pending record is claimed (cleared) before the request so a
  // double-mounted listener can't tag twice.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<DispositionCompleteDetail>).detail;
      const pending = readPendingMmContext();
      if (!pending || !detail?.submitted) return;
      writePendingMmContext(null); // claim

      const sub = detail.submitted.disposition_sub || '';

      // Transporter call → collect the job brief, exactly like the mobile
      // MatchmakingFeedbackScreen does after the transporter feedback.
      if (pending.kind === 'transporter' && sub === JOB_BRIEF_AUTO_OPTION) {
        setJobBriefTarget({ jobId: pending.jobId, name: pending.name });
      }

      const callId = detail.call_id;
      if (!callId || callId <= 0) {
        // Mock call (-999) or the call row was never created — nothing to tag.
        return;
      }

      const matchStatus = pending.kind === 'driver'
        ? (MATCH_STATUS_MAP[sub] ||
           (detail.submitted.disposition === 'callback_later' ? 'callback' : 'pending'))
        : undefined;

      tagCall({ call_id: callId, job_id: pending.jobId, match_status: matchStatus })
        .unwrap()
        .then(() => onLogSaved?.(pending))
        .catch((err) => {
          console.error('[MM CALL FLOW] Failed to tag call with job:', err);
          toast('Call saved, but linking it to the job failed — check the call history.');
        });
    };

    window.addEventListener('san-disposition-complete', handler);
    return () => window.removeEventListener('san-disposition-complete', handler);
  }, [tagCall, onLogSaved, toast]);

  /** Open the job brief on demand (every connected transporter option offers it). */
  const openJobBrief = useCallback((jobId: string, name: string) => {
    setJobBriefTarget({ jobId, name });
  }, []);

  return {
    callTransporter,
    callApplicant,
    addApplicantToConference,
    // Job brief (transporter job details → `jobs`)
    jobBriefTarget,
    openJobBrief,
    closeJobBrief: useCallback(() => setJobBriefTarget(null), []),
    // Disposition owed by a conferenced transporter
    conferenceDisposition,
    clearConferenceDisposition: useCallback(() => setConferenceDisposition(null), []),
  };
}

export default useMmCallFlow;
