'use client';

export default function SkeletonLoader({ lines = 5, className = '' }) {
  return (
    <div className={`space-y-4 ${className}`}>
      {/* Title skeleton */}
      <div className="skeleton h-8 w-3/4 mb-6" />

      {/* Summary box */}
      <div className="skeleton h-24 w-full rounded-xl mb-4" />

      {/* Content lines */}
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          {i % 3 === 0 && <div className="skeleton h-6 w-1/2 mt-4" />}
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
          {i % 2 === 0 && <div className="skeleton h-4 w-4/6" />}
        </div>
      ))}

      {/* Bottom buttons skeleton */}
      <div className="flex gap-3 mt-6">
        <div className="skeleton h-10 w-32 rounded-xl" />
        <div className="skeleton h-10 w-32 rounded-xl" />
      </div>
    </div>
  );
}
