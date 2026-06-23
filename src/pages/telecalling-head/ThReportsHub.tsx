import React, { useState, useMemo } from 'react';

type TabType = 'revenue' | 'funnel' | 'benchmarking' | 'qc' | 'incentive' | 'attendance';

interface Transaction {
  date: string;
  callerName: string;
  process: string;
  units: number;
  leadType: 'HOT' | 'WARM' | 'COLD';
  revenue: number;
}


export const ReportsHub: React.FC = () => {
  // Navigation State
  const [activeTab, setActiveTab] = useState<TabType>('revenue');

  // Filter States
  const [dateRange, setDateRange] = useState('Oct 01 - Oct 31, 2023');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [processFilter, setProcessFilter] = useState<string>('ALL');
  const [leadTypeFilter, setLeadTypeFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Toast State
  const [toast, setToast] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Mock Transactions
  const [transactions] = useState<Transaction[]>([
    { date: '12/10/2023', callerName: 'Amit Sharma', process: 'Fulfillment', units: 24, leadType: 'HOT', revenue: 45200 },
    { date: '12/10/2023', callerName: 'Priya Verma', process: 'Inbound Sales', units: 18, leadType: 'WARM', revenue: 32150 },
    { date: '11/10/2023', callerName: 'Suresh Raina', process: 'Urgent Lead', units: 42, leadType: 'HOT', revenue: 88900 },
    { date: '10/10/2023', callerName: 'Amit Sharma', process: 'Recovery', units: 15, leadType: 'COLD', revenue: 12400 },
    { date: '09/10/2023', callerName: 'Priya Verma', process: 'Fulfillment', units: 30, leadType: 'WARM', revenue: 52000 },
    { date: '08/10/2023', callerName: 'Suresh Raina', process: 'Inbound Sales', units: 20, leadType: 'HOT', revenue: 38000 }
  ]);

  // Filtered Transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      if (processFilter !== 'ALL' && t.process !== processFilter) return false;
      if (leadTypeFilter !== 'ALL' && t.leadType !== leadTypeFilter) return false;
      if (searchQuery && !t.callerName.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  }, [transactions, processFilter, leadTypeFilter, searchQuery]);

  const handleExportDailyBatch = () => {
    showToast('Exporting daily batch report to CSV. Check your downloads.');
  };

  const handleExportFullBenchmarks = () => {
    showToast('Exporting caller performance benchmarks to Excel...');
  };

  return (
    <main className="p-md flex gap-md min-h-[calc(100vh-56px)] bg-white relative">
      {/* Click outside backdrop for dropdowns */}
      {showDatePicker && (
        <div className="fixed inset-0 z-20 cursor-default" onClick={() => setShowDatePicker(false)} />
      )}

      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white text-xs px-4 py-2.5 rounded shadow-xl z-50 transition-all font-bold">
          {toast}
        </div>
      )}

      {/* Sidebar navigation */}
      <aside className="w-64 flex-shrink-0 space-y-4">
        <div className="bg-white p-sm rounded border border-outline-variant shadow-xs">
          <p className="font-label-caps text-[10px] text-on-surface-variant uppercase mb-sm px-xs font-bold tracking-widest">Performance Hub</p>
          <div className="space-y-1">
            <button
              onClick={() => setActiveTab('revenue')}
              className={`w-full text-left px-sm py-md font-label-caps text-label-caps flex items-center justify-between rounded transition-all group ${activeTab === 'revenue'
                  ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                  : 'text-on-surface-variant hover:bg-slate-50'
                }`}
            >
              <span className="flex items-center gap-sm">
                <span className={`material-symbols-outlined text-[20px] ${activeTab === 'revenue' ? 'text-primary' : 'text-slate-500'}`} data-icon="payments">payments</span>
                Revenue Report
              </span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveTab('funnel')}
              className={`w-full text-left px-sm py-md font-label-caps text-label-caps flex items-center justify-between rounded transition-all group ${activeTab === 'funnel'
                  ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                  : 'text-on-surface-variant hover:bg-slate-50'
                }`}
            >
              <span className="flex items-center gap-sm">
                <span className={`material-symbols-outlined text-[20px] ${activeTab === 'funnel' ? 'text-primary' : 'text-slate-500'}`} data-icon="filter_alt">filter_alt</span>
                Funnel Report
              </span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveTab('benchmarking')}
              className={`w-full text-left px-sm py-md font-label-caps text-label-caps flex items-center justify-between rounded transition-all group ${activeTab === 'benchmarking'
                  ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                  : 'text-on-surface-variant hover:bg-slate-50'
                }`}
            >
              <span className="flex items-center gap-sm">
                <span className={`material-symbols-outlined text-[20px] ${activeTab === 'benchmarking' ? 'text-primary' : 'text-slate-500'}`} data-icon="monitoring">monitoring</span>
                Caller Benchmarking
              </span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveTab('qc')}
              className={`w-full text-left px-sm py-md font-label-caps text-label-caps flex items-center justify-between rounded transition-all group ${activeTab === 'qc'
                  ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                  : 'text-on-surface-variant hover:bg-slate-50'
                }`}
            >
              <span className="flex items-center gap-sm">
                <span className={`material-symbols-outlined text-[20px] ${activeTab === 'qc' ? 'text-primary' : 'text-slate-500'}`} data-icon="trending_up">trending_up</span>
                QC Trend
              </span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveTab('incentive')}
              className={`w-full text-left px-sm py-md font-label-caps text-label-caps flex items-center justify-between rounded transition-all group ${activeTab === 'incentive'
                  ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                  : 'text-on-surface-variant hover:bg-slate-50'
                }`}
            >
              <span className="flex items-center gap-sm">
                <span className={`material-symbols-outlined text-[20px] ${activeTab === 'incentive' ? 'text-primary' : 'text-slate-500'}`} data-icon="redeem">redeem</span>
                Incentive Summary
              </span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
            </button>

            <button
              onClick={() => setActiveTab('attendance')}
              className={`w-full text-left px-sm py-md font-label-caps text-label-caps flex items-center justify-between rounded transition-all group ${activeTab === 'attendance'
                  ? 'bg-primary/10 text-primary font-bold border-l-4 border-primary'
                  : 'text-on-surface-variant hover:bg-slate-50'
                }`}
            >
              <span className="flex items-center gap-sm">
                <span className={`material-symbols-outlined text-[20px] ${activeTab === 'attendance' ? 'text-primary' : 'text-slate-500'}`} data-icon="event_available">event_available</span>
                Attendance
              </span>
              <span className="material-symbols-outlined text-[16px] text-on-surface-variant group-hover:translate-x-1 transition-transform" data-icon="chevron_right">chevron_right</span>
            </button>
          </div>
        </div>

        <div className="bg-primary/5 text-primary p-md rounded border border-primary/20 shadow-xs">
          <p className="font-label-caps text-label-caps font-bold mb-xs text-primary">Download Center</p>
          <p className="text-[11px] text-slate-600 mb-md">All scheduled reports are ready for bulk export.</p>
          <button
            onClick={handleExportDailyBatch}
            className="w-full bg-primary text-white font-label-caps text-label-caps py-2 rounded font-bold hover:bg-primary-container shadow-xs transition-all flex items-center justify-center gap-sm"
          >
            <span className="material-symbols-outlined text-[18px]" data-icon="download">download</span> Export Daily Batch
          </button>
        </div>
      </aside>

      {/* Main Reports Hub Canvas */}
      <section className="flex-grow space-y-md">

        {/* REVENUE REPORT TAB */}
        {activeTab === 'revenue' && (
          <div className="space-y-md">
            <div className="flex items-center justify-between bg-white p-md rounded border border-outline-variant shadow-xs">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold text-slate-800">Revenue Analysis</h2>
                <p className="text-on-surface-variant text-body-sm">Visualizing monetary conversion across processes and callers.</p>
              </div>
              <div className="flex items-center gap-sm relative">
                <div
                  onClick={() => setShowDatePicker(!showDatePicker)}
                  className="flex items-center bg-white border border-outline-variant rounded px-sm py-1.5 cursor-pointer hover:border-primary transition-all gap-1"
                >
                  <span className="material-symbols-outlined text-[18px] text-slate-500" data-icon="calendar_today">calendar_today</span>
                  <span className="text-xs font-semibold text-slate-700">{dateRange}</span>
                  <span className="material-symbols-outlined text-[16px] text-slate-400" data-icon="keyboard_arrow_down">keyboard_arrow_down</span>
                </div>
                {showDatePicker && (
                  <div className="absolute top-full right-0 mt-1 bg-white border border-outline-variant rounded shadow-md z-30 py-1 w-44 text-xs font-semibold text-slate-700">
                    {['Oct 01 - Oct 31, 2023', 'Last 7 Days', 'Today', 'Yesterday'].map(range => (
                      <div
                        key={range}
                        onClick={() => { setDateRange(range); setShowDatePicker(false); showToast(`Date filter updated to ${range}`); }}
                        className={`px-3 py-1.5 hover:bg-slate-50 cursor-pointer ${dateRange === range ? 'text-primary font-bold bg-primary/5' : ''}`}
                      >
                        {range}
                      </div>
                    ))}
                  </div>
                )}
                <button
                  onClick={() => showToast(`Filtering data for date range: ${dateRange}`)}
                  className="bg-primary text-white px-md py-2 rounded font-label-caps text-label-caps font-bold hover:bg-primary-container shadow-xs transition-all"
                >
                  Filter Data
                </button>
              </div>
            </div>

            <div className="grid grid-cols-12 gap-md">
              <div className="col-span-7 bg-white p-md rounded border border-outline-variant shadow-xs flex flex-col">
                <div className="flex justify-between items-center mb-md">
                  <h3 className="font-label-caps text-label-caps font-bold text-slate-800">Revenue by Process</h3>
                  <span className="material-symbols-outlined text-on-surface-variant cursor-help" data-icon="info" title="Total revenue generated per lead category">info</span>
                </div>
                <div className="flex-grow flex items-end gap-md h-48 pb-lg px-md">
                  <div className="flex-1 flex flex-col items-center gap-xs">
                    <div className="w-full bg-primary/90 rounded-t hover:bg-primary transition-all cursor-pointer relative group" style={{ height: '85%' }}>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-900 text-white text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹4.2L</div>
                    </div>
                    <span className="text-[10px] font-label-caps uppercase truncate w-full text-center">Fulfillment</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-xs">
                    <div className="w-full bg-primary/90 rounded-t hover:bg-primary transition-all cursor-pointer relative group" style={{ height: '60%' }}>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-900 text-white text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹3.1L</div>
                    </div>
                    <span className="text-[10px] font-label-caps uppercase truncate w-full text-center">Inbound Sales</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-xs">
                    <div className="w-full bg-secondary rounded-t hover:bg-secondary/95 transition-all cursor-pointer relative group" style={{ height: '95%' }}>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-900 text-white text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹4.8L</div>
                    </div>
                    <span className="text-[10px] font-label-caps uppercase truncate w-full text-center">Urgent Lead</span>
                  </div>
                  <div className="flex-1 flex flex-col items-center gap-xs">
                    <div className="w-full bg-primary/90 rounded-t hover:bg-primary transition-all cursor-pointer relative group" style={{ height: '40%' }}>
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 bg-slate-900 text-white text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">₹2.0L</div>
                    </div>
                    <span className="text-[10px] font-label-caps uppercase truncate w-full text-center">Recovery</span>
                  </div>
                </div>
              </div>

              <div className="col-span-5 bg-white p-md rounded border border-outline-variant shadow-xs">
                <h3 className="font-label-caps text-label-caps font-bold mb-md text-slate-800">Source Attribution</h3>
                <div className="relative w-40 h-40 mx-auto mb-md">
                  <div className="w-full h-full rounded-full" style={{ background: 'conic-gradient(#0056c3 0% 45%, #fd661d 45% 75%, #a73a00 75% 100%)' }}></div>
                  <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center flex-col">
                    <span className="text-headline-md font-bold text-slate-800">₹14.1L</span>
                    <span className="text-[9px] uppercase font-bold text-on-surface-variant">Total Rev</span>
                  </div>
                </div>
                <div className="space-y-xs">
                  <div className="flex items-center justify-between text-[11px] text-slate-700">
                    <span className="flex items-center gap-xs"><div className="w-2 h-2 rounded-full bg-primary"></div> Digital Ads</span>
                    <span className="font-bold">45%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-700">
                    <span className="flex items-center gap-xs"><div className="w-2 h-2 rounded-full bg-secondary-container"></div> Referral</span>
                    <span className="font-bold">30%</span>
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-slate-700">
                    <span className="flex items-center gap-xs"><div className="w-2 h-2 rounded-full bg-secondary"></div> Offline</span>
                    <span className="font-bold">25%</span>
                  </div>
                </div>
              </div>

              <div className="col-span-12 bg-white p-md rounded border border-outline-variant shadow-xs">
                <div className="flex justify-between items-center mb-lg">
                  <h3 className="font-label-caps text-label-caps font-bold text-slate-800">Top Callers Performance (Revenue Focus)</h3>
                  <div className="flex gap-sm">
                    <span className="flex items-center gap-xs text-[10px] font-bold uppercase"><div className="w-2 h-2 bg-primary"></div> Target</span>
                    <span className="flex items-center gap-xs text-[10px] font-bold uppercase"><div className="w-2 h-2 bg-secondary-container"></div> Achieved</span>
                  </div>
                </div>
                <div className="space-y-md">
                  {[
                    { name: 'Amit Sharma', target: '85%', achieved: '10%', value: '₹2.4L' },
                    { name: 'Priya Verma', target: '70%', achieved: '25%', value: '₹1.9L' },
                    { name: 'Suresh Raina', target: '60%', achieved: '30%', value: '₹1.7L' }
                  ].map((caller, idx) => (
                    <div key={idx} className="flex items-center gap-md">
                      <div className="w-32 text-xs font-bold text-slate-700 truncate">{caller.name}</div>
                      <div className="flex-grow h-4 bg-slate-100 rounded-full overflow-hidden flex relative">
                        <div className="bg-primary h-full" style={{ width: caller.target }}></div>
                        <div className="bg-secondary-container h-full" style={{ width: caller.achieved, marginLeft: '-1%' }}></div>
                      </div>
                      <div className="w-16 text-right font-data-mono text-xs font-bold text-slate-700">{caller.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Transaction Table */}
            <div className="bg-white rounded border border-outline-variant shadow-xs overflow-hidden">
              <div className="px-md py-sm bg-white border-b border-outline-variant flex justify-between items-center">
                <div className="flex items-center gap-md">
                  <h3 className="font-label-caps text-label-caps font-bold text-slate-800">Transaction Breakdown</h3>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search by Caller..."
                    className="border border-outline-variant rounded px-2.5 py-1 text-xs focus:outline-none focus:border-primary w-48"
                  />
                </div>
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`font-label-caps text-label-caps flex items-center gap-xs px-2.5 py-1 rounded transition-colors ${showAdvancedFilters ? 'bg-primary/10 text-primary font-bold' : 'text-primary hover:bg-slate-50'
                    }`}
                >
                  <span className="material-symbols-outlined text-[18px]" data-icon="tune">tune</span> Advanced Filters
                </button>
              </div>

              {/* Advanced Filter Panel */}
              {showAdvancedFilters && (
                <div className="bg-slate-50 p-md border-b border-outline-variant flex gap-xl text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span>Process:</span>
                    <select
                      value={processFilter}
                      onChange={(e) => setProcessFilter(e.target.value)}
                      className="border border-outline-variant rounded p-1 text-xs bg-white focus:outline-none"
                    >
                      <option value="ALL">All Processes</option>
                      <option value="Fulfillment">Fulfillment</option>
                      <option value="Inbound Sales">Inbound Sales</option>
                      <option value="Urgent Lead">Urgent Lead</option>
                      <option value="Recovery">Recovery</option>
                    </select>
                  </div>
                  <div className="flex items-center gap-2">
                    <span>Lead Type:</span>
                    <select
                      value={leadTypeFilter}
                      onChange={(e) => setLeadTypeFilter(e.target.value)}
                      className="border border-outline-variant rounded p-1 text-xs bg-white focus:outline-none"
                    >
                      <option value="ALL">All Lead Types</option>
                      <option value="HOT">Hot</option>
                      <option value="WARM">Warm</option>
                      <option value="COLD">Cold</option>
                    </select>
                  </div>
                  {(processFilter !== 'ALL' || leadTypeFilter !== 'ALL' || searchQuery !== '') && (
                    <button
                      onClick={() => { setProcessFilter('ALL'); setLeadTypeFilter('ALL'); setSearchQuery(''); }}
                      className="text-error text-xs font-bold hover:underline"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-outline-variant">
                    <tr>
                      <th className="px-md py-sm font-label-caps text-[12px] text-slate-500 uppercase">Date</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-slate-500 uppercase">Caller Name</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-slate-500 uppercase">Process</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-slate-500 uppercase">Units</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-slate-500 uppercase">Lead Type</th>
                      <th className="px-md py-sm font-label-caps text-[12px] text-slate-500 uppercase text-right">Revenue</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant">
                    {filteredTransactions.length > 0 ? (
                      filteredTransactions.map((tx, idx) => (
                        <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                          <td className="px-md py-sm font-data-mono text-xs">{tx.date}</td>
                          <td className="px-md py-sm text-xs font-bold text-slate-800">{tx.callerName}</td>
                          <td className="px-md py-sm text-xs text-slate-600">{tx.process}</td>
                          <td className="px-md py-sm text-xs text-slate-600">{tx.units}</td>
                          <td className="px-md py-sm">
                            <span className={`px-sm py-0.5 rounded text-[10px] font-bold ${tx.leadType === 'HOT' ? 'bg-red-50 text-red-700' :
                                tx.leadType === 'WARM' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-600'
                              }`}>{tx.leadType}</span>
                          </td>
                          <td className="px-md py-sm font-data-mono text-xs text-right font-bold text-slate-800">₹{tx.revenue.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-outline text-xs font-semibold">No transactions match your filter criteria.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* FUNNEL REPORT TAB */}
        {activeTab === 'funnel' && (
          <div className="space-y-md">
            <div className="bg-white p-md rounded border border-outline-variant shadow-xs">
              <h2 className="font-headline-md text-headline-md font-bold text-slate-800">Funnel Analysis</h2>
              <p className="text-on-surface-variant text-body-sm">Analysis of lead transition rates through marketing and sales pipelines.</p>
            </div>

            <div className="grid grid-cols-4 gap-md">
              {[
                { label: 'Total Leads', count: '14,284', desc: 'Sourced leads', color: 'bg-primary' },
                { label: 'Contacted', count: '9,482', desc: 'Outbound called (66%)', color: 'bg-primary-container' },
                { label: 'Interested', count: '4,102', desc: 'Positive feedback (28%)', color: 'bg-secondary-container' },
                { label: 'Onboarded', count: '1,284', desc: 'Final registration (9%)', color: 'bg-secondary' }
              ].map((step, idx) => (
                <div key={idx} className="bg-white p-md border border-outline-variant rounded shadow-xs relative overflow-hidden">
                  <div className={`absolute left-0 top-0 bottom-0 w-1 ${step.color}`}></div>
                  <span className="text-[10px] font-bold uppercase text-slate-400">{step.label}</span>
                  <p className="text-headline-md font-bold text-slate-800 mt-1">{step.count}</p>
                  <p className="text-[10px] text-slate-500 mt-2">{step.desc}</p>
                </div>
              ))}
            </div>

            <div className="bg-white p-md rounded border border-outline-variant shadow-xs">
              <h3 className="font-bold text-slate-800 text-xs mb-4">Pipeline Conversion Rate (Historical Trend)</h3>
              <div className="h-48 bg-slate-50 rounded flex items-end justify-between p-lg relative">
                <div className="absolute inset-x-md top-1/2 border-t border-dashed border-slate-200"></div>
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-2 w-12 z-10">
                    <div className="w-6 bg-primary rounded-t hover:bg-primary-container transition-all" style={{ height: `${50 + (idx * 6)}px` }}></div>
                    <span className="text-[10px] font-bold text-slate-500">{month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CALLER BENCHMARKING TAB */}
        {activeTab === 'benchmarking' && (
          <div className="space-y-md">
            <div className="flex items-center justify-between bg-white p-md rounded border border-outline-variant shadow-xs">
              <div>
                <h2 className="font-headline-md text-headline-md font-bold text-slate-800">Caller Benchmarking</h2>
                <p className="text-on-surface-variant text-body-sm">Standardized comparison across all operational metrics.</p>
              </div>
              <div className="flex items-center gap-sm">
                <button
                  onClick={handleExportFullBenchmarks}
                  className="bg-[#FB641B] text-white px-md py-2 rounded font-label-caps text-label-caps font-bold hover:brightness-110 shadow-xs transition-all flex items-center gap-sm"
                >
                  <span className="material-symbols-outlined text-[18px]" data-icon="ios_share">ios_share</span> Export Full Benchmarks
                </button>
              </div>
            </div>

            <div className="bg-white rounded border border-outline-variant shadow-xs overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead className="bg-[#F0F2F5]">
                  <tr>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase sticky left-0 bg-[#F0F2F5]">Agent Identity</th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">Calls/Day</th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">Conv. Rate</th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">Avg Duration</th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">Revenue/Agent</th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase text-center">QC Score</th>
                    <th className="px-md py-sm font-label-caps text-[12px] text-on-surface-variant uppercase">Trend</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-md py-md sticky left-0 bg-white">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">AS</div>
                        <div>
                          <p className="font-label-caps text-label-caps font-bold text-slate-800">Amit Sharma</p>
                          <p className="text-[10px] text-on-surface-variant">Lvl 4 Senior</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md text-center font-data-mono text-xs font-bold text-slate-700">142</td>
                    <td className="px-md py-md text-center">
                      <p className="font-data-mono text-xs text-green-600 font-bold">12.4%</p>
                      <div className="w-full bg-slate-100 h-1 rounded-full mt-1"><div className="bg-green-500 h-full w-[80%]"></div></div>
                    </td>
                    <td className="px-md py-md text-center font-data-mono text-xs font-bold text-slate-700">04:12</td>
                    <td className="px-md py-md text-center font-data-mono text-xs font-bold text-slate-700">₹2.41L</td>
                    <td className="px-md py-md text-center">
                      <span className="px-sm py-1 bg-green-100 text-green-800 text-[11px] font-bold rounded">9.2/10</span>
                    </td>
                    <td className="px-md py-md">
                      <span className="material-symbols-outlined text-green-500" data-icon="trending_up">trending_up</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-md py-md sticky left-0 bg-white">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">PV</div>
                        <div>
                          <p className="font-label-caps text-label-caps font-bold text-slate-800">Priya Verma</p>
                          <p className="text-[10px] text-on-surface-variant">Lvl 3 Associate</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md text-center font-data-mono text-xs font-bold text-slate-700">118</td>
                    <td className="px-md py-md text-center">
                      <p className="font-data-mono text-xs text-amber-600 font-bold">8.1%</p>
                      <div className="w-full bg-slate-100 h-1 rounded-full mt-1"><div className="bg-amber-500 h-full w-[55%]"></div></div>
                    </td>
                    <td className="px-md py-md text-center font-data-mono text-xs font-bold text-slate-700">03:45</td>
                    <td className="px-md py-md text-center font-data-mono text-xs font-bold text-slate-700">₹1.88L</td>
                    <td className="px-md py-md text-center">
                      <span className="px-sm py-1 bg-amber-100 text-amber-800 text-[11px] font-bold rounded">7.8/10</span>
                    </td>
                    <td className="px-md py-md">
                      <span className="material-symbols-outlined text-amber-500" data-icon="trending_flat">trending_flat</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 transition-colors">
                    <td className="px-md py-md sticky left-0 bg-white">
                      <div className="flex items-center gap-sm">
                        <div className="w-8 h-8 rounded bg-slate-100 flex items-center justify-center font-bold text-xs text-slate-600">SR</div>
                        <div>
                          <p className="font-label-caps text-label-caps font-bold text-slate-800">Suresh Raina</p>
                          <p className="text-[10px] text-on-surface-variant">Lvl 4 Senior</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-md text-center font-data-mono text-xs font-bold text-slate-700">156</td>
                    <td className="px-md py-md text-center">
                      <p className="font-data-mono text-xs text-green-600 font-bold">10.2%</p>
                      <div className="w-full bg-slate-100 h-1 rounded-full mt-1"><div className="bg-green-500 h-full w-[72%]"></div></div>
                    </td>
                    <td className="px-md py-md text-center font-data-mono text-xs font-bold text-slate-700">05:30</td>
                    <td className="px-md py-md text-center font-data-mono text-xs font-bold text-slate-700">₹1.72L</td>
                    <td className="px-md py-md text-center">
                      <span className="px-sm py-1 bg-red-100 text-red-800 text-[11px] font-bold rounded">6.4/10</span>
                    </td>
                    <td className="px-md py-md">
                      <span className="material-symbols-outlined text-red-500" data-icon="trending_down">trending_down</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* QC TREND TAB */}
        {activeTab === 'qc' && (
          <div className="space-y-md">
            <div className="bg-white p-md rounded border border-outline-variant shadow-xs">
              <h2 className="font-headline-md text-headline-md font-bold text-slate-800">Quality Control (QC) Trends</h2>
              <p className="text-on-surface-variant text-body-sm">Historical evaluations of outbound call reviews and audit scores.</p>
            </div>
            <div className="bg-white p-md rounded border border-outline-variant shadow-xs">
              <h3 className="font-bold text-slate-800 text-xs mb-4">Average Evaluation Score</h3>
              <div className="h-40 bg-slate-50 rounded flex items-center justify-center text-xs font-bold text-slate-400">
                [ Line Chart: Avg QC Score over last 30 days (Current: 8.2/10) ]
              </div>
            </div>
          </div>
        )}

        {/* INCENTIVE SUMMARY TAB */}
        {activeTab === 'incentive' && (
          <div className="space-y-md">
            <div className="bg-white p-md rounded border border-outline-variant shadow-xs">
              <h2 className="font-headline-md text-headline-md font-bold text-slate-800">Incentive Summary</h2>
              <p className="text-on-surface-variant text-body-sm">Calculated payout incentives per telecaller based on target conversions.</p>
            </div>
            <div className="bg-white p-md rounded border border-outline-variant shadow-xs">
              <h3 className="font-bold text-slate-800 text-xs mb-4">Caller Payout Matrix</h3>
              <div className="h-40 bg-slate-50 rounded flex items-center justify-center text-xs font-bold text-slate-400">
                [ Table Matrix: Projected vs Approved Incentives ]
              </div>
            </div>
          </div>
        )}

        {/* ATTENDANCE TAB */}
        {activeTab === 'attendance' && (
          <div className="space-y-md">
            <div className="bg-white p-md rounded border border-outline-variant shadow-xs">
              <h2 className="font-headline-md text-headline-md font-bold text-slate-800">Attendance Log</h2>
              <p className="text-on-surface-variant text-body-sm">Monthly overview of caller logins, check-ins, and active statuses.</p>
            </div>
            <div className="bg-white p-md rounded border border-outline-variant shadow-xs">
              <h3 className="font-bold text-slate-800 text-xs mb-4">Monthly Login Ratios</h3>
              <div className="h-40 bg-slate-50 rounded flex items-center justify-center text-xs font-bold text-slate-400">
                [ Log Calendar: Check-in/out stamps ]
              </div>
            </div>
          </div>
        )}

      </section>
    </main>
  );
};

export default ThReportsHub;
