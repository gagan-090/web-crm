import React, { useState } from 'react';
import KPIWidget from '../../../shared/components/business/KPIWidget';
import SLAIndicator from '../../../shared/components/business/SLAIndicator';

interface TeamMember {
  id: string;
  name: string;
  role: 'DW' | 'WCT' | 'MM' | 'SC';
  status: 'idle' | 'dialing' | 'connected' | 'wrapup' | 'break';
  duration: string;
  slaStatus: 'optimal' | 'warning' | 'breached';
  lastCallTime: string;
  targetCalls: number;
  completedCalls: number;
}

export const TeamMonitorPage: React.FC = () => {
  const [listenInAgent, setListenInAgent] = useState<string | null>(null);

  const [members] = useState<TeamMember[]>([
    { id: '1', name: 'Amit Sharma', role: 'DW', status: 'connected', duration: '03:45', slaStatus: 'optimal', lastCallTime: 'Just now', targetCalls: 100, completedCalls: 62 },
    { id: '2', name: 'Pooja Verma', role: 'WCT', status: 'dialing', duration: '00:18', slaStatus: 'optimal', lastCallTime: '1 min ago', targetCalls: 120, completedCalls: 45 },
    { id: '3', name: 'Vikram Singh', role: 'MM', status: 'connected', duration: '08:12', slaStatus: 'warning', lastCallTime: 'Just now', targetCalls: 80, completedCalls: 38 },
    { id: '4', name: 'Karan Malhotra', role: 'SC', status: 'break', duration: '14:20', slaStatus: 'optimal', lastCallTime: '15 mins ago', targetCalls: 70, completedCalls: 22 },
    { id: '5', name: 'Sunita Rao', role: 'DW', status: 'wrapup', duration: '02:05', slaStatus: 'optimal', lastCallTime: '2 mins ago', targetCalls: 100, completedCalls: 58 },
    { id: '6', name: 'Rohan Gupta', role: 'WCT', status: 'connected', duration: '12:50', slaStatus: 'breached', lastCallTime: 'Just now', targetCalls: 120, completedCalls: 74 }
  ]);

  const handleListenIn = (agentName: string) => {
    setListenInAgent(prev => prev === agentName ? null : agentName);
  };

  return (
    <div className="space-y-md">
      {/* Top Monitor KPIs */}
      <div className="grid grid-cols-4 gap-md">
        <KPIWidget title="Active on Dialers" value="5 / 6 Agents" subtext="1 agent on break" icon="group" />
        <KPIWidget title="Avg talk duration" value="4m 12s" subtext="Target: <5 mins" icon="call" />
        <KPIWidget title="SLA Warnings" value="2 Alerts" subtext="1 Breached SLA" color="text-error" icon="timer_off" />
        <KPIWidget title="Daily Call Target" value="299 / 600" subtext="49.8% Progress" icon="done_all" />
      </div>

      {/* Listen-in simulation banner */}
      {listenInAgent && (
        <div className="bg-[#1b1c1c] text-white p-md border border-outline rounded-sm flex items-center justify-between flipkart-shadow animate-pulse">
          <div className="flex items-center gap-md">
            <span className="material-symbols-outlined text-green-500 animate-spin">hearing</span>
            <div>
              <p className="text-xs font-bold">Listening in to: <span className="text-primary-fixed">{listenInAgent}</span></p>
              <p className="text-[10px] text-outline">Supervision Whisper Mode: Active. Agent can hear you, transporter cannot.</p>
            </div>
          </div>
          <button
            onClick={() => setListenInAgent(null)}
            className="px-sm py-1 bg-error text-white font-label-caps text-xs rounded-sm hover:bg-red-700"
          >
            DISCONNECT
          </button>
        </div>
      )}

      {/* Agents Monitor Grid */}
      <div className="bg-white border border-outline-variant rounded-sm p-md flipkart-shadow">
        <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface mb-md">
          Live Agent Monitor Board
        </h3>

        <div className="grid grid-cols-3 gap-md">
          {members.map((m) => {
            const statusConfig = {
              connected: { label: 'ON CALL', color: 'bg-green-100 text-green-800 border-green-300' },
              dialing: { label: 'DIALING', color: 'bg-blue-100 text-blue-800 border-blue-300' },
              wrapup: { label: 'WRAP UP', color: 'bg-orange-100 text-orange-800 border-orange-300' },
              break: { label: 'ON BREAK', color: 'bg-amber-100 text-amber-800 border-amber-300' },
              idle: { label: 'IDLE', color: 'bg-gray-100 text-gray-800 border-gray-300' }
            };

            return (
              <div
                key={m.id}
                className={`border border-outline-variant rounded-sm p-md flex flex-col justify-between space-y-md hover:border-primary transition-all bg-surface-container-low`}
              >
                {/* Agent Identity & Status */}
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-sm">
                      <h4 className="font-bold text-sm text-on-surface">{m.name}</h4>
                      <span className="px-1.5 py-0.5 bg-inverse-surface text-white text-[9px] font-extrabold rounded-sm">
                        {m.role}
                      </span>
                    </div>
                    <span className={`inline-block px-1.5 py-0.5 rounded-sm border text-[10px] font-bold mt-sm ${statusConfig[m.status].color}`}>
                      {statusConfig[m.status].label}
                    </span>
                  </div>
                  <SLAIndicator status={m.slaStatus} timeRemaining={m.duration} />
                </div>

                {/* Progress Stats */}
                <div className="space-y-sm text-xs border-t border-outline-variant pt-sm">
                  <div className="flex justify-between">
                    <span className="text-outline">Calls completed:</span>
                    <span className="font-bold">{m.completedCalls} / {m.targetCalls}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-outline">Last Dialed:</span>
                    <span className="font-data-mono text-on-surface-variant">{m.lastCallTime}</span>
                  </div>
                </div>

                {/* Supervisor controls (TH/TL/Admin only) */}
                <div className="flex gap-sm border-t border-outline-variant pt-sm">
                  <button
                    disabled={m.status !== 'connected'}
                    onClick={() => handleListenIn(m.name)}
                    className="flex-1 flex items-center justify-center gap-xs px-xs py-1 border border-outline-variant text-[11px] font-bold rounded-sm bg-white hover:bg-surface-container text-on-surface disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">hearing</span>
                    <span>Listen</span>
                  </button>
                  <button
                    disabled={m.status !== 'connected'}
                    className="flex-1 flex items-center justify-center gap-xs px-xs py-1 border border-outline-variant text-[11px] font-bold rounded-sm bg-white hover:bg-surface-container text-on-surface disabled:opacity-50"
                  >
                    <span className="material-symbols-outlined text-sm">record_voice_over</span>
                    <span>Whisper</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
export default TeamMonitorPage;
