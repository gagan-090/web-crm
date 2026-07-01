import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetTlDashboardQuery, useGetTlRosterQuery, useGetTargetQuery, useSetTargetMutation } from '../../services/api/webCrmApi';

interface TeamMember {
  name: string;
  roleLabel: string;
  roleType: 'primary' | 'backup' | 'special' | 'matchmaker';
  status: 'On Call' | 'Idle' | 'Break' | 'Offline';
  calls: number;
  revenue: number;
  queueDepth: number;
  convRate: string;
  avatarColor: string;
}

interface CallbackItem {
  id: string;
  callerName: string;
  leadName: string;
  time: string;
  status: 'Pending' | 'Done' | 'Overdue';
}

export const TlOverviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Toggle between 'dw' and 'tr-mm'
  const [tlMode, setTlMode] = useState<'dw' | 'tr-mm'>('dw');
  
  // Dashboard state to simulate resolving untagged calls
  const [untaggedCount, setUntaggedCount] = useState(3);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Targets states
  const [thTargets, setThTargets] = useState<{
    tldwSalesTarget: number;
    tldwCampaignTarget: number;
    tlwctSalesTarget: number;
    tlwctCampaignTarget: number;
  }>({
    tldwSalesTarget: 200000,
    tldwCampaignTarget: 1000,
    tlwctSalesTarget: 550000,
    tlwctCampaignTarget: 2500
  });

  const [allocationMode, setAllocationMode] = useState<'equal' | 'manual'>('equal');
  const [manualTargets, setManualTargets] = useState<Record<string, { sales: string; campaign: string }>>({});

  const { data: realDashboard } = useGetTlDashboardQuery();
  const { data: realRosterData } = useGetTlRosterQuery();

  // Backend target sync
  const { data: thTargetsData } = useGetTargetQuery('tm_th_tl_targets');
  const { data: callerTargetsData } = useGetTargetQuery(`tm_tl_caller_targets_${tlMode}`);
  const [saveTarget] = useSetTargetMutation();

  useEffect(() => {
    if (thTargetsData?.value) {
      setThTargets({
        tldwSalesTarget: thTargetsData.value.tldwSalesTarget || 200000,
        tldwCampaignTarget: thTargetsData.value.tldwCampaignTarget || 1000,
        tlwctSalesTarget: thTargetsData.value.tlwctSalesTarget || 550000,
        tlwctCampaignTarget: thTargetsData.value.tlwctCampaignTarget || 2500
      });
    }
  }, [thTargetsData]);

  useEffect(() => {
    if (callerTargetsData?.value) {
      const parsed = callerTargetsData.value;
      const formatted: Record<string, { sales: string; campaign: string }> = {};
      Object.keys(parsed).forEach(name => {
        formatted[name] = {
          sales: parsed[name].sales.toString(),
          campaign: parsed[name].campaign.toString()
        };
      });
      setManualTargets(formatted);
    } else {
      setManualTargets({});
    }
  }, [callerTargetsData]);

  useEffect(() => {
    // Load saved allocation mode
    const savedMode = localStorage.getItem(`tm_tl_allocation_mode_${tlMode}`);
    if (savedMode === 'manual' || savedMode === 'equal') {
      setAllocationMode(savedMode as 'equal' | 'manual');
    } else {
      setAllocationMode('equal');
    }
  }, [tlMode]);

  const kpis = realDashboard?.data?.kpis;
  const activeCallersCount = (kpis as any)?.activeCallers ?? 7;
  const slaBreachesCount = (kpis as any)?.slaBreaches ?? 12;
  const callsTodayCount = (kpis as any)?.callsToday ?? 324;
  const unresolvedCallsCount = (kpis as any)?.unresolvedCalls ?? 5;

  // Callbacks list
  const [callbacks, setCallbacks] = useState<CallbackItem[]>([
    { id: 'c1', callerName: 'Rahul S.', leadName: 'Suresh Yadav (DR-48291)', time: '11:30 AM', status: 'Overdue' },
    { id: 'c2', callerName: 'Sonia R.', leadName: 'Gati Agent (TR-48294)', time: '02:00 PM', status: 'Pending' },
    { id: 'c3', callerName: 'Aman K.', leadName: 'BlueDart Partner (TR-48293)', time: '03:15 PM', status: 'Pending' },
    { id: 'c4', callerName: 'Vikram A.', leadName: 'Amit Singh (DR-48293)', time: '04:00 PM', status: 'Pending' }
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMarkCallbackDone = (id: string, name: string) => {
    setCallbacks(prev => prev.map(cb => cb.id === id ? { ...cb, status: 'Done' } : cb));
    triggerToast(`Callback for ${name} marked Done (TL override logged)`);
  };

  const handleResolveUntagged = () => {
    setUntaggedCount(0);
    triggerToast('All calls auto-resolved/tagged successfully!');
  };

  // Roster mapping
  const rawRoster = realRosterData?.roster && realRosterData.roster.length > 0 ? realRosterData.roster : null;
  const activeDirectReports: TeamMember[] = rawRoster ? rawRoster.map((caller: any) => ({
    name: caller.name,
    roleLabel: `${caller.role} Caller`,
    roleType: caller.role.toLowerCase() === 'dw' ? 'primary' : caller.role.toLowerCase() === 'wct' ? 'primary' : caller.role.toLowerCase() === 'mm' ? 'matchmaker' : 'special',
    status: caller.status === 'READY' ? 'Idle' : (caller.status === 'ON_BREAK' ? 'Break' : (caller.status === 'OFFLINE' ? 'Offline' : 'On Call')),
    calls: caller.callsMade,
    revenue: caller.role.toLowerCase() === 'dw' ? 2400 : 4000,
    queueDepth: caller.queueDepth,
    convRate: caller.compliance || '6.3%',
    avatarColor: caller.role.toLowerCase() === 'dw' ? 'bg-teal-500' : 'bg-indigo-500'
  })) : [];

  // Caller Lists
  const dwTeam: TeamMember[] = activeDirectReports.length > 0 ? activeDirectReports.filter(c => c.roleLabel.includes('DW') || c.roleLabel.includes('SC')) : [
    { name: 'Rahul S.', roleLabel: 'Primary Caller', roleType: 'primary', status: 'On Call', calls: 32, revenue: 2400, queueDepth: 28, convRate: '6.3%', avatarColor: 'bg-teal-500' },
    { name: 'Sonia R.', roleLabel: 'Primary Caller', roleType: 'primary', status: 'On Call', calls: 28, revenue: 1900, queueDepth: 36, convRate: '7.1%', avatarColor: 'bg-indigo-500' },
    { name: 'Aman K.', roleLabel: 'Primary Caller', roleType: 'primary', status: 'Idle', calls: 24, revenue: 1500, queueDepth: 14, convRate: '8.3%', avatarColor: 'bg-emerald-500' },
    { name: 'Priya P.', roleLabel: 'Primary Caller', roleType: 'primary', status: 'Break', calls: 18, revenue: 1200, queueDepth: 22, convRate: '5.5%', avatarColor: 'bg-pink-500' },
    { name: 'Vikram A.', roleLabel: 'Backup Caller', roleType: 'backup', status: 'Idle', calls: 12, revenue: 400, queueDepth: 8, convRate: '4.2%', avatarColor: 'bg-amber-500' },
    { name: 'Kunal S.', roleLabel: 'Backup Caller', roleType: 'backup', status: 'Offline', calls: 0, revenue: 0, queueDepth: 0, convRate: '0.0%', avatarColor: 'bg-gray-400' },
    { name: 'Aditi S.', roleLabel: 'Special Categories', roleType: 'special', status: 'On Call', calls: 8, revenue: 3100, queueDepth: 5, convRate: '25.0%', avatarColor: 'bg-purple-500' }
  ];

  const trMmTeam: TeamMember[] = activeDirectReports.length > 0 ? activeDirectReports.filter(c => c.roleLabel.includes('WCT') || c.roleLabel.includes('MM')) : [
    { name: 'Alex R.', roleLabel: 'Primary TR Caller', roleType: 'primary', status: 'On Call', calls: 14, revenue: 4000, queueDepth: 18, convRate: '14.2%', avatarColor: 'bg-teal-500' },
    { name: 'Sarah C.', roleLabel: 'Primary TR Caller', roleType: 'primary', status: 'On Call', calls: 12, revenue: 1999, queueDepth: 28, convRate: '16.6%', avatarColor: 'bg-indigo-500' },
    { name: 'Marcus T.', roleLabel: 'Primary TR Caller', roleType: 'primary', status: 'Break', calls: 8, revenue: 0, queueDepth: 36, convRate: '0.0%', avatarColor: 'bg-rose-500' },
    { name: 'Elena R.', roleLabel: 'Backup TR Caller', roleType: 'backup', status: 'Offline', calls: 0, revenue: 0, queueDepth: 0, convRate: '0.0%', avatarColor: 'bg-gray-400' },
    { name: 'Rohit K.', roleLabel: 'Matchmaking Agent', roleType: 'matchmaker', status: 'On Call', calls: 22, revenue: 8000, queueDepth: 6, convRate: '27.2%', avatarColor: 'bg-purple-500' },
    { name: 'Sneha M.', roleLabel: 'Matchmaking Agent', roleType: 'matchmaker', status: 'Idle', calls: 18, revenue: 6000, queueDepth: 4, convRate: '22.2%', avatarColor: 'bg-pink-500' },
    { name: 'Javed K.', roleLabel: 'Matchmaking Agent', roleType: 'matchmaker', status: 'On Call', calls: 15, revenue: 3000, queueDepth: 5, convRate: '13.3%', avatarColor: 'bg-emerald-500' },
    { name: 'Deepak G.', roleLabel: 'Matchmaking Agent', roleType: 'matchmaker', status: 'Idle', calls: 12, revenue: 0, queueDepth: 3, convRate: '0.0%', avatarColor: 'bg-amber-500' }
  ];

  const currentTeam = tlMode === 'dw' ? dwTeam : trMmTeam;

  const tlSalesTarget = tlMode === 'dw' ? thTargets.tldwSalesTarget : thTargets.tlwctSalesTarget;
  const tlCampaignTarget = tlMode === 'dw' ? thTargets.tldwCampaignTarget : thTargets.tlwctCampaignTarget;

  const sumSales = currentTeam.reduce((acc, member) => {
    if (member.status === 'Offline') return acc;
    if (allocationMode === 'equal') {
      const activeCount = currentTeam.filter(c => c.status !== 'Offline').length || 1;
      return acc + Math.round(tlSalesTarget / activeCount);
    } else {
      const val = manualTargets[member.name]?.sales;
      return acc + (val ? (parseFloat(val) || 0) : 0);
    }
  }, 0);

  const sumCampaign = currentTeam.reduce((acc, member) => {
    if (member.status === 'Offline') return acc;
    if (allocationMode === 'equal') {
      const activeCount = currentTeam.filter(c => c.status !== 'Offline').length || 1;
      return acc + Math.round(tlCampaignTarget / activeCount);
    } else {
      const val = manualTargets[member.name]?.campaign;
      return acc + (val ? (parseInt(val) || 0) : 0);
    }
  }, 0);

  const achievedSales = tlMode === 'dw' ? 124000 : 312000;
  const salesPct = Math.min(100, Math.round((achievedSales / tlSalesTarget) * 100));

  const getCallerTargets = (member: TeamMember) => {
    if (member.status === 'Offline') {
      return { sales: 0, campaign: 0 };
    }
    
    if (allocationMode === 'equal') {
      const activeCount = currentTeam.filter(c => c.status !== 'Offline').length || 1;
      return {
        sales: Math.round(tlSalesTarget / activeCount),
        campaign: Math.round(tlCampaignTarget / activeCount)
      };
    } else {
      // manual mode
      const key = `tm_tl_caller_targets_${tlMode}`;
      const saved = localStorage.getItem(key);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          if (parsed[member.name]) {
            return {
              sales: parsed[member.name].sales || 0,
              campaign: parsed[member.name].campaign || 0
            };
          }
        } catch (e) {}
      }
      
      // Fallback to manualTargets state or split
      const inState = manualTargets[member.name];
      const activeCount = currentTeam.filter(c => c.status !== 'Offline').length || 1;
      return {
        sales: inState ? (parseFloat(inState.sales) || 0) : Math.round(tlSalesTarget / activeCount),
        campaign: inState ? (parseInt(inState.campaign) || 0) : Math.round(tlCampaignTarget / activeCount)
      };
    }
  };

  const handleCallerClick = (member: TeamMember) => {
    navigate('/tl/tl-caller-profile-detail', {
      state: {
        callerName: member.name,
        roleLabel: member.roleLabel,
        roleType: member.roleType,
        status: member.status,
        calls: member.calls,
        revenue: member.revenue,
        queueDepth: member.queueDepth,
        convRate: member.convRate,
        tlMode: tlMode
      }
    });
  };

  return (
    <div className="space-y-4 max-w-7xl mx-auto w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)] relative bg-white">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#F39C12]"></span>
          {toastMessage}
        </div>
      )}

      {/* Top Banner & Mode Toggle */}
      <div className="flex justify-between items-center bg-white p-3 border border-gray-200 rounded-xl shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Team Leader Management Console</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Real-time team oversight, rebalancing, and compliance monitoring</p>
        </div>

        {/* Amber Badge Toggle */}
        <button
          onClick={() => {
            const nextMode = tlMode === 'dw' ? 'tr-mm' : 'dw';
            setTlMode(nextMode);
            triggerToast(`Switched workspace simulation to ${nextMode === 'dw' ? 'Driver Welcome' : 'Transporter + Matchmaking'}`);
          }}
          className="bg-[#F39C12] hover:bg-[#e08e0b] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all active:scale-95 flex items-center gap-1.5"
          title="Click to toggle Team Leader role datasets"
        >
          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          <span>TL — {tlMode === 'dw' ? 'Driver Welcome' : 'Transporter + Matchmaking'}</span>
        </button>
      </div>

      {/* PERSISTENT ALERT BANNERS */}
      <section className="space-y-2">
        {/* Banner 1 - EOD Tagging Compliance */}
        {untaggedCount > 0 ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-xs font-bold flex justify-between items-center shadow-sm">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-red-600 text-[18px]">warning</span>
              ⚠ {untaggedCount} calls untagged across your team. Resolve before 6 PM.
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/tl/tl-daily-wrap-up-panel')} 
                className="underline text-red-800 hover:text-red-950 font-extrabold"
              >
                [View Untagged]
              </button>
              <button 
                onClick={handleResolveUntagged} 
                className="bg-red-600 text-white px-2 py-0.5 rounded hover:bg-red-700 font-bold"
              >
                Auto-Tag CDR &lt;5s
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
            ✓ All calls tagged — EOD compliance 100% clean
          </div>
        )}

        {/* Banner 2 - Role specific alerts */}
        {tlMode === 'dw' ? (
          /* DW Funnel Escalation alert */
          <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2.5 rounded-lg text-xs font-bold flex justify-between items-center shadow-sm">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-purple-600 text-[18px]">explore</span>
              2 leads ready for Funnel escalation (NR ×3 or in queue &gt;3 days) — assign before EOD.
            </span>
            <button 
              onClick={() => navigate('/tl/tl-lead-queue-manager')} 
              className="underline text-purple-800 hover:text-purple-950 font-extrabold"
            >
              [View Funnel Leads →]
            </button>
          </div>
        ) : (
          /* TR+MM SLA Alert Banners */
          <div className="space-y-1">
            <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2.5 rounded-lg text-xs font-bold flex justify-between items-center shadow-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-orange-600 text-[18px]">alarm</span>
                TR-12094 has been in queue 2h 47m without first call. First-Call SLA at risk!
              </span>
              <button 
                onClick={() => navigate('/tl/tl-lead-queue-manager')} 
                className="underline text-orange-800 hover:text-orange-950 font-extrabold"
              >
                [Assign Now →]
              </button>
            </div>
            
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-xs font-bold flex justify-between items-center shadow-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-red-600 text-[18px]">priority_high</span>
                JD-12034 Super Premium — 1 day to SLA breach. Matchmaking queue delayed!
              </span>
              <button 
                onClick={() => navigate('/mm/tl-matchmaking-job-board')} 
                className="underline text-red-800 hover:text-red-950 font-extrabold"
              >
                [View Job Board →]
              </button>
            </div>
          </div>
        )}
      </section>

      {/* DUAL-QUEUE HEADER STRIP (Only for TR+MM) */}
      {tlMode === 'tr-mm' && (
        <div className="grid grid-cols-2 gap-4 bg-orange-50/20 border border-orange-100 rounded-xl p-3 select-none text-xs">
          <div className="border-r border-orange-100 pr-3 space-y-1">
            <div className="flex justify-between font-bold text-[#FB641B]">
              <span>TRANSPORTER WELCOME</span>
              <span>Target: ₹2,00,000</span>
            </div>
            <div className="flex justify-between text-gray-500 font-semibold text-[11px]">
              <span>Achieved: ₹1,12,000 (56.0%)</span>
              <span>SLA Compliance: 91.3%</span>
            </div>
          </div>
          <div className="pl-3 space-y-1">
            <div className="flex justify-between font-bold text-purple-700">
              <span>MATCHMAKING ASSIGNMENT</span>
              <span>Target: ₹3,50,000</span>
            </div>
            <div className="flex justify-between text-gray-500 font-semibold text-[11px]">
              <span>Achieved: ₹2,00,000 (57.1%)</span>
              <span>SLA Compliance: 91.7%</span>
            </div>
          </div>
        </div>
      )}

      {/* KPI CARDS ROW (4 cards) */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Team Revenue */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Team Revenue Progress</span>
            <div className="text-xl font-extrabold text-gray-800 mt-1">
              ₹{achievedSales.toLocaleString()}
              <span className="text-xs font-normal text-gray-400"> / ₹{tlSalesTarget.toLocaleString()}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#F39C12] rounded-full" 
                style={{ width: `${salesPct}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-semibold mt-1">
              <span>{salesPct}% achieved</span>
              <span>11 days remaining</span>
            </div>
          </div>
        </div>

        {/* Card 2: Team Conversion Rate */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Team Conversion Rate</span>
            {tlMode === 'dw' ? (
              <div className="text-xl font-extrabold text-[#D35400] mt-1">
                4.8% <span className="text-xs font-semibold text-gray-400">vs ≥5% target</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1 mt-1 text-[11px]">
                <div>
                  <span className="text-gray-400 block font-semibold">TR Rate:</span>
                  <span className="font-bold text-[#FB641B]">13.1% <span className="text-[9px] font-normal text-gray-400">(≥12%)</span></span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">MM Placed:</span>
                  <span className="font-bold text-purple-700">23 <span className="text-[9px] font-normal text-gray-400">(tgt 55)</span></span>
                </div>
              </div>
            )}
          </div>
          <div className="text-[10px] text-gray-400 font-semibold mt-3 pt-1 border-t border-gray-50">
            {tlMode === 'dw' ? '⚠️ Under-target threshold by 0.2%' : '⚡ Matchmaking pipeline solid'}
          </div>
        </div>

        {/* Card 3: Calls Today */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Calls Today (Team Aggregate)</span>
            <div className="text-xl font-extrabold text-gray-800 mt-1">
              {callsTodayCount} <span className="text-xs font-normal text-gray-400">Total calls</span>
            </div>
          </div>
          <div className="text-[10px] text-gray-500 font-semibold mt-3 space-y-0.5">
            {tlMode === 'dw' ? (
              <div>{unresolvedCallsCount} unresolved calls</div>
            ) : (
              <div>34 TR calls · 61 MM calls · {slaBreachesCount} SLA breaches</div>
            )}
          </div>
        </div>

        {/* Card 4: Team Status Snapshot */}
        <div 
          onClick={() => navigate('/tl/tl-real-time-monitor')}
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#F39C12] transition-colors"
        >
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Team Roster Snapshot</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="bg-green-50 text-green-700 border border-green-100 text-[9px] font-bold px-1.5 py-0.5 rounded">
                {activeCallersCount} ACTIVE
              </span>
              <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                2 IDLE
              </span>
              <span className="bg-yellow-50 text-yellow-700 border border-yellow-100 text-[9px] font-bold px-1.5 py-0.5 rounded">
                1 BREAK
              </span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-[#F39C12] mt-3 hover:underline flex items-center gap-0.5">
            Go to Control Room <span className="material-symbols-outlined text-[12px] font-bold">arrow_forward</span>
          </span>
        </div>
      </section>

      {/* CAMPAIGN PERFORMANCE HUB */}
      <section className="bg-white border border-orange-100 rounded-xl p-4 shadow-sm space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-orange-600 text-lg">campaign</span>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Campaign Performance Hub ({tlMode === 'dw' ? 'Driver Welcome' : 'Transporter Welcome'})
            </h3>
          </div>
          <span className="text-[10px] bg-red-105 text-red-800 font-extrabold px-2 py-0.5 rounded-full animate-pulse flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-red-600"></span> Live Campaigns Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {/* Card 1: Leads Received */}
          <div className="bg-white border border-gray-150 rounded-lg p-3 shadow-xs">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Leads Received</span>
            <div className="text-lg font-extrabold text-gray-800 mt-1">
              {tlMode === 'dw' ? '1,420' : '840'}
              <span className="text-[10px] font-normal text-green-600 ml-1.5">↑ 12% today</span>
            </div>
            <div className="text-[9px] text-gray-400 mt-2 flex justify-between">
              <span>Meta Ads: {tlMode === 'dw' ? '820' : '450'}</span>
              <span>Google: {tlMode === 'dw' ? '410' : '230'}</span>
            </div>
          </div>

          {/* Card 2: Coverage / Called */}
          <div className="bg-white border border-gray-150 rounded-lg p-3 shadow-xs">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Call Coverage</span>
            <div className="text-lg font-extrabold text-gray-800 mt-1">
              {tlMode === 'dw' ? '85.2%' : '78.5%'}
              <span className="text-[10px] font-normal text-gray-400 ml-1">({tlMode === 'dw' ? '1,210' : '660'} called)</span>
            </div>
            <div className="w-full h-1 bg-gray-100 rounded-full mt-2 overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: tlMode === 'dw' ? '85.2%' : '78.5%' }}></div>
            </div>
          </div>

          {/* Card 3: Conversion Rate */}
          <div className="bg-white border border-gray-150 rounded-lg p-3 shadow-xs">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Campaign Conv. Rate</span>
            <div className="text-lg font-extrabold text-orange-600 mt-1">
              {tlMode === 'dw' ? '14.2%' : '18.5%'}
              <span className="text-[10px] font-normal text-gray-400 ml-1">tgt 12%</span>
            </div>
            <div className="text-[9px] text-gray-400 mt-2 flex justify-between">
              <span>Meta: {tlMode === 'dw' ? '12.8%' : '16.2%'}</span>
              <span>Google: {tlMode === 'dw' ? '17.1%' : '21.0%'}</span>
            </div>
          </div>

          {/* Card 4: Lead Quality Rating */}
          <div className="bg-white border border-gray-150 rounded-lg p-3 shadow-xs">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Lead Quality Score</span>
            <div className="text-lg font-extrabold text-yellow-600 mt-1 flex items-center gap-1">
              <span>{tlMode === 'dw' ? '3.8' : '4.1'}</span>
              <span className="text-xs text-gray-400">/ 5.0</span>
              <div className="flex text-yellow-500 text-xs ml-1">
                {'★'.repeat(4)}{'☆'.repeat(1)}
              </div>
            </div>
            <div className="text-[9px] text-gray-400 mt-2">
              Based on {tlMode === 'dw' ? '420' : '210'} agent disposition ratings
            </div>
          </div>

          {/* Card 5: Cost per Conversion */}
          <div className="bg-white border border-gray-150 rounded-lg p-3 shadow-xs">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider block">Cost per Conversion</span>
            <div className="text-lg font-extrabold text-purple-600 mt-1">
              {tlMode === 'dw' ? '₹142' : '₹380'}
              <span className="text-[10px] font-normal text-green-600 ml-1">↓ 8.3% MoM</span>
            </div>
            <div className="text-[9px] text-gray-400 mt-2">
              ROI: {tlMode === 'dw' ? '3.4x' : '4.8x'} on total ad spend
            </div>
          </div>
        </div>
      </section>

      {/* MY TEAM GRID */}
      <section className="bg-white p-4 border border-gray-200 rounded-xl">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Active Team Roster ({currentTeam.length} Direct Reports)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {currentTeam.map((member, idx) => {
            const isOverloaded = member.queueDepth > 35;

            return (
              <div 
                key={idx}
                onClick={() => handleCallerClick(member)}
                className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between min-h-[140px]"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${member.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-xs">{member.name}</h4>
                      <span className="text-[9px] text-gray-400 block font-semibold">{member.roleLabel}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-1 py-0.2 rounded border ${
                    member.status === 'On Call' ? 'bg-green-50 text-green-700 border-green-200' :
                    member.status === 'Break' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    member.status === 'Offline' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                    {member.status}
                  </span>
                </div>

                <div className="space-y-1.5 border-t border-gray-100 pt-2 mt-2 text-[10px] text-gray-500">
                  <div className="flex justify-between">
                    <span>Calls / Revenue:</span>
                    <span className="font-semibold text-gray-700">{member.calls} calls · ₹{member.revenue}</span>
                  </div>

                  {/* Caller dynamic targets */}
                  {(() => {
                    const targets = getCallerTargets(member);
                    return (
                      <div className="bg-gray-50 p-2 rounded text-[9px] border border-gray-100 space-y-1 mt-1.5">
                        <div className="flex justify-between text-gray-600">
                          <span>Sales Target:</span>
                          <span className="font-bold text-gray-850">₹{targets.sales.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-gray-650">
                          <span>Campaign Target:</span>
                          <span className="font-bold text-gray-850">{targets.campaign} Leads</span>
                        </div>
                        {targets.sales > 0 && (
                          <div className="flex justify-between text-gray-400 border-t border-dashed border-gray-255 pt-1 mt-1">
                            <span>Sales Progress:</span>
                            <span className="font-bold text-[#F39C12]">{Math.round((member.revenue / targets.sales) * 100)}%</span>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  <div className="space-y-0.5">
                    <div className="flex justify-between font-semibold">
                      <span>{member.roleType === 'matchmaker' ? 'Jobs Assigned:' : 'Queue Depth:'}</span>
                      <span className={isOverloaded ? 'text-red-600 font-bold' : 'text-gray-700'}>
                        {member.queueDepth} {member.roleType === 'matchmaker' ? 'Jobs' : 'Leads'}
                      </span>
                    </div>
                    {member.roleType !== 'matchmaker' && (
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${isOverloaded ? 'bg-red-500' : 'bg-gray-400'}`} 
                          style={{ width: `${Math.min(100, (member.queueDepth / 40) * 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* TEAM TARGETS ALLOCATION CENTER */}
      <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-2 border-b border-gray-150">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#F39C12] text-lg font-bold">track_changes</span>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">
              Team Targets Allocation Center ({tlMode === 'dw' ? 'Driver Welcome' : 'Transporter Welcome'})
            </h3>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => {
                setAllocationMode('equal');
                localStorage.setItem(`tm_tl_allocation_mode_${tlMode}`, 'equal');
                // Automatically save equal splits in localStorage to update dashboard/roster
                const activeCount = currentTeam.filter(c => c.status !== 'Offline').length || 1;
                const eqSales = Math.round(tlSalesTarget / activeCount);
                const eqCampaign = Math.round(tlCampaignTarget / activeCount);
                const targetObj: Record<string, { sales: number; campaign: number }> = {};
                currentTeam.forEach(member => {
                  targetObj[member.name] = member.status === 'Offline' ? { sales: 0, campaign: 0 } : { sales: eqSales, campaign: eqCampaign };
                });
                localStorage.setItem(`tm_tl_caller_targets_${tlMode}`, JSON.stringify(targetObj));
                triggerToast('Targets allocated equally among active callers!');
              }}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                allocationMode === 'equal'
                  ? 'bg-[#F39C12] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Allocate Equally
            </button>
            <button
              onClick={() => {
                setAllocationMode('manual');
                localStorage.setItem(`tm_tl_allocation_mode_${tlMode}`, 'manual');
                // If manualTargets is empty, initialize it with the equal splits
                const activeCount = currentTeam.filter(c => c.status !== 'Offline').length || 1;
                const eqSales = Math.round(tlSalesTarget / activeCount);
                const eqCampaign = Math.round(tlCampaignTarget / activeCount);
                const initialManual: Record<string, { sales: string; campaign: string }> = {};
                currentTeam.forEach(member => {
                  if (!manualTargets[member.name]) {
                    initialManual[member.name] = {
                      sales: member.status === 'Offline' ? '0' : eqSales.toString(),
                      campaign: member.status === 'Offline' ? '0' : eqCampaign.toString()
                    };
                  } else {
                    initialManual[member.name] = manualTargets[member.name];
                  }
                });
                setManualTargets(initialManual);
              }}
              className={`px-3 py-1 rounded text-[11px] font-bold transition-all ${
                allocationMode === 'manual'
                  ? 'bg-[#F39C12] text-white shadow-sm'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              Allocate Manually
            </button>
          </div>
        </div>

        {/* Master Pool Overview info banner */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-gray-50 p-3 rounded-lg border border-gray-150 text-xs">
          <div>
            <span className="text-gray-400 font-semibold block">My Master Targets (set by TH)</span>
            <div className="font-bold text-gray-700 mt-0.5">
              Sales: <span className="text-[#F39C12]">₹{tlSalesTarget.toLocaleString()}</span> | Campaign: <span className="text-[#F39C12]">{tlCampaignTarget.toLocaleString()} Leads</span>
            </div>
          </div>
          <div>
            <span className="text-gray-400 font-semibold block">Total Allocated to Callers</span>
            <div className="font-bold mt-0.5">
              Sales: <span className={sumSales > tlSalesTarget ? 'text-red-650' : 'text-gray-700'}>₹{sumSales.toLocaleString()}</span> | Campaign: <span className={sumCampaign > tlCampaignTarget ? 'text-red-650' : 'text-gray-700'}>{sumCampaign.toLocaleString()} Leads</span>
            </div>
          </div>
          <div className="flex items-center md:justify-end">
            {sumSales > tlSalesTarget || sumCampaign > tlCampaignTarget ? (
              <span className="bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded text-[10px] font-extrabold flex items-center gap-1 animate-pulse">
                <span className="material-symbols-outlined text-[14px]">warning</span> Over-Allocated! Exceeds Pool Limit
              </span>
            ) : (
              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-1 rounded text-[10px] font-extrabold flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">check_circle</span> Allocation Status: Valid
              </span>
            )}
          </div>
        </div>

        {/* Roster Inputs / Split display */}
        {allocationMode === 'equal' ? (
          <div className="bg-orange-50/20 border border-orange-100 rounded-lg p-3 text-xs space-y-1.5">
            <p className="font-semibold text-gray-650">
              💡 <strong>Equally Split Mode Active</strong>: Master targets are evenly distributed among all non-offline team members.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1.5">
              {currentTeam.map((member, i) => {
                const targets = getCallerTargets(member);
                return (
                  <div key={i} className="bg-white border border-gray-150 p-2 rounded flex flex-col justify-between">
                    <div>
                      <span className="font-bold text-gray-700 block">{member.name}</span>
                      <span className="text-[10px] text-gray-450">{member.roleLabel} ({member.status})</span>
                    </div>
                    <div className="mt-2 text-[10px] font-semibold text-gray-500">
                      <div>Sales: ₹{targets.sales.toLocaleString()}</div>
                      <div>Campaign: {targets.campaign} Leads</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-gray-150 text-gray-400 font-bold uppercase text-[9px]">
                  <th className="py-2">Caller Name</th>
                  <th className="py-2">Role & Status</th>
                  <th className="py-2">Sales Target (₹)</th>
                  <th className="py-2">Campaign Target (Leads)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700">
                {currentTeam.map((member, i) => {
                  const isOffline = member.status === 'Offline';
                  const rowSales = manualTargets[member.name]?.sales ?? '0';
                  const rowCampaign = manualTargets[member.name]?.campaign ?? '0';

                  return (
                    <tr key={i} className="hover:bg-gray-50/30">
                      <td className="py-2 font-bold">{member.name}</td>
                      <td className="py-2">
                        <span className="text-[10px] text-gray-450 block">{member.roleLabel}</span>
                        <span className={`text-[9px] font-bold ${isOffline ? 'text-red-500' : 'text-emerald-600'}`}>{member.status}</span>
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          disabled={isOffline}
                          value={isOffline ? '0' : rowSales}
                          onChange={(e) => {
                            setManualTargets(prev => ({
                              ...prev,
                              [member.name]: {
                                ...prev[member.name],
                                sales: e.target.value
                              }
                            }));
                          }}
                          placeholder="e.g. 50000"
                          className="w-28 bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-[#F39C12] disabled:bg-gray-100 font-mono"
                        />
                      </td>
                      <td className="py-2">
                        <input
                          type="number"
                          disabled={isOffline}
                          value={isOffline ? '0' : rowCampaign}
                          onChange={(e) => {
                            setManualTargets(prev => ({
                              ...prev,
                              [member.name]: {
                                ...prev[member.name],
                                campaign: e.target.value
                              }
                            }));
                          }}
                          placeholder="e.g. 200"
                          className="w-28 bg-white border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-[#F39C12] disabled:bg-gray-100 font-mono"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            onClick={() => {
              if (sumSales > tlSalesTarget) {
                alert(`Cannot publish targets: Total allocated sales target (₹${sumSales.toLocaleString()}) exceeds the Team Leader master limit of ₹${tlSalesTarget.toLocaleString()} set by Telecalling Head!`);
                return;
              }
              if (sumCampaign > tlCampaignTarget) {
                alert(`Cannot publish targets: Total allocated campaign target (${sumCampaign.toLocaleString()}) exceeds the Team Leader master limit of ${tlCampaignTarget.toLocaleString()} leads set by Telecalling Head!`);
                return;
              }

              // Compile and save targets
              const targetObj: Record<string, { sales: number; campaign: number }> = {};
              currentTeam.forEach(member => {
                if (member.status === 'Offline') {
                  targetObj[member.name] = { sales: 0, campaign: 0 };
                } else if (allocationMode === 'equal') {
                  const activeCount = currentTeam.filter(c => c.status !== 'Offline').length || 1;
                  targetObj[member.name] = {
                    sales: Math.round(tlSalesTarget / activeCount),
                    campaign: Math.round(tlCampaignTarget / activeCount)
                  };
                } else {
                  const inState = manualTargets[member.name];
                  targetObj[member.name] = {
                    sales: inState ? (parseFloat(inState.sales) || 0) : 0,
                    campaign: inState ? (parseInt(inState.campaign) || 0) : 0
                  };
                }
              });

              saveTarget({ key: `tm_tl_caller_targets_${tlMode}`, value: targetObj })
                .unwrap()
                .then(() => {
                  localStorage.setItem(`tm_tl_caller_targets_${tlMode}`, JSON.stringify(targetObj));
                  triggerToast('Team targets successfully published to the operational queue roster!');
                })
                .catch(() => {
                  localStorage.setItem(`tm_tl_caller_targets_${tlMode}`, JSON.stringify(targetObj));
                  triggerToast('Saved locally as fallback.');
                });
            }}
            className="bg-[#F39C12] hover:bg-[#e08e0b] text-white px-4 py-2 rounded font-bold text-xs shadow-md transition-all flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-[16px]">publish</span>
            <span>Publish Team Targets</span>
          </button>
        </div>
      </section>

      {/* CALLBACKS DUE TODAY TABLE */}
      <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Callbacks Due Today (Team View)</h3>
          <button 
            onClick={() => navigate('/tl/tl-team-callback-calendar')}
            className="text-[10px] font-extrabold text-[#F39C12] hover:underline"
          >
            Open Team Calendar →
          </button>
        </div>

        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px]">
              <th className="py-2">Caller</th>
              <th className="py-2">Lead Name / Ref</th>
              <th className="py-2">Scheduled</th>
              <th className="py-2">SLA Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
            {callbacks.map((cb) => {
              const isOverdue = cb.status === 'Overdue';
              return (
                <tr 
                  key={cb.id} 
                  className={`hover:bg-gray-50/50 transition-colors ${isOverdue ? 'bg-red-50/40 text-red-900' : ''}`}
                >
                  <td className="py-2.5 font-bold">{cb.callerName}</td>
                  <td className="py-2.5">{cb.leadName}</td>
                  <td className="py-2.5 font-mono">{cb.time}</td>
                  <td className="py-2.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      cb.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                      cb.status === 'Done' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {cb.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    {cb.status !== 'Done' && (
                      <button 
                        onClick={() => handleMarkCallbackDone(cb.id, cb.leadName)}
                        className="bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded hover:bg-[#F39C12] hover:text-white hover:border-[#F39C12] transition-colors text-[10px] font-bold"
                      >
                        Mark Done
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </section>

      {/* TODAY'S PROCESS SUMMARY FOOTER STRIP */}
      <footer className="bg-gray-900 text-gray-400 py-3.5 px-4 rounded-xl text-[11px] font-semibold flex flex-wrap gap-4 items-center justify-between shadow select-none">
        <div className="flex gap-4 flex-wrap">
          <div>Calls Made: <span className="text-white font-mono">{tlMode === 'dw' ? '412' : '95'}</span></div>
          <div>Conversions: <span className="text-white font-mono">{tlMode === 'dw' ? '38' : '7'}</span></div>
          <div>Revenue Generated: <span className="text-white font-mono">₹{tlMode === 'dw' ? '18,200' : '23,500'}</span></div>
          <div>Conversion Rate: <span className="text-white font-mono">{tlMode === 'dw' ? '9.2%' : '14.8%'}</span></div>
        </div>
        <div className="flex gap-4">
          <div>Untagged Calls: <span className={untaggedCount > 0 ? 'text-red-400 font-bold font-mono' : 'text-emerald-400 font-bold font-mono'}>{untaggedCount}</span></div>
          <div>Missed Callbacks: <span className="text-red-400 font-bold font-mono">1</span></div>
        </div>
      </footer>

    </div>
  );
};

export default TlOverviewDashboard;
