import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Heart, Share2, ArrowLeft, Eye } from 'lucide-react';
import { useWorkers } from '../hooks/useWorkers';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import ContactModal from '../components/ContactModal';
import { ReviewCard } from '../components/ReviewCard';
import { ProfileSkeleton, ErrorState } from '../components/LoadingSkeleton';
import { getProfession, getInitials } from '../utils/helpers';
import api from '../utils/api';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { showToast } = useToast();
  const { worker, loading, error, fetchWorker } = useWorkers();
  const [reviews, setReviews] = useState([]);
  const [showContact, setShowContact] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    fetchWorker(id).then((data) => { if (data) setReviews(data.reviews || []); });
  }, [id]);

  if (loading) return <div className="section-container py-8"><ProfileSkeleton /></div>;
  if (error || !worker) return <div className="section-container py-8"><ErrorState message={error} onRetry={() => fetchWorker(id)} /></div>;

  const u = worker.user || {};
  const prof = getProfession(worker.profession);

  const handleSave = async () => {
    if (!user) { showToast('Please login to save workers', 'error'); navigate('/login'); return; }
    try {
      const { data } = await api.post(`/bookmarks/${worker._id}`);
      setIsSaved(data.saved);
      showToast(data.saved ? 'Worker saved!' : 'Removed from saved', 'success');
    } catch { showToast('Failed to save worker', 'error'); }
  };

  const handleContact = () => {
    if (!user) { navigate('/login'); return; }
    setShowContact(true);
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Profile link copied!', 'success');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="section-container py-6">
        <button onClick={() => navigate(-1)} className="btn-secondary text-sm mb-5">
          <ArrowLeft size={14} /> Back
        </button>

        <div className="flex flex-col lg:flex-row gap-5">
          {/* Main content */}
          <div className="flex-1 min-w-0 space-y-4">
            {/* Hero card */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="card p-6">
              <div className="flex flex-col sm:flex-row gap-5">
                <div className="flex-shrink-0">
                  {u.profilePhoto ? (
                    <img src={u.profilePhoto} alt={u.name} className="w-24 h-24 rounded-2xl object-cover ring-4 ring-gray-50" />
                  ) : (
                    <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-trust-blue-600 to-trust-blue-900 flex items-center justify-center text-white font-heading font-black text-3xl">
                      {getInitials(u.name)}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-start gap-2 mb-2">
                    <h1 className="font-heading font-black text-2xl sm:text-3xl text-gray-900">{u.name}</h1>
                    {worker.isAvailable ? (
                      <span className="badge badge-green text-xs">● Available</span>
                    ) : (
                      <span className="badge badge-gray text-xs">● Unavailable</span>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span className={`badge ${prof.badge}`}>{prof.icon} {prof.label}</span>
                    <span className="badge badge-gray"><MapPin size={10} /> {u.city}</span>
                    <span className="badge badge-gray"><Clock size={10} /> {worker.experience} yrs exp</span>
                    <span className="badge badge-gray"><Eye size={10} /> {worker.totalViews} views</span>
                  </div>

                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex">
                      {[1,2,3,4,5].map((n) => (
                        <Star key={n} size={14} className={n <= Math.round(worker.averageRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                      ))}
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">{worker.averageRating?.toFixed(1)}</span>
                    <span className="text-gray-400 text-sm">({worker.totalReviews} reviews)</span>
                  </div>

                  <div className="font-heading font-black text-3xl text-trust-blue">
                    {worker.hourlyRate} <span className="text-base font-normal text-gray-400 font-sans">ETB/hour</span>
                  </div>
                </div>
              </div>

              {/* Skills */}
              {worker.skills?.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Skills</p>
                  <div className="flex flex-wrap gap-2">
                    {worker.skills.map((s) => (
                      <span key={s} className="bg-trust-blue-50 text-trust-blue-700 text-xs font-medium px-3 py-1 rounded-full">{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Bio */}
            {worker.bio && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="card p-6">
                <h2 className="font-heading font-bold text-lg text-gray-900 mb-3">About</h2>
                <p className="text-gray-600 text-sm leading-relaxed">{worker.bio}</p>
              </motion.div>
            )}

            {/* Work Samples */}
            {worker.workSamples?.length > 0 && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="card p-6">
                <h2 className="font-heading font-bold text-lg text-gray-900 mb-4">Work Samples</h2>
                <div className="grid grid-cols-3 gap-3">
                  {worker.workSamples.map((url, i) => (
                    <motion.img
                      key={i} src={url} alt={`Work ${i + 1}`}
                      whileHover={{ scale: 1.03 }}
                      className="w-full h-28 object-cover rounded-xl cursor-pointer"
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* Reviews */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="card p-6">
              <h2 className="font-heading font-bold text-lg text-gray-900 mb-4">Reviews ({worker.totalReviews})</h2>
              {reviews.length === 0 ? (
                <p className="text-sm text-gray-400 text-center py-6">No reviews yet. Be the first to work with {u.name?.split(' ')[0]}!</p>
              ) : (
                <div className="space-y-3">
                  {reviews.map((r, i) => <ReviewCard key={r._id} review={r} index={i} />)}
                </div>
              )}
            </motion.div>
          </div>

          {/* Sticky sidebar */}
          <div className="lg:w-72 flex-shrink-0">
            <div className="sticky top-20 space-y-3">
              <div className="card p-5 bg-trust-blue text-white border-trust-blue-700">
                <p className="text-xs text-blue-100 mb-1">Hourly Rate</p>
                <p className="font-heading font-black text-3xl mb-4">{worker.hourlyRate} ETB</p>
                <motion.button whileTap={{ scale: 0.97 }} onClick={handleContact}
                  className="w-full bg-construction-orange hover:bg-construction-orange-700 text-white font-semibold py-3 rounded-xl text-sm flex items-center justify-center gap-2 transition-colors mb-2">
                  📬 Contact Worker
                </motion.button>
                <button onClick={handleSave}
                  className={`w-full py-2.5 rounded-xl text-sm font-medium flex items-center justify-center gap-2 transition-colors ${isSaved ? 'bg-white/20 text-white' : 'bg-white/10 hover:bg-white/20 text-white/80'}`}>
                  <Heart size={14} className={isSaved ? 'fill-current' : ''} />
                  {isSaved ? 'Saved' : 'Save Worker'}
                </button>
              </div>

              <div className="card p-5">
                <h3 className="font-heading font-bold text-sm text-gray-800 mb-4">Quick Info</h3>
                <div className="space-y-3 text-sm">
                  {[
                    { icon: '📍', label: 'Location', value: u.city },
                    { icon: '🏅', label: 'Experience', value: `${worker.experience} years` },
                    { icon: '💬', label: 'Total Reviews', value: worker.totalReviews },
                    { icon: '⭐', label: 'Rating', value: `${worker.averageRating?.toFixed(1) || 0}/5` },
                    { icon: '🕐', label: 'Response', value: '< 2 hours' },
                    { icon: '✅', label: 'Jobs Done', value: `${worker.totalContacts || 0}+` },
                  ].map(({ icon, label, value }) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-400">{icon} {label}</span>
                      <span className="font-medium text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button onClick={handleShare} className="btn-secondary w-full justify-center text-sm">
                <Share2 size={14} /> Share Profile
              </button>
            </div>
          </div>
        </div>
      </div>

      {showContact && <ContactModal worker={{ ...worker, user: worker.user }} onClose={() => setShowContact(false)} />}
    </div>
  );
};

export default WorkerProfile;
