import React, { useState } from 'react';

export const DwPerformanceStats: React.FC = () => {
  // Stats Tab State
  const [activeTab, setActiveTab] = useState<'current' | 'history'>('current');
  
  // Simulator State
  const [revIncrease, setRevIncrease] = useState<number>(10000);
  
  // Dynamic Incentive calculation: base ₹5000 + 34.5% of revenue increase
  const estimatedEarning = 5000 + Math.round(revIncrease * 0.345);

  const formatRupee = (num: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(num);
  };

  return (
    <main className="flex flex-col h-full bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm max-w-6xl mx-auto">
      
      {/* Top Header & Tab Switcher */}
      <div className="p-md bg-surface-container-low border-b border-outline-variant flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-sm font-bold text-on-surface uppercase tracking-wide">Performance Stats & Incentives</h1>
          <p className="text-[11px] text-on-surface-variant mt-0.5">Track your monthly revenue achievements, attendance streaks, and itemized closing payouts.</p>
        </div>

        {/* Tab switch buttons */}
        <div className="bg-surface-container-high p-1 rounded-lg flex items-center gap-xs">
          <button
            onClick={() => setActiveTab('current')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'current' ? 'bg-white text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Current Month (June)
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-4 py-1.5 text-xs font-semibold rounded-md transition-all ${
              activeTab === 'history' ? 'bg-white text-primary shadow-sm font-bold' : 'text-on-surface-variant hover:text-on-surface'
            }`}
          >
            Performance History
          </button>
        </div>
      </div>

      {/* Main Stats Area scroll canvas */}
      <section className="flex-1 overflow-y-auto p-lg bg-background custom-scrollbar" id="content-canvas">
        
        {activeTab === 'current' ? (
          <div className="space-y-lg animate-in fade-in duration-300">
            
            {/* Top Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-lg text-xs">
              
              {/* Revenue Target Widget */}
              <div className="md:col-span-6 bg-white border border-outline-variant p-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div className="flex justify-between items-start mb-md">
                  <div>
                    <p className="font-bold text-on-surface-variant uppercase tracking-wider">Revenue Target (Monthly)</p>
                    <h2 className="font-display-lg text-lg font-bold text-on-surface mt-1">
                      ₹4,200 <span className="text-on-surface-variant font-normal text-xs">/ ₹50,000</span>
                    </h2>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-primary">8.4% Achieved</span>
                  </div>
                </div>
                <div className="w-full h-3 bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary transition-all duration-500 rounded-full" style={{ width: '8.4%' }}></div>
                </div>
                <div className="mt-md grid grid-cols-2 gap-md border-t border-outline-variant/30 pt-md text-xs">
                  <div>
                    <p className="text-on-surface-variant">Daily Average Rev</p>
                    <p className="font-bold text-sm text-on-surface mt-0.5">₹600</p>
                  </div>
                  <div>
                    <p className="text-on-surface-variant">Projected EOD Rev</p>
                    <p className="font-bold text-sm text-on-surface mt-0.5">₹18,600</p>
                  </div>
                </div>
              </div>

              {/* Conversion Statistics Widget */}
              <div className="md:col-span-3 bg-white border border-outline-variant p-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <p className="font-bold text-on-surface-variant uppercase tracking-wider">Call Conversion</p>
                  <div className="flex items-center gap-xs mt-1">
                    <h2 className="font-bold text-lg text-on-surface">4.34%</h2>
                    <span className="material-symbols-outlined text-accent-success text-sm font-bold">arrow_upward</span>
                  </div>
                  <p className="text-on-surface-variant mt-1 text-[11px]">+0.8% vs last week average</p>
                </div>
                <div className="border-t border-outline-variant/30 pt-md mt-sm">
                  <p className="font-bold text-on-surface-variant uppercase tracking-wider text-[10px]">Quality Audit Score</p>
                  <div className="flex justify-between items-center mt-1">
                    <span className="font-bold text-sm text-primary">82%</span>
                    <span className="bg-primary/10 text-primary px-1.5 py-0.5 rounded text-[9px] font-bold">OPTIMAL</span>
                  </div>
                </div>
              </div>

              {/* Attendance Gates Info */}
              <div className="md:col-span-3 bg-white border border-outline-variant p-lg rounded-xl shadow-sm space-y-sm flex flex-col justify-center">
                <div className="p-sm bg-surface-container-low border border-outline-variant/50 rounded-lg flex items-center gap-md">
                  <div className="w-8 h-8 rounded-full bg-accent-success/15 flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-accent-success text-sm">door_open</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Incentive Gate 1</p>
                    <p className="font-bold text-xs">Unlocked (₹4k+)</p>
                  </div>
                </div>
                
                <div className="p-sm bg-surface-container-low border border-outline-variant/50 rounded-lg flex items-center gap-md">
                  <div className="w-8 h-8 rounded-full bg-surface-container-high flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-outline text-sm">lock</span>
                  </div>
                  <div>
                    <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Incentive Gate 2</p>
                    <p className="font-bold text-xs text-on-surface-variant">Locked (Requires ₹22k)</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Incentive Breakdown & Simulator Grid */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-lg text-xs">
              
              {/* Itemized Payout Table */}
              <div className="md:col-span-8 bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm flex flex-col">
                <div className="bg-surface-container-low px-lg py-md border-b border-outline-variant">
                  <h3 className="font-bold text-on-surface">Active Incentive Metrics</h3>
                </div>
                <div className="flex-grow overflow-x-auto custom-scrollbar">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-outline-variant bg-surface-container-low/40 text-on-surface-variant font-semibold">
                        <th className="p-md font-semibold">METRIC TYPE</th>
                        <th className="p-md font-semibold text-center">CURRENT SCORE</th>
                        <th className="p-md font-semibold text-center">TARGET LIMIT</th>
                        <th className="p-md font-semibold text-right">EST. PAYOUT</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-outline-variant/20">
                      <tr className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="p-md font-semibold text-on-surface">Shipment Conversion Velocity</td>
                        <td className="p-md text-center font-mono-data text-on-surface-variant">92%</td>
                        <td className="p-md text-center font-mono-data text-on-surface-variant">95%</td>
                        <td className="p-md text-right font-bold font-mono-data text-on-surface-variant">₹0</td>
                      </tr>
                      <tr className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="p-md font-semibold text-on-surface">Call Pitch Accuracy Score</td>
                        <td className="p-md text-center font-mono-data text-on-surface-variant">98%</td>
                        <td className="p-md text-center font-mono-data text-on-surface-variant">96%</td>
                        <td className="p-md text-right font-bold font-mono-data text-accent-success">₹1,200</td>
                      </tr>
                      <tr className="hover:bg-surface-container-low/40 transition-colors">
                        <td className="p-md font-semibold text-on-surface">Daily Attendance Streak</td>
                        <td className="p-md text-center font-mono-data text-on-surface-variant">12 Days</td>
                        <td className="p-md text-center font-mono-data text-on-surface-variant">15 Days</td>
                        <td className="p-md text-right font-bold font-mono-data text-accent-success">₹500</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Incentive Simulator Slider Card */}
              <div className="md:col-span-4 bg-white border border-outline-variant p-lg rounded-xl shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-on-surface">Incentive Simulator</h3>
                  <p className="text-on-surface-variant text-[11px] mt-1">Simulate additional revenue closure to estimate monthly incentive payouts.</p>
                </div>
                
                <div className="space-y-lg my-md">
                  <div>
                    <div className="flex justify-between items-center text-xs mb-sm">
                      <span className="font-semibold text-on-surface-variant">Revenue Increase</span>
                      <span className="font-bold text-primary font-mono-data bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                        {formatRupee(revIncrease)}
                      </span>
                    </div>
                    <input 
                      className="w-full accent-primary h-1.5 bg-surface-container rounded-lg cursor-pointer transition-all" 
                      max="50000" 
                      min="0" 
                      step="1000" 
                      type="range" 
                      value={revIncrease}
                      onChange={(e) => setRevIncrease(Number(e.target.value))}
                    />
                  </div>
                  
                  <div className="bg-primary p-md rounded-lg text-white shadow-md">
                    <p className="text-[10px] uppercase font-bold tracking-wider opacity-85">Estimated Monthly Earning</p>
                    <p className="text-xl font-bold font-mono-data mt-1">{formatRupee(estimatedEarning)}</p>
                    <p className="text-[9px] mt-1.5 opacity-70 leading-tight">*Calculated based on active base salary model (₹5,000) + 34.5% itemized gates conversion share.</p>
                  </div>
                </div>
              </div>

            </div>

            {/* Attendance calendar grid */}
            <div className="bg-white border border-outline-variant p-lg rounded-xl shadow-sm text-xs">
              <div className="flex justify-between items-center mb-lg">
                <h3 className="font-bold text-on-surface">Daily Login & Attendance Streak</h3>
                <div className="flex items-center gap-md">
                  <span className="flex items-center gap-xs"><span className="w-3 h-3 rounded-sm bg-accent-success"></span> Present</span>
                  <span className="flex items-center gap-xs"><span className="w-3 h-3 rounded-sm bg-surface-container-high"></span> Upcoming Days</span>
                </div>
              </div>
              <div className="grid grid-cols-7 sm:grid-cols-10 md:grid-cols-15 lg:grid-cols-31 gap-sm">
                {Array.from({ length: 30 }).map((_, idx) => {
                  const dayNum = idx + 1;
                  const isPresent = dayNum <= 12; // 12 days streak
                  return (
                    <div 
                      key={dayNum} 
                      className={`h-8 border flex flex-col items-center justify-center rounded transition-colors ${
                        isPresent 
                          ? 'bg-accent-success/10 border-accent-success text-accent-success font-bold' 
                          : 'bg-surface-container border-outline-variant/30 text-on-surface-variant'
                      }`}
                    >
                      <span className="text-[10px]">{dayNum}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        ) : (
          /* History View */
          <div className="space-y-lg animate-in fade-in duration-300 text-xs">
            
            {/* 6-Month Chart Widget */}
            <div className="bg-white border border-outline-variant p-lg rounded-xl shadow-sm">
              <h3 className="font-bold text-on-surface mb-xl">6-Month Revenue Performance History</h3>
              
              <div className="relative h-56 w-full flex items-end gap-md pb-md border-b border-l border-outline-variant pl-4">
                
                {/* Horizontal dotted limit line */}
                <div className="absolute w-full h-[1px] border-t border-dashed border-primary/50 top-1/4 left-4 z-10">
                  <span className="absolute -right-24 -top-3 bg-primary text-on-primary text-[8px] font-bold px-2 py-0.5 rounded tracking-wide uppercase">Target: ₹40k</span>
                </div>
                
                <div className="flex-1 h-full flex items-end justify-around px-md">
                  {[
                    { month: 'OCT', val: 45, text: '₹18k' },
                    { month: 'NOV', val: 60, text: '₹24k' },
                    { month: 'DEC', val: 85, text: '₹42k', hit: true },
                    { month: 'JAN', val: 55, text: '₹22k' },
                    { month: 'FEB', val: 70, text: '₹28k' },
                    { month: 'MAR', val: 95, text: '₹48k', hit: true }
                  ].map((m, idx) => (
                    <div 
                      key={idx} 
                      className={`w-10 group relative transition-all duration-500 rounded-t-sm ${
                        m.hit 
                          ? 'bg-accent-success hover:brightness-95' 
                          : 'bg-outline-variant hover:bg-primary-container/60'
                      }`}
                      style={{ height: `${m.val}%` }}
                    >
                      <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap font-mono-data font-bold">
                        {m.text}
                      </div>
                      <p className="absolute -bottom-6 left-1/2 -translate-x-1/2 font-bold text-[9px] text-on-surface-variant">{m.month}</p>
                    </div>
                  ))}
                </div>

              </div>
            </div>

            {/* Historical list Table */}
            <div className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container border-b border-outline-variant font-semibold text-on-surface-variant">
                    <th className="p-md">AUDITED PERIOD</th>
                    <th className="p-md">TOTAL REVENUE CONCLUDED</th>
                    <th className="p-md">AVERAGE CONVERSION RATE</th>
                    <th className="p-md text-right">TOTAL INCENTIVE RECEIVED</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-md font-bold">March 2026</td>
                    <td className="p-md font-mono-data">₹48,200</td>
                    <td className="p-md">5.12%</td>
                    <td className="p-md text-right text-accent-success font-bold font-mono-data">₹8,400</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-md font-bold">February 2026</td>
                    <td className="p-md font-mono-data">₹28,500</td>
                    <td className="p-md">4.20%</td>
                    <td className="p-md text-right text-accent-success font-bold font-mono-data">₹2,100</td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="p-md font-bold">January 2026</td>
                    <td className="p-md font-mono-data">₹22,100</td>
                    <td className="p-md">3.95%</td>
                    <td className="p-md text-right text-accent-success font-bold font-mono-data">₹1,200</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        )}

      </section>
    </main>
  );
};

export default DwPerformanceStats;
