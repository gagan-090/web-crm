import React from 'react';

export const FatalErrorLog: React.FC = () => {
  return (
    <main className="md:ml-[200px] pt-16 min-h-screen">
<div className="p-margin-desktop">

<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-margin-desktop gap-stack-md">
<div>
<h1 className="font-display text-display text-on-surface">Fatal Error Log</h1>
<p className="text-on-surface-variant font-body-sm mt-1">Real-time tracking of critical process deviations and compliance failures.</p>
</div>
<div className="flex gap-gutter w-full md:w-auto">

<div className="bg-error-container p-4 rounded-lg flex flex-col items-center justify-center min-w-[160px] border border-error/20">
<span className="text-on-error-container font-label-caps uppercase text-label-caps">Fatal Error Rate</span>
<div className="flex items-baseline gap-1">
<span className="text-3xl font-black text-error">2.3%</span>
<span className="text-error/70 text-xs font-bold">(-0.4%)</span>
</div>
</div>
<div className="bg-surface-container-high p-4 rounded-lg flex flex-col items-center justify-center min-w-[160px] border border-outline-variant">
<span className="text-on-surface-variant font-label-caps uppercase text-label-caps">Open Escalations</span>
<span className="text-3xl font-black text-on-surface">14</span>
</div>
</div>
</div>

<div className="grid grid-cols-12 gap-gutter">

<div className="col-span-12 glass-panel rounded overflow-hidden flex flex-col">
<div className="px-inset-table py-4 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
<div className="flex items-center gap-4">
<h2 className="text-headline-md font-headline-md text-on-surface">Compliance Violations</h2>
<span className="bg-primary-fixed text-on-primary-fixed-variant px-2 py-0.5 rounded text-xs font-bold">48 Total Records</span>
</div>
<div className="flex items-center gap-stack-sm">
<button className="bg-surface-container hover:bg-surface-variant text-on-surface-variant font-label-md px-3 py-1.5 rounded flex items-center gap-1 border border-outline-variant transition-colors">
<span className="material-symbols-outlined text-sm">filter_alt</span> Filter
                            </button>
<button className="bg-surface-container hover:bg-surface-variant text-on-surface-variant font-label-md px-3 py-1.5 rounded flex items-center gap-1 border border-outline-variant transition-colors">
<span className="material-symbols-outlined text-sm">file_download</span> Export
                            </button>
</div>
</div>
<div className="audit-table-container overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container sticky top-0 z-10">
<tr>
<th className="px-inset-table py-2.5 font-label-caps text-label-caps text-outline uppercase tracking-wider border-b border-outline-variant">Date</th>
<th className="px-inset-table py-2.5 font-label-caps text-label-caps text-outline uppercase tracking-wider border-b border-outline-variant">Caller</th>
<th className="px-inset-table py-2.5 font-label-caps text-label-caps text-outline uppercase tracking-wider border-b border-outline-variant">Call TMID</th>
<th className="px-inset-table py-2.5 font-label-caps text-label-caps text-outline uppercase tracking-wider border-b border-outline-variant">Error Type</th>
<th className="px-inset-table py-2.5 font-label-caps text-label-caps text-outline uppercase tracking-wider border-b border-outline-variant">Timestamp</th>
<th className="px-inset-table py-2.5 font-label-caps text-label-caps text-outline uppercase tracking-wider border-b border-outline-variant">Escalation</th>
<th className="px-inset-table py-2.5 font-label-caps text-label-caps text-outline uppercase tracking-wider border-b border-outline-variant">Resolution Note</th>
<th className="px-inset-table py-2.5 font-label-caps text-label-caps text-outline uppercase tracking-wider border-b border-outline-variant">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-primary/5 group transition-colors h-10">
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface">Oct 24, 2023</td>
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface">Aman Gupta</td>
<td className="px-inset-table py-2 font-table-data text-table-data font-bold text-primary">TM-99210</td>
<td className="px-inset-table py-2">
<select className="bg-transparent border-none p-0 text-table-data font-table-data focus:ring-0 cursor-pointer text-error">
<option selected>Wrong Price</option>
<option>False Promise</option>
<option>Verification Failure</option>
<option>Rude Behavior</option>
</select>
</td>
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface-variant">04:12 / 12:40</td>
<td className="px-inset-table py-2">
<span className="flex items-center gap-1.5 text-error font-bold text-[11px]">
<span className="material-symbols-outlined text-sm">schedule</span> Pending TL
                                        </span>
</td>
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface-variant italic truncate max-w-[150px]">Awaiting feedback from Ops...</td>
<td className="px-inset-table py-2">
<button className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1" >
                                            Escalate <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
</button>
</td>
</tr>

<tr className="hover:bg-primary/5 group transition-colors h-10 border-l-2 border-primary">
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface">Oct 24, 2023</td>
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface">Rahul V.</td>
<td className="px-inset-table py-2 font-table-data text-table-data font-bold text-primary">TM-99344</td>
<td className="px-inset-table py-2">
<select className="bg-transparent border-none p-0 text-table-data font-table-data focus:ring-0 cursor-pointer text-error">
<option>Wrong Price</option>
<option selected>False Promise</option>
<option>Verification Failure</option>
</select>
</td>
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface-variant">01:05 / 08:22</td>
<td className="px-inset-table py-2">
<span className="flex items-center gap-1.5 text-secondary font-bold text-[11px]">
<span className="material-symbols-outlined text-sm">check_circle</span> TL Reviewed
                                        </span>
</td>
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface-variant truncate max-w-[150px]">PIP initiated for agent.</td>
<td className="px-inset-table py-2">
<button className="text-outline-variant cursor-not-allowed px-2 py-1 rounded text-xs font-bold flex items-center gap-1 border border-outline-variant" disabled>
                                            Complete
                                        </button>
</td>
</tr>

<tr className="hover:bg-primary/5 group transition-colors h-10">
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface">Oct 23, 2023</td>
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface">Sana Khan</td>
<td className="px-inset-table py-2 font-table-data text-table-data font-bold text-primary">TM-98112</td>
<td className="px-inset-table py-2">
<select className="bg-transparent border-none p-0 text-table-data font-table-data focus:ring-0 cursor-pointer text-error">
<option>Wrong Price</option>
<option>False Promise</option>
<option selected>Verification Failure</option>
</select>
</td>
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface-variant">07:44 / 09:15</td>
<td className="px-inset-table py-2">
<span className="flex items-center gap-1.5 text-on-surface-variant font-bold text-[11px]">
<span className="material-symbols-outlined text-sm">edit</span> Not Escalated
                                        </span>
</td>
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface-variant italic truncate max-w-[150px]">Low impact deviation.</td>
<td className="px-inset-table py-2">
<button className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1" >
                                            Escalate <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
</button>
</td>
</tr>

<tr className="hover:bg-primary/5 group transition-colors h-10">
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface">Oct 23, 2023</td>
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface">Vikram S.</td>
<td className="px-inset-table py-2 font-table-data text-table-data font-bold text-primary">TM-97883</td>
<td className="px-inset-table py-2">
<select className="bg-transparent border-none p-0 text-table-data font-table-data focus:ring-0 cursor-pointer text-error">
<option selected>Rude Behavior</option>
<option>Compliance Breach</option>
</select>
</td>
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface-variant">00:30 / 15:00</td>
<td className="px-inset-table py-2">
<span className="flex items-center gap-1.5 text-error font-bold text-[11px]">
<span className="material-symbols-outlined text-sm">priority_high</span> Critical
                                        </span>
</td>
<td className="px-inset-table py-2 font-table-data text-table-data text-on-surface-variant italic truncate max-w-[150px]">Immediate action needed.</td>
<td className="px-inset-table py-2">
<button className="bg-primary/10 text-primary hover:bg-primary hover:text-on-primary px-2 py-1 rounded text-xs font-bold transition-all flex items-center gap-1" >
                                            Escalate <span className="material-symbols-outlined text-[14px]">arrow_drop_down</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="px-inset-table py-3 border-t border-outline-variant bg-surface-container-low flex justify-between items-center">
<span className="text-body-sm text-on-surface-variant">Showing 1-4 of 48 fatal errors</span>
<div className="flex gap-2">
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors disabled:opacity-30" disabled>
<span className="material-symbols-outlined text-sm">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-primary bg-primary-fixed text-primary font-bold text-xs">1</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors text-xs">2</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors text-xs">3</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-sm">chevron_right</span>
</button>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-4 grid grid-cols-1 gap-gutter">
<div className="glass-panel p-4 rounded flex flex-col gap-stack-sm">
<h3 className="font-label-caps text-label-caps text-outline uppercase tracking-wider">Top Fatal Root Causes</h3>
<div className="space-y-stack-sm mt-2">
<div className="space-y-1">
<div className="flex justify-between text-xs font-bold">
<span>False Promise</span>
<span>42%</span>
</div>
<div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{"width": "42%"}}></div>
</div>
</div>
<div className="space-y-1">
<div className="flex justify-between text-xs font-bold">
<span>Wrong Price Quoted</span>
<span>28%</span>
</div>
<div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{"width": "28%"}}></div>
</div>
</div>
<div className="space-y-1">
<div className="flex justify-between text-xs font-bold">
<span>Script Violation</span>
<span>15%</span>
</div>
<div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-primary rounded-full" style={{"width": "15%"}}></div>
</div>
</div>
</div>
</div>
</div>
<div className="col-span-12 lg:col-span-8 glass-panel p-4 rounded flex flex-col">
<h3 className="font-label-caps text-label-caps text-outline uppercase tracking-wider mb-4">Error Trend (Last 14 Days)</h3>
<div className="flex-1 min-h-[120px] flex items-end justify-between gap-1 px-2">
<div className="w-full bg-primary/20 h-[30%] rounded-t-sm hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">2.1%</div>
</div>
<div className="w-full bg-primary/20 h-[45%] rounded-t-sm hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">2.4%</div>
</div>
<div className="w-full bg-primary/20 h-[60%] rounded-t-sm hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">2.8%</div>
</div>
<div className="w-full bg-primary h-[20%] rounded-t-sm group relative">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">1.8%</div>
</div>
<div className="w-full bg-primary/20 h-[50%] rounded-t-sm hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">2.5%</div>
</div>
<div className="w-full bg-primary/20 h-[70%] rounded-t-sm hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">3.1%</div>
</div>
<div className="w-full bg-primary/20 h-[40%] rounded-t-sm hover:bg-primary transition-colors cursor-help group relative">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-on-surface text-surface text-[10px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">2.3%</div>
</div>
</div>
</div>
</div>
</div>
</main>
  );
};

export default FatalErrorLog;
