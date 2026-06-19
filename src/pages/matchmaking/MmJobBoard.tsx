import React from 'react';

export const MmJobBoard: React.FC = () => {
  return (
    <main className=" mt-16 p-lg bg-background min-h-screen">
<div className="flex items-end justify-between mb-lg">
<div>
<h2 className="font-display-lg text-display-lg text-on-surface">Job Board</h2>
<p className="text-on-surface-variant font-body-md">Real-time matchmaking queue for fleet allocation.</p>
</div>
<div className="flex gap-sm">
<button className="px-md py-xs bg-surface-container-high border border-outline-variant rounded flex items-center gap-xs font-label-md">
<span className="material-symbols-outlined text-[16px]" data-icon="filter_list">filter_list</span> Filter
                </button>
<button className="px-md py-xs bg-surface-container-high border border-outline-variant rounded flex items-center gap-xs font-label-md">
<span className="material-symbols-outlined text-[16px]" data-icon="sort">sort</span> Sort
                </button>
</div>
</div>

<div className="flex gap-md overflow-x-auto pb-lg min-h-[calc(100vh-180px)]">

<div className="kanban-col flex flex-col gap-md">
<div className="flex items-center justify-between px-xs border-b border-outline-variant pb-sm">
<div className="flex items-center gap-sm">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<h3 className="font-label-md text-on-surface uppercase tracking-wider">Open</h3>
<span className="text-body-sm text-on-surface-variant bg-surface-variant px-sm rounded-full">12</span>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-md flex flex-col gap-sm hover:border-outline transition-all cursor-pointer group">
<div className="flex justify-between items-start">
<span className="font-mono-data text-body-sm text-outline">#JB-99231</span>
<span className="bg-primary-container/10 text-primary-container font-label-md px-sm py-[2px] rounded text-[10px] uppercase">Premium</span>
</div>
<div className="mt-xs">
<h4 className="font-headline-sm text-on-surface leading-tight">Shree Logistics</h4>
<div className="flex items-center gap-xs text-on-surface-variant mt-xs">
<span className="material-symbols-outlined text-[16px]" data-icon="route">route</span>
<span className="font-body-sm">Delhi → Mumbai</span>
</div>
</div>
<div className="flex flex-wrap gap-xs mt-sm">
<span className="bg-surface-variant text-on-surface-variant text-[10px] px-sm py-[2px] rounded">32ft MXL</span>
<span className="bg-surface-variant text-on-surface-variant text-[10px] px-sm py-[2px] rounded">Class H-CV</span>
</div>
<div className="flex justify-between items-center mt-md pt-sm border-t border-outline-variant/30">
<div className="flex -space-x-2">
<div className="w-6 h-6 rounded-full border border-white bg-secondary-fixed"></div>
<div className="w-6 h-6 rounded-full border border-white bg-tertiary-fixed"></div>
<div className="w-6 h-6 rounded-full border border-white flex items-center justify-center bg-surface-variant text-[10px] font-bold">+5</div>
</div>
<span className="text-[10px] text-on-surface-variant font-label-md">Posted 2h ago</span>
</div>
<div className="flex gap-xs mt-sm">
<button className="flex-1 bg-primary text-white py-xs text-xs font-bold rounded">Take Job</button>
<button className="px-sm py-xs border border-outline-variant rounded hover:bg-surface-variant transition-colors"><span className="material-symbols-outlined text-[16px] block" data-icon="more_horiz">more_horiz</span></button>
</div>
</div>
</div>

<div className="kanban-col flex flex-col gap-md">
<div className="flex items-center justify-between px-xs border-b border-outline-variant pb-sm">
<div className="flex items-center gap-sm">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<h3 className="font-label-md text-on-surface uppercase tracking-wider">In Progress</h3>
<span className="text-body-sm text-on-surface-variant bg-surface-variant px-sm rounded-full">24</span>
</div>
</div>

<div className="job-card-active bg-surface-container-lowest border border-accent-purple p-md flex flex-col gap-sm cursor-pointer relative">
<div className="absolute -right-1 -top-1">
<span className="bg-accent-purple text-white text-[8px] font-bold px-sm py-[2px] rounded-bl shadow-sm">ACTIVE VIEW</span>
</div>
<div className="flex justify-between items-start">
<span className="font-mono-data text-body-sm text-outline">#JB-99205</span>
<span className="bg-accent-purple/10 text-accent-purple font-label-md px-sm py-[2px] rounded text-[10px] uppercase">Super Premium</span>
</div>
<div className="mt-xs">
<h4 className="font-headline-sm text-on-surface leading-tight">VRL Express</h4>
<div className="flex items-center gap-xs text-on-surface-variant mt-xs">
<span className="material-symbols-outlined text-[16px]" data-icon="route">route</span>
<span className="font-body-sm">Ahmedabad → Chennai</span>
</div>
</div>
<div className="flex flex-wrap gap-xs mt-sm">
<span className="bg-surface-variant text-on-surface-variant text-[10px] px-sm py-[2px] rounded">24ft SXL</span>
<span className="bg-surface-variant text-on-surface-variant text-[10px] px-sm py-[2px] rounded">Class MCV</span>
</div>
<div className="mt-md pt-sm border-t border-outline-variant/30 flex justify-between items-end">
<div>
<p className="text-[10px] text-on-surface-variant font-label-md uppercase">Assigned Caller</p>
<p className="font-body-sm font-bold text-on-surface">Rajesh Kumar</p>
</div>
<div className="text-right">
<p className="text-[10px] text-on-surface-variant font-label-md uppercase">SLA Clock</p>
<p className="font-mono-data text-body-sm font-bold text-on-surface">02:14:45</p>
</div>
</div>
<button className="w-full mt-sm border border-outline-variant py-xs text-xs font-bold rounded bg-surface-container-low">View Details</button>
</div>
</div>

<div className="kanban-col flex flex-col gap-md">
<div className="flex items-center justify-between px-xs border-b border-outline-variant pb-sm">
<div className="flex items-center gap-sm">
<span className="w-2 h-2 rounded-full bg-error"></span>
<h3 className="font-label-md text-on-surface uppercase tracking-wider">SLA Risk</h3>
<span className="text-body-sm text-on-surface-variant bg-surface-variant px-sm rounded-full">8</span>
</div>
</div>

<div className="bg-surface-container-lowest border border-error/30 p-md flex flex-col gap-sm hover:shadow-lg transition-all cursor-pointer">
<div className="flex justify-between items-start">
<span className="font-mono-data text-body-sm text-outline">#JB-99184</span>
<span className="bg-primary-container/10 text-primary-container font-label-md px-sm py-[2px] rounded text-[10px] uppercase">Premium</span>
</div>
<div className="mt-xs">
<h4 className="font-headline-sm text-on-surface leading-tight">BlueDart Surface</h4>
<div className="flex items-center gap-xs text-on-surface-variant mt-xs">
<span className="material-symbols-outlined text-[16px]" data-icon="route">route</span>
<span className="font-body-sm">Kolkata → Guwahati</span>
</div>
</div>
<div className="bg-error-container text-on-error-container p-sm rounded mt-sm flex items-center justify-between">
<div className="flex items-center gap-xs">
<span className="material-symbols-outlined text-[18px]" data-icon="alarm">alarm</span>
<span className="font-mono-data text-xs font-bold">00:14:22</span>
</div>
<span className="text-[10px] font-bold uppercase">Critical</span>
</div>
<div className="flex justify-between items-center mt-md">
<span className="text-[11px] text-on-surface-variant">Drivers Contacted: <b className="text-on-surface">18</b></span>
<button className="bg-error text-white px-md py-[4px] rounded text-[11px] font-bold">Escalate</button>
</div>
</div>
</div>

<div className="kanban-col flex flex-col gap-md opacity-60">
<div className="flex items-center justify-between px-xs border-b border-outline-variant pb-sm">
<div className="flex items-center gap-sm">
<span className="w-2 h-2 rounded-full bg-tertiary-container"></span>
<h3 className="font-label-md text-on-surface uppercase tracking-wider">Filled</h3>
<span className="text-body-sm text-on-surface-variant bg-surface-variant px-sm rounded-full">142</span>
</div>
</div>
</div>

<div className="kanban-col flex flex-col gap-md opacity-40">
<div className="flex items-center justify-between px-xs border-b border-outline-variant pb-sm">
<div className="flex items-center gap-sm">
<span className="w-2 h-2 rounded-full bg-outline"></span>
<h3 className="font-label-md text-on-surface uppercase tracking-wider">Expired</h3>
<span className="text-body-sm text-on-surface-variant bg-surface-variant px-sm rounded-full">0</span>
</div>
</div>
</div>
</div>
</main>
  );
};

export default MmJobBoard;
