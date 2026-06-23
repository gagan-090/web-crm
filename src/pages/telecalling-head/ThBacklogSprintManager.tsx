import React from 'react';

export const ThBacklogSprintManager: React.FC = () => {
  return (
    <main className=" p-md min-h-[calc(100vh-56px)]">

<section className="mb-lg bg-surface border border-outline-variant p-lg rounded relative overflow-hidden custom-shadow">
<div className="flex justify-between items-center">
<div className="z-10">
<p className="text-label-caps text-on-surface-variant uppercase tracking-wider mb-1">Backlog Sprint Health</p>
<div className="flex items-baseline gap-4">
<h2 className="text-[42px] font-extrabold text-primary leading-none">37,384</h2>
<span className="text-lg font-bold text-on-surface-variant">Uncalled Leads</span>
</div>
<p className="mt-2 text-sm text-on-surface-variant flex items-center gap-1">
<span className="text-error font-bold">+12%</span> volume increase from last 48 hours
                        <span className="material-symbols-outlined text-error text-[18px]">trending_up</span>
</p>
</div>
<div className="flex gap-lg z-10">
<div className="text-center px-lg border-l border-outline-variant">
<p className="text-label-caps text-on-surface-variant">Est. Clearance</p>
<p className="text-xl font-bold">4.2 Days</p>
</div>
<div className="text-center px-lg border-l border-outline-variant">
<p className="text-label-caps text-on-surface-variant">Avg. Aging</p>
<p className="text-xl font-bold">18 Days</p>
</div>
</div>
</div>

<div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
<span className="material-symbols-outlined text-[200px]" style={{"fontVariationSettings": "\'FILL\' 1"}}>history</span>
</div>
</section>

<div className="bento-grid">

<div className="col-span-12 lg:col-span-8 bg-surface border border-outline-variant p-md rounded custom-shadow">
<div className="flex items-center justify-between mb-md">
<h3 className="font-headline-md text-on-surface flex items-center gap-2">
<span className="material-symbols-outlined text-primary">person_add</span>
                        Assign Funnel Callers
                    </h3>
<div className="flex items-center gap-2">
<span className="role-badge bg-on-surface text-white px-2 py-0.5 rounded text-[10px]">SPRINT ACTIVE</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
<div className="space-y-1">
<label className="text-label-caps text-[11px] text-on-surface-variant">SELECT CALLER TEAM</label>
<select className="w-full bg-surface-container border border-outline-variant rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none">
<option>Level 2 Support (14 Callers)</option>
<option>High Velocity Team (8 Callers)</option>
<option>Retention Specialists (5 Callers)</option>
</select>
</div>
<div className="space-y-1">
<label className="text-label-caps text-[11px] text-on-surface-variant">DATE RANGE</label>
<div className="relative">
<input className="w-full bg-surface-container border border-outline-variant rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" type="text" value="Oct 24 - Oct 31"/>
<span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">calendar_month</span>
</div>
</div>
<div className="space-y-1">
<label className="text-label-caps text-[11px] text-on-surface-variant">CALL LIMIT (DAILY)</label>
<input className="w-full bg-surface-container border border-outline-variant rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none" type="number" value="150"/>
</div>
</div>
<div className="border-t border-outline-variant pt-md">
<div className="flex items-center justify-between mb-sm">
<p className="text-sm font-bold">Projected Capacity</p>
<p className="text-sm text-on-surface-variant">2,100 calls / day</p>
</div>
<div className="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full w-[65%]"></div>
</div>
</div>
<div className="mt-lg flex gap-md">
<button className="bg-[#2874F0] text-white px-xl py-2 rounded font-bold text-sm hover:brightness-110 transition-all flex items-center gap-2">
<span className="material-symbols-outlined text-[20px]">rocket_launch</span>
                        DEPLOY SPRINT
                    </button>
<button className="border border-outline-variant text-on-surface px-lg py-2 rounded font-bold text-sm hover:bg-surface-container transition-all">
                        CANCEL
                    </button>
</div>
</div>

<div className="col-span-12 lg:col-span-4 bg-surface border border-outline-variant p-md rounded custom-shadow flex flex-col items-center justify-center text-center">
<h3 className="font-label-caps text-on-surface-variant mb-6 uppercase tracking-widest">Sprint Progress</h3>
<div className="relative w-48 h-48 mb-6">
<svg className="w-full h-full">
<circle className="text-surface-container-high" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
<circle className="text-primary progress-ring" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" stroke-dasharray="502.6" stroke-dashoffset="125.6" strokeLinecap="round" strokeWidth="12"></circle>
</svg>
<div className="absolute inset-0 flex flex-col items-center justify-center">
<span className="text-4xl font-extrabold">75%</span>
<span className="text-[10px] text-on-surface-variant font-bold">OF DAILY GOAL</span>
</div>
</div>
<div className="w-full grid grid-cols-2 gap-md divide-x divide-outline-variant">
<div>
<p className="text-xl font-bold text-primary">15,482</p>
<p className="text-[10px] text-on-surface-variant font-bold">ATTEMPTED</p>
</div>
<div>
<p className="text-xl font-bold text-on-surface">20,643</p>
<p className="text-[10px] text-on-surface-variant font-bold">DAILY GOAL</p>
</div>
</div>
</div>

<div className="col-span-12 bg-surface border border-outline-variant p-md rounded custom-shadow">
<div className="flex items-center justify-between mb-lg">
<div>
<h3 className="font-headline-md text-on-surface">Conversion Efficiency</h3>
<p className="text-sm text-on-surface-variant">Analyzing yield performance of aged vs real-time leads</p>
</div>
<div className="flex items-center gap-4">
<div className="flex items-center gap-2">
<span className="w-3 h-3 bg-primary rounded-sm"></span>
<span className="text-xs font-bold">BACKLOG</span>
</div>
<div className="flex items-center gap-2">
<span className="w-3 h-3 bg-secondary rounded-sm"></span>
<span className="text-xs font-bold">FRESH</span>
</div>
</div>
</div>
<div className="h-64 w-full flex items-end justify-around gap-gutter px-xl pb-base relative">

<div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-xl mb-base">
<div className="border-t border-outline-variant w-full h-0"></div>
<div className="border-t border-outline-variant w-full h-0"></div>
<div className="border-t border-outline-variant w-full h-0"></div>
<div className="border-t border-outline-variant w-full h-0"></div>
</div>

<div className="flex flex-col items-center gap-2 w-full max-w-[100px] group">
<div className="flex gap-1 w-full h-48 items-end">
<div className="bg-primary-container w-1/2 h-[45%] rounded-t-sm transition-all group-hover:brightness-95"></div>
<div className="bg-secondary-container w-1/2 h-[85%] rounded-t-sm transition-all group-hover:brightness-95"></div>
</div>
<span className="text-[11px] font-bold text-on-surface-variant uppercase">ZONE A</span>
</div>
<div className="flex flex-col items-center gap-2 w-full max-w-[100px] group">
<div className="flex gap-1 w-full h-48 items-end">
<div className="bg-primary-container w-1/2 h-[60%] rounded-t-sm transition-all group-hover:brightness-95"></div>
<div className="bg-secondary-container w-1/2 h-[75%] rounded-t-sm transition-all group-hover:brightness-95"></div>
</div>
<span className="text-[11px] font-bold text-on-surface-variant uppercase">ZONE B</span>
</div>
<div className="flex flex-col items-center gap-2 w-full max-w-[100px] group">
<div className="flex gap-1 w-full h-48 items-end">
<div className="bg-primary-container w-1/2 h-[30%] rounded-t-sm transition-all group-hover:brightness-95"></div>
<div className="bg-secondary-container w-1/2 h-[65%] rounded-t-sm transition-all group-hover:brightness-95"></div>
</div>
<span className="text-[11px] font-bold text-on-surface-variant uppercase">ZONE C</span>
</div>
<div className="flex flex-col items-center gap-2 w-full max-w-[100px] group">
<div className="flex gap-1 w-full h-48 items-end">
<div className="bg-primary-container w-1/2 h-[70%] rounded-t-sm transition-all group-hover:brightness-95"></div>
<div className="bg-secondary-container w-1/2 h-[80%] rounded-t-sm transition-all group-hover:brightness-95"></div>
</div>
<span className="text-[11px] font-bold text-on-surface-variant uppercase">ZONE D</span>
</div>
<div className="flex flex-col items-center gap-2 w-full max-w-[100px] group">
<div className="flex gap-1 w-full h-48 items-end">
<div className="bg-primary-container w-1/2 h-[55%] rounded-t-sm transition-all group-hover:brightness-95"></div>
<div className="bg-secondary-container w-1/2 h-[90%] rounded-t-sm transition-all group-hover:brightness-95"></div>
</div>
<span className="text-[11px] font-bold text-on-surface-variant uppercase">ZONE E</span>
</div>
</div>
<div className="mt-md p-md bg-surface-container-low rounded border-l-4 border-secondary flex items-start gap-md">
<span className="material-symbols-outlined text-secondary">insights</span>
<div>
<p className="text-sm font-bold">Efficiency Insight</p>
<p className="text-xs text-on-surface-variant">Backlog leads in <span className="font-bold">Zone D</span> are outperforming Zone A by 25%. Consider reallocating higher capacity callers to Zone D to maximize immediate conversion recovery.</p>
</div>
</div>
</div>

<div className="col-span-12 bg-surface border border-outline-variant rounded custom-shadow overflow-hidden">
<div className="p-md border-b border-outline-variant flex justify-between items-center bg-surface-container-low">
<h3 className="font-label-caps font-bold">Active Sprint Performance (Real-time)</h3>
<button className="text-primary font-bold text-xs hover:underline">View All Active Sprints</button>
</div>
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-high text-on-surface-variant text-[11px] font-bold uppercase tracking-wider">
<tr>
<th className="px-md py-3">CALLER IDENTITY</th>
<th className="px-md py-3 text-center">LIMIT</th>
<th className="px-md py-3 text-center">ATTEMPTED</th>
<th className="px-md py-3 text-center">CONVERSION %</th>
<th className="px-md py-3 text-right">STATUS</th>
</tr>
</thead>
<tbody className="text-sm divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-2">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-secondary-fixed text-[10px] flex items-center justify-center font-bold">AK</div>
<span className="font-bold">Animesh Kumar</span>
</div>
</td>
<td className="px-md py-2 text-center font-data-mono">150</td>
<td className="px-md py-2 text-center font-data-mono">142</td>
<td className="px-md py-2 text-center">
<div className="flex items-center justify-center gap-1">
<span className="text-primary font-bold">12.4%</span>
<span className="material-symbols-outlined text-primary text-[14px]">trending_up</span>
</div>
</td>
<td className="px-md py-2 text-right">
<span className="bg-primary-fixed text-on-primary-fixed px-2 py-0.5 rounded text-[10px] font-bold">COMPLETING</span>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-2">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-tertiary-fixed text-[10px] flex items-center justify-center font-bold">SD</div>
<span className="font-bold">Sunita Devi</span>
</div>
</td>
<td className="px-md py-2 text-center font-data-mono">150</td>
<td className="px-md py-2 text-center font-data-mono">88</td>
<td className="px-md py-2 text-center">
<div className="flex items-center justify-center gap-1">
<span className="text-on-surface-variant font-bold">8.1%</span>
<span className="material-symbols-outlined text-outline text-[14px]">horizontal_rule</span>
</div>
</td>
<td className="px-md py-2 text-right">
<span className="bg-surface-container-highest text-on-surface px-2 py-0.5 rounded text-[10px] font-bold">IN PROGRESS</span>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-2">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded-full bg-error-container text-[10px] flex items-center justify-center font-bold">RP</div>
<span className="font-bold">Rahul Prasad</span>
</div>
</td>
<td className="px-md py-2 text-center font-data-mono">150</td>
<td className="px-md py-2 text-center font-data-mono">12</td>
<td className="px-md py-2 text-center">
<div className="flex items-center justify-center gap-1">
<span className="text-error font-bold">2.4%</span>
<span className="material-symbols-outlined text-error text-[14px]">trending_down</span>
</div>
</td>
<td className="px-md py-2 text-right">
<span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-bold">IDLE / ALERT</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</main>
  );
};

export default ThBacklogSprintManager;
