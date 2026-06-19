import React from 'react';

export const MmPlacementHistory: React.FC = () => {
  return (
    <main className=" mt-16 p-margin-desktop min-h-screen">

<div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-lg gap-md">
<div>
<h2 className="font-display-lg text-display-lg text-on-surface">My Placements Dashboard</h2>
<p className="text-on-surface-variant font-body-md">Real-time tracking of driver matchmaking and commission events.</p>
</div>
<div className="flex bg-surface-container rounded-lg p-1">
<button className="px-md py-1.5 rounded-md font-bold text-primary bg-surface-container-lowest shadow-sm text-body-sm">This Month</button>
<button className="px-md py-1.5 rounded-md text-on-surface-variant hover:bg-surface-variant transition-colors text-body-sm">Last Month</button>
<button className="px-md py-1.5 rounded-md text-on-surface-variant hover:bg-surface-variant transition-colors text-body-sm">History</button>
</div>
</div>

<div className="grid grid-cols-12 gap-lg">

<div className="col-span-12 lg:col-span-4 flex flex-col gap-gutter">

<div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl">
<div className="flex justify-between items-start mb-md">
<p className="font-label-md text-on-surface-variant uppercase">Placements Rate</p>
<span className="material-symbols-outlined text-primary" data-icon="rocket_launch">rocket_launch</span>
</div>
<div className="flex items-baseline gap-xs mb-sm">
<span className="font-display-lg text-display-lg">24</span>
<span className="font-headline-sm text-on-surface-variant">/ 55</span>
</div>
<div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full transition-all duration-1000" style={{"width": "43.6%"}}></div>
</div>
<p className="mt-sm font-body-sm text-on-surface-variant">43.6% of monthly target achieved</p>
</div>

<div className="bg-surface-container-lowest border border-outline-variant p-md rounded-xl">
<div className="flex justify-between items-start mb-md">
<p className="font-label-md text-on-surface-variant uppercase">SLA Compliance</p>
<span className="material-symbols-outlined text-primary" data-icon="verified">verified</span>
</div>
<div className="font-display-lg text-display-lg mb-sm">91.7%</div>
<div className="flex items-center gap-xs">
<div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
<div className="bg-accent-purple h-full" style={{"width": "91.7%"}}></div>
</div>
</div>
<p className="mt-sm font-body-sm text-accent-purple font-medium">Excellent Performance</p>
</div>
</div>

<div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-md rounded-xl flex flex-col">
<p className="font-label-md text-on-surface-variant uppercase mb-lg">Placement Tier Mix</p>
<div className="flex-1 flex flex-col justify-around">
<div className="flex items-center justify-between">
<div className="flex items-center gap-md">
<div className="w-10 h-10 bg-primary-fixed rounded-full flex items-center justify-center text-primary">
<span className="material-symbols-outlined" data-icon="workspace_premium" style={{"fontVariationSettings": "\'FILL\' 1"}}>workspace_premium</span>
</div>
<div>
<p className="font-body-md font-bold text-on-surface">Premium</p>
<p className="text-body-sm text-on-surface-variant">Tier 1 Placements</p>
</div>
</div>
<span className="font-headline-sm">16</span>
</div>
<div className="h-[1px] bg-outline-variant my-md"></div>
<div className="flex items-center justify-between">
<div className="flex items-center gap-md">
<div className="w-10 h-10 bg-accent-purple/10 rounded-full flex items-center justify-center text-accent-purple">
<span className="material-symbols-outlined" data-icon="stars" style={{"fontVariationSettings": "\'FILL\' 1"}}>stars</span>
</div>
<div>
<p className="font-body-md font-bold text-on-surface">Super Premium</p>
<p className="text-body-sm text-on-surface-variant">Tier 2 Placements</p>
</div>
</div>
<span className="font-headline-sm">8</span>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-4 bg-primary text-on-primary p-md rounded-xl relative overflow-hidden">

<div className="relative z-10 flex flex-col h-full">
<p className="font-label-md uppercase opacity-80 mb-md">Current Incentive</p>
<div className="font-display-lg text-display-lg mb-base">₹ 14,250</div>
<p className="font-body-sm opacity-90 mb-xl">Estimated payout for current month</p>
<div className="mt-auto space-y-md">
<div className="flex justify-between items-center text-body-sm">
<span>Base Match Commission</span>
<span className="font-mono-data">₹ 8,400</span>
</div>
<div className="flex justify-between items-center text-body-sm">
<span>Performance Bonus</span>
<span className="font-mono-data">₹ 4,000</span>
</div>
<div className="flex justify-between items-center text-body-sm">
<span>SLA Multiplier (1.1x)</span>
<span className="font-mono-data">₹ 1,850</span>
</div>
</div>
</div>
</div>

<div className="col-span-12 bg-accent-purple/5 border border-accent-purple/20 p-md rounded-xl purple-accent-glow">
<div className="flex items-center gap-md mb-md">
<span className="material-symbols-outlined text-accent-purple" data-icon="notifications_active">notifications_active</span>
<h3 className="font-headline-sm text-accent-purple">Commission Triggers <span className="text-body-md font-normal text-on-surface-variant ml-sm">(4 events pending validation)</span></h3>
</div>
<div className="grid grid-cols-1 md:grid-cols-4 gap-md">
<div className="bg-surface p-sm rounded-lg border border-outline-variant flex flex-col gap-xs">
<span className="text-body-sm font-bold">Rajesh Kumar</span>
<span className="text-[10px] text-on-surface-variant uppercase tracking-wider">FM Commission</span>
<span className="text-accent-purple font-mono-data">₹ 1,200</span>
</div>
<div className="bg-surface p-sm rounded-lg border border-outline-variant flex flex-col gap-xs">
<span className="text-body-sm font-bold">Arun V.</span>
<span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Assoc Commission</span>
<span className="text-accent-purple font-mono-data">₹ 800</span>
</div>
<div className="bg-surface p-sm rounded-lg border border-outline-variant flex flex-col gap-xs">
<span className="text-body-sm font-bold">Satnam Singh</span>
<span className="text-[10px] text-on-surface-variant uppercase tracking-wider">FM Commission</span>
<span className="text-accent-purple font-mono-data">₹ 1,200</span>
</div>
<div className="bg-surface p-sm rounded-lg border border-outline-variant flex flex-col gap-xs">
<span className="text-body-sm font-bold">Vikram Aditya</span>
<span className="text-[10px] text-on-surface-variant uppercase tracking-wider">Assoc Commission</span>
<span className="text-accent-purple font-mono-data">₹ 800</span>
</div>
</div>
</div>

<div className="col-span-12 bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
<div className="p-md border-b border-outline-variant flex justify-between items-center">
<h3 className="font-headline-sm">Recent Placements</h3>
<button className="text-primary font-bold text-body-sm flex items-center gap-xs">
                        Export CSV
                        <span className="material-symbols-outlined text-[18px]" data-icon="download">download</span>
</button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low">
<th className="px-md py-sm font-label-md text-on-surface-variant uppercase">Date</th>
<th className="px-md py-sm font-label-md text-on-surface-variant uppercase">Driver</th>
<th className="px-md py-sm font-label-md text-on-surface-variant uppercase">Transporter</th>
<th className="px-md py-sm font-label-md text-on-surface-variant uppercase">Job Type</th>
<th className="px-md py-sm font-label-md text-on-surface-variant uppercase">SLA Met?</th>
<th className="px-md py-sm font-label-md text-on-surface-variant uppercase">FM/Assoc Status</th>
<th className="px-md py-sm font-label-md text-on-surface-variant uppercase">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-variant transition-colors group">
<td className="px-md py-md font-mono-data">24 Oct 2023</td>
<td className="px-md py-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary text-[10px]">PK</div>
<span className="font-bold">Pawan Kumar</span>
</div>
</td>
<td className="px-md py-md text-on-surface-variant">BlueDart Logistics</td>
<td className="px-md py-md">
<span className="px-xs py-[2px] bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded">Long Haul</span>
</td>
<td className="px-md py-md">
<span className="flex items-center gap-xs text-primary">
<span className="material-symbols-outlined text-[18px]" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span>
<span className="text-body-sm font-bold">Yes</span>
</span>
</td>
<td className="px-md py-md">
<span className="px-xs py-[2px] border border-accent-purple text-accent-purple text-[11px] font-bold rounded">FM Triggered</span>
</td>
<td className="px-md py-md">
<button className="p-1 hover:bg-surface-container rounded transition-colors text-outline">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-variant transition-colors group">
<td className="px-md py-md font-mono-data">23 Oct 2023</td>
<td className="px-md py-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-secondary-fixed flex items-center justify-center font-bold text-secondary text-[10px]">MS</div>
<span className="font-bold">Manjit Singh</span>
</div>
</td>
<td className="px-md py-md text-on-surface-variant">V-Trans Ltd.</td>
<td className="px-md py-md">
<span className="px-xs py-[2px] bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded">Short Haul</span>
</td>
<td className="px-md py-md">
<span className="flex items-center gap-xs text-primary">
<span className="material-symbols-outlined text-[18px]" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span>
<span className="text-body-sm font-bold">Yes</span>
</span>
</td>
<td className="px-md py-md">
<span className="px-xs py-[2px] bg-surface-variant text-on-surface-variant text-[11px] font-bold rounded uppercase">Standard</span>
</td>
<td className="px-md py-md">
<button className="p-1 hover:bg-surface-container rounded transition-colors text-outline">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-variant transition-colors group">
<td className="px-md py-md font-mono-data">22 Oct 2023</td>
<td className="px-md py-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-accent-purple/20 flex items-center justify-center font-bold text-accent-purple text-[10px]">RA</div>
<span className="font-bold">Rishi Agarwal</span>
</div>
</td>
<td className="px-md py-md text-on-surface-variant">Mahindra Logistics</td>
<td className="px-md py-md">
<span className="px-xs py-[2px] bg-primary-fixed text-on-primary-fixed-variant text-[11px] font-bold rounded">Express</span>
</td>
<td className="px-md py-md">
<span className="flex items-center gap-xs text-error">
<span className="material-symbols-outlined text-[18px]" data-icon="cancel" style={{"fontVariationSettings": "\'FILL\' 1"}}>cancel</span>
<span className="text-body-sm font-bold">No</span>
</span>
</td>
<td className="px-md py-md">
<span className="px-xs py-[2px] border border-accent-purple text-accent-purple text-[11px] font-bold rounded">Assoc Triggered</span>
</td>
<td className="px-md py-md">
<button className="p-1 hover:bg-surface-container rounded transition-colors text-outline">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
<tr className="hover:bg-surface-variant transition-colors group">
<td className="px-md py-md font-mono-data">21 Oct 2023</td>
<td className="px-md py-md">
<div className="flex items-center gap-sm">
<div className="w-8 h-8 rounded-full bg-primary-fixed flex items-center justify-center font-bold text-primary text-[10px]">DS</div>
<span className="font-bold">Deepak Sharma</span>
</div>
</td>
<td className="px-md py-md text-on-surface-variant">SafeXpress</td>
<td className="px-md py-md">
<span className="px-xs py-[2px] bg-secondary-container text-on-secondary-container text-[11px] font-bold rounded">Long Haul</span>
</td>
<td className="px-md py-md">
<span className="flex items-center gap-xs text-primary">
<span className="material-symbols-outlined text-[18px]" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span>
<span className="text-body-sm font-bold">Yes</span>
</span>
</td>
<td className="px-md py-md">
<span className="px-xs py-[2px] bg-surface-variant text-on-surface-variant text-[11px] font-bold rounded uppercase">Standard</span>
</td>
<td className="px-md py-md">
<button className="p-1 hover:bg-surface-container rounded transition-colors text-outline">
<span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-md border-t border-outline-variant flex justify-center">
<button className="font-bold text-primary hover:underline text-body-md">View All Placements</button>
</div>
</div>
</div>
</main>
  );
};

export default MmPlacementHistory;
