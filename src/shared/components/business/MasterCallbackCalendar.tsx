import React, { useState, useEffect, useMemo } from 'react';
import { useSanCti } from '../cti/SanCtiContext';
import type { CallbacksParams } from '../../../services/api/webCrmApi';

/**
 * ============================================================================
 * MasterCallbackCalendar — the one feature-max callback cockpit
 * ============================================================================
 * Role-agnostic: the caller injects its own RTK hooks (own-scope data), so the
 * exact same screen serves Driver-Welcome and Transporter-Welcome (and any
 * future role that exposes the same callbacks contract). Features: month /
 * week / day / list views, a status filter that reaches back into resolved
 * history, the lead's full call timeline, inline SAN dialling, and
 * edit / reschedule / remove / mark-done on each pending callback.
 */

type ViewMode = 'month' | 'week' | 'day' | 'list';
type Urgency = 'overdue' | 'today' | 'upcoming';
type StatusFilter = NonNullable<CallbacksParams['status']>;

export interface MasterCallbackCalendarProps {
  /** Shown next to the lead name in the cockpit, e.g. 'DRIVER' | 'TRANSPORTER'. */
  roleLabel: string;
  /** RTK hooks, injected by the thin role wrapper. Typed loosely on purpose. */
  useCallbacksQuery: any;
  useLeadDetailQuery: any;
  useScheduleMutation: any;
  useUpdateMutation: any;
  useDeleteMutation: any;
}

// ── date helpers ────────────────────────────────────────────────────────────
const parseDt = (s?: string | null): Date | null => {
  if (!s) return null;
  const d = new Date(s.replace(' ', 'T'));
  return isNaN(d.getTime()) ? null : d;
};
const dateKey = (d: Date) => {
  const m = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
};
const startOfDay = (d: Date) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
const fmtTime = (d: Date | null) => (d ? d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '--:--');

const urgencyOf = (scheduledFor: string): Urgency => {
  const dt = parseDt(scheduledFor);
  if (!dt) return 'upcoming';
  const today = startOfDay(new Date()).getTime();
  const day = startOfDay(dt).getTime();
  if (day < today) return 'overdue';
  if (day === today) return 'today';
  return 'upcoming';
};

const CHIP: Record<Urgency, string> = {
  overdue: 'bg-red-50 border-red-500 text-red-700 hover:bg-red-100/70',
  today: 'bg-[#EAFAF1] border-[#27AE60] text-[#1E8449] hover:bg-[#d5f5e3]',
  upcoming: 'bg-blue-50 border-blue-500 text-blue-700 hover:bg-blue-100/70',
};
const PILL: Record<Urgency, string> = {
  overdue: 'bg-red-100 text-red-700',
  today: 'bg-[#EAFAF1] text-[#1E8449]',
  upcoming: 'bg-blue-100 text-blue-700',
};
const PILL_LABEL: Record<Urgency, string> = { overdue: 'Overdue', today: 'Due today', upcoming: 'Upcoming' };

const STATUS_TABS: Array<{ key: StatusFilter; label: string }> = [
  { key: 'active', label: 'Active' },
  { key: 'done', label: 'Done' },
  { key: 'cancelled', label: 'Cancelled' },
  { key: 'all', label: 'All' },
];

const statusDot = (s?: string): string => {
  switch (s) {
    case 'connected': return 'bg-[#27AE60]';
    case 'not_connected': return 'bg-red-500';
    case 'callback_later': return 'bg-amber-500';
    case 'callback_done': return 'bg-blue-500';
    case 'callback_cancelled': return 'bg-gray-400';
    default: return 'bg-gray-300';
  }
};
const fmtDuration = (secs?: number): string => {
  const s = Math.max(0, Math.floor(secs ?? 0));
  if (!s) return '—';
  const m = Math.floor(s / 60);
  return m ? `${m}m ${s % 60}s` : `${s}s`;
};

