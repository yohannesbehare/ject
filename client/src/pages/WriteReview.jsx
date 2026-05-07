import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ReviewForm } from '../components/ReviewCard';
import { useAuth } from '../hooks/useAuth';

const WriteReview = () => {
  const { contactRequestId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-1 mb-3">
            <span className="font-heading font-black text-2xl text-trust-blue-800">Task</span>
            <span className="font-heading font-black text-2xl text-construction-orange">R</span>
          </Link>
          <h1 className="font-heading font-bold text-xl text-gray-900">Leave a Review</h1>
          <p className="text-sm text-gray-500 mt-1">Help the TaskR community with your feedback</p>
        </div>
        <div className="card p-7">
          <ReviewForm
            contactRequestId={contactRequestId}
            workerName="your worker"
            onSuccess={() => setTimeout(() => navigate('/dashboard'), 2000)}
          />
          <div className="mt-4 text-center">
            <button onClick={() => navigate('/dashboard')} className="text-xs text-gray-400 hover:text-gray-600">
              Skip for now
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default WriteReview;
