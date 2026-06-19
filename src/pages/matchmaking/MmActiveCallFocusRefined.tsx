import React from 'react';

export const MmActiveCallFocusRefined: React.FC = () => {
  return (
    <main className=" p-6 bg-background">
<div className="grid grid-cols-12 gap-6 h-full">

<div className="col-span-5 flex flex-col gap-6 h-full">

<section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden shadow-sm">
<div className="bg-primary-container/10 border-b border-outline-variant/30 p-4 flex items-center justify-between">
<div className="flex items-center gap-3">
<div className="w-3 h-3 bg-error rounded-full active-ring"></div>
<div>
<p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-widest">Active Call</p>
<p className="text-3xl font-bold text-primary" id="call-timer">04:12</p>
</div>
</div>
<div className="text-right">
<span className="inline-block bg-primary-container text-on-primary-container text-[10px] font-black px-2 py-1 rounded uppercase mb-1">Super Premium</span>
<div className="flex items-center justify-end gap-1 text-sm font-bold text-on-surface">
<span>Delhi</span>
<span className="material-symbols-outlined text-sm">trending_flat</span>
<span>Mumbai</span>
</div>
</div>
</div>
</section>

<section className="bg-white border border-outline-variant rounded-xl p-6 flex flex-col shadow-sm">
<div className="flex items-start justify-between mb-6">
<div>
<h2 className="text-2xl font-bold text-on-surface">Rajesh Kumar</h2>
<p className="text-sm text-on-surface-variant mt-1">Job ID: <span className="font-bold text-accent-purple">JD-12034</span></p>
<div className="flex gap-2 mt-4">
<span className="bg-surface-container px-3 py-1 rounded-full text-xs font-semibold text-on-surface-variant border border-outline-variant">12 yrs Exp.</span>
<span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-semibold border border-green-200 flex items-center gap-1">
<span className="material-symbols-outlined text-xs">verified</span>Verified
                                </span>
</div>
</div>
<div className="w-24 h-24 bg-surface-container rounded-xl border border-outline-variant overflow-hidden">
<img alt="Driver" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCKWyjfpr9MjGoLToxVRhuN5MYZbdRAKQZ07oEiD9gn3R8_7XL8M9Bhg064jRRbJ3w52x9bGuGejRAUXNp8vgVIVYiJtQSOAYkmcjRvGkOpPna_22JzXpO3Lji7oRnDZLR5fe3RhyzdzlnoTgD1tV253iJinIVhX6CnY3UR7xoDz09PQ_qTOYZ_BtWYfHdCY5F7UawQVhiutUGjjEp-4xfTO8sMeBgZ5V37pf609mhsdV2iWvGQLtYF5sxkUSO_mDTLg3Uyr9ql_Jg"/>
</div>
</div>

<div className="mt-auto">
<p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-4">Call Disposition</p>
<div className="grid grid-cols-2 gap-3">
<button className="flex flex-col items-center justify-center py-4 rounded-xl border-2 border-outline-variant hover:border-accent-purple hover:bg-accent-purple/5 transition-all group" >
<span className="material-symbols-outlined text-accent-purple mb-1 group-hover:scale-110 transition-transform">thumb_up</span>
<span className="text-sm font-bold text-on-surface">Interested</span>
</button>
<button className="flex flex-col items-center justify-center py-4 rounded-xl border-2 border-outline-variant hover:border-error hover:bg-error/5 transition-all group">
<span className="material-symbols-outlined text-error mb-1 group-hover:scale-110 transition-transform">thumb_down</span>
<span className="text-sm font-bold text-on-surface">Not Interested</span>
</button>
<button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-outline-variant hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined text-on-surface-variant">phone_missed</span>
<span className="text-sm font-bold text-on-surface">NR</span>
</button>
<button className="flex items-center justify-center gap-2 py-3 rounded-xl border border-outline-variant hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined text-on-surface-variant">schedule</span>
<span className="text-sm font-bold text-on-surface">Busy</span>
</button>
</div>

<div className="hidden mt-4 animate-in fade-in slide-in-from-bottom-2 duration-300" id="interested-action">
<div className="bg-accent-purple/10 border border-accent-purple/20 p-4 rounded-xl flex items-center justify-between">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-accent-purple">group_add</span>
<p className="text-sm font-semibold text-accent-purple">Convert to Lead group?</p>
</div>
<button className="bg-accent-purple text-white px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-wider hover:brightness-110 shadow-sm transition-all">Add to 3-way</button>
</div>
</div>
</div>
</section>

<div className="flex gap-4 mt-auto">
<button className="flex-1 bg-error text-white h-14 rounded-xl flex items-center justify-center gap-2 font-bold shadow-lg hover:brightness-90 active:scale-95 transition-all">
<span className="material-symbols-outlined">call_end</span>
                        End Call
                    </button>
<button className="w-14 h-14 border-2 border-outline-variant rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined">pause</span>
</button>
<button className="w-14 h-14 border-2 border-outline-variant rounded-xl flex items-center justify-center text-on-surface-variant hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined">mic_off</span>
</button>
</div>
</div>

<div className="col-span-7 bg-white border border-outline-variant rounded-xl flex flex-col h-full overflow-hidden shadow-sm">

<div className="flex border-b border-outline-variant bg-surface-container-low px-4">
<button className="px-6 py-4 border-b-2 border-accent-purple text-accent-purple font-bold text-sm">Opening</button>
<button className="px-6 py-4 text-on-surface-variant hover:text-accent-purple font-semibold text-sm transition-colors">Interest Check</button>
<button className="px-6 py-4 text-on-surface-variant hover:text-accent-purple font-semibold text-sm transition-colors">3-way Intro</button>
<button className="px-6 py-4 text-on-surface-variant hover:text-accent-purple font-semibold text-sm transition-colors">Closing</button>
</div>

<div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
<section>

<div className="p-6 bg-surface-container-low/50 border-l-4 border-accent-purple rounded-r-xl italic text-on-surface leading-relaxed shadow-sm">
<p className="hindi-text">"Namaste Rajesh ji, main TruckMitr se baat kar raha hoon. Aapne Delhi-Mumbai route ke liye enquiry ki thi. Kya main aapse 2 minute baat kar sakta hoon naye premium order ke baare mein?"</p>
</div>
</section>
<section>
<h4 className="text-on-surface-variant text-[10px] font-black uppercase tracking-widest mb-4">Key Points to Mention</h4>
<ul className="space-y-4">
<li className="flex gap-4 items-center p-4 bg-surface rounded-lg border border-outline-variant/30">
<span className="material-symbols-outlined text-accent-purple bg-accent-purple/10 p-2 rounded-full">payments</span>
<span className="text-sm font-semibold text-on-surface">Total Payment: ₹45,000 + Fuel Card</span>
</li>
<li className="flex gap-4 items-center p-4 bg-surface rounded-lg border border-outline-variant/30">
<span className="material-symbols-outlined text-accent-purple bg-accent-purple/10 p-2 rounded-full">precision_manufacturing</span>
<span className="text-sm font-semibold text-on-surface">Load: Automotive parts (Fragile)</span>
</li>
<li className="flex gap-4 items-center p-4 bg-surface rounded-lg border border-outline-variant/30">
<span className="material-symbols-outlined text-accent-purple bg-accent-purple/10 p-2 rounded-full">schedule</span>
<span className="text-sm font-semibold text-on-surface">Unloading Time: Fixed (4 Hours max)</span>
</li>
</ul>
</section>
<section>
<div className="flex items-center justify-between mb-4">
<h4 className="text-error text-[10px] font-black uppercase tracking-widest">Handle Objections (Hindi)</h4>
<div className="relative w-48">
<span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-on-surface-variant text-sm">search</span>
<input className="w-full text-[10px] pl-7 pr-3 py-1.5 bg-surface border border-outline-variant rounded-md focus:ring-1 focus:ring-accent-purple outline-none" placeholder="Quick search..." type="text"/>
</div>
</div>
<div className="flex flex-wrap gap-2">
<button className="px-4 py-2 bg-white border border-outline-variant rounded-full text-xs font-bold text-on-surface hover:border-accent-purple hover:text-accent-purple transition-all">"Kiraya kam hai"</button>
<button className="px-4 py-2 bg-white border border-outline-variant rounded-full text-xs font-bold text-on-surface hover:border-accent-purple hover:text-accent-purple transition-all">"Paisa kab milega?"</button>
<button className="px-4 py-2 bg-white border border-outline-variant rounded-full text-xs font-bold text-on-surface hover:border-accent-purple hover:text-accent-purple transition-all">"Gadi available nahi hai"</button>
<button className="px-4 py-2 bg-white border border-outline-variant rounded-full text-xs font-bold text-on-surface hover:border-accent-purple hover:text-accent-purple transition-all">"Advance kitna milega?"</button>
</div>
</section>

<section className="pt-6 border-t border-outline-variant">
<label className="block text-[10px] font-black text-on-surface-variant uppercase tracking-widest mb-2">Call Notes</label>
<textarea className="w-full h-32 bg-surface-container-low border border-outline-variant rounded-xl p-4 text-sm focus:ring-2 focus:ring-accent-purple/20 focus:border-accent-purple outline-none resize-none transition-all shadow-inner" placeholder="Type important call details here..."></textarea>
</section>
</div>

<footer className="p-4 bg-surface-container border-t border-outline-variant flex items-center justify-between shrink-0">
<div className="flex items-center gap-2 px-3 py-1.5 bg-white border border-outline-variant rounded-lg">
<span className="material-symbols-outlined text-on-surface-variant text-lg">translate</span>
<select className="bg-transparent border-none text-xs font-bold focus:ring-0 cursor-pointer">
<option>Hindi (Main)</option>
<option>English</option>
<option>Punjabi</option>
</select>
</div>
<div className="flex gap-2">
<button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-accent-purple hover:bg-accent-purple/5 rounded-lg transition-colors border border-transparent hover:border-accent-purple/20">
<span className="material-symbols-outlined">print</span>
</button>
<button className="w-10 h-10 flex items-center justify-center text-on-surface-variant hover:text-accent-purple hover:bg-accent-purple/5 rounded-lg transition-colors border border-transparent hover:border-accent-purple/20">
<span className="material-symbols-outlined">share</span>
</button>
</div>
</footer>
</div>
</div>
</main>
  );
};

export default MmActiveCallFocusRefined;
