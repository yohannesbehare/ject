import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LayoutDashboard, Inbox, Edit, Star, LogOut, Check, X, CheckCheck } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { AvailabilityToggle } from '../components/StatsCounter';
import { ReviewCard } from '../components/ReviewCard';
import { EmptyState } from '../components/LoadingSkeleton';
import { STATUS_COLORS, URGENCY_COLORS, PROFESSIONS, timeAgo, getInitials, CITIES } from '../utils/helpers';
import api from '../utils/api';

const NAV = [
  { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'requests', icon: Inbox, label: 'Job Requests' },
  { id: 'edit', icon: Edit, label: 'Edit Profile' },
  { id: 'reviews', icon: Star, label: 'Reviews' },
];

const ALL_SKILLS = {
  plumber: ['Pipe Fitting', 'Water Heater', 'Bathroom Install', 'Leak Repair', 'Drainage', 'Irrigation', 'Gas Lines', 'Sump Pump'],
  electrician: ['Wiring', 'Circuit Boards', 'Solar Install', 'Generator', 'Switch Panels', 'CCTV', 'Smart Home', 'Emergency'],
  painter: ['Interior', 'Exterior', 'Texture', 'Waterproof', 'Wallpaper', 'Wall Art', 'Color Consult', 'Decorative'],
  carpenter: ['Furniture', 'Doors & Windows', 'Roofing', 'Flooring', 'Cabinetry', 'Framing', 'Decks', 'Stairs'],
  driver: ['Long Distance', 'Cargo', 'Luxury', 'Night Driving', 'Airport', 'City Tours', 'Deliveries'],
  laborer: ['Heavy Lifting', 'Excavation', 'Demolition', 'Cleanup', 'Material Handling', 'Landscaping'],
};

