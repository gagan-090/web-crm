import React, { useState } from 'react';
import { useGetRateCardsQuery, useGetRateCardHistoryQuery, useUpdateRateCardMutation } from '../../services/api/incentiveApi';

export default function IncentiveConfiguration() {
  const { data: cards, isLoading: isCardsLoading } = useGetRateCardsQuery();
  const { data: history, isLoading: isHistoryLoading } = useGetRateCardHistoryQuery();
  const [updateRateCard] = useUpdateRateCardMutation();

  const [selectedRole, setSelectedRole] = useState<string>('dwc');
  const [baseRate, setBaseRate] = useState<number>(150);
  const [bonusRate, setBonusRate] = useState<number>(50);
  const [gateThreshold, setGateThreshold] = useState<number>(38000);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Sync inputs when selecting a different role card
  React.useEffect(() => {
    if (cards) {
      const active = cards.find(rc => rc.role === selectedRole);
      if (active) {
        setBaseRate(active.baseRate);
        setBonusRate(active.bonusRate);
        setGateThreshold(active.gateThreshold);
      }
    }
  }, [selectedRole, cards]);

  if (isCardsLoading || isHistoryLoading || !cards || !history) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-gray-500 font-medium animate-pulse">Loading Configuration...</div>
      </div>
    );
  }

  const activeCard = cards.find(rc => rc.role === selectedRole);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateRateCard({
        role: selectedRole,
        baseRate: Number(baseRate),
        bonusRate: Number(bonusRate),
        gateThreshold: Number(gateThreshold),
        userName: 'Admin User'
      }).unwrap();
      alert('Rate card updated successfully! Changes logged in audit trails.');
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      {/* Header Panel */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">System Incentive Configuration</h1>
          <p className="text-sm text-gray-500 mt-1">Configure base process rates, multipliers, and retroactive audit schedules</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Form Panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Active Cards Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map(rc => (
              <button
                key={rc.role}
                onClick={() => setSelectedRole(rc.role)}
                className={`p-4 rounded-xl border text-left shadow-sm transition-all ${
                  selectedRole === rc.role
                    ? 'bg-indigo-50 border-indigo-500 ring-2 ring-indigo-500/20'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{rc.role.toUpperCase()} Process</span>
                <h4 className="text-base font-black text-gray-800 mt-1.5">₹{rc.baseRate}/conversion</h4>
                <span className="text-[10px] text-gray-500 block mt-1">Gate: ₹{rc.gateThreshold.toLocaleString()}</span>
              </button>
            ))}
          </div>

          {/* Edit Form */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-800 text-sm mb-4 border-b border-gray-200 pb-2">
              Edit {selectedRole.toUpperCase()} Parameter Settings
            </h3>
            <form onSubmit={handleSave} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Base Conversion Rate (₹)</label>
                  <input
                    type="number"
                    value={baseRate}
                    onChange={e => setBaseRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Bonus Rate (₹)</label>
                  <input
                    type="number"
                    value={bonusRate}
                    onChange={e => setBonusRate(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wide block mb-1">Salary Gate Threshold (₹)</label>
                  <input
                    type="number"
                    value={gateThreshold}
                    onChange={e => setGateThreshold(Number(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-xs font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    required
                  />
                </div>
              </div>

              {/* Multipliers Display */}
              {activeCard && (
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">TEI Multipliers (Quality Bands)</span>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-semibold text-gray-600">
                    {activeCard.teiModifiers.map(mod => (
                      <div key={mod.band} className="bg-white p-2.5 rounded border border-gray-250/30">
                        <span className="text-[9px] text-gray-400 block mb-0.5">{mod.band}</span>
                        <span className="font-mono text-gray-900 font-bold">{mod.multiplier}x</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="self-end px-5 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-700 focus:outline-none disabled:opacity-50 mt-2"
              >
                {submitting ? 'Saving Configuration...' : 'Save Configuration'}
              </button>
            </form>
          </div>
        </div>

        {/* Audit Log Roster */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm overflow-hidden h-fit">
          <h3 className="font-bold text-gray-800 text-sm mb-4 border-b border-gray-200 pb-2">Audit History Trails</h3>
          <div className="flex flex-col gap-4 max-h-[420px] overflow-y-auto pr-1">
            {history.map(item => (
              <div key={item.id} className="text-xs border-b border-gray-100 pb-3 last:border-b-0">
                <div className="flex justify-between text-[10px] font-semibold text-gray-400 mb-1">
                  <span>{item.user}</span>
                  <span className="font-mono">{item.date}</span>
                </div>
                <p className="text-gray-700 font-bold leading-normal">{item.action}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
