import React, { useState } from 'react';
import {
  useGetCrmThemesQuery,
  useActivateCrmThemeMutation,
  type CrmThemeRow,
} from '../../services/api/webCrmApi';
import { refreshCrmTheme } from '../../shared/theme/crmTheme';
import ChakraMedallion from '../../shared/components/ChakraMedallion';

// ── CRM Theme Switcher ────────────────────────────────────────────────────────
// Route: /crm/theme
// Standalone, no login and no dashboard chrome — same arrangement as
// /crm/web-roles. Lists every theme in the `crm_theme` table, ticks the one
// actually being served, and switches between them.
// Backed by GET /web-crm/themes and POST /web-crm/themes/{id}/activate.

const fmtDate = (d?: string | null) =>
  d
    ? new Date(d).toLocaleString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit',
      })
    : null;

/** A theme's own colours, so the card previews what it will actually look like. */
const swatchesFor = (theme: CrmThemeRow): string[] => {
  const palette = theme.palette || {};
  const values = Object.values(palette).filter((v) => typeof v === 'string' && v.startsWith('#'));
  if (values.length) return values.slice(0, 7);
  // The default skin keeps its colours in the Tailwind config, not the row.
  return theme.slug === 'default' ? ['#FB641B', '#27AE60', '#8E44AD', '#F39C12', '#0056C3'] : [];
};

const ThemeCard: React.FC<{
  theme: CrmThemeRow;
  onActivated: (msg: string) => void;
  onError: (msg: string) => void;
}> = ({ theme, onActivated, onError }) => {
  const [activate, { isLoading }] = useActivateCrmThemeMutation();
  const [clearSchedule, setClearSchedule] = useState(true);

  const swatches = swatchesFor(theme);
  const starts = fmtDate(theme.starts_at);
  const ends = fmtDate(theme.ends_at);
  const scheduled = !!(theme.starts_at || theme.ends_at);

  // A theme can hold the is_active flag while a DIFFERENT theme's schedule is
  // actually on screen. Saying so beats showing two contradictory ticks.
  const flaggedButNotLive = theme.is_active && !theme.is_live;

  const go = async () => {
    try {
      const res = await activate({ id: theme.id, clear_schedule: clearSchedule }).unwrap();
      onActivated(res?.message || `${theme.name} is now live.`);
      // Repaint this page immediately instead of waiting for a reload.
      await refreshCrmTheme();
    } catch (e: any) {
      onError(e?.data?.message || 'Could not switch the theme.');
    }
  };

  return (
    <div
      className={`relative rounded-2xl border bg-white p-4 transition-all ${
        theme.is_live
          ? 'border-emerald-400 shadow-[0_0_0_3px_rgba(16,185,129,0.15)]'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
      }`}
    >
      {theme.is_live && (
        <span className="absolute -top-2.5 right-4 inline-flex items-center gap-1 rounded-full bg-emerald-500 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-white shadow-sm">
          <span className="material-symbols-outlined text-[13px]">check_circle</span>
          Live now
        </span>
      )}

      <div className="flex items-start gap-3">
        {theme.slug === 'tricolor' ? (
          <ChakraMedallion size={40} />
        ) : (
          <div className="h-10 w-10 shrink-0 rounded-full border border-gray-200 bg-gradient-to-br from-[#FB641B] via-[#F39C12] to-[#8E44AD]" />
        )}

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-black text-gray-900">{theme.name}</h3>
            <code className="rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-bold text-gray-500">{theme.slug}</code>
          </div>
          {theme.description && (
            <p className="mt-0.5 text-[11px] leading-snug text-gray-500">{theme.description}</p>
          )}
        </div>
      </div>

      {swatches.length > 0 && (
        <div className="mt-3 flex items-center gap-1.5">
          {swatches.map((c) => (
            <span
              key={c}
              title={c}
              className="h-5 w-5 rounded-full border border-black/10 shadow-sm"
              style={{ backgroundColor: c }}
            />
          ))}
        </div>
      )}

      <div className="mt-3 space-y-1 border-t border-gray-100 pt-2.5 text-[11px]">
        {scheduled ? (
          <p className="flex items-center gap-1.5 text-gray-600">
            <span className="material-symbols-outlined text-[14px] text-indigo-500">event</span>
            <span>
              Scheduled {starts || '—'} → {ends || 'no end'}
            </span>
          </p>
        ) : (
          <p className="flex items-center gap-1.5 text-gray-400">
            <span className="material-symbols-outlined text-[14px]">event_busy</span>
            No schedule — switched manually
          </p>
        )}

        {flaggedButNotLive && (
          <p className="flex items-start gap-1.5 rounded-md bg-amber-50 px-2 py-1 text-amber-800">
            <span className="material-symbols-outlined text-[14px]">info</span>
            <span>Marked active, but another theme's schedule is on screen right now.</span>
          </p>
        )}

        {theme.updated_by && <p className="text-gray-400">Last changed by {theme.updated_by}</p>}
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <label className="flex cursor-pointer items-center gap-1.5 text-[10.5px] font-semibold text-gray-500">
          <input
            type="checkbox"
            checked={clearSchedule}
            onChange={(e) => setClearSchedule(e.target.checked)}
            className="h-3.5 w-3.5 accent-emerald-600"
          />
          Clear its schedule
        </label>

        <button
          onClick={go}
          disabled={isLoading || theme.is_live}
          className={`rounded-lg px-3.5 py-1.5 text-[11px] font-black transition-transform active:scale-95 disabled:cursor-not-allowed ${
            theme.is_live
              ? 'bg-emerald-50 text-emerald-600'
              : 'bg-gray-900 text-white hover:bg-black disabled:opacity-50'
          }`}
        >
          {theme.is_live ? 'Currently applied' : isLoading ? 'Switching…' : 'Make this live'}
        </button>
      </div>
    </div>
  );
};

