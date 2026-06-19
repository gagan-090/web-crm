import React from 'react';

export const PartnerQueueDetail: React.FC = () => {
  return (
    <main className="flex">

<section className="w-[45%] flex flex-col border-r border-outline-variant bg-surface-container-lowest">
<div className="p-md border-b border-outline-variant">
<div className="flex items-center justify-between mb-md">
<h2 className="font-headline-md text-headline-md text-on-surface">Partner Queue</h2>
<span className="text-body-sm text-on-surface-variant">24 Active Leads</span>
</div>
<div className="flex gap-xs overflow-x-auto pb-xs">
<button className="px-md py-1.5 rounded-full bg-primary text-on-primary font-label-md text-label-md whitespace-nowrap">All</button>
<button className="px-md py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md whitespace-nowrap hover:bg-outline-variant transition-colors">Foreman</button>
<button className="px-md py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md whitespace-nowrap hover:bg-outline-variant transition-colors">Association</button>
<button className="px-md py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md whitespace-nowrap hover:bg-outline-variant transition-colors">Puncture</button>
<button className="px-md py-1.5 rounded-full bg-surface-container-high text-on-surface-variant font-label-md text-label-md whitespace-nowrap hover:bg-outline-variant transition-colors">Dhabha</button>
</div>
</div>
<div className="flex-1 overflow-y-auto">

<div className="zebra-stripe p-md cursor-pointer border-b border-outline-variant hover:bg-primary-container/10 transition-colors border-l-4 border-primary">
<div className="flex justify-between items-start mb-sm">
<div>
<div className="flex items-center gap-xs">
<h3 className="font-bold text-body-lg">Rajesh Kumar</h3>
<span className="bg-secondary-container text-on-secondary-container text-[10px] px-xs py-0.5 rounded uppercase font-bold">Foreman</span>
</div>
<p className="text-body-sm text-on-surface-variant font-mono-data">TMID: 884920</p>
</div>
<span className="bg-tertiary-fixed text-on-tertiary-fixed-variant text-[11px] px-sm py-1 rounded-full font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]">priority_high</span> Due Today
                        </span>
</div>
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="text-[11px] text-on-surface-variant uppercase font-semibold">City</span>
<span className="text-body-md">Namakkal, TN</span>
</div>
<div className="flex flex-col items-end">
<span className="text-[11px] text-on-surface-variant uppercase font-semibold mb-1">Attempt Progress</span>
<div className="flex gap-1">
<div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,107,88,0.4)]"></div>
<div className="w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(0,107,88,0.4)]"></div>
<div className="w-2 h-2 rounded-full border border-outline-variant"></div>
<div className="w-2 h-2 rounded-full border border-outline-variant"></div>
<div className="w-2 h-2 rounded-full border border-outline-variant"></div>
</div>
</div>
</div>
</div>
<div className="zebra-stripe p-md cursor-pointer border-b border-outline-variant hover:bg-primary-container/10 transition-colors">
<div className="flex justify-between items-start mb-sm">
<div>
<div className="flex items-center gap-xs">
<h3 className="font-bold text-body-lg">Sanjay Transport Service</h3>
<span className="bg-secondary-container text-on-secondary-container text-[10px] px-xs py-0.5 rounded uppercase font-bold">Association</span>
</div>
<p className="text-body-sm text-on-surface-variant font-mono-data">TMID: 901244</p>
</div>
<span className="text-body-sm text-on-surface-variant italic">Next: Tomorrow</span>
</div>
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="text-[11px] text-on-surface-variant uppercase font-semibold">City</span>
<span className="text-body-md">Indore, MP</span>
</div>
<div className="flex flex-col items-end">
<span className="text-[11px] text-on-surface-variant uppercase font-semibold mb-1">Attempt Progress</span>
<div className="flex gap-1">
<div className="w-2 h-2 rounded-full bg-primary"></div>
<div className="w-2 h-2 rounded-full border border-outline-variant"></div>
<div className="w-2 h-2 rounded-full border border-outline-variant"></div>
<div className="w-2 h-2 rounded-full border border-outline-variant"></div>
<div className="w-2 h-2 rounded-full border border-outline-variant"></div>
</div>
</div>
</div>
</div>

<div className="zebra-stripe p-md cursor-pointer border-b border-outline-variant hover:bg-primary-container/10 transition-colors">
<div className="flex justify-between items-start mb-sm">
<div>
<div className="flex items-center gap-xs">
<h3 className="font-bold text-body-lg">Mahesh Dhabha</h3>
<span className="bg-secondary-container text-on-secondary-container text-[10px] px-xs py-0.5 rounded uppercase font-bold">Dhabha</span>
</div>
<p className="text-body-sm text-on-surface-variant font-mono-data">TMID: 772199</p>
</div>
</div>
<div className="flex items-center justify-between">
<div className="flex flex-col">
<span className="text-[11px] text-on-surface-variant uppercase font-semibold">City</span>
<span className="text-body-md">Raipur, CG</span>
</div>
<div className="flex flex-col items-end">
<span className="text-[11px] text-on-surface-variant uppercase font-semibold mb-1">Attempt Progress</span>
<div className="flex gap-1">
<div className="w-2 h-2 rounded-full border border-outline-variant"></div>
<div className="w-2 h-2 rounded-full border border-outline-variant"></div>
<div className="w-2 h-2 rounded-full border border-outline-variant"></div>
<div className="w-2 h-2 rounded-full border border-outline-variant"></div>
<div className="w-2 h-2 rounded-full border border-outline-variant"></div>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="w-[55%] flex flex-col bg-surface overflow-y-auto">
<div className="p-lg space-y-lg">

