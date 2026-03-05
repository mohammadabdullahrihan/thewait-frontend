import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <div className="auth-logo-icon">⚔️</div>
          <h1>অপেক্ষা</h1>
          <p>তোমার শৃঙ্খলার যাত্রা এখান থেকেই শুরু</p>
        </div>

        <h2 className="auth-title">স্বাগত আবার!</h2>
        <p className="auth-subtitle">তোমার অ্যাকাউন্টে লগইন করো</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">ইমেইল</label>
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input
                type="email"
                className="form-input"
                placeholder="তোমার ইমেইল"
                value={form.email}
                onChange={e => setForm({...form, email: e.target.value})}
                required
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">পাসওয়ার্ড</label>
            <div className="input-group">
              <span className="input-icon">🔒</span>
              <input
                type="password"
                className="form-input"
                placeholder="তোমার পাসওয়ার্ড"
                value={form.password}
                onChange={e => setForm({...form, password: e.target.value})}
                required
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? '⏳ লগইন হচ্ছে...' : '⚔️ যুদ্ধে নামো'}
          </button>
        </form>

        <p className="auth-switch">
          নতুন সাধক? <Link to="/register">অ্যাকাউন্ট তৈরি করো</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
