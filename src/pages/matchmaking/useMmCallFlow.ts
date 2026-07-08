import { useCallback, useEffect } from 'react';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';
import { useTagMmCallMutation } from '../../services/api/webCrmApi';

// ── Matchmaking call lifecycle (mirrors the Driver Welcome flow) ─────────────
//
// call_history_ivr is the SINGLE SOURCE OF TRUTH for all call details
// (DW / TW / MM). The SanCti provider already creates the call row on dial
// (/web-crm/call/initiate) and writes the disposition on submit
// (/web-crm/call/disposition) — exactly like the DW flow. Matchmaking adds
// only ONE thing on top: after the disposition is submitted, the call row is
// tagged with the job it was about and (for applicant calls) the match
// outcome, via /web-crm/match-making/ivr-call-tag-job.
//
// No jobs_match_making or job_details_call_logs rows are ever written.
// The job context for the in-flight call is kept in localStorage so it
// survives a page refresh between dial and disposition.

const PENDING_KEY = 'mm_pending_call_context';

export interface PendingMmContext {
  kind: 'driver' | 'transporter';
  jobId: string;
  name: string; // who was called — for agent-facing messages
}

const readPending = (): PendingMmContext | null => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) || 'null');
  } catch {
    return null;
  }
};

const writePending = (p: PendingMmContext | null) => {
  if (p) localStorage.setItem(PENDING_KEY, JSON.stringify(p));
  else localStorage.removeItem(PENDING_KEY);
};

// Global modal's MM sub-options → match_status stored on call_history_ivr
const MATCH_STATUS_MAP: Record<string, string> = {
  placement_done: 'selected',
  callback: 'callback',
  interested_callback: 'callback',
  rejected: 'rejected',
  not_interested: 'not_interested',
};

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

interface UseMmCallFlowOptions {
  onToast?: (msg: string) => void;
  // Fired after the call row is tagged (lists already refetch via RTK tag
  // invalidation; use this for e.g. cursor resets).
  onLogSaved?: (pending: PendingMmContext) => void;
}

export function useMmCallFlow({ onToast, onLogSaved }: UseMmCallFlowOptions = {}) {
  const { agentState, callState, dial } = useSanCti();
  const [tagCall] = useTagMmCallMutation();

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
   * row is tagged with this job_id.
   */
  const callTransporter = useCallback((args: {
    jobId: string;
    transporter: { id: number; name: string; mobile: string; unique_id: string };
  }) => {
    const { jobId, transporter } = args;
    const blocked = guardMessage();
    if (blocked) { toast(blocked); return; }
    if (!transporter.mobile) { toast('Transporter has no phone number on record.'); return; }

    writePending({ kind: 'transporter', jobId, name: transporter.name });
    dial(transporter.mobile, transporter.id, transporter.name, transporter.unique_id, 'driver');
  }, [guardMessage, toast, dial]);

  /**
   * Call a job applicant (driver matchmaking).
   * Same as the transporter flow, plus match_status is stamped on the call
   * row from the disposition's sub-option.
   */
  const callApplicant = useCallback((args: {
    jobId: string;
    transporterName: string;
    driver: { driver_id: number; name: string; mobile: string; unique_id: string };
  }) => {
    const { jobId, driver } = args;
    const blocked = guardMessage();
    if (blocked) { toast(blocked); return; }
    if (!driver.mobile) { toast('This applicant has no phone number on record.'); return; }

    writePending({ kind: 'driver', jobId, name: driver.name });
    dial(driver.mobile, driver.driver_id, driver.name, driver.unique_id, 'driver');
  }, [guardMessage, toast, dial]);

  // ── Disposition bridge ──
  // When the global PostCallDispositionModal submits, /call/disposition has
  // already written call_status/feedback/remarks/duration onto the
  // call_history_ivr row. Tag that same row with the matchmaking context.
  // The pending record is claimed (cleared) before the request so a
  // double-mounted listener can't tag twice.
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent<DispositionCompleteDetail>).detail;
      const pending = readPending();
      if (!pending || !detail?.submitted) return;
      writePending(null); // claim

      const callId = detail.call_id;
      if (!callId || callId <= 0) {
        // Mock call (-999) or the call row was never created — nothing to tag.
        return;
      }

      const sub = detail.submitted.disposition_sub || '';
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

  return { callTransporter, callApplicant };
}

export default useMmCallFlow;
