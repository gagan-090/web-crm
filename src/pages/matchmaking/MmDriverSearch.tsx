import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useGetMmDriversQuery,
  useGetMmDriverFiltersQuery,
  type MmDriver,
  type MmDriverSearchParams,
} from '../../services/api/webCrmApi';
import { DriverForm } from './MmDriverBank';
import DriverDetailsModal from './DriverDetailsModal';

/** Everything the filter panel can set. Kept flat so chips/reset stay trivial. */
interface Filters {
  search: string;
  state_id: string;
  preferred_state_id: string;
  city: string;
  license: string[];
  license_status: string[];
  endorsement: string[];
  vehicle_type: string[];
  truck_ownership: string;
  experience: string[];
  min_experience: number | '';
  salary_min: number | '';
  salary_max: number | '';
  plan: string[];
  applied_status: string;
  applied_job_id: string;
  min_applications: number | '';
  education: string[];
  job_placement: string;
  profile_complete: string;
  gender: string;
  registered_within_days: number | '';
  call_status: string;
  sort: string;
}

const EMPTY_FILTERS: Filters = {
  search: '', state_id: '', preferred_state_id: '', city: '',
  license: [], license_status: [], endorsement: [], vehicle_type: [],
  truck_ownership: '', experience: [], min_experience: '',
  salary_min: '', salary_max: '', plan: [],
  applied_status: '', applied_job_id: '', min_applications: '',
  education: [], job_placement: '', profile_complete: '', gender: '',
  registered_within_days: '', call_status: '', sort: 'recent',
};

const PER_PAGE = 25;

const SORT_OPTIONS = [
  { value: 'recent', label: 'Newest registered' },
  { value: 'experience_desc', label: 'Most experienced' },
  { value: 'experience_asc', label: 'Least experienced' },
  { value: 'salary_asc', label: 'Lowest salary ask' },
  { value: 'salary_desc', label: 'Highest salary ask' },
  { value: 'applications_desc', label: 'Most job applications' },
  { value: 'name', label: 'Name (A–Z)' },
];

const LICENSE_STATUS_STYLES: Record<string, string> = {
  valid: 'bg-green-50 text-green-700 border-green-200',
  expiring: 'bg-amber-50 text-amber-700 border-amber-200',
  expired: 'bg-red-50 text-red-700 border-red-200',
  unknown: 'bg-gray-100 text-gray-500 border-gray-200',
};

const PLAN_STYLES: Record<string, string> = {
  trusted: 'bg-purple-50 text-[#7D3C98] border-purple-200',
  verified: 'bg-blue-50 text-blue-700 border-blue-200',
  job_ready: 'bg-teal-50 text-teal-700 border-teal-200',
  legacy: 'bg-orange-50 text-orange-700 border-orange-200',
  free: 'bg-gray-100 text-gray-500 border-gray-200',
};

/** Collapsible filter group. */
const Section: React.FC<{
  title: string;
  count?: number;
  defaultOpen?: boolean;
  children: React.ReactNode;
}> = ({ title, count = 0, defaultOpen = false, children }) => {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-200 pb-2">
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between py-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider hover:text-gray-600"
      >
        <span className="flex items-center gap-1.5">
          {title}
          {count > 0 && (
            <span className="bg-[#8E44AD] text-white rounded-full px-1.5 py-px text-[9px] font-extrabold normal-case">
              {count}
            </span>
          )}
        </span>
        <span className={`material-symbols-outlined text-sm transition-transform ${open ? 'rotate-180' : ''}`}>
          expand_more
        </span>
      </button>
      {open && <div className="space-y-2.5 pt-1 pb-1">{children}</div>}
    </div>
  );
};

/** Multi-select chip row. */
const ChipGroup: React.FC<{
  options: Array<{ value: string; label: string; count?: number }>;
  selected: string[];
  onToggle: (value: string) => void;
}> = ({ options, selected, onToggle }) => (
  <div className="flex flex-wrap gap-1.5">
    {options.map(o => {
      const isOn = selected.includes(o.value);
      return (
        <button
          key={o.value}
          onClick={() => onToggle(o.value)}
          title={o.count !== undefined ? `${o.count.toLocaleString()} drivers` : undefined}
          className={`px-2 py-0.5 rounded border font-semibold text-[10px] ${
            isOn
              ? 'bg-purple-100 border-[#8E44AD] text-[#7D3C98]'
              : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100'
          }`}
        >
          {o.label}
        </button>
      );
    })}
  </div>
);