const MasterCallbackCalendar: React.FC<MasterCallbackCalendarProps> = ({
  roleLabel,
  useCallbacksQuery,
  useLeadDetailQuery,
  useScheduleMutation,
  useUpdateMutation,
  useDeleteMutation,
}) => {
  const { dial, callState, currentLeadId } = useSanCti();

  const [viewMode, setViewMode] = useState<ViewMode>('month');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('active');
  const [anchorDate, setAnchorDate] = useState<Date>(new Date());
  const [selectedEventId, setSelectedEventId] = useState<number | string>('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [listSearch, setListSearch] = useState('');
  const [confirmRemove, setConfirmRemove] = useState(false);

  const [editReason, setEditReason] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editTime, setEditTime] = useState('');

  const [showAddModal, setShowAddModal] = useState(false);
  const [searchLeadId, setSearchLeadId] = useState('');
  const [newDate, setNewDate] = useState(dateKey(new Date()));
  const [newTime, setNewTime] = useState('12:00');
  const [newNote, setNewNote] = useState('');

  const { data: callbacksResponse, isLoading, isFetching, refetch } = useCallbacksQuery({ status: statusFilter });
  const [scheduleCallback, { isLoading: isScheduling }] = useScheduleMutation();
  const [updateCallback, { isLoading: isSaving }] = useUpdateMutation();
  const [deleteCallback, { isLoading: isRemoving }] = useDeleteMutation();

  const callbacks = callbacksResponse?.data || [];

  useEffect(() => {
    if (callbacks.length > 0 && !callbacks.some((c: any) => c.id === selectedEventId)) {
      setSelectedEventId(callbacks[0].id);
    }
    if (callbacks.length === 0 && selectedEventId) setSelectedEventId('');
  }, [callbacks, selectedEventId]);

  const selectedEvent = callbacks.find((c: any) => c.id === selectedEventId);
  const selectedPending = !selectedEvent?.callback_resolution;

  useEffect(() => {
    if (selectedEvent) {
      setEditReason(selectedEvent.reason ?? '');
      setEditDate(selectedEvent.scheduled_for?.slice(0, 10) ?? '');
      setEditTime(selectedEvent.scheduled_for?.slice(11, 16) ?? '');
    }
    setConfirmRemove(false);
  }, [selectedEventId, selectedEvent?.scheduled_for, selectedEvent?.reason]);

  const { data: detailResponse } = useLeadDetailQuery(
    selectedEvent ? (selectedEvent.user_id ?? selectedEvent.id) : '',
    { skip: !selectedEvent }
  );
  const driverProfile = detailResponse?.data?.profile;
  const timeline = detailResponse?.data?.ivr_history ?? [];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const counts = useMemo(() => {
    const c = { overdue: 0, today: 0, upcoming: 0 };
    callbacks.forEach((cb: any) => { c[urgencyOf(cb.scheduled_for)]++; });
    return c;
  }, [callbacks]);

  // ── week strip ──
  const weekDates = useMemo(() => {
    const dates: Array<{ day: string; date: string; label: string; isToday: boolean }> = [];
    const base = new Date(anchorDate);
    const dow = base.getDay();
    const mondayDiff = base.getDate() - dow + (dow === 0 ? -6 : 1);
    const todayKey = dateKey(new Date());
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    for (let i = 0; i < 7; i++) {
      const d = new Date(base);
      d.setDate(mondayDiff + i);
      const key = dateKey(d);
      dates.push({ day: days[i], date: key, label: d.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }), isToday: key === todayKey });
    }
    return dates;
  }, [anchorDate]);

  // ── month grid (6 rows x 7, Mon-first) ──
  const monthCells = useMemo(() => {
    const y = anchorDate.getFullYear();
    const m = anchorDate.getMonth();
    const first = new Date(y, m, 1);
    const dow = first.getDay();
    const lead = dow === 0 ? 6 : dow - 1; // days before the 1st (Mon-first)
    const gridStart = new Date(y, m, 1 - lead);
    const todayKey = dateKey(new Date());
    const cells: Array<{ date: string; inMonth: boolean; isToday: boolean; dayNum: number }> = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      cells.push({ date: dateKey(d), inMonth: d.getMonth() === m, isToday: dateKey(d) === todayKey, dayNum: d.getDate() });
    }
    return cells;
  }, [anchorDate]);

  const weekRangeLabel = useMemo(() => {
    const first = parseDt(weekDates[0].date + ' 00:00:00')!;
    const last = parseDt(weekDates[6].date + ' 00:00:00')!;
    return `${first.toLocaleDateString('en-US', { day: 'numeric', month: 'short' })} – ${last.toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}`;
  }, [weekDates]);

  const byDay = useMemo(() => {
    const map: Record<string, any[]> = {};
    callbacks.forEach((cb: any) => {
      const k = (cb.scheduled_for ?? '').slice(0, 10);
      (map[k] = map[k] || []).push(cb);
    });
    return map;
  }, [callbacks]);

  const shift = (deltaDays: number) => {
    const d = new Date(anchorDate);
    d.setDate(d.getDate() + deltaDays);
    setAnchorDate(d);
  };
  const shiftMonth = (delta: number) => {
    const d = new Date(anchorDate);
    d.setMonth(d.getMonth() + delta);
    setAnchorDate(d);
  };
  const navPrev = () => (viewMode === 'month' ? shiftMonth(-1) : viewMode === 'week' ? shift(-7) : shift(-1));
  const navNext = () => (viewMode === 'month' ? shiftMonth(1) : viewMode === 'week' ? shift(7) : shift(1));

  // ── handlers ──
  const handleSaveNew = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchLeadId) { triggerToast('Please enter a user_id'); return; }
    try {
      await scheduleCallback({ user_id: Number(searchLeadId), reason: newNote || 'Callback scheduled', scheduled_for: `${newDate} ${newTime}` }).unwrap();
      triggerToast('Callback scheduled successfully!');
      setShowAddModal(false); setSearchLeadId(''); setNewNote('');
      setAnchorDate(parseDt(`${newDate} 00:00:00`) ?? new Date());
      if (statusFilter !== 'active' && statusFilter !== 'all') setStatusFilter('active');
      refetch();
    } catch { triggerToast('Failed to schedule. Check the id is correct.'); }
  };

  const isDirty = !!selectedEvent && (
    editReason !== (selectedEvent.reason ?? '') ||
    editDate !== (selectedEvent.scheduled_for?.slice(0, 10) ?? '') ||
    editTime !== (selectedEvent.scheduled_for?.slice(11, 16) ?? '')
  );

  const handleSaveEdit = async () => {
    if (!selectedEvent || !isDirty) return;
    try {
      await updateCallback({ id: Number(selectedEvent.id), reason: editReason, scheduled_for: `${editDate} ${editTime}` }).unwrap();
      triggerToast('Callback updated.');
      refetch();
    } catch { triggerToast('Could not save changes.'); }
  };

  const handleResolve = async (outcome: 'done' | 'cancelled') => {
    if (!selectedEvent) return;
    try {
      await deleteCallback({ id: Number(selectedEvent.id), outcome }).unwrap();
      triggerToast(outcome === 'done' ? 'Marked done.' : 'Removed from calendar.');
      setConfirmRemove(false);
      setSelectedEventId('');
      refetch();
    } catch { triggerToast('Could not update the callback.'); }
  };

  const isCalling = currentLeadId != null;
  const handleCallNow = (cb: any) => {
    if (isCalling) { triggerToast('A call is already in progress.'); return; }
    if (!cb.mobile) { triggerToast('No mobile number on this lead.'); return; }
    Promise.resolve(dial(cb.mobile, Number(cb.user_id ?? cb.id), cb.name, cb.tmid, roleLabel.toLowerCase() === 'transporter' ? 'transporter' : 'driver'))
      .catch(() => triggerToast('Could not start the call.'));
  };

  const listGroups = useMemo(() => {
    const q = listSearch.trim().toLowerCase();
    const filtered = q
      ? callbacks.filter((c: any) => [c.name, c.tmid, c.mobile, c.reason].some(v => (v ?? '').toString().toLowerCase().includes(q)))
      : callbacks;
    const groups: Record<Urgency, any[]> = { overdue: [], today: [], upcoming: [] };
    filtered.forEach((c: any) => groups[urgencyOf(c.scheduled_for)].push(c));
    return groups;
  }, [callbacks, listSearch]);

  const selectedUrgency: Urgency | null = selectedEvent ? urgencyOf(selectedEvent.scheduled_for) : null;

  const Chip: React.FC<{ cb: any; dense?: boolean }> = ({ cb, dense }) => {
    const u = urgencyOf(cb.scheduled_for);
    const resolved = !!cb.callback_resolution;
    return (
      <div
        onClick={() => setSelectedEventId(cb.id)}
        className={`p-1.5 rounded-md border-l-4 border text-[11px] cursor-pointer transition-all shadow-sm ${resolved ? 'bg-gray-50 border-gray-300 text-gray-500' : CHIP[u]} ${cb.id === selectedEventId ? 'ring-2 ring-offset-1 ring-gray-400 font-medium' : ''}`}
      >
        <div className="font-bold truncate">{cb.name}</div>
        {!dense && <div className="text-[10px] opacity-70 truncate">{cb.tmid}</div>}
        <div className="text-[10px] opacity-80 mt-0.5">{fmtTime(parseDt(cb.scheduled_for))}</div>
      </div>
    );
  };

  return (
    <main className="h-[calc(100vh-80px)] flex bg-white overflow-hidden border border-gray-200 rounded-xl relative">
      {toastMessage && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#27AE60]" />{toastMessage}
        </div>
      )}

      <section className="flex-1 flex flex-col min-w-0 border-r border-gray-200 relative">
        {/* Top bar */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 shrink-0 space-y-3">
          <div className="flex justify-between items-center gap-3 flex-wrap">
            <div className="flex items-center gap-3">
              <h2 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Callback Calendar</h2>
              {isFetching && <span className="text-[10px] text-gray-400">syncing…</span>}
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => refetch()} title="Refresh callbacks" disabled={isFetching}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 transition-colors disabled:opacity-60">
                <span className={`material-symbols-outlined text-[18px] ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
              </button>
              <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 select-none">
                {(['month', 'week', 'day', 'list'] as ViewMode[]).map(m => (
                  <button key={m} onClick={() => setViewMode(m)}
                    className={`px-2.5 py-1 text-xs font-semibold rounded capitalize transition-all ${viewMode === m ? 'bg-[#27AE60] text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                    {m === 'list' ? 'All' : m}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Status tabs + counts */}
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex bg-white border border-gray-200 rounded-lg p-0.5 select-none">
              {STATUS_TABS.map(t => (
                <button key={t.key} onClick={() => setStatusFilter(t.key)}
                  className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-all ${statusFilter === t.key ? 'bg-gray-800 text-white' : 'text-gray-500 hover:text-gray-800'}`}>
                  {t.label}
                </button>
              ))}
            </div>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${PILL.overdue}`}>{counts.overdue} overdue</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${PILL.today}`}>{counts.today} today</span>
            <span className={`px-2 py-0.5 rounded-full text-[11px] font-semibold ${PILL.upcoming}`}>{counts.upcoming} upcoming</span>
            <span className="text-gray-400 text-[11px] ml-auto">{callbacks.length} shown</span>
          </div>

          {/* Navigator */}
          {viewMode !== 'list' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button onClick={navPrev} className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100" title="Previous">
                  <span className="material-symbols-outlined text-[18px]">chevron_left</span>
                </button>
                <button onClick={() => setAnchorDate(new Date())} className="px-2.5 h-7 text-xs font-semibold rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100">Today</button>
                <button onClick={navNext} className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100" title="Next">
                  <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                </button>
              </div>
              <span className="text-xs font-bold text-gray-700">
                {viewMode === 'month'
                  ? anchorDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                  : viewMode === 'week'
                  ? weekRangeLabel
                  : anchorDate.toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
              </span>
            </div>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 overflow-y-auto p-4 min-h-0 bg-gray-50/20">
          {isLoading ? (
            <div className="p-8 text-center text-xs text-gray-500">Loading callbacks…</div>
          ) : viewMode === 'month' ? (
            <div className="bg-white border border-gray-200 rounded-xl p-2">
              <div className="grid grid-cols-7 text-center text-[10px] font-bold text-gray-400 uppercase pb-2">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => <div key={d}>{d}</div>)}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {monthCells.map(cell => {
                  const dayCbs = byDay[cell.date] || [];
                  return (
                    <div key={cell.date}
                      onClick={() => { setAnchorDate(parseDt(cell.date + ' 00:00:00')!); setViewMode('day'); }}
                      className={`min-h-[84px] rounded-lg border p-1 cursor-pointer transition-colors ${cell.isToday ? 'border-[#27AE60] ring-1 ring-[#27AE60]/20' : 'border-gray-100'} ${cell.inMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50/50 text-gray-300'}`}>
                      <div className={`text-[10px] font-bold text-right pr-0.5 ${cell.isToday ? 'text-[#27AE60]' : cell.inMonth ? 'text-gray-500' : 'text-gray-300'}`}>{cell.dayNum}</div>
                      <div className="space-y-0.5 mt-0.5">
                        {dayCbs.slice(0, 3).map((cb: any) => {
                          const u = urgencyOf(cb.scheduled_for);
                          const resolved = !!cb.callback_resolution;
                          return (
                            <div key={cb.id} onClick={e => { e.stopPropagation(); setSelectedEventId(cb.id); }}
                              className={`truncate text-[9px] px-1 py-0.5 rounded border-l-2 ${resolved ? 'bg-gray-100 border-gray-300 text-gray-500' : CHIP[u]} ${cb.id === selectedEventId ? 'ring-1 ring-gray-400' : ''}`}>
                              {fmtTime(parseDt(cb.scheduled_for))} {cb.name}
                            </div>
                          );
                        })}
                        {dayCbs.length > 3 && <div className="text-[9px] text-gray-400 pl-1">+{dayCbs.length - 3} more</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : viewMode === 'week' ? (
            <div className="grid grid-cols-7 gap-3 h-full min-h-[400px]">
              {weekDates.map(col => {
                const dayCbs = byDay[col.date] || [];
                return (
                  <div key={col.date} className={`rounded-xl border flex flex-col p-2 bg-white min-h-[360px] transition-colors ${col.isToday ? 'border-[#27AE60] ring-1 ring-[#27AE60]/20' : 'border-gray-200'}`}>
                    <div className="text-center pb-2 mb-2 border-b border-gray-100">
                      <span className="block text-[10px] text-gray-400 font-bold uppercase">{col.day}</span>
                      <span className={`inline-block text-xs font-bold px-1.5 py-0.5 rounded-full mt-0.5 ${col.isToday ? 'bg-[#27AE60] text-white' : 'text-gray-700'}`}>{col.isToday ? 'Today' : col.label}</span>
                    </div>
                    <div className="flex-grow space-y-2 overflow-y-auto min-h-0 pb-2">
                      {dayCbs.map((cb: any) => <Chip key={cb.id} cb={cb} dense />)}
                      {dayCbs.length === 0 && <div className="text-[10px] text-gray-300 text-center pt-4 italic">—</div>}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : viewMode === 'day' ? (
            <div className="bg-white border border-gray-200 rounded-xl p-4 min-h-[500px] max-w-3xl mx-auto">
              {(() => {
                const dayCbs = (byDay[dateKey(anchorDate)] || []).slice().sort((a, b) => (a.scheduled_for > b.scheduled_for ? 1 : -1));
                return (
                  <>
                    <div className="text-xs font-bold text-gray-500 mb-4 flex justify-between"><span>Callbacks for this day</span><span className="text-[#27AE60]">{dayCbs.length} scheduled</span></div>
                    <div className="relative pl-16 space-y-3 before:absolute before:left-14 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                      {dayCbs.map((cb: any) => {
                        const u = urgencyOf(cb.scheduled_for);
                        const resolved = !!cb.callback_resolution;
                        return (
                          <div key={cb.id} className="relative">
                            <span className="absolute -left-16 top-2 text-[10px] font-bold text-gray-400 w-10 text-right">{fmtTime(parseDt(cb.scheduled_for))}</span>
                            <div onClick={() => setSelectedEventId(cb.id)}
                              className={`p-3 rounded-lg border-l-4 border text-xs cursor-pointer shadow-sm ${resolved ? 'bg-gray-50 border-gray-300 text-gray-600' : CHIP[u]} ${cb.id === selectedEventId ? 'ring-2 ring-offset-1 ring-gray-400 font-medium' : ''}`}>
                              <div className="font-bold text-sm">{cb.name} <span className="opacity-60 font-normal">({cb.tmid})</span></div>
                              <div className="text-[11px] opacity-90 mt-1 truncate">{cb.reason || 'No remarks'}</div>
                            </div>
                          </div>
                        );
                      })}
                      {dayCbs.length === 0 && <div className="text-gray-300 text-xs italic pl-2 py-4">No callbacks scheduled for this day.</div>}
                    </div>
                  </>
                );
              })()}
            </div>
          ) : (
            <div className="max-w-3xl mx-auto space-y-5">
              <div className="relative">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-[18px]">search</span>
                <input value={listSearch} onChange={e => setListSearch(e.target.value)} placeholder="Search callbacks by name, TMID, mobile or note…"
                  className="w-full border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-xs outline-none focus:border-[#27AE60]" />
              </div>
              {(['overdue', 'today', 'upcoming'] as Urgency[]).map(group => (
                <div key={group}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${PILL[group]}`}>{PILL_LABEL[group]}</span>
                    <span className="text-[11px] text-gray-400">{listGroups[group].length}</span>
                    <div className="flex-1 h-px bg-gray-100" />
                  </div>
                  <div className="space-y-2">
                    {listGroups[group].map((cb: any) => {
                      const dt = parseDt(cb.scheduled_for);
                      const resolved = !!cb.callback_resolution;
                      return (
                        <div key={cb.id} onClick={() => setSelectedEventId(cb.id)}
                          className={`flex items-center gap-3 p-3 rounded-lg border text-xs cursor-pointer bg-white transition-all hover:shadow-sm ${cb.id === selectedEventId ? 'border-[#27AE60] ring-1 ring-[#27AE60]/30' : 'border-gray-200'}`}>
                          <div className="min-w-0 flex-1">
                            <div className="font-bold text-gray-800 truncate">{cb.name} <span className="text-gray-400 font-normal">· {cb.tmid}</span>
                              {resolved && <span className="ml-1 text-[9px] font-bold uppercase text-gray-400">{cb.callback_resolution}</span>}
                            </div>
                            <div className="text-[11px] text-gray-500 truncate">{cb.reason || 'No remarks'}</div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="font-semibold text-gray-700">{dt ? dt.toLocaleDateString('en-US', { day: 'numeric', month: 'short' }) : '—'}</div>
                            <div className="text-[10px] text-gray-400">{fmtTime(dt)}</div>
                          </div>
                        </div>
                      );
                    })}
                    {listGroups[group].length === 0 && <div className="text-[11px] text-gray-300 italic pl-1">None</div>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button onClick={() => setShowAddModal(true)} title="Add Callback"
          className="absolute right-4 bottom-4 w-12 h-12 bg-[#27AE60] hover:bg-[#219653] text-white rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 z-20">
          <span className="material-symbols-outlined text-2xl font-bold">add</span>
        </button>
      </section>

      {/* Cockpit */}
      <section className="w-[360px] bg-white flex flex-col shrink-0 overflow-hidden">
        {selectedEvent ? (
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="p-4 border-b border-gray-100">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-bold text-gray-800 text-base truncate">{selectedEvent.name}</h3>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">{selectedEvent.tmid} · {roleLabel}</p>
                  {selectedEvent.city && <p className="text-xs text-gray-400 mt-1">{selectedEvent.city}</p>}
                </div>
                {selectedPending
                  ? selectedUrgency && <span className={`text-[10px] font-bold px-2 py-1 rounded-full shrink-0 ${PILL[selectedUrgency]}`}>{PILL_LABEL[selectedUrgency]}</span>
                  : <span className="text-[10px] font-bold px-2 py-1 rounded-full shrink-0 bg-gray-100 text-gray-500">{selectedEvent.callback_resolution === 'done' ? 'Done' : 'Cancelled'}</span>}
              </div>
            </div>

            <div className="p-4 space-y-4 overflow-y-auto flex-1 text-xs">
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-150 space-y-2">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Lead Details</div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div><span className="text-gray-400 block">Mobile:</span><span className="font-bold text-gray-700">**********</span></div>
                  <div><span className="text-gray-400 block">Vehicle Type:</span><span className="font-bold text-gray-700">{driverProfile?.vehicle_type || 'N/A'}</span></div>
                </div>
              </div>

              {selectedPending ? (
                <>
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Callback Note</div>
                    <textarea value={editReason} onChange={e => setEditReason(e.target.value)} rows={3} placeholder="Add remarks for this callback…"
                      className="w-full bg-[#FFF9E6] border border-[#F2C94C] p-3 rounded-lg text-gray-700 text-xs outline-none resize-none focus:border-[#e0b93b]" />
                  </div>
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Reschedule</div>
                    <div className="grid grid-cols-2 gap-2">
                      <input type="date" value={editDate} onChange={e => setEditDate(e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-[#27AE60]" />
                      <input type="time" value={editTime} onChange={e => setEditTime(e.target.value)} className="w-full border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-[#27AE60]" />
                    </div>
                    <button onClick={handleSaveEdit} disabled={!isDirty || isSaving}
                      className={`w-full h-9 rounded-lg font-bold text-xs transition-all ${isDirty && !isSaving ? 'bg-[#2D9CDB] hover:bg-[#2589c4] text-white shadow-sm' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                      {isSaving ? 'Saving…' : 'Save Changes'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="space-y-1.5">
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Callback Note</div>
                  <div className="bg-gray-50 border border-gray-200 p-3 rounded-lg text-gray-600 text-xs italic">"{selectedEvent.reason || 'No remarks'}"</div>
                  <div className="text-[10px] text-gray-400">Scheduled for {new Date((selectedEvent.scheduled_for || '').replace(' ', 'T')).toLocaleString()}</div>
                </div>
              )}

              {/* Full call timeline */}
              <div className="space-y-1.5">
                <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider flex items-center justify-between">
                  <span>Call Timeline</span><span className="text-gray-300">{timeline.length} calls</span>
                </div>
                {timeline.length === 0 ? (
                  <div className="text-[11px] text-gray-300 italic py-1">No calls logged yet.</div>
                ) : (
                  <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
                    {timeline.map((row: any) => (
                      <div key={row.id} className="border border-gray-150 rounded-lg p-2 bg-white">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full shrink-0 ${statusDot(row.call_status)}`} />
                          <span className="font-semibold text-gray-700 truncate">{row.call_feedback || row.call_status || 'Call'}</span>
                          <span className="ml-auto text-[10px] text-gray-400 shrink-0">{fmtDuration(row.active_time)}</span>
                        </div>
                        {row.call_remarks && <div className="text-[11px] text-gray-500 mt-1 line-clamp-2">{row.call_remarks}</div>}
                        <div className="flex items-center gap-2 mt-1 text-[10px] text-gray-400">
                          <span>{new Date((row.created_at || '').replace(' ', 'T')).toLocaleString()}</span>
                          {row.assigned_name && <span className="truncate">· {row.assigned_name}</span>}
                          {row.recording_url && (
                            <a href={row.recording_url} target="_blank" rel="noreferrer" onClick={e => e.stopPropagation()}
                              className="ml-auto text-[#2D9CDB] font-semibold hover:underline flex items-center gap-0.5 shrink-0">
                              <span className="material-symbols-outlined text-[13px]">play_circle</span> Play
                            </a>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="p-4 border-t border-gray-150 bg-white space-y-2">
              <button onClick={() => handleCallNow(selectedEvent)} disabled={isCalling}
                className={`w-full h-11 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-transform active:scale-95 ${isCalling ? 'bg-gray-300 text-white cursor-not-allowed' : 'bg-[#27AE60] hover:bg-[#219653] text-white'}`}>
                <span className="material-symbols-outlined text-[18px]">{isCalling ? 'call' : 'phone'}</span>
                {isCalling ? (String(currentLeadId) === String(selectedEvent.user_id ?? selectedEvent.id) ? `On call — ${callState || 'active'}` : 'Line busy') : 'Call Now'}
              </button>
              {selectedPending && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => handleResolve('done')} disabled={isRemoving}
                      className="h-9 rounded-lg font-bold text-xs flex items-center justify-center gap-1 border border-[#27AE60] text-[#1E8449] hover:bg-[#EAFAF1] transition-colors">
                      <span className="material-symbols-outlined text-[16px]">task_alt</span> Mark Done
                    </button>
                    {confirmRemove ? (
                      <button onClick={() => handleResolve('cancelled')} disabled={isRemoving}
                        className="h-9 rounded-lg font-bold text-xs flex items-center justify-center gap-1 bg-red-600 hover:bg-red-700 text-white transition-colors">
                        {isRemoving ? 'Removing…' : 'Confirm remove'}
                      </button>
                    ) : (
                      <button onClick={() => setConfirmRemove(true)}
                        className="h-9 rounded-lg font-bold text-xs flex items-center justify-center gap-1 border border-red-300 text-red-600 hover:bg-red-50 transition-colors">
                        <span className="material-symbols-outlined text-[16px]">event_busy</span> Remove
                      </button>
                    )}
                  </div>
                  {confirmRemove && <button onClick={() => setConfirmRemove(false)} className="w-full text-[11px] text-gray-400 hover:text-gray-600">Cancel</button>}
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="flex-grow flex items-center justify-center p-6 text-center text-gray-400 italic text-xs">
            Select a callback to view the lead, its full call timeline, and edit, reschedule, dial or remove it.
          </div>
        )}
      </section>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-sm w-full p-5 shadow-xl border border-gray-100">
            <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wider mb-4">Add Callback Event</h3>
            <form onSubmit={handleSaveNew} className="space-y-4 text-xs">
              <div>
                <label className="text-gray-500 block mb-1 font-semibold">Lead ID (user_id)</label>
                <input type="number" value={searchLeadId} onChange={e => setSearchLeadId(e.target.value)} placeholder="e.g. 1080" required
                  className="w-full border border-gray-200 rounded px-2.5 py-1.5 outline-none font-semibold text-gray-800 focus:border-[#27AE60]" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div><label className="text-gray-500 block mb-1 font-semibold">Date</label>
                  <input type="date" value={newDate} onChange={e => setNewDate(e.target.value)} required className="w-full border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-[#27AE60]" /></div>
                <div><label className="text-gray-500 block mb-1 font-semibold">Time</label>
                  <input type="time" value={newTime} onChange={e => setNewTime(e.target.value)} required className="w-full border border-gray-200 rounded px-2 py-1.5 outline-none focus:border-[#27AE60]" /></div>
              </div>
              <div><label className="text-gray-500 block mb-1 font-semibold">Remarks</label>
                <textarea value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Callback reason…" rows={2} className="w-full border border-gray-200 rounded px-2.5 py-1.5 outline-none resize-none focus:border-[#27AE60]" /></div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 border border-gray-200 text-gray-500 rounded font-bold hover:bg-gray-100 transition-colors">Cancel</button>
                <button type="submit" disabled={isScheduling} className="px-4 py-2 bg-[#27AE60] hover:bg-[#219653] text-white rounded font-bold transition-all shadow-sm disabled:opacity-60">{isScheduling ? 'Saving…' : 'Save Schedule'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default MasterCallbackCalendar;
