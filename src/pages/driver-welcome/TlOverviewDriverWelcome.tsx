import React from 'react';
import { useGetTlDashboardQuery } from '../../services/api/webCrmApi';

export const TlOverviewDriverWelcome: React.FC = () => {
  const { data: dashboardData, isLoading, isError } = useGetTlDashboardQuery({ department: 'dw' }, { pollingInterval: 30000 });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full min-h-[400px]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-t-primary border-outline-variant rounded-full animate-spin"></div>
          <p className="text-sm font-semibold text-outline">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (isError || !dashboardData?.status) {
    return (
      <div className="p-xl text-center text-error bg-error-container rounded-xl">
        Failed to load dashboard data. Please try again later.
      </div>
    );
  }

  const { kpis, roster, callbacks } = dashboardData.data;

  // Render Roster Status Circle
  const renderStatusCircle = (status: string) => {
    switch(status) {
      case 'Available': return <div className="h-2 w-2 rounded-full bg-green-500"></div>;
      case 'In Call': return <div className="h-2 w-2 rounded-full bg-primary"></div>;
      case 'Break': return <div className="h-2 w-2 rounded-full bg-on-error-container"></div>;
      default: return <div className="h-2 w-2 rounded-full bg-outline"></div>;
    }
  };

  return (
    <div className="space-y-lg max-w-7xl mx-auto w-full">
      <div className="grid grid-cols-12 gap-lg mb-xl">
        <div className="col-span-12 lg:col-span-8 bg-white border border-outline-variant p-lg rounded-xl flex flex-col justify-between">
          <div className="flex justify-between items-start mb-md">
            <div>
              <h2 className="font-headline-sm text-headline-sm text-primary mb-1">Team Revenue — Driver Welcome</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">Daily cumulative performance against target</p>
            </div>
            <span className="bg-primary/10 text-primary font-label-md text-label-md px-md py-sm rounded-full">LIVE TRACKING</span>
          </div>
          <div className="flex items-end gap-lg mb-lg">
            <div>
              <p className="font-label-md text-label-md text-on-surface-variant uppercase mb-xs">Current Revenue</p>
              <p className="font-display-lg text-display-lg text-on-surface">₹{kpis.currentRevenue.toLocaleString()}</p>
            </div>
            <div className="pb-1">
              <span className="text-primary font-bold">/</span>
              <span className="font-headline-md text-headline-md text-on-surface-variant ml-2">₹{kpis.targetRevenue.toLocaleString()}</span>
            </div>
            <div className="ml-auto text-right">
              <p className="font-label-md text-label-md text-primary uppercase mb-xs">Efficiency</p>
              <p className="font-headline-md text-headline-md text-primary">{kpis.efficiency}%</p>
            </div>
          </div>
          <div className="w-full h-3 rounded-full overflow-hidden bg-white">
            <div className="h-full bg-primary transition-all duration-1000 ease-out rounded-full" style={{"width": `${kpis.efficiency}%`}}></div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 bg-white border border-outline-variant p-lg rounded-xl grid grid-cols-2 gap-md">
          <div className="p-md rounded-lg border border-outline-variant/30 bg-white">
            <p className="font-label-md text-label-md text-on-surface-variant mb-xs">Total Calls</p>
            <p className="font-headline-md text-headline-md">{kpis.totalCalls.toLocaleString()}</p>
            <div className={`mt-sm flex items-center gap-1 ${kpis.callsTrend >= 0 ? 'text-primary' : 'text-error'}`}>
              <span className="material-symbols-outlined text-[14px]">
                {kpis.callsTrend >= 0 ? 'trending_up' : 'trending_down'}
              </span>
              <span className="text-[12px] font-bold">
                {kpis.callsTrend >= 0 ? '+' : ''}{kpis.callsTrend}% vs. LW
              </span>
            </div>
          </div>
          <div className="p-md rounded-lg border border-outline-variant/30 bg-white">
            <p className="font-label-md text-label-md text-on-surface-variant mb-xs">Avg Handling</p>
            <p className="font-headline-md text-headline-md">{kpis.avgHandling}</p>
            <div className="mt-sm flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">timer</span>
              <span className="text-[12px] font-bold">Today</span>
            </div>
          </div>
          <div className="p-md rounded-lg border border-outline-variant/30 bg-white">
            <p className="font-label-md text-label-md text-on-surface-variant mb-xs">SLA Compliance</p>
            <p className="font-headline-md text-headline-md text-primary">{kpis.slaCompliance}%</p>
            <div className="mt-sm w-full h-1 bg-surface-container-highest rounded-full">
              <div className="h-full bg-primary rounded-full" style={{"width": `${kpis.slaCompliance}%`}}></div>
            </div>
          </div>
          <div className="p-md rounded-lg border border-outline-variant/30 bg-white">
            <p className="font-label-md text-label-md text-on-surface-variant mb-xs">Conversion</p>
            <p className="font-headline-md text-headline-md text-on-surface">{kpis.conversion}%</p>
            <div className="mt-sm flex items-center gap-1 text-on-surface-variant">
              <span className="material-symbols-outlined text-[14px]">account_balance_wallet</span>
              <span className="text-[12px] font-bold">Today</span>
            </div>
          </div>
        </div>
      </div>

      <section className="mb-xl">
        <div className="flex justify-between items-center mb-md">
          <h3 className="font-headline-sm text-headline-sm">My Team Status <span className="text-on-surface-variant font-body-md text-body-md ml-2">({roster.length} Callers)</span></h3>
          <div className="flex gap-sm">
            <button className="bg-white border border-outline-variant px-md py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors">Filters</button>
            <button className="bg-white border border-outline-variant px-md py-sm rounded-lg font-label-md text-label-md hover:bg-surface-container-high transition-colors">Export CSV</button>
          </div>
        </div>
        <div className="flex gap-md overflow-x-auto pb-md hide-scrollbar">
          {roster.map((member) => (
            <div key={member.id} className="min-w-[180px] w-[180px] bg-white border border-outline-variant p-md rounded-lg hover:shadow-lg transition-all duration-300 group cursor-pointer">
              <div className="flex justify-between items-start mb-sm">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-primary font-bold font-label-md">{member.name.charAt(0).toUpperCase()}</span>
                </div>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.5 rounded border border-outline-variant/30 bg-blue-50 text-blue-600">DW</span>
              </div>
              <h4 className="font-body-md font-bold mb-xs truncate">{member.name}</h4>
              <div className="flex items-center gap-1 mb-md">
                {renderStatusCircle(member.status)}
                <span className="text-body-sm text-on-surface-variant font-label-md">{member.status}</span>
              </div>
              <div className="space-y-2 border-t border-outline-variant/30 pt-sm">
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Calls</span>
                  <span className="font-bold">{member.calls}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Rev</span>
                  <span className="font-bold text-primary">₹{(member.rev / 1000).toFixed(1)}k</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Queue</span>
                  <span className={`font-bold ${member.queue > 0 ? 'text-error' : ''}`}>{member.queue}</span>
                </div>
                <div className="flex justify-between text-body-sm">
                  <span className="text-on-surface-variant">Conv</span>
                  <span className="font-bold">{member.conv}%</span>
                </div>
              </div>
            </div>
          ))}
          {roster.length === 0 && (
            <div className="p-lg text-on-surface-variant">No team members found for this department.</div>
          )}
        </div>
      </section>

      <section className="bg-white border border-outline-variant rounded-xl overflow-hidden shadow-sm">
        <div className="p-lg border-b border-outline-variant flex justify-between items-center">
          <h3 className="font-headline-sm text-headline-sm">Callbacks Due Today</h3>
          <div className="flex items-center gap-md">
            <span className="text-body-sm text-on-surface-variant">Showing {callbacks.length} cases</span>
            <button className="bg-primary text-white font-label-md text-label-md px-md py-sm rounded-lg hover:brightness-110 transition-colors">Action All</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-white">
              <tr>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant">Driver ID</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant">Name</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant">Scheduled Time</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant">Assigned To</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant">Priority</th>
                <th className="px-lg py-md font-label-md text-label-md text-on-surface-variant uppercase border-b border-outline-variant">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {callbacks.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-lg py-xl text-center text-on-surface-variant font-body-md">
                    No callbacks scheduled for today.
                  </td>
                </tr>
              )}
              {callbacks.map((cb) => (
                <tr key={cb.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="px-lg py-md font-mono-data text-mono-data">#{cb.user_id}</td>
                  <td className="px-lg py-md font-body-md">{cb.user_name}</td>
                  <td className="px-lg py-md font-body-md">
                    {cb.time} 
                    {cb.is_expired && <span className="text-error font-bold text-xs ml-2">(EXPIRED)</span>}
                  </td>
                  <td className="px-lg py-md font-body-md">{cb.assigned_name}</td>
                  <td className="px-lg py-md">
                    {cb.priority === 'CRITICAL' && <span className="bg-error-container text-on-error-container text-[10px] font-bold px-md py-xs rounded">CRITICAL</span>}
                    {cb.priority === 'HIGH' && <span className="bg-orange-100 text-orange-800 text-[10px] font-bold px-md py-xs rounded">HIGH</span>}
                    {cb.priority === 'MEDIUM' && <span className="bg-primary/10 text-primary text-[10px] font-bold px-md py-xs rounded">MEDIUM</span>}
                    {cb.priority === 'LOW' && <span className="bg-surface-container-highest text-on-surface-variant text-[10px] font-bold px-md py-xs rounded">LOW</span>}
                  </td>
                  <td className="px-lg py-md">
                    <button className="text-primary font-bold text-body-sm hover:underline">Re-assign</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default TlOverviewDriverWelcome;
