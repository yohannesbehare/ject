import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { AuthProvider } from './hooks/useAuth';
import { ToastProvider } from './components/Toast';
import Navbar from './components/Navbar';
import { ProtectedRoute, NotFound } from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import WorkerSearch from './pages/WorkerSearch';
import WorkerProfile from './pages/WorkerProfile';
import CustomerDashboard from './pages/CustomerDashboard';
import WorkerDashboard from './pages/WorkerDashboard';
import WriteReview from './pages/WriteReview';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -8 },
};

const PageWrapper = ({ children }) => (
  <motion.div
    variants={pageVariants}
    initial="initial"
    animate="in"
    exit="out"
    transition={{ duration: 0.22, ease: 'easeInOut' }}
  >
    {children}
  </motion.div>
);

// Pages that get their own full-screen layout (no shared Navbar)
const FULLSCREEN_ROUTES = ['/dashboard', '/worker/dashboard'];

const App = () => {
  const location = useLocation();
  const isFullscreen = FULLSCREEN_ROUTES.some((r) => location.pathname.startsWith(r));
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  return (
    <AuthProvider>
      <ToastProvider>
        <div className="min-h-screen flex flex-col">
          {!isFullscreen && !isAuthPage && <Navbar />}

          <div className="flex-1">
            <AnimatePresence mode="wait">
              <Routes location={location} key={location.pathname}>
                {/* Public */}
                <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
                <Route path="/login" element={<PageWrapper><Login /></PageWrapper>} />
                <Route path="/register" element={<PageWrapper><Register /></PageWrapper>} />
                <Route path="/search" element={<PageWrapper><WorkerSearch /></PageWrapper>} />
                <Route path="/worker/:id" element={<PageWrapper><WorkerProfile /></PageWrapper>} />

                {/* Protected — Customer */}
                <Route path="/dashboard" element={
                  <ProtectedRoute role="customer">
                    <PageWrapper><CustomerDashboard /></PageWrapper>
                  </ProtectedRoute>
                } />
                <Route path="/review/:contactRequestId" element={
                  <ProtectedRoute>
                    <PageWrapper><WriteReview /></PageWrapper>
                  </ProtectedRoute>
                } />

                {/* Protected — Worker */}
                <Route path="/worker/dashboard" element={
                  <ProtectedRoute role="worker">
                    <PageWrapper><WorkerDashboard /></PageWrapper>
                  </ProtectedRoute>
                } />

                {/* 404 */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AnimatePresence>
          </div>
        </div>
      </ToastProvider>
    </AuthProvider>
  );
};

export default App;
