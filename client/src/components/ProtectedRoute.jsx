import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { PageLoader } from '../components/LoadingSkeleton';

export const ProtectedRoute = ({ children, role }) => {
  const { user, loading } = useAuth();
  if (loading) return <PageLoader />;
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) {
    return <Navigate to={user.role === 'worker' ? '/worker/dashboard' : '/dashboard'} replace />;
  }
  return children;
};

export const NotFound = () => (
  <div className="min-h-screen flex items-center justify-center text-center px-4">
    <div>
      <div className="text-8xl mb-4">🔧</div>
      <h1 className="font-heading font-black text-5xl text-trust-blue mb-3">404</h1>
      <p className="text-gray-600 mb-6 text-lg">Oops! This page doesn't exist.</p>
      <a href="/" className="btn-primary inline-flex">Go back home</a>
    </div>
  </div>
);
