// Login.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, LogIn } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';

export const Login = () => {
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    setError('');
    try {
      const user = await login(form.email, form.password);
      showToast(`Welcome back, ${user.name.split(' ')[0]}!`, 'success');
      navigate(user.role === 'worker' ? '/worker/dashboard' : '/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Incorrect email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-sm"
      >
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-1 mb-4">
            <span className="font-heading font-black text-3xl text-trust-blue-800">Task</span>
            <span className="font-heading font-black text-3xl text-construction-orange">R</span>
          </Link>
          <h1 className="font-heading font-bold text-2xl text-gray-900">Welcome back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to your account</p>
        </div>

        <div className="card p-7">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email Address</label>
              <input type="email" className="input-field" placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Password</label>
              <div className="relative">
                <input type={showPass ? 'text' : 'password'} className="input-field pr-10" placeholder="Your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  {showPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            {error && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-4 py-3">
                {error}
              </motion.div>
            )}

            <motion.button type="submit" whileTap={{ scale: 0.97 }} disabled={loading}
              className="btn-primary w-full justify-center py-3 text-sm mt-2">
              {loading ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><LogIn size={15} /> Sign In</>}
            </motion.button>
          </form>

          <div className="mt-5 pt-5 border-t border-gray-100 text-center">
            <p className="text-xs text-gray-500">Don't have an account? <Link to="/register" className="text-trust-blue font-semibold hover:underline">Register free</Link></p>
          </div>

          <div className="mt-4 bg-trust-blue-50 rounded-xl p-3 text-xs text-trust-blue-700">
            <strong>Demo accounts:</strong><br />
            Customer: <code>customer@taskr.com</code><br />
            Worker: <code>worker@taskr.com</code><br />
            Password: <code>password123</code>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
