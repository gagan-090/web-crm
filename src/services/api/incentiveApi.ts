import { baseApi } from './baseApi';

export interface GateProgress {
  accruedIncentive: number;
  threshold: number;
  remaining: number;
  percentage: number;
  daysLeft: number;
  isUnlocked: boolean;

  salaryGateThreshold: number;
  salaryGateRemaining: number;
  salaryGatePercentage: number;
  isSalaryGateUnlocked: boolean;

  incentiveGateThreshold: number;
  incentiveGateRemaining: number;
  incentiveGatePercentage: number;
  isIncentiveGateUnlocked: boolean;
}

export interface MonthlyIncentive {
  preTeiAmount: number;
  teiScore: number;
  multiplier: number;
  finalPayout: number;
  peerAverage: number;
  daysLeft: number;
  planBreakdown: Array<{ plan: string; count: number; amount: number }>;
  lineItems: Array<{
    id: string;
    date: string;
    name: string;
    tmid: string;
    plan: string;
    amount: number;
    type: 'Direct' | 'Organic';
    component?: 'Component A' | 'Component B'; // For MM
  }>;
  teiMetrics: {
    connectivityRatio: number; // e.g. 74%
    talkTimeMinutes: number; // e.g. 185 mins
    idleTimeRatio: number; // e.g. 12%
    connectivityGrade: 'A' | 'B' | 'C' | 'D';
    talkTimeGrade: 'A' | 'B' | 'C' | 'D';
    idleTimeGrade: 'A' | 'B' | 'C' | 'D';
  };
  versatilityBonus: {
    processesQualified: string[];
    bonusAmount: number;
    nextTierRequirement: string;
  };
  salaryDetails: {
    baseSalary: number;
    versatilityBonus: number;
    accruedIncentive: number;
    teiMultiplier: number;
    totalTakeHome: number;
  };
}

export interface TeamMemberSummary {
  id: number;
  name: string;
  role: string;
  sub_role: string;
  conversions: number;
  accrued: number;
  tei: number;
  gateStatus: 'Locked' | 'Unlocked';
  lastCallTime: string;
  trend: 'up' | 'down' | 'stable';
}

export interface ProcessParity {
  processName: string;
  averageIncentive: number;
  topEarner: string;
  outliersCount: number;
  outliers: string[];
}

export interface RateCard {
  role: string;
  baseRate: number;
  bonusRate: number;
  gateThreshold: number;
  teiModifiers: Array<{ band: string; multiplier: number }>;
}

// Rate Card Spec from Locked CRM Spec
const RATE_CARD_SPEC = {
  dwc: {
    label: "Driver Welcome Caller",
    items: [
      { key: "job_ready",  label: "Job Ready Driver",  fullRate: 20,  organicRate: 10,  planValue: 199,  emoji: "🟢" },
      { key: "verified",   label: "Verified Driver",   fullRate: 40,  organicRate: 20,  planValue: 299,  emoji: "🔵" },
      { key: "trusted",    label: "Trusted Driver",    fullRate: 80,  organicRate: 40,  planValue: 499,  emoji: "🟣" },
    ],
  },
  sc: {
    label: "Special Categories Caller",
    items: [
      { key: "association",    label: "Association Subscription",    fullRate: 250,  organicRate: 125,  planValue: 999,   emoji: "🏛️" },
      { key: "foreman",       label: "Foreman Subscription",        fullRate: 200,  organicRate: 100,  planValue: 799,   emoji: "👷" },
      { key: "dhabha_ref",    label: "Dhabha Partner Referral",     fullRate: 5,    organicRate: 5,    planValue: 0,     emoji: "🍛", isFlat: true },
      { key: "puncture_ref",  label: "Puncture Shop Referral",      fullRate: 5,    organicRate: 5,    planValue: 0,     emoji: "🔧", isFlat: true },
    ],
  },
  twc: {
    label: "Transporter Welcome Caller",
    items: [
      { key: "tr_subscription",   label: "Transporter Subscription",       fullRate: 200,  organicRate: 100,  planValue: 999,   emoji: "🚛" },
      { key: "premium_posting",   label: "Premium Job Posting (Welcome)",  fullRate: 300,  organicRate: 150,  planValue: 1999,  emoji: "⭐" },
      { key: "sp_posting",        label: "Super Premium Posting (Welcome)",fullRate: 500,  organicRate: 250,  planValue: 2999,  emoji: "💎" },
    ],
  },
  mm: {
    label: "Matchmaking Caller",
    items: [
      { key: "mm_premium_conv",   label: "Unpaid → Premium Conversion",    fullRate: 300,  organicRate: 150,  planValue: 1999,  emoji: "🔄", component: "Component A" as const },
      { key: "mm_sp_conv",        label: "Unpaid → Super Premium Conv.",    fullRate: 500,  organicRate: 250,  planValue: 2999,  emoji: "🔄", component: "Component A" as const },
      { key: "mm_placement",      label: "Driver Placement (Paid Job)",    fullRate: 100,  organicRate: 50,   planValue: 0,     emoji: "✅", component: "Component B" as const },
    ],
  },
};

