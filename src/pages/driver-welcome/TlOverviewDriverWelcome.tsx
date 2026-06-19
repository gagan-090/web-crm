import React from 'react';

export const TlOverviewDriverWelcome: React.FC = () => {
  return (
    <div className="space-y-lg max-w-7xl mx-auto w-full">

<div className="grid grid-cols-12 gap-lg mb-xl">

<div className="col-span-12 lg:col-span-8 bg-white border border-outline-variant p-lg rounded-xl flex flex-col justify-between">
<div className="flex justify-between items-start mb-md">
<div>
<h2 className="font-headline-sm text-headline-sm text-primary mb-1">Team Revenue — Driver Welcome</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Daily cumulative performance against target</p>
</div>
<span className="bg-primary/10 text-primary font-label-md text-label-md px-md py-sm rounded-full">LIVE TRACKING</span>
</div>
<div className="flex items-end gap-lg mb-lg">
<div>
<p className="font-label-md text-label-md text-on-surface-variant uppercase mb-xs">Current Revenue</p>
<p className="font-display-lg text-display-lg text-on-surface">₹1,42,000</p>
</div>
<div className="pb-1">
<span className="text-primary font-bold">/</span>
<span className="font-headline-md text-headline-md text-on-surface-variant ml-2">₹2,00,000</span>
</div>
<div className="ml-auto text-right">
<p className="font-label-md text-label-md text-primary uppercase mb-xs">Efficiency</p>
<p className="font-headline-md text-headline-md text-primary">71%</p>
</div>
</div>
<div className="w-full h-3 rounded-full overflow-hidden bg-white">
<div className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" style={{"width": "71%"}}></div>
</div>
</div>

<div className="col-span-12 lg:col-span-4 bg-white border border-outline-variant p-lg rounded-xl grid grid-cols-2 gap-md">
<div className="p-md rounded-lg border border-outline-variant/30 bg-white">
<p className="font-label-md text-label-md text-on-surface-variant mb-xs">Total Calls</p>
<p className="font-headline-md text-headline-md">1,842</p>
<div className="mt-sm flex items-center gap-1 text-primary">
<span className="material-symbols-outlined text-[14px]">trending_up</span>
<span className="text-[12px] font-bold">+12% vs. LW</span>
</div>
</div>
<div className="p-md rounded-lg border border-outline-variant/30 bg-white">
<p className="font-label-md text-label-md text-on-surface-variant mb-xs">Avg Handling</p>
<p className="font-headline-md text-headline-md">3:42s</p>
<div className="mt-sm flex items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-[14px]">timer</span>
<span className="text-[12px] font-bold">-0:15s</span>
</div>
</div>
<div className="p-md rounded-lg border border-outline-variant/30 bg-white">
<p className="font-label-md text-label-md text-on-surface-variant mb-xs">SLA Compliance</p>
<p className="font-headline-md text-headline-md text-primary">94.2%</p>
<div className="mt-sm w-full h-1 bg-surface-container-highest rounded-full">
<div className="h-full bg-primary rounded-full" style={{"width": "94.2%"}}></div>
</div>
</div>
<div className="p-md rounded-lg border border-outline-variant/30 bg-white">
<p className="font-label-md text-label-md text-on-surface-variant mb-xs">Conversion</p>
<p className="font-headline-md text-headline-md text-on-surface">18.5%</p>
<div className="mt-sm flex items-center gap-1 text-on-surface-variant">
<span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
<span className="text-[12px] font-bold">Stable</span>
</div>
</div>
</div>
</div>

<section className="mb-xl">
<div className="flex justify-between items-center mb-md">
<h3 className="font-headline-sm text-headline-sm">My Team Status <span className="text-on-surface-variant font-body-md text-body-md ml-2">(7 Active Callers)</span></h3>
<div className="flex gap-sm">
<button className="bg-white border border-outline-variant px-md py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors">Filters</button>
<button className="bg-white border border-outline-variant px-md py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors">Export CSV</button>
</div>
</div>
<div className="flex gap-md overflow-x-auto pb-md hide-scrollbar">


                            <div className="min-w-[180px] w-[180px] bg-white border border-outline-variant p-md rounded-lg hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                <div className="flex justify-between items-start mb-sm">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold font-label-md">R</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-outline-variant/30 bg-blue-50 text-blue-600">Primary</span>
                                </div>
                                <h4 className="font-body-md font-bold mb-xs">Rahul S.</h4>
                                <div className="flex items-center gap-1 mb-md">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span className="text-body-sm text-on-surface-variant font-label-md">In Call</span>
                                </div>
                                <div className="space-y-2 border-t border-outline-variant/30 pt-sm">
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Calls</span>
                                        <span className="font-bold">42</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Rev</span>
                                        <span className="font-bold text-primary">₹28k</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Queue</span>
                                        <span className="font-bold text-error">3</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Conv</span>
                                        <span className="font-bold">22%</span>
                                    </div>
                                </div>
                            </div>
                        
                            <div className="min-w-[180px] w-[180px] bg-white border border-outline-variant p-md rounded-lg hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                <div className="flex justify-between items-start mb-sm">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold font-label-md">A</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-outline-variant/30 bg-blue-50 text-blue-600">Primary</span>
                                </div>
                                <h4 className="font-body-md font-bold mb-xs">Ananya M.</h4>
                                <div className="flex items-center gap-1 mb-md">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-body-sm text-on-surface-variant font-label-md">Available</span>
                                </div>
                                <div className="space-y-2 border-t border-outline-variant/30 pt-sm">
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Calls</span>
                                        <span className="font-bold">38</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Rev</span>
                                        <span className="font-bold text-primary">₹24k</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Queue</span>
                                        <span className="font-bold text-error">0</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Conv</span>
                                        <span className="font-bold">19%</span>
                                    </div>
                                </div>
                            </div>
                        
                            <div className="min-w-[180px] w-[180px] bg-white border border-outline-variant p-md rounded-lg hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                <div className="flex justify-between items-start mb-sm">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold font-label-md">V</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-outline-variant/30 bg-blue-50 text-blue-600">Primary</span>
                                </div>
                                <h4 className="font-body-md font-bold mb-xs">Vikram K.</h4>
                                <div className="flex items-center gap-1 mb-md">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span className="text-body-sm text-on-surface-variant font-label-md">In Call</span>
                                </div>
                                <div className="space-y-2 border-t border-outline-variant/30 pt-sm">
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Calls</span>
                                        <span className="font-bold">45</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Rev</span>
                                        <span className="font-bold text-primary">₹31k</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Queue</span>
                                        <span className="font-bold text-error">5</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Conv</span>
                                        <span className="font-bold">24%</span>
                                    </div>
                                </div>
                            </div>
                        
                            <div className="min-w-[180px] w-[180px] bg-white border border-outline-variant p-md rounded-lg hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                <div className="flex justify-between items-start mb-sm">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold font-label-md">P</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-outline-variant/30 bg-blue-50 text-blue-600">Primary</span>
                                </div>
                                <h4 className="font-body-md font-bold mb-xs">Priya D.</h4>
                                <div className="flex items-center gap-1 mb-md">
                                    <div className="h-2 w-2 rounded-full bg-on-error-container"></div>
                                    <span className="text-body-sm text-on-surface-variant font-label-md">Break</span>
                                </div>
                                <div className="space-y-2 border-t border-outline-variant/30 pt-sm">
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Calls</span>
                                        <span className="font-bold">35</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Rev</span>
                                        <span className="font-bold text-primary">₹19k</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Queue</span>
                                        <span className="font-bold text-error">0</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Conv</span>
                                        <span className="font-bold">18%</span>
                                    </div>
                                </div>
                            </div>
                        
                            <div className="min-w-[180px] w-[180px] bg-white border border-outline-variant p-md rounded-lg hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                <div className="flex justify-between items-start mb-sm">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold font-label-md">S</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-outline-variant/30 bg-surface-container-high text-on-surface-variant">Backup</span>
                                </div>
                                <h4 className="font-body-md font-bold mb-xs">Sameer V.</h4>
                                <div className="flex items-center gap-1 mb-md">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span className="text-body-sm text-on-surface-variant font-label-md">In Call</span>
                                </div>
                                <div className="space-y-2 border-t border-outline-variant/30 pt-sm">
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Calls</span>
                                        <span className="font-bold">12</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Rev</span>
                                        <span className="font-bold text-primary">₹8k</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Queue</span>
                                        <span className="font-bold text-error">1</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Conv</span>
                                        <span className="font-bold">15%</span>
                                    </div>
                                </div>
                            </div>
                        
                            <div className="min-w-[180px] w-[180px] bg-white border border-outline-variant p-md rounded-lg hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                <div className="flex justify-between items-start mb-sm">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold font-label-md">N</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-outline-variant/30 bg-surface-container-high text-on-surface-variant">Backup</span>
                                </div>
                                <h4 className="font-body-md font-bold mb-xs">Neha L.</h4>
                                <div className="flex items-center gap-1 mb-md">
                                    <div className="h-2 w-2 rounded-full bg-green-500"></div>
                                    <span className="text-body-sm text-on-surface-variant font-label-md">Available</span>
                                </div>
                                <div className="space-y-2 border-t border-outline-variant/30 pt-sm">
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Calls</span>
                                        <span className="font-bold">15</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Rev</span>
                                        <span className="font-bold text-primary">₹10k</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Queue</span>
                                        <span className="font-bold text-error">0</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Conv</span>
                                        <span className="font-bold">16%</span>
                                    </div>
                                </div>
                            </div>
                        
                            <div className="min-w-[180px] w-[180px] bg-white border border-outline-variant p-md rounded-lg hover:shadow-lg transition-all duration-300 group cursor-pointer">
                                <div className="flex justify-between items-start mb-sm">
                                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                                        <span className="text-primary font-bold font-label-md">A</span>
                                    </div>
                                    <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-outline-variant/30 bg-surface-container-high text-on-surface-variant">SC</span>
                                </div>
                                <h4 className="font-body-md font-bold mb-xs">Arjun R.</h4>
                                <div className="flex items-center gap-1 mb-md">
                                    <div className="h-2 w-2 rounded-full bg-primary"></div>
                                    <span className="text-body-sm text-on-surface-variant font-label-md">In Call</span>
                                </div>
                                <div className="space-y-2 border-t border-outline-variant/30 pt-sm">
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Calls</span>
                                        <span className="font-bold">28</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Rev</span>
                                        <span className="font-bold text-primary">₹22k</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Queue</span>
                                        <span className="font-bold text-error">2</span>
                                    </div>
                                    <div className="flex justify-between text-body-sm">
                                        <span className="text-on-surface-variant">Conv</span>
                                        <span className="font-bold">28%</span>
                                    </div>
                                </div>
                            </div>
                        
</div>
</section>

<section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
<div className="p-lg border-b border-outline-variant flex justify-between items-center">
<h3 className="font-headline-sm text-headline-sm">Callbacks Due Today</h3>
<div className="flex items-center gap-md">
<span className="text-body-sm text-on-surface-variant">Showing 14 critical cases</span>
<button className="bg-primary text-white font-label-md text-label-md px-md py-sm rounded-lg hover:brightness-110 transition-colors">Action All</button>
</div>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-white">
<tr>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant">Driver ID</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant">Name</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant">Scheduled Time</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant">Assigned To</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant">Priority</th>
<th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant">Action</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-md font-mono-data text-mono-data">#DRV-98421</td>
<td className="px-lg py-md font-body-md">Suresh Mahajan</td>
<td className="px-lg py-md font-body-md">14:30 PM <span className="text-error font-bold text-xs ml-2">(EXPIRED)</span></td>
<td className="px-lg py-md font-body-md">Rahul S.</td>
<td className="px-lg py-md">
<span className="bg-error-container text-on-error-container text-[10px] font-bold px-md py-xs rounded">CRITICAL</span>
</td>
<td className="px-lg py-md">
<button className="text-primary font-bold text-body-sm hover:underline">Re-assign</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-md font-mono-data text-mono-data">#DRV-98445</td>
<td className="px-lg py-md font-body-md">Manish Verma</td>
<td className="px-lg py-md font-body-md">16:45 PM</td>
<td className="px-lg py-md font-body-md">Ananya M.</td>
<td className="px-lg py-md">
<span className="bg-primary/10 text-primary text-[10px] font-bold px-md py-xs rounded">MEDIUM</span>
</td>
<td className="px-lg py-md">
<button className="text-primary font-bold text-body-sm hover:underline">Re-assign</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-lg py-md font-mono-data text-mono-data">#DRV-98502</td>
<td className="px-lg py-md font-body-md">Kiran Patil</td>
<td className="px-lg py-md font-body-md">17:15 PM</td>
<td className="px-lg py-md font-body-md">Arjun R.</td>
<td className="px-lg py-md">
<span className="bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-md py-xs rounded">LOW</span>
</td>
<td className="px-lg py-md">
<button className="text-primary font-bold text-body-sm hover:underline">Re-assign</button>
</td>
</tr>
</tbody>
</table>
</div>
<div className="p-md border-t border-outline-variant text-center bg-white">
<button className="text-primary font-label-md text-label-md hover:underline">View All 11 Pending Callbacks</button>
</div>
</section>
</div>
  );
};

export default TlOverviewDriverWelcome;
