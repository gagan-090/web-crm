import React, { useState, useEffect } from 'react';
import {
  useGetDwLeadDetailQuery,
  useSubmitDwFeedbackMutation
} from '../../services/api/webCrmApi';
import { useQueueCache, useQueueCountsCache, invalidateQueueCache } from '../../shared/hooks/useQueueCache';
import { useSanCti } from '../../shared/components/cti/SanCtiProvider';

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

export const DwCallQueue: React.FC = () => {
  const { dial, callState } = useSanCti();

  // Search, Tab, Sort & Pagination States
  const [activeTab, setActiveTab] = useState<'fresh' | 'old' | 'uncalled' | 'callbacks' | 'called'>('fresh');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

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

  const activeFilters = {
    subscribed: filterSubscribed !== 'all' ? filterSubscribed : undefined,
    pan: filterPan !== 'all' ? filterPan : undefined,
    salary: filterSalary !== 'all' ? filterSalary : undefined,
    vehicle_type: filterVehicleType || undefined,
    experience: filterExperience !== 'all' ? filterExperience : undefined,
    profile_complete: filterProfileComplete !== 'all' ? filterProfileComplete : undefined,
    route: filterRoute || undefined,
    state_id: filterStateId ? Number(filterStateId) : undefined,
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
    setCurrentPage(1);
  };

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
  }, activeFilters);

  const { counts, isFetching: isCountsFetching, refetch: refetchCounts } = useQueueCountsCache();

  const handleRefresh = () => {
    refetchQueue();
    refetchCounts();
  };

  const leads = queueData?.leads || [];
  const pagination = queueData?.pagination || { total: 0, per_page: 20, current_page: 1, last_page: 1 };

  // Selected Lead state
  const [selectedId, setSelectedId] = useState<number | string>('');

  useEffect(() => {
    if (leads.length > 0) {
      const exists = leads.some(l => l.id === selectedId);
      if (!exists) {
        setSelectedId(leads[0].id);
      }
    } else {
      setSelectedId('');
    }
  }, [leads, selectedId]);

  // Fetch lead details dynamically when selectedId changes
  // refetchOnMountOrArgChange: this panel is revisited often right after a call
  // (Call Queue -> Active Call Focus -> back to Call Queue), and RTK Query's
  // default cache would otherwise serve a result from before the latest call
  // history row was written.
  const { data: detailResponse, isLoading: isDetailLoading, refetch: refetchDetail } = useGetDwLeadDetailQuery(selectedId, {
    skip: !selectedId,
    refetchOnMountOrArgChange: true
  });

  const [submitFeedback] = useSubmitDwFeedbackMutation();

  // When a call dialed from THIS screen completes disposition (via the global
  // PostCallDispositionModal, rendered in DashboardLayout), refresh the list
  // so the now-called lead drops out of view and tab counts update — without
  // ever having navigated away to do it.
  useEffect(() => {
    const handleDispositionComplete = () => {
      if (selectedId) {
        removeLead(Number(selectedId));
      }
      invalidateQueueCache();
      refetchCounts();
      refetchQueue();
      refetchDetail();
    };
    window.addEventListener('san-disposition-complete', handleDispositionComplete);
    return () => window.removeEventListener('san-disposition-complete', handleDispositionComplete);
  }, [selectedId, removeLead, refetchCounts, refetchQueue, refetchDetail]);

  const driverProfile = detailResponse?.data?.profile;
  const planCard = detailResponse?.data?.plan_card;
  const ivrHistory = detailResponse?.data?.ivr_history || [];

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const getBorderColorClass = (lead: any) => {
    if (lead.last_status === 'callback_later') {
      return 'border-[#27AE60]'; // Green
    }
    if (!lead.last_status) {
      return 'border-[#3498DB]'; // Blue (Fresh)
    }
    return 'border-gray-200';
  };

  const handleCallNow = (lead: any) => {
    // Dial directly from this screen instead of navigating to Active Call
    // Focus. CallControlBar (the floating call status bar) and
    // PostCallDispositionModal are both rendered globally in DashboardLayout,
    // so the in-progress call and the post-call disposition form simply
    // appear on top of this screen — the agent never has to leave it.
    if (callState !== 'idle') {
      triggerToast('Finish or hang up the current call before dialing another lead.');
      return;
    }
    setSelectedId(lead.id);
    dial(lead.mobile, lead.id, lead.name, lead.tmid);
  };

  const handleQuickAction = async (action: string) => {
    if (!selectedId) return;
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
    }
  };

  // Call timeline — sourced solely from call_history_ivr.
  // status stays as the raw lowercase DB value (e.g. 'connected',
  // 'not_connected', 'callback_later') so the badge color lookup below
  // doesn't depend on any pre-formatted display string.
  const combinedHistory = [...ivrHistory]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .map(h => ({
      date: new Date(h.created_at).toLocaleString(),
      duration: `${Math.floor(((h as any).active_time || 0) / 60)}m ${((h as any).active_time || 0) % 60}s`,
      status: h.call_status || '',
      caller: h.assigned_name || 'IVR System',
      feedback: h.call_feedback || '',
      remarks: h.call_remarks || ''
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

      {/* Left Panel - Staging Call Queue */}
      <section className="w-[380px] border-r border-gray-200 flex flex-col bg-gray-50/50 shrink-0">
        
        {/* Tab & Sort Header */}
        <div className="p-3 border-b border-gray-200 shrink-0 bg-white">
          <div className="flex justify-between items-center mb-3">
            <span className="text-xs font-bold text-gray-700 uppercase tracking-wider">Queue Routing</span>
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
          <div className="flex flex-wrap gap-1 pb-1">
            {[
              { id: 'fresh', label: `Fresh (${counts?.fresh ?? 0})` },
              { id: 'old', label: `Old Leads (${counts?.old ?? 0})` },
              { id: 'uncalled', label: `Uncalled (${counts?.uncalled ?? 0})` },
              { 
                id: 'callbacks', 
                label: (
                  <span className="flex items-center gap-1">
                    Callbacks ({counts?.callbacks ?? 0})
                    {counts?.overdue_callbacks && counts.overdue_callbacks > 0 ? (
                      <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" title={`${counts.overdue_callbacks} Overdue`}></span>
                    ) : null}
                  </span>
                )
              },
              { id: 'called', label: `Called Today (${counts?.called_today ?? 0})` }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setCurrentPage(1); }}
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

        {/* Pagination Footer */}
        {pagination.last_page > 1 && (
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
        
        {isDetailLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-sm text-outline font-semibold">Loading details...</p>
          </div>
        ) : driverProfile ? (
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            
            {/* Header block */}
            <div className="flex justify-between items-start gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl font-bold text-gray-900">{driverProfile.name}</h1>
                  <span className="font-mono text-xs bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{driverProfile.tmid}</span>
                  <span className="border border-[#27AE60] text-[#27AE60] text-[10px] font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                    DRIVER
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">{driverProfile.city}, {driverProfile.state}</div>
              </div>
              
              <div>
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
                    <span className="font-bold text-gray-800 mt-0.5 block truncate" title={driverProfile.email || 'N/A'}>{driverProfile.email || 'N/A'}</span>
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
                            <span className="text-gray-800">{hist.date} — {hist.duration}</span>
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${badge.cls}`}>
                              {badge.label}
                            </span>
                          </div>
                          <p className="text-gray-500">Caller: {hist.caller}</p>
                          {hist.feedback && <p className="text-gray-600 mt-0.5 font-medium">Feedback: {hist.feedback}</p>}
                          {hist.remarks && <p className="text-gray-400 mt-0.5 italic">Remarks: {hist.remarks}</p>}
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
              <button 
                onClick={() => handleCallNow(driverProfile)}
                className="bg-[#27AE60] hover:bg-[#219653] text-white h-11 px-6 rounded-lg font-bold text-xs flex items-center gap-2 transition-all shadow-sm flex-1 md:flex-none justify-center active:scale-[0.98]"
              >
                <span className="material-symbols-outlined text-[18px]">phone</span> Call Now
              </button>
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

    </main>
  );
};

export default DwCallQueue;
