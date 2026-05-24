import React, { memo } from 'react';

interface StatsCardProps {
  icon: React.ComponentType<any>;
  label: string;
  value: string;
  footer?: string;
  footerIcon?: React.ComponentType<any>;
  accent: string;
  className?: string;
}

export const StatsCard: React.FC<StatsCardProps> = memo(({
  icon: Icon,
  label,
  value,
  footer,
  footerIcon: FooterIcon,
  accent,
  className = '',
}) => {
  return (
    <div className={`stat-card ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold text-slate-500 dark:text-slate-300">{label}</p>
          <h3 className="mt-3 font-display text-3xl font-extrabold tracking-tight text-slate-950 dark:text-slate-50">
            {value}
          </h3>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-[20px] ${accent}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      {footer && FooterIcon && (
        <div className="mt-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-slate-500 dark:text-slate-400">
          <FooterIcon className="h-3.5 w-3.5" />
          {footer}
        </div>
      )}
    </div>
  );
});
export default StatsCard;
