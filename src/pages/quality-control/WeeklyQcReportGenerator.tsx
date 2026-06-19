import React from 'react';

export const WeeklyQcReportGenerator: React.FC = () => {
  return (
    <main className="ml-[200px] flex flex-col h-full bg-background ">



<div className="flex-1 flex overflow-hidden">

<div className="w-1/2 bg-surface-container-low overflow-y-auto p-12 border-r border-outline-variant no-scrollbar">
<div className="max-w-[800px] mx-auto report-canvas flex flex-col gap-8">

<div className="border-b-2 border-primary pb-6 flex justify-between items-end">
<div>
<h3 className="font-display text-display text-primary uppercase tracking-wider">Quality Audit Report</h3>
<p className="font-body-md text-on-surface-variant">Operational Performance Summary</p>
</div>
<div className="text-right">
<p className="font-label-caps text-label-caps text-on-surface-variant">REPORT DATE</p>
<p className="font-body-lg text-body-lg font-bold">May 24, 2024</p>
</div>
</div>

<section>
<h4 className="font-label-caps text-label-caps text-primary border-l-4 border-primary pl-3 mb-4">EXECUTIVE SUMMARY</h4>
<p className="font-body-md text-body-md text-on-surface leading-relaxed" id="preview-summary">The telecalling performance for Week 20 shows a steady 3% improvement in overall script compliance. Average audit score stabilized at 88.4% across 450 evaluated interactions. High-performing segments include Lead Qualification, while Follow-up Retention remains an area for calibration focus.</p>
</section>

<div className="grid grid-cols-2 gap-8">
<div>
<h4 className="font-label-caps text-label-caps text-primary mb-4">SCORE DISTRIBUTION</h4>
<div className="flex flex-col gap-3">
<div className="flex justify-between font-table-data text-table-data">
<span>Excellent (90%+)</span>
<span className="font-bold">64%</span>
</div>
<div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
<div className="h-full bg-primary w-[64%]"></div>
</div>
<div className="flex justify-between font-table-data text-table-data">
<span>Standard (70-90%)</span>
<span className="font-bold">28%</span>
</div>
<div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
<div className="h-full bg-secondary w-[28%]"></div>
</div>
<div className="flex justify-between font-table-data text-table-data">
<span>Needs Review (&lt;70%)</span>
<span className="font-bold">8%</span>
</div>
<div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
<div className="h-full bg-error w-[8%]"></div>
</div>
</div>
</div>
<div>
<h4 className="font-label-caps text-label-caps text-primary mb-4">FATAL ERRORS</h4>
<div className="p-4 bg-error-container rounded-lg">
<p className="text-3xl font-black text-on-error-container">04</p>
<p className="font-label-md text-label-md text-on-error-container">Compliance Breaches Identified</p>
</div>
</div>
</div>

<div className="grid grid-cols-1 gap-8">
<div className="border-t border-outline-variant pt-6">
<h4 className="font-label-caps text-label-caps text-primary mb-2">NOTABLE POSITIVES</h4>
<ul className="list-disc list-inside font-body-sm text-body-sm text-on-surface space-y-1" id="preview-positives">
<li>Empathy scores peaked in customer resolution calls.</li>
<li>Improved closing rate in South Zone agents.</li>
<li>Zero "Agent Disconnect" incidents reported.</li>
</ul>
</div>
<div className="border-t border-outline-variant pt-6">
<h4 className="font-label-caps text-label-caps text-primary mb-2">TOP IMPROVEMENT AREAS</h4>
<p className="font-body-sm text-body-sm text-on-surface" id="preview-improvements">1. Objection handling during price negotiation.<br/>2. Adherence to CRM mandatory fields.<br/>3. Proactive alternative route suggestions.</p>
</div>
</div>

<div className="mt-auto pt-12 flex justify-between items-center text-on-surface-variant opacity-60">
<p className="font-label-md text-label-md">© 2024 TruckMitr QC System | Internal Confidential</p>
<p className="font-label-md text-label-md">Page 01 of 01</p>
</div>
</div>
</div>

<div className="w-1/2 h-full flex flex-col bg-surface border-l border-outline-variant">
<div className="flex-1 overflow-y-auto p-margin-desktop no-scrollbar">
<div className="max-w-[600px] mx-auto flex flex-col gap-8">
<div className="flex items-center gap-2 text-primary border-b border-outline-variant pb-2">
<span className="material-symbols-outlined">edit_document</span>
<h3 className="font-headline-md text-headline-md">Report Editor</h3>
</div>

<div className="flex flex-col gap-6">
<div className="group">
<label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">EXECUTIVE SUMMARY</label>
<textarea className="clinical-input h-32 font-body-md text-body-md" id="edit-summary" placeholder="Enter executive summary...">The telecalling performance for Week 20 shows a steady 3% improvement in overall script compliance. Average audit score stabilized at 88.4% across 450 evaluated interactions. High-performing segments include Lead Qualification, while Follow-up Retention remains an area for calibration focus.</textarea>
</div>
<div className="grid grid-cols-2 gap-4">
<div className="group">
<label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">CRM DATA QUALITY (%)</label>
<input className="clinical-input font-table-data" type="number" value="94.2"/>
</div>
<div className="group">
<label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">CALIBRATION SCORE (%)</label>
<input className="clinical-input font-table-data" type="number" value="91.0"/>
</div>
</div>
<div className="group">
<label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">NOTABLE POSITIVES (ONE PER LINE)</label>
<textarea className="clinical-input h-24 font-body-sm text-body-sm" id="edit-positives">Empathy scores peaked in customer resolution calls.
Improved closing rate in South Zone agents.
Zero "Agent Disconnect" incidents reported.</textarea>
</div>
<div className="group">
<label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">TOP 3 IMPROVEMENT AREAS</label>
<textarea className="clinical-input h-24 font-body-sm text-body-sm" id="edit-improvements">1. Objection handling during price negotiation.
2. Adherence to CRM mandatory fields.
3. Proactive alternative route suggestions.</textarea>
</div>
<div className="group">
<label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">FATAL ERROR NOTES</label>
<textarea className="clinical-input h-20 font-body-sm text-body-sm" placeholder="Details on compliance breaches...">4 instances of unauthorized data sharing detected. Remedial training scheduled for Batch B.</textarea>
</div>
<div className="group">
<label className="font-label-caps text-label-caps text-on-surface-variant block mb-2">FINAL RECOMMENDATIONS</label>
<textarea className="clinical-input h-24 font-body-sm text-body-sm">Mandatory 'Lead Engagement' workshop for agents scoring below 75% in Week 20. Introduce gamification for CRM accuracy.</textarea>
</div>
</div>
</div>
</div>

<div className="p-6 bg-surface-container border-t border-outline-variant flex gap-4 justify-center">
<button className="px-8 py-3 bg-primary text-white rounded-lg font-label-md flex items-center gap-2 transition-all active:scale-95 shadow-lg shadow-primary/20">
<span className="material-symbols-outlined">send</span>
                        Send to Telecalling Head
                    </button>
<button className="px-8 py-3 border-2 border-primary text-primary rounded-lg font-label-md flex items-center gap-2 hover:bg-primary/5 transition-all active:scale-95">
<span className="material-symbols-outlined">picture_as_pdf</span>
                        Export as PDF
                    </button>
</div>
</div>
</div>
</main>
  );
};

export default WeeklyQcReportGenerator;
