import React, { useState, useMemo } from 'react';

// ── Types ──────────────────────────────────────────────────────────────────────
type SubscriptionStatus = 'verified' | 'disputed' | 'conflict';
interface Subscription {
  id: string;
  source: string;
  sourceDetail: string;
  deltaTime: string;
  correctness: number;
  status: SubscriptionStatus;
}

type DisputeType = 'delta_conflict' | 'window_expired' | 'utm_mismatch';
interface Dispute {
  id: string;
  subId: string;
  type: DisputeType;
  description: string;
  primaryAction: string;
  secondaryAction: string;
  resolved?: boolean;
  resolution?: string;
}

// ── Static Data ────────────────────────────────────────────────────────────────
const INITIAL_SUBSCRIPTIONS: Subscription[] = [
  { id: 'SUB-94021-X', source: 'Google Ads',      sourceDetail: 'Campaign: Q4_SaaS_Search',   deltaTime: '12h 04m', correctness: 95, status: 'verified'  },
  { id: 'SUB-88129-L', source: 'LinkedIn-Corp',   sourceDetail: 'Direct Lead Gen Form',        deltaTime: '01h 15m', correctness: 62, status: 'disputed'  },
  { id: 'SUB-77210-B', source: 'Organic',          sourceDetail: 'Direct Navigation',           deltaTime: '--',      correctness: 100, status: 'verified' },
  { id: 'SUB-66154-K', source: 'Referral',         sourceDetail: 'Affiliate: #tech_insider',    deltaTime: '48h 22m', correctness: 24, status: 'conflict'  },
  { id: 'SUB-55902-M', source: 'Twitter Paid',     sourceDetail: 'Ad Group: Conversion_V2',    deltaTime: '04h 55m', correctness: 88, status: 'verified'  },
  { id: 'SUB-43311-P', source: 'Email Campaign',   sourceDetail: 'Newsletter: Nov_Logistics',  deltaTime: '06h 30m', correctness: 79, status: 'disputed'  },
  { id: 'SUB-32208-Q', source: 'Facebook Ads',     sourceDetail: 'Lookalike Audience v3',      deltaTime: '09h 12m', correctness: 91, status: 'verified'  },
  { id: 'SUB-21003-R', source: 'Organic',          sourceDetail: 'Blog Post Traffic',          deltaTime: '--',      correctness: 100, status: 'verified' },
  { id: 'SUB-19877-S', source: 'YouTube Pre-roll', sourceDetail: 'Video: TruckMitr_Demo_v4',  deltaTime: '22h 50m', correctness: 41, status: 'conflict'  },
  { id: 'SUB-08640-T', source: 'Referral',         sourceDetail: 'Affiliate: #fleet_news',     deltaTime: '35h 05m', correctness: 67, status: 'disputed'  },
];

const INITIAL_DISPUTES: Dispute[] = [
  {
    id: 'd1',
    subId: 'SUB-88129-L',
    type: 'delta_conflict',
    description: 'Attributed to LinkedIn, but user has multiple UTM touches within the 72h window. Conflict with "Internal-Newsletter".',
    primaryAction: 'Approve Main',
    secondaryAction: 'Re-Attribute',
  },
  {
    id: 'd2',
    subId: 'SUB-66154-K',
    type: 'window_expired',
    description: 'Attribution occurred at 72h 45m. Outside current audit policy by 45 minutes.',
    primaryAction: 'Grant Waiver',
    secondaryAction: 'Mark Organic',
  },
  {
    id: 'd3',
    subId: 'SUB-43311-P',
    type: 'utm_mismatch',
    description: 'UTM parameters indicate Email source, but CRM first-touch shows LinkedIn. Data integrity conflict detected.',
    primaryAction: 'Keep Email',
    secondaryAction: 'Use First-Touch',
  },
  {
    id: 'd4',
    subId: 'SUB-19877-S',
    type: 'delta_conflict',
    description: 'YouTube attribution at 22h 50m conflicts with organic touch at 22h 45m. Last-touch ambiguity detected.',
    primaryAction: 'Approve YouTube',
    secondaryAction: 'Mark Organic',
  },
];

