import React from 'react';

export const UserManagementConsole: React.FC = () => {
  return (
    <main className=" flex flex-col ">



<div className="flex-1 overflow-auto p-lg bg-surface">
<div className="bg-white border border-outline-variant rounded-lg shadow-sm overflow-hidden flex flex-col">

<div className="p-4 border-b border-outline-variant flex justify-between items-center bg-surface-container-low/30">
<div className="flex gap-4">
<div className="flex items-center gap-2 bg-white border border-outline-variant px-3 py-1.5 rounded focus-within:border-primary transition-all">
<span className="material-symbols-outlined text-sm opacity-50">search</span>
<input className="border-none focus:ring-0 p-0 text-body-sm w-64 bg-transparent" placeholder="Search by name, role or ID..." type="text"/>
</div>
<select className="bg-white border border-outline-variant px-3 py-1.5 rounded text-body-sm focus:ring-1 focus:ring-primary">
<option>All Processes</option>
<option>Inbound Logistics</option>
<option>Fleet Management</option>
<option>Audit Quality</option>
</select>
</div>
<div className="text-body-sm text-on-surface-variant">
                            Showing <span className="font-bold">124</span> users
                        </div>
</div>

<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low/50 sticky top-0 z-10">
<th className="px-lg py-3 border-b border-outline-variant text-body-sm font-bold text-on-surface uppercase tracking-tight w-12">
<input className="rounded-sm border-outline border-2 text-primary focus:ring-primary" type="checkbox"/>
</th>
<th className="px-lg py-3 border-b border-outline-variant text-body-sm font-bold text-on-surface uppercase tracking-tight">User Details</th>
<th className="px-lg py-3 border-b border-outline-variant text-body-sm font-bold text-on-surface uppercase tracking-tight">Role</th>
<th className="px-lg py-3 border-b border-outline-variant text-body-sm font-bold text-on-surface uppercase tracking-tight">Process</th>
<th className="px-lg py-3 border-b border-outline-variant text-body-sm font-bold text-on-surface uppercase tracking-tight">Mobile</th>
<th className="px-lg py-3 border-b border-outline-variant text-body-sm font-bold text-on-surface uppercase tracking-tight">Last Login</th>
<th className="px-lg py-3 border-b border-outline-variant text-body-sm font-bold text-on-surface uppercase tracking-tight text-center">Status</th>
<th className="px-lg py-3 border-b border-outline-variant text-body-sm font-bold text-on-surface uppercase tracking-tight">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-surface-container-low/20 transition-colors group">
<td className="px-lg py-4"><input className="rounded-sm border-outline border-2 text-primary focus:ring-primary" type="checkbox"/></td>
<td className="px-lg py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-primary-fixed flex items-center justify-center text-primary font-bold text-[10px]">ED</div>
<div>
<div className="text-body-md font-semibold text-on-surface">Elias Thorne</div>
<div className="font-code-sm text-code-sm text-on-surface-variant opacity-70">UID-992-3310</div>
</div>
</div>
</td>
<td className="px-lg py-4">
<span className="inline-flex items-center px-2 py-0.5 rounded bg-secondary-container text-on-secondary-fixed-variant text-[10px] font-bold uppercase">System Admin</span>
</td>
<td className="px-lg py-4 text-body-sm text-on-surface">Core Infrastructure</td>
<td className="px-lg py-4 font-code-sm text-code-sm text-on-surface tracking-tighter">+1 555-010-9923</td>
<td className="px-lg py-4 text-body-sm text-on-surface">2023-11-24 <span className="opacity-50">14:22</span></td>
<td className="px-lg py-4">
<div className="flex justify-center">
<button aria-checked className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-green-500"  role="switch">
<span aria-hidden className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-4"></span>
</button>
</div>
</td>
<td className="px-lg py-4">
<div className="flex gap-2">
<button className="p-1 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
<button className="p-1 text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/20 transition-colors group">
<td className="px-lg py-4"><input className="rounded-sm border-outline border-2 text-primary focus:ring-primary" type="checkbox"/></td>
<td className="px-lg py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-tertiary-fixed flex items-center justify-center text-tertiary font-bold text-[10px]">SM</div>
<div>
<div className="text-body-md font-semibold text-on-surface">Sarah Miller</div>
<div className="font-code-sm text-code-sm text-on-surface-variant opacity-70">UID-441-2093</div>
</div>
</div>
</td>
<td className="px-lg py-4">
<span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[10px] font-bold uppercase">Dispatcher</span>
</td>
<td className="px-lg py-4 text-body-sm text-on-surface">Inbound Logistics</td>
<td className="px-lg py-4 font-code-sm text-code-sm text-on-surface tracking-tighter">+1 555-012-4091</td>
<td className="px-lg py-4 text-body-sm text-on-surface">2023-11-23 <span className="opacity-50">09:15</span></td>
<td className="px-lg py-4">
<div className="flex justify-center">
<button aria-checked className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-green-500"  role="switch">
<span aria-hidden className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-4"></span>
</button>
</div>
</td>
<td className="px-lg py-4">
<div className="flex gap-2">
<button className="p-1 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
<button className="p-1 text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
</div>
</td>
</tr>

<tr className="hover:bg-surface-container-low/20 transition-colors group bg-error-container/5">
<td className="px-lg py-4"><input className="rounded-sm border-outline border-2 text-primary focus:ring-primary" type="checkbox"/></td>
<td className="px-lg py-4">
<div className="flex items-center gap-3">
<div className="w-8 h-8 rounded bg-outline-variant flex items-center justify-center text-on-surface-variant font-bold text-[10px]">JK</div>
<div>
<div className="text-body-md font-semibold text-on-surface">James Kowalski</div>
<div className="font-code-sm text-code-sm text-on-surface-variant opacity-70">UID-112-9980</div>
</div>
</div>
</td>
<td className="px-lg py-4">
<span className="inline-flex items-center px-2 py-0.5 rounded bg-surface-container-highest text-on-surface-variant text-[10px] font-bold uppercase">Fleet Auditor</span>
</td>
<td className="px-lg py-4 text-body-sm text-on-surface">Quality Audit</td>
<td className="px-lg py-4 font-code-sm text-code-sm text-on-surface tracking-tighter">+1 555-015-8821</td>
<td className="px-lg py-4 text-body-sm text-on-surface">2023-11-10 <span className="opacity-50">18:45</span></td>
<td className="px-lg py-4">
<div className="flex justify-center">
<button aria-checked className="relative inline-flex h-5 w-9 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none bg-outline-variant"  role="switch">
<span aria-hidden className="pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out translate-x-0"></span>
</button>
</div>
</td>
<td className="px-lg py-4">
<div className="flex gap-2">
<button className="p-1 text-on-surface-variant hover:text-primary transition-colors"><span className="material-symbols-outlined text-lg">edit</span></button>
<button className="p-1 text-on-surface-variant hover:text-error transition-colors"><span className="material-symbols-outlined text-lg">delete</span></button>
</div>
</td>
</tr>
</tbody>
</table>
</div>

<div className="p-4 border-t border-outline-variant flex items-center justify-between bg-surface-container-low/30">
<div className="text-body-sm text-on-surface-variant">
                            Showing <span className="font-semibold">1-25</span> of <span className="font-semibold">124</span> users
                        </div>
<div className="flex gap-1">
<button className="p-1.5 rounded hover:bg-surface-container-high transition-all text-on-surface-variant"><span className="material-symbols-outlined">first_page</span></button>
<button className="p-1.5 rounded hover:bg-surface-container-high transition-all text-on-surface-variant"><span className="material-symbols-outlined">chevron_left</span></button>
<button className="px-3 py-1 bg-primary text-white text-body-sm font-bold rounded">1</button>
<button className="px-3 py-1 hover:bg-surface-container-high text-on-surface text-body-sm font-semibold rounded">2</button>
<button className="px-3 py-1 hover:bg-surface-container-high text-on-surface text-body-sm font-semibold rounded">3</button>
<button className="p-1.5 rounded hover:bg-surface-container-high transition-all text-on-surface-variant"><span className="material-symbols-outlined">chevron_right</span></button>
<button className="p-1.5 rounded hover:bg-surface-container-high transition-all text-on-surface-variant"><span className="material-symbols-outlined">last_page</span></button>
</div>
</div>
</div>
</div>
</main>
  );
};

export default UserManagementConsole;
