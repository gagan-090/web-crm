import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export const DwHomeDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Dashboard state for premium interactivity
  const [todayEarnings, setTodayEarnings] = useState(420);
  const [todayCalls] = useState(24);
  const [todayConversions] = useState(3);
  
  // Salary gate simulation
  const [monthlyRevenue, setMonthlyRevenue] = useState(4200);
  const baseSalary = 11000;
  const gateThreshold = baseSalary * 2; // ₹22,000

  // Computed values
  const todayTarget = 1667; // target ₹50,000 / 30 days
  const todayEarningsPercent = Math.min(100, Math.round((todayEarnings / todayTarget) * 100));
  
  // Gate check
  const gateProgressPercent = Math.min(100, Math.round((monthlyRevenue / gateThreshold) * 100));
  const isGateCrossed = monthlyRevenue >= gateThreshold;
  const remainingToGate = Math.max(0, gateThreshold - monthlyRevenue);

  // Today progress bar color
  const getTodayBarColor = (pct: number) => {
    if (pct < 50) return 'bg-[#828282]'; // gray
    if (pct < 80) return 'bg-[#F2C94C]'; // amber
    return 'bg-[#27AE60]'; // green
  };

  // Mock data for callbacks
  const [overdueCallbacks] = useState([
    { id: '1', name: 'Suresh Yadav', time: '11:30 AM', tmid: 'DR-48291' },
    { id: '2', name: 'Rajesh Kumar', time: '10:15 AM', tmid: 'DR-48294' }
  ]);

  const handleCallbackCall = (name: string, tmid: string) => {
    // Navigate directly to active call with search query or lead parameters
    navigate('/dw/dw-active-call-focus', { state: { name, tmid } });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
      
      {/* Header and Simulator Banner */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">Driver Welcome Calling Process</p>
          <h2 className="text-2xl font-bold text-gray-800">Good morning, Agent — June 19, 2026</h2>
        </div>
        
        {/* Interactive Simulation Controls */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-2 rounded-lg text-xs">
          <span className="font-bold text-gray-600">Simulate:</span>
          <button 
            onClick={() => setTodayEarnings(prev => prev === 420 ? 1350 : 420)}
            className="px-2 py-1 bg-white border rounded hover:bg-gray-100 transition-colors"
          >
            Today's Earnings ({todayEarnings === 420 ? 'Low' : 'High'})
          </button>
          <button 
            onClick={() => setMonthlyRevenue(prev => prev === 4200 ? 23500 : 4200)}
            className="px-2 py-1 bg-white border rounded hover:bg-gray-100 transition-colors"
          >
            Gate Status ({isGateCrossed ? 'Crossed' : 'Not Crossed'})
          </button>
        </div>
      </section>

      {/* Main KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1 — Today's Earnings */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">Today's Earnings</span>
            <div className="text-2xl font-bold text-[#27AE60] mt-1">₹{todayEarnings}</div>
            <div className="text-xs text-gray-400 mt-1">of ₹{todayTarget} today's share</div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getTodayBarColor(todayEarningsPercent)}`} 
                style={{ width: `${todayEarningsPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-gray-500 mt-2 pt-1 border-t border-gray-100">
              <span>{todayCalls} calls</span>
              <span>·</span>
              <span>{todayConversions} converted</span>
              <span>·</span>
              <span>{((todayConversions / todayCalls) * 100).toFixed(1)}% rate</span>
            </div>
          </div>
        </div>

        {/* Card 2 — 2× Salary Gate */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div>
            <div className="flex justify-between items-start">
              <span className={`text-xs uppercase font-semibold ${isGateCrossed ? 'text-[#27AE60]' : 'text-gray-500'}`}>
                {isGateCrossed ? '✓ Gate Crossed' : '2× Salary Gate'}
              </span>
              {isGateCrossed && (
                <span className="bg-[#EAFAF1] text-[#27AE60] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Active</span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              ₹{monthlyRevenue.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ ₹{gateThreshold.toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {isGateCrossed 
                ? 'Incentives active — every conversion now pays out' 
                : `₹${remainingToGate.toLocaleString()} to unlock incentives`
              }
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isGateCrossed ? 'bg-[#27AE60]' : 'bg-[#828282]'}`} 
                style={{ width: `${gateProgressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 3 — Monthly Revenue */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">Monthly Revenue</span>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              ₹{monthlyRevenue.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ ₹50,000</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">26 days remaining this month</div>
          </div>
          <div className="mt-3">
            <div className="w-full h-4 bg-gray-100 rounded-full overflow-hidden relative flex items-center justify-center">
              <div 
                className="h-full bg-[#27AE60] rounded-full transition-all duration-500 absolute left-0 top-0" 
                style={{ width: `${(monthlyRevenue / 50000) * 100}%` }}
              ></div>
              <span className="z-10 text-[10px] font-bold text-gray-700">
                {((monthlyRevenue / 50000) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        {/* Card 4 — My Queue */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">My Queue</span>
            <div className="text-3xl font-extrabold text-gray-800 mt-1">18</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">14 Fresh</span>
              <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-bold">4 Callbacks</span>
              <span className="bg-red-50 text-red-600 px-1.5 py-0.5 rounded font-bold">1 Overdue</span>
            </div>
          </div>
          <button 
            onClick={() => navigate('/dw/dw-call-queue')}
            className="w-full bg-[#27AE60] hover:bg-[#219653] text-white py-2 rounded-lg font-bold text-xs flex items-center justify-center gap-1 shadow-sm transition-transform active:scale-[0.98] mt-3"
          >
            Start Calling →
          </button>
        </div>

      </div>

      {/* Secondary Dashboard Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        
        {/* Streak Card (Left, 1/3 width) */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1">
              <span className="text-orange-500">🔥</span> Streak: 4 days
            </h3>
            <span className="text-[10px] text-gray-400">Streak Record: 6 days</span>
          </div>
          
          {/* 14-day calendar grid (7x2) */}
          <div className="grid grid-cols-7 gap-2">
            {[
              { day: 1, state: 'converted' },
              { day: 2, state: 'converted' },
              { day: 3, state: 'called' },
              { day: 4, state: 'none' },
              { day: 5, state: 'converted' },
              { day: 6, state: 'converted' },
              { day: 7, state: 'converted' },
              { day: 8, state: 'none' },
              { day: 9, state: 'called' },
              { day: 10, state: 'converted' },
              { day: 11, state: 'converted' },
              { day: 12, state: 'converted' },
              { day: 13, state: 'future' },
              { day: 14, state: 'future' }
            ].map((d, index) => {
              let cellClass = 'border-gray-200 hover:bg-gray-50';
              if (d.state === 'converted') cellClass = 'bg-[#EAFAF1] border-[#27AE60] text-[#27AE60] font-bold';
              else if (d.state === 'called') cellClass = 'border-dashed border-gray-400 text-gray-400';
              else if (d.state === 'none') cellClass = 'border-red-300 text-red-500 border';
              else if (d.state === 'future') cellClass = 'bg-gray-50 text-gray-300 border-gray-100 border-dashed';

              return (
                <div 
                  key={index} 
                  className={`border rounded-lg h-9 flex flex-col items-center justify-center text-[10px] select-none transition-all ${cellClass}`}
                  title={`Day ${d.day}: ${d.state.toUpperCase()}`}
                >
                  <span>D{d.day}</span>
                  {d.state === 'converted' && <span className="text-[8px] leading-none">✓</span>}
                </div>
              );
            })}
          </div>
          <p className="text-[11px] text-gray-400 mt-3 text-center">Longest streak this month: 6 days</p>
        </div>

        {/* Overdue Callbacks Alert (Center, 1/3 width) */}
        <div className="bg-white border-l-4 border-red-500 border-t border-r border-b border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-red-600 flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              Overdue Callbacks ({overdueCallbacks.length})
            </h3>
            
            {overdueCallbacks.length > 0 ? (
              <div className="space-y-2 mt-2">
                {overdueCallbacks.map(cb => (
                  <div key={cb.id} className="flex justify-between items-center bg-red-50/50 p-2 rounded border border-red-100">
                    <div>
                      <div className="text-xs font-bold text-gray-800">{cb.name}</div>
                      <div className="text-[10px] text-gray-500">{cb.tmid} · Due {cb.time}</div>
                    </div>
                    <button 
                      onClick={() => handleCallbackCall(cb.name, cb.tmid)}
                      className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold rounded shadow-sm transition-colors"
                    >
                      Call Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-xs text-[#27AE60] font-bold flex items-center justify-center h-20 bg-green-50 rounded-lg">
                All callbacks on schedule ✓
              </div>
            )}
          </div>
          {overdueCallbacks.length > 3 && (
            <button className="text-[11px] text-red-600 hover:underline mt-2 self-start font-semibold">
              + {overdueCallbacks.length - 3} more callbacks
            </button>
          )}
        </div>

        {/* Leaderboard Position (Right, 1/3 width) */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800 flex justify-between">
              <span>Leaderboard</span>
              <span className="text-xs text-gray-400">Driver Welcome Team</span>
            </h3>
            <div className="text-xl font-bold text-gray-800 mt-2">
              #2 <span className="text-xs text-gray-500 font-normal">of 6 Agents</span>
            </div>
            
            {/* Compare vs Rank 1 */}
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>You (Revenue)</span>
                  <span className="font-bold">₹{monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-[#27AE60]" style={{ width: '49.4%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>#1 Agent (Rohan S.)</span>
                  <span className="font-bold">₹8,500</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gray-300" style={{ width: '100%' }}></div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 italic">Rank is automatically updated at shift wrap-up</p>
        </div>

      </div>

    </div>
  );
};

export default DwHomeDashboard;
