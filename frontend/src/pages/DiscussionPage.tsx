import React, { useState } from 'react';
import { PolicyCardData } from '../components/PolicyCard';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ChatBox } from '../components/ChatBox';
import {
  castVote,
  createArgument,
  createComment,
  fetchComments,
  generateSummary,
  getLatestSummary,
} from '@/lib/api';
import { Argument, Comment, PolicySummary } from '@/types';

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  text: string;
}

interface DiscussionPageProps {
  policy: PolicyCardData;
  onBack: () => void;
  initialChatHistory: ChatMessage[];
  onChatHistoryChange: (policyId: string, history: ChatMessage[]) => void;
  backendPolicyId: string | null;
  argumentsList: Argument[];
  onArgumentsChange: (policyId: string, nextArguments: Argument[]) => void;
}

export const DiscussionPage: React.FC<DiscussionPageProps> = ({
  policy,
  onBack,
  initialChatHistory,
  onChatHistoryChange,
  backendPolicyId,
  argumentsList,
  onArgumentsChange,
}) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(initialChatHistory);
  const [summary, setSummary] = useState<PolicySummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [localArguments, setLocalArguments] = useState<Argument[]>(argumentsList);
  const [argumentError, setArgumentError] = useState<string | null>(null);
  const [newArgumentSide, setNewArgumentSide] = useState<'for' | 'against'>('for');
  const [newArgumentClaim, setNewArgumentClaim] = useState('');
  const [newArgumentReasoning, setNewArgumentReasoning] = useState('');
  const [isCreatingArgument, setIsCreatingArgument] = useState(false);
  const [expandedArgumentId, setExpandedArgumentId] = useState<string | null>(null);
  const [commentsByArgument, setCommentsByArgument] = useState<Record<string, Comment[]>>({});
  const [loadingCommentsByArgument, setLoadingCommentsByArgument] = useState<Record<string, boolean>>({});
  const [newCommentByArgument, setNewCommentByArgument] = useState<Record<string, string>>({});

  React.useEffect(() => {
    setLocalArguments(argumentsList);
  }, [argumentsList]);

  const updateArguments = (nextArguments: Argument[]) => {
    setLocalArguments(nextArguments);
    if (backendPolicyId) {
      onArgumentsChange(backendPolicyId, nextArguments);
    }
  };

  const loadLatestSummary = async () => {
    if (!backendPolicyId) {
      return;
    }
    try {
      const latest = await getLatestSummary(backendPolicyId);
      setSummary(latest);
      setSummaryError(null);
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : 'Failed to load summary');
    }
  };

  React.useEffect(() => {
    loadLatestSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendPolicyId]);

  const handleChatSubmit = (query: string) => {
    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      role: 'user',
      text: query,
    };

    const assistantMessage: ChatMessage = {
      id: `a-${Date.now()}`,
      role: 'assistant',
      text: `Simulated AI response for policy "${policy.title}": ${query}`,
    };

    setChatHistory((prev) => {
      const next = [...prev, userMessage, assistantMessage];
      onChatHistoryChange(policy.id, next);
      return next;
    });
  };

  const handleGenerateSummary = async () => {
    if (!backendPolicyId) {
      setSummaryError('No backend policy mapped for this discussion.');
      return;
    }

    try {
      setSummaryLoading(true);
      setSummaryError(null);
      const generated = await generateSummary(backendPolicyId);
      setSummary(generated);
    } catch (error) {
      setSummaryError(error instanceof Error ? error.message : 'Failed to generate summary');
    } finally {
      setSummaryLoading(false);
    }
  };

  const handleCreateArgument = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!backendPolicyId) {
      setArgumentError('No backend policy mapped for this discussion.');
      return;
    }
    if (!newArgumentClaim.trim() || !newArgumentReasoning.trim()) {
      setArgumentError('Claim and reasoning are required.');
      return;
    }

    try {
      setIsCreatingArgument(true);
      setArgumentError(null);
      const created = await createArgument({
        policy_id: backendPolicyId,
        side: newArgumentSide,
        claim: newArgumentClaim.trim(),
        reasoning: newArgumentReasoning.trim(),
      });

      const next = [created, ...localArguments];
      updateArguments(next);
      setNewArgumentClaim('');
      setNewArgumentReasoning('');
    } catch (error) {
      setArgumentError(error instanceof Error ? error.message : 'Failed to create argument');
    } finally {
      setIsCreatingArgument(false);
    }
  };

  const handleVote = async (argumentId: string, value: 1 | -1) => {
    try {
      const result = await castVote(argumentId, value);
      const next = localArguments.map((argument) =>
        argument.id === argumentId
          ? {
              ...argument,
              upvotes: result.upvotes,
              downvotes: result.downvotes,
            }
          : argument,
      );
      updateArguments(next);
    } catch (error) {
      setArgumentError(error instanceof Error ? error.message : 'Failed to cast vote');
    }
  };

  const loadCommentsForArgument = async (argumentId: string) => {
    if (loadingCommentsByArgument[argumentId]) {
      return;
    }
    try {
      setLoadingCommentsByArgument((prev) => ({ ...prev, [argumentId]: true }));
      const page = await fetchComments(argumentId);
      setCommentsByArgument((prev) => ({ ...prev, [argumentId]: page.items }));
    } catch (error) {
      setArgumentError(error instanceof Error ? error.message : 'Failed to load comments');
    } finally {
      setLoadingCommentsByArgument((prev) => ({ ...prev, [argumentId]: false }));
    }
  };

  const toggleArgumentComments = async (argumentId: string) => {
    if (expandedArgumentId === argumentId) {
      setExpandedArgumentId(null);
      return;
    }

    setExpandedArgumentId(argumentId);
    if (!commentsByArgument[argumentId]) {
      await loadCommentsForArgument(argumentId);
    }
  };

  const handleCreateComment = async (argumentId: string) => {
    const body = (newCommentByArgument[argumentId] ?? '').trim();
    if (!body) {
      return;
    }

    try {
      const created = await createComment(argumentId, body);
      setCommentsByArgument((prev) => ({
        ...prev,
        [argumentId]: [created, ...(prev[argumentId] ?? [])],
      }));
      setNewCommentByArgument((prev) => ({ ...prev, [argumentId]: '' }));
    } catch (error) {
      setArgumentError(error instanceof Error ? error.message : 'Failed to create comment');
    }
  };

  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      <Header currentView="discussion" onViewChange={() => {}} />
      <main className="max-w-[1440px] mx-auto px-8 pt-24 pb-24">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 bg-surface-container-low text-primary px-4 py-2 rounded-lg border border-outline-variant"
        >
          ← Back to ongoing policies
        </button>

        <section className="bg-white rounded-xl shadow p-8 mb-10">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-4xl font-headline font-bold">{policy.title}</h1>
            <span className="text-xs font-label uppercase tracking-wider text-on-surface-variant">
              {policy.domain}
            </span>
          </div>

          <p className="mt-4 text-on-surface-variant leading-relaxed">
            {policy.description}
          </p>

          <div className="mt-6 flex gap-8">
            <div>
              <span className="block font-label text-xs text-on-surface-variant uppercase">Citations</span>
              <span className="font-headline text-2xl font-bold">{policy.citations.toLocaleString()}</span>
            </div>
            <div>
              <span className="block font-label text-xs text-on-surface-variant uppercase">Active Debaters</span>
              <span className="font-headline text-2xl font-bold">{policy.activeDebaters.toLocaleString()}</span>
            </div>
          </div>
        </section>

        <section className="bg-surface-container-low rounded-xl p-8 mb-10 border border-outline-variant/20">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-semibold">AI Debate Summary</h2>
            <button
              onClick={handleGenerateSummary}
              disabled={summaryLoading || !backendPolicyId}
              className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-60"
            >
              {summaryLoading ? 'Generating...' : 'Generate Summary'}
            </button>
          </div>

          {summaryError && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4">
              {summaryError}
            </p>
          )}

          {!summary && !summaryError && (
            <p className="text-sm text-on-surface-variant">No summary yet. Generate one from active arguments.</p>
          )}

          {summary && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-2">FOR</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {summary.strongest_for.map((point, idx) => (
                    <li key={`for-${idx}`}>{point}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-semibold mb-2">AGAINST</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {summary.strongest_against.map((point, idx) => (
                    <li key={`against-${idx}`}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-4">Add Argument</h2>
          <form onSubmit={handleCreateArgument} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                  Side
                </label>
                <select
                  value={newArgumentSide}
                  onChange={(event) => setNewArgumentSide(event.target.value as 'for' | 'against')}
                  className="w-full border border-outline-variant/30 rounded-lg px-3 py-2"
                >
                  <option value="for">For</option>
                  <option value="against">Against</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                  Claim
                </label>
                <input
                  value={newArgumentClaim}
                  onChange={(event) => setNewArgumentClaim(event.target.value)}
                  className="w-full border border-outline-variant/30 rounded-lg px-3 py-2"
                  maxLength={280}
                  placeholder="State your claim in one sentence"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">
                Reasoning
              </label>
              <textarea
                value={newArgumentReasoning}
                onChange={(event) => setNewArgumentReasoning(event.target.value)}
                className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 min-h-[100px]"
                placeholder="Explain your reasoning"
              />
            </div>
            <button
              type="submit"
              disabled={isCreatingArgument || !backendPolicyId}
              className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-60"
            >
              {isCreatingArgument ? 'Posting...' : 'Post Argument'}
            </button>
          </form>
        </section>

        <section className="bg-white rounded-xl shadow p-8 mb-10">
          <h2 className="text-2xl font-semibold mb-6">Structured Arguments</h2>
          {argumentError && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4">
              {argumentError}
            </p>
          )}
          {localArguments.length === 0 ? (
            <p className="text-sm text-on-surface-variant">No arguments yet for this policy.</p>
          ) : (
            <div className="space-y-4">
              {localArguments.map((arg) => (
                <article key={arg.id} className="border border-outline-variant/20 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs uppercase tracking-wider text-on-surface-variant">
                      {arg.side.toUpperCase()}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => void handleVote(arg.id, 1)}
                        className="text-xs px-2 py-1 rounded border border-outline-variant/30 hover:bg-surface-container-low"
                      >
                        ▲ {arg.upvotes}
                      </button>
                      <button
                        onClick={() => void handleVote(arg.id, -1)}
                        className="text-xs px-2 py-1 rounded border border-outline-variant/30 hover:bg-surface-container-low"
                      >
                        ▼ {arg.downvotes}
                      </button>
                    </div>
                  </div>
                  <h3 className="font-semibold mb-1">{arg.claim}</h3>
                  <p className="text-sm text-on-surface-variant">{arg.reasoning}</p>
                  <div className="mt-4">
                    <button
                      onClick={() => void toggleArgumentComments(arg.id)}
                      className="text-xs text-primary hover:underline"
                    >
                      {expandedArgumentId === arg.id ? 'Hide comments' : 'Show comments'}
                    </button>
                  </div>

                  {expandedArgumentId === arg.id && (
                    <div className="mt-4 border-t border-outline-variant/20 pt-4">
                      {loadingCommentsByArgument[arg.id] ? (
                        <p className="text-xs text-on-surface-variant">Loading comments...</p>
                      ) : (
                        <>
                          <div className="space-y-2 mb-3">
                            {(commentsByArgument[arg.id] ?? []).map((comment) => (
                              <div key={comment.id} className="bg-surface-container-low p-2 rounded text-sm">
                                {comment.body}
                              </div>
                            ))}
                            {(commentsByArgument[arg.id] ?? []).length === 0 && (
                              <p className="text-xs text-on-surface-variant">No comments yet.</p>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <input
                              value={newCommentByArgument[arg.id] ?? ''}
                              onChange={(event) =>
                                setNewCommentByArgument((prev) => ({
                                  ...prev,
                                  [arg.id]: event.target.value,
                                }))
                              }
                              className="flex-1 border border-outline-variant/30 rounded px-2 py-1 text-sm"
                              placeholder="Add a comment"
                            />
                            <button
                              onClick={() => void handleCreateComment(arg.id)}
                              className="text-xs bg-primary text-white px-3 py-1 rounded"
                            >
                              Post
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </article>
              ))}
            </div>
          )}
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-semibold mb-4">Live discussion & AI assistant</h2>
          <ChatBox onSubmit={handleChatSubmit} />
          <div className="mt-6 space-y-3">
            {chatHistory.map((msg) => (
              <div
                key={msg.id}
                className={`rounded-lg p-4 ${msg.role === 'user' ? 'bg-secondary-container/20' : 'bg-surface-container-lowest'}`}
              >
                <span className="block text-[10px] uppercase tracking-wider text-on-surface-variant">
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </span>
                <p className="mt-1 text-sm text-on-surface">{msg.text}</p>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
