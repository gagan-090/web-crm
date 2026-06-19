import React from 'react';

export const SpecialCategoriesScriptLibrary: React.FC = () => {
  return (
    <main className="p-gutter min-h-screen">
<div className="max-w-container-max mx-auto">

<div className="flex overflow-x-auto gap-base border-b border-outline-variant mb-lg no-scrollbar">
<button className="tab-btn px-lg py-md font-label-md text-label-md border-b-2 border-primary text-primary whitespace-nowrap active" id="tab-foreman" >Foreman</button>
<button className="tab-btn px-lg py-md font-label-md text-label-md border-b-2 border-transparent text-on-surface-variant whitespace-nowrap" id="tab-association" >Association</button>
<button className="tab-btn px-lg py-md font-label-md text-label-md border-b-2 border-transparent text-on-surface-variant whitespace-nowrap" id="tab-puncture" >Puncture Point</button>
<button className="tab-btn px-lg py-md font-label-md text-label-md border-b-2 border-transparent text-on-surface-variant whitespace-nowrap" id="tab-dhabha" >Driver Dhabha</button>
</div>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-lg">

<div className="lg:col-span-7 space-y-lg">

<div className="bg-surface-container-low p-md rounded-xl flex items-center justify-between border border-outline-variant">
<span className="font-label-md text-label-md text-on-surface-variant">कॉल प्रयास साइकिल (Attempt Cycle)</span>
<div className="flex items-center gap-xs">
<button className="attempt-chip w-8 h-8 rounded-full border border-primary bg-primary text-on-primary flex items-center justify-center text-xs font-bold transition-all" >1</button>
<div className="w-4 h-[2px] bg-outline-variant"></div>
<button className="attempt-chip w-8 h-8 rounded-full border border-outline text-on-surface-variant flex items-center justify-center text-xs font-bold transition-all" >2</button>
<div className="w-4 h-[2px] bg-outline-variant"></div>
<button className="attempt-chip w-8 h-8 rounded-full border border-outline text-on-surface-variant flex items-center justify-center text-xs font-bold transition-all" >3</button>
<div className="w-4 h-[2px] bg-outline-variant"></div>
<button className="attempt-chip w-8 h-8 rounded-full border border-outline text-on-surface-variant flex items-center justify-center text-xs font-bold transition-all" >4</button>
<div className="w-4 h-[2px] bg-outline-variant"></div>
<button className="attempt-chip w-8 h-8 rounded-full border border-outline text-on-surface-variant flex items-center justify-center text-xs font-bold transition-all" >5</button>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm">
<div className="flex justify-between items-start mb-md">
<div>
<h2 className="font-headline-md text-headline-md text-primary mb-1">कन्वर्सेशन स्क्रिप्ट (Attempt <span id="current-attempt-display">1</span>)</h2>
<p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">Standard Operating Procedure</p>
</div>
<button className="flex items-center gap-xs text-primary border border-primary px-3 py-1 rounded-lg text-xs font-bold hover:bg-primary-container transition-colors">
<span className="material-symbols-outlined text-sm">volume_up</span>
                                सुनें (Listen)
                            </button>
</div>
<div className="space-y-lg devanagari">
<div className="attempt-line pl-10 relative">
<div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-secondary-container flex items-center justify-center z-10">
<span className="material-symbols-outlined text-on-secondary-container">record_voice_over</span>
</div>
<div className="bg-surface-container-low p-md rounded-lg">
<p className="text-on-surface font-bold text-sm mb-1">प्रारंभिक अभिवादन (Introduction)</p>
<p className="text-on-surface-variant text-lg leading-relaxed" id="script-intro">"नमस्ते! मैं ट्रक मित्र से बात कर रहा हूँ। क्या मेरी बात फ़ोरमैन साहब से हो सकती है? हम आपके ट्रांसपोर्ट नेटवर्क को डिजिटल रूप से सशक्त बनाने के लिए आए हैं।"</p>
</div>
</div>
<div className="attempt-line pl-10 relative">
<div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-primary-container flex items-center justify-center z-10">
<span className="material-symbols-outlined text-on-primary-container">info</span>
</div>
<div className="bg-surface-container-low p-md rounded-lg">
<p className="text-on-surface font-bold text-sm mb-1">मुख्य संदेश (Key Message)</p>
<p className="text-on-surface-variant text-lg leading-relaxed" id="script-main">"ट्रक मित्र के साथ जुड़कर आप अपने क्षेत्र के ट्रकों और ड्राइवरों का डेटा मैनेज कर सकते हैं और हर सफल बुकिंग पर इंसेंटिव कमा सकते हैं। यह पूरी तरह फ्री है और आपकी कमाई बढ़ाने में मदद करेगा।"</p>
</div>
</div>
<div className="attempt-line pl-10 relative">
<div className="absolute left-0 top-0 w-10 h-10 rounded-full bg-secondary text-on-secondary flex items-center justify-center z-10">
<span className="material-symbols-outlined">call_end</span>
</div>
<div className="bg-surface-container-low p-md rounded-lg">
<p className="text-on-surface font-bold text-sm mb-1">अगला कदम (Next Step)</p>
<p className="text-on-surface-variant text-lg leading-relaxed" id="script-cta">"क्या मैं कल आपसे मिलने आ सकता हूँ या आपको व्हाट्सएप पर ट्रेनिंग वीडियो भेज दूँ?"</p>
</div>
</div>
</div>
</div>

<div className="space-y-md">
<h3 className="font-headline-md text-headline-md flex items-center gap-xs">
<span className="material-symbols-outlined text-error">warning</span>
                            संभावित आपत्तियाँ (Objections)
                        </h3>
<div className="grid grid-cols-1 md:grid-cols-2 gap-md">
<div className="bg-error-container p-md rounded-xl border border-error border-opacity-20 flex flex-col justify-between">
<p className="font-bold text-on-error-container devanagari mb-2">"मुझे ऐप इस्तेमाल करना नहीं आता"</p>
<div className="bg-surface-container-lowest p-sm rounded-lg mt-md border border-outline-variant">
<p className="text-xs font-bold text-primary uppercase mb-1">निवारण (Solution)</p>
<p className="text-sm devanagari">"सर, यह व्हाट्सएप जितना आसान है। हम आपको 5 मिनट की ट्रेनिंग देंगे और हमारे सपोर्ट एजेंट हमेशा आपके साथ रहेंगे।"</p>
</div>
</div>
<div className="bg-secondary-container p-md rounded-xl border border-secondary border-opacity-20 flex flex-col justify-between">
<p className="font-bold text-on-secondary-container devanagari mb-2">"मेरे पास पहले से ही बहुत काम है"</p>
<div className="bg-surface-container-lowest p-sm rounded-lg mt-md border border-outline-variant">
<p className="text-xs font-bold text-primary uppercase mb-1">निवारण (Solution)</p>
<p className="text-sm devanagari">"यह आपका काम कम करेगा, क्योंकि ट्रकों की जानकारी अब आपको लिखनी नहीं पड़ेगी, सब ऐप में सेव होगा।"</p>
</div>
</div>
</div>
</div>
</div>

<div className="lg:col-span-5 space-y-lg">

<div className="bg-primary p-lg rounded-xl text-on-primary relative overflow-hidden" id="income-card">
<div className="relative z-10">
<h3 className="font-headline-md text-headline-md mb-2 devanagari">कमाई का मॉडल (Income Model)</h3>
<p className="text-primary-fixed-dim text-sm mb-lg">फ़ोरमैन और एसोसिएशन पार्टनर्स के लिए विशेष</p>
<div className="space-y-md">
<div className="flex justify-between items-center bg-on-primary-container p-md rounded-lg">
<span className="devanagari">प्रति ड्राइवर रजिस्ट्रेशन</span>
<span className="font-mono-data text-lg">₹50</span>
</div>
<div className="flex justify-between items-center bg-on-primary-container p-md rounded-lg">
<span className="devanagari">सफल ट्रिप कमीशन</span>
<span className="font-mono-data text-lg">2.5%</span>
</div>
<div className="flex justify-between items-center bg-on-primary-container p-md rounded-lg">
<span className="devanagari">महीने के 10+ ट्रिप बोनस</span>
<span className="font-mono-data text-lg">₹2,000</span>
</div>
</div>
<button className="w-full mt-lg bg-surface-container-lowest text-primary font-bold py-3 rounded-lg hover:bg-opacity-90 transition-opacity devanagari">
                                विस्तृत चार्ट देखें
                            </button>
</div>

<div className="absolute -right-16 -bottom-16 w-64 h-64 bg-primary-container opacity-20 rounded-full blur-3xl"></div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg">
<div className="flex items-center justify-between mb-lg">
<h3 className="font-label-md text-label-md uppercase tracking-wider text-on-surface-variant">Current Call Performance</h3>
<span className="material-symbols-outlined text-primary">analytics</span>
</div>
<div className="space-y-lg">
<div className="flex items-center gap-md">
<div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-primary">timer</span>
</div>
<div className="flex-1">
<p className="text-xs text-on-surface-variant">औसत कॉल समय (Avg Duration)</p>
<p className="font-mono-data text-xl text-primary">02:45 <span className="text-xs text-on-surface-variant">mins</span></p>
</div>
</div>
<div className="flex items-center gap-md">
<div className="w-12 h-12 rounded-full bg-surface-container-high flex items-center justify-center">
<span className="material-symbols-outlined text-primary">group</span>
</div>
<div className="flex-1">
<p className="text-xs text-on-surface-variant">सफलता दर (Success Rate)</p>
<div className="w-full bg-surface-container-high h-2 rounded-full mt-1">
<div className="bg-primary h-full rounded-full" style={{"width": "65%"}}></div>
</div>
</div>
<span className="font-mono-data text-sm font-bold">65%</span>
</div>
</div>
</div>

<div className="rounded-xl overflow-hidden border border-outline-variant aspect-video relative group cursor-pointer">
<div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent z-10"></div>
<div className="w-full h-full bg-cover bg-center transition-transform duration-700 group-hover:scale-110" data-alt="A professional high-density logistics dashboard visualization showing teal-colored truck routes and network connectivity maps across India. The aesthetic is clean and corporate, inspired by Flipkart-minimal style, featuring sharp UI elements, subtle data points, and a professional lighting setup that highlights the efficiency of the platform." style={{"backgroundImage": "url(\'https://lh3.googleusercontent.com/aida-public/AB6AXuDqyiItlBZkeD6GtaUQKsByH_-iNVZuBgcfrBQs5FHPokoLI-iBC6oBgvpM6HUo09-sAOm4GlDJ8JFd2MLfPS-hiI-_mmnop0I1-STYfHcErxelG23ELqnA65_-sy-VPYiLgS3lz8jwilT2tkjv1sQKdEFj7CoavE4tTm_xqCfNidt5p3bXpua66axJWMdDHX5PJBs49HlRrikF5wYcqeMLO2M6YiEqbnNi_Y9y_FHHutJUXdK1wjGtFz8TjBdkWgNCqEugs92auJc\')"}}></div>
<div className="absolute bottom-4 left-4 z-20 text-white">
<p className="font-bold devanagari">ट्रेनिंग वीडियो: फ़ोरमैन से बात कैसे करें</p>
<p className="text-xs opacity-80">Duration: 04:20</p>
</div>
<div className="absolute inset-0 flex items-center justify-center z-20">
<div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-white shadow-xl transition-transform group-hover:scale-125">
<span className="material-symbols-outlined text-3xl">play_arrow</span>
</div>
</div>
</div>
</div>
</div>
</div>
</main>
  );
};

export default SpecialCategoriesScriptLibrary;
