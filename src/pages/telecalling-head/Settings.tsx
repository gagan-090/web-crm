import React, { useState } from 'react';

/* ─── Types ─── */
interface CallerAccount {
  id: string;
  initials: string;
  name: string;
  team: string;
  status: 'ACTIVE' | 'INACTIVE';
  tmId: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: string;
  effectiveDate: string;
  status: 'CURRENT' | 'SCHEDULED' | 'ARCHIVED';
}

interface TargetRow {
  key: string;
  label: string;
  unit: string;
  trend: string;
  trendColor: string;
}

/* ─── Static data ─── */
const INITIAL_CALLERS: CallerAccount[] = [
  { id: 'c1', initials: 'RK', name: 'Rohan Kumar',  team: 'North Logistics',   status: 'ACTIVE',   tmId: 'TM-882' },
  { id: 'c2', initials: 'SS', name: 'Sneha Sharma', team: 'Customer Success',  status: 'ACTIVE',   tmId: 'TM-419' },
  { id: 'c3', initials: 'AP', name: 'Arjun Patel',  team: 'Operations',        status: 'INACTIVE', tmId: 'TM-202' },
  { id: 'c4', initials: 'VD', name: 'Vikram Das',   team: 'Inbound Sales',     status: 'ACTIVE',   tmId: 'TM-612' },
];

const INITIAL_PLANS: PricingPlan[] = [
  { id: 'p1', name: 'Enterprise Pro',  price: '₹45,000', effectiveDate: '01 Oct 2023', status: 'CURRENT' },
  { id: 'p2', name: 'Fleet Scale',     price: '₹28,500', effectiveDate: '15 Sep 2023', status: 'CURRENT' },
  { id: 'p3', name: 'Lite Startup',    price: '₹12,000', effectiveDate: '01 Jan 2024', status: 'SCHEDULED' },
];

const TARGET_ROWS: TargetRow[] = [
  { key: 'leadGen',    label: 'Lead Gen',   unit: 'Units', trend: '+12% YoY', trendColor: 'text-green-600' },
  { key: 'conversion', label: 'Conversion', unit: '%',     trend: 'Baseline', trendColor: 'text-blue-600'  },
  { key: 'retention',  label: 'Retention',  unit: '%',     trend: '-2.4%',    trendColor: 'text-red-500'   },
];

/* ─── Helper ─── */
const StatusBadge: React.FC<{ status: PricingPlan['status'] }> = ({ status }) => {
  const map = {
    CURRENT:   'bg-blue-50 text-blue-700 border-blue-200',
    SCHEDULED: 'bg-orange-50 text-orange-700 border-orange-200',
    ARCHIVED:  'bg-slate-100 text-slate-500 border-slate-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase ${map[status]}`}>{status}</span>
  );
};

