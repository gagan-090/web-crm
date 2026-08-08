import React from 'react';
import { useGetMmDriverProfileQuery } from '../../services/api/webCrmApi';

// Driver images/documents are served from the TruckMitr public bucket (same
// base the mobile app uses). Relative paths get prefixed; full URLs pass through.
const IMG_BASE = 'https://truckmitr.com/public/';
const imgUrl = (p?: string | null): string | null => {
  if (!p) return null;
  if (p.startsWith('http://') || p.startsWith('https://')) return p;
  return IMG_BASE + p.replace(/^\/+/, '');
};

type Field = [string, string | number | null | undefined];

const Section: React.FC<{ title: string; color?: string; fields: Field[] }> = ({ title, color = '#8E44AD', fields }) => {
  const shown = fields.filter(([, v]) => v !== null && v !== undefined && String(v).trim() !== '' && String(v) !== '0');
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

const StatusPill: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => {
  if (!value) return null;
  const v = value.toLowerCase();
  const cls =
    v.includes('verif') || v === 'accepted' || v === 'completed' || v === 'success' || v === 'green' || v === 'pass'
      ? 'bg-green-50 text-green-700 border-green-200'
      : v.includes('reject') || v.includes('fail') || v === 'red'
      ? 'bg-red-50 text-red-600 border-red-200'
      : 'bg-amber-50 text-amber-700 border-amber-200';
  return (
    <div className="flex flex-col items-start gap-0.5">
      <span className="text-[9px] text-gray-400 uppercase font-bold">{label}</span>
      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border capitalize ${cls}`}>{value}</span>
    </div>
  );
};

// Prominent DL / Photo / PAN availability card with a thumbnail if present.
const DocCard: React.FC<{ label: string; available: boolean; imgPath?: string | null }> = ({ label, available, imgPath }) => {
  const url = imgUrl(imgPath);
  // "Available" means the users row HOLDS a path — not that the file survived.
  // Plenty of older records point at uploads that are no longer on the bucket,
  // and the request then falls through to the site's HTML, so the <img> renders
  // a broken-image icon and its alt text. Catch the failure and say so.
  const [broken, setBroken] = React.useState(false);
  React.useEffect(() => { setBroken(false); }, [url]);

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
            <img
              src={url}
              alt={label}
              onError={() => setBroken(true)}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              loading="lazy"
            />
          </div>
        </a>
      ) : url && broken ? (
        <div className="w-full h-24 rounded-lg border border-dashed border-amber-300 bg-amber-50/60 flex flex-col items-center justify-center gap-0.5 px-2 text-center">
          <span className="material-symbols-outlined text-amber-500 text-xl">broken_image</span>
          <span className="text-[9px] font-bold text-amber-700 leading-tight">File missing on server</span>
          <a href={url} target="_blank" rel="noreferrer" className="text-[8.5px] text-amber-600 underline break-all line-clamp-1">
            {imgPath}
          </a>
        </div>
      ) : (
        <div className="w-full h-24 rounded-lg border border-dashed border-gray-300 bg-white/60 flex items-center justify-center">
          <span className="material-symbols-outlined text-gray-300 text-2xl">{available ? 'image' : 'no_photography'}</span>
        </div>
      )}
    </div>
  );
};

interface Props {
  open: boolean;
  driverId: number;
  driverName: string;
  uniqueId: string;
  onClose: () => void;
}

export const DriverDetailsModal: React.FC<Props> = ({ open, driverId, driverName, uniqueId, onClose }) => {
  const { data, isLoading, isError, refetch } = useGetMmDriverProfileQuery(driverId, { skip: !open });

  if (!open) return null;

  const d = data?.data;
  const p = d?.profile || {};
  const a = d?.address || {};
  const dr = d?.driving || {};
  const emp = d?.employment || {};
  const doc = d?.documents;
  const avail = d?.documents_available;
  const dlv = d?.dl_verification;
  const panv = d?.pan_verification;
  const aad = d?.aadhaar_verification;
  const vs = d?.verification_summary;
  const sub = d?.subscription;
  const appliedJobs = d?.applied_jobs ?? [];
  const callTimeline = d?.call_timeline ?? [];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      <div className="relative bg-gray-50 rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center gap-3 shrink-0 bg-gradient-to-r from-[#8E44AD] to-[#7D3C98]">
          <span className="material-symbols-outlined text-white">badge</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-extrabold text-sm truncate">{driverName}</h2>
            <p className="text-white/80 text-[11px] truncate">{uniqueId} · Complete Driver Details</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
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
              <p className="text-xs mt-2 font-semibold">Could not load driver details</p>
              <button onClick={() => refetch()} className="mt-2 text-xs font-bold text-[#8E44AD] hover:underline">Retry</button>
            </div>
          ) : (
            <>
              {/* Prominent document availability */}
              <div className="grid grid-cols-3 gap-3">
                <DocCard label="Profile Photo" available={!!avail?.profile_image} imgPath={doc?.profile_image} />
                <DocCard label="Driving License" available={!!avail?.dl} imgPath={doc?.dl_front} />
                <DocCard label="PAN Card" available={!!avail?.pan} imgPath={doc?.pan_image} />
              </div>

              <Section title="Personal" fields={[
                ['TMID', p.unique_id], ['Name', p.name], ['English Name', p.name_eng],
                ["Father's Name", p.father_name], ['DOB', p.dob], ['Gender', p.sex],
                ['Marital Status', p.marital_status], ['Education', p.education],
                ['Email', p.email], ['Language', p.language],
                ['Category', p.sub_id], ['Role', p.role], ['Profile %', p.profile_completion],
                ['Registered', p.created_at],
              ]} />

              <Section title="Address" color="#1A5276" fields={[
                ['Address', a.address], ['City', a.city], ['State', a.state], ['Pincode', a.pincode],
                ['Preferred State', a.preferred_location], ['Routes', a.routes],
              ]} />

              <Section title="Driving & License" color="#059669" fields={[
                ['Vehicle Type', typeof dr.vehicle_type === 'string' ? dr.vehicle_type : undefined],
                ['Experience', dr.experience as string], ['License Type', dr.license_type as string],
                ['License Number', dr.license_number as string], ['License Expiry', dr.license_expiry as string],
                ['Endorsement', dr.license_endorsement as string],
              ]} />

              <Section title="Employment & Income" color="#B45309" fields={[
                ['Current Income', emp.current_income], ['Expected Income', emp.expected_income],
                ['Previous Employer', emp.previous_employer], ['Job Placement', emp.job_placement],
              ]} />

              <Section title="Document Numbers" color="#7C3AED" fields={[
                ['PAN Number', doc?.pan_number], ['Voter ID', doc?.voter_id],
              ]} />

              {(imgUrl(doc?.dl_back)) && (
                <div className="bg-white rounded-xl border border-gray-200 p-3.5">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2 text-[#7C3AED]">DL Back</p>
                  <a href={imgUrl(doc?.dl_back)!} target="_blank" rel="noreferrer" className="block w-40">
                    <img src={imgUrl(doc?.dl_back)!} alt="DL Back" className="w-full h-24 object-cover rounded-lg border border-gray-200" loading="lazy" />
                  </a>
                </div>
              )}

              {dlv && (
                <Section title="DL Verification" color="#0E7490" fields={[
                  ['DL Number', dlv.dl_number], ['Name', dlv.name], ['DOB', dlv.dob],
                  ['Father/Husband', dlv.father], ['Blood Group', dlv.blood_group],
                  ['Issued', dlv.issued_date], ['Expiry', dlv.expiry_date],
                  ['Address', dlv.address], ['State', dlv.state], ['District', dlv.district],
                  ['PIN', dlv.pin], ['Category', dlv.category], ['Status', dlv.status], ['Verified', dlv.verified_at],
                ]} />
              )}

              {panv && (
                <Section title="PAN Verification" color="#BE185D" fields={[
                  ['PAN', panv.pan], ['Name', panv.name], ['DOB', panv.dob], ['Gender', panv.gender],
                  ['Aadhaar No.', panv.aadhaar], ['Aadhaar Linked', panv.aadhaar_linked],
                  ['Email', panv.email], ['Address', panv.address],
                  ['State', panv.state], ['PIN', panv.pin_code], ['Category', panv.category], ['Verified', panv.verified_at],
                ]} />
              )}

              {aad && (
                <Section title="Aadhaar Verification" color="#4338CA" fields={[
                  ['Status', aad.status], ['Message', aad.message], ['Verified', aad.verified_at],
                ]} />
              )}

              {vs && (vs.id_status || vs.address_status || vs.court_status || vs.final_status) && (
                <div className="bg-white rounded-xl border border-gray-200 p-3.5">
                  <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2 text-[#8E44AD]">Background Verification</p>
                  <div className="flex flex-wrap gap-4">
                    <StatusPill label="ID Check" value={vs.id_status} />
                    <StatusPill label="Address" value={vs.address_status} />
                    <StatusPill label="Court" value={vs.court_status} />
                    <StatusPill label="Final" value={vs.final_status} />
                  </div>
                  {vs.notes && <p className="text-[11px] text-gray-500 mt-2">{vs.notes}</p>}
                  {vs.completed_at && <p className="text-[9px] text-gray-400 mt-0.5">Completed: {vs.completed_at}</p>}
                </div>
              )}

              {/* ── Subscription history ── */}
              {sub && (
                <div className="bg-white rounded-xl border border-gray-200 p-3.5">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-extrabold uppercase tracking-wider text-[#8E44AD]">Subscription</p>
                    <span className="text-[10px] font-extrabold px-2 py-0.5 rounded border bg-purple-50 text-[#7D3C98] border-purple-200">
                      {sub.current_label}
                    </span>
                  </div>
                  <div className="flex gap-5 mb-2">
                    <div>
                      <p className="text-lg font-extrabold text-gray-800">₹{sub.total_paid.toLocaleString()}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Total paid</p>
                    </div>
                    <div>
                      <p className="text-lg font-extrabold text-gray-800">{sub.payment_count}</p>
                      <p className="text-[9px] text-gray-400 font-bold uppercase">Payments</p>
                    </div>
                  </div>
                  {sub.payments.length === 0 ? (
                    <p className="text-[11px] text-gray-400 italic">No payments on record.</p>
                  ) : (
                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="text-gray-400 font-bold uppercase text-[9px] border-b border-gray-100">
                          <th className="py-1">Plan</th><th className="py-1">Amount</th>
                          <th className="py-1">Status</th><th className="py-1">Validity</th>
                          <th className="py-1 text-right">Paid on</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {sub.payments.map(p => (
                          <tr key={p.id}>
                            <td className="py-1 font-semibold text-gray-800">{p.plan_label || '—'}</td>
                            <td className="py-1 font-mono font-bold">₹{p.amount.toLocaleString()}</td>
                            <td className="py-1">
                              <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase ${
                                p.status === 'captured' ? 'bg-green-50 text-green-700' : 'bg-gray-100 text-gray-500'
                              }`}>{p.status}</span>
                            </td>
                            <td className="py-1 text-gray-500">{p.duration_months ? `${p.duration_months} mo` : '—'}</td>
                            <td className="py-1 text-right font-mono text-gray-500">
                              {p.paid_at ? new Date(p.paid_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}

              {/* ── Applied jobs ── */}
              <div className="bg-white rounded-xl border border-gray-200 p-3.5">
                <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2 text-[#8E44AD]">
                  Applied Jobs <span className="text-gray-400 font-bold">({appliedJobs.length})</span>
                </p>
                {appliedJobs.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic">This driver has not applied to any job.</p>
                ) : (
                  <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar">
                    {appliedJobs.map(j => (
                      <div key={j.application_id} className="border border-gray-100 rounded-lg p-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] font-bold text-black shrink-0">{j.job_ref || j.job_id}</span>
                          <span className="flex-1 min-w-0 font-bold text-gray-800 text-[11px] truncate" title={j.job_title || ''}>
                            {j.job_title || 'Untitled job'}
                          </span>
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase shrink-0 ${
                            j.status === 'accepted' ? 'bg-green-50 text-green-700'
                              : j.status === 'rejected' ? 'bg-red-50 text-red-600' : 'bg-amber-50 text-amber-700'
                          }`}>{j.status || 'pending'}</span>
                        </div>
                        <p className="text-[10px] text-gray-500 mt-0.5 truncate">
                          {[j.transporter_name, j.job_location, j.route, j.vehicle_type, j.salary && `₹${j.salary}`]
                            .filter(Boolean).join(' · ')}
                        </p>
                        <p className="text-[9px] text-gray-400">
                          Applied {j.applied_at ? new Date(j.applied_at).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—'}
                          {j.rejection_remark ? ` · ${j.rejection_remark}` : ''}
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Complete call timeline ── */}
              <div className="bg-white rounded-xl border border-gray-200 p-3.5">
                <p className="text-[10px] font-extrabold uppercase tracking-wider mb-2 text-[#8E44AD]">
                  Call Timeline <span className="text-gray-400 font-bold">({callTimeline.length})</span>
                </p>
                {callTimeline.length === 0 ? (
                  <p className="text-[11px] text-gray-400 italic">No calls logged for this driver.</p>
                ) : (
                  <div className="space-y-1.5 max-h-80 overflow-y-auto custom-scrollbar">
                    {callTimeline.map(c => (
                      <div key={c.id} className="border border-gray-100 rounded-lg p-2">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                            c.call_status === 'connected' ? 'bg-green-50 text-green-700 border-green-200'
                              : c.call_status === 'not_connected' ? 'bg-red-50 text-red-600 border-red-200'
                              : 'bg-amber-50 text-amber-700 border-amber-200'
                          }`}>{(c.call_status || 'pending').replace(/_/g, ' ')}</span>
                          {c.disposition_sub && (
                            <span className="text-[9px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">
                              {c.disposition_sub.replace(/[_-]+/g, ' ').replace(/\b\w/g, m => m.toUpperCase())}
                            </span>
                          )}
                          {c.match_status && (
                            <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.5 rounded">{c.match_status}</span>
                          )}
                          {c.job_id && (
                            <span className="text-[9px] font-mono font-bold text-black bg-gray-100 px-1.5 py-0.5 rounded">{c.job_id}</span>
                          )}
                          {c.transporter_name && (
                            <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">{c.transporter_name}</span>
                          )}
                          <span className="ml-auto text-[9px] text-gray-400 font-mono">
                            {new Date(c.called_at).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        {c.feedback && <p className="text-[11px] text-gray-700 font-semibold mt-0.5">{c.feedback}</p>}
                        {c.remarks && <p className="text-[10px] text-gray-400">{c.remarks}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[9px] text-gray-400">
                            {c.called_by ? `by ${c.called_by}` : ''}
                            {c.process ? ` · ${c.process}` : ''}
                            {c.duration_seconds ? ` · ${c.duration_seconds}s` : ''}
                          </span>
                          {c.recording_url && (
                            <audio src={c.recording_url} controls preload="none" className="h-6 max-w-[170px] ml-auto" />
                          )}
                        </div>
                      </div>
                    ))}
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

export default DriverDetailsModal;
