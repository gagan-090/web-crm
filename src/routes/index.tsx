import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import RoleGuard from './RoleGuard';
import DashboardLayout from '../layouts/DashboardLayout';
import CallerLayout from '../layouts/CallerLayout';
import LoginPage from '../features/auth/pages/LoginPage';

// Live Core Feature Imports (Fully Redux Connected)
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
import TargetAllocationConsole from '../pages/admin/TargetAllocationConsole';
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
import ThSettings from '../pages/telecalling-head/ThSettings';
import ThNotificationsAlertsCenter from '../pages/telecalling-head/ThNotificationsAlertsCenter';
import ThLeadManagementConsole from '../pages/telecalling-head/ThLeadManagementConsole';
import ThBacklogSprintManager from '../pages/telecalling-head/ThBacklogSprintManager';
import ThGlobalCallChatLog from '../pages/telecalling-head/ThGlobalCallChatLog';
import ThSlaDashboard from '../pages/telecalling-head/ThSlaDashboard';
import ThReActivationManager from '../pages/telecalling-head/ThReActivationManager';
import ThTeamMonitor from '../pages/telecalling-head/ThTeamMonitor';
import ThPostCallDispositionGate from '../pages/telecalling-head/ThPostCallDispositionGate';
import ThHomeDashboard from '../pages/telecalling-head/ThHomeDashboard';
import ThReportsHub from '../pages/telecalling-head/ThReportsHub';
import ThBacklogCampaignManager from '../pages/telecalling-head/ThBacklogCampaignManager';
import ThGlobalCampaignConsole from '../pages/telecalling-head/ThGlobalCampaignConsole';
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
import DwCallHistory from '../pages/driver-welcome/DwCallHistory';
import DwCallbackCalendar from '../pages/driver-welcome/DwCallbackCalendar';
import DwActiveCallFocus from '../pages/driver-welcome/DwActiveCallFocus';
import DwWhatsappPanel from '../pages/driver-welcome/DwWhatsappPanel';
import DwPerformanceStats from '../pages/driver-welcome/DwPerformanceStats';
import DwCampaignLeads from '../pages/driver-welcome/DwCampaignLeads';
import WctCallbackCalendar from '../pages/transporter-welcome/WctCallbackCalendar';
import WctHomeDashboard from '../pages/transporter-welcome/WctHomeDashboard';
import WctActiveCallFocus from '../pages/transporter-welcome/WctActiveCallFocus';
import WctTrainingHub from '../pages/transporter-welcome/WctTrainingHub';
import WctScriptLibrary from '../pages/transporter-welcome/WctScriptLibrary';
import WctCallQueue from '../pages/transporter-welcome/WctCallQueue';
import WctPerformanceStats from '../pages/transporter-welcome/WctPerformanceStats';
import WctDispositionGate from '../pages/transporter-welcome/WctDispositionGate';
import WctD7UpsellQueue from '../pages/transporter-welcome/WctD7UpsellQueue';
import WctCampaignLeads from '../pages/transporter-welcome/WctCampaignLeads';
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

// Incentive Engine Pages
import MyIncentivePage from '../pages/incentive/MyIncentivePage';
import PodIncentiveSummary from '../pages/team-lead/PodIncentiveSummary';
import IncentiveCommandCenter from '../pages/telecalling-head/IncentiveCommandCenter';
import PayrollExport from '../pages/telecalling-head/PayrollExport';
import IncentiveConfiguration from '../pages/admin/IncentiveConfiguration';
import ParityEquityDashboard from '../pages/admin/ParityEquityDashboard';

