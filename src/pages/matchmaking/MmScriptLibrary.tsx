import React from 'react';

export const MmScriptLibrary: React.FC = () => {
  return (
    <main className=" mt-16 p-margin-desktop">

<section className="mb-xl flex items-end justify-between">
<div>
<h2 className="font-display-lg text-display-lg text-on-background mb-xs">Script Library</h2>
<p className="text-body-lg text-on-surface-variant">Standard operating procedures for matchmaking calls.</p>
</div>
<div className="flex gap-sm">
<span className="bg-accent-purple/10 text-accent-purple px-md py-xs rounded-full font-label-md flex items-center gap-xs">
<span className="material-symbols-outlined text-[16px]">language</span>
                    Hindi Devanagari Enabled
                </span>
<span className="bg-surface-container-high text-on-surface-variant px-md py-xs rounded-full font-label-md">
                    v2.4 Updated Today
                </span>
</div>
</section>

<div className="grid grid-cols-12 gap-lg">

<div className="col-span-12 lg:col-span-8 glass-card rounded-xl p-lg flex flex-col gap-md border-l-4 border-l-primary">
<div className="flex justify-between items-start">
<div>
<span className="text-label-md text-primary uppercase tracking-widest">Stage 01</span>
<h3 className="font-headline-sm text-headline-sm">Opening: Job Pitch</h3>
</div>
<button className="p-xs text-outline hover:text-primary transition-colors">
<span className="material-symbols-outlined">content_copy</span>
</button>
</div>
<div className="bg-white/50 p-md rounded-lg border border-outline-variant/30">
<p className="hindi-font text-body-lg leading-relaxed text-on-background">
                        "नमस्कार! मैं TruckMitr से बात कर रहा हूँ। आपकी प्रोफाइल हमारे पास एक बेहतरीन ड्राइविंग अवसर के लिए मैच हुई है। क्या आपके पास 2 मिनट हैं इस शानदार ऑफर के बारे में जानने के लिए?"
                    </p>
</div>
<div className="grid grid-cols-2 gap-md">
<div className="flex items-start gap-sm p-sm bg-surface-container-low rounded-lg">
<span className="material-symbols-outlined text-primary">tips_and_updates</span>
<div>
<p className="font-label-md">Tone Note</p>
<p className="text-body-sm text-on-surface-variant">Keep it energetic and professional. Do not pause too long after the intro.</p>
</div>
</div>
<div className="flex items-start gap-sm p-sm bg-surface-container-low rounded-lg">
<span className="material-symbols-outlined text-primary">priority_high</span>
<div>
<p className="font-label-md">Value Proposition</p>
<p className="text-body-sm text-on-surface-variant">Focus on "Selected Profile" to build importance.</p>
</div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-4 bg-primary text-on-primary rounded-xl p-lg flex flex-col justify-between">
<div>
<h3 className="font-headline-sm mb-sm">Call Success Rate</h3>
<p className="text-body-sm opacity-90 mb-lg">Current performance for Script MM-10 across all active callers.</p>
<div className="flex items-baseline gap-xs">
<span className="text-[48px] font-bold">68%</span>
<span className="text-body-md opacity-80">Conversion</span>
</div>
</div>
<div className="space-y-sm">
<div className="flex justify-between text-label-md">
<span>Daily Target</span>
<span>42/60</span>
</div>
<div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
<div className="bg-white h-full w-[70%]"></div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-lg">
<div className="col-span-1 border border-outline-variant rounded-xl p-md bg-white hover:border-accent-purple transition-all group">
<div className="flex items-center gap-sm mb-md">
<span className="w-8 h-8 rounded bg-red-100 text-red-600 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">block</span>
</span>
<h4 className="font-headline-sm text-[16px]">Objection: Salary</h4>
</div>
<div className="space-y-md">
<div>
<p className="text-[10px] font-bold text-outline uppercase mb-xs">Driver Says:</p>
<p className="hindi-font text-body-md italic text-on-surface-variant">"सैलरी बहुत कम है, मुझे कम से कम 25,000 चाहिए।"</p>
</div>
<div className="p-sm bg-accent-purple/5 rounded border-l-2 border-accent-purple">
<p className="text-[10px] font-bold text-accent-purple uppercase mb-xs">Response:</p>
<p className="hindi-font text-body-md">"मैं आपकी बात समझ सकता हूँ। इस जॉब में बेसिक के साथ इंसेंटिव और रहने का खर्च भी कंपनी दे रही है, जिससे आपकी बचत ज्यादा होगी।"</p>
</div>
</div>
</div>
<div className="col-span-1 border border-outline-variant rounded-xl p-md bg-white hover:border-accent-purple transition-all group">
<div className="flex items-center gap-sm mb-md">
<span className="w-8 h-8 rounded bg-yellow-100 text-yellow-600 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">location_on</span>
</span>
<h4 className="font-headline-sm text-[16px]">Objection: Location</h4>
</div>
<div className="space-y-md">
<div>
<p className="text-[10px] font-bold text-outline uppercase mb-xs">Driver Says:</p>
<p className="hindi-font text-body-md italic text-on-surface-variant">"यह लोकेशन मेरे घर से बहुत दूर है।"</p>
</div>
<div className="p-sm bg-accent-purple/5 rounded border-l-2 border-accent-purple">
<p className="text-[10px] font-bold text-accent-purple uppercase mb-xs">Response:</p>
<p className="hindi-font text-body-md">"दूर तो है, लेकिन वहां कंपनी क्वार्टर दे रही है और रूट बहुत आसान है। क्या आप एक बार मालिक से बात करना चाहेंगे?"</p>
</div>
</div>
</div>
<div className="col-span-1 border border-outline-variant rounded-xl p-md bg-white hover:border-accent-purple transition-all group">
<div className="flex items-center gap-sm mb-md">
<span className="w-8 h-8 rounded bg-blue-100 text-blue-600 flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">history</span>
</span>
<h4 className="font-headline-sm text-[16px]">Objection: Delay</h4>
</div>
<div className="space-y-md">
<div>
<p className="text-[10px] font-bold text-outline uppercase mb-xs">Driver Says:</p>
<p className="hindi-font text-body-md italic text-on-surface-variant">"मैं अभी बिजी हूँ, 4 दिन बाद बताऊंगा।"</p>
</div>
<div className="p-sm bg-accent-purple/5 rounded border-l-2 border-accent-purple">
<p className="text-[10px] font-bold text-accent-purple uppercase mb-xs">Response:</p>
<p className="hindi-font text-body-md">"सर, ये वैकेंसी कल तक बंद हो जाएगी। सिर्फ 2 मिनट की बात है, अभी मालिक लाइन पर हैं, बात खत्म कर लेते हैं?"</p>
</div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-6 bg-surface-container-high rounded-xl p-lg border border-outline-variant">
<div className="flex items-center gap-md mb-lg">
<div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white">
<span className="material-symbols-outlined text-[28px]">groups</span>
</div>
<div>
<h3 className="font-headline-sm">3-Way Intro Explanation</h3>
<p className="text-body-sm text-on-surface-variant">Transitioning the driver to the Transporter.</p>
</div>
</div>
<div className="space-y-md">
<div className="bg-white p-md rounded-lg">
<p className="hindi-font text-body-md leading-relaxed">
                            "बहुत अच्छा! अब मैं लाइन पर कंपनी के मालिक को ले रहा हूँ। मैं आपका परिचय उनसे कराऊंगा और फिर आप सीधे उनसे रूट और पेमेंट की डिटेल्स फाइनल कर लेना।"
                        </p>
</div>
<ul className="space-y-sm">
<li className="flex items-center gap-sm text-body-sm">
<span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                            Briefly explain who the Transporter is.
                        </li>
<li className="flex items-center gap-sm text-body-sm">
<span className="material-symbols-outlined text-primary text-[18px]">check_circle</span>
                            Mute yourself but stay on the line to monitor.
                        </li>
</ul>
</div>
</div>

<div className="col-span-12 lg:col-span-6 bg-surface-container-high rounded-xl p-lg border border-outline-variant">
<div className="flex items-center gap-md mb-lg">
<div className="w-12 h-12 rounded-full bg-accent-purple flex items-center justify-center text-white">
<span className="material-symbols-outlined text-[28px]">verified</span>
</div>
<div>
<h3 className="font-headline-sm">Placement Closure</h3>
<p className="text-body-sm text-on-surface-variant">Confirming the final selection.</p>
</div>
</div>
<div className="space-y-md">
<div className="bg-white p-md rounded-lg">
<p className="hindi-font text-body-md leading-relaxed">
                            "बधाई हो! आपकी जॉइनिंग पक्की हो गई है। कल सुबह 10 बजे आपको ऑफिस पहुँचना है। मैं आपको एड्रेस और मालिक का नंबर मैसेज कर रहा हूँ।"
                        </p>
</div>
<div className="p-sm bg-yellow-50 border border-yellow-200 rounded-lg flex gap-sm">
<span className="material-symbols-outlined text-yellow-700">warning</span>
<p className="text-body-sm text-yellow-800 italic">Ensure you confirm the reporting date/time twice before hanging up.</p>
</div>
</div>
</div>

<div className="col-span-12 border border-outline-variant rounded-xl overflow-hidden flex flex-col md:flex-row bg-white">
<div className="md:w-1/3 p-lg border-r border-outline-variant flex flex-col gap-md">
<div className="flex items-center gap-md">
<div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container">
<img className="w-full h-full object-cover" data-alt="A professional headshot of a middle-aged Indian truck driver with a short beard, wearing a clean collared shirt. He has a confident, friendly expression. The background is a slightly blurred transport hub with large trucks, rendered in a crisp, high-key modern UI style with natural daylighting." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBQzLcAXP34zfeuSfQo8n_QlGIqP0HWtYcl3Nf3YkBxeINzyIlADnJsND4Qi_-qIjRsOWUZ_oZn-R5QIp7RS4CYlNf63ENzBbdgl2wJ_YNTuxKxSMWgFAr7ZsksEMvIQeCwtOzS1zlEmHh69nIeI0JVtjbjAL6XLoZSvBGMGo1chaAgHcEc87SPH-VA3--AdhJAp2kWZceyqQ5Jk9qujGc5eHWSTDLCTa0Hi2KXqJeweQDn5EoWlrJ55qGR7CZY9cU395rxbdkS-Ek"/>
</div>
<div>
<h4 className="font-headline-sm">Rakesh Kumar</h4>
<p className="text-body-sm text-on-surface-variant">12 Yrs Experience • Delhi NCR</p>
</div>
</div>
<div className="grid grid-cols-2 gap-sm">
<div className="p-sm bg-surface-container-low rounded">
<p className="text-[10px] font-bold text-outline">CURRENT SALARY</p>
<p className="font-mono-data">₹18,500</p>
</div>
<div className="p-sm bg-surface-container-low rounded">
<p className="text-[10px] font-bold text-outline">EXPECTED</p>
<p className="font-mono-data text-primary">₹22,000+</p>
</div>
</div>
<div className="flex flex-wrap gap-xs">
<span className="bg-green-100 text-green-700 px-sm py-1 rounded text-[10px] font-bold">VERIFIED KYC</span>
<span className="bg-blue-100 text-blue-700 px-sm py-1 rounded text-[10px] font-bold">HAZMAT EXP</span>
</div>
</div>
<div className="flex-1 p-lg flex flex-col justify-between">
<div>
<h4 className="font-label-md text-outline uppercase mb-md">Active Script Matching</h4>
<div className="space-y-sm">
<div className="flex items-center justify-between p-sm border border-outline-variant rounded-lg">
<span className="text-body-md">Recommended Script</span>
<span className="bg-accent-purple text-white px-md py-xs rounded-full text-[10px] font-bold">MM-10 High Value</span>
</div>
<div className="flex items-center justify-between p-sm border border-outline-variant rounded-lg">
<span className="text-body-md">Best Opening</span>
<span className="text-body-sm font-medium">"Senior Expert Pitch"</span>
</div>
</div>
</div>
<div className="flex justify-end gap-md mt-lg">
<button className="px-lg py-sm border border-outline text-on-surface rounded-lg font-bold hover:bg-surface-variant transition-all">Send SMS</button>
<button className="px-xl py-sm bg-primary text-on-primary rounded-lg font-bold flex items-center gap-sm hover:opacity-90 transition-all">
<span className="material-symbols-outlined">call</span>
                            Start Matchmaking
                        </button>
</div>
</div>
</div>
</div>

<footer className="mt-xl pt-lg border-t border-outline-variant flex justify-between items-center text-body-sm text-on-surface-variant">
<p>© 2024 TruckMitr Matchmaking Systems. All calls are recorded for quality assurance.</p>
<div className="flex gap-lg">
<a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="hover:text-primary transition-colors" href="#">Help Center</a>
<a className="hover:text-primary transition-colors" href="#">System Status</a>
</div>
</footer>
</main>
  );
};

export default MmScriptLibrary;
