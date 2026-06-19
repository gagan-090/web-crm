import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import type { RootState } from '../../../app/rootReducer';
import {
  setActiveDialerLead,
  setCallStatus,
  toggleMute,
  tickTimer
} from '../../../features/calls/slices/queueStateSlice';

export const FloatingDialer: React.FC = () => {
  const dispatch = useDispatch();
  const location = useLocation();

  // Dialer states from Redux
  const activeLead = useSelector((state: RootState) => state.queueState.activeLead);
  const callStatus = useSelector((state: RootState) => state.queueState.callStatus);
  const isMuted = useSelector((state: RootState) => state.queueState.isMuted);
  const secondsElapsed = useSelector((state: RootState) => state.queueState.secondsElapsed);

  // Local UI States
  const [isMinimized, setIsMinimized] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [disposition, setDisposition] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Hide floating dialer if we are already in the full-screen dialer page
  const isDialerConsole = location.pathname.startsWith('/dialer');

  // Handle global call timer ticking when connected
  useEffect(() => {
    let timer: any;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        dispatch(tickTimer());
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus, dispatch]);

  if (isDialerConsole || !activeLead || callStatus === 'idle') {
    return null;
  }

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const handleEndCall = () => {
    dispatch(setCallStatus('wrapup'));
  };

  const handleSaveDisposition = (e: React.FormEvent) => {
    e.preventDefault();
    if (!disposition) {
      setErrorMsg('Select a disposition status');
      return;
    }
    if (remarks.length < 3) {
      setErrorMsg('Remarks must be >= 3 chars');
      return;
    }

    // Save and clear call state
    alert(`[Click to Call Logged]
Lead: ${activeLead.name} (${activeLead.phone})
Status: ${disposition}
Remarks: ${remarks}`);
    
    dispatch(setActiveDialerLead(null));
    setRemarks('');
    setDisposition('');
    setErrorMsg('');
  };

  // Minimized bubble mode
  if (isMinimized) {
    return (
      <div 
        onClick={() => setIsMinimized(false)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full flex items-center justify-center shadow-2xl cursor-pointer hover:bg-primary-container hover:scale-105 active:scale-95 transition-all duration-200 z-50 animate-bounce"
        title="Maximize call panel"
      >
        <span className="material-symbols-outlined text-[28px] animate-pulse">call</span>
        <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[340px] bg-neutral-900 border border-neutral-800 rounded-lg shadow-2xl overflow-hidden z-50 transition-all duration-300">
      
      {/* Header Bar */}
      <div className="bg-neutral-800 px-md py-sm flex justify-between items-center border-b border-neutral-700">
        <div className="flex items-center gap-sm">
          {callStatus === 'connected' ? (
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></div>
          ) : callStatus === 'dialing' ? (
            <div className="w-2.5 h-2.5 bg-amber-500 rounded-full animate-ping"></div>
          ) : (
            <div className="w-2.5 h-2.5 bg-red-500 rounded-full"></div>
          )}
          <span className="font-label-caps text-xs text-neutral-300 font-bold uppercase tracking-wider">
            {callStatus === 'connected' ? 'Call Connected' : callStatus === 'dialing' ? 'Dialing Lead...' : 'Call Wrapup'}
          </span>
        </div>
        <div className="flex items-center gap-xs">
          <button 
            onClick={() => setIsMinimized(true)}
            className="text-neutral-400 hover:text-white p-1 rounded hover:bg-neutral-700 flex items-center"
            title="Minimize"
          >
            <span className="material-symbols-outlined text-[18px]">minimize</span>
          </button>
        </div>
      </div>

      {/* Main Panel Content */}
      <div className="p-md text-white">
        
        {/* Lead profile brief */}
        <div className="mb-md">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wide">{activeLead.process}</p>
              <h4 className="font-bold text-sm text-neutral-100 truncate w-[200px]">{activeLead.name}</h4>
              <p className="text-xs text-neutral-400 font-data-mono">{activeLead.phone}</p>
            </div>
            {callStatus === 'connected' && (
              <span className="font-data-mono text-base font-extrabold text-red-500">
                {formatTime(secondsElapsed)}
              </span>
            )}
          </div>
        </div>

        {/* Dynamic State UI */}
        {callStatus === 'dialing' && (
          <div className="py-md text-center flex flex-col items-center gap-sm">
            <div className="w-12 h-12 bg-neutral-800 rounded-full flex items-center justify-center animate-pulse border border-amber-500">
              <span className="material-symbols-outlined text-amber-500 text-[24px]">ring_volume</span>
            </div>
            <p className="text-xs text-neutral-300">Connecting gateway line...</p>
            <button
              onClick={() => dispatch(setActiveDialerLead(null))}
              className="mt-xs px-md py-1 border border-neutral-700 text-neutral-400 hover:text-white hover:border-white rounded-sm text-[10px] uppercase font-bold"
            >
              Cancel Dial
            </button>
          </div>
        )}

        {callStatus === 'connected' && (
          <div className="py-sm flex items-center justify-between border-t border-neutral-800 pt-sm">
            <button
              onClick={() => dispatch(toggleMute())}
              className={`flex-1 py-2 rounded-sm border mr-sm text-center flex items-center justify-center gap-xs text-xs font-semibold ${
                isMuted 
                  ? 'bg-amber-500 text-neutral-900 border-amber-600' 
                  : 'bg-transparent text-neutral-300 border-neutral-700 hover:bg-neutral-800'
              }`}
            >
              <span className="material-symbols-outlined text-sm">{isMuted ? 'mic_off' : 'mic'}</span>
              <span>{isMuted ? 'Muted' : 'Mute'}</span>
            </button>
            <button
              onClick={handleEndCall}
              className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-sm text-xs flex items-center justify-center gap-xs"
            >
              <span className="material-symbols-outlined text-sm">call_end</span>
              <span>End Call</span>
            </button>
          </div>
        )}

        {callStatus === 'wrapup' && (
          <form onSubmit={handleSaveDisposition} className="space-y-sm border-t border-neutral-800 pt-sm">
            {errorMsg && (
              <p className="text-red-500 text-[10px] font-bold">{errorMsg}</p>
            )}
            
            <div className="space-y-xs">
              <label className="text-[10px] text-neutral-400 uppercase font-bold">Call Outcome</label>
              <select
                value={disposition}
                onChange={(e) => setDisposition(e.target.value)}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-primary"
              >
                <option value="">-- Select Status --</option>
                <option value="CONNECTED">Call Connected</option>
                <option value="NO_ANSWER">No Answer</option>
                <option value="BUSY">Line Busy</option>
                <option value="SWITCHED_OFF">Switched Off</option>
                <option value="CALLBACK">Schedule Callback</option>
              </select>
            </div>

            <div className="space-y-xs">
              <label className="text-[10px] text-neutral-400 uppercase font-bold">Call Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter call details..."
                rows={2}
                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1.5 text-xs text-white outline-none focus:border-primary resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2 bg-primary text-white hover:bg-primary-container rounded-sm font-bold text-xs"
            >
              Save Disposition
            </button>
          </form>
        )}

      </div>
    </div>
  );
};

export default FloatingDialer;
