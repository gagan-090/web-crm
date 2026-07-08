import { baseApi } from './baseApi';

export interface DwLead {
  id: number;
  tmid: string;
  name: string;
  mobile: string;
  city: string;
  state: string;
  vehicle_type: string;
  registered_at: string;
  profile_complete: boolean;
  last_status: string | null;
  last_feedback: string | null;
  last_remarks: string | null;
  last_call_at: string | null;
  last_payment: number | null;
  current_plan: string | null;
  call_count: number;
}

export interface DwCdrStats {
  agent_name: string | null;
  total_calls: number;
  connected: number;
  missed_calls: number;
  incoming_total: number;
  incoming_missed: number;
  outgoing_total: number;
  outgoing_missed: number;
  talk_time: string;
  total_duration: string;
  avg_ring_seconds: number;
  recent_missed: Array<{
    caller_id: string | null;
    call_type: string | null;
    start_time: string | null;
    ring_durn: string | null;
    cause_txt: string | null;
    user_id: number | null;
    user_name: string | null;
    user_tmid: string | null;
  }>;
}

export interface DwSubscriptionStats {
  period: string;
  period_count: number;
  period_amount: number;
  today_count: number;
  today_amount: number;
  month_count: number;
  month_amount: number;
}

export interface DwDashboardResponse {
  status: boolean;
  data: {
    kpis: {
      calls_pending: number;
      assigned_total: number;
      calls_today: number;
      connected_today: number;
      subscriptions_today: number;
      feedback_missing: number;
      call_time: string;
      monthly_revenue: number;
      missed_calls: number;
      incoming_missed: number;
    };
    cdr_stats: DwCdrStats;
    subscriptions: DwSubscriptionStats;
    overdue_callbacks: Array<{
      id: number;
      tmid: string;
      name: string;
      mobile: string;
      reason: string;
      logged_at: string;
    }>;
    call_breakdown: Array<{
      process: string;
      total: number;
    }>;
    leaderboard: {
      my_rank: number;
      total_peers: number;
    };
    caller: {
      id: number;
      name: string;
    };
  };
}

export interface DwQueueResponse {
  status: boolean;
  data: {
    leads: Array<DwLead>;
    summary: {
      total: number;
      fresh: number;
      callback: number;
      contacted: number;
    };
    pagination: {
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
    };
    filter: string;
  };
}

export interface DwNextLeadResponse {
  status: boolean;
  data: {
    id: number;
    tmid: string;
    name: string;
    mobile: string;
    city: string;
    state: string;
    vehicle_type: string;
    registered_at: string;
    last_status: string | null;
    last_feedback: string | null;
    last_call_at: string | null;
    call_count: number;
    current_plan: string;
  } | null;
  message?: string;
}

export interface DwLeadDetailResponse {
  status: boolean;
  data: {
    profile: {
      id: number;
      tmid: string;
      name: string;
      mobile: string;
      city: string;
      state: string;
      vehicle_type: string;
      license_number: string | null;
      license_type: string | null;
      license_expiry: string | null;
      experience: string | null;
      profile_complete: boolean;
      registered_at: string;
      language: string;
      referral_code: string | null;
      // Extended profile fields
      dob: string | null;
      sex: string | null;
      father_name: string | null;
      marital_status: string | null;
      education: string | null;
      email: string | null;
      address: string | null;
      pincode: string | null;
      current_income: number | null;
      expected_income: number | null;
      job_placement: string | null;
      preferred_location: string | null;
      routes: string | null;
      previous_employer: string | null;
      assigned_to: number | null;
    };
    plan_card: {
      has_plan: boolean;
      plan_label: string;
      amount: number;
      expires_at: string | null;
    };
    call_history: Array<{
      id: number;
      user_id: number;
      assigned_to: number;
      call_status: string;
      call_feedback: string;
      call_remarks: string | null;
      call_recording: string | null;
      active_time: number;
      process: string;
      call_type: string;
      created_at: string;
      caller_name: string | null;
    }>;
    ivr_history: Array<{
      id: number;
      assigned_to: number;
      assigned_name: string | null;
      user_id: number;
      user_tm_id: string;
      user_name: string;
      user_mobile: string;
      process: string;
      call_status: string;
      call_feedback: string | null;
      call_remarks: string | null;
      call_recording: string | null;
      created_at: string;
      active_time?: number;
    }>;
    mm_history?: Array<any>;
    applied_jobs?: Array<any>;
    payments: Array<{
      id: number;
      subscription_plan_id: string | null;
      user_id: number;
      unique_id: string;
      amount: number;
      payment_status: string;
      start_at: number;
      end_at: number;
      created_at: string;
      plan_label: string;
    }>;
    total_calls: number;
    total_revenue: number;
  };
}

