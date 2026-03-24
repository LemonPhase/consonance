import React from 'react';
import { MaterialIcon } from './MaterialIcon';
import { Evidence } from '../types/index';

interface EvidenceCardProps {
  evidence: Evidence;
  variant?: 'supporting' | 'challenge';
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ 
  evidence, 
  variant = 'supporting' 
}) => {
  const isSupporting = variant === 'supporting';
  const colorBase = isSupporting ? 'emerald' : 'rose';
  const supportColors = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-700',
      badgeBg: 'bg-emerald-50',
      badge: 'text-emerald-600',
      icon: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
    rose: {
      bg: 'bg-rose-50',
      text: 'text-rose-700',
      badgeBg: 'bg-rose-50',
      badge: 'text-rose-600',
      icon: 'text-rose-600',
      iconBg: 'bg-rose-50',
    },
  };

  const colors = supportColors[colorBase];

  return (
    <article className="group">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-8 h-8 rounded-full ${colors.iconBg} flex items-center justify-center`}>
            <MaterialIcon 
              icon={evidence.affiliationType === 'academic' ? 'person' : 
                    evidence.affiliationType === 'industry' ? 'corporate_fare' :
                    evidence.affiliationType === 'advocacy' ? 'account_balance' : 'gavel'}
              size="sm"
              className={colors.icon}
            />
          </div>
          <span className="font-label text-sm font-bold">{evidence.author}</span>
          <span className="text-outline text-xs">• {evidence.affiliation}</span>
        </div>
        <span className={`text-[10px] font-label font-bold uppercase tracking-tighter ${colors.badgeBg} ${colors.badge} px-2 py-0.5 rounded`}>
          {evidence.supportLevel}
        </span>
      </div>

      <p className="font-sans text-on-surface leading-relaxed mb-4">
        {evidence.content}
      </p>

      <div className="flex items-center gap-4 text-xs font-label">
        <a 
          href="#" 
          className="text-secondary font-semibold flex items-center gap-1 hover:underline"
        >
          <MaterialIcon 
            icon={evidence.sourceIcon === 'link' ? 'link' : 'description'} 
            size="sm"
          />
          {evidence.source}
        </a>
        <span className="text-outline">{evidence.citations}</span>
      </div>
    </article>
  );
};
