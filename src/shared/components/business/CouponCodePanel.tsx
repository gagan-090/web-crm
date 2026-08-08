import React, { useState } from 'react';
import { useGenerateCouponMutation } from '../../../services/api/webCrmApi';

/**
 * REVIVAL-CAMPAIGN COUPON
 *
 * TruckMitr has ~82,000 registered users against under 4,000 paid subscribers,
 * so the growth plan is to revive the existing base rather than only chase new
 * leads. This panel is the telecaller's half of that: on a revival call they
 * issue a discount coupon then and there, and the backend pushes it to the
 * subscriber's phone (FCM) and email while the agent is still on the line.
 *
 * The discounts are fixed app-side in API\CouponCodeController — the CRM only
 * names the plan. Shown here so the agent can quote the exact price out loud:
 *
 *   Job Ready  ₹199 → ₹149   (₹50 off)
 *   Verified   ₹299 → ₹229   (₹70 off)
 *   Trusted    ₹499 → ₹399   (₹100 off)
 *
 * Coupons expire in 7 days, which is the urgency the pitch rests on.
 */

interface PlanOffer {
  value: string;
  label: string;
  mrp: number;
  discount: number;
  /** Which lead roles can be sold this plan. */
  roles: string[];
}

const OFFERS: PlanOffer[] = [
  { value: 'job_ready', label: 'Job Ready', mrp: 199, discount: 50,  roles: ['driver'] },
  { value: 'verified',  label: 'Verified',  mrp: 299, discount: 70,  roles: ['driver'] },
  { value: 'trusted',   label: 'Trusted',   mrp: 499, discount: 100, roles: ['driver'] },
  { value: 'standard',  label: 'Standard',  mrp: 499, discount: 100, roles: ['transporter'] },
  { value: 'foreman_pro',     label: 'Foreman Pro',     mrp: 999,  discount: 100, roles: ['foreman'] },
  { value: 'association_pro', label: 'Association Pro', mrp: 1299, discount: 100, roles: ['association'] },
];

interface Props {
  userId: number;
  uniqueId: string;
  leadName?: string;
  /** Narrows the plan list; unknown roles see the driver plans. */
  role?: string;
  className?: string;
  /** Start collapsed behind a "Revival Offer" button (post-call form). */
  collapsible?: boolean;
}

export const CouponCodePanel: React.FC<Props> = ({
  userId, uniqueId, leadName, role = 'driver', className = '', collapsible = false,
}) => {
  const [generate, { isLoading }] = useGenerateCouponMutation();
  const [open, setOpen] = useState(!collapsible);
  // The plan is picked from a dropdown, then confirmed — an agent mid-call
  // should not be able to fire an SMS+push at a subscriber with one stray click.
  const [plan, setPlan] = useState('');
  const [issued, setIssued] = useState<{ code: string; amount: number; expiry: string; plan: string } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const offers = OFFERS.filter(o => o.roles.includes(role)) .length
    ? OFFERS.filter(o => o.roles.includes(role))
    : OFFERS.filter(o => o.roles.includes('driver'));

  const issue = async (offer: PlanOffer) => {
    setError(null);
    try {
      const res = await generate({ user_id: userId, unique_id: uniqueId, payment_type: offer.value }).unwrap();
      setIssued({
        code: res.data.coupon_code,
        amount: Number(res.data.coupon_amount),
        expiry: String(res.data.expiry_date).slice(0, 10),
        plan: offer.label,
      });
      setCopied(false);
    } catch (e: any) {
      setError(
        e?.data?.message
        || e?.data?.errors?.unique_id?.[0]
        || e?.data?.errors?.user_id?.[0]
        || 'Could not generate the coupon.'
      );
    }
  };

  const copy = () => {
    if (!issued) return;
    navigator.clipboard?.writeText(issued.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className={`rounded-xl border border-amber-300 bg-amber-50/60 p-3 ${className}`}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center gap-1.5 text-left"
      >
        <span className="material-symbols-outlined text-[16px] text-amber-600">local_activity</span>
        <h4 className="text-[10px] font-black uppercase tracking-wider text-amber-800">Revival offer</h4>
        <span className="text-[9.5px] text-amber-700/80">· valid 7 days, sent to their phone</span>
        {collapsible && (
          <span className="material-symbols-outlined text-[16px] text-amber-600 ml-auto">
            {open ? 'expand_less' : 'expand_more'}
          </span>
        )}
      </button>

      {open && (
        <div className="mt-2 flex flex-col sm:flex-row gap-1.5">
          <select
            value={plan}
            onChange={e => setPlan(e.target.value)}
            className="flex-1 h-8 rounded-lg border border-amber-300 bg-white px-2 text-[11px] font-semibold text-gray-700 outline-none"
          >
            <option value="">— Select a plan to offer —</option>
            {offers.map(o => (
              <option key={o.value} value={o.value}>
                {o.label} · ₹{o.mrp - o.discount} (was ₹{o.mrp}, save ₹{o.discount})
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => { const o = offers.find(x => x.value === plan); if (o) issue(o); }}
            disabled={isLoading || !plan}
            className="h-8 shrink-0 rounded-lg bg-amber-500 hover:bg-amber-600 disabled:opacity-40 px-4 text-[11px] font-black text-white tm-pressable"
          >
            {isLoading ? 'Sending…' : 'Send coupon'}
          </button>
        </div>
      )}

      {error && (
        <p className="mt-2 text-[10px] font-semibold text-red-600 bg-red-50 border border-red-200 rounded-lg px-2 py-1">
          {error}
        </p>
      )}

      {issued && (
        <div className="mt-2 rounded-lg border border-emerald-300 bg-emerald-50 px-2.5 py-2">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-wider text-emerald-700">
                {issued.plan} coupon sent{leadName ? ` to ${leadName}` : ''}
              </p>
              <p className="font-mono text-[13px] font-black text-emerald-900 leading-tight">{issued.code}</p>
              <p className="text-[9.5px] text-emerald-700">
                ₹{issued.amount} off · expires {issued.expiry}
              </p>
            </div>
            <button
              onClick={copy}
              className="shrink-0 rounded-lg border border-emerald-300 bg-white px-2 py-1 text-[10px] font-bold text-emerald-700 hover:bg-emerald-100 tm-pressable"
            >
              {copied ? 'Copied' : 'Copy'}
            </button>
          </div>
          <p className="mt-1 text-[9px] text-emerald-800/80">
            Read the code out and confirm they can see the notification.
          </p>
        </div>
      )}
    </div>
  );
};

export default CouponCodePanel;
