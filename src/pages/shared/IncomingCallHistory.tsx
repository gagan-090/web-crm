import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  useGetDwIncomingCallsQuery,
  useGetWctIncomingCallsQuery,
  useGetMmIncomingCallsQuery,
  type IncomingCallRow,
  type IncomingCallsParams,
} from '../../services/api/webCrmApi';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';

// ── Incoming Call History ────────────────────────────────────────────────────
//
// One screen shared by Driver Welcome (dw), Transporter Welcome (wct) and
// Matchmaking (mm). It answers the question the dashboards could not: "who
// called ME, and what do I know about them?"
//
// The dashboard's SAN CDR card only ever listed the 5 most recent MISSED calls
// with a name and a TMID. This lists EVERY incoming call for the period —
// answered and missed, the ones that popped on the agent's screen and the ones
// that only ever rang — each carrying the caller's complete lead record
// (TMID, role, location, plan, assignment, call history) and its disposition.
//
// Backend: IncomingCallController merges SAN's network CDR (webhook_crm — the
// only source that sees a call nobody answered) with the CRM's own
// call_history_ivr row (process = 'incoming'), so neither source's blind spot
// can hide a call.

export type IncomingProcess = 'dw' | 'wct' | 'mm';

interface ProcessConfig {
  label: string;
  leadNoun: string;
  activeCallPath: string;
  /** lead_type sent to /call/initiate when the caller has no users row. */
  fallbackLeadType: string;
  accent: string;
}

const PROCESS_CONFIG: Record<IncomingProcess, ProcessConfig> = {
  dw: {
    label: 'Driver Welcome Calling',
    leadNoun: 'Driver',
    activeCallPath: '/dw/dw-active-call-focus',
    fallbackLeadType: 'driver',
    accent: '#27AE60',
  },
  wct: {
    label: 'Transporter Welcome Calling',
    leadNoun: 'Transporter',
    activeCallPath: '/wct/wct-active-call-focus',
    fallbackLeadType: 'transporter',
    accent: '#2563EB',
  },
  mm: {
    label: 'Matchmaking',
    leadNoun: 'Lead',
    activeCallPath: '/mm/mm-active-call-focus-refined',
    fallbackLeadType: 'driver',
    accent: '#8E44AD',
  },
};

const PERIODS: { id: string; label: string }[] = [
  { id: 'today', label: 'Today' },
  { id: 'yesterday', label: 'Yesterday' },
  { id: 'last_7_days', label: 'Past 7 Days' },
  { id: 'this_week', label: 'This Week' },
  { id: 'this_month', label: 'This Month' },
  { id: 'all', label: 'All Time' },
];

const PER_PAGE = 25;

/**
 * Numbers stay masked here as they are everywhere else in the CRM — the CTI
 * dials from the record, agents never need to read one out. The last 4 digits
 * ARE shown, because for an unknown caller the number is the only identity the
 * row has and two "Unknown Caller" rows would otherwise be indistinguishable.
 */
const maskNumber = (n: string | null): string => {
  if (!n) return '—';
  const digits = n.replace(/\D/g, '');
  if (digits.length < 4) return '••••';
  return '••••••' + digits.slice(-4);
};

const statusPill = (status: string | null): string => {
  switch ((status || '').toLowerCase()) {
    case 'connected':      return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    case 'callback_later': return 'bg-amber-50 text-amber-700 border-amber-200';
    case 'not_connected':  return 'bg-rose-50 text-rose-700 border-rose-200';
    default:               return 'bg-gray-50 text-gray-500 border-gray-200';
  }
};

const rolePill = (role: string | null | undefined): string => {
  switch ((role || '').toLowerCase()) {
    case 'driver':      return 'bg-blue-50 text-blue-700 border-blue-200';
    case 'transporter': return 'bg-purple-50 text-purple-700 border-purple-200';
    default:            return 'bg-gray-100 text-gray-600 border-gray-200';
  }
};

interface KpiProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  tone: string;
}

