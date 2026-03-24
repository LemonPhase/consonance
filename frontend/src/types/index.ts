export interface EngagementMetrics {
  consensusLevel: number;
  citationsVerified: number;
  activeDebaters: number;
}

export interface Evidence {
  id: string;
  author: string;
  affiliation: string;
  affiliationType: 'academic' | 'industry' | 'advocacy' | 'expert';
  content: string;
  source: string;
  sourceIcon: string;
  citations: string | number;
  citationLabel: string;
  supportLevel: 'High Support' | 'Primary Data' | 'High Concern' | 'Expert Insight';
  supportColor: 'emerald' | 'rose';
}

export interface PolicyProposal {
  status: string;
  reference: string;
  title: string;
  source: string;
  originatingBody: string;
  description: string;
  metrics: EngagementMetrics;
  imageUrl: string;
  imageAlt: string;
}

export interface NavLink {
  label: string;
  href: string;
  isActive?: boolean;
}
