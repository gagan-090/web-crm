import React, { useState, useEffect } from 'react';
import { useGetWctExpiringSubscriptionsQuery } from '../../services/api/webCrmApi';
import type { WctExpiringLead, WctExpiringScope, WctExpiringTab, WctExpiringWindow } from '../../services/api/webCrmApi';
import { useSanCti } from '../../shared/components/cti/SanCtiContext';
import TransporterDetailsModal from '../matchmaking/TransporterDetailsModal';

// WCT · Expiring Soon — transporters whose subscription runs out within the
// chosen window (WctCallerController::expiringSubscriptions). Calls are placed
// with lead_type 'subscription_renew', which stamps call_history_ivr.process =
// 'subscription_renew'; the list refreshes when the disposition completes.
// A transporter moves from "To Call" to "Called" once a renewal call has been
// made for their current subscription.

const TABS: { key: WctExpiringTab; label: string; icon: string }[] = [
  { key: 'pending', label: 'To Call', icon: 'pending_actions' },
  { key: 'called', label: 'Called', icon: 'call_made' },
];

const WINDOWS: { key: WctExpiringWindow; label: string }[] = [
  { key: 'tomorrow', label: 'Expiring Tomorrow' },
  { key: '3days', label: 'Expiring In 3 Days' },
  { key: 'week', label: 'Expiring In a Week' },
  { key: 'expired', label: 'Expired' },
];

const fmtDateTime = (d?: string | null) =>
  d ? new Date(d.replace(' ', 'T')).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) : '—';

const fmtDateYear = (d?: string | null) =>
  d ? new Date(d.replace(' ', 'T')).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

const daysLeftChip = (days: number, expired: boolean) => {
  if (expired) {
    const ago = -days;
    return {
      text: ago <= 0 ? 'Expired today' : ago === 1 ? 'Expired yesterday' : `Expired ${ago} days ago`,
      cls: 'bg-gray-100 text-gray-600',
    };
  }
  if (days <= 0) return { text: 'Today', cls: 'bg-red-50 text-red-600' };
  if (days === 1) return { text: 'Tomorrow', cls: 'bg-red-50 text-red-600' };
  if (days <= 3) return { text: `${days} days`, cls: 'bg-orange-50 text-orange-600' };
  return { text: `${days} days`, cls: 'bg-amber-50 text-amber-700' };
};

const statusLabel = (s?: string | null) => (s ? s.replace(/_/g, ' ') : '');

