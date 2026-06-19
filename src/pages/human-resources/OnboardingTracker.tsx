import React from 'react';

export const OnboardingTracker: React.FC = () => {
  return (
    <main className=" overflow-auto relative">
<div className="max-w-[1440px] mx-auto p-margin-page">

<div className="flex justify-between items-end mb-8">
<div>
<h2 className="font-headline-lg text-headline-lg text-primary">Onboarding Tracker</h2>
<p className="text-body-md text-on-surface-variant">Monitoring 14 active onboarding processes across 3 hubs.</p>
</div>
<div className="flex gap-3">
<button className="bg-surface-container-lowest border border-outline px-4 py-2 text-label-md font-label-md text-primary flex items-center gap-2 rounded hover:bg-surface-container-low">
<span className="material-symbols-outlined text-[18px]">download</span> Export Report
                        </button>
<button className="bg-primary text-on-primary px-4 py-2 text-label-md font-label-md flex items-center gap-2 rounded">
<span className="material-symbols-outlined text-[18px]">person_add</span> Initiate New
                        </button>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded shadow-sm overflow-hidden">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-low border-b border-outline-variant sticky top-0">
<tr>
<th className="py-density-table-py px-density-table-px text-label-md text-outline font-bold">Onboardee Name</th>
<th className="py-density-table-py px-density-table-px text-label-md text-outline font-bold">Role</th>
<th className="py-density-table-py px-density-table-px text-label-md text-outline font-bold">Process</th>
<th className="py-density-table-py px-density-table-px text-label-md text-outline font-bold">Joining Date</th>
<th className="py-density-table-py px-density-table-px text-label-md text-outline font-bold">Status/Week</th>
<th className="py-density-table-py px-density-table-px text-label-md text-outline font-bold">Completion</th>
<th className="py-density-table-py px-density-table-px text-label-md text-outline font-bold">Kit Status</th>
<th className="py-density-table-py px-density-table-px"></th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-surface-container-low cursor-pointer bg-blue-50/20" >
<td className="py-density-table-py px-density-table-px">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[11px]">RM</div>
<div>
<p className="text-body-md font-bold text-primary">Rajesh Malhotra</p>
<p className="text-[10px] text-outline">EMP-9042</p>
</div>
</div>
</td>
<td className="py-density-table-py px-density-table-px text-body-sm text-on-surface">Senior Logistics Lead</td>
<td className="py-density-table-py px-density-table-px text-body-sm">Operational Hub-B</td>
<td className="py-density-table-py px-density-table-px text-data-mono text-on-surface">Oct 12, 2023</td>
<td className="py-density-table-py px-density-table-px">
<span className="bg-secondary-container text-on-secondary-container px-2 py-0.5 rounded-full text-[10px] font-bold">WEEK 2</span>
</td>
<td className="py-density-table-py px-density-table-px">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{"width": "65%"}}></div>
</div>
<span className="text-data-mono text-[11px] font-bold">65%</span>
</div>
</td>
<td className="py-density-table-py px-density-table-px">
<span className="flex items-center gap-1 text-[10px] text-error font-bold">
<span className="material-symbols-outlined text-[14px]">warning</span> Pending Docs
                                    </span>
</td>
<td className="py-density-table-py px-density-table-px text-right">
<span className="material-symbols-outlined text-outline">chevron_right</span>
</td>
</tr>

<tr className="hover:bg-surface-container-low cursor-pointer">
<td className="py-density-table-py px-density-table-px">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface-container-highest text-outline flex items-center justify-center font-bold text-[11px]">SK</div>
<div>
<p className="text-body-md font-bold text-primary">Sanya Kapoor</p>
<p className="text-[10px] text-outline">EMP-9045</p>
</div>
</div>
</td>
<td className="py-density-table-py px-density-table-px text-body-sm text-on-surface">HR Associate</td>
<td className="py-density-table-py px-density-table-px text-body-sm">Corporate - Delhi</td>
<td className="py-density-table-py px-density-table-px text-data-mono text-on-surface">Oct 20, 2023</td>
<td className="py-density-table-py px-density-table-px">
<span className="bg-tertiary-container text-on-tertiary-container px-2 py-0.5 rounded-full text-[10px] font-bold">WEEK 1</span>
</td>
<td className="py-density-table-py px-density-table-px">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{"width": "20%"}}></div>
</div>
<span className="text-data-mono text-[11px] font-bold">20%</span>
</div>
</td>
<td className="py-density-table-py px-density-table-px">
<span className="flex items-center gap-1 text-[10px] text-on-tertiary-container font-bold">
<span className="material-symbols-outlined text-[14px]">check_circle</span> Dispatched
                                    </span>
