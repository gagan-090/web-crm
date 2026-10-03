import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { baseApi } from '../../services/api/baseApi';
import {
  useGetIdvQueueQuery,
  useGetIdvDossierQuery,
  useGetIdvDispositionOptionsQuery,
  useGetIdvAgentStatsQuery,
  useGetIdvDailyCheckStatsQuery,
  useGetIdvSelfStatsQuery,
  useGetIdvSelfSubscribersQuery,
  useGetIdvSelfCallsQuery,
  useGetIdvVerificationDetailQuery,
  useSaveIdvVerificationMutation,
  useSubmitIdvFeedbackMutation,
  type IdvCheck,
  type IdvCall,
  type IdvQueueRow,
  type IdvAgentStatRow,
  type IdvDailyCheckStatRow,
  type IdvSelfRange,
  type IdvSelfSubscriberRow,
  type IdvSelfCallRow,
  type IdvDeskUser,
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
  clean: { chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'verified', label: 'Verified' },
  attention: { chip: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'warning', label: 'Review' },
  failed: { chip: 'bg-red-50 text-red-600 border-red-200', icon: 'cancel', label: 'Failed' },
  pending: { chip: 'bg-blue-50 text-blue-600 border-blue-200', icon: 'hourglass_top', label: 'In progress' },
  not_done: { chip: 'bg-gray-100 text-gray-500 border-gray-200', icon: 'radio_button_unchecked', label: 'Not done' },
};

// Tints rather than solid fills. A queue is scanned, not read one row at a
// time — a wall of saturated navy makes every card shout equally loudly, and
// the selected row then has nothing left to distinguish it.
const PLAN_STYLE: Record<string, string> = {
  trusted: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  verified: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  job_ready: 'bg-amber-50 text-amber-700 border-amber-200',
  standard: 'bg-sky-50 text-sky-700 border-sky-200',
};

// A minimal, structural target for the shared "open profile" / "redial"
// handlers, satisfied by both a subscriber row and a call-history row.
type IdvCallTarget = { id: number; name: string; tmid: string | null; role: string; mobile?: string | null };

const fmtDate = (d?: string | null) =>
  d ? new Date(d.replace(' ', 'T')).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: '2-digit' }) : '—';

const fmtDateTime = (d?: string | null) =>
  d ? new Date(d.replace(' ', 'T')).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

// First 2 and last 3 digits, dots between — the number stays hidden but the copy
// button lifts the FULL number to the clipboard (agents dial off-app too).
const maskMobile = (m?: string | null): string => {
  if (!m) return '—';
  const d = String(m).replace(/\D/g, '').slice(-10);
  if (d.length < 5) return '••••••';
  return `${d.slice(0, 2)}•••••${d.slice(-3)}`;
};

const MaskedMobile: React.FC<{ mobile?: string | null }> = ({ mobile }) => {
  const [copied, setCopied] = useState(false);
  const copy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!mobile) return;
    try {
      await navigator.clipboard?.writeText(String(mobile).replace(/\s+/g, ''));
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard blocked — nothing to do */
    }
  };
  return (
    <span className="inline-flex items-center gap-1">
      <span className="text-xs font-bold text-gray-800 font-mono">{maskMobile(mobile)}</span>
      {mobile && (
        <button
          type="button"
          onClick={copy}
          title={copied ? 'Copied!' : 'Copy full number'}
          className={`transition-colors ${copied ? 'text-emerald-600' : 'text-gray-300 hover:text-gray-600'}`}
        >
          <span className="material-symbols-outlined text-[12px] align-middle">{copied ? 'check' : 'content_copy'}</span>
        </button>
      )}
    </span>
  );
};

const TABS = [
  { id: 'all', label: 'All Subscribers' },
  { id: 'pending', label: 'Paid · Not Verified' },
  { id: 'attention', label: 'Needs Review' },
  { id: 'complete', label: 'Fully Verified' },
];

// ── One verification row in the dossier ──────────────────────────────────────
//
// The card has to answer three questions a telecaller asks in this order:
// is it done, is it theirs to use, and what do I say next. The old layout
// answered only the first, so a "NOT DONE / PAID · NOT USED" pair sat in a
// mostly empty box with nothing to act on.
// Which dossier checks open a detail panel, and the editor key each maps to
// server-side (IdVerificationController@verificationEditSpec).
const CHECK_EDITOR_KEY: Record<string, string> = {
  dl: 'dl',
  pan: 'pan',
  aadhaar: 'aadhaar',
  court_check: 'court',
  face_match: 'face_match',
  address: 'dav',
};

// Only DAV and Court are the driver-app forms an agent may fill on the driver's
// behalf. DL / PAN / Aadhaar / Face are automated checks — view-only.
const CHECK_FILLABLE = new Set(['court_check', 'address']);

