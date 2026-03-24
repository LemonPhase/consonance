import React from 'react';

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterBarProps {
  options: FilterOption[];
  activeFilter: string;
  onFilterChange: (filterId: string) => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ options, activeFilter, onFilterChange }) => {
  return (
    <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onFilterChange(option.id)}
          className={`px-5 py-2.5 rounded-full font-label text-xs uppercase tracking-widest transition-all whitespace-nowrap border focus-visible:focus-ring ${
            activeFilter === option.id
              ? 'bg-primary text-white border-primary shadow-sm'
              : 'bg-surface-container-low text-on-surface-variant border-outline-variant/40 hover:bg-surface-container-high hover:text-primary'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
