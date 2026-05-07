// formatCurrency.js
export const formatCurrency = (amount, currency = 'ETB') =>
  `${Number(amount).toLocaleString('en-ET')} ${currency}`;

export const formatRate = (rate) => `${formatCurrency(rate)}/hr`;

// starRating.js
export const renderStars = (rating, size = 'sm') => {
  const sizes = { sm: 'text-sm', md: 'text-base', lg: 'text-xl' };
  const full = Math.floor(rating);
  const hasHalf = rating % 1 >= 0.5;
  const empty = 5 - full - (hasHalf ? 1 : 0);
  return {
    fullStars: full,
    hasHalf,
    emptyStars: empty,
    className: `stars-gold ${sizes[size] || sizes.sm}`,
  };
};

export const StarDisplay = ({ rating, count, size = 'sm' }) => {
  const { fullStars, hasHalf, emptyStars, className } = renderStars(rating, size);
  return (
    <span className="inline-flex items-center gap-1">
      <span className={className}>
        {'★'.repeat(fullStars)}
        {hasHalf ? '½' : ''}
        {'☆'.repeat(emptyStars)}
      </span>
      {count !== undefined && (
        <span className="text-gray-500 text-xs">({count})</span>
      )}
    </span>
  );
};

// Profession helpers
export const PROFESSIONS = [
  { value: 'plumber', label: 'Plumber', icon: '🔧', color: 'bg-blue-50 text-blue-700', badge: 'badge-blue' },
  { value: 'electrician', label: 'Electrician', icon: '⚡', color: 'bg-yellow-50 text-yellow-700', badge: 'badge-yellow' },
  { value: 'painter', label: 'Painter', icon: '🎨', color: 'bg-purple-50 text-purple-700', badge: 'bg-purple-50 text-purple-700' },
  { value: 'carpenter', label: 'Carpenter', icon: '🔨', color: 'bg-orange-50 text-orange-700', badge: 'badge-orange' },
  { value: 'driver', label: 'Driver', icon: '🚛', color: 'bg-green-50 text-green-700', badge: 'badge-green' },
  { value: 'laborer', label: 'Laborer', icon: '🏗️', color: 'bg-gray-50 text-gray-700', badge: 'badge-gray' },
];

export const getProfession = (value) =>
  PROFESSIONS.find((p) => p.value === value) || { value, label: value, icon: '👷', color: 'bg-gray-50 text-gray-700', badge: 'badge-gray' };

export const CITIES = ['Addis Ababa', 'Adama', 'Hawassa', 'Bahir Dar', 'Dire Dawa', 'Mekelle', 'Jimma', 'Gondar', 'Dessie', 'Jijiga'];

export const URGENCY_COLORS = {
  low: 'badge-green',
  medium: 'badge-yellow',
  high: 'badge-red',
};

export const STATUS_COLORS = {
  pending: 'badge-yellow',
  accepted: 'badge-blue',
  completed: 'badge-green',
  declined: 'badge-red',
};

export const timeAgo = (date) => {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return 'just now';
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
};

export const getInitials = (name) =>
  (name || '').split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
