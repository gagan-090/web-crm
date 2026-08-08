import React from 'react';

/* The pieces every role dashboard repeats: the welcome line, the period
   selector, and the section panel. One definition each, so a change to the
   dashboard language lands on all ten desks at once. */

interface WelcomeBarProps {
  /** "Driver Welcome Calling Process" */
  process: string;
  name: string;
  /** Pre-formatted, so each desk keeps its own date style. */
  date: string;
  /** Buttons on the right — role specific. */
  actions?: React.ReactNode;
  /** Shows the muted "Updating…" pulse while a refetch is in flight. */
  isFetching?: boolean;
  /** The green "Database Live" pill. */
  live?: boolean;
}

export const WelcomeBar: React.FC<WelcomeBarProps> = ({ process, name, date, actions, isFetching, live = true }) => (
  <section className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-gray-200 pb-4 animate-fade-in-up">
    <div>
      <p className="text-[10px] text-primary font-bold uppercase tracking-widest">{process}</p>
      <h2 className="text-xl font-bold text-gray-800 mt-0.5">
        Welcome back, {name} — {date}
      </h2>
    </div>
    <div className="flex items-center gap-2">
      {actions}
      {isFetching && (
        <span className="text-[11px] text-gray-400 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-gray-400 animate-pulse" />
          Updating…
        </span>
      )}
      {live && (
        <div className="flex items-center gap-1.5 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg text-[11px]">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-semibold text-emerald-700">Database Live</span>
        </div>
      )}
    </div>
  </section>
);

interface PeriodTabsProps<T extends string> {
  tabs: { id: T; label: string }[];
  value: T;
  onChange: (id: T) => void;
  label?: string;
}

export function PeriodTabs<T extends string>({ tabs, value, onChange, label = 'Period' }: PeriodTabsProps<T>) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-0.5 animate-fade-in-up">
      <span className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider shrink-0">{label}:</span>
      <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white shadow-sm shrink-0">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`px-3.5 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-all border-r border-gray-200 last:border-r-0 tm-pressable ${
              value === tab.id ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
}

interface PanelCardProps {
  title: string;
  icon?: string;
  /** Right-hand slot: a link, a filter, a count. */
  action?: React.ReactNode;
  /** Accent colour for the title icon. */
  tone?: string;
  className?: string;
  bodyClassName?: string;
  children: React.ReactNode;
}

export const PanelCard: React.FC<PanelCardProps> = ({
  title, icon, action, tone = 'text-primary', className = '', bodyClassName = '', children,
}) => (
  <div className={`bg-white border border-gray-200 rounded-xl shadow-tile hover:shadow-tile-hover tm-tile overflow-hidden ${className}`}>
    <div className="flex items-center justify-between gap-2 px-3.5 py-2.5 border-b border-gray-100">
      <div className="flex items-center gap-1.5 min-w-0">
        {icon && <span className={`material-symbols-outlined text-[16px] ${tone}`}>{icon}</span>}
        <h3 className="text-[11px] font-black uppercase tracking-wider text-gray-600 truncate">{title}</h3>
      </div>
      {action}
    </div>
    <div className={`p-3.5 ${bodyClassName}`}>{children}</div>
  </div>
);

/** Skeleton grid shown while a dashboard's first payload is in flight. */
export const KpiSkeleton: React.FC<{ count?: number; cols?: string }> = ({
  count = 12,
  cols = 'grid-cols-2 sm:grid-cols-3 xl:grid-cols-7',
}) => (
  <div className={`grid ${cols} gap-2`}>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="bg-gray-100 rounded-xl h-20 tm-shimmer" />
    ))}
  </div>
);

export default PanelCard;
