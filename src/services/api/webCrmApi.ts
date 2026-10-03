import { baseApi } from './baseApi';
import { API_BASE_URL, COUPON_API_BASE_URL } from '../../shared/constants/config';

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
  /**
   * 'crm' = SAN's network CDR had nothing for this agent/period, so these
   * figures were derived from call_history_ivr. Missed counts are 0 and
   * UNKNOWN in that mode, not genuinely zero — only the network sees a call
   * nobody answered. Absent when the numbers come from the real CDR.
   */
  source?: 'crm';
  /** Dials that never reached the lead. Only set in the 'crm' fallback. */
  not_connected?: number;
  callback_later?: number;
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
      /** Distinct numbers dialled today — calls_today counts every dial. */
      unique_leads_today: number;
      connected_today: number;
      subscriptions_today: number;
      feedback_missing: number;
      call_time: string;
      /** Handling time — dial through disposition, every call. See calls_summary. */
      total_active_time: string;
      monthly_revenue: number;
      missed_calls: number;
      incoming_missed: number;
    };
    calls_summary: {
      total_calls: number;
      /** Distinct numbers dialled in the period. */
      unique_leads: number;
      /** Distinct numbers that were reached at least once. */
      unique_connected: number;
      /** total_calls − unique_leads: dials to a number already called. */
      repeat_calls: number;
      incoming: number;
      outgoing: number;
      connected: number;
      not_connected: number;
      callback_later: number;
      conversions: number;
      connect_rate: number;
      conversion_rate: number;
      /**
       * TALK time. call_history_ivr.active_time is 0 whenever the call never
       * connected, so this covers connected calls only.
       */
      call_time: string;
      call_seconds: number;
      /**
       * HANDLING time: dial (the Call button) through to the disposition, on
       * EVERY call. Talk time alone credits an agent with nothing for a number
       * that rang out, though the dial and the disposition still cost them time.
       */
      total_active_time: string;
      total_active_seconds: number;
      period: string;
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
      recording_url?: string | null;
      recording_source?: string | null;
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
      /** Distinct numbers dialled in the period — total_calls counts every dial. */
      unique_leads: number;
      /** total_calls − unique_leads: dials to a number already called. */
      repeat_calls: number;
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
    callback_at?: string | null;
    call_status?: string | null;
    callback_resolution?: string | null;
    call_feedback?: string | null;
  }>;
  total: number;
}

