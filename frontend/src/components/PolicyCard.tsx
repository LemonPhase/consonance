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

  // Featured card layout
  if (policy.isFeatured) {
    return (
      <div className="md:col-span-8 bg-surface-container-lowest p-8 flex flex-col justify-between min-h-[400px] group transition-all duration-300 relative overflow-hidden rounded-xl border border-outline-variant/20 shadow-sm">
        <div className="absolute top-0 right-0 p-8">
          <span className="font-label text-xs uppercase tracking-widest text-on-surface-variant mb-2 block">
            Domain
          </span>
          <span className="font-body font-semibold text-primary">{policy.domain}</span>
        </div>

        <div>
          <div className={`inline-flex items-center gap-2 ${getStatusColor(policy.status)} px-3 py-1 rounded-full mb-6`}>
            {policy.status === 'active-disagreement' && (
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
            )}
            {getStatusIcon(policy.status) && (
              <MaterialIcon icon={getStatusIcon(policy.status)!} size="sm" />
            )}
            <span className="font-label text-xs font-bold uppercase tracking-tighter">
              {policy.statusLabel}
            </span>
          </div>

          <h2
            onClick={() => onViewDebate?.(policy.id)}
            className="font-headline text-4xl font-bold text-primary mb-6 group-hover:text-secondary transition-colors cursor-pointer"
          >
            {policy.title}
          </h2>

          <p className="font-body text-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">
            {policy.description}
          </p>
        </div>

        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="flex gap-12">
            <div>
              <span className="block font-label text-xs text-on-surface-variant uppercase tracking-widest mb-1">
                Citations
              </span>
              <span className="font-headline text-2xl font-bold text-primary">
                {policy.citations.toLocaleString()}
              </span>
            </div>
            <div>
              <span className="block font-label text-xs text-on-surface-variant uppercase tracking-widest mb-1">
                Active Debaters
              </span>
              <span className="font-headline text-2xl font-bold text-primary">
                {policy.activeDebaters.toLocaleString()}
              </span>
            </div>
          </div>

          <button
            onClick={() => onViewDebate?.(policy.id)}
            className="bg-secondary-fixed text-on-secondary-fixed px-8 py-3 rounded-lg font-label font-bold flex items-center gap-2 hover:bg-secondary-container transition-all group/btn"
          >
            View Debate
            <MaterialIcon icon="arrow_forward" className="group-hover/btn:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    );
  }

  // Primary dark card layout
  if (policy.isPrimary) {
    return (
      <div className="md:col-span-8 bg-primary text-white p-12 relative overflow-hidden flex flex-col md:flex-row gap-12 items-center">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary-container via-transparent to-transparent"></div>

        <div className="relative z-10 flex-1">
          <span className="font-label text-xs uppercase tracking-widest text-slate-400 mb-2 block">
            {policy.domain}
          </span>

          <div className={`inline-flex items-center gap-2 ${getStatusColor(policy.status)} px-3 py-1 rounded-full mb-6`}>
            {getStatusIcon(policy.status) && (
              <MaterialIcon icon={getStatusIcon(policy.status)!} size="sm" />
            )}
            <span className="font-label text-xs font-bold uppercase tracking-tighter">
              {policy.statusLabel}
            </span>
          </div>

          <h3
            onClick={() => onViewDebate?.(policy.id)}
            className="font-headline text-4xl font-bold mb-4 cursor-pointer hover:text-secondary-container transition-colors"
          >
            {policy.title}
          </h3>

          <p className="font-body text-slate-300 text-lg leading-relaxed mb-8">
            {policy.description}
          </p>

          <div className="flex gap-10">
            <div>
              <span className="font-headline text-3xl font-bold text-secondary-container">
                {policy.citations.toLocaleString()}
              </span>
              <span className="block font-label text-xs text-slate-400 uppercase tracking-widest">
                Citations
              </span>
            </div>
            <div>
              <span className="font-headline text-3xl font-bold text-secondary-container">
                {policy.activeDebaters.toLocaleString()}
              </span>
              <span className="block font-label text-xs text-slate-400 uppercase tracking-widest">
                Active Debaters
              </span>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-col gap-4 w-full md:w-auto">
          <button
            onClick={() => onViewDebate?.(policy.id)}
            className="bg-secondary-fixed text-on-secondary-fixed px-10 py-4 rounded-lg font-label font-extrabold hover:scale-105 transition-transform whitespace-nowrap shadow-xl"
          >
            View Full Debate
          </button>
          <p className="text-[10px] text-slate-400 font-label uppercase text-center tracking-widest">
            Updated 2 hours ago
          </p>
        </div>
      </div>
    );
  }

  // Default card
  return (
      <div className="md:col-span-4 bg-surface-container-lowest border border-outline-variant/30 rounded-xl p-8 flex flex-col min-h-[360px] shadow-sm hover:shadow-md transition-shadow h-full">
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
        className="font-headline text-2xl font-bold text-primary leading-tight mb-4 cursor-pointer hover:text-secondary transition-colors"
      >
        {policy.title}
      </h3>

      <p className="font-body text-sm text-on-surface-variant leading-relaxed mb-8 flex-grow">
        {policy.description}
      </p>

      {policy.sourceLabel && policy.sourceUrl && (
        <a
          href={policy.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="mb-4 inline-flex items-center gap-2 text-xs text-secondary hover:text-primary transition-colors"
        >
          {policy.sourceLabel}
          <span>↗</span>
        </a>
      )}

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="bg-surface-container-low p-3 rounded-lg">
          <span className="block font-label text-[10px] uppercase tracking-widest text-on-surface-variant mb-1">
            Citations
          </span>
          <span className="font-headline text-xl font-bold text-primary">{policy.citations.toLocaleString()}</span>
        </div>
        <div className="bg-surface-container-low p-3 rounded-lg">
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
        className="w-full bg-primary text-white py-3 rounded-lg font-label font-bold hover:bg-primary-container transition-colors"
      >
        View Debate
      </button>
    </div>
  );
};
