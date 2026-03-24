import React, { useState } from 'react';
import { ArchivePage } from './pages/ArchivePage';
import { DiscussionPage } from './pages/DiscussionPage';
import { Header } from './components/Header';
import { PolicyCardData } from './components/PolicyCard';
import './globals.css';

type View = 'main' | 'discussion';

function App() {
  const [currentView, setCurrentView] = useState<View>('main');
  const [selectedPolicy, setSelectedPolicy] = useState<PolicyCardData | null>(null);
  const [chatHistoryByPolicy, setChatHistoryByPolicy] = useState<Record<string, { id: string; role: 'user' | 'assistant'; text: string }[]>>({});

  const openPolicyDiscussion = (policyId: string) => {
    const policy = ALL_POLICIES.find((p) => p.id === policyId) || null;
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
      <Header currentView={currentView} onViewChange={setCurrentView} />
      {currentView === 'main' && <ArchivePage onOpenDiscussion={openPolicyDiscussion} />}
      {currentView === 'discussion' && selectedPolicy && (
        <DiscussionPage
          policy={selectedPolicy}
          onBack={backToMain}
          initialChatHistory={chatHistoryByPolicy[selectedPolicy.id] ?? []}
          onChatHistoryChange={(policyId, history) =>
            setChatHistoryByPolicy((prev) => ({ ...prev, [policyId]: history }))
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

const ALL_POLICIES: PolicyCardData[] = [
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

export default App;