interface ConversionRecord {
  id: string;
  date: string;
  name: string;
  tmid: string;
  plan: string;
  amount: number;
  type: 'Direct' | 'Organic';
  component?: 'Component A' | 'Component B';
}

function generateInitialConversions(roleKey: 'dwc' | 'twc' | 'sc' | 'mm'): ConversionRecord[] {
  const records: ConversionRecord[] = [];
  const names = ['Ramesh Prasad', 'Suresh Kumar', 'Mahesh Yadav', 'Ganesh Singh', 'Rajesh Patel', 'Vijay Sharma', 'Amit Verma', 'Dinesh Choudhary', 'Satish Jha', 'Naveen Gupta', 'Karan Johar', 'Sunil Dutt'];
  
  if (roleKey === 'dwc') {
    for (let i = 0; i < 18; i++) {
      const type = i % 4 === 0 ? 'Organic' : 'Direct';
      const items = RATE_CARD_SPEC.dwc.items;
      const item = items[i % items.length];
      records.push({
        id: `CONV-DW-${1000 + i}`,
        date: `2026-06-${24 - Math.floor(i / 2)}`,
        name: names[i % names.length],
        tmid: `TM-DW-${5000 + i}`,
        plan: item.label,
        amount: type === 'Direct' ? item.fullRate : item.organicRate,
        type,
      });
    }
  } else if (roleKey === 'twc') {
    for (let i = 0; i < 12; i++) {
      const type = i % 3 === 0 ? 'Organic' : 'Direct';
      const items = RATE_CARD_SPEC.twc.items;
      const item = items[i % items.length];
      records.push({
        id: `CONV-TW-${1000 + i}`,
        date: `2026-06-${24 - Math.floor(i / 2)}`,
        name: `${names[i % names.length]} Logistics`,
        tmid: `TM-TW-${5000 + i}`,
        plan: item.label,
        amount: type === 'Direct' ? item.fullRate : item.organicRate,
        type,
      });
    }
  } else if (roleKey === 'sc') {
    for (let i = 0; i < 14; i++) {
      const type = i % 3 === 0 ? 'Organic' : 'Direct';
      const items = RATE_CARD_SPEC.sc.items;
      const item = items[i % items.length];
      records.push({
        id: `CONV-SC-${1000 + i}`,
        date: `2026-06-${24 - Math.floor(i / 2)}`,
        name: names[i % names.length],
        tmid: `TM-SC-${5000 + i}`,
        plan: item.label,
        amount: type === 'Direct' ? item.fullRate : item.organicRate,
        type,
      });
    }
  } else if (roleKey === 'mm') {
    for (let i = 0; i < 15; i++) {
      const type = i % 4 === 0 ? 'Organic' : 'Direct';
      const items = RATE_CARD_SPEC.mm.items;
      const item = items[i % items.length];
      records.push({
        id: `CONV-MM-${1000 + i}`,
        date: `2026-06-${24 - Math.floor(i / 2)}`,
        name: names[i % names.length],
        tmid: `TM-MM-${5000 + i}`,
        plan: item.label,
        amount: type === 'Direct' ? item.fullRate : item.organicRate,
        type,
        component: item.component,
      });
    }
  }
  return records;
}

