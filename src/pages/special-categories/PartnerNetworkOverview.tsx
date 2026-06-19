import React from 'react';

export const PartnerNetworkOverview: React.FC = () => {
  return (
    <main className="p-gutter md:p-xl min-h-[calc(100vh-64px)]">

<div className="mb-lg">
<h1 className="font-headline-lg text-headline-lg text-on-surface mb-xs">Network Overview</h1>
<p className="text-on-surface-variant text-body-md">Real-time health monitoring of dispatchers, associates, and network clusters.</p>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-xl">

<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-lg flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-sm">
<span className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">Total Active Drivers</span>
<span className="material-symbols-outlined text-primary">local_shipping</span>
</div>
<div className="text-headline-lg font-headline-lg text-on-surface">14,282</div>
</div>
<div className="mt-md flex items-center gap-xs">
<span className="text-primary font-bold text-body-sm">↑ 12%</span>
<span className="text-on-surface-variant text-body-sm">vs last month</span>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-lg flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-sm">
<span className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">High-Volume Partners (≥10)</span>
<span className="material-symbols-outlined text-tertiary">groups</span>
</div>
<div className="text-headline-lg font-headline-lg text-on-surface">342</div>
</div>
<div className="mt-md flex items-center gap-xs">
<span className="text-on-surface-variant text-body-sm">Active FM/Assoc Clusters</span>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-lg rounded-lg flex flex-col justify-between relative overflow-hidden">
<div className="relative z-10">
<div className="flex items-center justify-between mb-sm">
<span className="text-on-surface-variant font-label-md text-label-md uppercase tracking-wider">Commissions Paid (MTD)</span>
<span className="material-symbols-outlined text-primary">payments</span>
</div>
<div className="text-headline-lg font-headline-lg text-on-surface font-mono-data">₹12,45,200</div>
</div>
<div className="mt-md flex items-center gap-xs relative z-10">
<span className="text-on-surface-variant text-body-sm">Payout efficiency: 98.2%</span>
</div>

<div className="absolute -right-4 -bottom-4 opacity-10">
<span className="material-symbols-outlined text-[80px]">trending_up</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-t-lg p-md flex flex-wrap items-center justify-between gap-md">
<div className="flex items-center gap-sm">
<button className="flex items-center gap-xs px-sm py-2 bg-surface-container-high border border-outline-variant rounded text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-[18px]">filter_list</span> Filters
                </button>
<button className="flex items-center gap-xs px-sm py-2 bg-surface-container-high border border-outline-variant rounded text-label-md font-label-md text-on-surface-variant hover:bg-surface-container-highest transition-colors">
<span className="material-symbols-outlined text-[18px]">sort</span> Sort
                </button>
<div className="h-6 w-px bg-outline-variant mx-xs"></div>
<div className="flex items-center gap-base">
<span className="bg-primary/10 text-primary text-[11px] px-2 py-0.5 rounded-full font-bold uppercase">All Network</span>
<span className="text-on-surface-variant text-[11px] px-2 py-0.5 rounded-full font-bold uppercase cursor-pointer hover:bg-surface-container">Tier 1 Only</span>
</div>
</div>
<div className="flex items-center gap-sm">
<button className="text-primary text-label-md font-label-md hover:underline">Export CSV</button>
<button className="bg-primary text-on-primary px-md py-2 rounded font-label-md text-label-md">Apply Bulk Action</button>
</div>
</div>

<div className="bg-surface-container-lowest border-x border-b border-outline-variant rounded-b-lg overflow-x-auto">
<table className="w-full text-left zebra-stripe min-w-[1000px]">
<thead>
<tr className="bg-surface-container border-b border-outline-variant">
<th className="px-md py-3 font-label-md text-label-md text-on-surface-variant">TMID</th>
<th className="px-md py-3 font-label-md text-label-md text-on-surface-variant">Partner Name</th>
<th className="px-md py-3 font-label-md text-label-md text-on-surface-variant">Type</th>
<th className="px-md py-3 font-label-md text-label-md text-on-surface-variant">Subscribed Since</th>
<th className="px-md py-3 font-label-md text-label-md text-on-surface-variant">Drivers</th>
<th className="px-md py-3 font-label-md text-label-md text-on-surface-variant">Placements</th>
<th className="px-md py-3 font-label-md text-label-md text-on-surface-variant text-right">Commission (₹)</th>
<th className="px-md py-3 font-label-md text-label-md text-on-surface-variant">Last Activity</th>
<th className="px-md py-3 font-label-md text-label-md text-on-surface-variant text-center">Action</th>
</tr>
</thead>
<tbody className="text-body-md divide-y divide-outline-variant/30">

<tr>
<td className="px-md py-4 font-mono-data text-primary">TM-4021</td>
<td className="px-md py-4">
<div className="flex items-center gap-xs">
<span className="font-bold text-on-surface">Arjun Logistics</span>
<span className="material-symbols-outlined text-[14px] text-tertiary" style={{"fontVariationSettings": "\'FILL\' 1"}}>verified</span>
</div>
</td>
<td className="px-md py-4"><span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[11px] font-bold">ASSOCIATE</span></td>
<td className="px-md py-4 text-on-surface-variant">12 Oct 2023</td>
<td className="px-md py-4 font-semibold">142</td>
<td className="px-md py-4">892</td>
<td className="px-md py-4 text-right font-mono-data">1,24,000</td>
<td className="px-md py-4 text-on-surface-variant">2 mins ago</td>
<td className="px-md py-4 text-center"><button className="material-symbols-outlined text-outline hover:text-primary">more_vert</button></td>
</tr>

<tr>
<td className="px-md py-4 font-mono-data text-primary">TM-5510</td>
<td className="px-md py-4"><span className="font-bold text-on-surface">Vikas K. Sharma</span></td>
<td className="px-md py-4"><span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full text-[11px] font-bold uppercase">Field Manager</span></td>
<td className="px-md py-4 text-on-surface-variant">04 Jan 2024</td>
<td className="px-md py-4 font-semibold">18</td>
<td className="px-md py-4">42</td>
<td className="px-md py-4 text-right font-mono-data">12,500</td>
<td className="px-md py-4 text-on-surface-variant">1 hour ago</td>
<td className="px-md py-4 text-center"><button className="material-symbols-outlined text-outline hover:text-primary">more_vert</button></td>
</tr>

<tr>
<td className="px-md py-4 font-mono-data text-primary">TM-1192</td>
<td className="px-md py-4"><span className="font-bold text-on-surface">Northstar Hubs</span></td>
<td className="px-md py-4"><span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[11px] font-bold">ASSOCIATE</span></td>
<td className="px-md py-4 text-on-surface-variant">18 Nov 2022</td>
<td className="px-md py-4 font-semibold">510</td>
<td className="px-md py-4">3,142</td>
<td className="px-md py-4 text-right font-mono-data">4,82,900</td>
<td className="px-md py-4 text-on-surface-variant">Active now</td>
<td className="px-md py-4 text-center"><button className="material-symbols-outlined text-outline hover:text-primary">more_vert</button></td>
</tr>

<tr>
<td className="px-md py-4 font-mono-data text-primary">TM-6602</td>
<td className="px-md py-4"><span className="font-bold text-on-surface">Priya Deshmukh</span></td>
<td className="px-md py-4"><span className="bg-surface-variant text-on-surface-variant px-2 py-0.5 rounded-full text-[11px] font-bold uppercase">Field Manager</span></td>
<td className="px-md py-4 text-on-surface-variant">22 Feb 2024</td>
<td className="px-md py-4 font-semibold">4</td>
<td className="px-md py-4">12</td>
<td className="px-md py-4 text-right font-mono-data">3,200</td>
<td className="px-md py-4 text-on-surface-variant">Yesterday</td>
<td className="px-md py-4 text-center"><button className="material-symbols-outlined text-outline hover:text-primary">more_vert</button></td>
</tr>

<tr>
<td className="px-md py-4 font-mono-data text-primary">TM-9003</td>
<td className="px-md py-4"><span className="font-bold text-on-surface">Global Transit Solutions</span></td>
<td className="px-md py-4"><span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[11px] font-bold">ASSOCIATE</span></td>
<td className="px-md py-4 text-on-surface-variant">15 May 2023</td>
<td className="px-md py-4 font-semibold">82</td>
<td className="px-md py-4">421</td>
<td className="px-md py-4 text-right font-mono-data">92,400</td>
<td className="px-md py-4 text-on-surface-variant">Active now</td>
<td className="px-md py-4 text-center"><button className="material-symbols-outlined text-outline hover:text-primary">more_vert</button></td>
</tr>
</tbody>
</table>
</div>

<div className="mt-md flex items-center justify-between">
<span className="text-body-sm text-on-surface-variant">Showing 1 to 5 of 342 entries</span>
<div className="flex items-center gap-base">
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant bg-surface-container-low text-on-surface-variant cursor-not-allowed">
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-primary bg-primary text-on-primary text-body-sm font-bold">1</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high text-body-sm">2</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high text-body-sm">3</button>
<span className="px-2">...</span>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high text-body-sm">69</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container-high text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>

<div className="fixed bottom-gutter right-gutter z-40 max-w-sm w-full">
<div className="interactive-calculator rounded-lg shadow-xl p-md">
<div className="flex items-center justify-between mb-sm border-b border-primary/20 pb-base">
<span className="font-bold text-primary flex items-center gap-xs">
<span className="material-symbols-outlined text-[18px]">calculate</span> Network Estimator
                    </span>
<button className="material-symbols-outlined text-primary hover:bg-primary/10 rounded-full" >close</button>
</div>
<div className="space-y-sm">
<div className="flex justify-between items-center">
<span className="text-body-sm text-on-primary-container">Target Placement Payout</span>
<input className="w-20 px-2 py-1 bg-surface-container-lowest border border-primary/30 rounded text-right font-mono-data" type="number" value="150"/>
</div>
<div className="flex justify-between items-center">
<span className="text-body-sm text-on-primary-container">Driver Conversion Rate (%)</span>
<input className="w-20 px-2 py-1 bg-surface-container-lowest border border-primary/30 rounded text-right font-mono-data" type="number" value="4.5"/>
</div>
<div className="bg-primary/10 p-sm rounded border border-primary/20 mt-md">
<div className="text-[11px] uppercase font-bold text-on-primary-fixed-variant">Est. Project Commission</div>
<div className="text-headline-md font-headline-md text-primary font-mono-data">₹5,44,250</div>
</div>
</div>
</div>
</div>
</main>
  );
};

export default PartnerNetworkOverview;
