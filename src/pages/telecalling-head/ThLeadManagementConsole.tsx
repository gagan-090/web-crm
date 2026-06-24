import React, { useState } from 'react';
import { useGetThLeadsQuery } from '../../services/api/teleheadApi';

export const ThLeadManagementConsole: React.FC = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { data: leadsData, isLoading } = useGetThLeadsQuery({ page: currentPage, per_page: 50 });
  const leads = leadsData?.data || [];
  const pagination = leadsData?.pagination || { total: 0, current_page: 1, last_page: 1, per_page: 50 };

  return (
    <main className=" flex flex-col ">



<section className="px-md py-sm bg-surface-container-lowest border-b border-outline-variant flex items-center justify-between">
<div className="flex items-center gap-sm overflow-x-auto no-scrollbar">
<span className="text-label-caps font-bold text-on-surface-variant mr-2">FILTERS:</span>
<div className="flex items-center bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant gap-2 cursor-pointer hover:border-primary transition-all">
<span className="text-label-caps">Process</span>
<span className="material-symbols-outlined text-[16px]" data-icon="keyboard_arrow_down">keyboard_arrow_down</span>
</div>
<div className="flex items-center bg-primary/10 px-3 py-1 rounded-full border border-primary/30 gap-2 cursor-pointer transition-all">
<span className="text-label-caps text-primary font-bold">Status: All Hot</span>
<span className="material-symbols-outlined text-[16px] text-primary" data-icon="close">close</span>
</div>
<div className="flex items-center bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant gap-2 cursor-pointer hover:border-primary transition-all">
<span className="material-symbols-outlined text-[16px]" data-icon="calendar_month">calendar_month</span>
<span className="text-label-caps">Last 7 Days</span>
</div>
<div className="flex items-center bg-surface-container-high px-3 py-1 rounded-full border border-outline-variant gap-2 cursor-pointer hover:border-primary transition-all">
<span className="text-label-caps">Assigned Caller</span>
<span className="material-symbols-outlined text-[16px]" data-icon="keyboard_arrow_down">keyboard_arrow_down</span>
</div>
</div>
<div className="flex items-center gap-sm">
<button className="bg-surface border border-outline-variant px-3 py-1.5 rounded flex items-center gap-2 hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined" data-icon="refresh">refresh</span>
<span className="text-label-caps uppercase">Refresh</span>
</button>
<button className="bg-primary text-on-primary px-4 py-1.5 rounded shadow-sm flex items-center gap-2 hover:bg-primary-container transition-colors font-bold">
<span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
<span className="text-label-caps uppercase">Create New Lead</span>
</button>
</div>
</section>

<section className="flex-1 overflow-hidden relative flex flex-col p-md gap-md">

<div className="flex-1 bg-surface-container-lowest border border-outline-variant rounded shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden">
<div className="overflow-auto custom-scrollbar flex-1">
<table className="w-full text-left border-collapse min-w-[1200px]">
<thead className="sticky top-0 bg-[#F0F2F5] border-b border-outline-variant z-10">
<tr>
<th className="w-10 px-sm py-2"><input className="rounded border-outline text-primary focus:ring-primary w-4 h-4" id="master-select" type="checkbox"/></th>
<th className="px-sm py-2 text-label-caps text-[#666666] uppercase">TMID</th>
<th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Lead Name</th>
<th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Mobile</th>
<th className="px-sm py-2 text-label-caps text-[#666666] uppercase text-center">Type</th>
<th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Status</th>
<th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Assigned Caller</th>
<th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Process</th>
<th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Reg Date</th>
<th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Last Called</th>
<th className="w-10 px-sm py-2"></th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

{isLoading ? (
  <tr>
    <td colSpan={11} className="text-center py-8 font-bold text-outline">Loading Leads...</td>
  </tr>
) : leads.map((lead: any) => (
  <tr key={lead.id} className="lead-row hover:bg-surface-container-low transition-colors group cursor-pointer">
    <td className="px-sm py-2"><input className="lead-checkbox rounded border-outline text-primary focus:ring-primary w-4 h-4" type="checkbox"/></td>
    <td className="px-sm py-2 font-data-mono text-data-mono text-primary">{lead.unique_id}</td>
    <td className="px-sm py-2 font-body-sm font-semibold">{lead.name}</td>
    <td className="px-sm py-2 font-data-mono text-body-sm">{lead.mobile}</td>
    <td className="px-sm py-2 text-center">
      <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
        lead.role === 'driver' ? 'bg-secondary-fixed text-on-secondary-fixed' : 'bg-outline-variant text-on-surface-variant'
      }`}>
        {lead.role === 'driver' ? 'DR' : 'TR'}
      </span>
    </td>
    <td className="px-sm py-2">
      <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[11px] font-bold rounded flex items-center w-fit gap-1">
        <span className="w-1.5 h-1.5 bg-blue-600 rounded-full"></span> FRESH
      </span>
    </td>
    <td className="px-sm py-2 font-body-sm">{lead.assigned_admin?.name || 'Unassigned'}</td>
    <td className="px-sm py-2 font-body-sm text-on-surface-variant">{lead.assigned_admin?.tc_for || 'Welcome Call'}</td>
    <td className="px-sm py-2 font-body-sm text-on-surface-variant">{lead.created_at ? lead.created_at.split(' ')[0] : '—'}</td>
    <td className="px-sm py-2 font-body-sm text-on-surface-variant">{lead.updated_at ? lead.updated_at.split(' ')[0] : '—'}</td>
    <td className="px-sm py-2 text-right">
      <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
        <span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
      </button>
    </td>
  </tr>
))}

</tbody>
</table>
</div>

<div className="h-10 bg-[#F0F2F5] border-t border-outline-variant flex items-center justify-between px-md shrink-0">
<div className="text-label-caps text-on-surface-variant">
  Showing <span className="font-bold">{(pagination.current_page - 1) * pagination.per_page + 1}-{Math.min(pagination.total, pagination.current_page * pagination.per_page)}</span> of <span className="font-bold">{pagination.total.toLocaleString()}</span> Leads
</div>
<div className="flex items-center gap-4">
<div className="flex items-center gap-1">
<span className="text-label-caps text-on-surface-variant">Rows per page:</span>
<select className="bg-transparent text-label-caps font-bold border-none focus:ring-0 p-0 pr-6">
<option>50</option>
<option>100</option>
</select>
</div>
<div className="flex items-center gap-2">
<button 
  className="w-7 h-7 flex items-center justify-center rounded border border-outline-variant bg-surface hover:bg-surface-container-high disabled:opacity-50" 
  disabled={pagination.current_page <= 1}
  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
>
<span className="material-symbols-outlined text-[18px]" data-icon="chevron_left">chevron_left</span>
</button>
<button 
  className="w-7 h-7 flex items-center justify-center rounded border border-outline-variant bg-surface hover:bg-surface-container-high disabled:opacity-50"
  disabled={pagination.current_page >= pagination.last_page}
  onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
>
<span className="material-symbols-outlined text-[18px]" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</div>
</div>

<div className="bulk-bar-enter absolute bottom-6 left-1/2 -translate-x-1/2 bg-inverse-surface text-surface py-2.5 px-md rounded-full shadow-xl flex items-center gap-xl border border-outline/50 z-40 hidden" id="bulk-toolbar">
<div className="flex items-center gap-2 pr-md border-r border-outline-variant/30">
<span className="bg-primary px-2 py-0.5 rounded-full text-[10px] font-bold" id="selected-count">3</span>
<span className="text-label-caps font-bold">Leads Selected</span>
</div>
<div className="flex items-center gap-md">
<button className="flex items-center gap-2 hover:text-primary-fixed-dim transition-colors">
<span className="material-symbols-outlined" data-icon="move_up">move_up</span>
<span className="text-label-caps">REASSIGN</span>
</button>
<button className="flex items-center gap-2 hover:text-primary-fixed-dim transition-colors">
<span className="material-symbols-outlined" data-icon="filter_list">filter_list</span>
<span className="text-label-caps">MOVE TO FUNNEL</span>
</button>
<button className="flex items-center gap-2 hover:text-error transition-colors">
<span className="material-symbols-outlined" data-icon="ac_unit">ac_unit</span>
<span className="text-label-caps">MARK COLD</span>
</button>
<button className="flex items-center gap-2 hover:text-primary-fixed-dim transition-colors">
<span className="material-symbols-outlined" data-icon="download">download</span>
<span className="text-label-caps">EXPORT CSV</span>
</button>
</div>
<button className="ml-4 p-1 hover:bg-surface-variant/20 rounded-full transition-colors" id="close-bulk">
<span className="material-symbols-outlined" data-icon="close">close</span>
</button>
</div>
</section>

<div className="fixed bottom-0 left-[240px] right-0 bg-surface-container-high border-t border-outline shadow-[0_-4px_10px_rgba(0,0,0,0.05)] drawer-transition drawer-hidden z-20" id="cold-lead-drawer">

<div className="h-12 flex items-center justify-between px-md cursor-pointer hover:bg-surface-container-highest transition-colors" id="drawer-toggle">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-outline" data-icon="ac_unit">ac_unit</span>
<span className="text-label-caps font-bold">Cold Lead Reactivation Portal</span>
<span className="px-2 py-0.5 bg-outline text-surface text-[10px] font-bold rounded-full">412 Leads</span>
</div>
<div className="flex items-center gap-4">
<button className="bg-primary text-on-primary px-4 py-1 rounded text-label-caps font-bold uppercase hover:bg-primary-container transition-all">Add to Reactivation Campaign</button>
<span className="material-symbols-outlined transition-transform duration-300" data-icon="keyboard_arrow_up" id="drawer-icon">keyboard_arrow_up</span>
</div>
</div>

<div className="h-64 px-md py-sm overflow-auto custom-scrollbar bg-surface">
<div className="grid grid-cols-3 gap-md">

<div className="border border-outline-variant p-sm rounded bg-surface-container-lowest flex items-center justify-between hover:border-primary transition-all cursor-pointer">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center text-outline">
<span className="material-symbols-outlined text-[18px]" data-icon="person">person</span>
</div>
<div>
<p className="text-body-sm font-bold truncate w-32">Karan Sharma</p>
<p className="text-[10px] text-on-surface-variant font-data-mono">TM-11029 • TR</p>
</div>
</div>
<div className="text-right">
<p className="text-[10px] text-on-surface-variant">Last called 24d ago</p>
<input className="rounded border-outline text-primary w-4 h-4" type="checkbox"/>
</div>
</div>
<div className="border border-outline-variant p-sm rounded bg-surface-container-lowest flex items-center justify-between hover:border-primary transition-all cursor-pointer">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center text-outline">
<span className="material-symbols-outlined text-[18px]" data-icon="person">person</span>
</div>
<div>
<p className="text-body-sm font-bold truncate w-32">Meena Kumari Logistics</p>
<p className="text-[10px] text-on-surface-variant font-data-mono">TM-11204 • FM</p>
</div>
</div>
<div className="text-right">
<p className="text-[10px] text-on-surface-variant">Last called 41d ago</p>
<input className="rounded border-outline text-primary w-4 h-4" type="checkbox"/>
</div>
</div>
<div className="border border-outline-variant p-sm rounded bg-surface-container-lowest flex items-center justify-between hover:border-primary transition-all cursor-pointer">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center text-outline">
<span className="material-symbols-outlined text-[18px]" data-icon="person">person</span>
</div>
<div>
<p className="text-body-sm font-bold truncate w-32">Anand Heavy Haul</p>
<p className="text-[10px] text-on-surface-variant font-data-mono">TM-10992 • EC</p>
</div>
</div>
<div className="text-right">
<p className="text-[10px] text-on-surface-variant">Last called 18d ago</p>
<input className="rounded border-outline text-primary w-4 h-4" type="checkbox"/>
</div>
</div>

<div className="border border-outline-variant p-sm rounded bg-surface-container-lowest flex items-center justify-between hover:border-primary transition-all cursor-pointer">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded bg-surface-variant flex items-center justify-center text-outline">
<span className="material-symbols-outlined text-[18px]" data-icon="person">person</span>
</div>
<div>
<p className="text-body-sm font-bold truncate w-32">Blue Dart Vendor 4</p>
<p className="text-[10px] text-on-surface-variant font-data-mono">TM-11005 • TR</p>
</div>
</div>
<div className="text-right">
<p className="text-[10px] text-on-surface-variant">Last called 30d ago</p>
<input className="rounded border-outline text-primary w-4 h-4" type="checkbox"/>
</div>
</div>

<div className="border border-outline-variant p-sm rounded bg-surface-container-lowest/50 border-dashed flex items-center justify-center text-outline text-label-caps">
                        + Load more cold leads
                    </div>
</div>
</div>
</div>
</main>
  );
};

export default ThLeadManagementConsole;
