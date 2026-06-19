import React, { useState } from 'react';

interface Template {
  id: string;
  label: string;
  bubbleHeader: string;
  bubbleText: string;
  imageUrl: string;
}

export const DwWhatsappPanel: React.FC = () => {
  // Mock Template Data
  const templates: Template[] = [
    {
      id: 'payment',
      label: 'Payment Link',
      bubbleHeader: 'Secure Payment Link • #INV-4402',
      bubbleText: 'Hi Mark Thompson, here is the payment link for your regional fleet invoice #INV-4402. Please clear this before EOD to avoid shift suspension.',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBmoHhnojDUBzkvNJ7IUYGU0lPjhhpRcaZehrYyQvaoX2C7clJuH9TSIO74tmK6qsIyTe6YxXkQDPgQeeFyknJum2WRROvPjc6JGATZ1HlFjDxITGED-f2h7jG6ZPsLqA4pvSFjNiRsiX5_S0VtGL8vET8LFkAVZQ6AXXHW0IWyaq3mAI1NZRAuJmjQK3tIp5OXCfDzPIK20kdOqsRd3_fsz32OjUqij7wxhVo4K9TCUuOrFCr947l__MO0HpUyKOIS76yIz1_CJps'
    },
    {
      id: 'app_download',
      label: 'App Download',
      bubbleHeader: 'TruckMitr Driver App Onboarding',
      bubbleText: 'Hi Mark Thompson, download the official TruckMitr Driver App to start loading trips today! Tap the link below to install: truckmitr.com/dl',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHrwPbdMexdzFeN-B6jch1IzqJtrtIXIYESkMJWrJj4qIRPTDEqylc7-eZpa0pCcVg0xDPU_J0AA7xROHOC7vWsQ02Q3F-pP2Bz3v_atY9plYyeB7Ux90jc3SKod50_m3dFHnDJ3LYyfSH99vZLg6Hv7AjJ7KwXFgQb5tGVpBMPCOx2YKIOOOlneLUJZaj7Q502NGj4Jn1X-YVOT7gGino1UHnjCKTuUbSdAVyHVv4NndgdX_jR1FA5rhV4B9pOKXS4Meo-quh3Xw'
    },
    {
      id: 'plan_brochure',
      label: 'Plan Brochure',
      bubbleHeader: 'Driver Subscription Plans Brochure',
      bubbleText: 'Hi Mark Thompson, check out our newly optimized regional subscription plans tailored to increase your daily logistics revenues. Download the details: truckmitr.com/plans',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuD7x6iS3a0qx_pPVRaivJa7Z1X63CKZWoWHVZFP2A3EcWyeXamM7ml7eyFvphhneCZio8jvLYrpRJjvlpmhjXO_veDdoKyi4vaIvTJ_FeK_9DQ_PXusxj83Lfmhs4qreKC3H80s38bEjnzvbt65Y4Gt8N2NnRgJYLWkxt8cuiWtuYWPPaTb-h9-CeV-vAbcgLlEbh8FMKQ7tjsB9fkMfbhIFwlvTufNEHpBGS2sI3mcTgN-oOOKM-w4bJ__tROrZK2Ls3zry3iL-MY'
    },
    {
      id: 'callback_confirm',
      label: 'Callback Confirmation',
      bubbleHeader: 'Scheduled Callback Confirmation',
      bubbleText: 'Hi Mark Thompson, we have successfully scheduled a callback for you today at 02:00 PM to review your route activation. Talk to you soon!',
      imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAHrwPbdMexdzFeN-B6jch1IzqJtrtIXIYESkMJWrJj4qIRPTDEqylc7-eZpa0pCcVg0xDPU_J0AA7xROHOC7vWsQ02Q3F-pP2Bz3v_atY9plYyeB7Ux90jc3SKod50_m3dFHnDJ3LYyfSH99vZLg6Hv7AjJ7KwXFgQb5tGVpBMPCOx2YKIOOOlneLUJZaj7Q502NGj4Jn1X-YVOT7gGino1UHnjCKTuUbSdAVyHVv4NndgdX_jR1FA5rhV4B9pOKXS4Meo-quh3Xw'
    }
  ];

  // Component States
  const [selectedTemplateId, setSelectedTemplateId] = useState('payment');
  const [customNote, setCustomNote] = useState('Please clear this before EOD to avoid shift suspension.');
  const [smsFallback, setSmsFallback] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleSend = () => {
    showToast(`WhatsApp message sent to Mark Thompson!\nFallback SMS: ${smsFallback ? 'ENABLED' : 'DISABLED'}`);
  };

  return (
    <main className="h-[calc(100vh-88px)] flex border border-outline-variant bg-white rounded-xl overflow-hidden relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-md left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-lg py-md rounded shadow-lg z-50 text-xs font-semibold flex flex-col gap-1 border border-outline whitespace-pre-line animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center gap-xs font-bold text-accent-success">
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            <span>Broadcast Sent</span>
          </div>
          <p className="text-[11px] font-normal leading-relaxed opacity-90">{toastMessage}</p>
        </div>
      )}

      {/* Main Messaging Area (Left portion) */}
      <section className="flex-1 flex flex-col h-full overflow-hidden bg-background">
        <div className="flex-1 p-lg overflow-y-auto space-y-lg custom-scrollbar">
          
          <div className="flex flex-col gap-xs">
            <h1 className="font-headline-md text-headline-md font-bold text-on-surface">WhatsApp Messaging Center</h1>
            <p className="text-xs text-on-surface-variant leading-relaxed">Dispatch verified service links, onboarding materials, and route details directly to delivery partners.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-lg text-xs">
            {/* Recipient card */}
            <div className="bg-white border border-outline-variant p-lg rounded-xl shadow-sm space-y-md">
              <span className="font-bold text-primary uppercase tracking-wider block">Active Recipient</span>
              
              <div className="flex items-center gap-md">
                <div className="w-14 h-14 rounded-lg overflow-hidden border border-outline-variant/60 shrink-0">
                  <img 
                    className="w-full h-full object-cover" 
                    alt="Mark Thompson Profile" 
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuD7x6iS3a0qx_pPVRaivJa7Z1X63CKZWoWHVZFP2A3EcWyeXamM7ml7eyFvphhneCZio8jvLYrpRJjvlpmhjXO_veDdoKyi4vaIvTJ_FeK_9DQ_PXusxj83Lfmhs4qreKC3H80s38bEjnzvbt65Y4Gt8N2NnRgJYLWkxt8cuiWtuYWPPaTb-h9-CeV-vAbcgLlEbh8FMKQ7tjsB9fkMfbhIFwlvTufNEHpBGS2sI3mcTgN-oOOKM-w4bJ__tROrZK2Ls3zry3iL-MY"
                  />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-on-surface">Mark Thompson</h3>
                  <p className="text-on-surface-variant font-mono-data mt-0.5">+1 (555) 012-3456</p>
                  <p className="text-[11px] text-secondary font-bold uppercase mt-1">Regional Fleet #A-42</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-sm border-t border-outline-variant/30 pt-md">
                <div className="bg-surface-container-low p-sm rounded border border-outline-variant/20">
                  <p className="text-[9px] text-on-surface-variant uppercase font-semibold">SLA Monitor</p>
                  <p className="font-bold text-accent-success text-xs mt-0.5">On-Time (99%)</p>
                </div>
                <div className="bg-surface-container-low p-sm rounded border border-outline-variant/20">
                  <p className="text-[9px] text-on-surface-variant uppercase font-semibold">Active Status</p>
                  <p className="font-bold text-on-surface text-xs mt-0.5">2m ago active</p>
                </div>
              </div>
            </div>

            {/* Performance Stats */}
            <div className="bg-white border border-outline-variant p-lg rounded-xl shadow-sm flex flex-col justify-between">
              <div>
                <span className="font-bold text-primary uppercase tracking-wider block">Messaging Performance</span>
                <p className="text-on-surface-variant text-[11px] mt-1">SLA delivery performance metrics for Team Alpha broadcasts.</p>
              </div>
              <div className="space-y-sm mt-md">
                <div className="flex justify-between items-end text-xs">
                  <span className="font-bold text-lg">94%</span>
                  <span className="text-[10px] text-on-surface-variant">Response Success Rate</span>
                </div>
                <div className="w-full h-2 bg-surface-container-highest rounded-full overflow-hidden">
                  <div className="h-full bg-accent-success w-[94%]"></div>
                </div>
                <p className="text-[10px] text-on-surface-variant italic">Exceeds the threshold limit of 90% set for OPs managers.</p>
              </div>
            </div>
          </div>

          {/* Table history */}
          <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm text-xs">
            <div className="px-lg py-md bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
              <h3 className="font-bold text-on-surface">Recent Message Logs</h3>
              <button 
                onClick={() => showToast('Displaying full outgoing message registers...')}
                className="text-[10px] text-primary font-bold hover:underline uppercase"
              >
                View Full Log
              </button>
            </div>
            
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-container-lowest border-b border-outline-variant text-on-surface-variant font-semibold">
                  <th className="px-lg py-sm font-bold">Type</th>
                  <th className="px-lg py-sm font-bold">Message Preview</th>
                  <th className="px-lg py-sm font-bold">Sent Time</th>
                  <th className="px-lg py-sm font-bold">SLA Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant/30">
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-lg py-md">
                    <span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded font-bold uppercase">SLA Notice</span>
                  </td>
                  <td className="px-lg py-md text-on-surface max-w-xs truncate">Your shipment #TRK-990 is approaching the delivery deadline...</td>
                  <td className="px-lg py-md font-mono-data text-on-surface-variant">10:45 AM</td>
                  <td className="px-lg py-md text-accent-success font-bold">
                    <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[14px]">done_all</span> Read</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-lg py-md">
                    <span className="bg-primary/15 text-primary text-[10px] px-2 py-0.5 rounded font-bold uppercase">Payment Link</span>
                  </td>
                  <td className="px-lg py-md text-on-surface max-w-xs truncate">Hi Mark, please find standard Combo Pack payment registration...</td>
                  <td className="px-lg py-md font-mono-data text-on-surface-variant">09:12 AM</td>
                  <td className="px-lg py-md text-primary font-bold">
                    <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[14px]">done_all</span> Delivered</span>
                  </td>
                </tr>
                <tr className="hover:bg-surface-container-low transition-colors">
                  <td className="px-lg py-md">
                    <span className="bg-surface-container-high text-on-surface-variant text-[10px] px-2 py-0.5 rounded font-bold uppercase">Follow-up</span>
                  </td>
                  <td className="px-lg py-md text-on-surface max-w-xs truncate">Confirming scheduled call for 02:30 PM with OPs lead...</td>
                  <td className="px-lg py-md font-mono-data text-on-surface-variant">Yesterday</td>
                  <td className="px-lg py-md text-on-surface-variant font-bold">
                    <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-[14px]">done</span> Sent</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

        </div>
      </section>

      {/* Right Sender Configuration & Preview (Duplicate sidebar removed) */}
      <section className="w-[420px] border-l border-outline-variant bg-white flex flex-col shrink-0 shadow-lg">
        
        {/* Sidebar Header */}
        <div className="p-lg border-b border-outline-variant flex justify-between items-center bg-surface-container-low shrink-0">
          <div>
            <h2 className="font-headline-sm text-headline-sm font-bold flex items-center gap-xs text-on-surface">
              <span className="material-symbols-outlined text-accent-success" style={{ fontVariationSettings: "'FILL' 1" }}>chat</span>
              WhatsApp Sender
            </h2>
            <p className="text-xs text-on-surface-variant mt-0.5">Template dispatcher console</p>
          </div>
          <button 
            onClick={() => { setCustomNote(''); }} 
            className="p-2 hover:bg-surface-container-high rounded-full transition-colors"
            title="Clear"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Template Quick Selection */}
        <div className="flex bg-surface-container-highest p-1 mx-lg mt-lg rounded-lg overflow-x-auto custom-scrollbar shrink-0 gap-xs">
          {templates.map(t => (
            <button
              key={t.id}
              onClick={() => {
                setSelectedTemplateId(t.id);
                // Pre-fill corresponding default custom note
                if (t.id === 'payment') {
                  setCustomNote('Please clear this before EOD to avoid shift suspension.');
                } else if (t.id === 'app_download') {
                  setCustomNote('Click download immediately.');
                } else if (t.id === 'plan_brochure') {
                  setCustomNote('Review standard benefits plans sheet.');
                } else {
                  setCustomNote('Please keep your phone active at that time.');
                }
              }}
              className={`flex-grow min-w-[100px] py-1.5 px-3 rounded-md text-[11px] font-bold transition-all whitespace-nowrap ${
                selectedTemplateId === t.id
                  ? 'bg-white text-primary shadow-sm font-bold border border-outline-variant/20'
                  : 'text-on-surface-variant hover:text-on-surface hover:bg-white/40'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Messaging Preview Bubble Card */}
        <div className="flex-1 overflow-y-auto p-lg flex flex-col gap-lg text-xs">
          <div className="space-y-sm">
            <label className="font-bold text-on-surface-variant uppercase tracking-wider block">Message Live Preview</label>
            <div className="bg-[#E5DDD5] p-lg rounded-xl relative overflow-hidden" style={{ backgroundImage: "url('https://www.transparenttextures.com/patterns/cubes.png')" }}>
              
              <div className="bg-white p-sm rounded-lg shadow-sm max-w-[85%] float-right relative whatsapp-bubble-tail">
                <div className="bg-surface-container-lowest rounded overflow-hidden mb-sm border border-outline-variant/30">
                  <div className="h-28 bg-gray-100 flex items-center justify-center overflow-hidden">
                    <img 
                      className="w-full h-full object-cover" 
                      alt="Template Preview Banner"
                      src={activeTemplate.imageUrl} 
                    />
                  </div>
                  <div className="p-sm bg-surface-container-low text-[10px]">
                    <p className="font-bold text-on-surface truncate">{activeTemplate.bubbleHeader}</p>
                    <p className="text-on-surface-variant mt-0.5">truckmitr.com/ops/services</p>
                  </div>
                </div>
                
                <p className="text-xs text-on-surface leading-normal">
                  {activeTemplate.bubbleText.replace(
                    /Please clear this before EOD to avoid shift suspension\.|Click download immediately\.|Review standard benefits plans sheet\.|Please keep your phone active at that time\./,
                    customNote || ''
                  )}
                </p>
                
                <div className="flex justify-end gap-xs items-center mt-sm text-[9px] text-on-surface-variant font-mono-data opacity-70">
                  <span>12:30 PM</span>
                  <span className="material-symbols-outlined text-[14px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>done_all</span>
                </div>
              </div>

            </div>
          </div>

          {/* Note Area */}
          <div className="space-y-xs">
            <div className="flex justify-between items-center">
              <label className="font-bold text-on-surface-variant uppercase tracking-wider block" htmlFor="custom-note">Editable Note Suffix</label>
              <span className="text-[10px] text-on-surface-variant font-semibold">Chars: {customNote.length}/120</span>
            </div>
            <textarea 
              className="w-full p-md bg-surface-container-low border border-outline-variant rounded-lg focus:border-accent-success focus:ring-1 focus:ring-accent-success outline-none text-xs resize-none" 
              id="custom-note" 
              placeholder="Append custom details at the end of the template..."
              rows={3}
              maxLength={120}
              value={customNote}
              onChange={(e) => setCustomNote(e.target.value)}
            />
            <p className="text-[10px] text-on-surface-variant italic">Only the suffix notes field is editable for standard templates compliance.</p>
          </div>

          {/* Fallback configuration */}
          <div className="bg-surface-container-low rounded-lg p-md border border-outline-variant/30 space-y-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-sm">
                <span className="material-symbols-outlined text-on-surface-variant text-sm">sms_failed</span>
                <div>
                  <p className="font-bold text-on-surface">SMS Fallback Channel</p>
                  <p className="text-[10px] text-on-surface-variant mt-0.5">Send standard text SMS if WhatsApp fails</p>
                </div>
              </div>
              
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  checked={smsFallback} 
                  onChange={(e) => setSmsFallback(e.target.checked)}
                  className="sr-only peer" 
                  type="checkbox" 
                />
                <div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-accent-success"></div>
              </label>
            </div>
          </div>

        </div>

        {/* Footer Send */}
        <div className="p-lg bg-surface border-t border-outline-variant shrink-0">
          <button 
            onClick={handleSend}
            className="w-full py-3 bg-accent-success hover:bg-[#20ba59] text-white rounded-lg font-bold flex items-center justify-center gap-md transition-colors shadow-md text-xs uppercase"
          >
            <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>send</span>
            Send via WhatsApp
          </button>
          <p className="text-center text-[10px] text-on-surface-variant mt-sm">Messages are logged under driver audit trails for verification checks.</p>
        </div>

      </section>
    </main>
  );
};

export default DwWhatsappPanel;
