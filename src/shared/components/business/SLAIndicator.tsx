import React from 'react';

export type SLAStatus = 'optimal' | 'warning' | 'breached';

interface SLAIndicatorProps {
  status: SLAStatus;
  timeRemaining?: string;
  showText?: boolean;
}

export const SLAIndicator: React.FC<SLAIndicatorProps> = ({
  status,
  timeRemaining,
  showText = true
}) => {
  const config = {
    optimal: {
      color: 'bg-green-500',
      text: 'text-green-600',
      border: 'border-green-500',
      label: 'SLA Optimal'
    },
    warning: {
      color: 'bg-amber-500',
      text: 'text-amber-600',
      border: 'border-amber-500',
      label: 'SLA Warning'
    },
    breached: {
      color: 'bg-error',
      text: 'text-error',
      border: 'border-error',
      label: 'SLA Breached'
    }
  };

  const current = config[status];

  return (
    <div className="inline-flex items-center gap-xs select-none">
      {/* Status Dot */}
      <span className={`w-2.5 h-2.5 rounded-full ${current.color} border border-white pulse-custom`} title={current.label}></span>
      
      {showText && (
        <span className={`text-[11px] font-bold ${current.text} uppercase tracking-wider`}>
          {timeRemaining || current.label}
        </span>
      )}
    </div>
  );
};
export default SLAIndicator;