const ORGANIC_TREND = [
  { day: 'Mon', value: 15, height: 45 },
  { day: 'Tue', value: 17, height: 52 },
  { day: 'Wed', value: 16, height: 48 },
  { day: 'Thu', value: 21, height: 62 },
  { day: 'Fri', value: 18.4, height: 55 },
  { day: 'Sat', value: 13, height: 40 },
];

// ── Helpers ────────────────────────────────────────────────────────────────────
const disputeTypeLabel: Record<DisputeType, string> = {
  delta_conflict: 'DELTA CONFLICT',
  window_expired: 'WINDOW EXPIRED',
  utm_mismatch: 'UTM MISMATCH',
};

const disputeTypeColor: Record<DisputeType, string> = {
  delta_conflict: 'border-l-amber-500',
  window_expired: 'border-l-red-500',
  utm_mismatch: 'border-l-orange-500',
};

const statusBadge: Record<SubscriptionStatus, { bg: string; text: string; label: string }> = {
  verified: { bg: 'bg-green-100 border border-green-200',  text: 'text-green-800',  label: 'Verified'  },
  disputed: { bg: 'bg-amber-100 border border-amber-200',  text: 'text-amber-800',  label: 'Disputed'  },
  conflict: { bg: 'bg-red-100   border border-red-200',    text: 'text-red-800',    label: 'Conflict'  },
};

const correctnessColor = (v: number) =>
  v >= 80 ? 'bg-green-500' : v >= 50 ? 'bg-amber-500' : 'bg-red-500';

const PAGE_SIZE = 5;

// ── Toast ──────────────────────────────────────────────────────────────────────
interface ToastProps { message: string; onClose: () => void }
const Toast: React.FC<ToastProps> = ({ message, onClose }) => (
  <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3 bg-slate-800 text-white px-4 py-3 rounded-xl shadow-xl text-sm font-medium animate-[slideUp_0.3s_ease]">
    <span className="material-symbols-outlined text-green-400 text-base">check_circle</span>
    {message}
    <button onClick={onClose} className="ml-2 text-slate-400 hover:text-white">
      <span className="material-symbols-outlined text-sm">close</span>
    </button>
  </div>
);

