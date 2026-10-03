import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMmJoiningRemindersQuery } from '../../services/api/webCrmApi';
import { openJobSession } from '../../pages/matchmaking/mmJobSession';

/**
 * "This driver joins soon" reminder for MATCHMAKING callers.
 *
 * When an MM agent files Matchmaking Done / Interview Done they stamp the
 * driver's joining date+time. This popup surfaces those joinings once they fall
 * inside the next 24 hours, wherever the agent happens to be working — the job
 * id, transporter, job title and driver, plus a call action that drops the
 * agent onto that job's screen to make the call.
 *
 * Mounted globally in DashboardLayout. The endpoint returns nothing for
 * non-matchmaking desks, so this renders nothing for them without needing to
 * know the role rules itself. Dismissals are remembered per call in
 * localStorage so a seen reminder doesn't nag on every poll.
 */
const POLL_MS = 120_000;
const DISMISS_KEY = 'mm_joining_reminders_dismissed';

function readDismissed(): number[] {
  try {
    const raw = localStorage.getItem(DISMISS_KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr.filter((n) => typeof n === 'number') : [];
  } catch {
    return [];
  }
}

function writeDismissed(ids: number[]): void {
  try {
    localStorage.setItem(DISMISS_KEY, JSON.stringify(ids.slice(-500)));
  } catch {
    /* storage unavailable — dismissal just won't persist */
  }
}

export const MmJoiningReminders: React.FC = () => {
  const navigate = useNavigate();
  const { data } = useGetMmJoiningRemindersQuery(undefined, {
    pollingInterval: POLL_MS,
    refetchOnMountOrArgChange: true,
  });

  const [dismissed, setDismissed] = useState<number[]>(() => readDismissed());

  const items = (data?.data ?? []).filter((r) => !dismissed.includes(r.call_id));
  if (items.length === 0) return null;

  const dismiss = (callId: number) => {
    setDismissed((d) => {
      const next = d.includes(callId) ? d : [...d, callId];
      writeDismissed(next);
      return next;
    });
  };

  const goToJob = (jobId: string | null, callId: number) => {
    dismiss(callId);
    if (jobId) {
      openJobSession.set(jobId);
      navigate('/mm/mm-job-detail', { state: { jobId } });
    }
  };

  const shown = items.slice(0, 3);
  const extra = items.length - shown.length;

  return (
    <div className="fixed bottom-5 right-5 z-[75] flex flex-col gap-2 max-w-sm">
      {shown.map((r) => (
        <div
          key={r.call_id}
          className="bg-white border border-amber-300 rounded-xl shadow-xl overflow-hidden animate-in slide-in-from-right duration-300"
        >
          <div className="flex items-start gap-3 p-3">
            <div className="w-9 h-9 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
              <span className="material-symbols-outlined text-[18px] text-amber-700">event_upcoming</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[12px] font-extrabold text-gray-800 leading-snug">
                {r.driver_name} joins in {r.hours_left <= 0 ? 'under an hour' : `~${r.hours_left}h`}
              </p>
              <p className="text-[10.5px] text-gray-500 mt-0.5 leading-snug">
                You marked <span className="font-bold text-amber-800">{r.outcome}</span> — this driver is set to join:
              </p>
              <div className="mt-1.5 rounded-lg bg-gray-50 border border-gray-100 px-2 py-1.5 text-[10.5px] text-gray-600 space-y-0.5">
                <div><span className="font-bold text-gray-700">Job:</span> {r.job_id ?? '—'} · {r.job_title}</div>
                <div><span className="font-bold text-gray-700">Transporter:</span> {r.transporter_name}</div>
                <div><span className="font-bold text-gray-700">Joining:</span> {r.joining_label}</div>
              </div>
            </div>
            <button
              onClick={() => dismiss(r.call_id)}
              title="Dismiss"
              className="shrink-0 text-gray-300 hover:text-gray-500"
            >
              <span className="material-symbols-outlined text-[16px]">close</span>
            </button>
          </div>
          <div className="flex border-t border-gray-100">
            <button
              onClick={() => dismiss(r.call_id)}
              className="flex-1 py-2 text-[11px] font-bold text-gray-500 hover:bg-gray-50"
            >
              Dismiss
            </button>
            <button
              onClick={() => goToJob(r.job_id, r.call_id)}
              disabled={!r.job_id}
              className="flex-1 py-2 text-[11px] font-extrabold text-white bg-gradient-to-r from-[#E2761B] to-[#C05E10] hover:opacity-95 disabled:opacity-40 flex items-center justify-center gap-1"
            >
              <span className="material-symbols-outlined text-[15px]">call</span>
              Call for this job
            </button>
          </div>
        </div>
      ))}

      {extra > 0 && (
        <div className="bg-amber-600 text-white text-[11px] font-extrabold rounded-lg py-2 px-3 shadow-lg text-center">
          +{extra} more driver{extra === 1 ? '' : 's'} joining within 24h
        </div>
      )}
    </div>
  );
};

export default MmJoiningReminders;
