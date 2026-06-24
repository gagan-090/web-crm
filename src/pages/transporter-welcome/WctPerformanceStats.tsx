import React, { useState } from 'react';

export const WctPerformanceStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'thisMonth' | 'lastMonth' | 'history' | 'campaigns'>('thisMonth');

  // Simulator & gate states
  const [simulatePremium, setSimulatePremium] = useState<number>(4); 
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(11200); 

  const baseSalary = 14000;

  // Base Salary Gate (Salary + 5k)
  const salaryGateThreshold = baseSalary + 5000; // ₹19,000
  const isSalaryGateCrossed = monthlyRevenue >= salaryGateThreshold;
  const remainingToSalaryGate = Math.max(0, salaryGateThreshold - monthlyRevenue);
  const salaryGatePercent = Math.min(100, Math.round((monthlyRevenue / salaryGateThreshold) * 100));

  // Incentive Gate (2x salary)
  const incentiveGateThreshold = baseSalary * 2; // ₹28,000
  const isIncentiveGateCrossed = monthlyRevenue >= incentiveGateThreshold;
  const remainingToIncentiveGate = Math.max(0, incentiveGateThreshold - monthlyRevenue);
  const incentiveGatePercent = Math.min(100, Math.round((monthlyRevenue / incentiveGateThreshold) * 100));

  // WCT Incentive calculations
  // Free Plan (pipeline): 4 qty @ ₹20 = ₹80
  // Premium: 3 qty @ ₹100 = ₹300
  // Super Premium: 1 qty @ ₹200 = ₹200
  // Total = ₹580
  const baseIncentive = 580;
  const simulatedCount = simulatePremium;
  const projectedIncentive = baseIncentive + (simulatedCount * 100);
  const additionalIncentive = simulatedCount * 100;

  // Mini Chart data (WCT Target ₹67,000)
  const chartData = [
    { month: 'Jan', revenue: 42000 },
    { month: 'Feb', revenue: 58000 },
    { month: 'Mar', revenue: 71000 }, // target crossed
    { month: 'Apr', revenue: 54000 },
    { month: 'May', revenue: 62000 },
    { month: 'Jun', revenue: monthlyRevenue }
  ];

  // SLA Miss details log
  const [showSlaMissDetails, setShowSlaMissDetails] = useState(false);
  const slaMisses = [
    { company: 'Balaji Freight Carrier', delay: 'Missed by 47 min', date: '14 Jun' },
    { company: 'Riddhi Logistics', delay: 'Missed by 1h 12m', date: '08 Jun' },
    { company: 'Hindustan Cargo Co', delay: 'Missed by 23 min', date: '03 Jun' }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
      
      {/* Top Header & Tab Switcher */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest font-sans">WCT Performance Stats</p>
          <h2 className="text-2xl font-bold text-gray-800">Transporter Connect KPI Dashboard</h2>
        </div>
        
        {/* Tab switch buttons */}
        <div className="bg-gray-100 p-1 rounded-lg flex items-center gap-1 select-none">
          <button
            onClick={() => setActiveTab('thisMonth')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
              activeTab === 'thisMonth' ? 'bg-white text-gray-800 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            This Month
          </button>
          <button
            onClick={() => setActiveTab('lastMonth')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
              activeTab === 'lastMonth' ? 'bg-white text-gray-800 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            Last Month
          </button>
          <button
            onClick={() => setActiveTab('campaigns')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
              activeTab === 'campaigns' ? 'bg-white text-red-600 shadow-sm font-bold' : 'text-gray-500 hover:text-red-500'
            }`}
          >
            🔥 Campaigns
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
              activeTab === 'history' ? 'bg-white text-gray-800 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800'
            }`}
          >
            History
          </button>
        </div>
      </section>

      {/* Simulator Quick Toggles */}
      <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center justify-between text-xs select-none">
        <span className="font-semibold text-gray-600">Simulate Salary/Incentive Gate Target:</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setMonthlyRevenue(12000)}
            className={`px-3 py-1 rounded border transition-colors ${monthlyRevenue === 12000 ? 'bg-[#FB641B] text-white border-[#FB641B] font-bold' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            Under Gates (₹12,000)
          </button>
          <button 
            onClick={() => setMonthlyRevenue(22500)}
            className={`px-3 py-1 rounded border transition-colors ${monthlyRevenue === 22500 ? 'bg-[#FB641B] text-white border-[#FB641B] font-bold' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            Salary Gate Crossed (₹22,500)
          </button>
          <button 
            onClick={() => setMonthlyRevenue(31000)}
            className={`px-3 py-1 rounded border transition-colors ${monthlyRevenue === 31000 ? 'bg-[#FB641B] text-white border-[#FB641B] font-bold' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            Both Gates Crossed (₹31,000)
          </button>
        </div>
      </div>

      {activeTab === 'thisMonth' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Main stats blocks grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Revenue Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Monthly Revenue Target</span>
              <div className="text-2xl font-bold text-gray-800 mt-1">
                ₹{monthlyRevenue.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ ₹67,000</span>
              </div>
              <div className="mt-3">
                <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden relative flex items-center justify-center">
                  <div 
                    className="h-full bg-[#FB641B] rounded-full transition-all duration-500 absolute left-0 top-0" 
                    style={{ width: `${(monthlyRevenue / 67000) * 100}%` }}
                  ></div>
                  <span className="z-10 text-[9px] font-bold text-gray-700">
                    {((monthlyRevenue / 67000) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-400">
                26 days remaining this month
              </div>
            </div>

            {/* Conversion Rate Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Monthly Conversion Rate</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-[#27AE60]">13.8%</span>
                <span className="text-xs text-gray-500">vs ≥12% target</span>
              </div>
              <div className="mt-3 py-1 bg-[#EAFAF1] text-[#27AE60] text-xs font-bold px-2 rounded-lg text-center">
                ✓ Met Target (1.8% above target)
              </div>
            </div>

            {/* Calls Summary Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Calls Summary</span>
              <div className="text-xl font-bold text-gray-800 mt-1">
                38 <span className="text-xs text-gray-400 font-normal">calls made</span>
              </div>
              <div className="text-xs text-gray-500 mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Avg Duration:</span>
                  <span className="font-semibold text-gray-800">8m 42s (consultative)</span>
                </div>
                <div className="flex justify-between">
                  <span>Connected Rate:</span>
                  <span className="font-semibold text-gray-800">19 connected (50.0%)</span>
                </div>
              </div>
            </div>

          </div>

          {/* SLA Performance Widgets */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* First-Call SLA Compliance Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm md:col-span-2">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">First-Call SLA Compliance</span>
                  <div className="text-3xl font-extrabold text-orange-500 mt-1">91.3%</div>
                  <p className="text-[11px] text-gray-500 mt-1">35 of 38 first calls made within 4 business hours</p>
                </div>
                
                <button 
                  onClick={() => setShowSlaMissDetails(!showSlaMissDetails)}
                  className="px-2.5 py-1 text-xs border border-gray-200 hover:bg-gray-50 text-gray-600 rounded font-semibold select-none"
                >
                  {showSlaMissDetails ? 'Hide details' : 'View misses'}
                </button>
              </div>

              {showSlaMissDetails && (
                <div className="mt-3 divide-y divide-gray-100 border border-gray-150 rounded-lg overflow-hidden animate-in fade-in duration-300 bg-gray-50/50">
                  {slaMisses.map((m, idx) => (
                    <div key={idx} className="p-2 flex justify-between text-xs">
                      <span className="text-gray-700 font-medium">{m.company}</span>
                      <span className="font-semibold text-red-500">{m.delay} ({m.date})</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Missed SLA Callbacks */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Missed SLA Callbacks</span>
                <div className="text-2xl font-bold text-red-600 mt-2">1</div>
                <p className="text-[11px] text-red-500 font-semibold mt-1">
                  ⚠️ 1 SLA-critical callback missed this month
                </p>
              </div>
            </div>

          </div>

          {/* Incentive and Salary Gate Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Gate Status Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between space-y-4">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block border-b border-gray-100 pb-1.5 mb-2">Gate Status Check</span>
                
                {/* Base Salary Gate */}
                <div className="space-y-1 mb-3">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span className="flex items-center gap-1.5">
                      1. Base Salary Gate
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase ${isSalaryGateCrossed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {isSalaryGateCrossed ? 'Secured' : 'Locked'}
                      </span>
                    </span>
                    <span>{salaryGatePercent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${isSalaryGateCrossed ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${salaryGatePercent}%` }}></div>
                  </div>
                  <p className="text-[10px] text-gray-500 text-left">
                    {isSalaryGateCrossed ? '✓ Base salary secured.' : `⚠️ ₹${remainingToSalaryGate.toLocaleString()} more required.`}
                  </p>
                </div>

                {/* Incentive Gate */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span className="flex items-center gap-1.5">
                      2. Incentives Gate
                      <span className={`inline-flex px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide ${isIncentiveGateCrossed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                        {isIncentiveGateCrossed ? 'Active' : 'Locked'}
                      </span>
                    </span>
                    <span>{incentiveGatePercent.toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all ${isIncentiveGateCrossed ? 'bg-emerald-500' : 'bg-amber-500'}`} style={{ width: `${incentiveGatePercent}%` }}></div>
                  </div>
                  <p className="text-[10px] text-gray-500 text-left">
                    {isIncentiveGateCrossed ? '✓ Conversion incentives active.' : `⚠️ ₹${remainingToIncentiveGate.toLocaleString()} more to activate incentives.`}
                  </p>
                </div>
              </div>
            </div>

            {/* Incentive Itemization Table (Locked/Unlocked) */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative">
              
              {/* Locked Overlay */}
              {!isIncentiveGateCrossed && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shadow-sm">
                    🔒
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mt-2">Incentives Locked</h4>
                  <p className="text-[10px] text-gray-500 max-w-[240px] mt-1">Cross the 2x Base Salary Gate to unlock the itemized transporter payouts breakdown table.</p>
                </div>
              )}

              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider flex justify-between items-center">
                <span>Incentive Itemization</span>
                {isIncentiveGateCrossed && <span className="text-[#27AE60]">✓ Gate Unlocked</span>}
              </div>
              
              <table className="w-full text-xs text-left">
                <thead className="bg-gray-100 text-gray-500 uppercase text-[9px]">
                  <tr>
                    <th className="p-3">Plan</th>
                    <th className="p-3 text-center">Qty</th>
                    <th className="p-3 text-center">Rate</th>
                    <th className="p-3 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="p-3 font-semibold">Free Plan (pipeline credit)</td>
                    <td className="p-3 text-center">4</td>
                    <td className="p-3 text-center">₹20</td>
                    <td className="p-3 text-right font-bold font-mono">₹80</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Premium ₹1,999</td>
                    <td className="p-3 text-center">3</td>
                    <td className="p-3 text-center">₹100</td>
                    <td className="p-3 text-right font-bold font-mono">₹300</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Super Premium ₹2,999</td>
                    <td className="p-3 text-center">1</td>
                    <td className="p-3 text-center">₹200</td>
                    <td className="p-3 text-right font-bold font-mono">₹200</td>
                  </tr>
                  <tr className="bg-gray-50 font-bold text-gray-900 border-t border-gray-200">
                    <td className="p-3" colSpan={3}>Total Earned</td>
                    <td className="p-3 text-right font-mono text-orange-500">₹580</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          {/* Interactive Payout Simulator & Mini Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* "What If" Simulator */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">"What If" Incentive Simulator</h3>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Estimate transporter upsell payouts. Adjust the slider to see earnings growth:
                </p>
              </div>

              <div className="my-4">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-600 font-medium">If I convert <span className="font-bold text-[#FB641B] bg-orange-50 px-1.5 py-0.5 rounded">{simulatePremium}</span> more Premium plans:</span>
                  <span className="font-bold text-gray-800">+{simulatedCount} conversions</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={simulatePremium}
                  onChange={(e) => setSimulatePremium(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#FB641B] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-xs font-bold text-gray-800 flex justify-between items-center">
                <span>Projected Incentive Payout:</span>
                <span className="text-orange-600 font-mono text-sm">₹{projectedIncentive} (+₹{additionalIncentive})</span>
              </div>
            </div>

            {/* Mini Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[200px]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Month-over-Month Revenue</span>
                <span className="text-[10px] text-gray-400 border-b border-dashed border-gray-300 pb-0.5">Target: ₹67k</span>
              </div>

              {/* Simple Chart */}
              <div className="flex justify-between items-end h-24 px-2 relative border-b border-gray-100">
                <div className="absolute left-0 right-0 top-1/6 border-t border-dashed border-red-350 w-full z-0 pointer-events-none">
                  <span className="absolute right-1 -top-2.5 text-[8px] bg-white text-red-500 font-bold px-1">Target</span>
                </div>

                {chartData.map((d, i) => {
                  const maxVal = 80000;
                  const pct = (d.revenue / maxVal) * 100;
                  const isCurrent = d.month === 'Jun';
                  return (
                    <div key={i} className="flex flex-col items-center w-8 group relative z-10">
                      <span className="absolute -top-6 text-[9px] bg-gray-800 text-white rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        ₹{d.revenue.toLocaleString()}
                      </span>
                      <div 
                        className={`w-full rounded-t transition-all duration-700 ${isCurrent ? 'bg-[#FB641B]' : 'bg-[#FB641B]/40'}`} 
                        style={{ height: `${pct}%`, minHeight: '4px' }}
                      ></div>
                      <span className="text-[9px] text-gray-400 mt-1 font-bold">{d.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      )}

      {activeTab === 'campaigns' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          {/* Top Cards Row */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Campaign Conversions</span>
              <div className="text-2xl font-bold text-gray-800 mt-1">14 <span className="text-xs text-gray-400 font-normal">transporters converted</span></div>
              <div className="text-xs text-[#27AE60] font-bold mt-2">↑ 5.8% above organic baseline</div>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Campaign Conversion Rate</span>
              <div className="text-2xl font-bold text-red-655 text-red-600 mt-1">11.2%</div>
              <div className="text-xs text-gray-500 mt-2">Connected: 125 calls</div>
            </div>

            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block">Campaign Lead Star Rating</span>
              <div className="text-2xl font-bold text-yellow-500 mt-1">4.5 ★</div>
              <div className="text-xs text-gray-500 mt-2">From 14 conversions</div>
            </div>
          </div>

          {/* Source-wise Breakdown Table & Temperature analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Table */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-red-500">campaign</span>
                Source-Wise Campaign Breakdown
              </h3>
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[9px]">
                    <th className="py-2">Source</th>
                    <th className="py-2 text-center">Connected Calls</th>
                    <th className="py-2 text-center">Conversions</th>
                    <th className="py-2 text-right">Conv. Rate</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="py-2.5 font-semibold">Meta Ads</td>
                    <td className="py-2.5 text-center">72</td>
                    <td className="py-2.5 text-center">9</td>
                    <td className="py-2.5 text-right font-bold text-[#27AE60]">12.5%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Google Ads</td>
                    <td className="py-2.5 text-center">31</td>
                    <td className="py-2.5 text-center">3</td>
                    <td className="py-2.5 text-right font-bold text-[#27AE60]">9.6%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Instagram</td>
                    <td className="py-2.5 text-center">15</td>
                    <td className="py-2.5 text-center">2</td>
                    <td className="py-2.5 text-right font-bold text-[#27AE60]">13.3%</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-semibold">Facebook Comments</td>
                    <td className="py-2.5 text-center">7</td>
                    <td className="py-2.5 text-center">0</td>
                    <td className="py-2.5 text-right font-bold text-gray-400">0.0%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Temperature analysis */}
            <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2">
                🔥 Temperature Conversion Analysis
              </h3>
              <div className="space-y-3.5">
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-red-600">HOT Leads (85% target)</span>
                    <span>10/12 converted (83.3%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-red-500 rounded-full" style={{ width: '83.3%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-amber-600">WARM Leads (50% target)</span>
                    <span>3/8 converted (37.5%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-500 rounded-full" style={{ width: '37.5%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-xs mb-1 font-semibold">
                    <span className="text-blue-600">COLD Leads (15% target)</span>
                    <span>1/5 converted (20.0%)</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: '20%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">6-Month Historic Earnings Data</h3>
            
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-bold uppercase text-[9px]">
                  <th className="p-3">Month</th>
                  <th className="p-3 text-right">Revenue</th>
                  <th className="p-3 text-right">Target</th>
                  <th className="p-3 text-center">% Achieved</th>
                  <th className="p-3 text-center">Conversions</th>
                  <th className="p-3 text-right">Avg Conversion Rate</th>
                  <th className="p-3 text-right">SLA Compliance %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {[
                  { month: 'May 2026', revenue: 62000, target: 67000, pct: '92.5%', convs: 18, rate: '12.8%', sla: '94.2%' },
                  { month: 'Apr 2026', revenue: 54000, target: 67000, pct: '80.5%', convs: 15, rate: '11.5%', sla: '89.5%' },
                  { month: 'Mar 2026', revenue: 71000, target: 67000, pct: '105.9%', convs: 21, rate: '14.1%', sla: '95.8%' },
                  { month: 'Feb 2026', revenue: 58000, target: 67000, pct: '86.5%', convs: 16, rate: '12.1%', sla: '92.0%' },
                  { month: 'Jan 2026', revenue: 42000, target: 67000, pct: '62.6%', convs: 11, rate: '10.2%', sla: '87.1%' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-800">{row.month}</td>
                    <td className="p-3 text-right font-mono font-semibold">₹{row.revenue.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-gray-400">₹{row.target.toLocaleString()}</td>
                    <td className="p-3 text-center font-bold text-gray-700">{row.pct}</td>
                    <td className="p-3 text-center font-semibold text-gray-700">{row.convs}</td>
                    <td className="p-3 text-right font-mono text-gray-500">{row.rate}</td>
                    <td className="p-3 text-right font-mono font-bold text-[#FB641B]">{row.sla}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default WctPerformanceStats;
