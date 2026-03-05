import { useState, useEffect } from 'react';
import { analyticsAPI, habitAPI } from '../utils/api';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, RadarChart, Radar, PolarGrid, PolarAngleAxis } from 'recharts';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [heatmap, setHeatmap] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([analyticsAPI.getDashboard(), analyticsAPI.heatmap()])
      .then(([dashRes, hmRes]) => {
        setData(dashRes.data);
        setHeatmap(hmRes.data.heatmapData || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const tooltipStyle = {
    contentStyle: { background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 10, color: 'var(--text-primary)' },
    labelStyle: { color: 'var(--text-muted)', fontSize: 12 }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: 80, color: 'var(--text-muted)' }}>
        <div className="loading-spinner" style={{ margin: '0 auto 20px' }} />
        <p>ডেটা লোড হচ্ছে...</p>
      </div>
    );
  }

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const studyProgress = data?.studyProgress || [];

  const radarData = [
    { category: 'হ্যাবিট', value: (stats.avgHabitScore / 7) * 100 },
    { category: 'রুটিন', value: stats.avgRoutineCompletion || 0 },
    { category: 'পড়াশোনা', value: Math.min(100, (stats.totalStudyHours / 50) * 100) },
    { category: 'ওয়ার্কআউট', value: Math.min(100, (stats.totalWorkouts / 20) * 100) },
    { category: 'মুড', value: ((stats.avgMood / 10) * 100) },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">📊 অ্যানালিটিক্স</h1>
          <p className="page-subtitle">৩০ দিনের তোমার সম্পূর্ণ প্রগ্রেস রিপোর্ট</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="stats-grid" style={{ marginBottom: 24 }}>
        {[
          { icon: '🔥', value: `${stats.avgHabitScore}/7`, label: 'গড় হ্যাবিট স্কোর', cls: 'gold' },
          { icon: '📋', value: `${stats.avgRoutineCompletion}%`, label: 'গড় রুটিন কমপ্লিশন', cls: 'green' },
          { icon: '📚', value: `${stats.totalStudyHours}h`, label: 'মোট পড়াশোনা', cls: 'blue' },
          { icon: '💪', value: stats.totalWorkouts, label: 'মোট ওয়ার্কআউট', cls: 'purple' },
          { icon: '😊', value: `${stats.avgMood}/10`, label: 'গড় মুড', cls: 'danger' },
          { icon: '📅', value: stats.daysTracked, label: 'ট্র্যাকড দিন', cls: 'gold' },
        ].map((s, i) => (
          <div key={i} className={`stat-card ${s.cls}`}>
            <span className="stat-icon">{s.icon}</span>
            <span className="stat-value">{s.value}</span>
            <span className="stat-label">{s.label}</span>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 24 }}>
        {/* Weekly Habit Chart */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>🔥 সাপ্তাহিক হ্যাবিট স্কোর</div>
          {charts.weeklyHabitData?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={charts.weeklyHabitData.map(d => ({ ...d, date: d.date?.slice(5) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis domain={[0, 7]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Bar dataKey="score" name="স্কোর" fill="#FFB800" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><div className="empty-icon">📊</div><div className="empty-title">ডেটা নেই</div></div>}
        </div>

        {/* Mood Trend */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>😊 মুড ট্র্যান্ড (১৪ দিন)</div>
          {charts.moodTrend?.length > 0 ? (
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={charts.moodTrend.map(d => ({ ...d, date: d.date?.slice(5) }))}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="date" tick={{ fill: '#64748b', fontSize: 11 }} />
                <YAxis domain={[1, 10]} tick={{ fill: '#64748b', fontSize: 11 }} />
                <Tooltip {...tooltipStyle} />
                <Line type="monotone" dataKey="mood" name="মুড" stroke="#8b5cf6" strokeWidth={2.5} dot={{ fill: '#8b5cf6', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="empty-state"><div className="empty-icon">😊</div><div className="empty-title">ডেটা নেই</div></div>}
        </div>
      </div>

      {/* Radar Chart Overview */}
      <div className="grid-2" style={{ marginBottom: 24 }}>
        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>🎯 সার্বিক পারফরম্যান্স</div>
          <ResponsiveContainer width="100%" height={250}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="rgba(255,255,255,0.1)" />
              <PolarAngleAxis dataKey="category" tick={{ fill: 'var(--text-muted)', fontSize: 12 }} />
              <Radar name="পারফরম্যান্স" dataKey="value" stroke="#FFB800" fill="#FFB800" fillOpacity={0.15} strokeWidth={2} />
              <Tooltip {...tooltipStyle} />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        {/* Study Progress */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16 }}>📚 বিষয়ভিত্তিক পড়াশোনা</div>
          {studyProgress.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">📚</div><div className="empty-title">ডেটা নেই</div></div>
          ) : (
            studyProgress.map((s, i) => (
              <div key={i} style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>{s.subject}</span>
                  <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{s.totalHours}h · {s.completedTopics}/{s.totalTopics} টপিক</span>
                </div>
                <div className="progress-bar-wrap">
                  <div className="progress-bar-fill blue" style={{ width: `${s.totalTopics ? (s.completedTopics / s.totalTopics) * 100 : 0}%` }} />
                </div>
                {s.lastScore && (
                  <div style={{ fontSize: 11, color: 'var(--success)', marginTop: 4 }}>
                    শেষ স্কোর: {s.lastScore.score}/{s.lastScore.maxScore}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* GitHub-style heatmap */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 20 }}>🗓️ হ্যাবিট হিটম্যাপ (বছরের প্রগ্রেস)</div>
        <div style={{ overflowX: 'auto' }}>
          {heatmap.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🗓️</div>
              <div className="empty-title">ডেটা নেই</div>
              <div className="empty-desc">হ্যাবিট ট্র্যাক করলে এখানে দেখাবে</div>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {heatmap.map((cell, i) => (
                <div key={i}
                  title={`${cell.date}: ${cell.count}/7 হ্যাবিট`}
                  className="heatmap-cell"
                  data-level={Math.min(5, cell.count)}
                />
              ))}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginTop: 16, fontSize: 12, color: 'var(--text-muted)' }}>
          <span>কম</span>
          {[0, 1, 2, 3, 4, 5].map(l => <div key={l} className="heatmap-cell" data-level={l} style={{ flexShrink: 0 }} />)}
          <span>বেশি</span>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
