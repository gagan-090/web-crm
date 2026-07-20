import React, { useState, useEffect, useRef } from 'react';
import { useGetWctCampaignLeadsQuery, useUpdateWctCampaignLeadNotesMutation } from '../../services/api/webCrmApi';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';

interface CallHistory {
  date: string;
  duration: string;
  status: string;
  caller: string;
}

interface WctCampaignLead {
  id: number | string;
  tmid: string;
  name: string;
  phone: string;
  city: string | null;
  state: string | null;
  capturedTime: string;
  source: string;
  campaignName: string | null;
  adSet: string | null;
  leadForm: string | null;
  utmSource: string | null;
  utmMedium: string | null;
  utmCampaign: string | null;
  temperature: 'HOT' | 'WARM' | 'COLD';
  subscribed: boolean;
  whatsapp: boolean;
  notes: string;
  isConverted: boolean;
  isCallback: boolean;
  callbackTime?: string | null;
  openingScript: string;
  history: CallHistory[];
}

const getSourceChipStyle = (source: string): React.CSSProperties => {
  const s = (source || '').toUpperCase();
  if (s.includes('WHATSAPP') || s.includes('WA')) return { backgroundColor: '#25D366', color: '#fff' };
  if (s.includes('GOOGLE')) return { backgroundColor: '#4285F4', color: '#fff' };
  if (s.includes('INSTAGRAM') || s.includes('IG')) return { backgroundColor: '#E1306C', color: '#fff' };
  if (s.includes('META') || s.includes('FACEBOOK') || s.includes('FB')) return { backgroundColor: '#1877F2', color: '#fff' };
  if (s.includes('TOLLFREE') || s.includes('TOLL')) return { backgroundColor: '#0EA5A5', color: '#fff' };
  if (s.includes('OBD')) return { backgroundColor: '#8B5CF6', color: '#fff' };
  return { backgroundColor: '#7F8C8D', color: '#fff' };
};

const tempBorder = (t: string) => (t === 'HOT' ? 'border-red-500' : t === 'WARM' ? 'border-amber-500' : 'border-blue-500');

