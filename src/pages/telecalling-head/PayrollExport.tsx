import { useState } from 'react';
import { useGetTeamSummaryQuery } from '../../services/api/incentiveApi';

export default function PayrollExport() {
  const { data: callers, isLoading } = useGetTeamSummaryQuery('all');
  const [exporting, setExporting] = useState<string | null>(null);

  if (isLoading || !callers) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-gray-500 font-medium animate-pulse">Loading Payroll ledger...</div>
      </div>
    );
  }

  // Calculate full payouts per caller
  const ledger = callers.map(c => {
    const baseSalary = 18000;
    const versatilityBonus = c.role === 'DWC' ? 1500 : 0;
    const finalIncentive = Math.round(c.accrued * (c.tei >= 4.5 ? 1.3 : c.tei >= 4.0 ? 1.2 : 1.0));
    const grossSalary = baseSalary + versatilityBonus + finalIncentive;
    const tds = Math.round(grossSalary * 0.1); // 10% mock TDS
    const netPayout = grossSalary - tds;

    return {
      ...c,
      baseSalary,
      versatilityBonus,
      finalIncentive,
      grossSalary,
      tds,
      netPayout
    };
  });

  const handleExport = (type: 'csv' | 'xlsx') => {
    setExporting(type);
    setTimeout(() => {
      setExporting(null);
      // Simulate file download by creating a alert
      alert(`Export Successful! Downloaded tm_connect_payroll_jun26.${type}`);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Payroll Export Console</h1>
          <p className="text-sm text-gray-500 mt-1">Review ledger calculations, versatility payouts, and run exports for ERP sync</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={() => handleExport('csv')}
            disabled={exporting !== null}
            className="px-4 py-2 border border-gray-300 bg-white text-gray-700 rounded-lg text-xs font-bold shadow-sm hover:bg-gray-50 focus:outline-none disabled:opacity-50"
          >
            {exporting === 'csv' ? 'Exporting...' : 'Export CSV'}
          </button>
          <button
            onClick={() => handleExport('xlsx')}
            disabled={exporting !== null}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-xs font-bold shadow-sm hover:bg-indigo-700 focus:outline-none disabled:opacity-50"
          >
            {exporting === 'xlsx' ? 'Exporting...' : 'Export Excel (.xlsx)'}
          </button>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-sm">Monthly Payroll Ledger — June 2026</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-500 font-bold border-b border-gray-200">
                <th className="p-3 pl-4">Caller</th>
                <th className="p-3">Process</th>
                <th className="p-3 text-right">Base Salary</th>
                <th className="p-3 text-right">Versatility Bonus</th>
                <th className="p-3 text-right">Pre-TEI Incentive</th>
                <th className="p-3 text-right">Net Incentive</th>
                <th className="p-3 text-right">Gross Salary</th>
                <th className="p-3 text-right">TDS (10%)</th>
                <th className="p-3 pr-4 text-right">Net Payout</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium text-gray-700">
              {ledger.map(row => (
                <tr key={row.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-3 pl-4 font-bold text-gray-900">{row.name}</td>
                  <td className="p-3 font-semibold text-gray-400">{row.role}</td>
                  <td className="p-3 text-right font-mono">₹{row.baseSalary.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-emerald-600">₹{row.versatilityBonus.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-gray-500">₹{row.accrued.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-indigo-600 font-bold">₹{row.finalIncentive.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono font-bold text-gray-800">₹{row.grossSalary.toLocaleString()}</td>
                  <td className="p-3 text-right font-mono text-red-500">₹{row.tds.toLocaleString()}</td>
                  <td className="p-3 pr-4 text-right font-mono font-black text-gray-950">₹{row.netPayout.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
