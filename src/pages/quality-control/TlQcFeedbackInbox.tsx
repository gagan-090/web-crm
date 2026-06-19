import React from 'react';

export const TlQcFeedbackInbox: React.FC = () => {
  return (
    <main className=" bg-surface-bright flex flex-col p-6 gap-6 relative">

<div className="grid grid-cols-1 md:grid-cols-4 gap-4">
<div className="col-span-1 md:col-span-2 bg-surface p-6 rounded-lg border border-outline-variant flex flex-col justify-between">
<div>
<h2 className="font-headline-md text-headline-md text-primary mb-1">QC Feedback Inbox</h2>
<p className="text-on-surface-variant text-body-md">Audit oversight for Team Alpha. Identify patterns and schedule calibrations.</p>
</div>
<div className="flex gap-4 mt-6">
<button className="bg-primary-container text-on-primary-container px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:shadow-lg transition-all active:scale-[0.98]" >
<span className="material-symbols-outlined">calendar_month</span>
                            Calibration Session
                        </button>
<button className="bg-surface-container-highest text-on-surface border border-outline-variant px-4 py-2.5 rounded-lg font-label-md text-label-md flex items-center gap-2 hover:bg-surface-container-high transition-all">
<span className="material-symbols-outlined">download</span>
                            Export Data
                        </button>
</div>
</div>
<div className="bg-surface p-4 rounded-lg border border-outline-variant flex flex-col items-center justify-center text-center">
<p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-tighter">Avg Team Score</p>
<p className="font-display-lg text-display-lg text-primary mt-1">84.2%</p>
<div className="flex items-center gap-1 text-on-error-container text-[11px] mt-1 font-bold">
<span className="material-symbols-outlined text-[14px]">arrow_downward</span>
                        1.4% vs LY
                    </div>
</div>
<div className="bg-surface p-4 rounded-lg border border-outline-variant flex flex-col items-center justify-center text-center">
<p className="text-label-md font-label-md text-on-surface-variant uppercase tracking-tighter">Pending Actions</p>
<p className="font-display-lg text-display-lg text-on-primary-container mt-1">12</p>
<p className="text-[11px] text-on-surface-variant mt-1">3 Critical Issues</p>
</div>
</div>

<div className="bg-surface border border-outline-variant rounded-lg flex-1 flex flex-col overflow-hidden">
<div className="p-4 border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-4 bg-surface-container-low/50">
<div className="flex items-center gap-4">
<div className="relative">
<span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
<input className="pl-10 pr-4 py-2 bg-surface-container-lowest border border-outline-variant rounded-lg text-body-md focus:ring-2 focus:ring-primary-container outline-none w-64 transition-all" placeholder="Search callers or feedback..." type="text"/>
</div>
<div className="flex items-center gap-2">
<button className="px-3 py-2 bg-surface border border-outline-variant rounded-lg text-body-sm font-label-md flex items-center gap-1 hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[18px]">filter_list</span>
                                Filter
                            </button>
<button className="px-3 py-2 bg-surface border border-outline-variant rounded-lg text-body-sm font-label-md flex items-center gap-1 hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[18px]">sort</span>
                                Sort
                            </button>
</div>
</div>
<div className="flex items-center gap-2">
<span className="text-body-sm text-on-surface-variant mr-2">Showing 12 of 148 audits</span>
</div>
</div>

<div className="flex-1 overflow-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-low sticky top-0 z-10">
<tr>
<th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Caller</th>
<th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Audit Date</th>
<th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Score</th>
<th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Severity</th>
<th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">Status</th>
<th className="px-6 py-4 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center font-bold text-[12px]">JD</div>
<div>
<p className="font-body-md text-on-surface font-semibold">Jonathan Doe</p>
<p className="text-[12px] text-on-surface-variant">Lvl 2 Support</p>
</div>
</div>
</td>
<td className="px-6 py-4 text-body-md text-on-surface">Oct 24, 2023</td>
<td className="px-6 py-4">
<div className="flex flex-col gap-1 w-24">
<div className="flex justify-between text-[11px] font-bold">
<span className="text-error">64%</span>
</div>
<div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div className="bg-error h-full" style={{"width": "64%"}}></div>
</div>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-0.5 rounded-[2px] bg-error-container text-on-error-container text-[11px] font-bold uppercase tracking-tight">Critical</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-primary-container"></div>
<span className="text-body-sm font-medium">Action Pending</span>
</div>
</td>
<td className="px-6 py-4 text-right">
<button className="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-body-sm font-label-md hover:opacity-90 shadow-sm transition-all">Assign Remediation</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-tertiary-fixed text-on-tertiary-fixed-variant flex items-center justify-center font-bold text-[12px]">SW</div>
<div>
<p className="font-body-md text-on-surface font-semibold">Sarah Waters</p>
<p className="text-[12px] text-on-surface-variant">Lvl 1 Support</p>
</div>
</div>
</td>
<td className="px-6 py-4 text-body-md text-on-surface">Oct 23, 2023</td>
<td className="px-6 py-4">
<div className="flex flex-col gap-1 w-24">
<div className="flex justify-between text-[11px] font-bold">
<span className="text-primary">82%</span>
</div>
<div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div className="bg-primary-container h-full" style={{"width": "82%"}}></div>
</div>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-0.5 rounded-[2px] bg-secondary-container text-on-secondary-container text-[11px] font-bold uppercase tracking-tight">Medium</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-outline"></div>
<span className="text-body-sm font-medium">Completed</span>
</div>
</td>
<td className="px-6 py-4 text-right">
<button className="text-primary hover:bg-primary-container/10 p-2 rounded-full transition-colors">
<span className="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-primary-fixed text-on-primary-fixed-variant flex items-center justify-center font-bold text-[12px]">MK</div>
<div>
<p className="font-body-md text-on-surface font-semibold">Marcus King</p>
<p className="text-[12px] text-on-surface-variant">Team Associate</p>
</div>
</div>
</td>
<td className="px-6 py-4 text-body-md text-on-surface">Oct 23, 2023</td>
<td className="px-6 py-4">
<div className="flex flex-col gap-1 w-24">
<div className="flex justify-between text-[11px] font-bold">
<span className="text-error">71%</span>
</div>
<div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div className="bg-primary-container h-full" style={{"width": "71%"}}></div>
</div>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-0.5 rounded-[2px] bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold uppercase tracking-tight">High</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-primary-container"></div>
<span className="text-body-sm font-medium">Awaiting Call</span>
</div>
</td>
<td className="px-6 py-4 text-right">
<button className="bg-primary text-on-primary px-3 py-1.5 rounded-lg text-body-sm font-label-md hover:opacity-90 shadow-sm transition-all">Assign Remediation</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-6 py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded-full bg-on-tertiary-fixed-variant text-white flex items-center justify-center font-bold text-[12px]">AL</div>
<div>
<p className="font-body-md text-on-surface font-semibold">Alice Low</p>
<p className="text-[12px] text-on-surface-variant">Senior Agent</p>
</div>
</div>
</td>
<td className="px-6 py-4 text-body-md text-on-surface">Oct 22, 2023</td>
<td className="px-6 py-4">
<div className="flex flex-col gap-1 w-24">
<div className="flex justify-between text-[11px] font-bold">
<span className="text-tertiary">96%</span>
</div>
<div className="w-full bg-surface-container-highest h-1.5 rounded-full overflow-hidden">
<div className="bg-tertiary h-full" style={{"width": "96%"}}></div>
</div>
</div>
</td>
<td className="px-6 py-4">
<span className="px-2 py-0.5 rounded-[2px] bg-surface-container-highest text-on-surface-variant text-[11px] font-bold uppercase tracking-tight">Low</span>
</td>
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<div className="w-2 h-2 rounded-full bg-outline"></div>
<span className="text-body-sm font-medium">Archived</span>
</div>
</td>
<td className="px-6 py-4 text-right">
<button className="text-primary hover:bg-primary-container/10 p-2 rounded-full transition-colors">
<span className="material-symbols-outlined">visibility</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-low/50">
<button className="px-4 py-2 text-body-sm font-label-md text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all flex items-center gap-1">
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
                        Previous
                    </button>
<div className="flex gap-2">
<button className="w-8 h-8 rounded bg-primary text-on-primary text-body-sm font-bold">1</button>
<button className="w-8 h-8 rounded hover:bg-surface-container-high text-body-sm font-bold">2</button>
<button className="w-8 h-8 rounded hover:bg-surface-container-high text-body-sm font-bold">3</button>
<span className="flex items-end px-1 pb-1">...</span>
<button className="w-8 h-8 rounded hover:bg-surface-container-high text-body-sm font-bold">12</button>
</div>
<button className="px-4 py-2 text-body-sm font-label-md text-on-surface-variant border border-outline-variant rounded-lg hover:bg-surface-container-high transition-all flex items-center gap-1">
                        Next
                        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>

<button className="fixed bottom-8 right-8 w-14 h-14 bg-primary text-on-primary rounded-full shadow-xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40 group">
<span className="material-symbols-outlined text-[28px]">add_task</span>
<span className="absolute right-16 bg-inverse-surface text-inverse-on-surface px-3 py-1 rounded-lg text-body-sm opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">New Audit Ticket</span>
</button>
</main>
  );
};

export default TlQcFeedbackInbox;
