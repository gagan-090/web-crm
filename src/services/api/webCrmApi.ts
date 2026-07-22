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
  subscription_date?: string | null;
  recording_url?: string | null;
  bill_duration?: string | null;
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
      profile_completion: number;
      profile_image: string | null;
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
      // Transporter business fields (users table, transporter role)
      transport_name?: string | null;
      pan_number?: string | null;
      pan_image?: string | null;
      gst_number?: string | null;
      gst_certificate?: string | null;
      fleet_size?: number | string | null;
      company_registration_type?: string | null;
      driver_profile_completion?: number;
    };
    documents?: Array<{
      key: string;
      label: string;
      uploaded: boolean;
      url: string | null;
    }>;
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
    // Transporter-specific: the transporter's own posted jobs (WCT leadDetail)
    posted_jobs?: Array<{
      job_id: number;
      ref: string | null;
      title: string;
      location: string | null;
      route: string | null;
      vehicle_type: string | null;
      salary: string | null;
      drivers_required: number | null;
      status: string;
      is_closed: boolean;
      applicants: number;
      posted_at: string;
    }>;
    jobs_posted_count?: number;
    total_applicants?: number;
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
    user_id: number | null;
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
  feedback_options?: string[];
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

export interface WctJob {
  job_id: number;
  ref: string | null;
  title: string;
  location: string | null;
  route: string | null;
  vehicle_type: string | null;
  salary: string | null;
  drivers_required: number | null;
  is_closed: boolean;
  plan_type: string;
  plan_label: string;
  applicants: number;
  posted_at: string;
  transporter: {
    id: number;
    name: string;
    tmid: string;
    mobile: string;
    city: string | null;
    state: string | null;
  };
}

export interface WctJobsResponse {
  status: boolean;
  data: {
    jobs: WctJob[];
    pagination: { total: number; per_page: number; current_page: number; last_page: number };
  };
}

export interface WctJobApplicant {
  apply_id: number;
  driver_id: number | null;
  name: string;
  tmid: string | null;
  mobile: string | null;
  city: string | null;
  registered_at: string | null;
  applied_at: string;
  status: string;
  subscription: string;
  subscription_amount: number;
}

export interface WctJobApplicantsResponse {
  status: boolean;
  data: {
    job: {
      job_id: number;
      ref: string | null;
      title: string;
      location: string | null;
      route: string | null;
      vehicle_type: string | null;
      salary: string | null;
      experience: string | null;
      license_type: string | null;
      drivers_required: number | null;
      description: string | null;
      posted_at: string;
      is_closed: boolean;
      plan_type: string;
      plan_label: string;
      transporter: { id: number; name: string; tmid: string; mobile: string; city: string | null; state: string | null };
    };
    applicants: WctJobApplicant[];
    applicant_count: number;
  };
}

export interface WctD7UpsellLead {
  id: number;
  tmid: string;
  company_name: string;
  contact_name: string;
  phone: string;
  location: string;
  free_plan_date: string;
  days_since_free: number;
  fleet_size: string | null;
  segment: string;
  last_call_note: string;
  registered_at: string | null;
}

export interface WctD7UpsellResponse {
  status: boolean;
  data: {
    leads: WctD7UpsellLead[];
    pagination: { total: number; per_page: number; current_page: number; last_page: number };
  };
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
      /** Every job of this type in the system — matches what the board's tabs list. */
      regular_jobs: number;
      greenline_jobs: number;
      /** The slice of each that belongs to the signed-in caller. */
      regular_jobs_assigned?: number;
      greenline_jobs_assigned?: number;
    };
    /** The caller's OWN assigned jobs, per board tab, per status filter. */
    job_status_counts?: Record<'regular' | 'greenline', {
      all: number; open: number; pending: number;
      closed: number; expired: number; expiring_soon: number;
    }>;
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

export interface MmDriver {
  id: number;
  tmid: string;
  name: string;
  phone: string;
  license: string;
  licenseExpiry: string | null;
  licenseStatus: 'valid' | 'expiring' | 'expired' | 'unknown';
  endorsements: string[];
  experienceBucket: string | null;
  experienceYears: number | null;
  expectedSalary: string | null;
  salaryMin: number | null;
  salaryMax: number | null;
  currentSalary: string | null;
  city: string;
  state: string;
  preferredState: string | null;
  truckTypes: string[];
  truckOwnership: string | null;
  education: string | null;
  jobPlacement: string | null;
  profileComplete: boolean;
  planKey: string;
  planLabel: string;
  planAmount: number;
  applicationsTotal: number;
  applicationsAccepted: number;
  applicationsPending: number;
  registeredAt: string | null;
  lastCallAt: string | null;
  experience: string;
  routes: string;
  matchScore: number | null;
  lastCall: string;
}

export interface MmDriversResponse {
  status: boolean;
  drivers: MmDriver[];
  pagination: { total: number; per_page: number; current_page: number; last_page: number };
}

