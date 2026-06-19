import React, { useState } from 'react';

interface Lead {
  id: string;
  name: string;
  mobile: string;
  type: 'FM' | 'DR' | 'TR' | 'EC';
  status: 'HOT' | 'WARM' | 'COLD';
  assignedCaller: string;
  process: string;
  regDate: string;
  lastCalled: string;
}

interface ColdLead {
  id: string;
  name: string;
  type: string;
  lastCalled: string;
}

export const Page04LeadManagement: React.FC = () => {
  // State
  const [leads, setLeads] = useState<Lead[]>([
    { id: 'TM-78291', name: 'Rajesh Logistics Pvt Ltd', mobile: '+91 98765-43210', type: 'FM', status: 'HOT', assignedCaller: 'Animesh Roy', process: 'Vendor Onboarding', regDate: '12 Oct, 2023', lastCalled: '2h ago' },
    { id: 'TM-78292', name: 'Gagan Deep Transport', mobile: '+91 88221-11002', type: 'DR', status: 'WARM', assignedCaller: 'Sunita Sharma', process: 'KYC Verification', regDate: '12 Oct, 2023', lastCalled: 'Yesterday' },
    { id: 'TM-78293', name: 'Pacific Express', mobile: '+91 77665-54433', type: 'TR', status: 'COLD', assignedCaller: 'Unassigned', process: 'RTO Check', regDate: '11 Oct, 2023', lastCalled: '5 days ago' },
    { id: 'TM-78294', name: 'Vikas Transporter Hub', mobile: '+91 99887-76655', type: 'FM', status: 'HOT', assignedCaller: 'Animesh Roy', process: 'Direct Load Booking', regDate: '10 Oct, 2023', lastCalled: '10m ago' },
    { id: 'TM-78295', name: 'Swift Cargo Movers', mobile: '+91 91234-56789', type: 'EC', status: 'WARM', assignedCaller: 'Preeti Jain', process: 'Account Setup', regDate: '09 Oct, 2023', lastCalled: '4h ago' }
  ]);

  const [coldLeads, setColdLeads] = useState<ColdLead[]>([
    { id: 'TM-11029', name: 'Karan Sharma', type: 'TR', lastCalled: '24d ago' },
    { id: 'TM-11204', name: 'Meena Kumari Logistics', type: 'FM', lastCalled: '41d ago' },
    { id: 'TM-10992', name: 'Anand Heavy Haul', type: 'EC', lastCalled: '18d ago' },
    { id: 'TM-11005', name: 'Blue Dart Vendor 4', type: 'TR', lastCalled: '30d ago' }
  ]);

  // Filters State
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'HOT' | 'WARM' | 'COLD'>('HOT');
  const [processFilter, setProcessFilter] = useState<string>('ALL');
  const [callerFilter, setCallerFilter] = useState<string>('ALL');
  const [dateFilter, setDateFilter] = useState<boolean>(true); // true = Last 7 Days active, false = All Time

  // Dropdown UI visibility states
  const [activeDropdown, setActiveDropdown] = useState<'status' | 'process' | 'caller' | null>(null);

  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [selectedColdLeads, setSelectedColdLeads] = useState<string[]>([]);
  const [drawerOpen, setDrawerOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  
  // New Lead Form State
  const [newLeadName, setNewLeadName] = useState('');
  const [newLeadMobile, setNewLeadMobile] = useState('');
  const [newLeadType, setNewLeadType] = useState<'FM' | 'DR' | 'TR' | 'EC'>('FM');
  const [newLeadStatus, setNewLeadStatus] = useState<'HOT' | 'WARM' | 'COLD'>('HOT');
  const [newLeadProcess, setNewLeadProcess] = useState('Vendor Onboarding');
  
  // Toast notification
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Filter application logic
  const filteredLeads = leads.filter(lead => {
    if (statusFilter !== 'ALL' && lead.status !== statusFilter) return false;
    if (processFilter !== 'ALL' && lead.process !== processFilter) return false;
    if (callerFilter !== 'ALL' && lead.assignedCaller !== callerFilter) return false;
    if (dateFilter) {
      if (lead.regDate === '12 Oct, 2023') return false;
    }
    return true;
  });

  // Toggle single lead selection
  const handleSelectLead = (id: string) => {
    setSelectedLeads(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Toggle master checkbox
  const handleSelectAllLeads = () => {
    if (selectedLeads.length === filteredLeads.length) {
      setSelectedLeads([]);
    } else {
      setSelectedLeads(filteredLeads.map(lead => lead.id));
    }
  };

  // Toggle cold lead selection
  const handleSelectColdLead = (id: string) => {
    setSelectedColdLeads(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  // Refresh trigger
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Leads list refreshed successfully.');
    }, 800);
  };

  // Create Lead
  const handleCreateLead = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLeadName || !newLeadMobile) {
      alert('Please fill out all fields');
      return;
    }
    const newLead: Lead = {
      id: `TM-${Math.floor(10000 + Math.random() * 90000)}`,
      name: newLeadName,
      mobile: newLeadMobile,
      type: newLeadType,
      status: newLeadStatus,
      assignedCaller: 'Unassigned',
      process: newLeadProcess,
      regDate: 'Today',
      lastCalled: 'Never'
    };
    setLeads([newLead, ...leads]);
    setIsCreateModalOpen(false);
    setNewLeadName('');
    setNewLeadMobile('');
    showToast(`Lead for ${newLead.name} created!`);
  };

  // Bulk Actions
  const handleBulkMarkCold = () => {
    setLeads(prev =>
      prev.map(l => selectedLeads.includes(l.id) ? { ...l, status: 'COLD', assignedCaller: 'Unassigned' } : l)
    );
    showToast(`Marked ${selectedLeads.length} leads as COLD`);
    setSelectedLeads([]);
  };

  const handleBulkMoveToFunnel = () => {
    showToast(`Moved ${selectedLeads.length} leads to active funnel`);
    setSelectedLeads([]);
  };

  const handleBulkReassign = () => {
    const caller = prompt('Enter caller name to assign to:', 'Animesh Roy');
    if (caller) {
      setLeads(prev =>
        prev.map(l => selectedLeads.includes(l.id) ? { ...l, assignedCaller: caller } : l)
      );
      showToast(`Reassigned ${selectedLeads.length} leads to ${caller}`);
      setSelectedLeads([]);
    }
  };

  // Load More Cold Leads
  const handleLoadMoreCold = () => {
    const names = ['Vikram Rathore', 'Shweta Patel', 'Naresh Iyer', 'Pooja Hegde'];
    const types = ['FM', 'DR', 'TR', 'EC'];
    const newColdLeads: ColdLead[] = Array.from({ length: 3 }).map((_, i) => ({
      id: `TM-${Math.floor(11000 + Math.random() * 9000)}`,
      name: names[Math.floor(Math.random() * names.length)],
      type: types[Math.floor(Math.random() * types.length)],
      lastCalled: `${Math.floor(15 + Math.random() * 30)}d ago`
    }));
    setColdLeads([...coldLeads, ...newColdLeads]);
    showToast('Loaded more cold leads');
  };

  // Add Cold Leads to Campaign
  const handleAddColdToCampaign = () => {
    if (selectedColdLeads.length === 0) {
      showToast('No cold leads selected to add to campaign');
      return;
    }
    showToast(`Added ${selectedColdLeads.length} cold leads to reactivation campaign`);
    setSelectedColdLeads([]);
  };

  // Close active menus when clicking outside
  const toggleDropdown = (menu: 'status' | 'process' | 'caller') => {
    setActiveDropdown(prev => prev === menu ? null : menu);
  };

  return (
    <main className="flex flex-col relative min-h-screen pb-24 bg-white">
      {/* Click outside backdrop overlay */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-20 cursor-default" 
          onClick={() => setActiveDropdown(null)} 
        />
      )}

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white text-xs px-4 py-2 rounded-sm shadow-lg z-50 transition-all font-bold">
          {toastMessage}
        </div>
      )}

      {/* Filter and Top action bar */}
      <section className="px-md py-sm bg-white border-b border-outline-variant flex items-center justify-between">
        <div className="flex items-center gap-sm overflow-visible">
          <span className="text-label-caps font-bold text-on-surface-variant mr-2">FILTERS:</span>
          
          {/* Process Filter */}
          <div className={`relative ${activeDropdown === 'process' ? 'z-30' : ''}`}>
            <div 
              onClick={() => toggleDropdown('process')}
              className={`flex items-center px-3 py-1 rounded-full border gap-2 cursor-pointer transition-all ${
                processFilter !== 'ALL' 
                  ? 'bg-primary/10 border-primary text-primary font-bold' 
                  : 'bg-surface-container-high border-outline-variant hover:border-primary'
              }`}
            >
              <span className="text-label-caps">
                {processFilter === 'ALL' ? 'Process' : `Process: ${processFilter}`}
              </span>
              <span className="material-symbols-outlined text-[16px]" data-icon="keyboard_arrow_down">keyboard_arrow_down</span>
            </div>
            {activeDropdown === 'process' && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-outline-variant rounded shadow-md z-30 py-1 w-52 text-xs">
                {['ALL', 'Vendor Onboarding', 'KYC Verification', 'RTO Check', 'Direct Load Booking', 'Account Setup'].map(proc => (
                  <div 
                    key={proc}
                    onClick={() => { setProcessFilter(proc); setActiveDropdown(null); }}
                    className={`px-3 py-1.5 hover:bg-surface-container-low cursor-pointer font-medium ${
                      processFilter === proc ? 'text-primary font-bold bg-primary/5' : ''
                    }`}
                  >
                    {proc === 'ALL' ? 'All Processes' : proc}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Filter */}
          <div className={`relative ${activeDropdown === 'status' ? 'z-30' : ''}`}>
            <div 
              onClick={() => toggleDropdown('status')}
              className={`flex items-center px-3 py-1 rounded-full border gap-2 cursor-pointer transition-all ${
                statusFilter !== 'ALL' 
                  ? 'bg-primary/10 border-primary text-primary font-bold' 
                  : 'bg-surface-container-high border-outline-variant hover:border-primary'
              }`}
            >
              <span className="text-label-caps">
                {statusFilter === 'ALL' ? 'Status: All' : `Status: ${statusFilter}`}
              </span>
              {statusFilter !== 'ALL' ? (
                <span 
                  className="material-symbols-outlined text-[16px] text-primary hover:bg-primary/20 rounded-full" 
                  data-icon="close"
                  onClick={(e) => { e.stopPropagation(); setStatusFilter('ALL'); }}
                >
                  close
                </span>
              ) : (
                <span className="material-symbols-outlined text-[16px]" data-icon="keyboard_arrow_down">keyboard_arrow_down</span>
              )}
            </div>
            {activeDropdown === 'status' && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-outline-variant rounded shadow-md z-30 py-1 w-36 text-xs">
                {['ALL', 'HOT', 'WARM', 'COLD'].map(stat => (
                  <div 
                    key={stat}
                    onClick={() => { setStatusFilter(stat as any); setActiveDropdown(null); }}
                    className={`px-3 py-1.5 hover:bg-surface-container-low cursor-pointer font-medium ${
                      statusFilter === stat ? 'text-primary font-bold bg-primary/5' : ''
                    }`}
                  >
                    {stat === 'ALL' ? 'All Statuses' : stat}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Date Filter (Toggle Last 7 Days) */}
          <div 
            onClick={() => setDateFilter(!dateFilter)}
            className={`flex items-center px-3 py-1 rounded-full border gap-2 cursor-pointer transition-all ${
              dateFilter 
                ? 'bg-primary/10 border-primary text-primary font-bold' 
                : 'bg-surface-container-high border-outline-variant hover:border-primary'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]" data-icon="calendar_month">calendar_month</span>
            <span className="text-label-caps">Last 7 Days</span>
          </div>

          {/* Assigned Caller Filter */}
          <div className={`relative ${activeDropdown === 'caller' ? 'z-30' : ''}`}>
            <div 
              onClick={() => toggleDropdown('caller')}
              className={`flex items-center px-3 py-1 rounded-full border gap-2 cursor-pointer transition-all ${
                callerFilter !== 'ALL' 
                  ? 'bg-primary/10 border-primary text-primary font-bold' 
                  : 'bg-surface-container-high border-outline-variant hover:border-primary'
              }`}
            >
              <span className="text-label-caps">
                {callerFilter === 'ALL' ? 'Assigned Caller' : `Caller: ${callerFilter}`}
              </span>
              <span className="material-symbols-outlined text-[16px]" data-icon="keyboard_arrow_down">keyboard_arrow_down</span>
            </div>
            {activeDropdown === 'caller' && (
              <div className="absolute top-full left-0 mt-1 bg-white border border-outline-variant rounded shadow-md z-30 py-1 w-44 text-xs">
                {['ALL', 'Animesh Roy', 'Sunita Sharma', 'Preeti Jain', 'Unassigned'].map(caller => (
                  <div 
                    key={caller}
                    onClick={() => { setCallerFilter(caller); setActiveDropdown(null); }}
                    className={`px-3 py-1.5 hover:bg-surface-container-low cursor-pointer font-medium ${
                      callerFilter === caller ? 'text-primary font-bold bg-primary/5' : ''
                    }`}
                  >
                    {caller === 'ALL' ? 'All Callers' : caller}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center gap-sm shrink-0">
          <button 
            onClick={handleRefresh}
            className="bg-surface border border-outline-variant px-3 py-1.5 rounded flex items-center gap-2 hover:bg-surface-container-high transition-colors"
          >
            <span className={`material-symbols-outlined ${isRefreshing ? 'animate-spin' : ''}`} data-icon="refresh">refresh</span>
            <span className="text-label-caps uppercase">{isRefreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="bg-primary text-on-primary px-4 py-1.5 rounded shadow-sm flex items-center gap-2 hover:bg-primary-container transition-colors font-bold"
          >
            <span className="material-symbols-outlined" data-icon="add_circle">add_circle</span>
            <span className="text-label-caps uppercase">Create New Lead</span>
          </button>
        </div>
      </section>

      <section className="flex-1 overflow-hidden relative flex flex-col p-md gap-xl">
        <div className="flex-1 bg-white border border-outline-variant rounded shadow-[0_1px_3px_rgba(0,0,0,0.08)] flex flex-col overflow-hidden">
          <div className="overflow-auto custom-scrollbar flex-1">
            <table className="w-full text-left border-collapse min-w-[1200px]">
              <thead className="sticky top-0 bg-[#F0F2F5] border-b border-outline-variant z-10">
                <tr>
                  <th className="w-10 px-sm py-2">
                    <input 
                      className="rounded border-outline text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                      id="master-select" 
                      type="checkbox"
                      checked={selectedLeads.length === filteredLeads.length && filteredLeads.length > 0}
                      onChange={handleSelectAllLeads}
                    />
                  </th>
                  <th className="px-sm py-2 text-label-caps text-[#666666] uppercase">TMID</th>
                  <th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Lead Name</th>
                  <th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Mobile</th>
                  <th className="px-sm py-2 text-label-caps text-[#666666] uppercase text-center">Type</th>
                  <th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Status</th>
                  <th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Assigned Caller</th>
                  <th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Process</th>
                  <th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Reg Date</th>
                  <th className="px-sm py-2 text-label-caps text-[#666666] uppercase">Last Called</th>
                  <th className="w-10 px-sm py-2"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {filteredLeads.length > 0 ? (
                  filteredLeads.map((lead) => (
                    <tr 
                      key={lead.id} 
                      onClick={() => handleSelectLead(lead.id)}
                      className={`lead-row hover:bg-surface-container-low transition-colors group cursor-pointer ${
                        selectedLeads.includes(lead.id) ? 'bg-primary/5' : ''
                      }`}
                    >
                      <td className="px-sm py-1" onClick={(e) => e.stopPropagation()}>
                        <input 
                          className="lead-checkbox rounded border-outline text-primary focus:ring-primary w-4 h-4 cursor-pointer" 
                          type="checkbox"
                          checked={selectedLeads.includes(lead.id)}
                          onChange={() => handleSelectLead(lead.id)}
                        />
                      </td>
                      <td className="px-sm py-1 font-data-mono text-data-mono text-primary">{lead.id}</td>
                      <td className="px-sm py-1 font-body-sm font-semibold">{lead.name}</td>
                      <td className="px-sm py-1 font-data-mono text-body-sm">{lead.mobile}</td>
                      <td className="px-sm py-1 text-center">
                        <span className={`px-1.5 py-0.5 text-[10px] font-bold rounded ${
                          lead.type === 'FM' ? 'bg-tertiary-fixed text-on-tertiary-fixed' :
                          lead.type === 'DR' ? 'bg-secondary-fixed text-on-secondary-fixed' :
                          lead.type === 'TR' ? 'bg-outline-variant text-on-surface-variant' :
                          'bg-primary-fixed text-on-primary-fixed'
                        }`}>
                          {lead.type}
                        </span>
                      </td>
                      <td className="px-sm py-1">
                        <span className={`px-2 py-0.5 text-[11px] font-bold rounded flex items-center w-fit gap-1 ${
                          lead.status === 'HOT' ? 'bg-red-100 text-red-700' :
                          lead.status === 'WARM' ? 'bg-blue-100 text-blue-700' :
                          'bg-surface-variant text-outline'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            lead.status === 'HOT' ? 'bg-red-600' :
                            lead.status === 'WARM' ? 'bg-blue-600' :
                            'bg-outline'
                          }`}></span> 
                          {lead.status}
                        </span>
                      </td>
                      <td className="px-sm py-1 font-body-sm">{lead.assignedCaller}</td>
                      <td className="px-sm py-1 font-body-sm text-on-surface-variant">{lead.process}</td>
                      <td className="px-sm py-1 font-body-sm text-on-surface-variant">{lead.regDate}</td>
                      <td className="px-sm py-1 font-body-sm text-on-surface-variant">{lead.lastCalled}</td>
                      <td className="px-sm py-1 text-right">
                        <button className="text-outline hover:text-primary transition-colors opacity-0 group-hover:opacity-100">
                          <span className="material-symbols-outlined" data-icon="more_vert">more_vert</span>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={11} className="text-center py-8 text-outline text-xs font-semibold bg-white">
                      No leads match your selected filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination bar */}
          <div className="h-10 bg-[#F0F2F5] border-t border-outline-variant flex items-center justify-between px-md shrink-0">
            <div className="text-label-caps text-on-surface-variant">
              Showing <span className="font-bold">1-{filteredLeads.length}</span> of <span className="font-bold">1,284</span> Leads
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-label-caps text-on-surface-variant">Rows per page:</span>
                <select className="bg-transparent text-label-caps font-bold border-none focus:ring-0 p-0 pr-6">
                  <option>50</option>
                  <option>100</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <button className="w-7 h-7 flex items-center justify-center rounded border border-outline-variant bg-surface hover:bg-surface-container-high disabled:opacity-50" disabled>
                  <span className="material-symbols-outlined text-[18px]" data-icon="chevron_left">chevron_left</span>
                </button>
                <button 
                  onClick={() => showToast('Pagination clicked (Mock behavior)')}
                  className="w-7 h-7 flex items-center justify-center rounded border border-outline-variant bg-surface hover:bg-surface-container-high"
                >
                  <span className="material-symbols-outlined text-[18px]" data-icon="chevron_right">chevron_right</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Items Bulk Actions bar */}
        {selectedLeads.length > 0 && (
          <div className="fixed bottom-16 left-1/2 -translate-x-1/2 bg-inverse-surface text-surface py-2.5 px-md rounded-full shadow-xl flex items-center gap-xl border border-outline/50 z-40 transition-all transform translate-y-0 opacity-100">
            <div className="flex items-center gap-2 pr-md border-r border-outline-variant/30">
              <span className="bg-primary px-2 py-0.5 rounded-full text-[10px] font-bold text-white">{selectedLeads.length}</span>
              <span className="text-label-caps font-bold text-white">Leads Selected</span>
            </div>
            <div className="flex items-center gap-md text-white">
              <button onClick={handleBulkReassign} className="flex items-center gap-2 hover:text-primary-fixed-dim transition-colors text-white">
                <span className="material-symbols-outlined text-white" data-icon="move_up">move_up</span>
                <span className="text-label-caps text-white font-bold">REASSIGN</span>
              </button>
              <button onClick={handleBulkMoveToFunnel} className="flex items-center gap-2 hover:text-primary-fixed-dim transition-colors text-white">
                <span className="material-symbols-outlined text-white" data-icon="filter_list">filter_list</span>
                <span className="text-label-caps text-white font-bold">MOVE TO FUNNEL</span>
              </button>
              <button onClick={handleBulkMarkCold} className="flex items-center gap-2 hover:text-red-400 transition-colors text-white">
                <span className="material-symbols-outlined text-red-500" data-icon="ac_unit">ac_unit</span>
                <span className="text-label-caps text-red-500 font-bold">MARK COLD</span>
              </button>
              <button onClick={() => showToast('Exporting leads data to CSV...')} className="flex items-center gap-2 hover:text-primary-fixed-dim transition-colors text-white">
                <span className="material-symbols-outlined text-white" data-icon="download">download</span>
                <span className="text-label-caps text-white font-bold">EXPORT CSV</span>
              </button>
            </div>
            <button 
              onClick={() => setSelectedLeads([])}
              className="ml-4 p-1 hover:bg-surface-variant/20 rounded-full transition-colors"
            >
              <span className="material-symbols-outlined text-white" data-icon="close">close</span>
            </button>
          </div>
        )}
      </section>

      {/* Collapsible Cold Lead Reactivation Portal Drawer */}
      <div className={`fixed bottom-0 left-[240px] right-0 bg-white border-t border-outline-variant shadow-[0_-8px_30px_rgba(0,0,0,0.08)] transition-all duration-300 z-20 ${
        drawerOpen ? 'h-[330px]' : 'h-12 overflow-hidden'
      }`}>
        <div 
          onClick={() => setDrawerOpen(!drawerOpen)}
          className="h-12 flex items-center justify-between px-md cursor-pointer hover:bg-slate-50 border-b border-outline-variant transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-primary animate-pulse" data-icon="ac_unit">ac_unit</span>
            <span className="text-sm font-bold text-slate-800">Cold Lead Reactivation Portal</span>
            <span className="px-2.5 py-0.5 bg-primary/10 text-primary text-[10px] font-extrabold rounded-full">{coldLeads.length} Leads Available</span>
          </div>
          <div className="flex items-center gap-4" onClick={(e) => e.stopPropagation()}>
            <button 
              onClick={handleAddColdToCampaign}
              className="bg-primary text-on-primary px-4 py-1.5 rounded text-xs font-extrabold uppercase hover:bg-primary-container shadow-sm transition-all flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]" data-icon="bolt">bolt</span>
              Add to Reactivation Campaign
            </button>
            <button 
              onClick={() => setDrawerOpen(!drawerOpen)}
              className="p-1 hover:bg-slate-100 rounded-full transition-all"
            >
              <span className={`material-symbols-outlined transform transition-transform duration-300 block text-slate-500 ${drawerOpen ? 'rotate-180' : ''}`} data-icon="keyboard_arrow_up">keyboard_arrow_up</span>
            </button>
          </div>
        </div>

        {drawerOpen && (
          <div className="h-64 px-md py-sm overflow-auto custom-scrollbar bg-white">
            <div className="grid grid-cols-3 gap-md">
              {coldLeads.map((c) => (
                <div 
                  key={c.id}
                  onClick={() => handleSelectColdLead(c.id)}
                  className={`border p-md rounded-md bg-white flex items-center justify-between hover:border-primary hover:shadow-md transition-all cursor-pointer group ${
                    selectedColdLeads.includes(c.id) ? 'border-primary ring-1 ring-primary/20 bg-primary/[0.01]' : 'border-outline-variant'
                  }`}
                >
                  <div className="flex items-center gap-sm">
                    <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-primary/10 group-hover:text-primary transition-all">
                      <span className="material-symbols-outlined text-[20px]" data-icon="person">person</span>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 truncate w-32">{c.name}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 bg-slate-100 text-slate-600 text-[9px] font-bold rounded">{c.type}</span>
                        <span className="text-[10px] text-slate-400 font-data-mono">{c.id}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
                    <span className="px-2 py-0.5 bg-red-50 text-red-600 text-[9px] font-extrabold rounded-full flex items-center gap-0.5">
                      <span className="w-1 h-1 rounded-full bg-red-500 animate-ping"></span>
                      Cold
                    </span>
                    <p className="text-[10px] text-slate-400">Last called {c.lastCalled}</p>
                    <input 
                      className="rounded border-outline-variant text-primary focus:ring-primary w-4 h-4 cursor-pointer mt-1" 
                      type="checkbox"
                      checked={selectedColdLeads.includes(c.id)}
                      onChange={() => handleSelectColdLead(c.id)}
                    />
                  </div>
                </div>
              ))}

              <div 
                onClick={handleLoadMoreCold}
                className="border border-outline-variant p-md rounded-md bg-white border-dashed flex flex-col items-center justify-center text-outline text-xs font-bold cursor-pointer hover:border-primary hover:text-primary hover:bg-primary/[0.02] hover:shadow-xs transition-all h-[76px]"
              >
                <span className="material-symbols-outlined text-[20px] mb-0.5" data-icon="add_circle">add_circle</span>
                <span>Load More Cold Leads</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Create New Lead Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-md shadow-2xl w-[450px] border border-outline-variant max-w-full">
            <h3 className="text-sm font-extrabold uppercase mb-4 text-primary">Create New Lead</h3>
            <form onSubmit={handleCreateLead} className="space-y-4">
              <div>
                <label className="block text-[11px] font-bold text-outline uppercase mb-1">Lead Name</label>
                <input 
                  type="text" 
                  value={newLeadName}
                  onChange={(e) => setNewLeadName(e.target.value)}
                  className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary"
                  placeholder="e.g. Agarwal Roadlines"
                  required
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-outline uppercase mb-1">Mobile</label>
                <input 
                  type="text" 
                  value={newLeadMobile}
                  onChange={(e) => setNewLeadMobile(e.target.value)}
                  className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary"
                  placeholder="e.g. +91 99887-76655"
                  required
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-bold text-outline uppercase mb-1">Type</label>
                  <select 
                    value={newLeadType}
                    onChange={(e) => setNewLeadType(e.target.value as any)}
                    className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="FM">FM</option>
                    <option value="DR">DR</option>
                    <option value="TR">TR</option>
                    <option value="EC">EC</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-outline uppercase mb-1">Status</label>
                  <select 
                    value={newLeadStatus}
                    onChange={(e) => setNewLeadStatus(e.target.value as any)}
                    className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary"
                  >
                    <option value="HOT">HOT</option>
                    <option value="WARM">WARM</option>
                    <option value="COLD">COLD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-[11px] font-bold text-outline uppercase mb-1">Process</label>
                <select 
                  value={newLeadProcess}
                  onChange={(e) => setNewLeadProcess(e.target.value)}
                  className="w-full border border-outline-variant rounded p-2 text-xs focus:outline-none focus:border-primary"
                >
                  <option value="Vendor Onboarding">Vendor Onboarding</option>
                  <option value="KYC Verification">KYC Verification</option>
                  <option value="RTO Check">RTO Check</option>
                  <option value="Direct Load Booking">Direct Load Booking</option>
                  <option value="Account Setup">Account Setup</option>
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="border border-outline-variant text-outline px-4 py-2 rounded text-xs hover:bg-surface-container-high transition-colors font-bold uppercase"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-primary text-white px-4 py-2 rounded text-xs hover:bg-primary-container transition-colors font-bold uppercase"
                >
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default Page04LeadManagement;
