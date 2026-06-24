import React, { useState, useEffect } from 'react';
import { useGetTargetQuery, useSetTargetMutation } from '../../services/api/webCrmApi';

interface Targets {
  salesTarget: number;
  campaignTarget: number;
  lastUpdated: string;
}

export const TargetAllocationConsole: React.FC = () => {
  const { data: targetData } = useGetTargetQuery('tm_admin_th_targets');
  const [saveTarget] = useSetTargetMutation();

  const [salesInput, setSalesInput] = useState('1000000');
  const [campaignInput, setCampaignInput] = useState('5000');
  const [currentTargets, setCurrentTargets] = useState<Targets>({
    salesTarget: 1000000,
    campaignTarget: 5000,
    lastUpdated: 'Never'
  });

  useEffect(() => {
    if (targetData?.value) {
      setCurrentTargets(targetData.value);
      setSalesInput(targetData.value.salesTarget.toString());
      setCampaignInput(targetData.value.campaignTarget.toString());
    }
  }, [targetData]);

  const handleSaveTargets = async (e: React.FormEvent) => {
    e.preventDefault();
    const salesVal = parseFloat(salesInput);
    const campVal = parseInt(campaignInput);
    if (isNaN(salesVal) || isNaN(campVal)) {
      alert('Please enter valid numeric values');
      return;
    }

    const updated: Targets = {
      salesTarget: salesVal,
      campaignTarget: campVal,
      lastUpdated: new Date().toLocaleString()
    };

    try {
      await saveTarget({ key: 'tm_admin_th_targets', value: updated }).unwrap();
      
      const pool = {
        totalSales: salesVal,
        totalCampaign: campVal,
        allocatedSales: 0,
        allocatedCampaign: 0,
        tldwSales: 0,
        tldwCampaign: 0,
        tlwctSales: 0,
        tlwctCampaign: 0,
        lastUpdated: new Date().toLocaleString()
      };
      await saveTarget({ key: 'tm_th_allocated_pool', value: pool }).unwrap();
      
      localStorage.setItem('tm_admin_th_targets', JSON.stringify(updated));
      localStorage.setItem('tm_th_allocated_pool', JSON.stringify(pool));
      setCurrentTargets(updated);
      alert('Targets successfully set for Telecalling Head (TH)!');
    } catch (err) {
      alert('Failed to save targets on backend. Storing locally instead.');
      localStorage.setItem('tm_admin_th_targets', JSON.stringify(updated));
      setCurrentTargets(updated);
    }
  };

  return (
    <main className="flex flex-col h-full bg-background p-md space-y-lg text-xs font-sans max-w-[1440px] mx-auto">
      {/* Page Header */}
      <section className="px-lg py-md bg-white border border-outline-variant rounded-sm flex justify-between items-center shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-body-sm font-body-sm text-on-surface-variant mb-1">
            <span>System Admin</span>
            <span>/</span>
            <span className="font-bold text-primary">Target Allocation Center</span>
          </div>
          <h1 className="font-display-sm text-display-sm text-on-surface font-bold">
            Target Allocation Console
          </h1>
          <p className="text-outline text-[11px] font-semibold mt-1">
            Set overarching organizational targets for the Telecalling Head (TH) to trigger target delegation chronology.
          </p>
        </div>
      </section>

      {/* Target Configuration Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-md">
        {/* Left Column: Input Form (7 cols) */}
        <section className="lg:col-span-7 bg-white admin-border rounded-sm shadow-sm p-lg space-y-lg">
          <div className="border-b border-outline-variant pb-md flex items-center gap-sm">
            <span className="material-symbols-outlined text-primary text-xl">track_changes</span>
            <h3 className="font-bold text-on-surface text-sm">Assign Corporate Targets to TH</h3>
          </div>

          <form onSubmit={handleSaveTargets} className="space-y-md">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
              <div className="space-y-xs">
                <label className="block font-semibold text-on-surface-variant uppercase tracking-wider text-[10px]">
                  Total Sales Revenue Target (₹)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline font-extrabold text-sm">₹</span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={salesInput}
                    onChange={e => setSalesInput(e.target.value)}
                    className="w-full h-10 pl-8 pr-3 bg-white border border-outline-variant rounded-sm focus:ring-1 focus:ring-primary outline-none font-bold text-body-sm text-on-surface"
                    placeholder="e.g. 1000000"
                  />
                </div>
                <p className="text-[10px] text-outline">Overarching revenue benchmark for the operational period.</p>
              </div>

              <div className="space-y-xs">
                <label className="block font-semibold text-on-surface-variant uppercase tracking-wider text-[10px]">
                  Campaign Leads Target (Count)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-outline material-symbols-outlined text-sm">campaign</span>
                  <input
                    type="number"
                    min="0"
                    required
                    value={campaignInput}
                    onChange={e => setCampaignInput(e.target.value)}
                    className="w-full h-10 pl-8 pr-3 bg-white border border-outline-variant rounded-sm focus:ring-1 focus:ring-primary outline-none font-bold text-body-sm text-on-surface"
                    placeholder="e.g. 5000"
                  />
                </div>
                <p className="text-[10px] text-outline">Target volume of hot/warm campaign leads to resolve.</p>
              </div>
            </div>

            <div className="pt-md border-t border-outline-variant flex justify-end">
              <button
                type="submit"
                className="px-xl py-2.5 bg-primary text-on-primary hover:opacity-90 font-bold text-body-sm rounded-sm shadow-sm transition-opacity flex items-center gap-xs"
              >
                <span className="material-symbols-outlined text-sm">publish</span>
                PUBLISH TARGETS TO TH
              </button>
            </div>
          </form>
        </section>

        {/* Right Column: Current Target Summary (5 cols) */}
        <section className="lg:col-span-5 bg-gradient-to-br from-gray-900 to-slate-800 text-white admin-border rounded-sm shadow-lg p-lg flex flex-col justify-between">
          <div>
            <div className="border-b border-white/10 pb-md mb-md flex justify-between items-center">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300">Active Published Benchmarks</h3>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-500/30">
                ACTIVE
              </span>
            </div>

            <div className="space-y-lg">
              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-3xl text-orange-400 p-2 bg-white/5 rounded">payments</span>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Sales Target</span>
                  <span className="text-xl font-extrabold font-mono text-white">₹{currentTargets.salesTarget.toLocaleString()}</span>
                </div>
              </div>

              <div className="flex items-center gap-md">
                <span className="material-symbols-outlined text-3xl text-blue-400 p-2 bg-white/5 rounded">campaign</span>
                <div>
                  <span className="text-[9px] text-slate-400 uppercase tracking-widest block font-bold">Campaign Leads Target</span>
                  <span className="text-xl font-extrabold font-mono text-white">{currentTargets.campaignTarget.toLocaleString()} Leads</span>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-md mt-lg flex items-center justify-between text-[10px] text-slate-400">
            <span>Last Updated: <strong className="text-slate-200">{currentTargets.lastUpdated}</strong></span>
            <span className="font-mono">TH Broadcast: OK</span>
          </div>
        </section>
      </div>

      {/* Corporate Target Hierarchy Flow Representation */}
      <section className="bg-white admin-border rounded-sm p-lg space-y-md">
        <h4 className="font-bold text-on-surface uppercase tracking-wider text-[11px] border-b pb-sm">Corporate Target Chronology Path</h4>
        <div className="flex flex-col md:flex-row items-center justify-between gap-md p-md bg-surface-container-low/40 rounded-sm">
          <div className="flex items-center gap-sm">
            <span className="w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center font-bold text-xs shadow">1</span>
            <div>
              <p className="font-bold text-on-surface">System Admin</p>
              <p className="text-[10px] text-outline">Publishes master organizational goals for Sales &amp; Campaigns.</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline hidden md:block">arrow_forward</span>
          <div className="flex items-center gap-sm">
            <span className="w-8 h-8 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-xs shadow">2</span>
            <div>
              <p className="font-bold text-on-surface">Telecalling Head (TH)</p>
              <p className="text-[10px] text-outline">Sub-allocates targets to Team Leaders (TL-DW &amp; TL-WCT/MM).</p>
            </div>
          </div>
          <span className="material-symbols-outlined text-outline hidden md:block">arrow_forward</span>
          <div className="flex items-center gap-sm">
            <span className="w-8 h-8 rounded-full bg-teal-500 text-white flex items-center justify-center font-bold text-xs shadow">3</span>
            <div>
              <p className="font-bold text-on-surface">Team Leaders (TL)</p>
              <p className="text-[10px] text-outline">Delegates caller quotas (Equally, Specific or Manually).</p>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};
export default TargetAllocationConsole;
