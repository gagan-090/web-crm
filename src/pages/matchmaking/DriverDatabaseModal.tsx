import React, { useEffect, useMemo, useState } from 'react';
import {
  useGetMmDriversQuery,
  useGetMmDriverFiltersQuery,
  type MmDriver,
  type MmDriverSearchParams,
} from '../../services/api/webCrmApi';

/**
 * Driver Database — job-matched outreach.
 *
 * Opens over the MM Job Board. Browses the WHOLE registered-driver database
 * (the existing GET /web-crm/mm/drivers search API) and floats the drivers who
 * MATCH this job (route / location, licence, salary, vehicle type) to the top,
 * then lists everyone else. Each driver can be dialled directly (the call lands
 * in call_history_ivr with process = 'driverbase-matchmaking' and the job/match
 * context) and their full call history opened. Filters refine the pool.
 */

interface JobCriteria {
  job_location?: string | null;
  route?: string | null;
  vehicle_type?: string | null;
  license_type?: string | null;
  salary_range?: string | null;
}

interface Props {
  open: boolean;
  jobId: string;
  jobTitle?: string | null;
  job: JobCriteria;
  onCall: (driver: MmDriver) => void;
  /** Open the full driver profile + call history (eye icon). */
  onViewDetails: (driver: MmDriver) => void;
  onClose: () => void;
}

const PER_PAGE = 25;

const norm = (s: unknown) => String(s ?? '').toLowerCase().trim();
const numbersIn = (s: unknown): number[] =>
  (String(s ?? '').match(/\d[\d,]*/g) || []).map(n => parseInt(n.replace(/,/g, ''), 10)).filter(n => !isNaN(n));

export interface StateGeo {
  id: number;
  name: string;
  code: string;
  aliases: string[];
  cities: string[];
}

