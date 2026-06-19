import React, { useState } from 'react';
import KPIWidget from '../../../shared/components/business/KPIWidget';

interface SlaRecord {
  id: string;
  leadId: string;
  caller: string;
  domain: string;
  breachType: string;
  duration: string;
  timestamp: string;
  severity: 'high' | 'warning';
}

export const SlaDashboardPage: React.FC = () => {
  const [breaches] = useState<SlaRecord[]>([
    { id: '1', leadId: 'LD-4017', caller: 'SC Agent 08', domain: 'Special Categories', breachType: 'First Call SLA Breach', duration: '+11m 22s', timestamp: '5 mins ago', severity: 'high' },
    { id: '2', leadId: 'LD-4013', caller: 'DW Agent 04', domain: 'Driver Welcome', breachType: 'Callback Delay Breach', duration: '+22m 05s', timestamp: '1 hour ago', severity: 'warning' },
    { id: '3', leadId: 'LD-3990', caller: 'MM Agent 03', domain: 'Matchmaking', breachType: 'Match SLA Breach', duration: '+05m 12s', timestamp: '3 hours ago', severity: 'warning' }
  ]);

  return (
    <div className="space-y-md">
      {/* SLA KPIs */}
      <div className="grid grid-cols-4 gap-md">
        <KPIWidget title="Overall SLA Compliance" value="92.4%" subtext="Target: >95.0%" icon="alarm_on" />
        <KPIWidget title="Total Breaches Today" value="3 Breaches" subtext="2 Resolved, 1 Active" color="text-error" icon="alarm_off" />
        <KPIWidget title="Avg Response Speed" value="1m 45s" subtext="Target: <2 mins" icon="avg_time" />
        <KPIWidget title="Peak Queue Delay" value="8m 12s" subtext="At 11:30 AM" color="text-amber-600" icon="hourglass_empty" />
      </div>

      {/* SLA domain compliance bar charts */}
      <section className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow">
        <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface mb-md">
          SLA Compliance Rates by Process
        </h3>
        <div className="space-y-md">
          {[
            { name: 'Driver Welcome Welcome', percent: 92, target: 95, color: 'bg-green-500' },
            { name: 'Transporter Welcome Welcome', percent: 96, target: 95, color: 'bg-green-500' },
            { name: 'Special Categories Welcome', percent: 82, target: 95, color: 'bg-error' },
            { name: 'Matchmaking Welcome', percent: 88, target: 95, color: 'bg-amber-500' }
          ].map((item, idx) => (
            <div key={idx} className="space-y-xs">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-on-surface">{item.name}</span>
                <span className="text-outline">
                  Compliance: <span className="font-bold text-on-surface">{item.percent}%</span> (Target: {item.target}%)
                </span>
              </div>
              <div className="h-2.5 w-full bg-surface-container rounded-full overflow-hidden relative">
                <div className={`h-full ${item.color}`} style={{ width: `${item.percent}%` }}></div>
                {/* target line indicator */}
                <div className="absolute top-0 bottom-0 w-[2px] bg-red-600" style={{ left: `${item.target}%` }} title="SLA Target Limit"></div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Breached logs */}
      <div className="bg-white border border-outline-variant rounded-sm p-md flipkart-shadow">
        <h3 className="font-headline-md text-xs font-extrabold uppercase text-on-surface mb-md">
          Live SLA Breach & Escalation log
        </h3>

        <div className="overflow-x-auto border border-outline-variant rounded-sm">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-surface-container border-b border-outline-variant">
                <th className="p-sm font-label-caps text-outline font-bold">Severity</th>
                <th className="p-sm font-label-caps text-outline font-bold">Lead ID</th>
                <th className="p-sm font-label-caps text-outline font-bold">Domain</th>
                <th className="p-sm font-label-caps text-outline font-bold">Caller</th>
                <th className="p-sm font-label-caps text-outline font-bold">Breach Details</th>
                <th className="p-sm font-label-caps text-outline font-bold">Delay Timer</th>
                <th className="p-sm font-label-caps text-outline font-bold">Logged At</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant">
              {breaches.map((b) => (
                <tr key={b.id} className="hover:bg-surface-container-low transition-colors bg-white">
                  <td className="p-sm font-semibold">
                    <span className={`px-1.5 py-0.5 rounded-sm text-[9px] font-extrabold border ${
                      b.severity === 'high' ? 'bg-error-container text-on-error-container border-error' : 'bg-amber-100 text-amber-800 border-amber-300'
                    }`}>
                      {b.severity.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-sm font-bold text-primary">{b.leadId}</td>
                  <td className="p-sm">{b.domain}</td>
                  <td className="p-sm font-semibold">{b.caller}</td>
                  <td className="p-sm text-on-surface-variant">{b.breachType}</td>
                  <td className="p-sm font-data-mono text-error font-extrabold">{b.duration}</td>
                  <td className="p-sm text-outline">{b.timestamp}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default SlaDashboardPage;
