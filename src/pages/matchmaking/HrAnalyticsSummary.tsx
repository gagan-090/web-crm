import React from 'react';

export const HrAnalyticsSummary: React.FC = () => {
  return (
    <main className=" p-margin-page min-h-[calc(100vh-3.5rem)]">

<div className="flex justify-between items-end mb-8">
<div>
<div className="flex items-center gap-2 text-on-surface-variant font-label-md text-label-md mb-1">
<span>Analytics</span>
<span className="material-symbols-outlined text-[12px]">chevron_right</span>
<span className="text-primary font-bold">HR Executive Summary</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-primary tracking-tight">HR Performance Analytics</h1>
</div>
<div className="flex gap-2">
<button className="bg-surface-container-lowest border border-outline-variant px-3 py-1.5 rounded flex items-center gap-2 font-label-md text-label-md text-primary hover:bg-surface-container-low">
<span className="material-symbols-outlined text-[18px]">calendar_today</span>
                        Last 6 Months
                    </button>
<button className="bg-primary text-on-primary px-3 py-1.5 rounded flex items-center gap-2 font-label-md text-label-md hover:opacity-90">
<span className="material-symbols-outlined text-[18px]">download</span>
                        Export Audit Report
                    </button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter mb-gutter">

<div className="bg-surface-container-lowest p-4 border border-outline-variant rounded flex flex-col justify-between">
<div>
<div className="flex justify-between items-center mb-1">
<span className="text-on-surface-variant font-label-md text-label-md uppercase tracking-tight">Attrition Rate</span>
<span className="material-symbols-outlined text-primary text-[20px]" data-icon="trending_down">trending_down</span>
</div>
<div className="flex items-baseline gap-2">
<span className="text-headline-lg font-bold text-primary">8.4%</span>
<span className="text-body-sm font-medium text-tertiary-container bg-tertiary-fixed px-1.5 rounded">Target &lt;10%</span>
</div>
</div>
<div className="mt-4 h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{"width": "84%"}}></div>
</div>
</div>

<div className="bg-surface-container-lowest p-4 border border-outline-variant rounded flex flex-col justify-between">
<div>
<div className="flex justify-between items-center mb-1">
<span className="text-on-surface-variant font-label-md text-label-md uppercase tracking-tight">Avg Onboarding TAT</span>
<span className="material-symbols-outlined text-primary text-[20px]" data-icon="timer">timer</span>
</div>
<div className="flex items-baseline gap-2">
<span className="text-headline-lg font-bold text-primary">11.2 Days</span>
<span className="text-body-sm font-medium text-tertiary-container bg-tertiary-fixed px-1.5 rounded">Target ≤14</span>
</div>
</div>
<div className="mt-4 h-1 bg-surface-container-highest rounded-full overflow-hidden">
<div className="h-full bg-primary" style={{"width": "78%"}}></div>
</div>
</div>

<div className="bg-surface-container-lowest p-4 border border-outline-variant rounded flex flex-col justify-between">
<div>
<div className="flex justify-between items-center mb-1">
<span className="text-on-surface-variant font-label-md text-label-md uppercase tracking-tight">Absconding Log</span>
<span className="material-symbols-outlined text-error text-[20px]" data-icon="person_off">person_off</span>
</div>
<div className="flex items-baseline gap-2">
<span className="text-headline-lg font-bold text-primary">03</span>
<span className="text-body-sm font-medium text-error-container bg-error-container text-on-error-container px-1.5 rounded">-12% MoM</span>
</div>
</div>
<p className="text-body-sm text-on-surface-variant mt-2">Active investigations: 01</p>
</div>

<div className="bg-surface-container-lowest p-4 border border-outline-variant rounded flex flex-col justify-between">
<div>
<div className="flex justify-between items-center mb-1">
<span className="text-on-surface-variant font-label-md text-label-md uppercase tracking-tight">Avg QC New Hires</span>
<span className="material-symbols-outlined text-primary text-[20px]" data-icon="verified">verified</span>
</div>
<div className="flex items-baseline gap-2">
<span className="text-headline-lg font-bold text-primary">92.5</span>
<span className="text-body-sm font-medium text-on-surface-variant">/ 100</span>
</div>
</div>
<div className="flex items-center gap-1 mt-4">
<span className="material-symbols-outlined text-secondary text-[16px]" style={{"fontVariationSettings": "\'FILL\' 1"}}>star</span>
<span className="material-symbols-outlined text-secondary text-[16px]" style={{"fontVariationSettings": "\'FILL\' 1"}}>star</span>
<span className="material-symbols-outlined text-secondary text-[16px]" style={{"fontVariationSettings": "\'FILL\' 1"}}>star</span>
<span className="material-symbols-outlined text-secondary text-[16px]" style={{"fontVariationSettings": "\'FILL\' 1"}}>star</span>
<span className="material-symbols-outlined text-secondary text-[16px]" style={{"fontVariationSettings": "\'FILL\' 0"}}>star</span>
</div>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

<div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded overflow-hidden">
<div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
<h3 className="font-title-sm text-title-sm text-primary">6-Month Attrition Trend</h3>
<div className="flex gap-4">
<div className="flex items-center gap-1">
<div className="w-3 h-3 bg-primary rounded-full"></div>
<span className="text-label-md font-label-md text-on-surface-variant">Actual</span>
</div>
<div className="flex items-center gap-1">
<div className="w-3 h-3 bg-outline-variant rounded-full"></div>
<span className="text-label-md font-label-md text-on-surface-variant">Target</span>
</div>
</div>
</div>
<div className="p-6">
<div className="chart-container flex items-end justify-between gap-4">

<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="relative w-full bg-surface-container h-[180px] rounded-t overflow-hidden">
<div className="absolute bottom-0 w-full bg-primary opacity-20 h-[100px]"></div>
<div className="absolute bottom-0 w-full bg-primary h-[80px] transition-all hover:opacity-80"></div>
</div>
<span className="font-label-md text-label-md text-on-surface-variant uppercase">Sep</span>
</div>

<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="relative w-full bg-surface-container h-[180px] rounded-t overflow-hidden">
<div className="absolute bottom-0 w-full bg-primary opacity-20 h-[100px]"></div>
<div className="absolute bottom-0 w-full bg-primary h-[95px] transition-all hover:opacity-80"></div>
</div>
<span className="font-label-md text-label-md text-on-surface-variant uppercase">Oct</span>
</div>

<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="relative w-full bg-surface-container h-[180px] rounded-t overflow-hidden">
<div className="absolute bottom-0 w-full bg-primary opacity-20 h-[100px]"></div>
<div className="absolute bottom-0 w-full bg-primary h-[115px] transition-all hover:opacity-80"></div>
</div>
<span className="font-label-md text-label-md text-on-surface-variant uppercase">Nov</span>
</div>

<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="relative w-full bg-surface-container h-[180px] rounded-t overflow-hidden">
<div className="absolute bottom-0 w-full bg-primary opacity-20 h-[100px]"></div>
<div className="absolute bottom-0 w-full bg-primary h-[88px] transition-all hover:opacity-80"></div>
</div>
<span className="font-label-md text-label-md text-on-surface-variant uppercase">Dec</span>
</div>

<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="relative w-full bg-surface-container h-[180px] rounded-t overflow-hidden">
<div className="absolute bottom-0 w-full bg-primary opacity-20 h-[100px]"></div>
<div className="absolute bottom-0 w-full bg-primary h-[72px] transition-all hover:opacity-80"></div>
</div>
<span className="font-label-md text-label-md text-on-surface-variant uppercase">Jan</span>
</div>

<div className="flex-1 flex flex-col items-center gap-2 group">
<div className="relative w-full bg-surface-container h-[180px] rounded-t overflow-hidden">
<div className="absolute bottom-0 w-full bg-primary opacity-20 h-[100px]"></div>
<div className="absolute bottom-0 w-full bg-primary h-[64px] transition-all hover:opacity-80"></div>
</div>
<span className="font-label-md text-label-md text-on-surface-variant uppercase">Feb</span>
</div>
</div>
</div>
</div>

<div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded">
<div className="px-6 py-4 border-b border-outline-variant">
<h3 className="font-title-sm text-title-sm text-primary">Avg Ramp-up (80% Target)</h3>
</div>
<div className="p-6 space-y-6">
<div className="space-y-2">
<div className="flex justify-between font-label-md text-label-md">
<span className="text-on-surface">Operations Manager</span>
<span className="font-bold">45 Days</span>
</div>
<div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-secondary-container" style={{"width": "75%"}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between font-label-md text-label-md">
<span className="text-on-surface">Warehouse Lead</span>
<span className="font-bold">28 Days</span>
</div>
<div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-secondary-container" style={{"width": "50%"}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between font-label-md text-label-md">
<span className="text-on-surface">Logistics Coordinator</span>
<span className="font-bold">22 Days</span>
</div>
<div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-secondary-container" style={{"width": "40%"}}></div>
</div>
</div>
<div className="space-y-2">
<div className="flex justify-between font-label-md text-label-md">
<span className="text-on-surface">Data Entry Associate</span>
<span className="font-bold">14 Days</span>
</div>
<div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
<div className="h-full bg-secondary-container" style={{"width": "25%"}}></div>
</div>
</div>
<div className="mt-4 pt-4 border-t border-outline-variant">
<p className="text-body-sm text-on-surface-variant italic">Benchmark: Average 24 days across all segments.</p>
</div>
</div>
</div>

<div className="lg:col-span-12 bg-surface-container-lowest border border-outline-variant rounded overflow-hidden">
<div className="px-6 py-4 border-b border-outline-variant flex justify-between items-center">
<h3 className="font-title-sm text-title-sm text-primary">Headcount Pipeline (Filled vs Open)</h3>
<div className="flex items-center gap-6">
<div className="flex flex-col items-end">
<span className="text-label-md font-label-md text-on-surface-variant uppercase">Total Capacity</span>
<span className="font-bold text-primary">1,200</span>
</div>
<div className="flex flex-col items-end">
<span className="text-label-md font-label-md text-on-surface-variant uppercase">Active Workforce</span>
<span className="font-bold text-tertiary-container">1,048</span>
</div>
<div className="flex flex-col items-end">
<span className="text-label-md font-label-md text-on-surface-variant uppercase">Vacancy Gap</span>
<span className="font-bold text-error">152</span>
</div>
</div>
</div>
<div className="p-0 overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase">Department</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase">Sanctioned</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase">Filled</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase">In-Pipeline</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase">Open Gap</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant uppercase">Health</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container transition-colors">
<td className="px-density-table-px py-density-table-py font-body-md text-body-md font-bold">Fleet Operations</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono">450</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono">412</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono text-secondary">24</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono text-error">14</td>
<td className="px-density-table-px py-density-table-py">
<span className="bg-tertiary-fixed text-tertiary-container px-2 py-0.5 rounded font-label-md text-[10px] font-bold">STABLE</span>
</td>
</tr>
<tr className="hover:bg-surface-container transition-colors">
<td className="px-density-table-px py-density-table-py font-body-md text-body-md font-bold">Last-Mile Logistics</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono">300</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono">220</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono text-secondary">45</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono text-error">35</td>
<td className="px-density-table-px py-density-table-py">
<span className="bg-error-container text-on-error-container px-2 py-0.5 rounded font-label-md text-[10px] font-bold">CRITICAL</span>
</td>
</tr>
<tr className="hover:bg-surface-container transition-colors">
<td className="px-density-table-px py-density-table-py font-body-md text-body-md font-bold">Tech &amp; Analytics</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono">80</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono">74</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono text-secondary">4</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono text-error">2</td>
<td className="px-density-table-px py-density-table-py">
<span className="bg-tertiary-fixed text-tertiary-container px-2 py-0.5 rounded font-label-md text-[10px] font-bold">STABLE</span>
</td>
</tr>
<tr className="hover:bg-surface-container transition-colors">
<td className="px-density-table-px py-density-table-py font-body-md text-body-md font-bold">Corporate Support</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono">120</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono">115</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono text-secondary">2</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-data-mono text-error">3</td>
<td className="px-density-table-px py-density-table-py">
<span className="bg-tertiary-fixed text-tertiary-container px-2 py-0.5 rounded font-label-md text-[10px] font-bold">OPTIMAL</span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>

<footer className="mt-8 pt-6 border-t border-outline-variant flex justify-between items-center text-on-surface-variant font-label-md text-label-md">
<div className="flex items-center gap-4">
<span>Audit Version: 2024.Q1.04</span>
<span className="flex items-center gap-1"><span className="w-2 h-2 bg-tertiary rounded-full"></span> System Healthy</span>
</div>
<div className="flex gap-4">
<a className="hover:text-primary transition-colors" href="#">Privacy Policy</a>
<a className="hover:text-primary transition-colors" href="#">Data Retention Rules</a>
</div>
</footer>
</main>
  );
};

export default HrAnalyticsSummary;
