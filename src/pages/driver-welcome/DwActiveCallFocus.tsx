import React, { useState } from 'react';

interface ObjectionItem {
  id: string;
  title: string;
  hindiTitle: string;
  response: string;
}

export const DwActiveCallFocus: React.FC = () => {
  // Call States
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeakerOn, setIsSpeakerOn] = useState(false);
  const [callStatus, setCallStatus] = useState<'connected' | 'ended'>('connected');
  const [liveNote, setLiveNote] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Tab State
  const [activeTab, setActiveTab] = useState<'opening' | 'jobReady' | 'verified' | 'trusted' | 'objections' | 'closing'>('opening');
  
  // Objection Search State
  const [searchQuery, setSearchQuery] = useState('');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleSendPaymentLink = () => {
    showToast('Payment link generated and sent to Rajesh Kumar via SMS & WhatsApp!');
  };

  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    showToast(isMuted ? 'Microphone unmuted' : 'Microphone muted');
  };

  const handleToggleSpeaker = () => {
    setIsSpeakerOn(!isSpeakerOn);
    showToast(isSpeakerOn ? 'Speaker disabled' : 'Speaker enabled');
  };

  // Mock Objections Data
  const objections: ObjectionItem[] = [
    {
      id: 'price',
      title: 'Price is too high',
      hindiTitle: 'कीमत बहुत ज़्यादा है / निवेश अधिक है',
      response: 'राजेश जी, यह एक निवेश (Investment) है जो आपके बिज़नेस को तेज़ी से बढ़ाएगा। महीने के सिर्फ ₹299 में आपको 5X ज़्यादा लीड्स मिलेंगी। पहले महीने में ही आपको इसका 10 गुना फायदा मिल जाएगा।'
    },
    {
      id: 'docs',
      title: 'Documents not ready',
      hindiTitle: 'दस्तावेज़ पेंडिंग हैं / डाक्यूमेंट्स नहीं हैं',
      response: 'कोई बात नहीं राजेश जी, आप सिर्फ आधार कार्ड और ड्राइविंग लाइसेंस से शुरुआत कर सकते हैं। बाकी के डाक्यूमेंट्स आप 15 दिनों के अंदर ऐप में अपलोड कर सकते हैं।'
    },
    {
      id: 'route',
      title: 'No routes in my area',
      hindiTitle: 'मेरे क्षेत्र में गाड़ियां/रूट्स उपलब्ध नहीं हैं',
      response: 'हम हर हफ्ते नए रूट्स जोड़ रहे हैं। Bhiwandi और ठाणे क्षेत्र में हमारे पास अभी 15+ एक्टिव क्लाइंट्स हैं। रजिस्ट्रेशन के बाद आपको तुरंत इन रूट्स की जानकारी दिखने लगेगी।'
    },
    {
      id: 'trust',
      title: 'Is this company trusted?',
      hindiTitle: 'क्या यह कंपनी सुरक्षित और विश्वसनीय है?',
      response: 'ट्रक मित्र एक सरकारी मान्यता प्राप्त और 50,000+ ड्राइवर्स द्वारा उपयोग किया जाने वाला प्लेटफॉर्म है। हम 100% सुरक्षित भुगतान और समय पर लोड की गारंटी देते हैं।'
    }
  ];

  // Filter objections based on search query
  const filteredObjections = objections.filter(
    obj =>
      obj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.hindiTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      obj.response.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <main className="h-[calc(100vh-88px)] flex overflow-hidden border border-outline-variant bg-white rounded-xl relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-md left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-lg py-sm rounded shadow-lg z-50 text-xs font-semibold flex items-center gap-xs border border-outline animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px] text-accent-success">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Left Details & Dialer Controller Panel */}
      <section className="w-[380px] bg-surface-container-lowest border-r border-outline-variant flex flex-col p-lg gap-lg overflow-y-auto custom-scrollbar">
        
        {/* Interaction Info */}
        <div className="space-y-sm">
          <h3 className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Current Interaction</h3>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="font-headline-md text-headline-md text-on-surface">Rajesh Kumar</h1>
              <p className="font-body-md text-body-md text-on-surface-variant">+91 98765 43210</p>
            </div>
            <span className="bg-secondary-container text-on-secondary-container px-sm py-1 rounded-sm font-label-md text-label-md">Tier 2 Lead</span>
          </div>
          
          <div className="grid grid-cols-2 gap-sm mt-md">
            <div className="p-sm bg-surface-container rounded border border-outline-variant">
              <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Location</p>
              <p className="font-mono-data text-on-surface text-xs mt-1">Bhiwandi, MH</p>
            </div>
            <div className="p-sm bg-surface-container rounded border border-outline-variant">
              <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Vehicle Type</p>
              <p className="font-mono-data text-on-surface text-xs mt-1">E-Rickshaw</p>
            </div>
          </div>
        </div>

        {/* Plan Reference Card */}
        <div className="bg-surface-container-low border border-primary-container/30 rounded-lg p-md">
          <h4 className="font-label-md text-label-md text-primary mb-sm flex items-center gap-xs font-bold uppercase">
            <span className="material-symbols-outlined text-[16px]">info</span>
            PLAN PRICE REFERENCE
          </h4>
          <div className="space-y-xs text-xs">
            <div className="flex justify-between items-center py-xs border-b border-outline-variant/30">
              <span className="font-body-md">Job Ready Plan</span>
              <span className="font-mono-data font-bold text-primary">₹199</span>
            </div>
            <div className="flex justify-between items-center py-xs border-b border-outline-variant/30">
              <span className="font-body-md">Verified Plan</span>
              <span className="font-mono-data font-bold text-primary">₹299</span>
            </div>
            <div className="flex justify-between items-center py-xs">
              <span className="font-body-md">Trusted Plan</span>
              <span className="font-mono-data font-bold text-primary">₹499</span>
            </div>
          </div>
        </div>

        {/* Live Notes Area */}
        <div className="space-y-sm">
          <h4 className="font-label-md text-label-md text-on-surface-variant uppercase font-semibold">Live Call Note</h4>
          <textarea 
            className="w-full bg-white border border-outline-variant rounded-lg p-md focus:ring-1 focus:ring-primary outline-none transition-all text-xs resize-none" 
            placeholder="Type temporary notes here..." 
            rows={3}
            value={liveNote}
            onChange={(e) => setLiveNote(e.target.value)}
          />
        </div>

        {/* Quick Actions & Disposition Grid */}
        <div className="space-y-sm">
          <h4 className="font-label-md text-label-md text-on-surface-variant uppercase font-semibold">Quick Status Select</h4>
          <div className="grid grid-cols-2 gap-xs">
            <button className="flex items-center justify-center gap-xs border border-outline-variant px-sm py-2 rounded text-xs hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[16px] text-accent-success" style={{ fontVariationSettings: "'FILL' 1" }}>check_circle</span>
              <span>Connected</span>
            </button>
            <button className="flex items-center justify-center gap-xs border border-outline-variant px-sm py-2 rounded text-xs hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">phone_disabled</span>
              <span>No Response</span>
            </button>
            <button className="flex items-center justify-center gap-xs border border-outline-variant px-sm py-2 rounded text-xs hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">timer</span>
              <span>Line Busy</span>
            </button>
            <button className="flex items-center justify-center gap-xs border border-outline-variant px-sm py-2 rounded text-xs hover:bg-surface-container-low transition-colors">
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant">power_off</span>
              <span>Switched Off</span>
            </button>
          </div>
        </div>

        {/* Audio controls */}
        <div className="flex gap-sm">
          <button 
            onClick={handleToggleMute}
            className={`flex-1 flex flex-col items-center justify-center gap-xs border py-sm rounded-lg transition-colors ${isMuted ? 'bg-error-container border-error text-on-error-container' : 'border-outline-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined text-sm">{isMuted ? 'mic_off' : 'mic'}</span>
            <span className="text-[10px] uppercase font-bold">{isMuted ? 'Unmute' : 'Mute'}</span>
          </button>
          <button 
            onClick={handleToggleSpeaker}
            className={`flex-1 flex flex-col items-center justify-center gap-xs border py-sm rounded-lg transition-colors ${isSpeakerOn ? 'bg-primary-container border-primary text-on-primary-container font-bold' : 'border-outline-variant hover:bg-surface-container-high'}`}
          >
            <span className="material-symbols-outlined text-sm">volume_up</span>
            <span className="text-[10px] uppercase font-bold">Speaker</span>
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-auto space-y-sm pt-lg">
          <button 
            onClick={handleSendPaymentLink}
            className="w-full bg-primary-container text-on-primary-container font-bold py-3 rounded-lg flex items-center justify-center gap-sm active:opacity-80 transition-opacity text-xs uppercase"
          >
            <span className="material-symbols-outlined text-sm">link</span> SEND PAYMENT LINK
          </button>
          
          {callStatus === 'connected' ? (
            <button 
              onClick={() => { setCallStatus('ended'); showToast('Call disconnected successfully'); }}
              className="w-full bg-error text-on-error font-bold py-3.5 rounded-lg flex items-center justify-center gap-sm hover:brightness-90 transition-all shadow-md text-xs uppercase"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>call_end</span> END CALL
            </button>
          ) : (
            <button 
              onClick={() => { setCallStatus('connected'); showToast('Connecting to Rajesh Kumar...'); }}
              className="w-full bg-accent-success text-white font-bold py-3.5 rounded-lg flex items-center justify-center gap-sm hover:brightness-90 transition-all shadow-md text-xs uppercase"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>call</span> REDIAL CALL
            </button>
          )}
        </div>
      </section>

      {/* Right Script Assistant Panel */}
      <section className="flex-1 flex flex-col overflow-hidden bg-white">
        
        {/* Script Title Bar */}
        <div className="p-md bg-surface-container-low border-b border-outline-variant flex items-center gap-md shrink-0">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">search</span>
            <input 
              className="w-full pl-10 pr-md py-1.5 bg-white border border-outline-variant rounded-full text-xs focus:border-accent-success outline-none transition-all" 
              placeholder="Search scripts / objection topics (e.g. Price, Documents...)" 
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'objections') setActiveTab('objections');
              }}
            />
          </div>
          <div className="flex items-center gap-xs text-accent-success font-bold text-xs">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            <span>SCRIPT ASSIST ACTIVE</span>
          </div>
        </div>

        {/* Script Tab Bar */}
        <div className="flex bg-surface px-md border-b border-outline-variant shrink-0">
          {[
            { key: 'opening', label: '1. Greeting' },
            { key: 'jobReady', label: '2. Job Ready Plan' },
            { key: 'verified', label: '3. Verified Plan' },
            { key: 'trusted', label: '4. Trusted Plan' },
            { key: 'objections', label: '5. Objections Handlers' },
            { key: 'closing', label: '6. Closing Script' }
          ].map((tab) => {
            const isTabActive = activeTab === tab.key;
            const isObjection = tab.key === 'objections';
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`px-md py-3 text-xs font-semibold border-b-2 transition-all ${
                  isTabActive
                    ? isObjection
                      ? 'border-accent-success text-accent-success bg-accent-success/5 font-bold'
                      : 'border-primary text-primary font-bold'
                    : 'border-transparent text-on-surface-variant hover:text-on-surface'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Script Dialogue Content */}
        <div className="flex-1 overflow-y-auto p-xl custom-scrollbar">
          <div className="max-w-3xl mx-auto space-y-lg">
            
            {activeTab === 'opening' && (
              <div className="space-y-md animate-in fade-in duration-300">
                <div className="flex items-center gap-sm">
                  <span className="bg-primary text-white text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-bold">1</span>
                  <h2 className="font-headline-sm text-headline-sm">परिचय और ग्रीटिंग (Greeting & Onboarding Introduction)</h2>
                </div>
                <div className="bg-surface-container-low p-lg border-l-4 border-primary rounded-r-lg">
                  <p className="font-body-hindi text-[18px] leading-relaxed text-on-surface font-medium">
                    "नमस्ते राजेश जी, मैं ट्रक मित्र से बात कर रहा हूँ। आपका नया वाहन रजिस्टर हुआ है, उसकी बहुत-बहुत बधाई! <br/><br/>
                    क्या यह सही समय है आपसे बात करने का? मैं आपकी प्रोफाइल कम्प्लीट करवाने और लोड दिलाने के बारे में जानकारी देने के लिए कॉल कर रहा हूँ।"
                  </p>
                </div>
                <div className="bg-surface-container p-md rounded-lg border border-outline-variant/60">
                  <p className="text-xs text-on-surface-variant font-semibold uppercase mb-1">PRO-TIP FOR OPs AGENTS</p>
                  <p className="text-xs text-on-surface-variant">हमेशा अपना नाम और कंपनी का नाम विनम्रता से लें। डिलीवरी पार्टनर को विश्वास दिलाएं कि यह कॉल उनके फायदे के लिए है।</p>
                </div>
              </div>
            )}

            {activeTab === 'jobReady' && (
              <div className="space-y-md animate-in fade-in duration-300">
                <div className="flex items-center gap-sm">
                  <span className="bg-primary text-white text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-bold">2</span>
                  <h2 className="font-headline-sm text-headline-sm">जॉब रेडी प्लान (Job Ready Subscription benefits)</h2>
                </div>
                <div className="bg-surface-container-low p-lg border-l-4 border-primary rounded-r-lg">
                  <p className="font-body-hindi text-[18px] leading-relaxed text-on-surface font-medium">
                    "राजेश जी, हमारा <strong>'जॉब रेडी'</strong> प्लान सिर्फ <strong>₹199/महीने</strong> का है। <br/><br/>
                    इसमें आपको तुरंत एक्टिव ऑर्डर्स दिखने लगेंगे और आप सीधे लोड बुक कर पाएंगे। नए ड्राइवर्स के लिए यह सबसे बेहतरीन प्लान है।"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-sm">
                  <div className="p-md border border-outline-variant rounded-lg bg-surface">
                    <p className="text-xs font-bold text-primary mb-1">कम दाम</p>
                    <p className="text-xs text-on-surface-variant">सिर्फ ₹199 में एक महीने का ट्रायल और लोड बुकिंग चालू।</p>
                  </div>
                  <div className="p-md border border-outline-variant rounded-lg bg-surface">
                    <p className="text-xs font-bold text-primary mb-1">फास्ट एक्टिवेशन</p>
                    <p className="text-xs text-on-surface-variant">भुगतान के 5 मिनट के भीतर प्रोफाइल एक्टिवेट हो जाती है।</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'verified' && (
              <div className="space-y-md animate-in fade-in duration-300">
                <div className="flex items-center gap-sm">
                  <span className="bg-primary text-white text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-bold">3</span>
                  <h2 className="font-headline-sm text-headline-sm">वेरिफाइड प्लान के फायदे (Verified Plan Benefits - Recommended)</h2>
                </div>
                <div className="bg-surface-container-low p-lg border-l-4 border-primary rounded-r-lg">
                  <p className="font-body-hindi text-[18px] leading-relaxed text-on-surface font-medium">
                    "राजेश जी, हमारा सबसे लोकप्रिय प्लान <strong>'Verified Plan'</strong> है जो सिर्फ <strong>₹299/महीने</strong> का है। <br/><br/>
                    इसमें आपकी प्रोफाइल पर <strong>'Verified Badge'</strong> लग जाता है जिससे ट्रांसपोर्टर्स और क्लाइंट्स आप पर ज़्यादा भरोसा करेंगे और आपको 3X ज़्यादा लोड मिलेंगे।"
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-sm">
                  <div className="p-md border border-outline-variant rounded-lg bg-surface hover:border-primary transition-colors cursor-pointer">
                    <p className="text-xs font-bold text-accent-success mb-1">Verified Badge</p>
                    <p className="text-xs text-on-surface-variant">प्रोफाइल पर हरा टिक मार्क मिलता है जो विश्वसनीयता बढ़ाता है।</p>
                  </div>
                  <div className="p-md border border-outline-variant rounded-lg bg-surface hover:border-primary transition-colors cursor-pointer">
                    <p className="text-xs font-bold text-accent-success mb-1">3X ज़्यादा लोड</p>
                    <p className="text-xs text-on-surface-variant">सिस्टम आपकी प्रोफाइल को प्रीमियम क्लाइंट्स के पास पहले भेजता है।</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'trusted' && (
              <div className="space-y-md animate-in fade-in duration-300">
                <div className="flex items-center gap-sm">
                  <span className="bg-primary text-white text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-bold">4</span>
                  <h2 className="font-headline-sm text-headline-sm">ट्रस्टेड प्लान के फायदे (Trusted Premium Plan Benefits)</h2>
                </div>
                <div className="bg-surface-container-low p-lg border-l-4 border-primary rounded-r-lg">
                  <p className="font-body-hindi text-[18px] leading-relaxed text-on-surface font-medium">
                    "राजेश जी, हमारा प्रीमियम प्लान <strong>'Trusted Plan'</strong> है जो <strong>₹499/महीने</strong> का है। <br/><br/>
                    इसमें आपको <strong>100% पेमेंट प्रोटेक्शन (Payment Protection)</strong> की गारंटी मिलती है। आपके किए गए ट्रिप का भुगतान सुरक्षित रहेगा और किसी भी विवाद में हमारी सपोर्ट टीम 24 घंटे आपके साथ रहेगी।"
                  </p>
                </div>
                <div className="p-md bg-primary/5 border border-primary/20 rounded-lg">
                  <p className="text-xs font-bold text-primary mb-1">पेमेंट प्रोटेक्शन गारंटी</p>
                  <p className="text-xs text-on-surface-variant">यदि क्लाइंट भुगतान में देरी करता है, तो ट्रक मित्र सुरक्षा कोष से आपका पेमेंट किया जाता है।</p>
                </div>
              </div>
            )}

            {activeTab === 'objections' && (
              <div className="space-y-md animate-in fade-in duration-300">
                <div className="flex justify-between items-center">
                  <h2 className="font-headline-sm text-headline-sm flex items-center gap-sm">
                    <span className="bg-accent-success text-white text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-bold">5</span>
                    <span>आपत्तियां और उनके समाधान (Objection Handling)</span>
                  </h2>
                  <span className="text-xs text-on-surface-variant">Found {filteredObjections.length} results</span>
                </div>
                
                <div className="space-y-md">
                  {filteredObjections.length > 0 ? (
                    filteredObjections.map((obj) => (
                      <div key={obj.id} className="p-lg bg-surface-container-low border border-outline-variant rounded-xl space-y-sm hover:border-accent-success transition-all duration-300">
                        <div className="flex items-center justify-between">
                          <h4 className="font-label-md text-red-700 font-bold uppercase text-xs flex items-center gap-xs">
                            <span className="material-symbols-outlined text-[16px]">bolt</span>
                            {obj.title}
                          </h4>
                          <span className="text-xs text-on-surface-variant italic font-semibold">{obj.hindiTitle}</span>
                        </div>
                        <p className="font-body-hindi text-[17px] text-on-surface leading-relaxed mt-2 bg-white p-md rounded border border-outline-variant/30">
                          {obj.response}
                        </p>
                        <div className="flex gap-sm pt-sm">
                          <button 
                            onClick={() => showToast('Simulating ROI Calculation Sheet...')}
                            className="bg-white border border-outline-variant text-on-surface-variant text-[11px] px-md py-1.5 rounded font-bold hover:bg-surface-container-low transition-colors"
                          >
                            Show ROI Chart
                          </button>
                          <button 
                            onClick={() => showToast('Displaying Competitor Pricing Plan...')}
                            className="bg-white border border-outline-variant text-on-surface-variant text-[11px] px-md py-1.5 rounded font-bold hover:bg-surface-container-low transition-colors"
                          >
                            Compare Competitors
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-xl text-center border-2 border-dashed border-outline-variant rounded-lg text-on-surface-variant bg-surface-container-low">
                      <span className="material-symbols-outlined text-display-lg text-outline mb-sm">search_off</span>
                      <p className="text-sm">No objection handlers found for "{searchQuery}"</p>
                      <button 
                        onClick={() => setSearchQuery('')}
                        className="mt-sm text-xs font-bold text-primary hover:underline"
                      >
                        Clear Search Query
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'closing' && (
              <div className="space-y-md animate-in fade-in duration-300">
                <div className="flex items-center gap-sm">
                  <span className="bg-primary text-white text-[11px] w-6 h-6 rounded-full flex items-center justify-center font-bold">6</span>
                  <h2 className="font-headline-sm text-headline-sm">कॉल क्लोजिंग और पेमेंट प्रक्रिया (Call Closing & Link Sending)</h2>
                </div>
                <div className="bg-surface-container p-lg rounded-lg border border-outline-variant">
                  <p className="font-body-hindi text-[18px] leading-relaxed text-on-surface font-medium italic">
                    "तो राजेश जी, मैं आपके नंबर पर अभी 'Verified' प्लान का <strong>₹299</strong> का सुरक्षित पेमेंट लिंक भेज रहा हूँ। <br/><br/>
                    आप Google Pay, PhonePe या Paytm से सिर्फ 1 मिनट में पेमेंट कर सकते हैं। पेमेंट होते ही हमारी टीम आपको कॉल करके पहला लोड बुक करवा देगी।"
                  </p>
                </div>
                <div className="flex gap-sm mt-md">
                  <button 
                    onClick={handleSendPaymentLink}
                    className="flex-1 bg-accent-success text-white py-3 rounded-lg text-xs font-bold flex items-center justify-center gap-xs hover:brightness-95 transition-all shadow-sm"
                  >
                    <span className="material-symbols-outlined text-sm">send</span>
                    SEND SECURE LINK NOW
                  </button>
                  <button 
                    onClick={() => { setActiveTab('objections'); setSearchQuery('Price'); }}
                    className="px-lg border border-outline-variant text-on-surface-variant text-xs rounded-lg font-bold hover:bg-surface-container-low transition-colors"
                  >
                    Handling Price Objection
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>

        {/* Live Transcription Status Bar */}
        <div className="h-10 bg-on-surface-variant text-white flex items-center px-lg justify-between shrink-0">
          <div className="flex items-center gap-sm">
            <div className="flex gap-[2px] items-end pb-[2px]">
              <div className="w-[3px] h-3 bg-accent-success animate-bounce"></div>
              <div className="w-[3px] h-4 bg-accent-success animate-bounce" style={{ animationDelay: '75ms' }}></div>
              <div className="w-[3px] h-2 bg-accent-success animate-bounce" style={{ animationDelay: '150ms' }}></div>
            </div>
            <span className="text-[10px] font-bold tracking-widest uppercase text-white/95">Live Transcription Enabled</span>
          </div>
          <div className="text-[10px] font-mono-data opacity-60">Last sync: Just now</div>
        </div>
      </section>
    </main>
  );
};

export default DwActiveCallFocus;
