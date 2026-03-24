import React, { useState } from 'react';
import { Footer } from '../components/Footer';
import { HeroSection } from '../components/HeroSection';
import { FilterBar, FilterOption } from '../components/FilterBar';
import { PolicyCard, PolicyCardData } from '../components/PolicyCard';

const FILTER_OPTIONS: FilterOption[] = [
  { id: 'all', label: 'All' },
  { id: 'housing', label: 'Housing' },
  { id: 'education', label: 'Education' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'economy', label: 'Economy' },
  { id: 'environment', label: 'Environment' },
];

const POLICIES: PolicyCardData[] = [
  {
    id: '1',
    title: 'National Housing Targets',
    description:
      'A critical examination of proposed mandatory quotas versus local planning autonomy, analyzing current supply chain constraints and long-term affordability metrics.',
    domain: 'Housing',
    status: 'active-disagreement',
    statusLabel: 'Active Expert Disagreement',
    citations: 1204,
    activeDebaters: 892,
    isFeatured: true,
  },
  {
    id: '2',
    title: 'Levelling Up White Paper 2025 Evaluation',
    description:
      'Analysis of regional investment outcomes and infrastructure impact since the UK Levelling Up White Paper, with metrics on jobs, connectivity, and transport access gaps.',
    domain: 'Education',
    status: 'settled',
    statusLabel: 'Broadly Settled (Empirical)',
    citations: 650,
    activeDebaters: 340,
  },
  {
    id: '3',
    title: 'NHS Private Tutoring Subsidies',
    description:
      'Modeling the impact of external staffing support on permanent workforce retention and service delivery speeds.',
    domain: 'Healthcare',
    status: 'uncertain',
    statusLabel: 'Highly Uncertain (Predictive)',
    citations: 98,
    activeDebaters: 45,
  },
  {
    id: '4',
    title: 'Universal Basic Income Pilot',
    description:
      'The definitive debate on post-work socioeconomic frameworks, evaluating trials from Finland to Kenya.',
    domain: 'Economy',
    status: 'opinion',
    statusLabel: 'Opinion / Value Judgment',
    citations: 3410,
    activeDebaters: 1200,
    isPrimary: true,
  },
];

interface ArchivePageProps {
  onOpenDiscussion: (policyId: string) => void;
}

export const ArchivePage: React.FC<ArchivePageProps> = ({ onOpenDiscussion }) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredPolicies =
    activeFilter === 'all'
      ? POLICIES
      : POLICIES.filter(
          (policy) => policy.domain.toLowerCase() === activeFilter.toLowerCase()
        );

  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      <main className="min-h-screen pt-24 pb-20 px-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <HeroSection
          title="Consonance: Active Policy Discourse"
          description="Structured debate where factual claims are evidence-checked and disagreement is mapped."
        />

        {/* Filters */}
        <FilterBar options={FILTER_OPTIONS} activeFilter={activeFilter} onFilterChange={setActiveFilter} />

        {/* Policy Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {filteredPolicies.map((policy) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onViewDebate={() => onOpenDiscussion(policy.id)}
            />
          ))}
        </div>
      </main>

      {/* Decorative SVG Element */}
      <div className="fixed top-0 right-0 -z-10 w-1/3 h-screen pointer-events-none opacity-5">
        <svg className="h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          <path
            className="text-secondary"
            d="M100 0 L100 100 L0 100 Z"
            fill="currentColor"
          />
        </svg>
      </div>

      <Footer />
    </div>
  );
};
