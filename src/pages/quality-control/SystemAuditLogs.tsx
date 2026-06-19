import React from 'react';

export const SystemAuditLogs: React.FC = () => {
  return (
    <main className=" flex flex-col bg-background relative">



<div className="px-xl py-lg bg-surface flex flex-wrap items-center justify-between gap-md border-b border-outline-variant">
<div>
<h1 className="font-display-sm text-display-sm text-on-surface">System Logs</h1>
<p className="font-body-sm text-body-sm text-on-surface-variant mt-1">Full audit trail of all administrative and system-level actions.</p>
</div>
<div className="flex items-center gap-sm">
<div className="flex bg-surface-container border border-outline-variant rounded p-1">
<button className="px-3 py-1 bg-white text-on-surface text-body-sm font-semibold rounded-sm shadow-sm border border-outline-variant">Live View</button>
<button className="px-3 py-1 text-on-surface-variant text-body-sm hover:bg-surface-container-high transition-colors">Historical</button>
</div>
<button className="flex items-center gap-2 bg-primary text-white px-xl h-10 font-body-sm text-body-sm hover:opacity-90 transition-opacity">
<span className="material-symbols-outlined text-sm">download</span>
                    Export to CSV
                </button>
</div>
</div>

<div className="px-xl py-md bg-surface-container-low flex flex-wrap items-center gap-lg border-b border-outline-variant">
<div className="flex flex-col gap-1">
<label className="font-body-sm text-body-sm font-semibold text-on-surface-variant uppercase tracking-wider text-[10px]">Time Range</label>
<select className="h-8 border-outline-variant bg-white text-body-sm font-body-sm focus:border-primary-container min-w-[160px]">
<option>Last 24 Hours</option>
<option>Last 7 Days</option>
<option>Custom Range</option>
</select>
</div>
<div className="flex flex-col gap-1">
<label className="font-body-sm text-body-sm font-semibold text-on-surface-variant uppercase tracking-wider text-[10px]">Action Type</label>
<select className="h-8 border-outline-variant bg-white text-body-sm font-body-sm focus:border-primary-container min-w-[160px]">
<option>All Actions</option>
<option>Price Changes</option>
<option>Deactivations</option>
<option>Approvals</option>
<option>Config Updates</option>
</select>
</div>
<div className="flex flex-col gap-1">
<label className="font-body-sm text-body-sm font-semibold text-on-surface-variant uppercase tracking-wider text-[10px]">Record Filter</label>
<div className="relative">
<input className="h-8 border-outline-variant bg-white text-body-sm font-body-sm focus:border-primary-container pl-8" placeholder="ID or Keyword..." type="text"/>
<span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant opacity-50 text-[18px]">filter_list</span>
</div>
</div>
<div className="ml-auto self-end pb-1">
<button className="text-primary font-body-sm text-body-sm font-medium hover:underline flex items-center gap-1">
                    Clear Filters
                </button>
</div>
</div>

<div className="flex-1 overflow-auto custom-scrollbar bg-white">
<table className="w-full text-left border-collapse min-w-[1000px]">
<thead className="sticky-header bg-surface-container border-b border-outline-variant">
<tr>
<th className="px-xl py-3 font-body-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">Timestamp</th>
<th className="px-lg py-3 font-body-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">User</th>
<th className="px-lg py-3 font-body-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">Action</th>
<th className="px-lg py-3 font-body-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">Record ID</th>
<th className="px-lg py-3 font-body-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">Old Value</th>
<th className="px-lg py-3 font-body-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-widest text-[11px]">New Value</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="table-row-hover transition-colors">
<td className="px-xl py-3 whitespace-nowrap">
<span className="font-code-sm text-code-sm text-on-surface-variant">2023-11-24 14:22:08.452</span>
</td>
<td className="px-lg py-3">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-body-sm text-body-sm font-medium">admin.smith</span>
</div>
</td>
<td className="px-lg py-3">
<span className="px-2 py-0.5 bg-secondary-container text-on-secondary-fixed-variant font-code-sm text-[10px] uppercase rounded">Price_Update</span>
</td>
<td className="px-lg py-3 font-code-sm text-code-sm text-primary">PLAN-8821-X</td>
<td className="px-lg py-3">
<span className="font-code-sm text-code-sm line-through text-on-surface-variant">₹49.99</span>
</td>
<td className="px-lg py-3">
<span className="font-code-sm text-code-sm font-bold text-error">₹54.99</span>
</td>
</tr>

<tr className="table-row-hover transition-colors">
<td className="px-xl py-3 whitespace-nowrap">
<span className="font-code-sm text-code-sm text-on-surface-variant">2023-11-24 14:15:12.109</span>
</td>
<td className="px-lg py-3">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-body-sm text-body-sm font-medium">sys_automator</span>
</div>
</td>
<td className="px-lg py-3">
<span className="px-2 py-0.5 bg-error-container text-on-error-container font-code-sm text-[10px] uppercase rounded">Deactivation</span>
</td>
<td className="px-lg py-3 font-code-sm text-code-sm text-primary">USR-9001-A</td>
<td className="px-lg py-3">
<div className="flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
<span className="font-body-sm text-body-sm">Active</span>
</div>
</td>
<td className="px-lg py-3">
<div className="flex items-center gap-1">
<span className="w-1.5 h-1.5 rounded-full bg-red-500"></span>
<span className="font-body-sm text-body-sm font-bold">Suspended</span>
</div>
</td>
</tr>

<tr className="table-row-hover transition-colors">
<td className="px-xl py-3 whitespace-nowrap">
<span className="font-code-sm text-code-sm text-on-surface-variant">2023-11-24 13:58:44.002</span>
</td>
<td className="px-lg py-3">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-body-sm text-body-sm font-medium">m.garcia</span>
</div>
</td>
<td className="px-lg py-3">
<span className="px-2 py-0.5 bg-surface-container-high text-on-surface font-code-sm text-[10px] uppercase rounded">Approval</span>
</td>
<td className="px-lg py-3 font-code-sm text-code-sm text-primary">REQ-77422</td>
<td className="px-lg py-3">
<span className="font-body-sm text-body-sm">Pending_Review</span>
</td>
<td className="px-lg py-3">
<span className="font-body-sm text-body-sm font-bold text-green-700">Confirmed</span>
</td>
</tr>

<tr className="table-row-hover transition-colors">
<td className="px-xl py-3 whitespace-nowrap">
<span className="font-code-sm text-code-sm text-on-surface-variant">2023-11-24 13:42:01.998</span>
</td>
<td className="px-lg py-3">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-body-sm text-body-sm font-medium">admin.smith</span>
</div>
</td>
<td className="px-lg py-3">
<span className="px-2 py-0.5 bg-secondary-container text-on-secondary-fixed-variant font-code-sm text-[10px] uppercase rounded">Config_Edit</span>
</td>
<td className="px-lg py-3 font-code-sm text-code-sm text-primary">SYS-CFG-04</td>
<td className="px-lg py-3">
<span className="font-code-sm text-code-sm">&#123;"timeout": 3000&#125;</span>
</td>
<td className="px-lg py-3">
<span className="font-code-sm text-code-sm font-bold text-primary">&#123;"timeout": 5000&#125;</span>
</td>
</tr>

<tr className="table-row-hover transition-colors">
<td className="px-xl py-3 whitespace-nowrap">
<span className="font-code-sm text-code-sm text-on-surface-variant">2023-11-24 13:30:15.551</span>
</td>
<td className="px-lg py-3">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-body-sm text-body-sm font-medium">root_access</span>
</div>
</td>
<td className="px-lg py-3">
<span className="px-2 py-0.5 bg-primary-container text-on-primary-container font-code-sm text-[10px] uppercase rounded">Security_Event</span>
</td>
<td className="px-lg py-3 font-code-sm text-code-sm text-primary">SSH-DAEMON</td>
<td className="px-lg py-3">
<span className="font-body-sm text-body-sm italic">Access_Closed</span>
</td>
<td className="px-lg py-3">
<span className="font-body-sm text-body-sm font-bold text-amber-600">Port_Scan_Detected</span>
</td>
</tr>

<tr className="table-row-hover transition-colors">
<td className="px-xl py-3 whitespace-nowrap">
<span className="font-code-sm text-code-sm text-on-surface-variant">2023-11-24 13:12:08.452</span>
</td>
<td className="px-lg py-3">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-body-sm text-body-sm font-medium">admin.smith</span>
</div>
</td>
<td className="px-lg py-3">
<span className="px-2 py-0.5 bg-secondary-container text-on-secondary-fixed-variant font-code-sm text-[10px] uppercase rounded">Price_Update</span>
</td>
<td className="px-lg py-3 font-code-sm text-code-sm text-primary">PLAN-4410-V</td>
<td className="px-lg py-3">
<span className="font-code-sm text-code-sm line-through text-on-surface-variant">₹19.00</span>
</td>
<td className="px-lg py-3">
<span className="font-code-sm text-code-sm font-bold text-green-700">₹17.50</span>
</td>
</tr>

<tr className="table-row-hover transition-colors">
<td className="px-xl py-3 whitespace-nowrap">
<span className="font-code-sm text-code-sm text-on-surface-variant">2023-11-24 12:45:00.001</span>
</td>
<td className="px-lg py-3">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="font-body-sm text-body-sm font-medium">m.garcia</span>
</div>
</td>
<td className="px-lg py-3">
<span className="px-2 py-0.5 bg-error-container text-on-error-container font-code-sm text-[10px] uppercase rounded">Deactivation</span>
</td>
<td className="px-lg py-3 font-code-sm text-code-sm text-primary">HOOK-EXPR-09</td>
<td className="px-lg py-3">
<span className="font-body-sm text-body-sm">Enabled</span>
</td>
<td className="px-lg py-3">
<span className="font-body-sm text-body-sm font-bold text-red-500">Disabled</span>
</td>
</tr>

<tr className="h-full">
<td className="p-0" colSpan={6}></td>
</tr>
</tbody>
</table>
</div>

<footer className="px-xl py-3 bg-surface border-t border-outline-variant flex items-center justify-between">
<div className="flex items-center gap-xl">
<p className="font-body-sm text-body-sm text-on-surface-variant">Showing <span className="font-bold text-on-surface">50</span> of <span className="font-bold text-on-surface">1,204</span> logs</p>
<div className="flex items-center gap-md">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-green-500"></span>
<span className="font-body-sm text-body-sm text-on-surface-variant">Normal Traffic</span>
</div>
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
<span className="font-body-sm text-body-sm text-on-surface-variant">3 Recent Alerts</span>
</div>
</div>
</div>
<div className="flex items-center gap-2">
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high disabled:opacity-30" disabled>
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center bg-primary text-white rounded font-body-sm text-body-sm font-bold">1</button>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high font-body-sm text-body-sm">2</button>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high font-body-sm text-body-sm">3</button>
<span className="px-1 text-on-surface-variant">...</span>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high font-body-sm text-body-sm">24</button>
<button className="w-8 h-8 flex items-center justify-center border border-outline-variant rounded hover:bg-surface-container-high">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</footer>


</main>
  );
};

export default SystemAuditLogs;