export const WctExpiringSoon: React.FC = () => {
  const { dial, callState, agentState } = useSanCti();

  const [tab, setTab] = useState<WctExpiringTab>('pending');
  const [scope, setScope] = useState<WctExpiringScope>('all');
  const [window_, setWindow] = useState<WctExpiringWindow>('week');
  const [month, setMonth] = useState('');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [toast, setToast] = useState<string | null>(null);
  const [detailOf, setDetailOf] = useState<WctExpiringLead | null>(null);

  const { data, isLoading, isFetching, refetch } = useGetWctExpiringSubscriptionsQuery(
    { window: window_, tab, scope, month: window_ === 'expired' && month ? month : undefined, per_page: 50, page, search: search || undefined },
    { refetchOnMountOrArgChange: true },
  );

  const leads: WctExpiringLead[] = data?.data?.leads || [];
  const counts = data?.data?.counts;
  const tabCounts = data?.data?.tab_counts;
  const pagination = data?.data?.pagination;
  const expiredMonths = data?.data?.expired_months || [];

  useEffect(() => {
    const onDispositionComplete = () => { refetch(); };
    window.addEventListener('san-disposition-complete', onDispositionComplete);
    return () => window.removeEventListener('san-disposition-complete', onDispositionComplete);
  }, [refetch]);

  const triggerToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const handleCall = (lead: WctExpiringLead) => {
    if (agentState !== 'ready') {
      triggerToast(agentState === 'logged_out'
        ? 'CTI login failed — check the SAN softphone panel (bottom-left) for the reason.'
        : 'CTI agent is not ready yet — please wait a moment and try again.');
      return;
    }
    if (callState !== 'idle') {
      triggerToast('Finish or hang up the current call before dialing another transporter.');
      return;
    }
    if (!lead.phone) {
      triggerToast('This transporter has no phone number on record.');
      return;
    }
    dial(lead.phone, lead.id, lead.company_name, lead.tmid, 'subscription_renew');
    triggerToast(`Dialing ${lead.company_name}…`);
  };

  return (
    <main className="h-[calc(100vh-80px)] flex flex-col bg-white overflow-hidden border border-gray-200 rounded-xl relative">

      {toast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#FB641B]"></span>
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="p-4 border-b border-gray-200 bg-gray-50/50 shrink-0 space-y-3">
        <div className="flex justify-between items-center gap-3 flex-wrap">
          <div>
            <h1 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Expiring Soon</h1>
            <p className="text-xs text-gray-500 mt-0.5">Transporters whose subscription is about to expire or has expired — call them to renew</p>
          </div>
          <div className="flex items-center gap-2">
            <select
              value={scope}
              onChange={(e) => { setScope(e.target.value as WctExpiringScope); setPage(1); }}
              className="h-9 px-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white outline-none focus:ring-1 focus:ring-[#FB641B] cursor-pointer"
              title="Whose transporters to show"
            >
              <option value="all">All Queue</option>
              <option value="mine">My Transporters</option>
            </select>
            <div className="relative">
              <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">search</span>
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Search company, TMID, mobile…"
                className="pl-8 pr-3 h-9 w-64 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#FB641B]"
              />
            </div>
            <button
              onClick={() => refetch()}
              className="text-gray-400 hover:text-[#FB641B] transition-colors"
              title="Refresh"
            >
              <span className={`material-symbols-outlined text-[18px] ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
            </button>
          </div>
        </div>

        {/* To Call / Called */}
        <div className="flex gap-5 border-b border-gray-200 -mx-4 px-4">
          {TABS.map(t => {
            const active = t.key === tab;
            return (
              <button
                key={t.key}
                onClick={() => { setTab(t.key); setPage(1); }}
                className={`pb-2 -mb-px text-xs font-bold flex items-center gap-1.5 border-b-2 transition-colors ${
                  active ? 'border-[#FB641B] text-[#FB641B]' : 'border-transparent text-gray-500 hover:text-gray-800'
                }`}
              >
                <span className="material-symbols-outlined text-[16px]">{t.icon}</span>
                {t.label}
                <span className={`px-1.5 rounded text-[10px] ${active ? 'bg-orange-50' : 'bg-gray-100'}`}>
                  {tabCounts ? tabCounts[t.key] : '…'}
                </span>
              </button>
            );
          })}
        </div>

        {/* Window filter */}
        <div className="flex gap-2 flex-wrap items-center">
          {WINDOWS.map(w => {
            const active = w.key === window_;
            return (
              <button
                key={w.key}
                onClick={() => { setWindow(w.key); setPage(1); }}
                className={`px-3 h-8 rounded-lg text-xs font-bold border transition-colors flex items-center gap-2 ${
                  active
                    ? 'bg-[#FB641B] border-[#FB641B] text-white'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-[#FB641B] hover:text-[#FB641B]'
                }`}
              >
                {w.label}
                <span className={`px-1.5 rounded text-[10px] ${active ? 'bg-white/25' : 'bg-gray-100'}`}>
                  {counts ? counts[w.key] : '…'}
                </span>
              </button>
            );
          })}
          {window_ === 'expired' && (
            <select
              value={month}
              onChange={(e) => { setMonth(e.target.value); setPage(1); }}
              className="h-8 px-2 border border-gray-200 rounded-lg text-xs font-semibold text-gray-700 bg-white outline-none focus:ring-1 focus:ring-[#FB641B] cursor-pointer"
              title="Month the subscription expired in"
            >
              <option value="">All months</option>
              {expiredMonths.map(m => (
                <option key={m.month} value={m.month}>{m.label} ({m.count})</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto min-h-0">
        <table className="w-full text-xs text-left border-collapse">
          <thead className="bg-gray-100 text-gray-500 uppercase text-[9px] sticky top-0 z-10 border-b border-gray-200">
            <tr>
              <th className="p-3">Company</th>
              <th className="p-3">TMID</th>
              <th className="p-3">Contact</th>
              <th className="p-3">Plan</th>
              <th className="p-3">{window_ === 'expired' ? 'Expired On' : 'Expires On'}</th>
              <th className="p-3 text-center">{window_ === 'expired' ? 'Status' : 'Time Left'}</th>
              <th className="p-3">Owner</th>
              <th className="p-3">Last Renewal Call</th>
              <th className="p-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-gray-700">
            {isLoading ? (
              <tr><td colSpan={9} className="p-10 text-center text-gray-400 italic">Loading…</td></tr>
            ) : leads.length === 0 ? (
              <tr><td colSpan={9} className="p-10 text-center text-gray-400 italic">
                {tab === 'called'
                  ? 'No renewal calls made yet for subscriptions expiring in this window.'
                  : 'No transporters left to call in this window.'}
              </td></tr>
            ) : (
              leads.map(lead => {
                const chip = daysLeftChip(lead.days_left, lead.expired);
                return (
                  <tr key={lead.id} className="hover:bg-gray-50/50">
                    <td className="p-3">
                      <span className="font-bold text-gray-800 block">{lead.company_name}</span>
                      <span className="text-[10px] text-gray-400">{lead.location}{lead.fleet_size ? ` · ${lead.fleet_size} trucks` : ''}</span>
                    </td>
                    <td className="p-3 font-mono text-gray-500">{lead.tmid}</td>
                    <td className="p-3">
                      <span className="font-semibold text-gray-800 block">{lead.contact_name || '—'}</span>
                      <span className="text-[10px] text-gray-400">{lead.phone || '—'}</span>
                    </td>
                    <td className="p-3 whitespace-nowrap">
                      <span className="font-semibold text-gray-800 block">{lead.plan_label}</span>
                      <span className="text-[10px] text-gray-400">₹{lead.amount.toLocaleString('en-IN')}</span>
                    </td>
                    <td className="p-3 whitespace-nowrap">{lead.expired && lead.days_left < -1 ? fmtDateYear(lead.expires_at) : fmtDateTime(lead.expires_at)}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${chip.cls}`}>{chip.text}</span>
                    </td>
                    <td className="p-3 whitespace-nowrap text-gray-600">{lead.assigned_name || '—'}</td>
                    <td className="p-3 max-w-[220px]">
                      {lead.last_call_at ? (
                        <>
                          <span className="block font-semibold text-gray-700 capitalize truncate">
                            {statusLabel(lead.last_call_feedback) || statusLabel(lead.last_call_status)}
                          </span>
                          <span className="text-[10px] text-gray-400 block truncate">
                            {fmtDateTime(lead.last_call_at)}{lead.last_call_by ? ` · ${lead.last_call_by}` : ''} · {lead.renew_calls} call{lead.renew_calls === 1 ? '' : 's'}
                          </span>
                          {lead.last_call_note && (
                            <span className="text-[10px] italic text-gray-500 block truncate" title={lead.last_call_note}>"{lead.last_call_note}"</span>
                          )}
                        </>
                      ) : (
                        <span className="text-gray-300">Not called yet</span>
                      )}
                    </td>
                    <td className="p-3 text-right whitespace-nowrap">
                      <button
                        onClick={() => setDetailOf(lead)}
                        className="border border-gray-200 hover:border-[#FB641B] hover:text-[#FB641B] text-gray-600 px-3 py-1.5 rounded font-bold text-[10px] mr-1.5 transition-colors"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleCall(lead)}
                        className="bg-[#FB641B] hover:bg-[#e4540d] text-white px-3 py-1.5 rounded font-bold text-[10px] shadow-sm active:scale-95 transition-all inline-flex items-center gap-1"
                      >
                        <span className="material-symbols-outlined text-[14px]">phone</span> {tab === 'called' ? 'Call Again' : 'Call'}
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 text-xs text-gray-500 shrink-0">
          <span>Page {pagination.current_page} of {pagination.last_page} · {pagination.total} transporters</span>
          <div className="flex gap-2">
            <button
              disabled={page <= 1 || isFetching}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              className="px-3 py-1 border border-gray-200 rounded-lg font-semibold disabled:opacity-40 hover:bg-gray-50"
            >Prev</button>
            <button
              disabled={page >= pagination.last_page || isFetching}
              onClick={() => setPage(p => p + 1)}
              className="px-3 py-1 border border-gray-200 rounded-lg font-semibold disabled:opacity-40 hover:bg-gray-50"
            >Next</button>
          </div>
        </div>
      )}

      {detailOf && (
        <TransporterDetailsModal
          open
          transporterId={detailOf.id}
          transporterName={detailOf.company_name}
          uniqueId={detailOf.tmid}
          onClose={() => setDetailOf(null)}
        />
      )}
    </main>
  );
};

export default WctExpiringSoon;
