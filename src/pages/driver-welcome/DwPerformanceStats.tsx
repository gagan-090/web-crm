import React, { useState } from 'react';

export const DwPerformanceStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'thisMonth' | 'lastMonth' | 'history'>('thisMonth');

  // Simulator & gate states
  const [simulateConversions, setSimulateConversions] = useState<number>(12); // slider state
  const baseSalary = 11000;
  const gateThreshold = baseSalary * 2; // ₹22,000
  
  // Choose revenue state to demonstrate crossed/uncrossed gate
  const [monthlyRevenue, setMonthlyRevenue] = useState<number>(4200); 

  const isGateCrossed = monthlyRevenue >= gateThreshold;
  const remainingToGate = Math.max(0, gateThreshold - monthlyRevenue);
  const gateProgressPercent = Math.min(100, Math.round((monthlyRevenue / gateThreshold) * 100));

  // Incentive calculations
  // Pre-gate base quantites:
  // Job Ready ₹199: 12 qty @ ₹30 = ₹360
  // Verified ₹299: 3 qty @ ₹50 = ₹150
  // Trusted ₹499: 0 qty @ ₹80 = ₹0
  // Base total = ₹510
  const baseIncentive = 510;
  const simulatedCount = simulateConversions;
  const projectedIncentive = baseIncentive + (simulatedCount * 30);
  const additionalIncentive = simulatedCount * 30;

  // Mini Chart data
  const chartData = [
    { month: 'Jan', revenue: 38000 },
    { month: 'Feb', revenue: 45000 },
    { month: 'Mar', revenue: 52000 }, // target crossed
    { month: 'Apr', revenue: 41000 },
    { month: 'May', revenue: 48000 },
    { month: 'Jun', revenue: monthlyRevenue }
  ];

  // Leaderboard data
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const leaderboardList = [
    { name: 'Rohan Sharma', revenue: 54000, rank: 1 },
    { name: 'You (Agent)', revenue: monthlyRevenue, rank: 2 },
    { name: 'Suman Gupta', revenue: 38000, rank: 3 },
    { name: 'Vijay Yadav', revenue: 31000, rank: 4 },
    { name: 'Ankita Roy', revenue: 27000, rank: 5 },
    { name: 'Pankaj Kumar', revenue: 18000, rank: 6 }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
      
      {/* Top Header & Tab Switcher */}
      <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">My Performance Stats</p>
          <h2 className="text-2xl font-bold text-gray-800">Operational Earnings & Target Analysis</h2>
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
      <div className="bg-gray-50 border border-gray-200 p-3 rounded-xl flex items-center justify-between text-xs">
        <span className="font-semibold text-gray-600">Simulate Gate Target Achieved:</span>
        <div className="flex gap-2">
          <button 
            onClick={() => setMonthlyRevenue(4200)}
            className={`px-3 py-1 rounded border transition-colors ${monthlyRevenue === 4200 ? 'bg-[#27AE60] text-white border-[#27AE60] font-bold' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            Under Gate (₹4,200)
          </button>
          <button 
            onClick={() => setMonthlyRevenue(23500)}
            className={`px-3 py-1 rounded border transition-colors ${monthlyRevenue === 23500 ? 'bg-[#27AE60] text-white border-[#27AE60] font-bold' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            Crossed Gate (₹23,500)
          </button>
        </div>
      </div>

      {activeTab === 'thisMonth' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          
          {/* Main stats blocks grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            {/* Revenue Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Revenue Target Achievement</span>
              <div className="text-2xl font-bold text-gray-800 mt-1">
                ₹{monthlyRevenue.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ ₹50,000</span>
              </div>
              <div className="mt-3">
                <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden relative flex items-center justify-center">
                  <div 
                    className="h-full bg-[#27AE60] rounded-full transition-all duration-500 absolute left-0 top-0" 
                    style={{ width: `${(monthlyRevenue / 50000) * 100}%` }}
                  ></div>
                  <span className="z-10 text-[9px] font-bold text-gray-700">
                    {((monthlyRevenue / 50000) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="mt-2 text-xs flex items-center gap-1">
                <span className="text-[#27AE60] font-bold">↑ 12% vs last month</span>
                <span className="text-gray-400">(same point in time)</span>
              </div>
            </div>

            {/* Conversion Rate Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Monthly Conversion Rate</span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-bold text-red-600">4.34%</span>
                <span className="text-xs text-gray-500">vs ≥5% target</span>
              </div>
              <div className="mt-3 py-1 bg-red-50 text-red-600 text-xs font-bold px-2 rounded-lg text-center">
                ⚠️ 0.66% to target
              </div>
              <div className="mt-2 text-xs text-gray-400">
                Calculated on total connected calls
              </div>
            </div>

            {/* Calls Summary Block */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Calls Summary (Today/Month)</span>
              <div className="text-xl font-bold text-gray-800 mt-1">
                142 <span className="text-xs text-gray-400 font-normal">calls made</span>
              </div>
              <div className="text-xs text-gray-500 mt-2 space-y-1">
                <div className="flex justify-between">
                  <span>Avg Duration:</span>
                  <span className="font-semibold text-gray-800">2m 18s</span>
                </div>
                <div className="flex justify-between">
                  <span>Connected Rate:</span>
                  <span className="font-semibold text-gray-800">62 calls (43.7%)</span>
                </div>
              </div>
            </div>

          </div>

          {/* Incentive and Salary Gate Panel */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Gate Status Card */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Salary Incentive Gate</span>
                
                {isGateCrossed ? (
                  <div className="bg-[#EAFAF1] text-[#27AE60] text-xs font-bold p-3 rounded-lg border border-[#27AE60]/20 mt-3 select-none flex items-center gap-1">
                    ✓ Gate Crossed on 14 June — incentives active
                  </div>
                ) : (
                  <div className="mt-3">
                    <div className="flex justify-between text-xs mb-1 font-semibold text-gray-700">
                      <span>₹{monthlyRevenue.toLocaleString()} / ₹22,000 (Base Salary × 2)</span>
                      <span>{gateProgressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-gray-400" style={{ width: `${gateProgressPercent}%` }}></div>
                    </div>
                    <p className="text-xs text-red-500 font-semibold mt-2">
                      ⚠️ ₹{remainingToGate.toLocaleString()} to unlock incentives
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Incentive Itemization Table (Locked/Unlocked) */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden relative">
              
              {/* Blurred Overlay for lock */}
              {!isGateCrossed && (
                <div className="absolute inset-0 bg-white/70 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 flex items-center justify-center shadow-sm">
                    🔒
                  </div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider mt-2">Incentives Locked</h4>
                  <p className="text-[10px] text-gray-500 max-w-[240px] mt-1">Cross the 2x Base Salary Gate to unlock the itemized earnings breakdown table.</p>
                </div>
              )}

              <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 text-xs font-bold text-gray-700 uppercase tracking-wider flex justify-between items-center">
                <span>Incentive Itemization</span>
                {isGateCrossed && <span className="text-[#27AE60]">✓ Gate Unlocked</span>}
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
                    <td className="p-3 font-semibold">Job Ready ₹199</td>
                    <td className="p-3 text-center">12</td>
                    <td className="p-3 text-center">₹30</td>
                    <td className="p-3 text-right font-bold font-mono">₹360</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Verified ₹299</td>
                    <td className="p-3 text-center">3</td>
                    <td className="p-3 text-center">₹50</td>
                    <td className="p-3 text-right font-bold font-mono">₹150</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Trusted ₹499</td>
                    <td className="p-3 text-center">0</td>
                    <td className="p-3 text-center">₹80</td>
                    <td className="p-3 text-right font-bold font-mono">₹0</td>
                  </tr>
                  <tr className="bg-gray-50 font-bold text-gray-900 border-t border-gray-200">
                    <td className="p-3" colSpan={3}>Total Earned</td>
                    <td className="p-3 text-right font-mono text-[#27AE60]">₹510</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>

          {/* Interactive Payout Simulator & Mini Month-over-Month Chart */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* "What If" Simulator */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">"What If" Incentive Simulator</h3>
                <p className="text-[11px] text-gray-500 leading-normal">
                  Estimate your prospective earnings payout. Adjust the slider to see earnings growth:
                </p>
              </div>

              <div className="my-4">
                <div className="flex justify-between items-center text-xs mb-1">
                  <span className="text-gray-600 font-medium">If I convert <span className="font-bold text-[#27AE60] bg-[#EAFAF1] px-1.5 py-0.5 rounded">{simulateConversions}</span> more Job Ready plans:</span>
                  <span className="font-bold text-gray-800">+{simulatedCount} conversions</span>
                </div>
                
                <input
                  type="range"
                  min="0"
                  max="50"
                  value={simulateConversions}
                  onChange={(e) => setSimulateConversions(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#27AE60] focus:outline-none"
                />
              </div>

              <div className="p-3 bg-[#EAFAF1] border border-[#27AE60]/20 rounded-lg text-xs font-bold text-gray-800 flex justify-between items-center">
                <span>Projected Incentive Payout:</span>
                <span className="text-[#27AE60] font-mono text-sm">₹{projectedIncentive} (+₹{additionalIncentive})</span>
              </div>
            </div>

            {/* Mini Chart */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[200px]">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Month-over-Month Revenue</span>
                <span className="text-[10px] text-gray-400 border-b border-dashed border-gray-300 pb-0.5">Target: ₹50k</span>
              </div>

              {/* Simple SVG/CSS bar layout */}
              <div className="flex justify-between items-end h-24 px-2 relative border-b border-gray-100">
                
                {/* Dashed Target Line */}
                <div className="absolute left-0 right-0 top-1/6 border-t border-dashed border-red-300 w-full z-0 pointer-events-none">
                  <span className="absolute right-1 -top-2.5 text-[8px] bg-white text-red-500 font-bold px-1">Target</span>
                </div>

                {chartData.map((d, i) => {
                  const maxVal = 60000;
                  const pct = (d.revenue / maxVal) * 100;
                  const isCurrent = d.month === 'Jun';
                  return (
                    <div key={i} className="flex flex-col items-center w-8 group relative z-10">
                      {/* Tooltip */}
                      <span className="absolute -top-6 text-[9px] bg-gray-800 text-white rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                        ₹{d.revenue.toLocaleString()}
                      </span>
                      <div 
                        className={`w-full rounded-t transition-all duration-700 ${isCurrent ? 'bg-[#27AE60]' : 'bg-[#27AE60]/40'}`} 
                        style={{ height: `${pct}%`, minHeight: '4px' }}
                      ></div>
                      <span className="text-[9px] text-gray-400 mt-1 font-bold">{d.month}</span>
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

          {/* Calendar Streak & Leaderboard Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Streak Calendar */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <div className="flex justify-between items-center mb-3">
                <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Current Month Attendance Streak</span>
                <span className="text-xs text-[#27AE60] font-bold">🔥 4 days streak</span>
              </div>

              {/* 30 days grid */}
              <div className="grid grid-cols-7 gap-1.5">
                {Array.from({ length: 30 }, (_, i) => {
                  const day = i + 1;
                  // mock statuses for calendar grid
                  let state = 'future';
                  if (day <= 18) {
                    if (day % 4 === 0) state = 'none'; // red outline
                    else if (day % 3 === 0) state = 'called'; // gray outline
                    else state = 'converted'; // green filled
                  }

                  let cellClass = '';
                  if (state === 'converted') cellClass = 'bg-[#EAFAF1] border-[#27AE60] text-[#27AE60] font-bold';
                  else if (state === 'called') cellClass = 'border-dashed border-gray-300 text-gray-400';
                  else if (state === 'none') cellClass = 'border-red-400 text-red-500 border';
                  else if (state === 'future') cellClass = 'bg-gray-50 text-gray-300 border-gray-100';

                  return (
                    <div 
                      key={day} 
                      className={`h-7 border rounded flex items-center justify-center text-[10px] select-none ${cellClass}`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
              <p className="text-[10px] text-gray-400 mt-3 text-center">
                Green = Conversion · Gray = Outbound Made · Red = Zero Calls Made · Light Gray = Future
              </p>
            </div>

            {/* Leaderboard Chip Expandable */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
              <div>
                <div 
                  onClick={() => setShowLeaderboard(!showLeaderboard)}
                  className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-1.5 rounded-lg transition-colors border border-gray-100"
                >
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                    🏆 <span>#2 in Driver Welcome team this month</span>
                  </div>
                  <span className="text-xs text-gray-400 font-semibold">{showLeaderboard ? 'Collapse ▲' : 'Expand ▼'}</span>
                </div>

                {showLeaderboard && (
                  <div className="mt-3 divide-y divide-gray-100 border border-gray-100 rounded-lg overflow-hidden animate-in fade-in duration-300">
                    {leaderboardList.map((agent, i) => (
                      <div key={i} className={`flex justify-between items-center p-2.5 text-xs ${agent.rank === 2 ? 'bg-[#EAFAF1]/30 font-bold' : ''}`}>
                        <div className="flex items-center gap-2">
                          <span className="text-gray-400 font-mono">#{agent.rank}</span>
                          <span className="text-gray-800">{agent.name}</span>
                        </div>
                        <span className="font-mono text-gray-600">₹{agent.revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <p className="text-[10px] text-gray-400 mt-3 italic">
                Revenue is calculated only for captured payments.
              </p>
            </div>

          </div>

        </div>
      )}

      {activeTab === 'history' && (
        <div className="space-y-6 animate-in fade-in duration-300">
          <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-4">6-Month Historic Earnings Data</h3>
            
            {/* Simple Table */}
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50 text-gray-500 font-bold uppercase text-[9px]">
                  <th className="p-3">Month</th>
                  <th className="p-3 text-right">Revenue</th>
                  <th className="p-3 text-right">Target</th>
                  <th className="p-3 text-center">% Achieved</th>
                  <th className="p-3 text-center">Conversions</th>
                  <th className="p-3 text-right">Avg Conversion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {[
                  { month: 'May 2026', revenue: 48000, target: 50000, pct: '96.0%', convs: 36, rate: '4.8%' },
                  { month: 'Apr 2026', revenue: 41000, target: 50000, pct: '82.0%', convs: 29, rate: '4.1%' },
                  { month: 'Mar 2026', revenue: 52000, target: 50000, pct: '104.0%', convs: 41, rate: '5.2%' },
                  { month: 'Feb 2026', revenue: 45000, target: 50000, pct: '90.0%', convs: 34, rate: '4.6%' },
                  { month: 'Jan 2026', revenue: 38000, target: 50000, pct: '76.0%', convs: 25, rate: '3.9%' }
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-gray-50/50">
                    <td className="p-3 font-semibold text-gray-800">{row.month}</td>
                    <td className="p-3 text-right font-mono font-semibold">₹{row.revenue.toLocaleString()}</td>
                    <td className="p-3 text-right font-mono text-gray-400">₹{row.target.toLocaleString()}</td>
                    <td className="p-3 text-center font-bold text-gray-700">{row.pct}</td>
                    <td className="p-3 text-center font-semibold text-gray-700">{row.convs}</td>
                    <td className="p-3 text-right font-mono text-gray-500">{row.rate}</td>
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

export default DwPerformanceStats;
