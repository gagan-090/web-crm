import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface TeamMember {
  name: string;
  roleLabel: string;
  roleType: 'primary' | 'backup' | 'special' | 'matchmaker';
  status: 'On Call' | 'Idle' | 'Break' | 'Offline';
  calls: number;
  revenue: number;
  queueDepth: number;
  convRate: string;
  avatarColor: string;
}

interface CallbackItem {
  id: string;
  callerName: string;
  leadName: string;
  time: string;
  status: 'Pending' | 'Done' | 'Overdue';
}

export const TlOverviewDashboard: React.FC = () => {
  const navigate = useNavigate();
  
  // Toggle between 'dw' and 'tr-mm'
  const [tlMode, setTlMode] = useState<'dw' | 'tr-mm'>('dw');
  
  // Dashboard state to simulate resolving untagged calls
  const [untaggedCount, setUntaggedCount] = useState(3);
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Callbacks list
  const [callbacks, setCallbacks] = useState<CallbackItem[]>([
    { id: 'c1', callerName: 'Rahul S.', leadName: 'Suresh Yadav (DR-48291)', time: '11:30 AM', status: 'Overdue' },
    { id: 'c2', callerName: 'Sonia R.', leadName: 'Gati Agent (TR-48294)', time: '02:00 PM', status: 'Pending' },
    { id: 'c3', callerName: 'Aman K.', leadName: 'BlueDart Partner (TR-48293)', time: '03:15 PM', status: 'Pending' },
    { id: 'c4', callerName: 'Vikram A.', leadName: 'Amit Singh (DR-48293)', time: '04:00 PM', status: 'Pending' }
  ]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleMarkCallbackDone = (id: string, name: string) => {
    setCallbacks(prev => prev.map(cb => cb.id === id ? { ...cb, status: 'Done' } : cb));
    triggerToast(`Callback for ${name} marked Done (TL override logged)`);
  };

  const handleResolveUntagged = () => {
    setUntaggedCount(0);
    triggerToast('All calls auto-resolved/tagged successfully!');
  };

  // Caller Lists
  const dwTeam: TeamMember[] = [
    { name: 'Rahul S.', roleLabel: 'Primary Caller', roleType: 'primary', status: 'On Call', calls: 32, revenue: 2400, queueDepth: 28, convRate: '6.3%', avatarColor: 'bg-teal-500' },
    { name: 'Sonia R.', roleLabel: 'Primary Caller', roleType: 'primary', status: 'On Call', calls: 28, revenue: 1900, queueDepth: 36, convRate: '7.1%', avatarColor: 'bg-indigo-500' },
    { name: 'Aman K.', roleLabel: 'Primary Caller', roleType: 'primary', status: 'Idle', calls: 24, revenue: 1500, queueDepth: 14, convRate: '8.3%', avatarColor: 'bg-emerald-500' },
    { name: 'Priya P.', roleLabel: 'Primary Caller', roleType: 'primary', status: 'Break', calls: 18, revenue: 1200, queueDepth: 22, convRate: '5.5%', avatarColor: 'bg-pink-500' },
    { name: 'Vikram A.', roleLabel: 'Backup Caller', roleType: 'backup', status: 'Idle', calls: 12, revenue: 400, queueDepth: 8, convRate: '4.2%', avatarColor: 'bg-amber-500' },
    { name: 'Kunal S.', roleLabel: 'Backup Caller', roleType: 'backup', status: 'Offline', calls: 0, revenue: 0, queueDepth: 0, convRate: '0.0%', avatarColor: 'bg-gray-400' },
    { name: 'Aditi S.', roleLabel: 'Special Categories', roleType: 'special', status: 'On Call', calls: 8, revenue: 3100, queueDepth: 5, convRate: '25.0%', avatarColor: 'bg-purple-500' }
  ];

  const trMmTeam: TeamMember[] = [
    { name: 'Alex R.', roleLabel: 'Primary TR Caller', roleType: 'primary', status: 'On Call', calls: 14, revenue: 4000, queueDepth: 18, convRate: '14.2%', avatarColor: 'bg-teal-500' },
    { name: 'Sarah C.', roleLabel: 'Primary TR Caller', roleType: 'primary', status: 'On Call', calls: 12, revenue: 1999, queueDepth: 28, convRate: '16.6%', avatarColor: 'bg-indigo-500' },
    { name: 'Marcus T.', roleLabel: 'Primary TR Caller', roleType: 'primary', status: 'Break', calls: 8, revenue: 0, queueDepth: 36, convRate: '0.0%', avatarColor: 'bg-rose-500' },
    { name: 'Elena R.', roleLabel: 'Backup TR Caller', roleType: 'backup', status: 'Offline', calls: 0, revenue: 0, queueDepth: 0, convRate: '0.0%', avatarColor: 'bg-gray-400' },
    { name: 'Rohit K.', roleLabel: 'Matchmaking Agent', roleType: 'matchmaker', status: 'On Call', calls: 22, revenue: 8000, queueDepth: 6, convRate: '27.2%', avatarColor: 'bg-purple-500' },
    { name: 'Sneha M.', roleLabel: 'Matchmaking Agent', roleType: 'matchmaker', status: 'Idle', calls: 18, revenue: 6000, queueDepth: 4, convRate: '22.2%', avatarColor: 'bg-pink-500' },
    { name: 'Javed K.', roleLabel: 'Matchmaking Agent', roleType: 'matchmaker', status: 'On Call', calls: 15, revenue: 3000, queueDepth: 5, convRate: '13.3%', avatarColor: 'bg-emerald-500' },
    { name: 'Deepak G.', roleLabel: 'Matchmaking Agent', roleType: 'matchmaker', status: 'Idle', calls: 12, revenue: 0, queueDepth: 3, convRate: '0.0%', avatarColor: 'bg-amber-500' }
  ];

  const currentTeam = tlMode === 'dw' ? dwTeam : trMmTeam;

  const handleCallerClick = (member: TeamMember) => {
    navigate('/tl/tl-caller-profile-detail', {
      state: {
        callerName: member.name,
        roleLabel: member.roleLabel,
        roleType: member.roleType,
        status: member.status,
        calls: member.calls,
        revenue: member.revenue,
        queueDepth: member.queueDepth,
        convRate: member.convRate,
        tlMode: tlMode
      }
    });
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-6 md:p-8 space-y-6 md:space-y-8 relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs md:text-sm px-5 py-2.5 rounded-xl shadow-xl z-50 flex items-center gap-2 border border-slate-800 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white p-6 border border-slate-200 rounded-2xl gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight">Team Leader Management Console</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">Real-time team oversight, rebalancing, and compliance monitoring</p>
        </div>

        {/* Amber Badge Toggle */}
        <button
          onClick={() => {
            const nextMode = tlMode === 'dw' ? 'tr-mm' : 'dw';
            setTlMode(nextMode);
            triggerToast(`Switched workspace simulation to ${nextMode === 'dw' ? 'Driver Welcome' : 'Transporter + Matchmaking'}`);
          }}
          className="bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 rounded-xl text-xs md:text-sm font-bold transition-all active:scale-95 flex items-center gap-2"
          title="Click to toggle Team Leader role datasets"
        >
          <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
          <span>TL — {tlMode === 'dw' ? 'Driver Welcome' : 'Transporter + Matchmaking'}</span>
        </button>
      </div>

      {/* PERSISTENT ALERT BANNERS */}
      <section className="space-y-3">
        {/* Banner 1 - EOD Tagging Compliance */}
        {untaggedCount > 0 ? (
          <div className="bg-red-50 border border-red-200 text-red-950 px-5 py-3.5 rounded-2xl text-xs md:text-sm font-bold flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-red-600 text-[20px]">warning</span>
              <span>⚠ {untaggedCount} calls untagged across your team. Resolve before 6 PM.</span>
            </span>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => navigate('/tl/tl-daily-wrap-up-panel')} 
                className="underline text-red-700 hover:text-red-900 font-extrabold"
              >
                [View Untagged]
              </button>
              <button 
                onClick={handleResolveUntagged} 
                className="bg-red-600 text-white px-3 py-1.5 rounded-lg hover:bg-red-700 font-extrabold transition-colors"
              >
                Auto-Tag CDR &lt;5s
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-900 px-5 py-3 rounded-2xl text-xs md:text-sm font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-emerald-600 text-[20px]">check_circle</span>
            <span>✓ All calls tagged — EOD compliance 100% clean</span>
          </div>
        )}

        {/* Banner 2 - Role specific alerts */}
        {tlMode === 'dw' ? (
          /* DW Funnel Escalation alert */
          <div className="bg-purple-50 border border-purple-200 text-purple-950 px-5 py-3.5 rounded-2xl text-xs md:text-sm font-bold flex justify-between items-center">
            <span className="flex items-center gap-2">
              <span className="material-symbols-outlined text-purple-600 text-[20px]">explore</span>
              <span>2 leads ready for Funnel escalation (NR ×3 or in queue &gt;3 days) — assign before EOD.</span>
            </span>
            <button 
              onClick={() => navigate('/tl/tl-lead-queue-manager')} 
              className="underline text-purple-700 hover:text-purple-900 font-extrabold"
            >
              [View Funnel Leads →]
            </button>
          </div>
        ) : (
          /* TR+MM SLA Alert Banners */
          <div className="space-y-2">
            <div className="bg-orange-50 border border-orange-200 text-orange-950 px-5 py-3.5 rounded-2xl text-xs md:text-sm font-bold flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-orange-600 text-[20px]">alarm</span>
                <span>TR-12094 has been in queue 2h 47m without first call. First-Call SLA at risk!</span>
              </span>
              <button 
                onClick={() => navigate('/tl/tl-lead-queue-manager')} 
                className="underline text-orange-700 hover:text-orange-900 font-extrabold"
              >
                [Assign Now →]
              </button>
            </div>
            
            <div className="bg-red-50 border border-red-200 text-red-950 px-5 py-3.5 rounded-2xl text-xs md:text-sm font-bold flex justify-between items-center">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined text-red-600 text-[20px]">priority_high</span>
                <span>JD-12034 Super Premium — 1 day to SLA breach. Matchmaking queue delayed!</span>
              </span>
              <button 
                onClick={() => navigate('/mm/tl-matchmaking-job-board')} 
                className="underline text-red-700 hover:text-red-900 font-extrabold"
              >
                [View Job Board →]
              </button>
            </div>
          </div>
        )}
      </section>

      {/* DUAL-QUEUE HEADER STRIP (Only for TR+MM) */}
      {tlMode === 'tr-mm' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-orange-50/20 border border-orange-100/50 rounded-2xl p-5 text-xs md:text-sm">
          <div className="md:border-r border-orange-100/60 md:pr-6 space-y-2">
            <div className="flex justify-between font-extrabold text-[#FB641B]">
              <span>TRANSPORTER WELCOME</span>
              <span>Target: ₹2,00,000</span>
            </div>
            <div className="flex justify-between text-slate-500 font-bold text-xs">
              <span>Achieved: ₹1,12,000 (56.0%)</span>
              <span>SLA Compliance: 91.3%</span>
            </div>
          </div>
          <div className="md:pl-6 space-y-2">
            <div className="flex justify-between font-extrabold text-purple-800">
              <span>MATCHMAKING ASSIGNMENT</span>
              <span>Target: ₹3,50,000</span>
            </div>
            <div className="flex justify-between text-slate-500 font-bold text-xs">
              <span>Achieved: ₹2,00,000 (57.1%)</span>
              <span>SLA Compliance: 91.7%</span>
            </div>
          </div>
        </div>
      )}

      {/* KPI CARDS ROW (4 cards) */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Team Revenue */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between min-h-[140px]">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Team Revenue Progress</span>
            <div className="text-2xl md:text-3xl font-black text-slate-800 mt-2">
              {tlMode === 'dw' ? '₹1,24,000' : '₹3,12,000'}
              <span className="text-sm font-normal text-slate-400"> / {tlMode === 'dw' ? '₹2,00,000' : '₹5,50,000'}</span>
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-amber-500 rounded-full" 
                style={{ width: tlMode === 'dw' ? '62%' : '56.7%' }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-slate-400 font-bold mt-2">
              <span>{tlMode === 'dw' ? '62% achieved' : '56.7% achieved'}</span>
              <span>11 days remaining</span>
            </div>
          </div>
        </div>

        {/* Card 2: Team Conversion Rate */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between min-h-[140px]">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Team Conversion Rate</span>
            {tlMode === 'dw' ? (
              <div className="text-2xl md:text-3xl font-black text-orange-600 mt-2">
                4.8% <span className="text-sm font-semibold text-slate-400">vs ≥5% target</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2 mt-2 text-xs">
                <div>
                  <span className="text-slate-400 block font-bold">TR Rate:</span>
                  <span className="font-extrabold text-[#FB641B] text-sm">13.1% <span className="text-[10px] font-normal text-slate-400">(≥12%)</span></span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold">MM Placed:</span>
                  <span className="font-extrabold text-purple-700 text-sm">23 <span className="text-[10px] font-normal text-slate-400">(tgt 55)</span></span>
                </div>
              </div>
            )}
          </div>
          <div className="text-xs text-slate-500 font-bold mt-4 pt-2 border-t border-slate-50 flex items-center gap-1">
            {tlMode === 'dw' ? '⚠️ Under-target threshold by 0.2%' : '⚡ Matchmaking pipeline solid'}
          </div>
        </div>

        {/* Card 3: Calls Today */}
        <div className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 transition-all flex flex-col justify-between min-h-[140px]">
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Calls Today (Team Aggregate)</span>
            <div className="text-2xl md:text-3xl font-black text-slate-800 mt-2">
              {tlMode === 'dw' ? '412' : '95'} <span className="text-sm font-normal text-slate-400">Total calls</span>
            </div>
          </div>
          <div className="text-xs text-slate-500 font-bold mt-4">
            {tlMode === 'dw' ? (
              <div>38 conversions · 9.2% rate</div>
            ) : (
              <div>34 TR calls · 61 MM calls · 4 placements</div>
            )}
          </div>
        </div>

        {/* Card 4: Team Status Snapshot */}
        <div 
          onClick={() => navigate('/tl/tl-real-time-monitor')}
          className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-amber-400 cursor-pointer flex flex-col justify-between min-h-[140px] transition-all"
        >
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block">Team Roster Snapshot</span>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="bg-green-50 text-green-700 border border-green-100 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                5 CALLING
              </span>
              <span className="bg-slate-50 text-slate-600 border border-slate-100 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                2 IDLE
              </span>
              <span className="bg-yellow-50 text-yellow-700 border border-yellow-100 text-[10px] font-extrabold px-2.5 py-1 rounded-lg">
                1 BREAK
              </span>
            </div>
          </div>
          <span className="text-xs font-black text-amber-500 hover:text-amber-600 mt-4 flex items-center gap-1">
            Go to Control Room <span className="material-symbols-outlined text-[14px] font-bold">arrow_forward</span>
          </span>
        </div>
      </section>

      {/* MY TEAM GRID */}
      <section className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
        <h3 className="text-xs md:text-sm font-bold text-slate-600 uppercase tracking-wider mb-4">
          Active Team Roster ({currentTeam.length} Direct Reports)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {currentTeam.map((member, idx) => {
            const isOverloaded = member.queueDepth > 35;

            return (
              <div 
                key={idx}
                onClick={() => handleCallerClick(member)}
                className="bg-white border border-slate-200 rounded-2xl p-4 hover:border-slate-300 transition-all cursor-pointer flex flex-col justify-between min-h-[160px]"
              >
                <div className="flex justify-between items-start gap-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-full ${member.avatarColor} text-white flex items-center justify-center font-black text-sm shadow-sm`}>
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 text-sm">{member.name}</h4>
                      <span className="text-xs text-slate-400 block font-semibold mt-0.5">{member.roleLabel}</span>
                    </div>
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                    member.status === 'On Call' ? 'bg-green-50 text-green-700 border-green-200' :
                    member.status === 'Break' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    member.status === 'Offline' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {member.status}
                  </span>
                </div>

                <div className="space-y-2 border-t border-slate-50 pt-3 mt-4 text-xs text-slate-500">
                  <div className="flex justify-between">
                    <span>Calls / Revenue:</span>
                    <span className="font-bold text-slate-700">{member.calls} calls · ₹{member.revenue}</span>
                  </div>

                  <div className="space-y-1">
                    <div className="flex justify-between font-bold">
                      <span>{member.roleType === 'matchmaker' ? 'Jobs Assigned:' : 'Queue Depth:'}</span>
                      <span className={isOverloaded ? 'text-red-600 font-extrabold' : 'text-slate-700'}>
                        {member.queueDepth} {member.roleType === 'matchmaker' ? 'Jobs' : 'Leads'}
                      </span>
                    </div>
                    {member.roleType !== 'matchmaker' && (
                      <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${isOverloaded ? 'bg-red-500' : 'bg-slate-400'}`} 
                          style={{ width: `${Math.min(100, (member.queueDepth / 40) * 100)}%` }}
                        ></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CALLBACKS DUE TODAY TABLE */}
      <section className="bg-white border border-slate-200 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider">Callbacks Due Today (Team View)</h3>
          <button 
            onClick={() => navigate('/tl/tl-team-callback-calendar')}
            className="text-xs font-black text-amber-500 hover:text-amber-600"
          >
            Open Team Calendar →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs md:text-sm text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase text-xs">
                <th className="py-3 px-2">Caller</th>
                <th className="py-3 px-2">Lead Name / Ref</th>
                <th className="py-3 px-2">Scheduled</th>
                <th className="py-3 px-2">SLA Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
              {callbacks.map((cb) => {
                const isOverdue = cb.status === 'Overdue';
                return (
                  <tr 
                    key={cb.id} 
                    className={`hover:bg-slate-50/50 transition-colors ${isOverdue ? 'bg-red-50/40 text-red-950' : ''}`}
                  >
                    <td className="py-3.5 px-2 font-bold">{cb.callerName}</td>
                    <td className="py-3.5 px-2">{cb.leadName}</td>
                    <td className="py-3.5 px-2 font-mono text-xs">{cb.time}</td>
                    <td className="py-3.5 px-2">
                      <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                        cb.status === 'Overdue' ? 'bg-red-100 text-red-800 border-red-200' :
                        cb.status === 'Done' ? 'bg-green-100 text-green-800 border-green-200' :
                        'bg-slate-100 text-slate-600 border-slate-200'
                      }`}>
                        {cb.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-2 text-right">
                      {cb.status !== 'Done' && (
                        <button 
                          onClick={() => handleMarkCallbackDone(cb.id, cb.leadName)}
                          className="bg-white border border-slate-200 hover:border-amber-500 hover:bg-amber-500 hover:text-white text-slate-700 px-3.5 py-1.5 rounded-lg transition-all text-xs font-bold"
                        >
                          Mark Done
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* TODAY'S PROCESS SUMMARY FOOTER STRIP */}
      <footer className="bg-slate-900 text-slate-300 py-5 px-6 rounded-2xl text-xs md:text-sm font-bold flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <div>Calls Made: <span className="text-white font-mono">{tlMode === 'dw' ? '412' : '95'}</span></div>
          <div>Conversions: <span className="text-white font-mono">{tlMode === 'dw' ? '38' : '7'}</span></div>
          <div>Revenue Generated: <span className="text-white font-mono">₹{tlMode === 'dw' ? '18,200' : '23,500'}</span></div>
          <div>Conversion Rate: <span className="text-white font-mono">{tlMode === 'dw' ? '9.2%' : '14.8%'}</span></div>
        </div>
        <div className="flex gap-6">
          <div>Untagged Calls: <span className={untaggedCount > 0 ? 'text-red-400 font-extrabold font-mono' : 'text-emerald-400 font-extrabold font-mono'}>{untaggedCount}</span></div>
          <div>Missed Callbacks: <span className="text-red-400 font-extrabold font-mono">1</span></div>
        </div>
      </footer>

    </div>
  );
};

export default TlOverviewDashboard;
