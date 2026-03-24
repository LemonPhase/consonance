# Schema Contract v1 (Freeze Candidate)

This file defines the shared data contract between React (TypeScript) frontend and FastAPI backend.

## 1) Contract Rules

- Contract version: `v1.0.0`
- ID format: UUID string (example: `"4fa3f7f2-3f61-4a6a-bb94-b37fdd60d68f"`)
- Timestamp format: ISO-8601 UTC string (example: `"2026-03-24T10:15:30Z"`)
- Slug format: `^[a-z0-9]+(?:-[a-z0-9]+)*$`
- Pagination: cursor-based (`next_cursor`)
- Breaking changes after freeze require a new major contract version.

## 2) Shared Enums

```ts
export type DebateSide = "for" | "against";

export type PolicyStatus = "draft" | "published" | "archived";

export type ArgumentStatus = "active" | "hidden" | "removed";

export type ArgumentRelation = "counter" | "rebuttal" | "support";

export type VoteValue = 1 | -1;

export type SourceType =
  | "peer_reviewed"
  | "government_data"
  | "major_journalism"
  | "independent_analysis"
  | "blog_opinion"
  | "social_media"
  | "other";

export type VerificationVerdict =
  | "supports"
  | "partially_supports"
  | "does_not_support"
  | "contradicts"
  | "insufficient_evidence";

export type UserRole = "member" | "moderator" | "admin" | "expert";

export type IdentityVerificationLevel = "none" | "personhood" | "government_id";

export type PartyStance = "support" | "oppose" | "mixed" | "neutral" | "unknown";
```

## 3) Core Domain Schemas (Database + API Shape)

### 3.1 User

```ts
export interface User {
  id: string;
  role: UserRole;
  display_name: string;
  handle: string;
  bio?: string | null;
  identity_verification_level: IdentityVerificationLevel;
  is_identity_verified: boolean;
  reputation_score: number; // 0..100
  created_at: string;
  updated_at: string;
}
```

### 3.2 Policy

```ts
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
```

### 3.2.1 PolicySupportSnapshot (population-level support)

```ts
export interface PolicySupportSnapshot {
  id: string;
  policy_id: string;
  jurisdiction: string; // e.g. "US", "UK", "CA-ON"
  polling_org?: string | null;
  source_id?: string | null;

  support_percent: number; // 0..100
  oppose_percent: number; // 0..100
  undecided_percent?: number | null; // 0..100

  sample_size?: number | null;
  fielded_at?: string | null;
  created_at: string;
}
```

### 3.2.2 PolicyPartyPosition (party-level stance)

```ts
export interface PolicyPartyPosition {
  id: string;
  policy_id: string;
  jurisdiction: string; // e.g. "US", "UK", "CA-ON"
  party_name: string; // keep free-text for global compatibility
  stance: PartyStance;

  support_percent_within_party?: number | null; // 0..100 if polling exists
  confidence?: number | null; // 0..1, if AI- or analyst-derived

  source_id?: string | null;
  rationale?: string | null;
  created_at: string;
  updated_at: string;
}
```

### 3.3 Argument

```ts
export interface Argument {
  id: string;
  policy_id: string;
  author_user_id: string;
  side: DebateSide;
  parent_argument_id?: string | null;
  relation_to_parent?: ArgumentRelation | null;

  claim: string; // required, max 280 chars
  reasoning: string; // required
  counterarguments_addressed?: string | null;

  status: ArgumentStatus;
  quality_score: number; // 0..100 composite
  ai_clarity_score: number; // 0..1
  source_credibility_score: number; // 0..1

  upvotes: number;
  downvotes: number;

  created_at: string;
  updated_at: string;
}
```

### 3.4 Comment (lower-weight discussion)

```ts
export interface Comment {
  id: string;
  argument_id: string;
  author_user_id: string;
  body: string; // max 2000 chars
  status: "active" | "hidden" | "removed";
  created_at: string;
  updated_at: string;
}
```

