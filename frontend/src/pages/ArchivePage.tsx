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

interface ArchivePageProps {
  onOpenDiscussion: (policyId: string) => void;
  policies: PolicyCardData[];
  isLoading?: boolean;
  errorMessage?: string | null;
}

export const ArchivePage: React.FC<ArchivePageProps> = ({
  onOpenDiscussion,
  policies,
  isLoading = false,
  errorMessage = null,
}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const matchesFilter = (domain: string, filter: string) => {
    const normalizedDomain = domain.toLowerCase();
    const normalizedFilter = filter.toLowerCase();

    if (normalizedFilter === 'healthcare') {
      return normalizedDomain === 'healthcare' || normalizedDomain === 'health';
    }

    return normalizedDomain === normalizedFilter;
  };

  const filteredPolicies =
    activeFilter === 'all'
      ? policies
      : policies.filter((policy) => matchesFilter(policy.domain, activeFilter));

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

        {isLoading && (
          <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-6 text-on-surface-variant">
            Loading policies...
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg border border-rose-200 bg-rose-50 p-6 text-rose-700">
            {errorMessage}
          </div>
        )}

        {!isLoading && !errorMessage && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            {filteredPolicies.map((policy) => (
              <PolicyCard
                key={policy.id}
                policy={policy}
                onViewDebate={() => onOpenDiscussion(policy.id)}
              />
            ))}
          </div>
        )}
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
