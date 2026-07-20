import React, { useEffect, useMemo, useState } from 'react';
import { useGetMmGreenlineApplicantsQuery, type MmGreenlineApplicant } from '../../services/api/webCrmApi';

interface DriverRef { driver_id: number; name: string; mobile: string; unique_id: string }

interface Props {
  jobId: string;
  onCall: (d: DriverRef) => void;
  onScreen: (d: DriverRef, mode: 'conduct' | 'view') => void;
  onViewDetails: (d: DriverRef) => void;
}

const FILTERS: { value: string; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'uncalled', label: 'Uncalled' },
  { value: 'called', label: 'Called' },
  { value: 'connected', label: 'Connected' },
  { value: 'screening_pending', label: 'Screening Pending' },
  { value: 'screening_done', label: 'Screening Done' },
  { value: 'online_interview', label: 'Online Interview' },
  { value: 'physical_interview', label: 'Physical Interview' },
  { value: 'interview_done', label: 'Interview Done' },
  { value: 'selected', label: 'Selected' },
  { value: 'rejected', label: 'Rejected' },
];

const stageStyle = (stage: string): string => {
  switch (stage) {
    case 'Applied': return 'bg-gray-100 text-gray-600';
    case 'Contacted': return 'bg-blue-100 text-blue-700';
    case 'Screening Done': return 'bg-indigo-100 text-indigo-700';
    case 'Online Interview':
    case 'Physical Interview':
    case 'Interview Done': return 'bg-purple-100 text-purple-700';
    case 'Selected': return 'bg-green-100 text-green-700';
    case 'Rejected': return 'bg-red-100 text-red-600';
    default: return 'bg-gray-100 text-gray-500';
  }
};

const decisionStyle = (d?: string): string =>
  d === 'GREEN' ? 'bg-green-100 text-green-700'
  : d === 'AMBER' ? 'bg-amber-100 text-amber-700'
  : d === 'RED' ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500';

