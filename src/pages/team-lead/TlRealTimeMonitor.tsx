import React from 'react';

export const TlRealTimeMonitor: React.FC = () => {
  return (
    <main className=" custom-scrollbar p-lg flex flex-col gap-lg bg-white">

<div className="flex justify-between items-end">
<div>
<div className="flex items-center gap-sm">
<h1 className="font-display-lg text-display-lg text-on-surface">Team Monitor</h1>
<div className="flex items-center gap-xs px-sm py-[2px] rounded-full border border-primary/20 bg-primary/5 text-primary">
<span className="w-2 h-2 rounded-full bg-primary live-indicator-pulse" style={{"opacity": 1}}></span>
<span className="text-label-md font-bold">LIVE</span>
</div>
</div>
<p className="text-body-md text-on-surface-variant">Real-time oversight of current active shifts and call distribution.</p>
</div>
<div className="flex gap-sm">
<div className="p-sm bg-surface-container-low border border-outline-variant rounded flex flex-col">
<span className="text-label-md text-on-surface-variant">Active Callers</span>
<span className="text-headline-sm font-headline-sm text-primary">24 / 30</span>
</div>
<div className="p-sm bg-surface-container-low border border-outline-variant rounded flex flex-col">
<span className="text-label-md text-on-surface-variant">Avg. Queue Wait</span>
<span className="text-headline-sm font-headline-sm text-primary">02:14</span>
</div>
</div>
</div>
<div className="flex gap-lg flex-1 min-h-0">

<div className="flex-1 flex flex-col gap-lg min-w-0 overflow-y-auto custom-scrollbar pr-2">

<section className="bg-surface border border-outline-variant rounded-lg overflow-hidden shrink-0">
<div className="px-md py-sm bg-surface-container border-b border-outline-variant flex justify-between items-center">
<h3 className="font-headline-sm text-[16px]">Active Team Roster</h3>
<span className="material-symbols-outlined text-on-surface-variant text-[18px]">filter_list</span>
</div>
<div className="overflow-x-auto">
<table className="w-full border-collapse">
<thead className="bg-surface-container-low text-label-md text-on-surface-variant uppercase tracking-wider">
<tr>
<th className="px-md py-sm text-left font-semibold">Caller</th>
<th className="px-md py-sm text-left font-semibold">Role</th>
<th className="px-md py-sm text-left font-semibold">Status</th>
<th className="px-md py-sm text-left font-semibold">Lead TMID</th>
<th className="px-md py-sm text-left font-semibold">Queue Depth</th>
<th className="px-md py-sm text-right font-semibold">Calls Today</th>
<th className="px-md py-sm text-right font-semibold">Revenue Today</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant text-body-md">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-sm font-medium">Alex Rivera</td>
<td className="px-md py-sm text-on-surface-variant">Senior Agent</td>
<td className="px-md py-sm"><span className="px-sm py-[2px] rounded-sm bg-green-100 text-green-700 text-[10px] font-bold uppercase">Active</span></td>
<td className="px-md py-sm font-mono-data">TM-8821</td>
<td className="px-md py-sm w-32">
<div className="h-2 w-full bg-outline-variant rounded-full overflow-hidden">
<div className="h-full bg-primary-container" style={{"width": "75%"}}></div>
</div>
</td>
<td className="px-md py-sm text-right font-mono-data">42</td>
<td className="px-md py-sm text-right font-mono-data">₹1,240.00</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-sm font-medium">Sarah Chen</td>
<td className="px-md py-sm text-on-surface-variant">Specialist</td>
<td className="px-md py-sm"><span className="px-sm py-[2px] rounded-sm bg-green-100 text-green-700 text-[10px] font-bold uppercase">Active</span></td>
<td className="px-md py-sm font-mono-data">TM-8822</td>
<td className="px-md py-sm w-32">
<div className="h-2 w-full bg-outline-variant rounded-full overflow-hidden">
<div className="h-full bg-primary-container" style={{"width": "30%"}}></div>
</div>
</td>
<td className="px-md py-sm text-right font-mono-data">28</td>
<td className="px-md py-sm text-right font-mono-data">₹980.50</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-sm font-medium">Marcus Thorne</td>
<td className="px-md py-sm text-on-surface-variant">Lead Tier 2</td>
<td className="px-md py-sm"><span className="px-sm py-[2px] rounded-sm bg-error-container text-on-error-container text-[10px] font-bold uppercase">On Break</span></td>
<td className="px-md py-sm font-mono-data">TM-9004</td>
<td className="px-md py-sm w-32">
<div className="h-2 w-full bg-outline-variant rounded-full overflow-hidden">
<div className="h-full bg-error" style={{"width": "95%"}}></div>
</div>
</td>
<td className="px-md py-sm text-right font-mono-data">56</td>
<td className="px-md py-sm text-right font-mono-data">₹3,100.20</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="px-md py-sm font-medium">Elena Rodriguez</td>
<td className="px-md py-sm text-on-surface-variant">Agent</td>
<td className="px-md py-sm"><span className="px-sm py-[2px] rounded-sm bg-green-100 text-green-700 text-[10px] font-bold uppercase">Active</span></td>
<td className="px-md py-sm font-mono-data">TM-8850</td>
<td className="px-md py-sm w-32">
<div className="h-2 w-full bg-outline-variant rounded-full overflow-hidden">
<div className="h-full bg-primary-container" style={{"width": "45%"}}></div>
</div>
</td>
<td className="px-md py-sm text-right font-mono-data">19</td>
<td className="px-md py-sm text-right font-mono-data">₹415.00</td>
</tr>
</tbody>
</table>
</div>
</section>

<section className="bg-surface border border-outline-variant rounded-lg overflow-hidden">
<div className="px-md py-sm bg-surface-container border-b border-outline-variant">
<h3 className="font-headline-sm text-[16px]">Recent Activity Log (Live)</h3>
</div>
<div className="overflow-x-auto h-[400px] custom-scrollbar">
<table className="w-full border-collapse">
<thead className="sticky top-0 bg-surface-container-low text-label-md text-on-surface-variant uppercase z-10">
<tr>
<th className="px-md py-sm text-left">Timestamp</th>
<th className="px-md py-sm text-left">Caller ID</th>
<th className="px-md py-sm text-left">Customer Origin</th>
<th className="px-md py-sm text-left">Duration</th>
<th className="px-md py-sm text-left">Outcome</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant text-body-sm">


                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:39:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77100</td>
                                                    <td className="px-md py-sm">Chicago, IL</td>
                                                    <td className="px-md py-sm">03:16</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-green-100 text-green-700">Connected</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:37:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77101</td>
                                                    <td className="px-md py-sm">Memphis, TN</td>
                                                    <td className="px-md py-sm">04:54</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-primary-container/20 text-on-primary-container border border-primary-container">Converted</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:35:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77102</td>
                                                    <td className="px-md py-sm">Phoenix, AZ</td>
                                                    <td className="px-md py-sm">04:01</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-surface-variant text-on-surface-variant">NR</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:33:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77103</td>
                                                    <td className="px-md py-sm">Dallas, TX</td>
                                                    <td className="px-md py-sm">03:01</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-green-100 text-green-700">Connected</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:31:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77104</td>
                                                    <td className="px-md py-sm">Seattle, WA</td>
                                                    <td className="px-md py-sm">00:32</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-green-100 text-green-700">Connected</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:29:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77105</td>
                                                    <td className="px-md py-sm">Chicago, IL</td>
                                                    <td className="px-md py-sm">03:46</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-primary-container/20 text-on-primary-container border border-primary-container">Converted</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:27:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77106</td>
                                                    <td className="px-md py-sm">Memphis, TN</td>
                                                    <td className="px-md py-sm">01:11</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-surface-variant text-on-surface-variant">NR</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:25:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77107</td>
                                                    <td className="px-md py-sm">Phoenix, AZ</td>
                                                    <td className="px-md py-sm">01:21</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-green-100 text-green-700">Connected</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:23:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77108</td>
                                                    <td className="px-md py-sm">Dallas, TX</td>
                                                    <td className="px-md py-sm">01:08</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-surface-variant text-on-surface-variant">NR</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:21:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77109</td>
                                                    <td className="px-md py-sm">Seattle, WA</td>
                                                    <td className="px-md py-sm">01:08</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-green-100 text-green-700">Connected</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:19:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77110</td>
                                                    <td className="px-md py-sm">Chicago, IL</td>
                                                    <td className="px-md py-sm">04:24</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-surface-variant text-on-surface-variant">NR</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:17:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77111</td>
                                                    <td className="px-md py-sm">Memphis, TN</td>
                                                    <td className="px-md py-sm">00:22</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-green-100 text-green-700">Connected</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:15:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77112</td>
                                                    <td className="px-md py-sm">Phoenix, AZ</td>
                                                    <td className="px-md py-sm">02:06</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-primary-container/20 text-on-primary-container border border-primary-container">Converted</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:13:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77113</td>
                                                    <td className="px-md py-sm">Dallas, TX</td>
                                                    <td className="px-md py-sm">02:04</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-primary-container/20 text-on-primary-container border border-primary-container">Converted</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:11:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77114</td>
                                                    <td className="px-md py-sm">Seattle, WA</td>
                                                    <td className="px-md py-sm">03:14</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-green-100 text-green-700">Connected</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:09:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77115</td>
                                                    <td className="px-md py-sm">Chicago, IL</td>
                                                    <td className="px-md py-sm">03:18</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-green-100 text-green-700">Connected</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:07:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77116</td>
                                                    <td className="px-md py-sm">Memphis, TN</td>
                                                    <td className="px-md py-sm">04:10</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-surface-variant text-on-surface-variant">NR</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:05:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77117</td>
                                                    <td className="px-md py-sm">Phoenix, AZ</td>
                                                    <td className="px-md py-sm">00:02</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-primary-container/20 text-on-primary-container border border-primary-container">Converted</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:03:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77118</td>
                                                    <td className="px-md py-sm">Dallas, TX</td>
                                                    <td className="px-md py-sm">01:19</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-primary-container/20 text-on-primary-container border border-primary-container">Converted</span>
                                                    </td>
                                                </tr>
                                            
                                                <tr className="hover:bg-surface-container-low cursor-pointer">
                                                    <td className="px-md py-sm text-on-surface-variant font-mono-data">12:01:39</td>
                                                    <td className="px-md py-sm font-medium">CID-77119</td>
                                                    <td className="px-md py-sm">Seattle, WA</td>
                                                    <td className="px-md py-sm">03:21</td>
                                                    <td className="px-md py-sm">
                                                        <span className="px-sm py-xs rounded-sm text-[10px] font-bold uppercase bg-surface-variant text-on-surface-variant">NR</span>
                                                    </td>
                                                </tr>
                                            
</tbody>
</table>
</div>
</section>
</div>

<aside className="w-[280px] shrink-0 flex flex-col gap-lg bg-white">

<div className="border border-outline-variant rounded-lg p-md flex flex-col gap-md bg-white">
<h4 className="font-headline-sm text-[16px] text-on-surface">Queue Rebalance</h4>
<div className="flex flex-col gap-sm">
<div className="flex justify-between text-label-md text-on-surface-variant">
<span className="">Wait Time Variance</span>
<span className="text-error">+18.4%</span>
</div>

<div className="flex items-end gap-[4px] h-32 bg-white/50 p-sm rounded border border-outline-variant/30">
<div className="w-full bg-primary/20 h-[40%] rounded-t-sm"></div>
<div className="w-full bg-primary/40 h-[60%] rounded-t-sm"></div>
<div className="w-full bg-primary/60 h-[85%] rounded-t-sm"></div>
<div className="w-full bg-primary h-[55%] rounded-t-sm"></div>
<div className="w-full bg-primary-container h-[95%] rounded-t-sm"></div>
<div className="w-full bg-primary/40 h-[45%] rounded-t-sm"></div>
</div>
<div className="flex justify-between text-[10px] text-on-surface-variant font-mono-data uppercase">
<span className="">Zone A</span>
<span className="">Zone B</span>
<span className="">Zone C</span>
</div>
</div>
<p className="text-body-sm text-on-surface-variant">Queue depth in Zone C exceeds threshold. Manual intervention recommended to maintain SLA.</p>
<button className="w-full bg-primary text-white font-bold py-sm rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-sm">
<span className="material-symbols-outlined text-[18px]">balance</span>
                            Rebalance Queue
                        </button>
</div>

<div className="bg-surface border border-outline-variant rounded-lg p-md">
<div className="flex justify-between items-center mb-sm">
<span className="text-label-md uppercase font-bold text-on-surface-variant">SLA Integrity</span>
<span className="text-label-md text-primary font-mono-data">92%</span>
</div>
<div className="h-3 w-full bg-surface-container-high rounded-full overflow-hidden mb-md">

<div className="h-full bg-gradient-to-r from-green-500 via-primary-container to-error" style={{"width": "92%"}}></div>
</div>
<div className="grid grid-cols-2 gap-sm">
<div className="text-center p-sm bg-surface-container-low rounded">
<div className="text-display-lg text-[20px] leading-tight text-on-surface">14</div>
<div className="text-[10px] text-on-surface-variant uppercase">Critical</div>
</div>
<div className="text-center p-sm bg-surface-container-low rounded">
<div className="text-display-lg text-[20px] leading-tight text-primary">82</div>
<div className="text-[10px] text-on-surface-variant uppercase">On-Track</div>
</div>
</div>
</div>

<div className="bg-surface border border-outline-variant rounded-lg overflow-hidden">
<div className="p-sm bg-surface-container-low border-b border-outline-variant">
<span className="text-label-md font-bold text-on-surface-variant">Fleet Density Map</span>
</div>
<div className="h-40 relative group cursor-pointer">
<div className="w-full h-full bg-cover bg-center transition-transform duration-500 group-hover:scale-105" data-alt="A stylized minimalist digital map showing a high-tech logistics grid of a major metropolitan area. Glowing amber and white nodes represent delivery hubs and active transport units. The map features a clean, high-contrast UI with thin lines and subtle topographic details in a light-mode corporate aesthetic." style={{"backgroundImage": "url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuCf8Qhx8qLfwPl-30VbFJMcsOiswnqxg6oDmuEIwWFZU7WCselmGZHPFL2AvPOgaEjpQFQryaYoPhCT1-9Gy1PPKZtyh2q2sX505sjdLIRb5Dsd8VOzmViepu2T3iBDYBb3grC91uTUYFFVzqbeZETWITbQikFjz1R0RLdIsA0pFTvIMpXQRKlX1_Sog6imV9n_KqMAENP8-x4vTpVPHoTHJrvzhKRVVImicCJQJAQOgASKrnTNi5yazgKrjx-0BZtBVnnDVxtksrE\')"}}></div>
<div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
</div>
</div>
</aside>
</div>

<footer className="border border-outline-variant rounded-lg p-lg grid grid-cols-1 lg:grid-cols-3 gap-lg shrink-0 bg-white">

<div className="lg:col-span-1 border-r border-outline-variant pr-lg">
<h4 className="font-headline-sm text-[16px] mb-md flex items-center gap-sm">
<span className="material-symbols-outlined text-primary">emergency_home</span>
                        Backup Activation
                    </h4>
<div className="space-y-sm">
<div className="flex items-center justify-between p-sm bg-surface border border-outline-variant rounded">
<div className="flex flex-col">
<span className="text-label-md font-bold">External Vendor Pool</span>
<span className="text-body-sm text-on-surface-variant">Relay overflow to partner center</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input className="sr-only peer" type="checkbox" />
<div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
</label>
</div>
<div className="flex items-center justify-between p-sm bg-surface border border-outline-variant rounded">
<div className="flex flex-col">
<span className="text-label-md font-bold">Internal Float Team</span>
<span className="text-body-sm text-on-surface-variant">Activate off-duty roster (1.5x)</span>
</div>
<label className="relative inline-flex items-center cursor-pointer">
<input checked className="sr-only peer" type="checkbox" />
<div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-container"></div>
</label>
</div>
</div>
</div>

<div className="lg:col-span-2">
<h4 className="font-headline-sm text-[16px] mb-md flex items-center gap-sm">
<span className="material-symbols-outlined text-primary">priority_high</span>
                        Funnel Escalation Queue
                    </h4>
<div className="flex gap-md overflow-x-auto pb-sm custom-scrollbar">

<div className="min-w-[200px] bg-error-container/10 border-l-4 border-error p-sm flex flex-col gap-xs rounded-r">
<span className="text-[10px] font-bold text-error uppercase">Level 3 Critical</span>
<span className="text-label-md font-bold">Load #AF-9921</span>
<span className="text-body-sm text-on-surface-variant">Carrier ghosted pick-up. 2h overdue.</span>
</div>
<div className="min-w-[200px] bg-primary-container/10 border-l-4 border-primary-container p-sm flex flex-col gap-xs rounded-r">
<span className="text-[10px] font-bold text-on-primary-container uppercase">Level 2 Warning</span>
<span className="text-label-md font-bold">Route Blockage - NY</span>
<span className="text-body-sm text-on-surface-variant">Snow advisory impacting 14 units.</span>
</div>
<div className="min-w-[200px] bg-primary-container/10 border-l-4 border-primary-container p-sm flex flex-col gap-xs rounded-r">
<span className="text-[10px] font-bold text-on-primary-container uppercase">Level 2 Warning</span>
<span className="text-label-md font-bold">Customs Delay - LAX</span>
<span className="text-body-sm text-on-surface-variant">Documentation mismatch for pallet-4.</span>
</div>
<div className="min-w-[200px] bg-surface-container-highest border-l-4 border-outline p-sm flex flex-col gap-xs rounded-r">
<span className="text-[10px] font-bold text-on-surface-variant uppercase">Level 1 Info</span>
<span className="text-label-md font-bold">Shift Handover</span>
<span className="text-body-sm text-on-surface-variant">Team Beta arriving in 45 mins.</span>
</div>
</div>
</div>
</footer>
</main>
  );
};

export default TlRealTimeMonitor;
