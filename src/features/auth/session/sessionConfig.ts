// Single-session / single-tab configuration for the Web CRM.
//
// The backend enforces "one agent, one live device" (see WebCrmAuthController
// and EnsureActiveWebCrmSession). These constants drive the frontend half:
// the keep-alive heartbeat that holds the seat, and the same-browser single-tab
// lease that gives the WhatsApp-style "open in another window / Use Here" flow.

// How often the open CRM tab pings /web-crm/heartbeat to hold its seat.
// Keep it comfortably below the backend session TTL (config/webcrm.php, 180s)
// so a present-but-idle agent is never mistaken for an abandoned session.
export const HEARTBEAT_INTERVAL_MS = 60_000;

// localStorage key holding the single-tab lease { tabId, ts, gen }.
export const ACTIVE_TAB_KEY = 'tm_connect_active_tab';

// A tab that owns the lease renews it this often; a lease not renewed within
// LEASE_TTL_MS is considered dead (its tab was closed) and can be claimed.
export const LEASE_RENEW_MS = 3_000;
export const LEASE_TTL_MS = 8_000;

// The app is served under /crm (BrowserRouter basename). forceLogout does a
// hard navigation, so it needs the full path including that basename.
export const LOGIN_PATH = '/crm/login';