<div className="bg-surface-container-lowest p-md border border-outline-variant rounded-lg flex items-start gap-md">
<div className="w-16 h-16 rounded-xl bg-primary-container/20 flex items-center justify-center text-primary">
<span className="material-symbols-outlined text-[32px]">engineering</span>
</div>
<div className="flex-1">
<div className="flex items-center justify-between">
<h2 className="text-headline-md font-headline-md text-on-surface">Rajesh Kumar</h2>
<span className="bg-on-primary-container text-primary-fixed-dim px-sm py-1 rounded text-[11px] font-bold flex items-center gap-xs">
<span className="material-symbols-outlined text-[14px]">verified</span> SUBSCRIBED
                            </span>
</div>
<div className="grid grid-cols-2 gap-md mt-sm">
<div className="flex items-center gap-xs text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]">call</span> +91 98765 43210
                            </div>
<div className="flex items-center gap-xs text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]">location_on</span> Namakkal Hub, Tamil Nadu
                            </div>
</div>
</div>
</div>

<div className="space-y-sm">
<h3 className="font-label-md text-label-md text-on-surface-variant uppercase">Attempt Lifecycle (5-Attempt Cycle)</h3>
<div className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="p-sm font-label-md text-label-md">Schedule</th>
<th className="p-sm font-label-md text-label-md">Status</th>
<th className="p-sm font-label-md text-label-md">Outcomes / Recommendation</th>
</tr>
</thead>
<tbody className="text-body-md">
<tr className="border-b border-outline-variant bg-primary-container/5">
<td className="p-sm font-bold">Day 1</td>
<td className="p-sm"><span className="text-primary font-bold flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span> Completed</span></td>
<td className="p-sm text-on-surface-variant">Interested. Asked to call back after discussing with drivers.</td>
</tr>
<tr className="border-b border-outline-variant">
<td className="p-sm font-bold">Day 2</td>
<td className="p-sm"><span className="text-tertiary font-bold flex items-center gap-xs"><span className="material-symbols-outlined text-[18px]">pending</span> Upcoming</span></td>
<td className="p-sm"><span className="bg-secondary-container text-on-secondary-container px-xs py-1 rounded text-[11px] font-bold">Day 2 script recommended</span></td>
</tr>
<tr className="border-b border-outline-variant text-on-surface-variant/50">
<td className="p-sm">Day 4</td>
<td className="p-sm">Scheduled</td>
<td className="p-sm">-</td>
</tr>
<tr className="border-b border-outline-variant text-on-surface-variant/50">
<td className="p-sm">Day 6</td>
<td className="p-sm">Scheduled</td>
<td className="p-sm">-</td>
</tr>
<tr className="text-on-surface-variant/50">
<td className="p-sm">Day 7</td>
<td className="p-sm">Scheduled</td>
<td className="p-sm">-</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="grid grid-cols-2 gap-lg">

<div className="p-md bg-surface-container-lowest border border-outline-variant rounded-lg">
<div className="flex items-center justify-between mb-md">
<h3 className="font-label-md text-label-md text-primary">Network Tracker</h3>
<span className="text-headline-md font-bold text-on-surface">₹300 <span className="text-body-sm font-normal text-on-surface-variant">Bonus</span></span>
</div>
<div className="space-y-sm">
<div className="flex justify-between text-body-sm font-bold">
<span>7/10 Drivers Onboarded</span>
<span className="text-primary">70%</span>
</div>
<div className="w-full h-3 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary transition-all duration-1000" style={{"width": "70%"}}></div>
</div>
<p className="text-[11px] text-on-surface-variant">Onboard 3 more drivers to unlock the monthly bonus.</p>
</div>
</div>

<div className="p-md bg-primary-container/10 border border-primary-container/30 rounded-lg">
<h3 className="font-label-md text-label-md text-primary mb-md">Commission Calculator</h3>
<div className="space-y-sm">
<div className="flex flex-col gap-1">
<label className="text-[11px] font-bold text-on-surface-variant uppercase">Expected Drivers</label>
<input className="bg-surface border-outline-variant rounded p-sm text-body-md focus:ring-primary focus:border-primary" id="calc_drivers" type="number" value="15"/>
</div>
<div className="flex flex-col gap-1">
<label className="text-[11px] font-bold text-on-surface-variant uppercase">Placements / Month</label>
<input className="bg-surface border-outline-variant rounded p-sm text-body-md focus:ring-primary focus:border-primary" id="calc_placements" type="number" value="4"/>
</div>
<div className="mt-md pt-md border-t border-primary-container/30">
<p className="text-body-md font-bold text-primary" id="calc_result">₹100 x 60 = ₹6,000/month potential</p>
</div>
</div>
</div>
</div>
</div>

<div className="mt-auto p-lg bg-surface-container border-t border-outline-variant flex items-center gap-md">
<button className="flex-1 bg-primary text-on-primary h-12 rounded-lg font-bold flex items-center justify-center gap-sm hover:opacity-90 transition-opacity">
<span className="material-symbols-outlined" style={{"fontVariationSettings": "\'FILL\' 1"}}>call</span> Call Now
                </button>
<button className="flex-1 bg-surface-container-lowest border border-[#25D366] text-[#25D366] h-12 rounded-lg font-bold flex items-center justify-center gap-sm hover:bg-[#25D366]/5 transition-colors">
<span className="material-symbols-outlined">chat</span> Send WhatsApp
                </button>
<button className="flex-1 bg-surface-container-lowest border border-primary text-primary h-12 rounded-lg font-bold flex items-center justify-center gap-sm hover:bg-primary/5 transition-colors">
<span className="material-symbols-outlined">event</span> Schedule Attempt
                </button>
</div>
</section>
</main>
  );
};

export default PartnerQueueDetail;
