import React from 'react';

export const MmDriverBank: React.FC = () => {
  return (
    <main className=" p-margin-desktop min-h-screen">

<section className="flex justify-between items-end mb-lg">
<div>
<h2 className="font-display-lg text-display-lg text-on-background mb-xs">Driver Bank</h2>
<p className="text-on-surface-variant font-body-md">Personalized shortlist of high-intent candidates for active matching.</p>
</div>
<div className="flex gap-md">
<button className="flex items-center gap-sm px-lg py-md border border-outline text-on-surface font-bold rounded-lg hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined">filter_list</span>
<span>Filter</span>
</button>
<a className="flex items-center gap-sm px-lg py-md bg-accent-purple text-white font-bold rounded-lg shadow-lg hover:opacity-90 transition-all active:scale-95" href="#">
<span className="material-symbols-outlined">person_add</span>
<span>Add Driver</span>
</a>
</div>
</section>

<section className="grid grid-cols-12 gap-lg mb-xl">
<div className="col-span-4 bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-32 relative overflow-hidden">
<div className="z-10">
<span className="text-on-surface-variant font-label-md uppercase tracking-wider text-[10px]">Total Banked</span>
<h3 className="text-display-lg font-display-lg leading-none mt-xs">124</h3>
</div>
<div className="absolute -right-4 -bottom-4 opacity-10">
<span className="material-symbols-outlined text-[120px]">account_balance_wallet</span>
</div>
</div>
<div className="col-span-4 bg-surface-container-lowest border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-32 relative overflow-hidden">
<div className="z-10">
<span className="text-accent-purple font-label-md uppercase tracking-wider text-[10px]">Platinum Verified</span>
<h3 className="text-display-lg font-display-lg leading-none mt-xs">48</h3>
</div>
<div className="absolute -right-4 -bottom-4 opacity-10 text-accent-purple">
<span className="material-symbols-outlined text-[120px]">verified</span>
</div>
</div>
<div className="col-span-4 bg-secondary-container border border-outline-variant p-lg rounded-xl flex flex-col justify-between h-32 relative overflow-hidden">
<div className="z-10">
<span className="text-on-secondary-container font-label-md uppercase tracking-wider text-[10px]">Avg. Last Contacted</span>
<h3 className="text-display-lg font-display-lg leading-none mt-xs">2.4d</h3>
</div>
<div className="absolute -right-4 -bottom-4 opacity-10 text-on-secondary-container">
<span className="material-symbols-outlined text-[120px]">schedule</span>
</div>
</div>
</section>

<section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
<div className="overflow-x-auto custom-scrollbar">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-low border-b border-outline-variant">
<tr>
<th className="p-md font-label-md text-on-surface-variant">Driver Name</th>
<th className="p-md font-label-md text-on-surface-variant">TMID</th>
<th className="p-md font-label-md text-on-surface-variant">Plan Tier</th>
<th className="p-md font-label-md text-on-surface-variant">City</th>
<th className="p-md font-label-md text-on-surface-variant">Preferred Routes</th>
<th className="p-md font-label-md text-on-surface-variant">Notes</th>
<th className="p-md font-label-md text-on-surface-variant">Last Contacted</th>
<th className="p-md font-label-md text-on-surface-variant text-center">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="driver-card-hover transition-colors">
<td className="p-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold text-xs">RK</div>
<span className="font-bold text-on-background">Rajesh Kumar</span>
</div>
</td>
<td className="p-md font-mono-data text-on-surface-variant">TM-90821</td>
<td className="p-md">
<span className="px-2 py-0.5 rounded-sm bg-accent-purple/10 text-accent-purple font-label-md text-[10px] uppercase">Platinum Elite</span>
</td>
<td className="p-md text-on-surface-variant">Ahmedabad, GJ</td>
<td className="p-md">
<div className="flex flex-wrap gap-xs">
<span className="bg-surface-variant px-xs py-[2px] rounded text-[10px]">Short Haul</span>
<span className="bg-surface-variant px-xs py-[2px] rounded text-[10px]">Local</span>
</div>
</td>
<td className="p-md">
<input className="editable-note bg-transparent border-none p-1 text-body-sm w-full italic text-on-surface-variant rounded-sm" type="text" value="Wants return loads only"/>
</td>
<td className="p-md text-body-sm">2 hours ago</td>
<td className="p-md">
<div className="flex items-center justify-center gap-sm">
<div className="relative group">
<button className="flex items-center gap-1 bg-surface-variant text-on-surface font-label-md px-3 py-1.5 rounded-lg hover:bg-outline-variant transition-colors">
<span>Add to Job</span>
<span className="material-symbols-outlined text-sm">expand_more</span>
</button>

<div className="hidden group-hover:block absolute right-0 top-full mt-1 w-48 bg-surface-container-lowest border border-outline-variant shadow-xl z-50 rounded-lg p-2">
<a className="block p-2 hover:bg-surface-variant rounded text-xs" href="#">RJ-09 High Speed Cargo</a>
<a className="block p-2 hover:bg-surface-variant rounded text-xs" href="#">Coal Transport MH-44</a>
<div className="border-t border-outline-variant my-1"></div>
<a className="block p-2 text-primary font-bold text-xs" href="#">+ New Job</a>
</div>
</div>
<button className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">delete</button>
</div>
</td>
</tr>

<tr className="driver-card-hover transition-colors">
<td className="p-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center text-secondary font-bold text-xs">AS</div>
<span className="font-bold text-on-background">Amit Sharma</span>
</div>
</td>
<td className="p-md font-mono-data text-on-surface-variant">TM-11234</td>
<td className="p-md">
<span className="px-2 py-0.5 rounded-sm bg-primary/10 text-primary font-label-md text-[10px] uppercase">Standard</span>
</td>
<td className="p-md text-on-surface-variant">Indore, MP</td>
<td className="p-md">
<div className="flex flex-wrap gap-xs">
<span className="bg-surface-variant px-xs py-[2px] rounded text-[10px]">Long Haul</span>
</div>
</td>
<td className="p-md">
<input className="editable-note bg-transparent border-none p-1 text-body-sm w-full italic text-on-surface-variant rounded-sm" type="text" value="Preference for 12-wheelers"/>
</td>
<td className="p-md text-body-sm">Yesterday</td>
<td className="p-md">
<div className="flex items-center justify-center gap-sm">
<div className="relative group">
<button className="flex items-center gap-1 bg-surface-variant text-on-surface font-label-md px-3 py-1.5 rounded-lg hover:bg-outline-variant transition-colors">
<span>Add to Job</span>
<span className="material-symbols-outlined text-sm">expand_more</span>
</button>
</div>
<button className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">delete</button>
</div>
</td>
</tr>

<tr className="driver-card-hover transition-colors">
<td className="p-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold text-xs">VP</div>
<span className="font-bold text-on-background">Vikram Pratap</span>
</div>
</td>
<td className="p-md font-mono-data text-on-surface-variant">TM-44212</td>
<td className="p-md">
<span className="px-2 py-0.5 rounded-sm bg-accent-purple/10 text-accent-purple font-label-md text-[10px] uppercase">Platinum</span>
</td>
<td className="p-md text-on-surface-variant">Gurgaon, HR</td>
<td className="p-md">
<div className="flex flex-wrap gap-xs">
<span className="bg-surface-variant px-xs py-[2px] rounded text-[10px]">Interstate</span>
<span className="bg-surface-variant px-xs py-[2px] rounded text-[10px]">Cold Storage</span>
</div>
</td>
<td className="p-md">
<input className="editable-note bg-transparent border-none p-1 text-body-sm w-full italic text-on-surface-variant rounded-sm" type="text" value="Needs reefer certification renewal"/>
</td>
<td className="p-md text-body-sm">Oct 24, 2023</td>
<td className="p-md">
<div className="flex items-center justify-center gap-sm">
<div className="relative group">
<button className="flex items-center gap-1 bg-surface-variant text-on-surface font-label-md px-3 py-1.5 rounded-lg hover:bg-outline-variant transition-colors">
<span>Add to Job</span>
<span className="material-symbols-outlined text-sm">expand_more</span>
</button>
</div>
<button className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">delete</button>
</div>
</td>
</tr>

<tr className="driver-card-hover transition-colors">
<td className="p-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-surface-variant flex items-center justify-center text-on-surface-variant font-bold text-xs">SK</div>
<span className="font-bold text-on-background">Sandeep Kaur</span>
</div>
</td>
<td className="p-md font-mono-data text-on-surface-variant">TM-55671</td>
<td className="p-md">
<span className="px-2 py-0.5 rounded-sm bg-primary/10 text-primary font-label-md text-[10px] uppercase">Standard</span>
</td>
<td className="p-md text-on-surface-variant">Ludhiana, PB</td>
<td className="p-md">
<div className="flex flex-wrap gap-xs">
<span className="bg-surface-variant px-xs py-[2px] rounded text-[10px]">Express Haul</span>
</div>
</td>
<td className="p-md">
<input className="editable-note bg-transparent border-none p-1 text-body-sm w-full italic text-on-surface-variant rounded-sm" type="text" value="Reliable for fragile cargo"/>
</td>
<td className="p-md text-body-sm">3 days ago</td>
<td className="p-md">
<div className="flex items-center justify-center gap-sm">
<div className="relative group">
<button className="flex items-center gap-1 bg-surface-variant text-on-surface font-label-md px-3 py-1.5 rounded-lg hover:bg-outline-variant transition-colors">
<span>Add to Job</span>
<span className="material-symbols-outlined text-sm">expand_more</span>
</button>
</div>
<button className="material-symbols-outlined text-on-surface-variant hover:text-error transition-colors">delete</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

<div className="p-md bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
<span className="text-body-sm text-on-surface-variant">Showing 4 of 124 saved drivers</span>
<div className="flex gap-sm">
<button className="p-1 rounded hover:bg-surface-variant disabled:opacity-30" disabled>
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="px-3 py-1 bg-primary text-white rounded text-sm font-bold">1</button>
<button className="px-3 py-1 hover:bg-surface-variant rounded text-sm">2</button>
<button className="px-3 py-1 hover:bg-surface-variant rounded text-sm">3</button>
<button className="p-1 rounded hover:bg-surface-variant">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</section>

<section className="mt-xl grid grid-cols-12 gap-lg">
<div className="col-span-8 bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<div className="flex justify-between items-center mb-md">
<h3 className="font-headline-sm text-headline-sm">Market Trend for Saved Routes</h3>
<button className="text-primary font-bold text-xs uppercase hover:underline">View Analytics</button>
</div>
<div className="h-48 w-full bg-surface-container-low rounded-lg relative flex items-end px-lg pb-lg gap-lg">

<div className="flex-1 bg-primary/20 rounded-t-lg relative group h-[40%]" title="DL-GJ">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">DL-GJ</div>
</div>
<div className="flex-1 bg-accent-purple/40 rounded-t-lg relative group h-[75%]" title="MH-KA">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">MH-KA</div>
</div>
<div className="flex-1 bg-primary/40 rounded-t-lg relative group h-[60%]" title="HR-UP">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">HR-UP</div>
</div>
<div className="flex-1 bg-accent-purple/20 rounded-t-lg relative group h-[90%]" title="GJ-DL">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">GJ-DL</div>
</div>
<div className="flex-1 bg-primary/30 rounded-t-lg relative group h-[50%]" title="KA-MH">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold">KA-MH</div>
</div>
</div>
<p className="mt-md text-body-sm text-on-surface-variant italic">Supply in MH-KA routes is up 12% this week. Consider prioritizing these drivers for high-value contracts.</p>
</div>
<div className="col-span-4 bg-accent-purple text-white p-lg rounded-xl shadow-xl flex flex-col justify-between">
<div>
<div className="flex items-center gap-sm mb-sm">
<span className="material-symbols-outlined" style={{"fontVariationSettings": "\'FILL\' 1"}}>bolt</span>
<span className="font-label-md uppercase tracking-widest text-[10px]">AI Matchmaker</span>
</div>
<h4 className="font-headline-sm text-headline-sm leading-tight">High Matching Probability</h4>
<p className="mt-sm text-white/80 text-sm">3 drivers in your bank exactly match the "Chemical Transport" requirements for Job #8821.</p>
</div>
<button className="mt-lg w-full bg-white text-accent-purple font-bold py-md rounded-lg hover:bg-opacity-90 transition-all flex items-center justify-center gap-sm">
                    Review Matches
                    <span className="material-symbols-outlined">arrow_forward</span>
</button>
</div>
</section>
</main>
  );
};

export default MmDriverBank;
