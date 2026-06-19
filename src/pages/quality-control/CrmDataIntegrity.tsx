import React from 'react';

export const CrmDataIntegrity: React.FC = () => {
  return (
    <main className="ml-[200px] mt-0 p-8 bg-white ">


<div className="grid grid-cols-12 gap-6">

<section className="col-span-12 lg:col-span-8 bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col">
<div className="px-margin-desktop py-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
<h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-primary">call_missed</span>
                            Untagged Calls Today
                        </h2>
<span className="bg-primary-container text-on-primary-container px-3 py-1 rounded-full font-label-caps text-label-caps">24 RECORDS</span>
</div>
<div className="overflow-x-auto custom-scrollbar">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-highest border-b border-outline-variant">
<th className="p-inset-table font-label-caps text-label-caps text-on-surface-variant uppercase">Time</th>
<th className="p-inset-table font-label-caps text-label-caps text-on-surface-variant uppercase">Agent Name</th>
<th className="p-inset-table font-label-caps text-label-caps text-on-surface-variant uppercase">Duration</th>
<th className="p-inset-table font-label-caps text-label-caps text-on-surface-variant uppercase">TMID</th>
<th className="p-inset-table font-label-caps text-label-caps text-on-surface-variant uppercase text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="cell-hover h-[40px]">
<td className="px-inset-table font-table-data text-table-data">10:42 AM</td>
<td className="px-inset-table font-table-data text-table-data font-bold">Ravi Kumar</td>
<td className="px-inset-table font-table-data text-table-data">04:12</td>
<td className="px-inset-table font-table-data text-table-data">TM_88291</td>
<td className="px-inset-table text-right">
<button className="text-primary hover:underline font-label-md text-label-md">Send reminder</button>
</td>
</tr>
<tr className="cell-hover h-[40px]">
<td className="px-inset-table font-table-data text-table-data">11:05 AM</td>
<td className="px-inset-table font-table-data text-table-data font-bold">Ananya Singh</td>
<td className="px-inset-table font-table-data text-table-data">12:45</td>
<td className="px-inset-table font-table-data text-table-data">TM_88304</td>
<td className="px-inset-table text-right">
<button className="text-primary hover:underline font-label-md text-label-md">Send reminder</button>
</td>
</tr>
<tr className="cell-hover h-[40px]">
<td className="px-inset-table font-table-data text-table-data">11:18 AM</td>
<td className="px-inset-table font-table-data text-table-data font-bold">Vikram Seth</td>
<td className="px-inset-table font-table-data text-table-data">01:30</td>
<td className="px-inset-table font-table-data text-table-data">TM_88310</td>
<td className="px-inset-table text-right">
<button className="text-primary hover:underline font-label-md text-label-md">Send reminder</button>
</td>
</tr>
<tr className="cell-hover h-[40px]">
<td className="px-inset-table font-table-data text-table-data">11:45 AM</td>
<td className="px-inset-table font-table-data text-table-data font-bold">Saira Banu</td>
<td className="px-inset-table font-table-data text-table-data">08:22</td>
<td className="px-inset-table font-table-data text-table-data">TM_88322</td>
<td className="px-inset-table text-right">
<button className="text-primary hover:underline font-label-md text-label-md">Send reminder</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 bg-surface-container-low border-t border-outline-variant">
<button className="w-full text-center font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">View All Untagged Logs (14 more)</button>
</div>
</section>

<section className="col-span-12 lg:col-span-4 space-y-6">
<div className="bg-white border border-outline-variant rounded-lg p-6">
<h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-error">flag</span>
                            Disposition Discrepancies
                        </h2>
<div className="space-y-4">

<div className="p-4 rounded border-l-4 border-error bg-error-container/20">
<div className="flex justify-between mb-2">
<span className="font-label-md text-label-md font-bold text-on-surface">TM_88210</span>
<span className="font-label-caps text-label-caps text-error">AUTO-DETECT</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-2">Duration: <span className="font-bold">22:04</span> | Logged: <span className="font-bold">"Not Interested"</span></p>
<p className="text-xs text-on-surface-variant italic">High probability of incorrect outcome for duration &gt; 15m.</p>
<div className="mt-3 flex gap-2">
<button className="bg-primary text-on-primary px-3 py-1 rounded text-[11px] font-bold">Investigate</button>
<button className="border border-outline px-3 py-1 rounded text-[11px] font-bold">Dismiss</button>
</div>
</div>

<div className="p-4 rounded border-l-4 border-error bg-error-container/20">
<div className="flex justify-between mb-2">
<span className="font-label-md text-label-md font-bold text-on-surface">TM_88301</span>
<span className="font-label-caps text-label-caps text-error">AUTO-DETECT</span>
</div>
<p className="font-body-sm text-body-sm text-on-surface-variant mb-2">Duration: <span className="font-bold">00:12</span> | Logged: <span className="font-bold">"Sale Confirmed"</span></p>
<p className="text-xs text-on-surface-variant italic">Transaction flow physically impossible in &lt; 1 minute.</p>
<div className="mt-3 flex gap-2">
<button className="bg-primary text-on-primary px-3 py-1 rounded text-[11px] font-bold">Investigate</button>
<button className="border border-outline px-3 py-1 rounded text-[11px] font-bold">Dismiss</button>
</div>
</div>
</div>
</div>

<div className="bg-white border border-outline-variant rounded-lg p-6">
<h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-primary">payments</span>
                            Incorrect Plan Amounts
                        </h2>
<div className="space-y-3">
<div className="flex items-center justify-between py-2 border-b border-outline-variant">
<div>
<p className="font-table-data text-table-data font-bold">Elite Pro Tier</p>
<p className="text-[11px] text-on-surface-variant">Logged: ₹12,500 | Required: ₹14,000</p>
</div>
<span className="material-symbols-outlined text-error">warning</span>
</div>
<div className="flex items-center justify-between py-2 border-b border-outline-variant">
<div>
<p className="font-table-data text-table-data font-bold">Basic Transit</p>
<p className="text-[11px] text-on-surface-variant">Logged: ₹4,200 | Required: ₹4,500</p>
</div>
<span className="material-symbols-outlined text-error">warning</span>
</div>
</div>
</div>
</section>

<section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
<div className="md:col-span-2 bg-white border border-outline-variant rounded-lg p-6">
<h2 className="font-headline-md text-headline-md text-on-surface flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-primary">content_copy</span>
                            Duplicate TMID Entries
                        </h2>
<div className="grid grid-cols-2 gap-4">
<div className="p-3 bg-surface-container rounded border border-outline-variant flex justify-between items-center">
<div>
<p className="font-label-md text-label-md font-bold">TMID_X9922</p>
<p className="text-[11px] text-on-surface-variant">Created: 2m ago, 4h ago</p>
</div>
<button className="text-primary material-symbols-outlined hover:bg-primary/10 rounded p-1">merge</button>
</div>
<div className="p-3 bg-surface-container rounded border border-outline-variant flex justify-between items-center">
<div>
<p className="font-label-md text-label-md font-bold">TMID_B1104</p>
<p className="text-[11px] text-on-surface-variant">Created: 10m ago, 12m ago</p>
</div>
<button className="text-primary material-symbols-outlined hover:bg-primary/10 rounded p-1">merge</button>
</div>
<div className="p-3 bg-surface-container rounded border border-outline-variant flex justify-between items-center">
<div>
<p className="font-label-md text-label-md font-bold">TMID_Z0054</p>
<p className="text-[11px] text-on-surface-variant">Created: Yesterday, Today</p>
</div>
<button className="text-primary material-symbols-outlined hover:bg-primary/10 rounded p-1">merge</button>
</div>
<div className="p-3 bg-surface-container rounded border border-outline-variant flex justify-between items-center">
<div>
<p className="font-label-md text-label-md font-bold">TMID_K8832</p>
<p className="text-[11px] text-on-surface-variant">Created: 1h ago, 1h ago</p>
</div>
<button className="text-primary material-symbols-outlined hover:bg-primary/10 rounded p-1">merge</button>
</div>
</div>
</div>
<div className="bg-primary text-on-primary rounded-lg p-6 flex flex-col justify-between">
<div>
<h3 className="font-label-caps text-label-caps opacity-80 uppercase mb-2">Integrity Health Score</h3>
<div className="text-[48px] font-black leading-none">94.8</div>
</div>
<div>
<div className="w-full bg-on-primary/20 h-2 rounded-full mb-2">
<div className="bg-on-primary h-2 rounded-full" style={{"width": "94.8%"}}></div>
</div>
<p className="text-[11px] opacity-80">+0.4% from previous shift</p>
</div>
</div>
</section>
</div>
</main>
  );
};

export default CrmDataIntegrity;
