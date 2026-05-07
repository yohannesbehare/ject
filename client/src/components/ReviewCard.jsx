import { useState } from 'react';
import { motion } from 'framer-motion';
import { Star, CheckCircle } from 'lucide-react';
import { getInitials } from '../utils/helpers';

// Review Card
export const ReviewCard = ({ review, index = 0 }) => {
  const customer = review.customerId;
  const name = typeof customer === 'object' ? customer?.name : review.authorName || 'Anonymous';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08 }}
      className="bg-gray-50 rounded-2xl p-4 border border-gray-100"
    >
      <div className="flex justify-between items-start mb-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-trust-blue flex items-center justify-center text-white text-xs font-bold">
            {getInitials(name)}
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-800">{name}</p>
            <div className="text-amber-400 text-xs">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </div>
          </div>
        </div>
        <span className="text-xs text-gray-400">
          {new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
        </span>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
    </motion.div>
  );
};

// Review Form
export const ReviewForm = ({ contactRequestId, workerName, onSuccess }) => {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const labels = ['', 'Poor', 'Fair', 'Good', 'Great', 'Excellent!'];

  const handleSubmit = async () => {
    if (!rating) { setError('Please select a star rating'); return; }
    if (!comment.trim()) { setError('Please write a review'); return; }
    setLoading(true);
    try {
      // Call API
      const api = (await import('../utils/api')).default;
      await api.post('/reviews', { contactRequestId, rating, comment });
      setSubmitted(true);
      onSuccess?.();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="text-green-500" size={32} />
        </div>
        <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Review Published!</h3>
        <p className="text-sm text-gray-500">Thank you for helping the TaskR community.</p>
      </motion.div>
    );
  }

  return (
    <div className="space-y-5">
      <div className="text-center">
        <p className="text-gray-600 text-sm mb-3">How was your experience with <strong>{workerName}</strong>?</p>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((n) => (
            <motion.button
              key={n}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
              className="text-3xl transition-colors"
              style={{ color: n <= (hover || rating) ? '#f59e0b' : '#d1d5db' }}
            >
              ★
            </motion.button>
          ))}
        </div>
        {(hover || rating) > 0 && (
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm font-medium text-amber-600 mt-1">
            {labels[hover || rating]}
          </motion.p>
        )}
      </div>

      <div>
        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Your Review</label>
        <textarea
          className="input-field resize-none"
          rows={4}
          placeholder="Share your experience — quality of work, professionalism, punctuality..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
      </div>

      {error && <p className="text-xs text-red-500 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSubmit}
        disabled={loading}
        className="btn-primary w-full justify-center py-3"
      >
        {loading ? 'Submitting...' : 'Submit Review'}
      </motion.button>
    </div>
  );
};

// Footer
export const Footer = () => (
  <footer className="bg-gray-900 text-gray-400 py-12 mt-16">
    <div className="section-container">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-8">
        <div className="col-span-2 sm:col-span-1">
          <div className="flex items-center gap-1 mb-3">
            <span className="font-heading font-black text-xl text-white">Task</span>
            <span className="font-heading font-black text-xl text-construction-orange">R</span>
          </div>
          <p className="text-xs leading-relaxed">Ethiopia's trusted marketplace for skilled workers. Connecting talent with opportunity.</p>
        </div>
        {[
          { title: 'Platform', links: ['Find Workers', 'How It Works', 'Categories', 'Pricing'] },
          { title: 'For Workers', links: ['Register as Worker', 'Worker Dashboard', 'Grow Your Business', 'Success Stories'] },
          { title: 'Support', links: ['Help Center', 'Contact Us', 'Privacy Policy', 'Terms of Service'] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-semibold text-white text-sm mb-3">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}><a href="#" className="text-xs hover:text-white transition-colors">{link}</a></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-gray-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-xs">© {new Date().getFullYear()} TaskR. All rights reserved.</p>
        <p className="text-xs">Made with ❤️ for Ethiopian workers</p>
      </div>
    </div>
  </footer>
);
