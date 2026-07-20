import React, { useState } from 'react';
import {
  MM_TRANSPORTER_CONNECTED_OPTIONS,
  MM_DRIVER_CONNECTED_OPTIONS,
  DWC_NOT_CONNECTED_OPTIONS,
} from '../../shared/components/cti/PostCallDispositionModal';
import { useSubmitMmConferenceDispositionMutation } from '../../services/api/webCrmApi';
import type { MmConferenceParty } from '../../shared/components/cti/mmCallContext';

// ── Disposition for a conferenced party ─────────────────────────────────────
//
// A party bridged into a live call gets its OWN call_history_ivr row (see
// MmCallerController::mmConferenceCall), so it owes its own disposition — the
// mobile app behaves the same way, navigating to MatchmakingFeedback for the
// transporter leg of a con call before returning to the applicant feedback.
//
// The option lists and level-1 choices are IMPORTED from the global
// PostCallDispositionModal rather than restated, so the conferenced transporter
// sees exactly the same feedback options and the same validations as a
// directly-dialled one. The primary call keeps using the global CTI modal.

interface Props {
  open: boolean;
  party: MmConferenceParty;
  callId: number;
  onClose: () => void;
  onSubmitted: (result: { disposition: string; disposition_sub: string }) => void;
}

const MmConferenceDispositionModal: React.FC<Props> = ({ open, party, callId, onClose, onSubmitted }) => {
  const [submit, { isLoading }] = useSubmitMmConferenceDispositionMutation();

  const [level1, setLevel1] = useState<'connected' | 'not_connected' | ''>('connected');
  const [sub, setSub] = useState('');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);

  if (!open) return null;

  const connectedOptions = party.role === 'transporter'
    ? MM_TRANSPORTER_CONNECTED_OPTIONS
    : MM_DRIVER_CONNECTED_OPTIONS;

  // Same rule the global modal applies: a level-1 AND a level-2 choice are
  // both required before the disposition can be submitted.
  const canSubmit = !!level1 && !!sub && !isLoading;

  const handleSubmit = async () => {
    if (!canSubmit) return;
    setError(null);
    try {
      await submit({
        call_id: callId,
        user_id: party.id,
        disposition: level1,
        disposition_sub: sub,
        notes: notes || null,
      }).unwrap();
      onSubmitted({ disposition: level1, disposition_sub: sub });
      onClose();
    } catch (err) {
      const apiMessage = (err as { data?: { message?: string } })?.data?.message;
      setError(apiMessage || 'Failed to save the disposition. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">

        <div className="px-5 py-3.5 border-b border-gray-100 shrink-0">
          <h3 className="font-extrabold text-gray-800 text-sm">
            Feedback — {party.role === 'transporter' ? 'Transporter' : 'Applicant'}
          </h3>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {party.name}
            {party.unique_id && <span className="font-mono"> · {party.unique_id}</span>}
            <span className="ml-1">was added to this call</span>
          </p>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">
          {/* Level 1 */}
          <div className="space-y-1.5">
            <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block">Call outcome</span>
            <div className="flex gap-2">
              {[
                { value: 'connected', label: 'Connected' },
                { value: 'not_connected', label: 'Not Connected' },
              ].map(opt => (
                <button
                  key={opt.value}
                  onClick={() => { setLevel1(opt.value as 'connected' | 'not_connected'); setSub(''); }}
                  className={`flex-1 py-2 rounded-lg border font-bold text-[11px] ${
                    level1 === opt.value
                      ? 'bg-purple-100 border-[#8E44AD] text-[#7D3C98]'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Level 2 */}
          <div className="space-y-1.5">
            <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block">Feedback</span>
            <div className="space-y-1 max-h-64 overflow-y-auto custom-scrollbar pr-1">
              {level1 === 'connected'
                ? connectedOptions.map(opt => (
                    <label
                      key={opt.value}
                      className={`flex items-start gap-2 p-2 rounded-lg border cursor-pointer ${
                        sub === opt.value ? 'bg-purple-50 border-[#8E44AD]' : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="mm-conf-sub"
                        checked={sub === opt.value}
                        onChange={() => setSub(opt.value)}
                        className="mt-0.5 text-[#8E44AD] focus:ring-[#8E44AD]"
                      />
                      <span className="flex-1">
                        <span className="block font-bold text-gray-800 text-[11px]">{opt.label}</span>
                        <span className="block text-[10px] text-gray-400">{opt.label_hi}</span>
                      </span>
                    </label>
                  ))
                : DWC_NOT_CONNECTED_OPTIONS.map(opt => (
                    <label
                      key={opt}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer ${
                        sub === opt ? 'bg-purple-50 border-[#8E44AD]' : 'bg-white border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <input
                        type="radio"
                        name="mm-conf-sub"
                        checked={sub === opt}
                        onChange={() => setSub(opt)}
                        className="text-[#8E44AD] focus:ring-[#8E44AD]"
                      />
                      <span className="font-bold text-gray-800 text-[11px]">{opt}</span>
                    </label>
                  ))}
            </div>
          </div>

          {/* Notes */}
          <label className="block">
            <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block mb-1">Remarks</span>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={3}
              placeholder="Optional notes from the conference…"
              className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 text-xs font-medium text-gray-800 outline-none focus:ring-1 focus:ring-[#8E44AD] focus:border-[#8E44AD]"
            />
          </label>

          {error && (
            <p className="text-red-600 font-bold text-[11px] bg-red-50 border border-red-100 rounded-lg px-2.5 py-1.5">
              {error}
            </p>
          )}
        </div>

        <div className="flex gap-3 px-5 py-3.5 border-t border-gray-100 shrink-0">
          <button
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-gray-500 font-bold hover:bg-gray-100 disabled:opacity-50"
          >
            Later
          </button>
          <button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-[2] py-2.5 rounded-xl bg-[#8E44AD] hover:bg-[#7D3C98] text-white font-extrabold shadow-sm disabled:opacity-50"
          >
            {isLoading ? 'Saving…' : 'Save Feedback'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MmConferenceDispositionModal;
