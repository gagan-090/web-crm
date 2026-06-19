import React from 'react';

export const ExitManagement: React.FC = () => {
  return (
    <main className=" min-h-screen p-margin-page pb-24">


<section className="bg-white border border-outline-variant rounded-lg overflow-hidden mb-12">
<div className="px-4 py-3 border-b border-outline-variant bg-surface-container-lowest flex justify-between items-center">
<h3 className="font-title-sm text-title-sm text-primary">Active Exits</h3>
<div className="flex gap-2">
<button className="px-3 py-1 border border-outline-variant rounded text-label-md hover:bg-surface-container-low transition-colors">Export CSV</button>
<button className="px-3 py-1 border border-outline-variant rounded text-label-md hover:bg-surface-container-low transition-colors">Filter</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low text-label-md text-on-surface-variant border-b border-outline-variant">
<th className="px-density-table-px py-density-table-py font-semibold">Employee Name</th>
<th className="px-density-table-px py-density-table-py font-semibold">Role</th>
<th className="px-density-table-px py-density-table-py font-semibold">Resignation Date</th>
<th className="px-density-table-px py-density-table-py font-semibold">LWD</th>
<th className="px-density-table-px py-density-table-py font-semibold">Interview Status</th>
<th className="px-density-table-px py-density-table-py font-semibold text-center">CRM Handover</th>
<th className="px-density-table-px py-density-table-py font-semibold text-center">Clearance</th>
<th className="px-density-table-px py-density-table-py font-semibold">Status</th>
<th className="px-density-table-px py-density-table-py font-semibold">Action</th>
</tr>
</thead>
<tbody className="text-body-sm">

<tr className="border-b border-outline-variant table-row-hover cursor-pointer" >
<td className="px-density-table-px py-density-table-py font-semibold text-primary">Arjun Mehta</td>
<td className="px-density-table-px py-density-table-py text-on-surface-variant">Sr. Logistics Coord.</td>
<td className="px-density-table-px py-density-table-py font-data-mono">12 Oct 2023</td>
<td className="px-density-table-px py-density-table-py font-data-mono text-error font-bold">12 Nov 2023</td>
<td className="px-density-table-px py-density-table-py">
<span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold">COMPLETED</span>
</td>
<td className="px-density-table-px py-density-table-py text-center">
<span className="material-symbols-outlined text-on-tertiary-container text-[20px]">check_circle</span>
</td>
<td className="px-density-table-px py-density-table-py text-center">
<span className="text-label-md text-on-surface-variant">3/5</span>
</td>
<td className="px-density-table-px py-density-table-py">
<span className="px-2 py-0.5 rounded-full bg-secondary-container text-on-secondary-container text-[10px] font-bold">IN CLEARANCE</span>
</td>
<td className="px-density-table-px py-density-table-py">
<button className="text-primary hover:underline font-bold">View</button>
</td>
</tr>

<tr className="border-b border-outline-variant table-row-hover cursor-pointer" >
<td className="px-density-table-px py-density-table-py font-semibold text-primary">Sanjana Rao</td>
<td className="px-density-table-px py-density-table-py text-on-surface-variant">Regional Fleet Mgr.</td>
<td className="px-density-table-px py-density-table-py font-data-mono">25 Oct 2023</td>
<td className="px-density-table-px py-density-table-py font-data-mono">25 Nov 2023</td>
<td className="px-density-table-px py-density-table-py">
<span className="px-2 py-0.5 rounded-full bg-surface-variant text-on-surface-variant text-[10px] font-bold">PENDING</span>
</td>
<td className="px-density-table-px py-density-table-py text-center">
<span className="material-symbols-outlined text-outline-variant text-[20px]">radio_button_unchecked</span>
</td>
<td className="px-density-table-px py-density-table-py text-center">
<span className="text-label-md text-on-surface-variant">1/5</span>
</td>
<td className="px-density-table-px py-density-table-py">
<span className="px-2 py-0.5 rounded-full bg-error-container text-on-error-container text-[10px] font-bold">CRITICAL</span>
</td>
<td className="px-density-table-px py-density-table-py">
<button className="text-primary hover:underline font-bold">View</button>
</td>
</tr>

<tr className="border-b border-outline-variant table-row-hover cursor-pointer" >
<td className="px-density-table-px py-density-table-py font-semibold text-primary">Vikram Singh</td>
<td className="px-density-table-px py-density-table-py text-on-surface-variant">Supply Chain Analyst</td>
<td className="px-density-table-px py-density-table-py font-data-mono">05 Nov 2023</td>
<td className="px-density-table-px py-density-table-py font-data-mono">05 Dec 2023</td>
<td className="px-density-table-px py-density-table-py">
<span className="px-2 py-0.5 rounded-full bg-tertiary-container text-on-tertiary-container text-[10px] font-bold">COMPLETED</span>
</td>
<td className="px-density-table-px py-density-table-py text-center">
<span className="material-symbols-outlined text-on-tertiary-container text-[20px]">check_circle</span>
</td>
<td className="px-density-table-px py-density-table-py text-center">
<span className="text-label-md text-on-surface-variant">5/5</span>
</td>
<td className="px-density-table-px py-density-table-py">
<span className="px-2 py-0.5 rounded-full bg-surface-container-highest text-on-surface-variant text-[10px] font-bold">FINAL SETTLEMENT</span>
</td>
<td className="px-density-table-px py-density-table-py">
<button className="text-primary hover:underline font-bold">View</button>
</td>
</tr>
</tbody>
</table>
</div>
</section>

<section>
<div className="mb-4">
<h3 className="font-title-sm text-title-sm text-primary">Recent Exits Log (Read-only)</h3>
<p className="text-label-md text-on-surface-variant">Historical data of past 6 exit cycles.</p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
<div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-outline-variant flex items-center justify-center text-white">RM</div>
<div>
<p className="text-body-sm font-bold text-primary">Rahul Mishra</p>
<p className="text-label-md text-on-surface-variant">LWD: 30 Sep 2023 • Full &amp; Final Paid</p>
</div>
</div>
<div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-outline-variant flex items-center justify-center text-white">AK</div>
<div>
<p className="text-body-sm font-bold text-primary">Ananya Kapoor</p>
<p className="text-label-md text-on-surface-variant">LWD: 15 Sep 2023 • Full &amp; Final Paid</p>
</div>
</div>
<div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-outline-variant flex items-center justify-center text-white">TD</div>
<div>
<p className="text-body-sm font-bold text-primary">Tanmay Deshpande</p>
<p className="text-label-md text-on-surface-variant">LWD: 28 Aug 2023 • Full &amp; Final Paid</p>
</div>
</div>
<div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-outline-variant flex items-center justify-center text-white">PS</div>
<div>
<p className="text-body-sm font-bold text-primary">Priya Sharma</p>
<p className="text-label-md text-on-surface-variant">LWD: 10 Aug 2023 • Resigned (Medical)</p>
</div>
</div>
<div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-outline-variant flex items-center justify-center text-white">KJ</div>
<div>
<p className="text-body-sm font-bold text-primary">Karan Johar</p>
<p className="text-label-md text-on-surface-variant">LWD: 02 Aug 2023 • Terminated</p>
</div>
</div>
<div className="bg-surface-container-low border border-outline-variant p-4 rounded-lg flex items-center gap-4">
<div className="w-10 h-10 rounded-full bg-outline-variant flex items-center justify-center text-white">SB</div>
<div>
<p className="text-body-sm font-bold text-primary">Sneha Bansal</p>
<p className="text-label-md text-on-surface-variant">LWD: 15 Jul 2023 • Full &amp; Final Paid</p>
</div>
</div>
</div>
</section>
</main>
  );
};

export default ExitManagement;
