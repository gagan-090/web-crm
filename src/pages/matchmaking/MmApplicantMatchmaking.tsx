import React, { useEffect, useState } from 'react';
import { useGetMmApplicantsQuery, useGetMmDriverProfileQuery } from '../../services/api/webCrmApi';
import type {
  MmApplicantItem, MmApplicantsParams, MmApplicantStatus, MmJobTier,
} from '../../services/api/webCrmApi';
import { useMmCallFlow } from './useMmCallFlow';
import DriverDetailsModal from './DriverDetailsModal';
import TransporterDetailsModal from './TransporterDetailsModal';
import MmJobBriefModal from './MmJobBriefModal';
import MmConferenceDispositionModal from './MmConferenceDispositionModal';
import DriverExtraContactsPanel from './DriverExtraContactsPanel';

// MM · Applicant Matchmaking
//
// Every job application is assigned to one MM agent (applyjobs.assigned_to —
// set outside the CRM, independent of who owns the job). This page is that
// agent's book: who applied, to which job, whose job it is, every other job
// they applied to and every call made to them — with the call placed in place.
//
// Status is derived from the calls made to the applicant FOR THIS JOB, so the
// agent updates it the way they do everywhere else: by dispositioning the call
// (the global disposition form collects outcome, notes and follow-up time).
//
// No mobile numbers are rendered anywhere on matchmaking screens; the numbers
// in the payload are only handed to the dialler.

const ACCENT = '#8E44AD';

const STATUS_STYLE: Record<MmApplicantStatus, string> = {
  new:            'bg-blue-50 text-blue-700 border-blue-200',
  pending:        'bg-gray-100 text-gray-700 border-gray-200',
  not_reachable:  'bg-red-50 text-red-600 border-red-200',
  connected:      'bg-emerald-50 text-emerald-700 border-emerald-200',
  interested:     'bg-teal-50 text-teal-700 border-teal-200',
  follow_up:      'bg-amber-50 text-amber-700 border-amber-200',
  not_interested: 'bg-orange-50 text-orange-700 border-orange-200',
  rejected:       'bg-rose-50 text-rose-700 border-rose-200',
  interview_done: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  matched:        'bg-green-100 text-green-800 border-green-300',
};

const TIER_LABEL: Record<MmJobTier, string> = {
  standard: 'Standard',
  premium: 'Premium',
  super_premium: 'Super Premium',
};
const TIER_STYLE: Record<MmJobTier, string> = {
  standard: 'bg-gray-100 text-gray-700',
  premium: 'bg-purple-50 text-purple-700',
  super_premium: 'bg-amber-100 text-amber-800',
};

const toDate = (d?: string | null) => (d ? new Date(d.replace(' ', 'T')) : null);
const fmtDate = (d?: string | null) =>
  toDate(d)?.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) ?? '—';
const fmtDateTime = (d?: string | null) =>
  toDate(d)?.toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' }) ?? '—';
const humanize = (s?: string | null) =>
  s ? s.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()) : '';
const fmtDuration = (sec: number) =>
  sec > 0 ? `${Math.floor(sec / 60)}m ${String(sec % 60).padStart(2, '0')}s` : '—';

const StatusBadge: React.FC<{ status: MmApplicantStatus; label: string }> = ({ status, label }) => (
  <span className={`inline-block px-2 py-0.5 rounded-full border text-[10px] font-bold whitespace-nowrap ${STATUS_STYLE[status]}`}>
    {label}
  </span>
);

