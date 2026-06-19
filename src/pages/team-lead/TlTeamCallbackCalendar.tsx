import React from 'react';

export const TlTeamCallbackCalendar: React.FC = () => {
  return (
    <main className=" flex flex-col bg-white relative">

<div className="bg-[#ba1a1a] text-white px-margin-desktop py-base flex items-center justify-between shadow-md z-40">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-white" style={{"fontVariationSettings": "\'FILL\' 1"}}>error</span>
<span className="font-label-md">CRITICAL: 3 Overdue Callbacks requiring immediate supervisor resolution.</span>
<div className="flex gap-sm ml-lg">
<span className="px-sm py-[2px] bg-white/20 rounded font-mono-data text-xs">#L-9821 Alex R.</span>
<span className="px-sm py-[2px] bg-white/20 rounded font-mono-data text-xs">#L-7742 Casey C.</span>
</div>
</div>
<button className="bg-white text-[#ba1a1a] px-md py-xs rounded font-bold text-xs hover:bg-error-container transition-colors">
                    Resolve All
                </button>
</div>

<div className="h-16 px-margin-desktop flex items-center justify-between border-b border-outline-variant backdrop-blur-sm bg-white">
<div className="flex items-center gap-lg">
<h1 className="text-headline-sm font-headline-sm">Callback Calendar</h1>
<div className="flex items-center bg-surface-container-high rounded-lg p-1">
<button className="px-md py-1 text-on-surface-variant font-label-md">Day</button>
<button className="px-md py-1 bg-white text-on-surface font-bold rounded shadow-sm text-label-md">Week</button>
<button className="px-md py-1 text-on-surface-variant font-label-md">Month</button>
</div>
</div>
<div className="flex items-center gap-md">
<div className="flex items-center gap-sm bg-surface-container rounded-lg px-md py-xs border border-outline-variant">
<button className="material-symbols-outlined text-on-surface-variant text-sm">chevron_left</button>
<span className="font-label-md w-32 text-center">Oct 14 - Oct 20</span>
<button className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</button>
</div>
<button className="flex items-center gap-xs px-md py-xs border border-outline text-on-surface-variant font-label-md rounded hover:bg-surface-container-high">
<span className="material-symbols-outlined text-sm">filter_list</span> Filters
                    </button>
</div>
</div>

<div className="flex-1 overflow-y-auto bg-white">

<div className="calendar-grid bg-white sticky top-0 z-30 border-b border-outline-variant">
<div className="h-12 border-r border-outline-variant"></div>
<div className="flex flex-col items-center justify-center border-r border-outline-variant last:border-r-0 h-12">
<span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Mon</span>
<span className="text-body-md font-bold">14</span>
</div>
<div className="flex flex-col items-center justify-center border-r border-outline-variant last:border-r-0 h-12 bg-primary-container/10">
<span className="text-[10px] text-primary font-bold uppercase tracking-widest">Tue</span>
<span className="text-body-md font-bold text-primary">15</span>
</div>
<div className="flex flex-col items-center justify-center border-r border-outline-variant last:border-r-0 h-12">
<span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Wed</span>
<span className="text-body-md font-bold">16</span>
</div>
<div className="flex flex-col items-center justify-center border-r border-outline-variant last:border-r-0 h-12">
<span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Thu</span>
<span className="text-body-md font-bold">17</span>
</div>
<div className="flex flex-col items-center justify-center border-r border-outline-variant last:border-r-0 h-12">
<span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Fri</span>
<span className="text-body-md font-bold">18</span>
</div>
<div className="flex flex-col items-center justify-center border-r border-outline-variant last:border-r-0 h-12">
<span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Sat</span>
<span className="text-body-md font-bold">19</span>
</div>
<div className="flex flex-col items-center justify-center border-r border-outline-variant last:border-r-0 h-12">
<span className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Sun</span>
<span className="text-body-md font-bold">20</span>
</div>
</div>

<div className="relative bg-white">

<div className="calendar-grid time-row">
<div className="flex items-start justify-end px-sm pt-xs text-[10px] text-on-surface-variant font-mono-data border-r border-outline-variant">08:00 AM</div>
<div className="relative border-r border-outline-variant bg-surface/5">

<div className="callback-tile absolute top-2 left-2 right-2 p-2 rounded border-l-4 border-l-blue-500 bg-blue-50 shadow-sm cursor-pointer">
<div className="text-[10px] font-bold text-blue-700 leading-tight">Robert McAlister</div>
<div className="text-[9px] text-blue-600 flex justify-between mt-1">
<span className="">08:15 AM</span>
<span className="font-bold">ALEX R.</span>
</div>
</div>
</div>
<div className="border-r border-outline-variant"></div>
<div className="relative border-r border-outline-variant bg-surface/5">

<div className="callback-tile absolute top-4 left-2 right-2 p-2 rounded border-l-4 border-l-purple-500 bg-purple-50 shadow-sm cursor-pointer">
<div className="flex justify-between items-start">
<div className="text-[10px] font-bold text-purple-700 leading-tight">Sarah Jenkins</div>
<span className="material-symbols-outlined text-[12px] text-amber-600" title="Schedule Conflict">warning</span>
</div>
<div className="text-[9px] text-purple-600 flex justify-between mt-1">
<span className="">08:30 AM</span>
<span className="font-bold">CASEY C.</span>
</div>
</div>
</div>
<div className="border-r border-outline-variant"></div>
<div className="border-r border-outline-variant bg-surface/5"></div>
<div className="border-r border-outline-variant"></div>
<div className="border-r border-outline-variant"></div>
</div>

<div className="calendar-grid time-row">
<div className="flex items-start justify-end px-sm pt-xs text-[10px] text-on-surface-variant font-mono-data border-r border-outline-variant">09:00 AM</div>
<div className="border-r border-outline-variant"></div>
<div className="relative border-r border-outline-variant bg-surface/5">

<div className="callback-tile absolute top-0 left-2 right-2 p-2 rounded border-l-4 border-l-green-500 bg-green-50 shadow-sm cursor-pointer">
<div className="text-[10px] font-bold text-green-700 leading-tight">Pacific Logistics Corp</div>
<div className="text-[9px] text-green-600 flex justify-between mt-1">
<span className="">09:00 AM</span>
<span className="font-bold">SAM J.</span>
</div>
</div>
</div>
<div className="border-r border-outline-variant"></div>
<div className="border-r border-outline-variant bg-surface/5"></div>
<div className="border-r border-outline-variant"></div>
<div className="border-r border-outline-variant"></div>
<div className="border-r border-outline-variant"></div>
</div>

<div className="calendar-grid time-row">
<div className="flex items-start justify-end px-sm pt-xs text-[10px] text-on-surface-variant font-mono-data border-r border-outline-variant">10:00 AM</div>
<div className="border-r border-outline-variant bg-surface/5"></div>
<div className="relative border-r border-outline-variant">
<div className="absolute inset-0 bg-primary/5 opacity-50"></div>
<div className="callback-tile absolute top-8 left-2 right-2 p-2 rounded border-l-4 border-l-blue-500 bg-blue-50 shadow-sm cursor-pointer">
<div className="text-[10px] font-bold text-blue-700 leading-tight">Derrick Vance</div>
<div className="text-[9px] text-blue-600 flex justify-between mt-1">
<span className="">10:45 AM</span>
<span className="font-bold">ALEX R.</span>
</div>
</div>
</div>
<div className="relative border-r border-outline-variant bg-surface/5">
<div className="callback-tile absolute top-4 left-2 right-2 p-2 rounded border-l-4 border-l-green-500 bg-green-50 shadow-sm cursor-pointer">
<div className="text-[10px] font-bold text-green-700 leading-tight">Global Freight Int.</div>
<div className="text-[9px] text-green-600 flex justify-between mt-1">
<span className="">10:15 AM</span>
<span className="font-bold">SAM J.</span>
</div>
</div>
</div>
<div className="border-r border-outline-variant"></div>
<div className="border-r border-outline-variant bg-surface/5"></div>
<div className="border-r border-outline-variant"></div>
<div className="border-r border-outline-variant"></div>
</div>

<div className="calendar-grid time-row">
<div className="flex items-start justify-end px-sm pt-xs text-[10px] text-on-surface-variant font-mono-data border-r border-outline-variant">11:00 AM</div>
<div className="border-r border-outline-variant"></div>
<div className="border-r border-outline-variant bg-surface/5"></div>
<div className="border-r border-outline-variant"></div>
<div className="border-r border-outline-variant bg-surface/5"></div>
<div className="border-r border-outline-variant"></div>
<div className="border-r border-outline-variant"></div>
<div className="border-r border-outline-variant"></div>
</div>

<div className="absolute top-[280px] left-[80px] right-0 h-[2px] bg-primary z-20 pointer-events-none">
<div className="absolute -left-1 -top-1 w-2 h-2 rounded-full bg-primary"></div>
</div>
</div>
</div>

<button className="absolute bottom-margin-desktop right-margin-desktop w-14 h-14 bg-primary text-on-primary rounded-full shadow-lg flex items-center justify-center hover:scale-110 transition-transform active:opacity-80">
<span className="material-symbols-outlined text-2xl" style={{"fontVariationSettings": "\'wght\' 700"}}>add</span>
</button>
</main>
  );
};

export default TlTeamCallbackCalendar;
