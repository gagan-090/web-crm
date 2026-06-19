import React from 'react';

export const TlCallerProfileDetail: React.FC = () => {
  return (
    <main className=" flex flex-col bg-surface-container-lowest">


<div className="flex-1 flex overflow-hidden">

<div className="flex-1 overflow-y-auto custom-scrollbar p-xl space-y-xl">

<section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-md">
<div className="flex items-center gap-lg">
<div className="relative">
<div className="w-24 h-24 rounded-full border-4 border-surface-container-high p-1">
<img className="w-full h-full rounded-full object-cover" data-alt="A portrait of a energetic young professional male caller in a modern logistics call center environment. He is wearing a sleek headset and a subtle, dark-colored polo shirt. The lighting is crisp and bright, characteristic of a high-velocity workspace. The background is a blurred corporate office with hints of amber-toned UI screens, suggesting a focused and tech-driven atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDMib2aYxPF1SDHc84FBVpgnJDtedYuJWN2mikJEzlcBrVs9o017gVTbBj6e4DANhKEk0iq21nD9te1nBnE8NJ3n10_Y0SB5HVbGTZ_yMa8yFH2ABbC4NvrgcYRUMfO02n-Cf_DY0ClqxH8ZD2i0PwStaMXrl_X8sNQ-dASF393CwbxDsObKjUL_IvSl8K2U8EB_m6ohTT_tEbeClHvfjWSA2EE-fPqTfUEkqJK_m6NUv_0NzvTnGqlPTvATOW1Zr6gjiyYwPAvRbo" />
</div>
<div className="absolute bottom-1 right-1 w-6 h-6 bg-green-500 border-2 border-surface rounded-full"></div>
</div>
<div className="space-y-xs">
<h1 className="text-display-lg font-display-lg text-on-surface leading-none">Rahul Sharma</h1>
<div className="flex flex-wrap items-center gap-sm">
<span className="font-label-md px-sm py-xs bg-primary-container text-on-primary-container rounded-lg uppercase tracking-wider">Senior Associate</span>
<span className="font-label-md px-sm py-xs border border-error text-error rounded-lg">Probation: Week 4/6</span>
<span className="font-body-sm text-on-surface-variant flex items-center gap-xs">
<span className="material-symbols-outlined text-[16px]">location_on</span> Hub: Mumbai North
                                </span>
</div>
</div>
</div>
<div className="flex gap-sm">
<div className="text-right">
<p className="font-label-md text-on-surface-variant">Shift Progress</p>
<div className="w-40 h-2 bg-surface-container-highest rounded-full mt-1 overflow-hidden">
<div className="bg-primary-container h-full w-[65%]"></div>
</div>
<p className="font-mono-data text-xs mt-1 text-primary">5h 12m / 8h 00m</p>
</div>
</div>
</section>

<nav className="flex gap-lg border-b border-outline-variant overflow-x-auto whitespace-nowrap">
<button className="pb-md font-label-md tab-active transition-all">Overview</button>
<button className="pb-md font-label-md text-on-surface-variant hover:text-primary transition-all">Call History</button>
<button className="pb-md font-label-md text-on-surface-variant hover:text-primary transition-all">Queue Live</button>
<button className="pb-md font-label-md text-on-surface-variant hover:text-primary transition-all">QC Feedback</button>
<button className="pb-md font-label-md text-on-surface-variant hover:text-primary transition-all">Attendance</button>
</nav>

<div className="grid grid-cols-12 gap-lg">

<div className="col-span-12 md:col-span-4 lg:col-span-3 p-lg bg-surface border border-outline-variant rounded-lg space-y-sm">
<p className="font-label-md text-on-surface-variant flex items-center justify-between">
                            Daily Target <span className="material-symbols-outlined text-[16px]">trending_up</span>
</p>
<h3 className="text-display-lg font-display-lg text-primary">142/160</h3>
<p className="font-body-sm text-on-surface-variant">88.7% Achievement</p>
</div>
<div className="col-span-12 md:col-span-4 lg:col-span-3 p-lg bg-surface border border-outline-variant rounded-lg space-y-sm">
<p className="font-label-md text-on-surface-variant flex items-center justify-between">
                            Avg Handle Time <span className="material-symbols-outlined text-[16px]">timer</span>
</p>
<h3 className="text-display-lg font-display-lg text-on-surface">3:42 <span className="text-body-lg text-error">(-12s)</span></h3>
<p className="font-body-sm text-on-surface-variant">SLA Baseline: 4:00</p>
</div>
<div className="col-span-12 md:col-span-4 lg:col-span-3 p-lg bg-surface border border-outline-variant rounded-lg space-y-sm">
<p className="font-label-md text-on-surface-variant flex items-center justify-between">
                            QC Accuracy <span className="material-symbols-outlined text-[16px]">verified</span>
</p>
<h3 className="text-display-lg font-display-lg text-on-surface">92%</h3>
<p className="font-body-sm text-on-surface-variant">Last 30 calls audited</p>
</div>
<div className="col-span-12 md:col-span-12 lg:col-span-3 p-lg bg-surface border border-outline-variant rounded-lg space-y-sm">
<p className="font-label-md text-on-surface-variant flex items-center justify-between">
                            Conversion <span className="material-symbols-outlined text-[16px]">handshake</span>
</p>
<h3 className="text-display-lg font-display-lg text-primary">12.4%</h3>
<p className="font-body-sm text-on-surface-variant">Top 5% of Team Alpha</p>
</div>

<div className="col-span-12 lg:col-span-8 p-lg bg-surface border border-outline-variant rounded-lg">
<div className="flex justify-between items-center mb-lg">
<h4 className="font-headline-sm text-on-surface">Hourly Performance</h4>
<select className="bg-transparent border-none font-label-md text-primary cursor-pointer focus:ring-0">
<option>Last 24 Hours</option>
<option>Last 7 Days</option>
</select>
</div>
<div className="flex items-end justify-between h-48 gap-xs">
<div className="flex flex-col items-center flex-1 group">
<div className="bg-primary-container/20 w-full rounded-t-sm relative h-[40%] group-hover:bg-primary-container transition-colors">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono-data opacity-0 group-hover:opacity-100">12</div>
</div>
<span className="text-[10px] font-mono-data mt-2 text-on-surface-variant">08:00</span>
</div>
<div className="flex flex-col items-center flex-1 group">
<div className="bg-primary-container/20 w-full rounded-t-sm relative h-[65%] group-hover:bg-primary-container transition-colors">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono-data opacity-0 group-hover:opacity-100">18</div>
</div>
<span className="text-[10px] font-mono-data mt-2 text-on-surface-variant">10:00</span>
</div>
<div className="flex flex-col items-center flex-1 group">
<div className="bg-primary-container w-full rounded-t-sm relative h-[90%]">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono-data">24</div>
</div>
<span className="text-[10px] font-mono-data mt-2 text-on-surface-variant">12:00</span>
</div>
<div className="flex flex-col items-center flex-1 group">
<div className="bg-primary-container/20 w-full rounded-t-sm relative h-[80%] group-hover:bg-primary-container transition-colors">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono-data opacity-0 group-hover:opacity-100">21</div>
</div>
<span className="text-[10px] font-mono-data mt-2 text-on-surface-variant">14:00</span>
</div>
<div className="flex flex-col items-center flex-1 group">
<div className="bg-primary-container/20 w-full rounded-t-sm relative h-[55%] group-hover:bg-primary-container transition-colors">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono-data opacity-0 group-hover:opacity-100">15</div>
</div>
<span className="text-[10px] font-mono-data mt-2 text-on-surface-variant">16:00</span>
</div>
<div className="flex flex-col items-center flex-1 group">
<div className="bg-primary-container/20 w-full rounded-t-sm relative h-[70%] group-hover:bg-primary-container transition-colors">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono-data opacity-0 group-hover:opacity-100">19</div>
</div>
<span className="text-[10px] font-mono-data mt-2 text-on-surface-variant">18:00</span>
</div>
<div className="flex flex-col items-center flex-1 group">
<div className="bg-primary-container/20 w-full rounded-t-sm relative h-[30%] group-hover:bg-primary-container transition-colors">
<div className="absolute -top-6 left-1/2 -translate-x-1/2 text-[10px] font-mono-data opacity-0 group-hover:opacity-100">8</div>
</div>
<span className="text-[10px] font-mono-data mt-2 text-on-surface-variant">20:00</span>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-4 p-lg bg-surface border border-outline-variant rounded-lg flex flex-col">
<h4 className="font-headline-sm text-on-surface mb-lg">Active Queue</h4>
<div className="space-y-md flex-1">
<div className="flex items-center justify-between p-sm hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer border-b border-outline-variant last:border-none">
<div className="flex flex-col">
<span className="font-label-md text-on-surface">Ticket #ORD-9821</span>
<span className="text-[10px] text-on-surface-variant">High Priority Delivery Delay</span>
</div>
<span className="material-symbols-outlined text-primary">arrow_forward_ios</span>
</div>
<div className="flex items-center justify-between p-sm hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer border-b border-outline-variant last:border-none">
<div className="flex flex-col">
<span className="font-label-md text-on-surface">Ticket #RET-1209</span>
<span className="text-[10px] text-on-surface-variant">Reverse Logistics Pickup</span>
</div>
<span className="material-symbols-outlined text-primary">arrow_forward_ios</span>
</div>
<div className="flex items-center justify-between p-sm hover:bg-surface-container-low rounded-lg transition-colors cursor-pointer border-b border-outline-variant last:border-none">
<div className="flex flex-col">
<span className="font-label-md text-on-surface">Ticket #PAY-4432</span>
<span className="text-[10px] text-on-surface-variant">COD Discrepancy</span>
</div>
<span className="material-symbols-outlined text-primary">arrow_forward_ios</span>
</div>
</div>
<button className="mt-md text-primary font-label-md flex items-center gap-xs hover:underline">
                            View all 14 pending <span className="material-symbols-outlined text-[16px]">open_in_new</span>
</button>
</div>

<div className="col-span-12 p-lg bg-surface border border-outline-variant rounded-lg">
<div className="flex justify-between items-center mb-lg">
<h4 className="font-headline-sm text-on-surface">Attendance &amp; Punctuality</h4>
<div className="flex gap-md items-center">
<div className="flex items-center gap-xs">
<div className="w-3 h-3 bg-green-500 rounded-sm"></div> <span className="text-[10px] text-on-surface-variant">Present</span>
</div>
<div className="flex items-center gap-xs">
<div className="w-3 h-3 bg-primary-container rounded-sm"></div> <span className="text-[10px] text-on-surface-variant">Late</span>
</div>
<div className="flex items-center gap-xs">
<div className="w-3 h-3 bg-error rounded-sm"></div> <span className="text-[10px] text-on-surface-variant">Absent</span>
</div>
</div>
</div>
<div className="flex flex-wrap gap-xs">

<div className="w-8 h-8 bg-green-500/80 rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">1</div>
<div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">2</div>
<div className="w-8 h-8 bg-primary-container rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">3</div>
<div className="w-8 h-8 bg-green-500/80 rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">4</div>
<div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">5</div>
<div className="w-8 h-8 bg-surface-container-highest rounded-sm flex items-center justify-center text-[10px] font-mono-data text-on-surface-variant">6</div>
<div className="w-8 h-8 bg-surface-container-highest rounded-sm flex items-center justify-center text-[10px] font-mono-data text-on-surface-variant">7</div>
<div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">8</div>
<div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">9</div>
<div className="w-8 h-8 bg-error rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">10</div>
<div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">11</div>
<div className="w-8 h-8 bg-primary-container rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">12</div>
<div className="w-8 h-8 bg-surface-container-highest rounded-sm flex items-center justify-center text-[10px] font-mono-data text-on-surface-variant">13</div>
<div className="w-8 h-8 bg-surface-container-highest rounded-sm flex items-center justify-center text-[10px] font-mono-data text-on-surface-variant">14</div>
<div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">15</div>
<div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">16</div>
<div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">17</div>
<div className="w-8 h-8 bg-green-500 rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">18</div>
<div className="w-8 h-8 bg-green-500/80 rounded-sm flex items-center justify-center text-[10px] font-mono-data text-white heat-map-cell cursor-pointer">19</div>
<div className="w-8 h-8 bg-surface-container-highest rounded-sm flex items-center justify-center text-[10px] font-mono-data text-on-surface-variant">20</div>
<div className="w-8 h-8 bg-surface-container-highest rounded-sm flex items-center justify-center text-[10px] font-mono-data text-on-surface-variant">21</div>
<div className="w-8 h-8 bg-primary-container/20 border border-primary border-dashed rounded-sm flex items-center justify-center text-[10px] font-mono-data text-primary">22</div>
</div>
</div>
</div>
</div>

<aside className="hidden xl:flex flex-col w-72 border-l border-outline-variant p-lg space-y-lg bg-surface-container-lowest">
<h3 className="font-headline-sm text-on-surface">Profile Actions</h3>
<div className="space-y-md">
<button className="w-full flex items-center gap-sm p-md bg-surface border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors group">
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">move_down</span>
<div className="text-left">
<p className="font-label-md text-on-surface leading-none">Reassign all</p>
<p className="text-[10px] text-on-surface-variant">Transfer active queue</p>
</div>
</button>
<button className="w-full flex items-center gap-sm p-md bg-surface border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors group">
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">mail</span>
<div className="text-left">
<p className="font-label-md text-on-surface leading-none">Send message</p>
<p className="text-[10px] text-on-surface-variant">Instant internal ping</p>
</div>
</button>
<button className="w-full flex items-center gap-sm p-md bg-surface border border-outline-variant rounded-lg hover:bg-surface-container-high transition-colors group">
<span className="material-symbols-outlined text-on-surface-variant group-hover:text-primary">school</span>
<div className="text-left">
<p className="font-label-md text-on-surface leading-none">Assign training</p>
<p className="text-[10px] text-on-surface-variant">Soft skills or Logistics 101</p>
</div>
</button>
<button className="w-full flex items-center gap-sm p-md bg-surface border border-outline-variant rounded-lg hover:bg-error transition-colors group">
<span className="material-symbols-outlined text-error group-hover:text-white">flag</span>
<div className="text-left">
<p className="font-label-md text-on-surface group-hover:text-white leading-none">Flag for review</p>
<p className="text-[10px] text-on-surface-variant group-hover:text-white/80">Submit to HR/Admin</p>
</div>
</button>
</div>
<div className="pt-lg border-t border-outline-variant">
<h4 className="font-label-md text-on-surface-variant mb-md">Last Performance Audit</h4>
<div className="p-md bg-surface-container-lowest rounded-lg border border-outline-variant">
<div className="flex justify-between items-center mb-xs">
<span className="font-label-md text-primary">Score: 8.5/10</span>
<span className="text-[10px] text-on-surface-variant">2 days ago</span>
</div>
<p className="font-body-sm text-on-surface italic">"Great tone on escalations, needs faster note documenting between calls."</p>
</div>
</div>
<div className="mt-auto space-y-sm">
<p className="font-label-md text-on-surface-variant text-center">System Status: Active</p>
<div className="flex justify-center gap-xs">
<div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
<div className="w-2 h-2 rounded-full bg-green-500 opacity-50"></div>
<div className="w-2 h-2 rounded-full bg-green-500 opacity-20"></div>
</div>
</div>
</aside>
</div>
</main>
  );
};

export default TlCallerProfileDetail;
