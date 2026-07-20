import React, { useState } from 'react';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';

interface Objection {
  key: string;
  question: string;
  answer: string; // may contain {name} token — replaced with the live lead name
}

type Section = 'opening' | 'about' | 'plans' | 'activation' | 'objections' | 'closing';

export const DwScriptLibrary: React.FC = () => {
  const { currentLeadName, currentPhoneNumber, callState } = useSanCti();
  const onCall = ['dialing', 'ringing', 'connected', 'incoming_ringing'].includes(callState);
  const liveName = currentLeadName && currentLeadName.trim() && currentLeadName !== 'Incoming Call' ? currentLeadName.trim() : '';
  const hasLead = !!liveName || (onCall && !!currentPhoneNumber);
  const leadName = liveName || (onCall ? currentPhoneNumber : '') || '[चालक का नाम]';

  const [activeSection, setActiveSection] = useState<Section>('opening');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>(['paisa']);
  const [expandedObjection, setExpandedObjection] = useState<string | null>('paisa');
  const [playingAudio, setPlayingAudio] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const toggleBookmark = (e: React.MouseEvent, key: string) => {
    e.stopPropagation();
    setBookmarks(prev =>
      prev.includes(key) ? prev.filter(k => k !== key) : [...prev, key]
    );
  };

  const handleAudioPlay = (section: string) => {
    if (playingAudio === section) {
      setPlayingAudio(null);
      triggerToast('Audio playback paused');
    } else {
      setPlayingAudio(section);
      triggerToast(`Playing model call audio snippet for "${section}"...`);
    }
  };

  // Inline highlighted chip for the person currently on the call.
  const Name: React.FC = () => (
    <span
      className={`px-1.5 py-0.5 rounded font-bold ${
        hasLead
          ? 'bg-[#EAFAF1] text-[#1E8449]'
          : 'bg-gray-100 text-gray-500 border border-dashed border-gray-300'
      }`}
    >
      {leadName}
    </span>
  );

  // Renders a string, swapping every {name} token for the live Name chip.
  const withName = (text: string): React.ReactNode =>
    text.split('{name}').flatMap((part, i) =>
      i === 0 ? [part] : [<Name key={`n${i}`} />, part]
    );

  const objections: Objection[] = [
    { key: 'paisa', question: 'पैसे नहीं हैं', answer: '{name} जी, यह एक छोटा निवेश है जो आपके व्यवसाय को कई गुना बढ़ा देगा। केवल ₹199 या ₹299 के निवेश से आपको तुरंत लोड बुकिंग मिलना शुरू हो जाएगी और आप पहले ही दिन अपनी लागत निकाल लेंगे।' },
    { key: 'job', question: 'पहले कोई जॉब नहीं मिली', answer: 'हम समझते हैं {name} जी, लेकिन ट्रक मित्र पर 50,000 से अधिक ड्राइवर्स रोजाना लोड पा रहे हैं। हमारी टीम आपको पहला लोड बुक कराने में खुद मदद करेगी।' },
    { key: 'baad', question: 'सोचता हूँ, बाद में करूंगा', answer: '{name} जी, अभी ऑफर्स चल रहे हैं और कई ट्रांसपोर्टर्स तुरंत ड्राइवर्स ढूंढ रहे हैं। अगर आप अभी शुरू करते हैं तो आज ही काम मिलना आसान रहेगा।' },
    { key: 'fraud', question: 'यह सब fraud है', answer: 'विश्वास रखिए {name} जी, हम पूरी तरह से सरकारी मान्यता प्राप्त हैं और हमारे पास 50,000+ ड्राइवर्स का नेटवर्क है। आप चाहें तो पहले कम राशि का ₹199 का प्लान लेकर स्वयं जांच सकते हैं।' },
    { key: 'delete', question: 'App delete कर दी', answer: 'कोई बात नहीं {name} जी, मैं आपके व्हाट्सएप पर डायरेक्ट ऐप का डाउनलोड लिंक और वीडियो भेज रहा हूँ। उसे देखकर आप 2 मिनट में दोबारा इंस्टॉल कर सकते हैं।' },
    { key: 'gaadi', question: 'ट्रक नहीं है / खुद गाड़ी नहीं है', answer: '{name} जी, हमारे पास ऐसे भी ट्रांसपोर्टर्स हैं जो बिना गाड़ी वाले ड्राइवर्स को सीधे मंथली सैलरी पर जॉब दे रहे हैं। हम आपको वैसी ही नौकरियों के लिए सजेस्ट करेंगे।' }
  ];

  const getFilteredObjections = () => {
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

  const sortedObjections = getFilteredObjections();

  return (
    <main className="h-[calc(100vh-80px)] flex bg-white overflow-hidden border border-gray-200 rounded-xl relative">

      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#27AE60]"></span>
          {toastMessage}
        </div>
      )}

      {/* Left sub-nav */}
      <section className="w-[200px] border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0 select-none">
        <div className="p-3 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider bg-white">
          Driver Script Flow
        </div>
        <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
          {[
            { id: 'opening', label: 'Opening & Greeting' },
            { id: 'about', label: 'About the App' },
            { id: 'plans', label: 'Plans (₹199/299/499)' },
            { id: 'activation', label: 'Activation & Payment' },
            { id: 'objections', label: 'Objection Handling' },
            { id: 'closing', label: 'Closing & Connect' }
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as Section)}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition-colors ${
                activeSection === sec.id
                  ? 'bg-[#27AE60] text-white'
                  : 'text-gray-600 hover:bg-gray-150/70 hover:text-gray-900'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </nav>

        {/* Live-call name status */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Live Call</div>
          {hasLead ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1E8449]">
              <span className="w-2 h-2 rounded-full bg-[#27AE60] animate-pulse"></span>
              {leadName}
            </div>
          ) : (
            <div className="text-[11px] text-gray-400 leading-snug">No active call — sample name shown. Script auto-fills the driver's name once you dial.</div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col overflow-hidden min-w-0">

        {/* Content Box Header */}
        <div className="p-4 border-b border-gray-200 bg-white shrink-0 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                {activeSection === 'opening' && 'ग्रीटिंग एवं परिचय (Opening)'}
                {activeSection === 'about' && 'ऐप की जानकारी (About the App)'}
                {activeSection === 'plans' && 'सब्सक्रिप्शन प्लान (Plans & Charges)'}
                {activeSection === 'activation' && 'एक्टिवेशन एवं पेमेंट (Activation)'}
                {activeSection === 'objections' && 'आपत्तियां और समाधान (Objections)'}
                {activeSection === 'closing' && 'क्लोजिंग एवं कनेक्ट (Closing)'}
              </h2>
              {activeSection === 'plans' && (
                <span className="bg-[#EAFAF1] text-[#1E8449] border border-green-100 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                  1 Year Validity
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">TruckMitr Outbound Script (Driver) · auto-personalised</p>
          </div>

          <button
            onClick={() => handleAudioPlay(activeSection)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
              playingAudio === activeSection
                ? 'bg-red-50 border-red-200 text-red-600 animate-pulse'
                : 'border-[#27AE60] text-[#27AE60] hover:bg-[#EAFAF1]'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {playingAudio === activeSection ? 'pause_circle' : 'play_circle'}
            </span>
            <span>{playingAudio === activeSection ? 'Pause Snippet' : '▶ Listen'}</span>
          </button>
        </div>

        {/* Audio Player Strip */}
        {playingAudio && (
          <div className="bg-gray-900 px-4 py-2 text-white text-xs flex justify-between items-center shrink-0">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-[#27AE60] rounded-full animate-ping"></span>
              <span className="font-semibold">Playing Standard Call Audio Demo Snippet...</span>
            </div>
            <span className="font-mono text-[10px] text-gray-500">00:08 / 02:14</span>
          </div>
        )}

        {/* Script Content Area */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-gray-50/20">
          <div className="max-w-[720px] mx-auto text-gray-800">

            {activeSection === 'opening' && (
              <div className="space-y-5 font-hindi leading-9 text-[20px]">
                <p>
                  "नमस्कार <Name /> जी। क्या मेरी बात <Name /> जी से हो रही है?"
                </p>
                <p>
                  "ट्रकमित्र परिवार में जुड़ने के लिए आपका धन्यवाद। जैसा कि मैंने चेक किया, आपने हमारे ऐप में अपना रजिस्ट्रेशन किया है।"
                </p>
                <p>
                  "क्या यह सही समय होगा आपसे बात करने का? मैं आपको <strong>ट्रकमित्र ऐप</strong> के बारे में जानकारी देना चाहूँगा।"
                </p>
              </div>
            )}

            {activeSection === 'about' && (
              <div className="space-y-5 font-hindi leading-9 text-[20px]">
                <p>
                  "<Name /> जी, <strong>ट्रकमित्र ऐप</strong> भारत का एकमात्र ऐसा ऐप है जिसमें आपको बेहतर जॉब के साथ-साथ वीडियो ट्रेनिंग, सर्टिफिकेट, डॉक्युमेंट वेरिफिकेशन के साथ बैकग्राउंड वेरिफिकेशन की भी सुविधा दी जाती है।"
                </p>
                <p>
                  "इसमें <strong>वेरिफाइड ट्रांसपोर्टर और ड्राइवर</strong> के लिए वेरिफाइड नई जॉब अच्छी सैलरी के साथ प्रोवाइड की जाती है। सबसे अच्छी बात यह है कि एप्लिकेशन में <strong>Greenline, Mahindra Logistics</strong> जैसी बड़ी कंपनी की जॉब अवेलेबल रहती हैं।"
                </p>
                <p>
                  "इसमें एक सुविधा और है <strong>'ड्राइवर की आवाज़'</strong> — जिसमें आप अपनी बात पूरी ट्रकिंग कम्युनिटी तक पहुंचा सकते हैं (RTO चैलेंज, ट्रैफिक इशू, पुलिस की नाजायज़ वसूली और अपना अनुभव)।"
                </p>
                <p>
                  "और <strong>5 लोगों को रेफर</strong> करके रजिस्टर कराने पर आपको हमारी ओर से <strong>₹100 का कैशबैक</strong> जीतने का मौका मिलता है।"
                </p>
              </div>
            )}

            {activeSection === 'plans' && (
              <div className="space-y-3 font-hindi leading-relaxed text-[16px]">
                <p className="text-[13px] text-gray-500 font-sans">Subscription Plan &amp; Charges (1 Year)</p>

                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-bold text-gray-800">जॉब रेडी</span>
                    <span className="text-[#27AE60] font-extrabold text-lg font-sans">₹199</span>
                  </div>
                  <p className="text-gray-700 text-[15px]">ऐप के सभी फीचर्स यूज़ करने के साथ-साथ <strong>5 जॉब पोस्ट</strong> पर अप्लाई कर सकते हैं।</p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-bold text-gray-800">वेरिफाइड</span>
                    <span className="text-[#27AE60] font-extrabold text-lg font-sans">₹299</span>
                  </div>
                  <p className="text-gray-700 text-[15px]">सभी फीचर्स के साथ अपनी <strong>ID वेरिफाई</strong> कर सकते हैं और पूरे <strong>20 जॉब पोस्ट</strong> अप्लाई कर सकते हैं।</p>
                </div>

                <div className="border-2 border-[#27AE60] rounded-xl p-4 bg-[#EAFAF1]/40 relative">
                  <span className="absolute -top-2 right-3 bg-[#27AE60] text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase">Recommended</span>
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-bold text-gray-800">ट्रस्टेड (प्रीमियम)</span>
                    <span className="text-[#27AE60] font-extrabold text-lg font-sans">₹499</span>
                  </div>
                  <p className="text-gray-700 text-[15px]"><strong>अनलिमिटेड जॉब</strong> अप्लाई के साथ ID वेरिफिकेशन और <strong>बैकग्राउंड चेक (कोर्ट व डिजिटल एड्रेस)</strong> — और सभी प्रीमियम फीचर।</p>
                </div>

                <div className="bg-white border border-green-100 rounded-xl p-3.5 mt-2">
                  <span className="text-[10px] font-bold text-[#1E8449] uppercase tracking-wider block mb-1">Recommendation Pitch</span>
                  <p className="text-gray-700 text-[16px] leading-8">
                    "<Name /> जी, मैं आपको सजेस्ट करूँगा कि आप <strong>₹499 का प्लान</strong> लें, ताकि आपको अनलिमिटेड जॉब और अपना ID व बैकग्राउंड वेरिफिकेशन भी हो जाए। जिस ड्राइवर का ID व बैकग्राउंड वेरिफिकेशन कम्प्लीट होता है, उनकी प्रोफाइल ट्रांसपोर्टर को <strong>सबसे पहले</strong> दिखाई देती है। तो मैं आपको प्लान एक्टिवेट करने में गाइड कर देता हूँ।"
                  </p>
                </div>
              </div>
            )}

            {activeSection === 'activation' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[16px]">
                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-3 font-sans">If customer agrees — Guide further</span>
                  <ol className="space-y-2.5">
                    {[
                      'Home page पर जाएं',
                      "'सभी नौकरियां' पर क्लिक करें",
                      'City &amp; Route सेलेक्ट करें',
                      'किसी भी जॉब पर अप्लाई करें'
                    ].map((step, i) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="bg-[#27AE60] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px] font-sans">{i + 1}</span>
                        <span className="text-gray-700" dangerouslySetInnerHTML={{ __html: step }} />
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl p-4">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-3 font-sans">Payment Mode</span>
                  <div className="flex flex-wrap gap-2 font-sans">
                    {['QR Code', 'UPI (PhonePe / GPay / Paytm)', 'Net Banking', 'Credit &amp; Debit Card'].map((m, i) => (
                      <span key={i} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-700" dangerouslySetInnerHTML={{ __html: m }} />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'objections' && (
              <div className="space-y-4 font-sans">
                <div className="relative mb-4">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type objection keyword (e.g. paisa, fraud)..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#27AE60]"
                  />
                </div>

                <div className="space-y-2">
                  {sortedObjections.map(obj => {
                    const isExpanded = expandedObjection === obj.key;
                    const isBookmarked = bookmarks.includes(obj.key);
                    return (
                      <div
                        key={obj.key}
                        className={`border rounded-xl bg-white overflow-hidden transition-all duration-200 ${
                          isExpanded ? 'border-[#27AE60] shadow-sm' : 'border-gray-200'
                        }`}
                      >
                        <div
                          onClick={() => setExpandedObjection(isExpanded ? null : obj.key)}
                          className="p-3.5 flex justify-between items-center cursor-pointer select-none hover:bg-gray-50/50"
                        >
                          <span className="text-xs font-bold text-gray-800 flex items-center gap-1.5">
                            {isBookmarked && <span className="text-yellow-500">★</span>}
                            {obj.question}
                          </span>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => toggleBookmark(e, obj.key)}
                              className={`text-xs p-1 rounded hover:bg-gray-150/70 transition-colors ${
                                isBookmarked ? 'text-yellow-500' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </button>
                            <span className="text-gray-400 text-xs">
                              {isExpanded ? '▲' : '▼'}
                            </span>
                          </div>
                        </div>

                        {isExpanded && (
                          <div className="p-3.5 bg-gray-50 border-t border-gray-100 font-hindi leading-8 text-[16px] text-gray-700">
                            {withName(obj.answer)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSection === 'closing' && (
              <div className="space-y-5 font-hindi leading-9 text-[20px]">
                <p>
                  "बधाई हो <Name /> जी! अब आप प्लान की दी गई सारी सर्विस यूज़ कर सकते हैं।"
                </p>
                <p>
                  "क्या मैं आपकी कोई अन्य सहायता कर सकता हूँ? ट्रकमित्र में समय देने के लिए धन्यवाद।"
                </p>

                <div className="bg-white border border-gray-200 rounded-xl p-4 font-sans mt-2">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">Connect Us</span>
                  <div className="space-y-1.5 text-[13px] text-gray-700">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#27AE60]">call</span>
                      Toll Free: <strong>1800 102 4558</strong>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-[16px] text-[#27AE60]">chat</span>
                      WhatsApp: <strong>9254972811</strong>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </section>

    </main>
  );
};

export default DwScriptLibrary;
