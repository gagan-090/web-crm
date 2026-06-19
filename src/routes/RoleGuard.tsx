import React from 'react';
import { usePermissions } from '../shared/hooks/usePermissions';
import type { Permission } from '../shared/constants/permissions';

interface RoleGuardProps {
  children: React.ReactNode;
  permission?: Permission;
  fallback?: React.ReactNode;
}

export const RoleGuard: React.FC<RoleGuardProps> = ({
  children,
  permission,
  fallback
}) => {
  const { can, role } = usePermissions();

  if (permission && !can(permission)) {
    if (fallback) {
      return <>{fallback}</>;
    }

    return (
      <div className="flex-1 flex flex-col items-center justify-center p-xl bg-background min-h-[400px]">
        <div className="max-w-[400px] text-center bg-white p-lg border border-outline-variant rounded-DEFAULT flipkart-shadow">
          <span className="material-symbols-outlined text-[48px] text-error mb-sm">gpp_maybe</span>
          <h2 className="font-headline-md text-on-surface font-extrabold mb-xs">Access Denied</h2>
          <p className="font-body-sm text-on-surface-variant mb-md">
            Your current role <span className="font-bold text-primary">({role})</span> does not have the necessary permissions to access this module.
          </p>
          <div className="text-xs text-outline bg-surface-container-low p-sm rounded-sm font-data-mono">
            Requires: {permission}
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};
export default RoleGuard;
