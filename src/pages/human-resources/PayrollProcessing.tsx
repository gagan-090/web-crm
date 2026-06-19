import React from 'react';

export const PayrollProcessing: React.FC = () => {
  return (
    <main className=" p-margin-page overflow-x-hidden">

<div className="mb-6 bg-error-container text-on-error-container border border-error/20 px-4 py-3 rounded flex items-center justify-between">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined" data-icon="event_busy">event_busy</span>
<div>
<span className="font-bold">7th Deadline Approaching:</span> Final approval required by 18:00 IST for bank clearance.
                    </div>
</div>
<button className="text-label-md font-bold uppercase tracking-widest hover:underline">View Schedule</button>
</div>

<div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
<div>
<h1 className="font-headline-lg text-headline-lg text-primary mb-1">Payroll Processing</h1>
<p className="text-on-surface-variant font-body-md">Batch: Oct 2023 — Operational Cycle B</p>
</div>
<div className="flex items-center gap-3">
<button className="flex items-center gap-2 px-4 py-2 border border-primary text-primary hover:bg-primary-fixed transition-colors rounded font-bold text-label-md">
<span className="material-symbols-outlined" data-icon="picture_as_pdf">picture_as_pdf</span>
                        EXPORT PAYSLIPS
                    </button>
<button className="flex items-center gap-2 px-6 py-2 bg-primary text-on-primary hover:bg-primary-container transition-all rounded shadow-md font-bold text-label-md">
<span className="material-symbols-outlined" data-icon="task_alt">task_alt</span>
                        APPROVE PAYROLL
                    </button>
</div>
</div>

<div className="grid grid-cols-1 lg:grid-cols-4 gap-gutter mb-8">
<div className="lg:col-span-3 bg-surface-container-lowest border border-outline-variant p-4 flex flex-wrap items-center gap-6">
<div className="flex flex-col gap-1.5">
<label className="text-label-md text-on-surface-variant">Billing Month</label>
<select className="bg-surface-container-low border border-outline-variant text-body-sm py-1.5 px-3 rounded min-w-[160px] focus:border-primary focus:ring-0">
<option>October 2023</option>
<option>September 2023</option>
<option>August 2023</option>
</select>
</div>
<div className="flex flex-col gap-1.5">
<label className="text-label-md text-on-surface-variant">Process Group</label>
<select className="bg-surface-container-low border border-outline-variant text-body-sm py-1.5 px-3 rounded min-w-[160px] focus:border-primary focus:ring-0">
<option>Sales &amp; Operations</option>
<option>Tech &amp; Product</option>
<option>Logistics Admin</option>
</select>
</div>
<div className="flex flex-col gap-1.5">
<label className="text-label-md text-on-surface-variant">Employment Type</label>
<div className="flex gap-2">
<button className="px-3 py-1.5 bg-primary text-on-primary text-label-md rounded">All</button>
<button className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant text-label-md rounded hover:bg-surface-variant">Fixed</button>
<button className="px-3 py-1.5 bg-surface-container-high text-on-surface-variant text-label-md rounded hover:bg-surface-variant">SC Caller</button>
</div>
</div>
</div>
<div className="bg-primary-container text-on-primary-container p-4 flex flex-col justify-between">
<p className="text-label-md opacity-70 uppercase tracking-tighter">Total Net Payout</p>
<div className="font-data-mono text-headline-md">₹ 14,82,450.00</div>
<p className="text-[10px] opacity-60">Calculated for 142 records</p>
</div>
</div>

<div className="bg-surface-container-lowest border border-outline-variant overflow-hidden">
<div className="overflow-x-auto data-table-container">
<table className="w-full text-left border-collapse">
<thead className="bg-surface-container-high border-b border-outline-variant">
<tr>
<th className="py-density-table-py px-density-table-px text-label-md text-on-surface-variant font-bold sticky-col">CALLER</th>
<th className="py-density-table-py px-density-table-px text-label-md text-on-surface-variant font-bold">ROLE</th>
<th className="py-density-table-py px-density-table-px text-label-md text-on-surface-variant font-bold text-right">BASE</th>
<th className="py-density-table-py px-density-table-px text-label-md text-on-surface-variant font-bold text-center">DAYS</th>
<th className="py-density-table-py px-density-table-px text-label-md text-on-surface-variant font-bold text-right">PRORATED</th>
<th className="py-density-table-py px-density-table-px text-label-md text-on-surface-variant font-bold text-right">REVENUE</th>
<th className="py-density-table-py px-density-table-px text-label-md text-on-surface-variant font-bold text-center">GATE STATUS</th>
<th className="py-density-table-py px-density-table-px text-label-md text-on-surface-variant font-bold text-right">INCENTIVE</th>
<th className="py-density-table-py px-density-table-px text-label-md text-on-surface-variant font-bold text-right">BONUS</th>
<th className="py-density-table-py px-density-table-px text-label-md text-on-surface-variant font-bold text-right">DED.</th>
<th className="py-density-table-py px-density-table-px text-label-md text-primary font-extrabold text-right bg-primary-fixed/20">NET PAYOUT</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant">

<tr className="hover:bg-surface-container-low transition-colors group">
<td className="py-density-table-py px-density-table-px sticky-col">
<div className="flex items-center gap-2">
<div className="w-6 h-6 bg-secondary-container rounded-full flex items-center justify-center text-[10px] font-bold text-on-secondary-container">AK</div>
<div>
<div className="text-body-sm font-bold">Amit Khanna</div>
<div className="text-[10px] text-primary uppercase font-bold">SC Caller</div>
</div>
</div>
</td>
<td className="py-density-table-py px-density-table-px text-body-sm">Lead Gen</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">24,000</td>
<td className="py-density-table-py px-density-table-px text-center text-body-sm">26</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">20,120</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">4,50,000</td>
<td className="py-density-table-py px-density-table-px text-center">
<span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-tertiary-container text-on-tertiary-container rounded text-[10px] font-bold">
<span className="material-symbols-outlined text-[12px]" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span>
                                        CROSSED
                                    </span>
</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right text-tertiary-container">8,500</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">0</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right text-error">450</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right font-bold bg-primary-fixed/10">28,170</td>
</tr>
<tr className="bg-surface-container/30 border-b border-outline-variant">
<td className="px-density-table-px py-1" colSpan={11}>
<div className="text-[10px] text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-[12px]" data-icon="info">info</span>
                                        Per-unit breakdown: 170 units @ ₹50/unit incentive applied.
                                    </div>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-density-table-py px-density-table-px sticky-col">
<div className="flex items-center gap-2">
<div className="w-6 h-6 bg-on-secondary-fixed-variant rounded-full flex items-center justify-center text-[10px] font-bold text-white">SP</div>
<div>
<div className="text-body-sm font-bold">Sneha Patil</div>
<div className="text-[10px] text-secondary uppercase font-bold">WFH Agent</div>
</div>
</div>
</td>
<td className="py-density-table-py px-density-table-px text-body-sm">Retention</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">30,000</td>
<td className="py-density-table-py px-density-table-px text-center text-body-sm">30</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">30,000</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">2,10,000</td>
<td className="py-density-table-py px-density-table-px text-center">
<span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-outline-variant/30 text-outline rounded text-[10px] font-bold">
<span className="material-symbols-outlined text-[12px]" data-icon="cancel">cancel</span>
                                        NOT MET
                                    </span>
</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right text-outline italic">0</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right text-secondary">2,500</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right text-error">200</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right font-bold bg-primary-fixed/10">32,300</td>
</tr>
<tr className="bg-surface-container/30 border-b border-outline-variant">
<td className="px-density-table-px py-1" colSpan={11}>
<div className="text-[10px] text-on-surface-variant flex items-center gap-2">
<span className="material-symbols-outlined text-[12px]" data-icon="home_work">home_work</span>
                                        Fixed + Conversion Bonus: Includes ₹2,500 remote allowance for 100% attendance.
                                    </div>
</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-density-table-py px-density-table-px sticky-col">
<div className="flex items-center gap-2">
<div className="w-6 h-6 bg-primary rounded-full flex items-center justify-center text-[10px] font-bold text-white">RM</div>
<div>
<div className="text-body-sm font-bold">Rahul Mishra</div>
<div className="text-[10px] text-outline-variant uppercase font-bold">Standard</div>
</div>
</div>
</td>
<td className="py-density-table-py px-density-table-px text-body-sm">Field Sales</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">45,000</td>
<td className="py-density-table-py px-density-table-px text-center text-body-sm">28</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">41,400</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">12,50,000</td>
<td className="py-density-table-py px-density-table-px text-center">
<span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-tertiary-container text-on-tertiary-container rounded text-[10px] font-bold">
<span className="material-symbols-outlined text-[12px]" data-icon="check_circle" style={{"fontVariationSettings": "\'FILL\' 1"}}>check_circle</span>
                                        CROSSED
                                    </span>
</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right text-tertiary-container">22,000</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">5,000</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right text-error">1,200</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right font-bold bg-primary-fixed/10">67,200</td>
</tr>

<tr className="hover:bg-surface-container-low transition-colors">
<td className="py-density-table-py px-density-table-px sticky-col">
<div className="flex items-center gap-2">
<div className="w-6 h-6 bg-surface-dim rounded-full flex items-center justify-center text-[10px] font-bold text-on-surface">VJ</div>
<div>
<div className="text-body-sm font-bold">Vikram Joshi</div>
<div className="text-[10px] text-outline-variant uppercase font-bold">Standard</div>
</div>
</div>
</td>
<td className="py-density-table-py px-density-table-px text-body-sm">Support</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">32,000</td>
<td className="py-density-table-py px-density-table-px text-center text-body-sm">29</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">30,400</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">80,000</td>
<td className="py-density-table-py px-density-table-px text-center">
<span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-outline-variant/30 text-outline rounded text-[10px] font-bold">
<span className="material-symbols-outlined text-[12px]" data-icon="cancel">cancel</span>
                                        NOT MET
                                    </span>
</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right text-outline italic">0</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right">0</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right text-error">0</td>
<td className="py-density-table-py px-density-table-px font-data-mono text-right font-bold bg-primary-fixed/10">30,400</td>
</tr>
</tbody>
</table>
</div>
</div>

<div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-gutter">
<div className="bg-surface-container-lowest border border-outline-variant p-4">
<h3 className="text-label-md font-bold text-primary mb-4 uppercase tracking-wider">Payroll Activity</h3>
<div className="space-y-4">
<div className="flex gap-3">
<div className="flex flex-col items-center">
<div className="w-2 h-2 rounded-full bg-primary mt-1.5"></div>
<div className="w-px h-full bg-outline-variant"></div>
</div>
<div>
<p className="text-body-sm font-bold">Calculations Validated</p>
<p className="text-[11px] text-on-surface-variant">System • 09:12 AM</p>
</div>
</div>
<div className="flex gap-3">
<div className="flex flex-col items-center">
<div className="w-2 h-2 rounded-full bg-outline-variant mt-1.5"></div>
<div className="w-px h-full bg-outline-variant"></div>
</div>
<div>
<p className="text-body-sm">Deductions Imported (CSV)</p>
<p className="text-[11px] text-on-surface-variant">Admin • Yesterday</p>
</div>
</div>
<div className="flex gap-3">
<div className="flex flex-col items-center">
<div className="w-2 h-2 rounded-full bg-outline-variant mt-1.5"></div>
</div>
<div>
<p className="text-body-sm">Gate Criteria Defined</p>
<p className="text-[11px] text-on-surface-variant">HR Manager • 02 Oct</p>
</div>
</div>
</div>
</div>
<div className="md:col-span-2 bg-surface-container-lowest border border-outline-variant p-6 flex flex-col items-center justify-center relative overflow-hidden">
<div className="relative z-10 text-center">
<span className="material-symbols-outlined text-48px text-primary opacity-20 mb-2" data-icon="account_balance" style={{"fontSize": "48px"}}>account_balance</span>
<h3 className="text-headline-md text-primary">Final Clearance Required</h3>
<p className="text-on-surface-variant text-body-md max-w-md mx-auto mt-2">All records have passed the integrity check. Upon approval, funds will be released to the escrow account for disbursement.</p>
<button className="mt-6 px-10 py-3 bg-primary text-on-primary font-bold rounded-lg shadow-lg hover:scale-[1.02] active:scale-95 transition-all">
                            CONFIRM AND RELEASE PAYROLL
                        </button>
</div>

<div className="absolute -right-20 -bottom-20 w-64 h-64 border-8 border-primary/5 rounded-full"></div>
</div>
</div>
</main>
  );
};

export default PayrollProcessing;
