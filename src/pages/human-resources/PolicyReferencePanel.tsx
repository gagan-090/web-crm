import React from 'react';

export const PolicyReferencePanel: React.FC = () => {
  return (
    <main className=" min-h-screen">



<section className="p-margin-page max-w-[1440px] mx-auto">
<div className="flex justify-between items-end mb-8">
<div>
<h2 className="font-headline-lg text-headline-lg text-primary tracking-tight">Policy Reference Panel</h2>
<p className="font-body-md text-body-md text-on-surface-variant mt-1">Institutional standards and operational guidelines for TruckMitr staff.</p>
</div>
<div className="flex gap-3">
<button className="flex items-center gap-2 border border-primary text-primary px-4 py-2 font-label-md text-label-md hover:bg-surface-container-low transition-all">
<span className="material-symbols-outlined text-base" data-icon="download">download</span>
                        EXPORT AS PDF
                    </button>
<button className="flex items-center gap-2 bg-primary text-on-primary px-4 py-2 font-label-md text-label-md hover:opacity-90 transition-all" >
<span className="material-symbols-outlined text-base" data-icon="edit">edit</span>
                        EDIT POLICIES
                    </button>
</div>
</div>

<div className="policy-card-grid">

<article className="bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4">
<div className="flex justify-between items-start">
<div className="p-2 bg-primary-container text-on-primary-container rounded">
<span className="material-symbols-outlined" data-icon="timer">timer</span>
</div>
<span className="font-label-md text-label-md text-on-surface-variant opacity-50">Last updated: 12 Oct 2023</span>
</div>
<div>
<h3 className="font-title-sm text-title-sm text-primary mb-2">Probation Rules</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Standard probation period is 6 months. Review occurs at 3 and 6-month intervals. Extension possible up to 3 additional months based on performance metrics.</p>
</div>
<div className="mt-auto pt-4 border-t border-outline-variant/30">
<ul className="space-y-1">
<li className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant">
<span className="w-1 h-1 bg-primary rounded-full"></span> 100% Attendance mandated
                            </li>
<li className="flex items-center gap-2 text-[11px] font-bold text-on-surface-variant">
<span className="w-1 h-1 bg-primary rounded-full"></span> Formal mentorship assigned
                            </li>
</ul>
</div>
</article>

<article className="bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4">
<div className="flex justify-between items-start">
<div className="p-2 bg-secondary-container text-on-secondary-container rounded">
<span className="material-symbols-outlined" data-icon="logout">logout</span>
</div>
<span className="font-label-md text-label-md text-on-surface-variant opacity-50">Last updated: 05 Jan 2024</span>
</div>
<div>
<h3 className="font-title-sm text-title-sm text-primary mb-2">Notice Period</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Mandatory 60-day notice period for all permanent roles. Buy-outs are subject to Management approval. Notice waived only for extreme medical emergencies.</p>
</div>
<div className="mt-auto pt-4 border-t border-outline-variant/30 flex justify-between items-center">
<span className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[10px] font-black">STRICT COMPLIANCE</span>
<a className="text-primary font-bold text-[11px] hover:underline" href="#">View Recovery Table</a>
</div>
</article>

<article className="bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4">
<div className="flex justify-between items-start">
<div className="p-2 bg-error-container text-on-error-container rounded">
<span className="material-symbols-outlined" data-icon="warning">warning</span>
</div>
<span className="font-label-md text-label-md text-on-surface-variant opacity-50">Last updated: 18 Dec 2023</span>
</div>
<div>
<h3 className="font-title-sm text-title-sm text-primary mb-2">Absconding Definition</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Uninformed absence for &gt;3 consecutive working days. Results in immediate blocking of system access and initiation of legal recovery for company assets.</p>
</div>
<div className="mt-auto pt-4 border-t border-outline-variant/30">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-error text-lg" data-icon="gavel">gavel</span>
<span className="font-label-md text-label-md text-error">Zero Tolerance Policy</span>
</div>
</div>
</article>

<article className="bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4">
<div className="flex justify-between items-start">
<div className="p-2 bg-tertiary-container text-on-tertiary-container rounded">
<span className="material-symbols-outlined" data-icon="home_work">home_work</span>
</div>
<span className="font-label-md text-label-md text-on-surface-variant opacity-50">Last updated: 01 Feb 2024</span>
</div>
<div>
<h3 className="font-title-sm text-title-sm text-primary mb-2">WFH Model Details</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Hybrid model (3 days office, 2 days remote). Remote eligibility requires minimum internet speed of 50Mbps and a dedicated workstation.</p>
</div>
<div className="mt-auto grid grid-cols-2 gap-2">
<div className="bg-surface-container p-2 text-center rounded">
<p className="text-[10px] text-on-surface-variant uppercase font-bold">Mon-Wed</p>
<p className="text-xs font-black text-primary">Office</p>
</div>
<div className="bg-surface-container p-2 text-center rounded">
<p className="text-[10px] text-on-surface-variant uppercase font-bold">Thu-Fri</p>
<p className="text-xs font-black text-primary">Remote</p>
</div>
</div>
</article>

<article className="bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4">
<div className="flex justify-between items-start">
<div className="p-2 bg-primary-container text-on-primary-container rounded">
<span className="material-symbols-outlined" data-icon="account_balance_wallet">account_balance_wallet</span>
</div>
<span className="font-label-md text-label-md text-on-surface-variant opacity-50">Last updated: 14 Feb 2024</span>
</div>
<div>
<h3 className="font-title-sm text-title-sm text-primary mb-2">Payroll Dispute Policy</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Disputes must be raised via the internal portal within 48 hours of salary credit. Standard resolution time is 3-5 business days via Finance audit.</p>
</div>
<button className="mt-auto w-full py-2 bg-surface-container text-primary font-bold text-[11px] border border-outline-variant hover:bg-surface-container-highest transition-colors">RAISE TICKET TEMPLATE</button>
</article>

<article className="bg-surface-container-lowest border border-outline-variant p-5 flex flex-col gap-4">
<div className="flex justify-between items-start">
<div className="p-2 bg-secondary-fixed text-on-secondary-fixed rounded">
<span className="material-symbols-outlined" data-icon="search_check">search_check</span>
</div>
<span className="font-label-md text-label-md text-on-surface-variant opacity-50">Last updated: 22 Jan 2024</span>
</div>
<div>
<h3 className="font-title-sm text-title-sm text-primary mb-2">Hiring Criteria</h3>
<p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Tier 1: 5+ years tech experience. Tier 2: 2-5 years experience. Mandatory background verification (BGV) clearance for all bands prior to offer release.</p>
</div>
<div className="mt-auto pt-4 flex gap-1">
<span className="bg-surface-container-highest px-2 py-1 rounded-full text-[9px] font-bold text-primary">TECH</span>
<span className="bg-surface-container-highest px-2 py-1 rounded-full text-[9px] font-bold text-primary">OPS</span>
<span className="bg-surface-container-highest px-2 py-1 rounded-full text-[9px] font-bold text-primary">LOGISTICS</span>
</div>
</article>
</div>

<div className="mt-12 p-6 bg-surface-container-lowest border border-outline-variant max-w-2xl">
<h4 className="font-label-md text-label-md text-primary mb-6 flex items-center gap-2">
<span className="material-symbols-outlined text-base" data-icon="history">history</span>
                    RECENT POLICY AMENDMENTS
                </h4>
<div className="space-y-4">
<div className="flex gap-4 items-start">
<div className="min-w-[80px] text-right">
<p className="font-label-md text-label-md text-on-surface-variant">Feb 14, 24</p>
<p className="text-[10px] text-on-surface-variant/60">09:12 AM</p>
</div>
<div className="relative pt-1">
<div className="w-2 h-2 rounded-full bg-primary absolute -left-1.5 top-2.5"></div>
<div className="h-full w-px bg-outline-variant absolute -left-0.5 top-5"></div>
</div>
<div>
<p className="text-body-sm font-bold text-primary">Payroll Dispute Resolution Window Reduced</p>
<p className="text-[11px] text-on-surface-variant">Modified by: HR Director (Audit ID: #POL-441)</p>
</div>
</div>
<div className="flex gap-4 items-start">
<div className="min-w-[80px] text-right">
<p className="font-label-md text-label-md text-on-surface-variant">Feb 01, 24</p>
<p className="text-[10px] text-on-surface-variant/60">04:45 PM</p>
</div>
<div className="relative pt-1">
<div className="w-2 h-2 rounded-full bg-outline absolute -left-1.5 top-2.5"></div>
<div className="h-full w-px bg-outline-variant absolute -left-0.5 top-5"></div>
</div>
<div>
<p className="text-body-sm font-bold text-primary">Hybrid Model Connectivity Requirements Updated</p>
<p className="text-[11px] text-on-surface-variant">Modified by: Ops Head (Audit ID: #POL-439)</p>
</div>
</div>
</div>
</div>
</section>
</main>
  );
};

export default PolicyReferencePanel;
