import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { usePermissions } from '../../shared/hooks/usePermissions';
import { routeConfig } from '../../routes/routeConfig';
import type { RouteItem } from '../../routes/routeConfig';
import { ROLE_LABELS } from '../../shared/constants/roles';
import { useGetDwQueueCountsQuery, useGetWctQueueCountsQuery } from '../../services/api/webCrmApi';
import useCrmTheme from '../../shared/theme/useCrmTheme';
import AshokaChakra from '../../shared/components/AshokaChakra';
import ChakraMedallion from '../../shared/components/ChakraMedallion';
import sidebarBg from '../../assets/theme/sidebar_bg.jpg';
import useDarkMode from '../../shared/theme/useDarkMode';

/**
 * The rail's festive backdrop, for every role — the Sidebar is shared, so this
 * one style covers all ten desks.
 *
 * Two background layers on the aside itself rather than an absolutely-positioned
 * image behind the nav: a positioned layer would paint OVER the static nav links
 * (positioned elements win the paint order), which would have meant adding
 * z-index bookkeeping to every block in here.
 *
 * The veil strength is measured, not guessed: the rail is composited exactly as
 * the browser renders it (cover fit, left-bottom anchor) and the nav label
 * colour is tested against every pixel behind it.
 *
 * Getting the art to read clearly took three moves together, because simply
 * thinning the veil pushed the labels under the 4.5:1 AA floor:
 *   1. the asset itself is saturated (+55% colour), which reads clearer at the
 *      same lightness and so costs the text nothing;
 *   2. the labels went slate-600 → slate-700, buying ~1.7:1 of headroom;
 *   3. only then could the veil drop to 0.74→0.58.
 * That lands at 4.99:1 worst case, over the tree line behind the profile block.
 * Thinning it further (0.70→0.52) falls to 4.43:1 and fails.
 *
 * Anchored `left bottom`: the rail is far narrower than the artwork, so cover
 * crops horizontally — anchoring left keeps the silk and the monuments instead
 * of centring on empty sky.
 */
const FESTIVE_RAIL: React.CSSProperties = {
  backgroundImage:
    'linear-gradient(180deg, rgba(255,255,255,0.74) 0%, rgba(255,255,255,0.66) 45%, rgba(255,255,255,0.58) 100%),' +
    `url(${sidebarBg})`,
  backgroundSize: 'cover, cover',
  backgroundPosition: 'center, left bottom',
  backgroundRepeat: 'no-repeat, no-repeat',
};

