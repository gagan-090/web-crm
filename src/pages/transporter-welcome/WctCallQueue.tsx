import React, { useState } from 'react';

interface CallHistoryItem {
  id: string;
  type: string;
  timestamp: string;
  content: string;
}

interface TransporterLead {
  id: string;
  tmid: string;
  companyName: string;
  contactName: string;
  phone: string;
  location: string;
  category: 'sla' | 'callbacks' | 'nr' | 'upsell';
  slaLabel: string;
  fleetSize: number;
  recommendedPlan: string;
  platform: string;
  history: CallHistoryItem[];
  notes: string;
}

export const WctCallQueue: React.FC = () => {
  // Mock Leads Data
  const [leads, setLeads] = useState<TransporterLead[]>(
    [
      {
        id: 'T1',
        tmid: 'TR-88219',
        companyName: 'Agarwal Roadlines',
        contactName: 'Mahesh Kumar',
        phone: '+91 94260 55888',
        location: 'Indore, MP',
        category: 'sla',
        slaLabel: 'SLA: 0h 42m',
        fleetSize: 8,
        recommendedPlan: 'Super Premium (₹12,499)',
        platform: 'Android App',
        history: [
          { id: 'h1', type: 'No Response (NR)', timestamp: 'Oct 24, 11:30 AM', content: 'Call rang fully. Driver picked up once then disconnected.' },
          { id: 'h2', type: 'Follow-up Call', timestamp: 'Oct 22, 02:15 PM', content: 'Discussed basic features. Customer asked for pricing brochure on WhatsApp.' },
          { id: 'h3', type: 'Inbound Enquiry', timestamp: 'Oct 20, 09:00 AM', content: 'Initial sign-up on web portal from Indore.' }
        ],
        notes: 'Mahesh is looking for a long-distance tracking solution specifically for the Indore-Guwahati route. Currently using manual calls to drivers. Fleet size is 8, but planning to add 4 more next month. Very price-conscious but values reliability. Mention the 24/7 support feature prominently.'
      },
      {
        id: 'T2',
        tmid: 'TR-91042',
        companyName: 'KTC Logistics',
        contactName: 'Rahul Sharma',
        phone: '+91 98765 43210',
        location: 'Mumbai, MH',
        category: 'sla',
        slaLabel: 'SLA: 1h 15m',
        fleetSize: 15,
        recommendedPlan: 'Fleet Enterprise (₹24,999)',
        platform: 'Web Console',
        history: [
          { id: 'h4', type: 'Connected (04:12)', timestamp: 'Oct 23, 10:00 AM', content: 'Walkthrough of dispatcher dashboard done. Decision maker likes the route analytics.' }
        ],
        notes: 'Very positive response. Needs bulk pricing quotation sent via email to finance director.'
      },
      {
        id: 'T3',
        tmid: 'TR-77631',
        companyName: 'Gati Express Delhi',
        contactName: 'Deepak Singh',
        phone: '+91 91234 56789',
        location: 'Delhi, NCR',
        category: 'callbacks',
        slaLabel: 'SLA: 2h 45m',
        fleetSize: 32,
        recommendedPlan: 'Value Plus (₹4,999)',
        platform: 'iOS App',
        history: [
          { id: 'h5', type: 'Callback Scheduled', timestamp: 'Oct 22, 11:00 AM', content: 'Requested callback on Monday afternoon to review SLA details.' }
        ],
        notes: 'Has a large fleet, but only registering a small batch first to test integration reliability.'
      },
      {
        id: 'T4',
        tmid: 'TR-12399',
        companyName: 'Punjab Trans Group',
        contactName: 'Harjit Singh',
        phone: '+91 88220 11000',
        location: 'Pune, MH',
        category: 'upsell',
        slaLabel: 'SLA: 5h 20m',
        fleetSize: 12,
        recommendedPlan: 'Super Premium (₹12,499)',
        platform: 'Android App',
        history: [
          { id: 'h6', type: 'Connected (02:15)', timestamp: 'Oct 21, 09:30 AM', content: 'Interested in fleet tracking module but requested offline demo first.' }
        ],
        notes: 'Fleet is based in Chakan industrial area. High upsell potential.'
      }
    ]
  );

  // States
  const [selectedLeadId, setSelectedLeadId] = useState('T1');
  const [activeFilter, setActiveFilter] = useState<'all' | 'sla' | 'callbacks' | 'nr' | 'upsell'>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const selectedLead = leads.find(l => l.id === selectedLeadId) || leads[0];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const handleDialLead = (company: string) => {
    showToast(`Dialing ${company}... Connecting via WCT Dialer Engine.`);
  };

  const handleSendWhatsapp = (contact: string) => {
    showToast(`WhatsApp pricing PDF sent to ${contact}!`);
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
      <section className="w-[380px] flex-shrink-0 flex flex-col bg-surface-container-lowest border-r border-outline-variant">
        
        {/* Filters */}
        <div className="p-sm bg-surface-container-low border-b border-outline-variant shrink-0">
          <div className="flex flex-wrap gap-xs">
            {[
              { filter: 'all', label: `All (${leads.length})` },
              { filter: 'sla', label: 'SLA Urgent' },
              { filter: 'callbacks', label: 'Callbacks' },
              { filter: 'upsell', label: 'Upsells' }
            ].map(t => (
              <button
                key={t.filter}
                onClick={() => setActiveFilter(t.filter as any)}
                className={`px-3 py-1 text-[11px] font-bold rounded-full transition-colors ${
                  activeFilter === t.filter
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface-container-high text-on-surface-variant hover:bg-outline-variant'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Count & Sorting Header */}
        <div className="px-md py-sm border-b border-outline-variant flex justify-between items-center bg-white shrink-0 text-xs">
          <span className="text-on-surface-variant font-semibold">{filteredLeads.length} Pending Calls</span>
          <div className="flex items-center text-primary cursor-pointer hover:underline font-bold">
            <span className="material-symbols-outlined text-sm mr-1">sort</span>
            <span>SLA Urgency</span>
          </div>
        </div>

        {/* Lead Row Cards */}
        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filteredLeads.length > 0 ? (
            filteredLeads.map(l => {
              const isSelected = l.id === selectedLeadId;
              const categoryColorMap = {
                sla: 'border-l-error bg-error-container/5',
                callbacks: 'border-l-primary bg-primary/5',
                nr: 'border-l-warning',
                upsell: 'border-l-secondary bg-secondary/5'
              };
              
              return (
                <div
                  key={l.id}
                  onClick={() => setSelectedLeadId(l.id)}
                  className={`border-l-4 ${categoryColorMap[l.category] || 'border-l-transparent'} border-b border-outline-variant p-md hover:bg-surface-container-low cursor-pointer transition-all ${
                    isSelected ? 'bg-surface-container-low font-bold border-l-primary' : ''
                  }`}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-bold text-sm text-on-surface leading-tight">{l.companyName}</h3>
                      <p className="text-[11px] text-on-surface-variant mt-0.5">Contact: {l.contactName}</p>
                    </div>
                    <div className="bg-error-container text-on-error-container px-2 py-0.5 rounded text-[9px] font-extrabold uppercase whitespace-nowrap">
                      {l.slaLabel}
                    </div>
                  </div>
                  <div className="flex justify-between items-end text-xs font-normal">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="bg-surface-container-highest px-1.5 py-0.5 rounded text-[10px] font-mono-data font-semibold text-on-surface-variant">{l.tmid}</span>
                        <span className="text-on-surface-variant">{l.fleetSize} trucks</span>
                      </div>
                      <p className="text-[10px] font-semibold text-primary">{l.recommendedPlan.split(' ')[0]} Rec</p>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleDialLead(l.companyName); }}
                      className="bg-primary hover:bg-primary-container text-white p-2 rounded-full shadow-sm hover:scale-105 active:scale-95 transition-all"
                    >
                      <span className="material-symbols-outlined text-[16px] flex items-center justify-center" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
                    </button>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="p-xl text-center text-on-surface-variant italic text-xs">No transporter leads in this queue.</div>
          )}
        </div>
      </section>

      {/* Right Details Pane */}
      <section className="flex-grow flex flex-col bg-surface-container-lowest overflow-hidden">
        
        {/* Pane Header */}
        <div className="p-lg bg-white border-b border-outline-variant flex justify-between items-center shrink-0">
          <div className="flex items-center gap-lg text-xs">
            <div className="w-14 h-14 rounded-lg bg-surface-container-high flex items-center justify-center text-primary shrink-0">
              <span className="material-symbols-outlined text-display-md" style={{ fontVariationSettings: "'FILL' 1" }}>local_shipping</span>
            </div>
            <div>
              <h1 className="text-headline-md font-bold text-on-surface">{selectedLead.companyName}</h1>
              <div className="flex items-center gap-md mt-1 text-on-surface-variant font-medium">
                <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-sm">person</span> {selectedLead.contactName}</span>
                <span className="flex items-center gap-xs"><span className="material-symbols-outlined text-sm">location_on</span> {selectedLead.location}</span>
                <span className="flex items-center gap-xs font-mono-data text-[11px]"><span className="material-symbols-outlined text-sm">badge</span> {selectedLead.tmid}</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <p className="text-[10px] text-on-surface-variant uppercase font-bold tracking-wider">Recommended Plan</p>
            <p className="text-sm font-bold text-primary mt-1">{selectedLead.recommendedPlan}</p>
          </div>
        </div>

        {/* Inner Columns scroll area */}
        <div className="flex-1 overflow-hidden flex">
          
          {/* Notes and stats (Left columns) */}
          <div className="w-2/3 p-lg flex flex-col gap-lg border-r border-outline-variant overflow-y-auto custom-scrollbar text-xs">
            
            {/* Notes Card */}
            <div className="bg-white p-lg rounded-xl border border-outline-variant shadow-sm space-y-md">
              <div className="flex justify-between items-center">
                <h2 className="font-bold text-on-surface flex items-center gap-2">
                  <span className="material-symbols-outlined text-primary text-sm">edit_note</span>
                  Fleet Profile &amp; Insights
                </h2>
                <span className="text-[10px] text-on-surface-variant bg-surface-container px-2 py-0.5 rounded">Last updated 2h ago</span>
              </div>
              <textarea 
                className="w-full h-36 p-md bg-surface-container-low border border-outline-variant rounded-lg font-body-md text-on-surface focus:ring-1 focus:ring-primary resize-none outline-none" 
                placeholder="Enter fleet details, challenges, or current solutions used..."
                value={selectedLead.notes}
                onChange={(e) => handleUpdateNotes(e.target.value)}
              />
              <div className="flex justify-between items-center text-xs">
                <span className="text-[10px] text-on-surface-variant italic">Changes auto-saved</span>
                <button 
                  onClick={() => showToast('Analyzing notes... Mock summary added')}
                  className="text-primary font-bold hover:underline"
                >
                  Auto-summarize notes
                </button>
              </div>
            </div>

            {/* Quick stats row */}
            <div className="grid grid-cols-3 gap-md">
              <div className="p-md bg-white border border-outline-variant rounded-lg text-center shadow-sm">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">Fleet Size</p>
                <p className="text-sm font-bold text-on-surface mt-1">{selectedLead.fleetSize} Trucks</p>
              </div>
              <div className="p-md bg-white border border-outline-variant rounded-lg text-center shadow-sm">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">Platform Enrolment</p>
                <p className="text-sm font-bold text-on-surface mt-1">{selectedLead.platform}</p>
              </div>
              <div className="p-md bg-white border border-outline-variant rounded-lg text-center shadow-sm">
                <p className="text-[10px] text-on-surface-variant uppercase font-bold">Audited Status</p>
                <p className="text-sm font-bold text-primary mt-1">Pending Sync</p>
              </div>
            </div>

          </div>

          {/* Call History (Right columns) */}
          <div className="w-1/3 bg-white p-lg overflow-y-auto custom-scrollbar text-xs">
            <h2 className="font-bold text-on-surface mb-lg flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-sm">history</span>
              Call History Logs
            </h2>
            <div className="relative space-y-md before:absolute before:left-3 before:top-2 before:bottom-0 before:w-0.5 before:bg-outline-variant pl-4">
              {selectedLead.history.map(item => (
                <div key={item.id} className="relative pl-6 animate-in fade-in duration-300">
                  <span className={`absolute -left-[20px] top-1.5 w-3 h-3 rounded-full ring-4 ring-white ${item.type.includes('NR') || item.type.includes('Failed') ? 'bg-error' : 'bg-primary'}`}></span>
                  <div className="bg-surface-container-low p-md rounded-lg border border-outline-variant/40">
                    <div className="flex justify-between items-start mb-1 gap-sm">
                      <span className="font-bold text-on-surface text-[11px] leading-tight">{item.type}</span>
                      <span className="text-[9px] text-on-surface-variant whitespace-nowrap">{item.timestamp}</span>
                    </div>
                    <p className="text-on-surface-variant leading-relaxed font-normal">{item.content}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer Actions */}
        <footer className="h-20 bg-white border-t border-outline-variant px-lg flex items-center justify-between shrink-0 shadow-[0_-2px_12px_rgba(0,0,0,0.03)] z-10 text-xs">
          <div className="flex items-center gap-md">
            <button 
              onClick={() => handleDialLead(selectedLead.companyName)}
              className="bg-primary hover:bg-primary-container text-white px-xl h-12 rounded-lg font-bold flex items-center gap-md transition-colors shadow-md text-xs uppercase"
            >
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 1" }}>call</span>
              <span>Call Now</span>
            </button>
            <button 
              onClick={() => handleSendWhatsapp(selectedLead.contactName)}
              className="bg-[#25D366] hover:bg-[#20ba59] text-white px-lg h-12 rounded-lg font-bold flex items-center gap-sm transition-colors text-xs uppercase"
            >
              <span className="material-symbols-outlined text-sm">message</span>
              <span>Send WhatsApp</span>
            </button>
          </div>
          <div className="flex items-center gap-md">
            <button 
              onClick={() => showToast('Opening callback scheduler...')}
              className="flex items-center gap-sm px-lg h-12 border-2 border-outline-variant text-on-surface-variant hover:bg-surface-container font-bold rounded-lg transition-colors text-xs uppercase"
            >
              <span className="material-symbols-outlined text-sm">event</span>
              <span>Schedule Callback</span>
            </button>
            <button 
              onClick={() => showToast('Audit logging details triggered')}
              className="p-3 text-on-surface-variant hover:bg-surface-container rounded-full"
            >
              <span className="material-symbols-outlined text-sm">more_vert</span>
            </button>
          </div>
        </footer>

      </section>
    </main>
  );
};

export default WctCallQueue;
