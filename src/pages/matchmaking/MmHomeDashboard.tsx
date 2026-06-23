import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGetMmDashboardQuery, useGetMmJobsQuery } from '../../services/api/webCrmApi';

interface JobItem {
  id: string;
  transporter: string;
  plan: 'PREMIUM' | 'SUPER PREMIUM';
  route: string;
  daysLeft: number;
  totalSlaDays: number; // 7 for Super Premium, 10 for Premium
  driversShortlisted: number;
  status: 'Open' | 'In Progress' | 'SLA Risk' | 'Filled' | 'Expired';
}

export const MmHomeDashboard: React.FC = () => {
  const navigate = useNavigate();

  const { data: realDashboard } = useGetMmDashboardQuery();
  const { data: realJobsData } = useGetMmJobsQuery();

  // Simulated state
  const [driverBankUpdated, setDriverBankUpdated] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const dashboardKpis = realDashboard?.data?.kpis;
  const placementsCount = dashboardKpis?.placementsCount ?? 24;
  const targetPlacements = dashboardKpis?.targetPlacements ?? 55;
  const slaComplianceRate = dashboardKpis?.slaComplianceRate ?? 91.7;
  const activeJobsCount = dashboardKpis?.activeJobsCount ?? 7;

  // Resolve jobs from backend or fall back to mock
  const rawJobs = realJobsData?.jobs && realJobsData.jobs.length > 0 ? realJobsData.jobs : null;
  const jobs: JobItem[] = rawJobs ? rawJobs.slice(0, 5).map((job: any) => ({
    id: job.jobId || `JD-${job.id}`,
    transporter: job.transporter,
    plan: job.tier === 'SUPER PREMIUM' ? 'SUPER PREMIUM' : 'PREMIUM',
    route: job.route,
    daysLeft: job.daysOpen > 7 ? 0 : 7 - job.daysOpen,
    totalSlaDays: job.tier === 'SUPER PREMIUM' ? 7 : 10,
    driversShortlisted: 0,
    status: job.status === 'Open' ? 'Open' : (job.status === 'Filled' ? 'Filled' : 'In Progress') as any
  })) : [
    { id: 'JD-12034', transporter: 'Sharma Logistics', plan: 'SUPER PREMIUM', route: 'Delhi ➔ Mumbai', daysLeft: 1, totalSlaDays: 7, driversShortlisted: 6, status: 'SLA Risk' },
    { id: 'JD-12041', transporter: 'Anand Transport', plan: 'PREMIUM', route: 'Jaipur ➔ Pune', daysLeft: 2, totalSlaDays: 10, driversShortlisted: 4, status: 'SLA Risk' },
    { id: 'JD-12045', transporter: 'VRL Logistics', plan: 'SUPER PREMIUM', route: 'Ahmedabad ➔ Chennai', daysLeft: 5, totalSlaDays: 7, driversShortlisted: 3, status: 'In Progress' },
    { id: 'JD-12050', transporter: 'LogiForce Systems', plan: 'PREMIUM', route: 'Kolkata ➔ Patna', daysLeft: 9, totalSlaDays: 10, driversShortlisted: 1, status: 'Open' },
    { id: 'JD-12055', transporter: 'SwiftLine Shippers', plan: 'PREMIUM', route: 'Delhi ➔ Bangalore', daysLeft: 7, totalSlaDays: 10, driversShortlisted: 0, status: 'Open' }
  ];

  // SLA watches (jobs in SLA Risk column)
  const slaRiskJobs = jobs.filter(j => j.status === 'SLA Risk' || j.daysLeft / j.totalSlaDays <= 0.2);

  const handleUpdateBank = () => {
    setDriverBankUpdated(true);
    triggerToast('Driver bank updated for today ✓');
  };

  return (
    <main className="flex flex-col h-[calc(100vh-60px)] bg-gray-50 overflow-hidden relative text-xs">
      
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 flex items-center gap-1.5 animate-bounce">
          <span className="w-2 h-2 rounded-full bg-[#8E44AD]"></span>
          {toastMessage}
        </div>
      )}

      {/* TOP ALERT STRIP - SLA RISK JOBS */}
      <section className="shrink-0 p-4 pb-2">
        <div className={`border rounded-xl p-3.5 shadow-sm transition-all ${
          slaRiskJobs.length > 0 ? 'bg-red-50 border-red-200' : 'bg-white border-gray-250'
        }`}>
          <div className="flex justify-between items-center mb-2">
            <span className="font-extrabold text-gray-800 tracking-wider flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px] text-red-600 font-bold">alarm</span>
              SLA WATCH
            </span>
            {slaRiskJobs.length === 0 && (
              <span className="text-green-600 font-bold flex items-center gap-0.5">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                ✓ All on track
              </span>
            )}
          </div>

          {slaRiskJobs.length > 0 && (
            <div className="space-y-2">
              {slaRiskJobs.map(job => {
                const ratio = job.daysLeft / job.totalSlaDays;
                let countdownColor = 'text-green-600';
                if (ratio <= 0.2) countdownColor = 'text-red-600 font-bold';
                else if (ratio <= 0.5) countdownColor = 'text-amber-600 font-bold';

                return (
                  <div key={job.id} className="flex justify-between items-center bg-white p-2.5 border border-gray-150 rounded-lg shadow-sm text-[11px] font-semibold text-gray-700">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-gray-900">{job.id}</span>
                      <span className="text-gray-400">|</span>
                      <span>{job.transporter}</span>
                      <span className={`px-1.5 py-0.2 rounded text-[9.5px] font-extrabold ${
                        job.plan === 'SUPER PREMIUM' ? 'bg-purple-100 text-purple-750' : 'bg-orange-100 text-[#D35400]'
                      }`}>
                        {job.plan}
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500">{job.route}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className={countdownColor}>
                        {job.daysLeft <= 0 ? 'SLA BREACHED — Overdue' : `${job.daysLeft} day${job.daysLeft > 1 ? 's' : ''} to SLA breach`}
                      </span>
                      <button 
                        onClick={() => navigate('/mm/mm-job-board')}
                        className="bg-[#8E44AD] hover:bg-[#7D3C98] text-white px-3 py-1 rounded font-bold text-[10px] shadow"
                      >
                        Fill Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* DAILY DRIVER BANK PROMPT */}
      {!driverBankUpdated && (
        <section className="shrink-0 px-4 pb-2">
          <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2.5 rounded-xl font-bold flex justify-between items-center shadow-sm select-none">
            <span className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-amber-650 text-[18px]">announcement</span>
              ⚠️ Update your driver bank before 12 PM to maintain accurate matching recommendations.
            </span>
            <button 
              onClick={handleUpdateBank}
              className="bg-amber-600 text-white px-3 py-1 rounded hover:bg-amber-700 font-extrabold"
            >
              Update Bank
            </button>
          </div>
        </section>
      )}

      {/* Scrollable Main Area */}
      <div className="flex-1 overflow-y-auto px-4 space-y-4 pb-4">
        
        {/* KPI CARD ROW */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Card 1: Placements */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Placements This Month</span>
              <h2 className="text-xl font-extrabold text-[#8E44AD] mt-1.5">
                {placementsCount} <span className="text-xs font-normal text-gray-400">/ {targetPlacements} Target</span>
              </h2>
            </div>
            <div className="mt-3">
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="bg-[#8E44AD] h-full" style={{ width: `${(placementsCount/targetPlacements)*100}%` }}></div>
              </div>
              <div className="flex justify-between text-[9.5px] text-gray-400 font-bold mt-1.5">
                <span>{((placementsCount/targetPlacements)*100).toFixed(1)}% achieved</span>
                <span className="text-gray-500">18 Premium · 6 Super Premium</span>
              </div>
            </div>
          </div>

          {/* Card 2: SLA Compliance */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">SLA Compliance Rate</span>
              <h2 className="text-xl font-extrabold text-green-600 mt-1.5">{slaComplianceRate}%</h2>
              <span className="text-[10px] text-gray-400 mt-1 block font-semibold">{placementsCount} placements made within SLA</span>
            </div>
            <div className="text-[9.5px] font-bold text-[#8E44AD] mt-2 pt-1.5 border-t border-gray-50 uppercase tracking-wider">
              Target: 100% Compliance
            </div>
          </div>

          {/* Card 3: Assigned Jobs */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">My Assigned Jobs</span>
              <h2 className="text-xl font-extrabold text-gray-800 mt-1.5">{activeJobsCount} Jobs</h2>
            </div>
            <div className="flex gap-1.5 mt-2 text-[9.5px] font-bold select-none">
              <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded border border-blue-100">2 OPEN</span>
              <span className="bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded border border-orange-100">4 ACTIVE</span>
              <span className="bg-red-50 text-red-700 px-1.5 py-0.5 rounded border border-red-100 animate-pulse">1 SLA RISK</span>
            </div>
          </div>

          {/* Card 4: Driver Bank */}
          <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Driver Bank Status</span>
              <h2 className="text-xl font-extrabold text-gray-800 mt-1.5">68 Drivers</h2>
              <span className="text-[9.5px] text-green-600 font-bold flex items-center gap-0.5 mt-1">
                <span className="material-symbols-outlined text-[13px]">check_circle</span>
                Last updated: {driverBankUpdated ? 'Today ✓' : '2 days ago ⚠'}
              </span>
            </div>
            <button 
              onClick={() => navigate('/mm/mm-driver-bank')}
              className="text-[#8E44AD] hover:underline font-extrabold text-[10px] text-left mt-2 flex items-center gap-0.5"
            >
              Update Bank <span className="material-symbols-outlined text-[13px]">arrow_forward</span>
            </button>
          </div>

        </section>

        {/* ASSIGNED JOBS TABLE */}
        <section className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-4 py-3 bg-gray-50 border-b border-gray-200 flex justify-between items-center">
            <h3 className="font-extrabold text-gray-800 uppercase tracking-wider text-xs">My Assigned Jobs</h3>
            <button 
              onClick={() => navigate('/mm/mm-job-board')}
              className="text-[#8E44AD] hover:underline font-extrabold"
            >
              View All Jobs →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-150 text-gray-400 font-bold uppercase text-[9px]">
                  <th className="p-3 pl-4">Job ID</th>
                  <th className="p-3">Transporter</th>
                  <th className="p-3">Plan</th>
                  <th className="p-3">Route</th>
                  <th className="p-3 text-center">Days Left</th>
                  <th className="p-3 text-center">Shortlisted</th>
                  <th className="p-3 text-right pr-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-gray-700 font-medium">
                {jobs.map(job => (
                  <tr key={job.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-3 pl-4 font-mono font-bold text-gray-900">{job.id}</td>
                    <td className="p-3 font-bold text-gray-850">{job.transporter}</td>
                    <td className="p-3">
                      <span className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded border uppercase ${
                        job.plan === 'SUPER PREMIUM' ? 'bg-purple-50 text-purple-700 border-purple-200' : 'bg-orange-50 text-[#D35400] border-orange-200'
                      }`}>
                        {job.plan}
                      </span>
                    </td>
                    <td className="p-3 text-gray-500 font-semibold">{job.route}</td>
                    <td className="p-3 text-center font-mono font-bold">{job.daysLeft} d</td>
                    <td className="p-3 text-center font-mono">{job.driversShortlisted} drivers</td>
                    <td className="p-3 text-right pr-4">
                      <span className={`text-[9.5px] font-bold px-1.5 py-0.5 rounded uppercase ${
                        job.status === 'SLA Risk' ? 'bg-red-100 text-red-700' :
                        job.status === 'In Progress' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {job.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* RECENT PLACEMENTS STRIP */}
        <section className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm select-none">
          <h4 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-wider mb-2.5">Recent Placements (Handover Logs)</h4>
          <div className="flex gap-4 overflow-x-auto pb-1.5 scrollbar-hide">
            {[
              { driver: 'Suresh Yadav', transporter: 'Sharma Logistics', plan: 'SUPER PREMIUM', incentive: 50 },
              { driver: 'Devendra Pal', transporter: 'VRL Express', plan: 'PREMIUM', incentive: 30 },
              { driver: 'Amit Singh', transporter: 'SwiftLine Shippers', plan: 'PREMIUM', incentive: 30 },
              { driver: 'Harpreet Singh', transporter: 'LogiForce Systems', plan: 'SUPER PREMIUM', incentive: 50 },
              { driver: 'Balaji Roadlines', transporter: 'Agrawal Global', plan: 'PREMIUM', incentive: 30 }
            ].map((p, i) => (
              <div key={i} className="min-w-[220px] bg-gray-50 border border-gray-150 rounded-lg p-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-green-500 text-base font-bold shrink-0">check_circle</span>
                <div className="truncate">
                  <p className="font-bold text-gray-800 truncate">{p.driver} ➔ {p.transporter}</p>
                  <p className="text-[9.5px] text-gray-400 mt-0.5">{p.plan} · <span className="text-green-600 font-bold">₹{p.incentive} incentive</span></p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
};

export default MmHomeDashboard;