const Kpi: React.FC<KpiProps> = ({ label, value, sub, icon, tone }) => (
  <div className="bg-white border border-gray-200 rounded-lg p-3 flex flex-col gap-1.5 shadow-sm">
    <div className="flex items-center justify-between">
      <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">{label}</span>
      <span
        className={`material-symbols-outlined w-6 h-6 rounded-md flex items-center justify-center ${tone}`}
        style={{ fontSize: '15px' }}
      >
        {icon}
      </span>
    </div>
    <div className="text-2xl font-bold leading-tight text-gray-800">{value}</div>
    {sub && <div className="text-[10px] text-gray-400 leading-none">{sub}</div>}
  </div>
);

const Field: React.FC<{ label: string; value?: React.ReactNode }> = ({ label, value }) => (
  <div>
    <label className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">{label}</label>
    <span className="text-sm font-semibold text-gray-800 break-words">{value || '—'}</span>
  </div>
);

export const IncomingCallHistory: React.FC<{ process: IncomingProcess }> = ({ process }) => {
  const navigate = useNavigate();
  const cfg = PROCESS_CONFIG[process];
  const { dial, agentState, callState } = useSanCti();

  const [period, setPeriod]       = useState('today');
  const [status, setStatus]       = useState<'all' | 'answered' | 'missed'>('all');
  const [handled, setHandled]     = useState<'all' | 'dispositioned' | 'pending'>('all');
  const [leadFilter, setLead]     = useState<'all' | 'known' | 'unknown'>('all');
  const [search, setSearch]       = useState('');
  const [page, setPage]           = useState(1);
  const [selected, setSelected]   = useState<IncomingCallRow | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [toast, setToast]         = useState<string | null>(null);

  const params: IncomingCallsParams = {
    period,
    status,
    handled,
    lead: leadFilter,
    search: search || undefined,
    page,
    per_page: PER_PAGE,
  };

  // RTK hooks can't be called conditionally, so all three are mounted and the
  // two that don't belong to this process are skipped.
  const dwQuery  = useGetDwIncomingCallsQuery(params,  { skip: process !== 'dw',  refetchOnMountOrArgChange: true });
  const wctQuery = useGetWctIncomingCallsQuery(params, { skip: process !== 'wct', refetchOnMountOrArgChange: true });
  const mmQuery  = useGetMmIncomingCallsQuery(params,  { skip: process !== 'mm',  refetchOnMountOrArgChange: true });
  const { data, isLoading, isFetching, refetch } =
    process === 'dw' ? dwQuery : process === 'wct' ? wctQuery : mmQuery;

  const rows       = data?.data || [];
  const summary    = data?.summary;
  const pagination = data?.pagination || { total: 0, per_page: PER_PAGE, current_page: 1, last_page: 1 };
  const cdr        = data?.cdr;

  const hasFilters = status !== 'all' || handled !== 'all' || leadFilter !== 'all' || search !== '';

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const resetFilters = () => {
    setStatus('all'); setHandled('all'); setLead('all'); setSearch(''); setPage(1);
  };

  const onFilterChange = (fn: () => void) => { fn(); setPage(1); };

  /**
   * Call the number back. Same guard + dial + navigate flow the queue and
   * dashboard use, so the call is logged and dispositioned by SanCti exactly
   * like any other outbound dial — including for a caller with no users row,
   * which /call/initiate accepts with a null user_id.
   */
  const handleCallBack = (row: IncomingCallRow) => {
    const number = row.lead?.mobile || row.caller_number;
    if (!number) { showToast('This call has no number to dial back.'); return; }
    if (agentState !== 'ready') {
      showToast(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel (bottom-left).'
        : 'CTI agent is not ready yet — please wait a moment and try again.');
      return;
    }
    if (callState !== 'idle') { showToast('Finish the current call before dialing another.'); return; }

    const leadType = row.lead?.role || cfg.fallbackLeadType;
    const userId   = row.lead?.user_id || 0;
    const name     = row.lead?.name || 'Unknown Caller';
    const tmid     = row.lead?.tmid || '';

    navigate(cfg.activeCallPath, { state: { userId, name, tmid, mobile: number } });
    dial(number, userId, name, tmid, leadType);
    showToast(`Calling ${name} back…`);
  };

  return (
    <div className="space-y-5 w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)]">

      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          {toast}
        </div>
      )}

      {/* Header */}
      <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200 pb-4">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: cfg.accent }}>
            {cfg.label}
          </p>
          <h2 className="text-xl font-bold text-gray-800 mt-0.5 flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-sky-500">call_received</span>
            Incoming Call History
          </h2>
          <p className="text-[11px] text-gray-400 mt-0.5">
            Every call that rang on your extension — answered, missed, and the leads behind them.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-gray-700 border border-gray-300 bg-white hover:bg-gray-50 rounded-lg transition-colors disabled:opacity-60"
          >
            <span className={`material-symbols-outlined text-[14px] ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
            Refresh
          </button>
          {hasFilters && (
            <button
              onClick={resetFilters}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-rose-600 border border-rose-200 bg-rose-50 hover:bg-rose-100 rounded-lg transition-colors"
            >
              <span className="material-symbols-outlined text-[14px]">filter_list_off</span>
              Clear filters
            </button>
          )}
        </div>
      </section>

      {/* No SAN identity on file → the CDR feed can't be read for this agent,
          so never-answered calls simply do not exist for them. Say so rather
          than letting the screen look empty for no reason. */}
      {cdr && !cdr.agent_name && !cdr.extension && (
        <div className="flex items-start gap-2 bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-3 py-2 text-[11px]">
          <span className="material-symbols-outlined text-[16px]">info</span>
          <span>
            No SAN agent name or extension is saved on your profile, so missed (never-answered)
            calls can't be read from the telephony network. Only calls that reached your screen are listed.
            Add your CTI credentials in Settings to see the full picture.
          </span>
        </div>
      )}

      {/* Period */}
      <div className="flex items-center gap-2 overflow-x-auto pb-0.5">
        <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider shrink-0">Period:</span>
        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
          {PERIODS.map((p) => (
            <button
              key={p.id}
              onClick={() => onFilterChange(() => setPeriod(p.id))}
              className={`px-3.5 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all border-r border-gray-200 last:border-r-0 ${
                period === p.id ? 'text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
              style={period === p.id ? { backgroundColor: cfg.accent } : undefined}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {/* Summary */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2 animate-pulse">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="bg-gray-100 rounded-lg h-20" />)}
        </div>
      ) : summary && (
        <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-6 gap-2">
          <Kpi label="Total Incoming" value={summary.total}
               icon="call_received" tone="bg-sky-50 text-sky-600"
               sub={`${summary.unique_callers} unique callers`} />
          <Kpi label="Answered" value={summary.answered}
               icon="phone_in_talk" tone="bg-emerald-50 text-emerald-600"
               sub={`${summary.answer_rate}% answer rate`} />
          <Kpi label="Missed" value={summary.missed}
               icon="phone_missed" tone="bg-rose-50 text-rose-600"
               sub="never picked up" />
          <Kpi label="Landed on Screen" value={summary.landed}
               icon="desktop_windows" tone="bg-indigo-50 text-indigo-600"
               sub="popped in the CTI" />
          <Kpi label="Feedback Pending" value={summary.pending_feedback}
               icon="pending_actions" tone="bg-amber-50 text-amber-600"
               sub="no disposition filed" />
          <Kpi label="Talk Time" value={summary.talk_time}
               icon="timer" tone="bg-orange-50 text-orange-600"
               sub={`${summary.known_leads} known · ${summary.unknown_callers} unknown`} />
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <span className="material-symbols-outlined absolute left-3 top-2.5 text-gray-400 text-lg">search</span>
          <input
            type="text"
            placeholder="Search name, TM ID, number, remarks..."
            value={search}
            onChange={(e) => onFilterChange(() => setSearch(e.target.value))}
            className="w-full pl-10 pr-4 py-2 text-sm bg-white border border-gray-300 rounded-lg shadow-sm outline-none focus:border-gray-400"
          />
          {search && (
            <button onClick={() => onFilterChange(() => setSearch(''))} className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600">
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          )}
        </div>

        <select
          value={status}
          onChange={(e) => onFilterChange(() => setStatus(e.target.value as any))}
          className={`px-3 py-2 text-sm border rounded-lg shadow-sm font-semibold outline-none ${status !== 'all' ? 'bg-sky-50 border-sky-300 text-sky-700' : 'bg-white border-gray-300 text-gray-700'}`}
        >
          <option value="all">All Calls</option>
          <option value="answered">Answered</option>
          <option value="missed">Missed</option>
        </select>

        <select
          value={handled}
          onChange={(e) => onFilterChange(() => setHandled(e.target.value as any))}
          className={`px-3 py-2 text-sm border rounded-lg shadow-sm font-semibold outline-none ${handled !== 'all' ? 'bg-amber-50 border-amber-300 text-amber-700' : 'bg-white border-gray-300 text-gray-700'}`}
        >
          <option value="all">Any Feedback State</option>
          <option value="dispositioned">Feedback Filed</option>
          <option value="pending">Feedback Pending</option>
        </select>

        <select
          value={leadFilter}
          onChange={(e) => onFilterChange(() => setLead(e.target.value as any))}
          className={`px-3 py-2 text-sm border rounded-lg shadow-sm font-semibold outline-none ${leadFilter !== 'all' ? 'bg-indigo-50 border-indigo-300 text-indigo-700' : 'bg-white border-gray-300 text-gray-700'}`}
        >
          <option value="all">All Callers</option>
          <option value="known">Known Leads</option>
          <option value="unknown">Unknown Numbers</option>
        </select>

        <span className="text-[11px] text-gray-400 font-semibold ml-auto">
          {pagination.total} call{pagination.total !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        {isLoading || isFetching ? (
          <div className="p-16 text-center flex flex-col items-center justify-center gap-2">
            <div className="w-8 h-8 border-4 border-gray-200 rounded-full animate-spin" style={{ borderTopColor: cfg.accent }}></div>
            <p className="text-xs text-gray-400 mt-2">Loading incoming calls…</p>
          </div>
        ) : rows.length > 0 ? (
          <div className="overflow-auto max-h-[calc(100vh-380px)]">
            <table className="w-full border-collapse text-left">
              <thead className="sticky top-0 z-10">
                <tr className="bg-gray-50 border-b border-gray-200 text-[11px] font-bold text-gray-600 uppercase tracking-wider">
                  <th className="px-4 py-3">Caller</th>
                  <th className="px-4 py-3">{cfg.leadNoun} Details</th>
                  <th className="px-4 py-3">Outcome</th>
                  <th className="px-4 py-3">Ring / Talk</th>
                  <th className="px-4 py-3">Feedback</th>
                  <th className="px-4 py-3">When</th>
                  <th className="px-4 py-3">Recording</th>
                  <th className="px-4 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                {rows.map((r) => (
                  <tr key={r.id} className={`hover:bg-gray-50/60 transition-colors ${!r.answered ? 'bg-rose-50/20' : ''}`}>

                    {/* Caller */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2.5">
                        <button
                          onClick={() => handleCallBack(r)}
                          title={`Call ${r.lead?.name || 'this number'} back`}
                          className="shrink-0 w-8 h-8 rounded-full text-white flex items-center justify-center shadow-sm active:scale-95 transition-transform"
                          style={{ backgroundColor: cfg.accent }}
                        >
                          <span className="material-symbols-outlined text-[16px]">call</span>
                        </button>
                        <div className="min-w-0">
                          <div className="font-semibold text-gray-900 truncate flex items-center gap-1.5">
                            {r.lead?.name || <span className="text-gray-400 italic">Unknown Caller</span>}
                            {r.lead?.is_my_lead && (
                              <span className="text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 px-1 py-0.5 rounded">MINE</span>
                            )}
                          </div>
                          <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-gray-400 font-medium">
                            {r.lead?.tmid && <span className="font-mono bg-gray-100 px-1 py-0.5 rounded text-gray-500">{r.lead.tmid}</span>}
                            <span className="font-mono">{maskNumber(r.caller_number)}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Lead details */}
                    <td className="px-4 py-3">
                      {r.lead ? (
                        <div className="space-y-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {r.lead.role && (
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${rolePill(r.lead.role)}`}>
                                {r.lead.role}
                              </span>
                            )}
                            {r.lead.type === 'campaign' && (
                              <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 uppercase">
                                Campaign{r.lead.source ? ` · ${r.lead.source}` : ''}
                              </span>
                            )}
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${r.lead.is_subscribed ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-500 border-gray-200'}`}>
                              {r.lead.current_plan}
                            </span>
                          </div>
                          <div className="text-[11px] text-gray-500">
                            {r.lead.location || '—'}
                          </div>
                          <div className="text-[10px] text-gray-400">
                            {r.lead.total_calls} call{r.lead.total_calls !== 1 ? 's' : ''} on record
                            {r.lead.assigned_name ? ` · owner: ${r.lead.assigned_name}` : ' · unassigned'}
                          </div>
                        </div>
                      ) : (
                        <span className="text-[11px] text-gray-300 italic">Not in the database</span>
                      )}
                    </td>

                    {/* Outcome */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1 items-start">
                        {r.answered ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase tracking-wide">
                            <span className="material-symbols-outlined text-[12px]">call_received</span> Answered
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200 uppercase tracking-wide">
                            <span className="material-symbols-outlined text-[12px]">phone_missed</span> Missed
                          </span>
                        )}
                        {r.landed ? (
                          <span className="text-[9px] text-indigo-600 font-semibold">popped on screen</span>
                        ) : (
                          <span className="text-[9px] text-gray-400">never reached screen</span>
                        )}
                      </div>
                    </td>

                    {/* Ring / talk */}
                    <td className="px-4 py-3 text-xs">
                      <div className="font-mono text-gray-700">{r.talk_display}</div>
                      <div className="text-[10px] text-gray-400">rang {r.ring_display}</div>
                    </td>

                    {/* Feedback */}
                    <td className="px-4 py-3 max-w-[220px]">
                      {r.dispositioned ? (
                        <>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide ${statusPill(r.call_status)}`}>
                            {r.call_status?.replace(/_/g, ' ') || '—'}
                          </span>
                          <div className="text-[11px] font-semibold text-gray-800 mt-1 truncate" title={r.call_feedback || ''}>
                            {r.call_feedback}
                          </div>
                          {r.call_remarks && (
                            <div className="text-[10px] text-gray-400 truncate" title={r.call_remarks}>{r.call_remarks}</div>
                          )}
                        </>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 uppercase tracking-wide">
                          <span className="material-symbols-outlined text-[12px]">pending</span> Pending
                        </span>
                      )}
                      {r.cause_txt && !r.answered && (
                        <div className="text-[10px] text-gray-400 mt-1 truncate" title={r.cause_txt}>{r.cause_txt}</div>
                      )}
                    </td>

                    {/* When */}
                    <td className="px-4 py-3 text-xs">
                      <div className="font-semibold text-gray-700">{r.day_label}</div>
                      <div className="text-[11px] text-gray-400">{r.time_display}</div>
                    </td>

                    {/* Recording */}
                    <td className="px-4 py-3">
                      {r.recording_url ? (
                        playingId === r.id ? (
                          <div className="flex items-center gap-1">
                            <audio src={r.recording_url} autoPlay controls className="h-8 max-w-[150px]" />
                            <button onClick={() => setPlayingId(null)} className="text-gray-400 hover:text-red-500">
                              <span className="material-symbols-outlined text-base">close</span>
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setPlayingId(r.id)}
                            className="inline-flex items-center gap-1 text-xs font-bold"
                            style={{ color: cfg.accent }}
                          >
                            <span className="material-symbols-outlined text-lg">play_circle</span> Listen
                          </button>
                        )
                      ) : (
                        <span className="text-gray-300 italic text-[11px]">—</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right whitespace-nowrap">
                      <div className="flex justify-end gap-1.5">
                        <button
                          onClick={() => setSelected(r)}
                          className="inline-flex items-center gap-1 px-2 py-1.5 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 text-[11px] font-bold rounded-lg"
                          title="Full caller & call detail"
                        >
                          <span className="material-symbols-outlined text-[14px]">info</span> Details
                        </button>
                        <button
                          onClick={() => handleCallBack(r)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 text-white text-[11px] font-bold rounded-lg shadow-sm active:scale-95 transition-transform"
                          style={{ backgroundColor: cfg.accent }}
                        >
                          <span className="material-symbols-outlined text-[14px]">call</span> Call Back
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-16 text-center text-gray-400 flex flex-col items-center justify-center gap-2">
            <span className="material-symbols-outlined text-4xl text-gray-300">phone_disabled</span>
            <p className="text-sm italic">No incoming calls for this period.</p>
            {hasFilters && (
              <button onClick={resetFilters} className="mt-1 text-xs font-bold hover:underline" style={{ color: cfg.accent }}>
                Clear filters to see all calls
              </button>
            )}
          </div>
        )}

        {pagination.last_page > 1 && (
          <div className="p-3 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <button
              disabled={page <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="px-3 py-1.5 border border-gray-300 bg-white text-xs font-bold text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-xs font-semibold text-gray-500">
              Page {pagination.current_page} of {pagination.last_page} ({pagination.total} calls)
            </span>
            <button
              disabled={page >= pagination.last_page}
              onClick={() => setPage((p) => Math.min(pagination.last_page, p + 1))}
              className="px-3 py-1.5 border border-gray-300 bg-white text-xs font-bold text-gray-700 rounded-lg hover:bg-gray-100 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Detail drawer — the complete lead behind the call */}
      {selected && (
        <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
          <div className="absolute inset-0 bg-black/45 backdrop-blur-sm" onClick={() => setSelected(null)} />

          <div className="relative w-full max-w-lg bg-white h-full shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-gray-50 shrink-0">
              <div>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider border ${
                    selected.answered
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}
                >
                  Incoming · {selected.answered ? 'Answered' : 'Missed'}
                </span>
                <h3 className="text-lg font-bold text-gray-800 mt-1">
                  {selected.lead?.name || 'Unknown Caller'}
                </h3>
                <p className="text-[11px] text-gray-400 font-mono">{maskNumber(selected.caller_number)}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-600 flex items-center justify-center"
              >
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5">

              {/* Lead profile */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Caller Profile</h4>
                {selected.lead ? (
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 grid grid-cols-2 gap-4">
                    <Field label="Name" value={selected.lead.name} />
                    <Field label="TM ID" value={selected.lead.tmid} />
                    <Field label="Role" value={selected.lead.role || (selected.lead.type === 'campaign' ? 'Campaign Lead' : '—')} />
                    <Field label="Database ID" value={selected.lead.user_id ?? selected.lead.social_lead_id ?? '—'} />
                    <Field label="Location" value={selected.lead.location} />
                    <Field label="Registered" value={selected.lead.registered_at} />
                    <Field label="Vehicle Type" value={selected.lead.vehicle_type} />
                    <Field label="Experience" value={selected.lead.experience} />
                    <Field label="Subscription" value={selected.lead.current_plan} />
                    <Field label="Assigned To" value={selected.lead.assigned_name || 'Unassigned'} />
                  </div>
                ) : (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-[12px] text-amber-800">
                    This number is not in the database — no {cfg.leadNoun.toLowerCase()} or campaign lead matches it.
                    Calling back from here still logs the call against your name.
                  </div>
                )}
              </div>

              {/* Relationship history */}
              {selected.lead?.type === 'user' && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Call Relationship</h4>
                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 grid grid-cols-2 gap-4">
                    <Field label="Total Calls" value={selected.lead.total_calls} />
                    <Field label="By Me" value={selected.lead.my_calls} />
                    <Field label="Connected" value={selected.lead.connected_calls} />
                    <Field label="Last Call" value={selected.lead.last_call_at} />
                    <Field label="Last Status" value={selected.lead.last_call_status?.replace(/_/g, ' ')} />
                    <Field label="Last Feedback" value={selected.lead.last_feedback} />
                    <Field label="Last Called By" value={selected.lead.last_called_by} />
                  </div>
                </div>
              )}

              {/* This call */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">This Call</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 grid grid-cols-2 gap-4">
                  <Field label="Received At" value={`${selected.date_display}, ${selected.time_display}`} />
                  <Field label="Talk Time" value={selected.talk_display} />
                  <Field label="Ring Duration" value={selected.ring_display} />
                  <Field label="Queue Wait" value={selected.queue_display} />
                  <Field label="Reached Screen" value={selected.landed ? 'Yes — popped in the CTI' : 'No — never landed'} />
                  <Field label="DID / Inbound Line" value={selected.did_number} />
                  <Field label="Hangup Cause" value={selected.cause_txt} />
                  <Field label="Ended By" value={selected.ended_by} />
                  <Field label="SAN Agent" value={selected.san_agent_name} />
                  <Field
                    label="Record Source"
                    value={
                      selected.source === 'both' ? 'SAN CDR + CRM'
                      : selected.source === 'cdr' ? 'SAN CDR only'
                      : 'CRM only'
                    }
                  />
                  {selected.bill_duration && <Field label="Billable Duration" value={selected.bill_duration} />}
                  {selected.wrapup_durn && <Field label="Wrap-up" value={selected.wrapup_durn} />}
                </div>
              </div>

              {/* Disposition */}
              <div className="space-y-2">
                <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Disposition</h4>
                <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 space-y-3">
                  {selected.dispositioned ? (
                    <>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Call Status</label>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase mt-1 ${statusPill(selected.call_status)}`}>
                            {selected.call_status?.replace(/_/g, ' ') || '—'}
                          </span>
                        </div>
                        <Field label="Feedback" value={selected.call_feedback} />
                        <Field label="Sub-Disposition" value={selected.disposition_sub?.replace(/_/g, ' ')} />
                        <Field label="Callback Scheduled" value={selected.callback_at} />
                      </div>
                      <div>
                        <label className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Remarks</label>
                        <p className="text-sm text-gray-700 bg-white border border-gray-200 rounded-lg p-3 mt-1 min-h-[56px] italic">
                          {selected.call_remarks || 'No remarks recorded.'}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="text-[12px] text-amber-700">
                      {selected.landed
                        ? 'This call reached your screen but no feedback was filed. Call the lead back and disposition it.'
                        : 'Nobody picked this call up, so there is no disposition. Call the lead back to close the loop.'}
                    </p>
                  )}
                </div>
              </div>

              {selected.recording_url && (
                <div className="space-y-2">
                  <h4 className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Recording</h4>
                  <audio src={selected.recording_url} controls className="w-full h-9 rounded" />
                </div>
              )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-2 shrink-0">
              <button
                onClick={() => setSelected(null)}
                className="px-4 py-2 border border-gray-300 text-xs font-bold text-gray-700 bg-white rounded-lg hover:bg-gray-100"
              >
                Close
              </button>
              <button
                onClick={() => { const row = selected; setSelected(null); handleCallBack(row); }}
                className="px-4 py-2 text-white text-xs font-bold rounded-lg shadow-sm flex items-center gap-1.5"
                style={{ backgroundColor: cfg.accent }}
              >
                <span className="material-symbols-outlined text-[15px]">call</span>
                Call Back
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IncomingCallHistory;
