import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDwDashboardQuery } from '../../services/api/webCrmApi';
import { useGetGateProgressQuery } from '../../services/api/incentiveApi';
import GateProgressWidget from '../../shared/components/incentive/GateProgressWidget';

export const DwHomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: response, isLoading } = useGetDwDashboardQuery();
  const { data: progress } = useGetGateProgressQuery('dwc');

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-primary border-outline-variant rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-outline">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  const kpis = response?.data?.kpis || {
    calls_pending: 0,
    assigned_total: 0,
    calls_today: 0,
    connected_today: 0,
    subscriptions_today: 0,
    feedback_missing: 0,
    call_time: '0h 0m',
    monthly_revenue: 0,
  };

  const overdueCallbacks = response?.data?.overdue_callbacks || [];
  const callBreakdown = response?.data?.call_breakdown || [];
  const leaderboard = response?.data?.leaderboard || { my_rank: 1, total_peers: 1 };
  
  // Commission calculation: estimate ₹150 incentive per subscription
  const todayEarnings = kpis.subscriptions_today * 150;
  const todayTarget = 1667; // target ₹50,000 / 30 days
  const todayEarningsPercent = Math.min(100, Math.round((todayEarnings / todayTarget) * 100));

  // Fetch real gate progress from reactive incentive engine
  const monthlyRevenue = progress?.accruedIncentive ?? 0;

  // Base Salary Gate
  const salaryGateThreshold = progress?.salaryGateThreshold ?? 24000;
  const isSalaryGateCrossed = progress?.isSalaryGateUnlocked ?? false;
  const remainingToSalaryGate = progress?.salaryGateRemaining ?? Math.max(0, salaryGateThreshold - monthlyRevenue);
  const salaryGatePercent = progress?.salaryGatePercentage ?? 0;

  // Incentive Gate
  const incentiveGateThreshold = progress?.incentiveGateThreshold ?? 38000;
  const isIncentiveGateCrossed = progress?.isIncentiveGateUnlocked ?? false;
  const remainingToIncentiveGate = progress?.incentiveGateRemaining ?? Math.max(0, incentiveGateThreshold - monthlyRevenue);
  const incentiveGatePercent = progress?.incentiveGatePercentage ?? 0;

  // Today progress bar color
  const getTodayBarColor = (pct: number) => {
    if (pct < 50) return 'bg-[#828282]'; // gray
    if (pct < 80) return 'bg-[#F2C94C]'; // amber
    return 'bg-[#27AE60]'; // green
  };

  const handleCallbackCall = (name: string, tmid: string) => {
    navigate('/dw/dw-active-call-focus', { state: { name, tmid } });
  };

  const formattedDate = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
      
      {/* Header and User Welcome Banner */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">Driver Welcome Calling Process</p>
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome back, {response?.data?.caller?.name || 'Agent'} — {formattedDate}
          </h2>
        </div>
        <div className="flex items-center gap-2 bg-green-50 border border-green-200 px-3 py-1.5 rounded-lg text-xs">
          <span className="w-2 h-2 rounded-full bg-[#27AE60] animate-pulse"></span>
          <span className="font-bold text-[#27AE60]">Database Connected (Live)</span>
        </div>
      </section>

      {/* Main KPI Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1 — Today's Earnings */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">Today's Earnings (Incentives)</span>
            <div className="text-2xl font-bold text-[#27AE60] mt-1">₹{todayEarnings}</div>
            <div className="text-xs text-gray-400 mt-1">of ₹{todayTarget} daily target share</div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${getTodayBarColor(todayEarningsPercent)}`} 
                style={{ width: `${todayEarningsPercent}%` }}
              ></div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-gray-500 mt-2 pt-1 border-t border-gray-100">
              <span>{kpis.calls_today} calls</span>
              <span>·</span>
              <span>{kpis.subscriptions_today} conversions</span>
              <span>·</span>
              <span>{kpis.calls_today > 0 ? ((kpis.subscriptions_today / kpis.calls_today) * 100).toFixed(1) : 0}% rate</span>
            </div>
          </div>
        </div>

        {/* Card 2 — Base Salary Gate */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div>
            <div className="flex justify-between items-start">
              <span className={`text-xs uppercase font-semibold ${isSalaryGateCrossed ? 'text-[#27AE60]' : 'text-gray-500'}`}>
                {isSalaryGateCrossed ? '✓ Salary Gate' : 'Base Salary Gate'}
              </span>
              {isSalaryGateCrossed && (
                <span className="bg-[#EAFAF1] text-[#27AE60] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Secured</span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              ₹{monthlyRevenue.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ ₹{salaryGateThreshold.toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {isSalaryGateCrossed 
                ? 'Base salary secured for the cycle' 
                : `₹${remainingToSalaryGate.toLocaleString()} more to secure base salary`
              }
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isSalaryGateCrossed ? 'bg-[#27AE60]' : 'bg-[#828282]'}`} 
                style={{ width: `${salaryGatePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 3 — Incentives Gate */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div>
            <div className="flex justify-between items-start">
              <span className={`text-xs uppercase font-semibold ${isIncentiveGateCrossed ? 'text-[#27AE60]' : 'text-gray-500'}`}>
                {isIncentiveGateCrossed ? '✓ Incentives Active' : 'Incentives Gate'}
              </span>
              {isIncentiveGateCrossed && (
                <span className="bg-[#EAFAF1] text-[#27AE60] text-[9px] px-1.5 py-0.5 rounded font-bold uppercase">Active</span>
              )}
            </div>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              ₹{monthlyRevenue.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ ₹{incentiveGateThreshold.toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {isIncentiveGateCrossed 
                ? 'Payout active — conversions now earn incentives' 
                : `₹${remainingToIncentiveGate.toLocaleString()} more to activate incentives (2x sale)`
              }
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isIncentiveGateCrossed ? 'bg-[#27AE60]' : 'bg-[#828282]'}`} 
                style={{ width: `${incentiveGatePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 4 — My Queue */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[160px]">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">My Queue</span>
            <div className="text-3xl font-extrabold text-gray-800 mt-1">{kpis.calls_pending}</div>
            <div className="flex items-center gap-1 mt-1 text-[10px]">
              <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded font-bold">{kpis.calls_pending} Pending</span>
              <span className="bg-orange-50 text-orange-600 px-1.5 py-0.5 rounded font-bold">{overdueCallbacks.length} Overdue Callbacks</span>
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

      {/* Incentive Gate Progress Widget */}
      <GateProgressWidget />

      {/* Secondary Dashboard Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        
        {/* Call Breakdown Chart/Card */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-sm font-bold text-gray-800 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-[#27AE60]">phone_in_talk</span> Process Breakdown
            </h3>
            <span className="text-[10px] text-gray-400">Calls today: {kpis.calls_today}</span>
          </div>
          
          <div className="space-y-3 mt-4">
            {callBreakdown.length > 0 ? (
              callBreakdown.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-gray-700">
                    <span>{item.process || 'General Welcome'}</span>
                    <span>{item.total} calls</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary rounded-full" 
                      style={{ width: `${kpis.calls_today > 0 ? (item.total / kpis.calls_today) * 100 : 0}%` }}
                    ></div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-xs text-gray-400 italic text-center py-8">
                No calls recorded today yet.
              </div>
            )}
          </div>
          <p className="text-[11px] text-gray-400 mt-5 pt-3 border-t border-gray-100 text-center">
            Total Calling Duration: <span className="font-bold text-gray-700">{kpis.call_time}</span>
          </p>
        </div>

        {/* Overdue Callbacks Alert */}
        <div className="bg-white border-l-4 border-red-500 border-t border-r border-b border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-red-600 flex items-center gap-1 mb-2">
              <span className="material-symbols-outlined text-[16px]">warning</span>
              Overdue Callbacks ({overdueCallbacks.length})
            </h3>
            
            {overdueCallbacks.length > 0 ? (
              <div className="space-y-2 mt-2 max-h-[160px] overflow-y-auto pr-1">
                {overdueCallbacks.map(cb => (
                  <div key={cb.id} className="flex justify-between items-center bg-red-50/50 p-2 rounded border border-red-100">
                    <div>
                      <div className="text-xs font-bold text-gray-800">{cb.name}</div>
                      <div className="text-[10px] text-gray-500">{cb.tmid} · Due {cb.logged_at}</div>
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
            <button 
              onClick={() => navigate('/dw/dw-callback-calendar')}
              className="text-[11px] text-red-600 hover:underline mt-2 self-start font-semibold"
            >
              Show all callbacks
            </button>
          )}
        </div>

        {/* Leaderboard Position */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-gray-800 flex justify-between">
              <span>Leaderboard Rank</span>
              <span className="text-xs text-gray-400">Driver Welcome Team</span>
            </h3>
            <div className="text-xl font-bold text-gray-800 mt-2">
              #{leaderboard.my_rank} <span className="text-xs text-gray-500 font-normal">of {leaderboard.total_peers} Agents</span>
            </div>
            
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                  <span>Your Revenue</span>
                  <span className="font-bold">₹{monthlyRevenue.toLocaleString()}</span>
                </div>
                <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[#27AE60]" 
                    style={{ width: `${Math.min(100, Math.round((monthlyRevenue / Math.max(1, leaderboard.my_rank === 1 ? monthlyRevenue : 40000)) * 100))}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-[10px] text-gray-400 mt-3 italic">
            Feedback Missing: <span className="text-red-500 font-bold">{kpis.feedback_missing} calls</span>
          </p>
        </div>

      </div>

    </div>
  );
};

export default DwHomeDashboard;
