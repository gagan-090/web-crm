import React from 'react';

export const RevenueAttributionAudit: React.FC = () => {
  return (
    <main className=" p-xl space-y-xl max-w-[1440px] mx-auto ">

<div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
<div>
<nav className="flex items-center gap-2 text-body-sm text-outline mb-1">
<span>Core</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span>Financials</span>
<span className="material-symbols-outlined text-xs">chevron_right</span>
<span className="text-on-surface font-semibold">Attribution Audit</span>
</nav>
<h2 className="font-display-sm text-display-sm">Revenue Attribution Audit</h2>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-md flex items-center gap-4 rounded-sm">
<div className="flex flex-col">
<label className="text-body-sm font-semibold mb-1">Attribution Window</label>
<div className="flex items-center gap-2">
<input className="w-16 h-8 text-code-sm border-outline-variant focus:border-primary-container rounded-sm" type="number" value="72"/>
<span className="text-body-sm text-outline">Hours</span>
</div>
</div>
<div className="h-10 w-px bg-outline-variant"></div>
<button className="bg-primary-container text-white px-lg h-10 font-semibold text-sm hover:opacity-90 transition-opacity">
                        Apply Policy
                    </button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-lg">
<div className="bg-surface-container-lowest border border-outline-variant p-lg flex flex-col justify-between h-32">
<div className="flex justify-between items-start">
<span className="text-body-sm font-semibold text-outline">TOTAL ATTRIBUTED</span>
<span className="material-symbols-outlined text-primary">account_balance_wallet</span>
</div>
<div>
<div className="text-2xl font-bold font-display-sm">₹1,429,203</div>
<div className="text-xs text-green-600 flex items-center gap-1 font-semibold">
<span className="material-symbols-outlined text-xs">trending_up</span> +4.2% vs last audit
                        </div>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg flex flex-col justify-between h-32">
<div className="flex justify-between items-start">
<span className="text-body-sm font-semibold text-outline">ORGANIC RATE</span>
<span className="material-symbols-outlined text-primary">eco</span>
</div>
<div>
<div className="text-2xl font-bold font-display-sm">18.4%</div>
<div className="w-full bg-outline-variant h-1 mt-2">
<div className="bg-primary h-full" style={{"width": "18.4%"}}></div>
</div>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg flex flex-col justify-between h-32">
<div className="flex justify-between items-start">
<span className="text-body-sm font-semibold text-outline">DISPUTE QUEUE</span>
<span className="material-symbols-outlined text-error">warning</span>
</div>
<div>
<div className="text-2xl font-bold font-display-sm">42</div>
<div className="text-xs text-error flex items-center gap-1 font-semibold">
                            Critical resolution required
                        </div>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-lg flex flex-col justify-between h-32">
<div className="flex justify-between items-start">
<span className="text-body-sm font-semibold text-outline">CONFIDENCE SCORE</span>
<span className="material-symbols-outlined text-primary">verified</span>
</div>
<div>
<div className="text-2xl font-bold font-display-sm">98.2%</div>
<div className="text-xs text-outline font-medium">Auto-computed delta</div>
</div>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-3 gap-xl">

<div className="lg:col-span-2 flex flex-col bg-surface-container-lowest border border-outline-variant overflow-hidden">
<div className="p-lg border-b border-outline-variant flex justify-between items-center bg-white sticky top-0 z-20">
<h3 className="font-headline-sm">Subscription Attribution Log</h3>
<div className="flex gap-2">
<button className="border border-outline-variant px-3 py-1 text-xs font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-sm">filter_list</span> Filter
                            </button>
<button className="border border-outline-variant px-3 py-1 text-xs font-semibold flex items-center gap-1">
<span className="material-symbols-outlined text-sm">download</span> Export
                            </button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="sticky-header">
<tr className="border-b border-outline-variant text-body-sm text-outline-variant">
<th className="px-lg py-3 font-semibold text-on-surface">SUBSCRIPTION ID</th>
<th className="px-lg py-3 font-semibold text-on-surface">CALLER / SOURCE</th>
<th className="px-lg py-3 font-semibold text-on-surface">DELTA TIME</th>
<th className="px-lg py-3 font-semibold text-on-surface">CORRECTNESS</th>
<th className="px-lg py-3 font-semibold text-on-surface">STATUS</th>
</tr>
</thead>
<tbody className="text-table-data font-table-data">
<tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors group">
<td className="px-lg py-4 font-code-sm text-primary">SUB-94021-X</td>
<td className="px-lg py-4">
<div className="flex flex-col">
<span className="font-bold">Google Ads</span>
<span className="text-xs text-outline">Campaign: Q4_SaaS_Search</span>
</div>
</td>
<td className="px-lg py-4 font-code-sm">12h 04m</td>
<td className="px-lg py-4">
<div className="flex items-center gap-2">
<div className="w-12 h-2 bg-outline-variant rounded-full overflow-hidden">
<div className="bg-green-600 h-full" style={{"width": "95%"}}></div>
</div>
<span className="text-xs font-bold">95%</span>
</div>
</td>
<td className="px-lg py-4">
<span className="px-2 py-0.5 rounded-sm bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider border border-green-200">Verified</span>
</td>
</tr>
<tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td className="px-lg py-4 font-code-sm text-primary">SUB-88129-L</td>
<td className="px-lg py-4">
<div className="flex flex-col">
<span className="font-bold">LinkedIn-Corp</span>
<span className="text-xs text-outline">Direct Lead Gen Form</span>
</div>
</td>
<td className="px-lg py-4 font-code-sm">01h 15m</td>
<td className="px-lg py-4">
<div className="flex items-center gap-2">
<div className="w-12 h-2 bg-outline-variant rounded-full overflow-hidden">
<div className="bg-amber-500 h-full" style={{"width": "62%"}}></div>
</div>
<span className="text-xs font-bold">62%</span>
</div>
</td>
<td className="px-lg py-4">
<span className="px-2 py-0.5 rounded-sm bg-amber-100 text-amber-800 text-[10px] font-bold uppercase tracking-wider border border-amber-200">Disputed</span>
</td>
</tr>
<tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td className="px-lg py-4 font-code-sm text-primary">SUB-77210-B</td>
<td className="px-lg py-4">
<div className="flex flex-col">
<span className="font-bold">Organic</span>
<span className="text-xs text-outline">Direct Navigation</span>
</div>
</td>
<td className="px-lg py-4 font-code-sm">--</td>
<td className="px-lg py-4">
<div className="flex items-center gap-2">
<div className="w-12 h-2 bg-outline-variant rounded-full overflow-hidden">
<div className="bg-green-600 h-full" style={{"width": "100%"}}></div>
</div>
<span className="text-xs font-bold">100%</span>
</div>
</td>
<td className="px-lg py-4">
<span className="px-2 py-0.5 rounded-sm bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider border border-green-200">Verified</span>
</td>
</tr>
<tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td className="px-lg py-4 font-code-sm text-primary">SUB-66154-K</td>
<td className="px-lg py-4">
<div className="flex flex-col">
<span className="font-bold">Referral</span>
<span className="text-xs text-outline">Affiliate: #tech_insider</span>
</div>
</td>
<td className="px-lg py-4 font-code-sm">48h 22m</td>
<td className="px-lg py-4">
<div className="flex items-center gap-2">
<div className="w-12 h-2 bg-outline-variant rounded-full overflow-hidden">
<div className="bg-red-500 h-full" style={{"width": "24%"}}></div>
</div>
<span className="text-xs font-bold">24%</span>
</div>
</td>
<td className="px-lg py-4">
<span className="px-2 py-0.5 rounded-sm bg-red-100 text-red-800 text-[10px] font-bold uppercase tracking-wider border border-red-200">Conflict</span>
</td>
</tr>
<tr className="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
<td className="px-lg py-4 font-code-sm text-primary">SUB-55902-M</td>
<td className="px-lg py-4">
<div className="flex flex-col">
<span className="font-bold">Twitter Paid</span>
<span className="text-xs text-outline">Ad Group: Conversion_V2</span>
</div>
</td>
<td className="px-lg py-4 font-code-sm">04h 55m</td>
<td className="px-lg py-4">
<div className="flex items-center gap-2">
<div className="w-12 h-2 bg-outline-variant rounded-full overflow-hidden">
<div className="bg-green-600 h-full" style={{"width": "88%"}}></div>
</div>
<span className="text-xs font-bold">88%</span>
</div>
</td>
<td className="px-lg py-4">
<span className="px-2 py-0.5 rounded-sm bg-green-100 text-green-800 text-[10px] font-bold uppercase tracking-wider border border-green-200">Verified</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="space-y-xl">

<div className="bg-surface-container-lowest border border-outline-variant flex flex-col">
<div className="p-lg border-b border-outline-variant bg-white">
<h3 className="font-headline-sm flex items-center gap-2 text-error">
<span className="material-symbols-outlined text-error">gavel</span>
                                Disputed Records
                            </h3>
</div>
<div className="p-lg space-y-4">
<div className="p-md border border-outline-variant border-l-4 border-l-amber-500 bg-surface-container-low rounded-sm">
<div className="flex justify-between items-start mb-2">
<span className="font-code-sm text-primary">SUB-88129-L</span>
<span className="text-[10px] font-bold text-outline uppercase tracking-tighter">Delta Conflict</span>
</div>
<p className="text-xs mb-3 text-on-surface-variant">Attributed to LinkedIn, but user has multiple UTM touches within the 72h window. Conflict with "Internal-Newsletter".</p>
<div className="grid grid-cols-2 gap-2">
<button className="bg-primary text-white py-2 rounded-sm text-xs font-bold hover:opacity-90">Approve Main</button>
<button className="bg-white border border-outline-variant text-on-surface py-2 rounded-sm text-xs font-bold hover:bg-surface-container-high transition-colors">Re-Attribute</button>
</div>
</div>
<div className="p-md border border-outline-variant border-l-4 border-l-red-500 bg-surface-container-low rounded-sm">
<div className="flex justify-between items-start mb-2">
<span className="font-code-sm text-primary">SUB-66154-K</span>
<span className="text-[10px] font-bold text-outline uppercase tracking-tighter">Window Expired</span>
</div>
<p className="text-xs mb-3 text-on-surface-variant">Attribution occurred at 72h 45m. Outside current audit policy by 45 minutes.</p>
<div className="grid grid-cols-2 gap-2">
<button className="bg-primary text-white py-2 rounded-sm text-xs font-bold hover:opacity-90">Grant Waiver</button>
<button className="bg-white border border-outline-variant text-on-surface py-2 rounded-sm text-xs font-bold hover:bg-surface-container-high transition-colors">Mark Organic</button>
</div>
</div>
</div>
<div className="p-md bg-surface-container-high border-t border-outline-variant text-center">
<button className="text-primary text-xs font-bold hover:underline">View All 42 Disputes</button>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-lg flex flex-col">
<h3 className="font-headline-sm mb-4">Organic Rate Trend</h3>
<div className="h-48 relative flex items-end gap-1 px-2 mb-4 border-b border-outline-variant">

<div className="flex-1 bg-primary/20 hover:bg-primary transition-colors cursor-pointer group relative" style={{"height": "45%"}}>
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] px-1 rounded hidden group-hover:block">15%</div>
</div>
<div className="flex-1 bg-primary/20 hover:bg-primary transition-colors cursor-pointer group relative" style={{"height": "52%"}}>
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] px-1 rounded hidden group-hover:block">17%</div>
</div>
<div className="flex-1 bg-primary/20 hover:bg-primary transition-colors cursor-pointer group relative" style={{"height": "48%"}}>
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] px-1 rounded hidden group-hover:block">16%</div>
</div>
<div className="flex-1 bg-primary/20 hover:bg-primary transition-colors cursor-pointer group relative" style={{"height": "62%"}}>
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] px-1 rounded hidden group-hover:block">21%</div>
</div>
<div className="flex-1 bg-primary/20 hover:bg-primary transition-colors cursor-pointer group relative" style={{"height": "55%"}}>
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] px-1 rounded hidden group-hover:block">18.4%</div>
</div>
<div className="flex-1 bg-primary/20 hover:bg-primary transition-colors cursor-pointer group relative" style={{"height": "40%"}}>
<div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-white text-[10px] px-1 rounded hidden group-hover:block">13%</div>
</div>
</div>
<div className="flex justify-between text-[10px] text-outline font-bold uppercase tracking-widest">
<span>Mon</span>
<span>Tue</span>
<span>Wed</span>
<span>Thu</span>
<span>Fri</span>
<span>Sat</span>
</div>
<div className="mt-4 p-md bg-secondary-container/30 border border-secondary-container rounded-sm flex items-start gap-2">
<span className="material-symbols-outlined text-sm text-secondary">info</span>
<p className="text-[11px] leading-tight text-on-secondary-fixed-variant">
<strong>Insight:</strong> Weekend organic traffic is up 14% compared to week-over-week average. Re-evaluating paid spend efficiency for Saturday/Sunday.
                            </p>
</div>
</div>
</div>
</div>

<div className="flex justify-between items-center py-xl text-body-sm text-outline border-t border-outline-variant">
<span>Last auto-sync: 2 minutes ago</span>
<div className="flex gap-4">
<a className="hover:text-primary underline" href="#">Download Full Audit Report</a>
<a className="hover:text-primary underline" href="#">Attribution Methodology Documentation</a>
</div>
</div>
</main>
  );
};

export default RevenueAttributionAudit;
