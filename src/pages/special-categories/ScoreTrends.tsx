import React from 'react';

export const ScoreTrends: React.FC = () => {
  return (
    <main className="flex flex-col">



<div className="p-margin-desktop space-y-6 flex-1">
<div className="flex items-center justify-between">
<div className="space-y-1">
<h2 className="font-display text-display text-on-surface">Score Performance Analytics</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-[16px]">info</span>
                        Aggregated trends across 4 logistics vertical processes and 24 agents.
                    </p>
</div>
<div className="flex gap-2">
<button className="px-4 py-1.5 rounded-lg border border-outline-variant text-label-md font-label-md bg-surface hover:bg-surface-container transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-sm">download</span> Export PDF
                    </button>
<button className="px-4 py-1.5 rounded-lg border border-outline-variant text-label-md font-label-md bg-surface hover:bg-surface-container transition-colors flex items-center gap-2">
<span className="material-symbols-outlined text-sm">filter_alt</span> Filters
                    </button>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-gutter">

<div className="bg-surface rounded-xl chart-container p-6 flex flex-col gap-4">
<div className="flex items-center justify-between">
<h3 className="font-headline-md text-headline-md text-on-surface">Individual Performance (8W)</h3>
<div className="flex gap-4">
<div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-primary"></span> Top Perf.
                            </div>
<div className="flex items-center gap-1.5 text-[10px] font-bold text-on-surface-variant">
<span className="w-2 h-2 rounded-full bg-error"></span> Critical
                            </div>
</div>
</div>
<div className="relative h-64 w-full bg-[radial-gradient(#e0e3e5_1px,transparent_1px)] [background-size:20px_20px]">
<svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 400 150">

<line stroke="#eceef0" stroke-dasharray="4" x1="0" x2="100%" y1="25%" y2="25%"></line>
<line stroke="#eceef0" stroke-dasharray="4" x1="0" x2="100%" y1="50%" y2="50%"></line>
<line stroke="#eceef0" stroke-dasharray="4" x1="0" x2="100%" y1="75%" y2="75%"></line>

<path d="M 0 100 Q 50 110, 100 90 T 200 120 T 300 135 T 400 145" fill="none" stroke="#ba1a1a" strokeLinecap="round" strokeWidth="3"></path>
<circle cx="400" cy="145" fill="#ba1a1a" r="4"></circle>

<path d="M 0 40 Q 80 35, 160 45 T 320 30 T 400 25" fill="none" stroke="#80409b" stroke-opacity="0.6" strokeWidth="2"></path>
<path d="M 0 60 Q 80 55, 160 65 T 320 50 T 400 45" fill="none" stroke="#80409b" stroke-opacity="0.3" strokeWidth="1.5"></path>
<path d="M 0 80 Q 80 75, 160 85 T 320 70 T 400 65" fill="none" stroke="#80409b" stroke-opacity="0.3" strokeWidth="1.5"></path>
</svg>

<div className="absolute bottom-0 left-0 right-0 flex justify-between text-[10px] text-on-surface-variant font-bold px-2 pt-2 border-t border-outline-variant">
<span>WK 12</span><span>WK 13</span><span>WK 14</span><span>WK 15</span><span>WK 16</span><span>WK 17</span><span>WK 18</span><span>WK 19</span>
</div>
</div>
<div className="flex flex-wrap gap-x-6 gap-y-2 pt-2">
<span className="text-table-data font-table-data text-on-surface-variant flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span> Arjun V.</span>
<span className="text-table-data font-table-data text-on-surface-variant flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span> Sneha K.</span>
<span className="text-table-data font-table-data text-on-surface-variant flex items-center gap-2 font-bold"><span className="w-1.5 h-1.5 rounded-full bg-error"></span> Rahul M. (Alert)</span>
<span className="text-table-data font-table-data text-on-surface-variant flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-primary/40"></span> Priya R.</span>
</div>
</div>

<div className="bg-surface rounded-xl chart-container p-6 flex flex-col gap-4">
<div className="flex items-center justify-between">
<h3 className="font-headline-md text-headline-md text-on-surface">Process Average (W-o-W)</h3>
<div className="flex items-center gap-3">
<span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1"><span className="w-3 h-3 bg-secondary-container rounded-sm"></span> Prev Week</span>
<span className="text-[10px] font-bold text-on-surface-variant flex items-center gap-1"><span className="w-3 h-3 bg-primary-container rounded-sm"></span> Current</span>
</div>
</div>
<div className="flex-1 flex flex-col justify-between gap-6 py-4">

<div className="space-y-1">
<div className="flex justify-between items-center text-label-caps font-label-caps">
<span>Domestic Waste (DW)</span>
<span className="text-primary">+4.2%</span>
</div>
<div className="relative h-6 flex gap-1">
<div className="h-full bg-secondary-container rounded-r-sm transition-all" style={{"width": "78%"}}></div>
<div className="h-full bg-primary-container rounded-r-sm transition-all" style={{"width": "84%"}}></div>
</div>
</div>

<div className="space-y-1">
<div className="flex justify-between items-center text-label-caps font-label-caps">
<span>Truck Rental (TR)</span>
<span className="text-on-surface-variant">0.0%</span>
</div>
<div className="relative h-6 flex gap-1">
<div className="h-full bg-secondary-container rounded-r-sm transition-all" style={{"width": "92%"}}></div>
<div className="h-full bg-primary-container rounded-r-sm transition-all" style={{"width": "92%"}}></div>
</div>
</div>

<div className="space-y-1">
<div className="flex justify-between items-center text-label-caps font-label-caps">
<span>Middle Mile (MM)</span>
<span className="text-error">-1.5%</span>
</div>
<div className="relative h-6 flex gap-1">
<div className="h-full bg-secondary-container rounded-r-sm transition-all" style={{"width": "86%"}}></div>
<div className="h-full bg-primary-container rounded-r-sm transition-all" style={{"width": "84%"}}></div>
</div>
</div>

<div className="space-y-1">
<div className="flex justify-between items-center text-label-caps font-label-caps">
<span>Supply Chain (SC)</span>
<span className="text-primary">+2.1%</span>
</div>
<div className="relative h-6 flex gap-1">
<div className="h-full bg-secondary-container rounded-r-sm transition-all" style={{"width": "72%"}}></div>
<div className="h-full bg-primary-container rounded-r-sm transition-all" style={{"width": "75%"}}></div>
</div>
</div>
</div>
</div>
</div>

<div className="bg-surface rounded-xl chart-container overflow-hidden">
<div className="p-6 border-b border-outline-variant flex justify-between items-center bg-surface-container-lowest">
<div className="flex items-center gap-4">
<h3 className="font-headline-md text-headline-md text-on-surface">Criterion Breakdown Heatmap</h3>
<div className="h-4 w-[1px] bg-outline-variant"></div>
<p className="text-body-sm font-body-sm text-on-surface-variant italic">Showing current week data across 10 sample callers</p>
</div>
<div className="flex items-center gap-3">
<span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Low</span>
<div className="flex h-3 w-32 rounded-full overflow-hidden">
<div className="flex-1 bg-error"></div>
<div className="flex-1 bg-error/60"></div>
<div className="flex-1 bg-tertiary-container/40"></div>
<div className="flex-1 bg-tertiary-container"></div>
<div className="flex-1 bg-green-500/60"></div>
<div className="flex-1 bg-green-600"></div>
</div>
<span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">High</span>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead>
<tr className="bg-surface-container-low text-label-caps font-label-caps text-on-surface-variant">
<th className="text-left py-3 px-6 border-b border-outline-variant sticky left-0 bg-surface-container-low z-10 w-48">Caller Name</th>
<th className="py-3 px-2 border-b border-outline-variant text-center">Opening</th>
<th className="py-3 px-2 border-b border-outline-variant text-center">Tone</th>
<th className="py-3 px-2 border-b border-outline-variant text-center">Script</th>
<th className="py-3 px-2 border-b border-outline-variant text-center">Product K.</th>
<th className="py-3 px-2 border-b border-outline-variant text-center">Empathy</th>
<th className="py-3 px-2 border-b border-outline-variant text-center">Resolution</th>
<th className="py-3 px-2 border-b border-outline-variant text-center">Closing</th>
</tr>
</thead>
<tbody className="text-table-data font-table-data text-on-surface">

<tr className="border-b border-outline-variant hover:bg-surface-container-low/50">
<td className="py-2 px-6 font-bold sticky left-0 bg-white group-hover:bg-transparent">Rahul Mehta</td>
<td className="p-1"><div className="heatmap-cell bg-green-600 flex items-center justify-center text-white text-[10px]">98</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-500/60 flex items-center justify-center text-on-surface text-[10px]">85</div></td>
<td className="p-1"><div className="heatmap-cell bg-tertiary-container flex items-center justify-center text-on-surface text-[10px]">72</div></td>
<td className="p-1"><div className="heatmap-cell bg-error flex items-center justify-center text-white text-[10px]">34</div></td>
<td className="p-1"><div className="heatmap-cell bg-tertiary-container/40 flex items-center justify-center text-on-surface text-[10px]">68</div></td>
<td className="p-1"><div className="heatmap-cell bg-error/60 flex items-center justify-center text-on-surface text-[10px]">45</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-600 flex items-center justify-center text-white text-[10px]">95</div></td>
</tr>

<tr className="border-b border-outline-variant hover:bg-surface-container-low/50">
<td className="py-2 px-6 font-bold sticky left-0 bg-white">Sneha Kapoor</td>
<td className="p-1"><div className="heatmap-cell bg-green-600 flex items-center justify-center text-white text-[10px]">100</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-600 flex items-center justify-center text-white text-[10px]">98</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-500/60 flex items-center justify-center text-on-surface text-[10px]">90</div></td>
<td className="p-1"><div className="heatmap-cell bg-tertiary-container/40 flex items-center justify-center text-on-surface text-[10px]">62</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-600 flex items-center justify-center text-white text-[10px]">96</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-500/60 flex items-center justify-center text-on-surface text-[10px]">88</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-600 flex items-center justify-center text-white text-[10px]">98</div></td>
</tr>

<tr className="border-b border-outline-variant hover:bg-surface-container-low/50">
<td className="py-2 px-6 font-bold sticky left-0 bg-white">Arjun Verma</td>
<td className="p-1"><div className="heatmap-cell bg-green-500/60 flex items-center justify-center text-on-surface text-[10px]">88</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-500/60 flex items-center justify-center text-on-surface text-[10px]">92</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-600 flex items-center justify-center text-white text-[10px]">96</div></td>
<td className="p-1"><div className="heatmap-cell bg-error/60 flex items-center justify-center text-on-surface text-[10px]">48</div></td>
<td className="p-1"><div className="heatmap-cell bg-tertiary-container flex items-center justify-center text-on-surface text-[10px]">74</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-500/60 flex items-center justify-center text-on-surface text-[10px]">82</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-600 flex items-center justify-center text-white text-[10px]">94</div></td>
</tr>

<tr className="border-b border-outline-variant hover:bg-surface-container-low/50">
<td className="py-2 px-6 font-bold sticky left-0 bg-white">Priya Rai</td>
<td className="p-1"><div className="heatmap-cell bg-green-600 flex items-center justify-center text-white text-[10px]">96</div></td>
<td className="p-1"><div className="heatmap-cell bg-tertiary-container flex items-center justify-center text-on-surface text-[10px]">78</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-500/60 flex items-center justify-center text-on-surface text-[10px]">88</div></td>
<td className="p-1"><div className="heatmap-cell bg-error flex items-center justify-center text-white text-[10px]">28</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-500/60 flex items-center justify-center text-on-surface text-[10px]">84</div></td>
<td className="p-1"><div className="heatmap-cell bg-tertiary-container/40 flex items-center justify-center text-on-surface text-[10px]">66</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-500/60 flex items-center justify-center text-on-surface text-[10px]">88</div></td>
</tr>

<tr className="border-b border-outline-variant hover:bg-surface-container-low/50">
<td className="py-2 px-6 font-bold sticky left-0 bg-white">Vikram S.</td>
<td className="p-1"><div className="heatmap-cell bg-green-500/60 flex items-center justify-center text-on-surface text-[10px]">84</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-600 flex items-center justify-center text-white text-[10px]">96</div></td>
<td className="p-1"><div className="heatmap-cell bg-tertiary-container flex items-center justify-center text-on-surface text-[10px]">72</div></td>
<td className="p-1"><div className="heatmap-cell bg-error flex items-center justify-center text-white text-[10px]">38</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-600 flex items-center justify-center text-white text-[10px]">94</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-500/60 flex items-center justify-center text-on-surface text-[10px]">82</div></td>
<td className="p-1"><div className="heatmap-cell bg-green-600 flex items-center justify-center text-white text-[10px]">96</div></td>
</tr>
</tbody>
</table>
</div>
<div className="p-4 bg-primary-container/10 border-t border-outline-variant">
<p className="font-body-sm text-body-sm text-on-primary-fixed-variant flex items-center gap-2">
<span className="material-symbols-outlined text-[18px]">lightbulb</span>
<strong>Executive Summary:</strong> "Opening scores strong across team. Product Knowledge remains weakest criterion."
                    </p>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div className="bg-surface p-4 rounded-xl chart-container border-l-4 border-l-primary flex items-start gap-4">
<div className="bg-primary/10 p-2 rounded-lg">
<span className="material-symbols-outlined text-primary">trending_up</span>
</div>
<div>
<p className="text-label-caps font-label-caps text-on-surface-variant">Top Gainer</p>
<p className="font-headline-md text-headline-md text-on-surface">Arjun Verma</p>
<p className="text-body-sm font-body-sm text-primary">+12% vs Prev. Month</p>
</div>
</div>
<div className="bg-surface p-4 rounded-xl chart-container border-l-4 border-l-error flex items-start gap-4">
<div className="bg-error/10 p-2 rounded-lg">
<span className="material-symbols-outlined text-error">priority_high</span>
</div>
<div>
<p className="text-label-caps font-label-caps text-on-surface-variant">Highest Risk</p>
<p className="font-headline-md text-headline-md text-on-surface">Rahul Mehta</p>
<p className="text-body-sm font-body-sm text-error">Declined 3 consecutive weeks</p>
</div>
</div>
<div className="bg-surface p-4 rounded-xl chart-container border-l-4 border-l-secondary flex items-start gap-4">
<div className="bg-secondary/10 p-2 rounded-lg">
<span className="material-symbols-outlined text-secondary">groups</span>
</div>
<div>
<p className="text-label-caps font-label-caps text-on-surface-variant">Team Calibration</p>
<p className="font-headline-md text-headline-md text-on-surface">84.2%</p>
<p className="text-body-sm font-body-sm text-on-surface-variant">Within target variance of 5%</p>
</div>
</div>
</div>
</div>
</main>
  );
};

export default ScoreTrends;
