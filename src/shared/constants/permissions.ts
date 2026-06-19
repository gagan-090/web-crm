import { Role } from './roles';

export type Permission =
  // Lead permissions
  | 'leads:view'
  | 'leads:edit'
  | 'leads:delete'
  | 'leads:bulk'
  // Call dialer permissions
  | 'calls:dial'
  | 'calls:view'
  | 'calls:disposition'
  | 'calls:scripts'
  // QC permissions
  | 'qc:view'
  | 'qc:audit'
  | 'qc:calibrate'
  | 'qc:reports'
  // HR permissions
  | 'hr:view'
  | 'hr:hiring'
  | 'hr:onboarding'
  | 'hr:attendance'
  | 'hr:payroll'
  | 'hr:vault'
  // Backlog permissions
  | 'backlog:view'
  | 'backlog:edit'
  // Admin permissions
  | 'admin:view'
  | 'admin:config'
  | 'admin:users'
  | 'admin:pricing'
  | 'admin:webhooks'
  | 'admin:audit';

// Role permissions mapping matrix
export const ROLE_PERMISSIONS: Record<Role, Permission[]> = {
  [Role.ADMIN]: [
    'leads:view', 'leads:edit', 'leads:delete', 'leads:bulk',
    'calls:dial', 'calls:view', 'calls:disposition', 'calls:scripts',
    'qc:view', 'qc:audit', 'qc:calibrate', 'qc:reports',
    'hr:view', 'hr:hiring', 'hr:onboarding', 'hr:attendance', 'hr:payroll', 'hr:vault',
    'backlog:view', 'backlog:edit',
    'admin:view', 'admin:config', 'admin:users', 'admin:pricing', 'admin:webhooks', 'admin:audit'
  ],
  [Role.TH]: [
    'leads:view', 'leads:edit', 'leads:delete', 'leads:bulk',
    'calls:view', 'calls:scripts',
    'qc:view', 'qc:audit', 'qc:reports',
    'hr:view',
    'backlog:view', 'backlog:edit',
    'admin:view'
  ],
  [Role.TL]: [
    'leads:view', 'leads:edit', 'leads:bulk',
    'calls:view', 'calls:scripts',
    'qc:view', 'qc:audit',
    'backlog:view', 'backlog:edit'
  ],
  [Role.DW]: [
    'leads:view',
    'calls:dial', 'calls:disposition', 'calls:scripts'
  ],
  [Role.WCT]: [
    'leads:view',
    'calls:dial', 'calls:disposition', 'calls:scripts'
  ],
  [Role.MM]: [
    'leads:view',
    'calls:dial', 'calls:disposition', 'calls:scripts',
    'backlog:view'
  ],
  [Role.SC]: [
    'leads:view',
    'calls:dial', 'calls:disposition', 'calls:scripts'
  ],
  [Role.QC]: [
    'calls:view',
    'qc:view', 'qc:audit', 'qc:calibrate', 'qc:reports'
  ],
  [Role.HR]: [
    'hr:view', 'hr:hiring', 'hr:onboarding', 'hr:attendance', 'hr:payroll', 'hr:vault'
  ]
};

// Check if a role has a specific permission
export const hasPermission = (role: Role, permission: Permission): boolean => {
  const permissions = ROLE_PERMISSIONS[role];
  return permissions ? permissions.includes(permission) : false;
};

// Check if a role has any of the specific permissions
export const hasAnyPermission = (role: Role, permissions: Permission[]): boolean => {
  return permissions.some(permission => hasPermission(role, permission));
};
