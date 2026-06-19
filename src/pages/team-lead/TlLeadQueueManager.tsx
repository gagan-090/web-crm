import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface LeadItem {
  id: string;
  tmid: string;
  name: string;
  phone: string;
  type: string;
  status: string;
  slaRemaining: string;
  slaPercent: number; // 0 to 100
  agent: string;
  tabs: string[]; // e.g. ['all', 'overdue', 'nr2']
}

export const TlLeadQueueManager: React.FC = () => {
  const navigate = useNavigate();
  const [tlMode, setTlMode] = useState<'dw' | 'tr-mm'>('dw');
  const [activeTab, setActiveTab] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLeads, setSelectedLeads] = useState<string[]>([]);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modal / Drawer States
  const [showOverrideModal, setShowOverrideModal] = useState(false);
  const [overrideAction, setOverrideAction] = useState<'reassign' | 'funnel' | 'cold'>('reassign');
  const [targetAgent, setTargetAgent] = useState('');
  const [priority, setPriority] = useState<'Low' | 'High' | 'Urgent'>('High');
  const [auditReason, setAuditReason] = useState('');

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Mock leads data
  const [dwLeads, setDwLeads] = useState<LeadItem[]>([
    { id: 'dw1', tmid: 'DR-48291', name: 'Suresh Yadav', phone: '+91 98765 43210', type: 'Express Freight', status: 'No Response', slaRemaining: 'EXPIRED', slaPercent: 100, agent: 'Rahul S.', tabs: ['all', 'overdue'] },
    { id: 'dw2', tmid: 'DR-48292', name: 'Amit Singh', phone: '+91 88765 43211', type: 'Cold Chain', status: 'No Response (2)', slaRemaining: '2h 15m', slaPercent: 85, agent: 'Sonia R.', tabs: ['all', 'nr2'] },
    { id: 'dw3', tmid: 'DR-48293', name: 'Ramesh Kumar', phone: '+91 78765 43212', type: 'Market Load', status: 'In Funnel', slaRemaining: '14h 22m', slaPercent: 40, agent: 'Aman K.', tabs: ['all', 'funnel'] },
    { id: 'dw4', tmid: 'DR-48294', name: 'Vikram Rathore', phone: '+91 68765 43213', type: 'Container Pack', status: 'Callback', slaRemaining: '4h 05m', slaPercent: 75, agent: 'Priya P.', tabs: ['all', 'callbacks'] },
    { id: 'dw5', tmid: 'DR-48295', name: 'Karan Johar', phone: '+91 99999 88888', type: 'Local Delivery', status: 'Cold Lead', slaRemaining: 'EXPIRED', slaPercent: 100, agent: 'Unassigned', tabs: ['all', 'cold'] },
    { id: 'dw6', tmid: 'DR-48296', name: 'Devendra Pal', phone: '+91 98234 11223', type: 'Express Freight', status: 'No Response (2)', slaRemaining: '1h 30m', slaPercent: 90, agent: 'Rahul S.', tabs: ['all', 'nr2'] },
    { id: 'dw7', tmid: 'DR-48297', name: 'Harpreet Singh', phone: '+91 91112 23344', type: 'Market Load', status: 'Callback', slaRemaining: '0h 45m', slaPercent: 95, agent: 'Sonia R.', tabs: ['all', 'callbacks', 'overdue'] }
  ]);

  const [trLeads, setTrLeads] = useState<LeadItem[]>([
    { id: 'tr1', tmid: 'TR-12094', name: 'Agrawal Global', phone: '+91 91234 56789', type: 'Super Premium Transporter', status: 'No Response', slaRemaining: 'EXPIRED', slaPercent: 100, agent: 'Alex R.', tabs: ['all', 'overdue'] },
    { id: 'tr2', tmid: 'TR-12095', name: 'Kunal Logistics', phone: '+91 92234 56790', type: 'Premium Transporter', status: 'No Response (2)', slaRemaining: '1h 45m', slaPercent: 88, agent: 'Sarah C.', tabs: ['all', 'nr2'] },
    { id: 'tr3', tmid: 'TR-12096', name: 'Sharma Logistics', phone: '+91 93234 56791', type: 'Standard Transporter', status: 'In Funnel', slaRemaining: '12h 10m', slaPercent: 45, agent: 'Marcus T.', tabs: ['all', 'funnel'] },
    { id: 'tr4', tmid: 'TR-12097', name: 'Gati Agent Delhi', phone: '+91 94234 56792', type: 'Super Premium Transporter', status: 'Callback', slaRemaining: '3h 30m', slaPercent: 80, agent: 'Elena R.', tabs: ['all', 'callbacks'] },
    { id: 'tr5', tmid: 'TR-12098', name: 'VRL Logistics Hub', phone: '+91 95234 56793', type: 'Standard Transporter', status: 'Cold Lead', slaRemaining: 'EXPIRED', slaPercent: 100, agent: 'Unassigned', tabs: ['all', 'cold'] },
    { id: 'tr6', tmid: 'TR-12099', name: 'Spot Matchmaking Job', phone: '+91 98888 77777', type: 'Matchmaking Job', status: 'SLA Risk', slaRemaining: '0h 18m', slaPercent: 98, agent: 'Rohit K.', tabs: ['all', 'overdue'] }
  ]);

  const currentLeads = tlMode === 'dw' ? dwLeads : trLeads;
  const setLeads = tlMode === 'dw' ? setDwLeads : setTrLeads;

  // Filter and Search
  const filteredLeads = currentLeads.filter(lead => {
    const matchesTab = activeTab === 'all' || lead.tabs.includes(activeTab);
    const matchesSearch = lead.tmid.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          lead.phone.includes(searchQuery);
    return matchesTab && matchesSearch;
  });

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedLeads(filteredLeads.map(l => l.id));
    } else {
      setSelectedLeads([]);
    }
  };

  const handleSelectOne = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedLeads(prev => [...prev, id]);
    } else {
      setSelectedLeads(prev => prev.filter(item => item !== id));
    }
  };

  // Open override action
  const handleOpenOverride = (action: 'reassign' | 'funnel' | 'cold') => {
    if (selectedLeads.length === 0) {
      triggerToast('Please select at least one lead first');
      return;
    }
    setOverrideAction(action);
    setAuditReason('');
    setTargetAgent('');
    setShowOverrideModal(true);
  };

  // Confirm override
  const handleConfirmOverride = (e: React.FormEvent) => {
    e.preventDefault();
    if (!auditReason.trim()) {
      triggerToast('Audit reason is required for manual override actions.');
      return;
    }
    if (overrideAction === 'reassign' && !targetAgent) {
      triggerToast('Please select a target agent for reassignment.');
      return;
    }

    setLeads(prev => prev.map(lead => {
      if (selectedLeads.includes(lead.id)) {
        if (overrideAction === 'reassign') {
          return { ...lead, agent: targetAgent };
        } else if (overrideAction === 'funnel') {
          return { ...lead, status: 'In Funnel', tabs: [...lead.tabs.filter(t => t !== 'cold'), 'funnel'] };
        } else if (overrideAction === 'cold') {
          return { ...lead, status: 'Cold Lead', agent: 'Unassigned', tabs: [...lead.tabs.filter(t => t !== 'funnel' && t !== 'overdue'), 'cold'] };
        }
      }
      return lead;
    }));

    const count = selectedLeads.length;
    setSelectedLeads([]);
    setShowOverrideModal(false);
    triggerToast(`Successfully processed ${count} leads (${overrideAction.toUpperCase()}). Audit logged ✓`);
  };

  // Count tab badges
  const getTabCount = (tab: string) => {
    if (tab === 'all') return currentLeads.length;
    return currentLeads.filter(l => l.tabs.includes(tab)).length;
  };

  return (
    <main className="flex flex-col h-[calc(100vh-60px)] bg-white overflow-hidden relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#F39C12]"></span>
          {toastMessage}
        </div>
      )}

      {/* Header controls strip */}
      <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">TL Lead Queue Manager</h1>
            <p className="text-[10px] text-gray-400">Search, filter, reassign, and override telecalling lead pipelines</p>
          </div>
          
          {/* TMID Search */}
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search by TMID, Name..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white border border-gray-200 rounded-lg text-xs w-52 focus:outline-none focus:border-[#F39C12] text-gray-800"
            />
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-sm">search</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode Switcher */}
          <button
            onClick={() => {
              const nextMode = tlMode === 'dw' ? 'tr-mm' : 'dw';
              setTlMode(nextMode);
              setActiveTab('all');
              setSelectedLeads([]);
              triggerToast(`Switched queue to ${nextMode === 'dw' ? 'Driver Welcome' : 'Transporter + Matchmaking'}`);
            }}
            className="bg-white border border-gray-200 hover:border-[#F39C12] text-gray-700 px-3 py-1 rounded-lg text-xs font-bold shadow-sm transition-all flex items-center gap-1"
          >
            <span className="material-symbols-outlined text-sm">swap_horiz</span>
            <span>Mode: {tlMode === 'dw' ? 'Driver Welcome' : 'Transporter+MM'}</span>
          </button>

          {/* Special Toggle for TR+MM */}
          {tlMode === 'tr-mm' && (
            <button
              onClick={() => navigate('/mm/tl-matchmaking-job-board')}
              className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-xs font-bold shadow flex items-center gap-1.5"
            >
              <span className="material-symbols-outlined text-sm">kanban</span>
              <span>Matchmaking Job Board →</span>
            </button>
          )}
        </div>
      </div>

      {/* Main content grid */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Side: Priority Tabs and Main Table */}
        <div className="flex-1 flex flex-col overflow-hidden border-r border-gray-200">
          
          {/* Priority Tabs */}
          <div className="px-4 bg-gray-50/50 border-b border-gray-200 flex gap-4 overflow-x-auto scrollbar-hide shrink-0 text-xs">
            {[
              { id: 'all', label: 'All Leads' },
              { id: 'overdue', label: 'Overdue (>3 days)' },
              { id: 'nr2', label: 'NR × 2' },
              { id: 'funnel', label: 'Funnel Escalations' },
              { id: 'callbacks', label: 'Callbacks Today' },
              { id: 'cold', label: 'Cold Archive' }
            ].map(tab => {
              const isActive = activeTab === tab.id;
              const count = getTabCount(tab.id);
              const isCrit = (tab.id === 'overdue' || tab.id === 'funnel') && count > 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => { setActiveTab(tab.id); setSelectedLeads([]); }}
                  className={`py-3 border-b-2 font-bold flex items-center gap-1 whitespace-nowrap transition-colors ${
                    isActive ? 'border-[#F39C12] text-gray-800' : 'border-transparent text-gray-400 hover:text-gray-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
                    isActive ? 'bg-[#F39C12]/15 text-[#D35400]' : 
                    isCrit ? 'bg-red-100 text-red-700 animate-pulse' : 'bg-gray-200 text-gray-500'
                  }`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Table Container */}
          <div className="flex-1 overflow-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead className="sticky top-0 bg-white shadow-sm z-10">
                <tr className="border-b border-gray-200 text-gray-400 font-bold uppercase text-[9px]">
                  <th className="p-3 pl-4">
                    <input 
                      type="checkbox" 
                      checked={filteredLeads.length > 0 && selectedLeads.length === filteredLeads.length}
                      onChange={handleSelectAll}
                      className="rounded border-gray-300 text-[#F39C12] focus:ring-[#F39C12]"
                    />
                  </th>
                  <th className="p-3">TMID / Lead Details</th>
                  <th className="p-3">Category/Type</th>
                  <th className="p-3">Current Status</th>
                  <th className="p-3">SLA Remaining</th>
                  <th className="p-3">Assigned Agent</th>
                  <th className="p-3 text-right pr-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-150 text-gray-700 font-medium">
                {filteredLeads.map(lead => {
                  const isChecked = selectedLeads.includes(lead.id);
                  const isExpired = lead.slaRemaining === 'EXPIRED';
                  const isUrgent = lead.slaPercent >= 90;

                  return (
                    <tr 
                      key={lead.id}
                      className={`hover:bg-gray-50/50 transition-colors ${isChecked ? 'bg-orange-50/30' : ''}`}
                    >
                      <td className="p-3 pl-4">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={(e) => handleSelectOne(lead.id, e.target.checked)}
                          className="rounded border-gray-300 text-[#F39C12] focus:ring-[#F39C12]"
                        />
                      </td>
                      <td className="p-3">
                        <div className="flex flex-col">
                          <span className="font-extrabold text-gray-800 text-xs">{lead.name}</span>
                          <span className="text-[10px] text-gray-400 font-mono mt-0.5">{lead.tmid} · {lead.phone}</span>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-gray-500">{lead.type}</td>
                      <td className="p-3">
                        <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                          lead.status.includes('No Response') ? 'bg-amber-50 text-amber-700 border-amber-200' :
                          lead.status.includes('Funnel') ? 'bg-purple-50 text-purple-700 border-purple-200' :
                          lead.status.includes('Callback') ? 'bg-blue-50 text-blue-700 border-blue-200' :
                          lead.status.includes('Risk') ? 'bg-red-50 text-red-700 border-red-200 animate-pulse' :
                          'bg-gray-100 text-gray-600 border-gray-200'
                        }`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="p-3 w-32">
                        <div className="flex flex-col gap-0.5">
                          <span className={`font-bold font-mono text-[10px] ${isExpired || isUrgent ? 'text-red-600' : 'text-gray-500'}`}>
                            {lead.slaRemaining}
                          </span>
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${isExpired || isUrgent ? 'bg-red-500' : 'bg-green-500'}`}
                              style={{ width: `${lead.slaPercent}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold text-gray-700">
                        {lead.agent === 'Unassigned' ? (
                          <span className="text-red-500 italic bg-red-50 px-1 py-0.2 rounded font-bold text-[10px]">UNASSIGNED</span>
                        ) : lead.agent}
                      </td>
                      <td className="p-3 text-right pr-4">
                        <button 
                          onClick={() => { setSelectedLeads([lead.id]); handleOpenOverride('reassign'); }}
                          className="text-[#F39C12] hover:underline font-bold text-[10.5px]"
                        >
                          Manual Assign
                        </button>
                      </td>
                    </tr>
                  );
                })}
                {filteredLeads.length === 0 && (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-gray-400 italic">No leads match your active filters or search terms.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Bulk Actions Panel (active when items selected) */}
          <div className={`p-4 bg-gray-900 text-white flex justify-between items-center transition-all duration-300 shrink-0 ${
            selectedLeads.length > 0 ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0 h-0 p-0 overflow-hidden'
          }`}>
            <span className="text-xs font-bold">
              ⚡ {selectedLeads.length} leads selected for bulk operations
            </span>
            <div className="flex gap-2 text-xs">
              <button 
                onClick={() => handleOpenOverride('reassign')}
                className="bg-[#F39C12] hover:bg-[#e08e0b] text-white px-3.5 py-1.5 rounded-lg font-bold shadow-sm"
              >
                Reassign Leads
              </button>
              <button 
                onClick={() => handleOpenOverride('funnel')}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3.5 py-1.5 rounded-lg font-bold shadow-sm"
              >
                Move to Funnel
              </button>
              <button 
                onClick={() => handleOpenOverride('cold')}
                className="bg-gray-700 hover:bg-gray-600 text-gray-200 px-3.5 py-1.5 rounded-lg font-bold shadow-sm"
              >
                Mark Cold
              </button>
              <button 
                onClick={() => setSelectedLeads([])}
                className="text-gray-400 hover:text-white px-2 py-1.5 font-bold"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Right Sidebar: Re-activation Campaigns Info Panel */}
        <aside className="w-[300px] bg-gray-50/50 p-4 flex flex-col justify-between shrink-0 overflow-y-auto">
          <div className="space-y-4">
            <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide flex items-center gap-1.5 border-b border-gray-200 pb-2">
              <span className="material-symbols-outlined text-[#F39C12] text-[18px]">restart_alt</span>
              Re-activation Campaign
            </h3>

            <div className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm space-y-3">
              <p className="text-[11px] text-gray-400 leading-normal">
                Re-activation campaigns queue up inactive or cold leads for automatic WhatsApp messaging or recycle dialing.
              </p>

              <div className="space-y-2 text-xs">
                <div className="p-2.5 bg-gray-50 border border-gray-150 rounded">
                  <div className="flex justify-between items-center mb-1 font-bold">
                    <span className="text-gray-700">Cold Leads Re-run</span>
                    <span className="bg-orange-100 text-[#D35400] text-[9px] px-1 py-0.2 rounded">DW TODAY</span>
                  </div>
                  <div className="text-[10px] text-gray-400">42 cold driver records scheduled.</div>
                  <div className="w-full bg-gray-200 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-[#F39C12] h-full" style={{ width: '60%' }}></div>
                  </div>
                </div>

                <div className="p-2.5 bg-gray-50 border border-gray-150 rounded">
                  <div className="flex justify-between items-center mb-1 font-bold">
                    <span className="text-gray-700">Dormant Transporter Ping</span>
                    <span className="bg-purple-100 text-purple-700 text-[9px] px-1 py-0.2 rounded">TR WEEKLY</span>
                  </div>
                  <div className="text-[10px] text-gray-400">15 inactive shippers set for WhatsApp.</div>
                  <div className="w-full bg-gray-200 h-1 rounded-full mt-2 overflow-hidden">
                    <div className="bg-purple-600 h-full" style={{ width: '30%' }}></div>
                  </div>
                </div>
              </div>

              <button 
                onClick={() => triggerToast('Triggering campaign re-run for cold leads...')}
                className="w-full bg-gray-100 hover:bg-[#F39C12] hover:text-white border border-gray-200 hover:border-[#F39C12] text-gray-600 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm"
              >
                Trigger Campagin Re-run
              </button>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="relative h-20 w-full rounded-lg overflow-hidden border border-gray-200 bg-white">
              <div className="bg-cover bg-center w-full h-full opacity-40" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCeOkcztyfrttcb5XGRAt54b94oA7CzkqGBTD05YAqJJBLrZJa9RJGiNVWhQSngRjB9d-g6XQQ-DqVFpKt9OyCMwWLy7VwLbcbqpQlXojl5osK5hW_cu8vsYftreSlDV1V3_Z1Z8BOaPifEnTOCVio23VMOygc-g2azUZqvasRTWxg4cXUxaXd0h45GDu3JTLZu2IRMgXXZ76xubqJtSp7wLzFGzAKXlceUBpaUSBIIOIzjaFLJAwSJl8EqJNJ6GH_sAfae_Cza9eY')" }}></div>
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-2">
                <span className="text-[10px] font-extrabold uppercase text-gray-700 tracking-wider">Queue Allocation Engine</span>
                <span className="text-[9px] text-gray-400 mt-1">Manual overrides bypass automatic round-robin limits.</span>
              </div>
            </div>
          </div>
        </aside>
      </div>

      {/* OVERRIDE FORM MODAL (Frictionful audit reason enforced) */}
      {showOverrideModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100 text-xs">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-orange-600">security_update_warning</span>
              Manual Queue Override
            </h3>

            <form onSubmit={handleConfirmOverride} className="space-y-4">
              <div className="p-2.5 bg-orange-50/50 border border-orange-100 rounded text-gray-600 leading-normal">
                Applying action: <span className="font-bold text-[#D35400] uppercase">{overrideAction}</span> on <span className="font-bold">{selectedLeads.length} selected leads</span>.
              </div>

              {overrideAction === 'reassign' && (
                <>
                  <div>
                    <label className="text-gray-500 block mb-1 font-semibold">Select Target Agent</label>
                    <select 
                      value={targetAgent}
                      onChange={(e) => setTargetAgent(e.target.value)}
                      required
                      className="w-full border border-gray-200 rounded px-2.5 py-1.5 bg-white outline-none font-semibold text-gray-800"
                    >
                      <option value="">Select Agent...</option>
                      {tlMode === 'dw' ? (
                        <>
                          <option value="Rahul S.">Rahul S. (Primary)</option>
                          <option value="Sonia R.">Sonia R. (Primary)</option>
                          <option value="Aman K.">Aman K. (Primary)</option>
                          <option value="Priya P.">Priya P. (Primary)</option>
                          <option value="Vikram A.">Vikram A. (Backup)</option>
                        </>
                      ) : (
                        <>
                          <option value="Alex R.">Alex R. (Primary TR)</option>
                          <option value="Sarah C.">Sarah C. (Primary TR)</option>
                          <option value="Marcus T.">Marcus T. (Primary TR)</option>
                          <option value="Rohit K.">Rohit K. (Matchmaking)</option>
                        </>
                      )}
                    </select>
                  </div>

                  <div>
                    <label className="text-gray-500 block mb-1 font-semibold">Reassignment Priority</label>
                    <div className="flex gap-2">
                      {['Low', 'High', 'Urgent'].map(p => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => setPriority(p as any)}
                          className={`flex-1 py-1.5 border rounded-lg font-bold transition-colors ${
                            priority === p 
                              ? 'bg-orange-50 text-[#D35400] border-[#F39C12]' 
                              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Manual Action Audit Remark</label>
                <textarea 
                  value={auditReason}
                  onChange={(e) => setAuditReason(e.target.value)}
                  required
                  placeholder="Type the justification for this override (required)..."
                  rows={3}
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 outline-none font-medium text-gray-800 resize-none"
                />
                <span className="text-[10px] text-gray-400 block mt-1">Audit log records your supervisor ID, date, and remark.</span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button 
                  type="button" 
                  onClick={() => setShowOverrideModal(false)}
                  className="px-4 py-2 border border-gray-200 text-gray-500 rounded font-bold hover:bg-gray-100 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-[#F39C12] hover:bg-[#e08e0b] text-white rounded font-bold shadow-sm"
                >
                  Confirm Override
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </main>
  );
};

export default TlLeadQueueManager;
