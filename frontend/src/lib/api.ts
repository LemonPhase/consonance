import {
  Argument,
  Comment,
  CursorPage,
  DebateSide,
  Policy,
  PolicySummary,
} from '@/types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? 'http://127.0.0.1:8000';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || `Request failed: ${response.status}`);
  }

  return (await response.json()) as T;
}

export async function fetchPolicies(): Promise<CursorPage<Policy>> {
  return request<CursorPage<Policy>>('/v1/policies?limit=100');
}

export async function fetchArguments(policyId: string): Promise<CursorPage<Argument>> {
  return request<CursorPage<Argument>>(`/v1/policies/${policyId}/arguments?sort=top&limit=100`);
}

export async function fetchArgumentsBySide(
  policyId: string,
  side: DebateSide,
): Promise<CursorPage<Argument>> {
  return request<CursorPage<Argument>>(
    `/v1/policies/${policyId}/arguments?sort=top&side=${side}&limit=100`,
  );
}

export async function createArgument(payload: {
  policy_id: string;
  side: DebateSide;
  claim: string;
  reasoning: string;
}): Promise<Argument> {
  return request<Argument>('/v1/arguments', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
}

export async function castVote(argumentId: string, value: 1 | -1): Promise<{
  argument_id: string;
  upvotes: number;
  downvotes: number;
  my_vote: 1 | -1 | null;
}> {
  return request(`/v1/arguments/${argumentId}/vote`, {
    method: 'POST',
    body: JSON.stringify({ value }),
  });
}

export async function fetchComments(argumentId: string): Promise<CursorPage<Comment>> {
  return request<CursorPage<Comment>>(`/v1/arguments/${argumentId}/comments?limit=100`);
}

export async function createComment(argumentId: string, body: string): Promise<Comment> {
  return request<Comment>(`/v1/arguments/${argumentId}/comments`, {
    method: 'POST',
    body: JSON.stringify({ body }),
  });
}

export async function generateSummary(policyId: string): Promise<PolicySummary> {
  return request<PolicySummary>(`/v1/policies/${policyId}/summaries/generate`, {
    method: 'POST',
    body: JSON.stringify({ max_points_per_side: 5 }),
  });
}

export async function getLatestSummary(policyId: string): Promise<PolicySummary | null> {
  return request<PolicySummary | null>(`/v1/policies/${policyId}/summaries/latest`);
}