### 3.5 Source

```ts
export interface Source {
  id: string;
  url: string;
  title: string;
  publisher?: string | null;
  source_type: SourceType;
  published_at?: string | null;
  credibility_score: number; // 0..1
  created_by_user_id: string;
  created_at: string;
}
```

### 3.6 ArgumentSource (many-to-many join)

```ts
export interface ArgumentSource {
  argument_id: string;
  source_id: string;
  citation_note?: string | null;
  relevance_note?: string | null;
  sort_order: number;
  created_at: string;
}
```

### 3.7 Vote

```ts
export interface Vote {
  user_id: string;
  argument_id: string;
  value: VoteValue;
  created_at: string;
  updated_at: string;
}
```

Unique constraint: `(user_id, argument_id)`

### 3.8 SourceVerificationResult

```ts
export interface SourceVerificationResult {
  id: string;
  argument_id: string;
  source_id: string;
  verdict: VerificationVerdict;
  confidence: number; // 0..1
  rationale: string;
  model_name: string;
  created_at: string;
}
```

### 3.9 PolicySummary (AI-generated)

```ts
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
```

### 3.10 ContradictionFlag

```ts
export interface ContradictionFlag {
  id: string;
  user_id: string;
  policy_id?: string | null;
  argument_id: string;
  conflicting_argument_id: string;
  explanation: string;
  confidence: number; // 0..1
  status: "open" | "acknowledged" | "dismissed";
  created_at: string;
  resolved_at?: string | null;
}
```

## 4) API DTO Schemas (FastAPI request/response)

### 4.1 Common response envelope

```ts
export interface CursorPage<T> {
  items: T[];
  next_cursor: string | null;
}

export interface ApiError {
  code:
    | "BAD_REQUEST"
    | "UNAUTHORIZED"
    | "FORBIDDEN"
    | "NOT_FOUND"
    | "CONFLICT"
    | "RATE_LIMITED"
    | "VALIDATION_ERROR"
    | "INTERNAL_ERROR";
  message: string;
  details?: Record<string, unknown>;
}
```

### 4.2 Policies

`GET /v1/policies`

Query:

```ts
type ListPoliciesQuery = {
  status?: PolicyStatus;
  search?: string;
  cursor?: string;
  limit?: number; // default 20, max 100
};
```

Response: `CursorPage<Policy>`

`POST /v1/policies`

```ts
type CreatePolicyRequest = {
  slug: string;
  title: string;
  question: string;
  description?: string;
};
```

Response: `Policy`

`GET /v1/policies/{policy_id}` -> `Policy`

`GET /v1/policies/{policy_id}/support/latest`

Response:

```ts
type PolicySupportResponse = {
  policy_id: string;
  latest_snapshot: PolicySupportSnapshot | null;
  party_positions: PolicyPartyPosition[];
};
```

`POST /v1/policies/{policy_id}/support/snapshots`

```ts
type CreatePolicySupportSnapshotRequest = {
  jurisdiction: string;
  polling_org?: string;
  source_id?: string;
  support_percent: number;
  oppose_percent: number;
  undecided_percent?: number;
  sample_size?: number;
  fielded_at?: string;
};
```

Response: `PolicySupportSnapshot`

`POST /v1/policies/{policy_id}/party-positions`

```ts
type CreatePolicyPartyPositionRequest = {
  jurisdiction: string;
  party_name: string;
  stance: PartyStance;
  support_percent_within_party?: number;
  confidence?: number;
  source_id?: string;
  rationale?: string;
};
```

Response: `PolicyPartyPosition`

### 4.3 Arguments

`GET /v1/policies/{policy_id}/arguments`

```ts
type ListArgumentsQuery = {
  side?: DebateSide;
  parent_argument_id?: string; // null root if omitted
  sort?: "top" | "new";
  cursor?: string;
  limit?: number;
};
```

