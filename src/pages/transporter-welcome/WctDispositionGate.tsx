import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const WctDispositionGate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const stateLead = location.state || {};
  const isCampaign = stateLead.isCampaign || false;
  const campaignContext = stateLead.campaignContext || null;

  // Form states
  const [outcome, setOutcome] = useState<'connected' | 'nr' | 'busy' | 'wrong' | 'off' | ''>('');
  const [disposition, setDisposition] = useState<'interested' | 'not_interested' | 'callback' | 'already_subs' | ''>('');

  const [selectedConvertedPlan, setSelectedConvertedPlan] = useState<'free' | 'premium' | 'super' | ''>('');
  const [matchmakingToggle, setMatchmakingToggle] = useState(true);
  const [jobDescription, setJobDescription] = useState('');
  const [upsellReminderToggle, setUpsellReminderToggle] = useState(true);
  const [notInterestedReason, setNotInterestedReason] = useState('');
  const [callbackDate, setCallbackDate] = useState('2026-06-20');
  const [callbackTime, setCallbackTime] = useState('11:30');
  const [dispositionNotes, setDispositionNotes] = useState('');

  // Campaign specific feedback states
  const [tempUpdate, setTempUpdate] = useState<'HOT' | 'WARM' | 'COLD' | ''>('');
  const [starRating, setStarRating] = useState<number>(0);

  React.useEffect(() => {
    if (campaignContext?.temperature) {
      setTempUpdate(campaignContext.temperature);
    }
  }, [campaignContext]);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleExitBlocked = () => {
    triggerToast('⚠️ Exit blocked. You must save Call Disposition to clear the gate.');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    triggerToast('Disposition logged successfully');
    
    // Frictionless loop: reload queue or campaign leads
    setTimeout(() => {
      navigate(isCampaign ? '/wct/wct-campaign-leads' : '/wct/wct-call-queue');
    }, 800);
  };

  return (
    <main className="max-w-xl mx-auto bg-white border border-gray-200 shadow-xl rounded-xl relative p-6 mt-4">
      {/* Toast Overlay */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FB641B]"></span>
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="border-b border-gray-100 pb-3 mb-5">
        <div className="flex justify-between items-center">
          <h1 className="text-lg font-bold text-gray-900">Transporter Call Disposition</h1>
          <span className="bg-orange-50 text-[#FB641B] text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            WCT Gated Mode
          </span>
        </div>
        <p className="text-xs text-gray-500 mt-1">
          Active Transporter: <span className="text-gray-800 font-semibold">Sharma Logistics</span> · Monospace TR-12094
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
                      ? 'border-[#FB641B] bg-orange-50/20 text-[#FB641B] font-bold shadow-sm'
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

        {/* Step 2: Disposition */}
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
                        ? 'border-[#FB641B] bg-orange-50/20 text-[#FB641B] font-bold'
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

        {/* Step 3a: Converted Options */}
        {outcome === 'connected' && disposition === 'interested' && (
          <section className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-4 text-xs animate-in fade-in duration-300">
            <div className="font-bold text-gray-700 uppercase tracking-wider">Plan & Matchmaking Handoff *</div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'free', label: 'Free Plan' },
                { id: 'premium', label: 'Premium ₹1,999' },
                { id: 'super', label: 'Super Premium ₹2,999' }
              ].map(plan => (
                <button
                  key={plan.id}
                  type="button"
                  onClick={() => setSelectedConvertedPlan(plan.id as any)}
                  className={`p-2.5 border rounded-lg font-bold text-center transition-all ${
                    selectedConvertedPlan === plan.id 
                      ? 'bg-[#FB641B] text-white border-[#FB641B]' 
                      : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  {plan.label}
                </button>
              ))}
            </div>

            {/* Premium/Super Premium Handoff details */}
            {(selectedConvertedPlan === 'premium' || selectedConvertedPlan === 'super') && (
              <div className="space-y-3 bg-white p-3 rounded-lg border border-gray-150 animate-in fade-in duration-300">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-700">Add to Matchmaking Queue?</span>
                  <input 
                    type="checkbox" 
                    checked={matchmakingToggle} 
                    onChange={(e) => setMatchmakingToggle(e.target.checked)}
                    className="rounded text-[#FB641B] focus:ring-[#FB641B] w-4 h-4 border-gray-300"
                  />
                </div>
                {matchmakingToggle && (
                  <div>
                    <label className="text-gray-500 block mb-1 font-semibold">Job Description (optional)</label>
                    <textarea
                      value={jobDescription}
                      onChange={(e) => setJobDescription(e.target.value)}
                      placeholder="e.g. Need HMV driver for long-haul FMCG route..."
                      className="w-full border border-gray-200 rounded p-2 focus:ring-1 focus:ring-[#FB641B] outline-none min-h-[50px] resize-none"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Free Plan D+7 reminder */}
            {selectedConvertedPlan === 'free' && (
              <div className="bg-white p-3 rounded-lg border border-gray-150 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-gray-700 block">Create D+7 upsell reminder?</span>
                  <span className="text-[10px] text-gray-400 italic">Follow up in 7 days for premium upgrade</span>
                </div>
                <input 
                  type="checkbox" 
                  checked={upsellReminderToggle} 
                  onChange={(e) => setUpsellReminderToggle(e.target.checked)}
                  className="rounded text-[#FB641B] focus:ring-[#FB641B] w-4 h-4 border-gray-300"
                />
              </div>
            )}
          </section>
        )}

        {/* Step 3b: Not Interested */}
        {outcome === 'connected' && disposition === 'not_interested' && (
          <section className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-3 text-xs animate-in fade-in duration-300">
            <label className="font-bold text-gray-700 block mb-1">Reason for Rejection *</label>
            <select 
              value={notInterestedReason} 
              onChange={(e) => setNotInterestedReason(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg outline-none text-xs"
            >
              <option value="">Select a reason...</option>
              <option value="expensive">Too expensive / Price Objection</option>
              <option value="competitor">Happy with competitor systems</option>
              <option value="no_hiring">Not hiring right now</option>
              <option value="later">Will decide later</option>
              <option value="other">Other reason</option>
            </select>
          </section>
        )}

        {/* Step 3c: Callback */}
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

        {/* Campaign Specific — Temperature & Rating */}
        {isCampaign && outcome && (
          <section className="space-y-4 bg-red-50/30 p-4 rounded-xl border border-red-100 text-xs animate-in fade-in duration-300">
            <div className="font-bold text-red-800 uppercase tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">campaign</span>
              Campaign Disposition Details
            </div>
            
            <div className="space-y-2">
              <label className="font-bold text-gray-700 block">Temperature Update *</label>
              <div className="flex gap-2">
                {[
                  { id: 'HOT', label: '🔥 Keep HOT' },
                  { id: 'WARM', label: '~ Downgrade WARM' },
                  { id: 'COLD', label: '❄ Downgrade COLD' }
                ].map(t => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setTempUpdate(t.id as any)}
                    className={`flex-1 py-2 border rounded-lg font-bold text-center transition-all ${
                      tempUpdate === t.id 
                        ? 'bg-red-500 text-white border-red-500' 
                        : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="font-bold text-gray-700 block">Lead Quality Rating (Optional)</label>
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setStarRating(star)}
                    className="text-lg transition-transform active:scale-125 focus:outline-none"
                  >
                    <span className={`material-symbols-outlined text-[24px] ${
                      star <= starRating ? 'text-yellow-500 fill-current' : 'text-gray-300'
                    }`}>
                      star
                    </span>
                  </button>
                ))}
                {starRating > 0 && (
                  <span className="text-[11px] font-bold text-gray-500 ml-2">({starRating} Star{starRating > 1 ? 's' : ''})</span>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Remarks */}
        {outcome && (
          <section className="space-y-2 text-xs">
            <label className="font-bold text-gray-700 block">General Remarks / Notes</label>
            <textarea 
              value={dispositionNotes}
              onChange={(e) => setDispositionNotes(e.target.value)}
              className="w-full min-h-[80px] p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#FB641B] outline-none text-xs resize-none" 
              placeholder="Add call remarks..."
            />
          </section>
        )}

        {/* SLA Compliance Logging info */}
        {outcome && (
          <div className="bg-gray-150/40 p-2.5 rounded-lg text-[10px] text-gray-500 select-none font-mono">
            📟 First-call SLA: ✓ Met (called 1h 23min after registration)
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
              (outcome === 'connected' && disposition === 'interested' && !selectedConvertedPlan) ||
              (outcome === 'connected' && disposition === 'not_interested' && !notInterestedReason) ||
              (isCampaign && !tempUpdate)
            }
            className={`flex-grow h-12 font-bold text-xs rounded-lg flex items-center justify-center gap-1 shadow-md uppercase transition-all ${
              (!outcome || 
               (outcome === 'connected' && !disposition) ||
               (outcome === 'connected' && disposition === 'interested' && !selectedConvertedPlan) ||
               (outcome === 'connected' && disposition === 'not_interested' && !notInterestedReason) ||
               (isCampaign && !tempUpdate))
                ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                : 'bg-[#FB641B] hover:bg-[#e4540d] text-white'
            }`}
          >
            Submit &amp; Load Next Lead →
          </button>
        </footer>

      </form>
    </main>
  );
};

export default WctDispositionGate;
