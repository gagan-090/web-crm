import React, { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { API_BASE_URL } from '../../../shared/constants/config';
import { SanCtiContext } from './SanCtiContext';
import type { SanCtiContextType, ConferenceMember, DispositionData } from './SanCtiContext';

// Context, hook (useSanCti), and shared types live in ./SanCtiContext —
// kept out of this file so it exports only a component and stays
// Fast-Refresh-safe during development (see comment there).

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
  const [isHeld, setIsHeld] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  // Keyed by conf_member (SAN's own member id) — SANAppConfEventjoin/Leave
  // send the full current member dict on every event, so these are replaced
  // wholesale rather than merged incrementally.
  const [conferenceMembers, setConferenceMembers] = useState<ConferenceMember[]>([]);
  const [conferenceDialingMembers, setConferenceDialingMembers] = useState<ConferenceMember[]>([]);
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
  // Guard: set to true when agent clicks "Accept". Blocks all state-resetting
  // SAN events (Ready, SavePage) for up to 8 s while the SIP handshake completes.
  // Cleared immediately when SANAppIncomingEvent(Answer) fires.
  const acceptingIncomingRef = useRef<boolean>(false);
  const acceptingIncomingTimerRef = useRef<any>(null);
  // Ref to hold the active incoming call payload to pass during IncAccept
  const activeIncomingPayloadRef = useRef<any>(null);

  // ── Hold confirmation tracking ──
  // Incremented on every hold confirmation from SAN (SANAppHoldEvent or
  // SANAppOutgoingEvent exten_status:'Hold'). toggleHold's revert timer uses
  // it to detect whether SAN ever acknowledged the request.
  const holdEventSeqRef = useRef<number>(0);
  const holdRevertTimerRef = useRef<any>(null);

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

  // ── Helper: API call to Laravel ──
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
      return await res.json();
    } catch (err) {
      console.error(`[SAN CTI] API error ${endpoint}:`, err);
      return null;
    }
  }, [bearerToken, apiBaseUrl]);

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
  useLayoutEffect(() => { callStateRef.current = callState; }, [callState]);
  useLayoutEffect(() => { userInitiatedHangupRef.current = userInitiatedHangup; }, [userInitiatedHangup]);
  useLayoutEffect(() => { isIncomingCallRef.current = isIncomingCall; }, [isIncomingCall]);
  useLayoutEffect(() => { currentLeadTypeRef.current = currentLeadType; }, [currentLeadType]);
  useLayoutEffect(() => { agentStateRef.current = agentState; }, [agentState]);

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
    if (loginWatchdogRef.current) clearTimeout(loginWatchdogRef.current);
    loginWatchdogRef.current = setTimeout(() => {
      loginPendingRef.current = false;
      loginWatchdogRef.current = null;
      if (agentStateRef.current !== 'ready' && agentStateRef.current !== 'logged_in') {
        if (hasSanResponseRef.current) {
          // SAN responded but SANAppInitEvent hasn't fired yet.
          // The SANAppInitEvent handler already knows the fix: reload the iframe so
          // SAN's init.js re-runs getCurrentSession() and initializes the module-level
          // `logged_agent` from localStorage. Without that reload, dialCall() and
          // dispositionFormSubmit() crash with "Cannot read properties of undefined
          // (reading 'agent_id')" / "Object.keys(null)" even after agent appears ready.
          if (!freshLoginReloadDoneRef.current) {
            // First occurrence — reload the iframe exactly as SANAppInitEvent does.
            // Keep agentState as 'logged_out' so the auto-login effect re-fires on
            // the new iframe load and starts a fresh 35s watchdog. isIframeLoaded
            // must go false first: the effect keys off it, and the new iframe's
            // onLoad is what flips it back to true.
            freshLoginReloadDoneRef.current = true;
            console.warn('[SAN CTI] Login watchdog (35s): SANAppInitEvent pending — reloading iframe to force logged_agent init. ManualOn suppressed.');
            setIsIframeLoaded(false);
            setSanIframeKey(prev => prev + 1);
          } else {
            // Already reloaded once and still no SANAppInitEvent. SAN responded
            // to the postMessage channel but its login API never succeeded —
            // in practice this is SAN rejecting the credentials, most often
            // "You are already login on another machine" (SAN allows ONE live
            // session per agent account; a session held by another origin —
            // e.g. a localhost dev tab — blocks this one). SAN only surfaces
            // that error as a toast inside its own iframe, so un-hide the
            // panel and stay logged_out instead of faking 'ready' (dialing
            // would silently do nothing).
            console.warn('[SAN CTI] Login watchdog (35s): SANAppInitEvent still pending after reload — SAN login was rejected (likely "already login on another machine"). Showing SAN panel.');
            setAgentState('logged_out');
            setIsCtiMinimized(false);
          }
        } else {
          console.warn('[SAN CTI] Login watchdog (35s): no SANAppInitEvent and no SAN response — login failed');
          setAgentState('logged_out');
          setIsCtiMinimized(false);
        }
      }
    }, 35000);
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
    if (agentState !== 'ready') {
      console.warn('[SAN CTI] Cannot dial, agent is not ready. Current state:', agentState);
      return;
    }
    if (callState !== 'idle') {
      console.warn('[SAN CTI] Cannot dial — already in a call state:', callState);
      if (callState === 'disposition_pending') {
        alert('Please submit the feedback for the previous call first.');
        setShowDispositionForm(true);
      }
      return;
    }

    setCurrentPhoneNumber(phoneNumber);
    setCurrentLeadId(leadUserId);
    setCurrentLeadName(name || '');
    setCurrentLeadTmid(tmid || '');
    setCurrentLeadType(leadType);
    setCallState('dialing');
    setIsIncomingCall(false);
    setUserInitiatedHangup(false);
    // Mark that the agent has actively dialed in this session — enables disposition modal on hangup
    hasDialedThisSession.current = true;
    lastDialTime.current = Date.now();

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

    // 1. Tell SAN to dial — exactly as the SAN reference HTML does.
    postToSan({
      type: 'dial',
      number: cleanNumber,
      uniqueId: leadUserId && leadUserId !== 0 ? String(leadUserId) : '',
    });

    // 2. Start a dialing timeout: if no SAN event comes in 60s, auto-reset to idle
    if (dialingTimeoutRef.current) clearTimeout(dialingTimeoutRef.current);
    dialingTimeoutRef.current = setTimeout(() => {
      setCallState(prev => {
        if (prev === 'dialing' || prev === 'ringing') {
          console.warn('[SAN CTI] Dialing timeout — SAN never responded. Resetting to idle.');
          return 'idle';
        }
        return prev;
      });
      setCurrentCallId(null);
      setCurrentLeadId(null);
      setCurrentPhoneNumber('');
      hasDialedThisSession.current = false;
    }, 60000);

    // 3. Tell Laravel: call started
    const result = await apiCall('POST', '/call/initiate', {
      user_id: Number(leadUserId),
      phone_number: phoneNumber,
      san_session_id: `SAN_${Date.now()}_${agentId}`,
      lead_type: leadType,
    });

    if (result?.data?.call_id) {
      setCurrentCallId(result.data.call_id);
    }
  }, [callState, postToSan, apiCall, agentId, bearerToken, agentState, startTimer]);

  const startMockCall = useCallback((leadName = 'Simulated Driver', phoneNumber = '+91 99999 88888', tmid = 'DR-9999') => {
    setCurrentPhoneNumber(phoneNumber);
    setCurrentLeadId(9999);
    setCurrentLeadName(leadName);
    setCurrentLeadTmid(tmid);
    setCallState('connected');
    setAgentState('on_call');
    setCurrentCallId(-999); // Magic ID for mock calls
    setCallDuration(45);
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
      setIsHeld(false);
      setIsMuted(false);
      setConferenceMembers([]);
      setConferenceDialingMembers([]);
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
  }, [currentCallId, postToSan, stopTimer]);

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
   * The UI flips optimistically; if NO confirmation event arrives within 5s
   * (older SAN builds shipped with HoldUnhold commented out, in which case
   * the HoldCall message is silently dropped), the state reverts so the bar
   * never claims a hold that didn't happen. holdEventSeqRef counts every
   * hold confirmation; the revert timer only fires if the count hasn't
   * moved since the toggle.
   */
  const toggleHold = useCallback(() => {
    const next = !isHeld;
    postToSan({ type: next ? 'HoldCall' : 'UnholdCall' });
    setIsHeld(next);
    const seqAtToggle = holdEventSeqRef.current;
    if (holdRevertTimerRef.current) clearTimeout(holdRevertTimerRef.current);
    holdRevertTimerRef.current = setTimeout(() => {
      holdRevertTimerRef.current = null;
      if (holdEventSeqRef.current === seqAtToggle && callStateRef.current === 'connected') {
        console.warn('[SAN CTI] Hold/Unhold not confirmed by SAN within 5s — reverting UI state');
        setIsHeld(!next);
      }
    }, 5000);
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
    postToSan({ type: 'ConfrenceToggle' });
  }, [postToSan]);

  /**
   * Dial an additional number into the in-progress call as a conference
   * member. SAN bridges the new leg in automatically; join/leave state comes
   * back via the SANAppConfEventjoin / conferenceDialing / SANAppConfEventLeave
   * bridged events handled below.
   */
  const addConferenceNumber = useCallback((phoneNumber: string) => {
    if (!phoneNumber?.trim()) return;
    postToSan({ type: 'ConfrenceNumber', phone: phoneNumber.trim() });
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

    if (currentCallId !== -999) {
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
        call_id: currentCallId,
        call_status: dispositionData.disposition === 'connected' ? 'connected' :
          dispositionData.disposition === 'callback' ? 'callback_later' : 'not_connected',
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

    // 3. Reset call state
    setShowDispositionForm(false);
    setCallState('idle');
    // Don't rely solely on SAN's own SANAppReadyEvent to flip this back —
    // if SAN doesn't fire it reliably after every call, agentState gets stuck
    // at 'on_call' forever, which silently blocks the auto-dial effect on
    // every lead after the first one. Disposition submission is the one point
    // we can guarantee fires at the true end of every call cycle.
    setAgentState('ready');
    setCurrentCallId(null);
    setCurrentLeadId(null);
    setCurrentPhoneNumber('');
    setCurrentLeadName('');
    setCurrentLeadTmid('');
    setCallDuration(0);
    setIsHeld(false);
    setIsMuted(false);
    setConferenceMembers([]);
    setConferenceDialingMembers([]);
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
  }, [postToSan, apiCall, currentCallId, currentLeadId, currentLeadTmid, currentLeadName, currentPhoneNumber, isIncomingCall, sanDispositionOptions]);

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
            if (loginPendingRef.current) {
              // SAN fires {success:false} as an INTERMEDIATE ack before their HTTP request completes.
              // Real outcome arrives via SANAppInitEvent. Ignore this interim event.
              console.log('[SAN CTI] Login intermediate ack (success=false) — awaiting SANAppInitEvent');
              break;
            }
            // Not during a pending login — genuine failure (e.g., wrong creds on retry)
            console.warn('[SAN CTI] Login failed:', evData);
            if (loginWatchdogRef.current) { clearTimeout(loginWatchdogRef.current); loginWatchdogRef.current = null; }
            setAgentState('logged_out');
            // SAN shows the actual reason (wrong password / "already login on
            // another machine") only inside its own iframe — make it visible.
            setIsCtiMinimized(false);
            apiCall('POST', '/cti/status', { status: 'logged_out' });
          }
          break;
        }

        // ── INIT: Agent logged into SAN ──
        case 'SANAppInitEvent':
          loginPendingRef.current = false;
          if (loginWatchdogRef.current) { clearTimeout(loginWatchdogRef.current); loginWatchdogRef.current = null; }

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
              if (readyFallbackRef.current) clearTimeout(readyFallbackRef.current);
              readyFallbackRef.current = setTimeout(() => {
                readyFallbackRef.current = null;
                setAgentState(prev => {
                  if (prev === 'logged_in') {
                    console.warn('[SAN CTI] readyFallback: SANAppReadyEvent never fired after 20s — forcing ready');
                    apiCall('POST', '/cti/status', { status: 'ready' });
                    return 'ready';
                  }
                  return prev;
                });
              }, 20000);
              break;
            case '3': // Already idle/ready
              setAgentState('ready');
              apiCall('POST', '/cti/status', { status: 'ready' });
              setTimeout(() => postToSan({ type: 'ManualOn' }), 1500);
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
              setIsManualMode(payload?.status === '10');
              setAgentState('ready');
              if (payload?.status === '11') {
                // Delay ManualOn: crmstates.agent_id may not be set yet
                setTimeout(() => postToSan({ type: 'ManualOn' }), 1500);
              }
              break;
          }
          break;

        // ── READY: Agent is now live ──
        case 'SANAppReadyEvent':
          if (readyFallbackRef.current) { clearTimeout(readyFallbackRef.current); readyFallbackRef.current = null; }
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
              // Delay 1.5 s to let SAN finish its own internal state setup.
              setTimeout(() => postToSan({ type: 'ManualOn' }), 1500);
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

          if (extenStatus === 'Dialing' || extenStatus === 'Ringing') {
            setCallState('ringing');
            setAgentState('on_call');
          } else if (extenStatus === 'Answer') {
            setCallState('connected');
            startTimer();
            // Update Laravel: call connected
            if (currentCallId) {
              apiCall('POST', '/call/update', {
                call_id: currentCallId,
                event: 'answered',
              });
            }
          } else if (extenStatus === 'Hold') {
            // Server-side hold confirmation — observed live as
            // {exten_status:'Hold', hold:1, trunk_channel:'SIP/...'}. Fires
            // for both hold (hold:1) and unhold (hold:0). Redundant with
            // SANAppHoldEvent but SAN sends both; treat either as authoritative.
            holdEventSeqRef.current += 1;
            if (holdRevertTimerRef.current) { clearTimeout(holdRevertTimerRef.current); holdRevertTimerRef.current = null; }
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
            }
          } else if (status === 'Answer') {
            // Clear the accept guard — handshake complete, call is live.
            if (acceptingIncomingTimerRef.current) clearTimeout(acceptingIncomingTimerRef.current);
            acceptingIncomingRef.current = false;
            setIsAcceptingIncoming(false);
            console.log('[SAN] SANAppIncomingEvent Answer — guard cleared, transitioning to connected');
            setCallState('connected');
            startTimer();
            // Log incoming call to DB now that it's answered
            apiCall('POST', '/call/incoming/initiate', {
              caller_phone: callerPhone || currentPhoneNumber,
              did_number: payload?.did || payload?.DID || '',
              user_id: null, // backend will auto-lookup
            }).then((res: any) => {
              if (res?.data?.call_id) {
                setCurrentCallId(res.data.call_id);
                // Update lead info if backend resolved it
                if (res.data.user_id) setCurrentLeadId(res.data.user_id);
                if (res.data.user_name) setCurrentLeadName(res.data.user_name);
                if (res.data.tmid) setCurrentLeadTmid(res.data.tmid);
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
          if (holdRevertTimerRef.current) { clearTimeout(holdRevertTimerRef.current); holdRevertTimerRef.current = null; }
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
          setIsManualMode(payload?.state !== 11);
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
            setIsHeld(false);
            setIsMuted(false);
            setConferenceMembers([]);
            setConferenceDialingMembers([]);
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
          setConferenceMembers(Object.values(memberDict).filter(Boolean) as ConferenceMember[]);
          break;
        }

        // ── CONFERENCE: numbers currently being dialed into the conference ──
        case 'conferenceDialing': {
          const dialingDict = payload?.conference_dialing_members || {};
          setConferenceDialingMembers(Object.values(dialingDict).filter(Boolean) as ConferenceMember[]);
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
    window.addEventListener('message', handleSanEvent);
    return () => {
      window.removeEventListener('message', handleSanEvent);
      bridgedEvents.forEach(name => {
        (window as any)[name] = previousHandlers[name];
      });
    };
    // callDuration, callState, userInitiatedHangup intentionally omitted — read via refs
    // (callDurationRef, callStateRef, userInitiatedHangupRef) to avoid re-registration
    // on every state change, which would cause stale-closure bugs under rapid SAN events.
  }, [apiCall, startTimer, stopTimer, currentCallId, postToSan]);

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

  // ── Auto-show iframe only during incoming_ringing; auto-hide when it ends ──
  // The iframe must be visible so the agent can click SAN's native Answer button.
  // Once the call leaves incoming_ringing (answered or missed), collapse it again.
  useEffect(() => {
    if (callState === 'incoming_ringing') {
      setIsCtiMinimized(false);
    } else {
      setIsCtiMinimized(true);
    }
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


  const value: SanCtiContextType = {
    // State
    agentState,
    callState,
    extension,
    isOnBreak,
    breakName,
    isManualMode,
    isHeld,
    isMuted,
    conferenceMembers,
    conferenceDialingMembers,
    callDuration,
    currentCallId,
    currentLeadId,
    currentPhoneNumber,
    currentLeadName,
    currentLeadTmid,
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
