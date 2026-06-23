import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';
import DashboardLayout from '../layouts/DashboardLayout';
import CallerLayout from '../layouts/CallerLayout';
import LoginPage from '../features/auth/pages/LoginPage';

// Live Core Feature Imports (Fully Redux Connected)
import OverviewPage from '../features/dashboard/pages/OverviewPage';
import TeamMonitorPage from '../features/dashboard/pages/TeamMonitorPage';
import LeadManagementPage from '../features/leads/pages/LeadManagementPage';
import SlaDashboardPage from '../features/dashboard/pages/SlaDashboardPage';
import QcConsolePage from '../features/qc/pages/QcConsolePage';
import HiringDashboardPage from '../features/hr/pages/HiringDashboardPage';
import BacklogPage from '../features/backlog/pages/BacklogPage';
import SettingsPage from '../features/settings/pages/SettingsPage';
import NotificationsPage from '../features/notifications/pages/NotificationsPage';
import ActiveCallPage from '../features/calls/pages/ActiveCallPage';
import { usePermissions } from '../shared/hooks/usePermissions';
import { Role } from '../shared/constants/roles';

// Domain-Specific Generated Pages Imports
import UserManagementConsole from '../pages/admin/UserManagementConsole';
import PlanPriceManager from '../pages/admin/PlanPriceManager';
import WebhookLogsTroubleshooting from '../pages/admin/WebhookLogsTroubleshooting';
import IntegrationsRoutingConfig from '../pages/admin/IntegrationsRoutingConfig';
import SystemHealthDashboard from '../pages/admin/SystemHealthDashboard';
import ProcessQueueConfig from '../pages/admin/ProcessQueueConfig';
import AttendanceManagement from '../pages/human-resources/AttendanceManagement';
import OnboardingTracker from '../pages/human-resources/OnboardingTracker';
import HiringDashboard from '../pages/human-resources/HiringDashboard';
import ExitManagement from '../pages/human-resources/ExitManagement';
import HeadcountOverview from '../pages/human-resources/HeadcountOverview';
import PolicyReferencePanel from '../pages/human-resources/PolicyReferencePanel';
import DocumentVault from '../pages/human-resources/DocumentVault';
import Page09Hiring from '../pages/human-resources/Page09Hiring';
import HiringPipeline from '../pages/human-resources/HiringPipeline';
import PayrollProcessing from '../pages/human-resources/PayrollProcessing';
import IncentiveVerification from '../pages/human-resources/IncentiveVerification';
import FeedbackManager from '../pages/quality-control/FeedbackManager';
import CalibrationSessionManager from '../pages/quality-control/CalibrationSessionManager';
import FatalErrorLog from '../pages/quality-control/FatalErrorLog';
import WeeklyQcReportGenerator from '../pages/quality-control/WeeklyQcReportGenerator';
import TlQcFeedbackInbox from '../pages/quality-control/TlQcFeedbackInbox';
import QcConsoleHome from '../pages/quality-control/QcConsoleHome';
import RevenueAttributionAudit from '../pages/quality-control/RevenueAttributionAudit';
import CrmDataIntegrity from '../pages/quality-control/CrmDataIntegrity';
import Page06QcConsole from '../pages/quality-control/Page06QcConsole';
import FeedbackComposer from '../pages/quality-control/FeedbackComposer';
import QcConsoleRefined from '../pages/quality-control/QcConsoleRefined';
import AuditQueue from '../pages/quality-control/AuditQueue';
import SystemAuditLogs from '../pages/quality-control/SystemAuditLogs';
import Settings from '../pages/telecalling-head/Settings';
import Page10Notifications from '../pages/telecalling-head/Page10Notifications';
import NotificationsAlertsCenter from '../pages/telecalling-head/NotificationsAlertsCenter';
import LeadManagementConsole from '../pages/telecalling-head/LeadManagementConsole';
import Page01Dashboard from '../pages/telecalling-head/Page01Dashboard';
import BacklogSprintManager from '../pages/telecalling-head/BacklogSprintManager';
import Page02Login from '../pages/telecalling-head/Page02Login';
import SlaDashboard from '../pages/telecalling-head/SlaDashboard';
import ReActivationManager from '../pages/telecalling-head/ReActivationManager';
import Page05SlaDashboard from '../pages/telecalling-head/Page05SlaDashboard';
import Page08BacklogSprint from '../pages/telecalling-head/Page08BacklogSprint';
import TeamMonitor from '../pages/telecalling-head/TeamMonitor';
import PostCallDispositionGate from '../pages/telecalling-head/PostCallDispositionGate';
import MainOverviewDashboard from '../pages/telecalling-head/MainOverviewDashboard';
import ReportsHub from '../pages/telecalling-head/ReportsHub';
import Page04LeadManagement from '../pages/telecalling-head/Page04LeadManagement';
import BacklogCampaignManager from '../pages/telecalling-head/BacklogCampaignManager';
import Page07Settings from '../pages/telecalling-head/Page07Settings';
import Page03TeamMonitor from '../pages/telecalling-head/Page03TeamMonitor';
import TlTeamCallbackCalendar from '../pages/team-lead/TlTeamCallbackCalendar';
import TlRealTimeMonitor from '../pages/team-lead/TlRealTimeMonitor';
import TlLeadQueueManager from '../pages/team-lead/TlLeadQueueManager';
import TlDailyWrapUpPanel from '../pages/team-lead/TlDailyWrapUpPanel';
import TlCallerProfileDetail from '../pages/team-lead/TlCallerProfileDetail';
import TlOverviewDashboard from '../pages/team-lead/TlOverviewDashboard';
import DwHomeDashboard from '../pages/driver-welcome/DwHomeDashboard';
import TlOverviewDriverWelcome from '../pages/driver-welcome/TlOverviewDriverWelcome';
import DwTrainingHub from '../pages/driver-welcome/DwTrainingHub';
import DwScriptLibrary from '../pages/driver-welcome/DwScriptLibrary';
import DwCallQueue from '../pages/driver-welcome/DwCallQueue';
import DwCallbackCalendar from '../pages/driver-welcome/DwCallbackCalendar';
import DwActiveCallFocus from '../pages/driver-welcome/DwActiveCallFocus';
import DwDispositionGate from '../pages/driver-welcome/DwDispositionGate';
import DwWhatsappPanel from '../pages/driver-welcome/DwWhatsappPanel';
import DwPerformanceStats from '../pages/driver-welcome/DwPerformanceStats';
import WctCallbackCalendar from '../pages/transporter-welcome/WctCallbackCalendar';
import WctHomeDashboard from '../pages/transporter-welcome/WctHomeDashboard';
import WctActiveCallFocus from '../pages/transporter-welcome/WctActiveCallFocus';
import WctTrainingHub from '../pages/transporter-welcome/WctTrainingHub';
import WctScriptLibrary from '../pages/transporter-welcome/WctScriptLibrary';
import WctCallQueue from '../pages/transporter-welcome/WctCallQueue';
import WctPerformanceStats from '../pages/transporter-welcome/WctPerformanceStats';
import WctDispositionGate from '../pages/transporter-welcome/WctDispositionGate';
import WctD7UpsellQueue from '../pages/transporter-welcome/WctD7UpsellQueue';
import HrAnalyticsSummary from '../pages/matchmaking/HrAnalyticsSummary';
import MmDriverBank from '../pages/matchmaking/MmDriverBank';
import TlOverviewTrMatchmaking from '../pages/matchmaking/TlOverviewTrMatchmaking';
import TlOverviewTrMatchmakingWhiteBg from '../pages/matchmaking/TlOverviewTrMatchmakingWhiteBg';
import MmActiveCallFocusRefined from '../pages/matchmaking/MmActiveCallFocusRefined';
import MmIntroManager from '../pages/matchmaking/MmIntroManager';
import MmHomeDashboard from '../pages/matchmaking/MmHomeDashboard';
import TlMatchmakingJobBoard from '../pages/matchmaking/TlMatchmakingJobBoard';
import MmPlacementConfirmation from '../pages/matchmaking/MmPlacementConfirmation';
import MmDriverSearch from '../pages/matchmaking/MmDriverSearch';
import MmScriptLibrary from '../pages/matchmaking/MmScriptLibrary';
import MmJobBoard from '../pages/matchmaking/MmJobBoard';
import MmTrainingHub from '../pages/matchmaking/MmTrainingHub';
import MmPlacementHistory from '../pages/matchmaking/MmPlacementHistory';
import GlobalOverlaysContainer from '../shared/components/business/GlobalOverlaysContainer';
import ScoreTrends from '../pages/special-categories/ScoreTrends';
import ScriptEditorConsole from '../pages/special-categories/ScriptEditorConsole';
import ScoringInterface from '../pages/special-categories/ScoringInterface';
import ScriptComplianceTracker from '../pages/special-categories/ScriptComplianceTracker';
import ScPerformanceHub from '../pages/special-categories/ScPerformanceHub';
import PartnerNetworkOverview from '../pages/special-categories/PartnerNetworkOverview';
import SpecialCategoriesScriptLibrary from '../pages/special-categories/SpecialCategoriesScriptLibrary';
import PartnerQueueDetail from '../pages/special-categories/PartnerQueueDetail';
import ActiveCallFocusSpecialCategories from '../pages/special-categories/ActiveCallFocusSpecialCategories';
import LoginScreen from '../pages/special-categories/LoginScreen';
import ScHomeDashboard from '../pages/special-categories/ScHomeDashboard';
import AbscondingProtocolTracker from '../pages/special-categories/AbscondingProtocolTracker';

