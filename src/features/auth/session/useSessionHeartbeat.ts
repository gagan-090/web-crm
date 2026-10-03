import { useEffect } from 'react';
import { API_BASE_URL } from '../../../shared/constants/config';
import { HEARTBEAT_INTERVAL_MS } from './sessionConfig';
import { forceLogout } from './forceLogout';

// Holds this device's single-session seat while the CRM is open. Pings
// /web-crm/heartbeat right after login and then on an interval, so an agent
// who is present but idle (making no other API calls) keeps the seat and is
// never mistaken for an abandoned session. If the backend answers 401 the seat
// was taken over elsewhere (or an admin force-logged us) — sign out cleanly.
//
// A network blip is ignored: a failed fetch just waits for the next tick. Only
// an explicit 401 from the server ends the session.
export function useSessionHeartbeat(token: string | null | undefined): void {
  useEffect(() => {
    if (!token) return;

    let cancelled = false;

    const ping = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/web-crm/heartbeat`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: 'application/json',
          },
        });
        if (cancelled) return;
        if (res.status === 401) {
          let code = '';
          try {
            const j = await res.json();
            code = j?.code || '';
          } catch {
            /* no body */
          }
          forceLogout(code === 'SESSION_SUPERSEDED' ? 'superseded' : 'expired');
        }
      } catch {
        /* transient network error — retry on the next tick */
      }
    };

    ping();
    const id = window.setInterval(ping, HEARTBEAT_INTERVAL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, [token]);
}

export default useSessionHeartbeat;
