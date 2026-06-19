import React, { useState } from 'react';

interface Objection {
  key: string;
  question: string;
  answer: string;
}

export const DwScriptLibrary: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'opening' | 'jobReady' | 'verified' | 'trusted' | 'objections' | 'closing'>('opening');
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

  const objections: Objection[] = [
    { key: 'paisa', question: 'पैसे नहीं हैं', answer: 'राजेश जी, यह एक छोटा निवेश है जो आपके व्यवसाय को कई गुना बढ़ा देगा। केवल ₹199 या ₹299 के निवेश से आपको तुरंत लोड बुकिंग मिलना शुरू हो जाएगी और आप पहले ही दिन अपनी लागत निकाल लेंगे।' },
    { key: 'job', question: 'पहले कोई जॉब नहीं मिली', answer: 'हम समझते हैं राजेश जी, लेकिन ट्रक मित्र पर 50,000 से अधिक ड्राइवर्स रोजाना लोड पा रहे हैं। हमारी टीम आपको पहला लोड बुक कराने में खुद मदद करेगी।' },
    { key: 'baad', question: 'सोचता हूँ, बाद में करूंगा', answer: 'राजेश जी, अभी ऑफर्स चल रहे हैं और कई ट्रांसपोर्टर्स तुरंत ड्राइवर्स ढूंढ रहे हैं। अगर आप अभी शुरू करते हैं तो आज ही काम मिलना आसान रहेगा।' },
    { key: 'fraud', question: 'यह सब fraud है', answer: 'विश्वास रखिए राजेश जी, हम पूरी तरह से सरकारी मान्यता प्राप्त हैं और हमारे पास 50,000+ ड्राइवर्स का नेटवर्क है। आप चाहें तो पहले कम राशि का ₹199 का प्लान लेकर स्वयं जांच सकते हैं।' },
    { key: 'delete', question: 'App delete कर दी', answer: 'कोई बात नहीं राजेश जी, मैं आपके व्हाट्सएप पर डायरेक्ट ऐप का डाउनलोड लिंक और वीडियो भेज रहा हूँ। उसे देखकर आप 2 मिनट में दोबारा इंस्टॉल कर सकते हैं।' },
    { key: 'gaadi', question: 'ट्रक नहीं है / खुद गाड़ी नहीं है', answer: 'राजेश जी, हमारे पास ऐसे भी ट्रांसपोर्टर्स हैं जो बिना गाड़ी वाले ड्राइवर्स को सीधे मंथली सैलरी पर जॉब दे रहे हैं। हम आपको वैसी ही नौकरियों के लिए सजेस्ट करेंगे।' }
  ];

  // Filter and sort objections (bookmarks on top)
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
          Dialogue Flow
        </div>
        <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
          {[
            { id: 'opening', label: 'Opening' },
            { id: 'jobReady', label: 'Job Ready Pitch' },
            { id: 'verified', label: 'Verified Upsell' },
            { id: 'trusted', label: 'Trusted Upsell' },
            { id: 'objections', label: 'Objection Handling' },
            { id: 'closing', label: 'Closing' }
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
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
      </section>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col overflow-hidden min-w-0">
        
        {/* Content Box Header */}
        <div className="p-4 border-b border-gray-200 bg-white shrink-0 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                {activeSection === 'opening' && 'পরিচয় और ग्रीटिंग (Opening)'}
                {activeSection === 'jobReady' && 'जॉब रेडी प्लान (Job Ready Pitch)'}
                {activeSection === 'verified' && 'वेरिफाइड प्लान (Verified Upsell)'}
                {activeSection === 'trusted' && 'ट्रस्टेड प्लान (Trusted Premium)'}
                {activeSection === 'objections' && 'आपत्तियां और समाधान (Objections)'}
                {activeSection === 'closing' && 'कॉल क्लोजिंग (Closing Script)'}
              </h2>
              {/* Red Updated Tag if less than 3 days */}
              {activeSection === 'verified' && (
                <span className="bg-red-50 text-red-500 border border-red-100 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                  Updated
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Last updated: 3 days ago by Content Analyst</p>
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

        {/* Audio Player Strip (if playing) */}
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
          <div className="max-w-[480px] mx-auto text-gray-800">

            {activeSection === 'opening' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px] max-w-[480px]">
                <p>
                  "नमस्ते <strong>[चालक का नाम]</strong> जी, मैं ट्रक मित्र से बात कर रहा हूँ। आपका नया वाहन हमारे पोर्टल पर रजिस्टर हुआ है, उसकी बहुत-बहुत बधाई! <br/><br/>
                  क्या यह सही समय है आपसे बात करने का? मैं आपकी प्रोफाइल कम्प्लीट करवाने और लोड दिलाने के बारे में जानकारी देने के लिए कॉल कर रहा हूँ।"
                </p>
              </div>
            )}

            {activeSection === 'jobReady' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px] max-w-[480px]">
                <p>
                  "राजेश जी, हमारा <strong>'जॉब रेडी'</strong> प्लान सिर्फ <strong>₹199/महीने</strong> का है। <br/><br/>
                  इसमें आपको तुरंत एक्टिव ऑर्डर्स दिखने लगेंगे और आप सीधे लोड बुक कर पाएंगे। नए ड्राइवर्स के लिए यह सबसे बेहतरीन प्लान है।"
                </p>
              </div>
            )}

            {activeSection === 'verified' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px] max-w-[480px]">
                <p>
                  "राजेश जी, हमारा सबसे लोकप्रिय प्लान <strong>'Verified Plan'</strong> है जो सिर्फ <strong>₹299/महीने</strong> का है। <br/><br/>
                  इसमें आपकी प्रोफाइल पर <strong>'Verified Badge'</strong> लग जाता है जिससे ट्रांसपोर्टर्स और क्लाइंट्स आप पर ज़्यादा भरोसा करेंगे और आपको 3X ज़्यादा लोड मिलेंगे।"
                </p>
              </div>
            )}

            {activeSection === 'trusted' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px] max-w-[480px]">
                <p>
                  "राजेश जी, हमारा प्रीमियम प्लान <strong>'Trusted Plan'</strong> है जो <strong>₹499/महीने</strong> का है। <br/><br/>
                  इसमें आपको <strong>100% पेमेंट प्रोटेक्शन (Payment Protection)</strong> की गारंटी मिलती है। आपके किए गए ट्रिप का भुगतान सुरक्षित रहेगा और किसी भी विवाद में हमारी सपोर्ट टीम 24 घंटे आपके साथ रहेगी।"
                </p>
              </div>
            )}

            {activeSection === 'objections' && (
              <div className="space-y-4 font-sans">
                
                {/* Search Bar */}
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

                {/* Collapsible Objection Cards */}
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
                          <div className="p-3.5 bg-gray-50 border-t border-gray-100 font-hindi leading-relaxed text-xs text-gray-600">
                            {obj.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSection === 'closing' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px] max-w-[480px]">
                <p>
                  "तो राजेश जी, मैं आपके नंबर पर अभी 'Verified' प्लान का <strong>₹299</strong> का सुरक्षित पेमेंट लिंक भेज रहा हूँ। <br/><br/>
                  आप Google Pay, PhonePe या Paytm से सिर्फ 1 मिनट में पेमेंट कर सकते हैं। पेमेंट होते ही हमारी टीम आपको कॉल करके पहला लोड बुक करवा देगी।"
                </p>
              </div>
            )}

          </div>
        </div>

      </section>

    </main>
  );
};

export default DwScriptLibrary;
