import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface UpsellLead {
  id: string;
  tmid: string;
  companyName: string;
  location: string;
  freePlanDate: string;
  daysSinceFree: number;
  contactName: string;
  contactPhone: string;
  lastCallNote: string;
  fleetSize: number;
  segment: string;
  avgKmMonth: string;
  preferredRoutes: string;
}

export const WctD7UpsellQueue: React.FC = () => {
  const navigate = useNavigate();

  const [leads] = useState<UpsellLead[]>([
    {
      id: 'TR_U1',
      tmid: 'TR-10024',
      companyName: 'Express Logistics Hub',
      location: 'Mumbai, MH',
      freePlanDate: '12 Jun 2026',
      daysSinceFree: 9,
      contactName: 'Rajesh Khanna',
      contactPhone: '+91-98765-43210',
      lastCallNote: 'Interested in fleet tracking module but wanted to test free version first.',
      fleetSize: 12,
      segment: 'Long-haul, FMCG',
      avgKmMonth: '10,000',
      preferredRoutes: 'Mumbai-Pune'
    },
    {
      id: 'TR_U2',
      tmid: 'TR-88219',
      companyName: 'Vishwa Transport',
      location: 'Pune, MH',
      freePlanDate: '13 Jun 2026',
      daysSinceFree: 8,
      contactName: 'Amitabh S.',
      contactPhone: '+91-98220-11000',
      lastCallNote: 'Owner requested a demo for bulk pricing next week.',
      fleetSize: 6,
      segment: 'Industrial Heavy Load',
      avgKmMonth: '12,000',
      preferredRoutes: 'Pune-Bangalore'
    },
    {
      id: 'TR_U3',
      tmid: 'TR-77631',
      companyName: 'Rapid Roadlines',
      location: 'Surat, GJ',
      freePlanDate: '14 Jun 2026',
      daysSinceFree: 7,
      contactName: 'Sanjay Patel',
      contactPhone: '+91-94260-55888',
      lastCallNote: 'Called twice, no response. Busy season.',
      fleetSize: 4,
      segment: 'Retail, Local Delivery',
      avgKmMonth: '6,000',
      preferredRoutes: 'Surat City'
    },
    {
      id: 'TR_U4',
      tmid: 'TR-10443',
      companyName: 'BlueSky Logistics',
      location: 'Delhi, NCR',
      freePlanDate: '14 Jun 2026',
      daysSinceFree: 7,
      contactName: 'Kiran Bedi',
      contactPhone: '+91-88001-22334',
      lastCallNote: 'High usage on free plan. Prime target for upsell call.',
      fleetSize: 9,
      segment: 'Long-haul, FMCG',
      avgKmMonth: '15,050',
      preferredRoutes: 'Delhi-Mumbai'
    }
  ]);

  const [selectedId, setSelectedId] = useState<string>('TR_U1');
  const [toast, setToast] = useState<string | null>(null);

  const selectedLead = leads.find(l => l.id === selectedId) || leads[0];

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpsellNow = (lead: UpsellLead) => {
    navigate('/wct/wct-active-call-focus', {
      state: {
        leadId: lead.id,
        tmid: lead.tmid,
        name: lead.companyName,
        contactName: lead.contactName,
        phone: lead.contactPhone,
        location: lead.location,
        fleetSize: lead.fleetSize,
        segment: lead.segment,
        avgKmMonth: lead.avgKmMonth,
        preferredRoutes: lead.preferredRoutes,
        subscribedStatus: 'free',
        whatsapp: true,
        history: [],
        notes: lead.lastCallNote
      }
    });
  };

  return (
    <main className="h-[calc(100vh-80px)] flex bg-white overflow-hidden border border-gray-200 rounded-xl relative">
      
      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FB641B]"></span>
          {toast}
        </div>
      )}

      {/* Left Table Panel */}
      <section className="flex-1 bg-white flex flex-col min-w-0">
        
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 shrink-0">
          <div>
            <h1 className="text-sm font-bold text-gray-800 uppercase tracking-wide">D+7 Upsell Queue</h1>
            <p className="text-xs text-gray-500 mt-0.5">Transporter Leads on Free tier approaching conversion deadline</p>
          </div>
          
          <div className="bg-white border border-gray-200 text-xs px-3 py-1.5 rounded-lg font-bold text-gray-700">
            {leads.length} leads pending
          </div>
        </div>

        {/* Scannable Table */}
        <div className="flex-1 overflow-y-auto min-h-0">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-100 text-gray-500 uppercase text-[9px] sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="p-3">Company</th>
                <th className="p-3">TMID</th>
                <th className="p-3">Free Plan Date</th>
                <th className="p-3 text-center">Days Since Free</th>
                <th className="p-3">Contact</th>
                <th className="p-3">Last Call Note</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {leads.map(lead => {
                const isSelected = lead.id === selectedId;
                return (
                  <tr 
                    key={lead.id}
                    onClick={() => setSelectedId(lead.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected ? 'bg-orange-50/20 font-semibold' : 'hover:bg-gray-50/50'
                    }`}
                  >
                    <td className="p-3">
                      <div>
                        <span className="font-bold text-gray-800 block">{lead.companyName}</span>
                        <span className="text-[10px] text-gray-400">{lead.location}</span>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-gray-500">{lead.tmid}</td>
                    <td className="p-3">{lead.freePlanDate}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        lead.daysSinceFree >= 9 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                      }`}>
                        {lead.daysSinceFree} Days
                      </span>
                    </td>
                    <td className="p-3">
                      <div>
                        <span className="font-semibold text-gray-800 block">{lead.contactName}</span>
                        <span className="text-[10px] text-gray-400">{lead.contactPhone}</span>
                      </div>
                    </td>
                    <td className="p-3 max-w-[200px] truncate italic text-gray-500">
                      "{lead.lastCallNote}"
                    </td>
                    <td className="p-3 text-right">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleUpsellNow(lead); }}
                        className="bg-[#FB641B] hover:bg-[#e4540d] text-white px-3 py-1.5 rounded font-bold text-[10px] shadow-sm active:scale-95 transition-all"
                      >
                        Upsell Now
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

      </section>

      {/* Right Column: Lead Detail Sidebar */}
      <section className="w-[360px] border-l border-gray-200 bg-white flex flex-col shrink-0 overflow-hidden">
        
        <div className="p-4 border-b border-gray-200 bg-gray-50/50 shrink-0">
          <span className="text-[10px] text-[#FB641B] font-bold uppercase tracking-wider block">Lead Profile Detail</span>
          <h3 className="text-base font-bold text-gray-900 mt-1 truncate">{selectedLead.companyName}</h3>
          <p className="text-[11px] text-gray-400 font-mono mt-0.5">{selectedLead.tmid}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 p-2.5 rounded border border-gray-150">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Fleet Size</span>
              <span className="block font-bold text-gray-800 text-sm mt-0.5">{selectedLead.fleetSize} trucks</span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded border border-gray-150">
              <span className="text-[10px] text-gray-400 uppercase font-semibold">Corridor Route</span>
              <span className="block font-bold text-gray-800 text-sm mt-0.5 truncate">{selectedLead.preferredRoutes}</span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Decision Maker</span>
            <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-orange-100 text-[#FB641B] flex items-center justify-center font-bold text-sm select-none">
                {selectedLead.contactName.slice(0,2).toUpperCase()}
              </div>
              <div 
                className="cursor-pointer group flex-1"
                title="Click to copy phone number"
                onClick={() => {
                  navigator.clipboard.writeText(selectedLead.contactPhone);
                  triggerToast('Phone number copied to clipboard ✓');
                }}
              >
                <span className="font-bold text-gray-800 block text-xs group-hover:text-[#FB641B] transition-colors">{selectedLead.contactName}</span>
                <span className="text-[10px] text-gray-400 group-hover:underline">{selectedLead.contactPhone}</span>
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fleet Details</span>
            <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-gray-500">Segment:</span>
                <span className="font-semibold">{selectedLead.segment}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Avg KM/Month:</span>
                <span className="font-semibold">{selectedLead.avgKmMonth} KM</span>
              </div>
            </div>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Last Outbound Note</span>
            <div className="bg-[#FFF9E6] border border-[#F2C94C] p-3 rounded-lg text-gray-700 italic">
              "{selectedLead.lastCallNote}"
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-gray-200 bg-white">
          <button
            onClick={() => handleUpsellNow(selectedLead)}
            className="w-full bg-[#FB641B] hover:bg-[#e4540d] text-white h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95"
          >
            <span className="material-symbols-outlined text-[18px]">phone</span> Call Now
          </button>
        </div>

      </section>

    </main>
  );
};

export default WctD7UpsellQueue;
