import React, { useState } from 'react';

interface CallHistoryItem {
  id: string;
  type: string;
  timestamp: string;
  content: string;
}

interface Lead {
  id: string;
  tmid: string;
  name: string;
  phone: string;
  location: string;
  registrationDate: string;
  category: 'fresh' | 'callbacks' | 'nr' | 'funnel';
  statusLabel: string;
  vehicleType: string;
  vehicleReg: string;
  licenseType: string;
  licenseExp: string;
  routes: string;
  routesType: string;
  kycStatus: string;
  history: CallHistoryItem[];
  notes: string;
}

export const DwCallQueue: React.FC = () => {
  // Mock Leads Data
  const [leads, setLeads] = useState<Lead[]>([
    {
      id: 'L1',
      tmid: '8842',
      name: 'Arjun Vardhan',
      phone: '+91 98765 43210',
      location: 'Mumbai, MH',
      registrationDate: '22 Oct',
      category: 'funnel',
      statusLabel: 'UNSUBSCRIBED',
      vehicleType: 'TATA ACE (14ft)',
      vehicleReg: 'MH 01 CZ 2234',
      licenseType: 'Active / HGV',
      licenseExp: '14 Nov 2026',
      routes: 'Mumbai - Pune',
      routesType: 'Inter-state approved',
      kycStatus: 'KYC Done',
      history: [
        { id: 'H11', type: 'Call Failed - No Response', timestamp: 'Today, 11:20 AM', content: 'Attempted standard registration follow-up. Dialed twice, no response.' },
        { id: 'H12', type: 'Connected (08:14)', timestamp: '24 Oct, 04:45 PM', content: 'Discussed route pricing. Lead is interested but requested a callback next week after confirming vehicle maintenance schedule.' },
        { id: 'H13', type: 'WhatsApp Sent', timestamp: '22 Oct, 10:00 AM', content: 'Onboarding link and documentation list sent via automated trigger.' }
      ],
      notes: 'Fleet owner. Interested in Bhiwandi terminal loading contracts.'
    },
    {
      id: 'L2',
      tmid: '9012',
      name: 'Priya Sharma',
      phone: '+91 81234 56789',
      location: 'Indore, MP',
      registrationDate: '24 Oct',
      category: 'nr',
      statusLabel: 'NR x2 (LAST: 2H AGO)',
      vehicleType: 'Mahindra Bolero',
      vehicleReg: 'MP 09 AB 5678',
      licenseType: 'Active / LMV',
      licenseExp: '18 Dec 2027',
      routes: 'Indore - Dewas',
      routesType: 'Local logistics route',
      kycStatus: 'Pending Verification',
      history: [
        { id: 'H21', type: 'No Response', timestamp: 'Today, 02:30 PM', content: 'Customer did not pick up. Left a voicemail.' },
        { id: 'H22', type: 'No Response', timestamp: 'Today, 12:15 PM', content: 'Call rang out completely. No callback received.' }
      ],
      notes: 'Needs help uploading driving license. Try calling in evening.'
    },
    {
      id: 'L3',
      tmid: '1154',
      name: 'Rahul Deshmukh',
      phone: '+91 71234 56789',
      location: 'Pune, MH',
      registrationDate: 'Today',
      category: 'fresh',
      statusLabel: 'FRESH LEAD',
      vehicleType: 'E-Rickshaw Cargo',
      vehicleReg: 'MH 12 XY 9876',
      licenseType: 'Active / LMV',
      licenseExp: '02 Jan 2028',
      routes: 'Pune City',
      routesType: 'Intra-city short-haul',
      kycStatus: 'KYC Done',
      history: [
        { id: 'H31', type: 'Lead Created', timestamp: 'Today, 08:00 AM', content: 'Self-registered via driver app.' }
      ],
      notes: 'Very interested in local grocery delivery load contracts.'
    },
    {
      id: 'L4',
      tmid: '7721',
      name: 'Meera Reddy',
      phone: '+91 90909 09090',
      location: 'Bangalore, KA',
      registrationDate: '20 Oct',
      category: 'callbacks',
      statusLabel: 'CALLBACK: 14:30',
      vehicleType: 'Ashok Leyland Dost',
      vehicleReg: 'KA 03 MN 4321',
      licenseType: 'Active / HGV',
      licenseExp: '19 Aug 2026',
      routes: 'Bangalore - Chennai',
      routesType: 'National Highway corridor',
      kycStatus: 'KYC Done',
      history: [
        { id: 'H41', type: 'Connected (04:12)', timestamp: '20 Oct, 02:00 PM', content: 'Requested callback on Thursday to review standard pricing for Chennai long-haul.' }
      ],
      notes: 'Regular driver with steady fleet. High priority closure.'
    }
  ]);

  // UI States
  const [selectedLeadId, setSelectedLeadId] = useState('L1');
  const [activeFilter, setActiveFilter] = useState<'all' | 'fresh' | 'callbacks' | 'nr' | 'funnel'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDialLead = (leadName: string) => {
    showToast(`Dialing ${leadName}... Connecting via Softphone Engine.`);
  };

  const handleSendWhatsapp = (leadName: string) => {
    showToast(`WhatsApp onboarding brochure sent to ${leadName}!`);
  };

  const handleUpdateNotes = (notesText: string) => {
    setLeads(prevLeads =>
      prevLeads.map(l => (l.id === selectedLead.id ? { ...l, notes: notesText } : l))
    );
  };

  const filteredLeads = leads.filter(
    l => activeFilter === 'all' || l.category === activeFilter
  );

  return (
    <main className="h-[calc(100vh-88px)] flex bg-white overflow-hidden border border-outline-variant rounded-xl relative">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="absolute top-md left-1/2 -translate-x-1/2 bg-inverse-surface text-inverse-on-surface px-lg py-sm rounded shadow-lg z-50 text-xs font-semibold flex items-center gap-xs border border-outline animate-in fade-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[16px] text-accent-success">check_circle</span>
          {toastMessage}
        </div>
      )}

      {/* Left List Pane (Call Queue) */}
      <section className="w-[380px] flex flex-col border-r border-outline-variant bg-surface-container-lowest shrink-0">
        <div className="p-md bg-surface-container-low border-b border-outline-variant shrink-0">
          <div className="flex justify-between items-center mb-md">
            <h2 className="text-headline-sm font-headline-sm font-bold">Call Queue</h2>
            <div className="flex items-center gap-xs text-on-surface-variant cursor-pointer text-xs">
              <span>Sort by: Priority</span>
              <span className="material-symbols-outlined text-sm">expand_more</span>
            </div>
          </div>
          <div className="flex gap-sm overflow-x-auto pb-xs custom-scrollbar">
            {[
              { filter: 'all', label: `All (${leads.length})` },
              { filter: 'fresh', label: 'Fresh' },
              { filter: 'callbacks', label: 'Callbacks' },
              { filter: 'nr', label: 'NR' },
              { filter: 'funnel', label: 'Funnel' }
            ].map(t => (
              <button
                key={t.filter}
                onClick={() => setActiveFilter(t.filter as any)}
                className={`px-3 py-1 text-xs font-semibold rounded-full flex-shrink-0 transition-colors ${
                  activeFilter === t.filter
                    ? 'bg-primary text-on-primary font-bold'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-surface-container-highest'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Lead Rows list */}
        <div className="flex-grow overflow-y-auto custom-scrollbar">
          {filteredLeads.length > 0 ? (
            filteredLeads.map(l => {
              const isLeadSelected = l.id === selectedLeadId;
              // Set left border color based on category
              const categoryColorMap = {
                fresh: 'border-[#3498DB]',
                callbacks: 'border-[#27AE60]',
                nr: 'border-[#F39C12]',
                funnel: 'border-[#E74C3C]'
              };
              return (
                <div
                  key={l.id}
                  onClick={() => setSelectedLeadId(l.id)}
                  className={`group flex border-l-4 ${categoryColorMap[l.category]} p-md border-b border-outline-variant hover:bg-surface-container-low cursor-pointer transition-colors ${
                    isLeadSelected ? 'bg-surface-container-low font-bold' : 'bg-white'
                  }`}
                >
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-bold text-sm text-on-surface">{l.name}</h3>
                      <span className="bg-primary/10 text-primary text-[10px] px-1.5 py-0.5 rounded font-bold">TMID: {l.tmid}</span>
                    </div>
                    <div className="flex items-center gap-xs mt-1 text-on-surface-variant text-xs font-normal">
                      <span>{l.location}</span>
                      <span className="w-1 h-1 bg-outline-variant rounded-full"></span>
                      <span>Reg: {l.registrationDate}</span>
                    </div>
                    {l.statusLabel && (
                      <div className="mt-2 inline-flex items-center px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant text-[10px] font-bold uppercase tracking-wide border border-outline-variant/30">
                        {l.statusLabel}
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center pl-sm">
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDialLead(l.name); }}
                      className="bg-primary hover:bg-primary-container text-white p-2 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px] flex items-center justify-center" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-xl text-center text-on-surface-variant italic text-xs">No leads found in this queue category.</div>
          )}
        </div>
      </section>

      {/* Right Detail Pane */}
      <section className="flex-grow flex flex-col bg-surface overflow-hidden">
        
        {/* Detail Header */}
        <div className="flex-grow overflow-y-auto custom-scrollbar p-xl space-y-lg">
          <div className="flex justify-between items-start">
            <div>
              <div className="flex items-center gap-md">
                <h1 className="text-headline-md font-bold text-on-surface">{selectedLead.name}</h1>
                <span className="px-2 py-0.5 bg-error-container text-on-error-container text-[11px] rounded border border-error/20 font-bold uppercase tracking-wider">
                  {selectedLead.category === 'callbacks' ? 'Pending Action' : 'Unsubscribed'}
                </span>
                <div className="flex items-center gap-1 px-2 py-0.5 bg-[#25D366]/10 text-[#25D366] text-[11px] rounded border border-[#25D366]/20 font-bold">
                  <span className="material-symbols-outlined text-[14px]">chat</span> WhatsApp Active
                </div>
              </div>
              <div className="flex items-center gap-md mt-sm text-xs text-on-surface-variant font-medium">
                <span>TMID: {selectedLead.tmid}-X</span>
                <span>•</span>
                <span>Fleet Partner</span>
                <span>•</span>
                <span>{selectedLead.location}</span>
              </div>
            </div>
            <div className="flex gap-sm">
              <button 
                onClick={() => showToast('Edit lead profile modal details...')}
                className="p-2 border border-outline-variant rounded hover:bg-surface-container-high transition-colors"
                title="Edit Details"
              >
                <span className="material-symbols-outlined text-[18px]">edit</span>
              </button>
              <button 
                onClick={() => showToast('Sharing driver credentials links...')}
                className="p-2 border border-outline-variant rounded hover:bg-surface-container-high transition-colors"
                title="Share Profile"
              >
                <span className="material-symbols-outlined text-[18px]">share</span>
              </button>
            </div>
          </div>

          {/* Quick Specifications Cards */}
          <div className="grid grid-cols-4 gap-md text-xs">
            <div className="bg-white p-lg border border-outline-variant rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-semibold mb-1">Vehicle Details</span>
              <div className="font-bold text-on-surface text-sm">{selectedLead.vehicleType}</div>
              <span className="text-on-surface-variant mt-sm block text-[11px] font-mono-data">{selectedLead.vehicleReg}</span>
            </div>
            <div className="bg-white p-lg border border-outline-variant rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-semibold mb-1">Driving License</span>
              <div className="font-bold text-on-surface text-sm">{selectedLead.licenseType}</div>
              <span className="text-error mt-sm block text-[11px] font-bold">Expiry: {selectedLead.licenseExp}</span>
            </div>
            <div className="bg-white p-lg border border-outline-variant rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-semibold mb-1">Preferred Corridor</span>
              <div className="font-bold text-on-surface text-sm">{selectedLead.routes}</div>
              <span className="text-on-surface-variant mt-sm block text-[11px]">{selectedLead.routesType}</span>
            </div>
            <div className="bg-white p-lg border border-outline-variant rounded-lg shadow-[0_2px_8px_rgba(0,0,0,0.02)]">
              <span className="text-[10px] text-on-surface-variant uppercase tracking-wider block font-semibold mb-1">KYC Status</span>
              <div className="flex items-center gap-xs mt-1 text-sm font-bold text-primary">
                <span className="material-symbols-outlined text-[16px] text-primary" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
                <span>{selectedLead.kycStatus}</span>
              </div>
            </div>
          </div>

          {/* History Timeline & Notes Grid */}
          <div className="grid grid-cols-12 gap-lg items-start">
            
            {/* Timeline */}
            <div className="col-span-7">
              <h3 className="font-bold text-xs uppercase text-on-surface-variant tracking-wider mb-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]">history</span> Call & Message History
              </h3>
              
              <div className="relative space-y-md before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-[2px] before:bg-outline-variant pl-4">
                {selectedLead.history.map(item => (
                  <div key={item.id} className="relative pl-8 animate-in fade-in duration-300">
                    <div className="absolute left-0 top-1 w-6 h-6 bg-surface-container-high rounded-full border-2 border-white flex items-center justify-center z-10">
                      <div className="w-2.5 h-2.5 bg-outline rounded-full"></div>
                    </div>
                    <div className="bg-white p-md rounded-lg border border-outline-variant/60 shadow-sm text-xs">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-bold text-on-surface">{item.type}</span>
                        <span className="text-[10px] text-on-surface-variant">{item.timestamp}</span>
                      </div>
                      <p className="text-on-surface-variant leading-relaxed font-normal">{item.content}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Operator Notes editor */}
            <div className="col-span-5 space-y-lg">
              <h3 className="font-bold text-xs uppercase text-on-surface-variant tracking-wider mb-md flex items-center gap-xs">
                <span className="material-symbols-outlined text-[16px]">notes</span> Operator Remarks
              </h3>
              
              <div className="bg-white border border-outline-variant rounded-lg flex flex-col min-h-[200px] shadow-sm">
                <textarea 
                  className="flex-1 p-md bg-transparent border-none focus:ring-0 text-xs resize-none placeholder:text-on-surface-variant outline-none" 
                  placeholder="Enter custom driver notes or log follow-up details..."
                  value={selectedLead.notes}
                  onChange={(e) => handleUpdateNotes(e.target.value)}
                />
                <div className="p-sm bg-surface-container-low border-t border-outline-variant flex justify-between items-center shrink-0">
                  <span className="text-[10px] text-on-surface-variant italic">Changes auto-saved</span>
                  <button 
                    onClick={() => showToast('Custom tag added successfully!')}
                    className="text-primary font-bold text-[10px] uppercase hover:bg-surface-container-high px-2 py-1 rounded transition-colors"
                  >
                    ADD TAG
                  </button>
                </div>
              </div>

              <div className="bg-white p-md border border-outline-variant rounded-lg shadow-sm text-xs">
                <span className="text-[10px] text-on-surface-variant uppercase font-bold block mb-sm">Frequent Operational Issues</span>
                <div className="flex flex-wrap gap-xs">
                  {['Pricing Objection', 'DL Pending', 'Corridor Mismatch', 'E-Rickshaw Range'].map(tag => (
                    <span 
                      key={tag} 
                      onClick={() => handleUpdateNotes(selectedLead.notes ? `${selectedLead.notes} [${tag}]` : `[${tag}]`)}
                      className="px-2 py-1 bg-surface-container hover:bg-surface-container-high rounded text-[10px] font-semibold border border-outline-variant/40 cursor-pointer transition-colors"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions Panel */}
        <div className="bg-white border-t border-outline-variant h-20 px-xl flex justify-between items-center shrink-0 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] z-10">
          <div className="flex gap-md">
            <button 
              onClick={() => handleDialLead(selectedLead.name)}
              className="bg-primary hover:bg-primary-container text-white h-12 px-8 rounded-lg font-bold flex items-center gap-3 transition-colors shadow-md text-xs uppercase"
            >
              <span className="material-symbols-outlined text-[18px]" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
              <span>CALL NOW</span>
            </button>
            <button 
              onClick={() => handleSendWhatsapp(selectedLead.name)}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white h-12 px-6 rounded-lg font-bold flex items-center gap-3 transition-colors shadow-md text-xs uppercase"
            >
              <span className="material-symbols-outlined text-[18px]">chat</span>
              <span>SEND WHATSAPP</span>
            </button>
            <button 
              onClick={() => showToast(`Callback scheduler opened for ${selectedLead.name}`)}
              className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface h-12 px-6 rounded-lg font-bold flex items-center gap-3 transition-colors border border-outline-variant text-xs uppercase"
            >
              <span className="material-symbols-outlined text-[18px]">calendar_today</span>
              <span>SCHEDULE CALLBACK</span>
            </button>
          </div>
          
          <div className="flex items-center gap-md text-xs">
            <div className="flex flex-col items-end">
              <span className="text-[10px] text-on-surface-variant font-semibold uppercase">Last Attempt</span>
              <span className="text-on-surface font-bold mt-0.5">{selectedLead.history[0]?.timestamp}</span>
            </div>
            <button 
              onClick={() => showToast('Displaying extended lead audit logs...')}
              className="p-3 hover:bg-surface-container-high rounded-full transition-colors"
            >
              <span className="material-symbols-outlined">more_vert</span>
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default DwCallQueue;
