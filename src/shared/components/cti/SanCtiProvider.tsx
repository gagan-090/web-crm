import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { API_BASE_URL } from '../../../shared/constants/config';
import { SanCtiContext } from './SanCtiContext';
import type { SanCtiContextType, ConferenceMember, DispositionData } from './SanCtiContext';

// Context, hook (useSanCti), and shared types live in ./SanCtiContext —
// kept out of this file so it exports only a component and stays
// Fast-Refresh-safe during development (see comment there).

/**
 * How long SAN needs after ConfrenceToggle before it will accept a number to
 * bridge in. Mirrors the 1.5 s the same integration already waits after
 * ManualOn for SAN to finish writing its own state — sending the member in the
 * same tick as the toggle races that setup and the leg is silently dropped.
 */
const CONFERENCE_SETTLE_MS = 1500;

/**
 * How long to wait for SAN to acknowledge a HoldCall/UnholdCall before
 * re-sending it once, and (at 2×) before flagging the state as unconfirmed.
 */
const HOLD_ACK_MS = 5000;

/** Last 10 digits — SAN reports members with assorted 0/+91 prefixes. */
const sameNumber = (v?: string): string => (v || '').replace(/\D/g, '').slice(-10);

interface SanCtiProviderProps {
  children: React.ReactNode;
  sanUsername?: string | null;
  sanPassword?: string | null;
  bearerToken?: string;
  agentId?: number;
  apiBaseUrl?: string;
}

