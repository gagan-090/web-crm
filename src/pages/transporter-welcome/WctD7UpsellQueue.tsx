import React, { useState, useEffect } from 'react';
import { useGetWctD7UpsellQuery } from '../../services/api/webCrmApi';
import type { WctD7UpsellLead } from '../../services/api/webCrmApi';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';

// WCT · D+7 Upsell Queue — real transporters assigned to this caller who have
// been on the FREE tier for 7+ days (WctCallerController::d7UpsellQueue). The
// "Upsell Now" / "Call Now" buttons place a real SAN CTI call exactly like the
// Call Queue; the global PostCallDispositionModal captures the disposition and
// this list auto-refreshes when it completes.
export const WctD7UpsellQueue: React.FC = () => {
  const { dial, callState, agentState } = useSanCti();

  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetWctD7UpsellQuery({
    per_page: 50,
    page,
    search: search || undefined,
  });

  const leads: WctD7UpsellLead[] = data?.data?.leads || [];
  const pagination = data?.data?.pagination;

  // Keep a valid selection as the list changes.
  useEffect(() => {
    if (leads.length > 0) {
      setSelectedId(prev => (prev && leads.some(l => l.id === prev)) ? prev : leads[0].id);
    } else {
      setSelectedId(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const selectedLead = leads.find(l => l.id === selectedId) || leads[0];

  // Auto-refresh when a call dialed from this screen completes its disposition
  // (global PostCallDispositionModal fires this on the window).
  useEffect(() => {
    const onDispositionComplete = () => { refetch(); };
    window.addEventListener('san-disposition-complete', onDispositionComplete);
    return () => window.removeEventListener('san-disposition-complete', onDispositionComplete);
  }, [refetch]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleUpsellNow = (lead: WctD7UpsellLead) => {
    if (agentState !== 'ready') {
      triggerToast(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel (bottom-left) for the reason.'
        : 'CTI agent is not ready yet — please wait a moment and try again.');
      return;
    }
    if (callState !== 'idle') {
      triggerToast('Finish or hang up the current call before dialing another transporter.');
      return;
    }
    if (!lead.phone) {
      triggerToast('This transporter has no phone number on record.');
      return;
    }
    setSelectedId(lead.id);
    dial(lead.phone, lead.id, lead.company_name, lead.tmid, 'transporter');
    triggerToast(`Dialing ${lead.company_name}…`);
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
        <div className="p-4 border-b border-gray-200 flex justify-between items-center gap-3 bg-gray-50/50 shrink-0">
          <div>
            <h1 className="text-sm font-bold text-gray-800 uppercase tracking-wide">D+7 Upsell Queue</h1>
            <p className="text-xs text-gray-500 mt-0.5">Transporter Leads on Free tier approaching conversion deadline</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">search</span>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search company, TMID, mobile…"
                className="pl-8 pr-3 h-9 w-64 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#FB641B]"
              />
            </div>
            <button
              onClick={() => refetch()}
              className="text-gray-400 hover:text-[#FB641B] transition-colors"
              title="Refresh queue"
            >
              <span className={`material-symbols-outlined text-[18px] ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
            </button>
            <div className="bg-white border border-gray-200 text-xs px-3 py-1.5 rounded-lg font-bold text-gray-700 whitespace-nowrap">
              {pagination?.total ?? leads.length} leads pending
            </div>
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
              {isLoading ? (
                <tr><td colSpan={7} className="p-10 text-center text-gray-400 italic">Loading upsell queue…</td></tr>
              ) : leads.length === 0 ? (
                <tr><td colSpan={7} className="p-10 text-center text-gray-400 italic">No free-tier transporters past the D+7 deadline.</td></tr>
              ) : (
                leads.map(lead => {
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
                          <span className="font-bold text-gray-800 block">{lead.company_name}</span>
                          <span className="text-[10px] text-gray-400">{lead.location}</span>
                        </div>
                      </td>
                      <td className="p-3 font-mono text-gray-500">{lead.tmid}</td>
                      <td className="p-3 whitespace-nowrap">{lead.free_plan_date}</td>
                      <td className="p-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          lead.days_since_free >= 9 ? 'bg-red-50 text-red-600' : 'bg-orange-50 text-orange-600'
                        }`}>
                          {lead.days_since_free} Days
                        </span>
                      </td>
                      <td className="p-3">
                        <div>
                          <span className="font-semibold text-gray-800 block">{lead.contact_name}</span>
                          <span className="text-[10px] text-gray-400">{lead.phone || '—'}</span>
                        </div>
                      </td>
                      <td className="p-3 max-w-[200px] truncate italic text-gray-500">
                        {lead.last_call_note ? `"${lead.last_call_note}"` : <span className="not-italic text-gray-300">No note yet</span>}
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
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 text-xs text-gray-500 shrink-0">
            <span>Page {pagination.current_page} of {pagination.last_page} · {pagination.total} leads</span>
            <div className="flex gap-2">
              <button
                disabled={page <= 1 || isFetching}
                onClick={() => setPage(p => Math.max(1, p - 1))}
                className="px-3 py-1 border border-gray-200 rounded-lg font-semibold disabled:opacity-40 hover:bg-gray-50"
              >Prev</button>
              <button
                disabled={page >= pagination.last_page || isFetching}
                onClick={() => setPage(p => p + 1)}
                className="px-3 py-1 border border-gray-200 rounded-lg font-semibold disabled:opacity-40 hover:bg-gray-50"
              >Next</button>
            </div>
          </div>
        )}

      </section>

      {/* Right Column: Lead Detail Sidebar */}
      <section className="w-[360px] border-l border-gray-200 bg-white flex flex-col shrink-0 overflow-hidden">

        {!selectedLead ? (
          <div className="flex-1 flex items-center justify-center text-xs text-gray-400 italic p-4 text-center">
            Select a transporter to see their profile.
          </div>
        ) : (
          <>
            <div className="p-4 border-b border-gray-200 bg-gray-50/50 shrink-0">
              <span className="text-[10px] text-[#FB641B] font-bold uppercase tracking-wider block">Lead Profile Detail</span>
              <h3 className="text-base font-bold text-gray-900 mt-1 truncate">{selectedLead.company_name}</h3>
              <p className="text-[11px] text-gray-400 font-mono mt-0.5">{selectedLead.tmid}</p>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 p-2.5 rounded border border-gray-150">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Fleet Size</span>
                  <span className="block font-bold text-gray-800 text-sm mt-0.5">{selectedLead.fleet_size ? `${selectedLead.fleet_size} trucks` : '—'}</span>
                </div>
                <div className="bg-gray-50 p-2.5 rounded border border-gray-150">
                  <span className="text-[10px] text-gray-400 uppercase font-semibold">Days on Free</span>
                  <span className="block font-bold text-gray-800 text-sm mt-0.5">{selectedLead.days_since_free} days</span>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Decision Maker</span>
                <div className="bg-white p-3 rounded-lg border border-gray-200 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-orange-100 text-[#FB641B] flex items-center justify-center font-bold text-sm select-none">
                    {(selectedLead.contact_name || '?').slice(0, 2).toUpperCase()}
                  </div>
                  <div
                    className="cursor-pointer group flex-1 min-w-0"
                    title="Click to copy phone number"
                    onClick={() => {
                      if (!selectedLead.phone) return;
                      navigator.clipboard.writeText(selectedLead.phone);
                      triggerToast('Phone number copied to clipboard ✓');
                    }}
                  >
                    <span className="font-bold text-gray-800 block text-xs group-hover:text-[#FB641B] transition-colors truncate">{selectedLead.contact_name}</span>
                    <span className="text-[10px] text-gray-400 group-hover:underline">{selectedLead.phone || '—'}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Fleet Details</span>
                <div className="bg-white p-3 rounded-lg border border-gray-200 space-y-1.5">
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Segment:</span>
                    <span className="font-semibold text-right truncate">{selectedLead.segment}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Location:</span>
                    <span className="font-semibold text-right truncate">{selectedLead.location}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-500">Free Plan Since:</span>
                    <span className="font-semibold text-right">{selectedLead.free_plan_date}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Last Outbound Note</span>
                <div className="bg-[#FFF9E6] border border-[#F2C94C] p-3 rounded-lg text-gray-700 italic">
                  {selectedLead.last_call_note ? `"${selectedLead.last_call_note}"` : <span className="not-italic text-gray-400">No previous call note for this transporter.</span>}
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
          </>
        )}

      </section>

    </main>
  );
};

export default WctD7UpsellQueue;
