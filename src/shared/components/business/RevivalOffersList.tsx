import React, { useState } from 'react';
import { useGetRevivalOffersQuery, type RevivalOffer } from '../../../services/api/webCrmApi';

/**
 * MY QUEUE → REVIVAL — the offers this agent has already made.
 *
 * A coupon is a promise with a 7-day fuse: the agent who issued it needs to see
 * which ones are still live, which converted, and which lapsed unused — that
 * last group is the follow-up list the campaign runs on.
 *
 * The agent name shown upstream is derived from the lead's OWNER
 * (users.assigned_to → web_crm_admins), because coupon_codes records no issuer.
 * That is accurate until a lead is reassigned; see RevivalController.
 */

const STATUS: Record<string, { chip: string; label: string; icon: string }> = {
  converted: { chip: 'bg-emerald-50 text-emerald-700 border-emerald-200', label: 'Converted', icon: 'check_circle' },
  active:    { chip: 'bg-amber-50 text-amber-700 border-amber-200',       label: 'Live',      icon: 'schedule' },
  expired:   { chip: 'bg-gray-100 text-gray-500 border-gray-200',         label: 'Lapsed',    icon: 'timer_off' },
};

const fmtDate = (d?: string | null) =>
  d ? new Date(String(d).replace(' ', 'T')).toLocaleDateString('en-IN', { day: '2-digit', month: 'short' }) : '—';

const daysLeft = (expiry?: string | null): number | null => {
  if (!expiry) return null;
  const ms = new Date(String(expiry).replace(' ', 'T')).getTime() - Date.now();
  return Math.ceil(ms / 86400000);
};

interface Props {
  /** Opens the lead in the queue's detail pane. */
  onSelect?: (offer: RevivalOffer) => void;
  selectedUserId?: string | number | null;
}

export const RevivalOffersList: React.FC<Props> = ({ onSelect, selectedUserId }) => {
  const [status, setStatus] = useState<string>('');
  const { data, isFetching } = useGetRevivalOffersQuery({ mine: true, status: status || undefined, per_page: 100 });

  const offers = data?.data || [];
  const sum = data?.summary;

  return (
    <div className="flex flex-col min-h-0">
      {/* Campaign scoreboard for this agent */}
      <div className="px-3 py-2 border-b border-gray-100 bg-amber-50/40 shrink-0">
        <div className="flex items-center gap-3">
          <div>
            <p className="text-[9px] font-black uppercase tracking-wider text-amber-800">My revival offers</p>
            <p className="text-[10px] text-amber-700/80">
              {sum?.converted ?? 0} converted of {sum?.total ?? 0} · {sum?.conversion_rate ?? 0}% ·
              ₹{(sum?.revenue ?? 0).toLocaleString()} recovered
            </p>
          </div>
        </div>
        <div className="flex gap-1 mt-1.5">
          {[
            { id: '',          label: `All ${sum?.total ?? 0}` },
            { id: 'active',    label: `Live ${sum?.active ?? 0}` },
            { id: 'converted', label: `Won ${sum?.converted ?? 0}` },
            { id: 'expired',   label: `Lapsed ${sum?.expired ?? 0}` },
          ].map(t => (
            <button
              key={t.id}
              onClick={() => setStatus(t.id)}
              className={`px-2 py-0.5 rounded-md text-[9.5px] font-bold border transition-colors ${
                status === t.id
                  ? 'bg-amber-100 text-amber-800 border-amber-300'
                  : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-gray-100 min-h-0">
        {isFetching && offers.length === 0 ? (
          <p className="p-4 text-center text-[11px] text-gray-400 italic">Loading offers…</p>
        ) : offers.length === 0 ? (
          <p className="p-6 text-center text-[11px] text-gray-400 italic">
            No revival offers yet. Issue one from the post-call form after a connected call.
          </p>
        ) : (
          offers.map(o => {
            const st = STATUS[o.status] || STATUS.active;
            const left = daysLeft(o.expiry_date);
            const active = String(selectedUserId ?? '') === String(o.user_id);
            return (
              <button
                key={`${o.id}-${o.plan}`}
                onClick={() => onSelect?.(o)}
                className={`w-full text-left p-2.5 transition-colors tm-pressable ${
                  active ? 'bg-amber-50 border-l-4 border-l-amber-400' : 'hover:bg-gray-50 border-l-4 border-l-transparent'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-bold text-gray-900 text-[12px] truncate">{o.name}</span>
                  <span className={`text-[8.5px] font-black px-1.5 py-0.5 rounded border uppercase shrink-0 flex items-center gap-0.5 ${st.chip}`}>
                    <span className="material-symbols-outlined text-[10px]">{st.icon}</span>
                    {st.label}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="font-mono text-[9.5px] text-gray-400 truncate">{o.tmid || '—'}</span>
                  {o.location && <span className="text-[9.5px] text-gray-400 truncate">· {o.location}</span>}
                </div>

                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span className="text-[9.5px] font-black text-gray-700">{o.plan_label}</span>
                  <span className="text-[10px] font-black text-emerald-700">
                    ₹{o.offer_price ?? '—'}
                    {o.mrp ? <span className="ml-1 text-[8.5px] font-bold text-gray-400 line-through">₹{o.mrp}</span> : null}
                  </span>
                  <span className="font-mono text-[9px] text-gray-500 bg-gray-100 px-1 rounded">{o.coupon_code}</span>
                </div>

                <p className="text-[9px] text-gray-400 mt-0.5">
                  Offered {fmtDate(o.offered_at)}
                  {o.status === 'active' && left !== null && (
                    <span className={left <= 2 ? 'text-red-600 font-bold' : 'text-amber-700 font-semibold'}>
                      {' '}· {left <= 0 ? 'expires today' : `${left}d left`}
                    </span>
                  )}
                  {o.status === 'converted' && (
                    <span className="text-emerald-700 font-semibold"> · paid {fmtDate(o.converted_at)}</span>
                  )}
                </p>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};

export default RevivalOffersList;
