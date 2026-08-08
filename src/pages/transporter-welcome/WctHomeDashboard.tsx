import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetWctDashboardQuery } from '../../services/api/webCrmApi';
import GateProgressWidget from '../../shared/components/incentive/GateProgressWidget';
import IndependenceHeaderBanner from '../../shared/components/IndependenceHeaderBanner';
import { KpiTile, WelcomeBar } from '../../shared/components/dashboard';
import { useGetGateProgressQuery } from '../../services/api/incentiveApi';

interface SLARow {
  id: string;
  company: string;
  tmid: string;
  registeredMinutesAgo: number;
  slaMinutesLeft: number;
}

type Period = 'today' | 'yesterday' | 'last_7_days' | 'this_week' | 'this_month' | 'all';

const PERIOD_TABS: { id: Period; label: string }[] = [
  { id: 'today',       label: 'Today' },
  { id: 'yesterday',   label: 'Yesterday' },
  { id: 'last_7_days', label: 'Past 7 Days' },
  { id: 'this_week',   label: 'This Week' },
  { id: 'this_month',  label: 'This Month' },
  { id: 'all',         label: 'All Time' },
];

export const WctHomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [period, setPeriod] = useState<Period>('today');

  const { data: realData } = useGetWctDashboardQuery({ period });
  const { data: progress } = useGetGateProgressQuery('twc');

  // Real KPIs from WctCallerController::dashboard (transporter-retargeted DW shape)
  const kpis = realData?.data?.kpis;
  const cdr = realData?.data?.cdr_stats;
  const subs = realData?.data?.subscriptions;
  const leaderboard = realData?.data?.leaderboard;
  const callBreakdown = realData?.data?.call_breakdown ?? [];

  // Period-aware call outcomes. The dashboard used to read only `kpis`, which
  // is today-only and has no not-connected or callback figure at all — the
  // reason those two never appeared and "Missed Calls" was standing in for
  // them. calls_summary has carried all of it from the start.
  const cs = realData?.data?.calls_summary ?? {
    total_calls: 0, unique_leads: 0, unique_connected: 0, repeat_calls: 0,
    incoming: 0, outgoing: 0, connected: 0, not_connected: 0, callback_later: 0,
    conversions: 0, connect_rate: 0, conversion_rate: 0, call_time: '0H 0M 0S',
    total_active_time: '0H 0M 0S', total_active_seconds: 0,
  };

  // False when the figures were derived from call_history_ivr because SAN's
  // network CDR had nothing — missed counts are unknown, not zero, in that mode.
  const isCdrLive = cdr?.source !== 'crm';

  const callsToday = kpis?.calls_today ?? 0;
  const connectedToday = kpis?.connected_today ?? 0;
  const conversionsToday = kpis?.subscriptions_today ?? 0;
  const todayConvRate = connectedToday > 0 ? Math.round((conversionsToday / connectedToday) * 100) : 0;

  const [slaList, setSlaList] = useState<SLARow[]>([]);

  useEffect(() => {
    const callbacks = realData?.data?.overdue_callbacks;
    if (callbacks && callbacks.length > 0) {
      setSlaList(callbacks.map(c => ({
        id: c.id.toString(),
        company: c.name,
        tmid: c.tmid,
        registeredMinutesAgo: 80,
        slaMinutesLeft: 160
      })));
    }
  }, [realData]);

  // Fetch real gate progress from reactive incentive engine
  const monthlyRevenue = progress?.accruedIncentive ?? 0;

  // Base Salary Gate
  const salaryGateThreshold = progress?.salaryGateThreshold ?? 19000;
  const isSalaryGateCrossed = progress?.isSalaryGateUnlocked ?? false;
  const remainingToSalaryGate = progress?.salaryGateRemaining ?? Math.max(0, salaryGateThreshold - monthlyRevenue);
  const salaryGatePercent = progress?.salaryGatePercentage ?? 0;

  // Incentive Gate
  const incentiveGateThreshold = progress?.incentiveGateThreshold ?? 28000;
  const isIncentiveGateCrossed = progress?.isIncentiveGateUnlocked ?? false;
  const remainingToIncentiveGate = progress?.incentiveGateRemaining ?? Math.max(0, incentiveGateThreshold - monthlyRevenue);
  const incentiveGatePercent = progress?.incentiveGatePercentage ?? 0;

  // Ticking SLA countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSlaList(prevList => 
        prevList.map(item => ({
          ...item,
          registeredMinutesAgo: item.registeredMinutesAgo + 1,
          slaMinutesLeft: item.slaMinutesLeft - 1
        }))
      );
    }, 60000); // ticks every minute
    return () => clearInterval(timer);
  }, []);

  const formatMinutes = (mins: number) => {
    if (mins < 0) {
      const positiveMins = Math.abs(mins);
      const h = Math.floor(positiveMins / 60);
      const m = positiveMins % 60;
      return `${h}h ${m}m overdue`;
    }
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m left`;
  };

  const getSLATextColor = (mins: number) => {
    if (mins < 0) return 'text-red-600 font-extrabold';
    if (mins <= 60) return 'text-red-500 font-bold'; // <1hr
    if (mins <= 180) return 'text-orange-500 font-bold'; // 1-3hrs
    return 'text-[#27AE60] font-semibold'; // >3hrs
  };

  const handleCallLead = (lead: SLARow) => {
    // Remove from SLA watch list once call starts
    setSlaList(prev => prev.filter(item => item.id !== lead.id));
    
    // Navigate directly to active call with lead context
    navigate('/wct/wct-active-call-focus', {
      state: {
        name: lead.company,
        tmid: lead.tmid,
        registeredTime: `${Math.floor(lead.registeredMinutesAgo / 60)}h ${lead.registeredMinutesAgo % 60}m ago`,
        slaLeft: lead.slaMinutesLeft
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
      
      {/* Independence Day Header Banner */}
      <IndependenceHeaderBanner 
        title="Transporter Welcome Control Center"
        subtitle="Empowering logistics partners with nationwide driver onboarding & verification."
      />

      {/* The two "Simulate" buttons that used to live here injected a fake
          conversion and a fake breached-SLA lead into a live desk dashboard.
          Removed — an agent cannot tell invented rows from real ones. */}
      <WelcomeBar
        process="Transporter Welcome Calling Process"
        name={realData?.data?.caller?.name || 'Agent'}
        date={new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
      />

      {/* SLA WATCH STRIP (sticky-feeling dedicated horizontal strip) */}
      <section className={`border rounded-xl p-4 shadow-sm ${
        slaList.length > 0 ? 'bg-[#FFF4EC] border-[#FB641B]' : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-[#FB641B] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] animate-pulse">alarm</span>
            SLA WATCH
          </h3>
          {slaList.length === 0 && (
            <span className="text-xs text-[#27AE60] font-bold flex items-center gap-1">
              ✓ All on track
            </span>
          )}
        </div>

        {slaList.length > 0 ? (
          <div className="divide-y divide-orange-100/50">
            {slaList.map((lead) => (
              <div key={lead.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{lead.company}</span>
                  <span className="font-mono bg-white text-gray-400 px-1 border border-orange-100 rounded">{lead.tmid}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">Registered {Math.floor(lead.registeredMinutesAgo / 60)}h {lead.registeredMinutesAgo % 60}m ago</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={getSLATextColor(lead.slaMinutesLeft)}>
                    {lead.slaMinutesLeft < 0 ? '⚠️ SLA BREACHED — ' : 'SLA: '}
                    {formatMinutes(lead.slaMinutesLeft)}
                  </span>
                  
                  <button
                    onClick={() => handleCallLead(lead)}
                    className="bg-[#FB641B] hover:bg-[#e4540d] text-white px-3.5 py-1.5 rounded-lg font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">phone</span> Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic py-2">No SLA-urgent registrations in queue right now.</p>
        )}
      </section>

      {/* KPI Cards Row (4 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1 — Base Salary Gate */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[150px]">
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
            <div className="w-full h-2 bg-gray-150 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isSalaryGateCrossed ? 'bg-[#27AE60]' : 'bg-[#FB641B]'}`} 
                style={{ width: `${salaryGatePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2 — Incentives Gate */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[150px]">
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
                className={`h-full rounded-full transition-all duration-500 ${isIncentiveGateCrossed ? 'bg-[#27AE60]' : 'bg-[#FB641B]'}`} 
                style={{ width: `${incentiveGatePercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 3 — Today's Stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[150px]">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">Today's Stats</span>
            <div className="text-2xl font-bold text-gray-850 mt-1">{callsToday} <span className="text-xs text-gray-400 font-normal">calls</span></div>
            <div className="text-xs text-gray-500 mt-2 space-y-0.5">
              <div>· {connectedToday} connected</div>
              <div>· {conversionsToday} conversions</div>
            </div>
          </div>
        </div>

        {/* Card 4 — Conversion Rate (Today) */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[150px]">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">Conversion Rate</span>
            <div className="text-2xl font-bold text-[#27AE60] mt-1">{todayConvRate}%</div>
            <div className="text-xs text-gray-500 font-semibold mt-1">Conversions per connected call today</div>
          </div>
        </div>

      </div>

      {/* Incentive Gate Progress Widget */}
      <GateProgressWidget />

      {/* ── Wide-range Call Data (DWC parity) ── */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Call Performance</h3>

          {/* The figures below come from calls_summary, which is period-aware.
              Without this selector the dashboard could only ever say "today". */}
          <div className="flex items-center gap-2 overflow-x-auto">
            <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider shrink-0">Period:</span>
            <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
              {PERIOD_TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setPeriod(tab.id)}
                  className={`px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all border-r border-gray-200 last:border-r-0 ${
                    period === tab.id ? 'bg-[#1A5276] text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* The real call funnel for the selected period. Every value is a
            distinct outcome of call_history_ivr.call_status, so they add up:
            connected + not connected + callback = total. */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-2 tm-stagger">
          <KpiTile label="Total Calls"   value={cs.total_calls}   icon="phone"        tone="slate"
                   sub={`${cs.repeat_calls} repeat dials`} />
          <KpiTile label="Unique Leads"  value={cs.unique_leads}  icon="group"        tone="indigo"
                   sub={`${cs.unique_connected} reached`} />
          <KpiTile label="Connected"     value={cs.connected}     icon="check_circle" tone="emerald"
                   sub={`${cs.connect_rate}% connect rate`} />
          <KpiTile label="Not Connected" value={cs.not_connected} icon="cancel"       tone="red"
                   sub="did not reach the lead" />
          <KpiTile label="Call Backs"    value={cs.callback_later} icon="schedule_send" tone="amber"
                   sub="scheduled to retry" />
          <KpiTile label="Talk Time"     value={cs.call_time || '0H 0M 0S'} icon="timer" tone="orange"
                   valueSize="text-lg" sub="connected only" />
          {/* Handling time — every call worked, dial through disposition. Talk
              Time is 0 on calls that never connected, so on its own it credits
              nothing for a number that rang out. */}
          <KpiTile label="Total Active Time" value={cs.total_active_time || '0H 0M 0S'} icon="hourglass_bottom"
                   tone="indigo" valueSize="text-lg" sub="dial → disposition" />
        </div>

        {/* Direction + assignment, kept separate from the outcome funnel above
            so the two can't be read as one series. */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 tm-stagger">
          <KpiTile label="Assigned"     value={kpis?.assigned_total ?? 0}   icon="assignment_ind" tone="slate" />
          <KpiTile label="Pending"      value={kpis?.calls_pending ?? 0}    icon="pending_actions" tone="orange" />
          <KpiTile label="Outgoing"     value={cs.outgoing}                 icon="call_made"      tone="blue" />
          <KpiTile label="Incoming"     value={cs.incoming}                 icon="call_received"  tone="sky" />
          <KpiTile label="Conversions"  value={cs.conversions}              icon="trending_up"    tone="emerald"
                   sub={cs.connected > 0 ? `${cs.conversion_rate}% of connected` : undefined} />
          <KpiTile label="Feedback Due" value={kpis?.feedback_missing ?? 0} icon="rate_review"    tone="red" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* CDR panel */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">call</span> CDR Summary (Today)
            </h4>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <span className="text-gray-500">Total Calls</span><span className="font-bold text-gray-800 text-right">{cdr?.total_calls ?? 0}</span>
              <span className="text-gray-500">Connected</span><span className="font-bold text-[#27AE60] text-right">{cdr?.connected ?? 0}</span>
              {/* Missed = a call nobody answered, which ONLY the network CDR
                  sees. In the CRM fallback (source 'crm') that is genuinely
                  unknown, so it shows "—" instead of borrowing the
                  not-connected count and calling it missed. */}
              <span className="text-gray-500">Missed</span>
              <span className="font-bold text-red-500 text-right">
                {isCdrLive ? (cdr?.missed_calls ?? 0) : '—'}
              </span>
              <span className="text-gray-500">Not Connected</span><span className="font-bold text-red-500 text-right">{cs.not_connected}</span>
              <span className="text-gray-500">Call Backs</span><span className="font-bold text-amber-600 text-right">{cs.callback_later}</span>
              <span className="text-gray-500">Incoming (missed)</span><span className="font-bold text-gray-800 text-right">{cdr?.incoming_total ?? 0} ({isCdrLive ? (cdr?.incoming_missed ?? 0) : '—'})</span>
              <span className="text-gray-500">Outgoing (missed)</span><span className="font-bold text-gray-800 text-right">{cdr?.outgoing_total ?? 0} ({isCdrLive ? (cdr?.outgoing_missed ?? 0) : '—'})</span>
              <span className="text-gray-500">Talk Time</span><span className="font-bold text-gray-800 text-right">{cdr?.talk_time ?? '0'}</span>
              <span className="text-gray-500">Avg Ring</span><span className="font-bold text-gray-800 text-right">{cdr?.avg_ring_seconds ?? 0}s</span>
            </div>
            {/* These are counts only. The Incoming Calls screen lists every
                incoming call behind them, with the caller's full lead record. */}
            <button
              onClick={() => navigate('/wct/wct-incoming-calls')}
              className="mt-3 w-full inline-flex items-center justify-center gap-1 text-[11px] font-bold text-sky-600 border border-sky-200 bg-sky-50 hover:bg-sky-100 rounded-lg py-1.5 transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">call_received</span>
              View incoming call history
            </button>
          </div>

          {/* Subscriptions panel */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">payments</span> Subscriptions
            </h4>
            <div className="grid grid-cols-2 gap-y-2 text-xs">
              <span className="text-gray-500">Today count</span><span className="font-bold text-gray-800 text-right">{subs?.today_count ?? 0}</span>
              <span className="text-gray-500">Today revenue</span><span className="font-bold text-[#27AE60] text-right">₹{(subs?.today_amount ?? 0).toLocaleString()}</span>
              <span className="text-gray-500">Month count</span><span className="font-bold text-gray-800 text-right">{subs?.month_count ?? 0}</span>
              <span className="text-gray-500">Month revenue</span><span className="font-bold text-[#27AE60] text-right">₹{(subs?.month_amount ?? 0).toLocaleString()}</span>
              <span className="text-gray-500">Monthly (KPI)</span><span className="font-bold text-gray-800 text-right">₹{(kpis?.monthly_revenue ?? 0).toLocaleString()}</span>
            </div>
          </div>

          {/* Leaderboard + breakdown */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">leaderboard</span> Rank & Mix
            </h4>
            <div className="text-center mb-3">
              <div className="text-2xl font-bold text-[#FB641B]">#{leaderboard?.my_rank ?? '—'}</div>
              <div className="text-[10px] text-gray-400 uppercase">of {leaderboard?.total_peers ?? 0} peers today</div>
            </div>
            <div className="space-y-1 text-xs max-h-[120px] overflow-y-auto">
              {callBreakdown.length > 0 ? callBreakdown.map((b, i) => (
                <div key={i} className="flex justify-between border-t border-gray-100 pt-1">
                  <span className="text-gray-500 truncate">{b.process || 'Other'}</span>
                  <span className="font-bold text-gray-800">{b.total}</span>
                </div>
              )) : <p className="text-gray-400 italic text-center">No calls logged yet.</p>}
            </div>
          </div>
        </div>
      </section>

      {/* Secondary Dashboard Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        
        {/* D+7 Upsell Due (Left, 1/3, orange bordered) */}
        <div className="bg-white border-l-4 border-[#FB641B] border-t border-r border-b border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#FB641B] uppercase tracking-wider mb-2">D+7 Upsell Due</h3>
            <p className="text-xs text-gray-500 font-semibold mb-2">3 free-plan transporters ready for upsell today</p>
            
            <div className="space-y-2 mt-2 text-xs">
              {[
                { name: 'Gopal Roadways', freeSince: '12 Jun' },
                { name: 'Karan Carriers', freeSince: '11 Jun' }
              ].map((up, idx) => (
                <div key={idx} className="flex justify-between items-center bg-orange-50/30 p-2 border border-orange-100 rounded">
                  <div>
                    <div className="font-bold text-gray-800">{up.name}</div>
                    <div className="text-[10px] text-gray-500">Free since: {up.freeSince} (7 days ago)</div>
                  </div>
                  <button 
                    onClick={() => navigate('/wct/wct-d7-upsell-queue')}
                    className="px-2 py-1 bg-[#FB641B] hover:bg-[#e4540d] text-white text-[10px] font-bold rounded shadow-sm"
                  >
                    Upsell Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Missed Callbacks (Center, 1/3) */}
        <div className="bg-white border-l-4 border-red-500 border-t border-r border-b border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">phone_callback</span> Missed Callbacks
            </h3>
            <div className="text-xs text-[#27AE60] font-bold flex items-center justify-center h-24 bg-green-50 rounded-lg">
              All callbacks on schedule ✓
            </div>
          </div>
        </div>

        {/* First-Call SLA Compliance (Right, 1/3) */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">First-Call SLA Compliance</h3>
            <div className="text-2xl font-bold text-[#FB641B] mt-1">91.3%</div>
            <div className="text-xs text-gray-500 mt-1">% of TR leads called within 4 business hours</div>
            
            <div className="mt-3 flex justify-between items-center text-[11px] border-t border-gray-100 pt-2 text-gray-500">
              <span className="text-[#27AE60] font-bold">↑ 3.1% vs last month</span>
              <span>Target: 100%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WctHomeDashboard;
