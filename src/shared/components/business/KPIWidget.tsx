import React from 'react';

interface KPIWidgetProps {
  title: string;
  value: string | number;
  subtext?: string;
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  icon?: string;
  color?: string; // e.g. text-green-600, border-primary
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({
  title,
  value,
  subtext,
  trend,
  icon,
  color = 'text-primary'
}) => {
  return (
    <div className="bg-white p-md border border-outline-variant rounded-sm flipkart-shadow hover:border-primary transition-colors cursor-pointer group flex flex-col justify-between min-h-[100px]">
      <div className="flex justify-between items-start mb-xs">
        <span className="font-label-caps text-label-caps text-outline uppercase tracking-wider text-[10px]">
          {title}
        </span>
        {icon && (
          <span className="material-symbols-outlined text-[18px] text-outline-variant group-hover:text-primary transition-colors">
            {icon}
          </span>
        )}
      </div>
      <div>
        <p className={`text-xl font-extrabold tracking-tight ${color} leading-none mb-1`}>
          {value}
        </p>
        <div className="flex items-center gap-xs">
          {trend && (
            <span
              className={`text-[10px] font-bold flex items-center ${
                trend.direction === 'up' ? 'text-green-600' : 'text-error'
              }`}
            >
              <span className="material-symbols-outlined text-[12px] font-bold">
                {trend.direction === 'up' ? 'trending_up' : 'trending_down'}
              </span>
              {trend.value}
            </span>
          )}
          {subtext && (
            <span className="text-[10px] text-outline font-medium truncate">
              {subtext}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default KPIWidget;