export interface DwDispositionOptionsResponse {
  status: boolean;
  data: {
    call_statuses: Array<{
      value: string;
      label: string;
      label_hi: string;
    }>;
    feedbacks: Array<{
      value: string;
      label: string;
      color: string;
    }>;
  };
}

export interface DwPerformanceResponse {
  status: boolean;
  data: {
    period: string;
    metrics: {
      total_calls: number;
      connected: number;
      conversions: number;
      revenue: number;
      connect_rate: number;
      conversion_rate: number;
      avg_call_time: string;
    };
    dispositions: Array<{
      call_feedback: string;
      count: number;
    }>;
    daily_trend: Array<{
      date: string;
      calls: number;
      conversions: number;
    }>;
    monthly: {
      revenue: number;
      target: number;
      pct: number;
    };
    salary_gate: {
      base_salary: number;
      threshold: number;
      achieved: number;
      cleared: boolean;
      gap: number;
    };
  };
}

export interface DwCallbacksResponse {
  status: boolean;
  data: Array<{
    id: number;
    user_id?: number;
    tmid: string;
    name: string;
    mobile: string;
    city: string;
    reason: string;
    logged_at: string;
    scheduled_for: string;
  }>;
  total: number;
}

export interface DwCallHistoryResponse {
  status: boolean;
  data: Array<{
    id: number;
    tmid: string;
    name: string;
    mobile: string;
    call_status: string;
    call_feedback: string;
    call_remarks: string | null;
    call_recording: string | null;
    duration_secs: number;
    process: string;
    call_type: string;
    created_at: string;
    date_display: string;
    recording_url: string | null;
  }>;
  pagination: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface DwBreakStatusResponse {
  status: boolean;
  data: {
    on_break: boolean;
    break_log: Array<{
      id: number;
      admin_id: number;
      start_time: string;
      end_time: string | null;
      created_at: string;
      duration: string;
    }>;
  };
}


export interface WctDashboardResponse {
  status: boolean;
  data: {
    kpis: {
      assignedCount: number;
      todaySlaCount: number;
      complianceRate: number;
      upsellsCount: number;
    };
    overdueCallbacks: Array<{
      id: number;
      tmid: string;
      name: string;
      phone: string;
      callback: string;
      reason: string;
    }>;
  };
}

export interface WctQueueResponse {
  status: boolean;
  leads: Array<{
    id: string;
    tmid: string;
    name: string;
    phone: string;
    city: string;
    state: string;
    registeredDaysAgo: number;
    attempts: string[];
    lastStatus: string;
    fleetSize: number;
    operatingSegment: string;
    avgKmPerMonth: string;
    subscribed: boolean;
    whatsapp: boolean;
    notes: string;
    history: Array<{
      date: string;
      duration: string;
      status: string;
      caller: string;
    }>;
  }>;
}

export interface MmDashboardResponse {
  status: boolean;
  data: {
    user: {
      name: string;
      role: string;
    };
    stats: {
      total_jobs: { count: number };
      approved_jobs: { count: number };
      pending_jobs: { count: number };
      closed_jobs: { count: number };
      expired_jobs: { count: number };
      expiring_soon_jobs: { count: number };
      total_applicants: { count: number };
    };
    job_categories: {
      regular_jobs: number;
      greenline_jobs: number;
    };
  };
}

export interface MmJobsResponse {
  status: boolean;
  jobs: Array<{
    id: string;
    jobId: string;
    route: string;
    transporter: string;
    transporterId?: number;
    transporterTmid: string;
    phone: string;
    tier: string;
    truckType: string;
    experience: string;
    salary: string;
    license: string;
    status: string;
    daysOpen: number;
  }>;
}

export interface MmDriversResponse {
  status: boolean;
  drivers: Array<{
    id: number;
    tmid: string;
    name: string;
    phone: string;
    license: string;
    experience: string;
    city: string;
    state: string;
    routes: string;
    matchScore: number;
    lastCall: string;
  }>;
}

export interface MmJobApplicantsResponse {
  status: boolean;
  applicants: Array<{
    id: number;
    tmid: string;
    name: string;
    phone: string;
    license: string;
    experience: string;
    city: string;
    state: string;
    matchPercent: number;
    lastStatus: string;
  }>;
}

export interface MmJobCallLogsResponse {
  status: boolean;
  logs: Array<{
    date: string;
    driver: string;
    outcome: string;
    caller: string;
  }>;
}

export interface MmPlacementsResponse {
  status: boolean;
  placements: Array<{
    id: number;
    unique_id_transporter: string | null;
    unique_id_driver: string | null;
    assigned_to: number;
    assigned_name: string | null;
    job_id: number | string;
    transporter_mobile: string | null;
    driver_mobile: string | null;
    match_status: string;
    driver_name: string | null;
    transporter_name: string | null;
    created_at: string;
  }>;
}

// ── Extended MM Types ──────────────────────────────────────────────────────
export interface MmJobListingsResponse {
  success: boolean;
  data: {
    jobs: Array<{
      id: number;
      job_id: string;
      job_title: string;
      status: string;
      user_id: number;
      tm_user_id: string;
      transporter_name: string;
      transporter_mobile: string;
      location: string;
      route: string | null;
      load_details: string | null;
      last_call_status: string | null;
      last_call_feedback: string | null;
      last_call_time: string | null;
      match_status: string | null;
      license_type: string;
      salary_range: string;
      experience_required: string;
      vehicle_type: string;
      benefits: { stay: string; food: string; esi_pf: string };
      assigned_to: string | null;
      deadline: string | null;
      applicants_count: number;
      created_at: string;
      closed_job: number;
      is_greenline: boolean;
      subscription_plan_id: number | null;
      plan_type: string;
    }>;
    pagination: { next_cursor: number | null; has_more: boolean; limit: number };
  };
}

export interface MmJobDetailResponse {
  success: boolean;
  data: {
    id: number;
    job_id: string;
    job_title: string;
    job_location: string;
    route: string | null;
    license_type: string | null;
    salary_range: string | null;
    required_experience: string | null;
    vehicle_type: string | null;
    number_of_drivers_required: string | null;
    application_deadline: string | null;
    job_description: string | null;
    benefits: {
      esi_pf: any; food_allowance: any; trip_incentive: any;
      rahane_ki_suvidha: any; mileage: any; fast_tag_road_kharcha: any;
    };
    transporter_id: number | null;
    transporter_name: string | null;
    transporter_tm_id: string | null;
    transporter_mobile: string | null;
    assigned_admin: { id: number; name: string; email: string } | null;
    counts: { applicants: number; call_logs: number; match_making: number };
    closed_job: number;
    status: string | null;
    created_at: string | null;
  };
}

export interface MmJobTransporterResponse {
  success: boolean;
  data: {
    job_info: { job_id: string; job_title: string };
    transporter: {
      id: number;
      name: string;
      mobile: string;
      unique_id: string;
      company_name: string | null;
      gst_number: string | null;
      email: string | null;
      stats: { total_jobs_posted: number; active_jobs: number };
      created_at: string;
    };
    call_logs: Array<{
      id: number;
      call_status: string | null;
      call_feedback: string | null;
      call_remarks: string | null;
      assigned_admin_name: string | null;
      created_at: string;
    }>;
    call_logs_count: number;
  };
}

export interface MmApplicant {
  application_id: number;
  driver_id: number;
  name: string;
  mobile: string;
  unique_id: string;
  state: string | null;
  age: number | null;
  experience: string | null;
  income: string | null;
  call_status: string;
  last_call: string | null;
  last_call_time: string | null;
  feedback: string | null;
  pipeline_status: string;
  pipeline_detail: string | null;
  screening: any;
  interview: any;
  applied_at: string;
  is_matched: boolean;
  selected_jobs: Array<{ job_id: string; job_title: string; job_location: string; selected_at: string }>;
  match_making_status: { status: string; feedback: string; called_at: string } | null;
  call_timeline?: Array<{
    call_status: string | null;
    match_status: string | null;
    process: string | null;
    feedback: string | null;
    remarks: string | null;
    called_by: string | null;
    called_at: string;
  }>;
}

export interface MmApplicantsFullResponse {
  status: boolean;
  job_info: { job_id: string; job_title: string };
  data: MmApplicant[];
  total_applicants: number;
  match_making: any[];
  pagination: { next_cursor: number | null; has_more: boolean; per_page: number };
}

export interface QcDashboardResponse {
  status: boolean;
  data: {
    kpis: {
      auditedCount: number;
      avgScore: number;
      fatalCount: number;
      pendingAudits: number;
    };
    calibrationStatus: string;
    recentCalibrationScore: string;
  };
}

export interface QcQueueResponse {
  status: boolean;
  queue: Array<{
    id: number;
    tmid: string;
    name: string;
    phone: string;
    duration: string;
    timestamp: string;
    callerName: string;
    process: string;
    recordingUrl: string;
    isAudited: boolean;
    score: number | null;
    isFatal: boolean;
  }>;
}

export interface HrDashboardResponse {
  status: boolean;
  data: {
    kpis: {
      headcount: number;
      todayAttendance: number;
      openPositions: number;
      newApplicants: number;
    };
  };
}

export interface HrEmployeesResponse {
  status: boolean;
  employees: Array<{
    id: number;
    empId: string;
    name: string;
    email: string;
    phone: string;
    department: string;
    designation: string;
    doj: string;
    status: string;
    ctc: string;
    salaryBreakdown: {
      basic: number;
      hra: number;
      allow: number;
      pf: number;
      esi: number;
      net: number;
    };
  }>;
}

export interface HrAttendanceResponse {
  status: boolean;
  attendance: Array<{
    id: number;
    callerId: number;
    callerName: string;
    date: string;
    status: string;
    checkIn: string;
    checkOut: string;
    workingHours: number;
    breakTime: string;
    totalCalls: number;
  }>;
}

export interface AdminHealthResponse {
  status: boolean;
  data: {
    health: {
      database: string;
      api: string;
      redis: string;
      storage: string;
    };
    stats: {
      totalTables: number;
      activeSessions: number;
      errorLogCount: number;
      latency: string;
    };
  };
}

export interface AdminWebhooksResponse {
  status: boolean;
  webhooks: Array<{
    id: number;
    client: string;
    callType: string;
    linkedId: string;
    callerId: string;
    extensionNo: string;
    did: string;
    duration: string;
    disposition: string;
    timestamp: string;
    action: string;
  }>;
}

export interface ThDashboardResponse {
  status: boolean;
  data: {
    kpis: {
      totalCalls: number;
      connectedCalls: number;
      answeredPercentage: number;
      activeCallers: number;
    };
    breakdown: {
      driversCount: number;
      transportersCount: number;
      postedJobsCount: number;
    };
    leaderboard: Array<{
      name: string;
      points: number;
      role: string;
    }>;
  };
}

export interface ThSprintResponse {
  status: boolean;
  sprints: Array<{
    id: string;
    title: string;
    objective: string;
    assignedTo: string;
    status: string;
    progress: number;
    targetDate: string;
  }>;
}

export interface TlDashboardResponse {
  status: boolean;
  data: {
    kpis: {
      currentRevenue: number;
      targetRevenue: number;
      efficiency: number;
      totalCalls: number;
      callsTrend: number;
      avgHandling: string;
      slaCompliance: number;
      conversion: number;
    };
    roster: Array<{
      id: number;
      name: string;
      role: string;
      status: string;
      calls: number;
      rev: number;
      queue: number;
      conv: number;
    }>;
    callbacks: Array<{
      id: number;
      user_id: string;
      user_name: string;
      time: string;
      is_expired: boolean;
      assigned_name: string;
      priority: string;
    }>;
  };
}

export interface TlRosterResponse {
  status: boolean;
  roster: Array<{
    id: number;
    name: string;
    role: string;
    status: string;
    queueDepth: number;
    callsMade: number;
    compliance: string;
  }>;
}

export interface DwQueueParams {
  per_page?: number;
  page?: number;
  search?: string;
  subscribed?: string;
  salary?: string;
  route?: string;
  state_id?: number;
  pan?: string;
  vehicle_type?: string;
  experience?: string;
  profile_complete?: string;
}

export const webCrmApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // DW Endpoints
    getDwDashboard: builder.query<DwDashboardResponse, { period?: string } | void>({
      query: (params) => ({
        url: '/web-crm/dw/dashboard',
        params: params || undefined,
      }),
    }),
    getDwQueue: builder.query<DwQueueResponse, { per_page?: number; page?: number; filter?: string; search?: string } | void>({
      query: (params) => ({
        url: '/web-crm/dw/queue',
        params: params || undefined,
      }),
    }),
    getDwQueueCounts: builder.query<any, void>({
      query: () => '/web-crm/dw/queue/counts',
    }),
    getDwQueueFresh: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/dw/queue/fresh',
        params: params || undefined,
      }),
    }),
    getDwQueueOld: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/dw/queue/old',
        params: params || undefined,
      }),
    }),
    getDwQueueUncalled: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/dw/queue/uncalled',
        params: params || undefined,
      }),
    }),
    getDwQueueCallbacks: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/dw/queue/callbacks',
        params: params || undefined,
      }),
    }),
    getDwQueueCalled: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/dw/queue/called',
        params: params || undefined,
      }),
    }),
    getDwNextLead: builder.query<DwNextLeadResponse, void>({
      query: () => '/web-crm/dw/queue/next',
    }),
    skipDwLead: builder.mutation<any, { user_id: number; reason: string }>({
      query: (body) => ({
        url: '/web-crm/dw/queue/skip',
        method: 'POST',
        body,
      }),
    }),
    getDwLeadDetail: builder.query<DwLeadDetailResponse, number | string>({
      query: (userId) => `/web-crm/dw/lead/${userId}`,
    }),
    getDwDispositionOptions: builder.query<DwDispositionOptionsResponse, void>({
      query: () => '/web-crm/dw/disposition-options',
    }),
    submitDwFeedback: builder.mutation<any, {
      user_id: number;
      call_status: string;
      call_feedback: string;
      call_remarks?: string;
      call_recording?: string;
      call_duration?: number;
      call_id?: number;
      disposition_sub?: string | null;
      callback_sub?: string | null;
      callback_at?: string | null;
      feedback_stage?: string | null;
      plan_selected?: string | null;
      payment_id?: string | null;
      language_noted?: string | null;
    }>({
      query: (body) => ({
        url: '/web-crm/dw/feedback',
        method: 'POST',
        body,
      }),
    }),
    getDwPerformance: builder.query<DwPerformanceResponse, { period?: string } | void>({
      query: (params) => ({
        url: '/web-crm/dw/performance',
        params: params || undefined,
      }),
    }),
    getDwCallbacks: builder.query<DwCallbacksResponse, void>({
      query: () => '/web-crm/dw/callbacks',
    }),
    scheduleDwCallback: builder.mutation<any, { user_id: number; reason: string }>({
      query: (body) => ({
        url: '/web-crm/dw/callbacks/schedule',
        method: 'POST',
        body,
      }),
    }),
    getDwCallHistory: builder.query<DwCallHistoryResponse, { per_page?: number; page?: number; search?: string } | void>({
      query: (params) => ({
        url: '/web-crm/dw/call-history',
        params: params || undefined,
      }),
    }),
    getDwBreakStatus: builder.query<DwBreakStatusResponse, void>({
      query: () => '/web-crm/dw/break-status',
    }),

    // WCT Endpoint
    getWctDashboard: builder.query<WctDashboardResponse, void>({
      query: () => '/web-crm/wct/dashboard',
    }),
    getWctQueue: builder.query<WctQueueResponse, void>({
      query: () => '/web-crm/wct/queue',
    }),

    // MM Endpoint
    getMmDashboard: builder.query<MmDashboardResponse, void>({
      query: () => '/web-crm/match-making/home',
    }),
    getMmJobs: builder.query<MmJobsResponse, void>({
      query: () => '/web-crm/mm/jobs',
    }),
    getMmDrivers: builder.query<MmDriversResponse, { origin?: string; destination?: string; license?: string }>({
      query: (params) => ({
        url: '/web-crm/mm/drivers',
        params,
      }),
    }),
    placeMmDriver: builder.mutation<any, { job_id: number; driver_id: number; transporter_id: number }>({
      query: (body) => ({
        url: '/web-crm/mm/place',
        method: 'POST',
        body,
      }),
    }),
    getMmJobApplicants: builder.query<MmJobApplicantsResponse, string | number>({
      query: (jobId) => `/web-crm/mm/job/${jobId}/applicants`,
    }),
    getMmJobCallLogs: builder.query<MmJobCallLogsResponse, string | number>({
      query: (jobId) => `/web-crm/mm/job/${jobId}/call-logs`,
    }),
    getMmPlacements: builder.query<MmPlacementsResponse, void>({
      query: () => '/web-crm/mm/placements',
    }),
    getMmJobListings: builder.query<MmJobListingsResponse, {
      type?: string; section?: string; status?: string; search?: string;
      license_type?: string; vehicle_type?: string; plan_type?: string;
      limit?: number; cursor?: number | null;
    }>({
      query: (params) => ({
        url: '/web-crm/match-making/jobs',
        params: Object.fromEntries(
          Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')
        ),
      }),
      providesTags: ['MmJobs'],
    }),

    getMmJobDetail: builder.query<MmJobDetailResponse, string>({
      query: (jobId) => `/web-crm/match-making/job/${jobId}`,
      providesTags: ['MmJobs'],
    }),

    getMmJobTransporterDetail: builder.query<MmJobTransporterResponse, string>({
      query: (jobId) => `/web-crm/match-making/job/${jobId}/transporter`,
      providesTags: ['MmTransporter'],
    }),

    getMmApplicantsFull: builder.query<MmApplicantsFullResponse, {
      jobId: string; per_page?: number; cursor?: number | null; search?: string; status?: string;
    }>({
      query: ({ jobId, ...params }) => ({
        url: `/web-crm/match-making/job/${jobId}/applicants`,
        params: Object.fromEntries(
          Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')
        ),
      }),
      providesTags: ['MmApplicants'],
    }),

    // call_history_ivr is the single source of truth for all calls. SanCti
    // logs the call and its disposition via /web-crm/call/*; this endpoint
    // only stamps the matchmaking context (job + match outcome) onto that
    // same call row after the disposition is submitted.
    tagMmCall: builder.mutation<{ success: boolean; message: string }, {
      call_id: number; job_id: string; match_status?: string;
    }>({
      query: (body) => ({ url: '/web-crm/match-making/ivr-call-tag-job', method: 'POST', body }),
      invalidatesTags: ['MmApplicants', 'MmTransporter', 'MmJobs'],
    }),

    // Driver Bank endpoints
    getDriverBank: builder.query<any, { search?: string; job_id?: string; availability?: string; per_page?: number; cursor?: number | null }>({
      query: (params) => ({
        url: '/web-crm/match-making/driver-bank',
        params: Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')),
      }),
      providesTags: ['DriverBank'],
    }),
    addDriverBank: builder.mutation<any, {
      user_id?: number; tmid?: string; name: string; mobile: string;
      job_id?: string; location?: string; license_type?: string; vehicle_type?: string;
      experience?: string; availability?: string; feedback?: string; remarks?: string;
    }>({
      query: (body) => ({ url: '/web-crm/match-making/driver-bank', method: 'POST', body }),
      invalidatesTags: ['DriverBank'],
    }),
    updateDriverBank: builder.mutation<any, { id: number; availability?: string; feedback?: string; remarks?: string; job_id?: string }>({
      query: ({ id, ...body }) => ({ url: `/web-crm/match-making/driver-bank/${id}`, method: 'PUT', body }),
      invalidatesTags: ['DriverBank'],
    }),
    deleteDriverBank: builder.mutation<any, number>({
      query: (id) => ({ url: `/web-crm/match-making/driver-bank/${id}`, method: 'DELETE' }),
      invalidatesTags: ['DriverBank'],
    }),
    searchDriverBankUser: builder.query<any, string>({
      query: (q) => ({ url: '/web-crm/match-making/driver-bank/search-user', params: { q } }),
    }),

    // QC Endpoint
    getQcDashboard: builder.query<QcDashboardResponse, void>({
      query: () => '/web-crm/qc/dashboard',
    }),
    getQcQueue: builder.query<QcQueueResponse, void>({
      query: () => '/web-crm/qc/queue',
    }),
    submitQcAudit: builder.mutation<any, {
      call_id: number;
      score: number;
      greeting_score: number;
      objection_handling_score: number;
      script_adherence_score: number;
      closing_score: number;
      feedback: string;
      fatal_error_flag: boolean;
    }>({
      query: (body) => ({
        url: '/web-crm/qc/audit-submit',
        method: 'POST',
        body,
      }),
    }),

    // HR Endpoint
    getHrDashboard: builder.query<HrDashboardResponse, void>({
      query: () => '/web-crm/hr/dashboard',
    }),
    getHrEmployees: builder.query<HrEmployeesResponse, void>({
      query: () => '/web-crm/hr/employees',
    }),
    getHrAttendance: builder.query<HrAttendanceResponse, void>({
      query: () => '/web-crm/hr/attendance',
    }),

    // Admin Endpoint
    getAdminHealth: builder.query<AdminHealthResponse, void>({
      query: () => '/web-crm/admin/health',
    }),
    getAdminWebhooks: builder.query<AdminWebhooksResponse, void>({
      query: () => '/web-crm/admin/webhooks',
    }),

    // TH Endpoint
    getThDashboard: builder.query<ThDashboardResponse, void>({
      query: () => '/web-crm/th/dashboard',
    }),
    getThSprint: builder.query<ThSprintResponse, void>({
      query: () => '/web-crm/th/sprint',
    }),

    // TL Endpoint
    getTlDashboard: builder.query<TlDashboardResponse, { department?: string } | void>({
      query: (params) => ({
        url: '/web-crm/tl/dashboard',
        params: params || undefined,
      }),
    }),
    getTlRoster: builder.query<TlRosterResponse, void>({
      query: () => '/web-crm/tl/roster',
    }),
    reassignTlLeads: builder.mutation<any, { lead_ids: number[]; reassign_to: number; audit_reason: string }>({
      query: (body) => ({
        url: '/web-crm/tl/reassign',
        method: 'POST',
        body,
      }),
    }),
    getTarget: builder.query<any, string>({
      query: (key) => `/web-crm/targets/${key}`,
      providesTags: (_result, _error, key) => [{ type: 'Settings', id: key }],
    }),
    setTarget: builder.mutation<any, { key: string; value: any }>({
      query: ({ key, value }) => ({
        url: `/web-crm/targets/${key}`,
        method: 'POST',
        body: { value },
      }),
      invalidatesTags: (_result, _error, { key }) => [{ type: 'Settings', id: key }],
    }),
    getDwCampaignLeads: builder.query<any, { source?: string; search?: string; tab?: string; sort_by?: string; page?: number; per_page?: number } | void>({
      query: (params) => ({
        url: '/web-crm/dw/campaign-leads',
        params: params || undefined,
      }),
      providesTags: ['Leads'],
    }),
    updateDwCampaignLeadNotes: builder.mutation<any, { id: string | number; notes: string }>({
      query: ({ id, notes }) => ({
        url: `/web-crm/dw/campaign-leads/${id}/notes`,
        method: 'POST',
        body: { notes },
      }),
    }),
    getDwGlobalSearch: builder.query<any, string>({
      query: (searchStr) => `/web-crm/dw/global-search?q=${searchStr}`,
    }),
  }),
});

