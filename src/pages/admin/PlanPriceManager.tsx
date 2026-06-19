import React from 'react';

export const PlanPriceManager: React.FC = () => {
  return (
    <main className=" max-w-container-max p-xl overflow-x-hidden">

<div className="flex items-center gap-xs mb-lg font-body-sm text-on-surface-variant">
<span>Core Systems</span>
<span>/</span>
<span className="text-on-surface font-semibold">Plan Prices</span>
</div>

<div className="flex justify-between items-end mb-xl">
<div>
<h1 className="font-display-sm text-display-sm text-primary mb-xs">Plan Price Manager</h1>
<p className="text-body-md text-on-surface-variant max-w-2xl">Manage subscription tiers, update regional pricing, and audit historical price adjustments. Any changes require security clearance.</p>
</div>
<button className="bg-primary text-on-primary px-lg py-sm flex items-center gap-sm font-bold text-body-md hover:opacity-90 active:scale-95 transition-all">
<span className="material-symbols-outlined text-[20px]">add</span>
                    Create New Tier
                </button>
</div>

<div className="grid grid-cols-1 gap-xl">

<section className="bg-surface-container-lowest border border-outline-variant">
<div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
<h2 className="font-headline-sm text-headline-sm text-primary">Current Active Plans</h2>
<div className="flex gap-sm">
<div className="relative">
<input className="pl-xl pr-sm py-xs border border-outline text-body-sm focus:border-primary focus:ring-0 w-64 bg-surface" placeholder="Search plans..." type="text"/>
<span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-body-sm text-outline">search</span>
</div>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-low sticky top-0 border-b border-outline-variant">
<tr>
<th className="px-lg py-sm font-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Plan ID</th>
<th className="px-lg py-sm font-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Plan Name</th>
<th className="px-lg py-sm font-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Current Price</th>
<th className="px-lg py-sm font-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Billing Cycle</th>
<th className="px-lg py-sm font-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
<th className="px-lg py-sm font-body-sm font-semibold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant font-table-data text-table-data">
<tr className="hover:bg-surface-container/30 transition-colors">
<td className="px-lg py-sm font-code-sm text-on-surface-variant">PLAN_JR_001</td>
<td className="px-lg py-sm font-bold">Job Ready</td>
<td className="px-lg py-sm font-code-sm text-primary">₹49.00</td>
<td className="px-lg py-sm">Monthly</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-xs">
<span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
<span className="text-green-800 text-[11px] font-bold uppercase">Active</span>
</div>
</td>
<td className="px-lg py-sm text-right">
<button className="text-primary hover:underline font-bold" >Edit Price</button>
</td>
</tr>
<tr className="hover:bg-surface-container/30 transition-colors">
<td className="px-lg py-sm font-code-sm text-on-surface-variant">PLAN_VF_002</td>
<td className="px-lg py-sm font-bold">Verified</td>
<td className="px-lg py-sm font-code-sm text-primary">₹129.00</td>
<td className="px-lg py-sm">Monthly</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-xs">
<span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
<span className="text-green-800 text-[11px] font-bold uppercase">Active</span>
</div>
</td>
<td className="px-lg py-sm text-right">
<button className="text-primary hover:underline font-bold" >Edit Price</button>
</td>
</tr>
<tr className="hover:bg-surface-container/30 transition-colors">
<td className="px-lg py-sm font-code-sm text-on-surface-variant">PLAN_TR_003</td>
<td className="px-lg py-sm font-bold">Trusted</td>
<td className="px-lg py-sm font-code-sm text-primary">₹299.00</td>
<td className="px-lg py-sm">Monthly</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-xs">
<span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
<span className="text-green-800 text-[11px] font-bold uppercase">Active</span>
</div>
</td>
<td className="px-lg py-sm text-right">
<button className="text-primary hover:underline font-bold" >Edit Price</button>
</td>
</tr>
<tr className="hover:bg-surface-container/30 transition-colors">
<td className="px-lg py-sm font-code-sm text-on-surface-variant">PLAN_EN_004</td>
<td className="px-lg py-sm font-bold">Enterprise</td>
<td className="px-lg py-sm font-code-sm text-primary">Custom</td>
<td className="px-lg py-sm">Annual</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-xs">
<span className="w-1.5 h-1.5 rounded-full bg-amber-600"></span>
<span className="text-amber-800 text-[11px] font-bold uppercase">Manual Quote</span>
</div>
</td>
<td className="px-lg py-sm text-right">
<button className="text-on-surface-variant/40 cursor-not-allowed font-bold">Edit Price</button>
</td>
</tr>
</tbody>
</table>
</div>
</section>

<section className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
<div className="px-lg py-md border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
<h2 className="font-headline-sm text-headline-sm text-primary">Price Change History</h2>
<button className="text-body-sm font-semibold flex items-center gap-xs hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[16px]">download</span>
                            Export Audit CSV
                        </button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-low border-b border-outline-variant">
<tr>
<th className="px-lg py-sm font-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Timestamp</th>
<th className="px-lg py-sm font-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Plan</th>
<th className="px-lg py-sm font-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Old Price</th>
<th className="px-lg py-sm font-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">New Price</th>
<th className="px-lg py-sm font-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Modified By</th>
<th className="px-lg py-sm font-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant font-table-data text-table-data">
<tr>
<td className="px-lg py-sm font-code-sm text-on-surface-variant">2023-10-24 14:32:01</td>
<td className="px-lg py-sm font-bold">Verified</td>
<td className="px-lg py-sm font-code-sm text-on-surface-variant line-through">₹119.00</td>
<td className="px-lg py-sm font-code-sm text-primary font-bold">₹129.00</td>
<td className="px-lg py-sm">admin_sarah_w</td>
<td className="px-lg py-sm">
<span className="px-xs py-0.5 border border-green-600 text-green-700 text-[10px] font-bold uppercase">Success</span>
</td>
</tr>
<tr>
<td className="px-lg py-sm font-code-sm text-on-surface-variant">2023-10-21 09:15:44</td>
<td className="px-lg py-sm font-bold">Job Ready</td>
<td className="px-lg py-sm font-code-sm text-on-surface-variant line-through">₹39.00</td>
<td className="px-lg py-sm font-code-sm text-primary font-bold">₹49.00</td>
<td className="px-lg py-sm">system_autopilot</td>
<td className="px-lg py-sm">
<span className="px-xs py-0.5 border border-green-600 text-green-700 text-[10px] font-bold uppercase">Success</span>
</td>
</tr>
<tr>
<td className="px-lg py-sm font-code-sm text-on-surface-variant">2023-10-18 11:02:12</td>
<td className="px-lg py-sm font-bold">Trusted</td>
<td className="px-lg py-sm font-code-sm text-on-surface-variant line-through">₹299.00</td>
<td className="px-lg py-sm font-code-sm text-primary font-bold">₹299.00</td>
<td className="px-lg py-sm">admin_mike_r</td>
<td className="px-lg py-sm">
<span className="px-xs py-0.5 border border-red-600 text-red-700 text-[10px] font-bold uppercase">Failed (Auth)</span>
</td>
</tr>
<tr>
<td className="px-lg py-sm font-code-sm text-on-surface-variant">2023-09-30 23:59:59</td>
<td className="px-lg py-sm font-bold">Job Ready</td>
<td className="px-lg py-sm font-code-sm text-on-surface-variant line-through">₹45.00</td>
<td className="px-lg py-sm font-code-sm text-primary font-bold">₹39.00</td>
<td className="px-lg py-sm">marketing_promos</td>
<td className="px-lg py-sm">
<span className="px-xs py-0.5 border border-green-600 text-green-700 text-[10px] font-bold uppercase">Success</span>
</td>
</tr>
</tbody>
</table>
</div>
</section>
</div>
</main>
  );
};

export default PlanPriceManager;
