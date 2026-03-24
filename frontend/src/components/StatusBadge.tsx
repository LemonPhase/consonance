import React from 'react';

interface StatusBadgeProps {
  label: string;
  reference: string;
  variant?: 'active' | 'secondary';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ 
  label, 
  reference, 
  variant = 'active' 
}) => {
  const bgColor = variant === 'active' 
    ? 'bg-surface-container-high text-on-surface-variant' 
    : 'bg-secondary-fixed text-on-secondary-fixed';

  return (
    <div className="flex items-center gap-3 mb-6">
      <span className={`px-3 py-1 ${bgColor} font-label text-[10px] uppercase tracking-widest font-bold rounded`}>
        {label}
      </span>
      <span className="text-secondary font-label text-xs font-semibold">Ref: {reference}</span>
    </div>
  );
};
