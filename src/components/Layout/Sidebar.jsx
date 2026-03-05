import { NavLink, useNavigate } from 'react-router-dom';
import { 
  Home, 
  ClipboardList, 
  Flame, 
  BookOpen, 
  Activity, 
  PenTool, 
  Target, 
  BarChart3, 
  User, 
  LogOut, 
  Swords, 
  Zap 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { xpToNextLevel } from '../../utils/helpers';

const navItems = [
  { to: '/dashboard', icon: <Home size={18} />, label: 'ড্যাশবোর্ড' },
  { to: '/routine', icon: <ClipboardList size={18} />, label: 'দৈনিক রুটিন' },
  { to: '/habits', icon: <Flame size={18} />, label: 'হ্যাবিট ট্র্যাকার' },
  { to: '/study', icon: <BookOpen size={18} />, label: 'পড়াশোনা' },
  { to: '/workout', icon: <Activity size={18} />, label: 'ওয়ার্কআউট' },
  { to: '/journal', icon: <PenTool size={18} />, label: 'জার্নাল' },
  { to: '/milestones', icon: <Target size={18} />, label: 'মাইলস্টোন' },
  { to: '/analytics', icon: <BarChart3 size={18} />, label: 'অ্যানালিটিক্স' },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const xp = user ? xpToNextLevel(user.experience || 0) : { level: 1, progress: 0, percentage: 0 };

  const handleLogout = () => { logout(); navigate('/login'); };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <NavLink to="/dashboard" className="sidebar-logo">
          <div className="sidebar-logo-icon">
            <Swords size={24} color="white" />
          </div>
          <div className="sidebar-logo-text">
            <span className="app-name">অপেক্ষা</span>
            <span className="app-tagline">The Wait · Warrior Path</span>
          </div>
        </NavLink>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-section-title">মূল মেনু</span>
        {navItems.map(item => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
          >
            <span className="nav-icon">{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
        <span className="nav-section-title" style={{ marginTop: 16 }}>অ্যাকাউন্ট</span>
        <NavLink to="/profile" className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}>
          <span className="nav-icon"><User size={18} /></span>
          প্রোফাইল
        </NavLink>
        <button className="nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
          <span className="nav-icon"><LogOut size={18} /></span>
          লগআউট
        </button>
      </nav>

      {user && (
        <div className="sidebar-user">
          <div className="user-avatar">{user.name?.[0]?.toUpperCase() || 'S'}</div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-level">
              <Zap size={12} fill="var(--secondary)" color="var(--secondary)" style={{ marginRight: 4 }} />
              Level {xp.level} · {user.experience || 0} XP
            </div>
            <div style={{ marginTop: 6 }}>
              <div className="progress-bar-wrap" style={{ height: 4, background: 'var(--border-light)' }}>
                <div className="progress-bar-fill" style={{ width: `${xp.percentage}%`, background: 'var(--secondary)' }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
