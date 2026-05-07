import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import { FilterSidebar } from '../components/StatsCounter';
import WorkerCard from '../components/WorkerCard';
import ContactModal from '../components/ContactModal';
import { WorkerGridSkeleton, EmptyState, ErrorState } from '../components/LoadingSkeleton';
import { useWorkers } from '../hooks/useWorkers';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import api from '../utils/api';

const SORT_OPTIONS = [
  { value: 'rating', label: '⭐ Top Rated' },
  { value: 'rate-low', label: '💰 Rate: Low → High' },
  { value: 'rate-high', label: '💸 Rate: High → Low' },
  { value: 'exp', label: '🏅 Most Experienced' },
];

const WorkerSearch = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { workers, loading, error, fetchWorkers } = useWorkers();
  const [searchParams, setSearchParams] = useSearchParams();
  const [contactWorker, setContactWorker] = useState(null);
  const [savedWorkers, setSavedWorkers] = useState(new Set());
  const [sortBy, setSortBy] = useState('rating');
  const [showFilters, setShowFilters] = useState(false);
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    profession: searchParams.get('profession') || '',
    city: searchParams.get('city') || '',
    maxRate: 1000,
    minRating: 0,
    availableOnly: false,
  });

  const updateFilters = useCallback((updates) => {
    setFilters((f) => ({ ...f, ...updates }));
  }, []);

  useEffect(() => {
    const params = { sortBy };
    if (filters.profession) params.profession = filters.profession;
    if (filters.city) params.city = filters.city;
    if (filters.maxRate < 1000) params.maxRate = filters.maxRate;
    if (filters.minRating > 0) params.minRating = filters.minRating;
    if (filters.availableOnly) params.available = 'true';
    fetchWorkers(params);
    // Update URL
    const sp = new URLSearchParams();
    if (filters.profession) sp.set('profession', filters.profession);
    if (filters.city) sp.set('city', filters.city);
    setSearchParams(sp, { replace: true });
  }, [filters, sortBy]);

  const handleToggleSave = async (workerId) => {
    if (!user) { showToast('Please login to save workers', 'error'); navigate('/login'); return; }
    try {
      const { data } = await api.post(`/bookmarks/${workerId}`);
      setSavedWorkers((prev) => {
        const next = new Set(prev);
        if (data.saved) next.add(workerId); else next.delete(workerId);
        return next;
      });
      showToast(data.saved ? 'Worker saved!' : 'Removed from saved', 'success');
    } catch {
      showToast('Please login to save workers', 'error');
    }
  };

  const handleContact = (worker) => {
    if (!user) { showToast('Please login to contact workers', 'error'); navigate('/login'); return; }
    setContactWorker(worker);
  };

  const profLabel = filters.profession
    ? filters.profession.charAt(0).toUpperCase() + filters.profession.slice(1) + 's'
    : 'Workers';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="section-container py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading font-bold text-xl text-gray-900">
                {filters.city ? `${profLabel} in ${filters.city}` : `All ${profLabel}`}
              </h1>
              {!loading && (
                <p className="text-sm text-gray-500 mt-0.5">{workers.length} results found</p>
              )}
            </div>
            <div className="flex items-center gap-2">
              <select
                className="text-sm border border-gray-200 rounded-xl px-3 py-2 bg-white text-gray-700 outline-none cursor-pointer focus:border-trust-blue-400"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                {SORT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="lg:hidden btn-secondary py-2 px-3 text-sm"
              >
                <SlidersHorizontal size={15} /> Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="section-container py-6">
        <div className="flex gap-5 items-start">
          {/* Filter sidebar — desktop */}
          <div className="hidden lg:block">
            <FilterSidebar filters={filters} onChange={updateFilters} />
          </div>

          {/* Mobile filter */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/40 z-40 lg:hidden"
              onClick={() => setShowFilters(false)}
            >
              <motion.div
                initial={{ x: '-100%' }} animate={{ x: 0 }}
                className="absolute left-0 top-0 bottom-0 w-72 bg-white p-5 overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <FilterSidebar filters={filters} onChange={(u) => { updateFilters(u); }} />
              </motion.div>
            </motion.div>
          )}

          {/* Results */}
          <div className="flex-1 min-w-0">
            {loading ? (
              <WorkerGridSkeleton count={8} />
            ) : error ? (
              <ErrorState message={error} onRetry={() => fetchWorkers()} />
            ) : workers.length === 0 ? (
              <EmptyState
                icon="🔍"
                title="No workers found"
                description="Try adjusting your filters — remove profession or city restrictions to see more results."
                action={() => updateFilters({ profession: '', city: '', maxRate: 1000, minRating: 0, availableOnly: false })}
                actionLabel="Clear All Filters"
              />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {workers.map((w, i) => (
                  <WorkerCard
                    key={w._id}
                    worker={w}
                    index={i}
                    isSaved={savedWorkers.has(w._id)}
                    onContact={handleContact}
                    onSave={handleToggleSave}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {contactWorker && (
        <ContactModal worker={contactWorker} onClose={() => setContactWorker(null)} />
      )}
    </div>
  );
};

export default WorkerSearch;
