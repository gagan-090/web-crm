import { useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { exportToExcel, type ExcelColumn } from '../utils/exportExcel';

/**
 * Export-to-Excel button for the Call History screens, gated to an allowlist of
 * agents (by login name). Add a name to EXPORT_ALLOWED_NAMES to grant it.
 *
 * Opens a small From / To date picker, then calls `fetchAll(range)` — the screen
 * fetches the WHOLE filtered log for that range (per_page=all), not just the
 * page on screen — and downloads it as one .xls. Leaving both dates blank
 * exports all time.
 */
const EXPORT_ALLOWED_NAMES = ['harshit', 'raksha'];

interface Props<T> {
  /** Fetch every row for the chosen range (bypassing pagination). */
  fetchAll: (range: { date_from?: string; date_to?: string }) => Promise<T[]>;
  columns: ExcelColumn<T>[];
  filename: string;
  label?: string;
}

export function HarshitExcelExport<T>({ fetchAll, columns, filename, label = 'Export to Excel' }: Props<T>) {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (!EXPORT_ALLOWED_NAMES.includes((user?.name || '').trim().toLowerCase())) return null;

  const invalid = !!from && !!to && from > to;

  const download = async () => {
    if (invalid || busy) return;
    setBusy(true);
    setMsg(null);
    try {
      const rows = await fetchAll({ date_from: from || undefined, date_to: to || undefined });
      if (!rows || rows.length === 0) {
        setMsg('No records for this range.');
        return;
      }
      const span = from || to ? `_${from || 'start'}_to_${to || 'today'}` : '_all';
      exportToExcel(`${filename}${span}_${new Date().toISOString().slice(0, 10)}`, columns, rows);
      setOpen(false);
    } catch {
      setMsg('Export failed. Please try again.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={() => { setOpen(o => !o); setMsg(null); }}
        title="Export the full call history to Excel"
        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm active:scale-95 transition-transform"
      >
        <span className="material-symbols-outlined text-[16px]">download</span>
        {label}
        <span className="material-symbols-outlined text-[16px]">{open ? 'expand_less' : 'expand_more'}</span>
      </button>

      {open && (
        <>
          {/* click-away */}
          <div className="fixed inset-0 z-[59]" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl z-[60] p-4">
            <div className="text-[11px] font-black uppercase tracking-wider text-gray-500 mb-2">Download call history</div>

            <div className="grid grid-cols-2 gap-2">
              <label className="text-[10px] font-bold text-gray-500 flex flex-col gap-1">
                From
                <input type="date" value={from} max={to || undefined} onChange={e => setFrom(e.target.value)}
                  className="h-9 border border-gray-200 rounded-lg px-2 text-xs outline-none focus:border-emerald-500" />
              </label>
              <label className="text-[10px] font-bold text-gray-500 flex flex-col gap-1">
                To
                <input type="date" value={to} min={from || undefined} onChange={e => setTo(e.target.value)}
                  className="h-9 border border-gray-200 rounded-lg px-2 text-xs outline-none focus:border-emerald-500" />
              </label>
            </div>

            {invalid && <p className="text-[10px] text-rose-600 font-semibold mt-1.5">“From” must be on or before “To”.</p>}
            <p className="text-[10px] text-gray-400 mt-1.5">Leave both blank to export the complete log (all dates).</p>

            {(from || to) && (
              <button onClick={() => { setFrom(''); setTo(''); }} className="mt-1 text-[10px] font-bold text-gray-500 hover:text-gray-700 underline">
                Clear dates (all time)
              </button>
            )}

            {msg && <p className="text-[10px] font-semibold text-amber-600 mt-2">{msg}</p>}

            <button
              onClick={download}
              disabled={busy || invalid}
              className="mt-3 w-full h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-xs font-black flex items-center justify-center gap-1.5"
            >
              {busy ? (
                <><span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span> Preparing…</>
              ) : (
                <><span className="material-symbols-outlined text-[16px]">download</span> Download Excel</>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default HarshitExcelExport;
