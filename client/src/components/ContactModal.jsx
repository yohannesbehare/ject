import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, Send } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './Toast';
import { useContacts } from '../hooks/useWorkers';
import { getProfession } from '../utils/helpers';

const ContactModal = ({ worker, onClose }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const { sendContact } = useContacts();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [urgency, setUrgency] = useState('low');
  const [form, setForm] = useState({
    customerName: user?.name || '',
    customerPhone: user?.phone || '',
    jobDescription: '',
    preferredDate: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.customerName.trim()) e.customerName = 'Name is required';
    if (!form.customerPhone.trim()) e.customerPhone = 'Phone is required';
    if (!form.jobDescription.trim()) e.jobDescription = 'Please describe the job';
    if (form.jobDescription.length < 10) e.jobDescription = 'Please provide more detail (min 10 chars)';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await sendContact({ ...form, workerId: worker._id, urgency });
      setSubmitted(true);
      showToast('Request sent! The worker will be in touch soon.', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send request.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const prof = getProfession(worker.profession);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 z-50 flex items-end sm:items-center justify-center p-4"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ opacity: 0, y: 60, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-heading font-bold text-xl text-gray-900">Contact Worker</h2>
              <p className="text-sm text-gray-500 mt-0.5">
                {worker.user?.name} · <span className={`badge ${prof.badge}`}>{prof.icon} {prof.label}</span>
              </p>
            </div>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </div>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-8 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.1 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="text-green-500" size={32} />
              </motion.div>
              <h3 className="font-heading font-bold text-xl text-gray-900 mb-2">Request Sent!</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {worker.user?.name} has been notified and will respond shortly. Check your dashboard for updates.
              </p>
              <button onClick={onClose} className="btn-secondary mt-6 mx-auto">Close</button>
            </motion.div>
          ) : (
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Your Name</label>
                  <input
                    className={`input-field ${errors.customerName ? 'border-red-400' : ''}`}
                    value={form.customerName}
                    onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                    placeholder="Full name"
                  />
                  {errors.customerName && <p className="text-xs text-red-500 mt-1">{errors.customerName}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Phone</label>
                  <input
                    className={`input-field ${errors.customerPhone ? 'border-red-400' : ''}`}
                    value={form.customerPhone}
                    onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                    placeholder="+251..."
                  />
                  {errors.customerPhone && <p className="text-xs text-red-500 mt-1">{errors.customerPhone}</p>}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Job Description</label>
                <textarea
                  className={`input-field resize-none ${errors.jobDescription ? 'border-red-400' : ''}`}
                  rows={3}
                  value={form.jobDescription}
                  onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
                  placeholder="Describe what you need done, any specific requirements..."
                />
                {errors.jobDescription && <p className="text-xs text-red-500 mt-1">{errors.jobDescription}</p>}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Preferred Date</label>
                  <input type="date" className="input-field" value={form.preferredDate} onChange={(e) => setForm({ ...form, preferredDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">Urgency</label>
                  <div className="flex gap-1">
                    {['low', 'medium', 'high'].map((u) => (
                      <button
                        key={u}
                        onClick={() => setUrgency(u)}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium transition-all capitalize border ${
                          urgency === u
                            ? u === 'high' ? 'bg-red-500 text-white border-red-500'
                              : u === 'medium' ? 'bg-amber-500 text-white border-amber-500'
                              : 'bg-green-500 text-white border-green-500'
                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        {u}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <motion.button
                whileTap={{ scale: 0.97 }}
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary w-full justify-center py-3 text-base mt-2"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <><Send size={16} /> Send Request</>
                )}
              </motion.button>
            </div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ContactModal;
