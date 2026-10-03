import React, { useEffect, useState } from 'react';
import {
  useUpdateMmJobStatusMutation,
  useGetMmJobStatusHistoryQuery,
  useGetMmJobPlacementCandidatesQuery,
  JOB_STATUS_LABEL,
  type JobStatus,
} from '../../services/api/webCrmApi';

// ── Job status: Open · Hold · Closed · Fulfilled ────────────────────────────
//
// The agent's own call on where the job stands, with the reason in their words.
//
// Closing OR fulfilling here CLOSES THE JOB: the backend writes
// jobs.closed_job='yes' next to jobs.job_status, so the job board, the exports
// and the mobile app — all of which read that flag — agree with this screen.
// Hold is not a close: the job stays on the open boards, marked as paused,
// because a transporter who is unreachable this week is not a job that is over.
//
// FULFILLED is a close with a record: the driver requirement was MET. Choosing
// it opens a picker of the job's own applicants; the agent selects the driver(s)
// who filled it — at most as many as the job needs — and their TMIDs are saved
// on jobs.driver_placed. The board files a fulfilled job under its own green
// bucket, apart from a plain Closed.
//
// The remark is capped at 500 characters and REQUIRED for Hold and Closed — a
// paused or finished job with no reason is what leaves the next agent guessing.
// It stays optional for Fulfilled: the chosen drivers ARE the reason.

const MAX_REMARKS = 500;

const OPTIONS: { value: JobStatus; icon: string; hint: string; active: string }[] = [
  {
    value: 'open',
    icon: 'play_circle',
    hint: 'Being worked — stays on the open board',
    active: 'border-green-500 bg-green-50 text-green-700',
  },
  {
    value: 'hold',
    icon: 'pause_circle',
    hint: 'Paused for now — still open, not being called',
    active: 'border-amber-500 bg-amber-50 text-amber-700',
  },
  {
    value: 'fulfilled',
    icon: 'task_alt',
    hint: 'Driver requirement met — pick who filled it',
    active: 'border-emerald-500 bg-emerald-50 text-emerald-700',
  },
  {
    value: 'closed',
    icon: 'cancel',
    hint: 'Finished — closes the job everywhere',
    active: 'border-rose-500 bg-rose-50 text-rose-700',
  },
];

interface Props {
  open: boolean;
  jobId: string;
  jobTitle?: string | null;
  current: JobStatus;
  currentRemarks?: string | null;
  currentBy?: string | null;
  currentAt?: string | null;
  /** Seats the job needs — the cap on how many drivers a fulfil can select. */
  driversNeeded?: number | null;
  /** TMIDs already recorded as placed, so the picker opens with them ticked. */
  placedDrivers?: string[] | null;
  onClose: () => void;
  onSaved: (status: JobStatus) => void;
}

