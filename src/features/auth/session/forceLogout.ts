import { LOGIN_PATH } from './sessionConfig';

// Central, idempotent "sign this device out now" used whenever the backend
// tells us the seat is no longer ours (401 SESSION_SUPERSEDED) or the session
// otherwise ended. It mirrors AuthProvider.logout's careful ordering: let the
// SAN CTI softphone log out first (best-effort, capped) so we don't leave the
// agent locked on SAN's server, then clear local state and hard-redirect to the
// login screen with a reason the LoginPage turns into a friendly banner.

let loggingOut = false;

export async function forceLogout(reason: string = 'ended'): Promise<void> {
  if (loggingOut) return;
  loggingOut = true;

  try {
    const p = (window as unknown as { __sanCtiLogout?: () => Promise<unknown> }).__sanCtiLogout?.();
    if (p && typeof (p as Promise<unknown>).then === 'function') {
      await Promise.race([p, new Promise((r) => setTimeout(r, 2000))]);
    }
  } catch {
    /* best-effort — never block sign-out */
  }

  try {
    localStorage.clear();
  } catch {
    /* ignore */
  }

  const url = `${LOGIN_PATH}?reason=${encodeURIComponent(reason)}`;
  window.location.assign(url);
}
