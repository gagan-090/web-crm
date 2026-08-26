import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  useGetDriverBankQuery,
  useGetDriverBankDetailQuery,
  useAddDriverBankMutation,
  useUpdateDriverBankMutation,
  useDeleteDriverBankMutation,
  useLazySearchDriverBankUserQuery,
  useGetMmJobListingsQuery,
} from '../../services/api/webCrmApi';
import type { DriverBankDetailResponse, DriverCallTimelineEntry } from '../../services/api/webCrmApi';
import { useClickToCall } from '../../shared/hooks/useClickToCall';
import { useAuth } from '../../app/providers/AuthProvider';

// ── constants ─────────────────────────────────────────────────────────────────
export const AVAIL_OPTIONS = [
  { value: 'available',      label: 'Available',      cls: 'bg-green-100 text-green-700 border-green-200' },
  { value: 'busy',           label: 'Busy',           cls: 'bg-amber-100 text-amber-700 border-amber-200' },
  { value: 'callback',       label: 'Callback',       cls: 'bg-blue-100 text-blue-700 border-blue-200' },
  { value: 'placed',         label: 'Placed',         cls: 'bg-purple-100 text-purple-700 border-purple-200' },
  { value: 'not_interested', label: 'Not Interested', cls: 'bg-red-100 text-red-600 border-red-200' },
];

const LICENSE_TYPES = [
  { value: 'HMV',  label: 'HMV — Heavy Motor Vehicle' },
  { value: 'LMV',  label: 'LMV — Light Motor Vehicle' },
  { value: 'MCV',  label: 'MCV — Medium Commercial Vehicle' },
  { value: 'HPMV', label: 'HPMV — Heavy Passenger Motor Vehicle' },
  { value: 'HTV',  label: 'HTV — Heavy Transport Vehicle' },
  { value: 'PSV',  label: 'PSV — Public Service Vehicle' },
  { value: 'MCWOG',label: 'MCWG — Motor Cycle Without Gear' },
];

const VEHICLE_TYPES = [
  'Light Commercial Vehicle (LCV)',
  'Medium Commercial Vehicle (MCV)',
  'Heavy Truck',
  'Container 20ft',
  'Container 24ft',
  'Container 32ft',
  'Trailer / Multi-axle',
  'Tanker',
  'Tipper',
  'Refrigerated Vehicle',
  'Flatbed',
  'Taurus 14W',
];

const EXPERIENCE_OPTIONS = [
  { value: 'Fresher (0-1 Yrs)', label: 'Fresher (0–1 Year)' },
  { value: '1-2 Yrs',           label: '1–2 Years' },
  { value: '2-3 Yrs',           label: '2–3 Years' },
  { value: '3-5 Yrs',           label: '3–5 Years' },
  { value: '5-7 Yrs',           label: '5–7 Years' },
  { value: '7-10 Yrs',          label: '7–10 Years' },
  { value: '10+ Yrs',           label: '10+ Years' },
];

const INCOME_OPTIONS = [
  { value: '< ₹15,000',        label: 'Below ₹15,000' },
  { value: '₹15,000–20,000',   label: '₹15,000 – 20,000' },
  { value: '₹20,000–25,000',   label: '₹20,000 – 25,000' },
  { value: '₹25,000–30,000',   label: '₹25,000 – 30,000' },
  { value: '₹30,000–40,000',   label: '₹30,000 – 40,000' },
  { value: '₹40,000+',         label: '₹40,000+' },
];

const availCls = (v: string) => AVAIL_OPTIONS.find(o => o.value === v)?.cls ?? 'bg-gray-100 text-gray-500 border-gray-200';

/**
 * A compact date for the list: "03 Aug, 4:05 pm".
 *
 * MySQL hands back "2026-08-03 16:05:33"; Safari refuses that as a Date
 * argument unless the space is a T, and returns Invalid Date instead.
 */
const stamp = (v?: string | null) => {
  if (!v) return '—';
  const d = new Date(String(v).replace(' ', 'T'));
  return isNaN(d.getTime())
    ? String(v).slice(0, 16)
    : d.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true });
};
const availLbl = (v: string) => AVAIL_OPTIONS.find(o => o.value === v)?.label ?? v;

/** Seconds as "2m 14s" / "48s" — a bare "134" tells the agent nothing. */
const dur = (s?: number | null) => {
  const n = Number(s ?? 0);
  if (!n) return '0s';
  return n >= 60 ? `${Math.floor(n / 60)}m ${n % 60}s` : `${n}s`;
};

/**
 * ── CALL HISTORY ON HOVER ────────────────────────────────────────────────
 *
 * The "Since Banked" badge says HOW MANY calls happened after banking; this
 * says WHAT they were. Without it the number is a dead end — an agent seeing
 * "5 since" still has to open the detail modal to learn whether those five
 * were five voicemails or one real conversation.
 *
 * WHY A HOVER CARD AND NOT A TOOLTIP: `title=""` renders one unstyled line
 * after a browser-controlled delay and cannot show a table. This is the same
 * information the detail modal holds, surfaced where the question is asked.
 *
 * Positioned RIGHT-ALIGNED and above/below by row position: the column sits
 * near the right edge of a 1480px table, and a left-anchored card would open
 * off-screen — which is the failure mode that makes hover cards feel broken.
 */
