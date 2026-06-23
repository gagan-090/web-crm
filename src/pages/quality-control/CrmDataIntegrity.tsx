import React, { useState } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────
interface UntaggedCall {
  id: string;
  time: string;
  agent: string;
  duration: string;
  tmid: string;
  reminded?: boolean;
}

interface Discrepancy {
  id: string;
  tmid: string;
  duration: string;
  logged: string;
  reason: string;
  dismissed?: boolean;
  investigated?: boolean;
}

interface DuplicateEntry {
  id: string;
  tmid: string;
  created: string;
  merged?: boolean;
}

// ── Static Data ────────────────────────────────────────────────────────────────
const INITIAL_CALLS: UntaggedCall[] = [
  { id: 'c1', time: '10:42 AM', agent: 'Ravi Kumar',    duration: '04:12', tmid: 'TM_88291' },
  { id: 'c2', time: '11:05 AM', agent: 'Ananya Singh',  duration: '12:45', tmid: 'TM_88304' },
  { id: 'c3', time: '11:18 AM', agent: 'Vikram Seth',   duration: '01:30', tmid: 'TM_88310' },
  { id: 'c4', time: '11:45 AM', agent: 'Saira Banu',    duration: '08:22', tmid: 'TM_88322' },
  { id: 'c5', time: '12:02 PM', agent: 'Deepak Rao',    duration: '03:15', tmid: 'TM_88341' },
  { id: 'c6', time: '12:30 PM', agent: 'Priya Mehta',   duration: '06:44', tmid: 'TM_88358' },
  { id: 'c7', time: '01:10 PM', agent: 'Suresh Pillai', duration: '09:00', tmid: 'TM_88370' },
  { id: 'c8', time: '01:48 PM', agent: 'Nisha Kapoor',  duration: '02:55', tmid: 'TM_88385' },
];

const INITIAL_DISCREPANCIES: Discrepancy[] = [
  {
    id: 'd1', tmid: 'TM_88210', duration: '22:04', logged: '"Not Interested"',
    reason: 'High probability of incorrect outcome for duration > 15m.',
  },
  {
    id: 'd2', tmid: 'TM_88301', duration: '00:12', logged: '"Sale Confirmed"',
    reason: 'Transaction flow physically impossible in < 1 minute.',
  },
  {
    id: 'd3', tmid: 'TM_88415', duration: '18:30', logged: '"Callback Requested"',
    reason: 'No follow-up scheduled in CRM despite callback logged outcome.',
  },
];

const INITIAL_DUPLICATES: DuplicateEntry[] = [
  { id: 'dup1', tmid: 'TMID_X9922', created: '2m ago, 4h ago'       },
  { id: 'dup2', tmid: 'TMID_B1104', created: '10m ago, 12m ago'     },
  { id: 'dup3', tmid: 'TMID_Z0054', created: 'Yesterday, Today'     },
  { id: 'dup4', tmid: 'TMID_K8832', created: '1h ago, 1h ago'       },
];

