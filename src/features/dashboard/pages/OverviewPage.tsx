import React, { useEffect, useState } from 'react';
import KPIWidget from '../../../shared/components/business/KPIWidget';
import SLAIndicator from '../../../shared/components/business/SLAIndicator';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const OverviewPage: React.FC = () => {
  const [liveCallsCount, setLiveCallsCount] = useState(14);
  
  // Simulate live calls counting updates
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveCallsCount(prev => Math.max(8, Math.min(25, prev + (Math.random() > 0.5 ? 1 : -1))));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const chartData = [
    { name: 'Driver Welcome', completed: 142, SLA: 92 },
    { name: 'Transporter', completed: 208, SLA: 96 },
    { name: 'Spec. Categories', completed: 84, SLA: 82 },
    { name: 'Matchmaking', completed: 116, SLA: 88 }
  ];

  return (
    <div className="space-y-md">
      {/* Target Progress Section */}
      <section className="bg-white p-md rounded-sm border border-outline-variant flipkart-shadow">
        <div className="flex justify-between items-end mb-sm">
          <div>
            <h2 className="font-label-caps text-label-caps text-outline uppercase tracking-wider text-[10px] font-bold">
              This Month's Revenue Target
            </h2>
            <div className="flex items-baseline gap-sm mt-xs">
              <span className="text-2xl font-extrabold text-primary">₹6,42,800</span>
              <span className="text-outline text-xs font-semibold">/ ₹8,00,000</span>
            </div>
          </div>
          <div className="flex gap-md text-[11px] font-bold">
            <div className="relative group cursor-pointer flex items-center gap-xs">
              <span className="w-3 h-3 bg-green-500 rounded-[2px]"></span> DW (24%)
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] py-1 px-2 rounded-sm whitespace-nowrap z-50 pointer-events-none">
                Driver Welcome
              </div>
            </div>
            <div className="relative group cursor-pointer flex items-center gap-xs">
              <span className="w-3 h-3 bg-orange-500 rounded-[2px]"></span> TR (32%)
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] py-1 px-2 rounded-sm whitespace-nowrap z-50 pointer-events-none">
                Transporter
              </div>
            </div>
            <div className="relative group cursor-pointer flex items-center gap-xs">
              <span className="w-3 h-3 bg-teal-500 rounded-[2px]"></span> SC (12%)
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] py-1 px-2 rounded-sm whitespace-nowrap z-50 pointer-events-none">
                Special Categories
              </div>
            </div>
            <div className="relative group cursor-pointer flex items-center gap-xs">
              <span className="w-3 h-3 bg-amber-500 rounded-[2px]"></span> MM (12%)
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block bg-slate-900 text-white text-[10px] py-1 px-2 rounded-sm whitespace-nowrap z-50 pointer-events-none">
                Matchmaking
              </div>
            </div>
          </div>
        </div>
        <div className="h-4 w-full bg-surface-container-low rounded-full overflow-hidden flex">
          <div className="h-full bg-green-500" style={{ width: '24%' }}></div>
          <div className="h-full bg-orange-500" style={{ width: '32%' }}></div>
          <div className="h-full bg-teal-500" style={{ width: '12%' }}></div>
          <div className="h-full bg-amber-500" style={{ width: '12%' }}></div>
        </div>
      </section>

      {/* Main Process Summaries Grid */}
      <div className="grid grid-cols-4 gap-md">
        <KPIWidget
          title="Driver Welcome"
          value="₹1,92,000"
          subtext="Target: ₹2L"
          trend={{ value: '14.2% Conv', direction: 'up' }}
          icon="emoji_transportation"
        />
        <KPIWidget
          title="Transporter"
          value="₹2,56,000"
          subtext="Target: ₹3L"
          trend={{ value: '18.5% Conv', direction: 'up' }}
          icon="local_shipping"
        />
        <KPIWidget
          title="Spec. Categories"
          value="₹96,000"
          subtext="Target: ₹1.5L"
          trend={{ value: '9.2% Conv', direction: 'down' }}
          icon="support_agent"
          color="text-amber-600"
        />
        <KPIWidget
          title="Matchmaking"
          value="₹98,800"
          subtext="Target: ₹1.5L"
          trend={{ value: '12.1% Conv', direction: 'up' }}
          icon="handshake"
        />
      </div>

      {/* Double Column split details */}
      <div className="grid grid-cols-12 gap-md">
        {/* Left Column: Charts and Call logs */}
        <div className="col-span-8 space-y-md">
          {/* Chart Section */}
          <div className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow">
            <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface mb-md">
              Today's Call Performance by Domain
            </h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0eded" />
                  <XAxis dataKey="name" stroke="#727786" fontSize={11} tickLine={false} />
                  <YAxis stroke="#727786" fontSize={11} tickLine={false} />
                  <Tooltip cursor={{ fill: '#f6f3f2' }} />
                  <Bar dataKey="completed" name="Completed Calls" fill="#0056c3" radius={[2, 2, 0, 0]} />
                  <Bar dataKey="SLA" name="SLA Compliance %" fill="#fd661d" radius={[2, 2, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Call Feed */}
          <div className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow">
            <div className="flex justify-between items-center mb-md">
              <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface">
                Active Call Feed (Live)
              </h3>
              <span className="text-[10px] font-bold text-green-600 border border-green-500 px-sm py-0.5 rounded-sm flex items-center gap-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-green-500 pulse-custom"></span>
                {liveCallsCount} AGENTS DIALING
              </span>
            </div>

            <div className="space-y-sm max-h-60 overflow-y-auto custom-scrollbar pr-xs">
              {[
                { agent: 'DW Caller 04', role: 'DW', status: 'Connected', lead: 'Rajesh Kumar (Driver)', time: '04:12', state: 'optimal' },
                { agent: 'WCT Caller 12', role: 'WCT', status: 'Dialing', lead: 'Garg Logistics (Transporter)', time: '00:15', state: 'optimal' },
                { agent: 'MM Caller 03', role: 'MM', status: 'Wrap Up', lead: 'Balaji Freight (Job Match)', time: '07:40', state: 'warning' },
                { agent: 'SC Caller 08', role: 'SC', status: 'Connected', lead: 'Sharma Cold Chain', time: '11:22', state: 'breached' }
              ].map((c, i) => (
                <div key={i} className="flex items-center justify-between p-sm border border-outline-variant bg-surface-container-low rounded-sm text-xs hover:border-primary transition-colors">
                  <div className="flex items-center gap-md">
                    <span className="w-8 h-8 rounded-full bg-[#303030] text-white flex items-center justify-center font-extrabold text-[10px]">
                      {c.role}
                    </span>
                    <div>
                      <p className="font-semibold text-on-surface">{c.agent}</p>
                      <p className="text-[10px] text-outline">Lead: {c.lead}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-lg">
                    <div>
                      <p className={`font-bold ${c.status === 'Connected' ? 'text-green-600' : 'text-primary'}`}>
                        {c.status}
                      </p>
                      <p className="text-[10px] text-outline font-data-mono">{c.time}</p>
                    </div>
                    <SLAIndicator status={c.state as any} showText={false} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Mini Widgets */}
        <div className="col-span-4 space-y-md">
          {/* Quick Metrics */}
          <div className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow">
            <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface mb-md">
              Operations Summary
            </h3>
            <div className="space-y-md">
              <div>
                <div className="flex justify-between text-xs text-outline mb-xs font-semibold">
                  <span>SLA Compliance</span>
                  <span className="text-green-600 font-bold">92.4%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '92.4%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-outline mb-xs font-semibold">
                  <span>Leads Allocated</span>
                  <span className="text-primary font-bold">1,402 / 2,000</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: '70.1%' }}></div>
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs text-outline mb-xs font-semibold">
                  <span>Dialer Connectivity</span>
                  <span className="text-green-600 font-bold">78.5%</span>
                </div>
                <div className="h-1.5 w-full bg-surface-container rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '78.5%' }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Announcements ticker widget */}
          <div className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow h-[230px] flex flex-col justify-between">
            <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface mb-sm border-b border-outline-variant pb-xs">
              System Announcements
            </h3>
            <div className="flex-1 overflow-hidden relative">
              <div className="absolute top-0 left-0 w-full ticker-row flex flex-col gap-sm">
                {[
                  { text: 'New MM Scripts added in Settings. Please review the scripts section.', date: '10:00 AM' },
                  { text: 'Attendance lock for payroll cycle is scheduled tonight. Review timesheets.', date: 'Yesterday' },
                  { text: 'Driver Welcome call queues were auto-flushed to optimize SLA.', date: 'Yesterday' },
                  { text: 'Weekly Calibration with QC Analysts is scheduled for Friday 3 PM.', date: '2 days ago' }
                ].map((a, idx) => (
                  <div key={idx} className="bg-surface-container-low p-sm border border-outline-variant rounded-sm text-xs">
                    <p className="text-on-surface-variant font-medium">{a.text}</p>
                    <span className="text-[10px] text-outline mt-xs block font-data-mono">{a.date}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default OverviewPage;
