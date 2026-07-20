import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { usePermissions } from '../../shared/hooks/usePermissions';
import { routeConfig } from '../../routes/routeConfig';
import type { RouteItem } from '../../routes/routeConfig';
import { ROLE_LABELS } from '../../shared/constants/roles';
import { useGetDwQueueCountsQuery, useGetWctQueueCountsQuery } from '../../services/api/webCrmApi';

export const Sidebar: React.FC<{ hidden?: boolean }> = ({ hidden = false }) => {
  const location = useLocation();
  const { logout } = useAuth();
  const { role, can } = usePermissions();

  // 'Transporter Welcome' also contains 'Welcome', so detect WCT first and
  // exclude it from the DW check.
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
    <aside className={`w-[240px] h-screen fixed left-0 top-0 border-r border-outline-variant bg-white flex flex-col py-md px-sm z-50 transition-transform duration-300 ${hidden ? '-translate-x-full' : 'translate-x-0'}`}>
      {/* Brand Header */}
      <div className="mb-lg px-sm">
        <h1 className="font-headline-md text-headline-md font-extrabold text-primary">TruckMitr</h1>
        <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Internal Connect CRM</p>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {menuItems.map((item: RouteItem) => {
          const isActive = location.pathname === item.path;
          let displayName = item.name;
          let badge: React.ReactNode = null;

          if (item.path === '/dw/dw-call-queue') {
            displayName = 'My Queue';
            badge = (
              <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">
                {dwFreshCount}
              </span>
            );
          } else if (item.path === '/wct/wct-call-queue') {
            displayName = 'My Queue';
            badge = (
              <span className="ml-auto px-1.5 py-0.5 text-[10px] font-bold bg-primary/10 text-primary rounded-full">
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
              className={`flex items-center gap-md px-sm py-xs rounded-sm transition-colors ${
                isActive
                  ? 'text-primary font-bold border-r-4 border-primary bg-surface-container-high'
                  : 'text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {item.icon && (
                <span className="material-symbols-outlined text-[20px]">{item.icon}</span>
              )}
              <span className="font-label-caps text-label-caps flex-1 truncate">{displayName}</span>
              {badge}
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile & Logout */}
      <div className="mt-auto border-t border-outline-variant pt-md space-y-md">
        {role && (
          <div className="flex items-center gap-md px-sm">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs select-none">
              {getInitials(role)}
            </div>
            <div className="min-w-0">
              <p className="font-data-mono text-on-surface truncate text-xs leading-none mb-0.5">
                {ROLE_LABELS[role]}
              </p>
              <p className="text-[10px] text-outline uppercase font-semibold leading-none">{role}</p>
            </div>
          </div>
        )}

        <button
          onClick={logout}
          className="w-full flex items-center gap-md px-sm py-xs rounded-sm text-error hover:bg-error-container hover:text-on-error-container transition-colors text-left"
        >
          <span className="material-symbols-outlined text-[20px]">logout</span>
          <span className="font-label-caps text-label-caps">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
export default Sidebar;
