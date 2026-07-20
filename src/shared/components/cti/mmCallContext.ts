// ── Matchmaking in-flight call context ──────────────────────────────────────
//
// Shared by the MM pages (useMmCallFlow) and the GLOBAL CTI call bar, which
// lives outside the matchmaking tree and therefore cannot read MM React state.
// The context is written to localStorage on dial so it also survives a page
// refresh between dialing and dispositioning.

const PENDING_KEY = 'mm_pending_call_context';

/** The other party the agent can conference into the live call. */
export interface MmConferenceParty {
  /** users.id — needed to log the conference leg in call_history_ivr. */
  id: number;
  name: string;
  /** Used ONLY to place the call; never rendered in the UI. */
  mobile: string;
  unique_id?: string;
  role: 'transporter' | 'driver';
}

export interface PendingMmContext {
  kind: 'driver' | 'transporter';
  jobId: string;
  name: string; // who was called — for agent-facing messages
  isGreenline?: boolean;
  /**
   * Pre-resolved conference counterpart offered by the call bar's "Add Call":
   * for an applicant call this is the job's transporter (Task 2). Transporter
   * calls leave this unset — the agent picks an applicant from the list
   * instead (Task 3).
   */
  conferenceParty?: MmConferenceParty;
  /** Conference legs already bridged into this call. */
  conferenced?: MmConferenceParty[];
}

export const readPendingMmContext = (): PendingMmContext | null => {
  try {
    return JSON.parse(localStorage.getItem(PENDING_KEY) || 'null');
  } catch {
    return null;
  }
};

export const writePendingMmContext = (ctx: PendingMmContext | null) => {
  if (ctx) localStorage.setItem(PENDING_KEY, JSON.stringify(ctx));
  else localStorage.removeItem(PENDING_KEY);
};

/** Record a party that has been bridged into the current call. */
export const recordMmConferenceParty = (party: MmConferenceParty) => {
  const ctx = readPendingMmContext();
  if (!ctx) return;
  const already = (ctx.conferenced || []).some(p => p.id === party.id);
  if (already) return;
  writePendingMmContext({ ...ctx, conferenced: [...(ctx.conferenced || []), party] });
};

/**
 * Fired by whoever bridges a party in (the global call bar or an MM page) so
 * the MM flow can log the leg as its own call_history_ivr row. Detail is the
 * MmConferenceParty plus the job it belongs to.
 */
export const MM_CONFERENCE_EVENT = 'mm-conference-add';

export interface MmConferenceEventDetail extends MmConferenceParty {
  jobId: string;
}

export const emitMmConferenceAdd = (detail: MmConferenceEventDetail) => {
  window.dispatchEvent(new CustomEvent<MmConferenceEventDetail>(MM_CONFERENCE_EVENT, { detail }));
};

/**
 * Asks the matchmaking screen to open its searchable applicant picker. The
 * call bar is global and has no access to the job's applicants, so it requests
 * the picker instead of rendering one.
 */
export const MM_OPEN_ADD_TO_CALL_EVENT = 'mm-open-add-to-call';

export const emitMmOpenAddToCall = () => {
  window.dispatchEvent(new Event(MM_OPEN_ADD_TO_CALL_EVENT));
};
