import React, { createContext, useContext, useRef, useState, useEffect, useCallback } from 'react';
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
  showDispositionForm: boolean;
  sanDispositionOptions: string[];
  login: () => void;
  goReady: () => void;
  dial: (phoneNumber: string, leadUserId: number | string, name?: string, tmid?: string) => Promise<void>;
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

  // Resolve credentials from Auth Context if not provided as props
  const bearerToken = propBearerToken || user?.token || '';
  const agentId = propAgentId || user?.id || 0;
  const sanUsername = propSanUsername || user?.san_username || 'Agent2@Demo';
  const sanPassword = propSanPassword || user?.san_password || 'NzJTQ1JCa2hEa2FKNzRMWXNzYzg5Zz09';

  // ── Agent State ──
  const [agentState, setAgentState] = useState<string>('logged_out');
  // logged_out → logged_in → ready (idle) → on_call → disposition_pending → ready
  const [extension, setExtension] = useState<string>('');
  const [isOnBreak, setIsOnBreak] = useState<boolean>(false);
  const [breakName, setBreakName] = useState<string>('');
  const [isManualMode, setIsManualMode] = useState<boolean>(false);

  // ── Call State ──
  const [callState, setCallState] = useState<string>('idle');
  // idle → dialing → ringing → connected → hangup → disposition_pending → idle
  const [currentCallId, setCurrentCallId] = useState<number | null>(null);
  const [currentLeadId, setCurrentLeadId] = useState<number | string | null>(null);
  const [currentPhoneNumber, setCurrentPhoneNumber] = useState<string>('');
  const [currentLeadName, setCurrentLeadName] = useState<string>('');
  const [currentLeadTmid, setCurrentLeadTmid] = useState<string>('');
  const [callDuration, setCallDuration] = useState<number>(0);
  const [isHeld, setIsHeld] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // ── Disposition ──
  const [showDispositionForm, setShowDispositionForm] = useState<boolean>(false);
  const [sanDispositionOptions, setSanDispositionOptions] = useState<string[]>([]);

  // ── Timer ──
  const timerRef = useRef<any>(null);

  // ── Minimization State ──
  const [_isCtiMinimized, _setIsCtiMinimized] = useState<boolean>(false);

  // ── Manual Call Ending Tracking ──
  const [userInitiatedHangup, setUserInitiatedHangup] = useState<boolean>(false);

  // ── Guard: only show disposition if an outgoing dial happened in this session ──
  // This prevents the modal from appearing on page load, route change, or SAN reconnection
  const hasDialedThisSession = useRef<boolean>(false);

  // ── Helper: post to SAN iframe ──
  const postToSan = useCallback((data: any) => {
    const iframe = iframeRef.current;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(data, '*');
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
      uniqueId: String(agentId),
    });
  }, [sanUsername, sanPassword, agentId, postToSan]);

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
   * @param {number|string} leadUserId  - users.id of the driver being called
   * @param {string} [name] - Driver's name
   * @param {string} [tmid] - Driver's unique ID
   */
  const dial = useCallback(async (phoneNumber: string, leadUserId: number | string, name?: string, tmid?: string) => {
    if (callState !== 'idle') {
      console.warn('[SAN CTI] Cannot dial — already in a call state:', callState);
      return;
    }

    setCurrentPhoneNumber(phoneNumber);
    setCurrentLeadId(leadUserId);
    setCurrentLeadName(name || '');
    setCurrentLeadTmid(tmid || '');
    setCallState('dialing');
    setUserInitiatedHangup(false);
    // Mark that the agent has actively dialed in this session — enables disposition modal on hangup
    hasDialedThisSession.current = true;

    // 1. Tell SAN to dial
    postToSan({
      type: 'dial',
      number: phoneNumber,
      uniqueId: String(leadUserId),
    });

    // 2. Tell Laravel: call started
    const result = await apiCall('POST', '/call/initiate', {
      user_id: Number(leadUserId),
      phone_number: phoneNumber,
      san_session_id: `SAN_${Date.now()}_${agentId}`,
    });

    if (result?.data?.call_id) {
      setCurrentCallId(result.data.call_id);
    }
  }, [callState, postToSan, apiCall, agentId]);

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
    if (currentCallId === -999) {
      stopTimer();
      setCallState('disposition_pending');
      setShowDispositionForm(true);
    } else {
      postToSan({ type: 'Hangup' });
      stopTimer();
    }
  }, [currentCallId, postToSan, stopTimer]);

  /**
   * Toggle hold.
   */
  const toggleHold = useCallback(() => {
    if (isHeld) {
      postToSan({ type: 'UnholdCall' });
    } else {
      postToSan({ type: 'HoldCall' });
    }
    setIsHeld(prev => !prev);
  }, [isHeld, postToSan]);

  /**
   * Toggle mute.
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
   * Accept incoming call.
   */
  const acceptIncoming = useCallback(() => {
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
    // 1. Send to SAN iframe
    if (currentCallId !== -999) {
      postToSan({
        type: 'SubmitDisposition',
        disposition: dispositionData.disposition,
        remark: dispositionData.notes || '',
        phone_number: currentPhoneNumber,
      });
    }

    // 2. Send to Laravel — full disposition with cascade
    let result;
    if (currentCallId === -999) {
      result = { success: true, message: 'Mock disposition saved' };
    } else {
      result = await apiCall('POST', '/call/disposition', {
        call_id: currentCallId,
        user_id: currentLeadId,
        disposition: dispositionData.disposition,
        plan_selected: dispositionData.plan_selected || null,
        payment_id: dispositionData.payment_id || null,
        callback_at: dispositionData.callback_at || null,
        reason: dispositionData.reason || null,
        notes: dispositionData.notes || null,
        language_noted: dispositionData.language_noted || null,
        call_duration: callDuration,
      });
    }

    // 3. Reset call state
    setShowDispositionForm(false);
    setCallState('idle');
    setCurrentCallId(null);
    setCurrentLeadId(null);
    setCurrentPhoneNumber('');
    setCallDuration(0);
    setIsHeld(false);
    setIsMuted(false);
    setUserInitiatedHangup(false);
    // Reset dial guard so next call starts clean
    hasDialedThisSession.current = false;

    return result;
  }, [postToSan, apiCall, currentCallId, currentLeadId, currentPhoneNumber, callDuration]);

  // ═══════════════════════════════════════════════════════════
  // SAN EVENT LISTENERS
  // ═══════════════════════════════════════════════════════════

  useEffect(() => {
    function handleSanEvent(event: MessageEvent) {
      const { type, payload } = event.data || {};
      if (!type) return;

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
          setCallState('idle');
          apiCall('POST', '/cti/status', { status: 'ready' });
          // Automatically enable manual dial mode to allow dialing
          postToSan({ type: 'ManualOn' });
          break;

        // ── OUTGOING CALL: State changes during our outbound call ──
        case 'SANAppOutgoingEvent': {
          const extenStatus = payload?.exten_status;
          setExtension(payload?.exten || '');

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
            const finalDuration = callDuration;
            const wasConnected = callState === 'connected';
            const wasInCall = callState === 'dialing' || callState === 'ringing' || callState === 'connected';
            // Only show disposition if we actually initiated a dial in this browser session and were in a call
            const shouldShowDisposition = wasInCall && hasDialedThisSession.current && (wasConnected || userInitiatedHangup);

            // Update Laravel: call ended
            if (currentCallId && currentCallId !== -999) {
              apiCall('POST', '/call/update', {
                call_id: currentCallId,
                event: 'hangup',
                call_status: finalDuration > 0 ? 'connected' : 'no_answer',
                call_duration: finalDuration,
              });
            }

            if (shouldShowDisposition) {
              setCallState('disposition_pending');
              setShowDispositionForm(true);
            } else {
              // Return directly to idle state (no call was made or no active state)
              setCallState('idle');
              setAgentState('ready');
              setCurrentCallId(null);
              setCurrentLeadId(null);
              setCurrentPhoneNumber('');
              setCallDuration(0);
            }
          }
          break;
        }

        // ── INCOMING CALL ──
        case 'SANAppIncomingEvent': {
          const status = payload?.exten_status;
          setExtension(payload?.exten || '');

          if (status === 'Ringing') {
            setCallState('incoming_ringing');
            setAgentState('on_call');
          } else if (status === 'Answer') {
            setCallState('connected');
            startTimer();
          } else if (status === 'Hangup') {
            stopTimer();
            const wasInCall = callState === 'incoming_ringing' || callState === 'connected';
            if (wasInCall && payload?.answer_time && payload?.disposition === 'ANSWER') {
              setCallState('disposition_pending');
              setShowDispositionForm(true);
            } else {
              setCallState('idle');
              setAgentState('ready');
            }
          }
          break;
        }

        // ── HOLD ──
        case 'SANAppHoldEvent':
          setIsHeld(payload?.hold === 1 || payload?.set === '1' || payload?.set === 1);
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

        // ── DISPOSITION SAVED IN SAN ──
        case 'SANAppSavePageEvent':
          setExtension(payload?.exten || '');
          setCallState('idle');
          setAgentState('ready');
          setShowDispositionForm(false);
          setCurrentCallId(null);
          setCurrentLeadId(null);
          setCurrentPhoneNumber('');
          setCallDuration(0);
          setIsHeld(false);
          setIsMuted(false);
          break;

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

    window.addEventListener('message', handleSanEvent);
    return () => window.removeEventListener('message', handleSanEvent);
  }, [apiCall, startTimer, stopTimer, currentCallId, callDuration, callState, userInitiatedHangup, postToSan]);

  // ── Auto-login on mount ──
  useEffect(() => {
    if (!sanUsername) return;
    const timer = setTimeout(() => {
      console.log('[SAN CTI] Performing initial login...');
      login();
    }, 2000);
    return () => clearTimeout(timer);
  }, [login, sanUsername]);

  // ── Expose global dial function for lead cards ──
  useEffect(() => {
    (window as any)._sanDial = (phoneNumber: string, leadUserId: number | string, name?: string, tmid?: string) => {
      dial(phoneNumber, leadUserId, name, tmid);
    };
    return () => { delete (window as any)._sanDial; };
  }, [dial]);

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

      {/* ── SAN Softphone Iframe Container (Hidden) ── */}
      <div style={{
        position: 'fixed',
        width: 0,
        height: 0,
        opacity: 0,
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: -9999,
      }}>
        {/* Softphone Iframe */}
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
        />
      </div>
    </SanCtiContext.Provider>
  );
}