export const CrmThemeSwitcher: React.FC = () => {
  const { data, isLoading, isFetching, refetch } = useGetCrmThemesQuery();
  const [toast, setToast] = useState<{ text: string; ok: boolean } | null>(null);

  const themes = data?.data || [];
  const live = themes.find((t) => t.is_live);

  const flash = (text: string, ok: boolean) => {
    setToast({ text, ok });
    setTimeout(() => setToast(null), 3500);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6">
      {toast && (
        <div
          className={`fixed left-1/2 top-4 z-50 -translate-x-1/2 rounded-lg px-4 py-2 text-xs font-bold text-white shadow-lg ${
            toast.ok ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.text}
        </div>
      )}

      <div className="mx-auto w-full max-w-5xl">
        <header className="mb-5 flex flex-col gap-3 border-b border-gray-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">TruckMitr Internal Connect CRM</p>
            <h1 className="mt-0.5 text-2xl font-black tracking-tight text-gray-900">CRM Theme</h1>
            <p className="mt-1 text-xs text-gray-500">
              The skin every role sees. Served from the <code className="rounded bg-gray-100 px-1 py-0.5 font-bold">crm_theme</code> table —
              switching takes effect on each agent's next page load, with no rebuild.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {live && (
              <span className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2.5 py-1.5 text-[11px] font-bold text-emerald-700">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-500" />
                Live: {live.name}
              </span>
            )}
            <button
              onClick={() => refetch()}
              className="flex items-center gap-1 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-[11px] font-bold text-gray-600 hover:bg-gray-50"
            >
              <span className={`material-symbols-outlined text-[14px] ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
              Refresh
            </button>
          </div>
        </header>

        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-56 rounded-2xl bg-gray-100 tm-shimmer" />
            ))}
          </div>
        ) : themes.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white py-16 text-center text-sm text-gray-400">
            No themes on file. Run the <code>crm_theme</code> migration to seed the default and tricolour skins.
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {themes.map((t) => (
              <ThemeCard
                key={t.id}
                theme={t}
                onActivated={(m) => flash(m, true)}
                onError={(m) => flash(m, false)}
              />
            ))}
          </div>
        )}

        <p className="mt-5 flex items-start gap-1.5 text-[11px] leading-relaxed text-gray-400">
          <span className="material-symbols-outlined text-[14px]">schedule</span>
          <span>
            A theme with a schedule wins over the manual switch for as long as its window is open — that is what lets the
            Independence Day skin turn itself off afterwards. Untick <b>Clear its schedule</b> to keep a window in place
            while still switching now.
          </span>
        </p>
      </div>
    </div>
  );
};

export default CrmThemeSwitcher;
