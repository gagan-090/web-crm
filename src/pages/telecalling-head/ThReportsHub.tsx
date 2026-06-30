import React, { useState } from 'react';
import { useGetThReportRevenueAnalysisQuery, useGetThReportTransactionsQuery, useGetThReportFunnelQuery, useGetThReportBenchmarkingQuery } from '../../services/api/teleheadApi';

type TabType = 'revenue' | 'funnel' | 'benchmarking' | 'qc' | 'incentive' | 'attendance';

export const ThReportsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('revenue');
  const [dateFilter, setDateFilter] = useState<'oct' | 'sep' | 'all'>('oct');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [processFilter, setProcessFilter] = useState<string>('All');
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>('All');
  const [txPage, setTxPage] = useState<number>(1);

  const formatProcessLabel = (proc: string) => {
    switch (proc) {
      case 'Fulfillment': return 'Driver';
      case 'Inbound Sales': return 'Transporter';
      case 'Urgent Lead': return 'Special Category';
      case 'Recovery': return 'Matchmaking';
      default: return proc;
    }
  };

  const navItems: { id: TabType; label: string; icon: string }[] = [
    { id: 'revenue', label: 'Revenue Report', icon: 'payments' },
    { id: 'funnel', label: 'Funnel Report', icon: 'filter_alt' },
    { id: 'benchmarking', label: 'Caller Benchmarking', icon: 'monitoring' },
    { id: 'qc', label: 'QC Trend', icon: 'trending_up' },
    { id: 'incentive', label: 'Incentive Summary', icon: 'redeem' },
    { id: 'attendance', label: 'Attendance', icon: 'event_available' },
  ];

  // Dynamic values depending on selected Date Filter
  const getMetrics = () => {
    switch (dateFilter) {
      case 'sep':
        return {
          fulfillment: '65%',
          inboundSales: '75%',
          urgentLead: '45%',
          recovery: '70%',
          totalRev: '850K',
          digitalAds: '40%',
          referral: '35%',
          offline: '25%',
          amitRev: '₹1.8L',
          amitWidth: '65%',
          priyaRev: '₹1.5L',
          priyaWidth: '55%',
          sureshRev: '₹1.2L',
          sureshWidth: '45%',
          dateLabel: 'Sep 01 - Sep 30, 2023',
          gradient: 'conic-gradient(#0056c3 0% 40%, #fd661d 40% 75%, #a73a00 75% 100%)',
        };
      case 'all':
        return {
          fulfillment: '90%',
          inboundSales: '80%',
          urgentLead: '85%',
          recovery: '55%',
          totalRev: '2.05M',
          digitalAds: '43%',
          referral: '32%',
          offline: '25%',
          amitRev: '₹4.2L',
          amitWidth: '95%',
          priyaRev: '₹3.4L',
          priyaWidth: '80%',
          sureshRev: '₹2.9L',
          sureshWidth: '70%',
          dateLabel: 'All Time',
          gradient: 'conic-gradient(#0056c3 0% 43%, #fd661d 43% 75%, #a73a00 75% 100%)',
        };
      case 'oct':
      default:
        return {
          fulfillment: '85%',
          inboundSales: '60%',
          urgentLead: '95%',
          recovery: '40%',
          totalRev: '1.2M',
          digitalAds: '45%',
          referral: '30%',
          offline: '25%',
          amitRev: '₹2.4L',
          amitWidth: '85%',
          priyaRev: '₹1.9L',
          priyaWidth: '70%',
          sureshRev: '₹1.7L',
          sureshWidth: '60%',
          dateLabel: 'Oct 01 - Oct 31, 2023',
          gradient: 'conic-gradient(#0056c3 0% 45%, #fd661d 45% 75%, #a73a00 75% 100%)',
        };
    }
  };

  const formatRevenue = (val: number) => {
    if (val >= 10000000) return `₹${(val / 10000000).toFixed(2)}Cr`;
    if (val >= 100000) return `₹${(val / 100000).toFixed(2)}L`;
    if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`;
    return `₹${val}`;
  };

  // Full exact number with Indian formatting for tooltips (e.g. ₹45,200)
  const formatRevenueExact = (val: number) =>
    `₹${val.toLocaleString('en-IN')}`;

  const { data: apiData, isLoading: isRevLoading, isFetching: isRevFetching } = useGetThReportRevenueAnalysisQuery();
  const apiRevenue = apiData?.data || apiData;

  const { data: apiFunnelData, isLoading: isFunnelLoading, isFetching: isFunnelFetching } = useGetThReportFunnelQuery();
  const apiFunnel = apiFunnelData?.data || apiFunnelData;

  const { data: apiBenchmarksData, isLoading: isBenchmarksLoading, isFetching: isBenchmarksFetching } = useGetThReportBenchmarkingQuery();
  const apiBenchmarks = apiBenchmarksData?.data || apiBenchmarksData;

  const metrics = getMetrics();

  // Parse funnel values (live or static fallbacks)
  const funnelStages = apiFunnel?.funnel_stages || {};
  const convRates = apiFunnel?.conversion_rates || {};

  const funnelData = {
    ingestedAssigned: funnelStages.leads_ingested?.count ?? 125000,
    ingestedAssignedPct: funnelStages.leads_ingested?.percentage ?? 100,
    contacted: funnelStages.contacted?.count ?? 82400,
    contactedPct: funnelStages.contacted?.percentage ?? 65.9,
    interested: funnelStages.interested?.count ?? 24700,
    interestedPct: funnelStages.interested?.percentage ?? 19.8,
    subscribed: funnelStages.subscribed?.count ?? 8650,
    subscribedPct: funnelStages.subscribed?.percentage ?? 6.9,
    contactabilityRate: convRates.contactability_rate ?? 76.1,
    callToInterestRate: convRates.call_to_interest_rate ?? 30.0,
    overallLeadToSale: convRates.overall_lead_to_sale ?? 6.9,
  };

  // Static fallback raw revenue values (used when API is unavailable)
  const fallbackRaw = { driver: 45200, transporter: 32150, special_category: 88900, matchmaking: 35200 };

  console.log('API Revenue Response:', apiRevenue);

  // Overlay API data if available
  let dynamicMetrics = { ...metrics } as any;
  let callersList = [
    { name: 'Amit Sharma', target: 250000, achieved: 240000 },
    { name: 'Priya Verma', target: 270000, achieved: 190000 },
    { name: 'Suresh Raina', target: 280000, achieved: 170000 }
  ];

  if (apiRevenue) {
    const rByProcess = apiRevenue.revenue_by_process || {};
    const maxVal = Math.max(
      rByProcess.driver || 1,
      rByProcess.transporter || 1,
      rByProcess.special_category || 1,
      rByProcess.matchmaking || 1
    );

    dynamicMetrics.fulfillment = rByProcess.driver ? `${((rByProcess.driver / maxVal) * 90).toFixed(0)}%` : '0%';
    dynamicMetrics.inboundSales = rByProcess.transporter ? `${((rByProcess.transporter / maxVal) * 90).toFixed(0)}%` : '0%';
    dynamicMetrics.urgentLead = rByProcess.special_category ? `${((rByProcess.special_category / maxVal) * 90).toFixed(0)}%` : '0%';
    dynamicMetrics.recovery = rByProcess.matchmaking ? `${((rByProcess.matchmaking / maxVal) * 90).toFixed(0)}%` : '0%';

    // Use absolute values formatted as labels (shown above bars) - if 0, show nothing
    dynamicMetrics.fulfillmentLabel = rByProcess.driver ? formatRevenue(rByProcess.driver) : '';
    dynamicMetrics.inboundSalesLabel = rByProcess.transporter ? formatRevenue(rByProcess.transporter) : '';
    dynamicMetrics.urgentLeadLabel = rByProcess.special_category ? formatRevenue(rByProcess.special_category) : '';
    dynamicMetrics.recoveryLabel = rByProcess.matchmaking ? formatRevenue(rByProcess.matchmaking) : '';

    // Raw numbers for tooltip — show exact amount e.g. ₹45,000
    dynamicMetrics.fulfillmentRaw = rByProcess.driver ?? 0;
    dynamicMetrics.inboundSalesRaw = rByProcess.transporter ?? 0;
    dynamicMetrics.urgentLeadRaw = rByProcess.special_category ?? 0;
    dynamicMetrics.recoveryRaw = rByProcess.matchmaking ?? 0;

    if (apiRevenue.source_attribution) {
      const src = apiRevenue.source_attribution;
      dynamicMetrics.totalRev = typeof src.total_revenue === 'number' ? formatRevenue(src.total_revenue) : metrics.totalRev;
      dynamicMetrics.digitalAds = typeof src.digital_ads_pct === 'number' ? `${src.digital_ads_pct}%` : metrics.digitalAds;
      dynamicMetrics.referral = typeof src.referral_pct === 'number' ? `${src.referral_pct}%` : metrics.referral;
      dynamicMetrics.offline = typeof src.offline_pct === 'number' ? `${src.offline_pct}%` : metrics.offline;

      const dAds = src.digital_ads_pct || 0;
      const ref = src.referral_pct || 0;
      dynamicMetrics.gradient = `conic-gradient(#0056c3 0% ${dAds}%, #fd661d ${dAds}% ${dAds + ref}%, #a73a00 ${dAds + ref}% 100%)`;
    } else {
      dynamicMetrics.totalRev = formatRevenue(114000);
      dynamicMetrics.digitalAds = '45%';
      dynamicMetrics.referral = '30%';
      dynamicMetrics.offline = '25%';
      dynamicMetrics.gradient = 'conic-gradient(#0056c3 0% 45%, #fd661d 45% 75%, #a73a00 75% 100%)';
    }

    if (Array.isArray(apiRevenue.top_callers) && apiRevenue.top_callers.length > 0) {
      callersList = apiRevenue.top_callers;
    }
  } else {
    dynamicMetrics.fulfillmentLabel = metrics.fulfillment;
    dynamicMetrics.inboundSalesLabel = metrics.inboundSales;
    dynamicMetrics.urgentLeadLabel = metrics.urgentLead;
    dynamicMetrics.recoveryLabel = metrics.recovery;
    // Always use exact raw numbers for tooltip even in fallback
    dynamicMetrics.fulfillmentRaw = fallbackRaw.driver;
    dynamicMetrics.inboundSalesRaw = fallbackRaw.transporter;
    dynamicMetrics.urgentLeadRaw = fallbackRaw.special_category;
    dynamicMetrics.recoveryRaw = fallbackRaw.matchmaking;

    // Use default values matching API format as mockup values
    dynamicMetrics.totalRev = formatRevenue(114000);
    dynamicMetrics.digitalAds = '45%';
    dynamicMetrics.referral = '30%';
    dynamicMetrics.offline = '25%';
    dynamicMetrics.gradient = 'conic-gradient(#0056c3 0% 45%, #fd661d 45% 75%, #a73a00 75% 100%)';
  }

  console.log('API Benchmarks Response:', apiBenchmarksData);

  // Setup caller benchmarks data
  const staticBenchmarks = [
    { name: 'Amit Sharma', role: 'Lvl 4 Senior', initials: 'AS', callsPerDay: 142, convRate: 12.4, avgDuration: '04:12', revenue: 241000, qcScore: 9.2, trend: 'up' },
    { name: 'Priya Verma', role: 'Lvl 3 Associate', initials: 'PV', callsPerDay: 118, convRate: 8.1, avgDuration: '03:45', revenue: 188000, qcScore: 7.8, trend: 'stable' },
    { name: 'Suresh Raina', role: 'Lvl 4 Senior', initials: 'SR', callsPerDay: 156, convRate: 10.2, avgDuration: '05:30', revenue: 172000, qcScore: 6.4, trend: 'down' }
  ];

  const benchmarksList = apiBenchmarks && Array.isArray(apiBenchmarks) ? apiBenchmarks : (apiBenchmarksData === undefined ? staticBenchmarks : []);

  // Fetch transactions from API with pagination parameter
  const { data: apiTxData, isLoading: isTxLoading, isFetching: isTxFetching } = useGetThReportTransactionsQuery({
    page: txPage,
    process: processFilter !== 'All' ? processFilter : undefined,
    lead_type: leadTypeFilter !== 'All' ? leadTypeFilter.toUpperCase() : undefined
  });

  const apiTransactions = apiTxData?.data?.data || apiTxData?.data || apiTxData;

  const staticTransactions = [
    { date: '12/10/2023', caller_name: 'Amit Sharma', process: 'Driver', units: 24, lead_type: 'HOT', revenue: 45200 },
    { date: '12/10/2023', caller_name: 'Priya Verma', process: 'Transporter', units: 18, lead_type: 'WARM', revenue: 32150 },
    { date: '11/10/2023', caller_name: 'Suresh Raina', process: 'Special Category', units: 42, lead_type: 'HOT', revenue: 88900 },
    { date: '08/10/2023', caller_name: 'Amit Sharma', process: 'Matchmaking', units: 12, lead_type: 'COLD', revenue: 15400 },
    { date: '05/10/2023', caller_name: 'Priya Verma', process: 'Driver', units: 30, lead_type: 'WARM', revenue: 52000 },
    { date: '02/10/2023', caller_name: 'Suresh Raina', process: 'Matchmaking', units: 15, lead_type: 'COLD', revenue: 19800 },
    { date: '28/09/2023', caller_name: 'Amit Sharma', process: 'Transporter', units: 20, lead_type: 'HOT', revenue: 38000 },
    { date: '25/09/2023', caller_name: 'Priya Verma', process: 'Special Category', units: 35, lead_type: 'HOT', revenue: 74500 },
  ];

  console.log('API Transactions Response:', apiTxData);

  // Map API response to transaction objects, falling back to staticTransactions only when apiTxData is loading or failed
  const rawTransactionsList = apiTransactions && Array.isArray(apiTransactions) ? apiTransactions : (apiTxData === undefined ? staticTransactions : []);

  // Since filtering is done on the server if query params are sent, we only do client-side filtering if API data isn't active
  const filteredTransactions = rawTransactionsList.filter((t: any) => {
    if (!apiTransactions) {
      // client-side filters for static fallback data
      if (processFilter !== 'All') {
        // match either mapped name or raw process filter
        const mappedName = formatProcessLabel(t.process);
        if (t.process !== processFilter && mappedName !== processFilter) return false;
      }
      if (leadTypeFilter !== 'All' && t.lead_type.toLowerCase() !== leadTypeFilter.toLowerCase()) return false;
    }
    return true;
  });

  return (
    <main className="p-md flex gap-md min-h-[calc(100vh-56px)] bg-background">
      {/* Left Sidebar Navigation */}
      <aside className="w-64 flex-shrink-0 space-y-2">
        <div className="bg-surface p-sm rounded border border-outline-variant shadow-sm">
          <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-sm px-xs font-bold tracking-widest">
            Performance Hub
          </p>
          <div className="space-y-1">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full text-left px-sm py-md font-label-caps text-label-caps flex items-center justify-between rounded transition-all group ${
                    isActive
                      ? 'bg-primary text-white font-bold shadow-sm'
                      : 'text-on-surface-variant hover:bg-surface-container-high'
                  }`}
                  id={`nav-${item.id}`}
                >
                  <span className="flex items-center gap-sm">
                    <span className="material-symbols-outlined text-[20px]" data-icon={item.icon}>
                      {item.icon}
                    </span>
                    {item.label}
                  </span>
                  <span
                    className={`material-symbols-outlined text-[16px] transition-transform ${
                      isActive ? 'text-white' : 'text-on-surface-variant group-hover:translate-x-1'
                    }`}
                    data-icon="chevron_right"
                  >
                    chevron_right
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="bg-primary-container text-on-primary-container p-md rounded shadow-sm">
          <p className="font-label-caps text-label-caps font-bold mb-xs">Download Center</p>
          <p className="text-[11px] opacity-80 mb-md">All scheduled reports are ready for bulk export.</p>
          <button className="w-full bg-white text-primary font-label-caps text-label-caps py-2 rounded font-bold hover:bg-opacity-90 transition-all flex items-center justify-center gap-sm">
            <span className="material-symbols-outlined text-[18px]" data-icon="download">
              download
            </span>
            Export Daily Batch
          </button>
        </div>
      </aside>

      {/* Main Content Canvas */}
      <section className="flex-grow space-y-md" id="content-canvas">
        {/* 1. REVENUE REPORT VIEW */}
        {activeTab === 'revenue' && (
          <div className="space-y-md" id="view-revenue">
            <div className="flex items-center justify-between bg-white p-md rounded border border-outline-variant shadow-sm">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold">Revenue Analysis</h2>
                <p className="text-on-surface-variant text-body-sm">
                  Visualizing monetary conversion across processes and callers.
                </p>
              </div>
              <div className="flex items-center gap-sm relative">
                <div 
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center bg-surface-container-low border border-outline-variant rounded px-sm py-1 cursor-pointer hover:bg-surface-container-high transition-colors select-none"
                >
                  <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-xs" data-icon="calendar_today">
                    calendar_today
                  </span>
                  <span className="font-label-caps text-label-caps">{metrics.dateLabel}</span>
                  <span className="material-symbols-outlined text-xs ml-xs" data-icon="arrow_drop_down">arrow_drop_down</span>
                </div>

                {showDatePicker && (
                  <div className="absolute right-0 top-full mt-1 bg-white border border-outline-variant rounded shadow-lg z-50 py-1 w-48 text-xs font-semibold">
                    <div 
                      onClick={() => { setDateFilter('oct'); setShowDatePicker(false); }} 
                      className={`px-md py-sm hover:bg-surface-container-low cursor-pointer ${dateFilter === 'oct' ? 'text-primary font-bold bg-primary/10' : ''}`}
                    >
                      Oct 01 - Oct 31, 2023
                    </div>
                    <div 
                      onClick={() => { setDateFilter('sep'); setShowDatePicker(false); }} 
                      className={`px-md py-sm hover:bg-surface-container-low cursor-pointer ${dateFilter === 'sep' ? 'text-primary font-bold bg-primary/10' : ''}`}
                    >
                      Sep 01 - Sep 30, 2023
                    </div>
                    <div 
                      onClick={() => { setDateFilter('all'); setShowDatePicker(false); }} 
                      className={`px-md py-sm hover:bg-surface-container-low cursor-pointer ${dateFilter === 'all' ? 'text-primary font-bold bg-primary/10' : ''}`}
                    >
                      All Time
                    </div>
                  </div>
                )}

                <button 
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="bg-primary text-white px-md py-1.5 rounded font-label-caps text-label-caps font-bold hover:brightness-110 transition-all"
                >
                  Filter Data
                </button>
              </div>
            </div>

            {isRevLoading || isRevFetching ? (
              <div className="space-y-md animate-pulse">
                <div className="grid grid-cols-12 gap-md">
                  <div className="col-span-7 bg-white p-md rounded border border-outline-variant shadow-sm h-56 flex flex-col justify-between">
                    <div className="h-4 bg-surface-container-high rounded w-1/3"></div>
                    <div className="flex gap-md h-32 items-end">
                      <div className="flex-1 bg-surface-container-high rounded h-[85%]"></div>
                      <div className="flex-1 bg-surface-container-high rounded h-[60%]"></div>
                      <div className="flex-1 bg-surface-container-high rounded h-[95%]"></div>
                      <div className="flex-1 bg-surface-container-high rounded h-[40%]"></div>
                    </div>
                  </div>
                  <div className="col-span-5 bg-white p-md rounded border border-outline-variant shadow-sm h-56 flex flex-col justify-between">
                    <div className="h-4 bg-surface-container-high rounded w-1/3"></div>
                    <div className="w-24 h-24 rounded-full bg-surface-container-high mx-auto"></div>
                    <div className="space-y-2">
                      <div className="h-3 bg-surface-container-high rounded w-full"></div>
                      <div className="h-3 bg-surface-container-high rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
                <div className="bg-white p-md rounded border border-outline-variant shadow-sm h-48 space-y-md flex flex-col justify-around">
                  <div className="h-4 bg-surface-container-high rounded w-1/4"></div>
                  <div className="h-3 bg-surface-container-high rounded w-full"></div>
                  <div className="h-3 bg-surface-container-high rounded w-full"></div>
                  <div className="h-3 bg-surface-container-high rounded w-full"></div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-md">
              {/* ── Bar Chart ── */}
              <div className="col-span-7 bg-white p-md rounded border border-outline-variant shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-md">
                  <h3 className="font-label-caps text-label-caps font-bold">Revenue by Process</h3>
                  <span className="material-symbols-outlined text-on-surface-variant cursor-help" data-icon="info" title="Total revenue generated per lead category">
                    info
                  </span>
                </div>
                <div className="flex-grow flex items-stretch gap-md h-48 pb-lg px-md">
                  {[
                    { label: 'Driver', height: dynamicMetrics.fulfillment, val: dynamicMetrics.fulfillmentLabel, tooltipVal: formatRevenueExact(dynamicMetrics.fulfillmentRaw), color: 'bg-primary-container' },
                    { label: 'Transporter', height: dynamicMetrics.inboundSales, val: dynamicMetrics.inboundSalesLabel, tooltipVal: formatRevenueExact(dynamicMetrics.inboundSalesRaw), color: 'bg-primary-container' },
                    { label: 'Special Category', height: dynamicMetrics.urgentLead, val: dynamicMetrics.urgentLeadLabel, tooltipVal: formatRevenueExact(dynamicMetrics.urgentLeadRaw), color: 'bg-secondary-container' },
                    { label: 'Matchmaking', height: dynamicMetrics.recovery, val: dynamicMetrics.recoveryLabel, tooltipVal: formatRevenueExact(dynamicMetrics.recoveryRaw), color: 'bg-primary-container' },
                  ].map((bar) => (
                    <div key={bar.label} className="flex-1 h-full flex flex-col justify-end items-center gap-xs group relative">
                      {/* Tooltip — shows actual ₹ amount */}
                      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 z-20 pointer-events-none
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        bg-gray-900 text-white text-[11px] font-bold rounded px-2 py-1 whitespace-nowrap shadow-lg">
                        {bar.label}: {bar.tooltipVal}
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                      <span className="text-[11px] font-bold text-on-surface">{bar.val}</span>
                      <div
                        className={`w-full ${bar.color} rounded-t transition-all duration-300 cursor-pointer group-hover:brightness-90`}
                        style={{ height: bar.height }}
                      ></div>
                      <span className="text-[10px] font-label-caps uppercase truncate w-full text-center">{bar.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Source Attribution Donut ── */}
              <div className="col-span-5 bg-white p-md rounded border border-outline-variant shadow-sm">
                <h3 className="font-label-caps text-label-caps font-bold mb-md">Source Attribution</h3>
                <div className="relative w-40 h-40 mx-auto mb-md group">
                  <div className="w-full h-full rounded-full transition-all duration-300" style={{ background: dynamicMetrics.gradient }}></div>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col shadow-inner">
                    <span className="text-headline-md font-bold transition-all duration-300">{dynamicMetrics.totalRev}</span>
                    <span className="text-[9px] uppercase font-bold text-on-surface-variant">Total Rev</span>
                  </div>
                  {/* Donut hover tooltip */}
                  <div className="absolute -top-8 left-1/2 -translate-x-1/2 z-20 pointer-events-none
                    opacity-0 group-hover:opacity-100 transition-opacity duration-200
                    bg-gray-900 text-white text-[11px] font-bold rounded px-2 py-1 whitespace-nowrap shadow-lg">
                    Ads {dynamicMetrics.digitalAds} · Ref {dynamicMetrics.referral} · Off {dynamicMetrics.offline}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                  </div>
                </div>
                <div className="space-y-xs">
                  {[
                    { label: 'Digital Ads', val: dynamicMetrics.digitalAds, dot: 'bg-primary' },
                    { label: 'Referral', val: dynamicMetrics.referral, dot: 'bg-secondary-container' },
                    { label: 'Offline', val: dynamicMetrics.offline, dot: 'bg-secondary' },
                  ].map((src) => (
                    <div key={src.label} className="flex items-center justify-between text-[11px] group relative rounded px-1 py-0.5 hover:bg-surface-container-low cursor-default transition-colors">
                      {/* Row hover tooltip */}
                      <div className="absolute right-0 -top-8 z-20 pointer-events-none
                        opacity-0 group-hover:opacity-100 transition-opacity duration-200
                        bg-gray-900 text-white text-[11px] font-bold rounded px-2 py-1 whitespace-nowrap shadow-lg">
                        {src.label}: {src.val} of total revenue
                        <div className="absolute top-full right-4 border-4 border-transparent border-t-gray-900"></div>
                      </div>
                      <span className="flex items-center gap-xs"><div className={`w-2.5 h-2.5 rounded-full ${src.dot}`}></div> {src.label}</span>
                      <span className="font-bold font-data-mono">{src.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Top Callers ── */}
              <div className="col-span-12 bg-white p-md rounded border border-outline-variant shadow-sm">
                <div className="flex justify-between items-center mb-lg">
                  <h3 className="font-label-caps text-label-caps font-bold">Top Callers Performance (Revenue Focus)</h3>
                  <div className="flex gap-sm">
                    <span className="flex items-center gap-xs text-[10px] font-bold uppercase"><div className="w-2 h-2 bg-primary"></div> Target</span>
                    <span className="flex items-center gap-xs text-[10px] font-bold uppercase"><div className="w-2 h-2 bg-[#FB641B]"></div> Achieved</span>
                  </div>
                </div>
                <div className="space-y-md">
                  {callersList.map((caller, idx) => {
                    const maxVal = Math.max(caller.target, caller.achieved, 1);
                    const targetPct = `${((caller.target / maxVal) * 100).toFixed(0)}%`;
                    const achievedPct = `${((caller.achieved / maxVal) * 100).toFixed(0)}%`;
                    const pct = caller.target > 0 ? ((caller.achieved / caller.target) * 100).toFixed(1) : '0';
                    return (
                      <div key={idx} className="flex items-center gap-md group">
                        <div className="w-32 text-label-caps font-medium truncate">{caller.name}</div>
                        <div className="flex-grow relative">
                          {/* Bar hover tooltip */}
                          <div className="absolute -top-9 left-1/2 -translate-x-1/2 z-20 pointer-events-none
                            opacity-0 group-hover:opacity-100 transition-opacity duration-200
                            bg-gray-900 text-white text-[11px] font-bold rounded px-2 py-1 whitespace-nowrap shadow-lg">
                            Target: {formatRevenue(caller.target)} · Achieved: {formatRevenue(caller.achieved)} · {pct}%
                            <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
                          </div>
                          <div className="h-4 bg-surface-container-low rounded-full overflow-hidden flex relative cursor-pointer">
                            <div className="bg-primary h-full transition-all duration-300 group-hover:brightness-90" style={{ width: targetPct }}></div>
                            <div className="bg-[#FB641B] h-full absolute top-0 group-hover:brightness-90 transition-all duration-300" style={{ width: achievedPct }}></div>
                          </div>
                        </div>
                        <div className="w-20 text-right font-data-mono text-data-mono">{formatRevenue(caller.achieved)}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="bg-white rounded border border-outline-variant shadow-sm overflow-hidden">
               <div className="px-md py-sm bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-label-caps text-label-caps font-bold">Transaction Breakdown</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F0F2F5]">
                    <tr>
                      <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Date</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Caller Name</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Process</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Units</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Lead Type</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filteredTransactions.map((t: any, idx) => {
                      const callerName = t.caller_name || t.caller || '';
                      const leadType = t.lead_type || t.type || '';
                      const isHot = leadType.toLowerCase() === 'hot';
                      const isWarm = leadType.toLowerCase() === 'warm';
                      return (
                        <tr key={idx} className="hover:bg-surface-container-low transition-colors group">
                          <td className="px-md py-sm font-data-mono text-data-mono">{t.date}</td>
                          <td className="px-md py-sm text-label-caps font-medium">{callerName}</td>
                          <td className="px-md py-sm text-label-caps">{formatProcessLabel(t.process)}</td>
                          <td className="px-md py-sm text-label-caps">{t.units}</td>
                          <td className="px-md py-sm">
                            <span className={`px-sm py-0.5 rounded-full text-[10px] font-bold uppercase ${
                              isHot ? 'bg-error-container text-error' :
                              isWarm ? 'bg-primary-container text-white' : 'bg-surface-container-highest text-on-surface-variant'
                            }`}>
                              {leadType}
                            </span>
                          </td>
                          <td className="px-md py-sm font-data-mono text-data-mono text-right">₹{t.revenue.toLocaleString('en-IN')}</td>
                        </tr>
                      );
                    })}
                    {filteredTransactions.length === 0 && (
                      <tr>
                        <td colSpan={6} className="px-md py-lg text-center text-on-surface-variant font-bold">
                          No transactions match the selected filters.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination Controls */}
              {((apiTxData?.pagination) || (apiTxData?.data?.pagination)) && (() => {
                const pagination = apiTxData?.pagination || apiTxData?.data?.pagination || {};
                const currentPage = pagination.current_page ?? 1;
                const totalPages = pagination.total_pages ?? 1;
                return (
                  <div className="px-md py-sm bg-surface-container-lowest border-t border-outline-variant flex justify-between items-center text-xs font-semibold select-none">
                    <span className="text-on-surface-variant">
                      Page <span className="font-bold text-on-surface">{currentPage}</span> of{' '}
                      <span className="font-bold text-on-surface">{totalPages}</span>
                    </span>
                    <div className="flex gap-sm">
                      <button
                        onClick={() => setTxPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage <= 1}
                        className={`px-sm py-1.5 border border-outline-variant rounded hover:bg-surface-container-low transition-colors flex items-center gap-xs font-label-caps text-label-caps ${
                          currentPage <= 1 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">chevron_left</span> Previous
                      </button>
                      <button
                        onClick={() => setTxPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage >= totalPages}
                        className={`px-sm py-1.5 border border-outline-variant rounded hover:bg-surface-container-low transition-colors flex items-center gap-xs font-label-caps text-label-caps ${
                          currentPage >= totalPages ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                        }`}
                      >
                        Next <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </>
        )}
      </div>
    )}

        {/* 2. FUNNEL REPORT VIEW */}
        {activeTab === 'funnel' && (
          <div className="space-y-md" id="view-funnel">
            <div className="flex items-center justify-between bg-white p-md rounded border border-outline-variant shadow-sm">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold">Funnel Conversion Report</h2>
                <p className="text-on-surface-variant text-body-sm">
                  Tracking prospect drop-offs across registration, validation, and placements.
                </p>
              </div>
              <button className="bg-primary text-white px-md py-1.5 rounded font-label-caps text-label-caps font-bold hover:brightness-110 transition-all">
                Export Funnel Data
              </button>
            </div>

            {isFunnelLoading || isFunnelFetching ? (
              <div className="grid grid-cols-12 gap-md animate-pulse">
                <div className="col-span-8 bg-white p-md rounded border border-outline-variant shadow-sm h-96 flex flex-col justify-around items-center">
                  <div className="h-4 bg-surface-container-high rounded w-1/4 self-start"></div>
                  <div className="w-full max-w-[320px] space-y-md">
                    <div className="h-12 bg-surface-container-high rounded-lg w-full"></div>
                    <div className="h-10 bg-surface-container-high rounded-lg w-5/6 mx-auto"></div>
                    <div className="h-8 bg-surface-container-high rounded-lg w-2/3 mx-auto"></div>
                    <div className="h-6 bg-surface-container-high rounded-lg w-1/2 mx-auto"></div>
                  </div>
                </div>
                <div className="col-span-4 bg-white p-md rounded border border-outline-variant shadow-sm h-96 flex flex-col justify-around">
                  <div className="h-4 bg-surface-container-high rounded w-1/3"></div>
                  <div className="space-y-md">
                    <div className="h-16 bg-surface-container-high rounded"></div>
                    <div className="h-16 bg-surface-container-high rounded"></div>
                    <div className="h-16 bg-surface-container-high rounded"></div>
                  </div>
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-md">
              <div className="col-span-8 bg-white p-md rounded border border-outline-variant shadow-sm flex flex-col items-center">
                <h3 className="font-label-caps text-label-caps font-bold mb-md w-full text-left">Funnel Stages</h3>
                <div className="w-full max-w-[500px] py-md">
                  <svg viewBox="0 0 500 320" className="w-full h-auto overflow-visible select-none">
                    {/* Layer 1 (Top - Ingested & Assigned)
                       Width at y=10: 20 to 480 (diff = 460)
                       Width at y=75: 68.3 to 431.7 (diff = 363.4) */}
                    <polygon points="20,10 480,10 431,75 69,75" fill="#0056c3" className="hover:opacity-90 transition-opacity cursor-pointer" />
                    <text x="250" y="36" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="Inter">Leads Ingested & Assigned</text>
                    <text x="250" y="52" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="Inter" opacity="0.9">{funnelData.ingestedAssigned.toLocaleString('en-IN')} ({funnelData.ingestedAssignedPct}%)</text>

                    {/* Layer 2 (Contacted)
                       Width at y=80: 72 to 428 (diff = 356)
                       Width at y=145: 121.7 to 378.3 (diff = 256.6) */}
                    <polygon points="73,80 427,80 377,145 123,145" fill="#fd661d" className="hover:opacity-90 transition-opacity cursor-pointer" />
                    <text x="250" y="106" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="Inter">Contacted</text>
                    <text x="250" y="122" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="Inter" opacity="0.9">{funnelData.contacted.toLocaleString('en-IN')} ({funnelData.contactedPct}%)</text>

                    {/* Layer 3 (Interested)
                       Width at y=150: 125.5 to 374.5 (diff = 249)
                       Width at y=215: 175.2 to 324.8 (diff = 149.6) */}
                    <polygon points="126,150 374,150 324,215 176,215" fill="#a73a00" className="hover:opacity-90 transition-opacity cursor-pointer" />
                    <text x="250" y="176" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="Inter">Interested</text>
                    <text x="250" y="192" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="Inter" opacity="0.9">{funnelData.interested.toLocaleString('en-IN')} ({funnelData.interestedPct}%)</text>

                    {/* Layer 4 (Bottom - Subscribed)
                       Width at y=220: 179 to 321 (diff = 142)
                       Width at y=295: 236 to 264 (sharp corner close to tip at 250,310) */}
                    <polygon points="180,220 320,220 270,285 230,285" fill="#27AE60" className="hover:opacity-90 transition-opacity cursor-pointer" />
                    <text x="250" y="246" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="Inter">Subscribed</text>
                    <text x="250" y="262" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="Inter" opacity="0.9">{funnelData.subscribed.toLocaleString('en-IN')} ({funnelData.subscribedPct}%)</text>
                  </svg>
                </div>
              </div>

              <div className="col-span-4 bg-white p-md rounded border border-outline-variant shadow-sm flex flex-col justify-between">
                <h3 className="font-label-caps text-label-caps font-bold mb-md">Conversion Rates</h3>
                <div className="space-y-sm flex-grow flex flex-col justify-center">
                  <div className="p-sm bg-surface-container-low rounded border border-outline-variant/30 text-center">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">Contactability Rate</p>
                    <p className="text-xl font-bold text-primary font-data-mono">{funnelData.contactabilityRate}%</p>
                  </div>
                  <div className="p-sm bg-surface-container-low rounded border border-outline-variant/30 text-center">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">Call-to-Interest Rate</p>
                    <p className="text-xl font-bold text-secondary font-data-mono">{funnelData.callToInterestRate}%</p>
                  </div>
                  <div className="p-sm bg-surface-container-low rounded border border-outline-variant/30 text-center">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">Overall Lead-to-Sale</p>
                    <p className="text-xl font-bold text-green-600 font-data-mono">{funnelData.overallLeadToSale}%</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    )}

        {/* 3. CALLER BENCHMARKING VIEW */}
        {activeTab === 'benchmarking' && (
          <div className="space-y-md" id="view-benchmarking">
            <div className="flex items-center justify-between bg-white p-md rounded border border-outline-variant shadow-sm">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold">Caller Benchmarking</h2>
                <p className="text-on-surface-variant text-body-sm">
                  Standardized comparison across all operational metrics.
                </p>
              </div>
              <div className="flex items-center gap-sm">
                <button className="bg-[#FB641B] text-white px-md py-1.5 rounded font-label-caps text-label-caps font-bold hover:brightness-110 transition-all flex items-center gap-sm">
                  <span className="material-symbols-outlined text-[18px]" data-icon="ios_share">
                    ios_share
                  </span>
                  Export Full Benchmarks
                </button>
              </div>
            </div>

            {isBenchmarksLoading || isBenchmarksFetching ? (
              <div className="bg-white rounded border border-outline-variant shadow-sm overflow-hidden p-md space-y-md animate-pulse">
                <div className="h-4 bg-surface-container-high rounded w-1/4"></div>
                <div className="space-y-sm">
                  {[1, 2, 3, 4, 5].map((item) => (
                    <div key={item} className="flex justify-between items-center py-sm border-b border-outline-variant/30">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded bg-surface-container-high"></div>
                        <div className="space-y-1">
                          <div className="h-3 bg-surface-container-high rounded w-24"></div>
                          <div className="h-2.5 bg-surface-container-high rounded w-16"></div>
                        </div>
                      </div>
                      <div className="h-3 bg-surface-container-high rounded w-12"></div>
                      <div className="h-3 bg-surface-container-high rounded w-16"></div>
                      <div className="h-3 bg-surface-container-high rounded w-12"></div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="bg-white rounded border border-outline-variant shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F0F2F5]">
                  <tr>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase sticky left-0 bg-[#F0F2F5]">
                      Agent Identity
                    </th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">
                      Calls/Day
                    </th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">
                      Conv. Rate
                    </th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">
                      Avg Duration
                    </th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">
                      Revenue/Agent
                    </th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">
                      QC Score
                    </th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {benchmarksList.map((agent: any, idx) => {
                    const identity = agent.agent_identity || {};
                    const name = identity.name || agent.name || '';
                    const initials = identity.initials || agent.initials || name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
                    const role = identity.level || agent.role || 'Telecaller';
                    const callsPerDay = agent.calls_per_day ?? agent.callsPerDay ?? 0;
                    const convRate = agent.conversion_rate ?? agent.conv_rate ?? agent.convRate ?? 0;
                    const avgDuration = agent.avg_duration ?? agent.avgDuration ?? '--';
                    const revenue = agent.revenue ?? 0;
                    const qcScore = agent.qc_score ?? agent.qcScore ?? 0;
                    const trend = agent.trend ?? 'stable';

                    const rateColor = convRate >= 10 ? 'text-green-600' : convRate >= 7 ? 'text-amber-600' : 'text-red-600';
                    const barColor = convRate >= 10 ? 'bg-green-500' : convRate >= 7 ? 'bg-amber-500' : 'bg-red-500';
                    const qcBg = qcScore >= 8.5 ? 'bg-green-100 text-green-800' : qcScore >= 7.0 ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800';
                    
                    let trendIcon = 'trending_flat';
                    let trendColor = 'text-amber-500';
                    if (trend === 'up') {
                      trendIcon = 'trending_up';
                      trendColor = 'text-green-500';
                    } else if (trend === 'down') {
                      trendIcon = 'trending_down';
                      trendColor = 'text-red-500';
                    } else if (trend === 'straight') {
                      trendIcon = 'trending_flat';
                      trendColor = 'text-amber-500';
                    }

                    return (
                      <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-md sticky left-0 bg-white">
                          <div className="flex items-center gap-sm">
                            <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center font-bold text-xs">
                              {initials}
                            </div>
                            <div>
                              <p className="font-label-caps text-label-caps font-bold">{name}</p>
                              <p className="text-[10px] text-on-surface-variant">{role}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-md py-md text-center font-data-mono text-data-mono">{callsPerDay}</td>
                        <td className="px-md py-md text-center">
                          <p className={`font-data-mono text-data-mono ${rateColor}`}>{convRate}%</p>
                          <div className="w-full bg-surface-container-high h-1 rounded-full mt-1">
                            <div className={`${barColor} h-full`} style={{ width: `${(convRate / 15) * 100}%` }}></div>
                          </div>
                        </td>
                        <td className="px-md py-md text-center font-data-mono text-data-mono">{avgDuration}</td>
                        <td className="px-md py-md text-center font-data-mono text-data-mono">{formatRevenue(revenue)}</td>
                        <td className="px-md py-md text-center">
                          <span className={`px-sm py-1 ${qcBg} text-[11px] font-bold rounded`}>
                            {qcScore}/10
                          </span>
                        </td>
                        <td className="px-md py-md">
                          <span className={`material-symbols-outlined ${trendColor}`} data-icon={trendIcon}>
                            {trendIcon}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    )}

        {/* 4. QC TREND VIEW */}
        {activeTab === 'qc' && (
          <div className="space-y-md" id="view-qc">
            <div className="flex items-center justify-between bg-white p-md rounded border border-outline-variant shadow-sm">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold">QC Score Trend</h2>
                <p className="text-on-surface-variant text-body-sm">
                  Analyzing quality compliance scores and audit stats across weeks.
                </p>
              </div>
              <button className="bg-primary text-white px-md py-1.5 rounded font-label-caps text-label-caps font-bold hover:brightness-110 transition-all">
                Export Audit Log
              </button>
            </div>

            <div className="grid grid-cols-12 gap-md">
              <div className="col-span-6 bg-white p-md rounded border border-outline-variant shadow-sm">
                <h3 className="font-label-caps text-label-caps font-bold mb-md">Weekly Score Trend</h3>
                <div className="space-y-md">
                  {[
                    { week: 'Week 42 (Current)', score: 8.7, status: 'improved' },
                    { week: 'Week 41', score: 8.5, status: 'improved' },
                    { week: 'Week 40', score: 8.2, status: 'improved' },
                    { week: 'Week 39', score: 7.9, status: 'stable' },
                  ].map((w, idx) => (
                    <div key={idx} className="flex items-center justify-between p-xs bg-surface-container-low rounded border border-outline-variant/30">
                      <span className="font-bold text-xs">{w.week}</span>
                      <div className="flex items-center gap-md">
                        <span className="font-data-mono text-sm font-bold text-primary">{w.score} / 10</span>
                        <span className={`material-symbols-outlined text-xs ${w.status === 'improved' ? 'text-green-500' : 'text-outline'}`}>
                          {w.status === 'improved' ? 'trending_up' : 'trending_flat'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="col-span-6 bg-white p-md rounded border border-outline-variant shadow-sm">
                <h3 className="font-label-caps text-label-caps font-bold mb-md">Compliance Parameters</h3>
                <div className="space-y-sm">
                  {[
                    { label: 'Opening Greeting', percent: 94, color: 'bg-green-500' },
                    { label: 'Script Adherence', percent: 88, color: 'bg-green-500' },
                    { label: 'Objection Handling', percent: 76, color: 'bg-amber-500' },
                    { label: 'Disposition Accuracy', percent: 95, color: 'bg-green-500' },
                  ].map((p, idx) => (
                    <div key={idx} className="space-y-xs">
                      <div className="flex justify-between text-[11px] font-bold">
                        <span>{p.label}</span>
                        <span>{p.percent}%</span>
                      </div>
                      <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                        <div className={`${p.color} h-full`} style={{ width: `${p.percent}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 5. INCENTIVE SUMMARY VIEW */}
        {activeTab === 'incentive' && (
          <div className="space-y-md" id="view-incentive">
            <div className="flex items-center justify-between bg-white p-md rounded border border-outline-variant shadow-sm">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold">Incentive Summary</h2>
                <p className="text-on-surface-variant text-body-sm">
                  Tracking current-cycle calculations and bonus eligibility.
                </p>
              </div>
              <button className="bg-primary text-white px-md py-1.5 rounded font-label-caps text-label-caps font-bold hover:brightness-110 transition-all">
                Export Payroll Addendum
              </button>
            </div>

            <div className="grid grid-cols-12 gap-md">
              <div className="col-span-8 bg-white rounded border border-outline-variant shadow-sm overflow-hidden">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-[#F0F2F5]">
                    <tr>
                      <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Caller</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-right">Target</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-right">Earned</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant text-[12px]">
                    {[
                      { name: 'Amit Sharma', target: '₹10,000', earned: '₹12,400', status: 'Eligible' },
                      { name: 'Priya Verma', target: '₹8,000', earned: '₹9,800', status: 'Eligible' },
                      { name: 'Suresh Raina', target: '₹8,000', earned: '₹8,500', status: 'Eligible' },
                      { name: 'Rohan Kumar', target: '₹6,000', earned: '₹7,200', status: 'Eligible' },
                      { name: 'Sneha Sharma', target: '₹10,000', earned: '₹11,500', status: 'Eligible' },
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                        <td className="px-md py-sm font-bold">{row.name}</td>
                        <td className="px-md py-sm text-right font-data-mono text-on-surface-variant">{row.target}</td>
                        <td className="px-md py-sm text-right font-bold font-data-mono text-green-600">{row.earned}</td>
                        <td className="px-md py-sm text-center">
                          <span className="bg-green-100 text-green-800 text-[10px] font-bold px-sm py-0.5 rounded-full">
                            {row.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="col-span-4 bg-white p-md rounded border border-outline-variant shadow-sm space-y-md">
                <h3 className="font-label-caps text-label-caps font-bold">Calculation Metrics</h3>
                <div className="space-y-sm text-xs">
                  <div className="p-sm bg-surface-container-low rounded border border-outline-variant/30">
                    <p className="font-bold">Base Registration</p>
                    <p className="text-on-surface-variant mt-xs">₹50 per verified registration (DW/TR).</p>
                  </div>
                  <div className="p-sm bg-surface-container-low rounded border border-outline-variant/30">
                    <p className="font-bold">Matchmaking Bonus</p>
                    <p className="text-on-surface-variant mt-xs">₹150 per successful driver placement.</p>
                  </div>
                  <div className="p-sm bg-surface-container-low rounded border border-outline-variant/30">
                    <p className="font-bold">Quality Bonus</p>
                    <p className="text-on-surface-variant mt-xs">+10% payout multiplier if QC Score &gt; 9.0/10.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 6. ATTENDANCE VIEW */}
        {activeTab === 'attendance' && (
          <div className="space-y-md" id="view-attendance">
            <div className="flex items-center justify-between bg-white p-md rounded border border-outline-variant shadow-sm">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold">Today's Attendance</h2>
                <p className="text-on-surface-variant text-body-sm">
                  Real-time view of logins, check-ins, and active statuses.
                </p>
              </div>
              <div className="flex items-center gap-sm">
                <div className="flex items-center bg-surface-container-low border border-outline-variant rounded px-sm py-1 text-xs">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-xs animate-pulse"></span>
                  <span className="font-bold text-green-600">14 Present</span>
                  <span className="text-outline mx-sm">|</span>
                  <span className="text-on-surface-variant font-bold">2 Absent</span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded border border-outline-variant shadow-sm overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F0F2F5]">
                  <tr>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Caller Name</th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Login Time</th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Status</th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant text-[12px]">
                  {[
                    { name: 'Amit Sharma', login: '09:02 AM', status: 'Active', role: 'DW' },
                    { name: 'Priya Verma', login: '09:15 AM', status: 'Active', role: 'DW' },
                    { name: 'Suresh Raina', login: '08:58 AM', status: 'Active', role: 'TR' },
                    { name: 'Sneha Sharma', login: '09:00 AM', status: 'Active', role: 'MM' },
                    { name: 'Rahul (TL)', login: '08:30 AM', status: 'Active', role: 'TL' },
                    { name: 'Rajendra (TL)', login: '08:45 AM', status: 'Active', role: 'TL' },
                    { name: 'Arjun Patel', login: '-', status: 'On Leave', role: 'Operations' },
                    { name: 'Kajal', login: '-', status: 'Absent', role: 'DW' },
                  ].map((row, idx) => (
                    <tr key={idx} className="hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-sm font-bold">{row.name}</td>
                      <td className="px-md py-sm font-data-mono">{row.login}</td>
                      <td className="px-md py-sm">
                        <span className={`px-sm py-0.5 rounded-full text-[10px] font-bold ${
                          row.status === 'Active'
                            ? 'bg-green-100 text-green-800'
                            : row.status === 'On Leave'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {row.status}
                        </span>
                      </td>
                      <td className="px-md py-sm font-bold text-on-surface-variant">{row.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default ThReportsHub;