export const WctCampaignLeads: React.FC = () => {
  const { dial, agentState, callState } = useSanCti();

  const [selectedId, setSelectedId] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'all' | 'hot' | 'warm' | 'cold' | 'callbacks' | 'converted'>('all');
  const [sourceFilter, setSourceFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortBy, setSortBy] = useState<'temperature' | 'newest' | 'oldest' | 'callbacks'>('temperature');
  const [page, setPage] = useState<number>(1);
  const [toast, setToast] = useState<string | null>(null);

  const [notesText, setNotesText] = useState<string>('');
  const [saveTimestamp, setSaveTimestamp] = useState<string>('');
  const saveTimerRef = useRef<any | null>(null);

  const { data, isLoading, refetch } = useGetWctCampaignLeadsQuery({
    source: sourceFilter === 'ALL' ? undefined : sourceFilter,
    search: searchQuery || undefined,
    tab: activeTab,
    sort_by: sortBy,
    page,
    per_page: 20,
  }, { refetchOnMountOrArgChange: true });

  const [updateNotes] = useUpdateWctCampaignLeadNotesMutation();

  const leads: WctCampaignLead[] = (data?.leads || []).map((l: any) => ({ ...l, id: l.id }));
  const sources: string[] = data?.sources || [];

  useEffect(() => { setPage(1); }, [sourceFilter, searchQuery, activeTab, sortBy]);

  useEffect(() => {
    if (leads.length > 0) {
      setSelectedId((prev) => (prev && leads.some((l) => String(l.id) === prev)) ? prev : String(leads[0].id));
    } else {
      setSelectedId('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data]);

  const selectedLead = leads.find((l) => String(l.id) === selectedId) || leads[0];

  useEffect(() => {
    if (selectedLead) { setNotesText(selectedLead.notes || ''); setSaveTimestamp(''); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  // Refresh after a call's disposition completes — the called lead drops out
  // (excluded server-side, present in call_history_ivr), same as the queue.
  useEffect(() => {
    const onDone = () => { refetch(); };
    window.addEventListener('san-disposition-complete', onDone);
    return () => window.removeEventListener('san-disposition-complete', onDone);
  }, [refetch]);

  useEffect(() => () => { if (saveTimerRef.current) clearTimeout(saveTimerRef.current); }, []);

  const triggerToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const handleNotesChange = (val: string) => {
    setNotesText(val);
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(async () => {
      if (!selectedLead) return;
      try {
        await updateNotes({ id: selectedLead.id, notes: val }).unwrap();
        const now = new Date();
        setSaveTimestamp(`Saved at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
      } catch { setSaveTimestamp('Failed to save notes'); }
    }, 2000);
  };

  // Real in-place dial — logs to call_history_ivr (process = lead source) via
  // /call/initiate; the global PostCallDispositionModal captures disposition.
  const handleCallNow = (lead: WctCampaignLead) => {
    if (agentState !== 'ready') {
      triggerToast(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel (bottom-left).'
        : 'CTI agent is not ready yet — please wait a moment and try again.');
      return;
    }
    if (callState !== 'idle') { triggerToast('Finish the current call before dialing another lead.'); return; }
    if (!lead.phone) { triggerToast('This lead has no phone number on record.'); return; }
    setSelectedId(String(lead.id));
    dial(lead.phone, Number(lead.id), lead.name, lead.tmid, 'social_media');
    triggerToast(`Dialing ${lead.name || 'lead'}…`);
  };

  return (
    <main className="h-[calc(100vh-80px)] flex bg-white overflow-hidden border border-gray-200 rounded-xl relative">
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-red-500"></span>
          {toast}
        </div>
      )}

      {/* Left Panel — Campaign Queue */}
      <section className="w-[390px] border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0">
        <div className="bg-red-500/10 border-b border-red-200 px-3 py-2 text-[11px] text-red-800 font-semibold flex justify-between items-center shrink-0">
          <span className="flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px] text-red-500">alarm</span>
            <span>4-Hour First Call Campaign SLA Active</span>
          </span>
          <span className="bg-red-500 text-white font-mono text-[9px] px-1.5 py-0.5 rounded-full uppercase">SLA</span>
        </div>

        <div className="p-3 border-b border-gray-200 shrink-0 bg-white space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Transporter Campaign Queue</span>
            <div className="flex items-center gap-1">
              <button onClick={() => refetch()} className="text-gray-400 hover:text-red-500" title="Refresh">
                <span className="material-symbols-outlined text-[15px]">refresh</span>
              </button>
              <span className="text-[10px] text-gray-400">Sort:</span>
              <select value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-[11px] font-semibold text-gray-700 border-none outline-none cursor-pointer focus:ring-0 p-0">
                <option value="temperature">Temperature</option>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="callbacks">Callbacks First</option>
              </select>
            </div>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[15px]">search</span>
            <input value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search name, mobile…"
              className="pl-7 pr-2 h-8 w-full border border-gray-200 rounded text-[11px] outline-none focus:ring-1 focus:ring-red-500" />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-500 shrink-0 font-medium">Source:</span>
            <select value={sourceFilter} onChange={(e) => setSourceFilter(e.target.value)}
              className="flex-1 text-[11px] font-semibold text-gray-700 bg-gray-50 border border-gray-200 rounded px-2 py-1 outline-none">
              <option value="ALL">All Campaign Sources</option>
              {sources.map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'all', label: 'All Leads' },
              { id: 'hot', label: '🔥 Hot' },
              { id: 'warm', label: '~ Warm' },
              { id: 'cold', label: '❄ Cold' },
              { id: 'callbacks', label: 'Callbacks' },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors ${
                  activeTab === tab.id ? 'bg-red-500 text-white border-red-500' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-gray-100">
          {isLoading ? (
            <div className="p-8 text-center text-gray-400 text-xs italic">Loading campaign leads…</div>
          ) : leads.length > 0 ? (
            leads.map((l) => (
              <div key={l.id} onClick={() => setSelectedId(String(l.id))}
                className={`p-3 cursor-pointer flex border-l-4 transition-all ${tempBorder(l.temperature)} ${
                  String(l.id) === selectedId ? 'bg-red-500/5 font-medium' : 'bg-white hover:bg-gray-50'
                }`}>
                <div className="flex-1 min-w-0 pr-2">
                  <div className="flex items-center justify-between gap-1">
                    <span className="text-sm font-bold text-gray-900 truncate">{l.name}</span>
                    <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded tracking-wide shrink-0" style={getSourceChipStyle(l.source)}>{l.source}</span>
                  </div>
                  <div className="text-[12px] text-gray-500 mt-1 flex justify-between">
                    <span className="font-mono text-gray-400">**********</span>
                    <span className="text-[10px] text-gray-400 bg-gray-100 px-1 rounded font-mono">{l.tmid}</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-2 flex justify-between items-center">
                    <span>Captured: {l.capturedTime}</span>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase ${
                      l.temperature === 'HOT' ? 'bg-red-50 text-red-600' : l.temperature === 'WARM' ? 'bg-amber-50 text-amber-600' : 'bg-blue-50 text-blue-600'
                    }`}>{l.temperature}</span>
                  </div>
                  {l.isCallback && l.callbackTime && (
                    <div className="mt-1 text-[10px] text-amber-600 font-semibold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[12px]">schedule</span>
                      Callback: {l.callbackTime}
                    </div>
                  )}
                </div>
                <div className="flex flex-col justify-center">
                  <button onClick={(e) => { e.stopPropagation(); handleCallNow(l); }}
                    className="w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow transition-transform active:scale-95"
                    title="Call Now">
                    <span className="material-symbols-outlined text-[16px]">call</span>
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-8 text-center text-gray-400 text-xs italic">No transporter campaign leads found.</div>
          )}
        </div>
      </section>

      {/* Right Panel — Detail */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">
        {!selectedLead ? (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic p-8 text-center">
            Select a campaign lead to view details.
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">{selectedLead.name}</h1>
                  <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{selectedLead.tmid}</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded tracking-wider uppercase" style={getSourceChipStyle(selectedLead.source)}>{selectedLead.source}</span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                    selectedLead.temperature === 'HOT' ? 'bg-red-500 text-white' : selectedLead.temperature === 'WARM' ? 'bg-amber-500 text-white' : 'bg-blue-500 text-white'
                  }`}>{selectedLead.temperature} LEAD</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Contact: {selectedLead.name}
                  {(selectedLead.city || selectedLead.state) ? ` | ${[selectedLead.city, selectedLead.state].filter(Boolean).join(', ')}` : ''}
                  {' | **********'}
                </p>
              </div>
              <button onClick={() => handleCallNow(selectedLead)}
                className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-5 py-2.5 rounded-lg shadow-md font-bold transition-all active:scale-95 text-sm shrink-0">
                <span className="material-symbols-outlined text-[18px]">call</span>
                Start Campaign Call
              </button>
            </div>

            <hr className="border-gray-200" />

            {/* Attribution */}
            <div className="bg-gradient-to-r from-red-500/5 to-amber-500/5 border border-red-500/20 rounded-xl p-4 space-y-3">
              <h2 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-red-500">campaign</span>
                Transporter Campaign Attribution Details
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-xs">
                <div><span className="text-gray-400 block mb-0.5">Source</span><span className="font-bold text-gray-800">{selectedLead.source || '—'}</span></div>
                <div><span className="text-gray-400 block mb-0.5">Campaign Name</span><span className="font-semibold text-gray-800">{selectedLead.campaignName || '—'}</span></div>
                <div><span className="text-gray-400 block mb-0.5">Captured</span><span className="font-semibold text-gray-800">{selectedLead.capturedTime}</span></div>
                <div><span className="text-gray-400 block mb-0.5">UTM Source</span><span className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded">{selectedLead.utmSource || '—'}</span></div>
                <div><span className="text-gray-400 block mb-0.5">UTM Medium</span><span className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded">{selectedLead.utmMedium || '—'}</span></div>
                <div><span className="text-gray-400 block mb-0.5">UTM Campaign</span><span className="font-mono text-gray-700 bg-gray-100 px-1 py-0.5 rounded">{selectedLead.utmCampaign || '—'}</span></div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5 border-b border-gray-100 pb-2">
                  <span className="material-symbols-outlined text-[16px] text-primary">local_shipping</span>
                  Transporter Profile Details
                </h3>
                <table className="w-full text-xs text-left">
                  <tbody>
                    <tr className="border-b border-gray-50"><td className="py-2 text-gray-400">Lead Source</td><td className="py-2 font-bold text-gray-800">{selectedLead.source || '—'}</td></tr>
                    <tr className="border-b border-gray-50"><td className="py-2 text-gray-400">Temperature</td><td className="py-2 font-bold text-red-600">{selectedLead.temperature}</td></tr>
                    <tr className="border-b border-gray-50"><td className="py-2 text-gray-400">Callback</td><td className="py-2 font-bold text-gray-800">{selectedLead.isCallback && selectedLead.callbackTime ? selectedLead.callbackTime : '—'}</td></tr>
                    <tr><td className="py-2 text-gray-400">WhatsApp</td><td className={`py-2 font-bold ${selectedLead.whatsapp ? 'text-[#27AE60]' : 'text-gray-400'}`}>{selectedLead.whatsapp ? 'Yes' : 'No'}</td></tr>
                  </tbody>
                </table>
              </div>

              <div className="border border-red-200 rounded-xl p-4 space-y-3 bg-red-50/20">
                <h3 className="text-xs font-bold text-red-800 uppercase tracking-wider flex items-center gap-1.5 border-b border-red-100 pb-2">
                  <span className="material-symbols-outlined text-[16px] text-red-500">rate_review</span>
                  Campaign Opening Script Assist
                </h3>
                <p className="text-xs text-gray-700 italic bg-white p-3 rounded-lg border border-red-100 shadow-sm leading-relaxed">
                  "{selectedLead.openingScript}"
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider">Caller Notes</label>
                <span className="text-[10px] text-gray-400 font-mono">{saveTimestamp}</span>
              </div>
              <textarea value={notesText} onChange={(e) => handleNotesChange(e.target.value)}
                placeholder="Type call notes here… Auto-saves in 2 seconds"
                className="w-full h-24 border border-gray-200 rounded-lg p-3 text-xs focus:ring-1 focus:ring-red-500 focus:border-red-500 outline-none" />
            </div>

            <div className="border border-gray-200 rounded-xl p-4 space-y-3 bg-white">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider border-b border-gray-100 pb-2">Engagement History</h3>
              {selectedLead.history && selectedLead.history.length > 0 ? (
                <div className="space-y-2.5">
                  {selectedLead.history.map((hist, i) => (
                    <div key={i} className="flex justify-between items-center text-xs text-gray-600 bg-gray-50 p-2.5 rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${hist.status === 'Connected' ? 'bg-[#27AE60]' : 'bg-red-500'}`}></span>
                        <span className="font-bold text-gray-800">{hist.status}</span>
                        <span className="text-[11px] text-gray-400">Duration: {hist.duration}</span>
                      </div>
                      <div className="text-[11px] text-gray-400"><span>{hist.date}</span> | <span className="font-semibold">{hist.caller}</span></div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic text-center py-2">No calls logged yet. Fresh transporter campaign lead.</p>
              )}
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

export default WctCampaignLeads;
