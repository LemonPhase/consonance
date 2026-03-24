import React from 'react';

interface HeroSectionProps {
  title: string;
  description: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ title, description }) => {
  return (
    <header className="mb-14 rounded-2xl overflow-hidden border border-outline-variant/25 shadow-sm bg-surface-container-lowest relative">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_-10%,rgba(254,214,91,0.25),transparent_45%)] pointer-events-none" />
      <div className="px-8 py-10 md:px-10 md:py-12 relative z-10">
        <p className="font-label text-[11px] uppercase tracking-[0.2em] text-secondary mb-3">
          Ongoing Policy Docket
        </p>
        <h1 className="font-headline text-5xl md:text-6xl text-primary font-bold tracking-tight leading-tight">
          {title}
        </h1>
        <p className="font-body text-lg md:text-xl text-on-surface-variant max-w-3xl leading-relaxed mt-4">
          {description}
        </p>
      </div>
    </header>
  );
};
