import React, { useState, useEffect, useRef } from 'react';
import {
  useGetWctLeadDetailQuery,
  useGetDwLeadDetailQuery,
  useLazyGetWctGlobalSearchQuery,
} from '../../services/api/webCrmApi';
import type { DwLead } from '../../services/api/webCrmApi';
import {
  useQueueCache,
  useQueueCountsCache,
  invalidateQueueCache,
  endpointRoleFor,
  LEAD_ROLES,
  leadRoleMeta,
} from '../../shared/hooks/useQueueCache';
import type { QueueType, LeadRole } from '../../shared/hooks/useQueueCache';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';
import CrossRoleLeadDetail from '../shared/CrossRoleLeadDetail';
import RegistrationDateFilter from '../../shared/components/business/RegistrationDateFilter';
import type { RegDateRange } from '../../shared/components/business/RegistrationDateFilter';

// Minutes since an ISO/SQL timestamp (best-effort; 0 when unparseable).
const minutesSince = (ts?: string | null): number => {
  if (!ts) return 0;
  const t = new Date(ts.replace(' ', 'T')).getTime();
  if (Number.isNaN(t)) return 0;
  return Math.max(0, Math.floor((Date.now() - t) / 60000));
};

// Map the real transporter queue row (DwLead shape, retargeted) to the
// display model this two-pane screen renders.
const mapLead = (l: DwLead): TransporterLead => {
  const regMins = minutesSince(l.registered_at);
  const subscribed = (l.last_payment && l.last_payment > 0) || !!l.current_plan;
  const status = (l.last_status || '').toLowerCase();
  const history: CallHistory[] = l.last_call_at
    ? [{
        date: l.last_call_at,
        duration: l.bill_duration || 'Call logged',
        status: status === 'connected' ? 'Connected' : status === 'callback_later' ? 'Callback' : status ? 'NR' : 'NEW',
        caller: 'You',
      }]
    : [];
  return {
    id: String(l.id),
    tmid: l.tmid || `TR-${l.id}`,
    companyName: l.name || `Transporter ${l.id}`,
    contactName: l.name || 'Contact POC',
    phone: l.mobile || '',
    city: l.city || '',
    state: l.state || '',
    registeredMinutesAgo: regMins,
    slaMinutesLeft: 240 - regMins, // 4-business-hour first-call SLA (approx)
    fleetSize: 0,
    callAttempts: Number(l.call_count) || 0,
    segment: l.vehicle_type || '—',
    avgKmMonth: '—',
    preferredRoutes: '—',
    subscribedStatus: subscribed ? 'premium' : 'none',
    subscribedDate: l.subscription_date || undefined,
    jobsPosted: 0,
    jobsFilled: 0,
    whatsapp: !!l.mobile,
    notes: l.last_remarks || '',
    lastFeedback: (l as any).last_feedback || '',
    agreedAt: (l as any).agreed_at || '',
    history,
  };
};

// A global-search hit shaped into the model this screen renders. Only the
// identity fields are known from search; the rest of the profile arrives from
// the leadDetail query that `selectedId` drives, exactly as for a queue lead.
const mapSearchResult = (res: any): TransporterLead => ({
  id: String(res.id),
  tmid: res.tmid || `TR-${res.id}`,
  companyName: res.name || `Lead ${res.id}`,
  contactName: res.name || 'Contact POC',
  phone: res.mobile || '',
  city: res.city || '',
  state: res.state || '',
  registeredMinutesAgo: 0,
  slaMinutesLeft: 0,
  fleetSize: 0,
  callAttempts: 0,
  segment: '—',
  avgKmMonth: '—',
  preferredRoutes: '—',
  subscribedStatus: 'none',
  jobsPosted: 0,
  jobsFilled: 0,
  whatsapp: !!res.mobile,
  notes: '',
  lastFeedback: '',
  agreedAt: '',
  history: [],
});

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
  callAttempts: number;
  segment: string;
  avgKmMonth: string;
  preferredRoutes: string;
  subscribedStatus: 'none' | 'free' | 'premium' | 'super';
  subscribedDate?: string;
  jobsPosted: number;
  jobsFilled: number;
  whatsapp: boolean;
  notes: string;
  lastFeedback: string;
  agreedAt: string;
  history: CallHistory[];
}

