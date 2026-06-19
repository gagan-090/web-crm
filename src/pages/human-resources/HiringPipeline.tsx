import React from 'react';

export const HiringPipeline: React.FC = () => {
  return (
    <main className=" p-margin-page bg-background min-h-screen">


<div className="grid grid-cols-4 gap-gutter mb-8">
<div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg">
<p className="text-label-md text-on-surface-variant font-bold uppercase mb-1">Open Positions</p>
<p className="text-headline-lg text-primary">12</p>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg">
<p className="text-label-md text-on-surface-variant font-bold uppercase mb-1">Candidates in Pipeline</p>
<p className="text-headline-lg text-primary">148</p>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg">
<p className="text-label-md text-on-surface-variant font-bold uppercase mb-1">Interviews This Week</p>
<p className="text-headline-lg text-secondary font-bold">34</p>
</div>
<div className="bg-surface-container-lowest border border-outline-variant p-4 rounded-lg">
<p className="text-label-md text-on-surface-variant font-bold uppercase mb-1">Avg. Time to Hire</p>
<p className="text-headline-lg text-primary">18 Days</p>
</div>
</div>

<div className="bg-white border border-outline-variant rounded-lg mb-8 overflow-hidden shadow-sm">
<div className="px-4 py-3 border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
<h3 className="font-title-sm text-primary">Active Job Openings</h3>
<div className="flex gap-2">
<button className="text-label-md text-primary font-bold px-2 py-1 border border-outline-variant rounded bg-white">All Roles</button>
<button className="text-label-md text-on-surface-variant px-2 py-1 border border-outline-variant rounded bg-white">Critical Only</button>
</div>
</div>
<table className="w-full border-collapse text-left">
<thead>
<tr className="bg-surface-container-lowest text-label-md text-on-surface-variant uppercase tracking-wider border-b border-outline-variant">
<th className="px-density-table-px py-density-table-py font-bold">Role</th>
<th className="px-density-table-px py-density-table-py font-bold">Process</th>
<th className="px-density-table-px py-density-table-py font-bold">Priority</th>
<th className="px-density-table-px py-density-table-py font-bold">Days Active</th>
<th className="px-density-table-px py-density-table-py font-bold">Pipeline</th>
<th className="px-density-table-px py-density-table-py font-bold">Stage</th>
<th className="px-density-table-px py-density-table-py font-bold text-right">Target Hire</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low cursor-pointer transition-colors" >
<td className="px-density-table-px py-3 font-title-sm text-primary">Regional Operations Manager</td>
<td className="px-density-table-px py-3 text-body-sm">Standard Corporate</td>
<td className="px-density-table-px py-3">
<span className="bg-error text-white text-[10px] font-black px-2 py-0.5 rounded">CRITICAL</span>
</td>
<td className="px-density-table-px py-3 text-body-md">14 Days</td>
<td className="px-density-table-px py-3 text-body-md">28 Candidates</td>
<td className="px-density-table-px py-3">
<div className="flex gap-1">
<div className="w-3 h-1 bg-primary rounded-full"></div>
<div className="w-3 h-1 bg-primary rounded-full"></div>
<div className="w-3 h-1 bg-outline-variant rounded-full"></div>
<div className="w-3 h-1 bg-outline-variant rounded-full"></div>
</div>
</td>
<td className="px-density-table-px py-3 text-body-md text-right font-medium">Week 4</td>
</tr>
<tr className="hover:bg-surface-container-low cursor-pointer transition-colors">
<td className="px-density-table-px py-3 font-title-sm text-primary">Senior Fleet Executive</td>
<td className="px-density-table-px py-3 text-body-sm">Operational High-Volume</td>
<td className="px-density-table-px py-3">
<span className="bg-secondary-container text-on-secondary-container text-[10px] font-black px-2 py-0.5 rounded">HIGH</span>
</td>
<td className="px-density-table-px py-3 text-body-md">4 Days</td>
<td className="px-density-table-px py-3 text-body-md">112 Candidates</td>
<td className="px-density-table-px py-3">
<div className="flex gap-1">
<div className="w-3 h-1 bg-primary rounded-full"></div>
<div className="w-3 h-1 bg-outline-variant rounded-full"></div>
<div className="w-3 h-1 bg-outline-variant rounded-full"></div>
<div className="w-3 h-1 bg-outline-variant rounded-full"></div>
</div>
</td>
<td className="px-density-table-px py-3 text-body-md text-right font-medium">Week 3</td>
</tr>
<tr className="hover:bg-surface-container-low cursor-pointer transition-colors bg-surface-container-low border-l-4 border-primary">
<td className="px-density-table-px py-3 font-title-sm text-primary">Compliance &amp; Audit Lead</td>
<td className="px-density-table-px py-3 text-body-sm">Standard Corporate</td>
<td className="px-density-table-px py-3">
<span className="bg-surface-container-highest text-on-surface-variant text-[10px] font-black px-2 py-0.5 rounded">MEDIUM</span>
</td>
<td className="px-density-table-px py-3 text-body-md">22 Days</td>
<td className="px-density-table-px py-3 text-body-md">8 Candidates</td>
<td className="px-density-table-px py-3">
<div className="flex gap-1">
<div className="w-3 h-1 bg-primary rounded-full"></div>
<div className="w-3 h-1 bg-primary rounded-full"></div>
<div className="w-3 h-1 bg-primary rounded-full"></div>
<div className="w-3 h-1 bg-outline-variant rounded-full"></div>
</div>
</td>
<td className="px-density-table-px py-3 text-body-md text-right font-medium">Week 2</td>
</tr>
<tr className="hover:bg-surface-container-low cursor-pointer transition-colors">
<td className="px-density-table-px py-3 font-title-sm text-primary">Backend Developer (Node.js)</td>
<td className="px-density-table-px py-3 text-body-sm">Technical Assessment</td>
<td className="px-density-table-px py-3">
<span className="bg-secondary-container text-on-secondary-container text-[10px] font-black px-2 py-0.5 rounded">HIGH</span>
</td>
<td className="px-density-table-px py-3 text-body-md">9 Days</td>
<td className="px-density-table-px py-3 text-body-md">45 Candidates</td>
<td className="px-density-table-px py-3">
<div className="flex gap-1">
<div className="w-3 h-1 bg-primary rounded-full"></div>
<div className="w-3 h-1 bg-outline-variant rounded-full"></div>
<div className="w-3 h-1 bg-outline-variant rounded-full"></div>
<div className="w-3 h-1 bg-outline-variant rounded-full"></div>
</div>
</td>
<td className="px-density-table-px py-3 text-body-md text-right font-medium">Week 5</td>
</tr>
</tbody>
</table>
</div>

<div className="bg-white border border-outline-variant rounded-lg p-margin-page shadow-sm">
<div className="flex justify-between items-center mb-6">
<h3 className="font-title-sm text-primary">5-Week Hiring Trajectory</h3>
<div className="flex items-center gap-4 text-label-md text-on-surface-variant">
<div className="flex items-center gap-1"><span className="w-3 h-3 bg-primary rounded"></span> Target</div>
<div className="flex items-center gap-1"><span className="w-3 h-3 bg-secondary-container rounded"></span> Delayed</div>
</div>
</div>
<div className="gantt-grid border-b border-outline-variant pb-2 mb-2 text-label-md font-bold text-on-surface-variant uppercase">
<div>Role</div>
<div className="text-center">Week 1</div>
<div className="text-center">Week 2</div>
<div className="text-center">Week 3</div>
<div className="text-center">Week 4</div>
<div className="text-center">Week 5</div>
</div>
<div className="space-y-4">
<div className="gantt-grid items-center">
<div className="text-body-sm font-medium text-primary">Reg. Ops Manager</div>
<div className="col-span-5 flex items-center relative h-6">
<div className="absolute left-[60%] w-[20%] h-4 bg-primary rounded-sm shadow-inner" title="Target: Week 4"></div>
<div className="w-full h-[1px] bg-outline-variant"></div>
</div>
</div>
<div className="gantt-grid items-center">
<div className="text-body-sm font-medium text-primary">Fleet Executive</div>
<div className="col-span-5 flex items-center relative h-6">
<div className="absolute left-[40%] w-[20%] h-4 bg-primary rounded-sm shadow-inner" title="Target: Week 3"></div>
<div className="w-full h-[1px] bg-outline-variant"></div>
</div>
</div>
<div className="gantt-grid items-center">
<div className="text-body-sm font-medium text-primary">Compliance Lead</div>
<div className="col-span-5 flex items-center relative h-6">
<div className="absolute left-[20%] w-[20%] h-4 bg-secondary-container rounded-sm shadow-inner" title="Delayed to Week 2"></div>
<div className="w-full h-[1px] bg-outline-variant"></div>
</div>
</div>
<div className="gantt-grid items-center">
<div className="text-body-sm font-medium text-primary">Backend Dev</div>
<div className="col-span-5 flex items-center relative h-6">
<div className="absolute left-[80%] w-[20%] h-4 bg-primary rounded-sm shadow-inner" title="Target: Week 5"></div>
<div className="w-full h-[1px] bg-outline-variant"></div>
</div>
</div>
</div>
</div>
</main>
  );
};

export default HiringPipeline;
