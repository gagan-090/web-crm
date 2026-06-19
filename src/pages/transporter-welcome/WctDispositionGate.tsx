import React from 'react';

export const WctDispositionGate: React.FC = () => {
  return (
    <main className="pt-16 flex">

<aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 flex flex-col p-md bg-surface-container-low border-r border-outline-variant z-40">
<div className="mb-lg">
<h2 className="font-headline-md text-headline-md font-bold text-on-surface">WCT Suite</h2>
<p className="text-body-sm text-on-surface-variant">Transporter Welcome</p>
</div>
<nav className="flex flex-col gap-xs flex-1">
<a className="flex items-center gap-md p-md bg-secondary-container text-on-secondary-container font-bold rounded-lg" href="#">
<span className="material-symbols-outlined">assignment_late</span>
<span className="text-body-md">My Queue</span>
</a>
<a className="flex items-center gap-md p-md text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">phone_in_talk</span>
<span className="text-body-md">Active Call</span>
</a>
<a className="flex items-center gap-md p-md text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">history</span>
<span className="text-body-md">Callbacks</span>
</a>
<a className="flex items-center gap-md p-md text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">trending_up</span>
<span className="text-body-md">D+7 Upsell</span>
</a>
<a className="flex items-center gap-md p-md text-on-surface-variant hover:bg-surface-variant rounded-lg transition-all" href="#">
<span className="material-symbols-outlined">leaderboard</span>
<span className="text-body-md">My Performance</span>
</a>
</nav>
<div className="mt-auto pt-md border-t border-outline-variant flex flex-col gap-xs">
<a className="flex items-center gap-md p-md text-on-surface-variant hover:bg-surface-variant rounded-lg" href="#">
<span className="material-symbols-outlined">settings</span>
<span className="text-body-md">Settings</span>
</a>
<a className="flex items-center gap-md p-md text-on-surface-variant hover:bg-surface-variant rounded-lg" href="#">
<span className="material-symbols-outlined">logout</span>
<span className="text-body-md">Logout</span>
</a>
</div>
</aside>

<div className="ml-64 flex-1 bg-surface-container-lowest relative overflow-y-auto p-xl">

<div className="absolute inset-0 opacity-[0.03] pointer-events-none">

</div>

<div className="max-w-5xl mx-auto relative z-10">
<div className="grid grid-cols-12 gap-lg">

<div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">

<div className="p-lg bg-surface-container-high rounded-xl border border-outline-variant">
<h3 className="font-label-md text-label-md text-on-surface-variant mb-md uppercase tracking-widest">SLA Compliance</h3>
<div className="flex items-center justify-between">
<span className="font-headline-sm text-headline-sm">First call SLA met?</span>
<div className="w-10 h-10 rounded-full bg-tertiary-container flex items-center justify-center text-on-tertiary-container">
<span className="material-symbols-outlined" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span>
</div>
</div>
<p className="text-body-sm text-on-surface-variant mt-sm">Contacted within 15 minutes of lead creation.</p>
</div>

<div className="p-lg bg-white rounded-xl border border-outline-variant">
<h3 className="font-label-md text-label-md text-on-surface-variant mb-md uppercase tracking-widest">Customer Profile</h3>
<div className="flex items-center gap-md mb-lg">
<div className="w-12 h-12 bg-secondary-container rounded-lg flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined">local_shipping</span>
</div>
<div>
<p className="font-headline-sm text-headline-sm">Express Logistics</p>
<p className="text-body-sm text-on-surface-variant">Fleet Size: 45 Trucks</p>
</div>
</div>
<div className="space-y-sm">
<div className="flex justify-between text-body-sm">
<span className="text-on-surface-variant">Primary Hub:</span>
<span className="font-bold">Indore, MP</span>
</div>
<div className="flex justify-between text-body-sm">
<span className="text-on-surface-variant">Contact Person:</span>
<span className="font-bold">Rahul Sharma</span>
</div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-8 flex flex-col gap-lg">

<div className="p-lg bg-white rounded-xl border border-outline-variant">
<div className="flex items-center gap-sm mb-lg">
<span className="w-6 h-6 rounded-full bg-brand-accent text-white flex items-center justify-center text-xs font-bold">1</span>
<h3 className="font-headline-sm text-headline-sm">Call Outcome</h3>
</div>
<div className="grid grid-cols-2 md:grid-cols-4 gap-md">
<button className="flex flex-col items-center gap-sm p-md border-2 border-brand-accent bg-surface-container-low rounded-lg transition-all">
<span className="material-symbols-outlined text-brand-accent">call_made</span>
<span className="text-label-md font-bold">Connected</span>
</button>
<button className="flex flex-col items-center gap-sm p-md border border-outline-variant hover:bg-surface-container rounded-lg transition-all">
<span className="material-symbols-outlined text-on-surface-variant">phone_missed</span>
<span className="text-label-md">No Response</span>
</button>
<button className="flex flex-col items-center gap-sm p-md border border-outline-variant hover:bg-surface-container rounded-lg transition-all">
<span className="material-symbols-outlined text-on-surface-variant">ring_volume</span>
<span className="text-label-md">Busy</span>
</button>
<button className="flex flex-col items-center gap-sm p-md border border-outline-variant hover:bg-surface-container rounded-lg transition-all">
<span className="material-symbols-outlined text-on-surface-variant">phone_disabled</span>
<span className="text-label-md">Invalid</span>
</button>
</div>
</div>

<div className="p-lg bg-white rounded-xl border border-outline-variant">
<div className="flex items-center gap-sm mb-lg">
<span className="w-6 h-6 rounded-full bg-brand-accent text-white flex items-center justify-center text-xs font-bold">2</span>
<h3 className="font-headline-sm text-headline-sm">Disposition</h3>
</div>
<div className="flex flex-wrap gap-md">
<label className="cursor-pointer group">
<input checked className="hidden peer" name="disposition"  type="radio"/>
<div className="px-lg py-md border border-outline-variant rounded-lg peer-checked:border-brand-accent peer-checked:bg-orange-50 group-hover:bg-surface-container-low transition-all">
<span className="text-body-md font-medium">Interested</span>
</div>
</label>
<label className="cursor-pointer group">
<input className="hidden peer" name="disposition"  type="radio"/>
<div className="px-lg py-md border border-outline-variant rounded-lg peer-checked:border-brand-accent peer-checked:bg-orange-50 group-hover:bg-surface-container-low transition-all">
<span className="text-body-md font-medium">Not Interested</span>
</div>
</label>
<label className="cursor-pointer group">
<input className="hidden peer" name="disposition"  type="radio"/>
<div className="px-lg py-md border border-outline-variant rounded-lg peer-checked:border-brand-accent peer-checked:bg-orange-50 group-hover:bg-surface-container-low transition-all">
<span className="text-body-md font-medium">Callback</span>
</div>
</label>
</div>
</div>

<div className="p-lg bg-white rounded-xl border border-outline-variant step-transition" id="conversionSection">
<div className="flex items-center gap-sm mb-lg">
<span className="w-6 h-6 rounded-full bg-brand-accent text-white flex items-center justify-center text-xs font-bold">3</span>
<h3 className="font-headline-sm text-headline-sm">Plan &amp; Queue</h3>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
<label className="cursor-pointer flex flex-col p-md border border-outline-variant rounded-lg peer-checked:border-brand-accent hover:bg-surface-container transition-all">
<input checked className="sr-only peer" name="plan"  type="radio"/>
<span className="text-body-md font-bold">Free</span>
<span className="text-body-sm text-on-surface-variant">Standard Features</span>
</label>
<label className="cursor-pointer flex flex-col p-md border border-outline-variant rounded-lg peer-checked:border-brand-accent hover:bg-surface-container transition-all">
<input className="sr-only peer" name="plan"  type="radio"/>
<span className="text-body-md font-bold">Premium</span>
<span className="text-body-sm text-on-surface-variant">Advanced Analytics</span>
</label>
<label className="cursor-pointer flex flex-col p-md border border-outline-variant rounded-lg peer-checked:border-brand-accent hover:bg-surface-container transition-all">
<input className="sr-only peer" name="plan"  type="radio"/>
<span className="text-body-md font-bold">Super Premium</span>
<span className="text-body-sm text-on-surface-variant">Priority Support</span>
</label>
</div>
<div className="space-y-lg">

<div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg">
<div>
<p className="font-body-md font-bold">Add to Matchmaking Queue?</p>
<p className="text-body-sm text-on-surface-variant">Immediately list in dispatcher marketplace</p>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
</label>
</div>

<div className="flex items-center justify-between p-md bg-surface-container-low rounded-lg border-l-4 border-brand-accent" id="upsellReminder">
<div>
<p className="font-body-md font-bold">Create D+7 upsell reminder?</p>
<p className="text-body-sm text-on-surface-variant">Trigger follow-up notification for premium upgrade</p>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox"/>
<div className="w-11 h-6 bg-outline-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-brand-accent"></div>
</label>
</div>

<div>
<label className="block font-label-md text-label-md text-on-surface-variant mb-sm uppercase">Add job description</label>
<textarea className="w-full bg-white border border-outline-variant rounded-lg p-md focus:ring-2 focus:ring-brand-accent focus:border-transparent outline-none transition-all" placeholder="Enter fleet requirements, routes, or specific logistics needs..." rows={3}></textarea>
</div>
</div>
</div>

<div className="flex gap-md mt-lg pb-xl">
<button className="flex-1 py-lg bg-green-600 hover:bg-green-700 text-white font-headline-sm rounded-xl flex items-center justify-center gap-md shadow-lg active:scale-[0.98] transition-all">
<span className="material-symbols-outlined">send</span>
                                Submit &amp; Load Next Lead
                            </button>
<button className="px-xl py-lg bg-surface border border-outline-variant text-on-surface-variant font-bold rounded-xl hover:bg-surface-container transition-all">
                                Skip &amp; Save Draft
                            </button>
</div>
</div>
</div>
</div>
</div>
</main>
  );
};

export default WctDispositionGate;
