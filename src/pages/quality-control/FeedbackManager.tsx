import React from 'react';

export const FeedbackManager: React.FC = () => {
  return (
    <main className="ml-[200px] flex flex-col h-full ">



<div className="flex-1 p-margin-desktop overflow-hidden flex flex-col gap-gutter">

<div className="grid grid-cols-12 gap-gutter shrink-0">
<div className="col-span-8 bg-surface-container-lowest border border-outline-variant rounded-lg p-stack-md flex items-center gap-gutter">
<div className="flex flex-col gap-stack-xs min-w-[140px]">
<label className="font-label-caps text-label-caps text-on-surface-variant">PROCESS</label>
<select className="bg-surface border-outline-variant text-table-data rounded px-2 py-1 focus:border-primary outline-none">
<option>All Processes</option>
<option>Outbound Logistics</option>
<option>Inbound Dispatch</option>
<option>Vendor Verification</option>
</select>
</div>
<div className="flex flex-col gap-stack-xs min-w-[140px]">
<label className="font-label-caps text-label-caps text-on-surface-variant">CALLER</label>
<select className="bg-surface border-outline-variant text-table-data rounded px-2 py-1 focus:border-primary outline-none">
<option>All Callers</option>
<option>Rohan Sharma</option>
<option>Sana Khan</option>
<option>Vikram Singh</option>
</select>
</div>
<div className="flex flex-col gap-stack-xs flex-1">
<label className="font-label-caps text-label-caps text-on-surface-variant">SCORE RANGE (0 - 100)</label>
<div className="flex items-center gap-stack-sm">
<input className="flex-1 accent-primary h-1 bg-outline-variant rounded-lg appearance-none cursor-pointer" type="range"/>
<span className="text-table-data font-bold text-primary">40-100%</span>
</div>
</div>
<button className="bg-surface border border-outline text-on-surface-variant flex items-center gap-stack-sm px-4 py-1.5 rounded-lg font-label-md text-label-md hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined text-sm">filter_list</span>
                        Reset Filters
                    </button>
</div>
<div className="col-span-4 bg-primary text-on-primary rounded-lg p-stack-md flex justify-around items-center">
<div className="text-center border-r border-on-primary/20 px-4">
<p className="text-label-caps opacity-80">PENDING ACKS</p>
<p className="font-display text-display">12</p>
</div>
<div className="text-center border-r border-on-primary/20 px-4">
<p className="text-label-caps opacity-80">CRITICAL FLAWS</p>
<p className="font-display text-display">04</p>
</div>
<div className="text-center px-4">
<p className="text-label-caps opacity-80">AVG. RESPONSE</p>
<p className="font-display text-display">3.2h</p>
</div>
</div>
</div>

<div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden flex flex-col shadow-sm">
<div className="overflow-auto flex-1">
<table className="w-full text-left border-collapse min-w-[1200px]">
<thead className="sticky top-0 bg-surface-container-high z-10 border-b border-outline-variant">
<tr className="text-label-caps text-on-surface-variant">
<th className="p-inset-table whitespace-nowrap font-bold">CALLER</th>
<th className="p-inset-table whitespace-nowrap font-bold">PROCESS</th>
<th className="p-inset-table whitespace-nowrap font-bold">SCORE</th>
<th className="p-inset-table whitespace-nowrap font-bold">SEVERITY</th>
<th className="p-inset-table whitespace-nowrap font-bold">AUDIT DATE</th>
<th className="p-inset-table whitespace-nowrap font-bold">FEEDBACK SENT</th>
<th className="p-inset-table whitespace-nowrap font-bold text-center">ACKNOWLEDGED</th>
<th className="p-inset-table whitespace-nowrap font-bold">REMEDIATION</th>
<th className="p-inset-table whitespace-nowrap font-bold text-right">ACTIONS</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="pending-row transition-colors group">
<td className="p-inset-table text-table-data font-bold">Rohan Sharma</td>
<td className="p-inset-table text-table-data">Outbound Logistics</td>
<td className="p-inset-table">
<div className="flex items-center gap-2">
<div className="w-12 h-1.5 bg-outline-variant rounded-full overflow-hidden">
<div className="h-full bg-error" style={{"width": "42%"}}></div>
</div>
<span className="text-table-data font-bold text-error">42%</span>
</div>
</td>
<td className="p-inset-table">
<span className="severity-pill-critical px-2 py-0.5 rounded text-label-caps">CRITICAL</span>
</td>
<td className="p-inset-table text-table-data text-on-surface-variant">Oct 24, 09:12 AM</td>
<td className="p-inset-table text-table-data text-on-surface-variant">Oct 24, 11:30 AM</td>
<td className="p-inset-table text-center">
<span className="material-symbols-outlined text-error" title="Pending &gt; 48h">warning</span>
</td>
<td className="p-inset-table">
<span className="text-table-data italic opacity-60">Pending Supervisor Review</span>
</td>
<td className="p-inset-table text-right">
<button className="bg-primary-container text-on-primary-container font-label-md text-label-md px-3 py-1 rounded active:scale-95 transition-transform flex items-center gap-1 ml-auto">
<span className="material-symbols-outlined text-sm">forward_to_inbox</span>
                                        Resend
                                    </button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors group">
<td className="p-inset-table text-table-data font-bold">Sana Khan</td>
<td className="p-inset-table text-table-data">Vendor Verification</td>
<td className="p-inset-table">
<div className="flex items-center gap-2">
<div className="w-12 h-1.5 bg-outline-variant rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{"width": "96%"}}></div>
</div>
<span className="text-table-data font-bold text-primary">96%</span>
</div>
</td>
<td className="p-inset-table">
<span className="severity-pill-good px-2 py-0.5 rounded text-label-caps">GOOD</span>
</td>
<td className="p-inset-table text-table-data text-on-surface-variant">Oct 26, 02:45 PM</td>
<td className="p-inset-table text-table-data text-on-surface-variant">Oct 26, 03:00 PM</td>
<td className="p-inset-table text-center">
<span className="material-symbols-outlined text-primary font-bold" data-weight="fill">check_circle</span>
</td>
<td className="p-inset-table">
<span className="text-table-data">Routine Appreciation</span>
</td>
<td className="p-inset-table text-right">
<button className="p-1 hover:bg-surface-variant rounded text-on-surface-variant">
<span className="material-symbols-outlined text-lg">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors group">
<td className="p-inset-table text-table-data font-bold">Vikram Singh</td>
<td className="p-inset-table text-table-data">Inbound Dispatch</td>
<td className="p-inset-table">
<div className="flex items-center gap-2">
<div className="w-12 h-1.5 bg-outline-variant rounded-full overflow-hidden">
<div className="h-full bg-tertiary" style={{"width": "74%"}}></div>
</div>
<span className="text-table-data font-bold text-tertiary">74%</span>
</div>
</td>
<td className="p-inset-table">
<span className="severity-pill-warning px-2 py-0.5 rounded text-label-caps">NEEDS IMPROVEMENT</span>
</td>
<td className="p-inset-table text-table-data text-on-surface-variant">Oct 25, 11:20 AM</td>
<td className="p-inset-table text-table-data text-on-surface-variant">Oct 25, 01:15 PM</td>
<td className="p-inset-table text-center">
<span className="material-symbols-outlined text-on-surface-variant opacity-30">pending</span>
</td>
<td className="p-inset-table">
<span className="text-table-data">Script adherence training</span>
</td>
<td className="p-inset-table text-right">
<button className="bg-surface-container-highest text-on-surface-variant font-label-md text-label-md px-3 py-1 rounded hover:bg-surface-variant flex items-center gap-1 ml-auto">
<span className="material-symbols-outlined text-sm">forward_to_inbox</span>
                                        Remind
                                    </button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors group">
<td className="p-inset-table text-table-data font-bold">Ananya Roy</td>
<td className="p-inset-table text-table-data">Outbound Logistics</td>
<td className="p-inset-table">
<div className="flex items-center gap-2">
<div className="w-12 h-1.5 bg-outline-variant rounded-full overflow-hidden">
<div className="h-full bg-error" style={{"width": "58%"}}></div>
</div>
<span className="text-table-data font-bold text-error">58%</span>
</div>
</td>
<td className="p-inset-table">
<span className="severity-pill-critical px-2 py-0.5 rounded text-label-caps">CRITICAL</span>
</td>
<td className="p-inset-table text-table-data text-on-surface-variant">Oct 26, 10:00 AM</td>
<td className="p-inset-table text-table-data text-on-surface-variant">Oct 26, 10:45 AM</td>
<td className="p-inset-table text-center">
<span className="material-symbols-outlined text-on-surface-variant opacity-30">pending</span>
</td>
<td className="p-inset-table">
<span className="text-table-data">Fatal Error Rectification</span>
</td>
<td className="p-inset-table text-right">
<button className="p-1 hover:bg-surface-variant rounded text-on-surface-variant">
<span className="material-symbols-outlined text-lg">more_vert</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-inset-table text-table-data font-bold">Amit Patel</td>
<td className="p-inset-table text-table-data">Vendor Verification</td>
<td className="p-inset-table">
<div className="flex items-center gap-2">
<div className="w-12 h-1.5 bg-outline-variant rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{"width": "88%"}}></div>
</div>
<span className="text-table-data font-bold text-primary">88%</span>
</div>
</td>
<td className="p-inset-table">
<span className="severity-pill-good px-2 py-0.5 rounded text-label-caps">GOOD</span>
</td>
<td className="p-inset-table text-table-data text-on-surface-variant">Oct 23, 04:20 PM</td>
<td className="p-inset-table text-table-data text-on-surface-variant">Oct 23, 04:30 PM</td>
<td className="p-inset-table text-center">
<span className="material-symbols-outlined text-primary font-bold" data-weight="fill">check_circle</span>
</td>
<td className="p-inset-table">
<span className="text-table-data">N/A</span>
</td>
<td className="p-inset-table text-right">
<button className="p-1 hover:bg-surface-variant rounded text-on-surface-variant">
<span className="material-symbols-outlined text-lg">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="border-t border-outline-variant p-inset-table flex justify-between items-center bg-surface-container-low">
<p className="text-table-data text-on-surface-variant">Showing 1 to 5 of 148 entries</p>
<div className="flex gap-stack-sm">
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-variant disabled:opacity-30" disabled>
<span className="material-symbols-outlined text-base">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded bg-primary text-on-primary text-table-data font-bold">1</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-variant text-table-data">2</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-variant text-table-data">3</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-surface-variant">
<span className="material-symbols-outlined text-base">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</main>
  );
};

export default FeedbackManager;
