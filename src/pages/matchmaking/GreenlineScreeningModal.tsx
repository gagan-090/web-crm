import React, { useEffect, useMemo, useState } from 'react';
import {
  useSubmitMmScreeningMutation,
  useUpdateMmScreeningStatusMutation,
  useGetMmDriverScreeningQuery,
} from '../../services/api/webCrmApi';
import {
  GREENLINE_MODULES,
  SCREENING_QUESTIONS,
  SCREENING_STATUSES,
  TOTAL_QUESTIONS,
  computeScreening,
  decisionMeta,
  statusMeta,
  toScreeningStatus,
  type YesNo,
  type ScreeningStatus,
} from './greenlineScreening';

interface Props {
  open: boolean;
  mode: 'conduct' | 'view';
  driverId: number;
  uniqueId: string;
  driverName: string;
  onClose: () => void;
  onSubmitted?: (res: { score: number; decision?: string; status: string }) => void;
}

const answerColor = (a?: string | null) => {
  const v = (a || '').toLowerCase();
  if (v === 'yes') return '#10B981';
  if (v === 'no') return '#EF4444';
  return '#94A3B8';
};

/** Shortlisted / Pending / Rejected — the agent's call, in both modes. */
const StatusPicker: React.FC<{
  value: ScreeningStatus | null;
  onChange: (s: ScreeningStatus) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => (
  <div className="flex gap-2">
    {SCREENING_STATUSES.map(opt => {
      const meta = statusMeta[opt];
      const active = value === opt;
      return (
        <button
          key={opt}
          disabled={disabled}
          onClick={() => onChange(opt)}
          className="flex-1 py-2 rounded-xl text-xs font-extrabold border-2 transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          style={
            active
              ? { background: meta.bg, color: meta.text, borderColor: meta.border }
              : { background: '#fff', color: '#94A3B8', borderColor: '#E5E7EB' }
          }
        >
          <span className="material-symbols-outlined text-base">{meta.icon}</span>
          {meta.label}
        </button>
      );
    })}
  </div>
);

