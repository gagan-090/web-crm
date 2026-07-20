import React, { useState } from 'react';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';

type Section = 'callScript' | 'questionnaire' | 'redFlags' | 'scoring' | 'autoReject';

interface Step {
  n: number;
  title: string;
  text: string; // may contain {name} token — replaced with the live driver name
  note?: string;
}

export const MmScriptLibrary: React.FC = () => {
  const { currentLeadName, currentPhoneNumber, callState } = useSanCti();
  const onCall = ['dialing', 'ringing', 'connected', 'incoming_ringing'].includes(callState);
  const liveName = currentLeadName && currentLeadName.trim() && currentLeadName !== 'Incoming Call' ? currentLeadName.trim() : '';
  const hasLead = !!liveName || (onCall && !!currentPhoneNumber);
  const leadName = liveName || (onCall ? currentPhoneNumber : '') || '[ड्राइवर का नाम]';

  const [activeSection, setActiveSection] = useState<Section>('callScript');
  const [searchQuery, setSearchQuery] = useState('');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAudioPlay = (section: string) => {
    if (playingAudio === section) {
      setPlayingAudio(null);
      triggerToast('Audio playback paused');
    } else {
      setPlayingAudio(section);
      triggerToast(`Playing Greenline screening audio snippet for "${section}"...`);
    }
  };

  const Name: React.FC = () => (
    <span
      className={`px-1.5 py-0.5 rounded font-bold ${
        hasLead
          ? 'bg-purple-100 text-[#7D3C98]'
          : 'bg-gray-100 text-gray-500 border border-dashed border-gray-300'
      }`}
    >
      {leadName}
    </span>
  );

  const withName = (text: string): React.ReactNode =>
    text.split('{name}').flatMap((part, i) =>
      i === 0 ? [part] : [<Name key={`n${i}`} />, part]
    );

  // ---- Greenline Driver Screening Call Script (13 steps) ----
  const steps: Step[] = [
    { n: 1, title: 'Warm Opening & Trust Building', text: '"नमस्ते {name} भाई साहब, मैं ट्रकमित्र / ग्रीनलाइन हायरिंग टीम से बोल रहा हूँ। आपकी प्रोफाइल हमें ट्रेलर ड्राइवर जॉब के लिए मिली थी। अभी 10–12 मिनट बात हो पाएगी क्या? आराम से, बिना जल्दबाज़ी।" (हाँ कहे तभी आगे बढ़ें) "पहले ही बता दूँ — यह कॉल सिर्फ़ स्क्रीनिंग के लिए है ताकि बाद में इंटरव्यू में दिक्कत न हो। जो सच है वही बताइए, इससे आपका ही फायदा होगा।"' },
    { n: 2, title: 'Friendly Background', text: '"सबसे पहले आप कहाँ से बोल रहे हैं? अभी ड्राइविंग में हैं या रुके हुए हैं?" (Driver relax हो, tone judge करें।)' },
    { n: 3, title: 'Experience Deep Dive', text: '"{name} भाई साहब, ट्रेलर कितने साल से चला रहे हैं? किस टाइप का — कंटेनर, फ्लैटबेड या कुछ और? अभी किस कंपनी या मालिक के साथ चला रहे हैं, उनका नाम बता दीजिए। जो ट्रेलर चला रहे थे, वो approx कितने टन का रहता था?"', note: 'Fake drivers यहाँ अटकते हैं — GVW व मालिक के नाम पर clarity लें।' },
    { n: 4, title: 'Document Reality Check', text: '"एक ज़रूरी बात clear कर लूँ — आपके ड्राइविंग लाइसेंस, आधार और पैन तीनों में नाम, पिताजी का नाम और DOB बिल्कुल same है ना? थोड़ा भी spelling या date का फ़र्क हुआ तो ग्रीनलाइन reject कर देती है। कभी किसी कंपनी ने डॉक्यूमेंट के कारण मना किया?"', note: 'Zero tolerance — किसी भी mismatch या hesitation पर Reject।' },
    { n: 5, title: 'Discipline & Behaviour', text: '"हर कंपनी के अपने नियम होते हैं। ग्रीनलाइन में speed limit, rest hours या route strict हुआ तो adjust कर लेंगे? कभी किसी कंपनी ने fine या suspend किया? कभी ट्रेलर में accident हुआ है — अगर हाँ तो कारण क्या था?"', note: 'Honesty > perfect record.' },
    { n: 6, title: 'Location & Interview Seriousness', text: '"ग्रीनलाइन में interview fix date और location पर ही होता है, कोई आगे-पीछे नहीं। अगर आपको तय जगह और तारीख़ पर बुलाया जाए तो पक्का report कर पाएंगे?"', note: '"try करेंगे / देखेंगे" नहीं चलता — Yes या No में लें, वरना Reject।' },
    { n: 7, title: 'Route & Work Flexibility', text: '"इंटरव्यू के बाद जो route मिलेगा वही चलाना होगा — नया भी हो सकता है। Night driving, long route या interstate में कोई problem तो नहीं? रूट या गाड़ी अचानक change हो जाए तो कैसे handle करते हैं?"' },
    { n: 8, title: 'Medical & Fitness', text: '"भाई साहब, long driving होती है। BP, sugar, आँखों या कमर की कोई problem तो नहीं? पिछले साल medical check-up करवाया था क्या?"' },
    { n: 9, title: 'Technology & Video Interview', text: '"आपके पास smartphone है ना — camera और internet के साथ? ग्रीनलाइन कभी-कभी video interview भी लेती है, WhatsApp / video call पर comfortable हैं? Interview के time phone reachable रहेगा?"' },
    { n: 10, title: 'OTP & Verification Consent', text: '"एक important बात — ग्रीनलाइन joining से पहले ID, address और court verification करती है, जिसमें कभी-कभी OTP share करना पड़ता है। इसमें आपको कोई issue तो नहीं?"', note: 'Hesitation = RED FLAG → Direct Reject.' },
    { n: 11, title: 'Financial & Stability', text: '"कोई ऐसा loan या advance तो नहीं जो joining में problem करे? Salary monthly / fortnightly होती है — daily advance की आदत तो नहीं?"' },
    { n: 12, title: 'Intent & Commitment', text: '"सीधा सवाल — अगर select हो गए तो join करेंगे ना? बीच में गायब तो नहीं होंगे? ग्रीनलाइन में काम करने की main वजह क्या है?"' },
    { n: 13, title: 'Positive Close', text: '"ठीक है {name} भाई साहब, आपने अच्छे से detail दी। मैं आपकी screening report बनाकर आगे share करूँगा। Profile shortlist हुई तो interview details के लिए call आएगा। कोई गलत जानकारी निकली तो इंटरव्यू में problem होती है — आपने सच बताया, यही सही है।"' }
  ];

  // ---- Master Screening Questionnaire (Sections A–I) ----
  const questionnaire: { section: string; questions: string[] }[] = [
    { section: 'A · मूल जानकारी एवं अनुभव', questions: [
      'कृपया अपना पूरा नाम बताइए, जैसा कि आपके ड्राइविंग लाइसेंस में लिखा है।',
      'ट्रेलर वाहन चलाने का कुल कितने वर्षों का अनुभव है? (कम से कम 3 वर्ष अनिवार्य)',
      'किस प्रकार के ट्रेलर चलाए हैं? (कंटेनर, फ्लैटबेड, मल्टी-एक्सल, टैंकर आदि)',
      'क्या वर्तमान में ट्रेलर चला रहे हैं? यदि नहीं, तो आख़िरी बार कब चलाया था?',
      'आख़िरी बार किस ट्रांसपोर्टर/कंपनी के साथ काम किया? मालिक या सुपरवाइज़र का नाम?',
      'आख़िरी ट्रेलर का अनुमानित GVW (वजन क्षमता) कितना था?'
    ] },
    { section: 'B · दस्तावेज़ एवं पहचान की समानता', questions: [
      'DL, आधार और पैन में नाम, पिता का नाम और जन्मतिथि बिल्कुल एक जैसी है?',
      'सभी दस्तावेज़ (DL, आधार, पैन) वैध और मूल (Original) हैं?',
      'कभी किसी कंपनी ने दस्तावेज़ों में गड़बड़ी या वेरिफिकेशन फेल के कारण रिजेक्ट किया?'
    ] },
    { section: 'C · अनुशासन, नियम और पृष्ठभूमि', questions: [
      'कभी किसी कंपनी ने फाइन, सस्पेंड या ब्लैकलिस्ट किया है?',
      'ट्रेलर चलाते समय कभी एक्सीडेंट हुआ? यदि हाँ तो कारण?',
      'ग्रीनलाइन के सभी नियम और SOPs सख्ती से फॉलो करने के लिए तैयार हैं?',
      'स्पीड लिमिट, रूट डिसिप्लिन और रेस्ट आवर्स का पालन करते हैं?'
    ] },
    { section: 'D · लोकेशन, रूट व ऑपरेशन', questions: [
      'बताई गई इंटरव्यू लोकेशन पर तय तारीख़ को रिपोर्ट करने के लिए तैयार हैं?',
      'कोई मेडिकल/पारिवारिक/व्यक्तिगत समस्या जिससे तय तारीख़ पर रिपोर्ट न कर पाएँ?',
      'इंटरव्यू के बाद दिए गए किसी भी रूट पर गाड़ी चलाने के लिए तैयार हैं?',
      'लंबी दूरी, नाइट ड्राइविंग और इंटरस्टेट रूट्स के लिए तैयार हैं?',
      'रूट या वाहन अचानक बदल जाए तो सामान्यतः कैसे प्रतिक्रिया देते हैं?'
    ] },
    { section: 'E · मेडिकल एवं फिटनेस', questions: [
      'कोई मेडिकल समस्या (आँख, BP, डायबिटीज़, कमर दर्द) जो लंबी ड्राइविंग को प्रभावित करे?',
      'पिछले 12 महीनों में कोई मेडिकल फिटनेस चेकअप करवाया?'
    ] },
    { section: 'F · टेक्नोलॉजी व इंटरव्यू तैयारी', questions: [
      'स्मार्टफोन है जिसमें कैमरा, इंटरनेट और वीडियो कॉलिंग हो?',
      'ग्रीनलाइन अधिकारियों के साथ जब कहा जाए, वीडियो इंटरव्यू देने के लिए तैयार हैं?',
      'इंटरव्यू व ऑनबोर्डिंग के दौरान फोन चालू और reachable रखेंगे?',
      'मोबाइल ऐप से हाजिरी, ट्रिप अपडेट या डॉक्यूमेंट अपलोड करने में सहज हैं?'
    ] },
    { section: 'G · वेरिफिकेशन एवं सहमति', questions: [
      'ID, कोर्ट चेक और एड्रेस वेरिफिकेशन से जुड़े OTP साझा करने के लिए सहमत हैं?',
      'बैकग्राउंड वेरिफिकेशन (कोर्ट, पुलिस, एड्रेस चेक) के लिए पूरी सहमति देते हैं?'
    ] },
    { section: 'H · वित्तीय स्थिति व स्थिरता', questions: [
      'किसी ट्रांसपोर्टर से लिया कोई लोन/एडवांस, जो जॉइनिंग में रुकावट बने?',
      'सैलरी साइकल (मासिक/पखवाड़ा) से सहज हैं, या रोज़ाना एडवांस की ज़रूरत होती है?'
    ] },
    { section: 'I · गंभीरता व अंतिम प्रतिबद्धता', questions: [
      'चयन होने पर कितने दिनों में जॉइन कर सकते हैं?',
      'ग्रीनलाइन के साथ काम क्यों करना चाहते हैं?',
      'कभी बिना बताए बीच में नौकरी छोड़ी? यदि हाँ तो कारण?',
      'चयन के बाद पक्का कमिट करते हैं कि ड्रॉप नहीं करेंगे?'
    ] }
  ];

  const filteredQuestionnaire = questionnaire
    .map(g => ({
      section: g.section,
      questions: searchQuery
        ? g.questions.filter(q => q.toLowerCase().includes(searchQuery.toLowerCase()))
        : g.questions
    }))
    .filter(g => g.questions.length > 0);

  // ---- Red Flags ----
  const redFlags: { cat: string; items: string[]; action: string }[] = [
    { cat: '1 · Experience', items: ['"3 साल" बोले पर trailer type / GVW / axle पर confused', 'Recent gap — "6–8 महीने से ट्रेलर नहीं चलाया"', 'Vague employer — "मालिक का नाम याद नहीं"'], action: 'Deep probe → clarity न मिले = Amber / Reject' },
    { cat: '2 · Document & Identity', items: ['"थोड़ा सा फ़र्क है, चलता है" / "PAN में short name है"', 'Defensive — "इतना क्यों पूछ रहे हो?"'], action: 'Immediate Reject (Zero Tolerance)' },
    { cat: '3 · Interview & Location', items: ['"देखेंगे", "try करेंगे", "confirm बाद में"', 'Excuses — गाँव जाना है / शादी है / पैसा नहीं है'], action: 'One warning → फिर Reject' },
    { cat: '4 · Video & Technology', items: ['"Camera खराब है" / "Video call नहीं करता"', 'हर सवाल पर "Network नहीं है"'], action: 'Reschedule once → repeat = Reject' },
    { cat: '5 · OTP & Verification', items: ['"OTP क्यों चाहिए?" / "भरोसा नहीं"', 'Partial consent — court okay पर OTP नहीं'], action: 'Direct Reject (Non-negotiable)' },
    { cat: '6 · Behaviour & Attitude', items: ['Over-smart — "हम तो सब जानते हैं"', 'Aggressive / argumentative tone', 'बिना सोचे "हाँ जी हाँ"'], action: 'Trap question पूछें → fail = Reject' },
    { cat: '7 · Financial & Stability', items: ['"Daily पैसा चाहिए" / advance dependence', 'पिछले मालिक का loan अभी बाकी'], action: 'Amber / Reject' },
    { cat: '8 · Intent & Commitment', items: ['6–8 महीने में 4–5 jobs (job hopping)', 'Past ghosting — "पहले छोड़ दिया / phone बंद कर दिया"', 'Joining vagueness — "call आने दो, फिर सोचेंगे"'], action: 'Reject' }
  ];

  // ---- Scoring framework ----
  const scoring: { n: string; label: string; pts: number; detail: string }[] = [
    { n: '1', label: 'Experience & Skills', pts: 25, detail: '3+ yrs trailer → 15 · type + GVW clarity → 10' },
    { n: '2', label: 'Document Accuracy & Consistency', pts: 20, detail: 'Exact name/DOB match → 15 · valid & original → 5' },
    { n: '3', label: 'Compliance, Discipline & Background', pts: 15, detail: 'No blacklist / serious accident → 10 · SOP acceptance → 5' },
    { n: '4', label: 'Location, Route & Availability', pts: 15, detail: 'Interview commitment → 8 · route/shift flexibility → 7' },
    { n: '5', label: 'Technology & Interview Readiness', pts: 10, detail: 'Smartphone + video → 6 · app/comm comfort → 4' },
    { n: '6', label: 'Verification & Consent', pts: 10, detail: 'OTP & verification consent → 10' },
    { n: '7', label: 'Intent & Stability', pts: 5, detail: 'Clear joining intent & seriousness → 5' }
  ];

  const autoReject = [
    '3 साल से कम ट्रेलर अनुभव',
    'नाम / पिता का नाम / DOB mismatch',
    'Interview date या location flexibility',
    'OTP / court / address verification refusal',
    'Video interview से इंकार',
    'Vague, dishonest या manipulative answers',
    'Past ghosting admission'
  ];

  return (
    <main className="flex h-[calc(100vh-80px)] bg-white overflow-hidden border border-gray-200 rounded-xl relative text-xs">

      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toastMessage}
        </div>
      )}

      {/* Left Sub nav */}
      <aside className="w-[210px] bg-gray-50/60 border-r border-gray-200 flex flex-col shrink-0 select-none">
        <div className="p-3 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider bg-white">
          Greenline SOP
        </div>
        <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
          {[
            { id: 'callScript', label: 'Screening Call Script' },
            { id: 'questionnaire', label: 'Master Questionnaire' },
            { id: 'redFlags', label: 'Red Flags' },
            { id: 'scoring', label: 'Scoring & Decision' },
            { id: 'autoReject', label: 'Auto-Reject Rules' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as Section)}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition-colors ${
                activeSection === tab.id
                  ? 'bg-[#8E44AD] text-white'
                  : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Live-call name status */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Live Call</div>
          {hasLead ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#7D3C98]">
              <span className="w-2 h-2 rounded-full bg-[#8E44AD] animate-pulse"></span>
              {leadName}
            </div>
          ) : (
            <div className="text-[11px] text-gray-400 leading-snug">No active call — sample name shown. Script auto-fills the driver's name once you dial.</div>
          )}
        </div>
      </aside>

      {/* Main Workspace */}
      <section className="flex-1 flex flex-col overflow-hidden bg-white min-w-0">

        {/* Header */}
        <div className="p-4 bg-white border-b border-gray-200 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
              {activeSection === 'callScript' && 'ग्रीनलाइन स्क्रीनिंग कॉल स्क्रिप्ट'}
              {activeSection === 'questionnaire' && 'मास्टर स्क्रीनिंग प्रश्नावली (32 Q)'}
              {activeSection === 'redFlags' && 'रेड फ्लैग्स — Do Not Forward'}
              {activeSection === 'scoring' && 'स्कोरिंग व निर्णय (100 Points)'}
              {activeSection === 'autoReject' && 'ऑटो-रिजेक्ट कंडीशन्स'}
            </h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Greenline Hiring SOP · Job Manager screening · auto-personalised</p>
          </div>

          {activeSection === 'callScript' && (
            <button
              onClick={() => handleAudioPlay('callScript')}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
                playingAudio === 'callScript'
                  ? 'bg-red-50 border-red-200 text-red-600 animate-pulse'
                  : 'border-[#8E44AD] text-[#8E44AD] hover:bg-purple-50'
              }`}
            >
              <span className="material-symbols-outlined text-[16px]">
                {playingAudio === 'callScript' ? 'pause_circle' : 'play_circle'}
              </span>
              <span>{playingAudio === 'callScript' ? 'Pause Snippet' : '▶ Listen'}</span>
            </button>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-gray-50/20">
          <div className="max-w-[760px] mx-auto text-gray-800">

            {/* CALL SCRIPT */}
            {activeSection === 'callScript' && (
              <div className="space-y-3">
                <div className="bg-purple-50/60 border border-purple-100 rounded-lg px-3 py-2 text-[11px] font-semibold text-[#7D3C98] flex items-center gap-1.5 font-sans">
                  <span className="material-symbols-outlined text-[15px]">shield</span>
                  आप Greenline के Gatekeeper हैं — एक गलत driver भेजना 100 अच्छे drivers से ज़्यादा नुकसान करता है।
                </div>
                {steps.map(s => (
                  <div key={s.n} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="flex items-center gap-2.5 px-4 py-2.5 border-b border-gray-100 bg-gray-50/50">
                      <span className="bg-[#8E44AD] text-white w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-[11px] font-sans">{s.n}</span>
                      <span className="font-bold text-gray-800 text-[12px] font-sans">{s.title}</span>
                    </div>
                    <div className="p-4 font-hindi leading-8 text-[18px] text-gray-700">
                      {withName(s.text)}
                      {s.note && (
                        <div className="mt-2.5 flex items-start gap-1.5 bg-red-50/60 border border-red-100 rounded-lg px-2.5 py-1.5 text-[11px] text-red-600 font-sans font-semibold">
                          <span className="material-symbols-outlined text-[14px] mt-px">flag</span>
                          <span>{s.note}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* QUESTIONNAIRE */}
            {activeSection === 'questionnaire' && (
              <div className="space-y-4 font-sans">
                <div className="relative">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions (Hindi keyword)..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#8E44AD]"
                  />
                </div>
                {filteredQuestionnaire.map((g, gi) => (
                  <div key={gi} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                    <div className="px-4 py-2.5 bg-purple-50/50 border-b border-purple-100 font-bold text-[#7D3C98] text-[12px]">{g.section}</div>
                    <ol className="p-4 space-y-2.5 font-hindi text-[16px] text-gray-700 leading-8">
                      {g.questions.map((q, qi) => (
                        <li key={qi} className="flex items-start gap-2">
                          <span className="text-[#8E44AD] font-bold font-sans">›</span>
                          <span>{q}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                ))}
                {filteredQuestionnaire.length === 0 && (
                  <div className="text-center text-gray-400 py-8">No questions match "{searchQuery}".</div>
                )}
              </div>
            )}

            {/* RED FLAGS */}
            {activeSection === 'redFlags' && (
              <div className="space-y-3 font-sans">
                {redFlags.map((rf, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="material-symbols-outlined text-red-500 text-[16px]">flag</span>
                      <span className="font-bold text-gray-800 text-[12px]">{rf.cat}</span>
                    </div>
                    <ul className="space-y-1.5 font-hindi text-[15px] text-gray-700 mb-2.5">
                      {rf.items.map((it, j) => (
                        <li key={j} className="flex items-start gap-1.5">
                          <span className="text-red-400 font-bold">•</span>
                          <span>{it}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="text-[11px] font-bold text-red-600 bg-red-50/60 border border-red-100 rounded-lg px-2.5 py-1.5 inline-block">
                      Action: {rf.action}
                    </div>
                  </div>
                ))}
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                  <div className="font-bold text-amber-700 text-[12px] mb-1.5">🟡 Amber Flags — Manager Review</div>
                  <ul className="space-y-1 font-hindi text-[12.5px] text-amber-800">
                    <li>• Accident history पर honest explanation</li>
                    <li>• Medical issue पर under control</li>
                    <li>• अनुभव 3 वर्ष से थोड़ा ऊपर पर weak confidence</li>
                    <li>• पुराना document issue अब corrected</li>
                  </ul>
                </div>
              </div>
            )}

            {/* SCORING & DECISION */}
            {activeSection === 'scoring' && (
              <div className="space-y-4 font-sans">
                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                  <div className="px-4 py-2.5 bg-purple-50/50 border-b border-purple-100 font-bold text-[#7D3C98] text-[12px] flex justify-between">
                    <span>Scoring Framework</span><span>Total: 100</span>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {scoring.map((s, i) => (
                      <div key={i} className="px-4 py-3 flex items-start gap-3">
                        <span className="bg-purple-100 text-[#7D3C98] w-6 h-6 rounded-full flex items-center justify-center shrink-0 font-bold text-[11px]">{s.n}</span>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-gray-800 text-[12px]">{s.label}</span>
                            <span className="font-extrabold text-[#8E44AD] text-[13px]">{s.pts}</span>
                          </div>
                          <p className="text-gray-500 text-[11px] mt-0.5">{s.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2">
                  <div className="rounded-xl border border-green-200 bg-green-50/60 px-4 py-3 flex items-center gap-3">
                    <span className="text-lg">🟢</span>
                    <div><span className="font-extrabold text-green-700 text-[13px]">80–100 GREEN</span><p className="text-[11px] text-green-800">Recommended for Greenline Final Round</p></div>
                  </div>
                  <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-4 py-3 flex items-center gap-3">
                    <span className="text-lg">🟡</span>
                    <div><span className="font-extrabold text-amber-700 text-[13px]">65–79 AMBER</span><p className="text-[11px] text-amber-800">Hold / Re-verify / Manager Review</p></div>
                  </div>
                  <div className="rounded-xl border border-red-200 bg-red-50/60 px-4 py-3 flex items-center gap-3">
                    <span className="text-lg">🔴</span>
                    <div><span className="font-extrabold text-red-700 text-[13px]">Below 65 RED</span><p className="text-[11px] text-red-800">Reject — Do Not Forward to Greenline</p></div>
                  </div>
                </div>

                <div className="bg-gray-900 text-gray-100 rounded-xl px-4 py-3 text-[11px] leading-relaxed">
                  <span className="font-bold text-white">First-phase rule:</span> No emotional exceptions · No document mismatch tolerance · No interview-date flexibility · One warning = rejection.
                </div>
              </div>
            )}

            {/* AUTO-REJECT */}
            {activeSection === 'autoReject' && (
              <div className="space-y-3 font-sans">
                <div className="bg-red-50/60 border border-red-100 rounded-lg px-3 py-2 text-[11px] font-semibold text-red-600 flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">block</span>
                  Non-negotiable — कोई authority इन्हें override नहीं कर सकती। System auto-marks NO-PAY.
                </div>
                {autoReject.map((r, i) => (
                  <div key={i} className="bg-white border border-gray-200 rounded-xl px-4 py-3 flex items-center gap-2.5">
                    <span className="material-symbols-outlined text-red-500 text-[18px]">cancel</span>
                    <span className="font-hindi text-[16px] text-gray-700">{r}</span>
                  </div>
                ))}
              </div>
            )}

          </div>
        </div>
      </section>

    </main>
  );
};

export default MmScriptLibrary;