/** Every filter accepted by GET /web-crm/mm/drivers. Lists are sent as CSV. */
export interface MmDriverSearchParams {
  search?: string;
  state_id?: number | string;
  preferred_state_id?: number | string;
  city?: string;
  license?: string[];
  license_status?: string[];
  endorsement?: string[];
  vehicle_type?: Array<number | string>;
  truck_ownership?: string;
  experience?: string[];
  min_experience?: number;
  max_experience?: number;
  salary_min?: number;
  salary_max?: number;
  salary_band?: string[];
  plan?: string[];
  applied_status?: string;
  applied_job_id?: string;
  min_applications?: number;
  education?: string[];
  job_placement?: string;
  profile_complete?: string;
  gender?: string;
  registered_within_days?: number;
  call_status?: string;
  sort?: string;
  page?: number;
  per_page?: number;
}

export interface MmDriverFiltersResponse {
  status: boolean;
  filters: {
    states: Array<{ id: number; name: string }>;
    vehicle_types: Array<{ id: number; name: string }>;
    licenses: Array<{ value: string; count: number }>;
    license_statuses: Array<{ value: string; label: string }>;
    endorsements: Array<{ value: string; count: number }>;
    experiences: Array<{ value: string; label: string }>;
    salary_bands: Array<{ value: string; count: number }>;
    plans: Array<{ value: string; label: string }>;
    educations: Array<{ value: string; count: number }>;
    ownerships: Array<{ value: string; label: string }>;
    application_statuses: Array<{ value: string; label: string }>;
  };
}

// ── MM agent reporting ──────────────────────────────────────────────────────

export interface MmPlacementRow {
  job_id: string;
  driver_id: number | null;
  driver_name: string | null;
  tier: 'super_premium' | 'premium' | 'standard' | 'unknown';
  source: 'web_crm' | 'app';
  job_posted_at: string | null;
  placed_at: string | null;
  days_to_fill: number | null;
  sla_target_days: number | null;
  within_sla: boolean | null;
  replacement_until: string | null;
  in_replacement_window: boolean;
}

export interface MmSlaTier {
  target_days: number;
  measured: number;
  within_sla: number;
  breached: number;
  rate: number | null;
}

export interface MmAgentPerformanceResponse {
  status: boolean;
  data: {
    period: string;
    config: Record<string, number>;
    fulfillments: {
      total: number; target: number;
      premium: number; super_premium: number; standard: number; unknown_tier: number;
    };
    sla: {
      overall_rate: number | null;
      measured: number;
      within_sla: number;
      by_tier: { super_premium: MmSlaTier; premium: MmSlaTier };
      replacement: {
        window_days: number; in_window: number; expired: number; tracking_note: string;
      };
    };
    incentive: {
      accrued: number; gate: number; gate_crossed: boolean;
      rate_premium: number; rate_super_premium: number;
    };
    rejections: {
      total: number;
      reasons: Array<{ reason: string; count: number; percent: number }>;
    };
    sourcing: {
      calls_made: number; placements: number; calls_per_placement: number | null;
    };
    placements: MmPlacementRow[];
  };
}

export interface MmAgentStatsResponse {
  status: boolean;
  data: {
    period: string;
    agent: { id: number; name: string };
    calls: {
      total: number; connected: number; not_connected: number; callback: number;
      pending: number; to_drivers: number; to_transporters: number;
      unattributed: number; connect_rate: number | null;
    };
    feedback: Array<{ label: string; count: number }>;
    funnel: {
      jobs_total: number; jobs_open: number; jobs_closed: number;
      jobs_standard: number; jobs_premium: number; jobs_super_premium: number;
      jobs_assigned_to_me: number;
      applications_total: number; applications_pending: number;
      applications_accepted: number; applications_rejected: number;
      my_matched: number; my_selected: number;
    };
  };
}

export interface MmCallHistoryRow {
  id: number;
  recording_url: string | null;
  bill_duration: number | string | null;
  job_id: string | null;
  job_title: string | null;
  transporter_name: string | null;
  lead_id: number | null;
  lead_tmid: string | null;
  lead_name: string | null;
  lead_role: string | null;
  call_status: string | null;
  feedback: string | null;
  remarks: string | null;
  match_status: string | null;
  process: string | null;
  call_type: string | null;
  direction: string | null;
  duration_seconds: number;
  disposition_sub: string | null;
  callback_at: string | null;
  recording: string | null;
  called_at: string;
}

export interface MmCallHistoryResponse {
  status: boolean;
  data: MmCallHistoryRow[];
  pagination: { total: number; per_page: number; current_page: number; last_page: number };
}

/**
 * Transporter job brief — identical field set and naming to the mobile
 * JobBriefFeedbackModal payload (src/screens/matchmaking-telecalling/
 * components/JobBriefFeedbackModal.tsx) so both clients stay in step.
 */