/** Master-calendar filters for the callbacks query. */
export interface CallbacksParams {
  status?: 'active' | 'done' | 'cancelled' | 'all';
  from?: string;
  to?: string;
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

// One call against an applicant, from call_history_ivr — any process (DWC / MM /
// TWC), not just this caller's own calls.
export interface WctApplicantCall {
  id: number;
  call_status: string | null;
  feedback: string | null;
  remarks: string | null;
  disposition_sub: string | null;
  process: string | null;
  direction: 'incoming' | 'outgoing';
  duration_seconds: number;
  callback_at: string | null;
  called_by: string | null;
  called_at: string;
  recording_url: string | null;
  recording_source: string | null;
}


// ── ID Verification desk (shared by DWC / TWC / MM) ─────────────────────────
export interface IdvCheck {
  key: string;
  label: string;
  icon: string;
  /** What the caller should ask for to get this check run. */
  hint: string | null;
  /** clean | attention | failed | pending | not_done */
  state: string;
  detail: string | null;
  at: string | null;
  extra: Record<string, string | number | null>;
  entitled: boolean;
  entitlement_note: string;
  /** Paid for but never run — the reason to call. */
  actionable: boolean;
}

export interface IdvQueueRow {
  id: number;
  tmid: string | null;
  name: string;
  mobile: string | null;
  role: string;
  location: string;
  registered_at: string | null;
  last_paid_at: string | null;
  is_mine: boolean;
  plan: string | null;
  plan_amount: number;
  entitled_count: number;
  done_count: number;
  pending_count: number;
  attention_count: number;
  completion: number;
  last_call: { status: string; feedback: string; by: string; at: string } | null;
}

export interface IdvQueueResponse {
  status: boolean;
  data: IdvQueueRow[];
  pagination: { total: number; per_page: number; current_page: number; last_page: number };
}

export interface IdvCall {
  id: number;
  call_status: string | null;
  feedback: string | null;
  remarks: string | null;
  disposition_sub: string | null;
  duration_seconds: number;
  handling_seconds: number;
  callback_at: string | null;
  called_by: string | null;
  called_at: string;
  recording_url: string | null;
  recording_source: string | null;
}

export interface IdvDossierResponse {
  status: boolean;
  data: {
    user: {
      id: number; tmid: string | null; name: string; mobile: string | null;
      email: string | null; role: string; location: string;
      registered_at: string | null; profile_image: string | null;
    };
    plan: { best: string | null; best_amount: number; types: string[]; paid_at: string | null; is_top_plan: boolean };
    summary: IdvQueueRow extends never ? never : {
      plan: string | null; plan_amount: number; entitled_count: number; done_count: number;
      pending_count: number; attention_count: number; failed_count?: number; completion: number;
      failed_checks?: string[];
      last_call: { status: string; feedback: string; by: string; at: string } | null;
    };
    checks: IdvCheck[];
    payments: { plan: string; type: string; amount: number; paid_at: string; start_at: string | null; end_at: string | null }[];
    calls: IdvCall[];
  };
}

export interface IdvVerificationField {
  name: string;
  label: string;
  type: string;          // text | textarea | date | datetime | number | select
  options?: string[];
}

export interface IdvVerificationDetailResponse {
  status: boolean;
  data: {
    key: string;
    label: string;
    table: string;
    /** DAV / Court can be filled by the agent; DL / PAN / Aadhaar / Face are view-only. */
    editable: boolean;
    fields: IdvVerificationField[];
    record: Record<string, string | number | null> | null;
    filled: boolean;
  };
}

export interface IdvDispositionOptions {
  status: boolean;
  data: {
    process: string;
    call_statuses: { value: string; label: string; label_hi: string }[];
    sub_dispositions: Record<string, { value: string; label: string; label_hi: string; color: string }[]>;
  };
}

/** One telecaller's row on the ID Verification team-progress leaderboard. */
export interface IdvAgentStatRow {
  agent_id: number;
  agent_name: string;
  subscribers: number;
  subscriber_drivers: number;
  subscriber_transporters: number;
  trusted_drivers: number;
  verified_drivers: number;
  entitled_checks: number;
  done_checks: number;
  fully_verified: number;
  fully_verified_drivers: number;
  fully_verified_transporters: number;
  pending_subscribers: number;
  completion: number;       // done ÷ entitled across the whole book, %
  calls_made: number;
  connected_calls: number;
  contacted: number;
}

export interface IdvDocCompletionItem {
  entitled: number;
  done: number;
  pending: number;
  pct: number;
}

export interface IdvAgentStatsResponse {
  status: boolean;
  data: IdvAgentStatRow[];
  doc_completion?: Record<string, IdvDocCompletionItem>;
  range?: { key: string; label: string; from: string | null; to: string | null };
  totals: {
    agents: number;
    subscribers: number;
    subscriber_drivers: number;
    subscriber_transporters: number;
    trusted_drivers: number;
    verified_drivers: number;
    entitled_checks: number;
    done_checks: number;
    fully_verified: number;
    fully_verified_drivers: number;
    fully_verified_transporters: number;
    calls_made: number;
    connected_calls: number;
    completion: number;
    doc_completion?: Record<string, IdvDocCompletionItem>;
  };
}

/** One row in the Date-wise Verification Checks Excel-style Sheet */
/**
 * Per-check counts for one attribution bucket. `self` = the driver completed
 * the check on their own; `agent` = it landed on/after the agent's first
 * connected call, i.e. the agent's calling produced it.
 */
export interface IdvCheckSplit {
  dl: number;
  pan: number;
  aadhaar: number;
  face: number;
  court: number;
  dav: number;
  rc: number;
  challan: number;
  total: number;
}

export interface IdvDailyCheckStatRow {
  date: string;
  formatted_date: string; // e.g. "01-Sep-2024"
  day_name: string; // e.g. "Mon"
  dl_check: number; // combined (self + agent), one column per check
  pan_check: number;
  aadhaar_check: number;
  face_check: number;
  court_check: number;
  dav_check: number;
  rc_check: number;
  challan_check: number;
  total: number;
  self: IdvCheckSplit; // driver's own self-service checks that day
  agent: IdvCheckSplit; // checks the agent's call produced that day
}

export interface IdvDailyCheckStatsResponse {
  status: boolean;
  range: string;
  from: string;
  to: string;
  scope: string;
  agent_id?: number;
  agent_name?: string;
  agent_scoped?: boolean;
  data: IdvDailyCheckStatRow[];
  totals: IdvCheckSplit & {
    self: IdvCheckSplit;
    agent: IdvCheckSplit;
  };
}

/** Date window for the self scorecard's call metrics. */
export type IdvSelfRange = 'today' | 'yesterday' | 'week' | 'month' | 'last_month' | 'all' | 'custom';

/** The signed-in telecaller's own ID-verification scorecard. */
export interface IdvSelfStatsResponse {
  status: boolean;
  data: {
    agent_id: number;
    agent_name: string;
    range: { key: string; label: string; from: string | null; to: string | null };
    /** Dialling effort inside the selected date window. */
    calls: {
      total: number;
      connected: number;
      not_connected: number;
      /** Neither connected nor not-connected — callbacks / feedback-pending. */
      other: number;
      driver: number;
      transporter: number;
      contacted: number;
      connect_rate: number;
    };
    /** The verification book they own — current snapshot, not date-ranged. */
    book: {
      subscribers: number;
      subscriber_drivers: number;
      subscriber_transporters: number;
      entitled_checks: number;
      done_checks: number;
      fully_verified: number;
      under_progress: number;
      /** Fully-verified subscribers ÷ the whole book, %. */
      completion: number;
      /** Individual checks done ÷ entitled, %. */
      check_completion: number;
    };
    doc_completion?: Record<string, IdvDocCompletionItem>;
  };
}

/** One entitled verification on a self-subscriber row. */
export interface IdvSelfSubscriberCheck {
  key: string;
  label: string;
  icon: string;
  /** clean | attention | failed | pending | not_done */
  state: string;
  /** completed (clean) · in_progress (running/flagged) · to_do (never run). */
  bucket: 'completed' | 'in_progress' | 'to_do';
  /** When the check was last run, when known. */
  at?: string | null;
}

/**
 * The shared shape the ID-verification desk table renders. A subscriber row and
 * a call-history row are both an IdvDeskUser, so one row component renders both
 * pixel-for-pixel. It deliberately omits `calls`, which each subtype defines
 * differently (a count on the subscriber row, the timeline on the call row).
 */
export interface IdvDeskUser {
  id: number;
  tmid: string | null;
  name: string;
  mobile?: string | null;
  license_number?: string | null;
  rc_number?: string | null;
  role: string;
  location: string;
  /** When this caller last called them — shown in the CONTACT column. */
  last_call_at: string | null;
  plan: string | null;
  plan_amount: number;
  entitled: number;
  completed: number;
  in_progress: number;
  to_do: number;
  /** Verified (clean) checks ÷ entitled, %. */
  completion: number;
  checks: IdvSelfSubscriberCheck[];
}

/** One user on the caller's desk list (subscriber and/or reached), with breakdown. */
export interface IdvSelfSubscriberRow extends IdvDeskUser {
  last_paid_at: string | null;
  /** Assigned to the signed-in caller — their own subscriber. */
  is_mine: boolean;
  /** The caller has called this user at least once on the verification desk. */
  reached: boolean;
  /** How many times the caller reached them. */
  calls: number;
  connected_calls: number;
}

export interface IdvSelfSubscribersResponse {
  status: boolean;
  data: IdvSelfSubscriberRow[];
  pagination: { total: number; per_page: number; current_page: number; last_page: number };
}

/**
 * One REACHED user on the Call History screen. Same IdvDeskUser shape as the
 * subscriber row (so the same table row renders both), plus this caller's call
 * counts and the full call TIMELINE for that user, which the row expands to
 * reveal.
 */
export interface IdvSelfCallRow extends IdvDeskUser {
  /** How many times this caller called them (in the window), and how many connected. */
  call_count: number;
  connected_count: number;
  /** Every call this caller made to them, newest first. */
  calls: IdvCall[];
}

export interface IdvSelfCallsResponse {
  status: boolean;
  data: IdvSelfCallRow[];
  range: { key: string; label: string; from: string | null; to: string | null };
  totals: {
    total: number;
    connected: number;
    not_connected: number;
    callback_later: number;
    contacted: number;
    connect_rate: number;
  };
  pagination: { total: number; per_page: number; current_page: number; last_page: number };
}

// ── Revenue Challenge (September 2026 Targets & Incentives) ──────────────────
export type RcCategory = 'driver' | 'transporter' | 'matchmaking' | 'other';

export interface RcAgentRow {
  name: string;
  admin_id: number | null;
  /** Whether the target name resolved to an active roster member. */
  matched: boolean;
  role: string | null;
  category: RcCategory;
  monthly_target: number;
  period_target: number;
  achieved_period: number;
  achieved_month: number;
  pct_period: number;
  pct_month: number;
  remaining_period: number;
  /** ₹1,000 achievement incentive (≥ ₹5,000 collected in the sprint). */
  achievement_unlocked: boolean;
  achievement_reward: number;
  achievement_gate: number;
  achievement_remaining: number;
  /** ₹100 per driver placed (Successful Recruitment). */
  placements_period: number;
  placements_month: number;
  placement_rate: number;
  placement_incentive_period: number;
  placement_incentive_month: number;
  rank: number;
}

export interface RcCategoryLeader {
  category: RcCategory;
  admin_id: number;
  name: string;
  role: string | null;
  revenue: number;
  award: number;
}

export interface RcSprint {
  key: string;
  label: string;
  share: number;
  target: number;
  from: string;
  to: string;
}

export interface RcPolicyRow {
  team: string;
  product: string;
  price: number | null;
  incentive: number;
  rule: string;
  condition: string;
}

export interface RevenueChallengeResponse {
  status: boolean;
  data: {
    contest: {
      title: string;
      month_label: string;
      month_goal: number;
      month_achieved: number;
      month_pct: number;
      as_of: string;
    };
    period: {
      key: string;
      label: string;
      share: number;
      from: string;
      to: string;
      is_current: boolean;
      target: number;
      achieved: number;
      pct: number;
      days_left: number;
    };
    sprints: RcSprint[];
    agents: RcAgentRow[];
    category_leaders: {
      driver: RcCategoryLeader | null;
      transporter: RcCategoryLeader | null;
      matchmaking: RcCategoryLeader | null;
    };
    category_award: number;
    team_incentives: {
      matchmaking_per_joining: number;
      verification_share_pct: number;
      verification_revenue: number;
      verification_pool: number;
    };
    incentive_policy: RcPolicyRow[];
  };
}

/** The signed-in agent's own challenge card (My Target screen + login popup). */
export interface MyRcSprint {
  key: string;
  label: string;
  share: number;
  team_target: number;
  my_target: number;
  achieved: number;
  from: string;
  to: string;
  is_current: boolean;
}

export interface MyRcBreakdown {
  type: string;
  label: string;
  category: RcCategory;
  amount: number;
  count: number;
}

export interface MyRcDaily {
  date: string;
  label: string;
  amount: number;
}

export interface MyRevenueChallengeResponse {
  status: boolean;
  data: {
    agent: { id: number; name: string; role: string; category: RcCategory; has_target: boolean };
    breakdown: MyRcBreakdown[];
    daily: MyRcDaily[];
    contest: {
      title: string;
      month_label: string;
      month_goal: number;
      sprint_key: string;
      sprint_label: string;
      sprint_share: number;
      sprint_from: string;
      sprint_to: string;
      current_sprint: string;
      days_left: number;
      is_current: boolean;
      as_of: string;
    };
    my: {
      monthly_target: number;
      period_target: number;
      achieved_period: number;
      achieved_month: number;
      pct_period: number;
      pct_month: number;
      remaining_period: number;
      remaining_month: number;
      achievement_gate: number;
      achievement_unlocked: boolean;
      achievement_reward: number;
      achievement_remaining: number;
      // ₹100 per driver placed (Successful Recruitment).
      placements_period: number;
      placements_month: number;
      placement_rate: number;
      placement_incentive_period: number;
      placement_incentive_month: number;
    };
    category_standing: {
      category: RcCategory;
      rank: number | null;
      total_peers: number;
      is_leader: boolean;
      award: number;
      leader_name: string | null;
      leader_revenue: number;
    };
    sprints: MyRcSprint[];
    team: { sprint_target: number; sprint_achieved: number; month_goal: number; month_achieved: number };
    awards: { category_award: number; achievement_reward: number; achievement_gate: number };
  };
}

/**
 * User Connectivity SLA — the 20-minute first-call rule (framework Parameter 1).
 * Derived server-side from users.Created_at + call_history_ivr; nothing stored.
 */
export type SlaStatus = 'met' | 'late' | 'not_called' | 'pending';
export type SlaConnectivity = 'connected' | 'callback' | 'not_connected' | 'in_progress' | 'not_attempted';
export type SlaRange = 'today' | 'yesterday' | '7d' | 'month' | 'custom';

export interface SlaRow {
  user_id: number;
  tmid: string;
  name: string;
  mobile: string;
  role: string;
  type_label: string;
  assigned_to: number | null;
  assigned_name: string | null;
  registered_at: string;
  after_hours: boolean;
  clock_start: string;
  deadline: string;
  first_attempt_at: string | null;
  first_attempt_by: string | null;
  tat_min: number | null;
  late_by_min: number | null;
  sla_status: SlaStatus;
  attempts: number;
  connectivity: SlaConnectivity;
  reason: string | null;
  reason_label: string | null;
  /** Only on `running` rows from /me. */
  seconds_left?: number;
}

export interface SlaTally {
  registrations: number;
  met: number;
  late: number;
  not_called: number;
  pending: number;
  breached: number;
  due: number;
  unassigned: number;
  attempted: number;
  connected: number;
  compliance_pct: number | null;
  avg_tat_min: number | null;
  connect_rate_pct: number | null;
  avg_attempts: number | null;
}

export interface SlaReport {
  window: { range: SlaRange; from: string; to: string };
  rules: { sla_minutes: number; window: string; duty_close: string; days: string };
  as_of: string;
  summary: SlaTally;
  by_type: Array<SlaTally & { key: string; label: string }>;
  daily: Array<{ date: string; registrations: number; met: number; breached: number; pending: number; compliance_pct: number | null }>;
  reasons: Array<{ key: string; label: string; count: number }>;
  list: { data: SlaRow[]; total: number; page: number; per_page: number; last_page: number };
}

export interface SlaAgentRow extends SlaTally {
  agent_id: number | null;
  name: string;
  desk: string | null;
  /** ₹ collected in the same window (framework Parameter 2). */
  revenue: number;
}

export interface ConnectivitySlaResponse {
  status: boolean;
  data: SlaReport & { by_agent: SlaAgentRow[] };
}

export interface MyConnectivitySlaResponse {
  status: boolean;
  data: SlaReport & { running: SlaRow[]; overdue: SlaRow[] };
}

export interface SlaQuery {
  range?: SlaRange;
  from?: string;
  to?: string;
  role?: string;
  agent_id?: number | string;
  status?: string;
  search?: string;
  page?: number;
  per_page?: number;
}

export interface RevivalOffer {
  id: number;
  user_id: number;
  tmid: string | null;
  name: string;
  mobile: string | null;
  role: string | null;
  location: string;
  coupon_code: string;
  plan: string;
  plan_label: string;
  mrp: number | null;
  discount: number;
  offer_price: number | null;
  expiry_date: string | null;
  offered_at: string;
  agent_id: number | null;
  agent_name: string;
  converted: boolean;
  converted_at: string | null;
  converted_same_plan: boolean;
  expired: boolean;
  status: 'active' | 'expired' | 'converted';
}

export interface RevivalOffersResponse {
  status: boolean;
  data: RevivalOffer[];
  summary: {
    total: number; active: number; expired: number; converted: number;
    conversion_rate: number; discount_given: number; revenue: number;
  };
  pagination: { total: number; per_page: number; current_page: number; last_page: number };
}

export interface CouponResponse {
  success: boolean;
  message: string;
  data: {
    id?: number;
    user_id: number;
    unique_id: string;
    coupon_code: string;
    coupon_amount: number | string;
    expiry_date: string;
    payment_type: string;
  };
}

export interface CrmThemeRow {
  id: number;
  slug: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  /** What is ACTUALLY being served — a schedule overrides the is_active flag. */
  is_live: boolean;
  starts_at?: string | null;
  ends_at?: string | null;
  palette?: Record<string, string>;
  assets?: Record<string, string>;
  options?: Record<string, string | boolean | number>;
  updated_by?: string | null;
  updated_at?: string | null;
}

export interface CrmThemesResponse {
  status: boolean;
  data: CrmThemeRow[];
}

export interface CrmThemeActivateResponse {
  status: boolean;
  message?: string;
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
  call_stats: {
    total: number;
    connected: number;
    last_call_at: string | null;
    last_status: string | null;
    last_called_by: string | null;
    last_feedback: string | null;
  };
  calls: WctApplicantCall[];
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

export type WctExpiringWindow = 'tomorrow' | '3days' | 'week' | 'expired';
/** pending = not yet called for this subscription; called = renewal call made. */
export type WctExpiringTab = 'pending' | 'called';
/** all = whole desk; mine = only transporters assigned to the calling agent. */
export type WctExpiringScope = 'all' | 'mine';

export interface WctExpiringLead {
  id: number;
  tmid: string;
  company_name: string;
  contact_name: string;
  phone: string;
  location: string;
  fleet_size: string | null;
  plan_label: string;
  amount: number;
  started_at: string | null;
  expires_at: string;
  /** Calendar days left — 0 = today, 1 = tomorrow, negative = expired that many days ago. */
  days_left: number;
  /** Already past its expiry and not renewed. */
  expired: boolean;
  assigned_name: string | null;
  renew_calls: number;
  last_call_at: string | null;
  last_call_status: string | null;
  last_call_feedback: string | null;
  last_call_note: string | null;
  last_call_by: string | null;
}

export interface WctExpiringResponse {
  status: boolean;
  data: {
    window: WctExpiringWindow;
    tab: WctExpiringTab;
    scope: WctExpiringScope;
    /** YYYY-MM the Expired filter is narrowed to, or null for all months. */
    month: string | null;
    /** Months with expiries in the active tab, newest first — for the month picker. */
    expired_months: { month: string; label: string; count: number }[];
    counts: Record<WctExpiringWindow, number>;
    tab_counts: Record<WctExpiringTab, number>;
    leads: WctExpiringLead[];
    pagination: { total: number; per_page: number; current_page: number; last_page: number };
  };
}

export type MmApplicantStatus =
  | 'matched' | 'interview_done' | 'rejected' | 'not_interested' | 'follow_up'
  | 'interested' | 'connected' | 'not_reachable' | 'new' | 'pending';
export type MmJobTier = 'standard' | 'premium' | 'super_premium';

/** One application assigned to an MM agent (applyjobs.assigned_to). */
export interface MmApplicantItem {
  application_id: number;
  applied_at: string;
  /** applyjobs.accept_reject_status — the transporter's own decision. */
  transporter_decision: 'pending' | 'accepted' | 'rejected';
  status: MmApplicantStatus;
  status_label: string;
  mm_agent: { id: number; name: string | null };
  driver: {
    id: number; name: string | null; tmid: string | null;
    /** For the dialler only — never rendered on matchmaking screens. */
    mobile: string | null;
    location: string | null; registered_at: string | null;
  };
  job: {
    id: number; code: string | null; title: string | null; location: string | null; route: string | null;
    vehicle: string | null; salary: string | null; experience: string | null; licence: string | null;
    drivers_required: number | null; tier: MmJobTier | null; is_greenline: boolean;
    created_at: string | null; verified: boolean; active: boolean; state: string; agent_name: string | null;
  } | null;
  transporter: {
    id: number; company: string | null; contact: string | null; tmid: string | null;
    /** For the dialler / conference only — never rendered. */
    mobile: string | null;
    agent_name: string | null;
  } | null;
  calls: {
    count: number; last_at: string | null; last_status: string | null; last_outcome: string | null;
    last_by: string | null; last_note: string | null; follow_up_at: string | null;
    follow_up_overdue: boolean;
  };
  call_lock: { owner_name: string; job_id: string | null; message: string } | null;
  can_call: boolean;
}

export interface MmApplicantsSummary {
  total: number;
  status: Record<MmApplicantStatus, number>;
  by_tier: Record<MmJobTier, number>;
  applied_today: number;
  followups_today: number;
  followups_overdue: number;
  never_called: number;
  called_today: number;
}

export interface MmApplicantsParams {
  status?: MmApplicantStatus;
  tier?: MmJobTier;
  from?: string;
  to?: string;
  followup?: 'today' | 'overdue' | 'upcoming' | 'any';
  call?: 'never' | 'connected' | 'not_connected';
  search?: string;
  sort?: 'applied_desc' | 'applied_asc' | 'last_call' | 'followup';
  page?: number;
  per_page?: number;
  /** Team leads / heads only: an agent id, or 'all'. */
  agent_id?: number | 'all';
}

export interface MmApplicantsResponse {
  status: boolean;
  message?: string;
  data: {
    summary: MmApplicantsSummary;
    statuses: { key: MmApplicantStatus; label: string }[];
    items: MmApplicantItem[];
    /** Present only for team leads / heads. */
    agents: { id: number; name: string; is_active: number }[] | null;
    agent_id: number | null;
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
      fulfilled_jobs?: { count: number };
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
    // Mutually exclusive: open + hold + closed + expired = all.
    // `expiring_soon` is a warning subset of open, never part of the total.
    job_status_counts?: Record<'regular' | 'greenline', {
      all: number; open: number; hold: number; pending: number;
      closed: number; fulfilled: number; expired: number; expiring_soon: number;
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
  operatingStates?: string | null;
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
  state_id?: number | string | Array<number | string>;
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
  /** 'yes' = has a captured payment, 'no' = never paid. */
  subscribed?: 'yes' | 'no';
  /** Leave out drivers another agent holds via the driver lock… */
  hide_locked?: 1;
  /** …judged against this job code (its current owner still sees its locked drivers). */
  lock_job_id?: string;
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
      /**
       * TALK seconds (call_history_ivr.active_time + jobs_match_making).
       * 0 on any call that never connected, so this is connected calls only.
       */
      active_seconds: number;
      /** Same figure preformatted as "2h 5m". */
      active_time: string;
      /**
       * HANDLING seconds: dial (the Call button) through to the disposition, on
       * EVERY call. Talk time alone credits an agent with nothing for a number
       * that rang out, though the dial and the disposition still cost them time.
       */
      total_active_seconds: number;
      /** Same figure preformatted as "2h 5m". */
      total_active_time: string;
      /** Averaged over CONNECTED calls only. */
      avg_active_seconds: number;
      avg_active_time: string;
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

export interface PlacementJobManager {
  id: number;
  name: string;
}

/** One row of the Interview Done / Placed Drivers report. */
export interface PlacementRow {
  id: string;
  /** call_history_ivr.id when this came off a call; null for a Driver Bank row. */
  call_id: number | null;
  /** Which table this row is from. `driver_job_status` is the mapping source —
   *  it names the job and the driver on one row — and outranks the other two
   *  where the same job × driver appears in more than one. */
  source: 'driver_job_status' | 'call' | 'driver_bank';
  job_id: string | null;
  job_db_id: number | null;
  job_title: string | null;
  /** users.id of the driver; null when the outcome was filed on the
   *  TRANSPORTER's call and no source could say which driver it was about. */
  driver_id: number | null;
  /** Null when the outcome was filed on the TRANSPORTER's call — no column on
   *  that row names the driver, so the report says so instead of guessing. */
  driver_tmid: string | null;
  driver_name: string | null;
  driver_mobile: string | null;
  transporter_tmid: string | null;
  transporter_name: string | null;
  placed_at: string;
  placed_at_display: string;
  /** Driver's date of joining (raw ISO + pre-formatted), null when not set. */
  joining_date: string | null;
  joining_date_display: string | null;
  last_activity_at: string;
  job_manager: string | null;
  job_manager_id: number | null;
  logged_on: 'driver' | 'transporter';
  outcome: string;
  remarks: string | null;
  match_status: string | null;
  /** The driver also sits in driver_bank against this job. */
  in_driver_bank: boolean;
  /** How many qualifying records collapsed into this one row. */
  entries: number;
  /** Distinct drivers placed on this job (driver_job_status), the job's own
   *  total — NOT narrowed by the report's filters. Null where the job is
   *  unknown or the deployment has no driver_job_status table. */
  job_placed_total: number | null;
}

export type PlacementReportTab = 'all' | 'interview_done' | 'placed';

export interface PlacementReportResponse {
  status: boolean;
  tab: PlacementReportTab;
  rows: PlacementRow[];
  counts: { all: number; interview_done: number; placed: number };
  job_managers: PlacementJobManager[];
  pagination: { total: number; per_page: number; current_page: number; last_page: number };
}

export interface MmCallHistoryRow {
  id: number;
  recording_url: string | null;
  bill_duration: number | string | null;
  job_id: string | null;
  job_title: string | null;
  transporter_name: string | null;
  /** The job's transporter is on a Greenline plan — drives the Greenline
   *  disposition options when this call is redialled. */
  is_greenline: boolean;
  lead_id: number | null;
  lead_tmid: string | null;
  lead_name: string | null;
  lead_role: string | null;
  /** Number to redial — the lead's current mobile, not the call's snapshot. */
  lead_mobile: string | null;
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
  /** Set when this call went to one of the driver's relatives, not the driver. */
  relative?: MmRelativeOnCall | null;
}

export interface MmCallHistoryResponse {
  status: boolean;
  data: MmCallHistoryRow[];
  /** Every disposition this agent has filed — powers the feedback filter.
   *  Mixes MM machine keys and onboarding human labels, as the column does. */
  feedback_options: string[];
  pagination: { total: number; per_page: number; current_page: number; last_page: number };
}

/**
 * Incoming Call History — one shape for DW / WCT / MM (backend:
 * IncomingCallController). Each row is one call that rang on the agent's
 * extension, merged from SAN's network CDR (webhook_crm — the only source that
 * sees never-answered calls) and the CRM's own call_history_ivr row, with the
 * caller's full lead record attached.
 */
export interface IncomingCallLead {
  type: 'user' | 'campaign';
  user_id: number | null;
  social_lead_id?: number;
  name: string;
  tmid: string | null;
  mobile: string | null;
  email?: string | null;
  role?: string | null;
  city?: string | null;
  state?: string | null;
  location?: string | null;
  vehicle_type?: string | null;
  experience?: string | null;
  source?: string | null;
  registered_at?: string | null;
  assigned_to?: number | null;
  assigned_name?: string | null;
  is_my_lead: boolean;
  total_calls: number;
  my_calls?: number;
  connected_calls?: number;
  last_call_at?: string | null;
  last_call_status?: string | null;
  last_feedback?: string | null;
  last_called_by?: string | null;
  current_plan: string | null;
  is_subscribed?: boolean;
}

export interface IncomingCallRow {
  id: string;
  /** 'both' = matched CDR + CRM row, 'cdr' = never landed on screen, 'crm' = CDR missing. */
  source: 'both' | 'cdr' | 'crm';
  call_id: number | null;
  /** The account the call was attributed to on arrival — wins over the number. */
  lead_user_id: number | null;
  caller_number: string | null;
  did_number: string | null;
  started_at: string;
  sort_time: number;
  date_display: string;
  time_display: string;
  day_label: string;
  answered: boolean;
  missed: boolean;
  /** The CTI popped this call on the agent's screen (a CRM row exists). */
  landed: boolean;
  ring_seconds: number;
  ring_display: string;
  queue_display: string | null;
  talk_seconds: number;
  talk_display: string;
  cause_txt: string | null;
  ended_by: string | null;
  san_agent_name: string | null;
  san_unique_id: string | null;
  dispositioned: boolean;
  call_status: string | null;
  call_feedback: string | null;
  call_remarks: string | null;
  disposition_sub: string | null;
  callback_at: string | null;
  recording_url: string | null;
  bill_duration?: string | null;
  wrapup_durn?: string | null;
  lead: IncomingCallLead | null;
}

export interface IncomingCallsResponse {
  status: boolean;
  period: string;
  data: IncomingCallRow[];
  summary: {
    total: number;
    answered: number;
    missed: number;
    landed: number;
    pending_feedback: number;
    unique_callers: number;
    known_leads: number;
    unknown_callers: number;
    my_leads: number;
    talk_seconds: number;
    talk_time: string;
    answer_rate: number;
  };
  cdr: { agent_name: string | null; extension: string | null; available: boolean };
  pagination: { total: number; per_page: number; current_page: number; last_page: number };
}

export interface IncomingCallsParams {
  period?: string;
  date_from?: string;
  date_to?: string;
  status?: 'all' | 'answered' | 'missed';
  handled?: 'all' | 'dispositioned' | 'pending';
  lead?: 'all' | 'known' | 'unknown';
  search?: string;
  page?: number;
  per_page?: number;
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
/** Mark or clear the signed-in agent's hot flag on one lead. */
export interface HotLeadToggleArgs {
  /** users.id where the lead has one; campaign leads are identified by tm_id. */
  user_id?: number | string | null;
  tm_id?: string | null;
  mobile?: string | null;
  name?: string | null;
  hot: boolean;
}

export interface HotLeadToggleResponse {
  status: boolean;
  message: string;
  data: { tmid: string | null; user_id: number | null; is_hot: boolean; rows: number };
}

/** Every lead the agent has flagged — the queue marks its own rows from this. */
export interface HotLeadKeysResponse {
  status: boolean;
  data: { tmids: string[]; user_ids: number[] };
}

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
      /** Free text the agent typed on that call — shown under the outcome. */
      last_call_remarks: string | null;
      last_call_by: string | null;
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
      /** The agent's Open/Hold/Closed/Fulfilled word — null on a job nobody has set. */
      job_status: JobStatus | null;
      job_status_remarks: string | null;
      job_status_by_name: string | null;
      /** Seats the job needs, and — on a fulfilled job — the placed drivers' TMIDs. */
      drivers_needed?: number;
      driver_placed?: string[] | null;
      /** The placed drivers with their names, for the fulfilled card. */
      placed_drivers?: Array<{ tmid: string; name: string | null }>;
      is_greenline: boolean;
      subscription_plan_id: number | null;
      plan_type: string;
    }>;
    pagination: { next_cursor: number | null; has_more: boolean; limit: number };
  };
}

/** The states an agent can put a job in. `fulfilled` = the driver requirement
 *  was met; it also closes the job, but is its own green bucket on the board. */
export type JobStatus = 'open' | 'hold' | 'closed' | 'fulfilled';

export const JOB_STATUS_LABEL: Record<JobStatus, string> = {
  open: 'Open',
  hold: 'Hold',
  closed: 'Closed',
  fulfilled: 'Fulfilled',
};

/** One entry in a job's Open/Hold/Closed trail (`job_status_changes`). */
export interface JobStatusChange {
  id: number;
  status: JobStatus;
  previous_status: JobStatus | null;
  remarks: string | null;
  changed_by_name: string | null;
  changed_by_role: string | null;
  changed_at: string;
  changed_at_display: string | null;
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
    /** RAW `jobs.closed_job` — a STRING ('yes' / 'no' / '1' / NULL), so never
     *  test it for truthiness: 'no' is truthy. Use `is_closed`/`job_status`. */
    closed_job: number;
    status: string | null;
    created_at: string | null;
    is_greenline?: boolean;
    /** Where the job stands, set by the agent. Legacy jobs with no explicit
     *  status read as 'closed' or 'open' off the closed_job flag. */
    job_status?: JobStatus;
    is_closed?: boolean;
    is_on_hold?: boolean;
    is_fulfilled?: boolean;
    /** jobs.status: 'pending' = waiting for approval (not live in the app yet). */
    approval_status?: 'approved' | 'pending';
    /** Seats the job needs, and — on a fulfilled job — the placed drivers' TMIDs. */
    drivers_needed?: number;
    driver_placed?: string[] | null;
    /** The placed drivers with their names, for the fulfilled state. */
    placed_drivers?: Array<{ tmid: string; name: string | null }>;
    /** Why it was put there — up to 500 characters, the agent's words. */
    job_status_remarks?: string | null;
    job_status_by_name?: string | null;
    /** Already formatted for display (d M Y, g:i A). */
    job_status_at?: string | null;
    /** Ownership — false `is_mine` puts the detail screen in read-only mode. */
    assigned_to_id?: number | null;
    assigned_to_name?: string | null;
    is_mine?: boolean;
    subscription_plan_id?: number | null;
    plan_type?: string;
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
      assigned_to: number | null;
      assigned_admin_name: string | null;
      can_edit_remarks: boolean;
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
  match_making_status: { status: string; feedback: string; called_at: string; joining_date?: string | null } | null;
  /**
   * One driver, one matchmaking agent. Present whenever ANY agent holds this
   * driver — including the signed-in one, so their own screen can say "yours"
   * instead of going quiet. Null when the driver is free.
   */
  call_lock?: MmDriverLock | null;
  /**
   * The only thing a Call button should read: it already accounts for
   * ownership, the agent's desk and the roles that may override a lock.
   */
  can_call?: boolean;
  call_timeline?: Array<MmApplicantTimelineEntry>;
  /** Family / friends saved on Interview / Placement Done. */
  extra_contacts?: MmDriverExtraContact[];
}

/** A driver held by the agent who took them to interview / placement. */
export interface MmDriverLock {
  owner_id: number;
  owner_name: string;
  job_id: string | null;
  outcome: string;
  locked_at: string;
  /** The signed-in agent is the one holding this driver. */
  is_mine: boolean;
  /**
   * The signed-in agent didn't take the lock but now owns the job it belongs to
   * (the job was reassigned to them) — so they may work this driver on that job.
   */
  is_job_owner?: boolean;
  /** Ready to show — same wording the blocked dial returns. */
  message: string;
}

/**
 * One call on an APPLICANT CARD's timeline, from the CRM or the mobile app.
 *
 * Not to be confused with `MmCallTimelineEntry` below, which is the driver /
 * transporter detail modals' richer row (recording, direction, duration). This
 * one is what MmCallerController::applicantCallTimelines returns.
 */
export interface MmApplicantTimelineEntry {
  /** call_history_ivr.id — null for app-side rows, which cannot be edited. */
  call_id: number | null;
  source: 'crm' | 'app';
  called_by_id: number | null;
  call_status: string | null;
  match_status: string | null;
  process: string | null;
  feedback: string | null;
  /** Canonical disposition code (interested_job, placement_done…). */
  disposition_sub?: string | null;
  remarks: string | null;
  called_by: string | null;
  called_at: string;
  job_id?: string | null;
  transporter_name?: string | null;
  /** The signed-in agent logged this call, so they may correct its remark. */
  can_edit_remarks?: boolean;
  /** Set when this call went to the driver's relative, not the driver. */
  relative?: MmRelativeOnCall | null;
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
      recording_source?: string | null;
      /** Set on a call placed to one of the driver's relatives. */
      relative?: MmRelativeOnCall | null;
    }>;
    /** Family / friends who can reach the driver (MM Interview / Placement Done). */
    extra_contacts?: MmDriverExtraContact[];
  } | null;
}

/** A driver's additional contact. `number` is for the dialler only. */
export interface MmDriverExtraContact {
  relation: string;
  name: string;
  number: string;
  number_masked: string;
  added_by: string | null;
  added_at: string;
}

/** Who was called on a call to a driver's relative. */
export interface MmRelativeOnCall {
  relation: string;
  name: string;
  number_masked: string | null;
}

/** One entry in a lead's call history — shared by the driver and transporter modals. */
export interface MmCallTimelineEntry {
  id: number; job_id: string | null; job_title: string | null; transporter_name: string | null;
  call_status: string | null; feedback: string | null; remarks: string | null;
  match_status: string | null; disposition_sub: string | null; process: string | null;
  call_type: string | null; direction: string | null; duration_seconds: number;
  callback_at: string | null; called_by: string | null; called_at: string;
  recording_url: string | null; recording_source: string | null;
  bill_duration: string | number | null;
  relative?: MmRelativeOnCall | null;
}

export interface MmTransporterProfileResponse {
  status: boolean;
  message?: string;
  data: {
    profile: Record<string, string | number | null>;
    address: Record<string, string | number | null>;
    business: Record<string, string | number | null>;
    documents: {
      profile_image: string | null; pan_image: string | null;
      gst_certificate: string | null; voter_id: string | null;
    };
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
    jobs: {
      total: number; open: number; applicants: number;
      list: Array<{
        id: number; job_id: string; job_title: string | null; job_location: string | null;
        route: string | null; salary: string | null; vehicle_type: string | null;
        license_type: string | null; deadline: string | null; created_at: string;
        is_closed: boolean; applicants_count: number;
      }>;
    };
    call_summary: { total: number; connected: number; last_call: string | null };
    call_timeline: MmCallTimelineEntry[];
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
  /** Held by the agent who took this driver to interview / placement. */
  call_lock?: MmDriverLock | null;
  can_call?: boolean;
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

/** Job-wide call-outcome counts for the applicant-board filter bar. All scoped
 *  to THIS job. */
export type MmApplicantBucket =
  | 'all' | 'pending' | 'called' | 'connected' | 'not_connected'
  | 'no_response' | 'interview_done' | 'matchmaking_done' | 'driverbase';

export type MmApplicantCounts = Partial<Record<MmApplicantBucket, number>>;

export interface MmApplicantsFullResponse {
  status: boolean;
  job_info: { job_id: string; job_title: string };
  data: MmApplicant[];
  total_applicants: number;
  match_making: any[];
  /** Job-wide count per pipeline bucket for the header filter bar. */
  counts?: MmApplicantCounts;
  pagination: { next_cursor: number | null; has_more: boolean; per_page: number };
}

// ── "Send Connection Request" (WhatsApp + push + in-app) ──────────────────────
export interface MmConnectionRequestPartyStat {
  total_sent: number;
  last_sent_at: string | null;
}
export interface MmConnectionRequestHistory {
  driver: MmConnectionRequestPartyStat;
  transporter: MmConnectionRequestPartyStat;
  total_sent: number;
  last_sent_at: string | null;
  entries?: Array<{
    id: number;
    recipient: 'driver' | 'transporter';
    recipient_tm_id: string | null;
    recipient_mobile: string | null;
    agent_name: string | null;
    whatsapp_status: string;
    push_status: string;
    in_app_status: string;
    read_status: string | null;
    sent_at: string;
  }>;
}
export interface MmConnectionRequestResult {
  recipient: 'driver' | 'transporter';
  skipped: boolean;
  reason?: string;
  message?: string;
  last_sent_at?: string | null;
  next_allowed_at?: string | null;
  log_id?: number;
  recipient_name?: string;
  recipient_tm_id?: string;
  /** Language the recipient was messaged in, from their `users.user_lang`. */
  language?: MmLang;
  /** Which of the three messages went out. */
  template?: 'driver' | 'transporter' | 'transporter_interested';
  /** The live AiSensy campaign the language resolved to. */
  campaign?: string | null;
  channels?: { whatsapp: string; push: string; in_app: string };
  /** Why a channel didn't send (null when it sent). */
  channel_notes?: { whatsapp: string | null; push: string | null };
  sent_at?: string;
}
/** Languages the connection request has approved templates for. */
export type MmLang = 'en' | 'hi' | 'hn';
export interface MmInterestedDriver {
  id: number;
  name: string;
  tm_id: string;
  mobile: string | null;
  /** Raw `users.user_lang` — may be a value with no template, e.g. `pa`. */
  lang?: string | null;
  /** Language actually sent, after aliasing/fallback. */
  lang_sent?: MmLang;
  marked_at: string | null;
}
export interface MmConnectionRequestResponse {
  success: boolean;
  message: string;
  job_id: string;
  results: MmConnectionRequestResult[];
  interested_drivers: MmInterestedDriver[];
  interested_drivers_count: number;
  history: MmConnectionRequestHistory;
}
export interface MmBulkConnectionResponse {
  success: boolean;
  message: string;
  job_id: string;
  /** 'selected' = agent picked the recipients; 'interested' = server-derived. */
  source?: 'selected' | 'interested';
  /** Drivers that actually resolved to driver accounts. */
  recipients_count?: number;
  /** Legacy alias of recipients_count. */
  interested_drivers_count: number;
  /** False when the agent chose to notify only the transporter. */
  notified_drivers?: boolean;
  sent: number;
  skipped: number;
  results: MmConnectionRequestResult[];
  transporter: MmConnectionRequestResult | null;
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

/**
 * Which process's copy of the Open Jobs Board endpoint to hit. The board is
 * not caller-scoped — both routes land on the same controller — but each
 * process keeps its own URL so per-role middleware stays meaningful.
 */
export type JobBoardScope = 'dw' | 'mm';

const jobBoardPrefix = (scope: JobBoardScope = 'dw') =>
  scope === 'mm' ? 'match-making' : 'dw';

export interface DwJobSearchParams {
  scope?: JobBoardScope;
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

/** Everything behind the Open Jobs Board eye icon. */
export interface JobSearchDetailResponse {
  status: boolean;
  data: {
    job: {
      id: number;
      job_id: string | null;
      job_title: string | null;
      job_location: string | null;
      route: string | null;
      route_scope: string | null;
      area: string | null;
      pincode: string | null;
      salary_range: string | null;
      experience: string | null;
      license_type: string | null;
      preferred_skills: string | null;
      job_description: string | null;
      job_management: string | null;
      vehicle_type: string | null;
      vehicle_type_label: string;
      drivers_required: number | string | null;
      status: string | null;
      is_open: boolean;
      active_inactive: string | number | null;
      closed_job: string | number | null;
      application_deadline: string | null;
      remarks: string | null;
      created_at: string | null;
      updated_at: string | null;
    };
    benefits: Record<string, string | number | null>;
    transporter: {
      id: number | null;
      name: string | null;
      tmid: string | null;
      mobile: string | null;
      email: string | null;
      city: string | null;
      state: string | null;
    };
    assigned_to: {
      id: number;
      name: string | null;
      mobile: string | null;
      email: string | null;
      role: string | null;
      process: string | null;
    } | null;
    /** Every agent who has actually called on this job, busiest first. */
    agents_worked: Array<{
      agent_id: number | null;
      agent_name: string | null;
      calls: number;
      unique_leads: number;
      last_call_at: string | null;
    }>;
    applicants: Array<{
      id: number;
      driver_id: number | null;
      accept_reject_status: string | number | null;
      rejected_status: string | number | null;
      rejection_remark: string | null;
      applied_at: string | null;
      driver_name: string | null;
      driver_tmid: string | null;
      driver_mobile: string | null;
      driver_city: string | null;
      driver_experience: string | null;
      driver_state: string | null;
      applicant_assigned_to: string | null;
    }>;
    applicants_count: number;
    call_logs: Array<{
      id: number;
      agent_id: number | null;
      agent_name: string | null;
      call_status: string | null;
      call_feedback: string | null;
      call_remarks: string | null;
      match_status: string | null;
      duration: number | null;
      process: string | null;
      created_at: string | null;
      party_name: string | null;
      party_tmid: string | null;
      party_mobile: string | null;
      party_role: string | null;
    }>;
    placements: Array<{
      driver_id: number | null;
      match_status: string | null;
      placed_at: string | null;
      placed_by: string | null;
      driver_name: string | null;
      driver_tmid: string | null;
      driver_mobile: string | null;
    }>;
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

// ── Web CRM role management ──
export interface WebRoleTelecaller {
  id: number;
  name: string;
  email: string;
  mobile: string | null;
  role: string;
  sub_role: string | null;
  is_active: boolean;
}
export interface WebRolesResponse {
  status: boolean;
  data: {
    telecallers: WebRoleTelecaller[];
    roles: string[];
  };
}
export interface WebRoleUpdateResponse {
  status: boolean;
  message: string;
  data: { id: number; name: string; email: string; role: string; previous_role: string };
}

/**
 * One entry in a driver's call timeline.
 *
 * `id` is a STRING for calls merged in from the other log tables ("mm-12",
 * "jd-88") — only `call_history_ivr` rows have a numeric id, so nothing may
 * assume a number here.
 *
 * `called_at` and `updated_at` are different moments: when the call was
 * dialled, and when its disposition was last written.
 */
export interface DriverCallTimelineEntry {
  source: 'call_history_ivr' | 'match_making' | 'job_details' | string;
  id: number | string;
  job_id: string | null;
  job_title: string | null;
  transporter_name?: string | null;
  call_status: string | null;
  feedback: string | null;
  remarks: string | null;
  match_status: string | null;
  disposition_sub: string | null;
  process: string | null;
  call_type: string | null;
  direction: 'incoming' | 'outgoing';
  /** Talk time. 0 on a call that never connected. */
  duration_seconds: number;
  /** Dial through to disposition — the agent's handling time. */
  handling_seconds: number | null;
  callback_at: string | null;
  called_by: string | null;
  mobile: string | null;
  called_at: string | null;
  updated_at: string | null;
  recording_url: string | null;
  recording_source: string | null;
}

export interface DriverBankDetailResponse {
  success: boolean;
  data: {
    driver: Record<string, any>;
    applications: Record<string, any>[];
    subscription: Record<string, any> | null;
    call_timeline: DriverCallTimelineEntry[];
    call_summary: {
      total: number;
      connected: number;
      last_call_at: string | null;
      /** Which identity keys the bank entry actually had to match on. */
      matched_by: ('user_id' | 'tmid' | 'mobile')[];
      sources: Record<string, number>;
    };
  };
}

/** One "driver joins in <24h" reminder for the MM desk (mm/joining-reminders). */
export interface JoiningReminder {
  call_id: number;
  driver_id: number | null;
  driver_tmid: string | null;
  driver_name: string;
  driver_mobile: string | null;
  job_id: string | null;
  job_title: string;
  transporter_name: string;
  joining_date: string;   // ISO
  joining_label: string;  // pre-formatted for display
  hours_left: number;
  outcome: 'Matchmaking Done' | 'Interview Done';
}

/** A notepad row for the left sidebar list. */
export interface NoteRow {
  id: number;
  title: string | null;
  preview: string;
  updated_at: string | null;
  updated_label: string | null;
}

/** A single note opened in the editor. */
export interface NoteFull {
  id: number;
  title: string | null;
  content: string | null;
  updated_at: string | null;
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
    getDwQueueCounts: builder.query<any, { lead_role?: string; reg_from?: string; reg_to?: string } | void>({
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
    // Agreed-to-subscribe follow-up list — every lead this caller dispositioned
    // as agreeing to subscribe, all time (not just today).
    getDwQueueAgreeSubscription: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/dw/queue/agree-subscription',
        params: params || undefined,
      }),
    }),

    /*
     * Hot Leads — the agent's own shortlist, flagged from any queue tab.
     * `call_history_ivr.hot_lead` is written on the MARKING agent's rows, so
     * one desk's shortlist never reorders another's. The Matchmaking desk uses
     * these same endpoints: its My Queue is DwCallQueue with a lead_role.
     */
    getDwQueueHot: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/dw/queue/hot',
        params: params || undefined,
      }),
      providesTags: ['HotLeads'],
    }),
    /** Which leads are flagged, so the button knows its state on every tab. */
    getDwHotLeadKeys: builder.query<HotLeadKeysResponse, void>({
      query: () => ({ url: '/web-crm/dw/queue/hot-keys' }),
      providesTags: ['HotLeads'],
    }),
    toggleDwHotLead: builder.mutation<HotLeadToggleResponse, HotLeadToggleArgs>({
      query: (body) => ({ url: '/web-crm/dw/queue/hot', method: 'POST', body }),
      invalidatesTags: ['HotLeads'],
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
    getDwCallbacks: builder.query<DwCallbacksResponse, CallbacksParams | void>({
      query: (params) => ({ url: '/web-crm/dw/callbacks', params: params || undefined }),
    }),
    scheduleDwCallback: builder.mutation<any, { user_id: number; reason: string; scheduled_for?: string }>({
      query: (body) => ({
        url: '/web-crm/dw/callbacks/schedule',
        method: 'POST',
        body,
      }),
    }),
    // Edit an existing callback (reschedule and/or update remarks).
    updateDwCallback: builder.mutation<any, { id: number; reason?: string; scheduled_for?: string }>({
      query: ({ id, ...body }) => ({
        url: `/web-crm/dw/callbacks/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
    // Remove a callback from the calendar (soft resolve — cancelled or done).
    deleteDwCallback: builder.mutation<any, { id: number; outcome?: 'done' | 'cancelled' }>({
      query: ({ id, outcome = 'cancelled' }) => ({
        url: `/web-crm/dw/callbacks/${id}`,
        method: 'DELETE',
        params: { outcome },
      }),
    }),
    getDwCallHistory: builder.query<DwCallHistoryResponse, { per_page?: number | 'all'; page?: number; search?: string; feedback?: string; date_from?: string; date_to?: string } | void>({
      query: (params) => ({
        url: '/web-crm/dw/call-history',
        params: params || undefined,
      }),
    }),
    getDwBreakStatus: builder.query<DwBreakStatusResponse, void>({
      query: () => '/web-crm/dw/break-status',
    }),

    // Incoming Call History — one endpoint per process, one response shape.
    // The three differ only in which role wins when a mobile belongs to both a
    // driver and a transporter account, which the backend decides.
    getDwIncomingCalls: builder.query<IncomingCallsResponse, IncomingCallsParams | void>({
      query: (params) => ({ url: '/web-crm/dw/incoming-calls', params: params || undefined }),
    }),
    getWctIncomingCalls: builder.query<IncomingCallsResponse, IncomingCallsParams | void>({
      query: (params) => ({ url: '/web-crm/wct/incoming-calls', params: params || undefined }),
    }),
    getMmIncomingCalls: builder.query<IncomingCallsResponse, IncomingCallsParams | void>({
      query: (params) => ({ url: '/web-crm/match-making/incoming-calls', params: params || undefined }),
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
    getWctQueueCounts: builder.query<any, { reg_from?: string; reg_to?: string } | void>({
      query: (params) => ({
        url: '/web-crm/wct/queue/counts',
        params: params || undefined,
      }),
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
    getWctQueueAgreeSubscription: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/wct/queue/agree-subscription',
        params: params || undefined,
      }),
    }),

    // Hot Leads, transporter side — same contract as the DW endpoints above.
    getWctQueueHot: builder.query<any, DwQueueParams | void>({
      query: (params) => ({
        url: '/web-crm/wct/queue/hot',
        params: params || undefined,
      }),
      providesTags: ['HotLeads'],
    }),
    getWctHotLeadKeys: builder.query<HotLeadKeysResponse, void>({
      query: () => ({ url: '/web-crm/wct/queue/hot-keys' }),
      providesTags: ['HotLeads'],
    }),
    toggleWctHotLead: builder.mutation<HotLeadToggleResponse, HotLeadToggleArgs>({
      query: (body) => ({ url: '/web-crm/wct/queue/hot', method: 'POST', body }),
      invalidatesTags: ['HotLeads'],
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
    getWctCallbacks: builder.query<DwCallbacksResponse, CallbacksParams | void>({
      query: (params) => ({ url: '/web-crm/wct/callbacks', params: params || undefined }),
    }),
    scheduleWctCallback: builder.mutation<any, { user_id: number; reason: string; scheduled_for?: string }>({
      query: (body) => ({
        url: '/web-crm/wct/callbacks/schedule',
        method: 'POST',
        body,
      }),
    }),
    updateWctCallback: builder.mutation<any, { id: number; reason?: string; scheduled_for?: string }>({
      query: ({ id, ...body }) => ({
        url: `/web-crm/wct/callbacks/${id}`,
        method: 'PATCH',
        body,
      }),
    }),
    deleteWctCallback: builder.mutation<any, { id: number; outcome?: 'done' | 'cancelled' }>({
      query: ({ id, outcome = 'cancelled' }) => ({
        url: `/web-crm/wct/callbacks/${id}`,
        method: 'DELETE',
        params: { outcome },
      }),
    }),
    getWctCallHistory: builder.query<DwCallHistoryResponse, { per_page?: number | 'all'; page?: number; search?: string; feedback?: string; date_from?: string; date_to?: string; direction?: string; call_status?: string } | void>({
      query: (params) => ({
        url: '/web-crm/wct/call-history',
        params: params || undefined,
      }),
    }),
    getWctBreakStatus: builder.query<DwBreakStatusResponse, void>({
      query: () => '/web-crm/wct/break-status',
    }),
    // ── Interview Done / Placed Drivers report ───────────────────────────
    // Reads PlacementReportController: driver_job_status maps job × driver
    // (one row per DISTINCT driver on a job), call_history_ivr carries the
    // outcome text an agent dispositioned, driver_bank the placements only it
    // recorded. All three are folded on job × driver by the backend.
    getPlacementReport: builder.query<PlacementReportResponse, {
      tab?: PlacementReportTab;
      job_manager?: number | string;
      date_from?: string; date_to?: string;
      search?: string; page?: number; per_page?: number;
    } | void>({
      query: (params) => ({
        url: '/web-crm/placements',
        params: params || undefined,
      }),
    }),
    getPlacementJobManagers: builder.query<{ status: boolean; job_managers: PlacementJobManager[] }, void>({
      query: () => ({ url: '/web-crm/placements/job-managers' }),
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
    // Accepts `{ q, roles: 'all' }` as well as a bare string, matching
    // getDwGlobalSearch — the Transporter Welcome queue searches the whole user
    // base, not just transporters, so a caller can reach a driver too. The
    // string form is kept for existing callers. Also URL-encodes the term,
    // which the old template literal did not: a '+' or '&' in a name broke the
    // query string.
    getWctGlobalSearch: builder.query<any, string | { q: string; roles?: string }>({
      query: (arg) => {
        const q = (typeof arg === 'string' ? arg : arg?.q ?? '').trim();
        const roles = typeof arg === 'object' && arg !== null ? arg.roles : undefined;

        const params = new URLSearchParams();
        if (q) params.set('q', q);
        if (roles) params.set('roles', roles);
        return `/web-crm/wct/global-search?${params.toString()}`;
      },
    }),
    getWctJobSearch: builder.query<DwJobSearchResponse, DwJobSearchParams | void>({
      query: (params) => {
        const p = new URLSearchParams();
        if (params) {
          if (params.page) p.set('page', String(params.page));
          if (params.per_page) p.set('per_page', String(params.per_page));
          if (params.status) p.set('status', params.status);
          if (params.search) p.set('search', params.search);
          if (params.state_id) p.set('state_id', String(params.state_id));
          if (params.salary) p.set('salary', params.salary);
          if (params.experience) p.set('experience', params.experience);
        }
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

    getWctExpiringSubscriptions: builder.query<WctExpiringResponse, { window?: WctExpiringWindow; tab?: WctExpiringTab; scope?: WctExpiringScope; month?: string; per_page?: number; page?: number; search?: string }>({
      query: (params) => ({
        url: '/web-crm/wct/expiring-subscriptions',
        params,
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
      type?: string; section?: string; status?: '' | 'open' | 'hold' | 'closed' | 'expired' | 'expiring_soon' | string; search?: string;
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
      jobId: string; per_page?: number; cursor?: number | null; search?: string; status?: string; today?: boolean;
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
      call_id: number; job_id: string; match_status?: string; process?: string;
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
      page?: number; per_page?: number | 'all'; period?: string;
      call_status?: string; job_id?: string; search?: string;
      feedback?: string;
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

    // Open / Hold / Closed / Fulfilled + the reason. Closing OR fulfilling here
    // really closes the job: the backend writes jobs.closed_job='yes' alongside
    // jobs.job_status, so the boards and exports that read the flag agree with
    // this screen. A fulfil additionally sends the placed drivers' TMIDs, which
    // land in jobs.driver_placed.
    updateMmJobStatus: builder.mutation<
      {
        success: boolean;
        message: string;
        data: {
          job_id: string;
          job_status: JobStatus;
          previous_status: JobStatus | null;
          closed_job: string;
          driver_placed?: string[];
          job_status_remarks: string | null;
          job_status_by_name: string | null;
          job_status_at: string;
        };
      },
      { job_id: string; status: JobStatus; remarks?: string; placed_drivers?: string[] }
    >({
      query: (body) => ({ url: '/web-crm/match-making/job-status', method: 'POST', body }),
      invalidatesTags: ['MmJobs'],
    }),

    // The applicants an agent picks from when marking a job Fulfilled, with the
    // seats it needs and who is already placed on it.
    getMmJobPlacementCandidates: builder.query<
      {
        success: boolean;
        data: {
          job_id: string;
          drivers_needed: number;
          placed: string[];
          applicants: Array<{
            driver_id: number;
            name: string;
            tmid: string | null;
            mobile: string | null;
            applied_at: string | null;
          }>;
        };
      },
      string
    >({
      query: (jobId) => `/web-crm/match-making/job/${jobId}/placement-candidates`,
      providesTags: ['MmApplicants'],
    }),

    // Correct the remark on a call already logged. Own calls only — the
    // backend refuses another agent's row (leads/heads excepted).
    updateMmCallRemarks: builder.mutation<
      { success: boolean; message: string; data: { call_id: number; remarks: string | null } },
      { call_id: number; remarks: string }
    >({
      query: (body) => ({ url: '/web-crm/match-making/call-remarks', method: 'POST', body }),
      invalidatesTags: ['MmApplicants'],
    }),

    getMmDriverLock: builder.query<
      { success: boolean; data: { driver_id: number; can_call: boolean; lock: MmDriverLock | null } },
      number
    >({
      query: (driverId) => `/web-crm/match-making/driver/${driverId}/lock`,
      providesTags: ['MmApplicants'],
    }),

    getMmJobStatusHistory: builder.query<{ success: boolean; data: JobStatusChange[] }, string>({
      query: (jobId) => `/web-crm/match-making/job/${jobId}/status-history`,
      providesTags: ['MmJobs'],
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

    // "Send Connection Request" — when a con-call can't be bridged, notify the
    // driver and/or transporter for a job over WhatsApp (AiSensy) + push + in-app
    // in one click. The backend resolves the transporter from the job.
    sendMmConnectionRequest: builder.mutation<MmConnectionRequestResponse, {
      driver_id: number; job_id: string; recipient: 'driver' | 'transporter' | 'both'; force?: boolean;
    }>({
      query: (body) => ({ url: '/web-crm/match-making/connection-request', method: 'POST', body }),
      invalidatesTags: ['MmConnectionRequest'],
    }),
    // Bulk — notify every driver marked "Interested in the Job" for this job.
    bulkSendMmConnectionRequest: builder.mutation<MmBulkConnectionResponse, {
      job_id: string;
      force?: boolean;
      notify_transporter?: boolean;
      /** Omit to fall back to the server's interested-drivers shortlist. */
      driver_ids?: number[];
      /** False sends the transporter the shortlist without messaging drivers. */
      notify_drivers?: boolean;
    }>({
      query: (body) => ({ url: '/web-crm/match-making/connection-request/bulk', method: 'POST', body }),
      invalidatesTags: ['MmConnectionRequest'],
    }),
    getMmConnectionRequestHistory: builder.query<
      { success: boolean; data: MmConnectionRequestHistory },
      { driver_id: number; job_id: string }
    >({
      query: (params) => ({ url: '/web-crm/match-making/connection-request/history', params }),
      providesTags: ['MmConnectionRequest'],
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
        joining_date?: string | null;
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
    // Applicant Matchmaking — applications dealt to this MM agent.
    getMmApplicants: builder.query<MmApplicantsResponse, MmApplicantsParams>({
      query: (params) => ({ url: '/web-crm/match-making/applicants', params }),
      providesTags: ['MmApplicants'],
    }),
    // Complete driver profile (all users fields + DL/PAN/Aadhaar verification).
    getMmDriverProfile: builder.query<MmDriverProfileResponse, number | string>({
      query: (driverId) => `/web-crm/match-making/driver/${driverId}/profile`,
    }),
    // "A new driver was banked" alerts — matchmaking callers only. The endpoint
    // returns an empty list for other desks, so the shell can poll it without
    // knowing the role rules.
    getDriverBankNotifications: builder.query<{
      success: boolean;
      count: number;
      is_matchmaking: boolean;
      data: Array<{
        id: number; driver_bank_id: number | null;
        driver_name: string; driver_tmid: string | null;
        title: string; body: string;
        added_by_name: string | null; added_by_panel: string | null;
        created_at: string;
      }>;
    }, void>({
      query: () => '/web-crm/match-making/driver-bank/notifications',
    }),
    readDriverBankNotifications: builder.mutation<{ success: boolean; dismissed: number }, { ids?: number[] }>({
      query: (body) => ({
        url: '/web-crm/match-making/driver-bank/notifications/read',
        method: 'POST',
        body,
      }),
    }),

    // Drivers this MM agent placed/interviewed who are due to JOIN within the
    // next 24 hours — backs the joining-date reminder popup. Empty for non-MM.
    getMmJoiningReminders: builder.query<{
      status: boolean;
      data: JoiningReminder[];
    }, void>({
      query: () => '/web-crm/mm/joining-reminders',
    }),

    // Complete transporter record + full call timeline — the eye-icon modal on
    // the MM job screens.
    getMmTransporterProfile: builder.query<MmTransporterProfileResponse, number | string>({
      query: (transporterId) => `/web-crm/match-making/transporter/${transporterId}/profile`,
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

    /* ── Notify drivers about a job (Driver Search → bulk notify) ──────────
       Not under a role prefix: MM, DWC and TWC all work Driver Search, and the
       backend sends each driver the message in the language they chose in the
       app rather than the agent's. */

    /** Job picker — matches full code, last digits, numeric id, or title. */
    searchNotifiableJobs: builder.query<any, string>({
      query: (q) => ({ url: '/web-crm/job-notification/jobs', params: { q } }),
    }),

    /** Fire the notification at every selected driver. */
    sendJobNotification: builder.mutation<any, {
      job_id: string | number;
      driver_ids: number[];
      message_type?: 'perfect_fit' | 'new_job';
    }>({
      query: (body) => ({ url: '/web-crm/job-notification/send', method: 'POST', body }),
    }),

    /** Who has already been told about this job. */
    getJobNotificationHistory: builder.query<any, string>({
      query: (job_id) => ({ url: '/web-crm/job-notification/history', params: { job_id } }),
    }),

    // Driver Bank endpoints
    //
    // The list is EXPANDED server-side: one row per (driver × linked job), so a
    // driver considered for three vacancies arrives as three rows carrying
    // three different owning agents. Use `row_key`, not the driver id, as the
    // React key — the driver id repeats.
    getDriverBank: builder.query<any, {
      search?: string; job_id?: string; availability?: string;
      vehicle_type?: string; location?: string; experience?: string;
      assigned_agent?: number; never_called_since_banked?: boolean;
      per_page?: number; cursor?: number | null;
    }>({
      query: (params) => ({
        url: '/web-crm/match-making/driver-bank',
        params: Object.fromEntries(Object.entries(params || {}).filter(([, v]) => v !== undefined && v !== null && v !== '' && v !== false)),
      }),
      providesTags: ['DriverBank'],
    }),

    /** Bank-wide reporting: intake, how much of it gets worked, and by whom. */
    getDriverBankReport: builder.query<any, { days?: number } | void>({
      query: (params) => ({
        url: '/web-crm/match-making/driver-bank/report',
        params: params && (params as any).days ? { days: (params as any).days } : {},
      }),
      providesTags: ['DriverBank'],
    }),

    /** Job picker for the multi-select — code, title, and who owns it. */
    searchDriverBankJobs: builder.query<any, string>({
      query: (q) => ({ url: '/web-crm/match-making/driver-bank/jobs/search', params: { q } }),
    }),

    /** Link more vacancies to an already-banked driver. */
    attachDriverBankJobs: builder.mutation<any, { id: number; job_ids: (string | number)[] }>({
      query: ({ id, ...body }) => ({ url: `/web-crm/match-making/driver-bank/${id}/jobs`, method: 'POST', body }),
      invalidatesTags: ['DriverBank'],
    }),

    /** Per-job outcome — distinct from the driver's overall availability. */
    updateDriverBankJobLink: builder.mutation<any, { linkId: number; status?: string; remarks?: string }>({
      query: ({ linkId, ...body }) => ({ url: `/web-crm/match-making/driver-bank/jobs/${linkId}`, method: 'PUT', body }),
      invalidatesTags: ['DriverBank'],
    }),

    detachDriverBankJob: builder.mutation<any, number>({
      query: (linkId) => ({ url: `/web-crm/match-making/driver-bank/jobs/${linkId}`, method: 'DELETE' }),
      invalidatesTags: ['DriverBank'],
    }),
    getDriverBankDetail: builder.query<DriverBankDetailResponse, number | string>({
      query: (id) => `/web-crm/match-making/driver-bank/${id}`,
      providesTags: ['DriverBank'],
    }),
    addDriverBank: builder.mutation<any, {
      user_id?: number; tmid?: string; name: string; mobile: string;
      // `job_ids` is the multi-job payload; `job_id` is kept for older callers
      // and folded into the same pivot server-side.
      job_id?: string; job_ids?: (string | number)[];
      location?: string; license_type?: string; vehicle_type?: string;
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
        if (params) {
          if (params.page) p.set('page', String(params.page));
          if (params.per_page) p.set('per_page', String(params.per_page));
          if (params.status) p.set('status', params.status);
          if (params.search) p.set('search', params.search);
          if (params.state_id) p.set('state_id', String(params.state_id));
          if (params.salary) p.set('salary', params.salary);
          if (params.experience) p.set('experience', params.experience);
        }
        const qs = p.toString();
        const scope = params ? params.scope : undefined;
        return `/web-crm/${jobBoardPrefix(scope)}/job-search${qs ? `?${qs}` : ''}`;
      },
    }),
    /** Full detail for one job — backs the board's eye icon. */
    getJobSearchDetail: builder.query<JobSearchDetailResponse, { scope?: JobBoardScope; id: number }>({
      query: ({ scope, id }) => `/web-crm/${jobBoardPrefix(scope)}/job-search/${id}`,
    }),

    // ── Web CRM role management (/web-roles screen) ──
    getWebRoles: builder.query<WebRolesResponse, void>({
      query: () => '/web-crm/web-roles',
      providesTags: ['WebRoles'],
    }),
    updateWebRole: builder.mutation<WebRoleUpdateResponse, { admin_id: number; role: string }>({
      query: (body) => ({
        url: '/web-crm/web-roles',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['WebRoles'],
    }),

    getIdvQueue: builder.query<IdvQueueResponse, { page?: number; per_page?: number; search?: string; plan?: string; role?: string; tab?: string; mine?: boolean; call_state?: string; date_field?: string; date_from?: string; date_to?: string }>({
      query: (params) => ({ url: '/web-crm/id-verification/queue', params }),
      providesTags: ['IdVerification'],
    }),
    // Team-Leader command wall-board (open /crm/teleui React page). Public feed;
    // baseApi prepends config.ts API_BASE_URL, so this tracks local/dev/prod.
    getTeleuiData: builder.query<any, { range?: 'all' | 'today' } | void>({
      query: (params) => ({ url: '/web-crm/teleui/data', params: params || undefined }),
    }),
    // Manual (off-system) call logging — look up the caller, then upload.
    lookupManualCall: builder.query<any, string>({
      query: (mobile) => ({ url: '/web-crm/manual-call/lookup', params: { mobile } }),
    }),
    storeManualCall: builder.mutation<any, FormData>({
      query: (body) => ({ url: '/web-crm/manual-call', method: 'POST', body }),
    }),

    // ---- Per-agent Notepad (private free-text notes, autosaved) ----
    listNotes: builder.query<{ status: boolean; notes: NoteRow[] }, void>({
      query: () => ({ url: '/web-crm/notes' }),
      providesTags: ['Notes'],
    }),
    getNote: builder.query<{ status: boolean; note: NoteFull }, number>({
      query: (id) => ({ url: `/web-crm/notes/${id}` }),
    }),
    createNote: builder.mutation<{ status: boolean; note: NoteFull }, { title?: string; content?: string }>({
      query: (body) => ({ url: '/web-crm/notes', method: 'POST', body }),
      invalidatesTags: ['Notes'],
    }),
    // The autosave target — kept out of tag invalidation so a 15s save doesn't
    // refetch the list and yank focus; the list is refreshed on switch/create.
    updateNote: builder.mutation<{ status: boolean; saved_at: string }, { id: number; title?: string; content?: string }>({
      query: ({ id, ...body }) => ({ url: `/web-crm/notes/${id}`, method: 'PUT', body }),
    }),
    deleteNote: builder.mutation<{ status: boolean }, number>({
      query: (id) => ({ url: `/web-crm/notes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Notes'],
    }),
    getIdvDossier: builder.query<IdvDossierResponse, number>({
      query: (userId) => `/web-crm/id-verification/user/${userId}`,
      providesTags: ['IdVerification'],
    }),
    getIdvDispositionOptions: builder.query<IdvDispositionOptions, void>({
      query: () => '/web-crm/id-verification/disposition-options',
    }),
    getIdvVerificationDetail: builder.query<IdvVerificationDetailResponse, { userId: number; key: string }>({
      query: ({ userId, key }) => `/web-crm/id-verification/user/${userId}/verification/${key}`,
      providesTags: ['IdVerification'],
    }),
    saveIdvVerification: builder.mutation<{ status: boolean; message?: string; data?: { id: number; check: string } }, { userId: number; key: string; body: Record<string, string> }>({
      query: ({ userId, key, body }) => ({ url: `/web-crm/id-verification/user/${userId}/verification/${key}`, method: 'POST', body }),
      invalidatesTags: ['IdVerification'],
    }),
    getIdvAgentStats: builder.query<IdvAgentStatsResponse, { search?: string; range?: string; from?: string; to?: string; process?: string } | void>({
      query: (params) => ({ url: '/web-crm/id-verification/agent-stats', params: params || {} }),
      providesTags: ['IdVerification'],
    }),
    getIdvDailyCheckStats: builder.query<IdvDailyCheckStatsResponse, { range?: string; from?: string; to?: string; scope?: string; agent_id?: number | string } | void>({
      query: (params) => ({ url: '/web-crm/id-verification/daily-check-stats', params: params || {} }),
      providesTags: ['IdVerification'],
    }),
    getIdvSelfStats: builder.query<IdvSelfStatsResponse, { range?: IdvSelfRange; from?: string; to?: string; agent_id?: number | string; process?: string } | void>({
      query: (params) => ({ url: '/web-crm/id-verification/self-stats', params: params || {} }),
      providesTags: ['IdVerification'],
    }),
    getIdvSelfSubscribers: builder.query<IdvSelfSubscribersResponse, { page?: number; per_page?: number; search?: string; role?: string; status?: string; scope?: string; plan?: string; agent_id?: number | string; process?: string } | void>({
      query: (params) => ({ url: '/web-crm/id-verification/self-subscribers', params: params || {} }),
      providesTags: ['IdVerification'],
    }),
    getIdvSelfCalls: builder.query<IdvSelfCallsResponse, { page?: number; per_page?: number; search?: string; role?: string; status?: string; outcome?: string; plan?: string; range?: IdvSelfRange; from?: string; to?: string; agent_id?: number | string; process?: string } | void>({
      query: (params) => ({ url: '/web-crm/id-verification/self-calls', params: params || {} }),
      providesTags: ['IdVerification'],
    }),
    getRevenueChallenge: builder.query<RevenueChallengeResponse, { period?: string; month?: string } | void>({
      query: (params) => ({ url: '/web-crm/revenue-challenge/overview', params: params || {} }),
    }),
    getMyRevenueChallenge: builder.query<MyRevenueChallengeResponse, { period?: string; month?: string } | void>({
      query: (params) => ({ url: '/web-crm/revenue-challenge/me', params: params || {} }),
    }),
    getConnectivitySla: builder.query<ConnectivitySlaResponse, SlaQuery | void>({
      query: (params) => ({ url: '/web-crm/connectivity-sla/overview', params: params || {} }),
    }),
    getMyConnectivitySla: builder.query<MyConnectivitySlaResponse, SlaQuery | void>({
      query: (params) => ({ url: '/web-crm/connectivity-sla/me', params: params || {} }),
    }),
    submitIdvFeedback: builder.mutation<{ status: boolean; message?: string; data?: { call_id: number } }, {
      user_id: number; call_status: string; call_feedback: string; call_remarks?: string;
      disposition_sub?: string; call_duration?: number; callback_at?: string;
      /** Stamps the row the dial already created instead of inserting a new one. */
      call_id?: number;
    }>({
      query: (body) => ({ url: '/web-crm/id-verification/feedback', method: 'POST', body }),
      invalidatesTags: ['IdVerification'],
    }),

    // Offers already issued — the My Queue "Revival" tab.
    getRevivalOffers: builder.query<RevivalOffersResponse, { mine?: boolean; status?: string; plan?: string; search?: string; page?: number; per_page?: number } | void>({
      query: (params) => ({ url: '/web-crm/revival/offers', params: params || {} }),
      providesTags: ['Revival'],
    }),

    // ── Revival-campaign coupon ──────────────────────────────────────────────
    // Flat discount off the plan price, pushed to the subscriber by FCM + email
    // by the backend. Amounts are fixed app-side: ₹50 job_ready, ₹70 verified,
    // ₹100 trusted — i.e. ₹199→₹149, ₹299→₹229, ₹499→₹399.
    generateCoupon: builder.mutation<CouponResponse, { user_id: number; unique_id: string; payment_type: string }>({
      // queryFn, not query: this endpoint is owned by the app backend and is
      // pinned to COUPON_API_BASE_URL, which may differ from the CRM's
      // API_BASE_URL (production CRM, campaign running on dev).
      //
      // It IS authenticated — calling it bare returns {"message":"Unauthenticated"}
      // — so the CRM's Sanctum token is forwarded, but ONLY when the coupon host
      // is the same host the CRM logged in against. A token minted by one host
      // is meaningless on another, and sending it there would hand the CRM
      // session to a different origin for a request that would 401 regardless.
      async queryFn(body) {
        try {
          const sameHost = (() => {
            try {
              return new URL(COUPON_API_BASE_URL).host === new URL(API_BASE_URL, window.location.origin).host;
            } catch { return false; }
          })();

          const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          };
          if (sameHost) {
            try {
              const stored = localStorage.getItem('tm_connect_user');
              const token = stored ? JSON.parse(stored)?.token : null;
              if (token) headers.authorization = `Bearer ${token}`;
            } catch { /* no token — the call will 401 and the panel says so */ }
          }

          const res = await fetch(`${COUPON_API_BASE_URL}/web-crm/coupon-code`, {
            method: 'POST',
            headers,
            body: JSON.stringify(body),
          });
          const data = await res.json().catch(() => null);
          if (!res.ok) {
            return { error: { status: res.status, data } as any };
          }
          return { data: data as CouponResponse };
        } catch (e: any) {
          return { error: { status: 'FETCH_ERROR', error: String(e?.message || e) } as any };
        }
      },
    }),

    // ── CRM themes (server-driven skinning) ──────────────────────────────────
    // Public, like web-roles: the /crm/theme switcher opens without a login.
    getCrmThemes: builder.query<CrmThemesResponse, void>({
      query: () => '/web-crm/themes',
      providesTags: ['CrmThemes'],
    }),
    activateCrmTheme: builder.mutation<CrmThemeActivateResponse, { id: number; clear_schedule?: boolean }>({
      query: ({ id, ...body }) => ({
        url: `/web-crm/themes/${id}/activate`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['CrmThemes'],
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
  useLazyGetDwQueueAgreeSubscriptionQuery,
  useLazyGetDwQueueHotQuery,
  useGetDwHotLeadKeysQuery,
  useToggleDwHotLeadMutation,
  useLazyGetDwQueueCountsQuery,
  useSkipDwLeadMutation,
  useGetDwLeadDetailQuery,
  useGetDwDispositionOptionsQuery,
  useSubmitDwFeedbackMutation,
  useGetDwPerformanceQuery,
  useGetDwCallbacksQuery,
  useScheduleDwCallbackMutation,
  useUpdateDwCallbackMutation,
  useDeleteDwCallbackMutation,
  useGetDwCallHistoryQuery,
  useLazyGetDwCallHistoryQuery,
  useGetDwBreakStatusQuery,
  useGetDwIncomingCallsQuery,
  useGetWctIncomingCallsQuery,
  useGetMmIncomingCallsQuery,
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
  useLazyGetWctQueueAgreeSubscriptionQuery,
  useLazyGetWctQueueHotQuery,
  useGetWctHotLeadKeysQuery,
  useToggleWctHotLeadMutation,
  useLazyGetWctQueueCountsQuery,
  useSkipWctLeadMutation,
  useGetWctLeadDetailQuery,
  useGetWctDispositionOptionsQuery,
  useSubmitWctFeedbackMutation,
  useGetWctPerformanceQuery,
  useGetWctCallbacksQuery,
  useScheduleWctCallbackMutation,
  useUpdateWctCallbackMutation,
  useDeleteWctCallbackMutation,
  useGetWctCallHistoryQuery,
  useLazyGetWctCallHistoryQuery,
  useGetWctBreakStatusQuery,
  useGetPlacementReportQuery,
  useGetPlacementJobManagersQuery,
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
  useGetWctExpiringSubscriptionsQuery,
  useGetMmDashboardQuery,
  useGetMmApplicantsQuery,
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
  useLazyGetMmCallHistoryQuery,
  useSubmitMmJobBriefMutation,
  useUpdateMmJobStatusMutation,
  useGetMmJobPlacementCandidatesQuery,
  useGetMmJobStatusHistoryQuery,
  useUpdateMmCallRemarksMutation,
  useGetMmDriverLockQuery,
  useLogMmConferenceCallMutation,
  useSendMmConnectionRequestMutation,
  useBulkSendMmConnectionRequestMutation,
  useGetMmConnectionRequestHistoryQuery,
  useSubmitMmConferenceDispositionMutation,
  useSubmitMmScreeningMutation,
  useUpdateMmScreeningStatusMutation,
  useGetMmDriverScreeningQuery,
  useLazyGetMmDriverScreeningQuery,
  useGetMmDriverProfileQuery,
  useGetMmTransporterProfileQuery,
  useGetDriverBankNotificationsQuery,
  useReadDriverBankNotificationsMutation,
  useGetMmJoiningRemindersQuery,
  useGetMmGreenlineApplicantsQuery,
  useGetDriverBankQuery,
  useGetDriverBankDetailQuery,
  useAddDriverBankMutation,
  useUpdateDriverBankMutation,
  useDeleteDriverBankMutation,
  useLazySearchDriverBankUserQuery,
  useLazySearchNotifiableJobsQuery,
  useSendJobNotificationMutation,
  useLazyGetJobNotificationHistoryQuery,
  useGetDriverBankReportQuery,
  useLazySearchDriverBankJobsQuery,
  useAttachDriverBankJobsMutation,
  useUpdateDriverBankJobLinkMutation,
  useDetachDriverBankJobMutation,
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
  useGetJobSearchDetailQuery,
  useLazyGetDwJobSearchQuery,
  useGetWebRolesQuery,
  useUpdateWebRoleMutation,
  useGetIdvQueueQuery,
  useGetTeleuiDataQuery,
  useLazyLookupManualCallQuery,
  useStoreManualCallMutation,
  useListNotesQuery,
  useLazyGetNoteQuery,
  useCreateNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useGetIdvDossierQuery,
  useGetIdvDispositionOptionsQuery,
  useGetIdvVerificationDetailQuery,
  useSaveIdvVerificationMutation,
  useGetIdvAgentStatsQuery,
  useGetIdvDailyCheckStatsQuery,
  useGetIdvSelfStatsQuery,
  useGetIdvSelfSubscribersQuery,
  useGetIdvSelfCallsQuery,
  useGetRevenueChallengeQuery,
  useGetMyRevenueChallengeQuery,
  useGetConnectivitySlaQuery,
  useGetMyConnectivitySlaQuery,
  useSubmitIdvFeedbackMutation,
  useGetRevivalOffersQuery,
  useGenerateCouponMutation,
  useGetCrmThemesQuery,
  useActivateCrmThemeMutation,
} = webCrmApi;

