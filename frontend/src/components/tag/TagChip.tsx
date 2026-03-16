import { XMarkIcon } from '@heroicons/react/24/outline';
import type { MouseEvent } from 'react';

interface TagChipProps {
  name: string;
  onRemove?: (e: MouseEvent) => void;
  className?: string;
  color?: string;
}

const colorClasses = {
  tech: 'bg-blue-100 text-blue-800 border-blue-200',
  music: 'bg-purple-100 text-purple-800 border-purple-200',
  art: 'bg-pink-100 text-pink-800 border-pink-200',
  business: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  sports: 'bg-orange-100 text-orange-800 border-orange-200',
  food: 'bg-amber-100 text-amber-800 border-amber-200',
  workshop: 'bg-indigo-100 text-indigo-800 border-indigo-200',
  conference: 'bg-cyan-100 text-cyan-800 border-cyan-200',
  networking: 'bg-violet-100 text-violet-800 border-violet-200',
  default: 'bg-gray-100 text-gray-800 border-gray-200',
};

export default function TagChip({ name, onRemove, className = '' }: TagChipProps) {
  const colorKey = name.toLowerCase() as keyof typeof colorClasses;
  const colorClass = colorClasses[colorKey] || colorClasses.default;

  return (
    <span
      className={`
        inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
        border ${colorClass} transition-colors
        ${onRemove ? 'pr-1' : ''} ${className}
      `}
    >
      {name}
      {onRemove && (
        <button
          onClick={onRemove}
          className="ml-1 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${name} tag`}
        >
          <XMarkIcon className="w-3 h-3" />
        </button>
      )}
    </span>
  );
}