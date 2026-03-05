import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, habitAPI } from '../utils/api';
import { getTodayQuote, xpToNextLevel, todayStr, daysUntil } from '../utils/helpers';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { format } from 'date-fns';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [loading, setLoading] = useState(true);
  const quote = getTodayQuote();
  const xp = xpToNextLevel(user?.experience || 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, streakRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          habitAPI.getStreak()
        ]);
        setStats(analyticsRes.data.stats);
        setCharts(analyticsRes.data.charts);
        setStreak(streakRes.data.streak || { current: 0, longest: 0 });
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, padding: '10px 14px' }}>
          <p style={{ color: 'var(--text-muted)', fontSize: 12, marginBottom: 4 }}>{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color, fontWeight: 600 }}>{p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  const daysToJourney = daysUntil('2027-03-01');

  if (loading) {
    return (
      <div className="loading-screen" style={{ position: 'relative', minHeight: '60vh', background: 'transparent' }}>
        <div className="loading-spinner" />
        <p style={{ color: 'var(--text-muted)' }}>ডেটা লোড হচ্ছে...</p>
      </div>
    );
  }

  return (
    <div className="fade-in">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">
            {user?.name?.split(' ')[0]} এর ড্যাশবোর্ড ⚔️
          </h1>
          <p className="page-subtitle">
            {format(new Date(), 'EEEE, dd MMMM yyyy')} · আজই তোমার সেরাটা দাও
          </p>
        </div>
        <div className="tag">🎯 {user?.goal || 'লক্ষ্য নির্বাচন করো'}</div>
      </div>

      {/* Daily Quote */}
      <div className="quote-card" style={{ marginBottom: 24 }}>
        <p className="quote-text">"{quote.text}"</p>
        <p className="quote-author">— {quote.author}</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card gold">
          <span className="stat-icon">🔥</span>
          <span className="stat-value">{streak.current || 0}</span>
          <span className="stat-label">দিনের স্ট্রিক</span>
          <span className="stat-change">🏆 সর্বোচ্চ {streak.longest || 0} দিন</span>
        </div>
        <div className="stat-card green">
          <span className="stat-icon">📋</span>
          <span className="stat-value">{stats?.avgRoutineCompletion || 0}%</span>
          <span className="stat-label">গড় রুটিন কমপ্লিশন</span>
          <span className="stat-change">৩০ দিনের গড়</span>
        </div>
        <div className="stat-card blue">
          <span className="stat-icon">⚡</span>
          <span className="stat-value">Lv.{xp.level}</span>
          <span className="stat-label">তোমার লেভেল</span>
          <span className="stat-change">{user?.experience || 0} XP অর্জিত</span>
        </div>
        <div className="stat-card purple">
          <span className="stat-icon">📚</span>
          <span className="stat-value">{stats?.totalStudyHours || 0}h</span>
          <span className="stat-label">মোট পড়াশোনা</span>
          <span className="stat-change">৩০ দিনে</span>
        </div>
        <div className="stat-card danger">
          <span className="stat-icon">🌍</span>
          <span className="stat-value">{daysToJourney}</span>
          <span className="stat-label">EU Journey কাউন্টডাউন</span>
          <span className="stat-change" style={{ color: 'var(--warning)' }}>মার্চ ২০২৭</span>
        </div>
      </div>

      {/* Level XP Bar */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title" style={{ marginBottom: 16 }}>⚡ লেভেল প্রগ্রেস</div>
        <div className="xp-bar-section">
          <div className="xp-info">
            <span className="xp-level">Level {xp.level}</span>
            <span className="xp-points">{xp.progress}/100 XP → Level {xp.level + 1}</span>
          </div>
          <div className="progress-bar-wrap">
            <div className="progress-bar-fill gold" style={{ width: `${xp.percentage}%` }} />
          </div>
        </div>
        {user?.badges?.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <div style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 10 }}>অর্জিত ব্যাজ</div>
            <div className="badges-grid">
              {user.badges.map((b, i) => (
                <div className="badge-item" key={i}>
                  <span className="badge-icon">{b.icon}</span>
                  <div>
                    <div className="badge-name">{b.name}</div>
                    <div className="badge-desc">{b.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Charts */}
      <div className="grid-2">
        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>📊 সাপ্তাহিক হ্যাবিট স্কোর</div>
          {charts?.weeklyHabitData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={charts.weeklyHabitData.map(d => ({ ...d, date: d.date?.slice(5) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis domain={[0, 7]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip content={customTooltip} />
                <Bar dataKey="score" fill="#FFB800" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📊</div>
              <div className="empty-title">ডেটা নেই</div>
              <div className="empty-desc">হ্যাবিট ট্র্যাক করা শুরু করো</div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>😊 মুড ট্র্যান্ড</div>
          {charts?.moodTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={180}>
              <LineChart data={charts.moodTrend.map(d => ({ ...d, date: d.date?.slice(5) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <YAxis domain={[1, 10]} tick={{ fill: 'var(--text-muted)', fontSize: 11 }} />
                <Tooltip content={customTooltip} />
                <Line type="monotone" dataKey="mood" stroke="#8b5cf6" strokeWidth={2} dot={{ fill: '#8b5cf6', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">😊</div>
              <div className="empty-title">মুড ডেটা নেই</div>
              <div className="empty-desc">জার্নালে মুড ট্র্যাক করো</div>
            </div>
          )}
        </div>
      </div>

      {/* Streak Display */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="streak-display">
          <div className="streak-flame">🔥</div>
          <div className="streak-info">
            <div className="streak-count">{streak.current || 0}</div>
            <div className="streak-label">দিনের টানা স্ট্রিক</div>
          </div>
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{streak.longest || 0}</div>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>সর্বোচ্চ স্ট্রিক</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
