import React from 'react';

export const AuditQueue: React.FC = () => {
  return (
    <main className="ml-[200px] mt-16 p-margin-desktop min-h-screen">
<div className="flex flex-col gap-stack-md max-w-[1600px] mx-auto">

<div className="flex justify-between items-end">
<div>
<h1 className="font-display text-display text-on-surface">Audit Queue</h1>
<p className="font-body-md text-on-surface-variant">Manage and perform quality audits for this week's call recordings.</p>
</div>
<button className="bg-primary text-on-primary px-6 py-2.5 rounded-lg flex items-center gap-2 font-bold hover:shadow-lg transition-all active:scale-95">
<span className="material-symbols-outlined text-lg" data-icon="add">add</span>
<span className="text-label-md">Add Call Manually</span>
</button>
</div>

<div className="bg-surface p-4 rounded-xl border border-outline-variant flex flex-wrap gap-4 items-center">
<div className="flex flex-col gap-1 min-w-[140px]">
<label className="font-label-caps text-label-caps text-on-surface-variant">PROCESS</label>
<select className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-body-sm focus:ring-2 focus:ring-primary outline-none">
<option>All Processes</option>
<option>DW (Domestic West)</option>
<option>TR (Transport)</option>
<option>MM (Mid Market)</option>
<option>SC (Supply Chain)</option>
</select>
</div>
<div className="flex flex-col gap-1 min-w-[140px]">
<label className="font-label-caps text-label-caps text-on-surface-variant">CALLER</label>
<select className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-body-sm focus:ring-2 focus:ring-primary outline-none">
<option>All Analysts</option>
<option>Ankit Sharma</option>
<option>Rohan Mehra</option>
<option>Sneha Kapur</option>
</select>
</div>
<div className="flex flex-col gap-1 min-w-[140px]">
<label className="font-label-caps text-label-caps text-on-surface-variant">DATE RANGE</label>
<div className="relative">
<input className="bg-surface-container-low border border-outline-variant rounded p-1.5 text-body-sm w-full focus:ring-2 focus:ring-primary outline-none" type="date"/>
</div>
</div>
<div className="flex flex-col gap-1 min-w-[140px]">
<label className="font-label-caps text-label-caps text-on-surface-variant">STATUS</label>
<div className="flex gap-2 p-1 bg-surface-container-low border border-outline-variant rounded">
<button className="bg-primary text-on-primary px-3 py-1 rounded text-label-caps">ALL</button>
<button className="px-3 py-1 text-on-surface-variant hover:bg-surface-variant rounded text-label-caps">PENDING</button>
<button className="px-3 py-1 text-on-surface-variant hover:bg-surface-variant rounded text-label-caps">IN PROGRESS</button>
</div>
</div>
<div className="ml-auto flex items-center gap-2">
<button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
<span className="material-symbols-outlined" data-icon="search">search</span>
</button>
<button className="p-2 text-on-surface-variant hover:bg-surface-container rounded-full transition-colors">
<span className="material-symbols-outlined" data-icon="refresh">refresh</span>
</button>
</div>
</div>

<div className="bg-surface border border-outline-variant rounded-xl overflow-hidden">
<div className="overflow-x-auto h-[600px] scrollbar-hide">
<table className="w-full text-left border-collapse audit-table">
<thead className="bg-surface-container-low border-b border-outline-variant">
<tr>
<th className="p-3 font-label-caps text-label-caps text-on-surface-variant w-12">#</th>
<th className="p-3 font-label-caps text-label-caps text-on-surface-variant">CALLER</th>
<th className="p-3 font-label-caps text-label-caps text-on-surface-variant">PROCESS</th>
<th className="p-3 font-label-caps text-label-caps text-on-surface-variant">LEAD TMID</th>
<th className="p-3 font-label-caps text-label-caps text-on-surface-variant">CALL DATE</th>
<th className="p-3 font-label-caps text-label-caps text-on-surface-variant">DURATION</th>
<th className="p-3 font-label-caps text-label-caps text-on-surface-variant text-center">REC</th>
<th className="p-3 font-label-caps text-label-caps text-on-surface-variant">STATUS</th>
<th className="p-3 font-label-caps text-label-caps text-on-surface-variant text-right">ACTION</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">


</tbody>
</table>
</div>

<div className="p-4 bg-surface-container-low border-t border-outline-variant flex justify-between items-center">
<p className="font-body-sm text-body-sm text-on-surface-variant">Showing 20 of 142 recordings</p>
<div className="flex items-center gap-2">
<button className="p-1 rounded hover:bg-surface-variant/50 text-on-surface-variant border border-outline-variant">
<span className="material-symbols-outlined" data-icon="chevron_left">chevron_left</span>
</button>
<div className="flex items-center gap-1">
<button className="w-8 h-8 rounded bg-primary text-on-primary font-bold text-body-sm">1</button>
<button className="w-8 h-8 rounded hover:bg-surface-variant/50 text-on-surface-variant font-bold text-body-sm">2</button>
<button className="w-8 h-8 rounded hover:bg-surface-variant/50 text-on-surface-variant font-bold text-body-sm">3</button>
<span className="text-on-surface-variant">...</span>
<button className="w-8 h-8 rounded hover:bg-surface-variant/50 text-on-surface-variant font-bold text-body-sm">8</button>
</div>
<button className="p-1 rounded hover:bg-surface-variant/50 text-on-surface-variant border border-outline-variant">
<span className="material-symbols-outlined" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-4 gap-gutter mt-2">
<div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
<span className="material-symbols-outlined text-3xl" data-icon="pending_actions">pending_actions</span>
</div>
<div>
<p className="text-label-caps font-label-caps text-on-surface-variant">TOTAL PENDING</p>
<p className="text-headline-md font-headline-md">48</p>
</div>
</div>
<div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-secondary/10 text-secondary flex items-center justify-center">
<span className="material-symbols-outlined text-3xl" data-icon="sync">sync</span>
</div>
<div>
<p className="text-label-caps font-label-caps text-on-surface-variant">IN PROGRESS</p>
<p className="text-headline-md font-headline-md">12</p>
</div>
</div>
<div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-tertiary/10 text-tertiary flex items-center justify-center">
<span className="material-symbols-outlined text-3xl" data-icon="task_alt">task_alt</span>
</div>
<div>
<p className="text-label-caps font-label-caps text-on-surface-variant">COMPLETED TODAY</p>
<p className="text-headline-md font-headline-md">26</p>
</div>
</div>
<div className="bg-surface-container-low p-4 rounded-xl border border-outline-variant flex items-center gap-4">
<div className="w-12 h-12 rounded-lg bg-error/10 text-error flex items-center justify-center">
<span className="material-symbols-outlined text-3xl" data-icon="warning">warning</span>
</div>
<div>
<p className="text-label-caps font-label-caps text-on-surface-variant">MISSING RECS</p>
<p className="text-headline-md font-headline-md">04</p>
</div>
</div>
</div>
</div>
</main>
  );
};

export default AuditQueue;
