import React from 'react';

export const Page06QcConsole: React.FC = () => {
  return (
    <main className=" pt-[56px] p-6 space-y-6">

<div className="flex justify-between items-start">
<div>
<h2 className="text-2xl font-bold text-gray-900">QC Console</h2>
<p className="text-sm text-gray-500">Operational quality oversight &amp; fatal error tracking</p>
</div>
<div className="flex gap-2">
<button className="flipkart-blue text-white px-4 py-2 btn-radius text-sm font-bold flex items-center gap-2 hover:opacity-90 shadow-sm" >
<span className="material-symbols-outlined text-lg">calendar_month</span>
                Book Calibration
            </button>
<div className="bg-white border border-e0 px-3 py-2 btn-radius text-gray-600 text-sm flex items-center gap-2 cursor-pointer hover:bg-gray-50">
<span className="material-symbols-outlined text-lg">filter_alt</span>
                Last 7 Days
            </div>
</div>
</div>

<div className="grid grid-cols-3 gap-6">
<div className="bg-white p-4 card-shadow border border-e0 btn-radius">
<p className="text-xs font-bold text-gray-500 uppercase mb-2">Overall QC Score</p>
<div className="flex items-end gap-2">
<span className="text-3xl font-bold flipkart-text-blue">82.4%</span>
<span className="text-xs text-green-600 font-bold mb-1 flex items-center">
<span className="material-symbols-outlined text-sm">trending_up</span> +2.1%
                </span>
</div>
</div>
<div className="bg-white p-4 card-shadow border border-e0 btn-radius">
<p className="text-xs font-bold text-gray-500 uppercase mb-2">Fatal Error Rate</p>
<div className="flex items-end gap-2">
<span className="text-3xl font-bold flipkart-text-red">1.2%</span>
<span className="text-xs flipkart-text-red font-bold mb-1 flex items-center">
<span className="material-symbols-outlined text-sm">priority_high</span> High
                </span>
</div>
</div>
<div className="bg-white p-4 card-shadow border border-e0 btn-radius">
<p className="text-xs font-bold text-gray-500 uppercase mb-2">Audits Completed</p>
<div className="flex items-end gap-2">
<span className="text-3xl font-bold text-gray-900">1,240</span>
<span className="text-xs text-gray-400 font-medium mb-1">MTD</span>
</div>
</div>
</div>
<div className="grid grid-cols-12 gap-6">

<div className="col-span-7 bg-white card-shadow border border-e0 btn-radius overflow-hidden flex flex-col">
<div className="px-4 py-3 border-b border-e0 bg-gray-50 flex justify-between items-center">
<h3 className="text-sm font-bold text-gray-900 uppercase">Performance Declines (3-Week Trend)</h3>
<span className="text-[10px] font-bold flipkart-red text-white px-2 py-0.5 btn-radius">ALERT</span>
</div>
<table className="w-full text-sm">
<thead>
<tr className="text-gray-500 border-b border-e0 bg-white">
<th className="px-4 py-2 font-semibold text-left">Caller Name</th>
<th className="px-4 py-2 font-semibold text-center">Score</th>
<th className="px-4 py-2 font-semibold text-center">Trend</th>
<th className="px-4 py-2 font-semibold text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-e0">
<tr className="hover:bg-gray-50">
<td className="px-4 py-3">
<p className="font-bold">Rahul K.</p>
<p className="text-xs text-gray-500">Campaign: Auto-Loan</p>
</td>
<td className="px-4 py-3 text-center font-bold">68.5%</td>
<td className="px-4 py-3 text-center flipkart-text-red font-bold">-12%</td>
<td className="px-4 py-3 text-right">
<button className="text-[11px] font-bold flipkart-text-blue border border-[#2874F0] px-3 py-1 btn-radius hover:bg-blue-50">Book Calibration</button>
</td>
</tr>
<tr className="hover:bg-gray-50">
<td className="px-4 py-3">
<p className="font-bold">Amit V.</p>
<p className="text-xs text-gray-500">Campaign: Outbound</p>
</td>
<td className="px-4 py-3 text-center font-bold">61.0%</td>
<td className="px-4 py-3 text-center flipkart-text-red font-bold">-15%</td>
<td className="px-4 py-3 text-right">
<button className="text-[11px] font-bold flipkart-text-blue border border-[#2874F0] px-3 py-1 btn-radius hover:bg-blue-50">Book Calibration</button>
</td>
</tr>
<tr className="hover:bg-gray-50">
<td className="px-4 py-3">
<p className="font-bold">Meera S.</p>
<p className="text-xs text-gray-500">Campaign: Insurance</p>
</td>
<td className="px-4 py-3 text-center font-bold">72.1%</td>
<td className="px-4 py-3 text-center flipkart-text-red font-bold">-8%</td>
<td className="px-4 py-3 text-right">
<button className="text-[11px] font-bold flipkart-text-blue border border-[#2874F0] px-3 py-1 btn-radius hover:bg-blue-50">Book Calibration</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="col-span-5 bg-white card-shadow border border-e0 btn-radius flex flex-col">
<div className="px-4 py-3 border-b border-e0 bg-red-50 flex justify-between items-center">
<h3 className="text-sm font-bold flipkart-text-red uppercase flex items-center gap-2">
<span className="material-symbols-outlined text-lg" style={{"fontVariationSettings": "\'FILL\' 1"}}>report</span>
                    Fatal Error Feed
                </h3>
<span className="text-[10px] font-bold text-red-700 bg-red-100 px-2 py-0.5 rounded-full">LIVE</span>
</div>
<div className="flex-1 overflow-y-auto max-h-[280px] divide-y divide-e0">
<div className="p-4 hover:bg-gray-50">
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-xs font-bold flipkart-text-red mb-1">MIS-SELLING</p>
<p className="text-sm font-bold">Priya D.</p>
<p className="text-xs text-gray-500">Lead ID: #99021</p>
</div>
<span className="text-[10px] text-gray-400 font-medium">2m ago</span>
</div>
<button className="w-full py-1.5 border border-e0 text-[11px] font-bold flipkart-text-blue btn-radius hover:bg-gray-50 flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm">play_circle</span> Listen Recording
                    </button>
</div>
<div className="p-4 hover:bg-gray-50">
<div className="flex justify-between items-start mb-2">
<div>
<p className="text-xs font-bold flipkart-text-red mb-1">COMPLIANCE</p>
<p className="text-sm font-bold">Suresh K.</p>
<p className="text-xs text-gray-500">Lead ID: #98442</p>
</div>
<span className="text-[10px] text-gray-400 font-medium">14m ago</span>
</div>
<button className="w-full py-1.5 border border-e0 text-[11px] font-bold flipkart-text-blue btn-radius hover:bg-gray-50 flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm">play_circle</span> Listen Recording
                    </button>
</div>
</div>
<button className="w-full py-3 text-xs font-bold flipkart-text-blue border-t border-e0 hover:bg-gray-50">View All Fatals</button>
</div>
</div>

<div className="bg-white card-shadow border border-e0 btn-radius overflow-hidden">
<div className="px-6 py-4 border-b border-e0 flex justify-between items-center">
<h3 className="text-sm font-bold text-gray-900 uppercase tracking-wide">Recent QC Evaluations</h3>
<div className="flex items-center gap-4">
<span className="text-xs text-gray-500">Showing <span className="font-bold text-gray-900">1-15</span> of 142</span>
<div className="flex border border-e0 btn-radius">
<button className="px-2 py-1 hover:bg-gray-50 border-r border-e0"><span className="material-symbols-outlined text-lg">chevron_left</span></button>
<button className="px-2 py-1 hover:bg-gray-50"><span className="material-symbols-outlined text-lg">chevron_right</span></button>
</div>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-sm">
<thead>
<tr className="bg-gray-50 text-gray-500 border-b border-e0 text-[11px] uppercase tracking-wider font-bold">
<th className="px-6 py-3 text-left">Eval ID</th>
<th className="px-6 py-3 text-left">Agent Name</th>
<th className="px-6 py-3 text-left">Date &amp; Time</th>
<th className="px-6 py-3 text-left">Campaign</th>
<th className="px-6 py-3 text-center">Score</th>
<th className="px-6 py-3 text-left">Auditor</th>
<th className="px-6 py-3 text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-e0">
<tr className="hover:bg-gray-50 transition-colors">
<td className="px-6 py-4 font-mono text-xs flipkart-text-blue">#QC-8829</td>
<td className="px-6 py-4 font-bold text-gray-900">Ayesha Khan</td>
<td className="px-6 py-4 text-gray-500">24 May, 11:45 AM</td>
<td className="px-6 py-4 text-gray-500">Personal Loan</td>
<td className="px-6 py-4 text-center">
<div className="flex items-center justify-center gap-2">
<span className="w-2 h-2 rounded-full bg-green-500"></span>
<span className="font-bold">88%</span>
</div>
</td>
<td className="px-6 py-4 text-gray-500">Vikram S.</td>
<td className="px-6 py-4 text-right">
<button className="material-symbols-outlined text-gray-400 hover:flipkart-text-blue" data-icon="visibility">visibility</button>
</td>
</tr>
<tr className="hover:bg-gray-50 transition-colors">
<td className="px-6 py-4 font-mono text-xs flipkart-text-blue">#QC-8827</td>
<td className="px-6 py-4 font-bold text-gray-900">Rahul K.</td>
<td className="px-6 py-4 text-gray-500">24 May, 10:20 AM</td>
<td className="px-6 py-4 text-gray-500">Auto-Loan</td>
<td className="px-6 py-4 text-center">
<div className="flex items-center justify-center gap-2">
<span className="w-2 h-2 rounded-full flipkart-red"></span>
<span className="font-bold flipkart-text-red">54%</span>
</div>
</td>
<td className="px-6 py-4 text-gray-500">Anjali P.</td>
<td className="px-6 py-4 text-right">
<button className="material-symbols-outlined text-gray-400 hover:flipkart-text-blue" data-icon="visibility">visibility</button>
</td>
</tr>
<tr className="hover:bg-gray-50 transition-colors">
<td className="px-6 py-4 font-mono text-xs flipkart-text-blue">#QC-8825</td>
<td className="px-6 py-4 font-bold text-gray-900">Amit V.</td>
<td className="px-6 py-4 text-gray-500">24 May, 09:55 AM</td>
<td className="px-6 py-4 text-gray-500">Inbound-CC</td>
<td className="px-6 py-4 text-center">
<div className="flex items-center justify-center gap-2">
<span className="w-2 h-2 rounded-full bg-yellow-500"></span>
<span className="font-bold text-yellow-600">71%</span>
</div>
</td>
<td className="px-6 py-4 text-gray-500">Vikram S.</td>
<td className="px-6 py-4 text-right">
<button className="material-symbols-outlined text-gray-400 hover:flipkart-text-blue" data-icon="visibility">visibility</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="px-6 py-4 bg-gray-50 border-t border-e0">
<button className="text-xs font-bold flipkart-text-blue flex items-center gap-2 hover:gap-3 transition-all uppercase">
                View Complete Audit History
                <span className="material-symbols-outlined text-base">arrow_forward</span>
</button>
</div>
</div>
</main>
  );
};

export default Page06QcConsole;
