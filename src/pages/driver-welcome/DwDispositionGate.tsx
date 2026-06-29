import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  useGetDwLeadDetailQuery,
  useGetDwDispositionOptionsQuery,
  useSubmitDwFeedbackMutation,
  useScheduleDwCallbackMutation
} from '../../services/api/webCrmApi';
import { invalidateQueueCache } from '../../shared/hooks/useQueueCache';

export const DwDispositionGate: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const stateLead = location.state || {};
  const userId = stateLead.userId || '';

  // Form States
  const [outcome, setOutcome] = useState<'connected' | 'not_connected' | 'callback_later' | ''>('');
  const [disposition, setDisposition] = useState<'interested' | 'not_interested' | 'callback' | 'already_subs' | ''>('');
  
  // Specific detail states
  const [selectedPlan, setSelectedPlan] = useState<'ready' | 'verified' | 'trusted' | ''>('');
  const [linkSentToggle, setLinkSentToggle] = useState<'yes' | 'no'>('no');
  const [rejectionReason, setRejectionReason] = useState('');
  const [callbackDate, setCallbackDate] = useState(new Date().toISOString().split('T')[0]);
  const [callbackTime, setCallbackTime] = useState('12:00');
  const [finalNotes, setFinalNotes] = useState('');

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const { data: detailResponse } = useGetDwLeadDetailQuery(userId, { skip: !userId });
  const { data: dispositionOptions } = useGetDwDispositionOptionsQuery();
  const [submitFeedback] = useSubmitDwFeedbackMutation();
  const [scheduleDwCallback] = useScheduleDwCallbackMutation();

  const driverProfile = detailResponse?.data?.profile;
  const leadName = driverProfile?.name || stateLead.name || 'Driver Lead';
  const leadTmid = driverProfile?.tmid || stateLead.tmid || 'DR-48291';

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleExitBlocked = () => {
    triggerToast('⚠️ Exit blocked. You must save call disposition details before leaving.');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userId) return;

    let dbFeedback = 'Ringing - No Answer';
    if (outcome === 'connected') {
      if (disposition === 'interested') dbFeedback = 'Agree for Subscription';
      else if (disposition === 'not_interested') dbFeedback = rejectionReason || 'Not Interested';
      else if (disposition === 'callback') dbFeedback = 'Busy Right Now';
      else if (disposition === 'already_subs') dbFeedback = 'Already Subscribed';
    } else if (outcome === 'not_connected') {
      dbFeedback = 'Ringing - No Answer';
    }

    try {
      await submitFeedback({
        user_id: Number(userId),
        call_status: outcome,
        call_feedback: dbFeedback,
        call_remarks: finalNotes || 'Disposition submitted from Gated Screen',
        call_duration: 0
      }).unwrap();

      if (disposition === 'callback' || outcome === 'callback_later') {
        await scheduleDwCallback({
          user_id: Number(userId),
          reason: `Callback scheduled for ${callbackDate} ${callbackTime}. Notes: ${finalNotes}`
        }).unwrap();
      }

      invalidateQueueCache();

      triggerToast('Disposition logged successfully ✓');
      setTimeout(() => {
        navigate('/dw/dw-call-queue');
      }, 800);
    } catch (err) {
      triggerToast('Failed to save disposition.');
    }
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
          Active Lead: <span className="text-gray-800 font-semibold">{leadName}</span> · {leadTmid}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Step 1: Call Outcome */}
        <section className="space-y-3">
          <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">Step 1 — Call Outcome *</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'connected', label: 'Connected', icon: 'check_circle' },
              { id: 'not_connected', label: 'No Answer / NR', icon: 'phone_disabled' },
              { id: 'callback_later', label: 'Callback Later', icon: 'timer' }
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

        {/* Step 2: Client Response */}
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

        {/* Interested Subscription Details */}
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

        {/* Not Interested Details */}
        {outcome === 'connected' && disposition === 'not_interested' && (
          <section className="bg-gray-50 p-4 border border-gray-200 rounded-xl space-y-3 text-xs animate-in fade-in duration-300">
            <label className="font-bold text-gray-700 block mb-1">Reason for Rejection *</label>
            <select 
              value={rejectionReason} 
              onChange={(e) => setRejectionReason(e.target.value)}
              className="w-full h-10 px-3 bg-white border border-gray-200 rounded-lg outline-none text-xs text-gray-800"
            >
              <option value="">Select a reason...</option>
              {dispositionOptions?.data?.feedbacks.map(f => (
                <option key={f.value} value={f.value}>{f.label}</option>
              ))}
            </select>
          </section>
        )}

        {/* Callback Date/Time */}
        {(disposition === 'callback' || outcome === 'callback_later') && (
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

        {/* Step 4: Remarks */}
        {outcome && (
          <section className="space-y-2 text-xs">
            <label className="font-bold text-gray-700 block">General Remarks / Notes</label>
            <textarea 
              value={finalNotes}
              onChange={(e) => setFinalNotes(e.target.value)}
              className="w-full min-h-[80px] p-3 border border-gray-200 rounded-lg focus:ring-1 focus:ring-[#27AE60] outline-none text-xs resize-none" 
              placeholder="Add call remarks..."
            />
          </section>
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
              (outcome === 'connected' && disposition === 'not_interested' && !rejectionReason)
            }
            className={`flex-grow h-12 font-bold text-xs rounded-lg flex items-center justify-center gap-1 shadow-md uppercase transition-all ${
              (!outcome || 
               (outcome === 'connected' && !disposition) ||
               (outcome === 'connected' && disposition === 'interested' && !selectedPlan) ||
               (outcome === 'connected' && disposition === 'not_interested' && !rejectionReason))
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
