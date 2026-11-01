import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import Records from './pages/Records';
import AbhaCreate from './pages/AbhaCreate';
import Login from './pages/Login';
import RegistrationForm from './components/RegistrationForm';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RealtimeProvider } from './context/RealtimeContext';

const ProtectedRoute = ({ children, roles }: { children: React.ReactNode, roles?: string[] }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center"><div className="w-6 h-6 border-4 border-primary border-t-transparent rounded-full animate-spin"></div></div>;

  if (!isAuthenticated) return <Navigate to="/login" />;

  if (roles && !roles.map(r => r.toUpperCase().replace(' ', '_')).includes(user!.role.toUpperCase().replace(' ', '_'))) return <Navigate to="/" />;

  return <>{children}</>;
};

function AppContent() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl animate-pulse">KR</div>
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Initializing Secure Portal...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/login" element={!isAuthenticated ? <Login /> : <Navigate to="/" />} />

          {/* Public Home Page - No Auth Required */}
          <Route path="/" element={<Home />} />

          <Route path="/dashboard" element={
            <ProtectedRoute roles={['SUPER_ADMIN', 'DISTRICT_ADMIN']}>
              <Dashboard />
            </ProtectedRoute>
          } />

          <Route path="/records" element={
            isAuthenticated ? <Records /> : <Navigate to="/login" />
          } />

          <Route path="/register" element={
            <ProtectedRoute roles={['FIELD_WORKER', 'PHC_STAFF', 'DISTRICT_ADMIN', 'SUPER_ADMIN']}>
              <RegistrationForm />
            </ProtectedRoute>
          } />

          <Route path="/abha/create" element={
            isAuthenticated ? <AbhaCreate /> : <Navigate to="/login" />
          } />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <RealtimeProvider>
        <Router>
          <AppContent />
        </Router>
      </RealtimeProvider>
    </AuthProvider>
  );
}

export default App;
