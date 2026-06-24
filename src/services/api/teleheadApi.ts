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
    getThCallLog: builder.query<any, { per_page?: number; page?: number; process?: string; caller?: string; outcome?: string; search?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/call-log',
        params,
      }),
      providesTags: ['Calls'],
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
    getThSlaDashboard: builder.query<any, void>({
      query: () => '/webcrm/telehead/sla',
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
    getThReportCrossProcess: builder.query<any, { month?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/reports/cross-process',
        params,
      }),
    }),
    getThReportBenchmarking: builder.query<any, { from?: string; to?: string }>({
      query: (params) => ({
        url: '/webcrm/telehead/reports/benchmarking',
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
} = teleheadApi;
