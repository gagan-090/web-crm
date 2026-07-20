import React, { useEffect, useState } from 'react';
import { useGetMmApplicantsFullQuery, type MmApplicant } from '../../services/api/webCrmApi';

// ── Add an applicant to the live call ───────────────────────────────────────
//
// Opened from the CTI call bar while a transporter call for this job is
// connected. The agent finds the applicant by NAME or TMID — the backend
// applicant search already matches users.name and users.unique_id — and adds
// them straight into the conference. No mobile number is shown (or searchable)
// anywhere: the CTI dials from the record, the agent never needs to see it.

interface Props {
  open: boolean;
  jobId: string;
  onClose: () => void;
  onAdd: (driver: MmApplicant) => void;
  /** Driver ids already bridged into this call. */
  addedIds?: number[];
}

const MmAddToCallModal: React.FC<Props> = ({ open, jobId, onClose, onAdd, addedIds = [] }) => {
  const [term, setTerm] = useState('');
  const [search, setSearch] = useState('');

  // Debounced so typing doesn't fire a request per keystroke.
  useEffect(() => {
    const t = setTimeout(() => setSearch(term.trim()), 300);
    return () => clearTimeout(t);
  }, [term]);

  const { data, isFetching } = useGetMmApplicantsFullQuery(
    { jobId, per_page: 25, search: search || undefined },
    { skip: !open || !jobId },
  );

  if (!open) return null;

  const applicants: MmApplicant[] = data?.data ?? [];

  return (
    <div className="fixed inset-0 bg-black/50 z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[80vh] flex flex-col">

        <div className="flex items-center justify-between px-5 py-3.5 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="font-extrabold text-gray-800 text-sm">Add applicant to call</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Search by driver name or TMID</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg border border-gray-200 text-gray-400 hover:text-gray-600 flex items-center justify-center"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="px-5 py-3 border-b border-gray-100 shrink-0">
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">
              search
            </span>
            <input
              autoFocus
              value={term}
              onChange={e => setTerm(e.target.value)}
              placeholder="Name or TMID…"
              className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#8E44AD]"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-3 space-y-1.5 custom-scrollbar">
          {isFetching && applicants.length === 0 ? (
            <div className="space-y-1.5">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-xl animate-pulse" />
              ))}
            </div>
          ) : applicants.length === 0 ? (
            <p className="text-center text-gray-400 italic py-8 text-[11px]">
              {search ? 'No applicant matches that name or TMID.' : 'No applicants on this job yet.'}
            </p>
          ) : (
            applicants.map(a => {
              const added = addedIds.includes(a.driver_id);
              return (
                <div
                  key={a.application_id}
                  className="flex items-center gap-2.5 border border-gray-200 rounded-xl p-2.5 hover:bg-gray-50"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center text-white font-extrabold text-xs shrink-0">
                    {a.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-gray-800 text-xs truncate">{a.name}</p>
                    <p className="font-mono text-[10px] text-gray-400 truncate">
                      {a.unique_id}
                      {a.state && <span> · {a.state}</span>}
                      {a.experience && <span> · {a.experience}</span>}
                    </p>
                  </div>
                  <button
                    onClick={() => onAdd(a)}
                    disabled={added}
                    className={`px-3 py-1.5 rounded-lg font-bold text-[10px] shadow-sm flex items-center gap-1 shrink-0 ${
                      added
                        ? 'bg-gray-100 text-gray-400 cursor-default'
                        : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                    }`}
                  >
                    <span className="material-symbols-outlined text-xs">group_add</span>
                    {added ? 'Added' : 'Add Call'}
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default MmAddToCallModal;
