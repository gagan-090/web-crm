import React, { useState, useMemo } from 'react';

interface CallerSprint {
  name: string;
  initials: string;
  limit: number;
  attempted: number;
  conversion: string;
  trend: 'up' | 'down' | 'flat';
  status: 'COMPLETING' | 'IN PROGRESS' | 'IDLE / ALERT';
  bgClass: string;
}

export const ThBacklogSprintManager: React.FC = () => {
  return (
    <main className="p-md min-h-[calc(100vh-56px)] bg-white relative">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 bg-slate-900 text-white text-xs px-4 py-2.5 rounded shadow-xl z-50 transition-all font-bold">
          {toast}
        </div>
      )}

      {/* Backlog Sprint Health Card */}
      <section className="mb-lg bg-white border border-outline-variant p-lg rounded relative overflow-hidden shadow-xs">
        <div className="flex justify-between items-center">
          <div className="z-10">
            <p className="text-label-caps text-on-surface-variant uppercase tracking-wider mb-1">Backlog Sprint Health</p>
            <div className="flex items-baseline gap-4">
              <h2 className="text-[42px] font-extrabold text-primary leading-none">37,384</h2>
              <span className="text-lg font-bold text-on-surface-variant">Uncalled Leads</span>
            </div>
            <p className="mt-2 text-sm text-on-surface-variant flex items-center gap-1">
              <span className="text-error font-bold">+12%</span> volume increase from last 48 hours
              <span className="material-symbols-outlined text-error text-[18px]">trending_up</span>
            </p>
          </div>
          <div className="flex gap-lg z-10">
            <div className="text-center px-lg border-l border-outline-variant">
              <p className="text-label-caps text-on-surface-variant">Est. Clearance</p>
              <p className="text-xl font-bold text-slate-800">4.2 Days</p>
            </div>
            <div className="text-center px-lg border-l border-outline-variant">
              <p className="text-label-caps text-on-surface-variant">Avg. Aging</p>
              <p className="text-xl font-bold text-slate-800">18 Days</p>
            </div>
          </div>
        </div>

        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
          <span className="material-symbols-outlined text-[200px]" style={{ fontVariationSettings: "'FILL' 1" }}>history</span>
        </div>
      </section>

      <div className="bento-grid gap-md">
        {/* Assign Funnel Callers Card */}
        <div className="col-span-12 lg:col-span-8 bg-white border border-outline-variant p-md rounded shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-md">
              <h3 className="font-headline-md text-on-surface flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">person_add</span>
                Assign Funnel Callers
              </h3>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${sprintActive ? 'bg-primary text-white' : 'bg-slate-200 text-slate-600'
                  }`}>
                  {sprintActive ? 'SPRINT ACTIVE' : 'SPRINT INACTIVE'}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-md mb-lg">
              <div className="space-y-1">
                <label className="text-label-caps text-[11px] text-on-surface-variant">SELECT CALLER TEAM</label>
                <select
                  value={selectedTeam}
                  onChange={(e) => setSelectedTeam(e.target.value as any)}
                  className="w-full bg-white border border-outline-variant rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-slate-800 font-semibold"
                >
                  <option value="level2">Level 2 Support (14 Callers)</option>
                  <option value="velocity">High Velocity Team (8 Callers)</option>
                  <option value="retention">Retention Specialists (5 Callers)</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-label-caps text-[11px] text-on-surface-variant">DATE RANGE</label>
                <div className="relative">
                  <input
                    className="w-full bg-white border border-outline-variant rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-slate-850 font-semibold"
                    type="text"
                    value={dateRange}
                    onChange={(e) => setDateRange(e.target.value)}
                  />
                  <span className="material-symbols-outlined absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant text-[18px]">calendar_month</span>
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-label-caps text-[11px] text-on-surface-variant">CALL LIMIT (DAILY)</label>
                <input
                  className="w-full bg-white border border-outline-variant rounded px-3 py-2 text-sm focus:ring-1 focus:ring-primary outline-none text-slate-800 font-semibold"
                  type="number"
                  value={dailyLimit}
                  onChange={(e) => setDailyLimit(Number(e.target.value))}
                />
              </div>
            </div>

            <div className="border-t border-outline-variant pt-md">
              <div className="flex items-center justify-between mb-sm">
                <p className="text-sm font-bold text-slate-800">Projected Capacity</p>
                <p className="text-sm text-on-surface-variant font-bold">{projectedCapacity.toLocaleString()} calls / day</p>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-primary h-full transition-all duration-355" style={{ width: `${capacityProgressWidth}%` }}></div>
              </div>
            </div>
          </div>

          <div className="mt-lg flex gap-md">
            <button
              onClick={handleDeploySprint}
              className="bg-primary text-white px-xl py-2 rounded font-bold text-sm hover:bg-primary-container transition-all flex items-center gap-2 active:scale-98"
            >
              <span className="material-symbols-outlined text-[20px]">rocket_launch</span>
              DEPLOY SPRINT
            </button>
            <button
              onClick={handleCancelSprint}
              className="border border-outline-variant text-on-surface px-lg py-2 rounded font-bold text-sm hover:bg-slate-50 transition-all active:scale-98"
            >
              CANCEL
            </button>
          </div>
        </div>

        {/* Sprint Progress Card */}
        <div className="col-span-12 lg:col-span-4 bg-white border border-outline-variant p-md rounded shadow-xs flex flex-col items-center justify-center text-center">
          <h3 className="font-label-caps text-on-surface-variant mb-6 uppercase tracking-widest">Sprint Progress</h3>
          <div className="relative w-48 h-48 mb-6">
            <svg className="w-full h-full">
              <circle className="text-slate-100" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeWidth="12"></circle>
              <circle className="text-primary progress-ring" cx="96" cy="96" fill="transparent" r="80" stroke="currentColor" strokeDasharray="502.6" strokeDashoffset={sprintActive ? '125.6' : '502.6'} strokeLinecap="round" strokeWidth="12" style={{ transition: 'stroke-dashoffset 0.5s' }}></circle>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-extrabold text-slate-800">{sprintActive ? '75%' : '0%'}</span>
              <span className="text-[10px] text-on-surface-variant font-bold">OF DAILY GOAL</span>
            </div>
          </div>
          <div className="w-full grid grid-cols-2 gap-md divide-x divide-outline-variant">
            <div>
              <p className="text-xl font-bold text-primary">{sprintActive ? '15,482' : '0'}</p>
              <p className="text-[10px] text-on-surface-variant font-bold">ATTEMPTED</p>
            </div>
            <div>
              <p className="text-xl font-bold text-on-surface">{sprintActive ? '20,643' : '0'}</p>
              <p className="text-[10px] text-on-surface-variant font-bold">DAILY GOAL</p>
            </div>
          </div>
        </div>

        {/* Conversion Efficiency Card */}
        <div className="col-span-12 bg-white border border-outline-variant p-md rounded shadow-xs">
          <div className="flex items-center justify-between mb-lg">
            <div>
              <h3 className="font-headline-md text-on-surface text-slate-800 font-bold">Conversion Efficiency</h3>
              <p className="text-sm text-on-surface-variant">Analyzing yield performance of aged vs real-time leads</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-primary rounded-sm"></span>
                <span className="text-xs font-bold">BACKLOG</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 bg-secondary rounded-sm"></span>
                <span className="text-xs font-bold">FRESH</span>
              </div>
            </div>
          </div>
          <div className="h-64 w-full flex items-end justify-around gap-gutter px-xl pb-base relative">
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none px-xl mb-base">
              <div className="border-t border-outline-variant w-full h-0"></div>
              <div className="border-t border-outline-variant w-full h-0"></div>
              <div className="border-t border-outline-variant w-full h-0"></div>
              <div className="border-t border-outline-variant w-full h-0"></div>
            </div>

            {['ZONE A', 'ZONE B', 'ZONE C', 'ZONE D', 'ZONE E'].map((zone, idx) => {
              const heights = [
                { b: 'h-[45%]', f: 'h-[85%]' },
                { b: 'h-[60%]', f: 'h-[75%]' },
                { b: 'h-[30%]', f: 'h-[65%]' },
                { b: 'h-[70%]', f: 'h-[80%]' },
                { b: 'h-[55%]', f: 'h-[90%]' }
              ][idx];
              const backlogVal = ['4.5%', '6.2%', '3.1%', '9.8%', '5.8%'][idx];
              const freshVal = ['12.4%', '10.1%', '8.5%', '11.2%', '14.0%'][idx];
              const backlogCount = ['450 Leads', '620 Leads', '310 Leads', '980 Leads', '580 Leads'][idx];
              const freshCount = ['1,240 Leads', '1,010 Leads', '850 Leads', '1,120 Leads', '1,400 Leads'][idx];

              return (
                <div key={idx} className="flex flex-col items-center gap-2 w-full max-w-[100px] z-10">
                  <div className="flex gap-1.5 w-full h-48 items-end">
                    {/* Backlog Bar */}
                    <div className={`bg-primary/90 w-1/2 ${heights.b} rounded-t-sm transition-all hover:bg-primary relative group cursor-pointer`}>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] p-2 rounded shadow-lg pointer-events-none hidden group-hover:block z-30 whitespace-nowrap min-w-[110px] text-center">
                        <p className="font-bold text-primary-fixed">{zone}</p>
                        <p className="font-semibold text-white">Backlog Conversion</p>
                        <p className="text-secondary-fixed-dim font-bold mt-0.5">{backlogVal} ({backlogCount})</p>
                      </div>
                    </div>
                    {/* Fresh Bar */}
                    <div className={`bg-secondary-container w-1/2 ${heights.f} rounded-t-sm transition-all hover:bg-secondary relative group cursor-pointer`}>
                      {/* Tooltip */}
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-slate-900 text-white text-[10px] p-2 rounded shadow-lg pointer-events-none hidden group-hover:block z-30 whitespace-nowrap min-w-[110px] text-center">
                        <p className="font-bold text-secondary-fixed-dim">{zone}</p>
                        <p className="font-semibold text-white">Fresh Conversion</p>
                        <p className="text-primary-fixed font-bold mt-0.5">{freshVal} ({freshCount})</p>
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-bold text-on-surface-variant uppercase">{zone}</span>
                </div>
              );
            })}
          </div>
          <div className="mt-md p-md bg-amber-50/50 rounded border-l-4 border-secondary flex items-start gap-md">
            <span className="material-symbols-outlined text-secondary">insights</span>
            <div>
              <p className="text-sm font-bold text-slate-800">Efficiency Insight</p>
              <p className="text-xs text-on-surface-variant">Backlog leads in <span className="font-bold">Zone D</span> are outperforming Zone A by 25%. Consider reallocating higher capacity callers to Zone D to maximize immediate conversion recovery.</p>
            </div>
          </div>
        </div>

        {/* Active Caller Performance Table Card */}
        <div className="col-span-12 bg-white border border-outline-variant rounded shadow-xs overflow-hidden">
          <div className="p-md border-b border-outline-variant flex justify-between items-center bg-slate-50">
            <h3 className="font-label-caps font-bold text-slate-800">Active Sprint Performance (Real-time)</h3>
            <button
              onClick={() => setShowActiveSprintsModal(true)}
              className="text-primary font-bold text-xs hover:underline"
            >
              View All Active Sprints
            </button>
          </div>
          <table className="w-full text-left border-collapse">
            <thead className="bg-white text-on-surface-variant text-[11px] font-bold uppercase tracking-wider border-b border-outline-variant">
              <tr>
                <th className="px-md py-3">CALLER IDENTITY</th>
                <th className="px-md py-3 text-center">LIMIT</th>
                <th className="px-md py-3 text-center">ATTEMPTED</th>
                <th className="px-md py-3 text-center">CONVERSION %</th>
                <th className="px-md py-3 text-right">STATUS</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y divide-outline-variant">
              {callersData.map((c, i) => (
                <tr key={i} className="hover:bg-slate-50 transition-colors">
                  <td className="px-md py-3">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 text-[10px] flex items-center justify-center font-bold">{c.initials}</div>
                      <span className="font-bold text-slate-800">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-md py-3 text-center font-data-mono text-xs">{sprintActive ? c.limit : 0}</td>
                  <td className="px-md py-3 text-center font-data-mono text-xs">{sprintActive ? c.attempted : 0}</td>
                  <td className="px-md py-3 text-center">
                    <div className="flex items-center justify-center gap-1">
                      <span className={`font-bold ${c.trend === 'up' ? 'text-primary' : c.trend === 'down' ? 'text-error' : 'text-slate-600'}`}>{c.conversion}</span>
                      <span className={`material-symbols-outlined text-[14px] ${c.trend === 'up' ? 'text-primary' : c.trend === 'down' ? 'text-error' : 'text-slate-400'}`}>
                        {c.trend === 'up' ? 'trending_up' : c.trend === 'down' ? 'trending_down' : 'horizontal_rule'}
                      </span>
                    </div>
                  </td>
                  <td className="px-md py-3 text-right">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${!sprintActive ? 'bg-slate-100 text-slate-500' :
                        c.status === 'COMPLETING' ? 'bg-blue-100 text-blue-800' :
                          c.status === 'IN PROGRESS' ? 'bg-slate-100 text-slate-700' : 'bg-red-100 text-red-800'
                      }`}>{sprintActive ? c.status : 'INACTIVE'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Active Sprints Modal */}
      {showActiveSprintsModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-xs">
          <div className="bg-white p-6 rounded-md shadow-2xl w-[450px] border border-outline-variant max-w-full">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-sm font-extrabold uppercase text-primary">All Active Sprints</h3>
              <button onClick={() => setShowActiveSprintsModal(false)} className="text-slate-400 hover:text-slate-600">
                <span className="material-symbols-outlined">close</span>
              </button>
            </div>
            <div className="divide-y divide-outline-variant max-h-[300px] overflow-y-auto pr-2 custom-scrollbar text-xs">
              {[
                { name: 'Level 2 Backlog Sprint', team: 'Level 2 Support', limit: '150/agent', status: 'ACTIVE' },
                { name: 'High Velocity Lead Recovery', team: 'High Velocity Team', limit: '200/agent', status: 'COMPLETED' },
                { name: 'Retention Recovery Campaign', team: 'Retention Specialists', limit: '100/agent', status: 'SUSPENDED' }
              ].map((s, i) => (
                <div key={i} className="py-3 flex justify-between items-center">
                  <div>
                    <h4 className="font-bold text-slate-800">{s.name}</h4>
                    <p className="text-[10px] text-slate-400">Team: {s.team} • Call Limit: {s.limit}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${s.status === 'ACTIVE' ? 'bg-green-100 text-green-800' :
                      s.status === 'COMPLETED' ? 'bg-blue-100 text-blue-800' : 'bg-slate-100 text-slate-500'
                    }`}>{s.status}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-end pt-4 border-t border-outline-variant mt-4">
              <button
                type="button"
                onClick={() => setShowActiveSprintsModal(false)}
                className="px-4 py-2 bg-primary text-white rounded text-xs font-bold hover:bg-primary-container"
              >
                Close Dialog
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ThBacklogSprintManager;
