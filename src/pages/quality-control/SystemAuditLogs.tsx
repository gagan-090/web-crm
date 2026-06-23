import React, { useState, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────
type ActionType = 'Price_Update' | 'Deactivation' | 'Approval' | 'Config_Edit' | 'Security_Event';

interface LogEntry {
  id: string;
  timestamp: string;
  user: string;
  action: ActionType;
  recordId: string;
  oldValue: string;
  newValue: string;
  severity: 'normal' | 'warning' | 'critical';
}

// ── Mock Data ──────────────────────────────────────────────────────────────────
const ALL_LOGS: LogEntry[] = [
  { id: 'l01', timestamp: '2023-11-24 14:22:08', user: 'admin.smith',    action: 'Price_Update',    recordId: 'PLAN-8821-X',  oldValue: '₹49.99',          newValue: '₹54.99',              severity: 'warning'  },
  { id: 'l02', timestamp: '2023-11-24 14:15:12', user: 'sys_automator',  action: 'Deactivation',    recordId: 'USR-9001-A',   oldValue: 'Active',          newValue: 'Suspended',           severity: 'critical' },
  { id: 'l03', timestamp: '2023-11-24 13:58:44', user: 'm.garcia',       action: 'Approval',        recordId: 'REQ-77422',    oldValue: 'Pending_Review',  newValue: 'Confirmed',           severity: 'normal'   },
  { id: 'l04', timestamp: '2023-11-24 13:42:01', user: 'admin.smith',    action: 'Config_Edit',     recordId: 'SYS-CFG-04',   oldValue: '{"timeout":3000}', newValue: '{"timeout":5000}',   severity: 'warning'  },
  { id: 'l05', timestamp: '2023-11-24 13:30:15', user: 'root_access',    action: 'Security_Event',  recordId: 'SSH-DAEMON',   oldValue: 'Access_Closed',   newValue: 'Port_Scan_Detected',  severity: 'critical' },
  { id: 'l06', timestamp: '2023-11-24 13:12:08', user: 'admin.smith',    action: 'Price_Update',    recordId: 'PLAN-4410-V',  oldValue: '₹19.00',          newValue: '₹17.50',              severity: 'normal'   },
  { id: 'l07', timestamp: '2023-11-24 12:45:00', user: 'm.garcia',       action: 'Deactivation',    recordId: 'HOOK-EXPR-09', oldValue: 'Enabled',         newValue: 'Disabled',            severity: 'warning'  },
  { id: 'l08', timestamp: '2023-11-24 12:20:33', user: 'j.patel',        action: 'Approval',        recordId: 'REQ-77100',    oldValue: 'Under_Review',    newValue: 'Approved',            severity: 'normal'   },
  { id: 'l09', timestamp: '2023-11-24 11:55:09', user: 'sys_automator',  action: 'Config_Edit',     recordId: 'SYS-CFG-02',   oldValue: '{"retries":3}',   newValue: '{"retries":5}',       severity: 'warning'  },
  { id: 'l10', timestamp: '2023-11-24 11:30:00', user: 'root_access',    action: 'Security_Event',  recordId: 'FIREWALL-01',  oldValue: 'Rules_v4',        newValue: 'Rules_v5',            severity: 'normal'   },
  { id: 'l11', timestamp: '2023-11-24 11:02:44', user: 'admin.smith',    action: 'Price_Update',    recordId: 'PLAN-1100-Z',  oldValue: '₹99.00',          newValue: '₹109.00',             severity: 'warning'  },
  { id: 'l12', timestamp: '2023-11-24 10:45:11', user: 'm.garcia',       action: 'Deactivation',    recordId: 'USR-8022-B',   oldValue: 'Active',          newValue: 'Deactivated',         severity: 'critical' },
];

const ACTION_BADGE: Record<ActionType, { bg: string; text: string }> = {
  Price_Update:   { bg: 'bg-amber-100',    text: 'text-amber-600'   },
  Deactivation:   { bg: 'bg-red-100',     text: 'text-red-700'    },
  Approval:       { bg: 'bg-green-100',   text: 'text-green-700'  },
  Config_Edit:    { bg: 'bg-amber-100',   text: 'text-amber-700'  },
  Security_Event: { bg: 'bg-purple-100',  text: 'text-purple-700' },
};

const SEVERITY_DOT: Record<string, string> = {
  normal:   'bg-green-500',
  warning:  'bg-amber-500',
  critical: 'bg-red-500',
};

const PAGE_SIZE = 7;

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
export const SystemAuditLogs: React.FC = () => {
  const [viewMode, setViewMode]       = useState<'live' | 'historical'>('live');
  const [timeRange, setTimeRange]     = useState('Last 24 Hours');
  const [actionFilter, setActionFilter] = useState<ActionType | 'All Actions'>('All Actions');
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [toast, setToast]             = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // Filter logs
  const filtered = useMemo(() => {
    return ALL_LOGS.filter(log => {
      const matchAction = actionFilter === 'All Actions' || log.action === actionFilter;
      const q = searchQuery.toLowerCase();
      const matchSearch = !q
        || log.user.toLowerCase().includes(q)
        || log.recordId.toLowerCase().includes(q)
        || log.action.toLowerCase().includes(q);
      return matchAction && matchSearch;
    });
  }, [actionFilter, searchQuery]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage   = Math.min(currentPage, totalPages);
  const paginated  = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const handleExport = () => {
    const rows = [
      ['Timestamp', 'User', 'Action', 'Record ID', 'Old Value', 'New Value'],
      ...ALL_LOGS.map(l => [l.timestamp, l.user, l.action, l.recordId, l.oldValue, l.newValue]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'system_audit_logs.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('Audit log exported to CSV.');
  };

  const alerts = filtered.filter(l => l.severity !== 'normal').length;

  return (
    <main className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-white text-xs md:text-sm">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <nav className="flex items-center gap-1 text-xs text-slate-400 mb-1">
            <span>Core</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-slate-700 font-semibold">System Audit Logs</span>
          </nav>
          <h1 className="text-xl font-bold text-slate-800">System Logs</h1>
          <p className="text-xs text-slate-400 mt-0.5">Full audit trail of all administrative and system-level actions.</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Live / Historical toggle */}
          <div className="flex bg-slate-100 rounded-lg p-1 gap-1">
            {(['live', 'historical'] as const).map(mode => (
              <button
                key={mode}
                onClick={() => { setViewMode(mode); showToast(`Switched to ${mode} view`); }}
                className={`px-3 py-1.5 rounded-md text-xs font-bold capitalize transition-all ${viewMode === mode ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {mode === 'live' && <span className="inline-block w-1.5 h-1.5 bg-green-500 rounded-full mr-1.5 animate-pulse" />}
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </button>
            ))}
          </div>
          <button
            onClick={handleExport}
            className="flex items-center gap-2 bg-amber-500 text-white px-4 h-9 rounded-xl font-semibold text-xs hover:bg-amber-600 transition-colors"
          >
            <span className="material-symbols-outlined text-sm">download</span>
            Export CSV
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-wrap items-end gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Time Range</label>
          <select
            value={timeRange}
            onChange={e => { setTimeRange(e.target.value); setCurrentPage(1); showToast(`Filtered: ${e.target.value}`); }}
            className="h-8 border border-slate-200 rounded-lg bg-white text-xs px-2 focus:outline-none focus:border-amber-400 min-w-[140px]"
          >
            <option>Last 24 Hours</option>
            <option>Last 7 Days</option>
            <option>Custom Range</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Action Type</label>
          <select
            value={actionFilter}
            onChange={e => { setActionFilter(e.target.value as ActionType | 'All Actions'); setCurrentPage(1); }}
            className="h-8 border border-slate-200 rounded-lg bg-white text-xs px-2 focus:outline-none focus:border-amber-400 min-w-[140px]"
          >
            <option value="All Actions">All Actions</option>
            <option value="Price_Update">Price Changes</option>
            <option value="Deactivation">Deactivations</option>
            <option value="Approval">Approvals</option>
            <option value="Config_Edit">Config Updates</option>
            <option value="Security_Event">Security Events</option>
          </select>
        </div>
        <div className="flex flex-col gap-1 flex-1 min-w-[160px]">
          <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Record Filter</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">search</span>
            <input
              className="h-8 border border-slate-200 rounded-lg bg-white text-xs pl-7 pr-3 w-full focus:outline-none focus:border-amber-400"
              placeholder="ID, user or action…"
              value={searchQuery}
              onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
            />
          </div>
        </div>
        <button
          onClick={() => { setSearchQuery(''); setActionFilter('All Actions'); setTimeRange('Last 24 Hours'); setCurrentPage(1); showToast('Filters cleared'); }}
          className="h-8 text-amber-500 text-xs font-semibold hover:underline transition-colors self-end"
        >
          Clear Filters
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                {['Timestamp', 'User', 'Action', 'Record ID', 'Old Value', 'New Value'].map(h => (
                  <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-xs">
                    No log entries match your filters.
                  </td>
                </tr>
              ) : paginated.map(log => {
                const badge = ACTION_BADGE[log.action];
                return (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-500 whitespace-nowrap">{log.timestamp}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${SEVERITY_DOT[log.severity]}`} />
                        <span className="font-semibold text-slate-700 text-[11px]">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 rounded-md ${badge.bg} ${badge.text} text-[10px] font-bold uppercase tracking-wider`}>
                        {log.action.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px] text-amber-500 font-semibold">{log.recordId}</td>
                    <td className="px-4 py-3 font-mono text-[11px] text-slate-400 line-through">{log.oldValue}</td>
                    <td className="px-4 py-3 font-mono text-[11px] font-bold text-slate-700">{log.newValue}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Footer / Pagination */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-4">
            <p className="text-[10px] text-slate-400">
              Showing <span className="font-bold text-slate-700">{paginated.length}</span> of <span className="font-bold text-slate-700">{filtered.length}</span> logs
            </p>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-[10px] text-slate-400">Normal Traffic</span>
              </div>
              {alerts > 0 && (
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] text-slate-400">{alerts} Recent Alerts</span>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={safePage === 1}
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
              <button
                key={n}
                onClick={() => setCurrentPage(n)}
                className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold border transition-colors ${n === safePage ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-200 hover:bg-slate-100'}`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={safePage === totalPages}
              className="w-8 h-8 flex items-center justify-center border border-slate-200 rounded-lg hover:bg-slate-100 disabled:opacity-40 transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default SystemAuditLogs;