const RoleHomeRedirect: React.FC = () => {
  const { role } = usePermissions();

  const roleHomepages: Record<string, string> = {
    [Role.TH]: '/th/overview-live',
    [Role.TL]: '/tl/tl-overview-dashboard',
    [Role.QC]: '/qc/qc-overview',
    [Role.HR]: '/hr/hiring-dashboard-live',
    [Role.ADMIN]: '/admin/system-health-dashboard',
    [Role.DW]: '/dw/dw-home-dashboard',
    [Role.WCT]: '/wct/wct-home-dashboard',
    [Role.MM]: '/mm/mm-home-dashboard',
    [Role.SC]: '/sc/sc-home-dashboard'
  };

  const home = role ? roleHomepages[role] : '/login';
  return <Navigate to={home || '/login'} replace />;
};

export const AppRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />

        {/* Dashboard Layout - Protected & Guarded */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          {/* Default dashboard redirect based on role */}
          <Route index element={<RoleHomeRedirect />} />
          
          {/* Live Core Features (Redux Connected) */}
          <Route path="th/overview-live" element={<RoleGuard permission="leads:view"><OverviewPage /></RoleGuard>} />
          <Route path="th/team-monitor-live" element={<RoleGuard permission="calls:view"><TeamMonitorPage /></RoleGuard>} />
          <Route path="th/leads-live" element={<RoleGuard permission="leads:view"><LeadManagementPage /></RoleGuard>} />
          <Route path="th/sla-live" element={<RoleGuard permission="qc:view"><SlaDashboardPage /></RoleGuard>} />
          <Route path="th/backlog-live" element={<RoleGuard permission="backlog:view"><BacklogPage /></RoleGuard>} />
          <Route path="th/settings-live" element={<RoleGuard permission="admin:view"><SettingsPage /></RoleGuard>} />
          <Route path="th/notifications-live" element={<RoleGuard><NotificationsPage /></RoleGuard>} />
          <Route path="qc/qc-console-live" element={<RoleGuard permission="qc:audit"><QcConsolePage /></RoleGuard>} />
          <Route path="qc/qc-overview" element={<RoleGuard permission="qc:view"><QcConsolePage /></RoleGuard>} />
          <Route path="hr/hiring-dashboard-live" element={<RoleGuard permission="hr:view"><HiringDashboardPage /></RoleGuard>} />
          
          {/* Dynamic Dashboard Layout Routes */}
          <Route path="admin/user-management-console" element={<RoleGuard permission="admin:view"><UserManagementConsole /></RoleGuard>} />
          <Route path="admin/plan-price-manager" element={<RoleGuard permission="admin:view"><PlanPriceManager /></RoleGuard>} />
          <Route path="admin/webhook-logs-troubleshooting" element={<RoleGuard permission="admin:view"><WebhookLogsTroubleshooting /></RoleGuard>} />
          <Route path="admin/integrations-routing-config" element={<RoleGuard permission="admin:view"><IntegrationsRoutingConfig /></RoleGuard>} />
          <Route path="admin/system-health-dashboard" element={<RoleGuard permission="admin:view"><SystemHealthDashboard /></RoleGuard>} />
          <Route path="admin/process-queue-config" element={<RoleGuard permission="admin:view"><ProcessQueueConfig /></RoleGuard>} />
          <Route path="hr/attendance-management" element={<RoleGuard permission="hr:view"><AttendanceManagement /></RoleGuard>} />
          <Route path="hr/onboarding-tracker" element={<RoleGuard permission="hr:view"><OnboardingTracker /></RoleGuard>} />
          <Route path="hr/hiring-dashboard" element={<RoleGuard permission="hr:view"><HiringDashboard /></RoleGuard>} />
          <Route path="hr/exit-management" element={<RoleGuard permission="hr:view"><ExitManagement /></RoleGuard>} />
          <Route path="hr/headcount-overview" element={<RoleGuard permission="hr:view"><HeadcountOverview /></RoleGuard>} />
          <Route path="hr/policy-reference-panel" element={<RoleGuard permission="hr:view"><PolicyReferencePanel /></RoleGuard>} />
          <Route path="hr/document-vault" element={<RoleGuard permission="hr:view"><DocumentVault /></RoleGuard>} />
          <Route path="hr/page09-hiring" element={<RoleGuard permission="hr:view"><Page09Hiring /></RoleGuard>} />
          <Route path="hr/hiring-pipeline" element={<RoleGuard permission="hr:view"><HiringPipeline /></RoleGuard>} />
          <Route path="hr/payroll-processing" element={<RoleGuard permission="hr:view"><PayrollProcessing /></RoleGuard>} />
          <Route path="hr/incentive-verification" element={<RoleGuard permission="hr:view"><IncentiveVerification /></RoleGuard>} />
          <Route path="qc/feedback-manager" element={<RoleGuard permission="qc:view"><FeedbackManager /></RoleGuard>} />
          <Route path="qc/calibration-session-manager" element={<RoleGuard permission="qc:view"><CalibrationSessionManager /></RoleGuard>} />
          <Route path="qc/fatal-error-log" element={<RoleGuard permission="qc:view"><FatalErrorLog /></RoleGuard>} />
          <Route path="qc/weekly-qc-report-generator" element={<RoleGuard permission="qc:view"><WeeklyQcReportGenerator /></RoleGuard>} />
          <Route path="qc/tl-qc-feedback-inbox" element={<RoleGuard permission="qc:view"><TlQcFeedbackInbox /></RoleGuard>} />
          <Route path="qc/qc-console-home" element={<RoleGuard permission="qc:view"><QcConsoleHome /></RoleGuard>} />
          <Route path="qc/revenue-attribution-audit" element={<RoleGuard permission="qc:view"><RevenueAttributionAudit /></RoleGuard>} />
          <Route path="qc/crm-data-integrity" element={<RoleGuard permission="qc:view"><CrmDataIntegrity /></RoleGuard>} />
          <Route path="qc/page06-qc-console" element={<RoleGuard permission="qc:view"><Page06QcConsole /></RoleGuard>} />
          <Route path="qc/feedback-composer" element={<RoleGuard permission="qc:view"><FeedbackComposer /></RoleGuard>} />
          <Route path="qc/qc-console-refined" element={<RoleGuard permission="qc:view"><QcConsoleRefined /></RoleGuard>} />
          <Route path="qc/audit-queue" element={<RoleGuard permission="qc:view"><AuditQueue /></RoleGuard>} />
          <Route path="qc/system-audit-logs" element={<RoleGuard permission="qc:view"><SystemAuditLogs /></RoleGuard>} />
          <Route path="th/settings" element={<RoleGuard permission="leads:view"><Settings /></RoleGuard>} />
          <Route path="th/page10-notifications" element={<RoleGuard permission="leads:view"><Page10Notifications /></RoleGuard>} />
          <Route path="th/notifications-alerts-center" element={<RoleGuard permission="leads:view"><NotificationsAlertsCenter /></RoleGuard>} />
          <Route path="th/lead-management-console" element={<RoleGuard permission="leads:view"><LeadManagementConsole /></RoleGuard>} />
          <Route path="th/page01-dashboard" element={<RoleGuard permission="leads:view"><Page01Dashboard /></RoleGuard>} />
          <Route path="th/backlog-sprint-manager" element={<RoleGuard permission="leads:view"><BacklogSprintManager /></RoleGuard>} />
          <Route path="th/page02-login" element={<RoleGuard permission="leads:view"><Page02Login /></RoleGuard>} />
          <Route path="th/sla-dashboard" element={<RoleGuard permission="leads:view"><SlaDashboard /></RoleGuard>} />
          <Route path="th/re-activation-manager" element={<RoleGuard permission="leads:view"><ReActivationManager /></RoleGuard>} />
          <Route path="th/page05-sla-dashboard" element={<RoleGuard permission="leads:view"><Page05SlaDashboard /></RoleGuard>} />
          <Route path="th/page08-backlog-sprint" element={<RoleGuard permission="leads:view"><Page08BacklogSprint /></RoleGuard>} />
          <Route path="th/team-monitor" element={<RoleGuard permission="leads:view"><TeamMonitor /></RoleGuard>} />
          <Route path="th/post-call-disposition-gate" element={<RoleGuard permission="leads:view"><PostCallDispositionGate /></RoleGuard>} />
          <Route path="th/main-overview-dashboard" element={<RoleGuard permission="leads:view"><MainOverviewDashboard /></RoleGuard>} />
          <Route path="th/reports-hub" element={<RoleGuard permission="leads:view"><ReportsHub /></RoleGuard>} />
          <Route path="th/page04-lead-management" element={<RoleGuard permission="leads:view"><Page04LeadManagement /></RoleGuard>} />
          <Route path="th/backlog-campaign-manager" element={<RoleGuard permission="leads:view"><BacklogCampaignManager /></RoleGuard>} />
          <Route path="th/page07-settings" element={<RoleGuard permission="leads:view"><Page07Settings /></RoleGuard>} />
          <Route path="th/page03-team-monitor" element={<RoleGuard permission="leads:view"><Page03TeamMonitor /></RoleGuard>} />
          <Route path="tl/tl-overview-dashboard" element={<RoleGuard permission="leads:view"><TlOverviewDashboard /></RoleGuard>} />
          <Route path="tl/tl-team-callback-calendar" element={<RoleGuard permission="leads:view"><TlTeamCallbackCalendar /></RoleGuard>} />
          <Route path="tl/tl-real-time-monitor" element={<RoleGuard permission="leads:view"><TlRealTimeMonitor /></RoleGuard>} />
          <Route path="tl/tl-lead-queue-manager" element={<RoleGuard permission="leads:view"><TlLeadQueueManager /></RoleGuard>} />
          <Route path="tl/tl-daily-wrap-up-panel" element={<RoleGuard permission="leads:view"><TlDailyWrapUpPanel /></RoleGuard>} />
          <Route path="tl/tl-caller-profile-detail" element={<RoleGuard permission="leads:view"><TlCallerProfileDetail /></RoleGuard>} />
          <Route path="dw/dw-home-dashboard" element={<RoleGuard permission="calls:dial"><DwHomeDashboard /></RoleGuard>} />
          <Route path="dw/tl-overview-driver-welcome" element={<RoleGuard permission="calls:dial"><TlOverviewDriverWelcome /></RoleGuard>} />
          <Route path="dw/dw-training-hub" element={<RoleGuard permission="calls:dial"><DwTrainingHub /></RoleGuard>} />
          <Route path="dw/dw-script-library" element={<RoleGuard permission="calls:dial"><DwScriptLibrary /></RoleGuard>} />
          <Route path="dw/dw-call-queue" element={<RoleGuard permission="calls:dial"><DwCallQueue /></RoleGuard>} />
          <Route path="dw/dw-callback-calendar" element={<RoleGuard permission="calls:dial"><DwCallbackCalendar /></RoleGuard>} />
          <Route path="dw/dw-disposition-gate" element={<RoleGuard permission="calls:dial"><DwDispositionGate /></RoleGuard>} />
          <Route path="dw/dw-whatsapp-panel" element={<RoleGuard permission="calls:dial"><DwWhatsappPanel /></RoleGuard>} />
          <Route path="dw/dw-performance-stats" element={<RoleGuard permission="calls:dial"><DwPerformanceStats /></RoleGuard>} />
          <Route path="dw/dw-active-call-focus" element={<RoleGuard permission="calls:dial"><DwActiveCallFocus /></RoleGuard>} />
          <Route path="wct/wct-active-call-focus" element={<RoleGuard permission="calls:dial"><WctActiveCallFocus /></RoleGuard>} />
          <Route path="wct/wct-callback-calendar" element={<RoleGuard permission="calls:dial"><WctCallbackCalendar /></RoleGuard>} />
          <Route path="wct/wct-home-dashboard" element={<RoleGuard permission="calls:dial"><WctHomeDashboard /></RoleGuard>} />
          <Route path="wct/wct-training-hub" element={<RoleGuard permission="calls:dial"><WctTrainingHub /></RoleGuard>} />
          <Route path="wct/wct-script-library" element={<RoleGuard permission="calls:dial"><WctScriptLibrary /></RoleGuard>} />
          <Route path="wct/wct-call-queue" element={<RoleGuard permission="calls:dial"><WctCallQueue /></RoleGuard>} />
          <Route path="wct/wct-performance-stats" element={<RoleGuard permission="calls:dial"><WctPerformanceStats /></RoleGuard>} />
          <Route path="wct/wct-disposition-gate" element={<RoleGuard permission="calls:dial"><WctDispositionGate /></RoleGuard>} />
          <Route path="wct/wct-d7-upsell-queue" element={<RoleGuard permission="calls:dial"><WctD7UpsellQueue /></RoleGuard>} />
          <Route path="mm/hr-analytics-summary" element={<RoleGuard permission="calls:dial"><HrAnalyticsSummary /></RoleGuard>} />
          <Route path="mm/mm-driver-bank" element={<RoleGuard permission="calls:dial"><MmDriverBank /></RoleGuard>} />
          <Route path="mm/tl-overview-tr-matchmaking" element={<RoleGuard permission="calls:dial"><TlOverviewTrMatchmaking /></RoleGuard>} />
          <Route path="mm/tl-overview-tr-matchmaking-white-bg" element={<RoleGuard permission="calls:dial"><TlOverviewTrMatchmakingWhiteBg /></RoleGuard>} />
          <Route path="mm/mm-intro-manager" element={<RoleGuard permission="calls:dial"><MmIntroManager /></RoleGuard>} />
          <Route path="mm/mm-home-dashboard" element={<RoleGuard permission="calls:dial"><MmHomeDashboard /></RoleGuard>} />
          <Route path="mm/tl-matchmaking-job-board" element={<RoleGuard permission="calls:dial"><TlMatchmakingJobBoard /></RoleGuard>} />
          <Route path="mm/mm-placement-confirmation" element={<RoleGuard permission="calls:dial"><MmPlacementConfirmation /></RoleGuard>} />
          <Route path="mm/mm-driver-search" element={<RoleGuard permission="calls:dial"><MmDriverSearch /></RoleGuard>} />
          <Route path="mm/mm-script-library" element={<RoleGuard permission="calls:dial"><MmScriptLibrary /></RoleGuard>} />
          <Route path="mm/mm-placement-history" element={<RoleGuard permission="calls:dial"><MmPlacementHistory /></RoleGuard>} />
          <Route path="mm/mm-job-board" element={<RoleGuard permission="calls:dial"><MmJobBoard /></RoleGuard>} />
          <Route path="mm/mm-training-hub" element={<RoleGuard permission="calls:dial"><MmTrainingHub /></RoleGuard>} />
          <Route path="sc/score-trends" element={<RoleGuard permission="calls:dial"><ScoreTrends /></RoleGuard>} />
          <Route path="sc/script-editor-console" element={<RoleGuard permission="calls:dial"><ScriptEditorConsole /></RoleGuard>} />
          <Route path="sc/scoring-interface" element={<RoleGuard permission="calls:dial"><ScoringInterface /></RoleGuard>} />
          <Route path="sc/script-compliance-tracker" element={<RoleGuard permission="calls:dial"><ScriptComplianceTracker /></RoleGuard>} />
          <Route path="sc/sc-performance-hub" element={<RoleGuard permission="calls:dial"><ScPerformanceHub /></RoleGuard>} />
          <Route path="sc/partner-network-overview" element={<RoleGuard permission="calls:dial"><PartnerNetworkOverview /></RoleGuard>} />
          <Route path="sc/special-categories-script-library" element={<RoleGuard permission="calls:dial"><SpecialCategoriesScriptLibrary /></RoleGuard>} />
          <Route path="sc/partner-queue-detail" element={<RoleGuard permission="calls:dial"><PartnerQueueDetail /></RoleGuard>} />
          <Route path="sc/login-screen" element={<RoleGuard permission="calls:dial"><LoginScreen /></RoleGuard>} />
          <Route path="sc/sc-home-dashboard" element={<RoleGuard permission="calls:dial"><ScHomeDashboard /></RoleGuard>} />
          <Route path="sc/absconding-protocol-tracker" element={<RoleGuard permission="calls:dial"><AbscondingProtocolTracker /></RoleGuard>} />
        </Route>

        {/* Caller Layout - Focus dialer viewports */}
        <Route
          path="/dialer"
          element={
            <ProtectedRoute>
              <CallerLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dialer/live-console" replace />} />
          <Route path="live-console" element={<RoleGuard permission="calls:dial"><ActiveCallPage /></RoleGuard>} />
          <Route path="mm/mm-active-call-focus-refined" element={<RoleGuard permission="calls:dial"><MmActiveCallFocusRefined /></RoleGuard>} />
          <Route path="sc/active-call-focus-special-categories" element={<RoleGuard permission="calls:dial"><ActiveCallFocusSpecialCategories /></RoleGuard>} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <GlobalOverlaysContainer />
    </BrowserRouter>
  );
};
export default AppRoutes;
