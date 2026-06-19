import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DwDispositionGate: React.FC = () => {
  const navigate = useNavigate();

  // Form States
  const [outcome, setOutcome] = useState<'connected' | 'nr' | 'busy' | 'wrong' | 'off' | ''>('');
  const [disposition, setDisposition] = useState<'interested' | 'not_interested' | 'callback' | 'already_subs' | ''>('');
  
  // Specific detail states
  const [selectedPlan, setSelectedPlan] = useState<'ready' | 'verified' | 'trusted' | ''>('');
  const [linkSentToggle, setLinkSentToggle] = useState<'yes' | 'no'>('no');
  const [rejectionReason, setRejectionReason] = useState('');
  const [callbackDate, setCallbackDate] = useState('2026-06-20');
  const [callbackTime, setCallbackTime] = useState('11:30');
  const [finalNotes, setFinalNotes] = useState('');
  const [escalateChoice, setEscalateChoice] = useState<'yes' | 'no' | ''>('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Block exit check
  const handleExitBlocked = () => {
    triggerToast('⚠️ Exit blocked. You must save call disposition details before leaving.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (outcome === 'connected' && disposition === 'interested' && selectedPlan) {
      triggerToast('Marked as Converted ✓');
    } else {
      triggerToast('Disposition logged successfully');
    }
    
    // Frictionless loop: reload queue
    setTimeout(() => {
      navigate('/dw/dw-call-queue');
    }, 800);
  };

  return (
    <main className="max-w-xl mx-auto bg-white border border-gray-200 shadow-xl rounded-xl relative p-6 mt-4">
      {/* Toast Overlay */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#27AE60]"></span>
          {toastMessage}
        </div>
      )}

      {/* Header Info */}
      <div className="border-b border-gray-100 pb-3 mb-5">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-900">Log Call Disposition</h1>
          <span className="bg-[#EAFAF1] text-[#27AE60] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            DW Gated Mode
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Active Lead: <span className="text-gray-800 font-semibold">Suresh Yadav</span> · Monospace DR-48291
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Call Outcome */}
        <section className="space-y-3">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Step 1 — Call Outcome *</label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {[
              { id: 'connected', label: 'Connected', icon: 'check_circle' },
              { id: 'nr', label: 'No Response', icon: 'phone_disabled' },
              { id: 'busy', label: 'Busy', icon: 'timer' },
              { id: 'wrong', label: 'Wrong Num', icon: 'person_off' },
              { id: 'off', label: 'Switch Off', icon: 'power_off' }
            ].map(o => {
              const isSelected = outcome === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => {
                    setOutcome(o.id as any);
                    if (o.id !== 'connected') setDisposition('');
                  }}
                  className={`flex flex-col items-center justify-center p-2.5 border rounded-lg transition-all ${
                    isSelected
                      ? 'border-[#27AE60] bg-[#EAFAF1]/30 text-[#27AE60] font-bold shadow-sm'
                      : 'border-gray-200 bg-white hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px] mb-1">{o.icon}</span>
                  <span className="text-[10px] whitespace-nowrap">{o.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Disposition (Visible only if outcome is connected) */}
        {outcome === 'connected' && (
          <section className="space-y-3 animate-in fade-in duration-300">
            <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Step 2 — Client Response *</label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'interested', label: 'Interested / Converted' },
                { id: 'not_interested', label: 'Not Interested' },
                { id: 'callback', label: 'Callback Requested' },
                { id: 'already_subs', label: 'Already Subscribed' }
              ].map(d => {
                const isSelected = disposition === d.id;
                return (
                  <button
                    key={d.id}
                    type="button"
                    onClick={() => setDisposition(d.id as any)}
                    className={`px-3 py-2 border text-xs font-semibold rounded-lg transition-all text-center ${
                      isSelected
                        ? 'border-[#27AE60] bg-[#EAFAF1]/30 text-[#27AE60] font-bold'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {d.label}
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Detail Input Panels */}
        {outcome === 'connected' && disposition === 'interested' && (
          <section className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-4 text-xs animate-in fade-in duration-300">
            <div className="font-bold text-gray-700 uppercase tracking-wider">Subscription Selection *</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'ready', label: 'Job Ready ₹199' },
                { id: 'verified', label: 'Verified ₹299' },
                { id: 'trusted', label: 'Trusted ₹499' }
              ].map(plan => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedPlan(plan.id as any)}
                  className={`p-2.5 border rounded-lg font-bold text-center transition-all ${
                    selectedPlan === plan.id 
                      ? 'bg-[#27AE60] text-white border-[#27AE60]' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {plan.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-200">
              <span className="font-semibold text-gray-600">Payment link sent via WhatsApp? *</span>
              <div className="flex gap-2">
                <button 
                  type="button"
                  onClick={() => setLinkSentToggle('yes')}
                  className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${linkSentToggle === 'yes' ? 'bg-[#27AE60] text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  Yes
                </button>
                <button 
                  type="button"
                  onClick={() => setLinkSentToggle('no')}
                  className={`px-3 py-1 rounded text-[10px] font-bold transition-all ${linkSentToggle === 'no' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500'}`}
                >
                  No
                </button>
              </div>
            </div>
          </section>
        )}

        {outcome === 'connected' && disposition === 'not_interested' && (
          <section className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-3 text-xs animate-in fade-in duration-300">
            <label className="font-bold text-gray-700 block mb-1">Reason for Rejection *</label>
            <select 
              value={rejectionReason} 
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg outline-none text-xs"
            >
              <option value="">Select a reason...</option>
              <option value="expensive">Pricing feels too high</option>
              <option value="competitor">Happy with competitor systems</option>
              <option value="no_interest">Not interested in jobs right now</option>
              <option value="no_smartphone">No smartphone access</option>
              <option value="other">Other reason</option>
            </select>
            <div className="text-[11px] text-blue-700 bg-blue-50 border border-blue-100 p-2 rounded">
              💡 Follow-up reminder will be scheduled on D+3 automatically.
            </div>
          </section>
        )}

        {outcome === 'connected' && disposition === 'callback' && (
          <section className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-3 text-xs animate-in fade-in duration-300">
            <label className="font-bold text-gray-700 block">Schedule Follow-up Call *</label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <span className="text-gray-500 block mb-1">Preferred Date</span>
                <input 
                  value={callbackDate} 
                  onChange={(e) => setCallbackDate(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg outline-none" 
                  type="date"
                />
              </div>
              <div>
                <span className="text-gray-500 block mb-1">Preferred Time</span>
                <input 
                  value={callbackTime} 
                  onChange={(e) => setCallbackTime(e.target.value)}
                  className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg outline-none" 
                  type="time"
                />
              </div>
            </div>
          </section>
        )}

        {/* Step 4: Remarks (Optional, All Paths) */}
        {outcome && (
          <section className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <label className="font-bold text-gray-700 block">General Remarks / Notes</label>
              <button 
                type="button"
                onClick={() => { setFinalNotes('Client agreed to verify registration profile tonight.'); triggerToast('Mock Speech Recognition active'); }}
                className="text-[10px] font-bold text-[#27AE60] flex items-center gap-0.5 hover:underline"
              >
                🎙️ Voice Input
              </button>
            </div>
            <textarea 
              value={finalNotes}
              onChange={(e) => setFinalNotes(e.target.value)}
              className="w-full min-h-[80px] p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#27AE60] outline-none text-xs resize-none" 
              placeholder="Add call remarks..."
            />
          </section>
        )}

        {/* Funnel Escalation Alert */}
        {outcome === 'nr' && (
          <div className="bg-[#FFF9E6] border border-[#F2C94C] p-3 rounded-lg text-xs text-[#D35400] space-y-2">
            <div className="font-bold">⚠️ Funnel Escalation Check</div>
            <p className="text-[11px] leading-tight">This lead qualifies for funnel escalation (3 consecutive NR attempts). Escalate?</p>
            <div className="flex gap-2">
              <button 
                type="button" 
                onClick={() => setEscalateChoice('yes')}
                className={`px-3 py-1 rounded text-[10px] font-bold ${escalateChoice === 'yes' ? 'bg-[#FB641B] text-white' : 'bg-white border border-gray-200'}`}
              >
                Yes, Escalate
              </button>
              <button 
                type="button" 
                onClick={() => setEscalateChoice('no')}
                className={`px-3 py-1 rounded text-[10px] font-bold ${escalateChoice === 'no' ? 'bg-gray-600 text-white' : 'bg-white border border-gray-200'}`}
              >
                No, Keep
              </button>
            </div>
          </div>
        )}

        {/* Submit Actions */}
        <footer className="border-t border-gray-100 pt-4 flex gap-3">
          <button 
            type="button"
            onClick={handleExitBlocked}
            className="w-1/3 h-12 border border-gray-200 text-gray-400 font-bold rounded-lg text-xs uppercase"
          >
            Bypass Blocked
          </button>
          <button 
            type="submit"
            disabled={
              !outcome || 
              (outcome === 'connected' && !disposition) ||
              (outcome === 'connected' && disposition === 'interested' && !selectedPlan) ||
              (outcome === 'connected' && disposition === 'not_interested' && !rejectionReason) ||
              (outcome === 'nr' && !escalateChoice)
            }
            className={`flex-grow h-12 font-bold text-xs rounded-lg flex items-center justify-center gap-1 shadow-md uppercase transition-all ${
              (!outcome || 
               (outcome === 'connected' && !disposition) ||
               (outcome === 'connected' && disposition === 'interested' && !selectedPlan) ||
               (outcome === 'connected' && disposition === 'not_interested' && !rejectionReason) ||
               (outcome === 'nr' && !escalateChoice))
                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                : 'bg-[#27AE60] hover:bg-[#219653] text-white'
            }`}
          >
            Submit &amp; Load Next Lead →
          </button>
        </footer>

      </form>
    </main>
  );
};

export default DwDispositionGate;
