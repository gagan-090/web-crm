import React from 'react';

export const MmDriverSearch: React.FC = () => {
  return (
    <main className=" min-h-screen flex flex-col">



<div className="flex-1 p-margin-desktop space-y-lg">

<section className="bg-accent-purple/10 border border-accent-purple/20 p-md rounded-xl flex items-center justify-between">
<div className="flex items-center gap-md">
<div className="w-12 h-12 bg-accent-purple rounded-lg flex items-center justify-center text-white">
<span className="material-symbols-outlined">assignment_ind</span>
</div>
<div>
<h2 className="font-headline-sm text-headline-sm text-accent-purple font-bold">Searching for: #JD-12034</h2>
<p className="text-body-sm text-on-surface-variant">Route: Delhi → Mumbai • Class: Heavy Truck • Preference: Trusted Plan Tier</p>
</div>
</div>
<button className="bg-accent-purple text-white px-lg py-md rounded-lg font-label-md hover:opacity-90 transition-all flex items-center gap-sm">
<span className="material-symbols-outlined text-[18px]">call</span>
                    Connect 3-Way
                </button>
</section>
<div className="grid grid-cols-12 gap-lg items-start">

<aside className="col-span-3 space-y-lg bg-surface-container-lowest p-lg rounded-xl border border-outline-variant">
<div className="flex items-center justify-between">
<h3 className="font-headline-sm text-primary font-bold">Filters</h3>
<button className="text-primary text-body-sm font-semibold hover:underline">Clear All</button>
</div>
<div className="space-y-md">
<label className="block">
<span className="font-label-md text-on-surface-variant block mb-xs">Origin City</span>
<input className="w-full border-outline-variant rounded-lg p-sm text-body-md focus:ring-primary-container focus:border-primary-container" type="text" value="Delhi"/>
</label>
<label className="block">
<span className="font-label-md text-on-surface-variant block mb-xs">Destination City</span>
<input className="w-full border-outline-variant rounded-lg p-sm text-body-md focus:ring-primary-container focus:border-primary-container" placeholder="Mumbai" type="text"/>
</label>
</div>
<hr className="border-outline-variant"/>
<div className="space-y-sm">
<span className="font-label-md text-on-surface-variant block">Truck Type</span>
<div className="space-y-xs">
<label className="flex items-center gap-sm text-body-md">
<input checked className="rounded-sm border-outline-variant text-primary focus:ring-primary-container" type="checkbox"/>
                                Heavy Truck (10+ Wheels)
                            </label>
<label className="flex items-center gap-sm text-body-md text-on-surface-variant">
<input className="rounded-sm border-outline-variant text-primary focus:ring-primary-container" type="checkbox"/>
                                LCV / Medium
                            </label>
<label className="flex items-center gap-sm text-body-md text-on-surface-variant">
<input className="rounded-sm border-outline-variant text-primary focus:ring-primary-container" type="checkbox"/>
                                Refrigerated
                            </label>
</div>
</div>
<div className="space-y-sm">
<span className="font-label-md text-on-surface-variant block">Plan Tier</span>
<div className="flex flex-wrap gap-xs">
<button className="px-md py-xs bg-primary-fixed text-on-primary-fixed-variant rounded-full text-body-sm font-semibold border border-primary/20">Trusted</button>
<button className="px-md py-xs bg-surface-variant text-on-surface-variant rounded-full text-body-sm font-semibold border border-outline-variant">Standard</button>
<button className="px-md py-xs bg-surface-variant text-on-surface-variant rounded-full text-body-sm font-semibold border border-outline-variant">Premium</button>
</div>
</div>
<div className="space-y-sm">
<span className="font-label-md text-on-surface-variant block">Experience (Years)</span>
<div className="flex items-center gap-sm">
<input className="w-full border-outline-variant rounded-lg p-sm text-body-sm" placeholder="Min" type="number"/>
<span className="text-outline-variant">—</span>
<input className="w-full border-outline-variant rounded-lg p-sm text-body-sm" placeholder="Max" type="number"/>
</div>
</div>
<div className="space-y-sm">
<span className="font-label-md text-on-surface-variant block">License Class</span>
<select className="w-full border-outline-variant rounded-lg p-sm text-body-md bg-surface">
<option>Class H (Heavy)</option>
<option>Class M (Medium)</option>
<option>Hazardous Goods</option>
</select>
</div>
<button className="w-full bg-primary text-white py-md rounded-lg font-label-md shadow-sm hover:shadow-md transition-shadow">Apply Filter</button>
</aside>

<div className="col-span-9 space-y-lg">
<div className="flex justify-between items-center">
<p className="text-on-surface-variant text-body-md">Showing <span className="font-bold text-on-surface">14 verified drivers</span> matching your criteria</p>
<div className="flex items-center gap-sm">
<span className="text-body-sm text-on-surface-variant">Sort by:</span>
<select className="border-none bg-transparent text-body-sm font-bold text-primary focus:ring-0 cursor-pointer">
<option>Best Match</option>
<option>Exp: High to Low</option>
<option>Last Active</option>
</select>
</div>
</div>

<div className="bg-surface-container-lowest rounded-xl border border-outline-variant overflow-hidden">
<table className="w-full text-left border-collapse">
<thead>
<tr className="bg-surface-container-low border-b border-outline-variant">
<th className="px-lg py-md font-label-md text-on-surface-variant uppercase tracking-wider">Driver Name</th>
<th className="px-lg py-md font-label-md text-on-surface-variant uppercase tracking-wider">TMID</th>
<th className="px-lg py-md font-label-md text-on-surface-variant uppercase tracking-wider">City</th>
<th className="px-lg py-md font-label-md text-on-surface-variant uppercase tracking-wider">Exp</th>
<th className="px-lg py-md font-label-md text-on-surface-variant uppercase tracking-wider">Route Pref.</th>
<th className="px-lg py-md font-label-md text-on-surface-variant uppercase tracking-wider">Last Active</th>
<th className="px-lg py-md font-label-md text-on-surface-variant uppercase tracking-wider text-right">Actions</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="driver-table-row hover:bg-surface-variant/30 transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant flex-shrink-0">
<img className="w-full h-full rounded-full object-cover" data-alt="A portrait of a senior Indian truck driver with a kind expression and silver-grey beard, wearing a traditional light brown turban and a simple cotton shirt. The photo is taken in bright daylight with a shallow depth of field, showing the edge of a clean, white heavy-duty truck in the background. The lighting is natural and clear, emphasizing professionalism and experience." src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmE3xZZdGSTsRNhQGIzC2R4iqhUhnIeP2J2Y5bUi82Xslp1ujLPxxaHS_qDVuO9D0XyI2wTRdCi8_n9nCvYacI0T9zeHlXwFPNwnPnhf04h0281Hjn9lkS4fo5FOWXRGVb6FQODECu3Rj48aQuYQOb_L25zMibiQnoF4IjWSYA1u1ZWbU3hrrZnM1JaOwHP5Qs6WGBaxn9Wh3IYd8pi9fYk5y9s5kRL3giLZygrb9rPRKkOZlU5wsY3RN-S1TxB1Y9EyqvZcqauN4"/>
</div>
<div>
<p className="font-bold text-on-surface">Rajesh Kumar</p>
<span className="text-[10px] uppercase font-bold px-sm py-px rounded bg-primary-fixed text-on-primary-fixed border border-primary/20">Trusted</span>
</div>
</div>
</td>
<td className="px-lg py-md font-mono-data text-on-surface-variant">TM-99201</td>
<td className="px-lg py-md text-body-md">New Delhi</td>
<td className="px-lg py-md">
<span className="text-body-md font-bold">12 Yrs</span>
</td>
<td className="px-lg py-md text-body-sm text-on-surface-variant">North-West Corridor</td>
<td className="px-lg py-md text-body-sm">
<div className="flex items-center gap-xs">
<div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            Online
                                        </div>
</td>
<td className="px-lg py-md text-right">
<button className="add-btn opacity-0 bg-primary-container text-on-primary-container font-label-md px-md py-sm rounded-lg hover:opacity-90 active:scale-[0.98] transition-all">Add to Shortlist</button>
</td>
</tr>

<tr className="driver-table-row hover:bg-surface-variant/30 transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant flex-shrink-0">
<img className="w-full h-full rounded-full object-cover" data-alt="A close-up portrait of a younger, determined truck driver with short black hair and a clean-shaven face. He is wearing a dark grey utility vest over a white t-shirt. The background is a bustling terminal at sunrise, with warm golden light hitting the side of his face. The style is modern, cinematic, and focuses on the reliability of the worker." src="https://lh3.googleusercontent.com/aida-public/AB6AXuCJ17tnRS6KGB7R01HV-ft54XaINAt8IT3gDQmP-1I4HLd0O5bk1HKhiid08MxO3IgEfIJZziFbf5fHwtwRvjarIudSHg3agc5OT-tWe3YkuNS9XdohDWrT4eR-mgohgX4ua-DT3c1w-yvgFtTuIli2jC4Qm5gcAg9KyaJZBQOwuV3mkGGeqC5k-xVJOlDcDH1nL02-YtistGTL4XP5Ee7FYQHCL4WtF9lSsaaC7fU__eIJJ5v0eUubPe8IFqvPq0IDrtVrP3dZbp8"/>
</div>
<div>
<p className="font-bold text-on-surface">Amit Sharma</p>
<span className="text-[10px] uppercase font-bold px-sm py-px rounded bg-surface-variant text-on-surface-variant border border-outline-variant">Standard</span>
</div>
</div>
</td>
<td className="px-lg py-md font-mono-data text-on-surface-variant">TM-10482</td>
<td className="px-lg py-md text-body-md">Gurgaon</td>
<td className="px-lg py-md">
<span className="text-body-md font-bold">8 Yrs</span>
</td>
<td className="px-lg py-md text-body-sm text-on-surface-variant">Pan-India Express</td>
<td className="px-lg py-md text-body-sm">2 hours ago</td>
<td className="px-lg py-md text-right">
<button className="add-btn opacity-0 bg-primary-container text-on-primary-container font-label-md px-md py-sm rounded-lg hover:opacity-90 active:scale-[0.98] transition-all">Add to Shortlist</button>
</td>
</tr>

<tr className="driver-table-row hover:bg-surface-variant/30 transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant flex-shrink-0">
<img className="w-full h-full rounded-full object-cover" data-alt="A middle-aged professional driver with a confident smile, wearing a blue button-down shirt. He has a neatly trimmed beard and is standing in a modern cargo warehouse with stacks of pallets in the soft-focus background. The image has a clean corporate aesthetic with high-key lighting and a professional atmosphere." src="https://lh3.googleusercontent.com/aida-public/AB6AXuBVXNZxrFq6Hqv791gDO6guZjnTmettW9NR9MkNycYCoBVdYl8cD15BxKrgmYUnQbEboB5QOcm9_mbivK4I8BWfS3MDcijuCQHbcOrE4gRGQE2JtSQxmjyS1YlP5Fx-zj_73lApAJj0RONK8RBcpRKMvmq_9KNIbshX0te2hkX07381491BJvMj966UB7d34EBlzWiDMiB4_Z6AYzKq5A9eCrMR6Msac0CjqCmP8w2ZkBDrHhDNW14R6EdG-EMVdxxpPxX7IvRPtLo"/>
</div>
<div>
<p className="font-bold text-on-surface">Harpreet Singh</p>
<span className="text-[10px] uppercase font-bold px-sm py-px rounded bg-primary-fixed text-on-primary-fixed border border-primary/20">Trusted</span>
</div>
</div>
</td>
<td className="px-lg py-md font-mono-data text-on-surface-variant">TM-08831</td>
<td className="px-lg py-md text-body-md">Ludhiana</td>
<td className="px-lg py-md">
<span className="text-body-md font-bold">15 Yrs</span>
</td>
<td className="px-lg py-md text-body-sm text-on-surface-variant">Mumbai-Delhi Route</td>
<td className="px-lg py-md text-body-sm">
<div className="flex items-center gap-xs">
<div className="w-2 h-2 rounded-full bg-green-500"></div>
                                            Online
                                        </div>
</td>
<td className="px-lg py-md text-right">
<button className="add-btn opacity-0 bg-primary-container text-on-primary-container font-label-md px-md py-sm rounded-lg hover:opacity-90 active:scale-[0.98] transition-all">Add to Shortlist</button>
</td>
</tr>

<tr className="driver-table-row hover:bg-surface-variant/30 transition-colors group">
<td className="px-lg py-md">
<div className="flex items-center gap-md">
<div className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant flex-shrink-0">
<img className="w-full h-full rounded-full object-cover" data-alt="A focused female truck driver in her 30s, wearing a high-visibility yellow vest over a navy shirt. She is leaning against a shiny chrome part of a heavy vehicle. The setting is a clean logistics park at dusk with cool blue and purple ambient lighting. The shot is high-contrast and highlights her professional expertise in a modern, inclusive workplace." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDv2brpu2q15YozzckcB8VDprPBo0VSGFUPzjZfkyEWG5TDzDWMV9d7wzVVfjiTQK9f9XoW4vqz5cdj6b23T0LMY1Y2O92wH5cnZft92izqDybIoTL07j1R8VZmf6AduFK0csuaIa3C_ySpZFRIgjLSXKEGjcpT8cgF-oi0nsoD2ekNREPSxcFpZVuYVQvzjWJLJfxcRH66Pvkm2bDkhz62KrDcp8-c6pcs5iPHNlz-tJu0GromqCnZN8C5Qx3X6tV299CM5n8srAY"/>
</div>
<div>
<p className="font-bold text-on-surface">Sanya Mirza</p>
<span className="text-[10px] uppercase font-bold px-sm py-px rounded bg-tertiary-fixed text-on-tertiary-fixed border border-tertiary/20">Premium</span>
</div>
</div>
</td>
<td className="px-lg py-md font-mono-data text-on-surface-variant">TM-11200</td>
<td className="px-lg py-md text-body-md">Faridabad</td>
<td className="px-lg py-md">
<span className="text-body-md font-bold">6 Yrs</span>
</td>
<td className="px-lg py-md text-body-sm text-on-surface-variant">Long-Haul Specialty</td>
<td className="px-lg py-md text-body-sm text-on-surface-variant opacity-60">Last seen: yesterday</td>
<td className="px-lg py-md text-right">
<button className="add-btn opacity-0 bg-primary-container text-on-primary-container font-label-md px-md py-sm rounded-lg hover:opacity-90 active:scale-[0.98] transition-all">Add to Shortlist</button>
</td>
</tr>
</tbody>
</table>
</div>

<div className="flex items-center justify-between py-md">
<p className="text-body-sm text-on-surface-variant">Page 1 of 4</p>
<div className="flex gap-xs">
<button className="p-sm rounded-lg border border-outline-variant hover:bg-surface-variant transition-colors disabled:opacity-30" disabled>
<span className="material-symbols-outlined">chevron_left</span>
</button>
<button className="w-10 h-10 rounded-lg bg-primary text-white font-bold text-body-sm">1</button>
<button className="w-10 h-10 rounded-lg hover:bg-surface-variant text-body-sm transition-colors">2</button>
<button className="w-10 h-10 rounded-lg hover:bg-surface-variant text-body-sm transition-colors">3</button>
<button className="p-sm rounded-lg border border-outline-variant hover:bg-surface-variant transition-colors">
<span className="material-symbols-outlined">chevron_right</span>
</button>
</div>
</div>
</div>
</div>
</div>
</main>
  );
};

export default MmDriverSearch;