// ── Component ──────────────────────────────────────────────────────────────────
export const RevenueAttributionAudit: React.FC = () => {
  // State
  const [attributionWindow, setAttributionWindow] = useState(72);
  const [searchQuery, setSearchQuery]             = useState('');
  const [statusFilter, setStatusFilter]           = useState<SubscriptionStatus | 'all'>('all');
  const [currentPage, setCurrentPage]             = useState(1);
  const [disputes, setDisputes]                   = useState<Dispute[]>(INITIAL_DISPUTES);
  const [toast, setToast]                         = useState<string | null>(null);
  const [showAllDisputes, setShowAllDisputes]     = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // Derived subscriptions (filter + search + page)
  const filtered = useMemo(() => {
    return INITIAL_SUBSCRIPTIONS.filter(s => {
      const matchSearch =
        s.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.source.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.sourceDetail.toLowerCase().includes(searchQuery.toLowerCase());
      const matchStatus = statusFilter === 'all' || s.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [searchQuery, statusFilter]);

  const totalPages   = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage     = Math.min(currentPage, totalPages);
  const paginated    = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const activeDisputes   = disputes.filter(d => !d.resolved);
  const resolvedDisputes = disputes.filter(d =>  d.resolved);
  const displayedDisputes = showAllDisputes ? activeDisputes : activeDisputes.slice(0, 2);

  // Handlers
  const handleApplyPolicy = () => {
    showToast(`Attribution window set to ${attributionWindow}h — Policy applied successfully.`);
  };

  const handleResolveDispute = (id: string, action: 'primary' | 'secondary') => {
    setDisputes(prev =>
      prev.map(d => {
        if (d.id !== id) return d;
        const resolution = action === 'primary' ? d.primaryAction : d.secondaryAction;
        return { ...d, resolved: true, resolution };
      })
    );
    const d = disputes.find(x => x.id === id);
    if (d) showToast(`${d.subId}: "${action === 'primary' ? d.primaryAction : d.secondaryAction}" applied.`);
  };

  const handleExport = () => {
    const rows = [
      ['Subscription ID', 'Source', 'Source Detail', 'Delta Time', 'Correctness %', 'Status'],
      ...INITIAL_SUBSCRIPTIONS.map(s => [s.id, s.source, s.sourceDetail, s.deltaTime, s.correctness.toString(), s.status]),
    ];
    const csv = rows.map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = 'attribution_log.csv';
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully.');
  };

  const handleSendReminder = (subId: string) => {
    showToast(`Reminder sent for ${subId}.`);
  };

  return (
    <main className="w-full max-w-7xl mx-auto p-6 space-y-6 bg-white text-xs md:text-sm">
      {toast && <Toast message={toast} onClose={() => setToast(null)} />}

      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <nav className="flex items-center gap-1 text-xs text-slate-400 mb-1">
            <span>Core</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span>Financials</span>
            <span className="material-symbols-outlined text-[10px]">chevron_right</span>
            <span className="text-slate-700 font-semibold">Attribution Audit</span>
          </nav>
          <h1 className="text-xl font-bold text-slate-800">Revenue Attribution Audit</h1>
        </div>

        {/* Attribution Window Card */}
        <div className="bg-white border border-slate-200 p-4 flex items-center gap-4 rounded-xl">
          <div className="flex flex-col">
            <label className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Attribution Window</label>
            <div className="flex items-center gap-2">
              <input
                className="w-16 h-8 text-sm font-bold border border-slate-200 rounded-lg px-2 text-center focus:outline-none focus:border-amber-400"
                type="number"
                min={1}
                max={168}
                value={attributionWindow}
                onChange={e => setAttributionWindow(Math.max(1, Number(e.target.value)))}
              />
              <span className="text-xs text-slate-500">Hours</span>
            </div>
          </div>
          <div className="h-10 w-px bg-slate-200" />
          <button
            onClick={handleApplyPolicy}
            className="bg-amber-500 text-white px-5 h-9 rounded-xl font-semibold text-xs hover:bg-amber-600 transition-colors"
          >
            Apply Policy
          </button>
        </div>
      </div>

      {/* ── KPI Cards ──────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Attributed */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Total Attributed</span>
            <span className="material-symbols-outlined text-amber-500 text-base">account_balance_wallet</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">₹1,429,203</div>
            <div className="text-[10px] text-green-600 flex items-center gap-0.5 font-semibold mt-0.5">
              <span className="material-symbols-outlined text-[10px]">trending_up</span> +4.2% vs last audit
            </div>
          </div>
        </div>

        {/* Organic Rate */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Organic Rate</span>
            <span className="material-symbols-outlined text-emerald-500 text-base">eco</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">18.4%</div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all" style={{ width: '18.4%' }} />
            </div>
          </div>
        </div>

        {/* Dispute Queue */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Dispute Queue</span>
            <span className="material-symbols-outlined text-amber-500 text-base">warning</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">{activeDisputes.length}</div>
            {resolvedDisputes.length > 0 ? (
              <div className="text-[10px] text-green-600 font-semibold mt-0.5">
                {resolvedDisputes.length} resolved this session
              </div>
            ) : (
              <div className="text-[10px] text-red-500 font-semibold mt-0.5">Critical resolution required</div>
            )}
          </div>
        </div>

        {/* Confidence Score */}
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-between h-28">
          <div className="flex justify-between items-start">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confidence Score</span>
            <span className="material-symbols-outlined text-amber-500 text-base">verified</span>
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800">98.2%</div>
            <div className="text-[10px] text-slate-400 font-medium mt-0.5">Auto-computed delta</div>
          </div>
        </div>
      </div>

      {/* ── Main Content ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* ── Subscription Log ─────────────────────────────────────────────── */}
        <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          {/* Toolbar */}
          <div className="px-4 py-3 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <h2 className="text-sm font-bold text-slate-800">Subscription Attribution Log</h2>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none">
                <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-sm pointer-events-none">search</span>
                <input
                  className="pl-7 pr-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:border-amber-400 w-full sm:w-40"
                  placeholder="Search ID or source…"
                  value={searchQuery}
                  onChange={e => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                />
              </div>
              {/* Status filter */}
              <select
                className="border border-slate-200 rounded-lg text-xs px-2 py-1.5 focus:outline-none focus:border-amber-400 bg-white"
                value={statusFilter}
                onChange={e => { setStatusFilter(e.target.value as SubscriptionStatus | 'all'); setCurrentPage(1); }}
              >
                <option value="all">All Status</option>
                <option value="verified">Verified</option>
                <option value="disputed">Disputed</option>
                <option value="conflict">Conflict</option>
              </select>
              {/* Export */}
              <button
                onClick={handleExport}
                className="border border-slate-200 rounded-lg px-2 py-1.5 text-xs font-semibold flex items-center gap-1 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">download</span>
                <span className="hidden sm:inline">Export</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  {['Subscription ID', 'Caller / Source', 'Delta Time', 'Correctness', 'Status', ''].map(h => (
                    <th key={h} className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {paginated.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-10 text-center text-slate-400 text-xs">
                      No records match your search.
                    </td>
                  </tr>
                ) : paginated.map(s => {
                  const badge = statusBadge[s.status];
                  return (
                    <tr key={s.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-amber-500 font-semibold text-[11px]">{s.id}</td>
                      <td className="px-4 py-3">
                        <div className="font-semibold text-slate-800">{s.source}</div>
                        <div className="text-[10px] text-slate-400">{s.sourceDetail}</div>
                      </td>
                      <td className="px-4 py-3 font-mono text-slate-600 text-[11px]">{s.deltaTime}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-14 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div className={`${correctnessColor(s.correctness)} h-full rounded-full transition-all`} style={{ width: `${s.correctness}%` }} />
                          </div>
                          <span className="text-xs font-bold text-slate-700">{s.correctness}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-0.5 rounded-md ${badge.bg} ${badge.text} text-[10px] font-bold uppercase tracking-wider`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleSendReminder(s.id)}
                          title="Send reminder"
                          className="text-slate-300 hover:text-amber-500 transition-colors"
                        >
                          <span className="material-symbols-outlined text-sm">notifications</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="px-4 py-3 border-t border-slate-200 flex items-center justify-between">
            <span className="text-[10px] text-slate-400">
              {filtered.length === 0 ? '0' : `${(safePage - 1) * PAGE_SIZE + 1}–${Math.min(safePage * PAGE_SIZE, filtered.length)}`} of {filtered.length} records
            </span>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={safePage === 1}
                className="px-2 py-1 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chevron_left</span>
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(n => (
                <button
                  key={n}
                  onClick={() => setCurrentPage(n)}
                  className={`px-2.5 py-1 text-xs rounded-lg border transition-colors ${n === safePage ? 'bg-amber-500 text-white border-amber-500' : 'border-slate-200 hover:bg-slate-50'}`}
                >
                  {n}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={safePage === totalPages}
                className="px-2 py-1 text-xs border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-colors"
              >
                <span className="material-symbols-outlined text-sm">chevron_right</span>
              </button>
            </div>
          </div>
        </div>

        {/* ── Right Column ──────────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* Disputed Records */}
          <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <span className="material-symbols-outlined text-red-500 text-base">gavel</span>
                Disputed Records
              </h2>
              {activeDisputes.length > 0 && (
                <span className="bg-red-100 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {activeDisputes.length} active
                </span>
              )}
            </div>
            <div className="p-4 space-y-3">
              {activeDisputes.length === 0 ? (
                <div className="text-center py-6 text-slate-400 text-xs">
                  <span className="material-symbols-outlined text-2xl text-green-400 block mb-2">check_circle</span>
                  All disputes resolved!
                </div>
              ) : (
                <>
                  {displayedDisputes.map(d => (
                    <div key={d.id} className={`p-3 border border-slate-200 border-l-4 ${disputeTypeColor[d.type]} bg-slate-50 rounded-xl`}>
                      <div className="flex justify-between items-start mb-1.5">
                        <span className="font-mono text-amber-500 text-[11px] font-semibold">{d.subId}</span>
                        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">{disputeTypeLabel[d.type]}</span>
                      </div>
                      <p className="text-[11px] text-slate-500 mb-3 leading-relaxed">{d.description}</p>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => handleResolveDispute(d.id, 'primary')}
                          className="bg-amber-500 text-white py-1.5 rounded-lg text-[11px] font-bold hover:bg-amber-600 transition-colors"
                        >
                          {d.primaryAction}
                        </button>
                        <button
                          onClick={() => handleResolveDispute(d.id, 'secondary')}
                          className="bg-white border border-slate-200 text-slate-700 py-1.5 rounded-lg text-[11px] font-bold hover:bg-slate-50 transition-colors"
                        >
                          {d.secondaryAction}
                        </button>
                      </div>
                    </div>
                  ))}
                  {activeDisputes.length > 2 && (
                    <button
                      onClick={() => setShowAllDisputes(v => !v)}
                      className="w-full text-center text-amber-500 text-xs font-bold hover:underline py-1"
                    >
                      {showAllDisputes ? 'Show less' : `View All ${activeDisputes.length} Disputes`}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Organic Rate Trend */}
          <div className="bg-white border border-slate-200 rounded-xl p-4">
            <h2 className="text-sm font-bold text-slate-800 mb-4">Organic Rate Trend</h2>
            <div className="h-40 relative flex items-end gap-1.5 px-1 mb-3 border-b border-slate-100">
              {ORGANIC_TREND.map(bar => (
                <div
                  key={bar.day}
                  className="flex-1 bg-amber-100 hover:bg-blue-400 transition-colors cursor-pointer group relative rounded-t-md"
                  style={{ height: `${bar.height}%` }}
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-slate-700 text-white text-[9px] px-1.5 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                    {bar.value}%
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[9px] text-slate-400 font-bold uppercase tracking-widest px-1 mb-3">
              {ORGANIC_TREND.map(b => <span key={b.day}>{b.day}</span>)}
            </div>
            <div className="p-3 bg-amber-50 border border-blue-100 rounded-xl flex items-start gap-2">
              <span className="material-symbols-outlined text-amber-400 text-sm flex-shrink-0">info</span>
              <p className="text-[10px] leading-relaxed text-slate-600">
                <strong>Insight:</strong> Weekend organic traffic is up 14% compared to week-over-week average. Re-evaluating paid spend efficiency for Saturday/Sunday.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 pt-4 border-t border-slate-200 text-[10px] text-slate-400">
        <span>Last auto-sync: 2 minutes ago</span>
        <div className="flex gap-4">
          <button onClick={handleExport} className="hover:text-amber-500 underline transition-colors">Download Full Audit Report</button>
          <a className="hover:text-amber-500 underline transition-colors" href="#">Attribution Methodology Documentation</a>
        </div>
      </div>
    </main>
  );
};

export default RevenueAttributionAudit;
