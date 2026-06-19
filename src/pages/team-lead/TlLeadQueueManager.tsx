import React from 'react';

export const TlLeadQueueManager: React.FC = () => {
  return (
    <main className=" flex flex-col h-full bg-white">



<div className="flex-1 flex overflow-hidden">

<div className="flex-1 flex flex-col overflow-hidden border-r border-outline-variant">

<div className="px-margin-desktop pt-md border-b border-outline-variant flex gap-xl overflow-x-auto scrollbar-hide shrink-0">
<button className="relative pb-md text-primary font-bold text-label-md whitespace-nowrap">
                        All Leads
                        <div className="active-tab-indicator"></div>
</button>
<button className="pb-md text-on-surface-variant hover:text-on-surface text-label-md whitespace-nowrap flex items-center gap-1">
                        Overdue (&gt;3 days) <span className="bg-error text-white text-[10px] px-1 rounded-full">12</span>
</button>
<button className="pb-md text-on-surface-variant hover:text-on-surface text-label-md whitespace-nowrap">NR x 2</button>
<button className="pb-md text-on-surface-variant hover:text-on-surface text-label-md whitespace-nowrap">Funnel</button>
<button className="pb-md text-on-surface-variant hover:text-on-surface text-label-md whitespace-nowrap">Callbacks Today</button>
<button className="pb-md text-on-surface-variant hover:text-on-surface text-label-md whitespace-nowrap">Cold</button>
</div>

<div className="flex-1 overflow-auto custom-scrollbar">
<table className="w-full text-left border-collapse">
<thead className="sticky top-0 z-10 shadow-sm bg-white">
<tr>
<th className="p-sm pl-margin-desktop border-b border-outline-variant"><input className="rounded border-outline-variant text-primary focus:ring-primary" type="checkbox" /></th>
<th className="p-sm border-b border-outline-variant text-label-md text-on-surface-variant uppercase">Lead Details</th>
<th className="p-sm border-b border-outline-variant text-label-md text-on-surface-variant uppercase">Process</th>
<th className="p-sm border-b border-outline-variant text-label-md text-on-surface-variant uppercase">Current Status</th>
<th className="p-sm border-b border-outline-variant text-label-md text-on-surface-variant uppercase">SLA Remaining</th>
<th className="p-sm border-b border-outline-variant text-label-md text-on-surface-variant uppercase">Agent</th>
<th className="p-sm pr-margin-desktop border-b border-outline-variant text-label-md text-on-surface-variant uppercase text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-surface-container-low transition-colors group">
<td className="p-sm pl-margin-desktop"><input className="rounded border-outline-variant" type="checkbox" /></td>
<td className="p-sm">
<div className="flex flex-col">
<span className="font-bold text-body-md">#LD-98421 - Arjun Sharma</span>
<span className="text-xs text-on-surface-variant">M: +91 98765 43210</span>
</div>
</td>
<td className="p-sm text-body-md">Express Freight</td>
<td className="p-sm">
<span className="px-2 py-0.5 bg-primary-container/20 text-on-primary-container text-[11px] font-bold rounded uppercase">No Response</span>
</td>
<td className="p-sm">
<div className="flex flex-col gap-1 w-24">
<span className="text-error font-mono-data text-xs">2h 15m</span>
<div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
<div className="h-full bg-error" style={{"width": "85%"}}></div>
</div>
</div>
</td>
<td className="p-sm">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold">AK</div>
<span className="text-body-sm">Aman K.</span>
</div>
</td>
<td className="p-sm pr-margin-desktop text-right">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-sm pl-margin-desktop"><input className="rounded border-outline-variant" type="checkbox" /></td>
<td className="p-sm">
<div className="flex flex-col">
<span className="font-bold text-body-md">#LD-98422 - Priya Patel</span>
<span className="text-xs text-on-surface-variant">M: +91 88765 43211</span>
</div>
</td>
<td className="p-sm text-body-md">Cold Chain</td>
<td className="p-sm">
<span className="px-2 py-0.5 bg-secondary-container/20 text-secondary text-[11px] font-bold rounded uppercase">Interested</span>
</td>
<td className="p-sm">
<div className="flex flex-col gap-1 w-24">
<span className="text-primary font-mono-data text-xs">14h 22m</span>
<div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{"width": "40%"}}></div>
</div>
</div>
</td>
<td className="p-sm">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold">SR</div>
<span className="text-body-sm">Sonia R.</span>
</div>
</td>
<td className="p-sm pr-margin-desktop text-right">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-sm pl-margin-desktop"><input className="rounded border-outline-variant" type="checkbox" /></td>
<td className="p-sm">
<div className="flex flex-col">
<span className="font-bold text-body-md">#LD-98425 - Mike Johnson</span>
<span className="text-xs text-on-surface-variant">M: +1 415 555 0199</span>
</div>
</td>
<td className="p-sm text-body-md">International Air</td>
<td className="p-sm">
<span className="px-2 py-0.5 bg-error-container/20 text-error text-[11px] font-bold rounded uppercase">Overdue</span>
</td>
<td className="p-sm">
<div className="flex flex-col gap-1 w-24">
<span className="text-error font-mono-data text-xs">EXPIRED</span>
<div className="h-1.5 w-full bg-error/20 rounded-full overflow-hidden">
<div className="h-full bg-error" style={{"width": "100%"}}></div>
</div>
</div>
</td>
<td className="p-sm">
<div className="flex items-center gap-2 text-on-error-container italic">
<span className="text-xs">Unassigned</span>
</div>
</td>
<td className="p-sm pr-margin-desktop text-right">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-sm pl-margin-desktop"><input className="rounded border-outline-variant" type="checkbox" /></td>
<td className="p-sm">
<div className="flex flex-col">
<span className="font-bold text-body-md">#LD-98430 - Elena Gomez</span>
<span className="text-xs text-on-surface-variant">M: +34 600 123 456</span>
</div>
</td>
<td className="p-sm text-body-md">Last-Mile</td>
<td className="p-sm">
<span className="px-2 py-0.5 bg-tertiary-container/20 text-tertiary text-[11px] font-bold rounded uppercase">In Funnel</span>
</td>
<td className="p-sm">
<div className="flex flex-col gap-1 w-24">
<span className="text-on-surface-variant font-mono-data text-xs">22h 05m</span>
<div className="h-1.5 w-full bg-outline-variant rounded-full overflow-hidden">
<div className="h-full bg-tertiary" style={{"width": "25%"}}></div>
</div>
</div>
</td>
<td className="p-sm">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold">JD</div>
<span className="text-body-sm">John Doe</span>
</div>
</td>
<td className="p-sm pr-margin-desktop text-right">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary transition-colors">more_vert</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="h-48 border-t border-outline-variant p-md flex flex-col gap-md shrink-0 bg-white">
<div className="flex justify-between items-center">
<div className="flex items-center gap-sm">
<h3 className="font-headline-sm text-on-surface">Re-activation Batch</h3>
<span className="bg-primary text-white text-[10px] px-2 py-0.5 rounded-full font-bold">DUE TODAY</span>
</div>
<button className="text-primary font-label-md flex items-center gap-1 hover:underline">
                            View Schedule <span className="material-symbols-outlined text-sm">arrow_forward</span>
</button>
</div>
<div className="flex gap-md overflow-x-auto custom-scrollbar pb-2">

<div className="min-w-[280px] bg-white border border-outline-variant p-sm rounded-lg flex items-center gap-md">
<div className="w-12 h-12 bg-primary-container/10 rounded flex items-center justify-center text-primary">
<span className="material-symbols-outlined">restart_alt</span>
</div>
<div className="flex-1">
<p className="font-bold text-body-md">Cold Leads Re-run</p>
<p className="text-xs text-on-surface-variant">42 leads pending call-back</p>
<div className="mt-2 h-1 w-full bg-outline-variant rounded-full">
<div className="h-full bg-primary" style={{"width": "60%"}}></div>
</div>
</div>
</div>

<div className="min-w-[280px] bg-white border border-outline-variant p-sm rounded-lg flex items-center gap-md">
<div className="w-12 h-12 bg-secondary-container/20 rounded flex items-center justify-center text-secondary">
<span className="material-symbols-outlined">history_toggle_off</span>
</div>
<div className="flex-1">
<p className="font-bold text-body-md">Dormant Account Ping</p>
<p className="text-xs text-on-surface-variant">15 leads for WA automation</p>
<div className="mt-2 h-1 w-full bg-outline-variant rounded-full">
<div className="h-full bg-secondary" style={{"width": "30%"}}></div>
</div>
</div>
</div>

<div className="min-w-[280px] bg-white border border-outline-variant p-sm rounded-lg flex items-center gap-md">
<div className="w-12 h-12 bg-tertiary-container/10 rounded flex items-center justify-center text-tertiary">
<span className="material-symbols-outlined">campaign</span>
</div>
<div className="flex-1">
<p className="font-bold text-body-md">Festive Seasonal Reach</p>
<p className="text-xs text-on-surface-variant">88 leads from Q3 archive</p>
<div className="mt-2 h-1 w-full bg-outline-variant rounded-full">
<div className="h-full bg-tertiary" style={{"width": "10%"}}></div>
</div>
</div>
</div>
</div>
</div>
</div>

<aside className="w-[320px] bg-white border-l border-outline-variant flex flex-col shrink-0">
<div className="p-md border-b border-outline-variant">
<h2 className="font-headline-sm flex items-center gap-sm">
<span className="material-symbols-outlined text-primary">assignment_ind</span>
                        Assignment
                    </h2>
</div>
<div className="flex-1 p-md flex flex-col gap-lg">

<div className="grid grid-cols-2 gap-sm">
<div className="p-sm bg-surface-container-low border border-outline-variant rounded">
<p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Selected</p>
<p className="text-display-lg leading-none mt-1">08</p>
</div>
<div className="p-sm bg-surface-container-low border border-outline-variant rounded">
<p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Unassigned</p>
<p className="text-display-lg text-error leading-none mt-1">14</p>
</div>
</div>
<div className="space-y-md">
<div className="flex justify-between items-center">
<span className="font-label-md text-on-surface">Manual Override</span>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox" value="" />
<div className="w-9 h-5 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>

<div className="space-y-sm">
<label className="text-xs font-bold text-on-surface-variant uppercase block">Select Target Agent</label>
<div className="relative">
<select className="w-full pl-3 pr-10 py-2 border border-outline-variant rounded-lg bg-surface text-body-md focus:ring-1 focus:ring-primary-container focus:outline-none appearance-none">
<option>Select Agent...</option>
<option>Aman K. (Capacity: 80%)</option>
<option>Sonia R. (Capacity: 95%)</option>
<option>John Doe (Capacity: 40%)</option>
<option>Rahul V. (Capacity: 60%)</option>
</select>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant">expand_more</span>
</div>
</div>
<div className="space-y-sm">
<label className="text-xs font-bold text-on-surface-variant uppercase block">Re-assignment Priority</label>
<div className="flex gap-2">
<button className="flex-1 py-2 border border-outline-variant rounded-lg text-xs font-bold hover:bg-surface-container-high transition-colors">Low</button>
<button className="flex-1 py-2 border border-primary-container bg-primary-container/10 text-on-primary-container rounded-lg text-xs font-bold">High</button>
<button className="flex-1 py-2 border border-error bg-error/10 text-error rounded-lg text-xs font-bold">Urgent</button>
</div>
</div>
<div className="space-y-sm pt-md">
<button className="w-full py-3 bg-primary text-white rounded-lg font-bold hover:opacity-90 transition-opacity shadow-sm">
                                Confirm Assignment
                            </button>
<button className="w-full py-3 text-on-surface-variant text-body-sm font-medium hover:bg-surface-container transition-colors rounded-lg">
                                Discard Changes
                            </button>
</div>
</div>

<div className="mt-auto pt-lg border-t border-outline-variant">
<div className="relative h-24 w-full rounded-lg overflow-hidden border border-outline-variant">
<div className="bg-cover bg-center w-full h-full opacity-60" data-alt="A clean, minimalist 3D rendering of a modern logistics dashboard interface on a tablet screen, showing data visualizations like bar charts and progress rings. The style is strictly light mode with soft shadows, high-key lighting, and a palette of warm ambers and muted greys, symbolizing organized data management for a premium corporate logistics brand." style={{"backgroundImage": "url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCeOkcztyfrttcb5XGRAt54b94oA7CzkqGBTD05YAqJJBLrZJa9RJGiNVWhQSngRjB9d-g6XQQ-DqVFpKt9OyCMwWLy7VwLbcbqpQlXojl5osK5hW_cu8vsYftreSlDV1V3_Z1Z8BOaPifEnTOCVio23VMOygc-g2azUZqvasRTWxg4cXUxaXd0h45GDu3JTLZu2IRMgXXZ76xubqJtSp7wLzFGzAKXlceUBpaUSBIIOIzjaFLJAwSJl8EqJNJ6GH_sAfae_Cza9eY\')"}}></div>
<div className="absolute inset-0 flex flex-col justify-center items-center text-center p-2 bg-white/40">
<p className="text-[10px] font-bold uppercase tracking-widest text-primary">System Auto-Rebalancing</p>
<p className="text-[9px] text-on-surface-variant mt-1">Manual overrides affect load balancing algorithm by ~12%.</p>
</div>
</div>
</div>
</div>
</aside>
</div>
</main>
  );
};

export default TlLeadQueueManager;
