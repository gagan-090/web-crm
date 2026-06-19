import React from 'react';

export const FeedbackComposer: React.FC = () => {
  return (
    <main className="ml-[200px] pt-16 min-h-screen flex flex-col">

<div className="h-14 border-b border-outline-variant px-margin-desktop flex items-center justify-between bg-surface-bright">
<div className="flex items-center gap-stack-sm">
<button className="material-symbols-outlined text-on-surface-variant hover:bg-surface-container p-1 rounded">arrow_back</button>
<h1 className="font-headline-md text-headline-md">Feedback Composer: Audit #QC-9921</h1>
</div>
<div className="flex items-center gap-stack-md">
<div className="flex items-center gap-stack-xs text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]">account_circle</span>
<span className="font-label-md text-label-md">Agent: Rajesh Kumar</span>
</div>
<div className="h-4 w-px bg-outline-variant"></div>
<div className="flex items-center gap-stack-xs text-on-surface-variant">
<span className="material-symbols-outlined text-[18px]">calendar_today</span>
<span className="font-label-md text-label-md">Audit Date: Oct 24, 2023</span>
</div>
</div>
</div>

<div className="flex-1 flex overflow-hidden">

<section className="w-[40%] border-r border-outline-variant bg-surface overflow-y-auto p-margin-desktop">
<div className="flex flex-col gap-gutter">

<div className="bg-surface-container-low border border-outline-variant rounded-lg p-stack-md flex items-center justify-between">
<div>
<p className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-1">Total Score</p>
<div className="flex items-baseline gap-stack-sm">
<span className="text-[40px] font-black text-amber-600">72</span>
<span className="text-on-surface-variant font-label-md text-label-md">/ 100</span>
</div>
</div>
<div className="flex flex-col items-end">
<span className="bg-amber-100 text-amber-800 font-label-caps text-label-caps px-stack-sm py-1 rounded border border-amber-200 mb-2">NEEDS IMPROVEMENT</span>
<div className="w-32 bg-slate-200 h-2 rounded-full overflow-hidden">
<div className="bg-amber-500 h-full w-[72%]"></div>
</div>
</div>
</div>

<div>
<h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-stack-sm">Rubric Breakdown</h3>
<div className="border border-outline-variant rounded overflow-hidden">
<table className="w-full text-left">
<thead className="bg-surface-container-high">
<tr>
<th className="p-inset-table font-label-md text-label-md border-b border-outline-variant">Criterion</th>
<th className="p-inset-table font-label-md text-label-md border-b border-outline-variant text-center">Score</th>
</tr>
</thead>
<tbody className="font-table-data text-table-data">
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-inset-table border-b border-outline-variant">Call Opening &amp; Greeting</td>
<td className="p-inset-table border-b border-outline-variant text-center font-bold text-emerald-600">10/10</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-inset-table border-b border-outline-variant">Professionalism &amp; Tone</td>
<td className="p-inset-table border-b border-outline-variant text-center font-bold text-emerald-600">15/15</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-inset-table border-b border-outline-variant">Objection Handling</td>
<td className="p-inset-table border-b border-outline-variant text-center font-bold text-error">8/20</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-inset-table border-b border-outline-variant">Product Accuracy</td>
<td className="p-inset-table border-b border-outline-variant text-center font-bold text-amber-600">12/25</td>
</tr>
<tr className="hover:bg-surface-container-low transition-colors">
<td className="p-inset-table border-b border-outline-variant">Call Closing &amp; CTA</td>
<td className="p-inset-table border-b border-outline-variant text-center font-bold text-emerald-600">10/10</td>
</tr>
<tr className="bg-surface-container-low">
<td className="p-inset-table border-b border-outline-variant italic text-on-surface-variant">Bonus: Soft Skills</td>
<td className="p-inset-table border-b border-outline-variant text-center font-bold text-emerald-600">+2</td>
</tr>
</tbody>
</table>
</div>
</div>

<div>
<h3 className="font-label-caps text-label-caps text-on-surface-variant uppercase mb-stack-sm">Call Recording</h3>
<div className="bg-surface-container-highest rounded-lg p-stack-md border border-outline-variant">
<div className="flex items-center gap-stack-md mb-stack-sm">
<button className="material-symbols-outlined text-primary text-[32px] hover:scale-110 active:scale-95 transition-transform">play_circle</button>
<div className="flex-1 h-12 bg-slate-200 relative overflow-hidden rounded flex items-center justify-between px-2">

<div className="absolute inset-0 flex items-center justify-around px-2 opacity-50">
<div className="w-1 h-4 bg-primary"></div><div className="w-1 h-8 bg-primary"></div><div className="w-1 h-3 bg-primary"></div><div className="w-1 h-6 bg-primary"></div>
<div className="w-1 h-10 bg-primary"></div><div className="w-1 h-5 bg-primary"></div><div className="w-1 h-8 bg-primary"></div><div className="w-1 h-2 bg-primary"></div>
<div className="w-1 h-6 bg-primary"></div><div className="w-1 h-4 bg-primary"></div><div className="w-1 h-9 bg-primary"></div><div className="w-1 h-3 bg-primary"></div>
<div className="w-1 h-7 bg-primary"></div><div className="w-1 h-5 bg-primary"></div><div className="w-1 h-8 bg-primary"></div><div className="w-1 h-4 bg-primary"></div>
</div>

<div className="absolute left-[34%] top-0 h-full border-l-2 border-rose-500 z-10">
<div className="absolute -top-1 -left-[5px] w-[12px] h-[12px] bg-rose-500 rounded-full border border-white"></div>
</div>
<div className="absolute left-[62%] top-0 h-full border-l-2 border-amber-500 z-10">
<div className="absolute -top-1 -left-[5px] w-[12px] h-[12px] bg-amber-500 rounded-full border border-white"></div>
</div>
</div>
</div>
<div className="flex justify-between font-label-md text-label-md text-on-surface-variant">
<span>00:00</span>
<span>04:12</span>
</div>
</div>
</div>
</div>
</section>

<section className="w-[60%] bg-background overflow-y-auto p-margin-desktop">
<div className="max-w-3xl mx-auto flex flex-col gap-gutter">

<div className="flex items-center justify-between">
<h2 className="font-display text-display text-primary">Composer</h2>
<div className="flex items-center gap-stack-sm">
<span className="font-label-md text-label-md text-on-surface-variant">Severity Status:</span>
<div className="relative">
<select className="appearance-none bg-amber-50 border border-amber-300 text-amber-800 font-bold py-1 px-8 rounded cursor-pointer focus:ring-2 focus:ring-primary focus:outline-none">
<option value="good">Good</option>
<option selected value="needs-improvement">Needs Improvement</option>
<option value="critical">Critical</option>
</select>
<span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-amber-600 text-[18px]">warning</span>
<span className="material-symbols-outlined absolute right-2 top-1/2 -translate-y-1/2 text-amber-600 text-[18px] pointer-events-none">expand_more</span>
</div>
</div>
</div>

<div className="bg-surface border border-outline-variant p-stack-md rounded-lg shadow-sm border-l-4 border-l-primary">
<p className="font-body-lg text-body-lg leading-relaxed text-on-surface">
                            This call scored <span className="font-bold text-amber-600">72/100</span>. Key strengths: <span className="font-bold text-emerald-600">Opening, Professionalism</span>. Areas to improve: <span className="font-bold text-error">Objection Handling, Product Accuracy</span>.
                        </p>
</div>

<div className="flex flex-col gap-stack-sm">
<label className="font-label-caps text-label-caps text-on-surface-variant uppercase">Personalized Analyst Guidance</label>
<div className="border border-outline-variant rounded-lg bg-surface-container-lowest focus-within:ring-2 focus-within:ring-primary transition-shadow">

<div className="flex items-center gap-stack-sm p-2 border-b border-outline-variant bg-surface-container-low">
<button className="material-symbols-outlined p-1 hover:bg-surface-variant rounded text-on-surface-variant">format_bold</button>
<button className="material-symbols-outlined p-1 hover:bg-surface-variant rounded text-on-surface-variant">format_italic</button>
<button className="material-symbols-outlined p-1 hover:bg-surface-variant rounded text-on-surface-variant">format_list_bulleted</button>
<div className="h-4 w-px bg-outline-variant mx-1"></div>
<button className="material-symbols-outlined p-1 hover:bg-surface-variant rounded text-primary" title="Insert Timestamp">timer</button>
</div>

<textarea className="w-full p-stack-md bg-transparent border-none focus:ring-0 font-body-lg text-body-lg resize-none placeholder:text-outline" placeholder="Write detailed feedback here..." rows={10}>Rajesh, your call opening was energetic and professional. However, we need to focus on the pricing breakdown during the middle section.

[02:34] - Incorrect price mentioned for the "Fleet Pro" package (₹499 instead of ₹549). This led to confusion during the closing phase.

[03:15] - When the client mentioned the competitor "LogiTrack", you missed the chance to highlight our unique dashboard feature.

Please review the 'Price Integrity' training module before tomorrow's shift.</textarea>
</div>
</div>

<div className="flex flex-wrap gap-stack-sm">
<button className="flex items-center gap-stack-xs px-stack-sm py-1 bg-surface-container-high rounded-full border border-outline-variant hover:bg-primary-container hover:text-on-primary-container transition-colors font-label-md text-label-md">
<span className="material-symbols-outlined text-[16px]">play_arrow</span>
<span>[02:34] - Incorrect price mentioned</span>
</button>
<button className="flex items-center gap-stack-xs px-stack-sm py-1 bg-surface-container-high rounded-full border border-outline-variant hover:bg-primary-container hover:text-on-primary-container transition-colors font-label-md text-label-md">
<span className="material-symbols-outlined text-[16px]">play_arrow</span>
<span>[03:15] - Missed competitive edge</span>
</button>
</div>

<div className="p-stack-md bg-secondary-container/30 border border-secondary-container rounded-lg flex items-center justify-between">
<div className="flex items-center gap-stack-md">
<div className="w-10 h-10 bg-secondary-container rounded flex items-center justify-center text-secondary">
<span className="material-symbols-outlined">school</span>
</div>
<div>
<h4 className="font-headline-sm text-label-md font-bold text-on-secondary-fixed-variant">Price &amp; Product Accuracy 101</h4>
<p className="font-body-sm text-body-sm text-on-secondary-container">Standard refresh module for pricing inconsistencies.</p>
</div>
</div>
<label className="flex items-center cursor-pointer">
<input checked className="w-5 h-5 text-primary border-outline-variant rounded focus:ring-primary" type="checkbox"/>
<span className="ml-stack-sm font-label-md text-label-md font-bold text-primary">Assign Module</span>
</label>
</div>

<div className="mt-stack-md border-t border-outline-variant pt-gutter flex items-center justify-between">
<button className="px-gutter py-2 border border-outline-variant rounded font-label-md text-label-md hover:bg-surface-container transition-colors">Save as Draft</button>
<div className="flex items-center gap-gutter">
<button className="flex items-center gap-stack-xs font-label-md text-label-md text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined">visibility</span>
<span>Preview Email</span>
</button>
<button className="bg-primary text-on-primary px-margin-desktop py-3 rounded-lg font-bold shadow-md hover:brightness-110 active:scale-95 transition-all flex items-center gap-stack-sm">
<span className="material-symbols-outlined">send</span>
<span>Send Feedback to Caller</span>
</button>
</div>
</div>
</div>
</section>
</div>
</main>
  );
};

export default FeedbackComposer;