const MmJobStatusModal: React.FC<Props> = ({
  open, jobId, jobTitle, current, currentRemarks, currentBy, currentAt,
  driversNeeded, placedDrivers, onClose, onSaved,
}) => {
  const [status, setStatus] = useState<JobStatus>(current);
  const [remarks, setRemarks] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [showHistory, setShowHistory] = useState(false);
  // TMIDs the agent has ticked in the Fulfilled picker.
  const [picked, setPicked] = useState<string[]>([]);
  // Free-text filter over the applicant list (name / TMID / mobile).
  const [candSearch, setCandSearch] = useState('');

  const [save, { isLoading }] = useUpdateMmJobStatusMutation();
  const { data: history } = useGetMmJobStatusHistoryQuery(jobId, { skip: !open || !jobId });

  // Applicants to pick from — fetched only once the agent chooses Fulfilled.
  const isFulfilling = status === 'fulfilled';
  const { data: candData, isFetching: loadingCandidates } = useGetMmJobPlacementCandidatesQuery(
    jobId,
    { skip: !open || !jobId || !isFulfilling },
  );
  const applicants = candData?.data.applicants ?? [];
  // Filter by name / TMID / mobile — so a big applicant list is searchable.
  const q = candSearch.trim().toLowerCase();
  const filteredApplicants = q
    ? applicants.filter(a =>
        (a.name || '').toLowerCase().includes(q) ||
        (a.tmid || '').toLowerCase().includes(q) ||
        (a.mobile || '').toLowerCase().includes(q))
    : applicants;
  // The seat cap: the endpoint is authoritative, the prop covers the first paint.
  const cap = Math.max(1, candData?.data.drivers_needed ?? driversNeeded ?? 1);

  // Reopening the modal starts from what the job is now, not from whatever was
  // typed and abandoned last time.
  useEffect(() => {
    if (open) {
      setStatus(current);
      setRemarks('');
      setError(null);
      setShowHistory(false);
      setCandSearch('');
      setPicked(Array.isArray(placedDrivers) ? placedDrivers.filter(Boolean) : []);
    }
  }, [open, current, placedDrivers]);

  // Seed the ticks from whatever the server already has placed the moment the
  // candidates arrive (covers a fulfilled job re-opened to edit its drivers).
  useEffect(() => {
    if (isFulfilling && candData?.data.placed?.length && picked.length === 0) {
      setPicked(candData.data.placed.filter(Boolean).slice(0, cap));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [candData, isFulfilling]);

  if (!open) return null;

  const toggle = (tmid: string) => {
    setError(null);
    setPicked(prev => {
      if (prev.includes(tmid)) return prev.filter(t => t !== tmid);
      if (prev.length >= cap) return prev;   // hard cap — can't tick past the seats
      return [...prev, tmid];
    });
  };

  const trimmed = remarks.trim();
  const needsRemark = status === 'hold' || status === 'closed';
  const validFulfil = !isFulfilling || (picked.length > 0 && picked.length <= cap);
  const unchanged = status === current && !trimmed && !isFulfilling;

  const submit = async () => {
    setError(null);
    if (needsRemark && !trimmed) {
      setError('Add a remark explaining why the job is being put on hold or closed.');
      return;
    }
    if (isFulfilling && picked.length === 0) {
      setError('Pick at least one applicant who fills this job.');
      return;
    }
    try {
      await save({
        job_id: jobId,
        status,
        remarks: trimmed || undefined,
        placed_drivers: isFulfilling ? picked : undefined,
      }).unwrap();
      onSaved(status);
      onClose();
    } catch (e: any) {
      setError(
        e?.data?.errors?.placed_drivers?.[0] ||
        e?.data?.errors?.remarks?.[0] ||
        e?.data?.message ||
        'Could not update the job status. Try again.'
      );
    }
  };

  const rows = history?.data ?? [];

  return (
    <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[85vh] flex flex-col">

        {/* Header */}
        <div className="flex items-start justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
          <div className="min-w-0">
            <h3 className="font-extrabold text-gray-800 text-sm">Job status</h3>
            <p className="text-[10px] text-gray-400 mt-0.5 truncate">
              <span className="font-mono font-bold">{jobId}</span>
              {jobTitle ? ` · ${jobTitle}` : ''}
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center shrink-0"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 py-4 space-y-4">

          {/* Where it stands now */}
          <div className="rounded-xl bg-gray-50 border border-gray-100 px-3 py-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Currently</p>
            <p className="text-[11px] font-extrabold text-gray-800 mt-0.5">
              {JOB_STATUS_LABEL[current]}
              {currentBy && (
                <span className="font-semibold text-gray-500"> · {currentBy}{currentAt ? ` · ${currentAt}` : ''}</span>
              )}
            </p>
            {currentRemarks && (
              <p className="text-[10px] text-gray-500 mt-1 whitespace-pre-wrap break-words">“{currentRemarks}”</p>
            )}
          </div>

          {/* The three options */}
          <div className="space-y-1.5">
            {OPTIONS.map(o => {
              const on = status === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setStatus(o.value)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl border-2 text-left transition-colors ${
                    on ? o.active : 'border-gray-100 bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <span className="material-symbols-outlined text-[20px]">{o.icon}</span>
                  <span className="min-w-0">
                    <span className="block font-extrabold text-[12px]">{JOB_STATUS_LABEL[o.value]}</span>
                    <span className="block text-[10px] opacity-70">{o.hint}</span>
                  </span>
                  {on && <span className="material-symbols-outlined text-[18px] ml-auto">check_circle</span>}
                </button>
              );
            })}
          </div>

          {/* Fulfilled → pick the applicants who filled the job (≤ seats) */}
          {isFulfilling && (
            <div className="rounded-xl border-2 border-emerald-200 bg-emerald-50/40 p-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">
                  Placed drivers
                </p>
                <span className={`text-[10px] font-extrabold px-1.5 py-0.5 rounded-full ${
                  picked.length > cap ? 'bg-rose-100 text-rose-600' : 'bg-emerald-100 text-emerald-700'
                }`}>
                  {picked.length} / {cap} selected
                </span>
              </div>
              <p className="text-[10px] text-gray-500 mb-2">
                This job needs <b>{cap}</b> driver{cap !== 1 ? 's' : ''}. Tick the applicant{cap !== 1 ? 's' : ''} who filled it.
              </p>

              {/* Search the applicants by name, TMID or mobile */}
              {applicants.length > 0 && (
                <div className="relative mb-2">
                  <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">search</span>
                  <input
                    value={candSearch}
                    onChange={e => setCandSearch(e.target.value)}
                    placeholder="Search name, TMID or mobile…"
                    className="w-full pl-7 pr-7 py-1.5 border border-gray-200 rounded-lg text-[11px] outline-none focus:ring-1 focus:ring-emerald-400 bg-white"
                  />
                  {candSearch && (
                    <button
                      type="button"
                      onClick={() => setCandSearch('')}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      <span className="material-symbols-outlined text-[14px]">close</span>
                    </button>
                  )}
                </div>
              )}

              {loadingCandidates ? (
                <div className="flex items-center justify-center gap-2 py-6 text-[11px] text-gray-400">
                  <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                  Loading applicants…
                </div>
              ) : applicants.length === 0 ? (
                <div className="py-6 text-center text-[11px] text-gray-400">
                  <span className="material-symbols-outlined text-2xl block mb-1">person_off</span>
                  No one has applied to this job yet, so there is nobody to place.
                </div>
              ) : filteredApplicants.length === 0 ? (
                <div className="py-6 text-center text-[11px] text-gray-400">
                  No applicant matches “{candSearch}”.
                </div>
              ) : (
                <ul className="space-y-1 max-h-56 overflow-y-auto custom-scrollbar pr-0.5">
                  {filteredApplicants.map(a => {
                    const tmid = a.tmid || '';
                    const on = !!tmid && picked.includes(tmid);
                    const capped = !on && picked.length >= cap;
                    return (
                      <li key={a.driver_id}>
                        <button
                          type="button"
                          disabled={!tmid || capped}
                          onClick={() => tmid && toggle(tmid)}
                          title={!tmid ? 'This applicant has no TMID and cannot be placed' : capped ? `Only ${cap} can be placed` : undefined}
                          className={`w-full flex items-center gap-2.5 px-2.5 py-2 rounded-lg border text-left transition-colors ${
                            on ? 'border-emerald-500 bg-white'
                              : capped || !tmid ? 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                              : 'border-gray-200 bg-white hover:border-emerald-300'
                          }`}
                        >
                          <span className={`material-symbols-outlined text-[18px] ${on ? 'text-emerald-600' : 'text-gray-300'}`}>
                            {on ? 'check_box' : 'check_box_outline_blank'}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="block font-bold text-[11px] text-gray-800 truncate">{a.name}</span>
                            <span className="block font-mono text-[10px] text-gray-400 truncate">
                              {a.tmid || 'No TMID'}{a.mobile ? ` · ${a.mobile}` : ''}
                            </span>
                          </span>
                          {a.applied_at && (
                            <span className="text-[9px] text-gray-400 shrink-0">{a.applied_at}</span>
                          )}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          )}

          {/* Remarks */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[10px] font-extrabold text-gray-500 uppercase tracking-wider">
                Remarks {needsRemark && <span className="text-rose-500">*</span>}
              </label>
              <span className={`text-[10px] font-mono font-bold ${
                remarks.length >= MAX_REMARKS ? 'text-rose-500' : 'text-gray-400'
              }`}>
                {remarks.length}/{MAX_REMARKS}
              </span>
            </div>
            <textarea
              value={remarks}
              maxLength={MAX_REMARKS}
              rows={4}
              onChange={e => setRemarks(e.target.value.slice(0, MAX_REMARKS))}
              placeholder={
                status === 'closed' ? 'Why is this job being closed? (e.g. all positions filled)'
                : status === 'hold' ? 'Why is this job on hold, and until when?'
                : status === 'fulfilled' ? 'Anything worth noting about the placement (optional)'
                : 'Anything worth noting (optional)'
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-[11px] outline-none focus:ring-1 focus:ring-[#8E44AD] resize-none"
            />
          </div>

          {error && (
            <p className="text-[10px] font-bold text-rose-600 bg-rose-50 border border-rose-100 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          {/* The trail */}
          {rows.length > 0 && (
            <div>
              <button
                type="button"
                onClick={() => setShowHistory(v => !v)}
                className="flex items-center gap-1 text-[10px] font-extrabold text-gray-500 hover:text-[#8E44AD]"
              >
                <span className="material-symbols-outlined text-[14px]">
                  {showHistory ? 'expand_less' : 'expand_more'}
                </span>
                Status history ({rows.length})
              </button>

              {showHistory && (
                <ul className="mt-2 space-y-1.5">
                  {rows.map(h => (
                    <li key={h.id} className="border-l-2 border-gray-200 pl-2.5">
                      <p className="text-[10px] font-extrabold text-gray-700">
                        {h.previous_status ? `${JOB_STATUS_LABEL[h.previous_status]} → ` : ''}
                        {JOB_STATUS_LABEL[h.status]}
                        <span className="font-semibold text-gray-400">
                          {' · '}{h.changed_by_name || '—'}{h.changed_at_display ? ` · ${h.changed_at_display}` : ''}
                        </span>
                      </p>
                      {h.remarks && (
                        <p className="text-[10px] text-gray-500 whitespace-pre-wrap break-words">{h.remarks}</p>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="px-5 py-3 border-t border-gray-100 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg border border-gray-200 text-gray-600 font-bold text-[11px] hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={isLoading || unchanged || !validFulfil}
            title={
              unchanged ? 'Pick a different status, or add a remark'
              : !validFulfil ? 'Pick at least one applicant who fills this job'
              : undefined
            }
            className="px-4 py-1.5 rounded-lg bg-[#8E44AD] text-white font-bold text-[11px] hover:bg-[#7d3c98] disabled:opacity-50 flex items-center gap-1.5"
          >
            {isLoading && (
              <span className="material-symbols-outlined text-[14px] animate-spin">progress_activity</span>
            )}
            {isFulfilling ? 'Mark fulfilled' : 'Save status'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MmJobStatusModal;
