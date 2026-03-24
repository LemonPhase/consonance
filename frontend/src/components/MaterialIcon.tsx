import React from 'react';

interface MaterialIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  className?: string;
  fill?: boolean;
}

export const MaterialIcon: React.FC<MaterialIconProps> = ({ 
  icon, 
  size = 'md', 
  className = '',
  fill = false 
}) => {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl',
    '2xl': 'text-2xl',
    '3xl': 'text-3xl',
  };

  return (
    <span 
      className={`material-symbols-outlined ${sizeClasses[size]} ${className}`}
      style={{ fontVariationSettings: fill ? '"FILL" 1' : '"FILL" 0' }}
    >
      {icon}
    </span>
  );
};
