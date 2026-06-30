import React, { createContext, useContext, useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import { useAuth } from '../../../app/providers/AuthProvider';
import { API_BASE_URL } from '../../../shared/constants/config';

export interface DispositionData {
  disposition: string;
  notes?: string | null;
  callback_at?: string | null;
  reason?: string | null;
  plan_selected?: string | null;
  payment_id?: string | null;
  language_noted?: string | null;
  disposition_sub?: string | null;
  callback_sub?: string | null;
  feedback_stage?: string | null;
}

export interface SanCtiContextType {
  agentState: string;
  callState: string;
  extension: string;
  isOnBreak: boolean;
  breakName: string;
  isManualMode: boolean;
  isHeld: boolean;
  isMuted: boolean;
  callDuration: number;
  currentCallId: number | null;
  currentLeadId: number | string | null;
  currentPhoneNumber: string;
  currentLeadName: string;
  currentLeadTmid: string;
  currentLeadLocation: string;
  currentLeadCallStatus: string;
  isIncomingCall: boolean;
  isAcceptingIncoming: boolean;
  showDispositionForm: boolean;
  sanDispositionOptions: string[];
  login: () => void;
  goReady: () => void;
  dial: (phoneNumber: string, leadUserId: number | string, name?: string, tmid?: string, leadType?: string) => Promise<void>;
  hangup: () => void;
  toggleHold: () => void;
  toggleMute: () => void;
  acceptIncoming: () => void;
  logout: () => void;
  toggleManualMode: () => void;
  submitDisposition: (dispositionData: DispositionData) => Promise<any>;
  setShowDispositionForm: React.Dispatch<React.SetStateAction<boolean>>;
  startMockCall?: (leadName?: string, phoneNumber?: string, tmid?: string) => void;
}

export const SanCtiContext = createContext<SanCtiContextType | null>(null);

export function useSanCti() {
  const context = useContext(SanCtiContext);
  if (!context) {
    throw new Error('useSanCti must be used within a SanCtiProvider');
  }
  return context;
}

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
  const sanUsername = propSanUsername || user?.san_username || 'Agent2@Demo';
  const sanPassword = propSanPassword || user?.san_password || 'NzJTQ1JCa2hEa2FKNzRMWXNzYzg5Zz09';

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
  // Reactive mirror of acceptingIncomingRef — drives the iframe click-overlay
  // sizing/positioning below, which needs to re-render when this flips.
  const [isAcceptingIncoming, setIsAcceptingIncoming] = useState<boolean>(false);

  // ── Microphone & Iframe Loading states ──
  const isMicPermissionChecked = true;
  const [isIframeLoaded, setIsIframeLoaded] = useState<boolean>(false);
  // Widget stays minimized (90px header bar only) by default — the agent
  // answers/dials from the CRM's own buttons via acceptIncoming()/dial(),
  // not by clicking inside SAN's iframe, so there's no need to ever expand
  // it automatically.
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
  // Guard: set to true when agent clicks "Accept". Blocks all state-resetting
  // SAN events (Ready, SavePage) for up to 8 s while the SIP handshake completes.
  // Cleared immediately when SANAppIncomingEvent(Answer) fires.
  const acceptingIncomingRef = useRef<boolean>(false);
  const acceptingIncomingTimerRef = useRef<any>(null);
  // Ref to hold the active incoming call payload to pass during IncAccept
  const activeIncomingPayloadRef = useRef<any>(null);

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
    postToSan({
      type: 'login',
      user_name: sanUsername,
      password: sanPassword,
      uniqueId: '',
    });
  }, [sanUsername, sanPassword, postToSan]);

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

    // 1. Tell SAN to dial
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
   * Toggle hold.
   *
   * SAN's own HoldCall/UnholdCall handler calls a function (HoldUnhold)
   * that's commented out in their hosted script — confirmed by reading
   * their source directly. There's no message we can send that reaches a
   * working hold implementation on their end. The closest approximation we
   * can do entirely from our own UI is the same mechanism Mute already
   * uses (MuteCall/UnmuteCall, which IS a real, working function on their
   * side): it silences the agent's outgoing audio. It's not a true two-way
   * SIP hold (the caller hears silence, not hold music, and still hears
   * nothing from the agent — same as Mute), so isHeld and isMuted are kept
   * in lockstep here to avoid the two controls disagreeing about whether
   * the mic is live.
   */
  const toggleHold = useCallback(() => {
    if (isHeld) {
      postToSan({ type: 'UnmuteCall' });
    } else {
      postToSan({ type: 'MuteCall' });
    }
    setIsHeld(prev => !prev);
    setIsMuted(prev => !prev);
  }, [isHeld, postToSan]);

  /**
   * Toggle mute. Kept in lockstep with isHeld — see toggleHold comment.
   */
  const toggleMute = useCallback(() => {
    if (isMuted) {
      postToSan({ type: 'UnmuteCall' });
    } else {
      postToSan({ type: 'MuteCall' });
    }
    setIsMuted(prev => !prev);
    setIsHeld(prev => !prev);
  }, [isMuted, postToSan]);

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
    setIsIncomingCall(false);
    setUserInitiatedHangup(false);
    // Reset dial guard so next call starts clean
    hasDialedThisSession.current = false;

    return result;
    // callDuration intentionally omitted — use callDurationRef.current instead
  }, [postToSan, apiCall, currentCallId, currentLeadId, currentPhoneNumber, isIncomingCall, sanDispositionOptions]);

  // ═══════════════════════════════════════════════════════════
  // SAN EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    function handleSanEvent(event: MessageEvent) {
      const { type, payload } = event.data || {};
      if (!type) return;
      console.log('[SAN RECV]', type, payload);

      switch (type) {
        // ── INIT: Agent logged into SAN ──
        case 'SANAppInitEvent':
          setExtension(payload?.login_extension_no || payload?.exten || '');
          switch (payload?.status) {
            case '1': // Logged in, needs to click Ready
              setAgentState('logged_in');
              apiCall('POST', '/cti/status', { status: 'logged_in' });
              // Automatically make agent ready
              postToSan({ type: 'ready' });
              break;
            case '3': // Already idle/ready
              setAgentState('ready');
              apiCall('POST', '/cti/status', { status: 'ready' });
              // Automatically enable manual dial mode to allow dialing
              postToSan({ type: 'ManualOn' });
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
                // Automatically enable manual dial mode
                postToSan({ type: 'ManualOn' });
              }
              break;
          }
          break;

        // ── READY: Agent is now live ──
        case 'SANAppReadyEvent':
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
              // Only enable manual mode when truly idle (not mid-call)
              postToSan({ type: 'ManualOn' });
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
        case 'SANAppHoldEvent':
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
          }
          break;
        }

        // ── LOGOUT ──
        case 'SANAppLogoutEvent':
          setAgentState('logged_out');
          setCallState('idle');
          setExtension(payload?.exten || '');
          break;

        // ── SAN SENDS DISPOSITION OPTIONS ──
        case 'SEND_DISPOSITION':
          if (Array.isArray(payload)) {
            setSanDispositionOptions(payload.map((d: any) => d.disposition));
          }
          break;
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
      'SEND_DISPOSITION',
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
    login();

    let attempts = 1;
    const retryTimer = setInterval(() => {
      if (agentStateRef.current !== 'logged_out' || attempts >= 5) {
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
          Mounts only after the mic permission check finishes so that the iframe's
          SIP engine doesn't attempt registration before mic access is determined.

          Fully invisible (parked off-screen) at all times except while an
          incoming call is ringing — it then slides on-screen so the agent
          can click SAN's own native Answer button directly: a real, trusted
          click inside SAN's own document, not a postMessage from outside it.
          The iframe's own rendered SIZE never changes (always 320x440) —
          only its on-screen POSITION toggles. Resizing it (even just
          shrinking the visible area) has repeatedly broken SAN's internal
          call handling in earlier testing; moving it off-screen leaves its
          actual layout/rendering completely undisturbed, which is what
          keeps its SIP session alive in the background while hidden. The
          agent can also bring it on-screen manually via the +/− button.
      ──────────────────────────────────────────────────────────────── */}
      {isMicPermissionChecked && (() => {
        // Visible only while an incoming call is ringing (plus whenever the
        // agent manually shows it via +/−) — invisible the rest of the
        // time, including during connected calls, since Hold/Mute now both
        // go through postToSan's MuteCall/UnmuteCall from our own buttons
        // and don't need SAN's real UI to be on-screen.
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
            <span style={{ fontSize: 12, fontWeight: 700, color: '#F3F4F6' }}>
              SAN Softphone — {agentState}
            </span>
            <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
              {/* No Logout button: SAN's own init.js logOut() unconditionally
                  reads currentAgent.name off its internal state and throws
                  if that was never populated (e.g. login never completed) —
                  a bug in their script we can't fix from here. Ending the
                  session by navigating away/refreshing is the safe path. */}
              <button
                onClick={() => setIsCtiMinimized(!isCtiMinimized)}
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: 4,
                  border: '1px solid #4B5563',
                  backgroundColor: '#374151',
                  color: '#fff',
                  fontSize: 14,
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                title={isCtiMinimized ? 'Show' : 'Hide'}
              >
                {isCtiMinimized ? '+' : '−'}
              </button>
            </div>
          </div>

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
