import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './context/AuthContext';
import Sidebar from './components/Layout/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Routine from './pages/Routine';
import Habits from './pages/Habits';
import Study from './pages/Study';
import Workout from './pages/Workout';
import Journal from './pages/Journal';
import Milestones from './pages/Milestones';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import './index.css';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner" />
        <p style={{ color: 'var(--text-muted)', fontFamily: 'Inter, sans-serif' }}>অপেক্ষা লোড হচ্ছে...</p>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" replace />;
};

// App Layout (with Sidebar)
const AppLayout = ({ children }) => (
  <div className="app-layout">
    <Sidebar />
    <main className="main-content">
      {children}
    </main>
    {/* Mobile Bottom Nav */}
    <nav className="mobile-nav">
      {[
        { to: '/dashboard', icon: '🏠', label: 'হোম' },
        { to: '/routine', icon: '📋', label: 'রুটিন' },
        { to: '/habits', icon: '🔥', label: 'হ্যাবিট' },
        { to: '/study', icon: '📚', label: 'পড়াশোনা' },
        { to: '/journal', icon: '📔', label: 'জার্নাল' },
      ].map(item => (
        <a key={item.to} href={item.to} className="mobile-nav-item">
          <span className="mobile-nav-icon">{item.icon}</span>
          {item.label}
        </a>
      ))}
    </nav>
  </div>
);

function AppContent() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" /> : <Register />} />

      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout><Dashboard /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/routine" element={
        <ProtectedRoute>
          <AppLayout><Routine /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/habits" element={
        <ProtectedRoute>
          <AppLayout><Habits /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/study" element={
        <ProtectedRoute>
          <AppLayout><Study /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/workout" element={
        <ProtectedRoute>
          <AppLayout><Workout /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/journal" element={
        <ProtectedRoute>
          <AppLayout><Journal /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/milestones" element={
        <ProtectedRoute>
          <AppLayout><Milestones /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/analytics" element={
        <ProtectedRoute>
          <AppLayout><Analytics /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <AppLayout><Profile /></AppLayout>
        </ProtectedRoute>
      } />

      {/* Default Redirect */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      <Route path="*" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
    </Routes>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border)',
              borderRadius: '12px',
              fontSize: '14px',
            },
            success: { iconTheme: { primary: '#22c55e', secondary: '#0f2a3f' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0f2a3f' } },
          }}
        />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
