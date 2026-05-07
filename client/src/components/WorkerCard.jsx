import { motion } from 'framer-motion';
import { MapPin, Clock, Star, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getProfession, formatRate, getInitials } from '../utils/helpers';

const WorkerCard = ({ worker, onContact, onSave, isSaved = false, index = 0 }) => {
  const navigate = useNavigate();
  const prof = getProfession(worker.profession || worker.workerProfile?.profession);
  const name = worker.user?.name || worker.name;
  const city = worker.user?.city || worker.city;
  const photo = worker.user?.profilePhoto || worker.profilePhoto;
  const rate = worker.hourlyRate;
  const rating = worker.averageRating || 0;
  const reviewCount = worker.totalReviews || 0;
  const exp = worker.experience || 0;
  const skills = worker.skills || [];
  const isAvailable = worker.isAvailable !== false;

  const handleViewProfile = () => navigate(`/worker/${worker._id}`);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.3 }}
      whileHover={{ y: -4, boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }}
      className="card cursor-pointer group relative overflow-hidden border border-gray-100 hover:border-trust-blue-200 transition-all duration-200"
      onClick={handleViewProfile}
    >
      {/* Available indicator */}
      {isAvailable && (
        <div className="absolute top-3 right-3">
          <span className="flex items-center gap-1.5 text-xs text-green-600 font-medium bg-green-50 px-2 py-1 rounded-full border border-green-100">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            Available
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex gap-3 mb-3">
          <div className="flex-shrink-0">
            {photo ? (
              <img src={photo} alt={name} className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-100" />
            ) : (
              <div className="w-14 h-14 rounded-full bg-gradient-to-br from-trust-blue to-trust-blue-700 flex items-center justify-center text-white font-bold text-lg font-heading">
                {getInitials(name)}
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0 pr-16">
            <h3 className="font-heading font-bold text-gray-900 text-base truncate">{name}</h3>
            <span className={`badge ${prof.badge} text-xs mt-0.5`}>
              {prof.icon} {prof.label}
            </span>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={11} className="text-gray-400 flex-shrink-0" />
              <span className="text-xs text-gray-500 truncate">{city}</span>
            </div>
          </div>
        </div>

        {/* Rating & Rate */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-1">
            <Star size={13} className="text-amber-400 fill-amber-400" />
            <span className="text-sm font-semibold text-gray-800">{rating.toFixed(1)}</span>
            <span className="text-xs text-gray-400">({reviewCount})</span>
          </div>
          <div className="text-right">
            <span className="font-heading font-bold text-trust-blue text-lg">{rate}</span>
            <span className="text-xs text-gray-400"> ETB/hr</span>
          </div>
        </div>

        {/* Experience */}
        <div className="flex items-center gap-1 text-xs text-gray-500 mb-3">
          <Clock size={11} />
          <span>{exp} years experience</span>
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {skills.slice(0, 3).map((skill) => (
            <span key={skill} className="text-xs bg-trust-blue-50 text-trust-blue-700 px-2 py-0.5 rounded-full font-medium">
              {skill}
            </span>
          ))}
          {skills.length > 3 && (
            <span className="text-xs text-gray-400">+{skills.length - 3}</span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onContact?.(worker)}
            className="flex-1 btn-primary text-sm py-2 justify-center"
          >
            Contact
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => onSave?.(worker._id)}
            className={`p-2 rounded-xl border transition-colors ${
              isSaved
                ? 'bg-red-50 border-red-200 text-red-500'
                : 'bg-white border-gray-200 text-gray-400 hover:text-red-400 hover:border-red-200'
            }`}
          >
            <Heart size={16} className={isSaved ? 'fill-current' : ''} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default WorkerCard;
