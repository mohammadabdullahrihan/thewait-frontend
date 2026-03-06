import { BrowserRouter as Router, Routes, Route, Navigate, NavLink, Link, useLocation } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import GlobalSearch from './components/Common/GlobalSearch';
import SEO from './components/Common/SEO';
import { Toaster } from 'react-hot-toast';
import { 
  Home, 
  ClipboardList, 
  Flame, 
  BookOpen, 
  Book, 
  Check,
  AlertCircle,
  Dumbbell,
  BarChart3,
  Target,
  User,
  Activity,
  PenTool,
  MoreHorizontal,
  X,
  LogOut,
  Search
} from 'lucide-react';
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
import Loader from './components/Common/Loader';
import { useNavigate } from 'react-router-dom';

// Protected Route Wrapper
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <Loader full message="লোড হচ্ছে..." />;
  return user ? children : <Navigate to="/login" replace />;
};

// Mobile Nav Component
const MobileNav = () => {
  const [showMore, setShowMore] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const primaryNav = [
    { to: '/dashboard', icon: <Home size={22} />, label: 'হোম' },
    { to: '/routine', icon: <ClipboardList size={22} />, label: 'রুটিন' },
    { to: '/habits', icon: <Flame size={22} />, label: 'হ্যাবিট' },
    { to: '/study', icon: <BookOpen size={22} />, label: 'পড়াশোনা' },
  ];

  const moreNav = [
    { to: '/workout', icon: <Dumbbell size={20} />, label: 'ওয়ার্কআউট' },
    { to: '/journal', icon: <PenTool size={20} />, label: 'জার্নাল' },
    { to: '/milestones', icon: <Target size={20} />, label: 'মাইলস্টোন' },
    { to: '/analytics', icon: <BarChart3 size={20} />, label: 'অ্যানালিটিক্স' },
    { to: '/profile', icon: <User size={20} />, label: 'প্রোফাইল' },
  ];

  return (
    <>
      {/* More Drawer Overlay */}
      {showMore && (
        <div 
          className="fixed inset-0 z-[998] bg-black/30 backdrop-blur-sm"
          onClick={() => setShowMore(false)}
        />
      )}

      {/* More Slide-Up Drawer */}
      <div className={`mobile-more-drawer ${showMore ? 'open' : ''}`}>
        <div className="flex items-center justify-between px-6 pt-5 pb-2">
          <p className="text-[11px] font-black text-emerald-700 uppercase tracking-[0.2em]">আরো পেজ</p>
          <button onClick={() => setShowMore(false)} className="p-2 rounded-xl bg-slate-50 text-slate-400">
            <X size={18} />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3 p-5">
          {moreNav.map(item => (
            <NavLink 
              key={item.to} 
              to={item.to} 
              onClick={() => setShowMore(false)}
              className={({ isActive }) => `mobile-drawer-item${isActive ? ' active' : ''}`}
            >
              <span className="mobile-drawer-icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
          <button 
            className="mobile-drawer-item text-rose-500"
            onClick={() => { logout(); navigate('/login'); setShowMore(false); }}
          >
            <span className="mobile-drawer-icon"><LogOut size={20} /></span>
            <span>লগআউট</span>
          </button>
        </div>
      </div>

      {/* Main Bottom Nav Bar */}
      <nav className="mobile-nav">
        {primaryNav.map(item => (
          <NavLink 
            key={item.to} 
            to={item.to} 
            className={({ isActive }) => `mobile-nav-item${isActive ? ' active' : ''}`}
          >
            <span className="mobile-nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <button 
          className={`mobile-nav-item${showMore ? ' active' : ''}`}
          onClick={() => setShowMore(v => !v)}
        >
          <span className="mobile-nav-icon">
            {showMore ? <X size={22} /> : <MoreHorizontal size={22} />}
          </span>
          আরো
        </button>
      </nav>
    </>
  );
};

// App Layout (with Sidebar)
const AppLayout = ({ children }) => {
  const { isFocusMode, toggleFocusMode } = useAuth();
  
  // Custom style when Focus Mode hides sidebars
  const focusMainStyle = { marginLeft: 0, paddingBottom: '2rem' };

  return (
    <div className={`app-layout ${isFocusMode ? 'bg-[#05110d]' : ''}`}>
      {!isFocusMode && <Sidebar />}
      <main className="main-content relative z-10 transition-all duration-700" style={isFocusMode ? focusMainStyle : {}}>
        {children}
      </main>
      {!isFocusMode && <MobileNav />}

      {/* Extreme Focus Mode Underlay Overlay to dim non-timer parts */}
      {isFocusMode && (
         <div className="fixed inset-0 pointer-events-none z-0 bg-[#05110d] animate-in fade-in duration-1000" />
      )}

      {/* Focus Mode Exit UI */}
      {isFocusMode && (
        <button 
          onClick={toggleFocusMode}
          className="fixed top-6 right-6 z-[9999] px-5 py-3 md:px-6 md:py-4 bg-rose-600/90 hover:bg-rose-500 text-white rounded-2xl md:rounded-[1.5rem] font-black text-[10px] md:text-xs uppercase tracking-[0.2em] shadow-2xl backdrop-blur-md flex items-center gap-2 border border-rose-500/50 transition-all hover:scale-105"
        >
          <X size={16} /> Exit Warrior Mode
        </button>
      )}
    </div>
  );
};

function RouteSEO() {
  const location = useLocation();
  const path = location.pathname;

  let title = "লগইন";
  if (path.includes("dashboard")) title = "ড্যাশবোর্ড";
  else if (path.includes("routine")) title = "রুটিন";
  else if (path.includes("habits")) title = "হ্যাবিট লিস্ট";
  else if (path.includes("study")) title = "স্টাডি ট্র্যাকার";
  else if (path.includes("workout")) title = "ওয়ার্কআউট";
  else if (path.includes("journal")) title = "জার্নাল";
  else if (path.includes("milestones")) title = "মাইলস্টোন";
  else if (path.includes("analytics")) title = "অ্যানালিটিক্স";
  else if (path.includes("profile")) title = "প্রোফাইল";
  else if (path.includes("register")) title = "রেজিস্ট্রেশন";

  return <SEO title={title} />;
}

function AppContent() {
  const { user } = useAuth();
  const [searchOpen, setSearchOpen] = useState(false);

  // Global Ctrl+K / Cmd+K shortcut
  const handleKeyDown = useCallback((e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
      e.preventDefault();
      setSearchOpen(prev => !prev);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <>
      <RouteSEO />
      
      {/* Global Search Modal */}
      {user && <GlobalSearch isOpen={searchOpen} onClose={() => setSearchOpen(false)} />}

      {/* Floating Search Button (visible when logged in, top-right on desktop) */}
      {user && !searchOpen && (
        <button
          onClick={() => setSearchOpen(true)}
          className="fixed bottom-24 right-4 md:bottom-auto md:top-6 md:right-6 z-[999] flex items-center gap-2 px-4 py-3 md:py-2.5 bg-white border border-emerald-100 shadow-lg hover:shadow-xl rounded-2xl text-emerald-700 font-black text-[10px] uppercase tracking-widest transition-all hover:scale-105 active:scale-95 hover:border-emerald-300 group"
          title="গ্লোবাল সার্চ (Ctrl+K)"
        >
          <Search size={16} className="text-emerald-500" />
          <span className="hidden md:inline">খুঁজুন</span>
          <span className="hidden md:inline px-1.5 py-0.5 bg-gray-100 text-gray-400 rounded-md text-[9px] font-black">⌘K</span>
        </button>
      )}

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
    </>
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
              padding: '12px 16px',
            },
            success: {
              icon: <Check size={20} color="#22c55e" />,
              iconTheme: { primary: '#22c55e', secondary: '#0f2a3f' } 
            },
            error: {
              icon: <AlertCircle size={20} color="#ef4444" />,
              iconTheme: { primary: '#ef4444', secondary: '#0f2a3f' } 
            },
          }}
        />
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