const CallHistoryHover: React.FC<{ calls: any[]; total: number; children: React.ReactNode }> = ({ calls, total, children }) => {
  // Either a `top` (opening downwards) or a `bottom` (flipped above) — never
  // both. See the flip note in show().
  const [pos, setPos] = useState<{ top?: number; bottom?: number; left: number } | null>(null);
  const ref = useRef<HTMLDivElement>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => () => { if (closeTimer.current) clearTimeout(closeTimer.current); }, []);

  if (!calls?.length) return <>{children}</>;

  // FIXED, AND PORTALLED TO <body>.
  //
  // Two separate containers had to be escaped, and `position: fixed` alone
  // only escapes one of them:
  //
  //   • the scroll container — `.table-x-scroll` clips absolutely positioned
  //     descendants at the column edge.
  //   • a TRANSFORMED ANCESTOR — motion.css applies `transform` and
  //     `will-change: transform` to hover/animation classes, and ANY of those
  //     on an ancestor makes `position: fixed` resolve against that element
  //     instead of the viewport. getBoundingClientRect() still returns
  //     viewport coordinates, so the two disagree and the card lands a fixed
  //     distance below where it was asked to go — which is the gap that made
  //     it unreachable.
  //
  // A portal to <body> removes the card from that subtree entirely, so the
  // viewport coordinates and the fixed origin finally refer to the same thing.
  const show = () => {
    // Re-entering cancels a close already scheduled — this is what lets the
    // pointer travel from the badge onto the card. The card is a DOM
    // descendant of this wrapper, so moving onto it bubbles a mouseenter here.
    if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; }

    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    const W = 420, H = 300;

    // Right-aligned to the trigger, then clamped so it can never open past
    // either edge of the window.
    const left = Math.max(8, Math.min(r.right - W, window.innerWidth - W - 8));

    // FLUSH WITH THE TRIGGER — no gap, in either direction.
    //
    // A 4px offset left a strip belonging to neither the badge nor the card.
    // Crossing it fired mouseleave and shut the card before the agent could
    // reach it, which made the scrollable list inside impossible to use.
    //
    // Opening upward anchors the card's BOTTOM to the trigger's top rather
    // than computing a top from an assumed height. The card's real height
    // varies with how many calls it lists — anchoring by top would leave the
    // same dead gap again on every card shorter than the estimate.
    setPos(
      r.bottom + H > window.innerHeight
        ? { bottom: Math.max(8, window.innerHeight - r.top), left }
        : { top: r.bottom, left }
    );
  };

  // Closed on a delay, not immediately. Even flush edges leave a sub-pixel
  // seam at some zoom levels, and a pointer crossing it should not destroy the
  // card the agent is reaching for.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setPos(null), 220);
  };

  return (
    <div ref={ref} className="relative inline-block"
      onMouseEnter={show}
      onMouseLeave={scheduleClose}>
      {children}
      {pos && createPortal(
        <div
          style={{ position: 'fixed', top: pos.top, bottom: pos.bottom, left: pos.left, width: 420 }}
          className="z-[60] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden cursor-default"
          /* The card is no longer a DOM descendant of the trigger, so the
             wrapper's mouseleave fires the moment the pointer reaches it.
             These two keep it alive while the agent is reading or scrolling. */
          onMouseEnter={() => { if (closeTimer.current) { clearTimeout(closeTimer.current); closeTimer.current = null; } }}
          onMouseLeave={scheduleClose}>
          <div className="px-3 py-2 bg-[#1A5276] text-white flex items-center justify-between">
            <span className="text-[10px] font-extrabold uppercase tracking-wide">Calls since banked</span>
            <span className="text-[10px] opacity-80">
              {/* The cap is stated rather than hidden — a card silently showing
                  12 of 38 would read as the driver having been rung 12 times. */}
              {calls.length < total ? `latest ${calls.length} of ${total}` : `${total} call${total !== 1 ? 's' : ''}`}
            </span>
          </div>
          <div className="max-h-[260px] overflow-y-auto divide-y divide-gray-100">
            {calls.map((c: any) => (
              <div key={c.id} className="px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                    c.status === 'connected' ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : String(c.status).includes('callback') ? 'bg-blue-50 text-blue-700 border-blue-200'
                        : 'bg-rose-50 text-rose-700 border-rose-200'
                  }`}>
                    {String(c.status || 'unknown').replace(/_/g, ' ')}
                  </span>
                  <span className="text-[10px] font-semibold text-gray-700 truncate">{c.agent || 'Unknown agent'}</span>
                </div>

                <div className="mt-1 grid grid-cols-2 gap-x-3 gap-y-0.5 text-[9.5px] text-gray-600">
                  <div><span className="text-gray-400">Dialled</span> {stamp(c.called_at)}</div>
                  {/* Completion is a separate event from the dial — it is when
                      the agent finished writing the disposition. */}
                  <div><span className="text-gray-400">Completed</span> {stamp(c.completed_at)}</div>
                  {/* Talk vs handling: talk is 0 on a call that never
                      connected, handling spans dial → disposition. Showing only
                      one of them overstates or understates the work. */}
                  <div><span className="text-gray-400">Talk</span> {dur(c.talk_seconds)}</div>
                  <div><span className="text-gray-400">Handling</span> {dur(c.handling_seconds)}</div>
                </div>

                {(c.feedback || c.disposition_sub) && (
                  <div className="mt-1 text-[9.5px]">
                    <span className="text-gray-400">Feedback </span>
                    <span className="font-semibold text-gray-800">{c.feedback || '—'}</span>
                    {c.disposition_sub && (
                      <span className="text-gray-500"> · {c.disposition_sub}</span>
                    )}
                  </div>
                )}

                {c.remarks && (
                  <div className="mt-0.5 text-[9.5px] text-gray-600 italic break-words">“{c.remarks}”</div>
                )}

                <div className="mt-0.5 flex flex-wrap gap-2 text-[9px] text-gray-400">
                  {c.process && <span>{c.process}</span>}
                  {c.job_id && <span className="text-[#8E44AD]">{c.job_id}</span>}
                  {c.callback_at && <span className="text-blue-600">callback {stamp(c.callback_at)}</span>}
                </div>
              </div>
            ))}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

// ── JobIdPicker ───────────────────────────────────────────────────────────────
//
// Server-backed: the previous version pulled the newest 100 open jobs per type
// and filtered them in the browser, so any older job simply wasn't in the list
// to be picked — typing its id showed "No open jobs found". The typed term now
// goes to the API (which matches job id, title, location, transporter name,
// TMID and mobile), and selection is kept in explicit state rather than relying
// on blur timing.
const JobIdPicker: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [q, setQ]       = useState(value);
  const [term, setTerm] = useState('');
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLDivElement>(null);

  // Keep the box in step when the form seeds or clears the value externally.
  useEffect(() => { setQ(value); }, [value]);

  useEffect(() => {
    const t = setTimeout(() => setTerm(q.trim()), 300);
    return () => clearTimeout(t);
  }, [q]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, []);

  // One query across both categories; the server does the matching.
  const { data, isFetching } = useGetMmJobListingsQuery(
    { type: 'any', section: 'active', status: 'open', search: term || undefined, limit: 40 },
    { skip: !open }
  );
  const jobs = data?.success && Array.isArray(data?.data?.jobs) ? data.data.jobs : [];

  const select = (jobId: string) => {
    onChange(jobId);
    setQ(jobId);
    setOpen(false);
  };

  return (
    <div className="relative" ref={boxRef}>
      <div className="flex items-center gap-2">
        <input
          value={q}
          onChange={e => { setQ(e.target.value); if (value) onChange(''); setOpen(true); }}
          onFocus={() => setOpen(true)}
          placeholder="Type job id, title or transporter to search open jobs…"
          className="flex-1 border border-gray-400 px-2 py-1.5 text-xs outline-none focus:border-gray-600 bg-white"
        />
        {value && (
          <span className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1">
            <span className="material-symbols-outlined text-[13px]">check_circle</span>
            {value}
            <button
              type="button"
              onClick={() => { onChange(''); setQ(''); }}
              className="text-emerald-700 hover:text-red-600"
              title="Clear the selected job"
            >
              <span className="material-symbols-outlined text-[13px]">close</span>
            </button>
          </span>
        )}
      </div>

      {open && (
        <div className="absolute z-30 w-full bg-white border border-gray-400 shadow-lg mt-0 max-h-44 overflow-y-auto">
          {isFetching ? (
            <p className="px-3 py-2 text-[10px] text-gray-400 italic">Searching open jobs…</p>
          ) : jobs.length === 0 ? (
            <p className="px-3 py-2 text-[10px] text-gray-400 italic">
              {term ? `No open job matches “${term}”` : 'No open jobs found'}
            </p>
          ) : jobs.map(j => (
            <button
              type="button"
              key={j.id}
              onClick={() => select(j.job_id)}
              className={`w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-200 last:border-0 flex items-center gap-2 ${
                j.job_id === value ? 'bg-emerald-50' : ''
              }`}
            >
              <span className="font-bold text-gray-900 font-mono text-[10px] shrink-0">{j.job_id}</span>
              <span className="text-gray-500 text-[10px] truncate flex-1">{j.job_title}</span>
              {j.plan_type && (
                <span className="text-[9px] px-1 py-0.5 bg-gray-100 text-gray-500 border border-gray-200 shrink-0">{j.plan_type}</span>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ── DriverForm ────────────────────────────────────────────────────────────────
export const DriverForm: React.FC<{
  initial?: any;
  prefill?: Partial<{ name: string; mobile: string; tmid: string; user_id: number }>;
  onClose: () => void;
}> = ({ initial, prefill, onClose }) => {
  const { user } = useAuth();
  const [addDriver,    { isLoading: adding   }] = useAddDriverBankMutation();
  const [updateDriver, { isLoading: updating }] = useUpdateDriverBankMutation();
  const [searchUser, { data: srData, isFetching: srFetching }] = useLazySearchDriverBankUserQuery();
  const [searchQ, setSearchQ] = useState('');
  const [showSug, setShowSug] = useState(false);
  const [errMsg, setErrMsg]   = useState('');

  const isEdit  = !!initial && !prefill;
  const seed    = initial ?? prefill ?? {};

  const [form, setForm] = useState({
    user_id:        seed.user_id        ?? '',
    tmid:           seed.tmid           ?? '',
    name:           seed.name           ?? '',
    mobile:         seed.mobile         ?? '',
    job_id:         seed.job_id         ?? '',
    location:       seed.location       ?? '',
    license_type:   seed.license_type   ?? '',
    vehicle_type:   seed.vehicle_type   ?? '',
    experience:     seed.experience     ?? '',
    current_income: seed.current_income ?? '',
    availability:   seed.availability   ?? 'available',
    feedback:       seed.feedback       ?? '',
    remarks:        seed.remarks        ?? '',
  });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  useEffect(() => {
    if (searchQ.length >= 3) { searchUser(searchQ); setShowSug(true); }
    else setShowSug(false);
  }, [searchQ, searchUser]);

  const fill = (u: any) => {
    setForm(f => ({
      ...f,
      user_id:      u.id,
      tmid:         u.tmid          ?? '',
      name:         u.name,
      mobile:       u.mobile,
      location:     u.location      ?? f.location,
      license_type: u.license_type  ?? f.license_type,
      vehicle_type: u.vehicle_type  ?? f.vehicle_type,
      experience:   u.experience    ?? f.experience,
      current_income: u.current_income ?? f.current_income,
    }));
    setSearchQ(''); setShowSug(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrMsg('');
    if (!form.name.trim())   { setErrMsg('Driver name is required'); return; }
    if (!form.mobile.trim()) { setErrMsg('Mobile number is required'); return; }
    try {
      const payload = { ...form, user_id: form.user_id ? Number(form.user_id) : undefined };
      if (isEdit) await updateDriver({ id: initial.id, ...payload }).unwrap();
      else        await addDriver(payload as any).unwrap();
      onClose();
    } catch (err: any) {
      const apiErr = err?.data;
      const fieldErrors = apiErr?.errors
        ? Object.values(apiErr.errors as Record<string, string[]>).flat().join(', ')
        : null;
      const msg = fieldErrors
        ?? apiErr?.message
        ?? (err?.status === 'FETCH_ERROR' ? 'Network error. Check your connection and try again.' : null)
        ?? 'Failed to save. Check all fields and try again.';
      setErrMsg(msg);
    }
  };

  const saving = adding || updating;
  const fld = 'w-full border border-gray-400 px-2 py-1.5 text-xs outline-none focus:border-gray-700 bg-white';

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white shadow-2xl w-full max-w-lg max-h-[94vh] flex flex-col overflow-hidden border border-gray-400">

        {/* Title bar — dark flat */}
        <div className="bg-gray-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div>
            <span className="text-[10px] text-gray-400 uppercase tracking-widest">Driver Bank</span>
            <h2 className="text-sm font-bold mt-0.5">{isEdit ? 'Edit Driver Record' : 'Add Driver to Bank'}</h2>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-white text-xl leading-none font-light">×</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto custom-scrollbar">

          {/* ── Quick lookup (add only) ── */}
          {!isEdit && (
            <div className="px-4 pt-4 pb-3 border-b border-gray-200 bg-gray-50">
              <label className="block text-[10px] font-semibold text-gray-500 uppercase tracking-wider mb-1">
                Auto-fill from System (TMID / Mobile / Name)
              </label>
              <div className="relative">
                <input
                  value={searchQ} onChange={e => setSearchQ(e.target.value)}
                  placeholder="Search registered driver..."
                  className={fld}
                />
                {srFetching && (
                  <span className="absolute right-2 top-1.5 text-[10px] text-gray-400">searching…</span>
                )}
              </div>
              {showSug && srData?.data?.length > 0 && (
                <div className="border border-gray-400 border-t-0 bg-white shadow max-h-36 overflow-y-auto">
                  {srData.data.map((u: any) => (
                    <button type="button" key={u.id} onClick={() => fill(u)}
                      className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-100 last:border-0 flex items-center gap-2">
                      <span className="font-semibold text-gray-800 text-xs">{u.name}</span>
                      <span className="text-gray-400 text-[10px] font-mono ml-auto">{u.tmid} · **********</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── Fields ── */}
          <div className="px-4 py-4 space-y-0">

            {/* Section: Identity */}
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3">
              Driver Identity
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-600 font-semibold mb-0.5">Full Name <span className="text-red-500">*</span></label>
                <input value={form.name} onChange={e => set('name', e.target.value)} required className={fld} placeholder="As on licence" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-600 font-semibold mb-0.5">Mobile <span className="text-red-500">*</span></label>
                <input type="password" value={form.mobile} onChange={e => set('mobile', e.target.value)} required className={fld} placeholder="10-digit" />
              </div>
              <div>
                <label className="block text-[10px] text-gray-600 font-semibold mb-0.5">TMID</label>
                <input value={form.tmid} onChange={e => set('tmid', e.target.value)} className={fld} placeholder="TM12345" />
              </div>
              <div className="col-span-2">
                <label className="block text-[10px] text-gray-600 font-semibold mb-0.5">Base City / Location</label>
                <input value={form.location} onChange={e => set('location', e.target.value)} className={fld} placeholder="e.g. Delhi, Mumbai" />
              </div>
            </div>

            {/* Section: Job */}
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3">
              Job Assignment
            </div>
            <div className="mb-4">
              <label className="block text-[10px] text-gray-600 font-semibold mb-0.5">Job ID — select from open jobs</label>
              <JobIdPicker value={form.job_id} onChange={v => set('job_id', v)} />
            </div>

            {/* Section: Profile */}
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3">
              Driver Profile
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-3 mb-4">
              <div>
                <label className="block text-[10px] text-gray-600 font-semibold mb-0.5">Licence Type</label>
                <select value={form.license_type} onChange={e => set('license_type', e.target.value)} className={fld}>
                  <option value="">— Select —</option>
                  {LICENSE_TYPES.map(l => <option key={l.value} value={l.value}>{l.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-600 font-semibold mb-0.5">Vehicle Type</label>
                <select value={form.vehicle_type} onChange={e => set('vehicle_type', e.target.value)} className={fld}>
                  <option value="">— Select —</option>
                  {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-600 font-semibold mb-0.5">Experience</label>
                <select value={form.experience} onChange={e => set('experience', e.target.value)} className={fld}>
                  <option value="">— Select —</option>
                  {EXPERIENCE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-600 font-semibold mb-0.5">Current Income</label>
                <select value={form.current_income} onChange={e => set('current_income', e.target.value)} className={fld}>
                  <option value="">— Select —</option>
                  {INCOME_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
            </div>

            {/* Section: Status */}
            <div className="text-[9px] font-bold uppercase tracking-widest text-gray-400 border-b border-gray-200 pb-1 mb-3">
              Status &amp; Notes
            </div>
            <div className="space-y-3 mb-4">
              <div>
                <label className="block text-[10px] text-gray-600 font-semibold mb-0.5">Availability</label>
                <select value={form.availability} onChange={e => set('availability', e.target.value)} className={fld}>
                  {AVAIL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] text-gray-600 font-semibold mb-0.5">Feedback</label>
                <input value={form.feedback} onChange={e => set('feedback', e.target.value)}
                  placeholder="e.g. Interested, needs callback, placed on Job X…"
                  className={fld} />
              </div>
              <div>
                <label className="block text-[10px] text-gray-600 font-semibold mb-0.5">Remarks</label>
                <textarea value={form.remarks} onChange={e => set('remarks', e.target.value)} rows={2}
                  className={`${fld} resize-none`} />
              </div>
            </div>

            {user && !isEdit && (
              <p className="text-[10px] text-gray-400 pb-2">
                Adding as: <span className="font-semibold text-gray-600">{user.name}</span>
                {user.role && <span className="ml-1 text-gray-400">({user.role})</span>}
              </p>
            )}
          </div>
        </form>

        {/* Error */}
        {errMsg && (
          <div className="px-4 py-2 shrink-0 bg-red-50 border-t-2 border-red-400 text-[10px] text-red-700 font-semibold flex items-center gap-2">
            <span className="material-symbols-outlined text-sm text-red-500 shrink-0">error</span>
            {errMsg}
          </div>
        )}

        {/* Actions */}
        <div className="px-4 py-3 bg-gray-50 border-t border-gray-300 flex gap-2 shrink-0">
          <button type="button" onClick={onClose}
            className="flex-1 py-2 border border-gray-400 text-gray-600 font-semibold text-xs hover:bg-gray-100">
            Cancel
          </button>
          <button onClick={handleSubmit as any} disabled={saving}
            className="flex-1 py-2 bg-gray-900 hover:bg-gray-700 disabled:opacity-40 text-white font-semibold text-xs">
            {saving ? 'Saving…' : isEdit ? 'Save Changes' : 'Add to Bank'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── QuickEdit ─────────────────────────────────────────────────────────────────
const QuickEditModal: React.FC<{ driver: any; onClose: () => void }> = ({ driver, onClose }) => {
  const [updateDriver, { isLoading }] = useUpdateDriverBankMutation();
  const [avail, setAvail] = useState(driver.availability);
  const [feedback, setFeedback] = useState(driver.feedback ?? '');
  const [remarks,  setRemarks]  = useState(driver.remarks  ?? '');
  const [qErr, setQErr] = useState('');

  const save = async () => {
    try {
      await updateDriver({ id: driver.id, availability: avail, feedback, remarks }).unwrap();
      onClose();
    } catch (err: any) {
      setQErr(err?.data?.message ?? 'Update failed, please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden">
        <div className="p-4 bg-[#1A5276] text-white flex justify-between items-center">
          <div>
            <p className="text-[10px] opacity-80 font-bold uppercase">Quick Update</p>
            <h3 className="font-extrabold">{driver.name}</h3>
          </div>
          <button onClick={onClose} className="text-white/70 hover:text-white font-bold">✕</button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1.5">Availability</p>
            <div className="flex flex-wrap gap-1.5">
              {AVAIL_OPTIONS.map(o => (
                <button key={o.value} onClick={() => setAvail(o.value)}
                  className={`px-3 py-1 rounded-full border font-bold text-[10px] ${avail === o.value ? o.cls : 'bg-white text-gray-500 border-gray-200'}`}>
                  {o.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Feedback</p>
            <input value={feedback} onChange={e => setFeedback(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#1A5276]" />
          </div>
          <div>
            <p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Remarks</p>
            <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs outline-none focus:ring-1 focus:ring-[#1A5276] resize-none" />
          </div>
          {qErr && <p className="text-[10px] text-red-600 bg-red-50 rounded px-2 py-1 font-semibold">{qErr}</p>}
          <button onClick={save} disabled={isLoading}
            className="w-full py-2 bg-[#1A5276] hover:bg-[#154360] disabled:opacity-50 text-white rounded-xl font-bold text-xs">
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Main ──────────────────────────────────────────────────────────────────────
const MmDriverBank: React.FC = () => {
  const { triggerCall } = useClickToCall();
  const [search, setSearch]         = useState('');
  const [availFilter, setAvailFilter] = useState('');
  const [jobFilter, setJobFilter]   = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [expFilter, setExpFilter]   = useState('');
  const [cursor, setCursor]         = useState<number | null>(null);
  const [allRows, setAllRows]       = useState<any[]>([]);
  const [showAdd, setShowAdd]       = useState(false);
  const [editDriver, setEditDriver] = useState<any | null>(null);
  const [quickEdit, setQuickEdit]   = useState<any | null>(null);
  const [delId, setDelId]           = useState<number | null>(null);
  const [selectedDetailId, setSelectedDetailId] = useState<number | null>(null);

  const [deleteDriver, { isLoading: deleting }] = useDeleteDriverBankMutation();

  const { data, isLoading, isFetching, refetch } = useGetDriverBankQuery(
    { search: search || undefined, availability: availFilter || undefined, job_id: jobFilter || undefined,
      vehicle_type: vehicleFilter || undefined, location: locationFilter || undefined,
      experience: expFilter || undefined,
      per_page: 30, cursor: cursor ?? undefined },
    { refetchOnMountOrArgChange: true }
  );

  /* ── QUICK UPDATE, STRAIGHT AFTER THE DISPOSITION ────────────────────────
     The disposition records what happened on the CALL; Quick Update records
     what it means for the CANDIDATE — availability, feedback, remarks. They
     are two different records and the agent has the answer to both exactly
     once: the moment they hang up. Asking for the second one later means
     going back to find the row, which is how a bank fills with drivers whose
     availability is whatever it was when they were added.

     Driven off the same `san-disposition-complete` event the focus screens
     use, filtered to lead.type === 'driver_bank' so a disposition from any
     other screen never pops this modal.

     DECLARED AFTER useGetDriverBankQuery, not before it. `refetch` is a const
     from that hook, so a dependency array naming it above this line is read
     during render while it is still in the temporal dead zone — which throws
     "Cannot access 'refetch' before initialization" and white-screens the
     page. Neither tsc nor the bundler catches it: const TDZ is a runtime
     error, and a build never executes the component.
     ───────────────────────────────────────────────────────────────────── */
  const rowsRef = useRef<any[]>([]);
  useEffect(() => { rowsRef.current = allRows; }, [allRows]);

  useEffect(() => {
    const onDispositionComplete = (e: Event) => {
      const detail = (e as CustomEvent).detail || {};
      const lead = detail.lead || {};

      if (lead.type !== 'driver_bank') return;

      // Match the call back to a banked row. The phone is the only identity
      // guaranteed present on every call — user_id is null for anyone the CTI
      // could not resolve, and the tmid is a display value the dialer may have
      // rewritten. Compared on the last 10 digits, since one side carries a
      // country code and the other does not.
      const last10 = (v: any) => String(v ?? '').replace(/\D/g, '').slice(-10);
      const wantedPhone = last10(lead.phone);
      const wantedId = Number(lead.id) || 0;

      const hit = rowsRef.current.find((r: any) =>
        (wantedPhone && last10(r.mobile) === wantedPhone) ||
        (wantedId && Number(r.user_id) === wantedId)
      );

      // The list is paginated and the driver may have been dialled from a page
      // since scrolled past — better to refresh quietly than to pop a modal
      // bound to the wrong person.
      if (!hit) { refetch(); return; }

      // QuickEditModal updates by driver_bank id, and an expanded row carries
      // the driver id under driver_bank_id — `id` on those rows is the same
      // value, but being explicit keeps it correct if the shape ever changes.
      setQuickEdit({ ...hit, id: hit.driver_bank_id ?? hit.id });
    };

    window.addEventListener('san-disposition-complete', onDispositionComplete);
    return () => window.removeEventListener('san-disposition-complete', onDispositionComplete);
  }, [refetch]);

  // Populate rows — no separate filter-reset effect (that caused allRows to clear
  // after data was set when the cache returned the same reference on re-mount).
  // The cursor=null branch here already replaces (not appends), so filter changes
  // that cause a new data reference automatically update the list.
  useEffect(() => {
    if (isFetching) return;
    const rows = Array.isArray(data?.data) ? data.data : [];
    if (cursor === null) {
      setAllRows(rows);
    } else {
      setAllRows(prev => {
        const validPrev = Array.isArray(prev) ? prev : [];
        const ids = new Set(validPrev.filter(Boolean).map((r: any) => r.id));
        return [...validPrev, ...rows.filter((r: any) => r && !ids.has(r.id))];
      });
    }
  }, [data, cursor, isFetching]);

  // Only reset cursor on filter change; data effect handles list refresh when new data arrives.
  useEffect(() => { setCursor(null); }, [search, availFilter, jobFilter, vehicleFilter, locationFilter, expFilter]);

  const resetList = () => { setCursor(null); refetch(); };

  const handleDelete = async (id: number) => {
    await deleteDriver(id).unwrap();
    setDelId(null); resetList();
  };

  const pagination = data?.pagination;
  const total = data?.total ?? 0;

  return (
    <div className="flex flex-col h-[calc(100vh-60px)] bg-gray-50 overflow-hidden text-xs">

      {/* Header */}
      <div className="px-5 py-3 bg-white border-b border-gray-200 shrink-0">
        <div className="flex items-center gap-3 flex-wrap">
          <div>
            <h1 className="text-sm font-extrabold text-gray-800 uppercase tracking-wide">Driver Bank</h1>
            <p className="text-[10px] text-gray-400">Shortlisted drivers ready for placement — any role can add</p>
          </div>

          <div className="relative flex-1 max-w-xs">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Name or TMID..."
              className="w-full pl-8 pr-8 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#8E44AD]" />
            {search && <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400">
              <span className="material-symbols-outlined text-sm">close</span></button>}
          </div>

          <select value={availFilter} onChange={e => setAvailFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none text-gray-700 text-[10px] font-semibold">
            <option value="">All Status</option>
            {AVAIL_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>

          <select value={vehicleFilter} onChange={e => setVehicleFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none text-gray-700 text-[10px] font-semibold">
            <option value="">All Vehicles</option>
            {VEHICLE_TYPES.map(v => <option key={v} value={v}>{v}</option>)}
          </select>

          <select value={expFilter} onChange={e => setExpFilter(e.target.value)}
            className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none text-gray-700 text-[10px] font-semibold">
            <option value="">All Experience</option>
            {EXPERIENCE_OPTIONS.map(e => <option key={e.value} value={e.value}>{e.label}</option>)}
          </select>

          <input value={locationFilter} onChange={e => setLocationFilter(e.target.value)}
            placeholder="Location..."
            className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none text-gray-700 text-[10px] font-semibold w-28" />

          <input value={jobFilter} onChange={e => setJobFilter(e.target.value)}
            placeholder="Filter by Job ID..."
            className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none text-gray-700 text-[10px] font-semibold w-32" />

          <div className="ml-auto flex items-center gap-2">
            <span className="text-gray-400 text-[10px]">{total} driver{total !== 1 ? 's' : ''}</span>
            <button onClick={resetList} title="Refresh list" disabled={isFetching}
              className="flex items-center justify-center bg-gray-100 hover:bg-gray-200 text-gray-700 w-8 h-8 rounded-lg font-bold shadow-sm transition-all disabled:opacity-50">
              <span className={`material-symbols-outlined text-sm ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
            </button>
            <button onClick={() => setShowAdd(true)}
              className="flex items-center gap-1.5 bg-[#8E44AD] hover:bg-[#7D3C98] text-white px-3 py-2 rounded-lg font-bold shadow-sm">
              <span className="material-symbols-outlined text-sm">person_add</span>Add Driver
            </button>
          </div>
        </div>
      </div>

      {/* Table
          `flex-1` bounds this box to the space left by the header, so the
          horizontal scrollbar sits at the BOTTOM EDGE OF THE VIEWPORT rather
          than below 15 rows of content — which is where it ends up if the
          container is allowed to grow to its content height. */}
      <div className="flex-1 table-x-scroll">
        {isLoading && allRows.length === 0 ? (
          <div className="p-4 space-y-2">
            {[...Array(8)].map((_, i) => <div key={i} className="h-12 bg-white rounded-lg border border-gray-200 animate-pulse" />)}
          </div>
        ) : allRows.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <span className="material-symbols-outlined text-5xl mb-3">person_search</span>
            <p className="font-semibold text-sm">No drivers in bank yet</p>
            <p className="text-[11px] mt-1">Click "Add Driver" to start — any role can add drivers</p>
          </div>
        ) : (
          <table
            /* min-width sized to the 16 columns actually rendered. It was
               1000px for 14; adding Job Agent and Since Banked pushed the real
               width past it, so the last columns (Feedback, Added By, Added /
               Updated, Actions) were clipped with no bar to reach them. */
            className="w-full border-collapse min-w-[1480px]"
          >
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {['#','Driver','Mobile','TMID','Job ID','Job Agent','Location','Vehicle / Lic.','Exp.','Status','Since Banked','Last Call','Feedback','Added By','Added / Updated','Actions'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[10px] font-extrabold text-gray-500 uppercase tracking-wide border-b border-gray-200 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {/* ONE ROW PER (DRIVER × JOB).
                  A driver considered for three vacancies arrives as three rows
                  from the server, each carrying that job's own owner. `row_key`
                  is the key, NOT `id` — the driver id repeats across its own
                  rows and React would collapse them into one. */}
              {allRows.map((row: any, i: number) => {
                const prev = allRows[i - 1];
                // The first row of a driver's group carries the identity
                // columns; the repeats are visually indented under it so three
                // rows read as one candidate against three jobs, not as three
                // separate drivers who happen to share a name.
                const isRepeat = prev && (prev.driver_bank_id ?? prev.id) === (row.driver_bank_id ?? row.id);

                return (
                <tr key={row.row_key || row.id} className={`border-b border-gray-100 hover:bg-purple-50/30 ${isRepeat ? 'bg-purple-50/20' : i % 2 ? 'bg-gray-50/50' : 'bg-white'}`}>
                  <td className="py-2 px-3 font-mono text-[10px] text-gray-400">{isRepeat ? '' : (row.driver_bank_id ?? row.id)}</td>
                  <td className="py-2 px-3">
                    {isRepeat ? (
                      <div className="text-[10px] text-gray-400 pl-3 border-l-2 border-purple-200">↳ same driver</div>
                    ) : (
                      <>
                        <div className="font-bold text-gray-850">
                          {row.name}
                          {row.job_count > 1 && (
                            <span className="ml-1.5 text-[9px] font-bold px-1.5 py-0.5 rounded bg-purple-100 text-purple-700 border border-purple-200"
                              title={`Considered for ${row.job_count} jobs`}>
                              {row.job_count} jobs
                            </span>
                          )}
                        </div>
                        {row.remarks && <div className="text-[9px] text-gray-400 truncate max-w-[120px]" title={row.remarks}>{row.remarks}</div>}
                      </>
                    )}
                  </td>
                  <td className="py-2 px-3 font-mono text-[10px]">{isRepeat ? '' : '**********'}</td>
                  <td className="py-2 px-3 font-mono text-[10px] text-gray-500">{isRepeat ? '' : (row.tmid || '—')}</td>
                  <td className="py-2 px-3 font-mono text-[10px] text-[#8E44AD]">
                    {row.job_id || <span className="text-gray-300 font-sans">no job linked</span>}
                    {row.job_title && <div className="text-[9px] text-gray-400 font-sans truncate max-w-[130px]" title={row.job_title}>{row.job_title}</div>}
                  </td>
                  {/* THE COLUMN THE WHOLE EXPANSION EXISTS FOR — who owns this
                      vacancy. Read live from jobs.assigned_to, so a reassigned
                      job shows its new owner here without touching the bank. */}
                  <td className="py-2 px-3 text-[10px]">
                    {row.job_agent_name ? (
                      <span className="font-semibold text-gray-700">{row.job_agent_name}</span>
                    ) : row.job_id ? (
                      <span className="text-amber-600 text-[9px]" title="This job has no agent assigned">unassigned</span>
                    ) : <span className="text-gray-300">—</span>}
                    {row.link_status && row.link_status !== 'considering' && (
                      <div className="text-[9px] text-gray-500 capitalize">{row.link_status}</div>
                    )}
                  </td>
                  <td className="py-2 px-3 text-[10px] text-gray-600">{isRepeat ? '' : (row.location || '—')}</td>
                  <td className="py-2 px-3">
                    <div className="text-[10px]">{row.vehicle_type || '—'}</div>
                    <div className="text-[9px] text-gray-400">{row.license_type || ''}</div>
                  </td>
                  <td className="py-2 px-3 text-[10px]">{row.experience || '—'}</td>
                  <td className="py-2 px-3">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${availCls(row.availability)}`}>
                      {availLbl(row.availability)}
                    </span>
                  </td>
                  {/* SINCE BANKED — the number that says whether this bank is
                      being worked. A driver can have 40 prior calls and none
                      since banking; a combined total presents those 40 as
                      engagement the bank produced, which is how a stale bank
                      goes unnoticed for weeks. */}
                  <td className="py-2 px-3 text-[10px]">
                    {isRepeat ? '' : row.never_called_since_banked ? (
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-rose-50 text-rose-700 border-rose-200"
                        title="Banked, but nobody has called since">
                        not called yet
                      </span>
                    ) : (
                      <div className="whitespace-nowrap">
                        <CallHistoryHover calls={row.recent_calls_since_banked || []} total={row.calls_after_banking}>
                          {/* No `title` here. The native tooltip renders its
                              own dark box under the cursor after a browser
                              delay — directly on top of the card this badge
                              opens. The dashed border already signals it is
                              hoverable. */}
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200 cursor-help border-dashed">
                            {row.calls_after_banking} since
                          </span>
                        </CallHistoryHover>
                        {row.hours_to_first_call !== null && row.hours_to_first_call !== undefined && (
                          <div className="text-[9px] text-gray-500 mt-0.5" title="Time from banking to the first call">
                            {row.hours_to_first_call < 24
                              ? `${row.hours_to_first_call}h to 1st`
                              : `${Math.round(row.hours_to_first_call / 24)}d to 1st`}
                          </div>
                        )}
                        {row.calls_before_banking > 0 && (
                          <div className="text-[9px] text-gray-400" title="Calls that predate the banking">
                            +{row.calls_before_banking} before
                          </div>
                        )}
                      </div>
                    )}
                  </td>
                  {/* LAST CALL — a bank that shows drivers but not whether
                      anyone has rung them sends agents round in circles. */}
                  <td className="py-2 px-3 text-[10px]">
                    {row.call_count ? (
                      <div className="whitespace-nowrap">
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${
                          String(row.last_call_status).toLowerCase() === 'connected'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : String(row.last_call_status).toLowerCase().includes('callback')
                              ? 'bg-blue-50 text-blue-700 border-blue-200'
                              : 'bg-rose-50 text-rose-700 border-rose-200'
                        }`}>
                          {String(row.last_call_status || 'unknown').replace(/_/g, ' ')}
                        </span>
                        <div className="text-[9px] text-gray-500 mt-0.5" title={row.last_call_at || ''}>
                          {stamp(row.last_call_at)}
                          {' · '}{row.call_count} call{row.call_count !== 1 ? 's' : ''}
                        </div>
                      </div>
                    ) : (
                      <span className="text-gray-300">never called</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-[10px] text-gray-600 max-w-[100px]">
                    <span className="truncate block" title={row.feedback}>{row.feedback || '—'}</span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="text-[10px] font-semibold">{row.added_by_name || row.added_by_admin_name || '—'}</div>
                    {row.added_by_role && <div className="text-[9px] text-gray-400 uppercase">{row.added_by_role}</div>}
                  </td>
                  {/* WHEN THE ENTRY ITSELF WAS TOUCHED — not the call.
                      `created_at` is when the telecaller banked this driver;
                      `updated_at` is when someone last changed the record.
                      Equal values mean it has never been edited, so showing
                      both would just be the same date twice. */}
                  <td className="py-2 px-3 text-[10px] whitespace-nowrap">
                    <div className="text-gray-700 font-semibold" title={row.created_at || ''}>
                      {stamp(row.created_at)}
                    </div>
                    {row.updated_at && row.updated_at !== row.created_at ? (
                      <div className="text-[9px] text-amber-600" title={`Last updated ${row.updated_at}`}>
                        upd {stamp(row.updated_at)}
                      </div>
                    ) : (
                      <div className="text-[9px] text-gray-300">not edited</div>
                    )}
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      {/* leadType 'driver_bank' is what stamps the call row's
                          process as driver_bank_match_making. Without it the
                          lead is just a driver and the call reports as general
                          Driver Onboarding, indistinguishable from a welcome
                          call. The jobId rides along so the dial is attributable
                          to the vacancy this row represents. */}
                      <button title="Call" onClick={() => triggerCall(row.name, row.mobile, 'Driver Bank', row.tmid || 'DR', undefined, { source: 'driver-bank', driverBankId: row.driver_bank_id ?? row.id, jobId: row.job_id, jobAgent: row.job_agent_name }, row.user_id ? Number(row.user_id) : 0, 'driver_bank')}
                        className="w-6 h-6 rounded-full bg-[#1A5276] hover:bg-[#154360] text-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[11px]">call</span>
                      </button>
                      <button title="Details" onClick={() => setSelectedDetailId(row.id)}
                        className="w-6 h-6 rounded-full bg-[#3498DB] hover:bg-[#2980B9] text-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[11px]">info</span>
                      </button>
                      <button title="Quick update" onClick={() => setQuickEdit(row)}
                        className="w-6 h-6 rounded-full bg-amber-500 hover:bg-amber-600 text-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[11px]">edit_note</span>
                      </button>
                      <button title="Edit full" onClick={() => setEditDriver(row)}
                        className="w-6 h-6 rounded-full bg-[#8E44AD] hover:bg-[#7D3C98] text-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[11px]">tune</span>
                      </button>
                      <button title="Remove" onClick={() => setDelId(row.id)}
                        className="w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center shadow-sm">
                        <span className="material-symbols-outlined text-[11px]">delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {pagination?.has_more && (
          <div className="flex justify-center py-4">
            <button onClick={() => setCursor(pagination.next_cursor)} disabled={isFetching}
              className="px-6 py-2 bg-white border border-[#8E44AD] text-[#8E44AD] rounded-xl font-bold hover:bg-purple-50 disabled:opacity-50 text-xs">
              {isFetching ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}

        {isFetching && allRows.length > 0 && (
          <div className="text-center py-2 text-[10px] text-gray-400">Refreshing...</div>
        )}
      </div>

      {/* Modals */}
      {showAdd    && <DriverForm onClose={() => { setShowAdd(false); resetList(); }} />}
      {editDriver && <DriverForm initial={editDriver} onClose={() => { setEditDriver(null); resetList(); }} />}
      {quickEdit  && <QuickEditModal driver={quickEdit} onClose={() => { setQuickEdit(null); resetList(); }} />}
      {selectedDetailId !== null && (
        <DriverDetailModal driverId={selectedDetailId} onClose={() => setSelectedDetailId(null)} />
      )}

      {/* Delete confirm */}
      {delId !== null && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-2xl w-80 p-5 space-y-4">
            <div className="flex items-center gap-3">
              <span className="material-symbols-outlined text-red-500 text-3xl">warning</span>
              <div>
                <p className="font-extrabold text-gray-800">Remove from Bank?</p>
                <p className="text-xs text-gray-500 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDelId(null)}
                className="flex-1 py-2 border border-gray-200 rounded-xl text-gray-500 font-bold text-xs">Cancel</button>
              <button onClick={() => handleDelete(delId)} disabled={deleting}
                className="flex-1 py-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white rounded-xl font-bold text-xs">
                {deleting ? 'Removing...' : 'Remove'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ── DriverDetailModal ────────────────────────────────────────────────────────
const DriverDetailModal: React.FC<{ driverId: number; onClose: () => void }> = ({ driverId, onClose }) => {
  const { data, isLoading, error } = useGetDriverBankDetailQuery(driverId);
  const { triggerCall } = useClickToCall();

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl w-full max-w-lg shadow-2xl border border-gray-200 animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3"></div>
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200 text-center space-y-4">
          <span className="material-symbols-outlined text-red-500 text-5xl">error</span>
          <h3 className="text-lg font-bold text-gray-800">Error Loading Details</h3>
          <p className="text-xs text-gray-500">{String(error) || 'Failed to fetch details'}</p>
          <button onClick={onClose} className="w-full py-2 bg-gray-900 text-white rounded-xl font-semibold text-xs">Close</button>
        </div>
      </div>
    );
  }

  // Defaults matter here: a server still running the previous build returns
  // no call_timeline at all, and the modal must degrade to "no calls yet"
  // rather than crash on undefined.
  const {
    driver,
    applications = [],
    subscription,
    call_timeline: timeline = [],
    call_summary: callSummary,
  } = data.data as DriverBankDetailResponse['data'];

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col rounded-2xl overflow-hidden border border-gray-200 animate-fadeIn">
        
        {/* Title / Hero bar */}
        <div className="bg-gradient-to-r from-purple-800 to-indigo-900 text-white px-6 py-4 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-purple-500 text-white font-extrabold px-1.5 py-0.5 rounded-full uppercase tracking-wider">Driver Profile</span>
              {driver.tmid && <span className="text-[10px] bg-white/20 text-white font-mono px-2 py-0.5 rounded-md">{driver.tmid}</span>}
            </div>
            <h2 className="text-lg font-extrabold mt-1 flex items-center gap-2">{driver.name}</h2>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/25 flex items-center justify-center text-white font-light text-xl transition-all">×</button>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          
          {/* Identity & Basic Info Card */}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Masked Mobile</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="font-mono text-gray-800 font-bold">**********</span>
                <button onClick={() => triggerCall(driver.name, driver.mobile, 'Driver Bank', driver.tmid || 'DR', undefined, { source: 'driver-bank', driverBankId: driverId, jobId: driver.job_id }, driver.user_id ? Number(driver.user_id) : 0, 'driver_bank')}
                  className="w-5 h-5 rounded-full bg-green-600 hover:bg-green-700 text-white flex items-center justify-center transition-all">
                  <span className="material-symbols-outlined text-[10px]">call</span>
                </button>
              </div>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Base Location</p>
              <p className="text-gray-800 font-semibold mt-0.5">{driver.location || '—'}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">License Type</p>
              <p className="text-gray-800 font-semibold mt-0.5">{driver.license_type || '—'}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Vehicle Type</p>
              <p className="text-gray-800 font-semibold mt-0.5">{driver.vehicle_type || '—'}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Experience</p>
              <p className="text-gray-800 font-semibold mt-0.5">{driver.experience || '—'}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Current Income</p>
              <p className="text-gray-800 font-semibold mt-0.5">{driver.current_income || '—'}</p>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Availability</p>
              <div className="mt-0.5">
                <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${availCls(driver.availability)}`}>
                  {availLbl(driver.availability)}
                </span>
              </div>
            </div>
            <div>
              <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Added By</p>
              <p className="text-gray-800 font-semibold mt-0.5 truncate" title={driver.added_by_admin_name || driver.added_by_name}>
                {driver.added_by_admin_name || driver.added_by_name || '—'}
              </p>
            </div>
          </div>

          {/* Subscription plan details section */}
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-amber-500">workspace_premium</span>
              Subscription plan of that driver
            </h3>
            {subscription ? (
              <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-amber-800">{subscription.plan_name || 'Active Subscription'}</h4>
                  <div className="flex gap-4 mt-1 text-[10px] text-gray-500">
                    {subscription.sub_id && <span>Sub ID: <strong className="font-mono text-gray-700">{subscription.sub_id}</strong></span>}
                    {subscription.payment_date && <span>Activated: <strong className="text-gray-700">{new Date(subscription.payment_date).toLocaleDateString()}</strong></span>}
                  </div>
                </div>
                {subscription.payment_amount && (
                  <div className="text-right">
                    <span className="text-[10px] text-amber-700 font-bold uppercase block">Amount Paid</span>
                    <span className="text-sm font-extrabold text-amber-800">₹{subscription.payment_amount}</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-gray-100 text-gray-500 rounded-xl p-3 border border-gray-200 text-center italic text-[11px]">
                No subscription plan details found for this user.
              </div>
            )}
          </div>

          {/* Job Applications section */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-indigo-500 font-light">list_alt</span>
                Applied Jobs Info
              </h3>
              <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                {applications.length} Job{applications.length !== 1 ? 's' : ''} Applied
              </span>
            </div>

            {applications.length === 0 ? (
              <div className="bg-gray-50 text-gray-400 rounded-xl p-6 border border-gray-200 border-dashed text-center">
                <span className="material-symbols-outlined text-3xl mb-1 text-gray-300">work_off</span>
                <p className="text-[11px] font-semibold">Has not applied to any jobs yet.</p>
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl overflow-hidden bg-white max-h-56 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr className="border-b border-gray-200">
                      <th className="py-2 px-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Job ID</th>
                      <th className="py-2 px-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Job Title</th>
                      <th className="py-2 px-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Salary</th>
                      <th className="py-2 px-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider">Route</th>
                      <th className="py-2 px-3 text-[9px] font-bold text-gray-400 uppercase tracking-wider text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {applications.map((app: any) => (
                      <tr key={app.app_id} className="hover:bg-gray-50 text-[10px]">
                        <td className="py-2 px-3 font-mono font-bold text-purple-700">{app.job_id}</td>
                        <td className="py-2 px-3 text-gray-800 font-semibold truncate max-w-[150px]" title={app.job_title}>{app.job_title}</td>
                        <td className="py-2 px-3 text-gray-600">{app.salary || '—'}</td>
                        <td className="py-2 px-3 text-gray-600 truncate max-w-[100px]" title={app.route}>{app.route || '—'}</td>
                        <td className="py-2 px-3 text-center">
                          <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
                            app.app_status === 'accepted' ? 'bg-green-50 text-green-700 border-green-200' :
                            app.app_status === 'rejected' ? 'bg-red-50 text-red-700 border-red-200' :
                            'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>
                            {app.app_status || 'pending'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* CALL TIMELINE — the reason the info button gets clicked.
              Every call ever placed to this driver, with the remark the agent
              wrote and BOTH timestamps: when it was dialled, and when the
              disposition was written. Those are different moments, and a
              disposition edited a day later is worth seeing. */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-gray-700 flex items-center gap-2">
                <span className="material-symbols-outlined text-indigo-500" style={{ fontSize: 18 }}>history</span>
                CALL HISTORY TIMELINE
              </h3>
              {timeline.length > 0 && (
                <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full">
                  {callSummary?.total ?? timeline.length} call{(callSummary?.total ?? timeline.length) !== 1 ? 's' : ''}
                  {callSummary?.connected ? ` · ${callSummary.connected} connected` : ''}
                </span>
              )}
            </div>

            {timeline.length === 0 ? (
              <div className="border border-dashed border-gray-200 rounded-xl p-4 text-center">
                {/* An empty timeline has two causes, and they are not the same
                    problem: nobody has rung this driver, or the bank entry has
                    no identity to find their calls by. */}
                {callSummary?.matched_by?.length ? (
                  <p className="text-xs text-gray-400 font-medium">No calls have been placed to this driver yet.</p>
                ) : (
                  <p className="text-xs text-amber-600 font-semibold">
                    This entry has no mobile, TMID or linked account — there is nothing to match their calls against.
                  </p>
                )}
              </div>
            ) : (
              <div className="border border-gray-200 rounded-xl divide-y divide-gray-100 max-h-72 overflow-y-auto">
                {timeline.map((c: DriverCallTimelineEntry) => {
                  const status = String(c.call_status || '').toLowerCase();
                  const connected = status === 'connected';
                  const callback = status.includes('callback');
                  const tone = connected
                    ? { dot: 'bg-emerald-500', chip: 'bg-emerald-50 text-emerald-700 border-emerald-200' }
                    : callback
                      ? { dot: 'bg-blue-500', chip: 'bg-blue-50 text-blue-700 border-blue-200' }
                      : { dot: 'bg-rose-500', chip: 'bg-rose-50 text-rose-700 border-rose-200' };
                  const fmt = (v: string | null | undefined) => (v ? new Date(String(v).replace(' ', 'T')).toLocaleString('en-IN', {
                    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', hour12: true,
                  }) : '—');
                  // Only worth showing when the disposition was written at a
                  // different time from the call — otherwise it is noise.
                  const edited = c.updated_at && c.updated_at !== c.called_at;

                  return (
                    <div
                      key={c.id}
                      className="p-3 hover:bg-gray-50/70 transition-colors"
                      title={edited ? `Disposition last written ${fmt(c.updated_at)}` : undefined}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${tone.dot}`} />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full border ${tone.chip}`}>
                              {c.call_status || 'unknown'}
                            </span>
                            {c.disposition_sub && (
                              <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                                {String(c.disposition_sub).replace(/_/g, ' ')}
                              </span>
                            )}
                            {c.direction === 'incoming' && (
                              <span className="text-[10px] font-bold text-violet-600 bg-violet-50 border border-violet-200 px-2 py-0.5 rounded-full">INCOMING</span>
                            )}
                            {c.source && c.source !== 'call_history_ivr' && (
                              <span className="text-[10px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full" title="Logged by another desk">
                                {String(c.source).replace(/_/g, ' ')}
                              </span>
                            )}
                            {c.duration_seconds > 0 && (
                              <span className="text-[10px] font-semibold text-gray-500">
                                {Math.floor(c.duration_seconds / 60)}m {c.duration_seconds % 60}s talk
                              </span>
                            )}
                            {/* Dial through to disposition. Shown only when it
                                adds something over talk time — on a call that
                                never connected it is the only duration there is. */}
                            {!!c.handling_seconds && c.handling_seconds !== c.duration_seconds && (
                              <span className="text-[10px] font-semibold text-gray-400" title="Dial through to disposition">
                                {Math.floor(c.handling_seconds / 60)}m {c.handling_seconds % 60}s handling
                              </span>
                            )}
                          </div>

                          <div className="mt-1 text-[11px] text-gray-500 flex flex-wrap gap-x-3 gap-y-0.5">
                            <span><span className="text-gray-400">Called:</span> <strong className="text-gray-700">{fmt(c.called_at)}</strong></span>
                            {c.called_by && <span><span className="text-gray-400">By:</span> <strong className="text-gray-700">{c.called_by}</strong></span>}
                            {c.callback_at && <span><span className="text-gray-400">Callback:</span> <strong className="text-blue-600">{fmt(c.callback_at)}</strong></span>}
                          </div>

                          {c.remarks && (
                            <p className="mt-1.5 text-xs text-gray-700 bg-gray-50 border border-gray-100 rounded-lg px-2.5 py-1.5 whitespace-pre-wrap break-words">
                              {c.remarks}
                            </p>
                          )}

                          {c.recording_url && (
                            <div className="mt-2">
                              <audio
                                controls
                                preload="none"
                                src={c.recording_url}
                                className="h-8 w-full max-w-xs"
                                onError={(e) => {
                                  // A recording path that 404s is common on old
                                  // rows; a dead player with no explanation is
                                  // worse than saying it is unavailable.
                                  const el = e.currentTarget;
                                  el.style.display = 'none';
                                  el.insertAdjacentHTML('afterend',
                                    '<span class="text-[10px] text-gray-400 italic">Recording unavailable</span>');
                                }}
                              />
                              {c.recording_source && c.recording_source !== 'manual' && (
                                <span className="ml-2 text-[9px] text-gray-400 uppercase">{c.recording_source}</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Feedback & Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1">Driver Feedback</h4>
              <p className="text-xs text-gray-800 font-medium whitespace-pre-wrap">{driver.feedback || '—'}</p>
            </div>
            <div className="border border-gray-200 rounded-xl p-3 bg-gray-50">
              <h4 className="text-[10px] font-bold text-gray-400 uppercase mb-1">Internal Remarks</h4>
              <p className="text-xs text-gray-800 font-medium whitespace-pre-wrap">{driver.remarks || '—'}</p>
            </div>
          </div>

        </div>

        {/* Action button */}
        <div className="px-6 py-3 bg-gray-50 border-t border-gray-200 flex justify-end shrink-0">
          <button onClick={onClose}
            className="px-6 py-2 bg-gray-900 hover:bg-gray-850 text-white font-bold rounded-xl text-xs shadow transition-all">
            Close Panel
          </button>
        </div>

      </div>
    </div>
  );
};

export default MmDriverBank;
