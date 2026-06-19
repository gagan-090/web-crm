import React, { useState, useEffect, useRef } from 'react';
import { useGlobalOverlays } from '../../context/GlobalOverlaysContext';

const ROLE_ACCENTS: Record<string, string> = {
  dw: '#27AE60', // green
  wct: '#FB641B', // orange
  mm: '#8E44AD', // purple
  sc: '#1abc9c', // teal
  th: '#475569',
  tl: '#475569',
  hr: '#475569',
  admin: '#2980b9',
};

export const GlobalCallingKeypadModal: React.FC = () => {
  const { callingState, hangUpCall, cancelCall, toggleMute, toggleSpeaker, sendDtmf } = useGlobalOverlays();
  
  const [showKeypad, setShowKeypad] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Dragging states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button')) return; // ignore buttons
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y
    };
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return;
      
      let newX = e.clientX - dragStartRef.current.x;
      let newY = e.clientY - dragStartRef.current.y;

      // Keep overlays within screen bounds roughly
      newX = Math.max(-window.innerWidth + 200, Math.min(newX, 100));
      newY = Math.max(-window.innerHeight + 100, Math.min(newY, 100));

      setPosition({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  // Formatter for elapsed seconds: MM:SS
  const formatTimer = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
    const secs = (totalSeconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  if (!callingState.isOpen || callingState.callStatus === 'idle') {
    return null;
  }

  const roleAccent = ROLE_ACCENTS[callingState.roleContext.toLowerCase()] || '#475569';

  const handleHangUp = () => {
    const duration = formatTimer(callingState.secondsElapsed);
    hangUpCall();
    
    // Display brief call completion toast
    setToastMessage(`Call ended — ${duration}`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDtmfClick = (digit: string) => {
    sendDtmf(digit);
    // Play a simulated dial beep in console
    console.log(`[DTMF Beep] Sent digit: ${digit}`);
  };

  const keypadDigits = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <>
      {/* Toast Alert when call ends */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          {toastMessage}
        </div>
      )}

      <div
        ref={containerRef}
        style={{
          transform: `translate(${position.x}px, ${position.y}px)`,
          bottom: '80px',
          right: '80px',
        }}
        className="fixed w-[320px] bg-white rounded-lg shadow-2xl flex flex-col overflow-hidden z-50 border border-gray-250 select-none animate-slide-up"
      >
        {/* Accent Bar */}
        <div style={{ backgroundColor: roleAccent }} className="h-1.5 w-full shrink-0" />

        {/* Header (Reposition handle) */}
        <div
          onMouseDown={handleHeaderMouseDown}
          className="p-3 flex justify-between items-start cursor-move border-b border-gray-100 bg-gray-50/50"
        >
          <div>
            <div className="flex items-center gap-1">
              <h4 className="font-extrabold text-xs text-gray-850 truncate max-w-[170px]">
                {callingState.name}
              </h4>
              {callingState.tmid && (
                <span className="font-mono text-[9px] bg-gray-200 text-gray-700 px-1 rounded font-bold uppercase">
                  {callingState.tmid}
                </span>
              )}
            </div>
            {callingState.contextLine && (
              <p className="text-[9.5px] text-[#8E44AD] font-bold mt-0.5 leading-tight">
                {callingState.contextLine}
              </p>
            )}
            <p className="text-[10px] text-gray-400 font-semibold font-mono mt-0.5">
              {callingState.phone}
            </p>
          </div>

          {/* Block close buttons if active connecting/connected */}
          <div className="flex items-center gap-1 text-gray-400">
            <span className="material-symbols-outlined text-sm animate-pulse text-gray-300">drag_indicator</span>
          </div>
        </div>

        {/* Call Display Cockpit */}
        <div className="flex-1 p-5 flex flex-col items-center justify-center space-y-4">
          
          {/* Dialing State */}
          {callingState.callStatus === 'dialing' && (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center border border-gray-250 animate-pulse">
                <span className="material-symbols-outlined text-gray-400 text-xl">phone_forwarded</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">Connecting Gateway</span>
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
              </div>
            </div>
          )}

          {/* Ringing State */}
          {callingState.callStatus === 'ringing' && (
            <div className="flex flex-col items-center space-y-2">
              <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center border border-blue-200 animate-bounce">
                <span className="material-symbols-outlined text-blue-500 text-xl">ring_volume</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">Ringing Outbound</span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-ping"></span>
              </div>
            </div>
          )}

          {/* Connected State */}
          {callingState.callStatus === 'connected' && (
            <div className="flex flex-col items-center space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-red-600 rounded-full animate-pulse"></span>
                <span className="font-mono text-2xl font-extrabold text-gray-850 tracking-tight">
                  {formatTimer(callingState.secondsElapsed)}
                </span>
              </div>
              <span className="text-[10px] text-gray-400 font-extrabold uppercase tracking-widest">
                Call Connected
              </span>

              {callingState.dtmfTones && (
                <div className="bg-gray-50 px-2 py-0.5 border border-gray-150 rounded text-[9.5px] font-mono text-gray-500 max-w-[150px] truncate">
                  DTMF: {callingState.dtmfTones}
                </div>
              )}
            </div>
          )}

        </div>

        {/* Collapsible Keypad Grid */}
        {showKeypad && (
          <div className="px-5 pb-4 border-t border-gray-100 pt-3 bg-gray-50/50 animate-slide-down">
            <div className="grid grid-cols-3 gap-2.5 max-w-[180px] mx-auto">
              {keypadDigits.map((row, rIdx) => (
                <React.Fragment key={rIdx}>
                  {row.map(digit => (
                    <button
                      key={digit}
                      onClick={() => handleDtmfClick(digit)}
                      className="w-12 h-12 bg-white hover:bg-gray-100 text-gray-800 rounded-full flex flex-col items-center justify-center border border-gray-200 font-bold active:scale-90 transition-all shadow-sm"
                    >
                      <span className="text-xs font-black">{digit}</span>
                    </button>
                  ))}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}

        {/* DTMF toggle handle */}
        {callingState.callStatus === 'connected' && (
          <div className="text-center pb-2 select-none">
            <button
              onClick={() => setShowKeypad(!showKeypad)}
              className="text-[#8E44AD] font-bold text-[10px] hover:underline flex items-center gap-0.5 mx-auto"
            >
              <span className="material-symbols-outlined text-xs">keyboard</span>
              <span>{showKeypad ? 'Hide Keypad' : 'Show Keypad Dial'}</span>
            </button>
          </div>
        )}

        {/* Call Controls row */}
        <div className="px-5 py-4 border-t border-gray-100 flex justify-between items-center bg-white shrink-0 select-none">
          {/* Mute toggle */}
          <button
            disabled={callingState.callStatus !== 'connected'}
            onClick={toggleMute}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
              callingState.isMuted
                ? 'bg-red-50 text-red-600 border-red-200 font-bold'
                : 'bg-white hover:bg-gray-55 border-gray-200 text-gray-500 hover:text-gray-700'
            } ${callingState.callStatus !== 'connected' ? 'opacity-40 cursor-not-allowed' : 'active:scale-90'}`}
            title="Mute Call"
          >
            <span className="material-symbols-outlined text-base">
              {callingState.isMuted ? 'mic_off' : 'mic'}
            </span>
          </button>

          {/* Hang Up Action (phone-down icon) */}
          <button
            onClick={handleHangUp}
            className="w-14 h-14 bg-red-650 hover:bg-red-750 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all text-white"
            title="Hang Up"
          >
            <span className="material-symbols-outlined text-xl">call_end</span>
          </button>

          {/* Speaker toggle */}
          <button
            disabled={callingState.callStatus !== 'connected'}
            onClick={toggleSpeaker}
            className={`w-11 h-11 rounded-full flex items-center justify-center border transition-all ${
              callingState.isSpeakerActive
                ? 'bg-[#8E44AD]/10 text-[#8E44AD] border-[#8E44AD]/30 font-bold'
                : 'bg-white hover:bg-gray-55 border-gray-200 text-gray-500 hover:text-gray-700'
            } ${callingState.callStatus !== 'connected' ? 'opacity-40 cursor-not-allowed' : 'active:scale-90'}`}
            title="Toggle Speakerphone"
          >
            <span className="material-symbols-outlined text-base">
              {callingState.isSpeakerActive ? 'volume_up' : 'volume_down'}
            </span>
          </button>
        </div>

        {/* Pre-connect cancel link */}
        {(callingState.callStatus === 'dialing' || callingState.callStatus === 'ringing') && (
          <div className="pb-3 text-center shrink-0">
            <button
              onClick={cancelCall}
              className="text-gray-400 hover:text-red-600 text-[10px] font-bold tracking-wide uppercase hover:underline"
            >
              Cancel Call Attempt
            </button>
          </div>
        )}

      </div>
    </>
  );
};
