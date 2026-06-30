import { baseApi } from './baseApi';

export interface ThOverviewResponse {
  status: boolean;
  revenue: {
    today: number;
    week: number;
    month: number;
    target: number;
    today_pct: number;
    month_pct: number;
    by_process: Record<string, {
      process: string;
      revenue: number;
      conversions: number;
      target?: number;
      tl_name?: string;
      calls_today?: number;
      conv_pct?: number;
    }>;
  };
  calls: {
    total_today: number;
    connected_today: number;
    untagged_today: number;
  };
  subscriptions: {
    today: number;
  };
  sla_alerts: {
    tr_uncalled_over_2hrs: number;
    mm_jobs_sla_risk: number;
    total: number;
  };
  team: {
    headcount: number;
    open_positions: number;
    backlog_leads: number;
  };
  live_feed: Array<{
    id: number;
    call_status: string;
    process: string;
    called_at: string;
    updated_at: string;
    lead_name: string;
    lead_mobile: string;
    lead_tmid: string;
    lead_type: string;
    caller_name: string;
    caller_process: string;
  }>;
}

export interface ThTeamMonitorResponse {
  status: boolean;
  process: string;
  total: number;
  data: Array<{
    id: number;
    name: string;
    process: string;
    emp_id: string;
    photo: string | null;
    retraining_required: boolean;
    live_status: string;
    calls_today: number;
    connected_today: number;
    untagged_today: number;
    revenue_today: number;
    queue_depth: number;
    queue_overload: boolean;
    last_call_at: string;
    last_call_status: string | null;
  }>;
}

