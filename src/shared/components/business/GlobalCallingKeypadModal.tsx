import React, { useState, useEffect, useRef } from 'react';
import { useGlobalOverlays } from '../../context/GlobalOverlaysContext';
import { useSubmitCtiFeedbackMutation } from '../../../services/api/ctiApi';

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
  const [submitCtiFeedback, { isLoading: isSavingFeedback }] = useSubmitCtiFeedbackMutation();
  
  const [showKeypad, setShowKeypad] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // CTI Disposition Form States
  const [disposition, setDisposition] = useState('ANSWER');
  const [feedback, setFeedback] = useState('Interested');
  const [remarks, setRemarks] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Dragging states
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).closest('select') || (e.target as HTMLElement).closest('textarea')) return;
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
    hangUpCall();
  };

  const handleDtmfClick = (digit: string) => {
    sendDtmf(digit);
    console.log(`[DTMF Beep] Sent digit: ${digit}`);
  };

  const handleSaveCtiDisposition = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!remarks.trim()) {
      setErrorMsg('Remarks are required');
      return;
    }
    setErrorMsg(null);

    try {
      // Use the actual backend call log ID, fall back to parsed TMID numerical representation
      const callLogId = callingState.ivrCallId || parseInt(callingState.tmid.replace(/\D/g, ''), 10) || 1;

      const response = await submitCtiFeedback({
        id: callLogId,
        call_status: disposition,
        call_feedback: feedback,
        call_remarks: remarks
      }).unwrap();

      if (response.status) {
        setToastMessage('CTI feedback logged successfully ✓');
        setTimeout(() => setToastMessage(null), 3000);
        
        // Reset and close
        setRemarks('');
        cancelCall();
      } else {
        setErrorMsg(response.message || 'Failed to submit feedback.');
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.data?.message || 'Error saving CTI call disposition');
    }
  };

  const keypadDigits = [
    ['1', '2', '3'],
    ['4', '5', '6'],
    ['7', '8', '9'],
    ['*', '0', '#']
  ];

  return (
    <>
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
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

        {/* Header */}
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

          <div className="flex items-center gap-1 text-gray-400">
            <span className="material-symbols-outlined text-sm animate-pulse text-gray-300">drag_indicator</span>
          </div>
        </div>

        {/* Dynamic Display based on CTI state */}
        {callingState.callStatus !== 'wrapup' ? (
          <>
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
                          className="w-12 h-12 bg-white hover:bg-gray-100 text-gray-800 rounded-full flex flex-col items-center justify-center border border-gray-250 font-bold active:scale-90 transition-all shadow-sm"
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

              <button
                onClick={handleHangUp}
                className="w-14 h-14 bg-red-650 hover:bg-red-750 text-white rounded-full flex items-center justify-center shadow-lg active:scale-95 transition-all"
                title="Hang Up"
              >
                <span className="material-symbols-outlined text-xl">call_end</span>
              </button>

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
          </>
        ) : (
          /* CTI Call Disposition Form (wrapup state) */
          <form onSubmit={handleSaveCtiDisposition} className="flex-1 flex flex-col p-4 space-y-3 overflow-y-auto bg-white select-text">
            <h4 className="text-xs font-black text-gray-800 uppercase tracking-wide border-b border-gray-100 pb-1.5 select-none">
              Save CTI Call Log (IVR)
            </h4>

            {errorMsg && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-red-700 text-[10px] font-semibold leading-normal">
                ⚠️ {errorMsg}
              </div>
            )}

            {/* Outcome (disposition) */}
            <div className="space-y-1 select-none">
              <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">Call Outcome</label>
              <select
                value={disposition}
                onChange={(e) => setDisposition(e.target.value)}
                className="w-full border border-gray-250 rounded px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-[#8E44AD] font-semibold bg-white"
              >
                <option value="ANSWER">Connected / Answered</option>
                <option value="NO_ANSWER">No Answer / Ringing</option>
                <option value="BUSY">Line Busy</option>
                <option value="SWITCHED_OFF">Switched Off / Not Reachable</option>
                <option value="FAILED">Call Failed / Aborted</option>
              </select>
            </div>

            {/* Feedback */}
            <div className="space-y-1 select-none">
              <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider">Call Feedback</label>
              <select
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                className="w-full border border-gray-250 rounded px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-[#8E44AD] font-semibold bg-white"
              >
                <option value="Interested">Interested in Job Pitch</option>
                <option value="Not Interested">Not Interested (Route/Pay/Truck)</option>
                <option value="Callback Requested">Callback Scheduled</option>
                <option value="Wrong Number">Wrong Contact Details</option>
                <option value="Already Placed">Already Working Elsewhere</option>
              </select>
            </div>

            {/* Remarks */}
            <div className="space-y-1">
              <label className="text-[9.5px] font-bold text-gray-400 uppercase tracking-wider select-none">Call Remarks</label>
              <textarea
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Enter detailed conversation logs..."
                rows={3}
                className="w-full border border-gray-250 rounded px-2.5 py-1.5 text-xs text-gray-700 outline-none focus:border-[#8E44AD] font-medium resize-none"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-2 flex gap-2 select-none">
              <button
                type="button"
                onClick={cancelCall}
                className="flex-1 py-2 border border-gray-200 text-gray-500 rounded hover:bg-gray-50 text-xs font-bold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSavingFeedback}
                style={{ backgroundColor: roleAccent }}
                className="flex-1 py-2 text-white rounded font-bold hover:brightness-95 text-xs transition-all active:scale-95 shadow flex items-center justify-center gap-1.5"
              >
                {isSavingFeedback ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">save</span>
                    <span>Save CTI</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

      </div>
    </>
  );
};
