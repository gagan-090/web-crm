import React, { useEffect, useState, useRef } from 'react';

interface FullscreenGuardProps {
  processLabel?: string;
}

/**
 * Proctored-exam-style fullscreen enforcement.
 *
 * While mounted, the workspace is only usable in browser fullscreen: whenever
 * the document is NOT fullscreen, an opaque, top-most overlay blocks every
 * interaction (including the softphone and disposition modal) until the agent
 * re-enters. Browsers cannot be prevented from exiting fullscreen (Esc always
 * works, by design), and entering fullscreen requires a user gesture — so the
 * guard works by instantly re-blocking on exit and offering the re-enter
 * button, exactly like web proctoring tools do. Exits are counted and shown
 * as violations.
 */
export const FullscreenGuard: React.FC<FullscreenGuardProps> = ({ processLabel = 'this process' }) => {
  const [isFullscreen, setIsFullscreen] = useState<boolean>(!!document.fullscreenElement);
  const [violations, setViolations] = useState<number>(0);
  const [error, setError] = useState<string>('');
  // Distinguishes a real mid-session exit (violation) from the initial
  // not-yet-entered state on page load / refresh.
  const wasFullscreenRef = useRef<boolean>(!!document.fullscreenElement);

  useEffect(() => {
    const onChange = () => {
      const active = !!document.fullscreenElement;
      setIsFullscreen(active);
      if (!active && wasFullscreenRef.current) {
        setViolations(v => v + 1);
      }
      wasFullscreenRef.current = active;
    };
    document.addEventListener('fullscreenchange', onChange);
    return () => document.removeEventListener('fullscreenchange', onChange);
  }, []);

  const enterFullscreen = () => {
    setError('');
    document.documentElement.requestFullscreen({ navigationUI: 'hide' } as FullscreenOptions)
      .catch(() => {
        setError('Your browser blocked the fullscreen request — click the button again, or press F11.');
      });
  };

  if (isFullscreen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        // Above everything — SAN softphone panel (9999), CallControlBar (9999)
        // and the disposition modal (10000) included. Strict means strict.
        zIndex: 100000,
        backgroundColor: '#0F172A',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: 20,
        color: '#F1F5F9',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        textAlign: 'center',
        padding: 24,
      }}
    >
      <span
        className="material-symbols-outlined"
        style={{ fontSize: 64, color: '#818CF8' }}
      >
        fullscreen
      </span>

      <div>
        <h2 style={{ margin: 0, fontSize: 22, fontWeight: 800 }}>
          Full Screen Required
        </h2>
        <p style={{ margin: '10px auto 0', fontSize: 13, color: '#94A3B8', maxWidth: 420, lineHeight: 1.6 }}>
          {processLabel} runs in strict full-screen mode — like a proctored
          exam. Work is paused until you return to full screen.
        </p>
      </div>

      {violations > 0 && (
        <div style={{
          fontSize: 12,
          fontWeight: 700,
          color: '#FCA5A5',
          backgroundColor: 'rgba(239, 68, 68, 0.12)',
          border: '1px solid rgba(239, 68, 68, 0.4)',
          borderRadius: 8,
          padding: '6px 14px',
        }}>
          ⚠ You have exited full screen {violations} time{violations > 1 ? 's' : ''} — this is being monitored.
        </div>
      )}

      <button
        onClick={enterFullscreen}
        style={{
          padding: '14px 34px',
          borderRadius: 12,
          border: 'none',
          backgroundColor: '#4F46E5',
          color: '#fff',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 8px 24px rgba(79, 70, 229, 0.4)',
        }}
      >
        Enter Full Screen & Continue
      </button>

      {error && (
        <p style={{ margin: 0, fontSize: 12, color: '#FCD34D', maxWidth: 380 }}>{error}</p>
      )}

      <p style={{ margin: 0, fontSize: 11, color: '#475569' }}>
        Pressing Esc or leaving full screen pauses your workspace immediately.
      </p>
    </div>
  );
};

export default FullscreenGuard;
