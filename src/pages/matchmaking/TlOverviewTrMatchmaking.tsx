import React from 'react';

export const TlOverviewTrMatchmaking: React.FC = () => {
  return (
    <main className=" flex flex-col bg-surface">



<div className="flex-shrink-0">

<div className="bg-error text-on-error px-margin-desktop py-base flex items-center gap-md">
<span className="material-symbols-outlined" style={{"fontVariationSettings": "\'FILL\' 1"}}>error</span>
<span className="font-label-md uppercase tracking-wider">Critical Action Required:</span>
<span className="font-body-md">14 incoming calls currently untagged in Matchmaking queue. Priority routing at risk.</span>
</div>

<div className="bg-primary-container text-on-primary-container px-margin-desktop py-base flex items-center gap-md">
<span className="material-symbols-outlined" style={{"fontVariationSettings": "\'FILL\' 1"}}>warning</span>
<span className="font-label-md">SLA BREACH RISK:</span>
<span className="font-body-md font-bold italic underline">TR-12094</span>
<span className="font-body-md">has been in queue 2h 47min without first call. Immediate callback required.</span>
</div>
</div>

<div className="flex-1 overflow-y-auto p-margin-desktop space-y-xl">

<div className="grid grid-cols-12 gap-lg">

<div className="col-span-12 lg:col-span-4 bg-surface-container-lowest border border-outline-variant p-lg flex flex-col justify-between h-48">
<div>
<div className="flex justify-between items-start mb-sm">
<span className="text-on-surface-variant font-label-md uppercase tracking-wider">Team Revenue Status</span>
<span className="material-symbols-outlined text-primary">payments</span>
</div>
<div className="flex items-baseline gap-xs">
<span className="font-display-lg text-primary">₹3,85,000</span>
<span className="font-body-md text-on-surface-variant">/ ₹5,50,000</span>
</div>
</div>
<div className="w-full">
<div className="flex justify-between text-xs mb-1">
<span className="font-medium text-primary">70% of Daily Target</span>
<span className="text-on-surface-variant">Target: ₹5.5L</span>
</div>
<div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
<div className="bg-primary h-full" style={{"width": "70%"}}></div>
</div>
</div>
</div>

<div className="col-span-12 lg:col-span-8 grid grid-cols-3 gap-md">
<div className="bg-surface-container border border-outline-variant p-md">
<p className="text-on-surface-variant font-label-md uppercase mb-xs">Active Loads</p>
<p className="font-headline-md">142</p>
<p className="text-[10px] text-primary mt-base">+12 from yesterday</p>
</div>
<div className="bg-surface-container border border-outline-variant p-md">
<p className="text-on-surface-variant font-label-md uppercase mb-xs">Unmatched TRs</p>
<p className="font-headline-md text-error">28</p>
<p className="text-[10px] text-on-error-container mt-base">High Priority Queue</p>
</div>
<div className="bg-surface-container border border-outline-variant p-md">
<p className="text-on-surface-variant font-label-md uppercase mb-xs">Avg Match Time</p>
<p className="font-headline-md">14m</p>
<div className="flex gap-xs items-center mt-base">
<div className="w-1 h-1 bg-green-600 rounded-full"></div>
<p className="text-[10px] text-green-700 font-bold">ON TRACK</p>
</div>
</div>
</div>
</div>

<section>
<div className="flex justify-between items-end mb-md">
<div>
<h2 className="font-headline-md text-on-surface">My Team Status</h2>
<p className="text-on-surface-variant text-body-sm">8 Callers Active (3 Transporter, 4 Matchmaking, 1 Backup)</p>
</div>
<div className="flex gap-xs">
<span className="px-sm py-xs bg-surface-container-high rounded font-label-md text-on-surface-variant cursor-pointer">Filter By Role</span>
<span className="px-sm py-xs bg-surface-container-high rounded font-label-md text-on-surface-variant cursor-pointer">Availability</span>
</div>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-md">

<div className="p-md border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
<div className="flex items-center gap-md mb-md">
<div className="relative">
<img className="w-12 h-12 rounded-full object-cover" data-alt="Close-up headshot of a professional female staff member wearing a headset, looking energetic and smiling slightly. The lighting is bright and clean, typical of a high-end corporate environment. In the background, there is a hint of a modern office space with amber and white tones." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCooj94LIiynPlYXU2ZQ21Qy11u54r8l2rrGCraXSOTrN_kxvCYM8SCSZGVBeh6TcfmeDMI37n6r2W8Y2csgkTBfXZvm_Byrcxz2szuFIp3HWCK4lovn6fA3ufJmQ1kjefQ3wW5YpZslAM-ieXPQWR9Xp3aevRt8sEC8jh2wzNqLXtgF3-Gs68WJLDnmCILTfgEyU9JkS7UHsH5egs8Jfo-ZqgYyNe5Xs3Eemi742gnoHgYLJoaWAR0xKdaAwxcoa_GMy-nJQ-sOHE"/>
<div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-surface rounded-full"></div>
</div>
<div>
<h3 className="font-label-md text-on-surface">Aditi Sharma</h3>
<p className="text-[10px] font-bold text-primary uppercase">Transporter Specialist</p>
</div>
</div>
<div className="space-y-xs">
<div className="flex justify-between text-xs">
<span className="text-on-surface-variant">Active Calls</span>
<span className="font-mono-data">18</span>
</div>
<div className="flex justify-between text-xs">
<span className="text-on-surface-variant">SLA Score</span>
<span className="font-mono-data text-green-600">98%</span>
</div>
</div>
</div>

<div className="p-md border border-outline-variant bg-surface-container-lowest hover:bg-surface-container-low transition-colors group">
<div className="flex items-center gap-md mb-md">
<div className="relative">
<img className="w-12 h-12 rounded-full object-cover" data-alt="A male office professional with a friendly smile, wearing a professional uniform in a well-lit office setting. He has short hair and is wearing a sleek headset. The color palette is minimal and clean, with soft white and subtle yellow accents in the background." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCp9f6hegcMDRn0y7fAa2RpL22bK4Z87XaCnBTtaEAaYSi1yzlIXfDYibZ9ObSC-8oIyaG8OJ-MjZ0D_akEm79KBKQUccCTFr-nZH48mDNaGWYov_oH7QOl2zXDDMszAU4DH499lcF10JNsSLvcpHvpSXb23SKUwD3lw_hTQH48MQuXInrzbW2pteRobKtWGGG-_8hTOSjND2yhvdBV30lljdMIwBpDx9YNL2lhPST6qbjHHMWxY7NIw7vfXPt2t-CDSunA80Cdipw"/>
<div className="absolute bottom-0 right-0 w-3 h-3 bg-primary-container border-2 border-surface rounded-full"></div>
</div>
<div>
<h3 className="font-label-md text-on-surface">Rahul Varma</h3>
<p className="text-[10px] font-bold text-primary uppercase">Matchmaking</p>
</div>
</div>
<div className="space-y-xs">
<div className="flex justify-between text-xs">
<span className="text-on-surface-variant">Current Call</span>
<span className="font-mono-data text-primary">04:12</span>
</div>
<div className="flex justify-between text-xs">
<span className="text-on-surface-variant">Load Matches</span>
<span className="font-mono-data">12</span>
</div>
</div>
</div>

<div className="p-md border border-outline-variant bg-surface-container-low transition-colors border-dashed">
<div className="flex items-center gap-md mb-md">
<div className="relative">
<img className="w-12 h-12 rounded-full object-cover" data-alt="A portrait of a young female employee in a logistics center, wearing a professional vest and looking directly at the camera with a confident expression. The environment is clean and modern, with bright overhead lighting and hints of orange-colored equipment in the distance." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCTqnra8Dk0S8nJEb60jA3fwrNGvEPsPdlLjmksr2fa6P8z4J6YnrGWswvi35EGKitgSTthe8sI-46Dk2mezuxOfFoOLRvHMS6CiAc9-uJ1vl26HcP4HR6zhDVkW8KgLs07pZwuWpMV4d4X0bj9nWJL-yAdJ_zyfNghWO9ZROZ7I174O4BRLMwjczFyG7Xar-X91AYghmYwCBzNwBVTERXC8Jgruk8Nmt39Wcm-4ORH4L4qgnmdLaUx1ZV8_L4v0JUAChJBKygWZNQ"/>
<div className="absolute bottom-0 right-0 w-3 h-3 bg-secondary-container border-2 border-surface rounded-full"></div>
</div>
<div>
<h3 className="font-label-md text-on-surface">Sana Khan</h3>
<p className="text-[10px] font-bold text-secondary uppercase">Backup Support</p>
</div>
</div>
<div className="space-y-xs">
<div className="flex justify-between text-xs">
<span className="text-on-surface-variant">Queue Status</span>
<span className="font-mono-data">Idle</span>
</div>
<button className="w-full mt-sm py-xs border border-outline text-[10px] uppercase font-bold text-on-surface-variant rounded">Assign to MM</button>
</div>
</div>

<div className="p-md border border-outline-variant bg-surface-container-lowest flex items-center justify-center opacity-60">
<div className="text-center">
<p className="text-headline-sm text-on-surface-variant">+5</p>
<p className="text-[10px] uppercase font-bold">More Callers</p>
</div>
</div>
</div>
</section>

<section className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
<div className="px-md py-sm bg-surface-container border-b border-outline-variant flex justify-between items-center">
<h2 className="font-label-md uppercase tracking-wider text-on-surface">Callbacks Due Today</h2>
<span className="text-[10px] font-bold px-sm py-xs bg-primary-container text-on-primary-container rounded">12 PENDING</span>
</div>
<table className="w-full text-left">
<thead className="bg-surface-container-low text-on-surface-variant font-label-md text-[10px]">
<tr>
<th className="px-lg py-sm border-b border-outline-variant">ID &amp; TRANSPORTER</th>
<th className="px-lg py-sm border-b border-outline-variant">DUE TIME</th>
<th className="px-lg py-sm border-b border-outline-variant">LAST AGENT</th>
<th className="px-lg py-sm border-b border-outline-variant">REASON</th>
<th className="px-lg py-sm border-b border-outline-variant text-right">ACTION</th>
</tr>
</thead>
<tbody className="text-body-sm font-mono-data">
<tr className="hover:bg-surface-container-low border-b border-outline-variant transition-colors group">
<td className="px-lg py-md">
<p className="font-bold text-on-surface">TR-99021</p>
<p className="text-xs text-on-surface-variant">Ghanshyam Logistics</p>
</td>
<td className="px-lg py-md">
<span className="text-error font-bold">Overdue (14m)</span>
</td>
<td className="px-lg py-md text-on-surface-variant">Aditi S.</td>
<td className="px-lg py-md">Rate Negotiation</td>
<td className="px-lg py-md text-right">
<button className="bg-primary text-on-primary px-sm py-xs rounded text-[10px] font-bold uppercase">Call Now</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low border-b border-outline-variant transition-colors">
<td className="px-lg py-md">
<p className="font-bold text-on-surface">TR-10045</p>
<p className="text-xs text-on-surface-variant">Express Cargo Solutions</p>
</td>
<td className="px-lg py-md">
<span className="text-primary font-bold">14:30 (In 15m)</span>
</td>
<td className="px-lg py-md text-on-surface-variant">Rahul V.</td>
<td className="px-lg py-md">KYC Document Pending</td>
<td className="px-lg py-md text-right">
<button className="border border-outline text-on-surface-variant px-sm py-xs rounded text-[10px] font-bold uppercase">Remind</button>
</td>
</tr>
<tr className="hover:bg-surface-container-low border-b border-outline-variant transition-colors">
<td className="px-lg py-md">
<p className="font-bold text-on-surface">TR-12094</p>
<p className="text-xs text-on-surface-variant">National Fleet Ops</p>
</td>
<td className="px-lg py-md">
<span className="text-primary font-bold">14:45 (In 30m)</span>
</td>
<td className="px-lg py-md text-on-surface-variant">Unassigned</td>
<td className="px-lg py-md">New Inquiry Callback</td>
<td className="px-lg py-md text-right">
<button className="bg-primary text-on-primary px-sm py-xs rounded text-[10px] font-bold uppercase">Assign</button>
</td>
</tr>
</tbody>
</table>
</section>
</div>
</main>
  );
};

export default TlOverviewTrMatchmaking;
