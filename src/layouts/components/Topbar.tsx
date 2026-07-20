import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../app/providers/AuthProvider';
import { ROLE_LABELS } from '../../shared/constants/roles';
import { routeConfig } from '../../routes/routeConfig';

interface TopbarProps {
  sidebarHidden?: boolean;
  onToggleSidebar?: () => void;
}

export const Topbar: React.FC<TopbarProps> = ({ sidebarHidden = false, onToggleSidebar }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Find current screen name based on route
  const currentRoute = routeConfig.find((item) => item.path === location.pathname);
  const screenName = currentRoute ? currentRoute.name : 'Dashboard';

  return (
    <header
      className={`fixed top-0 h-[56px] bg-white border-b border-outline-variant flex items-center justify-between px-md z-40 transition-all duration-300 ${
        sidebarHidden ? 'left-0 w-full' : 'left-[240px] w-[calc(100%-240px)]'
      }`}
    >
      {/* Left side: sidebar toggle + Screen Name */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          title={sidebarHidden ? 'Show sidebar' : 'Hide sidebar'}
          className="w-8 h-8 -ml-1 rounded-md flex items-center justify-center text-on-surface-variant hover:bg-surface-container-high transition-colors"
        >
          <span className="material-symbols-outlined text-[20px]">{sidebarHidden ? 'menu' : 'menu_open'}</span>
        </button>
        <h1 className="text-sm font-bold text-on-surface tracking-tight">
          {screenName}
        </h1>
      </div>

      {/* Right side: Logged in User Name & Role */}
      {user && (
        <div className="flex flex-col items-end">
          <span className="text-xs font-bold text-on-surface leading-tight">
            {user.name}
          </span>
          <span className="text-[10px] text-outline font-semibold uppercase tracking-wider leading-none mt-0.5">
            {ROLE_LABELS[user.role]}
          </span>
        </div>
      )}
    </header>
  );
};

export default Topbar;

