import React, { createContext, useContext, useState, useEffect } from 'react';
import { useInitiateIvrCallMutation } from '../../services/api/ctiApi';

export interface WhatsAppMessage {
  id: string;
  sender: 'caller' | 'lead';
  text: string;
  timestamp: string;
  status: 'sent' | 'read';
  templateLabel?: string;
}

export interface WhatsAppChat {
  id: string; // TMID or phone number
  name: string;
  phone: string;
  tmid: string;
  roleContext: string;
  isMinimized: boolean;
  messages: WhatsAppMessage[];
}

export interface CallingKeypadState {
  isOpen: boolean;
  name: string;
  phone: string;
  tmid: string;
  contextLine?: string; // e.g. "For: JD-12034 — Sharma Logistics"
  roleContext: string;
  callStatus: 'dialing' | 'ringing' | 'connected' | 'wrapup' | 'idle';
  isMuted: boolean;
  isSpeakerActive: boolean;
  secondsElapsed: number;
  dtmfTones: string;
  ivrCallId?: number;
}

interface GlobalOverlaysContextType {
  activeChats: WhatsAppChat[];
  callingState: CallingKeypadState;
  openWhatsApp: (name: string, phone: string, tmid: string, role: string) => void;
  closeWhatsApp: (id: string) => void;
  minimizeWhatsApp: (id: string, minimize: boolean) => void;
  sendWhatsAppMessage: (chatId: string, text: string, templateLabel?: string) => void;
  startCall: (name: string, phone: string, tmid: string, role: string, contextLine?: string) => void;
  cancelCall: () => void;
  hangUpCall: () => void;
  toggleMute: () => void;
  toggleSpeaker: () => void;
  sendDtmf: (digit: string) => void;
}

const GlobalOverlaysContext = createContext<GlobalOverlaysContextType | undefined>(undefined);