</td>
<td className="py-density-table-py px-density-table-px text-right">
<span className="material-symbols-outlined text-outline">chevron_right</span>
</td>
</tr>

<tr className="hover:bg-surface-container-low cursor-pointer">
<td className="py-density-table-py px-density-table-px">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-surface-container-highest text-outline flex items-center justify-center font-bold text-[11px]">AJ</div>
<div>
<p className="text-body-md font-bold text-primary">Amit Jha</p>
<p className="text-[10px] text-outline">EMP-9038</p>
</div>
</div>
</td>
<td className="py-density-table-py px-density-table-px text-body-sm text-on-surface">Inventory Manager</td>
<td className="py-density-table-py px-density-table-px text-body-sm">Warehouse Log-A</td>
<td className="py-density-table-py px-density-table-px text-data-mono text-on-surface">Sep 28, 2023</td>
<td className="py-density-table-py px-density-table-px">
<span className="bg-surface-container-highest text-on-surface-variant px-2 py-0.5 rounded-full text-[10px] font-bold">WEEK 4</span>
</td>
<td className="py-density-table-py px-density-table-px">
<div className="flex items-center gap-2">
<div className="flex-1 h-1.5 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{"width": "95%"}}></div>
</div>
<span className="text-data-mono text-[11px] font-bold">95%</span>
</div>
</td>
<td className="py-density-table-py px-density-table-px">
<span className="flex items-center gap-1 text-[10px] text-on-tertiary-container font-bold">
<span className="material-symbols-outlined text-[14px]">check_circle</span> Received
                                    </span>
</td>
<td className="py-density-table-py px-density-table-px text-right">
<span className="material-symbols-outlined text-outline">chevron_right</span>
</td>
</tr>
</tbody>
</table>
</div>

<div className="grid grid-cols-4 gap-gutter mt-8">
<div className="p-4 bg-surface-container-lowest border border-outline-variant rounded">
<p className="text-label-md text-outline font-bold uppercase mb-1">New Joinees</p>
<p className="text-headline-md text-primary">12 <span className="text-body-sm text-on-tertiary-container font-normal">+4 vs LW</span></p>
</div>
<div className="p-4 bg-surface-container-lowest border border-outline-variant rounded">
<p className="text-label-md text-outline font-bold uppercase mb-1">Audit Ready</p>
<p className="text-headline-md text-primary">85% <span className="material-symbols-outlined text-tertiary text-[18px]">verified</span></p>
</div>
<div className="p-4 bg-surface-container-lowest border border-outline-variant rounded">
<p className="text-label-md text-outline font-bold uppercase mb-1">Pending Docs</p>
<p className="text-headline-md text-error">24 <span className="text-body-sm font-normal">items</span></p>
</div>
<div className="p-4 bg-surface-container-lowest border border-outline-variant rounded">
<p className="text-label-md text-outline font-bold uppercase mb-1">Avg. Completion</p>
<p className="text-headline-md text-primary">6.4 <span className="text-body-sm font-normal">days</span></p>
</div>
</div>
</div>
</main>
  );
};

export default OnboardingTracker;
