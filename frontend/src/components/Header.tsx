import React from 'react';
import { MaterialIcon } from './MaterialIcon';

interface HeaderProps {
  currentView?: 'main' | 'discussion';
  onViewChange?: (view: 'main' | 'discussion') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView = 'main',
  onViewChange = () => undefined,
}) => {
  const navLinks = [
    { label: 'Ongoing Policies', view: 'main' as const },
    { label: 'Discussion', view: 'discussion' as const },
  ];
  return (
    <header className="bg-surface/90 backdrop-blur-xl fixed w-full top-0 z-50 border-b border-outline-variant/40">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <button
            onClick={() => onViewChange('main')}
            className="text-2xl font-serif tracking-tight text-primary hover:text-secondary transition-colors focus-visible:focus-ring rounded-sm"
          >
            Consonance
          </button>
          <span className="hidden lg:inline-block text-[10px] uppercase tracking-[0.2em] text-on-surface-variant font-label">
            Structured Public Reasoning
          </span>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                className={`transition-all duration-200 font-label px-3 py-1.5 rounded-lg ${
                  currentView === link.view
                    ? 'text-primary bg-secondary-container/30 font-semibold shadow-sm'
                    : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low'
                } focus-visible:focus-ring`}
                onClick={() => onViewChange(link.view)}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined p-2 text-on-surface-variant hover:bg-surface-container-low rounded-full transition-all md:hidden focus-visible:focus-ring">
            menu
          </button>
          <div className="h-6 w-[1px] bg-outline-variant/60" />
          <button className="flex items-center gap-2 font-label text-sm font-medium text-primary bg-surface-container-low px-3 py-1.5 rounded-lg hover:bg-secondary-container/25 transition-colors focus-visible:focus-ring">
            <MaterialIcon icon="account_circle" />
            Sign In
          </button>
        </div>
      </div>
    </header>
  );
};
