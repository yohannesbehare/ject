// useWorkers.js
import { useState, useCallback } from 'react';
import api from '../utils/api';

export const useWorkers = () => {
  const [workers, setWorkers] = useState([]);
  const [worker, setWorker] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({ total: 0, page: 1, pages: 1 });

  const fetchWorkers = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get('/workers', { params });
      setWorkers(data.results);
      setPagination({ total: data.total, page: data.page, pages: data.pages });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load workers.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWorker = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await api.post(`/workers/${id}/view`).catch(() => {});
      const { data } = await api.get(`/workers/${id}`);
      setWorker(data.worker);
      return data;
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load worker profile.');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (profileData) => {
    const { data } = await api.patch('/workers/profile', profileData);
    return data;
  }, []);

  const toggleAvailability = useCallback(async (isAvailable) => {
    const { data } = await api.patch('/workers/availability', { isAvailable });
    return data;
  }, []);

  return { workers, worker, loading, error, pagination, fetchWorkers, fetchWorker, updateProfile, toggleAvailability };
};

// useContacts.js
export const useContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomerContacts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/contacts/customer', { params });
      setContacts(data.contacts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load contacts.');
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchWorkerContacts = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await api.get('/contacts/worker', { params });
      setContacts(data.contacts);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load requests.');
    } finally {
      setLoading(false);
    }
  }, []);

  const sendContact = useCallback(async (contactData) => {
    const { data } = await api.post('/contacts', contactData);
    return data;
  }, []);

  const updateStatus = useCallback(async (id, status) => {
    const { data } = await api.patch(`/contacts/${id}`, { status });
    setContacts((prev) => prev.map((c) => (c._id === id ? { ...c, status } : c)));
    return data;
  }, []);

  return { contacts, loading, error, fetchCustomerContacts, fetchWorkerContacts, sendContact, updateStatus };
};

// useReviews.js
export const useReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchWorkerReviews = useCallback(async (workerId) => {
    setLoading(true);
    try {
      const { data } = await api.get(`/reviews/worker/${workerId}`);
      setReviews(data.reviews);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load reviews.');
    } finally {
      setLoading(false);
    }
  }, []);

  const submitReview = useCallback(async (reviewData) => {
    const { data } = await api.post('/reviews', reviewData);
    return data;
  }, []);

  return { reviews, loading, error, fetchWorkerReviews, submitReview };
};
