import React from 'react';
import { MaterialIcon } from './MaterialIcon';
import { EvidenceCard } from './EvidenceCard';
import { Evidence } from '../types/index';

interface DiscourseProps {
  supportingEvidence: Evidence[];
  challenges: Evidence[];
  onContribute?: () => void;
}

export const DiscourseSection: React.FC<DiscourseProps> = ({ 
  supportingEvidence, 
  challenges,
  onContribute,
}) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-12">
        <h3 className="font-serif text-4xl text-primary">Structured Discourse</h3>
        <button
          onClick={onContribute}
          className="flex items-center gap-2 font-label text-sm text-secondary font-semibold hover:underline transition-colors"
        >
          <MaterialIcon icon="add_circle" size="sm" />
          Contribute to Debate
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Column 1: Supporting Evidence */}
        <div>
          <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-emerald-100">
            <MaterialIcon icon="verified" className="text-emerald-600" />
            <h4 className="font-serif text-2xl text-primary">Supporting Evidence &amp; Arguments</h4>
          </div>
          <div className="space-y-10">
            {supportingEvidence.map((evidence) => (
              <EvidenceCard 
                key={evidence.id}
                evidence={evidence}
                variant="supporting"
              />
            ))}
          </div>
        </div>

        {/* Column 2: Challenges */}
        <div className="bg-surface-container-low p-8 rounded-xl border border-outline-variant/10">
          <div className="flex items-center gap-3 mb-8 pb-4 border-b-2 border-rose-100">
            <MaterialIcon icon="emergency_home" className="text-rose-600" />
            <h4 className="font-serif text-2xl text-primary">Critical Challenges &amp; Rebuttals</h4>
          </div>
          <div className="space-y-10">
            {challenges.map((challenge) => (
              <EvidenceCard 
                key={challenge.id}
                evidence={challenge}
                variant="challenge"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
