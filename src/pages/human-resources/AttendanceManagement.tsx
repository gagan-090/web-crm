import React from 'react';

export const AttendanceManagement: React.FC = () => {
  return (
    <main className=" p-margin-page">

<div className="flex justify-between items-end mb-8">
<div>
<h2 className="font-headline-lg text-headline-lg text-primary">Attendance Management</h2>
<p className="text-body-md text-on-surface-variant">Real-time presence monitoring &amp; compliance tracking</p>
</div>
<div className="flex gap-2">
<button className="px-4 py-2 bg-surface-container-lowest border border-outline-variant text-label-md rounded flex items-center gap-2 hover:bg-surface-container-high transition-colors">
<span className="material-symbols-outlined text-[18px]">calendar_month</span>
                    October 2023
                </button>
<button className="px-4 py-2 bg-primary text-on-primary text-label-md rounded font-bold hover:bg-primary-container transition-colors">
                    Export Monthly Report
                </button>
</div>
</div>
<div className="grid grid-cols-12 gap-gutter">

<div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant rounded p-4">
<div className="flex justify-between items-center mb-4">
<h3 className="font-title-sm text-title-sm text-primary">Team Presence Heatmap</h3>
<span className="text-label-md text-on-surface-variant">Avg: 88.4%</span>
</div>
<div className="calendar-grid mb-4">

<div className="text-center text-[10px] font-bold text-on-surface-variant">M</div>
<div className="text-center text-[10px] font-bold text-on-surface-variant">T</div>
<div className="text-center text-[10px] font-bold text-on-surface-variant">W</div>
<div className="text-center text-[10px] font-bold text-on-surface-variant">T</div>
<div className="text-center text-[10px] font-bold text-on-surface-variant">F</div>
<div className="text-center text-[10px] font-bold text-on-surface-variant">S</div>
<div className="text-center text-[10px] font-bold text-on-surface-variant">S</div>

<div className="heatmap-cell bg-surface-container-high text-on-surface-variant">1</div>
<div className="heatmap-cell bg-surface-container-high text-on-surface-variant">2</div>
<div className="heatmap-cell bg-tertiary-container/30 text-tertiary-container">3</div>
<div className="heatmap-cell bg-tertiary-container/80 text-white">4</div>
<div className="heatmap-cell bg-tertiary-container text-white">5</div>
<div className="heatmap-cell bg-surface-container-high text-on-surface-variant">6</div>
<div className="heatmap-cell bg-surface-container-high text-on-surface-variant">7</div>
<div className="heatmap-cell bg-tertiary-container/60 text-white">8</div>
<div className="heatmap-cell bg-secondary-container text-white">9</div>
<div className="heatmap-cell bg-tertiary-container text-white">10</div>
<div className="heatmap-cell bg-error/70 text-white">11</div>
<div className="heatmap-cell bg-tertiary-container text-white">12</div>
<div className="heatmap-cell bg-surface-container-high text-on-surface-variant">13</div>
<div className="heatmap-cell bg-surface-container-high text-on-surface-variant">14</div>
<div className="heatmap-cell bg-tertiary-container/90 text-white">15</div>
<div className="heatmap-cell bg-tertiary-container text-white">16</div>
<div className="heatmap-cell bg-tertiary-container text-white">17</div>
<div className="heatmap-cell bg-secondary-container/80 text-white">18</div>
<div className="heatmap-cell bg-tertiary-container text-white">19</div>
<div className="heatmap-cell bg-surface-container-high text-on-surface-variant">20</div>
<div className="heatmap-cell bg-surface-container-high text-on-surface-variant">21</div>
<div className="heatmap-cell bg-tertiary-container text-white ring-2 ring-primary ring-inset">22</div>
<div className="heatmap-cell bg-tertiary-container text-white">23</div>
<div className="heatmap-cell bg-tertiary-container text-white">24</div>
<div className="heatmap-cell bg-tertiary-container text-white">25</div>
<div className="heatmap-cell bg-tertiary-container text-white">26</div>
<div className="heatmap-cell bg-surface-container-high text-on-surface-variant">27</div>
<div className="heatmap-cell bg-surface-container-high text-on-surface-variant">28</div>
</div>
<div className="flex items-center gap-4 pt-4 border-t border-outline-variant">
<div className="flex items-center gap-1.5">
<div className="w-3 h-3 bg-tertiary-container"></div>
<span className="text-[10px] text-on-surface-variant">&gt;90%</span>
</div>
<div className="flex items-center gap-1.5">
<div className="w-3 h-3 bg-secondary-container"></div>
<span className="text-[10px] text-on-surface-variant">70-90%</span>
</div>
<div className="flex items-center gap-1.5">
<div className="w-3 h-3 bg-error"></div>
<span className="text-[10px] text-on-surface-variant">&lt;70%</span>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-8 bg-surface-container-lowest border border-outline-variant rounded flex flex-col">
<div className="p-4 border-b border-outline-variant flex justify-between items-center">
<h3 className="font-title-sm text-title-sm text-primary">Caller Presence Logs</h3>
<div className="flex gap-2">
<button className="text-primary text-label-md font-bold flex items-center gap-1">
<span className="material-symbols-outlined text-[16px]">filter_list</span> Filter Team
                        </button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-surface-container-low border-b border-outline-variant">
<tr>
<th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase">Employee</th>
<th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase">Role</th>
<th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase text-center">Present</th>
<th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase text-center">Absent</th>
<th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase text-center">Late</th>
<th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase text-center">Leaves Bal.</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container transition-colors">
<td className="px-density-table-px py-density-table-py flex items-center gap-3">
<div className="w-7 h-7 rounded-full bg-primary-container text-white flex items-center justify-center text-[10px] font-bold">AK</div>
<span className="text-body-sm font-semibold">Amit Kumar</span>
</td>
<td className="px-density-table-px py-density-table-py text-body-sm">Sr. Dispatcher</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center font-bold text-tertiary-container">21</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center">0</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center">1</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center font-data-mono">14.5</td>
</tr>
<tr className="hover:bg-surface-container transition-colors">
<td className="px-density-table-px py-density-table-py flex items-center gap-3">
<div className="w-7 h-7 rounded-full bg-secondary-container text-white flex items-center justify-center text-[10px] font-bold">SS</div>
<span className="text-body-sm font-semibold text-primary">Sonam Singh</span>
</td>
<td className="px-density-table-px py-density-table-py text-body-sm">Outbound Sales</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center font-bold text-tertiary-container">19</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center">2</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center">0</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center font-data-mono">8.0</td>
</tr>
<tr className="hover:bg-surface-container transition-colors">
<td className="px-density-table-px py-density-table-py flex items-center gap-3">
<div className="w-7 h-7 rounded-full bg-primary text-white flex items-center justify-center text-[10px] font-bold">RP</div>
<span className="text-body-sm font-semibold">Rahul Prasad</span>
</td>
<td className="px-density-table-px py-density-table-py text-body-sm">LTL Specialist</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center font-bold text-tertiary-container">22</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center">0</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center">0</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center font-data-mono">12.0</td>
</tr>
<tr className="hover:bg-surface-container transition-colors">
<td className="px-density-table-px py-density-table-py flex items-center gap-3">
<div className="w-7 h-7 rounded-full bg-on-surface-variant text-white flex items-center justify-center text-[10px] font-bold">VJ</div>
<span className="text-body-sm font-semibold">Vikas Joshi</span>
</td>
<td className="px-density-table-px py-density-table-py text-body-sm">Lead Coordinator</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center font-bold text-tertiary-container">18</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center text-error font-bold">4</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center">3</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-center font-data-mono">2.0</td>
</tr>
</tbody>
</table>
</div>
<div className="mt-auto p-3 border-t border-outline-variant bg-surface-container-low flex justify-end">
<button className="text-label-md font-bold text-primary hover:underline">View All 42 Callers</button>
</div>
</div>

<div className="col-span-12 lg:col-span-5 bg-surface-container-lowest border border-outline-variant rounded p-5 relative overflow-hidden">
<div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 -mr-16 -mt-16 rounded-full"></div>
<div className="flex items-start justify-between mb-6 relative">
<div className="flex items-center gap-4">
<div className="relative">
<img className="w-14 h-14 rounded-full border-2 border-primary object-cover" data-alt="A detailed portrait of a female office worker in her late 20s, with a professional and focused demeanor. She is working from a bright home office with a minimalist desk and a single plant in the background. She is wearing a soft grey sweater and a modern headset. The lighting is natural and crisp, maintaining a clean corporate aesthetic with Navy and White tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCK3slS8A1XGt_4OfrjI335QKk4rOKOxgu3ND1vcn3b8qj5jFnthnJWZ87PUnrdt6M2Z-zrEnZcDuC16QdKm2dFOnGIWZW78c_ZgN2LjD2r76ShegsZPp2B2MpYPFKIyKxRqXR5pXqYfs7UgLfxcbtgtncnzNx1qmtJehbwhfqEHGJ_ECN8fvemX3HaxOIY0argCBF--UUvOSQbhc7R7JvuzpT4Ztc4RnnizXZoXw23mlul_KgjXfu8ggj34K7F0HSvJPIuHf3UH5E"/>
<div className="absolute bottom-0 right-0 w-4 h-4 bg-tertiary-container rounded-full border-2 border-white"></div>
</div>
<div>
<h4 className="font-title-sm text-title-sm text-primary">Sonam Singh</h4>
<span className="text-label-md px-2 py-0.5 bg-secondary-container/10 text-secondary border border-secondary-container/20 rounded">Work From Home</span>
</div>
</div>
<div className="text-right">
<span className="text-[10px] uppercase font-bold text-on-surface-variant block">Compliance</span>
<span className="text-label-md font-bold text-tertiary-container">100% Compliant</span>
</div>
</div>
<div className="grid grid-cols-2 gap-4 mb-6">
<div className="bg-surface-container-low p-3 rounded">
<p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Availability Window</p>
<p className="text-body-sm font-bold text-primary">09:30 AM – 01:30 PM</p>
<p className="text-body-sm font-bold text-primary">03:00 PM – 05:30 PM</p>
</div>
<div className="bg-surface-container-low p-3 rounded">
<p className="text-[10px] uppercase font-bold text-on-surface-variant mb-1">Today's Stats</p>
<div className="flex flex-col gap-1">
<div className="flex justify-between items-center">
<span className="text-body-sm">Login:</span>
<span className="text-body-sm font-data-mono font-bold">09:28 AM</span>
</div>
<div className="flex justify-between items-center">
<span className="text-body-sm">CRM Activity:</span>
<span className="text-body-sm font-data-mono font-bold">8 Calls</span>
</div>
</div>
</div>
</div>
<div className="space-y-3">
<div className="flex justify-between text-label-md">
<span className="text-on-surface-variant">Session Progress</span>
<span className="font-bold text-primary">4.5 / 6.5 Hours</span>
</div>
<div className="w-full bg-outline-variant h-1.5 rounded-full overflow-hidden">
<div className="bg-primary h-full" style={{"width": "70%"}}></div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-7 bg-surface-container-lowest border border-outline-variant rounded">
<div className="p-4 border-b border-outline-variant">
<h3 className="font-title-sm text-title-sm text-primary">Pending Leave Requests</h3>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left">
<thead className="bg-surface-container-low border-b border-outline-variant">
<tr>
<th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase">Employee</th>
<th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase">Period</th>
<th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase">Reason</th>
<th className="px-density-table-px py-density-table-py text-label-md text-on-surface-variant uppercase text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr>
<td className="px-density-table-px py-density-table-py">
<p className="text-body-sm font-bold text-primary">Priya Sharma</p>
<p className="text-[10px] text-on-surface-variant">Accountant</p>
</td>
<td className="px-density-table-px py-density-table-py text-body-sm">
                                    Oct 24 - Oct 25 <br/>
<span className="text-[10px] font-bold text-on-surface-variant">(2 Days)</span>
</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-on-surface-variant italic">Family function in hometown.</td>
<td className="px-density-table-px py-density-table-py text-right">
<div className="flex justify-end gap-2">
<button className="w-8 h-8 rounded-full border border-error text-error hover:bg-error hover:text-white transition-colors flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">close</span>
</button>
<button className="w-8 h-8 rounded-full border border-tertiary-container text-tertiary-container hover:bg-tertiary-container hover:text-white transition-colors flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">check</span>
</button>
</div>
</td>
</tr>
<tr>
<td className="px-density-table-px py-density-table-py">
<p className="text-body-sm font-bold text-primary">Arjun Mehta</p>
<p className="text-[10px] text-on-surface-variant">IT Support</p>
</td>
<td className="px-density-table-px py-density-table-py text-body-sm">
                                    Oct 28 <br/>
<span className="text-[10px] font-bold text-on-surface-variant">(1 Day)</span>
</td>
<td className="px-density-table-px py-density-table-py text-body-sm text-on-surface-variant italic">Medical Checkup.</td>
<td className="px-density-table-px py-density-table-py text-right">
<div className="flex justify-end gap-2">
<button className="w-8 h-8 rounded-full border border-error text-error hover:bg-error hover:text-white transition-colors flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">close</span>
</button>
<button className="w-8 h-8 rounded-full border border-tertiary-container text-tertiary-container hover:bg-tertiary-container hover:text-white transition-colors flex items-center justify-center">
<span className="material-symbols-outlined text-[18px]">check</span>
</button>
</div>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>
</main>
  );
};

export default AttendanceManagement;
