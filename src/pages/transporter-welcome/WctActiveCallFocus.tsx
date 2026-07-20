import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useSubmitWctFeedbackMutation } from '../../services/api/webCrmApi';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';

interface Objection {
  key: string;
  question: string;
  answer: string;
}

export const WctActiveCallFocus: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [submitWctFeedback] = useSubmitWctFeedbackMutation();
  const {
    currentLeadId, currentCallId, currentLeadName, currentLeadTmid, currentPhoneNumber, currentLeadLocation,
    callState, callDuration, agentState, isMuted, isHeld,
    dial, hangup, toggleMute, toggleHold,
  } = useSanCti();

  // Prefer the live SAN CTI call context (set when the Call Queue dialed this
  // transporter); fall back to any routing state, then to neutral placeholders.
  const stateLead = location.state || {};
  const leadName = currentLeadName || stateLead.name || 'Transporter';
  const leadTmid = currentLeadTmid || stateLead.tmid || '';
  const leadContact = stateLead.contactName || currentLeadName || 'Contact POC';
  const leadPhone = currentPhoneNumber || stateLead.phone || '';
  const leadLocation = currentLeadLocation || stateLead.location || '';
  const fleetSize = stateLead.fleetSize || 0;
  const isFirstAttempt = stateLead.history ? stateLead.history.length === 0 : true;

  const isCampaign = stateLead.isCampaign || false;
  const campaignContext = stateLead.campaignContext || null;

  const [activeTab, setActiveTab] = useState<string>('opening');

  // Campaign specific feedback states
  const [tempUpdate, setTempUpdate] = useState<'HOT' | 'WARM' | 'COLD' | ''>('');
  const [starRating, setStarRating] = useState<number>(0);

  useEffect(() => {
    if (isCampaign) {
      setActiveTab('campaignOpening');
      if (campaignContext?.temperature) {
        setTempUpdate(campaignContext.temperature);
      }
    }
  }, [isCampaign, campaignContext]);

  // Payment Link modal states
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState('Premium ₹1,999');

  // Notes state
  const [quickNote, setQuickNote] = useState('');
  const [noteSaving, setNoteSaving] = useState(false);

  // Search & bookmark objections
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>(['free']);

  // Post-Call Form Overlay State
  const [showPostCallModal, setShowPostCallModal] = useState(false);
  const [outcome, setOutcome] = useState<'connected' | 'nr' | 'busy' | 'wrong' | 'off' | ''>('');
  const [connectedSubStatus, setConnectedSubStatus] = useState<'interested' | 'not_interested' | 'callback' | 'subscribed' | ''>('');

  // Post-Call details
  const [selectedConvertedPlan, setSelectedConvertedPlan] = useState<'free' | 'premium' | 'super' | ''>('');
  const [matchmakingToggle, setMatchmakingToggle] = useState(true);
  const [jobDescription, setJobDescription] = useState('');
  const [upsellReminderToggle, setUpsellReminderToggle] = useState(true);
  const [notInterestedReason, setNotInterestedReason] = useState('');
  const [callbackDate, setCallbackDate] = useState('2026-06-20');
  const [callbackTime, setCallbackTime] = useState('11:30');
  const [dispositionNotes, setDispositionNotes] = useState('');

  // Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // If navigated here WITH a lead and the agent is idle & ready, place the call
  // now (like the Driver Welcome active-call screen). When reached mid-call
  // (dialed from the queue), the live SAN CTI context already drives everything.
  const dialedRef = React.useRef(false);
  useEffect(() => {
    if (dialedRef.current) return;
    if (stateLead.phone && stateLead.userId && agentState === 'ready' && callState === 'idle') {
      dialedRef.current = true;
      dial(
        stateLead.phone,
        Number(stateLead.userId) || stateLead.userId,
        stateLead.name || stateLead.companyName || 'Transporter',
        stateLead.tmid || '',
        isCampaign ? 'social_media' : 'transporter',
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentState, callState]);

  // When the disposition for this call is submitted (global PostCallDisposition
  // modal), return to the queue / campaign list so the next lead can be worked.
  useEffect(() => {
    const onDone = () => navigate(isCampaign ? '/wct/wct-campaign-leads' : '/wct/wct-call-queue');
    window.addEventListener('san-disposition-complete', onDone);
    return () => window.removeEventListener('san-disposition-complete', onDone);
  }, [navigate, isCampaign]);

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
    triggerToast('Payment link sent ✓');
    setShowLinkModal(false);
  };

  // Debounced note save
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
    { key: 'free', question: 'Free mein bhi post kar sakte hain', answer: 'बिल्कुल राजीव जी, लेकिन फ्री प्लान में आपके पोस्ट्स की विजिबिलिटी सीमित रहती है। प्रीमियम प्लान में आपकी जॉब सबसे ऊपर दिखाई देगी, जिससे 3 गुना अधिक ड्राइवर्स तुरंत अप्लाई करेंगे।' },
    { key: 'reliable', question: 'Driver reliable nahi hote', answer: 'राजीव जी, हम समझते हैं। इसीलिए हमारे प्रीमियम और सुपर प्रीमियम प्लान्स में सभी ड्राइवर्स का बैकग्राउंड और क्रिमिनल रिकॉर्ड पुलिस वेरिफिकेशन के माध्यम से जांचा जाता है।' },
    { key: 'expensive', question: 'Bahut mehanga hai', answer: 'सर, एक गाड़ी खाली खड़ी रहने से दिन का ₹3,000 से अधिक नुकसान होता है। मात्र ₹1,999 के 3 महीने के प्लान से आप उस बड़े नुकसान से बच सकते हैं। यह बहुत ही किफायती है।' },
    { key: 'nodriver', question: 'Pehle koi driver nahi mila', answer: 'राजीव जी, पहले डेटाबेस छोटा था। अब हमारे पास 50,000+ एक्टिव ड्राइवर्स हैं। सुपर प्रीमियम प्लान में आपको 7 दिनों के भीतर ड्राइवर मिलने की गारंटीड प्लेसमेंट SLA मिलती है।' }
  ];

  const toggleBookmark = (key: string) => {
    setBookmarks(prev => 
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const getSortedObjections = () => {
    let list = [...objections];
    if (searchQuery) {
      list = list.filter(obj => 
        obj.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        obj.answer.toLowerCase().includes(searchQuery.toLowerCase())
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

  const handleDispositionSubmit = async () => {
    // Map UI outcomes to the call_history_ivr statuses used by the DW/WCT flow.
    const statusMap: Record<string, string> = {
      connected: 'connected',
      nr: 'not_connected',
      busy: 'not_connected',
      off: 'not_connected',
      wrong: 'not_connected',
    };
    const call_status = statusMap[outcome] || 'not_connected';

    let call_feedback = 'Not Interested';
    if (connectedSubStatus === 'interested') call_feedback = 'Interested';
    else if (connectedSubStatus === 'callback') call_feedback = 'Callback Requested';
    else if (connectedSubStatus === 'subscribed') call_feedback = 'Already Subscribed';
    else if (outcome && outcome !== 'connected') call_feedback = outcome.toUpperCase();

    const userId = Number(currentLeadId) || parseInt(leadTmid.replace(/\D/g, ''), 10) || 0;

    try {
      if (userId) {
        await submitWctFeedback({
          user_id: userId,
          call_status,
          call_feedback,
          call_remarks: dispositionNotes || 'WCT disposition logged from Active Call screen',
          call_id: currentCallId || undefined,
        }).unwrap();
      }
      triggerToast('Disposition saved ✓');
    } catch (err: any) {
      console.error('[WCT] Failed to save disposition feedback:', err);
      triggerToast('Failed to save disposition');
    }

    setTimeout(() => {
      navigate(isCampaign ? '/wct/wct-campaign-leads' : '/wct/wct-call-queue');
    }, 800);
  };

  return (
    <main className="h-[calc(100vh-80px)] flex bg-white overflow-hidden border border-gray-200 rounded-xl relative">
      
      {/* Toast */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FB641B]"></span>
          {toastMessage}
        </div>
      )}

      {/* LEFT COLUMN: Call cockpit & pricing comparison */}
      <section className="w-[420px] border-r border-gray-200 flex flex-col p-4 bg-gray-50/50 shrink-0 overflow-y-auto">
        
        {/* SLA Reminder Strip (Thin orange bar pinned above call timer) */}
        {isFirstAttempt && (
          <div className="bg-[#FFF4EC] border border-[#FB641B]/20 text-[#FB641B] px-3 py-1.5 rounded-lg text-xs font-bold mb-3 text-center">
            ⏰ This lead's first-call SLA expires in 1h 14min
          </div>
        )}

        {/* Top Strip */}
        <div className="bg-white border border-gray-200 p-3 rounded-xl shadow-sm mb-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${callState === 'connected' ? 'bg-[#27AE60] animate-ping' : callState === 'idle' ? 'bg-gray-300' : 'bg-[#FB641B] animate-ping'}`}></span>
              <span className="font-mono text-xl font-bold text-gray-800">{formatTimer(callDuration)}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {callState === 'idle' ? 'No active call' :
                 callState === 'dialing' ? 'Dialing…' :
                 callState === 'ringing' ? 'Ringing…' :
                 callState === 'connected' ? 'Connected' :
                 callState === 'disposition_pending' ? 'Wrap-up' : callState}
              </span>
            </div>

            {/* Real SAN CTI controls */}
            <div className="flex items-center gap-1">
              <button
                onClick={toggleMute}
                disabled={callState !== 'connected'}
                title={isMuted ? 'Unmute' : 'Mute'}
                className={`p-1.5 rounded-lg border text-xs flex items-center justify-center transition-all disabled:opacity-40 ${isMuted ? 'bg-red-50 border-red-200 text-red-600 font-bold' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
              >
                <span className="material-symbols-outlined text-[18px]">{isMuted ? 'mic_off' : 'mic'}</span>
              </button>
              <button
                onClick={toggleHold}
                disabled={callState !== 'connected'}
                title={isHeld ? 'Resume' : 'Hold'}
                className={`p-1.5 rounded-lg border text-xs flex items-center justify-center transition-all disabled:opacity-40 ${isHeld ? 'bg-orange-50 border-[#FB641B] text-[#FB641B] font-bold' : 'bg-gray-50 border-gray-200 text-gray-500'}`}
              >
                <span className="material-symbols-outlined text-[18px]">{isHeld ? 'play_circle' : 'pause_circle'}</span>
              </button>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 mt-2 font-semibold">
            Active Call: <span className="text-gray-800">{leadName}</span> · <span className="font-mono text-gray-400">{leadTmid}</span> · <span className="text-gray-650">{leadPhone}</span> · <span className="text-gray-650">{leadLocation}</span>
          </div>

          {isCampaign && campaignContext && (
            <div className="mt-3 bg-red-500/5 border border-red-500/10 rounded-lg p-2.5 text-[11px] text-gray-700 space-y-1 font-sans">
              <div className="flex justify-between items-center mb-1">
                <span className="font-bold text-red-800 uppercase tracking-wider text-[9px]">Campaign Source</span>
                <span className="bg-red-500 text-white px-1.5 py-0.5 rounded font-mono text-[9px] font-bold uppercase">{campaignContext.source}</span>
              </div>
              <div className="truncate"><span className="text-gray-400">Campaign:</span> <span className="font-semibold text-gray-800">{campaignContext.campaignName}</span></div>
              <div className="flex justify-between items-center text-[10px] pt-1">
                <span><span className="text-gray-400">Form:</span> <span className="font-semibold">{campaignContext.leadForm}</span></span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${campaignContext.temperature === 'HOT' ? 'bg-red-100 text-red-700 animate-pulse' : campaignContext.temperature === 'WARM' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                  {campaignContext.temperature}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* PLAN COMPARISON MATRIX (PINNED & PERMANENT) */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm text-xs mb-4">
          <div className="bg-gray-50 px-3 py-2 border-b border-gray-200 font-bold text-gray-700 uppercase tracking-wider text-[10px]">
            📋 Plan Comparison Reference Matrix
          </div>
          
          <table className="w-full text-[10px] text-left border-collapse">
            <thead>
              <tr className="bg-gray-100/55 border-b border-gray-200 text-gray-500 font-bold">
                <th className="p-2">Feature</th>
                <th className="p-2">Free</th>
                <th className="p-2">Premium (₹1,999)</th>
                <th className="p-2">Super Premium (₹2,999)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-150 font-medium text-gray-700">
              <tr>
                <td className="p-2 font-semibold">Job Posting</td>
                <td className="p-2 text-[#27AE60] text-center font-bold">✓</td>
                <td className="p-2 text-[#27AE60] text-center font-bold">✓</td>
                <td className="p-2 text-[#27AE60] text-center font-bold">✓</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Top Placement</td>
                <td className="p-2 text-red-500 text-center font-bold">✗</td>
                <td className="p-2 text-[#27AE60] text-center font-bold">✓</td>
                <td className="p-2 text-[#27AE60] text-center font-bold">✓</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Placement SLA</td>
                <td className="p-2 text-center text-gray-400">No SLA</td>
                <td className="p-2 text-center">10 days</td>
                <td className="p-2 text-center font-bold text-[#FB641B]">7 days</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Verified Drivers</td>
                <td className="p-2 text-red-500 text-center font-bold">✗</td>
                <td className="p-2 text-[#27AE60] text-center font-bold">✓</td>
                <td className="p-2 text-[#27AE60] text-center font-bold">✓</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Dedicated Caller</td>
                <td className="p-2 text-red-500 text-center font-bold">✗</td>
                <td className="p-2 text-[#27AE60] text-center font-bold">✓</td>
                <td className="p-2 text-center font-bold text-[#FB641B]">✓ (priority)</td>
              </tr>
              <tr>
                <td className="p-2 font-semibold">Validity</td>
                <td className="p-2 text-center text-gray-400">—</td>
                <td className="p-2 text-center">3 months</td>
                <td className="p-2 text-center">3 months</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Fleet-Based Recommendation Chip */}
        <div className="bg-orange-50 border border-orange-200 text-[#FB641B] p-2.5 rounded-lg text-xs font-bold mb-4 flex items-center justify-between">
          <span>🎯 Recommendation Action:</span>
          <span>For {fleetSize} trucks → Super Premium recommended</span>
        </div>

        {/* Quick Connection Pre-dispositions — open the manual disposition log */}
        <div className="mb-4">
          <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Manual disposition log</div>
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
                  setOutcome(disp.id as any);
                  setShowPostCallModal(true);
                }}
                className="h-14 border border-gray-200 bg-white rounded-lg hover:bg-gray-100 flex flex-col items-center justify-center transition-all"
              >
                <span className="material-symbols-outlined text-[16px] text-gray-500">{disp.icon}</span>
                <span className="text-[10px] font-bold text-gray-700 mt-1">{disp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Send Payment Link */}
        <div className="mb-4">
          <button 
            onClick={() => setShowLinkModal(true)}
            className="w-full bg-[#FB641B] hover:bg-[#e4540d] text-white h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98]"
          >
            <span className="material-symbols-outlined text-[18px]">send</span>
            Send WCT Payment Link
          </button>
        </div>

        {/* Quick Note Input */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Quick Note</span>
            {noteSaving && <span className="text-[9px] text-gray-400 italic">saving...</span>}
          </div>
          <input
            type="text"
            value={quickNote}
            onChange={handleNoteChange}
            placeholder="Quick note while on call..."
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs focus:ring-1 focus:ring-[#FB641B] outline-none"
            maxLength={200}
          />
        </div>

        {/* End Call Button — real SAN hangup; the global disposition modal opens */}
        <div className="mt-auto pt-4 border-t border-gray-200">
          {callState === 'idle' ? (
            <button
              onClick={() => navigate(isCampaign ? '/wct/wct-campaign-leads' : '/wct/wct-call-queue')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5"
            >
              <span className="material-symbols-outlined text-[18px]">arrow_back</span>
              Back to {isCampaign ? 'Campaign Leads' : 'Queue'}
            </button>
          ) : (
            <button
              onClick={() => hangup()}
              className="w-full bg-red-500 hover:bg-red-600 text-white h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-md"
            >
              <span className="material-symbols-outlined text-[18px]">call_end</span>
              End Call &amp; Log Disposition
            </button>
          )}
        </div>

      </section>

      {/* RIGHT COLUMN: Script Panel */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
        
        {/* Script Tab Row */}
        <div className="flex border-b border-gray-200 bg-gray-50 overflow-x-auto scrollbar-none shrink-0">
          {[
            ...(isCampaign ? [{ key: 'campaignOpening', label: '📢 Campaign Script' }] : []),
            { key: 'opening', label: 'Opening' },
            { key: 'freePitch', label: 'Free Plan Pitch' },
            { key: 'premiumPitch', label: 'Premium Pitch' },
            { key: 'superPitch', label: 'Super Premium Pitch' },
            { key: 'objections', label: 'Objections (Hindi)' },
            { key: 'closing', label: 'Closing' }
          ].map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as any)}
              className={`px-4 py-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-all ${
                activeTab === tab.key
                  ? 'border-[#FB641B] text-[#FB641B] bg-white font-bold'
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
            
            {activeTab === 'campaignOpening' && campaignContext && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-[#FB641B] uppercase tracking-wide font-sans">Campaign Opening Script ({campaignContext.source})</h3>
                <div className="bg-orange-50/30 border-l-4 border-[#FB641B] p-4 rounded-r-xl">
                  "{campaignContext.openingScript}"
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 text-xs space-y-1 text-gray-600 font-sans">
                  <div className="font-bold text-gray-700">Campaign Context:</div>
                  <div><span className="text-gray-400">Ad Source:</span> {campaignContext.source}</div>
                  <div><span className="text-gray-400">Campaign:</span> {campaignContext.campaignName}</div>
                  <div><span className="text-gray-400">Form:</span> {campaignContext.leadForm}</div>
                  <div><span className="text-gray-400">Captured:</span> {campaignContext.capturedTime}</div>
                  {campaignContext.utmCampaign && <div><span className="text-gray-400">UTM:</span> {campaignContext.utmSource} / {campaignContext.utmMedium} / {campaignContext.utmCampaign}</div>}
                </div>
              </div>
            )}

            {activeTab === 'opening' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Greeting & Opening</h3>
                <div className="bg-orange-50/30 border-l-4 border-[#FB641B] p-4 rounded-r-xl">
                  "नमस्ते <strong>{leadContact}</strong> जी, मैं ट्रक मित्र से बात कर रहा हूँ। {leadName} की नई प्रोफाइल हमारे पोर्टल पर दिखी है, बहुत-बहुत धन्यवाद! <br/><br/>
                  क्या यह सही समय है आपसे बातचीत करने का? मैं आपके बिजनेस के लिए लोड और विश्वसनीय ड्राइवर्स की व्यवस्था कराने के बारे में जानकारी देने के लिए कॉल कर रहा हूँ।"
                </div>
              </div>
            )}

            {activeTab === 'freePitch' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Free Plan Pitch</h3>
                <div className="bg-orange-50/30 border-l-4 border-[#FB641B] p-4 rounded-r-xl">
                  "राजीव जी, हमारे फ्री प्लान में आप बुनियादी तौर पर लोड और ड्राइवर पोस्ट कर सकते हैं। <br/><br/>
                  हालांकि, इस योजना में विजिबिलिटी सामान्य रहती है। यदि आप तेजी से हायरिंग चाहते हैं, तो हमारे प्रीमियम फीचर्स आपके लिए मददगार रहेंगे।"
                </div>
              </div>
            )}

            {activeTab === 'premiumPitch' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Premium Plan Pitch (₹1,999)</h3>
                <div className="bg-orange-50/30 border-l-4 border-[#FB641B] p-4 rounded-r-xl">
                  "राजीव जी, हमारा <strong>Premium Plan</strong> सिर्फ <strong>₹1,999</strong> का है। <br/><br/>
                  इसमें आपके जॉब पोस्ट्स को टॉप विजिबिलिटी मिलती है। साथ ही हम आपको 10 दिनों की प्लेसमेंट SLA और वेरिफाइड ड्राइवर्स तक सीधी पहुंच देते हैं।"
                </div>
              </div>
            )}

            {activeTab === 'superPitch' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Super Premium Plan Pitch (₹2,999)</h3>
                <div className="bg-orange-50/30 border-l-4 border-[#FB641B] p-4 rounded-r-xl">
                  "राजीव जी, जैसा कि आपके पास <strong>{fleetSize} गाड़ियां</strong> हैं, आपके लिए हमारा <strong>Super Premium Plan</strong> (₹2,999) सबसे बेस्ट है। <br/><br/>
                  इसमें आपको मात्र <strong>7 दिनों के भीतर ड्राइवर प्लेसमेंट की गारंटी</strong> मिलती है, और आपकी प्रोफाइल पर हमारी मैचमेकिंग टीम प्रायोरिटी बेसिस पर काम करती है।"
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
                    placeholder="Type objection keyword (e.g. free, reliable)..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#FB641B]"
                  />
                </div>

                {/* Starred Objections Row */}
                {bookmarks.length > 0 && (
                  <div className="flex flex-wrap items-center gap-1.5 bg-gray-50 p-2 rounded-lg border border-gray-100">
                    <span className="text-[10px] text-gray-400 font-bold uppercase">My Bookmarks:</span>
                    {bookmarks.map(key => (
                      <span key={key} className="bg-orange-50 text-[#FB641B] border border-[#FB641B]/20 text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                        ★ {objections.find(o => o.key === key)?.question}
                      </span>
                    ))}
                  </div>
                )}

                {/* Objections List */}
                <div className="space-y-3 mt-4">
                  {sortedObjections.map(obj => (
                    <div key={obj.key} className="border border-gray-200 rounded-xl p-4 bg-white relative hover:border-[#FB641B] transition-colors">
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
                <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide font-sans">Call Closing & Handoff</h3>
                <div className="bg-orange-50/30 border-l-4 border-[#FB641B] p-4 rounded-r-xl">
                  "तो राजीव जी, मैं आपके व्हाट्सएप पर आपके चुने हुए प्लान का सिक्योर पेमेंट लिंक भेज रहा हूँ। <br/><br/>
                  जैसे ही पेमेंट क्लियर होता है, हमारा सिस्टम ऑटोमैटिकली आपके लिए ड्राइवर मैचमेकिंग की टिकट बना देगा और हमारे रिप्रेजेंटेटिव कल सुबह से ही ड्राइवर्स के इंटरव्यू अरेंज करा देंगे।"
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Bottom Exotel Bar */}
        <div className="h-8 bg-gray-950 flex items-center px-4 justify-between text-white shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FB641B] animate-pulse"></span>
            <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold">WCT Outbound Channel</span>
          </div>
          <span className="text-[9px] font-mono text-gray-500">TR-ID: EX-CDR-5509</span>
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
                  <option value="Premium ₹1,999">Premium — ₹1,999 (3 months)</option>
                  <option value="Super Premium ₹2,999">Super Premium — ₹2,999 (3 months)</option>
                </select>
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

      {/* STANDALONE-STYLE FULL SCREEN BLOCKING MODAL GATED DISPOSITION */}
      {showPostCallModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-xl w-full p-6 shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto relative">
            
            {/* Header */}
            <div className="border-b border-gray-100 pb-3 mb-4">
              <h2 className="text-lg font-bold text-gray-900 flex justify-between items-center">
                <span>Log Transporter Call — {leadName}</span>
                <span className="font-mono text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">{leadTmid}</span>
              </h2>
              <div className="text-[11px] text-gray-400 mt-1">
                {leadName} · Duration: {formatTimer(callDuration)}
              </div>
            </div>

            {/* Outcome Step 1 */}
            <div className="space-y-3">
              <div className="text-xs font-bold text-gray-700 uppercase tracking-wider">Step 1 — Call Outcome *</div>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'connected', label: 'Connected', desc: 'Call successfully answered' },
                  { id: 'nr', label: 'Not Reachable', desc: 'No response/Switch off' },
                  { id: 'busy', label: 'Busy', desc: 'Line busy/call declined' },
                  { id: 'wrong', label: 'Wrong Number', desc: 'Not a transporter' },
                  { id: 'off', label: 'Switch Off', desc: 'Switched off/No Network' }
                ].map(op => (
                  <button
                    key={op.id}
                    onClick={() => {
                      setOutcome(op.id as any);
                      if (op.id !== 'connected') setConnectedSubStatus('');
                    }}
                    className={`p-3 border rounded-xl text-left transition-all ${
                      outcome === op.id 
                        ? 'border-[#FB641B] bg-orange-50/20 ring-1 ring-[#FB641B]' 
                        : 'border-gray-200 bg-white hover:bg-gray-50'
                    }`}
                  >
                    <div className="font-bold text-xs text-gray-800">{op.label}</div>
                    <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{op.desc}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Connected sub-status */}
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
                          ? 'border-[#FB641B] bg-orange-50/20 text-[#FB641B]'
                          : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      {sub.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Converted details */}
            {outcome === 'connected' && connectedSubStatus === 'interested' && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4 text-xs">
                <div className="font-bold text-gray-700 uppercase tracking-wider">Plan & Matchmaking Handoff</div>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'free', label: 'Free Plan' },
                    { id: 'premium', label: 'Premium ₹1,999' },
                    { id: 'super', label: 'Super Premium ₹2,999' }
                  ].map(plan => (
                    <button
                      key={plan.id}
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

                {/* If Premium or Super Premium selected -> Matchmaking queue details */}
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
                          placeholder="e.g. Need HMV driver for NCR-Mumbai route, Tata Prima vehicle..."
                          className="w-full border border-gray-200 rounded p-2 focus:ring-1 focus:ring-[#FB641B] outline-none min-h-[50px] resize-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* If Free Plan selected -> D+7 upsell reminder */}
                {selectedConvertedPlan === 'free' && (
                  <div className="bg-white p-3 rounded-lg border border-gray-150 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-gray-700 block">Create D+7 upsell reminder?</span>
                      <span className="text-[10px] text-gray-400 italic">Scheduled for next week automatically</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={upsellReminderToggle} 
                      onChange={(e) => setUpsellReminderToggle(e.target.checked)}
                      className="rounded text-[#FB641B] focus:ring-[#FB641B] w-4 h-4 border-gray-300"
                    />
                  </div>
                )}

              </div>
            )}

            {/* Step 3b — Not Interested */}
            {outcome === 'connected' && connectedSubStatus === 'not_interested' && (
              <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100 mt-4 text-xs">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">Reason for Rejection *</label>
                  <select 
                    value={notInterestedReason}
                    onChange={(e) => setNotInterestedReason(e.target.value)}
                    className="w-full bg-white border border-gray-200 rounded px-2.5 py-1.5 text-xs text-gray-800"
                  >
                    <option value="">Select Reason...</option>
                    <option value="expensive">Too expensive / Price Objection</option>
                    <option value="competitor">Using competitor app</option>
                    <option value="no_hiring">Not hiring right now</option>
                    <option value="later">Will decide later</option>
                    <option value="other">Other reason</option>
                  </select>
                </div>
              </div>
            )}

            {/* Step 3c — Callback */}
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
                
                {/* SLA Miss Warning */}
                {stateLead.slaMinutesLeft > 0 && (
                  <div className="bg-[#FFF4EC] border border-[#FB641B]/20 text-[#FB641B] p-2.5 rounded text-[11px] font-semibold leading-normal">
                    ⚠️ Scheduling this callback may cause an SLA miss if not completed before the 4h registration SLA deadline.
                  </div>
                )}
              </div>
            )}

            {/* Campaign Specific — Temperature & Rating */}
            {isCampaign && outcome && (
              <div className="space-y-4 bg-red-50/30 p-4 rounded-xl border border-red-100 mt-4 text-xs">
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
              </div>
            )}

            {/* Step 4 — Remarks */}
            {outcome && (
              <div className="space-y-2 mt-4 text-xs">
                <label className="font-bold text-gray-700 block">General Remarks / Notes</label>
                <textarea
                  value={dispositionNotes}
                  onChange={(e) => setDispositionNotes(e.target.value)}
                  placeholder="Enter additional remarks or context..."
                  className="w-full border border-gray-200 rounded-lg p-2.5 outline-none focus:ring-1 focus:ring-[#FB641B] min-h-[60px]"
                />
              </div>
            )}

            {/* SLA Compliance Auto-Log (System computed, read-only) */}
            {outcome && (
              <div className="bg-gray-100 p-2.5 rounded-lg text-[11px] text-gray-500 mt-4 select-none font-mono">
                📟 First-call SLA: {stateLead.slaMinutesLeft >= 0 
                  ? `✓ Met (called ${Math.floor(stateLead.registeredMinutesAgo / 60)}h ${stateLead.registeredMinutesAgo % 60}m after registration)` 
                  : '✗ Missed (called late / breached SLA window)'
                }
              </div>
            )}

            {/* Action Footer */}
            <div className="border-t border-gray-100 pt-4 mt-6 flex justify-end gap-2">
              <button 
                onClick={() => {
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
                  (outcome === 'connected' && connectedSubStatus === 'interested' && !selectedConvertedPlan) ||
                  (outcome === 'connected' && connectedSubStatus === 'not_interested' && !notInterestedReason) ||
                  (isCampaign && !tempUpdate)
                }
                className={`px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm ${
                  (!outcome || 
                   (outcome === 'connected' && !connectedSubStatus) ||
                   (outcome === 'connected' && connectedSubStatus === 'interested' && !selectedConvertedPlan) ||
                   (outcome === 'connected' && connectedSubStatus === 'not_interested' && !notInterestedReason) ||
                   (isCampaign && !tempUpdate))
                    ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed'
                    : 'bg-[#FB641B] hover:bg-[#e4540d] text-white'
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

export default WctActiveCallFocus;
