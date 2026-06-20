import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface RosterMember {
  name: string;
  roleLabel: string;
  roleType: 'primary' | 'backup' | 'special' | 'matchmaker';
  status: 'On Call' | 'Idle' | 'Break' | 'Offline';
  currentLead: string;
  queueDepth: number;
  calls: number;
  revenue: number;
  lastCallAt: string;
  avatarColor: string;
}

interface CallLogItem {
  time: string;
  caller: string;
  leadName: string;
  tmid: string;
  duration: string;
  outcome: 'Connected' | 'Converted' | 'NR' | 'Busy';
}

interface EscalationLead {
  id: string;
  name: string;
  tmid: string;
  daysInQueue: number;
  nrCount: number;
}

export const TlRealTimeMonitor: React.FC = () => {
  const navigate = useNavigate();
  
  // Role Toggle
  const [tlMode, setTlMode] = useState<'dw' | 'tr-mm'>('dw');
  
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // State for Team Roster
  const [dwRoster, setDwRoster] = useState<RosterMember[]>([
    { name: 'Rahul S.', roleLabel: 'Primary Caller', roleType: 'primary', status: 'On Call', currentLead: 'DR-48291', queueDepth: 28, calls: 32, revenue: 2400, lastCallAt: '12:39 PM', avatarColor: 'bg-teal-500' },
    { name: 'Sonia R.', roleLabel: 'Primary Caller', roleType: 'primary', status: 'On Call', currentLead: 'DR-48292', queueDepth: 36, calls: 28, revenue: 1900, lastCallAt: '12:37 PM', avatarColor: 'bg-indigo-500' },
    { name: 'Aman K.', roleLabel: 'Primary Caller', roleType: 'primary', status: 'Idle', currentLead: '--', queueDepth: 14, calls: 24, revenue: 1500, lastCallAt: '12:20 PM', avatarColor: 'bg-emerald-500' },
    { name: 'Priya P.', roleLabel: 'Primary Caller', roleType: 'primary', status: 'Break', currentLead: '--', queueDepth: 22, calls: 18, revenue: 1200, lastCallAt: '12:05 PM', avatarColor: 'bg-pink-500' },
    { name: 'Vikram A.', roleLabel: 'Backup Caller', roleType: 'backup', status: 'Offline', currentLead: '--', queueDepth: 0, calls: 0, revenue: 0, lastCallAt: 'Yesterday', avatarColor: 'bg-amber-500' },
    { name: 'Kunal S.', roleLabel: 'Backup Caller', roleType: 'backup', status: 'Offline', currentLead: '--', queueDepth: 0, calls: 0, revenue: 0, lastCallAt: 'Yesterday', avatarColor: 'bg-gray-400' },
    { name: 'Aditi S.', roleLabel: 'Special Categories', roleType: 'special', status: 'On Call', currentLead: 'DR-88220', queueDepth: 5, calls: 8, revenue: 3100, lastCallAt: '12:25 PM', avatarColor: 'bg-purple-500' }
  ]);

  const [trMmRoster, setTrMmRoster] = useState<RosterMember[]>([
    { name: 'Alex R.', roleLabel: 'Primary TR Caller', roleType: 'primary', status: 'On Call', currentLead: 'TR-12094', queueDepth: 18, calls: 14, revenue: 4000, lastCallAt: '12:39 PM', avatarColor: 'bg-teal-500' },
    { name: 'Sarah C.', roleLabel: 'Primary TR Caller', roleType: 'primary', status: 'On Call', currentLead: 'TR-12095', queueDepth: 28, calls: 12, revenue: 1999, lastCallAt: '12:35 PM', avatarColor: 'bg-indigo-500' },
    { name: 'Marcus T.', roleLabel: 'Primary TR Caller', roleType: 'primary', status: 'Break', currentLead: '--', queueDepth: 36, calls: 8, revenue: 0, lastCallAt: '12:01 PM', avatarColor: 'bg-rose-500' },
    { name: 'Elena R.', roleLabel: 'Backup TR Caller', roleType: 'backup', status: 'Offline', currentLead: '--', queueDepth: 0, calls: 0, revenue: 0, lastCallAt: 'Yesterday', avatarColor: 'bg-gray-400' },
    { name: 'Rohit K.', roleLabel: 'Matchmaking Agent', roleType: 'matchmaker', status: 'On Call', currentLead: 'JD-12034', queueDepth: 6, calls: 22, revenue: 8000, lastCallAt: '12:38 PM', avatarColor: 'bg-purple-500' },
    { name: 'Sneha M.', roleLabel: 'Matchmaking Agent', roleType: 'matchmaker', status: 'Idle', currentLead: '--', queueDepth: 4, calls: 18, revenue: 6000, lastCallAt: '12:25 PM', avatarColor: 'bg-pink-500' },
    { name: 'Javed K.', roleLabel: 'Matchmaking Agent', roleType: 'matchmaker', status: 'On Call', currentLead: 'JD-12035', queueDepth: 5, calls: 15, revenue: 3000, lastCallAt: '12:30 PM', avatarColor: 'bg-emerald-500' },
    { name: 'Deepak G.', roleLabel: 'Matchmaking Agent', roleType: 'matchmaker', status: 'Idle', currentLead: '--', queueDepth: 3, calls: 12, revenue: 0, lastCallAt: '11:45 AM', avatarColor: 'bg-amber-500' }
  ]);

  const currentRoster = tlMode === 'dw' ? dwRoster : trMmRoster;
  const setRoster = tlMode === 'dw' ? setDwRoster : setTrMmRoster;

  // Rebalance modal states
  const [showRebalanceModal, setShowRebalanceModal] = useState(false);
  const [rebalanceFrom, setRebalanceFrom] = useState('');
  const [rebalanceTo, setRebalanceTo] = useState('');
  const [rebalanceCount, setRebalanceCount] = useState(5);
  const [rebalanceReason, setRebalanceReason] = useState('');

  // Backup activation reason popup
  const [backupActiveTarget, setBackupActiveTarget] = useState<string | null>(null);
  const [backupActiveReason, setBackupActiveReason] = useState('Queue overflow');

  // Escalation leads list
  const [dwEscalations, setDwEscalations] = useState<EscalationLead[]>([
    { id: 'e1', name: 'Ramesh Yadav', tmid: 'DR-77890', daysInQueue: 3, nrCount: 3 },
    { id: 'e2', name: 'Jagdish Singh', tmid: 'DR-77981', daysInQueue: 4, nrCount: 2 }
  ]);

  const [trEscalations, setTrEscalations] = useState<EscalationLead[]>([
    { id: 'e3', name: 'Agrawal Global', tmid: 'TR-12094', daysInQueue: 1, nrCount: 3 },
    { id: 'e4', name: 'Kunal Logistics', tmid: 'TR-12099', daysInQueue: 3, nrCount: 1 }
  ]);

  const escalations = tlMode === 'dw' ? dwEscalations : trEscalations;
  const setEscalations = tlMode === 'dw' ? setDwEscalations : setTrEscalations;

  // Quick select dynamic assign state
  const [assignTargetLead, setAssignTargetLead] = useState<string | null>(null);
  const [assignTargetCaller, setAssignTargetCaller] = useState('');

  // Sample Recent call logs
  const callLogs: CallLogItem[] = [
    { time: '12:39 PM', caller: 'Rahul S.', leadName: 'Suresh Yadav', tmid: 'DR-48291', duration: '03:16', outcome: 'Connected' },
    { time: '12:37 PM', caller: 'Sonia R.', leadName: 'Gati Agent', tmid: 'TR-48294', duration: '04:54', outcome: 'Converted' },
    { time: '12:35 PM', caller: 'Alex R.', leadName: 'Agrawal Global', tmid: 'TR-12094', duration: '01:05', outcome: 'NR' },
    { time: '12:30 PM', caller: 'Javed K.', leadName: 'Sharma Logistics', tmid: 'TR-12095', duration: '02:40', outcome: 'Connected' },
    { time: '12:25 PM', caller: 'Aditi S.', leadName: 'Puncture Shop Agra', tmid: 'DR-88220', duration: '05:12', outcome: 'Connected' }
  ];

  // Execute queue rebalancing
  const handleConfirmRebalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rebalanceFrom || !rebalanceTo) {
      triggerToast('Please select both From and To callers');
      return;
    }
    if (rebalanceFrom === rebalanceTo) {
      triggerToast('Source and destination callers cannot be the same');
      return;
    }
    if (!rebalanceReason) {
      triggerToast('A reason is required to log the manual queue override');
      return;
    }

    const fromCaller = currentRoster.find(c => c.name === rebalanceFrom);
    if (!fromCaller || fromCaller.queueDepth < rebalanceCount) {
      triggerToast(`Source caller does not have ${rebalanceCount} leads to reassign`);
      return;
    }

    setRoster(prev => prev.map(c => {
      if (c.name === rebalanceFrom) {
        return { ...c, queueDepth: c.queueDepth - rebalanceCount };
      }
      if (c.name === rebalanceTo) {
        return { ...c, queueDepth: c.queueDepth + rebalanceCount };
      }
      return c;
    }));

    setShowRebalanceModal(false);
    triggerToast(`Moved ${rebalanceCount} leads from ${rebalanceFrom} to ${rebalanceTo} successfully ✓`);
    setRebalanceReason('');
  };

  // Toggle backup state
  const handleToggleBackup = (callerName: string, currentlyActive: boolean) => {
    if (!currentlyActive) {
      // Prompt for activation reason
      setBackupActiveTarget(callerName);
    } else {
      // Simply deactivate
      setRoster(prev => prev.map(c => 
        c.name === callerName ? { ...c, status: 'Offline', queueDepth: 0 } : c
      ));
      triggerToast(`Backup Caller ${callerName} Deactivated (Shift ends)`);
    }
  };

  const handleConfirmBackupActivation = () => {
    if (!backupActiveTarget) return;
    setRoster(prev => prev.map(c => 
      c.name === backupActiveTarget ? { ...c, status: 'Idle', queueDepth: 10 } : c
    ));
    triggerToast(`Backup Caller ${backupActiveTarget} Activated (Reason: ${backupActiveReason}) ✓`);
    setBackupActiveTarget(null);
  };

  // Handle manual escalation assignment
  const handleAssignEscalation = (leadId: string, leadTmid: string) => {
    if (!assignTargetCaller) {
      triggerToast('Please select a caller to assign this lead');
      return;
    }
    
    // Add lead to caller's queue depth
    setRoster(prev => prev.map(c => 
      c.name === assignTargetCaller ? { ...c, queueDepth: c.queueDepth + 1 } : c
    ));

    // Remove from escalation list
    setEscalations(prev => prev.filter(l => l.id !== leadId));
    setAssignTargetLead(null);
    setAssignTargetCaller('');
    triggerToast(`Escalated Lead ${leadTmid} assigned manually to ${assignTargetCaller} ✓`);
  };

  return (
    <main className="min-h-[calc(100vh-100px)] flex flex-col lg:flex-row bg-white border border-slate-200 rounded-2xl relative">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="absolute top-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs md:text-sm px-5 py-2.5 rounded-xl z-50 flex items-center gap-2 border border-slate-800 animate-bounce">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span className="font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Main Left Activity Pane */}
      <section className="flex-1 flex flex-col min-w-0 border-b lg:border-b-0 lg:border-r border-slate-200">
        
        {/* Top Controls bar with Mode Switcher */}
        <div className="p-5 bg-slate-50 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-base md:text-lg font-black text-slate-800 uppercase tracking-wider">Live Control Room</h2>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-green-200 bg-green-50 text-green-700 text-xs font-bold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-ping"></span>
              <span>REFRESHING LIVE</span>
            </div>
          </div>

          {/* Toggle Badge */}
          <button
            onClick={() => {
              const nextMode = tlMode === 'dw' ? 'tr-mm' : 'dw';
              setTlMode(nextMode);
              triggerToast(`Switched control room simulation to ${nextMode === 'dw' ? 'Driver Welcome' : 'Transporter + Matchmaking'}`);
            }}
            className="bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-lg text-xs md:text-sm font-bold transition-all active:scale-95 flex items-center gap-1"
          >
            <span>Switch Team: {tlMode === 'dw' ? 'DW' : 'TR+MM'}</span>
          </button>
        </div>

        {/* Active Team Roster Table & Call Logs */}
        <div className="flex-1 p-5 space-y-6 overflow-y-auto">
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider">
              Active Callers Status
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 border-b border-slate-200 text-slate-400 font-bold uppercase text-xs">
                    <th className="p-4">Caller</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Status</th>
                    <th className="p-4">Current Lead</th>
                    <th className="p-4">Queue Depth (Cap 40)</th>
                    <th className="p-4 text-center">Calls</th>
                    <th className="p-4 text-right">Revenue Today</th>
                    <th className="p-4 text-right">Last Call</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-semibold">
                  {currentRoster.map((member, i) => {
                    const isOverloaded = member.queueDepth > 35;
                    return (
                      <tr 
                        key={i}
                        onClick={() => navigate('/tl/tl-caller-profile-detail', { state: { callerName: member.name, roleLabel: member.roleLabel, tlMode: tlMode } })}
                        className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                      >
                        <td className="p-4 font-bold text-slate-800 flex items-center gap-2">
                          <div className={`w-8 h-8 rounded-full ${member.avatarColor} text-white flex items-center justify-center font-black text-xs`}>
                            {member.name.slice(0, 2).toUpperCase()}
                          </div>
                          <span>{member.name}</span>
                        </td>
                        <td className="p-4 text-slate-500 font-bold">{member.roleLabel}</td>
                        <td className="p-4">
                          <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
                            member.status === 'On Call' ? 'bg-green-50 text-green-700 border border-green-200' :
                            member.status === 'Break' ? 'bg-yellow-50 text-yellow-700 border border-yellow-200' :
                            member.status === 'Offline' ? 'bg-red-50 text-red-700 border border-red-200' :
                            'bg-slate-100 text-slate-600'
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="p-4 font-mono text-slate-600">{member.currentLead}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2.5">
                            <span className={`font-black min-w-[18px] ${isOverloaded ? 'text-red-600' : 'text-slate-700'}`}>{member.queueDepth}</span>
                            {member.roleType !== 'matchmaker' ? (
                              <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${isOverloaded ? 'bg-red-500 animate-pulse' : 'bg-slate-400'}`} 
                                  style={{ width: `${Math.min(100, (member.queueDepth / 40) * 100)}%` }}
                                ></div>
                              </div>
                            ) : (
                              <span className="text-[10px] text-purple-700 bg-purple-50 border border-purple-100 px-2 py-0.5 rounded font-black uppercase">MATCHMAKING</span>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-center font-bold">{member.calls}</td>
                        <td className="p-4 text-right font-mono font-bold">₹{member.revenue}</td>
                        <td className="p-4 text-right text-slate-400 font-bold">{member.lastCallAt}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Recent Call Logs list */}
          <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs md:text-sm font-bold text-slate-700 uppercase tracking-wider">
              Recent Call Attempts (Team-Wide)
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs md:text-sm text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 font-bold uppercase text-xs border-b border-slate-200">
                    <th className="p-3.5">Time</th>
                    <th className="p-3.5">Caller</th>
                    <th className="p-3.5">Customer Name</th>
                    <th className="p-3.5">TMID</th>
                    <th className="p-3.5 text-center">Duration</th>
                    <th className="p-3.5 text-right">Outcome</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50 text-slate-700 font-semibold">
                  {callLogs.map((log, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5 font-mono text-slate-400">{log.time}</td>
                      <td className="p-3.5 font-bold">{log.caller}</td>
                      <td className="p-3.5">{log.leadName}</td>
                      <td className="p-3.5 font-mono text-slate-500">{log.tmid}</td>
                      <td className="p-3.5 text-center font-mono">{log.duration}</td>
                      <td className="p-3.5 text-right">
                        <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${
                          log.outcome === 'Converted' ? 'bg-green-50 text-green-800 border-green-200' :
                          log.outcome === 'Connected' ? 'bg-blue-50 text-blue-800 border-blue-200' :
                          'bg-slate-100 text-slate-600 border-slate-200'
                        }`}>
                          {log.outcome}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* BOTTOM PANEL: Backup Activation & Funnel Escalation */}
        <footer className="border-t border-slate-200 p-5 grid grid-cols-1 md:grid-cols-2 gap-5 bg-slate-50/50 shrink-0 select-none">
          {/* Backup Activation Panel */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between gap-4">
            <div>
              <h4 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[18px] text-amber-500">emergency_home</span>
                Backup Roster Activation
              </h4>
              <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                Activate secondary backup callers to route queue overflows and prevent SLA breaches.
              </p>
            </div>

            <div className="space-y-2">
              {currentRoster.filter(c => c.roleType === 'backup').map((caller, idx) => {
                const isActive = caller.status !== 'Offline';
                return (
                  <div key={idx} className="flex justify-between items-center p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs md:text-sm">
                    <div>
                      <span className="font-bold block text-slate-700">{caller.name}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{caller.roleLabel}</span>
                    </div>

                    <button 
                      onClick={() => handleToggleBackup(caller.name, isActive)}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        isActive 
                          ? 'bg-green-600 text-white hover:bg-green-700' 
                          : 'bg-slate-200 text-slate-600 hover:bg-slate-350'
                      }`}
                    >
                      {isActive ? 'Active' : 'Offline'}
                    </button>
                  </div>
                );
              })}
              {currentRoster.filter(c => c.roleType === 'backup').length === 0 && (
                <p className="text-xs text-slate-400 italic">No backup tier exists for Matchmaking callers.</p>
              )}
            </div>
          </div>

          {/* Funnel/Backlog Escalation Queue */}
          <div className="bg-white border border-slate-200 p-4 rounded-2xl flex flex-col justify-between gap-4">
            <h4 className="text-xs md:text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-purple-600">priority_high</span>
              Funnel Escalation Assignment
            </h4>

            <div className="flex-1 overflow-y-auto space-y-2 max-h-[140px] pr-1">
              {escalations.map((lead, idx) => {
                const isAssigning = assignTargetLead === lead.id;
                return (
                  <div key={idx} className="p-3 border-l-4 border-purple-500 bg-purple-50/20 rounded-r-xl flex justify-between items-center text-xs md:text-sm gap-2">
                    <div>
                      <span className="font-bold text-slate-800 block">{lead.name} ({lead.tmid})</span>
                      <span className="text-xs text-slate-500 mt-0.5 block font-semibold">
                        {lead.daysInQueue} days in queue · {lead.nrCount} NR attempts
                      </span>
                    </div>

                    {isAssigning ? (
                      <div className="flex items-center gap-1.5 animate-in fade-in duration-200">
                        <select 
                          value={assignTargetCaller}
                          onChange={(e) => setAssignTargetCaller(e.target.value)}
                          className="border border-slate-200 rounded-lg px-2 py-1 text-xs font-bold text-slate-700 outline-none bg-white"
                        >
                          <option value="">Select Caller</option>
                          {currentRoster.filter(c => c.status !== 'Offline' && c.roleType !== 'matchmaker').map((c, i) => (
                            <option key={i} value={c.name}>{c.name}</option>
                          ))}
                        </select>
                        <button 
                          onClick={() => handleAssignEscalation(lead.id, lead.tmid)}
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg text-xs font-bold"
                        >
                          Go
                        </button>
                        <button 
                          onClick={() => setAssignTargetLead(null)}
                          className="text-slate-400 font-bold px-1.5 hover:text-slate-600 text-lg"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setAssignTargetLead(lead.id)}
                        className="bg-purple-100 hover:bg-purple-200 text-purple-700 px-3 py-1.5 rounded-lg text-xs font-bold"
                      >
                        Assign Lead
                      </button>
                    )}
                  </div>
                );
              })}
              {escalations.length === 0 && (
                <div className="text-xs text-slate-400 italic py-4 text-center">No pending escalations in queue.</div>
              )}
            </div>
          </div>
        </footer>

      </section>

      {/* Right Column: Queue Rebalance Sidebar (300px) */}
      <aside className="w-full lg:w-[300px] p-5 bg-slate-50/50 flex flex-col justify-between shrink-0 overflow-y-auto select-none gap-5">
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="font-bold text-slate-800 text-xs md:text-sm uppercase tracking-wide">Queue Rebalance</h3>
            
            {/* Visual Queue Depths Bar chart */}
            <div className="space-y-3 mt-2">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider">Current Caller Load:</div>
              <div className="space-y-3">
                {currentRoster.filter(c => c.roleType !== 'matchmaker' && c.status !== 'Offline').map((caller, idx) => {
                  const percent = Math.min(100, (caller.queueDepth / 40) * 100);
                  const isRed = caller.queueDepth > 35;
                  return (
                    <div key={idx} className="space-y-1 text-xs md:text-sm">
                      <div className="flex justify-between font-bold">
                        <span className="text-slate-600">{caller.name}</span>
                        <span className={isRed ? 'text-red-600 font-extrabold' : 'text-slate-700'}>{caller.queueDepth} leads</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div 
                          className={`h-full ${isRed ? 'bg-red-500' : 'bg-amber-500'}`} 
                          style={{ width: `${percent}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed mt-2">
              Manual rebalancing triggers a bulk transfer of lead records from overloaded queues to under-capacity callers.
            </p>

            <button 
              onClick={() => setShowRebalanceModal(true)}
              className="w-full bg-amber-500 hover:bg-amber-600 text-white py-2.5 rounded-xl font-bold text-xs md:text-sm flex items-center justify-center gap-2 transition-all active:scale-95"
            >
              <span className="material-symbols-outlined text-[18px]">balance</span>
              <span>Rebalance Queue</span>
            </button>
          </div>

          {/* SLA Performance metrics */}
          <div className="bg-white border border-slate-200 rounded-2xl p-5 space-y-4">
            <div className="flex justify-between items-center border-b border-slate-100 pb-3">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-wider">SLA INTEGRITY</span>
              <span className="text-sm md:text-base font-mono font-bold text-amber-600">92.8%</span>
            </div>
            
            <div className="grid grid-cols-2 gap-3 text-center text-xs md:text-sm">
              <div className="bg-red-50 border border-red-200 p-3 rounded-xl">
                <div className="text-xl font-black text-red-600">3</div>
                <div className="text-[10px] text-red-500 font-bold uppercase tracking-widest mt-1">Critical</div>
              </div>
              <div className="bg-green-50 border border-green-200 p-3 rounded-xl">
                <div className="text-xl font-black text-green-600">18</div>
                <div className="text-[10px] text-green-500 font-bold uppercase tracking-widest mt-1">On-Track</div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* QUEUE REBALANCE MODAL */}
      {showRebalanceModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 text-xs md:text-sm">
            <h3 className="text-sm md:text-base font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-orange-600">balance</span> Manual Queue Override
            </h3>

            <form onSubmit={handleConfirmRebalance} className="space-y-4">
              <div>
                <label className="text-slate-500 block mb-1 font-bold">From Caller (Source)</label>
                <select 
                  value={rebalanceFrom}
                  onChange={(e) => setRebalanceFrom(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-white"
                >
                  <option value="">Select Caller</option>
                  {currentRoster.filter(c => c.roleType !== 'matchmaker' && c.queueDepth > 0 && c.status !== 'Offline').map((c, i) => (
                    <option key={i} value={c.name}>{c.name} ({c.queueDepth} leads)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-bold">To Caller (Destination)</label>
                <select 
                  value={rebalanceTo}
                  onChange={(e) => setRebalanceTo(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-white"
                >
                  <option value="">Select Caller</option>
                  {currentRoster.filter(c => c.roleType !== 'matchmaker' && c.name !== rebalanceFrom && c.status !== 'Offline').map((c, i) => (
                    <option key={i} value={c.name}>{c.name} ({c.queueDepth} leads)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-bold">Number of Leads to Move</label>
                <input 
                  type="number"
                  min={1}
                  max={40}
                  value={rebalanceCount}
                  onChange={(e) => setRebalanceCount(Number(e.target.value))}
                  required
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold"
                />
              </div>

              <div>
                <label className="text-slate-500 block mb-1 font-bold">Manual Reassignment Reason</label>
                <textarea 
                  value={rebalanceReason}
                  onChange={(e) => setRebalanceReason(e.target.value)}
                  required
                  placeholder="Explain why this queue override is necessary..."
                  rows={3}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none resize-none font-semibold"
                />
                <span className="text-[10px] text-slate-400 block mt-1">This override will be logged in the Telecalling audit log.</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  type="button" 
                  onClick={() => { setShowRebalanceModal(false); setRebalanceReason(''); }}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-bold transition-all"
                >
                  Confirm Rebalance
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BACKUP ACTIVATION REASON MODAL */}
      {backupActiveTarget && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 border border-slate-200 text-xs md:text-sm">
            <h3 className="text-sm md:text-base font-bold text-slate-800 uppercase tracking-wider mb-3">Activate Backup Caller</h3>
            <p className="text-slate-500 mb-4 leading-normal">
              You are activating **{backupActiveTarget}** as an active caller. Select the operational reason:
            </p>

            <div className="space-y-4">
              <div>
                <label className="text-slate-500 block mb-1 font-bold">Activation Reason</label>
                <select 
                  value={backupActiveReason}
                  onChange={(e) => setBackupActiveReason(e.target.value)}
                  className="w-full border border-slate-200 rounded-lg px-3 py-2 outline-none font-bold text-slate-800 bg-white"
                >
                  <option value="Queue overflow">Queue overflow (&gt;35 leads average)</option>
                  <option value="Primary absent">Primary Caller absent / delayed</option>
                  <option value="TL override">TL override / High demand campaign</option>
                </select>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button 
                  onClick={() => setBackupActiveTarget(null)}
                  className="px-4 py-2 border border-slate-200 text-slate-500 rounded-lg font-bold hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleConfirmBackupActivation}
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-bold transition-all"
                >
                  Activate Caller
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
};

export default TlRealTimeMonitor;
