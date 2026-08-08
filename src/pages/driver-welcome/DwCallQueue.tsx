import React, { useState, useEffect, useRef } from 'react';
import {
  useGetDwLeadDetailQuery,
  useGetWctLeadDetailQuery,
  useSubmitDwFeedbackMutation,
  useLazyGetDwGlobalSearchQuery
} from '../../services/api/webCrmApi';
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
import { useAuth } from '../../app/providers/AuthProvider';
import { DriverForm } from '../matchmaking/MmDriverBank';
import CrossRoleLeadDetail from '../shared/CrossRoleLeadDetail';
import RevivalOffersList from '../../shared/components/business/RevivalOffersList';
import RegistrationDateFilter from '../../shared/components/business/RegistrationDateFilter';
import type { RegDateRange } from '../../shared/components/business/RegistrationDateFilter';

const SkeletonCard = () => (
  <div className="p-3 border-l-4 border-gray-200 bg-white animate-pulse space-y-2">
    <div className="flex justify-between items-center">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
    <div className="flex justify-between items-center pt-2">
      <div className="h-3 bg-gray-200 rounded w-1/5"></div>
      <div className="h-3 bg-gray-200 rounded w-1/4"></div>
    </div>
  </div>
);

/**
 * The shared call-queue desk.
 *
 * Driver Welcome, Transporter Welcome and Matchmaking all work the SAME queue:
 * leads assigned to the signed-in agent. The queue endpoints already filter
 * `assigned_to = caller + role`, so the only per-desk differences are which
 * side the toggle starts on and where the tab selection is remembered — both
 * props, both defaulted so the existing Driver Welcome usage is unchanged.
 */
interface DwCallQueueProps {
  /** Namespaces the remembered tab per desk (dw / wct / mm). */
  deskKey?: string;
  /** Which lead role this desk opens on; the agent can switch to any of LEAD_ROLES. */
  defaultLeadRole?: LeadRole;
  /**
   * When true the global search reaches EVERY user in the database (any role),
   * not just the caller's assigned drivers — and selecting a result opens that
   * user's full profile + call timeline and lets the agent call them, whether
   * or not the lead is assigned to them. Used by the matchmaking desk.
   */
  globalSearchAllRoles?: boolean;
}

