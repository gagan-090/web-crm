import React, { useState } from 'react';
import KPIWidget from '../../../shared/components/business/KPIWidget';

interface OpeningItem {
  roleName: string;
  department: string;
  openCount: number;
  filledCount: number;
  status: 'active' | 'paused';
}

export const HiringDashboardPage: React.FC = () => {
  const [openings] = useState<OpeningItem[]>(
    [
      { roleName: 'Driver Welcome Caller (DW)', department: 'Telecalling Operations', openCount: 15, filledCount: 8, status: 'active' },
      { roleName: 'Transporter Welcome Caller (WCT)', department: 'Telecalling Operations', openCount: 10, filledCount: 4, status: 'active' },
      { roleName: 'Matchmaking Caller (MM)', department: 'Operations Matchmaking', openCount: 5, filledCount: 2, status: 'active' },
      { roleName: 'QC Analyst', department: 'Quality Assurance & Compliance', openCount: 2, filledCount: 1, status: 'paused' }
    ]
  );

  return (
    <div className="space-y-md">
      {/* HR metrics */}
      <div className="grid grid-cols-4 gap-md">
        <KPIWidget title="Total Headcount" value="48 Employees" subtext="43 Active, 5 Onboarding" icon="badge" />
        <KPIWidget title="Active Recruitment Openings" value="32 Openings" subtext="Across 4 categories" icon="hiring" />
        <KPIWidget title="Candidate Interviews Today" value="12 Scheduled" subtext="6 Completed" color="text-amber-600" icon="calendar_today" />
        <KPIWidget title="Monthly Hiring Target" value="14 / 20 Hired" subtext="70% Progress" icon="track_changes" />
      </div>

      {/* Pipeline Funnel Stage Cards */}
      <section className="grid grid-cols-4 gap-md">
        {[
          { stage: 'Applied (आवेदन)', count: 242, color: 'border-l-4 border-primary bg-primary-fixed/20' },
          { stage: 'Screening / Interview', count: 48, color: 'border-l-4 border-amber-500 bg-amber-500/10' },
          { stage: 'Offered Status', count: 18, color: 'border-l-4 border-orange-500 bg-orange-500/10' },
          { stage: 'Onboarded Employees', count: 14, color: 'border-l-4 border-green-500 bg-green-500/10' }
        ].map((funnel, idx) => (
          <div key={idx} className={`p-md border border-outline-variant rounded-sm flipkart-shadow ${funnel.color}`}>
            <h4 className="text-xs font-bold text-outline uppercase tracking-wider">{funnel.stage}</h4>
            <p className="text-xl font-extrabold text-on-surface mt-sm">{funnel.count} Candidates</p>
          </div>
        ))}
      </section>

      {/* Active Recruitment details table */}
      <div className="bg-white border border-outline-variant rounded-sm p-md flipkart-shadow">
        <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface mb-md">
          Active Job Openings & Staffing
        </h3>

        <div className="overflow-x-auto border border-outline-variant rounded-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="p-sm font-label-caps text-outline font-bold">Role Name</th>
                <th className="p-sm font-label-caps text-outline font-bold">Department</th>
                <th className="p-sm font-label-caps text-outline font-bold">Open Positions</th>
                <th className="p-sm font-label-caps text-outline font-bold">Candidates Filled</th>
                <th className="p-sm font-label-caps text-outline font-bold">Pipeline Target</th>
                <th className="p-sm font-label-caps text-outline font-bold">Recruitment Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {openings.map((o, index) => (
                <tr key={index} className="hover:bg-surface-container-low transition-colors bg-white">
                  <td className="p-sm font-bold text-on-surface">{o.roleName}</td>
                  <td className="p-sm text-outline font-semibold">{o.department}</td>
                  <td className="p-sm font-semibold">{o.openCount}</td>
                  <td className="p-sm font-semibold">{o.filledCount}</td>
                  <td className="p-sm">
                    <div className="flex items-center gap-sm">
                      <span className="font-semibold">{Math.round((o.filledCount / o.openCount) * 100)}%</span>
                      <div className="h-1.5 w-24 bg-surface-container rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${(o.filledCount / o.openCount) * 100}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-sm">
                    <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold border ${
                      o.status === 'active' ? 'bg-green-100 text-green-800 border-green-300' : 'bg-gray-100 text-gray-800 border-gray-300'
                    }`}>
                      {o.status.toUpperCase()}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default HiringDashboardPage;
