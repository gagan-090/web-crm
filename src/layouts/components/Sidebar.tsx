import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { usePermissions } from '../../shared/hooks/usePermissions';
import { routeConfig } from '../../routes/routeConfig';
import type { RouteItem } from '../../routes/routeConfig';
import { ROLE_LABELS } from '../../shared/constants/roles';

export const Sidebar: React.FC = () => {
  const location = useLocation();
  const { logout } = useAuth();
  const { role, can } = usePermissions();

  const menuItems = (routeConfig as RouteItem[]).filter(
    (item: RouteItem) => item.showInMenu && role && item.role.toUpperCase() === role.toUpperCase() && (!item.permission || can(item.permission))
  );

  const getInitials = (roleName: string) => {
    return roleName.slice(0, 2).toUpperCase();
  };

  return (
    <aside className="w-[240px] h-screen fixed left-0 top-0 border-r border-outline-variant bg-surface flex flex-col py-md px-sm z-50">
      {/* Brand Header */}
      <div className="mb-lg px-sm">
        <h1 className="font-headline-md text-headline-md font-extrabold text-primary">TruckMitr</h1>
        <p className="text-[10px] uppercase tracking-wider text-outline font-bold">Internal Connect CRM</p>
      </div>

      {/* Nav Menu */}
      <nav className="flex-1 space-y-1">
        {menuItems.map((item: RouteItem) => {
          const isActive = location.pathname === item.path;
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
              <span className="font-label-caps text-label-caps">{item.name}</span>
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
