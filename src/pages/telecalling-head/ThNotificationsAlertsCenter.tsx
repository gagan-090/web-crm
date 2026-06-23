import React, { useState } from 'react';

/* ─────────────────────── Types ─────────────────────── */
type Category = 'All' | 'SLA Alerts' | 'Conversion' | 'QC Logs' | 'HR/Admin' | 'System';

interface Notification {
  id: string;
  title: string;
  body: string;
  badge: string;
  badgeColor: string;
  category: Category;
  icon: string;
  iconColor: string;
  borderColor: string;
  timeAgo: string;
  read: boolean;
}

interface AlertPref {
  id: string;
  label: string;
  desc: string;
  icon: string;
  iconColor: string;
  push: boolean;
  email: boolean;
}

/* ─────────────────────── Static data ─────────────────────── */
const NOTIFICATIONS_INIT: Notification[] = [
  {
    id: 'n1',
    title: 'SLA Breach: Lead ID #4492',
    body: 'High-priority lead assigned to Agent Rahul K. has exceeded the 15-minute first-call window. Immediate intervention required.',
    badge: 'CRITICAL', badgeColor: 'bg-red-100 text-red-700',
    category: 'SLA Alerts', icon: 'timer', iconColor: 'text-red-500',
    borderColor: 'border-l-red-500', timeAgo: '2m ago', read: false,
  },
  {
    id: 'n2',
    title: 'Conversion Milestone Reached',
    body: 'Team Beta has reached 85% conversion for the Morning Shift. 5 new Premium Leads successfully onboarded.',
    badge: 'SUCCESS', badgeColor: 'bg-green-100 text-green-700',
    category: 'Conversion', icon: 'trending_up', iconColor: 'text-green-600',
    borderColor: 'border-l-green-500', timeAgo: '15m ago', read: false,
  },
  {
    id: 'n3',
    title: 'QC Flag: Call ID #QC-901',
    body: 'Agent Sunita M. missed mandatory compliance disclaimer in call with customer "Manoj Transport". Record flagged for review.',
    badge: 'REVIEW', badgeColor: 'bg-blue-100 text-blue-700',
    category: 'QC Logs', icon: 'fact_check', iconColor: 'text-blue-500',
    borderColor: 'border-l-blue-500', timeAgo: '1h ago', read: true,
  },
  {
    id: 'n4',
    title: 'Roster Update: Shift B',
    body: "3 agents have requested emergency leave for tomorrow's shift. Please review and reassign lead distribution.",
    badge: 'ADMIN', badgeColor: 'bg-purple-100 text-purple-700',
    category: 'HR/Admin', icon: 'person_alert', iconColor: 'text-purple-500',
    borderColor: 'border-l-purple-500', timeAgo: '3h ago', read: true,
  },
  {
    id: 'n5',
    title: 'System Maintenance Advisory',
    body: 'Database optimization scheduled for 02:00 AM. Dashboard access may be intermittent for 15 minutes.',
    badge: 'SYSTEM', badgeColor: 'bg-slate-100 text-slate-600',
    category: 'System', icon: 'dns', iconColor: 'text-slate-500',
    borderColor: 'border-l-slate-400', timeAgo: '5h ago', read: true,
  },
];

const PREFS_INIT: AlertPref[] = [
  { id: 'p1', label: 'SLA Breach Alerts', desc: 'Immediate notification for any team delay.', icon: 'alarm', iconColor: 'text-red-500', push: true, email: true },
  { id: 'p2', label: 'Conversion Milestones', desc: 'Periodic updates on team performance targets.', icon: 'query_stats', iconColor: 'text-green-600', push: true, email: false },
  { id: 'p3', label: 'QC Failure Flags', desc: 'Real-time alerts for compliance violations.', icon: 'policy', iconColor: 'text-blue-500', push: true, email: true },
  { id: 'p4', label: 'System Maintenance', desc: 'Scheduled downtime and platform updates.', icon: 'settings_suggest', iconColor: 'text-slate-500', push: false, email: true },
];

const TABS: Category[] = ['All', 'SLA Alerts', 'Conversion', 'QC Logs', 'HR/Admin', 'System'];

