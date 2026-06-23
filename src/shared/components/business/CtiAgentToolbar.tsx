import React, { useState, useEffect, useRef } from 'react';
import { useGlobalOverlays } from '../../context/GlobalOverlaysContext';

export const CtiAgentToolbar: React.FC = () => {
  const { callingState } = useGlobalOverlays();
  
  const [isOpen, setIsOpen] = useState(false);
  const [isCtiLogged, setIsCtiLogged] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [isManualDial, setIsManualDial] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [dialNumber, setDialNumber] = useState('');

  // Dragging states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('input')) return;
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
      
      newX = Math.max(-window.innerWidth + 300, Math.min(newX, 100));
      newY = Math.max(0, Math.min(newY, window.innerHeight - 300));
      
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

  const handleCtiLogin = () => {
    if (typeof (window as any).SANAppInitEvent === 'function') {
      (window as any).SANAppInitEvent({
        userId: 'agent_178',
        userName: 'Lokesh CTI',
        authToken: 'san_secure_auth_hash_178_token',
        additionalData: {
          role: 'Welcome Caller',
          department: 'Driver Welcome'
        }
      });
    }
    setIsCtiLogged(true);
  };

  const handleCtiReady = () => {
    if (typeof (window as any).sendToChild === 'function') {
      (window as any).sendToChild(this, 'ready');
    }
    setIsReady(true);
  };

  const handleToggleManual = () => {
    if (typeof (window as any).toggleManualDial === 'function') {
      (window as any).toggleManualDial();
    }
    setIsManualDial(!isManualDial);
  };

  const handleDialCall = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dialNumber.trim()) return;
    
    if (typeof (window as any).dialAgentCall === 'function') {
      (window as any).dialAgentCall(dialNumber.trim());
    }
    setDialNumber('');
  };

  const handleToggleBreak = () => {
    const nextBreak = !isBreak;
    setIsBreak(nextBreak);
    
    if (typeof (window as any).SANAppBreakEvent === 'function') {
      (window as any).SANAppBreakEvent({
        state: nextBreak ? 4 : 3, // 4 = Break, 3 = Ready
        agent_id: '1',
        name: 'Lokesh',
        process_id: '1',
        exten: '178',
        team_leader: null,
        data: {
          break_name: nextBreak ? 'Bio Break' : 'Resume',
          acd_array: '803'
        }
      });
    }
    alert(`CTI Status: Break Mode ${nextBreak ? 'ON (Bio Break)' : 'OFF (Ready)'}`);
  };

  const handleCtiLogout = () => {
    if (typeof (window as any).SANAppLogoutEvent === 'function') {
      (window as any).SANAppLogoutEvent({
        state: 2,
        agent_id: '1',
        name: 'Lokesh',
        process_id: '1',
        exten: '178',
        team_leader: null,
        data: { acd_array: ['803'] }
      });
    }
    setIsCtiLogged(false);
    setIsReady(false);
    setIsManualDial(false);
    setIsBreak(false);
    alert('CTI Status: Agent Logged Out');
  };

  // Mini CTI status badge floating top-right
  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-2.5 right-64 bg-slate-800 text-white px-3 py-1.5 rounded-full shadow-lg flex items-center gap-1.5 cursor-pointer z-50 text-[10px] font-bold border border-slate-700 hover:bg-slate-750 transition-colors pointer-events-auto"
        title="Open SAN CTI Control Panel"
      >
        <span className={`w-1.5 h-1.5 rounded-full ${
          isReady ? (isBreak ? 'bg-amber-500' : 'bg-green-500') : 'bg-red-500'
        }`}></span>
        <span>SAN CTI Toolbar</span>
      </button>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        transform: `translate(${position.x}px, ${position.y}px)`,
        top: '60px',
        right: '256px',
      }}
      className="fixed w-[280px] bg-slate-900 text-white rounded-lg shadow-2xl border border-slate-800 flex flex-col overflow-hidden z-50 select-none pointer-events-auto animate-slide-down text-xs"
    >
      {/* Header bar */}
      <div
        onMouseDown={handleHeaderMouseDown}
        className="bg-slate-800 px-3 py-2.5 flex justify-between items-center cursor-move border-b border-slate-700"
      >
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sm text-[#25D366]">cell_tower</span>
          <span className="font-extrabold text-[10px] tracking-wide uppercase text-slate-300">
            SAN MiniCRM Simulator
          </span>
        </div>
        <button
          onClick={() => setIsOpen(false)}
          className="text-slate-400 hover:text-white font-bold text-sm"
        >
          ×
        </button>
      </div>

      {/* Main Panel Content */}
      <div className="p-3.5 space-y-3.5 select-text font-semibold text-slate-200">
        
        {/* Connection status display */}
        <div className="flex justify-between items-center text-[10px] bg-slate-950 p-2 rounded border border-slate-850">
          <span className="text-slate-400">Agent Extension:</span>
          <span className="font-mono font-bold text-white">SIP/178 (Lokesh)</span>
        </div>

        {/* Step 1: SSO Init Login */}
        {!isCtiLogged ? (
          <div className="space-y-1.5">
            <span className="text-[9px] text-slate-400 uppercase tracking-wider block">CTI STEP 1: AUTHENTICATION</span>
            <button
              onClick={handleCtiLogin}
              className="w-full bg-[#8E44AD] hover:bg-[#7D3C98] text-white py-2 rounded font-extrabold shadow-sm active:scale-95 transition-all text-xs"
            >
              Sign In via SSO (AppInit)
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {/* Step 2: CTI Ready Status Toggle */}
            {!isReady ? (
              <div className="space-y-1.5">
                <span className="text-[9px] text-slate-400 uppercase tracking-wider block">CTI STEP 2: READY FOR CALLS</span>
                <button
                  onClick={handleCtiReady}
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded font-extrabold shadow-sm active:scale-95 transition-all text-xs flex items-center justify-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">check_circle</span>
                  <span>Mark Agent "Ready"</span>
                </button>
              </div>
            ) : (
              /* CTI Control Options after Agent is Ready */
              <div className="space-y-3.5 border-t border-slate-800 pt-3">
                <div className="flex justify-between items-center select-none">
                  <span className="text-[9px] text-slate-400 uppercase tracking-wider">CTI CONTROLS ACTIVE</span>
                  <span className={`px-2 py-0.5 text-[8.5px] font-black rounded-full uppercase tracking-wider ${
                    isBreak ? 'bg-amber-100 text-amber-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {isBreak ? 'ON BREAK' : 'READY / ACTIVE'}
                  </span>
                </div>

                {/* Dial pad form */}
                <form onSubmit={handleDialCall} className="space-y-1">
                  <label className="text-[9.5px] text-slate-400 block font-bold">Manual Dialpad (Outbound)</label>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      placeholder="Enter mobile number..."
                      value={dialNumber}
                      onChange={(e) => setDialNumber(e.target.value.replace(/\D/g, ''))}
                      className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-[#8E44AD] font-mono font-bold"
                    />
                    <button
                      type="submit"
                      disabled={isBreak}
                      className={`px-3 bg-[#8E44AD] hover:bg-[#7D3C98] rounded text-white font-bold active:scale-90 transition-all ${
                        isBreak ? 'opacity-40 cursor-not-allowed' : ''
                      }`}
                    >
                      Dial
                    </button>
                  </div>
                </form>

                {/* Operations grid */}
                <div className="grid grid-cols-2 gap-2 text-center select-none">
                  {/* Manual dial Toggle */}
                  <button
                    onClick={handleToggleManual}
                    className={`py-1.5 rounded font-bold border transition-colors flex items-center justify-center gap-1 ${
                      isManualDial
                        ? 'bg-amber-600 border-amber-500 text-white'
                        : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
                    }`}
                    title={isManualDial ? 'Disable Manual Mode' : 'Enable Manual Mode'}
                  >
                    <span className="material-symbols-outlined text-sm">pause_circle</span>
                    <span>{isManualDial ? 'Manual ON' : 'Manual OFF'}</span>
                  </button>

                  {/* Break toggle */}
                  <button
                    onClick={handleToggleBreak}
                    className={`py-1.5 rounded font-bold border transition-colors flex items-center justify-center gap-1 ${
                      isBreak
                        ? 'bg-amber-500 border-amber-400 text-black font-extrabold'
                        : 'bg-slate-800 hover:bg-slate-750 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">coffee</span>
                    <span>{isBreak ? 'Un-Break' : 'Break'}</span>
                  </button>
                </div>

                {/* Attended hold indicator */}
                {callingState.callStatus === 'connected' && (
                  <div className="bg-slate-950 border border-slate-800 p-2.5 rounded text-[10px] space-y-1.5 select-none">
                    <span className="text-[9px] text-slate-400 uppercase font-black block tracking-wider">LIVE CALL OPERATIONS</span>
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => {
                          if (typeof (window as any).toggleHold === 'function') {
                            (window as any).toggleHold();
                          }
                        }}
                        className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded border border-slate-700"
                      >
                        {callingState.isSpeakerActive ? 'Unhold' : 'Hold'}
                      </button>
                      <button
                        onClick={() => {
                          if (typeof (window as any).toggleMute === 'function') {
                            (window as any).toggleMute();
                          }
                        }}
                        className="flex-1 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded border border-slate-700"
                      >
                        {callingState.isMuted ? 'Unmute' : 'Mute'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Logout Button */}
                <button
                  onClick={handleCtiLogout}
                  className="w-full py-1.5 bg-slate-850 hover:bg-red-900 border border-slate-750 text-slate-350 hover:text-white rounded font-bold active:scale-95 transition-all text-[11px] mt-1 select-none"
                >
                  Agent CTI Logout
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
};

export default CtiAgentToolbar;
