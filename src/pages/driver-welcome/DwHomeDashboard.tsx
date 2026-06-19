import React from 'react';

export const DwHomeDashboard: React.FC = () => {
  return (
    <div className="space-y-lg max-w-7xl mx-auto w-full">

<section className="flex flex-col md:flex-row md:items-end justify-between gap-md">
<div>
<p className="text-on-surface-variant font-label-md uppercase tracking-widest">Dashboard Overview</p>
<h2 className="text-display-lg font-display-lg text-on-surface">Good morning, Arjun — June 18, 2026</h2>
</div>
<div className="flex items-center gap-sm text-on-surface-variant font-mono-data text-mono-data bg-surface-container px-md py-sm rounded-lg border border-outline-variant">
<span className="material-symbols-outlined text-[18px]">schedule</span>
<span>Shift ends in 04:22:10</span>
</div>
</section>

<div className="grid grid-cols-1 md:grid-cols-12 gap-lg">

<div className="md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col justify-between overflow-hidden relative">
<div className="flex justify-between items-start mb-md">
<div>
<h3 className="font-headline-sm text-on-surface">Today's Target</h3>
<p className="text-on-surface-variant font-body-sm">Operational efficiency target for June 18</p>
</div>
<div className="text-right">
<p className="font-headline-md text-primary">Today's Share: ₹1,667</p>
<p className="font-mono-data text-accent-success text-mono-data">₹420 earned today</p>
</div>
</div>
<div className="space-y-sm">
<div className="flex justify-between items-end">
<span className="text-on-surface-variant font-label-md">25% of daily target reached</span>
<span className="font-label-md text-on-surface">₹1,247 remaining</span>
</div>
<div className="w-full h-3 bg-surface-container-high rounded-full overflow-hidden">
<div className="h-full bg-accent-success rounded-full transition-all duration-1000" style={{"width": "25%"}}></div>
</div>
<div className="grid grid-cols-3 gap-md pt-md">
<div className="border-r border-outline-variant">
<p className="text-on-surface-variant font-label-md uppercase">Calls Made</p>
<p className="text-headline-sm font-headline-sm">24</p>
</div>
<div className="border-r border-outline-variant px-md">
<p className="text-on-surface-variant font-label-md uppercase">Converted</p>
<p className="text-headline-sm font-headline-sm text-accent-success">3</p>
</div>
<div className="px-md">
<p className="text-on-surface-variant font-label-md uppercase">Rate</p>
<p className="text-headline-sm font-headline-sm">4.34%</p>
</div>
</div>
</div>
</div>

<div className="md:col-span-4 bg-primary text-on-primary rounded-xl p-lg flex flex-col justify-between shadow-lg">
<div>
<div className="flex justify-between items-center mb-md">
<span className="material-symbols-outlined text-display-lg" style={{"fontVariationSettings": "\'FILL\' 1"}}>call_log</span>
<span className="bg-on-primary/20 px-sm py-xs rounded text-label-md">Live Queue</span>
</div>
<h3 className="font-headline-md mb-sm">Queue Summary</h3>
<div className="space-y-xs opacity-90">
<div className="flex justify-between font-label-md">
<span>Active Queue</span>
<span>12 Leads</span>
</div>
<div className="flex justify-between font-label-md">
<span>Callbacks Due</span>
<span>08</span>
</div>
<div className="flex justify-between font-label-md text-error-container font-bold">
<span>Overdue Callbacks</span>
<span>02</span>
</div>
</div>
</div>
<button className="mt-lg w-full bg-accent-success text-white py-md rounded-lg font-bold flex items-center justify-center gap-sm hover:brightness-110 active:scale-[0.98] transition-all">
<span className="material-symbols-outlined">play_circle</span>
                        START CALLING
                    </button>
</div>

<div className="md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
<div className="flex justify-between items-center mb-md">
<h3 className="font-headline-sm text-on-surface">Gate Status</h3>
<span className="material-symbols-outlined text-on-surface-variant">lock_open</span>
</div>
<div className="flex items-baseline gap-sm mb-sm">
<span className="text-display-lg font-display-lg text-on-surface">₹4,200</span>
<span className="text-on-surface-variant font-body-lg">/ ₹22,000</span>
</div>
<div className="w-full h-2 bg-surface-container-high rounded-full mb-md">

<div className="h-full bg-primary-container rounded-full" style={{"width": "19.09%"}}></div>
</div>
<div className="flex items-center gap-sm bg-surface-container-low p-sm rounded-lg border border-outline-variant">
<span className="material-symbols-outlined text-primary text-[20px]">info</span>
<p className="text-on-surface font-body-sm">₹17,800 more to unlock incentives</p>
</div>
</div>

<div className="md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg flex flex-col">
<div className="flex justify-between items-center mb-md">
<h3 className="font-headline-sm text-on-surface">Incentive Counter</h3>
<span className="material-symbols-outlined text-outline">lock</span>
</div>
<div className="flex-1 flex flex-col justify-center items-center py-lg border-2 border-dashed border-outline-variant rounded-lg bg-surface-container-low/50">
<p className="text-display-lg font-display-lg text-outline">₹0</p>
<p className="text-on-surface-variant font-label-md">incentive earned (locked)</p>
</div>
<p className="text-center text-[10px] text-on-surface-variant mt-md uppercase tracking-tighter">Cross Gate 1 to start itemized breakdown</p>
</div>

<div className="md:col-span-8 bg-error-container border border-error/20 rounded-xl p-lg flex items-center justify-between">
<div className="flex items-center gap-lg">
<div className="w-12 h-12 bg-error text-on-error rounded-full flex items-center justify-center animate-pulse">
<span className="material-symbols-outlined">notification_important</span>
</div>
<div>
<h4 className="font-headline-sm text-on-error-container">2 Overdue Callbacks</h4>
<p className="text-on-error-container/80 font-body-sm">Immediate attention required for high-priority shipments</p>
</div>
</div>
<button className="bg-error text-on-error px-xl py-md rounded-lg font-bold flex items-center gap-sm hover:opacity-90 active:scale-95 transition-all">
                        CALL NOW
                    </button>
</div>

<div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
<div className="flex justify-between items-center mb-md">
<h3 className="font-headline-sm text-on-surface">Streak</h3>
<div className="flex items-center gap-xs">
<span className="text-accent-success font-bold">12 Days</span>
<span className="material-symbols-outlined text-accent-success" style={{"fontVariationSettings": "\'FILL\' 1"}}>local_fire_department</span>
</div>
</div>
<div className="grid grid-cols-7 gap-xs">

<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-accent-success flex items-center justify-center text-[8px] text-white">4</div>
<span className="text-[9px] text-on-surface-variant mt-1">Jun 4</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-accent-success"></div>
<span className="text-[9px] text-on-surface-variant mt-1">5</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-accent-success"></div>
<span className="text-[9px] text-on-surface-variant mt-1">6</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-error"></div>
<span className="text-[9px] text-on-surface-variant mt-1">7</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-accent-success"></div>
<span className="text-[9px] text-on-surface-variant mt-1">8</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-accent-success"></div>
<span className="text-[9px] text-on-surface-variant mt-1">9</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-accent-success"></div>
<span className="text-[9px] text-on-surface-variant mt-1">10</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-accent-success"></div>
<span className="text-[9px] text-on-surface-variant mt-1">11</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-accent-success"></div>
<span className="text-[9px] text-on-surface-variant mt-1">12</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-surface-container-highest"></div>
<span className="text-[9px] text-on-surface-variant mt-1">13</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-accent-success"></div>
<span className="text-[9px] text-on-surface-variant mt-1">14</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-accent-success"></div>
<span className="text-[9px] text-on-surface-variant mt-1">15</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-accent-success"></div>
<span className="text-[9px] text-on-surface-variant mt-1">16</span>
</div>
<div className="flex flex-col items-center">
<div className="w-6 h-6 rounded-full bg-accent-success border-2 border-primary"></div>
<span className="text-[9px] text-primary font-bold mt-1">Today</span>
</div>
</div>
</div>
</div>
</div>
  );
};

export default DwHomeDashboard;
