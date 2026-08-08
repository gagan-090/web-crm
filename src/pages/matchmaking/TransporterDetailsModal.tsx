import React, { useMemo, useState } from 'react';
import { useGetMmTransporterProfileQuery } from '../../services/api/webCrmApi';
import type { MmCallTimelineEntry } from '../../services/api/webCrmApi';

// Same public bucket the driver modal and the mobile app read from.
const IMG_BASE = 'https://truckmitr.com/public/';
const imgUrl = (p?: string | null): string | null => {
  if (!p) return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return IMG_BASE + p.replace(/^\/+/, '');
};

type Field = [string, string | number | null | undefined];

/** Empty fields are dropped rather than rendered as "—", so a thin record reads
 *  as a short card instead of a wall of dashes. */
const Section: React.FC<{ title: string; color?: string; fields: Field[] }> = ({ title, color = '#8E44AD', fields }) => {
  const shown = fields.filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '');
  if (shown.length === 0) return null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-3.5">
      <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2.5" style={{ color }}>{title}</p>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2.5">
        {shown.map(([label, val]) => (
          <div key={label} className="min-w-0">
            <p className="text-[9px] text-gray-400 uppercase font-bold leading-tight">{label}</p>
            <p className="text-[12px] font-semibold text-gray-800 break-words">{String(val)}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const DocCard: React.FC<{ label: string; imgPath?: string | null }> = ({ label, imgPath }) => {
  const url = imgUrl(imgPath);
  // A stored path is not a surviving file — see the note in DriverDetailsModal.
  const [broken, setBroken] = React.useState(false);
  React.useEffect(() => { setBroken(false); }, [url]);
  const available = !!url;
  return (
    <div className={`rounded-xl border p-2.5 flex flex-col ${available ? 'border-green-200 bg-green-50/40' : 'border-red-200 bg-red-50/30'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-extrabold text-gray-800">{label}</span>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          <span className="material-symbols-outlined text-[12px]">{available ? 'check_circle' : 'cancel'}</span>
          {available ? 'Available' : 'Not Available'}
        </span>
      </div>
      {url && !broken ? (
        <a href={url} target="_blank" rel="noreferrer" className="block group flex-1">
          <div className="w-full h-24 rounded-lg border border-gray-200 overflow-hidden bg-white">
            <img src={url} alt={label} onError={() => setBroken(true)} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
          </div>
        </a>
      ) : (
        <div className="w-full h-24 rounded-lg border border-dashed border-gray-300 bg-white/60 flex items-center justify-center">
          <span className="material-symbols-outlined text-gray-300 text-2xl">no_photography</span>
        </div>
      )}
    </div>
  );
};

const statusChip = (s: string | null) =>
  s === 'connected' ? 'bg-green-50 text-green-700 border-green-200'
    : s === 'not_connected' ? 'bg-red-50 text-red-600 border-red-200'
    : 'bg-amber-50 text-amber-700 border-amber-200';

const fmtDuration = (secs: number) => {
  if (!secs) return null;
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}m ${s}s` : `${s}s`;
};

const fmtDateTime = (v: string) =>
  new Date(String(v).replace(' ', 'T')).toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit',
  });

/** One call in the timeline. Remarks render in full — never truncated — since
 *  reading what the last agent actually wrote is the point of the timeline. */
const CallEntry: React.FC<{ c: MmCallTimelineEntry }> = ({ c }) => (
  <div className="border border-gray-100 rounded-lg p-2">
    <div className="flex items-center gap-1.5 flex-wrap">
      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${statusChip(c.call_status)}`}>
        {(c.call_status || 'pending').replace(/_/g, ' ')}
      </span>
      <span
        className={`text-[9px] font-bold px-1.5 py-0.5 rounded flex items-center gap-0.5 ${
          c.direction === 'incoming' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
        }`}
        title={c.direction === 'incoming' ? 'Transporter called in' : 'Agent dialled out'}
      >
        <span className="material-symbols-outlined text-[11px]">
          {c.direction === 'incoming' ? 'call_received' : 'call_made'}
        </span>
        {c.direction === 'incoming' ? 'IN' : 'OUT'}
      </span>
      {c.disposition_sub && (
        <span className="text-[9px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
          {c.disposition_sub.replace(/[_-]+/g, ' ').replace(/\b\w/g, m => m.toUpperCase())}
        </span>
      )}
      {c.match_status && (
        <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">{c.match_status}</span>
      )}
      {c.job_id && (
        <span className="text-[9px] font-mono font-bold text-black bg-gray-100 px-1.5 py-0.5 rounded" title={c.job_title || ''}>
          {c.job_id}
        </span>
      )}
      <span className="ml-auto text-[9px] text-gray-400 font-mono shrink-0">{fmtDateTime(c.called_at)}</span>
    </div>

    {c.feedback && <p className="text-[11px] text-gray-800 font-semibold mt-1">{c.feedback}</p>}
    {c.remarks ? (
      <p className="text-[10.5px] text-gray-600 mt-0.5 whitespace-pre-wrap break-words leading-relaxed">{c.remarks}</p>
    ) : (
      <p className="text-[10px] text-gray-300 italic mt-0.5">No remarks recorded</p>
    )}

    <div className="flex items-center gap-2 mt-1.5">
      <span className="text-[9px] text-gray-400 min-w-0 truncate">
        {[
          c.called_by ? `by ${c.called_by}` : null,
          c.process,
          fmtDuration(c.duration_seconds),
          c.callback_at ? `callback ${fmtDateTime(c.callback_at)}` : null,
        ].filter(Boolean).join(' · ')}
      </span>
      {c.recording_url && (
        <audio src={c.recording_url} controls preload="none" className="h-6 max-w-[170px] ml-auto shrink-0" />
      )}
    </div>
  </div>
);

interface Props {
  open: boolean;
  transporterId: number;
  transporterName?: string;
  uniqueId?: string;
  onClose: () => void;
}

export const TransporterDetailsModal: React.FC<Props> = ({
  open, transporterId, transporterName, uniqueId, onClose,
}) => {
  const { data, isLoading, isError, refetch } = useGetMmTransporterProfileQuery(transporterId, {
    skip: !open || !transporterId,
  });
  const [callFilter, setCallFilter] = useState<'all' | 'connected' | 'with_remarks'>('all');

  const d = data?.data;
  const timeline = d?.call_timeline ?? [];

  const shownCalls = useMemo(() => {
    if (callFilter === 'connected') return timeline.filter(c => c.call_status === 'connected');
    if (callFilter === 'with_remarks') return timeline.filter(c => !!c.remarks && c.remarks.trim() !== '');
    return timeline;
  }, [timeline, callFilter]);

  if (!open) return null;

  const p = d?.profile ?? {};
  const a = d?.address ?? {};
  const b = d?.business ?? {};
  const doc = d?.documents;
  const sub = d?.subscription;
  const jobs = d?.jobs;
  const summary = d?.call_summary;

  const headerName = String(b.transport_name || p.name || transporterName || 'Transporter');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center gap-3 shrink-0 bg-gradient-to-r from-[#8E44AD] to-[#7D3C98]">
          <span className="material-symbols-outlined text-white">local_shipping</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-extrabold text-sm truncate">{headerName}</h2>
            <p className="text-white/80 text-[11px] truncate">
              {String(p.unique_id || uniqueId || '')} · Complete Transporter Details
            </p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white" title="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-white rounded-xl border border-gray-200 animate-pulse" />)}
            </div>
          ) : isError || !d ? (
            <div className="py-16 text-center text-gray-400">
              <span className="material-symbols-outlined text-4xl">error</span>
              <p className="text-xs mt-2 font-semibold">Could not load transporter details</p>
              <button onClick={() => refetch()} className="mt-2 text-xs font-bold text-[#8E44AD] hover:underline">Retry</button>
            </div>
          ) : (
            <>
              {/* At-a-glance counters */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {[
                  { label: 'Jobs Posted', value: jobs?.total ?? 0, cls: 'text-[#8E44AD]' },
                  { label: 'Open Jobs', value: jobs?.open ?? 0, cls: 'text-emerald-600' },
                  { label: 'Total Applicants', value: jobs?.applicants ?? 0, cls: 'text-blue-600' },
                  {
                    label: 'Calls Logged',
                    value: summary?.total ?? 0,
                    cls: 'text-amber-600',
                    sub: summary?.connected ? `${summary.connected} connected` : undefined,
                  },
                ].map(s => (
                  <div key={s.label} className="bg-white border border-gray-200 rounded-xl p-2.5">
                    <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{s.label}</p>
                    <p className={`text-lg font-extrabold ${s.cls}`}>{s.value.toLocaleString('en-IN')}</p>
                    {s.sub && <p className="text-[9px] text-gray-400">{s.sub}</p>}
                  </div>
                ))}
              </div>

              {/* Subscription banner */}
              {sub && (
                <div className={`rounded-xl border p-3 flex items-center justify-between ${
                  sub.current_amount > 0
                    ? 'bg-green-50 border-green-200 text-green-700'
                    : 'bg-gray-50 border-gray-200 text-gray-500'
                }`}>
                  <span className="text-[11px] font-extrabold">
                    {sub.current_amount > 0 ? `SUBSCRIBED — ${sub.current_label}` : 'NOT SUBSCRIBED'}
                  </span>
                  <span className="text-[10px] font-bold">
                    ₹{(sub.total_paid || 0).toLocaleString('en-IN')} lifetime · {sub.payment_count || 0} payment{sub.payment_count === 1 ? '' : 's'}
                  </span>
                </div>
              )}

              <div className="grid grid-cols-3 gap-3">
                <DocCard label="Profile Photo" imgPath={doc?.profile_image} />
                <DocCard label="PAN Card" imgPath={doc?.pan_image} />
                <DocCard label="GST Certificate" imgPath={doc?.gst_certificate} />
              </div>

              <Section title="Contact & Identity" fields={[
                ['TMID', p.unique_id], ['Name', p.name], ['English Name', p.name_eng],
                ['Mobile', p.mobile], ['Email', p.email],
                ["Father's Name", p.father_name], ['DOB', p.dob], ['Gender', p.sex],
                ['Marital Status', p.marital_status], ['Education', p.education],
                ['Language', p.language], ['Category', p.sub_id], ['Role', p.role],
                ['Profile %', p.profile_completion], ['Status', p.status],
                ['Registered', p.registered_at], ['Last Updated', p.updated_at],
              ]} />

              <Section title="Business & Fleet" color="#B45309" fields={[
                ['Transport Name', b.transport_name], ['Fleet Size', b.fleet_size],
                ['Year of Establishment', b.year_of_establishment], ['Registered ID', b.registered_id],
                ['Company Type', b.company_registration_type], ['Operational Segment', b.operational_segment],
                ['Average KM', b.average_km], ['Truck Ownership', b.truck_ownership],
                ['Verified Trucker/Shipper', b.verified_trucker_shipper],
                ['Driver Pool Size', b.driver_poll_size], ['Vehicle Type', b.vehicle_type],
                ['POC Name', b.name_poc], ['POC Phone', b.phone_poc],
              ]} />

              <Section title="KYC & Referral" color="#7C3AED" fields={[
                ['GST Number', b.gst_number], ['PAN Number', b.pan_number],
                ['Voter ID', doc?.voter_id],
                ['Referral Code', b.referral_code], ['Referred By', b.referral_by],
                ['Paid Referrals', b.paid_referral_count],
              ]} />

              <Section title="Address & Coverage" color="#1A5276" fields={[
                ['Address', a.address], ['City', a.city], ['State', a.state], ['Pincode', a.pincode],
                ['Office Address', a.office_address], ['Operating States', a.operating_states],
                ['Coverage Area', a.coverage_area],
                ['Preferred Location', a.preferred_location], ['Routes', a.routes],
              ]} />

              {/* ── Payments ── */}
              {!!sub?.payments?.length && (
                <div className="bg-white rounded-xl border border-gray-200 p-3.5">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2 text-[#059669]">
                    Payments <span className="text-gray-400 font-bold">({sub.payments.length})</span>
                  </p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-[11px]">
                      <thead>
                        <tr className="text-gray-400 uppercase text-[9px] font-bold border-b border-gray-100">
                          <th className="py-1 text-left">Plan</th>
                          <th className="py-1 text-right">Amount</th>
                          <th className="py-1 text-left pl-3">Status</th>
                          <th className="py-1 text-left">Term</th>
                          <th className="py-1 text-right">Paid</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sub.payments.map(pay => (
                          <tr key={pay.id} className="border-b border-gray-50 last:border-0">
                            <td className="py-1 font-semibold text-gray-700">{pay.plan_label || pay.plan_name || '—'}</td>
                            <td className="py-1 text-right font-mono font-bold text-gray-800">₹{(pay.amount || 0).toLocaleString('en-IN')}</td>
                            <td className="py-1 pl-3">
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                                pay.status === 'captured' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                              }`}>{pay.status}</span>
                            </td>
                            <td className="py-1 text-gray-500">{pay.duration_months ? `${pay.duration_months} mo` : '—'}</td>
                            <td className="py-1 text-right font-mono text-gray-500">
                              {pay.paid_at ? new Date(pay.paid_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ── Jobs posted ── */}
              <div className="bg-white rounded-xl border border-gray-200 p-3.5">
                <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2 text-[#8E44AD]">
                  Jobs Posted <span className="text-gray-400 font-bold">({jobs?.list?.length ?? 0}{(jobs?.total ?? 0) > (jobs?.list?.length ?? 0) ? ` of ${jobs?.total}` : ''})</span>
                </p>
                {!jobs?.list?.length ? (
                  <p className="text-[11px] text-gray-400 italic">This transporter has not posted any job.</p>
                ) : (
                  <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                    {jobs.list.map(j => (
                      <div key={j.id} className="border border-gray-100 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-black shrink-0">{j.job_id}</span>
                          <span className="flex-1 min-w-0 font-bold text-gray-800 text-[11px] truncate" title={j.job_title || ''}>
                            {j.job_title || 'Untitled job'}
                          </span>
                          <span className="text-[9px] font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
                            {j.applicants_count} appl.
                          </span>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                            j.is_closed ? 'bg-gray-100 text-gray-500' : 'bg-green-50 text-green-700'
                          }`}>{j.is_closed ? 'Closed' : 'Open'}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                          {[j.job_location, j.route, j.vehicle_type, j.license_type, j.salary && `₹${j.salary}`]
                            .filter(Boolean).join(' · ') || '—'}
                        </p>
                        <p className="text-[9px] text-gray-400">
                          Posted {j.created_at ? new Date(j.created_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          {j.deadline ? ` · deadline ${j.deadline}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Complete call timeline ── */}
              <div className="bg-white rounded-xl border border-gray-200 p-3.5">
                <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8E44AD]">
                    Call Timeline <span className="text-gray-400 font-bold">({timeline.length})</span>
                  </p>
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    {([
                      { v: 'all', l: `All (${timeline.length})` },
                      { v: 'connected', l: `Connected (${summary?.connected ?? 0})` },
                      { v: 'with_remarks', l: `With Remarks (${timeline.filter(c => !!c.remarks && c.remarks.trim() !== '').length})` },
                    ] as const).map(f => (
                      <button
                        key={f.v}
                        onClick={() => setCallFilter(f.v)}
                        className={`px-2 py-0.5 rounded-md font-bold text-[9px] transition-colors ${
                          callFilter === f.v ? 'bg-[#8E44AD] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'
                        }`}
                      >
                        {f.l}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Every desk's calls, not just this agent's — knowing what DWC or
                    another MM caller already promised matters before dialling. */}
                {shownCalls.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic">
                    {timeline.length === 0 ? 'No calls logged for this transporter.' : 'No calls match this filter.'}
                  </p>
                ) : (
                  <div className="space-y-1.5 max-h-[26rem] overflow-y-auto custom-scrollbar">
                    {shownCalls.map(c => <CallEntry key={c.id} c={c} />)}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TransporterDetailsModal;
