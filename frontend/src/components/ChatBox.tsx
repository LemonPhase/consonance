import React, { useState } from 'react';
import { MaterialIcon } from './MaterialIcon';

interface SuggestedQuery {
  id: string;
  text: string;
}

interface ChatBoxProps {
  suggestedQueries?: SuggestedQuery[];
  onSubmit?: (query: string) => void;
}

export const ChatBox: React.FC<ChatBoxProps> = ({ 
  suggestedQueries = [
    { id: '1', text: 'Economic impact on first-time buyers' },
    { id: '2', text: 'CMA section 4.2 summary' },
    { id: '3', text: 'Infrastructure requirements' },
  ],
  onSubmit,
}) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSubmit?.(query);
      setQuery('');
    }
  };

  const handleSuggestedClick = (text: string) => {
    onSubmit?.(text);
  };

  return (
    <section className="mb-24">
      <div className="max-w-4xl mx-auto">
        <div className="bg-primary p-1 rounded-xl shadow-2xl overflow-hidden">
          <div className="bg-primary p-8 md:p-12 relative">
            <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
              <MaterialIcon icon="quick_reference_all" size="3xl" />
            </div>
            
            <h2 className="font-serif text-3xl text-secondary-container mb-4">
              Ask about this Policy
            </h2>
            <p className="text-on-primary-container font-sans text-sm mb-8 max-w-lg">
              Query the statutory instruments, CMA findings, or potential local impacts. Our AI 
              synthesizer cross-references parliamentary records in real-time.
            </p>

            <form onSubmit={handleSubmit} className="relative mb-4">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="How does this impact the 'Green Belt' designation in the South East?"
                className="w-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 rounded-lg py-5 px-6 pr-16 focus:ring-2 focus:ring-secondary focus:border-secondary transition-all font-sans"
              />
              <button
                type="submit"
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-secondary-container text-on-secondary-container p-3 rounded-lg hover:bg-secondary-fixed transition-colors"
                aria-label="Send query"
              >
                <MaterialIcon icon="send" />
              </button>
            </form>

            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] text-white/50 uppercase font-label">Suggested:</span>
              {suggestedQueries.map((sq) => (
                <button
                  key={sq.id}
                  onClick={() => handleSuggestedClick(sq.text)}
                  className="text-xs text-white/80 hover:text-white border border-white/20 px-3 py-1 rounded-full transition-colors"
                >
                  {sq.text}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
