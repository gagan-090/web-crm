// ── ID Verification in-flight call context ──────────────────────────────────
//
// The same arrangement matchmaking uses (mmCallContext): the GLOBAL disposition
// modal lives outside this desk's React tree, so a dial has to leave a note in
// localStorage saying which desk placed it. Written on dial, read by the global
// modal (to stand aside) and by the desk (to open its own form), cleared once a
// disposition is filed.
//
// localStorage rather than React state so it survives the page refresh that a
// SAN reconnect can trigger between dialing and dispositioning.

const PENDING_KEY = 'idv_pending_call_context';

export interface PendingIdvContext {
  /** users.id of the subscriber dialled. */
  leadId: number;
  name: string;
  tmid?: string | null;
  /** When the dial was placed — only for debugging a stuck context. */
  at: number;
}

export const writePendingIdvContext = (ctx: Omit<PendingIdvContext, 'at'>): void => {
  try {
    localStorage.setItem(PENDING_KEY, JSON.stringify({ ...ctx, at: Date.now() }));
  } catch {
    /* private mode — the desk still works, the global form just won't stand aside */
  }
};

export const readPendingIdvContext = (): PendingIdvContext | null => {
  try {
    const raw = localStorage.getItem(PENDING_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return typeof parsed?.leadId === 'number' ? parsed : null;
  } catch {
    return null;
  }
};

export const clearPendingIdvContext = (): void => {
  try {
    localStorage.removeItem(PENDING_KEY);
  } catch {
    /* ignore */
  }
};

/**
 * Is the CTI's current call the one this desk placed?
 *
 * The lead check matters as much as the presence check: nothing clears the
 * context except a completed disposition, so a context left behind by an
 * abandoned verification call would otherwise hijack the form of the next,
 * unrelated dial — the exact bug matchmaking hit with its own context.
 */
export const isIdvCall = (currentLeadId: number | string | null): boolean => {
  const ctx = readPendingIdvContext();
  return !!ctx && String(ctx.leadId) === String(currentLeadId ?? '');
};
