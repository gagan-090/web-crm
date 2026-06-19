import React from 'react';

export const WctScriptLibrary: React.FC = () => {
  return (
    <main className=" mt-16 p-32 bg-white min-h-screen">
<div className="max-w-6xl mx-auto">

<div className="flex items-end justify-between mb-xl">
<div>
<h1 className="font-display-lg text-display-lg text-on-surface mb-2">Script Library</h1>
<p className="text-on-surface-variant max-w-xl font-body-lg">Access standard pitches, handle common objections, and review fleet-size specific logic for transporter onboarding.</p>
</div>
<div className="flex gap-md">
<button className="flex items-center gap-2 px-md py-2 border border-outline rounded hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined">translate</span>
                        Hindi / English
                    </button>
<button className="flex items-center gap-2 px-md py-2 bg-accent-custom text-white rounded font-bold hover:opacity-90 transition-opacity shadow-sm">
<span className="material-symbols-outlined">record_voice_over</span>
                        Listen to Model Call
                    </button>
</div>
</div>

<div className="bento-grid">

<div className="col-span-8 bg-surface-container-low border border-outline-variant rounded-xl p-lg flex flex-col justify-between">
<div>
<span className="bg-primary-fixed text-primary px-3 py-1 rounded-full text-label-md font-bold uppercase mb-md inline-block">Value Pitch</span>
<h3 className="font-headline-md text-headline-md mb-4">Cost Performance Comparison</h3>
<div className="flex items-center gap-lg">
<div className="flex-1 p-md border-r border-outline-variant">
<p className="text-body-sm text-on-surface-variant uppercase font-bold tracking-widest mb-1">Agency Hire</p>
<p className="font-display-lg text-display-lg text-error">₹5,000+</p>
<p className="text-body-sm text-on-surface-variant">Estimated monthly cost per truck</p>
</div>
<div className="flex-1 p-md">
<p className="text-body-sm text-accent-custom uppercase font-bold tracking-widest mb-1">TruckMitr Premium</p>
<p className="font-display-lg text-display-lg text-accent-custom">₹1,999</p>
<p className="text-body-sm text-on-surface-variant font-bold">For 3 full months</p>
</div>
</div>
</div>
<div className="mt-lg pt-lg border-t border-outline-variant flex items-center justify-between">
<p className="text-body-md italic text-on-surface-variant">"Agent 5,000 leta hai mahine ka, hum sirf 600 rupaye mahine mein vahi kaam kar rahe hain."</p>
<button className="text-accent-custom font-bold flex items-center gap-1">
<span className="material-symbols-outlined">play_circle</span>
                            Listen Logic
                        </button>
</div>
</div>

<div className="col-span-4 bg-white border border-outline-variant rounded-xl p-lg flex flex-col">
<div className="flex items-center gap-2 mb-md">
<span className="material-symbols-outlined text-primary">chat_bubble</span>
<h3 className="font-headline-sm text-headline-sm">The Opening</h3>
</div>
<p className="text-body-md mb-md leading-relaxed">
                        "Namaste, main [Name] bol raha hoon TruckMitr se. Kya meri baat [Transporter Name] se ho rahi hai? Hum transporters ko direct business dilane mein madad karte hain..."
                    </p>
<div className="mt-auto flex flex-wrap gap-xs">
<span className="px-2 py-1 bg-surface-variant rounded text-label-md">Professional</span>
<span className="px-2 py-1 bg-surface-variant rounded text-label-md">High Energy</span>
</div>
</div>

<div className="col-span-12 grid grid-cols-3 gap-md">

<div className="bg-white border border-outline-variant rounded-xl p-lg">
<h4 className="font-headline-sm text-headline-sm mb-2">Free Plan</h4>
<p className="text-body-sm text-on-surface-variant mb-md">For fleet size 1-2 trucks</p>
<ul className="space-y-2 mb-lg">
<li className="flex gap-2 text-body-md"><span className="material-symbols-outlined text-green-600 text-sm">check_circle</span> Basic load access</li>
<li className="flex gap-2 text-body-md"><span className="material-symbols-outlined text-green-600 text-sm">check_circle</span> App verification</li>
<li className="flex gap-2 text-body-md"><span className="material-symbols-outlined text-green-600 text-sm">check_circle</span> 2 leads per week</li>
</ul>
<button className="w-full py-2 bg-surface-variant font-bold rounded">View Script</button>
</div>

<div className="bg-white border-2 border-accent-custom rounded-xl p-lg relative overflow-hidden">
<div className="absolute top-0 right-0 bg-accent-custom text-white px-3 py-1 text-label-md font-bold rounded-bl-lg">POPULAR</div>
<h4 className="font-headline-sm text-headline-sm mb-2">Premium Pitch</h4>
<p className="text-body-sm text-on-surface-variant mb-md">Standard for 3-10 trucks</p>
<ul className="space-y-2 mb-lg">
<li className="flex gap-2 text-body-md"><span className="material-symbols-outlined text-accent-custom text-sm">check_circle</span> Priority Leads</li>
<li className="flex gap-2 text-body-md"><span className="material-symbols-outlined text-accent-custom text-sm">check_circle</span> Payment Guarantee</li>
<li className="flex gap-2 text-body-md"><span className="material-symbols-outlined text-accent-custom text-sm">check_circle</span> Relationship Manager</li>
</ul>
<button className="w-full py-2 bg-accent-custom text-white font-bold rounded">View Script</button>
</div>

<div className="bg-surface-dim border border-outline-variant rounded-xl p-lg">
<h4 className="font-headline-sm text-headline-sm mb-2">Super Premium</h4>
<p className="text-body-sm text-on-surface-variant mb-md">Enterprise 10+ trucks</p>
<ul className="space-y-2 mb-lg">
<li className="flex gap-2 text-body-md"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Dedicated Fleet Support</li>
<li className="flex gap-2 text-body-md"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Bulk Load Contracts</li>
<li className="flex gap-2 text-body-md"><span className="material-symbols-outlined text-primary text-sm">check_circle</span> Fuel Discount Cards</li>
</ul>
<button className="w-full py-2 bg-surface-variant font-bold rounded">View Script</button>
</div>
</div>

<div className="col-span-12">
<h3 className="font-headline-md text-headline-md mb-lg">Objection Handling (Hindi)</h3>
<div className="grid grid-cols-4 gap-md">
<div className="bg-white p-md border border-outline-variant rounded-lg hover:border-accent-custom transition-colors group cursor-pointer">
<p className="font-bold text-error mb-2">"Paisa kyun doon?"</p>
<p className="text-body-sm text-on-surface-variant line-clamp-2 group-hover:line-clamp-none">Sir, yeh security ke liye hai. Verified transporters ko hi achhe loads milte hain...</p>
</div>
<div className="bg-white p-md border border-outline-variant rounded-lg hover:border-accent-custom transition-colors group cursor-pointer">
<p className="font-bold text-error mb-2">"Internet nahi aata"</p>
<p className="text-body-sm text-on-surface-variant line-clamp-2 group-hover:line-clamp-none">Koi baat nahi, hamari team aapko call karke saari details degi...</p>
</div>
<div className="bg-white p-md border border-outline-variant rounded-lg hover:border-accent-custom transition-colors group cursor-pointer">
<p className="font-bold text-error mb-2">"Agent sasta hai"</p>
<p className="text-body-sm text-on-surface-variant line-clamp-2 group-hover:line-clamp-none">Agent ke paas limited gaadiyan hoti hain, hum aapko desh-bhar ka load dete hain...</p>
</div>
<div className="bg-white p-md border border-outline-variant rounded-lg hover:border-accent-custom transition-colors group cursor-pointer">
<p className="font-bold text-error mb-2">"Fraud toh nahi?"</p>
<p className="text-body-sm text-on-surface-variant line-clamp-2 group-hover:line-clamp-none">Sir, hum Flipkart ke authorized logistics partner hain, bharosa rakhiye...</p>
</div>
</div>
</div>

<div className="col-span-12 bg-surface-container p-lg rounded-xl">
<div className="flex items-center justify-between mb-lg">
<h3 className="font-headline-md text-headline-md">Fleet-Size Strategic Logic</h3>
<span className="text-body-sm font-bold text-on-surface-variant">UPDATED OCT 2023</span>
</div>
<div className="grid grid-cols-2 gap-xl">
<div className="flex gap-md">
<div className="h-12 w-12 shrink-0 bg-white rounded-full flex items-center justify-center text-accent-custom font-bold text-xl border border-outline-variant">1</div>
<div>
<h5 className="font-bold mb-2">1-3 Trucks (Owner Operators)</h5>
<p className="text-body-md text-on-surface-variant">Focus on **Quick Cashflow** and **Return Loads**. They hate dead-mileage. Pitch the app as a "Load Finder" for empty returns.</p>
</div>
</div>
<div className="flex gap-md">
<div className="h-12 w-12 shrink-0 bg-white rounded-full flex items-center justify-center text-accent-custom font-bold text-xl border border-outline-variant">2</div>
<div>
<h5 className="font-bold mb-2">4-10 Trucks (Small Fleet Owners)</h5>
<p className="text-body-md text-on-surface-variant">Focus on **Business Growth** and **Security**. They want to escape the local agent's monopoly. Pitch the "Relationship Manager".</p>
</div>
</div>
<div className="flex gap-md">
<div className="h-12 w-12 shrink-0 bg-white rounded-full flex items-center justify-center text-accent-custom font-bold text-xl border border-outline-variant">3</div>
<div>
<h5 className="font-bold mb-2">10+ Trucks (Asset Heavy)</h5>
<p className="text-body-md text-on-surface-variant">Focus on **Efficiency** and **Contractual Loads**. They care about TAT and fueling. Pitch the "Enterprise Dashboard".</p>
</div>
</div>
<div className="flex gap-md">
<div className="h-12 w-12 shrink-0 bg-white rounded-full flex items-center justify-center text-accent-custom font-bold text-xl border border-outline-variant">4</div>
<div>
<h5 className="font-bold mb-2">Broker-Cum-Transporter</h5>
<p className="text-body-md text-on-surface-variant">Focus on **Market Rate Intelligence**. They use our data to fix their margins. Pitch the "Market Trend" tool.</p>
</div>
</div>
</div>
</div>
</div>

<div className="fixed bottom-margin-desktop right-margin-desktop">
<button className="flex items-center gap-3 bg-on-surface text-white px-lg py-3 rounded-full shadow-lg hover:scale-105 active:scale-95 transition-all" id="listenBtn">
<span className="material-symbols-outlined" style={{"fontVariationSettings": "\'FILL\' 1"}}>play_arrow</span>
<span className="font-bold">Resume Model Call Audio</span>
</button>
</div>
</div>
</main>
  );
};

export default WctScriptLibrary;
