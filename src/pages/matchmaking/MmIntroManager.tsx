import React from 'react';

export const MmIntroManager: React.FC = () => {
  return (
    <main className=" min-h-screen flex flex-col">



<div className="p-margin-desktop space-y-lg">

<div className="bg-white border border-outline-variant p-lg flex justify-between items-center">
<div className="flex items-center gap-lg">
<div className="bg-surface-container-low p-md rounded border border-outline-variant">
<span className="material-symbols-outlined text-primary" data-icon="local_shipping">local_shipping</span>
</div>
<div>
<div className="flex items-center gap-sm">
<span className="font-mono-data text-mono-data text-outline">#JD-12034</span>
<span className="bg-primary-fixed text-on-primary-fixed text-[10px] uppercase tracking-widest px-sm font-bold rounded">Active Intro</span>
</div>
<h2 className="font-headline-md text-headline-md">Delhi <span className="text-outline mx-sm">→</span> Mumbai</h2>
</div>
</div>
<div className="flex flex-col items-end">
<span className="text-label-md text-outline">MATCHING SCORE</span>
<span className="text-display-lg font-display-lg text-primary">94%</span>
</div>
</div>

<div className="grid grid-cols-12 gap-lg">

<div className="col-span-4 space-y-lg">
<div className="bg-white border border-outline-variant p-lg space-y-md">
<div className="flex justify-between items-start">
<div className="w-20 h-20 rounded-lg overflow-hidden border border-outline-variant">
<img className="w-full h-full object-cover" data-alt="A portrait of an experienced truck driver in India wearing a clean professional uniform, warm natural lighting, smiling confidently, background showing a modern logistics park." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAdA9XFgyRKEuw66hpppgNEuy0giFYj6_eM0RIKNnVQS6yZw7mRaQKBFsWj7srjwsCK9LO18YvSMehWBUl0Xt1bpLEGT_cKmWq3jfm9zyypFWT4RFqGfsZWNJGTVmYsSOwiUxO-c6MqPMMHIFMHMbTULsbXdlWEVQ9MemxXmq-2wkIAlcyp2VUuYkEdYYLNNTl-9BobUyhFHK_CT_9UxEIcOSE46dM-JSvrdYco24229dzdWdvDiBh1xHwT3qEqXLEdMNfvgwKtLM8"/>
</div>
<span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-0.5 rounded-full">VERIFIED</span>
</div>
<div>
<h3 className="font-headline-sm text-headline-sm">Rajesh Kumar</h3>
<p className="text-body-sm text-outline">DL: MH0420230009841</p>
</div>
<div className="grid grid-cols-2 gap-md pt-sm">
<div className="bg-surface-container-low p-sm rounded border border-outline-variant">
<p className="text-[10px] text-outline uppercase font-bold">Experience</p>
<p className="font-mono-data">12 Years</p>
</div>
<div className="bg-surface-container-low p-sm rounded border border-outline-variant">
<p className="text-[10px] text-outline uppercase font-bold">Vehicle Type</p>
<p className="font-mono-data">Multi-Axle</p>
</div>
</div>
<div className="pt-sm">
<button className="w-full border border-outline text-on-surface-variant font-bold py-sm rounded hover:bg-surface-variant transition-all flex items-center justify-center gap-sm">
<span className="material-symbols-outlined text-sm">call</span> Call Driver
                            </button>
</div>
</div>
<div className="bg-white border border-outline-variant p-lg space-y-md">
<h4 className="text-label-md text-outline border-b border-outline-variant pb-xs">TRANSPORTER DETAILS</h4>
<div className="space-y-sm">
<p className="font-bold">Aggarwal Logistics Pvt Ltd</p>
<p className="text-body-sm text-outline">Point of Contact: Mr. Amit Sharma</p>
<div className="flex items-center gap-sm text-accent-purple">
<span className="material-symbols-outlined text-sm">mail</span>
<span className="text-body-sm underline">amit.sharma@aglog.com</span>
</div>
</div>
</div>
</div>

<div className="col-span-8 bg-white border border-outline-variant relative">
<div className="p-lg border-b border-outline-variant flex justify-between items-center">
<h3 className="font-headline-sm text-headline-sm">3-Way Introduction Checklist</h3>
<div className="flex items-center gap-sm">
<span className="text-body-sm text-outline">Progress</span>
<div className="w-32 h-1.5 bg-surface-variant rounded-full overflow-hidden">
<div className="bg-accent-purple h-full" style={{"width": "40%"}}></div>
</div>
<span className="text-label-md font-bold text-accent-purple">2/5</span>
</div>
</div>
<div className="p-lg space-y-lg relative">

<div className="intro-step completed-step relative pl-10 flex flex-col gap-xs">
<div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-accent-purple flex items-center justify-center z-10">
<span className="material-symbols-outlined text-white text-base">check</span>
</div>
<div className="flex justify-between items-center">
<h4 className="font-bold text-on-surface">1. Driver confirmed</h4>
<span className="text-xs text-outline italic">Completed 2h ago</span>
</div>
<p className="text-body-sm text-on-surface-variant">Interview completed. Driver expressed willingness for the Delhi-Mumbai route.</p>
</div>

<div className="intro-step relative pl-10 flex flex-col gap-md">
<div className="absolute left-0 top-0 w-6 h-6 rounded-full border-2 border-accent-purple bg-white flex items-center justify-center z-10">
<div className="w-2 h-2 rounded-full bg-accent-purple animate-pulse"></div>
</div>
<div className="flex justify-between items-center">
<h4 className="font-bold text-on-surface">2. WA group created</h4>
<span className="bg-accent-purple/10 text-accent-purple text-[10px] px-2 py-0.5 font-bold rounded">IN PROGRESS</span>
</div>
<p className="text-body-sm text-on-surface-variant">Create a dedicated WhatsApp group including the Driver, Transporter POC, and TruckMitr Coordinator.</p>
<div className="flex gap-md">
<button className="bg-[#25D366] text-white font-bold py-2 px-lg rounded flex items-center gap-sm hover:brightness-95 active:scale-95 transition-all">
<span className="material-symbols-outlined">chat</span> Create WA Group
                                </button>
<button className="border border-outline-variant px-md py-2 rounded text-body-sm text-outline hover:bg-surface-variant">Skip for now</button>
</div>
</div>

<div className="intro-step relative pl-10 flex flex-col gap-xs opacity-50">
<div className="absolute left-0 top-0 w-6 h-6 rounded-full border-2 border-outline-variant bg-white flex items-center justify-center z-10">
<span className="text-xs font-bold text-outline">3</span>
</div>
<h4 className="font-bold text-on-surface">3. Transporter contact shared</h4>
<p className="text-body-sm text-on-surface-variant">Send vCard and introductory message to both parties in the WA group.</p>
</div>

<div className="intro-step relative pl-10 flex flex-col gap-xs opacity-50">
<div className="absolute left-0 top-0 w-6 h-6 rounded-full border-2 border-outline-variant bg-white flex items-center justify-center z-10">
<span className="text-xs font-bold text-outline">4</span>
</div>
<h4 className="font-bold text-on-surface">4. 24hr follow-up</h4>
<p className="text-body-sm text-on-surface-variant">Verify if the driver has visited the yard for documentation check.</p>
</div>

<div className="intro-step relative pl-10 flex flex-col gap-md opacity-50">
<div className="absolute left-0 top-0 w-6 h-6 rounded-full border-2 border-outline-variant bg-white flex items-center justify-center z-10">
<span className="text-xs font-bold text-outline">5</span>
</div>
<h4 className="font-bold text-on-surface">5. Joining confirmed</h4>
<p className="text-body-sm text-on-surface-variant">Confirm formal induction into the fleet and first trip assignment.</p>
<div>
<button className="bg-primary text-white font-bold py-2 px-lg rounded flex items-center gap-sm disabled:opacity-50" disabled>
                                    Confirm Joining
                                </button>
</div>
</div>
</div>
<div className="p-lg border-t border-outline-variant bg-surface-container-lowest flex justify-end">
<button className="bg-[#27AE60] text-white font-display-lg text-lg px-xl py-md rounded-lg flex items-center gap-md hover:brightness-95 active:scale-95 transition-all shadow-lg opacity-50 cursor-not-allowed">
<span className="material-symbols-outlined">verified</span>
                            Mark Job as Filled
                        </button>
</div>
</div>
</div>

<div className="bg-white border border-outline-variant p-lg">
<h4 className="text-label-md text-outline mb-lg">ACTIVITY LOG</h4>
<div className="space-y-md">
<div className="flex gap-md">
<span className="text-xs text-outline font-mono-data w-24">14:20 PM</span>
<p className="text-body-sm"><span className="font-bold">System:</span> Match created between Rajesh Kumar and JD-12034</p>
</div>
<div className="flex gap-md">
<span className="text-xs text-outline font-mono-data w-24">14:45 PM</span>
<p className="text-body-sm"><span className="font-bold text-primary">Coordinator:</span> Called driver Rajesh. Confirmed availability for Mumbai route.</p>
</div>
</div>
</div>
</div>
</main>
  );
};

export default MmIntroManager;
