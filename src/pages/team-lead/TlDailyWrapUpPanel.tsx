import React from 'react';

export const TlDailyWrapUpPanel: React.FC = () => {
  return (
    <main className=" p-margin-desktop space-y-xl scrollbar-hide">


<section className="grid grid-cols-1 md:grid-cols-4 gap-gutter">
<div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col justify-between relative overflow-hidden group">
<div className="absolute -right-12 -top-12 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors"></div>
<div>
<span className="text-label-md font-label-md uppercase text-on-surface-variant">Fleet Completion</span>
<h2 className="text-display-lg font-display-lg mt-xs">94.2%</h2>
</div>
<div className="mt-lg">
<div className="w-full bg-surface-container h-2 rounded-full">
<div className="bg-primary h-2 rounded-full" style={{"width": "94.2%"}}></div>
</div>
<p className="text-body-sm font-body-sm mt-sm text-on-surface-variant">+2.4% vs Yesterday</p>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col justify-center text-center">
<span className="material-symbols-outlined text-primary mb-sm text-3xl" data-icon="task_alt">task_alt</span>
<span className="text-display-lg font-display-lg">142</span>
<p className="text-label-md font-label-md uppercase text-on-surface-variant">Successful Deliveries</p>
</div>
<div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col justify-center text-center">
<span className="material-symbols-outlined text-error mb-sm text-3xl" data-icon="warning">warning</span>
<span className="text-display-lg font-display-lg">03</span>
<p className="text-label-md font-label-md uppercase text-on-surface-variant">Critical Exceptions</p>
</div>
</section>

<section className="bg-surface-container-lowest border border-outline-variant rounded-lg overflow-hidden">
<div className="p-lg border-b border-outline-variant flex justify-between items-center bg-white">
<div>
<h3 className="font-headline-sm text-headline-sm">Untagged Call Resolver</h3>
<p className="text-body-sm font-body-sm text-on-surface-variant">Calls missing resolution tags for billing accuracy.</p>
</div>
<div className="px-md py-xs bg-error-container text-on-error-container rounded-full text-label-md font-label-md">
                        8 PENDING
                    </div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="text-label-md font-label-md text-on-surface-variant uppercase tracking-wider bg-white">
<th className="px-lg py-md border-b border-outline-variant">Agent Name</th>
<th className="px-lg py-md border-b border-outline-variant">Timestamp</th>
<th className="px-lg py-md border-b border-outline-variant">Duration</th>
<th className="px-lg py-md border-b border-outline-variant">Customer ID</th>
<th className="px-lg py-md border-b border-outline-variant text-right">Actions</th>
</tr>
</thead>
<tbody className="text-body-md font-body-md">
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-md border-b border-outline-variant">Rohan Sharma</td>
<td className="px-lg py-md border-b border-outline-variant">16:42</td>
<td className="px-lg py-md border-b border-outline-variant">04m 12s</td>
<td className="px-lg py-md border-b border-outline-variant">CUST-8812</td>
<td className="px-lg py-md border-b border-outline-variant text-right space-x-sm">
<button className="px-sm py-xs border border-primary text-primary text-label-md font-label-md rounded hover:bg-primary-fixed-dim transition-colors">Send Reminder</button>
<button className="px-sm py-xs bg-primary text-white text-label-md font-label-md rounded hover:opacity-90 transition-opacity">Override</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-md border-b border-outline-variant">Sarah Jenkins</td>
<td className="px-lg py-md border-b border-outline-variant">17:05</td>
<td className="px-lg py-md border-b border-outline-variant">02m 45s</td>
<td className="px-lg py-md border-b border-outline-variant">CUST-1044</td>
<td className="px-lg py-md border-b border-outline-variant text-right space-x-sm">
<button className="px-sm py-xs border border-primary text-primary text-label-md font-label-md rounded hover:bg-primary-fixed-dim transition-colors">Send Reminder</button>
<button className="px-sm py-xs bg-primary text-white text-label-md font-label-md rounded hover:opacity-90 transition-opacity">Override</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-md border-b border-outline-variant">Ananya Iyer</td>
<td className="px-lg py-md border-b border-outline-variant">17:15</td>
<td className="px-lg py-md border-b border-outline-variant">12m 30s</td>
<td className="px-lg py-md border-b border-outline-variant">CUST-9901</td>
<td className="px-lg py-md border-b border-outline-variant text-right space-x-sm">
<button className="px-sm py-xs border border-primary text-primary text-label-md font-label-md rounded hover:bg-primary-fixed-dim transition-colors">Send Reminder</button>
<button className="px-sm py-xs bg-primary text-white text-label-md font-label-md rounded hover:opacity-90 transition-opacity">Override</button>
</td>
</tr>
</tbody>
</table>
</div>
</section>

<div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">

<section className="space-y-md">
<div className="flex items-center justify-between">
<h3 className="font-headline-sm text-headline-sm">Tomorrow's Priorities</h3>
<span className="material-symbols-outlined text-primary cursor-pointer hover:rotate-180 transition-transform duration-500" data-icon="autorenew">autorenew</span>
</div>
<div className="space-y-sm">

<div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex items-center gap-md group">
<div className="w-1 bg-primary self-stretch rounded-full"></div>
<div className="flex-1">
<div className="flex justify-between items-center mb-xs">
<p className="font-body-md text-body-md font-bold">Overdue SLA Escalation: Zone B</p>
<span className="text-label-md font-label-md text-on-surface-variant">08:00 AM</span>
</div>
<div className="flex items-center gap-sm">
<div className="w-24 bg-surface-container h-1.5 rounded-full">
<div className="bg-error h-1.5 rounded-full w-4/5"></div>
</div>
<span className="text-[10px] text-error font-bold">80% Threshold</span>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex items-center gap-md group">
<div className="w-1 bg-secondary-container self-stretch rounded-full"></div>
<div className="flex-1">
<div className="flex justify-between items-center">
<p className="font-body-md text-body-md font-bold">Callback: Vendor #902 (Damaged Goods)</p>
<span className="text-label-md font-label-md text-on-surface-variant">09:30 AM</span>
</div>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-xs">Assigned to: Sr. Coordinator Mike L.</p>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-lg p-md flex items-center gap-md group">
<div className="w-1 bg-tertiary-container self-stretch rounded-full"></div>
<div className="flex-1">
<div className="flex justify-between items-center">
<p className="font-body-md text-body-md font-bold">Fleet Maintenance Audit</p>
<span className="text-label-md font-label-md text-on-surface-variant">11:00 AM</span>
</div>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-xs">Post-shift vehicle inspection logs check.</p>
</div>
</div>
</div>
</section>

<section className="flex flex-col">
<h3 className="font-headline-sm text-headline-sm mb-md">TL Daily Notes</h3>
<div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded-lg p-lg flex flex-col">
<label className="sr-only" htmlFor="daily-notes">Enter daily wrap-up notes</label>
<textarea className="flex-1 w-full bg-transparent border-none focus:ring-0 text-body-md font-body-md resize-none placeholder-on-surface-variant" id="daily-notes" placeholder="Summarize key shift highlights, agent performance, and any unresolved infrastructure issues for the next Lead..."></textarea>
<div className="mt-lg pt-lg border-t border-outline-variant flex items-center justify-between">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors" data-icon="attach_file">attach_file</span>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:text-primary transition-colors" data-icon="mic">mic</span>
</div>
<button className="bg-primary text-white px-lg py-sm rounded-lg font-label-md text-label-md hover:shadow-lg active:scale-95 transition-all flex items-center gap-sm">
                                Submit Daily Report
                                <span className="material-symbols-outlined text-[18px]" data-icon="send">send</span>
</button>
</div>
</div>
</section>
</div>
</main>
  );
};

export default TlDailyWrapUpPanel;
