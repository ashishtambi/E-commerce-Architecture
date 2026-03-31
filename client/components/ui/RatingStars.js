'use client';

import { Star } from 'lucide-react';

export default function RatingStars({ rating = 0, reviewsCount = 0, size = 14, className = '' }) {
  const roundedRating = Math.round(Number(rating) * 2) / 2;

  return (
    <div className={`inline-flex items-center gap-1 ${className}`}>
      {[1, 2, 3, 4, 5].map((value) => {
        const filled = value <= roundedRating;

        return (
          <Star
            key={value}
            size={size}
            className={filled ? 'text-amber-500' : 'text-slate-300 dark:text-slate-600'}
            fill={filled ? 'currentColor' : 'none'}
            strokeWidth={1.8}
          />
        );
      })}
      <span className="ml-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
        {Number(rating).toFixed(1)}
      </span>
      {reviewsCount > 0 && <span className="text-xs text-slate-500 dark:text-slate-400">({reviewsCount})</span>}
    </div>
  );
}
