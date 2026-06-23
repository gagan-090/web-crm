import React, { useState } from 'react';

interface FeedbackRecord {
  id: string;
  caller: string;
  process: string;
  score: number;
  severity: 'CRITICAL' | 'NEEDS IMPROVEMENT' | 'GOOD';
  auditDate: string;
  feedbackSent: string;
  acknowledged: 'warning' | 'check' | 'pending';
  acknowledgedText: string;
  remediation: string;
}

export const FeedbackManager: React.FC = () => {
  // Filter States
  const [selectedProcess, setSelectedProcess] = useState('All Processes');
  const [selectedCaller, setSelectedCaller] = useState('All Callers');
  const [minScore, setMinScore] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock data state
  const [records, setRecords] = useState<FeedbackRecord[]>([
    { id: '1', caller: 'Rohan Sharma', process: 'Outbound Logistics', score: 42, severity: 'CRITICAL', auditDate: 'Oct 24, 09:12 AM', feedbackSent: 'Oct 24, 11:30 AM', acknowledged: 'warning', acknowledgedText: 'Pending > 48h', remediation: 'Pending Supervisor Review' },
    { id: '2', caller: 'Sana Khan', process: 'Vendor Verification', score: 96, severity: 'GOOD', auditDate: 'Oct 26, 02:45 PM', feedbackSent: 'Oct 26, 03:00 PM', acknowledged: 'check', acknowledgedText: 'Acknowledged', remediation: 'Routine Appreciation' },
    { id: '3', caller: 'Vikram Singh', process: 'Inbound Dispatch', score: 74, severity: 'NEEDS IMPROVEMENT', auditDate: 'Oct 25, 11:20 AM', feedbackSent: 'Oct 25, 01:15 PM', acknowledged: 'pending', acknowledgedText: 'Pending', remediation: 'Script adherence training' },
    { id: '4', caller: 'Ananya Roy', process: 'Outbound Logistics', score: 58, severity: 'CRITICAL', auditDate: 'Oct 26, 10:00 AM', feedbackSent: 'Oct 26, 10:45 AM', acknowledged: 'pending', acknowledgedText: 'Pending', remediation: 'Fatal Error Rectification' },
    { id: '5', caller: 'Amit Patel', process: 'Vendor Verification', score: 88, severity: 'GOOD', auditDate: 'Oct 23, 04:20 PM', feedbackSent: 'Oct 23, 04:30 PM', acknowledged: 'check', acknowledgedText: 'Acknowledged', remediation: 'N/A' },
    { id: '6', caller: 'Neha Gupta', process: 'Outbound Logistics', score: 91, severity: 'GOOD', auditDate: 'Oct 22, 11:00 AM', feedbackSent: 'Oct 22, 11:30 AM', acknowledged: 'check', acknowledgedText: 'Acknowledged', remediation: 'N/A' },
    { id: '7', caller: 'Rajesh Kumar', process: 'Inbound Dispatch', score: 65, severity: 'NEEDS IMPROVEMENT', auditDate: 'Oct 21, 03:15 PM', feedbackSent: 'Oct 21, 04:00 PM', acknowledged: 'pending', acknowledgedText: 'Pending', remediation: 'Re-training on compliance' },
    { id: '8', caller: 'Priya Sharma', process: 'Vendor Verification', score: 38, severity: 'CRITICAL', auditDate: 'Oct 20, 09:00 AM', feedbackSent: 'Oct 20, 09:45 AM', acknowledged: 'warning', acknowledgedText: 'Pending > 48h', remediation: 'Escalated to Manager' },
    { id: '9', caller: 'Kunal Sen', process: 'Outbound Logistics', score: 82, severity: 'GOOD', auditDate: 'Oct 19, 02:00 PM', feedbackSent: 'Oct 19, 02:30 PM', acknowledged: 'check', acknowledgedText: 'Acknowledged', remediation: 'N/A' },
    { id: '10', caller: 'Pooja Patel', process: 'Inbound Dispatch', score: 55, severity: 'CRITICAL', auditDate: 'Oct 18, 04:00 PM', feedbackSent: 'Oct 18, 04:30 PM', acknowledged: 'warning', acknowledgedText: 'Pending > 48h', remediation: 'Under Review' },
    { id: '11', caller: 'Devendra B.', process: 'Outbound Logistics', score: 78, severity: 'NEEDS IMPROVEMENT', auditDate: 'Oct 17, 10:15 AM', feedbackSent: 'Oct 17, 11:00 AM', acknowledged: 'check', acknowledgedText: 'Acknowledged', remediation: 'Coaching completed' },
    { id: '12', caller: 'Ishita K.', process: 'Vendor Verification', score: 94, severity: 'GOOD', auditDate: 'Oct 16, 01:00 PM', feedbackSent: 'Oct 16, 01:20 PM', acknowledged: 'check', acknowledgedText: 'Acknowledged', remediation: 'N/A' },
    { id: '13', caller: 'Sameer D.', process: 'Inbound Dispatch', score: 49, severity: 'CRITICAL', auditDate: 'Oct 15, 03:30 PM', feedbackSent: 'Oct 15, 04:15 PM', acknowledged: 'warning', acknowledgedText: 'Pending > 48h', remediation: 'Awaiting response' },
    { id: '14', caller: 'Tanvi R.', process: 'Outbound Logistics', score: 87, severity: 'GOOD', auditDate: 'Oct 14, 11:10 AM', feedbackSent: 'Oct 14, 11:45 AM', acknowledged: 'check', acknowledgedText: 'Acknowledged', remediation: 'N/A' },
    { id: '15', caller: 'Rohit Verma', process: 'Vendor Verification', score: 72, severity: 'NEEDS IMPROVEMENT', auditDate: 'Oct 13, 02:20 PM', feedbackSent: 'Oct 13, 02:50 PM', acknowledged: 'check', acknowledgedText: 'Acknowledged', remediation: 'N/A' }
  ]);

  // Dynamic Statistics
  const pendingAcksCount = records.filter(r => r.acknowledged !== 'check').length;
  const criticalFlawsCount = records.filter(r => r.severity === 'CRITICAL').length;

  // Filtering
  const filteredRecords = records.filter(rec => {
    const matchesProcess = selectedProcess === 'All Processes' || rec.process === selectedProcess;
    const matchesCaller = selectedCaller === 'All Callers' || rec.caller === selectedCaller;
    const matchesScore = rec.score >= minScore;
    return matchesProcess && matchesCaller && matchesScore;
  });

  // Reset Filters
  const handleReset = () => {
    setSelectedProcess('All Processes');
    setSelectedCaller('All Callers');
    setMinScore(0);
    setCurrentPage(1);
    triggerToast('Filters reset successfully');
  };

  const handleAction = (rec: FeedbackRecord) => {
    triggerToast(`Sent reminder notification to ${rec.caller}`);
  };

  return (
    <main className="w-full max-w-7xl mx-auto p-6 space-y-6 relative">
      
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
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Feedback Manager</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">Monitor, review, and track agent acknowledgements and remediation actions.</p>
        </div>
      </div>

      {/* Filter and Stats row */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* Filters */}
        <div className="lg:col-span-8 bg-white p-5 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center">
          <div className="flex flex-col gap-1 min-w-[150px]">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">PROCESS</label>
            <select 
              value={selectedProcess}
              onChange={(e) => { setSelectedProcess(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs md:text-sm font-bold text-slate-700 outline-none w-full"
            >
              <option>All Processes</option>
              <option>Outbound Logistics</option>
              <option>Inbound Dispatch</option>
              <option>Vendor Verification</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 min-w-[150px]">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">CALLER</label>
            <select 
              value={selectedCaller}
              onChange={(e) => { setSelectedCaller(e.target.value); setCurrentPage(1); }}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs md:text-sm font-bold text-slate-700 outline-none w-full"
            >
              <option>All Callers</option>
              {Array.from(new Set(records.map(r => r.caller))).map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1 flex-1 min-w-[180px]">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">SCORE RANGE (0 - 100)</label>
            <div className="flex items-center gap-3">
              <input 
                type="range"
                min="0"
                max="100"
                value={minScore}
                onChange={(e) => { setMinScore(Number(e.target.value)); setCurrentPage(1); }}
                className="flex-1 accent-amber-500 h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-xs md:text-sm font-bold text-amber-500 whitespace-nowrap">{minScore}%-100%</span>
            </div>
          </div>

          <button 
            onClick={handleReset}
            className="bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-650 flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs md:text-sm font-bold transition-all self-end"
          >
            <span className="material-symbols-outlined text-sm md:text-base">refresh</span>
            Reset Filters
          </button>
        </div>

        {/* Stats */}
        <div className="lg:col-span-4 bg-slate-900 text-white rounded-xl p-5 flex justify-around items-center border border-slate-800">
          <div className="text-center border-r border-slate-800/60 px-4 w-full">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">PENDING ACKS</p>
            <p className="text-xl md:text-2xl font-black mt-1 text-amber-400">{pendingAcksCount}</p>
          </div>
          <div className="text-center border-r border-slate-800/60 px-4 w-full">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">CRITICAL FLAWS</p>
            <p className="text-xl md:text-2xl font-black mt-1 text-red-400">{criticalFlawsCount}</p>
          </div>
          <div className="text-center px-4 w-full">
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">AVG. RESPONSE</p>
            <p className="text-xl md:text-2xl font-black mt-1 text-sky-400">3.2h</p>
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse min-w-[1000px]">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-400 font-bold uppercase text-xs">
                <th className="p-4 pl-5">Caller</th>
                <th className="p-4">Process</th>
                <th className="p-4">Score</th>
                <th className="p-4">Severity</th>
                <th className="p-4">Audit Date</th>
                <th className="p-4">Feedback Sent</th>
                <th className="p-4 text-center">Acknowledged</th>
                <th className="p-4">Remediation</th>
                <th className="p-4 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {(() => {
                const ITEMS_PER_PAGE = 5;
                const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE) || 1;
                const activePage = Math.min(currentPage, totalPages);
                const paginated = filteredRecords.slice(
                  (activePage - 1) * ITEMS_PER_PAGE,
                  activePage * ITEMS_PER_PAGE
                );

                return (
                  <>
                    {paginated.map((rec) => (
                      <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-5 font-extrabold text-slate-800">{rec.caller}</td>
                        <td className="p-4 text-slate-550">{rec.process}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-slate-100 border border-slate-200/50 rounded-full overflow-hidden">
                              <div 
                                className={`h-full rounded-full ${
                                  rec.severity === 'GOOD' ? 'bg-green-500' :
                                  rec.severity === 'NEEDS IMPROVEMENT' ? 'bg-amber-500' : 'bg-red-500'
                                }`} 
                                style={{ width: `${rec.score}%` }}
                              ></div>
                            </div>
                            <span className={`font-mono text-xs font-black ${
                              rec.severity === 'GOOD' ? 'text-green-600' :
                              rec.severity === 'NEEDS IMPROVEMENT' ? 'text-amber-600' : 'text-red-600'
                            }`}>{rec.score}%</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] md:text-xs font-black px-2.5 py-0.5 rounded-full border uppercase ${
                            rec.severity === 'GOOD' ? 'bg-green-50 text-green-700 border-green-200' :
                            rec.severity === 'NEEDS IMPROVEMENT' ? 'bg-yellow-50 text-yellow-700 border-yellow-250' :
                            'bg-red-50 text-red-700 border-red-200'
                          }`}>
                            {rec.severity}
                          </span>
                        </td>
                        <td className="p-4 text-slate-400">{rec.auditDate}</td>
                        <td className="p-4 text-slate-450">{rec.feedbackSent}</td>
                        <td className="p-4 text-center">
                          {rec.acknowledged === 'warning' && (
                            <span className="material-symbols-outlined text-red-500 text-sm md:text-base font-bold" title={rec.acknowledgedText}>warning</span>
                          )}
                          {rec.acknowledged === 'check' && (
                            <span className="material-symbols-outlined text-green-500 text-sm md:text-base font-bold" title={rec.acknowledgedText}>check_circle</span>
                          )}
                          {rec.acknowledged === 'pending' && (
                            <span className="material-symbols-outlined text-slate-350 text-sm md:text-base font-bold animate-pulse" title={rec.acknowledgedText}>pending</span>
                          )}
                        </td>
                        <td className="p-4 text-slate-500 italic max-w-[200px] truncate" title={rec.remediation}>
                          {rec.remediation}
                        </td>
                        <td className="p-4 text-right pr-5">
                          <button 
                            onClick={() => handleAction(rec)}
                            className="bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-500 hover:text-white text-slate-700 px-3 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 ml-auto"
                          >
                            <span className="material-symbols-outlined text-xs md:text-sm">forward_to_inbox</span>
                            {rec.acknowledged === 'check' ? 'Notify' : 'Remind'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400 italic">No feedback entries found matching your filters.</td>
                      </tr>
                    )}
                  </>
                );
              })()}
            </tbody>
          </table>
        </div>

        {/* Table Pagination / Footer */}
        {(() => {
          const ITEMS_PER_PAGE = 5;
          const totalPages = Math.ceil(filteredRecords.length / ITEMS_PER_PAGE) || 1;
          const activePage = Math.min(currentPage, totalPages);

          return (
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
              <p className="text-xs text-slate-400 font-bold">
                Showing {Math.min(filteredRecords.length, (activePage - 1) * ITEMS_PER_PAGE + 1)} to {Math.min(filteredRecords.length, activePage * ITEMS_PER_PAGE)} of {filteredRecords.length} entries
              </p>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className={`p-1.5 rounded-lg hover:bg-slate-100 text-slate-650 border border-slate-200 transition-colors flex items-center justify-center ${activePage === 1 ? 'opacity-40 cursor-not-allowed' : ''}`}
                  disabled={activePage === 1}
                >
                  <span className="material-symbols-outlined text-sm md:text-base">chevron_left</span>
                </button>
                <div className="flex items-center gap-1.5 text-xs font-bold">
                  {Array.from({ length: totalPages }).map((_, pageIdx) => {
                    const pageNum = pageIdx + 1;
                    return (
                      <button 
                        key={pageNum}
                        onClick={() => setCurrentPage(pageNum)}
                        className={`w-8 h-8 rounded-lg transition-colors ${activePage === pageNum ? 'bg-amber-500 text-white font-extrabold' : 'hover:bg-slate-100 text-slate-600'}`}
                      >
                        {pageNum}
                      </button>
                    );
                  })}
                </div>
                <button 
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className={`p-1.5 rounded-lg hover:bg-slate-100 text-slate-650 border border-slate-200 transition-colors flex items-center justify-center ${activePage === totalPages ? 'opacity-40 cursor-not-allowed' : ''}`}
                  disabled={activePage === totalPages}
                >
                  <span className="material-symbols-outlined text-sm md:text-base">chevron_right</span>
                </button>
              </div>
            </div>
          );
        })()}
      </div>

    </main>
  );
};

export default FeedbackManager;
