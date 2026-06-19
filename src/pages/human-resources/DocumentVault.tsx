import React from 'react';

export const DocumentVault: React.FC = () => {
  return (
    <main className=" flex flex-col">
<div className="flex-1 overflow-hidden flex flex-col p-6 space-y-6">

<div className="flex justify-between items-end">
<div>
<h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Document Vault</h2>
<p className="text-body-md text-on-surface-variant">Centralized compliance repository for employee verification records.</p>
</div>
<div className="flex gap-3">
<div className="flex items-center bg-surface-container border border-outline-variant rounded-lg p-1">
<button className="px-3 py-1.5 text-label-md bg-white shadow-sm rounded-md font-bold text-primary">All Records</button>
<button className="px-3 py-1.5 text-label-md text-on-surface-variant hover:bg-surface-container-high rounded-md transition-all">Show only incomplete</button>
</div>
<button className="flex items-center gap-2 px-4 py-2 bg-primary text-on-primary rounded-lg font-bold text-label-md hover:bg-primary-container transition-all active:scale-95">
<span className="material-symbols-outlined text-[18px]" data-icon="cloud_upload">cloud_upload</span>
                        Bulk Upload
                    </button>
</div>
</div>

<div className="grid grid-cols-4 gap-4 shrink-0">
<div className="bg-white border border-outline-variant p-4 rounded-lg flex items-center justify-between">
<div>
<p className="text-label-md text-on-surface-variant">Compliance Rate</p>
<p className="text-headline-md font-bold text-primary">94.2%</p>
</div>
<div className="w-10 h-10 rounded-full bg-tertiary-container/10 flex items-center justify-center text-on-tertiary-container">
<span className="material-symbols-outlined" data-icon="verified_user">verified_user</span>
</div>
</div>
<div className="bg-white border border-outline-variant p-4 rounded-lg flex items-center justify-between">
<div>
<p className="text-label-md text-on-surface-variant">Missing Aadhaar</p>
<p className="text-headline-md font-bold text-error">12</p>
</div>
<div className="w-10 h-10 rounded-full bg-error-container/20 flex items-center justify-center text-on-error-container">
<span className="material-symbols-outlined" data-icon="id_card">id_card</span>
</div>
</div>
<div className="bg-white border border-outline-variant p-4 rounded-lg flex items-center justify-between">
<div>
<p className="text-label-md text-on-surface-variant">Pending Verification</p>
<p className="text-headline-md font-bold text-secondary">48</p>
</div>
<div className="w-10 h-10 rounded-full bg-secondary-container/10 flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined" data-icon="hourglass_empty">hourglass_empty</span>
</div>
</div>
<div className="bg-white border border-outline-variant p-4 rounded-lg flex items-center justify-between">
<div>
<p className="text-label-md text-on-surface-variant">Expires Soon</p>
<p className="text-headline-md font-bold text-primary">05</p>
</div>
<div className="w-10 h-10 rounded-full bg-primary-fixed-dim/30 flex items-center justify-center text-on-primary-fixed-variant">
<span className="material-symbols-outlined" data-icon="notification_important">notification_important</span>
</div>
</div>
</div>

<div className="flex-1 bg-white border border-outline-variant rounded-lg overflow-hidden flex flex-col">
<div className="overflow-x-auto custom-scrollbar flex-1 relative">
<table className="w-full text-left border-collapse min-w-[1200px]">
<thead className="sticky top-0 bg-surface-container-low z-20">
<tr className="border-b border-outline-variant">
<th className="table-fixed-column bg-surface-container-low px-density-table-px py-density-table-py text-label-md font-bold text-on-surface-variant uppercase border-r border-outline-variant w-64">Employee Name</th>
<th className="px-density-table-px py-density-table-py text-label-md font-bold text-on-surface-variant uppercase border-r border-outline-variant">Aadhaar</th>
<th className="px-density-table-px py-density-table-py text-label-md font-bold text-on-surface-variant uppercase border-r border-outline-variant">PAN</th>
<th className="px-density-table-px py-density-table-py text-label-md font-bold text-on-surface-variant uppercase border-r border-outline-variant">Photo</th>
<th className="px-density-table-px py-density-table-py text-label-md font-bold text-on-surface-variant uppercase border-r border-outline-variant">Bank Details</th>
<th className="px-density-table-px py-density-table-py text-label-md font-bold text-on-surface-variant uppercase border-r border-outline-variant">Experience Cert</th>
<th className="px-density-table-px py-density-table-py text-label-md font-bold text-on-surface-variant uppercase border-r border-outline-variant">Offer Letter</th>
<th className="px-density-table-px py-density-table-py text-label-md font-bold text-on-surface-variant uppercase text-center">Export</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-surface-container-lowest transition-colors group">
<td className="table-fixed-column bg-white group-hover:bg-surface-container-lowest px-density-table-px py-density-table-py border-r border-outline-variant">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-primary-container/10 flex items-center justify-center text-primary font-bold text-[10px]">AS</div>
<div>
<p className="text-body-md font-bold text-primary">Abhishek Sharma</p>
<p className="text-label-md text-on-surface-variant opacity-60">TM-4022 • Operations</p>
</div>
</div>
</td>
<td className="px-density-table-px py-density-table-py border-r border-outline-variant text-center">
<div className="flex justify-center"><span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span></div>
</td>
<td className="px-density-table-px py-density-table-py border-r border-outline-variant text-center">
<div className="flex justify-center"><span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span></div>
</td>
<td className="px-density-table-px py-density-table-py border-r border-outline-variant text-center">
<div className="flex justify-center"><span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span></div>
</td>
<td className="px-density-table-px py-density-table-py border-r border-outline-variant text-center">
<button className="w-6 h-6 border border-outline border-dashed rounded flex items-center justify-center hover:bg-primary-container/10 hover:border-primary transition-all group/up" >
<span className="material-symbols-outlined text-[16px] text-outline group-hover/up:text-primary" data-icon="add">add</span>
</button>
</td>
<td className="px-density-table-px py-density-table-py border-r border-outline-variant text-center">
<div className="flex justify-center"><span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span></div>
</td>
<td className="px-density-table-px py-density-table-py border-r border-outline-variant text-center">
<div className="flex justify-center"><span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span></div>
</td>
<td className="px-density-table-px py-density-table-py text-center">
<button className="text-primary hover:text-secondary-container transition-colors" title="Download ZIP">
<span className="material-symbols-outlined" data-icon="download_for_offline">download_for_offline</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-container-lowest transition-colors group">
<td className="table-fixed-column bg-white group-hover:bg-surface-container-lowest px-density-table-px py-density-table-py border-r border-outline-variant">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-primary-container/10 flex items-center justify-center text-primary font-bold text-[10px]">RP</div>
<div>
<p className="text-body-md font-bold text-primary">Rohan Prajapati</p>
<p className="text-label-md text-on-surface-variant opacity-60">TM-4105 • Logistics</p>
</div>
</div>
</td>
<td className="px-density-table-px py-density-table-py border-r border-outline-variant text-center">
<div className="flex justify-center"><span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span></div>
</td>
<td className="px-density-table-px py-density-table-py border-r border-outline-variant text-center">
<button className="w-6 h-6 border border-outline border-dashed rounded flex items-center justify-center hover:bg-primary-container/10 hover:border-primary transition-all group/up">
<span className="material-symbols-outlined text-[16px] text-outline group-hover/up:text-primary" data-icon="add">add</span>
</button>
</td>
<td className="px-density-table-px py-density-table-py border-r border-outline-variant text-center">
<div className="flex justify-center"><span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span></div>
</td>
<td className="px-density-table-px py-density-table-py border-r border-outline-variant text-center">
<div className="flex justify-center"><span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span></div>
</td>
<td className="px-density-table-px py-density-table-py border-r border-outline-variant text-center">
<span className="text-[10px] font-bold text-outline-variant uppercase">N/A</span>
</td>
<td className="px-density-table-px py-density-table-py border-r border-outline-variant text-center">
<div className="flex justify-center"><span className="material-symbols-outlined text-on-tertiary-container" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span></div>
</td>
<td className="px-density-table-px py-density-table-py text-center">
<button className="text-primary opacity-50 cursor-not-allowed">
<span className="material-symbols-outlined" data-icon="download_for_offline">download_for_offline</span>
</button>
</td>
</tr>


</tbody>
</table>
</div>

<div className="bg-surface-container-low px-4 py-2 flex justify-between items-center border-t border-outline-variant">
<p className="text-label-md text-on-surface-variant">Showing 10 of 1,248 employees</p>
<div className="flex gap-2">
<button className="p-1 border border-outline-variant rounded bg-white hover:bg-surface-container-high disabled:opacity-50" disabled>
<span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
</button>
<button className="px-2 py-1 border border-primary rounded bg-primary text-on-primary text-label-md">1</button>
<button className="px-2 py-1 border border-outline-variant rounded bg-white text-label-md hover:bg-surface-container-high">2</button>
<button className="px-2 py-1 border border-outline-variant rounded bg-white text-label-md hover:bg-surface-container-high">3</button>
<button className="p-1 border border-outline-variant rounded bg-white hover:bg-surface-container-high">
<span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</main>
  );
};

export default DocumentVault;
