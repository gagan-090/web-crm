import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface AuditRecord {
  id: string;
  caller: string;
  process: string;
  leadTmid: string;
  callDate: string;
  duration: string;
  status: 'Pending' | 'In Progress' | 'Completed';
}

export const AuditQueue: React.FC = () => {
  const navigate = useNavigate();

  // Filter States
  const [selectedProcess, setSelectedProcess] = useState('All Processes');
  const [selectedCaller, setSelectedCaller] = useState('All Analysts');
  const [dateFilter, setDateFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'IN PROGRESS' | 'COMPLETED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);

  // Add Call Modal state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCaller, setNewCaller] = useState('');
  const [newProcess, setNewProcess] = useState('DW (Domestic West)');
  const [newLeadTmid, setNewLeadTmid] = useState('');
  const [newDuration, setNewDuration] = useState('03:00');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock data state
  const [records, setRecords] = useState<AuditRecord[]>([
    { id: '1', caller: 'Ankit Sharma', process: 'DW (Domestic West)', leadTmid: 'TM_88291', callDate: '2026-06-20', duration: '04:12', status: 'Pending' },
    { id: '2', caller: 'Rohan Mehra', process: 'DW (Domestic West)', leadTmid: 'DR-48293', callDate: '2026-06-20', duration: '03:45', status: 'In Progress' },
    { id: '3', caller: 'Sneha Kapur', process: 'TR (Transport)', leadTmid: 'TR-12094', callDate: '2026-06-19', duration: '05:20', status: 'Completed' },
    { id: '4', caller: 'Sarah C.', process: 'TR (Transport)', leadTmid: 'TR-12095', callDate: '2026-06-19', duration: '02:15', status: 'Pending' },
    { id: '5', caller: 'Ravi Kumar', process: 'MM (Mid Market)', leadTmid: 'JD-12034', callDate: '2026-06-18', duration: '06:10', status: 'Completed' },
    { id: '6', caller: 'Aman K.', process: 'SC (Supply Chain)', leadTmid: 'DR-88220', callDate: '2026-06-18', duration: '04:30', status: 'Pending' },
    { id: '7', caller: 'Sneha Kapur', process: 'DW (Domestic West)', leadTmid: 'DR-48293', callDate: '2026-06-17', duration: '03:15', status: 'Completed' }
  ]);

  // Filtering
  const filteredRecords = records.filter(rec => {
    const matchesProcess = selectedProcess === 'All Processes' || rec.process === selectedProcess;
    const matchesCaller = selectedCaller === 'All Analysts' || rec.caller === selectedCaller;
    const matchesStatus = statusFilter === 'ALL' || rec.status.toUpperCase() === statusFilter;
    const matchesDate = !dateFilter || rec.callDate === dateFilter;
    const matchesSearch = rec.caller.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rec.leadTmid.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesProcess && matchesCaller && matchesStatus && matchesDate && matchesSearch;
  });

  const handleAddCallSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCaller || !newLeadTmid) {
      triggerToast('Caller and Lead TMID are required');
      return;
    }

    const newRec: AuditRecord = {
      id: String(Date.now()),
      caller: newCaller,
      process: newProcess,
      leadTmid: newLeadTmid,
      callDate: new Date().toISOString().split('T')[0],
      duration: newDuration,
      status: 'Pending'
    };

    setRecords(prev => [newRec, ...prev]);
    setShowAddModal(false);
    setNewCaller('');
    setNewLeadTmid('');
    triggerToast(`Added call for ${newCaller} to the audit queue ✓`);
  };

  const handleAuditAction = (rec: AuditRecord) => {
    triggerToast(`Starting audit for ${rec.leadTmid} (${rec.caller})`);
    navigate('/qc/qc-overview');
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
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Audit Queue</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">Manage and perform quality audits for this week's call recordings.</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2.5 rounded-xl text-xs md:text-sm font-bold flex items-center gap-2 transition-all active:scale-95"
        >
          <span className="material-symbols-outlined text-sm md:text-base">add</span>
          <span>Add Call Manually</span>
        </button>
      </div>

      {/* Filter strip */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 flex flex-wrap gap-4 items-center">
        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">PROCESS</label>
          <select
            value={selectedProcess}
            onChange={(e) => { setSelectedProcess(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs md:text-sm font-bold text-slate-700 outline-none w-full"
          >
            <option>All Processes</option>
            <option>DW (Domestic West)</option>
            <option>TR (Transport)</option>
            <option>MM (Mid Market)</option>
            <option>SC (Supply Chain)</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">CALLER</label>
          <select
            value={selectedCaller}
            onChange={(e) => { setSelectedCaller(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs md:text-sm font-bold text-slate-700 outline-none w-full"
          >
            <option>All Analysts</option>
            <option>Ankit Sharma</option>
            <option>Rohan Mehra</option>
            <option>Sneha Kapur</option>
            <option>Ravi Kumar</option>
            <option>Aman K.</option>
            <option>Sarah C.</option>
          </select>
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">DATE RANGE</label>
          <input
            type="date"
            value={dateFilter}
            onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
            className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs md:text-sm font-bold text-slate-700 outline-none w-full"
          />
        </div>

        <div className="flex flex-col gap-1 min-w-[150px]">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">SEARCH</label>
          <div className="relative">
            <input
              type="text"
              placeholder="Search TMID/Caller..."
              value={searchQuery}
              onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
              className="pl-8 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs md:text-sm w-full font-semibold focus:outline-none text-slate-700"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs md:text-sm">search</span>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">STATUS</label>
          <div className="flex gap-1.5 p-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold">
            {(['ALL', 'PENDING', 'IN PROGRESS', 'COMPLETED'] as const).map(status => (
              <button
                key={status}
                onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-xl transition-all ${statusFilter === status ? 'bg-amber-500 text-white font-extrabold' : 'text-slate-500 hover:text-slate-800'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="ml-auto flex items-center gap-2 self-end">
          <button
            onClick={() => { setSelectedProcess('All Processes'); setSelectedCaller('All Analysts'); setDateFilter(''); setStatusFilter('ALL'); setSearchQuery(''); }}
            className="p-2 border border-slate-200 hover:border-amber-500 rounded-lg text-slate-500 hover:text-amber-500 hover:bg-amber-50/10 transition-all flex items-center justify-center"
            title="Reset Filters"
          >
            <span className="material-symbols-outlined text-sm md:text-base">refresh</span>
          </button>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs md:text-sm border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr className="text-slate-400 font-bold uppercase text-xs">
                <th className="p-4 pl-5 w-12">#</th>
                <th className="p-4">Caller</th>
                <th className="p-4">Process</th>
                <th className="p-4">Lead TMID</th>
                <th className="p-4">Call Date</th>
                <th className="p-4">Duration</th>
                <th className="p-4 text-center">Rec</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right pr-5">Action</th>
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
                    {paginated.map((rec, i) => (
                      <tr key={rec.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="p-4 pl-5 text-slate-450 font-mono">{(activePage - 1) * ITEMS_PER_PAGE + i + 1}</td>
                        <td className="p-4 font-extrabold text-slate-800">{rec.caller}</td>
                        <td className="p-4 text-slate-550">{rec.process}</td>
                        <td className="p-4 font-mono font-bold text-amber-500">{rec.leadTmid}</td>
                        <td className="p-4 text-slate-400">{rec.callDate}</td>
                        <td className="p-4 font-mono text-xs">{rec.duration}</td>
                        <td className="p-4 text-center">
                          <button
                            onClick={() => triggerToast(`Streaming audio for ${rec.leadTmid}...`)}
                            className="text-slate-450 hover:text-amber-500 flex items-center justify-center mx-auto transition-colors"
                          >
                            <span className="material-symbols-outlined text-sm md:text-base">volume_up</span>
                          </button>
                        </td>
                        <td className="p-4">
                          <span className={`text-[10px] md:text-xs font-black px-2.5 py-0.5 rounded-full border uppercase ${rec.status === 'Completed' ? 'bg-green-50 text-green-700 border-green-200' :
                              rec.status === 'In Progress' ? 'bg-yellow-50 text-yellow-700 border-yellow-250' :
                                'bg-slate-100 text-slate-600 border-slate-200'
                            }`}>
                            {rec.status}
                          </span>
                        </td>
                        <td className="p-4 text-right pr-5">
                          <button
                            onClick={() => handleAuditAction(rec)}
                            className="bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-500 hover:text-white text-slate-700 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95"
                          >
                            {rec.status === 'Completed' ? 'Re-audit' : 'Audit Call'}
                          </button>
                        </td>
                      </tr>
                    ))}
                    {filteredRecords.length === 0 && (
                      <tr>
                        <td colSpan={9} className="p-8 text-center text-slate-400 italic">No recordings found matching your filters.</td>
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
              <p className="text-xs text-slate-400 font-bold">Showing {Math.min(filteredRecords.length, activePage * ITEMS_PER_PAGE)} of {filteredRecords.length} recordings</p>
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

      {/* Analytics stats strip */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">pending_actions</span>
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">TOTAL PENDING</p>
            <p className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">48</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">sync</span>
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">IN PROGRESS</p>
            <p className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">12</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-green-500/10 text-green-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">task_alt</span>
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">COMPLETED TODAY</p>
            <p className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">26</p>
          </div>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-600 flex items-center justify-center">
            <span className="material-symbols-outlined text-2xl">warning</span>
          </div>
          <div>
            <p className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-wider">MISSING RECS</p>
            <p className="text-xl md:text-2xl font-black text-slate-800 mt-0.5">04</p>
          </div>
        </div>
      </div>

      {/* ADD CALL MANUALLY MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-6 border border-slate-200 text-xs md:text-sm">
            <h3 className="text-sm md:text-base font-bold uppercase mb-4 text-slate-800 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-500">add_box</span>
              Add Call Manually to Queue
            </h3>

            <form onSubmit={handleAddCallSubmit} className="space-y-4">
              <div>
                <label className="text-slate-450 block mb-1.5 font-bold uppercase">Caller Agent Name</label>
                <input
                  type="text"
                  value={newCaller}
                  onChange={(e) => setNewCaller(e.target.value)}
                  required
                  placeholder="e.g. Rahul S."
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800"
                />
              </div>

              <div>
                <label className="text-slate-450 block mb-1.5 font-bold uppercase">Process / Stream</label>
                <select
                  value={newProcess}
                  onChange={(e) => setNewProcess(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 bg-white outline-none font-bold text-slate-800"
                >
                  <option>DW (Domestic West)</option>
                  <option>TR (Transport)</option>
                  <option>MM (Mid Market)</option>
                  <option>SC (Supply Chain)</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-450 block mb-1.5 font-bold uppercase">Lead TMID</label>
                  <input
                    type="text"
                    value={newLeadTmid}
                    onChange={(e) => setNewLeadTmid(e.target.value)}
                    required
                    placeholder="e.g. TM_88301"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800"
                  />
                </div>
                <div>
                  <label className="text-slate-450 block mb-1.5 font-bold uppercase">Duration</label>
                  <input
                    type="text"
                    value={newDuration}
                    onChange={(e) => setNewDuration(e.target.value)}
                    required
                    placeholder="e.g. 03:30"
                    className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold"
                >
                  Add Call
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};

export default AuditQueue;