function calculateIncentiveForRole(roleKey: 'dwc' | 'twc' | 'sc' | 'mm', conversions: ConversionRecord[], teiScoreVal: number, versatilityActiveVal: boolean) {
  let totalRevenue = 0;
  let preTEI = 0;
  
  conversions.forEach(c => {
    const spec = RATE_CARD_SPEC[roleKey];
    const matched = spec.items.find(item => item.label === c.plan);
    const planValue = matched ? matched.planValue : 0;
    totalRevenue += planValue;
    preTEI += c.amount;
  });

  const baseSalary = roleKey === 'sc' ? 0 : roleKey === 'twc' ? 14000 : roleKey === 'mm' ? 20000 : 19000;
  
  const salaryGateThreshold = roleKey === 'sc' ? 0 : baseSalary + 5000;
  const incentiveGateThreshold = roleKey === 'sc' ? 0 : baseSalary * 2;

  const isSalaryGateUnlocked = roleKey === 'sc' || totalRevenue >= salaryGateThreshold;
  const isIncentiveGateUnlocked = roleKey === 'sc' || totalRevenue >= incentiveGateThreshold;

  const salaryGatePercentage = salaryGateThreshold === 0 ? 100 : Math.min(100, (totalRevenue / salaryGateThreshold) * 100);
  const incentiveGatePercentage = incentiveGateThreshold === 0 ? 100 : Math.min(100, (totalRevenue / incentiveGateThreshold) * 100);

  const salaryGateRemaining = Math.max(0, salaryGateThreshold - totalRevenue);
  const incentiveGateRemaining = Math.max(0, incentiveGateThreshold - totalRevenue);

  // Fallbacks/Legacy fields
  const gateThreshold = incentiveGateThreshold;
  const gateCrossed = isIncentiveGateUnlocked;
  const gateProgress = incentiveGatePercentage;
  const gateRemaining = incentiveGateRemaining;
  
  const getTEIMultiplier = (score: number) => {
    if (score >= 85) return 1.10;
    if (score >= 70) return 1.05;
    if (score >= 55) return 1.00;
    if (score >= 40) return 0.95;
    return 0.85;
  };
  const teiMultiplier = getTEIMultiplier(teiScoreVal);
  
  const effectivePreTEI = isIncentiveGateUnlocked ? preTEI : 0;
  const postTEI = Math.round(effectivePreTEI * teiMultiplier);
  const versatilityBonus = versatilityActiveVal ? 750 : 0;
  
  return {
    totalRevenue,
    preTEI,
    gateCrossed,
    gateProgress,
    gateRemaining,
    gateThreshold,
    salaryGateThreshold,
    salaryGateRemaining,
    salaryGatePercentage,
    isSalaryGateUnlocked,
    incentiveGateThreshold,
    incentiveGateRemaining,
    incentiveGatePercentage,
    isIncentiveGateUnlocked,
    teiMultiplier,
    effectivePreTEI,
    postTEI,
    versatilityBonus,
    finalPayout: postTEI + versatilityBonus,
    baseSalary,
  };
}

function getRateCardItem(roleKey: 'dwc' | 'twc' | 'sc' | 'mm', planName: string) {
  const roleCard = RATE_CARD_SPEC[roleKey];
  let found = roleCard.items.find(item => item.key === planName || item.label === planName);
  if (found) return found;

  if (roleKey === 'dwc') {
    if (planName.includes('199') || planName.includes('Basic') || planName === 'job_ready') return roleCard.items[0];
    if (planName.includes('299') || planName.includes('Standard') || planName === 'verified') return roleCard.items[1];
    if (planName.includes('499') || planName.includes('Premium') || planName === 'trusted') return roleCard.items[2];
  }
  if (roleKey === 'twc') {
    if (planName.includes('999') || planName.includes('Subscription') || planName === 'tr_subscription') return roleCard.items[0];
    if (planName.includes('1999') || planName.includes('Premium') || planName === 'premium_posting') return roleCard.items[1];
    if (planName.includes('2999') || planName.includes('Super') || planName === 'sp_posting') return roleCard.items[2];
  }
  if (roleKey === 'sc') {
    if (planName.includes('999') || planName.includes('Association') || planName === 'association') return roleCard.items[0];
    if (planName.includes('799') || planName.includes('Foreman') || planName === 'foreman') return roleCard.items[1];
    if (planName.includes('dhabha') || planName === 'dhabha_ref') return roleCard.items[2];
    if (planName.includes('puncture') || planName === 'puncture_ref') return roleCard.items[3];
  }
  if (roleKey === 'mm') {
    if (planName.includes('1999') || planName.includes('Premium') || planName === 'mm_premium_conv') return roleCard.items[0];
    if (planName.includes('2999') || planName.includes('Super') || planName === 'mm_sp_conv') return roleCard.items[1];
    if (planName.includes('placement') || planName === 'mm_placement') return roleCard.items[2];
  }
  
  return roleCard.items[0];
}