const Label: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <label className="text-[9.5px] text-gray-400 font-bold uppercase tracking-wider block">{children}</label>
);

const selectCls =
  'w-full border border-gray-200 rounded p-1 px-1.5 outline-none font-semibold text-gray-700 bg-white text-[11px]';

export const MmDriverSearch: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Job context passed from the job details page
  const state = location.state || {};
  const jobId = state.jobId || null;
  const jobRequirements = state.requirements || null;

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [bankPrefill, setBankPrefill] = useState<any | null>(null);
  const [selectedDrivers, setSelectedDrivers] = useState<number[]>([]);
  const [detailsDriver, setDetailsDriver] = useState<{ id: number; name: string; tmid: string } | null>(null);

  const [filters, setFilters] = useState<Filters>(EMPTY_FILTERS);
  const [page, setPage] = useState(1);

  // Text inputs are debounced so typing doesn't fire a query per keystroke.
  const [searchInput, setSearchInput] = useState('');
  const [cityInput, setCityInput] = useState('');
  useEffect(() => {
    const t = setTimeout(() => set('search', searchInput), 350);
    return () => clearTimeout(t);
  }, [searchInput]);
  useEffect(() => {
    const t = setTimeout(() => set('city', cityInput), 350);
    return () => clearTimeout(t);
  }, [cityInput]);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters(prev => (prev[key] === value ? prev : { ...prev, [key]: value }));
    setPage(1);
  }

  const toggle = (key: keyof Filters) => (value: string) => {
    setFilters(prev => {
      const current = prev[key] as string[];
      return {
        ...prev,
        [key]: current.includes(value) ? current.filter(v => v !== value) : [...current, value],
      };
    });
    setPage(1);
  };

  const { data: filterData } = useGetMmDriverFiltersQuery();
  const options = filterData?.filters;

  const params: MmDriverSearchParams = useMemo(
    () => ({ ...filters, page, per_page: PER_PAGE } as MmDriverSearchParams),
    [filters, page],
  );

  const { data, isFetching, isError } = useGetMmDriversQuery(params);
  const drivers: MmDriver[] = data?.drivers || [];
  const pagination = data?.pagination;
  const total = pagination?.total ?? 0;
  const lastPage = pagination?.last_page ?? 1;

  // ── Active filter chips ────────────────────────────────────────────────
  const activeChips = useMemo(() => {
    const chips: Array<{ key: keyof Filters; value?: string; label: string }> = [];
    const stateName = (id: string) => options?.states.find(s => String(s.id) === id)?.name || id;
    const truckName = (id: string) => options?.vehicle_types.find(v => String(v.id) === id)?.name || id;

    if (filters.search) chips.push({ key: 'search', label: `“${filters.search}”` });
    if (filters.state_id) chips.push({ key: 'state_id', label: `Home: ${stateName(filters.state_id)}` });
    if (filters.preferred_state_id)
      chips.push({ key: 'preferred_state_id', label: `Prefers: ${stateName(filters.preferred_state_id)}` });
    if (filters.city) chips.push({ key: 'city', label: `City: ${filters.city}` });
    filters.license.forEach(v => chips.push({ key: 'license', value: v, label: v }));
    filters.license_status.forEach(v =>
      chips.push({ key: 'license_status', value: v, label: `Licence ${v}` }));
    filters.endorsement.forEach(v => chips.push({ key: 'endorsement', value: v, label: v }));
    filters.vehicle_type.forEach(v => chips.push({ key: 'vehicle_type', value: v, label: truckName(v) }));
    if (filters.truck_ownership)
      chips.push({ key: 'truck_ownership', label: filters.truck_ownership === 'own' ? 'Owns truck' : "Owner's truck" });
    filters.experience.forEach(v => chips.push({ key: 'experience', value: v, label: `Exp ${v}` }));
    if (filters.min_experience !== '')
      chips.push({ key: 'min_experience', label: `Min ${filters.min_experience} yrs` });
    if (filters.salary_min !== '')
      chips.push({ key: 'salary_min', label: `≥ ₹${Number(filters.salary_min).toLocaleString()}` });
    if (filters.salary_max !== '')
      chips.push({ key: 'salary_max', label: `≤ ₹${Number(filters.salary_max).toLocaleString()}` });
    filters.plan.forEach(v =>
      chips.push({ key: 'plan', value: v, label: options?.plans.find(p => p.value === v)?.label || v }));
    if (filters.applied_status)
      chips.push({
        key: 'applied_status',
        label: options?.application_statuses.find(a => a.value === filters.applied_status)?.label || filters.applied_status,
      });
    if (filters.applied_job_id) chips.push({ key: 'applied_job_id', label: `Applied to ${filters.applied_job_id}` });
    if (filters.min_applications !== '')
      chips.push({ key: 'min_applications', label: `${filters.min_applications}+ applications` });
    filters.education.forEach(v => chips.push({ key: 'education', value: v, label: v }));
    if (filters.job_placement)
      chips.push({
        key: 'job_placement',
        label: filters.job_placement === 'no' ? 'Looking for a job' : filters.job_placement === 'yes' ? 'Already placed' : 'Placement unknown',
      });
    if (filters.profile_complete)
      chips.push({ key: 'profile_complete', label: filters.profile_complete === '1' ? 'Profile complete' : 'Profile incomplete' });
    if (filters.gender) chips.push({ key: 'gender', label: filters.gender });
    if (filters.registered_within_days !== '')
      chips.push({ key: 'registered_within_days', label: `Joined ≤ ${filters.registered_within_days}d` });
    if (filters.call_status)
      chips.push({ key: 'call_status', label: filters.call_status === 'never' ? 'Never called' : 'Already called' });
    return chips;
  }, [filters, options]);

  const removeChip = (key: keyof Filters, value?: string) => {
    setFilters(prev => {
      const current = prev[key];
      if (Array.isArray(current) && value !== undefined) {
        return { ...prev, [key]: current.filter(v => v !== value) };
      }
      return { ...prev, [key]: EMPTY_FILTERS[key] };
    });
    setPage(1);
  };

  const handleResetFilters = () => {
    setFilters(EMPTY_FILTERS);
    setSearchInput('');
    setCityInput('');
    setPage(1);
    triggerToast('Filters reset to defaults');
  };

  // ── Selection / actions ────────────────────────────────────────────────
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedDrivers(e.target.checked ? drivers.map(d => d.id) : []);
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    setSelectedDrivers(prev => (checked ? [...prev, id] : prev.filter(item => item !== id)));
  };


  const handleAddBulk = () => {
    if (selectedDrivers.length === 0) return;
    triggerToast(`Bulk added ${selectedDrivers.length} candidates to job ${jobId || 'Shortlist'} ✓`);
    setSelectedDrivers([]);
  };

  const salarySteps = [15000, 20000, 25000, 30000, 35000, 40000, 45000, 50000, 55000, 60000, 75000];

  return (
    <main className="flex h-[calc(100vh-60px)] bg-white overflow-hidden relative text-xs">

      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toastMessage}
        </div>
      )}

      {/* Filter panel */}
      <aside className="w-72 bg-gray-50 border-r border-gray-200 flex flex-col shrink-0">
        <div className="p-4 pb-2 shrink-0">
          <h3 className="text-xs font-extrabold text-gray-800 uppercase tracking-wide border-b border-gray-200 pb-2 flex items-center justify-between">
            <span>Match Sourcing Filters</span>
            {activeChips.length > 0 && (
              <span className="bg-[#8E44AD] text-white rounded-full px-1.5 py-px text-[9px] font-extrabold">
                {activeChips.length}
              </span>
            )}
          </h3>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-1">
          {/* Free text search — always visible */}
          <div className="space-y-1.5 pb-2">
            <Label>Search driver</Label>
            <input
              type="text"
              placeholder="Name or TMID"
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              className="w-full border border-gray-200 rounded p-1.5 px-2.5 outline-none font-semibold text-gray-800 bg-white"
            />
          </div>

          <Section
            title="Location & Route"
            defaultOpen
            count={[filters.state_id, filters.preferred_state_id, filters.city].filter(Boolean).length}
          >
            <div className="space-y-1.5">
              <Label>Home state</Label>
              <select value={filters.state_id} onChange={e => set('state_id', e.target.value)} className={selectCls}>
                <option value="">Any state</option>
                {options?.states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Preferred working state</Label>
              <select
                value={filters.preferred_state_id}
                onChange={e => set('preferred_state_id', e.target.value)}
                className={selectCls}
              >
                <option value="">Any preference</option>
                {options?.states.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Hub / base city</Label>
              <input
                type="text"
                placeholder="e.g. Delhi"
                value={cityInput}
                onChange={e => setCityInput(e.target.value)}
                className="w-full border border-gray-200 rounded p-1.5 px-2.5 outline-none font-semibold text-gray-800 bg-white"
              />
            </div>
          </Section>

          <Section
            title="Truck & Licence"
            defaultOpen
            count={
              filters.vehicle_type.length + filters.license.length + filters.license_status.length +
              filters.endorsement.length + (filters.truck_ownership ? 1 : 0)
            }
          >
            <div className="space-y-1.5">
              <Label>Licence class</Label>
              <ChipGroup
                options={(options?.licenses || [])
                  .filter(l => /^[A-Z/]+$/.test(l.value))
                  .map(l => ({ value: l.value, label: l.value, count: l.count }))}
                selected={filters.license}
                onToggle={toggle('license')}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Licence validity</Label>
              <ChipGroup
                options={(options?.license_statuses || []).map(s => ({ value: s.value, label: s.label }))}
                selected={filters.license_status}
                onToggle={toggle('license_status')}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Endorsements</Label>
              <ChipGroup
                options={(options?.endorsements || []).slice(0, 10)
                  .map(e => ({ value: e.value, label: e.value, count: e.count }))}
                selected={filters.endorsement}
                onToggle={toggle('endorsement')}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Truck types driven</Label>
              <div className="max-h-40 overflow-y-auto pr-1">
                <ChipGroup
                  options={(options?.vehicle_types || []).map(v => ({ value: String(v.id), label: v.name }))}
                  selected={filters.vehicle_type}
                  onToggle={toggle('vehicle_type')}
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Truck ownership</Label>
              <select
                value={filters.truck_ownership}
                onChange={e => set('truck_ownership', e.target.value)}
                className={selectCls}
              >
                <option value="">Any</option>
                {options?.ownerships.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </div>
          </Section>

          <Section
            title="Experience & Salary"
            defaultOpen
            count={
              filters.experience.length + (filters.min_experience !== '' ? 1 : 0) +
              (filters.salary_min !== '' ? 1 : 0) + (filters.salary_max !== '' ? 1 : 0)
            }
          >
            <div className="space-y-1.5">
              <Label>Experience band</Label>
              <ChipGroup
                options={(options?.experiences || []).map(e => ({ value: e.value, label: e.label }))}
                selected={filters.experience}
                onToggle={toggle('experience')}
              />
            </div>
            <div className="space-y-2">
              <Label>
                <span className="flex justify-between">
                  <span>Min experience</span>
                  <span className="text-gray-800 font-bold font-mono normal-case">
                    {filters.min_experience === '' ? 'Any' : `${filters.min_experience} yrs`}
                  </span>
                </span>
              </Label>
              <input
                type="range"
                min={0}
                max={15}
                value={filters.min_experience === '' ? 0 : filters.min_experience}
                onChange={e => set('min_experience', Number(e.target.value) === 0 ? '' : Number(e.target.value))}
                className="w-full accent-[#8E44AD] cursor-pointer"
              />
            </div>
            <div className="space-y-1.5">
              <Label>Expected monthly salary</Label>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={filters.salary_min}
                  onChange={e => set('salary_min', e.target.value === '' ? '' : Number(e.target.value))}
                  className={selectCls}
                >
                  <option value="">Min ₹</option>
                  {salarySteps.map(s => <option key={s} value={s}>₹{s.toLocaleString()}</option>)}
                </select>
                <select
                  value={filters.salary_max}
                  onChange={e => set('salary_max', e.target.value === '' ? '' : Number(e.target.value))}
                  className={selectCls}
                >
                  <option value="">Max ₹</option>
                  {salarySteps.map(s => <option key={s} value={s}>₹{s.toLocaleString()}</option>)}
                </select>
              </div>
            </div>
          </Section>

          <Section title="Subscription Plan" defaultOpen count={filters.plan.length}>
            <ChipGroup
              options={(options?.plans || []).map(p => ({ value: p.value, label: p.label }))}
              selected={filters.plan}
              onToggle={toggle('plan')}
            />
          </Section>

          <Section
            title="Job Applications"
            count={
              (filters.applied_status ? 1 : 0) + (filters.applied_job_id ? 1 : 0) +
              (filters.min_applications !== '' ? 1 : 0)
            }
          >
            <div className="space-y-1.5">
              <Label>Application activity</Label>
              <select
                value={filters.applied_status}
                onChange={e => set('applied_status', e.target.value)}
                className={selectCls}
              >
                <option value="">Any activity</option>
                {options?.application_statuses.map(a => (
                  <option key={a.value} value={a.value}>{a.label}</option>
                ))}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Minimum applications</Label>
              <select
                value={filters.min_applications}
                onChange={e => set('min_applications', e.target.value === '' ? '' : Number(e.target.value))}
                className={selectCls}
              >
                <option value="">Any number</option>
                {[1, 2, 3, 5, 10].map(n => <option key={n} value={n}>{n}+ applications</option>)}
              </select>
            </div>
            {jobId && (
              <label className="flex items-center gap-2 font-semibold text-gray-700 cursor-pointer">
                <input
                  type="checkbox"
                  checked={filters.applied_job_id === String(jobId)}
                  onChange={e => set('applied_job_id', e.target.checked ? String(jobId) : '')}
                  className="rounded border-gray-300 text-[#8E44AD] focus:ring-[#8E44AD]"
                />
                <span>Only drivers who applied to {jobId}</span>
              </label>
            )}
          </Section>

          <Section
            title="Profile & Activity"
            count={
              filters.education.length + (filters.job_placement ? 1 : 0) +
              (filters.profile_complete ? 1 : 0) + (filters.gender ? 1 : 0) +
              (filters.registered_within_days !== '' ? 1 : 0) + (filters.call_status ? 1 : 0)
            }
          >
            <div className="space-y-1.5">
              <Label>Job status</Label>
              <select
                value={filters.job_placement}
                onChange={e => set('job_placement', e.target.value)}
                className={selectCls}
              >
                <option value="">Any</option>
                <option value="no">Looking for a job</option>
                <option value="yes">Already placed</option>
                <option value="unknown">Not captured</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Education</Label>
              <ChipGroup
                options={(options?.educations || []).slice(0, 8)
                  .map(e => ({ value: e.value, label: e.value, count: e.count }))}
                selected={filters.education}
                onToggle={toggle('education')}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Profile completion</Label>
              <select
                value={filters.profile_complete}
                onChange={e => set('profile_complete', e.target.value)}
                className={selectCls}
              >
                <option value="">Any</option>
                <option value="1">Complete profiles only</option>
                <option value="0">Incomplete profiles</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Gender</Label>
              <select value={filters.gender} onChange={e => set('gender', e.target.value)} className={selectCls}>
                <option value="">Any</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Registered within</Label>
              <select
                value={filters.registered_within_days}
                onChange={e => set('registered_within_days', e.target.value === '' ? '' : Number(e.target.value))}
                className={selectCls}
              >
                <option value="">Any time</option>
                {[7, 15, 30, 60, 90].map(d => <option key={d} value={d}>Last {d} days</option>)}
              </select>
            </div>
            <div className="space-y-1.5">
              <Label>Call history</Label>
              <select value={filters.call_status} onChange={e => set('call_status', e.target.value)} className={selectCls}>
                <option value="">Any</option>
                <option value="never">Never called</option>
                <option value="called">Already called</option>
              </select>
            </div>
          </Section>
        </div>

        <div className="p-4 border-t border-gray-200 space-y-2 shrink-0">
          <button
            onClick={handleResetFilters}
            className="w-full py-2 bg-white border border-gray-200 text-gray-500 rounded-xl font-bold hover:bg-gray-100 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      </aside>

      {/* Results */}
      <section className="flex-1 flex flex-col overflow-hidden">

        {/* Linked job context banner */}
        {jobId && (
          <div className="bg-purple-50 border-b border-purple-200 text-[#7D3C98] p-3 flex justify-between items-center shrink-0 font-bold">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px]">explore</span>
              <span>
                Sourcing Candidates for {jobId} ({jobRequirements?.transporter}): {jobRequirements?.source} ➔{' '}
                {jobRequirements?.destination} · {jobRequirements?.truckType}
              </span>
            </div>
            <button onClick={() => navigate('/mm/mm-job-board')} className="underline text-[10.5px]">
              Back to Job Board
            </button>
          </div>
        )}

        {/* Toolbar */}
        <div className="p-4 bg-gray-50 border-b border-gray-200 flex justify-between items-center shrink-0 font-bold select-none text-gray-500 gap-3">
          <span className="shrink-0">
            {isFetching ? 'Searching…' : `Found ${total.toLocaleString()} matching driver candidates`}
          </span>

          <div className="flex items-center gap-2">
            {selectedDrivers.length > 0 && (
              <button
                onClick={handleAddBulk}
                className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white px-3.5 py-1.5 rounded-lg shadow-sm text-xs font-bold transition-all flex items-center gap-1"
              >
                <span className="material-symbols-outlined text-sm">group_add</span>
                <span>Add selected ({selectedDrivers.length}) to shortlist</span>
              </button>
            )}
            <select
              value={filters.sort}
              onChange={e => set('sort', e.target.value)}
              className="border border-gray-200 rounded-lg py-1.5 px-2 bg-white text-gray-700 font-bold text-[11px] outline-none"
            >
              {SORT_OPTIONS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* Active filter chips */}
        {activeChips.length > 0 && (
          <div className="px-4 py-2 bg-white border-b border-gray-200 flex flex-wrap items-center gap-1.5 shrink-0">
            {activeChips.map(chip => (
              <button
                key={`${chip.key}-${chip.value ?? ''}`}
                onClick={() => removeChip(chip.key, chip.value)}
                className="flex items-center gap-1 bg-purple-50 border border-purple-200 text-[#7D3C98] rounded-full pl-2 pr-1 py-0.5 font-bold text-[10px] hover:bg-purple-100"
              >
                {chip.label}
                <span className="material-symbols-outlined text-[12px]">close</span>
              </button>
            ))}
            <button onClick={handleResetFilters} className="text-gray-400 hover:text-gray-600 font-bold text-[10px] underline ml-1">
              Clear all
            </button>
          </div>
        )}

        {/* Results table */}
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white border-b border-gray-200 text-gray-400 font-bold uppercase text-[9px] sticky top-0 shadow-sm z-10">
                <th className="p-3 pl-4 w-12">
                  <input
                    type="checkbox"
                    checked={drivers.length > 0 && selectedDrivers.length === drivers.length}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-[#8E44AD] focus:ring-[#8E44AD]"
                  />
                </th>
                <th className="p-3">Driver Details</th>
                <th className="p-3">Plan</th>
                <th className="p-3">Licence</th>
                <th className="p-3">Base City</th>
                <th className="p-3">Truck Type</th>
                <th className="p-3">Experience</th>
                <th className="p-3">Salary Ask</th>
                <th className="p-3">Applications</th>
                <th className="p-3 text-right pr-4">Sourcing Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
              {drivers.map(d => {
                const isChecked = selectedDrivers.includes(d.id);
                return (
                  <tr key={d.id} className={`hover:bg-gray-50/50 transition-colors ${isChecked ? 'bg-purple-50/20' : ''}`}>
                    <td className="p-3 pl-4">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={e => handleSelectOne(d.id, e.target.checked)}
                        className="rounded border-gray-300 text-[#8E44AD] focus:ring-[#8E44AD]"
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col">
                        <span className="font-extrabold text-gray-800 text-xs">{d.name}</span>
                        <span className="text-[10px] text-gray-400 font-mono mt-0.5">{d.tmid}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className={`text-[9.5px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                        PLAN_STYLES[d.planKey] || PLAN_STYLES.free
                      }`}>
                        {d.planLabel}
                      </span>
                    </td>
                    <td className="p-3">
                      <div className="flex flex-col gap-0.5">
                        <span className="font-bold text-gray-800">{d.license}</span>
                        <span className={`text-[9px] font-bold px-1 py-px rounded border uppercase w-fit ${
                          LICENSE_STATUS_STYLES[d.licenseStatus]
                        }`}>
                          {d.licenseStatus === 'unknown' ? 'no expiry' : d.licenseStatus}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 font-semibold text-gray-800">
                      <div className="flex flex-col">
                        <span>{d.city}</span>
                        <span className="text-[10px] text-gray-400">{d.state}</span>
                      </div>
                    </td>
                    <td className="p-3 text-gray-500 font-semibold">
                      {d.truckTypes.length > 0 ? (
                        <span title={d.truckTypes.join(', ')}>
                          {d.truckTypes[0]}
                          {d.truckTypes.length > 1 && (
                            <span className="text-gray-400"> +{d.truckTypes.length - 1}</span>
                          )}
                        </span>
                      ) : '—'}
                    </td>
                    <td className="p-3 font-mono font-bold text-gray-900">
                      {d.experienceYears !== null ? `${d.experienceYears} yrs` : '—'}
                    </td>
                    <td className="p-3 font-mono font-bold text-gray-600">
                      {d.salaryMin !== null
                        ? `₹${(d.salaryMin / 1000).toFixed(0)}k–${((d.salaryMax || d.salaryMin) / 1000).toFixed(0)}k`
                        : '—'}
                    </td>
                    <td className="p-3">
                      {d.applicationsTotal > 0 ? (
                        <span className="font-mono font-bold text-gray-900">
                          {d.applicationsTotal}
                          {d.applicationsAccepted > 0 && (
                            <span className="text-green-600 font-bold text-[10px] ml-1">
                              ({d.applicationsAccepted} accepted)
                            </span>
                          )}
                        </span>
                      ) : <span className="text-gray-300 font-mono">0</span>}
                    </td>
                    <td className="p-3 text-right pr-4 space-x-2 whitespace-nowrap">
                      {/* Full driver dossier: profile, documents, verifications,
                          subscription history, every applied job and the whole
                          call timeline with recordings. */}
                      <button
                        onClick={() => setDetailsDriver({ id: d.id, name: d.name, tmid: d.tmid })}
                        className="w-7 h-7 rounded-lg border border-gray-200 text-gray-500 hover:text-[#8E44AD] hover:border-[#8E44AD] inline-flex items-center justify-center transition-colors align-middle"
                        title="View complete driver details — profile, subscription, applied jobs and call history"
                      >
                        <span className="material-symbols-outlined text-[17px]">visibility</span>
                      </button>
                      <button
                        onClick={() => setBankPrefill({
                          name: d.name,
                          mobile: (d.phone || '').replace(/\s/g, ''),
                          tmid: d.tmid.startsWith('DR-') ? '' : d.tmid,
                          user_id: d.id,
                        })}
                        className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white px-2 py-0.5 rounded font-bold text-[10px]"
                      >
                        + Bank
                      </button>
                    </td>
                  </tr>
                );
              })}
              {drivers.length === 0 && (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-gray-400 italic">
                    {isFetching ? 'Searching drivers…'
                      : isError ? 'Could not load drivers. Please retry.'
                      : 'No candidates match your active sourcing filters.'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {total > 0 && (
          <div className="p-3 px-4 border-t border-gray-200 bg-gray-50 flex justify-between items-center shrink-0 text-gray-500 font-bold">
            <span>
              Showing {(page - 1) * PER_PAGE + 1}–{Math.min(page * PER_PAGE, total)} of {total.toLocaleString()}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page <= 1 || isFetching}
                className="px-3 py-1 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100"
              >
                Previous
              </button>
              <span className="font-mono">Page {page} / {lastPage}</span>
              <button
                onClick={() => setPage(p => Math.min(lastPage, p + 1))}
                disabled={page >= lastPage || isFetching}
                className="px-3 py-1 bg-white border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {detailsDriver && (
        <DriverDetailsModal
          open
          driverId={detailsDriver.id}
          driverName={detailsDriver.name}
          uniqueId={detailsDriver.tmid}
          onClose={() => setDetailsDriver(null)}
        />
      )}

      {bankPrefill && (
        <DriverForm
          prefill={bankPrefill}
          onClose={() => { setBankPrefill(null); triggerToast('Driver added to bank ✓'); }}
        />
      )}
    </main>
  );
};

export default MmDriverSearch;
