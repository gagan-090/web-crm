import React, { useState } from 'react';
import { useLazyLookupManualCallQuery, useStoreManualCallMutation } from '../../services/api/webCrmApi';

/**
 * Manual call logger — agents log off-system calls (incoming toll-free /
 * WhatsApp taken on their own phone) into call_history_ivr, with the phone
 * recording uploaded. Enter the mobile → look the person up → set the date/time
 * the call happened → upload the recording (its length is the talk time, and
 * the call end = start + that length) → pick the outcome → save.
 */

const todayStr = () => new Date().toISOString().slice(0, 10);
const nowTime = () => new Date().toTimeString().slice(0, 5);
const fmtDur = (s: number) => (s ? `${Math.floor(s / 60)}m ${s % 60}s` : '—');

const ManualCallUpload: React.FC = () => {
  const [mobile, setMobile] = useState('');
  const [callDate, setCallDate] = useState(todayStr());
  const [callTime, setCallTime] = useState(nowTime());
  const [channel, setChannel] = useState<'toll_free' | 'whatsapp'>('toll_free');
  const [status, setStatus] = useState<'connected' | 'not_connected' | 'callback_later'>('connected');
  const [feedback, setFeedback] = useState('');
  const [remarks, setRemarks] = useState('');
  const [recording, setRecording] = useState<File | null>(null);
  const [duration, setDuration] = useState(0);
  const [callEndTime, setCallEndTime] = useState(''); // WhatsApp: agent enters end time
  const [toast, setToast] = useState<{ ok: boolean; msg: string } | null>(null);

  const [lookup, { data: lookupData, isFetching: looking }] = useLazyLookupManualCallQuery();
  const [store, { isLoading: saving }] = useStoreManualCallMutation();
  const found = lookupData?.found ? lookupData.user : null;

  const flash = (ok: boolean, msg: string) => { setToast({ ok, msg }); setTimeout(() => setToast(null), 4000); };

  const onSearch = () => { if (mobile.trim()) lookup(mobile.trim()); };

  const onFile = (f: File | null) => {
    setRecording(f);
    setDuration(0);
    if (!f) return;
    const url = URL.createObjectURL(f);
    const a = document.createElement('audio');
    a.preload = 'metadata';
    a.onloadedmetadata = () => { setDuration(Math.round(a.duration || 0)); URL.revokeObjectURL(url); };
    a.onerror = () => { setDuration(0); URL.revokeObjectURL(url); };
    a.src = url;
  };

  // WhatsApp calls usually have no recording, so the agent enters the end time
  // and the talk time is derived from it. Toll-free uses the recording length.
  const durFromEnd = (() => {
    if (channel !== 'whatsapp' || !callEndTime) return null;
    try {
      const s = new Date(`${callDate}T${callTime}`).getTime();
      const e = new Date(`${callDate}T${callEndTime}`).getTime();
      if (isNaN(s) || isNaN(e)) return null;
      let d = Math.round((e - s) / 1000);
      if (d < 0) d += 86400; // crossed midnight
      return Math.max(0, d);
    } catch { return null; }
  })();
  const effectiveDuration = durFromEnd != null ? durFromEnd : duration;

  const endTime = (() => {
    try {
      const start = new Date(`${callDate}T${callTime}`);
      if (isNaN(start.getTime())) return '—';
      return new Date(start.getTime() + effectiveDuration * 1000).toLocaleString();
    } catch { return '—'; }
  })();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobile.trim()) { flash(false, 'Enter the caller mobile number.'); return; }
    if (!callDate || !callTime) { flash(false, 'Enter the call date and time.'); return; }
    const fd = new FormData();
    fd.append('mobile', mobile.trim());
    fd.append('call_date', callDate);
    fd.append('call_time', callTime);
    fd.append('channel', channel);
    fd.append('call_status', status);
    if (feedback) fd.append('call_feedback', feedback);
    if (remarks) fd.append('call_remarks', remarks);
    fd.append('duration_seconds', String(effectiveDuration || 0));
    if (channel === 'whatsapp' && callEndTime) fd.append('call_end_time', callEndTime);
    if (recording) fd.append('recording', recording);
    try {
      const res: any = await store(fd).unwrap();
      flash(true, `Call logged ✓ (id ${res?.data?.call_id ?? ''}${res?.data?.user_id ? ', linked to user' : ', logged against number'})`);
      // Reset the per-call fields, keep the agent's defaults.
      setMobile(''); setFeedback(''); setRemarks(''); setRecording(null); setDuration(0); setCallEndTime('');
    } catch (err: any) {
      const firstErr = (Object.values(err?.data?.errors || {})[0] as any)?.[0];
      const msg = err?.data?.message || firstErr || 'Could not save the call.';
      flash(false, msg);
    }
  };

  const input = 'w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-indigo-400';
  const label = 'block text-[11px] font-bold text-gray-500 uppercase tracking-wide mb-1';

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {toast && (
        <div className={`fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-lg shadow-lg text-sm font-semibold ${toast.ok ? 'bg-emerald-600 text-white' : 'bg-red-600 text-white'}`}>
          {toast.msg}
        </div>
      )}

      <div className="mb-4">
        <h1 className="text-lg font-black text-gray-900 flex items-center gap-2">
          <span className="material-symbols-outlined text-indigo-600">upload_file</span>
          Upload Off-System Call
        </h1>
        <p className="text-xs text-gray-500 mt-0.5">Log an incoming toll-free or WhatsApp call taken on your own phone, with its recording. Saved to your call history.</p>
      </div>

      <form onSubmit={submit} className="bg-white border border-gray-200 rounded-xl p-5 space-y-4 shadow-sm">
        {/* Mobile + lookup */}
        <div>
          <label className={label}>Caller mobile</label>
          <div className="flex gap-2">
            <input value={mobile} onChange={e => setMobile(e.target.value)} placeholder="10-digit mobile" className={input} inputMode="numeric" />
            <button type="button" onClick={onSearch} disabled={looking} className="shrink-0 px-4 rounded-lg bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 disabled:opacity-50">
              {looking ? 'Searching…' : 'Search'}
            </button>
          </div>
          {lookupData && (
            found ? (
              <div className="mt-2 text-xs bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 text-emerald-800">
                <span className="font-bold">{found.name || 'User'}</span> · {found.tmid || '—'} · <span className="uppercase">{found.role}</span>{found.city ? ` · ${found.city}` : ''}
              </div>
            ) : (
              <div className="mt-2 text-xs bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-amber-800">
                Not registered — the call will be logged against this number.
              </div>
            )
          )}
        </div>

        {/* Date / time / channel */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div><label className={label}>Call date</label><input type="date" value={callDate} onChange={e => setCallDate(e.target.value)} className={input} /></div>
          <div><label className={label}>Call time</label><input type="time" value={callTime} onChange={e => setCallTime(e.target.value)} className={input} /></div>
          <div>
            <label className={label}>Channel</label>
            <select value={channel} onChange={e => setChannel(e.target.value as any)} className={input}>
              <option value="toll_free">Toll-Free (incoming)</option>
              <option value="whatsapp">WhatsApp call</option>
            </select>
          </div>
        </div>

        {/* WhatsApp calls usually have no recording, so the agent gives the end
            time here and talk time is derived from it. */}
        {channel === 'whatsapp' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className={label}>Call end time</label>
              <input type="time" value={callEndTime} onChange={e => setCallEndTime(e.target.value)} className={input} />
            </div>
            <div className="flex items-end">
              <p className="text-xs text-gray-500 pb-2">
                {callEndTime
                  ? <>Talk time <span className="font-bold text-gray-800">{fmtDur(effectiveDuration)}</span> · ends <span className="font-bold text-gray-800">{endTime}</span></>
                  : 'Optional — enter to record talk time & end.'}
              </p>
            </div>
          </div>
        )}

        {/* Outcome */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className={label}>Outcome</label>
            <select value={status} onChange={e => setStatus(e.target.value as any)} className={input}>
              <option value="connected">Connected</option>
              <option value="not_connected">Not Connected</option>
              <option value="callback_later">Callback Later</option>
            </select>
          </div>
          <div><label className={label}>Feedback (optional)</label><input value={feedback} onChange={e => setFeedback(e.target.value)} placeholder="e.g. Interested — needs load" className={input} /></div>
        </div>

        <div>
          <label className={label}>Remarks (optional)</label>
          <textarea value={remarks} onChange={e => setRemarks(e.target.value)} rows={2} placeholder="What was discussed…" className={`${input} resize-none`} />
        </div>

        {/* Recording — optional (WhatsApp calls often have none). */}
        <div>
          <label className={label}>Recording (audio) — optional</label>
          <input type="file" accept="audio/*" onChange={e => onFile(e.target.files?.[0] ?? null)}
            className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100" />
          {recording && (
            <div className="mt-2 text-xs text-gray-600 flex flex-wrap gap-x-4 gap-y-1">
              <span>Length (talk time): <span className="font-bold text-gray-800">{fmtDur(duration)}</span></span>
              <span>Call ends at: <span className="font-bold text-gray-800">{endTime}</span></span>
            </div>
          )}
        </div>

        <div className="pt-2 flex items-center justify-end gap-3">
          <button type="submit" disabled={saving} className="px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-black hover:bg-emerald-700 disabled:opacity-50 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[18px]">save</span>{saving ? 'Saving…' : 'Log Call'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ManualCallUpload;
