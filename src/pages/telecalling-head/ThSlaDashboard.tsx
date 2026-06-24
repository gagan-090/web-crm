import React, { useState, useEffect } from 'react';
import {
  useGetThSlaDashboardQuery,
  useGetThTeamMonitorQuery,
  useReassignThLeadsMutation,
} from '../../services/api/teleheadApi';

interface SlaItem {
  id: string;
  type: 'First-Call' | 'Premium Fill' | 'Super Premium Fill';
  process: 'TR' | 'MM';
  leadJobId: string;
  partyName: string;
  deadline: string;
  timeRemaining: string;
  assignedCaller: string;
  assignedTl: string;
  status: 'Critical' | 'At Risk' | 'Healthy';
}

interface Escalation {
  id: string;
  tlName: string;
  note: string;
  timestamp: string;
  leadJobId: string;
  partyName: string;
  type: string;
}

export const ThSlaDashboard: React.FC = () => {
  const { data: slaData, refetch } = useGetThSlaDashboardQuery();
  const { data: teamData } = useGetThTeamMonitorQuery({ process: 'all' });
  const [reassignThLeads] = useReassignThLeadsMutation();

  const [slaItems, setSlaItems] = useState<SlaItem[]>([]);
  const [escalations, setEscalations] = useState<Escalation[]>([
    { id: 'esc-1', tlName: 'Rajendra', note: 'Transporter is premium and SLA deadline is tomorrow. Caller on leave.', timestamp: '10m ago', leadJobId: '#JOB-8842', partyName: 'VRL Logistics Ltd', type: 'Super Premium Fill' },
    { id: 'esc-2', tlName: 'Rahul', note: 'Multiple call attempts no response. Escalating to check details.', timestamp: '1h ago', leadJobId: 'TR-1012', partyName: 'BlueDart Surface', type: 'First-Call' },
  ]);

  const [selectedItemForReassign, setSelectedItemForReassign] = useState<SlaItem | null>(null);
  const [reassignTargetCaller, setReassignTargetCaller] = useState('');
  const [processFilter, setProcessFilter] = useState<'ALL' | 'TR' | 'MM'>('ALL');

  useEffect(() => {
    if (slaData) {
      const trItems = slaData.tr_sla?.data?.map((item: any) => ({
        id: item.id?.toString() || item.unique_id,
        type: 'First-Call' as const,
        process: 'TR' as const,
        leadJobId: item.unique_id,
        partyName: item.name,
        deadline: item.registered_at ? item.registered_at.split(' ')[0] : 'Today',
        timeRemaining: `${item.mins_since_registration}m elapsed`,
        assignedCaller: item.assigned_caller || 'Unassigned',
        assignedTl: 'Rajendra',
        status: (item.sla_status === 'CRITICAL' ? 'Critical' : item.sla_status === 'WARNING' ? 'At Risk' : 'Healthy') as any
      })) || [];

      const mmItems = slaData.mm_sla?.data?.map((item: any) => ({
        id: item.job_id,
        type: 'Super Premium Fill' as const,
        process: 'MM' as const,
        leadJobId: item.job_id,
        partyName: item.transporter_name,
        deadline: item.sla_deadline,
        timeRemaining: `${item.days_remaining} Days`,
        assignedCaller: item.assigned_caller || 'Unassigned',
        assignedTl: 'Rajendra',
        status: (item.sla_status === 'CRITICAL' ? 'Critical' : item.sla_status === 'WARNING' ? 'At Risk' : 'Healthy') as any
      })) || [];

      setSlaItems([...trItems, ...mmItems]);
    }
  }, [slaData]);

  // Available callers from teamMonitorData
  const availableCallers = teamData?.data
    ?.filter(c => c.process !== 'TL')
    ?.map(c => `${c.name} (${c.process === 'welcome-call' ? 'DW' : c.process === 'transporter' ? 'TR' : c.process === 'match-making' ? 'MM' : 'SC'})`) || [
    'Sonam (DW)',
    'Ankit Singh (DW)',
    'Arpita (DW)',
    'Pooja Pal (MM)',
    'Tanisha (MM)'
  ];

  const handleAcknowledgeEscalation = (id: string) => {
    setEscalations(prev => prev.filter(e => e.id !== id));
  };

  const handleReassignSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedItemForReassign || !reassignTargetCaller) return;

    // Find admin_id of target caller
    const callerName = reassignTargetCaller.split(' ')[0];
    const targetCaller = teamData?.data?.find(c => c.name === callerName);
    if (!targetCaller) {
      alert('Selected target caller not found in team database');
      return;
    }

    try {
      await reassignThLeads({
        user_ids: [parseInt(selectedItemForReassign.id)],
        to_admin_id: targetCaller.id,
        reason: 'SLA Dashboard Overridden Reassignment'
      }).unwrap();
      refetch();
      setSelectedItemForReassign(null);
      setReassignTargetCaller('');
    } catch (err) {
      alert('Failed to reassign leads: ' + JSON.stringify(err));
    }
  };

  const filteredItems = slaItems.filter(
    item => processFilter === 'ALL' || item.process === processFilter
  );

  return (
    <main className="bg-background p-md space-y-lg text-xs font-sans max-w-[1440px] mx-auto">
      {/* Top Metric Bar */}
      <section className="grid grid-cols-3 gap-md">
        <div className="bg-white border border-outline-variant p-md rounded-sm flipkart-shadow">
          <p className="font-label-caps text-outline text-[10px] uppercase font-bold">Company-Wide SLA Compliance</p>
          <p className="text-2xl font-extrabold text-green-600 mt-xs">{slaData?.compliance_rate ? `${slaData.compliance_rate}%` : '92.8%'}</p>
        </div>
        <div className="bg-white border border-outline-variant p-md rounded-sm flipkart-shadow">
          <p className="font-label-caps text-outline text-[10px] uppercase font-bold">Active SLA Breaches</p>
          <p className="text-2xl font-extrabold text-red-600 mt-xs">{(slaData?.tr_sla?.breached || 0) + (slaData?.mm_sla?.breached || 0) || 2}</p>
        </div>
        <div className="bg-white border border-outline-variant p-md rounded-sm flipkart-shadow">
          <p className="font-label-caps text-outline text-[10px] uppercase font-bold">At-Risk (Within 24 Hours)</p>
          <p className="text-2xl font-extrabold text-amber-600 mt-xs">{(slaData?.tr_sla?.critical || 0) + (slaData?.mm_sla?.critical || 0) || 4}</p>
        </div>
      </section>

      {/* Unified SLA Table */}
      <section className="bg-white border border-outline-variant rounded-sm flipkart-shadow overflow-hidden">
        <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-label-caps text-outline uppercase font-bold">Unified SLA Command Center</h3>

          <div className="flex border border-outline-variant rounded-sm overflow-hidden select-none">
            {(['ALL', 'TR', 'MM'] as const).map(p => (
              <button
                key={p}
                onClick={() => setProcessFilter(p)}
                className={`px-sm py-1 font-bold text-[10px] transition-colors ${processFilter === p ? 'bg-primary text-white' : 'bg-surface hover:bg-surface-container'
                  }`}
              >
                {p === 'ALL' ? 'All Processes' : p}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container text-outline text-[10px] uppercase font-extrabold border-b border-outline-variant">
              <tr>
                <th className="px-md py-3">Type</th>
                <th className="px-md py-3">Process</th>
                <th className="px-md py-3">Lead/Job ID</th>
                <th className="px-md py-3">Party Name</th>
                <th className="px-md py-3">Deadline</th>
                <th className="px-md py-3">Time Remaining</th>
                <th className="px-md py-3">Assigned Caller</th>
                <th className="px-md py-3">Assigned TL</th>
                <th className="px-md py-3">Status</th>
                <th className="px-md py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-medium text-on-surface">
              {filteredItems.map(item => (
                <tr
                  key={item.id}
                  className={`hover:bg-surface-container transition-colors ${item.status === 'Critical'
                    ? 'bg-red-50/20'
                    : item.status === 'At Risk'
                      ? 'bg-amber-50/10'
                      : ''
                    }`}
                >
                  <td className="px-md py-3 font-bold">{item.type}</td>
                  <td className="px-md py-3">
                    <span
                      className={`px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold text-white ${item.process === 'TR' ? 'bg-orange-500' : 'bg-purple-500'
                        }`}
                    >
                      {item.process}
                    </span>
                  </td>
                  <td className="px-md py-3 font-data-mono">{item.leadJobId}</td>
                  <td className="px-md py-3 font-bold">{item.partyName}</td>
                  <td className="px-md py-3 text-outline">{item.deadline}</td>
                  <td className="px-md py-3 font-bold font-data-mono">{item.timeRemaining}</td>
                  <td className="px-md py-3">{item.assignedCaller}</td>
                  <td className="px-md py-3 text-primary">{item.assignedTl}</td>
                  <td className="px-md py-3">
                    <span
                      className={`px-2 py-0.5 rounded text-[9px] font-extrabold ${item.status === 'Critical'
                        ? 'bg-red-100 text-red-800'
                        : item.status === 'At Risk'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-green-100 text-green-800'
                        }`}
                    >
                      {item.status.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-md py-3 text-right">
                    <button
                      onClick={() => setSelectedItemForReassign(item)}
                      className="bg-primary text-white px-2 py-1 font-bold rounded-sm uppercase text-[9px] hover:opacity-90 active:scale-95"
                    >
                      Reassign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Escalation Inbox */}
      <section className="bg-white border border-outline-variant rounded-sm flipkart-shadow p-md">
        <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface mb-md border-b border-outline-variant pb-xs">
          Escalation Inbox (TL to Head)
        </h3>
        <div className="space-y-sm">
          {escalations.map(esc => (
            <div
              key={esc.id}
              className="border border-red-200 bg-red-50/20 p-md rounded-sm flex flex-col md:flex-row md:items-center justify-between gap-md"
            >
              <div className="space-y-xs">
                <div className="flex items-center gap-sm">
                  <span className="bg-red-100 text-red-800 px-1.5 py-0.5 rounded-sm font-extrabold text-[9px]">ESCALATION</span>
                  <span className="font-bold text-on-surface">{esc.partyName} ({esc.leadJobId})</span>
                  <span className="text-outline text-[9px] font-data-mono font-semibold">{esc.timestamp}</span>
                </div>
                <p className="font-medium text-on-surface-variant">
                  <strong className="text-primary">{esc.tlName} (TL) Note:</strong> "{esc.note}"
                </p>
              </div>
              <div className="flex gap-sm select-none">
                <button
                  onClick={() => handleAcknowledgeEscalation(esc.id)}
                  className="px-md py-1 border border-outline-variant font-bold rounded-sm hover:bg-surface-container transition-colors"
                >
                  Acknowledge
                </button>
                <button
                  onClick={() => {
                    const matchedItem = slaItems.find(i => i.leadJobId === esc.leadJobId);
                    if (matchedItem) {
                      setSelectedItemForReassign(matchedItem);
                    }
                  }}
                  className="px-md py-1 bg-error text-white font-bold rounded-sm hover:opacity-90"
                >
                  Override & Reassign
                </button>
              </div>
            </div>
          ))}
          {escalations.length === 0 && (
            <p className="text-center text-outline py-md font-bold">No active escalated SLAs pending.</p>
          )}
        </div>
      </section>

      {/* Root Cause Logs */}
      <section className="bg-white border border-outline-variant rounded-sm flipkart-shadow overflow-hidden">
        <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-label-caps text-outline uppercase font-bold">Breach History & Root Cause Log</h3>
          <button className="text-primary font-bold hover:underline">Download CSV Log</button>
        </div>
        <div className="p-md">
          <div className="space-y-xs">
            <div className="grid grid-cols-5 text-[10px] font-bold text-outline uppercase px-sm py-xs border-b border-outline-variant">
              <span>Timestamp</span>
              <span>Entity / ID</span>
              <span>Breach Type</span>
              <span>Owner</span>
              <span>Action Logs</span>
            </div>
            {[
              { time: '24 Oct, 09:15', entity: '#JOB-8722', type: 'Unassigned > 24h', owner: 'System Admin', action: 'Auto-Queued to Backup' },
              { time: '23 Oct, 18:00', entity: 'TR-9921', type: 'Call SLA Breach', owner: 'Ravi', action: 'Manager Escalated' },
              { time: '23 Oct, 14:45', entity: '#JOB-8650', type: 'No Call > 48h', owner: 'Priya M.', action: 'Force Rebalance' },
            ].map((log, index) => (
              <div
                key={index}
                className="grid grid-cols-5 text-[11px] px-sm py-sm border-b border-outline-variant/30 hover:bg-surface-container-low transition-colors items-center font-medium"
              >
                <span className="font-data-mono">{log.time}</span>
                <span className="font-bold">{log.entity}</span>
                <span className="text-red-600 font-bold">{log.type}</span>
                <span>{log.owner}</span>
                <span>
                  <span className="px-sm py-0.5 bg-surface-container rounded-sm font-semibold">{log.action}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Reassign Modal */}
      {selectedItemForReassign && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <form
            onSubmit={handleReassignSubmit}
            className="bg-white border border-outline-variant flipkart-shadow max-w-sm w-full p-lg rounded-sm space-y-md"
          >
            <h3 className="font-headline-md text-sm font-extrabold uppercase border-b pb-xs border-outline-variant">
              Override Assignment
            </h3>

            <div className="space-y-sm text-xs">
              <p className="font-medium text-on-surface-variant">
                Reassigning SLA target <strong className="text-primary">{selectedItemForReassign.partyName} ({selectedItemForReassign.leadJobId})</strong>.
              </p>
              <div>
                <label className="text-[10px] text-outline font-bold uppercase block mb-1">Target Caller (Company-Wide)</label>
                <select
                  required
                  value={reassignTargetCaller}
                  onChange={(e) => setReassignTargetCaller(e.target.value)}
                  className="w-full bg-white border border-outline-variant p-sm rounded-sm focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">Select Caller...</option>
                  {availableCallers.map(caller => (
                    <option key={caller} value={caller}>{caller}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex gap-sm justify-end pt-sm border-t border-outline-variant">
              <button
                type="button"
                onClick={() => setSelectedItemForReassign(null)}
                className="px-md py-1 border border-outline-variant rounded-sm font-bold text-[11px] hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-md py-1 bg-primary text-white rounded-sm font-bold text-[11px] hover:opacity-90"
              >
                Apply Reassign
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default ThSlaDashboard;
