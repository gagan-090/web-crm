import React, { useState, useEffect } from 'react';
import {
  useGetDriverBankQuery,
  useGetDriverBankDetailQuery,
  useAddDriverBankMutation,
  useUpdateDriverBankMutation,
  useDeleteDriverBankMutation,
  useLazySearchDriverBankUserQuery,
  useGetMmJobListingsQuery,
} from '../../services/api/webCrmApi';
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
const availLbl = (v: string) => AVAIL_OPTIONS.find(o => o.value === v)?.label ?? v;

// ── JobIdPicker ───────────────────────────────────────────────────────────────
const JobIdPicker: React.FC<{ value: string; onChange: (v: string) => void }> = ({ value, onChange }) => {
  const [q, setQ]       = useState(value);
  const [open, setOpen] = useState(false);

  const { data: regData } = useGetMmJobListingsQuery({ type: 'regular',   section: 'active', status: 'open', limit: 100 });
  const { data: glData  } = useGetMmJobListingsQuery({ type: 'greenline', section: 'active', status: 'open', limit: 100 });

  const regJobs = regData?.success && Array.isArray(regData?.data?.jobs) ? regData.data.jobs : [];
  const glJobs  = glData?.success && Array.isArray(glData?.data?.jobs) ? glData.data.jobs : [];
  const allJobs = [...regJobs, ...glJobs];
  const filtered = allJobs.filter(j =>
    !q || j.job_id?.toLowerCase().includes(q.toLowerCase()) || j.job_title?.toLowerCase().includes(q.toLowerCase())
  );

  return (
    <div className="relative">
      <input
        value={q}
        onChange={e => { setQ(e.target.value); onChange(''); setOpen(true); }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 180)}
        placeholder="Type to search open jobs..."
        className="w-full border border-gray-400 px-2 py-1.5 text-xs outline-none focus:border-gray-600 bg-white"
      />
      {value && !open && (
        <span className="absolute right-2 top-1.5 text-[10px] text-gray-600 font-semibold">✓ {value}</span>
      )}
      {open && (
        <div className="absolute z-20 w-full bg-white border border-gray-400 shadow-lg mt-0 max-h-44 overflow-y-auto">
          {filtered.length === 0 ? (
            <p className="px-3 py-2 text-[10px] text-gray-400 italic">No open jobs found</p>
          ) : filtered.slice(0, 40).map(j => (
            <button type="button" key={j.job_id}
              onMouseDown={() => { onChange(j.job_id); setQ(j.job_id); setOpen(false); }}
              className="w-full text-left px-3 py-2 hover:bg-gray-100 border-b border-gray-200 last:border-0 flex items-center gap-2">
              <span className="font-bold text-gray-900 font-mono text-[10px]">{j.job_id}</span>
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
      per_page: 30, cursor: cursor ?? undefined },
    { refetchOnMountOrArgChange: true }
  );

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
  useEffect(() => { setCursor(null); }, [search, availFilter, jobFilter]);

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

          <input value={jobFilter} onChange={e => setJobFilter(e.target.value)}
            placeholder="Filter by Job ID..."
            className="border border-gray-200 rounded-lg px-2 py-1.5 bg-white outline-none text-gray-700 text-[10px] font-semibold w-36" />

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

      {/* Table */}
      <div className="flex-1 overflow-auto custom-scrollbar">
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
          <table className="w-full border-collapse min-w-[1000px]">
            <thead className="bg-gray-100 sticky top-0 z-10">
              <tr>
                {['#','Driver','Mobile','TMID','Job ID','Location','Vehicle / Lic.','Exp.','Status','Feedback','Added By','Actions'].map(h => (
                  <th key={h} className="text-left py-2 px-3 text-[10px] font-extrabold text-gray-500 uppercase tracking-wide border-b border-gray-200 whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {allRows.map((row: any, i: number) => (
                <tr key={row.id} className={`border-b border-gray-100 hover:bg-purple-50/30 ${i % 2 ? 'bg-gray-50/50' : 'bg-white'}`}>
                  <td className="py-2 px-3 font-mono text-[10px] text-gray-400">{row.id}</td>
                  <td className="py-2 px-3">
                    <div className="font-bold text-gray-850">{row.name}</div>
                    {row.remarks && <div className="text-[9px] text-gray-400 truncate max-w-[120px]" title={row.remarks}>{row.remarks}</div>}
                  </td>
                  <td className="py-2 px-3 font-mono text-[10px]">**********</td>
                  <td className="py-2 px-3 font-mono text-[10px] text-gray-500">{row.tmid || '—'}</td>
                  <td className="py-2 px-3 font-mono text-[10px] text-[#8E44AD]">{row.job_id || '—'}</td>
                  <td className="py-2 px-3 text-[10px] text-gray-600">{row.location || '—'}</td>
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
                  <td className="py-2 px-3 text-[10px] text-gray-600 max-w-[100px]">
                    <span className="truncate block" title={row.feedback}>{row.feedback || '—'}</span>
                  </td>
                  <td className="py-2 px-3">
                    <div className="text-[10px] font-semibold">{row.added_by_name || row.added_by_admin_name || '—'}</div>
                    {row.added_by_role && <div className="text-[9px] text-gray-400 uppercase">{row.added_by_role}</div>}
                  </td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5 whitespace-nowrap">
                      <button title="Call" onClick={() => triggerCall(row.name, row.mobile, 'Driver Bank', row.tmid || 'DR')}
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
              ))}
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

  const { driver, applications = [], subscription } = data.data;

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
                <button onClick={() => triggerCall(driver.name, driver.mobile, 'Driver Bank', driver.tmid || 'DR')}
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
