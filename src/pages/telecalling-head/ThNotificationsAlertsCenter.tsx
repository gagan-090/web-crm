import React from 'react';

export const ThNotificationsAlertsCenter: React.FC = () => {
  return (
    <main className=" flex flex-col ">



<div className="flex-1 flex overflow-hidden">

<div className="w-1/2 border-r border-outline-variant flex flex-col bg-white">

<div className="px-md pt-md bg-surface-container-lowest">
<div className="flex items-center justify-between mb-md">
<h2 className="font-headline-md text-headline-md font-bold">Notifications</h2>
<div className="flex gap-xs">
<button className="px-3 py-1 bg-primary text-on-primary text-[11px] font-bold rounded-sm active:scale-95 transition-transform">Mark All as Read</button>
<button className="px-2 py-1 border border-outline-variant text-on-surface-variant text-[11px] font-bold rounded-sm hover:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[16px]" data-icon="filter_list">filter_list</span>
</button>
</div>
</div>
<div className="relative flex gap-gutter border-b border-outline-variant overflow-x-auto no-scrollbar">
<button className="pb-2 px-1 font-label-caps text-label-caps text-primary font-bold whitespace-nowrap relative">
                            All
                            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-primary"></div>
</button>
<button className="pb-2 px-1 font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface whitespace-nowrap">SLA Alerts</button>
<button className="pb-2 px-1 font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface whitespace-nowrap">Conversion</button>
<button className="pb-2 px-1 font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface whitespace-nowrap">QC Logs</button>
<button className="pb-2 px-1 font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface whitespace-nowrap">HR/Admin</button>
<button className="pb-2 px-1 font-label-caps text-label-caps text-on-surface-variant hover:text-on-surface whitespace-nowrap">System</button>
</div>
</div>

<div className="flex-1 overflow-y-auto custom-scrollbar">

<div className="group border-b border-outline-variant bg-surface-container-low/30 hover:bg-surface-container-low transition-all cursor-pointer p-md relative border-l-4 border-l-error">
<div className="flex justify-between items-start mb-1">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-error text-[20px]" data-icon="timer">timer</span>
<span className="font-bold text-[13px]">SLA Breach: Lead ID #4492</span>
</div>
<span className="text-[11px] text-on-surface-variant">2m ago</span>
</div>
<p className="text-on-surface-variant text-body-sm leading-tight line-clamp-2">High-priority lead assigned to Agent Rahul K. has exceeded the 15-minute first-call window. Immediate intervention required.</p>
<div className="mt-2 flex items-center gap-2">
<span className="px-2 py-px bg-error-container text-on-error-container text-[10px] font-bold rounded-sm">CRITICAL</span>
<span className="text-[10px] text-on-surface-variant">Category: SLA</span>
</div>
</div>

<div className="group border-b border-outline-variant hover:bg-surface-container-low transition-all cursor-pointer p-md relative border-l-4 border-l-secondary">
<div className="flex justify-between items-start mb-1">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-secondary text-[20px]" data-icon="trending_up">trending_up</span>
<span className="font-bold text-[13px]">Conversion Milestone Reached</span>
</div>
<span className="text-[11px] text-on-surface-variant">15m ago</span>
</div>
<p className="text-on-surface-variant text-body-sm leading-tight line-clamp-2">Team Beta has reached 85% conversion for the Morning Shift. 5 new Premium Leads successfully onboarded.</p>
<div className="mt-2 flex items-center gap-2">
<span className="px-2 py-px bg-secondary-fixed text-on-secondary-fixed-variant text-[10px] font-bold rounded-sm">SUCCESS</span>
<span className="text-[10px] text-on-surface-variant">Category: Conversion</span>
</div>
</div>

<div className="group border-b border-outline-variant hover:bg-surface-container-low transition-all cursor-pointer p-md relative border-l-4 border-l-primary">
<div className="flex justify-between items-start mb-1">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-[20px]" data-icon="fact_check">fact_check</span>
<span className="font-bold text-[13px]">QC Flag: Call ID #QC-901</span>
</div>
<span className="text-[11px] text-on-surface-variant">1h ago</span>
</div>
<p className="text-on-surface-variant text-body-sm leading-tight line-clamp-2">Agent Sunita M. missed mandatory compliance disclaimer in call with customer "Manoj Transport". Record flagged for review.</p>
<div className="mt-2 flex items-center gap-2">
<span className="px-2 py-px bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold rounded-sm">REVIEW</span>
<span className="text-[10px] text-on-surface-variant">Category: QC Console</span>
</div>
</div>

<div className="group border-b border-outline-variant hover:bg-surface-container-low transition-all cursor-pointer p-md relative border-l-4 border-l-tertiary">
<div className="flex justify-between items-start mb-1">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-tertiary text-[20px]" data-icon="person_alert">person_alert</span>
<span className="font-bold text-[13px]">Roster Update: Shift B</span>
</div>
<span className="text-[11px] text-on-surface-variant">3h ago</span>
</div>
<p className="text-on-surface-variant text-body-sm leading-tight line-clamp-2">3 agents have requested emergency leave for tomorrow's shift. Please review and reassign lead distribution.</p>
<div className="mt-2 flex items-center gap-2">
<span className="px-2 py-px bg-tertiary-fixed text-on-tertiary-fixed-variant text-[10px] font-bold rounded-sm">ADMIN</span>
<span className="text-[10px] text-on-surface-variant">Category: HR</span>
</div>
</div>

<div className="group border-b border-outline-variant hover:bg-surface-container-low transition-all cursor-pointer p-md relative border-l-4 border-l-outline">
<div className="flex justify-between items-start mb-1">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-outline text-[20px]" data-icon="dns">dns</span>
<span className="font-bold text-[13px]">System Maintenance Advisory</span>
</div>
<span className="text-[11px] text-on-surface-variant">5h ago</span>
</div>
<p className="text-on-surface-variant text-body-sm leading-tight line-clamp-2">Database optimization scheduled for 02:00 AM. Dashboard access may be intermittent for 15 minutes.</p>
<div className="mt-2 flex items-center gap-2">
<span className="px-2 py-px bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-sm">SYSTEM</span>
<span className="text-[10px] text-on-surface-variant">Category: IT</span>
</div>
</div>
</div>
</div>

<div className="w-1/2 flex flex-col bg-surface-container-low">

<div className="p-lg bg-white border-b border-outline-variant">
<div className="flex justify-between items-start mb-lg">
<div className="flex gap-md">
<div className="w-12 h-12 bg-error/10 text-error rounded-sm flex items-center justify-center">
<span className="material-symbols-outlined text-[32px]" data-icon="warning">warning</span>
</div>
<div>
<h3 className="font-headline-md text-headline-md font-bold mb-1">SLA Breach Critical: Lead ID #4492</h3>
<div className="flex items-center gap-2 text-on-surface-variant text-[12px]">
<span className="font-bold">From: System Watchdog</span>
<span>•</span>
<span>Today, 10:42 AM</span>
</div>
</div>
</div>
<div className="flex gap-2">
<button className="p-2 border border-outline-variant rounded-sm hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="archive">archive</span></button>
<button className="p-2 border border-outline-variant rounded-sm hover:bg-surface-container transition-colors"><span className="material-symbols-outlined text-[20px]" data-icon="delete">delete</span></button>
</div>
</div>
<div className="prose prose-sm max-w-none text-on-surface-variant mb-lg">
<p className="mb-4">The following lead has breached the maximum defined SLA of 15 minutes for the first engagement attempt.</p>
<div className="grid grid-cols-2 gap-md p-md bg-surface-container-low rounded-sm border border-outline-variant mb-4">
<div>
<p className="text-[10px] uppercase font-bold text-outline">Lead Name</p>
<p className="font-bold">Jai Balaji Logistics</p>
</div>
<div>
<p className="text-[10px] uppercase font-bold text-outline">Assigned Agent</p>
<p className="font-bold">Rahul Kumar (Team Alpha)</p>
</div>
<div>
<p className="text-[10px] uppercase font-bold text-outline">Assign Time</p>
<p>10:25:12 AM</p>
</div>
<div>
<p className="text-[10px] uppercase font-bold text-outline">Current Delay</p>
<p className="text-error font-bold">+17m 48s</p>
</div>
</div>
<p>Failure to address this within the next 5 minutes will result in an automatic lead reassignment and a negative performance weight for the agent.</p>
</div>
<div className="flex gap-md">
<button className="flex-grow bg-[#2874F0] text-white py-2 font-bold rounded-sm active:scale-[0.98] transition-transform">Call Agent Now</button>
<button className="flex-grow bg-[#FB641B] text-white py-2 font-bold rounded-sm active:scale-[0.98] transition-transform">Reassign Lead</button>
</div>
</div>

<div className="flex-1 p-lg overflow-y-auto custom-scrollbar">
<h3 className="font-label-caps text-label-caps font-bold mb-md text-primary">Alert Preferences</h3>
<p className="text-[12px] text-on-surface-variant mb-lg">Configure how you receive critical system updates and operational alerts.</p>
<div className="space-y-gutter">

<div className="bg-white p-md border border-outline-variant flex items-center justify-between shadow-sm">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-error" data-icon="alarm">alarm</span>
<div>
<p className="font-bold text-[13px]">SLA Breach Alerts</p>
<p className="text-[11px] text-on-surface-variant">Immediate notification for any team delay.</p>
</div>
</div>
<div className="flex gap-xl">
<div className="flex flex-col items-center gap-1">
<span className="text-[9px] uppercase font-bold text-outline">Push</span>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox"/>
<div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div className="flex flex-col items-center gap-1">
<span className="text-[9px] uppercase font-bold text-outline">Email</span>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox"/>
<div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</div>

<div className="bg-white p-md border border-outline-variant flex items-center justify-between shadow-sm">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-secondary" data-icon="query_stats">query_stats</span>
<div>
<p className="font-bold text-[13px]">Conversion Milestones</p>
<p className="text-[11px] text-on-surface-variant">Periodic updates on team performance targets.</p>
</div>
</div>
<div className="flex gap-xl">
<div className="flex flex-col items-center gap-1">
<span className="text-[9px] uppercase font-bold text-outline">Push</span>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox"/>
<div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div className="flex flex-col items-center gap-1">
<span className="text-[9px] uppercase font-bold text-outline">Email</span>
<label className="relative inline-flex items-center cursor-pointer">
<input className="sr-only peer" type="checkbox"/>
<div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</div>

<div className="bg-white p-md border border-outline-variant flex items-center justify-between shadow-sm">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary" data-icon="policy">policy</span>
<div>
<p className="font-bold text-[13px]">QC Failure Flags</p>
<p className="text-[11px] text-on-surface-variant">Real-time alerts for compliance violations.</p>
</div>
</div>
<div className="flex gap-xl">
<div className="flex flex-col items-center gap-1">
<span className="text-[9px] uppercase font-bold text-outline">Push</span>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox"/>
<div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div className="flex flex-col items-center gap-1">
<span className="text-[9px] uppercase font-bold text-outline">Email</span>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox"/>
<div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</div>

<div className="bg-white p-md border border-outline-variant flex items-center justify-between shadow-sm">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-on-surface-variant" data-icon="settings_suggest">settings_suggest</span>
<div>
<p className="font-bold text-[13px]">System Maintenance</p>
<p className="text-[11px] text-on-surface-variant">Scheduled downtime and platform updates.</p>
</div>
</div>
<div className="flex gap-xl">
<div className="flex flex-col items-center gap-1">
<span className="text-[9px] uppercase font-bold text-outline">Push</span>
<label className="relative inline-flex items-center cursor-pointer">
<input className="sr-only peer" type="checkbox"/>
<div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
<div className="flex flex-col items-center gap-1">
<span className="text-[9px] uppercase font-bold text-outline">Email</span>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox"/>
<div className="w-8 h-4 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-primary"></div>
</label>
</div>
</div>
</div>
</div>
<div className="mt-lg flex justify-end">
<button className="bg-[#2874F0] text-white px-md py-2 font-bold rounded-sm active:scale-[0.98] transition-transform">Save Preferences</button>
</div>
</div>
</div>
</div>
</main>
  );
};

export default ThNotificationsAlertsCenter;
