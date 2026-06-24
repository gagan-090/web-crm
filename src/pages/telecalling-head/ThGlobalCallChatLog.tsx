import React, { useState, useMemo } from 'react';
import { useGetThCallLogQuery, useGetThSocialChatLogQuery } from '../../services/api/teleheadApi';

// ── Types ──────────────────────────────────────────────────────────────────────
interface LiveCallRecord {
  id: number;
  user_tm_id: string;
  user_name: string;
  user_mobile: string;
  assigned_name: string;
  process: string;
  process_code: 'DW' | 'TR' | 'MM' | 'SC';
  call_status: string | null;
  outcome_label: string;
  call_feedback: string;
  call_remarks: string;
  call_recording: string | null;
  call_type: string;
  match_status: string;
  job_id: string | null;
  created_at: string;
  date_display: string;
}

interface ChatRecord {
  id: number;
  assigned_id: number;
  name: string;
  mobile: string;
  source: string;
  role: string;
  lead_remarks: string;
  call_status: string;
  call_feedbacks: string;
  call_duration: number;
  created_at: string;
  updated_at: string;
}

// ── Process badge colour ───────────────────────────────────────────────────────
const processBadgeClass = (code: string) => {
  switch (code) {
    case 'DW': return 'bg-green-500';
    case 'TR': return 'bg-orange-500';
    case 'MM': return 'bg-purple-500';
    default:   return 'bg-teal-500';
  }
};

// ── Outcome badge colour ───────────────────────────────────────────────────────
const outcomeBadgeClass = (label: string) => {
  switch (label) {
    case 'Converted': return 'bg-green-100 text-green-800';
    case 'Connected': return 'bg-blue-100 text-blue-800';
    case 'Callback':  return 'bg-yellow-100 text-yellow-800';
    default:          return 'bg-gray-100 text-gray-800';
  }
};




