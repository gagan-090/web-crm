import React, { useState } from 'react';
import type { DwLeadDetailResponse } from '../../services/api/webCrmApi';
import { leadRoleMeta } from '../../shared/hooks/useQueueCache';
import type { LeadRole } from '../../shared/hooks/useQueueCache';

type DetailData = DwLeadDetailResponse['data'];

interface CrossRoleLeadDetailProps {
  /** Any lead role a desk can work; everything but 'transporter' uses the
      person-shaped layout, labelled with the role's own name. */
  role: LeadRole;
  detail?: DetailData;
  loading?: boolean;
  accent?: string;               // hex accent for buttons/badges
  canCall?: boolean;
  onCall?: () => void;
  notesText?: string;            // optional external control; self-managed otherwise
  onNotesChange?: (val: string) => void;
  saveTimestamp?: string;
}

const fmtDateTime = (d?: string | null) =>
  d ? new Date(d.replace(' ', 'T')).toLocaleString() : '—';

const statusChip = (status: string) => {
  const s = (status || '').toLowerCase();
  if (s === 'connected') return 'bg-[#EAFAF1] text-[#27AE60]';
  if (s === 'callback_later') return 'bg-amber-50 text-amber-600';
  if (s === 'not_connected') return 'bg-red-50 text-red-500';
  return 'bg-gray-100 text-gray-500';
};

