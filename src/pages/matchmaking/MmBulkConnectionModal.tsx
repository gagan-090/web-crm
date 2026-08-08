import React, { useState } from 'react';
import {
  useBulkSendMmConnectionRequestMutation,
  type MmBulkConnectionResponse,
} from '../../services/api/webCrmApi';
import { LangChip } from './mmLang';

// ── "Send Connection to Transporter" ────────────────────────────────────────
//
// Sends the transporter a shortlist of drivers for this job, and optionally
// notifies those drivers too (WhatsApp + push + in-app).
//
// The agent picks the shortlist from the job's own applicants. Nothing is
// derived from dispositions — the old "Interested in the Job" coupling is gone
// entirely, because who to connect is the agent's judgement, not a by-product
// of how a previous call was logged.
//
// Nothing is pre-ticked either: a shortlist that arrives pre-filled invites a
// straight-through send, and these messages go out over WhatsApp to real
// drivers. Every recipient is an explicit choice.

export interface BulkApplicantOption {
  driver_id: number;
  name: string;
  unique_id: string;
}

interface Props {
  open: boolean;
  jobId: string;
  /** Every applicant on this job, for the picker. */
  applicants: BulkApplicantOption[];
  hasTransporter: boolean;
  transporterName?: string | null;
  onClose: () => void;
}