// In-Memory Reactive Mock Store
let mockStore = {
  dwc: {
    conversions: generateInitialConversions('dwc'),
    teiScore: 72,
  },
  twc: {
    conversions: generateInitialConversions('twc'),
    teiScore: 75,
  },
  sc: {
    conversions: generateInitialConversions('sc'),
    teiScore: 88,
  },
  mm: {
    conversions: generateInitialConversions('mm'),
    teiScore: 68,
  },
  rateCards: [
    {
      role: 'dwc',
      baseRate: 20,
      bonusRate: 80,
      gateThreshold: 38000,
      teiModifiers: [
        { band: 'Exceptional (85-100)', multiplier: 1.10 },
        { band: 'Good (70-84)', multiplier: 1.05 },
        { band: 'Standard (55-69)', multiplier: 1.00 },
        { band: 'Below Average (40-54)', multiplier: 0.95 },
        { band: 'Needs Improvement (0-39)', multiplier: 0.85 },
      ]
    },
    {
      role: 'twc',
      baseRate: 200,
      bonusRate: 500,
      gateThreshold: 28000,
      teiModifiers: [
        { band: 'Exceptional (85-100)', multiplier: 1.10 },
        { band: 'Good (70-84)', multiplier: 1.05 },
        { band: 'Standard (55-69)', multiplier: 1.00 },
        { band: 'Below Average (40-54)', multiplier: 0.95 },
        { band: 'Needs Improvement (0-39)', multiplier: 0.85 },
      ]
    },
    {
      role: 'sc',
      baseRate: 200,
      bonusRate: 250,
      gateThreshold: 0,
      teiModifiers: [
        { band: 'Exceptional (85-100)', multiplier: 1.10 },
        { band: 'Good (70-84)', multiplier: 1.05 },
        { band: 'Standard (55-69)', multiplier: 1.00 },
        { band: 'Below Average (40-54)', multiplier: 0.95 },
        { band: 'Needs Improvement (0-39)', multiplier: 0.85 },
      ]
    },
    {
      role: 'mm',
      baseRate: 100,
      bonusRate: 500,
      gateThreshold: 40000,
      teiModifiers: [
        { band: 'Exceptional (85-100)', multiplier: 1.10 },
        { band: 'Good (70-84)', multiplier: 1.05 },
        { band: 'Standard (55-69)', multiplier: 1.00 },
        { band: 'Below Average (40-54)', multiplier: 0.95 },
        { band: 'Needs Improvement (0-39)', multiplier: 0.85 },
      ]
    }
  ],
  rateCardHistory: [
    { id: 1, date: '2026-06-01', user: 'Admin User', action: 'Changed DWC Base Rate from ₹140 to ₹150' },
    { id: 2, date: '2026-05-15', user: 'Admin User', action: 'Reduced TWC Gate Threshold from ₹36,000 to ₹35,000' }
  ]
};

// Event handlers
let listeners: Array<() => void> = [];
const subscribe = (listener: () => void) => {
  listeners.push(listener);
  return () => {
    listeners = listeners.filter(l => l !== listener);
  };
};
const notify = () => listeners.forEach(l => l());

// Helper to determine role-key from user object
function getRoleKey(roleStr: string): 'dwc' | 'twc' | 'sc' | 'mm' {
  const r = roleStr.toLowerCase();
  if (r.includes('dw') || r.includes('welcome')) return 'dwc';
  if (r.includes('tw') || r.includes('transporter')) return 'twc';
  if (r.includes('sc') || r.includes('special')) return 'sc';
  if (r.includes('mm') || r.includes('match')) return 'mm';
  return 'dwc';
}