export const Sidebar: React.FC<{ hidden?: boolean }> = ({ hidden = false }) => {
  const { isTricolor: IS_TRICOLOR_THEME, greetingHi, greetingEn } = useCrmTheme();
  const location = useLocation();
  const { logout } = useAuth();
  const { isDark, toggle: toggleTheme } = useDarkMode();
  const { role, can } = usePermissions();

  const isWctAgent = !!role && (role.includes('WCT') || role.includes('Transporter'));
  const isDwAgent = !!role && (role.includes('DW') || role.includes('Welcome')) && !isWctAgent;

  const { data: dwQueueCounts } = useGetDwQueueCountsQuery(undefined, {
    skip: !isDwAgent,
    refetchOnMountOrArgChange: true,
  });
  const { data: wctQueueCounts } = useGetWctQueueCountsQuery(undefined, {
    skip: !isWctAgent,
    refetchOnMountOrArgChange: true,
  });

  const menuItems = (routeConfig as RouteItem[]).filter(
    (item: RouteItem) => item.showInMenu && role && item.role.toUpperCase() === role.toUpperCase() && (!item.permission || can(item.permission))
  );

  const getInitials = (roleName: string) => {
    return roleName.slice(0, 2).toUpperCase();
  };

  const dwFreshCount = dwQueueCounts?.data?.fresh ?? 0;
  const wctFreshCount = wctQueueCounts?.data?.fresh ?? 0;

  return (
    <aside
      className={`w-[240px] h-screen fixed left-0 top-0 border-r ${IS_TRICOLOR_THEME ? 'border-amber-500/25 shadow-lg' : 'border-outline-variant bg-white'} flex flex-col py-md px-sm z-50 transition-transform duration-300 ${hidden ? '-translate-x-full' : 'translate-x-0'}`}
      style={IS_TRICOLOR_THEME ? FESTIVE_RAIL : undefined}
    >
      
      {/* ── Brand Header ── */}
      <div className="mb-md px-sm relative">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="font-headline-md text-headline-md font-black tracking-tight text-[#0B3D91]">TruckMitr</h1>
              {IS_TRICOLOR_THEME && <AshokaChakra size={16} className="shrink-0 text-[#17376B] animate-spin-slow" />}
            </div>
            <p className="text-[9.5px] uppercase tracking-wider text-slate-500 font-extrabold">Internal Connect CRM</p>
          </div>

          {/* Struck-coin emblem — drawn, so it stays sharp at every zoom */}
          {IS_TRICOLOR_THEME && (
            <ChakraMedallion size={36} className="drop-shadow-sm transition-transform duration-300 hover:scale-105" />
          )}
        </div>

        {/* Independence Day Greeting Badge */}
        {IS_TRICOLOR_THEME && (
          <div className="mt-2.5 p-2 rounded-xl bg-gradient-to-r from-amber-500/15 via-white to-emerald-500/15 border border-amber-500/30 shadow-xs relative overflow-hidden">
            <span className="block h-[3px] w-full bg-gradient-to-r from-[#FF9933] via-white to-[#138808] rounded-full mb-1" />
            <div className="flex items-center justify-between">
              <p className="font-hindi text-[10.5px] font-extrabold leading-tight text-amber-900">
                {greetingHi}
              </p>
              <AshokaChakra size={13} className="shrink-0 animate-spin-slow text-[#17376B]" />
            </div>
            <p className="text-[8px] uppercase tracking-[0.2em] text-[#0B3D91] font-extrabold mt-0.5 leading-tight">
              {greetingEn}
            </p>
          </div>
        )}
      </div>

      {/* ── Navigation Menu ── */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item: RouteItem) => {
          const isActive = location.pathname === item.path;
          let displayName = item.name;
          let badge: React.ReactNode = null;

          if (item.path === '/dw/dw-call-queue') {
            displayName = 'My Queue';
            badge = (
              <span className="ml-auto px-2 py-0.5 text-[10px] font-black bg-amber-500/20 text-[#0B3D91] border border-amber-500/30 rounded-full">
                {dwFreshCount}
              </span>
            );
          } else if (item.path === '/wct/wct-call-queue') {
            displayName = 'My Queue';
            badge = (
              <span className="ml-auto px-2 py-0.5 text-[10px] font-black bg-amber-500/20 text-[#0B3D91] border border-amber-500/30 rounded-full">
                {wctFreshCount}
              </span>
            );
          } else if (item.path === '/dw/dw-campaign-leads' || item.path === '/wct/wct-campaign-leads') {
            displayName = 'Campaign Leads';
            badge = null;
          }

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? IS_TRICOLOR_THEME
                    ? 'text-[#0B3D91] font-black bg-gradient-to-r from-amber-500/20 via-amber-500/10 to-transparent border-l-4 border-[#138808] shadow-xs'
                    : 'text-primary font-bold border-r-4 border-primary bg-surface-container-high shadow-2xs'
                  : 'text-slate-700 font-semibold hover:bg-amber-500/10 hover:text-[#0B3D91]'
              }`}
            >
              {item.icon && (
                <span className={`material-symbols-outlined text-[20px] ${isActive && IS_TRICOLOR_THEME ? 'text-[#FF9933]' : 'text-slate-500'}`}>{item.icon}</span>
              )}
              <span className="text-xs flex-1 truncate">{displayName}</span>
              {badge}
            </Link>
          );
        })}
      </nav>

      {/* The drawn firework that used to sit here is gone — the rail's backdrop
          now carries its own fireworks, and the two stacked in the same corner
          on top of the tree line. */}

      {/* ── User Profile & Logout ── */}
      <div className={`mt-auto border-t ${IS_TRICOLOR_THEME ? 'border-amber-500/20' : 'border-outline-variant'} pt-md space-y-md relative z-10`}>
        {role && (
          <div className="flex items-center gap-3 px-sm">
            <div className={`w-8 h-8 rounded-full ${IS_TRICOLOR_THEME ? 'bg-[#0B3D91] text-white ring-2 ring-amber-500/40 shadow-xs' : 'bg-primary text-white'} flex items-center justify-center font-bold text-xs select-none`}>
              {getInitials(role)}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-black text-slate-900 truncate leading-none mb-0.5">
                {ROLE_LABELS[role]}
              </p>
              <p className="text-[10px] text-amber-800 font-extrabold uppercase leading-none">{role}</p>
            </div>
          </div>
        )}

        {/* Theme toggle — above Sign Out, the two "settings for me" actions
            together. Deliberately not in a settings page: an agent flips this
            when the light changes in the room, not once during onboarding. */}
        <button
          onClick={toggleTheme}
          aria-pressed={isDark}
          title={isDark ? 'Switch to light theme' : 'Switch to dark theme'}
          className="w-full flex items-center gap-3 px-sm py-2 rounded-lg text-slate-700 hover:bg-amber-500/10 font-bold transition-colors text-left text-xs"
        >
          <span className="material-symbols-outlined text-[18px]">
            {isDark ? 'light_mode' : 'dark_mode'}
          </span>
          <span className="flex-1">{isDark ? 'Light Mode' : 'Dark Mode'}</span>
          {/* A switch, not just a label: the state has to be readable at a
              glance without parsing which way round the wording runs. */}
          <span
            className={`w-8 h-4 rounded-full flex items-center px-0.5 transition-colors shrink-0 ${
              isDark ? 'bg-emerald-500 justify-end' : 'bg-slate-300 justify-start'
            }`}
          >
            <span className="w-3 h-3 rounded-full bg-white shadow-sm" />
          </span>
        </button>

        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-sm py-2 rounded-lg text-red-600 hover:bg-red-50 font-bold transition-colors text-left text-xs"
        >
          <span className="material-symbols-outlined text-[18px]">logout</span>
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
