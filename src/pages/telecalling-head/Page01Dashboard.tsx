import React from 'react';

export const Page01Dashboard: React.FC = () => {
  return (
    <main className=" bg-background p-md space-y-md">

<section className="bg-surface p-md rounded-sm border border-outline-variant flipkart-shadow">
<div className="flex justify-between items-end mb-sm">
<div>
<h2 className="font-label-caps text-label-caps text-outline uppercase tracking-wider">This Month's Revenue Target</h2>
<div className="flex items-baseline gap-sm mt-xs">
<span className="text-2xl font-extrabold text-primary">₹6,42,800</span>
<span className="text-outline text-sm font-medium">/ ₹8,00,000</span>
</div>
</div>
<div className="flex gap-md text-[11px] font-bold">
<div className="flex items-center gap-xs"><span className="w-3 h-3 bg-green-500 rounded-[2px]"></span> DW (24%)</div>
<div className="flex items-center gap-xs"><span className="w-3 h-3 bg-orange-500 rounded-[2px]"></span> TR (32%)</div>
<div className="flex items-center gap-xs"><span className="w-3 h-3 bg-teal-500 rounded-[2px]"></span> SC (12%)</div>
<div className="flex items-center gap-xs"><span className="w-3 h-3 bg-amber-500 rounded-[2px]"></span> MM (12%)</div>
</div>
</div>
<div className="h-4 w-full bg-surface-container-low rounded-full overflow-hidden flex">
<div className="h-full bg-green-500 transition-all duration-1000" style={{"width": "24%"}}></div>
<div className="h-full bg-orange-500 transition-all duration-1000" style={{"width": "32%"}}></div>
<div className="h-full bg-teal-500 transition-all duration-1000" style={{"width": "12%"}}></div>
<div className="h-full bg-amber-500 transition-all duration-1000" style={{"width": "12%"}}></div>
</div>
</section>
<div className="grid grid-cols-12 gap-md">

<div className="col-span-8 space-y-md">

<div className="grid grid-cols-4 gap-md">

<div className="bg-surface p-md border border-outline-variant flipkart-shadow hover:border-primary transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-sm">
<span className="font-label-caps text-label-caps text-outline">Driver Welcome</span>
<div className="w-2 h-2 rounded-full bg-green-500" title="SLA Optimal"></div>
</div>
<p className="text-sm font-extrabold mb-xs">₹1,92,000 / 2L</p>
<div className="space-y-1">
<div className="flex justify-between text-[11px]">
<span className="text-outline">Calls Today</span>
<span className="font-bold">142</span>
</div>
<div className="flex justify-between text-[11px]">
<span className="text-outline">Conv %</span>
<span className="text-green-600 font-bold">14.2%</span>
</div>
</div>
</div>

<div className="bg-surface p-md border border-outline-variant flipkart-shadow hover:border-primary transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-sm">
<span className="font-label-caps text-label-caps text-outline">Transporter</span>
<div className="w-2 h-2 rounded-full bg-green-500"></div>
</div>
<p className="text-sm font-extrabold mb-xs">₹2,56,000 / 3L</p>
<div className="space-y-1">
<div className="flex justify-between text-[11px]">
<span className="text-outline">Calls Today</span>
<span className="font-bold">208</span>
</div>
<div className="flex justify-between text-[11px]">
<span className="text-outline">Conv %</span>
<span className="text-green-600 font-bold">18.5%</span>
</div>
</div>
</div>

<div className="bg-surface p-md border border-outline-variant flipkart-shadow hover:border-primary transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-sm">
<span className="font-label-caps text-label-caps text-outline">Spec. Cat.</span>
<div className="w-2 h-2 rounded-full bg-amber-500" title="SLA Warning"></div>
</div>
<p className="text-sm font-extrabold mb-xs">₹96,000 / 1.5L</p>
<div className="space-y-1">
<div className="flex justify-between text-[11px]">
<span className="text-outline">Calls Today</span>
<span className="font-bold">84</span>
</div>
<div className="flex justify-between text-[11px]">
<span className="text-outline">Conv %</span>
<span className="text-amber-600 font-bold">9.2%</span>
</div>
</div>
</div>

<div className="bg-surface p-md border border-outline-variant flipkart-shadow hover:border-primary transition-colors cursor-pointer group">
<div className="flex justify-between items-start mb-sm">
<span className="font-label-caps text-label-caps text-outline">Matchmaking</span>
<div className="w-2 h-2 rounded-full bg-green-500"></div>
</div>
<p className="text-sm font-extrabold mb-xs">₹98,800 / 1.5L</p>
<div className="space-y-1">
<div className="flex justify-between text-[11px]">
<span className="text-outline">Calls Today</span>
<span className="font-bold">116</span>
</div>
<div className="flex justify-between text-[11px]">
<span className="text-outline">Conv %</span>
<span className="text-green-600 font-bold">12.1%</span>
</div>
</div>
</div>
</div>
<div className="grid grid-cols-2 gap-md">

<div className="bg-surface p-md border border-outline-variant flipkart-shadow">
<div className="flex justify-between items-center mb-md">
<h3 className="font-label-caps text-label-caps text-outline uppercase font-bold">Daily Revenue Trend</h3>
<span className="text-[10px] text-outline">7D Trend</span>
</div>
<div className="relative h-40 flex items-end justify-between px-sm pb-xs border-b border-l border-outline-variant">

<div className="absolute top-1/4 left-0 w-full border-t border-dashed border-primary/40 z-0"></div>

<div className="group relative w-6 bg-primary-container h-[60%] transition-all hover:bg-primary cursor-help">
<span className="absolute -top-6 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-inverse-surface text-white text-[10px] px-1 rounded transition-all">₹42k</span>
</div>
<div className="group relative w-6 bg-primary-container h-[85%] transition-all hover:bg-primary"></div>
<div className="group relative w-6 bg-primary-container h-[70%] transition-all hover:bg-primary"></div>
<div className="group relative w-6 bg-primary-container h-[95%] transition-all hover:bg-primary"></div>
<div className="group relative w-6 bg-primary-container h-[40%] transition-all hover:bg-primary"></div>
<div className="group relative w-6 bg-primary-container h-[75%] transition-all hover:bg-primary"></div>
<div className="group relative w-6 bg-primary h-[82%] transition-all"></div>
</div>
<div className="flex justify-between mt-sm text-[10px] text-outline uppercase px-sm">
<span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
</div>
</div>

<div className="bg-surface border border-outline-variant flipkart-shadow flex flex-col h-[230px]">
<div className="px-md py-sm border-b border-outline-variant flex justify-between items-center">
<h3 className="font-label-caps text-label-caps text-outline uppercase font-bold">Live Conversion Feed</h3>
<span className="material-symbols-outlined text-green-500 text-sm animate-pulse" data-icon="sensors">sensors</span>
</div>
<div className="flex-1 overflow-hidden relative">
<div className="ticker-row p-md space-y-sm">

<div className="flex items-center gap-sm bg-surface-container-low p-2 rounded-sm border-l-2 border-primary">
<span className="material-symbols-outlined text-primary text-sm" data-icon="check_circle">check_circle</span>
<p className="text-[12px]"><strong className="font-bold">Rahul K.</strong> converted <span className="text-primary font-bold">Premium Plan</span> <span className="text-outline">₹1,500</span> — 2 min ago</p>
</div>
<div className="flex items-center gap-sm bg-surface-container-low p-2 rounded-sm border-l-2 border-primary">
<span className="material-symbols-outlined text-primary text-sm" data-icon="check_circle">check_circle</span>
<p className="text-[12px]"><strong className="font-bold">Sneha S.</strong> converted <span className="text-primary font-bold">Standard TR</span> <span className="text-outline">₹850</span> — 5 min ago</p>
</div>
<div className="flex items-center gap-sm bg-surface-container-low p-2 rounded-sm border-l-2 border-primary">
<span className="material-symbols-outlined text-primary text-sm" data-icon="check_circle">check_circle</span>
<p className="text-[12px]"><strong className="font-bold">Amit V.</strong> converted <span className="text-primary font-bold">Special SC</span> <span className="text-outline">₹2,200</span> — 8 min ago</p>
</div>
<div className="flex items-center gap-sm bg-surface-container-low p-2 rounded-sm border-l-2 border-primary">
<span className="material-symbols-outlined text-primary text-sm" data-icon="check_circle">check_circle</span>
<p className="text-[12px]"><strong className="font-bold">Priya M.</strong> converted <span className="text-primary font-bold">Trial Pack</span> <span className="text-outline">₹200</span> — 12 min ago</p>
</div>

<div className="flex items-center gap-sm bg-surface-container-low p-2 rounded-sm border-l-2 border-primary">
<span className="material-symbols-outlined text-primary text-sm" data-icon="check_circle">check_circle</span>
<p className="text-[12px]"><strong className="font-bold">Rahul K.</strong> converted <span className="text-primary font-bold">Premium Plan</span> <span className="text-outline">₹1,500</span> — 14 min ago</p>
</div>
</div>
</div>
</div>
</div>
</div>

<div className="col-span-4 space-y-md">

<div className="bg-surface border border-outline-variant flipkart-shadow overflow-hidden flex flex-col h-[400px]">
<div className="bg-error px-md py-sm flex justify-between items-center">
<div className="flex items-center gap-sm text-white">
<span className="material-symbols-outlined text-sm" data-icon="warning">warning</span>
<h3 className="font-label-caps text-label-caps uppercase font-bold">SLA Risk (12 Alerts)</h3>
</div>
<button className="text-white text-[10px] font-bold underline">View All</button>
</div>
<div className="flex-1 overflow-y-auto custom-scrollbar">
<table className="w-full text-left border-collapse">
<thead className="sticky top-0 bg-surface-container-low text-[11px] font-bold text-outline uppercase">
<tr>
<th className="px-sm py-2">Job ID</th>
<th className="px-sm py-2">Transporter</th>
<th className="px-sm py-2">Due</th>
<th className="px-sm py-2">Action</th>
</tr>
</thead>
<tbody className="text-[12px]">

<tr className="border-b border-outline-variant bg-error/5 hover:bg-error/10 transition-colors">
<td className="px-sm py-3 font-data-mono">#J821</td>
<td className="px-sm py-3">Balaji Logistics</td>
<td className="px-sm py-3"><span className="text-error font-bold">0.4d Left</span></td>
<td className="px-sm py-3">
<button className="bg-error text-white px-2 py-1 rounded-sm text-[10px] font-bold uppercase">Escalate</button>
</td>
</tr>

<tr className="border-b border-outline-variant bg-orange-50 hover:bg-orange-100 transition-colors">
<td className="px-sm py-3 font-data-mono">#J944</td>
<td className="px-sm py-3">Vikas Carriers</td>
<td className="px-sm py-3"><span className="text-orange-600 font-bold">1.2d Left</span></td>
<td className="px-sm py-3">
<button className="border border-orange-600 text-orange-600 px-2 py-1 rounded-sm text-[10px] font-bold uppercase">Remind</button>
</td>
</tr>

<tr className="border-b border-outline-variant bg-amber-50 hover:bg-amber-100 transition-colors">
<td className="px-sm py-3 font-data-mono">#J102</td>
<td className="px-sm py-3">Swift Movers</td>
<td className="px-sm py-3"><span className="text-amber-600 font-bold">2.8d Left</span></td>
<td className="px-sm py-3">
<button className="border border-outline-variant text-outline px-2 py-1 rounded-sm text-[10px] font-bold uppercase">Notify</button>
</td>
</tr>

<tr className="border-b border-outline-variant">
<td className="px-sm py-3 font-data-mono">#J115</td>
<td className="px-sm py-3">Gati Express</td>
<td className="px-sm py-3">3.5d</td>
<td className="px-sm py-3">---</td>
</tr>
<tr className="border-b border-outline-variant">
<td className="px-sm py-3 font-data-mono">#J128</td>
<td className="px-sm py-3">Agarwal Roadlines</td>
<td className="px-sm py-3">4.1d</td>
<td className="px-sm py-3">---</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="bg-surface p-md border border-outline-variant flipkart-shadow">
<div className="flex justify-between items-center mb-md">
<h3 className="font-label-caps text-label-caps text-outline uppercase font-bold">Team Pulse</h3>
<div className="flex gap-sm text-[9px] font-bold">
<span className="flex items-center gap-xs"><span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span> 14</span>
<span className="flex items-center gap-xs"><span className="w-1.5 h-1.5 bg-yellow-500 rounded-full"></span> 2</span>
<span className="flex items-center gap-xs"><span className="w-1.5 h-1.5 bg-red-500 rounded-full"></span> 4</span>
</div>
</div>
<div className="grid grid-cols-5 gap-sm">

<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold group cursor-pointer">
                            RK
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
</div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold group cursor-pointer">
                            SM
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
</div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold group cursor-pointer">
                            AV
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-yellow-500 border border-white rounded-full"></span>
</div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold group cursor-pointer">
                            PS
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-red-500 border border-white rounded-full"></span>
</div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold group cursor-pointer">
                            NK
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-400 border border-white rounded-full"></span>
</div>

<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">
                            TD <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
</div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">
                            MJ <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
</div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">
                            LK <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
</div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">
                            BB <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-yellow-500 border border-white rounded-full"></span>
</div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">
                            OP <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span>
</div>

<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">AS <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span></div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">GK <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-red-500 border border-white rounded-full"></span></div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">HS <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span></div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">RE <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-gray-400 border border-white rounded-full"></span></div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">QW <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span></div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">MN <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span></div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">BV <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span></div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">XZ <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-red-500 border border-white rounded-full"></span></div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">YU <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span></div>
<div className="relative w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-[11px] font-bold">KI <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border border-white rounded-full"></span></div>
</div>
<button className="w-full mt-md py-2 border border-outline-variant text-[11px] font-bold uppercase hover:bg-surface-container-low transition-colors">Broadcast Message to Team</button>
</div>
</div>
</div>
</main>
  );
};

export default Page01Dashboard;