export const INDIAN_STATES_GEO: StateGeo[] = [
  {
    id: 9,
    name: 'Delhi',
    code: 'DL',
    aliases: ['delhi', 'new delhi', 'delhi ncr', 'ncr', 'dilli'],
    cities: ['delhi', 'new delhi', 'ncr', 'okhla', 'narela', 'bawana', 'azadpur', 'mayapuri', 'shahdara', 'rohini', 'dwarka', 'badarpur', 'anand vihar'],
  },
  {
    id: 35,
    name: 'Uttar Pradesh',
    code: 'UP',
    aliases: ['uttar pradesh', 'up', 'u.p.', 'uttarpradesh'],
    cities: [
      'lucknow', 'kanpur', 'agra', 'varanasi', 'banaras', 'kashi', 'prayagraj', 'allahabad',
      'noida', 'greater noida', 'ghaziabad', 'meerut', 'bareilly', 'aligarh', 'moradabad',
      'saharanpur', 'gorakhpur', 'gkp', 'jhansi', 'muzaffarnagar', 'mathura', 'ayodhya',
      'faizabad', 'firozabad', 'shahjahanpur', 'sitapur', 'sambhal', 'rampur', 'mirzapur',
      'bulandshahr', 'hapur', 'farrukhabad', 'rae bareli', 'raebareli', 'bahraich', 'orai',
      'jaunpur', 'unnao', 'sandila', 'hardoi', 'hathras', 'banda', 'kabrai', 'pilibhit',
      'barabanki', 'mughalsarai', 'deoria', 'badaun', 'lalitpur', 'kasganj', 'mainpuri',
      'etah', 'sultanpur', 'basti', 'ballia', 'azamgarh', 'amroha', 'chandauli', 'mau',
      'fatehpur', 'pratapgarh', 'gonda', 'ghazipur', 'kheri', 'lakhimpur',
    ],
  },
  {
    id: 12,
    name: 'Haryana',
    code: 'HR',
    aliases: ['haryana', 'hr', 'h.r.'],
    cities: [
      'gurgaon', 'gurugram', 'faridabad', 'panipat', 'sonipat', 'sonepat', 'ambala',
      'yamunanagar', 'rohtak', 'hisar', 'hissar', 'karnal', 'panchkula', 'bhiwani', 'sirsa',
      'bahadurgarh', 'jind', 'thanesar', 'kaithal', 'rewari', 'palwal', 'hansi', 'narnaul',
      'fatehabad', 'gohana', 'tohana', 'narwana', 'mandi dabwali', 'charkhi dadri', 'kundli',
      'manesar', 'kharkhoda', 'dharuhera', 'bawal', 'murthal', 'samalkha', 'pehowa',
    ],
  },
  {
    id: 29,
    name: 'Punjab',
    code: 'PB',
    aliases: ['punjab', 'pb', 'p.b.'],
    cities: [
      'ludhiana', 'amritsar', 'jalandhar', 'patiala', 'bathinda', 'hoshiarpur', 'mohali',
      'sas nagar', 'batala', 'pathankot', 'moga', 'abohar', 'malerkotla', 'khanna', 'muktsar',
      'barnala', 'rajpura', 'firozpur', 'ferozepur', 'kapurthala', 'phagwara', 'mandi gobindgarh',
      'mansa', 'fazilka', 'sangrur', 'zirakpur', 'dera bassi', 'nangal', 'nakodar',
    ],
  },
  {
    id: 30,
    name: 'Rajasthan',
    code: 'RJ',
    aliases: ['rajasthan', 'rj', 'r.j.'],
    cities: [
      'jaipur', 'jodhpur', 'kota', 'bikaner', 'ajmer', 'udaipur', 'bhilwara', 'alwar',
      'bharatpur', 'sikar', 'pali', 'sri ganganagar', 'ganganagar', 'hanumangarh', 'beawar',
      'kishangarh', 'jhunjhunu', 'baran', 'dholpur', 'tonk', 'hindaun', 'sawai madhopur',
      'churu', 'bundi', 'bhiwadi', 'neemrana', 'chittorgarh', 'makrana', 'nagaur', 'banswara',
    ],
  },
  {
    id: 21,
    name: 'Maharashtra',
    code: 'MH',
    aliases: ['maharashtra', 'mh', 'm.h.'],
    cities: [
      'mumbai', 'bombay', 'pune', 'nagpur', 'thane', 'pimpri', 'chinchwad', 'nashik', 'kalyan',
      'dombivli', 'vasai', 'virar', 'aurangabad', 'chhatrapati sambhajinagar', 'navi mumbai',
      'solapur', 'mira-bhayandar', 'bhiwandi', 'amravati', 'nanded', 'kolhapur', 'ulhasnagar',
      'sangli', 'malegaon', 'jalgaon', 'akola', 'latur', 'dhule', 'ahmednagar', 'ahilyanagar',
      'chandrapur', 'parbhani', 'ichalkaranji', 'jalna', 'bhusawal', 'panvel', 'satara', 'wardha',
      'chakan', 'talegaon', 'bhosari', 'ranjangaon', 'sinnar', 'sinner', 'igatpuri', 'supa',
      'chembur', 'wadala', 'andheri', 'nalasopara',
    ],
  },
  {
    id: 5,
    name: 'Bihar',
    code: 'BR',
    aliases: ['bihar', 'br', 'b.r.'],
    cities: [
      'patna', 'gaya', 'bhagalpur', 'muzaffarpur', 'purnia', 'darbhanga', 'bihar sharif',
      'arrah', 'begusarai', 'katihar', 'munger', 'chhapra', 'danapur', 'bettiah', 'saharsa',
      'sasaram', 'hajipur', 'dehri', 'siwan', 'motihari', 'nawada', 'buxar', 'kishanganj',
      'sitamarhi', 'jamalpur', 'jehanabad', 'aurangabad',
    ],
  },
  {
    id: 11,
    name: 'Gujarat',
    code: 'GJ',
    aliases: ['gujarat', 'gj', 'g.j.'],
    cities: [
      'ahmedabad', 'surat', 'vadodara', 'baroda', 'rajkot', 'bhavnagar', 'jamnagar', 'junagadh',
      'gandhinagar', 'gandhidham', 'anand', 'navsari', 'morbi', 'nadiad', 'surendranagar',
      'bharuch', 'mehsana', 'bhuj', 'porbandar', 'palanpur', 'valsad', 'vapi', 'gondal',
      'veraval', 'godhra', 'patan', 'kalol', 'dahod', 'mundra', 'ankleshwar', 'dahej',
      'halol', 'sanand', 'changodar',
    ],
  },
  {
    id: 20,
    name: 'Madhya Pradesh',
    code: 'MP',
    aliases: ['madhya pradesh', 'mp', 'm.p.'],
    cities: [
      'indore', 'bhopal', 'jabalpur', 'gwalior', 'ujjain', 'sagar', 'dewas', 'satna', 'ratlam',
      'rewa', 'katni', 'singrauli', 'burhanpur', 'khandwa', 'bhind', 'chhindwara', 'guna',
      'shivpuri', 'vidisha', 'chhatarpur', 'damoh', 'mandsaur', 'neemuch', 'pithampur',
      'mandideep', 'malanpur',
    ],
  },
  {
    id: 37,
    name: 'West Bengal',
    code: 'WB',
    aliases: ['west bengal', 'wb', 'w.b.', 'bengal'],
    cities: ['kolkata', 'calcutta', 'howrah', 'asansol', 'siliguri', 'durgapur', 'bardhaman', 'malda', 'kharagpur', 'haldia', 'dankuni'],
  },
  {
    id: 15,
    name: 'Jharkhand',
    code: 'JH',
    aliases: ['jharkhand', 'jh', 'j.h.'],
    cities: ['ranchi', 'jamshedpur', 'tatanagar', 'dhanbad', 'bokaro', 'deoghar', 'hazaribagh', 'giridih', 'ramgarh'],
  },
  {
    id: 36,
    name: 'Uttarakhand',
    code: 'UK',
    aliases: ['uttarakhand', 'uk', 'u.k.', 'ua', 'uttaranchal'],
    cities: ['dehradun', 'haridwar', 'roorkee', 'haldwani', 'rudrapur', 'kashipur', 'rishikesh', 'pantnagar'],
  },
  {
    id: 13,
    name: 'Himachal Pradesh',
    code: 'HP',
    aliases: ['himachal pradesh', 'hp', 'h.p.', 'himachal'],
    cities: ['shimla', 'dharamshala', 'solan', 'mandi', 'baddi', 'nalagarh', 'kullu', 'una', 'tahliwal', 'paonta sahib', 'kala amb'],
  },
  {
    id: 16,
    name: 'Karnataka',
    code: 'KA',
    aliases: ['karnataka', 'ka', 'k.a.'],
    cities: ['bangalore', 'bengaluru', 'mysore', 'mysuru', 'hubli', 'dharwad', 'mangalore', 'mangaluru', 'belgaum', 'belagavi', 'gulbarga', 'davangere', 'bellary', 'bijapur', 'shimoga', 'tumkur', 'raichur', 'bidar', 'hospet', 'peenya'],
  },
  {
    id: 32,
    name: 'Tamil Nadu',
    code: 'TN',
    aliases: ['tamil nadu', 'tn', 't.n.'],
    cities: ['chennai', 'madras', 'coimbatore', 'madurai', 'trichy', 'tiruchirappalli', 'salem', 'tiruppur', 'erode', 'tirunelveli', 'vellore', 'thoothukudi', 'dindigul', 'hosur', 'sriperumbudur'],
  },
  {
    id: 33,
    name: 'Telangana',
    code: 'TG',
    aliases: ['telangana', 'tg', 'ts'],
    cities: ['hyderabad', 'secunderabad', 'warangal', 'nizamabad', 'khammam', 'karimnagar', 'ramagundam', 'mahbubnagar'],
  },
  {
    id: 2,
    name: 'Andhra Pradesh',
    code: 'AP',
    aliases: ['andhra pradesh', 'ap', 'a.p.', 'andhra'],
    cities: ['visakhapatnam', 'vizag', 'vijayawada', 'guntur', 'nellore', 'kurnool', 'kakinada', 'rajahmundry', 'kadapa', 'tirupati', 'anantapur'],
  },
  {
    id: 7,
    name: 'Chhattisgarh',
    code: 'CG',
    aliases: ['chhattisgarh', 'cg', 'c.g.'],
    cities: ['raipur', 'bhilai', 'bilaspur', 'korba', 'rajnandgaon', 'raigarh', 'durg'],
  },
  {
    id: 26,
    name: 'Odisha',
    code: 'OD',
    aliases: ['odisha', 'orissa', 'od', 'or'],
    cities: ['bhubaneswar', 'cuttack', 'rourkela', 'berhampur', 'sambalpur', 'puri', 'balasore', 'jharsuguda', 'paradip'],
  },
  {
    id: 4,
    name: 'Assam',
    code: 'AS',
    aliases: ['assam', 'as'],
    cities: ['guwahati', 'silchar', 'dibrugarh', 'jorhat', 'nagaon', 'tinsukia', 'tezpur'],
  },
  {
    id: 6,
    name: 'Chandigarh',
    code: 'CH',
    aliases: ['chandigarh', 'ch'],
    cities: ['chandigarh'],
  },
  {
    id: 10,
    name: 'Goa',
    code: 'GA',
    aliases: ['goa', 'ga'],
    cities: ['panaji', 'margao', 'vasco', 'mapusa', 'ponda'],
  },
];

