import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetThDashboardQuery } from '../../services/api/webCrmApi';
import {
  useGetThOverviewQuery,
  useGetThTeamMonitorQuery,
  useGetThSlaDashboardQuery,
} from '../../services/api/teleheadApi';

interface ActivityEvent {
  id: string;
  process: 'DW' | 'TR' | 'SC' | 'MM';
  caller: string;
  text: string;
  time: string;
}

interface SlaRiskItem {
  id: string;
  type: string;
  process: 'TR' | 'MM';
  partyName: string;
  timeLeft: string;
  severity: 'high' | 'medium' | 'low';
}

export const ThHomeDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { data: realDashboard } = useGetThDashboardQuery();
  const { data: overviewData } = useGetThOverviewQuery();
  const { data: teamMonitorData } = useGetThTeamMonitorQuery({ process: 'all' });
  const { data: slaData } = useGetThSlaDashboardQuery();

  // Dashboard configuration & tab states
  const [feedFilter, setFeedFilter] = useState<'ALL' | 'DW' | 'TR' | 'SC' | 'MM'>('ALL');
  const [chartMode, setChartMode] = useState<'SIMPLE' | 'STACKED'>('STACKED');
  const [dismissedAlerts, setDismissedAlerts] = useState<string[]>([]);
  const [selectedSegment, setSelectedSegment] = useState<string | null>(null);

  // Extract database metrics
  const kpis = realDashboard?.data?.kpis;
  const breakdown = realDashboard?.data?.breakdown;

  const totalCalls = kpis?.totalCalls ?? 2840;
  const connectedCalls = kpis?.connectedCalls ?? 2180;
  const answeredPercentage = kpis?.answeredPercentage ?? 78;
  const activeCallersCount = kpis?.activeCallers ?? 12;

  const driversRegistered = breakdown?.driversCount ?? 1420;
  const transportersRegistered = breakdown?.transportersCount ?? 650;
  const postedJobsCount = breakdown?.postedJobsCount ?? 180;

  // Extract dynamic process metrics
  const welcomeCallData = overviewData?.revenue?.by_process?.['welcome-call'];
  const transporterData = overviewData?.revenue?.by_process?.['transporter'];
  const specialData = overviewData?.revenue?.by_process?.['special'];
  const matchmakingData = overviewData?.revenue?.by_process?.['match-making'];

  const dwSales = welcomeCallData?.revenue ?? 0;
  const dwTarget = welcomeCallData?.target ?? 200000;
  
  const trSales = transporterData?.revenue ?? 0;
  const trTarget = transporterData?.target ?? 200000;

  const scSales = specialData?.revenue ?? 0;
  const scTarget = specialData?.target ?? 50000;

  const mmSales = matchmakingData?.revenue ?? 0;
  const mmTarget = matchmakingData?.target ?? 350000;

  const totalSalesAchieved = dwSales + trSales + scSales + mmSales;

  const formatLakhOrK = (value: number) => {
    if (value >= 100000) {
      return `${(value / 100000).toFixed(2)}L`;
    }
    return `${(value / 1000).toFixed(0)}k`;
  };

  // Custom alert lists
  const alerts = [
    { id: 'campaign-sla', text: `🔥 SLA Alert: ${overviewData?.sla_alerts?.total || 12} Hot Campaign Leads uncalled for > 1 hour!`, actionText: 'Assign & Nudge →', severity: 'red' },
    { id: 'untagged', text: `⚠ ${overviewData?.calls?.untagged_today || 7} calls untagged across all teams.`, actionText: 'View by Team →', severity: 'red' },
    { id: 'sla', text: `⚠ ${overviewData?.sla_alerts?.total || 2} active SLA breaches — Transporter first-call and Job SLA.`, actionText: 'View →', severity: 'red' },
    { id: 'backlog', text: `${(overviewData?.team?.backlog_leads || 37384).toLocaleString()} uncalled leads in backlog.`, actionText: 'Launch Sprint →', severity: 'orange' },
    { id: 'hiring', text: `⚠ ${overviewData?.team?.open_positions || 2} CRITICAL open roles unfilled beyond target hire week.`, actionText: 'View Hiring →', severity: 'amber' },
  ];

  const handleDismissAlert = (id: string) => {
    setDismissedAlerts(prev => [...prev, id]);
  };

  // Stacked chart daily data (representing DW, TR, SC, MM revenue portions)
  const stackedChartData = [
    { day: 'Mon', dw: 8000, tr: 12000, sc: 2000, mm: 8000, total: 30000 },
    { day: 'Tue', dw: 10000, tr: 15000, sc: 3500, mm: 14000, total: 42500 },
    { day: 'Wed', dw: 9000, tr: 13000, sc: 3000, mm: 10000, total: 35000 },
    { day: 'Thu', dw: 12000, tr: 18000, sc: 4500, mm: 13000, total: 47500 },
    { day: 'Fri', dw: 5000, tr: 8000, sc: 2000, mm: 5000, total: 20000 },
    { day: 'Sat', dw: 10000, tr: 14000, sc: 3500, mm: 10000, total: 37500 },
    { day: 'Sun', dw: 11000, tr: 15000, sc: 4000, mm: 11000, total: 41000 },
  ];

  // Map live activity events from overview
  const activityEvents: ActivityEvent[] = overviewData?.live_feed?.map(feed => ({
    id: feed.id.toString(),
    process: (feed.process === 'welcome-call' ? 'DW' : feed.process === 'transporter' ? 'TR' : feed.process === 'match-making' ? 'MM' : 'SC') as any,
    caller: feed.caller_name,
    text: `${feed.call_status === 'connected' ? 'connected with' : 'dialed'} ${feed.lead_name} (${feed.lead_tmid})`,
    time: feed.updated_at ? feed.updated_at.split(' ')[1] : 'Just now'
  })) || [
    { id: '1', process: 'DW', caller: 'Sonam', text: 'converted DR-48291 — Job Ready ₹199', time: '2 min ago' },
    { id: '2', process: 'MM', caller: 'Rohit K.', text: 'placed DR-50112 on JD-12034 (Super Premium) — FM commission triggered', time: '4 min ago' },
    { id: '3', process: 'TR', caller: 'Pooja Chaudhary', text: 'onboarded TR-12098 — Standard Plan', time: '6 min ago' },
    { id: '4', process: 'SC', caller: 'Akash Thakur', text: 'converted FM-00231 (Foreman) — ₹150 incentive', time: '11 min ago' },
  ];

  const filteredEvents = activityEvents.filter(
    e => feedFilter === 'ALL' || e.process === feedFilter
  );

  // Map live SLA Risks
  const trSlaList = slaData?.tr_sla?.data?.map((item: any) => ({
    id: item.unique_id || item.id?.toString(),
    type: 'First-Call SLA',
    process: 'TR' as const,
    partyName: item.name,
    timeLeft: `${item.mins_since_registration}m ago`,
    severity: item.sla_status === 'CRITICAL' ? 'high' as const : 'medium' as const
  })) || [];

  const mmSlaList = slaData?.mm_sla?.data?.map((item: any) => ({
    id: item.job_id,
    type: 'Job Placement SLA',
    process: 'MM' as const,
    partyName: item.transporter_name,
    timeLeft: item.sla_deadline,
    severity: item.sla_status === 'CRITICAL' ? 'high' as const : 'medium' as const
  })) || [];

  const slaRiskItems: SlaRiskItem[] = [...trSlaList, ...mmSlaList];

  if (slaRiskItems.length === 0) {
    slaRiskItems.push(
      { id: 'J821', type: 'Super Premium Fill', process: 'MM', partyName: 'Balaji Logistics', timeLeft: '0.4h Left', severity: 'high' },
      { id: 'T120', type: 'First-Call SLA', process: 'TR', partyName: 'Vikas Carriers', timeLeft: '1.2h Left', severity: 'medium' }
    );
  }

  // Map live callers
  const agentsList = teamMonitorData?.data?.map(caller => ({
    name: caller.name.substring(0, 2).toUpperCase(),
    fullName: caller.name,
    role: caller.process === 'welcome-call' ? 'DW' : caller.process === 'transporter' ? 'TR' : caller.process === 'match-making' ? 'MM' : caller.process === 'special' ? 'SC' : 'TL',
    status: caller.live_status === 'On Call' ? 'busy' : caller.live_status === 'Idle' ? 'online' : 'offline'
  })) || [
    { name: 'SO', fullName: 'Sonam', role: 'DW', status: 'online' },
    { name: 'AS', fullName: 'Ankit Singh', role: 'DW', status: 'online' },
    { name: 'AR', fullName: 'Arpita', role: 'DW', status: 'online' },
    { name: 'PP', fullName: 'Pooja Pal', role: 'MM', status: 'online' },
    { name: 'TA', fullName: 'Tanisha', role: 'MM', status: 'busy' }
  ];

  const handleAlertAction = (id: string) => {
    if (id === 'campaign-sla') {
      navigate('/th/global-campaign-console');
    } else if (id === 'untagged') {
      navigate('/th/team-monitor');
    } else if (id === 'sla') {
      navigate('/th/sla-dashboard');
    } else if (id === 'backlog') {
      navigate('/th/backlog-campaign-manager');
    } else if (id === 'hiring') {
      navigate('/hr/hiring-dashboard-live');
    }
  };

  return (
    <main className="bg-background p-md space-y-lg text-xs font-sans max-w-[1440px] mx-auto">
      {/* 1. Persistent Alert Stack */}
      <section className="space-y-xs">
        {alerts
          .filter(a => !dismissedAlerts.includes(a.id))
          .map(alert => (
            <div
              key={alert.id}
              className={`flex items-center justify-between px-md py-sm border rounded-sm font-semibold transition-all ${alert.severity === 'red'
                ? 'bg-red-50 text-red-700 border-red-200'
                : alert.severity === 'orange'
                  ? 'bg-orange-50 text-orange-700 border-orange-200'
                  : 'bg-amber-50 text-amber-700 border-amber-200'
                }`}
            >
              <div className="flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span>{alert.text}</span>
              </div>
              <div className="flex items-center gap-md">
                <button
                  onClick={() => handleAlertAction(alert.id)}
                  className="underline text-xs hover:text-black transition-colors"
                >
                  {alert.actionText}
                </button>
                <button
                  onClick={() => handleDismissAlert(alert.id)}
                  className="material-symbols-outlined text-[16px] opacity-60 hover:opacity-100 transition-opacity"
                >
                  close
                </button>
              </div>
            </div>
          ))}
      </section>

      {/* 2. Revenue Command Bar */}
      <section className="bg-white p-md rounded-sm border border-outline-variant flipkart-shadow">
        <div className="flex justify-between items-center mb-sm">
          <div>
            <h3 className="font-label-caps text-outline text-[10px] tracking-wider uppercase font-bold">
              Revenue Control Bar — override authority
            </h3>
            {(() => {
              const savedAdminTargets = localStorage.getItem('tm_admin_th_targets');
              let adminSalesTarget = 800000;
              if (savedAdminTargets) {
                try {
                  adminSalesTarget = JSON.parse(savedAdminTargets).salesTarget || 800000;
                } catch (e) {}
              }
              const pctAchieved = adminSalesTarget > 0 ? ((totalSalesAchieved / adminSalesTarget) * 100).toFixed(1) : '0.0';
              return (
                <p className="text-lg font-extrabold text-on-surface mt-xs flex flex-wrap items-center gap-xs">
                  <span>₹{totalSalesAchieved.toLocaleString()}</span>
                  <span className="text-outline text-xs font-medium">of ₹{adminSalesTarget.toLocaleString()} target ({pctAchieved}% achieved)</span>
                  <span className="text-outline text-xs font-semibold ml-sm font-data-mono">| Today's Calls: {totalCalls} ({connectedCalls} Connected, {answeredPercentage}% Connected)</span>
                </p>
              );
            })()}
          </div>
          {selectedSegment && (
            <button
              onClick={() => setSelectedSegment(null)}
              className="text-xs text-primary font-bold hover:underline"
            >
              Clear Filter [Showing: {selectedSegment}]
            </button>
          )}
        </div>

        {/* Segmented Horizontal Progress Bar */}
        <div className="h-6 w-full bg-surface-container rounded-sm overflow-hidden flex cursor-pointer select-none">
          <div
            onClick={() => setSelectedSegment('DW')}
            className={`h-full bg-green-500 flex items-center justify-center text-white font-extrabold transition-all duration-300 ${selectedSegment === 'DW' ? 'opacity-100 ring-2 ring-inset ring-black scale-y-110' : selectedSegment ? 'opacity-40' : 'hover:opacity-90'
              }`}
            style={{ width: `${totalSalesAchieved > 0 ? (dwSales / totalSalesAchieved) * 100 : 25}%` }}
            title={`DW (Driver Welcome) — ₹${dwSales.toLocaleString()} / Target: ₹${dwTarget.toLocaleString()}`}
          >
            DW (₹{formatLakhOrK(dwSales)})
          </div>
          <div
            onClick={() => setSelectedSegment('TR')}
            className={`h-full bg-orange-500 flex items-center justify-center text-white font-extrabold transition-all duration-300 ${selectedSegment === 'TR' ? 'opacity-100 ring-2 ring-inset ring-black scale-y-110' : selectedSegment ? 'opacity-40' : 'hover:opacity-90'
              }`}
            style={{ width: `${totalSalesAchieved > 0 ? (trSales / totalSalesAchieved) * 100 : 45}%` }}
            title={`TR (Transporter Welcome) — ₹${trSales.toLocaleString()} / Target: ₹${trTarget.toLocaleString()}`}
          >
            TR (₹{formatLakhOrK(trSales)})
          </div>
          <div
            onClick={() => setSelectedSegment('SC')}
            className={`h-full bg-teal-500 flex items-center justify-center text-white font-extrabold transition-all duration-300 ${selectedSegment === 'SC' ? 'opacity-100 ring-2 ring-inset ring-black scale-y-110' : selectedSegment ? 'opacity-40' : 'hover:opacity-90'
              }`}
            style={{ width: `${totalSalesAchieved > 0 ? (scSales / totalSalesAchieved) * 100 : 5}%` }}
            title={`SC (Special Categories) — ₹${scSales.toLocaleString()} / Target: ₹${scTarget.toLocaleString()}`}
          >
            SC (₹{formatLakhOrK(scSales)})
          </div>
          <div
            onClick={() => setSelectedSegment('MM')}
            className={`h-full bg-purple-500 flex items-center justify-center text-white font-extrabold transition-all duration-300 ${selectedSegment === 'MM' ? 'opacity-100 ring-2 ring-inset ring-black scale-y-110' : selectedSegment ? 'opacity-40' : 'hover:opacity-90'
              }`}
            style={{ width: `${totalSalesAchieved > 0 ? (mmSales / totalSalesAchieved) * 100 : 25}%` }}
            title={`MM (Matchmaking) — ₹${mmSales.toLocaleString()} / Target: ₹${mmTarget.toLocaleString()}`}
          >
            MM (₹{formatLakhOrK(mmSales)})
          </div>
        </div>
        <p className="text-[10px] text-outline mt-sm font-semibold text-center">
          *Segments are sized based on current share of achievements. Click a segment to filter team metrics below.
        </p>
      </section>

      {/* Campaign Health Strip */}
      <section className="bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 text-white p-3 rounded-sm shadow-md flex flex-col md:flex-row justify-between items-center gap-sm">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-xl animate-pulse">campaign</span>
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider">Campaign Leads Command Strip</h4>
            <p className="text-[10px] opacity-90">Real-time status of marketing campaign inbound leads</p>
          </div>
        </div>

        <div className="flex gap-md flex-wrap items-center text-xs">
          <div className="bg-white/10 px-3 py-1.5 rounded border border-white/20 text-center min-w-[80px]">
            <span className="block opacity-75 text-[9px] uppercase font-bold">Total Received</span>
            <span className="font-extrabold font-data-mono text-sm">3,840</span>
          </div>
          <div className="bg-red-700/80 px-3 py-1.5 rounded border border-red-500/40 text-center min-w-[80px] animate-pulse">
            <span className="block opacity-75 text-[9px] uppercase font-bold">🔥 Hot Uncalled</span>
            <span className="font-extrabold font-data-mono text-sm">12</span>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded border border-white/20 text-center min-w-[80px]">
            <span className="block opacity-75 text-[9px] uppercase font-bold">Warm Leads</span>
            <span className="font-extrabold font-data-mono text-sm">410</span>
          </div>
          <div className="bg-white/10 px-3 py-1.5 rounded border border-white/20 text-center min-w-[80px]">
            <span className="block opacity-75 text-[9px] uppercase font-bold">Cold Leads</span>
            <span className="font-extrabold font-data-mono text-sm">1,230</span>
          </div>
          <div className="bg-green-700/50 px-3 py-1.5 rounded border border-green-500/30 text-center min-w-[80px]">
            <span className="block opacity-75 text-[9px] uppercase font-bold">Converted</span>
            <span className="font-extrabold font-data-mono text-sm">540</span>
          </div>
        </div>

        <Link
          to="/th/global-campaign-console"
          className="bg-white text-orange-600 px-3 py-1.5 rounded-sm font-extrabold hover:bg-gray-150 transition-colors text-[10px] uppercase shadow-sm whitespace-nowrap"
        >
          Open Console →
        </Link>
      </section>

      {/* 3. Four-Process Snapshot Row */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-md">
        {/* Card 1: Driver Welcome */}
        <div className="bg-white border-t-[4px] border-t-green-500 border-x border-b border-outline-variant p-md rounded-sm flipkart-shadow flex flex-col justify-between h-[155px]">
          <div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-green-700 text-xs">Driver Welcome</span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" title="SLA optimal"></span>
            </div>
            <p className="font-data-mono text-sm font-extrabold mt-sm">₹{dwSales.toLocaleString()} <span className="text-outline text-[10px] font-medium">/ ₹{formatLakhOrK(dwTarget)}</span></p>
            <p className="text-outline mt-xs text-[10px] font-semibold">TL: {welcomeCallData?.tl_name ?? 'Harneet Kaur'}</p>
          </div>
          <div className="mt-md pt-sm border-t border-outline-variant flex justify-between items-center text-[10px]">
            <span>Calls today: <strong className="font-bold">{welcomeCallData?.calls_today ?? 0}</strong> · Reg: <strong className="font-bold font-data-mono">{driversRegistered}</strong></span>
            <span className="text-green-600 font-bold">{welcomeCallData?.conv_pct ?? 0}% Conv</span>
          </div>
          <Link to="/tl/tl-overview-dashboard?team=dw" className="text-primary hover:underline font-bold mt-sm block text-[10px] text-right">Enter Team View →</Link>
        </div>

        {/* Card 2: Transporter Welcome */}
        <div className="bg-white border-t-[4px] border-t-orange-500 border-x border-b border-outline-variant p-md rounded-sm flipkart-shadow flex flex-col justify-between h-[155px]">
          <div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-orange-700 text-xs">Transporter Welcome</span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" title="SLA optimal"></span>
            </div>
            <p className="font-data-mono text-sm font-extrabold mt-sm">₹{trSales.toLocaleString()} <span className="text-outline text-[10px] font-medium">/ ₹{formatLakhOrK(trTarget)}</span></p>
            <p className="text-outline mt-xs text-[10px] font-semibold">TL: {transporterData?.tl_name ?? 'Demo User (TL)'}</p>
          </div>
          <div className="mt-md pt-sm border-t border-outline-variant flex justify-between items-center text-[10px]">
            <span>Calls today: <strong className="font-bold">{transporterData?.calls_today ?? 0}</strong> · Reg: <strong className="font-bold font-data-mono">{transportersRegistered}</strong></span>
            <span className="text-green-600 font-bold">{transporterData?.conv_pct ?? 0}% Conv</span>
          </div>
          <Link to="/tl/tl-overview-dashboard?team=tr" className="text-primary hover:underline font-bold mt-sm block text-[10px] text-right">Enter Team View →</Link>
        </div>

        {/* Card 3: Special Categories */}
        <div className="bg-white border-t-[4px] border-t-teal-500 border-x border-b border-outline-variant p-md rounded-sm flipkart-shadow flex flex-col justify-between h-[155px]">
          <div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-teal-700 text-xs">Special Categories</span>
              <span className="w-2.5 h-2.5 rounded-full bg-orange-500" title="SLA warning"></span>
            </div>
            <p className="font-data-mono text-sm font-extrabold mt-sm">₹{scSales.toLocaleString()} <span className="text-outline text-[10px] font-medium">/ ₹{formatLakhOrK(scTarget)}</span></p>
            <p className="text-red-600 font-extrabold mt-xs text-[10px]">TL: {specialData?.tl_name ?? 'Open Position'}</p>
          </div>
          <div className="mt-md pt-sm border-t border-outline-variant flex justify-between items-center text-[10px]">
            <span>Calls today: <strong className="font-bold">{specialData?.calls_today ?? 0}</strong></span>
            <span className="text-red-500 font-bold">{specialData?.conv_pct ?? 0}% Conv</span>
          </div>
          <Link to="/tl/tl-overview-dashboard?team=sc" className="text-primary hover:underline font-bold mt-sm block text-[10px] text-right">Enter Team View →</Link>
        </div>

        {/* Card 4: Matchmaking */}
        <div className="bg-white border-t-[4px] border-t-purple-500 border-x border-b border-outline-variant p-md rounded-sm flipkart-shadow flex flex-col justify-between h-[155px]">
          <div>
            <div className="flex justify-between items-center">
              <span className="font-bold text-purple-700 text-xs">Matchmaking</span>
              <span className="w-2.5 h-2.5 rounded-full bg-green-500" title="SLA optimal"></span>
            </div>
            <p className="font-data-mono text-sm font-extrabold mt-sm">₹{mmSales.toLocaleString()} <span className="text-outline text-[10px] font-medium">/ ₹{formatLakhOrK(mmTarget)}</span></p>
            <p className="text-outline mt-xs text-[10px] font-semibold">TL: {matchmakingData?.tl_name ?? 'Demo User (TL)'}</p>
          </div>
          <div className="mt-md pt-sm border-t border-outline-variant flex justify-between items-center text-[10px]">
            <span>Calls today: <strong className="font-bold">{matchmakingData?.calls_today ?? 0}</strong> · Jobs: <strong className="font-bold font-data-mono">{postedJobsCount}</strong></span>
            <span className="text-green-600 font-bold">{matchmakingData?.conv_pct ?? 0}% Conv</span>
          </div>
          <Link to="/tl/tl-overview-dashboard?team=mm" className="text-primary hover:underline font-bold mt-sm block text-[10px] text-right">Enter Team View →</Link>
        </div>
      </section>

      {/* 4. Split Section: Live Feed + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        {/* Left 8-col section */}
        <div className="lg:col-span-8 space-y-md">
          {/* Revenue Trend Chart Section */}
          <div className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow">
            <div className="flex justify-between items-center mb-md">
              <div>
                <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface">
                  Revenue Trend Analysis
                </h3>
                <p className="text-[10px] text-outline font-semibold">Aggregate 7-day performance compared to target pace</p>
              </div>
              <div className="flex border border-outline-variant rounded-sm overflow-hidden select-none">
                <button
                  onClick={() => setChartMode('SIMPLE')}
                  className={`px-sm py-1 font-semibold text-[10px] transition-colors ${chartMode === 'SIMPLE' ? 'bg-primary text-white font-bold' : 'bg-surface hover:bg-surface-container'
                    }`}
                >
                  Aggregate
                </button>
                <button
                  onClick={() => setChartMode('STACKED')}
                  className={`px-sm py-1 font-semibold text-[10px] transition-colors ${chartMode === 'STACKED' ? 'bg-primary text-white font-bold' : 'bg-surface hover:bg-surface-container'
                    }`}
                >
                  Process Mix
                </button>
              </div>
            </div>

            {/* Horizontal Bar Chart Representation */}
            <div className="flex gap-sm">
              <div className="flex flex-col justify-between h-60 text-[9px] text-outline font-bold text-right w-10 pb-sm select-none">
                <span>₹50.0k</span>
                <span>₹37.5k</span>
                <span>₹25.0k</span>
                <span>₹12.5k</span>
                <span>₹0.0</span>
              </div>
              <div className="flex-1 relative h-60 flex items-end justify-between px-md pb-sm border-b border-l border-outline-variant">
                {/* Dashed Target line */}
                <div className="absolute top-1/4 left-0 w-full border-t border-dashed border-primary/40 z-0"></div>

                {stackedChartData.map((d) => {
                  const barHeightPct = (d.total / 50000) * 100;
                  const dwPct = (d.dw / d.total) * 100;
                  const trPct = (d.tr / d.total) * 100;
                  const scPct = (d.sc / d.total) * 100;
                  const mmPct = (d.mm / d.total) * 100;

                  return (
                    <div
                      key={d.day}
                      className="group relative w-12 flex flex-col justify-end transition-all cursor-pointer"
                      style={{ height: `${barHeightPct}%` }}
                    >
                      {chartMode === 'SIMPLE' ? (
                        <div className="w-full bg-primary h-full hover:bg-primary-container transition-colors rounded-t-xs"></div>
                      ) : (
                        <div className="w-full h-full flex flex-col rounded-t-xs overflow-hidden">
                          <div className="bg-purple-500 w-full hover:brightness-95 transition-all" style={{ height: `${mmPct}%` }} title={`MM: ₹${d.mm}`}></div>
                          <div className="bg-teal-500 w-full hover:brightness-95 transition-all" style={{ height: `${scPct}%` }} title={`SC: ₹${d.sc}`}></div>
                          <div className="bg-orange-500 w-full hover:brightness-95 transition-all" style={{ height: `${trPct}%` }} title={`TR: ₹${d.tr}`}></div>
                          <div className="bg-green-500 w-full hover:brightness-95 transition-all" style={{ height: `${dwPct}%` }} title={`DW: ₹${d.dw}`}></div>
                        </div>
                      )}
                      {/* Tooltip */}
                      <span className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[9px] p-xs rounded-sm whitespace-nowrap z-50 pointer-events-none transition-opacity duration-200">
                        ₹{d.total.toLocaleString()} Total<br />
                        <span className="text-green-400 font-bold">DW: ₹{d.dw}</span> · <span className="text-orange-400 font-bold">TR: ₹{d.tr}</span>
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="flex justify-between mt-sm text-[10px] text-outline pl-[50px] uppercase font-semibold">
              {stackedChartData.map(d => (
                <span key={d.day} className="w-12 text-center">{d.day}</span>
              ))}
            </div>
          </div>

          {/* Live Activity Feed */}
          <div className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-xs">
              <div>
                <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface">
                  Live Global Activity Feed
                </h3>
                <p className="text-[10px] text-outline font-semibold">Real-time conversions and system actions system-wide</p>
              </div>
              <select
                value={feedFilter}
                onChange={(e) => setFeedFilter(e.target.value as any)}
                className="bg-white border border-outline-variant text-[11px] font-bold p-1 rounded-sm focus:ring-1 focus:ring-primary outline-none"
              >
                <option value="ALL">All Processes</option>
                <option value="DW">Driver Welcome</option>
                <option value="TR">Transporter Welcome</option>
                <option value="SC">Special Categories</option>
                <option value="MM">Matchmaking</option>
              </select>
            </div>

            <div className="space-y-sm max-h-72 overflow-y-auto custom-scrollbar pr-xs">
              {filteredEvents.map(event => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-sm border border-outline-variant bg-surface-container-low rounded-sm hover:border-primary transition-colors"
                >
                  <div className="flex items-center gap-md">
                    <span
                      className={`w-7 h-7 rounded-sm flex items-center justify-center text-white font-extrabold text-[10px] ${event.process === 'DW'
                        ? 'bg-green-500'
                        : event.process === 'TR'
                          ? 'bg-orange-500'
                          : event.process === 'SC'
                            ? 'bg-teal-500'
                            : 'bg-purple-500'
                        }`}
                    >
                      {event.process}
                    </span>
                    <div>
                      <p className="font-bold text-on-surface">
                        {event.caller} <span className="font-normal text-on-surface-variant">{event.text}</span>
                      </p>
                      <p className="text-[9px] text-outline font-semibold font-data-mono">{event.time}</p>
                    </div>
                  </div>
                  <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                </div>
              ))}
              {filteredEvents.length === 0 && (
                <p className="text-center text-outline py-xl font-bold">No active events for selected filter.</p>
              )}
            </div>
          </div>
        </div>

        {/* Right 4-col section */}
        <div className="lg:col-span-4 space-y-md">
          {/* SLA Risk Panel */}
          <div className="bg-white border border-outline-variant rounded-sm flipkart-shadow overflow-hidden flex flex-col h-[320px]">
            <div className="bg-error px-md py-sm flex justify-between items-center text-white">
              <div className="flex items-center gap-xs font-bold">
                <span className="material-symbols-outlined text-[16px]">warning</span>
                <span className="uppercase tracking-wider font-bold">SLA Risks (System-Wide)</span>
              </div>
              <span className="text-[10px] font-bold bg-white/20 px-2 py-0.5 rounded-sm">
                5 Active
              </span>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse text-xs">
                <thead className="sticky top-0 bg-surface-container-low text-[10px] font-bold text-outline uppercase border-b border-outline-variant">
                  <tr>
                    <th className="px-sm py-2">ID</th>
                    <th className="px-sm py-2">Process</th>
                    <th className="px-sm py-2">Party</th>
                    <th className="px-sm py-2 text-right">Time Left</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant font-medium divide-outline-variant">
                  {slaRiskItems.map(item => (
                    <tr
                      key={item.id}
                      className={`hover:bg-surface-container transition-colors ${item.severity === 'high'
                        ? 'bg-red-50/40 text-red-800'
                        : item.severity === 'medium'
                          ? 'bg-orange-50/30 text-orange-800'
                          : ''
                        }`}
                    >
                      <td className="px-sm py-3 font-data-mono font-bold">#{item.id}</td>
                      <td className="px-sm py-3">
                        <span
                          className={`px-1.5 py-0.5 text-[9px] font-extrabold rounded-sm text-white ${item.process === 'TR' ? 'bg-orange-500' : 'bg-purple-500'
                            }`}
                        >
                          {item.process}
                        </span>
                      </td>
                      <td className="px-sm py-3 font-bold truncate max-w-[100px]">{item.partyName}</td>
                      <td className="px-sm py-3 text-right font-bold text-error font-data-mono">{item.timeLeft}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Global Team Pulse Grid */}
          <div className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow">
            <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-xs">
              <h3 className="font-label-caps text-outline uppercase font-bold">Global Team Pulse</h3>
              <span className="text-[10px] text-green-600 font-bold bg-green-50 px-2 py-0.5 border border-green-200 rounded-sm">
                {activeCallersCount} Online
              </span>
            </div>

            <div className="space-y-md max-h-[300px] overflow-y-auto custom-scrollbar pr-xs">
              {/* DW Callers */}
              <div>
                <h4 className="text-[10px] text-outline font-bold uppercase mb-sm">— Driver Welcome (7) —</h4>
                <div className="grid grid-cols-7 gap-sm">
                  {agentsList
                    .filter(a => a.role === 'DW')
                    .map(agent => (
                      <div
                        key={agent.fullName}
                        className="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] border border-outline-variant cursor-pointer group"
                      >
                        {agent.name}
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 border border-white rounded-full ${agent.status === 'online'
                            ? 'bg-green-500'
                            : agent.status === 'busy'
                              ? 'bg-yellow-500'
                              : 'bg-gray-400'
                            }`}
                        ></span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[9px] py-1 px-2 rounded-sm whitespace-nowrap z-50 pointer-events-none">
                          {agent.fullName} (DW)
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* TR + MM Callers */}
              <div>
                <h4 className="text-[10px] text-outline font-bold uppercase mb-sm">— Transporter + MM (8) —</h4>
                <div className="grid grid-cols-7 gap-sm">
                  {agentsList
                    .filter(a => a.role === 'MM' || a.role === 'SC')
                    .map(agent => (
                      <div
                        key={agent.fullName}
                        className="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] border border-outline-variant cursor-pointer group"
                      >
                        {agent.name}
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 border border-white rounded-full ${agent.status === 'online'
                            ? 'bg-green-500'
                            : agent.status === 'busy'
                              ? 'bg-yellow-500'
                              : 'bg-gray-400'
                            }`}
                        ></span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[9px] py-1 px-2 rounded-sm whitespace-nowrap z-50 pointer-events-none">
                          {agent.fullName} ({agent.role})
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Other roles */}
              <div>
                <h4 className="text-[10px] text-outline font-bold uppercase mb-sm">— TLs & QC (4) —</h4>
                <div className="grid grid-cols-7 gap-sm">
                  {agentsList
                    .filter(a => a.role === 'TL' || a.role === 'QC')
                    .map(agent => (
                      <div
                        key={agent.fullName}
                        className="relative w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center font-bold text-[10px] border border-outline-variant cursor-pointer group"
                      >
                        {agent.name}
                        <span
                          className={`absolute bottom-0 right-0 w-2.5 h-2.5 border border-white rounded-full ${agent.status === 'online'
                            ? 'bg-green-500'
                            : agent.status === 'busy'
                              ? 'bg-yellow-500'
                              : 'bg-gray-400'
                            }`}
                        ></span>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[9px] py-1 px-2 rounded-sm whitespace-nowrap z-50 pointer-events-none">
                          {agent.fullName} ({agent.role})
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThHomeDashboard;
