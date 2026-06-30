import React from 'react';
import { useSanCti } from './SanCtiProvider';

interface CallControlBarProps {
  driverName?: string;
}

/**
 * Floating call control bar — bottom-right of screen.
 * Only visible when callState !== 'idle'.
 */
export default function CallControlBar({ driverName }: CallControlBarProps) {
  const {
    callState,
    callDuration,
    isHeld,
    isMuted,
    hangup,
    toggleHold,
    toggleMute,
    currentPhoneNumber,
    currentLeadName,
    isIncomingCall,
  } = useSanCti();

  const activeName = driverName || currentLeadName || currentPhoneNumber || 'Unknown';

  if (callState === 'idle' || callState === 'disposition_pending') return null;

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  interface StateConfigItem {
    dot: string;
    pulse: boolean;
    label: string;
    showTimer: boolean;
  }

  const stateConfig: Record<string, StateConfigItem> = {
    dialing:          { dot: '#FCD34D', pulse: true,  label: 'Dialing...',    showTimer: false },
    ringing:          { dot: '#FCD34D', pulse: true,  label: 'Ringing...',    showTimer: false },
    connected:        { dot: '#22C55E', pulse: false, label: 'Connected',     showTimer: true },
    incoming_ringing: { dot: '#3B82F6', pulse: true,  label: 'Incoming Call', showTimer: false },
  };

  const cfg = stateConfig[callState] || stateConfig.dialing;

  return (
    <div style={{
      position: 'fixed',
      bottom: 24,
      right: 24,
      backgroundColor: '#1F2937',
      borderRadius: 16,
      padding: '12px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: 16,
      boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
      zIndex: 9999,
      color: '#fff',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      minWidth: 320,
    }}>
      {/* Status dot */}
      <div style={{
        width: 12, height: 12, borderRadius: '50%',
        backgroundColor: cfg.dot,
        animation: cfg.pulse ? 'pulse 1.5s infinite' : 'none',
        flexShrink: 0,
      }} />

      {/* Caller name + status */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {isIncomingCall && (
            <span style={{
              fontSize: 10, fontWeight: 700, backgroundColor: '#3B82F6',
              color: '#fff', borderRadius: 4, padding: '1px 5px', letterSpacing: '0.5px',
              flexShrink: 0,
            }}>
              INCOMING
            </span>
          )}
          <div style={{ fontSize: 14, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
            {activeName}
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#9CA3AF', marginTop: 1 }}>
          {cfg.label} {cfg.showTimer && `— ${formatTime(callDuration)}`}
          {currentPhoneNumber && activeName !== currentPhoneNumber && (
            <span style={{ marginLeft: 6, color: '#6B7280' }}>· {currentPhoneNumber}</span>
          )}
        </div>
      </div>

      {/* Call controls */}
      <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
        {/* No Answer button: the SAN widget auto-expands to full size while
            incoming_ringing specifically so the agent answers with a real
            click on SAN's own native button — the only path that reliably
            carries two-way audio. A postMessage-only Answer button here
            would either replace that (losing the real click) or fire
            alongside it (a double-answer that corrupts the call setup). */}
        {callState === 'incoming_ringing' && (
          <span style={{
            fontSize: 12,
            fontWeight: 600,
            color: '#FCD34D',
            whiteSpace: 'nowrap',
          }}>
            👈 Answer from the SAN Softphone widget
          </span>
        )}

        {callState === 'connected' && (
          <>
            <button onClick={toggleHold} style={{
              ...btnStyle,
              backgroundColor: isHeld ? '#F59E0B' : '#374151',
            }}>
              {isHeld ? 'Resume' : 'Hold'}
            </button>
            <button onClick={toggleMute} style={{
              ...btnStyle,
              backgroundColor: isMuted ? '#EF4444' : '#374151',
            }}>
              {isMuted ? 'Unmute' : 'Mute'}
            </button>
          </>
        )}

        <button onClick={hangup} style={{
          ...btnStyle, backgroundColor: '#EF4444'
        }}>
          Hangup
        </button>
      </div>

      {/* Pulse animation */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
}

const btnStyle: React.CSSProperties = {
  border: 'none',
  borderRadius: 8,
  padding: '6px 14px',
  color: '#fff',
  fontSize: 13,
  fontWeight: 500,
  cursor: 'pointer',
};