/** Extract relevant states from a free-form location or route string */
export function resolveStatesFromText(text: string): StateGeo[] {
  if (!text) return [];
  const clean = text.toLowerCase();
  const matched = new Set<StateGeo>();

  for (const s of INDIAN_STATES_GEO) {
    if (clean.includes(s.name.toLowerCase())) {
      matched.add(s);
      continue;
    }
    for (const alias of s.aliases) {
      if (alias.length <= 2) {
        const regex = new RegExp(`\\b${alias}\\b`, 'i');
        if (regex.test(clean)) {
          matched.add(s);
          break;
        }
      } else if (clean.includes(alias)) {
        matched.add(s);
        break;
      }
    }
    for (const city of s.cities) {
      if (city.length > 2) {
        const regex = new RegExp(`\\b${city}\\b`, 'i');
        if (regex.test(clean)) {
          matched.add(s);
          break;
        }
      }
    }
  }

  return Array.from(matched);
}

/** Check if driver belongs to a particular state (via home state, preferred state, TMID code, or city) */
function driverBelongsToState(d: MmDriver, state: StateGeo): boolean {
  const driverState = (d.state || '').trim().toLowerCase();
  if (driverState && (driverState === state.name.toLowerCase() || state.aliases.includes(driverState))) {
    return true;
  }
  const prefState = (d.preferredState || '').trim().toLowerCase();
  if (prefState && (prefState === state.name.toLowerCase() || state.aliases.includes(prefState))) {
    return true;
  }
  if (d.tmid && state.code) {
    const tmidUpper = d.tmid.toUpperCase();
    if (tmidUpper.includes(state.code.toUpperCase())) {
      return true;
    }
  }
  const driverCity = (d.city || '').trim().toLowerCase();
  if (driverCity && driverCity !== '—' && state.cities.includes(driverCity)) {
    return true;
  }
  return false;
}

