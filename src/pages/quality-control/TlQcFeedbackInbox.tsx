import React, { useState } from 'react';

interface FeedbackRecord {
  id: string;
  caller: string;
  role: string;
  avatar: string;
  auditDate: string;
  score: number;
  severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  status: 'Action Pending' | 'Completed' | 'Awaiting Call' | 'Archived';
  remediation: string;
}

export const TlQcFeedbackInbox: React.FC = () => {
  // Mock data state
  const [records, setRecords] = useState<FeedbackRecord[]>([
    { id: '1', caller: 'Jonathan Doe', role: 'Lvl 2 Support', avatar: 'JD', auditDate: '2026-06-20', score: 64, severity: 'CRITICAL', status: 'Action Pending', remediation: 'Awaiting supervisor feedback' },
    { id: '2', caller: 'Sarah Waters', role: 'Lvl 1 Support', avatar: 'SW', auditDate: '2026-06-19', score: 82, severity: 'MEDIUM', status: 'Completed', remediation: 'Routine appreciation' },
    { id: '3', caller: 'Marcus King', role: 'Team Associate', avatar: 'MK', auditDate: '2026-06-18', score: 71, severity: 'HIGH', status: 'Awaiting Call', remediation: 'Script adherence training' },
    { id: '4', caller: 'Alice Low', role: 'Senior Agent', avatar: 'AL', auditDate: '2026-06-17', score: 96, severity: 'LOW', status: 'Archived', remediation: 'N/A' },
    { id: '5', caller: 'Rohan Sharma', role: 'Outbound Caller', avatar: 'RS', auditDate: '2026-06-16', score: 42, severity: 'CRITICAL', status: 'Action Pending', remediation: 'Needs escalation session' },
    { id: '6', caller: 'Sana Khan', role: 'Verification Specialist', avatar: 'SK', auditDate: '2026-06-15', score: 91, severity: 'LOW', status: 'Completed', remediation: 'N/A' },
    { id: '7', caller: 'Vikram Singh', role: 'Inbound Specialist', avatar: 'VS', auditDate: '2026-06-14', score: 74, severity: 'MEDIUM', status: 'Awaiting Call', remediation: 'Soft-skills coaching' },
    { id: '8', caller: 'Ananya Roy', role: 'Logistics Liaison', avatar: 'AR', auditDate: '2026-06-13', score: 58, severity: 'CRITICAL', status: 'Action Pending', remediation: 'Rectification program' },
    { id: '9', caller: 'Amit Patel', role: 'Vendor Auditor', avatar: 'AP', auditDate: '2026-06-12', score: 88, severity: 'LOW', status: 'Completed', remediation: 'N/A' },
    { id: '10', caller: 'Neha Gupta', role: 'Team Lead support', avatar: 'NG', auditDate: '2026-06-11', score: 85, severity: 'MEDIUM', status: 'Completed', remediation: 'Routine coaching' },
    { id: '11', caller: 'Priya Sharma', role: 'Outbound Logistics', avatar: 'PS', auditDate: '2026-06-10', score: 38, severity: 'CRITICAL', status: 'Action Pending', remediation: 'Warning letter sent' },
    { id: '12', caller: 'Rajesh Kumar', role: 'Inbound Dispatcher', avatar: 'RK', auditDate: '2026-06-09', score: 68, severity: 'HIGH', status: 'Awaiting Call', remediation: 'Adherence monitoring' }
  ]);

  // UI Interactive States
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [severityFilter, setSeverityFilter] = useState<string>('All');
  const [sortField, setSortField] = useState<'score' | 'auditDate'>('auditDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Filter & Sort Dropdown toggles
  const [showFilterPop, setShowFilterPop] = useState(false);
  const [showSortPop, setShowSortPop] = useState(false);

  // Modals States
  const [showSessionModal, setShowSessionModal] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [remediationRecord, setRemediationRecord] = useState<FeedbackRecord | null>(null);
  const [viewingRecord, setViewingRecord] = useState<FeedbackRecord | null>(null);

  // Modal Form Inputs
  const [sessionTopic, setSessionTopic] = useState('Calibration Checkpoint');
  const [sessionDate, setSessionDate] = useState('');
  const [sessionTime, setSessionTime] = useState('15:00');
  
  const [newAgentName, setNewAgentName] = useState('');
  const [newAgentRole, setNewAgentRole] = useState('Lvl 1 Support');
  const [newScore, setNewScore] = useState(80);
  const [newSeverity, setNewSeverity] = useState<'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'>('LOW');

  const [remediationPathway, setRemediationPathway] = useState('Script compliance re-training');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Dynamic KPI Calculations based on ALL records
  const avgTeamScore = records.length > 0 ? Math.round(records.reduce((acc, r) => acc + r.score, 0) / records.length * 10) / 10 : 0;
  const pendingActionsCount = records.filter(r => r.status === 'Action Pending' || r.status === 'Awaiting Call').length;
  const criticalCount = records.filter(r => r.severity === 'CRITICAL').length;

  // Filtered & Sorted Records
  const processedRecords = records
    .filter(rec => {
      const matchesSearch = rec.caller.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            rec.role.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'All' || rec.status === statusFilter;
      const matchesSeverity = severityFilter === 'All' || rec.severity === severityFilter;
      return matchesSearch && matchesStatus && matchesSeverity;
    })
    .sort((a, b) => {
      if (sortField === 'score') {
        return sortOrder === 'asc' ? a.score - b.score : b.score - a.score;
      } else {
        const dateA = new Date(a.auditDate).getTime();
        const dateB = new Date(b.auditDate).getTime();
        return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
      }
    });

  // Pagination
  const ITEMS_PER_PAGE = 4;
  const totalPages = Math.ceil(processedRecords.length / ITEMS_PER_PAGE) || 1;
  const activePage = Math.min(currentPage, totalPages);
  const paginatedRecords = processedRecords.slice(
    (activePage - 1) * ITEMS_PER_PAGE,
    activePage * ITEMS_PER_PAGE
  );

  // Handlers
  const handleScheduleSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (!sessionDate) {
      triggerToast('Please select a valid date');
      return;
    }
    triggerToast(`Calibration session scheduled for ${sessionDate} at ${sessionTime} ✓`);
    setShowSessionModal(false);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAgentName) {
      triggerToast('Agent Name is required');
      return;
    }
    const newRec: FeedbackRecord = {
      id: String(Date.now()),
      caller: newAgentName,
      role: newAgentRole,
      avatar: newAgentName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
      auditDate: new Date().toISOString().split('T')[0],
      score: newScore,
      severity: newSeverity,
      status: 'Action Pending',
      remediation: 'Pending QA evaluation'
    };
    setRecords(prev => [newRec, ...prev]);
    setShowTicketModal(false);
    setNewAgentName('');
    triggerToast(`Created new audit ticket for ${newAgentName} ✓`);
  };

  const handleSaveRemediation = (e: React.FormEvent) => {
    e.preventDefault();
    if (!remediationRecord) return;
    setRecords(prev => prev.map(rec => {
      if (rec.id === remediationRecord.id) {
        return {
          ...rec,
          status: 'Completed',
          remediation: remediationPathway
        };
      }
      return rec;
    }));
    triggerToast(`Assigned remediation to ${remediationRecord.caller} ✓`);
    setRemediationRecord(null);
  };

  const handleExport = () => {
    triggerToast('Exported audit data to CSV ✓');
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

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        
        {/* Main description card */}
        <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-xl border border-slate-200 flex flex-col justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight mb-1">QC Feedback Inbox</h2>
            <p className="text-xs md:text-sm text-slate-400">Audit oversight for Team Alpha. Identify patterns and schedule calibrations.</p>
          </div>
          <div className="flex flex-wrap gap-3 mt-6">
            <button 
              onClick={() => setShowSessionModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-sm md:text-base">calendar_month</span>
              Calibration Session
            </button>
            <button 
              onClick={handleExport}
              className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all"
            >
              <span className="material-symbols-outlined text-sm md:text-base">download</span>
              Export Data
            </button>
          </div>
        </div>

        {/* Avg Team Score card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Avg Team Score</p>
          <p className="text-3xl font-black text-slate-800 mt-2">{avgTeamScore}%</p>
          <div className="flex items-center gap-1 text-red-600 text-xs mt-2 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
            <span className="material-symbols-outlined text-xs">arrow_downward</span>
            1.4% vs LY
          </div>
        </div>

        {/* Pending Actions card */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 flex flex-col items-center justify-center text-center">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Pending Actions</p>
          <p className="text-3xl font-black text-slate-800 mt-2">{pendingActionsCount}</p>
          <p className="text-xs text-red-600 mt-2 font-bold bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">{criticalCount} Critical Issues</p>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
        
        {/* Table Filter/Search Header */}
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50">
          <div className="flex flex-wrap items-center gap-4">
            
            {/* Search Input */}
            <div className="relative">
              <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm md:text-base">search</span>
              <input 
                className="pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-xs md:text-sm focus:outline-none w-64 transition-all text-slate-700 font-semibold" 
                placeholder="Search callers or feedback..." 
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              />
            </div>
            
            {/* Filter Toggle & Popover */}
            <div className="relative">
              <button 
                onClick={() => { setShowFilterPop(!showFilterPop); setShowSortPop(false); }}
                className={`px-3 py-2 border rounded-lg text-xs md:text-sm font-bold flex items-center gap-1 transition-all ${
                  statusFilter !== 'All' || severityFilter !== 'All' 
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
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Status</label>
                    <select 
                      value={statusFilter} 
                      onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full border border-slate-200 rounded-lg p-1.5 outline-none font-bold text-slate-700 bg-slate-50"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Action Pending">Action Pending</option>
                      <option value="Awaiting Call">Awaiting Call</option>
                      <option value="Completed">Completed</option>
                      <option value="Archived">Archived</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Severity</label>
                    <select 
                      value={severityFilter} 
                      onChange={(e) => { setSeverityFilter(e.target.value); setCurrentPage(1); }}
                      className="w-full border border-slate-200 rounded-lg p-1.5 outline-none font-bold text-slate-700 bg-slate-50"
                    >
                      <option value="All">All Severities</option>
                      <option value="CRITICAL">Critical</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>

                  <div className="flex justify-end pt-1">
                    <button 
                      onClick={() => { setStatusFilter('All'); setSeverityFilter('All'); setShowFilterPop(false); }}
                      className="text-[10px] font-extrabold text-amber-500 hover:text-amber-600 underline"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Sort Toggle & Popover */}
            <div className="relative">
              <button 
                onClick={() => { setShowSortPop(!showSortPop); setShowFilterPop(false); }}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-xs md:text-sm font-bold flex items-center gap-1 hover:bg-slate-50 transition-colors text-slate-650"
              >
                <span className="material-symbols-outlined text-xs md:text-base">sort</span>
                Sort
              </button>

              {showSortPop && (
                <div className="absolute left-0 mt-2 w-48 bg-white border border-slate-200 rounded-xl p-3 z-30 space-y-2">
                  <button 
                    onClick={() => { setSortField('score'); setSortOrder('desc'); setShowSortPop(false); }}
                    className="w-full text-left px-2 py-1.5 hover:bg-slate-50 rounded text-xs font-bold text-slate-700 flex items-center justify-between"
                  >
                    <span>Score: High to Low</span>
                    {sortField === 'score' && sortOrder === 'desc' && <span className="material-symbols-outlined text-xs text-amber-500">check</span>}
                  </button>
                  <button 
                    onClick={() => { setSortField('score'); setSortOrder('asc'); setShowSortPop(false); }}
                    className="w-full text-left px-2 py-1.5 hover:bg-slate-50 rounded text-xs font-bold text-slate-700 flex items-center justify-between"
                  >
                    <span>Score: Low to High</span>
                    {sortField === 'score' && sortOrder === 'asc' && <span className="material-symbols-outlined text-xs text-amber-500">check</span>}
                  </button>
                  <button 
                    onClick={() => { setSortField('auditDate'); setSortOrder('desc'); setShowSortPop(false); }}
                    className="w-full text-left px-2 py-1.5 hover:bg-slate-50 rounded text-xs font-bold text-slate-700 flex items-center justify-between"
                  >
                    <span>Date: Newest First</span>
                    {sortField === 'auditDate' && sortOrder === 'desc' && <span className="material-symbols-outlined text-xs text-amber-500">check</span>}
                  </button>
                  <button 
                    onClick={() => { setSortField('auditDate'); setSortOrder('asc'); setShowSortPop(false); }}
                    className="w-full text-left px-2 py-1.5 hover:bg-slate-50 rounded text-xs font-bold text-slate-700 flex items-center justify-between"
                  >
                    <span>Date: Oldest First</span>
                    {sortField === 'auditDate' && sortOrder === 'asc' && <span className="material-symbols-outlined text-xs text-amber-500">check</span>}
                  </button>
                </div>
              )}
            </div>

          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs md:text-sm text-slate-400 font-bold">Showing {processedRecords.length} of {records.length} audits</span>
          </div>
        </div>

        {/* Table container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse min-w-[800px]">
            <thead className="bg-slate-50 border-b border-slate-200 sticky top-0 z-10">
              <tr className="text-slate-400 font-bold uppercase text-xs">
                <th className="px-6 py-4">Caller</th>
                <th className="px-6 py-4">Audit Date</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Severity</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right pr-6">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
              {paginatedRecords.map((rec) => (
                <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-200">{rec.avatar}</div>
                      <div>
                        <p className="font-extrabold text-slate-800">{rec.caller}</p>
                        <p className="text-xs text-slate-400">{rec.role}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-slate-400">{rec.auditDate}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1 w-24">
                      <div className="flex justify-between text-xs font-black">
                        <span className={
                          rec.severity === 'CRITICAL' ? 'text-red-600' :
                          rec.severity === 'HIGH' ? 'text-amber-600' : 'text-green-600'
                        }>{rec.score}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden border border-slate-200/30">
                        <div 
                          className={`h-full rounded-full ${
                            rec.severity === 'CRITICAL' ? 'bg-red-500' :
                            rec.severity === 'HIGH' ? 'bg-amber-500' : 'bg-green-500'
                          }`} 
                          style={{ width: `${rec.score}%` }}
                        ></div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-0.5 rounded-full border text-[10px] md:text-xs font-black uppercase tracking-tight ${
                      rec.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' :
                      rec.severity === 'HIGH' ? 'bg-yellow-50 text-yellow-700 border-yellow-250' :
                      rec.severity === 'MEDIUM' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                      'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {rec.severity}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${
                        rec.status === 'Completed' ? 'bg-green-500' :
                        rec.status === 'Archived' ? 'bg-slate-400' :
                        rec.status === 'Awaiting Call' ? 'bg-amber-500' : 'bg-red-500'
                      }`}></div>
                      <span className="text-xs md:text-sm font-bold text-slate-700">{rec.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right pr-6">
                    {rec.status === 'Completed' || rec.status === 'Archived' ? (
                      <button 
                        onClick={() => setViewingRecord(rec)}
                        className="text-slate-550 hover:text-amber-500 p-2 rounded-full transition-colors inline-flex items-center justify-center"
                      >
                        <span className="material-symbols-outlined text-sm md:text-base">visibility</span>
                      </button>
                    ) : (
                      <button 
                        onClick={() => { setRemediationRecord(rec); setRemediationPathway('Script compliance re-training'); }}
                        className="bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-500 hover:text-white text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-[0.98] ml-auto"
                      >
                        Assign Remediation
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {processedRecords.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400 italic">No audits found matching your query.</td>
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

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowTicketModal(true)}
        className="fixed bottom-8 right-8 w-14 h-14 bg-amber-500 hover:bg-amber-600 text-white rounded-full flex items-center justify-center active:scale-95 transition-all z-40 group"
      >
        <span className="material-symbols-outlined text-xl md:text-2xl">add_task</span>
        <span className="absolute right-16 bg-slate-900 text-white px-3 py-1.5 rounded-lg text-xs font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-slate-800">New Audit Ticket</span>
      </button>

      {/* CALIBRATION SESSION MODAL */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-slate-200">
            <h3 className="text-sm md:text-base font-bold uppercase mb-4 text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <span className="material-symbols-outlined text-amber-500">calendar_today</span>
              Schedule Calibration Session
            </h3>
            <form onSubmit={handleScheduleSession} className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Session Topic</label>
                <input 
                  type="text" 
                  value={sessionTopic}
                  onChange={(e) => setSessionTopic(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-amber-500 text-xs md:text-sm"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Date</label>
                  <input 
                    type="date" 
                    value={sessionDate}
                    onChange={(e) => setSessionDate(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white text-xs md:text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Time</label>
                  <input 
                    type="time" 
                    value={sessionTime}
                    onChange={(e) => setSessionTime(e.target.value)}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white text-xs md:text-sm"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowSessionModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* NEW AUDIT TICKET MODAL */}
      {showTicketModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-slate-200">
            <h3 className="text-sm md:text-base font-bold uppercase mb-4 text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <span className="material-symbols-outlined text-amber-500">add_task</span>
              New Audit Ticket
            </h3>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Agent Caller Name</label>
                <input 
                  type="text" 
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  required
                  placeholder="e.g. Liam N."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white focus:border-amber-500 text-xs md:text-sm"
                />
              </div>
              <div>
                <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Agent Role</label>
                <select 
                  value={newAgentRole}
                  onChange={(e) => setNewAgentRole(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white text-xs md:text-sm"
                >
                  <option>Lvl 1 Support</option>
                  <option>Lvl 2 Support</option>
                  <option>Team Associate</option>
                  <option>Senior Agent</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Score (0-100)</label>
                  <input 
                    type="number" 
                    min="0"
                    max="100"
                    value={newScore}
                    onChange={(e) => {
                      setNewScore(Number(e.target.value));
                      const sc = Number(e.target.value);
                      if (sc < 60) setNewSeverity('CRITICAL');
                      else if (sc < 75) setNewSeverity('HIGH');
                      else if (sc < 85) setNewSeverity('MEDIUM');
                      else setNewSeverity('LOW');
                    }}
                    required
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white text-xs md:text-sm"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Severity</label>
                  <select 
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white text-xs md:text-sm"
                  >
                    <option value="CRITICAL">Critical</option>
                    <option value="HIGH">High</option>
                    <option value="MEDIUM">Medium</option>
                    <option value="LOW">Low</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setShowTicketModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ASSIGN REMEDIATION MODAL */}
      {remediationRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-slate-200">
            <h3 className="text-sm md:text-base font-bold uppercase mb-4 text-slate-800 flex items-center gap-1.5 border-b border-slate-100 pb-2">
              <span className="material-symbols-outlined text-amber-500">assignment</span>
              Assign Remediation
            </h3>
            <form onSubmit={handleSaveRemediation} className="space-y-4">
              <div>
                <p className="text-xs text-slate-500 font-bold mb-2">Assigning remediation pathway for <span className="text-slate-800 font-black">{remediationRecord.caller}</span> (Score: {remediationRecord.score}%):</p>
                <label className="text-slate-400 block mb-1 font-bold uppercase tracking-wider text-[10px]">Pathway</label>
                <select 
                  value={remediationPathway}
                  onChange={(e) => setRemediationPathway(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-slate-50 focus:bg-white text-xs md:text-sm"
                >
                  <option>Script compliance re-training</option>
                  <option>Soft-skills training workshop</option>
                  <option>Supervisor active coaching</option>
                  <option>Formal warning & reassessment</option>
                  <option>N/A (Appreciation Logged)</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-3 border-t border-slate-100">
                <button 
                  type="button" 
                  onClick={() => setRemediationRecord(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Assign
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* AUDIT DETAILS VIEW MODAL */}
      {viewingRecord && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <h3 className="text-sm md:text-base font-bold uppercase pb-2 border-b border-slate-100 text-slate-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-500">feed</span>
              Audit Feedback Details
            </h3>
            
            <div className="space-y-3">
              <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="w-10 h-10 rounded-full bg-slate-100 border border-slate-200 text-slate-700 flex items-center justify-center font-black text-sm">{viewingRecord.avatar}</div>
                <div>
                  <h4 className="font-extrabold text-slate-800 text-sm md:text-base">{viewingRecord.caller}</h4>
                  <p className="text-xs text-slate-400 font-semibold">{viewingRecord.role}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs md:text-sm">
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                  <p className="text-slate-400 font-bold uppercase text-[9px]">Audit Date</p>
                  <p className="font-bold text-slate-750 mt-0.5">{viewingRecord.auditDate}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                  <p className="text-slate-400 font-bold uppercase text-[9px]">Score</p>
                  <p className="font-extrabold text-slate-800 mt-0.5 text-sm">{viewingRecord.score}%</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                  <p className="text-slate-400 font-bold uppercase text-[9px]">Severity</p>
                  <p className="font-bold text-slate-750 mt-0.5">{viewingRecord.severity}</p>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/60">
                  <p className="text-slate-400 font-bold uppercase text-[9px]">Status</p>
                  <p className="font-bold text-slate-750 mt-0.5">{viewingRecord.status}</p>
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[9px]">Remediation Action Pathway</label>
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs md:text-sm font-semibold text-slate-700 italic">
                  {viewingRecord.remediation || 'N/A'}
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-slate-400 font-bold uppercase text-[9px]">QA Notes & Comments</label>
                <p className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-650 leading-relaxed font-semibold">
                  Agent displayed a professional tone during call verification. All major regulatory checklist points were successfully checked. Suggested focus area is increasing customer engagement during wrap-up.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100">
              <button 
                onClick={() => setViewingRecord(null)}
                className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-colors"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default TlQcFeedbackInbox;
