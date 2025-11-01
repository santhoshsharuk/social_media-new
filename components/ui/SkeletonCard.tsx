import React from 'react';

export const SkeletonCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-border-light dark:border-border-dark p-4 sm:p-6 animate-fadeIn">
      {/* Header skeleton */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full skeleton flex-shrink-0" />
        <div className="flex-1">
          <div className="h-4 w-32 skeleton rounded mb-2" />
          <div className="h-3 w-24 skeleton rounded" />
        </div>
      </div>

      {/* Content skeleton */}
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full skeleton rounded" />
        <div className="h-3 w-5/6 skeleton rounded" />
        <div className="h-3 w-4/6 skeleton rounded" />
      </div>

      {/* Image skeleton */}
      <div className="w-full h-64 skeleton rounded-xl mb-4" />

      {/* Actions skeleton */}
      <div className="flex items-center justify-between pt-4 border-t border-border-light dark:border-border-dark">
        <div className="flex gap-4">
          <div className="h-8 w-16 skeleton rounded-lg" />
          <div className="h-8 w-16 skeleton rounded-lg" />
          <div className="h-8 w-16 skeleton rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const SkeletonCardList: React.FC<{ count?: number }> = ({ count = 3 }) => {
  return (
    <div className="space-y-4 sm:space-y-6 pb-20 sm:pb-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={{ animationDelay: `${index * 100}ms` }}>
          <SkeletonCard />
        </div>
      ))}
    </div>
  );
};