const DocChip: React.FC<{ label: string; ok: boolean }> = ({ label, ok }) => (
  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border flex items-center gap-0.5 ${ok ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
    <span className="material-symbols-outlined text-[11px]">{ok ? 'check_circle' : 'cancel'}</span>{label}
  </span>
);

const Card: React.FC<{ a: MmGreenlineApplicant } & Props> = ({ a, onCall, onScreen, onViewDetails }) => {
  const ref: DriverRef = { driver_id: a.driver_id, name: a.name, mobile: a.mobile, unique_id: a.unique_id };
  const itv = a.interview;
  return (
    <div className="bg-white border border-gray-200 rounded-xl p-3 hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-400 to-emerald-700 flex items-center justify-center text-white font-extrabold text-xs shrink-0">
          {a.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-gray-850 text-xs truncate">{a.name}</span>
            <span className={`shrink-0 text-[9px] font-bold px-1.5 py-0.5 rounded ${stageStyle(a.pipeline_stage)}`}>{a.pipeline_stage}</span>
          </div>
          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400">
            <span className="font-mono">{a.unique_id}</span>
            {a.state && <span>· {a.state}</span>}
            {a.experience && <span>· {a.experience} yrs</span>}
            {a.applied_at && <span>· Applied {a.applied_at}</span>}
          </div>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={() => onViewDetails(ref)}
            className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:text-[#8E44AD] hover:border-[#8E44AD] flex items-center justify-center"
            title="View complete driver details"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
          </button>
          <button
            onClick={() => onScreen(ref, a.screening.done ? 'view' : 'conduct')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-1"
            title={a.screening.done ? 'View screening answers' : 'Conduct Greenline screening'}
          >
            <span className="material-symbols-outlined text-[13px]">fact_check</span>
            {a.screening.done ? 'View' : 'Screen'}
          </button>
          <button
            onClick={() => onCall(ref)}
            className="bg-[#1A5276] hover:bg-[#154360] text-white px-2.5 py-1.5 rounded-lg font-bold text-[10px] flex items-center gap-1"
            title="Call this applicant via CTI"
          >
            <span className="material-symbols-outlined text-[13px]">call</span>Call
          </button>
        </div>
      </div>

      {/* Info + docs */}
      <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-gray-500">
        {a.license_type && <span>Lic: <strong className="text-gray-700">{a.license_type}</strong>{a.license_number ? ` · ${a.license_number}` : ''}</span>}
        {a.income && <span>Income: <strong className="text-gray-700">{a.income}</strong></span>}
        {a.vehicle_types?.length > 0 && <span className="truncate max-w-[240px]" title={a.vehicle_types.join(', ')}>🚚 {a.vehicle_types.join(', ')}</span>}
      </div>
      <div className="mt-1.5 flex flex-wrap gap-1.5">
        <DocChip label="Photo" ok={a.documents_available.profile_image} />
        <DocChip label="DL" ok={a.documents_available.dl} />
        <DocChip label="PAN" ok={a.documents_available.pan} />
      </div>

      {/* Pipeline detail row */}
      <div className="mt-2 pt-2 border-t border-gray-100 flex flex-wrap items-center gap-2 text-[9.5px]">
        {/* Call */}
        {a.call.called ? (
          <span className={`font-bold px-1.5 py-0.5 rounded capitalize ${a.call.connected ? 'bg-green-50 text-green-700' : 'bg-amber-50 text-amber-700'}`}>
            {a.call.connected ? 'Connected' : (a.call.status || 'Called').replace('_', ' ')}
          </span>
        ) : (
          <span className="font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Not Called</span>
        )}
        {a.call.feedback && <span className="text-gray-500 truncate max-w-[160px]" title={a.call.feedback}>{a.call.feedback}</span>}

        {/* Screening */}
        {a.screening.done ? (
          <span className={`font-bold px-1.5 py-0.5 rounded ${decisionStyle(a.screening.decision)}`}>
            Screening: {a.screening.score} · {a.screening.status}
          </span>
        ) : (
          <span className="font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Screening Pending</span>
        )}

        {/* Interview */}
        {itv?.online_status && (
          <span className="font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 capitalize">Online: {itv.online_status}</span>
        )}
        {itv?.physical_status && (
          <span className="font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 capitalize">Physical: {itv.physical_status}</span>
        )}
        {a.call.match_status && (
          <span className={`font-bold px-1.5 py-0.5 rounded capitalize ${a.call.match_status === 'selected' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>{a.call.match_status}</span>
        )}
      </div>
    </div>
  );
};

export const GreenlineApplicantList: React.FC<Props> = (props) => {
  const { jobId } = props;
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [cursor, setCursor] = useState<number | null>(null);
  const [items, setItems] = useState<MmGreenlineApplicant[]>([]);

  const { data, isLoading, isFetching, isError, refetch } = useGetMmGreenlineApplicantsQuery(
    { jobId, filter, search: search || undefined, cursor: cursor ?? undefined, per_page: 20 },
    { refetchOnMountOrArgChange: true }
  );

  useEffect(() => {
    const rows = data?.data ?? [];
    if (cursor === null) setItems(rows);
    else if (rows.length > 0) {
      setItems(prev => {
        const ids = new Set(prev.map(r => r.application_id));
        return [...prev, ...rows.filter(r => !ids.has(r.application_id))];
      });
    }
  }, [data, cursor]);

  // Reset pagination when filter/search change.
  useEffect(() => { setCursor(null); }, [filter, search]);

  const counts = data?.counts || {};
  const pagination = data?.pagination;

  const chips = useMemo(() => FILTERS.map(f => ({ ...f, count: counts[f.value] })), [counts]);

  return (
    <div className="flex flex-col h-full">
      {/* Toolbar */}
      <div className="px-4 py-2.5 bg-white border-b border-gray-200 shrink-0 space-y-2">
        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search driver name or TMID..."
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <span className="material-symbols-outlined text-sm">close</span>
              </button>
            )}
          </div>
          <span className="text-gray-400 text-[10px] shrink-0">{data?.total ?? 0} shown</span>
        </div>
        {/* Filter chips with counts */}
        <div className="flex gap-1.5 flex-wrap">
          {chips.map(f => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-2.5 py-1 rounded-lg font-bold border text-[10px] transition-colors flex items-center gap-1 ${
                filter === f.value ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {f.label}
              {f.count !== undefined && (
                <span className={`text-[9px] font-extrabold px-1 py-0.5 rounded ${filter === f.value ? 'bg-white/25' : 'bg-gray-100 text-gray-600'}`}>{f.count}</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
        {isLoading && items.length === 0 ? (
          <div className="space-y-2">{[...Array(5)].map((_, i) => <div key={i} className="h-24 bg-white rounded-xl border border-gray-200 animate-pulse" />)}</div>
        ) : isError && items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="material-symbols-outlined text-4xl mb-2 text-red-300">error</span>
            <p className="font-semibold text-sm">Failed to load applicants</p>
            <button onClick={() => refetch()} className="mt-2 px-4 py-1.5 border border-emerald-500 text-emerald-600 rounded-lg font-bold text-[10px] hover:bg-emerald-50">Retry</button>
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <span className="material-symbols-outlined text-4xl mb-2">people</span>
            <p className="font-semibold">No applicants in this filter</p>
          </div>
        ) : (
          <>
            {items.map(a => <Card key={a.application_id} a={a} {...props} />)}
            {pagination?.has_more && (
              <button
                onClick={() => setCursor(pagination.next_cursor)}
                disabled={isFetching}
                className="w-full py-2 text-emerald-600 font-bold border border-emerald-500 rounded-xl hover:bg-emerald-50 transition-colors disabled:opacity-50"
              >
                {isFetching ? 'Loading…' : 'Load More'}
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default GreenlineApplicantList;
