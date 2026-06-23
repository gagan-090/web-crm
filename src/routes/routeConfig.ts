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
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'grid_view',
    showInMenu: true
  },
  {
    path: '/th/main-overview-dashboard',
    name: 'Dashboard',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/th/team-monitor',
    name: 'Team Monitor',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'groups',
    showInMenu: true
  },
  {
    path: '/th/lead-management-console',
    name: 'Lead Management Console',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'leaderboard',
    showInMenu: true
  },
  {
    path: '/th/sla-dashboard',
    name: 'SLA Dashboard',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'timer',
    showInMenu: true
  },
  {
    path: '/th/reports-hub',
    name: 'Reports Hub',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'analytics',
    showInMenu: true
  },
  {
    path: '/qc/qc-console-refined',
    name: 'QC Console',
    role: 'th',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: true
  },
  {
    path: '/th/backlog-sprint-manager',
    name: 'Backlog Sprint Manager',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'view_week',
    showInMenu: true
  },
  {
    path: '/th/notifications-alerts-center',
    name: 'Notifications & Alerts',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'notifications',
    showInMenu: true
  },
  {
    path: '/th/settings',
    name: 'Settings',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'settings',
    showInMenu: true
  },
  // Hidden/other TH pages
  {
    path: '/th/page01-dashboard',
    name: 'Page01 Dashboard',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: false
  },
  {
    path: '/th/page02-login',
    name: 'Page02 Login',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'article',
    showInMenu: false
  },
  {
    path: '/th/page03-team-monitor',
    name: 'Page03 Team Monitor',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'groups',
    showInMenu: false
  },
  {
    path: '/th/page04-lead-management',
    name: 'Page04 Lead Management',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'leaderboard',
    showInMenu: false
  },
  {
    path: '/th/page05-sla-dashboard',
    name: 'Page05 Sla Dashboard',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: false
  },
  {
    path: '/th/page07-settings',
    name: 'Page07 Settings',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'settings',
    showInMenu: false
  },
  {
    path: '/th/page08-backlog-sprint',
    name: 'Page08 Backlog Sprint',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'view_week',
    showInMenu: false
  },
  {
    path: '/th/page10-notifications',
    name: 'Page10 Notifications',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'notifications',
    showInMenu: false
  },
  {
    path: '/th/post-call-disposition-gate',
    name: 'Post Call Disposition Gate',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'phone',
    showInMenu: false
  },
  {
    path: '/th/re-activation-manager',
    name: 'Re Activation Manager',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'article',
    showInMenu: false
  },
  {
    path: '/th/backlog-campaign-manager',
    name: 'Backlog Campaign Manager',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'campaign',
    showInMenu: false
  },

  // ==================== SYSTEM ADMIN (admin) ====================
  {
    path: '/admin/user-management-console',
    name: 'User Management Console',
    role: 'admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'manage_accounts',
    showInMenu: true
  },
  {
    path: '/admin/plan-price-manager',
    name: 'Plan Price Manager',
    role: 'admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'payments',
    showInMenu: true
  },
  {
    path: '/admin/webhook-logs-troubleshooting',
    name: 'Webhook Logs Troubleshooting',
    role: 'admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'api',
    showInMenu: true
  },
  {
    path: '/admin/integrations-routing-config',
    name: 'Integrations Routing Config',
    role: 'admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'device_hub',
    showInMenu: true
  },
  {
    path: '/admin/system-health-dashboard',
    name: 'System Health Dashboard',
    role: 'admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/admin/process-queue-config',
    name: 'Process Queue Config',
    role: 'admin',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'queue',
    showInMenu: true
  },

  // ==================== HR EXECUTIVE (hr) ====================
  {
    path: '/hr/hiring-dashboard',
    name: 'Hiring Dashboard',
    role: 'hr',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/hr/hiring-pipeline',
    name: 'Hiring Pipeline',
    role: 'hr',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'badge',
    showInMenu: true
  },
  {
    path: '/hr/onboarding-tracker',
    name: 'Onboarding Tracker',
    role: 'hr',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'assignment_ind',
    showInMenu: true
  },
  {
    path: '/hr/headcount-overview',
    name: 'Headcount Overview',
    role: 'hr',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'person',
    showInMenu: true
  },
  {
    path: '/hr/attendance-management',
    name: 'Attendance Management',
    role: 'hr',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'how_to_reg',
    showInMenu: true
  },
  {
    path: '/hr/payroll-processing',
    name: 'Payroll Processing',
    role: 'hr',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'receipt_long',
    showInMenu: true
  },
  {
    path: '/hr/incentive-verification',
    name: 'Incentive Verification',
    role: 'hr',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'monetization_on',
    showInMenu: true
  },
  {
    path: '/hr/policy-reference-panel',
    name: 'Policy Reference',
    role: 'hr',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'policy',
    showInMenu: true
  },
  {
    path: '/hr/document-vault',
    name: 'Document Vault',
    role: 'hr',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'folder_open',
    showInMenu: true
  },
  {
    path: '/hr/exit-management',
    name: 'Exit Management',
    role: 'hr',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'logout',
    showInMenu: true
  },
  {
    path: '/hr/page09-hiring',
    name: 'Page09 Hiring',
    role: 'hr',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'badge',
    showInMenu: false
  },

  // ==================== QC ANALYST (qc) ====================
  {
    path: '/qc/qc-overview',
    name: 'Overview',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/qc/qc-console-refined',
    name: 'QC Console',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: true
  },
  {
    path: '/qc/audit-queue',
    name: 'Audit Queue',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'queue',
    showInMenu: true
  },
  {
    path: '/qc/feedback-manager',
    name: 'Feedback Manager',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'feedback',
    showInMenu: true
  },
  {
    path: '/qc/tl-qc-feedback-inbox',
    name: 'TL Feedback Inbox',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'inbox',
    showInMenu: true
  },
  {
    path: '/qc/calibration-session-manager',
    name: 'Calibration Session Manager',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'model_training',
    showInMenu: true
  },
  {
    path: '/qc/fatal-error-log',
    name: 'Fatal Error Log',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'error',
    showInMenu: true
  },
  {
    path: '/qc/revenue-attribution-audit',
    name: 'Revenue Attribution Audit',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'account_balance',
    showInMenu: true
  },
  {
    path: '/qc/crm-data-integrity',
    name: 'CRM Data Integrity',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'database',
    showInMenu: true
  },
  {
    path: '/qc/system-audit-logs',
    name: 'System Audit Logs',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'manage_search',
    showInMenu: true
  },
  {
    path: '/qc/weekly-qc-report-generator',
    name: 'Weekly QC Report',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'summarize',
    showInMenu: true
  },
  {
    path: '/qc/feedback-composer',
    name: 'Feedback Composer',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'feedback',
    showInMenu: false
  },
  {
    path: '/qc/qc-console-home',
    name: 'QC Console Home',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: false
  },
  {
    path: '/qc/page06-qc-console',
    name: 'Page06 QC Console',
    role: 'qc',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: false
  },

  // ==================== TEAM LEADER (tl) ====================
  {
    path: '/tl/tl-overview-dashboard',
    name: 'Overview Dashboard',
    role: 'tl',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/tl/tl-real-time-monitor',
    name: 'Real-Time Monitor',
    role: 'tl',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'monitoring',
    showInMenu: true
  },
  {
    path: '/tl/tl-lead-queue-manager',
    name: 'Lead Queue Manager',
    role: 'tl',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'queue',
    showInMenu: true
  },
  {
    path: '/tl/tl-team-callback-calendar',
    name: 'Team Callback Calendar',
    role: 'tl',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'calendar_month',
    showInMenu: true
  },
  {
    path: '/tl/tl-daily-wrap-up-panel',
    name: 'Daily Wrap Up Panel',
    role: 'tl',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'description',
    showInMenu: true
  },
  {
    path: '/tl/tl-caller-profile-detail',
    name: 'Caller Profile Detail',
    role: 'tl',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'person',
    showInMenu: false
  },

  // ==================== DRIVER WELCOME (dw) ====================
  {
    path: '/dw/dw-home-dashboard',
    name: 'Home Dashboard',
    role: 'dw',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/dw/dw-call-queue',
    name: 'Call Queue',
    role: 'dw',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'queue',
    showInMenu: true
  },
  {
    path: '/dw/dw-active-call-focus',
    name: 'Active Call Focus',
    role: 'dw',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'phone',
    showInMenu: true
  },
  {
    path: '/dw/dw-disposition-gate',
    name: 'Disposition Gate',
    role: 'dw',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: true
  },
  {
    path: '/dw/dw-callback-calendar',
    name: 'Callback Calendar',
    role: 'dw',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'calendar_month',
    showInMenu: true
  },
  {
    path: '/dw/dw-whatsapp-panel',
    name: 'WhatsApp Panel',
    role: 'dw',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'chat',
    showInMenu: true
  },
  {
    path: '/dw/dw-performance-stats',
    name: 'Performance Stats',
    role: 'dw',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'equalizer',
    showInMenu: true
  },
  {
    path: '/dw/dw-training-hub',
    name: 'Training Hub',
    role: 'dw',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'school',
    showInMenu: true
  },
  {
    path: '/dw/dw-script-library',
    name: 'Script Library',
    role: 'dw',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'menu_book',
    showInMenu: true
  },
  {
    path: '/dw/tl-overview-driver-welcome',
    name: 'Driver Welcome Overview',
    role: 'dw',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'preview',
    showInMenu: true
  },
  {
    path: '/dialer/live-console',
    name: 'Active Call Console (Live)',
    role: 'dw',
    permission: 'calls:dial',
    layout: 'caller',
    icon: 'phone',
    showInMenu: false
  },


  // ==================== TRANSPORTER WELCOME (wct) ====================
  {
    path: '/wct/wct-home-dashboard',
    name: 'Home Dashboard',
    role: 'wct',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/wct/wct-call-queue',
    name: 'Call Queue',
    role: 'wct',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'queue',
    showInMenu: true
  },
  {
    path: '/wct/wct-active-call-focus',
    name: 'Active Call Focus',
    role: 'wct',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'phone',
    showInMenu: true
  },
  {
    path: '/wct/wct-callback-calendar',
    name: 'Callback Calendar',
    role: 'wct',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'calendar_month',
    showInMenu: true
  },
  {
    path: '/wct/wct-d7-upsell-queue',
    name: 'D7 Upsell Queue',
    role: 'wct',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'stars',
    showInMenu: true
  },
  {
    path: '/wct/wct-disposition-gate',
    name: 'Disposition Gate',
    role: 'wct',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: true
  },
  {
    path: '/wct/wct-performance-stats',
    name: 'Performance Stats',
    role: 'wct',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'equalizer',
    showInMenu: true
  },
  {
    path: '/wct/wct-training-hub',
    name: 'Training Hub',
    role: 'wct',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'school',
    showInMenu: true
  },
  {
    path: '/wct/wct-script-library',
    name: 'Script Library',
    role: 'wct',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'menu_book',
    showInMenu: true
  },
  {
    path: '/dialer/live-console',
    name: 'Active Call Console (Live)',
    role: 'wct',
    permission: 'calls:dial',
    layout: 'caller',
    icon: 'phone',
    showInMenu: false
  },


  // ==================== MATCHMAKING CALLER (mm) ====================
  {
    path: '/mm/mm-home-dashboard',
    name: 'Home Dashboard',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/dialer/live-console',
    name: 'Active Call Console (Live)',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'caller',
    icon: 'phone',
    showInMenu: true
  },
  {
    path: '/mm/mm-driver-search',
    name: 'Driver Search',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'search',
    showInMenu: true
  },
  {
    path: '/mm/mm-job-board',
    name: 'Job Board',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'view_list',
    showInMenu: true
  },
  {
    path: '/mm/mm-driver-bank',
    name: 'Driver Bank',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'group',
    showInMenu: true
  },
  {
    path: '/mm/mm-placement-confirmation',
    name: 'Placement Confirmation',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'check_circle',
    showInMenu: true
  },
  {
    path: '/mm/mm-placement-history',
    name: 'My Placements Dashboard',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'history',
    showInMenu: true
  },
  {
    path: '/mm/mm-script-library',
    name: 'Script Library',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'menu_book',
    showInMenu: true
  },
  {
    path: '/mm/tl-matchmaking-job-board',
    name: 'Matchmaking Job Board',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'dashboard_customize',
    showInMenu: true
  },
  {
    path: '/mm/tl-overview-tr-matchmaking',
    name: 'Transporter Matchmaking Overview',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'preview',
    showInMenu: true
  },
  {
    path: '/mm/tl-overview-tr-matchmaking-white-bg',
    name: 'Tr Matchmaking White Bg',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'preview',
    showInMenu: false
  },
  {
    path: '/mm/hr-analytics-summary',
    name: 'Hr Analytics Summary',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'analytics',
    showInMenu: false
  },
  {
    path: '/mm/mm-active-call-focus-refined',
    name: 'Mm Active Call Focus Refined',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'caller',
    icon: 'phone',
    showInMenu: false
  },
  {
    path: '/mm/mm-intro-manager',
    name: 'Mm Intro Manager',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'article',
    showInMenu: false
  },
  {
    path: '/mm/mm-training-hub',
    name: 'Training Hub',
    role: 'mm',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'school',
    showInMenu: true
  },

  // ==================== SPECIAL CATEGORIES (sc) ====================
  {
    path: '/sc/sc-home-dashboard',
    name: 'Home Dashboard',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: true
  },
  {
    path: '/dialer/live-console',
    name: 'Active Call Console (Live)',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'caller',
    icon: 'phone',
    showInMenu: true
  },
  {
    path: '/sc/partner-network-overview',
    name: 'Partner Network Overview',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'group',
    showInMenu: true
  },
  {
    path: '/sc/partner-queue-detail',
    name: 'Partner Queue Detail',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'queue',
    showInMenu: true
  },
  {
    path: '/sc/score-trends',
    name: 'Score Trends',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'trending_up',
    showInMenu: true
  },
  {
    path: '/sc/scoring-interface',
    name: 'Scoring Interface',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: true
  },
  {
    path: '/sc/script-editor-console',
    name: 'Script Editor Console',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'edit_note',
    showInMenu: true
  },
  {
    path: '/sc/script-compliance-tracker',
    name: 'Script Compliance Tracker',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'checklist',
    showInMenu: true
  },
  {
    path: '/sc/sc-performance-hub',
    name: 'Performance Hub',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'equalizer',
    showInMenu: true
  },
  {
    path: '/sc/special-categories-script-library',
    name: 'Script Library',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'menu_book',
    showInMenu: true
  },
  {
    path: '/sc/absconding-protocol-tracker',
    name: 'Absconding Protocol Tracker',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'warning',
    showInMenu: true
  },
  {
    path: '/sc/active-call-focus-special-categories',
    name: 'Active Call Focus Special Categories',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'caller',
    icon: 'phone',
    showInMenu: false
  },
  {
    path: '/sc/login-screen',
    name: 'Login Screen',
    role: 'sc',
    permission: 'calls:dial',
    layout: 'dashboard',
    icon: 'login',
    showInMenu: false
  },

  // ==================== MANUAL LIVE CORE FEATURES ====================
  {
    path: '/th/overview-live',
    name: 'Overview Dashboard (Live)',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'dashboard',
    showInMenu: false
  },
  {
    path: '/th/team-monitor-live',
    name: 'Team Monitor (Live)',
    role: 'th',
    permission: 'calls:view',
    layout: 'dashboard',
    icon: 'groups',
    showInMenu: false
  },
  {
    path: '/th/leads-live',
    name: 'Lead Management (Live)',
    role: 'th',
    permission: 'leads:view',
    layout: 'dashboard',
    icon: 'leaderboard',
    showInMenu: false
  },
  {
    path: '/th/sla-live',
    name: 'SLA Dashboard (Live)',
    role: 'th',
    permission: 'qc:view',
    layout: 'dashboard',
    icon: 'timer',
    showInMenu: false
  },
  {
    path: '/th/backlog-live',
    name: 'Backlog Sprint (Live)',
    role: 'th',
    permission: 'backlog:view',
    layout: 'dashboard',
    icon: 'view_week',
    showInMenu: false
  },
  {
    path: '/th/settings-live',
    name: 'Settings (Live)',
    role: 'th',
    permission: 'admin:view',
    layout: 'dashboard',
    icon: 'settings',
    showInMenu: false
  },
  {
    path: '/th/notifications-live',
    name: 'Notifications (Live)',
    role: 'th',
    layout: 'dashboard',
    icon: 'notifications',
    showInMenu: false
  },
  {
    path: '/qc/qc-console-live',
    name: 'QC Console (Live)',
    role: 'qc',
    permission: 'qc:audit',
    layout: 'dashboard',
    icon: 'fact_check',
    showInMenu: false
  },
  {
    path: '/hr/hiring-dashboard-live',
    name: 'Hiring Dashboard (Live)',
    role: 'hr',
    permission: 'hr:view',
    layout: 'dashboard',
    icon: 'badge',
    showInMenu: false
  }
];

export const routeConfig = dynamicRoutes;
