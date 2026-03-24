import React, { useState } from 'react';
import {
  Header,
  PolicyHeader,
  ChatBox,
  DiscourseSection,
  Footer,
} from '../components';
import { PolicyProposal, Evidence } from '../types/index';

const POLICY_DATA: PolicyProposal = {
  status: 'Active Proposal',
  reference: 'HC-2024-082',
  title: 'National Housing Targets: Reforming Macro-Planning Constraints',
  source: 'CMA Market Study: Housebuilding in Great Britain (2024)',
  originatingBody: 'Department for Levelling Up, Housing and Communities',
  description: `This policy outlines a statutory mandate for local authorities to meet a minimum delivery 
    threshold of 300,000 net additional dwellings per annum across England. By transitioning from "advisory" 
    to "mandatory" targets, the proposal aims to decouple housing delivery from local political cycles, 
    streamlining the land-use planning system to prioritize national economic stability over parochial 
    development resistance.`,
  metrics: {
    consensusLevel: 42,
    citationsVerified: 1204,
    activeDebaters: 892,
  },
  imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCMbF10dlqq0ztMGYkXwBIDs4RszaTfZKQxfbqtYh4tkD38LtfaaaXlB23S_RoFoMRwixQQmOs_BrlmWa3Y2HgZK5uwheOQKX--YsVSqt94g4CvwB7sWpTndk4GCLvjFz6sBiVsg-gzaehaXvemWt3JUxkMcYal5dpeWRlrxBQlvP4wkVw_iHJMdRbn_hqc077vO6JvZ44qGZWZbKN-X8v5tFFXB4ukRjY4adylzKr0pZzM49JkciHMwT766dxWKFQPLvOu3Uf3Mr_o',
  imageAlt: 'Modern architectural render of a sustainable housing development with clean lines and green spaces in bright natural daylight',
};

const SUPPORTING_EVIDENCE: Evidence[] = [
  {
    id: '1',
    author: 'Dr. Alistair Vance',
    affiliation: 'LSE Economics',
    affiliationType: 'academic',
    content: `Mandatory targets provide the necessary investment signals for tier-1 developers. Current 
      discretionary systems create 'planning risk' premiums that add 15-20% to the final house price.`,
    source: 'Vance (2023) Housing Elasticity Study',
    sourceIcon: 'link',
    citations: '124 Citations',
    citationLabel: 'Citations',
    supportLevel: 'High Support',
    supportColor: 'emerald',
  },
  {
    id: '2',
    author: 'Home Builders Federation',
    affiliation: 'Industry Body',
    affiliationType: 'industry',
    content: `Our survey indicates 84% of SMEs would re-enter the market if local plans were simplified via 
      national mandates, reversing the consolidation seen since 2008.`,
    source: 'HBF Q3 Report',
    sourceIcon: 'description',
    citations: 'Verified by ONS',
    citationLabel: 'Verification',
    supportLevel: 'Primary Data',
    supportColor: 'emerald',
  },
];

const CHALLENGES: Evidence[] = [
  {
    id: '3',
    author: 'CPRE National Office',
    affiliation: 'Advocacy Group',
    affiliationType: 'advocacy',
    content: `The 'top-down' approach ignores local infrastructure constraints. Without a concurrent mandate 
      for GP surgeries and school placements, 300k targets will lead to systemic service failure.`,
    source: 'Rural Impact Assessment 2024',
    sourceIcon: 'link',
    citations: '456 Signatures',
    citationLabel: 'Support',
    supportLevel: 'High Concern',
    supportColor: 'rose',
  },
  {
    id: '4',
    author: 'Barrister Sarah Jenkins',
    affiliation: 'Planning Law',
    affiliationType: 'expert',
    content: `Enforcement mechanisms remain undefined. If a council fails its target, who assumes the planning 
      authority? The legal risk of 'centralized overreach' is significant.`,
    source: 'Legal Brief: Section 106 Conflicts',
    sourceIcon: 'policy',
    citations: 'Law Society Cited',
    citationLabel: 'Citation',
    supportLevel: 'Expert Insight',
    supportColor: 'rose',
  },
];

export const HomePage: React.FC = () => {
  const [queryResponse, setQueryResponse] = useState<string | null>(null);

  const handleChatSubmit = (query: string) => {
    console.log('Query submitted:', query);
    setQueryResponse(`Response to: "${query}"`);
  };

  const handleContribute = () => {
    console.log('Contribute clicked');
  };

  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      <Header />
      
      <main className="max-w-[1440px] mx-auto px-8 pt-20 pb-24">
        <PolicyHeader policy={POLICY_DATA} />
        <ChatBox onSubmit={handleChatSubmit} />
        <DiscourseSection
          supportingEvidence={SUPPORTING_EVIDENCE}
          challenges={CHALLENGES}
          onContribute={handleContribute}
        />
      </main>

      <Footer />
    </div>
  );
};