const MmBulkConnectionModal: React.FC<Props> = ({ open, jobId, applicants, hasTransporter, transporterName, onClose }) => {
  // This entry point exists to notify the transporter, so that defaults on.
  const [notifyTransporter, setNotifyTransporter] = useState(true);
  // Messaging the drivers is the agent's explicit call — off until they say so.
  const [notifyDrivers, setNotifyDrivers] = useState(false);
  const [selected, setSelected] = useState<number[]>([]);
  // Open by default: with nothing pre-ticked, a collapsed picker would show an
  // empty selection and no obvious way to fill it.
  const [pickerOpen, setPickerOpen] = useState(true);
  const [pickerSearch, setPickerSearch] = useState('');
  const [result, setResult] = useState<MmBulkConnectionResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bulkSend, { isLoading }] = useBulkSendMmConnectionRequestMutation();

  // Open with an empty selection every time — see the note at the top of the
  // file on why nothing is pre-ticked.
  React.useEffect(() => {
    if (!open) return;
    setSelected([]);
    setResult(null);
    setError(null);
    setPickerSearch('');
    setPickerOpen(true);
  }, [open, applicants]);

  const visibleApplicants = React.useMemo(() => {
    const q = pickerSearch.trim().toLowerCase();
    if (!q) return applicants;
    return applicants.filter(a =>
      a.name.toLowerCase().includes(q) || a.unique_id.toLowerCase().includes(q)
    );
  }, [applicants, pickerSearch]);

  const selectedApplicants = applicants.filter(a => selected.includes(a.driver_id));

  const toggle = (id: number) =>
    setSelected(prev => (prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]));

  if (!open) return null;

  const nothingToDo = selected.length === 0 || (!notifyTransporter && !notifyDrivers);

  const doSend = async () => {
    setError(null);
    try {
      // No `force` — the backend has no dedup window, so every send goes out.
      const res = await bulkSend({
        job_id: jobId,
        driver_ids: selected,
        notify_drivers: notifyDrivers,
        notify_transporter: notifyTransporter,
      }).unwrap();
      setResult(res);
    } catch (e: any) {
      setError(e?.data?.message || 'Failed to send connection request');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 shrink-0 flex items-start justify-between">
          <div>
            <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#8E44AD]">local_shipping</span>
              Send Connection to Transporter
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Job <span className="font-mono text-gray-600">{jobId}</span>
              {transporterName ? <> · {transporterName}</> : null}
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">

          {!result ? (
            <>
              {/* Driver shortlist picker — name + TMID */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                    Drivers to share ({selected.length}/{applicants.length})
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelected(applicants.map(a => a.driver_id))}
                      className="text-[10px] font-bold text-[#8E44AD] hover:underline"
                    >Select all</button>
                    <button
                      onClick={() => setSelected([])}
                      className="text-[10px] font-bold text-gray-400 hover:underline"
                    >Clear</button>
                  </div>
                </div>

                <button
                  onClick={() => setPickerOpen(o => !o)}
                  className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-lg border border-gray-300 bg-white text-left hover:border-[#8E44AD] transition-colors"
                >
                  <span className="text-[11px] text-gray-700 truncate">
                    {selected.length === 0
                      ? 'No driver selected'
                      : selectedApplicants.slice(0, 2).map(a => a.name).join(', ') +
                        (selected.length > 2 ? ` +${selected.length - 2} more` : '')}
                  </span>
                  <span className="material-symbols-outlined text-[18px] text-gray-400 shrink-0">
                    {pickerOpen ? 'expand_less' : 'expand_more'}
                  </span>
                </button>

                {pickerOpen && (
                  <div className="mt-1.5 border border-gray-200 rounded-lg overflow-hidden">
                    <div className="p-2 border-b border-gray-100 bg-gray-50">
                      <input
                        value={pickerSearch}
                        onChange={e => setPickerSearch(e.target.value)}
                        placeholder="Search name or TMID…"
                        className="w-full px-2.5 py-1.5 text-[11px] border border-gray-200 rounded-md outline-none focus:border-[#8E44AD]"
                      />
                    </div>
                    <div className="max-h-52 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
                      {visibleApplicants.length === 0 ? (
                        <p className="px-3 py-4 text-[11px] text-gray-400 italic text-center">No applicant matches.</p>
                      ) : visibleApplicants.map(a => (
                        <label
                          key={a.driver_id}
                          className="flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            checked={selected.includes(a.driver_id)}
                            onChange={() => toggle(a.driver_id)}
                            className="text-[#8E44AD] focus:ring-[#8E44AD] rounded shrink-0"
                          />
                          <span className="text-[11px] font-semibold text-gray-800 truncate">{a.name}</span>
                          <span className="text-[9px] font-mono text-gray-400 shrink-0">{a.unique_id}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {hasTransporter ? (
                <label className="flex items-start gap-2 text-[11px] font-semibold text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={notifyTransporter}
                    onChange={e => setNotifyTransporter(e.target.checked)}
                    className="text-[#8E44AD] focus:ring-[#8E44AD] rounded mt-0.5"
                  />
                  <span>
                    Send the transporter{transporterName ? ` (${transporterName})` : ''} this driver shortlist
                  </span>
                </label>
              ) : (
                <p className="text-[11px] text-amber-600 font-semibold">
                  This job has no transporter account on file — only the drivers can be notified.
                </p>
              )}

              {/* The explicit "…and the drivers too?" question. */}
              <label className="flex items-start gap-2 text-[11px] font-semibold text-gray-700 cursor-pointer bg-green-50/60 border border-green-100 rounded-lg p-2.5">
                <input
                  type="checkbox"
                  checked={notifyDrivers}
                  onChange={e => setNotifyDrivers(e.target.checked)}
                  className="text-green-600 focus:ring-green-600 rounded mt-0.5"
                />
                <span>
                  Also send the connection request to the selected driver{selected.length === 1 ? '' : 's'}?
                  <span className="block text-[10px] font-normal text-green-800 mt-0.5">
                    Each driver gets WhatsApp, push and an in-app notification in their own app language.
                  </span>
                </span>
              </label>

              {nothingToDo && (
                <p className="text-[10px] text-gray-400 italic">
                  {selected.length === 0
                    ? 'Select at least one driver to continue.'
                    : 'Tick the transporter and/or the drivers to continue.'}
                </p>
              )}
            </>
          ) : (
            <div className="space-y-3">
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-green-50 rounded-lg p-2 border border-green-100">
                  <p className="text-lg font-extrabold text-green-700">{result.sent}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Sent</p>
                </div>
                <div className="bg-amber-50 rounded-lg p-2 border border-amber-100">
                  <p className="text-lg font-extrabold text-amber-600">{result.skipped}</p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">Skipped</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-2 border border-gray-100">
                  <p className="text-lg font-extrabold text-gray-700">
                    {result.recipients_count ?? result.interested_drivers_count}
                  </p>
                  <p className="text-[9px] text-gray-400 font-bold uppercase">
                    {result.source === 'selected' ? 'Selected' : 'Interested'}
                  </p>
                </div>
              </div>

              <p className="text-[11px] font-semibold text-gray-700">{result.message}</p>

              {result.transporter && (
                <div className={`rounded-lg p-2.5 border text-[10px] ${result.transporter.skipped ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-gray-200 text-gray-600'}`}>
                  <div className="flex items-center gap-1.5">
                    <b>Transporter{result.transporter.recipient_name ? ` · ${result.transporter.recipient_name}` : ''}</b>
                    {/* The transporter's own app language, independent of the
                        drivers' — the shortlist template is per-language too. */}
                    {!result.transporter.skipped && <LangChip lang={result.transporter.language} />}
                  </div>
                  <div className="mt-0.5">
                    {result.transporter.skipped
                      ? result.transporter.message
                      : `WA ${result.transporter.channels?.whatsapp} · Push ${result.transporter.channels?.push} · App ${result.transporter.channels?.in_app}`}
                  </div>
                  {!result.transporter.skipped && result.transporter.channels?.whatsapp !== 'sent' && result.transporter.channel_notes?.whatsapp && (
                    <div className="mt-0.5 text-[9.5px] text-gray-500 break-words">
                      WhatsApp {result.transporter.channels?.whatsapp}: {result.transporter.channel_notes.whatsapp}
                    </div>
                  )}
                </div>
              )}

              {result.results.length > 0 && (
                <div className="rounded-lg border border-gray-100 divide-y divide-gray-100 max-h-52 overflow-y-auto custom-scrollbar">
                  {result.results.map((r, i) => (
                    <div key={i} className="flex items-center gap-2 px-2.5 py-1.5">
                      <span className="text-[11px] font-semibold text-gray-800 truncate">{r.recipient_name || 'Driver'}</span>
                      <span className="text-[9px] font-mono text-gray-400 shrink-0">{r.recipient_tm_id}</span>
                      {/* Each driver is messaged in his own app language, so a
                          single batch can mix English/Hindi/Hinglish. */}
                      {!r.skipped && <span className="shrink-0"><LangChip lang={r.language} /></span>}
                      <span className="ml-auto shrink-0">
                        {r.skipped ? (
                          <span className="text-[9px] font-bold text-amber-600 uppercase">skipped</span>
                        ) : (
                          <span className={`text-[9px] font-bold uppercase ${r.channels?.whatsapp === 'sent' || r.channels?.push === 'sent' || r.channels?.in_app === 'sent' ? 'text-green-600' : 'text-red-500'}`}>
                            WA:{r.channels?.whatsapp} · P:{r.channels?.push} · A:{r.channels?.in_app}
                          </span>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-2.5 text-[11px] text-red-600 font-semibold">{error}</div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-gray-100 shrink-0 flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1.5 rounded-lg text-[11px] font-bold text-gray-500 hover:bg-gray-100">
            Close
          </button>
          {/* The amber "Resend all" button lived here. With no dedup window
              there is nothing to override — plain Send always sends. */}
          <button
            onClick={() => doSend()}
            disabled={isLoading || nothingToDo}
            className="px-4 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#8E44AD] hover:bg-[#7D3C98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">send</span>
            {isLoading
              ? 'Sending…'
              : result
                ? 'Send again'
                : notifyDrivers && notifyTransporter
                  ? `Send to transporter + ${selected.length} driver${selected.length === 1 ? '' : 's'}`
                  : notifyDrivers
                    ? `Notify ${selected.length} driver${selected.length === 1 ? '' : 's'}`
                    : 'Send to transporter'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MmBulkConnectionModal;
