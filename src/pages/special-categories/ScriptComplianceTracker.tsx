import React from 'react';

export const ScriptComplianceTracker: React.FC = () => {
  return (
    <main className="p-margin-desktop space-y-6">

<div className="bg-error-container/40 border border-error/20 rounded-lg p-4 flex items-center justify-between">
<div className="flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center text-error">
<span className="material-symbols-outlined">warning</span>
</div>
<div>
<h4 className="font-headline-md text-headline-md text-error leading-tight">Most-skipped sections alert</h4>
<p className="text-body-sm text-on-surface-variant">The <span className="font-bold text-on-surface">"Upsell - Insurance Protection"</span> section has dropped to 42% adherence in the last 48 hours across MM and TR processes.</p>
</div>
</div>
<button className="bg-surface-container-highest hover:bg-surface-variant text-on-surface px-4 py-2 rounded border border-outline-variant font-label-md text-label-md transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-sm">flag</span>
                    Flag for Script Review
                </button>
</div>

<div className="flex items-end justify-between">
<div>
<h1 className="font-display text-display text-primary">Script Compliance Tracker</h1>
<p className="text-body-sm text-on-surface-variant">Real-time adherence monitoring across all operational workflows.</p>
</div>
<div className="flex gap-3">
<div className="flex flex-col gap-1">
<span className="font-label-caps text-label-caps text-on-surface-variant">Timeframe</span>
<select className="bg-surface border border-outline-variant rounded-lg text-table-data px-3 py-1.5 focus:ring-1 focus:ring-primary outline-none">
<option>Last 7 Days</option>
<option>Last 30 Days</option>
<option>Custom Range</option>
</select>
</div>
<div className="flex flex-col gap-1">
<span className="font-label-caps text-label-caps text-on-surface-variant">Process</span>
<div className="flex bg-surface-container rounded-lg p-0.5 border border-outline-variant">
<button className="px-3 py-1 text-table-data bg-surface shadow-sm rounded-md font-bold text-primary">All</button>
<button className="px-3 py-1 text-table-data hover:bg-surface-variant/30 rounded-md">DW</button>
<button className="px-3 py-1 text-table-data hover:bg-surface-variant/30 rounded-md">TR</button>
<button className="px-3 py-1 text-table-data hover:bg-surface-variant/30 rounded-md">MM</button>
<button className="px-3 py-1 text-table-data hover:bg-surface-variant/30 rounded-md">SC</button>
</div>
</div>
</div>
</div>

<div className="bg-surface border border-outline-variant rounded-xl overflow-hidden shadow-sm">
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="sticky left-0 bg-surface-container-low z-20 p-4 text-left font-label-caps text-label-caps text-on-surface-variant w-48 border-r border-outline-variant">Caller Name / Process</th>
<th className="p-4 text-center font-label-caps text-label-caps text-on-surface-variant min-w-[120px]">Opening</th>
<th className="p-4 text-center font-label-caps text-label-caps text-on-surface-variant min-w-[120px]">Pitch</th>
<th className="p-4 text-center font-label-caps text-label-caps text-on-surface-variant min-w-[120px]">Upsell</th>
<th className="p-4 text-center font-label-caps text-label-caps text-on-surface-variant min-w-[120px]">Objections</th>
<th className="p-4 text-center font-label-caps text-label-caps text-on-surface-variant min-w-[120px]">Closing</th>
<th className="p-4 text-center font-label-caps text-label-caps text-on-surface-variant min-w-[100px] bg-primary/5">Avg. Compliance</th>
</tr>
</thead>
<tbody className="text-table-data">

<tr className="border-b border-outline-variant group">
<td className="sticky left-0 bg-surface group-hover:bg-surface-container z-20 p-3 border-r border-outline-variant flex items-center gap-3">
<div className="w-8 h-8 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[10px]">AS</div>
<div>
<div className="font-bold">Ankit Sharma</div>
<div className="text-[10px] text-on-surface-variant uppercase">DW Process</div>
</div>
</td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">94%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">88%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-yellow-100 text-yellow-800 font-bold rounded">76%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">82%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">91%</div></td>
<td className="p-1 bg-primary/5"><div className="h-10 w-full flex items-center justify-center font-bold text-primary">86.2%</div></td>
</tr>
<tr className="border-b border-outline-variant group">
<td className="sticky left-0 bg-surface group-hover:bg-surface-container z-20 p-3 border-r border-outline-variant flex items-center gap-3">
<div className="w-8 h-8 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[10px]">RV</div>
<div>
<div className="font-bold">Rahul Verma</div>
<div className="text-[10px] text-on-surface-variant uppercase">TR Process</div>
</div>
</td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">82%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-red-100 text-red-800 font-bold rounded">54%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-red-100 text-red-800 font-bold rounded">48%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-yellow-100 text-yellow-800 font-bold rounded">65%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">80%</div></td>
<td className="p-1 bg-primary/5"><div className="h-10 w-full flex items-center justify-center font-bold text-error">65.8%</div></td>
</tr>
<tr className="border-b border-outline-variant group">
<td className="sticky left-0 bg-surface group-hover:bg-surface-container z-20 p-3 border-r border-outline-variant flex items-center gap-3">
<div className="w-8 h-8 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[10px]">SY</div>
<div>
<div className="font-bold">Sneha Yadav</div>
<div className="text-[10px] text-on-surface-variant uppercase">MM Process</div>
</div>
</td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">98%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">92%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">85%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">94%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">96%</div></td>
<td className="p-1 bg-primary/5"><div className="h-10 w-full flex items-center justify-center font-bold text-primary">93.0%</div></td>
</tr>
<tr className="border-b border-outline-variant group">
<td className="sticky left-0 bg-surface group-hover:bg-surface-container z-20 p-3 border-r border-outline-variant flex items-center gap-3">
<div className="w-8 h-8 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[10px]">MK</div>
<div>
<div className="font-bold">Manish Kumar</div>
<div className="text-[10px] text-on-surface-variant uppercase">SC Process</div>
</div>
</td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-yellow-100 text-yellow-800 font-bold rounded">68%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-yellow-100 text-yellow-800 font-bold rounded">74%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-yellow-100 text-yellow-800 font-bold rounded">62%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">81%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-yellow-100 text-yellow-800 font-bold rounded">79%</div></td>
<td className="p-1 bg-primary/5"><div className="h-10 w-full flex items-center justify-center font-bold text-secondary">72.8%</div></td>
</tr>
<tr className="border-b border-outline-variant group">
<td className="sticky left-0 bg-surface group-hover:bg-surface-container z-20 p-3 border-r border-outline-variant flex items-center gap-3">
<div className="w-8 h-8 rounded bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[10px]">PD</div>
<div>
<div className="font-bold">Pooja Das</div>
<div className="text-[10px] text-on-surface-variant uppercase">DW Process</div>
</div>
</td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">90%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">85%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-yellow-100 text-yellow-800 font-bold rounded">70%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">88%</div></td>
<td className="p-1"><div className="heatmap-cell h-10 w-full flex items-center justify-center bg-green-100 text-green-800 font-bold rounded">92%</div></td>
<td className="p-1 bg-primary/5"><div className="h-10 w-full flex items-center justify-center font-bold text-primary">85.0%</div></td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div className="bg-surface border border-outline-variant rounded-lg p-stack-md flex flex-col gap-2">
<span className="font-label-caps text-label-caps text-on-surface-variant">Threshold Legend</span>
<div className="flex items-center gap-4">
<div className="flex items-center gap-1.5">
<div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
<span className="text-table-data">&lt;60% Critical</span>
</div>
<div className="flex items-center gap-1.5">
<div className="w-3 h-3 bg-yellow-100 border border-yellow-200 rounded"></div>
<span className="text-table-data">60-79% Needs Focus</span>
</div>
<div className="flex items-center gap-1.5">
<div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
<span className="text-table-data">&gt;=80% Optimal</span>
</div>
</div>
</div>
<div className="bg-surface border border-outline-variant rounded-lg p-stack-md flex justify-between items-center">
<div>
<span className="font-label-caps text-label-caps text-on-surface-variant">Global Adherence</span>
<div className="text-display font-display text-primary">78.4%</div>
</div>
<div className="text-right">
<span className="text-error text-body-sm font-bold flex items-center justify-end gap-1">
<span className="material-symbols-outlined text-sm">trending_down</span>
                            -2.1%
                        </span>
<span className="text-[10px] text-on-surface-variant">vs last month</span>
</div>
</div>
<div className="bg-surface border border-outline-variant rounded-lg p-stack-md flex flex-col justify-center">
<div className="flex items-center justify-between">
<span className="font-label-caps text-label-caps text-on-surface-variant">Top Performer</span>
<span className="text-table-data font-bold text-primary">Sneha Yadav (MM)</span>
</div>
<div className="w-full bg-surface-container h-1.5 rounded-full mt-2 overflow-hidden">
<div className="bg-primary h-full w-[93%]"></div>
</div>
</div>
</div>

<div className="grid grid-cols-4 gap-gutter h-64">
<div className="col-span-2 bg-surface border border-outline-variant rounded-xl p-stack-md flex flex-col">
<div className="flex justify-between items-center mb-4">
<h5 className="font-headline-md text-headline-md">Section Performance Over Time</h5>
<div className="flex gap-2">
<span className="text-[10px] font-bold text-primary flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-primary"></span> Opening</span>
<span className="text-[10px] font-bold text-secondary flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-secondary"></span> Pitch</span>
</div>
</div>
<div className="flex-1 flex items-end gap-2 px-2">

<div className="flex-1 bg-primary/10 rounded-t-sm h-[80%]"></div>
<div className="flex-1 bg-secondary/10 rounded-t-sm h-[60%]"></div>
<div className="flex-1 bg-primary/20 rounded-t-sm h-[85%]"></div>
<div className="flex-1 bg-secondary/20 rounded-t-sm h-[55%]"></div>
<div className="flex-1 bg-primary/30 rounded-t-sm h-[70%]"></div>
<div className="flex-1 bg-secondary/30 rounded-t-sm h-[65%]"></div>
<div className="flex-1 bg-primary/40 rounded-t-sm h-[90%]"></div>
<div className="flex-1 bg-secondary/40 rounded-t-sm h-[50%]"></div>
<div className="flex-1 bg-primary/50 rounded-t-sm h-[75%]"></div>
<div className="flex-1 bg-secondary/50 rounded-t-sm h-[58%]"></div>
</div>
</div>
<div className="col-span-1 bg-surface border border-outline-variant rounded-xl p-stack-md">
<h5 className="font-headline-md text-headline-md mb-3">Critical Flags</h5>
<div className="space-y-3">
<div className="flex items-start gap-2">
<span className="material-symbols-outlined text-error text-lg" data-weight="fill">report</span>
<div>
<p className="text-table-data font-bold">Fatal Greeting Missing</p>
<p className="text-[10px] text-on-surface-variant">4 occurrences today • TR</p>
</div>
</div>
<div className="flex items-start gap-2">
<span className="material-symbols-outlined text-error text-lg" data-weight="fill">report</span>
<div>
<p className="text-table-data font-bold">Unauthorized Upsell</p>
<p className="text-[10px] text-on-surface-variant">2 occurrences today • DW</p>
</div>
</div>
</div>
</div>
<div className="col-span-1 bg-primary-container text-on-primary-container rounded-xl p-stack-md flex flex-col justify-between">
<div>
<h5 className="font-headline-md text-headline-md text-white">Compliance Tip</h5>
<p className="text-body-sm text-white/80 mt-2">Callers using the "Conditional Pitch" technique show 15% higher upsell adherence. Consider suggesting this in next week's calibration.</p>
</div>
<button className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded font-bold text-table-data transition-colors">
                        View Best Practices
                    </button>
</div>
</div>
</main>
  );
};

export default ScriptComplianceTracker;
