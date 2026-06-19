import React from 'react';

export const MmHomeDashboard: React.FC = () => {
  return (
    <main className=" pt-16 p-margin-desktop min-h-screen">

<div className="bento-grid">

<div className="col-span-12 lg:col-span-4 space-y-md">
<div className="bg-surface-container-low border border-outline-variant p-md rounded-xl flex items-center justify-between">
<div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Open Jobs Alert</p>
<h2 className="font-display-lg text-display-lg text-primary mt-xs">12 <span className="text-headline-sm font-normal text-on-surface-variant">Active</span></h2>
</div>
<div className="text-right">
<span className="text-error font-bold font-body-md block">3 in SLA Risk</span>
<span className="text-on-surface-variant text-body-sm">Immediate attention needed</span>
</div>
</div>

<div className="bg-error-container border border-error/20 p-md rounded-xl flex items-start gap-md animate-pulse">
<span className="material-symbols-outlined text-error text-[32px]" data-icon="warning">warning</span>
<div className="flex-1">
<div className="flex justify-between items-start">
<h3 className="font-headline-sm text-error font-bold">#ID-77210</h3>
<span className="bg-error text-white text-[10px] px-2 py-0.5 rounded font-bold">URGENT</span>
</div>
<p className="font-body-md text-on-error-container mt-xs">Super Premium — <span className="font-bold">1 day to breach</span></p>
<button className="mt-md w-full bg-error text-white font-bold py-2 rounded-lg hover:brightness-110 transition-all">
                            [Fill Now]
                        </button>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-5 grid grid-rows-2 gap-md">

<div className="bg-surface border border-outline-variant p-md rounded-xl">
<div className="flex justify-between items-end mb-sm">
<div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Placements This Month</p>
<p className="font-display-lg text-display-lg mt-xs">24 <span className="text-headline-sm text-on-surface-variant font-normal">of 55</span></p>
</div>
<span className="font-headline-sm text-brand-purple font-bold">43.6%</span>
</div>
<div className="w-full bg-secondary-container h-3 rounded-full overflow-hidden">
<div className="purple-accent-bg h-full rounded-full transition-all duration-1000 ease-out" style={{"width": "43.6%"}}></div>
</div>
</div>

<div className="bg-surface border border-outline-variant p-md rounded-xl flex items-center justify-between">
<div className="flex items-center gap-md">
<div className="w-14 h-14 rounded-full border-4 border-[#8E44AD] flex items-center justify-center">
<span className="font-bold text-brand-purple">91.7</span>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">SLA Compliance</p>
<p className="font-body-sm text-on-surface-variant">Avg. fulfillment time: 4.2h</p>
</div>
</div>
<div className="text-right">
<span className="text-primary font-bold block">+2.4%</span>
<span className="text-body-sm text-on-surface-variant">vs last month</span>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-3 space-y-md">

<div className="bg-surface-container border border-outline-variant p-md rounded-xl relative overflow-hidden">
<div className="relative z-10">
<p className="font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Driver Bank Status</p>
<h2 className="font-display-lg text-display-lg mt-xs">68 <span className="text-headline-sm text-on-surface-variant font-normal">Active</span></h2>
<div className="mt-md flex items-center gap-sm text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[16px]" data-icon="update">update</span>
<span>Updated today, 09:45 AM</span>
</div>
</div>
<span className="material-symbols-outlined absolute -bottom-4 -right-4 text-surface-variant text-[120px] opacity-40" data-icon="local_shipping" style={{"fontVariationSettings": "\'FILL\' 1"}}>local_shipping</span>
</div>

<div className="bg-primary-fixed border border-primary/20 p-md rounded-xl flex items-start gap-md">
<span className="material-symbols-outlined text-primary text-[24px]" data-icon="event_repeat">event_repeat</span>
<div>
<p className="font-body-md text-on-primary-fixed-variant leading-tight">
<span className="font-bold">Update your driver bank</span> before <span className="underline">12 PM</span> to ensure accurate matchmaking for PM shifts.
                        </p>
</div>
</div>
</div>

<div className="col-span-12 bg-surface border border-outline-variant rounded-xl overflow-hidden">
<div className="px-md py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low/50">
<h3 className="font-headline-sm text-headline-sm font-bold text-on-surface">My Assigned Jobs</h3>
<div className="flex gap-sm">
<button className="p-xs hover:bg-surface-variant rounded">
<span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
</button>
<button className="p-xs hover:bg-surface-variant rounded">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-variant/30 text-label-md text-on-surface-variant">
<tr>
<th className="px-md py-sm font-semibold uppercase">Job ID</th>
<th className="px-md py-sm font-semibold uppercase">Transporter</th>
<th className="px-md py-sm font-semibold uppercase">Plan</th>
<th className="px-md py-sm font-semibold uppercase text-center">Days Left</th>
<th className="px-md py-sm font-semibold uppercase text-center">Shortlisted</th>
<th className="px-md py-sm font-semibold uppercase">Status</th>
<th className="px-md py-sm font-semibold uppercase text-right">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-md py-md font-mono-data text-primary font-bold">#ID-77210</td>
<td className="px-md py-md font-body-md">LogiForce Pan-India</td>
<td className="px-md py-md">
<span className="bg-error-container text-error text-[10px] px-2 py-0.5 rounded font-bold">SUPER PREMIUM</span>
</td>
<td className="px-md py-md text-center text-error font-bold">1 Day</td>
<td className="px-md py-md text-center font-mono-data">0 / 4</td>
<td className="px-md py-md">
<span className="flex items-center gap-xs text-error">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span className="text-body-sm font-medium">Critical</span>
</span>
</td>
<td className="px-md py-md text-right">
<button className="text-brand-purple font-bold text-body-sm hover:underline">Match Drivers</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-md font-mono-data text-primary font-bold">#ID-77305</td>
<td className="px-md py-md font-body-md">RapidFreight Systems</td>
<td className="px-md py-md">
<span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded font-bold">PREMIUM</span>
</td>
<td className="px-md py-md text-center font-bold">4 Days</td>
<td className="px-md py-md text-center font-mono-data">3 / 5</td>
<td className="px-md py-md">
<span className="flex items-center gap-xs text-primary">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="text-body-sm font-medium">In Progress</span>
</span>
</td>
<td className="px-md py-md text-right">
<button className="text-brand-purple font-bold text-body-sm hover:underline">View Progress</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-md font-mono-data text-primary font-bold">#ID-77341</td>
<td className="px-md py-md font-body-md">SwiftLine Logistics</td>
<td className="px-md py-md">
<span className="bg-outline-variant text-on-surface-variant text-[10px] px-2 py-0.5 rounded font-bold">STANDARD</span>
</td>
<td className="px-md py-md text-center font-bold">6 Days</td>
<td className="px-md py-md text-center font-mono-data">1 / 2</td>
<td className="px-md py-md">
<span className="flex items-center gap-xs text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-outline"></span>
<span className="text-body-sm font-medium">Draft</span>
</span>
</td>
<td className="px-md py-md text-right">
<button className="text-brand-purple font-bold text-body-sm hover:underline">Edit</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-md font-mono-data text-primary font-bold">#ID-77299</td>
<td className="px-md py-md font-body-md">Global Haulage Ltd</td>
<td className="px-md py-md">
<span className="bg-secondary-container text-on-secondary-container text-[10px] px-2 py-0.5 rounded font-bold">PREMIUM</span>
</td>
<td className="px-md py-md text-center font-bold">2 Days</td>
<td className="px-md py-md text-center font-mono-data">5 / 5</td>
<td className="px-md py-md">
<span className="flex items-center gap-xs text-tertiary">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<span className="text-body-sm font-medium">Finalizing</span>
</span>
</td>
<td className="px-md py-md text-right">
<button className="text-brand-purple font-bold text-body-sm hover:underline">Release Offer</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="px-md py-sm bg-surface-container-lowest flex justify-between items-center">
<p className="text-body-sm text-on-surface-variant italic">Showing 4 of 12 assigned jobs</p>
<button className="text-primary font-bold text-body-sm hover:underline flex items-center gap-xs">
                        View All Jobs <span className="material-symbols-outlined text-[18px]" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</div>

<div className="fixed top-0 right-0 w-1/3 h-1/2 -z-10 opacity-10 pointer-events-none">

</div>
</main>
  );
};

export default MmHomeDashboard;
