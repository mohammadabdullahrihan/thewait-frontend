import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '', age: '', goal: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const goalOptions = [
    'GED পাস করা', 'IELTS পাস করা', 'ইউরোপে পড়তে যাওয়া',
    'ফিজিক্যালি ফিট হওয়া', 'ডিসিপ্লিন তৈরি করা', 'নিজেকে উন্নত করা'
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password.length < 6) { toast.error('পাসওয়ার্ড কমপক্ষে ৬ অক্ষর হতে হবে'); return; }
    setLoading(true);
    try {
      await register(form);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'রেজিস্ট্রেশন ব্যর্থ হয়েছে');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card fade-in" style={{ maxWidth: 480 }}>
        <div className="auth-logo">
          <div className="auth-logo-icon">⚔️</div>
          <h1>অপেক্ষা</h1>
          <p>সাধকের যাত্রায় স্বাগতম</p>
        </div>

        <h2 className="auth-title">নতুন যাত্রা শুরু হোক</h2>
        <p className="auth-subtitle">তোমার অ্যাকাউন্ট তৈরি করো এবং শৃঙ্খলার পথে নামো</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">পূর্ণ নাম</label>
            <div className="input-group">
              <span className="input-icon">👤</span>
              <input type="text" className="form-input" placeholder="তোমার নাম" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">ইমেইল</label>
            <div className="input-group">
              <span className="input-icon">📧</span>
              <input type="email" className="form-input" placeholder="তোমার ইমেইল" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">পাসওয়ার্ড</label>
              <div className="input-group">
                <span className="input-icon">🔒</span>
                <input type="password" className="form-input" placeholder="৬+ অক্ষর" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">বয়স</label>
              <div className="input-group">
                <span className="input-icon">🎂</span>
                <input type="number" className="form-input" placeholder="বয়স" value={form.age} onChange={e => setForm({...form, age: e.target.value})} min="10" max="60" />
              </div>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">তোমার লক্ষ্য</label>
            <select className="form-select" value={form.goal} onChange={e => setForm({...form, goal: e.target.value})}>
              <option value="">লক্ষ্য নির্বাচন করো</option>
              {goalOptions.map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>

          <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading}>
            {loading ? '⏳ তৈরি হচ্ছে...' : '🚀 সাধক হিসেবে যোগ দাও'}
          </button>
        </form>

        <p className="auth-switch">
          ইতিমধ্যে অ্যাকাউন্ট আছে? <Link to="/login">লগইন করো</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
