import React, { useState } from 'react';
import { useGetWctJobsQuery, useGetWctJobApplicantsQuery } from '../../services/api/webCrmApi';
import type { WctApplicantCall } from '../../services/api/webCrmApi';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';

// Plan badge colour by transporter plan type.
const planBadge = (type: string) => {
  if (type === 'super_premium_job') return 'bg-purple-100 text-purple-700 border-purple-200';
  if (type === 'premium_job') return 'bg-[#EAFAF1] text-[#27AE60] border-[#27AE60]/20';
  if (type === 'standard') return 'bg-blue-50 text-blue-600 border-blue-200';
  return 'bg-gray-100 text-gray-500 border-gray-200';
};

const fmtDate = (d?: string | null) => (d ? new Date(d.replace(' ', 'T')).toLocaleDateString() : '—');

const fmtDateTime = (d?: string | null) =>
  d
    ? new Date(d.replace(' ', 'T')).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: '2-digit', hour: '2-digit', minute: '2-digit',
      })
    : '—';

const fmtDuration = (s?: number | null) => {
  const secs = Number(s || 0);
  if (secs <= 0) return null;
  return secs < 60 ? `${secs}s` : `${Math.floor(secs / 60)}m ${secs % 60}s`;
};

const statusPill = (s?: string | null) => {
  const v = (s || '').toLowerCase();
  if (v === 'connected') return 'bg-green-50 text-green-700 border-green-200';
  if (v === 'not_connected' || v === 'not connected') return 'bg-red-50 text-red-600 border-red-200';
  return 'bg-amber-50 text-amber-700 border-amber-200';
};

const titleCase = (s: string) => s.replace(/[_-]+/g, ' ').replace(/\b\w/g, m => m.toUpperCase());

