import React, { useState } from 'react';
import { Footer } from '../components/Footer';
import { ChatBox } from '../components/ChatBox';
import { PolicyCardData } from '../components/PolicyCard';
import {
  askPolicyQuestion,
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
  supportingArgumentIds?: string[];
  modelName?: string;
  usedFallback?: boolean;
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

function parseSourceChips(sourceText?: string | null): Array<{ title: string; url: string }> {
  if (!sourceText || !sourceText.startsWith('Sources: ')) {
    return [];
  }

  const content = sourceText.replace('Sources: ', '').trim();
  if (!content) {
    return [];
  }

  return content
    .split(';')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((entry) => {
      const [title, url] = entry.split('|');
      return {
        title: (title ?? '').trim(),
        url: (url ?? '').trim(),
      };
    })
    .filter((chip) => chip.title.length > 0 && chip.url.length > 0);
}

interface ArgumentColumnProps {
  title: string;
  side: 'for' | 'against';
  argumentsList: Argument[];
  expandedArgumentId: string | null;
  commentsByArgument: Record<string, Comment[]>;
  loadingCommentsByArgument: Record<string, boolean>;
  newCommentByArgument: Record<string, string>;
  onVote: (argumentId: string, value: 1 | -1) => void;
  onToggleComments: (argumentId: string) => void;
  onCommentInput: (argumentId: string, value: string) => void;
  onCommentSubmit: (argumentId: string) => void;
}

const ArgumentColumn: React.FC<ArgumentColumnProps> = ({
  title,
  side,
  argumentsList,
  expandedArgumentId,
  commentsByArgument,
  loadingCommentsByArgument,
  newCommentByArgument,
  onVote,
  onToggleComments,
  onCommentInput,
  onCommentSubmit,
}) => {
  const isFor = side === 'for';
  const sideLabel = isFor ? 'FOR' : 'AGAINST';
  const panelClass = isFor
    ? 'border-emerald-100 bg-emerald-50/40'
    : 'border-rose-100 bg-rose-50/40';
  const sideTextClass = isFor ? 'text-emerald-700' : 'text-rose-700';
  const voteBorderClass = isFor ? 'border-emerald-200' : 'border-rose-200';
  const chipClass = isFor
    ? 'border-emerald-200 text-emerald-700 hover:bg-emerald-50'
    : 'border-rose-200 text-rose-700 hover:bg-rose-50';

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2.5 h-2.5 rounded-full ${isFor ? 'bg-emerald-500' : 'bg-rose-500'}`} />
        <h3 className={`font-label text-xs uppercase tracking-widest ${sideTextClass}`}>
          {title} ({argumentsList.length})
        </h3>
      </div>

      {argumentsList.length === 0 && (
        <div className="rounded-lg border border-outline-variant/20 bg-surface-container-low p-4 text-sm text-on-surface-variant">
          No {title.toLowerCase()} arguments yet.
        </div>
      )}

      {argumentsList.map((argument) => (
        <article
          key={argument.id}
          id={`argument-${argument.id}`}
          className={`border rounded-lg p-4 overflow-hidden shadow-sm ${panelClass}`}
        >
          <div className="flex items-center justify-between mb-2 gap-2">
            <span className={`text-xs uppercase tracking-wider ${sideTextClass}`}>{sideLabel}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onVote(argument.id, 1)}
                className={`text-xs px-2 py-1 rounded border ${voteBorderClass} hover:bg-white`}
              >
                ▲ {argument.upvotes}
              </button>
              <button
                onClick={() => onVote(argument.id, -1)}
                className={`text-xs px-2 py-1 rounded border ${voteBorderClass} hover:bg-white`}
              >
                ▼ {argument.downvotes}
              </button>
            </div>
          </div>

          <h4 className="font-semibold mb-1">{argument.claim}</h4>
          <p className="text-sm text-on-surface-variant">{argument.reasoning}</p>

          {parseSourceChips(argument.counterarguments_addressed).length > 0 && (
            <div className="mt-3">
              <p className={`text-[10px] uppercase tracking-widest mb-2 ${sideTextClass}`}>Sources</p>
              <div className="flex flex-wrap gap-2">
                {parseSourceChips(argument.counterarguments_addressed).map((chip, index) => (
                  <a
                    key={`${argument.id}-source-${index}`}
                    href={chip.url}
                    target="_blank"
                    rel="noreferrer"
                    className={`text-[11px] bg-white border px-2 py-1 rounded ${chipClass}`}
                  >
                    {chip.title}
                  </a>
                ))}
              </div>
            </div>
          )}

          <div className="mt-4">
            <button
              onClick={() => onToggleComments(argument.id)}
              className="text-xs text-primary hover:underline"
            >
              {expandedArgumentId === argument.id ? 'Hide comments' : 'Show comments'}
            </button>
          </div>

          {expandedArgumentId === argument.id && (
            <div className="mt-4 border-t border-outline-variant/20 pt-4">
              {loadingCommentsByArgument[argument.id] ? (
                <p className="text-xs text-on-surface-variant">Loading comments...</p>
              ) : (
                <>
                  <div className="space-y-2 mb-3 max-h-52 overflow-auto pr-1">
                    {(commentsByArgument[argument.id] ?? []).map((comment) => (
                      <div
                        key={comment.id}
                        className="bg-white p-2 rounded text-sm border border-outline-variant/20"
                      >
                        {comment.body}
                      </div>
                    ))}
                    {(commentsByArgument[argument.id] ?? []).length === 0 && (
                      <p className="text-xs text-on-surface-variant">No comments yet.</p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      value={newCommentByArgument[argument.id] ?? ''}
                      onChange={(event) => onCommentInput(argument.id, event.target.value)}
                      className="flex-1 border border-outline-variant/30 rounded px-2 py-1 text-sm"
                      placeholder="Add a comment"
                    />
                    <button
                      onClick={() => onCommentSubmit(argument.id)}
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
  );
};

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
  const [isAskingPolicy, setIsAskingPolicy] = useState(false);
  const [chatError, setChatError] = useState<string | null>(null);
  const [summary, setSummary] = useState<PolicySummary | null>(null);
  const [summaryError, setSummaryError] = useState<string | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const [localArguments, setLocalArguments] = useState<Argument[]>(argumentsList);
  const [argumentError, setArgumentError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
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
    void loadLatestSummary();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [backendPolicyId]);

  const handleChatSubmit = async (query: string) => {
    const cleaned = query.trim();
    if (!cleaned) {
      return;
    }
    if (!backendPolicyId) {
      setChatError('No backend policy mapped for this discussion.');
      return;
    }

    setChatError(null);

    const userMessage: ChatMessage = { id: `u-${Date.now()}`, role: 'user', text: cleaned };
    setChatHistory((prev) => {
      const next = [...prev, userMessage];
      onChatHistoryChange(policy.id, next);
      return next;
    });

    try {
      setIsAskingPolicy(true);
      const response = await askPolicyQuestion(backendPolicyId, cleaned);

      const modelInfo = response.used_fallback
        ? '\n\nFallback mode active.'
        : `\n\nModel: ${response.model_name}`;

      const assistantMessage: ChatMessage = {
        id: `a-${Date.now()}`,
        role: 'assistant',
        text: `${response.answer}${modelInfo}`,
        supportingArgumentIds: response.supporting_argument_ids,
        modelName: response.model_name,
        usedFallback: response.used_fallback,
      };

      setChatHistory((prev) => {
        const next = [...prev, assistantMessage];
        onChatHistoryChange(policy.id, next);
        return next;
      });
    } catch (error) {
      setChatError(error instanceof Error ? error.message : 'Failed to get policy answer');
    } finally {
      setIsAskingPolicy(false);
    }
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
      setShowCreateForm(false);
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
          ? { ...argument, upvotes: result.upvotes, downvotes: result.downvotes }
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

  const forArguments = localArguments.filter((argument) => argument.side === 'for');
  const againstArguments = localArguments.filter((argument) => argument.side === 'against');

  const argumentLabelById = React.useMemo(() => {
    return Object.fromEntries(
      localArguments.map((argument) => [
        argument.id,
        `${argument.side === 'for' ? 'For' : 'Against'}: ${argument.claim}`,
      ]),
    ) as Record<string, string>;
  }, [localArguments]);

  const formatReferenceLabel = (argumentId: string): string => {
    const label = argumentLabelById[argumentId];
    if (!label) {
      return `Argument ${argumentId.slice(0, 8)}`;
    }
    return label.length > 84 ? `${label.slice(0, 84)}...` : label;
  };

  return (
    <div className="bg-surface text-on-surface font-sans selection:bg-secondary-container selection:text-on-secondary-container">
      <main className="max-w-[1440px] mx-auto px-8 pt-24 pb-24">
        <button
          onClick={onBack}
          className="mb-6 inline-flex items-center gap-2 bg-surface-container-low text-primary px-4 py-2 rounded-lg border border-outline-variant hover:bg-surface-container transition-colors focus-visible:focus-ring"
        >
          ← Back to ongoing policies
        </button>

        <section className="bg-primary text-white rounded-xl shadow-xl p-8 md:p-10 mb-10 relative overflow-hidden reveal">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-secondary-container via-transparent to-transparent" />
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <h1 className="text-4xl font-headline font-bold relative z-10">{policy.title}</h1>
            <span className="text-xs font-label uppercase tracking-wider text-secondary-container relative z-10">
              {policy.domain}
            </span>
          </div>

          <p className="mt-4 text-slate-200 leading-relaxed max-w-4xl relative z-10">{policy.description}</p>

          <div className="mt-5 relative z-10">
            <p className="font-label text-[10px] uppercase tracking-widest text-slate-300 mb-2">Policy Source</p>
            <a
              href={policy.sourceUrl ?? '#'}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 text-secondary-container hover:text-white transition-colors text-sm focus-visible:focus-ring rounded-sm"
            >
              {policy.sourceLabel ?? `${policy.title} Source Material`}
              <span className="text-xs">↗</span>
            </a>
          </div>

          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
            <div className="bg-white/10 border border-white/10 rounded-lg p-4">
              <span className="block font-label text-xs text-slate-300 uppercase tracking-widest">Citations</span>
              <span className="font-headline text-2xl font-bold text-secondary-container">
                {policy.citations.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-lg p-4">
              <span className="block font-label text-xs text-slate-300 uppercase tracking-widest">Active Debaters</span>
              <span className="font-headline text-2xl font-bold text-secondary-container">
                {policy.activeDebaters.toLocaleString()}
              </span>
            </div>
            <div className="bg-white/10 border border-white/10 rounded-lg p-4">
              <span className="block font-label text-xs text-slate-300 uppercase tracking-widest">Argument Split</span>
              <span className="font-headline text-xl font-bold text-secondary-container">
                {forArguments.length} For / {againstArguments.length} Against
              </span>
            </div>
          </div>

          {policy.partyPositions && policy.partyPositions.length > 0 && (
            <div className="mt-8 bg-white/10 border border-white/10 rounded-xl p-5 relative z-10">
              <h3 className="font-label text-xs uppercase tracking-widest text-slate-300 mb-4">Party Positions</h3>
              <div className="space-y-3">
                {policy.partyPositions.map((position) => {
                  const barColor =
                    position.stance === 'support'
                      ? 'bg-emerald-400'
                      : position.stance === 'oppose'
                        ? 'bg-rose-400'
                        : position.stance === 'mixed'
                          ? 'bg-amber-300'
                          : 'bg-slate-300';

                  return (
                    <div key={`${policy.id}-${position.party}`}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-100">{position.party}</span>
                        <span className="text-secondary-container font-semibold">{position.percent}%</span>
                      </div>
                      <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${barColor} rounded-full`}
                          style={{ width: `${Math.max(4, Math.min(100, position.percent))}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </section>

        <section className="bg-surface-container-low rounded-xl p-8 mb-10 border border-outline-variant/20 shadow-sm reveal stagger-1">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <h2 className="text-2xl font-semibold">AI Debate Summary</h2>
            <button
              onClick={handleGenerateSummary}
              disabled={summaryLoading || !backendPolicyId}
              className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-60 hover:bg-primary-container transition-colors focus-visible:focus-ring"
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
              <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-5">
                <h3 className="font-label text-xs uppercase tracking-widest text-emerald-700 mb-3">FOR</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {summary.strongest_for.map((point, idx) => (
                    <li key={`for-${idx}`}>{point}</li>
                  ))}
                </ul>
              </div>
              <div className="bg-rose-50 border border-rose-100 rounded-lg p-5">
                <h3 className="font-label text-xs uppercase tracking-widest text-rose-700 mb-3">AGAINST</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm">
                  {summary.strongest_against.map((point, idx) => (
                    <li key={`against-${idx}`}>{point}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </section>

        <section className="bg-white rounded-xl shadow p-8 mb-10 border border-outline-variant/20 reveal stagger-2">
          <div className="flex items-center justify-between gap-3 mb-6">
            <h2 className="text-2xl font-semibold">Structured Arguments</h2>
            <button
              onClick={() => setShowCreateForm((prev) => !prev)}
              className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-container transition-colors focus-visible:focus-ring"
            >
              {showCreateForm ? 'Close' : 'Add Argument'}
            </button>
          </div>

          {argumentError && (
            <p className="text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3 mb-4">
              {argumentError}
            </p>
          )}

          {showCreateForm && (
            <form
              onSubmit={handleCreateArgument}
              className="space-y-4 mb-8 bg-surface-container-low rounded-lg p-5 border border-outline-variant/20"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">Side</label>
                  <select
                    value={newArgumentSide}
                    onChange={(event) => setNewArgumentSide(event.target.value as 'for' | 'against')}
                    className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 focus-visible:focus-ring"
                  >
                    <option value="for">For</option>
                    <option value="against">Against</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">Claim</label>
                  <input
                    value={newArgumentClaim}
                    onChange={(event) => setNewArgumentClaim(event.target.value)}
                    className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 focus-visible:focus-ring"
                    maxLength={280}
                    placeholder="State your claim in one sentence"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs uppercase tracking-wider text-on-surface-variant mb-2">Reasoning</label>
                <textarea
                  value={newArgumentReasoning}
                  onChange={(event) => setNewArgumentReasoning(event.target.value)}
                  className="w-full border border-outline-variant/30 rounded-lg px-3 py-2 min-h-[100px] focus-visible:focus-ring"
                  placeholder="Explain your reasoning"
                />
              </div>

              <button
                type="submit"
                disabled={isCreatingArgument || !backendPolicyId}
                className="bg-primary text-white px-4 py-2 rounded-lg disabled:opacity-60 hover:bg-primary-container transition-colors focus-visible:focus-ring"
              >
                {isCreatingArgument ? 'Posting...' : 'Post Argument'}
              </button>
            </form>
          )}

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 items-start">
            <ArgumentColumn
              title="For"
              side="for"
              argumentsList={forArguments}
              expandedArgumentId={expandedArgumentId}
              commentsByArgument={commentsByArgument}
              loadingCommentsByArgument={loadingCommentsByArgument}
              newCommentByArgument={newCommentByArgument}
              onVote={(id, value) => void handleVote(id, value)}
              onToggleComments={(id) => void toggleArgumentComments(id)}
              onCommentInput={(id, value) =>
                setNewCommentByArgument((prev) => ({
                  ...prev,
                  [id]: value,
                }))
              }
              onCommentSubmit={(id) => void handleCreateComment(id)}
            />

            <ArgumentColumn
              title="Against"
              side="against"
              argumentsList={againstArguments}
              expandedArgumentId={expandedArgumentId}
              commentsByArgument={commentsByArgument}
              loadingCommentsByArgument={loadingCommentsByArgument}
              newCommentByArgument={newCommentByArgument}
              onVote={(id, value) => void handleVote(id, value)}
              onToggleComments={(id) => void toggleArgumentComments(id)}
              onCommentInput={(id, value) =>
                setNewCommentByArgument((prev) => ({
                  ...prev,
                  [id]: value,
                }))
              }
              onCommentSubmit={(id) => void handleCreateComment(id)}
            />
          </div>
        </section>

        <section className="mb-10 reveal stagger-3">
          <h2 className="text-2xl font-semibold mb-4">Live discussion & AI assistant</h2>
          <ChatBox onSubmit={handleChatSubmit} />
          {isAskingPolicy && (
            <p className="mt-3 text-sm text-on-surface-variant">Assistant is analyzing policy context...</p>
          )}
          {chatError && (
            <p className="mt-3 text-sm text-rose-700 bg-rose-50 border border-rose-200 rounded-lg p-3">
              {chatError}
            </p>
          )}
          <div className="mt-6 space-y-3">
            {chatHistory.map((message) => (
              <div
                key={message.id}
                className={`rounded-lg p-4 ${
                  message.role === 'user' ? 'bg-secondary-container/20' : 'bg-surface-container-lowest'
                }`}
              >
                <span className="block text-[10px] uppercase tracking-wider text-on-surface-variant">
                  {message.role === 'user' ? 'You' : 'Assistant'}
                </span>
                <p className="mt-1 text-sm text-on-surface">{message.text}</p>
                {message.role === 'assistant' && (message.supportingArgumentIds?.length ?? 0) > 0 && (
                  <div className="mt-3">
                    <p className="text-[10px] uppercase tracking-wider text-on-surface-variant mb-2">
                      Related Arguments
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {message.supportingArgumentIds?.map((argumentId) => (
                        <a
                          key={`${message.id}-${argumentId}`}
                          href={`#argument-${argumentId}`}
                          className="text-xs border border-outline-variant/40 bg-surface px-2 py-1 rounded hover:bg-surface-container-low transition-colors focus-visible:focus-ring"
                          title={argumentLabelById[argumentId] ?? argumentId}
                        >
                          {formatReferenceLabel(argumentId)}
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};
