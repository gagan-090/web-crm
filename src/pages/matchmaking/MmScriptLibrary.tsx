import React, { useState } from 'react';

interface ObjectionCard {
  reason: 'route' | 'truck' | 'pay' | 'placed';
  driverSays: string;
  response: string;
  bookmarked: boolean;
}

export const MmScriptLibrary: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'opening' | 'interest' | 'intro' | 'rejection' | 'closure' | 'reopening'>('reopening');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Rejection/objection scripts database
  const [objections, setObjections] = useState<ObjectionCard[]>([
    {
      reason: 'route',
      driverSays: 'सैलरी बहुत कम है, मुझे कम से कम 25,000 चाहिए।',
      response: 'सर, इस सुपर प्रीमियम ट्रिप के लिए ट्रांसपोर्टर ₹35,000 एडवांस दे रहे हैं और बाकी डिलीवरी के तुरंत बाद। यह मार्केट रेट से ज्यादा है।',
      bookmarked: false
    },
    {
      reason: 'route',
      driverSays: 'यह लोकेशन मेरे घर से बहुत दूर है।',
      response: 'दूर तो है, लेकिन वहां कंपनी क्वार्टर दे रही है और रूट बहुत आसान है। क्या आप एक बार मालिक से बात करना चाहेंगे?',
      bookmarked: false
    },
    {
      reason: 'pay',
      driverSays: 'मुझे एडवांस में आधा पेमेंट चाहिए, वरना गाड़ी स्टार्ट नहीं करूँगा।',
      response: 'सर, शर्मा लॉजिस्टिक्स एक सुपर प्रीमियम वेंडर हैं, इनका भुगतान रिकॉर्ड १००% सुरक्षित है। हम व्हाट्सएप ग्रुप में इसका एग्रीमेंट शेयर कर देंगे।',
      bookmarked: false
    },
    {
      reason: 'truck',
      driverSays: 'मेरे पास ट्रेलर चलाने का लाइसेंस नहीं है, मुझे डम्पर वाली जॉब चाहिए।',
      response: 'कोई बात नहीं सर, हमारे पास पटना और सूरत रूट पर डम्पर की भी २ वैकेंसी ओपन हैं, मैं आपका शॉर्टलिस्ट वहाँ ट्रांसफर कर देता हूँ।',
      bookmarked: false
    },
    {
      reason: 'placed',
      driverSays: 'मैं पहले ही दूसरी जगह काम शुरू कर चुका हूँ।',
      response: 'बहुत अच्छा सर! क्या आपकी पहचान में कोई और ड्राइवर है जो दिल्ली-मुंबई रूट पर भारी गाड़ी चला सकता है? हम उन्हें रेफरल इंसेंटिव देंगे।',
      bookmarked: false
    }
  ]);

  const handleToggleBookmark = (idx: number) => {
    setObjections(prev => prev.map((obj, i) => 
      i === idx ? { ...obj, bookmarked: !obj.bookmarked } : obj
    ));
    triggerToast('Bookmarks list updated ✓');
  };

  const handlePlayAudio = (section: string) => {
    triggerToast(`Playing call audio snippet for section: ${section}...`);
  };

  const filteredObjections = objections.filter(obj => 
    obj.driverSays.toLowerCase().includes(searchQuery.toLowerCase()) ||
    obj.response.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Sorting bookmarked to top
  const sortedObjections = [...filteredObjections].sort((a, b) => 
    a.bookmarked === b.bookmarked ? 0 : a.bookmarked ? -1 : 1
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

      {/* Left Sub nav Sidebar */}
      <aside className="w-56 bg-gray-50 border-r border-gray-200 p-4 flex flex-col justify-between shrink-0 select-none">
        <div className="space-y-4">
          <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide border-b border-gray-200 pb-2">
            Match Dialogue Sections
          </h3>

          <div className="flex flex-col gap-2 font-bold text-gray-450">
            {[
              { id: 'opening', label: 'Opening (Job Pitch)' },
              { id: 'interest', label: 'Interest discovery' },
              { id: 'intro', label: '3-Way Intro explain' },
              { id: 'rejection', label: 'Rejection/Objections' },
              { id: 'closure', label: 'Placement Closure' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveSection(tab.id as any)}
                className={`p-2.5 rounded-lg text-left transition-colors ${
                  activeSection === tab.id ? 'bg-purple-100 text-[#7D3C98]' : 'hover:bg-gray-100 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-purple-50 border border-purple-200 p-3 rounded-xl">
          <span className="text-[10px] font-extrabold text-purple-750 uppercase tracking-wider block">Language Vetting</span>
          <p className="text-[9.5px] text-gray-450 mt-1 leading-normal font-semibold">
            All pitch scripts are vetted for Noto Sans Devanagari Hindi communication standards.
          </p>
        </div>
      </aside>

      {/* Main Scripts Workspace */}
      <section className="flex-1 flex flex-col overflow-hidden bg-white">
        
        {/* Header toolbar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">Vetted Dialogue Script Console</h2>
            <p className="text-[10px] text-gray-400 mt-0.5">Use standard scripts to maintain compliance and improve matching conversion rates</p>
          </div>

          <div className="flex gap-2">
            <span className="bg-white border border-gray-200 px-3 py-1 rounded-lg font-bold text-[10px] text-gray-500">v2.6 Vetted today</span>
          </div>
        </div>

        {/* Content detail space */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5 font-devanagari text-[12px] leading-relaxed text-gray-850">
          
          {activeSection !== 'rejection' ? (
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4 max-w-xl">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Dialogue pitch script</span>
              
              <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-150 text-gray-800 leading-relaxed italic">
                {activeSection === 'opening' && '"नमस्कार! मैं ट्रकमित्र से बात कर रहा हूँ। आपकी प्रोफाइल हमारे पास एक बेहतरीन ड्राइविंग अवसर के लिए मैच हुई है। क्या आपके पास २ मिनट हैं?"'}
                {activeSection === 'interest' && '"सर, यह ट्रिप शर्मा लॉजिस्टिक्स के साथ ३ महीने की अवधि का है। इसमें प्रति ट्रिप एडवांस पेमेंट सुरक्षा एग्रीमेंट के साथ मिलती है।"'}
                {activeSection === 'intro' && '"सहमति होने पर मैं आपका और ट्रांसपोर्टर के मैनेजर का एक व्हाट्सएप ग्रुप बना देता हूँ, जहाँ आप सीधे ट्रिप एग्रीमेंट फाइनल कर सकते हैं।"'}
                {activeSection === 'closure' && '"बधाई हो सुरेश जी! आपकी जॉइनिंग पक्की हो गई है। कल सुबह १० बजे आपको रिपोर्ट करना है। मैं डिटेल्स व्हाट्सएप पर शेयर कर रहा हूँ।"'}
                {activeSection === 'reopening' && '"नमस्कार! सुरेश जी, दिल्ली-मुंबई रूट पर ट्रेलर चलाने का वैकेंसी आज ओपन हुआ है। आपकी पिछली कॉल नोट के हिसाब से मैंने आपके लिए इसे रोक कर रखा है।"'}
              </div>

              <div className="pt-2 border-t border-gray-100 flex justify-between items-center">
                <span className="text-[10px] text-gray-400 font-semibold uppercase">Script communication guideline</span>
                <button 
                  onClick={() => handlePlayAudio(activeSection)}
                  className="bg-white border border-[#8E44AD] text-[#8E44AD] hover:bg-[#8E44AD] hover:text-white px-3 py-1.5 rounded-lg font-bold transition-all shadow-sm flex items-center gap-1"
                >
                  <span className="material-symbols-outlined text-sm">play_arrow</span>
                  <span>Play model call audio</span>
                </button>
              </div>
            </div>
          ) : (
            // Rejection/Objection scripts search list
            <div className="space-y-4 max-w-2xl">
              
              {/* Search objections */}
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="Search Devanagari objections by keyword..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full border border-gray-250 rounded-xl pl-9 pr-4 py-2 outline-none font-semibold text-gray-850"
                />
                <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
              </div>

              {/* Stacked objections cards */}
              <div className="space-y-3">
                {sortedObjections.map((obj, i) => (
                  <div key={i} className="bg-white border border-gray-250 rounded-xl p-4 shadow-sm space-y-3 relative">
                    <button 
                      onClick={() => handleToggleBookmark(i)}
                      className={`absolute top-4 right-4 material-symbols-outlined text-base ${
                        obj.bookmarked ? 'text-yellow-500 font-bold' : 'text-gray-400 hover:text-gray-600'
                      }`}
                      title={obj.bookmarked ? 'Bookmarked' : 'Add bookmark'}
                    >
                      star
                    </button>

                    <div className="flex items-center gap-2">
                      <span className="bg-purple-50 text-purple-700 text-[9.5px] font-extrabold px-2 py-0.5 rounded uppercase">
                        {obj.reason}
                      </span>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <span className="text-[10px] text-gray-450 font-bold uppercase block mb-1">Driver Objection:</span>
                        <p className="italic text-gray-850 font-bold">"{obj.driverSays}"</p>
                      </div>
                      <div className="bg-purple-50/40 p-3 rounded-lg border-l-4 border-l-[#8E44AD]">
                        <span className="text-[10px] text-[#7D3C98] font-bold uppercase block mb-1">Suggested Pivot Response:</span>
                        <p className="text-gray-800">"{obj.response}"</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      </section>

    </main>
  );
};

export default MmScriptLibrary;