const TierBadge: React.FC<{ tier: MmJobTier | null | undefined }> = ({ tier }) =>
  tier ? (
    <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold whitespace-nowrap ${TIER_STYLE[tier]}`}>
      {TIER_LABEL[tier]}
    </span>
  ) : <span className="text-gray-300">—</span>;

type Field = [string, React.ReactNode];

const Section: React.FC<{ title: string; icon: string; action?: React.ReactNode; children: React.ReactNode }> = ({
  title, icon, action, children,
}) => (
  <section className="bg-white rounded-xl border border-gray-200 p-3.5">
    <div className="flex items-center justify-between mb-2.5">
      <p className="text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5" style={{ color: ACCENT }}>
        <span className="material-symbols-outlined text-[15px]">{icon}</span>{title}
      </p>
      {action}
    </div>
    {children}
  </section>
);

const Fields: React.FC<{ fields: Field[] }> = ({ fields }) => {
  const shown = fields.filter(([, v]) => v !== null && v !== undefined && v !== '');
  if (!shown.length) return <p className="text-xs text-gray-400 italic">Nothing on record.</p>;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-2.5">
      {shown.map(([label, val]) => (
        <div key={label} className="min-w-0">
          <p className="text-[9px] text-gray-400 uppercase font-bold leading-tight">{label}</p>
          <div className="text-[12px] font-semibold text-gray-800 break-words">{val}</div>
        </div>
      ))}
    </div>
  );
};

// ── Detail drawer ────────────────────────────────────────────────────────────

const ApplicantDrawer: React.FC<{
  item: MmApplicantItem;
  onClose: () => void;
  onCall: (item: MmApplicantItem) => void;
  onOpenDriver: () => void;
  onOpenTransporter: () => void;
}> = ({ item, onClose, onCall, onOpenDriver, onOpenTransporter }) => {
  const { data, isFetching, refetch } = useGetMmDriverProfileQuery(item.driver.id);
  const profile = data?.data;

  // Pick up the call just dispositioned from this drawer.
  useEffect(() => {
    const h = () => { setTimeout(() => refetch(), 1500); };
    window.addEventListener('san-disposition-complete', h);
    return () => window.removeEventListener('san-disposition-complete', h);
  }, [refetch]);

  const job = item.job;
  const tx = item.transporter;
  const timeline = profile?.call_timeline ?? [];
  const appliedJobs = profile?.applied_jobs ?? [];

  return (
    <div className="fixed inset-0 z-[60] flex justify-end" role="dialog" aria-modal="true">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <aside className="relative w-full max-w-[620px] h-full bg-gray-50 shadow-2xl flex flex-col">
        {/* Header */}
        <header className="p-4 bg-white border-b border-gray-200 flex items-start gap-3 shrink-0">
          <div className="w-11 h-11 rounded-full flex items-center justify-center font-bold text-white shrink-0" style={{ background: ACCENT }}>
            {(item.driver.name || '?').slice(0, 2).toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-gray-900 truncate">{item.driver.name || 'Applicant'}</h2>
              <StatusBadge status={item.status} label={item.status_label} />
            </div>
            <p className="text-[11px] text-gray-500 font-mono">{item.driver.tmid} · Application #{item.application_id}</p>
            <p className="text-[11px] text-gray-500">Applied {fmtDateTime(item.applied_at)} · Assigned to {item.mm_agent.name || '—'}</p>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700" aria-label="Close">
            <span className="material-symbols-outlined">close</span>
          </button>
        </header>

        {/* Actions */}
        <div className="px-4 py-3 bg-white border-b border-gray-200 flex items-center gap-2 shrink-0">
          {item.can_call ? (
            <button
              onClick={() => onCall(item)}
              className="text-white px-4 h-9 rounded-lg font-bold text-xs flex items-center gap-1.5 shadow-sm active:scale-95 transition-transform"
              style={{ background: ACCENT }}
            >
              <span className="material-symbols-outlined text-[18px]">call</span> Call Applicant
            </button>
          ) : (
            <span className="text-[11px] text-rose-700 bg-rose-50 border border-rose-200 rounded-lg px-3 py-2 flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[16px]">lock</span>
              {item.call_lock?.message || 'Another agent is working this driver.'}
            </span>
          )}
          <button onClick={onOpenDriver} className="px-3 h-9 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50">
            Full Driver Profile
          </button>
          <p className="ml-auto text-[10px] text-gray-400 max-w-[180px] text-right leading-tight">
            Outcome, notes &amp; follow-up are recorded in the form that opens after the call.
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* 1. Applicant */}
          <Section title="Applicant" icon="person">
            <Fields fields={[
              ['TMID', item.driver.tmid],
              ['Location', item.driver.location],
              ['Registered', fmtDate(item.driver.registered_at)],
              ['Profile Completion', profile?.profile?.profile_completion != null ? `${profile.profile.profile_completion}%` : null],
              ['Experience', humanize(profile?.driving?.experience as string)],
              ['Licence', profile?.driving?.license_type as string],
              ['Vehicle Types', profile?.driving?.vehicle_type as string],
              ['Expected Income', profile?.employment?.expected_income],
              ['Preferred Location', profile?.address?.preferred_location],
              ['Subscription', profile?.subscription?.current_label],
              ['Transporter Decision', humanize(item.transporter_decision)],
            ]} />
          </Section>

          {/* Family / friends who can reach the driver */}
          {profile && (
            <DriverExtraContactsPanel
              contacts={profile.extra_contacts ?? []}
              driverId={item.driver.id}
              driverName={item.driver.name || 'Driver'}
              driverTmid={item.driver.tmid || ''}
            />
          )}

          {/* 2. Applied job */}
          <Section title="Applied Job" icon="work">
            {job ? (
              <>
                <p className="text-sm font-bold text-gray-900 mb-2">{job.title || 'Untitled job'}</p>
                <Fields fields={[
                  ['Job ID', <span className="font-mono">{job.code}</span>],
                  ['Job Type', <TierBadge tier={job.tier} />],
                  ['Category', job.is_greenline ? 'Greenline' : 'Regular'],
                  ['Location', job.location],
                  ['Route', job.route],
                  ['Vehicle', job.vehicle],
                  ['Salary', job.salary],
                  ['Experience', humanize(job.experience)],
                  ['Licence', job.licence],
                  ['Drivers Needed', job.drivers_required],
                  ['Posted On', fmtDate(job.created_at)],
                  ['Job Status', `${humanize(job.state)}${job.active ? '' : ' · Inactive'}${job.verified ? '' : ' · Unverified'}`],
                  ['Job Agent', job.agent_name],
                ]} />
              </>
            ) : <p className="text-xs text-gray-400 italic">This job no longer exists.</p>}
          </Section>

          {/* 3. Transporter */}
          <Section
            title="Transporter / Job Owner"
            icon="local_shipping"
            action={tx ? (
              <button onClick={onOpenTransporter} className="text-[10px] font-bold hover:underline" style={{ color: ACCENT }}>
                Full profile
              </button>
            ) : undefined}
          >
            {tx ? (
              <Fields fields={[
                ['Company', tx.company],
                ['Contact Person', tx.contact],
                ['Transporter ID', <span className="font-mono">{tx.tmid}</span>],
                ['Transporter Agent', tx.agent_name],
              ]} />
            ) : <p className="text-xs text-gray-400 italic">No transporter on record.</p>}
          </Section>

          {/* 4. Every job this applicant applied to */}
          <Section title={`All Applied Jobs (${appliedJobs.length})`} icon="list_alt">
            {isFetching && !profile ? (
              <p className="text-xs text-gray-400 italic">Loading…</p>
            ) : appliedJobs.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No applications found.</p>
            ) : (
              <ul className="divide-y divide-gray-100">
                {appliedJobs.map((j) => {
                  const current = j.application_id === item.application_id;
                  return (
                    <li key={j.application_id} className={`py-2 flex items-start gap-2 ${current ? 'bg-purple-50/60 -mx-2 px-2 rounded' : ''}`}>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-gray-800 truncate">
                          <span className="font-mono text-gray-500 mr-1">{j.job_ref || `#${j.job_id}`}</span>
                          {j.job_title || 'Untitled job'}
                        </p>
                        <p className="text-[10px] text-gray-500 truncate">
                          {[j.transporter_name, j.route || j.job_location, j.vehicle_type, j.salary].filter(Boolean).join(' · ')}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[10px] text-gray-500">Applied {fmtDate(j.applied_at)}</p>
                        {current ? (
                          <span className="text-[9px] font-bold" style={{ color: ACCENT }}>THIS APPLICATION</span>
                        ) : j.status && j.status !== 'pending' ? (
                          <span className="text-[9px] font-bold text-gray-500 uppercase">{j.status}</span>
                        ) : null}
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </Section>

          {/* 5. Calling timeline */}
          <Section title={`Calling Timeline (${timeline.length})`} icon="history">
            {isFetching && !profile ? (
              <p className="text-xs text-gray-400 italic">Loading…</p>
            ) : timeline.length === 0 ? (
              <p className="text-xs text-gray-400 italic">No calls made to this applicant yet.</p>
            ) : (
              <ol className="relative border-l-2 border-gray-200 ml-1.5 space-y-3">
                {timeline.map((c) => {
                  const connected = (c.call_status || '').toLowerCase() === 'connected';
                  const forThisJob = !!job?.code && c.job_id === job.code;
                  return (
                    <li key={c.id} className="ml-4">
                      <span className={`absolute -left-[7px] mt-1 w-3 h-3 rounded-full border-2 border-white ${connected ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[11px] font-bold text-gray-800">{fmtDateTime(c.called_at)}</span>
                        <span className="text-[10px] text-gray-500">{c.called_by || '—'}</span>
                        <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${connected ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-600'}`}>
                          {humanize(c.call_status) || 'Unknown'}
                        </span>
                        {c.direction === 'incoming' && <span className="text-[9px] font-bold text-blue-600">INCOMING</span>}
                        {forThisJob && <span className="text-[9px] font-bold" style={{ color: ACCENT }}>THIS JOB</span>}
                        {c.relative && (
                          <span className="text-[9px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded px-1.5 py-0.5">
                            Called {c.relative.relation}{c.relative.name ? ` · ${c.relative.name}` : ''}
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-gray-700 mt-0.5">
                        {humanize(c.disposition_sub) || c.feedback || '—'}
                        {c.duration_seconds > 0 && <span className="text-gray-400"> · {fmtDuration(c.duration_seconds)}</span>}
                        {c.callback_at && <span className="text-amber-700"> · Follow-up {fmtDateTime(c.callback_at)}</span>}
                      </p>
                      {(c.job_title || c.job_id) && !forThisJob && (
                        <p className="text-[10px] text-gray-400">Re: {c.job_id} {c.job_title ? `— ${c.job_title}` : ''}</p>
                      )}
                      {c.remarks && <p className="text-[11px] italic text-gray-600 mt-0.5 whitespace-pre-wrap">"{c.remarks}"</p>}
                      {c.recording_url && <audio controls preload="none" src={c.recording_url} className="mt-1 h-8 w-full max-w-[320px]" />}
                    </li>
                  );
                })}
              </ol>
            )}
          </Section>
        </div>
      </aside>
    </div>
  );
};

// ── Page ─────────────────────────────────────────────────────────────────────

export const MmApplicantMatchmaking: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);
  const flash = (msg: string) => { setToast(msg); setTimeout(() => setToast(null), 3500); };

  const [term, setTerm] = useState('');
  const [params, setParams] = useState<MmApplicantsParams>({ page: 1, per_page: 25, sort: 'applied_desc' });
  const set = (patch: Partial<MmApplicantsParams>) => setParams((p) => ({ ...p, page: 1, ...patch }));

  // Debounced search.
  useEffect(() => {
    const t = setTimeout(() => set({ search: term.trim() || undefined }), 350);
    return () => clearTimeout(t);
  }, [term]);

  const { data, isLoading, isFetching, isError, error, refetch } = useGetMmApplicantsQuery(params, {
    refetchOnMountOrArgChange: true,
  });
  const summary = data?.data?.summary;
  const items = data?.data?.items ?? [];
  const pagination = data?.data?.pagination;
  const statuses = data?.data?.statuses ?? [];
  const agents = data?.data?.agents;

  const [openId, setOpenId] = useState<number | null>(null);
  const openItem = items.find((i) => i.application_id === openId) ?? null;
  const [driverModal, setDriverModal] = useState<MmApplicantItem | null>(null);
  const [transporterModal, setTransporterModal] = useState<MmApplicantItem | null>(null);

  const {
    callApplicant, jobBriefTarget, closeJobBrief, openJobBrief,
    conferenceDisposition, clearConferenceDisposition,
  } = useMmCallFlow({
    onToast: flash,
    onLogSaved: (p) => flash(`Disposition saved for ${p.name} ✓`),
  });

  // The tagged call invalidates this list, but the disposition itself lands a
  // moment earlier — refetch once more so status/last-call catch up.
  useEffect(() => {
    const h = () => { setTimeout(() => refetch(), 1500); };
    window.addEventListener('san-disposition-complete', h);
    return () => window.removeEventListener('san-disposition-complete', h);
  }, [refetch]);

  const handleCall = (item: MmApplicantItem) => {
    if (!item.can_call) { flash(item.call_lock?.message || 'Another agent is working this driver.'); return; }
    if (!item.job?.code) { flash('This application has no live job to call about.'); return; }
    if (!item.driver.mobile) { flash('This applicant has no phone number on record.'); return; }
    callApplicant({
      jobId: item.job.code,
      transporterName: item.transporter?.company || '',
      transporter: item.transporter?.mobile
        ? { id: item.transporter.id, name: item.transporter.company || 'Transporter', mobile: item.transporter.mobile, unique_id: item.transporter.tmid || undefined }
        : undefined,
      driver: {
        driver_id: item.driver.id,
        name: item.driver.name || 'Applicant',
        mobile: item.driver.mobile,
        unique_id: item.driver.tmid || '',
      },
      isGreenline: item.job.is_greenline,
    });
  };

  const errMsg = (error as { data?: { message?: string } } | undefined)?.data?.message;

  const cards: { label: string; value?: number; icon: string; onClick?: () => void; active?: boolean; tone?: string }[] = [
    { label: 'Total Applicants', value: summary?.total, icon: 'groups', onClick: () => set({ status: undefined, followup: undefined, call: undefined }), active: !params.status && !params.followup && !params.call },
    { label: 'New', value: summary?.status.new, icon: 'fiber_new', onClick: () => set({ status: 'new', followup: undefined }), active: params.status === 'new' },
    { label: 'Call Pending', value: summary?.status.pending, icon: 'pending_actions', onClick: () => set({ status: 'pending', followup: undefined }), active: params.status === 'pending' },
    { label: 'Not Reachable', value: summary?.status.not_reachable, icon: 'phone_missed', onClick: () => set({ status: 'not_reachable', followup: undefined }), active: params.status === 'not_reachable', tone: 'text-red-600' },
    { label: 'Connected', value: summary?.status.connected, icon: 'call', onClick: () => set({ status: 'connected', followup: undefined }), active: params.status === 'connected', tone: 'text-emerald-700' },
    { label: 'Follow-up Required', value: summary?.status.follow_up, icon: 'event_repeat', onClick: () => set({ status: 'follow_up', followup: undefined }), active: params.status === 'follow_up', tone: 'text-amber-700' },
    { label: "Today's Follow-ups", value: summary ? summary.followups_today + summary.followups_overdue : undefined, icon: 'alarm', onClick: () => set({ status: undefined, followup: 'today' }), active: params.followup === 'today' },
    { label: 'Matched', value: summary?.status.matched, icon: 'handshake', onClick: () => set({ status: 'matched', followup: undefined }), active: params.status === 'matched', tone: 'text-green-700' },
  ];

  return (
    <main className="min-h-[calc(100vh-80px)] flex flex-col gap-3 relative">
      {toast && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-[80]">
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-lg font-bold text-gray-900">Applicant Matchmaking</h1>
          <p className="text-xs text-gray-500">
            Every driver who applied to a job and is assigned to you — call each one and log the outcome.
          </p>
        </div>
        <div className="flex items-center gap-2">
          {agents && (
            <select
              value={params.agent_id ?? ''}
              onChange={(e) => set({ agent_id: e.target.value === '' ? undefined : e.target.value === 'all' ? 'all' : Number(e.target.value) })}
              className="h-9 px-2 border border-gray-200 rounded-lg text-xs font-semibold bg-white"
              title="Whose applicants to show"
            >
              <option value="">My applicants</option>
              <option value="all">All MM agents</option>
              {agents.map((a) => (
                <option key={a.id} value={a.id}>{a.name}{a.is_active ? '' : ' (inactive)'}</option>
              ))}
            </select>
          )}
          <button onClick={() => refetch()} className="h-9 w-9 flex items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:text-gray-800" title="Refresh">
            <span className={`material-symbols-outlined text-[18px] ${isFetching ? 'animate-spin' : ''}`}>refresh</span>
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 xl:grid-cols-8 gap-2">
        {cards.map((c) => (
          <button
            key={c.label}
            onClick={c.onClick}
            className={`text-left bg-white rounded-xl border p-3 transition-colors ${c.active ? 'ring-2' : 'hover:border-gray-300'}`}
            style={c.active ? { borderColor: ACCENT, ['--tw-ring-color' as string]: `${ACCENT}33` } : { borderColor: '#E5E7EB' }}
          >
            <span className="material-symbols-outlined text-[18px] text-gray-400">{c.icon}</span>
            <p className={`text-xl font-extrabold mt-0.5 ${c.tone || 'text-gray-900'}`}>{c.value ?? '…'}</p>
            <p className="text-[10px] font-bold uppercase text-gray-500 leading-tight">{c.label}</p>
          </button>
        ))}
      </div>

      {/* Secondary metrics */}
      {summary && (
        <div className="flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-gray-600 px-1">
          <span>Applied today: <b>{summary.applied_today}</b></span>
          <span>Called today: <b>{summary.called_today}</b></span>
          <span>Never called: <b>{summary.never_called}</b></span>
          <span>Overdue follow-ups: <b className={summary.followups_overdue ? 'text-red-600' : ''}>{summary.followups_overdue}</b></span>
          <span>Interested: <b>{summary.status.interested}</b></span>
          <span>Interview done: <b>{summary.status.interview_done}</b></span>
          <span>Not interested: <b>{summary.status.not_interested}</b></span>
          <span>Rejected: <b>{summary.status.rejected}</b></span>
          <span className="ml-auto">
            By job type — Standard <b>{summary.by_tier.standard}</b> · Premium <b>{summary.by_tier.premium}</b> · Super Premium <b>{summary.by_tier.super_premium}</b>
          </span>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-3 flex flex-wrap items-center gap-2">
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2 top-1/2 -translate-y-1/2 text-gray-400 text-[16px]">search</span>
          <input
            value={term}
            onChange={(e) => setTerm(e.target.value)}
            placeholder="Search applicant, TMID, job, transporter…"
            className="pl-8 pr-3 h-9 w-72 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-purple-400"
          />
        </div>
        <select value={params.status ?? ''} onChange={(e) => set({ status: (e.target.value || undefined) as MmApplicantStatus | undefined })} className="h-9 px-2 border border-gray-200 rounded-lg text-xs bg-white">
          <option value="">All statuses</option>
          {statuses.map((s) => (
            <option key={s.key} value={s.key}>{s.label}{summary ? ` (${summary.status[s.key]})` : ''}</option>
          ))}
        </select>
        <select value={params.tier ?? ''} onChange={(e) => set({ tier: (e.target.value || undefined) as MmJobTier | undefined })} className="h-9 px-2 border border-gray-200 rounded-lg text-xs bg-white">
          <option value="">All job types</option>
          <option value="standard">Standard</option>
          <option value="premium">Premium</option>
          <option value="super_premium">Super Premium</option>
        </select>
        <select value={params.call ?? ''} onChange={(e) => set({ call: (e.target.value || undefined) as MmApplicantsParams['call'] })} className="h-9 px-2 border border-gray-200 rounded-lg text-xs bg-white">
          <option value="">Any call status</option>
          <option value="never">Never called</option>
          <option value="connected">Connected</option>
          <option value="not_connected">Called, not connected</option>
        </select>
        <select value={params.followup ?? ''} onChange={(e) => set({ followup: (e.target.value || undefined) as MmApplicantsParams['followup'] })} className="h-9 px-2 border border-gray-200 rounded-lg text-xs bg-white">
          <option value="">Any follow-up</option>
          <option value="today">Follow-up today</option>
          <option value="overdue">Follow-up overdue</option>
          <option value="upcoming">Follow-up upcoming</option>
          <option value="any">Has a follow-up</option>
        </select>
        <label className="flex items-center gap-1 text-[11px] text-gray-500">
          Applied
          <input type="date" value={params.from ?? ''} onChange={(e) => set({ from: e.target.value || undefined })} className="h-9 px-2 border border-gray-200 rounded-lg text-xs" />
          to
          <input type="date" value={params.to ?? ''} onChange={(e) => set({ to: e.target.value || undefined })} className="h-9 px-2 border border-gray-200 rounded-lg text-xs" />
        </label>
        <select value={params.sort} onChange={(e) => set({ sort: e.target.value as MmApplicantsParams['sort'] })} className="h-9 px-2 border border-gray-200 rounded-lg text-xs bg-white ml-auto" title="Sort">
          <option value="applied_desc">Newest applications</option>
          <option value="applied_asc">Oldest applications</option>
          <option value="last_call">Recently called</option>
          <option value="followup">Next follow-up</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex-1 flex flex-col min-h-0">
        <div className="overflow-auto flex-1">
          <table className="w-full text-xs text-left border-collapse">
            <thead className="bg-gray-50 text-gray-500 uppercase text-[9px] sticky top-0 z-10 border-b border-gray-200">
              <tr>
                <th className="p-3">Applicant</th>
                <th className="p-3">Applied Job</th>
                <th className="p-3">Job Type</th>
                <th className="p-3">Transporter</th>
                <th className="p-3">Applied On</th>
                <th className="p-3">Assigned MM</th>
                <th className="p-3">Last Call</th>
                <th className="p-3">Next Follow-up</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700">
              {isLoading ? (
                <tr><td colSpan={10} className="p-10 text-center text-gray-400 italic">Loading applicants…</td></tr>
              ) : isError ? (
                <tr><td colSpan={10} className="p-10 text-center text-red-500">{errMsg || 'Could not load applicants.'}</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={10} className="p-10 text-center text-gray-400 italic">No applicants match these filters.</td></tr>
              ) : items.map((it) => {
                const overdue = it.calls.follow_up_overdue;
                return (
                  <tr key={it.application_id} onClick={() => setOpenId(it.application_id)} className="hover:bg-purple-50/30 cursor-pointer">
                    <td className="p-3">
                      <span className="font-bold text-gray-900 block">{it.driver.name || '—'}</span>
                      <span className="text-[10px] text-gray-400 font-mono">{it.driver.tmid}</span>
                      {it.driver.location && <span className="text-[10px] text-gray-400 block">{it.driver.location}</span>}
                    </td>
                    <td className="p-3 max-w-[220px]">
                      <span className="font-mono text-[10px] text-gray-500 block">{it.job?.code || '—'}</span>
                      <span className="block truncate font-semibold text-gray-800" title={it.job?.title || ''}>{it.job?.title || 'Job removed'}</span>
                      {it.job && <span className="text-[10px] text-gray-400 block truncate">{[it.job.route || it.job.location, it.job.vehicle].filter(Boolean).join(' · ')}</span>}
                    </td>
                    <td className="p-3"><TierBadge tier={it.job?.tier} /></td>
                    <td className="p-3 max-w-[160px]">
                      <span className="block truncate font-semibold">{it.transporter?.company || '—'}</span>
                      {it.job?.agent_name && <span className="text-[10px] text-gray-400 block truncate">Job agent: {it.job.agent_name}</span>}
                    </td>
                    <td className="p-3 whitespace-nowrap">{fmtDate(it.applied_at)}</td>
                    <td className="p-3 whitespace-nowrap">{it.mm_agent.name || '—'}</td>
                    <td className="p-3 max-w-[180px]">
                      {it.calls.last_at ? (
                        <>
                          <span className="block whitespace-nowrap">{fmtDateTime(it.calls.last_at)}</span>
                          <span className="text-[10px] text-gray-500 block truncate">
                            {humanize(it.calls.last_status)}{it.calls.last_outcome ? ` · ${humanize(it.calls.last_outcome)}` : ''}
                          </span>
                          <span className="text-[10px] text-gray-400">{it.calls.count} call{it.calls.count === 1 ? '' : 's'}</span>
                        </>
                      ) : <span className="text-gray-300">Never called</span>}
                    </td>
                    <td className={`p-3 whitespace-nowrap ${overdue ? 'text-red-600 font-bold' : ''}`}>
                      {it.calls.follow_up_at ? fmtDateTime(it.calls.follow_up_at) : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="p-3"><StatusBadge status={it.status} label={it.status_label} /></td>
                    <td className="p-3 text-right whitespace-nowrap" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setOpenId(it.application_id)}
                        className="border border-gray-200 hover:border-purple-400 text-gray-600 px-2.5 py-1.5 rounded font-bold text-[10px] mr-1.5"
                      >
                        View
                      </button>
                      <button
                        onClick={() => handleCall(it)}
                        disabled={!it.can_call}
                        title={it.can_call ? 'Call applicant' : it.call_lock?.message}
                        className="text-white px-2.5 py-1.5 rounded font-bold text-[10px] inline-flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed"
                        style={{ background: ACCENT }}
                      >
                        <span className="material-symbols-outlined text-[14px]">{it.can_call ? 'call' : 'lock'}</span> Call
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {pagination && pagination.total > 0 && (
          <div className="flex items-center justify-between px-4 py-2.5 border-t border-gray-100 text-xs text-gray-500">
            <span>
              {(pagination.current_page - 1) * pagination.per_page + 1}–{Math.min(pagination.current_page * pagination.per_page, pagination.total)} of {pagination.total}
            </span>
            <div className="flex items-center gap-2">
              <select
                value={params.per_page}
                onChange={(e) => set({ per_page: Number(e.target.value) })}
                className="h-7 px-1 border border-gray-200 rounded text-xs bg-white"
              >
                {[25, 50, 100].map((n) => <option key={n} value={n}>{n} / page</option>)}
              </select>
              <button
                disabled={pagination.current_page <= 1 || isFetching}
                onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) - 1 }))}
                className="px-3 py-1 border border-gray-200 rounded-lg font-semibold disabled:opacity-40 hover:bg-gray-50"
              >Prev</button>
              <span>Page {pagination.current_page} / {pagination.last_page}</span>
              <button
                disabled={pagination.current_page >= pagination.last_page || isFetching}
                onClick={() => setParams((p) => ({ ...p, page: (p.page || 1) + 1 }))}
                className="px-3 py-1 border border-gray-200 rounded-lg font-semibold disabled:opacity-40 hover:bg-gray-50"
              >Next</button>
            </div>
          </div>
        )}
      </div>

      {openItem && (
        <ApplicantDrawer
          item={openItem}
          onClose={() => setOpenId(null)}
          onCall={handleCall}
          onOpenDriver={() => setDriverModal(openItem)}
          onOpenTransporter={() => setTransporterModal(openItem)}
        />
      )}

      {driverModal && (
        <DriverDetailsModal
          open
          driverId={driverModal.driver.id}
          driverName={driverModal.driver.name || ''}
          uniqueId={driverModal.driver.tmid || ''}
          onClose={() => setDriverModal(null)}
        />
      )}
      {transporterModal?.transporter && (
        <TransporterDetailsModal
          open
          transporterId={transporterModal.transporter.id}
          transporterName={transporterModal.transporter.company || ''}
          uniqueId={transporterModal.transporter.tmid || ''}
          onClose={() => setTransporterModal(null)}
        />
      )}

      {/* The transporter can be conferenced into an applicant call — their leg
          owes its own disposition, and confirming the job leads to the brief. */}
      {conferenceDisposition && (
        <MmConferenceDispositionModal
          open
          party={conferenceDisposition.party}
          callId={conferenceDisposition.callId}
          onClose={clearConferenceDisposition}
          onSubmitted={(res) => {
            flash(`Feedback saved for ${conferenceDisposition.party.name} ✓`);
            if (res.disposition_sub === 'tr_confirmed_job') {
              openJobBrief(conferenceDisposition.jobId, conferenceDisposition.party.name);
            }
          }}
        />
      )}
      {jobBriefTarget && (
        <MmJobBriefModal
          open
          jobId={jobBriefTarget.jobId}
          prefillName={jobBriefTarget.name}
          jobData={null}
          onClose={closeJobBrief}
          onSaved={() => flash('Job brief saved ✓')}
        />
      )}
    </main>
  );
};

export default MmApplicantMatchmaking;
