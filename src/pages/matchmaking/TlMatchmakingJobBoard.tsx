import React from 'react';

export const TlMatchmakingJobBoard: React.FC = () => {
  return (
    <main className=" flex flex-col ">



<div className="bg-error text-on-error px-margin-desktop py-sm flex justify-between items-center shrink-0">
<div className="flex items-center gap-sm">
<span className="material-symbols-outlined">warning</span>
<span className="font-label-md">CRITICAL: 8 Shipments at SLA Risk (&lt; 20% remaining time). Immediate assignment required.</span>
</div>
<button className="font-label-md underline">View All Risks</button>
</div>

<div className="flex-1 overflow-x-auto overflow-y-hidden flex p-md gap-md custom-scrollbar bg-surface-container-lowest">

<div className="kanban-column flex flex-col h-full rounded border border-outline-variant bg-surface-container-lowest">
<div className="p-sm flex justify-between items-center border-b border-outline-variant">
<h2 className="font-headline-sm text-label-md text-on-surface uppercase tracking-wider">Open</h2>
<span className="bg-surface-container-highest px-sm py-xs rounded text-label-md">12</span>
</div>
<div className="flex-1 overflow-y-auto p-sm space-y-sm custom-scrollbar">

<div className="bg-surface-container-lowest border border-outline-variant rounded p-sm shadow-sm hover:shadow-md transition-shadow">
<div className="flex justify-between items-start mb-xs">
<span className="font-mono-data text-on-surface-variant">#ID-98231</span>
<span className="bg-primary-container text-on-primary-container px-xs py-[2px] rounded text-[10px] font-bold">SUPER PREMIUM</span>
</div>
<p className="font-body-md font-bold mb-xs">Mumbai Central ➔ Bangalore ICD</p>
<div className="flex items-center gap-xs text-on-surface-variant font-label-md mb-sm">
<span className="material-symbols-outlined text-[14px]">timer</span>
<span className="">SLA: 04h 12m</span>
</div>
<button className="w-full py-xs border border-primary text-primary hover:bg-primary-fixed-dim rounded font-label-md transition-colors">Assign Caller</button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded p-sm shadow-sm">
<div className="flex justify-between items-start mb-xs">
<span className="font-mono-data text-on-surface-variant">#ID-98232</span>
<span className="bg-tertiary-container text-on-tertiary-container px-xs py-[2px] rounded text-[10px] font-bold">PREMIUM</span>
</div>
<p className="font-body-md font-bold mb-xs">Delhi NRT ➔ Ahmedabad</p>
<div className="flex items-center gap-xs text-on-surface-variant font-label-md mb-sm">
<span className="material-symbols-outlined text-[14px]">timer</span>
<span className="">SLA: 02h 45m</span>
</div>
<button className="w-full py-xs border border-primary text-primary hover:bg-primary-fixed-dim rounded font-label-md transition-colors">Assign Caller</button>
</div>
</div>
</div>

<div className="kanban-column flex flex-col h-full bg-error-container rounded border-2 border-error bg-surface-container-lowest">
<div className="p-sm flex justify-between items-center border-b border-error">
<h2 className="font-headline-sm text-label-md text-on-error-container uppercase tracking-wider">SLA Risk</h2>
<span className="bg-error text-on-error px-sm py-xs rounded text-label-md animate-pulse">8</span>
</div>
<div className="flex-1 overflow-y-auto p-sm space-y-sm custom-scrollbar">

<div className="bg-surface-container-lowest border border-error rounded p-sm shadow-sm ring-2 ring-error/10">
<div className="flex justify-between items-start mb-xs">
<span className="font-mono-data text-error font-bold">#ID-77210</span>
<span className="bg-primary-container text-on-primary-container px-xs py-[2px] rounded text-[10px] font-bold">SUPER PREMIUM</span>
</div>
<p className="font-body-md font-bold mb-xs">Pune Cluster ➔ Chennai Port</p>
<div className="flex items-center gap-xs text-error font-bold font-label-md mb-sm">
<span className="material-symbols-outlined text-[14px]">priority_high</span>
<span className="">CRITICAL: 18m Left</span>
</div>
<div className="w-full bg-surface-container-high h-1 rounded-full mb-sm overflow-hidden">
<div className="bg-error h-full" style={{"width": "88%"}}></div>
</div>
<button className="w-full py-xs bg-error text-on-error rounded font-label-md">ESCALATE NOW</button>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded p-sm shadow-sm">
<div className="flex justify-between items-start mb-xs">
<span className="font-mono-data text-on-surface-variant">#ID-77215</span>
<span className="bg-tertiary-container text-on-tertiary-container px-xs py-[2px] rounded text-[10px] font-bold">PREMIUM</span>
</div>
<p className="font-body-md font-bold mb-xs">Hyderabad ➔ Vizag Terminal</p>
<div className="flex items-center gap-xs text-error font-label-md mb-sm">
<span className="material-symbols-outlined text-[14px]">timer</span>
<span className="">SLA: 42m Left</span>
</div>
<button className="w-full py-xs border border-error text-error rounded font-label-md">Reassign Specialist</button>
</div>
</div>
</div>

<div className="kanban-column flex flex-col h-full rounded border border-outline-variant bg-surface-container-lowest">
<div className="p-sm flex justify-between items-center border-b border-outline-variant">
<h2 className="font-headline-sm text-label-md text-on-surface uppercase tracking-wider">In Progress</h2>
<span className="bg-surface-container-highest px-sm py-xs rounded text-label-md">24</span>
</div>
<div className="flex-1 overflow-y-auto p-sm space-y-sm custom-scrollbar">
<div className="bg-surface-container-lowest border border-outline-variant rounded p-sm shadow-sm">
<div className="flex justify-between items-start mb-xs">
<span className="font-mono-data text-on-surface-variant">#ID-99001</span>
<span className="bg-surface-container-high text-on-surface-variant px-xs py-[2px] rounded text-[10px] font-bold">STANDARD</span>
</div>
<p className="font-body-md font-bold mb-xs">Kolkata ➔ Guwahati Hub</p>
<div className="flex flex-col gap-xs mb-sm">
<div className="flex items-center gap-sm">
<div className="w-6 h-6 rounded-full bg-secondary-fixed flex items-center justify-center text-[10px] font-bold">RK</div>
<span className="text-label-md text-on-surface-variant">Rohan K. (Caller)</span>
</div>
<div className="flex items-center gap-xs text-primary font-label-md">
<span className="material-symbols-outlined text-[14px]">call_received</span>
<span className="">Negotiating (5m 12s)</span>
</div>
</div>
</div>
</div>
</div>

<div className="kanban-column flex flex-col h-full rounded border border-outline-variant bg-surface-container-lowest">
<div className="p-sm flex justify-between items-center border-b border-outline-variant">
<h2 className="font-headline-sm text-label-md text-on-surface uppercase tracking-wider">Filled</h2>
<span className="bg-surface-container-highest px-sm py-xs rounded text-label-md">115</span>
</div>
<div className="flex-1 overflow-y-auto p-sm space-y-sm custom-scrollbar opacity-75">
<div className="bg-surface-container-lowest border border-outline-variant rounded p-sm border-l-4 border-l-secondary">
<div className="flex justify-between items-start mb-xs">
<span className="font-mono-data text-on-surface-variant">#ID-97100</span>
<span className="material-symbols-outlined text-secondary text-sm">check_circle</span>
</div>
<p className="font-body-md font-bold">Surat ➔ Jaipur South</p>
<div className="text-label-md text-on-surface-variant mt-xs">Matched by: Team Alpha (Admin)</div>
</div>
</div>
</div>

<div className="kanban-column flex flex-col h-full rounded border border-outline-variant bg-surface-container-lowest">
<div className="p-sm flex justify-between items-center border-b border-outline-variant">
<h2 className="font-headline-sm text-label-md text-on-surface uppercase tracking-wider">Expired</h2>
<span className="bg-surface-container-highest px-sm py-xs rounded text-label-md">3</span>
</div>
<div className="flex-1 overflow-y-auto p-sm space-y-sm custom-scrollbar opacity-60">
<div className="bg-surface-container-lowest border border-outline-variant rounded p-sm grayscale">
<div className="flex justify-between items-start mb-xs">
<span className="font-mono-data">#ID-96001</span>
<span className="text-error text-[10px] font-bold">EXPIRED</span>
</div>
<p className="font-body-md font-bold">Lucknow ➔ Patna</p>
<div className="text-label-md text-on-surface-variant mt-xs">Failed Match • SLA Overrun</div>
</div>
</div>
</div>
</div>

<footer className="h-12 border-t border-outline-variant flex items-center px-margin-desktop justify-between shrink-0 bg-surface-container-lowest">
<div className="flex gap-lg">
<div className="flex items-center gap-sm">
<span className="w-2 h-2 rounded-full bg-primary-container"></span>
<span className="font-label-md">Pending: 12</span>
</div>
<div className="flex items-center gap-sm">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="font-label-md">Filled Today: 142</span>
</div>
<div className="flex items-center gap-sm">
<span className="w-2 h-2 rounded-full bg-error"></span>
<span className="font-label-md">Risk Index: High (12.4%)</span>
</div>
</div>
<div className="flex items-center gap-md">
<span className="font-label-md text-on-surface-variant italic">Last updated: 12:42:51</span>
<button className="bg-surface-container-highest px-sm py-xs rounded font-label-md flex items-center gap-xs">
<span className="material-symbols-outlined text-sm">refresh</span>
                    Force Sync
                </button>
</div>
</footer>
</main>
  );
};

export default TlMatchmakingJobBoard;
