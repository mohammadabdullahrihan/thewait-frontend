import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { xpToNextLevel } from '../utils/helpers';
import { format } from 'date-fns';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', age: user?.age || '', goal: user?.goal || '' });
  const [saving, setSaving] = useState(false);
  const xp = xpToNextLevel(user?.experience || 0);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data.user);
      toast.success('✅ প্রোফাইল আপডেট হয়েছে');
    } catch (e) { toast.error('আপডেট করা যায়নি'); }
    finally { setSaving(false); }
  };

  const badgeAll = [
    { name: 'Bronze Warrior', icon: '🥉', description: '৭ দিনের স্ট্রিক', needed: 7 },
    { name: 'Silver Warrior', icon: '🥈', description: '৩০ দিনের স্ট্রিক', needed: 30 },
    { name: 'Gold Warrior', icon: '🥇', description: '৯০ দিনের স্ট্রিক', needed: 90 },
    { name: 'Streak Master', icon: '⚡', description: '৩০ দিন নো-ফ্যাপ', needed: 30 },
  ];

  const earnedBadgeNames = user?.badges?.map(b => b.name) || [];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">👤 প্রোফাইল</h1>
          <p className="page-subtitle">তোমার সাধক পরিচয়</p>
        </div>
      </div>

      <div className="grid-2">
        {/* Profile Card */}
        <div>
          <div className="card" style={{ marginBottom: 20, textAlign: 'center', padding: 32 }}>
            <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'linear-gradient(135deg, var(--secondary), var(--accent))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 36, fontWeight: 900, margin: '0 auto 16px', color: 'var(--bg-dark)', boxShadow: '0 8px 24px rgba(255,184,0,0.3)' }}>
              {user?.name?.[0]?.toUpperCase() || 'S'}
            </div>
            <h2 style={{ fontSize: 22, fontWeight: 800 }}>{user?.name}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: 16 }}>{user?.email}</p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 20 }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--secondary)' }}>Lv.{xp.level}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>লেভেল</div>
              </div>
              <div style={{ width: 1, background: 'var(--border-light)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--accent)' }}>{user?.experience || 0}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>XP</div>
              </div>
              <div style={{ width: 1, background: 'var(--border-light)' }} />
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 26, fontWeight: 900, color: 'var(--info)' }}>{user?.streak?.current || 0}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>স্ট্রিক</div>
              </div>
            </div>

            {/* XP Bar */}
            <div style={{ textAlign: 'left' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>
                <span>Level {xp.level}</span>
                <span>{xp.progress}/100 XP</span>
              </div>
              <div className="progress-bar-wrap">
                <div className="progress-bar-fill gold" style={{ width: `${xp.percentage}%` }} />
              </div>
            </div>

            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--text-muted)' }}>
              যোগ দেওয়ার তারিখ: {user?.createdAt ? format(new Date(user.createdAt), 'dd MMM yyyy') : 'N/A'}
            </div>
          </div>

          {/* Edit Profile */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 20 }}>✏️ প্রোফাইল সম্পাদনা</div>
            <div className="form-group">
              <label className="form-label">নাম</label>
              <input type="text" className="form-input" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">বয়স</label>
              <input type="number" className="form-input" value={form.age} onChange={e => setForm({...form, age: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">লক্ষ্য</label>
              <input type="text" className="form-input" value={form.goal} onChange={e => setForm({...form, goal: e.target.value})} placeholder="তোমার লক্ষ্য লিখো" />
            </div>
            <button className="btn btn-primary btn-full" onClick={handleSave} disabled={saving}>
              {saving ? '⏳ সেভ হচ্ছে...' : '💾 সেভ করো'}
            </button>
          </div>
        </div>

        {/* Badges */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title" style={{ marginBottom: 16 }}>🏆 ব্যাজ সংগ্রহ</div>
            {badgeAll.map((b, i) => {
              const earned = earnedBadgeNames.includes(b.name);
              return (
                <div key={i} className={`badge-item${!earned ? ' badge-locked' : ''}`} style={{ marginBottom: 10, width: '100%' }}>
                  <div className="badge-icon" style={{ fontSize: 30 }}>{b.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div className="badge-name">{b.name}</div>
                    <div className="badge-desc">{b.description}</div>
                    {!earned && (
                      <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>
                        প্রয়োজন: {b.needed} দিনের স্ট্রিক
                      </div>
                    )}
                  </div>
                  {earned ? (
                    <span style={{ color: 'var(--success)', fontSize: 12, fontWeight: 700 }}>✅ অর্জিত</span>
                  ) : (
                    <span style={{ color: 'var(--text-muted)', fontSize: 12 }}>🔒 লক</span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Stats Summary */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16 }}>📈 সংক্ষিপ্ত পরিসংখ্যান</div>
            {[
              { label: 'সর্বোচ্চ স্ট্রিক', value: `${user?.streak?.longest || 0} দিন`, icon: '🏆' },
              { label: 'বর্তমান স্ট্রিক', value: `${user?.streak?.current || 0} দিন`, icon: '🔥' },
              { label: 'মোট অর্জিত ব্যাজ', value: `${user?.badges?.length || 0}টি`, icon: '🥇' },
              { label: 'লক্ষ্য', value: user?.goal || 'নির্ধারিত নয়', icon: '🎯' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: i < 3 ? '1px solid var(--border-light)' : 'none' }}>
                <span style={{ color: 'var(--text-muted)' }}>{item.icon} {item.label}</span>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
