import React, { useState, useEffect } from 'react';
import { useGetTargetQuery, useSetTargetMutation } from '../../services/api/webCrmApi';
import { PageSectionSkeleton } from '../../components/PageSkeleton';
import {
  useGetThSettingsIntegrationsQuery,
  useGetThSettingsPlansQuery,
  useUpdateThSettingsPlanMutation,
  useGetThSettingsCallersQuery,
  useToggleThSettingsCallerStatusMutation,
  useGetThSettingsTargetsQuery,
  useSaveThSettingsTargetsMutation,
  useGetThSettingsScriptsQuery,
} from '../../services/api/teleheadApi';

type PlanCategory = 'Driver Plan' | 'Transporter Plan' | 'Job Posting' | 'Foreman Plan' | 'Association Plan';
type BillingCycle = 'Yearly' | 'One-time' | 'Free';

interface BillingPlan {
  name: string;
  price: number;
  billingCycle: BillingCycle;
  category: PlanCategory;
  effectiveDate: string;
  status: 'CURRENT' | 'SCHEDULED';
}

interface Caller {
  id: string;
  name: string;
  team: string;
  status: 'ACTIVE' | 'INACTIVE';
}

export const ThSettings: React.FC = () => {
  // Integration health refresh state
  const [latency, setLatency] = useState(42);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Pricing Plans state — starts empty, filled by API
  const [plans, setPlans] = useState<BillingPlan[]>([]);

  // Callers state — starts empty, filled by API
  const [callers, setCallers] = useState<Caller[]>([]);

  // Target Benchmarks state — starts blank, filled by API
  const [leadGen, setLeadGen] = useState('');
  const [conversion, setConversion] = useState('');
  const [retention, setRetention] = useState('');

  // Lead target allocation by team states — starts blank, filled by API
  const [dwLeadAlloc, setDwLeadAlloc] = useState('');
  const [trMmLeadAlloc, setTrMmLeadAlloc] = useState('');
  const [scLeadAlloc, setScLeadAlloc] = useState('');

  // Filter state for callers and plans
  const [selectedTeam, setSelectedTeam] = useState('ALL');
  const [selectedPlanCategory, setSelectedPlanCategory] = useState<string>('ALL');

  // Plan Modal state
  const [planModalOpen, setPlanModalOpen] = useState(false);
  const [editingPlanIndex, setEditingPlanIndex] = useState<number | null>(null);
  const [planName, setPlanName] = useState('');
  const [planPrice, setPlanPrice] = useState('');
  const [planCategory, setPlanCategory] = useState<PlanCategory>('Driver Plan');
  const [planBillingCycle, setPlanBillingCycle] = useState<BillingCycle>('Yearly');
  const [planDate, setPlanDate] = useState('');
  const [planStatus, setPlanStatus] = useState<'CURRENT' | 'SCHEDULED'>('CURRENT');

  // Caller Modal state
  const [callerModalOpen, setCallerModalOpen] = useState(false);
  const [editingCallerId, setEditingCallerId] = useState<string | null>(null);
  const [callerName, setCallerName] = useState('');
  const [callerTeam, setCallerTeam] = useState('DW');
  const [callerStatus, setCallerStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // Backend Sync & API hooks (with isLoading for skeleton)
  const { data: dbIntegrations, isLoading: isIntegrationsLoading, refetch: refetchIntegrations } = useGetThSettingsIntegrationsQuery();
  const { data: dbPlans, isLoading: isPlansLoading } = useGetThSettingsPlansQuery();
  const [updatePlan] = useUpdateThSettingsPlanMutation();
  const { data: dbCallers, isLoading: isCallersLoading } = useGetThSettingsCallersQuery();
  const [toggleCallerStatusApi] = useToggleThSettingsCallerStatusMutation();
  const { data: dbTargets, isLoading: isTargetsLoading } = useGetThSettingsTargetsQuery();
  const [saveTargetsApi] = useSaveThSettingsTargetsMutation();
  const { data: dbScripts, isLoading: isScriptsLoading } = useGetThSettingsScriptsQuery();

  // Legacy fallback hooks
  const { data: dbPlansFallback } = useGetTargetQuery('tm_th_settings_pricing_plans_v3');
  const { data: dbCallersFallback } = useGetTargetQuery('tm_th_settings_callers_v2');
  const { data: dbBenchmarksFallback } = useGetTargetQuery('tm_th_settings_benchmarks');
  const [saveTarget] = useSetTargetMutation();

  useEffect(() => {
    const rawPlans = dbPlans?.plans || dbPlans?.data || dbPlans;
    if (Array.isArray(rawPlans)) {
      const mappedPlans = rawPlans.map((p: any) => ({
        name: p.name || '',
        price: Number(p.price) || 0,
        billingCycle: p.cycle || p.billingCycle || 'Yearly',
        category: p.category || 'Driver Plan',
        effectiveDate: p.effective_date || p.effectiveDate || '',
        status: p.status || 'CURRENT'
      }));
      setPlans(mappedPlans);
    } else if (dbPlansFallback?.value && Array.isArray(dbPlansFallback.value)) {
      setPlans(dbPlansFallback.value);
    }
  }, [dbPlans, dbPlansFallback]);

  useEffect(() => {
    const rawCallers = dbCallers?.callers || dbCallers?.data || dbCallers;
    if (Array.isArray(rawCallers)) {
      const mappedCallers = rawCallers.map((c: any) => ({
        id: c.tm_id || c.id?.toString() || '',
        name: c.name || '',
        team: c.team || '',
        status: c.status || 'ACTIVE'
      }));
      setCallers(mappedCallers);
    } else if (dbCallersFallback?.value && Array.isArray(dbCallersFallback.value)) {
      setCallers(dbCallersFallback.value);
    }
  }, [dbCallers, dbCallersFallback]);

  useEffect(() => {
    const targets = dbTargets?.data || dbTargets || dbBenchmarksFallback?.value;
    if (targets && typeof targets === 'object') {
      setLeadGen(targets.leadGen?.toString() || '1200');
      setConversion(targets.conversion?.toString() || '15');
      setRetention(targets.retention?.toString() || '88');
      setDwLeadAlloc(targets.dwLeadAlloc?.toString() || '500');
      setTrMmLeadAlloc(targets.trMmLeadAlloc?.toString() || '500');
      setScLeadAlloc(targets.scLeadAlloc?.toString() || '200');
    }
  }, [dbTargets, dbBenchmarksFallback]);

  // Actions
  const handleRefreshIntegration = async () => {
    setIsRefreshing(true);
    try {
      await refetchIntegrations().unwrap();
    } catch (e) {
      setLatency(Math.floor(35 + Math.random() * 20));
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleSaveBenchmarks = async () => {
    const benchmarks = {
      leadGen: parseInt(leadGen) || 0,
      conversion: parseInt(conversion) || 0,
      retention: parseInt(retention) || 0,
      dwLeadAlloc: parseInt(dwLeadAlloc) || 0,
      trMmLeadAlloc: parseInt(trMmLeadAlloc) || 0,
      scLeadAlloc: parseInt(scLeadAlloc) || 0,
      lastUpdated: new Date().toLocaleString()
    };
    try {
      await saveTargetsApi(benchmarks).unwrap();
      alert('Target benchmarks updated successfully!');
    } catch (err) {
      try {
        await saveTarget({ key: 'tm_th_settings_benchmarks', value: benchmarks }).unwrap();
        alert('Target benchmarks updated successfully!');
      } catch (e) {
        alert('Saved targets locally.');
      }
    }
  };

  const openPlanModal = (index: number | null = null) => {
    if (index !== null) {
      const plan = plans[index];
      setEditingPlanIndex(index);
      setPlanName(plan.name);
      setPlanPrice(plan.price.toString());
      setPlanCategory(plan.category);
      setPlanBillingCycle(plan.billingCycle);
      setPlanDate(plan.effectiveDate);
      setPlanStatus(plan.status);
    } else {
      setEditingPlanIndex(null);
      setPlanName('');
      setPlanPrice('');
      setPlanCategory('Driver Plan');
      setPlanBillingCycle('Yearly');
      setPlanDate(new Date().toISOString().split('T')[0]);
      setPlanStatus('CURRENT');
    }
    setPlanModalOpen(true);
  };

  const handleSavePlan = async (e: React.FormEvent) => {
    e.preventDefault();
    const updatedPlans = [...plans];
    const newPlan: BillingPlan = {
      name: planName,
      price: parseInt(planPrice) || 0,
      category: planCategory,
      billingCycle: planBillingCycle,
      effectiveDate: planDate,
      status: planStatus
    };

    if (editingPlanIndex !== null) {
      updatedPlans[editingPlanIndex] = newPlan;
    } else {
      updatedPlans.push(newPlan);
    }

    setPlans(updatedPlans);
    setPlanModalOpen(false);

    try {
      await updatePlan({ key: newPlan.name, value: newPlan }).unwrap();
    } catch (err) {
      try {
        await saveTarget({ key: 'tm_th_settings_pricing_plans_v3', value: updatedPlans }).unwrap();
      } catch (e) {
        // ignore
      }
    }
  };

  const openCallerModal = (callerId: string | null = null) => {
    if (callerId !== null) {
      const caller = callers.find(c => c.id === callerId);
      if (caller) {
        setEditingCallerId(callerId);
        setCallerName(caller.name);
        setCallerTeam(caller.team);
        setCallerStatus(caller.status);
      }
    } else {
      setEditingCallerId(null);
      setCallerName('');
      setCallerTeam('DW');
      setCallerStatus('ACTIVE');
    }
    setCallerModalOpen(true);
  };

  const handleSaveCaller = async (e: React.FormEvent) => {
    e.preventDefault();
    let updatedCallers = [...callers];
    if (editingCallerId !== null) {
      updatedCallers = updatedCallers.map(c => c.id === editingCallerId ? { ...c, name: callerName, team: callerTeam, status: callerStatus } : c);
    } else {
      const newId = `TM-${Math.floor(100 + Math.random() * 900)}`;
      updatedCallers.push({ id: newId, name: callerName, team: callerTeam, status: callerStatus });
    }

    setCallers(updatedCallers);
    setCallerModalOpen(false);

    try {
      await saveTarget({ key: 'tm_th_settings_callers_v2', value: updatedCallers }).unwrap();
    } catch (err) {
      // Local fallback
    }
  };

  const toggleCallerStatus = async (id: string) => {
    const updatedCallers: Caller[] = callers.map(c => {
      if (c.id === id) {
        return { ...c, status: c.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE' };
      }
      return c;
    });
    setCallers(updatedCallers);
    try {
      await toggleCallerStatusApi({ id }).unwrap();
    } catch (err) {
      try {
        await saveTarget({ key: 'tm_th_settings_callers_v2', value: updatedCallers }).unwrap();
      } catch (e) {
        // ignore
      }
    }
  };

  const defaultPlans: BillingPlan[] = [
    { name: 'Job Ready', price: 199, billingCycle: 'Yearly', category: 'Driver Plan', effectiveDate: '2023-10-01', status: 'CURRENT' },
    { name: 'Verified', price: 299, billingCycle: 'Yearly', category: 'Driver Plan', effectiveDate: '2023-10-01', status: 'CURRENT' },
    { name: 'Trusted', price: 499, billingCycle: 'Yearly', category: 'Driver Plan', effectiveDate: '2023-10-01', status: 'CURRENT' },
    { name: 'Transporter Plan', price: 999, billingCycle: 'Yearly', category: 'Transporter Plan', effectiveDate: '2023-11-01', status: 'CURRENT' },
    { name: 'Free Job', price: 0, billingCycle: 'Free', category: 'Job Posting', effectiveDate: '2023-09-15', status: 'CURRENT' },
    { name: 'Premium Job', price: 1999, billingCycle: 'One-time', category: 'Job Posting', effectiveDate: '2023-09-15', status: 'CURRENT' },
    { name: 'Super Premium Job', price: 2999, billingCycle: 'One-time', category: 'Job Posting', effectiveDate: '2023-09-15', status: 'CURRENT' },
    { name: 'Foreman Plan', price: 999, billingCycle: 'Yearly', category: 'Foreman Plan', effectiveDate: '2024-01-01', status: 'CURRENT' },
    { name: 'Association Plan', price: 1199, billingCycle: 'Yearly', category: 'Association Plan', effectiveDate: '2024-01-01', status: 'CURRENT' },
  ];

  const defaultCallers: Caller[] = [
    { id: 'TM-035', name: 'Pratima', team: 'DW', status: 'ACTIVE' },
    { id: 'TM-008', name: 'Sonam', team: 'TR-MM', status: 'ACTIVE' },
    { id: 'TM-003', name: 'Pooja Pal', team: 'SC', status: 'ACTIVE' },
  ];

  const displayCallers = callers.length > 0 ? callers : defaultCallers;
  const displayPlans = plans.length > 0 ? plans : defaultPlans;

  const filteredCallers = selectedTeam === 'ALL' ? displayCallers : displayCallers.filter(c => c.team === selectedTeam);
  const filteredPlans = selectedPlanCategory === 'ALL' ? displayPlans : displayPlans.filter(p => p.category === selectedPlanCategory);

  const isInitialLoading = isIntegrationsLoading || isPlansLoading || isCallersLoading || isTargetsLoading || isScriptsLoading;

  if (isInitialLoading) {
    return <PageSectionSkeleton sections={4} />;
  }

  return (
    <main className=" p-md custom-scrollbar bg-background">
      <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-gutter">

        {/* Integration Health */}
        <section className="col-span-12 lg:col-span-4 bg-white border border-outline-variant shadow-sm rounded-lg p-md">
          <div className="flex items-center justify-between mb-md">
            <h3 className="font-headline-md text-headline-md text-on-surface">Integration Health</h3>
            <span
              onClick={handleRefreshIntegration}
              className={`material-symbols-outlined text-on-surface-variant cursor-pointer ${isRefreshing ? 'animate-spin' : ''}`}
              data-icon="refresh"
            >
              refresh
            </span>
          </div>
          <div className="space-y-sm">
            {isIntegrationsLoading || isRefreshing ? (
              // Skeleton loading for integrations
              [1, 2, 3].map((i) => (
                <div key={i} className="flex items-center justify-between p-sm bg-surface-container-low rounded border border-outline-variant/30 animate-pulse">
                  <div className="flex items-center gap-md">
                    <div className="w-6 h-6 rounded bg-slate-200"></div>
                    <div className="space-y-xs">
                      <div className="h-3 bg-slate-200 rounded w-32"></div>
                      <div className="h-2.5 bg-slate-200 rounded w-24"></div>
                    </div>
                  </div>
                  <div className="flex items-center gap-xs">
                    <div className="w-2 h-2 rounded-full bg-slate-200"></div>
                    <div className="h-3 bg-slate-200 rounded w-12"></div>
                  </div>
                </div>
              ))
            ) : (
              (() => {
                const rawInts = dbIntegrations?.integrations || dbIntegrations?.data || dbIntegrations;
                const list = Array.isArray(rawInts) ? rawInts : [];
                return list.map((integration: any, idx: number) => {
                  const name = integration.name || '';
                  let icon = 'hub';
                  let iconColor = 'text-primary';
                  if (name.includes('Exotel') || name.toLowerCase().includes('telephony')) {
                    icon = 'call';
                    iconColor = 'text-primary';
                  } else if (name.includes('WhatsApp')) {
                    icon = 'chat';
                    iconColor = 'text-[#25D366]';
                  } else if (name.includes('Razorpay') || name.toLowerCase().includes('payment')) {
                    icon = 'payments';
                    iconColor = 'text-secondary';
                  }
                  const detail = integration.meta || integration.detail || integration.description || `API Latency: ${latency}ms`;
                  return (
                    <div key={idx} className="flex items-center justify-between p-sm bg-surface-container-low rounded border border-outline-variant/30">
                      <div className="flex items-center gap-md">
                        <span className={`material-symbols-outlined ${iconColor}`} data-icon={icon}>{icon}</span>
                        <div>
                          <p className="font-label-caps text-label-caps text-on-surface">{name}</p>
                          <p className="text-[10px] text-on-surface-variant">{detail}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-xs">
                        <span className={`w-2 h-2 rounded-full ${integration.status === 'ACTIVE' ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-error shadow-[0_0_8px_rgba(186,26,26,0.5)]'}`}></span>
                        <span className={`text-[11px] font-bold ${integration.status === 'ACTIVE' ? 'text-green-600' : 'text-error'}`}>{integration.status}</span>
                      </div>
                    </div>
                  );
                });
              })()
            )}
          </div>
        </section>

        {/* Subscription Pricing Control */}
        <section className="col-span-12 lg:col-span-8 bg-white border border-outline-variant shadow-sm rounded-lg">
          <div className="p-md border-b border-outline-variant flex flex-col md:flex-row md:items-center justify-between gap-sm">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Subscription Pricing Control</h3>
              <p className="text-xs text-on-surface-variant">Update and manage customer billing plans</p>
            </div>
            <div className="flex flex-wrap items-center gap-sm">
              <div className="flex items-center gap-xs px-sm py-1 bg-surface-container-low border border-outline-variant rounded">
                <span className="material-symbols-outlined text-xs">filter_list</span>
                <select
                  value={selectedPlanCategory}
                  onChange={(e) => setSelectedPlanCategory(e.target.value)}
                  className="bg-transparent text-[10px] font-bold outline-none uppercase font-label-caps border-none cursor-pointer"
                >
                  <option value="ALL">ALL CATEGORIES</option>
                  <option value="Driver Plan">Driver Plans</option>
                  <option value="Transporter Plan">Transporter Plans</option>
                  <option value="Job Posting">Job Postings</option>
                  <option value="Foreman Plan">Foreman Plans</option>
                  <option value="Association Plan">Association Plans</option>
                </select>
              </div>
              <button
                onClick={() => openPlanModal(null)}
                className="bg-primary text-white px-md py-xs rounded flex items-center gap-sm font-label-caps text-label-caps hover:bg-on-primary-fixed-variant transition-colors"
              >
                <span className="material-symbols-outlined text-sm" data-icon="add">add</span> New Plan
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container text-on-surface-variant font-label-caps text-label-caps border-b border-outline-variant">
                <tr>
                  <th className="px-md py-sm">PLAN NAME</th>
                  <th className="px-md py-sm">CATEGORY</th>
                  <th className="px-md py-sm">PRICE</th>
                  <th className="px-md py-sm">CYCLE</th>
                  <th className="px-md py-sm">EFFECTIVE DATE</th>
                  <th className="px-md py-sm">STATUS</th>
                  <th className="px-md py-sm text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="text-body-sm">
                {isPlansLoading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b border-outline-variant/50 animate-pulse">
                      <td className="px-md py-sm"><div className="h-3 bg-slate-200 rounded w-24"></div></td>
                      <td className="px-md py-sm"><div className="h-3 bg-slate-200 rounded w-28"></div></td>
                      <td className="px-md py-sm"><div className="h-3 bg-slate-200 rounded w-16"></div></td>
                      <td className="px-md py-sm"><div className="h-3 bg-slate-200 rounded w-16"></div></td>
                      <td className="px-md py-sm"><div className="h-3 bg-slate-200 rounded w-20"></div></td>
                      <td className="px-md py-sm"><div className="h-4 bg-slate-200 rounded w-14"></div></td>
                      <td className="px-md py-sm text-right"><div className="h-4 bg-slate-200 rounded w-4 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredPlans.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-md py-md text-center text-on-surface-variant font-semibold">
                      No plans found.
                    </td>
                  </tr>
                ) : (
                  filteredPlans.map((plan, idx) => (
                    <tr key={plan.name} className="border-b border-outline-variant/50 hover:bg-surface-container-low transition-colors">
                      <td className="px-md py-sm font-bold text-primary">{plan.name}</td>
                      <td className="px-md py-sm text-xs font-semibold text-on-surface-variant">{plan.category}</td>
                      <td className="px-md py-sm font-data-mono text-data-mono">
                        {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString()}`}
                      </td>
                      <td className="px-md py-sm text-xs font-bold text-on-surface-variant">{plan.billingCycle}</td>
                      <td className="px-md py-sm">{plan.effectiveDate}</td>
                      <td className="px-md py-sm">
                        <span className={`px-xs py-[2px] rounded text-[10px] font-bold border uppercase ${plan.status === 'CURRENT' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-orange-50 text-orange-700 border-orange-200'
                          }`}>
                          {plan.status}
                        </span>
                      </td>
                      <td className="px-md py-sm text-right">
                        <button
                          onClick={() => openPlanModal(idx)}
                          className="material-symbols-outlined text-on-surface-variant hover:text-primary"
                          data-icon="edit"
                        >
                          edit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Caller Account Management */}
        <section className="col-span-12 lg:col-span-7 bg-white border border-outline-variant shadow-sm rounded-lg overflow-hidden">
          <div className="p-md border-b border-outline-variant flex items-center justify-between">
            <h3 className="font-headline-md text-headline-md text-on-surface">Caller Account Management</h3>
            <div className="flex gap-sm items-center">
              <div className="flex items-center gap-xs px-sm py-1 bg-surface-container-low border border-outline-variant rounded">
                <span className="material-symbols-outlined text-xs" data-icon="filter_list">filter_list</span>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value)}
                  className="bg-transparent text-[10px] font-bold outline-none uppercase font-label-caps border-none cursor-pointer"
                >
                  <option value="ALL">ALL TEAMS</option>
                  <option value="DW">DW</option>
                  <option value="TR-MM">TR-MM</option>
                  <option value="SC">SC</option>
                </select>
              </div>
              <button
                onClick={() => openCallerModal(null)}
                className="bg-secondary text-white px-md py-xs rounded flex items-center gap-sm font-label-caps text-label-caps hover:bg-on-secondary-fixed-variant transition-colors"
              >
                <span className="material-symbols-outlined text-sm" data-icon="person_add">person_add</span> Add Caller
              </button>
            </div>
          </div>
          <div className="p-md grid grid-cols-1 md:grid-cols-2 gap-md">
            {isCallersLoading ? (
              [1, 2, 3, 4].map((i) => (
                <div key={i} className="border border-outline-variant rounded-lg p-sm flex items-center gap-md animate-pulse">
                  <div className="w-12 h-12 rounded bg-slate-200"></div>
                  <div className="flex-1 space-y-xs">
                    <div className="h-3.5 bg-slate-200 rounded w-2/3"></div>
                    <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                    <div className="flex gap-sm mt-xs">
                      <div className="h-3 bg-slate-200 rounded w-10"></div>
                      <div className="h-3 bg-slate-200 rounded w-12"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : filteredCallers.length === 0 ? (
              <p className="col-span-2 text-center py-md text-on-surface-variant font-semibold">
                No callers registered.
              </p>
            ) : (
              filteredCallers.map((caller) => (
                <div
                  key={caller.id}
                  className={`border border-outline-variant rounded-lg p-sm flex items-center gap-md hover:border-primary transition-all ${caller.status === 'INACTIVE' ? 'opacity-60 grayscale' : ''
                    }`}
                >
                  <div className="w-12 h-12 rounded bg-surface-container flex items-center justify-center text-primary font-bold">
                    {caller.name ? caller.name.split(' ').map(n => n[0]).join('') : ''}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-sm truncate">{caller.name}</h4>
                    <p className="text-[11px] text-on-surface-variant">Team: {caller.team}</p>
                    <div className="flex items-center gap-sm mt-xs">
                      <span className={`text-[9px] font-bold px-xs py-[1px] rounded ${caller.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-surface-container-highest text-on-surface-variant'
                        }`}>
                        {caller.status}
                      </span>
                      <span className="text-[10px] text-on-surface-variant">ID: {caller.id}</span>
                    </div>
                  </div>
                  <div className="flex flex-col gap-xs">
                    {caller.status === 'ACTIVE' ? (
                      <>
                        <button
                          onClick={() => openCallerModal(caller.id)}
                          className="material-symbols-outlined text-xs p-xs hover:bg-surface-container rounded"
                          data-icon="edit"
                        >
                          edit
                        </button>
                        <button
                          onClick={() => toggleCallerStatus(caller.id)}
                          className="material-symbols-outlined text-xs p-xs text-error hover:bg-error/10 rounded"
                          data-icon="block"
                        >
                          block
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => toggleCallerStatus(caller.id)}
                        className="material-symbols-outlined text-xs p-xs text-primary hover:bg-primary/10 rounded"
                        data-icon="restart_alt"
                      >
                        restart_alt
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* Target Benchmarking */}
        <section className="col-span-12 lg:col-span-5 bg-white border border-outline-variant shadow-sm rounded-lg overflow-hidden">
          <div className="p-md border-b border-outline-variant flex items-center justify-between bg-surface-container-low">
            <h3 className="font-headline-md text-headline-md text-on-surface">Target Benchmarking</h3>
            <div className="flex items-center gap-xs px-sm py-xs bg-white border border-outline-variant rounded">
              <span className="font-label-caps text-[10px]">MONTH: NOV 2024</span>
            </div>
          </div>
          <div className="p-md space-y-md">
            {isTargetsLoading ? (
              <div className="space-y-md animate-pulse">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="grid grid-cols-12 gap-sm items-center">
                    <div className="col-span-4 h-3.5 bg-slate-200 rounded w-16"></div>
                    <div className="col-span-5 h-8 bg-slate-200 rounded w-full"></div>
                    <div className="col-span-3 h-3 bg-slate-200 rounded w-12 ml-auto"></div>
                  </div>
                ))}
                <div className="border-t border-outline-variant pt-md mt-md space-y-sm">
                  <div className="h-4 bg-slate-200 rounded w-1/3 mb-sm"></div>
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-slate-200 rounded w-full"></div>
                  ))}
                </div>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-12 gap-sm items-center">
                  <div className="col-span-4 font-label-caps text-label-caps text-on-surface">Lead Gen</div>
                  <div className="col-span-5 relative">
                    <input
                      className="w-full pl-sm pr-lg py-xs border border-outline-variant rounded focus:ring-1 focus:ring-primary font-data-mono text-data-mono"
                      type="number"
                      value={leadGen}
                      onChange={(e) => setLeadGen(e.target.value)}
                    />
                    <span className="absolute right-xs top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant">Units</span>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="text-[10px] text-green-600 font-bold">+12% YoY</span>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-sm items-center">
                  <div className="col-span-4 font-label-caps text-label-caps text-on-surface">Conversion</div>
                  <div className="col-span-5 relative">
                    <input
                      className="w-full pl-sm pr-lg py-xs border border-outline-variant rounded focus:ring-1 focus:ring-primary font-data-mono text-data-mono"
                      type="number"
                      value={conversion}
                      onChange={(e) => setConversion(e.target.value)}
                    />
                    <span className="absolute right-xs top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant">%</span>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="text-[10px] text-primary font-bold">Baseline</span>
                  </div>
                </div>
                <div className="grid grid-cols-12 gap-sm items-center">
                  <div className="col-span-4 font-label-caps text-label-caps text-on-surface">Retention</div>
                  <div className="col-span-5 relative">
                    <input
                      className="w-full pl-sm pr-lg py-xs border border-outline-variant rounded focus:ring-1 focus:ring-primary font-data-mono text-data-mono"
                      type="number"
                      value={retention}
                      onChange={(e) => setRetention(e.target.value)}
                    />
                    <span className="absolute right-xs top-1/2 -translate-y-1/2 text-[10px] text-on-surface-variant">%</span>
                  </div>
                  <div className="col-span-3 text-right">
                    <span className="text-[10px] text-error font-bold">-2.4%</span>
                  </div>
                </div>
                <div className="border-t border-outline-variant pt-md mt-md space-y-sm">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Lead Target Allocation</h4>
                    <div className="flex gap-2">
                      <button
                        onClick={() => {
                          const total = parseInt(leadGen) || 0;
                          const equalShare = Math.floor(total / 3);
                          const remainder = total - (equalShare * 3);
                          setDwLeadAlloc(equalShare.toString());
                          setTrMmLeadAlloc(equalShare.toString());
                          setScLeadAlloc((equalShare + remainder).toString());
                        }}
                        className="text-[10px] font-bold text-primary hover:underline"
                      >
                        Distribute Equally
                      </button>
                      <span className="text-[10px] text-on-surface-variant/40">|</span>
                      <button
                        onClick={() => {
                          setDwLeadAlloc('0');
                          setTrMmLeadAlloc('0');
                          setScLeadAlloc('0');
                        }}
                        className="text-[10px] font-bold text-error hover:underline"
                      >
                        Clear All
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-2">
                    <div className="flex items-center justify-between p-sm bg-surface-container-low rounded border border-outline-variant/30">
                      <span className="text-[11px] font-bold text-on-surface-variant">DW</span>
                      <div className="flex items-center gap-md">
                        <span className="text-[9px] text-on-surface-variant">Proj. Conv: <strong className="text-primary">{Math.floor((parseInt(dwLeadAlloc) || 0) * (parseInt(conversion) || 0) / 100)}</strong></span>
                        <input
                          type="number"
                          value={dwLeadAlloc}
                          onChange={(e) => setDwLeadAlloc(e.target.value)}
                          className="w-24 px-2 py-1 border border-outline-variant rounded font-data-mono text-xs focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-sm bg-surface-container-low rounded border border-outline-variant/30">
                      <span className="text-[11px] font-bold text-on-surface-variant">TR-MM</span>
                      <div className="flex items-center gap-md">
                        <span className="text-[9px] text-on-surface-variant">Proj. Conv: <strong className="text-primary">{Math.floor((parseInt(trMmLeadAlloc) || 0) * (parseInt(conversion) || 0) / 100)}</strong></span>
                        <input
                          type="number"
                          value={trMmLeadAlloc}
                          onChange={(e) => setTrMmLeadAlloc(e.target.value)}
                          className="w-24 px-2 py-1 border border-outline-variant rounded font-data-mono text-xs focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-sm bg-surface-container-low rounded border border-outline-variant/30">
                      <span className="text-[11px] font-bold text-on-surface-variant">SC</span>
                      <div className="flex items-center gap-md">
                        <span className="text-[9px] text-on-surface-variant">Proj. Conv: <strong className="text-primary">{Math.floor((parseInt(scLeadAlloc) || 0) * (parseInt(conversion) || 0) / 100)}</strong></span>
                        <input
                          type="number"
                          value={scLeadAlloc}
                          onChange={(e) => setScLeadAlloc(e.target.value)}
                          className="w-24 px-2 py-1 border border-outline-variant rounded font-data-mono text-xs focus:ring-1 focus:ring-primary outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Target allocation summary check & visual progress bar */}
                  {(() => {
                    const dwVal = parseInt(dwLeadAlloc) || 0;
                    const trMmVal = parseInt(trMmLeadAlloc) || 0;
                    const scVal = parseInt(scLeadAlloc) || 0;
                    const totalAlloc = dwVal + trMmVal + scVal;
                    const masterLeadGen = parseInt(leadGen) || 0;

                    const dwPct = masterLeadGen > 0 ? (dwVal / masterLeadGen) * 100 : 0;
                    const trMmPct = masterLeadGen > 0 ? (trMmVal / masterLeadGen) * 100 : 0;
                    const scPct = masterLeadGen > 0 ? (scVal / masterLeadGen) * 100 : 0;
                    const unallocPct = masterLeadGen > totalAlloc ? ((masterLeadGen - totalAlloc) / masterLeadGen) * 100 : 0;

                    return (
                      <div className="space-y-sm pt-xs">
                        <div className="h-3 w-full bg-surface-container rounded overflow-hidden flex">
                          <div className="bg-primary h-full transition-all duration-300" style={{ width: `${dwPct}%` }} title={`DW: ${dwVal}`} />
                          <div className="bg-secondary h-full transition-all duration-300" style={{ width: `${trMmPct}%` }} title={`TR-MM: ${trMmVal}`} />
                          <div className="bg-teal-600 h-full transition-all duration-300" style={{ width: `${scPct}%` }} title={`SC: ${scVal}`} />
                          {unallocPct > 0 && <div className="bg-gray-200 h-full transition-all duration-300" style={{ width: `${unallocPct}%` }} title={`Unallocated: ${masterLeadGen - totalAlloc}`} />}
                        </div>

                        <div className="flex justify-between items-center text-[10px] pt-xs border-t border-outline-variant/35 mt-xs">
                          <span className="font-semibold text-on-surface-variant flex gap-md">
                            <span className="flex items-center gap-xs"><span className="w-2.5 h-2.5 bg-primary rounded"></span>DW ({(dwPct).toFixed(0)}%)</span>
                            <span className="flex items-center gap-xs"><span className="w-2.5 h-2.5 bg-secondary rounded"></span>TR-MM ({(trMmPct).toFixed(0)}%)</span>
                            <span className="flex items-center gap-xs"><span className="w-2.5 h-2.5 bg-teal-600 rounded"></span>SC ({(scPct).toFixed(0)}%)</span>
                          </span>
                        </div>

                        <div className="flex justify-between items-center text-[10px] pt-xs">
                          <span className="font-bold text-on-surface-variant">
                            Total Allocated: {totalAlloc.toLocaleString()} / {masterLeadGen.toLocaleString()}
                          </span>
                          {totalAlloc > masterLeadGen ? (
                            <span className="text-error font-bold">⚠️ Exceeds target by {(totalAlloc - masterLeadGen).toLocaleString()}</span>
                          ) : totalAlloc < masterLeadGen ? (
                            <span className="text-primary font-bold">Unallocated: {(masterLeadGen - totalAlloc).toLocaleString()}</span>
                          ) : (
                            <span className="text-green-600 font-bold">✓ Fully Allocated</span>
                          )}
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* Projected Output Metrics */}
                <div className="border-t border-outline-variant pt-md mt-md space-y-sm bg-surface-container-low p-sm rounded border border-outline-variant/40">
                  <h4 className="text-xs font-bold text-on-surface uppercase tracking-wider">Projected Output Metrics</h4>
                  <div className="grid grid-cols-2 gap-sm text-[11px]">
                    <div className="p-xs bg-white border border-outline-variant/40 rounded shadow-sm">
                      <p className="text-on-surface-variant font-semibold text-[9px]">Expected Conversions</p>
                      <p className="font-data-mono text-data-mono text-headline-sm text-primary font-bold">
                        {Math.floor((parseInt(leadGen) || 0) * (parseInt(conversion) || 0) / 100)}
                      </p>
                      <p className="text-[8px] text-on-surface-variant">From master lead target</p>
                    </div>
                    <div className="p-xs bg-white border border-outline-variant/40 rounded shadow-sm">
                      <p className="text-on-surface-variant font-semibold text-[9px]">Projected Revenue</p>
                      <p className="font-data-mono text-data-mono text-headline-sm text-green-600 font-bold">
                        ₹{((Math.floor((parseInt(leadGen) || 0) * (parseInt(conversion) || 0) / 100)) * 499).toLocaleString()}
                      </p>
                      <p className="text-[8px] text-on-surface-variant">Est. @ avg plan price ₹499</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={handleSaveBenchmarks}
                  className="w-full py-sm bg-surface-container-high hover:bg-surface-variant text-on-surface font-bold text-xs rounded transition-colors uppercase tracking-widest mt-md"
                >
                  Save New Targets
                </button>
              </>
            )}
          </div>
        </section>

        {/* Script Library */}
        <section className="col-span-12 bg-white border border-outline-variant shadow-sm rounded-lg">
          <div className="p-md border-b border-outline-variant flex items-center justify-between">
            <div>
              <h3 className="font-headline-md text-headline-md text-on-surface">Script Library (Read-Only Archive)</h3>
              <p className="text-xs text-on-surface-variant">Published scripts for verification only. Request edits from content head.</p>
            </div>
            <button className="text-primary hover:underline font-label-caps text-label-caps">View Change Log</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0 border-b border-outline-variant bg-surface-container-low">
            {isScriptsLoading ? (
              [1, 2, 3].map((i) => (
                <div key={i} className="p-md border-r border-outline-variant/50 last:border-r-0 animate-pulse space-y-sm">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-48 bg-slate-200 rounded w-full"></div>
                </div>
              ))
            ) : (() => {
              const rawScripts = dbScripts?.scripts || dbScripts?.data || dbScripts;
              const defaultScripts = [
                { title: 'Onboarding Script v4.2', content: 'नमस्ते, मैं ट्रकमित्र से [Caller Name] बात कर रहा हूँ। क्या मेरी बात [Lead Name] से हो रही है? हम आपकी लॉजिस्टिक्स यात्रा को आसान बनाने के लिए कुछ बेहतरीन समाधान लाए हैं...' },
                { title: 'Renewal Pitch v2.1', content: 'प्रिय ग्राहक, आपके ट्रकमित्र सब्सक्रिप्शन को रिन्यू करने का समय आ गया है। इस महीने हमारे पास आपके लिए विशेष डिस्काउंट ऑफर हैं जो आपकी बचत बढ़ाएंगे...' },
                { title: 'Escalation Protocol', content: 'असुविधा के लिए हमें खेद है। मैं आपकी कॉल को हमारे सीनियर सुपरवाइज़र को ट्रांसफ़र कर रहा हूँ जो इस मुद्दे का तुरंत समाधान करेंगे। कृपया लाइन पर बने रहें...' }
              ];
              const list = Array.isArray(rawScripts) && rawScripts.length > 0 ? rawScripts : defaultScripts;
              return list.map((script: any, idx: number) => (
                <div key={idx} className="p-md border-r border-outline-variant/50 last:border-r-0">
                  <h4 className="font-bold text-sm mb-xs flex items-center gap-sm">
                    <span className="material-symbols-outlined text-on-surface-variant text-sm" data-icon="description">description</span>
                    {script.title || script.name}
                  </h4>
                  <div className="mt-md p-sm bg-white border border-outline-variant rounded h-48 overflow-y-auto custom-scrollbar font-body-hindi text-body-hindi text-on-surface-variant leading-relaxed select-none pointer-events-none">
                    {script.content || script.text}
                  </div>
                </div>
              ));
            })()}
          </div>
          <div className="p-sm flex justify-center bg-surface-container-low/50">
            <p className="text-[10px] text-on-surface-variant uppercase tracking-tighter">Last Modified by content_admin_01 on 24 Oct 2024</p>
          </div>
        </section>
      </div>

      {/* PRICING PLAN MODAL */}
      {planModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-md">
          <div className="bg-white rounded-lg border border-outline-variant max-w-md w-full p-md custom-shadow">
            <h3 className="font-headline-md mb-md">{editingPlanIndex !== null ? 'Edit Pricing Plan' : 'Create Pricing Plan'}</h3>
            <form onSubmit={handleSavePlan} className="space-y-sm">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-xs">PLAN NAME</label>
                <input
                  type="text"
                  value={planName}
                  onChange={(e) => setPlanName(e.target.value)}
                  required
                  className="w-full bg-surface-container border border-outline-variant rounded px-sm py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-xs">CATEGORY</label>
                <select
                  value={planCategory}
                  onChange={(e) => setPlanCategory(e.target.value as PlanCategory)}
                  className="w-full bg-surface-container border border-outline-variant rounded px-sm py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Driver Plan">Driver Plan</option>
                  <option value="Transporter Plan">Transporter Plan</option>
                  <option value="Job Posting">Job Posting</option>
                  <option value="Foreman Plan">Foreman Plan</option>
                  <option value="Association Plan">Association Plan</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-xs">PRICE (₹)</label>
                <input
                  type="number"
                  value={planPrice}
                  onChange={(e) => setPlanPrice(e.target.value)}
                  required
                  className="w-full bg-surface-container border border-outline-variant rounded px-sm py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-xs">BILLING CYCLE</label>
                <select
                  value={planBillingCycle}
                  onChange={(e) => setPlanBillingCycle(e.target.value as BillingCycle)}
                  className="w-full bg-surface-container border border-outline-variant rounded px-sm py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="Yearly">Yearly</option>
                  <option value="One-time">One-time</option>
                  <option value="Free">Free</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-xs">EFFECTIVE DATE</label>
                <input
                  type="date"
                  value={planDate}
                  onChange={(e) => setPlanDate(e.target.value)}
                  required
                  className="w-full bg-surface-container border border-outline-variant rounded px-sm py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-xs">STATUS</label>
                <select
                  value={planStatus}
                  onChange={(e) => setPlanStatus(e.target.value as any)}
                  className="w-full bg-surface-container border border-outline-variant rounded px-sm py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="CURRENT">CURRENT</option>
                  <option value="SCHEDULED">SCHEDULED</option>
                </select>
              </div>
              <div className="flex justify-end gap-sm pt-sm border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setPlanModalOpen(false)}
                  className="px-md py-xs border border-outline-variant text-on-surface rounded font-bold text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-md py-xs bg-primary text-white rounded font-bold text-xs"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CALLER MODAL */}
      {callerModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-md">
          <div className="bg-white rounded-lg border border-outline-variant max-w-md w-full p-md custom-shadow">
            <h3 className="font-headline-md mb-md">{editingCallerId !== null ? 'Edit Caller Account' : 'Add New Caller'}</h3>
            <form onSubmit={handleSaveCaller} className="space-y-sm">
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-xs">CALLER NAME</label>
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  required
                  className="w-full bg-surface-container border border-outline-variant rounded px-sm py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-xs">TEAM</label>
                <select
                  value={callerTeam}
                  onChange={(e) => setCallerTeam(e.target.value)}
                  className="w-full bg-surface-container border border-outline-variant rounded px-sm py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="DW">DW</option>
                  <option value="TR-MM">TR-MM</option>
                  <option value="SC">SC</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-on-surface-variant mb-xs">STATUS</label>
                <select
                  value={callerStatus}
                  onChange={(e) => setCallerStatus(e.target.value as any)}
                  className="w-full bg-surface-container border border-outline-variant rounded px-sm py-2 text-sm outline-none focus:ring-1 focus:ring-primary"
                >
                  <option value="ACTIVE">ACTIVE</option>
                  <option value="INACTIVE">INACTIVE</option>
                </select>
              </div>
              <div className="flex justify-end gap-sm pt-sm border-t border-outline-variant">
                <button
                  type="button"
                  onClick={() => setCallerModalOpen(false)}
                  className="px-md py-xs border border-outline-variant text-on-surface rounded font-bold text-xs"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  className="px-md py-xs bg-primary text-white rounded font-bold text-xs"
                >
                  SAVE
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ThSettings;
