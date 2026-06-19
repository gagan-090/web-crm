import React from 'react';

export const WctPerformanceStats: React.FC = () => {
  return (
    <main className=" mt-16 p-8 min-h-screen bg-surface-container-lowest">

<div className="flex justify-between items-end mb-8">
<div>
<h1 className="font-display-lg text-display-lg mb-1">My Performance</h1>
<p className="font-body-md text-on-surface-variant">Track your efficiency and incentive goals</p>
</div>
<div className="bg-primary-container/10 border border-primary-container/20 px-6 py-4 rounded-xl flex items-center gap-4">
<div className="w-12 h-12 bg-primary-container rounded-full flex items-center justify-center text-white">
<span className="material-symbols-outlined" style={{"fontVariationSettings": "\'FILL\' 1"}}>emoji_events</span>
</div>
<div>
<p className="font-label-md text-label-md uppercase tracking-wider text-primary">Leaderboard Position</p>
<p className="font-headline-sm text-headline-sm font-bold">#3 in WCT Team</p>
</div>
</div>
</div>

<div className="grid grid-cols-12 gap-6">

<div className="col-span-12 lg:col-span-4 bg-white border border-outline-variant p-6 rounded-xl flex flex-col justify-between">
<div>
<h3 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-4">Monthly Target</h3>
<div className="flex items-baseline gap-2 mb-2">
<span className="font-display-lg text-display-lg font-bold accent-orange">₹48,250</span>
<span className="font-body-md text-on-surface-variant">/ ₹67,000</span>
</div>
<div className="w-full bg-surface-container h-3 rounded-full overflow-hidden mb-6">
<div className="bg-accent-orange h-full rounded-full" style={{"width": "72%"}}></div>
</div>
</div>
<div className="grid grid-cols-2 gap-4 border-t border-outline-variant pt-4">
<div>
<p className="font-label-md text-label-md text-on-surface-variant">Conversion Rate</p>
<p className="font-headline-sm text-headline-sm font-bold">14.2%</p>
<p className="font-body-sm text-emerald-600">Target ≥12%</p>
</div>
<div>
<p className="font-label-md text-label-md text-on-surface-variant">Remaining</p>
<p className="font-headline-sm text-headline-sm font-bold text-on-surface-variant">₹18,750</p>
<p className="font-body-sm text-on-surface-variant">12 Days Left</p>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-8 bg-white border border-outline-variant p-6 rounded-xl">
<div className="flex justify-between items-start mb-6">
<div>
<h3 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-1">SLA Compliance</h3>
<p className="font-body-md font-semibold">91.3% of TR leads called within 4 hours</p>
</div>
<div className="flex items-center gap-2 px-3 py-1 bg-orange-100 text-orange-800 rounded-full">
<span className="material-symbols-outlined text-[18px]" style={{"fontVariationSettings": "\'FILL\' 1"}}>local_fire_department</span>
<span className="font-label-md text-label-md">14 Day Streak</span>
</div>
</div>

<div className="grid grid-cols-7 gap-2">

<div className="text-center font-label-md text-on-surface-variant">M</div>
<div className="text-center font-label-md text-on-surface-variant">T</div>
<div className="text-center font-label-md text-on-surface-variant">W</div>
<div className="text-center font-label-md text-on-surface-variant">T</div>
<div className="text-center font-label-md text-on-surface-variant">F</div>
<div className="text-center font-label-md text-on-surface-variant">S</div>
<div className="text-center font-label-md text-on-surface-variant">S</div>

<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border border-emerald-200">1</div>
<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border border-emerald-200">2</div>
<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border border-emerald-200">3</div>
<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border border-emerald-200">4</div>
<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border border-emerald-200">5</div>
<div className="h-10 flex items-center justify-center bg-surface-container rounded font-mono-data text-mono-data">6</div>
<div className="h-10 flex items-center justify-center bg-surface-container rounded font-mono-data text-mono-data">7</div>

<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border border-emerald-200">8</div>
<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border border-emerald-200">9</div>
<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border border-emerald-200">10</div>
<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border border-emerald-200">11</div>
<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border border-emerald-200">12</div>
<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border border-emerald-200">13</div>
<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border border-emerald-200">14</div>

<div className="h-10 flex items-center justify-center bg-emerald-100 text-emerald-800 rounded font-mono-data text-mono-data border-2 border-accent-orange">15</div>
<div className="h-10 flex items-center justify-center bg-surface-container-low rounded font-mono-data text-mono-data text-on-surface-variant opacity-50">16</div>
<div className="h-10 flex items-center justify-center bg-surface-container-low rounded font-mono-data text-mono-data text-on-surface-variant opacity-50">17</div>
<div className="h-10 flex items-center justify-center bg-surface-container-low rounded font-mono-data text-mono-data text-on-surface-variant opacity-50">18</div>
<div className="h-10 flex items-center justify-center bg-surface-container-low rounded font-mono-data text-mono-data text-on-surface-variant opacity-50">19</div>
<div className="h-10 flex items-center justify-center bg-surface-container-low rounded font-mono-data text-mono-data text-on-surface-variant opacity-50">20</div>
<div className="h-10 flex items-center justify-center bg-surface-container-low rounded font-mono-data text-mono-data text-on-surface-variant opacity-50">21</div>
</div>
</div>

<div className="col-span-12 lg:col-span-5 bg-white border border-outline-variant p-6 rounded-xl">
<h3 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant mb-6">Incentive Simulator</h3>
<div className="space-y-8">
<div>
<div className="flex justify-between mb-2">
<label className="font-body-md font-medium">Free Plan Credits</label>
<span className="font-mono-data text-mono-data text-accent-orange" id="free-count">12</span>
</div>
<input className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-orange" id="free-slider" max="100" min="0" type="range" value="12"/>
</div>
<div>
<div className="flex justify-between mb-2">
<label className="font-body-md font-medium">Premium Conversions</label>
<span className="font-mono-data text-mono-data text-accent-orange" id="premium-count">4</span>
</div>
<input className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-orange" id="premium-slider" max="50" min="0" type="range" value="4"/>
</div>
<div>
<div className="flex justify-between mb-2">
<label className="font-body-md font-medium">Super Premium Conversions</label>
<span className="font-mono-data text-mono-data text-accent-orange" id="super-count">2</span>
</div>
<input className="w-full h-1.5 bg-surface-container rounded-lg appearance-none cursor-pointer accent-orange" id="super-slider" max="25" min="0" type="range" value="2"/>
</div>
<div className="pt-6 border-t border-outline-variant">
<div className="flex justify-between items-center">
<span className="font-headline-sm text-headline-sm">Projected Earnings</span>
<span className="font-display-lg text-display-lg font-bold accent-orange" id="total-projected">₹1,040</span>
</div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-7 bg-white border border-outline-variant rounded-xl overflow-hidden">
<div className="p-6 border-b border-outline-variant bg-surface-container-low">
<h3 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Incentive Structure</h3>
</div>
<table className="w-full text-left font-body-md">
<thead>
<tr className="bg-surface-container-low/50 text-on-surface-variant">
<th className="px-6 py-3 font-medium">Plan Type</th>
<th className="px-6 py-3 font-medium">Payout Per Unit</th>
<th className="px-6 py-3 font-medium text-right">Criteria</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-blue-400"></span>
                                    Free Plan Credit
                                </div>
</td>
<td className="px-6 py-4 font-mono-data">₹20</td>
<td className="px-6 py-4 text-right text-on-surface-variant">First Call Success</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-accent-orange"></span>
                                    Premium Plan
                                </div>
</td>
<td className="px-6 py-4 font-mono-data">₹100</td>
<td className="px-6 py-4 text-right text-on-surface-variant">Annual Subscription</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-6 py-4">
<div className="flex items-center gap-2">
<span className="w-2 h-2 rounded-full bg-purple-500"></span>
                                    Super Premium
                                </div>
</td>
<td className="px-6 py-4 font-mono-data">₹200</td>
<td className="px-6 py-4 text-right text-on-surface-variant">Enterprise Onboard</td>
</tr>
</tbody>
</table>
<div className="p-6 bg-surface-container-low/30">
<div className="flex items-start gap-4">
<span className="material-symbols-outlined text-primary-container">info</span>
<p className="font-body-sm text-on-surface-variant">Incentives are credited within 24 hours of successful conversion verification. Refer to the Script Library to improve your conversion rates for Super Premium plans.</p>
</div>
</div>
</div>
</div>
</main>
  );
};

export default WctPerformanceStats;