/** Check if driver city explicitly appears in a text */
function driverCityMatchesText(d: MmDriver, text: string): boolean {
  const city = (d.city || '').trim().toLowerCase();
  if (!city || city === '—' || city.length < 3) return false;
  const regex = new RegExp(`\\b${city}\\b`, 'i');
  return regex.test(text.toLowerCase());
}

/** Heuristic match of one driver against the job's stated criteria (Location, Route, City, Vehicle, Licence, Salary). */
function matchDriver(d: MmDriver, job: JobCriteria): { score: number; reasons: string[] } {
  const reasons: string[] = [];
  let score = 0;

  const jobLoc = (job.job_location || '').trim();
  const jobRoute = (job.route || '').trim();

  const locStates = resolveStatesFromText(jobLoc);
  const routeStates = resolveStatesFromText(jobRoute);

  let matchedLoc = false;
  let matchedRoute = false;
  let matchedCity = false;

  // 1. Check Job Location Match
  if (jobLoc) {
    for (const s of locStates) {
      if (driverBelongsToState(d, s)) {
        matchedLoc = true;
        break;
      }
    }
    if (!matchedLoc && d.state && d.state !== '—' && jobLoc.toLowerCase().includes(d.state.toLowerCase())) {
      matchedLoc = true;
    }
    if (driverCityMatchesText(d, jobLoc)) {
      matchedLoc = true;
      matchedCity = true;
    }
  }

  // 2. Check Job Route Match
  if (jobRoute) {
    const routeNorm = jobRoute.toLowerCase();
    if (routeNorm.includes('all india') || routeNorm.includes('all over india')) {
      matchedRoute = true;
    }
    for (const s of routeStates) {
      if (driverBelongsToState(d, s)) {
        matchedRoute = true;
        break;
      }
    }
    if (!matchedRoute && d.state && d.state !== '—' && (
      routeNorm.includes(d.state.toLowerCase()) ||
      d.state.split(' ').some(w => w.length > 3 && routeNorm.includes(w.toLowerCase()))
    )) {
      matchedRoute = true;
    }
    if (driverCityMatchesText(d, jobRoute)) {
      matchedRoute = true;
      matchedCity = true;
    }
    if (d.routes && d.routes !== 'Local') {
      const dRoutesNorm = d.routes.toLowerCase();
      if (routeStates.some(s => dRoutesNorm.includes(s.name.toLowerCase()) || s.cities.some(c => c.length > 3 && dRoutesNorm.includes(c)))) {
        matchedRoute = true;
      }
    }
  }

  if (matchedLoc) {
    score += 4;
    reasons.push('Location');
  }

  if (matchedRoute) {
    score += 4;
    reasons.push('Route');
  }

  if (matchedCity && !reasons.includes('City')) {
    score += 2;
    reasons.push('City');
  }

  // 3. Vehicle Matching (smart keyword without generic "trucks" stopword)
  const jobVeh = norm(job.vehicle_type);
  if (jobVeh && (d.truckTypes || []).length > 0) {
    const isVehicleMatch = d.truckTypes.some(t => {
      const tNorm = norm(t);
      if (!tNorm) return false;
      if (jobVeh.includes(tNorm) || tNorm.includes(jobVeh)) return true;

      const stopwords = new Set(['truck', 'trucks', 'vehicle', 'vehicles', 'commercial', 'heavy', 'light', 'body', 'open', 'closed', 'motor']);
      const jobTokens = jobVeh.split(/[\s,/-]+/).filter(w => w.length > 2 && !stopwords.has(w));
      const dTokens = tNorm.split(/[\s,/-]+/).filter(w => w.length > 2 && !stopwords.has(w));

      return jobTokens.length > 0 && jobTokens.some(jt => dTokens.includes(jt));
    });

    if (isVehicleMatch) {
      score += 3;
      reasons.push('Vehicle');
    }
  }

  // 4. Licence Matching (with equivalence: HGMV / HMV / Heavy / HTV vs LMV)
  const jobLic = norm(job.license_type);
  if (jobLic && d.license && d.license !== '—') {
    const dLic = norm(d.license);
    const isHeavyJob = /hgmv|hmv|heavy|htv|hpmv|trans/.test(jobLic);
    const isHeavyDriver = /hgmv|hmv|heavy|htv|hpmv|trans/.test(dLic);
    const isLightJob = /lmv|light/.test(jobLic);
    const isLightDriver = /lmv|light/.test(dLic);

    const isLicMatch = (isHeavyJob && isHeavyDriver) || (isLightJob && isLightDriver) || jobLic.includes(dLic) || dLic.includes(jobLic);
    if (isLicMatch) {
      score += 2;
      reasons.push('Licence');
    }
  }

  // 5. Salary Matching
  const jobSal = numbersIn(job.salary_range);
  if (jobSal.length) {
    const jMin = Math.min(...jobSal), jMax = Math.max(...jobSal);
    const dMin = d.salaryMin ?? Math.min(...(numbersIn(d.expectedSalary).length ? numbersIn(d.expectedSalary) : [0]));
    const dMax = d.salaryMax ?? Math.max(...(numbersIn(d.expectedSalary).length ? numbersIn(d.expectedSalary) : [0]));
    if ((dMin || dMax) && dMin <= jMax && dMax >= jMin) {
      score += 1;
      reasons.push('Salary');
    }
  }

  return { score, reasons };
}

