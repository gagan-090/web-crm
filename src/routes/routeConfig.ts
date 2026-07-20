// Dynamic Router Config for TruckMitr CRM
import type { Permission } from '../shared/constants/permissions';

export interface RouteItem {
  path: string;
  name: string;
  role: string;
  permission?: Permission;
  layout: 'dashboard' | 'caller' | 'none';
  icon?: string;
  showInMenu: boolean;
}

export const dynamicRoutes: RouteItem[] = [
  // ==================== TELECALLING HEAD (th) ====================
  {
    path: '/th/overview-live',
    name: 'Overview',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'grid_view',
    showInMenu: true
  },
  {
    path: '/th/main-overview-dashboard',
    name: 'Dashboard',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: false
  },
  {
    path: '/th/global-call-chat-log',
    name: 'Call & Chat Log',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'chat',
    showInMenu: true
  },
  {
    path: '/th/team-monitor',
    name: 'Team Monitor',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'groups',
    showInMenu: true
  },
  {
    path: '/th/lead-management-console',
    name: 'Lead Management Console',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'leaderboard',
    showInMenu: true
  },
  {
    path: '/th/sla-dashboard',
    name: 'SLA Dashboard',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'timer',
    showInMenu: true
  },
  {
    path: '/th/reports-hub',
    name: 'Reports Hub',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'analytics',
    showInMenu: true
  },
  {
    path: '/qc/qc-console-refined',
    name: 'QC Console',
    role: 'Telecalling Head',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: true
  },
  {
    path: '/th/backlog-sprint-manager',
    name: 'Backlog Sprint Manager',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'view_week',
    showInMenu: true
  },
  {
    path: '/th/notifications-alerts-center',
    name: 'Notifications & Alerts',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'notifications',
    showInMenu: true
  },
  {
    path: '/th/settings',
    name: 'Settings',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'settings',
    showInMenu: true
  },
  {
    path: '/th/global-campaign-console',
    name: 'Global Campaign Console',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'campaign',
    showInMenu: true
  },
  // Hidden/other TH pages
  {
    path: '/th/post-call-disposition-gate',
    name: 'Post Call Disposition Gate',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'phone',
    showInMenu: false
  },
  {
    path: '/th/re-activation-manager',
    name: 'Re Activation Manager',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'article',
    showInMenu: false
  },
  {
    path: '/th/backlog-campaign-manager',
    name: 'Backlog Campaign Manager',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'campaign',
    showInMenu: true
  },

  // ==================== SYSTEM ADMIN (admin) ====================
  {
    path: '/admin/user-management-console',
    name: 'User Management Console',
    role: 'System Admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'manage_accounts',
    showInMenu: true
  },
  {
    path: '/admin/plan-price-manager',
    name: 'Plan Price Manager',
    role: 'System Admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'payments',
    showInMenu: true
  },
  {
    path: '/admin/webhook-logs-troubleshooting',
    name: 'Webhook Logs Troubleshooting',
    role: 'System Admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'api',
    showInMenu: true
  },
  {
    path: '/admin/integrations-routing-config',
    name: 'Integrations Routing Config',
    role: 'System Admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'device_hub',
    showInMenu: true
  },
  {
    path: '/admin/system-health-dashboard',
    name: 'System Health Dashboard',
    role: 'System Admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/admin/process-queue-config',
    name: 'Process Queue Config',
    role: 'System Admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'queue',
    showInMenu: true
  },
  {
    path: '/admin/target-allocation',
    name: 'Target Allocation',
    role: 'System Admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'track_changes',
    showInMenu: true
  },

  // ==================== HR EXECUTIVE (hr) ====================
  {
    path: '/hr/hiring-dashboard',
    name: 'Hiring Dashboard',
    role: 'HR Executive',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/hr/hiring-pipeline',
    name: 'Hiring Pipeline',
    role: 'HR Executive',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'badge',
    showInMenu: true
  },
  {
    path: '/hr/onboarding-tracker',
    name: 'Onboarding Tracker',
    role: 'HR Executive',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'assignment_ind',
    showInMenu: true
  },
  {
    path: '/hr/headcount-overview',
    name: 'Headcount Overview',
    role: 'HR Executive',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'person',
    showInMenu: true
  },
  {
    path: '/hr/attendance-management',
    name: 'Attendance Management',
    role: 'HR Executive',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'how_to_reg',
    showInMenu: true
  },
  {
    path: '/hr/payroll-processing',
    name: 'Payroll Processing',
    role: 'HR Executive',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'receipt_long',
    showInMenu: true
  },
  {
    path: '/hr/incentive-verification',
    name: 'Incentive Verification',
    role: 'HR Executive',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'monetization_on',
    showInMenu: true
  },
  {
    path: '/hr/policy-reference-panel',
    name: 'Policy Reference',
    role: 'HR Executive',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'policy',
    showInMenu: true
  },
  {
    path: '/hr/document-vault',
    name: 'Document Vault',
    role: 'HR Executive',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'folder_open',
    showInMenu: true
  },
  {
    path: '/hr/exit-management',
    name: 'Exit Management',
    role: 'HR Executive',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'logout',
    showInMenu: true
  },
  {
    path: '/hr/page09-hiring',
    name: 'Page09 Hiring',
    role: 'HR Executive',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'badge',
    showInMenu: false
  },

  // ==================== QC ANALYST (qc) ====================
  {
    path: '/qc/qc-console-refined',
    name: 'QC Console',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: true
  },
  {
    path: '/qc/audit-queue',
    name: 'Audit Queue',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'queue',
    showInMenu: true
  },
  {
    path: '/qc/feedback-manager',
    name: 'Feedback Manager',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'feedback',
    showInMenu: true
  },
  {
    path: '/qc/tl-qc-feedback-inbox',
    name: 'TL Feedback Inbox',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'inbox',
    showInMenu: true
  },
  {
    path: '/qc/calibration-session-manager',
    name: 'Calibration Session Manager',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'model_training',
    showInMenu: true
  },
  {
    path: '/qc/fatal-error-log',
    name: 'Fatal Error Log',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'error',
    showInMenu: true
  },
  {
    path: '/qc/revenue-attribution-audit',
    name: 'Revenue Attribution Audit',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'account_balance',
    showInMenu: true
  },
  {
    path: '/qc/crm-data-integrity',
    name: 'CRM Data Integrity',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'database',
    showInMenu: true
  },
  {
    path: '/qc/system-audit-logs',
    name: 'System Audit Logs',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'manage_search',
    showInMenu: true
  },
  {
    path: '/qc/weekly-qc-report-generator',
    name: 'Weekly QC Report',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'summarize',
    showInMenu: true
  },
  {
    path: '/qc/feedback-composer',
    name: 'Feedback Composer',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'feedback',
    showInMenu: false
  },
  {
    path: '/qc/qc-console-home',
    name: 'QC Console Home',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: false
  },
  {
    path: '/qc/page06-qc-console',
    name: 'Page06 QC Console',
    role: 'QC Analyst',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: false
  },

  // ==================== TEAM LEADER (tl) ====================
  {
    path: '/tl/tl-overview-dashboard',
    name: 'Overview Dashboard',
    role: 'Team Leader',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/tl/tl-real-time-monitor',
    name: 'Real-Time Monitor',
    role: 'Team Leader',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'monitoring',
    showInMenu: true
  },
  {
    path: '/tl/tl-lead-queue-manager',
    name: 'Lead Queue Manager',
    role: 'Team Leader',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'queue',
    showInMenu: true
  },
  {
    path: '/tl/tl-team-callback-calendar',
    name: 'Team Callback Calendar',
    role: 'Team Leader',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'calendar_month',
    showInMenu: true
  },
  {
    path: '/tl/tl-daily-wrap-up-panel',
    name: 'Daily Wrap Up Panel',
    role: 'Team Leader',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'description',
    showInMenu: true
  },
  {
    path: '/tl/tl-caller-profile-detail',
    name: 'Caller Profile Detail',
    role: 'Team Leader',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'person',
    showInMenu: false
  },

  // ==================== DRIVER WELCOME (dw) ====================
  {
    path: '/dw/dw-home-dashboard',
    name: 'Home Dashboard',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/dw/dw-call-queue',
    name: 'Call Queue',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'queue',
    showInMenu: true
  },
  {
    path: '/dw/dw-driver-bank',
    name: 'Driver Bank',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'account_box',
    showInMenu: true
  },
  {
    path: '/dw/dw-call-history',
    name: 'Call History',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'history',
    showInMenu: true
  },
  {
    path: '/dw/dw-campaign-leads',
    name: 'Campaign Leads',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'campaign',
    showInMenu: true
  },
  {
    path: '/dw/dw-job-search',
    name: 'Job Search',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'work',
    showInMenu: true
  },
  {
    path: '/dw/dw-active-call-focus',
    name: 'Active Call Focus',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'phone',
    showInMenu: true
  },
  {
    path: '/dw/dw-disposition-gate',
    name: 'Disposition Gate',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: true
  },
  {
    path: '/dw/dw-callback-calendar',
    name: 'Callback Calendar',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'calendar_month',
    showInMenu: true
  },
  {
    path: '/dw/dw-whatsapp-panel',
    name: 'WhatsApp Panel',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'chat',
    showInMenu: true
  },
  {
    path: '/dw/dw-performance-stats',
    name: 'Performance Stats',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'equalizer',
    showInMenu: true
  },
  {
    path: '/dw/dw-training-hub',
    name: 'Training Hub',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'school',
    showInMenu: true
  },
  {
    path: '/dw/dw-script-library',
    name: 'Driver Script',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'menu_book',
    showInMenu: true
  },
  {
    path: '/dw/dw-knowledge',
    name: 'Knowledge',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'local_shipping',
    showInMenu: true
  },
  {
    path: '/dw/tl-overview-driver-welcome',
    name: 'Driver Welcome Overview',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'preview',
    showInMenu: true
  },
  {
    path: '/dialer/live-console',
    name: 'Active Call Console (Live)',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'caller',
    icon: 'phone',
    showInMenu: false
  },


  // ==================== TRANSPORTER WELCOME (wct) ====================
  {
    path: '/wct/wct-home-dashboard',
    name: 'Home Dashboard',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/wct/wct-call-queue',
    name: 'Call Queue',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'queue',
    showInMenu: true
  },
  {
    path: '/wct/wct-call-history',
    name: 'Call History',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'history',
    showInMenu: true
  },
  {
    path: '/wct/wct-jobs',
    name: 'Transporter Jobs',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'work',
    showInMenu: true
  },
  {
    path: '/wct/wct-campaign-leads',
    name: 'Campaign Leads',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'campaign',
    showInMenu: true
  },
  {
    path: '/wct/wct-active-call-focus',
    name: 'Active Call Focus',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'phone',
    showInMenu: true
  },
  {
    path: '/wct/wct-callback-calendar',
    name: 'Callback Calendar',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'calendar_month',
    showInMenu: true
  },
  {
    path: '/wct/wct-d7-upsell-queue',
    name: 'D7 Upsell Queue',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'stars',
    showInMenu: true
  },
  {
    path: '/wct/wct-disposition-gate',
    name: 'Disposition Gate',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: true
  },
  {
    path: '/wct/wct-performance-stats',
    name: 'Performance Stats',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'equalizer',
    showInMenu: true
  },
  {
    path: '/wct/wct-training-hub',
    name: 'Training Hub',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'school',
    showInMenu: true
  },
  {
    path: '/wct/wct-script-library',
    name: 'Transporter Script',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'menu_book',
    showInMenu: true
  },
  {
    path: '/wct/wct-knowledge',
    name: 'Knowledge',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'local_shipping',
    showInMenu: true
  },
  {
    path: '/dialer/live-console',
    name: 'Active Call Console (Live)',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'caller',
    icon: 'phone',
    showInMenu: false
  },


  // ==================== MATCHMAKING CALLER (mm) ====================
  {
    path: '/mm/mm-home-dashboard',
    name: 'Home Dashboard',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/dialer/live-console',
    name: 'Active Call Console (Live)',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'caller',
    icon: 'phone',
    showInMenu: true
  },
  {
    path: '/mm/mm-driver-search',
    name: 'Driver Search',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'search',
    showInMenu: true
  },
  {
    path: '/mm/mm-job-board',
    name: 'Job Board',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'view_list',
    showInMenu: true
  },
  {
    path: '/mm/mm-driver-bank',
    name: 'Driver Bank',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'group',
    showInMenu: true
  },
  {
    path: '/mm/mm-placement-confirmation',
    name: 'Placement Confirmation',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'check_circle',
    showInMenu: true
  },
  {
    path: '/mm/mm-placement-history',
    name: 'My Placements Dashboard',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'history',
    showInMenu: true
  },
  {
    path: '/mm/mm-script-library',
    name: 'Greenline SOP',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'menu_book',
    showInMenu: true
  },
  {
    path: '/mm/tl-matchmaking-job-board',
    name: 'Matchmaking Job Board',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'dashboard_customize',
    showInMenu: true
  },
  {
    path: '/mm/tl-overview-tr-matchmaking',
    name: 'Transporter Matchmaking Overview',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'preview',
    showInMenu: true
  },
  {
    path: '/mm/tl-overview-tr-matchmaking-white-bg',
    name: 'Tr Matchmaking White Bg',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'preview',
    showInMenu: false
  },
  {
    path: '/mm/hr-analytics-summary',
    name: 'Hr Analytics Summary',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'analytics',
    showInMenu: false
  },
  {
    path: '/mm/mm-active-call-focus-refined',
    name: 'Mm Active Call Focus Refined',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'caller',
    icon: 'phone',
    showInMenu: false
  },
  {
    path: '/mm/mm-intro-manager',
    name: 'Mm Intro Manager',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'article',
    showInMenu: false
  },
  {
    path: '/mm/mm-training-hub',
    name: 'Training Hub',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'school',
    showInMenu: true
  },

  // ==================== SPECIAL CATEGORIES (sc) ====================
  {
    path: '/sc/sc-home-dashboard',
    name: 'Home Dashboard',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/dialer/live-console',
    name: 'Active Call Console (Live)',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'caller',
    icon: 'phone',
    showInMenu: true
  },
  {
    path: '/sc/partner-network-overview',
    name: 'Partner Network Overview',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'group',
    showInMenu: true
  },
  {
    path: '/sc/partner-queue-detail',
    name: 'Partner Queue Detail',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'queue',
    showInMenu: true
  },
  {
    path: '/sc/score-trends',
    name: 'Score Trends',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'trending_up',
    showInMenu: true
  },
  {
    path: '/sc/scoring-interface',
    name: 'Scoring Interface',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: true
  },
  {
    path: '/sc/script-editor-console',
    name: 'Script Editor Console',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'edit_note',
    showInMenu: true
  },
  {
    path: '/sc/script-compliance-tracker',
    name: 'Script Compliance Tracker',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'checklist',
    showInMenu: true
  },
  {
    path: '/sc/sc-performance-hub',
    name: 'Performance Hub',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'equalizer',
    showInMenu: true
  },
  {
    path: '/sc/special-categories-script-library',
    name: 'Script Library',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'menu_book',
    showInMenu: true
  },
  {
    path: '/sc/absconding-protocol-tracker',
    name: 'Absconding Protocol Tracker',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'warning',
    showInMenu: true
  },
  {
    path: '/sc/active-call-focus-special-categories',
    name: 'Active Call Focus Special Categories',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'caller',
    icon: 'phone',
    showInMenu: false
  },
  {
    path: '/sc/login-screen',
    name: 'Login Screen',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'login',
    showInMenu: false
  },

  // ==================== MANUAL LIVE CORE FEATURES ====================
  {
    path: '/th/overview-live',
    name: 'Overview Dashboard (Live)',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: false
  },
  {
    path: '/th/team-monitor-live',
    name: 'Team Monitor (Live)',
    role: 'Telecalling Head',
    permission: 'calls:view',
    layout: 'dashboard',
    icon: 'groups',
    showInMenu: false
  },
  {
    path: '/th/leads-live',
    name: 'Lead Management (Live)',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'leaderboard',
    showInMenu: false
  },
  {
    path: '/th/sla-live',
    name: 'SLA Dashboard (Live)',
    role: 'Telecalling Head',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'timer',
    showInMenu: false
  },
  {
    path: '/th/backlog-live',
    name: 'Backlog Sprint (Live)',
    role: 'Telecalling Head',
    permission: 'backlog:view',
    layout: 'dashboard',
    icon: 'view_week',
    showInMenu: false
  },
  {
    path: '/th/settings-live',
    name: 'Settings (Live)',
    role: 'Telecalling Head',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'settings',
    showInMenu: false
  },
  {
    path: '/th/notifications-live',
    name: 'Notifications (Live)',
    role: 'Telecalling Head',
    layout: 'dashboard',
    icon: 'notifications',
    showInMenu: false
  },
  {
    path: '/qc/qc-console-live',
    name: 'QC Console (Live)',
    role: 'QC Analyst',
    permission: 'qc:audit',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: false
  },
  {
    path: '/hr/hiring-dashboard-live',
    name: 'Hiring Dashboard (Live)',
    role: 'HR Executive',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'badge',
    showInMenu: false
  },

  // ==================== INCENTIVE ENGINE (All Caller Roles) ====================
  {
    path: '/dw/my-incentive',
    name: 'My Incentives',
    role: 'Driver Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'monetization_on',
    showInMenu: true
  },
  {
    path: '/wct/my-incentive',
    name: 'My Incentives',
    role: 'Transporter Welcome',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'monetization_on',
    showInMenu: true
  },
  {
    path: '/mm/my-incentive',
    name: 'My Incentives',
    role: 'Matchmaking',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'monetization_on',
    showInMenu: true
  },
  {
    path: '/sc/my-incentive',
    name: 'My Incentives',
    role: 'Special Categories',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'monetization_on',
    showInMenu: true
  },
  {
    path: '/tl/team-incentive',
    name: 'Team Incentive',
    role: 'Team Leader',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'group_work',
    showInMenu: true
  },
  {
    path: '/th/incentive-command-center',
    name: 'Incentive Command Center',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'hub',
    showInMenu: true
  },
  {
    path: '/th/payroll-export',
    name: 'Payroll Export',
    role: 'Telecalling Head',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'download',
    showInMenu: true
  },
  {
    path: '/admin/incentive-config',
    name: 'Incentive Configuration',
    role: 'System Admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'tune',
    showInMenu: true
  },
  {
    path: '/admin/parity-dashboard',
    name: 'Parity & Equity Dashboard',
    role: 'System Admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'balance',
    showInMenu: true
  }
];

export const routeConfig = dynamicRoutes;
