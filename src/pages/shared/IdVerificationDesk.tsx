import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  useGetIdvQueueQuery,
  useGetIdvDossierQuery,
  useGetIdvDispositionOptionsQuery,
  useGetIdvAgentStatsQuery,
  useSubmitIdvFeedbackMutation,
  type IdvCheck,
  type IdvQueueRow,
  type IdvAgentStatRow,
} from '../../services/api/webCrmApi';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';
import { writePendingIdvContext, clearPendingIdvContext, isIdvCall } from '../../shared/components/cti/idvCallContext';
import DriverDetailsModal from '../matchmaking/DriverDetailsModal';
import TransporterDetailsModal from '../matchmaking/TransporterDetailsModal';

/**
 * ID VERIFICATION DESK — one screen, three roles (DWC / TWC / MM).
 *
 * The job: a subscriber has paid for verification, so which of the checks their
 * plan entitles them to have actually run? Anything "paid for but never used"
 * is the reason to call — the backend flags exactly those as `actionable`.
 *
 * Entitlement is decided server-side from the same rules the real verification
 * endpoints enforce (BEFISC_API), so this screen can never promise a driver a
 * court check their ₹299 plan will refuse to run.
 *
 * Dispositions are written to call_history_ivr with process = 'id_verification'.
 */

const STATE_STYLE: Record<string, { chip: string; icon: string; label: string }> = {
  clean:     { chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'verified',       label: 'Verified' },
  attention: { chip: 'bg-amber-50 text-amber-700 border-amber-200',       icon: 'warning',        label: 'Review' },
  failed:    { chip: 'bg-red-50 text-red-600 border-red-200',             icon: 'cancel',         label: 'Failed' },
  pending:   { chip: 'bg-blue-50 text-blue-600 border-blue-200',          icon: 'hourglass_top',  label: 'In progress' },
  not_done:  { chip: 'bg-gray-100 text-gray-500 border-gray-200',         icon: 'radio_button_unchecked', label: 'Not done' },
};

// Tints rather than solid fills. A queue is scanned, not read one row at a
// time — a wall of saturated navy makes every card shout equally loudly, and
// the selected row then has nothing left to distinguish it.
const PLAN_STYLE: Record<string, string> = {
  trusted:  'bg-indigo-50 text-indigo-700 border-indigo-200',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  job_ready:'bg-amber-50 text-amber-700 border-amber-200',
  standard: 'bg-sky-50 text-sky-700 border-sky-200',
};

const fmtDate = (d?: string | null) =>
  d ? new Date(d.replace(' ', 'T')).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

const fmtDateTime = (d?: string | null) =>
  d ? new Date(d.replace(' ', 'T')).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

const TABS = [
  { id: 'all',       label: 'All Subscribers' },
  { id: 'pending',   label: 'Paid · Not Verified' },
  { id: 'attention', label: 'Needs Review' },
  { id: 'complete',  label: 'Fully Verified' },
];

