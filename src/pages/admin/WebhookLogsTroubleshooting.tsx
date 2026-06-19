import React from 'react';

export const WebhookLogsTroubleshooting: React.FC = () => {
  return (
    <main className=" p-xl flex flex-col gap-lg">

<nav className="flex items-center gap-2 text-body-sm font-body-sm text-outline">
<a className="hover:text-primary" href="#">Core Systems</a>
<span>/</span>
<span className="text-on-surface font-semibold">Webhook Logs</span>
</nav>

<div className="bg-error-container border-l-4 border-error p-lg flex items-center justify-between shadow-sm">
<div className="flex items-start gap-md">
<span className="material-symbols-outlined text-error" data-icon="warning">warning</span>
<div>
<h3 className="font-bold text-on-error-container">Critical Delivery Failures</h3>
<p className="text-body-sm text-on-error-container/80">There are 127 failed webhook events from Stripe-API in the last 60 minutes.</p>
</div>
</div>
<button className="bg-error text-on-error px-xl py-sm font-bold text-body-sm hover:opacity-90 transition-all flex items-center gap-sm">
<span className="material-symbols-outlined" data-icon="replay">replay</span>
                    Retry All
                </button>
</div>

<div className="flex items-center justify-between gap-xl">
<div className="flex gap-md">
<div className="flex flex-col gap-xs">
<label className="text-body-sm font-semibold text-on-surface-variant">Source</label>
<select className="bg-white border border-outline-variant px-md py-sm text-body-sm min-w-[160px] focus:border-primary-container outline-none">
<option>All Sources</option>
<option>Stripe-API</option>
<option>GitHub-Actions</option>
<option>Twilio-SMS</option>
<option>Auth0-Hook</option>
</select>
</div>
<div className="flex flex-col gap-xs">
<label className="text-body-sm font-semibold text-on-surface-variant">Status</label>
<select className="bg-white border border-outline-variant px-md py-sm text-body-sm min-w-[160px] focus:border-primary-container outline-none">
<option>All Statuses</option>
<option>200 OK</option>
<option>400 Bad Request</option>
<option>404 Not Found</option>
<option>500 Internal Error</option>
<option>Timed Out</option>
</select>
</div>
</div>
<div className="flex gap-sm pt-5">
<button className="bg-white border border-outline-variant text-on-surface px-md py-sm flex items-center gap-sm hover:bg-surface-container-low transition-all">
<span className="material-symbols-outlined" data-icon="download">download</span> Export CSV
                    </button>
<button className="bg-white border border-outline-variant text-on-surface px-md py-sm flex items-center gap-sm hover:bg-surface-container-low transition-all">
<span className="material-symbols-outlined" data-icon="refresh">refresh</span>
</button>
</div>
</div>

<div className="bg-white border border-outline-variant flex-1 flex flex-col min-h-0 overflow-hidden">
<div className="overflow-y-auto flex-1">
<table className="w-full text-left border-collapse">
<thead className="sticky top-0 bg-surface-container-low z-10 border-b border-outline-variant">
<tr>
<th className="px-md py-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-wider w-12">
<input className="rounded-none" type="checkbox"/>
</th>
<th className="px-md py-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-wider">Status</th>
<th className="px-md py-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-wider">Event ID</th>
<th className="px-md py-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-wider">Source</th>
<th className="px-md py-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-wider">Payload Type</th>
<th className="px-md py-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-wider">Timestamp</th>
<th className="px-md py-sm text-body-sm font-bold text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-primary/5 cursor-pointer transition-colors group" >
<td className="px-md py-sm"><input className="rounded-none" type="checkbox"/></td>
<td className="px-md py-sm">
<div className="flex items-center gap-sm">
<div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
<span className="text-body-sm font-semibold">200 OK</span>
</div>
</td>
<td className="px-md py-sm font-code-sm text-code-sm text-primary">evt_01HJK239A</td>
<td className="px-md py-sm text-body-sm">Stripe-API</td>
<td className="px-md py-sm">
<span className="px-sm py-xs bg-surface-container-highest text-on-secondary-container text-[10px] font-bold uppercase">invoice.paid</span>
</td>
<td className="px-md py-sm text-body-sm text-outline">Oct 24, 14:02:11</td>
<td className="px-md py-sm text-right space-x-2">
<button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined" data-icon="replay">replay</span></button>
<button className="text-outline hover:text-error transition-colors"><span className="material-symbols-outlined" data-icon="block">block</span></button>
</td>
</tr>

<tr className="bg-error-container/10 hover:bg-error-container/20 cursor-pointer transition-colors group" >
<td className="px-md py-sm"><input className="rounded-none" type="checkbox"/></td>
<td className="px-md py-sm">
<div className="flex items-center gap-sm">
<div className="w-1.5 h-1.5 rounded-full bg-red-500"></div>
<span className="text-body-sm font-semibold text-error">500 ERROR</span>
</div>
</td>
<td className="px-md py-sm font-code-sm text-code-sm text-primary">evt_01HJK23BB</td>
<td className="px-md py-sm text-body-sm">Stripe-API</td>
<td className="px-md py-sm">
<span className="px-sm py-xs bg-error-container text-error text-[10px] font-bold uppercase">sub.deleted</span>
</td>
<td className="px-md py-sm text-body-sm text-outline">Oct 24, 13:58:45</td>
<td className="px-md py-sm text-right space-x-2">
<button className="text-error hover:opacity-70 transition-colors font-bold"><span className="material-symbols-outlined" data-icon="replay">replay</span></button>
<button className="text-outline hover:text-on-surface transition-colors"><span className="material-symbols-outlined" data-icon="visibility_off">visibility_off</span></button>
</td>
</tr>

<tr className="hover:bg-primary/5 cursor-pointer transition-colors group" >
<td className="px-md py-sm"><input className="rounded-none" type="checkbox"/></td>
<td className="px-md py-sm">
<div className="flex items-center gap-sm">
<div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
<span className="text-body-sm font-semibold">200 OK</span>
</div>
</td>
<td className="px-md py-sm font-code-sm text-code-sm text-primary">evt_01HJK23CF</td>
<td className="px-md py-sm text-body-sm">GitHub-Actions</td>
<td className="px-md py-sm">
<span className="px-sm py-xs bg-surface-container-highest text-on-secondary-container text-[10px] font-bold uppercase">workflow.done</span>
</td>
<td className="px-md py-sm text-body-sm text-outline">Oct 24, 13:55:12</td>
<td className="px-md py-sm text-right space-x-2">
<button className="text-outline hover:text-primary transition-colors"><span className="material-symbols-outlined" data-icon="replay">replay</span></button>
<button className="text-outline hover:text-error transition-colors"><span className="material-symbols-outlined" data-icon="block">block</span></button>
</td>
</tr>


</tbody>
</table>
</div>
</div>
</main>
  );
};

export default WebhookLogsTroubleshooting;
