import React, { useState } from 'react';

export const WctHomeDashboard: React.FC = () => {
  const [callingLead, setCallingLead] = useState(false);

  const handleCallNow = () => {
    setCallingLead(true);
    setTimeout(() => setCallingLead(false), 3000);
  };

  return (
    <div className="w-full max-w-6xl mx-auto space-y-5 pb-6">

      {/* Page Title */}
      <div className="flex items-end justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">WCT Portal</p>
          <h1 className="text-2xl font-bold text-on-surface mt-0.5">Home Dashboard</h1>
        </div>
        <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-full font-semibold">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse block" />
          Online &amp; Syncing
        </div>
      </div>

      {/* SLA Alert */}
      <div className="flex items-center justify-between gap-4 bg-red-50 border border-red-200 rounded-xl px-5 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="material-symbols-outlined text-red-500 text-[20px] shrink-0">warning</span>
          <div className="min-w-0">
            <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Critical SLA Alert</p>
            <p className="text-sm text-red-800 font-medium truncate">
              TR-10024 — Express Logistics &nbsp;·&nbsp;
              <span className="text-red-600">Expires in 2h 13m</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleCallNow}
          className={`shrink-0 px-4 py-1.5 rounded-lg text-xs font-bold transition-all active:scale-95 flex items-center gap-1.5 ${
            callingLead ? 'bg-emerald-600 text-white' : 'bg-red-600 hover:bg-red-700 text-white'
          }`}
        >
          <span className="material-symbols-outlined text-[15px]">
            {callingLead ? 'check_circle' : 'phone'}
          </span>
          {callingLead ? 'Calling…' : 'Call Now'}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Calls Made',    value: '42',      icon: 'call',       accent: 'text-primary' },
          { label: 'Converted',     value: '5',       icon: 'handshake',  accent: 'text-emerald-600' },
          { label: 'Daily Revenue', value: '₹9,995',  icon: 'payments',   accent: 'text-orange-500' },
          { label: 'Conv. Rate',    value: '11.9%',   icon: 'avg_pace',   accent: 'text-violet-600' },
        ].map(s => (
          <div key={s.label} className="bg-white border border-outline-variant rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-surface-container-low rounded-lg flex items-center justify-center shrink-0">
              <span className={`material-symbols-outlined text-[22px] ${s.accent}`}>{s.icon}</span>
            </div>
            <div>
              <p className="text-lg font-bold text-on-surface leading-tight">{s.value}</p>
              <p className="text-xs text-on-surface-variant">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue + SLA Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Monthly Revenue */}
        <div className="lg:col-span-2 bg-white border border-outline-variant rounded-xl p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">Monthly Revenue</p>
              <p className="text-3xl font-bold text-on-surface mt-1">
                ₹42,000
                <span className="text-base font-normal text-on-surface-variant"> / ₹67,000</span>
              </p>
            </div>
            <div className="text-right">
              <span className="text-orange-500 font-bold text-xl">62.6%</span>
              <p className="text-xs text-emerald-600 font-medium">Ahead of schedule</p>
            </div>
          </div>

          {/* Progress bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-on-surface-variant">
              <span>Target Progress</span>
              <span>₹25,000 remaining</span>
            </div>
            <div className="w-full h-2 bg-surface-container rounded-full overflow-hidden">
              <div className="h-full bg-orange-500 rounded-full" style={{ width: '62.6%' }} />
            </div>
          </div>

          {/* Gate Breakdown */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-outline-variant">
            {[
              { label: 'Gate 1 Revenue', value: '₹12,000', target: '₹28,000', pct: '42.8%', w: '42.8%', color: 'bg-orange-400' },
              { label: 'Gate 2 Revenue', value: '₹8,450',  target: '₹28,000', pct: '30.1%', w: '30.1%', color: 'bg-violet-400' },
            ].map(g => (
              <div key={g.label} className="bg-surface-container-low rounded-lg p-3">
                <p className="text-[11px] font-semibold uppercase text-on-surface-variant">{g.label}</p>
                <p className="text-base font-bold text-on-surface mt-0.5">{g.value}</p>
                <p className="text-xs text-on-surface-variant mb-2">Target: {g.target}</p>
                <div className="w-full h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div className={`h-full ${g.color} rounded-full`} style={{ width: g.w }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* SLA Compliance */}
        <div className="bg-white border border-outline-variant rounded-xl p-5 flex flex-col items-center justify-center text-center gap-3">
          <p className="text-xs font-semibold uppercase tracking-widest text-on-surface-variant">SLA Compliance</p>

          <div className="relative w-24 h-24">
            <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" fill="transparent" stroke="#f3f4f6" strokeWidth="7" />
              <circle
                cx="40" cy="40" r="32" fill="transparent"
                stroke="#f97316" strokeWidth="7"
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - 0.913)}`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-on-surface">91.3%</span>
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold text-on-surface">Monthly Compliance</p>
            <p className="text-xs text-on-surface-variant">Target: <span className="text-orange-500 font-bold">100%</span></p>
          </div>

          <span className="text-[11px] font-bold uppercase tracking-wide bg-amber-50 border border-amber-200 text-amber-700 px-3 py-1 rounded-full">
            Needs Attention
          </span>
        </div>
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-orange-500 rounded-lg flex items-center justify-center text-white shrink-0">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
            </div>
            <div>
              <p className="text-xs font-bold text-orange-600 uppercase tracking-wide">Action Required</p>
              <p className="text-sm font-bold text-on-surface">D+7 Upsell Due</p>
              <p className="text-xs text-on-surface-variant">3 free-plan transporters ready</p>
            </div>
          </div>
          <button className="shrink-0 px-3 py-1.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors active:scale-95 whitespace-nowrap">
            View List
          </button>
        </div>

        <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-red-500 rounded-lg flex items-center justify-center text-white shrink-0 animate-pulse">
              <span className="material-symbols-outlined text-[18px]">phone_callback</span>
            </div>
            <div>
              <p className="text-xs font-bold text-red-600 uppercase tracking-wide">Overdue</p>
              <p className="text-sm font-bold text-on-surface">Missed Callbacks</p>
              <p className="text-xs text-red-600 font-medium">1 callback overdue by 45m</p>
            </div>
          </div>
          <button className="shrink-0 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-bold rounded-lg transition-colors active:scale-95 whitespace-nowrap">
            Resolve Now
          </button>
        </div>
      </div>

    </div>
  );
};

export default WctHomeDashboard;