export const teleheadApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getThOverview: builder.query<ThOverviewResponse, void>({
      query: () => '/webcrm/telehead/overview',
      providesTags: ['Leads', 'Calls'],
    }),
    getThProcessSnapshot: builder.query<any, void>({
      query: () => '/webcrm/telehead/process-snapshot',
    }),
    getThTodayStats: builder.query<any, { date?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/today-stats',
        params,
      }),
    }),
    getThTeamMonitor: builder.query<ThTeamMonitorResponse, { process?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/team-monitor',
        params,
      }),
      providesTags: ['Calls'],
    }),
    getThCallerActivity: builder.query<any, void>({
      query: () => '/webcrm/telehead/caller-activity',
      providesTags: ['Calls'],
    }),
    getThLeadManagement: builder.query<any, { page?: number; per_page?: number; search?: string; status?: string; assigned_caller?: string; caller_id?: string | number; from?: string; to?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/lead-management',
        params,
      }),
      providesTags: ['Leads'],
    }),
    getThAgentCallSnapshot: builder.query<any[], { date?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/agent-call-snapshot-v2',
        params,
      }),
    }),
    reassignThLeads: builder.mutation<any, { user_ids: number[]; to_admin_id: number; reason?: string }>({
      query: (body) => ({
        url: '/webcrm/telehead/leads/reassign',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Leads'],
    }),
    moveThLeads: builder.mutation<any, { from: number; to: number; limit: number; reason?: string }>({
      query: (body) => ({
        url: '/webcrm/telehead/move-leads',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Leads', 'Calls'],
    }),
    transferThLeads: builder.mutation<any, { from_telecaller_id: number; to_telecaller_id: number; lead_count: number }>({
      query: (body) => ({
        url: '/webcrm/telehead/transfer-leads',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Leads', 'Calls'],
    }),
    getThCallLog: builder.query<any, { per_page?: number; page?: number; process?: string; caller?: string; caller_id?: number | string; outcome?: string; search?: string; from?: string; to?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/call-log',
        params,
      }),
      providesTags: ['Calls'],
    }),

    getThTelecallers: builder.query<any, void>({
      query: () => '/webcrm/telehead/telecallers',
    }),

    getThSocialChatLog: builder.query<any, { assigned_to?: number }>({
      query: (params) => ({
        url: '/webcrm/telehead/social-media-call-history',
        params,
      }),
    }),
    getThLeads: builder.query<any, { per_page?: number; page?: number }>({
      query: (params) => ({
        url: '/webcrm/telehead/leads',
        params,
      }),
      providesTags: ['Leads'],
    }),
    getThJobs: builder.query<any, void>({
      query: () => '/webcrm/telehead/jobs',
    }),
    getThLeadsCountSummary: builder.query<any, { date?: string; assigned_to?: number; call_status?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/leads-count-summary',
        params,
      }),
    }),
    getThMoveLeadsLogs: builder.query<any, void>({
      query: () => '/webcrm/telehead/move-leads-logs',
    }),
    getThSlaDashboard: builder.query<any, { tr_page?: number; mm_page?: number; page?: number } | void>({
      query: (params) => ({
        url: '/webcrm/telehead/sla-dashboard',
        params: params || undefined,
      }),
    }),
    getThNotifications: builder.query<any, void>({
      query: () => '/webcrm/telehead/notifications',
    }),
    getThHrNewHires: builder.query<any, void>({
      query: () => '/webcrm/telehead/hr/new-hires',
      providesTags: ['Hiring'],
    }),
    assignThProcess: builder.mutation<any, { admin_id: number; process: string; notes?: string }>({
      query: (body) => ({
        url: '/webcrm/telehead/hr/assign-process',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Hiring'],
    }),
    bulkAssignThProcess: builder.mutation<any, { admin_ids: number[]; process: string; notes?: string }>({
      query: (body) => ({
        url: '/webcrm/telehead/hr/bulk-assign-process',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Hiring'],
    }),
    reassignThProcess: builder.mutation<any, { id: number; process: string; reason?: string }>({
      query: ({ id, ...body }) => ({
        url: `/webcrm/telehead/hr/reassign-process/${id}`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Hiring'],
    }),
    getThProcessAssignmentLog: builder.query<any, void>({
      query: () => '/webcrm/telehead/hr/process-assignment-log',
    }),
    getThPersonProfile: builder.query<any, { admin_id: number }>({
      query: ({ admin_id }) => `/webcrm/telehead/person/${admin_id}`,
    }),
    mandateThRetraining: builder.mutation<any, { caller_id: number; module: string; reason: string }>({
      query: (body) => ({
        url: '/webcrm/telehead/qc/mandate-retraining',
        method: 'POST',
        body,
      }),
    }),
    getThReportRevenue: builder.query<any, { from?: string; to?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/reports/revenue',
        params,
      }),
    }),
    getThReportRevenueAnalysis: builder.query<any, void>({
      query: () => '/webcrm/telehead/reports/revenue-analysis',
    }),
    getThReportTransactions: builder.query<any, { page?: number; process?: string; lead_type?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/reports/transactions',
        params,
      }),
    }),
    getThReportFunnel: builder.query<any, void>({
      query: () => '/webcrm/telehead/reports/funnel-report',
    }),
    getThReportCrossProcess: builder.query<any, { month?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/reports/cross-process',
        params,
      }),
    }),
    getThReportBenchmarking: builder.query<any, { from?: string; to?: string } | void>({
      query: (params) => ({
        url: '/webcrm/telehead/reports/caller-benchmarks',
        params,
      }),
    }),
    getThSettings: builder.query<any, void>({
      query: () => '/webcrm/telehead/settings',
      providesTags: ['Settings'],
    }),
    updateThSetting: builder.mutation<any, { key: string; value: string }>({
      query: (body) => ({
        url: '/webcrm/telehead/settings',
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    getThBacklogStats: builder.query<any, void>({
      query: () => '/webcrm/telehead/backlog',
    }),
    launchThSprint: builder.mutation<any, { caller_ids: number[]; start_date: string; end_date: string; daily_cap: number; process_filter: string }>({
      query: (body) => ({
        url: '/webcrm/telehead/backlog/launch-sprint',
        method: 'POST',
        body,
      }),
    }),
    updateThSprintProgress: builder.mutation<any, { caller_ids: number[]; daily_cap: number }>({
      query: (body) => ({
        url: '/webcrm/telehead/backlog/sprint-progress',
        method: 'POST',
        body,
      }),
    }),
    getThCampaignsOverview: builder.query<any, { from?: string; to?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/campaigns/overview',
        params,
      }),
    }),
    getThQcOverview: builder.query<any, { from?: string; to?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/qc/overview',
        params,
      }),
    }),
    getThQcFatalErrors: builder.query<any, void>({
      query: () => '/webcrm/telehead/qc/fatal-errors',
    }),
    getThEcosystemForemen: builder.query<any, void>({
      query: () => '/webcrm/telehead/ecosystem/foremen',
    }),
    getThEcosystemCommissionLedger: builder.query<any, void>({
      query: () => '/webcrm/telehead/ecosystem/commission-ledger',
    }),
    getThTeamDrilldown: builder.query<any, { tl_admin_id: number }>({
      query: ({ tl_admin_id }) => `/webcrm/telehead/team-drill/${tl_admin_id}`,
    }),
    getThUserDetails: builder.query<any, { unique_id: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/user-details',
        params,
      }),
    }),
    getThJobDetails: builder.query<any, { job_id: string }>({
      query: ({ job_id }) => `/webcrm/telehead/jobs/${job_id}`,
    }),
    getThTotalCounts: builder.query<any, void>({
      query: () => '/webcrm/telehead/total-counts',
    }),
    getThBreakLogShow: builder.query<any, { assigned_to: number }>({
      query: (params) => ({
        url: '/webcrm/telehead/break-log-show',
        params,
      }),
    }),
    getThPayments: builder.query<any, void>({
      query: () => '/webcrm/telehead/payments',
    }),
    transferThLeads: builder.mutation<any, { to_admin_id: number; user_ids: string[] }>({
      query: (body) => ({
        url: '/webcrm/telehead/leads/transfer',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Leads'],
    }),
    reassignThColdLeads: builder.mutation<any, { to_admin_id: number; user_ids: string[] }>({
      query: (body) => ({
        url: '/webcrm/telehead/cold-leads/reassign',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Leads'],
    }),
    getThSettingsIntegrations: builder.query<any, void>({
      query: () => '/webcrm/telehead/settings/integrations',
      providesTags: ['Settings'],
    }),
    getThSettingsPlans: builder.query<any, void>({
      query: () => '/webcrm/telehead/settings/plans',
      providesTags: ['Settings'],
    }),
    updateThSettingsPlan: builder.mutation<any, { key: string; value: any }>({
      query: ({ key, value }) => ({
        url: `/webcrm/telehead/settings/plans/${key}`,
        method: 'PUT',
        body: value,
      }),
      invalidatesTags: ['Settings'],
    }),
    getThSettingsCallers: builder.query<any, void>({
      query: () => '/webcrm/telehead/settings/callers',
      providesTags: ['Settings'],
    }),
    toggleThSettingsCallerStatus: builder.mutation<any, { id: string | number }>({
      query: ({ id }) => ({
        url: `/webcrm/telehead/settings/callers/${id}/toggle-status`,
        method: 'PUT',
      }),
      invalidatesTags: ['Settings'],
    }),
    getThSettingsTargets: builder.query<any, void>({
      query: () => '/webcrm/telehead/settings/targets',
      providesTags: ['Settings'],
    }),
    saveThSettingsTargets: builder.mutation<any, any>({
      query: (body) => ({
        url: '/webcrm/telehead/settings/targets',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Settings'],
    }),
    getThSettingsScripts: builder.query<any, void>({
      query: () => '/webcrm/telehead/settings/scripts',
      providesTags: ['Settings'],
    }),
    getThOverviewRevenue: builder.query<any, void>({
      query: () => '/webcrm/telehead/overview/collection-by',
    }),
    getThOverviewCampaignLeads: builder.query<any, void>({
      query: () => '/webcrm/telehead/overview/campaign-leads',
    }),
    getThOverviewTeamPerformance: builder.query<any, void>({
      query: () => '/webcrm/telehead/overview/team-performance',
    }),
    getThOverviewRevenueTrend: builder.query<any, void>({
      query: () => '/webcrm/telehead/overview/revenue-trend',
    }),
    getThOverviewSlaRisks: builder.query<any, void>({
      query: () => '/webcrm/telehead/overview/sla-risks',
    }),
    getThOverviewActivityFeed: builder.query<any, void>({
      query: () => '/webcrm/telehead/overview/activity-feed',
    }),
    getThOverviewTeamPulse: builder.query<any, void>({
      query: () => '/webcrm/telehead/overview/team-pulse',
    }),
  }),
});

export const {
  useGetThOverviewQuery,
  useGetThProcessSnapshotQuery,
  useGetThTodayStatsQuery,
  useGetThTeamMonitorQuery,
  useGetThAgentCallSnapshotQuery,
  useReassignThLeadsMutation,
  useMoveThLeadsMutation,
  useGetThCallLogQuery,
  useGetThSocialChatLogQuery,
  useGetThLeadsQuery,
  useGetThJobsQuery,
  useGetThLeadsCountSummaryQuery,
  useGetThMoveLeadsLogsQuery,
  useGetThSlaDashboardQuery,
  useGetThNotificationsQuery,
  useGetThHrNewHiresQuery,
  useAssignThProcessMutation,
  useBulkAssignThProcessMutation,
  useReassignThProcessMutation,
  useGetThProcessAssignmentLogQuery,
  useGetThPersonProfileQuery,
  useMandateThRetrainingMutation,
  useGetThReportRevenueQuery,
  useGetThReportRevenueAnalysisQuery,
  useGetThReportTransactionsQuery,
  useGetThReportFunnelQuery,
  useGetThReportCrossProcessQuery,
  useGetThReportBenchmarkingQuery,
  useGetThSettingsQuery,
  useUpdateThSettingMutation,
  useGetThBacklogStatsQuery,
  useLaunchThSprintMutation,
  useGetThCampaignsOverviewQuery,
  useGetThQcOverviewQuery,
  useGetThQcFatalErrorsQuery,
  useGetThEcosystemForemenQuery,
  useGetThEcosystemCommissionLedgerQuery,
  useGetThTeamDrilldownQuery,
  useGetThUserDetailsQuery,
  useGetThJobDetailsQuery,
  useGetThTotalCountsQuery,
  useGetThBreakLogShowQuery,
  useGetThPaymentsQuery,
  useTransferThLeadsMutation,
  useReassignThColdLeadsMutation,
  useGetThCallerActivityQuery,
  useGetThLeadManagementQuery,
  useGetThTelecallersQuery,
  useUpdateThSprintProgressMutation,
  useGetThSettingsIntegrationsQuery,
  useGetThSettingsPlansQuery,
  useUpdateThSettingsPlanMutation,
  useGetThSettingsCallersQuery,
  useToggleThSettingsCallerStatusMutation,
  useGetThSettingsTargetsQuery,
  useSaveThSettingsTargetsMutation,
  useGetThSettingsScriptsQuery,
  useGetThOverviewRevenueQuery,
  useGetThOverviewCampaignLeadsQuery,
  useGetThOverviewTeamPerformanceQuery,
  useGetThOverviewRevenueTrendQuery,
  useGetThOverviewSlaRisksQuery,
  useGetThOverviewActivityFeedQuery,
  useGetThOverviewTeamPulseQuery,
} = teleheadApi;