export const GreenlineScreeningModal: React.FC<Props> = ({
  open, mode, driverId, uniqueId, driverName, onClose, onSubmitted,
}) => {
  const [answers, setAnswers] = useState<Record<number, YesNo>>({});
  // The agent's own call — never pre-filled from the score.
  const [agentStatus, setAgentStatus] = useState<ScreeningStatus | null>(null);
  const [remarks, setRemarks] = useState('');
  const [submitScreening, { isLoading: isSubmitting }] = useSubmitMmScreeningMutation();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateMmScreeningStatusMutation();

  // View mode fetch (skipped entirely while conducting or closed).
  const {
    data: resultsData,
    isLoading: resultsLoading,
    isError: resultsError,
  } = useGetMmDriverScreeningQuery(driverId, { skip: !open || mode !== 'view' });

  const results = resultsData?.data;

  const answeredCount = Object.keys(answers).length;
  const allAnswered = answeredCount === TOTAL_QUESTIONS;
  const live = useMemo(() => (allAnswered ? computeScreening(answers) : null), [answers, allAnswered]);

  // View mode: the stored result stays editable — the Q&A below does not.
  const savedStatus = toScreeningStatus(results?.telecaller_status);
  const [editStatus, setEditStatus] = useState<ScreeningStatus | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  useEffect(() => { setEditStatus(savedStatus); }, [savedStatus]);
  const statusDirty = editStatus !== null && editStatus !== savedStatus;

  if (!open) return null;

  const handleSubmit = async () => {
    if (!allAnswered || !agentStatus) return;
    setNotice(null);
    const answersArr = Array.from({ length: TOTAL_QUESTIONS }, (_, i) => answers[i + 1]);
    try {
      const res = await submitScreening({
        user_id: driverId,
        unique_id: uniqueId,
        status: agentStatus,
        answers: answersArr,
        telecaller_remarks: remarks || undefined,
      }).unwrap();
      // Q&A is one-time: the API refuses a second submission for this driver.
      if (!res.status) { setNotice(res.message); return; }
      onSubmitted?.({ score: res.score, decision: res.decision, status: res.screening_status });
      onClose();
    } catch {
      /* surfaced by the mutation error; keep the modal open so answers aren't lost */
    }
  };

  // Change the result of an already-conducted screening (any number of times).
  const handleStatusUpdate = async () => {
    if (!editStatus || !statusDirty) return;
    setNotice(null);
    try {
      const res = await updateStatus({ user_id: driverId, status: editStatus }).unwrap();
      if (!res.status) { setNotice(res.message); return; }
      onSubmitted?.({ score: res.score, status: res.screening_status });
      onClose();
    } catch {
      /* surfaced by the mutation error */
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Panel */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-200 flex items-center gap-3 shrink-0 bg-gradient-to-r from-[#8E44AD] to-[#7D3C98]">
          <span className="material-symbols-outlined text-white">fact_check</span>
          <div className="flex-1 min-w-0">
            <h2 className="text-white font-extrabold text-sm truncate">
              Greenline Screening {mode === 'view' ? '— Results' : ''}
            </h2>
            <p className="text-white/80 text-[11px] truncate">{driverName} · {uniqueId}</p>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* ── CONDUCT MODE ─────────────────────────────────────────── */}
        {mode === 'conduct' && (
          <>
            {/* Live score bar */}
            <div className="px-5 py-2.5 border-b border-gray-100 flex items-center gap-3 shrink-0 bg-gray-50">
              <div className="text-[11px] font-bold text-gray-500">
                Answered <span className="text-gray-800">{answeredCount}/{TOTAL_QUESTIONS}</span>
              </div>
              <div className="flex-1 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-[#8E44AD] transition-all" style={{ width: `${(answeredCount / TOTAL_QUESTIONS) * 100}%` }} />
              </div>
              {live && (
                <span
                  className="text-[11px] font-extrabold px-2.5 py-1 rounded-lg"
                  style={{ background: decisionMeta[live.decision].bg, color: decisionMeta[live.decision].text }}
                >
                  {live.score} pts · {live.decision} (advisory)
                </span>
              )}
            </div>

            {/* Questions */}
            <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 custom-scrollbar">
              {GREENLINE_MODULES.map(mod => (
                <div key={mod.id}>
                  <p className="text-[11px] font-extrabold text-[#7D3C98] mb-2">{mod.title}</p>
                  <div className="space-y-2">
                    {mod.questions.map(q => (
                      <div key={q.id} className="border border-gray-200 rounded-xl p-3">
                        <div className="flex items-start gap-2 mb-2">
                          {q.autoReject && (
                            <span className="shrink-0 text-[8px] font-extrabold bg-red-50 text-red-500 border border-red-100 px-1 py-0.5 rounded uppercase mt-0.5">
                              Critical
                            </span>
                          )}
                          <p className="text-[13px] font-hindi leading-relaxed text-gray-800">{q.text}</p>
                        </div>
                        <div className="flex gap-2">
                          {(['Yes', 'No'] as YesNo[]).map(opt => {
                            const active = answers[q.id] === opt;
                            const isYes = opt === 'Yes';
                            return (
                              <button
                                key={opt}
                                onClick={() => setAnswers(prev => ({ ...prev, [q.id]: opt }))}
                                className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
                                  active
                                    ? isYes
                                      ? 'bg-green-500 text-white border-green-500'
                                      : 'bg-red-500 text-white border-red-500'
                                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                                }`}
                              >
                                {opt === 'Yes' ? 'हाँ (Yes)' : 'नहीं (No)'}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}

              {/* Remarks */}
              <div>
                <p className="text-[11px] font-extrabold text-gray-500 mb-1.5">Telecaller Remarks (optional)</p>
                <textarea
                  value={remarks}
                  onChange={e => setRemarks(e.target.value)}
                  rows={2}
                  placeholder="Any notes about this screening…"
                  className="w-full border border-gray-200 rounded-xl p-2.5 text-xs outline-none focus:ring-1 focus:ring-[#8E44AD]"
                />
              </div>

              {/* Agent's call — the score is guidance only, this sets the result */}
              <div>
                <p className="text-[11px] font-extrabold text-gray-500 mb-1">Your Decision <span className="text-red-500">*</span></p>
                <p className="text-[10px] text-gray-400 mb-2">
                  The score is advisory only — shortlist, hold or reject on your own judgement, whatever it says.
                  You can change this result later; the questionnaire is answered once.
                </p>
                <StatusPicker value={agentStatus} onChange={setAgentStatus} />
              </div>

              {notice && (
                <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] font-semibold text-amber-800">
                  {notice}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-gray-200 flex items-center gap-3 shrink-0 bg-white">
              {!allAnswered ? (
                <span className="text-[11px] text-gray-400">Answer all {TOTAL_QUESTIONS} questions to score</span>
              ) : agentStatus ? (
                <span className="text-[11px] font-bold" style={{ color: statusMeta[agentStatus].text }}>
                  Marking as {agentStatus}
                  {live && (
                    <span className="text-gray-400 font-semibold"> · {decisionMeta[live.decision].label}</span>
                  )}
                </span>
              ) : (
                <span className="text-[11px] font-bold text-amber-600">Pick a result to submit</span>
              )}
              <div className="ml-auto flex gap-2">
                <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100">
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!allAnswered || !agentStatus || isSubmitting}
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#8E44AD] hover:bg-[#7D3C98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isSubmitting && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                  Submit Screening
                </button>
              </div>
            </div>
          </>
        )}

        {/* ── VIEW MODE ────────────────────────────────────────────── */}
        {mode === 'view' && (
          <>
          <div className="flex-1 overflow-y-auto px-5 py-4 custom-scrollbar">
            {resultsLoading ? (
              <div className="py-16 text-center text-gray-400">
                <span className="material-symbols-outlined text-4xl animate-spin">progress_activity</span>
                <p className="text-xs mt-2 font-semibold">Loading screening…</p>
              </div>
            ) : resultsError || !results ? (
              <div className="py-16 text-center text-gray-400">
                <span className="material-symbols-outlined text-4xl">search_off</span>
                <p className="text-xs mt-2 font-semibold">No screening recorded for this driver yet.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Summary */}
                <div className="rounded-xl border border-gray-200 p-4 flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-extrabold text-[#8E44AD]">{results.result ?? '0'}</p>
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Score / 100</p>
                  </div>
                  <div className="h-10 w-px bg-gray-200" />
                  <div className="flex-1">
                    <p className="text-[9px] text-gray-400 font-bold uppercase">Telecaller Status</p>
                    <p
                      className="text-sm font-extrabold capitalize"
                      style={{ color: savedStatus ? statusMeta[savedStatus].text : '#F59E0B' }}
                    >
                      {savedStatus || results.telecaller_status || 'N/A'}
                    </p>
                    {results.screener?.name && (
                      <p className="text-[10px] text-gray-400 mt-0.5">by {results.screener.name} · {results.screened_at}</p>
                    )}
                  </div>
                </div>

                {/* Result stays editable — the answers below do not. */}
                <div className="rounded-xl border border-gray-200 p-3">
                  <p className="text-[11px] font-extrabold text-gray-500 mb-1">Change Result</p>
                  <p className="text-[10px] text-gray-400 mb-2">
                    You can revise this any time, regardless of the score. The questionnaire itself is answered once and can't be redone.
                  </p>
                  <StatusPicker value={editStatus} onChange={setEditStatus} disabled={isUpdating} />
                </div>

                {notice && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3 text-[11px] font-semibold text-amber-800">
                    {notice}
                  </div>
                )}

                {results.telecaller_remarks && (
                  <div className="rounded-xl bg-amber-50 border border-amber-200 p-3">
                    <p className="text-[9px] font-extrabold text-amber-700 uppercase mb-1">Remarks</p>
                    <p className="text-xs text-amber-900">{results.telecaller_remarks}</p>
                  </div>
                )}

                {/* Answers */}
                <div className="space-y-1.5">
                  <p className="text-[11px] font-extrabold text-gray-700">Screening Answers</p>
                  {SCREENING_QUESTIONS.map(q => {
                    const ans = results.answers?.[`answer${q.id}`];
                    return (
                      <div key={q.id} className="border border-gray-200 rounded-lg p-2.5 flex items-start gap-2.5">
                        <span className="shrink-0 text-[10px] font-extrabold text-[#8E44AD] mt-0.5">Q{q.id}</span>
                        <p className="flex-1 text-[12px] font-hindi leading-relaxed text-gray-700">{q.text}</p>
                        <span
                          className="shrink-0 text-[10px] font-bold px-2 py-1 rounded uppercase"
                          style={{ background: answerColor(ans) + '20', color: answerColor(ans) }}
                        >
                          {ans ? ans.toUpperCase() : 'N/A'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Footer — save a revised result */}
          {results && (
            <div className="px-5 py-3 border-t border-gray-200 flex items-center gap-3 shrink-0 bg-white">
              {statusDirty && editStatus ? (
                <span className="text-[11px] font-bold" style={{ color: statusMeta[editStatus].text }}>
                  Changing to {editStatus}
                </span>
              ) : (
                <span className="text-[11px] text-gray-400">Pick a different result to update it</span>
              )}
              <div className="ml-auto flex gap-2">
                <button onClick={onClose} className="px-4 py-2 rounded-lg text-xs font-bold text-gray-500 hover:bg-gray-100">
                  Close
                </button>
                <button
                  onClick={handleStatusUpdate}
                  disabled={!statusDirty || isUpdating}
                  className="px-5 py-2 rounded-lg text-xs font-bold text-white bg-[#8E44AD] hover:bg-[#7D3C98] disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
                >
                  {isUpdating && <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>}
                  Update Result
                </button>
              </div>
            </div>
          )}
          </>
        )}
      </div>
    </div>
  );
};

export default GreenlineScreeningModal;
