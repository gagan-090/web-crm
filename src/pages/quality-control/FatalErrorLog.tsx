import React, { useState } from 'react';

interface FatalViolation {
  id: string;
  date: string;
  caller: string;
  tmid: string;
  errorType: string;
  timestamp: string;
  escalation: 'Pending TL' | 'TL Reviewed' | 'Not Escalated' | 'Critical';
  resolutionNote: string;
}

export const FatalErrorLog: React.FC = () => {
  // Mock data state
  const [violations, setViolations] = useState<FatalViolation[]>([
    { id: '1', date: 'Oct 24, 2023', caller: 'Aman Gupta', tmid: 'TM-99210', errorType: 'Wrong Price', timestamp: '04:12 / 12:40', escalation: 'Pending TL', resolutionNote: 'Awaiting feedback from Ops...' },
    { id: '2', date: 'Oct 24, 2023', caller: 'Rahul V.', tmid: 'TM-99344', errorType: 'False Promise', timestamp: '01:05 / 08:22', escalation: 'TL Reviewed', resolutionNote: 'PIP initiated for agent.' },
    { id: '3', date: 'Oct 23, 2023', caller: 'Sana Khan', tmid: 'TM-98112', errorType: 'Verification Failure', timestamp: '07:44 / 09:15', escalation: 'Not Escalated', resolutionNote: 'Low impact deviation.' },
    { id: '4', date: 'Oct 23, 2023', caller: 'Vikram S.', tmid: 'TM-97883', errorType: 'Rude Behavior', timestamp: '00:30 / 15:00', escalation: 'Critical', resolutionNote: 'Immediate action needed.' },
    { id: '5', date: 'Oct 22, 2023', caller: 'Priya D.', tmid: 'TM-99021', errorType: 'Wrong Price', timestamp: '03:15 / 10:20', escalation: 'Pending TL', resolutionNote: 'Under supervisor review.' },
    { id: '6', date: 'Oct 22, 2023', caller: 'Suresh K.', tmid: 'TM-98442', errorType: 'Compliance Breach', timestamp: '05:40 / 09:30', escalation: 'TL Reviewed', resolutionNote: 'Feedback compiled.' },
    { id: '7', date: 'Oct 21, 2023', caller: 'Amit V.', tmid: 'TM-98251', errorType: 'False Promise', timestamp: '02:10 / 07:15', escalation: 'Not Escalated', resolutionNote: 'Documented.' },
    { id: '8', date: 'Oct 20, 2023', caller: 'Neha G.', tmid: 'TM-98877', errorType: 'Verification Failure', timestamp: '04:50 / 08:40', escalation: 'Critical', resolutionNote: 'Action required.' },
    { id: '9', date: 'Oct 19, 2023', caller: 'Kunal S.', tmid: 'TM-98722', errorType: 'Wrong Price', timestamp: '06:12 / 11:20', escalation: 'TL Reviewed', resolutionNote: 'Re-coaching scheduled.' },
    { id: '10', date: 'Oct 18, 2023', caller: 'Rajesh K.', tmid: 'TM-98566', errorType: 'Rude Behavior', timestamp: '01:30 / 09:10', escalation: 'Pending TL', resolutionNote: 'Awaiting HR sync.' },
    { id: '11', date: 'Oct 17, 2023', caller: 'Pooja P.', tmid: 'TM-98311', errorType: 'False Promise', timestamp: '03:00 / 08:15', escalation: 'Not Escalated', resolutionNote: 'Logged.' },
    { id: '12', date: 'Oct 16, 2023', caller: 'Sameer D.', tmid: 'TM-98004', errorType: 'Verification Failure', timestamp: '02:45 / 06:30', escalation: 'TL Reviewed', resolutionNote: 'Resolved.' }
  ]);

  // UI States
  const [searchQuery, setSearchQuery] = useState('');
  const [errorTypeFilter, setErrorTypeFilter] = useState('All');
  const [escalationFilter, setEscalationFilter] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // Popovers
  const [showFilterPop, setShowFilterPop] = useState(false);
  const [activeActionsRowId, setActiveActionsRowId] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dynamic Root Cause percentages based on ACTIVE dataset
  const totalCount = violations.length;
  const falsePromisePct = Math.round((violations.filter(v => v.errorType === 'False Promise').length / totalCount) * 100);
  const wrongPricePct = Math.round((violations.filter(v => v.errorType === 'Wrong Price').length / totalCount) * 100);
  const verifFailurePct = Math.round((violations.filter(v => v.errorType === 'Verification Failure').length / totalCount) * 100);

  // Filtering
  const filteredViolations = violations.filter(rec => {
    const matchesSearch = rec.caller.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          rec.tmid.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesErrorType = errorTypeFilter === 'All' || rec.errorType === errorTypeFilter;
    const matchesEscalation = escalationFilter === 'All' || rec.escalation === escalationFilter;
    return matchesSearch && matchesErrorType && matchesEscalation;
  });

  // Pagination
  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(filteredViolations.length / ITEMS_PER_PAGE) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const paginatedViolations = filteredViolations.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleUpdateEscalation = (id: string, newEsc: typeof violations[0]['escalation']) => {
    setViolations(prev => prev.map(rec => {
      if (rec.id === id) {
        return { ...rec, escalation: newEsc, resolutionNote: `Escalated to ${newEsc} pathways.` };
      }
      return rec;
    }));
    triggerToast(`Escalated violation state to ${newEsc} ✓`);
    setActiveActionsRowId(null);
  };

  const handleExport = () => {
    triggerToast('Exported compliance violations to CSV ✓');
  };

  const handleReset = () => {
    setErrorTypeFilter('All');
    setEscalationFilter('All');
    setSearchQuery('');
    setCurrentPage(1);
    setShowFilterPop(false);
    triggerToast('Filters reset successfully');
  };

  return (
    <main className="bg-white w-full max-w-7xl mx-auto p-6 space-y-6 relative text-xs md:text-sm">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs md:text-sm px-5 py-2.5 rounded-xl z-50 flex items-center gap-2 border border-slate-800 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white p-5 border border-slate-200 rounded-xl">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Fatal Error Log</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">Real-time tracking of critical process deviations and compliance failures.</p>
        </div>
        
        <div className="flex gap-4">
          <div className="bg-red-50 p-4 rounded-xl flex flex-col justify-center border border-red-200 min-w-[140px]">
            <span className="text-[10px] text-red-650 font-bold uppercase tracking-wider">Fatal Error Rate</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="text-xl md:text-2xl font-black text-red-700">2.3%</span>
              <span className="text-red-500/70 text-xs font-bold">(-0.4%)</span>
            </div>
          </div>
          <div className="bg-slate-50 p-4 rounded-xl flex flex-col justify-center border border-slate-200 min-w-[140px]">
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Open Escalations</span>
            <span className="text-xl md:text-2xl font-black text-slate-800 mt-1">14</span>
          </div>
        </div>
      </div>

      {/* Main Table Wrapper */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
        
        {/* Table Filter/Search Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm md:text-base">search</span>
              <input 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none w-64 transition-all text-slate-700 font-semibold" 
                placeholder="Search TMID or Caller..." 
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            {/* Filter Toggle */}
            <div className="relative">
              <button 
                onClick={() => setShowFilterPop(!showFilterPop)}
                className={`px-3 py-2 border rounded-lg text-xs md:text-sm font-bold flex items-center gap-1 transition-all ${
                  errorTypeFilter !== 'All' || escalationFilter !== 'All' 
                    ? 'border-amber-500 bg-amber-50 text-amber-700' 
                    : 'bg-white border-slate-200 hover:bg-slate-50 text-slate-650'
                }`}
              >
                <span className="material-symbols-outlined text-xs md:text-base">filter_list</span>
                Filter
              </button>

              {showFilterPop && (
                <div className="absolute left-0 mt-2 w-56 bg-white border border-slate-200 rounded-xl p-4 z-30 space-y-3">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Error Type</label>
                    <select 
                      value={errorTypeFilter} 
                      onChange={(e) => { setErrorTypeFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full border border-slate-200 rounded-lg p-1.5 outline-none font-bold text-slate-700 bg-slate-50 text-xs md:text-sm"
                    >
                      <option value="All">All Types</option>
                      <option value="Wrong Price">Wrong Price</option>
                      <option value="False Promise">False Promise</option>
                      <option value="Verification Failure">Verification Failure</option>
                      <option value="Rude Behavior">Rude Behavior</option>
                      <option value="Compliance Breach">Compliance Breach</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Escalation</label>
                    <select 
                      value={escalationFilter} 
                      onChange={(e) => { setEscalationFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full border border-slate-200 rounded-lg p-1.5 outline-none font-bold text-slate-700 bg-slate-50 text-xs md:text-sm"
                    >
                      <option value="All">All States</option>
                      <option value="Pending TL">Pending TL</option>
                      <option value="TL Reviewed">TL Reviewed</option>
                      <option value="Not Escalated">Not Escalated</option>
                      <option value="Critical">Critical</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      onClick={handleReset}
                      className="text-[10px] font-extrabold text-amber-500 hover:text-amber-600 underline"
                    >
                      Reset Filters
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Export Trigger */}
            <button 
              onClick={handleExport}
              className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1 hover:bg-slate-50 transition-colors text-slate-650"
            >
              <span className="material-symbols-outlined text-xs md:text-base">download</span>
              Export
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-slate-400 font-bold">{filteredViolations.length} Compliance Violations</span>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse min-w-[900px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-400 font-bold uppercase text-xs">
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Caller</th>
                <th className="px-6 py-4">Call TMID</th>
                <th className="px-6 py-4">Error Type</th>
                <th className="px-6 py-4">Timestamp</th>
                <th className="px-6 py-4">Escalation</th>
                <th className="px-6 py-4">Resolution Note</th>
                <th className="px-6 py-4 text-right pr-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {paginatedViolations.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-400">{rec.date}</td>
                  <td className="px-6 py-4 font-extrabold text-slate-800">{rec.caller}</td>
                  <td className="px-6 py-4 font-mono font-bold text-amber-500">{rec.tmid}</td>
                  <td className="px-6 py-4">
                    <span className="text-red-600 font-bold bg-red-50 px-2 py-0.5 rounded border border-red-100 uppercase text-[10px]">
                      {rec.errorType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-400 font-mono text-xs">{rec.timestamp}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${
                        rec.escalation === 'TL Reviewed' ? 'bg-green-500' :
                        rec.escalation === 'Not Escalated' ? 'bg-slate-400' :
                        rec.escalation === 'Critical' ? 'bg-red-500 animate-pulse' : 'bg-amber-500'
                      }`}></span>
                      <span className="font-bold text-slate-700">{rec.escalation}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-500 italic max-w-[200px] truncate" title={rec.resolutionNote}>
                    {rec.resolutionNote}
                  </td>
                  <td className="px-6 py-4 text-right pr-6 relative">
                    {rec.escalation === 'TL Reviewed' ? (
                      <button className="text-slate-400 border border-slate-100 px-3 py-1.5 rounded-lg text-xs font-bold cursor-not-allowed bg-slate-50" disabled>
                        Reviewed
                      </button>
                    ) : (
                      <div className="inline-block text-left">
                        <button 
                          onClick={() => setActiveActionsRowId(activeActionsRowId === rec.id ? null : rec.id)}
                          className="bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-500 hover:text-white text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.98] inline-flex items-center gap-1"
                        >
                          <span>Escalate</span>
                          <span className="material-symbols-outlined text-xs">arrow_drop_down</span>
                        </button>

                        {activeActionsRowId === rec.id && (
                          <div className="absolute right-6 mt-1 w-40 bg-white border border-slate-200 rounded-xl p-2 z-40 space-y-1 text-left">
                            <button 
                              onClick={() => handleUpdateEscalation(rec.id, 'TL Reviewed')}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700"
                            >
                              TL Reviewed
                            </button>
                            <button 
                              onClick={() => handleUpdateEscalation(rec.id, 'Pending TL')}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-50 rounded-lg text-xs font-bold text-slate-700"
                            >
                              Pending TL
                            </button>
                            <button 
                              onClick={() => handleUpdateEscalation(rec.id, 'Critical')}
                              className="w-full text-left px-2.5 py-1.5 hover:bg-slate-55 rounded-lg text-xs font-bold text-red-600"
                            >
                              Critical Escalation
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filteredViolations.length === 0 && (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400 italic">No fatal violations found matching your query.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Pagination / Footer */}
        <div className="p-4 border-t border-slate-200 flex items-center justify-between bg-slate-50">
          <button 
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            className={`px-4 py-2 text-xs md:text-sm font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-1 ${
              activePage === 1 ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            disabled={activePage === 1}
          >
            <span className="material-symbols-outlined text-sm md:text-base">chevron_left</span>
            Previous
          </button>
          <div className="flex gap-1.5 text-xs font-bold">
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-8 h-8 rounded transition-colors ${
                  activePage === idx + 1 ? 'bg-amber-500 text-white font-extrabold' : 'hover:bg-slate-100 text-slate-650'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>
          <button 
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            className={`px-4 py-2 text-xs md:text-sm font-bold text-slate-500 border border-slate-200 rounded-xl hover:bg-slate-100 transition-all flex items-center gap-1 ${
              activePage === totalPages ? 'opacity-40 cursor-not-allowed' : ''
            }`}
            disabled={activePage === totalPages}
          >
            Next
            <span className="material-symbols-outlined text-sm md:text-base">chevron_right</span>
          </button>
        </div>
      </div>

      {/* Root Causes & Trend Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Top Root Causes */}
        <div className="lg:col-span-4 bg-white p-5 rounded-xl border border-slate-200 flex flex-col gap-4">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider">Top Fatal Root Causes</h3>
          <div className="space-y-4 mt-2">
            
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>False Promise</span>
                <span>{falsePromisePct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{"width": `${falsePromisePct}%`}}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Wrong Price Quoted</span>
                <span>{wrongPricePct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{"width": `${wrongPricePct}%`}}></div>
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold text-slate-700">
                <span>Verification Failure</span>
                <span>{verifFailurePct}%</span>
              </div>
              <div className="h-2 w-full bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{"width": `${verifFailurePct}%`}}></div>
              </div>
            </div>

          </div>
        </div>

        {/* Error Trend Charts */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 flex flex-col">
          <h3 className="text-xs font-bold uppercase text-slate-400 tracking-wider mb-4">Error Trend (Last 14 Days)</h3>
          
          <div className="flex-1 min-h-[140px] flex items-end justify-between gap-2 px-2 pb-2">
            {[2.1, 2.4, 2.8, 1.8, 2.5, 3.1, 2.3, 2.1, 2.6, 2.2, 1.9, 2.7, 2.4, 2.3].map((val, idx) => {
              const height = (val / 3.5) * 100;
              return (
                <div 
                  key={idx}
                  className={`w-full rounded-t-lg transition-colors cursor-help group relative ${
                    idx === 13 ? 'bg-amber-500' : 'bg-slate-100 hover:bg-amber-500 border border-slate-200/50'
                  }`}
                  style={{ height: `${height}%` }}
                >
                  <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-800 font-bold z-20">
                    {val}%
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>

    </main>
  );
};

export default FatalErrorLog;