// ── Toast ──────────────────────────────────────────────────────────────────────
interface ToastProps { message: string; onClose: () => void }
const Toast: React.FC<ToastProps> = ({ message, onClose }) => (
  <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium">
    <span className="material-symbols-outlined text-green-400 text-base">check_circle</span>
    {message}
    <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white">
      <span className="material-symbols-outlined text-sm">close</span>
    </button>
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────
export const CrmDataIntegrity: React.FC = () => {
  const [calls, setCalls]                         = useState<UntaggedCall[]>(INITIAL_CALLS);
  const [discrepancies, setDiscrepancies]         = useState<Discrepancy[]>(INITIAL_DISCREPANCIES);
  const [duplicates, setDuplicates]               = useState<DuplicateEntry[]>(INITIAL_DUPLICATES);
  const [showAllCalls, setShowAllCalls]           = useState(false);
  const [toast, setToast]                         = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const displayedCalls   = showAllCalls ? calls : calls.slice(0, 4);
  const activeDups        = duplicates.filter(d => !d.merged);
  const activeDiscrep     = discrepancies.filter(d => !d.dismissed && !d.investigated);
  const integrityScore    = Math.max(0, Math.min(100, 94.8 + (resolvedCount() * 0.4))).toFixed(1);

  function resolvedCount() {
    return discrepancies.filter(d => d.dismissed || d.investigated).length
      + duplicates.filter(d => d.merged).length
      + calls.filter(c => c.reminded).length;
  }

  const handleSendReminder = (id: string) => {
    const call = calls.find(c => c.id === id);
    if (!call) return;
    setCalls(prev => prev.map(c => c.id === id ? { ...c, reminded: true } : c));
    showToast(`Reminder sent to ${call.agent} for ${call.tmid}.`);
  };

  const handleInvestigate = (id: string) => {
    const d = discrepancies.find(x => x.id === id);
    if (!d) return;
    setDiscrepancies(prev => prev.map(x => x.id === id ? { ...x, investigated: true } : x));
    showToast(`Investigation opened for ${d.tmid}.`);
  };

  const handleDismiss = (id: string) => {
    const d = discrepancies.find(x => x.id === id);
    if (!d) return;
    setDiscrepancies(prev => prev.map(x => x.id === id ? { ...x, dismissed: true } : x));
    showToast(`Discrepancy for ${d.tmid} dismissed.`);
  };

  const handleMerge = (id: string) => {
    const dup = duplicates.find(d => d.id === id);
    if (!dup) return;
    setDuplicates(prev => prev.map(d => d.id === id ? { ...d, merged: true } : d));
    showToast(`${dup.tmid} duplicates merged successfully.`);
  };

  const scoreNum = parseFloat(integrityScore);

  return (
    <main className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-white text-xs md:text-sm">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div>
        <nav className="flex items-center gap-1 text-xs text-slate-400 mb-1">
          <span>Core</span>
          <span className="material-symbols-outlined text-[10px]">chevron_right</span>
          <span className="text-slate-700 font-semibold">CRM Data Integrity</span>
        </nav>
        <h1 className="text-xl font-bold text-slate-800">CRM Data Integrity</h1>
      </div>

      {/* Summary Bar */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Untagged Calls</span>
          <span className="text-2xl font-bold text-slate-800">{calls.filter(c => !c.reminded).length}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Pending action</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Discrepancies</span>
          <span className="text-2xl font-bold text-slate-800">{activeDiscrep.length}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Requiring review</span>
        </div>
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">Duplicate IDs</span>
          <span className="text-2xl font-bold text-slate-800">{activeDups.length}</span>
          <span className="text-[10px] text-slate-400 mt-0.5">Unmerged</span>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">

        {/* ── Untagged Calls Table ─────────────────────────────────────────── */}
        <section className="col-span-12 lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="px-4 py-3 border-b border-slate-200 flex justify-between items-center">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <span className="material-symbols-outlined text-amber-500 text-base">call_missed</span>
              Untagged Calls Today
            </h2>
            <span className="bg-amber-100 text-amber-600 px-3 py-0.5 rounded-full text-[10px] font-bold uppercase">
              {calls.length} Records
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  {['Time', 'Agent Name', 'Duration', 'TMID', 'Actions'].map(h => (
                    <th key={h} className={`px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider ${h === 'Actions' ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {displayedCalls.map(c => (
                  <tr key={c.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">{c.time}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800">{c.agent}</td>
                    <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">{c.duration}</td>
                    <td className="px-4 py-3 font-mono text-amber-500 font-semibold text-[11px]">{c.tmid}</td>
                    <td className="px-4 py-3 text-right">
                      {c.reminded ? (
                        <span className="text-green-600 text-[10px] font-bold flex items-center justify-end gap-1">
                          <span className="material-symbols-outlined text-[12px]">check</span> Sent
                        </span>
                      ) : (
                        <button
                          onClick={() => handleSendReminder(c.id)}
                          className="text-amber-500 hover:underline text-[11px] font-semibold"
                        >
                          Send reminder
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {calls.length > 4 && (
            <div className="p-3 bg-slate-50 border-t border-slate-200">
              <button
                onClick={() => setShowAllCalls(v => !v)}
                className="w-full text-center text-[11px] font-semibold text-slate-500 hover:text-amber-500 transition-colors"
              >
                {showAllCalls ? 'Show less' : `View All Untagged Logs (${calls.length - 4} more)`}
              </button>
            </div>
          )}
        </section>

        {/* ── Right Column ──────────────────────────────────────────────────── */}
        <section className="col-span-12 lg:col-span-4 space-y-6">
          {/* Disposition Discrepancies */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-base">flag</span>
                Disposition Discrepancies
              </h2>
              {activeDiscrep.length > 0 && (
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {activeDiscrep.length}
                </span>
              )}
            </div>
            <div className="p-4 space-y-3">
              {discrepancies.length === 0 || activeDiscrep.length === 0 ? (
                <div className="text-center py-4 text-slate-400 text-xs">
                  <span className="material-symbols-outlined text-2xl text-green-400 block mb-1">check_circle</span>
                  All discrepancies resolved!
                </div>
              ) : (
                activeDiscrep.map(d => (
                  <div key={d.id} className="p-3 rounded-xl border-l-4 border-red-500 bg-red-50 border border-red-100">
                    <div className="flex justify-between mb-1.5">
                      <span className="font-mono text-[11px] font-bold text-slate-800">{d.tmid}</span>
                      <span className="text-[9px] font-bold text-red-600 uppercase tracking-wider">AUTO-DETECT</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mb-1">
                      Duration: <strong>{d.duration}</strong> | Logged: <strong>{d.logged}</strong>
                    </p>
                    <p className="text-[10px] text-slate-400 italic mb-3">{d.reason}</p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleInvestigate(d.id)}
                        className="bg-amber-500 text-white px-3 py-1 rounded-lg text-[11px] font-bold hover:bg-amber-600 transition-colors"
                      >
                        Investigate
                      </button>
                      <button
                        onClick={() => handleDismiss(d.id)}
                        className="border border-slate-200 px-3 py-1 rounded-lg text-[11px] font-bold hover:bg-slate-50 transition-colors"
                      >
                        Dismiss
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Incorrect Plan Amounts */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-3">
              <span className="material-symbols-outlined text-amber-500 text-base">payments</span>
              Incorrect Plan Amounts
            </h2>
            <div className="space-y-2">
              {[
                { plan: 'Elite Pro Tier',  logged: '₹12,500', required: '₹14,000' },
                { plan: 'Basic Transit',   logged: '₹4,200',  required: '₹4,500'  },
              ].map(item => (
                <div key={item.plan} className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0">
                  <div>
                    <p className="font-semibold text-slate-800 text-[11px]">{item.plan}</p>
                    <p className="text-[10px] text-slate-400">Logged: {item.logged} | Required: {item.required}</p>
                  </div>
                  <span className="material-symbols-outlined text-red-400 text-base">warning</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Duplicate TMIDs + Integrity Score ────────────────────────────── */}
        <section className="col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 bg-white border border-slate-200 rounded-xl p-4">
            <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2 mb-4">
              <span className="material-symbols-outlined text-amber-500 text-base">content_copy</span>
              Duplicate TMID Entries
            </h2>
            {activeDups.length === 0 ? (
              <div className="text-center py-4 text-slate-400 text-xs">
                <span className="material-symbols-outlined text-2xl text-green-400 block mb-1">check_circle</span>
                No duplicate entries found!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                {activeDups.map(dup => (
                  <div key={dup.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex justify-between items-center">
                    <div>
                      <p className="font-mono text-[11px] font-bold text-slate-800">{dup.tmid}</p>
                      <p className="text-[10px] text-slate-400">Created: {dup.created}</p>
                    </div>
                    <button
                      onClick={() => handleMerge(dup.id)}
                      title="Merge duplicates"
                      className="text-amber-500 hover:bg-amber-50 rounded-lg p-1.5 transition-colors"
                    >
                      <span className="material-symbols-outlined text-base">merge</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Integrity Health Score */}
          <div className="bg-amber-500 text-white rounded-xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="text-[10px] font-bold opacity-80 uppercase tracking-wider mb-2">Integrity Health Score</h3>
              <div className="text-[52px] font-black leading-none">{integrityScore}</div>
            </div>
            <div>
              <div className="w-full bg-white/20 h-2 rounded-full mb-2 overflow-hidden">
                <div
                  className="bg-white h-2 rounded-full transition-all"
                  style={{ width: `${scoreNum}%` }}
                />
              </div>
              <p className="text-[10px] opacity-80">+0.4% from previous shift</p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default CrmDataIntegrity;
