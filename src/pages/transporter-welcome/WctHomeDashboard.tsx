import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetWctDashboardQuery } from '../../services/api/webCrmApi';
import GateProgressWidget from '../../shared/components/incentive/GateProgressWidget';
import { useGetGateProgressQuery, useTriggerMockConversionMutation } from '../../services/api/incentiveApi';

interface SLARow {
  id: string;
  company: string;
  tmid: string;
  registeredMinutesAgo: number;
  slaMinutesLeft: number;
}

export const WctHomeDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: realData } = useGetWctDashboardQuery();
  const { data: progress } = useGetGateProgressQuery('twc');
  const [triggerMockConversion] = useTriggerMockConversionMutation();

  // Real KPIs from WctCallerController::dashboard (transporter-retargeted DW shape)
  const kpis = realData?.data?.kpis;
  const cdr = realData?.data?.cdr_stats;
  const subs = realData?.data?.subscriptions;
  const leaderboard = realData?.data?.leaderboard;
  const callBreakdown = realData?.data?.call_breakdown ?? [];
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
      
      {/* Simulation Bar */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">Transporter Welcome calling Process</p>
          <h2 className="text-2xl font-bold text-gray-800">Transporter Connect Control</h2>
        </div>
        
        {/* Interactive Simulator */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-2 rounded-lg text-xs select-none">
          <span className="font-bold text-gray-600">Simulate:</span>
          <button 
            onClick={() => triggerMockConversion({ role: 'twc', planName: 'sp_posting' })}
            className="px-2.5 py-1 bg-white border rounded hover:bg-gray-100 transition-colors"
          >
            Simulate Conversion (+₹500 / ₹2,999 Value)
          </button>
          <button 
            onClick={() => {
              // Add a breached lead
              setSlaList(prev => [
                ...prev, 
                { id: `S_${Date.now()}`, company: 'Grover Logistics', tmid: 'TR-19208', registeredMinutesAgo: 320, slaMinutesLeft: -80 }
              ]);
            }}
            className="px-2.5 py-1 bg-white border rounded hover:bg-gray-100 transition-colors text-red-600 font-semibold"
          >
            + Add Breached SLA Lead
          </button>
        </div>
      </section>

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
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Call Performance</h3>

        {/* Assignment & Today's Funnel */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
          {[
            { label: 'Assigned', value: kpis?.assigned_total ?? 0, color: 'text-gray-800' },
            { label: 'Pending', value: kpis?.calls_pending ?? 0, color: 'text-[#FB641B]' },
            { label: 'Calls Today', value: callsToday, color: 'text-gray-800' },
            { label: 'Connected', value: connectedToday, color: 'text-[#27AE60]' },
            { label: 'Conversions', value: conversionsToday, color: 'text-[#27AE60]' },
            { label: 'Feedback Due', value: kpis?.feedback_missing ?? 0, color: 'text-red-500' },
            { label: 'Missed Calls', value: kpis?.missed_calls ?? 0, color: 'text-red-500' },
            { label: 'Talk Time', value: kpis?.call_time ?? '0h 0m', color: 'text-gray-800', isText: true },
          ].map((s, i) => (
            <div key={i} className="bg-white border border-gray-200 rounded-lg p-3 text-center shadow-sm">
              <div className={`font-bold ${s.isText ? 'text-base' : 'text-xl'} ${s.color}`}>{s.value}</div>
              <div className="text-[10px] text-gray-400 uppercase tracking-wide mt-0.5">{s.label}</div>
            </div>
          ))}
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
              <span className="text-gray-500">Missed</span><span className="font-bold text-red-500 text-right">{cdr?.missed_calls ?? 0}</span>
              <span className="text-gray-500">Incoming (missed)</span><span className="font-bold text-gray-800 text-right">{cdr?.incoming_total ?? 0} ({cdr?.incoming_missed ?? 0})</span>
              <span className="text-gray-500">Outgoing (missed)</span><span className="font-bold text-gray-800 text-right">{cdr?.outgoing_total ?? 0} ({cdr?.outgoing_missed ?? 0})</span>
              <span className="text-gray-500">Talk Time</span><span className="font-bold text-gray-800 text-right">{cdr?.talk_time ?? '0'}</span>
              <span className="text-gray-500">Avg Ring</span><span className="font-bold text-gray-800 text-right">{cdr?.avg_ring_seconds ?? 0}s</span>
            </div>
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