const RoleHomeRedirect: React.FC = () => {
  const { role } = usePermissions();

  const roleHomepages: Record<string, string> = {
    [Role.TH]: '/th/overview-live',
    [Role.TL]: '/tl/tl-overview-dashboard',
    [Role.QC]: '/qc/qc-console-live',
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
    <BrowserRouter basename="/crm">
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
          <Route path="th/overview-live" element={<RoleGuard permission="leads:view"><ThHomeDashboard /></RoleGuard>} />
          <Route path="th/team-monitor-live" element={<RoleGuard permission="calls:view"><TeamMonitorPage /></RoleGuard>} />
          <Route path="th/leads-live" element={<RoleGuard permission="leads:view"><LeadManagementPage /></RoleGuard>} />
          <Route path="th/sla-live" element={<RoleGuard permission="qc:view"><SlaDashboardPage /></RoleGuard>} />
          <Route path="th/backlog-live" element={<RoleGuard permission="backlog:view"><BacklogPage /></RoleGuard>} />
          <Route path="th/settings-live" element={<RoleGuard permission="admin:view"><SettingsPage /></RoleGuard>} />
          <Route path="th/notifications-live" element={<RoleGuard><NotificationsPage /></RoleGuard>} />
          <Route path="qc/qc-console-live" element={<RoleGuard permission="qc:audit"><QcConsolePage /></RoleGuard>} />
          <Route path="hr/hiring-dashboard-live" element={<RoleGuard permission="hr:view"><HiringDashboardPage /></RoleGuard>} />

          {/* Dynamic Dashboard Layout Routes */}
          <Route path="admin/user-management-console" element={<RoleGuard permission="admin:view"><UserManagementConsole /></RoleGuard>} />
          <Route path="admin/plan-price-manager" element={<RoleGuard permission="admin:view"><PlanPriceManager /></RoleGuard>} />
          <Route path="admin/webhook-logs-troubleshooting" element={<RoleGuard permission="admin:view"><WebhookLogsTroubleshooting /></RoleGuard>} />
          <Route path="admin/integrations-routing-config" element={<RoleGuard permission="admin:view"><IntegrationsRoutingConfig /></RoleGuard>} />
          <Route path="admin/system-health-dashboard" element={<RoleGuard permission="admin:view"><SystemHealthDashboard /></RoleGuard>} />
          <Route path="admin/process-queue-config" element={<RoleGuard permission="admin:view"><ProcessQueueConfig /></RoleGuard>} />
          <Route path="admin/target-allocation" element={<RoleGuard permission="admin:view"><TargetAllocationConsole /></RoleGuard>} />
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
          <Route path="th/settings" element={<RoleGuard permission="leads:view"><ThSettings /></RoleGuard>} />
          <Route path="th/notifications-alerts-center" element={<RoleGuard permission="leads:view"><ThNotificationsAlertsCenter /></RoleGuard>} />
          <Route path="th/lead-management-console" element={<RoleGuard permission="leads:view"><ThLeadManagementConsole /></RoleGuard>} />
          <Route path="th/backlog-sprint-manager" element={<RoleGuard permission="leads:view"><ThBacklogSprintManager /></RoleGuard>} />
          <Route path="th/sla-dashboard" element={<RoleGuard permission="leads:view"><ThSlaDashboard /></RoleGuard>} />
          <Route path="th/global-call-chat-log" element={<RoleGuard permission="leads:view"><ThGlobalCallChatLog /></RoleGuard>} />
          <Route path="th/re-activation-manager" element={<RoleGuard permission="leads:view"><ThReActivationManager /></RoleGuard>} />
          <Route path="th/team-monitor" element={<RoleGuard permission="leads:view"><ThTeamMonitor /></RoleGuard>} />
          <Route path="th/post-call-disposition-gate" element={<RoleGuard permission="leads:view"><ThPostCallDispositionGate /></RoleGuard>} />
          <Route path="th/main-overview-dashboard" element={<RoleGuard permission="leads:view"><ThHomeDashboard /></RoleGuard>} />
          <Route path="th/reports-hub" element={<RoleGuard permission="leads:view"><ThReportsHub /></RoleGuard>} />
          <Route path="th/backlog-campaign-manager" element={<RoleGuard permission="leads:view"><ThBacklogCampaignManager /></RoleGuard>} />
          <Route path="th/global-campaign-console" element={<RoleGuard permission="leads:view"><ThGlobalCampaignConsole /></RoleGuard>} />
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
          <Route path="dw/dw-call-history" element={<RoleGuard permission="calls:dial"><DwCallHistory /></RoleGuard>} />
          <Route path="dw/dw-callback-calendar" element={<RoleGuard permission="calls:dial"><DwCallbackCalendar /></RoleGuard>} />
          <Route path="dw/dw-whatsapp-panel" element={<RoleGuard permission="calls:dial"><DwWhatsappPanel /></RoleGuard>} />
          <Route path="dw/dw-performance-stats" element={<RoleGuard permission="calls:dial"><DwPerformanceStats /></RoleGuard>} />
          <Route path="dw/dw-active-call-focus" element={<RoleGuard permission="calls:dial"><DwActiveCallFocus /></RoleGuard>} />
          <Route path="dw/dw-campaign-leads" element={<RoleGuard permission="calls:dial"><DwCampaignLeads /></RoleGuard>} />
          <Route path="wct/wct-active-call-focus" element={<RoleGuard permission="calls:dial"><WctActiveCallFocus /></RoleGuard>} />
          <Route path="wct/wct-callback-calendar" element={<RoleGuard permission="calls:dial"><WctCallbackCalendar /></RoleGuard>} />
          <Route path="wct/wct-home-dashboard" element={<RoleGuard permission="calls:dial"><WctHomeDashboard /></RoleGuard>} />
          <Route path="wct/wct-training-hub" element={<RoleGuard permission="calls:dial"><WctTrainingHub /></RoleGuard>} />
          <Route path="wct/wct-script-library" element={<RoleGuard permission="calls:dial"><WctScriptLibrary /></RoleGuard>} />
          <Route path="wct/wct-call-queue" element={<RoleGuard permission="calls:dial"><WctCallQueue /></RoleGuard>} />
          <Route path="wct/wct-performance-stats" element={<RoleGuard permission="calls:dial"><WctPerformanceStats /></RoleGuard>} />
          <Route path="wct/wct-disposition-gate" element={<RoleGuard permission="calls:dial"><WctDispositionGate /></RoleGuard>} />
          <Route path="wct/wct-d7-upsell-queue" element={<RoleGuard permission="calls:dial"><WctD7UpsellQueue /></RoleGuard>} />
          <Route path="wct/wct-campaign-leads" element={<RoleGuard permission="calls:dial"><WctCampaignLeads /></RoleGuard>} />
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

          {/* ── Incentive Engine Routes ── */}
          <Route path="dw/my-incentive" element={<RoleGuard permission="calls:dial"><MyIncentivePage /></RoleGuard>} />
          <Route path="wct/my-incentive" element={<RoleGuard permission="calls:dial"><MyIncentivePage /></RoleGuard>} />
          <Route path="mm/my-incentive" element={<RoleGuard permission="calls:dial"><MyIncentivePage /></RoleGuard>} />
          <Route path="sc/my-incentive" element={<RoleGuard permission="calls:dial"><MyIncentivePage /></RoleGuard>} />
          <Route path="tl/team-incentive" element={<RoleGuard permission="leads:view"><PodIncentiveSummary /></RoleGuard>} />
          <Route path="th/incentive-command-center" element={<RoleGuard permission="leads:view"><IncentiveCommandCenter /></RoleGuard>} />
          <Route path="th/payroll-export" element={<RoleGuard permission="leads:view"><PayrollExport /></RoleGuard>} />
          <Route path="admin/incentive-config" element={<RoleGuard permission="admin:view"><IncentiveConfiguration /></RoleGuard>} />
          <Route path="admin/parity-dashboard" element={<RoleGuard permission="admin:view"><ParityEquityDashboard /></RoleGuard>} />
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
