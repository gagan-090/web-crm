import React from 'react';

export const BacklogCampaignManager: React.FC = () => {
  return (
    <main className=" flex flex-col h-full bg-background relative ">



<div className="flex-1 overflow-y-auto p-xl custom-scrollbar">

<div className="flex justify-between items-end mb-lg">
<div>
<div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant mb-1">
<span>Core Systems</span>
<span>/</span>
<span>Backlog</span>
<span>/</span>
<span className="font-bold text-primary">Campaign Manager</span>
</div>
<h1 className="font-display-sm text-display-sm text-on-surface font-bold">Campaign Manager &amp; Backlog Recovery</h1>
</div>
<div className="flex gap-2">
<button className="flex items-center gap-2 px-lg h-[32px] bg-white border border-outline-variant text-on-surface font-body-sm text-body-sm font-semibold hover:bg-surface-container-low transition-colors">
<span className="material-symbols-outlined text-base">file_download</span>
                        Export Report
                    </button>
<button className="flex items-center gap-2 px-lg h-[32px] bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:opacity-90 transition-opacity shadow-sm">
<span className="material-symbols-outlined text-base">add</span>
                        New Sprint Configuration
                    </button>
</div>
</div>

<div className="grid grid-cols-12 gap-lg">

<div className="col-span-12 md:col-span-3 admin-border bg-white p-lg shadow-sm">
<div className="flex justify-between items-start mb-4">
<p className="font-body-sm text-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Total Backlog Items</p>
<span className="material-symbols-outlined text-on-secondary-container">inventory_2</span>
</div>
<p className="font-display-sm text-display-sm font-bold text-on-surface">142,891</p>
<div className="mt-4 pt-4 border-t border-outline-variant flex justify-between">
<p className="text-body-sm font-body-sm text-on-surface-variant">+4.2% from last week</p>
<p className="text-body-sm font-body-sm text-error font-bold">CRITICAL</p>
</div>
</div>
<div className="col-span-12 md:col-span-3 admin-border bg-white p-lg shadow-sm border-l-4 border-l-tertiary-container">
<div className="flex justify-between items-start mb-4">
<p className="font-body-sm text-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Est. Recoverable Revenue</p>
<span className="material-symbols-outlined text-on-tertiary-fixed-variant">payments</span>
</div>
<p className="font-display-sm text-display-sm font-bold text-on-surface">₹2.48M</p>
<div className="mt-4 pt-4 border-t border-outline-variant">
<div className="w-full bg-surface-container-low h-1.5 rounded-full overflow-hidden">
<div className="bg-tertiary-container h-full w-[64%]"></div>
</div>
<p className="text-[10px] mt-1 text-on-surface-variant font-mono uppercase tracking-tighter">Target Recovery: ₹3.8M</p>
</div>
</div>
<div className="col-span-12 md:col-span-3 admin-border bg-white p-lg shadow-sm">
<div className="flex justify-between items-start mb-4">
<p className="font-body-sm text-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Active Sprints</p>
<span className="material-symbols-outlined text-on-secondary-container">directions_run</span>
</div>
<p className="font-display-sm text-display-sm font-bold text-on-surface">12</p>
<div className="mt-4 pt-4 border-t border-outline-variant flex justify-between">
<p className="text-body-sm font-body-sm text-on-surface-variant">Avg. Conversion: 8.4%</p>
<p className="text-body-sm font-body-sm text-primary font-bold">STABLE</p>
</div>
</div>
<div className="col-span-12 md:col-span-3 admin-border bg-white p-lg shadow-sm">
<div className="flex justify-between items-start mb-4">
<p className="font-body-sm text-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">Allocated Callers</p>
<span className="material-symbols-outlined text-on-secondary-container">support_agent</span>
</div>
<p className="font-display-sm text-display-sm font-bold text-on-surface">48 / 60</p>
<div className="mt-4 pt-4 border-t border-outline-variant flex justify-between">
<p className="text-body-sm font-body-sm text-on-surface-variant">Capacity Util: 80%</p>
<div className="flex -space-x-2">
<div className="w-6 h-6 rounded-full border border-white bg-slate-200"></div>
<div className="w-6 h-6 rounded-full border border-white bg-slate-300"></div>
<div className="w-6 h-6 rounded-full border border-white bg-slate-400"></div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-8 admin-border bg-white flex flex-col h-[480px]">
<div className="p-lg admin-border-b flex justify-between items-center bg-surface-container-low/50">
<h2 className="font-headline-sm text-headline-sm font-bold">Backlog Analysis by Process</h2>
<div className="flex items-center gap-2">
<button className="material-symbols-outlined p-1 text-on-surface-variant hover:bg-surface-variant/20">filter_list</button>
<button className="material-symbols-outlined p-1 text-on-surface-variant hover:bg-surface-variant/20">more_vert</button>
</div>
</div>
<div className="flex-1 overflow-auto custom-scrollbar">
<table className="w-full text-left border-collapse">
<thead className="sticky top-0 bg-surface-container-low z-10 shadow-sm border-b border-outline-variant">
<tr>
<th className="px-lg py-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Process ID</th>
<th className="px-lg py-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Process Name</th>
<th className="px-lg py-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Backlog Size</th>
<th className="px-lg py-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider text-right">Avg. Age</th>
<th className="px-lg py-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Revenue Risk</th>
<th className="px-lg py-sm text-[11px] font-bold text-on-surface-variant uppercase tracking-wider">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="px-lg py-sm font-code-sm text-code-sm text-primary">#PROC-8821</td>
<td className="px-lg py-sm font-body-sm text-body-sm font-semibold">Cold Re-activation A</td>
<td className="px-lg py-sm font-code-sm text-code-sm text-right">42,103</td>
<td className="px-lg py-sm font-body-sm text-body-sm text-right">18.4 Days</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span className="font-body-sm text-body-sm text-error font-bold">₹940,000</span>
</div>
</td>
<td className="px-lg py-sm">
<button className="text-primary font-bold text-[11px] hover:underline uppercase">Configure Sprint</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="px-lg py-sm font-code-sm text-code-sm text-primary">#PROC-9104</td>
<td className="px-lg py-sm font-body-sm text-body-sm font-semibold">Post-Service Follow-up</td>
<td className="px-lg py-sm font-code-sm text-code-sm text-right">12,492</td>
<td className="px-lg py-sm font-body-sm text-body-sm text-right">4.1 Days</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
<span className="font-body-sm text-body-sm text-amber-600 font-bold">₹210,500</span>
</div>
</td>
<td className="px-lg py-sm">
<button className="text-primary font-bold text-[11px] hover:underline uppercase">Configure Sprint</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="px-lg py-sm font-code-sm text-code-sm text-primary">#PROC-7723</td>
<td className="px-lg py-sm font-body-sm text-body-sm font-semibold">Incomplete Reg Recovery</td>
<td className="px-lg py-sm font-code-sm text-code-sm text-right">65,991</td>
<td className="px-lg py-sm font-body-sm text-body-sm text-right">32.2 Days</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span className="font-body-sm text-body-sm text-error font-bold">₹1,220,000</span>
</div>
</td>
<td className="px-lg py-sm">
<button className="text-primary font-bold text-[11px] hover:underline uppercase">Configure Sprint</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="px-lg py-sm font-code-sm text-code-sm text-primary">#PROC-4412</td>
<td className="px-lg py-sm font-body-sm text-body-sm font-semibold">Legacy Data Migration</td>
<td className="px-lg py-sm font-code-sm text-code-sm text-right">8,421</td>
<td className="px-lg py-sm font-body-sm text-body-sm text-right">150.0 Days</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-slate-400"></span>
<span className="font-body-sm text-body-sm text-on-surface-variant font-bold">₹42,000</span>
</div>
</td>
<td className="px-lg py-sm">
<button className="text-primary font-bold text-[11px] hover:underline uppercase">Configure Sprint</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low/30 transition-colors">
<td className="px-lg py-sm font-code-sm text-code-sm text-primary">#PROC-3329</td>
<td className="px-lg py-sm font-body-sm text-body-sm font-semibold">VIP Loyalty Re-Engagement</td>
<td className="px-lg py-sm font-code-sm text-code-sm text-right">2,104</td>
<td className="px-lg py-sm font-body-sm text-body-sm text-right">2.5 Days</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-green-500"></span>
<span className="font-body-sm text-body-sm text-green-600 font-bold">₹68,300</span>
</div>
</td>
<td className="px-lg py-sm">
<button className="text-primary font-bold text-[11px] hover:underline uppercase">Configure Sprint</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="col-span-12 lg:col-span-4 admin-border bg-white flex flex-col h-[480px]">
<div className="p-lg admin-border-b bg-primary-container text-on-primary-container flex justify-between items-center">
<h2 className="font-headline-sm text-headline-sm font-bold flex items-center gap-2">
<span className="material-symbols-outlined">tune</span>
                            Sprint Config Tool
                        </h2>
</div>
<div className="p-lg flex-1 overflow-y-auto custom-scrollbar space-y-lg">
<div>
<label className="block font-body-sm text-body-sm font-semibold text-on-surface-variant mb-1">SELECTED BACKLOG PROCESS</label>
<select className="w-full h-[40px] admin-border bg-surface-container-low px-2 text-body-sm font-medium focus:border-primary focus:ring-0">
<option>#PROC-8821: Cold Re-activation A</option>
<option>#PROC-9104: Post-Service Follow-up</option>
<option>#PROC-7723: Incomplete Reg Recovery</option>
</select>
</div>
<div className="grid grid-cols-2 gap-sm">
<div>
<label className="block font-body-sm text-body-sm font-semibold text-on-surface-variant mb-1">START DATE</label>
<input className="w-full h-[40px] admin-border px-2 text-body-sm focus:border-primary focus:ring-0" type="date"/>
</div>
<div>
<label className="block font-body-sm text-body-sm font-semibold text-on-surface-variant mb-1">END DATE</label>
<input className="w-full h-[40px] admin-border px-2 text-body-sm focus:border-primary focus:ring-0" type="date"/>
</div>
</div>
<div>
<label className="block font-body-sm text-body-sm font-semibold text-on-surface-variant mb-1">ASSIGNED CALLERS (HEADCOUNT)</label>
<div className="flex items-center gap-4">
<input className="flex-1 accent-primary" max="60" min="1" type="range" value="15"/>
<span className="font-code-md text-code-md border border-outline-variant px-3 py-1 bg-surface-container-low">15</span>
</div>
</div>
<div>
<label className="block font-body-sm text-body-sm font-semibold text-on-surface-variant mb-1">CALL CAP PER AGENT / DAY</label>
<input className="w-full h-[40px] admin-border px-2 text-code-md font-medium focus:border-primary focus:ring-0" type="number" value="80"/>
</div>
<div className="bg-surface-container-low p-sm admin-border">
<p className="text-[11px] font-bold text-on-secondary-fixed-variant uppercase mb-2">Estimated Output</p>
<div className="flex justify-between mb-1">
<span className="text-body-sm">Daily Outreach:</span>
<span className="font-code-sm text-primary">1,200 calls</span>
</div>
<div className="flex justify-between">
<span className="text-body-sm">Weekly Coverage:</span>
<span className="font-code-sm text-primary">6,000 items</span>
</div>
</div>
<button className="w-full py-lg bg-inverse-surface text-white font-bold text-body-md hover:bg-on-surface transition-colors shadow-lg flex items-center justify-center gap-2">
<span className="material-symbols-outlined">rocket_launch</span>
                            DEPLOY SPRINT INSTANCE
                        </button>
</div>
</div>

<div className="col-span-12 admin-border bg-white flex flex-col h-[320px]">
<div className="p-lg admin-border-b flex justify-between items-center">
<div>
<h2 className="font-headline-sm text-headline-sm font-bold">Real-time Performance Tracker</h2>
<p className="text-body-sm text-on-surface-variant">Live metrics across all active recovery campaigns</p>
</div>
<div className="flex items-center gap-4">
<div className="flex items-center gap-2">
<span className="w-3 h-3 rounded-full bg-primary animate-pulse"></span>
<span className="text-body-sm font-bold">LIVE SYNC</span>
</div>
<select className="admin-border h-8 text-xs font-bold px-2 focus:ring-0">
<option>ALL REGIONS</option>
<option>NORTH AMERICA</option>
<option>EMEA</option>
</select>
</div>
</div>
<div className="flex-1 p-lg flex gap-xl overflow-hidden">
<div className="flex-1 flex flex-col">
<p className="text-[10px] font-bold text-on-surface-variant uppercase mb-2">Call Success Rate (24h)</p>
<div className="flex-1 relative flex items-end gap-1">

<div className="bg-primary/20 hover:bg-primary/40 flex-1 h-[40%] cursor-pointer group relative">
<div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-1 py-0.5 whitespace-nowrap">42% | 08:00</div>
</div>
<div className="bg-primary/20 hover:bg-primary/40 flex-1 h-[55%] cursor-pointer group relative"></div>
<div className="bg-primary/20 hover:bg-primary/40 flex-1 h-[68%] cursor-pointer group relative"></div>
<div className="bg-primary/20 hover:bg-primary/40 flex-1 h-[82%] cursor-pointer group relative"></div>
<div className="bg-primary hover:bg-primary/80 flex-1 h-[95%] cursor-pointer group relative">
<div className="hidden group-hover:block absolute -top-8 left-1/2 -translate-x-1/2 bg-on-surface text-white text-[10px] px-1 py-0.5 whitespace-nowrap">95% | 12:00</div>
</div>
<div className="bg-primary/20 hover:bg-primary/40 flex-1 h-[75%] cursor-pointer group relative"></div>
<div className="bg-primary/20 hover:bg-primary/40 flex-1 h-[60%] cursor-pointer group relative"></div>
<div className="bg-primary/20 hover:bg-primary/40 flex-1 h-[45%] cursor-pointer group relative"></div>
<div className="bg-primary/20 hover:bg-primary/40 flex-1 h-[30%] cursor-pointer group relative"></div>
<div className="bg-primary/20 hover:bg-primary/40 flex-1 h-[25%] cursor-pointer group relative"></div>
<div className="bg-primary/20 hover:bg-primary/40 flex-1 h-[35%] cursor-pointer group relative"></div>
<div className="bg-primary/20 hover:bg-primary/40 flex-1 h-[50%] cursor-pointer group relative"></div>
</div>
</div>
<div className="w-1/3 admin-border border-dashed p-md bg-surface-container-low flex flex-col justify-center space-y-4">
<div>
<p className="text-[10px] font-bold text-on-surface-variant uppercase">Current Velocity</p>
<div className="flex items-baseline gap-2">
<p className="text-display-sm font-bold">158</p>
<p className="text-body-sm text-green-600 font-bold">calls / min</p>
</div>
</div>
<div className="h-px bg-outline-variant"></div>
<div>
<p className="text-[10px] font-bold text-on-surface-variant uppercase">Recovery Efficiency</p>
<div className="flex items-baseline gap-2">
<p className="text-display-sm font-bold">₹12.4k</p>
<p className="text-body-sm text-primary font-bold">avg recovery / hr</p>
</div>
</div>
</div>
</div>
</div>
</div>

<div className="mt-xl flex justify-between items-center text-[10px] text-on-surface-variant font-mono uppercase tracking-widest pb-lg">
<div className="flex gap-4">
<span>Server: NODE-882-RECOVERY</span>
<span>Lat: 12ms</span>
<span>Uptime: 99.998%</span>
</div>
<div>© 2024 Core Systems Logistics Audit Division</div>
</div>
</div>
</main>
  );
};

export default BacklogCampaignManager;
