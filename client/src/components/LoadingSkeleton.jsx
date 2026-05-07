import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

// Worker Card Skeleton
export const WorkerCardSkeleton = () => (
  <div className="card p-5 space-y-3">
    <div className="flex gap-3">
      <div className="skeleton w-14 h-14 rounded-full" />
      <div className="flex-1 space-y-2">
        <div className="skeleton h-4 w-3/4 rounded" />
        <div className="skeleton h-3 w-1/2 rounded" />
        <div className="skeleton h-3 w-1/3 rounded" />
      </div>
    </div>
    <div className="flex justify-between">
      <div className="skeleton h-4 w-20 rounded" />
      <div className="skeleton h-5 w-24 rounded" />
    </div>
    <div className="flex gap-2">
      <div className="skeleton h-6 w-16 rounded-full" />
      <div className="skeleton h-6 w-20 rounded-full" />
      <div className="skeleton h-6 w-14 rounded-full" />
    </div>
    <div className="flex gap-2">
      <div className="skeleton flex-1 h-9 rounded-xl" />
      <div className="skeleton w-9 h-9 rounded-xl" />
    </div>
  </div>
);

export const WorkerGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <WorkerCardSkeleton key={i} />
    ))}
  </div>
);

export const ProfileSkeleton = () => (
  <div className="space-y-4">
    <div className="card p-6">
      <div className="flex gap-6">
        <div className="skeleton w-24 h-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <div className="skeleton h-7 w-1/2 rounded" />
          <div className="skeleton h-4 w-1/3 rounded" />
          <div className="skeleton h-4 w-2/3 rounded" />
          <div className="skeleton h-6 w-24 rounded" />
        </div>
      </div>
    </div>
    <div className="card p-6 space-y-3">
      <div className="skeleton h-4 w-20 rounded" />
      <div className="skeleton h-3 w-full rounded" />
      <div className="skeleton h-3 w-4/5 rounded" />
      <div className="skeleton h-3 w-3/5 rounded" />
    </div>
  </div>
);

// Empty State
export const EmptyState = ({ icon, title, description, action, actionLabel }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    className="text-center py-16 px-6"
  >
    <div className="text-5xl mb-4">{icon || '📭'}</div>
    <h3 className="font-heading font-bold text-gray-800 text-lg mb-2">{title}</h3>
    <p className="text-sm text-gray-500 max-w-sm mx-auto leading-relaxed mb-6">{description}</p>
    {action && (
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={action}
        className="btn-primary mx-auto"
      >
        {actionLabel || 'Get Started'}
      </motion.button>
    )}
  </motion.div>
);

// Error State
export const ErrorState = ({ message, onRetry }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="text-center py-12 px-6"
  >
    <div className="text-4xl mb-3">⚠️</div>
    <h3 className="font-heading font-bold text-gray-800 mb-2">Something went wrong</h3>
    <p className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 max-w-sm mx-auto mb-5">
      {message || 'Failed to load data. Please try again.'}
    </p>
    {onRetry && (
      <button onClick={onRetry} className="btn-secondary mx-auto">
        <RefreshCw size={15} />
        Try Again
      </button>
    )}
  </motion.div>
);

// Inline spinner
export const Spinner = ({ size = 'md' }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-6 h-6', lg: 'w-8 h-8' };
  return (
    <div className={`${sizes[size]} border-2 border-trust-blue-200 border-t-trust-blue rounded-full animate-spin`} />
  );
};

export const PageLoader = () => (
  <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
    <div className="text-center">
      <Spinner size="lg" />
      <p className="text-sm text-gray-500 mt-3">Loading...</p>
    </div>
  </div>
);
