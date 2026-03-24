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
    <div className="flex items-center gap-4 mb-12 overflow-x-auto pb-4">
      {options.map((option) => (
        <button
          key={option.id}
          onClick={() => onFilterChange(option.id)}
          className={`px-6 py-2 rounded-full font-label text-sm font-medium transition-colors whitespace-nowrap ${
            activeFilter === option.id
              ? 'bg-primary text-white'
              : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'
          }`}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
