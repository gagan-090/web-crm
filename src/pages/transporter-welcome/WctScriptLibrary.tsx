import React, { useState } from 'react';

interface WctObjection {
  key: string;
  question: string;
  answer: string;
}

export const WctScriptLibrary: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'opening' | 'freePitch' | 'premiumPitch' | 'superPitch' | 'objections' | 'fleetLogic'>('opening');
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
      triggerToast(`Playing transporter model call audio snippet for "${section}"...`);
    }
  };

  const objections: WctObjection[] = [
    { key: 'paisa', question: 'पैसे क्यों दूँ? (₹1,999 बहुत ज़्यादा है)', answer: 'राजीव जी, जब आप किसी लोकल एजेंसी या ब्रोकर से ड्राइवर लेते हैं तो वो प्रति ड्राइवर ₹5,000 से ₹10,000 तक चार्ज करते हैं। ट्रक मित्र पर हम आपको मात्र ₹1,999 में 3 महीने के लिए अनलिमिटेड ड्राइवर्स का एक्सेस देते हैं। यह आपके रिक्रूटमेंट की लागत को 80% तक कम कर देता है।' },
    { key: 'agency', question: 'एजेंसी से ले लूंगा, वो ज़िम्मेदारी लेते हैं', answer: 'राजीव जी, एजेंसियां ड्राइवर भागने पर नया ड्राइवर देने में हफ़्तों लगाती हैं या फिर से चार्ज करती हैं। ट्रक मित्र के पास 50,000+ ड्राइवर्स का नेटवर्क है। यहाँ आपको सिर्फ 10 मिनट में दूसरा रिप्लेसमेंट ड्राइवर मिल जाता है और कोई अतिरिक्त शुल्क भी नहीं देना होता।' },
    { key: 'fraud', question: 'यह कोई फ्रॉड या धोखाधड़ी तो नहीं है?', answer: 'राजीव जी, ट्रक मित्र भारत सरकार द्वारा मान्यता प्राप्त कंपनी है और 2,000 से अधिक रजिस्टर्ड ट्रांसपोर्टर्स हमारे माध्यम से रोज़ाना गाड़ी दौड़ा रहे हैं। आप हमारे फ्री प्लान से शुरू करके ड्राइवर्स की लिस्ट और उनके डाक्यूमेंट्स स्वयं देख सकते हैं, फिर विश्वास होने पर ही पेमेंट करें।' },
    { key: 'noneed', question: 'अभी कोई गाड़ी खाली नहीं है / ड्राइवर की ज़रूरत नहीं है', answer: 'राजीव जी, अभी सीज़न का समय चल रहा है और अच्छे ड्राइवर्स की डिमांड बहुत ज़्यादा है। अभी प्रोफाइल बनाकर रख लीजिए ताकि जैसे ही आपकी गाड़ी खाली हो या कोई ड्राइवर छुट्टी पर जाए, आपको तुरंत वेरीफाइड ड्राइवर मिल सके। बिना ड्राइवर गाड़ी खड़ी रहने पर रोज़ का ₹3,000 का नुकसान होता है।' },
    { key: 'broker', question: 'हम तो ब्रोकर हैं, ड्राइवर खुद रखता है', answer: 'सर, ब्रोकर भाइयों के लिए तो ड्राइवर की समय पर उपलब्धता ही साख का सवाल होती है। अगर आपका क्लाइंट लोड देने को तैयार है और अंतिम समय पर ड्राइवर ने मना कर दिया, तो आपकी साख बिगड़ती है। ट्रक मित्र के जरिए आप तुरंत बैकअप ड्राइवर तैयार रख सकते हैं।' }
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
          <span className="w-2 h-2 rounded-full bg-[#FB641B]"></span>
          {toastMessage}
        </div>
      )}

      {/* Left sub-nav (WCT Orange Theme) */}
      <section className="w-[200px] border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0 select-none">
        <div className="p-3 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider bg-white">
          Dialogue Flow
        </div>
        <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
          {[
            { id: 'opening', label: 'Opening Greeting' },
            { id: 'freePitch', label: 'Free Plan Pitch' },
            { id: 'premiumPitch', label: 'Premium Pitch (₹1,999)' },
            { id: 'superPitch', label: 'Super Premium (₹2,999)' },
            { id: 'objections', label: 'Objections & Pitches' },
            { id: 'fleetLogic', label: 'Fleet-Size Strategy' }
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as any)}
              className={`w-full text-left px-3 py-2 rounded text-xs font-semibold transition-colors ${
                activeSection === sec.id
                  ? 'bg-[#FB641B] text-white'
                  : 'text-gray-600 hover:bg-gray-150/70 hover:text-gray-900'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </nav>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col overflow-hidden min-w-0 border-r border-gray-200">
        
        {/* Content Box Header */}
        <div className="p-4 border-b border-gray-200 bg-white shrink-0 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                {activeSection === 'opening' && 'परिचय एवं स्वागत (Opening Greeting)'}
                {activeSection === 'freePitch' && 'फ्री प्लान की सीमाएं (Free Plan Pitch)'}
                {activeSection === 'premiumPitch' && 'प्रीमियम प्लान पिच (Premium Pitch)'}
                {activeSection === 'superPitch' && 'सुपर प्रीमियम एंटरप्राइज (Super Premium)'}
                {activeSection === 'objections' && 'आपत्तियां और समाधान (Objections)'}
                {activeSection === 'fleetLogic' && 'फ्लीट साइज स्ट्रैटेजिक लॉजिक (Fleet Strategy)'}
              </h2>
              {activeSection === 'premiumPitch' && (
                <span className="bg-red-50 text-[#FB641B] border border-orange-100 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                  Best Seller
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Last updated: Today by Quality Head</p>
          </div>

          <button 
            onClick={() => handleAudioPlay(activeSection)}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 ${
              playingAudio === activeSection
                ? 'bg-red-50 border-red-200 text-red-600 animate-pulse'
                : 'border-[#FB641B] text-[#FB641B] hover:bg-orange-50'
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
              <span className="w-1.5 h-1.5 bg-[#FB641B] rounded-full animate-ping"></span>
              <span className="font-semibold">Playing Transporter Pitch Audio Demo...</span>
            </div>
            <span className="font-mono text-[10px] text-gray-400">00:14 / 03:05</span>
          </div>
        )}

        {/* Script Content Area */}
        <div className="flex-1 overflow-y-auto p-6 min-h-0 bg-gray-50/20">
          <div className="max-w-[500px] mx-auto text-gray-800">

            {activeSection === 'opening' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <p>
                  "नमस्ते <strong>[कांटेक्ट पर्सन का नाम]</strong> जी, मैं ट्रक मित्र से बात कर रहा हूँ। आपकी कंपनी <strong>[कंपनी का नाम]</strong> हमारे साथ रजिस्टर हुई है, उसकी बहुत-बहुत बधाई! <br/><br/>
                  क्या यह सही समय है बात करने का? मैं आपकी गाड़ी की आवश्यकताओं और हमारी तरफ से सीधे ड्राइवर्स की उपलब्धता के बारे में जानकारी देने के लिए कॉल कर रहा हूँ।"
                </p>
              </div>
            )}

            {activeSection === 'freePitch' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <p>
                  "राजीव जी, हमारा फ्री प्लान 1-2 गाड़ियों के लिए है। इसमें आप हफ्ते में सिर्फ 2 ड्राइवर्स की जानकारी देख सकते हैं। <br/><br/>
                  लेकिन अगर गाड़ी ड्राइवर न होने से 1 दिन भी खड़ी रही, तो ₹3,000 का नुकसान होता है। इसलिए हमारा <strong>प्रीमियम प्लान</strong> लेकर अनलिमिटेड ड्राइवर्स के कांटेक्ट रखें ताकि गाड़ी कभी खड़ी न रहे।"
                </p>
              </div>
            )}

            {activeSection === 'premiumPitch' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <p>
                  "राजीव जी, हमारा <strong>प्रीमियम प्लान</strong> सिर्फ <strong>₹1,999 (3 महीने के लिए)</strong> का है। <br/><br/>
                  इसमें आपको एक समर्पित <strong>रिलेशनशिप मैनेजर (RM)</strong> मिलता है। आप जब भी लोड पोस्ट करेंगे, हमारे आरएम खुद ड्राइवर्स का वेरिफिकेशन करके आपकी गाड़ी के लिए ड्राइवर फाइनल करवाएंगे। आपको इसमें अनलिमिटेड ड्राइवर कांटेक्ट्स की सुविधा मिलती है।"
                </p>
              </div>
            )}

            {activeSection === 'superPitch' && (
              <div className="space-y-4 font-hindi leading-relaxed text-[15px]">
                <p>
                  "राजीव जी, 10 से अधिक गाड़ियों के लिए हमारा <strong>सुपर प्रीमियम प्लान</strong> सबसे बेस्ट है जो <strong>₹2,999 (3 महीने के लिए)</strong> का है। <br/><br/>
                  इसमें आपको बल्क ड्राइवर कॉलिंग, डायरेक्ट ड्राइवर इंटरव्यू, <strong>100% पेमेंट प्रोटेक्शन गारंटी</strong>, और पेट्रोल/डीजल पर डिस्काउंट कूपन्स मिलते हैं ताकि आपका मार्जिन और बढ़ सके।"
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
                    placeholder="Type objection keyword (e.g. paisa, agency, fraud)..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#FB641B]"
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
                          isExpanded ? 'border-[#FB641B] shadow-sm' : 'border-gray-200'
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
                          <div className="p-3.5 bg-[#FFFDFB] border-t border-orange-50/50 font-hindi leading-relaxed text-xs text-gray-700">
                            {obj.answer}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {activeSection === 'fleetLogic' && (
              <div className="space-y-4 font-sans text-xs">
                <div className="border border-orange-100 rounded-xl overflow-hidden bg-orange-50/10">
                  <div className="p-3 bg-orange-50 font-bold text-gray-800 border-b border-orange-100">
                    Fleet Sizing Pitching Logic
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex gap-3">
                      <span className="bg-[#FB641B] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">1</span>
                      <div>
                        <h4 className="font-bold text-gray-800">1-3 Trucks (Owner Operators)</h4>
                        <p className="text-gray-600 mt-1 leading-relaxed">Focus on <strong>Return Loads</strong> and <strong>Immediate Driver Hires</strong>. Recommend the Free Plan first to build trust, then upsell quickly using D+7 campaigns.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-3 border-t border-gray-100 pt-3">
                      <span className="bg-[#FB641B] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">2</span>
                      <div>
                        <h4 className="font-bold text-gray-800">4-10 Trucks (Small Fleet Owners)</h4>
                        <p className="text-gray-600 mt-1 leading-relaxed">Escape local agent's high commissions. Recommend <strong>Premium Plan (₹1,999)</strong>. Highlight Relationship Manager who does filtering for them.</p>
                      </div>
                    </div>

                    <div className="flex gap-3 border-t border-gray-100 pt-3">
                      <span className="bg-[#FB641B] text-white w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">3</span>
                      <div>
                        <h4 className="font-bold text-gray-800">10+ Trucks (Asset Heavy Fleet)</h4>
                        <p className="text-gray-600 mt-1 leading-relaxed">TAT optimization and bulk route driver standby pool. Recommend <strong>Super Premium (₹2,999)</strong>. Highlight direct driver screening and route compatibility match.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>
        </div>

      </section>

      {/* Right Column Pinned Reference Box - Agency vs TruckMitr Premium */}
      <section className="w-[300px] bg-gray-50/50 p-4 shrink-0 flex flex-col justify-between overflow-y-auto select-none">
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <span className="text-[10px] text-[#FB641B] font-bold uppercase tracking-wider block mb-1">Value Proposition Reference</span>
            <h3 className="font-bold text-gray-800 text-sm">Agency vs TruckMitr</h3>
            <p className="text-[11px] text-gray-500 mt-1">Keep these cost points open during negotiations to tackle price objections.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-3">
            <div className="border-b border-gray-100 pb-2">
              <span className="text-[10px] text-red-500 font-bold block uppercase">Traditional Agency Costs</span>
              <p className="font-bold text-lg text-gray-800 mt-0.5">₹5,000 – ₹10,000</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Charged per driver recruited, with long lead times (7-14 days).</p>
            </div>

            <div>
              <span className="text-[10px] text-[#FB641B] font-bold block uppercase">TruckMitr Premium</span>
              <p className="font-bold text-lg text-[#FB641B] mt-0.5">₹1,999</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Flat cost for **3 Full Months** of Unlimited Driver Contacts.</p>
            </div>

            <div className="bg-orange-50/50 p-2.5 rounded text-[10px] text-orange-800 font-semibold border border-orange-100/50">
              ⚡ Over 80% cheaper than traditional recruitment with instant contact details.
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2.5">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Standard Pitching Advice</div>
            <div className="space-y-2 text-[11px] text-gray-600">
              <div className="flex items-start gap-1.5">
                <span className="text-[#FB641B] font-bold">•</span>
                <span>Speak in a professional, consultative tone.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#FB641B] font-bold">•</span>
                <span>Do not argue with transporters. Validate their concerns first.</span>
              </div>
              <div className="flex items-start gap-1.5">
                <span className="text-[#FB641B] font-bold">•</span>
                <span>Pivot to return route load availability and truck stand-still costs.</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-200">
          <button 
            onClick={() => handleAudioPlay('opening')}
            className="w-full bg-[#FB641B] hover:bg-[#e05615] text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow"
          >
            <span className="material-symbols-outlined text-[16px]">play_arrow</span> Resume Model Call
          </button>
        </div>
      </section>

    </main>
  );
};

export default WctScriptLibrary;
