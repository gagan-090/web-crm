import React, { useState } from 'react';

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

  // Interactive backups state
  const [backups, setBackups] = useState([
    { id: 'B01', name: 'Ankit', target: 'Driver Welcome Backup', active: false },
    { id: 'B02', name: 'Preeti', target: 'Transporter Welcome Backup', active: true },
    { id: 'B03', name: 'Rohan', target: 'Matchmaking Backup', active: false },
    { id: 'B04', name: 'Sana', target: 'Special Categories Backup', active: false },
  ]);

  // List of all 19 callers system-wide
  const [callers, setCallers] = useState<Caller[]>([
    { id: '1', name: 'Sonam', process: 'DW', role: 'Welcome Caller', status: 'In Call', statusTime: '04:12', currentLead: 'DR-48291', queueDepth: 8, callsToday: 45, revenueToday: 15400, lastActive: 'Just now', reportingTl: 'Rahul' },
    { id: '2', name: 'Ankit Singh', process: 'DW', role: 'Welcome Caller', status: 'In Call', statusTime: '01:30', currentLead: 'DR-48190', queueDepth: 12, callsToday: 32, revenueToday: 18500, lastActive: 'Just now', reportingTl: 'Rahul' },
    { id: '3', name: 'Arpita', process: 'DW', role: 'Welcome Caller', status: 'Wrapping Up', statusTime: '00:15', currentLead: 'DR-49110', queueDepth: 5, callsToday: 28, revenueToday: 9500, lastActive: '2m ago', reportingTl: 'Rahul' },
    { id: '4', name: 'Pallvi', process: 'DW', role: 'Welcome Caller', status: 'Idle', currentLead: '-', queueDepth: 0, callsToday: 41, revenueToday: 12000, lastActive: '8m ago', reportingTl: 'Rahul' },
    { id: '5', name: 'Kajal', process: 'DW', role: 'Welcome Caller', status: 'Offline', currentLead: '-', queueDepth: 0, callsToday: 0, revenueToday: 0, lastActive: 'Yesterday', reportingTl: 'Rahul' },
    { id: '6', name: 'Gagan Shukla', process: 'DW', role: 'Welcome Caller', status: 'In Call', statusTime: '12:04', currentLead: 'DR-44021', queueDepth: 14, callsToday: 55, revenueToday: 22000, lastActive: 'Just now', reportingTl: 'Rahul' },
    { id: '7', name: 'Abhi', process: 'DW', role: 'Welcome Caller', status: 'In Call', statusTime: '05:30', currentLead: 'DR-45112', queueDepth: 6, callsToday: 18, revenueToday: 4500, lastActive: 'Just now', reportingTl: 'Rahul' },

    { id: '8', name: 'Pooja Pal', process: 'MM', role: 'Matchmaker', status: 'In Call', statusTime: '02:44', currentLead: 'JD-12022', queueDepth: 4, callsToday: 22, revenueToday: 19500, lastActive: 'Just now', reportingTl: 'Rajendra' },
    { id: '9', name: 'Tanisha', process: 'MM', role: 'Matchmaker', status: 'Wrapping Up', statusTime: '01:10', currentLead: 'JD-12015', queueDepth: 3, callsToday: 19, revenueToday: 11000, lastActive: '1m ago', reportingTl: 'Rajendra' },
    { id: '10', name: 'Raksha', process: 'MM', role: 'Matchmaker', status: 'In Call', statusTime: '03:22', currentLead: 'JD-12098', queueDepth: 6, callsToday: 25, revenueToday: 15000, lastActive: 'Just now', reportingTl: 'Rajendra' },
    { id: '11', name: 'Bhavana Tiwari', process: 'TR', role: 'Welcome Caller', status: 'In Call', statusTime: '08:15', currentLead: 'TR-11204', queueDepth: 9, callsToday: 30, revenueToday: 28000, lastActive: 'Just now', reportingTl: 'Rajendra' },
    { id: '12', name: 'Ravi', process: 'TR', role: 'Welcome Caller', status: 'Idle', currentLead: '-', queueDepth: 0, callsToday: 27, revenueToday: 21800, lastActive: '15m ago', reportingTl: 'Rajendra' },
    { id: '13', name: 'Minanshu', process: 'TR', role: 'Welcome Caller', status: 'In Call', statusTime: '00:50', currentLead: 'TR-10291', queueDepth: 8, callsToday: 35, revenueToday: 30000, lastActive: 'Just now', reportingTl: 'Rajendra' },
    { id: '14', name: 'Pooja Chaudhary', process: 'TR', role: 'Welcome Caller', status: 'In Call', statusTime: '06:12', currentLead: 'TR-12098', queueDepth: 11, callsToday: 40, revenueToday: 12000, lastActive: 'Just now', reportingTl: 'Rajendra' },

    { id: '15', name: 'Akash Thakur', process: 'SC', role: 'Special Categories', status: 'In Call', statusTime: '11:22', currentLead: 'FM-00231', queueDepth: 7, callsToday: 21, revenueToday: 28000, lastActive: 'Just now', reportingTl: 'Rajendra' },

    { id: '16', name: 'Pooja (QC)', process: 'QC', role: 'QC Analyst', status: 'Active', currentLead: 'Auditing Sonam', queueDepth: 2, callsToday: 14, revenueToday: 0, lastActive: 'Just now', reportingTl: 'Rajendra' },

    { id: '17', name: 'Rahul', process: 'TL', role: 'Team Leader', status: 'Active', currentLead: 'Reviewing Wrap-up', queueDepth: 0, callsToday: 0, revenueToday: 0, lastActive: 'Just now', reportingTl: 'Telecalling Head' },
    { id: '18', name: 'Rajendra', process: 'TL', role: 'Team Leader', status: 'Active', currentLead: 'Reviewing SLA', queueDepth: 0, callsToday: 0, revenueToday: 0, lastActive: 'Just now', reportingTl: 'Telecalling Head' },
    { id: '19', name: 'Testing Prince', process: 'TL', role: 'Team Leader', status: 'Offline', currentLead: '-', queueDepth: 0, callsToday: 0, revenueToday: 0, lastActive: '2 days ago', reportingTl: 'Telecalling Head' },
  ]);

  const toggleBackup = (id: string) => {
    setBackups(prev => prev.map(b => b.id === id ? { ...b, active: !b.active } : b));
  };

  const handleRebalance = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rebalanceFrom || !rebalanceTo) return;

    setCallers(prev => prev.map(c => {
      if (c.name === rebalanceFrom) {
        return { ...c, queueDepth: Math.max(0, c.queueDepth - parseInt(rebalanceAmount)) };
      }
      if (c.name === rebalanceTo) {
        return { ...c, queueDepth: c.queueDepth + parseInt(rebalanceAmount) };
      }
      return c;
    }));

    setIsRebalanceOpen(false);
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

  return (
    <main className="bg-background p-md space-y-lg text-xs font-sans max-w-[1440px] mx-auto">
      {/* Header controls */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-center gap-md bg-white p-sm border border-outline-variant rounded-sm flipkart-shadow">
        <div className="flex items-center gap-sm">
          <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse"></span>
          <span className="font-extrabold uppercase text-outline text-[10px] tracking-wider">Live Global Monitor (Refreshes every 5s)</span>
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
              { name: 'Driver Welcome (DW)', pct: 45, count: 22, color: 'bg-green-500' },
              { name: 'Transport Welcome (TR)', pct: 82, count: 41, color: 'bg-orange-500' },
              { name: 'Match Making (MM)', pct: 30, count: 15, color: 'bg-purple-500' },
              { name: 'Special Categories (SC)', pct: 75, count: 37, color: 'bg-teal-500' },
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
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 font-bold"></span> 14 Online
            </span>
            <span className="flex items-center gap-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 font-bold"></span> 2 Wrapping
            </span>
            <span className="flex items-center gap-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-gray-400 font-bold"></span> 3 Offline
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
              {filteredCallers.map(caller => (
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
                    <div className="flex items-center gap-sm">
                      <span className="font-data-mono w-4">{caller.queueDepth}</span>
                      <div className="w-16 bg-surface-container h-1.5 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${caller.queueDepth > 10 ? 'bg-red-500' : 'bg-primary'}`}
                          style={{ width: `${Math.min(100, caller.queueDepth * 8)}%` }}
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
              ))}
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
                  {callers
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
                  {callers
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
                className="px-md py-1 bg-primary text-white rounded-sm font-bold text-[11px] hover:opacity-90"
              >
                Rebalance
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

export default ThTeamMonitor;
