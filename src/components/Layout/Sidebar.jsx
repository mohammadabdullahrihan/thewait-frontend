import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { xpToNextLevel } from '../../utils/helpers';

const navItems = [
  { to: '/dashboard', icon: '🏠', label: 'ড্যাশবোর্ড' },
  { to: '/routine', icon: '📋', label: 'দৈনিক রুটিন' },
  { to: '/habits', icon: '🔥', label: 'হ্যাবিট ট্র্যাকার' },
  { to: '/study', icon: '📚', label: 'পড়াশোনা' },
  { to: '/workout', icon: '💪', label: 'ওয়ার্কআউট' },
  { to: '/journal', icon: '📔', label: 'জার্নাল' },
  { to: '/milestones', icon: '🎯', label: 'মাইলস্টোন' },
  { to: '/analytics', icon: '📊', label: 'অ্যানালিটিক্স' },
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
          <div className="sidebar-logo-icon">⚔️</div>
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
          <span className="nav-icon">👤</span>
          প্রোফাইল
        </NavLink>
        <button className="nav-item" onClick={handleLogout} style={{ color: 'var(--danger)' }}>
          <span className="nav-icon">🚪</span>
          লগআউট
        </button>
      </nav>

      {user && (
        <div className="sidebar-user">
          <div className="user-avatar">{user.name?.[0]?.toUpperCase() || 'S'}</div>
          <div className="user-info">
            <div className="user-name">{user.name}</div>
            <div className="user-level">⚡ Level {xp.level} · {user.experience || 0} XP</div>
            <div style={{ marginTop: 6 }}>
              <div className="progress-bar-wrap" style={{ height: 4 }}>
                <div className="progress-bar-fill gold" style={{ width: `${xp.percentage}%` }} />
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
