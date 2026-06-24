import { useGetTeamParityQuery } from '../../services/api/incentiveApi';

export default function ParityEquityDashboard() {
  const { data: parities, isLoading } = useGetTeamParityQuery();

  if (isLoading || !parities) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-gray-500 font-medium animate-pulse">Loading Parity & Equity Analysis...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      {/* Header Panel */}
      <div className="flex justify-between items-center mb-6 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Process Equity & Parity Monitor</h1>
          <p className="text-sm text-gray-500 mt-1">Audit average calling payouts across processes and identify statistical outlier agents</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parity bars chart */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-4 border-b border-gray-200 pb-2">Average Payout by Calling Process</h3>
          <div className="flex flex-col gap-6 py-2">
            {parities.map(p => (
              <div key={p.processName} className="text-xs font-semibold">
                <div className="flex justify-between mb-1.5">
                  <span className="text-gray-900 font-bold text-sm">{p.processName}</span>
                  <span className="font-mono text-indigo-600 font-black text-sm">₹{p.averageIncentive.toLocaleString()}</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-4 overflow-hidden relative border border-gray-250/20">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all"
                    style={{ width: `${Math.min(100, (p.averageIncentive / 45000) * 100)}%` }}
                  />
                </div>
                <div className="flex justify-between mt-1 text-[10.5px] text-gray-400 font-bold">
                  <span>Top Performer: <span className="text-emerald-600">{p.topEarner}</span></span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Statistical outliers */}
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <h3 className="font-bold text-gray-800 text-sm mb-4 border-b border-gray-200 pb-2">Outlier Detection & Auditing</h3>
          <div className="flex flex-col gap-4">
            {parities.map(p => (
              <div key={p.processName} className="text-xs">
                <span className="text-gray-400 font-bold block mb-1.5">{p.processName}</span>
                {p.outliersCount > 0 ? (
                  <div className="flex flex-col gap-2">
                    {p.outliers.map(out => (
                      <div key={out} className="flex items-center gap-2.5 bg-red-50 border border-red-100 p-2.5 rounded-lg text-red-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping" />
                        <span className="font-bold">{out}</span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-emerald-50 border border-emerald-100 p-2.5 rounded-lg text-emerald-800 font-bold">
                    ✓ All callers within normal standard deviation limits
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
