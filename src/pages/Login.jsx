import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Swords, Mail, Lock, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const Login = () => {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'লগইন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-container fade-in">
        {/* Hero Section - Visible only on Desktop */}
        <div className="auth-hero">
          <div className="auth-hero-content">
            <h2 className="hero-title">তোমার প্রতিটি দিন হোক একটি বিজয়</h2>
            <p className="hero-text">
              শৃঙ্খলাই স্বাধীনতা। "অপেক্ষা" তোমার লক্ষ্য অর্জন, শারীরিক উন্নতি এবং মানসিক বিকাশের জন্য একটি শক্তিশালী মাধ্যম।
            </p>
          </div>
        </div>

        {/* Login Form Section */}
        <div className="auth-form-side">
          <div className="auth-logo">
            <span className="app-name">অপেক্ষা</span>
          </div>

          <div className="auth-form-header">
            <h2 className="auth-title">স্বাগত আবার!</h2>
            <p className="auth-subtitle">তোমার যাত্রায় ফিরে যাও</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" style={{ textTransform: 'none', letterSpacing: 0 }}>ইমেইল ঠিকানা</label>
              <div className="input-group">
                <span className="input-icon"><Mail size={18} /></span>
                <input
                  type="email"
                  className="form-input"
                  placeholder="name@warrior.com"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <label className="form-label" style={{ marginBottom: 0, textTransform: 'none', letterSpacing: 0 }}>পাসওয়ার্ড</label>
                <Link to="/forgot-password" style={{ fontSize: 12, color: 'var(--secondary)', textDecoration: 'none', fontWeight: 600 }}>পাসওয়ার্ড ভুলে গেছ?</Link>
              </div>
              <div className="input-group">
                <span className="input-icon"><Lock size={18} /></span>
                <input
                  type="password"
                  className="form-input"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={e => setForm({...form, password: e.target.value})}
                  required
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 12 }}>
              {loading ? "প্রবেশ হচ্ছে..." : "প্রবেশ করো"}
            </button>
          </form>

          <div className="auth-switch">
            নতুন কোনো যোদ্ধা? <Link to="/register">অ্যাকাউন্ট তৈরি করো</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
