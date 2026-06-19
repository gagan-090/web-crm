import React, { useState } from 'react';

interface UntaggedCall {
  id: string;
  caller: string;
  timestamp: string;
  durationSeconds: number;
  leadName: string;
  tmid: string;
}

interface PriorityItem {
  id: string;
  title: string;
  time: string;
  detail: string;
  type: 'escalation' | 'callback' | 'audit';
}

export const TlDailyWrapUpPanel: React.FC = () => {
  const [tlMode, setTlMode] = useState<'dw' | 'tr-mm'>('dw');
  const [wrapUpSubmitted, setWrapUpSubmitted] = useState(false);
  const [dailyNotes, setDailyNotes] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Untagged calls datasets
  const [dwUntagged, setDwUntagged] = useState<UntaggedCall[]>([
    { id: 'u1', caller: 'Rahul S.', timestamp: '16:42', durationSeconds: 3, leadName: 'Suresh Yadav', tmid: 'DR-48291' },
    { id: 'u2', caller: 'Sonia R.', timestamp: '17:05', durationSeconds: 45, leadName: 'Amit Singh', tmid: 'DR-48292' },
    { id: 'u3', caller: 'Aman K.', timestamp: '17:15', durationSeconds: 4, leadName: 'Ramesh Kumar', tmid: 'DR-48293' },
    { id: 'u4', caller: 'Priya P.', timestamp: '17:30', durationSeconds: 2, leadName: 'Vikram Rathore', tmid: 'DR-48294' }
  ]);

  const [trUntagged, setTrUntagged] = useState<UntaggedCall[]>([
    { id: 'u5', caller: 'Alex R.', timestamp: '16:50', durationSeconds: 2, leadName: 'Agrawal Global', tmid: 'TR-12094' },
    { id: 'u6', caller: 'Sarah C.', timestamp: '17:08', durationSeconds: 120, leadName: 'Kunal Logistics', tmid: 'TR-12095' },
    { id: 'u7', caller: 'Marcus T.', timestamp: '17:22', durationSeconds: 1, leadName: 'Sharma Logistics', tmid: 'TR-12096' }
  ]);

  const untaggedCalls = tlMode === 'dw' ? dwUntagged : trUntagged;
  const setUntaggedCalls = tlMode === 'dw' ? setDwUntagged : setTrUntagged;

  // Tomorrow's priorities list
  const dwPriorities: PriorityItem[] = [
    { id: 'p1', title: 'Overdue SLA Escalation: DR-48291', time: '08:00 AM', detail: '3rd NR attempt, pending reassignment', type: 'escalation' },
    { id: 'p2', title: 'Callback: Suresh Yadav (DR-48291)', time: '09:30 AM', detail: 'Assigned to Rahul S. (Rescheduled)', type: 'callback' },
    { id: 'p3', title: 'Soft Skills Training Assignment', time: '11:00 AM', detail: 'Assign logs review with Sonia R.', type: 'audit' }
  ];

  const trPriorities: PriorityItem[] = [
    { id: 'p4', title: 'TR SLA Breach Risk: TR-12094', time: '08:00 AM', detail: 'Agrawal Global 1 day left in MM queue', type: 'escalation' },
    { id: 'p5', title: 'Callback: Kunal Logistics (TR-12095)', time: '10:00 AM', detail: 'Sarah C. scheduled ping', type: 'callback' }
  ];

  const priorities = tlMode === 'dw' ? dwPriorities : trPriorities;

  // Resolve individual untagged (only allowed if < 5 seconds)
  const handleOverrideCall = (id: string, leadName: string, duration: number) => {
    if (duration >= 5) {
      triggerToast('Locked: EOD Tagging Compliance requires manual caller disposition for durations ≥ 5s.');
      return;
    }
    setUntaggedCalls(prev => prev.filter(c => c.id !== id));
    triggerToast(`Auto-resolved short call (< 5s) for ${leadName} ✓`);
  };

  // Bulk Resolve all < 5 seconds calls
  const handleBulkResolveShortCalls = () => {
    const overrideable = untaggedCalls.filter(c => c.durationSeconds < 5);
    if (overrideable.length === 0) {
      triggerToast('No short calls (< 5s) available to auto-resolve');
      return;
    }
    setUntaggedCalls(prev => prev.filter(c => c.durationSeconds >= 5));
    triggerToast(`Bulk auto-resolved ${overrideable.length} calls (< 5s) ✓`);
  };

  // Submit wrap up
  const handleSubmitReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dailyNotes.trim()) {
      triggerToast('Please write some shift highlights before submitting');
      return;
    }

    if (untaggedCalls.filter(c => c.durationSeconds >= 5).length > 0) {
      triggerToast('Submit Blocked: Resolve all taggable calls (≥ 5s) or remind agents before EOD submit.');
      return;
    }

    setWrapUpSubmitted(true);
    triggerToast('Daily Shift Wrap-Up report successfully sent to Telecalling Head! ✓');
  };

  return (
    <main className="p-6 space-y-6 max-w-7xl mx-auto w-full overflow-y-auto max-h-[calc(100vh-60px)] relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#F39C12]"></span>
          {toastMessage}
        </div>
      )}

      {/* Header controls strip */}
      <div className="p-4 bg-gray-50 border border-gray-250 rounded-xl flex justify-between items-center shrink-0">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-gray-850">Daily Shift Wrap-Up Panel</h1>
              <span className="bg-orange-100 text-[#D35400] text-[9.5px] px-2 py-0.5 rounded-full font-bold animate-pulse flex items-center gap-1">
                <span className="w-1.5 h-1.5 bg-[#F39C12] rounded-full"></span>
                WRAP-UP ACTIVE (AFTER 5 PM)
              </span>
            </div>
            <p className="text-[11px] text-gray-400 mt-0.5">Validate compliance, tag short calls, and submit shift handover logs</p>
          </div>
        </div>

        {/* Mode Switcher */}
        <button
          onClick={() => {
            const nextMode = tlMode === 'dw' ? 'tr-mm' : 'dw';
            setTlMode(nextMode);
            setWrapUpSubmitted(false);
            triggerToast(`Switched daily wrap-up stats to ${nextMode === 'dw' ? 'Driver Welcome' : 'Transporter + Matchmaking'}`);
          }}
          className="bg-[#F39C12] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow-md hover:bg-[#e08e0b]"
        >
          Toggle: {tlMode === 'dw' ? 'Driver Welcome' : 'Transporter+MM'}
        </button>
      </div>

      {/* Stats / Handover comparison section */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm relative overflow-hidden group">
          <span className="text-[10px] font-bold uppercase text-gray-450">Queue Completion Rate</span>
          <h2 className="text-2xl font-extrabold text-gray-850 mt-1">{tlMode === 'dw' ? '94.2%' : '88.5%'}</h2>
          <div className="mt-3 w-full bg-gray-100 h-1.5 rounded-full">
            <div className="bg-[#F39C12] h-full" style={{ width: tlMode === 'dw' ? '94.2%' : '88.5%' }}></div>
          </div>
          <p className="text-[10px] text-gray-400 font-semibold mt-2">{tlMode === 'dw' ? '+2.4% vs Yesterday' : '+0.5% vs Yesterday'}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center flex flex-col justify-center">
          <span className="material-symbols-outlined text-[#F39C12] text-2xl mb-1">task_alt</span>
          <h3 className="text-2xl font-extrabold text-gray-850">{tlMode === 'dw' ? '412' : '95'}</h3>
          <p className="text-[10px] font-bold uppercase text-gray-450 mt-1">Aggregated Calls Made</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center flex flex-col justify-center">
          <span className="material-symbols-outlined text-purple-600 text-2xl mb-1">handshake</span>
          <h3 className="text-2xl font-extrabold text-gray-850">{tlMode === 'dw' ? '38' : '23'}</h3>
          <p className="text-[10px] font-bold uppercase text-gray-450 mt-1">{tlMode === 'dw' ? 'Conversions' : 'Matchmaking Placements'}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm text-center flex flex-col justify-center">
          <span className={`material-symbols-outlined text-2xl mb-1 ${untaggedCalls.length > 0 ? 'text-red-500 animate-bounce' : 'text-green-500'}`}>
            {untaggedCalls.length > 0 ? 'warning' : 'verified'}
          </span>
          <h3 className={`text-2xl font-extrabold ${untaggedCalls.length > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {untaggedCalls.length}
          </h3>
          <p className="text-[10px] font-bold uppercase text-gray-450 mt-1">Untagged Call Backlog</p>
        </div>
      </section>

      {/* Untagged Calls Resolver Panel */}
      <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
          <div>
            <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wide">Untagged Call Resolver</h3>
            <p className="text-[10px] text-gray-400 mt-0.5">Calls missing resolution tags. CDR overrides allowed for short calls (&lt; 5s).</p>
          </div>
          
          <button 
            onClick={handleBulkResolveShortCalls}
            className="bg-gray-100 hover:bg-[#F39C12] hover:text-white border border-gray-200 hover:border-[#F39C12] text-gray-700 px-3 py-1 rounded-lg text-xs font-bold shadow-sm transition-all"
          >
            Auto-Tag Short Calls (&lt; 5s)
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-150 text-gray-450 font-bold uppercase text-[9px]">
                <th className="p-3 pl-4">Agent Name</th>
                <th className="p-3">Lead Ref</th>
                <th className="p-3">TMID</th>
                <th className="p-3 text-center">CDR Duration</th>
                <th className="p-3">Timestamp</th>
                <th className="p-3 text-right pr-4">Override action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {untaggedCalls.map(c => {
                const isShort = c.durationSeconds < 5;
                return (
                  <tr key={c.id} className="hover:bg-gray-50/30 transition-colors">
                    <td className="p-3 pl-4 font-bold text-gray-800">{c.caller}</td>
                    <td className="p-3">{c.leadName}</td>
                    <td className="p-3 font-mono text-gray-500">{c.tmid}</td>
                    <td className="p-3 text-center font-mono font-bold">0h {c.durationSeconds}s</td>
                    <td className="p-3 font-mono text-gray-400">{c.timestamp}</td>
                    <td className="p-3 text-right pr-4">
                      {isShort ? (
                        <button
                          onClick={() => handleOverrideCall(c.id, c.leadName, c.durationSeconds)}
                          className="bg-white border border-gray-200 hover:bg-orange-50 hover:text-[#D35400] hover:border-[#F39C12] text-gray-600 px-2 py-0.5 rounded font-bold text-[10px] transition-colors"
                        >
                          Auto-Tag Call
                        </button>
                      ) : (
                        <div className="inline-flex flex-col text-right">
                          <span className="text-red-500 font-extrabold text-[9px] uppercase tracking-wider">Locked</span>
                          <span className="text-[8.5px] text-gray-400 font-semibold mt-0.5">Tag required by Agent</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
              {untaggedCalls.length === 0 && (
                <tr>
                  <td colSpan={6} className="p-6 text-center text-emerald-600 font-bold bg-emerald-50/20">
                    ✓ All calls tagged successfully. EOD compliance checklist is 100% clean.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Handover columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Priorities Section */}
        <section className="space-y-3">
          <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wide">Tomorrow's Handover Priorities</h3>
          <div className="space-y-2">
            {priorities.map(p => (
              <div key={p.id} className="bg-white border border-gray-200 rounded-xl p-3.5 shadow-sm flex items-center gap-3">
                <span className={`w-1.5 self-stretch rounded-full ${
                  p.type === 'escalation' ? 'bg-red-500' :
                  p.type === 'callback' ? 'bg-blue-500' : 'bg-gray-400'
                }`}></span>
                <div className="flex-1 text-xs">
                  <div className="flex justify-between items-center mb-0.5">
                    <p className="font-bold text-gray-850">{p.title}</p>
                    <span className="font-mono text-gray-400 text-[10px]">{p.time}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 font-semibold">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* hand-over notes section */}
        <section className="flex flex-col space-y-3">
          <h3 className="font-bold text-gray-800 text-xs uppercase tracking-wide">TL Shift Notes &amp; Handover</h3>
          
          <form onSubmit={handleSubmitReport} className="flex-1 bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between min-h-[220px]">
            {wrapUpSubmitted ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-xs space-y-2 py-6">
                <span className="material-symbols-outlined text-green-500 text-4xl">task_alt</span>
                <p className="font-bold text-gray-800">Wrap-up submitted successfully</p>
                <p className="text-gray-400 leading-normal max-w-xs">Handover report and EOD compliance log saved in the supervisor audit logs.</p>
              </div>
            ) : (
              <>
                <textarea 
                  value={dailyNotes}
                  onChange={(e) => setDailyNotes(e.target.value)}
                  placeholder="Summarize shift highlights, caller achievements, system status, and callback handovers for the next supervisor..."
                  className="w-full bg-transparent border-none text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-0 resize-none flex-1 font-medium min-h-[120px]"
                />

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <span className="text-[10px] text-gray-400 font-semibold">Handover targets: Telecalling Head</span>
                  <button 
                    type="submit"
                    className="bg-[#F39C12] hover:bg-[#e08e0b] text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm flex items-center gap-1.5 transition-all active:scale-95"
                  >
                    <span>Submit Daily Report</span>
                    <span className="material-symbols-outlined text-[16px]">send</span>
                  </button>
                </div>
              </>
            )}
          </form>
        </section>
      </div>

    </main>
  );
};

export default TlDailyWrapUpPanel;