/* ─────────────────────── Toggle component ─────────────────────── */
const Toggle: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => (
  <label className="relative inline-flex items-center cursor-pointer">
    <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
    <div className={`w-9 h-5 rounded-full transition-colors duration-200 ${checked ? 'bg-blue-600' : 'bg-slate-200'} relative`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-4' : 'translate-x-0'}`} />
    </div>
  </label>
);

/* ─────────────────────── Main Component ─────────────────────── */
export const ThNotificationsAlertsCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>(NOTIFICATIONS_INIT);
  const [prefs, setPrefs] = useState<AlertPref[]>(PREFS_INIT);
  const [activeTab, setActiveTab] = useState<Category>('All');
  const [selectedId, setSelectedId] = useState<string>('n1');
  const [toast, setToast] = useState<string | null>(null);
  const [prefsSaved, setPrefsSaved] = useState(false);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  /* ── Actions ── */
  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    showToast('All notifications marked as read.');
  };

  const markRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const archiveNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification archived.');
    setSelectedId(notifications.filter(n => n.id !== id)[0]?.id ?? '');
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    showToast('Notification deleted.');
    setSelectedId(notifications.filter(n => n.id !== id)[0]?.id ?? '');
  };

  const togglePref = (id: string, field: 'push' | 'email') => {
    setPrefs(prev => prev.map(p => p.id === id ? { ...p, [field]: !p[field] } : p));
    setPrefsSaved(false);
  };

  const savePrefs = () => {
    setPrefsSaved(true);
    showToast('Alert preferences saved successfully!');
  };

  const handleCallAgent = () => showToast('📞 Calling Agent Rahul Kumar (Team Alpha)…');
  const handleReassignLead = () => showToast('🔄 Lead #4492 reassignment initiated. Supervisors notified.');

  /* ── Filtered list ── */
  const filtered = activeTab === 'All'
    ? notifications
    : notifications.filter(n => n.category === activeTab);

  const selected = notifications.find(n => n.id === selectedId) ?? null;
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <main className="flex flex-col h-full bg-slate-50 relative">

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 bg-slate-900 text-white text-sm font-medium px-5 py-3 rounded-lg shadow-2xl flex items-center gap-2 animate-fade-in">
          <span className="material-symbols-outlined text-[18px] text-green-400">check_circle</span>
          {toast}
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="flex flex-1 overflow-hidden">

        {/* ══ LEFT PANEL – Notification List ══ */}
        <div className="w-[42%] min-w-[320px] flex flex-col bg-white border-r border-slate-200">

          {/* Header */}
          <div className="px-6 pt-5 pb-0 bg-white border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-slate-800">Notifications</h2>
                {unreadCount > 0 && (
                  <span className="px-2 py-0.5 bg-red-500 text-white text-[11px] font-bold rounded-full">{unreadCount}</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={markAllRead}
                  className="px-3 py-1.5 bg-blue-600 text-white text-[11px] font-bold rounded-md hover:bg-blue-700 active:scale-95 transition-all"
                >
                  Mark All as Read
                </button>
                <button className="p-1.5 border border-slate-200 rounded-md hover:bg-slate-50 text-slate-500 transition-colors">
                  <span className="material-symbols-outlined text-[18px]">filter_list</span>
                </button>
              </div>
            </div>

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              {TABS.map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`pb-2.5 px-2 text-[11px] font-bold whitespace-nowrap relative transition-colors ${
                    activeTab === tab
                      ? 'text-blue-600'
                      : 'text-slate-400 hover:text-slate-700'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <div className="absolute bottom-0 left-0 w-full h-[2px] bg-blue-600 rounded-t" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Notification list */}
          <div className="flex-1 overflow-y-auto">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-48 text-slate-400 gap-2">
                <span className="material-symbols-outlined text-[40px]">notifications_off</span>
                <p className="text-sm font-medium">No notifications in this category</p>
              </div>
            ) : (
              filtered.map(n => (
                <button
                  key={n.id}
                  onClick={() => { setSelectedId(n.id); markRead(n.id); }}
                  className={`w-full text-left px-5 py-4 border-b border-slate-100 border-l-4 ${n.borderColor} transition-all hover:bg-slate-50 focus:outline-none ${
                    selectedId === n.id ? 'bg-blue-50 border-l-blue-600' : n.read ? 'bg-white opacity-70' : 'bg-white'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1.5">
                    <div className="flex items-center gap-2.5">
                      {!n.read && <span className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0 mt-0.5" />}
                      <span className={`material-symbols-outlined ${n.iconColor} text-[18px]`}>{n.icon}</span>
                      <span className={`font-bold text-[13px] text-slate-800 ${n.read ? 'font-semibold' : ''}`}>{n.title}</span>
                    </div>
                    <span className="text-[11px] text-slate-400 ml-2 flex-shrink-0">{n.timeAgo}</span>
                  </div>
                  <p className="text-[12px] text-slate-500 leading-relaxed line-clamp-2 pl-7">{n.body}</p>
                  <div className="mt-2 pl-7 flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded ${n.badgeColor}`}>{n.badge}</span>
                    <span className="text-[10px] text-slate-400">Category: {n.category}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>

        {/* ══ RIGHT PANEL – Detail + Preferences ══ */}
        <div className="flex-1 flex flex-col overflow-y-auto bg-slate-50">

          {/* ── Detail view ── */}
          {selected ? (
            <div className="bg-white border-b border-slate-200 p-6">
              {/* Title row */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 flex-shrink-0 bg-red-50 text-red-500 rounded-lg flex items-center justify-center">
                    <span className="material-symbols-outlined text-[28px]">warning</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 leading-snug mb-1">{selected.title}</h3>
                    <div className="flex items-center gap-2 text-[12px] text-slate-400">
                      <span className="font-semibold text-slate-600">From: System Watchdog</span>
                      <span>•</span>
                      <span>Today, 10:42 AM</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button
                    onClick={() => archiveNotification(selected.id)}
                    title="Archive"
                    className="p-2 border border-slate-200 rounded-lg hover:bg-slate-100 text-slate-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">archive</span>
                  </button>
                  <button
                    onClick={() => deleteNotification(selected.id)}
                    title="Delete"
                    className="p-2 border border-slate-200 rounded-lg hover:bg-red-50 hover:text-red-500 text-slate-500 transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">delete</span>
                  </button>
                </div>
              </div>

              {/* Body */}
              <p className="text-sm text-slate-600 leading-relaxed mb-5">{selected.body}</p>

              {/* Lead info grid */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-200 rounded-lg mb-5">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Lead Name</p>
                  <p className="font-bold text-slate-800 text-sm">Jai Balaji Logistics</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Assigned Agent</p>
                  <p className="font-bold text-slate-800 text-sm">Rahul Kumar (Team Alpha)</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Assign Time</p>
                  <p className="text-slate-700 text-sm">10:25:12 AM</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-400 mb-1">Current Delay</p>
                  <p className="text-red-500 font-bold text-sm">+17m 48s</p>
                </div>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-5">
                Failure to address this within the next <span className="font-bold text-red-500">5 minutes</span> will result in an automatic lead reassignment and a negative performance weight for the agent.
              </p>

              {/* Action buttons */}
              <div className="flex gap-3">
                <button
                  onClick={handleCallAgent}
                  className="flex-1 bg-blue-600 text-white py-2.5 font-bold text-sm rounded-lg hover:bg-blue-700 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">call</span>
                  Call Agent Now
                </button>
                <button
                  onClick={handleReassignLead}
                  className="flex-1 bg-orange-500 text-white py-2.5 font-bold text-sm rounded-lg hover:bg-orange-600 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <span className="material-symbols-outlined text-[18px]">swap_horiz</span>
                  Reassign Lead
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-b border-slate-200 p-10 flex flex-col items-center justify-center gap-3 text-slate-400">
              <span className="material-symbols-outlined text-[48px]">notifications_none</span>
              <p className="font-medium text-sm">Select a notification to view details</p>
            </div>
          )}

          {/* ── Alert Preferences ── */}
          <div className="p-6 flex-1">
            <div className="mb-5">
              <h3 className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-1">Alert Preferences</h3>
              <p className="text-[13px] text-slate-500">Configure how you receive critical system updates and operational alerts.</p>
            </div>

            <div className="space-y-3">
              {prefs.map(pref => (
                <div key={pref.id} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center justify-between shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-slate-50 flex items-center justify-center flex-shrink-0">
                      <span className={`material-symbols-outlined ${pref.iconColor} text-[20px]`}>{pref.icon}</span>
                    </div>
                    <div>
                      <p className="font-bold text-[13px] text-slate-800">{pref.label}</p>
                      <p className="text-[11px] text-slate-400 mt-0.5">{pref.desc}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 ml-4">
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Push</span>
                      <Toggle checked={pref.push} onChange={() => togglePref(pref.id, 'push')} />
                    </div>
                    <div className="flex flex-col items-center gap-1.5">
                      <span className="text-[9px] uppercase font-bold text-slate-400 tracking-wider">Email</span>
                      <Toggle checked={pref.email} onChange={() => togglePref(pref.id, 'email')} />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Save button */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={savePrefs}
                className={`px-6 py-2.5 font-bold text-sm rounded-lg active:scale-[0.98] transition-all flex items-center gap-2 ${
                  prefsSaved
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-600 text-white hover:bg-blue-700'
                }`}
              >
                <span className="material-symbols-outlined text-[18px]">
                  {prefsSaved ? 'check_circle' : 'save'}
                </span>
                {prefsSaved ? 'Preferences Saved!' : 'Save Preferences'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ThNotificationsAlertsCenter;
