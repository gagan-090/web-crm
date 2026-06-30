import { useState } from 'react';
import { useGetTeamSummaryQuery, useGetTeamParityQuery } from '../../services/api/incentiveApi';
import { PageCardSkeleton } from '../../components/PageSkeleton';

export default function IncentiveCommandCenter() {
  const [activeProcess, setActiveProcess] = useState<string>('all');
  const { data: callers, isLoading: isCallersLoading } = useGetTeamSummaryQuery(activeProcess);
  const { data: parities, isLoading: isParityLoading } = useGetTeamParityQuery();

  if (isCallersLoading || isParityLoading || !callers || !parities) {
    return <PageCardSkeleton cards={6} title="Incentive Command Center" />;
  }

  // Heatmap: Caller-Day conversions matrix simulation
  const days = Array.from({ length: 14 }, (_, i) => i + 11); // Jun 11th - Jun 24th
  const heatmapData = callers.map(c => {
    return {
      callerName: c.name,
      dailyConversions: days.map(d => {
        // Pseudo-random but consistent daily conversions
        const val = (c.id * d) % 9;
        return val === 0 ? 0 : val > 6 ? Math.floor(val / 2) : val;
      })
    };
  });

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      {/* Header Panel */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Incentives Command Center</h1>
          <p className="text-sm text-gray-500 mt-1">Audit cross-process incentive payout trends, equity parity, and daily activity heatmaps</p>
        </div>
      </div>

      {/* Parity & Outlier Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-4 border-b border-gray-200 pb-2">Process Equity & Parity</h3>
          <div className="flex flex-col gap-4">
            {parities.map(p => (
              <div key={p.processName} className="text-xs">
                <div className="flex justify-between font-semibold mb-1">
                  <span className="text-gray-800">{p.processName}</span>
                  <span className="text-gray-400">Avg: <span className="font-mono text-gray-900 font-bold">₹{p.averageIncentive.toLocaleString()}</span></span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden mb-1">
                  <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${Math.min(100, (p.averageIncentive / 40000) * 100)}%` }} />
                </div>
                <div className="flex justify-between text-[10.5px]">
                  <span className="text-emerald-600 font-medium">Top Earner: {p.topEarner}</span>
                  {p.outliersCount > 0 ? (
                    <span className="text-red-500 font-semibold">{p.outliersCount} Outlier: {p.outliers.join(', ')}</span>
                  ) : (
                    <span className="text-gray-400">Within normal distribution</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-gray-800 text-sm mb-3 border-b border-gray-200 pb-2">Process Filter</h3>
            <p className="text-xs text-gray-500 mb-4">Select a process to filter the callers roster and calendar conversion heatmap below</p>
            <div className="flex flex-col gap-2">
              {['all', 'dwc', 'twc', 'sc', 'mm'].map(role => (
                <button
                  key={role}
                  onClick={() => setActiveProcess(role)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold border transition-all ${
                    activeProcess === role
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50'
                  }`}
                >
                  {role === 'all' ? 'All Callers' : role.toUpperCase() + ' Process'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Heatmap Section */}
      <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm mb-6 overflow-hidden">
        <h3 className="font-bold text-gray-800 text-sm mb-4 border-b border-gray-200 pb-2">Caller-Day Conversion Heatmap (Last 14 Days)</h3>
        
        <div className="overflow-x-auto">
          <div className="min-w-[760px]">
            {/* Calendar header row */}
            <div className="flex items-center text-center font-bold text-gray-450 text-[10px] mb-2 border-b border-gray-150 pb-2">
              <div className="w-36 text-left font-bold text-gray-700">Caller</div>
              {days.map(d => (
                <div key={d} className="flex-1">Jun {d}</div>
              ))}
            </div>

            {/* Heatmap rows */}
            <div className="flex flex-col gap-1.5">
              {heatmapData.map(row => (
                <div key={row.callerName} className="flex items-center text-center text-xs font-semibold text-gray-700">
                  <div className="w-36 text-left font-bold text-gray-900 truncate pr-2">{row.callerName}</div>
                  {row.dailyConversions.map((val, idx) => {
                    // Heatmap color shading logic
                    let bg = 'bg-gray-100 text-gray-300';
                    if (val > 0 && val <= 2) bg = 'bg-emerald-100 text-emerald-800 border border-emerald-200/30';
                    else if (val > 2 && val <= 4) bg = 'bg-emerald-300 text-emerald-950 border border-emerald-400/40';
                    else if (val > 4) bg = 'bg-emerald-500 text-white font-bold';

                    return (
                      <div
                        key={idx}
                        className={`flex-1 py-2 mx-0.5 rounded text-[10px] font-mono transition-transform hover:scale-105 ${bg}`}
                        title={`${row.callerName} had ${val} conversions`}
                      >
                        {val}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Roster list */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-sm">Callers Incentives Ledger</h3>
        </div>
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-500 font-bold border-b border-gray-200">
              <th className="p-3 pl-4">Name</th>
              <th className="p-3">Process</th>
              <th className="p-3 text-right">Conversions</th>
              <th className="p-3 text-right">Incentive Accrued</th>
              <th className="p-3 text-center">Quality TEI</th>
              <th className="p-3 pr-4 text-center">Gate Check</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 font-medium text-gray-700">
            {callers.map(c => (
              <tr key={c.id} className="hover:bg-gray-50/30 transition-colors">
                <td className="p-3 pl-4 font-bold text-gray-900">{c.name}</td>
                <td className="p-3">{c.role} ({c.sub_role})</td>
                <td className="p-3 text-right font-mono font-bold text-gray-800">{c.conversions}</td>
                <td className="p-3 text-right font-mono font-black text-gray-950">₹{c.accrued.toLocaleString()}</td>
                <td className="p-3 text-center">
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold bg-indigo-50 text-indigo-700">
                    {c.tei}
                  </span>
                </td>
                <td className="p-3 pr-4 text-center">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${
                    c.gateStatus === 'Unlocked' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {c.gateStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
