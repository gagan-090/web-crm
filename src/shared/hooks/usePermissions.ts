import { useAuth } from '../../app/providers/AuthProvider';
import { hasPermission, hasAnyPermission } from '../constants/permissions';
import type { Permission } from '../constants/permissions';

export const usePermissions = () => {
  const { user } = useAuth();
  const role = user?.role;

  const can = (permission: Permission): boolean => {
    if (!role) return false;
    return hasPermission(role, permission);
  };

  const canAny = (permissions: Permission[]): boolean => {
    if (!role) return false;
    return hasAnyPermission(role, permissions);
  };

  return {
    role,
    user,
    can,
    canAny,
    isAuthenticated: !!user
  };
};
export type UsePermissionsReturn = ReturnType<typeof usePermissions>;
