import React from 'react';

export const MmPlacementConfirmation: React.FC = () => {
  return (
    <main className=" flex flex-col ">



<div className="p-margin-desktop flex-1">
<div className="max-w-5xl mx-auto">

<div className="mb-lg flex justify-between items-end">
<div>
<div className="flex items-center gap-xs text-on-surface-variant font-label-md mb-xs">
<span>Intro Manager</span>
<span className="material-symbols-outlined text-[14px]">chevron_right</span>
<span className="text-brand-purple">MM-07 Placement</span>
</div>
<h2 className="font-display-lg text-display-lg">Placement Confirmation</h2>
</div>
<div className="bg-tertiary-container/20 text-tertiary px-md py-xs rounded-full flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px]">verified</span>
<span className="font-label-md">Intro Stage: Complete</span>
</div>
</div>

<div className="bento-grid">

<div className="col-span-8 space-y-md">
<div className="glass-card p-lg rounded-xl grid grid-cols-3 gap-lg">
<div className="space-y-sm">
<span className="font-label-md text-on-surface-variant block uppercase tracking-wider">Driver</span>
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-lg bg-primary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-primary">person</span>
</div>
<div>
<p className="font-headline-sm text-headline-sm">Rajesh Kumar</p>
<p className="font-body-sm text-on-surface-variant">ID: D-9921 • Hazmat Certified</p>
</div>
</div>
</div>
<div className="space-y-sm">
<span className="font-label-md text-on-surface-variant block uppercase tracking-wider">Job Post</span>
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-lg bg-secondary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-secondary">local_shipping</span>
</div>
<div>
<p className="font-headline-sm text-headline-sm">Long Haul - DL01</p>
<p className="font-body-sm text-on-surface-variant">Delhi to Mumbai • 1400km</p>
</div>
</div>
</div>
<div className="space-y-sm">
<span className="font-label-md text-on-surface-variant block uppercase tracking-wider">Transporter</span>
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-lg bg-tertiary-fixed flex items-center justify-center">
<span className="material-symbols-outlined text-tertiary">business</span>
</div>
<div>
<p className="font-headline-sm text-headline-sm">Apex Logistics</p>
<p className="font-body-sm text-on-surface-variant">Fleet Tier 1 • Pan India</p>
</div>
</div>
</div>
</div>

<div className="glass-card p-lg rounded-xl">
<div className="flex items-center gap-sm mb-md">
<span className="material-symbols-outlined text-brand-purple">edit_note</span>
<h3 className="font-headline-sm text-headline-sm">Placement Notes</h3>
</div>
<textarea className="w-full h-32 p-md border border-outline-variant rounded-lg bg-surface-container-lowest focus:ring-2 focus:ring-primary-container focus:border-primary-container outline-none transition-all font-body-md" placeholder="Add specific operational notes, driver preferences, or transporter specific instructions for this placement..."></textarea>
</div>
</div>

<div className="col-span-4 space-y-md">

<div className="glass-card p-lg rounded-xl space-y-md">
<h3 className="font-label-md text-on-surface-variant uppercase tracking-widest mb-md">Checklist</h3>
<label className="flex items-center justify-between cursor-pointer group">
<span className="font-body-md">Start date confirmed</span>
<input className="form-checkbox h-5 w-5 text-primary rounded border-outline-variant focus:ring-primary-container cursor-pointer" type="checkbox"/>
</label>
<div className="h-px bg-outline-variant/30"></div>
<label className="flex items-center justify-between cursor-pointer">
<span className="font-body-md">Job completion confirmed</span>
<input className="form-checkbox h-5 w-5 text-primary rounded border-outline-variant focus:ring-primary-container cursor-pointer" type="checkbox"/>
</label>
<div className="h-px bg-outline-variant/30"></div>
<label className="flex items-center justify-between cursor-pointer">
<span className="font-body-md">Transporter confirmed</span>
<input className="form-checkbox h-5 w-5 text-primary rounded border-outline-variant focus:ring-primary-container cursor-pointer" type="checkbox"/>
</label>
</div>

<div className="bg-brand-purple/5 border border-brand-purple/20 p-lg rounded-xl">
<div className="flex items-center gap-md mb-sm">
<div className="w-10 h-10 rounded-full bg-brand-purple flex items-center justify-center">
<span className="material-symbols-outlined text-white">account_balance_wallet</span>
</div>
<div>
<h4 className="font-label-md text-brand-purple">Commission Ready</h4>
<p className="font-display-lg text-display-lg text-on-surface">₹150.00</p>
</div>
</div>
<div className="p-sm bg-white/50 rounded border border-brand-purple/10 text-body-sm flex items-start gap-sm">
<span className="material-symbols-outlined text-brand-purple text-[18px]">info</span>
<span>Driver is linked to <strong>FM-8821</strong>. Commission will be auto-credited upon final confirmation.</span>
</div>
</div>

<button className="w-full bg-[#27ae60] hover:bg-[#219150] text-white py-lg rounded-xl font-headline-sm flex items-center justify-center gap-md shadow-lg shadow-green-900/10 active:scale-[0.98] transition-all">
<span className="material-symbols-outlined">check_circle</span>
                            Confirm Placement
                        </button>
</div>

<div className="col-span-12 glass-card p-md rounded-xl flex items-center justify-between border-l-4 border-l-primary-container">
<div className="flex items-center gap-lg">
<div className="flex -space-x-3">
<div className="w-10 h-10 rounded-full border-2 border-white bg-surface-container overflow-hidden">
<img className="w-full h-full object-cover" data-alt="A portrait of a senior dispatcher with 10 years experience, focusing intently on their work. The style is hyper-realistic with high-density lighting, echoing a corporate professional vibe. The background shows a modern fleet management hub with teal and amber status indicators." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPbEH7EBj6lQicH9ryQVxvs0qXczn_2MiTW33UksLrCHx2nS5HXEDz56E-NMqq40DIQNe4Jqzu5s7PXRDwgMEhKAj6ThnfGDR-xFA6fw68YgLOuzXZuC9rlapUV9nvjSlMUYMmotDioRZu3dYtkwGxx-XkXhBt0jsVVoH5iwKX_JPGtTx5GorrBc2jFiPkCVHznN_wAe_-Y1ZoNNZq0rZlT9GVpr1VBCiyhjEX-il1POoQW8FaAd1elIQTpcMTuoCfrfi4xGhlgu4"/>
</div>
<div className="w-10 h-10 rounded-full border-2 border-white bg-primary-container text-white flex items-center justify-center font-bold text-xs">+3</div>
</div>
<div>
<p className="font-label-md">Team Visibility</p>
<p className="font-body-sm text-on-surface-variant">Shared with Regional Ops North</p>
</div>
</div>
<div className="flex items-center gap-xl">
<div className="text-right">
<p className="font-label-md text-on-surface-variant">SLA Deadline</p>
<p className="font-body-md font-bold text-error">42m remaining</p>
</div>
<div className="w-48 h-2 bg-outline-variant/30 rounded-full overflow-hidden">
<div className="h-full bg-primary-container w-[80%]"></div>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
  );
};

export default MmPlacementConfirmation;
