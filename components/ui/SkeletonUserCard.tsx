import React from 'react';

export const SkeletonUserCard: React.FC = () => {
  return (
    <div className="bg-white dark:bg-surface-dark rounded-2xl shadow-lg border border-border-light dark:border-border-dark overflow-hidden animate-fadeIn">
      {/* Gradient Header skeleton */}
      <div className="h-24 sm:h-32 skeleton" />
      
      {/* Avatar skeleton */}
      <div className="relative px-4 sm:px-6 -mt-10 sm:-mt-12 mb-4">
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full skeleton border-4 border-white dark:border-surface-dark mx-auto" />
      </div>

      {/* Content skeleton */}
      <div className="px-4 sm:px-6 pb-4 sm:pb-6 text-center space-y-3">
        <div className="h-5 w-32 skeleton rounded mx-auto" />
        <div className="h-4 w-20 skeleton rounded mx-auto" />
        <div className="h-3 w-full skeleton rounded" />
        <div className="h-3 w-4/5 skeleton rounded mx-auto" />
        
        {/* Stats skeleton */}
        <div className="flex items-center justify-center gap-4 py-3 border-y border-border-light dark:border-border-dark my-4">
          <div className="text-center">
            <div className="h-6 w-10 skeleton rounded mx-auto mb-1" />
            <div className="h-3 w-16 skeleton rounded" />
          </div>
          <div className="w-px h-8 bg-border-light dark:border-border-dark" />
          <div className="text-center">
            <div className="h-6 w-10 skeleton rounded mx-auto mb-1" />
            <div className="h-3 w-16 skeleton rounded" />
          </div>
        </div>

        {/* Button skeleton */}
        <div className="h-10 w-full skeleton rounded-xl" />
      </div>
    </div>
  );
};

export const SkeletonUserGrid: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} style={{ animationDelay: `${index * 50}ms` }}>
          <SkeletonUserCard />
        </div>
      ))}
    </div>
  );
};
