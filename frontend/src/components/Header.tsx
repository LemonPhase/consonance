import React from 'react';
import { MaterialIcon } from './MaterialIcon';
import { NavLink } from '../types/index';

interface HeaderProps {
  currentView: 'main' | 'discussion';
  onViewChange: (view: 'main' | 'discussion') => void;
}

export const Header: React.FC<HeaderProps> = ({ currentView, onViewChange }) => {
  const navLinks = [
    { label: 'Ongoing Policies', view: 'main' as const },
    { label: 'Discussion', view: 'discussion' as const },
  ];
  return (
    <header className="bg-slate-50 dark:bg-[#000a1e] fixed w-full top-0 z-50">
      <div className="flex justify-between items-center w-full px-8 py-4 max-w-[1440px] mx-auto">
        <div className="flex items-center gap-8">
          <span className="text-2xl font-serif tracking-tight text-[#000a1e] dark:text-white">
            Consonance
          </span>
          <nav className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <button
                key={link.label}
                className={`transition-colors font-label px-3 py-1 rounded ${
                  currentView === link.view
                    ? 'text-[#002147] dark:text-[#fed65b] font-semibold border-b-2 border-[#735c00]'
                    : 'text-slate-600 dark:text-slate-400 hover:text-[#002147] dark:hover:text-white'
                }`}
                onClick={() => onViewChange(link.view)}
              >
                {link.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined p-2 text-slate-600 hover:bg-slate-100 rounded-full transition-all">
            menu
          </button>
          <div className="h-6 w-[1px] bg-slate-200" />
          <button className="flex items-center gap-2 font-label text-sm font-medium text-[#002147]">
            <MaterialIcon icon="account_circle" />
            Sign In
          </button>
        </div>
      </div>
      <div className="bg-[#f3f3f3] dark:bg-[#002147] h-[1px] w-full" />
    </header>
  );
};
