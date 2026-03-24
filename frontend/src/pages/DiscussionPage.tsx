import React, { useState } from 'react';
import { PolicyCardData } from '../components/PolicyCard';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';
import { ChatBox } from '../components/ChatBox';

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
}

export const DiscussionPage: React.FC<DiscussionPageProps> = ({ policy, onBack, initialChatHistory, onChatHistoryChange }) => {
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>(initialChatHistory);

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
