export const Role = {
  TH: 'Telecalling Head',
  TL: 'Team Leader',
  DW: 'Driver Welcome',
  WCT: 'Transporter Welcome',
  MM: 'Matchmaking',
  SC: 'Special Categories',
  QC: 'QC Analyst',
  HR: 'HR Executive',
  ADMIN: 'System Admin'
} as const;

export type Role = typeof Role[keyof typeof Role];

// Mapping from full role name to email-friendly short code (for demo login emails)
export const ROLE_SHORT_CODES: Record<Role, string> = {
  [Role.TH]: 'th',
  [Role.TL]: 'tl',
  [Role.DW]: 'dw',
  [Role.WCT]: 'wct',
  [Role.MM]: 'mm',
  [Role.SC]: 'sc',
  [Role.QC]: 'qc',
  [Role.HR]: 'hr',
  [Role.ADMIN]: 'admin'
};

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
