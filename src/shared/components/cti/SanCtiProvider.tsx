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
}

const SanCtiContext = createContext<SanCtiContextType | null>(null);

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
  const sanUsername = propSanUsername || user?.san_username || '';
  const sanPassword = propSanPassword || user?.san_password || '';

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
  const [isCtiMinimized, setIsCtiMinimized] = useState<boolean>(false);

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
    // Laravel: record CTI login + attendance
    apiCall('POST', '/cti/login');
  }, [sanUsername, sanPassword, agentId, postToSan, apiCall]);

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

  /**
   * Hangup. Called from the CallControlBar.
   */
  const hangup = useCallback(() => {
    postToSan({ type: 'Hangup' });
    stopTimer();
  }, [postToSan, stopTimer]);

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
    postToSan({
      type: 'SubmitDisposition',
      disposition: dispositionData.disposition,
      remark: dispositionData.notes || '',
      phone_number: currentPhoneNumber,
    });

    // 2. Send to Laravel — full disposition with cascade
    const result = await apiCall('POST', '/call/disposition', {
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

    // 3. Reset call state
    setShowDispositionForm(false);
    setCallState('idle');
    setCurrentCallId(null);
    setCurrentLeadId(null);
    setCurrentPhoneNumber('');
    setCallDuration(0);
    setIsHeld(false);
    setIsMuted(false);

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
              break;
            case '3': // Already idle/ready
              setAgentState('ready');
              apiCall('POST', '/cti/status', { status: 'ready' });
              break;
            case '4': // On break
              setAgentState('ready');
              setIsOnBreak(true);
              break;
            case '5': // Disposition pending
              setShowDispositionForm(true);
              setCallState('disposition_pending');
              break;
            case '10':
            case '11':
              setIsManualMode(payload?.status === '10');
              setAgentState('ready');
              break;
          }
          break;

        // ── READY: Agent is now live ──
        case 'SANAppReadyEvent':
          setExtension(payload?.exten || '');
          setAgentState('ready');
          setCallState('idle');
          apiCall('POST', '/cti/status', { status: 'ready' });
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

            // Update Laravel: call ended
            if (currentCallId) {
              apiCall('POST', '/call/update', {
                call_id: currentCallId,
                event: 'hangup',
                call_status: finalDuration > 0 ? 'connected' : 'no_answer',
                call_duration: finalDuration,
              });
            }

            // Show disposition form only if call was connected
            if (finalDuration > 0) {
              setCallState('disposition_pending');
              setShowDispositionForm(true);
            } else {
              // No answer / busy — auto-disposition
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
            if (payload?.answer_time && payload?.disposition === 'ANSWER') {
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
  }, [apiCall, startTimer, stopTimer, currentCallId, callDuration]);

  // ── Auto-login on mount ──
  useEffect(() => {
    if (!sanUsername) return;
    // Small delay to let iframe load
    const timer = setTimeout(() => {
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
  };

  return (
    <SanCtiContext.Provider value={value}>
      {children}

      {/* ── SAN Softphone Iframe Container ── */}
      <div style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 9998,
        width: 320,
        backgroundColor: '#fff',
        borderRadius: 12,
        boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
        border: '1px solid #E5E7EB',
        padding: 4,
        boxSizing: 'border-box',
        transition: 'all 0.3s ease',
      }}>
        {/* Toggle Button */}
        <button
          onClick={() => setIsCtiMinimized(prev => !prev)}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 10000,
            background: 'rgba(255, 255, 255, 0.95)',
            border: '1px solid #D1D5DB',
            borderRadius: 4,
            width: 24,
            height: 24,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 'bold',
            color: '#374151',
          }}
          title={isCtiMinimized ? 'Maximize Softphone' : 'Minimize Softphone'}
        >
          {isCtiMinimized ? '+' : '−'}
        </button>

        {/* Softphone Iframe */}
        <iframe
          ref={iframeRef}
          id="childIframe"
          src="https://ccsslb.sansoftwares.com/callerMini"
          allow="microphone; camera"
          style={{
            width: '100%',
            height: isCtiMinimized ? 32 : 400,
            borderRadius: 8,
            border: 'none',
            transition: 'height 0.3s ease',
            display: 'block',
          }}
          title="SAN CTI"
        />
      </div>
    </SanCtiContext.Provider>
  );
}
