import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { PROFESSIONS } from '../utils/helpers';

// Animated stat counter
export const StatsCounter = ({ end, suffix = '', label }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1800;
    const step = end / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, end);
      setCount(Math.floor(start));
      if (start >= end) clearInterval(timer);
    }, 16);
    return () => clearInterval(timer);
  }, [inView, end]);

  return (
    <div ref={ref} className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.4 }}
        className="font-heading font-black text-4xl text-amber-400"
      >
        {count.toLocaleString()}{suffix}
      </motion.div>
      <p className="text-sm text-blue-100 mt-1 uppercase tracking-wider text-xs">{label}</p>
    </div>
  );
};

// Category Grid
export const CategoryGrid = () => {
  const navigate = useNavigate();
  const counts = { plumber: 143, electrician: 98, painter: 76, carpenter: 61, driver: 112, laborer: 87 };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
      {PROFESSIONS.map((prof, i) => (
        <motion.button
          key={prof.value}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.07 }}
          whileHover={{ y: -4, rotate: 1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(`/search?profession=${prof.value}`)}
          className="card flex flex-col items-center gap-2 p-4 hover:shadow-card-hover hover:border-trust-blue-200 transition-all duration-200"
        >
          <div className={`w-12 h-12 rounded-2xl ${prof.color} flex items-center justify-center text-2xl`}>
            {prof.icon}
          </div>
          <span className="font-heading font-bold text-sm text-gray-800">{prof.label}</span>
          <span className="text-xs text-gray-400">{counts[prof.value]} workers</span>
        </motion.button>
      ))}
    </div>
  );
};

// Testimonials
const testimonials = [
  { name: 'Abebe Mulugeta', role: 'Homeowner · Addis Ababa', rating: 5, text: 'Found a plumber within 2 hours. He showed up on time and fixed everything perfectly. TaskR is an absolute lifesaver!', initials: 'AM', color: '#1a3faa' },
  { name: 'Biruk Tadesse', role: 'Electrician · Adama', rating: 5, text: 'As an electrician, TaskR has tripled my monthly income. The platform is easy to use and the clients are genuine.', initials: 'BT', color: '#EA580C' },
  { name: 'Sara Kebede', role: 'Property Manager · Hawassa', rating: 4, text: 'I use TaskR monthly for my rental properties. Great selection of carpenters and painters. Highly recommend!', initials: 'SK', color: '#7c3aed' },
  { name: 'Daniel Girma', role: 'Carpenter · Bahir Dar', rating: 5, text: 'TaskR helped me build a client base from scratch. Within 3 months I had regular work every single week!', initials: 'DG', color: '#059669' },
  { name: 'Tigist Alemu', role: 'Business Owner · Dire Dawa', rating: 5, text: 'The driver I hired through TaskR was professional, punctual, and had an immaculate vehicle. Will use again!', initials: 'TA', color: '#be185d' },
];

export const TestimonialCarousel = () => (
  <div className="overflow-x-auto scrollbar-none pb-4" style={{ scrollbarWidth: 'none' }}>
    <div className="flex gap-4 w-max px-1">
      {testimonials.map((t, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.1 }}
          className="card p-5 w-72 flex-shrink-0 hover:shadow-card-hover transition-shadow"
        >
          <div className="text-amber-400 text-sm mb-3">{'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}</div>
          <p className="text-sm text-gray-600 leading-relaxed italic mb-4">"{t.text}"</p>
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold font-heading flex-shrink-0"
              style={{ background: t.color }}
            >
              {t.initials}
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{t.name}</p>
              <p className="text-xs text-gray-400">{t.role}</p>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// Filter Sidebar
export const FilterSidebar = ({ filters, onChange }) => {
  const { profession, city, maxRate, minRating, availableOnly } = filters;

  return (
    <div className="w-56 flex-shrink-0">
      <div className="card p-5 sticky top-20">
        <h3 className="font-heading font-bold text-sm text-gray-800 mb-4 pb-3 border-b border-gray-100">
          Filters
        </h3>

        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Profession</label>
            <select
              className="input-field text-sm"
              value={profession}
              onChange={(e) => onChange({ profession: e.target.value })}
            >
              <option value="">All Professions</option>
              {PROFESSIONS.map((p) => (
                <option key={p.value} value={p.value}>{p.icon} {p.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">City</label>
            <input
              className="input-field text-sm"
              placeholder="Any city..."
              value={city}
              onChange={(e) => onChange({ city: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Max Rate: <span className="text-trust-blue font-bold">{maxRate} ETB/hr</span>
            </label>
            <input
              type="range" min="50" max="1000" step="10"
              value={maxRate}
              onChange={(e) => onChange({ maxRate: Number(e.target.value) })}
              className="w-full accent-trust-blue"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Min Rating</label>
            {['0', '3', '4'].map((r) => (
              <label key={r} className="flex items-center gap-2 py-1 cursor-pointer">
                <input
                  type="radio" name="minRating"
                  value={r}
                  checked={String(minRating) === r}
                  onChange={() => onChange({ minRating: Number(r) })}
                  className="accent-trust-blue"
                />
                <span className="text-sm text-gray-600">
                  {r === '0' ? 'Any rating' : `${r}+ stars`}
                </span>
              </label>
            ))}
          </div>

          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => onChange({ availableOnly: e.target.checked })}
              className="accent-trust-blue w-4 h-4"
            />
            <span className="text-sm text-gray-600">Available now only</span>
          </label>

          <button
            onClick={() => onChange({ profession: '', city: '', maxRate: 1000, minRating: 0, availableOnly: false })}
            className="btn-secondary w-full justify-center text-sm py-2"
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
};

// AvailabilityToggle
export const AvailabilityToggle = ({ isAvailable, onChange, loading }) => (
  <div className="card p-4 flex items-center justify-between">
    <div>
      <p className="font-medium text-gray-800 text-sm">Availability Status</p>
      <p className={`text-xs mt-0.5 ${isAvailable ? 'text-green-600' : 'text-gray-400'}`}>
        {isAvailable ? '● Visible to customers' : '● Hidden from search'}
      </p>
    </div>
    <button
      onClick={() => !loading && onChange(!isAvailable)}
      className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${isAvailable ? 'bg-green-500' : 'bg-gray-300'} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <motion.span
        animate={{ x: isAvailable ? 24 : 2 }}
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow"
      />
    </button>
  </div>
);
