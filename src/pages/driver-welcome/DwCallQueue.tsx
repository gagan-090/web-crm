import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useGetDwQueueQuery, 
  useGetDwLeadDetailQuery,
  useSubmitDwFeedbackMutation 
} from '../../services/api/webCrmApi';

export const DwCallQueue: React.FC = () => {
  const navigate = useNavigate();

  // Search, Tab, Sort & Pagination States
  const [activeTab, setActiveTab] = useState<'fresh' | 'callbacks'>('fresh');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  // Map frontend tab to backend API filters
  const apiFilter = activeTab === 'callbacks' ? 'callback' : 'fresh';

  const { data: queueResponse, isLoading: isQueueLoading } = useGetDwQueueQuery({
    page: currentPage,
    filter: apiFilter,
    search: searchQuery || undefined,
    per_page: 20
  });

  const leads = queueResponse?.data?.leads || [];
  const summary = queueResponse?.data?.summary || { total: 0, fresh: 0, callback: 0, contacted: 0 };
  const pagination = queueResponse?.data?.pagination || { total: 0, per_page: 20, current_page: 1, last_page: 1 };

  // Selected Lead state
  const [selectedId, setSelectedId] = useState<number | string>('');

  useEffect(() => {
    if (leads.length > 0 && !selectedId) {
      setSelectedId(leads[0].id);
    }
  }, [leads, selectedId]);

  // Fetch lead details dynamically when selectedId changes
  const { data: detailResponse, isLoading: isDetailLoading } = useGetDwLeadDetailQuery(selectedId, {
    skip: !selectedId
  });

  const [submitFeedback] = useSubmitDwFeedbackMutation();

  const driverProfile = detailResponse?.data?.profile;
  const planCard = detailResponse?.data?.plan_card;
  const callHistory = detailResponse?.data?.call_history || [];
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
    navigate('/dw/dw-active-call-focus', {
      state: {
        userId: lead.id,
        tmid: lead.tmid,
        name: lead.name,
        mobile: lead.mobile
      }
    });
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

      triggerToast(`Lead status updated: ${callFeedback}`);
    } catch (err) {
      triggerToast('Failed to apply quick action.');
    }
  };

  // Combine and sort call timeline
  const combinedHistory = [
    ...callHistory.map(h => ({
      date: new Date(h.created_at).toLocaleString(),
      duration: `${Math.floor(h.active_time / 60)}m ${h.active_time % 60}s`,
      status: h.call_status === 'connected' ? 'Connected' : 'Not Connected',
      caller: h.caller_name || 'Agent',
      remarks: h.call_remarks || ''
    })),
    ...ivrHistory.map(h => ({
      date: new Date(h.created_at).toLocaleString(),
      duration: 'IVR Attempt',
      status: h.call_status || 'IVR',
      caller: h.assigned_name || 'IVR System',
      remarks: h.call_remarks || ''
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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
            <div className="flex items-center gap-2">
              <input 
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-32 px-2 py-1 text-xs border border-gray-300 rounded focus:ring-1 focus:ring-[#27AE60] outline-none"
              />
            </div>
          </div>

          {/* Filter Tab Row */}
          <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-none">
            {[
              { id: 'fresh', label: `Fresh (${summary.fresh})` },
              { id: 'callbacks', label: `Callbacks (${summary.callback})` }
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
            <div className="p-8 text-center text-gray-500 text-xs">Loading queue...</div>
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
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">Driver Profile</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                <div>
                  <span className="text-gray-400 block uppercase text-[10px]">Vehicle Type</span>
                  <span className="font-bold text-gray-800 mt-0.5 block">{driverProfile.vehicle_type || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase text-[10px]">License Type</span>
                  <span className="font-bold text-gray-800 mt-0.5 block">{driverProfile.license_type || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase text-[10px]">Experience</span>
                  <span className="font-bold text-gray-800 mt-0.5 block">{driverProfile.experience || 'N/A'}</span>
                </div>
                <div>
                  <span className="text-gray-400 block uppercase text-[10px]">Referral Code</span>
                  <span className="font-bold text-gray-800 mt-0.5 block">{driverProfile.referral_code || 'None'}</span>
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
                    combinedHistory.map((hist, idx) => (
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
                        {hist.remarks && <p className="text-gray-400 mt-0.5 italic">Remarks: {hist.remarks}</p>}
                      </div>
                    ))
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
                  {callHistory[0]?.call_remarks ? (
                    <div>
                      <p className="font-semibold text-gray-800">Last Remark ({new Date(callHistory[0].created_at).toLocaleDateString()}):</p>
                      <p className="mt-1 italic">"{callHistory[0].call_remarks}"</p>
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
