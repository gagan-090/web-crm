import React, { useState } from 'react';

interface ObjectionScript {
  id: string;
  topic: string;
  response: string;
  starred?: boolean;
}

export const DwScriptLibrary: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2500);
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Script copied to clipboard!');
  };

  const handlePrint = () => {
    showToast('Opening print dialog for script document...');
  };

  const mainScriptContent = `परिचय (Introduction):
"नमस्ते, मैं [आपका नाम] बोल रहा हूँ ट्रक मित्र लॉजिस्टिक्स से। क्या मेरी बात [डिलीवरी पार्टनर का नाम] से हो रही है?"

कॉल का उद्देश्य (Purpose of Call):
"मैं आपके आज के शिपमेंट स्टेटस के बारे में बात करने के लिए कॉल कर रहा हूँ। हमारे सिस्टम के अनुसार आपके पास अभी 5 पेंडिंग डिलीवरी हैं जो अगले 1 घंटे में पूरी होनी चाहिए।"

सहायता और पुष्टि (Support & Confirmation):
"क्या आपको इन लोकेशन्स को ढूंढने में कोई समस्या आ रही है? या क्या वाहन (vehicle) में कोई तकनीकी दिक्कत है? कृपया मुझे बताएं ताकि हम आपकी सहायता कर सकें और SLA के तहत समय पर डिलीवरी सुनिश्चित कर सकें।"`;

  // Mock Objections
  const objections: ObjectionScript[] = [
    {
      id: 'o1',
      topic: 'लोकेशन बहुत दूर है (Location too far)',
      response: 'मैं आपकी बात समझ सकता हूँ राजेश जी, लेकिन यह रूट पूरी तरह से ऑप्टिमाइज्ड है। आपके पास कम से कम दूरी में 5 डिलीवरीज़ करने का अवसर है। अगले शिपमेंट आवंटन में हम आपके रूट प्राथमिकताओं का और ध्यान रखेंगे।',
      starred: false
    },
    {
      id: 'o2',
      topic: 'गाड़ी में खराबी है (Vehicle breakdown)',
      response: 'अरे, असुविधा के लिए खेद है। कृपया ऐप में अपनी वर्तमान लाइव लोकेशन और ब्रेकडाउन का विवरण भेजें। हम तुरंत आपके लोकेशन के पास स्थित सर्विस वैन या दूसरा रिप्लेसमेंट वाहन भेज रहे हैं।',
      starred: true
    },
    {
      id: 'o3',
      topic: 'पार्किंग नहीं मिल रही (No parking spots)',
      response: 'राजेश जी, आप कस्टमर को कॉल करें, वे अक्सर अपनी सोसाइटी के पास सुरक्षित डिलीवरी स्पॉट्स या गेटकीपर के पास पैकेट्स जमा करने का विकल्प बता देते हैं। इससे आपका समय बचेगा।',
      starred: false
    }
  ];

  const filteredObjections = objections.filter(
    obj =>
      obj.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.response.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="w-full h-full max-w-6xl mx-auto bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm relative p-lg">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-md left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-lg py-sm rounded shadow-lg z-50 text-xs font-semibold flex items-center gap-xs border border-outline animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px] text-accent-success">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Title bar */}
      <div className="flex justify-between items-start border-b border-outline-variant/60 pb-md mb-lg text-xs">
        <div>
          <h1 className="font-bold text-lg text-on-surface">डिलीवरी पार्टनर कॉल स्क्रिप्ट लाइब्रेरी (v4.2)</h1>
          <p className="text-on-surface-variant mt-1 font-medium flex items-center gap-xs">
            <span className="material-symbols-outlined text-sm">schedule</span>
            <span>Last updated: 2 hrs ago by Operations Lead</span>
          </p>
        </div>
        
        <button 
          onClick={() => showToast('Playing standard call audio demo...')}
          className="bg-accent-success hover:bg-[#20ba59] text-white px-md py-2 rounded-lg flex items-center gap-sm transition-all shadow-sm font-bold"
        >
          <span className="material-symbols-outlined text-sm">play_circle</span>
          <span>Listen Call Model</span>
        </button>
      </div>

      {/* Content grid */}
      <div className="grid grid-cols-12 gap-lg text-xs items-start">
        
        {/* Main Dialogue Box */}
        <div className="col-span-8 bg-surface-container-low border border-outline-variant rounded-xl p-lg shadow-sm">
          <div className="flex items-center justify-between border-b border-outline-variant/30 pb-sm mb-md">
            <h2 className="font-bold text-sm text-on-surface flex items-center gap-sm">
              <span className="material-symbols-outlined text-primary text-sm">chat</span>
              मुख्य संवाद स्क्रिप्ट (Main Dialogue Flow)
            </h2>
            <div className="flex gap-sm">
              <button 
                onClick={() => handleCopy(mainScriptContent)}
                className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"
                title="Copy Script"
              >
                <span className="material-symbols-outlined text-sm">content_copy</span>
              </button>
              <button 
                onClick={handlePrint}
                className="p-1.5 hover:bg-surface-container-high rounded transition-colors text-on-surface-variant"
                title="Print Script"
              >
                <span className="material-symbols-outlined text-sm">print</span>
              </button>
            </div>
          </div>

          <div className="space-y-lg text-on-surface">
            <div>
              <p className="font-bold border-l-4 border-primary pl-md bg-white py-sm rounded-r-lg">
                1. परिचय और ग्रीटिंग (Greeting Protocol):
              </p>
              <p className="font-body-hindi text-[16px] leading-relaxed mt-sm font-medium pl-md">
                "नमस्ते, मैं [आपका नाम] बोल रहा हूँ ट्रक मित्र लॉजिस्टिक्स से। क्या मेरी बात [डिलीवरी पार्टनर का नाम] से हो रही है?"
              </p>
            </div>
            
            <div>
              <p className="font-bold border-l-4 border-primary pl-md bg-white py-sm rounded-r-lg">
                2. कॉल का उद्देश्य (Core Purpose statement):
              </p>
              <p className="font-body-hindi text-[16px] leading-relaxed mt-sm font-medium pl-md">
                "मैं आपके आज के शिपमेंट स्टेटस के बारे में बात करने के लिए कॉल कर रहा हूँ। हमारे सिस्टम के अनुसार आपके पास अभी 5 पेंडिंग डिलीवरी हैं जो अगले 1 घंटे में पूरी होनी चाहिए।"
              </p>
            </div>
            
            <div>
              <p className="font-bold border-l-4 border-primary pl-md bg-white py-sm rounded-r-lg">
                3. सहायता और ऑप्स निर्देश (Support offer):
              </p>
              <p className="font-body-hindi text-[16px] leading-relaxed mt-sm font-medium pl-md">
                "क्या आपको इन लोकेशन्स को ढूंढने में कोई समस्या आ रही है? या क्या वाहन (vehicle) में कोई तकनीकी दिक्कत है? कृपया मुझे बताएं ताकि हम आपकी सहायता कर सकें और SLA के तहत समय पर डिलीवरी सुनिश्चित कर सकें।"
              </p>
            </div>
          </div>
        </div>

        {/* Objection reference list */}
        <div className="col-span-4 bg-surface-container-low border border-outline-variant rounded-xl p-md shadow-sm space-y-md">
          <div className="flex justify-between items-center border-b border-outline-variant/30 pb-sm mb-sm font-bold text-on-surface">
            <span>Objection Handling Rules</span>
            <span className="material-symbols-outlined text-sm">lightbulb</span>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
            <input 
              className="w-full bg-white border border-outline-variant rounded-lg pl-8 pr-md py-1.5 focus:ring-1 focus:ring-accent-success outline-none transition-all" 
              placeholder="Search objections..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="space-y-sm overflow-y-auto max-h-[300px] custom-scrollbar pr-xs">
            {filteredObjections.length > 0 ? (
              filteredObjections.map(obj => (
                <div key={obj.id} className="bg-white border border-outline-variant/80 rounded-lg p-sm cursor-pointer hover:border-accent-success transition-all duration-300">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-bold text-on-surface text-[11px]">{obj.topic}</span>
                    <span className={`material-symbols-outlined text-[15px] cursor-pointer hover:scale-115 ${obj.starred ? 'text-primary' : 'text-on-surface-variant'}`} style={{ fontVariationSettings: obj.starred ? "'FILL' 1" : "'FILL' 0" }}>
                      star
                    </span>
                  </div>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed mt-1 font-body-hindi border-t border-outline-variant/20 pt-sm">{obj.response}</p>
                </div>
              ))
            ) : (
              <p className="text-on-surface-variant italic text-center py-md">No objections match search.</p>
            )}
          </div>
        </div>

      </div>

      {/* Footer stats bar */}
      <div className="mt-xl flex items-center justify-between border-t border-outline-variant pt-lg text-xs">
        <div className="flex gap-md">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">94%</span>
            <span className="text-on-surface-variant font-medium">Compliance Rate</span>
          </div>
          <div className="w-px h-10 bg-outline-variant/60 mx-md"></div>
          <div className="flex flex-col">
            <span className="text-lg font-bold text-primary">12</span>
            <span className="text-on-surface-variant font-medium">Active Learners</span>
          </div>
        </div>
        
        <div className="flex gap-sm">
          <button 
            onClick={() => showToast('Downloading PDF version...')}
            className="px-md py-2 border border-outline-variant rounded-lg font-bold hover:bg-surface-container transition-colors"
          >
            Download PDF
          </button>
          <button 
            onClick={() => showToast('Team Training session requested successfully!')}
            className="px-md py-2 bg-primary text-on-primary rounded-lg font-bold hover:brightness-95 transition-all shadow-sm"
          >
            Request Team Training
          </button>
        </div>
      </div>

    </main>
  );
};

export default DwScriptLibrary;