const DriverDatabaseModal: React.FC<Props> = ({ open, jobId, jobTitle, job, onCall, onViewDetails, onClose }) => {
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [states, setStates] = useState<number[]>([]);
  const [city, setCity] = useState('');
  const [licenses, setLicenses] = useState<string[]>([]);
  const [vehicleTypes, setVehicleTypes] = useState<string[]>([]);
  const [salaryMin, setSalaryMin] = useState('');
  const [salaryMax, setSalaryMax] = useState('');
  const [matchedOnly, setMatchedOnly] = useState(false);
  const [subscribedOnly, setSubscribedOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<MmDriver[]>([]);

  // Debounce the free-text search.
  useEffect(() => {
    const t = setTimeout(() => setSearch(searchInput.trim()), 350);
    return () => clearTimeout(t);
  }, [searchInput]);

  // Any filter change restarts pagination.
  useEffect(() => { setPage(1); }, [search, states, city, licenses, vehicleTypes, salaryMin, salaryMax, subscribedOnly]);

  const { data: filterData } = useGetMmDriverFiltersQuery(undefined, { skip: !open });
  const options = filterData?.filters;

  const params: MmDriverSearchParams = useMemo(() => ({
    search: search || undefined,
    state_id: states.length ? states : undefined,
    city: city || undefined,
    license: licenses.length ? licenses : undefined,
    vehicle_type: vehicleTypes.length ? vehicleTypes : undefined,
    salary_min: salaryMin ? Number(salaryMin) : undefined,
    salary_max: salaryMax ? Number(salaryMax) : undefined,
    subscribed: subscribedOnly ? 'yes' : undefined,
    // Drivers another agent has taken to Interview / Matchmaking Done are
    // theirs — they can't be called from here, so they aren't listed at all.
    hide_locked: 1,
    lock_job_id: jobId || undefined,
    page,
    per_page: PER_PAGE,
  }), [search, states, city, licenses, vehicleTypes, salaryMin, salaryMax, subscribedOnly, jobId, page]);

  const { data, isFetching, isError } = useGetMmDriversQuery(params, { skip: !open });
  const pagination = data?.pagination;

  useEffect(() => {
    const incoming = data?.drivers ?? [];
    if (page === 1) setRows(incoming);
    else if (incoming.length) {
      setRows(prev => {
        const ids = new Set(prev.map(r => r.id));
        return [...prev, ...incoming.filter(r => !ids.has(r.id))];
      });
    }
  }, [data, page]);

  // Score + sort: matched-to-this-job drivers first, then the rest.
  const scored = useMemo(() => {
    const withScore = rows.map(d => ({ d, ...matchDriver(d, job) }));
    const filtered = matchedOnly ? withScore.filter(x => x.score > 0) : withScore;
    return [...filtered].sort((a, b) => b.score - a.score);
  }, [rows, job, matchedOnly]);

  const matchedCount = useMemo(() => scored.filter(x => x.score > 0).length, [scored]);

  if (!open) return null;

  const toggle = (list: string[], set: (v: string[]) => void, value: string) =>
    set(list.includes(value) ? list.filter(v => v !== value) : [...list, value]);

  const criteria = [
    job.job_location && `📍 ${job.job_location}`,
    job.route && `🛣️ ${job.route}`,
    job.vehicle_type && `🚚 ${job.vehicle_type}`,
    job.license_type && `🪪 ${job.license_type}`,
    job.salary_range && `💰 ${job.salary_range}`,
  ].filter(Boolean) as string[];

  const detectedJobStates = useMemo(() => {
    const raw = `${job.job_location || ''} ${job.route || ''}`;
    return resolveStatesFromText(raw);
  }, [job.job_location, job.route]);

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-3">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl flex flex-col" style={{ height: 'min(90vh, 760px)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-[#1A5276] text-white rounded-t-2xl shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-extrabold text-sm">
              <span className="material-symbols-outlined text-[18px]">database</span>
              Driver Database
            </div>
            <div className="text-[11px] text-white/70 truncate">{jobTitle || jobId} · matched drivers first</div>
          </div>
          <button onClick={onClose} className="text-white/80 hover:text-white shrink-0">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        {/* Job criteria hint + Quick State Matching */}
        {(criteria.length > 0 || detectedJobStates.length > 0) && (
          <div className="px-4 py-2 bg-sky-50 border-b border-sky-100 flex flex-wrap items-center justify-between gap-2 shrink-0">
            <div className="flex flex-wrap gap-1.5 items-center">
              <span className="text-[10px] font-bold text-sky-700 self-center">MATCHING ON:</span>
              {criteria.map((c, i) => (
                <span key={i} className="text-[10px] font-semibold text-sky-800 bg-white border border-sky-200 rounded px-1.5 py-0.5">{c}</span>
              ))}
            </div>
            {detectedJobStates.length > 0 && (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] font-bold text-sky-900">Matching State:</span>
                {detectedJobStates.map(s => {
                  const active = states.includes(s.id);
                  return (
                    <button
                      key={s.id}
                      onClick={() => setStates(prev => active ? prev.filter(id => id !== s.id) : [...prev, s.id])}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full border transition-all ${
                        active
                          ? 'bg-[#1A5276] text-white border-[#1A5276] shadow-sm'
                          : 'bg-white text-sky-800 border-sky-300 hover:bg-sky-100'
                      }`}
                    >
                      {active ? '✓ ' : '+ '}{s.name}
                    </button>
                  );
                })}
                {states.length > 0 && (
                  <button
                    onClick={() => setStates([])}
                    className="text-[10px] text-gray-400 hover:text-gray-600 underline ml-0.5"
                  >
                    Reset
                  </button>
                )}
              </div>
            )}
          </div>
        )}

        {/* Search + filter toggles */}
        <div className="px-4 py-2.5 border-b border-gray-200 flex flex-wrap items-center gap-2 shrink-0">
          <div className="flex-1 min-w-[180px] relative">
            <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400 text-base">search</span>
            <input
              value={searchInput}
              onChange={e => setSearchInput(e.target.value)}
              placeholder="Search name / TMID / phone…"
              className="w-full pl-8 pr-3 py-1.5 border border-gray-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-[#1A5276]"
            />
          </div>
          <button
            onClick={() => setMatchedOnly(v => !v)}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold ${matchedOnly ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            <span className="material-symbols-outlined text-[14px]">verified</span>
            Matched only {matchedCount ? `(${matchedCount})` : ''}
          </button>
          <button
            onClick={() => setSubscribedOnly(v => !v)}
            title="Only drivers with a paid subscription"
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold ${subscribedOnly ? 'bg-amber-500 text-white border-amber-500' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            <span className="material-symbols-outlined text-[14px]">workspace_premium</span>
            Subscribed only{subscribedOnly && pagination ? ` (${pagination.total})` : ''}
          </button>
          <button
            onClick={() => setShowFilters(v => !v)}
            className={`shrink-0 flex items-center gap-1 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold ${showFilters ? 'bg-[#1A5276] text-white border-[#1A5276]' : 'bg-white text-gray-600 border-gray-200'}`}
          >
            <span className="material-symbols-outlined text-[14px]">tune</span>
            Filters{states.length > 0 ? ` (${states.length} state)` : ''}
          </button>
        </div>

        {/* Filters panel */}
        {showFilters && (
          <div className="px-4 py-3 border-b border-gray-200 bg-gray-50 grid grid-cols-1 sm:grid-cols-2 gap-3 shrink-0 max-h-[38%] overflow-y-auto">
            {!!options?.states?.length && (
              <div className="sm:col-span-2">
                <label className="text-[10px] font-bold text-gray-500 block mb-1">State</label>
                <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto p-1 bg-white border border-gray-200 rounded-lg">
                  {options.states.map(s => {
                    const active = states.includes(s.id);
                    return (
                      <button
                        key={s.id}
                        onClick={() => setStates(prev => active ? prev.filter(id => id !== s.id) : [...prev, s.id])}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded border transition-colors ${
                          active
                            ? 'bg-[#1A5276] text-white border-[#1A5276]'
                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
                        }`}
                      >
                        {s.name}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
            <div>
              <label className="text-[10px] font-bold text-gray-500 block mb-1">City</label>
              <input value={city} onChange={e => setCity(e.target.value)} placeholder="Any city"
                className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs outline-none" />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-500 block mb-1">Salary min</label>
                <input value={salaryMin} onChange={e => setSalaryMin(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="₹"
                  className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs outline-none" />
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-gray-500 block mb-1">Salary max</label>
                <input value={salaryMax} onChange={e => setSalaryMax(e.target.value.replace(/\D/g, ''))} inputMode="numeric" placeholder="₹"
                  className="w-full px-2 py-1.5 border border-gray-200 rounded-lg text-xs outline-none" />
              </div>
            </div>
            {!!options?.licenses?.length && (
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1">Licence</label>
                <div className="flex flex-wrap gap-1">
                  {options.licenses.slice(0, 10).map(l => (
                    <button key={l.value} onClick={() => toggle(licenses, setLicenses, l.value)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${licenses.includes(l.value) ? 'bg-[#1A5276] text-white border-[#1A5276]' : 'bg-white text-gray-600 border-gray-200'}`}>
                      {l.value}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {!!options?.vehicle_types?.length && (
              <div>
                <label className="text-[10px] font-bold text-gray-500 block mb-1">Vehicle type</label>
                <div className="flex flex-wrap gap-1">
                  {options.vehicle_types.slice(0, 12).map(v => (
                    <button key={v.id} onClick={() => toggle(vehicleTypes, setVehicleTypes, String(v.id))}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded border ${vehicleTypes.includes(String(v.id)) ? 'bg-[#1A5276] text-white border-[#1A5276]' : 'bg-white text-gray-600 border-gray-200'}`}>
                      {v.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Driver list */}
        <div className="flex-1 overflow-y-auto px-3 py-2">
          {isError ? (
            <div className="text-center text-rose-500 text-sm py-10">Failed to load the driver database.</div>
          ) : rows.length === 0 && isFetching ? (
            <div className="text-center text-gray-400 text-sm py-10">Loading drivers…</div>
          ) : scored.length === 0 ? (
            <div className="text-center text-gray-400 text-sm py-10">No drivers match these filters.</div>
          ) : (
            <div className="space-y-2">
              {scored.map(({ d, score, reasons }) => (
                <div key={d.id} className={`border rounded-lg p-2.5 flex items-center gap-3 ${score > 0 ? 'border-emerald-200 bg-emerald-50/40' : 'border-gray-200 bg-white'}`}>
                  <div className="w-9 h-9 rounded-full bg-[#1A5276] text-white flex items-center justify-center font-bold text-sm shrink-0">
                    {(d.name || '?').charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="font-bold text-[13px] text-gray-800 truncate">{d.name || 'Driver'}</span>
                      {score > 0 && (
                        <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-700">
                          MATCHED{reasons.length ? ` · ${reasons.join(', ')}` : ''}
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">
                      {d.tmid} · {[d.city && d.city !== '—' ? d.city : null, d.state && d.state !== '—' ? d.state : null].filter(Boolean).join(', ') || '—'} · {d.experience || d.experienceBucket || '—'}
                    </div>
                    <div className="text-[10px] text-gray-500 truncate">
                      {d.license && <>🪪 {d.license} · </>}
                      {(d.truckTypes || []).length > 0 && <>🚚 {(d.truckTypes || []).slice(0, 3).join(', ')} · </>}
                      {(d.expectedSalary || d.currentSalary) && <>💰 {d.expectedSalary || d.currentSalary}</>}
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {/* Eye → complete driver details (profile + full call history). */}
                    <button
                      onClick={() => onViewDetails(d)}
                      title="View complete driver details & call history"
                      className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-[#1A5276]"
                    >
                      <span className="material-symbols-outlined text-[17px]">visibility</span>
                    </button>
                    <button
                      onClick={() => onCall(d)}
                      disabled={!d.phone}
                      title={d.phone ? 'Call this driver' : 'No phone number on record'}
                      className="flex items-center gap-1 bg-green-600 hover:bg-green-700 disabled:opacity-40 text-white px-3 py-1.5 rounded-lg font-bold text-[10px]"
                    >
                      <span className="material-symbols-outlined text-[13px]">call</span>Call
                    </button>
                  </div>
                </div>
              ))}

              {pagination && page < pagination.last_page && !matchedOnly && (
                <button
                  onClick={() => setPage(p => p + 1)}
                  disabled={isFetching}
                  className="w-full py-2 text-[11px] font-bold text-[#1A5276] hover:bg-sky-50 rounded-lg border border-sky-200 mt-1"
                >
                  {isFetching ? 'Loading…' : `Load more (${rows.length} of ${pagination.total})`}
                </button>
              )}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-gray-200 text-[10px] text-gray-400 shrink-0">
          Calls placed here are logged as <span className="font-bold">driverbase-matchmaking</span> against this job.
        </div>
      </div>
    </div>
  );
};

export default DriverDatabaseModal;