// ══════════════════════════════════════════════════════════════════════════════
export const ThGlobalCallChatLog: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CALL' | 'CHAT'>('CALL');

  // ── Filter state ─────────────────────────────────────────────────────────
  const [processFilter, setProcessFilter] = useState('ALL');
  const [callerFilter,  setCallerFilter]  = useState('ALL');
  const [outcomeFilter, setOutcomeFilter] = useState('ALL');
  const [searchQuery,   setSearchQuery]   = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(1);

  // Debounce search — update after user stops typing 400ms
  const handleSearchChange = (val: string) => {
    setSearchQuery(val);
    clearTimeout((window as any).__searchTimer);
    (window as any).__searchTimer = setTimeout(() => {
      setDebouncedSearch(val);
      setPage(1);
    }, 400);
  };

  // ── Playing / slideout state ──────────────────────────────────────────────
  const [playingId,    setPlayingId]    = useState<number | null>(null);
  const [selectedCall, setSelectedCall] = useState<LiveCallRecord | null>(null);

  // ── Live API fetch ────────────────────────────────────────────────────────
  const callParams = useMemo(() => ({
    per_page: 25,
    page,
    process:  processFilter !== 'ALL' ? processFilter : undefined,
    caller:   callerFilter  !== 'ALL' ? callerFilter  : undefined,
    outcome:  outcomeFilter !== 'ALL' ? outcomeFilter : undefined,
    search:   debouncedSearch || undefined,
  }), [processFilter, callerFilter, outcomeFilter, debouncedSearch, page]);

  const { data: callLogData, isLoading, isFetching, isError, refetch } =
    useGetThCallLogQuery(callParams, { pollingInterval: 60000 });

  const { data: chatData, isLoading: chatLoading } =
    useGetThSocialChatLogQuery({}, { skip: activeTab !== 'CHAT' });

  const calls: LiveCallRecord[] = callLogData?.data ?? [];
  const pagination = callLogData?.pagination ?? null;
  const callers: string[] = callLogData?.callers ?? [];
  const chats: ChatRecord[] = Array.isArray(chatData) ? chatData : [];

  // ── Helpers ───────────────────────────────────────────────────────────────
  const totalPages = pagination?.last_page ?? 1;

  return (
    <main className="bg-background p-md space-y-lg text-xs font-sans max-w-[1440px] mx-auto relative min-h-[600px]">

      {/* ── Title + Tabs ──────────────────────────────────────────────────── */}
      <section className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-md border-b border-outline-variant pb-xs">
        <div>
          <h2 className="text-lg font-extrabold text-on-surface">Global Call &amp; Chat Audit Log</h2>
          <p className="text-[10px] text-outline font-semibold">
            System-wide monitoring with zero scope boundaries
            {isFetching && <span className="ml-2 text-primary animate-pulse">↻ Refreshing…</span>}
          </p>
        </div>

        <div className="flex border border-outline-variant rounded-sm overflow-hidden select-none">
          <button
            onClick={() => setActiveTab('CALL')}
            className={`px-md py-1.5 font-bold text-[11px] flex items-center gap-xs ${
              activeTab === 'CALL' ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">call</span>
            Call Recording Logs
          </button>
          <button
            onClick={() => setActiveTab('CHAT')}
            className={`px-md py-1.5 font-bold text-[11px] flex items-center gap-xs ${
              activeTab === 'CHAT' ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-container'
            }`}
          >
            <span className="material-symbols-outlined text-[16px]">chat</span>
            WhatsApp Threads
          </button>
        </div>
      </section>

      {/* ── Filter Bar ────────────────────────────────────────────────────── */}
      <section className="bg-white p-sm border border-outline-variant rounded-sm flipkart-shadow grid grid-cols-1 sm:grid-cols-5 gap-sm items-end">
        {/* Process */}
        <div>
          <label className="text-[9px] text-outline font-bold uppercase block mb-1">Process</label>
          <select
            value={processFilter}
            onChange={(e) => { setProcessFilter(e.target.value); setPage(1); }}
            className="w-full bg-white border border-outline-variant p-1.5 rounded-sm focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="ALL">All Processes</option>
            <option value="DW">Driver Onboarding</option>
            <option value="TR">Transporter Onboarding</option>
            <option value="MM">Job Matching</option>
            <option value="SC">Special Categories</option>
          </select>
        </div>

        {/* Caller Agent — populated from API */}
        <div>
          <label className="text-[9px] text-outline font-bold uppercase block mb-1">
            Caller Agent {callers.length > 0 && `(${callers.length})`}
          </label>
          <select
            value={callerFilter}
            onChange={(e) => { setCallerFilter(e.target.value); setPage(1); }}
            className="w-full bg-white border border-outline-variant p-1.5 rounded-sm focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="ALL">All Callers</option>
            {callers.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Outcome */}
        <div>
          <label className="text-[9px] text-outline font-bold uppercase block mb-1">Outcome</label>
          <select
            value={outcomeFilter}
            onChange={(e) => { setOutcomeFilter(e.target.value); setPage(1); }}
            className="w-full bg-white border border-outline-variant p-1.5 rounded-sm focus:ring-1 focus:ring-primary outline-none"
          >
            <option value="ALL">All Outcomes</option>
            <option value="connected">Connected</option>
            <option value="not_connected">NR / Not Connected</option>
            <option value="callback_later">Callback Later</option>
          </select>
        </div>

        {/* Global Search */}
        <div className="sm:col-span-2">
          <label className="text-[9px] text-outline font-bold uppercase block mb-1">Global Search</label>
          <input
            type="text"
            placeholder="Search by TMID, Lead Name, or Phone…"
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="w-full bg-white border border-outline-variant p-1.5 rounded-sm focus:ring-1 focus:ring-primary outline-none"
          />
        </div>
      </section>

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB 1: CALL LOG                                                    */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'CALL' && (
        <section className="bg-white border border-outline-variant rounded-sm flipkart-shadow overflow-hidden">
          {/* Header bar */}
          <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
            <div className="flex items-center gap-md">
              <span className="font-bold text-outline text-[10px] uppercase">Recordings Database</span>
              {pagination && (
                <span className="text-[10px] text-outline">
                  {pagination.total.toLocaleString()} records · Page {pagination.current_page} of {pagination.last_page}
                </span>
              )}
            </div>
            <button
              onClick={() => refetch()}
              className="text-primary font-bold hover:underline flex items-center gap-xs text-[11px]"
            >
              <span className="material-symbols-outlined text-[14px]">refresh</span>
              Refresh
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container text-outline text-[10px] uppercase font-extrabold border-b border-outline-variant">
                <tr>
                  <th className="px-md py-3 w-10"></th>
                  <th className="px-md py-3">Date / Time</th>
                  <th className="px-md py-3">Caller Agent</th>
                  <th className="px-md py-3">Process</th>
                  <th className="px-md py-3">Lead / TMID</th>
                  <th className="px-md py-3">Status</th>
                  <th className="px-md py-3">Feedback</th>
                  <th className="px-md py-3">Remarks</th>
                  <th className="px-md py-3 text-center">Recording</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-outline-variant font-medium text-on-surface">
                {/* Loading skeleton */}
                {(isLoading || isFetching) && calls.length === 0 && (
                  Array.from({ length: 8 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 9 }).map((_, j) => (
                        <td key={j} className="px-md py-3">
                          <div className="h-3 bg-surface-container rounded w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                )}

                {/* Error state */}
                {isError && (
                  <tr>
                    <td colSpan={9} className="text-center py-xl">
                      <div className="text-red-600 font-bold">Failed to load call log. Check backend connection.</div>
                      <button onClick={() => refetch()} className="mt-sm text-primary underline font-bold">Retry</button>
                    </td>
                  </tr>
                )}

                {/* Data rows */}
                {!isLoading && calls.map((call) => (
                  <React.Fragment key={call.id}>
                    <tr
                      onClick={() => setSelectedCall(call)}
                      className="hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      {/* Play button */}
                      <td className="px-md py-3" onClick={(e) => e.stopPropagation()}>
                        {call.call_recording ? (
                          <button
                            title="Play recording"
                            onClick={() => setPlayingId(playingId === call.id ? null : call.id)}
                            className="material-symbols-outlined text-primary text-[20px] hover:scale-110 active:scale-95 transition-transform"
                          >
                            {playingId === call.id ? 'pause_circle' : 'play_circle'}
                          </button>
                        ) : (
                          <span
                            title="No recording"
                            className="material-symbols-outlined text-outline opacity-30 text-[18px]"
                          >
                            mic_off
                          </span>
                        )}
                      </td>

                      {/* Date/Time — shifted to current */}
                      <td className="px-md py-3 font-data-mono whitespace-nowrap">
                        <span className="font-bold text-on-surface">{call.date_display}</span>
                      </td>

                      {/* Caller Agent */}
                      <td className="px-md py-3 font-bold whitespace-nowrap">{call.assigned_name}</td>

                      {/* Process badge */}
                      <td className="px-md py-3">
                        <div className="flex flex-col gap-0.5">
                          <span className={`inline-block px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold text-white ${processBadgeClass(call.process_code)}`}>
                            {call.process_code}
                          </span>
                          <span className="text-[9px] text-outline">{call.process}</span>
                        </div>
                      </td>

                      {/* Lead / TMID */}
                      <td className="px-md py-3">
                        <div className="font-bold text-on-surface">{call.user_name}</div>
                        <div className="font-data-mono text-[10px] text-primary">{call.user_tm_id}</div>
                        {call.user_mobile && (
                          <div className="text-[9px] text-outline">{call.user_mobile}</div>
                        )}
                      </td>

                      {/* Outcome */}
                      <td className="px-md py-3">
                        <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold ${outcomeBadgeClass(call.outcome_label)}`}>
                          {call.outcome_label}
                        </span>
                      </td>

                      {/* Feedback */}
                      <td className="px-md py-3 max-w-[130px]">
                        <span className="block truncate" title={call.call_feedback}>
                          {call.call_feedback || <span className="text-outline italic">—</span>}
                        </span>
                      </td>

                      {/* Remarks */}
                      <td className="px-md py-3 max-w-[150px]">
                        <span className="block truncate text-on-surface-variant" title={call.call_remarks}>
                          {call.call_remarks || <span className="text-outline italic">—</span>}
                        </span>
                      </td>

                      {/* Recording link/icon */}
                      <td className="px-md py-3 text-center" onClick={(e) => e.stopPropagation()}>
                        {call.call_recording ? (
                          <a
                            href={call.call_recording}
                            target="_blank"
                            rel="noreferrer"
                            className="text-primary hover:underline font-bold text-[10px] flex items-center justify-center gap-0.5"
                            title="Open recording"
                          >
                            <span className="material-symbols-outlined text-[14px]">headphones</span>
                            Listen
                          </a>
                        ) : (
                          <span className="text-outline italic text-[10px]">No file</span>
                        )}
                      </td>
                    </tr>

                    {/* Inline audio player */}
                    {playingId === call.id && call.call_recording && (
                      <tr>
                        <td colSpan={9} className="bg-primary/5 px-md py-sm border-b border-outline-variant">
                          <div className="flex items-center gap-md">
                            <span className="font-bold text-primary font-data-mono text-[10px] whitespace-nowrap">
                              🎙 PLAYBACK — {call.user_name} ({call.user_tm_id})
                            </span>
                            <audio
                              src={call.call_recording}
                              controls
                              autoPlay
                              className="h-8 max-w-md w-full"
                            />
                            <button
                              onClick={() => setPlayingId(null)}
                              className="text-[10px] font-bold text-red-600 underline whitespace-nowrap"
                            >
                              Close Player
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}

                {/* Empty state */}
                {!isLoading && !isFetching && !isError && calls.length === 0 && (
                  <tr>
                    <td colSpan={9} className="text-center text-outline py-xl font-bold">
                      No call records match your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ─────────────────────────────────────────────────── */}
          {pagination && totalPages > 1 && (
            <div className="px-md py-sm border-t border-outline-variant flex items-center justify-between bg-surface-container-low">
              <span className="text-[10px] text-outline">
                Showing {((page - 1) * pagination.per_page) + 1}–{Math.min(page * pagination.per_page, pagination.total)} of {pagination.total.toLocaleString()} records
              </span>
              <div className="flex items-center gap-xs">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage(p => p - 1)}
                  className="px-sm py-1 border border-outline-variant rounded-sm text-[10px] font-bold disabled:opacity-40 hover:bg-surface-container disabled:cursor-not-allowed"
                >
                  ← Prev
                </button>
                <span className="text-[10px] font-bold px-sm">
                  {page} / {totalPages}
                </span>
                <button
                  disabled={page >= totalPages}
                  onClick={() => setPage(p => p + 1)}
                  className="px-sm py-1 border border-outline-variant rounded-sm text-[10px] font-bold disabled:opacity-40 hover:bg-surface-container disabled:cursor-not-allowed"
                >
                  Next →
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* TAB 2: CHAT LOG (Social Media)                                     */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {activeTab === 'CHAT' && (
        <section className="bg-white border border-outline-variant rounded-sm flipkart-shadow overflow-hidden">
          <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant">
            <span className="font-bold text-outline text-[10px] uppercase">WhatsApp / Social Chat Archive</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container text-outline text-[10px] uppercase font-extrabold border-b border-outline-variant">
                <tr>
                  <th className="px-md py-3">Date / Time</th>
                  <th className="px-md py-3">Lead Name</th>
                  <th className="px-md py-3">Mobile</th>
                  <th className="px-md py-3">Source</th>
                  <th className="px-md py-3">Role</th>
                  <th className="px-md py-3 w-80">Last Remark</th>
                  <th className="px-md py-3">Status</th>
                  <th className="px-md py-3">Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant font-medium text-on-surface">
                {chatLoading && (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="animate-pulse">
                      {Array.from({ length: 8 }).map((_, j) => (
                        <td key={j} className="px-md py-3">
                          <div className="h-3 bg-surface-container rounded w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                )}
                {!chatLoading && chats.map((chat) => (
                  <tr key={chat.id} className="hover:bg-surface-container transition-colors">
                    <td className="px-md py-3 font-data-mono whitespace-nowrap">
                      {chat.created_at ? new Date(chat.created_at).toLocaleString('en-IN', {
                        day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
                      }) : '—'}
                    </td>
                    <td className="px-md py-3 font-bold">{chat.name}</td>
                    <td className="px-md py-3 font-data-mono text-outline">{chat.mobile}</td>
                    <td className="px-md py-3">
                      <span className="bg-red-50 text-red-700 text-[8px] font-extrabold px-1 py-0.5 rounded border border-red-200 uppercase">
                        {chat.source?.replace('_', ' ') ?? '—'}
                      </span>
                    </td>
                    <td className="px-md py-3 capitalize">{chat.role}</td>
                    <td className="px-md py-3 max-w-xs truncate text-on-surface-variant" title={chat.lead_remarks}>
                      {chat.lead_remarks || '—'}
                    </td>
                    <td className="px-md py-3">
                      <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold ${outcomeBadgeClass(
                        chat.call_status === 'connected' ? 'Connected' : 'NR'
                      )}`}>
                        {chat.call_status?.replace('_', ' ') ?? '—'}
                      </span>
                    </td>
                    <td className="px-md py-3 truncate max-w-[120px]" title={chat.call_feedbacks}>
                      {chat.call_feedbacks || '—'}
                    </td>
                  </tr>
                ))}
                {!chatLoading && chats.length === 0 && (
                  <tr>
                    <td colSpan={8} className="text-center text-outline py-xl font-bold">
                      No social chat records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ════════════════════════════════════════════════════════════════════ */}
      {/* CALL DETAIL SLIDE-OUT PANEL                                        */}
      {/* ════════════════════════════════════════════════════════════════════ */}
      {selectedCall && (
        <div className="fixed inset-y-0 right-0 z-50 w-[420px] bg-white border-l border-outline-variant shadow-2xl flex flex-col">
          {/* Header */}
          <div className="bg-primary px-md py-sm text-white flex justify-between items-start">
            <div>
              <h3 className="font-bold text-sm">{selectedCall.user_name}</h3>
              <p className="text-[10px] opacity-80 font-data-mono">{selectedCall.user_tm_id}</p>
              {selectedCall.user_mobile && (
                <p className="text-[10px] opacity-70">{selectedCall.user_mobile}</p>
              )}
            </div>
            <button
              onClick={() => setSelectedCall(null)}
              className="material-symbols-outlined text-[20px] text-white hover:opacity-80"
            >
              close
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-md space-y-md">

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-xs text-xs">
              {[
                ['Date / Time',   selectedCall.date_display],
                ['Caller Agent',  selectedCall.assigned_name],
                ['Process Code',  selectedCall.process_code],
                ['Process',       selectedCall.process],
                ['Call Status',   selectedCall.call_status ?? '—'],
                ['Outcome',       selectedCall.outcome_label],
                ['Call Type',     selectedCall.call_type || '—'],
                ['Match Status',  selectedCall.match_status || '—'],
                ['Job ID',        selectedCall.job_id || '—'],
              ].map(([label, value]) => (
                <React.Fragment key={label}>
                  <span className="text-outline font-semibold py-1 border-b border-outline-variant/30">{label}</span>
                  <span className="font-bold text-on-surface py-1 border-b border-outline-variant/30 break-words">{value}</span>
                </React.Fragment>
              ))}
            </div>

            {/* Feedback */}
            <div>
              <p className="text-[9px] font-bold text-outline uppercase mb-1">Call Feedback</p>
              <div className="bg-surface-container-low p-sm rounded-sm text-xs font-medium text-on-surface min-h-[40px]">
                {selectedCall.call_feedback || <span className="text-outline italic">No feedback recorded.</span>}
              </div>
            </div>

            {/* Remarks */}
            <div>
              <p className="text-[9px] font-bold text-outline uppercase mb-1">Agent Remarks</p>
              <div className="bg-surface-container-low p-sm rounded-sm text-xs font-medium text-on-surface min-h-[40px]">
                {selectedCall.call_remarks || <span className="text-outline italic">No remarks recorded.</span>}
              </div>
            </div>

            {/* Recording */}
            <div>
              <p className="text-[9px] font-bold text-outline uppercase mb-1">Call Recording</p>
              {selectedCall.call_recording ? (
                <div className="space-y-xs">
                  <audio
                    src={selectedCall.call_recording}
                    controls
                    className="w-full h-9"
                  />
                  <a
                    href={selectedCall.call_recording}
                    target="_blank"
                    rel="noreferrer"
                    className="text-primary text-[10px] font-bold underline"
                  >
                    Open recording file ↗
                  </a>
                </div>
              ) : (
                <div className="bg-surface-container-low p-sm rounded-sm text-[10px] text-outline italic">
                  No recording file available for this call.
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-md border-t border-outline-variant">
            <button
              onClick={() => setSelectedCall(null)}
              className="w-full bg-primary text-white py-sm font-bold rounded-sm uppercase tracking-wider hover:opacity-90 transition-opacity"
            >
              Close Panel
            </button>
          </div>
        </div>
      )}

      {/* Overlay when slideout open */}
      {selectedCall && (
        <div
          className="fixed inset-0 z-40 bg-black/20"
          onClick={() => setSelectedCall(null)}
        />
      )}
    </main>
  );
};

export default ThGlobalCallChatLog;
