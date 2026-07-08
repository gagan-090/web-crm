import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';
import { useMmCallFlow } from './useMmCallFlow';

// ── MM Active Call Cockpit ───────────────────────────────────────────────────
//
// This screen is a live view over the REAL SanCti call (useClickToCall routes
// matchmaking click-to-call dials here). It renders callState/callDuration
// straight from the provider — no local timer — and ends calls via the
// provider's hangup(), which triggers the global PostCallDispositionModal.
// It deliberately has NO disposition form of its own: the previous version
// kept a second fake timer and logged a duplicate jobs_match_making row via
// the legacy /web-crm/mm/call/log endpoint, alongside the global modal's
// record. useMmCallFlow is mounted so a disposition submitted while on this
// screen still syncs the pending job-linked MM row.

interface CallContext {
  name?: string;
  tmid?: string;
  jobId?: string;
  jobRoute?: string;
  jobTransporter?: string;
  jobTier?: string;
  driverName?: string;
  driverTmid?: string;
}

export const MmActiveCallFocusRefined: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const ctx: CallContext = location.state || {};

  const {
    callState,
    callDuration,
    currentLeadName,
    currentLeadTmid,
    currentPhoneNumber,
    hangup,
    isMuted,
    toggleMute,
    isHeld,
    toggleHold,
  } = useSanCti();

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [scriptTab, setScriptTab] = useState<'opening' | 'interest' | 'intro' | 'rejection' | 'closure'>('opening');
  const [objectionQuery, setObjectionQuery] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Keeps the job-linked MM row in sync if the agent submits the global
  // disposition modal while sitting on this screen.
  useMmCallFlow({
    onToast: triggerToast,
    onLogSaved: (p) => triggerToast(`Disposition saved for ${p.name} ✓`),
  });

  const leadName = currentLeadName || ctx.driverName || ctx.name || 'No active lead';
  const leadTmid = currentLeadTmid || ctx.driverTmid || ctx.tmid || '';

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const stateLabel: Record<string, { label: string; cls: string }> = {
    idle: { label: 'No Active Call', cls: 'bg-gray-100 text-gray-500' },
    dialing: { label: 'Dialing…', cls: 'bg-amber-100 text-amber-700' },
    ringing: { label: 'Ringing…', cls: 'bg-amber-100 text-amber-700' },
    connected: { label: 'Connected', cls: 'bg-green-100 text-green-700' },
    incoming_ringing: { label: 'Incoming Call', cls: 'bg-blue-100 text-blue-700' },
    disposition_pending: { label: 'Log Disposition', cls: 'bg-purple-100 text-purple-700' },
  };
  const st = stateLabel[callState] || stateLabel.idle;

  // objection script cards
  const objections = [
    { q: 'Paise kitne milenge?', a: 'सर, इस सुपर प्रीमियम ट्रिप के लिए ट्रांसपोर्टर ₹35,000 एडवांस दे रहे हैं और बाकी डिलीवरी के तुरंत बाद। यह मार्केट रेट से ज़्यादा है।' },
    { q: 'Route mujhe nahi pata', a: 'चिंता न करें, गाड़ी जीपीएस ट्रैकिंग के साथ है और कंपनी की तरफ से रूट गाइडेंस की पूरी मदद मिलेगी।' },
    { q: 'Truck mere paas nahi', a: 'यह कंपनी-प्रदत्त (Company-Provided) गाड़ी की वैकेंसी है, आपको सिर्फ ड्राइव करना है।' },
    { q: 'Already kaam chal raha hai', a: 'कोई बात नहीं सर, मैं आपकी उपलब्धता को १० दिन बाद के लिए डाल देता हूँ, जब यह ट्रिप ख़त्म हो जाएगी।' }
  ];

  const filteredObjections = objections.filter(obj =>
    obj.q.toLowerCase().includes(objectionQuery.toLowerCase()) ||
    obj.a.toLowerCase().includes(objectionQuery.toLowerCase())
  );

  return (
    <main className="flex h-[calc(100vh-60px)] bg-white overflow-hidden relative text-xs">

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toastMessage}
        </div>
      )}

      {/* Main Calling Cockpit Panel (Left) */}
      <section className="flex-1 flex flex-col min-w-0 border-r border-gray-200">

        {/* Top Strip — live SanCti call state */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            {(callState === 'connected' || callState === 'ringing' || callState === 'dialing') && (
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></span>
            )}
            <span className="font-mono font-extrabold text-gray-800 text-sm tracking-widest">{formatTime(callDuration)}</span>
            <span className="text-gray-400">|</span>
            <div>
              <span className="font-extrabold text-gray-900 text-sm">{leadName}</span>
              <span className="text-gray-400 font-mono block text-[10px] mt-0.5">
                {leadTmid}{currentPhoneNumber ? ` · ${currentPhoneNumber}` : ''}
              </span>
            </div>
          </div>
          <span className={`px-3 py-1 rounded-lg font-bold ${st.cls}`}>{st.label}</span>
        </div>

        {/* Work Area */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">

          {/* JOB CONTEXT CHIP */}
          {ctx.jobId ? (
            <div className="bg-[#F4ECF7] border border-[#8E44AD] rounded-xl p-4 shadow-sm select-none">
              <span className="text-[10px] font-extrabold text-[#7D3C98] uppercase tracking-wider block">CALLING CONTEXT: JOB POSTING</span>
              <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2.5 font-bold text-gray-700">
                <div>Job ID: <span className="font-mono text-gray-900">{ctx.jobId}</span></div>
                {ctx.jobTransporter && <div>Transporter: <span className="text-gray-900">{ctx.jobTransporter}</span></div>}
                {ctx.jobRoute && <div>Route: <span className="text-gray-900">{ctx.jobRoute}</span></div>}
                {ctx.jobTier && <div>Plan Tier: <span className="text-purple-700 bg-purple-50 px-1.5 rounded border border-purple-200 text-[10px]">{ctx.jobTier}</span></div>}
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-400 font-semibold">
              No job context — dial from a job's applicant list to link this call to a job.
            </div>
          )}

          {/* Post-call handoff */}
          {callState === 'connected' && ctx.jobId && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
              <div>
                <h4 className="font-bold text-green-800">Driver confirmed interest?</h4>
                <p className="text-[10px] text-green-600 mt-0.5">Hang up, log the disposition, then start the 3-Way Intro.</p>
              </div>
              <button
                onClick={() => navigate('/mm/mm-intro-manager', {
                  state: {
                    jobId: ctx.jobId,
                    jobRoute: ctx.jobRoute,
                    jobTransporter: ctx.jobTransporter,
                    driverName: leadName,
                    driverTmid: leadTmid,
                  }
                })}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold shadow flex items-center gap-1 transition-all active:scale-95"
              >
                <span>Open 3-Way Intro Manager</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          )}

          {callState === 'idle' && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-700 font-semibold">
              Start calls from the <button onClick={() => navigate('/mm/mm-job-board')} className="underline font-bold">Job Board</button> — pick a job, then call its transporter or applicants. The call bar and feedback form appear automatically.
            </div>
          )}
        </div>

        {/* Live Call Controls Footer — real SanCti controls */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0 flex items-center gap-2">
          {callState === 'connected' && (
            <>
              <button
                onClick={toggleHold}
                className={`px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 ${isHeld ? 'bg-amber-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              >
                {isHeld ? 'Resume' : 'Hold'}
              </button>
              <button
                onClick={toggleMute}
                className={`px-4 py-2.5 rounded-xl font-bold shadow-sm transition-all active:scale-95 ${isMuted ? 'bg-red-500 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100'}`}
              >
                {isMuted ? 'Unmute' : 'Mute'}
              </button>
            </>
          )}
          {(callState === 'connected' || callState === 'ringing' || callState === 'dialing') ? (
            <button
              onClick={hangup}
              className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95 ml-auto"
            >
              <span className="material-symbols-outlined text-base">phone_disabled</span>
              <span>End Call — Disposition Opens Automatically</span>
            </button>
          ) : (
            <span className="text-gray-400 font-semibold ml-auto">
              {callState === 'disposition_pending' ? 'Complete the disposition form to continue.' : 'No call in progress.'}
            </span>
          )}
        </div>

      </section>

      {/* Script Panel Column (Right) */}
      <aside className="w-96 p-4 bg-gray-50/50 flex flex-col justify-between shrink-0 overflow-y-auto">
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide border-b border-gray-200 pb-2">
            Match Pitch Scripts
          </h3>

          {/* Sub tabs navigation */}
          <div className="flex gap-2 border-b border-gray-200 text-[10px] font-bold pb-1 overflow-x-auto whitespace-nowrap">
            {([
              { id: 'opening', label: 'Opening' },
              { id: 'interest', label: 'Pitch Details' },
              { id: 'intro', label: '3-Way Intro' },
              { id: 'rejection', label: 'Rejection/Objections' },
              { id: 'closure', label: 'Closure' }
            ] as const).map(tab => (
              <button
                key={tab.id}
                onClick={() => setScriptTab(tab.id)}
                className={`pb-1 transition-colors ${
                  scriptTab === tab.id ? 'border-b-2 border-[#8E44AD] text-gray-800 font-extrabold' : 'text-gray-400'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div className="space-y-3.5 leading-relaxed text-[11.5px] text-gray-700 font-medium font-devanagari">
            {scriptTab === 'opening' && (
              <div className="bg-white border border-gray-150 p-3 rounded-xl shadow-sm space-y-2">
                <p>"नमस्ते जी, मैं ट्रकमित्र से बात कर रहा हूँ। आपकी प्रोफाइल पर भारी गाड़ी का अनुभव देखकर मैंने आपको इस रूट के लिए शॉर्टलिस्ट किया है।"</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[9px] text-gray-400 uppercase font-semibold">Opening Pitch</span>
                </div>
              </div>
            )}

            {scriptTab === 'interest' && (
              <div className="bg-white border border-gray-150 p-3 rounded-xl shadow-sm space-y-2">
                <p>"सर, यह ट्रिप {'{transporter}'} के साथ ३ महीने की अवधि का है। इसमें प्रति ट्रिप समय पर भुगतान और अतिरिक्त भत्ते भी शामिल हैं।"</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[9px] text-gray-400 uppercase font-semibold">Pitch details</span>
                </div>
              </div>
            )}

            {scriptTab === 'intro' && (
              <div className="bg-white border border-gray-150 p-3 rounded-xl shadow-sm space-y-2">
                <p>"जी, सहमति होने पर मैं आपका और ट्रांसपोर्टर जी का एक ३-वे व्हाट्सएप ग्रुप बना देता हूँ, जहाँ आप सीधे ट्रिप फाइनल कर सकते हैं।"</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[9px] text-gray-400 uppercase font-semibold">Handover process</span>
                </div>
              </div>
            )}

            {scriptTab === 'rejection' && (
              <div className="space-y-3">
                {/* Search bar inside rejection */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search objections..."
                    value={objectionQuery}
                    onChange={(e) => setObjectionQuery(e.target.value)}
                    className="w-full pl-7 pr-3 py-1 bg-white border border-gray-200 rounded-lg text-[10.5px] outline-none"
                  />
                  <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
                </div>

                <div className="space-y-2 max-h-[300px] overflow-y-auto custom-scrollbar">
                  {filteredObjections.map((obj, i) => (
                    <div key={i} className="bg-white border border-gray-150 p-3 rounded-xl shadow-sm space-y-1.5">
                      <p className="font-extrabold text-red-700">Q: "{obj.q}"</p>
                      <p className="text-gray-800 leading-normal">A: "{obj.a}"</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {scriptTab === 'closure' && (
              <div className="bg-white border border-gray-150 p-3 rounded-xl shadow-sm space-y-2">
                <p>"धन्यवाद जी, ग्रुप डिटेल्स आपके नंबर पर भेज दी गई हैं। ऑल द बेस्ट।"</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[9px] text-gray-400 uppercase font-semibold">Closing statement</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>
    </main>
  );
};

export default MmActiveCallFocusRefined;
