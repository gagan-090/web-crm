import React from 'react';

export const ProcessQueueConfig: React.FC = () => {
  return (
    <main className=" custom-scrollbar bg-background flex flex-col">

<div className="px-xl py-lg flex justify-between items-end border-b border-outline-variant bg-surface-container-low">
<div>
<nav className="flex items-center gap-xs text-body-sm font-body-sm text-outline mb-xs">
<span>Core Systems</span>
<span className="material-symbols-outlined !text-[12px]" data-icon="chevron_right">chevron_right</span>
<span className="text-on-surface">Process & Queue Config</span>
</nav>
<h1 className="text-display-sm font-display-sm font-extrabold text-on-surface tracking-tight">System Queue Parameters</h1>
</div>
<div className="flex gap-md">
<button className="bg-surface-container-lowest border border-outline-variant px-lg py-sm font-body-sm text-body-sm font-medium hover:bg-surface-container-high transition-colors">Discard Changes</button>
<button className="bg-primary-container text-on-primary-fixed-variant px-xl py-sm font-body-sm text-body-sm font-semibold hover:opacity-90 transition-opacity" >Deploy Configuration</button>
</div>
</div>
<div className="p-xl grid grid-cols-12 gap-lg max-w-container-max mx-auto w-full">

<div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant">
<div className="px-lg py-md border-b border-outline-variant bg-surface-container-high flex justify-between items-center">
<h2 className="font-headline-sm text-headline-sm font-bold flex items-center gap-md">
<span className="material-symbols-outlined" data-icon="data_usage">data_usage</span>
                            Queue Settings
                        </h2>
<span className="text-body-sm font-code-sm text-outline">NS: core.queue.v1</span>
</div>
<table className="w-full text-left">
<thead className="bg-surface-container text-on-surface border-b border-outline-variant sticky top-0">
<tr>
<th className="px-lg py-sm font-body-sm text-body-sm font-semibold">Parameter</th>
<th className="px-lg py-sm font-body-sm text-body-sm font-semibold">Value</th>
<th className="px-lg py-sm font-body-sm text-body-sm font-semibold">Backup Trigger</th>
<th className="px-lg py-sm font-body-sm text-body-sm font-semibold">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors h-table-row">
<td className="px-lg py-sm font-body-sm text-body-sm">Max Queue Depth (Ingress)</td>
<td className="px-lg py-sm"><input className="w-32 bg-surface-container-low border border-outline-variant font-code-sm text-code-sm px-sm py-xs focus:border-primary-container outline-none" type="text" value="500,000"/></td>
<td className="px-lg py-sm font-code-sm text-code-sm">92% CAP</td>
<td className="px-lg py-sm"><span className="flex items-center gap-xs text-body-sm font-body-sm"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active</span></td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors h-table-row">
<td className="px-lg py-sm font-body-sm text-body-sm">Worker Concurrency</td>
<td className="px-lg py-sm"><input className="w-32 bg-surface-container-low border border-outline-variant font-code-sm text-code-sm px-sm py-xs focus:border-primary-container outline-none" type="text" value="128"/></td>
<td className="px-lg py-sm font-code-sm text-code-sm">LATENCY &gt; 500ms</td>
<td className="px-lg py-sm"><span className="flex items-center gap-xs text-body-sm font-body-sm"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active</span></td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors h-table-row">
<td className="px-lg py-sm font-body-sm text-body-sm">DLQ Retention Period</td>
<td className="px-lg py-sm"><input className="w-32 bg-surface-container-low border border-outline-variant font-code-sm text-code-sm px-sm py-xs focus:border-primary-container outline-none" type="text" value="168h"/></td>
<td className="px-lg py-sm font-code-sm text-code-sm">MANUAL_ONLY</td>
<td className="px-lg py-sm"><span className="flex items-center gap-xs text-body-sm font-body-sm"><span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span> Warning</span></td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors h-table-row">
<td className="px-lg py-sm font-body-sm text-body-sm">Retry Backoff Multiplier</td>
<td className="px-lg py-sm"><input className="w-32 bg-surface-container-low border border-outline-variant font-code-sm text-code-sm px-sm py-xs focus:border-primary-container outline-none" type="text" value="2.5"/></td>
<td className="px-lg py-sm font-code-sm text-code-sm">ERROR_RATE &gt; 5%</td>
<td className="px-lg py-sm"><span className="flex items-center gap-xs text-body-sm font-body-sm"><span className="w-1.5 h-1.5 rounded-full bg-green-500"></span> Active</span></td>
</tr>
</tbody>
</table>
</div>

<div className="col-span-12 lg:col-span-4 flex flex-col gap-lg">
<div className="bg-surface-container-lowest border border-outline-variant p-lg">
<div className="flex items-center justify-between mb-lg">
<h3 className="font-headline-sm text-headline-sm font-bold flex items-center gap-md">
<span className="material-symbols-outlined" data-icon="bolt">bolt</span>
                                Escalation Triggers
                            </h3>
<button className="material-symbols-outlined text-outline" data-icon="add_circle">add_circle</button>
</div>
<div className="flex flex-col gap-md">
<div className="border-l-2 border-amber-500 pl-md py-xs">
<div className="text-body-sm font-semibold">Priority Level 1 Escalation</div>
<div className="font-code-sm text-code-sm text-outline mt-xs">IF wait_time &gt; <span className="text-on-surface">300s</span> THEN re-route(node_cluster_b)</div>
</div>
<div className="border-l-2 border-error pl-md py-xs">
<div className="text-body-sm font-semibold">Critical Failure Redirect</div>
<div className="font-code-sm text-code-sm text-outline mt-xs">IF health_check == <span className="text-error">0</span> THEN shutdown_ingress()</div>
</div>
<div className="border-l-2 border-primary pl-md py-xs">
<div className="text-body-sm font-semibold">Soft Archival Trigger</div>
<div className="font-code-sm text-code-sm text-outline mt-xs">IF last_accessed &gt; <span className="text-on-surface">24h</span> THEN move_to(S3_GLACIER)</div>
</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant">
<div className="px-lg py-md bg-surface-container-low border-b border-outline-variant flex items-center gap-md">
<span className="material-symbols-outlined" data-icon="ac_unit">ac_unit</span>
<span className="font-body-md text-body-md font-bold uppercase tracking-widest text-outline">Cold Archival Configuration</span>
</div>
<div className="p-lg flex flex-col gap-md">
<div>
<label className="block text-body-sm font-semibold mb-xs">Retention Policy</label>
<select className="w-full bg-surface text-body-sm border-outline-variant py-sm px-md focus:border-primary outline-none">
<option>Strict 7-Year Compliance</option>
<option>Indefinite Legal Hold</option>
<option>Standard 365-Day Cycle</option>
</select>
</div>
<div className="flex justify-between items-center py-sm border-t border-outline-variant border-dashed mt-xs">
<span className="text-body-sm">Compress on Archive</span>
<div className="w-10 h-5 bg-primary-container rounded-full relative cursor-pointer">
<div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full"></div>
</div>
</div>
</div>
</div>
</div>

<div className="col-span-12 bg-surface-container-lowest border border-outline-variant overflow-hidden">
<div className="px-lg py-md border-b border-outline-variant flex items-center justify-between">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined" data-icon="timer">timer</span>
<h2 className="font-headline-sm text-headline-sm font-bold">SLA Performance Thresholds</h2>
</div>
<div className="flex items-center gap-xl text-body-sm text-outline">
<span className="flex items-center gap-xs"><span className="w-2 h-2 bg-green-500"></span> Compliant</span>
<span className="flex items-center gap-xs"><span className="w-2 h-2 bg-amber-500"></span> At Risk</span>
<span className="flex items-center gap-xs"><span className="w-2 h-2 bg-error"></span> Breach</span>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full">
<thead className="bg-surface-container text-on-surface border-b border-outline-variant">
<tr>
<th className="px-lg py-md text-left font-body-sm text-body-sm">Target Metric</th>
<th className="px-lg py-md text-left font-body-sm text-body-sm">Breach Limit</th>
<th className="px-lg py-md text-left font-body-sm text-body-sm">Alert Latency</th>
<th className="px-lg py-md text-left font-body-sm text-body-sm">Escalation Group</th>
<th className="px-lg py-md text-right font-body-sm text-body-sm">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-md">
<div className="font-body-sm font-bold">API Ingress Latency (P99)</div>
<div className="text-xs text-outline font-code-sm">ns: prod-east-1.latency</div>
</td>
<td className="px-lg py-md font-code-sm text-code-sm text-error">200ms</td>
<td className="px-lg py-md font-code-sm text-code-sm">15s</td>
<td className="px-lg py-md"><span className="bg-secondary-container px-sm py-xs text-body-sm rounded-lg">DevOps_L3</span></td>
<td className="px-lg py-md text-right">
<button className="material-symbols-outlined text-outline hover:text-primary transition-colors" data-icon="edit">edit</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-md">
<div className="font-body-sm font-bold">Batch Processing Throughput</div>
<div className="text-xs text-outline font-code-sm">ns: ingestion.batch.rate</div>
</td>
<td className="px-lg py-md font-code-sm text-code-sm text-amber-600">50k msg/s</td>
<td className="px-lg py-md font-code-sm text-code-sm">60s</td>
<td className="px-lg py-md"><span className="bg-secondary-container px-sm py-xs text-body-sm rounded-lg">DataEng_L2</span></td>
<td className="px-lg py-md text-right">
<button className="material-symbols-outlined text-outline hover:text-primary transition-colors" data-icon="edit">edit</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-md">
<div className="font-body-sm font-bold">Database IO Wait</div>
<div className="text-xs text-outline font-code-sm">ns: db.cluster.iowait</div>
</td>
<td className="px-lg py-md font-code-sm text-code-sm text-green-600">0.05ms</td>
<td className="px-lg py-md font-code-sm text-code-sm">5s</td>
<td className="px-lg py-md"><span className="bg-secondary-container px-sm py-xs text-body-sm rounded-lg">DBA_Critical</span></td>
<td className="px-lg py-md text-right">
<button className="material-symbols-outlined text-outline hover:text-primary transition-colors" data-icon="edit">edit</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="col-span-12 mt-xl border-t border-outline-variant pt-lg flex items-center justify-between opacity-60">
<div className="flex items-center gap-md font-code-sm text-code-sm">
<span className="material-symbols-outlined" data-icon="history">history</span>
<span>Last manual override: 2023-11-24 14:22:11 UTC by adm_user_99</span>
</div>
<div className="font-code-sm text-code-sm">
                        SHA-256: 4e3b2f...81a0
                    </div>
</div>
</div>
</main>
  );
};

export default ProcessQueueConfig;
