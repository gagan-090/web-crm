import React from 'react';

export const ThReActivationManager: React.FC = () => {
  return (
    <main className="md:ml-64 mt-16 p-lg bg-background min-h-screen">

<div className="mb-lg flex flex-col md:flex-row md:items-end justify-between gap-md">
<div>
<h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Re-activation Manager</h1>
<p className="font-body-md text-body-md text-on-surface-variant">Manage and recover dormant logistical partners for peak-period readiness.</p>
</div>

<div className="bg-tertiary-fixed border border-tertiary-container p-md rounded-xl flex items-center gap-md max-w-sm">
<div className="w-10 h-10 bg-tertiary text-on-tertiary rounded-full flex items-center justify-center shrink-0">
<span className="material-symbols-outlined" style={{"fontVariationSettings": "\'FILL\' 1"}}>campaign</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-tertiary-fixed">Seasonal Trigger</p>
<p className="font-body-sm text-body-sm text-on-tertiary-fixed-variant">Festival season — driver demand high. Prioritize long-distance leads.</p>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl mb-lg">
<div className="flex justify-between items-center mb-md">
<h3 className="font-label-md text-label-md text-on-surface uppercase tracking-widest">Active Focused Lead: <span className="text-primary">RK Logistics (TM-8902)</span></h3>
<span className="text-body-sm font-mono-data text-outline">Current Cycle: Attempt 3/5</span>
</div>
<div className="flex items-center gap-base">
<div className="flex flex-col items-center gap-xs">
<div className="w-8 h-8 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">check</span>
</div>
<span className="text-[10px] text-outline font-bold">Call 1</span>
</div>
<div className="stepper-line active"></div>
<div className="flex flex-col items-center gap-xs">
<div className="w-8 h-8 rounded-full bg-tertiary text-on-tertiary flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">priority_high</span>
</div>
<span className="text-[10px] text-outline font-bold">Call 2</span>
</div>
<div className="stepper-line active"></div>
<div className="flex flex-col items-center gap-xs">
<div className="w-8 h-8 rounded-full border-2 border-primary-container flex items-center justify-center pulse-teal">
<div className="w-3 h-3 bg-primary rounded-full"></div>
</div>
<span className="text-[10px] text-primary font-bold">Call 3</span>
</div>
<div className="stepper-line"></div>
<div className="flex flex-col items-center gap-xs">
<div className="w-8 h-8 rounded-full border-2 border-outline-variant flex items-center justify-center"></div>
<span className="text-[10px] text-outline font-bold">Call 4</span>
</div>
<div className="stepper-line"></div>
<div className="flex flex-col items-center gap-xs">
<div className="w-8 h-8 rounded-full border-2 border-outline-variant flex items-center justify-center"></div>
<span className="text-[10px] text-outline font-bold">Call 5</span>
</div>
</div>
</div>

<div className="grid grid-cols-12 gap-lg">

<div className="col-span-12 lg:col-span-9">
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
<div className="p-md bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary">groups</span>
<h2 className="font-headline-md text-headline-md">Cold Leads Queue</h2>
<span className="bg-primary-container text-on-primary-container text-[11px] px-2 py-0.5 rounded-full font-bold">24 Leads Pending</span>
</div>
<div className="flex items-center gap-sm">
<button className="flex items-center gap-xs px-md py-2 border border-primary text-primary font-label-md text-label-md rounded-lg hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined text-[20px]">checklist</span> Bulk Action
                            </button>
<button className="flex items-center gap-xs px-md py-2 text-on-surface-variant font-label-md text-label-md hover:bg-surface-container rounded-lg">
<span className="material-symbols-outlined text-[20px]">filter_list</span> Filter
                            </button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead>
<tr className="bg-surface-container-high border-b border-outline-variant">
<th className="px-md py-3 text-left w-12"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></th>
<th className="px-md py-3 text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Partner Name</th>
<th className="px-md py-3 text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">TMID</th>
<th className="px-md py-3 text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Type</th>
<th className="px-md py-3 text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Cold Since</th>
<th className="px-md py-3 text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Re-activation</th>
<th className="px-md py-3 text-left font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Reason</th>
<th className="px-md py-3 text-right font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Action</th>
</tr>
</thead>
<tbody className="text-body-md text-on-surface">

<tr className="zebra-row hover:bg-primary-container/10 transition-colors border-b border-outline-variant">
<td className="px-md py-4"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></td>
<td className="px-md py-4 font-bold">Bharat Carriers</td>
<td className="px-md py-4 font-mono-data text-outline">TM-4521</td>
<td className="px-md py-4">
<span className="px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded text-[11px] font-bold">Fleet Owner</span>
</td>
<td className="px-md py-4 text-outline">Aug 15, 2023</td>
<td className="px-md py-4 font-bold text-primary">Oct 24, 2023</td>
<td className="px-md py-4 text-on-surface-variant text-body-sm">Rate mismatch</td>
<td className="px-md py-4 text-right">
<button className="bg-primary text-on-primary px-4 py-1.5 rounded font-label-md text-label-md shadow-sm hover:bg-opacity-90 transition-all active:scale-95">Start Re-activation</button>
</td>
</tr>

<tr className="zebra-row hover:bg-primary-container/10 transition-colors border-b border-outline-variant">
<td className="px-md py-4"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></td>
<td className="px-md py-4 font-bold">Patel &amp; Sons</td>
<td className="px-md py-4 font-mono-data text-outline">TM-9022</td>
<td className="px-md py-4">
<span className="px-2 py-1 bg-secondary-container text-on-secondary-container rounded text-[11px] font-bold">3PL Agent</span>
</td>
<td className="px-md py-4 text-outline">Jul 02, 2023</td>
<td className="px-md py-4 font-bold text-primary">Oct 26, 2023</td>
<td className="px-md py-4 text-on-surface-variant text-body-sm">Service quality</td>
<td className="px-md py-4 text-right">
<button className="bg-primary text-on-primary px-4 py-1.5 rounded font-label-md text-label-md shadow-sm hover:bg-opacity-90 transition-all active:scale-95">Start Re-activation</button>
</td>
</tr>

<tr className="zebra-row hover:bg-primary-container/10 transition-colors border-b border-outline-variant">
<td className="px-md py-4"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></td>
<td className="px-md py-4 font-bold">South Coast Trp</td>
<td className="px-md py-4 font-mono-data text-outline">TM-1183</td>
<td className="px-md py-4">
<span className="px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded text-[11px] font-bold">Single Driver</span>
</td>
<td className="px-md py-4 text-outline">Sep 10, 2023</td>
<td className="px-md py-4 font-bold text-primary">Nov 01, 2023</td>
<td className="px-md py-4 text-on-surface-variant text-body-sm">Inactivity</td>
<td className="px-md py-4 text-right">
<button className="bg-primary text-on-primary px-4 py-1.5 rounded font-label-md text-label-md shadow-sm hover:bg-opacity-90 transition-all active:scale-95">Start Re-activation</button>
</td>
</tr>

<tr className="zebra-row hover:bg-primary-container/10 transition-colors border-b border-outline-variant">
<td className="px-md py-4"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></td>
<td className="px-md py-4 font-bold">SpeedWay Logistics</td>
<td className="px-md py-4 font-mono-data text-outline">TM-7721</td>
<td className="px-md py-4">
<span className="px-2 py-1 bg-secondary-container text-on-secondary-container rounded text-[11px] font-bold">Fleet Owner</span>
</td>
<td className="px-md py-4 text-outline">Aug 30, 2023</td>
<td className="px-md py-4 font-bold text-primary">Oct 28, 2023</td>
<td className="px-md py-4 text-on-surface-variant text-body-sm">Payment delays</td>
<td className="px-md py-4 text-right">
<button className="bg-primary text-on-primary px-4 py-1.5 rounded font-label-md text-label-md shadow-sm hover:bg-opacity-90 transition-all active:scale-95">Start Re-activation</button>
</td>
</tr>

<tr className="zebra-row hover:bg-primary-container/10 transition-colors border-b border-outline-variant">
<td className="px-md py-4"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox"/></td>
<td className="px-md py-4 font-bold">Apex Freight</td>
<td className="px-md py-4 font-mono-data text-outline">TM-3349</td>
<td className="px-md py-4">
<span className="px-2 py-1 bg-surface-container-highest text-on-surface-variant rounded text-[11px] font-bold">3PL Agent</span>
</td>
<td className="px-md py-4 text-outline">May 15, 2023</td>
<td className="px-md py-4 font-bold text-primary">Oct 30, 2023</td>
<td className="px-md py-4 text-on-surface-variant text-body-sm">Platform complexity</td>
<td className="px-md py-4 text-right">
<button className="bg-primary text-on-primary px-4 py-1.5 rounded font-label-md text-label-md shadow-sm hover:bg-opacity-90 transition-all active:scale-95">Start Re-activation</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-md flex justify-between items-center bg-surface-container-lowest">
<span className="text-body-sm text-on-surface-variant">Showing 1 to 5 of 24 leads</span>
<div className="flex gap-xs">
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_left</span></button>
<button className="w-8 h-8 flex items-center justify-center bg-primary text-on-primary rounded font-bold">1</button>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-colors">2</button>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-colors">3</button>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[18px]">chevron_right</span></button>
</div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-3 space-y-lg">

<div className="bg-[#E8F8F5] border border-primary-container p-lg rounded-xl">
<div className="flex items-center gap-xs mb-md">
<span className="material-symbols-outlined text-primary">calculate</span>
<h4 className="font-label-md text-label-md text-on-primary-container uppercase tracking-wider">Recovery Forecast</h4>
</div>
<div className="space-y-md">
<div>
<label className="block text-body-sm text-on-primary-container font-bold mb-xs">Active leads selected</label>
<div className="text-headline-md font-headline-md text-primary">05 Partners</div>
</div>
<div className="h-px bg-primary-container/30"></div>
<div>
<label className="block text-body-sm text-on-primary-container font-bold mb-xs">Est. Re-activation ROI</label>
<div className="text-headline-lg text-primary font-extrabold tracking-tight">₹4,25,000<span className="text-body-sm font-normal ml-xs">/mo</span></div>
<p className="text-[10px] text-on-primary-container/70 mt-xs uppercase font-bold">* Based on historical trip volume</p>
</div>
<button className="w-full py-3 bg-primary text-on-primary rounded-lg font-bold shadow-md hover:shadow-lg transition-all active:translate-y-px">
                            Review Group Script
                        </button>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-md">Retention Insights</h4>
<div className="space-y-lg">
<div className="flex items-center justify-between">
<span className="text-body-sm">Avg. Cold Duration</span>
<span className="font-mono-data text-tertiary font-bold">54 Days</span>
</div>
<div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full" style={{"width": "65%"}}></div>
</div>
<p className="text-body-sm text-on-surface-variant italic">"Rate-related churn is up by 12% this quarter. Adjust scripts accordingly."</p>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-xl">
<h4 className="font-label-md text-label-md text-on-surface uppercase tracking-wider mb-md">Recent Recoveries</h4>
<div className="space-y-md">
<div className="flex gap-md">
<div className="w-1 bg-primary rounded"></div>
<div>
<p className="text-body-sm font-bold">MK Transport</p>
<p className="text-[11px] text-outline">Recovered by Agent 04 • 2h ago</p>
</div>
</div>
<div className="flex gap-md">
<div className="w-1 bg-primary rounded"></div>
<div>
<p className="text-body-sm font-bold">Global Movers</p>
<p className="text-[11px] text-outline">Recovered by Agent 01 • 5h ago</p>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
  );
};

export default ThReActivationManager;
