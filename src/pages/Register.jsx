import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Swords, User, Mail, Lock, Cake, Loader2, ShieldCheck } from 'lucide-react';
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
      <div className="auth-container fade-in" style={{ maxWidth: 1100 }}>
        {/* Hero Section */}
        <div className="auth-hero" style={{ backgroundPosition: 'left center' }}>
          <div className="auth-hero-content">
            <h2 className="hero-title">তোমার নতুন যাত্রার সূচনা হোক আজ</h2>
            <p className="hero-text">
              "অপেক্ষা" কেবল একটি অ্যাপ নয়, এটি তোমার শ্রেষ্ঠ সংস্করণ হওয়ার একটি দীর্ঘ লড়াই। আমাদের সাথে যোগ দাও।
            </p>
          </div>
        </div>

        {/* Registration Form Section */}
        <div className="auth-form-side" style={{ padding: '40px 60px' }}>
          <div className="auth-logo">
            <span className="app-name">অপেক্ষা</span>
          </div>

          <div className="auth-form-header">
            <h2 className="auth-title">নতুন সাধক?</h2>
            <p className="auth-subtitle" style={{ marginBottom: 0 }}>তোমার অ্যাকাউন্ট তৈরি করো</p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="form-group">
              <label className="form-label" style={{ textTransform: 'none', letterSpacing: 0 }}>পূর্ণ নাম</label>
              <div className="input-group">
                <span className="input-icon"><User size={18} /></span>
                <input type="text" className="form-input" placeholder="তোমার নাম" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ textTransform: 'none', letterSpacing: 0 }}>ইমেইল</label>
              <div className="input-group">
                <span className="input-icon"><Mail size={18} /></span>
                <input type="email" className="form-input" placeholder="name@warrior.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" style={{ textTransform: 'none', letterSpacing: 0 }}>পাসওয়ার্ড</label>
                <div className="input-group">
                  <span className="input-icon"><Lock size={18} /></span>
                  <input type="password" className="form-input" placeholder="৬+ অক্ষর" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
                </div>
              </div>
              <div className="form-group">
                <label className="form-label" style={{ textTransform: 'none', letterSpacing: 0 }}>বয়স</label>
                <div className="input-group">
                  <span className="input-icon"><Cake size={18} /></span>
                  <input type="number" className="form-input" placeholder="বয়স" value={form.age} onChange={e => setForm({...form, age: e.target.value})} min="10" max="60" />
                </div>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" style={{ textTransform: 'none', letterSpacing: 0 }}>তোমার লক্ষ্য</label>
              <select className="form-select" value={form.goal} onChange={e => setForm({...form, goal: e.target.value})} style={{ borderRadius: 12, height: 48, background: '#f8fafc' }}>
                <option value="">লক্ষ্য নির্বাচন করো</option>
                {goalOptions.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <button type="submit" className="btn btn-primary btn-full btn-lg" disabled={loading} style={{ marginTop: 8 }}>
              {loading ? "তৈরি হচ্ছে..." : "সাধক হিসেবে যোগ দাও"}
            </button>
          </form>

          <div className="auth-switch">
             ইতিমধ্যে যোদ্ধা? <Link to="/login">লগইন করো</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