export interface MmJobBriefPayload {
  job_id: string;
  name: string;
  job_location: string;
  route?: string;
  required_drivers?: string;
  vehicle_type?: string;
  license_type?: string;
  experience?: string;
  salary_fixed?: string;
  salary_variable?: number;
  esi_pf?: 'Yes' | 'No';
  food_allowance?: number;
  trip_incentive?: number;
  rehne_ki_suvidha?: 'Yes' | 'No';
  mileage?: string;
  fast_tag_road_kharcha?: 'Company' | 'Driver';
  closed_job?: number;
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
      /** Owner of the job — the board is system-wide, so not every job is the caller's. */
      assigned_to_id: number | null;
      assigned_to_name: string | null;
      is_mine: boolean;
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
    is_greenline?: boolean;
    /** Ownership — false `is_mine` puts the detail screen in read-only mode. */
    assigned_to_id?: number | null;
    assigned_to_name?: string | null;
    is_mine?: boolean;
  };
}

export interface MmScreeningResultsResponse {
  status: boolean;
  message?: string;
  data: {
    user_id: number;
    unique_id: string;
    result: number | string | null;
    status: string | null;
    final_status: string | null;
    telecaller_status: string | null;
    telecaller_remarks: string | null;
    screened_by: number | null;
    screener: { name: string | null };
    approved_by: string | null;
    screened_at: string | null;
    updated_at: string | null;
    telecaller_status_updated_at: string | null;
    answers: Record<string, string | null>;
  } | null;
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
  selected_jobs: Array<{
    job_id: string;
    job_title: string;
    job_location: string;
    selected_at: string;
    /** Resolved by MmCallerController::mmJobApplicants from jobs.transporter_id. */
    transporter_name?: string | null;
  }>;
  match_making_status: { status: string; feedback: string; called_at: string } | null;
  call_timeline?: Array<{
    call_status: string | null;
    match_status: string | null;
    process: string | null;
    feedback: string | null;
    remarks: string | null;
    called_by: string | null;
    called_at: string;
    job_id?: string | null;
    transporter_name?: string | null;
  }>;
}

export interface MmDriverProfileResponse {
  status: boolean;
  message?: string;
  data: {
    profile: Record<string, string | number | null>;
    address: Record<string, string | null>;
    driving: Record<string, string | string[] | null>;
    employment: Record<string, string | null>;
    documents_available: { profile_image: boolean; dl: boolean; pan: boolean };
    documents: {
      pan_number: string | null; voter_id: string | null;
      profile_image: string | null; dl_front: string | null; dl_back: string | null; pan_image: string | null;
    };
    dl_verification: Record<string, string | null> | null;
    pan_verification: Record<string, string | null> | null;
    aadhaar_verification: Record<string, string | null> | null;
    verification_summary: Record<string, string | null> | null;
    subscription: {
      current_plan: string; current_label: string; current_amount: number;
      total_paid: number; payment_count: number;
      payments: Array<{
        id: number; amount: number; status: string;
        plan_name: string | null; plan_label: string | null;
        duration_months: number | null;
        start_at: string | number | null; end_at: string | number | null; paid_at: string;
      }>;
    };
    applied_jobs: Array<{
      application_id: number; job_id: string | null; status: string | null;
      rejection_remark: string | null; applied_at: string;
      job_ref: string | null; job_title: string | null; job_location: string | null;
      route: string | null; salary: string | null; vehicle_type: string | null;
      transporter_name: string | null;
    }>;
    call_timeline: Array<{
      id: number; job_id: string | null; job_title: string | null; transporter_name: string | null;
      call_status: string | null; feedback: string | null; remarks: string | null;
      match_status: string | null; disposition_sub: string | null; process: string | null;
      call_type: string | null; direction: string | null; duration_seconds: number;
      callback_at: string | null; called_by: string | null; called_at: string;
      recording_url: string | null; bill_duration: string | number | null;
    }>;
  } | null;
}

export interface MmGreenlineApplicant {
  application_id: number;
  driver_id: number;
  name: string;
  unique_id: string;
  mobile: string;
  state: string | null;
  experience: string | null;
  license_type: string | null;
  license_number: string | null;
  income: string | null;
  vehicle_types: string[];
  applied_at: string | null;
  pipeline_stage: string;
  documents_available: { profile_image: boolean; dl: boolean; pan: boolean };
  call: { called: boolean; connected: boolean; status: string | null; feedback: string | null; match_status: string | null; at: string | null };
  screening: { done: boolean; score?: number | string; status?: string; decision?: string; at?: string };
  interview: {
    online_status: string | null; online_timing: string | null;
    physical_status: string | null; physical_start: string | null; physical_end: string | null;
  } | null;
}

