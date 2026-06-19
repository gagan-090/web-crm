import React from 'react';

export const SlaDashboard: React.FC = () => {
  return (
    <main className=" flex flex-col ">



<div className="flex-1 overflow-y-auto p-md space-y-md custom-scrollbar">

<section className="bg-white rounded border border-outline-variant shadow-sm overflow-hidden">
<div className="px-md py-sm border-b border-outline-variant flex items-center justify-between">
<h2 className="font-bold text-on-surface flex items-center gap-sm">
<span className="material-symbols-outlined text-primary" data-icon="pending_actions">pending_actions</span>
                        Active Job SLAs
                    </h2>
<div className="flex items-center gap-sm">
<div className="flex items-center gap-xs text-[11px]">
<span className="w-2 h-2 bg-green-500 rounded-full"></span> <span>Safe (&gt;5d)</span>
</div>
<div className="flex items-center gap-xs text-[11px] ml-sm">
<span className="w-2 h-2 bg-amber-500 rounded-full"></span> <span>At Risk (2-4d)</span>
</div>
<div className="flex items-center gap-xs text-[11px] ml-sm">
<span className="w-2 h-2 bg-red-500 rounded-full"></span> <span>Urgent (&lt;2d)</span>
</div>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Job ID</th>
<th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Transporter</th>
<th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Plan</th>
<th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Posted Date</th>
<th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">SLA Deadline</th>
<th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase text-center">Remaining</th>
<th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Caller</th>
<th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase text-center">Calls</th>
<th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Status</th>
<th className="px-md py-sm font-label-caps text-label-caps text-outline uppercase">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="row-red hover:bg-error-container/5 transition-colors group">
<td className="px-md py-sm font-data-mono">#JOB-8842</td>
<td className="px-md py-sm font-bold">VRL Logistics Ltd</td>
<td className="px-md py-sm"><span className="px-sm py-0.5 bg-secondary-container text-on-secondary-container rounded text-[10px] font-bold">PREMIUM</span></td>
<td className="px-md py-sm">22 Oct, 2023</td>
<td className="px-md py-sm font-bold text-error">26 Oct, 18:00</td>
<td className="px-md py-sm text-center"><span className="text-error font-bold">1.2 Days</span></td>
<td className="px-md py-sm">Rahul S.</td>
<td className="px-md py-sm text-center">14</td>
<td className="px-md py-sm">
<span className="px-sm py-0.5 bg-error-container text-error rounded text-[10px] font-bold">CRITICAL</span>
</td>
<td className="px-md py-sm">
<button className="bg-error text-white px-md py-1 rounded text-[10px] font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all">ESCALATE</button>
</td>
</tr>

<tr className="row-amber hover:bg-orange-50 transition-colors">
<td className="px-md py-sm font-data-mono">#JOB-8901</td>
<td className="px-md py-sm font-bold">Safe Express India</td>
<td className="px-md py-sm"><span className="px-sm py-0.5 border border-primary text-primary rounded text-[10px] font-bold uppercase">Standard Plus</span></td>
<td className="px-md py-sm">23 Oct, 2023</td>
<td className="px-md py-sm font-bold">27 Oct, 12:00</td>
<td className="px-md py-sm text-center"><span className="text-amber-700 font-bold">3.5 Days</span></td>
<td className="px-md py-sm">Priya M.</td>
<td className="px-md py-sm text-center">08</td>
<td className="px-md py-sm">
<span className="px-sm py-0.5 bg-amber-100 text-amber-800 rounded text-[10px] font-bold">AT RISK</span>
</td>
<td className="px-md py-sm">
<button className="border border-outline text-on-surface px-md py-1 rounded text-[10px] font-bold hover:bg-surface-container-high">VIEW</button>
</td>
</tr>

<tr className="row-green hover:bg-green-50 transition-colors">
<td className="px-md py-sm font-data-mono">#JOB-9012</td>
<td className="px-md py-sm font-bold">BlueDart Surface</td>
<td className="px-md py-sm"><span className="px-sm py-0.5 bg-secondary-container text-on-secondary-container rounded text-[10px] font-bold">PREMIUM</span></td>
<td className="px-md py-sm">24 Oct, 2023</td>
<td className="px-md py-sm font-bold">30 Oct, 18:00</td>
<td className="px-md py-sm text-center"><span className="text-green-700 font-bold">6.0 Days</span></td>
<td className="px-md py-sm">Ankit K.</td>
<td className="px-md py-sm text-center">02</td>
<td className="px-md py-sm">
<span className="px-sm py-0.5 bg-green-100 text-green-800 rounded text-[10px] font-bold">HEALTHY</span>
</td>
<td className="px-md py-sm">
<button className="border border-outline text-on-surface px-md py-1 rounded text-[10px] font-bold hover:bg-surface-container-high">VIEW</button>
</td>
</tr>
</tbody>
</table>
</div>
</section>

<section className="space-y-sm">
<div className="flex items-center justify-between px-xs">
<h3 className="font-bold text-on-surface text-[12px] uppercase tracking-wider flex items-center gap-xs">
<span className="material-symbols-outlined text-secondary" data-icon="handshake">handshake</span>
                        New Transporter Onboarding SLA
                    </h3>
<span className="text-[10px] text-outline italic">Response required within 2 hours of registration</span>
</div>
<div className="flex gap-md overflow-x-auto pb-sm custom-scrollbar">

<div className="min-w-[280px] bg-white border border-outline-variant p-md rounded shadow-sm hover:shadow-md transition-shadow relative overflow-hidden group">
<div className="absolute top-0 right-0 w-1 h-full bg-error"></div>
<div className="flex justify-between items-start mb-sm">
<div>
<h4 className="font-bold text-primary">Jaguar Roadlines</h4>
<p className="text-[11px] text-outline">Ahmedabad, GJ</p>
</div>
<span className="bg-error text-white px-sm py-0.5 rounded text-[9px] font-extrabold">OVERDUE</span>
</div>
<div className="flex justify-between items-end">
<div>
<p className="text-[10px] text-outline uppercase font-bold">Registered</p>
<p className="font-data-mono text-error">3h 42m ago</p>
</div>
<button className="bg-secondary text-white text-[10px] font-bold px-md py-1 rounded shadow hover:bg-opacity-90">CALL NOW</button>
</div>
</div>

<div className="min-w-[280px] bg-white border border-outline-variant p-md rounded shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div className="absolute top-0 right-0 w-1 h-full bg-amber-500"></div>
<div className="flex justify-between items-start mb-sm">
<div>
<h4 className="font-bold text-on-surface">KTC Transport</h4>
<p className="text-[11px] text-outline">Ludhiana, PB</p>
</div>
<span className="bg-amber-100 text-amber-800 px-sm py-0.5 rounded text-[9px] font-extrabold">14m REMAINING</span>
</div>
<div className="flex justify-between items-end">
<div>
<p className="text-[10px] text-outline uppercase font-bold">Registered</p>
<p className="font-data-mono">1h 46m ago</p>
</div>
<button className="border border-secondary text-secondary text-[10px] font-bold px-md py-1 rounded hover:bg-secondary-fixed">ASSIGN</button>
</div>
</div>

<div className="min-w-[280px] bg-white border border-outline-variant p-md rounded shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
<div className="absolute top-0 right-0 w-1 h-full bg-green-500"></div>
<div className="flex justify-between items-start mb-sm">
<div>
<h4 className="font-bold text-on-surface">Delhi Cargo Services</h4>
<p className="text-[11px] text-outline">Delhi, DL</p>
</div>
<span className="bg-green-100 text-green-800 px-sm py-0.5 rounded text-[9px] font-extrabold">NEW</span>
</div>
<div className="flex justify-between items-end">
<div>
<p className="text-[10px] text-outline uppercase font-bold">Registered</p>
<p className="font-data-mono">12m ago</p>
</div>
<button className="border border-outline text-outline text-[10px] font-bold px-md py-1 rounded cursor-not-allowed">QUEUED</button>
</div>
</div>
</div>
</section>

<section className="bg-surface-container-lowest rounded border border-outline-variant shadow-sm mb-lg">
<div className="px-md py-sm border-b border-outline-variant flex items-center justify-between">
<h3 className="font-bold text-on-surface flex items-center gap-sm">
<span className="material-symbols-outlined text-outline" data-icon="history">history</span>
                        Recent Breach History Log
                    </h3>
<button className="text-primary text-[11px] font-bold hover:underline">Download Report</button>
</div>
<div className="p-md">
<div className="space-y-xs">
<div className="grid grid-cols-5 text-[10px] font-bold text-outline-variant uppercase px-sm py-xs border-b border-outline-variant">
<span>Timestamp</span>
<span>Entity / Job ID</span>
<span>Breach Type</span>
<span>Owner</span>
<span>Action Taken</span>
</div>
<div className="grid grid-cols-5 text-[11px] px-sm py-sm border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors items-center">
<span className="font-data-mono">24 Oct, 09:15</span>
<span className="font-bold">#JOB-8722</span>
<span className="text-error font-bold">Unassigned &gt; 24h</span>
<span>System Admin</span>
<span><span className="px-sm py-0.5 bg-surface-container rounded">Auto-Assigned</span></span>
</div>
<div className="grid grid-cols-5 text-[11px] px-sm py-sm border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors items-center">
<span className="font-data-mono">23 Oct, 18:00</span>
<span className="font-bold">TR-9921 (ABC Trns)</span>
<span className="text-error font-bold">Call SLA Breach</span>
<span>Rohit Verma</span>
<span><span className="px-sm py-0.5 bg-surface-container rounded">Manager Notified</span></span>
</div>
<div className="grid grid-cols-5 text-[11px] px-sm py-sm border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors items-center">
<span className="font-data-mono">23 Oct, 14:45</span>
<span className="font-bold">#JOB-8650</span>
<span className="text-error font-bold">No Call &gt; 48h</span>
<span>Sunita Devi</span>
<span><span className="px-sm py-0.5 bg-surface-container rounded">Job Re-queued</span></span>
</div>
</div>
</div>
</section>
</div>

<button className="fixed bottom-lg right-lg bg-primary text-white w-12 h-12 rounded-full shadow-lg flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-50">
<span className="material-symbols-outlined" data-icon="add">add</span>
</button>
</main>
  );
};

export default SlaDashboard;
