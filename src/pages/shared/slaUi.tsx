import React from 'react';
import type { SlaConnectivity, SlaStatus } from '../../services/api/webCrmApi';

/**
 * Shared bits of the User Connectivity SLA screens (manager board + the agent's
 * own card) so a status reads the same colour and wording everywhere.
 */

/** Minutes → "12m", "2h 5m", "3d 4h". A late first call can be days out. */
export const fmtMins = (min: number | null | undefined): string => {
  if (min === null || min === undefined) return '—';
  const m = Math.round(min);
  if (m < 1) return '<1m';
  if (m < 60) return `${m}m`;
  if (m < 60 * 24) return `${Math.floor(m / 60)}h ${m % 60}m`;
  return `${Math.floor(m / 1440)}d ${Math.floor((m % 1440) / 60)}h`;
};

/** Seconds → "18:04" (mm:ss) for a running clock. */
export const fmtClock = (sec: number): string => {
  const s = Math.max(0, Math.floor(sec));
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
};

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

/** "2026-06-01 15:42:24" or ISO → "01 Jun, 3:42 PM". */
export const fmtStamp = (s: string | null | undefined): string => {
  if (!s) return '—';
  const d = new Date(s.includes('T') ? s : s.replace(' ', 'T'));
  if (isNaN(d.getTime())) return s;
  const h = d.getHours();
  return `${String(d.getDate()).padStart(2, '0')} ${MONTHS[d.getMonth()]}, ${h % 12 || 12}:${String(d.getMinutes()).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

export const pctText = (p: number | null | undefined): string => (p === null || p === undefined ? '—' : `${p}%`);

/** Compliance colour: no target is published, so this only signals direction. */
export const pctTone = (p: number | null | undefined): string => {
  if (p === null || p === undefined) return 'text-gray-400';
  if (p >= 90) return 'text-emerald-600';
  if (p >= 70) return 'text-amber-600';
  return 'text-rose-600';
};

const STATUS_META: Record<SlaStatus, { label: string; cls: string; icon: string }> = {
  met:        { label: 'SLA met',    cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: 'check_circle' },
  late:       { label: 'Late',       cls: 'bg-amber-50 text-amber-700 border-amber-200',       icon: 'schedule' },
  not_called: { label: 'Not called', cls: 'bg-rose-50 text-rose-700 border-rose-200',          icon: 'phone_disabled' },
  pending:    { label: 'Running',    cls: 'bg-sky-50 text-sky-700 border-sky-200',             icon: 'timer' },
};

export const StatusChip: React.FC<{ status: SlaStatus }> = ({ status }) => {
  const m = STATUS_META[status];
  return (
    <span className={`inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-wide px-2 py-0.5 rounded-lg border whitespace-nowrap ${m.cls}`}>
      <span className="material-symbols-outlined text-[13px]">{m.icon}</span>{m.label}
    </span>
  );
};

const CONN_META: Record<SlaConnectivity, { label: string; cls: string }> = {
  connected:     { label: 'Connected',     cls: 'text-emerald-700' },
  callback:      { label: 'Callback set',  cls: 'text-indigo-700' },
  not_connected: { label: 'Not connected', cls: 'text-rose-700' },
  in_progress:   { label: 'Dialled',       cls: 'text-gray-500' },
  not_attempted: { label: 'Not attempted', cls: 'text-gray-400' },
};

export const ConnText: React.FC<{ c: SlaConnectivity }> = ({ c }) => (
  <span className={`text-[11px] font-bold ${CONN_META[c].cls}`}>{CONN_META[c].label}</span>
);

/** The published rule, rendered from the server's live config, never retyped. */
export const RulesBanner: React.FC<{ rules: { sla_minutes: number; window: string; duty_close: string; days: string } }> = ({ rules }) => (
  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-2.5 text-[12px] text-indigo-900">
    <span className="flex items-center gap-1.5 font-black">
      <span className="material-symbols-outlined text-[16px]">timer</span>First call within {rules.sla_minutes} min of registration
    </span>
    <span className="text-indigo-700">{rules.days}, {rules.window} · duty closes {rules.duty_close}</span>
    <span className="text-indigo-700">After-hours sign-ups are called from the next working day's start</span>
  </div>
);