export const DwCallQueue: React.FC<DwCallQueueProps> = ({ deskKey = 'dw', defaultLeadRole = 'driver', globalSearchAllRoles = false }) => {
  const { dial, callState, agentState } = useSanCti();
  const { user } = useAuth();

  const tabStorageKey = `${deskKey}_queue_tab`;

  // Search, Tab, Sort & Pagination States
  // The Revival tab lists COUPONS, not queue leads, so it is tracked apart from
  // activeTab — widening QueueType would force every queue endpoint to handle a
  // type none of them can serve.
  const [showRevival, setShowRevival] = useState(false);

  const [activeTab, setActiveTab] = useState<QueueType>(
    (sessionStorage.getItem(tabStorageKey) as QueueType) || 'fresh'
  );

  useEffect(() => {
    sessionStorage.setItem(tabStorageKey, activeTab);
  }, [activeTab, tabStorageKey]);

  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [playingQueueId, setPlayingQueueId] = useState<string | number | null>(null);
  const [playingHistoryIdx, setPlayingHistoryIdx] = useState<number | null>(null);
  const [viewerDoc, setViewerDoc] = useState<{ url: string; label: string } | null>(null);
  const [isBankModalOpen, setIsBankModalOpen] = useState(false);
  const [bankPrefill, setBankPrefill] = useState<any>(null);

  // Global Search State
  const [globalSearchInput, setGlobalSearchInput] = useState('');
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);
  const globalSearchRef = useRef<HTMLDivElement>(null);
  
  const [triggerGlobalSearch, { data: globalSearchData, isFetching: isGlobalSearchFetching }] = useLazyGetDwGlobalSearchQuery();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (globalSearchRef.current && !globalSearchRef.current.contains(event.target as Node)) {
        setIsGlobalSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      const trimmed = globalSearchInput.trim();
      if (trimmed.length >= 3) {
        triggerGlobalSearch(globalSearchAllRoles
          ? { q: trimmed, roles: 'all' }
          : trimmed);
        setIsGlobalSearchOpen(true);
      } else {
        setIsGlobalSearchOpen(false);
      }
    }, 400);
    return () => clearTimeout(delayDebounceFn);
  }, [globalSearchInput, triggerGlobalSearch, globalSearchAllRoles]);


  // Advanced Filter States
  const [filtersEnabled, setFiltersEnabled] = useState(false);
  const [filterSubscribed, setFilterSubscribed] = useState<string>('all'); // all | yes | no
  const [filterPan, setFilterPan] = useState<string>('all'); // all | yes | no
  const [filterSalary, setFilterSalary] = useState<string>('all'); // all | under_15k | 15k_25k | over_25k
  const [filterVehicleType, setFilterVehicleType] = useState<string>('');
  const [filterExperience, setFilterExperience] = useState<string>('all'); // all | fresh | 1_3_years | over_3_years
  const [filterProfileComplete, setFilterProfileComplete] = useState<string>('all'); // all | yes | no
  const [filterRoute, setFilterRoute] = useState<string>('');
  const [filterStateId, setFilterStateId] = useState<string>(''); // empty for all

  // Registration-date window (users.Created_at). Lives outside the collapsible
  // advanced-filter panel because it is used constantly — an agent working
  // "this week's signups" shouldn't have to open a panel every time.
  const [regDates, setRegDates] = useState<RegDateRange>({});

  const activeFilters = {
    subscribed: filterSubscribed !== 'all' ? filterSubscribed : undefined,
    pan: filterPan !== 'all' ? filterPan : undefined,
    salary: filterSalary !== 'all' ? filterSalary : undefined,
    vehicle_type: filterVehicleType || undefined,
    experience: filterExperience !== 'all' ? filterExperience : undefined,
    profile_complete: filterProfileComplete !== 'all' ? filterProfileComplete : undefined,
    route: filterRoute || undefined,
    state_id: filterStateId ? Number(filterStateId) : undefined,
    reg_from: regDates.reg_from,
    reg_to: regDates.reg_to,
  };

  const handleFilterChange = (setter: any, val: any) => {
    setter(val);
    setCurrentPage(1);
  };

  const resetFilters = () => {
    setFilterSubscribed('all');
    setFilterPan('all');
    setFilterSalary('all');
    setFilterVehicleType('');
    setFilterExperience('all');
    setFilterProfileComplete('all');
    setFilterRoute('');
    setFilterStateId('');
    setRegDates({});
    setCurrentPage(1);
  };

  // Mixed-desk toggle: every desk can work every kind of lead assigned to it —
  // driver, transporter, association, foreman, puncture shop, dhaba. The queue
  // endpoints filter assigned_to = this caller + users.role, so switching the
  // role reuses them: transporter has its own endpoint set, the rest are the DW
  // set scoped by lead_role. The choice is remembered per desk.
  const roleStorageKey = `${deskKey}_queue_lead_role`;
  const [leadRole, setLeadRole] = useState<LeadRole>(() => {
    const stored = sessionStorage.getItem(roleStorageKey) as LeadRole | null;
    return stored && (LEAD_ROLES as readonly string[]).includes(stored) ? stored : defaultLeadRole;
  });
  useEffect(() => {
    sessionStorage.setItem(roleStorageKey, leadRole);
  }, [leadRole, roleStorageKey]);
  const queueRole = endpointRoleFor(leadRole);

  // Integrate SWR caching hooks
  const {
    data: queueData,
    isLoading: isQueueLoading,
    isFetching: isQueueFetching,
    refetch: refetchQueue,
    removeLead
  } = useQueueCache(activeTab, {
    page: currentPage,
    search: searchQuery,
    per_page: 20
  }, activeFilters, queueRole, leadRole);

  const { counts, isFetching: isCountsFetching, refetch: refetchCounts } = useQueueCountsCache(queueRole, leadRole, activeFilters);

  const handleRefresh = () => {
    refetchQueue();
    refetchCounts();
  };

  const leads = queueData?.leads || [];
  const pagination = queueData?.pagination || { total: 0, per_page: 20, current_page: 1, last_page: 1 };

  // Selected Lead state
  const [selectedId, setSelectedId] = useState<number | string>('');
  const prevLeadsRef = useRef<any[]>([]);

  useEffect(() => {
    if (leads.length > 0) {
      if (!selectedId) {
        setSelectedId(leads[0].id);
      } else {
        const wasInPrevLeads = prevLeadsRef.current.some(l => l.id === selectedId);
        const isInCurrentLeads = leads.some(l => l.id === selectedId);
        if (wasInPrevLeads && !isInCurrentLeads) {
          setSelectedId(leads[0].id);
        }
      }
    } else {
      const isGlobalSearchSelection = String(selectedId).startsWith('sm-') || (!leads.some(l => l.id === selectedId) && selectedId !== '');
      if (!isGlobalSearchSelection) {
        setSelectedId('');
      }
    }
    prevLeadsRef.current = leads;
  }, [leads, selectedId]);

  // Fetch lead details dynamically when selectedId changes
  // refetchOnMountOrArgChange: this panel is revisited often right after a call
  // (Call Queue -> Active Call Focus -> back to Call Queue), and RTK Query's
  // default cache would otherwise serve a result from before the latest call
  // history row was written.
  const { data: detailResponse, isLoading: isDetailLoading, refetch: refetchDetail } = useGetDwLeadDetailQuery(selectedId, {
    skip: !selectedId || leadRole === 'transporter',
    refetchOnMountOrArgChange: true
  });

  // Cross-desk (transporter) detail — fetched from the WCT leadDetail endpoint
  // when the toggle is on 'Transporter'. Same response shape, rendered via the
  // shared universal panel below.
  const { data: transporterDetailData, isFetching: isTransporterDetailLoading } = useGetWctLeadDetailQuery(selectedId, {
    skip: !selectedId || leadRole !== 'transporter',
    refetchOnMountOrArgChange: true
  });

  const [submitFeedback] = useSubmitDwFeedbackMutation();

  // When a call dialed from THIS screen completes disposition (via the global
  // PostCallDispositionModal, rendered in DashboardLayout), refresh the list
  // so the now-called lead drops out of view and tab counts update — without
  // ever having navigated away to do it.
  useEffect(() => {
    const handleDispositionComplete = () => {
      invalidateQueueCache();
      refetchCounts();
      refetchQueue();
      if (selectedId) {
        // useGetDwLeadDetailQuery is skip:true when selectedId is empty —
        // refetch() throws "Cannot refetch a query that has not been
        // started yet" if called while skipped.
        removeLead(Number(selectedId));
        refetchDetail();
      }
    };
    window.addEventListener('san-disposition-complete', handleDispositionComplete);
    return () => window.removeEventListener('san-disposition-complete', handleDispositionComplete);
  }, [selectedId, removeLead, refetchCounts, refetchQueue, refetchDetail]);


  const driverProfile = detailResponse?.data?.profile;
  const isAssignedToOther = driverProfile && driverProfile.assigned_to && user?.id && Number(driverProfile.assigned_to) !== Number(user?.id);
  const planCard = detailResponse?.data?.plan_card;
  const ivrHistory = detailResponse?.data?.ivr_history || [];
  const mmHistory = detailResponse?.data?.mm_history || [];
  const appliedJobs = detailResponse?.data?.applied_jobs || [];
  const documents = detailResponse?.data?.documents || [];
  const completionPct = Math.max(0, Math.min(100, Number(driverProfile?.profile_completion ?? 0)));
  const completionColor = completionPct >= 80 ? '#27AE60' : completionPct >= 50 ? '#F39C12' : '#E74C3C';

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getBorderColorClass = (l: any) => {
    if (activeTab === 'all') return 'border-gray-300';
    if (activeTab === 'fresh') return 'border-[#3498DB]'; // Blue
    if (activeTab === 'old') return 'border-[#9B59B6]'; // Purple
    if (activeTab === 'uncalled') return 'border-[#E67E22]'; // Orange
    if (activeTab === 'callbacks') return l.overdue ? 'border-[#E74C3C]' : 'border-[#F1C40F]'; // Red or Yellow
    if (activeTab === 'called') return 'border-[#27AE60]'; // Green
    if (activeTab === 'agree') return 'border-[#16A34A]'; // Deep green — money on the table
    return 'border-gray-200';
  };

  const handleCallNow = (lead: any) => {
    // Dial directly from this screen instead of navigating to Active Call
    // Focus. CallControlBar (the floating call status bar) and
    // PostCallDispositionModal are both rendered globally in DashboardLayout,
    // so the in-progress call and the post-call disposition form simply
    // appear on top of this screen — the agent never has to leave it.
    if (agentState !== 'ready') {
      triggerToast(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel (bottom-left) for the reason, e.g. agent already logged in elsewhere.'
        : 'CTI agent is not ready yet — please wait a moment and try again.');
      return;
    }
    if (callState !== 'idle') {
      triggerToast('Finish or hang up the current call before dialing another lead.');
      return;
    }
    setSelectedId(lead.id);
    const isSocial = String(lead.id).startsWith('sm-');
    const cleanId = isSocial ? parseInt(String(lead.id).replace(/\D/g, ''), 10) : lead.id;
    dial(lead.mobile, cleanId, lead.name, lead.tmid, isSocial ? 'social_media' : leadRole);
  };

  // Guards the quick action against being fired in a burst.
  //
  // A ref, NOT state: a native <select> that has focus fires `change` on every
  // arrow-key press, and a held key repeats at the OS rate (~30/sec). Because
  // the handler resets e.target.value back to the placeholder, each repeat
  // re-selects the SAME action — and React would not have re-rendered between
  // them, so a useState flag reads stale `false` every time and blocks nothing.
  // A ref is written synchronously and is the only thing that stops the burst.
  //
  // Observed on production 2026-07-30 11:00:25–11:00:41: 418 identical "Wrong
  // Number" dispositions, peaking at 33 rows/second, marching down 10
  // consecutive leads as each one was removed from the queue and the next
  // auto-selected.
  const quickActionInFlight = useRef(false);

  /**
   * Dial a lead straight out of the global search results.
   *
   * Global search reaches the WHOLE user base, including leads assigned to
   * another agent or to nobody — selecting one only ever opened their profile,
   * so an agent who found the right person still had no way to call them.
   * Assignment governs whose QUEUE a lead sits in; it does not govern who may
   * phone them, and the call is logged against whoever placed it either way.
   */
  const handleGlobalSearchCall = (res: any) => {
    if (!res?.mobile) { triggerToast('This lead has no phone number on file.'); return; }
    if (agentState !== 'ready') {
      triggerToast(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel (bottom-left).'
        : 'CTI agent is not ready yet — please wait a moment and try again.');
      return;
    }
    if (callState !== 'idle') {
      triggerToast('Finish or hang up the current call before dialing another lead.');
      return;
    }

    const isSocial = res.source === 'social_media';
    // Open the panel for this lead too, so the agent has the profile in front
    // of them while the call connects and the disposition modal knows the lead.
    const finalId = isSocial ? `sm-${res.id}` : res.id;
    const r = String(res.role || 'driver').toLowerCase();
    const nextRole = (LEAD_ROLES as readonly string[]).includes(r) ? (r as LeadRole) : 'driver';
    setLeadRole(nextRole);
    setSelectedId(finalId);
    setIsGlobalSearchOpen(false);
    setGlobalSearchInput('');

    dial(res.mobile, Number(res.id), res.name, res.tmid, isSocial ? 'social_media' : nextRole);
    triggerToast(`Dialing ${res.name || res.mobile}…`);
  };

  const handleQuickAction = async (action: string) => {
    if (!selectedId) return;
    if (quickActionInFlight.current) return;

    // These write an irreversible disposition and drop the lead out of the
    // queue, so they are confirmed rather than applied straight off a change
    // event — which is all a stray keypress on the closed dropdown produces.
    const lead = leads.find((l: any) => String(l.id) === String(selectedId));
    const labels: Record<string, string> = {
      wrong_number: 'Wrong Number',
      already_subscribed: 'Already Subscribed',
      escalate: 'Escalate to Funnel',
    };
    if (!window.confirm(
      `Mark ${lead?.name || 'this lead'} as "${labels[action] || action}"?\n\n`
      + 'This files a call disposition and removes the lead from your queue.'
    )) return;

    quickActionInFlight.current = true;
    try {
      let callStatus = 'connected';
      let callFeedback = 'Agree for Subscription';
      let callRemarks = 'Quick action completed';

      if (action === 'wrong_number') {
        callStatus = 'not_connected';
        callFeedback = 'Wrong Number';
        callRemarks = 'Marked as Wrong Number';
      } else if (action === 'already_subscribed') {
        callStatus = 'connected';
        callFeedback = 'Agree for Subscription';
        callRemarks = 'Driver already subscribed';
      } else if (action === 'escalate') {
        callStatus = 'not_connected';
        callFeedback = 'Not Interested';
        callRemarks = 'Escalated to funnel';
      }

      await submitFeedback({
        user_id: Number(selectedId),
        call_status: callStatus,
        call_feedback: callFeedback,
        call_remarks: callRemarks,
        call_duration: 0
      }).unwrap();

      removeLead(Number(selectedId));
      invalidateQueueCache();
      refetchCounts();
      refetchQueue();
      refetchDetail();

      triggerToast(`Lead status updated: ${callFeedback}`);
    } catch (err) {
      triggerToast('Failed to apply quick action.');
    } finally {
      quickActionInFlight.current = false;
    }
  };

  // Call timeline — sourced from call_history_ivr and jobs_match_making.
  const combinedHistory = [
    ...ivrHistory.map((h: any) => ({ ...h, _source: 'IVR' })),
    ...mmHistory.map((h: any) => ({ ...h, _source: 'Matchmaking' }))
  ]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(h => ({
      date: new Date(h.created_at).toLocaleString(),
      duration: `${Math.floor(((h as any).active_time || (h as any).call_duration || 0) / 60)}m ${((h as any).active_time || (h as any).call_duration || 0) % 60}s`,
      status: h.call_status || '',
      caller: h.assigned_name || 'Admin',
      feedback: h.call_feedback || '',
      remarks: h.call_remarks || '',
      source: h._source,
      recording_url: (h as any).recording_url || null,
    }));

  const getStatusBadge = (status: string) => {
    if (status === 'connected') return { label: 'Connected', cls: 'bg-[#EAFAF1] text-[#27AE60]' };
    if (status === 'callback_later') return { label: 'Callback Later', cls: 'bg-amber-50 text-amber-600' };
    if (status === 'not_connected') return { label: 'Not Connected', cls: 'bg-red-50 text-red-500' };
    return { label: status || 'Unknown', cls: 'bg-gray-100 text-gray-500' };
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

      {/* Document image viewer — opens in-place, no new tab */}
      {viewerDoc && (
        <div
          className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150"
          onClick={() => setViewerDoc(null)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 shrink-0">
              <h4 className="text-sm font-bold text-gray-800 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-[#27AE60]">image</span>
                {viewerDoc.label}
              </h4>
              <button
                onClick={() => setViewerDoc(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center transition-colors"
                title="Close"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
            <div className="flex-1 overflow-auto bg-gray-50 flex items-center justify-center p-4">
              <img
                src={viewerDoc.url}
                alt={viewerDoc.label}
                className="max-w-full max-h-[65vh] object-contain rounded-lg"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = 'none';
                  el.insertAdjacentHTML(
                    'afterend',
                    '<div class="text-xs text-gray-400 italic py-10">Unable to load this document image.</div>'
                  );
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Left Panel - Staging Call Queue */}
      <section className="w-[380px] border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0">
        
        {/* Global Search Header */}
        <div className="p-3 border-b border-gray-200 bg-gray-50 flex items-center justify-between shrink-0 relative" ref={globalSearchRef}>
          <div className="relative w-full flex items-center">
            <span className="material-symbols-outlined absolute left-2 text-gray-400 text-[18px]">search</span>
            <input
              type="text"
              placeholder={globalSearchAllRoles
                ? 'Search ANY user — name, TMID, mobile…'
                : 'Global Search (Mobile, TMID, Name)...'}
              value={globalSearchInput}
              onChange={(e) => setGlobalSearchInput(e.target.value)}
              onFocus={() => { if (globalSearchInput.length >= 3) setIsGlobalSearchOpen(true); }}
              className="w-full pl-8 pr-3 py-1.5 text-xs border border-gray-300 rounded-md focus:ring-1 focus:ring-[#27AE60] outline-none shadow-inner"
            />
            {isGlobalSearchFetching && (
              <span className="material-symbols-outlined absolute right-2 text-gray-400 text-[16px] animate-spin">sync</span>
            )}
          </div>
          
          {/* Autocomplete Dropdown */}
          {isGlobalSearchOpen && (
            <div className="absolute top-full left-3 right-3 mt-1 bg-white border border-gray-200 shadow-xl rounded-lg z-50 max-h-[300px] overflow-y-auto divide-y divide-gray-100">
              {isGlobalSearchFetching ? (
                <div className="p-4 text-center text-xs text-gray-500 flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[16px] animate-spin text-[#27AE60]">sync</span>
                  Searching...
                </div>
              ) : globalSearchData?.data && globalSearchData.data.length > 0 ? (
                globalSearchData.data.map((res: any) => (
                  <div
                    key={`${res.source}-${res.id}`}
                    onClick={() => {
                      const finalId = res.source === 'social_media' ? `sm-${res.id}` : res.id;
                      // Open the panel for the found user's ACTUAL role, so a
                      // global search that lands on a transporter loads the
                      // transporter detail (not the driver cockpit). Roles the
                      // desk doesn't model fall back to 'driver'.
                      const r = String(res.role || 'driver').toLowerCase();
                      const nextRole = (LEAD_ROLES as readonly string[]).includes(r) ? (r as LeadRole) : 'driver';
                      setLeadRole(nextRole);
                      setSelectedId(finalId);
                      setIsGlobalSearchOpen(false);
                      setGlobalSearchInput('');
                    }}
                    className="p-3 cursor-pointer hover:bg-gray-50 flex justify-between items-center transition-colors"
                  >
                    <div>
                      <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                        {res.name}
                        {res.source === 'social_media' ? (
                          <span className="bg-purple-100 text-purple-700 text-[9px] px-1.5 py-0.5 rounded border border-purple-200">SML</span>
                        ) : res.role && (
                          <span className="bg-gray-100 text-gray-600 text-[9px] px-1.5 py-0.5 rounded border border-gray-200 uppercase">{res.role}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-gray-500 mt-0.5 flex items-center gap-1.5">
                        {res.city ? `${res.city} | ` : ''}
                        <span className={res.assigned_name === 'Unassigned' ? 'text-amber-600 font-medium' : 'text-gray-500'}>
                          {res.assigned_name === 'Unassigned' ? 'Unassigned' : `Assigned: ${res.assigned_name}`}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <div className="text-right">
                        <div className="text-xs font-mono text-gray-600 bg-gray-100 px-1 rounded">{res.tmid}</div>
                        <div className="text-[11px] font-medium text-[#27AE60] mt-0.5">{res.mobile ? res.mobile.replace(/(\d{3})\d{4}(\d{3})/, '$1****$2') : '**********'}</div>
                      </div>
                      {/* Call this lead whether or not they are assigned to
                          this agent. stopPropagation so the row's own click
                          (open profile) doesn't also fire. */}
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

        {/* Tab & Sort Header */}
        <div className="p-3 border-b border-gray-200 shrink-0 bg-white">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#17376B] uppercase tracking-wider">Queue Routing</span>
            </div>
            <div className="flex items-center gap-1.5">
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-24 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#27AE60] outline-none"
              />
              <button
                onClick={handleRefresh}
                disabled={isQueueFetching || isCountsFetching}
                className="p-1 border rounded text-xs flex items-center justify-center transition-colors bg-white border-gray-300 text-gray-500 hover:bg-gray-50 disabled:opacity-60"
                title="Refresh queue"
              >
                <span className={`material-symbols-outlined text-[16px] ${(isQueueFetching || isCountsFetching) ? 'animate-spin' : ''}`}>refresh</span>
              </button>
              <button
                onClick={() => setFiltersEnabled(prev => !prev)}
                className={`p-1 border rounded text-xs flex items-center justify-center transition-colors ${
                  filtersEnabled || Object.values(activeFilters).some(v => v !== undefined)
                    ? 'bg-[#EAFAF1] border-[#27AE60] text-[#27AE60]'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
                title="Toggle Advanced Filters"
              >
                <span className="material-symbols-outlined text-[16px]">filter_alt</span>
              </button>
            </div>
          </div>

          {/* Registration date window — applies to every tab below. */}
          <div className="mb-3">
            <RegistrationDateFilter value={regDates} onChange={setRegDates} accent="#27AE60" />
          </div>

          {/* Lead-role toggle — every kind of lead this desk can be assigned */}
          <div className="grid grid-cols-3 gap-1 mb-3 p-0.5 bg-gray-100 rounded-lg">
            {LEAD_ROLES.map(r => (
              <button
                key={r}
                onClick={() => { setLeadRole(r); setSelectedId(''); setCurrentPage(1); }}
                title={`${leadRoleMeta[r].label} leads assigned to you`}
                className={`py-1.5 rounded-md text-[10px] font-bold uppercase tracking-wide transition-colors flex items-center justify-center gap-1 ${
                  leadRole === r ? 'bg-[#27AE60] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="material-symbols-outlined text-[14px]">{leadRoleMeta[r].icon}</span>
                {leadRoleMeta[r].label}
              </button>
            ))}
          </div>

          {/* Advanced Filters Panel */}
          {filtersEnabled && (
            <div className="mb-3 p-3 bg-gray-50 border border-gray-200 rounded-lg text-xs space-y-2.5 max-h-[300px] overflow-y-auto">
              <div className="flex justify-between items-center pb-1.5 border-b border-gray-200">
                <span className="font-bold text-gray-700">Advanced Filters</span>
                <button 
                  onClick={resetFilters}
                  className="text-[10px] text-red-600 hover:text-red-800 font-semibold"
                >
                  Reset All
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5 uppercase">Subscription</label>
                  <select
                    value={filterSubscribed}
                    onChange={(e) => handleFilterChange(setFilterSubscribed, e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded bg-white text-xs"
                  >
                    <option value="all">All</option>
                    <option value="yes">Subscribed</option>
                    <option value="no">Unsubscribed</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5 uppercase">PAN Card</label>
                  <select
                    value={filterPan}
                    onChange={(e) => handleFilterChange(setFilterPan, e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded bg-white text-xs"
                  >
                    <option value="all">All</option>
                    <option value="yes">Available</option>
                    <option value="no">Not Available</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5 uppercase">Expected Salary</label>
                  <select
                    value={filterSalary}
                    onChange={(e) => handleFilterChange(setFilterSalary, e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded bg-white text-xs"
                  >
                    <option value="all">All</option>
                    <option value="under_15k">Under ₹15k</option>
                    <option value="15k_25k">₹15k - ₹25k</option>
                    <option value="over_25k">Over ₹25k</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5 uppercase">Experience</label>
                  <select
                    value={filterExperience}
                    onChange={(e) => handleFilterChange(setFilterExperience, e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded bg-white text-xs"
                  >
                    <option value="all">All</option>
                    <option value="fresh">Fresher (&lt; 1 yr)</option>
                    <option value="1_3_years">1 - 3 Years</option>
                    <option value="over_3_years">Over 3 Years</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5 uppercase">Profile Completion</label>
                  <select
                    value={filterProfileComplete}
                    onChange={(e) => handleFilterChange(setFilterProfileComplete, e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded bg-white text-xs"
                  >
                    <option value="all">All</option>
                    <option value="yes">Complete</option>
                    <option value="no">Incomplete</option>
                  </select>
                </div>

                <div>
                  <label className="text-[10px] text-gray-400 block mb-0.5 uppercase">State</label>
                  <select
                    value={filterStateId}
                    onChange={(e) => handleFilterChange(setFilterStateId, e.target.value)}
                    className="w-full p-1 border border-gray-300 rounded bg-white text-xs"
                  >
                    <option value="">All States</option>
                    {counts?.states?.map((st: any) => (
                      <option key={st.id} value={st.id}>{st.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-0.5 uppercase">Route / Location</label>
                <input
                  type="text"
                  placeholder="e.g. Delhi, Jaipur"
                  value={filterRoute}
                  onChange={(e) => handleFilterChange(setFilterRoute, e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded bg-white text-xs"
                />
              </div>

              <div>
                <label className="text-[10px] text-gray-400 block mb-0.5 uppercase">Vehicle Type</label>
                <input
                  type="text"
                  placeholder="e.g. Container, Pickup"
                  value={filterVehicleType}
                  onChange={(e) => handleFilterChange(setFilterVehicleType, e.target.value)}
                  className="w-full p-1 border border-gray-300 rounded bg-white text-xs"
                />
              </div>
            </div>
          )}

          {/* Filter Tab Row */}
          <div className="flex overflow-x-auto pb-1 gap-1.5 scrollbar-hide shrink-0">
            {[
              { id: 'fresh', label: `Fresh (${counts?.fresh ?? 0})` },
              { id: 'all', label: `All (${counts?.total ?? 0})` },
              { id: 'old', label: `Old (${counts?.old ?? 0})` },
              { id: 'uncalled', label: `Uncalled (${counts?.uncalled ?? 0})` },
              { 
                id: 'callbacks', 
                label: (
                  <span className="flex items-center gap-1">
                    CB ({counts?.callbacks ?? 0})
                    {counts?.overdue_callbacks && counts.overdue_callbacks > 0 ? (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title={`${counts.overdue_callbacks} Overdue`}></span>
                    ) : null}
                  </span>
                )
              },
              { id: 'called', label: `Today (${counts?.called_today ?? 0})` },
              // Conversion pipeline — every lead dispositioned "Agree for
              // Subscription" (any wording), all time, so the agent can work
              // the payment follow-ups without digging through call history.
              {
                id: 'agree',
                label: (
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[13px]">verified</span>
                    Agree ({counts?.agree_subscription ?? 0})
                  </span>
                )
              }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setShowRevival(false); setActiveTab(tab.id as any); setCurrentPage(1); }}
                className={`px-3 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap border transition-all ${
                  !showRevival && activeTab === tab.id
                    ? 'bg-blue-50 text-blue-700 border-blue-200 shadow-sm'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {tab.label}
              </button>
            ))}

            {/* Revival — the coupons this agent has already offered. Sits after
                Agree because it is the next step of the same pipeline: agreed →
                offered a discount → paid or lapsed. */}
            <button
              onClick={() => setShowRevival(true)}
              className={`px-3 py-1.5 rounded-md text-[11px] font-semibold whitespace-nowrap border transition-all ${
                showRevival
                  ? 'bg-amber-50 text-amber-800 border-amber-300 shadow-sm'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-1">
                <span className="material-symbols-outlined text-[13px]">local_activity</span>
                Revival
              </span>
            </button>
          </div>
        </div>

        {/* Lead List Area */}
        {showRevival ? (
          <RevivalOffersList
            selectedUserId={selectedId}
            onSelect={(o) => setSelectedId(String(o.user_id))}
          />
        ) : (
        <div className="flex-1 overflow-y-auto min-h-0 divide-y divide-gray-100">
          {isQueueLoading ? (
            <div className="divide-y divide-gray-100">
              {[...Array(5)].map((_, i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          ) : leads.length > 0 ? (
            leads.map(l => (
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

                  <div className="flex justify-between items-center text-[10px] text-gray-400 mt-1.5 bg-gray-50 p-1.5 rounded border border-gray-100">
                    <span>Reg: {l.registered_at ? new Date(l.registered_at).toLocaleDateString('en-GB') : 'N/A'}</span>
                    {l.current_plan && l.current_plan !== 'Free' && l.subscription_date ? (
                      <span className="text-[#27AE60] font-bold flex items-center gap-0.5" title={`${l.current_plan} Plan`}>
                        <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60] animate-pulse"></span>
                        Sub: {new Date(l.subscription_date).toLocaleDateString('en-GB')}
                      </span>
                    ) : null}
                  </div>

                  {activeTab === 'called' && l.last_feedback && (
                    <div className="text-[11px] text-gray-500 mt-1 truncate bg-gray-100 px-1.5 py-0.5 rounded italic">
                      {l.last_feedback} {l.last_remarks ? ` - ${l.last_remarks}` : ''}
                    </div>
                  )}

                  {activeTab === 'agree' && (
                    <div className="text-[11px] text-[#16A34A] mt-1 truncate bg-green-50 border border-green-100 px-1.5 py-0.5 rounded font-semibold"
                      title={l.last_remarks || ''}>
                      {l.last_feedback || 'Agreed to subscribe'}
                      {l.agreed_at ? ` · ${new Date(String(l.agreed_at).replace(' ', 'T')).toLocaleDateString('en-GB')}` : ''}
                    </div>
                  )}

                  <div className="flex justify-between items-center mt-2.5">
                    <span className="text-[11px] text-gray-400">
                      Attempts: {l.call_count}
                    </span>
                    {l.last_status && (
                      <span className="text-[10px] font-semibold text-gray-500 uppercase tracking-wide">
                        Last: {l.last_status.replace('_', ' ')}
                      </span>
                    )}
                  </div>

                  {l.recording_url && (
                    <div className="mt-2" onClick={(e) => e.stopPropagation()}>
                      {playingQueueId === l.id ? (
                        <div className="flex items-center gap-1.5">
                          <audio src={l.recording_url} autoPlay controls className="h-7 max-w-[190px]" />
                          <button
                            onClick={() => setPlayingQueueId(null)}
                            className="text-gray-400 hover:text-red-500"
                            title="Close player"
                          >
                            <span className="material-symbols-outlined text-[16px]">close</span>
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPlayingQueueId(l.id)}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#27AE60] hover:text-[#219653]"
                          title="Play last call recording"
                        >
                          <span className="material-symbols-outlined text-[15px]">play_circle</span>
                          Recording
                        </button>
                      )}
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
              Queue clear for today.
            </div>
          )}
        </div>
        )}

        {/* Pagination Footer — queue only; the revival list paginates itself */}
        {!showRevival && pagination.last_page > 1 && (
          <div className="p-3 border-t border-gray-200 bg-white flex justify-between items-center shrink-0">
            <button
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              className="px-2 py-1 border text-xs font-semibold rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Prev
            </button>
            <span className="text-xs text-gray-500 font-medium">
              Page {currentPage} of {pagination.last_page}
            </span>
            <button
              disabled={currentPage >= pagination.last_page}
              onClick={() => setCurrentPage(prev => Math.min(pagination.last_page, prev + 1))}
              className="px-2 py-1 border text-xs font-semibold rounded disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </section>

      {/* Right Panel - Lead details profile cockpit */}
      <section className="flex-1 flex flex-col bg-white overflow-hidden min-w-0">

        {leadRole === 'transporter' ? (
          !selectedId ? (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm italic p-8 text-center">
              Select a transporter from the queue to view details.
            </div>
          ) : (
            <CrossRoleLeadDetail
              role="transporter"
              detail={transporterDetailData?.data}
              loading={isTransporterDetailLoading}
              accent="#27AE60"
              canCall={agentState === 'ready' && callState === 'idle'}
              onCall={() => { const l = leads.find((x: any) => String(x.id) === String(selectedId)); if (l) handleCallNow(l); }}
            />
          )
        ) : isDetailLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-outline font-semibold">Loading details...</p>
          </div>
        ) : driverProfile ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Header block */}
            <div className="flex justify-between items-start gap-4">
              <div className="flex items-start gap-4">
                {/* Profile avatar */}
                <div className="relative shrink-0">
                  {driverProfile.profile_image ? (
                    <img
                      src={driverProfile.profile_image}
                      alt={driverProfile.name}
                      className="w-16 h-16 rounded-xl object-cover border-2 border-white shadow-md ring-1 ring-gray-200"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-[#EAFAF1] border-2 border-white shadow-md ring-1 ring-gray-200 flex items-center justify-center text-2xl font-bold text-[#27AE60]">
                      {(driverProfile.name || '?').trim().charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h1 className="text-xl font-bold text-gray-900">{driverProfile.name}</h1>
                    <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{driverProfile.tmid}</span>
                    <span className="border border-[#27AE60] text-[#27AE60] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                      DRIVER
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">{driverProfile.city}, {driverProfile.state}</div>

                  {/* Profile completion */}
                  <div className="flex items-center gap-2 mt-2 max-w-[240px]">
                    <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${completionPct}%`, backgroundColor: completionColor }}
                      />
                    </div>
                    <span className="text-xs font-bold" style={{ color: completionColor }}>
                      {completionPct}%
                    </span>
                    <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wide">Profile</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {!isAssignedToOther && (
                  <button
                    onClick={() => {
                      if (agentState !== 'ready') {
                        triggerToast(agentState === 'logged_out'
                          ? 'CTI login failed — check the SAN softphone panel (bottom-left) for the reason, e.g. agent already logged in elsewhere.'
                          : 'CTI agent is not ready yet — please wait a moment and try again.');
                        return;
                      }
                      if (callState !== 'idle') {
                        triggerToast('Finish or hang up the current call before dialing another lead.');
                        return;
                      }
                      const isSocial = String(driverProfile.id).startsWith('sm-');
                      const cleanId = isSocial ? parseInt(String(driverProfile.id).replace(/\D/g, ''), 10) : driverProfile.id;
                      dial(driverProfile.mobile, cleanId, driverProfile.name, driverProfile.tmid, isSocial ? 'social_media' : 'driver');
                    }}
                    className="bg-[#27AE60] hover:bg-[#219653] text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition-colors active:scale-95"
                    title="Call this lead directly"
                  >
                    <span className="material-symbols-outlined text-[16px]">call</span> Call Lead
                  </button>
                )}

                <button
                  onClick={() => {
                    setBankPrefill({
                      user_id: driverProfile.id ? Number(driverProfile.id) : undefined,
                      tmid: driverProfile.tmid || '',
                      name: driverProfile.name || '',
                      mobile: driverProfile.mobile || '',
                    });
                    setIsBankModalOpen(true);
                  }}
                  className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white text-xs font-bold px-3 py-1.5 rounded-md flex items-center gap-1.5 shadow-sm transition-colors active:scale-95"
                  title="Add to matchmaking driver bank"
                >
                  <span className="material-symbols-outlined text-[16px]">account_box</span> Add to Bank
                </button>

                <span className="bg-[#EAFAF1] text-[#27AE60] text-xs font-bold px-2.5 py-1 rounded-full flex items-center gap-1 border border-[#27AE60]/20">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#27AE60]"></span> Language: {driverProfile.language.toUpperCase()}
                </span>
              </div>
            </div>

            {/* Subscription Status Badge */}
            <div className="w-full">
              {planCard?.has_plan ? (
                <div className="bg-[#EAFAF1] border border-[#27AE60]/20 text-[#27AE60] p-3 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                  <span>SUBSCRIBED: {planCard.plan_label}</span>
                  <span>Expires: {planCard.expires_at}</span>
                </div>
              ) : (
                <div className="bg-[#FDEDEC] border border-red-100 text-[#C0392B] p-3 rounded-lg flex items-center justify-between text-xs font-bold shadow-sm">
                  <span>NOT SUBSCRIBED</span>
                  <span className="uppercase text-[10px] bg-red-100 px-1.5 py-0.5 rounded">Conversion Target Pending</span>
                </div>
              )}
            </div>

            {/* KYC / Documents */}
            <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px]">folder_shared</span>
                Documents / KYC
                <span className="ml-1 text-[10px] font-bold text-gray-400 normal-case tracking-normal">
                  ({documents.filter((d: any) => d.uploaded).length}/{documents.length} uploaded)
                </span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {documents.map((doc: any) => (
                  <div
                    key={doc.key}
                    className={`border rounded-lg p-3 flex flex-col items-center text-center gap-1.5 ${doc.uploaded ? 'border-[#27AE60]/30 bg-[#EAFAF1]' : 'border-gray-200 bg-gray-50'}`}
                  >
                    <span className={`material-symbols-outlined text-[22px] ${doc.uploaded ? 'text-[#27AE60]' : 'text-gray-300'}`}>
                      {doc.uploaded ? 'task_alt' : 'block'}
                    </span>
                    <span className="text-[11px] font-bold text-gray-700">{doc.label}</span>
                    {doc.uploaded && doc.url ? (
                      <button
                        type="button"
                        onClick={() => setViewerDoc({ url: doc.url, label: doc.label })}
                        className="text-[10px] font-bold text-[#27AE60] hover:underline flex items-center gap-0.5"
                      >
                        <span className="material-symbols-outlined text-[12px]">visibility</span> View
                      </button>
                    ) : (
                      <span className="text-[10px] text-gray-400 font-medium">Not uploaded</span>
                    )}
                  </div>
                ))}
                {documents.length === 0 && (
                  <div className="col-span-full text-center text-xs text-gray-400 italic py-3">No document data available.</div>
                )}
              </div>
            </div>

            {/* Profile Card key-value grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Personal Info */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">person</span> Personal Details
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Father's Name</span>
                    <span className="font-bold text-gray-800 mt-0.5 block truncate" title={driverProfile.father_name || 'N/A'}>{driverProfile.father_name || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Date of Birth</span>
                    <span className="font-bold text-gray-800 mt-0.5 block">{driverProfile.dob || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Gender</span>
                    <span className="font-bold text-gray-800 mt-0.5 block capitalize">{driverProfile.sex || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Marital Status</span>
                    <span className="font-bold text-gray-800 mt-0.5 block">{driverProfile.marital_status || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Education</span>
                    <span className="font-bold text-gray-800 mt-0.5 block">{driverProfile.education || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Email</span>
                    <span className="font-bold text-gray-800 mt-0.5 block truncate">**********</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block uppercase text-[9px]">Full Address</span>
                    <span className="font-bold text-gray-800 mt-0.5 block truncate" title={driverProfile.address || 'N/A'}>
                      {driverProfile.address || 'N/A'} {driverProfile.pincode ? `(${driverProfile.pincode})` : ''}
                    </span>
                  </div>
                </div>
              </div>

              {/* License & Professional */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">badge</span> Professional Info
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Vehicle Type</span>
                    <span className="font-bold text-gray-800 mt-0.5 block">{driverProfile.vehicle_type || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Experience</span>
                    <span className="font-bold text-gray-800 mt-0.5 block">{driverProfile.experience || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">License Type</span>
                    <span className="font-bold text-gray-800 mt-0.5 block">{driverProfile.license_type || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">License Number</span>
                    <span className="font-bold text-gray-800 mt-0.5 block font-mono">{driverProfile.license_number || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">License Expiry</span>
                    <span className="font-bold text-gray-800 mt-0.5 block">{driverProfile.license_expiry || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Prev Employer</span>
                    <span className="font-bold text-gray-800 mt-0.5 block truncate" title={driverProfile.previous_employer || 'N/A'}>{driverProfile.previous_employer || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Preferences & Earnings */}
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">settings_suggest</span> Preference & Earnings
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Current Income</span>
                    <span className="font-bold text-[#27AE60] mt-0.5 block">{driverProfile.current_income ? `₹${driverProfile.current_income}` : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Expected Income</span>
                    <span className="font-bold text-gray-800 mt-0.5 block">{driverProfile.expected_income ? `₹${driverProfile.expected_income}` : 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Placement Status</span>
                    <span className="font-bold text-gray-800 mt-0.5 block capitalize">{driverProfile.job_placement || 'N/A'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400 block uppercase text-[9px]">Referral Code</span>
                    <span className="font-bold text-gray-800 mt-0.5 block font-mono">{driverProfile.referral_code || 'None'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block uppercase text-[9px]">Preferred Location</span>
                    <span className="font-bold text-gray-800 mt-0.5 block truncate" title={driverProfile.preferred_location || 'N/A'}>{driverProfile.preferred_location || 'N/A'}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-gray-400 block uppercase text-[9px]">Routes</span>
                    <span className="font-bold text-gray-800 mt-0.5 block truncate" title={driverProfile.routes || 'N/A'}>{driverProfile.routes || 'N/A'}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Applied Jobs Section */}
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 shadow-sm mb-8">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-[16px]">work</span> Applied Jobs ({appliedJobs.length})
              </h3>
              {appliedJobs.length > 0 ? (
                <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                  {appliedJobs.map((job: any, idx: number) => (
                    <div key={idx} className="border border-gray-200 rounded p-3 bg-white text-xs">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-bold text-gray-900">{job.job_title || 'N/A'} (ID: {job.job_id})</span>
                        <span className="text-gray-500">{new Date(job.applied_at).toLocaleDateString()}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 mb-3">
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase">Transporter</span>
                          <span className="font-semibold text-gray-800">{job.transporter_name || 'N/A'} <span className="font-mono text-[9px] text-gray-400 bg-gray-100 px-1 rounded">{job.transporter_tmid}</span></span>
                        </div>
                        <div>
                          <span className="text-gray-400 block text-[9px] uppercase">Assigned Telecaller</span>
                          <span className="font-semibold text-gray-800">{job.assigned_telecaller || 'Unassigned'}</span>
                        </div>
                      </div>
                      
                      {/* Transporter Call History */}
                      <div>
                        <span className="text-gray-400 block text-[9px] uppercase mb-1">Transporter Call History</span>
                        {job.transporter_call_history && job.transporter_call_history.length > 0 ? (
                          <div className="bg-gray-50 border border-gray-100 rounded p-2 space-y-2">
                            {job.transporter_call_history.map((th: any, tidx: number) => (
                              <div key={tidx} className="flex justify-between border-b border-gray-100 last:border-0 pb-1 last:pb-0">
                                <div>
                                  <span className="font-semibold text-gray-700 capitalize">{th.call_status}</span>
                                  {th.call_feedback && <span className="text-gray-500 ml-1 text-[10px]">({th.call_feedback})</span>}
                                  {th.call_remarks && <div className="text-gray-400 text-[10px] italic mt-0.5 truncate max-w-[200px]" title={th.call_remarks}>"{th.call_remarks}"</div>}
                                </div>
                                <div className="text-right">
                                  <span className="text-gray-500 block text-[10px]">{new Date(th.created_at).toLocaleDateString()}</span>
                                  <span className="text-gray-400 text-[9px]">{th.assigned_name}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span className="italic text-gray-400">No recent calls recorded.</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No job applications found.</p>
              )}
            </div>

            {/* History and Notes Column Layout */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              
              {/* Timeline */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">history</span> Call History Timeline
                </h3>
                
                <div className="border border-gray-200 rounded-xl p-4 bg-white max-h-[250px] overflow-y-auto divide-y divide-gray-100">
                  {combinedHistory.length > 0 ? (
                    combinedHistory.map((hist, idx) => {
                      const badge = getStatusBadge(hist.status);
                      return (
                        <div key={idx} className="py-2.5 first:pt-0 last:pb-0 text-xs">
                          <div className="flex justify-between items-center mb-1 font-semibold">
                            <div className="flex items-center gap-2">
                              <span className="text-gray-800">{hist.date} — {hist.duration}</span>
                              <span className={`px-1.5 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold ${hist.source === 'Matchmaking' ? 'bg-purple-100 text-purple-700 border border-purple-200' : 'bg-gray-100 text-gray-600 border border-gray-200'}`}>
                                {hist.source}
                              </span>
                            </div>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${badge.cls}`}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-gray-500">Caller: {hist.caller}</p>
                          {hist.feedback && <p className="text-gray-600 mt-0.5 font-medium">Feedback: {hist.feedback}</p>}
                          {hist.remarks && <p className="text-gray-400 mt-0.5 italic">Remarks: {hist.remarks}</p>}
                          {hist.recording_url && (
                            <div className="mt-1.5">
                              {playingHistoryIdx === idx ? (
                                <div className="flex items-center gap-1.5">
                                  <audio src={hist.recording_url} autoPlay controls className="h-7 max-w-[220px]" />
                                  <button
                                    onClick={() => setPlayingHistoryIdx(null)}
                                    className="text-gray-400 hover:text-red-500"
                                    title="Close player"
                                  >
                                    <span className="material-symbols-outlined text-[16px]">close</span>
                                  </button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => setPlayingHistoryIdx(idx)}
                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#27AE60] hover:text-[#219653]"
                                  title="Play call recording"
                                >
                                  <span className="material-symbols-outlined text-[15px]">play_circle</span>
                                  Recording
                                </button>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })
                  ) : (
                    <p className="text-xs text-gray-400 italic text-center py-4">No previous calls recorded.</p>
                  )}
                </div>
              </div>

              {/* Note Editor / Recent Remarks */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px]">notes</span> Latest Call Feedback Remarks
                </h3>
                
                <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col relative min-h-[140px] text-xs text-gray-600">
                  {ivrHistory[0]?.call_remarks ? (
                    <div>
                      <p className="font-semibold text-gray-800">Last Remark ({new Date(ivrHistory[0].created_at).toLocaleDateString()}):</p>
                      <p className="mt-1 italic">"{ivrHistory[0].call_remarks}"</p>
                    </div>
                  ) : (
                    <p className="italic text-gray-400">No previous call remarks logged.</p>
                  )}
                </div>
              </div>

            </div>

          </div>
        ) : (
          <div className="flex-1 flex items-center justify-center text-gray-400 text-xs italic">
            Select a lead from the queue to view profile.
          </div>
        )}

        {/* Bottom Fixed Action Bar */}
        {driverProfile && (
          <div className="border-t border-gray-200 bg-white p-4 flex flex-wrap justify-between items-center gap-2 shadow-[0_-2px_10px_rgba(0,0,0,0.02)] shrink-0 z-10">
            <div className="flex items-center gap-2 flex-grow md:flex-grow-0">
              {!isAssignedToOther ? (
                <>
                  <button 
                    onClick={() => handleCallNow(driverProfile)}
                    className="bg-[#27AE60] hover:bg-[#219653] text-white h-11 px-6 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-sm flex-1 md:flex-none justify-center active:scale-[0.98]"
                  >
                    <span className="material-symbols-outlined text-[18px]">phone</span> Call Now
                  </button>
                  <button 
                    onClick={() => {
                      setBankPrefill({
                        user_id: driverProfile.id ? Number(driverProfile.id) : undefined,
                        tmid: driverProfile.tmid || '',
                        name: driverProfile.name || '',
                        mobile: driverProfile.mobile || '',
                      });
                      setIsBankModalOpen(true);
                    }}
                    className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white h-11 px-4 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-sm flex-1 md:flex-none justify-center active:scale-[0.98]"
                    title="Add to matchmaking driver bank"
                  >
                    <span className="material-symbols-outlined text-[18px]">account_box</span> Add to Bank
                  </button>
                </>
              ) : (
                <div className="bg-red-50 text-red-700 border border-red-100 text-xs font-semibold px-4 py-2.5 rounded-lg flex items-center gap-1.5 shadow-sm">
                  <span className="material-symbols-outlined text-[16px]">lock</span> Assigned to Another Agent
                </div>
              )}
            </div>

            <div className="flex items-center gap-1">
              <select 
                onChange={(e) => {
                  if (e.target.value) {
                    handleQuickAction(e.target.value);
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
        )}

      </section>

      {isBankModalOpen && bankPrefill && (
        <DriverForm
          prefill={bankPrefill}
          onClose={() => {
            setIsBankModalOpen(false);
            setBankPrefill(null);
            triggerToast('Driver added to Matchmaking Driver Bank successfully!');
          }}
        />
      )}

    </main>
  );
};

export default DwCallQueue;