const WorkerDashboard = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [requests, setRequests] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [availLoading, setAvailLoading] = useState(false);
  const [isAvailable, setIsAvailable] = useState(true);
  const [editForm, setEditForm] = useState({});
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => { loadData(); }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'overview') {
        const { data } = await api.get('/dashboard/worker');
        setStats(data.stats);
        setRequests(data.recentRequests || []);
        setReviews(data.recentReviews || []);
        setProfile(data.profile);
        setIsAvailable(data.stats?.isAvailable !== false);
      } else if (tab === 'requests') {
        const { data } = await api.get('/contacts/worker');
        setRequests(data.contacts || []);
      } else if (tab === 'reviews') {
        const workerUser = user;
        const { data } = await api.get(`/reviews/worker/${workerUser?.id}`);
        setReviews(data.reviews || []);
      } else if (tab === 'edit') {
        const { data } = await api.get('/auth/me');
        const wp = data.workerProfile;
        setProfile(wp);
        setEditForm({
          name: data.user?.name || '',
          phone: data.user?.phone || '',
          city: data.user?.city || '',
          bio: wp?.bio || '',
          hourlyRate: wp?.hourlyRate || '',
          experience: wp?.experience || '',
          profession: wp?.profession || '',
        });
        setSelectedSkills(wp?.skills || []);
      }
    } catch {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleAvailability = async (val) => {
    setAvailLoading(true);
    try {
      await api.patch('/workers/availability', { isAvailable: val });
      setIsAvailable(val);
      showToast(val ? 'You are now visible to customers' : 'You are now hidden from search', 'success');
    } catch {
      showToast('Failed to update availability', 'error');
    } finally {
      setAvailLoading(false);
    }
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await api.patch(`/contacts/${id}`, { status });
      setRequests((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
      showToast(`Request ${status}!`, 'success');
    } catch {
      showToast('Failed to update status', 'error');
    }
  };

  const handleSaveProfile = async () => {
    try {
      await api.patch('/workers/profile', { ...editForm, skills: selectedSkills });
      showToast('Profile updated!', 'success');
    } catch {
      showToast('Failed to update profile', 'error');
    }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : prev.length < 10 ? [...prev, skill] : prev
    );
  };

  const completeness = profile ? Math.min(100, [
    !!user?.name, !!user?.phone, !!profile.bio, !!profile.profession,
    !!profile.hourlyRate, (profile.skills?.length > 0), (profile.workSamples?.length > 0),
  ].filter(Boolean).length * 15) : 0;

  const RequestsTable = ({ data }) => (
    data.length === 0 ? (
      <EmptyState icon="📭" title="No requests yet" description="When customers contact you, their requests will appear here." />
    ) : (
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Customer', 'Job', 'Date', 'Urgency', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((r, i) => {
                const customer = r.customerId;
                return (
                  <motion.tr key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                    className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-construction-orange flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(customer?.name || r.customerName || 'C')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 text-xs">{customer?.name || r.customerName}</p>
                          <p className="text-gray-400 text-xs">{r.customerPhone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 text-xs max-w-[150px] truncate">{r.jobDescription}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{timeAgo(r.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${URGENCY_COLORS[r.urgency]} capitalize text-xs`}>{r.urgency}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLORS[r.status]} capitalize text-xs`}>{r.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {r.status === 'pending' && (
                        <div className="flex gap-1">
                          <button onClick={() => handleUpdateStatus(r._id, 'accepted')}
                            className="p-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors" title="Accept">
                            <Check size={12} />
                          </button>
                          <button onClick={() => handleUpdateStatus(r._id, 'declined')}
                            className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors" title="Decline">
                            <X size={12} />
                          </button>
                        </div>
                      )}
                      {r.status === 'accepted' && (
                        <button onClick={() => handleUpdateStatus(r._id, 'completed')}
                          className="flex items-center gap-1 text-xs bg-blue-50 text-trust-blue px-2 py-1 rounded-lg hover:bg-blue-100 transition-colors">
                          <CheckCheck size={11} /> Done
                        </button>
                      )}
                      {(r.status === 'completed' || r.status === 'declined') && (
                        <span className="text-xs text-gray-400">—</span>
                      )}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    )
  );

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-56 flex-shrink-0 bg-white border-r border-gray-100 flex flex-col">
        <div className="p-5 border-b border-gray-100">
          <Link to="/" className="flex items-center gap-0.5">
            <span className="font-heading font-black text-xl text-trust-blue-800">Task</span>
            <span className="font-heading font-black text-xl text-construction-orange">R</span>
          </Link>
        </div>
        <nav className="flex-1 p-3">
          {NAV.map(({ id, icon: Icon, label }) => (
            <button key={id} onClick={() => setTab(id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm mb-0.5 transition-all ${
                tab === id ? 'bg-trust-blue-50 text-trust-blue font-semibold' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-800'
              }`}>
              <Icon size={16} />{label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={() => { logout(); navigate('/'); }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={16} />Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6">
        {tab === 'overview' && (
          <div>
            {/* Welcome */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-gray-900 to-gray-700 rounded-2xl p-6 mb-5 text-white relative overflow-hidden">
              <div className="absolute right-4 top-4 text-5xl opacity-20">👷</div>
              <p className="text-gray-400 text-xs uppercase tracking-wider mb-1">Worker Dashboard</p>
              <h2 className="font-heading font-bold text-2xl mb-1">Hello, {user?.name?.split(' ')[0]} 👷</h2>
              <p className="text-gray-400 text-sm">{stats?.pendingContacts || 0} pending requests · {stats?.totalReviews || 0} reviews</p>
            </motion.div>

            {/* Availability */}
            <div className="mb-4">
              <AvailabilityToggle isAvailable={isAvailable} onChange={handleToggleAvailability} loading={availLoading} />
            </div>

            {/* Profile completeness */}
            <div className="card p-4 mb-5">
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium text-gray-700">Profile Completeness</span>
                <span className="text-trust-blue font-bold">{completeness}%</span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div initial={{ width: 0 }} animate={{ width: `${completeness}%` }}
                  transition={{ duration: 1, delay: 0.3 }}
                  className="h-full bg-gradient-to-r from-trust-blue-600 to-trust-blue rounded-full" />
              </div>
              {completeness < 100 && (
                <p className="text-xs text-gray-400 mt-2">Complete your profile to get more visibility <button onClick={() => setTab('edit')} className="text-trust-blue underline">Edit profile →</button></p>
              )}
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {[
                { label: 'Profile Views', value: stats?.totalViews || 0, icon: '👁️', sub: '+18 this week' },
                { label: 'Contacts', value: stats?.totalContacts || 0, icon: '📬', sub: `+${stats?.weekContacts || 0} this week` },
                { label: 'Rating', value: stats?.averageRating?.toFixed(1) || '0.0', icon: '⭐', sub: `${stats?.totalReviews || 0} reviews` },
                { label: 'Pending', value: stats?.pendingContacts || 0, icon: '⏳', sub: 'Needs action' },
              ].map(({ label, value, icon, sub }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.07 }} className="card p-4">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="font-heading font-black text-2xl text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                  <div className="text-xs text-green-600 mt-0.5">{sub}</div>
                </motion.div>
              ))}
            </div>

            <h3 className="font-heading font-bold text-base text-gray-800 mb-3">Recent Requests</h3>
            <RequestsTable data={requests.slice(0, 5)} />

            {reviews.length > 0 && (
              <>
                <h3 className="font-heading font-bold text-base text-gray-800 mb-3 mt-6">Recent Reviews</h3>
                <div className="space-y-3">
                  {reviews.map((r, i) => <ReviewCard key={r._id} review={r} index={i} />)}
                </div>
              </>
            )}
          </div>
        )}

        {tab === 'requests' && (
          <div>
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">Job Requests</h2>
            {loading ? (
              <div className="space-y-2">{[1,2,3].map(i=><div key={i} className="skeleton h-14 rounded-xl"/>)}</div>
            ) : <RequestsTable data={requests} />}
          </div>
        )}

        {tab === 'edit' && (
          <div className="max-w-xl">
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">Edit Profile</h2>
            <div className="card p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                  <input className="input-field" value={editForm.name || ''} onChange={(e) => setEditForm(f => ({ ...f, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                  <input className="input-field" value={editForm.phone || ''} onChange={(e) => setEditForm(f => ({ ...f, phone: e.target.value }))} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">City</label>
                  <select className="input-field" value={editForm.city || ''} onChange={(e) => setEditForm(f => ({ ...f, city: e.target.value }))}>
                    <option value="">Select city...</option>
                    {CITIES.map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Hourly Rate (ETB)</label>
                  <input type="number" className="input-field" value={editForm.hourlyRate || ''} onChange={(e) => setEditForm(f => ({ ...f, hourlyRate: e.target.value }))} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Years of Experience</label>
                <input type="number" className="input-field" value={editForm.experience || ''} onChange={(e) => setEditForm(f => ({ ...f, experience: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Bio</label>
                <textarea rows={3} className="input-field resize-none" value={editForm.bio || ''} onChange={(e) => setEditForm(f => ({ ...f, bio: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Skills <span className="text-gray-400 normal-case font-normal">({selectedSkills.length}/10)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(ALL_SKILLS[editForm.profession] || []).map((s) => (
                    <button key={s} type="button" onClick={() => toggleSkill(s)}
                      className={`px-3 py-1 rounded-full text-xs font-medium border transition-all ${
                        selectedSkills.includes(s)
                          ? 'bg-trust-blue text-white border-trust-blue'
                          : 'bg-white text-gray-600 border-gray-200 hover:border-trust-blue-300'
                      }`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
              <motion.button whileTap={{ scale: 0.97 }} onClick={handleSaveProfile} className="btn-primary">
                Save Changes
              </motion.button>
            </div>
          </div>
        )}

        {tab === 'reviews' && (
          <div>
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">⭐ My Reviews</h2>
            {loading ? (
              <div className="space-y-3">{[1,2,3].map(i=><div key={i} className="skeleton h-24 rounded-xl"/>)}</div>
            ) : reviews.length === 0 ? (
              <EmptyState icon="⭐" title="No reviews yet" description="Complete jobs and your clients' reviews will appear here." />
            ) : (
              <div className="space-y-3">
                {reviews.map((r, i) => <ReviewCard key={r._id} review={r} index={i} />)}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default WorkerDashboard;
