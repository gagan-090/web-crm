import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGetThDashboardQuery } from '../../services/api/webCrmApi';
import { PageCardSkeleton } from '../../components/PageSkeleton';
import {
  useGetThOverviewQuery,
  useGetThTeamMonitorQuery,
  useGetThSlaDashboardQuery,
  useGetThNotificationsQuery,
  useGetThOverviewRevenueQuery,
  useGetThOverviewCampaignLeadsQuery,
  useGetThOverviewTeamPerformanceQuery,
  useGetThOverviewRevenueTrendQuery,
  useGetThOverviewSlaRisksQuery,
  useGetThOverviewActivityFeedQuery,
  useGetThOverviewTeamPulseQuery,
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
  const { data: notificationsData } = useGetThNotificationsQuery();
  const notificationsList = notificationsData?.data ?? [];

  // Brand new Overview dashboard APIs
  const { data: thOverviewRevenue, isLoading: isRevLoading, isFetching: isRevFetching } = useGetThOverviewRevenueQuery();
  const { data: thOverviewCampaignLeads, isLoading: isCampaignLoading, isFetching: isCampaignFetching } = useGetThOverviewCampaignLeadsQuery();
  const { data: thOverviewTeamPerformance, isLoading: isTeamPerfLoading, isFetching: isTeamPerfFetching } = useGetThOverviewTeamPerformanceQuery();
  const { data: thOverviewRevenueTrend, isLoading: isTrendLoading, isFetching: isTrendFetching } = useGetThOverviewRevenueTrendQuery();
  const { data: thOverviewSlaRisks, isLoading: isSlaRisksLoading, isFetching: isSlaRisksFetching } = useGetThOverviewSlaRisksQuery();
  const { data: thOverviewActivityFeed, isLoading: isActivityLoading, isFetching: isActivityFetching } = useGetThOverviewActivityFeedQuery();
  const { data: thOverviewTeamPulse, isLoading: isTeamPulseLoading, isFetching: isTeamPulseFetching } = useGetThOverviewTeamPulseQuery();

  const showRevLoading = isRevLoading || isRevFetching;
  const showCampaignLoading = isCampaignLoading || isCampaignFetching;
  const showTeamPerfLoading = isTeamPerfLoading || isTeamPerfFetching;
  const showTrendLoading = isTrendLoading || isTrendFetching;
  const showSlaRisksLoading = isSlaRisksLoading || isSlaRisksFetching;
  const showActivityLoading = isActivityLoading || isActivityFetching;
  const showTeamPulseLoading = isTeamPulseLoading || isTeamPulseFetching;

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
  const activeCallersCount = thOverviewTeamPulse?.data?.length ?? thOverviewTeamPulse?.length ?? kpis?.activeCallers ?? 12;

  // Extract dynamic process/revenue metrics
  const revData = thOverviewRevenue?.data || thOverviewRevenue;
  const monthlyData = revData?.monthly || revData;
  const teamPerf = thOverviewTeamPerformance?.data || thOverviewTeamPerformance;
  const welcomeCallData = overviewData?.revenue?.by_process?.['welcome-call'];
  const transporterData = overviewData?.revenue?.by_process?.['transporter'];
  const specialData = overviewData?.revenue?.by_process?.['special'];
  const matchmakingData = overviewData?.revenue?.by_process?.['match-making'];

  const getVal = (val: any, fallback: number = 0): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? fallback : parsed;
    }
    if (val && typeof val === 'object') {
      if ('revenue' in val) return getVal(val.revenue, fallback);
      if ('amount' in val) return getVal(val.amount, fallback);
      if ('collection' in val) return getVal(val.collection, fallback);
      if ('collected' in val) return getVal(val.collected, fallback);
      if ('sales' in val) return getVal(val.sales, fallback);
    }
    return fallback;
  };

  const getTarget = (val: any, fallback: number = 0): number => {
    if (typeof val === 'number') return val;
    if (typeof val === 'string') {
      const parsed = parseFloat(val);
      return isNaN(parsed) ? fallback : parsed;
    }
    if (val && typeof val === 'object') {
      if ('target' in val) return getTarget(val.target, fallback);
      if ('limit' in val) return getTarget(val.limit, fallback);
      if ('goal' in val) return getTarget(val.goal, fallback);
    }
    return fallback;
  };

  // ── Revenue Control Bar: sourced ONLY from collection-by API (monthlyData) ──
  const barDwSales = getVal(monthlyData?.driver, 0);
  const barDwTarget = getTarget(monthlyData?.driver, 0) || welcomeCallData?.target || 200000;
  const barTrSales = getVal(monthlyData?.transporter, 0);
  const barTrTarget = getTarget(monthlyData?.transporter, 0) || transporterData?.target || 200000;
  const barScSales = getVal(monthlyData?.others, 0);
  const barScTarget = getTarget(monthlyData?.others, 0) || specialData?.target || 50000;
  const barMmSales = getVal(monthlyData?.match_making, 0);
  const barMmTarget = getTarget(monthlyData?.match_making, 0) || matchmakingData?.target || 350000;
  const totalSalesAchieved = barDwSales + barTrSales + barScSales + barMmSales;

  // ── Process Cards: sourced ONLY from team-performance API ──
  const dwSales = teamPerf?.welcome_call?.revenue ?? 0;
  const dwTarget = teamPerf?.welcome_call?.target ?? 200000;
  const dwTlName = teamPerf?.welcome_call?.tl_name ?? 'Harneet Kaur';
  const dwCallsToday = teamPerf?.welcome_call?.calls_today ?? 0;
  const dwConvPct = teamPerf?.welcome_call?.conv_pct ?? 0;
  const dwRegistrations = teamPerf?.welcome_call?.registrations_today ?? 0;

  const trSales = teamPerf?.transporter?.revenue ?? 0;
  const trTarget = teamPerf?.transporter?.target ?? 200000;
  const trTlName = teamPerf?.transporter?.tl_name ?? 'Demo User (TL)';
  const trCallsToday = teamPerf?.transporter?.calls_today ?? 0;
  const trConvPct = teamPerf?.transporter?.conv_pct ?? 0;
  const trRegistrations = teamPerf?.transporter?.registrations_today ?? 0;

  const scSales = teamPerf?.special?.revenue ?? 0;
  const scTarget = teamPerf?.special?.target ?? 50000;
  const scTlName = teamPerf?.special?.tl_name ?? 'Open Position';
  const scCallsToday = teamPerf?.special?.calls_today ?? 0;
  const scConvPct = teamPerf?.special?.conv_pct ?? 0;

  const mmSales = teamPerf?.match_making?.revenue ?? 0;
  const mmTarget = teamPerf?.match_making?.target ?? 350000;
  const mmTlName = teamPerf?.match_making?.tl_name ?? 'Demo User (TL)';
  const mmCallsToday = teamPerf?.match_making?.calls_today ?? 0;
  const mmConvPct = teamPerf?.match_making?.conv_pct ?? 0;
  const mmJobsPosted = teamPerf?.match_making?.jobs_posted_today ?? 0;

  // Extract campaign leads command strip metrics
  const campaignLeads = thOverviewCampaignLeads?.data || thOverviewCampaignLeads;
  const driversRegistered = campaignLeads?.driversCount ?? campaignLeads?.drivers ?? campaignLeads?.driversRegistered ?? breakdown?.driversCount ?? 1420;
  const transportersRegistered = campaignLeads?.transportersCount ?? campaignLeads?.transporters ?? campaignLeads?.transportersRegistered ?? breakdown?.transportersCount ?? 650;
  const postedJobsCount = campaignLeads?.postedJobsCount ?? campaignLeads?.postedJobs ?? campaignLeads?.postedJobsCount ?? breakdown?.postedJobsCount ?? 180;

  const totalReceived = campaignLeads?.total_received ?? campaignLeads?.totalReceived ?? campaignLeads?.total ?? 3840;
  const hotUncalled = campaignLeads?.hot_uncalled ?? campaignLeads?.hotUncalled ?? campaignLeads?.hot ?? 12;
  const warmLeads = campaignLeads?.warm_leads ?? campaignLeads?.warmLeads ?? campaignLeads?.warm ?? 410;
  const coldLeads = campaignLeads?.cold_leads ?? campaignLeads?.coldLeads ?? campaignLeads?.cold ?? 1230;
  const convertedLeads = campaignLeads?.converted ?? campaignLeads?.convertedLeads ?? 540;

  const formatLakhOrK = (value: number) => {
    if (value >= 100000) {
      return `${(value / 100000).toFixed(2)}L`;
    }
    return `${(value / 1000).toFixed(0)}k`;
  };

  const safeLocaleString = (val: any) => {
    if (val === null || val === undefined) return '0';
    return Number(val).toLocaleString();
  };

  // Custom alert lists
  const alerts = [
    { id: 'campaign-sla', text: `🔥 SLA Alert: ${overviewData?.sla_alerts?.total || 12} Hot Campaign Leads uncalled for > 1 hour!`, actionText: 'Assign & Nudge →', severity: 'red' },
    { id: 'untagged', text: `⚠ ${overviewData?.calls?.untagged_today || 7} calls untagged across all teams.`, actionText: 'View by Team →', severity: 'red' },
    { id: 'sla', text: `⚠ ${overviewData?.sla_alerts?.total || 2} active SLA breaches — Transporter first-call and Job SLA.`, actionText: 'View →', severity: 'red' },
    { id: 'backlog', text: `${safeLocaleString(overviewData?.team?.backlog_leads || 37384)} uncalled leads in backlog.`, actionText: 'Launch Sprint →', severity: 'orange' },
    { id: 'hiring', text: `⚠ ${overviewData?.team?.open_positions || 2} CRITICAL open roles unfilled beyond target hire week.`, actionText: 'View Hiring →', severity: 'amber' },
    ...notificationsList.map((n: any) => ({
      id: `notif-${n.id}`,
      text: `🔔 ${n.title}: ${n.message}`,
      actionText: 'View Detail →',
      actionUrl: '/th/notifications-alerts-center',
      severity: n.type === 'critical' || n.type === 'error' ? 'red' : n.type === 'admin' ? 'amber' : 'orange'
    }))
  ];

  const handleDismissAlert = (id: string) => {
    setDismissedAlerts(prev => [...prev, id]);
  };

  // Stacked chart daily data (representing DW, TR, SC, MM revenue portions)
  const trendData = thOverviewRevenueTrend?.data || thOverviewRevenueTrend;
  // Map revenue-trend API: {day, dw, tr, sc, mm} — compute total since API doesn't include it
  const rawTrendData = Array.isArray(thOverviewRevenueTrend?.data)
    ? thOverviewRevenueTrend.data
    : Array.isArray(thOverviewRevenueTrend)
      ? thOverviewRevenueTrend
      : null;
  const stackedChartData = rawTrendData && rawTrendData.length > 0
    ? rawTrendData.map((d: any) => ({
        day: d.day,
        dw: Number(d.dw) || 0,
        tr: Number(d.tr) || 0,
        sc: Number(d.sc) || 0,
        mm: Number(d.mm) || 0,
        total: (Number(d.dw) || 0) + (Number(d.tr) || 0) + (Number(d.sc) || 0) + (Number(d.mm) || 0),
      }))
    : [
        { day: 'MON', dw: 8000, tr: 12000, sc: 2000, mm: 8000, total: 30000 },
        { day: 'TUE', dw: 10000, tr: 15000, sc: 3500, mm: 14000, total: 42500 },
        { day: 'WED', dw: 9000, tr: 13000, sc: 3000, mm: 10000, total: 35000 },
        { day: 'THU', dw: 12000, tr: 18000, sc: 4500, mm: 13000, total: 47500 },
        { day: 'FRI', dw: 5000, tr: 8000, sc: 2000, mm: 5000, total: 20000 },
        { day: 'SAT', dw: 10000, tr: 14000, sc: 3500, mm: 10000, total: 37500 },
        { day: 'SUN', dw: 11000, tr: 15000, sc: 4000, mm: 11000, total: 41000 },
      ];
  // Dynamic Y-axis ceiling: round up to nearest 10k above the max daily total
  const maxDayTotal = Math.max(...stackedChartData.map((d: any) => d.total), 1);
  const yMax = Math.ceil(maxDayTotal / 10000) * 10000;

  // Map live activity events from overview
  const activityFeed = thOverviewActivityFeed?.data || thOverviewActivityFeed;
  const activityEvents: ActivityEvent[] = Array.isArray(activityFeed) && activityFeed.length > 0 ? activityFeed.map((feed: any) => ({
    id: feed.id?.toString() || Math.random().toString(),
    process: (feed.process === 'welcome-call' ? 'DW' : feed.process === 'transporter' ? 'TR' : feed.process === 'match-making' ? 'MM' : feed.process || 'SC') as any,
    caller: feed.caller_name || feed.caller || 'System',
    text: feed.text || `${feed.call_status === 'connected' ? 'connected with' : 'dialed'} ${feed.lead_name || 'customer'} (${feed.lead_tmid || ''})`,
    time: feed.time || (feed.updated_at ? feed.updated_at.split(' ')[1] : 'Just now')
  })) : (overviewData?.live_feed?.map(feed => ({
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
  ]);

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

  // API response: { status: true, data: { active_risks: 5, risks: [...] } }
  const slaRisksData = thOverviewSlaRisks?.data?.risks || thOverviewSlaRisks?.risks;
  const slaRiskItems: SlaRiskItem[] = Array.isArray(slaRisksData) && slaRisksData.length > 0
    ? slaRisksData.map((item: any) => ({
        id: (item.id || '').toString().replace(/^#/, ''),
        type: item.type || 'SLA Breach',
        process: (item.process as any) || 'TR',
        partyName: item.party || item.partyName || item.name || 'Unknown',
        timeLeft: item.time_left || item.timeLeft || 'Overdue',
        severity: item.severity || (item.sla_status === 'CRITICAL' ? 'high' : 'high')
      }))
    : [...trSlaList, ...mmSlaList];

  // No hardcoded fallback — show empty state in UI instead


  // Map live callers / Team Pulse
  const teamPulse = thOverviewTeamPulse?.data || thOverviewTeamPulse;
  const agentsList = Array.isArray(teamPulse) && teamPulse.length > 0 ? teamPulse.map((caller: any) => ({
    name: (caller.name || 'Agent').substring(0, 2).toUpperCase(),
    fullName: caller.name || 'Agent',
    role: caller.process === 'welcome-call' ? 'DW' : caller.process === 'transporter' ? 'TR' : caller.process === 'match-making' ? 'MM' : caller.process === 'special' ? 'SC' : caller.role || 'TL',
    status: caller.live_status === 'On Call' ? 'busy' : caller.live_status === 'Idle' ? 'online' : caller.status || 'offline'
  })) : (teamMonitorData?.data?.map(caller => ({
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
  ]);

  const handleAlertAction = (id: string, actionUrl?: string) => {
    if (actionUrl) {
      navigate(actionUrl);
    } else if (id === 'campaign-sla') {
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

  const isPageLoading = isRevLoading && isCampaignLoading && isTeamPerfLoading && isTrendLoading;

  if (isPageLoading) {
    return <PageCardSkeleton cards={6} title="Overview Dashboard" />;
  }

  return (
    <main className="bg-background p-md space-y-lg text-xs font-sans max-w-[1440px] mx-auto">

      {/* 2. Revenue Command Bar */}
      {showRevLoading ? (
        <section className="bg-white p-md rounded-sm border border-outline-variant flipkart-shadow animate-pulse space-y-md">
          <div className="flex justify-between items-center">
            <div className="space-y-xs w-1/3">
              <div className="h-3 bg-slate-200 rounded"></div>
              <div className="h-6 bg-slate-200 rounded w-3/4"></div>
            </div>
            <div className="h-4 bg-slate-200 rounded w-1/4"></div>
          </div>
          <div className="h-6 w-full bg-slate-200 rounded-sm"></div>
          <div className="h-3 bg-slate-200 rounded w-1/3 mx-auto"></div>
        </section>
      ) : (
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
                    <span>₹{safeLocaleString(totalSalesAchieved)}</span>
                    <span className="text-outline text-xs font-medium">of ₹{safeLocaleString(adminSalesTarget)} target ({pctAchieved}% achieved)</span>
                    <span className="text-outline text-xs font-semibold ml-sm font-data-mono">| Today's Calls: {totalCalls} ({connectedCalls} Connected, {answeredPercentage}% Connected)</span>
                  </p>
                );
              })()}
            </div>
            {selectedSegment && (
              <button
                onClick={() => { setSelectedSegment(null); setFeedFilter('ALL'); }}
                className="text-xs text-primary font-bold hover:underline"
              >
                ✕ Clear Filter [Showing: {selectedSegment}]
              </button>
            )}
          </div>

          {/* Segmented Horizontal Progress Bar */}
          <div className="h-6 w-full bg-surface-container rounded-sm overflow-hidden flex cursor-pointer select-none">
            {(totalSalesAchieved === 0 || barDwSales > 0) && (
              <div
                onClick={() => { setSelectedSegment('DW'); setFeedFilter('DW'); }}
                className={`h-full bg-green-500 flex items-center justify-center text-white font-extrabold transition-all duration-300 ${selectedSegment === 'DW' ? 'opacity-100 ring-2 ring-inset ring-black scale-y-110' : selectedSegment ? 'opacity-40' : 'hover:opacity-90'
                  }`}
                style={{ width: `${totalSalesAchieved > 0 ? (barDwSales / totalSalesAchieved) * 100 : 25}%` }}
                title={`DW (Driver Welcome) — ₹${safeLocaleString(barDwSales)} / Target: ₹${safeLocaleString(barDwTarget)}`}
              >
                DW (₹{formatLakhOrK(barDwSales)})
              </div>
            )}
            {(totalSalesAchieved === 0 || barTrSales > 0) && (
              <div
                onClick={() => { setSelectedSegment('TR'); setFeedFilter('TR'); }}
                className={`h-full bg-orange-500 flex items-center justify-center text-white font-extrabold transition-all duration-300 ${selectedSegment === 'TR' ? 'opacity-100 ring-2 ring-inset ring-black scale-y-110' : selectedSegment ? 'opacity-40' : 'hover:opacity-90'
                  }`}
                style={{ width: `${totalSalesAchieved > 0 ? (barTrSales / totalSalesAchieved) * 100 : 45}%` }}
                title={`TR (Transporter Welcome) — ₹${safeLocaleString(barTrSales)} / Target: ₹${safeLocaleString(barTrTarget)}`}
              >
                TR (₹{formatLakhOrK(barTrSales)})
              </div>
            )}
            {(totalSalesAchieved === 0 || barScSales > 0) && (
              <div
                onClick={() => { setSelectedSegment('SC'); setFeedFilter('SC'); }}
                className={`h-full bg-teal-500 flex items-center justify-center text-white font-extrabold transition-all duration-300 ${selectedSegment === 'SC' ? 'opacity-100 ring-2 ring-inset ring-black scale-y-110' : selectedSegment ? 'opacity-40' : 'hover:opacity-90'
                  }`}
                style={{ width: `${totalSalesAchieved > 0 ? (barScSales / totalSalesAchieved) * 100 : 5}%` }}
                title={`SC (Special Categories) — ₹${safeLocaleString(barScSales)} / Target: ₹${safeLocaleString(barScTarget)}`}
              >
                SC (₹{formatLakhOrK(barScSales)})
              </div>
            )}
            {(totalSalesAchieved === 0 || barMmSales > 0) && (
              <div
                onClick={() => { setSelectedSegment('MM'); setFeedFilter('MM'); }}
                className={`h-full bg-purple-500 flex items-center justify-center text-white font-extrabold transition-all duration-300 ${selectedSegment === 'MM' ? 'opacity-100 ring-2 ring-inset ring-black scale-y-110' : selectedSegment ? 'opacity-40' : 'hover:opacity-90'
                  }`}
                style={{ width: `${totalSalesAchieved > 0 ? (barMmSales / totalSalesAchieved) * 100 : 25}%` }}
                title={`MM (Matchmaking) — ₹${safeLocaleString(barMmSales)} / Target: ₹${safeLocaleString(barMmTarget)}`}
              >
                MM (₹{formatLakhOrK(barMmSales)})
              </div>
            )}
          </div>
          <p className="text-[10px] text-outline mt-sm font-semibold text-center">
            *Segments are sized based on current share of achievements. Click a segment to filter team metrics below.
          </p>
        </section>
      )}

      {/* Campaign Health Strip */}
      {showCampaignLoading ? (
        <section className="bg-white border border-outline-variant p-3 rounded-sm flipkart-shadow flex flex-col md:flex-row justify-between items-center gap-sm animate-pulse">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-slate-200"></div>
            <div className="space-y-xs">
              <div className="h-3 bg-slate-200 rounded w-32"></div>
              <div className="h-2.5 bg-slate-200 rounded w-48"></div>
            </div>
          </div>
          <div className="flex gap-md flex-wrap items-center">
            {[1, 2, 3, 4, 5].map((idx) => (
              <div key={idx} className="bg-slate-100 px-3 py-1.5 rounded border border-slate-200 text-center min-w-[80px] h-[38px]"></div>
            ))}
          </div>
        </section>
      ) : (
        <section className="bg-white border border-outline-variant text-on-surface p-3 rounded-sm flipkart-shadow flex flex-col md:flex-row justify-between items-center gap-sm">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-xl text-primary animate-pulse">campaign</span>
            <div>
              <h4 className="font-bold text-xs uppercase tracking-wider text-slate-800">Campaign Leads Command Strip</h4>
              <p className="text-[10px] text-slate-500 font-semibold">Real-time status of marketing campaign inbound leads</p>
            </div>
          </div>

          <div className="flex gap-md flex-wrap items-center text-xs">
            <div className="bg-slate-50 px-3 py-1.5 rounded border border-slate-200 text-center min-w-[80px]">
              <span className="block text-slate-500 text-[9px] uppercase font-bold">Total Received</span>
              <span className="font-extrabold font-data-mono text-sm text-slate-800">{totalReceived.toLocaleString()}</span>
            </div>
            <div className="bg-red-50 px-3 py-1.5 rounded border border-red-200 text-center min-w-[80px] animate-pulse">
              <span className="block text-red-600 text-[9px] uppercase font-bold">🔥 Hot Uncalled</span>
              <span className="font-extrabold font-data-mono text-sm text-red-600">{hotUncalled.toLocaleString()}</span>
            </div>
            <div className="bg-amber-50 px-3 py-1.5 rounded border border-amber-200 text-center min-w-[80px]">
              <span className="block text-amber-700 text-[9px] uppercase font-bold">Warm Leads</span>
              <span className="font-extrabold font-data-mono text-sm text-amber-700">{warmLeads.toLocaleString()}</span>
            </div>
            <div className="bg-slate-50 px-3 py-1.5 rounded border border-slate-200 text-center min-w-[80px]">
              <span className="block text-slate-500 text-[9px] uppercase font-bold">Cold Leads</span>
              <span className="font-extrabold font-data-mono text-sm text-slate-700">{coldLeads.toLocaleString()}</span>
            </div>
            <div className="bg-emerald-50 px-3 py-1.5 rounded border border-emerald-200 text-center min-w-[80px]">
              <span className="block text-emerald-700 text-[9px] uppercase font-bold">Converted</span>
              <span className="font-extrabold font-data-mono text-sm text-emerald-600">{convertedLeads.toLocaleString()}</span>
            </div>
          </div>

          <Link
            to="/th/global-campaign-console"
            className="bg-primary text-on-primary px-3 py-1.5 rounded-sm font-extrabold hover:opacity-90 transition-opacity text-[10px] uppercase shadow-sm whitespace-nowrap"
          >
            Open Console →
          </Link>
        </section>
      )}

      {/* 3. Four-Process Snapshot Row */}
      {showTeamPerfLoading ? (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-md">
          {[1, 2, 3, 4].map((idx) => (
            <div key={idx} className="bg-white border-t-[4px] border-t-slate-200 border-x border-b border-outline-variant p-md rounded-sm flipkart-shadow h-[155px] animate-pulse flex flex-col justify-between">
              <div className="space-y-sm">
                <div className="flex justify-between items-center">
                  <div className="h-3 bg-slate-200 rounded w-1/2"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-slate-200"></div>
                </div>
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
                <div className="h-3 bg-slate-200 rounded w-1/3"></div>
              </div>
              <div className="border-t border-outline-variant pt-sm flex justify-between items-center">
                <div className="h-3 bg-slate-200 rounded w-2/3"></div>
                <div className="h-3 bg-slate-200 rounded w-1/4"></div>
              </div>
            </div>
          ))}
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-4 gap-md">
          {/* Card 1: Driver Welcome */}
          <div
            onClick={() => { setSelectedSegment(selectedSegment === 'DW' ? null : 'DW'); setFeedFilter(selectedSegment === 'DW' ? 'ALL' : 'DW'); }}
            className={`bg-white border-t-[4px] border-t-green-500 border-x border-b border-outline-variant p-md rounded-sm flipkart-shadow flex flex-col justify-between h-[155px] cursor-pointer transition-all duration-300 ${
              selectedSegment && selectedSegment !== 'DW' ? 'opacity-35 scale-[0.98]' : selectedSegment === 'DW' ? 'ring-2 ring-green-500 shadow-lg scale-[1.02]' : 'hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-green-700 text-xs">Driver Welcome</span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" title="SLA optimal"></span>
              </div>
              <p className="font-data-mono text-sm font-extrabold mt-sm">₹{safeLocaleString(dwSales)} <span className="text-outline text-[10px] font-medium">/ ₹{formatLakhOrK(dwTarget)}</span></p>
              <p className="text-outline mt-xs text-[10px] font-semibold truncate max-w-full" title={`TL: ${dwTlName}`}>TL: {dwTlName}</p>
            </div>
            <div className="mt-md pt-sm border-t border-outline-variant flex justify-between items-center text-[10px]">
              <span>Calls today: <strong className="font-bold">{dwCallsToday}</strong> · Reg: <strong className="font-bold font-data-mono">{dwRegistrations}</strong></span>
              <span className="text-green-600 font-bold">{dwConvPct}% Conv</span>
            </div>
            <Link to="/tl/tl-overview-dashboard?team=dw" onClick={e => e.stopPropagation()} className="text-primary hover:underline font-bold mt-sm block text-[10px] text-right">Enter Team View →</Link>
          </div>

          {/* Card 2: Transporter Welcome */}
          <div
            onClick={() => { setSelectedSegment(selectedSegment === 'TR' ? null : 'TR'); setFeedFilter(selectedSegment === 'TR' ? 'ALL' : 'TR'); }}
            className={`bg-white border-t-[4px] border-t-orange-500 border-x border-b border-outline-variant p-md rounded-sm flipkart-shadow flex flex-col justify-between h-[155px] cursor-pointer transition-all duration-300 ${
              selectedSegment && selectedSegment !== 'TR' ? 'opacity-35 scale-[0.98]' : selectedSegment === 'TR' ? 'ring-2 ring-orange-500 shadow-lg scale-[1.02]' : 'hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-orange-700 text-xs">Transporter Welcome</span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" title="SLA optimal"></span>
              </div>
              <p className="font-data-mono text-sm font-extrabold mt-sm">₹{safeLocaleString(trSales)} <span className="text-outline text-[10px] font-medium">/ ₹{formatLakhOrK(trTarget)}</span></p>
              <p className="text-outline mt-xs text-[10px] font-semibold truncate max-w-full" title={`TL: ${trTlName}`}>TL: {trTlName}</p>
            </div>
            <div className="mt-md pt-sm border-t border-outline-variant flex justify-between items-center text-[10px]">
              <span>Calls today: <strong className="font-bold">{trCallsToday}</strong> · Reg: <strong className="font-bold font-data-mono">{trRegistrations}</strong></span>
              <span className="text-green-600 font-bold">{trConvPct}% Conv</span>
            </div>
            <Link to="/tl/tl-overview-dashboard?team=tr" onClick={e => e.stopPropagation()} className="text-primary hover:underline font-bold mt-sm block text-[10px] text-right">Enter Team View →</Link>
          </div>

          {/* Card 3: Special Categories */}
          <div
            onClick={() => { setSelectedSegment(selectedSegment === 'SC' ? null : 'SC'); setFeedFilter(selectedSegment === 'SC' ? 'ALL' : 'SC'); }}
            className={`bg-white border-t-[4px] border-t-teal-500 border-x border-b border-outline-variant p-md rounded-sm flipkart-shadow flex flex-col justify-between h-[155px] cursor-pointer transition-all duration-300 ${
              selectedSegment && selectedSegment !== 'SC' ? 'opacity-35 scale-[0.98]' : selectedSegment === 'SC' ? 'ring-2 ring-teal-500 shadow-lg scale-[1.02]' : 'hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-teal-700 text-xs">Special Categories</span>
                <span className="w-2.5 h-2.5 rounded-full bg-orange-500" title="SLA warning"></span>
              </div>
              <p className="font-data-mono text-sm font-extrabold mt-sm">₹{safeLocaleString(scSales)} <span className="text-outline text-[10px] font-medium">/ ₹{formatLakhOrK(scTarget)}</span></p>
              <p className="text-red-600 font-extrabold mt-xs text-[10px] truncate max-w-full" title={`TL: ${scTlName}`}>TL: {scTlName}</p>
            </div>
            <div className="mt-md pt-sm border-t border-outline-variant flex justify-between items-center text-[10px]">
              <span>Calls today: <strong className="font-bold">{scCallsToday}</strong></span>
              <span className="text-red-500 font-bold">{scConvPct}% Conv</span>
            </div>
            <Link to="/tl/tl-overview-dashboard?team=sc" onClick={e => e.stopPropagation()} className="text-primary hover:underline font-bold mt-sm block text-[10px] text-right">Enter Team View →</Link>
          </div>

          {/* Card 4: Matchmaking */}
          <div
            onClick={() => { setSelectedSegment(selectedSegment === 'MM' ? null : 'MM'); setFeedFilter(selectedSegment === 'MM' ? 'ALL' : 'MM'); }}
            className={`bg-white border-t-[4px] border-t-purple-500 border-x border-b border-outline-variant p-md rounded-sm flipkart-shadow flex flex-col justify-between h-[155px] cursor-pointer transition-all duration-300 ${
              selectedSegment && selectedSegment !== 'MM' ? 'opacity-35 scale-[0.98]' : selectedSegment === 'MM' ? 'ring-2 ring-purple-500 shadow-lg scale-[1.02]' : 'hover:shadow-md'
            }`}
          >
            <div>
              <div className="flex justify-between items-center">
                <span className="font-bold text-purple-700 text-xs">Matchmaking</span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500" title="SLA optimal"></span>
              </div>
              <p className="font-data-mono text-sm font-extrabold mt-sm">₹{safeLocaleString(mmSales)} <span className="text-outline text-[10px] font-medium">/ ₹{formatLakhOrK(mmTarget)}</span></p>
              <p className="text-outline mt-xs text-[10px] font-semibold truncate max-w-full" title={`TL: ${mmTlName}`}>TL: {mmTlName}</p>
            </div>
            <div className="mt-md pt-sm border-t border-outline-variant flex justify-between items-center text-[10px]">
              <span>Calls today: <strong className="font-bold">{mmCallsToday}</strong> · Jobs: <strong className="font-bold font-data-mono">{mmJobsPosted}</strong></span>
              <span className="text-green-600 font-bold">{mmConvPct}% Conv</span>
            </div>
            <Link to="/tl/tl-overview-dashboard?team=mm" onClick={e => e.stopPropagation()} className="text-primary hover:underline font-bold mt-sm block text-[10px] text-right">Enter Team View →</Link>
          </div>
        </section>
      )}

      {/* 4. Split Section: Live Feed + Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        {/* Left 8-col section */}
        <div className="lg:col-span-8 space-y-md">
          {/* Revenue Trend Chart Section */}
          {showTrendLoading ? (
            <div className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow animate-pulse space-y-md">
              <div className="flex justify-between items-center mb-md">
                <div className="space-y-xs w-1/2">
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-2.5 bg-slate-200 rounded w-full"></div>
                </div>
                <div className="h-6 bg-slate-200 rounded w-24"></div>
              </div>
              <div className="flex gap-sm">
                <div className="flex flex-col justify-between h-60 w-10 text-right">
                  <div className="h-2 bg-slate-200 rounded w-3/4 ml-auto"></div>
                  <div className="h-2 bg-slate-200 rounded w-3/4 ml-auto"></div>
                  <div className="h-2 bg-slate-200 rounded w-3/4 ml-auto"></div>
                  <div className="h-2 bg-slate-200 rounded w-3/4 ml-auto"></div>
                  <div className="h-2 bg-slate-200 rounded w-1/2 ml-auto"></div>
                </div>
                <div className="flex-1 relative h-60 flex items-end justify-between px-md pb-sm border-b border-l border-outline-variant">
                  {[40, 60, 35, 75, 45, 80, 55].map((h, i) => (
                    <div key={i} className="w-12 bg-slate-200 rounded-t-xs" style={{ height: `${h}%` }}></div>
                  ))}
                </div>
              </div>
              <div className="flex justify-between mt-sm pl-[50px]">
                {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                  <div key={i} className="w-12 h-2.5 bg-slate-200 rounded"></div>
                ))}
              </div>
            </div>
          ) : (
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
                  <span>₹{(yMax).toLocaleString()}</span>
                  <span>₹{(yMax * 0.75).toLocaleString()}</span>
                  <span>₹{(yMax * 0.5).toLocaleString()}</span>
                  <span>₹{(yMax * 0.25).toLocaleString()}</span>
                  <span>₹0</span>
                </div>
                <div className="flex-1 relative h-60 flex items-end justify-between px-md pb-sm border-b border-l border-outline-variant">
                  {/* Dashed Target line */}
                  <div className="absolute top-1/4 left-0 w-full border-t border-dashed border-primary/40 z-0"></div>

                  {stackedChartData.map((d) => {
                    const totalVal = Number(d.total) || 0;
                    const dwVal = Number(d.dw) || 0;
                    const trVal = Number(d.tr) || 0;
                    const scVal = Number(d.sc) || 0;
                    const mmVal = Number(d.mm) || 0;

                    const barHeightPct = (totalVal / yMax) * 100;
                    const dwPct = totalVal > 0 ? (dwVal / totalVal) * 100 : 0;
                    const trPct = totalVal > 0 ? (trVal / totalVal) * 100 : 0;
                    const scPct = totalVal > 0 ? (scVal / totalVal) * 100 : 0;
                    const mmPct = totalVal > 0 ? (mmVal / totalVal) * 100 : 0;

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
                            <div className="bg-purple-500 w-full hover:brightness-95 transition-all" style={{ height: `${mmPct}%` }} title={`MM: ₹${mmVal}`}></div>
                            <div className="bg-teal-500 w-full hover:brightness-95 transition-all" style={{ height: `${scPct}%` }} title={`SC: ₹${scVal}`}></div>
                            <div className="bg-orange-500 w-full hover:brightness-95 transition-all" style={{ height: `${trPct}%` }} title={`TR: ₹${trVal}`}></div>
                            <div className="bg-green-500 w-full hover:brightness-95 transition-all" style={{ height: `${dwPct}%` }} title={`DW: ₹${dwVal}`}></div>
                          </div>
                        )}
                        {/* Tooltip */}
                        <span className="absolute -top-12 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 bg-slate-900 text-white text-[9px] p-xs rounded-sm whitespace-nowrap z-50 pointer-events-none transition-opacity duration-200">
                          ₹{safeLocaleString(totalVal)} Total<br />
                          <span className="text-green-400 font-bold">DW: ₹{dwVal}</span> · <span className="text-orange-400 font-bold">TR: ₹{trVal}</span>
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
          )}

          {/* Live Activity Feed */}
          {showActivityLoading ? (
            <div className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow animate-pulse space-y-md">
              <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-xs">
                <div className="space-y-xs w-1/2">
                  <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                  <div className="h-2.5 bg-slate-200 rounded w-full"></div>
                </div>
                <div className="h-6 bg-slate-200 rounded w-24"></div>
              </div>
              <div className="space-y-sm">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex items-center justify-between p-sm border border-outline-variant bg-slate-50/50 rounded-sm">
                    <div className="flex items-center gap-md w-full">
                      <div className="w-7 h-7 rounded-sm bg-slate-200"></div>
                      <div className="space-y-xs flex-1">
                        <div className="h-3 bg-slate-200 rounded w-3/4"></div>
                        <div className="h-2 bg-slate-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
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
          )}
        </div>

        {/* Right 4-col section */}
        <div className="lg:col-span-4 space-y-md">
          {/* SLA Risk Panel */}
          {showSlaRisksLoading ? (
            <div className="bg-white border border-outline-variant rounded-sm flipkart-shadow overflow-hidden flex flex-col h-[320px] animate-pulse">
              <div className="bg-slate-200 px-md py-sm flex justify-between items-center text-white">
                <div className="h-4 bg-slate-300 rounded w-1/2"></div>
                <div className="h-3 bg-slate-300 rounded w-12"></div>
              </div>
              <div className="p-md space-y-md flex-1">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-center border-b border-outline-variant pb-sm">
                    <div className="h-3 bg-slate-200 rounded w-12"></div>
                    <div className="h-3 bg-slate-200 rounded w-8"></div>
                    <div className="h-3 bg-slate-200 rounded w-16"></div>
                    <div className="h-3 bg-slate-200 rounded w-8"></div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white border border-outline-variant rounded-sm flipkart-shadow overflow-hidden flex flex-col h-[320px]">
              <div className="bg-white border-b border-outline-variant px-md py-sm flex justify-between items-center">
                <div className="flex items-center gap-xs font-bold text-red-600">
                  <span className="material-symbols-outlined text-[16px]">warning</span>
                  <span className="uppercase tracking-wider font-bold">SLA Risks (System-Wide)</span>
                </div>
                <span className="text-[10px] font-bold bg-red-50 text-red-600 border border-red-200 px-2 py-0.5 rounded-sm">
                  {slaRiskItems.length} Active
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
                    {slaRiskItems.length === 0 ? (
                      <tr>
                        <td colSpan={4} className="px-sm py-6 text-center text-outline text-[11px] font-semibold">
                          <span className="material-symbols-outlined text-[28px] block mb-1 text-green-500">check_circle</span>
                          No active SLA risks
                        </td>
                      </tr>
                    ) : (
                      slaRiskItems.map(item => (
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Global Team Pulse Grid */}
          {showTeamPulseLoading ? (
            <div className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow animate-pulse space-y-md">
              <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-xs">
                <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                <div className="h-4 bg-slate-200 rounded w-16"></div>
              </div>
              <div className="space-y-md">
                <div>
                  <div className="h-3 bg-slate-200 rounded w-1/3 mb-sm"></div>
                  <div className="grid grid-cols-7 gap-sm">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="h-3 bg-slate-200 rounded w-1/3 mb-sm"></div>
                  <div className="grid grid-cols-7 gap-sm">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="w-8 h-8 rounded-full bg-slate-200 animate-pulse"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
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
                  <h4 className="text-[10px] text-outline font-bold uppercase mb-sm">— Driver Welcome ({agentsList.filter(a => a.role === 'DW').length}) —</h4>
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
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex bg-slate-900 text-white text-[9px] py-1 px-2 rounded-sm whitespace-nowrap z-[999] pointer-events-none shadow-lg">
                            {agent.fullName} (DW)
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* TR + MM Callers */}
                <div>
                  <h4 className="text-[10px] text-outline font-bold uppercase mb-sm">— Transporter + MM ({agentsList.filter(a => a.role === 'MM' || a.role === 'SC').length}) —</h4>
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
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex bg-slate-900 text-white text-[9px] py-1 px-2 rounded-sm whitespace-nowrap z-[999] pointer-events-none shadow-lg">
                            {agent.fullName} ({agent.role})
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Other roles */}
                <div>
                  <h4 className="text-[10px] text-outline font-bold uppercase mb-sm">— TLs & QC ({agentsList.filter(a => a.role === 'TL' || a.role === 'QC').length}) —</h4>
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
                          <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 hidden group-hover:flex bg-slate-900 text-white text-[9px] py-1 px-2 rounded-sm whitespace-nowrap z-[999] pointer-events-none shadow-lg">
                            {agent.fullName} ({agent.role})
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
};

export default ThHomeDashboard;
