import { useState } from 'react';
import { useGetTeamSummaryQuery } from '../../services/api/incentiveApi';

export default function PodIncentiveSummary() {
  const [filterProcess, setFilterProcess] = useState<string>('all');
  const { data: teamMembers, isLoading } = useGetTeamSummaryQuery(filterProcess);

  if (isLoading || !teamMembers) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-gray-500 font-medium animate-pulse">Loading Team Incentives Roster...</div>
      </div>
    );
  }

  // Calculate aggregated pod metrics
  const totalConversions = teamMembers.reduce((sum, m) => sum + m.conversions, 0);
  const totalAccrued = teamMembers.reduce((sum, m) => sum + m.accrued, 0);
  const avgTei = teamMembers.length ? (teamMembers.reduce((sum, m) => sum + m.tei, 0) / teamMembers.length).toFixed(2) : '0';
  const unlockedCount = teamMembers.filter(m => m.gateStatus === 'Unlocked').length;

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 border-b border-gray-200 pb-5">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Team Incentives Monitor</h1>
          <p className="text-sm text-gray-500 mt-1">Review your pod members' conversion counts, salary gates, and TEI ratings</p>
        </div>
        <div className="flex items-center gap-3">
          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Process Filter:</label>
          <select
            value={filterProcess}
            onChange={(e) => setFilterProcess(e.target.value)}
            className="px-3 py-1.5 bg-white border border-gray-300 rounded-lg text-xs font-bold text-gray-700 shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Processes</option>
            <option value="dwc">Driver Welcome (DWC)</option>
            <option value="twc">Transporter Welcome (TWC)</option>
            <option value="sc">Special Categories (SC)</option>
            <option value="mm">Matchmaking (MM)</option>
          </select>
        </div>
      </div>

      {/* Aggregated KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-5 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Pod Conversions</span>
          <h2 className="text-2xl font-extrabold text-gray-800 mt-2">{totalConversions}</h2>
          <span className="text-[10.5px] text-gray-400 mt-1 block">Accumulated conversions this month</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Total Incentives Accrued</span>
          <h2 className="text-2xl font-mono font-black text-blue-600 mt-2">₹{totalAccrued.toLocaleString()}</h2>
          <span className="text-[10.5px] text-gray-400 mt-1 block">Sum of pre-TEI accrued incentive funds</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Average TEI Score</span>
          <h2 className="text-2xl font-extrabold text-indigo-600 mt-2">{avgTei} <span className="text-xs font-normal text-gray-400">/ 5.0</span></h2>
          <span className="text-[10.5px] text-gray-400 mt-1 block">Average quality telemetry modifier band</span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
          <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Gates Unlocked</span>
          <h2 className="text-2xl font-extrabold text-emerald-600 mt-2">
            {unlockedCount} <span className="text-sm font-normal text-gray-400">/ {teamMembers.length} callers</span>
          </h2>
          <span className="text-[10.5px] text-gray-400 mt-1 block">Active incentive payout receivers</span>
        </div>
      </div>

      {/* Detailed Team Table */}
      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50/50">
          <h3 className="font-bold text-gray-800 text-sm">Pod Performance Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 text-gray-500 font-bold border-b border-gray-200">
                <th className="p-3 pl-4">Caller Name</th>
                <th className="p-3">Process</th>
                <th className="p-3 text-right">Conversions</th>
                <th className="p-3 text-right">Accrued (Pre-TEI)</th>
                <th className="p-3 text-center">TEI Rating</th>
                <th className="p-3 text-center">Gate Status</th>
                <th className="p-3 pr-4">Last Activity</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 font-medium text-gray-700">
              {teamMembers.map((member) => (
                <tr key={member.id} className="hover:bg-gray-50/30 transition-colors">
                  <td className="p-3 pl-4 font-bold text-gray-900">{member.name}</td>
                  <td className="p-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-800 border border-gray-200/50">
                      {member.role} ({member.sub_role})
                    </span>
                  </td>
                  <td className="p-3 text-right font-mono font-bold text-gray-800">{member.conversions}</td>
                  <td className="p-3 text-right font-mono font-black text-gray-950">₹{member.accrued.toLocaleString()}</td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold ${
                      member.tei >= 4.5 ? 'bg-emerald-50 text-emerald-700' : member.tei >= 3.8 ? 'bg-indigo-50 text-indigo-700' : 'bg-amber-50 text-amber-700'
                    }`}>
                      {member.tei} / 5.0
                    </span>
                  </td>
                  <td className="p-3 text-center">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wide ${
                      member.gateStatus === 'Unlocked' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {member.gateStatus}
                    </span>
                  </td>
                  <td className="p-3 pr-4 text-gray-400 font-mono text-[10.5px]">{member.lastCallTime}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
