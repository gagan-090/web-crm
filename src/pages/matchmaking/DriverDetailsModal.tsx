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
  return (
    <div className={`rounded-xl border p-2.5 flex flex-col ${available ? 'border-green-200 bg-green-50/40' : 'border-red-200 bg-red-50/30'}`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[11px] font-extrabold text-gray-800">{label}</span>
        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5 ${available ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>
          <span className="material-symbols-outlined text-[12px]">{available ? 'check_circle' : 'cancel'}</span>
          {available ? 'Available' : 'Not Available'}
        </span>
      </div>
      {url ? (
        <a href={url} target="_blank" rel="noreferrer" className="block group flex-1">
          <div className="w-full h-24 rounded-lg border border-gray-200 overflow-hidden bg-white">
            <img src={url} alt={label} className="w-full h-full object-cover group-hover:scale-105 transition-transform" loading="lazy" />
          </div>
        </a>
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
                ['Preferred Location', a.preferred_location], ['Routes', a.routes],
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
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverDetailsModal;
