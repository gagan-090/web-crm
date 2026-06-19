import React from 'react';

export const AbscondingProtocolTracker: React.FC = () => {
  return (
    <main className=" min-h-screen p-margin-page bg-surface-bright">
<div className="max-w-[1200px] mx-auto">
<div className="flex justify-between items-end mb-8">
<div>
<h2 className="font-headline-lg text-headline-lg text-primary">Absconding Protocol Tracker</h2>
<p className="font-body-md text-body-md text-on-surface-variant">Real-time oversight of unauthorized absences and legal compliance workflows.</p>
</div>
<div className="flex gap-3">
<button className="px-4 py-2 bg-surface-container-lowest border border-outline text-primary font-label-md text-label-md hover:bg-surface-container-low transition-colors">
                            EXPORT REPORT
                        </button>
<button className="px-4 py-2 bg-primary text-on-primary font-label-md text-label-md hover:opacity-90 transition-opacity">
                            + NEW CASE
                        </button>
</div>
</div>

<div className="grid grid-cols-4 gap-4 mb-8">
<div className="bg-surface-container-lowest border border-outline-variant p-4">
<p className="font-label-md text-label-md text-on-surface-variant mb-1">Active Protocols</p>
<p className="font-headline-lg text-headline-lg text-primary">12</p>
<div className="mt-2 h-1 bg-surface-container-high overflow-hidden">
<div className="bg-primary h-full w-2/3"></div>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-4">
<p className="font-label-md text-label-md text-on-surface-variant mb-1">Due for Day 2 WA</p>
<p className="font-headline-lg text-headline-lg text-secondary">04</p>
<p className="font-body-sm text-body-sm text-secondary-container mt-1">Pending Action Required</p>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-4">
<p className="font-label-md text-label-md text-on-surface-variant mb-1">Day 3 Final Notice</p>
<p className="font-headline-lg text-headline-lg text-error">03</p>
<p className="font-body-sm text-body-sm text-on-error-container mt-1">Audit Risk: Moderate</p>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-4">
<p className="font-label-md text-label-md text-on-surface-variant mb-1">Recovered Assets</p>
<p className="font-headline-lg text-headline-lg text-on-tertiary-container">₹42,500</p>
<p className="font-body-sm text-body-sm text-on-tertiary-container mt-1">Forfeited Incentives</p>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
<div className="px-4 py-3 bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
<h3 className="font-title-sm text-title-sm text-primary">Active Cases Monitoring</h3>
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-error animate-pulse"></span>
<span className="font-label-md text-label-md text-on-surface-variant">Live Audit Sync</span>
</div>
</div>
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Employee</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Last Seen</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Day 1 Call</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Day 2 WA</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">CRM Status</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase tracking-wider">Next Step</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase tracking-wider"></th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-surface-container-low transition-colors cursor-pointer group" >
<td className="px-density-table-px py-density-table-py">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[12px]">AK</div>
<div>
<p className="font-body-md text-body-md text-primary font-bold">Arjun Kumar</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">TM-4029 | Logistics</p>
</div>
</div>
</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono">24 Oct, 18:30</td>
<td className="px-density-table-px py-density-table-py">
<span className="flex items-center gap-1 text-on-tertiary-container font-label-md text-label-md">
<span className="material-symbols-outlined text-[16px]">check_circle</span> Complete
                                    </span>
</td>
<td className="px-density-table-px py-density-table-py">
<span className="flex items-center gap-1 text-error font-label-md text-label-md">
<span className="material-symbols-outlined text-[16px]">pending</span> Pending
                                    </span>
</td>
<td className="px-density-table-px py-density-table-py">
<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed-variant uppercase">Active</span>
</td>
<td className="px-density-table-px py-density-table-py">
<span className="font-body-sm text-body-sm text-on-surface-variant">Send Formal Warning</span>
</td>
<td className="px-density-table-px py-density-table-py text-right">
<span className="material-symbols-outlined text-outline group-hover:text-primary">chevron_right</span>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors cursor-pointer group">
<td className="px-density-table-px py-density-table-py">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[12px]">RS</div>
<div>
<p className="font-body-md text-body-md text-primary font-bold">Rohan Sharma</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">TM-5112 | Ops</p>
</div>
</div>
</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono">23 Oct, 09:15</td>
<td className="px-density-table-px py-density-table-py">
<span className="flex items-center gap-1 text-on-tertiary-container font-label-md text-label-md">
<span className="material-symbols-outlined text-[16px]">check_circle</span> Complete
                                    </span>
</td>
<td className="px-density-table-px py-density-table-py">
<span className="flex items-center gap-1 text-on-tertiary-container font-label-md text-label-md">
<span className="material-symbols-outlined text-[16px]">check_circle</span> Sent
                                    </span>
</td>
<td className="px-density-table-px py-density-table-py">
<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-error-container text-on-error-container uppercase">Revoking...</span>
</td>
<td className="px-density-table-px py-density-table-py">
<span className="font-body-sm text-body-sm text-error font-bold">Mark Absconded</span>
</td>
<td className="px-density-table-px py-density-table-py text-right">
<span className="material-symbols-outlined text-outline group-hover:text-primary">chevron_right</span>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors cursor-pointer group">
<td className="px-density-table-px py-density-table-py">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-primary-container text-on-primary-container flex items-center justify-center font-bold text-[12px]">PD</div>
<div>
<p className="font-body-md text-body-md text-primary font-bold">Priya Das</p>
<p className="font-body-sm text-body-sm text-on-surface-variant">TM-3391 | HR</p>
</div>
</div>
</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono">25 Oct, 11:00</td>
<td className="px-density-table-px py-density-table-py">
<span className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md">
<span className="material-symbols-outlined text-[16px]">schedule</span> Not Attempted
                                    </span>
</td>
<td className="px-density-table-px py-density-table-py">
<span className="flex items-center gap-1 text-on-surface-variant font-label-md text-label-md opacity-50">
<span className="material-symbols-outlined text-[16px]">block</span> N/A
                                    </span>
</td>
<td className="px-density-table-px py-density-table-py">
<span className="px-2 py-0.5 rounded text-[10px] font-bold bg-tertiary-fixed text-on-tertiary-fixed-variant uppercase">Active</span>
</td>
<td className="px-density-table-px py-density-table-py">
<span className="font-body-sm text-body-sm text-on-surface-variant">Initial Outreach</span>
</td>
<td className="px-density-table-px py-density-table-py text-right">
<span className="material-symbols-outlined text-outline group-hover:text-primary">chevron_right</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</main>
  );
};

export default AbscondingProtocolTracker;