/* ─── Main Component ─── */
export const Settings: React.FC = () => {
  /* State */
  const [callers, setCallers]     = useState<CallerAccount[]>(INITIAL_CALLERS);
  const [plans, setPlans]         = useState<PricingPlan[]>(INITIAL_PLANS);
  const [targets, setTargets]     = useState({ leadGen: 1200, conversion: 15, retention: 88 });
  const [toast, setToast]         = useState<string | null>(null);
  const [editingPlan, setEditingPlan] = useState<string | null>(null);
  const [editingPrice, setEditingPrice] = useState('');
  const [showNewCallerModal, setShowNewCallerModal] = useState(false);
  const [showNewPlanModal, setShowNewPlanModal]     = useState(false);
  const [newCallerName, setNewCallerName]   = useState('');
  const [newCallerTeam, setNewCallerTeam]   = useState('');
  const [newPlanName, setNewPlanName]       = useState('');
  const [newPlanPrice, setNewPlanPrice]     = useState('');
  const [showChangeLog, setShowChangeLog]   = useState(false);
  const [integrationRefreshing, setIntegrationRefreshing] = useState(false);

  const showToast = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3000); };

  /* ── Handlers ── */
  const refreshIntegrations = () => {
    setIntegrationRefreshing(true);
    setTimeout(() => { setIntegrationRefreshing(false); showToast('Integration status refreshed.'); }, 1200);
  };

  const toggleCallerStatus = (id: string) => {
    setCallers(prev => prev.map(c => {
      if (c.id !== id) return c;
      const next = c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      showToast(`${c.name} set to ${next}.`);
      return { ...c, status: next };
    }));
  };

  const handleEditCaller = (c: CallerAccount) => {
    showToast(`Editing ${c.name} — (Edit form would open here)`);
  };

  const addCaller = () => {
    if (!newCallerName.trim()) return;
    const initials = newCallerName.split(' ').map(w => w[0]).join('').toUpperCase().slice(0,2);
    const newId = `TM-${Math.floor(Math.random() * 900) + 100}`;
    setCallers(prev => [...prev, { id: Date.now().toString(), initials, name: newCallerName, team: newCallerTeam || 'General', status: 'ACTIVE', tmId: newId }]);
    showToast(`Caller "${newCallerName}" added successfully.`);
    setNewCallerName(''); setNewCallerTeam(''); setShowNewCallerModal(false);
  };

  const startEditPlan = (plan: PricingPlan) => {
    setEditingPlan(plan.id);
    setEditingPrice(plan.price.replace('₹', '').replace(',', ''));
  };

  const savePlan = (id: string) => {
    setPlans(prev => prev.map(p => p.id === id ? { ...p, price: `₹${Number(editingPrice).toLocaleString('en-IN')}` } : p));
    setEditingPlan(null);
    showToast('Plan price updated successfully.');
  };

  const addPlan = () => {
    if (!newPlanName.trim() || !newPlanPrice.trim()) return;
    setPlans(prev => [...prev, {
      id: Date.now().toString(), name: newPlanName,
      price: `₹${Number(newPlanPrice).toLocaleString('en-IN')}`,
      effectiveDate: new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: 'SCHEDULED',
    }]);
    showToast(`Plan "${newPlanName}" added.`);
    setNewPlanName(''); setNewPlanPrice(''); setShowNewPlanModal(false);
  };

  const saveTargets = () => showToast('New targets saved successfully!');

  return (
    <main className="p-5 bg-slate-50 min-h-screen overflow-y-auto relative">

      {/* Toast */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-sm font-medium px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2">
          <span className="material-symbols-outlined text-[18px] text-green-400">check_circle</span>
          {toast}
        </div>
      )}

      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-5">

        {/* ══ Integration Health ══ */}
        <section className="col-span-12 lg:col-span-4 bg-white border border-slate-200 shadow-sm rounded-xl p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 text-base">Integration Health</h3>
            <button
              onClick={refreshIntegrations}
              title="Refresh"
              className="p-1.5 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
            >
              <span className={`material-symbols-outlined text-[20px] ${integrationRefreshing ? 'animate-spin' : ''}`}>refresh</span>
            </button>
          </div>
          <div className="space-y-3">
            {[
              { icon: 'call',     label: 'Exotel Cloud Telephony',   sub: 'API Latency: 42ms',  status: 'ACTIVE',  iconColor: 'text-blue-600' },
              { icon: 'chat',     label: 'WhatsApp Business API',     sub: 'Status: Connected',  status: 'ACTIVE',  iconColor: 'text-green-600' },
              { icon: 'payments', label: 'Razorpay Payment Gateway',  sub: 'Auth Error: retry 5',status: 'FAILED',  iconColor: 'text-purple-600' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between p-3 bg-white border border-slate-100 rounded-lg hover:border-slate-200 transition-colors">
                <div className="flex items-center gap-3">
                  <span className={`material-symbols-outlined ${item.iconColor} text-[20px]`}>{item.icon}</span>
                  <div>
                    <p className="font-semibold text-[12px] text-slate-800">{item.label}</p>
                    <p className="text-[10px] text-slate-400">{item.sub}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className={`w-2 h-2 rounded-full ${item.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_6px_rgba(34,197,94,0.5)]' : 'bg-red-500 shadow-[0_0_6px_rgba(239,68,68,0.5)]'}`} />
                  <span className={`text-[10px] font-bold ${item.status === 'ACTIVE' ? 'text-green-600' : 'text-red-500'}`}>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ Subscription Pricing Control ══ */}
        <section className="col-span-12 lg:col-span-8 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Subscription Pricing Control</h3>
              <p className="text-xs text-slate-400 mt-0.5">Update and manage customer billing plans</p>
            </div>
            <button
              onClick={() => setShowNewPlanModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 text-xs font-bold hover:bg-blue-700 active:scale-95 transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">add</span> New Plan
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-400 text-[11px] font-bold uppercase tracking-wider border-b border-slate-100">
                <tr>
                  <th className="px-5 py-3">Plan Name</th>
                  <th className="px-5 py-3">Monthly Price</th>
                  <th className="px-5 py-3">Effective Date</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {plans.map(plan => (
                  <tr key={plan.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3 font-bold text-blue-600 text-sm">{plan.name}</td>
                    <td className="px-5 py-3 font-mono text-slate-800 text-sm">
                      {editingPlan === plan.id ? (
                        <div className="flex items-center gap-2">
                          <span className="text-slate-400">₹</span>
                          <input
                            type="number"
                            value={editingPrice}
                            onChange={e => setEditingPrice(e.target.value)}
                            className="w-24 border border-blue-400 rounded px-2 py-0.5 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            autoFocus
                          />
                          <button onClick={() => savePlan(plan.id)} className="text-green-600 hover:text-green-700 text-[11px] font-bold">Save</button>
                          <button onClick={() => setEditingPlan(null)} className="text-slate-400 hover:text-slate-600 text-[11px]">Cancel</button>
                        </div>
                      ) : plan.price}
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600">{plan.effectiveDate}</td>
                    <td className="px-5 py-3"><StatusBadge status={plan.status} /></td>
                    <td className="px-5 py-3 text-right">
                      <button
                        onClick={() => startEditPlan(plan)}
                        className="p-1.5 hover:bg-blue-50 hover:text-blue-600 text-slate-400 rounded-lg transition-colors"
                        title="Edit price"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* ══ Caller Account Management ══ */}
        <section className="col-span-12 lg:col-span-7 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-800 text-base">Caller Account Management</h3>
            <div className="flex gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-600">
                <span className="material-symbols-outlined text-[16px]">filter_list</span> ALL TEAMS
              </div>
              <button
                onClick={() => setShowNewCallerModal(true)}
                className="bg-green-600 text-white px-4 py-1.5 rounded-lg flex items-center gap-1.5 text-xs font-bold hover:bg-green-700 active:scale-95 transition-all"
              >
                <span className="material-symbols-outlined text-[16px]">person_add</span> Add Caller
              </button>
            </div>
          </div>
          <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-3">
            {callers.map(c => (
              <div
                key={c.id}
                className={`border rounded-xl p-4 flex items-center gap-3 transition-all ${c.status === 'ACTIVE' ? 'border-slate-200 hover:border-blue-300 bg-white' : 'border-slate-100 bg-slate-50 opacity-60'}`}
              >
                <div className={`w-11 h-11 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 ${c.status === 'ACTIVE' ? 'bg-blue-50 text-blue-700' : 'bg-slate-200 text-slate-500'}`}>
                  {c.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-sm text-slate-800 truncate">{c.name}</h4>
                  <p className="text-[11px] text-slate-400">{c.team}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${c.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-500'}`}>
                      {c.status}
                    </span>
                    <span className="text-[10px] text-slate-400">ID: {c.tmId}</span>
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  {c.status === 'ACTIVE' ? (
                    <>
                      <button
                        onClick={() => handleEditCaller(c)}
                        className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-400 hover:text-blue-600 transition-colors"
                        title="Edit"
                      >
                        <span className="material-symbols-outlined text-[16px]">edit</span>
                      </button>
                      <button
                        onClick={() => toggleCallerStatus(c.id)}
                        className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-500 transition-colors"
                        title="Deactivate"
                      >
                        <span className="material-symbols-outlined text-[16px]">block</span>
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => toggleCallerStatus(c.id)}
                      className="p-1.5 hover:bg-green-50 rounded-lg text-slate-400 hover:text-green-600 transition-colors"
                      title="Reactivate"
                    >
                      <span className="material-symbols-outlined text-[16px]">restart_alt</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══ Target Benchmarking ══ */}
        <section className="col-span-12 lg:col-span-5 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
            <h3 className="font-bold text-slate-800 text-base">Target Benchmarking</h3>
            <span className="text-[10px] font-bold text-slate-500 border border-slate-200 px-3 py-1.5 rounded-lg bg-white">
              MONTH: NOV 2024
            </span>
          </div>
          <div className="p-5 space-y-4">
            {TARGET_ROWS.map(row => (
              <div key={row.key} className="grid grid-cols-12 gap-3 items-center">
                <div className="col-span-4 text-[12px] font-bold text-slate-600 uppercase tracking-wide">{row.label}</div>
                <div className="col-span-5 relative">
                  <input
                    type="number"
                    value={targets[row.key as keyof typeof targets]}
                    onChange={e => setTargets(prev => ({ ...prev, [row.key]: Number(e.target.value) }))}
                    className="w-full pl-3 pr-8 py-2 border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none font-mono text-sm bg-white transition"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">{row.unit}</span>
                </div>
                <div className="col-span-3 text-right">
                  <span className={`text-[11px] font-bold ${row.trendColor}`}>{row.trend}</span>
                </div>
              </div>
            ))}
            <button
              onClick={saveTargets}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs rounded-lg transition-colors uppercase tracking-widest mt-2 active:scale-[0.98]"
            >
              Save New Targets
            </button>
          </div>
        </section>

        {/* ══ Script Library ══ */}
        <section className="col-span-12 bg-white border border-slate-200 shadow-sm rounded-xl overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">Script Library (Read-Only Archive)</h3>
              <p className="text-xs text-slate-400 mt-0.5">Published scripts for verification only. Request edits from content head.</p>
            </div>
            <button
              onClick={() => setShowChangeLog(!showChangeLog)}
              className="text-blue-600 hover:underline font-bold text-xs flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-[16px]">history</span>
              {showChangeLog ? 'Hide Change Log' : 'View Change Log'}
            </button>
          </div>

          {showChangeLog && (
            <div className="mx-5 mt-4 p-4 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 space-y-2">
              <p className="font-bold text-slate-700 mb-2">Recent Changes</p>
              {[
                { date: '24 Oct 2024', action: 'Onboarding Script v4.2 — updated intro paragraph', by: 'content_admin_01' },
                { date: '18 Oct 2024', action: 'Renewal Pitch v2.1 — added discount mention', by: 'content_admin_01' },
                { date: '10 Oct 2024', action: 'Escalation Protocol — updated senior supervisor phrasing', by: 'content_admin_02' },
              ].map((log, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-slate-300 font-mono">{log.date}</span>
                  <span className="flex-1">{log.action}</span>
                  <span className="text-slate-400">by {log.by}</span>
                </div>
              ))}
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-3 divide-x divide-slate-100">
            {[
              { title: 'Onboarding Script v4.2', content: '"नमस्ते, मैं ट्रकमित्र से [Caller Name] बात कर रहा हूँ। क्या मेरी बात [Lead Name] से हो रही है? हम आपकी लॉजिस्टिक्स यात्रा को आसान बनाने के लिए कुछ बेहतरीन समाधान लाए हैं..."' },
              { title: 'Renewal Pitch v2.1',     content: '"प्रिय ग्राहक, आपके ट्रकमित्र सब्सक्रिप्शन को रिन्यू करने का समय आ गया है। इस महीने हमारे पास आपके लिए विशेष डिस्काउंट ऑफर हैं जो आपकी बचत बढ़ाएंगे..."' },
              { title: 'Escalation Protocol',    content: '"असुविधा के लिए हमें खेद है। मैं आपकी कॉल को हमारे सीनियर सुपरवाइजर को ट्रांसफर कर रहा हूँ जो इस मुद्दे का तुरंत समाधान करेंगे। कृपया लाइन पर बने रहें..."' },
            ].map(script => (
              <div key={script.title} className="p-5">
                <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                  <span className="material-symbols-outlined text-slate-400 text-[18px]">description</span>
                  {script.title}
                </h4>
                <div className="p-3 bg-white border border-slate-100 rounded-lg h-44 overflow-y-auto text-[13px] text-slate-500 leading-relaxed select-none">
                  {script.content}
                </div>
              </div>
            ))}
          </div>
          <div className="px-5 py-2.5 border-t border-slate-100 bg-slate-50 text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">Last Modified by content_admin_01 on 24 Oct 2024</p>
          </div>
        </section>
      </div>

      {/* ── Add Caller Modal ── */}
      {showNewCallerModal && (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Add New Caller</h3>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Full Name</label>
                <input value={newCallerName} onChange={e => setNewCallerName(e.target.value)} placeholder="e.g. Amit Shah" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Team</label>
                <input value={newCallerTeam} onChange={e => setNewCallerTeam(e.target.value)} placeholder="e.g. North Logistics" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNewCallerModal(false)} className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={addCaller} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 active:scale-[0.98] transition-all">Add Caller</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Add Plan Modal ── */}
      {showNewPlanModal && (
        <div className="fixed inset-0 z-40 bg-black/30 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6">
            <h3 className="font-bold text-slate-800 text-lg mb-4">Add New Plan</h3>
            <div className="space-y-3 mb-5">
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Plan Name</label>
                <input value={newPlanName} onChange={e => setNewPlanName(e.target.value)} placeholder="e.g. Growth Plus" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
              </div>
              <div>
                <label className="text-[11px] font-bold text-slate-500 uppercase">Monthly Price (₹)</label>
                <input type="number" value={newPlanPrice} onChange={e => setNewPlanPrice(e.target.value)} placeholder="e.g. 35000" className="mt-1 w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400 outline-none" />
              </div>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setShowNewPlanModal(false)} className="flex-1 py-2 border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
              <button onClick={addPlan} className="flex-1 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 active:scale-[0.98] transition-all">Add Plan</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Settings;