const CheckRow: React.FC<{ check: IdvCheck; onEdit?: (editorKey: string) => void }> = ({ check, onEdit }) => {
  const s = STATE_STYLE[check.state] || STATE_STYLE.not_done;
  const extras = Object.entries(check.extra || {}).filter(([, v]) => v !== null && v !== '' && v !== undefined);
  const editorKey = CHECK_EDITOR_KEY[check.key];
  const fillable = CHECK_FILLABLE.has(check.key);

  return (
    <div
      className={`rounded-xl border p-3 flex gap-2.5 ${check.actionable
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
        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${check.state === 'clean' ? 'bg-emerald-100 text-emerald-700'
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
          <div className="flex items-center gap-1.5 shrink-0">
            {check.at && <span className="text-[9.5px] text-gray-400 font-mono">{fmtDate(check.at)}</span>}
            {editorKey && onEdit && (
              <button
                onClick={() => onEdit(editorKey)}
                title={fillable ? 'Fill this form on the driver’s behalf' : 'View submitted details'}
                className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5 tm-pressable ${fillable ? 'border-indigo-200 text-indigo-600 hover:bg-indigo-50' : 'border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
              >
                <span className="material-symbols-outlined text-[11px]">{fillable ? 'edit_note' : 'visibility'}</span>
                {fillable ? 'Fill' : 'View'}
              </button>
            )}
          </div>
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
    className={`w-full text-left p-2.5 border-b border-gray-100 transition-colors tm-pressable ${active ? 'bg-indigo-50/70 border-l-4 border-l-indigo-500' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
      }`}
  >
    <div className="flex items-center justify-between gap-2">
      <span className="font-bold text-gray-900 text-[12px] truncate">{row.name || 'Subscriber'}</span>
      {row.plan && (
        <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded border uppercase shrink-0 ${PLAN_STYLE[String(row.plan)] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
          {String(row.plan).replace('_', ' ')} {row.plan_amount ? `₹${Math.round(Number(row.plan_amount || 0))}` : ''}
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
          className={`h-full rounded-full ${row.completion === 100 ? 'bg-emerald-400' : (row.completion || 0) > 0 ? 'bg-amber-400' : 'bg-gray-200'}`}
          style={{ width: `${Math.max(row.completion || 0, 3)}%` }}
        />
      </div>
      <span className="text-[9.5px] font-bold text-gray-500 shrink-0">
        {row.done_count || 0}/{row.entitled_count || 0}
      </span>
      {(row.attention_count || 0) > 0 && (
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

// Verified share: fully-verified subscribers ÷ total, as a whole percent.
const pctOf = (n?: number, d?: number): number => (d && d > 0 ? Math.round(((n ?? 0) / d) * 100) : 0);

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
  const [range, setRange] = useState<string>('this_month');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [process, setProcess] = useState<'id_verification' | 'all'>('all');

  const customReady = range !== 'custom' || (!!from && !!to);
  const { data, isFetching } = useGetIdvAgentStatsQuery(
    {
      search: q || undefined,
      range,
      process,
      ...(range === 'custom' ? { from, to } : {}),
    },
    { skip: !customReady }
  );

  const rows: IdvAgentStatRow[] = data?.data || [];
  const t = data?.totals;
  const docs = data?.doc_completion || t?.doc_completion;

  const DOC_LABELS: Record<string, { label: string; icon: string }> = {
    dl: { label: 'Driving Licence', icon: 'badge' },
    aadhaar: { label: 'Aadhaar Card', icon: 'fingerprint' },
    pan: { label: 'PAN Card', icon: 'credit_card' },
    face: { label: 'Face Match', icon: 'face' },
    court: { label: 'Court Record', icon: 'gavel' },
    dav: { label: 'DAV Verification', icon: 'home_pin' },
    rc: { label: 'Vehicle RC', icon: 'local_shipping' },
    challan: { label: 'Challan Screening', icon: 'receipt_long' },
  };

  return (
    <div className="flex-1 min-h-0 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
      <div className="p-4 border-b border-gray-200 space-y-3.5">
        {/* Top Header & Search */}
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-xs font-black uppercase tracking-wider text-indigo-700">Team Performance &amp; Document Audit</h2>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Verification book by telecaller · {t?.agents ?? 0} active telecaller{(t?.agents ?? 0) === 1 ? '' : 's'} · {data?.range?.label || 'This Month'}
            </p>
          </div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative w-52">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">search</span>
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search telecaller…"
                className="w-full pl-7 pr-2 h-8 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-indigo-400"
              />
            </div>
            {/* Process selector */}
            <select
              value={process}
              onChange={e => setProcess(e.target.value as any)}
              className="h-8 border border-gray-200 rounded-lg text-xs px-2.5 bg-white text-gray-700 outline-none font-semibold cursor-pointer"
            >
              <option value="all">Process: All CRM Calls</option>
              <option value="id_verification">Process: ID Verification Only</option>
            </select>
          </div>
        </div>

        {/* Date-range filters */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-gray-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { key: 'today', label: 'Today' },
              { key: 'yesterday', label: 'Yesterday' },
              { key: 'this_week', label: 'This Week' },
              { key: 'this_month', label: 'This Month' },
              { key: 'last_month', label: 'Last Month' },
              { key: 'all', label: 'All Time' },
              { key: 'custom', label: 'Custom' },
            ].map(r => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${range === r.key
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {range === 'custom' && (
            <div className="flex items-center gap-2 text-xs">
              <label className="font-semibold text-gray-600 flex items-center gap-1">
                From:
                <input
                  type="date"
                  value={from}
                  max={to || undefined}
                  onChange={e => setFrom(e.target.value)}
                  className="h-7 border border-gray-200 rounded px-1.5 text-xs outline-none focus:border-indigo-500"
                />
              </label>
              <label className="font-semibold text-gray-600 flex items-center gap-1">
                To:
                <input
                  type="date"
                  value={to}
                  min={from || undefined}
                  onChange={e => setTo(e.target.value)}
                  className="h-7 border border-gray-200 rounded px-1.5 text-xs outline-none focus:border-indigo-500"
                />
              </label>
            </div>
          )}
        </div>

        {/* Real Document Completion Breakdown across Subscribers */}
        {docs && Object.keys(docs).length > 0 && (
          <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-[10.5px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[15px] text-indigo-600">verified</span>
                Live Document Completion Status (All Paid Subscribers)
              </h3>
              <span className="text-[10px] text-slate-500 font-medium">
                {t?.done_checks ?? 0} done of {t?.entitled_checks ?? 0} entitled ({t?.completion ?? 0}%)
              </span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
              {Object.entries(docs).map(([key, item]) => {
                const meta = DOC_LABELS[key] || { label: key.toUpperCase(), icon: 'verified' };
                return (
                  <div key={key} className="bg-white border border-gray-200 rounded-lg p-2 flex flex-col justify-between shadow-2xs">
                    <div className="flex items-center gap-1 text-[10px] font-bold text-gray-700 truncate">
                      <span className="material-symbols-outlined text-[13px] text-indigo-600 shrink-0">{meta.icon}</span>
                      <span className="truncate">{meta.label}</span>
                    </div>
                    <div className="mt-1.5 flex items-baseline justify-between">
                      <span className="text-xs font-black text-gray-900 font-mono">
                        {item.done}
                        <span className="text-[10px] text-gray-400 font-normal">/{item.entitled}</span>
                      </span>
                      <span className="text-[10px] font-black text-emerald-600 font-mono">{item.pct}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden mt-1.5">
                      <div
                        className={`h-full rounded-full ${item.pct >= 80 ? 'bg-emerald-500' : item.pct >= 40 ? 'bg-amber-400' : 'bg-orange-400'}`}
                        style={{ width: `${Math.max(item.pct, item.done > 0 ? 5 : 0)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Team totals cards */}
        <div className="flex gap-2 flex-wrap">
          <TeamStat label="Subscribed Drivers" value={t?.subscriber_drivers ?? 0} tone="text-indigo-700" sub={`${t?.subscribers ?? 0} total subscribers`} />
          <TeamStat label="Subscribed Transporters" value={t?.subscriber_transporters ?? 0} tone="text-sky-700" />
          <TeamStat label="Trusted Drivers ₹499" value={t?.trusted_drivers ?? 0} tone="text-indigo-700" />
          <TeamStat label="Verified Drivers ₹299" value={t?.verified_drivers ?? 0} tone="text-emerald-700" />
          <TeamStat label="Fully Verified" value={t?.fully_verified ?? 0} tone="text-emerald-700" sub={`of ${t?.subscribers ?? 0}`} />
          <TeamStat
            label="Drivers Verified"
            value={`${pctOf(t?.fully_verified_drivers, t?.subscriber_drivers)}%`}
            tone="text-emerald-700"
            sub={`${t?.fully_verified_drivers ?? 0}/${t?.subscriber_drivers ?? 0} drivers`}
          />
          <TeamStat
            label="Transporters Verified"
            value={`${pctOf(t?.fully_verified_transporters, t?.subscriber_transporters)}%`}
            tone="text-sky-700"
            sub={`${t?.fully_verified_transporters ?? 0}/${t?.subscriber_transporters ?? 0} transporters`}
          />
          <TeamStat label="Calls Made" value={t?.calls_made ?? 0} sub={`${t?.connected_calls ?? 0} connected in window`} />
        </div>
      </div>

      {/* Telecaller table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
        {isFetching && rows.length === 0 ? (
          <p className="p-6 text-center text-xs text-gray-400 italic">Loading team progress…</p>
        ) : rows.length === 0 ? (
          <p className="p-6 text-center text-xs text-gray-400 italic">No telecaller activity found in this period.</p>
        ) : (
          <table className="w-full border-collapse min-w-[880px]">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr>
                {['Telecaller', 'Subscribers', 'Trusted', 'Verified', 'Fully Verified', 'Completion', 'Calls Made', 'Connected', 'Contacted'].map((h, i) => (
                  <th key={h} className={`py-2 px-3 text-[9.5px] font-black uppercase tracking-wide text-gray-500 border-b border-gray-200 whitespace-nowrap ${i === 0 ? 'text-left' : 'text-center'}`}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.agent_id} className={`border-b border-gray-100 hover:bg-indigo-50/30 ${i % 2 ? 'bg-gray-50/40' : 'bg-white'}`}>
                  <td className="py-2.5 px-3">
                    <div className="font-bold text-gray-800 text-[11.5px]">{r.agent_name}</div>
                    {r.pending_subscribers > 0 && (
                      <div className="text-[9px] text-amber-600 font-semibold">{r.pending_subscribers} still to verify</div>
                    )}
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <div className="font-black text-gray-800 text-xs">{r.subscribers}</div>
                    <div className="text-[9px] text-gray-400 font-semibold whitespace-nowrap">{r.subscriber_drivers} drv · {r.subscriber_transporters} trp</div>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-indigo-50 text-indigo-700 border-indigo-200">{r.trusted_drivers}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">{r.verified_drivers}</span>
                  </td>
                  <td className="py-2.5 px-3 text-center text-[11px] font-bold text-emerald-700">
                    {r.fully_verified}
                    <span className="text-gray-300 font-normal">/{r.subscribers}</span>
                  </td>
                  <td className="py-2.5 px-3"><CompletionBar pct={r.completion} /></td>
                  <td className="py-2.5 px-3 text-center text-xs font-bold text-gray-800 font-mono">{r.calls_made}</td>
                  <td className="py-2.5 px-3 text-center text-xs text-emerald-700 font-semibold font-mono">{r.connected_calls}</td>
                  <td className="py-2.5 px-3 text-center text-xs text-gray-600 font-mono">{r.contacted}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

// ── Daily Verification Checks Matrix (Date-wise Sheet matching user's spreadsheet) ────
// `agentId`: '' / undefined → the signed-in caller (My Progress); a numeric id →
// that telecaller; 'all' → whole system. Counts are attributed to the agent via
// the subscribers they reached on this desk, so it does not matter whose book
// those subscribers sit in — see IdVerificationController@dailyCheckStats.
const DailyChecksSheetPanel: React.FC<{ agentId?: number | string; agentName?: string }> = ({ agentId, agentName }) => {
  const [range, setRange] = useState<string>('this_month');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [scope, setScope] = useState<'all' | 'paid'>('all');
  // Which attribution the 8 check columns show: everything, only the driver's
  // own self-service checks, or only the checks the agent's call produced.
  const [attr, setAttr] = useState<'all' | 'self' | 'agent'>('all');

  const customReady = range !== 'custom' || (!!from && !!to);
  const { data, isFetching } = useGetIdvDailyCheckStatsQuery(
    {
      range,
      scope,
      ...(agentId !== undefined && agentId !== '' ? { agent_id: agentId } : {}),
      ...(range === 'custom' ? { from, to } : {}),
    },
    { skip: !customReady }
  );

  const rows: IdvDailyCheckStatRow[] = data?.data || [];
  const totals = data?.totals;
  const calls = (data as any)?.calls as { total: number; connected: number; not_connected: number; callback: number } | undefined;
  const who = data?.agent_scoped ? (data?.agent_name || agentName || 'this telecaller') : 'all telecallers';

  // The 8 verification checks, in sheet order, with their per-check colours.
  const CHECKS: {
    key: 'dl' | 'pan' | 'aadhaar' | 'face' | 'court' | 'dav' | 'rc' | 'challan';
    label: string;
    text: string;
    bg: string;
    totalText: string;
  }[] = [
      { key: 'dl', label: 'DL Check', text: 'text-indigo-700', bg: 'bg-indigo-50/30', totalText: 'text-indigo-900' },
      { key: 'pan', label: 'PAN Check', text: 'text-sky-700', bg: 'bg-sky-50/30', totalText: 'text-sky-900' },
      { key: 'aadhaar', label: 'Aadhaar Check', text: 'text-amber-700', bg: 'bg-amber-50/30', totalText: 'text-amber-900' },
      { key: 'face', label: 'Face check', text: 'text-rose-700', bg: 'bg-rose-50/30', totalText: 'text-rose-900' },
      { key: 'court', label: 'Court check', text: 'text-purple-700', bg: 'bg-purple-50/30', totalText: 'text-purple-900' },
      { key: 'dav', label: 'DAV check', text: 'text-emerald-700', bg: 'bg-emerald-50/30', totalText: 'text-emerald-900' },
      { key: 'rc', label: 'RC Check', text: 'text-blue-700', bg: 'bg-blue-50/30', totalText: 'text-blue-900' },
      { key: 'challan', label: 'Challan Check', text: 'text-orange-700', bg: 'bg-orange-50/30', totalText: 'text-orange-900' },
    ];

  // Value pickers honour the current attribution toggle: 'all' → combined
  // column, 'self'/'agent' → that bucket only.
  const cellVal = (r: IdvDailyCheckStatRow, key: typeof CHECKS[number]['key']) =>
    attr === 'self' ? r.self[key] : attr === 'agent' ? r.agent[key] : (r as any)[`${key}_check`] as number;
  const rowTotal = (r: IdvDailyCheckStatRow) =>
    attr === 'self' ? r.self.total : attr === 'agent' ? r.agent.total : r.total;
  const totalVal = (key: typeof CHECKS[number]['key']) =>
    !totals ? 0 : attr === 'self' ? totals.self[key] : attr === 'agent' ? totals.agent[key] : (totals as any)[key] as number;
  const grandTotal = () =>
    !totals ? 0 : attr === 'self' ? totals.self.total : attr === 'agent' ? totals.agent.total : totals.total;

  // The Self / By-Agent breakdown columns only make sense in the combined view;
  // in a single-bucket view the 8 columns already are that bucket.
  const showSplit = attr === 'all';

  const exportCsv = () => {
    if (!rows || rows.length === 0) return;
    const headers = ['Date', 'Day', ...CHECKS.map(c => c.label), 'Self Total', 'By-Agent Total', 'Total'];
    const csvRows = [headers.join(',')];
    rows.forEach(r => {
      csvRows.push([
        r.formatted_date || r.date,
        r.day_name,
        ...CHECKS.map(c => cellVal(r, c.key)),
        r.self.total,
        r.agent.total,
        rowTotal(r),
      ].join(','));
    });
    if (totals) {
      csvRows.push([
        'GRAND TOTAL',
        '—',
        ...CHECKS.map(c => totalVal(c.key)),
        totals.self.total,
        totals.agent.total,
        grandTotal(),
      ].join(','));
    }
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `daily_verification_checks_${data?.from || 'start'}_to_${data?.to || 'end'}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
      {/* ── Toolbar & Excel-style Banner ── */}
      <div className="p-4 border-b border-gray-200 bg-slate-50/60 space-y-3.5">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-700 bg-amber-100 p-1 rounded-md text-[18px]">table_chart</span>
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-900">
                Daily Verification Checks Sheet
              </h2>
            </div>
            <p className="text-[10px] text-gray-500 mt-0.5">
              Day-by-day verification checks for <span className="font-bold text-gray-700">{who}</span> · {data?.from || '—'} to {data?.to || '—'}
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Attribution segmented control — drives which counts the 8 check
                columns show, so an agent's on-call conversion is measurable. */}
            <div className="flex items-center rounded-lg border border-gray-200 bg-white overflow-hidden h-8">
              {([
                { key: 'all', label: 'All', title: 'Every verification (self + by agent)' },
                { key: 'agent', label: 'By Agent', title: 'Completed on/after the agent’s connected call' },
                { key: 'self', label: 'Self', title: 'Driver completed it on their own, before/without a call' },
              ] as const).map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setAttr(opt.key)}
                  title={opt.title}
                  className={`h-full px-2.5 text-xs font-bold transition-colors ${attr === opt.key
                    ? opt.key === 'agent'
                      ? 'bg-violet-600 text-white'
                      : opt.key === 'self'
                        ? 'bg-slate-600 text-white'
                        : 'bg-amber-600 text-white'
                    : 'bg-white text-gray-600 hover:bg-gray-50'
                    } ${opt.key !== 'all' ? 'border-l border-gray-200' : ''}`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <select
              value={scope}
              onChange={e => setScope(e.target.value as any)}
              className="h-8 border border-gray-200 rounded-lg text-xs px-2.5 bg-white text-gray-700 outline-none font-semibold cursor-pointer"
            >
              <option value="all">Scope: All Verifications</option>
              <option value="paid">Scope: Paid Subscribers Only</option>
            </select>

            <button
              onClick={exportCsv}
              disabled={rows.length === 0}
              title="Download sheet as CSV file"
              className="h-8 px-3 rounded-lg text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-300 hover:bg-emerald-100 flex items-center gap-1.5 transition-colors disabled:opacity-40 tm-pressable"
            >
              <span className="material-symbols-outlined text-[15px]">download</span>
              Export to CSV
            </button>
          </div>
        </div>

        {/* Date Presets */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-gray-200/70">
          <div className="flex items-center gap-1.5 flex-wrap">
            {[
              { key: 'today', label: 'Today' },
              { key: 'yesterday', label: 'Yesterday' },
              { key: 'this_week', label: 'This Week' },
              { key: 'this_month', label: 'This Month' },
              { key: 'last_month', label: 'Last Month' },
              { key: 'all', label: 'All Time' },
              { key: 'custom', label: 'Custom' },
            ].map(r => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${range === r.key
                  ? 'bg-amber-600 text-white border-amber-600 shadow-xs'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {range === 'custom' && (
            <div className="flex items-center gap-2 text-xs">
              <label className="font-semibold text-gray-600 flex items-center gap-1">
                From:
                <input
                  type="date"
                  value={from}
                  max={to || undefined}
                  onChange={e => setFrom(e.target.value)}
                  className="h-7 border border-gray-200 rounded px-1.5 text-xs outline-none focus:border-amber-500"
                />
              </label>
              <label className="font-semibold text-gray-600 flex items-center gap-1">
                To:
                <input
                  type="date"
                  value={to}
                  min={from || undefined}
                  onChange={e => setTo(e.target.value)}
                  className="h-7 border border-gray-200 rounded px-1.5 text-xs outline-none focus:border-amber-500"
                />
              </label>
            </div>
          )}
        </div>

        {/* ── Verification CALL stats — the desk's dialling effort for this window ── */}
        {calls && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div className="bg-indigo-50 border border-indigo-300 rounded-lg p-2.5 text-center shadow-2xs">
              <div className="text-[9px] font-black uppercase text-indigo-800">Total Calls</div>
              <div className="text-lg font-black text-indigo-900 font-mono mt-0.5">{calls.total}</div>
            </div>
            <div className="bg-emerald-50 border border-emerald-300 rounded-lg p-2.5 text-center shadow-2xs">
              <div className="text-[9px] font-black uppercase text-emerald-800">Connected</div>
              <div className="text-lg font-black text-emerald-900 font-mono mt-0.5">{calls.connected}</div>
            </div>
            <div className="bg-rose-50 border border-rose-300 rounded-lg p-2.5 text-center shadow-2xs">
              <div className="text-[9px] font-black uppercase text-rose-800">Not Connected</div>
              <div className="text-lg font-black text-rose-900 font-mono mt-0.5">{calls.not_connected}</div>
            </div>
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-2.5 text-center shadow-2xs">
              <div className="text-[9px] font-black uppercase text-amber-800">Callbacks</div>
              <div className="text-lg font-black text-amber-900 font-mono mt-0.5">{calls.callback}</div>
            </div>
          </div>
        )}

        {/* Grand Total Highlights */}
        {totals && (
          <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-9 gap-2">
            <div className="bg-white border border-gray-200 rounded-lg p-2 text-center shadow-2xs">
              <div className="text-[9px] font-bold uppercase text-gray-400">DL Check</div>
              <div className="text-sm font-black text-indigo-700 font-mono mt-0.5">{totals.dl}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-2 text-center shadow-2xs">
              <div className="text-[9px] font-bold uppercase text-gray-400">PAN Check</div>
              <div className="text-sm font-black text-sky-700 font-mono mt-0.5">{totals.pan}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-2 text-center shadow-2xs">
              <div className="text-[9px] font-bold uppercase text-gray-400">Aadhaar Check</div>
              <div className="text-sm font-black text-amber-700 font-mono mt-0.5">{totals.aadhaar}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-2 text-center shadow-2xs">
              <div className="text-[9px] font-bold uppercase text-gray-400">Face Check</div>
              <div className="text-sm font-black text-rose-700 font-mono mt-0.5">{totals.face}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-2 text-center shadow-2xs">
              <div className="text-[9px] font-bold uppercase text-gray-400">Court Check</div>
              <div className="text-sm font-black text-purple-700 font-mono mt-0.5">{totals.court}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-2 text-center shadow-2xs">
              <div className="text-[9px] font-bold uppercase text-gray-400">DAV Check</div>
              <div className="text-sm font-black text-emerald-700 font-mono mt-0.5">{totals.dav}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-2 text-center shadow-2xs">
              <div className="text-[9px] font-bold uppercase text-gray-400">RC Check</div>
              <div className="text-sm font-black text-blue-700 font-mono mt-0.5">{totals.rc}</div>
            </div>
            <div className="bg-white border border-gray-200 rounded-lg p-2 text-center shadow-2xs">
              <div className="text-[9px] font-bold uppercase text-gray-400">Challan Check</div>
              <div className="text-sm font-black text-orange-700 font-mono mt-0.5">{totals.challan}</div>
            </div>
            <div className="bg-amber-50 border border-amber-300 rounded-lg p-2 text-center shadow-2xs">
              <div className="text-[9px] font-black uppercase text-amber-800">Total Checks</div>
              <div className="text-sm font-black text-amber-900 font-mono mt-0.5">{totals.total}</div>
            </div>
          </div>
        )}

        {/* ── Self vs By-Agent split — the headline agent-performance numbers ── */}
        {totals && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <div className="bg-violet-50 border border-violet-300 rounded-lg p-2.5 flex items-center justify-between shadow-2xs">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wide text-violet-800 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">support_agent</span>
                  By Agent (on-call)
                </div>
                <div className="text-[9px] text-violet-600/80 mt-0.5">Completed on / after the agent’s connected call</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-violet-900 font-mono leading-none">{totals.agent.total}</div>
                <div className="text-[10px] font-bold text-violet-700 mt-0.5">
                  {totals.total > 0 ? Math.round((totals.agent.total / totals.total) * 100) : 0}% of all checks
                </div>
              </div>
            </div>
            <div className="bg-slate-100 border border-slate-300 rounded-lg p-2.5 flex items-center justify-between shadow-2xs">
              <div>
                <div className="text-[10px] font-black uppercase tracking-wide text-slate-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">person</span>
                  Self (driver)
                </div>
                <div className="text-[9px] text-slate-500 mt-0.5">Driver completed it on their own, before / without a call</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-slate-800 font-mono leading-none">{totals.self.total}</div>
                <div className="text-[10px] font-bold text-slate-600 mt-0.5">
                  {totals.total > 0 ? Math.round((totals.self.total / totals.total) * 100) : 0}% of all checks
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── Verifications done BY CONNECTED CALLERS (on/after a connected call):
               how many of the connected-call effort produced a verification, and
               which checks. Uses the agent (on-call) attribution. ── */}
        {totals && (
          <div className="bg-violet-50 border border-violet-200 rounded-lg p-2.5">
            <div className="text-[10px] font-black uppercase tracking-wide text-violet-800 mb-1.5 flex items-center gap-1 flex-wrap">
              <span className="material-symbols-outlined text-[14px]">verified_user</span>
              Verifications from connected calls
              <span className="ml-1 font-mono text-violet-900 text-xs">{totals.agent.total}</span>
              {totals.total > 0 && (
                <span className="text-[9px] font-bold text-violet-600">· {Math.round((totals.agent.total / totals.total) * 100)}% of all checks</span>
              )}
              {calls && calls.connected > 0 && (
                <span className="text-[9px] text-violet-500">· from {calls.connected} connected call{calls.connected === 1 ? '' : 's'}</span>
              )}
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-8 gap-1.5">
              {CHECKS.map(c => (
                <div key={c.key} className="bg-white border border-violet-100 rounded p-1.5 text-center">
                  <div className="text-[8px] font-bold uppercase text-gray-400 truncate" title={c.label}>{c.label.replace(/ [Cc]heck$/, '')}</div>
                  <div className="text-xs font-black text-violet-800 font-mono mt-0.5">{totals.agent[c.key] ?? 0}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── The Excel Table ── */}
      <div className="overflow-auto custom-scrollbar max-h-[60vh]">
        {isFetching && rows.length === 0 ? (
          <p className="p-8 text-center text-xs text-gray-400 italic">Loading daily verification records…</p>
        ) : rows.length === 0 ? (
          <p className="p-8 text-center text-xs text-gray-400 italic">No verification checks recorded in this date range.</p>
        ) : (
          <table className={`w-full border-collapse ${showSplit ? 'min-w-[1080px]' : 'min-w-[920px]'} text-xs font-sans`}>
            {/* Excel Header: Pale yellow background matching standard Excel highlight */}
            <thead className="sticky top-0 z-10">
              <tr className="bg-[#fff2cc] text-[#7f6000] border-y-2 border-[#d6b656]">
                <th className="py-2.5 px-4 text-left font-black uppercase text-[10.5px] border-r border-[#d6b656] whitespace-nowrap">
                  Date
                </th>
                {CHECKS.map(c => (
                  <th key={c.key} className="py-2.5 px-3 text-center font-black uppercase text-[10.5px] border-r border-[#d6b656] whitespace-nowrap">
                    {c.label}
                  </th>
                ))}
                {showSplit && (
                  <>
                    <th className="py-2.5 px-3 text-center font-black uppercase text-[10.5px] border-r border-[#d6b656] whitespace-nowrap bg-slate-100 text-slate-600">
                      Self
                    </th>
                    <th className="py-2.5 px-3 text-center font-black uppercase text-[10.5px] border-r border-[#d6b656] whitespace-nowrap bg-violet-100 text-violet-700">
                      By Agent
                    </th>
                  </>
                )}
                <th className="py-2.5 px-4 text-center font-black uppercase text-[10.5px] whitespace-nowrap bg-[#ffe599] text-[#7f6000]">
                  Total
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {rows.map((r, i) => {
                const total = rowTotal(r);
                const hasActivity = total > 0;
                return (
                  <tr
                    key={r.date}
                    className={`hover:bg-amber-50/40 transition-colors ${!hasActivity ? 'opacity-60 bg-white' : (i % 2 === 0 ? 'bg-white' : 'bg-slate-50/40')
                      }`}
                  >
                    <td className="py-2 px-4 border-r border-gray-200 font-mono font-semibold text-gray-800 whitespace-nowrap">
                      <span>{r.formatted_date || r.date}</span>
                      <span className="text-[10px] text-gray-400 font-normal ml-1.5 font-sans">({r.day_name})</span>
                    </td>
                    {CHECKS.map(c => {
                      const v = cellVal(r, c.key);
                      return (
                        <td key={c.key} className={`py-2 px-3 text-center border-r border-gray-200 font-mono ${v > 0 ? `font-black ${c.text} ${c.bg}` : 'text-gray-300'}`}>
                          {v}
                        </td>
                      );
                    })}
                    {showSplit && (
                      <>
                        <td className={`py-2 px-3 text-center border-r border-gray-200 font-mono ${r.self.total > 0 ? 'font-black text-slate-700 bg-slate-50' : 'text-gray-300'}`}>
                          {r.self.total}
                        </td>
                        <td className={`py-2 px-3 text-center border-r border-gray-200 font-mono ${r.agent.total > 0 ? 'font-black text-violet-700 bg-violet-50/50' : 'text-gray-300'}`}>
                          {r.agent.total}
                        </td>
                      </>
                    )}
                    <td className={`py-2 px-4 text-center font-mono font-black ${total > 0 ? 'text-gray-900 bg-amber-50/50' : 'text-gray-300'}`}>
                      {total}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            {/* Excel Total Row at bottom */}
            {totals && (
              <tfoot className="sticky bottom-0 z-10">
                <tr className="bg-[#fff2cc] text-gray-900 font-black border-t-2 border-b-2 border-[#d6b656]">
                  <td className="py-2.5 px-4 text-left border-r border-[#d6b656] text-xs uppercase tracking-wide">
                    Grand Total
                  </td>
                  {CHECKS.map(c => (
                    <td key={c.key} className={`py-2.5 px-3 text-center border-r border-[#d6b656] font-mono text-xs ${c.totalText}`}>
                      {totalVal(c.key)}
                    </td>
                  ))}
                  {showSplit && (
                    <>
                      <td className="py-2.5 px-3 text-center border-r border-[#d6b656] font-mono text-xs text-slate-800 bg-slate-100">
                        {totals.self.total}
                      </td>
                      <td className="py-2.5 px-3 text-center border-r border-[#d6b656] font-mono text-xs text-violet-800 bg-violet-100">
                        {totals.agent.total}
                      </td>
                    </>
                  )}
                  <td className="py-2.5 px-4 text-center font-mono text-xs font-black bg-[#ffe599] text-gray-950">
                    {grandTotal()}
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        )}
      </div>
    </div>
  );
};

// ── Helper to format initials and avatar colors ─────────────────────────────
const AVATAR_COLORS = [
  'bg-purple-100 text-purple-700 border-purple-200',
  'bg-indigo-100 text-indigo-700 border-indigo-200',
  'bg-emerald-100 text-emerald-700 border-emerald-200',
  'bg-blue-100 text-blue-700 border-blue-200',
  'bg-amber-100 text-amber-700 border-amber-200',
  'bg-rose-100 text-rose-700 border-rose-200',
];

const getInitials = (name?: string) => {
  if (!name) return 'TM';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getAvatarColor = (name?: string) => {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
};

// ── Standard Verification Checks (Driver & Transporter) ─────────────────────
const VERIFICATION_KEYS = [
  { key: 'dl', label: 'License', icon: 'directions_car' },
  { key: 'pan', label: 'PAN', icon: 'credit_card' },
  { key: 'aadhaar', label: 'Aadhar', icon: 'fingerprint' },
  { key: 'face_match', label: 'FaceCheck', icon: 'face' },
  { key: 'court_check', label: 'CourtCheck', icon: 'gavel' },
  { key: 'address', label: 'DAV', icon: 'home_pin' },
  { key: 'rc', label: 'RC Check', icon: 'local_shipping' },
  { key: 'challan', label: 'Challan', icon: 'receipt_long' },
];

const getCheckStatus = (row: IdvDeskUser, key: string) => {
  const c = row.checks?.find(item => item.key === key);
  if (!c) {
    return { isDone: false, label: 'Pending', at: null, entitled: false };
  }
  const isDone = c.bucket === 'completed' || c.state === 'clean';
  return {
    isDone,
    label: isDone ? (c.at ? fmtDate(c.at) : 'Done') : 'Pending',
    at: c.at,
    entitled: true,
  };
};

// ── One desk row ─────────────────────────────────────────────────────────────
const IdvDeskRow: React.FC<{
  r: IdvDeskUser;
  onSelectUser?: (u: IdvCallTarget) => void;
  onCallUser?: (u: IdvCallTarget) => void;
  expandable?: boolean;
  expanded?: boolean;
  onToggleExpand?: () => void;
}> = ({ r, onSelectUser, onCallUser, expandable, expanded, onToggleExpand }) => {
  const pendingCount = r.checks?.filter(c => c.bucket !== 'completed' && c.state !== 'clean').length ?? Math.max(0, r.entitled - r.completed);
  const isAllClear = pendingCount === 0 || r.completion === 100;

  return (
    <tr className="hover:bg-slate-50/70 transition-colors align-middle">
      {/* 1. SUBSCRIBER DETAILS */}
      <td className="py-3 px-3.5">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full border flex items-center justify-center text-xs font-black shrink-0 ${getAvatarColor(r.name)}`}>
            {getInitials(r.name)}
          </div>
          <div>
            <div
              onClick={() => onSelectUser && onSelectUser(r)}
              className="font-bold text-gray-900 text-xs hover:text-indigo-600 cursor-pointer"
            >
              {r.name}
            </div>
            <div className="text-[10px] text-gray-500 font-mono mt-0.5">
              {r.license_number ? `DL: ${r.license_number}` : (r.rc_number ? `RC: ${r.rc_number}` : (r.tmid ? `ID: ${r.tmid}` : '—'))}
            </div>
            {r.location && (
              <div className="text-[10px] text-gray-400 flex items-center gap-0.5 mt-0.5">
                <span className="material-symbols-outlined text-[11px]">location_on</span>
                {r.location}
              </div>
            )}
          </div>
        </div>
      </td>

      {/* 2. CONTACT */}
      <td className="py-3 px-3.5 whitespace-nowrap">
        <div className="flex items-center gap-2">
          <MaskedMobile mobile={r.mobile} />
          {r.mobile && (
            <button
              onClick={() => onCallUser ? onCallUser(r) : (onSelectUser && onSelectUser(r))}
              title="Call via softphone"
              className="w-6 h-6 rounded-full bg-emerald-100 hover:bg-emerald-200 text-emerald-700 flex items-center justify-center transition-colors tm-pressable"
            >
              <span className="material-symbols-outlined text-[13px]">call</span>
            </button>
          )}
        </div>
        <div className="text-[10px] text-gray-400 mt-1 font-mono">
          {r.last_call_at ? fmtDateTime(r.last_call_at) : 'No calls yet'}
        </div>
      </td>

      {/* 3. PLAN */}
      <td className="py-3 px-3.5 whitespace-nowrap">
        <div className="flex flex-col gap-1">
          <span className={`text-[9.5px] font-black px-2 py-0.5 rounded border uppercase w-fit ${PLAN_STYLE[r.plan || ''] || 'bg-indigo-50 text-indigo-700 border-indigo-200'}`}>
            {(r.plan ? r.plan.toUpperCase() : 'SUBSCRIBER') + (r.plan_amount > 0 ? ` ₹${r.plan_amount}` : '')}
          </span>
          <span className="text-[9px] font-bold text-purple-700 bg-purple-50 border border-purple-200 px-1.5 py-0.5 rounded flex items-center gap-1 w-fit">
            <span className="material-symbols-outlined text-[11px]">description</span>
            {r.role === 'transporter' ? 'Transporter' : 'Driver'}
          </span>
        </div>
      </td>

      {/* 4. OVERALL STATUS */}
      <td className="py-3 px-3.5 whitespace-nowrap">
        <div className="space-y-1">
          <span className={`text-[9.5px] font-black px-2 py-0.5 rounded border uppercase inline-block ${r.completion === 100
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : r.completion > 0
              ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
              : 'bg-gray-100 text-gray-600 border-gray-200'
            }`}>
            {r.completion === 100 ? 'Fully Verified' : r.completion > 0 ? `${r.completed}/${r.entitled} Verified` : 'Pending'}
          </span>
          <div className="flex items-center gap-2">
            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full ${r.completion === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
                style={{ width: `${Math.max(r.completion, r.completion > 0 ? 10 : 0)}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-500 font-medium">
              {r.completion}% Done
            </span>
          </div>
        </div>
      </td>

      {/* 5. VERIFICATION DETAILS */}
      <td className="py-3 px-3.5">
        {(() => {
          const items = VERIFICATION_KEYS.map(chk => ({ chk, st: getCheckStatus(r, chk.key) })).filter(i => i.st.entitled);
          const done = items.filter(i => i.st.isDone);
          const pending = items.filter(i => !i.st.isDone);

          const Badge: React.FC<{ chk: { key: string; label: string }; st: ReturnType<typeof getCheckStatus> }> = ({ chk, st }) => (
            <div
              title={`${chk.label}: ${st.label}`}
              className={`px-2 py-0.5 rounded-md border flex items-center gap-1 text-[9.5px] font-bold ${st.isDone ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50/80 text-amber-700 border-amber-200'
                }`}
            >
              <span className="material-symbols-outlined text-[12px]">{st.isDone ? 'check_circle' : 'schedule'}</span>
              <span>{chk.label}</span>
              {st.isDone && st.at && <span className="text-[8.5px] opacity-75 font-mono">{fmtDate(st.at)}</span>}
            </div>
          );

          return (
            <div className="flex flex-col gap-2 max-w-[360px]">
              <div>
                <div className="text-[8px] font-black uppercase tracking-wider text-emerald-600 mb-1 flex items-center gap-0.5">
                  <span className="material-symbols-outlined text-[10px]">task_alt</span>
                  Verified · {done.length}
                </div>
                {done.length > 0 ? (
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {done.map(i => <Badge key={i.chk.key} chk={i.chk} st={i.st} />)}
                  </div>
                ) : (
                  <span className="text-[9px] text-gray-300 italic">none yet</span>
                )}
              </div>

              {pending.length > 0 && (
                <div className="border-t border-dashed border-gray-200 pt-2">
                  <div className="text-[8px] font-black uppercase tracking-wider text-amber-600 mb-1 flex items-center gap-0.5">
                    <span className="material-symbols-outlined text-[10px]">schedule</span>
                    Pending · {pending.length}
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {pending.map(i => <Badge key={i.chk.key} chk={i.chk} st={i.st} />)}
                  </div>
                </div>
              )}
            </div>
          );
        })()}
      </td>

      {/* 6. PENDING / MISSING */}
      <td className="py-3 px-3.5 whitespace-nowrap">
        {isAllClear ? (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg border bg-emerald-50 text-emerald-700 border-emerald-200 flex items-center gap-1 w-fit">
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            All Clear
          </span>
        ) : (
          <span className="text-[10px] font-bold px-2.5 py-1 rounded-lg border bg-amber-50 text-amber-700 border-amber-200 flex items-center gap-1 w-fit">
            <span className="material-symbols-outlined text-[13px]">warning</span>
            {pendingCount} Pending
          </span>
        )}
      </td>

      {/* 7. COMPLETION & ACTIONS */}
      <td className="py-3 px-3.5 whitespace-nowrap">
        <div className="flex items-center gap-2.5">
          <div className="w-14 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${r.completion === 100 ? 'bg-emerald-500' : 'bg-indigo-600'}`}
              style={{ width: `${Math.max(r.completion, 10)}%` }}
            />
          </div>
          <span className="text-[10.5px] font-bold text-gray-700 w-8">
            {r.completion}%
          </span>
          <button
            onClick={() => (expandable ? onToggleExpand && onToggleExpand() : onSelectUser && onSelectUser(r))}
            title={expandable ? (expanded ? 'Hide call timeline' : 'Show call timeline') : 'View record'}
            className={`w-6 h-6 rounded-md flex items-center justify-center transition-colors ${expandable && expanded ? 'bg-indigo-50 text-indigo-600' : 'hover:bg-gray-100 text-gray-400 hover:text-gray-700'
              }`}
          >
            <span className="material-symbols-outlined text-[16px]">
              {expandable ? (expanded ? 'expand_less' : 'expand_more') : 'more_vert'}
            </span>
          </button>
        </div>
      </td>
    </tr>
  );
};

const SelfSubscriberTable: React.FC<{
  onSelectUser?: (u: IdvCallTarget) => void;
  onCallUser?: (u: IdvCallTarget) => void;
}> = ({ onSelectUser, onCallUser }) => {
  const [search, setSearch] = useState('');
  const [role] = useState('');
  const [status, setStatus] = useState('');
  const [scope, setScope] = useState('reached');   // '' both · mine · reached
  const [planFilter, setPlanFilter] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('all');
  const [process, setProcess] = useState<string>('all');
  const [page, setPage] = useState(1);

  const changeSearch = (v: string) => { setSearch(v); setPage(1); };
  const changeStatus = (v: string) => { setStatus(v); setPage(1); };
  const changeScope = (v: string) => { setScope(v); setPage(1); };
  const changePlan = (v: string) => { setPlanFilter(v); setPage(1); };

  const { data: agentList } = useGetIdvAgentStatsQuery();
  const agents = agentList?.data || [];

  const { data } = useGetIdvSelfSubscribersQuery({
    page, per_page: 20,
    search: search || undefined,
    role: role || undefined,
    status: status || undefined,
    scope: scope || undefined,
    plan: planFilter || undefined,
    agent_id: selectedAgent === 'all' ? 'all' : Number(selectedAgent),
    process: process || undefined,
  });

  const rows: IdvSelfSubscriberRow[] = data?.data || [];
  const totalCount = data?.pagination?.total || 0;
  const pg = data?.pagination || { total: totalCount, per_page: 20, current_page: page, last_page: Math.ceil(totalCount / 20) || 1 };

  return (
    <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-xs">
      {/* ── Table Header Controls ── */}
      <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="flex items-baseline gap-2">
          <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">
            SUBSCRIBERS &amp; REACHED
          </h3>
          <span className="text-[11px] text-gray-400">
            • {totalCount} subscriber{totalCount === 1 ? '' : 's'} on record
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative flex-1 sm:w-56 min-w-[160px]">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">search</span>
            <input
              value={search}
              onChange={e => changeSearch(e.target.value)}
              placeholder="Search subscriber, phone, DL…"
              className="w-full pl-8 pr-3 h-9 border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          {/* Telecaller selector */}
          <select
            value={selectedAgent}
            onChange={e => { setSelectedAgent(e.target.value); setPage(1); }}
            className="h-9 border border-gray-200 rounded-xl text-xs px-2.5 bg-white text-gray-700 outline-none cursor-pointer font-medium"
          >
            <option value="all">Agent: All Telecallers</option>
            {agents.map(a => (
              <option key={a.agent_id} value={a.agent_id}>{a.agent_name}</option>
            ))}
          </select>

          {/* Process selector */}
          <select
            value={process}
            onChange={e => { setProcess(e.target.value); setPage(1); }}
            className="h-9 border border-gray-200 rounded-xl text-xs px-2.5 bg-white text-gray-700 outline-none cursor-pointer font-medium"
          >
            <option value="all">Process: All CRM Calls</option>
            <option value="id_verification">Process: ID Verification Only</option>
          </select>

          <select
            value={scope}
            onChange={e => changeScope(e.target.value)}
            className="h-9 border border-gray-200 rounded-xl text-xs px-3 bg-white text-gray-700 outline-none cursor-pointer"
          >
            <option value="reached">View: Reached</option>
            <option value="mine">View: Assigned Book</option>
            <option value="">View: All</option>
          </select>

          <select
            value={planFilter}
            onChange={e => changePlan(e.target.value)}
            className="h-9 border border-gray-200 rounded-xl text-xs px-3 bg-white text-gray-700 outline-none cursor-pointer"
          >
            <option value="">All Plans</option>
            <option value="trusted">Trusted Plan</option>
            <option value="verified">Verified Plan</option>
            <option value="standard">Standard Plan</option>
          </select>

          <select
            value={status}
            onChange={e => changeStatus(e.target.value)}
            className="h-9 border border-gray-200 rounded-xl text-xs px-3 bg-white text-gray-700 outline-none cursor-pointer"
          >
            <option value="">All Verification Status</option>
            <option value="complete">Fully Verified</option>
            <option value="incomplete">Pending Checks</option>
          </select>
        </div>
      </div>

      {/* ── Table Rows Matching New UI Screenshot ── */}
      <div className="overflow-x-auto custom-scrollbar">
        <table className="w-full border-collapse min-w-[1100px] text-left">
          <thead className="bg-[#f8fafc] sticky top-0 z-10">
            <tr>
              {[
                'DRIVER DETAILS',
                'CONTACT',
                'PLAN',
                'OVERALL STATUS',
                'VERIFICATION DETAILS',
                'PENDING / MISSING',
                'COMPLETION',
              ].map((h) => (
                <th key={h} className="py-3 px-3.5 text-[10px] font-black uppercase tracking-wider text-gray-600 border-b border-gray-200 whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white text-xs">
            {rows.map((r) => (
              <IdvDeskRow key={r.id} r={r} onSelectUser={onSelectUser} onCallUser={onCallUser} />
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {pg && (
        <div className="p-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            Showing {(pg.current_page - 1) * pg.per_page + 1} to {Math.min(pg.current_page * pg.per_page, pg.total)} of {pg.total} users
          </span>
          <div className="flex items-center gap-1">
            <button
              disabled={page <= 1}
              onClick={() => setPage(p => p - 1)}
              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-50"
            >
              &lt;
            </button>
            {Array.from({ length: Math.min(pg.last_page, 5) }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${page === p
                  ? 'bg-[#4338ca] text-white shadow-xs'
                  : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              disabled={page >= pg.last_page}
              onClick={() => setPage(p => p + 1)}
              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-50"
            >
              &gt;
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ── Self Progress ────────────────────────────────────────────────────────────
const SELF_RANGES: Array<{ key: IdvSelfRange; label: string }> = [
  { key: 'today', label: 'Today' },
  { key: 'yesterday', label: 'Yesterday' },
  { key: 'week', label: 'This Week' },
  { key: 'month', label: 'This Month' },
  { key: 'last_month', label: 'Last Month' },
  { key: 'all', label: 'All Time' },
  { key: 'custom', label: 'Custom' },
];

const SelfProgressPanel: React.FC<{
  onSelectUser?: (u: IdvCallTarget) => void;
  onCallUser?: (u: IdvCallTarget) => void;
}> = ({ onSelectUser, onCallUser }) => {
  const [range, setRange] = useState<IdvSelfRange>('today');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<string>('');
  const [process, setProcess] = useState<string>('all');

  const { data: agentList } = useGetIdvAgentStatsQuery();
  const agents = agentList?.data || [];

  const customReady = range !== 'custom' || (!!from && !!to);
  const { data } = useGetIdvSelfStatsQuery(
    {
      range,
      agent_id: selectedAgent ? Number(selectedAgent) : undefined,
      process: process || undefined,
      ...(range === 'custom' ? { from, to } : {}),
    },
    { skip: !customReady }
  );

  const s = data?.data;
  const calls = s?.calls || {
    total: 0, connected: 0, not_connected: 0, other: 0, driver: 0, transporter: 0, contacted: 0, connect_rate: 0,
  };
  const book = s?.book || {
    subscribers: 0, subscriber_drivers: 0, subscriber_transporters: 0, entitled_checks: 0, done_checks: 0, fully_verified: 0, under_progress: 0, completion: 0, check_completion: 0,
  };
  const docs = s?.doc_completion;

  const DOC_LABELS: Record<string, { label: string; icon: string }> = {
    dl: { label: 'Driving Licence', icon: 'badge' },
    aadhaar: { label: 'Aadhaar Card', icon: 'fingerprint' },
    pan: { label: 'PAN Card', icon: 'credit_card' },
    face: { label: 'Face Match', icon: 'face' },
    court: { label: 'Court Record', icon: 'gavel' },
    dav: { label: 'DAV Verification', icon: 'home_pin' },
    rc: { label: 'Vehicle RC', icon: 'local_shipping' },
    challan: { label: 'Challan Screening', icon: 'receipt_long' },
  };

  return (
    <div className="bg-transparent flex flex-col gap-4">
      {/* ── Top Scorecard Header ── */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4.5 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-[13px] font-black uppercase tracking-wider text-indigo-700">Verification Performance</h2>
            <p className="text-[11.5px] text-gray-500 mt-0.5">
              {s?.agent_name ? `${s.agent_name} · ` : ''}verification calls &amp; subscriber book
            </p>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Agent Selector */}
            <select
              value={selectedAgent}
              onChange={e => setSelectedAgent(e.target.value)}
              className="h-8 border border-gray-200 rounded-lg text-xs px-2.5 bg-white text-gray-700 outline-none font-semibold cursor-pointer"
            >
              <option value="">My Scorecard (Signed-in)</option>
              {agents.map(a => (
                <option key={a.agent_id} value={a.agent_id}>{a.agent_name}</option>
              ))}
            </select>

            {/* Process selector */}
            <select
              value={process}
              onChange={e => setProcess(e.target.value)}
              className="h-8 border border-gray-200 rounded-lg text-xs px-2.5 bg-white text-gray-700 outline-none font-semibold cursor-pointer"
            >
              <option value="all">All CRM Calls</option>
              <option value="id_verification">ID Verification Desk Only</option>
            </select>
          </div>
        </div>

        {/* Date-range chips */}
        <div className="flex items-center justify-between gap-3 flex-wrap pt-1 border-t border-gray-100">
          <div className="flex items-center gap-1.5 flex-wrap">
            {SELF_RANGES.map(r => (
              <button
                key={r.key}
                onClick={() => setRange(r.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${range === r.key
                  ? 'bg-[#4338ca] text-white border-[#4338ca] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {r.label}
              </button>
            ))}
          </div>

          {range === 'custom' && (
            <div className="flex items-center gap-3 flex-wrap text-xs">
              <label className="font-semibold text-gray-600 flex items-center gap-1.5">
                From
                <input
                  type="date"
                  value={from}
                  max={to || undefined}
                  onChange={e => setFrom(e.target.value)}
                  className="h-8 border border-gray-200 rounded-lg px-2 text-xs outline-none focus:border-indigo-500"
                />
              </label>
              <label className="font-semibold text-gray-600 flex items-center gap-1.5">
                To
                <input
                  type="date"
                  value={to}
                  min={from || undefined}
                  onChange={e => setTo(e.target.value)}
                  className="h-8 border border-gray-200 rounded-lg px-2 text-xs outline-none focus:border-indigo-500"
                />
              </label>
              {!customReady && <span className="text-xs text-amber-600 font-semibold">Pick both dates</span>}
            </div>
          )}
        </div>

        <div className="space-y-4">
          {/* ── 1. Verification Calls in window ── */}
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-[10.5px] font-black uppercase tracking-wider text-gray-800">Verification Calls</h3>
              <span className="text-[10px] text-gray-400">· {s?.range?.label || 'Today'}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
              <TeamStat label="Total Calls" value={calls?.total ?? 0} tone="text-indigo-700" />
              <TeamStat label="Connected" value={calls?.connected ?? 0} tone="text-emerald-700" sub={`${calls?.connect_rate ?? 0}% connect rate`} />
              <TeamStat label="Not Connected" value={calls?.not_connected ?? 0} tone="text-red-600" />
              <TeamStat label="Driver Calls" value={calls?.driver ?? 0} tone="text-indigo-700" />
              <TeamStat label="Transporter Calls" value={calls?.transporter ?? 0} tone="text-sky-700" />
              <TeamStat label="People Reached" value={calls?.contacted ?? 0} sub="distinct subscribers" />
            </div>
          </div>

          {/* ── 2. Verification Book (Current Snapshot) ── */}
          <div>
            <div className="flex items-baseline gap-2 mb-2">
              <h3 className="text-[10.5px] font-black uppercase tracking-wider text-gray-800">Verification Book</h3>
              <span className="text-[10px] text-gray-400">· current book</span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
              <TeamStat
                label="Subscribers"
                value={book?.subscribers ?? 0}
                tone="text-gray-900"
                sub={`${book?.subscriber_drivers ?? 0} drv · ${book?.subscriber_transporters ?? 0} trp`}
              />
              <TeamStat label="Completed Verification" value={book?.fully_verified ?? 0} tone="text-emerald-700" sub="fully verified" />
              <TeamStat label="Under Progress" value={book?.under_progress ?? 0} tone="text-amber-600" sub="still to finish" />
              <TeamStat
                label="Checks Done"
                value={`${book?.done_checks ?? 0}/${book?.entitled_checks ?? 0}`}
                tone="text-gray-900"
                sub={`${book?.check_completion ?? 0}% of checks`}
              />
            </div>
          </div>

          {/* ── 3. Document Breakdown for this Book ── */}
          {docs && Object.keys(docs).length > 0 && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-3">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[13px] text-indigo-600">checklist</span>
                  Assigned Subscribers Document Status
                </h4>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {Object.entries(docs).map(([key, item]) => {
                  const meta = DOC_LABELS[key] || { label: key.toUpperCase(), icon: 'verified' };
                  return (
                    <div key={key} className="bg-white border border-gray-200 rounded-lg p-2 text-center shadow-2xs">
                      <div className="text-[9.5px] font-bold text-gray-700 truncate">{meta.label}</div>
                      <div className="text-xs font-black text-gray-900 font-mono mt-1">
                        {item.done}<span className="text-[10px] text-gray-400 font-normal">/{item.entitled}</span>
                      </div>
                      <div className="text-[9px] font-bold text-emerald-600 mt-0.5">{item.pct}% done</div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── 4. Completed % Card ── */}
          <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-xs">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-[11px] font-extrabold uppercase tracking-wider text-gray-800">Overall Book Completion</span>
              <span className="text-[11px] text-gray-400">
                {book?.fully_verified ?? 0} of {book?.subscribers ?? 0} subscribers fully verified
              </span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4f46e5] rounded-full transition-all duration-500"
                  style={{ width: `${Math.max(book?.completion ?? 0, 0)}%` }}
                />
              </div>
              <span className="text-xs font-black text-gray-800 min-w-[32px] text-right">
                {book?.completion ?? 0}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Date-wise verification sheet ── the day-by-day count of every check
             this agent got done (DL, PAN, Aadhaar, Face, Court, DAV, RC, Challan),
             attributed by the subscribers they reached on this desk — not by whose
             book those subscribers sit in. Follows the agent selector above. ── */}
      <DailyChecksSheetPanel agentId={selectedAgent} agentName={s?.agent_name} />

      {/* ── Bottom Section: Subscribers Table ── */}
      <SelfSubscriberTable onSelectUser={onSelectUser} onCallUser={onCallUser} />
    </div>
  );
};

// ── Call History ─────────────────────────────────────────────────────────────
//
// The signed-in caller's verification CALL HISTORY. Each row is a person they
// called, rendered through the SAME IdvDeskRow the subscriber table uses — so it
// is pixel-for-pixel identical — carrying that person's verification update
// (plan, per-check badges, pending, completion). The row EXPANDS to reveal the
// full call timeline: every call's status, disposition, remarks, talk time,
// callback and recording. That is the part the subscriber table cannot show.

const fmtDuration = (sec?: number | null) => {
  const s = Math.max(0, Math.round(sec || 0));
  if (s === 0) return '—';
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  return `${m}m ${(s % 60).toString().padStart(2, '0')}s`;
};

const CALL_STATUS_STYLE: Record<string, { chip: string; icon: string; label: string }> = {
  connected: { chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'call_received', label: 'Connected' },
  callback_later: { chip: 'bg-amber-50 text-amber-700 border-amber-200', icon: 'schedule', label: 'Callback' },
  not_connected: { chip: 'bg-red-50 text-red-600 border-red-200', icon: 'call_missed', label: 'Not Connected' },
};

const RECORDING_SOURCE_LABEL: Record<string, string> = { manual: 'Manual', ivr: 'IVR', 'web-ivr': 'SAN' };

// One call on a reached user's expanded timeline — everything left on the
// record for that single call, plus the recording.
const CallTimelineItem: React.FC<{ c: IdvCall }> = ({ c }) => {
  const st = CALL_STATUS_STYLE[c.call_status || ''] || CALL_STATUS_STYLE.not_connected;
  return (
    <div className="border border-gray-200 rounded-lg p-2.5 bg-white">
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className={`text-[9px] font-black px-1.5 py-0.5 rounded border uppercase flex items-center gap-0.5 ${st.chip}`}>
          <span className="material-symbols-outlined text-[11px]">{st.icon}</span>{st.label}
        </span>
        {c.feedback && <span className="text-[10.5px] font-bold text-gray-700">{c.feedback}</span>}
        {c.disposition_sub && <span className="text-[9px] text-gray-400 font-mono">{c.disposition_sub.replace(/_/g, ' ')}</span>}
        <span className="ml-auto text-[9px] text-gray-400 font-mono">{fmtDateTime(c.called_at)}</span>
      </div>
      {c.remarks && <p className="text-[10px] text-gray-600 mt-1">{c.remarks}</p>}
      <div className="flex items-center gap-2.5 mt-1 flex-wrap">
        <span className="text-[9px] text-gray-400 flex items-center gap-0.5">
          <span className="material-symbols-outlined text-[11px]">timer</span>{fmtDuration(c.duration_seconds)} talk
        </span>
        {c.handling_seconds > 0 && (
          <span className="text-[9px] text-gray-300 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[11px]">hourglass_top</span>{fmtDuration(c.handling_seconds)} handling
          </span>
        )}
        <span className="text-[9px] text-gray-400">by {c.called_by || '—'}</span>
        {c.callback_at && (
          <span className="text-[9px] text-amber-700 flex items-center gap-0.5">
            <span className="material-symbols-outlined text-[11px]">event</span>callback {fmtDateTime(c.callback_at)}
          </span>
        )}
        {c.recording_url ? (
          <span className="ml-auto flex items-center gap-1">
            <audio src={c.recording_url} controls preload="none" className="h-6 max-w-[150px]" />
            {c.recording_source && <span className="text-[8px] uppercase font-bold text-gray-400">{RECORDING_SOURCE_LABEL[c.recording_source] || c.recording_source}</span>}
          </span>
        ) : (
          <span className="ml-auto text-[9px] text-gray-300 italic">No recording</span>
        )}
      </div>
    </div>
  );
};

const CallHistoryPanel: React.FC<{
  onSelectUser?: (u: IdvCallTarget) => void;
  onCallUser?: (u: IdvCallTarget) => void;
}> = ({ onSelectUser, onCallUser }) => {
  const [range, setRange] = useState<IdvSelfRange>('today');
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [search, setSearch] = useState('');
  const [outcome, setOutcome] = useState('');
  const [planFilter, setPlanFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  const reset = () => { setPage(1); setExpanded({}); };
  const changeRange = (r: IdvSelfRange) => { setRange(r); reset(); };
  const toggle = (id: number) => setExpanded(e => ({ ...e, [id]: !e[id] }));

  const customReady = range !== 'custom' || (!!from && !!to);
  const { data, isFetching } = useGetIdvSelfCallsQuery(
    {
      page, per_page: 20,
      range,
      ...(range === 'custom' ? { from, to } : {}),
      search: search || undefined,
      outcome: outcome || undefined,
      plan: planFilter || undefined,
      status: statusFilter || undefined,
    },
    { skip: !customReady }
  );

  const rows: IdvSelfCallRow[] = data?.data || [];
  const totals = data?.totals;
  const pg = data?.pagination || { total: 0, per_page: 20, current_page: page, last_page: 1 };

  return (
    <div className="bg-transparent flex flex-col gap-4">
      {/* ── Scorecard header: range chips + the call split ── */}
      <div className="bg-white border border-gray-200/80 rounded-2xl p-4.5 shadow-xs space-y-4">
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div>
            <h2 className="text-[13px] font-black uppercase tracking-wider text-indigo-700">Call History</h2>
            <p className="text-[11.5px] text-gray-500 mt-0.5">
              Everyone you called, with their verification update. Open a row for the full call timeline.
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {SELF_RANGES.map(r => (
              <button
                key={r.key}
                onClick={() => changeRange(r.key)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-bold border transition-all ${range === r.key
                  ? 'bg-[#4338ca] text-white border-[#4338ca] shadow-sm'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {range === 'custom' && (
          <div className="flex items-center gap-3 flex-wrap pt-1 text-xs">
            <label className="font-semibold text-gray-600 flex items-center gap-1.5">
              From
              <input type="date" value={from} max={to || undefined} onChange={e => { setFrom(e.target.value); reset(); }}
                className="h-8 border border-gray-200 rounded-lg px-2 text-xs outline-none focus:border-indigo-500" />
            </label>
            <label className="font-semibold text-gray-600 flex items-center gap-1.5">
              To
              <input type="date" value={to} min={from || undefined} onChange={e => { setTo(e.target.value); reset(); }}
                className="h-8 border border-gray-200 rounded-lg px-2 text-xs outline-none focus:border-indigo-500" />
            </label>
            {!customReady && <span className="text-xs text-amber-600 font-semibold">Pick both dates</span>}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <TeamStat label="Total Calls" value={totals?.total ?? 0} tone="text-indigo-700" sub={data?.range?.label || 'Today'} />
          <TeamStat label="Connected" value={totals?.connected ?? 0} tone="text-emerald-700" sub={`${totals?.connect_rate ?? 0}% connect rate`} />
          <TeamStat label="Not Connected" value={totals?.not_connected ?? 0} tone="text-red-600" />
          <TeamStat label="Callbacks" value={totals?.callback_later ?? 0} tone="text-amber-600" />
          <TeamStat label="People Reached" value={totals?.contacted ?? 0} sub="distinct subscribers" />
        </div>
      </div>

      {/* ── The call history table — IDENTICAL row to the subscriber table,
             scoped to reached users, each row expandable to its call timeline. ── */}
      <div className="border border-gray-200 rounded-2xl bg-white overflow-hidden shadow-xs">
        <div className="p-4 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-baseline gap-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-gray-900">PEOPLE YOU CALLED</h3>
            <span className="text-[11px] text-gray-400">• {pg.total} subscriber{pg.total === 1 ? '' : 's'} reached in this window</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative flex-1 sm:w-64 min-w-[180px]">
              <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">search</span>
              <input
                value={search}
                onChange={e => { setSearch(e.target.value); reset(); }}
                placeholder="Search by name, mobile, license number…"
                className="w-full pl-8 pr-3 h-9 border border-gray-200 rounded-xl text-xs text-gray-800 outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
            <select value={outcome} onChange={e => { setOutcome(e.target.value); reset(); }}
              className="h-9 border border-gray-200 rounded-xl text-xs px-3 bg-white text-gray-700 outline-none cursor-pointer">
              <option value="">All Outcomes</option>
              <option value="connected">Connected</option>
              <option value="not_connected">Not Connected</option>
              <option value="callback_later">Callback</option>
            </select>
            <select value={planFilter} onChange={e => { setPlanFilter(e.target.value); reset(); }}
              className="h-9 border border-gray-200 rounded-xl text-xs px-3 bg-white text-gray-700 outline-none cursor-pointer">
              <option value="">All Plans</option>
              <option value="trusted">Trusted Plan</option>
              <option value="verified">Verified Plan</option>
              <option value="standard">Standard Plan</option>
            </select>
            <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); reset(); }}
              className="h-9 border border-gray-200 rounded-xl text-xs px-3 bg-white text-gray-700 outline-none cursor-pointer">
              <option value="">All Status</option>
              <option value="complete">Driving Licensed</option>
              <option value="incomplete">Pending Checks</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full border-collapse min-w-[1100px] text-left">
            <thead className="bg-[#f8fafc] sticky top-0 z-10">
              <tr>
                {['DRIVER DETAILS', 'CONTACT', 'PLAN', 'OVERALL STATUS', 'VERIFICATION DETAILS', 'PENDING / MISSING', 'COMPLETION'].map(h => (
                  <th key={h} className="py-3 px-3.5 text-[10px] font-black uppercase tracking-wider text-gray-600 border-b border-gray-200 whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white text-xs">
              {isFetching && rows.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-[11px] text-gray-400 italic">Loading call history…</td></tr>
              ) : rows.length === 0 ? (
                <tr><td colSpan={7} className="py-10 text-center text-[11px] text-gray-400 italic">No verification calls in this window.</td></tr>
              ) : rows.map(r => (
                <React.Fragment key={r.id}>
                  <IdvDeskRow
                    r={r}
                    onSelectUser={onSelectUser}
                    onCallUser={onCallUser}
                    expandable
                    expanded={!!expanded[r.id]}
                    onToggleExpand={() => toggle(r.id)}
                  />
                  {expanded[r.id] && (
                    <tr className="bg-slate-50/60">
                      <td colSpan={7} className="px-3.5 pb-3.5 pt-0">
                        <div className="rounded-xl border border-gray-200 bg-white/70 p-3">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <h4 className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                              Call timeline · {r.call_count} call{r.call_count === 1 ? '' : 's'} · {r.connected_count} connected
                            </h4>
                            <button
                              onClick={() => onCallUser && onCallUser({ id: r.id, name: r.name, tmid: r.tmid, role: r.role, mobile: r.mobile })}
                              className="text-[10px] font-black text-white bg-emerald-600 hover:bg-emerald-700 px-2.5 py-1 rounded-lg flex items-center gap-1 tm-pressable"
                            >
                              <span className="material-symbols-outlined text-[13px]">call</span> Call again
                            </button>
                          </div>
                          {r.calls.length === 0 ? (
                            <p className="text-[10.5px] text-gray-400 italic text-center py-2">No calls in this window.</p>
                          ) : (
                            <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scrollbar">
                              {r.calls.map(c => <CallTimelineItem key={c.id} c={c} />)}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* ── Pagination ── */}
        <div className="p-3.5 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
          <span>
            {pg.total === 0
              ? 'No subscribers reached'
              : `Showing ${(pg.current_page - 1) * pg.per_page + 1} to ${Math.min(pg.current_page * pg.per_page, pg.total)} of ${pg.total} subscribers`}
          </span>
          <div className="flex items-center gap-1">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}
              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-50">&lt;</button>
            {Array.from({ length: Math.min(pg.last_page, 5) }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setPage(p)}
                className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-bold ${page === p ? 'bg-[#4338ca] text-white shadow-xs' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}>{p}</button>
            ))}
            <button disabled={page >= pg.last_page} onClick={() => setPage(p => p + 1)}
              className="w-7 h-7 flex items-center justify-center border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40 hover:bg-gray-50">&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ── Verification detail editor ────────────────────────────────────────────────
//
// View what the driver (or a prior agent) filled for one verification, and let
// this agent fill or correct it. Writes straight to the real table
// (dl_verification / pan_verification / DAV / court_verification /
// face_match_verification) via the whitelisted save endpoint, so the dossier's
// check status updates the moment it saves.
// 1/0 columns read badly as bare digits — show what they mean.
const verBoolLabel = (name: string, v: string): string => {
  if (v !== '1' && v !== '0') return v;
  if (/verif/i.test(name)) return v === '1' ? 'Verified' : 'Not verified';
  if (/link/i.test(name)) return v === '1' ? 'Linked' : 'Not linked';
  return v === '1' ? 'Yes' : 'No';
};
const isBoolField = (f: { type: string; options?: string[] }) =>
  f.type === 'select' && !!f.options && f.options.every(o => o === '1' || o === '0');

const VerificationEditModal: React.FC<{ userId: number; editorKey: string; onClose: () => void }> = ({ userId, editorKey, onClose }) => {
  const { data, isFetching } = useGetIdvVerificationDetailQuery({ userId, key: editorKey });
  const [save, { isLoading: saving }] = useSaveIdvVerificationMutation();
  const spec = data?.data;

  const [form, setForm] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (!spec) return;
    const seed: Record<string, string> = {};
    spec.fields.forEach(f => {
      const v = spec.record?.[f.name];
      let s = v === null || v === undefined ? '' : String(v);
      if ((f.type === 'date' || f.type === 'datetime') && s) s = s.slice(0, 10);   // input[type=date] wants YYYY-MM-DD
      seed[f.name] = s;
    });
    setForm(seed);
  }, [spec?.key, spec?.filled, spec?.record]);

  const set = (name: string, v: string) => setForm(p => ({ ...p, [name]: v }));

  const submit = async () => {
    try {
      const res = await save({ userId, key: editorKey, body: form }).unwrap();
      setToast(res.message || 'Saved.');
      setTimeout(onClose, 700);
    } catch (e: any) {
      setToast(e?.data?.message || 'Could not save.');
    }
  };

  return (
    <div className="fixed inset-0 z-[70] bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto custom-scrollbar" onClick={e => e.stopPropagation()}>
        <div className="px-4 py-3 border-b border-gray-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h3 className="text-sm font-black text-gray-900">{spec?.label || 'Verification'}</h3>
            <p className="text-[10.5px] text-gray-500">
              {spec ? (
                !spec.editable
                  ? (spec.filled ? 'Submitted by the driver — view only.' : 'Not submitted yet — view only.')
                  : (spec.filled ? 'On file — edit any field and update.' : 'Fill this form on the driver’s behalf.')
              ) : ''}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700"><span className="material-symbols-outlined">close</span></button>
        </div>

        {isFetching && !spec ? (
          <p className="p-8 text-center text-xs text-gray-400 italic">Loading…</p>
        ) : (
          <div className="p-4 space-y-3">
            {toast && (
              <div className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-lg px-2.5 py-1.5">{toast}</div>
            )}
            {spec && !spec.editable ? (
              // ── VIEW-ONLY (DL / PAN / Aadhaar / Face): read what the driver
              //    submitted. The agent cannot fill, verify or reject these. ──
              !spec.filled ? (
                <p className="text-[11px] text-gray-400 italic text-center py-6">Nothing submitted for this check yet.</p>
              ) : (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5">
                    {spec.fields.map(f => {
                      const raw = form[f.name] ?? '';
                      const val = isBoolField(f) ? (raw === '' ? '' : verBoolLabel(f.name, raw)) : raw;
                      const isUrl = /^https?:\/\//i.test(raw);
                      return (
                        <div key={f.name} className={f.type === 'textarea' ? 'sm:col-span-2' : ''}>
                          <div className="text-[9.5px] font-bold uppercase tracking-wide text-gray-400">{f.label}</div>
                          {isUrl ? (
                            <a href={raw} target="_blank" rel="noreferrer" className="text-[12px] text-indigo-600 font-semibold underline break-all">Open document</a>
                          ) : (
                            <div className="text-[12px] font-semibold text-gray-800 break-words">{val || <span className="text-gray-300 italic font-normal">—</span>}</div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-[10px] text-gray-400 border-t border-gray-100 pt-2">
                    <span className="material-symbols-outlined text-[12px] align-middle mr-0.5">visibility</span>
                    For scanned documents open the full profile (the eye icon on the header).
                  </p>
                </>
              )
            ) : (
              // ── FILLABLE (DAV / Court): the driver-app form. ──
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {spec?.fields.map(f => (
                  <label key={f.name} className={`text-[10px] font-bold text-gray-500 flex flex-col gap-1 ${f.type === 'textarea' ? 'sm:col-span-2' : ''}`}>
                    {f.label}
                    {f.type === 'select' ? (
                      <select value={form[f.name] ?? ''} onChange={e => set(f.name, e.target.value)}
                        className="h-9 border border-gray-200 rounded-lg px-2 text-xs outline-none focus:border-indigo-500 bg-white">
                        <option value="">—</option>
                        {f.options?.map(o => <option key={o} value={o}>{verBoolLabel(f.name, o)}</option>)}
                      </select>
                    ) : f.type === 'textarea' ? (
                      <textarea value={form[f.name] ?? ''} onChange={e => set(f.name, e.target.value)} rows={2}
                        className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs outline-none focus:border-indigo-500 resize-none" />
                    ) : (
                      <input
                        type={f.type === 'date' || f.type === 'datetime' ? 'date' : f.type === 'number' ? 'number' : 'text'}
                        value={form[f.name] ?? ''}
                        onChange={e => set(f.name, e.target.value)}
                        className="h-9 border border-gray-200 rounded-lg px-2 text-xs outline-none focus:border-indigo-500"
                      />
                    )}
                  </label>
                ))}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-1">
              {spec && !spec.editable ? (
                <button onClick={onClose} className="h-9 px-5 rounded-lg bg-gray-900 hover:bg-black text-white text-xs font-black">Close</button>
              ) : (
                <>
                  <button onClick={onClose} className="h-9 px-4 rounded-lg border border-gray-200 text-gray-600 text-xs font-bold hover:bg-gray-50">Cancel</button>
                  <button onClick={submit} disabled={saving} className="h-9 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white text-xs font-black">
                    {saving ? 'Saving…' : (spec?.filled ? 'Update' : 'Save')}
                  </button>
                </>
              )}
            </div>
          </div>
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

  const [view, setView] = useState<'desk' | 'self' | 'team'>('desk');
  const [selfTab, setSelfTab] = useState<'progress' | 'calls'>('progress');
  const [tab, setTab] = useState('pending');
  const [callFilter, setCallFilter] = useState(''); // '' | fresh | called
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState('');
  const [role, setRole] = useState(''); // '' | driver | transporter
  const [mine, setMine] = useState(false);
  const [dateField, setDateField] = useState<'paid' | 'registered'>('paid');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<number | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  // Disposition modal — opened by the END of a call, not by a button.
  const [dispoOpen, setDispoOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  // Which driver verification the agent is viewing / filling, if any.
  const [verEditor, setVerEditor] = useState<{ userId: number; key: string } | null>(null);
  const [modalUser, setModalUser] = useState<{ id: number; name: string; tmid: string; role: string } | null>(null);
  // The call row to stamp. Captured while the call is still live: the CTI
  // clears currentCallId as soon as the disposition is submitted.
  const liveCallId = useRef<number | null>(null);

  const [callStatus, setCallStatus] = useState('connected');
  const [subDisposition, setSubDisposition] = useState('');
  const [remarks, setRemarks] = useState('');
  const [callbackAt, setCallbackAt] = useState('');

  const dispatch = useDispatch();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const { data: queueData, isFetching: queueFetching, refetch: refetchQueue } = useGetIdvQueueQuery({
    page, per_page: 25, tab, search: search || undefined, plan: plan || undefined, role: role || undefined, mine,
    call_state: callFilter || undefined,
    date_field: dateField,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
  });
  const { data: dossierData, isFetching: dossierLoading, refetch: refetchDossier } = useGetIdvDossierQuery(selected as number, { skip: !selected });
  const { data: options } = useGetIdvDispositionOptionsQuery();
  const [submitFeedback, { isLoading: saving }] = useSubmitIdvFeedbackMutation();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      dispatch(baseApi.util.invalidateTags(['IdVerification']));
      await Promise.all([
        refetchQueue ? refetchQueue() : Promise.resolve(),
        selected && refetchDossier ? refetchDossier() : Promise.resolve(),
      ]);
      flash('Data refreshed');
    } catch {
      /* ignore */
    } finally {
      setIsRefreshing(false);
    }
  };

  const rows = queueData?.data || [];
  const pagination = queueData?.pagination;
  const d = dossierData?.data;

  const subOptions = useMemo(
    () => options?.data?.sub_dispositions?.[callStatus] || [],
    [options, callStatus]
  );

  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  // Shared by both Self sub-tabs (progress + call history): open the full record,
  // or redial the same subscriber through the SAN softphone.
  const openUserProfile = (u: IdvCallTarget) => {
    setModalUser({ id: u.id, name: u.name, tmid: u.tmid || '', role: u.role });
    setProfileOpen(true);
  };
  const dialTarget = (u: IdvCallTarget) => {
    if (agentState !== 'ready') {
      flash(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel.'
        : 'CTI agent is not ready yet.');
      return;
    }
    if (callState !== 'idle') { flash('Finish the current call first.'); return; }
    if (!u.mobile) { flash('No phone number on record.'); return; }
    writePendingIdvContext({ leadId: u.id, name: u.name, tmid: u.tmid || '' });
    dial(u.mobile, u.id, u.name, u.tmid || '', u.role as any);
    flash(`Dialing ${u.name}…`);
  };

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
    // "Other" demands a written explanation — the free text is the only record.
    if (subDisposition === 'other' && !remarks.trim()) {
      flash('Remarks are required when the outcome is "Other".');
      return;
    }

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
    <div className={`flex flex-col gap-2 ${view === 'self' ? 'min-h-[calc(100vh-70px)]' : 'h-[calc(100vh-70px)]'}`}>
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* ── View toggle: one caller works the Desk; a lead reads Team Progress. ── */}
      <div className="flex items-center justify-between bg-white border border-gray-200 rounded-xl p-1 shrink-0">
        <div className="flex items-center gap-1">
          {([
            { id: 'desk', label: 'Verification Desk', icon: 'badge' },
            { id: 'self', label: 'Self', icon: 'person' },
            { id: 'team', label: 'Team Progress', icon: 'leaderboard' },
          ] as const).map(v => (
            <button
              key={v.id}
              onClick={() => setView(v.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-colors ${view === v.id ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
            >
              <span className="material-symbols-outlined text-[15px]">{v.icon}</span>
              {v.label}
            </button>
          ))}
        </div>

        {/* Soft in-page Refresh button (does NOT trigger browser reload or disconnect call) */}
        <button
          type="button"
          onClick={handleRefresh}
          disabled={isRefreshing || queueFetching}
          title="Refresh screen data without reloading browser or dropping active call"
          className="flex items-center gap-1.5 px-3 py-1.5 mr-1 rounded-lg text-[11px] font-black text-gray-700 hover:bg-gray-100 border border-gray-200 bg-white transition-all disabled:opacity-50 active:scale-95 shadow-xs cursor-pointer"
        >
          <span className={`material-symbols-outlined text-[16px] text-indigo-600 ${(isRefreshing || queueFetching) ? 'animate-spin' : ''}`}>
            refresh
          </span>
          <span>{isRefreshing || queueFetching ? 'Refreshing…' : 'Refresh'}</span>
        </button>
      </div>

      {view === 'team' ? (
        <TeamProgressPanel />
      ) : view === 'self' ? (
        <div className="flex flex-col gap-2">
          {/* Self sub-nav: the scorecard + book, or the call log. */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-xl p-1 self-start shrink-0">
            {([
              { id: 'progress', label: 'My Progress', icon: 'insights' },
              { id: 'calls', label: 'Call History', icon: 'history' },
            ] as const).map(t => (
              <button
                key={t.id}
                onClick={() => setSelfTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-black transition-colors ${selfTab === t.id ? 'bg-indigo-600 text-white' : 'text-gray-500 hover:bg-gray-100'
                  }`}
              >
                <span className="material-symbols-outlined text-[15px]">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          {selfTab === 'progress' ? (
            <SelfProgressPanel onSelectUser={openUserProfile} onCallUser={dialTarget} />
          ) : (
            <CallHistoryPanel onSelectUser={openUserProfile} onCallUser={dialTarget} />
          )}
        </div>
      ) : (
        <div className="flex flex-1 min-h-0 gap-3">
          {/* ── Queue ── */}
          <aside className="w-1/3 min-w-[300px] shrink-0 bg-white border border-gray-200 rounded-xl flex flex-col overflow-hidden">
            <div className="p-2.5 border-b border-gray-200 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-[11px] font-black uppercase tracking-wider text-indigo-700">ID Verification Desk</h2>
                  <p className="text-[9.5px] text-gray-400">
                    Paid subscribers · {pagination?.total ?? 0} on file
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={isRefreshing || queueFetching}
                  title="Refresh subscriber list"
                  className="p-1 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <span className={`material-symbols-outlined text-[16px] ${(isRefreshing || queueFetching) ? 'animate-spin text-indigo-600' : ''}`}>
                    refresh
                  </span>
                </button>
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
                  value={role}
                  onChange={e => { setRole(e.target.value); setPage(1); }}
                  className="flex-1 h-7 border border-gray-200 rounded-lg text-[10px] px-1 outline-none"
                >
                  <option value="">All roles</option>
                  <option value="driver">Drivers</option>
                  <option value="transporter">Transporters</option>
                </select>
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
                <label className="flex items-center gap-1 text-[10px] font-semibold text-gray-500 cursor-pointer shrink-0">
                  <input type="checkbox" checked={mine} onChange={e => { setMine(e.target.checked); setPage(1); }} className="accent-indigo-500" />
                  Mine
                </label>
              </div>

              {/* Date range — filter the book by subscription (payment) date or
                  registration date. Both bounds optional. */}
              <div className="flex items-center gap-1">
                <select
                  value={dateField}
                  onChange={e => { setDateField(e.target.value as 'paid' | 'registered'); setPage(1); }}
                  className="h-7 border border-gray-200 rounded-lg text-[10px] px-1 outline-none shrink-0"
                  title="Which date to filter by"
                >
                  <option value="paid">Paid date</option>
                  <option value="registered">Reg. date</option>
                </select>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={e => { setDateFrom(e.target.value); setPage(1); }}
                  className="flex-1 min-w-0 h-7 border border-gray-200 rounded-lg text-[10px] px-1 outline-none"
                  title="From"
                />
                <span className="text-[10px] text-gray-400">–</span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={e => { setDateTo(e.target.value); setPage(1); }}
                  className="flex-1 min-w-0 h-7 border border-gray-200 rounded-lg text-[10px] px-1 outline-none"
                  title="To"
                />
                {(dateFrom || dateTo) && (
                  <button
                    onClick={() => { setDateFrom(''); setDateTo(''); setPage(1); }}
                    title="Clear dates"
                    className="h-7 w-7 shrink-0 flex items-center justify-center border border-gray-200 rounded-lg text-gray-400 hover:text-gray-700"
                  >
                    <span className="material-symbols-outlined text-[14px]">close</span>
                  </button>
                )}
              </div>

              {/* Fresh vs Called — Fresh is every subscriber nobody has dialled on
                  this desk yet (a brand-new lead); Called moves here the moment
                  anyone logs a verification call, so the fresh pool never re-serves
                  a lead someone already worked. Orthogonal to the status tabs
                  below, so they combine (e.g. Fresh + Paid · Not Verified). */}
              <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-0.5">
                {([
                  { id: '', label: 'All', icon: 'groups' },
                  { id: 'fresh', label: 'Fresh', icon: 'fiber_new' },
                  { id: 'called', label: 'Called', icon: 'call_made' },
                ] as const).map(cs => (
                  <button
                    key={cs.id || 'all'}
                    onClick={() => { setCallFilter(cs.id); setPage(1); }}
                    className={`flex-1 flex items-center justify-center gap-1 px-1.5 py-1 rounded-md text-[10px] font-bold transition-colors ${callFilter === cs.id
                      ? 'bg-white text-indigo-700 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                  >
                    <span className="material-symbols-outlined text-[13px]">{cs.icon}</span>
                    {cs.label}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 gap-1">
                {TABS.map(t => (
                  <button
                    key={t.id}
                    onClick={() => { setTab(t.id); setPage(1); }}
                    className={`px-1.5 py-1 rounded-md text-[9.5px] font-bold transition-colors ${tab === t.id
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
              {queueFetching && rows.length === 0 ? (
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
            ) : dossierLoading || !d || !d.user ? (
              <p className="p-6 text-center text-xs text-gray-400 italic">Loading verification record…</p>
            ) : (
              <div className="p-4 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between gap-3 border-b border-gray-200 pb-3">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-lg font-black text-gray-900">{d.user?.name || 'Subscriber'}</h2>
                      {/* Full record — everything the users table holds, plus
                      documents, applied jobs and the complete call timeline. */}
                      <button
                        onClick={() => setProfileOpen(true)}
                        title="View full profile"
                        className="w-6 h-6 rounded-lg border border-gray-200 text-gray-500 hover:text-indigo-700 hover:border-indigo-300 hover:bg-indigo-50 flex items-center justify-center tm-pressable"
                      >
                        <span className="material-symbols-outlined text-[14px]">visibility</span>
                      </button>
                      <span className="font-mono text-[10px] text-gray-400">{d.user?.tmid || ''}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-600 uppercase">{d.user?.role || ''}</span>
                      {d.plan?.best && (
                        <span className={`text-[9.5px] font-black px-2 py-0.5 rounded border uppercase ${PLAN_STYLE[String(d.plan.best)] || 'bg-gray-100'}`}>
                          {String(d.plan.best).replace('_', ' ')} · ₹{Math.round(Number(d.plan.best_amount || 0))}
                        </span>
                      )}
                      {d.plan?.is_top_plan && (
                        <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-amber-400 text-amber-950 uppercase">Top plan</span>
                      )}
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">
                      {d.user?.mobile || ''} {d.user?.location ? `· ${d.user.location}` : ''} · registered {fmtDate(d.user?.registered_at)}
                    </p>
                  </div>

                  <div className="text-right shrink-0">
                    <div className={`text-2xl font-black leading-none ${(d.summary?.failed_count || 0) > 0 ? 'text-red-600' : 'text-indigo-700'}`}>{d.summary?.completion || 0}%</div>
                    <p className="text-[9.5px] text-gray-400">{d.summary?.done_count || 0}/{d.summary?.entitled_count || 0} entitled checks</p>
                    <button
                      onClick={callSubscriber}
                      className="mt-2 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-black px-3 py-1.5 rounded-lg flex items-center gap-1 tm-pressable"
                    >
                      <span className="material-symbols-outlined text-[15px]">call</span> Call
                    </button>
                  </div>
                </div>

                {/* Failed-check banner — a failed verification is NOT complete,
                    so the % above is capped below 100 and this says what to do. */}
                {(d.summary?.failed_count || 0) > 0 && (
                  <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 rounded-lg px-3 py-2 text-[11px] font-semibold">
                    <span className="material-symbols-outlined text-[16px] mt-px">error</span>
                    <span>
                      {d.summary?.failed_count} verification{(d.summary?.failed_count || 0) > 1 ? 's' : ''} failed — not complete.
                      Re-run the failed check{(d.summary?.failed_count || 0) > 1 ? 's' : ''} (in “Needs Review” below) and try again.
                    </span>
                  </div>
                )}

                {/* Checks — grouped by what the caller should DO with them. */}
                {(() => {
                  const checksList = d.checks || [];
                  const unused = checksList.filter(c => c?.actionable);
                  const review = checksList.filter(c => !c?.actionable && (c?.state === 'attention' || c?.state === 'failed'));
                  const done = checksList.filter(c => !c?.actionable && c?.state === 'clean');
                  const locked = checksList.filter(c => !c?.entitled && c?.state === 'not_done');

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
                        {items.map(c => (
                          <CheckRow key={c.key} check={c} onEdit={(k) => setVerEditor({ userId: d.user.id, key: k })} />
                        ))}
                      </div>
                    </div>
                  );

                  return (
                    <div>
                      {/* The headline a caller opens on: what this person bought */}
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
                              {d.plan?.best
                                ? `${String(d.plan.best).replace('_', ' ')} plan · ₹${Math.round(Number(d.plan.best_amount || 0))} paid ${fmtDate(d.plan.paid_at)}`
                                : 'No captured plan on file'}
                            </p>
                          </div>
                        </div>
                        <div className="text-right shrink-0">
                          <div className="text-lg font-black text-amber-900 leading-none">
                            {d.summary?.done_count || 0}/{d.summary?.entitled_count || 0}
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

                {/* Call timeline */}
                <div className="border border-gray-200 rounded-xl">
                  <div className="flex items-center justify-between gap-2 px-3 py-2 border-b border-gray-100">
                    <h3 className="text-[10px] font-black uppercase tracking-wider text-gray-500">
                      ID Verification call timeline ({(d.calls || []).length})
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
                    {(d.calls || []).length === 0 ? (
                      <p className="text-[11px] text-gray-400 italic text-center py-4">
                        No verification calls logged yet — press Call to start.
                      </p>
                    ) : (
                      <div className="space-y-1.5 max-h-72 overflow-y-auto custom-scrollbar">
                        {(d.calls || []).map(c => (
                          <div key={c.id} className="border border-gray-100 rounded-lg p-2">
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${c.call_status === 'connected' ? 'bg-emerald-50 text-emerald-700'
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
                  {(d.payments || []).length === 0 ? (
                    <p className="text-[10.5px] text-gray-400 italic">No captured payments.</p>
                  ) : (d.payments || []).map((p, i) => (
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
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-bold transition-colors ${callStatus === st.value
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
                    className={`px-2 py-1.5 rounded-lg text-[10px] font-bold text-left border transition-colors ${subDisposition === o.value
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-700'
                      : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                      }`}
                  >
                    {o.label}
                    <span className="block font-hindi text-[9px] text-gray-400 font-semibold">{o.label_hi}</span>
                  </button>
                ))}
              </div>

              {(() => {
                const remarksRequired = subDisposition === 'other';
                const remarksMissing = remarksRequired && !remarks.trim();
                return (
                  <div className="flex gap-2">
                    <input
                      value={remarks}
                      onChange={e => setRemarks(e.target.value)}
                      placeholder={remarksRequired ? 'Remarks required — explain the "Other" outcome…' : 'Remarks — what was discussed, what is pending…'}
                      className={`flex-1 h-9 border rounded-lg px-2 text-[11px] outline-none focus:ring-1 ${remarksMissing ? 'border-red-400 focus:ring-red-300 bg-red-50/40' : 'border-gray-200 focus:ring-indigo-300'}`}
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
                      disabled={saving || !subDisposition || !callStatus || remarksMissing}
                      title={remarksMissing ? 'Remarks are required for "Other"' : undefined}
                      className="bg-amber-500 hover:bg-amber-600 disabled:opacity-40 text-white text-[11px] font-black px-5 rounded-lg tm-pressable"
                    >
                      {saving ? 'Saving…' : 'Save'}
                    </button>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ── Full user record behind the eye icon or table row click ── */}
      {profileOpen && (modalUser || d) && (
        (modalUser?.role || d?.user.role) === 'transporter' ? (
          <TransporterDetailsModal
            open={profileOpen}
            transporterId={modalUser?.id || d!.user.id}
            transporterName={modalUser?.name || d!.user.name}
            uniqueId={modalUser?.tmid || d!.user.tmid || ''}
            onClose={() => { setProfileOpen(false); setModalUser(null); }}
          />
        ) : (
          <DriverDetailsModal
            open={profileOpen}
            driverId={modalUser?.id || d!.user.id}
            driverName={modalUser?.name || d!.user.name}
            uniqueId={modalUser?.tmid || d!.user.tmid || ''}
            onClose={() => { setProfileOpen(false); setModalUser(null); }}
          />
        )
      )}

      {/* Driver verification detail — view + fill (dl / pan / DAV / court / face). */}
      {verEditor && (
        <VerificationEditModal
          userId={verEditor.userId}
          editorKey={verEditor.key}
          onClose={() => setVerEditor(null)}
        />
      )}
    </div>
  );
};

export default IdVerificationDesk;

