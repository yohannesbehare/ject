import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff, UserPlus, User, Wrench } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { PROFESSIONS, CITIES } from '../utils/helpers';

const Register = () => {
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [role, setRole] = useState(searchParams.get('role') || 'customer');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: '', email: '', phone: '', password: '', city: '',
    profession: '', hourlyRate: '', experience: '', bio: '',
  });

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Valid email required';
    if (!form.phone.trim()) e.phone = 'Phone is required';
    if (form.password.length < 8) e.password = 'Password must be at least 8 characters';
    if (!form.city) e.city = 'City is required';
    if (role === 'worker') {
      if (!form.profession) e.profession = 'Profession is required';
      if (!form.hourlyRate || Number(form.hourlyRate) < 1) e.hourlyRate = 'Hourly rate is required';
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const payload = { ...form, role };
      if (role === 'worker') {
        payload.hourlyRate = Number(form.hourlyRate);
        payload.experience = Number(form.experience) || 0;
      }
      const user = await register(payload);
      showToast('Account created! Welcome to TaskR 🎉', 'success');
      navigate(user.role === 'worker' ? '/worker/dashboard' : '/dashboard');
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-1 mb-4">
            <span className="font-heading font-black text-3xl text-trust-blue-800">Task</span>
            <span className="font-heading font-black text-3xl text-construction-orange">R</span>
          </Link>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Create Your Account</h1>
          <p className="text-gray-500 text-sm mt-1">Join thousands of users on TaskR</p>
        </div>

        <div className="card p-7">
          {/* Role Selector */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {[
              { value: 'customer', icon: User, label: "I'm a Customer", sub: 'Find skilled workers' },
              { value: 'worker', icon: Wrench, label: "I'm a Worker", sub: 'Get hired & earn more' },
            ].map(({ value, icon: Icon, label, sub }) => (
              <motion.button
                key={value} type="button" whileTap={{ scale: 0.97 }}
                onClick={() => setRole(value)}
                className={`p-4 rounded-2xl border-2 text-center transition-all ${
                  role === value
                    ? 'border-trust-blue bg-trust-blue-50 text-trust-blue'
                    : 'border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                <Icon size={24} className="mx-auto mb-1.5" />
                <p className="text-sm font-semibold">{label}</p>
                <p className="text-xs opacity-70 mt-0.5">{sub}</p>
              </motion.button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                <input className={`input-field ${errors.name ? 'border-red-400' : ''}`} placeholder="John Doe" value={form.name} onChange={(e) => set('name', e.target.value)} />
                {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                <input className={`input-field ${errors.phone ? 'border-red-400' : ''}`} placeholder="+251..." value={form.phone} onChange={(e) => set('phone', e.target.value)} />
                {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
              <input type="email" className={`input-field ${errors.email ? 'border-red-400' : ''}`} placeholder="you@example.com" value={form.email} onChange={(e) => set('email', e.target.value)} />
              {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className={`input-field pr-10 ${errors.password ? 'border-red-400' : ''}`} placeholder="Min 8 characters" value={form.password} onChange={(e) => set('password', e.target.value)} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City</label>
              <select className={`input-field ${errors.city ? 'border-red-400' : ''}`} value={form.city} onChange={(e) => set('city', e.target.value)}>
                <option value="">Select your city...</option>
                {CITIES.map((c) => <option key={c}>{c}</option>)}
              </select>
              {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
            </div>

            {/* Worker-specific fields */}
            <AnimatePresence>
              {role === 'worker' && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Profession</label>
                      <select className={`input-field ${errors.profession ? 'border-red-400' : ''}`} value={form.profession} onChange={(e) => set('profession', e.target.value)}>
                        <option value="">Select...</option>
                        {PROFESSIONS.map((p) => <option key={p.value} value={p.value}>{p.icon} {p.label}</option>)}
                      </select>
                      {errors.profession && <p className="text-xs text-red-500 mt-1">{errors.profession}</p>}
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Hourly Rate (ETB)</label>
                      <input type="number" min="1" className={`input-field ${errors.hourlyRate ? 'border-red-400' : ''}`} placeholder="e.g. 150" value={form.hourlyRate} onChange={(e) => set('hourlyRate', e.target.value)} />
                      {errors.hourlyRate && <p className="text-xs text-red-500 mt-1">{errors.hourlyRate}</p>}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Years of Experience</label>
                    <input type="number" min="0" max="60" className="input-field" placeholder="e.g. 5" value={form.experience} onChange={(e) => set('experience', e.target.value)} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Short Bio <span className="text-gray-400 normal-case font-normal">(optional)</span></label>
                    <textarea rows={2} className="input-field resize-none" placeholder="Tell clients about your experience and skills..." value={form.bio} onChange={(e) => set('bio', e.target.value)} />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {errors.submit && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-4 py-3">{errors.submit}</div>
            )}

            <motion.button type="submit" whileTap={{ scale: 0.97 }} disabled={loading}
              className="btn-primary w-full justify-center py-3 text-sm">
              {loading
                ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><UserPlus size={15} /> Create Account</>}
            </motion.button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">Already have an account? <Link to="/login" className="text-trust-blue font-semibold hover:underline">Sign in</Link></p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
