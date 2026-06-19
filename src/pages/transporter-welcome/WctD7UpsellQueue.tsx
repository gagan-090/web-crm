import React from 'react';

export const WctD7UpsellQueue: React.FC = () => {
  return (
    <main className=" mt-16 p-lg bg-surface flex gap-lg min-h-[calc(100vh-64px)]">

<section className="flex-1 bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden flex flex-col shadow-sm">
<div className="p-lg border-b border-outline-variant flex justify-between items-center bg-white">
<div>
<h1 className="font-headline-sm text-headline-sm text-on-surface">D+7 Upsell Queue</h1>
<p className="text-body-sm text-on-surface-variant">Manage free-tier transporters ready for conversion</p>
</div>
<div className="flex items-center gap-md">
<div className="flex items-center px-3 py-1 bg-surface-container-low rounded-full border border-outline-variant">
<span className="material-symbols-outlined text-sm mr-2 text-primary">filter_list</span>
<span className="text-label-md font-label-md">78 leads pending</span>
</div>
<button className="bg-primary-container text-on-primary px-4 py-2 rounded-lg font-label-md flex items-center gap-2 hover:opacity-90 transition-opacity">
<span className="material-symbols-outlined text-sm">refresh</span>
                        Refresh Queue
                    </button>
</div>
</div>

<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="px-md py-3 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Company</th>
<th className="px-md py-3 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">TMID</th>
<th className="px-md py-3 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Free Plan Date</th>
<th className="px-md py-3 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Days Since Free</th>
<th className="px-md py-3 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Contact</th>
<th className="px-md py-3 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider">Last Call Note</th>
<th className="px-md py-3 text-label-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-surface-container-low transition-colors cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary-container" >
<td className="px-md py-4">
<div className="flex flex-col">
<span className="font-body-md font-bold text-on-surface">Express Logistics Hub</span>
<span className="text-body-sm text-on-surface-variant">Mumbai, MH</span>
</div>
</td>
<td className="px-md py-4 text-mono-data font-mono-data text-on-surface-variant">TM-9021</td>
<td className="px-md py-4 text-body-md">Oct 24, 2023</td>
<td className="px-md py-4">
<span className="bg-error-container text-on-error-container text-xs font-bold px-2 py-0.5 rounded">9 Days</span>
</td>
<td className="px-md py-4">
<div className="flex flex-col">
<span className="font-body-md">Rajesh Khanna</span>
<span className="text-body-sm text-on-surface-variant">+91 98765 43210</span>
</div>
</td>
<td className="px-md py-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-body-sm text-on-surface-variant italic">
                                "Interested in fleet tracking module..."
                            </td>
<td className="px-md py-4 text-right">
<button className="bg-primary-container text-on-primary px-4 py-1.5 rounded font-label-md hover:bg-orange-600 transition-all shadow-sm active:scale-95">Upsell Now</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary-container" >
<td className="px-md py-4">
<div className="flex flex-col">
<span className="font-body-md font-bold text-on-surface">Vishwa Transport</span>
<span className="text-body-sm text-on-surface-variant">Pune, MH</span>
</div>
</td>
<td className="px-md py-4 text-mono-data font-mono-data text-on-surface-variant">TM-8442</td>
<td className="px-md py-4 text-body-md">Oct 25, 2023</td>
<td className="px-md py-4">
<span className="bg-secondary-container text-on-secondary-container text-xs font-bold px-2 py-0.5 rounded">8 Days</span>
</td>
<td className="px-md py-4">
<div className="flex flex-col">
<span className="font-body-md">Amitabh S.</span>
<span className="text-body-sm text-on-surface-variant">+91 98220 11000</span>
</div>
</td>
<td className="px-md py-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-body-sm text-on-surface-variant italic">
                                "Owner requested a demo for bulk pricing"
                            </td>
<td className="px-md py-4 text-right">
<button className="bg-primary-container text-on-primary px-4 py-1.5 rounded font-label-md hover:bg-orange-600 transition-all shadow-sm active:scale-95">Upsell Now</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors cursor-pointer group border-l-4 border-l-primary-container bg-surface-container-low" >
<td className="px-md py-4">
<div className="flex flex-col">
<span className="font-body-md font-bold text-on-surface">Rapid Roadlines</span>
<span className="text-body-sm text-on-surface-variant">Surat, GJ</span>
</div>
</td>
<td className="px-md py-4 text-mono-data font-mono-data text-on-surface-variant">TM-7711</td>
<td className="px-md py-4 text-body-md">Oct 26, 2023</td>
<td className="px-md py-4">
<span className="bg-primary-fixed text-on-primary-fixed text-xs font-bold px-2 py-0.5 rounded">7 Days</span>
</td>
<td className="px-md py-4">
<div className="flex flex-col">
<span className="font-body-md">Sanjay Patel</span>
<span className="text-body-sm text-on-surface-variant">+91 94260 55888</span>
</div>
</td>
<td className="px-md py-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-body-sm text-on-surface-variant italic">
                                "Called twice, no response. Busy season."
                            </td>
<td className="px-md py-4 text-right">
<button className="bg-primary-container text-on-primary px-4 py-1.5 rounded font-label-md hover:bg-orange-600 transition-all shadow-sm active:scale-95">Upsell Now</button>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors cursor-pointer group border-l-4 border-l-transparent hover:border-l-primary-container" >
<td className="px-md py-4">
<div className="flex flex-col">
<span className="font-body-md font-bold text-on-surface">BlueSky Logistics</span>
<span className="text-body-sm text-on-surface-variant">Delhi, NCR</span>
</div>
</td>
<td className="px-md py-4 text-mono-data font-mono-data text-on-surface-variant">TM-1044</td>
<td className="px-md py-4 text-body-md">Oct 26, 2023</td>
<td className="px-md py-4">
<span className="bg-primary-fixed text-on-primary-fixed text-xs font-bold px-2 py-0.5 rounded">7 Days</span>
</td>
<td className="px-md py-4">
<div className="flex flex-col">
<span className="font-body-md">Kiran Bedi</span>
<span className="text-body-sm text-on-surface-variant">+91 88001 22334</span>
</div>
</td>
<td className="px-md py-4 max-w-xs overflow-hidden text-ellipsis whitespace-nowrap text-body-sm text-on-surface-variant italic">
                                "High usage on free plan. Prime target."
                            </td>
<td className="px-md py-4 text-right">
<button className="bg-primary-container text-on-primary px-4 py-1.5 rounded font-label-md hover:bg-orange-600 transition-all shadow-sm active:scale-95">Upsell Now</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="mt-auto p-md border-t border-outline-variant flex justify-between items-center bg-surface-container-lowest">
<span className="text-body-sm text-on-surface-variant">Showing 1-10 of 78 leads</span>
<div className="flex gap-2">
<button className="p-1 border border-outline-variant rounded hover:bg-surface-container transition-colors"><span className="material-symbols-outlined">chevron_left</span></button>
<button className="p-1 border border-outline-variant rounded hover:bg-surface-container transition-colors"><span className="material-symbols-outlined">chevron_right</span></button>
</div>
</div>
</section>

<aside className="w-96 bg-white border border-outline-variant rounded-xl flex flex-col shadow-lg transition-all duration-300" id="lead-panel">

<div className="p-lg border-b border-outline-variant bg-surface-container-low rounded-t-xl">
<div className="flex justify-between items-start mb-md">
<span className="text-label-md font-label-md text-primary font-bold uppercase tracking-widest">Lead Detail</span>
<button className="text-on-surface-variant hover:text-on-surface transition-colors">
<span className="material-symbols-outlined">close</span>
</button>
</div>
<h3 className="font-headline-sm text-headline-sm text-on-surface" id="panel-company">Rapid Roadlines</h3>
<p className="text-mono-data text-primary-container" id="panel-tmid">TM-7711 • Priority Lead</p>
</div>

<div className="p-lg flex-1 overflow-y-auto hide-scrollbar flex flex-col gap-lg">

<div className="grid grid-cols-2 gap-md">
<div className="p-md bg-surface border border-outline-variant rounded-lg">
<p className="text-label-md font-label-md text-on-surface-variant">Fleet Size</p>
<p className="font-display-lg text-display-lg text-on-surface">42</p>
</div>
<div className="p-md bg-surface border border-outline-variant rounded-lg">
<p className="text-label-md font-label-md text-on-surface-variant">App Activity</p>
<p className="font-display-lg text-display-lg text-tertiary">High</p>
</div>
</div>

<div className="space-y-md">
<h4 className="font-label-md text-label-md text-on-surface-variant uppercase">Decision Maker</h4>
<div className="flex items-center gap-md">
<div className="w-12 h-12 bg-secondary-container rounded-full flex items-center justify-center text-on-secondary-container font-bold text-headline-sm">SP</div>
<div>
<p className="font-body-md font-bold">Sanjay Patel</p>
<p className="text-body-sm text-on-surface-variant">Owner &amp; MD</p>
</div>
</div>
<div className="space-y-2">
<div className="flex items-center gap-md text-on-surface-variant">
<span className="material-symbols-outlined text-sm">phone</span>
<span className="text-body-md">+91 94260 55888</span>
</div>
<div className="flex items-center gap-md text-on-surface-variant">
<span className="material-symbols-outlined text-sm">mail</span>
<span className="text-body-md">sanjay.patel@rapidrl.in</span>
</div>
</div>
</div>

<div className="space-y-md">
<h4 className="font-label-md text-label-md text-on-surface-variant uppercase">Usage Highlights</h4>
<div className="space-y-xs">
<div className="flex justify-between text-body-sm">
<span>KYC Verified</span>
<span className="material-symbols-outlined text-green-600" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span>
</div>
<div className="flex justify-between text-body-sm">
<span>Lorry Receipts</span>
<span className="font-bold">150+ / month</span>
</div>
<div className="flex justify-between text-body-sm">
<span>Wallet Usage</span>
<span className="font-bold">₹1.2L+</span>
</div>
</div>
<div className="w-full bg-outline-variant h-1.5 rounded-full overflow-hidden mt-2">
<div className="bg-primary-container h-full w-[85%]"></div>
</div>
<p className="text-[10px] text-on-surface-variant">85% propensity to upgrade based on activity patterns</p>
</div>

<div className="space-y-md">
<h4 className="font-label-md text-label-md text-on-surface-variant uppercase">Interaction History</h4>
<div className="border-l-2 border-outline-variant ml-2 pl-4 space-y-md">
<div className="relative">
<div className="absolute -left-[21px] top-1 w-2 h-2 bg-primary-container rounded-full"></div>
<p className="text-body-sm font-bold">Follow-up Call <span className="font-normal text-on-surface-variant ml-2">Yesterday</span></p>
<p className="text-body-sm text-on-surface-variant">Customer busy with Diwali season dispatches. Asked to call on weekend for plan breakdown.</p>
</div>
<div className="relative">
<div className="absolute -left-[21px] top-1 w-2 h-2 bg-outline rounded-full"></div>
<p className="text-body-sm font-bold">Intro Demo <span className="font-normal text-on-surface-variant ml-2">4 days ago</span></p>
<p className="text-body-sm text-on-surface-variant">Gave walkthrough of premium dashboard. Sanjay liked the automatic reporting feature.</p>
</div>
</div>
</div>
</div>

<div className="p-lg bg-surface-container-low border-t border-outline-variant flex flex-col gap-md rounded-b-xl">
<button className="w-full bg-primary-container text-on-primary py-3 rounded font-headline-sm flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-md active:scale-[0.98]">
<span className="material-symbols-outlined">call</span>
                    Call Sanjay Now
                </button>
<div className="flex gap-md">
<button className="flex-1 border border-outline-variant bg-white py-2 rounded text-body-sm font-bold hover:bg-surface transition-colors">Add Note</button>
<button className="flex-1 border border-outline-variant bg-white py-2 rounded text-body-sm font-bold hover:bg-surface transition-colors">Re-assign</button>
</div>
</div>
</aside>
</main>
  );
};

export default WctD7UpsellQueue;
