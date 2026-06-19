import React from 'react';

export const SystemHealthDashboard: React.FC = () => {
  return (
    <main className=" flex flex-col relative">



<div className="flex-1 overflow-y-auto p-lg space-y-lg max-w-[1440px] mx-auto w-full">

<div className="flex items-center gap-2 text-body-sm text-on-surface-variant mb-2">
<span className="hover:underline cursor-pointer">Core Systems</span>
<span className="text-outline">/</span>
<span className="font-semibold text-on-surface">System Health Dashboard</span>
</div>

<section className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-md">

<div className="bg-surface-container-lowest border border-outline-variant p-md flex flex-col justify-between h-24">
<div className="flex justify-between items-start">
<span className="font-body-sm font-semibold text-on-secondary-fixed-variant uppercase tracking-wider">Exotel</span>
<div className="w-2 h-2 rounded-full bg-green-500"></div>
</div>
<div>
<div className="text-display-sm font-display-sm text-on-surface">99.8<span className="text-body-sm opacity-50">%</span></div>
<div className="text-[10px] font-code-sm text-on-surface-variant">LATENCY: 142ms</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-md flex flex-col justify-between h-24">
<div className="flex justify-between items-start">
<span className="font-body-sm font-semibold text-on-secondary-fixed-variant uppercase tracking-wider">WhatsApp API</span>
<div className="w-2 h-2 rounded-full bg-green-500"></div>
</div>
<div>
<div className="text-display-sm font-display-sm text-on-surface">1.2<span className="text-body-sm opacity-50">k/m</span></div>
<div className="text-[10px] font-code-sm text-on-surface-variant">DELIVERY: 94%</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-md flex flex-col justify-between h-24">
<div className="flex justify-between items-start">
<span className="font-body-sm font-semibold text-on-secondary-fixed-variant uppercase tracking-wider">Payment Webhook</span>
<div className="w-2 h-2 rounded-full bg-amber-500"></div>
</div>
<div>
<div className="text-display-sm font-display-sm text-on-surface">220<span className="text-body-sm opacity-50">ms</span></div>
<div className="text-[10px] font-code-sm text-on-surface-variant">RETRY QUEUE: 14</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-md flex flex-col justify-between h-24">
<div className="flex justify-between items-start">
<span className="font-body-sm font-semibold text-on-secondary-fixed-variant uppercase tracking-wider">Redis Queue</span>
<div className="w-2 h-2 rounded-full bg-green-500"></div>
</div>
<div>
<div className="text-display-sm font-display-sm text-on-surface">0<span className="text-body-sm opacity-50">lag</span></div>
<div className="text-[10px] font-code-sm text-on-surface-variant">THROUGHPUT: 18k/s</div>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-md flex flex-col justify-between h-24">
<div className="flex justify-between items-start">
<span className="font-body-sm font-semibold text-on-secondary-fixed-variant uppercase tracking-wider">FCM</span>
<div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
</div>
<div>
<div className="text-display-sm font-display-sm text-error">FAIL</div>
<div className="text-[10px] font-code-sm text-error">ERR: TOKEN_EXPIRED</div>
</div>
</div>
</section>

<section className="grid grid-cols-1 md:grid-cols-4 gap-md">
<div className="bg-surface-container-lowest border border-outline-variant p-lg flex items-center gap-lg">
<div className="bg-primary-container text-white p-2 rounded-sm">
<span className="material-symbols-outlined">group</span>
</div>
<div>
<p className="text-body-sm font-semibold text-on-surface-variant uppercase tracking-wide">Active Users</p>
<h2 className="text-display-sm font-display-sm">12,842</h2>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg flex items-center gap-lg">
<div className="bg-primary-container text-white p-2 rounded-sm">
<span className="material-symbols-outlined">call</span>
</div>
<div>
<p className="text-body-sm font-semibold text-on-surface-variant uppercase tracking-wide">Calls Today</p>
<h2 className="text-display-sm font-display-sm">4,102</h2>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg flex items-center gap-lg">
<div className="bg-primary-container text-white p-2 rounded-sm">
<span className="material-symbols-outlined">assignment_turned_in</span>
</div>
<div>
<p className="text-body-sm font-semibold text-on-surface-variant uppercase tracking-wide">Queue Assignments</p>
<h2 className="text-display-sm font-display-sm">891</h2>
</div>
</div>

<div className="bg-surface-container-lowest border-2 border-error p-lg flex items-center gap-lg">
<div className="bg-error text-white p-2 rounded-sm">
<span className="material-symbols-outlined" style={{"fontVariationSettings": "\'FILL\' 1"}}>error</span>
</div>
<div>
<p className="text-body-sm font-semibold text-error uppercase tracking-wide">Failed Webhooks</p>
<h2 className="text-display-sm font-display-sm text-error">27</h2>
</div>
</div>
</section>

<div className="grid grid-cols-1 lg:grid-cols-3 gap-lg">

<div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant">
<div className="px-lg py-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
<h3 className="font-headline-sm text-headline-sm">Active Webhook Threads</h3>
<button className="text-primary font-semibold text-body-sm flex items-center gap-1 hover:underline">
                            View All <span className="material-symbols-outlined text-[16px]">chevron_right</span>
</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead>
<tr className="border-b border-outline-variant bg-surface-dim/30">
<th className="px-lg py-sm text-body-sm font-bold uppercase tracking-tighter">Event ID</th>
<th className="px-lg py-sm text-body-sm font-bold uppercase tracking-tighter">Target Provider</th>
<th className="px-lg py-sm text-body-sm font-bold uppercase tracking-tighter">Status</th>
<th className="px-lg py-sm text-body-sm font-bold uppercase tracking-tighter">Timestamp</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/50">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-sm font-code-sm text-code-sm">TXN_88421_90</td>
<td className="px-lg py-sm text-body-md">Stripe_Web_Prod</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-2">
<div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
<span className="text-body-sm">Delivered</span>
</div>
</td>
<td className="px-lg py-sm font-code-sm text-code-sm opacity-60">2023-10-24 14:02:11</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-sm font-code-sm text-code-sm">EVT_WH_21822</td>
<td className="px-lg py-sm text-body-md">AWS_Lambda_Node</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-2">
<div className="w-1.5 h-1.5 rounded-full bg-amber-500"></div>
<span className="text-body-sm">Retrying (2/5)</span>
</div>
</td>
<td className="px-lg py-sm font-code-sm text-code-sm opacity-60">2023-10-24 14:01:55</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-sm font-code-sm text-code-sm">SYS_ALRT_991</td>
<td className="px-lg py-sm text-body-md">Internal_Slack_Bot</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-2">
<div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
<span className="text-body-sm">Failed</span>
</div>
</td>
<td className="px-lg py-sm font-code-sm text-code-sm opacity-60">2023-10-24 13:59:02</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-sm font-code-sm text-code-sm">TXN_88421_91</td>
<td className="px-lg py-sm text-body-md">Stripe_Web_Prod</td>
<td className="px-lg py-sm">
<div className="flex items-center gap-2">
<div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
<span className="text-body-sm">Delivered</span>
</div>
</td>
<td className="px-lg py-sm font-code-sm text-code-sm opacity-60">2023-10-24 13:58:11</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant flex flex-col">
<div className="px-lg py-md border-b border-outline-variant bg-surface-container-low">
<h3 className="font-headline-sm text-headline-sm">Process Config</h3>
</div>
<div className="p-lg flex-1 space-y-lg">
<div>
<label className="block text-body-sm font-semibold text-on-surface-variant uppercase mb-2">Worker Concurrency</label>
<input className="w-full h-1 bg-outline-variant appearance-none rounded-lg accent-primary cursor-pointer" type="range"/>
<div className="flex justify-between mt-2 font-code-sm text-[10px]">
<span>MIN (2)</span>
<span className="font-bold text-primary">CURR: 16</span>
<span>MAX (64)</span>
</div>
</div>
<div className="space-y-sm">
<label className="block text-body-sm font-semibold text-on-surface-variant uppercase">Redis Cache Flush</label>
<div className="flex gap-2">
<button className="flex-1 bg-secondary text-white py-2 px-md text-body-sm font-semibold rounded-sm hover:bg-on-secondary-fixed-variant transition-colors border-2 border-transparent active:border-primary">Soft Flush</button>
<button className="flex-1 bg-error text-white py-2 px-md text-body-sm font-semibold rounded-sm hover:opacity-90 transition-colors">Hard Flush</button>
</div>
</div>
<div className="pt-lg border-t border-outline-variant/30">
<div className="flex items-center justify-between mb-4">
<span className="text-body-md font-medium">Automatic Scaling</span>
<div className="relative inline-block w-10 align-middle select-none transition duration-200 ease-in">
<input checked className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-5 duration-200" id="toggle" name="toggle" type="checkbox"/>
<label className="toggle-label block overflow-hidden h-5 rounded-full bg-primary-container cursor-pointer" htmlFor="toggle"></label>
</div>
</div>
<div className="bg-surface-container-high/50 p-md border-l-4 border-primary">
<p className="text-body-sm text-on-surface-variant leading-relaxed italic">
                                    "Dynamic allocation is currently prioritizing the Redis cluster based on 14:00 peak traffic prediction."
                                </p>
</div>
</div>
</div>
<div className="p-lg bg-surface-container-lowest border-t border-outline-variant">
<button className="w-full bg-primary-container text-white py-2 font-bold uppercase tracking-widest text-body-sm hard-shadow">Deploy Changes</button>
</div>
</div>
</div>

<section className="bg-inverse-surface text-surface-container-lowest rounded-sm overflow-hidden">
<div className="flex items-center justify-between px-lg py-sm border-b border-white/10 bg-black/20">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[16px]">terminal</span>
<span className="font-code-md text-code-md uppercase">Live Process Stream</span>
</div>
<div className="flex gap-2">
<span className="w-2 h-2 rounded-full bg-green-500"></span>
<span className="w-2 h-2 rounded-full bg-amber-500"></span>
<span className="w-2 h-2 rounded-full bg-red-500"></span>
</div>
</div>
<div className="p-lg h-48 overflow-y-auto mono-text text-[11px] leading-relaxed space-y-1">
<p className="text-green-400">[14:02:33] INF Worker-4: Processed JOB_ID_A092 in 45ms</p>
<p className="text-white/60">[14:02:34] DB Connect: Pool size 8/10 active</p>
<p className="text-amber-400">[14:02:35] WRN FCM_PUSH: Socket latency spike detected (+120ms)</p>
<p className="text-white/60">[14:02:36] INF Redis: Heartbeat acknowledged by master</p>
<p className="text-red-400 font-bold">[14:02:38] ERR Webhook_Manager: Target Stripe_Web_Prod returned 502 Bad Gateway</p>
<p className="text-white/60">[14:02:40] INF Worker-1: Idle for 2000ms, entering low-power state</p>
<p className="text-green-400">[14:02:41] INF System: Garbage collection completed, freed 142MB</p>
<p className="text-white/60">[14:02:43] INF Api_Gateway: Incoming request POST /v2/event</p>
<div className="inline-block w-2 h-4 bg-white/40 animate-pulse ml-1" id="cursor"></div>
</div>
</section>
</div>
</main>
  );
};

export default SystemHealthDashboard;