// One applicant's call history, newest first — every process that has touched
// this driver (DWC / MM / TWC), not just this caller's own calls, so the agent
// can see what was already said before dialling the transporter about them.
const ApplicantCallTimeline: React.FC<{ calls: WctApplicantCall[] }> = ({ calls }) => {
  if (calls.length === 0) {
    return <p className="text-[11px] text-gray-400 italic px-1 py-2">No calls logged for this applicant yet.</p>;
  }
  return (
    <div className="space-y-1.5 max-h-72 overflow-y-auto pr-1">
      {calls.map(c => (
        <div key={c.id} className="border border-gray-100 rounded-lg p-2 bg-white">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${statusPill(c.call_status)}`}>
              {(c.call_status || 'pending').replace(/_/g, ' ')}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${c.direction === 'incoming' ? 'bg-blue-50 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
              {c.direction}
            </span>
            {c.disposition_sub && (
              <span className="text-[9px] font-bold text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded">{titleCase(c.disposition_sub)}</span>
            )}
            {c.process && (
              <span className="text-[9px] font-bold text-purple-700 bg-purple-50 px-1.5 py-0.5 rounded">{titleCase(c.process)}</span>
            )}
            <span className="ml-auto text-[9px] text-gray-400 font-mono">{fmtDateTime(c.called_at)}</span>
          </div>
          {c.feedback && <p className="text-[11px] text-gray-700 font-semibold mt-0.5">{c.feedback}</p>}
          {c.remarks && <p className="text-[10px] text-gray-500 whitespace-pre-wrap">{c.remarks}</p>}
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[9px] text-gray-400">
              {c.called_by ? `by ${c.called_by}` : 'caller unknown'}
              {fmtDuration(c.duration_seconds) ? ` · ${fmtDuration(c.duration_seconds)}` : ''}
              {c.callback_at ? ` · callback ${fmtDateTime(c.callback_at)}` : ''}
            </span>
            {c.recording_url && (
              <audio src={c.recording_url} controls preload="none" className="h-6 max-w-[180px] ml-auto" />
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Job detail modal — full job info + every applicant (name, TMID, subscription
// type/amount, registration date, applied date, status).
const JobDetailModal: React.FC<{ jobId: number; onClose: () => void }> = ({ jobId, onClose }) => {
  const { data, isLoading } = useGetWctJobApplicantsQuery(jobId);
  const job = data?.data?.job;
  const applicants = data?.data?.applicants || [];
  // Applicant rows whose call timeline is expanded, keyed by apply_id.
  const [openTimeline, setOpenTimeline] = useState<Record<number, boolean>>({});

  return (
    <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col" onClick={(e) => e.stopPropagation()}>
        {/* Modal header */}
        <div className="p-4 border-b border-gray-200 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-lg font-bold text-gray-900">{job?.title || (isLoading ? 'Loading…' : 'Job')}</h3>
              {job && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border uppercase ${planBadge(job.plan_type)}`}>
                  {job.plan_label}
                </span>
              )}
              {job?.is_closed && <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-100 text-gray-500 uppercase">Closed</span>}
            </div>
            {job && (
              <div className="text-xs text-gray-500 mt-1">
                {job.ref ? `${job.ref} · ` : ''}Posted by {job.transporter.name} ({job.transporter.tmid}) · {fmtDate(job.posted_at)}
              </div>
            )}
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 shrink-0">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Job facts */}
        {job && (
          <div className="px-4 py-3 border-b border-gray-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div><span className="text-gray-400 block uppercase text-[10px]">Location</span><span className="font-semibold text-gray-800">{job.location || '—'}</span></div>
            <div><span className="text-gray-400 block uppercase text-[10px]">Vehicle</span><span className="font-semibold text-gray-800">{job.vehicle_type || '—'}</span></div>
            <div><span className="text-gray-400 block uppercase text-[10px]">Salary</span><span className="font-semibold text-gray-800">{job.salary || '—'}</span></div>
            <div><span className="text-gray-400 block uppercase text-[10px]">Drivers Needed</span><span className="font-semibold text-gray-800">{job.drivers_required || '—'}</span></div>
            <div><span className="text-gray-400 block uppercase text-[10px]">Experience</span><span className="font-semibold text-gray-800">{job.experience || '—'}</span></div>
            <div><span className="text-gray-400 block uppercase text-[10px]">License</span><span className="font-semibold text-gray-800">{job.license_type || '—'}</span></div>
            <div><span className="text-gray-400 block uppercase text-[10px]">Route</span><span className="font-semibold text-gray-800">{job.route || '—'}</span></div>
            <div><span className="text-gray-400 block uppercase text-[10px]">Job Type</span><span className="font-semibold text-gray-800">{job.plan_label}</span></div>
          </div>
        )}

        {/* Applicants table */}
        <div className="p-4 overflow-auto">
          <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">
            Applicants ({data?.data?.applicant_count ?? 0})
          </h4>
          <div className="overflow-x-auto border border-gray-100 rounded-lg">
            <table className="w-full text-xs">
              <thead className="bg-gray-50 text-gray-500 uppercase tracking-wide">
                <tr>
                  <th className="text-left font-semibold px-3 py-2">Driver</th>
                  <th className="text-left font-semibold px-3 py-2">TMID</th>
                  <th className="text-left font-semibold px-3 py-2">Subscription</th>
                  <th className="text-left font-semibold px-3 py-2">Registered</th>
                  <th className="text-left font-semibold px-3 py-2">Applied</th>
                  <th className="text-left font-semibold px-3 py-2">Status</th>
                  <th className="text-left font-semibold px-3 py-2">Calls</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400 italic">Loading applicants…</td></tr>
                ) : applicants.length === 0 ? (
                  <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400 italic">No applicants for this job yet.</td></tr>
                ) : (
                  applicants.map((a) => {
                    const stats = a.call_stats;
                    const calls = a.calls || [];
                    const isOpen = !!openTimeline[a.apply_id];
                    return (
                    <React.Fragment key={a.apply_id}>
                    <tr className="hover:bg-gray-50/60">
                      <td className="px-3 py-2">
                        <div className="font-bold text-gray-900">{a.name}</div>
                        <div className="text-[10px] text-gray-400">{a.mobile || ''}{a.city ? ` · ${a.city}` : ''}</div>
                      </td>
                      <td className="px-3 py-2 font-mono text-gray-500">{a.tmid || '—'}</td>
                      <td className="px-3 py-2">
                        <span className="font-semibold text-gray-800">{a.subscription}</span>
                        {a.subscription_amount ? <span className="text-gray-400"> · ₹{a.subscription_amount.toLocaleString()}</span> : null}
                      </td>
                      <td className="px-3 py-2 text-gray-600">{fmtDate(a.registered_at)}</td>
                      <td className="px-3 py-2 text-gray-600">{fmtDate(a.applied_at)}</td>
                      <td className="px-3 py-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold uppercase ${
                          a.status === 'accepted' ? 'bg-[#EAFAF1] text-[#27AE60]' : a.status === 'rejected' ? 'bg-red-50 text-red-500' : 'bg-amber-50 text-amber-600'
                        }`}>{a.status}</span>
                      </td>
                      {/* Call history — the whole timeline is already in the payload,
                          so expanding a row costs no extra request. */}
                      <td className="px-3 py-2">
                        {stats && stats.total > 0 ? (
                          <button
                            onClick={() => setOpenTimeline(p => ({ ...p, [a.apply_id]: !p[a.apply_id] }))}
                            className="text-left hover:bg-orange-50/60 rounded px-1 -mx-1 py-0.5 transition-colors"
                            title="Show call history timeline"
                          >
                            <div className="flex items-center gap-1 font-bold text-[#FB641B]">
                              <span className="material-symbols-outlined text-[14px]">{isOpen ? 'expand_less' : 'expand_more'}</span>
                              {stats.total} call{stats.total > 1 ? 's' : ''}
                              <span className="text-gray-400 font-semibold">· {stats.connected} conn</span>
                            </div>
                            <div className="text-[10px] text-gray-400">last {fmtDateTime(stats.last_call_at)}</div>
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-400 italic">Never called</span>
                        )}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-gray-50/70">
                        <td colSpan={7} className="px-3 py-3">
                          <div className="flex items-center justify-between mb-2">
                            <p className="text-[10px] font-extrabold uppercase tracking-wider text-gray-500">
                              Call timeline · {a.name}
                            </p>
                            {stats && stats.total > calls.length && (
                              <span className="text-[10px] text-gray-400">showing latest {calls.length} of {stats.total}</span>
                            )}
                          </div>
                          <ApplicantCallTimeline calls={calls} />
                        </td>
                      </tr>
                    )}
                    </React.Fragment>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

// WCT · Jobs — jobs posted by the transporters assigned to this caller
// (WctCallerController::jobs). Lets the agent see hiring demand and call the
// posting transporter directly via SAN CTI.
export const WctJobs: React.FC = () => {
  const { dial, callState, agentState } = useSanCti();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | 'active' | 'closed'>('all');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);

  const { data, isLoading, isFetching } = useGetWctJobsQuery({
    per_page: 20,
    page,
    search: search || undefined,
    status: status === 'all' ? undefined : status,
  });

  const jobs = data?.data?.jobs || [];
  const pagination = data?.data?.pagination;
  const [openJobId, setOpenJobId] = useState<number | null>(null);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const callTransporter = (t: { id: number; name: string; tmid: string; mobile: string }) => {
    if (agentState !== 'ready') {
      triggerToast(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel (bottom-left).'
        : 'CTI agent is not ready yet — please wait and try again.');
      return;
    }
    if (callState !== 'idle') { triggerToast('Finish the current call first.'); return; }
    if (!t.mobile) { triggerToast('This transporter has no phone number on record.'); return; }
    dial(t.mobile, t.id, t.name, t.tmid, 'transporter');
    triggerToast(`Dialing ${t.name}…`);
  };

  return (
    <div className="max-w-7xl mx-auto w-full p-4 space-y-4">
      {toast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-gray-200 pb-3">
        <div>
          <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">Transporter Welcome</p>
          <h2 className="text-2xl font-bold text-gray-800">Transporter Jobs</h2>
          <p className="text-xs text-gray-500 mt-0.5">Jobs posted by your assigned transporters · {pagination?.total ?? 0} total</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-gray-100 rounded-lg p-0.5">
            {(['all', 'active', 'closed'] as const).map(s => (
              <button
                key={s}
                onClick={() => { setStatus(s); setPage(1); }}
                className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition-colors ${status === s ? 'bg-white text-[#FB641B] shadow-sm' : 'text-gray-500'}`}
              >
                {s}
              </button>
            ))}
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search job, transporter…"
              className="pl-8 pr-3 h-10 w-full sm:w-64 border border-gray-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-[#FB641B]"
            />
          </div>
        </div>
      </div>

      {/* Job cards */}
      {isLoading ? (
        <div className="text-center text-gray-400 italic py-16">Loading jobs…</div>
      ) : jobs.length === 0 ? (
        <div className="text-center text-gray-400 italic py-16">No jobs posted by your transporters yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {jobs.map(job => (
            <div key={job.job_id} className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-bold text-gray-900 line-clamp-2">{job.title || 'Job posting'}</h3>
                <div className="flex flex-col items-end gap-1 shrink-0">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded-full border uppercase font-bold ${planBadge(job.plan_type)}`}>
                    {job.plan_label}
                  </span>
                  <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${job.is_closed ? 'bg-gray-100 text-gray-500' : 'bg-[#EAFAF1] text-[#27AE60]'}`}>
                    {job.is_closed ? 'Closed' : 'Active'}
                  </span>
                </div>
              </div>

              <div className="mt-2 space-y-1 text-xs text-gray-500">
                {job.location && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span>{job.location}</div>}
                {job.vehicle_type && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">local_shipping</span>{job.vehicle_type}</div>}
                {job.salary && <div className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">payments</span>{job.salary}</div>}
              </div>

              <button
                onClick={() => setOpenJobId(job.job_id)}
                className="flex items-center gap-2 mt-3 text-xs w-full text-left hover:bg-orange-50/40 rounded p-1 -m-1 transition-colors"
              >
                <span className="font-bold text-[#FB641B]">{job.applicants} applied</span>
                {job.drivers_required ? <span className="text-gray-400">· needs {job.drivers_required}</span> : null}
                <span className="text-[#FB641B] font-semibold ml-auto flex items-center gap-0.5">View applicants <span className="material-symbols-outlined text-[14px]">chevron_right</span></span>
              </button>

              {/* Transporter block */}
              <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                <div className="min-w-0">
                  <div className="font-bold text-gray-800 text-xs truncate">{job.transporter.name}</div>
                  <div className="font-mono text-[10px] text-gray-400 truncate">{job.transporter.tmid}</div>
                </div>
                <button
                  onClick={() => callTransporter(job.transporter)}
                  className="shrink-0 bg-[#FB641B] hover:bg-[#e4540d] text-white h-8 px-3 rounded-lg font-bold text-xs flex items-center gap-1 transition-transform active:scale-95"
                  title="Call transporter"
                >
                  <span className="material-symbols-outlined text-[16px]">call</span> Call
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {openJobId !== null && <JobDetailModal jobId={openJobId} onClose={() => setOpenJobId(null)} />}

      {/* Pagination */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between text-xs text-gray-500 pt-2">
          <span>Page {pagination.current_page} of {pagination.last_page}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1 || isFetching} onClick={() => setPage(p => Math.max(1, p - 1))} className="px-3 py-1.5 border border-gray-200 rounded-lg font-semibold disabled:opacity-40 hover:bg-gray-50">Prev</button>
            <button disabled={page >= pagination.last_page || isFetching} onClick={() => setPage(p => p + 1)} className="px-3 py-1.5 border border-gray-200 rounded-lg font-semibold disabled:opacity-40 hover:bg-gray-50">Next</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WctJobs;
