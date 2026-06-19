import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

interface CallHistory {
  date: string;
  duration: string;
  status: string;
  caller: string;
}

interface TransporterLead {
  id: string;
  tmid: string;
  companyName: string;
  contactName: string;
  phone: string;
  city: string;
  state: string;
  registeredMinutesAgo: number;
  slaMinutesLeft: number;
  fleetSize: number;
  segment: string;
  avgKmMonth: string;
  preferredRoutes: string;
  subscribedStatus: 'none' | 'free' | 'premium' | 'super';
  subscribedDate?: string;
  jobsPosted: number;
  jobsFilled: number;
  whatsapp: boolean;
  notes: string;
  history: CallHistory[];
}

export const WctCallQueue: React.FC = () => {
  const navigate = useNavigate();

  // Mock Transporter Leads conforming to Spec
  const [leads, setLeads] = useState<TransporterLead[]>([
    {
      id: 'TR1',
      tmid: 'TR-12094',
      companyName: 'Sharma Logistics',
      contactName: 'Rajeev Sharma',
      phone: '+91-98765-43210',
      city: 'Delhi',
      state: 'NCR',
      registeredMinutesAgo: 107, // 1h 47m
      slaMinutesLeft: 133, // 2h 13m
      fleetSize: 8, // >=6 -> Recommend Super Premium
      segment: 'Long-haul, FMCG',
      avgKmMonth: '12,000',
      preferredRoutes: 'NCR–Mumbai corridor',
      subscribedStatus: 'none',
      jobsPosted: 0,
      jobsFilled: 0,
      whatsapp: true,
      notes: 'Owner is very interested in driver placement. Call to pitch Super Premium.',
      history: []
    },
    {
      id: 'TR2',
      tmid: 'TR-12098',
      companyName: 'Anand Transport Co',
      contactName: 'Karan Anand',
      phone: '+91-98123-45678',
      city: 'Bhiwandi',
      state: 'Maharashtra',
      registeredMinutesAgo: 178, // 2h 58m
      slaMinutesLeft: 62, // 1h 02m -> Orange alert (<2h)
      fleetSize: 4, // 1-5 -> Recommend Premium
      segment: 'Intra-city, Retail',
      avgKmMonth: '5,000',
      preferredRoutes: 'Mumbai-Pune',
      subscribedStatus: 'free',
      subscribedDate: '12 Jun 2026',
      jobsPosted: 2,
      jobsFilled: 0,
      whatsapp: true,
      notes: 'Currently on Free Plan. Ready for D+7 upsell call.',
      history: [
        { date: '12 Jun, 11:30 AM', duration: '5m 12s', status: 'Connected', caller: 'You' }
      ]
    },
    {
      id: 'TR3',
      tmid: 'TR-12099',
      companyName: 'Grover Logistics',
      contactName: 'Sanjay Grover',
      phone: '+91-88888-88888',
      city: 'Indore',
      state: 'Madhya Pradesh',
      registeredMinutesAgo: 320, // 5h 20m
      slaMinutesLeft: -80, // -1h 20m -> Red alert (Breached)
      fleetSize: 12,
      segment: 'Industrial, Heavy Load',
      avgKmMonth: '15,000',
      preferredRoutes: 'Indore-Guwahati',
      subscribedStatus: 'none',
      jobsPosted: 0,
      jobsFilled: 0,
      whatsapp: false,
      notes: 'Urgent call required. Registration breached the 4h SLA.',
      history: [
        { date: '19 Jun, 9:00 AM', duration: '0m 0s', status: 'NR', caller: 'You' }
      ]
    }
  ]);

  const [selectedId, setSelectedId] = useState<string>('TR1');
  const [activeTab, setActiveTab] = useState<'all' | 'sla' | 'callbacks' | 'nr' | 'upsell' | 'free'>('all');
  const [sortBy, setSortBy] = useState<'sla' | 'reg' | 'callbacks'>('sla');
  const [toast, setToast] = useState<string | null>(null);

  // Note auto-save states
  const [notesText, setNotesText] = useState<string>('');
  const [saveTimestamp, setSaveTimestamp] = useState<string>('');
  const saveTimerRef = useRef<any | null>(null);

  const selectedLead = leads.find(l => l.id === selectedId) || leads[0];

  useEffect(() => {
    if (selectedLead) {
      setNotesText(selectedLead.notes);
      setSaveTimestamp('');
    }
  }, [selectedId]);

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

  // Live ticking SLA left minutes
  useEffect(() => {
    const timer = setInterval(() => {
      setLeads(prevLeads =>
        prevLeads.map(l => ({ ...l, slaMinutesLeft: l.slaMinutesLeft - 1 }))
      );
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const getBorderColorClass = (l: TransporterLead) => {
    if (l.slaMinutesLeft < 0) return 'border-red-600 bg-red-50/10'; // SLA Breached
    if (l.slaMinutesLeft <= 60) return 'border-red-500'; // <1h
    if (l.slaMinutesLeft <= 120) return 'border-orange-500'; // <2h
    if (l.slaMinutesLeft <= 180) return 'border-yellow-400'; // <3h
    return 'border-blue-500 bg-blue-50/5';
  };

  const getSLAText = (mins: number) => {
    if (mins < 0) {
      const positiveMins = Math.abs(mins);
      return `SLA BREACHED — ${Math.floor(positiveMins / 60)}h ${positiveMins % 60}m overdue`;
    }
    return `SLA: ${Math.floor(mins / 60)}h ${mins % 60}m left`;
  };

  const getSLAColorText = (mins: number) => {
    if (mins < 0) return 'text-red-600 font-extrabold';
    if (mins <= 60) return 'text-red-500 font-bold';
    if (mins <= 120) return 'text-orange-500';
    return 'text-gray-500';
  };

  // Plan recommendation helper
  const getPlanRecommendation = (fleetSize: number) => {
    if (fleetSize >= 6) return 'Recommend: Super Premium';
    if (fleetSize >= 1) return 'Recommend: Premium';
    return null;
  };

  // Sort & Filter
  const getFilteredLeads = () => {
    let result = [...leads];

    // Filter
    if (activeTab === 'sla') {
      result = result.filter(l => l.slaMinutesLeft <= 120); // <2h
    } else if (activeTab === 'nr') {
      result = result.filter(l => l.history.some(h => h.status === 'NR'));
    } else if (activeTab === 'upsell') {
      result = result.filter(l => l.subscribedStatus === 'free');
    } else if (activeTab === 'free') {
      result = result.filter(l => l.subscribedStatus === 'free');
    }

    // Sort
    if (sortBy === 'sla') {
      // Urgent SLA first (lowest minutes left)
      result.sort((a, b) => a.slaMinutesLeft - b.slaMinutesLeft);
    } else if (sortBy === 'reg') {
      result.sort((a, b) => b.registeredMinutesAgo - a.registeredMinutesAgo);
    }

    return result;
  };

  const filteredLeads = getFilteredLeads();

  // Active call trigger
  const handleCallNow = (lead: TransporterLead) => {
    navigate('/wct/wct-active-call-focus', {
      state: {
        leadId: lead.id,
        tmid: lead.tmid,
        name: lead.companyName,
        contactName: lead.contactName,
        phone: lead.phone,
        location: `${lead.city}, ${lead.state}`,
        fleetSize: lead.fleetSize,
        segment: lead.segment,
        avgKmMonth: lead.avgKmMonth,
        preferredRoutes: lead.preferredRoutes,
        subscribedStatus: lead.subscribedStatus,
        whatsapp: lead.whatsapp,
        history: lead.history,
        notes: lead.notes,
        slaMinutesLeft: lead.slaMinutesLeft
      }
    });
  };

  return (
    <main className="h-[calc(100vh-80px)] flex bg-white overflow-hidden border border-gray-200 rounded-xl relative">
      
      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#FB641B]"></span>
          {toast}
        </div>
      )}

      {/* Left Panel: Staging Call Queue */}
      <section className="w-[380px] border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0">
        
        {/* Tab Filter Header */}
        <div className="p-3 border-b border-gray-200 shrink-0 bg-white">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Transporter Queue</span>
            <div className="flex items-center gap-1">
              <span className="text-[10px] text-gray-400">Sort:</span>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[11px] font-semibold text-gray-700 border-none outline-none cursor-pointer focus:ring-0 p-0"
              >
                <option value="sla">SLA Urgency (default)</option>
                <option value="reg">Registration Date</option>
              </select>
            </div>
          </div>

          {/* Filter Tab Row */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: `All (${leads.length})` },
              { id: 'sla', label: 'SLA Urgent (2)', badgeColor: 'bg-red-500 text-white animate-pulse' },
              { id: 'nr', label: 'NR' },
              { id: 'upsell', label: 'D+7 Upsell' },
              { id: 'free', label: 'Free Plan' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
                  activeTab === tab.id
                    ? 'bg-[#FB641B] text-white border-[#FB641B]'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lead List Area */}
        <div className="flex-grow overflow-y-auto min-h-0 divide-y divide-gray-100">
          {filteredLeads.length > 0 ? (
            filteredLeads.map(l => {
              const recommendation = getPlanRecommendation(l.fleetSize);
              return (
                <div 
                  key={l.id}
                  onClick={() => setSelectedId(l.id)}
                  className={`p-3 cursor-pointer flex border-l-4 transition-all relative ${getBorderColorClass(l)} ${
                    l.id === selectedId ? 'bg-orange-50/15 font-medium' : 'bg-white hover:bg-gray-50'
                  }`}
                >
                  <div className="flex-1 min-w-0 pr-2 space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-gray-900 truncate">{l.companyName}</span>
                      <span className="font-mono text-[10px] text-gray-400 bg-gray-100 px-1 rounded">{l.tmid}</span>
                    </div>
                    
                    <div className="text-[12px] text-gray-500">Contact: {l.contactName}</div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] text-gray-600 font-semibold">Fleet: {l.fleetSize} trucks</span>
                      {recommendation && (
                        <span className="bg-gray-150 text-gray-700 text-[9px] px-1 rounded font-bold uppercase">
                          {recommendation.split(': ')[1]}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-2 pt-1 border-t border-gray-100/50">
                      <span className={`text-[11px] font-bold flex items-center gap-0.5 ${getSLAColorText(l.slaMinutesLeft)}`}>
                        {l.slaMinutesLeft < 0 ? '⚠️ ' : ''}
                        {getSLAText(l.slaMinutesLeft)}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col justify-center">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleCallNow(l); }}
                      className="w-8 h-8 rounded-full bg-[#FB641B] hover:bg-[#e4540d] text-white flex items-center justify-center shadow transition-transform active:scale-95"
                      title="Call Transporter"
                    >
                      <span className="material-symbols-outlined text-[16px]">call</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs italic">
              Queue clear for today. New leads arrive from 9 AM tomorrow.
            </div>
          )}
        </div>
      </section>

      {/* Right Detail Pane */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
        
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          
          {/* Header block */}
          <div className="flex justify-between items-start gap-4">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-xl font-bold text-gray-900">{selectedLead.companyName}</h1>
                <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{selectedLead.tmid}</span>
                <span className="border border-[#FB641B] text-[#FB641B] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  TRANSPORTER
                </span>
              </div>
              <div className="text-sm text-gray-500 mt-1">Contact Person: {selectedLead.contactName} · {selectedLead.city}, {selectedLead.state}</div>
            </div>

            {/* WhatsApp chip */}
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
            {selectedLead.subscribedStatus === 'none' && (
              <div className="bg-[#FDEDEC] border border-red-100 text-[#C0392B] p-3 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                <span>NOT SUBSCRIBED</span>
                <span className="uppercase text-[9px] bg-red-100 px-1.5 py-0.5 rounded">Conversion Pending</span>
              </div>
            )}
            {selectedLead.subscribedStatus === 'free' && (
              <div className="bg-orange-50 border border-orange-200 text-[#FB641B] p-3 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                <span>FREE PLAN</span>
                <span>Active since {selectedLead.subscribedDate || '12 Jun 2026'}</span>
              </div>
            )}
            {selectedLead.subscribedStatus === 'premium' && (
              <div className="bg-[#EAFAF1] border border-[#27AE60]/20 text-[#27AE60] p-3 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                <span>PREMIUM SUBSCRIBED (₹1,999)</span>
                <span>Expires 12 Sep 2026</span>
              </div>
            )}
            {selectedLead.subscribedStatus === 'super' && (
              <div className="bg-[#EAFAF1] border border-[#27AE60]/20 text-[#27AE60] p-3 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                <span>SUPER PREMIUM SUBSCRIBED (₹2,999)</span>
                <span>Expires 12 Sep 2026</span>
              </div>
            )}
          </div>

          {/* Fleet Profile grid */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Fleet Profile</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">Fleet Size</span>
                <span className="font-bold text-gray-800 mt-0.5 block">{selectedLead.fleetSize} trucks</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">Segment</span>
                <span className="font-bold text-gray-800 mt-0.5 block">{selectedLead.segment}</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">Avg KM/Month</span>
                <span className="font-bold text-gray-800 mt-0.5 block">{selectedLead.avgKmMonth} KM</span>
              </div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">Preferred Routes</span>
                <span className="font-bold text-gray-800 mt-0.5 block">{selectedLead.preferredRoutes}</span>
              </div>
            </div>
          </div>

          {/* Active Job Postings */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-xs">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Active Job Postings</h3>
            <div className="flex justify-between items-center bg-gray-50/50 p-2.5 rounded border border-gray-150">
              <span className="font-semibold text-gray-600">{selectedLead.jobsPosted} jobs posted · {selectedLead.jobsFilled} filled</span>
              <button 
                onClick={() => triggerToast('Redirecting to Matchmaking view...')}
                className="text-[#FB641B] font-bold hover:underline"
              >
                View Jobs Board
              </button>
            </div>
          </div>

          {/* Call history and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            
            {/* Timeline */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">history</span> Call History Timeline
              </h3>
              
              <div className="border border-gray-200 rounded-xl p-4 bg-white max-h-[200px] overflow-y-auto divide-y divide-gray-100">
                {selectedLead.history.length > 0 ? (
                  selectedLead.history.map((hist, idx) => (
                    <div key={idx} className="py-2 first:pt-0 last:pb-0 text-xs">
                      <div className="flex justify-between items-center mb-1 font-semibold">
                        <span className="text-gray-800">{hist.date} — {hist.duration}</span>
                        <span className="px-1.5 py-0.5 bg-orange-50 text-[#FB641B] rounded text-[10px]">
                          {hist.status}
                        </span>
                      </div>
                      <p className="text-gray-500">Caller: {hist.caller}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 italic text-center py-4">No previous calls — first attempt.</p>
                )}
              </div>
            </div>

            {/* Note Editor */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">notes</span> Fleet & Conversation Notes
              </h3>
              
              <div className="bg-white border border-gray-200 rounded-xl p-3 shadow-sm flex flex-col relative min-h-[140px]">
                <textarea
                  value={notesText}
                  onChange={(e) => handleNotesChange(e.target.value)}
                  placeholder="e.g. 'Owner said will decide after checking with partner — follow up Thursday'"
                  className="flex-grow w-full border-none p-0 focus:ring-0 text-xs resize-none outline-none placeholder:text-gray-400 min-h-[100px]"
                />
                <div className="text-[10px] text-gray-400 text-right mt-1 italic select-none">
                  {saveTimestamp || 'All changes saved'}
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Fixed Action Footer */}
        <div className="border-t border-gray-200 bg-white p-4 flex justify-between items-center shadow-[0_-2px_10px_rgba(0,0,0,0.02)] shrink-0 z-10">
          <div className="flex items-center gap-2 flex-grow md:flex-grow-0">
            <button 
              onClick={() => handleCallNow(selectedLead)}
              className="bg-[#FB641B] hover:bg-[#e4540d] text-white h-11 px-6 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 transition-all shadow-sm active:scale-[0.98]"
            >
              <span className="material-symbols-outlined text-[18px]">phone</span> Call Now
            </button>
            
            <button 
              onClick={() => triggerToast(`WhatsApp proposal sent to ${selectedLead.contactName}`)}
              className="whatsapp-btn border border-[#FB641B] text-[#FB641B] hover:bg-orange-50 h-11 px-4 rounded-lg font-bold text-xs flex items-center justify-center transition-all"
              title="Send WhatsApp Link"
              data-lead-name={selectedLead.contactName}
              data-phone={selectedLead.phone}
              data-tmid={selectedLead.tmid}
              data-whatsapp="true"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
            </button>

            <button 
              onClick={() => triggerToast(`Callback scheduler opened for ${selectedLead.companyName}`)}
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
                  triggerToast(`Action triggered: ${e.target.value}`);
                  e.target.value = '';
                }
              }}
              className="bg-white border border-gray-200 text-gray-700 text-xs font-semibold rounded-lg h-11 px-3 outline-none focus:ring-0"
            >
              <option value="">Choose Quick Action...</option>
              <option value="wrong_number">Mark Wrong Number</option>
              <option value="already_subscribed">Mark Already Subscribed</option>
              <option value="escalate">Escalate Call</option>
            </select>
          </div>
        </div>

      </section>

    </main>
  );
};

export default WctCallQueue;
