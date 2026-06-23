import React from 'react';

export const ThReportsHub: React.FC = () => {
  return (
    <main className=" p-md flex gap-md min-h-[calc(100vh-56px)]">

<aside className="w-64 flex-shrink-0 space-y-2">
<div className="bg-surface p-sm rounded border border-outline-variant">
<p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-sm px-xs font-bold tracking-widest">Performance Hub</p>
<div className="space-y-1">
<button className="report-nav-active w-full text-left px-sm py-md font-label-caps text-label-caps flex items-center justify-between rounded transition-all group" id="nav-revenue" >
<span className="flex items-center gap-sm"><span className="material-symbols-outlined text-[20px]" data-icon="payments">payments</span> Revenue Report</span>
<span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
</button>
<button className="w-full text-left px-sm py-md font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-high flex items-center justify-between rounded transition-all group">
<span className="flex items-center gap-sm"><span className="material-symbols-outlined text-[20px]" data-icon="filter_alt">filter_alt</span> Funnel Report</span>
</button>
<button className="w-full text-left px-sm py-md font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-high flex items-center justify-between rounded transition-all group" id="nav-benchmarking" >
<span className="flex items-center gap-sm"><span className="material-symbols-outlined text-[20px]" data-icon="monitoring">monitoring</span> Caller Benchmarking</span>
</button>
<button className="w-full text-left px-sm py-md font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-high flex items-center justify-between rounded transition-all group">
<span className="flex items-center gap-sm"><span className="material-symbols-outlined text-[20px]" data-icon="trending_up">trending_up</span> QC Trend</span>
</button>
<button className="w-full text-left px-sm py-md font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-high flex items-center justify-between rounded transition-all group">
<span className="flex items-center gap-sm"><span className="material-symbols-outlined text-[20px]" data-icon="redeem">redeem</span> Incentive Summary</span>
</button>
<button className="w-full text-left px-sm py-md font-label-caps text-label-caps text-on-surface-variant hover:bg-surface-container-high flex items-center justify-between rounded transition-all group">
<span className="flex items-center gap-sm"><span className="material-symbols-outlined text-[20px]" data-icon="event_available">event_available</span> Attendance</span>
</button>
</div>
</div>
<div className="bg-primary-container text-on-primary-container p-md rounded-lg shadow-sm">
<p className="font-label-caps text-label-caps font-bold mb-xs">Download Center</p>
<p className="text-[11px] opacity-80 mb-md">All scheduled reports are ready for bulk export.</p>
<button className="w-full bg-white text-primary font-label-caps text-label-caps py-2 rounded font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-sm">
<span className="material-symbols-outlined text-[18px]" data-icon="download">download</span> Export Daily Batch
                </button>
</div>
</aside>

<section className="flex-grow space-y-md" id="content-canvas">

<div className="space-y-md" id="view-revenue">

<div className="flex items-center justify-between bg-white p-md rounded border border-outline-variant shadow-sm">
<div>
<h2 className="font-headline-md text-headline-md font-bold">Revenue Analysis</h2>
<p className="text-on-surface-variant text-body-sm">Visualizing monetary conversion across processes and callers.</p>
</div>
<div className="flex items-center gap-sm">
<div className="flex items-center bg-surface-container-low border border-outline-variant rounded px-sm py-1">
<span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-xs" data-icon="calendar_today">calendar_today</span>
<span className="font-label-caps text-label-caps">Oct 01 - Oct 31, 2023</span>
</div>
<button className="bg-primary text-white px-md py-1.5 rounded font-label-caps text-label-caps font-bold hover:brightness-110 transition-all">
                            Filter Data
                        </button>
</div>
</div>

<div className="bento-grid">

<div className="col-span-7 bg-white p-md rounded border border-outline-variant shadow-sm flex flex-col">
<div className="flex justify-between items-center mb-md">
<h3 className="font-label-caps text-label-caps font-bold">Revenue by Process</h3>
<span className="material-symbols-outlined text-on-surface-variant cursor-help" data-icon="info" title="Total revenue generated per lead category">info</span>
</div>
<div className="flex-grow flex items-end gap-md h-48 pb-lg px-md">
<div className="flex-1 flex flex-col items-center gap-xs">
<div className="w-full bg-primary-container rounded-t" style={{"height": "85%"}}></div>
<span className="text-[10px] font-label-caps uppercase truncate w-full text-center">Fulfillment</span>
</div>
<div className="flex-1 flex flex-col items-center gap-xs">
<div className="w-full bg-primary-container rounded-t" style={{"height": "60%"}}></div>
<span className="text-[10px] font-label-caps uppercase truncate w-full text-center">Inbound Sales</span>
</div>
<div className="flex-1 flex flex-col items-center gap-xs">
<div className="w-full bg-secondary-container rounded-t" style={{"height": "95%"}}></div>
<span className="text-[10px] font-label-caps uppercase truncate w-full text-center">Urgent Lead</span>
</div>
<div className="flex-1 flex flex-col items-center gap-xs">
<div className="w-full bg-primary-container rounded-t" style={{"height": "40%"}}></div>
<span className="text-[10px] font-label-caps uppercase truncate w-full text-center">Recovery</span>
</div>
</div>
</div>

<div className="col-span-5 bg-white p-md rounded border border-outline-variant shadow-sm">
<h3 className="font-label-caps text-label-caps font-bold mb-md">Source Attribution</h3>
<div className="relative w-40 h-40 mx-auto mb-md">

<div className="w-full h-full rounded-full" style={{"background": "conic-gradient(#0056c3 0% 45%, #fd661d 45% 75%, #a73a00 75% 100%)"}}></div>
<div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
<span className="text-headline-md font-bold">1.2M</span>
<span className="text-[9px] uppercase font-bold text-on-surface-variant">Total Rev</span>
</div>
</div>
<div className="space-y-xs">
<div className="flex items-center justify-between text-[11px]">
<span className="flex items-center gap-xs"><div className="w-2 h-2 rounded-full bg-primary"></div> Digital Ads</span>
<span className="font-bold">45%</span>
</div>
<div className="flex items-center justify-between text-[11px]">
<span className="flex items-center gap-xs"><div className="w-2 h-2 rounded-full bg-secondary-container"></div> Referral</span>
<span className="font-bold">30%</span>
</div>
<div className="flex items-center justify-between text-[11px]">
<span className="flex items-center gap-xs"><div className="w-2 h-2 rounded-full bg-secondary"></div> Offline</span>
<span className="font-bold">25%</span>
</div>
</div>
</div>

<div className="col-span-12 bg-white p-md rounded border border-outline-variant shadow-sm">
<div className="flex justify-between items-center mb-lg">
<h3 className="font-label-caps text-label-caps font-bold">Top Callers Performance (Revenue Focus)</h3>
<div className="flex gap-sm">
<span className="flex items-center gap-xs text-[10px] font-bold uppercase"><div className="w-2 h-2 bg-primary"></div> Target</span>
<span className="flex items-center gap-xs text-[10px] font-bold uppercase"><div className="w-2 h-2 bg-secondary-container"></div> Achieved</span>
</div>
</div>
<div className="space-y-md">

<div className="flex items-center gap-md">
<div className="w-32 text-label-caps font-medium truncate">Amit Sharma</div>
<div className="flex-grow h-4 bg-surface-container-low rounded-full overflow-hidden flex">
<div className="bg-primary h-full" style={{"width": "85%"}}></div>
<div className="bg-secondary-container h-full" style={{"width": "10%", "marginLeft": "-5%"}}></div>
</div>
<div className="w-16 text-right font-data-mono text-data-mono">₹2.4L</div>
</div>

<div className="flex items-center gap-md">
<div className="w-32 text-label-caps font-medium truncate">Priya Verma</div>
<div className="flex-grow h-4 bg-surface-container-low rounded-full overflow-hidden flex">
<div className="bg-primary h-full" style={{"width": "70%"}}></div>
<div className="bg-secondary-container h-full" style={{"width": "25%", "marginLeft": "-5%"}}></div>
</div>
<div className="w-16 text-right font-data-mono text-data-mono">₹1.9L</div>
</div>

<div className="flex items-center gap-md">
<div className="w-32 text-label-caps font-medium truncate">Suresh Raina</div>
<div className="flex-grow h-4 bg-surface-container-low rounded-full overflow-hidden flex">
<div className="bg-primary h-full" style={{"width": "60%"}}></div>
<div className="bg-secondary-container h-full" style={{"width": "30%", "marginLeft": "-5%"}}></div>
</div>
<div className="w-16 text-right font-data-mono text-data-mono">₹1.7L</div>
</div>
</div>
</div>
</div>

<div className="bg-white rounded border border-outline-variant shadow-sm overflow-hidden">
<div className="px-md py-sm bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center">
<h3 className="font-label-caps text-label-caps font-bold">Transaction Breakdown</h3>
<button className="text-primary font-label-caps text-label-caps flex items-center gap-xs">
<span className="material-symbols-outlined text-[18px]" data-icon="tune">tune</span> Advanced Filters
                        </button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-[#F0F2F5]">
<tr>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Date</th>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Caller Name</th>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Process</th>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Units</th>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Lead Type</th>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-right">Revenue</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-md py-sm font-data-mono text-data-mono">12/10/2023</td>
<td className="px-md py-sm text-label-caps font-medium">Amit Sharma</td>
<td className="px-md py-sm text-label-caps">Fulfillment</td>
<td className="px-md py-sm text-label-caps">24</td>
<td className="px-md py-sm">
<span className="px-sm py-0.5 rounded-full bg-error-container text-error text-[10px] font-bold uppercase">Hot</span>
</td>
<td className="px-md py-sm font-data-mono text-data-mono text-right">₹45,200</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-md py-sm font-data-mono text-data-mono">12/10/2023</td>
<td className="px-md py-sm text-label-caps font-medium">Priya Verma</td>
<td className="px-md py-sm text-label-caps">Inbound Sales</td>
<td className="px-md py-sm text-label-caps">18</td>
<td className="px-md py-sm">
<span className="px-sm py-0.5 rounded-full bg-primary-container text-white text-[10px] font-bold uppercase">Warm</span>
</td>
<td className="px-md py-sm font-data-mono text-data-mono text-right">₹32,150</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-md py-sm font-data-mono text-data-mono">11/10/2023</td>
<td className="px-md py-sm text-label-caps font-medium">Suresh Raina</td>
<td className="px-md py-sm text-label-caps">Urgent Lead</td>
<td className="px-md py-sm text-label-caps">42</td>
<td className="px-md py-sm">
<span className="px-sm py-0.5 rounded-full bg-error-container text-error text-[10px] font-bold uppercase">Hot</span>
</td>
<td className="px-md py-sm font-data-mono text-data-mono text-right">₹88,900</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>

<div className="hidden space-y-md" id="view-benchmarking">
<div className="flex items-center justify-between bg-white p-md rounded border border-outline-variant shadow-sm">
<div>
<h2 className="font-headline-md text-headline-md font-bold">Caller Benchmarking</h2>
<p className="text-on-surface-variant text-body-sm">Standardized comparison across all operational metrics.</p>
</div>
<div className="flex items-center gap-sm">
<button className="bg-[#FB641B] text-white px-md py-1.5 rounded font-label-caps text-label-caps font-bold hover:brightness-110 transition-all flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px]" data-icon="ios_share">ios_share</span> Export Full Benchmarks
                        </button>
</div>
</div>
<div className="bg-white rounded border border-outline-variant shadow-sm overflow-hidden">
<table className="w-full text-left border-collapse">
<thead className="bg-[#F0F2F5]">
<tr>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase sticky left-0 bg-[#F0F2F5]">Agent Identity</th>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">Calls/Day</th>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">Conv. Rate</th>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">Avg Duration</th>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">Revenue/Agent</th>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">QC Score</th>
<th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Trend</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-md sticky left-0 bg-white">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center font-bold text-xs">AS</div>
<div>
<p className="font-label-caps text-label-caps font-bold">Amit Sharma</p>
<p className="text-[10px] text-on-surface-variant">Lvl 4 Senior</p>
</div>
</div>
</td>
<td className="px-md py-md text-center font-data-mono text-data-mono">142</td>
<td className="px-md py-md text-center">
<p className="font-data-mono text-data-mono text-green-600">12.4%</p>
<div className="w-full bg-surface-container-high h-1 rounded-full mt-1"><div className="bg-green-500 h-full w-[80%]"></div></div>
</td>
<td className="px-md py-md text-center font-data-mono text-data-mono">04:12</td>
<td className="px-md py-md text-center font-data-mono text-data-mono">₹2.41L</td>
<td className="px-md py-md text-center">
<span className="px-sm py-1 bg-green-100 text-green-800 text-[11px] font-bold rounded">9.2/10</span>
</td>
<td className="px-md py-md">
<span className="material-symbols-outlined text-green-500" data-icon="trending_up">trending_up</span>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-md sticky left-0 bg-white">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center font-bold text-xs">PV</div>
<div>
<p className="font-label-caps text-label-caps font-bold">Priya Verma</p>
<p className="text-[10px] text-on-surface-variant">Lvl 3 Associate</p>
</div>
</div>
</td>
<td className="px-md py-md text-center font-data-mono text-data-mono">118</td>
<td className="px-md py-md text-center">
<p className="font-data-mono text-data-mono text-amber-600">8.1%</p>
<div className="w-full bg-surface-container-high h-1 rounded-full mt-1"><div className="bg-amber-500 h-full w-[55%]"></div></div>
</td>
<td className="px-md py-md text-center font-data-mono text-data-mono">03:45</td>
<td className="px-md py-md text-center font-data-mono text-data-mono">₹1.88L</td>
<td className="px-md py-md text-center">
<span className="px-sm py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded">7.8/10</span>
</td>
<td className="px-md py-md">
<span className="material-symbols-outlined text-amber-500" data-icon="trending_flat">trending_flat</span>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-md sticky left-0 bg-white">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center font-bold text-xs">SR</div>
<div>
<p className="font-label-caps text-label-caps font-bold">Suresh Raina</p>
<p className="text-[10px] text-on-surface-variant">Lvl 4 Senior</p>
</div>
</div>
</td>
<td className="px-md py-md text-center font-data-mono text-data-mono">156</td>
<td className="px-md py-md text-center">
<p className="font-data-mono text-data-mono text-green-600">10.2%</p>
<div className="w-full bg-surface-container-high h-1 rounded-full mt-1"><div className="bg-green-500 h-full w-[72%]"></div></div>
</td>
<td className="px-md py-md text-center font-data-mono text-data-mono">05:30</td>
<td className="px-md py-md text-center font-data-mono text-data-mono">₹1.72L</td>
<td className="px-md py-md text-center">
<span className="px-sm py-1 bg-red-100 text-red-800 text-[11px] font-bold rounded">6.4/10</span>
</td>
<td className="px-md py-md">
<span className="material-symbols-outlined text-red-500" data-icon="trending_down">trending_down</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</section>
</main>
  );
};

export default ThReportsHub;
