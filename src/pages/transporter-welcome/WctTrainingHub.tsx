import React from 'react';

export const WctTrainingHub: React.FC = () => {
  return (
    <main className=" mt-16 bg-white">

<div className="bg-[#FFF4E5] border-b border-[#F39C12]/20 px-margin-desktop py-3 flex items-center justify-between">
<div className="flex items-center gap-sm text-[#865300]">
<span className="material-symbols-outlined text-headline-sm" data-icon="warning">warning</span>
<p className="font-label-md">PROBATION PERIOD: 4 DAYS REMAINING. MAINTAIN 85% QC SCORE TO GRADUATE.</p>
</div>
<button className="text-[#865300] font-bold text-body-sm underline hover:opacity-80">View Policy</button>
</div>
<div className="p-margin-desktop space-y-lg">

<div className="flex justify-between items-end">
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Training Hub</h2>
<p className="text-on-surface-variant text-body-md">Enhance your sales mastery and logistics expertise.</p>
</div>
<div className="flex gap-sm">
<div className="px-md py-sm bg-surface-container-high rounded-lg border border-outline-variant">
<p className="text-body-sm text-on-surface-variant">Course Progress</p>
<p className="font-headline-sm text-headline-sm text-primary">68%</p>
</div>
<div className="px-md py-sm bg-surface-container-high rounded-lg border border-outline-variant">
<p className="text-body-sm text-on-surface-variant">Certifications</p>
<p className="font-headline-sm text-headline-sm text-primary">2 / 4</p>
</div>
</div>
</div>

<div className="bento-grid">

<div className="col-span-12 md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:border-primary-container transition-all group flex flex-col justify-between">
<div>
<div className="flex justify-between items-start mb-md">
<span className="material-symbols-outlined text-primary-container text-display-lg" data-icon="local_shipping">local_shipping</span>
<span className="bg-primary-fixed text-on-primary-fixed-variant font-label-md px-2 py-1 rounded">MANDATORY</span>
</div>
<h3 className="font-headline-sm text-headline-sm mb-xs">Understanding Fleet Profiles</h3>
<p className="text-body-md text-on-surface-variant mb-md">Master the nuances of different fleet sizes, from single truck owners to large-scale fleet operators.</p>
</div>
<div className="space-y-sm">
<div className="flex justify-between text-body-sm font-medium">
<span>Module Progress</span>
<span>100%</span>
</div>
<div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-[#FB641B] w-full"></div>
</div>
<button className="w-full mt-md py-2 border border-primary-container text-primary-container rounded font-bold hover:bg-primary-container hover:text-white transition-colors">Review Content</button>
</div>
</div>

<div className="col-span-12 md:col-span-6 bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:border-primary-container transition-all group flex flex-col justify-between">
<div>
<div className="flex justify-between items-start mb-md">
<span className="material-symbols-outlined text-primary-container text-display-lg" data-icon="record_voice_over">record_voice_over</span>
<span className="bg-secondary-container text-on-secondary-container font-label-md px-2 py-1 rounded">IN PROGRESS</span>
</div>
<h3 className="font-headline-sm text-headline-sm mb-xs">Consultative Selling</h3>
<p className="text-body-md text-on-surface-variant mb-md">Learn how to position TruckMitr as a business solution rather than just another transport tool.</p>
</div>
<div className="space-y-sm">
<div className="flex justify-between text-body-sm font-medium">
<span>Module Progress</span>
<span>45%</span>
</div>
<div className="w-full h-2 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-[#FB641B] w-[45%]"></div>
</div>
<button className="w-full mt-md py-2 bg-[#FB641B] text-white rounded font-bold hover:opacity-90 transition-opacity">Continue Module</button>
</div>
</div>

<div className="col-span-12 md:col-span-8 bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:border-primary-container transition-all group">
<div className="flex flex-col md:flex-row gap-lg">
<div className="flex-1">
<div className="flex items-center gap-sm mb-md">
<span className="material-symbols-outlined text-primary-container" data-icon="forum">forum</span>
<span className="text-label-md font-bold text-on-surface-variant uppercase tracking-widest">Level 2 Advance</span>
</div>
<h3 className="font-headline-sm text-headline-sm mb-xs">Transporter Objection Master Class</h3>
<p className="text-body-md text-on-surface-variant mb-md">Advanced techniques to handle price objections, trust issues, and competitor comparisons in the logistics sector.</p>
<div className="flex gap-md mb-lg">
<div className="flex items-center gap-xs text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]" data-icon="timer">timer</span>
<span>2.5 Hours</span>
</div>
<div className="flex items-center gap-xs text-body-sm text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]" data-icon="video_library">video_library</span>
<span>12 Lessons</span>
</div>
</div>
</div>
<div className="w-full md:w-64 space-y-md">
<div className="p-md bg-surface-container rounded-lg border border-outline-variant">
<p className="text-label-md text-on-surface-variant mb-sm">SLA STATUS</p>
<div className="flex items-center gap-sm">
<span className="w-3 h-3 rounded-full bg-error animate-pulse"></span>
<p className="font-bold text-error">Overdue</p>
</div>
<p className="text-body-sm mt-xs">Due by yesterday 6PM</p>
</div>
<button className="w-full py-2 bg-[#FB641B] text-white rounded font-bold hover:opacity-90 shadow-lg shadow-primary-container/20">Start Now</button>
</div>
</div>
</div>

<div className="col-span-12 md:col-span-4 bg-surface-container-lowest border border-outline-variant rounded-xl p-md hover:border-primary-container transition-all group">
<div className="mb-md">
<span className="material-symbols-outlined text-primary-container text-display-lg" data-icon="task_alt">task_alt</span>
</div>
<h3 className="font-headline-sm text-headline-sm mb-xs">SLA Management</h3>
<p className="text-body-md text-on-surface-variant mb-md">Protocol for ensuring transporter compliance and platform reliability standards.</p>
<div className="space-y-sm">
<div className="flex justify-between text-body-sm font-medium">
<span>Module Progress</span>
<span>0%</span>
</div>
<div className="w-full h-2 bg-surface-variant rounded-full"></div>
<button className="w-full mt-md py-2 border border-outline text-on-surface font-bold hover:bg-surface-variant transition-colors">Lock Content</button>
</div>
</div>
</div>

<div className="grid grid-cols-12 gap-lg pt-lg">
<div className="col-span-12 lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
<div className="px-md py-sm border-b border-outline-variant bg-surface-container-low flex justify-between items-center">
<div className="flex gap-md">
<button className="font-bold text-primary-container border-b-2 border-primary-container pb-1">QC Feedback Inbox</button>
<button className="font-medium text-on-surface-variant hover:text-on-surface transition-colors">Call Audit Log</button>
</div>
<span className="bg-error text-white text-[10px] px-2 py-0.5 rounded-full font-bold">3 NEW</span>
</div>
<div className="divide-y divide-outline-variant">

<div className="p-md hover:bg-surface-container-lowest transition-colors flex gap-md items-start cursor-pointer">
<div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-error">
<span className="material-symbols-outlined" data-icon="priority_high">priority_high</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h4 className="font-bold text-body-lg">Objection Handling - Failed</h4>
<span className="text-body-sm text-on-surface-variant">2h ago</span>
</div>
<p className="text-body-sm text-on-surface-variant mt-xs line-clamp-1">"Agent failed to address the 'trust' objection regarding payment cycles. Use the standard script..."</p>
<div className="mt-sm flex gap-xs">
<span className="text-[10px] font-bold px-2 py-0.5 rounded border border-error text-error bg-error/5">CRITICAL RE-WATCH</span>
</div>
</div>
</div>

<div className="p-md hover:bg-surface-container-lowest transition-colors flex gap-md items-start cursor-pointer">
<div className="w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container">
<span className="material-symbols-outlined" data-icon="check">check</span>
</div>
<div className="flex-1">
<div className="flex justify-between items-start">
<h4 className="font-bold text-body-lg">Script Adherence - Excellent</h4>
<span className="text-body-sm text-on-surface-variant">Yesterday</span>
</div>
<p className="text-body-sm text-on-surface-variant mt-xs line-clamp-1">"Perfect opening and transition to value proposition. Keep the same tone."</p>
<div className="mt-sm flex gap-xs">
<span className="text-[10px] font-bold px-2 py-0.5 rounded border border-secondary text-secondary bg-secondary/5">KUDOS</span>
</div>
</div>
</div>
</div>
<div className="p-md bg-surface-container-lowest text-center">
<button className="text-body-sm font-bold text-primary-container hover:underline">View All 24 Logs</button>
</div>
</div>

<div className="col-span-12 lg:col-span-5 flex flex-col gap-lg">
<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-md">
<h3 className="font-bold text-body-lg mb-md flex items-center gap-xs">
<span className="material-symbols-outlined text-primary" data-icon="trending_up">trending_up</span>
                            Daily SLA Performance
                        </h3>
<div className="space-y-md">
<div className="space-y-xs">
<div className="flex justify-between text-body-sm">
<span className="text-on-surface-variant">Average Handle Time</span>
<span className="font-bold">4:22m</span>
</div>
<div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-primary-container w-[70%]"></div>
</div>
</div>
<div className="space-y-xs">
<div className="flex justify-between text-body-sm">
<span className="text-on-surface-variant">Call Quality Score</span>
<span className="font-bold text-error">72%</span>
</div>
<div className="w-full h-1.5 bg-surface-variant rounded-full overflow-hidden">
<div className="h-full bg-error w-[72%]"></div>
</div>
<p className="text-[10px] text-error font-medium">8% below target threshold</p>
</div>
</div>
</div>
<div className="bg-[#FFF8F4] border border-[#F39C12]/30 rounded-xl p-md relative overflow-hidden">
<div className="relative z-10">
<h4 className="font-bold text-headline-sm text-on-primary-container mb-xs">Next Certification</h4>
<p className="text-body-sm text-on-surface-variant mb-md">Elite Transporter Partner Program</p>
<div className="flex items-center gap-md">
<div className="w-12 h-12 rounded-full border-4 border-primary-container border-t-transparent animate-spin-slow flex items-center justify-center">
<span className="text-body-sm font-bold text-primary-container">12%</span>
</div>
<div>
<p className="text-label-md text-on-surface-variant">EST. COMPLETION</p>
<p className="font-bold">May 24, 2024</p>
</div>
</div>
</div>
<span className="material-symbols-outlined absolute -right-4 -bottom-4 text-[120px] text-primary-container/10 rotate-12" data-icon="stars">stars</span>
</div>
</div>
</div>
</div>
</main>
  );
};

export default WctTrainingHub;
