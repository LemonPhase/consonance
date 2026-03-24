import React from 'react';

interface HeroSectionProps {
  title: string;
  description: string;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ title, description }) => {
  return (
    <header className="mb-16 space-y-4">
      <h1 className="font-headline text-5xl md:text-6xl text-primary font-bold tracking-tight">
        {title}
      </h1>
      <p className="font-body text-xl text-on-surface-variant max-w-3xl leading-relaxed">
        {description}
      </p>
    </header>
  );
};
