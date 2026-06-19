import React from 'react';

export const Page03TeamMonitor: React.FC = () => {
  return (
    <main className=" flex flex-col min-h-screen">


<div className="p-md space-y-md">

<section className="bg-surface rounded-sm border border-outline-variant p-sm flex items-center gap-sm overflow-x-auto no-scrollbar shadow-sm">
<span className="text-[10px] font-bold uppercase text-outline px-sm border-r border-outline-variant mr-sm">Attendance</span>

<div className="flex items-center gap-xs flex-nowrap">
<div className="flex items-center gap-xs px-2 py-1 bg-green-50 border border-green-200 rounded-sm">
<span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
<span className="text-[11px] font-semibold text-green-800">A. Sharma</span>
</div>
<div className="flex items-center gap-xs px-2 py-1 bg-red-50 border border-red-200 rounded-sm">
<span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
<span className="text-[11px] font-semibold text-red-800">R. Verma</span>
</div>
<div className="flex items-center gap-xs px-2 py-1 bg-orange-50 border border-orange-200 rounded-sm">
<span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
<span className="text-[11px] font-semibold text-orange-800">S. Gupta</span>
</div>
<div className="flex items-center gap-xs px-2 py-1 bg-green-50 border border-green-200 rounded-sm">
<span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
<span className="text-[11px] font-semibold text-green-800">P. Iyer</span>
</div>
<div className="flex items-center gap-xs px-2 py-1 bg-green-50 border border-green-200 rounded-sm">
<span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
<span className="text-[11px] font-semibold text-green-800">M. Khan</span>
</div>
<div className="flex items-center gap-xs px-2 py-1 bg-green-50 border border-green-200 rounded-sm">
<span className="w-1.5 h-1.5 rounded-full bg-green-600"></span>
<span className="text-[11px] font-semibold text-green-800">J. Doe</span>
</div>
<div className="flex items-center gap-xs px-2 py-1 bg-orange-50 border border-orange-200 rounded-sm">
<span className="w-1.5 h-1.5 rounded-full bg-orange-600"></span>
<span className="text-[11px] font-semibold text-orange-800">K. Kaur</span>
</div>
<div className="flex items-center gap-xs px-2 py-1 bg-red-50 border border-red-200 rounded-sm">
<span className="w-1.5 h-1.5 rounded-full bg-red-600"></span>
<span className="text-[11px] font-semibold text-red-800">D. Singh</span>
</div>
</div>
</section>

<div className="grid grid-cols-12 gap-md">

<div className="col-span-8 bg-surface rounded-sm border border-outline-variant p-md shadow-sm">
<div className="flex justify-between items-center mb-md">
<h3 className="font-headline-md text-[14px] uppercase tracking-tight font-extrabold">Live Queue Depth</h3>
<button className="bg-primary text-white px-md py-1 text-[12px] font-bold rounded-sm hover:opacity-90 transition-opacity">Rebalance Queue</button>
</div>
<div className="space-y-sm">

<div className="flex items-center gap-md">
<span className="w-24 text-[11px] font-bold truncate">Linehaul North</span>
<div className="flex-1 bg-surface-container-highest h-4 rounded-sm relative overflow-hidden">
<div className="bg-primary h-full transition-all duration-1000" style={{"width": "45%"}}></div>
</div>
<span className="w-10 text-[11px] font-data-mono text-right">22</span>
</div>

<div className="flex items-center gap-md">
<span className="w-24 text-[11px] font-bold truncate">Market West</span>
<div className="flex-1 bg-surface-container-highest h-4 rounded-sm relative overflow-hidden">
<div className="bg-error h-full transition-all duration-1000" style={{"width": "82%"}}></div>
</div>
<span className="w-10 text-[11px] font-data-mono text-right text-error font-bold">41</span>
</div>

<div className="flex items-center gap-md">
<span className="w-24 text-[11px] font-bold truncate">Contracted</span>
<div className="flex-1 bg-surface-container-highest h-4 rounded-sm relative overflow-hidden">
<div className="bg-primary h-full transition-all duration-1000" style={{"width": "30%"}}></div>
</div>
<span className="w-10 text-[11px] font-data-mono text-right">15</span>
</div>

<div className="flex items-center gap-md">
<span className="w-24 text-[11px] font-bold truncate">Express Hub</span>
<div className="flex-1 bg-surface-container-highest h-4 rounded-sm relative overflow-hidden">
<div className="bg-error h-full transition-all duration-1000" style={{"width": "75%"}}></div>
</div>
<span className="w-10 text-[11px] font-data-mono text-right text-error font-bold">37</span>
</div>
</div>
</div>

<div className="col-span-4 bg-surface rounded-sm border border-outline-variant p-md shadow-sm">
<h3 className="font-headline-md text-[14px] uppercase tracking-tight font-extrabold mb-md">Backup Activation</h3>
<div className="grid grid-cols-2 gap-sm">

<div className="border border-outline-variant p-sm rounded-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors group">
<div className="flex justify-between items-start mb-xs">
<span className="text-[11px] font-bold">B01 - Ankit</span>
<input className="w-8 h-4 rounded-full bg-outline-variant checked:bg-primary-container appearance-none relative transition-all cursor-pointer before:content-[''] before:absolute before:w-3 before:h-3 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-4 before:transition-all" type="checkbox"/>
</div>
<span className="text-[10px] text-outline font-medium">L-North / Ready</span>
</div>

<div className="border border-primary bg-primary-container/10 p-sm rounded-sm flex flex-col justify-between group">
<div className="flex justify-between items-start mb-xs">
<span className="text-[11px] font-bold text-primary">B02 - Preeti</span>
<input checked className="w-8 h-4 rounded-full bg-outline-variant checked:bg-primary-container appearance-none relative transition-all cursor-pointer before:content-[''] before:absolute before:w-3 before:h-3 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-4 before:transition-all" type="checkbox"/>
</div>
<span className="text-[10px] text-primary font-bold">ACTIVE - M-West</span>
</div>

<div className="border border-outline-variant p-sm rounded-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors">
<div className="flex justify-between items-start mb-xs">
<span className="text-[11px] font-bold">B03 - Rohan</span>
<input className="w-8 h-4 rounded-full bg-outline-variant checked:bg-primary-container appearance-none relative transition-all cursor-pointer before:content-[''] before:absolute before:w-3 before:h-3 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-4 before:transition-all" type="checkbox"/>
</div>
<span className="text-[10px] text-outline font-medium">Contract / Ready</span>
</div>

<div className="border border-outline-variant p-sm rounded-sm flex flex-col justify-between hover:bg-surface-container-low transition-colors">
<div className="flex justify-between items-start mb-xs">
<span className="text-[11px] font-bold">B04 - Sana</span>
<input className="w-8 h-4 rounded-full bg-outline-variant checked:bg-primary-container appearance-none relative transition-all cursor-pointer before:content-[''] before:absolute before:w-3 before:h-3 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-4 before:transition-all" type="checkbox"/>
</div>
<span className="text-[10px] text-outline font-medium">E-Hub / Off-duty</span>
</div>
</div>
</div>
</div>

<section className="bg-surface rounded-sm border border-outline-variant shadow-sm overflow-hidden">
<div className="px-md py-sm bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
<h3 className="text-label-caps font-bold uppercase tracking-wider text-on-surface-variant">Caller Activity Table</h3>
<div className="flex gap-md">
<span className="text-[11px] font-bold text-primary flex items-center gap-xs"><span className="w-2 h-2 rounded-full bg-primary"></span> 12 Active</span>
<span className="text-[11px] font-bold text-error flex items-center gap-xs"><span className="w-2 h-2 rounded-full bg-error"></span> 03 Idle</span>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container text-outline text-[12px] uppercase font-bold">
<tr>
<th className="px-md py-2 border-b border-outline-variant">Name</th>
<th className="px-md py-2 border-b border-outline-variant">Process</th>
<th className="px-md py-2 border-b border-outline-variant">Status</th>
<th className="px-md py-2 border-b border-outline-variant">Current Lead</th>
<th className="px-md py-2 border-b border-outline-variant">Queue Depth</th>
<th className="px-md py-2 border-b border-outline-variant">Calls (D)</th>
<th className="px-md py-2 border-b border-outline-variant">Revenue (D)</th>
<th className="px-md py-2 border-b border-outline-variant">Last Active</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-md py-sm font-bold text-on-surface">Amit Sharma</td>
<td className="px-md py-sm"><span className="px-2 py-0.5 border border-primary text-primary text-[10px] font-bold rounded-sm">L-NORTH</span></td>
<td className="px-md py-sm"><span className="text-green-600 font-bold text-[11px]">In Call (02:14)</span></td>
<td className="px-md py-sm text-outline font-data-mono">LD-992384</td>
<td className="px-md py-sm font-data-mono">12</td>
<td className="px-md py-sm font-data-mono">48</td>
<td className="px-md py-sm font-data-mono">₹1,24,000</td>
<td className="px-md py-sm text-outline text-[11px]">Just now</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group bg-red-50/20">
<td className="px-md py-sm font-bold text-on-surface">Ravi Verma</td>
<td className="px-md py-sm"><span className="px-2 py-0.5 border border-primary text-primary text-[10px] font-bold rounded-sm">M-WEST</span></td>
<td className="px-md py-sm"><span className="text-error font-extrabold text-[11px] flex items-center gap-xs">IDLE (45m+) <span className="material-symbols-outlined text-[14px]" data-icon="warning">warning</span></span></td>
<td className="px-md py-sm text-outline font-data-mono">-</td>
<td className="px-md py-sm font-data-mono text-error font-bold">41</td>
<td className="px-md py-sm font-data-mono">12</td>
<td className="px-md py-sm font-data-mono">₹14,500</td>
<td className="px-md py-sm text-outline text-[11px]">45m ago</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-md py-sm font-bold text-on-surface">Sonal Gupta</td>
<td className="px-md py-sm"><span className="px-2 py-0.5 border border-primary text-primary text-[10px] font-bold rounded-sm">CONTRACT</span></td>
<td className="px-md py-sm"><span className="text-orange-600 font-bold text-[11px]">Wrapping Up</span></td>
<td className="px-md py-sm text-outline font-data-mono">LD-992401</td>
<td className="px-md py-sm font-data-mono">08</td>
<td className="px-md py-sm font-data-mono">52</td>
<td className="px-md py-sm font-data-mono">₹98,200</td>
<td className="px-md py-sm text-outline text-[11px]">2m ago</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-md py-sm font-bold text-on-surface">Pooja Iyer</td>
<td className="px-md py-sm"><span className="px-2 py-0.5 border border-primary text-primary text-[10px] font-bold rounded-sm">E-HUB</span></td>
<td className="px-md py-sm"><span className="text-green-600 font-bold text-[11px]">In Call (00:45)</span></td>
<td className="px-md py-sm text-outline font-data-mono">LD-992512</td>
<td className="px-md py-sm font-data-mono">22</td>
<td className="px-md py-sm font-data-mono">31</td>
<td className="px-md py-sm font-data-mono">₹45,000</td>
<td className="px-md py-sm text-outline text-[11px]">Just now</td>
</tr>
</tbody>
</table>
</div>
</section>

<section className="bg-surface rounded-sm border border-outline-variant shadow-sm">
<div className="px-md py-sm bg-error-container/20 border-b border-outline-variant flex justify-between items-center">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-error" data-icon="report_problem">report_problem</span>
<h3 className="text-label-caps font-bold uppercase tracking-wider text-error">Funnel Escalation Queue (3 NR / 3-Day Trigger)</h3>
</div>
<span className="text-[11px] font-data-mono bg-error text-white px-2 py-0.5 rounded-sm">9 CRITICAL LEADS</span>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container text-outline text-[11px] uppercase font-bold">
<tr>
<th className="px-md py-2">Lead Name</th>
<th className="px-md py-2">TMID</th>
<th className="px-md py-2">Days in Queue</th>
<th className="px-md py-2">NR Count</th>
<th className="px-md py-2">Last Interaction</th>
<th className="px-md py-2 text-right">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-error-container/10 transition-colors">
<td className="px-md py-2 font-bold">Balaji Logistics (Kolkata)</td>
<td className="px-md py-2 font-data-mono text-outline">TM-8821</td>
<td className="px-md py-2"><span className="text-error font-bold">5 Days</span></td>
<td className="px-md py-2 font-data-mono">4</td>
<td className="px-md py-2 text-outline text-[11px]">18 Oct, 11:30 AM</td>
<td className="px-md py-2 text-right">
<select className="bg-white border border-outline-variant text-[11px] font-bold p-1 rounded-sm focus:ring-1 focus:ring-primary outline-none">
<option>Assign to Senior...</option>
<option>Amit Sharma</option>
<option>Sonal Gupta</option>
</select>
</td>
</tr>
<tr className="hover:bg-error-container/10 transition-colors">
<td className="px-md py-2 font-bold">Speedy Carriers Pvt Ltd</td>
<td className="px-md py-2 font-data-mono text-outline">TM-8890</td>
<td className="px-md py-2"><span className="text-error font-bold">3 Days</span></td>
<td className="px-md py-2 font-data-mono">3</td>
<td className="px-md py-2 text-outline text-[11px]">Yesterday, 04:45 PM</td>
<td className="px-md py-2 text-right">
<select className="bg-white border border-outline-variant text-[11px] font-bold p-1 rounded-sm focus:ring-1 focus:ring-primary outline-none">
<option>Assign to Senior...</option>
<option>Amit Sharma</option>
<option>Sonal Gupta</option>
</select>
</td>
</tr>
<tr className="hover:bg-error-container/10 transition-colors">
<td className="px-md py-2 font-bold">New Bharat Transport</td>
<td className="px-md py-2 font-data-mono text-outline">TM-9012</td>
<td className="px-md py-2"><span className="text-orange-600 font-bold">3 Days</span></td>
<td className="px-md py-2 font-data-mono">3</td>
<td className="px-md py-2 text-outline text-[11px]">Today, 09:15 AM</td>
<td className="px-md py-2 text-right">
<select className="bg-white border border-outline-variant text-[11px] font-bold p-1 rounded-sm focus:ring-1 focus:ring-primary outline-none">
<option>Assign to Senior...</option>
<option>Amit Sharma</option>
<option>Sonal Gupta</option>
</select>
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

export default Page03TeamMonitor;
