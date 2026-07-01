import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDwDashboardQuery } from '../../services/api/webCrmApi';
import { useGetGateProgressQuery } from '../../services/api/incentiveApi';
import GateProgressWidget from '../../shared/components/incentive/GateProgressWidget';

type Period = 'today' | 'yesterday' | 'last_7_days' | 'this_week' | 'this_month' | 'all';

const PERIOD_TABS: { id: Period; label: string }[] = [
  { id: 'today',       label: 'Today' },
  { id: 'yesterday',   label: 'Yesterday' },
  { id: 'last_7_days', label: 'Past 7 Days' },
  { id: 'this_week',   label: 'This Week' },
  { id: 'this_month',  label: 'This Month' },
  { id: 'all',         label: 'All Time' },
];

interface KpiTileProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  iconColor: string;
  iconBg: string;
  valueColor?: string;
  borderColor?: string;
}

const KpiTile: React.FC<KpiTileProps> = ({ label, value, sub, icon, iconColor, iconBg, valueColor = 'text-gray-800', borderColor = 'border-gray-200' }) => (
  <div className={`bg-white border ${borderColor} rounded-lg p-3.5 flex flex-col gap-2 shadow-sm hover:shadow transition-shadow`}>
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">{label}</span>
      <span className={`material-symbols-outlined text-[17px] w-7 h-7 rounded-lg flex items-center justify-center ${iconColor} ${iconBg}`}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>
        {icon}
      </span>
    </div>
    <div className={`text-2xl font-bold leading-tight ${valueColor}`}>{value}</div>
    {sub && <div className="text-[10px] text-gray-400 leading-none">{sub}</div>}
  </div>
);

