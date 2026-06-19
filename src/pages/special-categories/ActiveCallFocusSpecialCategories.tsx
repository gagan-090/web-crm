import React from 'react';

export const ActiveCallFocusSpecialCategories: React.FC = () => {
  return (
    <main className="min-h-screen">
<div className="p-gutter max-w-container-max mx-auto">

<div className="bg-primary-container text-on-primary-container px-md py-sm rounded-lg mb-gutter flex items-center justify-between shadow-sm">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-on-primary-container">info</span>
<span className="font-label-md">Attempt 2 of 5 — Day 2 script recommended: Re-introduce, income angle</span>
</div>
<div className="flex gap-base">
<div className="w-2 h-2 rounded-full bg-on-primary-container"></div>
<div className="w-2 h-2 rounded-full bg-on-primary-container opacity-40 animate-pulse-teal"></div>
<div className="w-2 h-2 rounded-full border border-on-primary-container"></div>
<div className="w-2 h-2 rounded-full border border-on-primary-container"></div>
<div className="w-2 h-2 rounded-full border border-on-primary-container"></div>
</div>
</div>

<div className="grid grid-cols-12 gap-gutter">

<div className="col-span-12 lg:col-span-7 space-y-gutter">

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md flex items-center justify-between">
<div className="flex items-center gap-md">
<div className="w-14 h-14 rounded-full bg-secondary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-on-secondary-fixed text-3xl">person</span>
</div>
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Rajesh Kumar Logistics</h2>
<p className="text-body-sm text-on-surface-variant flex items-center gap-xs">
<span className="material-symbols-outlined text-sm">id_card</span> TMID: 8849201 | 
                                    <span className="material-symbols-outlined text-sm">local_shipping</span> Type: Fleet Owner (Tier 2)
                                </p>
</div>
</div>
<div className="text-right">
<div className="font-mono-data text-headline-md text-primary tracking-wider" id="callTimer">04:12</div>
<p className="text-body-sm text-on-surface-variant">Live Call Duration</p>
</div>
</div>

<div className="grid grid-cols-4 gap-sm">
<button className="bg-surface-container-lowest border border-outline-variant hover:border-primary hover:text-primary p-md rounded-lg flex flex-col items-center gap-xs transition-colors">
<span className="material-symbols-outlined">check_circle</span>
<span className="text-label-md">Interested</span>
</button>
<button className="bg-surface-container-lowest border border-outline-variant hover:border-error hover:text-error p-md rounded-lg flex flex-col items-center gap-xs transition-colors">
<span className="material-symbols-outlined">cancel</span>
<span className="text-label-md">Not Interested</span>
</button>
<button className="bg-surface-container-lowest border border-outline-variant hover:border-tertiary hover:text-tertiary p-md rounded-lg flex flex-col items-center gap-xs transition-colors">
<span className="material-symbols-outlined">schedule</span>
<span className="text-label-md">Callback</span>
</button>
<button className="bg-surface-container-lowest border border-outline-variant hover:border-outline hover:text-on-surface p-md rounded-lg flex flex-col items-center gap-xs transition-colors">
<span className="material-symbols-outlined">phone_missed</span>
<span className="text-label-md">No Response</span>
</button>
</div>

<div className="bg-primary-container/10 border-2 border-primary-container rounded-xl p-md">
<div className="flex items-center gap-sm mb-sm text-primary">
<span className="material-symbols-outlined">payments</span>
<h3 className="font-headline-md text-headline-md">Income Model Summary</h3>
</div>
<div className="grid grid-cols-3 gap-md">
<div className="bg-surface-container-lowest p-sm rounded-lg border border-primary-container/30">
<p className="text-body-sm text-on-surface-variant">Subscription Cost</p>
<p className="font-headline-md text-primary">₹999 / Year</p>
</div>
<div className="bg-surface-container-lowest p-sm rounded-lg border border-primary-container/30">
<p className="text-body-sm text-on-surface-variant">Per Placement</p>
<p className="font-headline-md text-primary">₹150 Commission</p>
</div>
<div className="bg-surface-container-lowest p-sm rounded-lg border border-primary-container/30">
<p className="text-body-sm text-on-surface-variant">Min. Monthly Earnings</p>
<p className="font-headline-md text-primary">₹15,000+</p>
</div>
</div>
<p className="mt-md text-body-sm text-on-surface-variant leading-relaxed">
                            Explain: Each driver added under the ₹999 plan earns the partner ₹100 instantly. Successful load placement adds ₹150 recurring per trip.
                        </p>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant p-md">
<h3 className="font-headline-md text-headline-md mb-md">Live Commission Calculator</h3>
<div className="grid grid-cols-2 gap-lg">
<div className="space-y-md">
<div>
<label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Active Drivers Count</label>
<input className="w-full bg-surface-container-low border-b-2 border-outline focus:border-primary focus:ring-0 rounded-t-lg px-md py-sm" id="driverInput"  placeholder="Enter number of drivers" type="number"/>
</div>
<div>
<label className="block text-body-sm font-bold text-on-surface-variant mb-xs">Expected Placements / Month</label>
<input className="w-full bg-surface-container-low border-b-2 border-outline focus:border-primary focus:ring-0 rounded-t-lg px-md py-sm" id="placementInput"  placeholder="Enter number of placements" type="number"/>
</div>
</div>
<div className="bg-primary-container rounded-xl flex flex-col items-center justify-center p-md text-on-primary-container">
<p className="text-body-sm uppercase tracking-widest font-bold">Estimated Monthly Pay</p>
<span className="font-headline-lg text-headline-lg mt-sm" id="totalCommission">₹ 0.00</span>
<div className="mt-md h-px w-full bg-on-primary-container opacity-20"></div>
<p className="text-body-sm mt-md opacity-80">ROI: <span id="roiText">--</span></p>
</div>
</div>
</div>

<div className="space-y-md">
<textarea className="w-full h-32 bg-surface-container-lowest border border-outline-variant focus:border-primary focus:ring-0 rounded-xl p-md" placeholder="Type call notes here (e.g., objection details, specific concerns)..."></textarea>
<div className="flex gap-md">
<button className="flex-1 border-2 border-primary text-primary py-md rounded-xl font-headline-md hover:bg-primary/5 transition-colors">Save Draft</button>
<button className="flex-1 bg-error text-on-error py-md rounded-xl font-headline-md flex items-center justify-center gap-sm hover:opacity-90 transition-opacity">
<span className="material-symbols-outlined">call_end</span> End Call
                            </button>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-5 flex flex-col h-[calc(100vh-180px)] sticky top-24">

<div className="flex bg-surface-container border border-outline-variant rounded-t-xl overflow-hidden shrink-0">
<button className="flex-1 py-md px-sm text-body-sm font-bold text-on-surface-variant border-r border-outline-variant hover:bg-surface-container-high">Day 1</button>
<button className="flex-1 py-md px-sm text-body-sm font-bold bg-surface-container-lowest text-primary border-b-2 border-primary">Day 2</button>
<button className="flex-1 py-md px-sm text-body-sm font-bold text-on-surface-variant border-l border-outline-variant hover:bg-surface-container-high">Day 3</button>
<button className="flex-1 py-md px-sm text-body-sm font-bold text-on-surface-variant border-l border-outline-variant hover:bg-surface-container-high">Day 4</button>
<button className="flex-1 py-md px-sm text-body-sm font-bold text-on-surface-variant border-l border-outline-variant hover:bg-surface-container-high">Day 5</button>
</div>

<div className="bg-surface-container-lowest border-x border-b border-outline-variant rounded-b-xl flex-1 flex flex-col overflow-hidden">
<div className="p-md bg-secondary-container/30 border-b border-outline-variant">
<p className="font-label-md text-label-md text-primary uppercase">Recommended Flow: The Income Angle</p>
</div>
<div className="p-md overflow-y-auto space-y-lg flex-1">
<div className="space-y-sm">
<p className="text-body-sm font-bold text-on-surface-variant">1. Re-introduction</p>
<p className="text-body-lg text-on-surface italic border-l-4 border-primary pl-md">
                                    "नमस्ते राजेश जी, मैं TruckMitr से बोल रहा हूँ। कल हमारी बात हुई थी आपके ट्रक बिजनेस को बढ़ाने के बारे में। क्या अभी 2 मिनट बात हो सकती है?"
                                </p>
</div>
<div className="space-y-sm">
<p className="text-body-sm font-bold text-on-surface-variant">2. The Pivot (Commission Focus)</p>
<p className="text-body-lg text-on-surface leading-relaxed">
                                    "राजेश जी, कल मैंने आपसे ऐप के बारे में कहा था, लेकिन आज मैं आपको ये बताना चाहता हूँ कि आप TruckMitr पार्टनर बनकर हर महीने ₹20,000 से ज्यादा कैसे कमा सकते हैं..."
                                </p>
</div>

<div className="space-y-md pt-md">
<h4 className="font-label-md text-label-md text-on-surface-variant border-b border-outline-variant pb-xs">Common Objections (Hindi)</h4>
<div className="bg-surface-container-low p-md rounded-lg border border-outline-variant group cursor-pointer hover:border-primary transition-colors">
<div className="flex justify-between items-start mb-xs">
<p className="font-bold text-on-surface">"₹999 बहुत ज्यादा है"</p>
<span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">lightbulb</span>
</div>
<p className="text-body-sm italic text-on-surface-variant">
                                        Response: "सर, ये सिर्फ ₹80 प्रति महीना है। एक ड्राइवर के जुड़ने पर ही आपको ₹100 मिल जाते हैं, यानी पहली जॉइनिंग पर ही पैसा वसूल।"
                                    </p>
</div>
<div className="bg-surface-container-low p-md rounded-lg border border-outline-variant group cursor-pointer hover:border-primary transition-colors">
<div className="flex justify-between items-start mb-xs">
<p className="font-bold text-on-surface">"मेरे पास ड्राइवर नहीं हैं"</p>
<span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">lightbulb</span>
</div>
<p className="text-body-sm italic text-on-surface-variant">
                                        Response: "वही तो सर! हम आपको ड्राइवर ढूंढने में भी मदद करते हैं और हर लोड पर फिक्स कमीशन देते हैं।"
                                    </p>
</div>
<div className="bg-surface-container-low p-md rounded-lg border border-outline-variant group cursor-pointer hover:border-primary transition-colors">
<div className="flex justify-between items-start mb-xs">
<p className="font-bold text-on-surface">"पेमेंट कब मिलेगी?"</p>
<span className="material-symbols-outlined text-primary opacity-0 group-hover:opacity-100 transition-opacity">lightbulb</span>
</div>
<p className="text-body-sm italic text-on-surface-variant">
                                        Response: "ड्राइवर के डॉक्यूमेंट वेरीफाई होते ही कमीशन आपके वॉलेट में आ जाता है जिसे आप तुरंत बैंक में ले सकते हैं।"
                                    </p>
</div>
</div>
</div>

<div className="p-md border-t border-outline-variant bg-surface-container-low flex justify-between items-center">
<button className="text-primary font-bold text-body-sm flex items-center gap-xs">
<span className="material-symbols-outlined text-sm">download</span> Full Script PDF
                            </button>
<div className="flex gap-sm">
<span className="px-md py-xs bg-primary/10 text-primary text-body-sm rounded-full font-bold">Consultative Mode</span>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
  );
};

export default ActiveCallFocusSpecialCategories;
