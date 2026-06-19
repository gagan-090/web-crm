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
    <div className="space-y-4 max-w-7xl mx-auto w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)] relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#F39C12]"></span>
          {toastMessage}
        </div>
      )}

      {/* Top Banner & Mode Toggle */}
      <div className="flex justify-between items-center bg-gray-50 p-3 border border-gray-200 rounded-xl shrink-0">
        <div>
          <h1 className="text-lg font-bold text-gray-800">Team Leader Management Console</h1>
          <p className="text-[11px] text-gray-400 mt-0.5">Real-time team oversight, rebalancing, and compliance monitoring</p>
        </div>

        {/* Amber Badge Toggle */}
        <button
          onClick={() => {
            const nextMode = tlMode === 'dw' ? 'tr-mm' : 'dw';
            setTlMode(nextMode);
            triggerToast(`Switched workspace simulation to ${nextMode === 'dw' ? 'Driver Welcome' : 'Transporter + Matchmaking'}`);
          }}
          className="bg-[#F39C12] hover:bg-[#e08e0b] text-white px-3.5 py-1.5 rounded-lg text-xs font-bold shadow transition-all active:scale-95 flex items-center gap-1.5"
          title="Click to toggle Team Leader role datasets"
        >
          <span className="material-symbols-outlined text-[16px]">swap_horiz</span>
          <span>TL — {tlMode === 'dw' ? 'Driver Welcome' : 'Transporter + Matchmaking'}</span>
        </button>
      </div>

      {/* PERSISTENT ALERT BANNERS */}
      <section className="space-y-2">
        {/* Banner 1 - EOD Tagging Compliance */}
        {untaggedCount > 0 ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-xs font-bold flex justify-between items-center shadow-sm">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-red-600 text-[18px]">warning</span>
              ⚠ {untaggedCount} calls untagged across your team. Resolve before 6 PM.
            </span>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => navigate('/tl/tl-daily-wrap-up-panel')} 
                className="underline text-red-800 hover:text-red-950 font-extrabold"
              >
                [View Untagged]
              </button>
              <button 
                onClick={handleResolveUntagged} 
                className="bg-red-600 text-white px-2 py-0.5 rounded hover:bg-red-700 font-bold"
              >
                Auto-Tag CDR &lt;5s
              </button>
            </div>
          </div>
        ) : (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 shadow-sm">
            <span className="material-symbols-outlined text-emerald-600 text-[18px]">check_circle</span>
            ✓ All calls tagged — EOD compliance 100% clean
          </div>
        )}

        {/* Banner 2 - Role specific alerts */}
        {tlMode === 'dw' ? (
          /* DW Funnel Escalation alert */
          <div className="bg-purple-50 border border-purple-200 text-purple-700 px-4 py-2.5 rounded-lg text-xs font-bold flex justify-between items-center shadow-sm">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-purple-600 text-[18px]">explore</span>
              2 leads ready for Funnel escalation (NR ×3 or in queue &gt;3 days) — assign before EOD.
            </span>
            <button 
              onClick={() => navigate('/tl/tl-lead-queue-manager')} 
              className="underline text-purple-800 hover:text-purple-950 font-extrabold"
            >
              [View Funnel Leads →]
            </button>
          </div>
        ) : (
          /* TR+MM SLA Alert Banners */
          <div className="space-y-1">
            <div className="bg-orange-50 border border-orange-200 text-orange-700 px-4 py-2.5 rounded-lg text-xs font-bold flex justify-between items-center shadow-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-orange-600 text-[18px]">alarm</span>
                TR-12094 has been in queue 2h 47m without first call. First-Call SLA at risk!
              </span>
              <button 
                onClick={() => navigate('/tl/tl-lead-queue-manager')} 
                className="underline text-orange-800 hover:text-orange-950 font-extrabold"
              >
                [Assign Now →]
              </button>
            </div>
            
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2.5 rounded-lg text-xs font-bold flex justify-between items-center shadow-sm">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-red-600 text-[18px]">priority_high</span>
                JD-12034 Super Premium — 1 day to SLA breach. Matchmaking queue delayed!
              </span>
              <button 
                onClick={() => navigate('/mm/tl-matchmaking-job-board')} 
                className="underline text-red-800 hover:text-red-950 font-extrabold"
              >
                [View Job Board →]
              </button>
            </div>
          </div>
        )}
      </section>

      {/* DUAL-QUEUE HEADER STRIP (Only for TR+MM) */}
      {tlMode === 'tr-mm' && (
        <div className="grid grid-cols-2 gap-4 bg-orange-50/20 border border-orange-100 rounded-xl p-3 select-none text-xs">
          <div className="border-r border-orange-100 pr-3 space-y-1">
            <div className="flex justify-between font-bold text-[#FB641B]">
              <span>TRANSPORTER WELCOME</span>
              <span>Target: ₹2,00,000</span>
            </div>
            <div className="flex justify-between text-gray-500 font-semibold text-[11px]">
              <span>Achieved: ₹1,12,000 (56.0%)</span>
              <span>SLA Compliance: 91.3%</span>
            </div>
          </div>
          <div className="pl-3 space-y-1">
            <div className="flex justify-between font-bold text-purple-700">
              <span>MATCHMAKING ASSIGNMENT</span>
              <span>Target: ₹3,50,000</span>
            </div>
            <div className="flex justify-between text-gray-500 font-semibold text-[11px]">
              <span>Achieved: ₹2,00,000 (57.1%)</span>
              <span>SLA Compliance: 91.7%</span>
            </div>
          </div>
        </div>
      )}

      {/* KPI CARDS ROW (4 cards) */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Card 1: Team Revenue */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Team Revenue Progress</span>
            <div className="text-xl font-extrabold text-gray-800 mt-1">
              {tlMode === 'dw' ? '₹1,24,000' : '₹3,12,000'}
              <span className="text-xs font-normal text-gray-400"> / {tlMode === 'dw' ? '₹2,00,000' : '₹5,50,000'}</span>
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#F39C12] rounded-full" 
                style={{ width: tlMode === 'dw' ? '62%' : '56.7%' }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] text-gray-400 font-semibold mt-1">
              <span>{tlMode === 'dw' ? '62% achieved' : '56.7% achieved'}</span>
              <span>11 days remaining</span>
            </div>
          </div>
        </div>

        {/* Card 2: Team Conversion Rate */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Team Conversion Rate</span>
            {tlMode === 'dw' ? (
              <div className="text-xl font-extrabold text-[#D35400] mt-1">
                4.8% <span className="text-xs font-semibold text-gray-400">vs ≥5% target</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-1 mt-1 text-[11px]">
                <div>
                  <span className="text-gray-400 block font-semibold">TR Rate:</span>
                  <span className="font-bold text-[#FB641B]">13.1% <span className="text-[9px] font-normal text-gray-400">(≥12%)</span></span>
                </div>
                <div>
                  <span className="text-gray-400 block font-semibold">MM Placed:</span>
                  <span className="font-bold text-purple-700">23 <span className="text-[9px] font-normal text-gray-400">(tgt 55)</span></span>
                </div>
              </div>
            )}
          </div>
          <div className="text-[10px] text-gray-400 font-semibold mt-3 pt-1 border-t border-gray-50">
            {tlMode === 'dw' ? '⚠️ Under-target threshold by 0.2%' : '⚡ Matchmaking pipeline solid'}
          </div>
        </div>

        {/* Card 3: Calls Today */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Calls Today (Team Aggregate)</span>
            <div className="text-xl font-extrabold text-gray-800 mt-1">
              {tlMode === 'dw' ? '412' : '95'} <span className="text-xs font-normal text-gray-400">Total calls</span>
            </div>
          </div>
          <div className="text-[10px] text-gray-500 font-semibold mt-3 space-y-0.5">
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
          className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between cursor-pointer hover:border-[#F39C12] transition-colors"
        >
          <div>
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Team Roster Snapshot</span>
            <div className="flex flex-wrap gap-1.5 mt-2">
              <span className="bg-green-50 text-green-700 border border-green-100 text-[9px] font-bold px-1.5 py-0.5 rounded">
                5 CALLING
              </span>
              <span className="bg-gray-100 text-gray-600 text-[9px] font-bold px-1.5 py-0.5 rounded">
                2 IDLE
              </span>
              <span className="bg-yellow-50 text-yellow-700 border border-yellow-100 text-[9px] font-bold px-1.5 py-0.5 rounded">
                1 BREAK
              </span>
            </div>
          </div>
          <span className="text-[10px] font-extrabold text-[#F39C12] mt-3 hover:underline flex items-center gap-0.5">
            Go to Control Room <span className="material-symbols-outlined text-[12px] font-bold">arrow_forward</span>
          </span>
        </div>
      </section>

      {/* MY TEAM GRID */}
      <section className="bg-gray-50/50 p-4 border border-gray-200 rounded-xl">
        <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-3">
          Active Team Roster ({currentTeam.length} Direct Reports)
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {currentTeam.map((member, idx) => {
            const isOverloaded = member.queueDepth > 35;

            return (
              <div 
                key={idx}
                onClick={() => handleCallerClick(member)}
                className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-md transition-shadow cursor-pointer flex flex-col justify-between min-h-[140px]"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-2">
                    <div className={`w-8 h-8 rounded-full ${member.avatarColor} text-white flex items-center justify-center font-bold text-xs`}>
                      {member.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-bold text-gray-800 text-xs">{member.name}</h4>
                      <span className="text-[9px] text-gray-400 block font-semibold">{member.roleLabel}</span>
                    </div>
                  </div>
                  <span className={`text-[9px] font-bold px-1 py-0.2 rounded border ${
                    member.status === 'On Call' ? 'bg-green-50 text-green-700 border-green-200' :
                    member.status === 'Break' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
                    member.status === 'Offline' ? 'bg-red-50 text-red-700 border-red-200' :
                    'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                    {member.status}
                  </span>
                </div>

                <div className="space-y-1.5 border-t border-gray-100 pt-2 mt-2 text-[10px] text-gray-500">
                  <div className="flex justify-between">
                    <span>Calls / Revenue:</span>
                    <span className="font-semibold text-gray-700">{member.calls} calls · ₹{member.revenue}</span>
                  </div>

                  <div className="space-y-0.5">
                    <div className="flex justify-between font-semibold">
                      <span>{member.roleType === 'matchmaker' ? 'Jobs Assigned:' : 'Queue Depth:'}</span>
                      <span className={isOverloaded ? 'text-red-600 font-bold' : 'text-gray-700'}>
                        {member.queueDepth} {member.roleType === 'matchmaker' ? 'Jobs' : 'Leads'}
                      </span>
                    </div>
                    {member.roleType !== 'matchmaker' && (
                      <div className="w-full h-1 bg-gray-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${isOverloaded ? 'bg-red-500' : 'bg-gray-400'}`} 
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
      <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider">Callbacks Due Today (Team View)</h3>
          <button 
            onClick={() => navigate('/tl/tl-team-callback-calendar')}
            className="text-[10px] font-extrabold text-[#F39C12] hover:underline"
          >
            Open Team Calendar →
          </button>
        </div>

        <table className="w-full text-xs text-left">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px]">
              <th className="py-2">Caller</th>
              <th className="py-2">Lead Name / Ref</th>
              <th className="py-2">Scheduled</th>
              <th className="py-2">SLA Status</th>
              <th className="py-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50 text-gray-700 font-medium">
            {callbacks.map((cb) => {
              const isOverdue = cb.status === 'Overdue';
              return (
                <tr 
                  key={cb.id} 
                  className={`hover:bg-gray-50/50 transition-colors ${isOverdue ? 'bg-red-50/40 text-red-900' : ''}`}
                >
                  <td className="py-2.5 font-bold">{cb.callerName}</td>
                  <td className="py-2.5">{cb.leadName}</td>
                  <td className="py-2.5 font-mono">{cb.time}</td>
                  <td className="py-2.5">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                      cb.status === 'Overdue' ? 'bg-red-100 text-red-800' :
                      cb.status === 'Done' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-600'
                    }`}>
                      {cb.status}
                    </span>
                  </td>
                  <td className="py-2.5 text-right">
                    {cb.status !== 'Done' && (
                      <button 
                        onClick={() => handleMarkCallbackDone(cb.id, cb.leadName)}
                        className="bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded hover:bg-[#F39C12] hover:text-white hover:border-[#F39C12] transition-colors text-[10px] font-bold"
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
      </section>

      {/* TODAY'S PROCESS SUMMARY FOOTER STRIP */}
      <footer className="bg-gray-900 text-gray-400 py-3.5 px-4 rounded-xl text-[11px] font-semibold flex flex-wrap gap-4 items-center justify-between shadow select-none">
        <div className="flex gap-4 flex-wrap">
          <div>Calls Made: <span className="text-white font-mono">{tlMode === 'dw' ? '412' : '95'}</span></div>
          <div>Conversions: <span className="text-white font-mono">{tlMode === 'dw' ? '38' : '7'}</span></div>
          <div>Revenue Generated: <span className="text-white font-mono">₹{tlMode === 'dw' ? '18,200' : '23,500'}</span></div>
          <div>Conversion Rate: <span className="text-white font-mono">{tlMode === 'dw' ? '9.2%' : '14.8%'}</span></div>
        </div>
        <div className="flex gap-4">
          <div>Untagged Calls: <span className={untaggedCount > 0 ? 'text-red-400 font-bold font-mono' : 'text-emerald-400 font-bold font-mono'}>{untaggedCount}</span></div>
          <div>Missed Callbacks: <span className="text-red-400 font-bold font-mono">1</span></div>
        </div>
      </footer>

    </div>
  );
};

export default TlOverviewDashboard;
