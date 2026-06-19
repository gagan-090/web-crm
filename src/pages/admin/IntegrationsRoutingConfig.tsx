import React from 'react';

export const IntegrationsRoutingConfig: React.FC = () => {
  return (
    <main className=" bg-background p-lg space-y-lg max-w-[1440px]">

<div className="flex items-center gap-xs font-body-sm text-body-sm text-on-surface-variant mb-base">
<span>Infrastructure</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span className="font-bold text-primary">Integrations</span>
</div>

<div className="grid grid-cols-12 gap-lg">

<div className="col-span-12 md:col-span-6 lg:col-span-4 technical-card p-lg">
<div className="flex justify-between items-start mb-lg border-b border-outline-variant pb-sm">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Exotel</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Voice &amp; SMS Infrastructure</p>
</div>
<div className="flex items-center gap-xs">
<div className="status-dot bg-[#22c55e]"></div>
<span className="font-body-sm text-body-sm text-[#22c55e]">Connected</span>
</div>
</div>
<div className="space-y-md">
<div>
<label className="font-body-sm font-semibold text-on-surface block mb-xs">API Key</label>
<div className="flex items-center gap-xs bg-surface-container-low border border-outline-variant px-sm py-1">
<span className="font-code-sm text-code-sm truncate">EX_4a22b7881c...7d91</span>
<span className="material-symbols-outlined text-sm cursor-pointer ml-auto">content_copy</span>
</div>
</div>
<div>
<label className="font-body-sm font-semibold text-on-surface block mb-xs">Number Pool</label>
<div className="max-h-32 overflow-y-auto border border-outline-variant">
<table className="w-full text-left font-code-sm text-code-sm">
<thead className="bg-surface-container-low sticky top-0 border-b border-outline-variant">
<tr>
<th className="px-sm py-1">DID</th>
<th className="px-sm py-1">Region</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr><td className="px-sm py-1">+91 22 612 0001</td><td className="px-sm py-1">Mumbai</td></tr>
<tr><td className="px-sm py-1">+91 80 471 8892</td><td className="px-sm py-1">Bangalore</td></tr>
<tr><td className="px-sm py-1">+91 11 391 4452</td><td className="px-sm py-1">Delhi</td></tr>
</tbody>
</table>
</div>
</div>
<button className="w-full bg-primary-container text-on-primary text-body-sm font-semibold py-sm rounded-lg hover:opacity-90">Update Provisioning</button>
</div>
</div>

<div className="col-span-12 md:col-span-6 lg:col-span-8 technical-card p-lg">
<div className="flex justify-between items-start mb-lg border-b border-outline-variant pb-sm">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">WhatsApp Business</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Cloud API - Official Channel</p>
</div>
<div className="flex gap-sm">
<span className="bg-[#fef9c3] text-[#854d0e] px-sm py-0.5 font-body-sm text-body-sm border border-[#fde047]">4 Pending Approval</span>
<button className="bg-white border border-outline-variant text-on-surface text-body-sm px-md py-1 hover:bg-surface-container-high flex items-center gap-1">
<span className="material-symbols-outlined text-sm">add</span> New Template
                            </button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left font-body-sm text-body-sm">
<thead className="bg-surface-container-high border-b border-outline-variant">
<tr>
<th className="px-md py-sm">Template Name</th>
<th className="px-md py-sm font-code-sm">Internal ID</th>
<th className="px-md py-sm">Category</th>
<th className="px-md py-sm">Status</th>
<th className="px-md py-sm">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr>
<td className="px-md py-sm font-semibold">order_confirm_v2</td>
<td className="px-md py-sm font-code-sm">TPL_9821_B</td>
<td className="px-md py-sm">TRANSACTIONAL</td>
<td className="px-md py-sm"><span className="flex items-center gap-xs"><div className="status-dot bg-[#22c55e]"></div>Approved</span></td>
<td className="px-md py-sm"><span className="material-symbols-outlined text-sm cursor-pointer">edit</span></td>
</tr>
<tr>
<td className="px-md py-sm font-semibold">delivery_delayed_01</td>
<td className="px-md py-sm font-code-sm">TPL_1102_A</td>
<td className="px-md py-sm">ALERT</td>
<td className="px-md py-sm"><span className="flex items-center gap-xs"><div className="status-dot bg-[#eab308]"></div>Pending</span></td>
<td className="px-md py-sm"><span className="material-symbols-outlined text-sm cursor-pointer">edit</span></td>
</tr>
<tr>
<td className="px-md py-sm font-semibold">marketing_winter_24</td>
<td className="px-md py-sm font-code-sm">TPL_4545_C</td>
<td className="px-md py-sm">MARKETING</td>
<td className="px-md py-sm"><span className="flex items-center gap-xs"><div className="status-dot bg-[#ef4444]"></div>Rejected</span></td>
<td className="px-md py-sm"><span className="material-symbols-outlined text-sm cursor-pointer">edit</span></td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="col-span-12 md:col-span-7 technical-card p-lg flex flex-col h-[400px]">
<div className="flex justify-between items-center mb-lg border-b border-outline-variant pb-sm">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Payment Webhooks</h3>
<div className="flex gap-sm">
<button className="bg-white border border-outline-variant text-on-surface text-body-sm px-md py-1 hover:bg-surface-container-high">Rotate Keys</button>
<button className="bg-primary-container text-on-primary text-body-sm px-md py-1 hover:opacity-90">Test Payload</button>
</div>
</div>
<div className="flex-1 overflow-hidden flex flex-col">
<div className="bg-surface-container-low border border-outline-variant p-sm mb-md overflow-x-auto">
<p className="font-body-sm font-bold mb-xs">Active Endpoint: <span className="font-code-sm text-primary font-normal">https://core-api.v2.internal/webhooks/razorpay</span></p>
</div>
<div className="flex-1 overflow-y-auto border border-outline-variant bg-[#0f172a] rounded">
<div className="p-md font-code-sm text-code-sm text-[#94a3b8] space-y-sm">
<div className="flex gap-lg border-b border-white/5 pb-xs">
<span className="text-[#22c55e] shrink-0">[200 OK]</span>
<span className="text-[#64748b] shrink-0">14:02:11</span>
<span className="truncate">PAYLOAD: &#123;"entity":"event","account_id":"acc_8Jm...","event":"payment.captured"&#125;</span>
</div>
<div className="flex gap-lg border-b border-white/5 pb-xs">
<span className="text-[#22c55e] shrink-0">[200 OK]</span>
<span className="text-[#64748b] shrink-0">14:01:45</span>
<span className="truncate">PAYLOAD: &#123;"entity":"event","account_id":"acc_8Jm...","event":"payment.captured"&#125;</span>
</div>
<div className="flex gap-lg border-b border-white/5 pb-xs">
<span className="text-[#ef4444] shrink-0">[401 ERR]</span>
<span className="text-[#64748b] shrink-0">13:58:02</span>
<span className="truncate">ERR_INVALID_SIGNATURE: Verification failed for payload sha256...</span>
</div>
<div className="flex gap-lg border-b border-white/5 pb-xs">
<span className="text-[#22c55e] shrink-0">[200 OK]</span>
<span className="text-[#64748b] shrink-0">13:55:30</span>
<span className="truncate">PAYLOAD: &#123;"entity":"event","account_id":"acc_8Jm...","event":"refund.processed"&#125;</span>
</div>
</div>
</div>
</div>
</div>

<div className="col-span-12 md:col-span-5 technical-card p-lg">
<div className="flex justify-between items-start mb-lg border-b border-outline-variant pb-sm">
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">FCM Config</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Google Firebase Cloud Messaging</p>
</div>
<span className="material-symbols-outlined text-surface-tint">notifications_active</span>
</div>
<div className="space-y-md">
<div className="technical-card bg-surface-container-low p-md">
<div className="flex items-center justify-between mb-sm">
<span className="font-body-sm font-semibold">Service Account JSON</span>
<span className="bg-[#22c55e]/10 text-[#166534] px-xs text-[10px] font-bold uppercase tracking-wider">Valid</span>
</div>
<div className="bg-[#1e293b] p-sm rounded font-code-sm text-code-sm text-sky-400 overflow-hidden text-ellipsis h-24">
                                &#123;<br/>
                                  "type": "service_account",<br/>
                                  "project_id": "core-v2-prod-09",<br/>
                                  "private_key_id": "f87...a02",<br/>
                                  "private_key": "-----BEGIN..."<br/>
                                &#125;
                            </div>
</div>
<div className="grid grid-cols-2 gap-md">
<div className="p-sm technical-card bg-white text-center">
<p className="text-[10px] text-on-surface-variant font-bold uppercase">Success Rate</p>
<p className="text-headline-sm font-bold text-[#22c55e]">98.4%</p>
</div>
<div className="p-sm technical-card bg-white text-center">
<p className="text-[10px] text-on-surface-variant font-bold uppercase">Latency (avg)</p>
<p className="text-headline-sm font-bold text-primary">142ms</p>
</div>
</div>
<button className="w-full bg-white border border-outline-variant text-on-surface text-body-sm font-semibold py-sm rounded hover:bg-surface-container-high transition-colors">Replace JSON Config</button>
</div>
</div>

<div className="col-span-12 technical-card p-lg">
<div className="flex items-center gap-md mb-lg">
<div className="bg-primary p-2">
<span className="material-symbols-outlined text-white">account_tree</span>
</div>
<div>
<h3 className="font-headline-sm text-headline-sm text-on-surface">TMID Classification Rules</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant">Global routing engine for Telecommunication Message ID (TMID) categorization</p>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-lg">

<div className="technical-card p-md border-l-4 border-l-primary">
<div className="flex justify-between items-center mb-sm">
<span className="font-bold text-primary">DR Routing</span>
<span className="font-code-sm text-code-sm px-xs bg-surface-container-highest">Regex: ^DR_.*</span>
</div>
<p className="font-body-sm text-on-surface-variant mb-md">Direct Response triggers. Routed through Priority SMS Gateway + WhatsApp Sync.</p>
<div className="flex flex-wrap gap-xs">
<span className="bg-surface-container text-on-surface px-xs py-0.5 text-[10px] border border-outline-variant">P0 PRIORITY</span>
<span className="bg-surface-container text-on-surface px-xs py-0.5 text-[10px] border border-outline-variant">FALLBACK_ENABLED</span>
</div>
</div>

<div className="technical-card p-md border-l-4 border-l-[#34495E]">
<div className="flex justify-between items-center mb-sm">
<span className="font-bold text-[#34495E]">TR Routing</span>
<span className="font-code-sm text-code-sm px-xs bg-surface-container-highest">Regex: ^TR_.*</span>
</div>
<p className="font-body-sm text-on-surface-variant mb-md">Transactional Updates. Low-cost SMS routing with guaranteed delivery report sync.</p>
<div className="flex flex-wrap gap-xs">
<span className="bg-surface-container text-on-surface px-xs py-0.5 text-[10px] border border-outline-variant">L1 COST</span>
<span className="bg-surface-container text-on-surface px-xs py-0.5 text-[10px] border border-outline-variant">BATCHING_OK</span>
</div>
</div>

<div className="technical-card p-md border-l-4 border-l-[#4b6076]">
<div className="flex justify-between items-center mb-sm">
<span className="font-bold text-[#4b6076]">FM Routing</span>
<span className="font-code-sm text-code-sm px-xs bg-surface-container-highest">Regex: ^FM_.*</span>
</div>
<p className="font-body-sm text-on-surface-variant mb-md">Field Management alerts. Direct FCM push with local device retry logic.</p>
<div className="flex flex-wrap gap-xs">
<span className="bg-surface-container text-on-surface px-xs py-0.5 text-[10px] border border-outline-variant">PUSH_ONLY</span>
<span className="bg-surface-container text-on-surface px-xs py-0.5 text-[10px] border border-outline-variant">AUTO_RETRY</span>
</div>
</div>

<div className="technical-card p-md border-l-4 border-l-[#1d3246]">
<div className="flex justify-between items-center mb-sm">
<span className="font-bold text-[#1d3246]">EC Routing</span>
<span className="font-code-sm text-code-sm px-xs bg-surface-container-highest">Regex: ^EC_.*</span>
</div>
<p className="font-body-sm text-on-surface-variant mb-md">Emergency Comms. Dual-channel concurrent broadcast (SMS + Voice Call).</p>
<div className="flex flex-wrap gap-xs">
<span className="bg-surface-container text-on-surface px-xs py-0.5 text-[10px] border border-outline-variant">CONCURRENT</span>
<span className="bg-surface-container text-on-surface px-xs py-0.5 text-[10px] border border-outline-variant">NO_TIMEOUT</span>
</div>
</div>
</div>
</div>
</div>
</main>
  );
};

export default IntegrationsRoutingConfig;
