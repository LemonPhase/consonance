import React from 'react';
import { StatusBadge } from './StatusBadge';
import { EngagementMetrics } from './EngagementMetrics';
import { PolicyProposal } from '../types/index';

interface PolicyHeaderProps {
  policy: PolicyProposal;
}

export const PolicyHeader: React.FC<PolicyHeaderProps> = ({ policy }) => {
  return (
    <section className="mb-20">
      <div className="flex flex-col md:flex-row gap-12 items-start">
        <div className="flex-1">
          <StatusBadge label={policy.status} reference={policy.reference} />
          
          <h1 className="font-serif text-6xl text-primary leading-tight mb-8">
            {policy.title}
          </h1>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
            <div className="p-6 bg-surface-container-low rounded-lg">
              <p className="font-label text-xs text-outline mb-1 uppercase tracking-wider">
                Source Material
              </p>
              <p className="font-serif text-xl text-primary">{policy.source}</p>
            </div>
            <div className="p-6 bg-surface-container-low rounded-lg">
              <p className="font-label text-xs text-outline mb-1 uppercase tracking-wider">
                Originating Body
              </p>
              <p className="font-serif text-xl text-primary">{policy.originatingBody}</p>
            </div>
          </div>

          <div className="prose prose-slate max-w-none">
            <p className="font-sans text-lg text-on-surface leading-relaxed mb-6">
              {policy.description}
            </p>
          </div>
        </div>

        <EngagementMetrics
          metrics={policy.metrics}
          imageUrl={policy.imageUrl}
          imageAlt={policy.imageAlt}
        />
      </div>
    </section>
  );
};
