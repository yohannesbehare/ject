import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search, Briefcase, Heart, Settings, LogOut, LayoutDashboard, MessageSquare } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/Toast';
import { EmptyState, WorkerCardSkeleton } from '../components/LoadingSkeleton';
import WorkerCard from '../components/WorkerCard';
import ContactModal from '../components/ContactModal';
import { STATUS_COLORS, URGENCY_COLORS, PROFESSIONS, timeAgo, getInitials } from '../utils/helpers';
import api from '../utils/api';

const NAV = [
  { id: 'overview', icon: LayoutDashboard, label: 'Dashboard' },
  { id: 'contacts', icon: MessageSquare, label: 'My Contacts' },
  { id: 'saved', icon: Heart, label: 'Saved Workers' },
  { id: 'settings', icon: Settings, label: 'Settings' },
];

const CustomerDashboard = () => {
  const { user, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [tab, setTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [savedWorkers, setSavedWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contactWorker, setContactWorker] = useState(null);

  useEffect(() => {
    loadData();
  }, [tab]);

  const loadData = async () => {
    setLoading(true);
    try {
      if (tab === 'overview') {
        const { data } = await api.get('/dashboard/customer');
        setStats(data.stats);
        setContacts(data.recentContacts || []);
      } else if (tab === 'contacts') {
        const { data } = await api.get('/contacts/customer');
        setContacts(data.contacts || []);
      } else if (tab === 'saved') {
        const { data } = await api.get('/bookmarks');
        setSavedWorkers(data.workers || []);
      }
    } catch (err) {
      showToast('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => { logout(); navigate('/'); };

  const QuickActions = () => (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 mb-6">
      {PROFESSIONS.map((p) => (
        <motion.button key={p.value} whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }}
          onClick={() => navigate(`/search?profession=${p.value}`)}
          className="card p-3 text-center hover:border-trust-blue-200 hover:shadow-card-hover transition-all">
          <div className="text-2xl mb-1">{p.icon}</div>
          <div className="text-xs font-medium text-gray-700">{p.label}</div>
        </motion.button>
      ))}
    </div>
  );

  const ContactsTable = ({ data }) => (
    data.length === 0 ? (
      <EmptyState icon="📬" title="No contacts yet" description="Start by finding a worker and sending a job request."
        action={() => navigate('/search')} actionLabel="Find a Worker" />
    ) : (
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-100">
              <tr>
                {['Worker', 'Job', 'Date', 'Status', 'Action'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((c, i) => {
                const worker = c.workerId;
                return (
                  <motion.tr key={c._id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-trust-blue flex items-center justify-center text-white text-xs font-bold">
                          {getInitials(worker?.name || 'W')}
                        </div>
                        <span className="font-medium text-gray-800">{worker?.name || 'Worker'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[160px] truncate">{c.jobDescription}</td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{timeAgo(c.createdAt)}</td>
                    <td className="px-4 py-3">
                      <span className={`badge ${STATUS_COLORS[c.status]} capitalize`}>{c.status}</span>
                    </td>
                    <td className="px-4 py-3">
                      {c.status === 'completed' && !c.reviewSubmitted ? (
                        <Link to={`/review/${c._id}`} className="text-xs text-trust-blue font-medium hover:underline">Leave Review</Link>
                      ) : (
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
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>
        <div className="p-3 border-t border-gray-100">
          <button onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 transition-colors">
            <LogOut size={16} />Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto p-6">
        {tab === 'overview' && (
          <div>
            {/* Welcome card */}
            <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-trust-blue-800 to-trust-blue-600 rounded-2xl p-6 mb-5 text-white relative overflow-hidden">
              <div className="absolute right-0 top-0 bottom-0 w-32 opacity-10 flex items-center justify-center text-8xl">👤</div>
              <p className="text-blue-100 text-xs uppercase tracking-wider mb-1">Customer Dashboard</p>
              <h2 className="font-heading font-bold text-2xl mb-1">Hello, {user?.name?.split(' ')[0]} 👋</h2>
              <p className="text-blue-100 text-sm">
                {stats?.pendingContacts || 0} pending requests · {stats?.savedWorkers || 0} saved workers
              </p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Total Contacts', value: stats?.totalContacts || 0, icon: '📬' },
                { label: 'Completed Jobs', value: stats?.completedContacts || 0, icon: '✅' },
                { label: 'Saved Workers', value: stats?.savedWorkers || 0, icon: '❤️' },
              ].map(({ label, value, icon }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }} className="card p-4">
                  <div className="text-xl mb-1">{icon}</div>
                  <div className="font-heading font-black text-3xl text-gray-900">{value}</div>
                  <div className="text-xs text-gray-500 mt-0.5">{label}</div>
                </motion.div>
              ))}
            </div>

            <h3 className="font-heading font-bold text-base text-gray-800 mb-3">Find by Trade</h3>
            <QuickActions />

            <h3 className="font-heading font-bold text-base text-gray-800 mb-3">Recent Contacts</h3>
            {loading ? (
              <div className="space-y-2">{[1,2,3].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
            ) : (
              <ContactsTable data={contacts.slice(0, 5)} />
            )}
          </div>
        )}

        {tab === 'contacts' && (
          <div>
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">My Job Requests</h2>
            {loading ? (
              <div className="space-y-2">{[1,2,3,4].map(i => <div key={i} className="skeleton h-14 rounded-xl" />)}</div>
            ) : (
              <ContactsTable data={contacts} />
            )}
          </div>
        )}

        {tab === 'saved' && (
          <div>
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">❤️ Saved Workers</h2>
            {loading ? (
              <div className="grid grid-cols-2 gap-4">{[1,2].map(i => <WorkerCardSkeleton key={i} />)}</div>
            ) : savedWorkers.length === 0 ? (
              <EmptyState icon="🤍" title="No saved workers yet" description="Browse workers and click the heart icon to save your favorites for quick access."
                action={() => navigate('/search')} actionLabel="Browse Workers" />
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                {savedWorkers.map((w, i) => <WorkerCard key={w._id} worker={w} index={i} onContact={setContactWorker} />)}
              </div>
            )}
          </div>
        )}

        {tab === 'settings' && (
          <div className="max-w-lg">
            <h2 className="font-heading font-bold text-xl text-gray-900 mb-5">Account Settings</h2>
            <div className="card p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Full Name</label>
                <input className="input-field" defaultValue={user?.name} />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Email</label>
                <input className="input-field" defaultValue={user?.email} disabled className="input-field bg-gray-50 text-gray-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                <input className="input-field" defaultValue={user?.phone} />
              </div>
              <motion.button whileTap={{ scale: 0.97 }}
                onClick={() => showToast('Settings saved!', 'success')}
                className="btn-primary">Save Changes</motion.button>
            </div>
          </div>
        )}
      </main>

      {contactWorker && <ContactModal worker={contactWorker} onClose={() => setContactWorker(null)} />}
    </div>
  );
};

export default CustomerDashboard;
