import React from 'react';

export const IncentiveVerification: React.FC = () => {
  return (
    <main className=" p-margin-page max-w-[1440px]">


<div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mb-8">
<div className="bg-white border border-outline-variant p-4 rounded-lg">
<p className="text-label-md text-outline mb-1">Total Verified</p>
<p className="text-headline-md font-black text-primary">1,248 / 1,300</p>
<div className="w-full bg-surface-container h-1 mt-2 rounded-full overflow-hidden">
<div className="bg-tertiary-container w-[96%] h-full"></div>
</div>
</div>
<div className="bg-white border border-outline-variant p-4 rounded-lg">
<p className="text-label-md text-outline mb-1">Discrepancies Flagged</p>
<p className="text-headline-md font-black text-error">14 High Risk</p>
<p className="text-body-sm text-on-surface-variant mt-1">Requiring manual audit</p>
</div>
<div className="bg-white border border-outline-variant p-4 rounded-lg">
<p className="text-label-md text-outline mb-1">Total Payout Volume</p>
<p className="text-headline-md font-black text-primary">₹14.2L</p>
<p className="text-body-sm text-tertiary font-bold mt-1">+₹1.2L vs Prev Month</p>
</div>
<div className="bg-white border border-outline-variant p-4 rounded-lg">
<p className="text-label-md text-outline mb-1">Linked CRM Status</p>
<div className="flex items-center gap-2 mt-1">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<p className="text-body-sm font-bold text-tertiary">Live Sync Active</p>
</div>
<p className="text-body-sm text-on-surface-variant">Last sync: 4 mins ago</p>
</div>
</div>

<div className="bg-white border border-outline-variant overflow-hidden rounded shadow-sm">
<div className="px-density-table-px py-density-table-py bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
<div className="flex items-center gap-4">
<span className="text-label-md font-bold text-primary uppercase tracking-wider">Verification Table</span>
<div className="flex gap-2">
<span className="bg-error/10 text-error px-2 py-0.5 text-[10px] font-black rounded border border-error/20">MATCH FAILED</span>
<span className="bg-tertiary/10 text-tertiary px-2 py-0.5 text-[10px] font-black rounded border border-tertiary/20">VERIFIED</span>
</div>
</div>
<div className="flex gap-2">
<button className="bg-white border border-outline px-3 py-1.5 text-label-md font-bold rounded flex items-center gap-2 hover:bg-surface-container">
<span className="material-symbols-outlined text-[16px]" data-icon="filter_list">filter_list</span> Filter
                        </button>
<button className="bg-primary-container text-white px-3 py-1.5 text-label-md font-bold rounded flex items-center gap-2 hover:opacity-90">
<span className="material-symbols-outlined text-[16px]" data-icon="download">download</span> Export CSV
                        </button>
</div>
</div>
<div className="overflow-x-auto custom-scrollbar">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-lowest text-label-md text-outline border-b border-outline-variant uppercase tracking-tighter">
<th className="py-density-table-py px-density-table-px font-black">Caller / Employee</th>
<th className="py-density-table-py px-density-table-px font-black">CRM Conversions</th>
<th className="py-density-table-py px-density-table-px font-black">Plan-wise Breakdown</th>
<th className="py-density-table-py px-density-table-px font-black text-right">Incentive Calc</th>
<th className="py-density-table-py px-density-table-px font-black text-right">Claimed</th>
<th className="py-density-table-py px-density-table-px font-black text-center">Status</th>
<th className="py-density-table-py px-density-table-px font-black text-center">Actions</th>
</tr>
</thead>
<tbody className="text-body-md divide-y divide-outline-variant">

<tr className="audit-row transition-colors">
<td className="py-3 px-density-table-px">
<div className="flex flex-col">
<span className="font-bold text-primary">Arjun Sharma</span>
<span className="text-[11px] text-outline">ID: TM-4029 • Outbound</span>
</div>
</td>
<td className="py-3 px-density-table-px">
<div className="flex items-center gap-2">
<span className="font-data-mono font-bold">142 Units</span>
<a className="text-secondary hover:underline" href="#"><span className="material-symbols-outlined text-[14px]" data-icon="link">link</span></a>
</div>
</td>
<td className="py-3 px-density-table-px">
<div className="flex gap-1">
<span className="px-1.5 py-0.5 bg-surface-container text-[10px] border border-outline-variant rounded">Pro: 88</span>
<span className="px-1.5 py-0.5 bg-surface-container text-[10px] border border-outline-variant rounded">Std: 54</span>
</div>
</td>
<td className="py-3 px-density-table-px text-right font-data-mono font-bold">₹12,400</td>
<td className="py-3 px-density-table-px text-right font-data-mono font-bold text-error">₹14,000</td>
<td className="py-3 px-density-table-px text-center">
<span className="material-symbols-outlined text-error" data-icon="report" style={{"fontVariationSettings": "\'FILL\' 1"}}>report</span>
</td>
<td className="py-3 px-density-table-px text-center">
<button className="text-label-md font-black text-primary hover:underline underline-offset-4" >RAISE DISPUTE</button>
</td>
</tr>

<tr className="audit-row transition-colors">
<td className="py-3 px-density-table-px">
<div className="flex flex-col">
<span className="font-bold text-primary">Sanya Mirza</span>
<span className="text-[11px] text-outline">ID: TM-3911 • Inbound</span>
</div>
</td>
<td className="py-3 px-density-table-px">
<div className="flex items-center gap-2">
<span className="font-data-mono font-bold">96 Units</span>
<a className="text-secondary hover:underline" href="#"><span className="material-symbols-outlined text-[14px]" data-icon="link">link</span></a>
</div>
</td>
<td className="py-3 px-density-table-px">
<div className="flex gap-1">
<span className="px-1.5 py-0.5 bg-surface-container text-[10px] border border-outline-variant rounded">Pro: 40</span>
<span className="px-1.5 py-0.5 bg-surface-container text-[10px] border border-outline-variant rounded">Std: 56</span>
</div>
</td>
<td className="py-3 px-density-table-px text-right font-data-mono font-bold text-tertiary">₹8,800</td>
<td className="py-3 px-density-table-px text-right font-data-mono font-bold text-tertiary">₹8,800</td>
<td className="py-3 px-density-table-px text-center">
<span className="material-symbols-outlined text-tertiary" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span>
</td>
<td className="py-3 px-density-table-px text-center">
<span className="text-[10px] text-outline italic">Verified</span>
</td>
</tr>

<tr className="audit-row transition-colors">
<td className="py-3 px-density-table-px">
<div className="flex flex-col">
<span className="font-bold text-primary">Rohan Verma</span>
<span className="text-[11px] text-outline">ID: TM-4105 • Retentions</span>
</div>
</td>
<td className="py-3 px-density-table-px">
<div className="flex items-center gap-2">
<span className="font-data-mono font-bold">210 Units</span>
<a className="text-secondary hover:underline" href="#"><span className="material-symbols-outlined text-[14px]" data-icon="link">link</span></a>
</div>
</td>
<td className="py-3 px-density-table-px">
<div className="flex gap-1">
<span className="px-1.5 py-0.5 bg-surface-container text-[10px] border border-outline-variant rounded">Pro: 150</span>
<span className="px-1.5 py-0.5 bg-surface-container text-[10px] border border-outline-variant rounded">Std: 60</span>
</div>
</td>
<td className="py-3 px-density-table-px text-right font-data-mono font-bold">₹22,500</td>
<td className="py-3 px-density-table-px text-right font-data-mono font-bold text-error">₹21,000</td>
<td className="py-3 px-density-table-px text-center">
<span className="material-symbols-outlined text-error" data-icon="report" style={{"fontVariationSettings": "\'FILL\' 1"}}>report</span>
</td>
<td className="py-3 px-density-table-px text-center">
<button className="text-label-md font-black text-primary hover:underline underline-offset-4" >RAISE DISPUTE</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-3 bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
<p className="text-body-sm text-outline">Showing 1-3 of 1,300 entries</p>
<div className="flex gap-1">
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant bg-white rounded hover:bg-surface-container"><span className="material-symbols-outlined text-sm" data-icon="chevron_left">chevron_left</span></button>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant bg-primary-container text-white rounded">1</button>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant bg-white rounded hover:bg-surface-container">2</button>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant bg-white rounded hover:bg-surface-container">3</button>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant bg-white rounded hover:bg-surface-container"><span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span></button>
</div>
</div>
</div>
</main>
  );
};

export default IncentiveVerification;
