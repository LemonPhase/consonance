import React from 'react';
import { MaterialIcon } from './MaterialIcon';

export interface PolicyCardData {
  id: string;
  title: string;
  description: string;
  domain: string;
  status: 'active-disagreement' | 'settled' | 'uncertain' | 'opinion';
  statusLabel: string;
  citations: number;
  activeDebaters: number;
  isFeatured?: boolean;
  isPrimary?: boolean;
  sourceLabel?: string;
  sourceUrl?: string;
  partyPositions?: Array<{
    party: string;
    stance: 'support' | 'oppose' | 'mixed' | 'neutral';
    percent: number;
  }>;
}

interface PolicyCardProps {
  policy: PolicyCardData;
  onViewDebate?: (id: string) => void;
}

export const PolicyCard: React.FC<PolicyCardProps> = ({ policy, onViewDebate }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active-disagreement':
        return 'bg-amber-50 text-amber-800';
      case 'settled':
        return 'bg-emerald-50 text-emerald-800';
      case 'uncertain':
        return 'bg-slate-100 text-slate-700';
      case 'opinion':
        return 'bg-white/10 text-white';
      default:
        return 'bg-slate-50 text-slate-700';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active-disagreement':
        return null;
      case 'settled':
        return 'verified';
      case 'uncertain':
        return 'help_outline';
      case 'opinion':
        return 'balance';
      default:
        return null;
    }
  };

  return (
    <article className="bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-7 flex flex-col min-h-[380px] shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 h-full relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-secondary-container" />
      <div className="flex items-center justify-between gap-3 mb-4">
        <span className="font-label text-[10px] uppercase tracking-widest text-on-surface-variant">
          {policy.domain}
        </span>
        <div className={`inline-flex items-center gap-1.5 ${getStatusColor(policy.status)} px-2.5 py-1 rounded-full`}>
          {getStatusIcon(policy.status) && <MaterialIcon icon={getStatusIcon(policy.status)!} size="sm" />}
          <span className="font-label text-[10px] font-bold uppercase tracking-tight">{policy.statusLabel}</span>
        </div>
      </div>

      <h3
        onClick={() => onViewDebate?.(policy.id)}
        className="font-headline text-2xl font-bold text-primary leading-tight mb-3 cursor-pointer hover:text-secondary transition-colors"
      >
        {policy.title}
      </h3>

      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-6 flex-grow">
        {policy.description}
      </p>

      {policy.sourceLabel && policy.sourceUrl && (
        <a
          href={policy.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-4 inline-flex items-center gap-2 text-xs text-secondary hover:text-primary transition-colors focus-visible:focus-ring rounded-sm"
        >
          {policy.sourceLabel}
          <span>↗</span>
        </a>
      )}

      <div className="grid grid-cols-2 gap-3 mb-5">
        <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
          <span className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
            Citations
          </span>
          <span className="font-headline text-xl font-bold text-primary">{policy.citations.toLocaleString()}</span>
        </div>
        <div className="bg-surface-container-low p-3 rounded-lg border border-outline-variant/20">
          <span className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
            Debaters
          </span>
          <span className="font-headline text-xl font-bold text-primary">
            {policy.activeDebaters.toLocaleString()}
          </span>
        </div>
      </div>

      {policy.partyPositions && policy.partyPositions.length > 0 && (
        <div className="mb-6 space-y-2">
          {policy.partyPositions.map((position) => {
            const barColor =
              position.stance === 'support'
                ? 'bg-emerald-500'
                : position.stance === 'oppose'
                  ? 'bg-rose-500'
                  : position.stance === 'mixed'
                    ? 'bg-amber-400'
                    : 'bg-slate-400';

            return (
              <div key={`${policy.id}-${position.party}`}>
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-on-surface-variant">{position.party}</span>
                  <span className="text-primary font-semibold">{position.percent}%</span>
                </div>
                <div className="h-1.5 bg-surface-container rounded-full overflow-hidden">
                  <div
                    className={`h-full ${barColor} rounded-full`}
                    style={{ width: `${Math.max(4, Math.min(100, position.percent))}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <button
        onClick={() => onViewDebate?.(policy.id)}
        className="w-full bg-primary text-white py-3 rounded-lg font-label font-bold hover:bg-primary-container transition-colors focus-visible:focus-ring"
      >
        View Debate
      </button>
    </article>
  );
};
