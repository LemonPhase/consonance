import { useEffect, useMemo, useState } from 'react';
import { ArchivePage } from './pages/ArchivePage';
import { DiscussionPage } from './pages/DiscussionPage';
import { LandingPage } from './pages/LandingPage';
import { Header } from './components/Header';
import { PolicyCardData } from './components/PolicyCard';
import { fetchArguments, fetchPolicies } from './lib/api';
import { Argument, Policy } from './types';
import './globals.css';

type View = 'landing' | 'main' | 'discussion';

function App() {
  const [currentView, setCurrentView] = useState<View>('landing');
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyCardData | null>(null);
  const [chatHistoryByPolicy, setChatHistoryByPolicy] = useState<Record<string, { id: string; role: 'user' | 'assistant'; text: string }[]>>({});
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [argumentsByPolicyId, setArgumentsByPolicyId] = useState<Record<string, Argument[]>>({});
  const [isLoadingPolicies, setIsLoadingPolicies] = useState(false);
  const [policiesError, setPoliciesError] = useState<string | null>(null);

  const statusFromBackend = (status: Policy['status']): PolicyCardData['status'] => {
    switch (status) {
      case 'published':
        return 'active-disagreement';
      case 'archived':
        return 'settled';
      default:
        return 'uncertain';
    }
  };

  const statusLabelFromBackend = (status: Policy['status']) => {
    switch (status) {
      case 'published':
        return 'Published';
      case 'archived':
        return 'Archived';
      default:
        return 'Draft';
    }
  };

  const domainFromPolicy = (policy: Policy): string => {
    const text = `${policy.slug} ${policy.title} ${policy.question}`.toLowerCase();

    if (text.includes('housing') || text.includes('rent') || text.includes('planning')) {
      return 'Housing';
    }
    if (text.includes('education') || text.includes('school') || text.includes('skills')) {
      return 'Education';
    }
    if (text.includes('nhs') || text.includes('health') || text.includes('hospital')) {
      return 'Healthcare';
    }
    if (text.includes('climate') || text.includes('carbon') || text.includes('emission')) {
      return 'Environment';
    }
    return 'Economy';
  };

  const mappedPolicies: PolicyCardData[] = useMemo(
    () =>
      policies.map((policy) => {
        const args = argumentsByPolicyId[policy.id] ?? [];
        const activeDebaters = new Set(args.map((arg) => arg.author_user_id)).size;
        const citations = args.length;

        const supportCount = args.filter((arg) => arg.side === 'for').length;
        const opposeCount = args.filter((arg) => arg.side === 'against').length;
        const total = Math.max(1, supportCount + opposeCount);
        const supportPercent = Math.round((supportCount / total) * 100);
        const opposePercent = Math.round((opposeCount / total) * 100);

        const sourceLabel = `${policy.title} Evidence Dossier`;
        const sourceUrl = `https://example.org/policies/${policy.slug}`;

        return {
          id: policy.id,
          title: policy.title,
          description: policy.description ?? policy.question,
          domain: domainFromPolicy(policy),
          status: statusFromBackend(policy.status),
          statusLabel: statusLabelFromBackend(policy.status),
          citations,
          activeDebaters,
          isFeatured: false,
          isPrimary: false,
          sourceLabel,
          sourceUrl,
          partyPositions: [
            { party: 'Labour', stance: 'support', percent: Math.min(92, supportPercent + 8) },
            { party: 'Conservative', stance: 'oppose', percent: Math.min(92, opposePercent + 6) },
            {
              party: 'Liberal Democrats',
              stance: supportPercent >= opposePercent ? 'mixed' : 'neutral',
              percent: Math.max(35, Math.min(70, Math.round((supportPercent + opposePercent) / 2))),
            },
          ],
        };
      }),
    [policies, argumentsByPolicyId],
  );

  const loadPoliciesAndArguments = async () => {
    setIsLoadingPolicies(true);
    setPoliciesError(null);
    try {
      const policiesPage = await fetchPolicies();
      setPolicies(policiesPage.items);

      const entries = await Promise.all(
        policiesPage.items.map(async (policy) => {
          const argumentsPage = await fetchArguments(policy.id);
          return [policy.id, argumentsPage.items] as const;
        }),
      );

      setArgumentsByPolicyId(Object.fromEntries(entries));
    } catch (error) {
      setPoliciesError(error instanceof Error ? error.message : 'Failed to load policies');
    } finally {
      setIsLoadingPolicies(false);
    }
  };

  useEffect(() => {
    void loadPoliciesAndArguments();
  }, []);

  const openPolicyDiscussion = (policyId: string) => {
    const policy = mappedPolicies.find((p) => p.id === policyId) || null;
    if (policy) {
      setSelectedPolicy(policy);
      setCurrentView('discussion');
    }
  };

  const backToMain = () => {
    setCurrentView('main');
  };

  return (
    <div className="light">
      {currentView !== 'landing' && <Header currentView={currentView} onViewChange={setCurrentView} />}
      {currentView === 'landing' && <LandingPage onEnterArchive={() => setCurrentView('main')} />}
      {currentView === 'main' && (
        <ArchivePage
          onOpenDiscussion={openPolicyDiscussion}
          policies={mappedPolicies}
          isLoading={isLoadingPolicies}
          errorMessage={policiesError}
        />
      )}
      {currentView === 'discussion' && selectedPolicy && (
        <DiscussionPage
          policy={selectedPolicy}
          onBack={backToMain}
          initialChatHistory={chatHistoryByPolicy[selectedPolicy.id] ?? []}
          onChatHistoryChange={(policyId, history) =>
            setChatHistoryByPolicy((prev) => ({ ...prev, [policyId]: history }))
          }
          backendPolicyId={selectedPolicy.id}
          argumentsList={argumentsByPolicyId[selectedPolicy.id] ?? []}
          onArgumentsChange={(policyId, nextArguments) =>
            setArgumentsByPolicyId((prev) => ({ ...prev, [policyId]: nextArguments }))
          }
        />
      )}
      {currentView === 'discussion' && !selectedPolicy && (
        <main className="min-h-screen pt-24 pb-20 px-8 max-w-7xl mx-auto">
          <p className="text-lg text-on-surface-variant">
            Select an ongoing policy from the list to open its discussion page.
          </p>
        </main>
      )}
    </div>
  );
}

export default App;