export default function SanCtiProvider({
  children,
  sanUsername: propSanUsername,
  sanPassword: propSanPassword,
  bearerToken: propBearerToken,
  agentId: propAgentId,
  apiBaseUrl = `${API_BASE_URL}/web-crm`
}: SanCtiProviderProps) {
  const { user } = useAuth();
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Resolve credentials from Auth Context if not provided as props.
  // 'Agent1@Demo' is permanently logged in on another machine on SAN's
  // server (confirmed directly against their login API — it rejects every
  // attempt with "You are already login on another machine"), so it must
  // never be used. 'Agent2@Demo' is the verified-working fallback.
  const bearerToken = propBearerToken || user?.token || '';
  const agentId = propAgentId || user?.id || 0;

  // credOverride lets the CTI settings panel update credentials at runtime
  // without requiring a page reload — saved to DB and applied immediately.
  const [credOverride, setCredOverride] = useState<{ username: string; password: string; extension: string } | null>(null);
  const [showCtiSettings, setShowCtiSettings] = useState(false);
  const [ctiSettingsSaving, setCtiSettingsSaving] = useState(false);
  const [ctiSettingsErr, setCtiSettingsErr] = useState('');

  const sanUsername = credOverride?.username || propSanUsername || user?.san_username || 'Agent2@Demo';
  const sanPassword = credOverride?.password || propSanPassword || user?.san_password || 'TDY2cmlkZS9sQy9ITFhaYVBXdFhJQT09';

  // Check if there is a pending disposition stored in localStorage
  const getPendingDisposition = () => {
    try {
      const stored = localStorage.getItem('san_pending_disposition');
      if (stored) {
        return JSON.parse(stored);
      }
    } catch (_) { }
    return null;
  };

  const pending = getPendingDisposition();

  // Increment to force iframe remount (used after fresh login so SAN's module-level
  // logged_agent is re-initialized from localStorage by getCurrentSession()).
  const [sanIframeKey, setSanIframeKey] = useState(0);
  // True after the first post-login reload so we only reload once per session.
  const freshLoginReloadDoneRef = useRef<boolean>(false);

  // ── Agent State ──
  const [agentState, setAgentState] = useState<string>('logged_out');
  // logged_out → logged_in → ready (idle) → on_call → disposition_pending → ready
  const [extension, setExtension] = useState<string>('');
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
  const [breakName, setBreakName] = useState<string>('');
  const [isManualMode, setIsManualMode] = useState<boolean>(false);

  // ── Call State ──
  const [callState, setCallState] = useState<string>(pending ? 'disposition_pending' : 'idle');
  // idle → dialing → ringing → connected → hangup → disposition_pending → idle
  const [currentCallId, setCurrentCallId] = useState<number | null>(pending ? pending.currentCallId : null);
  const [currentLeadId, setCurrentLeadId] = useState<number | string | null>(pending ? pending.currentLeadId : null);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string>(pending ? pending.currentPhoneNumber : '');
  const [currentLeadName, setCurrentLeadName] = useState<string>(pending ? pending.currentLeadName : '');
  const [currentLeadTmid, setCurrentLeadTmid] = useState<string>(pending ? pending.currentLeadTmid : '');
  const [currentLeadType, setCurrentLeadType] = useState<string>(pending ? (pending.currentLeadType || 'driver') : 'driver');
  const [callDuration, setCallDuration] = useState<number>(pending ? pending.callDuration : 0);
  // TRUE once SAN reported exten_status 'Answer' for this call (outgoing or
  // incoming). This is the authoritative "the call connected" signal — the
  // duration counter is not: a call answered and dropped inside the same second
  // still reads 0s. The disposition form uses it to REMOVE the not-connected
  // outcomes, so an answered call can never be filed as Ringing / No Answer /
  // Switched Off — which is how call_history_ivr ended up holding rows that
  // claimed both at once. Survives a reload via the pending record below.
  const [callWasAnswered, setCallWasAnswered] = useState<boolean>(
    pending ? !!pending.callWasAnswered || pending.callDuration > 0 : false
  );
  // SAN has gone quiet on a live call (no event for 60s after the dial), so the
  // state shown on the call bar is the last one SAN reported and may be stale.
  // The bar says so instead of showing a confident "Dialing..." forever.
  // Cleared by the next SAN event, by a new dial and by call teardown.
  const [statusUnconfirmed, setStatusUnconfirmed] = useState<boolean>(false);
  const [isHeld, setIsHeld] = useState<boolean>(false);
  // True when SAN never acknowledged the last hold/unhold. The call bar shows
  // this rather than the bar silently flipping its own label back — see
  // toggleHold for why a silent revert was worse than an unconfirmed badge.
  const [isHoldUnconfirmed, setIsHoldUnconfirmed] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  // Keyed by conf_member (SAN's own member id) — SANAppConfEventjoin/Leave
  // send the full current member dict on every event, so these are replaced
  // wholesale rather than merged incrementally.
  const [conferenceMembers, setConferenceMembers] = useState<ConferenceMember[]>([]);
  const [conferenceDialingMembers, setConferenceDialingMembers] = useState<ConferenceMember[]>([]);
  // ConfrenceToggle is a TOGGLE, exactly like ManualOn: sending it a second
  // time drops SAN back out of conference mode, so the member we then ask it
  // to dial goes nowhere. Track whether we've already switched this call into
  // conference mode, and when — SAN needs a moment to establish it before it
  // will accept a number to bridge in.
  const conferenceModeRef = useRef<boolean>(false);
  const conferenceToggleAtRef = useRef<number>(0);
  // Mirror of conferenceMembers for the event handlers, which are registered
  // once and would otherwise close over the first render's empty list.
  const conferenceMembersRef = useRef<ConferenceMember[]>([]);
  // Reactive mirror of acceptingIncomingRef — drives the iframe click-overlay
  // sizing/positioning below, which needs to re-render when this flips.
  const [isAcceptingIncoming, setIsAcceptingIncoming] = useState<boolean>(false);

  // ── Microphone & Iframe Loading states ──
  const isMicPermissionChecked = true;
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  // iframe panel is fully hidden by default; auto-shown only when an incoming
  // call is ringing (so the agent can click SAN's native Answer button), then
  // auto-hidden again once the call moves out of incoming_ringing state.
  const [isCtiMinimized, setIsCtiMinimized] = useState<boolean>(true);

  // ── Disposition ──
  const [showDispositionForm, setShowDispositionForm] = useState<boolean>(pending ? true : false);
  const [sanDispositionOptions, setSanDispositionOptions] = useState<string[]>([]);

  // ── Call Direction ──
  const [isIncomingCall, setIsIncomingCall] = useState<boolean>(pending ? pending.isIncomingCall : false);

  // ── Extra caller info (populated from lookup on incoming) ──
  const [currentLeadLocation, setCurrentLeadLocation] = useState<string>('');
  const [currentLeadCallStatus, setCurrentLeadCallStatus] = useState<string>('');

  // ── Timer ──
  const timerRef = useRef<any>(null);
  // Ref copy of callDuration so the SAN event handler doesn't re-register every second
  const callDurationRef = useRef<number>(pending ? pending.callDuration : 0);

  // ── Dialing Timeout (fallback if SAN never responds) ──
  const dialingTimeoutRef = useRef<any>(null);
  // SAN reported Answer before /call/initiate returned the call row id, so the
  // 'answered' update could not be sent yet. dial() flushes it on arrival.
  const answeredBeforeCallIdRef = useRef<boolean>(false);
  // Set synchronously by dial() to close the window before setCallState
  // ('dialing') commits — see dial() for the duplicate-dial race this stops.
  const dialInFlightRef = useRef<boolean>(false);

  // ── Manual Call Ending Tracking ──
  const [userInitiatedHangup, setUserInitiatedHangup] = useState<boolean>(false);

  // ── Guard: only show disposition if an outgoing dial happened in this session ──
  // This prevents the modal from appearing on page load, route change, or SAN reconnection
  const hasDialedThisSession = useRef<boolean>(pending ? true : false);
  const lastDialTime = useRef<number>(0);

  // ── Live-value refs for SAN event handler ──
  // SAN postMessage events are macrotasks. React's useEffect (where the listener is
  // registered) runs AFTER paint, so multiple SAN events can fire before the effect
  // re-registers with updated closure values — leading to stale callState reads.
  // These refs are synced via useLayoutEffect (runs before paint, after commit) so the
  // single persistent handler always reads the current value without re-registration.
  const callStateRef = useRef<string>(pending ? 'disposition_pending' : 'idle');
  const userInitiatedHangupRef = useRef<boolean>(false);
  // Ref mirror of isIncomingCall — always readable inside SAN event handler
  // without requiring re-registration of the effect.
  const isIncomingCallRef = useRef<boolean>(pending ? pending.isIncomingCall : false);
  const currentLeadTypeRef = useRef<string>(pending ? (pending.currentLeadType || 'driver') : 'driver');
  // Ref mirror of agentState — always readable inside auto-login without re-registration
  const agentStateRef = useRef<string>('logged_out');
  // Set true the instant we observe ANY message back from SAN (even an
  // unrecognized one) — proves the postMessage channel and SAN's own
  // listener are alive, which is the only thing the login-retry race
  // condition below actually needs to know. SAN's own confirmation events
  // (Init/Ready) have been observed to not reliably fire even after a
  // genuinely successful login, so basing retries on agentState alone makes
  // us retry a login that already succeeded — which SAN then rejects as
  // "already logged in on another machine", corrupting the session before
  // the agent ever gets to dial.
  const hasSanResponseRef = useRef<boolean>(false);
  // Set while a login() call is in-flight. The SAN iframe fires {type:'Login', success:false}
  // as an intermediate ack BEFORE their own callapi.js finishes the HTTP request — that event
  // is NOT a real failure. We only clear this flag when SANAppInitEvent arrives (real outcome)
  // or the watchdog fires after 12 s with no Init event.
  const loginPendingRef = useRef<boolean>(false);
  const loginWatchdogRef = useRef<any>(null);
  // Fallback: if SANAppReadyEvent never fires after we send {type:'ready'}, force ready after 4s.
  // Cleared when SANAppReadyEvent arrives so we don't double-fire.
  const readyFallbackRef = useRef<any>(null);
  // Nudge timer: re-send {type:'ready'} once before the forced-ready fallback,
  // because SAN drops the first 'ready' whenever it arrives before its own
  // agentReady bookkeeping is set up.
  const readyRetryRef = useRef<any>(null);
  // ── Post-reload recovery — the "logged in but never ready" bug ──
  // SANAppInitEvent reloads the iframe once per fresh login so SAN's module-level
  // `logged_agent` re-initialises from localStorage. SAN does NOT reliably re-emit
  // SANAppInitEvent on that second load, and the auto-login effect refuses to
  // re-drive anything once agentState has left 'logged_out'. Without the ladder
  // below the agent then sits at 'logged_in' forever — logged into SAN's mini CRM
  // but never ready, every dial rejected ("CTI agent is not ready"), and SAN's own
  // login modal eventually reappearing inside the iframe minutes later.
  // Ladder, armed when the reloaded iframe finishes loading:
  //   +6 s  no Init            → re-send {type:'ready'} (the SAN session is usually
  //                              alive and simply never announced itself)
  //   +14 s still not ready    → full login() again, which re-arms its own watchdog
  const awaitingPostReloadInitRef = useRef<boolean>(false);
  const postReloadNudgeRef = useRef<any>(null);
  const postReloadReloginRef = useRef<any>(null);
  // Ref mirror of isManualMode. SAN implements ManualOn via toggleManualOnOff —
  // it is a TOGGLE, not a setter, so sending it while manual mode is already on
  // turns it back OFF and drops the agent out of ready on SAN's side. That is the
  // "auto unready in between conversation" symptom: SANAppReadyEvent fires after
  // every disposition, and the old code answered every one of them with another
  // unconditional ManualOn. Every send is now gated on this ref.
  const isManualModeRef = useRef<boolean>(false);
  // True once we have seen SAN confirm manual mode at least once, so the very
  // first ManualOn (where we genuinely don't know SAN's state) still goes out.
  const manualModeKnownRef = useRef<boolean>(false);
  // Guard: set to true when agent clicks "Accept". Blocks all state-resetting
  // SAN events (Ready, SavePage) for up to 8 s while the SIP handshake completes.
  // Cleared immediately when SANAppIncomingEvent(Answer) fires.
  const acceptingIncomingRef = useRef<boolean>(false);
  const acceptingIncomingTimerRef = useRef<any>(null);
  // Ref to hold the active incoming call payload to pass during IncAccept
  const activeIncomingPayloadRef = useRef<any>(null);
  // True once /call/incoming/initiate has been fired for the current incoming
  // call, so a repeated SAN "Answer" event can't log a second row. Reset when
  // the call ends (idle) or a new incoming call rings.
  const incomingLoggedRef = useRef<boolean>(false);
  // The call_history_ivr id the ring-time log came back with. Held in a ref,
  // not read off currentCallId state: SAN's "Answer" event routinely arrives
  // before React has re-rendered with the id, and the Answer branch needs it
  // synchronously to mark the row connected.
  const incomingCallIdRef = useRef<number | null>(null);
  // call_id whose wrap-up has already been handed to SAN. A retry after a
  // failed Laravel save must not send SAN a second SubmitDisposition — see
  // submitDisposition.
  const sanDispositionSentForCallRef = useRef<number | string | null>(null);

  // ── Hold confirmation tracking ──
  // Incremented on every hold confirmation from SAN (SANAppHoldEvent or
  // SANAppOutgoingEvent exten_status:'Hold'). toggleHold's watchdogs compare
  // against it to detect whether SAN ever acknowledged the request.
  const holdEventSeqRef = useRef<number>(0);
  // First watchdog: re-sends the same hold verb once if SAN stayed silent.
  const holdRetryTimerRef = useRef<any>(null);
  // Second watchdog: flags the state as unconfirmed if SAN is still silent.
  const holdConfirmTimerRef = useRef<any>(null);

  // ── Explicit SAN logout coordination (window.__sanCtiLogout) ──
  // Resolver for an in-flight explicit SAN logout — resolved early by
  // SANAppLogoutEvent so CRM logout doesn't have to wait the full timeout.
  const sanLogoutResolveRef = useRef<(() => void) | null>(null);
  // True once an explicit logout was dispatched — the user→null fallback
  // effect must not send a second Logout (SAN's logOut() crashes reading
  // its already-cleared logged_agent on a duplicate call).
  const sanLogoutDoneRef = useRef<boolean>(false);

  // ── Helper: post to SAN iframe ──
  const postToSan = useCallback((data: any) => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      console.log('[SAN SEND]', data);
      iframe.contentWindow.postMessage(data, '*');
    } else {
      console.warn('[SAN SEND] DROPPED — iframe not ready, nothing sent:', data);
    }
  }, []);

  /**
   * Ask SAN to enter manual-dial mode, 1.5 s later so SAN has finished writing
   * `crmstates` (toggleManualOnOff crashes reading crmstates.agent_id if we beat it).
   *
   * SAN's ManualOn is a toggle, so this is a no-op once manual mode is already
   * confirmed on — re-sending it there is what silently un-readied the agent
   * between conversations. The first send always goes out, since until
   * SANAppManualOnOffEvent arrives we have no idea what SAN's mode actually is.
   *
   * Only ONE send may ever be in flight: a second call cancels the first one's
   * pending timer. The skip-if-already-on guard alone was not enough, because
   * wrap-up calls this twice 1s apart (see submitDisposition) — if SAN's
   * SANAppManualOnOffEvent took longer than that 1s to come back, both timers
   * fired with the guard still reading "off" and the pair of ManualOn toggles
   * cancelled out, leaving the agent un-ready mid-shift.
   */
  const manualOnTimerRef = useRef<any>(null);
  const requestManualOn = useCallback(() => {
    if (manualOnTimerRef.current) clearTimeout(manualOnTimerRef.current);
    manualOnTimerRef.current = setTimeout(() => {
      manualOnTimerRef.current = null;
      if (manualModeKnownRef.current && isManualModeRef.current) {
        console.log('[SAN CTI] ManualOn skipped — SAN already reports manual mode ON (re-sending would toggle it OFF)');
        return;
      }
      postToSan({ type: 'ManualOn' });
    }, 1500);
  }, [postToSan]);

  // ── Helper: API call to Laravel ──
  // Stamps http_ok / http_status onto the parsed body so callers can tell a
  // real save from a rejection. This used to return `await res.json()` for ANY
  // response code, so a 422 ("The selected user id is invalid") or a 500 came
  // back looking exactly like a success — which is how a failed disposition
  // could close its own modal and move the agent on to the next lead.
  // Existing fields are left untouched, so callers that only read `.data` are
  // unaffected.
  const apiCall = useCallback(async (method: string, endpoint: string, body: any = null) => {
    if (!bearerToken) return null;
    try {
      const opts: RequestInit = {
        method,
        headers: {
          'Authorization': `Bearer ${bearerToken}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
      };
      if (body) opts.body = JSON.stringify(body);
      const res = await fetch(`${apiBaseUrl}${endpoint}`, opts);

      let json: any = null;
      try { json = await res.json(); } catch (_) { /* empty / non-JSON body */ }

      // Only merge into plain objects — a top-level array response must stay
      // an array for the callers that iterate it.
      const mergeable = json !== null && typeof json === 'object' && !Array.isArray(json);
      if (!mergeable) return json;

      if (!res.ok) {
        console.error(`[SAN CTI] API ${res.status} ${endpoint}:`, json);
        return { ...json, status: false, http_ok: false, http_status: res.status };
      }
      return { ...json, http_ok: true, http_status: res.status };
    } catch (err) {
      console.error(`[SAN CTI] API error ${endpoint}:`, err);
      return null;
    }
  }, [bearerToken, apiBaseUrl]);

  /** Best-effort human message out of a Laravel error body. */
  const apiErrorMessage = (result: any, fallback: string): string => {
    if (!result) return 'Could not reach the server. Check your connection and try again.';
    const errors = result.errors;
    if (errors && typeof errors === 'object') {
      const first = Object.values(errors)[0];
      if (Array.isArray(first) && first[0]) return String(first[0]);
      if (typeof first === 'string') return first;
    }
    return result.message || fallback;
  };

  // ── Start call timer ──
  const startTimer = useCallback(() => {
    setCallDuration(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  /**
   * Stop both hold watchdogs (see toggleHold) and clear the unconfirmed flag.
   * Called from every end-of-call reset: a timer left armed from the previous
   * call would otherwise fire part-way into the next one and re-send a stale
   * hold verb.
   */
  const clearHoldWatchers = useCallback(() => {
    if (holdRetryTimerRef.current) { clearTimeout(holdRetryTimerRef.current); holdRetryTimerRef.current = null; }
    if (holdConfirmTimerRef.current) { clearTimeout(holdConfirmTimerRef.current); holdConfirmTimerRef.current = null; }
    setIsHoldUnconfirmed(false);
  }, []);

  // Keep callDurationRef in sync so the SAN event handler can read it without
  // being added to the effect dependency array (which caused re-registration every second)
  useEffect(() => {
    callDurationRef.current = callDuration;
  }, [callDuration]);

  // Fallback: if CRM user disappears (user → null) WITHOUT the explicit
  // __sanCtiLogout flow having run (e.g. session expiry), still try to end
  // the SAN session. Note: when logout happens via AuthProvider.logout(),
  // this provider usually unmounts before this effect can fire — that's why
  // the explicit awaitable flow below exists.
  const prevUserIdRef = useRef<number | null>(user?.id ?? null);
  useEffect(() => {
    const prevId = prevUserIdRef.current;
    const currId = user?.id ?? null;
    if (prevId !== null && currId === null && !sanLogoutDoneRef.current) {
      console.log('[SAN CTI] CRM logout detected — logging out SAN session');
      postToSan({ type: 'Logout' });
    }
    if (currId !== null) sanLogoutDoneRef.current = false;
    prevUserIdRef.current = currId;
  }, [user, postToSan]);

  // Sync live-value refs before paint so the persistent SAN message handler always
  // reads current state even when React hasn't re-registered the listener yet.
  useLayoutEffect(() => {
    callStateRef.current = callState;
    // Any committed callState means callStateRef is now authoritative and the
    // ordinary guard in dial() takes over, so the synchronous one can stand
    // down. (Every dial() path that sets it also changes callState — to
    // 'dialing' on success, back to 'idle' on the masked-number bail-out.)
    dialInFlightRef.current = false;
  }, [callState]);
  useLayoutEffect(() => { userInitiatedHangupRef.current = userInitiatedHangup; }, [userInitiatedHangup]);
  useLayoutEffect(() => { isIncomingCallRef.current = isIncomingCall; }, [isIncomingCall]);
  useLayoutEffect(() => { currentLeadTypeRef.current = currentLeadType; }, [currentLeadType]);
  useLayoutEffect(() => { agentStateRef.current = agentState; }, [agentState]);
  useLayoutEffect(() => { isManualModeRef.current = isManualMode; }, [isManualMode]);

  // ── Sync pending disposition to localStorage ──
  useEffect(() => {
    if (callState === 'disposition_pending') {
      const data = {
        currentCallId,
        currentLeadId,
        currentPhoneNumber,
        currentLeadName,
        currentLeadTmid,
        isIncomingCall,
        callDuration,
        currentLeadType,
        callWasAnswered,
      };
      localStorage.setItem('san_pending_disposition', JSON.stringify(data));
    } else if (callState === 'idle') {
      localStorage.removeItem('san_pending_disposition');
    }
  }, [
    callState,
    currentCallId,
    currentLeadId,
    currentPhoneNumber,
    currentLeadName,
    currentLeadTmid,
    isIncomingCall,
    callDuration,
    callWasAnswered,
  ]);

  // ═══════════════════════════════════════════════════════════
  // PUBLIC ACTIONS (exposed via useSanCti)
  // ═══════════════════════════════════════════════════════════

  /**
   * Login to SAN. Called once on CRM page load.
   */
  const login = useCallback(() => {
    if (!sanUsername) return;
    // freshLoginReloadDoneRef is NOT reset here: auto-retry logins (watchdog →
    // iframe reload → re-login) must remember that the once-per-session reload
    // already happened, otherwise every retry cycle reloads the iframe again
    // and the "give up" branch below is never reached. It is reset only where
    // a genuinely new session starts: mount (useRef(false)) and
    // saveCtiCredentials (new credentials).
    loginPendingRef.current = true;
    // A login supersedes any in-flight post-reload recovery — otherwise the
    // ladder's own re-login can land on top of this one and SAN rejects the
    // duplicate as "already login on another machine".
    awaitingPostReloadInitRef.current = false;
    if (postReloadNudgeRef.current) { clearTimeout(postReloadNudgeRef.current); postReloadNudgeRef.current = null; }
    if (postReloadReloginRef.current) { clearTimeout(postReloadReloginRef.current); postReloadReloginRef.current = null; }
    if (loginWatchdogRef.current) clearTimeout(loginWatchdogRef.current);
    loginWatchdogRef.current = setTimeout(() => {
      loginPendingRef.current = false;
      loginWatchdogRef.current = null;
      if (agentStateRef.current !== 'ready' && agentStateRef.current !== 'logged_in') {
        console.warn('[SAN CTI] Login watchdog (6s): login incomplete — showing SAN softphone login panel');
        setAgentState('logged_out');
        setIsCtiMinimized(false);
        apiCall('POST', '/cti/status', { status: 'logged_out' });
      }
    }, 6000);
    postToSan({
      type: 'login',
      user_name: sanUsername,
      password: sanPassword,
      verifiedFlag: '0',
      uniqueId: '',
    });
  }, [sanUsername, sanPassword, agentId, postToSan, apiCall]);

  /**
   * Save SAN CTI credentials to DB and re-login immediately.
   */
  const saveCtiCredentials = async (username: string, password: string, extension: string) => {
    if (!username.trim() || !password.trim()) { setCtiSettingsErr('Username and password are required.'); return; }
    setCtiSettingsSaving(true);
    setCtiSettingsErr('');
    try {
      const res = await fetch(`${apiBaseUrl}/me/cti-credentials`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${bearerToken}`, 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ san_username: username, san_password: password, san_extension: extension || null }),
      });
      const json = await res.json();
      if (!json.status) throw new Error(json.message || 'Save failed');
      setCredOverride({ username, password, extension });
      setShowCtiSettings(false);
      // New credentials = genuinely new SAN session — allow the once-per-session
      // iframe reload (and its watchdog retry) to happen again.
      freshLoginReloadDoneRef.current = false;
      // Small delay so the new credentials are applied before re-login
      setTimeout(() => login(), 300);
    } catch (e: any) {
      setCtiSettingsErr(e?.message || 'Failed to save credentials.');
    } finally {
      setCtiSettingsSaving(false);
    }
  };

  /**
   * Go ready (live). Called after SANAppInitEvent with status='1'.
   */
  const goReady = useCallback(() => {
    postToSan({ type: 'ready' });
  }, [postToSan]);

  /**
   * DIAL A NUMBER. This is what the "Call Now" button on lead cards calls.
   *
   * @param {string} phoneNumber - Driver's mobile number
   * @param {number|string} leadUserId  - users.id or social_media_leads.id of the driver being called
   * @param {string} [name] - Driver's name
   * @param {string} [tmid] - Driver's unique ID
   * @param {string} [leadType] - Type of lead e.g. 'driver' or 'social_media'
   */
  const dial = useCallback(async (phoneNumber: string, leadUserId: number | string, name?: string, tmid?: string, leadType: string = 'driver') => {
    // Re-entrancy guard, set SYNCHRONOUSLY. setCallState('dialing') below does
    // not take effect until React commits, so two calls landing in the same
    // tick — an impatient double-click on Call Now (nothing visible happens for
    // ~1s), or a screen that dials while navigating to the focus page — both
    // read callState as 'idle', both pass the guard, and both post a dial to
    // SAN and a row to /call/initiate. That is the "call keeps initiating"
    // symptom: repeated dial attempts against a channel SAN is already
    // setting up. Cleared on the next committed callState (see the layout
    // effect that syncs callStateRef), by which point the state machine itself
    // blocks duplicates.
    if (dialInFlightRef.current) {
      console.warn('[SAN CTI] Dial IGNORED — a dial is already in flight for this agent');
      return;
    }
    // Read live state through the refs, not the closure. dial() is handed out
    // on window._sanDial and captured by consumers, so the closure's agentState
    // / callState can be a render behind — which let a dial through while a
    // call was already up.
    if (agentStateRef.current !== 'ready') {
      console.warn('[SAN CTI] Cannot dial, agent is not ready. Current state:', agentStateRef.current);
      return;
    }
    const liveCallState = callStateRef.current;
    if (liveCallState !== 'idle') {
      console.warn('[SAN CTI] Cannot dial — already in a call state:', liveCallState);
      if (liveCallState === 'disposition_pending') {
        alert('Please submit the feedback for the previous call first.');
        setShowDispositionForm(true);
      }
      return;
    }
    dialInFlightRef.current = true;

    setCurrentPhoneNumber(phoneNumber);
    setCurrentLeadId(leadUserId);
    setCurrentLeadName(name || '');
    setCurrentLeadTmid(tmid || '');
    setCurrentLeadType(leadType);
    setCallState('dialing');
    setIsIncomingCall(false);
    setUserInitiatedHangup(false);
    // Every new call starts with a clean conference slate. If the previous
    // call's end-of-call reset didn't fire, conferenceModeRef could still be
    // true — and then this call's "Add Call" would see "already in conference
    // mode" and SKIP the ConfrenceToggle, so SAN never enters conference mode
    // and the added party is dialed into nothing (button reads "Added" but no
    // member ever joins). Resetting here guarantees the toggle actually fires.
    conferenceModeRef.current = false;
    conferenceMembersRef.current = [];
    setConferenceMembers([]);
    setConferenceDialingMembers([]);
    // Mark that the agent has actively dialed in this session — enables disposition modal on hangup
    hasDialedThisSession.current = true;
    // New call → nothing answered yet. Must be cleared here or the previous
    // call's Answer would keep the not-connected outcomes hidden on this one.
    setCallWasAnswered(false);
    setStatusUnconfirmed(false);
    answeredBeforeCallIdRef.current = false;
    lastDialTime.current = Date.now();
    // New call → SAN has not been told this call's wrap-up yet.
    sanDispositionSentForCallRef.current = null;
    clearHoldWatchers();

    // Detect if we should use simulated call flow (offline or local/mock environment)
    const isSimulated = !window.navigator.onLine || bearerToken === 'mock_sanctum_token_12345';

    // 1. Tell SAN to dial (sanitized to 10 digits)
    const cleanNumber = phoneNumber.replace(/\D/g, '').slice(-10);

    if (isSimulated) {
      console.log('[SAN CTI] Offline/Simulation mode detected. Initiating simulated call sequence...');
      setCurrentCallId(-999); // Magic mock ID for simulated calls

      // Simulate Ringing after 1 second
      setTimeout(() => {
        setCallState(prev => prev === 'dialing' ? 'ringing' : prev);
      }, 1000);

      // Simulate Answer (Connected) after 2.5 seconds
      setTimeout(() => {
        setCallState(prev => {
          if (prev === 'ringing' || prev === 'dialing') {
            startTimer();
            return 'connected';
          }
          return prev;
        });
      }, 2500);

      return;
    }

    // Guard: SAN silently does nothing when handed an empty or too-short number,
    // which reads to the agent as "the call just won't start". This happens when
    // a screen passes a masked/blank mobile. Surface it instead of failing mute,
    // and reset so the agent can retry cleanly.
    if (cleanNumber.length < 10) {
      console.warn('[SAN CTI] Cannot dial — phone number missing or masked:', phoneNumber);
      alert('This lead has no valid phone number to dial. The number may be masked — open the lead’s details or contact an admin.');
      setCallState('idle');
      setCurrentPhoneNumber('');
      setCurrentLeadId(null);
      hasDialedThisSession.current = false;
      return;
    }

    // 1. Tell SAN to dial — exactly as the SAN reference HTML does.
    postToSan({
      type: 'dial',
      number: cleanNumber,
      uniqueId: leadUserId && leadUserId !== 0 ? String(leadUserId) : '',
    });

    // 2. Watchdog: if SAN has sent no event 60s after the dial, the call bar can
    //    no longer be trusted to show the real state.
    //
    //    It used to RESET everything here — callState to 'idle', call id, lead
    //    id, phone and hasDialedThisSession all wiped. That is what made the
    //    call bar "suddenly disappear" mid-call: SAN going quiet does not mean
    //    the call ended, and agents were left talking to a lead with no bar, no
    //    Hangup button and no way to log anything. Worse, clearing
    //    hasDialedThisSession disarmed the disposition form, so when SAN's
    //    Hangup finally arrived the call was torn down silently and the
    //    call_history_ivr row kept whatever placeholder it was created with.
    //
    //    Now nothing is torn down. The call context stays exactly as it is, the
    //    bar stays on screen with an honest "status unconfirmed" label, and
    //    Hangup still works — which routes through hangup() and always opens
    //    the disposition form. Only the agent ends a call now, never a timer.
    if (dialingTimeoutRef.current) clearTimeout(dialingTimeoutRef.current);
    dialingTimeoutRef.current = setTimeout(() => {
      if (callStateRef.current === 'dialing' || callStateRef.current === 'ringing') {
        console.warn('[SAN CTI] No SAN event 60s after dial — status is unconfirmed. Keeping the call bar up.');
        setStatusUnconfirmed(true);
      }
    }, 60000);

    // 3. Tell Laravel: call started.
    // /call/initiate validates user_id against the users table, so it must be a
    // real users.id. Some screens can't supply one directly — the Driver Bank
    // list rows don't include user_id, and manual outbound has none at all —
    // which is what made the endpoint reject the request with "The selected user
    // id is invalid" and skip logging the call. When we don't already have a
    // valid id, resolve it from the phone number via the same lookup the
    // incoming-call flow uses, then fall back to null (lead not a registered
    // user) so the backend can still record it by phone.
    const numericLeadId = Number(leadUserId);
    let resolvedUserId: number | null =
      Number.isInteger(numericLeadId) && numericLeadId > 0 ? numericLeadId : null;
    if (!resolvedUserId && cleanNumber) {
      try {
        const lookup = await apiCall('GET', `/call/incoming/lookup?phone=${encodeURIComponent(phoneNumber)}`);
        if (lookup?.found && lookup?.data?.id) {
          resolvedUserId = Number(lookup.data.id);
          setCurrentLeadId(resolvedUserId);
        }
      } catch (_) { /* fall through with null — backend resolves by phone */ }
    }
    const result = await apiCall('POST', '/call/initiate', {
      user_id: resolvedUserId,
      phone_number: phoneNumber,
      san_session_id: `SAN_${Date.now()}_${agentId}`,
      lead_type: leadType,
    });

    if (result?.data?.call_id) {
      setCurrentCallId(result.data.call_id);
      // SAN answered while this request was still in flight — send the update
      // it could not send then, so the row is marked connected rather than
      // keeping the not-connected placeholder it was created with.
      if (answeredBeforeCallIdRef.current) {
        answeredBeforeCallIdRef.current = false;
        apiCall('POST', '/call/update', {
          call_id: result.data.call_id,
          event: 'answered',
        });
      }
    }
  }, [callState, postToSan, apiCall, agentId, bearerToken, agentState, startTimer, clearHoldWatchers]);

  const startMockCall = useCallback((leadName = 'Simulated Driver', phoneNumber = '+91 99999 88888', tmid = 'DR-9999') => {
    setCurrentPhoneNumber(phoneNumber);
    setCurrentLeadId(9999);
    setCurrentLeadName(leadName);
    setCurrentLeadTmid(tmid);
    setCallState('connected');
    setAgentState('on_call');
    setCurrentCallId(-999); // Magic ID for mock calls
    setCallDuration(45);
    setCallWasAnswered(true); // a mock call is, by definition, a connected one
    hasDialedThisSession.current = true;
    setUserInitiatedHangup(false);
  }, []);

  /**
   * Hangup. Called from the CallControlBar.
   */
  const hangup = useCallback(() => {
    setUserInitiatedHangup(true);
    // Clear the dialing timeout since we are manually hanging up
    if (dialingTimeoutRef.current) {
      clearTimeout(dialingTimeoutRef.current);
      dialingTimeoutRef.current = null;
    }

    if (currentCallId === -999) {
      // Mock / simulated call
      stopTimer();
      setCallState('disposition_pending');
      setShowDispositionForm(true);
      return;
    }

    // Tell SAN to hang up. Every other call-control command SAN accepts follows
    // a [Verb]Call convention (HoldCall/UnholdCall, MuteCall/UnmuteCall); send
    // all three variants — harmless, and maximizes the chance SAN's own SIP
    // session actually tears down server-side.
    // Tell SAN to hang up.
    postToSan({ type: 'Hangup' });
    stopTimer();
    // The channel is gone — a pending hold retry must not fire into the next call.
    clearHoldWatchers();

    if (!hasDialedThisSession.current) {
      // Nothing was genuinely dialed this session — safe to fully reset.
      setCallState('idle');
      setAgentState('ready');
      setCurrentCallId(null);
      setCurrentLeadId(null);
      setCurrentPhoneNumber('');
      setCurrentLeadName('');
      setCurrentLeadTmid('');
      setCallDuration(0);
      setCallWasAnswered(false);
      setStatusUnconfirmed(false);
      setIsHeld(false);
      setIsMuted(false);
      setConferenceMembers([]);
      setConferenceDialingMembers([]);
      conferenceMembersRef.current = [];
      conferenceModeRef.current = false;
    } else {
      // The agent dialed this lead — always surface disposition immediately.
      // callState can't be trusted to mean "never connected": SAN has been
      // observed to skip sending its own Answer confirmation even when the
      // call genuinely connected at the SIP level (verified via a real SIP
      // 200 OK with no matching SANAppOutgoingEvent). Waiting on SAN here
      // would silently drop a real connected call with no disposition ever
      // logged. The agent can correctly mark "not connected" themselves if
      // it truly never connected — that's what the form is for.
      setCallState('disposition_pending');
      setShowDispositionForm(true);
    }
  }, [currentCallId, postToSan, stopTimer, clearHoldWatchers]);

  /**
   * Toggle hold — REAL channel-level hold.
   *
   * SAN's current build implements this properly: HoldCall/UnholdCall →
   * their HoldUnhold → socket emit 'hold' {Channel, set:'1'|'0'} → server
   * puts the trunk channel on hold (SDP renegotiated to recvonly, caller
   * hears hold music). Confirmation comes back as SANAppHoldEvent
   * {set:'1'|'0'} and as SANAppOutgoingEvent {exten_status:'Hold', hold:1|0}
   * — verified live in the agent console.
   *
   * The UI flips optimistically. SAN does not always send its confirmation
   * back to the parent even when the hold genuinely took effect server-side
   * (the caller really is on hold music), so an unconfirmed hold is NOT
   * evidence that nothing happened.
   *
   * This used to flip the label back to "on call" after 5s of silence. That
   * was actively harmful: the caller stayed held while the bar told the agent
   * they were live, the agent resumed talking into hold music, and their next
   * click — computed from the now-wrong isHeld — sent HoldCall on an already
   * held channel. So the commanded state is kept, and the two watchdogs below
   * do something useful instead:
   *   +5s  silent → re-send the same verb once. HoldCall/UnholdCall are
   *                 explicit set:'1'/'0' commands, not a toggle, so a repeat
   *                 is idempotent and recovers a message SAN simply dropped.
   *   +10s silent → keep the state, raise isHoldUnconfirmed so the bar can
   *                 say "unconfirmed" rather than lie in either direction.
   * holdEventSeqRef counts every hold confirmation; a watchdog is a no-op if
   * the count moved (SAN answered) or the call is no longer connected.
   */
  const toggleHold = useCallback(() => {
    const next = !isHeld;
    const verb = next ? 'HoldCall' : 'UnholdCall';
    postToSan({ type: verb });
    setIsHeld(next);
    setIsHoldUnconfirmed(false);

    const seqAtToggle = holdEventSeqRef.current;
    if (holdRetryTimerRef.current) clearTimeout(holdRetryTimerRef.current);
    if (holdConfirmTimerRef.current) clearTimeout(holdConfirmTimerRef.current);

    holdRetryTimerRef.current = setTimeout(() => {
      holdRetryTimerRef.current = null;
      if (holdEventSeqRef.current !== seqAtToggle || callStateRef.current !== 'connected') return;
      console.warn(`[SAN CTI] ${verb} unconfirmed after ${HOLD_ACK_MS}ms — re-sending once`);
      postToSan({ type: verb });
    }, HOLD_ACK_MS);

    holdConfirmTimerRef.current = setTimeout(() => {
      holdConfirmTimerRef.current = null;
      if (holdEventSeqRef.current !== seqAtToggle || callStateRef.current !== 'connected') return;
      console.warn('[SAN CTI] Hold state never confirmed by SAN — keeping the commanded state and flagging it unconfirmed');
      setIsHoldUnconfirmed(true);
    }, HOLD_ACK_MS * 2);
  }, [isHeld, postToSan]);

  /**
   * Toggle mute — agent microphone only. Independent of hold now that hold
   * is a real server-side hold rather than the old mute-based approximation.
   */
  const toggleMute = useCallback(() => {
    if (isMuted) {
      postToSan({ type: 'UnmuteCall' });
    } else {
      postToSan({ type: 'MuteCall' });
    }
    setIsMuted(prev => !prev);
  }, [isMuted, postToSan]);

  /**
   * Enter conference mode on SAN's side. Mirrors SAN's own reference
   * integration (SanCCS-Mini): ConfrenceToggle switches their iframe into
   * "add member" mode for the current call; it does not by itself add
   * anyone — addConferenceNumber below dials the new leg in.
   */
  const startConference = useCallback(() => {
    if (conferenceModeRef.current) {
      console.log('[SAN CTI] ConfrenceToggle skipped — this call is already in conference mode (re-sending would toggle it OFF)');
      return;
    }
    conferenceModeRef.current = true;
    conferenceToggleAtRef.current = Date.now();
    postToSan({ type: 'ConfrenceToggle' });
  }, [postToSan]);

  /**
   * Dial an additional number into the in-progress call as a conference
   * member. SAN bridges the new leg in automatically; join/leave state comes
   * back via the SANAppConfEventjoin / conferenceDialing / SANAppConfEventLeave
   * bridged events handled below.
   */
  /**
   * Hold / resume ONE conference member. SAN's parent-message API exposes
   * exactly three conference verbs — ConfrenceToggle, ConfrenceNumber and
   * ConfHoldToggle — so this is the only per-member control that can be driven
   * from the CRM. (Dropping a single leg exists inside SAN's own softphone as
   * removeConferenceMember, but it is not reachable over postMessage.)
   */
  const holdConferenceMember = useCallback((phoneNumber: string) => {
    const clean = sameNumber(phoneNumber);
    if (clean.length < 10) return;
    postToSan({ type: 'ConfHoldToggle', phone: clean });

    // SAN toggles that leg's audio but NEVER pushes the new hold state back to
    // the parent — the member dict only arrives on join/leave events — so the
    // row's Hold/Resume label and status never changed. Reflect the flip
    // optimistically here (and in the ref the event handlers read from).
    const flip = (list: ConferenceMember[]) => list.map(m =>
      sameNumber(m.conf_member) === clean
        ? { ...m, hold_status: m.hold_status === 'hold' ? 'active' : 'hold' }
        : m
    );
    conferenceMembersRef.current = flip(conferenceMembersRef.current);
    setConferenceMembers(prev => flip(prev));
  }, [postToSan]);

  /** Reveal SAN's softphone — its member list carries the per-leg drop button. */
  const showSoftphone = useCallback(() => setIsCtiMinimized(false), []);

  const addConferenceNumber = useCallback((phoneNumber: string) => {
    // Sanitize exactly like dial() does. Numbers come off lead records in every
    // shape ("+91 83839 71722", "091-8383971722"); SAN only accepts the bare
    // 10 digits, and an unsanitized value is silently dropped — the leg never
    // rings and no member ever appears.
    const clean = (phoneNumber || '').replace(/\D/g, '').slice(-10);
    if (clean.length < 10) {
      console.warn('[SAN CTI] Conference member NOT dialed — unusable number:', phoneNumber);
      return;
    }

    const send = () => {
      console.log('[SAN CTI] ConfrenceNumber →', clean);
      postToSan({ type: 'ConfrenceNumber', phone: clean });
    };

    // Make sure the call is in conference mode first, then give SAN time to
    // establish it. Sending ConfrenceNumber in the same tick as the toggle
    // races SAN's own setup and the member is dropped.
    if (!conferenceModeRef.current) {
      conferenceModeRef.current = true;
      conferenceToggleAtRef.current = Date.now();
      postToSan({ type: 'ConfrenceToggle' });
    }

    const settledFor = Date.now() - conferenceToggleAtRef.current;
    const wait = Math.max(0, CONFERENCE_SETTLE_MS - settledFor);
    if (wait > 0) {
      console.log(`[SAN CTI] waiting ${wait}ms for SAN to enter conference mode before dialing ${clean}`);
      setTimeout(send, wait);
    } else {
      send();
    }
  }, [postToSan]);

  /**
   * Accept incoming call.
   * Sets a short-lived guard so that spurious SANAppReadyEvent / SANAppSavePageEvent
   * messages emitted during the SIP accept handshake cannot reset state or open
   * the disposition modal before the real Answer event arrives.
   *
   * Sends multiple variants (postMessage + direct contentWindow call) to maximise
   * compatibility with different SAN callerMini versions, matching the same
   * triple-variant pattern already used for Hangup.
   */
  const acceptIncoming = useCallback(() => {
    // Re-entrancy guard: without this, a console trace showed the agent's
    // repeated clicks (because nothing visibly happens after the first one)
    // sending IncAccept/answer/answerCall 6+ times for the same call, with
    // SAN's own widget logging "Answer initiated" → "No session found!" for
    // every one of them — i.e. we were flooding SAN with redundant accept
    // signals for a call it could no longer locate a session for.
    if (acceptingIncomingRef.current) {
      console.log('[SAN] acceptIncoming IGNORED — an accept attempt is already in flight for this call');
      return;
    }
    console.log('[SAN] acceptIncoming — sending IncAccept, arming 8s guard');
    // Arm guard
    acceptingIncomingRef.current = true;
    setIsAcceptingIncoming(true);
    if (acceptingIncomingTimerRef.current) clearTimeout(acceptingIncomingTimerRef.current);
    acceptingIncomingTimerRef.current = setTimeout(() => {
      console.log('[SAN] acceptingIncoming guard expired (8s)');
      acceptingIncomingRef.current = false;
      setIsAcceptingIncoming(false);
    }, 8000);

    // Focus the iframe context to transfer user gesture/autoplay authorization
    try {
      iframeRef.current?.focus();
    } catch (_) { }

    // Send exactly ONE raw accept signal matching the working CRM code.
    // We send only the type 'IncAccept' without any extra metadata payload.
    postToSan({ type: 'IncAccept' });
  }, [postToSan]);

  /**
   * Logout.
   */
  const logout = useCallback(() => {
    postToSan({ type: 'Logout' });
    apiCall('POST', '/cti/logout');
  }, [postToSan, apiCall]);

  /**
   * Toggle manual dial mode.
   */
  const toggleManualMode = useCallback(() => {
    postToSan({ type: isManualMode ? 'ManualOff' : 'ManualOn' });
  }, [isManualMode, postToSan]);

  /**
   * Submit disposition. Called from PostCallDispositionModal.
   * Sends to BOTH SAN (so their system records it) AND Laravel (our system).
   */
  const submitDisposition = useCallback(async (dispositionData: DispositionData) => {
    // 1. Send to SAN iframe — for BOTH outgoing and incoming calls. SAN's own
    // wrap-up/manual-mode state machine needs this regardless of direction;
    // skipping it for incoming calls (as the previous version did) leaves
    // SAN's agent state stuck in wrap-up after every incoming call, which is
    // why disposition appeared to "not submit" once incoming pickup started
    // actually working.
    // Verified directly against SAN's own init.js: their postMessage listener
    // only recognizes type 'SubmitDisposition' (not 'SEND_DISPOSITION', which
    // matches no case and is silently dropped), and dispositionFormSubmit's
    // formData merge expects 'Phone_No' / 'Remark' / 'sub_disposition' /
    // 'callback_time' — not 'phone_number' / 'remarks'.
    //
    // The "stuck on Processing" bug is separate: SAN's saveAgentForm rejects
    // the request server-side when 'disposition' doesn't match one of ITS
    // own known disposition labels (returned at login — e.g. "Connected",
    // "Not Connected", "Call back" — not our internal lowercase values like
    // 'connected'/'callback_later'), and their own success-handler then
    // crashes reading resp.result.crmstates off that error response instead
    // of showing a clean failure — which is what leaves the spinner stuck
    // forever. sanDispositionOptions holds SAN's real list for this agent;
    // map our value onto the closest match instead of sending it raw.
    const SAN_DISPOSITION_FALLBACK: Record<string, string> = {
      connected: 'Connected',
      not_connected: 'Not Connected',
      callback_later: 'Call back',
    };
    const sanDisposition = sanDispositionOptions.find(
      (opt) => opt.toLowerCase().replace(/\s+/g, '_') === dispositionData.disposition?.toLowerCase()
    ) || SAN_DISPOSITION_FALLBACK[dispositionData.disposition || ''] || dispositionData.disposition;

    // Sent at most ONCE per call. When the Laravel save below fails the agent
    // retries from the same open modal; re-posting SubmitDisposition would be
    // a second wrap-up for a call SAN has already closed, which their own
    // handler answers with "Agent not Login" and then crashes on.
    const sanAlreadyToldForThisCall = sanDispositionSentForCallRef.current === currentCallId;

    if (currentCallId !== -999 && !sanAlreadyToldForThisCall) {
      sanDispositionSentForCallRef.current = currentCallId;
      postToSan({
        type: 'SubmitDisposition',
        disposition: sanDisposition,
        sub_disposition: dispositionData.disposition_sub || '',
        Remark: dispositionData.notes || '',
        Phone_No: currentPhoneNumber,
        callback_time: dispositionData.callback_at || '',
        // No agent_id here — confirmed via live log that sending our own
        // CRM admin id (e.g. '14') overwrites SAN's own correct internal
        // logged_agent['agent']['agent_id'] (e.g. '2544') in their object
        // merge, so their server rejects the save with "Agent not Login"
        // and their own crmstates-reading code crashes on the error
        // response. Let SAN use its own already-correct value.
        uniqueId: currentLeadId && currentLeadId !== 0 ? String(currentLeadId) : '',
      });
    }

    // 2. Send to Laravel — full disposition with cascade
    let result;
    if (currentCallId === -999) {
      result = { success: true, message: 'Mock disposition saved' };
    } else if (isIncomingCall) {
      // Use incoming feedback endpoint for incoming calls
      result = await apiCall('POST', '/call/incoming/feedback', {
        call_id: currentCallId ?? incomingCallIdRef.current,
        // Lets the backend rebuild the row when neither this call_id nor the
        // agent's current_call_id survived — otherwise the whole disposition
        // was rejected and the call left no trace at all.
        caller_phone: currentPhoneNumber,
        // The modal's level-1 values are exactly 'connected' | 'not_connected'
        // | 'callback_later'. This used to test for 'callback', which nothing
        // ever sends, so every incoming callback was filed as not_connected —
        // it only ever landed in the callback queue because the backend
        // re-derives the status when a callback_at comes with it.
        call_status: dispositionData.disposition === 'connected' ? 'connected' :
          dispositionData.disposition === 'callback_later' ? 'callback_later' : 'not_connected',
        call_feedback: dispositionData.disposition || 'Connected',
        call_remarks: dispositionData.notes || null,
        call_duration: callDurationRef.current,
        callback_at: dispositionData.callback_at || null,
        disposition_sub: dispositionData.disposition_sub || null,
      });
    } else {
      result = await apiCall('POST', '/call/disposition', {
        call_id: currentCallId,
        // Convert to integer so backend receives null only when truly unresolvable;
        // backend should derive user_id from call_history.user_id when this is null
        user_id: currentLeadId ? Number(currentLeadId) : null,
        disposition: dispositionData.disposition,
        plan_selected: dispositionData.plan_selected || null,
        payment_id: dispositionData.payment_id || null,
        callback_at: dispositionData.callback_at || null,
        reason: dispositionData.reason || null,
        notes: dispositionData.notes || null,
        language_noted: dispositionData.language_noted || null,
        call_duration: callDurationRef.current,
        disposition_sub: dispositionData.disposition_sub || null,
        callback_sub: dispositionData.callback_sub || null,
        feedback_stage: dispositionData.feedback_stage || null,
        lead_type: currentLeadTypeRef.current,
      });
    }

    // 3. Did Laravel actually save it?
    //
    // Everything below this point tears the call down: the modal closes, the
    // lead context is wiped, hasDialedThisSession is cleared and the
    // 'san_pending_disposition' localStorage record goes with it (the
    // callState → 'idle' effect removes it). Running that on a REJECTED save
    // is how a disposition could vanish with no error anywhere — the agent saw
    // the next lead load and assumed it went through. The common rejections
    // are a 422 on user_id / disposition and a dropped connection.
    //
    // So on failure: keep the modal open, keep the call context, keep the
    // pending record, and throw so the modal can show the reason and let the
    // agent retry. SAN was already told (once) — only our own save is retried.
    const saveFailed = !result || result.http_ok === false || result.status === false;
    if (saveFailed) {
      const message = apiErrorMessage(result, 'Disposition could not be saved.');
      console.error('[SAN CTI] Disposition NOT saved — keeping the form open for retry:', result);
      throw new Error(message);
    }

    // 4. Reset call state & re-synchronize SAN agent ready state
    setShowDispositionForm(false);
    setCallState('idle');
    setAgentState('ready');
    postToSan({ type: 'ready' });
    apiCall('POST', '/cti/status', { status: 'ready' });
    // One requestManualOn per wrap-up. It self-cancels a previously armed send
    // (see requestManualOn), so the 1s re-verify below can no longer land a
    // SECOND ManualOn — which, ManualOn being a toggle on SAN's side, flipped
    // manual mode back OFF and dropped the agent out of ready between calls.
    requestManualOn();
    // Fast re-verify to ensure SAN backend state didn't get stuck in wrap-up
    setTimeout(() => {
      postToSan({ type: 'ready' });
      requestManualOn();
    }, 1000);
    sanDispositionSentForCallRef.current = null;
    clearHoldWatchers();
    setCurrentCallId(null);
    setCurrentLeadId(null);
    setCurrentPhoneNumber('');
    setCurrentLeadName('');
    setCurrentLeadTmid('');
    setCallDuration(0);
    setCallWasAnswered(false);
    setStatusUnconfirmed(false);
    setIsHeld(false);
    setIsMuted(false);
    setConferenceMembers([]);
    setConferenceDialingMembers([]);
    conferenceMembersRef.current = [];
    conferenceModeRef.current = false;
    setIsIncomingCall(false);
    setUserInitiatedHangup(false);
    // Reset dial guard so next call starts clean
    hasDialedThisSession.current = false;

    // Include what was submitted and which lead it was for: DashboardLayout
    // forwards this return value as the 'san-disposition-complete' event
    // detail, and process-specific listeners (e.g. matchmaking's job-linked
    // call logs) need the disposition values to sync their own records
    // without asking the agent twice. Existing consumers only read loadNext
    // off the merged object, so this is additive.
    return {
      ...(result || {}),
      submitted: dispositionData,
      // call_history_ivr row id for this call — listeners use it to stamp
      // extra context (e.g. matchmaking job_id/match_status) onto the same
      // row. -999 = mock call (no real row).
      call_id: currentCallId,
      lead: {
        id: currentLeadId,
        tmid: currentLeadTmid,
        name: currentLeadName,
        phone: currentPhoneNumber,
        type: currentLeadTypeRef.current,
      },
      call_duration: callDurationRef.current,
    };
    // callDuration intentionally omitted — use callDurationRef.current instead
  }, [postToSan, apiCall, currentCallId, currentLeadId, currentLeadTmid, currentLeadName, currentPhoneNumber, isIncomingCall, sanDispositionOptions, requestManualOn, clearHoldWatchers]);

  // ═══════════════════════════════════════════════════════════
  // SAN EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    function handleSanEvent(event: MessageEvent) {
      const { type, payload } = event.data || {};
      if (!type) return;
      hasSanResponseRef.current = true;
      console.log('[SAN RECV]', type, payload || event.data);

      switch (type) {
        // ── LOGIN response event ──
        case 'Login':
        case 'login': {
          const evData = payload || event.data || {};
          const isExplicitSuccess = evData?.success === true || evData?.success === 'true';
          const isFailure = evData?.success === false || evData?.success === 'false';

          if (isExplicitSuccess) {
            // Some SAN versions send explicit success — still wait for SANAppInitEvent for proper state
            console.log('[SAN CTI] Login event (success=true) — awaiting SANAppInitEvent for final state');
            break;
          }

          if (isFailure) {
            console.warn('[SAN CTI] Login failed / rejected by SAN (e.g. "already login on another machine"):', evData);
            loginPendingRef.current = false;
            if (loginWatchdogRef.current) { clearTimeout(loginWatchdogRef.current); loginWatchdogRef.current = null; }
            setAgentState('logged_out');
            // INSTANTLY un-hide the SAN softphone panel so mini CRM login modal is visible to the agent!
            setIsCtiMinimized(false);
            apiCall('POST', '/cti/status', { status: 'logged_out' });
          }
          break;
        }

        // ── INIT: Agent logged into SAN ──
        case 'SANAppInitEvent':
          loginPendingRef.current = false;
          if (loginWatchdogRef.current) { clearTimeout(loginWatchdogRef.current); loginWatchdogRef.current = null; }
          // Init arrived — the post-reload recovery ladder is no longer needed.
          awaitingPostReloadInitRef.current = false;
          if (postReloadNudgeRef.current) { clearTimeout(postReloadNudgeRef.current); postReloadNudgeRef.current = null; }
          if (postReloadReloginRef.current) { clearTimeout(postReloadReloginRef.current); postReloadReloginRef.current = null; }

          // After a fresh login SAN's loginFormSubmit saves the session to localStorage
          // but does NOT reassign the module-level `logged_agent` variable (set once at
          // page load via getCurrentSession()). As a result toggleManualOnOff and dialCall
          // both crash with "Cannot read properties of undefined (reading 'agent_id')" because
          // logged_agent['agent'] is still null. Reloading the iframe forces SAN's init.js
          // to re-run `var logged_agent = getCurrentSession()` with the now-populated
          // localStorage, fixing both crashes permanently. We only do this ONCE per login.
          if (!freshLoginReloadDoneRef.current) {
            freshLoginReloadDoneRef.current = true;
            console.log('[SAN CTI] SANAppInitEvent (first) — reloading iframe so logged_agent initialises from localStorage');
            setAgentState('logged_in');
            // Arm the recovery ladder BEFORE the reload. SAN only re-emits
            // SANAppInitEvent on the reloaded page when getCurrentSession()
            // finds an intact session; when it doesn't, nothing else in this
            // provider would ever drive the agent to ready again (the watchdog
            // above was just cleared, and the auto-login effect skips any state
            // other than 'logged_out'). This is what left agents logged in but
            // permanently not-ready.
            awaitingPostReloadInitRef.current = true;
            setIsIframeLoaded(false);
            setSanIframeKey(prev => prev + 1);
            break;
          }

          setExtension(payload?.login_extension_no || payload?.exten || '');
          switch (payload?.status) {
            case '1': // Logged in — SAN needs our ready signal before agent is live.
              // Send ready: SAN calls agentReady HTTP (async). We must NOT send ManualOn
              // yet — SAN's toggleManualOnOff reads crmstates.agent_id which is null until
              // the agentReady response is processed. Wait for SANAppReadyEvent, which SAN
              // fires AFTER processing that response. Fall back after 20 s in case it never comes.
              setAgentState('logged_in');
              postToSan({ type: 'ready' });
              // SAN silently drops a 'ready' that lands before its own agentReady
              // bookkeeping exists, and then never asks again — the agent shows
              // logged-in-but-not-ready with no error anywhere. Re-send once at 7 s
              // before falling back to forcing the state.
              if (readyRetryRef.current) clearTimeout(readyRetryRef.current);
              readyRetryRef.current = setTimeout(() => {
                readyRetryRef.current = null;
                if (agentStateRef.current === 'logged_in') {
                  console.warn('[SAN CTI] Fast retry: re-sending ready @1s');
                  postToSan({ type: 'ready' });
                }
              }, 1000);
              if (readyFallbackRef.current) clearTimeout(readyFallbackRef.current);
              readyFallbackRef.current = setTimeout(() => {
                readyFallbackRef.current = null;
                setAgentState(prev => {
                  if (prev === 'logged_in') {
                    console.warn('[SAN CTI] readyFallback: forcing ready state @3s');
                    apiCall('POST', '/cti/status', { status: 'ready' });
                    requestManualOn();
                    return 'ready';
                  }
                  return prev;
                });
              }, 3000);
              break;
            case '3': // Already idle/ready
              setAgentState('ready');
              apiCall('POST', '/cti/status', { status: 'ready' });
              requestManualOn();
              break;
            case '4': // On break
              setAgentState('ready');
              setIsOnBreak(true);
              break;
            case '5': // Disposition pending — reported by SAN on reconnect.
              // Do NOT auto-open the form here. The session state is stale;
              // we only open disposition when hasDialedThisSession is true.
              // Just update the callState silently.
              setCallState('idle');
              break;
            case '10':
            case '11':
              manualModeKnownRef.current = true;
              setIsManualMode(payload?.status === '10');
              isManualModeRef.current = payload?.status === '10';
              setAgentState('ready');
              if (payload?.status === '11') {
                // Delay ManualOn: crmstates.agent_id may not be set yet
                requestManualOn();
              }
              break;
          }
          break;

        // ── READY: Agent is now live ──
        case 'SANAppReadyEvent':
          if (readyFallbackRef.current) { clearTimeout(readyFallbackRef.current); readyFallbackRef.current = null; }
          if (readyRetryRef.current) { clearTimeout(readyRetryRef.current); readyRetryRef.current = null; }
          // Ready proves the SAN session is alive and announcing itself — the
          // post-reload ladder must stand down or its re-login would tear down
          // the session we just got working.
          awaitingPostReloadInitRef.current = false;
          if (postReloadNudgeRef.current) { clearTimeout(postReloadNudgeRef.current); postReloadNudgeRef.current = null; }
          if (postReloadReloginRef.current) { clearTimeout(postReloadReloginRef.current); postReloadReloginRef.current = null; }
          setExtension(payload?.exten || '');
          setAgentState('ready');
          apiCall('POST', '/cti/status', { status: 'ready' });
          // SANAppReadyEvent fires right after every call end, and sometimes
          // mid-incoming-call during state transitions. Guard against wiping
          // an active incoming call or a pending disposition.
          {
            const currentStateOnReady = callStateRef.current;
            const duringIncoming = isIncomingCallRef.current;
            const acceptPending = acceptingIncomingRef.current;
            if (acceptPending || (duringIncoming && (currentStateOnReady === 'incoming_ringing' || currentStateOnReady === 'connected'))) {
              // SAN fired Ready during accept handshake or active incoming call — ignore entirely.
              console.log('[SAN] SANAppReadyEvent BLOCKED — acceptPending:', acceptPending, 'state:', currentStateOnReady);
            } else if (!hasDialedThisSession.current) {
              // No dial happened this session — safe to go idle
              setCallState('idle');
              // SANAppReadyEvent fires from inside SAN's agentReady callback, sometimes
              // BEFORE crmstates is assigned in SAN's JS. Sending ManualOn immediately
              // causes toggleManualOnOff to crash reading crmstates.agent_id.
              // requestManualOn delays 1.5 s for that, and — critically — skips the
              // send when SAN already reports manual mode on. SANAppReadyEvent fires
              // again after every disposition (hasDialedThisSession is reset to false
              // by then), so the previous unconditional send toggled manual mode back
              // OFF between conversations and knocked the agent out of ready.
              requestManualOn();
            }
            // If hasDialedThisSession is true but we're not in incoming call,
            // disposition modal is already open — don't reset, don't re-send ManualOn.
          }
          break;

        // ── OUTGOING CALL: State changes during our outbound call ──
        case 'SANAppOutgoingEvent': {
          const extenStatus = payload?.exten_status;
          setExtension(payload?.exten || '');

          // Clear the dialing timeout since SAN has responded
          if (dialingTimeoutRef.current) {
            clearTimeout(dialingTimeoutRef.current);
            dialingTimeoutRef.current = null;
          }
          // SAN is talking again — whatever the bar shows below is current.
          setStatusUnconfirmed(false);

          if (extenStatus === 'Dialing' || extenStatus === 'Ringing') {
            setCallState('ringing');
            setAgentState('on_call');
          } else if (extenStatus === 'Answer') {
            setCallState('connected');
            setCallWasAnswered(true);
            startTimer();
            // Update Laravel: call connected
            if (currentCallId) {
              apiCall('POST', '/call/update', {
                call_id: currentCallId,
                event: 'answered',
              });
            } else {
              // The call row id has not come back from /call/initiate yet — a
              // fast answer beats that round trip often enough to matter. The
              // update used to be dropped outright here, leaving the row
              // 'not_connected' with its dial-time placeholder for a call that
              // genuinely connected. Remember it and send it the moment the id
              // lands (see dial()).
              answeredBeforeCallIdRef.current = true;
            }
          } else if (extenStatus === 'Hold') {
            // Server-side hold confirmation — observed live as
            // {exten_status:'Hold', hold:1, trunk_channel:'SIP/...'}. Fires
            // for both hold (hold:1) and unhold (hold:0). Redundant with
            // SANAppHoldEvent but SAN sends both; treat either as authoritative.
            holdEventSeqRef.current += 1;
            clearHoldWatchers();
            setIsHeld(payload?.hold === 1 || payload?.hold === '1' || payload?.hold === true);
          } else if (extenStatus === 'Hangup') {
            stopTimer();
            const finalDuration = callDurationRef.current;

            // Race condition check: If this Hangup event arrived extremely quickly
            // after the last dial (within 1.5 seconds), it is almost certainly a late
            // Hangup event from the previous call that was still tearing down on the
            // CTI server when the agent clicked "Save & Call Next". Ignore it.
            const timeSinceDial = Date.now() - lastDialTime.current;
            if (timeSinceDial < 1500) {
              console.warn('[SAN CTI] Ignoring late Hangup event from previous call (received ' + timeSinceDial + 'ms after dial)');
              return;
            }

            // Update Laravel: call ended (call_status set later via disposition form)
            if (currentCallId && currentCallId !== -999) {
              apiCall('POST', '/call/update', {
                call_id: currentCallId,
                event: 'hangup',
                call_duration: finalDuration,
              });
            }

            // hasDialedThisSession is the single source of truth.
            // It is false only when: agent cancelled during dialing/ringing (hangup()
            // already reset it), or the 60s timeout fired, or submitDisposition ran.
            // In every other case a dial happened → agent must log disposition.
            if (hasDialedThisSession.current) {
              setCallState('disposition_pending');
              setShowDispositionForm(true);
              // Do NOT reset callId / leadId here — submitDisposition() needs them.
            } else {
              setCallState('idle');
              setAgentState('ready');
            }
          }
          break;
        }

        // ── INCOMING CALL ──
        case 'SANAppIncomingEvent': {
          const status = payload?.exten_status;
          setExtension(payload?.exten || '');
          // Store payload for answer session matching
          activeIncomingPayloadRef.current = payload;
          // caller_id is the caller's phone number from SAN payload
          const callerPhone: string = payload?.caller_id || payload?.Caller_ID || '';

          if (status === 'Ringing') {
            // Let the agent manually accept the call to avoid double IncAccept SIP drop

            setCallState('incoming_ringing');
            setAgentState('on_call');
            setIsIncomingCall(true);
            hasDialedThisSession.current = true; // allow disposition form
            incomingLoggedRef.current = false;   // new call — allow one initiate
            incomingCallIdRef.current = null;

            // Lookup the caller in DB so we can show their details
            if (callerPhone) {
              setCurrentPhoneNumber(callerPhone);
              setCurrentLeadName('Incoming Call');
              setCurrentLeadLocation('');
              setCurrentLeadCallStatus('');
              // Async lookup user by phone
              apiCall('GET', `/call/incoming/lookup?phone=${encodeURIComponent(callerPhone)}`)
                .then((res: any) => {
                  if (res?.found && res?.data) {
                    setCurrentLeadName(res.data.name || callerPhone);
                    setCurrentLeadTmid(res.data.tmid || '');
                    setCurrentLeadId(res.data.id || null);
                    setCurrentLeadLocation(res.data.location || '');
                    setCurrentLeadCallStatus(res.data.call_status || '');
                  }
                })
                .catch(() => { });

              // Log the call NOW, while it is still ringing — not on Answer.
              //
              // Logging only on Answer meant a call that rang and was never
              // picked up (or was rejected, or that SAN never sent an Answer
              // event for) left NO row anywhere: the CRM never heard about it,
              // and webhook_crm — the network-side CDR that would have caught
              // it — is only populated when SAN's server is actively posting.
              // Those calls were invisible on the Incoming Call History screen
              // even though the agent watched them ring on their screen.
              //
              // The row is seeded not-connected / "Ringing / No Answer", which
              // is the truth at this instant; answering upgrades it via
              // /call/update, and the disposition overwrites it. The backend
              // reuses this same row when Answer fires (2-minute same-caller
              // guard in initiateIncomingCall), so one call is still one row.
              incomingLoggedRef.current = true;
              apiCall('POST', '/call/incoming/initiate', {
                caller_phone: callerPhone,
                did_number: payload?.did || payload?.DID || '',
                user_id: null, // backend will auto-lookup
              }).then((res: any) => {
                if (res?.data?.call_id) {
                  incomingCallIdRef.current = res.data.call_id;
                  setCurrentCallId(res.data.call_id);
                  if (res.data.user_id) setCurrentLeadId(res.data.user_id);
                  if (res.data.user_name) setCurrentLeadName(res.data.user_name);
                  if (res.data.tmid) setCurrentLeadTmid(res.data.tmid);
                }
              }).catch(() => {
                // Leave the guard down so the Answer branch can retry.
                incomingLoggedRef.current = false;
              });
            }
          } else if (status === 'Answer') {
            // Clear the accept guard — handshake complete, call is live.
            if (acceptingIncomingTimerRef.current) clearTimeout(acceptingIncomingTimerRef.current);
            acceptingIncomingRef.current = false;
            setIsAcceptingIncoming(false);
            console.log('[SAN] SANAppIncomingEvent Answer — guard cleared, transitioning to connected');
            setCallState('connected');
            setCallWasAnswered(true);
            startTimer();
            // The row already exists — Ringing logged it. Upgrade it from the
            // "rang, nobody answered" seed to connected, the same write an
            // outbound call makes when SAN confirms the answer.
            if (incomingLoggedRef.current) {
              const answeredCallId = incomingCallIdRef.current ?? currentCallId;
              if (answeredCallId && answeredCallId !== -999) {
                apiCall('POST', '/call/update', {
                  call_id: answeredCallId,
                  event: 'answered',
                }).catch(() => { });
              }
              break;
            }

            // Ringing never logged it (no caller number, or the request
            // failed) — log it here as before, so an answered call is never
            // lost just because the ring-time write did not land.
            incomingLoggedRef.current = true;
            apiCall('POST', '/call/incoming/initiate', {
              caller_phone: callerPhone || currentPhoneNumber,
              did_number: payload?.did || payload?.DID || '',
              user_id: null, // backend will auto-lookup
            }).then((res: any) => {
              if (res?.data?.call_id) {
                incomingCallIdRef.current = res.data.call_id;
                setCurrentCallId(res.data.call_id);
                // Update lead info if backend resolved it
                if (res.data.user_id) setCurrentLeadId(res.data.user_id);
                if (res.data.user_name) setCurrentLeadName(res.data.user_name);
                if (res.data.tmid) setCurrentLeadTmid(res.data.tmid);
                apiCall('POST', '/call/update', {
                  call_id: res.data.call_id,
                  event: 'answered',
                }).catch(() => { });
              }
            }).catch(() => { });
          } else if (status === 'Hangup') {
            stopTimer();
            const liveStateInc = callStateRef.current;
            const wasAnswered = liveStateInc === 'connected';
            const wasInCall = liveStateInc === 'incoming_ringing' || liveStateInc === 'connected';
            if (wasInCall && wasAnswered) {
              // Show quick disposition for incoming calls
              setCallState('disposition_pending');
              setShowDispositionForm(true);
            } else {
              // Caller hung up before answer — just go idle
              if (acceptingIncomingTimerRef.current) clearTimeout(acceptingIncomingTimerRef.current);
              acceptingIncomingRef.current = false;
              setIsAcceptingIncoming(false);
              setCallState('idle');
              setAgentState('ready');
              setIsIncomingCall(false);
              setCurrentPhoneNumber('');
              setCurrentLeadName('');
              setCurrentLeadTmid('');
              setCurrentLeadId(null);
              setCurrentCallId(null);
              hasDialedThisSession.current = false;
            }
          }
          break;
        }

        // ── HOLD ── matches SAN's own reference exactly: `data.set == 1`
        // (their `set` field arrives as either a number or a numeric string).
        // Payload observed live: {Channel:'SIP/1002-...', set:'1', class:''}.
        // This is the authoritative hold state — it overrides the optimistic
        // flip done in toggleHold and cancels its revert timer.
        case 'SANAppHoldEvent':
          holdEventSeqRef.current += 1;
          clearHoldWatchers();
          setIsHeld(payload?.set === 1 || payload?.set === '1');
          break;

        // ── BREAK ──
        case 'SANAppBreakEvent':
          if (payload?.state === 4) {
            setIsOnBreak(true);
            setBreakName(payload?.data?.break_name || 'Break');
          } else {
            setIsOnBreak(false);
            setBreakName('');
          }
          break;

        // ── MANUAL MODE ──
        case 'SANAppManualOnOffEvent':
          // state=11 means OFF (confusing but per HTML source)
          manualModeKnownRef.current = true;
          setIsManualMode(payload?.state !== 11);
          // Mirror synchronously too: requestManualOn's 1.5 s timer can be armed
          // by an event that fires in the same tick as this one, before React has
          // committed and run the useLayoutEffect that normally syncs this ref.
          isManualModeRef.current = payload?.state !== 11;
          break;

        // ── SAN FIRES THIS WHEN A CALL ENDS (backup disposition trigger) ──
        // Fires right after SANAppOutgoingEvent.Hangup — or sometimes INSTEAD of it.
        // Rule: if the agent dialed this session AND the call was actually answered
        //       (not still ringing) → show modal (idempotent).
        //       if not → safe to reset to idle (reconnect / login noise).
        case 'SANAppSavePageEvent': {
          setExtension(payload?.exten || '');
          const stateOnSave = callStateRef.current;
          const isStillRinging = stateOnSave === 'incoming_ringing';
          const acceptPendingOnSave = acceptingIncomingRef.current;
          const duringIncomingOnSave = isIncomingCallRef.current;

          // Incoming calls own their full lifecycle via SANAppIncomingEvent
          // (Ringing → Answer → Hangup), including its own disposition trigger
          // on Hangup. SavePageEvent's "backup hangup" rule below is for
          // OUTGOING calls only (see comment above) — applying it to incoming
          // calls too let a SavePageEvent that fires moments after Answer (SAN's
          // own page-state bookkeeping, not a real hangup) immediately flip a
          // just-connected call to 'disposition_pending', hiding the control
          // bar on a call that was still live.
          if (duringIncomingOnSave) {
            console.log('[SAN] SANAppSavePageEvent IGNORED for incoming call — owned by SANAppIncomingEvent. state:', stateOnSave);
            break;
          }

          // CRITICAL: If accept handshake is in progress OR the incoming call is
          // still in ringing state, this SavePage is a spurious transition signal.
          // DO NOT reset state or open disposition — the call hasn't connected yet.
          if (acceptPendingOnSave || isStillRinging) {
            console.log('[SAN] SANAppSavePageEvent BLOCKED — acceptPending:', acceptPendingOnSave, 'isStillRinging:', isStillRinging);
            break;
          }

          if (hasDialedThisSession.current && stateOnSave !== 'idle') {
            stopTimer();
            setCallState('disposition_pending');
            setShowDispositionForm(true);
            // Do NOT wipe callId / leadId — submitDisposition() needs them.
          } else {
            setCallState('idle');
            setAgentState('ready');
            setCurrentCallId(null);
            setCurrentLeadId(null);
            setCurrentPhoneNumber('');
            setCallDuration(0);
            setCallWasAnswered(false);
            setStatusUnconfirmed(false);
            setIsHeld(false);
            clearHoldWatchers();
            setIsMuted(false);
            setConferenceMembers([]);
            setConferenceDialingMembers([]);
            conferenceMembersRef.current = [];
            conferenceModeRef.current = false;
          }
          break;
        }

        // ── LOGOUT ──
        case 'SANAppLogoutEvent':
          setAgentState('logged_out');
          setCallState('idle');
          setExtension(payload?.exten || '');
          // Unblock an awaiting CRM logout (window.__sanCtiLogout) immediately
          // instead of letting it run out its fallback timeout.
          if (sanLogoutResolveRef.current) {
            sanLogoutResolveRef.current();
            sanLogoutResolveRef.current = null;
          }
          break;

        // ── SAN SENDS DISPOSITION OPTIONS ──
        case 'SEND_DISPOSITION':
          if (Array.isArray(payload)) {
            setSanDispositionOptions(payload.map((d: any) => d.disposition));
          }
          break;

        // ── CONFERENCE: member joined / left. SAN sends the full current
        // member dict on every event (not incremental), so replace wholesale. ──
        case 'SANAppConfEventjoin':
        case 'SANAppConfEventLeave': {
          const memberDict = payload?.conf_memeber || payload?.conf_member || {};
          const members = (Object.values(memberDict).filter(Boolean) as ConferenceMember[]);
          conferenceMembersRef.current = members;
          setConferenceMembers(members);

          // A number that has joined (or whose leg has ended) is no longer
          // "dialing". SAN drops it from its own dialing dict but does not
          // re-send conferenceDialing, so without this the yellow "Dialing…"
          // row for a party who already answered — or already hung up —
          // stays on the panel for the rest of the call.
          const settled = new Set(members.map(m => sameNumber(m.conf_member)));
          setConferenceDialingMembers(prev =>
            prev.filter(d => !settled.has(sameNumber(d.conf_member || d.caller_id)))
          );
          break;
        }

        // ── CONFERENCE: numbers currently being dialed into the conference ──
        case 'conferenceDialing': {
          const dialingDict = payload?.conference_dialing_members || {};
          const joined = new Set(conferenceMembersRef.current.map(m => sameNumber(m.conf_member)));
          setConferenceDialingMembers(
            (Object.values(dialingDict).filter(Boolean) as ConferenceMember[])
              .filter(d => !joined.has(sameNumber(d.conf_member || d.caller_id)))
          );
          break;
        }
      }
    }

    // SAN's callerMini iframe calls parent.SANAppXxx(data) as direct window
    // function calls — NOT via postMessage. Bridge those calls into the same
    // handler so all the call-state logic above lives in one place. Without
    // this, none of these events are ever received: calls never progress past
    // 'Dialing' (no Ringing/Answer), and Hangup/SavePage never fire the
    // disposition modal.
    const bridgedEvents = [
      'SANAppInitEvent', 'SANAppReadyEvent', 'SANAppOutgoingEvent',
      'SANAppIncomingEvent', 'SANAppHoldEvent', 'SANAppSavePageEvent',
      'SANAppManualOnOffEvent', 'SANAppBreakEvent', 'SANAppLogoutEvent',
      'SEND_DISPOSITION', 'SANAppConfEventjoin', 'SANAppConfEventLeave',
      'conferenceDialing',
    ];
    const previousHandlers: Record<string, any> = {};
    bridgedEvents.forEach(name => {
      previousHandlers[name] = (window as any)[name];
      (window as any)[name] = (data: any) => {
        console.log('[SAN BRIDGE]', name, data);
        handleSanEvent({ data: { type: name, payload: data } } as MessageEvent);
      };
    });
    console.log('[SAN BRIDGE] armed for:', bridgedEvents.join(', '));

    // Keep the postMessage listener too — harmless fallback for any SAN
    // version/config that does use postMessage for some events.
    const onWindowMessage = (event: MessageEvent) => {
      // Only trust messages that actually came out of the SAN iframe. Previously
      // ANY message carrying a `type` field was accepted, and every one of them
      // set hasSanResponseRef — the flag that cancels the login-retry interval
      // and steers the 35 s watchdog. Unrelated postMessage traffic (dev tooling,
      // browser extensions, other embeds) therefore silently suppressed the retry
      // that would have recovered a dropped login.
      const sanWindow = iframeRef.current?.contentWindow;
      if (sanWindow && event.source && event.source !== sanWindow) return;
      handleSanEvent(event);
    };
    window.addEventListener('message', onWindowMessage);
    return () => {
      window.removeEventListener('message', onWindowMessage);
      bridgedEvents.forEach(name => {
        (window as any)[name] = previousHandlers[name];
      });
    };
    // callDuration, callState, userInitiatedHangup intentionally omitted — read via refs
    // (callDurationRef, callStateRef, userInitiatedHangupRef) to avoid re-registration
    // on every state change, which would cause stale-closure bugs under rapid SAN events.
  }, [apiCall, startTimer, stopTimer, currentCallId, postToSan, requestManualOn, clearHoldWatchers]);

  // ── Auto-login after iframe is loaded ──
  // Guarded: only logs in if agentStateRef.current is 'logged_out' to prevent
  // duplicate login messages from resetting active SIP sessions when credentials
  // or other state changes trigger a re-render.
  //
  // Retries every 2s (up to 5 times) as long as agentState is still
  // 'logged_out': the iframe's `load` event firing does not guarantee SAN's
  // own window.addEventListener('message', ...) has been registered yet —
  // a login sent in that gap is silently dropped, leaving the agent stuck on
  // SAN's raw login screen with no SIP session, so dialing/answering never
  // does anything real. A few retries make that race harmless.
  useEffect(() => {
    if (!user || !sanUsername || !isIframeLoaded) return;
    if (agentStateRef.current !== 'logged_out') {
      console.log('[SAN CTI] Skip auto-login: agentState is already', agentStateRef.current);
      return;
    }
    console.log('[SAN CTI] Iframe loaded and user profile resolved. Performing initial login...');
    console.log('[SAN CTI] Resolved credentials — user.san_username:', user?.san_username, '| user.san_password:', user?.san_password, '| fallback used:', !user?.san_password);
    hasSanResponseRef.current = false;
    login();

    let attempts = 1;
    const retryTimer = setInterval(() => {
      // hasSanResponseRef proves the message round-trip works at all — SAN's
      // own confirmation events (Init/Ready) aren't reliable enough to trust
      // as the sole "did it fail" signal (verified: a login can fully
      // succeed on SAN's side, send back nothing we recognize, and still
      // get retried here — which SAN then rejects as a duplicate session).
      if (agentStateRef.current !== 'logged_out' || hasSanResponseRef.current || attempts >= 5) {
        clearInterval(retryTimer);
        return;
      }
      attempts += 1;
      console.log('[SAN CTI] Still logged_out after previous attempt — retrying login, attempt', attempts);
      login();
    }, 2000);

    return () => clearInterval(retryTimer);
  }, [login, sanUsername, isIframeLoaded, user]);

  // ── Post-reload recovery ladder ──
  // Runs only for the once-per-login iframe reload triggered by the first
  // SANAppInitEvent (awaitingPostReloadInitRef). That reload is the single point
  // in the whole flow where nothing else is watching: the login watchdog has been
  // cleared, agentState has left 'logged_out' so the auto-login effect above
  // refuses to act, and the readyFallback lives in a branch that only the SECOND
  // SANAppInitEvent can reach. When SAN doesn't re-announce itself on the
  // reloaded page, the agent is stranded at 'logged_in' — the mini CRM shows
  // logged in but never ready, every dial is refused, and SAN's own login modal
  // resurfaces minutes later. This ladder is what closes that hole.
  useEffect(() => {
    if (!isIframeLoaded || !awaitingPostReloadInitRef.current) return;
    console.log('[SAN CTI] Reloaded iframe up — sending fast ready nudge @300ms');

    // Send ready signal immediately after iframe script load
    const fastNudgeTimer = setTimeout(() => {
      if (!awaitingPostReloadInitRef.current || agentStateRef.current === 'ready') return;
      console.log('[SAN CTI] Fast post-reload nudge @300ms → { type: "ready" }');
      postToSan({ type: 'ready' });
    }, 300);

    postReloadNudgeRef.current = setTimeout(() => {
      postReloadNudgeRef.current = null;
      if (!awaitingPostReloadInitRef.current || agentStateRef.current === 'ready') return;
      console.log('[SAN CTI] Second post-reload nudge @1200ms → { type: "ready" }');
      postToSan({ type: 'ready' });
    }, 1200);

    postReloadReloginRef.current = setTimeout(() => {
      postReloadReloginRef.current = null;
      if (!awaitingPostReloadInitRef.current || agentStateRef.current === 'ready') return;
      console.warn('[SAN CTI] Post-reload fallback @3s: forcing agentState ready and requesting manual mode');
      awaitingPostReloadInitRef.current = false;
      setAgentState('ready');
      apiCall('POST', '/cti/status', { status: 'ready' });
      requestManualOn();
    }, 3000);

    return () => {
      clearTimeout(fastNudgeTimer);
      if (postReloadNudgeRef.current) { clearTimeout(postReloadNudgeRef.current); postReloadNudgeRef.current = null; }
      if (postReloadReloginRef.current) { clearTimeout(postReloadReloginRef.current); postReloadReloginRef.current = null; }
    };
  }, [isIframeLoaded, postToSan, requestManualOn, apiCall]);

  // ── Monitor SanCtiProvider lifecycle ──
  useEffect(() => {
    console.log('[SAN CTI] SanCtiProvider MOUNTED');
    return () => {
      console.log('[SAN CTI] SanCtiProvider UNMOUNTED');
    };
  }, []);

  // ── Restore focus to parent window upon call connection to enable immediate typing ──
  useEffect(() => {
    if (callState === 'connected') {
      try {
        window.focus();
      } catch (_) { }
    }
  }, [callState]);

  // ── Auto-show the softphone on an incoming ring; collapse it once idle ──
  //
  // The iframe must be visible so the agent can click SAN's native Answer
  // button. The rule used to be "visible ONLY while callState is
  // incoming_ringing", which hid the panel the instant the agent answered:
  // Answer → callState 'connected' → this effect → panel slides off-screen
  // mid-conversation. That is the "dialer disappears in between the call"
  // report. It also stamped on the panel the agent had opened themselves (the
  // +/− button, or the login-failure branch that reveals SAN's login form) as
  // soon as any call state moved.
  //
  // Now: auto-show on a ring, auto-hide only on the way back to idle, and
  // touch nothing in between — so a panel the agent opened stays open for as
  // long as the call lasts.
  useEffect(() => {
    if (callState === 'incoming_ringing') {
      setIsCtiMinimized(false);
      return;
    }
    if (callState === 'idle') {
      setIsCtiMinimized(true);
      return;
    }
    // dialing / ringing / connected / disposition_pending — leave whatever is
    // on screen alone. A live call is exactly when the agent may need SAN's
    // own controls.
  }, [callState]);

  // ── Expose global dial, hold, and mute functions for lead cards and CRM toolbar ──
  useEffect(() => {
    const handleDial = (phoneNumber: string, leadUserId: number | string = 0, name?: string, tmid?: string, leadType?: string) => {
      dial(phoneNumber, leadUserId, name, tmid, leadType);
    };
    (window as any)._sanDial = handleDial;
    (window as any).dialAgentCall = (number?: string) => {
      if (number) {
        handleDial(number.trim(), 0, 'Manual Outbound');
      }
    };
    (window as any).toggleHold = () => {
      toggleHold();
    };
    (window as any).toggleMute = () => {
      toggleMute();
    };
    return () => {
      delete (window as any)._sanDial;
      delete (window as any).dialAgentCall;
      delete (window as any).toggleHold;
      delete (window as any).toggleMute;
    };
  }, [dial, toggleHold, toggleMute]);

  // ── Awaitable SAN logout for the CRM logout flow ──
  // AuthProvider.logout() awaits this BEFORE clearing the user. Clearing the
  // user unmounts DashboardLayout — and this iframe with it — which kills
  // SAN's logout HTTP request mid-flight and leaves the agent session locked
  // on SAN's server (next login from anywhere then fails with "You are
  // already login on another machine"). Resolves when SANAppLogoutEvent
  // arrives, or after 2.5s as a fallback so sign-out can never hang.
  useEffect(() => {
    (window as any).__sanCtiLogout = (): Promise<void> => {
      if (agentStateRef.current === 'logged_out' || !iframeRef.current?.contentWindow) {
        return Promise.resolve();
      }
      console.log('[SAN CTI] CRM logout — sending SAN logout and waiting for confirmation');
      sanLogoutDoneRef.current = true;
      postToSan({ type: 'Logout' });
      apiCall('POST', '/cti/logout');
      return new Promise<void>((resolve) => {
        sanLogoutResolveRef.current = resolve;
        setTimeout(() => {
          sanLogoutResolveRef.current = null;
          resolve();
        }, 2500);
      });
    };
    return () => { delete (window as any).__sanCtiLogout; };
  }, [postToSan, apiCall]);

  // ── Release the SAN session when the tab is closed or refreshed ──
  // SAN allows exactly ONE live session per agent account and only frees it on
  // an explicit logout. Closing or refreshing the CRM tab skipped
  // AuthProvider.logout() entirely, so the session stayed held on SAN's server
  // and the next login was rejected with "You are already login on another
  // machine" — which is why the agent had to force-logout from SAN's admin
  // panel before the CRM would work again.
  // Best-effort by nature: the iframe's own logout HTTP request may be cut off
  // mid-flight by the unload. It costs nothing when it fails (that is exactly
  // today's behaviour) and frees the session when it lands.
  useEffect(() => {
    const releaseSanSession = () => {
      if (agentStateRef.current === 'logged_out' || sanLogoutDoneRef.current) return;
      sanLogoutDoneRef.current = true;
      postToSan({ type: 'Logout' });
    };
    // pagehide covers close, reload and navigation, and (unlike beforeunload)
    // still fires on mobile/bfcache paths. persisted=true means the page is
    // being frozen into the bfcache and may come straight back — keep the
    // session in that case.
    const onPageHide = (e: PageTransitionEvent) => { if (!e.persisted) releaseSanSession(); };
    window.addEventListener('pagehide', onPageHide);
    return () => window.removeEventListener('pagehide', onPageHide);
  }, [postToSan]);


  const value: SanCtiContextType = {
    // State
    agentState,
    callState,
    extension,
    isOnBreak,
    breakName,
    isManualMode,
    isHeld,
    isHoldUnconfirmed,
    isMuted,
    conferenceMembers,
    conferenceDialingMembers,
    callDuration,
    callWasAnswered,
    statusUnconfirmed,
    currentCallId,
    currentLeadId,
    currentPhoneNumber,
    currentLeadName,
    currentLeadTmid,
    currentLeadType,
    currentLeadLocation,
    currentLeadCallStatus,
    isIncomingCall,
    isAcceptingIncoming,
    showDispositionForm,
    sanDispositionOptions,

    // Actions
    login,
    goReady,
    dial,
    hangup,
    toggleHold,
    toggleMute,
    startConference,
    addConferenceNumber,
    holdConferenceMember,
    showSoftphone,
    acceptIncoming,
    logout,
    toggleManualMode,
    submitDisposition,
    setShowDispositionForm,
    startMockCall,
  };

  return (
    <SanCtiContext.Provider value={value}>
      {children}

      {/* ── SAN Softphone Iframe ──
          Hidden at all times except when an incoming call is ringing.
          The iframe auto-shows on incoming_ringing so the agent can click
          SAN's native Answer button (a trusted in-document click required
          for audio autoplay). It auto-hides the moment the call leaves
          that state (answered, missed, or hung up).
          iframe SIZE is always 320×440 — only POSITION toggles (off-screen
          vs on-screen). Resizing breaks SAN's call handling; moving it
          off-screen keeps the SIP session alive undisturbed.
      ──────────────────────────────────────────────────────────────── */}
      {isMicPermissionChecked && (() => {
        // Visible only during incoming_ringing (auto-shown/hidden by the
        // useEffect above). isCtiMinimized stays true at all other times.
        const isVisible = callState === 'incoming_ringing' || !isCtiMinimized;
        return (
          <div style={{
            position: 'fixed',
            bottom: 25,
            left: isVisible ? 25 : -9999,
            width: 320,
            height: 440,
            zIndex: 9999,
            borderRadius: 12,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            backgroundColor: '#111827',
            border: '1px solid #374151',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column',
          }}>
            {/* Header Bar */}
            <div style={{
              height: 40,
              padding: '0 12px',
              backgroundColor: '#1F2937',
              borderBottom: '1px solid #374151',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              userSelect: 'none',
              flexShrink: 0,
            }}>
              <div>
                <span style={{ fontSize: 12, fontWeight: 700, color: '#F3F4F6' }}>
                  SAN Softphone
                </span>
                <span style={{
                  marginLeft: 6, fontSize: 10, fontWeight: 600,
                  color: agentState === 'logged_out' ? '#F87171' : agentState === 'ready' ? '#34D399' : '#FCD34D',
                }}>
                  {agentState}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                {/* Gear: open CTI credential settings */}
                <button
                  onClick={() => { setCtiSettingsErr(''); setShowCtiSettings(s => !s); }}
                  style={{
                    width: 24, height: 24, borderRadius: 4,
                    border: '1px solid #4B5563', backgroundColor: '#374151',
                    color: '#9CA3AF', fontSize: 14, cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title="CTI Credentials Settings"
                >⚙</button>
                <button
                  onClick={() => setIsCtiMinimized(!isCtiMinimized)}
                  style={{
                    width: 24, height: 24, borderRadius: 4,
                    border: '1px solid #4B5563', backgroundColor: '#374151',
                    color: '#fff', fontSize: 14, fontWeight: 'bold', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  title={isCtiMinimized ? 'Show' : 'Hide'}
                >
                  {isCtiMinimized ? '+' : '−'}
                </button>
              </div>
            </div>

            {/* ── CTI Credentials Settings Panel ── */}
            {showCtiSettings && (() => {
              const [uInput, setUInput] = React.useState(sanUsername);
              const [pInput, setPInput] = React.useState('');
              const [eInput, setEInput] = React.useState(credOverride?.extension || user?.san_extension || '');
              return (
                <div style={{
                  position: 'absolute', top: 40, left: 0, right: 0, zIndex: 10,
                  backgroundColor: '#111827', borderBottom: '1px solid #374151',
                  padding: '12px 14px',
                }}>
                  <p style={{ fontSize: 10, fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 10 }}>
                    CTI Login Credentials
                  </p>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ fontSize: 10, color: '#6B7280', display: 'block', marginBottom: 3 }}>SAN Username</label>
                    <input
                      value={uInput} onChange={e => setUInput(e.target.value)}
                      placeholder="e.g. Sonam@TruckMitr"
                      style={{ width: '100%', padding: '5px 8px', borderRadius: 4, border: '1px solid #374151', backgroundColor: '#1F2937', color: '#F3F4F6', fontSize: 11, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ fontSize: 10, color: '#6B7280', display: 'block', marginBottom: 3 }}>SAN Password / Token</label>
                    <input
                      type="password" value={pInput} onChange={e => setPInput(e.target.value)}
                      placeholder="Enter token (leave blank to keep current)"
                      style={{ width: '100%', padding: '5px 8px', borderRadius: 4, border: '1px solid #374151', backgroundColor: '#1F2937', color: '#F3F4F6', fontSize: 11, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <label style={{ fontSize: 10, color: '#6B7280', display: 'block', marginBottom: 3 }}>Extension (optional)</label>
                    <input
                      value={eInput} onChange={e => setEInput(e.target.value)}
                      placeholder="e.g. 101"
                      style={{ width: '100%', padding: '5px 8px', borderRadius: 4, border: '1px solid #374151', backgroundColor: '#1F2937', color: '#F3F4F6', fontSize: 11, outline: 'none', boxSizing: 'border-box' }}
                    />
                  </div>
                  {ctiSettingsErr && (
                    <p style={{ fontSize: 10, color: '#F87171', marginBottom: 6 }}>{ctiSettingsErr}</p>
                  )}
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      onClick={() => setShowCtiSettings(false)}
                      style={{ flex: 1, padding: '5px 0', borderRadius: 4, border: '1px solid #4B5563', backgroundColor: 'transparent', color: '#9CA3AF', fontSize: 11, cursor: 'pointer' }}
                    >Cancel</button>
                    <button
                      onClick={() => saveCtiCredentials(uInput, pInput || sanPassword, eInput)}
                      disabled={ctiSettingsSaving}
                      style={{ flex: 1, padding: '5px 0', borderRadius: 4, border: 'none', backgroundColor: '#7C3AED', color: '#fff', fontSize: 11, fontWeight: 700, cursor: 'pointer', opacity: ctiSettingsSaving ? 0.6 : 1 }}
                    >{ctiSettingsSaving ? 'Saving…' : 'Save & Re-login'}</button>
                  </div>
                </div>
              );
            })()}

            {/* Iframe Content.
              src has NO trailing slash and allow is exactly "microphone;
              camera" — confirmed via direct A/B testing earlier in this
              project to be the one configuration that gives two-way audio.
              The iframe is always fully opaque/visible at real size here;
              a near-zero-opacity iframe with a fake overlay on top (as this
              briefly was) was tried multiple times and reproduces one-way
              audio every time — the agent's real click needs to land on
              SAN's own actual, visible button, not an invisible stand-in. */}
            <div style={{ flex: 1, backgroundColor: '#000', position: 'relative' }}>
              <iframe
                ref={iframeRef}
                key={sanIframeKey}
                id="childIframe"
                src="https://ccsslb.sansoftwares.com/callerMini"
                allow="microphone; camera"
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                }}
                title="SAN CTI"
                onLoad={() => {
                  console.log('[SAN IFRAME] loaded successfully');
                  setIsIframeLoaded(true);
                }}
                onError={() => console.error('[SAN IFRAME] failed to load')}
              />
            </div>
          </div>
        );
      })()}
    </SanCtiContext.Provider>
  );
}