export const {
  useGetDwDashboardQuery,
  useGetDwQueueQuery,
  useLazyGetDwQueueQuery,
  useGetDwQueueCountsQuery,
  useGetDwQueueFreshQuery,
  useGetDwQueueOldQuery,
  useGetDwQueueUncalledQuery,
  useGetDwQueueCallbacksQuery,
  useGetDwQueueCalledQuery,
  useGetDwNextLeadQuery,
  useLazyGetDwNextLeadQuery,
  useLazyGetDwQueueFreshQuery,
  useLazyGetDwQueueOldQuery,
  useLazyGetDwQueueUncalledQuery,
  useLazyGetDwQueueCallbacksQuery,
  useLazyGetDwQueueCalledQuery,
  useLazyGetDwQueueCountsQuery,
  useSkipDwLeadMutation,
  useGetDwLeadDetailQuery,
  useGetDwDispositionOptionsQuery,
  useSubmitDwFeedbackMutation,
  useGetDwPerformanceQuery,
  useGetDwCallbacksQuery,
  useScheduleDwCallbackMutation,
  useGetDwCallHistoryQuery,
  useGetDwBreakStatusQuery,
  useGetWctDashboardQuery,
  useGetWctQueueQuery,
  useGetMmDashboardQuery,
  useGetMmJobsQuery,
  useGetMmDriversQuery,
  usePlaceMmDriverMutation,
  useGetMmJobApplicantsQuery,
  useGetMmJobCallLogsQuery,
  useGetMmPlacementsQuery,
  useGetMmJobListingsQuery,
  useGetMmJobDetailQuery,
  useGetMmJobTransporterDetailQuery,
  useGetMmApplicantsFullQuery,
  useTagMmCallMutation,
  useGetDriverBankQuery,
  useAddDriverBankMutation,
  useUpdateDriverBankMutation,
  useDeleteDriverBankMutation,
  useLazySearchDriverBankUserQuery,
  useGetQcDashboardQuery,
  useGetQcQueueQuery,
  useSubmitQcAuditMutation,
  useGetHrDashboardQuery,
  useGetHrEmployeesQuery,
  useGetHrAttendanceQuery,
  useGetAdminHealthQuery,
  useGetAdminWebhooksQuery,
  useGetThDashboardQuery,
  useGetThSprintQuery,
  useGetTlDashboardQuery,
  useGetTlRosterQuery,
  useReassignTlLeadsMutation,
  useGetTargetQuery,
  useSetTargetMutation,
  useGetDwCampaignLeadsQuery,
  useLazyGetDwCampaignLeadsQuery,
  useUpdateDwCampaignLeadNotesMutation,
  useGetDwGlobalSearchQuery,
  useLazyGetDwGlobalSearchQuery,
} = webCrmApi;