// ── One verification row in the dossier ──────────────────────────────────────
//
// The card has to answer three questions a telecaller asks in this order:
// is it done, is it theirs to use, and what do I say next. The old layout
// answered only the first, so a "NOT DONE / PAID · NOT USED" pair sat in a
// mostly empty box with nothing to act on.
const CheckRow: React.FC<{ check: IdvCheck }> = ({ check }) => {
  const s = STATE_STYLE[check.state] || STATE_STYLE.not_done;
  const extras = Object.entries(check.extra || {}).filter(([, v]) => v !== null && v !== '' && v !== undefined);

  return (
    <div
      className={`rounded-xl border p-3 flex gap-2.5 ${
        check.actionable
          ? 'border-amber-300 bg-amber-50/60'
          : check.entitled
          ? 'border-gray-200 bg-white'
          : 'border-gray-200 bg-gray-50/60'
      }`}
    >
      {/* The check's own mark, so the grid is scannable without reading labels.
          The tile is the flex container and the glyph is a CHILD of it, never
          the same element: styles/index.css sets
          `.material-symbols-outlined { display: inline-block }`, which has the
          same specificity as Tailwind's `.flex` and is declared after it — so
          putting both on one element silently loses the flex box and drops the
          glyph into the top-left corner. */}
      <div
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
          check.state === 'clean' ? 'bg-emerald-100 text-emerald-700'
            : check.actionable ? 'bg-amber-100 text-amber-700'
            : check.state === 'failed' ? 'bg-red-100 text-red-600'
            : check.state === 'attention' ? 'bg-amber-100 text-amber-700'
            : 'bg-gray-100 text-gray-400'
        }`}
      >
        <span className="material-symbols-outlined text-[18px] leading-none">
          {check.icon || 'verified_user'}
        </span>
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11.5px] font-black text-gray-800">{check.label}</span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase flex items-center gap-0.5 ${s.chip}`}>
              <span className="material-symbols-outlined text-[11px]">{s.icon}</span>
              {s.label}
            </span>
          </div>
          {check.at && <span className="text-[9.5px] text-gray-400 font-mono shrink-0">{fmtDate(check.at)}</span>}
        </div>

        {check.detail && <p className="text-[10.5px] text-gray-600 mt-0.5">{check.detail}</p>}

        {/* The action line. Only where there IS an action. */}
        {check.actionable && check.hint && (
          <p className="mt-1.5 text-[10px] font-semibold text-amber-900 bg-amber-100/70 border border-amber-200 rounded-lg px-2 py-1">
            <span className="material-symbols-outlined text-[11px] align-middle mr-0.5">record_voice_over</span>
            {check.hint}
          </p>
        )}

        {/* Entitlement only when it explains a BLOCK — "included in their plan"
            on nine cards is noise; "needs Trusted" is the upsell. */}
        {!check.entitled && (
          <p className="text-[9.5px] text-gray-500 mt-1">
            <span className="material-symbols-outlined text-[11px] align-middle mr-0.5">lock</span>
            {check.entitlement_note}
          </p>
        )}

        {extras.length > 0 && (
          <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 border-t border-gray-100 pt-1.5">
            {extras.map(([k, v]) => (
              <span key={k} className="text-[9.5px] text-gray-500">
                <span className="uppercase text-gray-400">{k.replace(/_/g, ' ')}: </span>
                <span className="font-semibold text-gray-700">{String(v)}</span>
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ── Queue card ───────────────────────────────────────────────────────────────
const QueueCard: React.FC<{ row: IdvQueueRow; active: boolean; onClick: () => void }> = ({ row, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left p-2.5 border-b border-gray-100 transition-colors tm-pressable ${
      active ? 'bg-indigo-50/70 border-l-4 border-l-indigo-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
    }`}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="font-bold text-gray-900 text-[12px] truncate">{row.name}</span>
      {row.plan && (
        <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded border uppercase shrink-0 ${PLAN_STYLE[row.plan] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
          {row.plan.replace('_', ' ')} ₹{Math.round(row.plan_amount)}
        </span>
      )}
    </div>
    <div className="flex items-center gap-1.5 mt-0.5">
      <span className="font-mono text-[9.5px] text-gray-400 truncate">{row.tmid || '—'}</span>
      {row.location && <span className="text-[9.5px] text-gray-400 truncate">· {row.location}</span>}
    </div>

    <div className="mt-1.5 flex items-center gap-2">
      <div className="flex-1 h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`h-full rounded-full ${row.completion === 100 ? 'bg-emerald-400' : row.completion > 0 ? 'bg-amber-400' : 'bg-gray-200'}`}
          style={{ width: `${Math.max(row.completion, 3)}%` }}
        />
      </div>
      <span className="text-[9.5px] font-bold text-gray-500 shrink-0">
        {row.done_count}/{row.entitled_count}
      </span>
      {row.attention_count > 0 && (
        <span className="text-[9px] font-black px-1 rounded bg-amber-50 text-amber-700 border border-amber-200 shrink-0">
          {row.attention_count}!
        </span>
      )}
    </div>

    {row.last_call && (
      <p className="text-[9px] text-gray-400 mt-1 truncate">
        Last: {row.last_call.feedback || row.last_call.status} · {fmtDate(row.last_call.at)}
      </p>
    )}
  </button>
);

// ── Team Progress ────────────────────────────────────────────────────────────
//
// The manager's read of this desk: who owns how much of the verification book,
// and how much of it they have actually driven to done. Every number is folded
// server-side from the same check registry a dossier uses, so a row here can
// never disagree with the subscriber screens it summarises.

const TeamStat: React.FC<{ label: string; value: React.ReactNode; sub?: string; tone?: string }> = ({ label, value, sub, tone }) => (
  <div className="flex-1 min-w-[104px] rounded-xl border border-gray-200 bg-white px-3 py-2">
    <div className={`text-lg font-black leading-none ${tone || 'text-gray-900'}`}>{value}</div>
    <div className="text-[9.5px] font-bold uppercase tracking-wide text-gray-400 mt-1">{label}</div>
    {sub && <div className="text-[9px] text-gray-400">{sub}</div>}
  </div>
);

// The one bar that says "worked or not" — done ÷ entitled across the book.
const CompletionBar: React.FC<{ pct: number }> = ({ pct }) => (
  <div className="flex items-center gap-2 min-w-[120px]">
    <div className="flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
      <div
        className={`h-full rounded-full ${pct >= 80 ? 'bg-emerald-400' : pct >= 40 ? 'bg-amber-400' : pct > 0 ? 'bg-orange-400' : 'bg-gray-200'}`}
        style={{ width: `${Math.max(pct, 2)}%` }}
      />
    </div>
    <span className="text-[10px] font-black text-gray-600 w-8 text-right">{pct}%</span>
  </div>
);

const TeamProgressPanel: React.FC = () => {
  const [q, setQ] = useState('');
  const { data, isFetching } = useGetIdvAgentStatsQuery(q ? { search: q } : {});
  const rows: IdvAgentStatRow[] = data?.data || [];
  const t = data?.totals;

  return (
    <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
      <div className="p-3 border-b border-gray-200 space-y-3">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-wider text-indigo-700">Team Progress</h2>
            <p className="text-[9.5px] text-gray-400">
              Verification book by telecaller · {t?.agents ?? 0} agent{(t?.agents ?? 0) === 1 ? '' : 's'}
            </p>
          </div>
          <div className="relative w-56">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">search</span>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Find a telecaller…"
              className="w-full pl-7 pr-2 h-8 border border-gray-200 rounded-lg text-[11px] outline-none focus:ring-1 focus:ring-indigo-300"
            />
          </div>
        </div>

        {/* Team totals — the same columns the rows carry, summed. */}
        <div className="flex gap-2 flex-wrap">
          <TeamStat label="Subscribers" value={t?.subscribers ?? 0} tone="text-indigo-700" />
          <TeamStat label="Trusted ₹499" value={t?.trusted_drivers ?? 0} tone="text-indigo-700" />
          <TeamStat label="Verified ₹299" value={t?.verified_drivers ?? 0} tone="text-emerald-700" />
          <TeamStat label="Fully Verified" value={t?.fully_verified ?? 0} tone="text-emerald-700" sub={`of ${t?.subscribers ?? 0}`} />
          <TeamStat label="Completion" value={`${t?.completion ?? 0}%`} tone="text-amber-600" sub={`${t?.done_checks ?? 0}/${t?.entitled_checks ?? 0} checks`} />
          <TeamStat label="Calls Made" value={t?.calls_made ?? 0} sub={`${t?.connected_calls ?? 0} connected`} />
        </div>
      </div>

      <div className="flex-1 overflow-auto custom-scrollbar">
        {isFetching && rows.length === 0 ? (
          <p className="p-6 text-center text-[11px] text-gray-400 italic">Loading team progress…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-center text-[11px] text-gray-400 italic">No telecaller has a verification book yet.</p>
        ) : (
          <table className="w-full border-collapse min-w-[880px]">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {['Telecaller', 'Subscribers', 'Trusted', 'Verified', 'Fully Verified', 'Completion', 'Calls', 'Connected', 'Contacted'].map((h, i) => (
                  <th key={h} className={`py-2 px-3 text-[9.5px] font-black uppercase tracking-wide text-gray-500 border-b border-gray-200 whitespace-nowrap ${i === 0 ? 'text-left' : 'text-center'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.agent_id} className={`border-b border-gray-100 hover:bg-indigo-50/30 ${i % 2 ? 'bg-gray-50/40' : 'bg-white'}`}>
                  <td className="py-2 px-3">
                    <div className="font-bold text-gray-800 text-[11.5px]">{r.agent_name}</div>
                    {r.pending_subscribers > 0 && (
                      <div className="text-[9px] text-amber-600 font-semibold">{r.pending_subscribers} still to verify</div>
                    )}
                  </td>
                  <td className="py-2 px-3 text-center font-black text-gray-800 text-[12px]">{r.subscribers}</td>
                  <td className="py-2 px-3 text-center">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-indigo-50 text-indigo-700 border-indigo-200">{r.trusted_drivers}</span>
                  </td>
                  <td className="py-2 px-3 text-center">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">{r.verified_drivers}</span>
                  </td>
                  <td className="py-2 px-3 text-center text-[11px] font-bold text-emerald-700">
                    {r.fully_verified}
                    <span className="text-gray-300 font-normal">/{r.subscribers}</span>
                  </td>
                  <td className="py-2 px-3"><CompletionBar pct={r.completion} /></td>
                  <td className="py-2 px-3 text-center text-[11px] font-bold text-gray-700">{r.calls_made}</td>
                  <td className="py-2 px-3 text-center text-[11px] text-emerald-700 font-semibold">{r.connected_calls}</td>
                  <td className="py-2 px-3 text-center text-[11px] text-gray-600">{r.contacted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export const IdVerificationDesk: React.FC = () => {
  const {
    dial, callState, agentState,
    showDispositionForm, callDuration, callWasAnswered,
    currentCallId, currentLeadId, submitDisposition,
  } = useSanCti();

  const [view, setView] = useState<'desk' | 'team'>('desk');
  const [tab, setTab] = useState('pending');
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState('');
  const [mine, setMine] = useState(false);
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Disposition modal — opened by the END of a call, not by a button.
  const [dispoOpen, setDispoOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  // The call row to stamp. Captured while the call is still live: the CTI
  // clears currentCallId as soon as the disposition is submitted.
  const liveCallId = useRef<number | null>(null);

  const [callStatus, setCallStatus] = useState('connected');
  const [subDisposition, setSubDisposition] = useState('');
  const [remarks, setRemarks] = useState('');
  const [callbackAt, setCallbackAt] = useState('');

  const { data: queueData, isFetching } = useGetIdvQueueQuery({
    page, per_page: 25, tab, search: search || undefined, plan: plan || undefined, mine,
  });
  const { data: dossierData, isFetching: dossierLoading } = useGetIdvDossierQuery(selected as number, { skip: !selected });
  const { data: options } = useGetIdvDispositionOptionsQuery();
  const [submitFeedback, { isLoading: saving }] = useSubmitIdvFeedbackMutation();

  const rows = queueData?.data || [];
  const pagination = queueData?.pagination;
  const d = dossierData?.data;

  const subOptions = useMemo(
    () => options?.data?.sub_dispositions?.[callStatus] || [],
    [options, callStatus]
  );

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  const callSubscriber = () => {
    if (!d) return;
    if (agentState !== 'ready') {
      flash(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel.'
        : 'CTI agent is not ready yet.');
      return;
    }
    if (callState !== 'idle') { flash('Finish the current call first.'); return; }
    if (!d.user.mobile) { flash('No phone number on record.'); return; }

    // Marks this call as belonging to the verification desk, so the GLOBAL
    // disposition modal steps aside and the form below opens instead.
    writePendingIdvContext({ leadId: d.user.id, name: d.user.name, tmid: d.user.tmid });
    dial(d.user.mobile, d.user.id, d.user.name, d.user.tmid || '', d.user.role as any);
    flash(`Dialing ${d.user.name}…`);
  };

  // The disposition opens when the CALL ENDS. SAN raises showDispositionForm on
  // hangup; the context check keeps another desk's call from opening this form.
  useEffect(() => {
    if (currentCallId) liveCallId.current = currentCallId;
  }, [currentCallId]);

  useEffect(() => {
    if (showDispositionForm && isIdvCall(currentLeadId)) {
      // A call that demonstrably connected cannot be filed as not-connected.
      setCallStatus(callWasAnswered || callDuration > 0 ? 'connected' : '');
      setSubDisposition('');
      setDispoOpen(true);
    }
  }, [showDispositionForm, currentLeadId, callWasAnswered, callDuration]);

  const save = async () => {
    if (!d) return;
    const label = subOptions.find(o => o.value === subDisposition)?.label;
    if (!label) { flash('Pick a sub-disposition first.'); return; }

    // Grab the row id BEFORE SAN wrap-up: submitDisposition resets the call and
    // currentCallId goes null, and without it the second write would insert a
    // duplicate row instead of stamping the one the dial already created.
    const callId = liveCallId.current;

    try {
      // 1. SAN wrap-up, when this disposition belongs to a real call. Also
      //    releases the agent from wrap-up state — skipping it leaves the
      //    softphone stuck and the next dial refused.
      if (dispoOpen) {
        await submitDisposition({
          disposition: callStatus,
          disposition_sub: subDisposition,
          notes: remarks || null,
          callback_at: callbackAt || null,
        });
      }

      // 2. Stamp the row as this desk's: process = id_verification plus the
      //    verification feedback. With call_id it UPDATES the dial's row; with
      //    no live call (a manual log) it inserts one.
      await submitFeedback({
        user_id: d.user.id,
        call_status: callStatus,
        call_feedback: label,
        call_remarks: remarks || undefined,
        disposition_sub: subDisposition,
        call_duration: callDuration || undefined,
        callback_at: callbackAt || undefined,
        ...(callId ? { call_id: callId } : {}),
      }).unwrap();

      flash('Verification call logged.');
      clearPendingIdvContext();
      liveCallId.current = null;
      setDispoOpen(false);
      setSubDisposition(''); setRemarks(''); setCallbackAt('');
    } catch (e: any) {
      flash(e?.data?.message || 'Could not save the disposition.');
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-70px)] gap-2">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* ── View toggle: one caller works the Desk; a lead reads Team Progress. ── */}
      <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 self-start shrink-0">
        {([
          { id: 'desk', label: 'Verification Desk', icon: 'badge' },
          { id: 'team', label: 'Team Progress', icon: 'leaderboard' },
        ] as const).map(v => (
          <button
            key={v.id}
            onClick={() => setView(v.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-colors ${
              view === v.id ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined text-[15px]">{v.icon}</span>
            {v.label}
          </button>
        ))}
      </div>

      {view === 'team' ? (
        <TeamProgressPanel />
      ) : (
      <div className="flex flex-1 min-h-0 gap-3">
      {/* ── Queue ── */}
      <aside className="w-1/3 min-w-[300px] shrink-0 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
        <div className="p-2.5 border-b border-gray-200 space-y-2">
          <div>
            <h2 className="text-[11px] font-black uppercase tracking-wider text-indigo-700">ID Verification Desk</h2>
            <p className="text-[9.5px] text-gray-400">
              Paid subscribers · {pagination?.total ?? 0} on file
            </p>
          </div>

          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">search</span>
            <input
              value={search}
              onChange={e => { setSearch(e.target.value); setPage(1); }}
              placeholder="Name, mobile, TMID…"
              className="w-full pl-7 pr-2 h-8 border border-gray-200 rounded-lg text-[11px] outline-none focus:ring-1 focus:ring-indigo-300"
            />
          </div>

          <div className="flex items-center gap-1.5">
            <select
              value={plan}
              onChange={e => { setPlan(e.target.value); setPage(1); }}
              className="flex-1 h-7 border border-gray-200 rounded-lg text-[10px] px-1 outline-none"
            >
              <option value="">All plans</option>
              <option value="trusted">Trusted ₹499</option>
              <option value="verified">Verified ₹299</option>
              <option value="standard">Standard (transporter)</option>
            </select>
            <label className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 cursor-pointer">
              <input type="checkbox" checked={mine} onChange={e => { setMine(e.target.checked); setPage(1); }} className="accent-indigo-500" />
              Mine
            </label>
          </div>

          <div className="grid grid-cols-2 gap-1">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => { setTab(t.id); setPage(1); }}
                className={`px-1.5 py-1 rounded-md text-[9.5px] font-bold transition-colors ${
                  tab === t.id
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-300'
                    : 'bg-gray-50 text-gray-500 border border-transparent hover:bg-gray-100'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {isFetching && rows.length === 0 ? (
            <p className="p-4 text-center text-[11px] text-gray-400 italic">Loading subscribers…</p>
          ) : rows.length === 0 ? (
            <p className="p-4 text-center text-[11px] text-gray-400 italic">No subscribers in this view.</p>
          ) : (
            rows.map(r => (
              <QueueCard key={r.id} row={r} active={selected === r.id} onClick={() => setSelected(r.id)} />
            ))
          )}
        </div>

        {pagination && pagination.last_page > 1 && (
          <div className="p-2 border-t border-gray-200 flex items-center justify-between text-[10px]">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="px-2 py-1 border border-gray-200 rounded font-bold disabled:opacity-40">Prev</button>
            <span className="text-gray-400">Page {pagination.current_page} / {pagination.last_page}</span>
            <button disabled={page >= pagination.last_page} onClick={() => setPage(p => p + 1)} className="px-2 py-1 border border-gray-200 rounded font-bold disabled:opacity-40">Next</button>
          </div>
        )}
      </aside>

      {/* ── Dossier ── */}
      <section className="flex-1 bg-white border border-gray-200 rounded-xl overflow-y-auto custom-scrollbar">
        {!selected ? (
          <div className="h-full flex flex-col items-center justify-center text-gray-400">
            <span className="material-symbols-outlined text-[42px] mb-1">badge</span>
            <p className="text-xs font-semibold">Pick a subscriber to see what they've paid for</p>
            <p className="text-[10.5px]">and which checks have actually run.</p>
          </div>
        ) : dossierLoading || !d ? (
          <p className="p-6 text-center text-xs text-gray-400 italic">Loading verification record…</p>
        ) : (
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-start justify-between gap-3 border-b border-gray-200 pb-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-lg font-black text-gray-900">{d.user.name}</h2>
                  {/* Full record — everything the users table holds, plus
                      documents, applied jobs and the complete call timeline. */}
                  <button
                    onClick={() => setProfileOpen(true)}
                    title="View full profile"
                    className="w-6 h-6 rounded-lg border border-gray-200 text-gray-500 hover:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 flex items-center justify-center tm-pressable"
                  >
                    <span className="material-symbols-outlined text-[14px]">visibility</span>
                  </button>
                  <span className="font-mono text-[10px] text-gray-400">{d.user.tmid}</span>
                  <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">{d.user.role}</span>
                  {d.plan.best && (
                    <span className={`text-[9.5px] font-black px-2 py-0.5 rounded border uppercase ${PLAN_STYLE[d.plan.best] || 'bg-gray-100'}`}>
                      {d.plan.best.replace('_', ' ')} · ₹{Math.round(d.plan.best_amount)}
                    </span>
                  )}
                  {d.plan.is_top_plan && (
                    <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 uppercase">Top plan</span>
                  )}
                </div>
                <p className="text-[11px] text-gray-500 mt-0.5">
                  {d.user.mobile} {d.user.location ? `· ${d.user.location}` : ''} · registered {fmtDate(d.user.registered_at)}
                </p>
              </div>

              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-indigo-700 leading-none">{d.summary.completion}%</div>
                <p className="text-[9.5px] text-gray-400">{d.summary.done_count}/{d.summary.entitled_count} entitled checks</p>
                <button
                  onClick={callSubscriber}
                  className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1 tm-pressable"
                >
                  <span className="material-symbols-outlined text-[15px]">call</span> Call
                </button>
              </div>
            </div>

            {/* Checks — grouped by what the caller should DO with them.
                Ungrouped, the one card that justifies the call sat between two
                that need nothing, and a telecaller had to read all eight to
                find it. */}
            {(() => {
              const unused    = d.checks.filter(c => c.actionable);
              const review    = d.checks.filter(c => !c.actionable && (c.state === 'attention' || c.state === 'failed'));
              const done      = d.checks.filter(c => !c.actionable && c.state === 'clean');
              const locked    = d.checks.filter(c => !c.entitled && c.state === 'not_done');

              const Group: React.FC<{
                title: string; caption?: string; tone: string; items: IdvCheck[];
              }> = ({ title, caption, tone, items }) => items.length === 0 ? null : (
                <div className="mb-3">
                  <div className="flex items-baseline gap-2 mb-1.5">
                    <h4 className={`text-[10px] font-black uppercase tracking-wider ${tone}`}>{title}</h4>
                    <span className="text-[10px] font-bold text-gray-400">{items.length}</span>
                    {caption && <span className="text-[9.5px] text-gray-400">· {caption}</span>}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {items.map(c => <CheckRow key={c.key} check={c} />)}
                  </div>
                </div>
              );

              return (
                <div>
                  {/* The headline a caller opens on: what this person bought
                      and how much of it is sitting unused. */}
                  <div className="flex items-center justify-between gap-3 mb-2.5 rounded-xl border border-amber-200 bg-amber-50/70 px-3 py-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="material-symbols-outlined text-amber-600 text-[20px]">redeem</span>
                      <div className="min-w-0">
                        <p className="text-[11.5px] font-black text-amber-900 leading-tight">
                          {unused.length > 0
                            ? `${unused.length} paid feature${unused.length > 1 ? 's' : ''} never used`
                            : 'Everything they paid for has been used'}
                        </p>
                        <p className="text-[10px] text-amber-800/80 leading-tight">
                          {d.plan.best
                            ? `${d.plan.best.replace('_', ' ')} plan · ₹${Math.round(d.plan.best_amount)} paid ${fmtDate(d.plan.paid_at)}`
                            : 'No captured plan on file'}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-lg font-black text-amber-900 leading-none">
                        {d.summary.done_count}/{d.summary.entitled_count}
                      </div>
                      <p className="text-[9px] uppercase tracking-wide text-amber-700 font-bold">used</p>
                    </div>
                  </div>

                  <Group
                    title="Paid for — not used yet"
                    caption="the reason for this call"
                    tone="text-amber-700"
                    items={unused}
                  />
                  <Group title="Needs review" caption="came back with a finding" tone="text-red-600" items={review} />
                  <Group title="Completed" tone="text-emerald-700" items={done} />
                  <Group title="Not in their plan" caption="upgrade to unlock" tone="text-gray-400" items={locked} />
                </div>
              );
            })()}

            {/* This desk's call timeline — id_verification only. The
                disposition itself is a MODAL that opens when a call ends, so
                this space shows what was already said instead of a form nobody
                can fill in before dialling. */}
            <div className="border border-gray-200 rounded-xl">
              <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-100">
                <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                  ID Verification call timeline ({d.calls.length})
                </h3>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setDispoOpen(true)}
                    className="text-[10px] font-bold text-gray-500 border border-gray-200 rounded-lg px-2 py-1 hover:bg-gray-50 tm-pressable"
                    title="Log a call made outside the dialer"
                  >
                    Log manually
                  </button>
                  <button
                    onClick={callSubscriber}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-[10.5px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 tm-pressable"
                  >
                    <span className="material-symbols-outlined text-[14px]">call</span> Call
                  </button>
                </div>
              </div>

              <div className="p-3">
                {d.calls.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic text-center py-4">
                    No verification calls logged yet — press Call to start.
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar">
                    {d.calls.map(c => (
                      <div key={c.id} className="border border-gray-100 rounded-lg p-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                            c.call_status === 'connected' ? 'bg-emerald-50 text-emerald-700'
                              : c.call_status === 'callback_later' ? 'bg-amber-50 text-amber-700'
                              : 'bg-red-50 text-red-600'
                          }`}>{(c.call_status || '').replace(/_/g, ' ')}</span>
                          <span className="text-[10.5px] font-bold text-gray-700">{c.feedback}</span>
                          {c.duration_seconds > 0 && (
                            <span className="text-[9px] text-gray-400">{c.duration_seconds}s</span>
                          )}
                          <span className="ml-auto text-[9px] text-gray-400 font-mono">{fmtDateTime(c.called_at)}</span>
                        </div>
                        {c.remarks && <p className="text-[9.5px] text-gray-500 mt-0.5">{c.remarks}</p>}
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[9px] text-gray-400">by {c.called_by || '—'}</span>
                          {c.callback_at && (
                            <span className="text-[9px] text-amber-700">callback {fmtDateTime(c.callback_at)}</span>
                          )}
                          {c.recording_url && <audio src={c.recording_url} controls preload="none" className="h-6 max-w-[160px] ml-auto" />}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Payments */}
            <div className="border border-gray-200 rounded-xl p-3">
              <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-500 mb-2">Payments</h3>
              {d.payments.length === 0 ? (
                <p className="text-[10.5px] text-gray-400 italic">No captured payments.</p>
              ) : d.payments.map((p, i) => (
                <div key={i} className="flex items-center justify-between text-[10.5px] py-1 border-b border-gray-50 last:border-0">
                  <span className="font-bold text-gray-700">{p.plan}</span>
                  <span className="text-gray-500">₹{p.amount.toLocaleString()} · {fmtDate(p.paid_at)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
      </div>
      )}

      {/* ── Post-call disposition. Opens when the CALL ENDS (SAN raises
             showDispositionForm), or manually from the timeline header. ── */}
      {dispoOpen && d && (
        <div className="fixed inset-0 z-[60] bg-black/40 flex items-center justify-center p-4" onClick={() => setDispoOpen(false)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-black text-gray-900">Log this verification call</h3>
                <p className="text-[10.5px] text-gray-500">
                  {d.user.name} · {d.user.tmid}
                  {callDuration > 0 && ` · ${Math.floor(callDuration / 60)}m ${callDuration % 60}s`}
                </p>
              </div>
              <button onClick={() => setDispoOpen(false)} className="text-gray-400 hover:text-gray-700">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>

            <div className="p-4 space-y-3">
              <div className="flex gap-1.5">
                {(options?.data?.call_statuses || [])
                  // A call SAN reported as answered cannot be filed as
                  // not-connected — the row would contradict itself.
                  .filter(st => !(callWasAnswered || callDuration > 0) || st.value !== 'not_connected')
                  .map(st => (
                    <button
                      key={st.value}
                      onClick={() => { setCallStatus(st.value); setSubDisposition(''); }}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${
                        callStatus === st.value
                          ? 'bg-indigo-50 text-indigo-700 border border-indigo-300'
                          : 'bg-gray-50 text-gray-600 border border-transparent hover:bg-gray-100'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-1.5">
                {subOptions.map(o => (
                  <button
                    key={o.value}
                    onClick={() => setSubDisposition(o.value)}
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-left border transition-colors ${
                      subDisposition === o.value
                        ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {o.label}
                    <span className="block font-hindi text-[9px] text-gray-400 font-semibold">{o.label_hi}</span>
                  </button>
                ))}
              </div>

              <div className="flex gap-2">
                <input
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  placeholder="Remarks — what was discussed, what is pending…"
                  className="flex-1 h-9 border border-gray-200 rounded-lg px-2 text-[11px] outline-none focus:ring-1 focus:ring-indigo-300"
                />
                {callStatus === 'callback_later' && (
                  <input
                    type="datetime-local"
                    value={callbackAt}
                    onChange={e => setCallbackAt(e.target.value)}
                    className="h-9 border border-gray-200 rounded-lg px-2 text-[10.5px] outline-none"
                  />
                )}
                <button
                  onClick={save}
                  disabled={saving || !subDisposition || !callStatus}
                  className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-[11px] font-black px-5 rounded-lg tm-pressable"
                >
                  {saving ? 'Saving…' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── Full user record behind the eye icon. Reuses the matchmaking
             profile modals rather than a third copy of the same payload. ── */}
      {profileOpen && d && (
        d.user.role === 'transporter' ? (
          <TransporterDetailsModal
            open={profileOpen}
            transporterId={d.user.id}
            transporterName={d.user.name}
            uniqueId={d.user.tmid || ''}
            onClose={() => setProfileOpen(false)}
          />
        ) : (
          <DriverDetailsModal
            open={profileOpen}
            driverId={d.user.id}
            driverName={d.user.name}
            uniqueId={d.user.tmid || ''}
            onClose={() => setProfileOpen(false)}
          />
        )
      )}
    </div>
  );
};

export default IdVerificationDesk;
