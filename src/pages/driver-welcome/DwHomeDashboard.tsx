import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetDwDashboardQuery } from '../../services/api/webCrmApi';
import { useGetGateProgressQuery } from '../../services/api/incentiveApi';
import GateProgressWidget from '../../shared/components/incentive/GateProgressWidget';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';
import { DriverForm } from '../matchmaking/MmDriverBank';

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
  const { agentState, callState, dial } = useSanCti();
  const [toast, setToast] = useState<string | null>(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Call back a missed caller — same guard + dial as DwCallQueue, but lands
  // the agent on the Active Call Focus screen with the user's details. The
  // SanCti flow logs the call and its disposition into call_history_ivr
  // automatically (/call/initiate + /call/disposition).
  const handleMissedCallback = (m: { user_id: number | null; user_name: string | null; user_tmid: string | null; caller_id: string | null }) => {
    if (!m.user_id || !m.caller_id) return;
    if (agentState !== 'ready') {
      triggerToast(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel (bottom-left).'
        : 'CTI agent is not ready yet — please wait a moment and try again.');
      return;
    }
    if (callState !== 'idle') {
      triggerToast('Finish or hang up the current call before dialing another lead.');
      return;
    }
    navigate('/dw/dw-active-call-focus', {
      state: {
        userId: m.user_id,
        name: m.user_name || m.caller_id,
        tmid: m.user_tmid || '',
        mobile: m.caller_id,
      },
    });
    dial(m.caller_id, m.user_id, m.user_name || m.caller_id, m.user_tmid || '', 'driver');
  };

  const { data: response, isLoading, isFetching } = useGetDwDashboardQuery(
    { period },
    { refetchOnMountOrArgChange: true }
  );
  // refetchOnMountOrArgChange: the gate figures must always be live — a
  // cached response from before the latest subscription showed ₹0 gates
  // while the dashboard's own (fresh) queries already counted the sale.
  const { data: progress } = useGetGateProgressQuery('dwc', { refetchOnMountOrArgChange: true });

  const kpis = response?.data?.kpis || {
    calls_pending: 0, assigned_total: 0, calls_today: 0,
    connected_today: 0, subscriptions_today: 0,
    feedback_missing: 0, call_time: '0h 0m', monthly_revenue: 0,
    missed_calls: 0, incoming_missed: 0,
  };

  // SAN's network-side CDR stats (webhook_crm) — the only source that sees
  // incoming calls that were never answered.
  const cdr = response?.data?.cdr_stats || {
    agent_name: null, total_calls: 0, connected: 0, missed_calls: 0,
    incoming_total: 0, incoming_missed: 0, outgoing_total: 0, outgoing_missed: 0,
    talk_time: '0h 0m', total_duration: '0h 0m', avg_ring_seconds: 0,
    recent_missed: [],
  };

  // Subscriptions collected by this telecaller (collection_by ledger)
  const subs = response?.data?.subscriptions || {
    period: 'today', period_count: 0, period_amount: 0,
    today_count: 0, today_amount: 0, month_count: 0, month_amount: 0,
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

  // Real amount collected today from the collection_by ledger — previously
  // this was a hardcoded ₹150-per-sale estimate that contradicted the actual
  // subscription amounts (e.g. one ₹199 sale showed as ₹150).
  const todayEarnings        = subs.today_amount;
  const todayEarningsPercent = Math.min(100, Math.round((todayEarnings / 1667) * 100));

  const formattedDate = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <div className="space-y-5 max-w-7xl mx-auto w-full p-4">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          {toast}
        </div>
      )}

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Driver Welcome Calling Process</p>
          <h2 className="text-xl font-bold text-gray-800 mt-0.5">
            Welcome back, {response?.data?.caller?.name || 'Agent'} — {formattedDate}
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsBankModalOpen(true)}
            className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm transition-colors active:scale-95 shrink-0"
          >
            <span className="material-symbols-outlined text-[16px]">account_box</span> Add Driver to Bank
          </button>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 animate-pulse">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="bg-gray-100 rounded-lg h-20"></div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
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
          <KpiTile
            label="Missed Calls"  value={cdr.missed_calls}
            icon="phone_missed"   iconBg="bg-rose-50"     iconColor="text-rose-500"
            valueColor="text-rose-700"   borderColor="border-rose-200"
            sub={`${cdr.outgoing_missed} out · ${cdr.incoming_missed} in`}
          />
          <KpiTile
            label="Incoming Missed" value={cdr.incoming_missed}
            icon="phone_callback" iconBg="bg-red-50"      iconColor="text-red-500"
            valueColor="text-red-700"    borderColor="border-red-200"
            sub={`of ${cdr.incoming_total} incoming`}
          />
          <KpiTile
            label="Subscriptions" value={subs.period_count}
            icon="workspace_premium" iconBg="bg-green-50" iconColor="text-green-600"
            valueColor="text-green-700"  borderColor="border-green-200"
            sub={`₹${subs.period_amount.toLocaleString()} collected`}
          />
        </div>
      )}

      {/* Subscriptions + SAN Missed Call Detail */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* My Subscriptions (collection_by ledger) */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">My Subscriptions</span>
            <span className="material-symbols-outlined text-[18px] text-green-500">workspace_premium</span>
          </div>
          <div className="flex items-end gap-2">
            <span className="text-3xl font-bold text-gray-800">{subs.period_count}</span>
            <span className="text-[11px] text-gray-400 mb-1">this period · ₹{subs.period_amount.toLocaleString()}</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-100 text-center">
            <div>
              <div className="text-sm font-bold text-gray-800">{subs.today_count}</div>
              <div className="text-[9px] text-gray-400 uppercase font-semibold">Today</div>
            </div>
            <div>
              <div className="text-sm font-bold text-gray-800">{subs.month_count}</div>
              <div className="text-[9px] text-gray-400 uppercase font-semibold">This Month</div>
            </div>
            <div>
              <div className="text-sm font-bold text-green-700">₹{subs.month_amount.toLocaleString()}</div>
              <div className="text-[9px] text-gray-400 uppercase font-semibold">Month Revenue</div>
            </div>
          </div>
        </div>

        {/* SAN Network Stats — missed calls with detail (webhook_crm CDR) */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm md:col-span-2">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-gray-400 uppercase font-semibold tracking-wider">Missed Calls — SAN Network (CDR)</span>
              {cdr.agent_name && (
                <span className="text-[9px] text-indigo-600 bg-indigo-50 border border-indigo-100 px-1.5 py-0.5 rounded font-semibold">{cdr.agent_name}</span>
              )}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-gray-400">
              <span>Talk: <strong className="text-gray-600">{cdr.talk_time}</strong></span>
              <span>Total: <strong className="text-gray-600">{cdr.total_duration}</strong></span>
              <span>Avg Ring: <strong className="text-gray-600">{cdr.avg_ring_seconds}s</strong></span>
            </div>
          </div>
          {cdr.recent_missed.length === 0 ? (
            <div className="flex items-center justify-center py-6 text-gray-400 text-[11px]">
              <span className="material-symbols-outlined text-base mr-1 text-emerald-400">check_circle</span>
              No missed calls in this period
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {cdr.recent_missed.map((m, i) => (
                <div key={i} className="flex items-center gap-3 py-1.5 text-[11px]">
                  <span className={`material-symbols-outlined text-sm shrink-0 ${m.call_type === 'Incoming' ? 'text-red-500' : 'text-rose-400'}`}>
                    {m.call_type === 'Incoming' ? 'phone_callback' : 'phone_missed'}
                  </span>
                  <div className="min-w-0 flex items-center gap-1.5">
                    {/* Mobile number intentionally hidden — name + TMID only */}
                    <span className="font-semibold text-gray-800 truncate">{m.user_name || 'Unknown Caller'}</span>
                    {m.user_tmid && (
                      <span className="font-mono text-[9px] text-gray-500 bg-gray-100 px-1 py-0.5 rounded shrink-0">{m.user_tmid}</span>
                    )}
                  </div>
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded shrink-0 ${m.call_type === 'Incoming' ? 'bg-red-50 text-red-600' : 'bg-rose-50 text-rose-500'}`}>
                    {m.call_type?.toUpperCase()}
                  </span>
                  <span className="text-gray-400 shrink-0">rang {m.ring_durn || '—'}</span>
                  {m.cause_txt && <span className="text-gray-300 truncate hidden lg:inline">{m.cause_txt}</span>}
                  <span className="ml-auto text-gray-400 shrink-0">{m.start_time}</span>
                  {m.user_id ? (
                    <button
                      onClick={() => handleMissedCallback(m)}
                      className="shrink-0 w-7 h-7 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center shadow-sm transition-transform active:scale-95"
                      title={`Call back ${m.user_name || 'this caller'}`}
                    >
                      <span className="material-symbols-outlined text-[14px]">call</span>
                    </button>
                  ) : (
                    <span
                      className="shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-300 flex items-center justify-center"
                      title="Number not found in users — cannot call back from here"
                    >
                      <span className="material-symbols-outlined text-[14px]">call</span>
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

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

      {isBankModalOpen && (
        <DriverForm
          onClose={() => {
            setIsBankModalOpen(false);
            triggerToast('Driver added to Matchmaking Driver Bank successfully!');
          }}
        />
      )}

    </div>
  );
};

export default DwHomeDashboard;
