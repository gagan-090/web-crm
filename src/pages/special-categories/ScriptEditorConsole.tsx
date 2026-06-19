import React from 'react';

export const ScriptEditorConsole: React.FC = () => {
  return (
    <main className=" flex flex-col bg-background">

<div className="h-12 border-b border-outline-variant flex items-center px-lg justify-between bg-surface-container-low">
<div className="flex items-center gap-2 text-body-sm">
<span className="text-on-surface-variant">Scripts</span>
<span className="text-outline">/</span>
<span className="font-bold text-on-surface">Hindi_Onboarding_V4</span>
<span className="bg-on-secondary-container/10 text-on-secondary-container px-2 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider">Draft</span>
</div>
<div className="flex items-center gap-lg">
<div className="flex items-center gap-2">
<span className="text-body-sm text-on-surface-variant font-medium">Notify callers on save</span>
<button className="w-8 h-4 bg-primary rounded-full relative transition-colors" id="notifyToggle" >
<span className="absolute right-1 top-1 w-2 h-2 bg-white rounded-full transition-all"></span>
</button>
</div>
<button className="bg-primary text-on-primary px-lg py-1.5 rounded text-body-sm font-semibold flex items-center gap-2 hover:opacity-90 active:opacity-80 transition-all">
<span className="material-symbols-outlined text-[18px]">save</span>
                        Push Changes
                    </button>
</div>
</div>

<div className="flex flex-1 overflow-hidden">

<div className="w-16 border-r border-outline-variant bg-surface flex flex-col items-center py-lg gap-lg">
<button className="w-10 h-10 rounded border border-primary bg-primary/5 text-primary flex items-center justify-center font-bold font-code-sm hover:bg-primary/10 transition-colors" title="Dialer Workflow">DW</button>
<button className="w-10 h-10 rounded border border-outline-variant text-on-surface-variant flex items-center justify-center font-bold font-code-sm hover:bg-surface-container-high transition-colors" title="Transaction Response">TR</button>
<button className="w-10 h-10 rounded border border-outline-variant text-on-surface-variant flex items-center justify-center font-bold font-code-sm hover:bg-surface-container-high transition-colors" title="Member Management">MM</button>
<button className="w-10 h-10 rounded border border-outline-variant text-on-surface-variant flex items-center justify-center font-bold font-code-sm hover:bg-surface-container-high transition-colors" title="Script Configuration">SC</button>
</div>

<div className="flex-1 flex overflow-hidden">

<div className="w-1/2 flex flex-col border-r border-outline-variant">
<div className="bg-surface-container-low px-lg py-2 border-b border-outline-variant flex justify-between items-center">
<span className="font-code-sm text-body-sm uppercase tracking-tight text-on-surface-variant font-semibold">Raw Hindi Input</span>
<span className="text-[10px] text-outline font-code-sm">UTF-8 • LINE 12, COL 1</span>
</div>
<textarea className="flex-1 w-full p-xl bg-surface-container-lowest text-body-md font-hindi-md focus:ring-0 border-none resize-none custom-scrollbar" spellCheck={false}>नमस्ते, मैं एबीसी सर्विसेज से बोल रहा हूँ। 

क्या मुझे आपका दो मिनट मिल सकता है? हम आज आपके वर्तमान प्लान के बारे में बात करने के लिए कॉल कर रहे हैं। हमारे पास कुछ नए अपडेट हैं जो आपकी बचत को बढ़ा सकते हैं।

[प्रतीक्षा करें]

धन्यवाद। आपका समय हमारे लिए महत्वपूर्ण है।</textarea>

<div className="h-1/3 border-t border-outline-variant bg-surface flex flex-col overflow-hidden">
<div className="px-lg py-2 bg-surface-container border-b border-outline-variant flex justify-between items-center">
<span className="font-bold text-body-sm uppercase tracking-wider text-on-surface-variant">Objection Routing</span>
<button className="text-primary text-body-sm font-semibold flex items-center gap-1 hover:underline"><span className="material-symbols-outlined text-[16px]">add_box</span>Add Case</button>
</div>
<div className="overflow-y-auto custom-scrollbar">
<table className="w-full text-left border-collapse">
<thead className="sticky top-0 bg-surface-container-high text-on-surface-variant text-[11px] font-bold uppercase border-b border-outline-variant">
<tr>
<th className="px-lg py-2 w-10"></th>
<th className="px-lg py-2">Trigger Key</th>
<th className="px-lg py-2">Action</th>
<th className="px-lg py-2 text-right">Status</th>
</tr>
</thead>
<tbody className="text-body-sm">
<tr className="border-b border-outline-variant hover:bg-surface-container-low cursor-move group">
<td className="px-lg py-2 text-outline"><span className="material-symbols-outlined text-[18px]">drag_indicator</span></td>
<td className="px-lg py-2 font-code-sm text-primary">"BUSY_LATER"</td>
<td className="px-lg py-2">Redirect to Schedule_CB</td>
<td className="px-lg py-2 text-right"><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>Active</td>
</tr>
<tr className="border-b border-outline-variant hover:bg-surface-container-low cursor-move group">
<td className="px-lg py-2 text-outline"><span className="material-symbols-outlined text-[18px]">drag_indicator</span></td>
<td className="px-lg py-2 font-code-sm text-primary">"NOT_INTERESTED"</td>
<td className="px-lg py-2">Launch Value_Prop_A</td>
<td className="px-lg py-2 text-right"><span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-2"></span>Active</td>
</tr>
<tr className="border-b border-outline-variant hover:bg-surface-container-low cursor-move group">
<td className="px-lg py-2 text-outline"><span className="material-symbols-outlined text-[18px]">drag_indicator</span></td>
<td className="px-lg py-2 font-code-sm text-primary">"ALREADY_HAS"</td>
<td className="px-lg py-2">Launch Comp_Analysis</td>
<td className="px-lg py-2 text-right"><span className="inline-block w-2 h-2 rounded-full bg-amber-500 mr-2"></span>Pending</td>
</tr>
</tbody>
</table>
</div>
</div>
</div>

<div className="flex-1 flex flex-col bg-surface-container-low">
<div className="px-lg py-2 border-b border-outline-variant flex justify-between items-center bg-surface-container">
<span className="font-code-sm text-body-sm uppercase tracking-tight text-on-surface-variant font-semibold">Noto Sans Preview</span>
<div className="flex gap-2">
<span className="material-symbols-outlined text-[18px] text-outline cursor-pointer hover:text-primary">desktop_windows</span>
<span className="material-symbols-outlined text-[18px] text-outline cursor-pointer hover:text-primary">smartphone</span>
</div>
</div>
<div className="flex-1 p-xl overflow-y-auto custom-scrollbar">
<div className="max-w-md mx-auto bg-white p-xl rounded shadow-sm border border-outline-variant">
<div className="mb-lg border-b border-outline-variant pb-md flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary font-bold">A</div>
<div>
<div className="font-bold text-body-sm text-on-surface">Agent View</div>
<div className="text-[10px] text-outline uppercase font-bold">Standard UI Preview</div>
</div>
</div>
<div className="font-hindi-md text-[18px] leading-relaxed text-on-surface">
<p className="mb-lg">नमस्ते, मैं एबीसी सर्विसेज से बोल रहा हूँ।</p>
<p className="mb-lg">क्या मुझे आपका दो मिनट मिल सकता है? हम आज आपके वर्तमान प्लान के बारे में बात करने के लिए कॉल कर रहे हैं। हमारे पास कुछ नए अपडेट हैं जो आपकी बचत को बढ़ा सकते हैं।</p>
<div className="p-md bg-surface-container-high rounded border-l-4 border-primary text-body-sm font-body-md mb-lg italic">
                                        [प्रतीक्षा करें]
                                    </div>
<p>धन्यवाद। आपका समय हमारे लिए महत्वपूर्ण है।</p>
</div>
<div className="mt-xl grid grid-cols-2 gap-md">
<button className="bg-surface-container-highest py-2 text-body-sm font-bold border border-outline-variant rounded">हाँ, बताएं</button>
<button className="bg-surface-container-highest py-2 text-body-sm font-bold border border-outline-variant rounded">समय नहीं है</button>
</div>
</div>
</div>
</div>

<aside className="w-64 border-l border-outline-variant bg-surface flex flex-col">
<div className="p-lg border-b border-outline-variant">
<h3 className="font-bold text-body-sm uppercase tracking-widest text-on-surface-variant mb-4">Version History</h3>
<div className="space-y-sm">

<div className="p-sm rounded bg-primary/5 border border-primary/20 relative group">
<div className="flex justify-between items-start mb-1">
<span className="font-bold text-body-sm text-primary">V4.2.1 (Current)</span>
<span className="text-[10px] text-outline">JUST NOW</span>
</div>
<p className="text-[11px] text-on-surface-variant leading-tight mb-2">Updated introductory greeting for clarity in Hindi dialect.</p>
<div className="flex items-center gap-2">
<span className="w-4 h-4 rounded-full overflow-hidden">
<img className="w-full h-full object-cover" data-alt="Small round avatar of a system user, minimalist professional look." src="https://lh3.googleusercontent.com/aida-public/AB6AXuD8nVp_6NXnX4ajWmDWIerDkKG_weE-kc_vZpb5WuafdSbrc-6Qa7z4RIp8RNxOj1RCCTYqJ5OuOnrOSPzISnquZDkB-g5EK5zTNranooxmjrhmGrfJNslTxZyLlOMA-jJ3bqPK0GtBrJgaa4LXGPUx9GWd9Gmz3ejeFAYpPbxIopE8WgNiDdw1wRVTZF7oatWYqa8Qzew34M1ag2uWubbmB9w-9g2lnIXCSITKo8x6JqoI-2Dz7f9WZts9eDeTiT3zYLy4e5RfC64"/>
</span>
<span className="text-[10px] font-medium">Modified by Admin</span>
</div>
</div>
<div className="p-sm rounded border border-outline-variant hover:bg-surface-container-high transition-all group">
<div className="flex justify-between items-start mb-1">
<span className="font-bold text-body-sm">V4.2.0</span>
<span className="text-[10px] text-outline">2H AGO</span>
</div>
<p className="text-[11px] text-on-surface-variant leading-tight mb-2">Initial Hindi translation commit for campaign alpha.</p>
<button className="w-full py-1 text-[10px] font-bold uppercase tracking-widest bg-secondary-container text-on-secondary-fixed-variant rounded opacity-0 group-hover:opacity-100 transition-opacity">Revert to this</button>
</div>
<div className="p-sm rounded border border-outline-variant hover:bg-surface-container-high transition-all group">
<div className="flex justify-between items-start mb-1">
<span className="font-bold text-body-sm">V4.1.9</span>
<span className="text-[10px] text-outline">OCT 24</span>
</div>
<p className="text-[11px] text-on-surface-variant leading-tight mb-2">Refactored objection routing for "BUSY_LATER".</p>
<button className="w-full py-1 text-[10px] font-bold uppercase tracking-widest bg-secondary-container text-on-secondary-fixed-variant rounded opacity-0 group-hover:opacity-100 transition-opacity">Revert to this</button>
</div>
</div>
</div>
<div className="mt-auto p-lg">
<button className="w-full flex items-center justify-center gap-2 text-body-sm text-on-surface-variant hover:text-primary transition-colors">
<span className="material-symbols-outlined text-[18px]">history</span>
                                View Full Audit Log
                            </button>
</div>
</aside>
</div>
</div>
</main>
  );
};

export default ScriptEditorConsole;
