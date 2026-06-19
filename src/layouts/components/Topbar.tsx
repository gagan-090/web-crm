import React, { useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import { Role, ROLE_LABELS } from '../../shared/constants/roles';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState } from '../../app/rootReducer';
import { markAllAsRead } from '../../features/notifications/slices/notificationsSlice';

export const Topbar: React.FC = () => {
  const { user, switchRole } = useAuth();
  const dispatch = useDispatch();
  const unreadNotifications = useSelector((state: RootState) => state.notifications.unreadCount);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const roles = Object.values(Role);

  const handleRoleChange = (newRole: Role) => {
    switchRole(newRole);
    setDropdownOpen(false);
  };

  return (
    <header className="fixed top-0 left-[240px] w-[calc(100%-240px)] h-[56px] bg-surface border-b border-outline-variant flex items-center justify-between px-md z-40">
      {/* Search & Badges */}
      <div className="flex items-center gap-md">
        <div className="relative w-64">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-outline text-sm">
            search
          </span>
          <input
            className="w-full bg-surface-container-low border border-outline-variant rounded-sm pl-8 pr-2 py-1 text-xs focus:ring-1 focus:ring-primary focus:outline-none transition-all"
            placeholder="Search leads, jobs, or callers..."
            type="text"
          />
        </div>
        <span className="h-4 w-[1px] bg-outline-variant"></span>
        <div className="flex items-center gap-sm">
          {user && (
            <>
              <span className="px-2 py-0.5 bg-inverse-surface text-white font-role-badge text-role-badge rounded-sm uppercase">
                {ROLE_LABELS[user.role]}
              </span>
              <span className="px-2 py-0.5 border border-primary text-primary font-role-badge text-role-badge rounded-sm">
                LIVE OPS
              </span>
            </>
          )}
        </div>
      </div>

      {/* Right Side Options */}
      <div className="flex items-center gap-lg">
        {/* Heartbeat Status */}
        <div className="flex items-center gap-xs">
          <div className="w-2 h-2 rounded-full bg-green-500 pulse-custom"></div>
          <span className="font-label-caps text-label-caps text-on-surface-variant">Live Operations</span>
        </div>

        {/* Dropdown Role Swapper for Demo */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center gap-xs text-xs font-semibold px-2 py-1 bg-surface-container border border-outline-variant rounded-sm hover:bg-surface-container-high transition-colors"
          >
            <span>Switch Role</span>
            <span className="material-symbols-outlined text-sm">swap_horiz</span>
          </button>
          
          {dropdownOpen && (
            <div className="absolute right-0 mt-xs w-48 bg-white border border-outline-variant rounded-DEFAULT flipkart-shadow z-50 py-xs text-left max-h-64 overflow-y-auto custom-scrollbar">
              <p className="text-[10px] text-outline px-md py-xs font-bold uppercase tracking-wider border-b border-outline-variant">
                Select Simulation Role
              </p>
              {roles.map((r) => (
                <button
                  key={r}
                  onClick={() => handleRoleChange(r)}
                  className={`w-full text-left block px-md py-sm font-label-caps text-on-surface hover:bg-surface-container-low transition-colors text-xs ${
                    user?.role === r ? 'font-bold text-primary bg-primary-fixed' : ''
                  }`}
                >
                  {ROLE_LABELS[r]}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Operations Icons */}
        <div className="flex items-center gap-md">
          <button
            onClick={() => dispatch(markAllAsRead())}
            className="relative p-1 text-on-surface-variant hover:text-primary transition-colors"
            title="Mark notifications read"
          >
            <span className="material-symbols-outlined">notifications</span>
            {unreadNotifications > 0 && (
              <span className="absolute top-0 right-0 w-2 h-2 bg-error rounded-full border border-white"></span>
            )}
          </button>
          <div className="w-8 h-8 rounded-full overflow-hidden border border-outline-variant">
            <img
              className="w-full h-full object-cover"
              alt="User profile"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDVj-JcMSow-dtltPycQG3alyBTg27HBccv7faktG2Oco8AU0JL_-x8xouyhqvkGR-cJJrTByTs8IEr8HFuYjm8ovKV9Qtr29N9xj3Y1q3c1x-3we7hKsTzsS1T5uRVOdpue9jJLhTK5kCBT02rX-Yj--p-b7GSf32x1eIBkar4njl27guhn7XKfVcvD_lhpWIcf0naIsEpu4CA7ieN3N23-QgoOarbFEOwAmpLN8zgFUJTLbPJnVor0L1ebkK9R3rn-QIdOdD73tk"
            />
          </div>
        </div>
      </div>
    </header>
  );
};
export default Topbar;
