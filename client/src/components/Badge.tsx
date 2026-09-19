import React from 'react';
import { getStatusBadgeClass } from '../utils/formatters';

interface BadgeProps {
  status: string;
  className?: string;
  dot?: boolean;
}

export const Badge: React.FC<BadgeProps> = ({ status, className = '', dot = true }) => {
  const colorClasses = getStatusBadgeClass(status);

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorClasses} ${className}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 animate-pulse" />}
      {status.replace(/_/g, ' ')}
    </span>
  );
};