Response: `CursorPage<Argument>`

`POST /v1/arguments`

```ts
type CreateArgumentRequest = {
  policy_id: string;
  side: DebateSide;
  claim: string;
  reasoning: string;
  counterarguments_addressed?: string;
  parent_argument_id?: string;
  relation_to_parent?: ArgumentRelation;
  source_ids?: string[];
};
```

Response: `Argument`

`PATCH /v1/arguments/{argument_id}`

```ts
type UpdateArgumentRequest = Partial<
  Pick<
    Argument,
    "claim" | "reasoning" | "counterarguments_addressed" | "status"
  >
>;
```

Response: `Argument`

### 4.4 Votes

`POST /v1/arguments/{argument_id}/vote`

```ts
type CastVoteRequest = { value: VoteValue };
```

Response:

```ts
type CastVoteResponse = {
  argument_id: string;
  upvotes: number;
  downvotes: number;
  my_vote: VoteValue | null;
};
```

### 4.5 Comments

`GET /v1/arguments/{argument_id}/comments` -> `CursorPage<Comment>`

`POST /v1/arguments/{argument_id}/comments`

```ts
type CreateCommentRequest = { body: string };
```

Response: `Comment`

### 4.6 Sources and verification

`POST /v1/sources`

```ts
type CreateSourceRequest = {
  url: string;
  title: string;
  publisher?: string;
  source_type: SourceType;
  published_at?: string;
};
```

Response: `Source`

`POST /v1/arguments/{argument_id}/sources`

```ts
type AttachSourceRequest = {
  source_id: string;
  citation_note?: string;
  relevance_note?: string;
};
```

Response: `ArgumentSource`

`POST /v1/source-verifications/run`

```ts
type RunSourceVerificationRequest = {
  argument_id: string;
  source_id: string;
};
```

Response: `SourceVerificationResult`

### 4.7 AI summary

`POST /v1/policies/{policy_id}/summaries/generate`

```ts
type GenerateSummaryRequest = {
  max_points_per_side?: number; // default 5
};
```

Response: `PolicySummary`

`GET /v1/policies/{policy_id}/summaries/latest` -> `PolicySummary | null`

### 4.8 Contradictions

`GET /v1/users/{user_id}/contradictions` -> `CursorPage<ContradictionFlag>`

`PATCH /v1/contradictions/{flag_id}`

```ts
type UpdateContradictionRequest = {
  status: "acknowledged" | "dismissed";
};
```

Response: `ContradictionFlag`

## 5) Backend Pydantic Naming (mirror of TS)

Use the exact same field names in Python models to remove mapping logic.

Recommended module layout:

```text
app/schemas/
  common.py
  user.py
  policy.py
  argument.py
  source.py
  vote.py
  comment.py
  summary.py
  contradiction.py
```

Each file should define:

- `...Base`
- `...Create`
- `...Update` (if mutable)
- `...Read` (API response)

## 6) DB Constraints (must-have)

- `policies.slug` unique
- `users.handle` unique
- `votes (user_id, argument_id)` unique
- `arguments.parent_argument_id` references `arguments.id` (nullable)
- `arguments.policy_id` references `policies.id`
- `arguments.side` must be `for|against`
- `quality_score` in `[0, 100]`
- all confidence/credibility scores in `[0, 1]`
- all support/oppose/undecided percentages in `[0, 100]`
- for each `PolicySupportSnapshot`, `support_percent + oppose_percent + undecided_percent ~= 100` (allow small rounding tolerance)
- unique key for party stance rows: `(policy_id, jurisdiction, party_name)`

## 7) MVP-Minimum Subset (if time constrained)

If you need a strict hackathon subset, freeze only:

- `Policy`
- `Argument`
- `Source`
- `PolicySummary`
- Endpoints: list/get policy, list/create argument, generate/get summary

Everything else in this contract remains additive and optional for MVP.
