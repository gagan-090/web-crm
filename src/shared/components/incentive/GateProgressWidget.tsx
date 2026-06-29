import { useGetGateProgressQuery } from '../../../services/api/incentiveApi';
import { useAuth } from '../../../app/providers/AuthProvider';

export default function GateProgressWidget({ onClick }: { onClick?: () => void }) {
  const { user } = useAuth();
  const roleName = user?.role || '';
  const { data: progress, isLoading } = useGetGateProgressQuery(roleName, {
    skip: !roleName,
  });

  if (isLoading || !progress) {
    return (
      <div className="bg-white p-4 rounded-xl border border-gray-200 animate-pulse h-28" />
    );
  }

  // Special Categories has no gates, incentives always unlocked immediately
  if (progress.salaryGateThreshold === 0 && progress.incentiveGateThreshold === 0) {
    return (
      <div 
        onClick={onClick}
        className={`bg-gradient-to-r from-emerald-50 to-teal-50 p-5 rounded-xl border border-emerald-200 shadow-sm font-sans ${onClick ? 'cursor-pointer hover:border-emerald-400 hover:shadow transition-all duration-200' : ''}`}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">
            ✓
          </div>
          <div>
            <h4 className="text-sm font-black text-emerald-800 tracking-tight">Incentives Active</h4>
            <p className="text-xs text-emerald-600 font-medium">Unit payout scheme: Every conversion pays out immediately!</p>
          </div>
        </div>
      </div>
    );
  }

  const {
    accruedIncentive,
    salaryGateThreshold,
    salaryGateRemaining,
    salaryGatePercentage,
    isSalaryGateUnlocked,
    incentiveGateThreshold,
    incentiveGateRemaining,
    incentiveGatePercentage,
    isIncentiveGateUnlocked,
    daysLeft
  } = progress;

  return (
    <div 
      onClick={onClick}
      className={`bg-white p-5 rounded-xl border border-gray-200 shadow-sm font-sans space-y-4 ${onClick ? 'cursor-pointer hover:border-[#27AE60]/40 hover:shadow transition-all duration-200' : ''}`}
    >
      <div className="flex justify-between items-center border-b border-gray-100 pb-2">
        <div>
          <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Target Gate Progress</span>
          <span className="text-[10px] text-gray-400 block mt-0.5">{daysLeft} days remaining in cycle</span>
        </div>
        <div className="text-right">
          <span className="text-xs font-semibold text-gray-500 mr-1">Accrued Sale:</span>
          <span className="text-base font-black text-gray-800 inline-block">₹{accruedIncentive.toLocaleString()}</span>
        </div>
      </div>

      {/* Track 1: Base Salary Gate */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-gray-700">1. Base Salary Gate</span>
            <span className="text-[9px] text-gray-400 block">Required to secure base salary payout</span>
          </div>
          <div className="text-right flex items-center gap-2">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide ${
              isSalaryGateUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isSalaryGateUnlocked ? 'Secured' : 'Locked'}
            </span>
            <span className="font-mono text-xs font-bold text-gray-700">
              ₹{accruedIncentive.toLocaleString()} / ₹{salaryGateThreshold.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 relative border border-gray-200/50 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isSalaryGateUnlocked 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
            style={{ width: `${salaryGatePercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold text-gray-700">
            {salaryGatePercentage.toFixed(0)}%
          </div>
        </div>
        <p className="text-[10px] font-medium text-left">
          {isSalaryGateUnlocked ? (
            <span className="text-emerald-600">✓ Base salary successfully secured!</span>
          ) : (
            <span className="text-amber-600">⚠️ Need ₹{salaryGateRemaining.toLocaleString()} more to secure base salary payout.</span>
          )}
        </p>
      </div>

      {/* Track 2: Incentive Gate */}
      <div className="space-y-1.5 pt-2 border-t border-gray-100">
        <div className="flex justify-between items-end">
          <div>
            <span className="text-xs font-bold text-gray-700">2. Incentives Gate</span>
            <span className="text-[9px] text-gray-400 block">Required to unlock additional conversion payouts</span>
          </div>
          <div className="text-right flex items-center gap-2">
            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wide ${
              isIncentiveGateUnlocked ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {isIncentiveGateUnlocked ? 'Active' : 'Locked'}
            </span>
            <span className="font-mono text-xs font-bold text-gray-700">
              ₹{accruedIncentive.toLocaleString()} / ₹{incentiveGateThreshold.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="w-full bg-gray-100 rounded-full h-3 relative border border-gray-200/50 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-500 ease-out ${
              isIncentiveGateUnlocked 
                ? 'bg-gradient-to-r from-emerald-500 to-teal-500' 
                : 'bg-gradient-to-r from-amber-500 to-orange-500'
            }`}
            style={{ width: `${incentiveGatePercentage}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] font-mono font-bold text-gray-700">
            {incentiveGatePercentage.toFixed(0)}%
          </div>
        </div>
        <p className="text-[10px] font-medium text-left">
          {isIncentiveGateUnlocked ? (
            <span className="text-emerald-600">✓ 2x sale crossed! All conversions earn at full incentive rate.</span>
          ) : (
            <span className="text-amber-600">⚠️ Need ₹{incentiveGateRemaining.toLocaleString()} more to activate conversion incentives.</span>
          )}
        </p>
      </div>
    </div>
  );
}
