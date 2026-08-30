import React from 'react';
import { SourceId } from '@/lib/types';

interface SourceBadgeProps {
  sourceId: SourceId;
  className?: string;
  size?: 'sm' | 'md';
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ sourceId, className = '', size = 'sm' }) => {
  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-sm font-medium';

  switch (sourceId) {
    case '411':
      return (
        <span className={`inline-flex items-center font-semibold rounded-md bg-blue-500/10 text-blue-400 border border-blue-500/25 ${sizeClasses} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 mr-1.5 animate-pulse-subtle"></span>
          411 Scenepacks
        </span>
      );
    case 'veel':
      return (
        <span className={`inline-flex items-center font-semibold rounded-md bg-pink-500/10 text-pink-400 border border-pink-500/25 ${sizeClasses} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-pink-400 mr-1.5 animate-pulse-subtle"></span>
          Veel SCP
        </span>
      );
    case 'editpacks':
      return (
        <span className={`inline-flex items-center font-semibold rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 ${sizeClasses} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse-subtle"></span>
          EditPacks
        </span>
      );
    case 'suits':
      return (
        <span className={`inline-flex items-center font-semibold rounded-md bg-amber-500/10 text-amber-400 border border-amber-500/25 ${sizeClasses} ${className}`}>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mr-1.5 animate-pulse-subtle"></span>
          SuitsTM
        </span>
      );
    default:
      return (
        <span className={`inline-flex items-center rounded-md bg-gray-800 text-gray-300 border border-gray-700 ${sizeClasses} ${className}`}>
          {sourceId}
        </span>
      );
  }
};
