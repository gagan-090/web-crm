import React, { useState } from 'react';
import { useGetJobSearchDetailQuery } from '../../../services/api/webCrmApi';
import type { JobBoardScope } from '../../../services/api/webCrmApi';

interface JobDetailModalProps {
  /** jobs.id of the row the agent clicked. null closes the modal. */
  jobRowId: number | null;
  /** Which process's endpoint to read from — see JobBoardScope. */
  scope?: JobBoardScope;
  onClose: () => void;
}

type Tab = 'overview' | 'applicants' | 'activity';

const fmtDate = (v?: string | null) => {
  if (!v) return '—';
  const d = new Date(v.replace(' ', 'T'));
  if (isNaN(d.getTime())) return v;
  return d.toLocaleString('en-IN', {
    day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
};

const fmtDuration = (s?: number | null) => {
  if (!s) return '—';
  const m = Math.floor(s / 60);
  return m > 0 ? `${m}m ${s % 60}s` : `${s}s`;
};

/** Backend stores these as free text / flags; render anything truthy as Yes. */
const yesNo = (v: string | number | null) => {
  if (v === null || v === undefined || v === '' || v === 0 || v === '0') return 'No';
  if (v === 1 || v === '1' || String(v).toLowerCase() === 'yes') return 'Yes';
  return String(v);
};

const statusPill = (status?: string | null) => {
  const s = (status || '').toLowerCase();
  if (s === 'connected') return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (s === 'callback_later') return 'bg-amber-50 text-amber-700 border-amber-200';
  if (s === 'not_connected') return 'bg-red-50 text-red-600 border-red-200';
  return 'bg-gray-100 text-gray-500 border-gray-200';
};

const Field: React.FC<{ label: string; value?: React.ReactNode; mono?: boolean }> = ({ label, value, mono }) => (
  <div>
    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">{label}</div>
    <div className={`text-sm text-gray-800 mt-0.5 break-words ${mono ? 'font-mono' : ''}`}>
      {value === null || value === undefined || value === '' ? '—' : value}
    </div>
  </div>
);

const Card: React.FC<{ title: string; icon: string; children: React.ReactNode; right?: React.ReactNode }> = ({
  title, icon, children, right,
}) => (
  <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <h4 className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
        <span className="material-symbols-outlined text-[16px] text-indigo-400">{icon}</span>
        {title}
      </h4>
      {right}
    </div>
    {children}
  </div>
);

/**
 * Read-only job detail behind the Open Jobs Board eye icon.
 *
 * The board row only had room for one "Assigned To" name, which is the job's
 * nominal owner and says nothing about who has actually worked it. This shows
 * both: the assignment on the jobs row, and every agent with calls logged
 * against the job.
 */
export const JobDetailModal: React.FC<JobDetailModalProps> = ({ jobRowId, scope = 'dw', onClose }) => {
  const [tab, setTab] = useState<Tab>('overview');

  const { data, isLoading, isError } = useGetJobSearchDetailQuery(
    { scope, id: jobRowId as number },
    { skip: !jobRowId }
  );

  // Land on Overview whenever a different job is opened.
  React.useEffect(() => { setTab('overview'); }, [jobRowId]);

  if (!jobRowId) return null;

  const d = data?.data;
  const job = d?.job;
  const applicants = d?.applicants || [];
  const callLogs = d?.call_logs || [];
  const agentsWorked = d?.agents_worked || [];
  const placements = d?.placements || [];

  return (
    <div
      className="fixed inset-0 z-[10000] bg-black/50 flex items-start justify-center p-4 overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="bg-gray-50 rounded-2xl shadow-2xl w-full max-w-5xl my-6 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-start justify-between gap-4 sticky top-0 z-10">
          <div className="min-w-0">
            <p className="text-[10px] text-indigo-500 font-bold uppercase tracking-widest">Job Details</p>
            <h3 className="text-lg font-bold text-gray-800 mt-0.5 break-words">
              {job?.job_title || (isLoading ? 'Loading…' : 'Job')}
            </h3>
            <div className="flex flex-wrap items-center gap-2 mt-1.5">
              {job?.job_id && (
                <span className="font-mono text-[11px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded">{job.job_id}</span>
              )}
              {job && (
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wide ${
                  job.is_open
                    ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    : 'bg-gray-100 text-gray-500 border-gray-200'
                }`}>
                  {job.is_open ? 'Open' : (job.status || 'Closed')}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-100 flex items-center justify-center text-gray-500"
            title="Close"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200 px-6 flex items-center gap-1">
          {([
            { id: 'overview', label: 'Overview', icon: 'description' },
            { id: 'applicants', label: `Applicants (${d?.applicants_count ?? 0})`, icon: 'group' },
            { id: 'activity', label: `Call Activity (${callLogs.length})`, icon: 'call' },
          ] as Array<{ id: Tab; label: string; icon: string }>).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`px-3 py-2.5 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                tab === t.id
                  ? 'border-indigo-600 text-indigo-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <span className="material-symbols-outlined text-[15px]">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {isLoading && (
            <div className="p-16 text-center text-gray-500 flex flex-col items-center gap-2">
              <div className="w-8 h-8 border-4 border-t-indigo-600 border-gray-200 rounded-full animate-spin"></div>
              <p className="text-xs text-gray-400 mt-2">Loading job details…</p>
            </div>
          )}

          {isError && (
            <div className="p-10 text-center">
              <span className="material-symbols-outlined text-4xl text-red-300">error</span>
              <p className="text-sm text-gray-600 mt-2">Could not load this job.</p>
            </div>
          )}

          {d && tab === 'overview' && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card title="Assigned To" icon="support_agent">
                  {d.assigned_to ? (
                    <div className="space-y-2.5">
                      <Field label="Agent" value={d.assigned_to.name} />
                      <Field label="Process" value={d.assigned_to.process || d.assigned_to.role} />
                      <Field label="Mobile" value={d.assigned_to.mobile} mono />
                      <Field label="Email" value={d.assigned_to.email} />
                    </div>
                  ) : (
                    <p className="text-xs text-amber-600 font-semibold">Unassigned</p>
                  )}
                </Card>

                <Card title="Transporter" icon="local_shipping">
                  <div className="space-y-2.5">
                    <Field label="Name" value={d.transporter.name} />
                    <Field label="TMID" value={d.transporter.tmid} mono />
                    <Field label="Mobile" value={d.transporter.mobile} mono />
                    <Field
                      label="Location"
                      value={[d.transporter.city, d.transporter.state].filter(Boolean).join(', ')}
                    />
                  </div>
                </Card>

                <Card title="Hiring" icon="how_to_reg">
                  <div className="space-y-2.5">
                    <Field label="Drivers Needed" value={job?.drivers_required} />
                    <Field label="Applicants" value={d.applicants_count} />
                    <Field label="Placed" value={placements.length} />
                    <Field label="Deadline" value={job?.application_deadline || '—'} />
                  </div>
                </Card>
              </div>

              <Card title="Job Information" icon="work">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Field label="Location" value={job?.job_location} />
                  <Field label="Route" value={job?.route} />
                  <Field label="Route Scope" value={job?.route_scope} />
                  <Field label="Area / Pincode" value={[job?.area, job?.pincode].filter(Boolean).join(' · ')} />
                  <Field label="Salary Range" value={job?.salary_range} />
                  <Field label="Experience" value={job?.experience} />
                  <Field label="License Type" value={job?.license_type} />
                  <Field label="Vehicle Type" value={job?.vehicle_type_label} />
                  <Field label="Preferred Skills" value={job?.preferred_skills} />
                  <Field label="Job Management" value={job?.job_management} />
                  <Field label="Created" value={fmtDate(job?.created_at)} />
                  <Field label="Last Updated" value={fmtDate(job?.updated_at)} />
                </div>
                {job?.job_description && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Description</div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.job_description}</p>
                  </div>
                )}
                {job?.remarks && (
                  <div className="mt-3">
                    <div className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold mb-1">Remarks</div>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap">{job.remarks}</p>
                  </div>
                )}
              </Card>

              {/* What the driver is actually sold on the call. */}
              <Card title="Benefits Offered" icon="card_giftcard">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <Field label="ESI / PF" value={yesNo(d.benefits.esi_pf)} />
                  <Field
                    label="Food Allowance"
                    value={[yesNo(d.benefits.food_allowance), d.benefits.food_allowance_desc].filter(Boolean).join(' — ')}
                  />
                  <Field
                    label="Trip Incentive"
                    value={[yesNo(d.benefits.trip_incentive), d.benefits.trip_incentive_desc].filter(Boolean).join(' — ')}
                  />
                  <Field label="Stay Provided" value={yesNo(d.benefits.stay)} />
                  <Field
                    label="Mileage"
                    value={[yesNo(d.benefits.mileage), d.benefits.mileage_desc].filter(Boolean).join(' — ')}
                  />
                  <Field
                    label="FASTag / Road Expense"
                    value={[yesNo(d.benefits.fastag_road_expense), d.benefits.fastag_road_expense_desc].filter(Boolean).join(' — ')}
                  />
                </div>
              </Card>

              {/* jobs.assigned_to is only the nominal owner — this is who has
                  actually called on it. */}
              <Card title="Agents Who Worked This Job" icon="groups">
                {agentsWorked.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-100">
                          <th className="pb-2 pr-4">Agent</th>
                          <th className="pb-2 pr-4 text-center">Calls</th>
                          <th className="pb-2 pr-4 text-center">Unique Leads</th>
                          <th className="pb-2">Last Call</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {agentsWorked.map((a, i) => (
                          <tr key={`${a.agent_id}-${i}`}>
                            <td className="py-2 pr-4 font-semibold text-gray-800">{a.agent_name || '—'}</td>
                            <td className="py-2 pr-4 text-center">{a.calls}</td>
                            <td className="py-2 pr-4 text-center text-indigo-700 font-semibold">{a.unique_leads}</td>
                            <td className="py-2 text-gray-500 text-xs">{fmtDate(a.last_call_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 italic">No calls logged against this job yet.</p>
                )}
              </Card>

              {placements.length > 0 && (
                <Card title="Placed Drivers" icon="verified">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-100">
                          <th className="pb-2 pr-4">Driver</th>
                          <th className="pb-2 pr-4">TMID</th>
                          <th className="pb-2 pr-4">Mobile</th>
                          <th className="pb-2 pr-4">Status</th>
                          <th className="pb-2 pr-4">Placed By</th>
                          <th className="pb-2">When</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {placements.map((p, i) => (
                          <tr key={`${p.driver_id}-${i}`}>
                            <td className="py-2 pr-4 font-semibold text-gray-800">{p.driver_name || '—'}</td>
                            <td className="py-2 pr-4 font-mono text-xs text-gray-500">{p.driver_tmid || '—'}</td>
                            <td className="py-2 pr-4 font-mono text-xs text-gray-500">{p.driver_mobile || '—'}</td>
                            <td className="py-2 pr-4">
                              <span className="inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold border bg-emerald-50 text-emerald-700 border-emerald-200 uppercase">
                                {p.match_status}
                              </span>
                            </td>
                            <td className="py-2 pr-4 text-gray-600">{p.placed_by || '—'}</td>
                            <td className="py-2 text-gray-500 text-xs">{fmtDate(p.placed_at)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </Card>
              )}
            </>
          )}

          {d && tab === 'applicants' && (
            <Card title={`Applicants (${d.applicants_count})`} icon="group">
              {applicants.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-100">
                        <th className="pb-2 pr-4">Driver</th>
                        <th className="pb-2 pr-4">TMID</th>
                        <th className="pb-2 pr-4">Mobile</th>
                        <th className="pb-2 pr-4">Location</th>
                        <th className="pb-2 pr-4">Experience</th>
                        <th className="pb-2 pr-4">Assigned To</th>
                        <th className="pb-2">Applied</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {applicants.map((a) => (
                        <tr key={a.id} className="hover:bg-gray-50/60">
                          <td className="py-2 pr-4 font-semibold text-gray-800">{a.driver_name || '—'}</td>
                          <td className="py-2 pr-4 font-mono text-xs text-gray-500">{a.driver_tmid || '—'}</td>
                          <td className="py-2 pr-4 font-mono text-xs text-gray-500">{a.driver_mobile || '—'}</td>
                          <td className="py-2 pr-4 text-gray-600">
                            {[a.driver_city, a.driver_state].filter(Boolean).join(', ') || '—'}
                          </td>
                          <td className="py-2 pr-4 text-gray-600">{a.driver_experience || '—'}</td>
                          <td className="py-2 pr-4 text-gray-600">{a.applicant_assigned_to || '—'}</td>
                          <td className="py-2 text-gray-500 text-xs">{fmtDate(a.applied_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No applicants for this job yet.</p>
              )}
            </Card>
          )}

          {d && tab === 'activity' && (
            <Card title={`Call Activity (${callLogs.length})`} icon="call">
              {callLogs.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold border-b border-gray-100">
                        <th className="pb-2 pr-4">When</th>
                        <th className="pb-2 pr-4">Agent</th>
                        <th className="pb-2 pr-4">Called</th>
                        <th className="pb-2 pr-4">Status</th>
                        <th className="pb-2 pr-4">Feedback</th>
                        <th className="pb-2 pr-4">Match</th>
                        <th className="pb-2">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {callLogs.map((c) => (
                        <tr key={c.id} className="hover:bg-gray-50/60 align-top">
                          <td className="py-2 pr-4 text-gray-500 text-xs whitespace-nowrap">{fmtDate(c.created_at)}</td>
                          <td className="py-2 pr-4 font-semibold text-gray-800">{c.agent_name || '—'}</td>
                          <td className="py-2 pr-4">
                            <div className="text-gray-800">{c.party_name || '—'}</div>
                            <div className="text-[11px] font-mono text-gray-400">{c.party_mobile || ''}</div>
                          </td>
                          <td className="py-2 pr-4">
                            <span className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-bold border ${statusPill(c.call_status)}`}>
                              {c.call_status || '—'}
                            </span>
                          </td>
                          <td className="py-2 pr-4 text-gray-600 max-w-[200px]">
                            <div>{c.call_feedback || '—'}</div>
                            {c.call_remarks && (
                              <div className="text-[11px] text-gray-400 mt-0.5 break-words">{c.call_remarks}</div>
                            )}
                          </td>
                          <td className="py-2 pr-4 text-gray-600">{c.match_status || '—'}</td>
                          <td className="py-2 text-gray-600 whitespace-nowrap">{fmtDuration(c.duration)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-xs text-gray-400 italic">No calls logged against this job yet.</p>
              )}
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
