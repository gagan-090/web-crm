import React, { useState } from 'react';

export const DwDispositionGate: React.FC = () => {
  // Form States
  const [outcome, setOutcome] = useState<'connected' | 'nr' | 'busy' | 'wrong' | 'off' | null>(null);
  const [disposition, setDisposition] = useState<'interested' | 'not_interested' | 'callback' | 'already_subs' | null>(null);
  
  // Specific detail states
  const [selectedPlan, setSelectedPlan] = useState<'standard' | 'pro' | 'enterprise'>('pro');
  const [sendBrochure, setSendBrochure] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('');
  const [callbackDate, setCallbackDate] = useState('');
  const [callbackTime, setCallbackTime] = useState('');
  const [finalNotes, setFinalNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleOutcomeSelect = (val: 'connected' | 'nr' | 'busy' | 'wrong' | 'off') => {
    setOutcome(val);
    if (val !== 'connected') {
      // If call didn't connect, skip disposition step directly to notes/submit
      setDisposition(null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let summary = `Outcome: ${outcome?.toUpperCase()}`;
    if (outcome === 'connected' && disposition) {
      summary += `, Disposition: ${disposition.toUpperCase()}`;
      if (disposition === 'interested') {
        summary += `, Plan: ${selectedPlan.toUpperCase()}, Whatsapp brochure: ${sendBrochure ? 'Yes' : 'No'}`;
      } else if (disposition === 'not_interested') {
        summary += `, Reason: ${rejectionReason}`;
      } else if (disposition === 'callback') {
        summary += `, Callback: ${callbackDate} at ${callbackTime}`;
      }
    }
    summary += `, Notes: ${finalNotes || 'None'}`;
    
    showToast(`Disposition Saved successfully!\n${summary}`);
    
    // Reset form after saving
    setOutcome(null);
    setDisposition(null);
    setFinalNotes('');
    setCallbackDate('');
    setCallbackTime('');
    setRejectionReason('');
  };

  return (
    <main className="bg-surface-container-lowest max-w-4xl mx-auto flex flex-col shadow-xl rounded-xl border border-outline-variant relative p-lg">
      
      {/* Toast Overlay */}
      {toastMessage && (
        <div className="absolute top-md left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-lg py-md rounded shadow-lg z-50 text-xs font-semibold flex flex-col gap-1 border border-outline whitespace-pre-line animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-xs font-bold text-accent-success">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Disposition Gate Submitted</span>
          </div>
          <p className="text-[11px] font-normal leading-relaxed opacity-90">{toastMessage}</p>
        </div>
      )}

      {/* Header Info */}
      <div className="border-b border-outline-variant pb-md mb-lg">
        <h1 className="font-headline-md text-headline-md font-bold text-on-surface">Call Disposition Gate</h1>
        <p className="text-xs text-on-surface-variant mt-1">Log final call status outcomes and operational closing metadata.</p>
      </div>

      <form onSubmit={handleSubmit} className="flex-1 space-y-xl overflow-y-auto no-scrollbar">
        
        {/* Step 1: Call Outcome */}
        <section className="space-y-sm">
          <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Step 1: Call Outcome</h2>
          <div className="grid grid-cols-5 gap-sm">
            {[
              { key: 'connected', label: 'Connected', icon: 'call_made', color: 'text-accent-success' },
              { key: 'nr', label: 'No Response', icon: 'call_missed', color: 'text-on-surface-variant' },
              { key: 'busy', label: 'Line Busy', icon: 'ring_volume', color: 'text-on-surface-variant' },
              { key: 'wrong', label: 'Wrong Number', icon: 'person_off', color: 'text-on-surface-variant' },
              { key: 'off', label: 'Switched Off', icon: 'mobile_off', color: 'text-on-surface-variant' }
            ].map(o => {
              const isSelected = outcome === o.key;
              return (
                <button
                  key={o.key}
                  type="button"
                  onClick={() => handleOutcomeSelect(o.key as any)}
                  className={`flex flex-col items-center justify-center p-md border rounded-lg transition-all ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                      : 'border-outline-variant bg-white hover:bg-surface-container-high text-on-surface'
                  }`}
                >
                  <span className={`material-symbols-outlined text-[22px] mb-xs ${isSelected ? 'text-primary' : o.color}`}>
                    {o.icon}
                  </span>
                  <span className="text-xs">{o.label}</span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Step 2: Disposition (Visible only if outcome is connected) */}
        {outcome === 'connected' && (
          <section className="space-y-sm animate-in fade-in duration-300">
            <h2 className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Step 2: Disposition status</h2>
            <div className="grid grid-cols-4 gap-sm">
              {[
                { key: 'interested', label: 'Interested', icon: 'thumb_up', color: 'text-accent-success' },
                { key: 'not_interested', label: 'Not Interested', icon: 'thumb_down', color: 'text-error' },
                { key: 'callback', label: 'Request Callback', icon: 'schedule', color: 'text-primary' },
                { key: 'already_subs', label: 'Already Subscribed', icon: 'verified', color: 'text-tertiary' }
              ].map(d => {
                const isSelected = disposition === d.key;
                return (
                  <button
                    key={d.key}
                    type="button"
                    onClick={() => setDisposition(d.key as any)}
                    className={`flex items-center gap-sm px-md py-sm border rounded-lg transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary font-bold shadow-sm'
                        : 'border-outline-variant bg-white hover:bg-surface-container-high text-on-surface'
                    }`}
                  >
                    <span className={`material-symbols-outlined text-[18px] ${isSelected ? 'text-primary' : d.color}`}>
                      {d.icon}
                    </span>
                    <span className="text-xs font-semibold">{d.label}</span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {/* Detail Input Panels */}
        {outcome === 'connected' && disposition === 'interested' && (
          <section className="bg-surface-container-low p-lg border border-outline-variant rounded-xl space-y-md animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <label className="text-sm font-bold text-on-surface">Select Drivers Subscription Plan</label>
              <div className="flex items-center gap-sm bg-surface-container-highest px-md py-1.5 rounded-full border border-outline-variant text-xs cursor-pointer">
                <span className="material-symbols-outlined text-[#25D366] text-[18px]">chat</span>
                <span className="font-semibold text-on-surface-variant">Send WhatsApp Brochure</span>
                <input 
                  checked={sendBrochure} 
                  onChange={(e) => setSendBrochure(e.target.checked)}
                  className="w-3.5 h-3.5 text-primary focus:ring-primary border-outline rounded cursor-pointer" 
                  type="checkbox"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-md text-xs">
              <div 
                onClick={() => setSelectedPlan('standard')}
                className={`p-md border-2 cursor-pointer rounded-xl bg-white group transition-all ${
                  selectedPlan === 'standard' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary-container'
                }`}
              >
                <div className="flex justify-between items-start mb-sm">
                  <span className="bg-primary/10 text-primary text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">Job Ready</span>
                  <input 
                    checked={selectedPlan === 'standard'} 
                    onChange={() => setSelectedPlan('standard')}
                    className="text-primary cursor-pointer w-3.5 h-3.5" 
                    type="radio" 
                    name="plan"
                  />
                </div>
                <div className="text-lg font-bold text-on-surface">₹199<span className="text-[10px] font-normal text-on-surface-variant">/mo</span></div>
                <p className="text-[11px] text-on-surface-variant mt-1.5 leading-tight">Standard order loading pipeline with fast verification setup.</p>
              </div>

              <div 
                onClick={() => setSelectedPlan('pro')}
                className={`p-md border-2 cursor-pointer rounded-xl relative overflow-hidden bg-white transition-all ${
                  selectedPlan === 'pro' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary-container'
                }`}
              >
                <div className="absolute -right-6 top-3 rotate-45 bg-primary text-on-primary text-[8px] font-extrabold px-6 py-0.5 tracking-wider">RECOMMENDED</div>
                <div className="flex justify-between items-start mb-sm">
                  <span className="bg-primary text-on-primary text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">Verified</span>
                  <input 
                    checked={selectedPlan === 'pro'} 
                    onChange={() => setSelectedPlan('pro')}
                    className="text-primary cursor-pointer w-3.5 h-3.5" 
                    type="radio" 
                    name="plan"
                  />
                </div>
                <div className="text-lg font-bold text-on-surface">₹299<span className="text-[10px] font-normal text-on-surface-variant">/mo</span></div>
                <p className="text-[11px] text-on-surface-variant mt-1.5 leading-tight">Profile badge + 3X priority order dispatch allocation algorithm.</p>
              </div>

              <div 
                onClick={() => setSelectedPlan('enterprise')}
                className={`p-md border-2 cursor-pointer rounded-xl bg-white group transition-all ${
                  selectedPlan === 'enterprise' ? 'border-primary bg-primary/5' : 'border-outline-variant hover:border-primary-container'
                }`}
              >
                <div className="flex justify-between items-start mb-sm">
                  <span className="bg-secondary-container text-on-secondary-container text-[9px] font-extrabold px-2 py-0.5 rounded uppercase">Trusted</span>
                  <input 
                    checked={selectedPlan === 'enterprise'} 
                    onChange={() => setSelectedPlan('enterprise')}
                    className="text-primary cursor-pointer w-3.5 h-3.5" 
                    type="radio" 
                    name="plan"
                  />
                </div>
                <div className="text-lg font-bold text-on-surface">₹499<span className="text-[10px] font-normal text-on-surface-variant">/mo</span></div>
                <p className="text-[11px] text-on-surface-variant mt-1.5 leading-tight">100% Secure Payment Protection fund cover + 24/7 Ops support.</p>
              </div>
            </div>
          </section>
        )}

        {outcome === 'connected' && disposition === 'not_interested' && (
          <section className="bg-surface-container-low p-lg border border-outline-variant rounded-xl space-y-md animate-in fade-in duration-300">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Reason for Rejection</label>
            <select 
              value={rejectionReason} 
              onChange={(e) => setRejectionReason(e.target.value)}
              required
              className="w-full h-11 px-md bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none text-xs"
            >
              <option value="">Select a reason...</option>
              <option value="Pricing too high">Pricing feels too high</option>
              <option value="Happy with current vendor">Happy with competitor systems</option>
              <option value="Does not fit operational flow">Route schedules do not align</option>
              <option value="Technical limitations">Does not use smartphones / apps</option>
              <option value="Other">Other (Specify in notes)</option>
            </select>
          </section>
        )}

        {outcome === 'connected' && disposition === 'callback' && (
          <section className="bg-surface-container-low p-lg border border-outline-variant rounded-xl space-y-md animate-in fade-in duration-300">
            <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block">Schedule Follow-up Call</label>
            <div className="grid grid-cols-2 gap-md text-xs">
              <div className="space-y-xs">
                <span className="text-on-surface-variant">Preferred Date</span>
                <input 
                  value={callbackDate} 
                  onChange={(e) => setCallbackDate(e.target.value)}
                  required
                  className="w-full h-11 px-md bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none" 
                  type="date"
                />
              </div>
              <div className="space-y-xs">
                <span className="text-on-surface-variant">Preferred Time</span>
                <input 
                  value={callbackTime} 
                  onChange={(e) => setCallbackTime(e.target.value)}
                  required
                  className="w-full h-11 px-md bg-white border border-outline-variant rounded-lg focus:ring-1 focus:ring-primary outline-none" 
                  type="time"
                />
              </div>
            </div>
          </section>
        )}

        {/* Final Notes & Submit Action (Visible only when outcome is selected) */}
        {outcome && (
          <section className="space-y-md animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider">Final Interaction Remarks</label>
              <button 
                type="button"
                onClick={() => { setFinalNotes('Driver has agreed to the Verified Plan package and will clear the payment link by EOD.'); showToast('Speech Recognition simulated: Note filled.'); }}
                className="flex items-center gap-xs text-primary hover:bg-primary-container/10 px-sm py-1 rounded transition-colors text-xs font-bold"
              >
                <span className="material-symbols-outlined text-[16px]">mic</span>
                <span>Voice Input</span>
              </button>
            </div>
            <textarea 
              value={finalNotes}
              onChange={(e) => setFinalNotes(e.target.value)}
              className="w-full min-h-[100px] p-md bg-white border border-outline-variant rounded-xl focus:ring-1 focus:ring-primary outline-none resize-none text-xs" 
              placeholder="Add specific call log summaries, primary driver objections, or operational requests here..."
            />
          </section>
        )}

        {/* Algo Match Recommendation Panel (Example Trigger logic) */}
        {outcome === 'connected' && disposition === 'interested' && selectedPlan === 'pro' && (
          <section className="animate-in slide-in-from-bottom-3 duration-300 bg-primary-container/5 border border-primary p-md rounded-xl flex items-start gap-md text-xs">
            <div className="bg-primary text-on-primary p-sm rounded-lg shrink-0">
              <span className="material-symbols-outlined text-sm">auto_graph</span>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center">
                <h4 className="text-on-primary-container font-bold">Priority Closing Assistance recommended</h4>
                <span className="bg-primary text-on-primary text-[8px] font-extrabold px-2 py-0.5 rounded uppercase tracking-widest">ALGO MATCH</span>
              </div>
              <p className="text-on-surface-variant mt-1">Based on this high-priority prospect, they qualify for a seniors closing call. Route to TL now?</p>
              <div className="mt-md flex gap-sm">
                <button 
                  type="button"
                  onClick={() => showToast('Lead routed to Team Leader closing queue.')}
                  className="px-md py-1.5 bg-primary text-on-primary rounded font-bold hover:opacity-90 transition-opacity"
                >
                  Yes, Route to TL
                </button>
                <button 
                  type="button" 
                  onClick={() => showToast('Recommendation dismissed')}
                  className="px-md py-1.5 border border-outline-variant text-on-surface-variant rounded hover:bg-surface-container transition-colors"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </section>
        )}
      </form>

      {/* Footer Buttons */}
      <footer className="mt-lg border-t border-outline-variant pt-lg flex gap-md shrink-0">
        <button 
          type="submit"
          disabled={!outcome}
          onClick={handleSubmit}
          className="flex-1 h-12 bg-accent-success disabled:opacity-50 text-white font-bold text-xs rounded-xl flex items-center justify-center gap-sm hover:brightness-95 transition-all shadow-md uppercase"
        >
          <span className="material-symbols-outlined text-[18px]">rocket_launch</span>
          Submit &amp; Load Next Lead
        </button>
        <button 
          type="button"
          onClick={() => { setOutcome(null); setDisposition(null); showToast('Form inputs discarded.'); }}
          className="h-12 px-lg border border-outline-variant text-on-surface-variant font-semibold rounded-xl hover:bg-surface-container transition-colors text-xs uppercase"
        >
          Discard &amp; Exit
        </button>
      </footer>
    </main>
  );
};

export default DwDispositionGate;