export const incentiveApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getGateProgress: build.query<GateProgress, string>({
      async queryFn(role, _queryApi, _extraOptions, fetchWithBQ) {
        const key = getRoleKey(role);

        // Driver Welcome is backed by the real incentive engine — every other
        // role still reads from the in-memory mock store below.
        if (key === 'dwc') {
          const result = await fetchWithBQ('/web-crm/dw/incentive/gate-progress');
          if (result.error) return { error: result.error as any };
          return { data: (result.data as any).data as GateProgress };
        }

        const data = mockStore[key];
        const teiScore = data.teiScore;
        const metrics = calculateIncentiveForRole(key, data.conversions, teiScore, true);

        return {
          data: {
            accruedIncentive: metrics.totalRevenue,
            threshold: metrics.gateThreshold,
            remaining: metrics.gateRemaining,
            percentage: metrics.gateProgress,
            daysLeft: 6,
            isUnlocked: metrics.gateCrossed,
            salaryGateThreshold: metrics.salaryGateThreshold,
            salaryGateRemaining: metrics.salaryGateRemaining,
            salaryGatePercentage: metrics.salaryGatePercentage,
            isSalaryGateUnlocked: metrics.isSalaryGateUnlocked,
            incentiveGateThreshold: metrics.incentiveGateThreshold,
            incentiveGateRemaining: metrics.incentiveGateRemaining,
            incentiveGatePercentage: metrics.incentiveGatePercentage,
            isIncentiveGateUnlocked: metrics.isIncentiveGateUnlocked
          }
        };
      },
      keepUnusedDataFor: 60,
      async onCacheEntryAdded(arg, { updateCachedData, cacheEntryRemoved }) {
        // Real dwc data doesn't live in the mock store, so there's nothing to
        // subscribe to — just wait out the cache entry's lifetime.
        if (getRoleKey(arg) === 'dwc') {
          await cacheEntryRemoved;
          return;
        }

        const unsubscribeStore = subscribe(() => {
          updateCachedData((draft) => {
            const key = getRoleKey(arg);
            const data = mockStore[key];
            const teiScore = data.teiScore;
            const metrics = calculateIncentiveForRole(key, data.conversions, teiScore, true);

            draft.accruedIncentive = metrics.totalRevenue;
            draft.threshold = metrics.gateThreshold;
            draft.isUnlocked = metrics.gateCrossed;
            draft.remaining = metrics.gateRemaining;
            draft.percentage = metrics.gateProgress;
            draft.salaryGateThreshold = metrics.salaryGateThreshold;
            draft.salaryGateRemaining = metrics.salaryGateRemaining;
            draft.salaryGatePercentage = metrics.salaryGatePercentage;
            draft.isSalaryGateUnlocked = metrics.isSalaryGateUnlocked;
            draft.incentiveGateThreshold = metrics.incentiveGateThreshold;
            draft.incentiveGateRemaining = metrics.incentiveGateRemaining;
            draft.incentiveGatePercentage = metrics.incentiveGatePercentage;
            draft.isIncentiveGateUnlocked = metrics.isIncentiveGateUnlocked;
          });
        });
        await cacheEntryRemoved;
        unsubscribeStore();
      }
    }),

    getMonthIncentive: build.query<MonthlyIncentive, { role: string; period?: string }>({
      async queryFn({ role, period = 'this_month' }, _queryApi, _extraOptions, fetchWithBQ) {
        const key = getRoleKey(role);

        if (key === 'dwc') {
          const result = await fetchWithBQ(`/web-crm/dw/incentive/month?period=${period}`);
          if (result.error) return { error: result.error as any };
          return { data: (result.data as any).data as MonthlyIncentive };
        }

        const conversions = mockStore[key].conversions;
        const teiScore = mockStore[key].teiScore;

        let activeProcesses = 0;
        Object.keys(mockStore).forEach((k) => {
          if (k === 'dwc' || k === 'twc' || k === 'sc' || k === 'mm') {
            if (mockStore[k as 'dwc' | 'twc' | 'sc' | 'mm'].conversions.length > 0) {
              activeProcesses++;
            }
          }
        });
        const versatilityActive = activeProcesses >= 2;

        const metrics = calculateIncentiveForRole(key, conversions, teiScore, versatilityActive);

        // Sum Plan Breakdowns
        const planCounts: Record<string, { count: number; amount: number }> = {};
        conversions.forEach(c => {
          if (!planCounts[c.plan]) {
            planCounts[c.plan] = { count: 0, amount: 0 };
          }
          planCounts[c.plan].count++;
          planCounts[c.plan].amount += c.amount;
        });

        const planBreakdown = Object.entries(planCounts).map(([plan, data]) => ({
          plan,
          count: data.count,
          amount: data.amount,
        }));

        if (planBreakdown.length === 0) {
          planBreakdown.push({ plan: 'No conversions', count: 0, amount: 0 });
        }

        return {
          data: {
            preTeiAmount: metrics.preTEI,
            teiScore: teiScore,
            multiplier: metrics.teiMultiplier,
            finalPayout: metrics.postTEI,
            peerAverage: 31200,
            daysLeft: 6,
            planBreakdown,
            lineItems: conversions.map(c => ({
              id: c.id,
              date: c.date,
              name: c.name,
              tmid: c.tmid,
              plan: c.plan,
              amount: c.amount,
              type: c.type,
              component: c.component,
            })),
            teiMetrics: {
              connectivityRatio: 74,
              talkTimeMinutes: 185,
              idleTimeRatio: 12,
              connectivityGrade: 'A',
              talkTimeGrade: 'B',
              idleTimeGrade: 'A'
            },
            versatilityBonus: {
              processesQualified: activeProcesses >= 2 ? ['Welcome calling', 'Outbound Sales'] : [key === 'twc' ? 'Transporter Welcome' : key === 'sc' ? 'Special Categories' : 'Matchmaking'],
              bonusAmount: metrics.versatilityBonus,
              nextTierRequirement: activeProcesses >= 2 
                ? 'Qualified! Earned ₹750 versatility bonus.' 
                : 'Log conversions in 2+ processes to qualify for flat ₹750 versatility bonus.'
            },
            salaryDetails: {
              baseSalary: metrics.baseSalary,
              versatilityBonus: metrics.versatilityBonus,
              accruedIncentive: metrics.preTEI,
              teiMultiplier: metrics.teiMultiplier,
              totalTakeHome: metrics.baseSalary + metrics.versatilityBonus + metrics.postTEI
            }
          }
        };
      },
      keepUnusedDataFor: 60,
      async onCacheEntryAdded(arg, { updateCachedData, cacheEntryRemoved }) {
        if (getRoleKey(arg) === 'dwc') {
          await cacheEntryRemoved;
          return;
        }

        const unsubscribeStore = subscribe(() => {
          updateCachedData((draft) => {
            const key = getRoleKey(arg);
            const conversions = mockStore[key].conversions;
            const teiScore = mockStore[key].teiScore;

            let activeProcesses = 0;
            Object.keys(mockStore).forEach((k) => {
              if (k === 'dwc' || k === 'twc' || k === 'sc' || k === 'mm') {
                if (mockStore[k as 'dwc' | 'twc' | 'sc' | 'mm'].conversions.length > 0) {
                  activeProcesses++;
                }
              }
            });
            const versatilityActive = activeProcesses >= 2;

            const metrics = calculateIncentiveForRole(key, conversions, teiScore, versatilityActive);

            draft.preTeiAmount = metrics.preTEI;
            draft.teiScore = teiScore;
            draft.multiplier = metrics.teiMultiplier;
            draft.finalPayout = metrics.postTEI;
            
            const planCounts: Record<string, { count: number; amount: number }> = {};
            conversions.forEach(c => {
              if (!planCounts[c.plan]) {
                planCounts[c.plan] = { count: 0, amount: 0 };
              }
              planCounts[c.plan].count++;
              planCounts[c.plan].amount += c.amount;
            });
            
            draft.planBreakdown = Object.entries(planCounts).map(([plan, data]) => ({
              plan,
              count: data.count,
              amount: data.amount,
            }));
            
            if (draft.planBreakdown.length === 0) {
              draft.planBreakdown.push({ plan: 'No conversions', count: 0, amount: 0 });
            }

            draft.lineItems = conversions.map(c => ({
              id: c.id,
              date: c.date,
              name: c.name,
              tmid: c.tmid,
              plan: c.plan,
              amount: c.amount,
              type: c.type,
              component: c.component,
            }));

            draft.versatilityBonus = {
              processesQualified: activeProcesses >= 2 ? ['Welcome calling', 'Outbound Sales'] : [key === 'twc' ? 'Transporter Welcome' : key === 'sc' ? 'Special Categories' : 'Matchmaking'],
              bonusAmount: metrics.versatilityBonus,
              nextTierRequirement: activeProcesses >= 2 
                ? 'Qualified! Earned ₹750 versatility bonus.' 
                : 'Log conversions in 2+ processes to qualify for flat ₹750 versatility bonus.'
            };

            draft.salaryDetails = {
              baseSalary: metrics.baseSalary,
              versatilityBonus: metrics.versatilityBonus,
              accruedIncentive: metrics.preTEI,
              teiMultiplier: metrics.teiMultiplier,
              totalTakeHome: metrics.baseSalary + metrics.versatilityBonus + metrics.postTEI
            };
          });
        });
        await cacheEntryRemoved;
        unsubscribeStore();
      }
    }),

    getIncentiveHistory: build.query<Array<{ month: string; amount: number; tei: number }>, void>({
      queryFn: () => {
        return {
          data: [
            { month: 'Jan', amount: 28500, tei: 1.1 },
            { month: 'Feb', amount: 31000, tei: 1.2 },
            { month: 'Mar', amount: 29800, tei: 1.0 },
            { month: 'Apr', amount: 33400, tei: 1.25 },
            { month: 'May', amount: 36200, tei: 1.3 },
            { month: 'Jun (Est)', amount: 38940, tei: 1.2 },
          ]
        };
      }
    }),

    getTeamSummary: build.query<TeamMemberSummary[], string>({
      queryFn: (process) => {
        const members: TeamMemberSummary[] = [
          { id: 1, name: 'Rahul Sharma', role: 'DWC', sub_role: 'Welcome', conversions: 245, accrued: 36750, tei: 4.6, gateStatus: 'Locked', lastCallTime: '2 mins ago', trend: 'up' },
          { id: 2, name: 'Sonia Rao', role: 'DWC', sub_role: 'Welcome', conversions: 270, accrued: 40500, tei: 4.8, gateStatus: 'Unlocked', lastCallTime: 'Just now', trend: 'up' },
          { id: 3, name: 'Aman Khan', role: 'DWC', sub_role: 'Welcome', conversions: 180, accrued: 27000, tei: 3.4, gateStatus: 'Locked', lastCallTime: '12 mins ago', trend: 'down' },
          { id: 4, name: 'Priya Patel', role: 'TWC', sub_role: 'Transporter', conversions: 155, accrued: 31000, tei: 4.1, gateStatus: 'Locked', lastCallTime: '5 mins ago', trend: 'stable' },
          { id: 5, name: 'Vikram Aditya', role: 'TWC', sub_role: 'Transporter', conversions: 190, accrued: 38000, tei: 4.3, gateStatus: 'Unlocked', lastCallTime: '1 hour ago', trend: 'up' },
          { id: 6, name: 'Akash Thakur', role: 'SC', sub_role: 'Special', conversions: 110, accrued: 16500, tei: 4.2, gateStatus: 'Unlocked', lastCallTime: '3 mins ago', trend: 'stable' },
          { id: 7, name: 'Devendra Pal', role: 'MM', sub_role: 'Matchmaker', conversions: 162, accrued: 32400, tei: 4.0, gateStatus: 'Locked', lastCallTime: '18 mins ago', trend: 'up' },
          { id: 8, name: 'Suresh Yadav', role: 'MM', sub_role: 'Matchmaker', conversions: 210, accrued: 42000, tei: 4.7, gateStatus: 'Unlocked', lastCallTime: 'Just now', trend: 'up' }
        ];

        // Filter if process specified
        const filtered = process && process !== 'all' 
          ? members.filter(m => m.role.toLowerCase() === process.toLowerCase()) 
          : members;

        return { data: filtered };
      }
    }),

    getTeamParity: build.query<ProcessParity[], void>({
      queryFn: () => {
        return {
          data: [
            { processName: 'Driver Welcome (DWC)', averageIncentive: 33200, topEarner: 'Sonia Rao (₹40,500)', outliersCount: 1, outliers: ['Aman Khan (-1.8 SD)'] },
            { processName: 'Transporter Welcome (TWC)', averageIncentive: 32800, topEarner: 'Vikram Aditya (₹38,000)', outliersCount: 0, outliers: [] },
            { processName: 'Special Categories (SC)', averageIncentive: 17200, topEarner: 'Akash Thakur (₹16,500)', outliersCount: 0, outliers: [] },
            { processName: 'Matchmaking (MM)', averageIncentive: 35600, topEarner: 'Suresh Yadav (₹42,000)', outliersCount: 1, outliers: ['Suresh Yadav (+2.1 SD)'] }
          ]
        };
      }
    }),

    getRateCards: build.query<RateCard[], void>({
      queryFn: () => {
        return { data: mockStore.rateCards };
      },
      async onCacheEntryAdded(_arg, { updateCachedData, cacheEntryRemoved }) {
        const unsubscribeStore = subscribe(() => {
          updateCachedData((_draft) => {
            return mockStore.rateCards;
          });
        });
        await cacheEntryRemoved;
        unsubscribeStore();
      }
    }),

    getRateCardHistory: build.query<Array<{ id: number; date: string; user: string; action: string }>, void>({
      queryFn: () => {
        return { data: mockStore.rateCardHistory };
      },
      async onCacheEntryAdded(_arg, { updateCachedData, cacheEntryRemoved }) {
        const unsubscribeStore = subscribe(() => {
          updateCachedData((_draft) => {
            return mockStore.rateCardHistory;
          });
        });
        await cacheEntryRemoved;
        unsubscribeStore();
      }
    }),

    updateRateCard: build.mutation<boolean, { role: string; baseRate: number; bonusRate: number; gateThreshold: number; userName: string }>({
      queryFn: ({ role, baseRate, bonusRate, gateThreshold, userName }) => {
        const cardIndex = mockStore.rateCards.findIndex(rc => rc.role === role);
        if (cardIndex !== -1) {
          const oldBase = mockStore.rateCards[cardIndex].baseRate;
          const oldThreshold = mockStore.rateCards[cardIndex].gateThreshold;
          
          mockStore.rateCards[cardIndex].baseRate = baseRate;
          mockStore.rateCards[cardIndex].bonusRate = bonusRate;
          mockStore.rateCards[cardIndex].gateThreshold = gateThreshold;

          // Record action history
          mockStore.rateCardHistory.unshift({
            id: mockStore.rateCardHistory.length + 1,
            date: new Date().toISOString().split('T')[0],
            user: userName,
            action: `Updated ${role.toUpperCase()} Rate Card (Base Rate ${oldBase} -> ${baseRate}, Gate Threshold ${oldThreshold} -> ${gateThreshold})`
          });

          notify();
          return { data: true };
        }
        return { data: false };
      }
    }),

    triggerMockConversion: build.mutation<void, { role: string; planName: string }>({
      queryFn: ({ role, planName }) => {
        const key = getRoleKey(role);
        const item = getRateCardItem(key, planName);
        
        const type: 'Direct' | 'Organic' = Math.random() > 0.15 ? 'Direct' : 'Organic';
        const rate = type === 'Direct' ? item.fullRate : item.organicRate;
        
        const newRecord: ConversionRecord = {
          id: `CONV-${key.toUpperCase()}-${Date.now().toString().slice(-4)}`,
          date: new Date().toISOString().split('T')[0],
          name: key === 'twc' ? 'Vijay Transport Corp' : 'Simulated Driver Lead',
          tmid: `TM-${key.toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`,
          plan: item.label,
          amount: rate,
          type,
          component: (item as any).component,
        };

        mockStore[key].conversions.unshift(newRecord);
        
        // Recalculate combined/role metrics
        const metrics = calculateIncentiveForRole(key, mockStore[key].conversions, mockStore[key].teiScore, true);

        notify();

        // Dispatch a custom event for the conversion toast
        if (typeof window !== 'undefined') {
          const event = new CustomEvent('tm-connect-conversion', {
            detail: {
              role: key.toUpperCase(),
              planName: item.label,
              amount: rate,
              totalAccrued: metrics.totalRevenue,
              isUnlocked: metrics.gateCrossed,
              isSalaryGateUnlocked: metrics.isSalaryGateUnlocked,
              isIncentiveGateUnlocked: metrics.isIncentiveGateUnlocked
            }
          });
          window.dispatchEvent(event);
        }

        return { data: undefined };
      }
    })
  })
});

export const {
  useGetGateProgressQuery,
  useGetMonthIncentiveQuery,
  useGetIncentiveHistoryQuery,
  useGetTeamSummaryQuery,
  useGetTeamParityQuery,
  useGetRateCardsQuery,
  useGetRateCardHistoryQuery,
  useUpdateRateCardMutation,
  useTriggerMockConversionMutation
} = incentiveApi;
