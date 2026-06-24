import React, { useState } from 'react';
import { useGetDwPerformanceQuery } from '../../services/api/webCrmApi';

export const DwPerformanceStats: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'today' | 'this_week' | 'this_month'>('this_month');

  // Fetch live performance stats
  const { data: response, isLoading } = useGetDwPerformanceQuery({ period: activeTab });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <p className="text-sm font-semibold text-outline">Loading performance stats...</p>
      </div>
    );
  }

  const data = response?.data;
  const metrics = data?.metrics || {
    total_calls: 0,
    connected: 0,
    conversions: 0,
    revenue: 0,
    connect_rate: 0,
    conversion_rate: 0,
    avg_call_time: '0h 0m'
  };

  const dispositions = data?.dispositions || [];
  const dailyTrend = data?.daily_trend || [];
  const monthly = data?.monthly || { revenue: 0, target: 50000, pct: 0 };
  const salaryGate = data?.salary_gate || {
    base_salary: 11000,
    threshold: 22000,
    achieved: 0,
    cleared: false,
    gap: 22000
  };

  const isGateCrossed = salaryGate.cleared;
  const gateProgressPercent = Math.min(100, Math.round((salaryGate.achieved / salaryGate.threshold) * 100));

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
          {([
            { id: 'today', label: 'Today' },
            { id: 'this_week', label: 'This Week' },
            { id: 'this_month', label: 'This Month' }
          ] as const).map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded transition-all ${
                activeTab === tab.id ? 'bg-white text-gray-800 shadow-sm font-bold' : 'text-gray-500 hover:text-gray-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </section>

      <div className="space-y-6 animate-in fade-in duration-300">
        
        {/* Main stats blocks grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Revenue Block */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Revenue Target Achievement</span>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              ₹{metrics.revenue.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ ₹{monthly.target.toLocaleString()}</span>
            </div>
            <div className="mt-3">
              <div className="w-full h-3.5 bg-gray-100 rounded-full overflow-hidden relative flex items-center justify-center">
                <div 
                  className="h-full bg-[#27AE60] rounded-full transition-all duration-500 absolute left-0 top-0" 
                  style={{ width: `${monthly.pct}%` }}
                ></div>
                <span className="z-10 text-[9px] font-bold text-gray-700">
                  {monthly.pct}%
                </span>
              </div>
            </div>
          </div>

          {/* Conversion Rate Block */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Conversion Rate (Period)</span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-bold text-red-600">{metrics.conversion_rate}%</span>
              <span className="text-xs text-gray-500">Connected: {metrics.connected}</span>
            </div>
            <div className="mt-3 py-1 bg-green-50 text-[#27AE60] text-xs font-bold px-2 rounded-lg text-center">
              Conversions: {metrics.conversions}
            </div>
          </div>

          {/* Calls Summary Block */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Calls Summary</span>
            <div className="text-xl font-bold text-gray-800 mt-1">
              {metrics.total_calls} <span className="text-xs text-gray-400 font-normal">calls made</span>
            </div>
            <div className="text-xs text-gray-500 mt-2 space-y-1">
              <div className="flex justify-between">
                <span>Avg Duration:</span>
                <span className="font-semibold text-gray-800">{metrics.avg_call_time}</span>
              </div>
              <div className="flex justify-between">
                <span>Connect Rate:</span>
                <span className="font-semibold text-gray-800">{metrics.connect_rate}%</span>
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
                  ✓ Gate Crossed — incentives active
                </div>
              ) : (
                <div className="mt-3">
                  <div className="flex justify-between text-xs mb-1 font-semibold text-gray-700">
                    <span>₹{salaryGate.achieved.toLocaleString()} / ₹{salaryGate.threshold.toLocaleString()} (Salary × 2)</span>
                    <span>{gateProgressPercent}%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-gray-400" style={{ width: `${gateProgressPercent}%` }}></div>
                  </div>
                  <p className="text-xs text-red-500 font-semibold mt-2">
                    ⚠️ ₹{salaryGate.gap.toLocaleString()} to unlock incentives
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Disposition breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden p-4">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider block mb-3">Call Dispositions logged</span>
            <div className="space-y-2">
              {dispositions.length > 0 ? (
                dispositions.map((d, idx) => (
                  <div key={idx} className="flex justify-between items-center text-xs text-gray-700">
                    <span>{d.call_feedback}</span>
                    <span className="font-bold">{d.count} calls</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-4">No dispositions logged.</p>
              )}
            </div>
          </div>

        </div>

        {/* Call Volume Trend Chart */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[220px]">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-gray-400 font-bold uppercase tracking-wider">Call Volume Trend</span>
            <span className="text-[10px] text-gray-400">Daily breakdown</span>
          </div>

          <div className="flex justify-between items-end h-32 px-4 relative border-b border-gray-100">
            {dailyTrend.length > 0 ? (
              dailyTrend.map((d, i) => {
                const maxVal = Math.max(...dailyTrend.map(t => t.calls), 20);
                const pct = (d.calls / maxVal) * 100;
                return (
                  <div key={i} className="flex flex-col items-center w-8 group relative z-10">
                    <span className="absolute -top-6 text-[9px] bg-gray-800 text-white rounded px-1 py-0.5 opacity-0 group-hover:opacity-100 transition-opacity font-mono">
                      {d.calls} calls
                    </span>
                    <div 
                      className="w-full rounded-t bg-[#27AE60] hover:bg-[#219653] transition-all duration-300" 
                      style={{ height: `${pct}%`, minHeight: '4px' }}
                    ></div>
                    <span className="text-[8px] text-gray-400 mt-1 font-bold truncate w-full text-center">
                      {d.date.slice(-5)}
                    </span>
                  </div>
                );
              })
            ) : (
              <p className="text-xs text-gray-400 italic text-center py-8 w-full">No daily trends recorded.</p>
            )}
          </div>
        </div>

      </div>

    </div>
  );
};

export default DwPerformanceStats;
