import React, { useState, useEffect } from 'react';

interface ScriptSection {
  id: string;
  title: string;
  hindiText: string;
  tip?: string;
  type?: string;
}

export const WctActiveCallFocus: React.FC = () => {
  // Call States
  const [callStatus, setCallStatus] = useState<'connected' | 'ended'>('connected');
  // const [isMuted, setIsMuted] = useState(false);
  // const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [secondsElapsed, setSecondsElapsed] = useState(192); // Start at 03:12
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Timer effect
  useEffect(() => {
    let timer: any;
    if (callStatus === 'connected') {
      timer = setInterval(() => {
        setSecondsElapsed(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [callStatus]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const rem = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${rem.toString().padStart(2, '0')}`;
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSendPaymentLink = () => {
    showToast('Secure payment link for Super Premium (₹2,999) sent to Rajesh Logistics!');
  };

  const handleCopyScript = (text: string) => {
    navigator.clipboard.writeText(text);
    showToast('Script dialogue copied to clipboard!');
  };

  // Mock script sections
  const scripts: ScriptSection[] = [
    {
      id: 's1',
      title: '1. Opening (प्रारंभ)',
      hindiText: 'नमस्ते राजेश जी, मैं TruckMitr से बात कर रहा हूँ। कैसे हैं आप? मैंने देखा कि आप पिछले कुछ हफ़्तों से काफी सक्रिय हैं। आपकी अगली ट्रिप कब की प्लान है?',
      type: 'Essential'
    },
    {
      id: 's2',
      title: '2. Free Plan Pitch',
      hindiText: 'अभी आप फ्री प्लान इस्तेमाल कर रहे हैं जहाँ आपको सीमित लोड मिलते हैं। क्या आप जानना चाहेंगे कि कैसे आप इसे बढ़ा सकते हैं?',
      type: 'Reference'
    },
    {
      id: 's3',
      title: '3. Super Premium Pitch',
      hindiText: 'सर, आपके पास 8 ट्रक्स हैं। सुपर प्रीमियम प्लान में आपको केवल 48 घंटों के अंदर गारंटीड लोड मिलता है। इसके साथ ही आपको \'गोल्ड स्टैंडर्ड\' वेरिफ़ाइड ड्राइवर्स भी मिलते हैं जिससे आपका रिस्क 90% तक कम हो जाता है।',
      tip: 'Emphasize the 48-hour placement SLA for fleet owners.'
    },
    {
      id: 's4',
      title: '4. Price Objection (कीमत बहुत ज़्यादा है)',
      hindiText: 'सर, एक दिन गाड़ी खड़ी रहने का नुकसान ₹3,000 से ज़्यादा होता है। यह प्लान उसकी तुलना में बहुत सस्ता है और आपको नियमित ट्रिप्स की गारंटी देता है।'
    },
    {
      id: 's5',
      title: '5. Delay Objection (बाद में सोच कर बताऊंगा)',
      hindiText: 'सर, अभी सुपर प्रीमियम पर 10% डिस्काउंट चल रहा है जो सिर्फ आज शाम तक वैध है। आज ही शुरू करेंगे तो आपकी पहली लोडिंग कल सुबह ही करवा दी जाएगी।'
    },
    {
      id: 's6',
      title: '6. Closing (समापन)',
      hindiText: 'क्या मैं आपको पेमेंट लिंक भेज दूँ? आप UPI या कार्ड से भुगतान कर सकते हैं और आपकी प्रीमियम सेवाएं अभी सक्रिय हो जाएंगी।'
    }
  ];

  const filteredScripts = scripts.filter(
    s =>
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.hindiText.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="h-[calc(100vh-88px)] flex bg-white border border-outline-variant rounded-xl overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-md left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-lg py-sm rounded shadow-lg z-50 text-xs font-semibold flex items-center gap-xs border border-outline animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px] text-accent-success">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Left Active Call Viewport Area */}
      <section className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        
        {/* Active Call Status Bar */}
        <div className="bg-primary-container px-lg py-3 flex items-center justify-between text-on-primary-container shrink-0 text-xs shadow-sm">
          <div className="flex items-center gap-sm font-semibold">
            <span className="material-symbols-outlined text-sm animate-pulse">timer</span>
            <span>SLA expires in 1h 14min</span>
          </div>
          <div className="flex items-center gap-md">
            <div className="bg-on-primary-container text-white px-md py-1 rounded-lg font-mono-data font-bold">
              {formatTime(secondsElapsed)}
            </div>
            
            {callStatus === 'connected' ? (
              <button 
                onClick={() => { setCallStatus('ended'); showToast('Call disconnected successfully'); }}
                className="bg-error text-on-error px-md py-1.5 rounded-lg font-bold hover:brightness-95 active:scale-95 transition-all uppercase"
              >
                End Call
              </button>
            ) : (
              <button 
                onClick={() => { setCallStatus('connected'); setSecondsElapsed(0); showToast('Connecting to Rajesh Logistics...'); }}
                className="bg-accent-success text-white px-md py-1.5 rounded-lg font-bold hover:brightness-95 active:scale-95 transition-all uppercase"
              >
                Redial Call
              </button>
            )}
          </div>
        </div>

        {/* Lead profile details */}
        <div className="p-lg flex-1 overflow-y-auto custom-scrollbar space-y-lg text-xs">
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-headline-md font-bold text-on-surface">Rajesh Logistics PVT Ltd</h1>
              <p className="text-on-surface-variant flex items-center gap-xs mt-1">
                <span className="material-symbols-outlined text-sm">location_on</span>
                <span>Gurugram, Haryana | 8 Trucks | Fleet Owner</span>
              </p>
            </div>
            <div className="bg-secondary-container text-on-secondary-container px-md py-2 rounded-lg border border-outline-variant flex items-center gap-xs font-semibold">
              <span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>recommend</span>
              <span>For 8 trucks → Super Premium recommended</span>
            </div>
          </div>

          {/* Table Pricing Comparison */}
          <div className="border border-outline-variant rounded-xl overflow-hidden bg-white shadow-sm">
            <div className="bg-surface-container px-lg py-2.5 border-b border-outline-variant flex justify-between items-center font-bold text-on-surface">
              <span>Plan Comparison Matrix</span>
              <span className="text-[10px] text-on-surface-variant uppercase">Permanent Reference Card</span>
            </div>
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-surface-container-low border-b border-outline-variant text-on-surface-variant font-semibold">
                  <th className="p-md">FEATURES</th>
                  <th className="p-md">FREE PLAN</th>
                  <th className="p-md text-brand-accent">PREMIUM (₹1,999)</th>
                  <th className="p-md text-primary bg-primary-container/10">SUPER PREMIUM (₹2,999)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/60 font-medium">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-md text-on-surface-variant">Top load placement</td>
                  <td className="p-md text-error"><span className="material-symbols-outlined text-[16px]">close</span></td>
                  <td className="p-md text-brand-accent"><span className="material-symbols-outlined text-[16px]" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span></td>
                  <td className="p-md text-primary bg-primary-container/5 font-bold flex items-center gap-xs">
                    <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span> 
                    <span>Priority Queue</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-md text-on-surface-variant">Placement SLA guarantee</td>
                  <td className="p-md">None</td>
                  <td className="p-md">7-10 days</td>
                  <td className="p-md bg-primary-container/5 text-primary font-bold">48 Hours Placement</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-md text-on-surface-variant">Verified drivers database</td>
                  <td className="p-md">Limited (2)</td>
                  <td className="p-md">Standard (10)</td>
                  <td className="p-md bg-primary-container/5 text-primary font-bold">Unlimited Access</td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="p-md text-on-surface-variant">Background checks</td>
                  <td className="p-md text-error"><span className="material-symbols-outlined text-[16px]">close</span></td>
                  <td className="p-md">Basic checks</td>
                  <td className="p-md bg-primary-container/5 text-primary font-bold">Gold Standard checks</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Action buttons */}
          <div className="flex gap-md pt-sm">
            <button 
              onClick={handleSendPaymentLink}
              className="flex-1 bg-[#fd661d] hover:bg-[#e74c3c] text-white h-12 rounded-lg font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-sm uppercase"
            >
              <span className="material-symbols-outlined">payment</span>
              <span>Send payment link</span>
            </button>
            <button 
              onClick={() => showToast('Callback scheduler opened for Rajesh Logistics')}
              className="flex-1 border-2 border-[#fd661d] text-[#fd661d] hover:bg-[#fd661d]/5 h-12 rounded-lg font-bold transition-all uppercase"
            >
              <span>Schedule Callback</span>
            </button>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-3 gap-md">
            <div className="p-md border border-outline-variant rounded-lg bg-white shadow-sm">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase block mb-1">Previous Load</span>
              <span className="font-bold text-sm">24t Steel Plates</span>
              <p className="text-[10px] text-on-surface-variant mt-2 font-semibold">Delivered on 14 Oct</p>
            </div>
            <div className="p-md border border-outline-variant rounded-lg bg-white shadow-sm">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase block mb-1">Driver Rating</span>
              <div className="flex items-center gap-xs font-bold text-sm">
                <span>4.8</span>
                <span className="material-symbols-outlined text-primary text-[15px]" style={{ fontVariationSettings: "'FILL' 1" }}>star</span>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-2 font-semibold">Top 5% Transporter</p>
            </div>
            <div className="p-md border border-outline-variant rounded-lg bg-white shadow-sm">
              <span className="text-[10px] text-on-surface-variant font-bold uppercase block mb-1">Lead Health</span>
              <div className="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
                <div className="bg-primary h-full rounded-full" style={{ width: '85%' }}></div>
              </div>
              <p className="text-[10px] text-on-surface-variant mt-2 font-semibold">High Conversion Intent</p>
            </div>
          </div>

        </div>

      </section>

      {/* Right Script Assist Sidebar Panel */}
      <section className="w-[380px] bg-white border-l border-outline-variant flex flex-col shrink-0 h-full overflow-hidden shadow-lg">
        
        {/* Search header */}
        <div className="p-md border-b border-outline-variant bg-surface-container-low shrink-0">
          <div className="relative text-xs">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[16px]">search</span>
            <input 
              className="w-full pl-9 pr-4 py-2 border border-outline-variant rounded-lg bg-white focus:ring-1 focus:ring-primary outline-none text-xs" 
              placeholder="Search script keywords..." 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Script scrolls */}
        <div className="flex-grow overflow-y-auto p-md space-y-md custom-scrollbar">
          {filteredScripts.length > 0 ? (
            filteredScripts.map(item => (
              <div key={item.id} className="bg-white p-md rounded-xl border border-outline-variant shadow-sm space-y-sm hover:border-primary transition-all duration-300">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-on-surface text-xs">{item.title}</h3>
                  {item.type && (
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full uppercase font-bold tracking-wider ${item.type === 'Essential' ? 'bg-error-container text-on-error-container' : 'bg-surface-container text-on-surface-variant'}`}>
                      {item.type}
                    </span>
                  )}
                </div>
                
                <p className="text-on-surface leading-relaxed text-xs font-medium font-body-hindi p-sm bg-surface-container-low/40 rounded border border-outline-variant/20">
                  {item.hindiText}
                </p>

                {item.tip && (
                  <div className="p-xs bg-primary/5 rounded border border-primary/15 text-[10px] text-primary font-semibold">
                    <strong>Tip:</strong> {item.tip}
                  </div>
                )}

                <button 
                  onClick={() => handleCopyScript(item.hindiText)}
                  className="text-[10px] text-primary font-bold flex items-center gap-1 hover:underline uppercase pt-xs"
                >
                  <span className="material-symbols-outlined text-[13px]">content_copy</span> 
                  <span>Copy Script</span>
                </button>
              </div>
            ))
          ) : (
            <p className="text-on-surface-variant italic text-center py-md text-xs">No matching dialogue scripts found.</p>
          )}
        </div>

        {/* Language selector footer */}
        <div className="p-md bg-surface-container-low border-t border-outline-variant flex items-center justify-between shrink-0 text-xs font-semibold text-on-surface-variant">
          <button className="flex items-center gap-1 hover:text-on-surface">
            <span className="material-symbols-outlined text-sm">translate</span>
            <span>Hindi Devanagari</span>
          </button>
          <div className="flex gap-sm">
            <button onClick={() => showToast('Script bookmarked!')} className="p-2 rounded-lg bg-white border border-outline-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm">bookmark</span>
            </button>
            <button onClick={() => showToast('Script shared with team!')} className="p-2 rounded-lg bg-white border border-outline-variant hover:bg-surface-container transition-colors">
              <span className="material-symbols-outlined text-sm">share</span>
            </button>
          </div>
        </div>

      </section>

    </main>
  );
};

export default WctActiveCallFocus;