// Universal lead-detail panel used when a caller works a lead OUTSIDE their
// native desk (a DWC viewing a transporter, or a TWC viewing a driver). Both
// dw/wct leadDetail endpoints return the same superset shape, so this renders
// role-appropriate sections from whichever detail was fetched.
export const CrossRoleLeadDetail: React.FC<CrossRoleLeadDetailProps> = ({
  role,
  detail,
  loading,
  accent = '#FB641B',
  canCall = true,
  onCall,
  notesText,
  onNotesChange,
  saveTimestamp,
}) => {
  const [localNotes, setLocalNotes] = useState('');
  const notes = notesText ?? localNotes;
  const setNotes = onNotesChange ?? setLocalNotes;
  const p = detail?.profile;
  const plan = detail?.plan_card;
  const ivr = detail?.ivr_history || [];
  const postedJobs = detail?.posted_jobs || [];
  const appliedJobs = detail?.applied_jobs || [];
  const isTransporter = role === 'transporter';
  const roleLabel = leadRoleMeta[role]?.label ?? 'Lead';
  const completion = Math.max(0, Math.min(100, Number(p?.profile_completion ?? 0)));

  const location = [p?.city, p?.state].filter(Boolean).join(', ') || '—';
  const subscribed = !!plan?.has_plan;

  if (!p) {
    return (
      <div className="flex-1 flex items-center justify-center text-sm text-gray-400 italic">
        {loading ? 'Loading lead…' : 'Select a lead to view details.'}
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 shrink-0">
        <div className="flex items-start gap-3">
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white text-lg shrink-0" style={{ backgroundColor: accent }}>
            {(p.name || '?').slice(0, 1).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-lg font-bold text-gray-900 truncate">{p.name || 'Lead'}</h2>
              <span className="font-mono text-[11px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">{p.tmid}</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase" style={{ color: accent, borderColor: `${accent}55` }}>
                {roleLabel}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-0.5">{completion}% profile complete</div>
          </div>
        </div>
        <div className={`mt-3 flex items-center justify-between px-3 py-2 rounded-lg text-xs font-bold ${subscribed ? 'bg-[#EAFAF1] text-[#27AE60]' : 'bg-red-50 text-red-600'}`}>
          <span>{subscribed ? (plan?.plan_label || 'Subscribed') : 'NOT SUBSCRIBED'}</span>
          <span className="uppercase tracking-wide">{subscribed ? `₹${plan?.amount ?? 0}` : 'Conversion Pending'}</span>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
        {/* Profile */}
        <div className="border border-gray-200 rounded-xl p-3">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">{roleLabel} Profile</h3>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
            <Field label="Mobile" value={p.mobile} />
            <Field label="Location" value={location} />
            <Field label="Registered" value={p.registered_at ? new Date(p.registered_at.replace(' ', 'T')).toLocaleDateString() : '—'} />
            <Field label="Language" value={p.language || '—'} />
            {isTransporter ? (
              <>
                <Field label="Transport Name" value={p.transport_name || '—'} />
                <Field label="Fleet Size" value={p.fleet_size ? String(p.fleet_size).replace('_', '-') : '—'} />
                <Field label="Company Type" value={p.company_registration_type || '—'} />
                <Field label="PAN" value={p.pan_number || '—'} />
                <Field label="GST" value={p.gst_number || '—'} />
              </>
            ) : (
              <>
                <Field label="Vehicle" value={p.vehicle_type || '—'} />
                <Field label="Experience" value={p.experience || '—'} />
                <Field label="License Type" value={p.license_type || '—'} />
                <Field label="Email" value={p.email || '—'} />
              </>
            )}
          </div>
        </div>

        {/* Jobs */}
        {isTransporter ? (
          <div className="border border-gray-200 rounded-xl p-3">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">
              Posted Jobs <span className="text-gray-400 font-semibold">({detail?.jobs_posted_count ?? postedJobs.length} · {detail?.total_applicants ?? 0} applicants)</span>
            </h3>
            {postedJobs.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No jobs posted by this transporter yet.</p>
            ) : (
              <div className="space-y-1.5">
                {postedJobs.slice(0, 4).map((j) => (
                  <div key={j.job_id} className="flex justify-between text-xs">
                    <span className="text-gray-700 truncate">{j.title || 'Job'} <span className="text-gray-400">· {j.location || '—'}</span></span>
                    <span className="font-semibold text-gray-500 shrink-0">{j.applicants} applied</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          appliedJobs.length > 0 && (
            <div className="border border-gray-200 rounded-xl p-3">
              <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Applied Jobs ({appliedJobs.length})</h3>
              <div className="space-y-1.5">
                {appliedJobs.slice(0, 4).map((j: any, i: number) => (
                  <div key={i} className="flex justify-between text-xs">
                    <span className="text-gray-700 truncate">{j.job_title || 'Job'}</span>
                    <span className="text-gray-400 shrink-0">{j.transporter_name || ''}</span>
                  </div>
                ))}
              </div>
            </div>
          )
        )}

        {/* Call history */}
        <div className="border border-gray-200 rounded-xl p-3">
          <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Call History Timeline</h3>
          {ivr.length === 0 ? (
            <p className="text-xs text-gray-400 italic">No previous calls — first attempt.</p>
          ) : (
            <div className="space-y-2 max-h-52 overflow-y-auto">
              {ivr.slice(0, 8).map((h) => (
                <div key={h.id} className="text-xs border-l-2 pl-2" style={{ borderColor: `${accent}66` }}>
                  <div className="flex items-center justify-between">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${statusChip(h.call_status)}`}>{h.call_status || '—'}</span>
                    <span className="text-gray-400">{fmtDateTime(h.created_at)}</span>
                  </div>
                  {h.call_feedback && <div className="text-gray-700 mt-0.5">{h.call_feedback}</div>}
                  {h.call_remarks && <div className="text-gray-400 italic">{h.call_remarks}</div>}
                  {(h as any).recording_url && (
                    <audio controls src={(h as any).recording_url} className="h-7 mt-1 max-w-[180px]" />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Notes */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <h3 className="text-[11px] font-bold text-gray-500 uppercase tracking-wider">Conversation Notes</h3>
            {saveTimestamp && <span className="text-[10px] text-gray-400">{saveTimestamp}</span>}
          </div>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            placeholder="e.g. 'Owner will decide after checking with partner — follow up Thursday'"
            className="w-full border border-gray-200 rounded-lg p-2 text-xs outline-none focus:ring-1 resize-none"
            style={{ ['--tw-ring-color' as any]: accent }}
          />
        </div>
      </div>

      {/* Footer */}
      <div className="p-3 border-t border-gray-200 shrink-0">
        <button
          onClick={onCall}
          disabled={!canCall}
          className="w-full h-11 rounded-lg font-bold text-white text-sm flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 disabled:opacity-50"
          style={{ backgroundColor: accent }}
        >
          <span className="material-symbols-outlined text-[18px]">call</span> Call Now
        </button>
      </div>
    </div>
  );
};

const Field: React.FC<{ label: string; value?: string | null }> = ({ label, value }) => (
  <div>
    <span className="block text-[10px] text-gray-400 uppercase font-semibold">{label}</span>
    <span className="font-semibold text-gray-800 break-words">{value || '—'}</span>
  </div>
);

export default CrossRoleLeadDetail;
