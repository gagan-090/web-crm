export const Role = {
  TH: 'TH',       // Telecalling Head
  TL: 'TL',       // Team Leader
  DW: 'DW',       // Driver Welcome Caller
  WCT: 'WCT',     // Transporter Welcome Caller
  MM: 'MM',       // Matchmaking Caller
  SC: 'SC',       // Special Categories Caller
  QC: 'QC',       // QC Analyst
  HR: 'HR',       // HR Executive
  ADMIN: 'ADMIN'  // Admin
} as const;

export type Role = typeof Role[keyof typeof Role];

export const ROLE_LABELS: Record<Role, string> = {
  [Role.TH]: 'Telecalling Head',
  [Role.TL]: 'Team Leader',
  [Role.DW]: 'Driver Welcome Caller',
  [Role.WCT]: 'Transporter Welcome Caller',
  [Role.MM]: 'Matchmaking Caller',
  [Role.SC]: 'Special Categories Caller',
  [Role.QC]: 'QC Analyst',
  [Role.HR]: 'HR Executive',
  [Role.ADMIN]: 'System Admin'
};
