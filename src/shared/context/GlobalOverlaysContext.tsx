import React, { createContext, useContext, useState, useEffect } from 'react';

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
  callStatus: 'dialing' | 'ringing' | 'connected' | 'idle';
  isMuted: boolean;
  isSpeakerActive: boolean;
  secondsElapsed: number;
  dtmfTones: string;
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
      
      // Close dialer
      return {
        ...prev,
        isOpen: false,
        callStatus: 'idle',
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
