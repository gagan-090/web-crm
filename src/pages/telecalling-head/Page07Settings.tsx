import React from 'react';

export const Page07Settings: React.FC = () => {
  return (
    <main className=" p-md custom-scrollbar bg-background">
<div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-gutter">

<section className="col-span-12 lg:col-span-4 bg-white border border-outline-variant shadow-sm rounded-lg p-md">
<div className="flex items-center justify-between mb-md">
<h3 className="font-headline-md text-headline-md text-on-surface">Integration Health</h3>
<span className="material-symbols-outlined text-on-surface-variant cursor-pointer" data-icon="refresh">refresh</span>
</div>
<div className="space-y-sm">
<div className="flex items-center justify-between p-sm bg-surface-container-low rounded border border-outline-variant/30">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-primary" data-icon="call">call</span>
<div>
<p className="font-label-caps text-label-caps text-on-surface">Exotel Cloud Telephony</p>
<p className="text-[10px] text-on-surface-variant">API Latency: 42ms</p>
</div>
</div>
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
<span className="text-[11px] font-bold text-green-600">ACTIVE</span>
</div>
</div>
<div className="flex items-center justify-between p-sm bg-surface-container-low rounded border border-outline-variant/30">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-[#25D366]" data-icon="chat">chat</span>
<div>
<p className="font-label-caps text-label-caps text-on-surface">WhatsApp Business API</p>
<p className="text-[10px] text-on-surface-variant">Status: Connected</p>
</div>
</div>
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></span>
<span className="text-[11px] font-bold text-green-600">ACTIVE</span>
</div>
</div>
<div className="flex items-center justify-between p-sm bg-surface-container-low rounded border border-outline-variant/30">
<div className="flex items-center gap-md">
<span className="material-symbols-outlined text-secondary" data-icon="payments">payments</span>
<div>
<p className="font-label-caps text-label-caps text-on-surface">Razorpay Payment Gateway</p>
<p className="text-[10px] text-on-surface-variant">Auth Error: retry 5</p>
</div>
</div>
<div className="flex items-center gap-xs">
<span className="w-2 h-2 rounded-full bg-error shadow-[0_0_8px_rgba(186,26,26,0.5)]"></span>
<span className="text-[11px] font-bold text-error">FAILED</span>
</div>
</div>
</div>
</section>

<section className="col-span-12 lg:col-span-8 bg-white border border-outline-variant shadow-sm rounded-lg">
<div className="p-md border-b border-outline-variant flex items-center justify-between">
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Subscription Pricing Control</h3>
<p className="text-xs text-on-surface-variant">Update and manage customer billing plans</p>
</div>
<button className="bg-primary text-white px-md py-xs rounded flex items-center gap-sm font-label-caps text-label-caps hover:bg-on-primary-fixed-variant transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="add">add</span> New Plan
                    </button>
</div>
<div className="overflow-x-auto">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container text-on-surface-variant font-label-caps text-label-caps border-b border-outline-variant">
<tr>
<th className="px-md py-sm">PLAN NAME</th>
<th className="px-md py-sm">MONTHLY PRICE</th>
<th className="px-md py-sm">EFFECTIVE DATE</th>
<th className="px-md py-sm">STATUS</th>
<th className="px-md py-sm text-right">ACTION</th>
</tr>
</thead>
<tbody className="text-body-sm">
<tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
<td className="px-md py-sm font-bold text-primary">Enterprise Pro</td>
<td className="px-md py-sm font-data-mono text-data-mono">₹45,000</td>
<td className="px-md py-sm">01 Oct 2023</td>
<td className="px-md py-sm">
<span className="bg-blue-50 text-blue-700 px-xs py-[2px] rounded text-[10px] font-bold border border-blue-200 uppercase">Current</span>
</td>
<td className="px-md py-sm text-right">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary" data-icon="edit">edit</button>
</td>
</tr>
<tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
<td className="px-md py-sm font-bold text-primary">Fleet Scale</td>
<td className="px-md py-sm font-data-mono text-data-mono">₹28,500</td>
<td className="px-md py-sm">15 Sep 2023</td>
<td className="px-md py-sm">
<span className="bg-blue-50 text-blue-700 px-xs py-[2px] rounded text-[10px] font-bold border border-blue-200 uppercase">Current</span>
</td>
<td className="px-md py-sm text-right">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary" data-icon="edit">edit</button>
</td>
</tr>
<tr className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
<td className="px-md py-sm font-bold text-primary">Lite Startup</td>
<td className="px-md py-sm font-data-mono text-data-mono">₹12,000</td>
<td className="px-md py-sm">01 Jan 2024</td>
<td className="px-md py-sm">
<span className="bg-orange-50 text-orange-700 px-xs py-[2px] rounded text-[10px] font-bold border border-orange-200 uppercase">Scheduled</span>
</td>
<td className="px-md py-sm text-right">
<button className="material-symbols-outlined text-on-surface-variant hover:text-primary" data-icon="edit">edit</button>
</td>
</tr>
</tbody>
</table>
</div>
</section>

<section className="col-span-12 lg:col-span-7 bg-white border border-outline-variant shadow-sm rounded-lg overflow-hidden">
<div className="p-md border-b border-outline-variant flex items-center justify-between">
<h3 className="font-headline-md text-headline-md text-on-surface">Caller Account Management</h3>
<div className="flex gap-sm">
<div className="flex items-center gap-xs px-sm py-xs bg-surface-container-low border border-outline-variant rounded">
<span className="material-symbols-outlined text-xs" data-icon="filter_list">filter_list</span>
<span className="font-label-caps text-[10px]">ALL TEAMS</span>
</div>
<button className="bg-secondary text-white px-md py-xs rounded flex items-center gap-sm font-label-caps text-label-caps hover:bg-on-secondary-fixed-variant transition-colors">
<span className="material-symbols-outlined text-sm" data-icon="person_add">person_add</span> Add Caller
                        </button>
</div>
</div>
<div className="p-md grid grid-cols-1 md:grid-cols-2 gap-md">

<div className="border border-outline-variant rounded-lg p-sm flex items-center gap-md hover:border-primary transition-all">
<div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-primary font-bold">RK</div>
<div className="flex-1 min-w-0">
<h4 className="font-bold text-sm truncate">Rohan Kumar</h4>
<p className="text-[11px] text-on-surface-variant">Team: North Logistics</p>
<div className="flex items-center gap-sm mt-xs">
<span className="bg-green-100 text-green-700 text-[9px] font-bold px-xs py-[1px] rounded">ACTIVE</span>
<span className="text-[10px] text-on-surface-variant">ID: TM-882</span>
</div>
</div>
<div className="flex flex-col gap-xs">
<button className="material-symbols-outlined text-xs p-xs hover:bg-surface-container rounded" data-icon="edit">edit</button>
<button className="material-symbols-outlined text-xs p-xs text-error hover:bg-error/10 rounded" data-icon="block">block</button>
</div>
</div>

<div className="border border-outline-variant rounded-lg p-sm flex items-center gap-md hover:border-primary transition-all">
<div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-primary font-bold">SS</div>
<div className="flex-1 min-w-0">
<h4 className="font-bold text-sm truncate">Sneha Sharma</h4>
<p className="text-[11px] text-on-surface-variant">Team: Customer Success</p>
<div className="flex items-center gap-sm mt-xs">
<span className="bg-green-100 text-green-700 text-[9px] font-bold px-xs py-[1px] rounded">ACTIVE</span>
<span className="text-[10px] text-on-surface-variant">ID: TM-419</span>
</div>
</div>
<div className="flex flex-col gap-xs">
<button className="material-symbols-outlined text-xs p-xs hover:bg-surface-container rounded" data-icon="edit">edit</button>
<button className="material-symbols-outlined text-xs p-xs text-error hover:bg-error/10 rounded" data-icon="block">block</button>
</div>
</div>

<div className="border border-outline-variant rounded-lg p-sm flex items-center gap-md opacity-60 grayscale">
<div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-on-surface-variant font-bold">AP</div>
<div className="flex-1 min-w-0">
<h4 className="font-bold text-sm truncate">Arjun Patel</h4>
<p className="text-[11px] text-on-surface-variant">Team: Operations</p>
<div className="flex items-center gap-sm mt-xs">
<span className="bg-surface-container-highest text-on-surface-variant text-[9px] font-bold px-xs py-[1px] rounded">INACTIVE</span>
<span className="text-[10px] text-on-surface-variant">ID: TM-202</span>
</div>
</div>
<div className="flex flex-col gap-xs">
<button className="material-symbols-outlined text-xs p-xs hover:bg-surface-container rounded" data-icon="restart_alt">restart_alt</button>
</div>
</div>

<div className="border border-outline-variant rounded-lg p-sm flex items-center gap-md hover:border-primary transition-all">
<div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-primary font-bold">VD</div>
<div className="flex-1 min-w-0">
<h4 className="font-bold text-sm truncate">Vikram Das</h4>
<p className="text-[11px] text-on-surface-variant">Team: Inbound Sales</p>
<div className="flex items-center gap-sm mt-xs">
<span className="bg-green-100 text-green-700 text-[9px] font-bold px-xs py-[1px] rounded">ACTIVE</span>
<span className="text-[10px] text-on-surface-variant">ID: TM-612</span>
</div>
</div>
<div className="flex flex-col gap-xs">
<button className="material-symbols-outlined text-xs p-xs hover:bg-surface-container rounded" data-icon="edit">edit</button>
<button className="material-symbols-outlined text-xs p-xs text-error hover:bg-error/10 rounded" data-icon="block">block</button>
</div>
</div>
</div>
</section>

<section className="col-span-12 lg:col-span-5 bg-white border border-outline-variant shadow-sm rounded-lg overflow-hidden">
<div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
<h3 className="font-headline-md text-headline-md text-on-surface">Target Benchmarking</h3>
<div className="flex items-center gap-xs px-sm py-xs bg-white border border-outline-variant rounded">
<span className="font-label-caps text-[10px]">MONTH: NOV 2024</span>
</div>
</div>
<div className="p-md space-y-md">
<div className="grid grid-cols-12 gap-sm items-center">
<div className="col-span-4 font-label-caps text-label-caps text-on-surface">Lead Gen</div>
<div className="col-span-5 relative">
<input className="w-full pl-sm pr-lg py-xs border border-outline-variant rounded focus:ring-1 focus:ring-primary font-data-mono text-data-mono" type="number" value="1200"/>
<span className="absolute right-xs top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant">Units</span>
</div>
<div className="col-span-3 text-right">
<span className="text-[10px] text-green-600 font-bold">+12% YoY</span>
</div>
</div>
<div className="grid grid-cols-12 gap-sm items-center">
<div className="col-span-4 font-label-caps text-label-caps text-on-surface">Conversion</div>
<div className="col-span-5 relative">
<input className="w-full pl-sm pr-lg py-xs border border-outline-variant rounded focus:ring-1 focus:ring-primary font-data-mono text-data-mono" type="number" value="15"/>
<span className="absolute right-xs top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant">%</span>
</div>
<div className="col-span-3 text-right">
<span className="text-[10px] text-primary font-bold">Baseline</span>
</div>
</div>
<div className="grid grid-cols-12 gap-sm items-center">
<div className="col-span-4 font-label-caps text-label-caps text-on-surface">Retention</div>
<div className="col-span-5 relative">
<input className="w-full pl-sm pr-lg py-xs border border-outline-variant rounded focus:ring-1 focus:ring-primary font-data-mono text-data-mono" type="number" value="88"/>
<span className="absolute right-xs top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant">%</span>
</div>
<div className="col-span-3 text-right">
<span className="text-[10px] text-error font-bold">-2.4%</span>
</div>
</div>
<button className="w-full py-sm bg-surface-container-high hover:bg-surface-variant text-on-surface font-bold text-xs rounded transition-colors uppercase tracking-widest mt-md">Save New Targets</button>
</div>
</section>

<section className="col-span-12 bg-white border border-outline-variant shadow-sm rounded-lg">
<div className="p-md border-b border-outline-variant flex items-center justify-between">
<div>
<h3 className="font-headline-md text-headline-md text-on-surface">Script Library (Read-Only Archive)</h3>
<p className="text-xs text-on-surface-variant">Published scripts for verification only. Request edits from content head.</p>
</div>
<button className="text-primary hover:underline font-label-caps text-label-caps">View Change Log</button>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-outline-variant bg-surface-container-low">
<div className="p-md border-r border-outline-variant/50">
<h4 className="font-bold text-sm mb-xs flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant text-sm" data-icon="description">description</span>
                            Onboarding Script v4.2
                        </h4>
<div className="mt-md p-sm bg-white border border-outline-variant rounded h-48 overflow-y-auto custom-scrollbar font-body-hindi text-body-hindi text-on-surface-variant leading-relaxed select-none pointer-events-none">
                            "नमस्ते, मैं ट्रकमित्र से [Caller Name] बात कर रहा हूँ। क्या मेरी बात [Lead Name] से हो रही है? हम आपकी लॉजिस्टिक्स यात्रा को आसान बनाने के लिए कुछ बेहतरीन समाधान लाए हैं..."
                        </div>
</div>
<div className="p-md border-r border-outline-variant/50">
<h4 className="font-bold text-sm mb-xs flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant text-sm" data-icon="description">description</span>
                            Renewal Pitch v2.1
                        </h4>
<div className="mt-md p-sm bg-white border border-outline-variant rounded h-48 overflow-y-auto custom-scrollbar font-body-hindi text-body-hindi text-on-surface-variant leading-relaxed select-none pointer-events-none">
                            "प्रिय ग्राहक, आपके ट्रकमित्र सब्सक्रिप्शन को रिन्यू करने का समय आ गया है। इस महीने हमारे पास आपके लिए विशेष डिस्काउंट ऑफर हैं जो आपकी बचत बढ़ाएंगे..."
                        </div>
</div>
<div className="p-md">
<h4 className="font-bold text-sm mb-xs flex items-center gap-sm">
<span className="material-symbols-outlined text-on-surface-variant text-sm" data-icon="description">description</span>
                            Escalation Protocol
                        </h4>
<div className="mt-md p-sm bg-white border border-outline-variant rounded h-48 overflow-y-auto custom-scrollbar font-body-hindi text-body-hindi text-on-surface-variant leading-relaxed select-none pointer-events-none">
                            "असुविधा के लिए हमें खेद है। मैं आपकी कॉल को हमारे सीनियर सुपरवाइजर को ट्रांसफर कर रहा हूँ जो इस मुद्दे का तुरंत समाधान करेंगे। कृपया लाइन पर बने रहें..."
                        </div>
</div>
</div>
<div className="p-sm flex justify-center bg-surface-container-low/50">
<p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Last Modified by content_admin_01 on 24 Oct 2024</p>
</div>
</section>
</div>
</main>
  );
};

export default Page07Settings;