export interface MmGreenlineApplicantsResponse {
  status: boolean;
  job_info: { job_id: string; job_title: string };
  data: MmGreenlineApplicant[];
  counts: Record<string, number>;
  total: number;
  pagination: { next_cursor: number | null; has_more: boolean; per_page: number };
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

export type TlBoardColumn = 'open' | 'in_progress' | 'sla_risk' | 'filled' | 'expired';

export interface TlBoardJob {
  id: number;
  job_id: string;
  title: string;
  location: string | null;
  route: string | null;
  vehicle_type: string | null;
  salary_range: string | null;
  experience: string | null;
  license_type: string | null;
  drivers_required: number;
  column: TlBoardColumn;
  is_verified: boolean;
  is_closed: boolean;
  deadline: string | null;
  /** Minutes to the application deadline; negative once past, null when none is set. */
  sla_minutes_left: number | null;
  posted_at: string | null;
  last_activity_at: string | null;
  assigned_to: number | null;
  assigned_name: string | null;
  transporter: { id: number; name: string | null; tmid: string | null; mobile: string | null; city: string | null };
  is_greenline: boolean;
  applicants_count: number;
  matched_count: number;
  selected_count: number;
  calls_count: number;
  plan_type: 'STANDARD' | 'PREMIUM' | 'SUPER PREMIUM';
}

export interface TlBoardAgent {
  id: number;
  name: string;
  role: string;
  mobile: string | null;
  live_jobs: number;
}

export interface TlMatchmakingBoardResponse {
  status: boolean;
  data: {
    board: Record<TlBoardColumn, { total: number; jobs: TlBoardJob[] }>;
    agents: TlBoardAgent[];
    summary: {
      total_on_board: number;
      sla_risk: number;
      unassigned: number;
      window_days: number;
      sla_risk_hours: number;
      generated_at: string;
    };
  };
}

export interface TlBoardCandidate {
  application_id: number;
  driver_id: number;
  tmid: string | null;
  name: string | null;
  mobile: string | null;
  city: string | null;
  state: string | null;
  vehicles: string[];
  license_type: string | null;
  experience: string | null;
  expected_salary: string | null;
  applied_at: string | null;
  application_status: string | null;
  fit: number;
  fit_breakdown: { vehicle: number; licence: number; experience: number; location: number; profile: number };
  match_status: string | null;
  last_call_status: string | null;
  last_call_at: string | null;
}

export interface TlBoardCandidatesResponse {
  status: boolean;
  data: {
    job: {
      id: number; job_id: string; title: string; vehicle_type: string[];
      license_type: string | null; experience: string | null; salary_range: string | null; location: string | null;
    };
    candidates: TlBoardCandidate[];
    shortlisted: number;
    total_applicants: number;
    scanned: number;
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
  /** users.role the queue is scoped to — driver | transporter | association | foreman | puncture | dhaba. */
  lead_role?: string;
  subscribed?: string;
  salary?: string;
  route?: string;
  state_id?: number;
  pan?: string;
  vehicle_type?: string;
  experience?: string;
  profile_complete?: string;
}

export interface DwJobSearchParams {
  page?: number;
  per_page?: number;
  status?: 'open' | 'all';
  search?: string;
  state_id?: number | string;
  salary?: string;
  experience?: string;
}

export interface DwJob {
  id: number;
  job_id: string | null;
  job_title: string | null;
  job_location: string | null;
  salary_range: string | null;
  experience: string | null;
  license_type: string | null;
  vehicle_type: string | null;
  vehicle_type_label: string;
  drivers_required: number | string | null;
  status: string | null;
  is_open: boolean;
  application_deadline: string | null;
  created_at: string | null;
  transporter_id: number | null;
  transporter_name: string | null;
  transporter_tmid: string | null;
  transporter_mobile: string | null;
  transporter_city: string | null;
  state_name: string | null;
  assigned_telecaller: string | null;
  applicants_count: number;
  placed_driver: { id: number; name: string; tmid: string } | null;
}

export interface DwJobSearchResponse {
  status: boolean;
  data: {
    jobs: DwJob[];
    pagination: { total: number; per_page: number; current_page: number; last_page: number };
    filters: {
      states: Array<{ id: number; name: string }>;
      salary_ranges: string[];
      experiences: string[];
    };
  };
}

export interface MmSubscriptionsResponse {
  status: boolean;
  data: {
    summary: {
      total_amount: number;
      total_count: number;
      refunded_count: number;
      premium_jobs: { count: number; amount: number };
      super_premium_jobs: { count: number; amount: number };
      transporter_subs: { count: number; amount: number };
      driver_subs: { count: number; amount: number };
      period: string;
    };
    breakdown: Array<{
      key: string; label: string; for: string | null;
      plan_amount: number | null; count: number; amount: number; refunded_count: number;
    }>;
    trend: Array<{ month: string; count: number; amount: number }>;
    rows: Array<{
      id: number; date: string; collected_at: string; tmid: string;
      customer_name: string; customer_mobile: string | null; customer_role: string | null;
      plan_key: string; plan_label: string; plan_for: string | null;
      amount: number; payment_id: string | null; source: string; job_id: string | null;
      is_refunded: boolean; refunded_at: string | null; remarks: string | null;
    }>;
    pagination: { total: number; per_page: number; current_page: number; last_page: number };
  };
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
    getDwQueueCounts: builder.query<any, { lead_role?: string } | void>({
      query: (params) => ({
        url: '/web-crm/dw/queue/counts',
        params: params || undefined,
      }),
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
    getDwCallHistory: builder.query<DwCallHistoryResponse, { per_page?: number; page?: number; search?: string; feedback?: string } | void>({
      query: (params) => ({
        url: '/web-crm/dw/call-history',
        params: params || undefined,
      }),
    }),
    getDwBreakStatus: builder.query<DwBreakStatusResponse, void>({
      query: () => '/web-crm/dw/break-status',
    }),

    // WCT Endpoints — Transporter Welcome Caller. The backend (WctCallerController)
    // returns shapes identical to the DW controller, retargeted to transporters,
    // so these reuse the Dw* response types.
    getWctDashboard: builder.query<DwDashboardResponse, { period?: string } | void>({
      query: (params) => ({
        url: '/web-crm/wct/dashboard',
        params: params || undefined,
      }),
    }),
    getWctQueue: builder.query<DwQueueResponse, { per_page?: number; page?: number; filter?: string; search?: string } | void>({
      query: (params) => ({
        url: '/web-crm/wct/queue',
        params: params || undefined,
      }),
    }),
    getWctQueueCounts: builder.query<any, void>({
      query: () => '/web-crm/wct/queue/counts',
    }),
    getWctQueueFresh: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/wct/queue/fresh',
        params: params || undefined,
      }),
    }),
    getWctQueueOld: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/wct/queue/old',
        params: params || undefined,
      }),
    }),
    getWctQueueUncalled: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/wct/queue/uncalled',
        params: params || undefined,
      }),
    }),
    getWctQueueCallbacks: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/wct/queue/callbacks',
        params: params || undefined,
      }),
    }),
    getWctQueueCalled: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/wct/queue/called',
        params: params || undefined,
      }),
    }),
    getWctNextLead: builder.query<DwNextLeadResponse, void>({
      query: () => '/web-crm/wct/queue/next',
    }),
    skipWctLead: builder.mutation<any, { user_id: number; reason: string }>({
      query: (body) => ({
        url: '/web-crm/wct/queue/skip',
        method: 'POST',
        body,
      }),
    }),
    getWctLeadDetail: builder.query<DwLeadDetailResponse, number | string>({
      query: (userId) => `/web-crm/wct/lead/${userId}`,
    }),
    getWctDispositionOptions: builder.query<DwDispositionOptionsResponse, void>({
      query: () => '/web-crm/wct/disposition-options',
    }),
    submitWctFeedback: builder.mutation<any, {
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
        url: '/web-crm/wct/feedback',
        method: 'POST',
        body,
      }),
    }),
    getWctPerformance: builder.query<DwPerformanceResponse, { period?: string } | void>({
      query: (params) => ({
        url: '/web-crm/wct/performance',
        params: params || undefined,
      }),
    }),
    getWctCallbacks: builder.query<DwCallbacksResponse, void>({
      query: () => '/web-crm/wct/callbacks',
    }),
    scheduleWctCallback: builder.mutation<any, { user_id: number; reason: string }>({
      query: (body) => ({
        url: '/web-crm/wct/callbacks/schedule',
        method: 'POST',
        body,
      }),
    }),
    getWctCallHistory: builder.query<DwCallHistoryResponse, { per_page?: number; page?: number; search?: string; feedback?: string; date_from?: string; date_to?: string } | void>({
      query: (params) => ({
        url: '/web-crm/wct/call-history',
        params: params || undefined,
      }),
    }),
    getWctBreakStatus: builder.query<DwBreakStatusResponse, void>({
      query: () => '/web-crm/wct/break-status',
    }),
    getWctCampaignLeads: builder.query<any, { source?: string; search?: string; tab?: string; sort_by?: string; page?: number; per_page?: number } | void>({
      query: (params) => ({
        url: '/web-crm/wct/campaign-leads',
        params: params || undefined,
      }),
      providesTags: ['Leads'],
    }),
    updateWctCampaignLeadNotes: builder.mutation<any, { id: string | number; notes: string }>({
      query: ({ id, notes }) => ({
        url: `/web-crm/wct/campaign-leads/${id}/notes`,
        method: 'POST',
        body: { notes },
      }),
    }),
    getWctGlobalSearch: builder.query<any, string>({
      query: (searchStr) => `/web-crm/wct/global-search?q=${searchStr}`,
    }),
    getWctJobSearch: builder.query<DwJobSearchResponse, DwJobSearchParams | void>({
      query: (params) => {
        const p = new URLSearchParams();
        if (params?.page) p.set('page', String(params.page));
        if (params?.per_page) p.set('per_page', String(params.per_page));
        if (params?.status) p.set('status', params.status);
        if (params?.search) p.set('search', params.search);
        if (params?.state_id) p.set('state_id', String(params.state_id));
        if (params?.salary) p.set('salary', params.salary);
        if (params?.experience) p.set('experience', params.experience);
        const qs = p.toString();
        return `/web-crm/wct/job-search${qs ? `?${qs}` : ''}`;
      },
    }),
    getWctJobs: builder.query<WctJobsResponse, { per_page?: number; page?: number; search?: string; status?: string } | void>({
      query: (params) => ({
        url: '/web-crm/wct/jobs',
        params: params || undefined,
      }),
    }),
    getWctJobApplicants: builder.query<WctJobApplicantsResponse, number | string>({
      query: (jobId) => `/web-crm/wct/job/${jobId}/applicants`,
    }),
    getWctD7Upsell: builder.query<WctD7UpsellResponse, { per_page?: number; page?: number; search?: string } | void>({
      query: (params) => ({
        url: '/web-crm/wct/d7-upsell-queue',
        params: params || undefined,
      }),
    }),

    // MM Endpoint
    getMmDashboard: builder.query<MmDashboardResponse, void>({
      query: () => '/web-crm/match-making/home',
    }),
    getMmSubscriptions: builder.query<MmSubscriptionsResponse, {
      // Which desk's route to hit. collection_by is keyed by caller id, so
      // every role reads its own book from the identical handler; only the URL
      // prefix differs (dw / wct / match-making).
      base?: string;
      period?: string; type?: string; search?: string;
      from?: string; to?: string; page?: number; per_page?: number;
    } | void>({
      query: (arg) => {
        const { base = '/web-crm/match-making', ...params } = arg || {};
        return {
          url: `${base}/subscriptions`,
          params: Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')),
        };
      },
    }),
    getMmJobs: builder.query<MmJobsResponse, void>({
      query: () => '/web-crm/mm/jobs',
    }),
    getMmDrivers: builder.query<MmDriversResponse, MmDriverSearchParams | void>({
      query: (params) => {
        const p = new URLSearchParams();
        Object.entries(params || {}).forEach(([key, value]) => {
          if (value === undefined || value === null || value === '') return;
          if (Array.isArray(value)) {
            if (value.length === 0) return;
            p.set(key, value.join(','));
          } else {
            p.set(key, String(value));
          }
        });
        const qs = p.toString();
        return `/web-crm/mm/drivers${qs ? `?${qs}` : ''}`;
      },
    }),
    getMmDriverFilters: builder.query<MmDriverFiltersResponse, void>({
      query: () => '/web-crm/mm/driver-filters',
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
      // scope='mine' restricts the listing to jobs assigned to the signed-in
      // caller. The endpoint is system-wide by default and annotates each row
      // with is_mine; passing this lets the backend filter server-side (correct
      // pagination + counts) where the board only ever wants the caller's own.
      scope?: string;
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

    // ── MM agent reporting (all real rows, no mock data) ──
    getMmAgentPerformance: builder.query<MmAgentPerformanceResponse, { period?: string } | void>({
      query: (params) => ({
        url: '/web-crm/match-making/agent-performance',
        params: params || undefined,
      }),
      providesTags: ['MmJobs'],
    }),
    getMmAgentStats: builder.query<MmAgentStatsResponse, { period?: string } | void>({
      query: (params) => ({
        url: '/web-crm/match-making/agent-stats',
        params: params || undefined,
      }),
      providesTags: ['MmJobs'],
    }),
    getMmCallHistory: builder.query<MmCallHistoryResponse, {
      page?: number; per_page?: number; period?: string;
      call_status?: string; job_id?: string; search?: string;
      date_from?: string; date_to?: string;
    } | void>({
      query: (params) => ({
        url: '/web-crm/match-making/call-history',
        params: params || undefined,
      }),
    }),

    // Transporter job brief captured during the matchmaking call. Field names
    // mirror the mobile JobBriefFeedbackModal payload 1:1; the backend maps
    // them onto the `jobs` columns.
    submitMmJobBrief: builder.mutation<
      { success: boolean; message: string; data?: { job_id: string; updated: string[] } },
      MmJobBriefPayload
    >({
      query: (body) => ({ url: '/web-crm/match-making/job-brief', method: 'POST', body }),
      invalidatesTags: ['MmJobs', 'MmTransporter'],
    }),

    // Logs the second leg of a conference (con call) as its own
    // call_history_ivr row — the SAN widget does the actual bridging.
    logMmConferenceCall: builder.mutation<
      { success: boolean; message: string; data: { call_id: number; name: string; role: string } },
      { user_id: number; phone_number: string; job_id: string; did_number?: string }
    >({
      query: (body) => ({ url: '/web-crm/match-making/conference-call', method: 'POST', body }),
      invalidatesTags: ['MmApplicants', 'MmTransporter'],
    }),

    // Disposition for a CONFERENCE leg. Reuses the shared, unmodified
    // /web-crm/call/disposition endpoint against the leg's own call_id — the
    // primary call is dispositioned by the CTI provider as usual.
    submitMmConferenceDisposition: builder.mutation<
      { status: boolean; message?: string },
      {
        call_id: number;
        user_id: number;
        disposition: string;
        disposition_sub?: string | null;
        notes?: string | null;
        callback_at?: string | null;
        callback_sub?: string | null;
        reason?: string | null;
        call_duration?: number;
      }
    >({
      query: (body) => ({ url: '/web-crm/call/disposition', method: 'POST', body }),
      invalidatesTags: ['MmApplicants', 'MmTransporter', 'MmJobs'],
    }),

    // Greenline driver screening — native Web CRM, writes to the shared
    // driver_screening_questions table. `answers` is an ordered Yes/No array
    // (index 0 → answer1). `status` is the agent's own accepted/rejected call —
    // the returned score/decision is advisory and never sets it.
    submitMmScreening: builder.mutation<
      { status: boolean; message: string; score: number; decision: string; screening_status: string; data: any },
      { user_id: number; unique_id: string; status: string; answers: string[]; telecaller_remarks?: string }
    >({
      query: (body) => ({ url: '/web-crm/match-making/driver-screening-submit', method: 'POST', body }),
      invalidatesTags: ['MmApplicants', 'MmJobs'],
    }),
    // Change the result of an already-conducted screening (shortlisted /
    // pending / rejected). The Q&A answers and score are left untouched, so the
    // agent can revise the call as many times as they need.
    updateMmScreeningStatus: builder.mutation<
      { status: boolean; message: string; score: number; screening_status: string; data: any },
      { user_id: number; status: string; telecaller_remarks?: string }
    >({
      query: (body) => ({ url: '/web-crm/match-making/driver-screening-status', method: 'POST', body }),
      invalidatesTags: ['MmApplicants', 'MmJobs'],
    }),
    getMmDriverScreening: builder.query<MmScreeningResultsResponse, number | string>({
      query: (driverId) => `/web-crm/match-making/driver/${driverId}/screening`,
      providesTags: ['MmApplicants'],
    }),
    // Complete driver profile (all users fields + DL/PAN/Aadhaar verification).
    getMmDriverProfile: builder.query<MmDriverProfileResponse, number | string>({
      query: (driverId) => `/web-crm/match-making/driver/${driverId}/profile`,
    }),
    // Greenline applicant pipeline (rich cards + per-filter counts).
    getMmGreenlineApplicants: builder.query<MmGreenlineApplicantsResponse, {
      jobId: string; filter?: string; search?: string; cursor?: number | null; per_page?: number;
    }>({
      query: ({ jobId, ...params }) => ({
        url: `/web-crm/match-making/job/${jobId}/greenline-applicants`,
        params: Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '')),
      }),
      providesTags: ['MmApplicants'],
    }),

    // Driver Bank endpoints
    getDriverBank: builder.query<any, { search?: string; job_id?: string; availability?: string; per_page?: number; cursor?: number | null }>({
      query: (params) => ({
        url: '/web-crm/match-making/driver-bank',
        params: Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '')),
      }),
      providesTags: ['DriverBank'],
    }),
    getDriverBankDetail: builder.query<any, number | string>({
      query: (id) => `/web-crm/match-making/driver-bank/${id}`,
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

    // ── TL Matchmaking Job Board ──────────────────────────────────────────
    // Live kanban over the `jobs` table: column placement, SLA and every count
    // are computed server-side so the board can't disagree with itself.
    getTlMatchmakingBoard: builder.query<
      TlMatchmakingBoardResponse,
      { search?: string; agent_id?: number; window_days?: number; sla_hours?: number; per_column?: number } | void
    >({
      query: (params) => ({
        url: '/web-crm/tl/matchmaking-board',
        params: params
          ? Object.fromEntries(Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== ''))
          : undefined,
      }),
      providesTags: ['TlBoard'],
    }),
    getTlMatchmakingCandidates: builder.query<TlBoardCandidatesResponse, number>({
      query: (jobRowId) => `/web-crm/tl/matchmaking-board/job/${jobRowId}/candidates`,
    }),
    assignTlMatchmakingJob: builder.mutation<
      { status: boolean; message: string; data?: { job_row_id: number; assigned_to: number; assigned_name: string; previous: string | null } },
      { job_row_id: number; admin_id: number; reason: string }
    >({
      query: (body) => ({ url: '/web-crm/tl/matchmaking-board/assign', method: 'POST', body }),
      invalidatesTags: ['TlBoard'],
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
    getDwGlobalSearch: builder.query<any, string | { q: string; roles?: string }>({
      query: (arg) => {
        let searchStr = '';
        let rolesStr: string | undefined = undefined;

        const extractString = (val: any): string => {
          if (!val) return '';
          if (typeof val === 'string') return val;
          if (typeof val === 'number') return String(val);
          if (typeof val === 'object') {
            if (typeof val.q === 'string') return val.q;
            if (typeof val.query === 'string') return val.query;
            if (val.q && typeof val.q === 'object') return extractString(val.q);
          }
          return '';
        };

        searchStr = extractString(arg);

        if (typeof arg === 'object' && arg !== null) {
          if (typeof arg.roles === 'string') {
            rolesStr = arg.roles;
          }
        }

        const q = searchStr.trim();
        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (rolesStr) params.set('roles', rolesStr);
        return `/web-crm/dw/global-search?${params.toString()}`;
      },
    }),
    getDwJobSearch: builder.query<DwJobSearchResponse, DwJobSearchParams | void>({
      query: (params) => {
        const p = new URLSearchParams();
        if (params?.page) p.set('page', String(params.page));
        if (params?.per_page) p.set('per_page', String(params.per_page));
        if (params?.status) p.set('status', params.status);
        if (params?.search) p.set('search', params.search);
        if (params?.state_id) p.set('state_id', String(params.state_id));
        if (params?.salary) p.set('salary', params.salary);
        if (params?.experience) p.set('experience', params.experience);
        const qs = p.toString();
        return `/web-crm/dw/job-search${qs ? `?${qs}` : ''}`;
      },
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
  useLazyGetWctQueueQuery,
  useGetWctQueueCountsQuery,
  useGetWctQueueFreshQuery,
  useGetWctQueueOldQuery,
  useGetWctQueueUncalledQuery,
  useGetWctQueueCallbacksQuery,
  useGetWctQueueCalledQuery,
  useGetWctNextLeadQuery,
  useLazyGetWctNextLeadQuery,
  useLazyGetWctQueueFreshQuery,
  useLazyGetWctQueueOldQuery,
  useLazyGetWctQueueUncalledQuery,
  useLazyGetWctQueueCallbacksQuery,
  useLazyGetWctQueueCalledQuery,
  useLazyGetWctQueueCountsQuery,
  useSkipWctLeadMutation,
  useGetWctLeadDetailQuery,
  useGetWctDispositionOptionsQuery,
  useSubmitWctFeedbackMutation,
  useGetWctPerformanceQuery,
  useGetWctCallbacksQuery,
  useScheduleWctCallbackMutation,
  useGetWctCallHistoryQuery,
  useGetWctBreakStatusQuery,
  useGetWctCampaignLeadsQuery,
  useLazyGetWctCampaignLeadsQuery,
  useUpdateWctCampaignLeadNotesMutation,
  useGetWctGlobalSearchQuery,
  useLazyGetWctGlobalSearchQuery,
  useGetWctJobSearchQuery,
  useLazyGetWctJobSearchQuery,
  useGetWctJobsQuery,
  useGetWctJobApplicantsQuery,
  useGetWctD7UpsellQuery,
  useGetMmDashboardQuery,
  useGetMmSubscriptionsQuery,
  useGetMmJobsQuery,
  useGetMmDriversQuery,
  useGetMmDriverFiltersQuery,
  usePlaceMmDriverMutation,
  useGetMmJobApplicantsQuery,
  useGetMmJobCallLogsQuery,
  useGetMmPlacementsQuery,
  useGetMmJobListingsQuery,
  useGetMmJobDetailQuery,
  useGetMmJobTransporterDetailQuery,
  useGetMmApplicantsFullQuery,
  useTagMmCallMutation,
  useGetMmAgentPerformanceQuery,
  useGetMmAgentStatsQuery,
  useGetMmCallHistoryQuery,
  useSubmitMmJobBriefMutation,
  useLogMmConferenceCallMutation,
  useSubmitMmConferenceDispositionMutation,
  useSubmitMmScreeningMutation,
  useUpdateMmScreeningStatusMutation,
  useGetMmDriverScreeningQuery,
  useLazyGetMmDriverScreeningQuery,
  useGetMmDriverProfileQuery,
  useGetMmGreenlineApplicantsQuery,
  useGetDriverBankQuery,
  useGetDriverBankDetailQuery,
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
  useGetTlMatchmakingBoardQuery,
  useGetTlMatchmakingCandidatesQuery,
  useAssignTlMatchmakingJobMutation,
  useGetTargetQuery,
  useSetTargetMutation,
  useGetDwCampaignLeadsQuery,
  useLazyGetDwCampaignLeadsQuery,
  useUpdateDwCampaignLeadNotesMutation,
  useGetDwGlobalSearchQuery,
  useLazyGetDwGlobalSearchQuery,
  useGetDwJobSearchQuery,
  useLazyGetDwJobSearchQuery,
} = webCrmApi;

