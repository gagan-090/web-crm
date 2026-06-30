import React, { useState, useEffect } from 'react';
import { useGetThCallerActivityQuery, useMoveThLeadsMutation, useGetThCallLogQuery, useGetThTelecallersQuery, useTransferThLeadsMutation } from '../../services/api/teleheadApi';
import { PageCardSkeleton } from '../../components/PageSkeleton';



interface Caller {
  id: string;
  name: string;
  process: 'DW' | 'TR' | 'SC' | 'MM' | 'QC' | 'TL';
  role: string;
  status: 'In Call' | 'Idle' | 'Wrapping Up' | 'Active' | 'Offline';
  statusTime?: string;
  currentLead: string;
  queueDepth: number;
  callsToday: number;
  revenueToday: number;
  lastActive: string;
  reportingTl: string;
}

export const ThTeamMonitor: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'DW' | 'TR+MM' | 'SC' | 'QC' | 'TL'>('ALL');
  const [isRebalanceOpen, setIsRebalanceOpen] = useState(false);
  const [rebalanceFrom, setRebalanceFrom] = useState('');
  const [rebalanceTo, setRebalanceTo] = useState('');
  const [rebalanceAmount, setRebalanceAmount] = useState('10');

  // API queries for live queue depth (using call-log endpoint)
  const { data: dwCallData } = useGetThCallLogQuery({
    from: '2026-06-01',
    to: '2026-06-17',
    process: 'Driver Onboarding',
    per_page: 1,
    page: 1
  });
  const { data: trCallData } = useGetThCallLogQuery({
    from: '2026-06-01',
    to: '2026-06-17',
    process: 'Transporter Onboarding',
    per_page: 1,
    page: 1
  });
  const { data: mmCallData } = useGetThCallLogQuery({
    from: '2026-06-01',
    to: '2026-06-17',
    process: 'Job Matching',
    per_page: 1,
    page: 1
  });
  const { data: scCallData } = useGetThCallLogQuery({
    from: '2026-06-01',
    to: '2026-06-17',
    process: 'Special Categories',
    per_page: 1,
    page: 1
  });

  const dwCount = dwCallData?.pagination?.total ?? 0;
  const trCount = trCallData?.pagination?.total ?? 0;
  const mmCount = mmCallData?.pagination?.total ?? 0;
  const scCount = scCallData?.pagination?.total ?? 0;

  const maxCount = Math.max(dwCount, trCount, mmCount, scCount) || 1;

  // Interactive backups state
  const [backups, setBackups] = useState([
    { id: 'B01', name: 'Ankit', target: 'Driver Welcome Backup', active: false },
    { id: 'B02', name: 'Preeti', target: 'Transporter Welcome Backup', active: true },
    { id: 'B03', name: 'Rohan', target: 'Matchmaking Backup', active: false },
    { id: 'B04', name: 'Sana', target: 'Special Categories Backup', active: false },
  ]);

  const { data: activityData, isLoading, isFetching, error, refetch } = useGetThCallerActivityQuery(undefined, {
    pollingInterval: 5000,
  });
  const [moveLeads] = useMoveThLeadsMutation();
  const [transferLeads, { isLoading: isTransferring }] = useTransferThLeadsMutation();

  const { data: telecallersData } = useGetThTelecallersQuery();
  const telecallers = React.useMemo(() => {
    return Array.isArray(telecallersData) ? telecallersData : (telecallersData?.data || []);
  }, [telecallersData]);

  const [callers, setCallers] = useState<Caller[]>([]);

  useEffect(() => {
    if (activityData?.data) {
      const mapped = activityData.data.map((caller: any) => {
        let status: 'In Call' | 'Idle' | 'Wrapping Up' | 'Active' | 'Offline' = 'Offline';
        if (caller.last_active) {
          if (caller.last_call_status === 'connected') {
            status = 'In Call';
          } else if (caller.last_call_status === 'not_connected' || caller.last_call_status === 'callback_later') {
            status = 'Wrapping Up';
          } else {
            status = 'Idle';
          }
        }

        let mappedProcess: 'DW' | 'TR' | 'SC' | 'MM' | 'QC' | 'TL' = 'DW';
        if (caller.process === 'welcome-call') mappedProcess = 'DW';
        else if (caller.process === 'transporter') mappedProcess = 'TR';
        else if (caller.process === 'match-making') mappedProcess = 'MM';
        else if (caller.process === 'special') mappedProcess = 'SC';
        else if (caller.process === 'qc') mappedProcess = 'QC';
        else if (caller.process === 'tl') mappedProcess = 'TL';

        return {
          id: caller.id.toString(),
          name: caller.name,
          process: mappedProcess,
          role: caller.role || (mappedProcess === 'DW' || mappedProcess === 'TR' ? 'Welcome Caller' : mappedProcess === 'MM' ? 'Matchmaker' : mappedProcess === 'SC' ? 'Special Categories' : mappedProcess === 'QC' ? 'QC Analyst' : 'Team Leader'),
          status,
          statusTime: undefined,
          currentLead: caller.last_call_status || '-',
          queueDepth: caller.pending_calls ?? 0,
          callsToday: caller.calls_today ?? 0,
          revenueToday: caller.revenue_today ?? 0,
          lastActive: caller.last_active ? caller.last_active.split(' ')[1] : '—',
          reportingTl: caller.reporting_tl || '—'
        };
      });
      setCallers(mapped);
    }
  }, [activityData]);

  const toggleBackup = (id: string) => {
    setBackups(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const handleRebalance = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rebalanceFrom || !rebalanceTo) return;

    const fromCaller = callers.find(c => c.name === rebalanceFrom);
    const toCaller = callers.find(c => c.name === rebalanceTo);
    if (!fromCaller || !toCaller) return;

    try {
      await transferLeads({
        from_telecaller_id: parseInt(fromCaller.id),
        to_telecaller_id: parseInt(toCaller.id),
        lead_count: parseInt(rebalanceAmount)
      }).unwrap();
      refetch();
      setIsRebalanceOpen(false);
    } catch (err) {
      alert('Failed to rebalance leads: ' + JSON.stringify(err));
    }
  };

  // Filter logic
  const filteredCallers = callers.filter(c => {
    if (activeFilter === 'ALL') return true;
    if (activeFilter === 'DW') return c.process === 'DW';
    if (activeFilter === 'TR+MM') return c.process === 'TR' || c.process === 'MM';
    if (activeFilter === 'SC') return c.process === 'SC';
    if (activeFilter === 'QC') return c.process === 'QC';
    if (activeFilter === 'TL') return c.process === 'TL';
    return true;
  });

  if (isLoading) {
    return <PageCardSkeleton cards={6} title="Team Monitor" />;
  }

  return (
    <main className="bg-background p-md space-y-lg text-xs font-sans max-w-[1440px] mx-auto">
      {/* Header controls */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-white p-sm border border-outline-variant rounded-sm flipkart-shadow">
        <div className="flex items-center gap-sm">
          <span className={`w-2.5 h-2.5 rounded-full bg-green-500 ${isFetching ? 'animate-ping' : 'animate-pulse'}`}></span>
          <span className="font-extrabold uppercase text-outline text-[10px] tracking-wider flex items-center gap-xs">
            Live Global Monitor (Refreshes every 5s)
            {isFetching && (
              <span className="inline-block w-3.5 h-3.5 border-2 border-primary border-t-transparent rounded-full animate-spin ml-xs" title="Syncing..."></span>
            )}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-xs flex-wrap select-none">
          {(['ALL', 'DW', 'TR+MM', 'SC', 'QC', 'TL'] as const).map(f => {
            const count = callers.filter(c => {
              if (f === 'ALL') return true;
              if (f === 'DW') return c.process === 'DW';
              if (f === 'TR+MM') return c.process === 'TR' || c.process === 'MM';
              return c.process === f;
            }).length;

            return (
              <button
                key={f}
                onClick={() => setActiveFilter(f)}
                className={`px-sm py-1 font-bold text-[10px] rounded-sm transition-colors border ${activeFilter === f
                  ? 'bg-primary text-white border-primary'
                  : 'bg-white text-on-surface hover:bg-surface-container border-outline-variant'
                  }`}
              >
                {f} ({count})
              </button>
            );
          })}
        </div>
      </section>

      {/* Main Grid: Queue and Backups */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        {/* Left: Queue Depth */}
        <div className="lg:col-span-8 bg-white border border-outline-variant p-md rounded-sm flipkart-shadow">
          <div className="flex justify-between items-center mb-md border-b border-outline-variant pb-xs">
            <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface">
              Live Queue Depth by Process
            </h3>
            <button
              onClick={() => setIsRebalanceOpen(true)}
              className="bg-primary text-white px-md py-1 font-bold rounded-sm hover:opacity-90 transition-opacity"
            >
              Cross-Team Rebalance
            </button>
          </div>
          <div className="space-y-sm">
            {[
              { name: 'Driver Welcome (DW)', pct: Math.round((dwCount / maxCount) * 100), count: dwCount, color: 'bg-green-500' },
              { name: 'Transport Welcome (TR)', pct: Math.round((trCount / maxCount) * 100), count: trCount, color: 'bg-orange-500' },
              { name: 'Match Making (MM)', pct: Math.round((mmCount / maxCount) * 100), count: mmCount, color: 'bg-purple-500' },
              { name: 'Special Categories (SC)', pct: Math.round((scCount / maxCount) * 100), count: scCount, color: 'bg-teal-500' },
            ].map(queue => (
              <div key={queue.name} className="flex items-center gap-md">
                <span className="w-48 font-bold text-on-surface shrink-0">{queue.name}</span>
                <div className="flex-1 bg-surface-container h-4 rounded-sm relative overflow-hidden">
                  <div
                    className={`${queue.color} h-full transition-all duration-1000`}
                    style={{ width: `${queue.pct}%` }}
                  ></div>
                </div>
                <span className="w-10 font-data-mono text-right font-bold text-on-surface">{queue.count}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Backup Activation */}
        <div className="lg:col-span-4 bg-white border border-outline-variant p-md rounded-sm flipkart-shadow">
          <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface mb-md border-b border-outline-variant pb-xs">
            Global Backup Oversight
          </h3>
          <div className="grid grid-cols-2 gap-sm">
            {backups.map(backup => (
              <div
                key={backup.id}
                onClick={() => toggleBackup(backup.id)}
                className={`border p-sm rounded-sm flex flex-col justify-between cursor-pointer transition-all ${backup.active
                  ? 'border-primary bg-primary/5 shadow-sm'
                  : 'border-outline-variant bg-white hover:bg-surface-container'
                  }`}
              >
                <div className="flex justify-between items-start mb-xs">
                  <span className={`font-bold ${backup.active ? 'text-primary' : 'text-on-surface'}`}>
                    {backup.id} - {backup.name}
                  </span>
                  <input
                    type="checkbox"
                    checked={backup.active}
                    readOnly
                    className="w-8 h-4 rounded-full bg-outline-variant checked:bg-primary-container appearance-none relative transition-all cursor-pointer before:content-[''] before:absolute before:w-3 before:h-3 before:bg-white before:rounded-full before:top-0.5 before:left-0.5 checked:before:left-4 before:transition-all pointer-events-none"
                  />
                </div>
                <span className={`text-[9px] ${backup.active ? 'text-primary font-bold' : 'text-outline font-medium'}`}>
                  {backup.active ? 'ACTIVE' : 'READY'} — {backup.target}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Caller Activity Table */}
      <section className="bg-white border border-outline-variant rounded-sm flipkart-shadow overflow-hidden">
        <div className="px-md py-sm bg-surface-container-low border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-label-caps text-outline uppercase font-bold">Caller Activity Database</h3>
          <div className="flex gap-md text-[10px] font-bold text-outline">
            <span className="flex items-center gap-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 font-bold"></span> {callers.filter(c => c.status === 'In Call').length} In Call
            </span>
            <span className="flex items-center gap-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 font-bold"></span> {callers.filter(c => c.status === 'Idle').length} Idle
            </span>
            <span className="flex items-center gap-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 font-bold"></span> {callers.filter(c => c.status === 'Wrapping Up').length} Wrapping
            </span>
            <span className="flex items-center gap-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400 font-bold"></span> {callers.filter(c => c.status === 'Offline').length} Offline
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-surface-container text-outline text-[10px] uppercase font-extrabold border-b border-outline-variant">
              <tr>
                <th className="px-md py-3">Name</th>
                <th className="px-md py-3">Process</th>
                <th className="px-md py-3">Role</th>
                <th className="px-md py-3">Status</th>
                <th className="px-md py-3">Current Lead</th>
                <th className="px-md py-3">Queue Depth</th>
                <th className="px-md py-3">Calls Today</th>
                <th className="px-md py-3">Revenue Today</th>
                <th className="px-md py-3">Last Active</th>
                <th className="px-md py-3">Reporting TL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant font-medium text-on-surface">
              {isLoading ? (
                Array.from({ length: 6 }).map((_, idx) => (
                  <tr key={idx} className="animate-pulse">
                    <td className="px-md py-3.5"><div className="h-3.5 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-md py-3.5"><div className="h-3.5 bg-gray-200 rounded w-8"></div></td>
                    <td className="px-md py-3.5"><div className="h-3.5 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-md py-3.5"><div className="h-3.5 bg-gray-200 rounded w-12"></div></td>
                    <td className="px-md py-3.5"><div className="h-3.5 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-md py-3.5"><div className="h-3.5 bg-gray-200 rounded w-24"></div></td>
                    <td className="px-md py-3.5"><div className="h-3.5 bg-gray-200 rounded w-8"></div></td>
                    <td className="px-md py-3.5"><div className="h-3.5 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-md py-3.5"><div className="h-3.5 bg-gray-200 rounded w-12"></div></td>
                    <td className="px-md py-3.5"><div className="h-3.5 bg-gray-200 rounded w-20"></div></td>
                  </tr>
                ))
              ) : error ? (
                <tr>
                  <td colSpan={10} className="px-md py-8 text-center text-red-600 font-bold">
                    ⚠️ Error loading caller activity database. Please check your connection.
                  </td>
                </tr>
              ) : filteredCallers.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-md py-8 text-center text-outline font-bold">
                    {activeFilter === 'ALL'
                      ? 'No callers found in the database.'
                      : `No callers found matching the selected filter (${activeFilter}).`}
                  </td>
                </tr>
              ) : (
                filteredCallers.map(caller => (
                  <tr
                    key={caller.id}
                    className={`hover:bg-surface-container transition-colors ${caller.status === 'Idle' ? 'bg-red-50/20' : ''
                      }`}
                  >
                    <td className="px-md py-3 font-bold">{caller.name}</td>
                    <td className="px-md py-3">
                      <span
                        className={`px-2 py-0.5 border text-[9px] font-extrabold rounded-sm ${caller.process === 'DW'
                          ? 'border-green-300 text-green-700 bg-green-50'
                          : caller.process === 'TR'
                            ? 'border-orange-300 text-orange-700 bg-orange-50'
                            : caller.process === 'SC'
                              ? 'border-teal-300 text-teal-700 bg-teal-50'
                              : caller.process === 'MM'
                                ? 'border-purple-300 text-purple-700 bg-purple-50'
                                : 'border-slate-300 text-slate-700 bg-slate-50'
                          }`}
                      >
                        {caller.process}
                      </span>
                    </td>
                    <td className="px-md py-3 text-outline-variant font-semibold">{caller.role}</td>
                    <td className="px-md py-3">
                      <span
                        className={`font-bold flex items-center gap-xs ${caller.status === 'In Call'
                          ? 'text-green-600'
                          : caller.status === 'Wrapping Up'
                            ? 'text-yellow-600'
                            : caller.status === 'Idle'
                              ? 'text-red-500'
                              : 'text-outline'
                          }`}
                      >
                        {caller.status} {caller.statusTime && `(${caller.statusTime})`}
                      </span>
                    </td>
                    <td className="px-md py-3 font-data-mono">{caller.currentLead}</td>
                    <td className="px-md py-3">
                      <div className="flex items-center gap-xs">
                        <span className="font-data-mono min-w-[40px] text-right shrink-0">{caller.queueDepth.toLocaleString()}</span>
                        <div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden shrink-0">
                          <div
                            className={`h-full ${caller.queueDepth > 10 ? 'bg-red-500' : 'bg-primary'}`}
                            style={{ width: `${caller.queueDepth > 0 ? Math.min(100, caller.queueDepth > 10 ? 100 : caller.queueDepth * 8) : 0}%` }}
                          ></div>
                        </div>
                      </div>
                    </td>
                    <td className="px-md py-3 font-data-mono">{caller.callsToday}</td>
                    <td className="px-md py-3 font-data-mono">
                      {caller.revenueToday > 0 ? `₹${caller.revenueToday.toLocaleString()}` : '—'}
                    </td>
                    <td className="px-md py-3 text-outline">{caller.lastActive}</td>
                    <td className="px-md py-3 font-bold text-primary">{caller.reportingTl}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Queue Rebalance Modal */}
      {isRebalanceOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
          <form
            onSubmit={handleRebalance}
            className="bg-white border border-outline-variant flipkart-shadow max-w-sm w-full p-lg rounded-sm space-y-md"
          >
            <h3 className="font-headline-md text-sm font-extrabold uppercase border-b pb-xs border-outline-variant">
              Cross-Team Queue Rebalance
            </h3>

            <div className="space-y-sm">
              <div>
                <label className="text-[10px] text-outline font-bold uppercase block mb-1">From Caller</label>
                <select
                  required
                  value={rebalanceFrom}
                  onChange={(e) => setRebalanceFrom(e.target.value)}
                  className="w-full bg-white border border-outline-variant p-sm rounded-sm focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">Select Caller...</option>
                  {telecallers
                    .map((tc: any) => {
                      const detail = callers.find(c => c.id.toString() === tc.id.toString() || c.name === tc.name);
                      return {
                        id: tc.id.toString(),
                        name: tc.name,
                        process: detail?.process || 'DW',
                        queueDepth: detail?.queueDepth || 0,
                      };
                    })
                    .filter(c => c.queueDepth > 0 && c.process !== 'TL')
                    .map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.process} - {c.queueDepth} leads)</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-outline font-bold uppercase block mb-1">To Caller</label>
                <select
                  required
                  value={rebalanceTo}
                  onChange={(e) => setRebalanceTo(e.target.value)}
                  className="w-full bg-white border border-outline-variant p-sm rounded-sm focus:ring-1 focus:ring-primary outline-none"
                >
                  <option value="">Select Target Caller...</option>
                  {telecallers
                    .map((tc: any) => {
                      const detail = callers.find(c => c.id.toString() === tc.id.toString() || c.name === tc.name);
                      return {
                        id: tc.id.toString(),
                        name: tc.name,
                        process: detail?.process || 'DW',
                        queueDepth: detail?.queueDepth || 0,
                      };
                    })
                    .filter(c => c.name !== rebalanceFrom && c.process !== 'TL')
                    .map(c => (
                      <option key={c.id} value={c.name}>{c.name} ({c.process} - {c.queueDepth} leads)</option>
                    ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] text-outline font-bold uppercase block mb-1">Leads Amount to Transfer</label>
                <input
                  type="number"
                  required
                  min="1"
                  value={rebalanceAmount}
                  onChange={(e) => setRebalanceAmount(e.target.value)}
                  className="w-full bg-white border border-outline-variant p-sm rounded-sm focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="flex gap-sm justify-end pt-sm border-t border-outline-variant">
              <button
                type="button"
                onClick={() => setIsRebalanceOpen(false)}
                className="px-md py-1 border border-outline-variant rounded-sm font-bold text-[11px] hover:bg-surface-container"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isTransferring}
                className="px-md py-1 bg-primary text-white rounded-sm font-bold text-[11px] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTransferring ? 'Rebalancing...' : 'Rebalance'}
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default ThTeamMonitor;
