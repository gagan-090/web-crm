import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface CallHistory {
  date: string;
  duration: string;
  status: string;
  caller: string;
}

interface Lead {
  id: string;
  tmid: string;
  name: string;
  phone: string;
  city: string;
  state: string;
  registeredDaysAgo: number;
  attempts: ('nr' | 'connected' | 'empty')[];
  lastStatus: string;
  vehicleType: string;
  licenseType: string;
  experience: string;
  preferredRoute: string;
  subscribed: boolean;
  whatsapp: boolean;
  history: CallHistory[];
  notes: string;
}

export const DwCallQueue: React.FC = () => {
  const navigate = useNavigate();

  // Mock Leads Data conforming to Spec
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'L1',
      tmid: 'DR-48291',
      name: 'Suresh Yadav',
      phone: '+91-98765-43210',
      city: 'Agra',
      state: 'Uttar Pradesh',
      registeredDaysAgo: 2,
      attempts: ['nr', 'nr', 'empty'],
      lastStatus: 'NR',
      vehicleType: 'Heavy Truck',
      licenseType: 'HMV',
      experience: '6 years',
      preferredRoute: 'Delhi–Agra',
      subscribed: false,
      whatsapp: true,
      notes: 'Wants to check contract details. Try calling before 12 PM.',
      history: [
        { date: '17 Jun, 10:42 AM', duration: '2m 14s', status: 'NR', caller: 'You' },
        { date: '17 Jun, 9:15 AM', duration: '0m 0s', status: 'Switch Off', caller: 'You' }
      ]
    },
    {
      id: 'L2',
      tmid: 'DR-48292',
      name: 'Rajesh Kumar',
      phone: '+91-98123-45678',
      city: 'Bhiwandi',
      state: 'Maharashtra',
      registeredDaysAgo: 4, // >3 days -> Red border / funnel escalation
      attempts: ['nr', 'nr', 'nr'],
      lastStatus: 'NR',
      vehicleType: 'Tata Ace',
      licenseType: 'LMV',
      experience: '3 years',
      preferredRoute: 'Mumbai–Pune',
      subscribed: true,
      whatsapp: true,
      notes: 'Subscribed but has not uploaded DL yet.',
      history: [
        { date: '16 Jun, 11:20 AM', duration: '1m 05s', status: 'NR', caller: 'You' },
        { date: '15 Jun, 2:30 PM', duration: '0m 0s', status: 'Busy', caller: 'You' },
        { date: '15 Jun, 9:00 AM', duration: '0m 0s', status: 'Switch Off', caller: 'You' }
      ]
    },
    {
      id: 'L3',
      tmid: 'DR-48293',
      name: 'Amit Singh',
      phone: '+91-88888-88888',
      city: 'Patna',
      state: 'Bihar',
      registeredDaysAgo: 0, // fresh -> Blue border
      attempts: ['empty', 'empty', 'empty'],
      lastStatus: '',
      vehicleType: 'E-Rickshaw Cargo',
      licenseType: 'LMV',
      experience: '2 years',
      preferredRoute: 'Patna Local',
      subscribed: false,
      whatsapp: false,
      notes: '',
      history: []
    },
    {
      id: 'L4',
      tmid: 'DR-48294',
      name: 'Mahendra Singh',
      phone: '+91-77777-77777',
      city: 'Jaipur',
      state: 'Rajasthan',
      registeredDaysAgo: 1, // Callback scheduled for today -> Green border
      attempts: ['connected', 'empty', 'empty'],
      lastStatus: 'Callback Requested',
      vehicleType: 'Heavy Truck',
      licenseType: 'HMV',
      experience: '8 years',
      preferredRoute: 'Jaipur–Delhi',
      subscribed: false,
      whatsapp: true,
      notes: 'Call back to finalize Verified Plan setup.',
      history: [
        { date: '18 Jun, 4:00 PM', duration: '4m 12s', status: 'Connected', caller: 'You' }
      ]
    }
  ]);

  // UI States
  const [selectedId, setSelectedId] = useState<string>('L1');
  const [activeTab, setActiveTab] = useState<'all' | 'fresh' | 'callbacks' | 'nr' | 'funnel'>('all');
  const [sortBy, setSortBy] = useState<'oldest' | 'callbacks' | 'sla'>('oldest');
  const [backupMode, setBackupMode] = useState<boolean>(true);
  const [toast, setToast] = useState<string | null>(null);
  
  // Note auto-save states
  const [notesText, setNotesText] = useState<string>('');
  const [saveTimestamp, setSaveTimestamp] = useState<string>('');
  const saveTimerRef = useRef<any | null>(null);

  const selectedLead = leads.find(l => l.id === selectedId) || leads[0];

  // Sync notes when selected lead changes
  useEffect(() => {
    if (selectedLead) {
      setNotesText(selectedLead.notes);
      setSaveTimestamp('');
    }
  }, [selectedId]);

  // Auto-save logic (5s after typing stops)
  const handleNotesChange = (val: string) => {
    setNotesText(val);
    
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      setLeads(prevLeads =>
        prevLeads.map(l => (l.id === selectedLead.id ? { ...l, notes: val } : l))
      );
      const now = new Date();
      setSaveTimestamp(`Saved at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Helper for left border color
  const getBorderColorClass = (l: Lead) => {
    if (l.lastStatus === 'Callback Requested' || l.id === 'L4') {
      return 'border-[#27AE60]'; // Green
    }
    if (l.registeredDaysAgo > 3) {
      return 'border-[#E74C3C]'; // Red (registered >3 days)
    }
    const nrCount = l.attempts.filter(a => a === 'nr').length;
    if (nrCount >= 2) {
      return 'border-[#F29C12]'; // Orange
    }
    if (l.attempts.every(a => a === 'empty')) {
      return 'border-[#3498DB]'; // Blue
    }
    return 'border-gray-200';
  };

  // Filter & Sort Logic
  const getFilteredLeads = () => {
    let result = [...leads];

    // Filter
    if (activeTab === 'fresh') {
      result = result.filter(l => l.registeredDaysAgo <= 1 && l.attempts.length === 0);
    } else if (activeTab === 'callbacks') {
      result = result.filter(l => l.lastStatus === 'Callback Requested');
    } else if (activeTab === 'nr') {
      result = result.filter(l => l.attempts.includes('nr'));
    } else if (activeTab === 'funnel') {
      result = result.filter(l => l.registeredDaysAgo > 3);
    }

    // Sort
    if (sortBy === 'oldest') {
      result.sort((a, b) => b.registeredDaysAgo - a.registeredDaysAgo);
    } else if (sortBy === 'callbacks') {
      result.sort((a, b) => {
        const aVal = a.lastStatus === 'Callback Requested' ? 1 : 0;
        const bVal = b.lastStatus === 'Callback Requested' ? 1 : 0;
        return bVal - aVal;
      });
    } else if (sortBy === 'sla') {
      // SLA order: days in queue descending
      result.sort((a, b) => b.registeredDaysAgo - a.registeredDaysAgo);
    }

    return result;
  };

  const filteredLeads = getFilteredLeads();

  // Active call trigger
  const handleCallNow = (lead: Lead) => {
    navigate('/dw/dw-active-call-focus', {
      state: {
        leadId: lead.id,
        tmid: lead.tmid,
        name: lead.name,
        phone: lead.phone,
        location: `${lead.city}, ${lead.state}`,
        vehicleType: lead.vehicleType,
        licenseType: lead.licenseType,
        experience: lead.experience,
        preferredRoute: lead.preferredRoute,
        subscribed: lead.subscribed,
        whatsapp: lead.whatsapp,
        history: lead.history
      }
    });
  };

  return (
    <main className="h-[calc(100vh-80px)] flex bg-white overflow-hidden border border-gray-200 rounded-xl relative">
      
      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#27AE60]"></span>
          {toast}
        </div>
      )}

      {/* Left Panel - Staging Call Queue */}
      <section className="w-[380px] border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0">
        
        {/* Backup Mode Banner */}
        {backupMode && (
          <div className="bg-[#FFF9E6] border-b border-[#F2C94C] px-3 py-1.5 text-[11px] text-[#D35400] font-semibold flex justify-between items-center shrink-0">
            <span>⚠️ BACKUP MODE — Handling overflow from primary queue</span>
            <button onClick={() => setBackupMode(false)} className="hover:text-black font-bold">×</button>
          </div>
        )}

        {/* Tab & Sort Header */}
        <div className="p-3 border-b border-gray-200 shrink-0 bg-white">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Queue Routing</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-400">Sort:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[11px] font-semibold text-gray-700 border-none outline-none cursor-pointer focus:ring-0 p-0"
              >
                <option value="oldest">Oldest First</option>
                <option value="callbacks">Callbacks First</option>
                <option value="sla">SLA First</option>
              </select>
            </div>
          </div>

          {/* Filter Tab Row */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: `All (${leads.length})` },
              { id: 'fresh', label: 'Fresh (1)' },
              { id: 'callbacks', label: 'Callbacks (1)' },
              { id: 'nr', label: 'NR (2)' },
              { id: 'funnel', label: 'Funnel (1)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#27AE60] text-white border-[#27AE60]'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lead List Area */}
        <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-gray-100">
          {filteredLeads.length > 0 ? (
            filteredLeads.map(l => (
              <div 
                key={l.id}
                onClick={() => setSelectedId(l.id)}
                className={`p-3 cursor-pointer flex border-l-4 transition-all relative ${getBorderColorClass(l)} ${
                  l.id === selectedId ? 'bg-[#EAFAF1]/30 font-medium' : 'bg-white hover:bg-gray-50'
                }`}
              >
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-gray-900 truncate">{l.name}</span>
                    <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-1 rounded">{l.tmid}</span>
                  </div>
                  
                  <div className="text-[12px] text-gray-500 mt-0.5">{l.city}, {l.state}</div>

                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-[11px] text-gray-400">
                      {l.registeredDaysAgo === 0 ? 'Registered today' : `Registered: ${l.registeredDaysAgo} days ago`}
                    </span>
                    
                    {/* Attempt dots */}
                    <div className="flex gap-1">
                      {l.attempts.map((att, i) => (
                        <span 
                          key={i} 
                          className={`w-2.5 h-2.5 rounded-full border ${
                            att === 'nr' ? 'bg-red-500 border-red-500' :
                            att === 'connected' ? 'bg-[#27AE60] border-[#27AE60]' :
                            'bg-transparent border-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Last Status Tag */}
                  {l.lastStatus && (
                    <div className="mt-2 text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                      Last: {l.lastStatus}
                    </div>
                  )}
                </div>

                <div className="flex flex-col justify-center">
                  <button 
                    onClick={(e) => { e.stopPropagation(); handleCallNow(l); }}
                    className="w-8 h-8 rounded-full bg-[#27AE60] hover:bg-[#219653] text-white flex items-center justify-center shadow transition-transform active:scale-95"
                    title="Call Lead"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs italic">
              Queue clear for today. New leads arrive from 9 AM tomorrow.
            </div>
          )}
        </div>
      </section>

      {/* Right Panel - Lead details profile cockpit */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
        
        {/* Detail Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Header block */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{selectedLead.name}</h1>
                <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{selectedLead.tmid}</span>
                <span className="border border-[#27AE60] text-[#27AE60] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  DRIVER
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">{selectedLead.city}, {selectedLead.state}</div>
            </div>
            
            {/* WhatsApp Status Chip */}
            <div>
              {selectedLead.whatsapp ? (
                <span className="bg-[#EAFAF1] text-[#27AE60] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#27AE60]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60]"></span> Has WhatsApp ✓
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-400 text-xs font-semibold px-2.5 py-1 rounded-full">
                  No WhatsApp recorded
                </span>
              )}
            </div>
          </div>

          {/* Subscription Status Badge */}
          <div className="w-full">
            {selectedLead.subscribed ? (
              <div className="bg-[#EAFAF1] border border-[#27AE60]/20 text-[#27AE60] p-3 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                <span>SUBSCRIBED: VERIFIED PLAN</span>
                <span>Verified ₹299 — expires 12 Sep 2026</span>
              </div>
            ) : (
              <div className="bg-[#FDEDEC] border border-red-100 text-[#C0392B] p-3 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                <span>NOT SUBSCRIBED</span>
                <span className="uppercase text-[10px] bg-red-100 px-1.5 py-0.5 rounded">Conversion Target Pending</span>
              </div>
            )}
          </div>

          {/* Profile Card key-value grid */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Driver Profile</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">Vehicle Type</span>
                <span className="font-bold text-gray-800 mt-0.5 block">{selectedLead.vehicleType}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">License Type</span>
                <span className="font-bold text-gray-800 mt-0.5 block">{selectedLead.licenseType}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">Experience</span>
                <span className="font-bold text-gray-800 mt-0.5 block">{selectedLead.experience}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">Preferred Route</span>
                <span className="font-bold text-gray-800 mt-0.5 block">{selectedLead.preferredRoute}</span>
              </div>
            </div>
          </div>

          {/* History and Notes Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">history</span> Call History Timeline
              </h3>
              
              <div className="border border-gray-200 rounded-xl p-4 bg-white max-h-[250px] overflow-y-auto divide-y divide-gray-100">
                {selectedLead.history.length > 0 ? (
                  selectedLead.history.map((hist, idx) => (
                    <div key={idx} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                      <div className="flex justify-between items-center mb-1 font-semibold">
                        <span className="text-gray-800">{hist.date} — {hist.duration}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                          hist.status === 'Connected' ? 'bg-[#EAFAF1] text-[#27AE60]' : 'bg-red-50 text-red-500'
                        }`}>
                          {hist.status}
                        </span>
                      </div>
                      <p className="text-gray-500">Caller: {hist.caller}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic text-center py-4">No previous calls — this will be the first attempt.</p>
                )}
              </div>
            </div>

            {/* Note Editor */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">notes</span> Lead Notes
              </h3>
              
              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-col relative min-h-[140px]">
                <textarea
                  value={notesText}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="Type notes here... Auto-saves 5s after typing stops."
                  className="flex-grow w-full border-none p-0 focus:ring-0 text-xs resize-none outline-none placeholder:text-gray-400 min-h-[100px]"
                />
                <div className="text-[10px] text-gray-400 text-right mt-1 italic select-none">
                  {saveTimestamp || 'All changes saved'}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Bottom Fixed Action Bar */}
        <div className="border-t border-gray-200 bg-white p-4 flex flex-wrap justify-between items-center gap-2 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] shrink-0 z-10">
          <div className="flex items-center gap-2 flex-grow md:flex-grow-0">
            <button 
              onClick={() => handleCallNow(selectedLead)}
              className="bg-[#27AE60] hover:bg-[#219653] text-white h-11 px-6 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-sm flex-1 md:flex-none justify-center active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">phone</span> Call Now
            </button>
            
            <button 
              onClick={() => triggerToast(`WhatsApp brochure template sent to ${selectedLead.name}`)}
              className="whatsapp-btn border border-[#27AE60] text-[#27AE60] hover:bg-[#EAFAF1] h-11 px-4 rounded-lg font-bold text-xs flex items-center justify-center transition-all"
              title="Send WhatsApp Link"
              data-lead-name={selectedLead.name}
              data-phone={selectedLead.phone}
              data-tmid={selectedLead.tmid}
              data-whatsapp="true"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
            </button>

            <button 
              onClick={() => triggerToast(`Navigated to calendar to schedule callback`)}
              className="border border-gray-300 text-gray-600 hover:bg-gray-50 h-11 px-4 rounded-lg font-bold text-xs flex items-center justify-center transition-all"
              title="Schedule Callback"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
            </button>
          </div>

          <div className="flex items-center gap-1">
            <select 
              onChange={(e) => {
                if (e.target.value) {
                  triggerToast(`Lead status updated: ${e.target.value}`);
                  e.target.value = '';
                }
              }}
              className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg h-11 px-3 outline-none focus:ring-0"
            >
              <option value="">Choose Quick Action...</option>
              <option value="wrong_number">Mark Wrong Number</option>
              <option value="already_subscribed">Mark Already Subscribed</option>
              <option value="escalate">Escalate to Funnel</option>
            </select>
          </div>
        </div>

      </section>

    </main>
  );
};

export default DwCallQueue;
