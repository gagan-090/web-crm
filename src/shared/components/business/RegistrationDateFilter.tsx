import React, { useEffect, useRef, useState } from 'react';

// ── Registration date filter ────────────────────────────────────────────────
//
// Narrows a call queue to leads who REGISTERED in a given window
// (users.Created_at). Shared by the Driver Welcome / Matchmaking queue and the
// Transporter Welcome queue so the two can't drift apart.
//
// Backend: DwCallerController::applyFilters / WctCallerController::applyFilters
// read `reg_from` / `reg_to` (YYYY-MM-DD, inclusive) and apply them to every
// queue tab.

export interface RegDateRange {
  reg_from?: string;
  reg_to?: string;
}

interface Props {
  value: RegDateRange;
  onChange: (next: RegDateRange) => void;
  /** Hex accent so each desk keeps its own colour. */
  accent?: string;
}

/** Local YYYY-MM-DD. toISOString() would shift to UTC and, in IST, hand back
 *  yesterday's date for anything before 05:30. */
const ymd = (d: Date): string => {
  const p = (n: number) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
};

const shiftDays = (n: number): Date => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
};

const PRESETS: { id: string; label: string; range: () => RegDateRange }[] = [
  { id: 'all',        label: 'All time',      range: () => ({}) },
  { id: 'today',      label: 'Today',         range: () => ({ reg_from: ymd(new Date()), reg_to: ymd(new Date()) }) },
  { id: 'yesterday',  label: 'Yesterday',     range: () => ({ reg_from: ymd(shiftDays(-1)), reg_to: ymd(shiftDays(-1)) }) },
  { id: 'last_7',     label: 'Last 7 days',   range: () => ({ reg_from: ymd(shiftDays(-6)), reg_to: ymd(new Date()) }) },
  { id: 'last_30',    label: 'Last 30 days',  range: () => ({ reg_from: ymd(shiftDays(-29)), reg_to: ymd(new Date()) }) },
  {
    id: 'this_month',
    label: 'This month',
    range: () => {
      const now = new Date();
      return { reg_from: ymd(new Date(now.getFullYear(), now.getMonth(), 1)), reg_to: ymd(now) };
    },
  },
];

export const RegistrationDateFilter: React.FC<Props> = ({ value, onChange, accent = '#27AE60' }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Draft state so a half-typed custom range doesn't refetch the queue on every
  // keystroke — it applies when the agent commits it.
  const [from, setFrom] = useState(value.reg_from ?? '');
  const [to, setTo] = useState(value.reg_to ?? '');

  useEffect(() => {
    setFrom(value.reg_from ?? '');
    setTo(value.reg_to ?? '');
  }, [value.reg_from, value.reg_to]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onClickOutside);
    return () => document.removeEventListener('mousedown', onClickOutside);
  }, []);

  const isActive = !!(value.reg_from || value.reg_to);

  const activePreset = PRESETS.find(p => {
    const r = p.range();
    return r.reg_from === value.reg_from && r.reg_to === value.reg_to;
  });

  const label = !isActive
    ? 'Registered: All time'
    : activePreset && activePreset.id !== 'all'
      ? `Registered: ${activePreset.label}`
      : `Registered: ${value.reg_from || '…'} → ${value.reg_to || '…'}`;

  const applyCustom = () => {
    // Tolerate a reversed range rather than returning zero rows: an agent who
    // fills "to" before "from" means the span between the two dates.
    const a = from || undefined;
    const b = to || undefined;
    const swap = a && b && a > b;
    onChange({ reg_from: swap ? b : a, reg_to: swap ? a : b });
    setOpen(false);
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(o => !o)}
        title="Filter the queue by the date a lead registered"
        className={`w-full flex items-center gap-1.5 px-2.5 py-1.5 text-[11px] font-semibold rounded-md border transition-colors ${
          isActive ? 'text-white border-transparent' : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
        }`}
        style={isActive ? { backgroundColor: accent } : undefined}
      >
        <span className="material-symbols-outlined text-[15px]">event</span>
        <span className="truncate flex-1 text-left">{label}</span>
        {isActive && (
          <span
            role="button"
            title="Clear date filter"
            onClick={(e) => { e.stopPropagation(); onChange({}); setOpen(false); }}
            className="material-symbols-outlined text-[14px] hover:opacity-70"
          >
            close
          </span>
        )}
        <span className="material-symbols-outlined text-[15px]">{open ? 'expand_less' : 'expand_more'}</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 shadow-xl rounded-lg z-50 p-2 min-w-[240px]">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 pb-1">Registration Date</p>

          <div className="grid grid-cols-2 gap-1 mb-2">
            {PRESETS.map(p => {
              const selected = p.id === 'all' ? !isActive : activePreset?.id === p.id;
              return (
                <button
                  key={p.id}
                  onClick={() => { onChange(p.range()); setOpen(false); }}
                  className={`px-2 py-1.5 text-[11px] font-semibold rounded border transition-colors ${
                    selected ? 'text-white border-transparent' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
                  style={selected ? { backgroundColor: accent } : undefined}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-100 pt-2">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 pb-1">Custom range</p>
            <div className="flex items-center gap-1.5">
              <input
                type="date"
                value={from}
                max={to || undefined}
                onChange={(e) => setFrom(e.target.value)}
                className="flex-1 min-w-0 border border-gray-300 rounded px-1.5 py-1 text-[11px] outline-none focus:ring-1"
                style={{ ['--tw-ring-color' as any]: accent }}
              />
              <span className="text-[11px] text-gray-400">to</span>
              <input
                type="date"
                value={to}
                min={from || undefined}
                onChange={(e) => setTo(e.target.value)}
                className="flex-1 min-w-0 border border-gray-300 rounded px-1.5 py-1 text-[11px] outline-none focus:ring-1"
                style={{ ['--tw-ring-color' as any]: accent }}
              />
            </div>
            <div className="flex items-center gap-1.5 mt-2">
              <button
                onClick={applyCustom}
                disabled={!from && !to}
                className="flex-1 px-2 py-1.5 text-[11px] font-bold text-white rounded disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ backgroundColor: accent }}
              >
                Apply
              </button>
              <button
                onClick={() => { setFrom(''); setTo(''); onChange({}); setOpen(false); }}
                className="px-2 py-1.5 text-[11px] font-semibold text-gray-600 border border-gray-200 rounded hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegistrationDateFilter;
