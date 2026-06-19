import React from 'react';

export const HiringDashboard: React.FC = () => {
  return (
    <main className=" pt-[56px] p-md min-h-screen">

<div className="flex justify-between items-center mb-md">
<div>
<h2 className="text-headline-md font-bold text-on-surface">Open Hiring Positions</h2>
<p className="text-body-sm text-on-surface-variant">Manage recruitment pipeline and tracking timeline for Q3 expansion.</p>
</div>
<button className="bg-[#2874F0] hover:bg-primary-container text-white px-md py-sm rounded-sm font-label-caps text-label-caps flex items-center gap-xs transition-transform active:scale-[0.98]">
<span className="material-symbols-outlined text-[18px]" data-icon="add">add</span>
                POST NEW ROLE
            </button>
</div>
<div className="grid grid-cols-12 gap-md">

<div className="col-span-12 grid grid-cols-1 md:grid-cols-4 gap-sm mb-sm">
<div className="bento-card bg-surface p-md rounded-lg flex flex-col">
<span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Total Openings</span>
<span className="text-2xl font-bold text-primary mt-1">12</span>
<div className="mt-2 text-[11px] text-green-600 flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]" data-icon="trending_up">trending_up</span>
                        2 added this week
                    </div>
</div>
<div className="bento-card bg-surface p-md rounded-lg flex flex-col">
<span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Active Candidates</span>
<span className="text-2xl font-bold text-secondary mt-1">148</span>
<div className="mt-2 text-[11px] text-on-surface-variant">Avg. 12 per role</div>
</div>
<div className="bento-card bg-surface p-md rounded-lg flex flex-col">
<span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Offers Pending</span>
<span className="text-2xl font-bold text-tertiary mt-1">04</span>
<div className="mt-2 text-[11px] text-error flex items-center gap-1">
<span className="material-symbols-outlined text-[14px]" data-icon="schedule">schedule</span>
                        Expiring soon
                    </div>
</div>
<div className="bento-card bg-surface p-md rounded-lg flex flex-col border-l-4 border-l-primary">
<span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Hiring Velocity</span>
<span className="text-2xl font-bold text-on-surface mt-1">18 Days</span>
<div className="mt-2 text-[11px] text-on-surface-variant">Time to hire (Avg)</div>
</div>
</div>

<div className="col-span-12 lg:col-span-8">
<div className="bento-card bg-white rounded-lg overflow-hidden flex flex-col h-full">
<div className="bg-surface-container-low px-md py-sm border-b border-outline-variant flex justify-between items-center">
<h3 className="font-bold text-sm uppercase tracking-wide flex items-center gap-xs text-on-surface">
<span className="material-symbols-outlined text-primary text-[20px]" data-icon="table_chart">table_chart</span>
                            Live Requisitions
                        </h3>
<div className="flex gap-xs">
<button className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant"><span className="material-symbols-outlined text-[18px]" data-icon="filter_list">filter_list</span></button>
<button className="p-1 hover:bg-surface-container-high rounded text-on-surface-variant"><span className="material-symbols-outlined text-[18px]" data-icon="more_vert">more_vert</span></button>
</div>
</div>
<div className="overflow-x-auto flex-1">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="px-md py-sm text-[11px] font-bold text-on-surface-variant uppercase">Role</th>
<th className="px-md py-sm text-[11px] font-bold text-on-surface-variant uppercase">Process</th>
<th className="px-md py-sm text-[11px] font-bold text-on-surface-variant uppercase">Priority</th>
<th className="px-md py-sm text-[11px] font-bold text-on-surface-variant uppercase text-center">Candidates</th>
<th className="px-md py-sm text-[11px] font-bold text-on-surface-variant uppercase">Status</th>
<th className="px-md py-sm text-[11px] font-bold text-on-surface-variant uppercase text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-surface-container-low group transition-colors">
<td className="px-md py-md">
<div className="flex flex-col">
<span className="font-bold text-on-surface">Senior Sales Lead</span>
<span className="text-[11px] text-on-surface-variant">ID: HR-204 | Mumbai</span>
</div>
</td>
<td className="px-md py-md">
<span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold rounded uppercase">L3 Assessment</span>
</td>
<td className="px-md py-md">
<div className="flex items-center gap-xs text-error font-bold text-[11px]">
<span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                            URGENT
                                        </div>
</td>
<td className="px-md py-md text-center">
<div className="flex justify-center -space-x-2">
<div className="w-6 h-6 rounded-full border border-white bg-slate-300 flex items-center justify-center text-[10px]">JD</div>
<div className="w-6 h-6 rounded-full border border-white bg-blue-300 flex items-center justify-center text-[10px]">PK</div>
<div className="w-6 h-6 rounded-full border border-white bg-green-300 flex items-center justify-center text-[10px]">+8</div>
</div>
</td>
<td className="px-md py-md">
<span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">Warming</span>
</td>
<td className="px-md py-md text-right">
<button className="bg-[#FB641B] hover:bg-secondary-container text-white px-xs py-1 rounded text-[10px] font-bold uppercase active:scale-[0.95] transition-all">Flag as Hired</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low group transition-colors">
<td className="px-md py-md">
<div className="flex flex-col">
<span className="font-bold text-on-surface">Telecalling Executive</span>
<span className="text-[11px] text-on-surface-variant">ID: HR-211 | Remote</span>
</div>
</td>
<td className="px-md py-md">
<span className="px-2 py-0.5 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold rounded uppercase">Final Interview</span>
</td>
<td className="px-md py-md">
<div className="flex items-center gap-xs text-secondary font-bold text-[11px]">
<span className="w-1.5 h-1.5 rounded-full bg-secondary"></span>
                                            MEDIUM
                                        </div>
</td>
<td className="px-md py-md text-center">
<div className="flex justify-center -space-x-2">
<div className="w-6 h-6 rounded-full border border-white bg-amber-200 flex items-center justify-center text-[10px]">AM</div>
<div className="w-6 h-6 rounded-full border border-white bg-gray-200 flex items-center justify-center text-[10px]">+14</div>
</div>
</td>
<td className="px-md py-md">
<span className="text-[11px] font-bold px-2 py-0.5 rounded bg-red-50 text-red-600 border border-red-100 uppercase">Hot</span>
</td>
<td className="px-md py-md text-right">
<button className="bg-[#FB641B] hover:bg-secondary-container text-white px-xs py-1 rounded text-[10px] font-bold uppercase active:scale-[0.95] transition-all">Flag as Hired</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low group transition-colors">
<td className="px-md py-md">
<div className="flex flex-col">
<span className="font-bold text-on-surface">Logistics Analyst</span>
<span className="text-[11px] text-on-surface-variant">ID: HR-215 | Bengaluru</span>
</div>
</td>
<td className="px-md py-md">
<span className="px-2 py-0.5 bg-surface-container-highest text-on-surface-variant text-[10px] font-bold rounded uppercase">Screening</span>
</td>
<td className="px-md py-md">
<div className="flex items-center gap-xs text-on-surface-variant font-bold text-[11px]">
<span className="w-1.5 h-1.5 rounded-full bg-outline-variant"></span>
                                            LOW
                                        </div>
</td>
<td className="px-md py-md text-center">
<div className="flex justify-center -space-x-2">
<div className="w-6 h-6 rounded-full border border-white bg-purple-200 flex items-center justify-center text-[10px]">SK</div>
<div className="w-6 h-6 rounded-full border border-white bg-gray-200 flex items-center justify-center text-[10px]">+3</div>
</div>
</td>
<td className="px-md py-md">
<span className="text-[11px] font-bold px-2 py-0.5 rounded bg-gray-50 text-gray-600 border border-gray-100 uppercase">Cold</span>
</td>
<td className="px-md py-md text-right">
<button className="bg-[#FB641B] hover:bg-secondary-container text-white px-xs py-1 rounded text-[10px] font-bold uppercase active:scale-[0.95] transition-all">Flag as Hired</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low group transition-colors">
<td className="px-md py-md">
<div className="flex flex-col">
<span className="font-bold text-on-surface">Operations Manager</span>
<span className="text-[11px] text-on-surface-variant">ID: HR-198 | Delhi</span>
</div>
</td>
<td className="px-md py-md">
<span className="px-2 py-0.5 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold rounded uppercase">Negotiation</span>
</td>
<td className="px-md py-md">
<div className="flex items-center gap-xs text-error font-bold text-[11px]">
<span className="w-1.5 h-1.5 rounded-full bg-error"></span>
                                            URGENT
                                        </div>
</td>
<td className="px-md py-md text-center">
<div className="flex justify-center -space-x-2">
<div className="w-6 h-6 rounded-full border border-white bg-indigo-200 flex items-center justify-center text-[10px]">RK</div>
<div className="w-6 h-6 rounded-full border border-white bg-gray-200 flex items-center justify-center text-[10px]">+1</div>
</div>
</td>
<td className="px-md py-md">
<span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-600 border border-blue-100">Warming</span>
</td>
<td className="px-md py-md text-right">
<button className="bg-[#FB641B] hover:bg-secondary-container text-white px-xs py-1 rounded text-[10px] font-bold uppercase active:scale-[0.95] transition-all">Flag as Hired</button>
</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-4 flex flex-col gap-md">
<div className="bento-card bg-white rounded-lg p-md h-full flex flex-col overflow-hidden">
<div className="flex items-center justify-between mb-md">
<h3 className="font-bold text-sm uppercase tracking-wide flex items-center gap-xs text-on-surface">
<span className="material-symbols-outlined text-tertiary text-[20px]" data-icon="timeline">timeline</span>
                            Hiring Timeline
                        </h3>
<span className="text-[10px] bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant font-bold">WEEK 1-5</span>
</div>

<div className="flex-1 min-h-[300px] relative flex flex-col">
<div className="flex justify-between border-b border-outline-variant pb-2 mb-2 text-[10px] font-bold text-on-surface-variant uppercase">
<span className="w-[20%] text-center">W1</span>
<span className="w-[20%] text-center">W2</span>
<span className="w-[20%] text-center">W3</span>
<span className="w-[20%] text-center">W4</span>
<span className="w-[20%] text-center">W5</span>
</div>
<div className="relative flex-1 gantt-grid space-y-md pt-xs">

<div className="space-y-sm">
<p className="text-[10px] font-bold text-on-surface-variant leading-none">Sales Lead</p>
<div className="relative h-6 bg-surface-container-low rounded-full w-full overflow-hidden">
<div className="absolute h-full bg-primary w-[70%] left-[10%] rounded-full opacity-90 flex items-center px-3">
<span className="text-[9px] text-white font-bold whitespace-nowrap">Assessments Ongoing</span>
</div>
</div>
</div>
<div className="space-y-sm">
<p className="text-[10px] font-bold text-on-surface-variant leading-none">Tele-Ex</p>
<div className="relative h-6 bg-surface-container-low rounded-full w-full overflow-hidden">
<div className="absolute h-full bg-secondary w-[85%] left-[5%] rounded-full opacity-90 flex items-center px-3">
<span className="text-[9px] text-white font-bold whitespace-nowrap">Final Interviews</span>
</div>
</div>
</div>
<div className="space-y-sm">
<p className="text-[10px] font-bold text-on-surface-variant leading-none">Ops Manager</p>
<div className="relative h-6 bg-surface-container-low rounded-full w-full overflow-hidden">
<div className="absolute h-full bg-tertiary w-[30%] left-[60%] rounded-full opacity-90 flex items-center px-3">
<span className="text-[9px] text-white font-bold whitespace-nowrap">Negotiation</span>
</div>
</div>
</div>
<div className="space-y-sm">
<p className="text-[10px] font-bold text-on-surface-variant leading-none">Logistics Analyst</p>
<div className="relative h-6 bg-surface-container-low rounded-full w-full overflow-hidden">
<div className="absolute h-full bg-outline w-[50%] left-[0%] rounded-full opacity-90 flex items-center px-3">
<span className="text-[9px] text-white font-bold whitespace-nowrap">Screening Phase</span>
</div>
</div>
</div>
</div>

<div className="mt-xl pt-md border-t border-outline-variant grid grid-cols-2 gap-sm">
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-primary"></span>
<span className="text-[10px] text-on-surface-variant font-medium">Internal Review</span>
</div>
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-secondary"></span>
<span className="text-[10px] text-on-surface-variant font-medium">Candidate Action</span>
</div>
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-tertiary"></span>
<span className="text-[10px] text-on-surface-variant font-medium">Negotiation</span>
</div>
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-outline"></span>
<span className="text-[10px] text-on-surface-variant font-medium">Procurement</span>
</div>
</div>
</div>
</div>

<div className="bento-card bg-surface p-md rounded-lg">
<h4 className="text-[11px] font-bold text-on-surface uppercase mb-sm border-b border-outline-variant pb-xs">Recent Updates</h4>
<ul className="space-y-md">
<li className="flex gap-sm">
<span className="material-symbols-outlined text-[16px] text-green-600" data-icon="check_circle">check_circle</span>
<div>
<p className="text-[11px] font-bold leading-tight">Offer accepted by Aryan P.</p>
<p className="text-[9px] text-on-surface-variant">Fleet Coordinator | 2 hours ago</p>
</div>
</li>
<li className="flex gap-sm">
<span className="material-symbols-outlined text-[16px] text-blue-600" data-icon="mail">mail</span>
<div>
<p className="text-[11px] font-bold leading-tight">Sent 12 invitation links</p>
<p className="text-[9px] text-on-surface-variant">L1 Sales Role | 5 hours ago</p>
</div>
</li>
</ul>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-3 gap-md mt-md">
<div className="relative h-40 rounded-lg overflow-hidden bento-card">
<img className="w-full h-full object-cover" data-alt="A clean, professional recruitment headshot of a corporate hiring manager in a modern office, bright natural lighting, soft blue and white background, professional attire, looking directly at the camera with a confident and helpful expression, minimalist corporate photography style." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDX8_IMnZ9us1TqtUkYH6Dhh15SXEMIYp7W6Kh1Drj4eOvptZ4JHnxdZRD_JxBsYS381VtAaazSAsApFLagY5dvvUACDQEMACMZyyuSdo8YqtxSpxsXVEtvd4vOmQpVNDuD38OiOZ89o1VJ-TlFAXxq2-1TJ2zr9GBdwgHA3zq9ZlPG-qTtCLMKjTCd6O3xUEEFvTUDBCtw53DpQKn1MMAM0Z4e88LtFf2RuZ2dFs3_tdkhggc4uFEoGAsQ35ov_I_AM_UcB_zze1s"/>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-md text-white">
<span className="text-[10px] font-bold uppercase tracking-widest text-primary-fixed">Success Story</span>
<p className="font-bold text-sm">Onboarded 20 Executives last month.</p>
</div>
</div>
<div className="relative h-40 rounded-lg overflow-hidden bento-card">
<div className="w-full h-full bg-cover bg-center" data-alt="A modern, high-tech interview room featuring a sleek glass table, ergonomic chairs, and a large monitor displaying candidate analytics data. The setting is a minimalist office space with high-key lighting, neutral tones, and a view of a clean city skyline, emphasizing a structured and professional recruitment environment." style={{"backgroundImage": "url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuDK03Qv6h3lEqtTzwgRM3BO578ZdWBOHrLn1DjhL4WYR3pexLHUaWQ4BeXeOpAYm3--fPK5IcPpsx2uhEwRLUyGNyxoyOeCbNwjbSV5yMObjeeN3pwZBk5CqUuXkxXx_4jklKe29psifN5Fv3UIVtaEEG25XkY2FRjcI2icn1kVB0KjuFajHzWp-ENXzUIC23C0t0TrFioSxpQMgCVrH1oecVgynnSj7dBk30sKuj0_TY9aWWQbQeuwtZ16cFIcocpl6oB_DOpDcyI\')"}}></div>
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-md text-white">
<span className="text-[10px] font-bold uppercase tracking-widest text-secondary-fixed">Global Process</span>
<p className="font-bold text-sm">Standardized SLA across all zones.</p>
</div>
</div>
<div className="relative h-40 rounded-lg overflow-hidden bento-card flex items-center justify-center bg-primary text-white">
<div className="text-center p-md">
<span className="material-symbols-outlined text-[48px]" data-icon="work_history" style={{"fontVariationSettings": "\'FILL\' 1"}}>work_history</span>
<p className="mt-2 font-bold text-sm">Access Role Archive</p>
<p className="text-[10px] opacity-80">View all 124 past hires</p>
</div>
</div>
</div>
</main>
  );
};

export default HiringDashboard;
