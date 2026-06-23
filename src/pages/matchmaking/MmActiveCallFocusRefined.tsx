import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface CallState {
  driverName: string;
  driverTmid: string;
  jobId: string;
  jobRoute: string;
  jobTransporter: string;
  jobTier: string;
}

export const MmActiveCallFocusRefined: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();



  // Resolve state passed from navigation
  const state: CallState = location.state || {
    driverName: 'Suresh Yadav',
    driverTmid: 'DR-48291',
    jobId: 'JD-12034',
    jobRoute: 'Delhi ➔ Mumbai',
    jobTransporter: 'Sharma Logistics',
    jobTier: 'SUPER PREMIUM'
  };

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Call duration state
  const [seconds, setSeconds] = useState(0);
  const [callConnected, setCallConnected] = useState(false);
  const [markedInterested, setMarkedInterested] = useState(false);

  // Modal post-call state
  const [showPostCallModal, setShowPostCallModal] = useState(false);
  const [outcome, setOutcome] = useState<'Connected' | 'NR' | 'Busy' | 'Switch Off'>('Connected');
  const [connectedSubOutcome, setConnectedSubOutcome] = useState<'Interested' | 'NotInterested' | 'Callback' | 'AlreadyPlaced'>('Interested');
  const [createWaGroup, setCreateWaGroup] = useState(true);
  const [rejectionReason, setRejectionReason] = useState('Route doesn\'t suit');
  const [callbackDate, setCallbackDate] = useState('2026-06-20');
  const [callbackTime, setCallbackTime] = useState('10:00');
  const [callNotes, setCallNotes] = useState('');
  const [scriptTab, setScriptTab] = useState<'opening' | 'interest' | 'intro' | 'rejection' | 'closure'>('opening');
  const [objectionQuery, setObjectionQuery] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Timer effect
  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  // Quick disposition tags
  const handleQuickDisp = (disp: 'Connected' | 'NR' | 'Busy' | 'Switch Off') => {
    setOutcome(disp);
    if (disp === 'Connected') {
      setCallConnected(true);
      triggerToast('Call status set: Connected');
    } else {
      setCallConnected(false);
      triggerToast(`Call status set: ${disp}`);
    }
  };

  const handleEndCall = () => {
    setShowPostCallModal(true);
  };

  const handlePostCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (outcome === 'Connected' && (connectedSubOutcome === 'Interested' || markedInterested)) {
      if (createWaGroup) {
        // Direct route to 3-Way Intro Manager
        navigate('/mm/mm-intro-manager', {
          state: {
            jobId: state.jobId,
            jobRoute: state.jobRoute,
            jobTransporter: state.jobTransporter,
            driverName: state.driverName,
            driverTmid: state.driverTmid
          }
        });
        return;
      }
    }

    // Return to Job Board for other outcomes
    navigate('/mm/mm-job-board');
    triggerToast('Call outcome logged successfully ✓');
  };

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
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toastMessage}
        </div>
      )}

      {/* Main Calling Cockpit Panel (Left) */}
      <section className="flex-1 flex flex-col min-w-0 border-r border-gray-200">
        
        {/* Top Strip */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-3">
            <span className="w-2.5 h-2.5 rounded-full bg-red-650 animate-ping"></span>
            <span className="font-mono font-extrabold text-gray-800 text-sm tracking-widest">{formatTime(seconds)}</span>
            <span className="text-gray-400">|</span>
            <div>
              <span className="font-extrabold text-gray-900 text-sm">{state.driverName}</span>
              <span className="text-gray-450 font-mono block text-[10px] mt-0.5">{state.driverTmid}</span>
            </div>
          </div>

          <div className="flex gap-2">
            {['Connected', 'NR', 'Busy', 'Switch Off'].map(disp => {
              const isActive = outcome === disp;
              return (
                <button
                  key={disp}
                  onClick={() => handleQuickDisp(disp as any)}
                  className={`px-3 py-1 rounded font-bold border transition-colors ${
                    isActive 
                      ? 'bg-purple-100 border-[#8E44AD] text-[#7D3C98]' 
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-105'
                  }`}
                >
                  {disp}
                </button>
              );
            })}
          </div>
        </div>

        {/* Work Area */}
        <div className="flex-1 p-4 space-y-4 overflow-y-auto">
          
          {/* JOB CONTEXT CHIP */}
          <div className="bg-[#F4ECF7] border border-[#8E44AD] rounded-xl p-4 shadow-sm select-none">
            <span className="text-[10px] font-extrabold text-[#7D3C98] uppercase tracking-wider block">CALLING CONTEXT: JOB POSTING</span>
            <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-2.5 font-bold text-gray-700">
              <div>Job ID: <span className="font-mono text-gray-900">{state.jobId}</span></div>
              <div>Transporter: <span className="text-gray-900">{state.jobTransporter}</span></div>
              <div>Route: <span className="text-gray-900">{state.jobRoute}</span></div>
              <div>Plan Tier: <span className="text-gray-900 text-purple-700 bg-purple-50 px-1.5 py-0.2 rounded border border-purple-200 text-[10px]">{state.jobTier}</span></div>
            </div>
          </div>

          {/* INTERESTED QUICK ACTION */}
          {(callConnected || outcome === 'Connected') && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-xl flex justify-between items-center shadow-sm">
              <div>
                <h4 className="font-bold text-green-800">Driver confirmed interest?</h4>
                <p className="text-[10px] text-green-600 mt-0.5">Pre-flags Post-Call Form to load 3-Way Intro Manager stepper.</p>
              </div>
              <button
                onClick={() => { setMarkedInterested(true); setConnectedSubOutcome('Interested'); handleEndCall(); }}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-bold shadow flex items-center gap-1 transition-all active:scale-95"
              >
                <span>Mark Interested — Start Intro</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          )}

          {/* Caller Note field */}
          <div className="space-y-1.5 pt-2">
            <label className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Quick call logs / notes</label>
            <input 
              type="text"
              value={callNotes}
              onChange={(e) => setCallNotes(e.target.value)}
              placeholder="Type driver notes here (auto-saved every 5s)..."
              className="w-full border border-gray-200 rounded-xl p-3 outline-none font-medium text-gray-800 focus:border-[#8E44AD]"
            />
          </div>
        </div>

        {/* End Call Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 shrink-0">
          <button
            onClick={handleEndCall}
            className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold shadow-md flex items-center gap-1.5 transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-base">phone_disabled</span>
            <span>End Call &amp; Log Disposition</span>
          </button>
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
            {[
              { id: 'opening', label: 'Opening' },
              { id: 'interest', label: 'Pitch Details' },
              { id: 'intro', label: '3-Way Intro' },
              { id: 'rejection', label: 'Rejection/Objections' },
              { id: 'closure', label: 'Closure' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setScriptTab(tab.id as any)}
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
                <p>"नमस्ते सुरेश जी, मैं ट्रकमित्र से बात कर रहा हूँ। आपकी प्रोफाइल पर भारी गाड़ी का अनुभव देखकर मैंने आपको इस दिल्ली ➔ मुंबई सुपर प्रीमियम रूट के लिए शॉर्टलिस्ट किया है।"</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[9px] text-gray-400 uppercase font-semibold">Opening Pitch</span>
                  <button className="text-[#8E44AD] font-bold text-[10px] flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">play_arrow</span> Listen
                  </button>
                </div>
              </div>
            )}

            {scriptTab === 'interest' && (
              <div className="bg-white border border-gray-150 p-3 rounded-xl shadow-sm space-y-2">
                <p>"सर, यह ट्रिप शर्मा लॉजिस्टिक्स के साथ ३ महीने की अवधि का है। इसमें प्रति ट्रिप समय पर भुगतान और अतिरिक्त भत्ते भी शामिल हैं।"</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[9px] text-gray-400 uppercase font-semibold">Pitch details</span>
                  <button className="text-[#8E44AD] font-bold text-[10px] flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">play_arrow</span> Listen
                  </button>
                </div>
              </div>
            )}

            {scriptTab === 'intro' && (
              <div className="bg-white border border-gray-150 p-3 rounded-xl shadow-sm space-y-2">
                <p>"सुरेश जी, सहमति होने पर मैं आपका और शर्मा लॉजिस्टिक्स के राजीव जी का एक ३-वे व्हाट्सएप ग्रुप बना देता हूँ, जहाँ आप सीधे ट्रिप फाइनल कर सकते हैं।"</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[9px] text-gray-400 uppercase font-semibold">Handover process</span>
                  <button className="text-[#8E44AD] font-bold text-[10px] flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">play_arrow</span> Listen
                  </button>
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
                <p>"धन्यवाद सुरेश जी, ग्रुप डिटेल्स आपके नंबर पर भेज दी गई हैं। ऑल द बेस्ट।"</p>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-[9px] text-gray-400 uppercase font-semibold">Closing statement</span>
                  <button className="text-[#8E44AD] font-bold text-[10px] flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-xs">play_arrow</span> Listen
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* POST-CALL FORM MODAL (Blocking modal) */}
      {showPostCallModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100 text-xs">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-1">
              <span className="material-symbols-outlined text-purple-650">fact_check</span>
              Log Call Disposition
            </h3>

            <form onSubmit={handlePostCallSubmit} className="space-y-4">
              
              {/* Step 1: Outcome */}
              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Call Connection Status</label>
                <select 
                  value={outcome}
                  onChange={(e) => setOutcome(e.target.value as any)}
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 bg-white outline-none font-semibold text-gray-800"
                >
                  <option value="Connected">Connected</option>
                  <option value="NR">Not Reachable (NR)</option>
                  <option value="Busy">Busy</option>
                  <option value="Switch Off">Switch Off</option>
                </select>
              </div>

              {/* Step 2: Connected Sub outcomes */}
              {outcome === 'Connected' && (
                <>
                  <div>
                    <label className="text-gray-500 block mb-1 font-semibold">Driver Interest Level</label>
                    <select 
                      value={connectedSubOutcome}
                      onChange={(e) => setConnectedSubOutcome(e.target.value as any)}
                      className="w-full border border-gray-200 rounded px-2.5 py-1.5 bg-white outline-none font-semibold text-gray-800"
                    >
                      <option value="Interested">Interested in Job</option>
                      <option value="NotInterested">Not Interested</option>
                      <option value="Callback">Callback Requested</option>
                      <option value="AlreadyPlaced">Already Placed Elsewhere</option>
                    </select>
                  </div>

                  {/* Interested: WhatsApp option */}
                  {connectedSubOutcome === 'Interested' && (
                    <div className="flex items-center justify-between p-2.5 bg-purple-50/50 border border-purple-100 rounded-lg">
                      <span className="font-semibold text-[#7D3C98]">Create WhatsApp 3-Way Intro Group?</span>
                      <input 
                        type="checkbox" 
                        checked={createWaGroup}
                        onChange={(e) => setCreateWaGroup(e.target.checked)}
                        className="rounded text-[#8E44AD] focus:ring-[#8E44AD]"
                      />
                    </div>
                  )}

                  {/* Not Interested: rejection dropdown */}
                  {connectedSubOutcome === 'NotInterested' && (
                    <div className="space-y-2">
                      <div>
                        <label className="text-gray-500 block mb-1 font-semibold">Rejection Reason</label>
                        <select 
                          value={rejectionReason}
                          onChange={(e) => setRejectionReason(e.target.value)}
                          className="w-full border border-gray-200 rounded px-2.5 py-1.5 bg-white outline-none font-semibold text-gray-800"
                        >
                          <option value="Route doesn't suit">Route doesn't suit</option>
                          <option value="Truck type mismatch">Truck type mismatch</option>
                          <option value="Pay not acceptable">Pay not acceptable</option>
                          <option value="Already placed">Already placed</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <p className="text-[10px] text-gray-400 italic">This driver will be removed from this job's shortlist only.</p>
                    </div>
                  )}

                  {/* Callback: scheduler */}
                  {connectedSubOutcome === 'Callback' && (
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-gray-500 block mb-1 font-semibold">Callback Date</label>
                        <input 
                          type="date"
                          value={callbackDate}
                          onChange={(e) => setCallbackDate(e.target.value)}
                          className="w-full border border-gray-200 rounded p-1 outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-gray-500 block mb-1 font-semibold">Callback Time</label>
                        <input 
                          type="time"
                          value={callbackTime}
                          onChange={(e) => setCallbackTime(e.target.value)}
                          className="w-full border border-gray-200 rounded p-1 outline-none"
                        />
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Step 4: Text Notes */}
              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Disposition Remarks</label>
                <textarea 
                  value={callNotes}
                  onChange={(e) => setCallNotes(e.target.value)}
                  placeholder="Summarize the driver's response remarks..."
                  rows={2}
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 outline-none font-medium text-gray-800 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowPostCallModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#8E44AD] hover:bg-[#7D3C98] text-white rounded font-bold shadow-sm"
                >
                  Submit &amp; Continue ➔
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};

export default MmActiveCallFocusRefined;