export const DwHomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('today');

  const { data: response, isLoading, isFetching } = useGetDwDashboardQuery(
    { period },
    { refetchOnMountOrArgChange: true }
  );
  const { data: progress } = useGetGateProgressQuery('dwc');

  const kpis = response?.data?.kpis || {
    calls_pending: 0, assigned_total: 0, calls_today: 0,
    connected_today: 0, subscriptions_today: 0,
    feedback_missing: 0, call_time: '0h 0m', monthly_revenue: 0,
  };

  const overdueCallbacks = response?.data?.overdue_callbacks || [];
  const callBreakdown    = response?.data?.call_breakdown    || [];
  const leaderboard      = response?.data?.leaderboard       || { my_rank: 1, total_peers: 1 };
  const cs = (response?.data as any)?.calls_summary || {
    total_calls: 0, incoming: 0, outgoing: 0,
    connected: 0, not_connected: 0, callback_later: 0,
    conversions: 0, connect_rate: 0, conversion_rate: 0, call_time: '0h 0m',
  };

  const monthlyRevenue         = progress?.accruedIncentive        ?? 0;
  const salaryGateThreshold    = progress?.salaryGateThreshold     ?? 24000;
  const isSalaryGateCrossed    = progress?.isSalaryGateUnlocked    ?? false;
  const remainingToSalaryGate  = progress?.salaryGateRemaining     ?? Math.max(0, salaryGateThreshold - monthlyRevenue);
  const salaryGatePercent      = progress?.salaryGatePercentage    ?? 0;
  const incentiveGateThreshold = progress?.incentiveGateThreshold  ?? 38000;
  const isIncentiveGateCrossed = progress?.isIncentiveGateUnlocked ?? false;
  const remainingToIncentive   = progress?.incentiveGateRemaining  ?? Math.max(0, incentiveGateThreshold - monthlyRevenue);
  const incentiveGatePercent   = progress?.incentiveGatePercentage ?? 0;

  const todayEarnings        = kpis.subscriptions_today * 150;
  const todayEarningsPercent = Math.min(100, Math.round((todayEarnings / 1667) * 100));

  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-5 max-w-7xl mx-auto w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)]">

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Driver Welcome Calling Process</p>
          <h2 className="text-xl font-bold text-gray-800 mt-0.5">
            Welcome back, {response?.data?.caller?.name || 'Agent'} — {formattedDate}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          {isFetching && (
            <span className="text-[11px] text-gray-400 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse"></span>Updating...
            </span>
          )}
          <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-semibold text-emerald-700">Database Live</span>
          </div>
        </div>
      </section>

      {/* Period Filter */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider shrink-0">Period:</span>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
          {PERIOD_TABS.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setPeriod(tab.id)}
              className={`px-3.5 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all border-r border-gray-200 last:border-r-0 ${
                period === tab.id
                  ? 'bg-indigo-600 text-white'
                  : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Summary Tiles */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-9 gap-2 animate-pulse">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-20"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-9 gap-2">
          <KpiTile
            label="Total Calls"   value={cs.total_calls}
            icon="phone"          iconBg="bg-slate-100"    iconColor="text-slate-500"
            borderColor="border-slate-200"
          />
          <KpiTile
            label="Outgoing"      value={cs.outgoing}
            icon="call_made"      iconBg="bg-blue-50"     iconColor="text-blue-500"
            valueColor="text-blue-700"   borderColor="border-blue-100"
          />
          <KpiTile
            label="Incoming"      value={cs.incoming}
            icon="call_received"  iconBg="bg-sky-50"      iconColor="text-sky-500"
            valueColor="text-sky-700"    borderColor="border-sky-100"
          />
          <KpiTile
            label="Connected"     value={cs.connected}
            icon="check_circle"   iconBg="bg-emerald-50"  iconColor="text-emerald-500"
            valueColor="text-emerald-700" borderColor="border-emerald-200"
            sub={`${cs.connect_rate}% connect rate`}
          />
          <KpiTile
            label="Not Connected" value={cs.not_connected}
            icon="cancel"         iconBg="bg-red-50"      iconColor="text-red-500"
            valueColor="text-red-600"    borderColor="border-red-100"
          />
          <KpiTile
            label="Callback"      value={cs.callback_later}
            icon="schedule_send"  iconBg="bg-amber-50"    iconColor="text-amber-500"
            valueColor="text-amber-700"  borderColor="border-amber-200"
          />
          <KpiTile
            label="Conversions"   value={cs.conversions}
            icon="trending_up"    iconBg="bg-purple-50"   iconColor="text-purple-500"
            valueColor="text-purple-700" borderColor="border-purple-200"
            sub={cs.connected > 0 ? `${cs.conversion_rate}% of connected` : undefined}
          />
          <KpiTile
            label="Connect %"    value={`${cs.connect_rate}%`}
            icon="bar_chart"      iconBg="bg-teal-50"     iconColor="text-teal-500"
            valueColor="text-teal-700"   borderColor="border-teal-100"
          />
          <KpiTile
            label="Talk Time"     value={cs.call_time || kpis.call_time}
            icon="timer"          iconBg="bg-orange-50"   iconColor="text-orange-500"
            valueColor="text-orange-700" borderColor="border-orange-100"
          />
        </div>
      )}

      {/* Gate + Queue Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">

        {/* Today's Earnings */}
        <div
          onClick={() => navigate('/dw/dw-performance-stats')}
          className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md hover:border-indigo-200 transition-all group"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Today's Earnings</span>
              <span className="material-symbols-outlined text-[18px] text-indigo-400">payments</span>
            </div>
            <div className="text-2xl font-bold text-gray-800">₹{todayEarnings.toLocaleString()}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">of ₹1,667 daily target</div>
          </div>
          <div className="mt-3">
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-indigo-500 rounded-full transition-all" style={{ width: `${todayEarningsPercent}%` }}></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 mt-2 pt-2 border-t border-gray-100">
              <span>{kpis.calls_today} calls today</span>
              <span className="font-semibold text-indigo-600">{kpis.subscriptions_today} sales</span>
            </div>
          </div>
        </div>

        {/* Base Salary Gate */}
        <div
          onClick={() => navigate('/dw/dw-performance-stats')}
          className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md hover:border-emerald-200 transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Base Salary Gate</span>
              {isSalaryGateCrossed
                ? <span className="text-[9px] text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded font-bold">✓ SECURED</span>
                : <span className="material-symbols-outlined text-[18px] text-emerald-400">lock_open</span>
              }
            </div>
            <div className="text-2xl font-bold text-gray-800">
              ₹{monthlyRevenue.toLocaleString()}
              <span className="text-xs text-gray-400 font-normal ml-1">/ ₹{salaryGateThreshold.toLocaleString()}</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              {isSalaryGateCrossed ? 'Salary secured this cycle' : `₹${remainingToSalaryGate.toLocaleString()} remaining`}
            </div>
          </div>
          <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${isSalaryGateCrossed ? 'bg-emerald-500' : 'bg-emerald-400'}`} style={{ width: `${salaryGatePercent}%` }}></div>
          </div>
        </div>

        {/* Incentive Gate */}
        <div
          onClick={() => navigate('/dw/dw-performance-stats')}
          className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm cursor-pointer hover:shadow-md hover:border-purple-200 transition-all"
        >
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Incentive Gate</span>
              {isIncentiveGateCrossed
                ? <span className="text-[9px] text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded font-bold">✓ ACTIVE</span>
                : <span className="material-symbols-outlined text-[18px] text-purple-400">bolt</span>
              }
            </div>
            <div className="text-2xl font-bold text-gray-800">
              ₹{monthlyRevenue.toLocaleString()}
              <span className="text-xs text-gray-400 font-normal ml-1">/ ₹{incentiveGateThreshold.toLocaleString()}</span>
            </div>
            <div className="text-[10px] text-gray-400 mt-0.5">
              {isIncentiveGateCrossed ? '2× sale rate active' : `₹${remainingToIncentive.toLocaleString()} to unlock`}
            </div>
          </div>
          <div className="mt-3 w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className={`h-full rounded-full transition-all ${isIncentiveGateCrossed ? 'bg-purple-500' : 'bg-purple-400'}`} style={{ width: `${incentiveGatePercent}%` }}></div>
          </div>
        </div>

        {/* My Queue */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">My Queue</span>
              <span className="material-symbols-outlined text-[18px] text-blue-400">queue</span>
            </div>
            <div className="text-3xl font-bold text-gray-800">{kpis.calls_pending}</div>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              <span className="text-[10px] text-blue-700 bg-blue-50 border border-blue-100 px-1.5 py-0.5 rounded font-semibold">{kpis.calls_pending} Pending</span>
              {overdueCallbacks.length > 0 && (
                <span className="text-[10px] text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded font-semibold">{overdueCallbacks.length} Callbacks</span>
              )}
            </div>
          </div>
          <button
            onClick={() => { sessionStorage.setItem('dw_queue_tab', 'fresh'); navigate('/dw/dw-call-queue'); }}
            className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-lg font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors active:scale-[0.98] shadow-sm"
          >
            <span className="material-symbols-outlined text-[16px]">call</span> Start Calling
          </button>
        </div>
      </div>

      {/* Gate Progress Widget */}
      <GateProgressWidget onClick={() => navigate('/dw/dw-performance-stats')} />

      {/* Bottom Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Process Breakdown */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-indigo-400">phone_in_talk</span>
              Process Breakdown
            </h3>
            <span className="text-[10px] text-gray-400">{cs.total_calls} calls · {cs.call_time || kpis.call_time}</span>
          </div>
          {callBreakdown.length > 0 ? (
            <div className="space-y-3">
              {callBreakdown.map((item: any, i: number) => {
                const pct = cs.total_calls > 0 ? Math.round((item.total / cs.total_calls) * 100) : 0;
                const colors = ['bg-indigo-400', 'bg-blue-400', 'bg-emerald-400', 'bg-purple-400'];
                return (
                  <div key={i}>
                    <div className="flex justify-between text-[11px] text-gray-600 mb-1 font-medium">
                      <span>{item.process}</span>
                      <span className="text-gray-400">{item.total} <span className="text-gray-300">({pct}%)</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                      <div className={`h-full ${colors[i % colors.length]} rounded-full transition-all`} style={{ width: `${pct}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <span className="material-symbols-outlined text-gray-200 text-[40px]">phone_disabled</span>
              <p className="text-[11px] text-gray-400 italic mt-2">No calls for this period yet.</p>
            </div>
          )}
        </div>

        {/* Overdue Callbacks */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 flex items-center justify-between bg-red-50/50">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-red-400">warning</span>
              Overdue Callbacks
            </h3>
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${overdueCallbacks.length > 0 ? 'text-red-600 bg-red-100' : 'text-gray-400 bg-gray-100'}`}>
              {overdueCallbacks.length}
            </span>
          </div>
          <div className="p-4">
            {overdueCallbacks.length > 0 ? (
              <div className="space-y-2 max-h-[160px] overflow-y-auto">
                {overdueCallbacks.map((cb: any) => (
                  <div key={cb.id} className="flex justify-between items-center p-2 bg-gray-50 rounded-lg border border-gray-100 hover:border-red-100 transition-colors">
                    <div>
                      <div className="text-xs font-semibold text-gray-800">{cb.name}</div>
                      <div className="text-[10px] text-gray-400">{cb.tmid}</div>
                    </div>
                    <button
                      onClick={() => navigate('/dw/dw-active-call-focus', { state: { name: cb.name, tmid: cb.tmid } })}
                      className="px-2.5 py-1 bg-red-500 hover:bg-red-600 text-white text-[10px] font-bold rounded-lg transition-colors"
                    >
                      Call Now
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-6 text-center">
                <span className="material-symbols-outlined text-emerald-300 text-[36px]">check_circle</span>
                <p className="text-[11px] text-gray-400 italic mt-1">All callbacks on schedule</p>
              </div>
            )}
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 border-b border-gray-100 bg-amber-50/50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px] text-amber-400">leaderboard</span>
              Leaderboard
            </h3>
            <span className="text-[10px] text-gray-400">Driver Welcome Team</span>
          </div>
          <div className="p-4">
            <div className="flex items-baseline gap-2 mb-3">
              <div className="text-4xl font-black text-amber-500">#{leaderboard.my_rank}</div>
              <div className="text-[11px] text-gray-400">of {leaderboard.total_peers} agents</div>
            </div>
            <div>
              <div className="flex justify-between text-[10px] text-gray-500 mb-1">
                <span>Monthly Revenue</span>
                <span className="font-bold text-gray-700">₹{monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-amber-400 rounded-full transition-all"
                  style={{ width: `${Math.min(100, Math.round((monthlyRevenue / Math.max(1, leaderboard.my_rank === 1 ? monthlyRevenue : 40000)) * 100))}%` }}
                ></div>
              </div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-2">
              <div className="bg-blue-50 rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-blue-700">{kpis.calls_pending}</div>
                <div className="text-[9px] text-blue-400 uppercase font-semibold mt-0.5">Pending</div>
              </div>
              <div className="bg-red-50 rounded-lg p-2 text-center">
                <div className="text-sm font-bold text-red-600">{kpis.feedback_missing}</div>
                <div className="text-[9px] text-red-400 uppercase font-semibold mt-0.5">Feedback Gap</div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};

export default DwHomeDashboard;
