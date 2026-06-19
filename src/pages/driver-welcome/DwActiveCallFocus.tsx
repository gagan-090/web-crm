import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface Objection {
  key: string;
  question: string;
  answer: string;
}

export const DwActiveCallFocus: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Load state from routing if available, else use default mock
  const stateLead = location.state || {};
  const leadName = stateLead.name || 'Suresh Yadav';
  const leadTmid = stateLead.tmid || 'DR-48291';
  const leadPhone = stateLead.phone || '+91-98765-43210';
  const leadLocation = stateLead.location || 'Agra, Uttar Pradesh';

  // Live timer state
  const [seconds, setSeconds] = useState(154); // starts at 02:34
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(false);
  const [activeTab, setActiveTab] = useState<'opening' | 'jobReady' | 'verified' | 'trusted' | 'objections' | 'closing'>('opening');

  // Interactive link trigger
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Job Ready ₹199');
  
  // Note state
  const [quickNote, setQuickNote] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);

  // Search and bookmark state for objections
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>([]);

  // Post-Call Form Overlay State
  const [showPostCallModal, setShowPostCallModal] = useState(false);
  const [outcome, setOutcome] = useState<'connected' | 'nr' | 'busy' | 'wrong' | 'off' | ''>('');
  const [connectedSubStatus, setConnectedSubStatus] = useState<'interested' | 'not_interested' | 'callback' | 'subscribed' | ''>('');
  
  // Post-Call details
  const [interestedPlan, setInterestedPlan] = useState<'ready' | 'verified' | 'trusted' | ''>('');
  const [linkSentToggle, setLinkSentToggle] = useState<'yes' | 'no'>('no');
  const [notInterestedReason, setNotInterestedReason] = useState('');
  const [callbackDate, setCallbackDate] = useState('2026-06-20');
  const [callbackTime, setCallbackTime] = useState('11:30');
  const [dispositionNotes, setDispositionNotes] = useState('');
  const [escalateChoice, setEscalateChoice] = useState<'yes' | 'no' | ''>('');

  // Toast message
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timer tick
  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTimer = (secCount: number) => {
    const mins = Math.floor(secCount / 60);
    const secs = secCount % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSendPaymentLink = () => {
    triggerToast(`Payment link sent ✓`);
    setShowLinkModal(false);
  };

  // Quick note auto-saving
  const handleNoteChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuickNote(e.target.value);
    setNoteSaving(true);
  };

  useEffect(() => {
    if (quickNote) {
      const delayDebounceFn = setTimeout(() => {
        setNoteSaving(false);
      }, 1000);
      return () => clearTimeout(delayDebounceFn);
    }
  }, [quickNote]);

  // Hindi objections data from spec
  const objections: Objection[] = [
    { key: 'paisa', question: 'पैसे नहीं हैं', answer: 'राजेश जी, यह एक छोटा निवेश है जो आपके व्यवसाय को कई गुना बढ़ा देगा। केवल ₹199 या ₹299 के निवेश से आपको तुरंत लोड बुकिंग मिलना शुरू हो जाएगी और आप पहले ही दिन अपनी लागत निकाल लेंगे।' },
    { key: 'job', question: 'पहले कोई जॉब नहीं मिली', answer: 'हम समझते हैं राजेश जी, लेकिन ट्रक मित्र पर 50,000 से अधिक ड्राइवर्स रोजाना लोड पा रहे हैं। हमारी टीम आपको पहला लोड बुक कराने में खुद मदद करेगी।' },
    { key: 'baad', question: 'सोचता हूँ, बाद में करूंगा', answer: 'राजेश जी, अभी ऑफर्स चल रहे हैं और कई ट्रांसपोर्टर्स तुरंत ड्राइवर्स ढूंढ रहे हैं। अगर आप अभी शुरू करते हैं तो आज ही काम मिलना आसान रहेगा।' },
    { key: 'fraud', question: 'यह सब fraud है', answer: 'विश्वास रखिए राजेश जी, हम पूरी तरह से सरकारी मान्यता प्राप्त हैं और हमारे पास 50,000+ ड्राइवर्स का नेटवर्क है। आप चाहें तो पहले कम राशि का ₹199 का प्लान लेकर स्वयं जांच सकते हैं।' },
    { key: 'delete', question: 'App delete कर दी', answer: 'कोई बात नहीं राजेश जी, मैं आपके व्हाट्सएप पर डायरेक्ट ऐप का डाउनलोड लिंक और वीडियो भेज रहा हूँ। उसे देखकर आप 2 मिनट में दोबारा इंस्टॉल कर सकते हैं।' },
    { key: 'gaadi', question: 'ट्रक नहीं है / खुद गाड़ी नहीं है', answer: 'राजेश जी, हमारे पास ऐसे भी ट्रांसपोर्टर्स हैं जो बिना गाड़ी वाले ड्राइवर्स को सीधे मंथली सैलरी पर जॉब दे रहे हैं। हम आपको वैसी ही नौकरियों के लिए सजेस्ट करेंगे।' }
  ];

  const toggleBookmark = (key: string) => {
    setBookmarks(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  // Sort objections to place bookmarked items on top
  const getSortedObjections = () => {
    let list = [...objections];
    if (searchQuery) {
      list = list.filter(obj => 
        obj.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        obj.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        obj.key.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    list.sort((a, b) => {
      const aBook = bookmarks.includes(a.key) ? 1 : 0;
      const bBook = bookmarks.includes(b.key) ? 1 : 0;
      return bBook - aBook;
    });
    return list;
  };

  const sortedObjections = getSortedObjections();

  // Submit Disposition
  const handleDispositionSubmit = () => {
    // Navigate back to queue after a successful conversion toast
    if (outcome === 'connected' && connectedSubStatus === 'interested' && interestedPlan) {
      triggerToast('Marked as Converted ✓');
    } else {
      triggerToast('Disposition logged successfully');
    }
    
    // Frictionless loop: transition immediately to Call Queue
    setTimeout(() => {
      navigate('/dw/dw-call-queue');
    }, 500);
  };

  return (
    <main className="h-[calc(100vh-80px)] flex bg-white overflow-hidden border border-gray-200 rounded-xl relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#27AE60]"></span>
          {toastMessage}
        </div>
      )}

      {/* LEFT COLUMN: Controls & Call Context */}
      <section className="w-[380px] border-r border-gray-200 flex flex-col p-5 bg-gray-50/50 shrink-0 overflow-y-auto">
        
        {/* Top Strip */}
        <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-600 animate-ping"></span>
              <span className="font-mono text-xl font-bold text-gray-800">{formatTimer(seconds)}</span>
            </div>
            
            {/* Audio Toggles */}
            <div className="flex items-center gap-1">
              <button 
                onClick={() => { setIsMuted(!isMuted); triggerToast(isMuted ? 'Microphone active' : 'Microphone muted'); }}
                className={`p-1.5 rounded-lg border text-xs flex items-center justify-center transition-all ${isMuted ? 'bg-red-50 border-red-200 text-red-600 font-bold' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                title="Mute"
              >
                <span className="material-symbols-outlined text-[18px]">{isMuted ? 'mic_off' : 'mic'}</span>
              </button>
              <button 
                onClick={() => { setIsSpeaker(!isSpeaker); triggerToast(isSpeaker ? 'Speaker off' : 'Speaker on'); }}
                className={`p-1.5 rounded-lg border text-xs flex items-center justify-center transition-all ${isSpeaker ? 'bg-[#EAFAF1] border-[#27AE60] text-[#27AE60] font-bold' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
                title="Speaker"
              >
                <span className="material-symbols-outlined text-[18px]">volume_up</span>
              </button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2 font-semibold">
            Active: <span className="text-gray-800">{leadName}</span> · <span className="font-mono">{leadTmid}</span> · <span className="text-gray-600">{leadPhone}</span> · <span className="text-gray-600">{leadLocation}</span>
          </div>
        </div>

        {/* PLAN PRICE REFERENCE CARD (PALE YELLOW, UNDISMISSABLE) */}
        <div className="bg-[#FFF9E6] border border-[#F39C12] rounded-xl p-4 mb-4 select-none">
          <div className="text-xs font-bold text-[#D35400] mb-2 uppercase tracking-wide">
            📌 CURRENT PRICES — Effective Jun 2, 2026
          </div>
          <div className="space-y-1.5 text-xs text-[#7F8C8D]">
            <div className="flex justify-between">
              <span className="font-medium text-[#2C3E50]">Job Ready Plan</span>
              <span className="font-mono font-bold text-[#D35400]">₹199 / 3 months</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-[#2C3E50]">Verified Plan</span>
              <span className="font-mono font-bold text-[#D35400]">₹299 / 3 months</span>
            </div>
            <div className="flex justify-between">
              <span className="font-medium text-[#2C3E50]">Trusted Plan</span>
              <span className="font-mono font-bold text-[#D35400]">₹499 / 3 months</span>
            </div>
          </div>
        </div>

        {/* Quick Disposition Row */}
        <div className="mb-4">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Live Connection Pre-disposition</div>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'connected', label: 'Connected', icon: 'check_circle' },
              { id: 'nr', label: 'No Response', icon: 'phone_disabled' },
              { id: 'busy', label: 'Busy', icon: 'timer' },
              { id: 'off', label: 'Switch Off', icon: 'power_off' }
            ].map(disp => (
              <button 
                key={disp.id}
                onClick={() => {
                  triggerToast(`Pre-logged: ${disp.label}`);
                  // Auto-fill Step 1 outcome if they click here to minimize post-call entry time
                  setOutcome(disp.id as any);
                }}
                className="h-14 border border-gray-200 bg-white rounded-lg hover:bg-gray-100 flex flex-col items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-gray-500">{disp.icon}</span>
                <span className="text-[10px] font-bold text-gray-700 mt-1">{disp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Send Payment Link Button (Orange) */}
        <div className="mb-4">
          <button 
            onClick={() => setShowLinkModal(true)}
            className="w-full bg-[#FB641B] hover:bg-[#e4540d] text-white h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            Send Payment Link via WhatsApp
          </button>
        </div>

        {/* Quick Note Input */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quick Note</span>
            {noteSaving && <span className="text-[9px] text-gray-400 italic">saving...</span>}
          </div>
          <input
            type="text"
            value={quickNote}
            onChange={handleNoteChange}
            placeholder="Quick note while on call..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#27AE60] outline-none"
            maxLength={200}
          />
        </div>

        {/* End Call Button (Red, Bottom) */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          <button 
            onClick={() => setShowPostCallModal(true)}
            className="w-full bg-[#E74C3C] hover:bg-[#c0392b] text-white h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
          >
            <span className="material-symbols-outlined text-[18px]">call_end</span>
            End Call
          </button>
        </div>

      </section>

      {/* RIGHT COLUMN: Script Panel */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden">
        
        {/* Script Tab Bar */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto scrollbar-none shrink-0">
          {[
            { key: 'opening', label: 'Opening' },
            { key: 'jobReady', label: 'Job Ready Pitch' },
            { key: 'verified', label: 'Verified Upsell' },
            { key: 'trusted', label: 'Trusted Upsell' },
            { key: 'objections', label: 'Objections (Hindi)' },
            { key: 'closing', label: 'Closing' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-[#27AE60] text-[#27AE60] bg-white font-bold'
                  : 'border-transparent text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Script Content Area */}
        <div className="flex-grow overflow-y-auto p-6 min-h-0">
          <div className="max-w-[480px] mx-auto text-gray-800">
            
            {activeTab === 'opening' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Greeting Dialogue</h3>
                <div className="bg-[#EAFAF1]/30 border-l-4 border-[#27AE60] p-4 rounded-r-xl">
                  "नमस्ते <strong>{leadName}</strong> जी, मैं ट्रक मित्र से बात कर रहा हूँ। आपका नया प्रोफाइल हमारे पोर्टल पर दिखा है, पंजीकरण करने के लिए धन्यवाद! <br/><br/>
                  क्या यह सही समय है आपसे बात करने का? मैं आपकी प्रोफाइल को कम्प्लीट करवाने और नौकरी दिलाने के बारे में बातचीत करने के लिए कॉल कर रहा हूँ।"
                </div>
              </div>
            )}

            {activeTab === 'jobReady' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Job Ready Pitch (₹199)</h3>
                <div className="bg-[#EAFAF1]/30 border-l-4 border-[#27AE60] p-4 rounded-r-xl">
                  "राजेश जी, हमारा <strong>'जॉब रेडी'</strong> प्लान सिर्फ <strong>₹199</strong> का है जो 3 महीने के लिए रहेगा। <br/><br/>
                  इसमें आपकी प्रोफाइल को हम डायरेक्ट एक्टिवेट कर देंगे, जिससे आसपास के ऑर्डर्स और कांटेक्ट डिटेल्स आपको तुरंत दिखने लगेंगे। नए ड्राइवर्स के लिए यह सबसे किफायती प्लान है।"
                </div>
              </div>
            )}

            {activeTab === 'verified' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Verified Upsell (₹299)</h3>
                <div className="bg-[#EAFAF1]/30 border-l-4 border-[#27AE60] p-4 rounded-r-xl">
                  "राजेश जी, हमारा सबसे लोकप्रिय प्लान <strong>'Verified Plan'</strong> है जो <strong>₹299</strong> का है। <br/><br/>
                  इसमें आपकी प्रोफाइल पर <strong>'Verified Badge'</strong> (हरा टिक) लग जाता है। इससे ट्रांसपोर्टर्स और बड़े क्लाइंट्स का भरोसा बढ़ेगा और आपको 3 गुना अधिक बुकिंग मिलेंगी।"
                </div>
              </div>
            )}

            {activeTab === 'trusted' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Trusted Upsell (₹499)</h3>
                <div className="bg-[#EAFAF1]/30 border-l-4 border-[#27AE60] p-4 rounded-r-xl">
                  "राजेश जी, हमारा सबसे प्रीमियम प्लान <strong>'Trusted Plan'</strong> है जो <strong>₹499</strong> का है। <br/><br/>
                  इसमें आपको <strong>100% पेमेंट प्रोटेक्शन (Payment Protection)</strong> मिलता है। यानी आपकी कमाई पूरी तरह से सुरक्षित रहेगी और किसी भी विवाद में हमारी सपोर्ट टीम 24 घंटे आपके साथ खड़ी रहेगी।"
                </div>
              </div>
            )}

            {activeTab === 'objections' && (
              <div className="space-y-4 font-sans">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type objection keyword (e.g. paisa, fraud)..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#27AE60]"
                  />
                </div>

                {/* Bookmark row */}
                {bookmarks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">My Bookmarks:</span>
                    {bookmarks.map(key => (
                      <span key={key} className="bg-[#EAFAF1] text-[#27AE60] border border-[#27AE60]/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        ★ {objections.find(o => o.key === key)?.question}
                      </span>
                    ))}
                  </div>
                )}

                {/* Objections List */}
                <div className="space-y-3 mt-4">
                  {sortedObjections.map(obj => (
                    <div key={obj.key} className="border border-gray-200 rounded-xl p-4 bg-white relative hover:border-[#27AE60] transition-colors">
                      <div className="flex justify-between items-start pr-6">
                        <span className="text-sm font-bold text-red-600">{obj.question}</span>
                        <button 
                          onClick={() => toggleBookmark(obj.key)}
                          className={`absolute right-3 top-3 text-sm transition-colors ${bookmarks.includes(obj.key) ? 'text-yellow-500' : 'text-gray-300 hover:text-yellow-500'}`}
                        >
                          ★
                        </button>
                      </div>
                      <div className="mt-2 text-xs text-gray-600 bg-gray-50 p-2.5 rounded border border-gray-100 font-hindi leading-relaxed">
                        {obj.answer}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'closing' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Closing Script</h3>
                <div className="bg-[#EAFAF1]/30 border-l-4 border-[#27AE60] p-4 rounded-r-xl">
                  "तो राजेश जी, मैं आपके नंबर पर अभी 'Verified' प्लान का <strong>₹299</strong> का सुरक्षित पेमेंट लिंक भेज रहा हूँ। <br/><br/>
                  आप Google Pay, PhonePe या Paytm से सिर्फ 1 मिनट में पेमेंट कर सकते हैं। पेमेंट होते ही हमारी टीम आपको कॉल करके पहला लोड बुक करवा देगी।"
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Pulsing Voice Sync strip */}
        <div className="h-8 bg-gray-900 flex items-center px-4 justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60] animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">Exotel Softphone Active</span>
          </div>
          <span className="text-[9px] font-mono text-gray-500">Channel ID: EX-CDR-9028</span>
        </div>
      </section>

      {/* PAYMENT LINK MODAL */}
      {showLinkModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-3">Send Payment Link</h3>
            <div className="space-y-4 text-xs">
              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Choose Subscription Plan</label>
                <select 
                  value={selectedPlan} 
                  onChange={(e) => setSelectedPlan(e.target.value)}
                  className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 outline-none font-semibold text-gray-800"
                >
                  <option value="Job Ready ₹199">Job Ready — ₹199 (3 months)</option>
                  <option value="Verified ₹299">Verified — ₹299 (3 months)</option>
                  <option value="Trusted ₹499">Trusted — ₹499 (3 months)</option>
                </select>
              </div>
              
              <div className="p-3 bg-gray-50 rounded border border-gray-100 font-mono text-[11px] text-gray-500 leading-normal">
                💬 <span className="font-bold text-gray-700">WhatsApp Message:</span>
                <p className="mt-1 font-sans text-xs">"Hello {leadName}, thank you for choosing TruckMitr. Here is your payment link for {selectedPlan}: https://truckmitr.in/pay/dr-48291"</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  onClick={() => setShowLinkModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSendPaymentLink}
                  className="px-4 py-2 bg-[#FB641B] hover:bg-[#e4540d] text-white rounded font-bold transition-all shadow-sm"
                >
                  Send Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POST-CALL FORM GATED MODAL OVERLAY (BLOCKING) */}
      {showPostCallModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto relative">
            
            {/* Header */}
            <div className="border-b border-gray-100 pb-3 mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex justify-between items-center">
                <span>Log Call — {leadName}</span>
                <span className="font-mono text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{leadTmid}</span>
              </h2>
              <div className="text-[11px] text-gray-400 mt-1">
                19 Jun 2026, 11:06 AM · Duration: {formatTimer(seconds)} (Exotel Logged CDR)
              </div>
            </div>

            {/* Step 1 — Outcome (Outcome Select Cards) */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Step 1 — Call Outcome *</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'connected', label: 'Connected', desc: 'Call successfully answered' },
                  { id: 'nr', label: 'Not Reachable', desc: 'No response/Switch off' },
                  { id: 'busy', label: 'Busy', desc: 'Line busy/call declined' },
                  { id: 'wrong', label: 'Wrong Number', desc: 'Not a driver/incorrect phone' },
                  { id: 'off', label: 'Switch Off', desc: 'Switched off/Network issue' }
                ].map(op => (
                  <button
                    key={op.id}
                    onClick={() => {
                      setOutcome(op.id as any);
                      if (op.id !== 'connected') setConnectedSubStatus('');
                    }}
                    className={`p-3 border rounded-xl text-left transition-all ${
                      outcome === op.id 
                        ? 'border-[#27AE60] bg-[#EAFAF1]/30 ring-1 ring-[#27AE60]' 
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-gray-800">{op.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{op.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2 — Conditional on Connected */}
            {outcome === 'connected' && (
              <div className="space-y-3 mt-4">
                <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Step 2 — Client Response *</div>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'interested', label: 'Interested / Converted' },
                    { id: 'not_interested', label: 'Not Interested' },
                    { id: 'callback', label: 'Callback Requested' },
                    { id: 'subscribed', label: 'Already Subscribed' }
                  ].map(sub => (
                    <button
                      key={sub.id}
                      onClick={() => setConnectedSubStatus(sub.id as any)}
                      className={`p-2.5 border rounded-lg text-center font-semibold text-[11px] transition-all ${
                        connectedSubStatus === sub.id
                          ? 'border-[#27AE60] bg-[#EAFAF1]/30 text-[#27AE60]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 3a — Interested Sub-Form */}
            {outcome === 'connected' && connectedSubStatus === 'interested' && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4 text-xs">
                <div className="font-bold text-gray-700 uppercase tracking-wider">Subscription Selection</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'ready', label: 'Job Ready ₹199' },
                    { id: 'verified', label: 'Verified ₹299' },
                    { id: 'trusted', label: 'Trusted ₹499' }
                  ].map(plan => (
                    <button
                      key={plan.id}
                      onClick={() => setInterestedPlan(plan.id as any)}
                      className={`p-3 border rounded-lg font-bold text-center transition-all ${
                        interestedPlan === plan.id 
                          ? 'bg-[#27AE60] text-white border-[#27AE60]' 
                          : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {plan.label}
                    </button>
                  ))}
                </div>
                
                <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-gray-100">
                  <span className="font-semibold text-gray-600">Payment link sent via WhatsApp?</span>
                  <div className="flex gap-1.5">
                    <button 
                      onClick={() => setLinkSentToggle('yes')}
                      className={`px-3 py-1 text-[11px] rounded font-bold transition-all ${linkSentToggle === 'yes' ? 'bg-[#27AE60] text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      Yes
                    </button>
                    <button 
                      onClick={() => setLinkSentToggle('no')}
                      className={`px-3 py-1 text-[11px] rounded font-bold transition-all ${linkSentToggle === 'no' ? 'bg-red-500 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}
                    >
                      No
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3b — Not Interested Sub-Form */}
            {outcome === 'connected' && connectedSubStatus === 'not_interested' && (
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Reason for rejection *</label>
                  <select 
                    value={notInterestedReason}
                    onChange={(e) => setNotInterestedReason(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-800"
                  >
                    <option value="">Select Reason...</option>
                    <option value="too_expensive">Too expensive / Pricing Objection</option>
                    <option value="not_relevant">Not relevant to me</option>
                    <option value="competitor">Using a competitor app</option>
                    <option value="no_smartphone">No smartphone access</option>
                    <option value="no_jobs_needed">Not interested in jobs right now</option>
                    <option value="other">Other reason</option>
                  </select>
                </div>
                <div className="bg-blue-50 text-blue-700 p-2.5 rounded border border-blue-100 text-[11px]">
                  💡 <strong>System follow-up scheduled:</strong> A D+3 follow-up call will be scheduled automatically in the background.
                </div>
              </div>
            )}

            {/* Step 3c — Callback Requested Sub-Form */}
            {outcome === 'connected' && connectedSubStatus === 'callback' && (
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4 text-xs">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-gray-500 block mb-1 font-semibold">Callback Date</label>
                    <input 
                      type="date" 
                      value={callbackDate} 
                      onChange={(e) => setCallbackDate(e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                    />
                  </div>
                  <div>
                    <label className="text-gray-500 block mb-1 font-semibold">Callback Time</label>
                    <input 
                      type="time" 
                      value={callbackTime} 
                      onChange={(e) => setCallbackTime(e.target.value)}
                      className="w-full border border-gray-200 rounded px-2 py-1"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 — Remarks (Optional, All Paths) */}
            {outcome && (
              <div className="space-y-2 mt-4 text-xs">
                <label className="font-bold text-gray-700 block">General Remarks / Notes</label>
                <div className="relative">
                  <textarea
                    value={dispositionNotes}
                    onChange={(e) => setDispositionNotes(e.target.value)}
                    placeholder="Enter additional remarks or context here..."
                    className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-[#27AE60] min-h-[60px] pr-8"
                  />
                  <button 
                    onClick={() => {
                      setDispositionNotes(prev => prev ? `${prev} (Client confirmed route details)` : 'Client confirmed route details');
                      triggerToast('Mock voice-to-text recorded');
                    }}
                    className="absolute right-2 bottom-3.5 text-gray-400 hover:text-[#27AE60]"
                    title="Mock Voice-To-Text"
                  >
                    🎙️
                  </button>
                </div>
              </div>
            )}

            {/* Auto-Triggered Funnel Escalation Banner */}
            {(outcome === 'nr' || leadTmid === 'DR-48292') && (
              <div className="bg-[#FFF9E6] border border-[#F2C94C] p-3 rounded-lg text-xs mt-4 text-[#D35400] space-y-2 select-none">
                <div className="font-bold">⚠️ Funnel Escalation Prompt</div>
                <p className="text-[11px] leading-tight">This lead has reached 3 NR attempts / 3 days in queue. Escalate to Funnel Caller queue?</p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setEscalateChoice('yes')}
                    className={`px-3 py-1 rounded text-[10px] font-bold ${escalateChoice === 'yes' ? 'bg-[#FB641B] text-white' : 'bg-white border border-gray-200'}`}
                  >
                    Yes, Escalate
                  </button>
                  <button 
                    onClick={() => setEscalateChoice('no')}
                    className={`px-3 py-1 rounded text-[10px] font-bold ${escalateChoice === 'no' ? 'bg-gray-600 text-white' : 'bg-white border border-gray-200'}`}
                  >
                    No, Keep
                  </button>
                </div>
              </div>
            )}

            {/* Submit Actions */}
            <div className="border-t border-gray-100 pt-4 mt-6 flex justify-end gap-2">
              <button 
                onClick={() => {
                  // Simulate exit block check
                  triggerToast('Disposition logging is required. Form cannot be bypassed.');
                }}
                className="px-4 py-2 border border-gray-200 text-gray-400 rounded-lg text-xs font-bold cursor-not-allowed select-none"
              >
                Cancel
              </button>
              
              <button
                onClick={handleDispositionSubmit}
                disabled={
                  !outcome || 
                  (outcome === 'connected' && !connectedSubStatus) ||
                  (outcome === 'connected' && connectedSubStatus === 'interested' && !interestedPlan) ||
                  (outcome === 'connected' && connectedSubStatus === 'not_interested' && !notInterestedReason) ||
                  ((outcome === 'nr' || leadTmid === 'DR-48292') && !escalateChoice)
                }
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                  (!outcome || 
                   (outcome === 'connected' && !connectedSubStatus) ||
                   (outcome === 'connected' && connectedSubStatus === 'interested' && !interestedPlan) ||
                   (outcome === 'connected' && connectedSubStatus === 'not_interested' && !notInterestedReason) ||
                   ((outcome === 'nr' || leadTmid === 'DR-48292') && !escalateChoice))
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                    : 'bg-[#27AE60] hover:bg-[#219653] text-white font-bold'
                }`}
              >
                Submit & Load Next Lead →
              </button>
            </div>

          </div>
        </div>
      )}

    </main>
  );
};

export default DwActiveCallFocus;
