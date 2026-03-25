/**
 * SkeletonLoader — Premium shimmer loading placeholders
 * Variants: card, text, image, hero, product-card
 */

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={`skeleton skeleton-text ${i === lines - 1 ? 'short' : i % 2 === 0 ? '' : 'medium'}`}
        />
      ))}
    </div>
  );
}

export function SkeletonImage({ className = '', aspectRatio = 'aspect-video' }) {
  return (
    <div className={`skeleton ${aspectRatio} w-full rounded-2xl ${className}`} />
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 ${className}`}>
      <div className="skeleton h-48 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <div className="skeleton skeleton-text lg w-3/4" />
        <div className="skeleton skeleton-text medium" />
        <div className="skeleton skeleton-text short" />
        <div className="flex items-center justify-between pt-3">
          <div className="skeleton h-8 w-24 rounded-lg" />
          <div className="skeleton h-10 w-28 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonProductCard({ className = '' }) {
  return (
    <div className={`bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 animate-pulse ${className}`}>
      <div className="h-52 bg-slate-200 dark:bg-slate-700 relative">
        <div className="absolute top-3 left-3 h-5 w-16 bg-slate-300 dark:bg-slate-600 rounded-full" />
      </div>
      <div className="p-5 space-y-3">
        <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
        <div className="flex items-center gap-2 pt-1">
          <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-3 w-8 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
          <div className="h-7 w-20 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-10 w-28 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonHero({ className = '' }) {
  return (
    <div className={`relative min-h-[60vh] bg-slate-200 dark:bg-slate-800 overflow-hidden ${className}`}>
      <div className="absolute inset-0 animate-shimmer" />
      <div className="absolute inset-0 flex flex-col items-center justify-center space-y-6 px-4">
        <div className="skeleton h-4 w-40 rounded-full" />
        <div className="skeleton skeleton-text xl w-96 max-w-full" />
        <div className="skeleton skeleton-text lg w-72 max-w-full" />
        <div className="skeleton h-12 w-48 rounded-full mt-4" />
      </div>
    </div>
  );
}

export default function SkeletonLoader({ variant = 'card', count = 1, className = '' }) {
  const Component = {
    card: SkeletonCard,
    'product-card': SkeletonProductCard,
    text: SkeletonText,
    image: SkeletonImage,
    hero: SkeletonHero,
  }[variant] || SkeletonCard;

  if (count === 1) return <Component className={className} />;

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <Component key={i} className={className} />
      ))}
    </>
  );
}
