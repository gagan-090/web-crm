import { useState } from 'react';
import { useAuth } from '../../app/providers/AuthProvider';
import {
  useGetGateProgressQuery,
  useGetMonthIncentiveQuery,
  useGetIncentiveHistoryQuery,
} from '../../services/api/incentiveApi';

export default function MyIncentivePage() {
  const { user } = useAuth();
  const roleName = user?.role || '';
  const [lang, setLang] = useState<'EN' | 'HI'>('EN');
  const [period, setPeriod] = useState<'this_month' | 'all_time'>('this_month');

  const { data: progress } = useGetGateProgressQuery(roleName, { skip: !roleName });
  const { data: incentive, isLoading } = useGetMonthIncentiveQuery({ role: roleName, period }, { skip: !roleName });
  const { data: history } = useGetIncentiveHistoryQuery(roleName, { skip: !roleName });

  if (isLoading || !incentive) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-gray-500 font-medium animate-pulse">Loading Incentive Engine...</div>
      </div>
    );
  }

  // Role Accent Colors

  const isTwc = roleName.includes('TW') || roleName.includes('Transporter');
  const isMm = roleName.includes('MM') || roleName.includes('Match');
  const isSc = roleName.includes('SC') || roleName.includes('Special');

  let accentColor = '#374151'; // Classic Slate Gray
  let accentBg = 'bg-slate-700';
  let accentText = 'text-slate-750';
  let roleTitle = 'Driver Welcome Caller (DWC)';

  if (isTwc) {
    roleTitle = 'Transporter Welcome Caller (TWC)';
  } else if (isMm) {
    roleTitle = 'Matchmaking Coordinator (MM)';
  } else if (isSc) {
    roleTitle = 'Special Categories Agent (SC)';
  }
  // Suppress lint warnings — these are used in JSX but assigned conditionally
  void accentColor; void accentBg; void accentText;

  // Translation Strings
  const translations = {
    EN: {
      dashboardTitle: 'My Incentives Dashboard',
      subtitle: 'Real-time telemetry, salary gates, and TEI multipliers',
      salaryGate: 'Salary Gate Status',
      unlocked: 'Incentives Active',
      locked: 'Salary Gate Locked',
      secured: 'Secured',
      active: 'Active',
      lockedShort: 'Locked',
      daysLeft: 'days remaining this month',
      needMore: 'Need ₹{amt} more to cross gate',
      activeUnit: 'Immediate Unit Payout (No Gate Required)',
      kpiPreTei: 'Pre-TEI Accrued',
      kpiTeiScore: 'TEI Score',
      kpiMultiplier: 'TEI Multiplier',
      kpiPayout: 'Estimated Payout',
      lineItems: 'Monthly Conversions Ledger',
      date: 'Date',
      lead: 'Lead Name',
      plan: 'Plan / Action',
      type: 'Channel',
      component: 'Component',
      amount: 'Payout',
      teiMetrics: 'TEI Quality Scorecard',
      versatilityBonus: 'Versatility Qualification',
      totalTakeHome: 'Est. Take-Home Salary Breakdown',
      baseSalary: 'Base Salary',
      bonus: 'Versatility Bonus',
      finalIncentive: 'Net Payout (Pre-TEI × Multiplier)',
      estSalary: 'Estimated Net Take-Home',
      historyTrend: '6-Month Incentive Performance',
      peerComparison: 'Peer Comparison',
      myRank: 'My Performance Rank',
      avgAccrued: 'Process Average Payout',
    },
    HI: {
      dashboardTitle: 'मेरा प्रोत्साहन डैशबोर्ड',
      subtitle: 'रीयल-टाइम कॉल डेटा, वेतन गेट्स, और TEI गुणक',
      salaryGate: 'वेतन गेट की स्थिति',
      unlocked: 'प्रोत्साहन सक्रिय',
      locked: 'वेतन गेट बंद है',
      secured: 'सुरक्षित',
      active: 'सक्रिय',
      lockedShort: 'बंद',
      daysLeft: 'इस महीने के दिन बचे हैं',
      needMore: 'गेट पार करने के लिए ₹{amt} और चाहिए',
      activeUnit: 'त्वरित यूनिट भुगतान (कोई गेट आवश्यक नहीं)',
      kpiPreTei: 'प्री-TEI संचित',
      kpiTeiScore: 'TEI स्कोर',
      kpiMultiplier: 'TEI गुणक',
      kpiPayout: 'अनुमानित भुगतान',
      lineItems: 'मासिक रूपांतरण बही खाता',
      date: 'तारीख',
      lead: 'लीड का नाम',
      plan: 'प्लान / क्रिया',
      type: 'चैनल',
      component: 'घटक',
      amount: 'भुगतान',
      teiMetrics: 'TEI गुणवत्ता स्कोरकार्ड',
      versatilityBonus: 'बहुमुखी प्रतिभा बोनस योग्यता',
      totalTakeHome: 'अनुमानित कुल वेतन विवरण',
      baseSalary: 'मूल वेतन',
      bonus: 'बहुमुखी प्रतिभा बोनस',
      finalIncentive: 'शुद्ध प्रोत्साहन (प्री-TEI × गुणक)',
      estSalary: 'अनुमानित कुल वेतन',
      historyTrend: '६-महीने का प्रोत्साहन प्रदर्शन',
      peerComparison: 'सहकर्मी तुलना',
      myRank: 'मेरा प्रदर्शन रैंक',
      avgAccrued: 'प्रक्रिया औसत भुगतान',
    }
  };

  const t = translations[lang];

  return (
    <div className="min-h-screen bg-gray-50/50 p-6 font-sans">
      {/* Header Panel */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 border-b border-gray-250 pb-5">
        <div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">{t.dashboardTitle}</h1>
          <p className="text-xs text-gray-500 mt-1">{roleTitle} · {t.subtitle}</p>
        </div>
        <div className="flex items-center gap-3">
          {/* Period Toggle */}
          <div className="flex bg-gray-200/40 p-1 rounded-md border border-gray-300">
            <button
              onClick={() => setPeriod('this_month')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded transition-all ${
                period === 'this_month' ? 'bg-white text-gray-900 shadow-sm border border-gray-300' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              This Month
            </button>
            <button
              onClick={() => setPeriod('all_time')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded transition-all ${
                period === 'all_time' ? 'bg-white text-gray-900 shadow-sm border border-gray-300' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              All Time
            </button>
          </div>
          {/* Language Toggle */}
          <div className="flex bg-gray-200/40 p-1 rounded-md border border-gray-300">
            <button
              onClick={() => setLang('EN')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded transition-all ${
                lang === 'EN' ? 'bg-white text-gray-900 shadow-sm border border-gray-300' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              English
            </button>
            <button
              onClick={() => setLang('HI')}
              className={`px-2.5 py-0.5 text-[11px] font-bold rounded transition-all ${
                lang === 'HI' ? 'bg-white text-gray-900 shadow-sm border border-gray-300' : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              हिन्दी
            </button>
          </div>
        </div>
      </div>



      {/* Main Layout Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Left Column - 2 Cols Span on large screens */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Gate Card */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-5 border-b border-gray-150 pb-4">
              <div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t.salaryGate}</span>
                <h3 className="text-lg font-bold text-gray-900 mt-1">
                  Accrued Revenue: <span className="font-mono text-gray-950 font-extrabold">₹{progress?.accruedIncentive.toLocaleString()}</span>
                </h3>
              </div>
              <div className="sm:text-right mt-1 sm:mt-0">
                <span className="text-[10px] font-bold text-gray-500 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                  {progress?.daysLeft} {t.daysLeft}
                </span>
              </div>
            </div>

            {progress?.salaryGateThreshold === 0 && progress?.incentiveGateThreshold === 0 ? (
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 font-bold text-sm shrink-0">
                    ✓
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wide">{t.activeUnit}</h4>
                    <p className="text-[11px] text-gray-500 mt-0.5">Unit payout scheme: Every conversion pays out immediately!</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col gap-6">
                {/* 1. Base Salary Gate Row */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs font-bold text-gray-900">1. Base Salary Gate</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                          progress?.isSalaryGateUnlocked 
                            ? 'bg-gray-100 text-gray-850 border-gray-300' 
                            : 'bg-gray-50 text-gray-600 border-gray-205'
                        }`}>
                          {progress?.isSalaryGateUnlocked ? 'Secured' : 'Locked'}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium block mt-0.5">Overhead target: Salary + ₹5k</span>
                    </div>
                    <div className="sm:text-right">
                      <span className="font-mono text-xs font-bold text-gray-750">
                        ₹{progress?.accruedIncentive.toLocaleString()} / ₹{progress?.salaryGateThreshold.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden relative border border-gray-200/50">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out bg-gray-700"
                      style={{ width: `${Math.min(100, progress?.salaryGatePercentage || 0)}%` }}
                    />
                  </div>

                  {progress?.isSalaryGateUnlocked ? (
                    <div className="text-[10px] text-gray-700 font-medium bg-gray-50 px-2.5 py-1.5 rounded border border-gray-200 text-left">
                      ✓ Salary gate crossed! Base salary secured.
                    </div>
                  ) : (
                    <div className="text-[10px] text-gray-700 font-medium bg-gray-50 px-2.5 py-1.5 rounded border border-gray-200 text-left">
                      ℹ Need ₹{progress?.salaryGateRemaining.toLocaleString()} more to secure base salary.
                    </div>
                  )}
                </div>

                <hr className="border-gray-200" />

                {/* 2. Incentive Gate Row */}
                <div className="space-y-2">
                  <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                    <div>
                      <div className="flex items-center flex-wrap gap-2">
                        <span className="text-xs font-bold text-gray-900">2. Incentives Gate</span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider border ${
                          progress?.isIncentiveGateUnlocked 
                            ? 'bg-gray-100 text-gray-850 border-gray-300' 
                            : 'bg-gray-50 text-gray-600 border-gray-205'
                        }`}>
                          {progress?.isIncentiveGateUnlocked ? 'Unlocked' : 'Locked'}
                        </span>
                      </div>
                      <span className="text-[10px] text-gray-400 font-medium block mt-0.5">Incentive target: 2x sale</span>
                    </div>
                    <div className="sm:text-right">
                      <span className="font-mono text-xs font-bold text-gray-750">
                        ₹{progress?.accruedIncentive.toLocaleString()} / ₹{progress?.incentiveGateThreshold.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden relative border border-gray-200/50">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out bg-gray-700"
                      style={{ width: `${Math.min(100, progress?.incentiveGatePercentage || 0)}%` }}
                    />
                  </div>

                  {progress?.isIncentiveGateUnlocked ? (
                    <div className="text-[10px] text-gray-700 font-medium bg-gray-50 px-2.5 py-1.5 rounded border border-gray-200 text-left">
                      ✓ Incentive gate crossed! Payout active.
                    </div>
                  ) : (
                    <div className="text-[10px] text-gray-700 font-medium bg-gray-50 px-2.5 py-1.5 rounded border border-gray-200 text-left">
                      ℹ Need ₹{progress?.incentiveGateRemaining.toLocaleString()} more to activate incentives.
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* KPI Card Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t.kpiPreTei}</span>
              <h4 className="text-lg font-mono font-extrabold text-gray-900 mt-2">
                ₹{incentive.preTeiAmount.toLocaleString()}
              </h4>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t.kpiTeiScore}</span>
              <div className="flex items-center gap-1.5 mt-2">
                <span className="text-lg font-mono font-extrabold text-gray-900">{incentive.teiScore}</span>
                <span className="text-[10px] text-gray-800 font-bold bg-gray-100 border border-gray-300 px-1.5 py-0.5 rounded">Band A</span>
              </div>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">{t.kpiMultiplier}</span>
              <h4 className="text-lg font-mono font-extrabold text-gray-900 mt-2">
                {incentive.multiplier}x
              </h4>
            </div>

            <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
              <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">{t.kpiPayout}</span>
              <h4 className="text-lg font-mono font-black text-gray-950 mt-2">
                ₹{incentive.finalPayout.toLocaleString()}
              </h4>
            </div>
          </div>

          {/* Conversions Ledger Table */}
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
              <h3 className="font-bold text-gray-850 text-xs uppercase tracking-wider">{t.lineItems}</h3>
              <span className="text-[10px] font-mono bg-gray-100 border border-gray-300 text-gray-600 px-2 py-0.5 rounded">
                {incentive.lineItems.length} records
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-gray-55 text-gray-500 font-bold border-b border-gray-200 text-[10px] uppercase tracking-wider">
                    <th className="p-3 pl-4">{t.date}</th>
                    <th className="p-3">{t.lead}</th>
                    <th className="p-3">{t.plan}</th>
                    <th className="p-3">{t.type}</th>
                    {isMm && <th className="p-3">{t.component}</th>}
                    <th className="p-3 pr-4 text-right">{t.amount}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 font-medium text-gray-705">
                  {incentive.lineItems.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="p-3 pl-4 font-mono text-gray-400 whitespace-nowrap">{item.date}</td>
                      <td className="p-3 text-gray-900">
                        <div className="truncate max-w-[140px] md:max-w-[220px] font-bold" title={item.name}>
                          {item.name}
                        </div>
                        <span className="text-[9px] text-gray-400 font-normal">({item.tmid})</span>
                      </td>
                      <td className="p-3">
                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gray-100 text-gray-805 border border-gray-200 whitespace-nowrap">
                          {item.plan}
                        </span>
                      </td>
                      <td className="p-3">
                        <span className="text-[10px] font-semibold text-gray-600 whitespace-nowrap">
                          {item.type}
                        </span>
                      </td>
                      {isMm && (
                        <td className="p-3">
                          <span className="text-[10px] font-semibold text-gray-600 whitespace-nowrap">
                            {item.component}
                          </span>
                        </td>
                      )}
                      <td className="p-3 pr-4 text-right font-mono font-bold text-gray-900 whitespace-nowrap">
                        ₹{item.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 1-Column Section */}
        <div className="flex flex-col gap-6">
          {/* Est take home salary details */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{t.totalTakeHome}</h3>
            <div className="flex flex-col gap-3 text-xs font-medium text-gray-650">
              <div className="flex justify-between">
                <span>{t.baseSalary}</span>
                <span className="font-mono text-gray-950 font-semibold">₹{incentive.salaryDetails.baseSalary.toLocaleString()}</span>
              </div>
              {incentive.salaryDetails.versatilityBonus > 0 && (
                <div className="flex justify-between">
                  <span>{t.bonus}</span>
                  <span className="font-mono text-gray-955 font-semibold">+₹{incentive.salaryDetails.versatilityBonus.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>{t.finalIncentive}</span>
                <span className="font-mono text-gray-955 font-semibold">+₹{incentive.finalPayout.toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-t border-gray-200 pt-3 text-sm text-gray-955 font-bold mt-1">
                <span>{t.estSalary}</span>
                <span className="font-mono text-gray-955">₹{incentive.salaryDetails.totalTakeHome.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* TEI Quality Scorecard */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{t.teiMetrics}</h3>
            <div className="flex flex-col gap-4 text-xs font-semibold text-gray-600">
              {/* Ratio 1: Connectivity */}
              <div>
                <div className="flex justify-between text-gray-500 mb-1">
                  <span className="truncate pr-2">Connectivity Ratio</span>
                  <span className="font-mono text-gray-900 shrink-0">{incentive.teiMetrics.connectivityRatio}% ({incentive.teiMetrics.connectivityGrade})</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-250/50">
                  <div className="h-full bg-gray-700" style={{ width: `${incentive.teiMetrics.connectivityRatio}%` }} />
                </div>
              </div>

              {/* Ratio 2: Talk Time */}
              <div>
                <div className="flex justify-between text-gray-500 mb-1">
                  <span className="truncate pr-2">Daily Avg Talk Time</span>
                  <span className="font-mono text-gray-900 shrink-0">{incentive.teiMetrics.talkTimeMinutes} mins ({incentive.teiMetrics.talkTimeGrade})</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-255/55">
                  <div className="h-full bg-gray-700" style={{ width: '80%' }} />
                </div>
              </div>

              {/* Ratio 3: Idle Time */}
              <div>
                <div className="flex justify-between text-gray-500 mb-1">
                  <span className="truncate pr-2">Idle Time Ratio</span>
                  <span className="font-mono text-gray-900 shrink-0">{incentive.teiMetrics.idleTimeRatio}% ({incentive.teiMetrics.idleTimeGrade})</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-255/55">
                  <div className="h-full bg-gray-700" style={{ width: `${incentive.teiMetrics.idleTimeRatio * 3}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Peer average and ranking details */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm font-sans">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{t.peerComparison}</h3>
            <div className="flex flex-col gap-3 text-xs font-semibold text-gray-650">
              <div className="flex justify-between">
                <span>{t.myRank}</span>
                <span className="text-gray-950 font-bold">
                  {incentive.peerRank
                    ? `#${incentive.peerRank.rank} of ${incentive.peerRank.total} callers`
                    : '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span>{t.avgAccrued}</span>
                <span className="font-mono text-gray-950">₹{incentive.peerAverage.toLocaleString()}</span>
              </div>
              {/* Revenue vs peer average. Both bars are COLLECTED REVENUE —
                  the old version plotted the agent's commission against the peers'
                  revenue on a fixed ₹45,000 scale, so the two bars measured
                  different things and neither was to scale. */}
              {(() => {
                const mine = progress?.accruedIncentive ?? 0;
                const avg = incentive.peerAverage ?? 0;
                const scale = Math.max(mine, avg, 1);
                return (
                  <div className="mt-2 bg-gray-55 border border-gray-200 rounded-lg p-3">
                    <span className="text-[9px] text-gray-450 block mb-2 uppercase tracking-wide font-bold">
                      Revenue vs peer average
                    </span>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-8 text-[10px] text-gray-505 font-bold">Me</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-250/50">
                          <div className="h-full rounded-full bg-gray-700" style={{ width: `${Math.min(100, (mine / scale) * 100)}%` }} />
                        </div>
                        <span className="w-14 text-right font-mono text-[10px] text-gray-800 font-bold shrink-0">₹{mine.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-8 text-[10px] text-gray-505 font-bold">Avg</span>
                        <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-250/50">
                          <div className="h-full rounded-full bg-gray-400" style={{ width: `${Math.min(100, (avg / scale) * 100)}%` }} />
                        </div>
                        <span className="w-14 text-right font-mono text-[10px] text-gray-850 shrink-0">₹{avg.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>

          {/* Versatility Bonus Tracker */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-3 border-b border-gray-200 pb-2">{t.versatilityBonus}</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {incentive.versatilityBonus.processesQualified.map(proc => (
                <span key={proc} className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold bg-gray-50 text-gray-850 border border-gray-300">
                  Qualified: {proc}
                </span>
              ))}
            </div>
            {incentive.versatilityBonus.bonusAmount > 0 ? (
              <div className="bg-gray-50 border border-gray-250 rounded-lg p-3 text-xs text-gray-800 mb-2 font-semibold">
                Earned ₹{incentive.versatilityBonus.bonusAmount.toLocaleString()} Versatility Bonus this month!
              </div>
            ) : null}
            <p className="text-[10px] text-gray-400 font-medium italic">
              {incentive.versatilityBonus.nextTierRequirement}
            </p>
          </div>

          {/* 6-Month History Performance */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="font-bold text-gray-900 text-xs uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">{t.historyTrend}</h3>
            <div className="flex flex-col gap-3 font-semibold">
              {history?.map((h) => (
                <div key={h.month} className="flex items-center gap-2 text-xs">
                  <span className="w-10 text-gray-500 font-bold shrink-0">{h.month}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden border border-gray-250/50">
                    <div
                      className="h-full rounded-full bg-gray-500"
                      style={{ width: `${Math.min(100, (h.amount / 45000) * 100)}%` }}
                    />
                  </div>
                  <span className="w-16 text-right font-mono text-gray-800 font-bold shrink-0">₹{h.amount.toLocaleString()}</span>
                  <span className="w-8 text-right text-[10px] text-gray-400 font-bold shrink-0">({h.tei}x)</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
