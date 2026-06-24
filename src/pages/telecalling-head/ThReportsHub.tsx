import React, { useState } from 'react';

type TabType = 'revenue' | 'funnel' | 'benchmarking' | 'qc' | 'incentive' | 'attendance';

export const ThReportsHub: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('revenue');
  const [dateFilter, setDateFilter] = useState<'oct' | 'sep' | 'all'>('oct');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [processFilter, setProcessFilter] = useState<string>('All');
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>('All');

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

  const metrics = getMetrics();

  const transactionsData = [
    { date: '12/10/2023', caller: 'Amit Sharma', process: 'Fulfillment', units: 24, type: 'Hot', revenue: 45200, month: 'oct' },
    { date: '12/10/2023', caller: 'Priya Verma', process: 'Inbound Sales', units: 18, type: 'Warm', revenue: 32150, month: 'oct' },
    { date: '11/10/2023', caller: 'Suresh Raina', process: 'Urgent Lead', units: 42, type: 'Hot', revenue: 88900, month: 'oct' },
    { date: '08/10/2023', caller: 'Amit Sharma', process: 'Recovery', units: 12, type: 'Cold', revenue: 15400, month: 'oct' },
    { date: '05/10/2023', caller: 'Priya Verma', process: 'Fulfillment', units: 30, type: 'Warm', revenue: 52000, month: 'oct' },
    { date: '02/10/2023', caller: 'Suresh Raina', process: 'Recovery', units: 15, type: 'Cold', revenue: 19800, month: 'oct' },
    { date: '28/09/2023', caller: 'Amit Sharma', process: 'Inbound Sales', units: 20, type: 'Hot', revenue: 38000, month: 'sep' },
    { date: '25/09/2023', caller: 'Priya Verma', process: 'Urgent Lead', units: 35, type: 'Hot', revenue: 74500, month: 'sep' },
  ];

  // Filtering transactions list based on all filters
  const filteredTransactions = transactionsData.filter((t) => {
    // 1. Date filter check
    if (dateFilter !== 'all' && t.month !== dateFilter) return false;

    // 2. Process check
    if (processFilter !== 'All' && t.process !== processFilter) return false;

    // 3. Lead Type check
    if (leadTypeFilter !== 'All' && t.type.toLowerCase() !== leadTypeFilter.toLowerCase()) return false;

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

            <div className="grid grid-cols-12 gap-md">
              <div className="col-span-7 bg-white p-md rounded border border-outline-variant shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-md">
                  <h3 className="font-label-caps text-label-caps font-bold">Revenue by Process</h3>
                  <span className="material-symbols-outlined text-on-surface-variant cursor-help" data-icon="info" title="Total revenue generated per lead category">
                    info
                  </span>
                </div>
                <div className="flex-grow flex items-stretch gap-md h-48 pb-lg px-md">
                  <div className="flex-1 h-full flex flex-col justify-end items-center gap-xs">
                    <div className="w-full bg-primary-container rounded-t animate-pulse-custom animate-duration-1000 transition-all duration-300" style={{ height: metrics.fulfillment }}></div>
                    <span className="text-[10px] font-label-caps uppercase truncate w-full text-center">Fulfillment</span>
                  </div>
                  <div className="flex-1 h-full flex flex-col justify-end items-center gap-xs">
                    <div className="w-full bg-primary-container rounded-t transition-all duration-300" style={{ height: metrics.inboundSales }}></div>
                    <span className="text-[10px] font-label-caps uppercase truncate w-full text-center">Inbound Sales</span>
                  </div>
                  <div className="flex-1 h-full flex flex-col justify-end items-center gap-xs">
                    <div className="w-full bg-secondary-container rounded-t animate-pulse-custom animate-duration-1000 transition-all duration-300" style={{ height: metrics.urgentLead }}></div>
                    <span className="text-[10px] font-label-caps uppercase truncate w-full text-center">Urgent Lead</span>
                  </div>
                  <div className="flex-1 h-full flex flex-col justify-end items-center gap-xs">
                    <div className="w-full bg-primary-container rounded-t transition-all duration-300" style={{ height: metrics.recovery }}></div>
                    <span className="text-[10px] font-label-caps uppercase truncate w-full text-center">Recovery</span>
                  </div>
                </div>
              </div>

              <div className="col-span-5 bg-white p-md rounded border border-outline-variant shadow-sm">
                <h3 className="font-label-caps text-label-caps font-bold mb-md">Source Attribution</h3>
                <div className="relative w-40 h-40 mx-auto mb-md">
                  <div className="w-full h-full rounded-full transition-all duration-300" style={{ background: metrics.gradient }}></div>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col shadow-inner">
                    <span className="text-headline-md font-bold transition-all duration-300">{metrics.totalRev}</span>
                    <span className="text-[9px] uppercase font-bold text-on-surface-variant">Total Rev</span>
                  </div>
                </div>
                <div className="space-y-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-xs"><div className="w-2.5 h-2.5 rounded-full bg-primary"></div> Digital Ads</span>
                    <span className="font-bold font-data-mono">{metrics.digitalAds}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-xs"><div className="w-2.5 h-2.5 rounded-full bg-secondary-container"></div> Referral</span>
                    <span className="font-bold font-data-mono">{metrics.referral}</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="flex items-center gap-xs"><div className="w-2.5 h-2.5 rounded-full bg-secondary"></div> Offline</span>
                    <span className="font-bold font-data-mono">{metrics.offline}</span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 bg-white p-md rounded border border-outline-variant shadow-sm">
                <div className="flex justify-between items-center mb-lg">
                  <h3 className="font-label-caps text-label-caps font-bold">Top Callers Performance (Revenue Focus)</h3>
                  <div className="flex gap-sm">
                    <span className="flex items-center gap-xs text-[10px] font-bold uppercase"><div className="w-2 h-2 bg-primary"></div> Target</span>
                    <span className="flex items-center gap-xs text-[10px] font-bold uppercase"><div className="w-2 h-2 bg-secondary-container"></div> Achieved</span>
                  </div>
                </div>
                <div className="space-y-md">
                  <div className="flex items-center gap-md">
                    <div className="w-32 text-label-caps font-medium truncate">Amit Sharma</div>
                    <div className="flex-grow h-4 bg-surface-container-low rounded-full overflow-hidden flex">
                      <div className="bg-primary h-full transition-all duration-300" style={{ width: metrics.amitWidth }}></div>
                      <div className="bg-secondary-container h-full" style={{ width: '10%', marginLeft: '-5%' }}></div>
                    </div>
                    <div className="w-16 text-right font-data-mono text-data-mono">{metrics.amitRev}</div>
                  </div>

                  <div className="flex items-center gap-md">
                    <div className="w-32 text-label-caps font-medium truncate">Priya Verma</div>
                    <div className="flex-grow h-4 bg-surface-container-low rounded-full overflow-hidden flex">
                      <div className="bg-primary h-full transition-all duration-300" style={{ width: metrics.priyaWidth }}></div>
                      <div className="bg-secondary-container h-full" style={{ width: '25%', marginLeft: '-5%' }}></div>
                    </div>
                    <div className="w-16 text-right font-data-mono text-data-mono">{metrics.priyaRev}</div>
                  </div>

                  <div className="flex items-center gap-md">
                    <div className="w-32 text-label-caps font-medium truncate">Suresh Raina</div>
                    <div className="flex-grow h-4 bg-surface-container-low rounded-full overflow-hidden flex">
                      <div className="bg-primary h-full transition-all duration-300" style={{ width: metrics.sureshWidth }}></div>
                      <div className="bg-secondary-container h-full" style={{ width: '30%', marginLeft: '-5%' }}></div>
                    </div>
                    <div className="w-16 text-right font-data-mono text-data-mono">{metrics.sureshRev}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded border border-outline-variant shadow-sm overflow-hidden">
              <div className="px-md py-sm bg-surface-container-lowest border-b border-outline-variant flex justify-between items-center">
                <h3 className="font-label-caps text-label-caps font-bold">Transaction Breakdown</h3>
                <button 
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`font-label-caps text-label-caps flex items-center gap-xs border px-sm py-1.5 rounded transition-all ${
                    showAdvancedFilters ? 'bg-primary text-white border-primary' : 'text-primary border-outline-variant hover:bg-surface-container-low'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]" data-icon="tune">tune</span> Advanced Filters
                </button>
              </div>

              {showAdvancedFilters && (
                <div className="bg-surface-container-low px-md py-sm border-b border-outline-variant flex flex-wrap gap-md items-center text-xs font-semibold">
                  <div className="flex items-center gap-xs">
                    <span className="text-on-surface-variant font-label-caps text-[10px]">Process:</span>
                    <select 
                      value={processFilter} 
                      onChange={(e) => setProcessFilter(e.target.value)}
                      className="bg-white border border-outline-variant rounded p-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                    >
                      <option value="All">All Processes</option>
                      <option value="Fulfillment">Fulfillment</option>
                      <option value="Inbound Sales">Inbound Sales</option>
                      <option value="Urgent Lead">Urgent Lead</option>
                      <option value="Recovery">Recovery</option>
                    </select>
                  </div>

                  <div className="flex items-center gap-xs">
                    <span className="text-on-surface-variant font-label-caps text-[10px]">Lead Type:</span>
                    <select 
                      value={leadTypeFilter} 
                      onChange={(e) => setLeadTypeFilter(e.target.value)}
                      className="bg-white border border-outline-variant rounded p-xs outline-none focus:ring-1 focus:ring-primary font-medium"
                    >
                      <option value="All">All Types</option>
                      <option value="Hot">Hot</option>
                      <option value="Warm">Warm</option>
                      <option value="Cold">Cold</option>
                    </select>
                  </div>

                  {(processFilter !== 'All' || leadTypeFilter !== 'All') && (
                    <button 
                      onClick={() => { setProcessFilter('All'); setLeadTypeFilter('All'); }}
                      className="text-error hover:underline text-[11px] font-bold uppercase ml-auto"
                    >
                      Clear Filters
                    </button>
                  )}
                </div>
              )}

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
                    {filteredTransactions.map((t, idx) => (
                      <tr key={idx} className="hover:bg-surface-container-low transition-colors group">
                        <td className="px-md py-sm font-data-mono text-data-mono">{t.date}</td>
                        <td className="px-md py-sm text-label-caps font-medium">{t.caller}</td>
                        <td className="px-md py-sm text-label-caps">{t.process}</td>
                        <td className="px-md py-sm text-label-caps">{t.units}</td>
                        <td className="px-md py-sm">
                          <span className={`px-sm py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            t.type === 'Hot' ? 'bg-error-container text-error' :
                            t.type === 'Warm' ? 'bg-primary-container text-white' : 'bg-surface-container-highest text-on-surface-variant'
                          }`}>
                            {t.type}
                          </span>
                        </td>
                        <td className="px-md py-sm font-data-mono text-data-mono text-right">₹{t.revenue.toLocaleString('en-IN')}</td>
                      </tr>
                    ))}
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
            </div>
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

            <div className="grid grid-cols-12 gap-md">
              <div className="col-span-8 bg-white p-md rounded border border-outline-variant shadow-sm flex flex-col items-center">
                <h3 className="font-label-caps text-label-caps font-bold mb-md w-full text-left">Funnel Stages</h3>
                <div className="w-full max-w-[500px] py-md">
                  <svg viewBox="0 0 500 320" className="w-full h-auto overflow-visible select-none">
                    {/* Layer 1 (Top) */}
                    <polygon points="20,10 480,10 440,65 60,65" fill="#0056c3" className="hover:opacity-90 transition-opacity cursor-pointer" />
                    <text x="250" y="32" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="Inter">Leads Ingested</text>
                    <text x="250" y="48" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="Inter" opacity="0.9">125,000 (100%)</text>

                    {/* Layer 2 */}
                    <polygon points="63,70 437,70 397,125 103,125" fill="#1f6feb" className="hover:opacity-90 transition-opacity cursor-pointer" />
                    <text x="250" y="92" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="Inter">Leads Assigned</text>
                    <text x="250" y="108" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="Inter" opacity="0.9">108,300 (86.6%)</text>

                    {/* Layer 3 */}
                    <polygon points="106,130 394,130 354,185 146,185" fill="#fd661d" className="hover:opacity-90 transition-opacity cursor-pointer" />
                    <text x="250" y="152" textAnchor="middle" fill="#ffffff" fontSize="12" fontWeight="bold" fontFamily="Inter">Contacted</text>
                    <text x="250" y="168" textAnchor="middle" fill="#ffffff" fontSize="10" fontFamily="Inter" opacity="0.9">82,400 (65.9%)</text>

                    {/* Layer 4 */}
                    <polygon points="149,190 351,190 311,245 189,245" fill="#a73a00" className="hover:opacity-90 transition-opacity cursor-pointer" />
                    <text x="250" y="212" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" fontFamily="Inter">Interested</text>
                    <text x="250" y="228" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="Inter" opacity="0.9">24,700 (19.8%)</text>

                    {/* Layer 5 (Bottom) */}
                    <polygon points="192,250 308,250 278,305 222,305" fill="#27AE60" className="hover:opacity-90 transition-opacity cursor-pointer" />
                    <text x="250" y="272" textAnchor="middle" fill="#ffffff" fontSize="10" fontWeight="bold" fontFamily="Inter">Converted</text>
                    <text x="250" y="288" textAnchor="middle" fill="#ffffff" fontSize="9" fontFamily="Inter" opacity="0.9">8,650 (6.9%)</text>
                  </svg>
                </div>
              </div>

              <div className="col-span-4 bg-white p-md rounded border border-outline-variant shadow-sm flex flex-col justify-between">
                <h3 className="font-label-caps text-label-caps font-bold mb-md">Conversion Rates</h3>
                <div className="space-y-sm flex-grow flex flex-col justify-center">
                  <div className="p-sm bg-surface-container-low rounded border border-outline-variant/30 text-center">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">Contactability Rate</p>
                    <p className="text-xl font-bold text-primary font-data-mono">76.1%</p>
                  </div>
                  <div className="p-sm bg-surface-container-low rounded border border-outline-variant/30 text-center">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">Call-to-Interest Rate</p>
                    <p className="text-xl font-bold text-secondary font-data-mono">30.0%</p>
                  </div>
                  <div className="p-sm bg-surface-container-low rounded border border-outline-variant/30 text-center">
                    <p className="text-[10px] text-on-surface-variant uppercase font-bold">Overall Lead-to-Sale</p>
                    <p className="text-xl font-bold text-green-600 font-data-mono">6.9%</p>
                  </div>
                </div>
              </div>
            </div>
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
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="px-md py-md sticky left-0 bg-white">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center font-bold text-xs">
                          AS
                        </div>
                        <div>
                          <p className="font-label-caps text-label-caps font-bold">Amit Sharma</p>
                          <p className="text-[10px] text-on-surface-variant">Lvl 4 Senior</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md text-center font-data-mono text-data-mono">142</td>
                    <td className="px-md py-md text-center">
                      <p className="font-data-mono text-data-mono text-green-600">12.4%</p>
                      <div className="w-full bg-surface-container-high h-1 rounded-full mt-1">
                        <div className="bg-green-500 h-full w-[80%]"></div>
                      </div>
                    </td>
                    <td className="px-md py-md text-center font-data-mono text-data-mono">04:12</td>
                    <td className="px-md py-md text-center font-data-mono text-data-mono">₹2.41L</td>
                    <td className="px-md py-md text-center">
                      <span className="px-sm py-1 bg-green-100 text-green-800 text-[11px] font-bold rounded">
                        9.2/10
                      </span>
                    </td>
                    <td className="px-md py-md">
                      <span className="material-symbols-outlined text-green-500" data-icon="trending_up">
                        trending_up
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="px-md py-md sticky left-0 bg-white">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center font-bold text-xs">
                          PV
                        </div>
                        <div>
                          <p className="font-label-caps text-label-caps font-bold">Priya Verma</p>
                          <p className="text-[10px] text-on-surface-variant">Lvl 3 Associate</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md text-center font-data-mono text-data-mono">118</td>
                    <td className="px-md py-md text-center">
                      <p className="font-data-mono text-data-mono text-amber-600">8.1%</p>
                      <div className="w-full bg-surface-container-high h-1 rounded-full mt-1">
                        <div className="bg-amber-500 h-full w-[55%]"></div>
                      </div>
                    </td>
                    <td className="px-md py-md text-center font-data-mono text-data-mono">03:45</td>
                    <td className="px-md py-md text-center font-data-mono text-data-mono">₹1.88L</td>
                    <td className="px-md py-md text-center">
                      <span className="px-sm py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded">
                        7.8/10
                      </span>
                    </td>
                    <td className="px-md py-md">
                      <span className="material-symbols-outlined text-amber-500" data-icon="trending_flat">
                        trending_flat
                      </span>
                    </td>
                  </tr>
                  <tr className="hover:bg-surface-container-low transition-colors">
                    <td className="px-md py-md sticky left-0 bg-white">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded bg-surface-container-high flex items-center justify-center font-bold text-xs">
                          SR
                        </div>
                        <div>
                          <p className="font-label-caps text-label-caps font-bold">Suresh Raina</p>
                          <p className="text-[10px] text-on-surface-variant">Lvl 4 Senior</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md text-center font-data-mono text-data-mono">156</td>
                    <td className="px-md py-md text-center">
                      <p className="font-data-mono text-data-mono text-green-600">10.2%</p>
                      <div className="w-full bg-surface-container-high h-1 rounded-full mt-1">
                        <div className="bg-green-500 h-full w-[72%]"></div>
                      </div>
                    </td>
                    <td className="px-md py-md text-center font-data-mono text-data-mono">05:30</td>
                    <td className="px-md py-md text-center font-data-mono text-data-mono">₹1.72L</td>
                    <td className="px-md py-md text-center">
                      <span className="px-sm py-1 bg-red-100 text-red-800 text-[11px] font-bold rounded">
                        6.4/10
                      </span>
                    </td>
                    <td className="px-md py-md">
                      <span className="material-symbols-outlined text-red-500" data-icon="trending_down">
                        trending_down
                      </span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
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

