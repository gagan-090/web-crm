import React from 'react';
import { useGetHrDashboardQuery } from '../../services/api/webCrmApi';

export const HeadcountOverview: React.FC = () => {
  const { data: realDashboard } = useGetHrDashboardQuery();

  const kpis = realDashboard?.data?.kpis;
  const headcount = kpis?.headcount ?? 14;
  const todayAttendance = kpis?.todayAttendance ?? 11;
  const openPositions = kpis?.openPositions ?? 5;

  return (
    <main className=" custom-scrollbar p-margin-page max-w-[1440px] mx-auto text-xs">

<div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-8">
<div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-28">
<div className="flex justify-between items-start">
<span className="text-label-md font-label-md text-on-surface-variant uppercase">Total Headcount</span>
<span className="material-symbols-outlined text-primary">groups</span>
</div>
<div className="flex items-baseline gap-2">
<span className="font-headline-lg text-headline-lg">{headcount} <span className="text-on-surface-variant text-body-md font-normal">Active</span></span>
<span className="text-error font-bold text-label-md">({openPositions} Open Pos.)</span>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-28">
<div className="flex justify-between items-start">
<span className="text-label-md font-label-md text-on-surface-variant uppercase">Today's Attendance</span>
<span className="material-symbols-outlined text-primary">co_present</span>
</div>
<div className="flex items-baseline gap-2">
<span className="font-headline-lg text-headline-lg">{todayAttendance} Present</span>
<span className="text-tertiary-container font-bold text-label-md">Target {headcount}</span>
</div>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-4 flex flex-col justify-between h-28">
<div className="flex justify-between items-start">
<span className="text-label-md font-label-md text-on-surface-variant uppercase">Avg Onboarding TAT</span>
<span className="material-symbols-outlined text-primary">timer</span>
</div>
<div className="flex items-baseline gap-2">
<span className="font-headline-lg text-headline-lg">11.4 <span className="text-on-surface-variant text-body-md font-normal">Days</span></span>
<span className="text-tertiary-container font-bold text-label-md">Target ≤14</span>
</div>
</div>
</div>
<div className="flex flex-col lg:flex-row gap-gutter">

<div className="flex-1 bg-surface-container-lowest border border-outline-variant">
<div className="px-density-table-px py-4 border-b border-outline-variant flex justify-between items-center">
<h2 className="font-title-sm text-title-sm text-primary">Process Coverage Grid</h2>
<button className="text-label-md font-label-md text-primary flex items-center gap-1 hover:underline">
<span className="material-symbols-outlined text-[16px]">download</span>
                            EXPORT AUDIT LOG
                        </button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse table-fixed-header">
<thead>
<tr className="bg-surface-container border-b border-outline-variant">
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant">Role</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant text-center">Target</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant text-center">Active</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant text-center">Probation</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant text-center">Open</th>
<th className="px-density-table-px py-density-table-py font-label-md text-label-md text-on-surface-variant text-right">Coverage %</th>
</tr>
</thead>
<tbody className="text-body-sm font-body-sm divide-y divide-outline-variant">

<tr className="hover:bg-error/5 transition-colors">
<td className="px-density-table-px py-density-table-py font-bold border-l-4 border-error">TH (Team Head)</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">1</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">0</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">0</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono text-error font-bold">1</td>
<td className="px-density-table-px py-density-table-py text-right">
<span className="px-2 py-0.5 rounded bg-error text-white font-bold">0%</span>
</td>
</tr>
<tr className="hover:bg-error/5 transition-colors">
<td className="px-density-table-px py-density-table-py font-bold border-l-4 border-error">TL-TR+MM</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">2</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">1</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">0</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono text-error font-bold">1</td>
<td className="px-density-table-px py-density-table-py text-right">
<span className="px-2 py-0.5 rounded bg-error text-white font-bold">50%</span>
</td>
</tr>

<tr className="hover:bg-secondary/5 transition-colors">
<td className="px-density-table-px py-density-table-py font-bold border-l-4 border-secondary-container">TL-DW</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">2</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">1</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">1</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono text-secondary-container font-bold">0</td>
<td className="px-density-table-px py-density-table-py text-right">
<span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">100%*</span>
</td>
</tr>
<tr className="hover:bg-secondary/5 transition-colors">
<td className="px-density-table-px py-density-table-py font-bold border-l-4 border-secondary-container">DW Callers</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">6</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">4</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">1</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono text-secondary-container font-bold">1</td>
<td className="px-density-table-px py-density-table-py text-right">
<span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">83%</span>
</td>
</tr>

<tr className="hover:bg-tertiary-container/5 transition-colors">
<td className="px-density-table-px py-density-table-py font-bold border-l-4 border-tertiary-fixed-dim">TR Callers</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">3</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">3</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">0</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">0</td>
<td className="px-density-table-px py-density-table-py text-right">
<span className="px-2 py-0.5 rounded bg-tertiary-fixed-dim text-tertiary font-bold">100%</span>
</td>
</tr>
<tr className="hover:bg-tertiary-container/5 transition-colors">
<td className="px-density-table-px py-density-table-py font-bold border-l-4 border-tertiary-fixed-dim">MM Callers</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">2</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">2</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">0</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">0</td>
<td className="px-density-table-px py-density-table-py text-right">
<span className="px-2 py-0.5 rounded bg-tertiary-fixed-dim text-tertiary font-bold">100%</span>
</td>
</tr>
<tr className="hover:bg-secondary/5 transition-colors">
<td className="px-density-table-px py-density-table-py font-bold border-l-4 border-secondary-container">SC Caller</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">2</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">1</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">0</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono text-secondary-container font-bold">1</td>
<td className="px-density-table-px py-density-table-py text-right">
<span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-bold">50%</span>
</td>
</tr>
<tr className="hover:bg-tertiary-container/5 transition-colors">
<td className="px-density-table-px py-density-table-py font-bold border-l-4 border-tertiary-fixed-dim">QC (Quality Control)</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">1</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">1</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">0</td>
<td className="px-density-table-px py-density-table-py text-center font-data-mono">0</td>
<td className="px-density-table-px py-density-table-py text-right">
<span className="px-2 py-0.5 rounded bg-tertiary-fixed-dim text-tertiary font-bold">100%</span>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-3 bg-surface-container-low text-label-md text-on-surface-variant italic">
                        * Note: Probation period counts toward total coverage but requires audit trail verification for final payroll clearance.
                    </div>
</div>

<aside className="w-full lg:w-80 flex flex-col gap-gutter">
<div className="bg-surface-container-lowest border border-outline-variant p-4">
<div className="flex items-center gap-2 mb-4">
<span className="material-symbols-outlined text-primary text-[20px]">notification_important</span>
<h3 className="font-title-sm text-title-sm text-primary">Hiring Urgency</h3>
</div>
<div className="space-y-3">

<div className="p-3 border-l-4 border-error bg-error/5">
<div className="flex justify-between items-center mb-1">
<span className="text-label-md font-bold text-error uppercase">Critical</span>
<span className="text-label-md font-data-mono">Week 42 Target</span>
</div>
<p className="text-body-sm font-bold">Team Head (TH)</p>
<p className="text-label-md text-on-surface-variant">Priority 0: Replacement Needed Immediately</p>
</div>

<div className="p-3 border-l-4 border-secondary-container bg-secondary-container/5">
<div className="flex justify-between items-center mb-1">
<span className="text-label-md font-bold text-secondary-container uppercase">High</span>
<span className="text-label-md font-data-mono">Week 43 Target</span>
</div>
<p className="text-body-sm font-bold">TL-TR+MM</p>
<p className="text-label-md text-on-surface-variant">Capacity strain in operational reporting.</p>
</div>

<div className="p-3 border-l-4 border-primary bg-primary/5">
<div className="flex justify-between items-center mb-1">
<span className="text-label-md font-bold text-primary uppercase">Medium</span>
<span className="text-label-md font-data-mono">Week 44 Target</span>
</div>
<p className="text-body-sm font-bold">DW Caller (1 Vacancy)</p>
<p className="text-label-md text-on-surface-variant">Seasonal load balancer.</p>
</div>

<div className="p-3 border-l-4 border-outline bg-surface-container">
<div className="flex justify-between items-center mb-1">
<span className="text-label-md font-bold text-outline uppercase">Low</span>
<span className="text-label-md font-data-mono">Week 45 Target</span>
</div>
<p className="text-body-sm font-bold">SC Caller (1 Vacancy)</p>
<p className="text-label-md text-on-surface-variant">Reserved for future expansion.</p>
</div>
</div>
<button className="w-full mt-6 py-2 bg-primary text-white font-label-md text-label-md rounded flex justify-center items-center gap-2 hover:opacity-90 transition-opacity">
<span className="material-symbols-outlined text-[18px]">add_task</span>
                            CREATE REQUISITION
                        </button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-4">
<h4 className="text-label-md font-bold text-on-surface-variant uppercase mb-4 tracking-wider">Recent System Audit</h4>
<div className="space-y-4">
<div className="relative pl-6 border-l border-outline-variant pb-1">
<div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-primary"></div>
<p className="text-label-md font-bold">Headcount Update</p>
<p className="text-label-md text-on-surface-variant">Admin updated 'TL-DW' status to Active.</p>
<p className="text-[10px] text-outline font-data-mono mt-1">2023-10-24 14:22:10</p>
</div>
<div className="relative pl-6 border-l border-outline-variant">
<div className="absolute -left-[5px] top-0 w-2 h-2 rounded-full bg-outline"></div>
<p className="text-label-md font-bold">Probation Alert</p>
<p className="text-label-md text-on-surface-variant">System flagged 2 DW Callers for review.</p>
<p className="text-[10px] text-outline font-data-mono mt-1">2023-10-24 09:00:00</p>
</div>
</div>
</div>
</aside>
</div>
</main>
  );
};

export default HeadcountOverview;