export const WctCallQueue: React.FC = () => {
  const { dial, callState, agentState } = useSanCti();

  // DWC-style queue: server-side tabs (Fresh / All / Old / Uncalled / Callbacks
  // / Called) with live counts, powered by the WCT queue cache.
  const [activeTab, setActiveTab] = useState<QueueType>('all');
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  // Registration-date window (users.Created_at). Part of the queue cache key,
  // so each range gets its own cached page rather than reusing another's.
  const [regDates, setRegDates] = useState<RegDateRange>({});
  // Mixed-desk toggle: a TWC caller can work every kind of lead assigned to them
  // — transporter (this desk's native role), driver, association, foreman,
  // puncture shop, dhaba. The queue endpoints filter assigned_to = this caller +
  // users.role, so switching the role reuses them 1:1. Remembered per session.
  const ROLE_KEY = 'wct_queue_lead_role';
  const [leadRole, setLeadRole] = useState<LeadRole>(() => {
    const stored = sessionStorage.getItem(ROLE_KEY) as LeadRole | null;
    return stored && (LEAD_ROLES as readonly string[]).includes(stored) ? stored : 'transporter';
  });
  useEffect(() => { sessionStorage.setItem(ROLE_KEY, leadRole); }, [leadRole]);
  const queueRole = endpointRoleFor(leadRole);

  const { data: queueData, isLoading: queueLoading, isFetching: queueFetching, refetch: refetchQueue, removeLead } =
    useQueueCache(activeTab, { page, search, per_page: 50 }, regDates, queueRole, leadRole);
  const { counts, refetch: refetchCounts } = useQueueCountsCache(queueRole, leadRole, regDates);

  useEffect(() => { setPage(1); }, [activeTab, search, leadRole, regDates.reg_from, regDates.reg_to]);

  const leads: TransporterLead[] = (queueData?.leads || []).map(mapLead);

  const [selectedId, setSelectedId] = useState<string>('');

  /**
   * A lead opened from GLOBAL SEARCH rather than picked out of the queue.
   *
   * Global search reaches the whole user base, so the person found is usually
   * assigned to someone else and is therefore NOT in `leads`. Without holding
   * them separately, two things silently discarded the selection: `selectedLead`
   * fell back to `leads[0]`, so the panel showed the first queue lead instead of
   * the searched one (and both detail queries fetched that wrong id), and the
   * auto-select effect below reset `selectedId` back to `leads[0].id` on the
   * next queue refresh.
   */
  const [externalLead, setExternalLead] = useState<TransporterLead | null>(null);

  useEffect(() => {
    // A globally-searched lead is not in the queue by definition — leave it be.
    if (externalLead) return;

    if (leads.length > 0) {
      setSelectedId(prev => (prev && leads.some(m => m.id === prev)) ? prev : leads[0].id);
    } else {
      setSelectedId('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queueData, externalLead]);

  const [sortBy, setSortBy] = useState<'sla' | 'reg' | 'callbacks'>('sla');
  const [toast, setToast] = useState<string | null>(null);

  // Note auto-save states
  const [notesText, setNotesText] = useState<string>('');
  const [saveTimestamp, setSaveTimestamp] = useState<string>('');
  const saveTimerRef = useRef<any | null>(null);

  // The searched lead wins: it is not in `leads`, and falling through to
  // leads[0] is exactly what made the card open on the wrong person.
  const selectedLead = externalLead
    ?? leads.find(l => l.id === selectedId)
    ?? leads[0];

  // Full transporter detail (profile, subscription, posted jobs, real call
  // history) for the selected lead — the same depth the Driver Welcome screen
  // shows, retargeted to transporters via WctCallerController::leadDetail.
  const { data: detailData, isFetching: detailLoading, refetch: refetchDetail } = useGetWctLeadDetailQuery(
    selectedLead ? Number(selectedLead.id) : 0,
    { skip: !selectedLead || leadRole !== 'transporter' }
  );
  const detail = detailData?.data;

  // Cross-desk (driver) detail — fetched from the DW leadDetail endpoint when
  // the toggle is on 'Driver'. Same response shape, rendered via the shared
  // universal panel below.
  const { data: driverDetailData, isFetching: driverDetailLoading, refetch: refetchDriverDetail } = useGetDwLeadDetailQuery(
    selectedLead ? Number(selectedLead.id) : 0,
    { skip: !selectedLead || leadRole === 'transporter' }
  );

  useEffect(() => {
    if (selectedLead) {
      setNotesText(selectedLead.notes);
      setSaveTimestamp('');
    }
  }, [selectedId]);

  // ── Global search ──────────────────────────────────────────────────────────
  // Reaches the WHOLE user base (roles=all), not just this agent's queue, so a
  // caller can pull up — and now phone — any transporter or driver by name,
  // TMID or number. Mirrors the Driver Welcome / Matchmaking queue search.
  const [globalSearchInput, setGlobalSearchInput] = useState('');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const globalSearchRef = useRef<HTMLDivElement>(null);
  const [triggerGlobalSearch, { data: globalSearchData, isFetching: isGlobalSearchFetching }] =
    useLazyGetWctGlobalSearchQuery();

  // Close the dropdown on any click outside it.
  useEffect(() => {
    const onClickOutside = (event: MouseEvent) => {
      if (globalSearchRef.current && !globalSearchRef.current.contains(event.target as Node)) {
        setIsGlobalSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  // Debounced — the backend ignores anything under 3 characters anyway, and
  // firing per keystroke would hammer a LIKE query over the whole users table.
  useEffect(() => {
    const timer = setTimeout(() => {
      const trimmed = globalSearchInput.trim();
      if (trimmed.length >= 3) {
        triggerGlobalSearch({ q: trimmed, roles: 'all' });
        setIsGlobalSearchOpen(true);
      } else {
        setIsGlobalSearchOpen(false);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [globalSearchInput, triggerGlobalSearch]);

  const handleNotesChange = (val: string) => {
    setNotesText(val);
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }
    saveTimerRef.current = setTimeout(() => {
      const now = new Date();
      setSaveTimestamp(`Saved at ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`);
    }, 5000);
  };

  useEffect(() => {
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, []);

  // When a call dialed from this screen completes its disposition (via the
  // global PostCallDispositionModal in DashboardLayout), auto-refresh the list
  // and tab counts and drop the just-called transporter — the next lead is then
  // auto-selected by the selection effect above, which reloads the right-hand
  // profile/notes form. No manual refresh needed.
  useEffect(() => {
    const onDispositionComplete = () => {
      invalidateQueueCache(queueRole);
      refetchCounts();
      refetchQueue();

      // Refresh the OPEN PROFILE too, not just the list. Without this the
      // right-hand panel kept serving the response cached before the call, so
      // the agent finished a call and still saw "Total Calls 0" and "No
      // previous calls — first attempt" for a lead they had just spoken to.
      // Only the active query has a live subscription; refetch() on a skipped
      // one throws "Cannot refetch a query that has not been started yet".
      if (selectedLead) {
        if (leadRole === 'transporter') refetchDetail();
        else refetchDriverDetail();
      }

      // A globally-searched lead was never in this queue, so there is nothing
      // to drop — and dropping by that id would evict an unrelated row.
      if (selectedId && !externalLead) removeLead(Number(selectedId));
    };
    window.addEventListener('san-disposition-complete', onDispositionComplete);
    return () => window.removeEventListener('san-disposition-complete', onDispositionComplete);
  }, [selectedId, selectedLead, leadRole, externalLead, removeLead, refetchCounts, refetchQueue, refetchDetail, refetchDriverDetail, queueRole]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

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

  // Server already filters by the active tab; apply only the client-side sort.
  const filteredLeads = [...leads].sort((a, b) => {
    if (sortBy === 'reg') return b.registeredMinutesAgo - a.registeredMinutesAgo;
    return a.slaMinutesLeft - b.slaMinutesLeft; // SLA urgency (default)
  });

  // Active call trigger — places a real SAN CTI call. SanCtiProvider logs the
  // call into call_history_ivr and the global PostCallDispositionModal captures
  // the disposition, exactly like the Driver Welcome flow.
  const handleCallNow = (lead: TransporterLead) => {
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
    dial(lead.phone, Number(lead.id), lead.companyName, lead.tmid, leadRole);
    triggerToast(`Dialing ${lead.companyName}…`);
  };

  /**
   * Dial a lead found through global search.
   *
   * Search reaches every user in the database, including transporters and
   * drivers assigned to another agent or to nobody. Assignment decides whose
   * QUEUE a lead sits in, not who is allowed to phone them — the call is
   * logged against whoever placed it regardless.
   */
  const handleGlobalSearchCall = (res: any) => {
    if (!res?.mobile) { triggerToast('This lead has no phone number on file.'); return; }
    if (agentState !== 'ready') {
      triggerToast(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel (bottom-left) for the reason.'
        : 'CTI agent is not ready yet — please wait a moment and try again.');
      return;
    }
    if (callState !== 'idle') {
      triggerToast('Finish or hang up the current call before dialing another lead.');
      return;
    }

    const isSocial = res.source === 'social_media';
    const r = String(res.role || 'transporter').toLowerCase();
    const nextRole = (LEAD_ROLES as readonly string[]).includes(r) ? (r as LeadRole) : 'transporter';

    // Show the lead's profile alongside the call, the same as picking them
    // from the queue does.
    setLeadRole(nextRole);
    setExternalLead(mapSearchResult(res));
    setSelectedId(String(res.id));
    setIsGlobalSearchOpen(false);
    setGlobalSearchInput('');

    dial(res.mobile, Number(res.id), res.name, res.tmid, isSocial ? 'social_media' : nextRole);
    triggerToast(`Dialing ${res.name || res.mobile}…`);
  };

  return (
    <main className="max-h-[calc(100vh-80px)] h-[calc(100vh-80px)] flex bg-white overflow-hidden border border-gray-200 rounded-xl relative">
      
      {/* Toast */}
      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#FB641B]"></span>
          {toast}
        </div>
      )}

      {/* Left Panel: Staging Call Queue */}
      <section className="w-[380px] border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0">

        {/* Global Search Header */}
        <div className="p-3 border-b border-gray-200 bg-gray-50 shrink-0 relative" ref={globalSearchRef}>
          <div className="relative w-full flex items-center">
            <span className="material-symbols-outlined absolute left-2 text-gray-400 text-[18px]">search</span>
            <input
              type="text"
              placeholder="Search ANY user — name, TMID, mobile…"
              value={globalSearchInput}
              onChange={(e) => setGlobalSearchInput(e.target.value)}
              onFocus={() => { if (globalSearchInput.length >= 3) setIsGlobalSearchOpen(true); }}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-[#FB641B] outline-none shadow-inner"
            />
            {isGlobalSearchFetching && (
              <span className="material-symbols-outlined absolute right-2 text-gray-400 text-[16px] animate-spin">sync</span>
            )}
          </div>

          {isGlobalSearchOpen && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-white border border-gray-200 shadow-xl rounded-lg z-50 max-h-[300px] overflow-y-auto divide-y divide-gray-100">
              {isGlobalSearchFetching ? (
                <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[16px] animate-spin text-[#FB641B]">sync</span>
                  Searching...
                </div>
              ) : globalSearchData?.data && globalSearchData.data.length > 0 ? (
                globalSearchData.data.map((res: any) => (
                  <div
                    key={`${res.source}-${res.id}`}
                    onClick={() => {
                      const r = String(res.role || 'transporter').toLowerCase();
                      const nextRole = (LEAD_ROLES as readonly string[]).includes(r) ? (r as LeadRole) : 'transporter';
                      setLeadRole(nextRole);
                      // Hold the lead outside the queue list — it isn't in it.
                      setExternalLead(mapSearchResult(res));
                      setSelectedId(String(res.id));
                      setIsGlobalSearchOpen(false);
                      setGlobalSearchInput('');
                    }}
                    className="p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center gap-2 transition-colors"
                  >
                    <div className="min-w-0">
                      <div className="text-sm font-bold text-gray-900 flex items-center gap-2 truncate">
                        {res.name}
                        {res.source === 'social_media' ? (
                          <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded border border-purple-200 shrink-0">SML</span>
                        ) : res.role && (
                          <span className="bg-gray-100 text-gray-600 text-[9px] px-1.5 py-0.5 rounded border border-gray-200 uppercase shrink-0">{res.role}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 truncate">
                        {res.city ? `${res.city} | ` : ''}
                        <span className={res.assigned_name === 'Unassigned' ? 'text-amber-600 font-medium' : 'text-gray-500'}>
                          {res.assigned_name === 'Unassigned' ? 'Unassigned' : `Assigned: ${res.assigned_name}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-mono text-gray-600 bg-gray-100 px-1 rounded">{res.tmid}</div>
                        <div className="text-[11px] font-medium text-[#27AE60] mt-0.5">
                          {res.mobile ? res.mobile.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : '**********'}
                        </div>
                      </div>
                      {/* Call regardless of assignment. stopPropagation so the
                          row's own click (open profile) doesn't also fire. */}
                      <button
                        onClick={(e) => { e.stopPropagation(); handleGlobalSearchCall(res); }}
                        disabled={!res.mobile}
                        title={res.mobile ? `Call ${res.name}` : 'No phone number on file'}
                        className="shrink-0 w-8 h-8 rounded-full bg-[#27AE60] hover:bg-[#219653] text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        <span className="material-symbols-outlined text-[16px]">call</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-4 text-center text-xs text-gray-500 italic">No matches found.</div>
              )}
            </div>
          )}
        </div>

        {/* Tab Filter Header */}
        <div className="p-3 border-b border-gray-200 shrink-0 bg-white">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#17376B] uppercase tracking-wider">{leadRoleMeta[leadRole].label} Queue</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => { refetchQueue(); refetchCounts(); }}
                className="text-gray-400 hover:text-[#FB641B] transition-colors"
                title="Refresh queue"
              >
                <span className={`material-symbols-outlined text-[16px] ${queueFetching ? 'animate-spin' : ''}`}>refresh</span>
              </button>
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

          {/* Lead-role toggle — every kind of lead this desk can be assigned */}
          <div className="grid grid-cols-3 gap-1 mb-2 p-0.5 bg-gray-100 rounded-lg">
            {LEAD_ROLES.map(r => (
              <button
                key={r}
                onClick={() => { setLeadRole(r); setExternalLead(null); setSelectedId(''); }}
                title={`${leadRoleMeta[r].label} leads assigned to you`}
                className={`py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-1 ${
                  leadRole === r ? 'bg-[#FB641B] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{leadRoleMeta[r].icon}</span>
                {leadRoleMeta[r].label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative mb-2">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">search</span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, TMID, mobile…"
              className="pl-7 pr-2 h-8 w-full border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#FB641B]"
            />
          </div>

          {/* Registration date window — applies to every tab below. */}
          <div className="mb-2">
            <RegistrationDateFilter value={regDates} onChange={setRegDates} accent="#FB641B" />
          </div>

          {/* Filter Tab Row — same tabs as Driver Welcome, real counts */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'fresh', label: `Fresh (${counts?.fresh ?? 0})` },
              { id: 'all', label: `All (${counts?.total ?? 0})` },
              { id: 'old', label: `Old (${counts?.old ?? 0})` },
              { id: 'uncalled', label: `Uncalled (${counts?.uncalled ?? 0})` },
              { id: 'callbacks', label: `CB (${counts?.callbacks ?? 0})` },
              { id: 'called', label: `Called (${counts?.called_today ?? 0})` },
              // Conversion pipeline — every lead dispositioned "Agree for
              // Subscription" (any wording), all time, so the agent can work the
              // payment follow-ups without digging through call history.
              { id: 'agree', label: `Agree (${counts?.agree_subscription ?? 0})` },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as QueueType)}
                title={tab.id === 'agree' ? 'Leads whose call feedback is “Agree for Subscription”' : undefined}
                className={`px-2.5 py-1 rounded text-xs font-semibold whitespace-nowrap border transition-colors flex items-center gap-1 ${
                  activeTab === tab.id
                    ? 'bg-[#FB641B] text-white border-[#FB641B]'
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-100'
                }`}
              >
                {tab.id === 'agree' && <span className="material-symbols-outlined text-[13px]">verified</span>}
                {tab.label}
                {tab.id === 'callbacks' && (counts?.overdue_callbacks ?? 0) > 0 && (
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title={`${counts?.overdue_callbacks} overdue`}></span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Lead List Area */}
        <div className="flex-grow overflow-y-auto min-h-0 divide-y divide-gray-100">
          {queueLoading ? (
            <div className="p-8 text-center text-gray-400 text-xs italic">Loading transporters…</div>
          ) : filteredLeads.length > 0 ? (
            filteredLeads.map(l => {
              const recommendation = getPlanRecommendation(l.fleetSize);
              return (
                <div 
                  key={l.id}
                  onClick={() => { setExternalLead(null); setSelectedId(l.id); }}
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
                      <span className="text-[11px] text-gray-600 font-semibold flex items-center gap-1">
                        <span className="material-symbols-outlined text-[13px] text-gray-400">call</span>
                        {l.callAttempts === 0 ? 'Not called yet' : `${l.callAttempts} call attempt${l.callAttempts === 1 ? '' : 's'}`}
                      </span>
                      {recommendation && (
                        <span className="bg-gray-150 text-gray-700 text-[9px] px-1 rounded font-bold uppercase">
                          {recommendation.split(': ')[1]}
                        </span>
                      )}
                    </div>

                    {activeTab === 'agree' && (
                      <div className="text-[11px] text-[#16A34A] truncate bg-green-50 border border-green-100 px-1.5 py-0.5 rounded font-semibold"
                        title={l.notes || ''}>
                        {l.lastFeedback || 'Agreed to subscribe'}
                        {l.agreedAt ? ` · ${new Date(l.agreedAt.replace(' ', 'T')).toLocaleDateString('en-GB')}` : ''}
                      </div>
                    )}

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
        {!selectedLead ? (
          <div className="flex-grow flex items-center justify-center text-gray-400 text-sm italic p-8 text-center">
            Select a {leadRole} from the queue to view details, or wait for new assignments to arrive.
          </div>
        ) : leadRole !== 'transporter' ? (
          <CrossRoleLeadDetail
            role={leadRole}
            detail={driverDetailData?.data}
            loading={driverDetailLoading}
            accent="#FB641B"
            canCall={agentState === 'ready' && callState === 'idle'}
            onCall={() => handleCallNow(selectedLead)}
            notesText={notesText}
            onNotesChange={handleNotesChange}
            saveTimestamp={saveTimestamp}
          />
        ) : (
        <>
        <div className="flex-grow overflow-y-auto p-6 space-y-6">
          
          {/* Header block */}
          <div className="flex justify-between items-start gap-4">
            <div className="flex items-start gap-3 min-w-0">
              {/* Profile photo */}
              {detail?.profile?.profile_image ? (
                <img src={detail.profile.profile_image} alt={selectedLead.companyName} className="w-14 h-14 rounded-full object-cover border border-gray-200 shrink-0" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-orange-50 border border-orange-100 flex items-center justify-center text-[#FB641B] font-bold text-lg shrink-0">
                  {(selectedLead.companyName || 'T').charAt(0).toUpperCase()}
                </div>
              )}
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">{detail?.profile?.transport_name || selectedLead.companyName}</h1>
                  <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{selectedLead.tmid}</span>
                  <span className="border border-[#FB641B] text-[#FB641B] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    TRANSPORTER
                  </span>
                  <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${(detail?.profile?.profile_completion ?? 0) >= 70 ? 'bg-[#EAFAF1] text-[#27AE60]' : 'bg-amber-50 text-amber-600'}`}>
                    {detail?.profile?.profile_completion ?? 0}% complete
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">
                  Contact: {detail?.profile?.name || selectedLead.contactName}
                  {(detail?.profile?.city || selectedLead.city) ? ` · ${[detail?.profile?.city || selectedLead.city, detail?.profile?.state || selectedLead.state].filter(Boolean).join(', ')}` : ''}
                </div>
              </div>
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

          {/* Subscription Status (real plan_card / revenue) */}
          <div className="w-full">
            {detail?.plan_card?.has_plan ? (
              <div className="bg-[#EAFAF1] border border-[#27AE60]/20 text-[#27AE60] p-3 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                <span>SUBSCRIBED — {detail.plan_card.plan_label}{detail.plan_card.amount ? ` (₹${detail.plan_card.amount.toLocaleString()})` : ''}</span>
                <span>{detail.plan_card.expires_at ? `Expires ${detail.plan_card.expires_at}` : ''}</span>
              </div>
            ) : (detail && detail.total_revenue > 0) ? (
              <div className="bg-orange-50 border border-orange-200 text-[#FB641B] p-3 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                <span>PAST SUBSCRIBER · ₹{detail.total_revenue.toLocaleString()} lifetime</span>
                <span className="uppercase text-[9px] bg-orange-100 px-1.5 py-0.5 rounded">Renewal Due</span>
              </div>
            ) : (
              <div className="bg-[#FDEDEC] border border-red-100 text-[#C0392B] p-3 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                <span>NOT SUBSCRIBED</span>
                <span className="uppercase text-[9px] bg-red-100 px-1.5 py-0.5 rounded">Conversion Pending</span>
              </div>
            )}
          </div>

          {/* Transporter Profile grid (real detail) */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Transporter Profile</h3>
              {detailLoading && <span className="text-[10px] text-gray-400 italic">Loading…</span>}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div><span className="text-gray-400 block uppercase text-[10px]">Mobile</span><span className="font-bold text-gray-800 mt-0.5 block">{detail?.profile?.mobile || selectedLead.phone || '—'}</span></div>
              <div><span className="text-gray-400 block uppercase text-[10px]">Email</span><span className="font-bold text-gray-800 mt-0.5 block truncate" title={detail?.profile?.email || ''}>{detail?.profile?.email || '—'}</span></div>
              <div><span className="text-gray-400 block uppercase text-[10px]">Location</span><span className="font-bold text-gray-800 mt-0.5 block">{[detail?.profile?.city, detail?.profile?.state].filter(Boolean).join(', ') || '—'}</span></div>
              <div><span className="text-gray-400 block uppercase text-[10px]">Pincode</span><span className="font-bold text-gray-800 mt-0.5 block">{detail?.profile?.pincode || '—'}</span></div>
              <div><span className="text-gray-400 block uppercase text-[10px]">Registered</span><span className="font-bold text-gray-800 mt-0.5 block">{detail?.profile?.registered_at ? new Date(detail.profile.registered_at).toLocaleDateString() : '—'}</span></div>
              <div><span className="text-gray-400 block uppercase text-[10px]">Language</span><span className="font-bold text-gray-800 mt-0.5 block uppercase">{detail?.profile?.language || '—'}</span></div>
              <div><span className="text-gray-400 block uppercase text-[10px]">Lifetime Revenue</span><span className="font-bold text-[#27AE60] mt-0.5 block">₹{(detail?.total_revenue || 0).toLocaleString()}</span></div>
              <div><span className="text-gray-400 block uppercase text-[10px]">Total Calls</span><span className="font-bold text-gray-800 mt-0.5 block">{detail?.total_calls ?? 0}</span></div>
            </div>
            {detail?.profile?.address && (
              <div className="mt-3 pt-3 border-t border-gray-200 text-xs">
                <span className="text-gray-400 uppercase text-[10px]">Address</span>
                <p className="text-gray-700 mt-0.5">{detail.profile.address}</p>
              </div>
            )}
          </div>

          {/* Business & KYC (real users-table fields) */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Business & KYC</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div><span className="text-gray-400 block uppercase text-[10px]">Transport Name</span><span className="font-bold text-gray-800 mt-0.5 block">{detail?.profile?.transport_name || '—'}</span></div>
              <div><span className="text-gray-400 block uppercase text-[10px]">Fleet Size</span><span className="font-bold text-gray-800 mt-0.5 block">{detail?.profile?.fleet_size || '—'}</span></div>
              <div><span className="text-gray-400 block uppercase text-[10px]">Company Type</span><span className="font-bold text-gray-800 mt-0.5 block">{detail?.profile?.company_registration_type || '—'}</span></div>
              <div><span className="text-gray-400 block uppercase text-[10px]">Referral</span><span className="font-bold text-gray-800 mt-0.5 block">{detail?.profile?.referral_code || '—'}</span></div>
              <div>
                <span className="text-gray-400 block uppercase text-[10px]">PAN Number</span>
                <span className="font-bold text-gray-800 mt-0.5 block font-mono">{detail?.profile?.pan_number || '—'}</span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-400 block uppercase text-[10px]">GST Number</span>
                <span className="font-bold text-gray-800 mt-0.5 block font-mono">{detail?.profile?.gst_number || '—'}</span>
              </div>
            </div>

            {/* Document thumbnails */}
            {detail?.documents && detail.documents.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-100 flex flex-wrap gap-3">
                {detail.documents.map((doc) => (
                  <div key={doc.key} className="flex flex-col items-center gap-1">
                    {doc.uploaded && doc.url ? (
                      <a href={doc.url} target="_blank" rel="noreferrer" className="block">
                        <img src={doc.url} alt={doc.label} className="w-16 h-16 object-cover rounded border border-gray-200 hover:border-[#FB641B]" />
                      </a>
                    ) : (
                      <div className="w-16 h-16 rounded border border-dashed border-gray-200 flex items-center justify-center text-gray-300">
                        <span className="material-symbols-outlined text-[20px]">description</span>
                      </div>
                    )}
                    <span className={`text-[9px] ${doc.uploaded ? 'text-[#27AE60] font-semibold' : 'text-gray-400'}`}>{doc.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Posted Jobs (real) */}
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-sm text-xs">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Posted Jobs</h3>
              <span className="text-[10px] text-gray-500 font-semibold">{detail?.jobs_posted_count ?? 0} jobs · {detail?.total_applicants ?? 0} applicants</span>
            </div>
            {detail?.posted_jobs && detail.posted_jobs.length > 0 ? (
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {detail.posted_jobs.map(job => (
                  <div key={job.job_id} className="flex justify-between items-start gap-2 bg-gray-50/50 p-2.5 rounded border border-gray-150">
                    <div className="min-w-0">
                      <div className="font-bold text-gray-800 truncate">{job.title || 'Job posting'}</div>
                      <div className="text-[10px] text-gray-500 truncate">{[job.location, job.vehicle_type, job.salary].filter(Boolean).join(' · ') || '—'}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="font-bold text-[#FB641B]">{job.applicants} applied</div>
                      <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${job.is_closed ? 'bg-gray-100 text-gray-500' : 'bg-[#EAFAF1] text-[#27AE60]'}`}>{job.is_closed ? 'Closed' : 'Active'}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-gray-50/50 p-2.5 rounded border border-gray-150 text-gray-400 italic">No jobs posted by this transporter yet.</div>
            )}
          </div>

          {/* Call history and Notes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">

            {/* Timeline (real ivr_history) */}
            <div className="space-y-3">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">history</span> Call History Timeline
              </h3>

              <div className="border border-gray-200 rounded-xl p-4 bg-white max-h-[220px] overflow-y-auto divide-y divide-gray-100">
                {detail?.ivr_history && detail.ivr_history.length > 0 ? (
                  detail.ivr_history.map((h) => (
                    <div key={h.id} className="py-2 first:pt-0 last:pb-0 text-xs">
                      <div className="flex justify-between items-center mb-1 font-semibold">
                        <span className="text-gray-800">{new Date(h.created_at).toLocaleString()}</span>
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${(h.call_status || '').toLowerCase() === 'connected' ? 'bg-[#EAFAF1] text-[#27AE60]' : 'bg-orange-50 text-[#FB641B]'}`}>
                          {h.call_status || 'pending'}
                        </span>
                      </div>
                      <p className="text-gray-500">{h.call_feedback || '—'}{h.assigned_name ? ` · ${h.assigned_name}` : ''}</p>
                      {((h as any).recording_url || h.call_recording) && (
                        <audio controls src={(h as any).recording_url || h.call_recording || undefined} className="h-7 mt-1 max-w-full" />
                      )}
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
        </>
        )}
      </section>

    </main>
  );
};

export default WctCallQueue;
