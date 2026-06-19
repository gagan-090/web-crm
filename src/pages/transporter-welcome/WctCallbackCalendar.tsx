import React from 'react';

export const WctCallbackCalendar: React.FC = () => {
  return (
    <main className=" mt-16 p-lg bg-surface">

<section className="mb-lg rounded-xl overflow-hidden shadow-sm">
<div className="overdue-banner px-lg py-md flex items-center justify-between text-white">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-display-lg" style={{"fontVariationSettings": "\'FILL\' 1"}}>warning</span>
<div>
<h3 className="font-headline-sm text-headline-sm">Overdue Callbacks (14)</h3>
<p className="text-body-sm opacity-90">Priority attention required for high-SLA transporters</p>
</div>
</div>
<button className="bg-white/20 hover:bg-white/30 px-lg py-sm rounded-full text-body-md font-bold transition-colors">
                    Resolve All
                </button>
</div>
<div className="bg-white p-xs flex flex-col divide-y divide-outline-variant">

<div className="flex items-center justify-between p-sm hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-md">
<div className="w-2 h-12 bg-error rounded-full"></div>
<div>
<p className="font-bold text-on-surface">Translogistics India Pvt Ltd</p>
<p className="text-body-sm text-on-surface-variant">Lead ID: WCT-8829 | Scheduled: Yesterday, 4:30 PM</p>
</div>
</div>
<div className="flex items-center gap-lg">
<span className="bg-error/10 text-error px-sm py-xs rounded text-label-md font-bold">MISSING SLA</span>
<button className="text-primary-container material-symbols-outlined">phone_callback</button>
</div>
</div>

<div className="flex items-center justify-between p-sm hover:bg-surface-container-low transition-colors">
<div className="flex items-center gap-md">
<div className="w-2 h-12 bg-error rounded-full"></div>
<div>
<p className="font-bold text-on-surface">Agrawal Global Carriers</p>
<p className="text-body-sm text-on-surface-variant">Lead ID: WCT-9012 | Scheduled: Today, 9:00 AM</p>
</div>
</div>
<div className="flex items-center gap-lg">
<span className="bg-error/10 text-error px-sm py-xs rounded text-label-md font-bold">OVERDUE 2H</span>
<button className="text-primary-container material-symbols-outlined">phone_callback</button>
</div>
</div>
</div>
</section>

<div className="flex items-center justify-between mb-md">
<div className="flex items-center gap-md">
<h1 className="font-display-lg text-display-lg">Callback Calendar</h1>
<div className="flex bg-surface-container-low p-1 rounded-xl">
<button className="px-md py-xs rounded-lg text-body-md font-medium transition-all hover:bg-white" id="day-view-btn">Day</button>
<button className="px-md py-xs rounded-lg text-body-md font-bold transition-all bg-white shadow-sm" id="week-view-btn">Week</button>
</div>
</div>
<div className="flex items-center gap-sm">
<button className="p-sm hover:bg-surface-container-low rounded-full material-symbols-outlined">chevron_left</button>
<span className="font-bold text-body-lg">Oct 23 - Oct 29, 2023</span>
<button className="p-sm hover:bg-surface-container-low rounded-full material-symbols-outlined">chevron_right</button>
</div>
</div>

<div className="bg-white border border-outline-variant rounded-xl overflow-hidden">

<div className="calendar-grid bg-surface-container-low border-b border-outline-variant">
<div className="p-md text-label-md text-on-surface-variant">Time</div>
<div className="p-md border-l border-outline-variant text-center">
<p className="text-label-md text-on-surface-variant">MON</p>
<p className="font-bold">23</p>
</div>
<div className="p-md border-l border-outline-variant text-center bg-primary-container/10">
<p className="text-label-md text-primary-container">TUE</p>
<p className="font-bold text-primary-container">24</p>
</div>
<div className="p-md border-l border-outline-variant text-center">
<p className="text-label-md text-on-surface-variant">WED</p>
<p className="font-bold">25</p>
</div>
<div className="p-md border-l border-outline-variant text-center">
<p className="text-label-md text-on-surface-variant">THU</p>
<p className="font-bold">26</p>
</div>
<div className="p-md border-l border-outline-variant text-center">
<p className="text-label-md text-on-surface-variant">FRI</p>
<p className="font-bold">27</p>
</div>
<div className="p-md border-l border-outline-variant text-center">
<p className="text-label-md text-on-surface-variant">SAT</p>
<p className="font-bold">28</p>
</div>
<div className="p-md border-l border-outline-variant text-center">
<p className="text-label-md text-on-surface-variant">SUN</p>
<p className="font-bold text-on-surface-variant">29</p>
</div>
</div>

<div className="max-h-[600px] overflow-y-auto">

<div className="calendar-grid border-b border-outline-variant group">
<div className="p-md text-label-md text-on-surface-variant h-24">10:00 AM</div>
<div className="border-l border-outline-variant p-xs relative h-24 hover:bg-surface-container-low transition-colors"></div>
<div className="border-l border-outline-variant p-xs relative h-24 bg-primary-container/[0.02]">
<div className="absolute inset-1 bg-secondary-container/50 border-l-4 border-primary-container rounded p-sm shadow-sm">
<div className="flex items-center justify-between mb-xs">
<p className="font-bold text-xs truncate">BlueDart Express</p>
<span className="bg-primary-container text-white text-[10px] px-1 rounded">SLA</span>
</div>
<p className="text-[10px] opacity-70">Follow-up on quote</p>
</div>
</div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24">
<div className="absolute top-1 left-1 right-1 bg-surface-variant border-l-4 border-outline rounded p-sm opacity-60">
<p className="font-bold text-xs truncate">Mahindra Logi.</p>
</div>
</div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
</div>

<div className="calendar-grid border-b border-outline-variant group">
<div className="p-md text-label-md text-on-surface-variant h-24">11:00 AM</div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24 bg-primary-container/[0.02]"></div>
<div className="border-l border-outline-variant p-xs relative h-24">
<div className="absolute inset-1 bg-secondary-container/50 border-l-4 border-primary-container rounded p-sm shadow-sm">
<div className="flex items-center justify-between mb-xs">
<p className="font-bold text-xs truncate">Gati KWE Ltd</p>
<span className="bg-primary-container text-white text-[10px] px-1 rounded">SLA</span>
</div>
<p className="text-[10px] opacity-70">KyC Verification</p>
</div>
</div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
</div>

<div className="calendar-grid border-b border-outline-variant group">
<div className="p-md text-label-md text-on-surface-variant h-24">12:00 PM</div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24 bg-primary-container/[0.02]">
<div className="absolute inset-1 bg-surface-container-high border-l-4 border-on-surface-variant rounded p-sm">
<p className="font-bold text-xs truncate">Lunch Break</p>
</div>
</div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
</div>

<div className="calendar-grid border-b border-outline-variant group">
<div className="p-md text-label-md text-on-surface-variant h-24">01:00 PM</div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24 bg-primary-container/[0.02]"></div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24">
<div className="absolute inset-1 bg-secondary-container/50 border-l-4 border-primary-container rounded p-sm shadow-sm">
<p className="font-bold text-xs truncate">Varuna Carriers</p>
<p className="text-[10px] opacity-70">Price Negotiation</p>
</div>
</div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
<div className="border-l border-outline-variant p-xs relative h-24"></div>
</div>
</div>
</div>

<div className="mt-lg grid grid-cols-1 md:grid-cols-3 gap-lg">

<div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col gap-sm">
<span className="text-label-md text-on-surface-variant uppercase tracking-wider">Conversion Forecast</span>
<div className="flex items-baseline gap-sm">
<span className="text-display-lg font-display-lg text-primary-container">64%</span>
<span className="text-success text-body-sm font-bold flex items-center"><span className="material-symbols-outlined text-[16px]">trending_up</span> +12%</span>
</div>
<p className="text-body-sm text-on-surface-variant">Based on scheduled callbacks for this week.</p>
</div>

<div className="bg-white border border-outline-variant p-lg rounded-xl flex flex-col gap-sm">
<span className="text-label-md text-on-surface-variant uppercase tracking-wider">Avg. SLA Time</span>
<div className="flex items-baseline gap-sm">
<span className="text-display-lg font-display-lg">18m</span>
<span className="text-error text-body-sm font-bold flex items-center"><span className="material-symbols-outlined text-[16px]">trending_down</span> -2m</span>
</div>
<p className="text-body-sm text-on-surface-variant">Response time within the first-call window.</p>
</div>

<div className="bg-primary-container p-lg rounded-xl flex flex-col justify-between text-on-primary shadow-lg shadow-primary-container/20">
<div>
<h4 className="font-bold text-body-lg">Daily Briefing</h4>
<p className="text-body-sm opacity-90 mt-xs">You have 12 critical SLA callbacks between 2 PM and 4 PM.</p>
</div>
<button className="mt-md bg-white text-primary-container px-md py-sm rounded-lg font-bold text-body-md hover:bg-opacity-90 transition-all">
                    Prepare Workspace
                </button>
</div>
</div>
</main>
  );
};

export default WctCallbackCalendar;
