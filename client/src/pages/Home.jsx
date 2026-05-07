import { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView } from 'framer-motion';
import { Search, ArrowRight, Wrench, Zap, Paintbrush, Hammer, Truck, HardHat } from 'lucide-react';
import { StatsCounter, CategoryGrid, TestimonialCarousel } from '../components/StatsCounter';
import { Footer } from '../components/ReviewCard';

const HERO_BG = 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1600&q=80&auto=format&fit=crop';

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.12, duration: 0.5 } }),
};

const Home = () => {
  const navigate = useNavigate();
  const howRef = useRef(null);
  const howInView = useInView(howRef, { once: true, margin: '-80px' });
  const ctaRef = useRef(null);
  const ctaInView = useInView(ctaRef, { once: true, margin: '-80px' });

  const handleSearch = (e) => {
    e.preventDefault();
    const profession = e.target.profession.value;
    const city = e.target.city.value;
    const params = new URLSearchParams();
    if (profession) params.set('profession', profession);
    if (city) params.set('city', city);
    navigate(`/search?${params.toString()}`);
  };

  return (
    <div className="min-h-screen">
      {/* ── HERO ── */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <img src={HERO_BG} alt="Construction" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-br from-trust-blue-900/92 via-trust-blue-800/85 to-trust-blue-700/80" />
        </div>

        {/* Floating tool icons */}
        {[Wrench, Zap, Paintbrush, Hammer, Truck, HardHat].map((Icon, i) => (
          <motion.div
            key={i}
            className="absolute text-white/10"
            style={{
              left: `${10 + i * 15}%`,
              top: `${15 + (i % 3) * 25}%`,
            }}
            animate={{
              y: [0, -18, 0],
              rotate: [0, i % 2 === 0 ? 12 : -12, 0],
            }}
            transition={{
              duration: 4 + i * 0.5,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: i * 0.4,
            }}
          >
            <Icon size={32 + i * 4} />
          </motion.div>
        ))}

        <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-block bg-white/15 border border-white/25 text-white text-xs font-medium px-4 py-1.5 rounded-full mb-6 backdrop-blur-sm"
          >
            🇪🇹 Ethiopia's #1 Skilled Worker Marketplace
          </motion.div>

          <motion.h1
            custom={0} variants={fadeUp} initial="hidden" animate="visible"
            className="font-heading font-black text-5xl sm:text-6xl md:text-7xl text-white leading-none mb-6"
          >
            Find <span className="text-amber-400">Skilled Workers</span><br />Near You — Today
          </motion.h1>

          <motion.p
            custom={1} variants={fadeUp} initial="hidden" animate="visible"
            className="text-blue-100 text-lg mb-10 max-w-xl mx-auto leading-relaxed"
          >
            Connect with verified plumbers, electricians, painters, carpenters and more across Ethiopia. Fast, trusted, affordable.
          </motion.p>

          {/* Search bar */}
          <motion.form
            custom={2} variants={fadeUp} initial="hidden" animate="visible"
            onSubmit={handleSearch}
            className="flex flex-col sm:flex-row gap-2 max-w-xl mx-auto bg-white/15 backdrop-blur-md border border-white/25 rounded-2xl p-2"
          >
            <select
              name="profession"
              className="flex-1 bg-transparent text-white text-sm px-3 py-2.5 outline-none border-none appearance-none cursor-pointer"
              style={{ color: 'white' }}
            >
              <option value="" style={{ color: '#111' }}>All Professions</option>
              <option value="plumber" style={{ color: '#111' }}>🔧 Plumber</option>
              <option value="electrician" style={{ color: '#111' }}>⚡ Electrician</option>
              <option value="painter" style={{ color: '#111' }}>🎨 Painter</option>
              <option value="carpenter" style={{ color: '#111' }}>🔨 Carpenter</option>
              <option value="driver" style={{ color: '#111' }}>🚛 Driver</option>
              <option value="laborer" style={{ color: '#111' }}>🏗️ Laborer</option>
            </select>
            <div className="hidden sm:block w-px bg-white/25 my-1" />
            <input
              name="city"
              placeholder="Enter your city..."
              className="flex-1 bg-transparent text-white placeholder-white/60 text-sm px-3 py-2.5 outline-none border-none"
            />
            <motion.button
              type="submit"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="bg-construction-orange text-white font-semibold px-6 py-2.5 rounded-xl flex items-center gap-2 text-sm whitespace-nowrap"
            >
              <Search size={15} /> Search Workers
            </motion.button>
          </motion.form>

          {/* Quick links */}
          <motion.div
            custom={3} variants={fadeUp} initial="hidden" animate="visible"
            className="flex flex-wrap justify-center gap-2 mt-6"
          >
            {['Plumber', 'Electrician', 'Painter', 'Carpenter'].map((p) => (
              <button
                key={p}
                onClick={() => navigate(`/search?profession=${p.toLowerCase()}`)}
                className="text-xs bg-white/10 hover:bg-white/20 border border-white/20 text-white px-3 py-1.5 rounded-full transition-colors"
              >
                {p}
              </button>
            ))}
          </motion.div>
        </div>

        {/* Stats bar at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-black/30 backdrop-blur-sm border-t border-white/10">
          <div className="section-container py-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <StatsCounter end={500} suffix="+" label="Verified Workers" />
              <StatsCounter end={10000} suffix="+" label="Jobs Completed" />
              <StatsCounter end={50} suffix="+" label="Cities Covered" />
              <StatsCounter end={8500} suffix="+" label="Happy Clients" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CATEGORIES ── */}
      <section id="categories" className="page-section bg-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 mb-3">Browse by Profession</h2>
            <p className="text-gray-500 max-w-md mx-auto">Click any category to instantly browse verified workers in your city</p>
          </motion.div>
          <CategoryGrid />
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" ref={howRef} className="page-section bg-gray-50">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-center mb-10"
          >
            <h2 className="font-heading font-black text-3xl sm:text-4xl text-gray-900 mb-3">How TaskR Works</h2>
            <p className="text-gray-500">Get the help you need in three simple steps</p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              { step: '01', icon: '🔍', title: 'Search & Filter', desc: 'Browse hundreds of verified skilled workers by profession, city, rating, and hourly rate. Advanced filters help you find the perfect match.' },
              { step: '02', icon: '📋', title: 'Compare Profiles', desc: 'View detailed profiles with work samples, real client reviews, experience level, and transparent hourly rates before deciding.' },
              { step: '03', icon: '🤝', title: 'Hire & Review', desc: 'Send a contact request, describe your job, set your preferred date. Once the job is done, leave a review to help the community.' },
            ].map((s, i) => (
              <motion.div
                key={s.step}
                initial={{ opacity: 0, y: 30 }}
                animate={howInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                whileHover={{ y: -4 }}
                className="card p-6 transition-all duration-200 hover:shadow-card-hover"
              >
                <div className="font-heading font-black text-5xl text-trust-blue-100 mb-3">{s.step}</div>
                <div className="text-3xl mb-3">{s.icon}</div>
                <h3 className="font-heading font-bold text-lg text-gray-900 mb-2">{s.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TOP WORKERS ── */}
      <section className="page-section bg-white">
        <div className="section-container">
          <div className="flex justify-between items-end mb-8">
            <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-heading font-black text-3xl text-gray-900 mb-1">Top-Rated Workers</h2>
              <p className="text-gray-500 text-sm">Handpicked from our best verified professionals</p>
            </motion.div>
            <motion.button
              initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/search')}
              className="btn-secondary text-sm hidden sm:flex"
            >
              View All <ArrowRight size={14} />
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { name: 'Alemu Bekele', profession: 'plumber', city: 'Addis Ababa', rate: 180, rating: 4.9, reviews: 47, exp: 8 },
              { name: 'Dawit Haile', profession: 'electrician', city: 'Addis Ababa', rate: 220, rating: 4.8, reviews: 89, exp: 12 },
              { name: 'Tigist Worku', profession: 'painter', city: 'Hawassa', rate: 120, rating: 4.7, reviews: 34, exp: 5 },
              { name: 'Yonas Tesfaye', profession: 'carpenter', city: 'Bahir Dar', rate: 200, rating: 4.9, reviews: 62, exp: 15 },
            ].map((w, i) => {
              const profMap = { plumber: { icon: '🔧', badge: 'badge-blue' }, electrician: { icon: '⚡', badge: 'badge-yellow' }, painter: { icon: '🎨', badge: 'bg-purple-50 text-purple-700' }, carpenter: { icon: '🔨', badge: 'badge-orange' } };
              const p = profMap[w.profession];
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4 }}
                  onClick={() => navigate('/search')}
                  className="card p-5 cursor-pointer hover:shadow-card-hover hover:border-trust-blue-100 transition-all duration-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-trust-blue-600 to-trust-blue-800 flex items-center justify-center text-white font-heading font-bold">
                      {w.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <p className="font-heading font-bold text-sm text-gray-900">{w.name}</p>
                      <span className={`badge ${p.badge} text-xs`}>{p.icon} {w.profession.charAt(0).toUpperCase() + w.profession.slice(1)}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-amber-400 text-sm">{'★'.repeat(Math.floor(w.rating))}</span>
                    <span className="text-sm font-bold text-gray-800">{w.rating}</span>
                    <span className="text-xs text-gray-400">({w.reviews})</span>
                  </div>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">📍 {w.city}</span>
                    <span className="font-heading font-bold text-trust-blue">{w.rate} ETB/hr</span>
                  </div>
                </motion.div>
              );
            })}
          </div>

          <div className="text-center mt-6 sm:hidden">
            <button onClick={() => navigate('/search')} className="btn-secondary mx-auto">View All Workers <ArrowRight size={14} /></button>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="page-section bg-gray-50">
        <div className="section-container">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-8">
            <h2 className="font-heading font-black text-3xl text-gray-900 mb-2">What People Say</h2>
            <p className="text-gray-500">Trusted by thousands of customers and workers across Ethiopia</p>
          </motion.div>
          <TestimonialCarousel />
        </div>
      </section>

      {/* ── WORKER CTA ── */}
      <section ref={ctaRef} className="page-section bg-white">
        <div className="section-container">
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={ctaInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5 }}
            className="bg-gray-900 rounded-3xl p-8 sm:p-12 flex flex-col sm:flex-row justify-between items-center gap-8"
          >
            <div>
              <span className="text-xs text-amber-400 uppercase tracking-widest font-semibold">For Skilled Workers</span>
              <h2 className="font-heading font-black text-3xl sm:text-4xl text-white mt-2 mb-3">
                Grow Your Business<br />with TaskR
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-md">
                Join 500+ skilled workers already earning more on TaskR. Create your free profile today, set your own rates, and start getting clients within 24 hours.
              </p>
              <div className="flex gap-6 mt-6">
                {['Free to join', 'Set your own rates', 'Direct client contact'].map((f) => (
                  <div key={f} className="flex items-center gap-1.5 text-xs text-gray-400">
                    <span className="text-green-400">✓</span> {f}
                  </div>
                ))}
              </div>
            </div>
            <div className="text-center flex-shrink-0">
              <div className="text-6xl mb-4">👷</div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/register?role=worker')}
                className="btn-orange whitespace-nowrap text-base px-8 py-3"
              >
                Register as Worker <ArrowRight size={16} />
              </motion.button>
              <p className="text-xs text-gray-600 mt-2">No credit card required</p>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
