import React, { useState } from 'react';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';

interface WctObjection {
  key: string;
  question: string;
  answer: string; // may contain {name} token — replaced with the live lead name
}

type Section = 'opening' | 'about' | 'subscription' | 'hiring' | 'objections' | 'closing';

export const WctScriptLibrary: React.FC = () => {
  const { currentLeadName, currentPhoneNumber, callState } = useSanCti();
  const onCall = ['dialing', 'ringing', 'connected', 'incoming_ringing'].includes(callState);
  const liveName = currentLeadName && currentLeadName.trim() && currentLeadName !== 'Incoming Call' ? currentLeadName.trim() : '';
  const hasLead = !!liveName || (onCall && !!currentPhoneNumber);
  const leadName = liveName || (onCall ? currentPhoneNumber : '') || '[कांटेक्ट का नाम]';

  const [activeSection, setActiveSection] = useState<Section>('opening');
  const [searchQuery, setSearchQuery] = useState('');
  const [bookmarks, setBookmarks] = useState<string[]>(['jarurat']);
  const [expandedObjection, setExpandedObjection] = useState<string | null>('jarurat');
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

  const Name: React.FC = () => (
    <span
      className={`px-1.5 py-0.5 rounded font-bold ${
        hasLead
          ? 'bg-orange-50 text-[#FB641B]'
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

  // Objection handling — "Acknowledge → Build Value → Ask a Question"
  const objections: WctObjection[] = [
    { key: 'jarurat', question: 'अभी जरूरत नहीं है', answer: 'ठीक है {name} सर, समझ सकता हूँ। कई ट्रांसपोर्टर्स भी शुरुआत में ऐसा ही सोचते थे, लेकिन बाद में उन्होंने ट्रकमित्र इसलिए यूज़ करना शुरू किया क्योंकि driver hiring और verification दोनों एक ही platform पर आसानी से हो जाते हैं। अगर अभी driver की requirement नहीं है, तब भी ₹999 subscription से आप 3 महीने तक app active रख सकते हैं, ताकि जब भी जरूरत हो तुरंत drivers से connect हो सकें। सर, क्या आपके पास future में driver requirement आने की संभावना रहती है?' },
    { key: 'khud', question: 'हम खुद driver ढूंढ लेते हैं', answer: 'बिल्कुल सर, ज्यादातर transporters पहले reference या market से drivers ढूंढते हैं। ट्रकमित्र का फायदा यह है कि यहाँ आपको Verified और interested drivers मिलते हैं, जिससे driver ढूंढने में समय और मेहनत दोनों कम लगती है। और ज्यादा support चाहिए तो Premium job में dedicated account manager भी मिलता है जो आपके behalf पर drivers shortlist करता है। सर, अगर driver जल्दी मिल जाए और आपका समय बचे, तो क्या आप इसे try करना चाहेंगे?' },
    { key: 'subscription', question: 'Subscription क्यों लेना है?', answer: 'सर, ट्रकमित्र एक professional platform है जो trucking industry के लोगों को connect करता है। ₹999 subscription से आपको 3 months access, unlimited driver job posting, direct driver connection और driver verification services मिलती हैं। मतलब एक बार subscription लेने के बाद 3 महीनों तक आप बार-बार driver requirement post कर सकते हैं। सर, आपके पास अभी कितने trucks हैं?' },
    { key: 'mehnga', question: 'महंगा है', answer: 'सर अगर compare करें तो ₹999 सिर्फ 3 महीनों के लिए है, और इसमें आप unlimited driver requirement post कर सकते हैं। अगर एक अच्छा driver जल्दी मिल जाए तो आपका काफी समय और operational loss बच सकता है। और अगर आप चाहें तो हम driver verification ₹199 से भी शुरू कर सकते हैं। सर, आप शुरुआत में 1–2 drivers से try करना चाहेंगे?' },
    { key: 'baad', question: 'बाद में करेंगे', answer: 'ठीक है {name} सर। मैं आपको ट्रकमित्र subscription और driver services की details WhatsApp पर भेज देता हूँ, ताकि जब भी आपको drivers hire करने हों या verification करवानी हो, आप तुरंत process शुरू कर सकें। वैसे सर, आपको drivers ज्यादा किस route या truck type के लिए चाहिए होते हैं?' },
    { key: 'hain', question: 'हमारे पास drivers हैं', answer: 'अच्छी बात है सर। ट्रकमित्र का एक बड़ा फायदा यह भी है कि आप अपने existing drivers की verification भी करवा सकते हैं, जिससे उनकी ID, license, PAN, Aadhaar और background check confirm हो जाता है। इससे future में कोई risk या compliance issue नहीं आता। सर, क्या आपने पहले कभी driver verification करवाया है?' },
    { key: 'app', question: 'App use नहीं करना आता', answer: 'कोई समस्या नहीं सर। हमारी team आपको step-by-step guide करती है और जरूरत पड़े तो हम आपके behalf पर job post भी कर सकते हैं। आपको सिर्फ requirement बतानी होती है। सर, अगर आप चाहें तो मैं आपको WhatsApp पर process समझा देता हूँ।' }
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
          <span className="w-2 h-2 rounded-full bg-[#FB641B]"></span>
          {toastMessage}
        </div>
      )}

      {/* Left sub-nav (WCT Orange Theme) */}
      <section className="w-[200px] border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0 select-none">
        <div className="p-3 border-b border-gray-200 text-xs font-bold text-gray-400 uppercase tracking-wider bg-white">
          Transporter Script Flow
        </div>
        <nav className="flex-1 space-y-0.5 p-2 overflow-y-auto">
          {[
            { id: 'opening', label: 'Opening Greeting' },
            { id: 'about', label: 'About & Benefits' },
            { id: 'subscription', label: 'Subscription (₹999)' },
            { id: 'hiring', label: 'Premium Hiring' },
            { id: 'objections', label: 'Objection Handling' },
            { id: 'closing', label: 'Closing' }
          ].map(sec => (
            <button
              key={sec.id}
              onClick={() => setActiveSection(sec.id as Section)}
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

        {/* Live-call name status */}
        <div className="p-3 border-t border-gray-200 bg-white">
          <div className="text-[9px] font-bold text-gray-400 uppercase tracking-wider mb-1">Live Call</div>
          {hasLead ? (
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#FB641B]">
              <span className="w-2 h-2 rounded-full bg-[#FB641B] animate-pulse"></span>
              {leadName}
            </div>
          ) : (
            <div className="text-[11px] text-gray-400 leading-snug">No active call — sample name shown. Script auto-fills the contact's name once you dial.</div>
          )}
        </div>
      </section>

      {/* Main Content Area */}
      <section className="flex-1 flex flex-col overflow-hidden min-w-0 border-r border-gray-200">

        {/* Content Box Header */}
        <div className="p-4 border-b border-gray-200 bg-white shrink-0 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">
                {activeSection === 'opening' && 'परिचय एवं स्वागत (Opening Greeting)'}
                {activeSection === 'about' && 'ट्रकमित्र के फायदे (About & Benefits)'}
                {activeSection === 'subscription' && 'सब्सक्रिप्शन (₹999 / 3 Months)'}
                {activeSection === 'hiring' && 'प्रीमियम हायरिंग सर्विस (Premium Hiring)'}
                {activeSection === 'objections' && 'आपत्तियां और समाधान (Objections)'}
                {activeSection === 'closing' && 'कॉल क्लोजिंग (Closing)'}
              </h2>
              {activeSection === 'subscription' && (
                <span className="bg-red-50 text-[#FB641B] border border-orange-100 text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">
                  Best Value
                </span>
              )}
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Transporter Welcome Call Script · auto-personalised</p>
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
          <div className="max-w-[720px] mx-auto text-gray-800">

            {activeSection === 'opening' && (
              <div className="space-y-5 font-hindi leading-9 text-[20px]">
                <p>
                  "नमस्ते <Name /> सर, मैं ट्रकमित्र कंपनी से बात कर रहा/रही हूँ। सबसे पहले <strong>ट्रकमित्र ऐप</strong> पर register करने के लिए आपका धन्यवाद।"
                </p>
                <p>
                  "सर, अगर आप अनुमति दें तो मैं आपका <strong>1–2 मिनट</strong> का समय लेकर ट्रकमित्र ऐप के कुछ फायदे बताना चाहूँगा/चाहूँगी।"
                </p>
              </div>
            )}

            {activeSection === 'about' && (
              <div className="space-y-5 font-hindi leading-9 text-[20px]">
                <p>
                  "<Name /> सर, <strong>ट्रकमित्र</strong> India का एक ऐसा platform है जो पूरी Trucking Industry के लोगों को एक जगह जोड़ता है। एक Transporter के रूप में आप ट्रकमित्र ऐप के माध्यम से <strong>Verified और Trusted Drivers hire</strong> कर सकते हैं, और अपने पहले से काम कर रहे drivers या workers की <strong>verification</strong> करवा सकते हैं।"
                </p>
                <p>
                  "इसके अलावा आप सिर्फ drivers ही नहीं hire करते, बल्कि पूरी trucking community से जुड़े रहते हैं। अपने transport business को बढ़ाने के लिए कई सुविधाएं मिलती हैं, जैसे:"
                </p>
                <ul className="space-y-1.5 font-sans text-[16px]">
                  {['Load from verified shipper', 'RC Check', 'Challan Check', 'और trucking industry से जुड़ी कई अन्य सुविधाएं'].map((b, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="text-[#FB641B] font-bold mt-0.5">✔</span>
                      <span className="text-gray-700">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeSection === 'subscription' && (
              <div className="space-y-5 font-hindi leading-9 text-[20px]">
                <div className="border-2 border-[#FB641B] rounded-xl p-4 bg-orange-50/30 relative">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-bold text-gray-800">Subscription</span>
                    <span className="text-[#FB641B] font-extrabold text-xl font-sans">₹999 <span className="text-xs font-semibold text-gray-500">/ 3 months</span></span>
                  </div>
                </div>
                <p>
                  "सर, ट्रकमित्र ऐप से जुड़ी इन सभी सुविधाओं का लाभ लेने के लिए एक छोटा सा subscription लेना होता है, जो है <strong>₹999 for 3 months</strong>।"
                </p>
                <p>
                  "इस subscription के साथ आप <strong>3 महीनों तक unlimited driver requirement</strong> के लिए Job Post कर सकते हैं और सीधे drivers से connect कर सकते हैं।"
                </p>
              </div>
            )}

            {activeSection === 'hiring' && (
              <div className="space-y-4 font-hindi leading-8 text-[17px]">
                <p>
                  "अगर आपको driver hire करने के लिए <strong>dedicated support</strong> चाहिए, तो आप Premium या Super Premium Job भी post कर सकते हैं। इन दोनों में आपको एक <strong>Dedicated Account Manager</strong> मिलता है जो आपके behalf पर drivers से बात करता है और best drivers shortlist करता है — जिससे आपका काफी समय बचता है।"
                </p>

                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-bold text-gray-800">Premium Job</span>
                    <span className="text-[#FB641B] font-extrabold text-lg font-sans">₹1999 <span className="text-[11px] font-semibold text-gray-500">/ driver</span></span>
                  </div>
                  <p className="text-gray-700 text-[15px]">हमारी team आपको <strong>10 दिनों के अंदर</strong> driver arrange करवाती है।</p>
                </div>

                <div className="border border-gray-200 rounded-xl p-4 bg-white">
                  <div className="flex items-baseline justify-between mb-1">
                    <span className="font-bold text-gray-800">Super Premium Job</span>
                    <span className="text-[#FB641B] font-extrabold text-lg font-sans">₹2999 <span className="text-[11px] font-semibold text-gray-500">/ driver</span></span>
                  </div>
                  <p className="text-gray-700 text-[15px]">हम आपको <strong>7 दिनों के अंदर</strong> driver arrange करवाते हैं।</p>
                </div>

                <div className="bg-orange-50/50 border border-orange-100 rounded-xl p-3.5">
                  <span className="text-[10px] font-bold text-[#FB641B] uppercase tracking-wider block mb-1 font-sans">Replacement Benefit</span>
                  <p className="text-gray-700 text-[15px]">दोनों plans में <strong>1 महीने तक driver replacement</strong> का benefit मिलता है। अगर किसी कारण driver काम नहीं करता, तो हम replacement driver arrange करने में मदद करते हैं।</p>
                </div>
              </div>
            )}

            {activeSection === 'objections' && (
              <div className="space-y-4 font-sans">
                <div className="bg-orange-50/60 border border-orange-100 rounded-lg px-3 py-2 text-[11px] font-semibold text-[#B4530F] flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-[15px]">bolt</span>
                  Golden Rule: Acknowledge → Build Value → Ask a Question. Never argue.
                </div>

                <div className="relative mb-2">
                  <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type objection keyword (e.g. mehnga, jarurat)..."
                    className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:border-[#FB641B]"
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
                          <div className="p-3.5 bg-[#FFFDFB] border-t border-orange-50/50 font-hindi leading-8 text-[16px] text-gray-700">
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
                  "तो <Name /> सर, अगर आपको drivers hire करने हैं या driver verification करवानी है, तो <strong>ट्रकमित्र ऐप</strong> आपके लिए एक बहुत उपयोगी platform है।"
                </p>
                <p>
                  "ट्रकमित्र ऐप का <strong>₹999 subscription</strong> लेकर आप drivers hire भी कर सकते हैं। ट्रकमित्र में समय देने के लिए धन्यवाद, <Name /> सर।"
                </p>
              </div>
            )}

          </div>
        </div>

      </section>

      {/* Right Column Pinned Reference Box */}
      <section className="w-[300px] bg-gray-50/50 p-4 shrink-0 flex flex-col justify-between overflow-y-auto select-none">
        <div className="space-y-4">
          <div className="bg-orange-50 border border-orange-200 rounded-xl p-4">
            <span className="text-[10px] text-[#FB641B] font-bold uppercase tracking-wider block mb-1">Plan Reference</span>
            <h3 className="font-bold text-gray-800 text-sm">TruckMitr for Transporters</h3>
            <p className="text-[11px] text-gray-500 mt-1">Keep these numbers open to pitch and tackle price objections.</p>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-3">
            <div className="border-b border-gray-100 pb-2">
              <span className="text-[10px] text-[#FB641B] font-bold block uppercase">Subscription</span>
              <p className="font-bold text-lg text-[#FB641B] mt-0.5">₹999 <span className="text-xs text-gray-400 font-semibold">/ 3 months</span></p>
              <p className="text-[10px] text-gray-400 mt-0.5">Unlimited driver job posts &amp; direct connect.</p>
            </div>
            <div className="border-b border-gray-100 pb-2">
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Premium Job</span>
              <p className="font-bold text-lg text-gray-800 mt-0.5">₹1999 <span className="text-xs text-gray-400 font-semibold">/ driver</span></p>
              <p className="text-[10px] text-gray-400 mt-0.5">Dedicated AM · driver in 10 days.</p>
            </div>
            <div>
              <span className="text-[10px] text-gray-500 font-bold block uppercase">Super Premium Job</span>
              <p className="font-bold text-lg text-gray-800 mt-0.5">₹2999 <span className="text-xs text-gray-400 font-semibold">/ driver</span></p>
              <p className="text-[10px] text-gray-400 mt-0.5">Driver in 7 days · 1-month replacement.</p>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-xl p-3.5 space-y-2.5">
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Standard Pitching Advice</div>
            <div className="space-y-2 text-[11px] text-gray-600">
              {[
                'Speak in a professional, consultative tone.',
                'Do not argue with transporters. Validate their concerns first.',
                'Pivot to truck stand-still cost (₹3,000/day) &amp; replacement safety.'
              ].map((t, i) => (
                <div key={i} className="flex items-start gap-1.5">
                  <span className="text-[#FB641B] font-bold">•</span>
                  <span dangerouslySetInnerHTML={{ __html: t }} />
                </div>
              ))}
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
