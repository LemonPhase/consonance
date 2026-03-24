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

export type DebateSide = 'for' | 'against';

export type PolicyStatus = 'draft' | 'published' | 'archived';

export interface Policy {
  id: string;
  slug: string;
  title: string;
  question: string;
  description?: string | null;
  status: PolicyStatus;
  created_by_user_id: string;
  published_at?: string | null;
  created_at: string;
  updated_at: string;
}

export interface Argument {
  id: string;
  policy_id: string;
  author_user_id: string;
  side: DebateSide;
  parent_argument_id?: string | null;
  relation_to_parent?: string | null;
  claim: string;
  reasoning: string;
  counterarguments_addressed?: string | null;
  status: 'active' | 'hidden' | 'removed';
  quality_score: number;
  ai_clarity_score: number;
  source_credibility_score: number;
  upvotes: number;
  downvotes: number;
  created_at: string;
  updated_at: string;
}

export interface Comment {
  id: string;
  argument_id: string;
  author_user_id: string;
  body: string;
  status: 'active' | 'hidden' | 'removed';
  created_at: string;
  updated_at: string;
}

export interface PolicySummary {
  id: string;
  policy_id: string;
  strongest_for: string[];
  strongest_against: string[];
  supporting_argument_ids_for: string[];
  supporting_argument_ids_against: string[];
  model_name: string;
  generated_from_argument_count: number;
  created_at: string;
  is_active: boolean;
}

export interface CursorPage<T> {
  items: T[];
  next_cursor: string | null;
}
