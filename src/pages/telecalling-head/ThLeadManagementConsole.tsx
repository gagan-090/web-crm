import React, { useState, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────
type LeadStatus = 'HOT' | 'WARM' | 'COLD';
type LeadType = 'FM' | 'DR' | 'TR' | 'EC';
type Process =
  | 'Vendor Onboarding'
  | 'KYC Verification'
  | 'RTO Check'
  | 'Direct Load Booking'
  | 'Account Setup'
  | 'Driver Registration'
  | 'Transporter Onboarding';

interface Lead {
  id: string;
  name: string;
  mobile: string;
  type: LeadType;
  status: LeadStatus;
  assignedCaller: string;
  process: Process;
  regDate: string;
  lastCalled: string;
  notes?: string[];
}


interface ColdLead {
  id: string;
  name: string;
  tmId: string;
  type: LeadType;
  lastCalledDays: number;
  selected: boolean;
}

// ── Seed data ───────────────────────────────────────────────────────────────
const ALL_LEADS: Lead[] = [
  { id: 'TM-78291', name: 'Rajesh Logistics Pvt Ltd', mobile: '+91 98765-43210', type: 'FM', status: 'HOT', assignedCaller: 'Animesh Roy', process: 'Vendor Onboarding', regDate: '12 Oct, 2023', lastCalled: '2h ago' },
  { id: 'TM-78292', name: 'Gagan Deep Transport', mobile: '+91 88221-11002', type: 'DR', status: 'WARM', assignedCaller: 'Sunita Sharma', process: 'KYC Verification', regDate: '12 Oct, 2023', lastCalled: 'Yesterday' },
  { id: 'TM-78293', name: 'Pacific Express', mobile: '+91 77665-54433', type: 'TR', status: 'COLD', assignedCaller: 'Unassigned', process: 'RTO Check', regDate: '11 Oct, 2023', lastCalled: '5 days ago' },
  { id: 'TM-78294', name: 'Vikas Transporter Hub', mobile: '+91 99887-76655', type: 'FM', status: 'HOT', assignedCaller: 'Animesh Roy', process: 'Direct Load Booking', regDate: '10 Oct, 2023', lastCalled: '10m ago' },
  { id: 'TM-78295', name: 'Swift Cargo Movers', mobile: '+91 91234-56789', type: 'EC', status: 'WARM', assignedCaller: 'Preeti Jain', process: 'Account Setup', regDate: '09 Oct, 2023', lastCalled: '4h ago' },
  { id: 'TM-78296', name: 'Bharat Road Carriers', mobile: '+91 90001-22334', type: 'DR', status: 'HOT', assignedCaller: 'Animesh Roy', process: 'Driver Registration', regDate: '09 Oct, 2023', lastCalled: '1h ago' },
  { id: 'TM-78297', name: 'Northern Freight Co.', mobile: '+91 98765-00111', type: 'TR', status: 'WARM', assignedCaller: 'Sunita Sharma', process: 'Transporter Onboarding', regDate: '08 Oct, 2023', lastCalled: '3h ago' },
  { id: 'TM-78298', name: 'Sunrise Logistics', mobile: '+91 77654-99101', type: 'FM', status: 'COLD', assignedCaller: 'Unassigned', process: 'KYC Verification', regDate: '07 Oct, 2023', lastCalled: '8 days ago' },
  { id: 'TM-78299', name: 'Apex Fleet Solutions', mobile: '+91 88009-54321', type: 'EC', status: 'HOT', assignedCaller: 'Preeti Jain', process: 'Vendor Onboarding', regDate: '06 Oct, 2023', lastCalled: '30m ago' },
  { id: 'TM-78300', name: 'Himalayan Cargo Express', mobile: '+91 91122-33445', type: 'DR', status: 'WARM', assignedCaller: 'Animesh Roy', process: 'Driver Registration', regDate: '05 Oct, 2023', lastCalled: '6h ago' },
];

const COLD_LEADS_SEED: ColdLead[] = [
  { id: 'CL-1', name: 'Karan Sharma', tmId: 'TM-11029', type: 'TR', lastCalledDays: 24, selected: false },
  { id: 'CL-2', name: 'Meena Kumari Logistics', tmId: 'TM-11204', type: 'FM', lastCalledDays: 41, selected: false },
  { id: 'CL-3', name: 'Anand Heavy Haul', tmId: 'TM-10992', type: 'EC', lastCalledDays: 18, selected: false },
  { id: 'CL-4', name: 'Blue Dart Vendor 4', tmId: 'TM-11005', type: 'TR', lastCalledDays: 30, selected: false },
  { id: 'CL-5', name: 'Eastern Star Transport', tmId: 'TM-11340', type: 'DR', lastCalledDays: 52, selected: false },
  { id: 'CL-6', name: 'Metro Fleet Pvt Ltd', tmId: 'TM-11567', type: 'FM', lastCalledDays: 35, selected: false },
  // -- hidden until "Load more" --
  { id: 'CL-7', name: 'Pioneer Cargo Services', tmId: 'TM-11621', type: 'TR', lastCalledDays: 28, selected: false },
  { id: 'CL-8', name: 'Vijay Road Lines', tmId: 'TM-11734', type: 'DR', lastCalledDays: 60, selected: false },
  { id: 'CL-9', name: 'Shree Ram Transport Co.', tmId: 'TM-11812', type: 'FM', lastCalledDays: 45, selected: false },
  { id: 'CL-10', name: 'Deccan Freight Express', tmId: 'TM-11899', type: 'EC', lastCalledDays: 33, selected: false },
  { id: 'CL-11', name: 'National Carriers Ltd', tmId: 'TM-11950', type: 'TR', lastCalledDays: 22, selected: false },
  { id: 'CL-12', name: 'Green Valley Logistics', tmId: 'TM-12001', type: 'DR', lastCalledDays: 57, selected: false },
];

const STATUS_FILTERS = ['All', 'HOT', 'WARM', 'COLD'] as const;
const DATE_FILTERS = ['Last 7 Days', 'Last 14 Days', 'Last 30 Days', 'All Time'] as const;
const CALLERS = ['All Callers', 'Animesh Roy', 'Sunita Sharma', 'Preeti Jain', 'Unassigned'];
const ROWS_OPTIONS = [5, 10, 25, 50] as const;

type StatusFilter = typeof STATUS_FILTERS[number];
type DateFilter = typeof DATE_FILTERS[number];

// ── Component ───────────────────────────────────────────────────────────────
export const ThLeadManagementConsole: React.FC = () => {
  // Filters
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [dateFilter, setDateFilter] = useState<DateFilter>('Last 7 Days');
  const [callerFilter, setCallerFilter] = useState('All Callers');
  const [searchQuery, setSearchQuery] = useState('');

  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  // Pagination
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);

  // Cold-lead drawer
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [coldLeads, setColdLeads] = useState<ColdLead[]>(COLD_LEADS_SEED);
  const [visibleColdCount, setVisibleColdCount] = useState(6);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Create-lead modal
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newMobile, setNewMobile] = useState('');
  const [newType, setNewType] = useState<LeadType>('DR');
  const [newCaller, setNewCaller] = useState('Animesh Roy');
  const [newProcess, setNewProcess] = useState<Process>('Driver Registration');

  // Leads list
  const [leads, setLeads] = useState<Lead[]>(() =>
    ALL_LEADS.map(l => ({ ...l, notes: [] as string[] }))
  );

  // Reassign Modal State
  const [reassignModalOpen, setReassignModalOpen] = useState(false);
  const [reassignTargetIds, setReassignTargetIds] = useState<string[]>([]);
  const [reassignTargetCaller, setReassignTargetCaller] = useState('Animesh Roy');

  // Lead Details Modal State
  const [selectedLeadForView, setSelectedLeadForView] = useState<Lead | null>(null);
  const [newNote, setNewNote] = useState('');

  // ── Derived data ─────────────────────────────────────────────────────────
  const filteredLeads = useMemo(() =>
    leads.filter(l => {
      if (statusFilter !== 'All' && l.status !== statusFilter) return false;
      if (callerFilter !== 'All Callers' && l.assignedCaller !== callerFilter) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return l.name.toLowerCase().includes(q) || l.id.toLowerCase().includes(q) || l.mobile.includes(q);
      }
      return true;
    }),
    [leads, statusFilter, callerFilter, searchQuery]
  );

  const totalLeads = filteredLeads.length;
  const totalPages = Math.ceil(totalLeads / rowsPerPage);
  const pagedLeads = filteredLeads.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

  // ── Selection helpers ────────────────────────────────────────────────────
  const allPageSelected = pagedLeads.length > 0 && pagedLeads.every(l => selectedIds.has(l.id));
  const someSelected = selectedIds.size > 0;

  const toggleAll = () => {
    const next = new Set(selectedIds);
    if (allPageSelected) pagedLeads.forEach(l => next.delete(l.id));
    else pagedLeads.forEach(l => next.add(l.id));
    setSelectedIds(next);
  };

  const toggleOne = (id: string) => {
    const next = new Set(selectedIds);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelectedIds(next);
  };

  // ── Bulk actions ─────────────────────────────────────────────────────────
  const handleMarkCold = () => {
    setLeads(prev => prev.map(l => selectedIds.has(l.id) ? { ...l, status: 'COLD' as LeadStatus } : l));
    setSelectedIds(new Set());
  };

  const openReassignModal = (ids: string[]) => {
    setReassignTargetIds(ids);
    setReassignTargetCaller(CALLERS.filter(c => c !== 'All Callers' && c !== 'Unassigned')[0] || 'Animesh Roy');
    setReassignModalOpen(true);
  };

  const handleConfirmReassign = () => {
    setLeads(prev => prev.map(l => reassignTargetIds.includes(l.id) ? { ...l, assignedCaller: reassignTargetCaller } : l));
    if (selectedLeadForView && reassignTargetIds.includes(selectedLeadForView.id)) {
      setSelectedLeadForView(prev => prev ? { ...prev, assignedCaller: reassignTargetCaller } : null);
    }
    setSelectedIds(new Set());
    setReassignModalOpen(false);
  };

  const handleReassign = () => {
    if (selectedIds.size === 0) return;
    openReassignModal(Array.from(selectedIds));
  };

  const handleExportCsv = () => {
    const rows = [
      ['TMID', 'Name', 'Mobile', 'Type', 'Status', 'Caller', 'Process', 'Reg Date', 'Last Called'],
      ...leads
        .filter(l => selectedIds.has(l.id))
        .map(l => [l.id, l.name, l.mobile, l.type, l.status, l.assignedCaller, l.process, l.regDate, l.lastCalled]),
    ];
    const blob = new Blob([rows.map(r => r.join(',')).join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'leads_export.csv'; a.click();
    URL.revokeObjectURL(url);
  };

  // ── Cold lead helpers ────────────────────────────────────────────────────
  const toggleColdLead = (id: string) =>
    setColdLeads(prev => prev.map(cl => cl.id === id ? { ...cl, selected: !cl.selected } : cl));

  const selectedColdCount = coldLeads.filter(cl => cl.selected).length;

  const handleLoadMoreCold = () => {
    if (isLoadingMore) return;
    setIsLoadingMore(true);
    setTimeout(() => {
      setVisibleColdCount(prev => Math.min(prev + 3, coldLeads.length));
      setIsLoadingMore(false);
    }, 600);
  };

  const visibleColdLeads = coldLeads.slice(0, visibleColdCount);
  const hasMoreColdLeads = visibleColdCount < coldLeads.length;

  const handleAddToReactivation = () => {
    const sel = coldLeads.filter(cl => cl.selected);
    if (!sel.length) { alert('Select at least one cold lead first.'); return; }
    setLeads(prev => [
      ...sel.map(cl => ({
        id: cl.tmId, name: cl.name, mobile: '+91 99000-00000',
        type: cl.type, status: 'WARM' as LeadStatus,
        assignedCaller: 'Animesh Roy', process: 'KYC Verification' as Process,
        regDate: '01 Oct, 2023', lastCalled: 'Just now',
      })),
      ...prev,
    ]);
    setColdLeads(prev => prev.filter(cl => !cl.selected));
    alert(`${sel.length} lead(s) added to Reactivation Campaign!`);
  };

  const handleUpdateLeadField = (leadId: string, field: keyof Lead, value: any) => {
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, [field]: value } : l));
    if (selectedLeadForView && selectedLeadForView.id === leadId) {
      setSelectedLeadForView(prev => prev ? { ...prev, [field]: value } : null);
    }
  };

  const handleAddNote = (leadId: string) => {
    if (!newNote.trim()) return;
    setLeads(prev => prev.map(l => {
      if (l.id === leadId) {
        const currentNotes = l.notes || [];
        return { ...l, notes: [newNote, ...currentNotes] };
      }
      return l;
    }));
    if (selectedLeadForView && selectedLeadForView.id === leadId) {
      setSelectedLeadForView(prev => prev ? { ...prev, notes: [newNote, ...(prev.notes || [])] } : null);
    }
    setNewNote('');
  };

  // ── Create lead ───────────────────────────────────────────────────────────
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim() || !newMobile.trim()) return;
    setLeads(prev => [{
      id: `TM-${Math.floor(78000 + Math.random() * 2000)}`,
      name: newName, mobile: newMobile, type: newType, status: 'HOT',
      assignedCaller: newCaller, process: newProcess,
      regDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      lastCalled: 'Just now',
    }, ...prev]);
    setNewName(''); setNewMobile('');
    setIsCreateModalOpen(false);
  };

  // ── Badge helpers ─────────────────────────────────────────────────────────
  const statusBadge = (s: LeadStatus) => {
    const bg = s === 'HOT' ? 'bg-red-100 text-red-700' : s === 'WARM' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-500';
    const dot = s === 'HOT' ? 'bg-red-600' : s === 'WARM' ? 'bg-blue-600' : 'bg-gray-400';
    return (
      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold ${bg}`}>
        <span className={`w-1.5 h-1.5 rounded-full ${dot}`} />
        {s}
      </span>
    );
  };

  const typeBadge = (t: LeadType) => {
    const cls = t === 'FM' ? 'bg-purple-100 text-purple-700'
      : t === 'DR' ? 'bg-green-100 text-green-700'
        : t === 'EC' ? 'bg-blue-100 text-blue-700'
          : 'bg-gray-100 text-gray-600';
    return <span className={`px-1.5 py-0.5 ${cls} text-[10px] font-bold rounded`}>{t}</span>;
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main className="flex flex-col h-full bg-background relative">

      {/* ── Filter Bar ──────────────────────────────────────────────────── */}
      <section className="px-4 py-2 bg-white border-b border-gray-200 flex items-center justify-between shrink-0 gap-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Filters:</span>

          {/* Search Bar */}
          <div className="relative flex items-center">
            <span className="material-symbols-outlined absolute left-2.5 text-gray-400 text-[16px]">search</span>
            <input
              type="text"
              placeholder="Search Name/ID/Mobile..."
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setPage(0); }}
              className="pl-8 pr-3 py-1 bg-gray-100 border border-gray-300 rounded-full text-[11px] outline-none focus:border-blue-500 focus:bg-white w-48 transition-all"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="absolute right-2.5 text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-[14px]">close</span>
              </button>
            )}
          </div>

          {/* Status */}
          <label className={`relative inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[11px] font-semibold cursor-pointer select-none transition-colors
            ${statusFilter !== 'All' ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-600 hover:border-blue-400'}`}>
            Status: {statusFilter === 'All' ? 'All' : statusFilter}
            {statusFilter !== 'All' && (
              <span
                className="ml-0.5 text-[12px] font-bold text-blue-500 hover:text-red-500 leading-none"
                onClick={e => { e.preventDefault(); setStatusFilter('All'); setPage(0); }}
              >✕</span>
            )}
            <svg className="w-3 h-3 ml-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            <select
              value={statusFilter}
              onChange={e => { setStatusFilter(e.target.value as StatusFilter); setPage(0); }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {STATUS_FILTERS.map(s => <option key={s} value={s}>{s === 'All' ? 'All Statuses' : s}</option>)}
            </select>
          </label>

          {/* Date range */}
          <label className="relative inline-flex items-center gap-1 px-3 py-1 rounded-full border border-gray-300 bg-gray-100 text-gray-600 text-[11px] font-semibold cursor-pointer hover:border-blue-400 transition-colors">
            📅 {dateFilter}
            <svg className="w-3 h-3 ml-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            <select
              value={dateFilter}
              onChange={e => { setDateFilter(e.target.value as DateFilter); setPage(0); }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {DATE_FILTERS.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </label>

          {/* Caller */}
          <label className={`relative inline-flex items-center gap-1 px-3 py-1 rounded-full border text-[11px] font-semibold cursor-pointer select-none transition-colors
            ${callerFilter !== 'All Callers' ? 'bg-blue-50 border-blue-400 text-blue-700' : 'bg-gray-100 border-gray-300 text-gray-600 hover:border-blue-400'}`}>
            {callerFilter}
            <svg className="w-3 h-3 ml-0.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            <select
              value={callerFilter}
              onChange={e => { setCallerFilter(e.target.value); setPage(0); }}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            >
              {CALLERS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </label>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { setLeads([...ALL_LEADS]); setSelectedIds(new Set()); setPage(0); }}
            className="flex items-center gap-1.5 px-3 py-1.5 border border-gray-300 rounded text-[11px] font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">refresh</span>
            Refresh
          </button>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-1.5 bg-blue-600 text-white rounded shadow text-[11px] font-bold hover:bg-blue-700 transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">add_circle</span>
            Create New Lead
          </button>
        </div>
      </section>

      {/* ── Table ──────────────────────────────────────────── */}
      <section className="flex-1 overflow-y-auto flex flex-col p-4 gap-3" style={{ paddingBottom: drawerOpen ? '326px' : '64px' }}>
        <div className="bg-white border border-gray-200 rounded shadow-sm flex flex-col overflow-hidden">
          <div className="overflow-auto flex-1">
            <table className="w-full text-left border-collapse min-w-[1050px]">
              <thead className="sticky top-0 bg-gray-50 border-b border-gray-200 z-10">
                <tr>
                  <th className="w-10 px-3 py-2">
                    <input type="checkbox" checked={allPageSelected} onChange={toggleAll}
                      className="rounded border-gray-300 text-blue-600 w-4 h-4 cursor-pointer" />
                  </th>
                  {['TMID', 'Lead Name', 'Mobile', 'Type', 'Status', 'Assigned Caller', 'Process', 'Reg Date', 'Last Called', ''].map(h => (
                    <th key={h} className="px-3 py-2 text-[10px] font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {pagedLeads.length === 0 ? (
                  <tr>
                    <td colSpan={11} className="text-center py-20 text-gray-400 text-sm">
                      No leads match the current filters.
                    </td>
                  </tr>
                ) : pagedLeads.map(lead => (
                  <tr
                    key={lead.id}
                    onClick={() => setSelectedLeadForView(lead)}
                    className={`group cursor-pointer transition-colors hover:bg-blue-50/40 ${selectedIds.has(lead.id) ? 'bg-blue-50 border-l-2 border-l-blue-500' : ''}`}
                  >
                    <td className="px-3 py-2" onClick={e => { e.stopPropagation(); toggleOne(lead.id); }}>
                      <input type="checkbox" checked={selectedIds.has(lead.id)} onChange={() => {}}
                        className="rounded border-gray-300 text-blue-600 w-4 h-4 cursor-pointer" />
                    </td>
                    <td className="px-3 py-2 text-[11px] font-mono text-blue-600 font-semibold">{lead.id}</td>
                    <td className="px-3 py-2 text-[12px] font-semibold text-gray-800">{lead.name}</td>
                    <td className="px-3 py-2 text-[11px] font-mono text-gray-600">{lead.mobile}</td>
                    <td className="px-3 py-2">{typeBadge(lead.type)}</td>
                    <td className="px-3 py-2">{statusBadge(lead.status)}</td>
                    <td className="px-3 py-2 text-[12px] text-gray-700">{lead.assignedCaller}</td>
                    <td className="px-3 py-2 text-[11px] text-gray-500">{lead.process}</td>
                    <td className="px-3 py-2 text-[11px] text-gray-500">{lead.regDate}</td>
                    <td className="px-3 py-2 text-[11px] text-gray-500">{lead.lastCalled}</td>
                    <td className="px-3 py-2 text-right" onClick={e => e.stopPropagation()}>
                      <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => setSelectedLeadForView(lead)}
                          className="text-gray-400 hover:text-blue-600"
                          title="View Details"
                        >
                          <span className="material-symbols-outlined text-[16px]">visibility</span>
                        </button>
                        <button
                          onClick={() => openReassignModal([lead.id])}
                          className="text-gray-400 hover:text-blue-600"
                          title="Reassign / Transfer"
                        >
                          <span className="material-symbols-outlined text-[16px]">move_up</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="h-10 bg-gray-50 border-t border-gray-200 flex items-center justify-between px-4 shrink-0">
            <span className="text-[11px] text-gray-500">
              Showing <strong>{page * rowsPerPage + 1}–{Math.min((page + 1) * rowsPerPage, totalLeads)}</strong> of <strong>{totalLeads}</strong> Leads
            </span>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-[11px] text-gray-500">Rows per page:</span>
                <select
                  value={rowsPerPage}
                  onChange={e => { setRowsPerPage(Number(e.target.value)); setPage(0); }}
                  className="text-[11px] font-bold border-none bg-transparent focus:ring-0 cursor-pointer"
                >
                  {ROWS_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="flex items-center gap-1">
                <button
                  disabled={page === 0}
                  onClick={() => setPage(p => p - 1)}
                  className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_left</span>
                </button>
                <span className="text-[11px] font-semibold text-gray-500 px-1">{page + 1} / {Math.max(1, totalPages)}</span>
                <button
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage(p => p + 1)}
                  className="w-7 h-7 flex items-center justify-center rounded border border-gray-300 hover:bg-gray-100 disabled:opacity-40 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bulk Toolbar */}
        {someSelected && (
          <div className="absolute bottom-[280px] left-1/2 -translate-x-1/2 bg-gray-900 text-white py-2.5 px-6 rounded-full shadow-2xl flex items-center gap-6 z-40 border border-white/10">
            <div className="flex items-center gap-2 pr-4 border-r border-white/20">
              <span className="bg-blue-500 text-white px-2 py-0.5 rounded-full text-[10px] font-bold">{selectedIds.size}</span>
              <span className="text-[11px] font-bold">Leads Selected</span>
            </div>
            <div className="flex items-center gap-5 text-[11px] font-semibold">
              <button onClick={handleReassign} className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
                <span className="material-symbols-outlined text-[16px]">move_up</span> REASSIGN
              </button>
              <button onClick={() => alert('Move to funnel — coming soon')} className="flex items-center gap-1.5 hover:text-blue-300 transition-colors">
                <span className="material-symbols-outlined text-[16px]">filter_list</span> MOVE TO FUNNEL
              </button>
              <button onClick={handleMarkCold} className="flex items-center gap-1.5 hover:text-red-400 transition-colors">
                <span className="material-symbols-outlined text-[16px]">ac_unit</span> MARK COLD
              </button>
              <button onClick={handleExportCsv} className="flex items-center gap-1.5 hover:text-green-400 transition-colors">
                <span className="material-symbols-outlined text-[16px]">download</span> EXPORT CSV
              </button>
            </div>
            <button onClick={() => setSelectedIds(new Set())} className="ml-2 hover:text-red-400 transition-colors">
              <span className="material-symbols-outlined text-[18px]">close</span>
            </button>
          </div>
        )}
      </section>

      {/* ── Cold Lead Drawer ──────────────────────────────────────────────── */}
      <div className={`fixed bottom-0 left-[240px] right-0 bg-white border-t border-gray-200 shadow-[0_-4px_12px_rgba(0,0,0,0.08)] z-20 transition-all duration-300 ${drawerOpen ? 'max-h-[310px]' : 'max-h-12'} overflow-hidden`}>
        {/* Header */}
        <div className="h-12 flex items-center justify-between px-4 bg-white">
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-gray-400 text-[18px]">ac_unit</span>
            <span className="text-[11px] font-bold text-gray-700 uppercase tracking-wide">Cold Lead Reactivation Portal</span>
            <span className="px-2 py-0.5 bg-gray-600 text-white text-[10px] font-bold rounded-full">{coldLeads.length} Leads</span>
          </div>
          <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <button
              onClick={handleAddToReactivation}
              className="bg-blue-600 text-white px-4 py-1.5 rounded text-[11px] font-bold hover:bg-blue-700 transition-colors"
            >
              {selectedColdCount > 0 ? `Add ${selectedColdCount} to Campaign` : 'Add to Reactivation Campaign'}
            </button>
            {/* Collapse / Expand button */}
            <button
              onClick={() => setDrawerOpen(v => !v)}
              className="flex items-center justify-center w-8 h-8 rounded border border-gray-300 bg-white hover:bg-gray-100 transition-colors text-gray-500"
              title={drawerOpen ? 'Collapse drawer' : 'Expand drawer'}
            >
              <span className={`material-symbols-outlined text-[20px] transition-transform duration-300 ${drawerOpen ? 'rotate-180' : ''}`}>
                keyboard_arrow_up
              </span>
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="h-[258px] px-4 py-3 overflow-auto bg-gray-50">
          {coldLeads.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 text-sm">
              <span className="material-symbols-outlined text-4xl mb-2 text-green-400">check_circle</span>
              All cold leads have been moved to reactivation campaigns.
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-3">
              {visibleColdLeads.map(cl => (
                <div
                  key={cl.id}
                  onClick={() => toggleColdLead(cl.id)}
                  className={`border rounded-md p-3 bg-white flex items-center justify-between cursor-pointer transition-all hover:border-blue-400 ${cl.selected ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded bg-gray-100 flex items-center justify-center text-gray-400">
                      <span className="material-symbols-outlined text-[18px]">person</span>
                    </div>
                    <div>
                      <p className="text-[12px] font-bold text-gray-800 truncate w-28">{cl.name}</p>
                      <p className="text-[10px] text-gray-400 font-mono">{cl.tmId} · {cl.type}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 mb-1">Last called {cl.lastCalledDays}d ago</p>
                    <input type="checkbox" checked={cl.selected} readOnly
                      className="rounded border-gray-300 text-blue-600 w-4 h-4 pointer-events-none" />
                  </div>
                </div>
              ))}

              {/* Load More card — only visible when more leads exist */}
              {hasMoreColdLeads && (
                <div
                  onClick={handleLoadMoreCold}
                  className={`border border-dashed rounded-md flex flex-col items-center justify-center gap-1.5 cursor-pointer transition-all p-3 select-none
                    ${isLoadingMore
                      ? 'border-blue-300 bg-blue-50 text-blue-400'
                      : 'border-gray-300 bg-white hover:border-blue-400 hover:bg-blue-50 text-gray-400 hover:text-blue-500'}`}
                >
                  {isLoadingMore ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
                      <span className="text-[11px] font-semibold">Loading…</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px]">expand_more</span>
                      <span className="text-[11px] font-semibold">
                        + Load {Math.min(3, coldLeads.length - visibleColdCount)} more cold leads
                      </span>
                      <span className="text-[10px] text-gray-300">
                        {coldLeads.length - visibleColdCount} remaining
                      </span>
                    </>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Create Lead Modal ──────────────────────────────────────────────── */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden">
            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">add_circle</span>
                Create New Lead
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <form onSubmit={handleCreateLead} className="p-6 space-y-4 text-[12px]">
              <div>
                <label className="block font-semibold text-gray-500 mb-1 uppercase text-[10px] tracking-wider">Lead / Company Name *</label>
                <input type="text" required placeholder="e.g. Rajesh Logistics Pvt Ltd"
                  value={newName} onChange={e => setNewName(e.target.value)}
                  className="w-full h-9 border border-gray-300 px-3 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none" />
              </div>
              <div>
                <label className="block font-semibold text-gray-500 mb-1 uppercase text-[10px] tracking-wider">Mobile Number *</label>
                <input type="tel" required placeholder="+91 XXXXX-XXXXX"
                  value={newMobile} onChange={e => setNewMobile(e.target.value)}
                  className="w-full h-9 border border-gray-300 px-3 rounded focus:border-blue-500 focus:ring-1 focus:ring-blue-200 outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-gray-500 mb-1 uppercase text-[10px] tracking-wider">Lead Type</label>
                  <select value={newType} onChange={e => setNewType(e.target.value as LeadType)}
                    className="w-full h-9 border border-gray-300 px-2 rounded bg-white focus:border-blue-500 outline-none">
                    <option value="DR">DR — Driver</option>
                    <option value="TR">TR — Transporter</option>
                    <option value="FM">FM — Fleet Manager</option>
                    <option value="EC">EC — Enterprise Client</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-gray-500 mb-1 uppercase text-[10px] tracking-wider">Assign to Caller</label>
                  <select value={newCaller} onChange={e => setNewCaller(e.target.value)}
                    className="w-full h-9 border border-gray-300 px-2 rounded bg-white focus:border-blue-500 outline-none">
                    {CALLERS.filter(c => c !== 'All Callers').map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-gray-500 mb-1 uppercase text-[10px] tracking-wider">Process</label>
                <select value={newProcess} onChange={e => setNewProcess(e.target.value as Process)}
                  className="w-full h-9 border border-gray-300 px-2 rounded bg-white focus:border-blue-500 outline-none">
                  <option>Vendor Onboarding</option>
                  <option>KYC Verification</option>
                  <option>RTO Check</option>
                  <option>Direct Load Booking</option>
                  <option>Account Setup</option>
                  <option>Driver Registration</option>
                  <option>Transporter Onboarding</option>
                </select>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <button type="button" onClick={() => setIsCreateModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded transition-colors text-[11px]">
                  Cancel
                </button>
                <button type="submit"
                  className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded shadow-sm transition-colors text-[11px]">
                  Create Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Reassign / Transfer Modal ────────────────────────────────────── */}
      {reassignModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-sm overflow-hidden border border-gray-200">
            <div className="bg-blue-600 px-6 py-4 text-white flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined text-[18px]">move_up</span>
                Transfer / Reassign Leads
              </h3>
              <button onClick={() => setReassignModalOpen(false)} className="hover:bg-white/20 p-1 rounded transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <div className="p-6 space-y-4 text-[12px]">
              <p className="text-gray-600">
                You are transferring <strong className="text-blue-600">{reassignTargetIds.length}</strong> lead(s) to a new caller agent.
              </p>
              <div>
                <label className="block font-semibold text-gray-500 mb-1 uppercase text-[10px] tracking-wider">Select Caller</label>
                <select 
                  value={reassignTargetCaller} 
                  onChange={e => setReassignTargetCaller(e.target.value)}
                  className="w-full h-9 border border-gray-300 px-2 rounded bg-white focus:border-blue-500 outline-none"
                >
                  {CALLERS.filter(c => c !== 'All Callers').map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="pt-3 border-t border-gray-200 flex justify-end gap-2">
                <button type="button" onClick={() => setReassignModalOpen(false)}
                  className="px-5 py-2 border border-gray-300 hover:bg-gray-100 text-gray-700 font-semibold rounded transition-colors text-[11px]">
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmReassign}
                  className="px-5 py-2 bg-blue-600 text-white hover:bg-blue-700 font-bold rounded shadow-sm transition-colors text-[11px]"
                >
                  Confirm Transfer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Lead Detail Modal / Panel ─────────────────────────────────────── */}
      {selectedLeadForView && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-end z-50">
          <div className="bg-white h-full w-full max-w-md shadow-2xl flex flex-col border-l border-gray-200">
            {/* Header */}
            <div className="bg-gray-900 text-white px-6 py-4 flex justify-between items-center shrink-0">
              <div>
                <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">{selectedLeadForView.type} Lead Details</span>
                <h3 className="font-bold text-sm truncate max-w-[280px]">{selectedLeadForView.name}</h3>
              </div>
              <button onClick={() => setSelectedLeadForView(null)} className="hover:bg-white/10 p-1.5 rounded-full transition-colors">
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 text-[12px]">
              {/* Quick Info Card */}
              <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-semibold uppercase text-[10px]">Lead ID</span>
                  <span className="font-mono font-bold text-gray-800">{selectedLeadForView.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-semibold uppercase text-[10px]">Mobile</span>
                  <span className="font-mono text-gray-800">{selectedLeadForView.mobile}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-semibold uppercase text-[10px]">Registered On</span>
                  <span className="text-gray-800">{selectedLeadForView.regDate}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400 font-semibold uppercase text-[10px]">Last Contacted</span>
                  <span className="text-gray-800">{selectedLeadForView.lastCalled}</span>
                </div>
              </div>

              {/* Editable Fields */}
              <div className="space-y-3">
                <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Lead Lifecycle Control</h4>
                
                <div>
                  <label className="block text-gray-500 font-semibold mb-1">Lifecycle Status</label>
                  <div className="flex gap-2">
                    {(['HOT', 'WARM', 'COLD'] as LeadStatus[]).map(st => {
                      const isActive = selectedLeadForView.status === st;
                      const activeCls = st === 'HOT' ? 'bg-red-600 text-white border-red-600' : st === 'WARM' ? 'bg-blue-600 text-white border-blue-600' : 'bg-gray-600 text-white border-gray-600';
                      return (
                        <button
                          key={st}
                          onClick={() => handleUpdateLeadField(selectedLeadForView.id, 'status', st)}
                          className={`flex-1 py-1 px-3 border rounded text-[11px] font-bold transition-all ${isActive ? activeCls : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'}`}
                        >
                          {st}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Assigned Caller</label>
                    <select
                      value={selectedLeadForView.assignedCaller}
                      onChange={e => handleUpdateLeadField(selectedLeadForView.id, 'assignedCaller', e.target.value)}
                      className="w-full h-8 border border-gray-300 px-2 rounded bg-white outline-none focus:border-blue-500 text-[11px]"
                    >
                      {CALLERS.filter(c => c !== 'All Callers').map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-gray-500 font-semibold mb-1">Current Process Phase</label>
                    <select
                      value={selectedLeadForView.process}
                      onChange={e => handleUpdateLeadField(selectedLeadForView.id, 'process', e.target.value as Process)}
                      className="w-full h-8 border border-gray-300 px-2 rounded bg-white outline-none focus:border-blue-500 text-[11px]"
                    >
                      <option>Vendor Onboarding</option>
                      <option>KYC Verification</option>
                      <option>RTO Check</option>
                      <option>Direct Load Booking</option>
                      <option>Account Setup</option>
                      <option>Driver Registration</option>
                      <option>Transporter Onboarding</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notes Section */}
              <div className="space-y-3 pt-2">
                <h4 className="font-bold text-gray-700 uppercase tracking-wider text-[10px]">Caller Logs / Call Notes</h4>
                
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add dynamic call updates or status notes..."
                    value={newNote}
                    onChange={e => setNewNote(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleAddNote(selectedLeadForView.id)}
                    className="flex-1 h-9 border border-gray-300 px-3 rounded text-[11px] outline-none focus:border-blue-500"
                  />
                  <button
                    onClick={() => handleAddNote(selectedLeadForView.id)}
                    className="px-4 bg-gray-900 text-white font-bold rounded text-[11px] hover:bg-gray-800 transition-colors"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {!selectedLeadForView.notes || selectedLeadForView.notes.length === 0 ? (
                    <p className="text-gray-400 text-center py-4 italic">No call updates log added yet.</p>
                  ) : (
                    selectedLeadForView.notes.map((note, nIdx) => (
                      <div key={nIdx} className="p-2.5 bg-gray-50 border border-gray-200 rounded text-gray-700 space-y-1">
                        <p className="leading-relaxed">{note}</p>
                        <p className="text-[9px] text-gray-400 font-semibold">Logged Just now</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
              <button
                onClick={() => setSelectedLeadForView(null)}
                className="px-6 py-2 bg-gray-900 text-white font-bold rounded hover:bg-gray-800 transition-colors"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ThLeadManagementConsole;
