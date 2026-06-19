import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface SLARow {
  id: string;
  company: string;
  tmid: string;
  registeredMinutesAgo: number;
  slaMinutesLeft: number;
}

export const WctHomeDashboard: React.FC = () => {
  const navigate = useNavigate();

  // Dashboard state for premium interactivity
  const [monthlyRevenue, setMonthlyRevenue] = useState(11200);
  const [slaList, setSlaList] = useState<SLARow[]>([
    { id: '1', company: 'Sharma Logistics', tmid: 'TR-12094', registeredMinutesAgo: 107, slaMinutesLeft: 133 },
    { id: '2', company: 'Anand Transport Co', tmid: 'TR-12098', registeredMinutesAgo: 178, slaMinutesLeft: 62 }
  ]);

  const baseSalary = 14000;
  const gateThreshold = baseSalary * 2; // ₹28,000
  const isGateCrossed = monthlyRevenue >= gateThreshold;
  const remainingToGate = Math.max(0, gateThreshold - monthlyRevenue);
  const gateProgressPercent = Math.min(100, Math.round((monthlyRevenue / gateThreshold) * 100));

  // Ticking SLA countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setSlaList(prevList => 
        prevList.map(item => ({
          ...item,
          registeredMinutesAgo: item.registeredMinutesAgo + 1,
          slaMinutesLeft: item.slaMinutesLeft - 1
        }))
      );
    }, 60000); // ticks every minute
    return () => clearInterval(timer);
  }, []);

  const formatMinutes = (mins: number) => {
    if (mins < 0) {
      const positiveMins = Math.abs(mins);
      const h = Math.floor(positiveMins / 60);
      const m = positiveMins % 60;
      return `${h}h ${m}m overdue`;
    }
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m left`;
  };

  const getSLATextColor = (mins: number) => {
    if (mins < 0) return 'text-red-600 font-extrabold';
    if (mins <= 60) return 'text-red-500 font-bold'; // <1hr
    if (mins <= 180) return 'text-orange-500 font-bold'; // 1-3hrs
    return 'text-[#27AE60] font-semibold'; // >3hrs
  };

  const handleCallLead = (lead: SLARow) => {
    // Remove from SLA watch list once call starts
    setSlaList(prev => prev.filter(item => item.id !== lead.id));
    
    // Navigate directly to active call with lead context
    navigate('/wct/wct-active-call-focus', {
      state: {
        name: lead.company,
        tmid: lead.tmid,
        registeredTime: `${Math.floor(lead.registeredMinutesAgo / 60)}h ${lead.registeredMinutesAgo % 60}m ago`,
        slaLeft: lead.slaMinutesLeft
      }
    });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto w-full p-4 overflow-y-auto max-h-[calc(100vh-60px)]">
      
      {/* Simulation Bar */}
      <section className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-gray-200 pb-4">
        <div>
          <p className="text-[#666666] text-xs font-semibold uppercase tracking-widest">Transporter Welcome calling Process</p>
          <h2 className="text-2xl font-bold text-gray-800">Transporter Connect Control</h2>
        </div>
        
        {/* Interactive Simulator */}
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 p-2 rounded-lg text-xs select-none">
          <span className="font-bold text-gray-600">Simulate:</span>
          <button 
            onClick={() => setMonthlyRevenue(prev => prev === 11200 ? 29500 : 11200)}
            className="px-2.5 py-1 bg-white border rounded hover:bg-gray-100 transition-colors"
          >
            Gate Status ({isGateCrossed ? 'Crossed' : 'Not Crossed'})
          </button>
          <button 
            onClick={() => {
              // Add a breached lead
              setSlaList(prev => [
                ...prev, 
                { id: `S_${Date.now()}`, company: 'Grover Logistics', tmid: 'TR-19208', registeredMinutesAgo: 320, slaMinutesLeft: -80 }
              ]);
            }}
            className="px-2.5 py-1 bg-white border rounded hover:bg-gray-100 transition-colors text-red-600 font-semibold"
          >
            + Add Breached SLA Lead
          </button>
        </div>
      </section>

      {/* SLA WATCH STRIP (sticky-feeling dedicated horizontal strip) */}
      <section className={`border rounded-xl p-4 shadow-sm ${
        slaList.length > 0 ? 'bg-[#FFF4EC] border-[#FB641B]' : 'bg-white border-gray-200'
      }`}>
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-xs font-bold text-[#FB641B] uppercase tracking-wider flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] animate-pulse">alarm</span>
            SLA WATCH
          </h3>
          {slaList.length === 0 && (
            <span className="text-xs text-[#27AE60] font-bold flex items-center gap-1">
              ✓ All on track
            </span>
          )}
        </div>

        {slaList.length > 0 ? (
          <div className="divide-y divide-orange-100/50">
            {slaList.map((lead) => (
              <div key={lead.id} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-bold text-gray-900 text-sm">{lead.company}</span>
                  <span className="font-mono bg-white text-gray-400 px-1 border border-orange-100 rounded">{lead.tmid}</span>
                  <span className="text-gray-500">·</span>
                  <span className="text-gray-500">Registered {Math.floor(lead.registeredMinutesAgo / 60)}h {lead.registeredMinutesAgo % 60}m ago</span>
                </div>
                
                <div className="flex items-center gap-4">
                  <span className={getSLATextColor(lead.slaMinutesLeft)}>
                    {lead.slaMinutesLeft < 0 ? '⚠️ SLA BREACHED — ' : 'SLA: '}
                    {formatMinutes(lead.slaMinutesLeft)}
                  </span>
                  
                  <button
                    onClick={() => handleCallLead(lead)}
                    className="bg-[#FB641B] hover:bg-[#e4540d] text-white px-3.5 py-1.5 rounded-lg font-bold shadow-sm transition-transform active:scale-95 flex items-center gap-1"
                  >
                    <span className="material-symbols-outlined text-xs">phone</span> Call
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400 italic py-2">No SLA-urgent registrations in queue right now.</p>
        )}
      </section>

      {/* KPI Cards Row (4 cards) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Card 1 — Monthly Revenue */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[150px]">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">Monthly Revenue</span>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              ₹{monthlyRevenue.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ ₹67,000</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">26 days remaining this month</div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-150 rounded-full overflow-hidden">
              <div 
                className="h-full bg-[#FB641B] rounded-full transition-all duration-500" 
                style={{ width: `${(monthlyRevenue / 67000) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 2 — 2× Salary Gate */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[150px]">
          <div>
            <span className={`text-xs uppercase font-semibold ${isGateCrossed ? 'text-[#27AE60]' : 'text-gray-500'}`}>
              {isGateCrossed ? '✓ Gate Crossed' : '2× Salary Gate'}
            </span>
            <div className="text-2xl font-bold text-gray-800 mt-1">
              ₹{monthlyRevenue.toLocaleString()} <span className="text-xs text-gray-400 font-normal">/ ₹{gateThreshold.toLocaleString()}</span>
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {isGateCrossed 
                ? 'Incentives active — every conversion now pays out' 
                : `₹${remainingToGate.toLocaleString()} to unlock incentives`
              }
            </div>
          </div>
          <div className="mt-3">
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-500 ${isGateCrossed ? 'bg-[#27AE60]' : 'bg-[#FB641B]'}`} 
                style={{ width: `${gateProgressPercent}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Card 3 — Today's Stats */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[150px]">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">Today's Stats</span>
            <div className="text-2xl font-bold text-gray-850 mt-1">8 <span className="text-xs text-gray-400 font-normal">calls</span></div>
            <div className="text-xs text-gray-500 mt-2 space-y-0.5">
              <div>· 2 conversions</div>
              <div>· 25% conversion rate</div>
            </div>
          </div>
        </div>

        {/* Card 4 — Conversion Rate (Monthly) */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col justify-between shadow-sm min-h-[150px]">
          <div>
            <span className="text-xs text-gray-500 uppercase font-semibold">Conversion Rate</span>
            <div className="text-2xl font-bold text-[#27AE60] mt-1">13.8%</div>
            <div className="text-xs text-[#27AE60] font-semibold mt-1">✓ Met ≥12% target</div>
          </div>
        </div>

      </div>

      {/* Secondary Dashboard Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
        
        {/* D+7 Upsell Due (Left, 1/3, orange bordered) */}
        <div className="bg-white border-l-4 border-[#FB641B] border-t border-r border-b border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-[#FB641B] uppercase tracking-wider mb-2">D+7 Upsell Due</h3>
            <p className="text-xs text-gray-500 font-semibold mb-2">3 free-plan transporters ready for upsell today</p>
            
            <div className="space-y-2 mt-2 text-xs">
              {[
                { name: 'Gopal Roadways', freeSince: '12 Jun' },
                { name: 'Karan Carriers', freeSince: '11 Jun' }
              ].map((up, idx) => (
                <div key={idx} className="flex justify-between items-center bg-orange-50/30 p-2 border border-orange-100 rounded">
                  <div>
                    <div className="font-bold text-gray-800">{up.name}</div>
                    <div className="text-[10px] text-gray-500">Free since: {up.freeSince} (7 days ago)</div>
                  </div>
                  <button 
                    onClick={() => navigate('/wct/wct-d7-upsell-queue')}
                    className="px-2 py-1 bg-[#FB641B] hover:bg-[#e4540d] text-white text-[10px] font-bold rounded shadow-sm"
                  >
                    Upsell Now
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Missed Callbacks (Center, 1/3) */}
        <div className="bg-white border-l-4 border-red-500 border-t border-r border-b border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-red-600 uppercase tracking-wider mb-2 flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">phone_callback</span> Missed Callbacks
            </h3>
            <div className="text-xs text-[#27AE60] font-bold flex items-center justify-center h-24 bg-green-50 rounded-lg">
              All callbacks on schedule ✓
            </div>
          </div>
        </div>

        {/* First-Call SLA Compliance (Right, 1/3) */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">First-Call SLA Compliance</h3>
            <div className="text-2xl font-bold text-[#FB641B] mt-1">91.3%</div>
            <div className="text-xs text-gray-500 mt-1">% of TR leads called within 4 business hours</div>
            
            <div className="mt-3 flex justify-between items-center text-[11px] border-t border-gray-100 pt-2 text-gray-500">
              <span className="text-[#27AE60] font-bold">↑ 3.1% vs last month</span>
              <span>Target: 100%</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

export default WctHomeDashboard;