export const GlobalOverlaysProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeChats, setActiveChats] = useState<WhatsAppChat[]>([]);
  const [initiateIvrCall] = useInitiateIvrCallMutation();
  const [callingState, setCallingState] = useState<CallingKeypadState>({
    isOpen: false,
    name: '',
    phone: '',
    tmid: '',
    roleContext: 'dw',
    callStatus: 'idle',
    isMuted: false,
    isSpeakerActive: false,
    secondsElapsed: 0,
    dtmfTones: '',
    ivrCallId: undefined,
  });

  // Call timer ticking when connected
  useEffect(() => {
    let interval: any = null;
    if (callingState.callStatus === 'connected') {
      interval = setInterval(() => {
        setCallingState(prev => ({
          ...prev,
          secondsElapsed: prev.secondsElapsed + 1,
        }));
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [callingState.callStatus]);

  const openWhatsApp = (name: string, phone: string, tmid: string, role: string) => {
    setActiveChats(prev => {
      // Check if already open
      const existingIdx = prev.findIndex(c => c.id === tmid || c.phone === phone);
      if (existingIdx !== -1) {
        // Bring to front (unminimize)
        return prev.map((c, idx) =>
          idx === existingIdx ? { ...c, isMinimized: false } : c
        );
      }

      const newChat: WhatsAppChat = {
        id: tmid || phone,
        name,
        phone,
        tmid,
        roleContext: role,
        isMinimized: false,
        messages: [
          {
            id: 'init_' + Date.now(),
            sender: 'lead',
            text: `Hi, this is ${name}. Connecting via WhatsApp.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'read'
          }
        ]
      };

      // Keep max 3 chats, if 4th opened, remove the oldest one
      const updated = [...prev, newChat];
      if (updated.length > 3) {
        updated.shift();
      }
      return updated;
    });
  };

  const closeWhatsApp = (id: string) => {
    setActiveChats(prev => prev.filter(c => c.id !== id));
  };

  const minimizeWhatsApp = (id: string, minimize: boolean) => {
    setActiveChats(prev =>
      prev.map(c => (c.id === id ? { ...c, isMinimized: minimize } : c))
    );
  };

  const sendWhatsAppMessage = (chatId: string, text: string, templateLabel?: string) => {
    setActiveChats(prev =>
      prev.map(c => {
        if (c.id === chatId) {
          const newMsg: WhatsAppMessage = {
            id: 'msg_' + Date.now(),
            sender: 'caller',
            text,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            status: 'sent',
            templateLabel
          };
          
          // Log template trigger or message send in Call History timeline (simulate auto-log)
          console.log(`[Auto-logged WhatsApp] To: ${c.name} (${c.phone}) - Msg: ${text} (${templateLabel || 'Free Text'})`);

          // Simulate automatic reply after 3 seconds for active feel
          setTimeout(() => {
            setActiveChats(currentChats =>
              currentChats.map(item => {
                if (item.id === chatId) {
                  // Mark sent msg as read (double blue ticks)
                  const updatedMsgs = item.messages.map(m =>
                    m.id === newMsg.id ? { ...m, status: 'read' as const } : m
                  );
                  return {
                    ...item,
                    messages: [
                      ...updatedMsgs,
                      {
                        id: 'reply_' + Date.now(),
                        sender: 'lead',
                        text: `Thank you. I have received your message regarding: ${templateLabel || 'details'}.`,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                        status: 'read'
                      }
                    ]
                  };
                }
                return item;
              })
            );
          }, 3000);

          return {
            ...c,
            messages: [...c.messages, newMsg]
          };
        }
        return c;
      })
    );
  };

  const startCall = (name: string, phone: string, tmid: string, role: string, contextLine?: string) => {
    setCallingState({
      isOpen: true,
      name,
      phone,
      tmid,
      contextLine,
      roleContext: role,
      callStatus: 'dialing',
      isMuted: false,
      isSpeakerActive: false,
      secondsElapsed: 0,
      dtmfTones: '',
      ivrCallId: undefined,
    });

    // Invoke API call to backend to store the call initiation record
    const numericLeadId = parseInt(tmid.replace(/\D/g, ''), 10) || null;
    initiateIvrCall({
      user_id: numericLeadId,
      user_name: name,
      user_mobile: phone,
      user_tm_id: tmid,
      assigned_to: 1, // Will be overridden on Laravel backend by Auth::user()
      assigned_name: 'Demo Agent',
      assigned_number: '178',
      did_number: '4310735',
      process: role,
      call_type: 'web-ivr'
    }).unwrap()
      .then((res) => {
        const data = res.data;
        if (res.success && data) {
          console.log('[CTI] IVR Call initiated logged with ID:', data.id);
          setCallingState(prev => ({ ...prev, ivrCallId: data.id }));
        }
      })
      .catch((err) => {
        console.warn('[CTI] Failed to log IVR Call initiation (using mock fallback):', err);
        const mockCallId = Math.floor(Date.now() / 1000);
        setCallingState(prev => ({ ...prev, ivrCallId: mockCallId }));
      });

    // Simulate Ringing after 1.5 seconds
    setTimeout(() => {
      setCallingState(prev => {
        if (prev.callStatus === 'dialing') {
          return { ...prev, callStatus: 'ringing' };
        }
        return prev;
      });
    }, 1500);

    // Simulate Connected after 3.5 seconds
    setTimeout(() => {
      setCallingState(prev => {
        if (prev.callStatus === 'ringing') {
          return { ...prev, callStatus: 'connected' };
        }
        return prev;
      });
    }, 3500);
  };

  const cancelCall = () => {
    setCallingState(prev => ({
      ...prev,
      isOpen: false,
      callStatus: 'idle',
    }));
  };

  const hangUpCall = () => {
    setCallingState(prev => {
      const duration = prev.secondsElapsed;
      console.log(`[Auto-logged Outbound Call] To: ${prev.name} (${prev.phone}) - Duration: ${duration}s`);
      
      // Transition to wrapup stage
      return {
        ...prev,
        callStatus: 'wrapup',
      };
    });
  };

  const toggleMute = () => {
    setCallingState(prev => ({ ...prev, isMuted: !prev.isMuted }));
  };

  const toggleSpeaker = () => {
    setCallingState(prev => ({ ...prev, isSpeakerActive: !prev.isSpeakerActive }));
  };

  const sendDtmf = (digit: string) => {
    setCallingState(prev => ({
      ...prev,
      dtmfTones: prev.dtmfTones + digit,
    }));
  };

  // Attach global CTI Spec functions onto window for parent-child iframe communication
  useEffect(() => {
    // 1. Initial CTI SSO Event definition
    (window as any).SANAppInitEvent = (payload: any) => {
      console.log('---------------- CTI SSO INIT EVENT ----------------');
      console.log('Auth Details:', payload);
      console.log('----------------------------------------------------');
      
      // Auto-dialer can be registered using credentials
      alert(`[CTI SSO Initialized] User: ${payload.userName || 'Agent'} (${payload.userId})`);
    };

    // 2. CTI Option events logs
    (window as any).SANAppReadyEvent = (data: any) => {
      console.log('[CTI EVENT] SANAppReadyEvent triggered:', data);
    };

    (window as any).SANAppOutgoingEvent = (data: any) => {
      console.log('[CTI EVENT] SANAppOutgoingEvent triggered:', data);
    };

    (window as any).SANAppIncomingEvent = (data: any) => {
      console.log('[CTI EVENT] SANAppIncomingEvent triggered:', data);
    };

    (window as any).SANAppHoldEvent = (data: any) => {
      console.log('[CTI EVENT] SANAppHoldEvent triggered:', data);
    };

    (window as any).SANAppSavePageEvent = (data: any) => {
      console.log('[CTI EVENT] SANAppSavePageEvent triggered:', data);
    };

    (window as any).SANAppManualOnOffEvent = (data: any) => {
      console.log('[CTI EVENT] SANAppManualOnOffEvent triggered:', data);
    };

    (window as any).SANAppBreakEvent = (data: any) => {
      console.log('[CTI EVENT] SANAppBreakEvent triggered:', data);
    };

    (window as any).SANAppLogoutEvent = (data: any) => {
      console.log('[CTI EVENT] SANAppLogoutEvent triggered:', data);
    };

    (window as any).SANAppTransferEvent = (data: any) => {
      console.log('[CTI EVENT] SANAppTransferEvent triggered:', data);
    };

    (window as any).SANAppConferenceEvent = (data: any) => {
      console.log('[CTI EVENT] SANAppConferenceEvent triggered:', data);
    };

    // 3. Parent-Child iframe interaction buttons
    (window as any).sendToChild = (_context: any, action: string) => {
      console.log(`[CTI Window Command] sendToChild() called. Action: ${action}`);
      
      if (action === 'ready') {
        // Trigger Ready CTI status
        if (typeof (window as any).SANAppReadyEvent === 'function') {
          (window as any).SANAppReadyEvent({
            state: 3,
            agent_id: callingState.tmid || '178',
            name: callingState.name || 'Lokesh',
            process_id: '1',
            exten: '178'
          });
        }
        alert('CTI Status: Agent Marked READY');
      } else if (action === 'Hangup') {
        // Trigger Hangup
        hangUpCall();
      }
    };

    (window as any).toggleManualDial = () => {
      const isManual = !callingState.isMuted; // simulated manual state toggle
      console.log(`[CTI Window Command] toggleManualDial() called. Active: ${isManual}`);
      
      if (typeof (window as any).SANAppManualOnOffEvent === 'function') {
        (window as any).SANAppManualOnOffEvent({
          state: isManual ? 10 : 11,
          agent_id: '1',
          name: 'Lokesh',
          process_id: '1',
          exten: '178',
          team_leader: null,
          data: { acd_array: ['803'] }
        });
      }
      alert(`CTI Status: Manual Dial Mode ${isManual ? 'ON' : 'OFF'}`);
    };





    return () => {
      // Cleanup global bindings
      delete (window as any).SANAppInitEvent;
      delete (window as any).SANAppReadyEvent;
      delete (window as any).SANAppOutgoingEvent;
      delete (window as any).SANAppIncomingEvent;
      delete (window as any).SANAppHoldEvent;
      delete (window as any).SANAppSavePageEvent;
      delete (window as any).SANAppManualOnOffEvent;
      delete (window as any).SANAppBreakEvent;
      delete (window as any).SANAppLogoutEvent;
      delete (window as any).SANAppTransferEvent;
      delete (window as any).SANAppConferenceEvent;
      delete (window as any).sendToChild;
      delete (window as any).toggleManualDial;
      delete (window as any).dialAgentCall;
      delete (window as any).toggleHold;
      delete (window as any).toggleMute;
    };
  }, [callingState, toggleMute, toggleSpeaker, hangUpCall, startCall]);

  return (
    <GlobalOverlaysContext.Provider
      value={{
        activeChats,
        callingState,
        openWhatsApp,
        closeWhatsApp,
        minimizeWhatsApp,
        sendWhatsAppMessage,
        startCall,
        cancelCall,
        hangUpCall,
        toggleMute,
        toggleSpeaker,
        sendDtmf,
      }}
    >
      {children}
    </GlobalOverlaysContext.Provider>
  );
};

export const useGlobalOverlays = () => {
  const context = useContext(GlobalOverlaysContext);
  if (!context) {
    throw new Error('useGlobalOverlays must be used within a GlobalOverlaysProvider');
  }
  return context;
};
