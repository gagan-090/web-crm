import React from 'react';

export const CalibrationSessionManager: React.FC = () => {
  return (
    <main className="pt-24 pl-[232px] pr-8 pb-12">

<div className="flex flex-col md:flex-row gap-6 mb-8">
<div className="flex-1 bg-white border border-outline-variant p-6 rounded-lg flex items-center justify-between shadow-sm">
<div>
<h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1">WEEKLY COMPLIANCE</h3>
<p className="font-display text-display text-primary">1 / 1 Sessions</p>
<p className="text-[12px] text-tertiary font-bold mt-1">Goal Reached: 100%</p>
</div>
<div className="w-16 h-16 rounded-full border-4 border-primary/20 flex items-center justify-center">
<span className="material-symbols-outlined text-primary text-[32px]" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span>
</div>
</div>
<div className="flex-1 bg-white border border-outline-variant p-6 rounded-lg flex items-center justify-between shadow-sm">
<div>
<h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1">PENDING REVIEWS</h3>
<p className="font-display text-display text-on-surface">12 Calls</p>
<p className="text-[12px] text-on-surface-variant mt-1">Ready for Calibration</p>
</div>
<div className="w-16 h-16 rounded-full border-4 border-secondary-container flex items-center justify-center">
<span className="material-symbols-outlined text-secondary text-[32px]">assignment_turned_in</span>
</div>
</div>
<div className="flex-1 bg-white border border-outline-variant p-6 rounded-lg flex items-center justify-between shadow-sm">
<div>
<h3 className="font-label-caps text-label-caps text-on-surface-variant mb-1">AVERAGE VARIANCE</h3>
<p className="font-display text-display text-on-surface">4.2%</p>
<p className="text-[12px] text-error font-bold mt-1">High variance in Fatal Errors</p>
</div>
<div className="w-16 h-16 rounded-full border-4 border-error-container flex items-center justify-center">
<span className="material-symbols-outlined text-error text-[32px]">warning</span>
</div>
</div>
</div>

<div className="flex items-center justify-between mb-6">
<div className="flex items-center gap-4">
<div className="flex border border-outline-variant rounded-lg overflow-hidden bg-white">
<button className="px-4 py-2 bg-primary text-on-primary text-sm font-bold">Month</button>
<button className="px-4 py-2 hover:bg-surface-variant/30 text-on-surface text-sm font-medium border-l border-outline-variant">Week</button>
<button className="px-4 py-2 hover:bg-surface-variant/30 text-on-surface text-sm font-medium border-l border-outline-variant">Day</button>
</div>
<h3 className="font-headline-md text-headline-md text-on-surface">October 2023</h3>
<div className="flex gap-2">
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-white active:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">chevron_left</span>
</button>
<button className="w-8 h-8 flex items-center justify-center rounded border border-outline-variant hover:bg-white active:bg-surface-container transition-colors">
<span className="material-symbols-outlined text-[18px]">chevron_right</span>
</button>
</div>
</div>
<button className="flex items-center gap-2 bg-primary text-on-primary px-6 py-2.5 rounded shadow-sm font-bold hover:brightness-110 active:scale-95 transition-all" >
<span className="material-symbols-outlined">add</span>
                Create Session
            </button>
</div>

<div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
<div className="grid grid-cols-7 border-b border-outline-variant bg-surface-container-low">
<div className="py-3 text-center text-label-caps text-on-surface-variant border-r border-outline-variant">SUN</div>
<div className="py-3 text-center text-label-caps text-on-surface-variant border-r border-outline-variant">MON</div>
<div className="py-3 text-center text-label-caps text-on-surface-variant border-r border-outline-variant">TUE</div>
<div className="py-3 text-center text-label-caps text-on-surface-variant border-r border-outline-variant">WED</div>
<div className="py-3 text-center text-label-caps text-on-surface-variant border-r border-outline-variant">THU</div>
<div className="py-3 text-center text-label-caps text-on-surface-variant border-r border-outline-variant">FRI</div>
<div className="py-3 text-center text-label-caps text-on-surface-variant">SAT</div>
</div>
<div className="calendar-grid">

<div className="min-h-[140px] bg-surface-container-low/30 p-2 opacity-50 border-r border-outline-variant"></div>
<div className="min-h-[140px] bg-surface-container-low/30 p-2 opacity-50 border-r border-outline-variant"></div>
<div className="min-h-[140px] bg-surface-container-low/30 p-2 opacity-50 border-r border-outline-variant"></div>
<div className="min-h-[140px] bg-surface-container-low/30 p-2 opacity-50 border-r border-outline-variant"></div>
<div className="min-h-[140px] bg-surface-container-low/30 p-2 opacity-50 border-r border-outline-variant"></div>
<div className="min-h-[140px] bg-white p-2 border-r border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">1</span>
</div>
<div className="min-h-[140px] bg-white p-2">
<span className="text-label-md font-bold text-on-surface-variant">2</span>
</div>

<div className="min-h-[140px] bg-white p-2 border-r border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">3</span>
</div>
<div className="min-h-[140px] bg-white p-2 border-r border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">4</span>

<div className="mt-2 bg-primary-fixed p-2 rounded border border-primary/20 cursor-pointer hover:shadow-md transition-shadow">
<p className="text-[10px] font-black text-primary leading-tight uppercase mb-1">Calibration: TL Rajesh</p>
<div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
<span className="material-symbols-outlined text-[12px]">group</span>
<span>3 Attendees</span>
</div>
<div className="flex items-center gap-1 text-[10px] text-on-surface-variant mt-1">
<span className="material-symbols-outlined text-[12px]">call</span>
<span>4 Calls reviewed</span>
</div>
</div>
</div>
<div className="min-h-[140px] bg-white p-2 border-r border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">5</span>
</div>
<div className="min-h-[140px] bg-white p-2 border-r border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">6</span>
</div>
<div className="min-h-[140px] bg-white p-2 border-r border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">7</span>
</div>
<div className="min-h-[140px] bg-white p-2 border-r border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">8</span>
<div className="mt-2 bg-secondary-container p-2 rounded border border-secondary/20">
<p className="text-[10px] font-black text-on-secondary-fixed-variant leading-tight uppercase mb-1">Calibration: TL Sameer</p>
<div className="flex items-center gap-1 text-[10px] text-on-surface-variant">
<span className="material-symbols-outlined text-[12px]">group</span>
<span>2 Attendees</span>
</div>
</div>
</div>
<div className="min-h-[140px] bg-white p-2 border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">9</span>
</div>

<div className="min-h-[140px] bg-white p-2 border-r border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">10</span>
</div>
<div className="min-h-[140px] bg-white p-2 border-r border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">11</span>
</div>
<div className="min-h-[140px] bg-primary/5 p-2 border-r border-b border-primary/20 ring-1 ring-inset ring-primary/20 relative">
<span className="text-label-md font-bold text-primary">12</span>
<span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full animate-pulse"></span>
<p className="text-[10px] mt-2 text-primary font-bold italic">Today</p>
<div className="mt-2 bg-white p-2 rounded border border-outline shadow-sm">
<p className="text-[10px] font-black text-primary leading-tight uppercase mb-1">14:00 - Weekly TL Sync</p>
<div className="flex -space-x-1 mt-1">
<div className="w-5 h-5 rounded-full border border-white bg-slate-300"></div>
<div className="w-5 h-5 rounded-full border border-white bg-slate-400"></div>
<div className="w-5 h-5 rounded-full border border-white bg-primary text-[8px] flex items-center justify-center text-white">+1</div>
</div>
</div>
</div>
<div className="min-h-[140px] bg-white p-2 border-r border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">13</span>
</div>
<div className="min-h-[140px] bg-white p-2 border-r border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">14</span>
</div>
<div className="min-h-[140px] bg-white p-2 border-r border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">15</span>
</div>
<div className="min-h-[140px] bg-white p-2 border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">16</span>
</div>
</div>
</div>
</main>
  );
};

export default CalibrationSessionManager;
