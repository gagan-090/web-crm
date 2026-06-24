import React, { useState, useEffect } from 'react';
import { useGetTargetQuery, useSetTargetMutation } from '../../services/api/webCrmApi';

interface Campaign {
  id: string;
  name: string;
  targetRole: 'DW' | 'TR' | 'MM' | 'SC';
  status: 'Active' | 'Paused' | 'Completed' | 'Scheduled';
  activeCallers: number;
  totalLeads: number;
  connectedLeads: number;
  conversionRate: number;
  startDate: string;
}

export const ThGlobalCampaignConsole: React.FC = () => {
  const [consoleTab, setConsoleTab] = useState<'CAMPAIGNS' | 'QUEUE' | 'ANALYTICS' | 'QUALITY' | 'SPEND_ROI' | 'OVERRIDE_LOG' | 'TARGETS'>('CAMPAIGNS');

  // Backend target sync
  const { data: adminTargetsData } = useGetTargetQuery('tm_admin_th_targets');
  const { data: tlTargetsData } = useGetTargetQuery('tm_th_tl_targets');
  const [saveTarget] = useSetTargetMutation();

  // Target delegation states
  const [adminSalesTarget, setAdminSalesTarget] = useState(1000000);
  const [adminCampaignTarget, setAdminCampaignTarget] = useState(5000);

  const [tldwSalesInput, setTldwSalesInput] = useState('400000');
  const [tldwCampaignInput, setTldwCampaignInput] = useState('2500');
  const [tlwctSalesInput, setTlwctSalesInput] = useState('600000');
  const [tlwctCampaignInput, setTlwctCampaignInput] = useState('2500');

  useEffect(() => {
    if (adminTargetsData?.value) {
      setAdminSalesTarget(adminTargetsData.value.salesTarget || 1000000);
      setAdminCampaignTarget(adminTargetsData.value.campaignTarget || 5000);
    }
  }, [adminTargetsData]);

  useEffect(() => {
    if (tlTargetsData?.value) {
      setTldwSalesInput(tlTargetsData.value.tldwSalesTarget.toString());
      setTldwCampaignInput(tlTargetsData.value.tldwCampaignTarget.toString());
      setTlwctSalesInput(tlTargetsData.value.tlwctSalesTarget.toString());
      setTlwctCampaignInput(tlTargetsData.value.tlwctCampaignTarget.toString());
    }
  }, [tlTargetsData]);

  const handlePublishTlTargets = async (e: React.FormEvent) => {
    e.preventDefault();
    const tldwS = parseFloat(tldwSalesInput);
    const tldwC = parseInt(tldwCampaignInput);
    const tlwctS = parseFloat(tlwctSalesInput);
    const tlwctC = parseInt(tlwctCampaignInput);

    if (isNaN(tldwS) || isNaN(tldwC) || isNaN(tlwctS) || isNaN(tlwctC)) {
      alert('Please enter valid numeric values');
      return;
    }

    if (tldwS + tlwctS > adminSalesTarget) {
      alert(`Warning: The sum of TL sales targets (₹${(tldwS + tlwctS).toLocaleString()}) exceeds your master target of ₹${adminSalesTarget.toLocaleString()} set by System Admin!`);
      return;
    }
    if (tldwC + tlwctC > adminCampaignTarget) {
      alert(`Warning: The sum of TL campaign targets (${(tldwC + tlwctC).toLocaleString()}) exceeds your master campaign target of ${adminCampaignTarget.toLocaleString()} leads set by System Admin!`);
      return;
    }

    const delegated = {
      tldwSalesTarget: tldwS,
      tldwCampaignTarget: tldwC,
      tlwctSalesTarget: tlwctS,
      tlwctCampaignTarget: tlwctC,
      lastUpdated: new Date().toLocaleString()
    };

    const pool = {
      totalSales: adminSalesTarget,
      totalCampaign: adminCampaignTarget,
      allocatedSales: tldwS + tlwctS,
      allocatedCampaign: tldwC + tlwctC,
      tldwSales: tldwS,
      tldwCampaign: tldwC,
      tlwctSales: tlwctS,
      tlwctCampaign: tlwctC,
      lastUpdated: new Date().toLocaleString()
    };

    try {
      await saveTarget({ key: 'tm_th_tl_targets', value: delegated }).unwrap();
      await saveTarget({ key: 'tm_th_allocated_pool', value: pool }).unwrap();
      
      localStorage.setItem('tm_th_tl_targets', JSON.stringify(delegated));
      localStorage.setItem('tm_th_allocated_pool', JSON.stringify(pool));
      alert('Delegated targets published successfully to DW & WCT Team Leaders!');
    } catch (err) {
      alert('Failed to save targets on backend. Storing locally instead.');
      localStorage.setItem('tm_th_tl_targets', JSON.stringify(delegated));
      localStorage.setItem('tm_th_allocated_pool', JSON.stringify(pool));
    }
  };

  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: 'CAMP-DW-01',
      name: 'Q2 Driver Welcome & KYC verification',
      targetRole: 'DW',
      status: 'Active',
      activeCallers: 7,
      totalLeads: 24500,
      connectedLeads: 18920,
      conversionRate: 14.2,
      startDate: '2026-05-15',
    },
    {
      id: 'CAMP-TR-02',
      name: 'Standard Subscription Upgrades',
      targetRole: 'TR',
      status: 'Active',
      activeCallers: 5,
      totalLeads: 12800,
      connectedLeads: 8540,
      conversionRate: 18.5,
      startDate: '2026-06-01',
    },
    {
      id: 'CAMP-MM-03',
      name: 'Super Premium Matching Outreach',
      targetRole: 'MM',
      status: 'Active',
      activeCallers: 6,
      totalLeads: 5400,
      connectedLeads: 4910,
      conversionRate: 12.1,
      startDate: '2026-06-10',
    },
    {
      id: 'CAMP-SC-04',
      name: 'Foreman Activation Sprint',
      targetRole: 'SC',
      status: 'Paused',
      activeCallers: 0,
      totalLeads: 3100,
      connectedLeads: 1200,
      conversionRate: 9.2,
      startDate: '2026-06-05',
    },
    {
      id: 'CAMP-DW-05',
      name: 'Dormant Driver Re-engagement',
      targetRole: 'DW',
      status: 'Scheduled',
      activeCallers: 0,
      totalLeads: 8500,
      connectedLeads: 0,
      conversionRate: 0.0,
      startDate: '2026-07-01',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'ALL' | 'DW' | 'TR' | 'MM' | 'SC'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(campaigns[0]);

  // Form states for adding/editing campaign
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignTarget, setNewCampaignTarget] = useState<'DW' | 'TR' | 'MM' | 'SC'>('DW');
  const [newCampaignLeads, setNewCampaignLeads] = useState(5000);
  const [newCampaignCallers, setNewCampaignCallers] = useState(4);

  // Campaign Queue states
  const [queueLeads, setQueueLeads] = useState([
    { id: 'DR-C-82910', name: 'Suresh Kumar', phone: '9876543210', source: 'META ADS', campaign: 'Driver KYC Sprint', temp: 'HOT', assigned: 'Rahul S.', time: '2h ago' },
    { id: 'TR-C-19284', name: 'Balaji Logistics', phone: '8765432109', source: 'GOOGLE ADS', campaign: 'Transporter Upgrades', temp: 'WARM', assigned: 'Sarah C.', time: '4h ago' },
    { id: 'DR-C-56192', name: 'Vijay Singh', phone: '7654321098', source: 'IG COMMENT', campaign: 'Organic Comment Leads', temp: 'COLD', assigned: 'Priya P.', time: '1d ago' },
    { id: 'TR-C-90182', name: 'Gati Carrier', phone: '6543210987', source: 'META ADS', campaign: 'Transporter Upgrades', temp: 'HOT', assigned: 'Alex R.', time: '30m ago' },
    { id: 'DR-C-33829', name: 'Ramesh Yadav', phone: '9012345678', source: 'FB COMMENT', campaign: 'Driver KYC Sprint', temp: 'WARM', assigned: 'Aman K.', time: '5h ago' },
  ]);
  const [queueSearch, setQueueSearch] = useState('');
  const [selectedQueueLead, setSelectedQueueLead] = useState<any>(queueLeads[0]);
  const [overrideTemp, setOverrideTemp] = useState('');
  const [overrideAssign, setOverrideAssign] = useState('');
  const [overrideReason, setOverrideReason] = useState('');

  // Source Analytics
  const sourceMetrics = [
    { source: 'META ADS', ingested: 2450, connected: 1890, conv: '14.2%', rating: '3.8', cost: '₹142', roi: '3.4x' },
    { source: 'GOOGLE ADS', ingested: 1200, connected: 980, conv: '18.5%', rating: '4.2', cost: '₹210', roi: '4.8x' },
    { source: 'IG COMMENT', ingested: 450, connected: 310, conv: '8.2%', rating: '2.9', cost: '₹65', roi: '1.9x' },
    { source: 'FB COMMENT', ingested: 650, connected: 420, conv: '7.8%', rating: '2.8', cost: '₹55', roi: '1.8x' },
    { source: 'MANUAL', ingested: 120, connected: 95, conv: '11.5%', rating: '3.5', cost: '₹10', roi: '6.2x' },
  ];

  // Quality Alert list
  const lowQualityAlerts = [
    { id: 'q1', type: 'High Cold Leads', title: 'FB Comment Scraping Pool', desc: 'Over 68% of comments scraped are flagged COLD by agents due to incorrect numbers or spam.', action: 'Enforce phone verification step' },
    { id: 'q2', type: 'Low Conversion Alert', title: 'Google Ads - KYC Promo Form', desc: 'Conversion rate is 5.2% below historical average. Lead rating stands at 2.9 stars.', action: 'Verify search terms & ad creatives' },
  ];

  // Campaign Spends and ROI
  const [campaignSpends, setCampaignSpends] = useState<Record<string, number>>({
    'CAMP-DW-01': 54000,
    'CAMP-TR-02': 75000,
    'CAMP-MM-03': 42000,
    'CAMP-SC-04': 15000,
    'CAMP-DW-05': 0,
  });
  const [tempSpend, setTempSpend] = useState<Record<string, string>>({});

  // Override Logs
  const [overrideLogs, setOverrideLogs] = useState([
    { timestamp: '11:20 AM', by: 'TL Rahul', leadId: 'DR-C-82910', caller: 'Rahul S.', change: 'HOT → WARM', reason: 'Requested callback in 3 days' },
    { timestamp: '10:45 AM', by: 'TH Admin', leadId: 'TR-C-19284', caller: 'Sarah C.', change: 'WARM → COLD', reason: 'Incorrect contact details' },
    { timestamp: 'Yesterday', by: 'TL Sonia', leadId: 'DR-C-56192', caller: 'Priya P.', change: 'HOT → COLD', reason: 'Not looking for jobs currently' },
  ]);

  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaignName.trim()) return;

    const newCamp: Campaign = {
      id: `CAMP-${newCampaignTarget}-${Math.floor(100 + Math.random() * 900)}`,
      name: newCampaignName,
      targetRole: newCampaignTarget,
      status: 'Scheduled',
      activeCallers: 0,
      totalLeads: newCampaignLeads,
      connectedLeads: 0,
      conversionRate: 0.0,
      startDate: new Date().toISOString().split('T')[0],
    };

    setCampaigns(prev => [newCamp, ...prev]);
    setSelectedCampaign(newCamp);
    setNewCampaignName('');
    setIsModalOpen(false);
  };

  const toggleCampaignStatus = (id: string) => {
    setCampaigns(prev =>
      prev.map(camp => {
        if (camp.id === id) {
          const nextStatusMap: Record<Campaign['status'], Campaign['status']> = {
            Active: 'Paused',
            Paused: 'Active',
            Completed: 'Active',
            Scheduled: 'Active',
          };
          const nextStatus = nextStatusMap[camp.status];
          const updated = {
            ...camp,
            status: nextStatus,
            activeCallers: nextStatus === 'Active' ? 3 : 0,
          };
          if (selectedCampaign?.id === id) {
            setSelectedCampaign(updated);
          }
          return updated;
        }
        return camp;
      })
    );
  };

  const updateCallerCount = (id: string, count: number) => {
    setCampaigns(prev =>
      prev.map(camp => {
        if (camp.id === id) {
          const updated = { ...camp, activeCallers: count };
          if (selectedCampaign?.id === id) {
            setSelectedCampaign(updated);
          }
          return updated;
        }
        return camp;
      })
    );
  };

  const handleApplyOverride = () => {
    if (!selectedQueueLead) return;

    const newLog = {
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      by: 'TH Override',
      leadId: selectedQueueLead.id,
      caller: selectedQueueLead.assigned,
      change: `${selectedQueueLead.temp} → ${overrideTemp || selectedQueueLead.temp}`,
      reason: overrideReason || 'Manual optimization override',
    };
    setOverrideLogs(prev => [newLog, ...prev]);

    setQueueLeads(prev => prev.map(l => {
      if (l.id === selectedQueueLead.id) {
        const updated = {
          ...l,
          temp: (overrideTemp || l.temp),
          assigned: overrideAssign || l.assigned,
        };
        setSelectedQueueLead(updated);
        return updated;
      }
      return l;
    }));

    setOverrideReason('');
    alert('Lead override settings saved successfully!');
  };

  const handleUpdateSpend = (campId: string) => {
    const val = parseFloat(tempSpend[campId]);
    if (isNaN(val)) return;
    setCampaignSpends(prev => ({
      ...prev,
      [campId]: val
    }));
    alert('Campaign ad spend updated successfully!');
  };

  const filteredCampaigns = campaigns.filter(c => {
    const matchesTab = activeTab === 'ALL' || c.targetRole === activeTab;
    const matchesSearch = c.name.toLowerCase().includes(searchTerm.toLowerCase()) || c.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const filteredQueueLeads = queueLeads.filter(l => {
    const matchesSearch = l.name.toLowerCase().includes(queueSearch.toLowerCase()) ||
                          l.id.toLowerCase().includes(queueSearch.toLowerCase()) ||
                          l.phone.includes(queueSearch) ||
                          l.campaign.toLowerCase().includes(queueSearch.toLowerCase());
    return matchesSearch;
  });

  // Calculate high level console stats
  const totalActiveCallers = campaigns.reduce((acc, c) => acc + c.activeCallers, 0);
  const totalLeadsInConsole = campaigns.reduce((acc, c) => acc + c.totalLeads, 0);
  const totalConnectedLeads = campaigns.reduce((acc, c) => acc + c.connectedLeads, 0);
  const overallConversionRate = (
    campaigns.reduce((acc, c) => acc + c.conversionRate * c.connectedLeads, 0) /
    (totalConnectedLeads || 1)
  ).toFixed(1);

  return (
    <main className="flex flex-col h-full bg-background relative">
      {/* Page Header */}
      <section className="px-lg py-md bg-white border-b border-outline-variant flex justify-between items-center shrink-0">
        <div>
          <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant mb-1">
            <span>Telecalling Head</span>
            <span>/</span>
            <span className="font-bold text-primary">Global Campaign Console</span>
          </div>
          <h1 className="font-display-sm text-display-sm text-on-surface font-bold">
            Global Campaign Console
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-lg h-[36px] bg-primary text-on-primary font-body-sm text-body-sm font-semibold hover:opacity-90 transition-opacity shadow-sm rounded-sm"
          >
            <span className="material-symbols-outlined text-base">campaign</span>
            Create New Campaign
          </button>
        </div>
      </section>

      {/* Tab Navigation */}
      <section className="px-lg bg-white border-b border-outline-variant flex gap-sm shrink-0">
        {(['CAMPAIGNS', 'QUEUE', 'ANALYTICS', 'QUALITY', 'SPEND_ROI', 'OVERRIDE_LOG', 'TARGETS'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setConsoleTab(tab)}
            className={`py-3 px-sm font-bold text-xs border-b-2 transition-all ${
              consoleTab === tab
                ? 'border-primary text-primary'
                : 'border-transparent text-on-surface-variant hover:text-on-surface'
            }`}
          >
            {tab === 'TARGETS' ? 'TL Target Manager' : tab.replace('_', ' ')}
          </button>
        ))}
      </section>

      {/* 1. CAMPAIGNS TAB */}
      {consoleTab === 'CAMPAIGNS' && (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* KPI Summary Banner */}
          <section className="p-md grid grid-cols-1 md:grid-cols-4 gap-md shrink-0">
            <div className="admin-border bg-white p-lg shadow-sm rounded-sm flex items-center justify-between">
              <div>
                <p className="font-body-sm text-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                  Total Lead Pool
                </p>
                <p className="font-display-sm text-display-sm font-bold text-on-surface mt-1">
                  {totalLeadsInConsole.toLocaleString()}
                </p>
              </div>
              <span className="material-symbols-outlined text-3xl text-primary-container p-2 bg-primary/10 rounded">
                groups
              </span>
            </div>

            <div className="admin-border bg-white p-lg shadow-sm rounded-sm flex items-center justify-between">
              <div>
                <p className="font-body-sm text-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                  Outreach Coverage
                </p>
                <p className="font-display-sm text-display-sm font-bold text-on-surface mt-1">
                  {((totalConnectedLeads / (totalLeadsInConsole || 1)) * 100).toFixed(1)}%
                </p>
              </div>
              <span className="material-symbols-outlined text-3xl text-green-700 p-2 bg-green-50 rounded">
                contact_phone
              </span>
            </div>

            <div className="admin-border bg-white p-lg shadow-sm rounded-sm flex items-center justify-between">
              <div>
                <p className="font-body-sm text-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                  Avg Conversion
                </p>
                <p className="font-display-sm text-display-sm font-bold text-on-surface mt-1">
                  {overallConversionRate}%
                </p>
              </div>
              <span className="material-symbols-outlined text-3xl text-purple-700 p-2 bg-purple-50 rounded">
                trending_up
              </span>
            </div>

            <div className="admin-border bg-white p-lg shadow-sm rounded-sm flex items-center justify-between">
              <div>
                <p className="font-body-sm text-body-sm font-semibold text-on-surface-variant uppercase tracking-wider">
                  Callers Deployed
                </p>
                <p className="font-display-sm text-display-sm font-bold text-on-surface mt-1">
                  {totalActiveCallers} <span className="text-xs text-on-surface-variant font-normal">agents</span>
                </p>
              </div>
              <span className="material-symbols-outlined text-3xl text-orange-700 p-2 bg-orange-50 rounded">
                support_agent
              </span>
            </div>
          </section>

          {/* Main Console Layout */}
          <section className="flex-1 overflow-hidden p-md grid grid-cols-1 lg:grid-cols-12 gap-md min-h-[400px]">
            {/* Left Column: Campaigns List (8-cols) */}
            <div className="lg:col-span-8 flex flex-col bg-white admin-border rounded-sm shadow-sm overflow-hidden">
              {/* List Headers and Filters */}
              <div className="p-md admin-border-b bg-surface-container-low/30 flex flex-col md:flex-row justify-between items-start md:items-center gap-sm">
                <div className="flex border border-outline-variant rounded-sm overflow-hidden bg-white">
                  {(['ALL', 'DW', 'TR', 'MM', 'SC'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-md py-1.5 font-bold text-[11px] transition-colors border-r last:border-r-0 border-outline-variant ${
                        activeTab === tab
                          ? 'bg-primary text-on-primary'
                          : 'hover:bg-surface-container-low text-on-surface-variant'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                <div className="relative w-full md:w-64">
                  <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                    search
                  </span>
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-outline-variant rounded-sm focus:ring-1 focus:ring-primary outline-none"
                  />
                </div>
              </div>

              {/* List Content */}
              <div className="flex-1 overflow-y-auto custom-scrollbar">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-surface-container-low border-b border-outline-variant z-10 text-xs">
                    <tr>
                      <th className="px-lg py-2.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Campaign Details
                      </th>
                      <th className="px-lg py-2.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Process
                      </th>
                      <th className="px-lg py-2.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-center">
                        Status
                      </th>
                      <th className="px-lg py-2.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                        Progress
                      </th>
                      <th className="px-lg py-2.5 text-[10px] font-bold text-on-surface-variant uppercase tracking-wider text-right">
                        Conversion
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-outline-variant text-xs">
                    {filteredCampaigns.map(camp => {
                      const progressPct = camp.totalLeads > 0 ? (camp.connectedLeads / camp.totalLeads) * 100 : 0;
                      const isSelected = selectedCampaign?.id === camp.id;

                      return (
                        <tr
                          key={camp.id}
                          onClick={() => setSelectedCampaign(camp)}
                          className={`cursor-pointer hover:bg-surface-container-low/30 transition-colors ${
                            isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                          }`}
                        >
                          <td className="px-lg py-3">
                            <div className="flex flex-col">
                              <span className="font-semibold text-body-sm text-on-surface">
                                {camp.name}
                              </span>
                              <span className="font-code-sm text-xs text-primary mt-0.5 font-mono">
                                {camp.id} · Launch: {camp.startDate}
                              </span>
                            </div>
                          </td>
                          <td className="px-lg py-3">
                            <span
                              className={`px-2 py-0.5 rounded text-[10px] font-extrabold text-white ${
                                camp.targetRole === 'DW'
                                  ? 'bg-green-500'
                                  : camp.targetRole === 'TR'
                                  ? 'bg-orange-500'
                                  : camp.targetRole === 'MM'
                                  ? 'bg-purple-500'
                                  : 'bg-teal-500'
                              }`}
                            >
                              {camp.targetRole}
                            </span>
                          </td>
                          <td className="px-lg py-3 text-center">
                            <span
                              className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${
                                camp.status === 'Active'
                                  ? 'bg-green-50 text-green-700 border-green-200'
                                  : camp.status === 'Paused'
                                  ? 'bg-red-50 text-red-700 border-red-200'
                                  : camp.status === 'Completed'
                                  ? 'bg-blue-50 text-blue-700 border-blue-200'
                                  : 'bg-slate-50 text-slate-600 border-slate-200'
                              }`}
                            >
                              {camp.status}
                            </span>
                          </td>
                          <td className="px-lg py-3">
                            <div className="flex flex-col w-32">
                              <div className="flex justify-between text-[10px] font-semibold text-on-surface-variant mb-1">
                                <span>{progressPct.toFixed(0)}%</span>
                                <span className="font-mono">{camp.connectedLeads.toLocaleString()} / {camp.totalLeads.toLocaleString()}</span>
                              </div>
                              <div className="w-full bg-surface-container h-1.5 rounded-full overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all duration-500 ${
                                    camp.status === 'Active' ? 'bg-primary' : 'bg-slate-400'
                                  }`}
                                  style={{ width: `${progressPct}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td className="px-lg py-3 text-right font-bold text-body-sm font-mono">
                            {camp.conversionRate > 0 ? `${camp.conversionRate}%` : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Right Column: Campaign Inspector (4-cols) */}
            <div className="lg:col-span-4 flex flex-col bg-white admin-border rounded-sm shadow-sm overflow-hidden">
              {selectedCampaign ? (
                <div className="flex-1 flex flex-col text-xs">
                  <div className="p-md admin-border-b bg-surface-container-low/50">
                    <span className="text-[10px] font-bold text-outline font-mono uppercase tracking-widest block mb-1">
                      Campaign Inspector
                    </span>
                    <h3 className="text-sm font-bold text-on-surface">
                      {selectedCampaign.name}
                    </h3>
                    <p className="text-[11px] font-semibold text-primary font-mono mt-1">
                      {selectedCampaign.id}
                    </p>
                  </div>

                  <div className="p-md flex-1 overflow-y-auto space-y-md custom-scrollbar">
                    <div className="grid grid-cols-2 gap-sm">
                      <div className="bg-surface-container-low/40 p-sm admin-border rounded-sm">
                        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                          Target Role
                        </p>
                        <p className="text-xs font-bold text-on-surface mt-1">
                          {selectedCampaign.targetRole === 'DW' && 'Driver Welcome'}
                          {selectedCampaign.targetRole === 'TR' && 'Transporter Welcome'}
                          {selectedCampaign.targetRole === 'MM' && 'Matchmaking'}
                          {selectedCampaign.targetRole === 'SC' && 'Special Categories'}
                        </p>
                      </div>
                      <div className="bg-surface-container-low/40 p-sm admin-border rounded-sm">
                        <p className="text-[9px] font-bold text-on-surface-variant uppercase tracking-wider">
                          Outreach Status
                        </p>
                        <p className="text-xs font-bold text-on-surface mt-1">
                          {selectedCampaign.status}
                        </p>
                      </div>
                    </div>

                    <div className="bg-surface-container-low/50 p-md admin-border rounded-sm space-y-sm">
                      <h4 className="text-[10px] font-bold text-on-surface uppercase tracking-wider border-b border-outline-variant pb-1">
                        Live Performance Summary
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Total Leads:</span>
                        <span className="font-bold font-mono">{selectedCampaign.totalLeads.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Connected Leads:</span>
                        <span className="font-bold font-mono">{selectedCampaign.connectedLeads.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-on-surface-variant">Conversion Rate:</span>
                        <span className="font-bold text-primary font-mono">
                          {selectedCampaign.conversionRate > 0 ? `${selectedCampaign.conversionRate}%` : '—'}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-sm">
                      <h4 className="text-[10px] font-bold text-on-surface uppercase tracking-wider">
                        Resource Deployment
                      </h4>

                      <div>
                        <label className="block text-[11px] font-semibold text-on-surface-variant mb-1 uppercase">
                          Active Callers (Headcount)
                        </label>
                        <div className="flex items-center gap-4">
                          <input
                            type="range"
                            min="0"
                            max="20"
                            disabled={selectedCampaign.status !== 'Active'}
                            value={selectedCampaign.activeCallers}
                            onChange={e => updateCallerCount(selectedCampaign.id, parseInt(e.target.value))}
                            className="flex-1 accent-primary disabled:opacity-50"
                          />
                          <span className="font-mono border border-outline-variant px-3 py-1 bg-surface-container-low font-bold">
                            {selectedCampaign.activeCallers}
                          </span>
                        </div>
                        {selectedCampaign.status !== 'Active' && (
                          <p className="text-[10px] text-error font-medium mt-1">
                            Campaign must be Active to deploy callers.
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="pt-md border-t border-outline-variant space-y-2">
                      <button
                        onClick={() => toggleCampaignStatus(selectedCampaign.id)}
                        className={`w-full py-2 font-bold text-xs rounded-sm shadow-sm flex items-center justify-center gap-2 transition-colors ${
                          selectedCampaign.status === 'Active'
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        <span className="material-symbols-outlined text-base">
                          {selectedCampaign.status === 'Active' ? 'pause_circle' : 'play_circle'}
                        </span>
                        {selectedCampaign.status === 'Active' ? 'PAUSE CAMPAIGN' : 'ACTIVATE CAMPAIGN'}
                      </button>

                      <button className="w-full py-2 bg-white border border-outline-variant hover:bg-surface-container-low text-on-surface font-bold text-xs rounded-sm transition-colors flex items-center justify-center gap-2">
                        <span className="material-symbols-outlined text-base">file_download</span>
                        EXPORT FULL CAMPAIGN REPORT
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-on-surface-variant p-xl text-center text-xs">
                  <span className="material-symbols-outlined text-5xl mb-md text-outline">
                    campaign
                  </span>
                  <p className="font-bold">No Campaign Selected</p>
                  <p className="text-xs text-outline mt-1">
                    Select a campaign from the list to inspect details and modify allocations.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>
      )}

      {/* 2. QUEUE TAB (Global Unscoped Search & Temperature Overrides) */}
      {consoleTab === 'QUEUE' && (
        <section className="flex-1 overflow-hidden p-md grid grid-cols-1 lg:grid-cols-12 gap-md text-xs">
          {/* Leads List */}
          <div className="lg:col-span-8 flex flex-col bg-white admin-border rounded-sm shadow-sm overflow-hidden">
            <div className="p-md admin-border-b bg-surface-container-low/30 flex items-center justify-between">
              <h3 className="font-bold text-on-surface">Global Campaign Leads Queue</h3>
              <div className="relative w-64">
                <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-base">
                  search
                </span>
                <input
                  type="text"
                  placeholder="Search lead ref, name, phone..."
                  value={queueSearch}
                  onChange={e => setQueueSearch(e.target.value)}
                  className="w-full h-8 pl-8 pr-3 text-xs bg-white border border-outline-variant rounded-sm focus:ring-1 focus:ring-primary outline-none"
                />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead className="sticky top-0 bg-surface-container-low border-b border-outline-variant z-10">
                  <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider">
                    <th className="px-lg py-2.5">Lead Details</th>
                    <th className="px-lg py-2.5">Campaign Info</th>
                    <th className="px-lg py-2.5 text-center">Temp</th>
                    <th className="px-lg py-2.5">Assigned Agent</th>
                    <th className="px-lg py-2.5 text-right">Captured</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {filteredQueueLeads.map(lead => {
                    const isSelected = selectedQueueLead?.id === lead.id;
                    return (
                      <tr
                        key={lead.id}
                        onClick={() => {
                          setSelectedQueueLead(lead);
                          setOverrideTemp(lead.temp);
                          setOverrideAssign(lead.assigned);
                        }}
                        className={`cursor-pointer hover:bg-surface-container-low/30 transition-colors ${
                          isSelected ? 'bg-primary/5 border-l-4 border-l-primary' : ''
                        }`}
                      >
                        <td className="px-lg py-2.5">
                          <div className="flex flex-col font-semibold">
                            <span>{lead.name}</span>
                            <span className="text-outline font-mono text-[10px]">{lead.id} · {lead.phone}</span>
                          </div>
                        </td>
                        <td className="px-lg py-2.5">
                          <div className="flex flex-col">
                            <span className="font-semibold text-primary">{lead.source}</span>
                            <span className="text-outline text-[10px]">{lead.campaign}</span>
                          </div>
                        </td>
                        <td className="px-lg py-2.5 text-center">
                          <span
                            className={`px-2 py-0.5 rounded font-extrabold text-[9px] ${
                              lead.temp === 'HOT'
                                ? 'bg-red-100 text-red-700'
                                : lead.temp === 'WARM'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {lead.temp}
                          </span>
                        </td>
                        <td className="px-lg py-2.5 font-medium">{lead.assigned}</td>
                        <td className="px-lg py-2.5 text-right font-mono text-outline">{lead.time}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Override Control Panel */}
          <div className="lg:col-span-4 flex flex-col bg-white admin-border rounded-sm shadow-sm overflow-hidden">
            {selectedQueueLead ? (
              <div className="p-md flex-1 flex flex-col space-y-md">
                <div className="admin-border-b pb-2">
                  <h3 className="font-bold text-on-surface">Lead Detail & Override Console</h3>
                  <p className="text-primary font-mono text-[10px] mt-0.5">{selectedQueueLead.id} ({selectedQueueLead.name})</p>
                </div>

                <div className="space-y-sm bg-surface-container-low/40 p-md admin-border rounded-sm">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-semibold">Current Temperature:</span>
                    <span className="font-extrabold text-orange-600">{selectedQueueLead.temp}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-semibold">Lead Source:</span>
                    <span className="font-bold">{selectedQueueLead.source}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-semibold">Campaign:</span>
                    <span>{selectedQueueLead.campaign}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant font-semibold">Caller Assignment:</span>
                    <span className="font-semibold">{selectedQueueLead.assigned}</span>
                  </div>
                </div>

                <div className="space-y-md pt-2">
                  <h4 className="font-extrabold text-on-surface text-[10px] uppercase tracking-wider">TH / TL Override Actions</h4>

                  <div className="space-y-xs">
                    <label className="block font-semibold text-on-surface-variant uppercase">Override Temperature</label>
                    <select
                      value={overrideTemp}
                      onChange={e => setOverrideTemp(e.target.value)}
                      className="w-full h-8 admin-border bg-white px-2 focus:border-primary outline-none"
                    >
                      <option value="HOT">HOT (Immediate Priority)</option>
                      <option value="WARM">WARM (Normal Queue)</option>
                      <option value="COLD">COLD (Backlogged/Low Priority)</option>
                    </select>
                  </div>

                  <div className="space-y-xs">
                    <label className="block font-semibold text-on-surface-variant uppercase">Reassign Caller Agent</label>
                    <select
                      value={overrideAssign}
                      onChange={e => setOverrideAssign(e.target.value)}
                      className="w-full h-8 admin-border bg-white px-2 focus:border-primary outline-none"
                    >
                      <option value="Rahul S.">Rahul S. (DW)</option>
                      <option value="Sonia R.">Sonia R. (DW)</option>
                      <option value="Sarah C.">Sarah C. (TR)</option>
                      <option value="Alex R.">Alex R. (TR)</option>
                      <option value="Priya P.">Priya P. (DW)</option>
                    </select>
                  </div>

                  <div className="space-y-xs">
                    <label className="block font-semibold text-on-surface-variant uppercase">Override Rationale / Reason</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Specify reasons for manually changing lead priority..."
                      value={overrideReason}
                      onChange={e => setOverrideReason(e.target.value)}
                      className="w-full admin-border p-2 focus:border-primary outline-none"
                    />
                  </div>

                  <button
                    onClick={handleApplyOverride}
                    className="w-full py-2 bg-[#F39C12] hover:bg-[#e08e0b] text-white font-bold rounded-sm shadow-sm transition-colors text-center"
                  >
                    SAVE &amp; BROADCAST OVERRIDE
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center p-md text-center text-outline">
                <span className="material-symbols-outlined text-4xl mb-sm">manage_accounts</span>
                <p>Select a lead to perform overrides</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* 3. ANALYTICS TAB (Comparison of Lead Sources) */}
      {consoleTab === 'ANALYTICS' && (
        <section className="flex-1 overflow-y-auto p-md space-y-md text-xs">
          <div className="bg-white admin-border rounded-sm shadow-sm p-md space-y-md">
            <h3 className="font-bold text-on-surface text-sm border-b border-outline-variant pb-2">Campaign Channel Performance comparison</h3>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant bg-surface-container-low">
                  <th className="px-md py-2">Lead Channel Source</th>
                  <th className="px-md py-2 text-right">Leads Ingested</th>
                  <th className="px-md py-2 text-right">Calls Connected</th>
                  <th className="px-md py-2 text-right">Conversion Rate</th>
                  <th className="px-md py-2 text-center">Avg Agent Rating</th>
                  <th className="px-md py-2 text-right">Cost Per Conv.</th>
                  <th className="px-md py-2 text-right">ROI Multiplier</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {sourceMetrics.map(metric => (
                  <tr key={metric.source} className="hover:bg-surface-container-low/20">
                    <td className="px-md py-3 font-bold text-primary">{metric.source}</td>
                    <td className="px-md py-3 text-right font-mono">{metric.ingested.toLocaleString()}</td>
                    <td className="px-md py-3 text-right font-mono">{metric.connected.toLocaleString()}</td>
                    <td className="px-md py-3 text-right font-bold font-mono">{metric.conv}</td>
                    <td className="px-md py-3 text-center">
                      <span className="font-bold text-yellow-600 bg-yellow-50 px-2 py-0.5 rounded font-mono">★ {metric.rating}</span>
                    </td>
                    <td className="px-md py-3 text-right font-semibold font-mono">{metric.cost}</td>
                    <td className="px-md py-3 text-right text-green-700 font-extrabold font-mono">{metric.roi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            <div className="bg-white admin-border rounded-sm p-md space-y-sm">
              <h4 className="font-bold text-on-surface">Channel Lead Capture Distribution</h4>
              <div className="h-40 bg-surface-container-low/40 rounded flex items-end justify-around p-sm border border-outline-variant">
                <div className="flex flex-col items-center gap-xs w-12">
                  <div className="bg-blue-500 w-full rounded-t-sm" style={{ height: '100px' }}></div>
                  <span className="text-[9px] font-bold">Meta</span>
                </div>
                <div className="flex flex-col items-center gap-xs w-12">
                  <div className="bg-yellow-500 w-full rounded-t-sm" style={{ height: '60px' }}></div>
                  <span className="text-[9px] font-bold">Google</span>
                </div>
                <div className="flex flex-col items-center gap-xs w-12">
                  <div className="bg-pink-500 w-full rounded-t-sm" style={{ height: '35px' }}></div>
                  <span className="text-[9px] font-bold">IG Comm.</span>
                </div>
                <div className="flex flex-col items-center gap-xs w-12">
                  <div className="bg-indigo-500 w-full rounded-t-sm" style={{ height: '45px' }}></div>
                  <span className="text-[9px] font-bold">FB Comm.</span>
                </div>
                <div className="flex flex-col items-center gap-xs w-12">
                  <div className="bg-gray-400 w-full rounded-t-sm" style={{ height: '15px' }}></div>
                  <span className="text-[9px] font-bold">Manual</span>
                </div>
              </div>
            </div>

            <div className="bg-white admin-border rounded-sm p-md space-y-sm">
              <h4 className="font-bold text-on-surface">Target Lead Conversions Breakdown</h4>
              <div className="space-y-sm">
                <div className="space-y-xs">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-semibold text-on-surface-variant">META ADS — Target: 80% achieved</span>
                    <span className="font-mono font-bold">348 Conversions</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full rounded-full" style={{ width: '80%' }}></div>
                  </div>
                </div>
                <div className="space-y-xs">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-semibold text-on-surface-variant">GOOGLE ADS — Target: 92% achieved</span>
                    <span className="font-mono font-bold">181 Conversions</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-yellow-500 h-full rounded-full" style={{ width: '92%' }}></div>
                  </div>
                </div>
                <div className="space-y-xs">
                  <div className="flex justify-between text-[10px]">
                    <span className="font-semibold text-on-surface-variant">COMMENT SCRAPING — Target: 42% achieved</span>
                    <span className="font-mono font-bold">54 Conversions</span>
                  </div>
                  <div className="w-full bg-surface-container h-2 rounded-full overflow-hidden">
                    <div className="bg-pink-500 h-full rounded-full" style={{ width: '42%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 4. QUALITY TAB (Lead Quality Trends & Alerts) */}
      {consoleTab === 'QUALITY' && (
        <section className="flex-1 overflow-y-auto p-md space-y-md text-xs">
          <div className="bg-white admin-border rounded-sm p-md space-y-sm">
            <h3 className="font-bold text-on-surface text-sm">Real-time Quality Compliance Center</h3>
            <p className="text-outline">System-wide monitoring of low-performing lead sources, based on post-call user feedback ratings.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
            {/* Low Quality Triggers */}
            <div className="bg-white admin-border rounded-sm p-md space-y-md">
              <h4 className="font-bold text-on-surface border-b pb-1">Low-Quality Alerts & Action Triggers</h4>
              <div className="space-y-md">
                {lowQualityAlerts.map(alert => (
                  <div key={alert.id} className="bg-red-50 border border-red-200 text-red-800 p-md rounded-sm space-y-sm">
                    <div className="flex justify-between items-center">
                      <span className="bg-red-600 text-white font-extrabold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">{alert.type}</span>
                      <span className="font-bold text-red-900">{alert.title}</span>
                    </div>
                    <p className="text-[11px] leading-relaxed text-red-700">{alert.desc}</p>
                    <div className="border-t border-red-200/50 pt-2 flex justify-between items-center">
                      <span className="text-[10px] font-bold text-red-900">Recommended action:</span>
                      <button className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 font-bold rounded-sm text-[10px]">
                        {alert.action}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quality rating overview */}
            <div className="bg-white admin-border rounded-sm p-md space-y-md">
              <h4 className="font-bold text-on-surface border-b pb-1">Agent Feedback Sentiment Distribution</h4>
              <div className="space-y-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface-variant flex items-center gap-1">★★★★★ <span className="text-outline">(Excellent quality)</span></span>
                  <div className="w-40 bg-surface-container h-2 rounded-full overflow-hidden mx-md flex-1">
                    <div className="bg-green-600 h-full rounded-full" style={{ width: '45%' }}></div>
                  </div>
                  <span className="font-bold font-mono">45%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface-variant flex items-center gap-1">★★★★☆ <span className="text-outline">(Good quality)</span></span>
                  <div className="w-40 bg-surface-container h-2 rounded-full overflow-hidden mx-md flex-1">
                    <div className="bg-emerald-500 h-full rounded-full" style={{ width: '25%' }}></div>
                  </div>
                  <span className="font-bold font-mono">25%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface-variant flex items-center gap-1">★★★☆☆ <span className="text-outline">(Average - Warm)</span></span>
                  <div className="w-40 bg-surface-container h-2 rounded-full overflow-hidden mx-md flex-1">
                    <div className="bg-yellow-500 h-full rounded-full" style={{ width: '15%' }}></div>
                  </div>
                  <span className="font-bold font-mono">15%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface-variant flex items-center gap-1">★★☆☆☆ <span className="text-outline">(Spam/Cold)</span></span>
                  <div className="w-40 bg-surface-container h-2 rounded-full overflow-hidden mx-md flex-1">
                    <div className="bg-orange-500 h-full rounded-full" style={{ width: '10%' }}></div>
                  </div>
                  <span className="font-bold font-mono">10%</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-on-surface-variant flex items-center gap-1">★☆☆☆☆ <span className="text-outline">(Junk/Invalid Number)</span></span>
                  <div className="w-40 bg-surface-container h-2 rounded-full overflow-hidden mx-md flex-1">
                    <div className="bg-red-500 h-full rounded-full" style={{ width: '5%' }}></div>
                  </div>
                  <span className="font-bold font-mono">5%</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 5. SPEND & ROI TAB */}
      {consoleTab === 'SPEND_ROI' && (
        <section className="flex-1 overflow-y-auto p-md space-y-md text-xs">
          <div className="bg-white admin-border rounded-sm shadow-sm p-md space-y-md">
            <div className="border-b border-outline-variant pb-2 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-on-surface text-sm">Campaign Ad Spend &amp; ROI Center</h3>
                <p className="text-outline">Log direct marketing spends for active ad campaigns to calculate metrics (CPL, ROI, Cost/Conversion).</p>
              </div>
            </div>

            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant bg-surface-container-low">
                  <th className="px-md py-2">Campaign Details</th>
                  <th className="px-md py-2 text-right">Total Leads</th>
                  <th className="px-md py-2 text-right">Ad Spend Amount</th>
                  <th className="px-md py-2 text-right">Cost Per Lead (CPL)</th>
                  <th className="px-md py-2 text-right">Conversions</th>
                  <th className="px-md py-2 text-right">Cost/Conversion</th>
                  <th className="px-md py-2 text-right">ROI Est.</th>
                  <th className="px-md py-2 text-center w-48">Edit Spend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant text-xs">
                {campaigns.map(camp => {
                  const spend = campaignSpends[camp.id] || 0;
                  const cpl = camp.totalLeads > 0 ? (spend / camp.totalLeads) : 0;
                  const totalConversions = Math.round(camp.connectedLeads * (camp.conversionRate / 100));
                  const costPerConversion = totalConversions > 0 ? (spend / totalConversions) : 0;
                  const estRevenue = totalConversions * (camp.targetRole === 'DW' ? 250 : 800);
                  const roi = spend > 0 ? (estRevenue / spend) : 0;

                  return (
                    <tr key={camp.id} className="hover:bg-surface-container-low/20">
                      <td className="px-md py-3 font-semibold">
                        <div>{camp.name}</div>
                        <span className="text-[10px] font-mono text-outline">{camp.id} · {camp.targetRole}</span>
                      </td>
                      <td className="px-md py-3 text-right font-mono font-semibold">{camp.totalLeads.toLocaleString()}</td>
                      <td className="px-md py-3 text-right font-mono font-bold text-primary">₹{spend.toLocaleString()}</td>
                      <td className="px-md py-3 text-right font-mono">₹{cpl.toFixed(2)}</td>
                      <td className="px-md py-3 text-right font-mono">{totalConversions}</td>
                      <td className="px-md py-3 text-right font-mono text-purple-700 font-bold">₹{costPerConversion.toFixed(0)}</td>
                      <td className="px-md py-3 text-right text-green-700 font-extrabold font-mono">{roi > 0 ? `${roi.toFixed(1)}x` : '—'}</td>
                      <td className="px-md py-3 text-center">
                        <div className="flex gap-xs justify-center">
                          <input
                            type="number"
                            placeholder="Ad spend..."
                            className="w-24 h-7 text-xs bg-white border border-outline-variant px-2 outline-none rounded-sm"
                            onChange={e => setTempSpend(prev => ({ ...prev, [camp.id]: e.target.value }))}
                          />
                          <button
                            onClick={() => handleUpdateSpend(camp.id)}
                            className="bg-primary text-on-primary h-7 px-2 font-bold rounded-sm text-[10px]"
                          >
                            Set
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 6. OVERRIDE LOG TAB */}
      {consoleTab === 'OVERRIDE_LOG' && (
        <section className="flex-1 overflow-y-auto p-md space-y-md text-xs">
          <div className="bg-white admin-border rounded-sm shadow-sm p-md space-y-md">
            <h3 className="font-bold text-on-surface text-sm border-b pb-2">Temperature &amp; Caller override history</h3>

            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="text-[10px] font-bold text-on-surface-variant uppercase tracking-wider border-b border-outline-variant bg-surface-container-low">
                  <th className="px-md py-2">Timestamp</th>
                  <th className="px-md py-2">Modified By</th>
                  <th className="px-md py-2 font-mono">Lead ID</th>
                  <th className="px-md py-2">Caller Agent</th>
                  <th className="px-md py-2">Override Action</th>
                  <th className="px-md py-2">Rationale / Reason</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {overrideLogs.map((log, index) => (
                  <tr key={index} className="hover:bg-surface-container-low/20">
                    <td className="px-md py-3 font-mono font-bold text-outline">{log.timestamp}</td>
                    <td className="px-md py-3 font-bold text-primary">{log.by}</td>
                    <td className="px-md py-3 font-mono font-semibold">{log.leadId}</td>
                    <td className="px-md py-3 font-medium">{log.caller}</td>
                    <td className="px-md py-3 font-extrabold text-orange-600">{log.change}</td>
                    <td className="px-md py-3 italic text-on-surface-variant font-medium">{log.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* 7. TARGETS TAB (TL Target Manager) */}
      {consoleTab === 'TARGETS' && (
        <section className="flex-1 overflow-y-auto p-md space-y-md text-xs">
          {/* Main Info Strip */}
          <div className="bg-white admin-border rounded-sm p-md flex flex-col md:flex-row justify-between items-start md:items-center gap-md shadow-xs">
            <div>
              <h3 className="font-bold text-on-surface text-sm">Team Leader Target Delegation Hub</h3>
              <p className="text-outline mt-0.5">Delegate your organizational targets down to your Team Leaders (TL-DW and TL-WCT/MM).</p>
            </div>
            <div className="bg-orange-50 border border-orange-200 text-orange-850 px-3 py-2 rounded-sm text-right">
              <span className="text-[9px] uppercase tracking-wider block font-bold text-orange-600">Your Master Sales Target (from Admin)</span>
              <span className="font-extrabold text-sm font-mono text-gray-800">₹{adminSalesTarget.toLocaleString()}</span>
              <span className="block text-[9px] text-outline mt-0.5">Campaign Leads Target: {adminCampaignTarget.toLocaleString()}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
            {/* Left side: Delegation Form */}
            <div className="lg:col-span-8 bg-white admin-border rounded-sm p-lg space-y-lg shadow-sm">
              <form onSubmit={handlePublishTlTargets} className="space-y-lg">
                
                {/* 1. TL-DW (Driver Welcome) */}
                <div className="space-y-md border-b pb-md">
                  <div className="flex items-center gap-xs">
                    <span className="w-5 h-5 rounded-full bg-green-500 text-white flex items-center justify-center font-bold text-[10px]">DW</span>
                    <h4 className="font-bold text-on-surface text-xs">TL — Driver Welcome (Rahul S. / Sonia R.)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="space-y-xs">
                      <label className="block font-semibold text-on-surface-variant">Allocated Sales Target (₹)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={tldwSalesInput}
                        onChange={e => setTldwSalesInput(e.target.value)}
                        className="w-full h-9 bg-white border border-outline-variant px-3 rounded-sm font-bold focus:border-primary outline-none"
                      />
                    </div>
                    <div className="space-y-xs">
                      <label className="block font-semibold text-on-surface-variant">Allocated Campaign Leads Target</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={tldwCampaignInput}
                        onChange={e => setTldwCampaignInput(e.target.value)}
                        className="w-full h-9 bg-white border border-outline-variant px-3 rounded-sm font-bold focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* 2. TL-WCT/MM (Transporter + Matchmaking) */}
                <div className="space-y-md">
                  <div className="flex items-center gap-xs">
                    <span className="w-5 h-5 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-[10px]">TR</span>
                    <h4 className="font-bold text-on-surface text-xs">TL — Transporter Welcome &amp; Matchmaking (Alex R. / Sarah C.)</h4>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                    <div className="space-y-xs">
                      <label className="block font-semibold text-on-surface-variant">Allocated Sales Target (₹)</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={tlwctSalesInput}
                        onChange={e => setTlwctSalesInput(e.target.value)}
                        className="w-full h-9 bg-white border border-outline-variant px-3 rounded-sm font-bold focus:border-primary outline-none"
                      />
                    </div>
                    <div className="space-y-xs">
                      <label className="block font-semibold text-on-surface-variant">Allocated Campaign Leads Target</label>
                      <input
                        type="number"
                        min="0"
                        required
                        value={tlwctCampaignInput}
                        onChange={e => setTlwctCampaignInput(e.target.value)}
                        className="w-full h-9 bg-white border border-outline-variant px-3 rounded-sm font-bold focus:border-primary outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-md border-t flex justify-end">
                  <button
                    type="submit"
                    className="px-xl py-2 bg-primary hover:opacity-90 text-on-primary font-bold rounded-sm shadow transition-opacity flex items-center gap-xs"
                  >
                    <span className="material-symbols-outlined text-sm">share</span>
                    PUBLISH DELEGATED TARGETS TO TLs
                  </button>
                </div>
              </form>
            </div>

            {/* Right side: Real-time pool status */}
            <div className="lg:col-span-4 bg-slate-900 text-slate-100 admin-border rounded-sm p-lg flex flex-col justify-between shadow-lg">
              <div className="space-y-lg text-slate-300">
                <div className="border-b border-white/10 pb-sm">
                  <h4 className="font-extrabold uppercase text-[10px] tracking-wider text-slate-400">Target Allocation Pool</h4>
                </div>

                {/* Sales Pool */}
                <div className="space-y-sm">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Sales Revenue Budget</span>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Corporate Cap:</span>
                    <span className="font-mono">₹{adminSalesTarget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Allocated sum:</span>
                    <span className="font-mono text-orange-400">₹{(parseFloat(tldwSalesInput) + parseFloat(tlwctSalesInput) || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Remaining unallocated:</span>
                    <span className={`font-mono ${adminSalesTarget - (parseFloat(tldwSalesInput) + parseFloat(tlwctSalesInput)) < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      ₹{(adminSalesTarget - (parseFloat(tldwSalesInput) + parseFloat(tlwctSalesInput) || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>

                {/* Campaign Leads Pool */}
                <div className="space-y-sm pt-md border-t border-white/5">
                  <span className="text-[10px] text-slate-400 uppercase font-bold tracking-wider block">Campaign Leads Pool</span>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Corporate Cap:</span>
                    <span className="font-mono">{adminCampaignTarget.toLocaleString()} Leads</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Allocated sum:</span>
                    <span className="font-mono text-blue-400">{(parseInt(tldwCampaignInput) + parseInt(tlwctCampaignInput) || 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span>Remaining unallocated:</span>
                    <span className={`font-mono ${adminCampaignTarget - (parseInt(tldwCampaignInput) + parseInt(tlwctCampaignInput)) < 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                      {(adminCampaignTarget - (parseInt(tldwCampaignInput) + parseInt(tlwctCampaignInput) || 0)).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="border-t border-white/10 pt-md mt-lg text-[9px] text-slate-500">
                TH Target chronologies are dynamically broadcasted down to the Team Leader dashboards in real-time.
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-md">
          <div className="bg-white admin-border rounded-sm shadow-2xl w-full max-w-md overflow-hidden text-xs text-xs">
            <div className="bg-primary px-lg py-md text-on-primary flex justify-between items-center">
              <h3 className="font-bold text-sm flex items-center gap-2">
                <span className="material-symbols-outlined">add_circle</span>
                New Campaign Setup
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="material-symbols-outlined hover:bg-white/10 p-1 rounded"
              >
                close
              </button>
            </div>

            <form onSubmit={handleCreateCampaign} className="p-lg space-y-md">
              <div>
                <label className="block font-semibold text-on-surface-variant mb-1 uppercase">
                  Campaign Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Q3 Transporter Retention Sprint"
                  value={newCampaignName}
                  onChange={e => setNewCampaignName(e.target.value)}
                  className="w-full h-[36px] admin-border px-3 focus:border-primary outline-none font-body-sm text-body-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-md">
                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1 uppercase">
                    Target Process
                  </label>
                  <select
                    value={newCampaignTarget}
                    onChange={e => setNewCampaignTarget(e.target.value as any)}
                    className="w-full h-[36px] admin-border px-2 bg-white focus:border-primary outline-none"
                  >
                    <option value="DW">Driver Welcome</option>
                    <option value="TR">Transporter Welcome</option>
                    <option value="MM">Matchmaking</option>
                    <option value="SC">Special Categories</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-on-surface-variant mb-1 uppercase">
                    Lead Pool Count
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newCampaignLeads}
                    onChange={e => setNewCampaignLeads(parseInt(e.target.value) || 0)}
                    className="w-full h-[36px] admin-border px-3 focus:border-primary outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-on-surface-variant mb-1 uppercase">
                  Initial Agent Allocation
                </label>
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="15"
                    value={newCampaignCallers}
                    onChange={e => setNewCampaignCallers(parseInt(e.target.value) || 0)}
                    className="flex-1 accent-primary"
                  />
                  <span className="font-mono border border-outline-variant px-3 py-1 bg-surface-container-low font-bold">
                    {newCampaignCallers}
                  </span>
                </div>
              </div>

              <div className="pt-md border-t border-outline-variant flex justify-end gap-2 text-xs">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-lg py-2 border border-outline-variant hover:bg-surface-container-low text-on-surface font-semibold rounded-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-lg py-2 bg-primary text-on-primary hover:opacity-90 font-semibold rounded-sm shadow-sm"
                >
                  Create &amp; Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
};

export default ThGlobalCampaignConsole;
