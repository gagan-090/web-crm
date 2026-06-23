import React from 'react';
import { useGetQcDashboardQuery } from '../../services/api/webCrmApi';

export const QcConsoleHome: React.FC = () => {
  const { data: realDashboard } = useGetQcDashboardQuery();

  const kpis = realDashboard?.data?.kpis;
  const avgScore = kpis?.avgScore ?? 78.4;
  const fatalCount = kpis?.fatalCount ?? 0;
  const pendingAudits = kpis?.pendingAudits ?? 14;
  const auditedCount = kpis?.auditedCount ?? 12;

  return (
    <main className=" md:ml-[200px] flex flex-col min-h-screen">



      <div className="p-margin-desktop space-y-stack-md max-w-7xl mx-auto w-full">

        <section className="mb-8">
          <h1 className="font-display text-display text-slate-800">Good morning, Pooja Chaudhary — QC Analyst</h1>
          <p className="text-slate-500 font-body-md mt-1">Here is your quality control overview for the current cycle.</p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter">
          <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-amber-500/10 flex items-center justify-center text-primary">
              <span className="material-symbols-outlined" data-icon="analytics" style={{ "fontVariationSettings": "\'FILL\' 1" }}>analytics</span>
            </div>
            <div>
              <p className="text-label-caps text-slate-500">TEAM AVG QC SCORE</p>
              <p className="text-headline-md font-bold text-primary">78.4</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-error/10 flex items-center justify-center text-error">
              <span className="material-symbols-outlined" data-icon="trending_down">trending_down</span>
            </div>
            <div>
              <p className="text-label-caps text-slate-500">CALLERS &lt; 65</p>
              <p className="text-headline-md font-bold text-slate-800">2</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 p-4 rounded-xl flex items-center gap-4">
            <div className="w-12 h-12 rounded bg-tertiary/10 flex items-center justify-center text-tertiary">
              <span className="material-symbols-outlined" data-icon="repeat">repeat</span>
            </div>
            <div>
              <p className="text-label-caps text-slate-500">REPEAT ERRORS</p>
              <p className="text-headline-md font-bold text-slate-800">4</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">

          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="font-headline-md text-headline-md text-slate-800">Weekly Progress</h3>
                  <p className="text-primary font-bold font-body-lg">12 of 20 calls audited this week</p>
                </div>
                <span className="material-symbols-outlined text-primary" data-icon="query_stats">query_stats</span>
              </div>
              <div className="w-full h-3 bg-slate-100est rounded-full mb-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 h-full bg-amber-500 transition-all duration-500" style={{ "width": "60%" }}></div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-3 border border-slate-200 rounded-lg bg-white/30">
                  <p className="text-label-caps text-slate-500 mb-1">DW</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-headline-md">5/5</span>
                    <span className="material-symbols-outlined text-emerald-500" data-icon="check_circle" style={{ "fontVariationSettings": "\'FILL\' 1" }}>check_circle</span>
                  </div>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg bg-white/30">
                  <p className="text-label-caps text-slate-500 mb-1">TR</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-headline-md">3/5</span>
                    <span className="text-slate-500 opacity-30 material-symbols-outlined" data-icon="pending">pending</span>
                  </div>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg bg-white/30">
                  <p className="text-label-caps text-slate-500 mb-1">MM</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-headline-md">2/5</span>
                    <span className="text-slate-500 opacity-30 material-symbols-outlined" data-icon="pending">pending</span>
                  </div>
                </div>
                <div className="p-3 border border-slate-200 rounded-lg bg-white/30">
                  <p className="text-label-caps text-slate-500 mb-1">SC</p>
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-headline-md">2/5</span>
                    <span className="text-slate-500 opacity-30 material-symbols-outlined" data-icon="pending">pending</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 flex flex-col gap-gutter">
            <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-xl flex flex-col items-center justify-center text-center h-full">
              <div className="w-16 h-16 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-600 mb-4">
                <span className="material-symbols-outlined text-4xl" data-icon="verified" style={{ "fontVariationSettings": "\'FILL\' 1" }}>verified</span>
              </div>
              <h3 className="font-headline-md text-emerald-900">0 fatal errors this week</h3>
              <p className="text-emerald-700 font-body-sm mt-2">Team performance is within critical threshold.</p>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-6 rounded-xl flex items-center gap-4">
              <div className="flex-shrink-0 w-12 h-12 bg-amber-200/50 rounded flex items-center justify-center text-amber-700">
                <span className="material-symbols-outlined" data-icon="warning" style={{ "fontVariationSettings": "\'FILL\' 1" }}>warning</span>
              </div>
              <div>
                <p className="font-bold text-slate-800 text-headline-sm">3 untagged calls</p>
                <p className="text-body-sm text-slate-500">detected in CRM today</p>
                <a className="text-amber-800 text-label-caps mt-2 block underline" href="#">Fix now</a>
              </div>
            </div>
          </div>

          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-slate-200 bg-white flex justify-between items-center">
              <div>
                <h3 className="font-headline-md text-headline-md">Pending Feedback</h3>
                <p className="text-body-sm text-slate-500">4 feedbacks sent — not yet acknowledged</p>
              </div>
              <button className="text-primary font-bold text-label-md hover:underline">View All</button>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-white">
                    <th className="p-inset-table font-label-caps text-slate-500 uppercase border-b border-slate-200">Caller</th>
                    <th className="p-inset-table font-label-caps text-slate-500 uppercase border-b border-slate-200">Score</th>
                    <th className="p-inset-table font-label-caps text-slate-500 uppercase border-b border-slate-200">Sent</th>
                    <th className="p-inset-table font-label-caps text-slate-500 uppercase border-b border-slate-200 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  <tr className="hover:bg-white transition-colors group">
                    <td className="p-inset-table text-table-data font-bold">Rahul S.</td>
                    <td className="p-inset-table text-table-data">
                      <span className="px-2 py-0.5 rounded bg-on-primary-container text-white font-bold">72</span>
                    </td>
                    <td className="p-inset-table text-table-data text-slate-500">2 days ago</td>
                    <td className="p-inset-table text-right">
                      <button className="bg-slate-100est hover:bg-amber-500 hover:text-white px-3 py-1 rounded text-label-caps transition-all">Resend reminder</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="p-inset-table text-table-data font-bold">Priya V.</td>
                    <td className="p-inset-table text-table-data">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-white font-bold">85</span>
                    </td>
                    <td className="p-inset-table text-table-data text-slate-500">3 days ago</td>
                    <td className="p-inset-table text-right">
                      <button className="bg-slate-100est hover:bg-amber-500 hover:text-white px-3 py-1 rounded text-label-caps transition-all">Resend reminder</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="p-inset-table text-table-data font-bold">Amit K.</td>
                    <td className="p-inset-table text-table-data">
                      <span className="px-2 py-0.5 rounded bg-error text-white font-bold">58</span>
                    </td>
                    <td className="p-inset-table text-table-data text-slate-500">4 days ago</td>
                    <td className="p-inset-table text-right">
                      <button className="bg-slate-100est hover:bg-amber-500 hover:text-white px-3 py-1 rounded text-label-caps transition-all">Resend reminder</button>
                    </td>
                  </tr>
                  <tr className="hover:bg-white transition-colors">
                    <td className="p-inset-table text-table-data font-bold">Sneha L.</td>
                    <td className="p-inset-table text-table-data">
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-white font-bold">92</span>
                    </td>
                    <td className="p-inset-table text-table-data text-slate-500">5 days ago</td>
                    <td className="p-inset-table text-right">
                      <button className="bg-slate-100est hover:bg-amber-500 hover:text-white px-3 py-1 rounded text-label-caps transition-all">Resend reminder</button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="material-symbols-outlined text-primary" data-icon="calendar_month">calendar_month</span>
                <span className="px-2 py-1 rounded bg-slate-100 text-slate-700 font-bold text-[10px] uppercase">In Progress</span>
              </div>
              <h3 className="font-headline-md text-headline-md">Monday Report Status</h3>
              <p className="text-body-lg font-bold text-slate-500 mt-2">Next report: Monday 23 Jun</p>
              <p className="text-body-sm text-slate-500 mt-1">Status: Weekly aggregation in progress...</p>
            </div>
            <div className="mt-8 space-y-3">
              <div className="flex items-center gap-2 text-body-sm text-slate-500">
                <span className="material-symbols-outlined text-emerald-500 text-sm" data-icon="check">check</span>
                Data collected
              </div>
              <div className="flex items-center gap-2 text-body-sm text-slate-500">
                <span className="material-symbols-outlined text-primary text-sm animate-spin" data-icon="sync">sync</span>
                Formatting summaries
              </div>
              <button className="w-full mt-4 py-3 bg-amber-100 text-white rounded font-bold hover:bg-amber-500 transition-colors active:scale-[0.98]">
                Generate Now
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="h-20 md:hidden"></div>
    </main>
  );
};

export default QcConsoleHome;
