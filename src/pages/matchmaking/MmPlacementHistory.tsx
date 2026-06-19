import React, { useState } from 'react';

export const MmPlacementHistory: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'thisMonth' | 'lastMonth' | 'history'>('thisMonth');
  const [extraPlacements, setExtraPlacements] = useState(0); // For What-If simulator
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Base metrics for This Month
  const basePremium = 18;
  const baseSuper = 6;
  const totalBasePlacements = basePremium + baseSuper;
  const premiumRate = 30;
  const superRate = 50;

  // Recalculated metrics with What-If slider
  const simulatedSuper = baseSuper + extraPlacements;
  const totalSimulatedPlacements = basePremium + simulatedSuper;
  const simulatedSuperIncentive = simulatedSuper * superRate;
  const totalIncentive = (basePremium * premiumRate) + simulatedSuperIncentive;

  return (
    <main className="p-6 max-w-7xl mx-auto w-full overflow-y-auto max-h-[calc(100vh-60px)] space-y-6 text-xs relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toastMessage}
        </div>
      )}

      {/* Header controls strip */}
      <div className="p-4 bg-gray-50 border border-gray-250 rounded-xl flex justify-between items-center shrink-0">
        <div>
          <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">My Placements Dashboard</h1>
          <p className="text-[10px] text-gray-400 mt-0.5">Track your monthly placements, incentive achievements, and SLA compliance metrics</p>
        </div>

        {/* Tab Selection */}
        <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 font-bold text-gray-550 select-none">
          {[
            { id: 'thisMonth', label: 'This Month' },
            { id: 'lastMonth', label: 'Last Month' },
            { id: 'history', label: 'Placements History' }
          ].map(t => (
            <button
              key={t.id}
              onClick={() => {
                setActiveTab(t.id as any);
                triggerToast(`Switched to ${t.label}`);
              }}
              className={`px-3.5 py-1 rounded transition-colors ${
                activeTab === t.id ? 'bg-[#8E44AD] text-white font-extrabold' : 'hover:text-gray-800'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'thisMonth' && (
        <>
          {/* Top Row: Cards */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Placements Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Fulfillments</span>
                <h2 className="text-xl font-extrabold text-[#8E44AD] mt-1.5">{totalBasePlacements} / 55 Target</h2>
              </div>
              <div className="mt-3">
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="bg-[#8E44AD] h-full" style={{ width: `${(totalBasePlacements/55)*100}%` }}></div>
                </div>
                <div className="flex gap-2 text-[9px] font-bold text-gray-400 mt-1.5 select-none">
                  <span className="bg-purple-50 text-purple-700 px-1 py-0.2 rounded border border-purple-100">{basePremium} PREMIUM</span>
                  <span className="bg-orange-50 text-orange-700 px-1 py-0.2 rounded border border-orange-100">{baseSuper} SUPER PREMIUM</span>
                </div>
              </div>
            </div>

            {/* SLA Compliance Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">SLA Compliance Rate</span>
                <h2 className="text-xl font-extrabold text-green-600 mt-1.5">91.7%</h2>
              </div>
              <div className="space-y-1 mt-3 font-semibold text-gray-500">
                <div className="flex justify-between">
                  <span>Premium Fill SLA (10d):</span>
                  <span className="font-bold text-gray-800">16 / 18 within SLA (88.9%)</span>
                </div>
                <div className="flex justify-between">
                  <span>Super Premium Fill SLA (7d):</span>
                  <span className="font-bold text-purple-750">6 / 6 within SLA (100%)</span>
                </div>
              </div>
            </div>

            {/* Incentive Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Incentives Status</span>
                <h2 className="text-xl font-extrabold text-gray-850 mt-1.5">₹{totalIncentive} Accrued</h2>
              </div>
              <div className="mt-3 flex justify-between items-center text-[9.5px] font-bold">
                <span className="text-green-600 bg-green-50 px-1.5 py-0.5 rounded border border-green-250 uppercase flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span>
                  Gate Crossed ({totalBasePlacements} placements)
                </span>
                <span className="text-gray-400 font-semibold">Min Gate: 4 placements</span>
              </div>
            </div>

          </section>

          {/* Details Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Left: Rejection Reasons & Efficiency stats */}
            <div className="space-y-6">
              
              {/* Stacked Rejection reasons chart */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-3 select-none">
                <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Rejection Reasons Distribution</h4>
                
                {/* Horizontal stacked bar */}
                <div className="w-full h-5 rounded overflow-hidden flex font-bold text-white text-[9px] text-center font-mono">
                  <div className="bg-purple-600 flex items-center justify-center" style={{ width: '38%' }} title="Route doesn't suit: 38%">38%</div>
                  <div className="bg-amber-500 flex items-center justify-center" style={{ width: '24%' }} title="Pay unacceptable: 24%">24%</div>
                  <div className="bg-blue-500 flex items-center justify-center" style={{ width: '19%' }} title="Truck Mismatch: 19%">19%</div>
                  <div className="bg-red-500 flex items-center justify-center" style={{ width: '12%' }} title="Already Placed: 12%">12%</div>
                  <div className="bg-gray-400 flex items-center justify-center" style={{ width: '7%' }} title="Other: 7%">7%</div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-[9.5px] font-bold text-gray-500 pt-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-purple-600"></span> Route doesn't suit (38%)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500"></span> Pay unacceptable (24%)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-blue-500"></span> Truck Mismatch (19%)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-red-500"></span> Already Placed (12%)
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded bg-gray-400"></span> Other reasons (7%)
                  </div>
                </div>
              </div>

              {/* Sourcing efficiency card */}
              <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex items-center justify-between">
                <div>
                  <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-1">Sourcing Efficiency Metric</h4>
                  <p className="font-semibold text-gray-600 leading-relaxed">
                    You call an average of <span className="font-extrabold text-[#8E44AD] text-sm">4.2 drivers</span> to fill one active job posting.
                  </p>
                </div>
                <span className="material-symbols-outlined text-[#8E44AD] text-3xl font-bold" style={{ fontVariationSettings: "'FILL' 1" }}>insights</span>
              </div>

            </div>

            {/* Right: What If Simulator & MoM Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
              <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider block">Incentive Handover Calculator</h4>
              
              <div className="bg-gray-55 border border-gray-150 p-3.5 rounded-xl space-y-3">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">What-If Projected Placements Simulator</span>
                
                <div className="space-y-2">
                  <div className="flex justify-between items-center font-bold text-gray-700">
                    <span>Add Super Premium placements:</span>
                    <span className="text-[#8E44AD] font-extrabold text-sm">+{extraPlacements} jobs</span>
                  </div>
                  <input 
                    type="range"
                    min={0}
                    max={30}
                    value={extraPlacements}
                    onChange={(e) => setExtraPlacements(Number(e.target.value))}
                    className="w-full accent-[#8E44AD] cursor-pointer"
                  />
                  <div className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                    Slide to simulate adding placement events. Gate requires Count &gt; 4 placements.
                  </div>
                </div>
              </div>

              {/* Itemized table details */}
              <table className="w-full text-left text-[11px] font-semibold text-gray-600">
                <thead>
                  <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase text-[9px]">
                    <th className="pb-1.5">Event details</th>
                    <th className="pb-1.5 text-center">Fulfillments</th>
                    <th className="pb-1.5 text-center">Rate</th>
                    <th className="pb-1.5 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-700">
                  <tr>
                    <td className="py-2 font-bold text-gray-800">Premium Placements</td>
                    <td className="py-2 text-center font-mono">{basePremium}</td>
                    <td className="py-2 text-center font-mono">₹{premiumRate}</td>
                    <td className="py-2 text-right font-mono font-bold">₹{basePremium * premiumRate}</td>
                  </tr>
                  <tr>
                    <td className="py-2 font-bold text-gray-800">Super Premium Placements (Simulated)</td>
                    <td className="py-2 text-center font-mono">{simulatedSuper}</td>
                    <td className="py-2 text-center font-mono">₹{superRate}</td>
                    <td className="py-2 text-right font-mono font-bold text-[#8E44AD]">₹{simulatedSuperIncentive}</td>
                  </tr>
                  <tr className="border-t border-gray-250 font-extrabold">
                    <td className="py-2 text-gray-800 text-xs">Total Simulated Payout</td>
                    <td className="py-2 text-center font-mono text-xs">{totalSimulatedPlacements}</td>
                    <td className="py-2"></td>
                    <td className="py-2 text-right font-mono text-xs text-green-600">₹{totalIncentive}</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </>
      )}

      {activeTab === 'lastMonth' && (
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center py-12">
          <span className="material-symbols-outlined text-[#8E44AD] text-4xl mb-2">history</span>
          <p className="font-bold text-gray-800">Last Month placements Handover</p>
          <p className="text-gray-400 mt-1">Placements: 48 jobs · SLA Compliance: 93.4% · Incentives Earned: ₹1,840</p>
        </div>
      )}

      {activeTab === 'history' && (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden text-xs">
          <div className="p-3 bg-gray-50 border-b border-gray-200 font-bold text-gray-700 uppercase tracking-wider">
            Historic PlacementsHandover ledger
          </div>

          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50 text-gray-400 font-bold uppercase text-[9px] border-b border-gray-150">
                <th className="p-3 pl-4">Month</th>
                <th className="p-3 text-center">Placements</th>
                <th className="p-3 text-center">Monthly Target</th>
                <th className="p-3 text-center">SLA Compliance %</th>
                <th className="p-3 text-right pr-4">Incentive Paid</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {[
                { m: 'May 2026', qty: 58, tgt: 55, sla: '92.4%', pay: 2020 },
                { m: 'Apr 2026', qty: 52, tgt: 55, sla: '89.1%', pay: 1720 },
                { m: 'Mar 2026', qty: 61, tgt: 55, sla: '94.5%', pay: 2150 }
              ].map((row, i) => (
                <tr key={i} className="hover:bg-gray-50/50 transition-colors">
                  <td className="p-3 pl-4 font-bold text-gray-850">{row.m}</td>
                  <td className="p-3 text-center font-mono">{row.qty} jobs</td>
                  <td className="p-3 text-center font-mono">{row.tgt} jobs</td>
                  <td className="p-3 text-center font-mono">{row.sla}</td>
                  <td className="p-3 text-right pr-4 font-mono font-bold text-green-600">₹{row.pay}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

    </main>
  );
};

export default MmPlacementHistory;
