import React from 'react';

/**
 * The CRM's KPI tile — one definition for every role's dashboard.
 *
 * Two ways to colour it:
 *   • `tone="emerald"` — a preset, which is what a new dashboard should use;
 *   • the explicit iconBg / iconColor / valueColor / borderColor props, kept so
 *     the Driver Welcome dashboard's hand-tuned palette maps over 1:1.
 */
export type KpiTone =
  | 'slate' | 'indigo' | 'blue' | 'sky' | 'emerald' | 'red' | 'amber'
  | 'purple' | 'orange' | 'green' | 'rose' | 'teal' | 'navy';

const TONES: Record<KpiTone, { iconBg: string; iconColor: string; value: string; border: string }> = {
  slate:   { iconBg: 'bg-slate-100',   iconColor: 'text-slate-500',   value: 'text-slate-800',   border: 'border-slate-200' },
  indigo:  { iconBg: 'bg-indigo-50',   iconColor: 'text-indigo-500',  value: 'text-indigo-700',  border: 'border-indigo-100' },
  blue:    { iconBg: 'bg-blue-50',     iconColor: 'text-blue-500',    value: 'text-blue-700',    border: 'border-blue-100' },
  sky:     { iconBg: 'bg-sky-50',      iconColor: 'text-sky-500',     value: 'text-sky-700',     border: 'border-sky-100' },
  emerald: { iconBg: 'bg-emerald-50',  iconColor: 'text-emerald-500', value: 'text-emerald-700', border: 'border-emerald-200' },
  red:     { iconBg: 'bg-red-50',      iconColor: 'text-red-500',     value: 'text-red-600',     border: 'border-red-100' },
  amber:   { iconBg: 'bg-amber-50',    iconColor: 'text-amber-500',   value: 'text-amber-700',   border: 'border-amber-200' },
  purple:  { iconBg: 'bg-purple-50',   iconColor: 'text-purple-500',  value: 'text-purple-700',  border: 'border-purple-200' },
  orange:  { iconBg: 'bg-orange-50',   iconColor: 'text-orange-500',  value: 'text-orange-700',  border: 'border-orange-100' },
  green:   { iconBg: 'bg-green-50',    iconColor: 'text-green-600',   value: 'text-green-700',   border: 'border-green-200' },
  rose:    { iconBg: 'bg-rose-50',     iconColor: 'text-rose-500',    value: 'text-rose-700',    border: 'border-rose-200' },
  teal:    { iconBg: 'bg-teal-50',     iconColor: 'text-teal-500',    value: 'text-teal-700',    border: 'border-teal-200' },
  navy:    { iconBg: 'bg-[#17376B]/10', iconColor: 'text-[#17376B]',  value: 'text-[#17376B]',   border: 'border-[#17376B]/20' },
};

export interface KpiTileProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: string;
  tone?: KpiTone;
  /** Explicit overrides — win over `tone` when supplied. */
  iconColor?: string;
  iconBg?: string;
  valueColor?: string;
  borderColor?: string;
  /** Durations render as "1H 34M 25S", far too wide for the counter size. */
  valueSize?: string;
  /** Makes the tile a button — used for drill-downs. */
  onClick?: () => void;
  /** Small trend chip, e.g. "+12%" */
  trend?: { value: string; direction: 'up' | 'down' | 'flat' };
}

export const KpiTile: React.FC<KpiTileProps> = ({
  label, value, sub, icon, tone = 'slate',
  iconColor, iconBg, valueColor, borderColor,
  valueSize = 'text-2xl', onClick, trend,
}) => {
  const t = TONES[tone];
  const body = (
    <>
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider leading-none">{label}</span>
        {/* Tile and glyph are separate elements on purpose: index.css sets
            `.material-symbols-outlined { display: inline-block }` at the same
            specificity as `.flex` and later in the file, so a single element
            carrying both loses its flex box and the icon slides to the corner.
            This used to be worked around with an inline style; nesting is the
            actual fix. */}
        <span className={`w-7 h-7 rounded-lg flex items-center justify-center ${iconColor || t.iconColor} ${iconBg || t.iconBg}`}>
          <span className="material-symbols-outlined text-[16px] leading-none">{icon}</span>
        </span>
      </div>
      <div className={`${valueSize} font-bold leading-tight ${valueColor || t.value} whitespace-nowrap tm-metric`}>
        {value}
      </div>
      <div className="flex items-center gap-1.5 min-h-[12px]">
        {trend && (
          <span
            className={`text-[9.5px] font-bold px-1 rounded flex items-center gap-0.5 ${
              trend.direction === 'up'
                ? 'text-emerald-700 bg-emerald-50'
                : trend.direction === 'down'
                ? 'text-red-600 bg-red-50'
                : 'text-gray-500 bg-gray-100'
            }`}
          >
            <span className="material-symbols-outlined text-[11px]">
              {trend.direction === 'up' ? 'trending_up' : trend.direction === 'down' ? 'trending_down' : 'trending_flat'}
            </span>
            {trend.value}
          </span>
        )}
        {sub && <span className="text-[10px] text-gray-400 leading-none truncate">{sub}</span>}
      </div>
    </>
  );

  const shell = `bg-white border ${borderColor || t.border} rounded-xl p-3.5 flex flex-col gap-2 shadow-tile hover:shadow-tile-hover tm-tile text-left`;

  return onClick ? (
    <button type="button" onClick={onClick} className={`${shell} tm-pressable w-full`}>
      {body}
    </button>
  ) : (
    <div className={shell}>{body}</div>
  );
};

export default KpiTile;
