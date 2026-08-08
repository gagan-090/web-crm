import React, { useState } from 'react';
import {
  useSendMmConnectionRequestMutation,
  useGetMmConnectionRequestHistoryQuery,
  type MmConnectionRequestResult,
  type MmConnectionRequestResponse,
} from '../../services/api/webCrmApi';
import { LangChip } from './mmLang';

// ── "Send Connection Request" ───────────────────────────────────────────────
//
// When an agent can't bridge a driver and a transporter on a live conference
// call, this notifies one or both parties in a single click over every channel
// (WhatsApp via AiSensy + push + in-app). The backend resolves the transporter
// from the job, dedups repeats and writes the activity log; this modal just
// picks the recipient and shows the outcome + how many were already sent.

interface Props {
  open: boolean;
  jobId: string;
  driver: { driver_id: number; name: string; unique_id: string };
  transporterName?: string | null;
  hasTransporter: boolean;
  onClose: () => void;
}

type Recipient = 'driver' | 'transporter' | 'both';

const relTime = (iso?: string | null): string => {
  if (!iso) return 'never';
  const d = new Date(iso.replace(' ', 'T'));
  if (isNaN(d.getTime())) return iso;
  const mins = Math.round((Date.now() - d.getTime()) / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short' });
};

const channelChip = (label: string, status?: string) => {
  const s = (status || 'skipped').toLowerCase();
  const cls =
    s === 'sent' ? 'bg-green-50 text-green-700 border-green-200'
    : s === 'failed' ? 'bg-red-50 text-red-600 border-red-200'
    : 'bg-gray-50 text-gray-400 border-gray-200';
  return (
    <span key={label} className={`text-[9px] font-bold px-1.5 py-0.5 rounded border uppercase ${cls}`}>
      {label}: {s}
    </span>
  );
};

const MmConnectionRequestModal: React.FC<Props> = ({ open, jobId, driver, transporterName, hasTransporter, onClose }) => {
  const [recipient, setRecipient] = useState<Recipient>(hasTransporter ? 'both' : 'driver');
  const [results, setResults] = useState<MmConnectionRequestResult[] | null>(null);
  const [interested, setInterested] = useState<MmConnectionRequestResponse['interested_drivers'] | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [send, { isLoading }] = useSendMmConnectionRequestMutation();
  const { data: historyData, isFetching: histLoading } = useGetMmConnectionRequestHistoryQuery(
    { driver_id: driver.driver_id, job_id: jobId },
    { skip: !open }
  );
  const history = historyData?.data;

  const notifiesTransporter = recipient === 'transporter' || recipient === 'both';

  if (!open) return null;

  const options: Array<{ value: Recipient; label: string; disabled?: boolean; hint?: string }> = [
    { value: 'driver', label: 'Notify Driver' },
    { value: 'transporter', label: 'Notify Transporter', disabled: !hasTransporter, hint: hasTransporter ? undefined : 'No transporter on this job' },
    { value: 'both', label: 'Notify Both', disabled: !hasTransporter, hint: hasTransporter ? undefined : 'No transporter on this job' },
  ];

  const doSend = async () => {
    setError(null);
    try {
      // No `force` — the backend has no dedup window, so every send goes out.
      const res = await send({ driver_id: driver.driver_id, job_id: jobId, recipient }).unwrap();
      setResults(res.results);
      setInterested(res.interested_drivers ?? []);
    } catch (e: any) {
      setError(e?.data?.message || 'Failed to send connection request');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[92vh] flex flex-col">

        {/* Header */}
        <div className="px-5 py-3.5 border-b border-gray-100 shrink-0 flex items-start justify-between">
          <div>
            <h3 className="font-extrabold text-gray-800 text-sm flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-[#8E44AD]">forward_to_inbox</span>
              Send Connection Request
            </h3>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Job <span className="font-mono text-gray-600">{jobId}</span> · {driver.name}
              <span className="font-mono"> · {driver.unique_id}</span>
            </p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <span className="material-symbols-outlined text-lg">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 custom-scrollbar">

          {/* Already-sent summary */}
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
              <p className="text-[9px] text-gray-400 uppercase font-bold">Driver</p>
              <p className="text-sm font-extrabold text-gray-800">{histLoading ? '…' : history?.driver.total_sent ?? 0} <span className="text-[10px] font-medium text-gray-400">sent</span></p>
              <p className="text-[10px] text-gray-400">Last: {relTime(history?.driver.last_sent_at)}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-2.5 border border-gray-100">
              <p className="text-[9px] text-gray-400 uppercase font-bold">Transporter{transporterName ? ` · ${transporterName}` : ''}</p>
              <p className="text-sm font-extrabold text-gray-800">{histLoading ? '…' : history?.transporter.total_sent ?? 0} <span className="text-[10px] font-medium text-gray-400">sent</span></p>
              <p className="text-[10px] text-gray-400">Last: {relTime(history?.transporter.last_sent_at)}</p>
            </div>
          </div>

          {/* Recipient selection */}
          <div className="space-y-1.5">
            <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block">Notify</span>
            <div className="grid grid-cols-3 gap-2">
              {options.map(opt => (
                <button
                  key={opt.value}
                  disabled={opt.disabled}
                  title={opt.hint}
                  onClick={() => { setRecipient(opt.value); setResults(null); setInterested(null); }}
                  className={`py-2 rounded-lg border font-bold text-[10px] transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                    recipient === opt.value
                      ? 'bg-purple-100 border-[#8E44AD] text-[#7D3C98]'
                      : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-50'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {/* Channels note */}
          <div className="bg-blue-50/60 border border-blue-100 rounded-lg p-2.5 text-[10px] text-blue-800 flex items-start gap-1.5">
            <span className="material-symbols-outlined text-[14px] mt-px">info</span>
            <span>
              Sends over WhatsApp, an in-app push notification and the app's notification list at once.
              {notifiesTransporter && ' The transporter gets the list of every driver marked "Interested in the Job" for this job.'}
            </span>
          </div>

          {/* Context only. A single send always announces THIS driver — it no
              longer swaps in an interested-driver shortlist, which used to mean
              the transporter heard about people the agent hadn't opened. Use
              "Send Connection to Transporter" to send a shortlist you pick. */}
          {interested && interested.length > 0 && notifiesTransporter && (
            <div className="space-y-1.5">
              <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block">
                Also marked interested on this job ({interested.length})
              </span>
              <div className="rounded-lg border border-gray-100 bg-gray-50/60 divide-y divide-gray-100 max-h-40 overflow-y-auto custom-scrollbar">
                {interested.map((d, i) => (
                  <div key={d.id} className="flex items-center gap-2 px-2.5 py-1.5">
                    <span className="text-[10px] font-bold text-gray-400 w-4 shrink-0">{i + 1}.</span>
                    <span className="text-[11px] font-semibold text-gray-800 truncate">{d.name}</span>
                    <span className="text-[9px] font-mono text-gray-400 ml-auto shrink-0">{d.tm_id}</span>
                    <span className="shrink-0"><LangChip lang={d.lang_sent} raw={d.lang} /></span>
                  </div>
                ))}
              </div>
              <p className="text-[9.5px] text-gray-400 italic">
                Not included in this send — use "Send Connection to Transporter" to share a shortlist.
              </p>
            </div>
          )}

          {/* Result */}
          {results && (
            <div className="space-y-2">
              <span className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block">Result</span>
              {results.map(r => (
                <div key={r.recipient} className={`rounded-lg p-2.5 border ${r.skipped ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-200'}`}>
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-gray-700 capitalize text-[11px] truncate">{r.recipient}{r.recipient_name ? ` · ${r.recipient_name}` : ''}</span>
                    <span className="flex items-center gap-1 shrink-0">
                      {/* Language the recipient's own user_lang resolved to. */}
                      {!r.skipped && <LangChip lang={r.language} />}
                      {r.skipped && <span className="text-[9px] font-bold text-amber-600 uppercase">Skipped</span>}
                    </span>
                  </div>
                  {/* A single send always uses the single-driver template now;
                      the shortlist template belongs to the bulk flow. */}
                  {!r.skipped && r.recipient === 'transporter' && (
                    <p className="text-[9.5px] text-gray-400 mt-0.5">
                      Single-driver template{r.campaign ? ` · ${r.campaign}` : ''}
                    </p>
                  )}
                  {r.skipped ? (
                    <p className="text-[10px] text-amber-700 mt-0.5">{r.message}</p>
                  ) : (
                    <>
                      <div className="flex flex-wrap gap-1 mt-1.5">
                        {channelChip('WA', r.channels?.whatsapp)}
                        {channelChip('Push', r.channels?.push)}
                        {channelChip('App', r.channels?.in_app)}
                      </div>
                      {/* Why a channel didn't go through */}
                      {(r.channel_notes?.push || r.channel_notes?.whatsapp) && (
                        <div className="mt-1.5 space-y-0.5">
                          {r.channels?.push !== 'sent' && r.channel_notes?.push && (
                            <p className="text-[9.5px] text-gray-500">Push {r.channels?.push}: {r.channel_notes.push}</p>
                          )}
                          {r.channels?.whatsapp !== 'sent' && r.channel_notes?.whatsapp && (
                            <p className="text-[9.5px] text-gray-500 break-words">WhatsApp {r.channels?.whatsapp}: {r.channel_notes.whatsapp}</p>
                          )}
                        </div>
                      )}
                    </>
                  )}
                </div>
              ))}
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
          {/* The amber "Resend anyway" button lived here. With no dedup window
              there is nothing to override — plain Send always sends. */}
          <button
            onClick={() => doSend()}
            disabled={isLoading}
            className="px-4 py-1.5 rounded-lg text-[11px] font-bold text-white bg-[#8E44AD] hover:bg-[#7D3C98] disabled:opacity-50 flex items-center gap-1.5"
          >
            <span className="material-symbols-outlined text-sm">send</span>
            {isLoading ? 'Sending…' : results ? 'Send again' : 'Send'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MmConnectionRequestModal;
