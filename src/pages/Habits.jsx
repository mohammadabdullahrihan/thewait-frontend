import { useState, useEffect } from 'react';
import { habitAPI } from '../utils/api';
import { todayStr, getHabitEmoji, getHabitName } from '../utils/helpers';
import { format, addDays, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const habitKeys = ['wakeUp6am', 'workout', 'study', 'noFap', 'noCartoon', 'sleep10pm', 'journal'];

const Habits = () => {
  const [date, setDate] = useState(todayStr());
  const [habits, setHabits] = useState({ wakeUp6am: false, workout: false, study: false, noFap: false, noCartoon: false, sleep10pm: false, journal: false });
  const [habitScore, setHabitScore] = useState(0);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchData = async (d) => {
    setLoading(true);
    try {
      const [habitRes, streakRes, historyRes] = await Promise.all([
        habitAPI.get(d),
        habitAPI.getStreak(),
        habitAPI.getHistory(30)
      ]);
      setHabits(habitRes.data.habit.habits || habits);
      setHabitScore(habitRes.data.habit.habitScore || 0);
      setStreak(streakRes.data.streak || { current: 0, longest: 0 });
      setHistory(historyRes.data.habits || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(date); }, [date]);

  const toggleHabit = async (key) => {
    const updated = { ...habits, [key]: !habits[key] };
    setHabits(updated);
    const score = Object.values(updated).filter(Boolean).length;
    setHabitScore(score);
    try {
      await habitAPI.save(date, { habits: updated });
      if (updated[key]) toast.success(`${getHabitEmoji(key)} +10 XP!`, { duration: 1500 });
    } catch (e) { toast.error('সেভ হয়নি'); }
  };

  const changeDate = (delta) => {
    const d = addDays(parseISO(date), delta);
    setDate(format(d, 'yyyy-MM-dd'));
  };

  const allBadges = [
    { name: 'Bronze Warrior 🥉', needed: 7, desc: '৭ দিনের স্ট্রিক' },
    { name: 'Silver Warrior 🥈', needed: 30, desc: '৩০ দিনের স্ট্রিক' },
    { name: 'Gold Warrior 🥇', needed: 90, desc: '৯০ দিনের স্ট্রিক' },
    { name: 'Streak Master ⚡', needed: 30, desc: '৩০ দিন নো-ফ্যাপ' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🔥 হ্যাবিট ট্র্যাকার</h1>
          <p className="page-subtitle">ডোপামিন ডিটক্স · প্রতিদিনের ৭টি মূল হ্যাবিট</p>
        </div>
      </div>

      {/* Streak */}
      <div className="streak-display" style={{ marginBottom: 24 }}>
        <div className="streak-flame">🔥</div>
        <div className="streak-info">
          <div className="streak-count">{streak.current || 0}</div>
          <div className="streak-label">দিনের টানা স্ট্রিক</div>
        </div>
        <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
          <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)' }}>{streak.longest || 0}</div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>সর্বোচ্চ</div>
        </div>
      </div>

      {/* Date Nav */}
      <div className="date-nav" style={{ marginBottom: 20, display: 'inline-flex' }}>
        <button className="date-nav-btn" onClick={() => changeDate(-1)}>‹</button>
        <div className="date-nav-display">
          {format(parseISO(date), 'EEEE, dd MMM')}
          {date === todayStr() && <span style={{ color: 'var(--secondary)', marginLeft: 8, fontSize: 13 }}>আজ</span>}
        </div>
        <button className="date-nav-btn" onClick={() => changeDate(1)} disabled={date === todayStr()}>›</button>
      </div>

      {/* Habit Score */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <span style={{ fontWeight: 600 }}>আজকের স্কোর</span>
          <span style={{ color: 'var(--secondary)', fontWeight: 800, fontSize: 22 }}>{habitScore}/7</span>
        </div>
        <div className="progress-bar-wrap" style={{ height: 10 }}>
          <div className="progress-bar-fill gold" style={{ width: `${(habitScore / 7) * 100}%` }} />
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
          {habitScore >= 7 ? '🎉 সব হ্যাবিট সম্পন্ন! অসাধারণ!' : `আরও ${7 - habitScore}টি হ্যাবিট বাকি`}
        </div>
      </div>

      {/* Habits Grid */}
      <div className="habit-grid" style={{ marginBottom: 28 }}>
        {habitKeys.map(key => (
          <div
            key={key}
            className={`habit-card${habits[key] ? ' completed' : ''}`}
            onClick={() => toggleHabit(key)}
          >
            <div className="habit-icon">{getHabitEmoji(key)}</div>
            <div className="habit-name">{getHabitName(key)}</div>
            <div className="habit-check">{habits[key] && '✓'}</div>
          </div>
        ))}
      </div>

      {/* 30-day history view */}
      <div className="card">
        <div className="card-title" style={{ marginBottom: 16 }}>📅 ৩০ দিনের হিস্টোরি</div>
        {history.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📅</div>
            <div className="empty-title">ডেটা নেই</div>
            <div className="empty-desc">হ্যাবিট ট্র্যাক করা শুরু করো</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {history.slice(0, 30).map((h, i) => (
              <div key={i} title={`${h.date}: ${h.habitScore}/7`}
                style={{
                  width: 36, height: 36,
                  borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 11, fontWeight: 700,
                  background: h.habitScore >= 6 ? 'rgba(46,125,50,0.7)' : h.habitScore >= 4 ? 'rgba(255,184,0,0.5)' : h.habitScore >= 1 ? 'rgba(59,130,246,0.4)' : 'rgba(255,255,255,0.06)',
                  color: h.habitScore >= 1 ? 'white' : 'var(--text-muted)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  cursor: 'default'
                }}
              >
                {h.habitScore}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="card" style={{ marginTop: 20 }}>
        <div className="card-title" style={{ marginBottom: 16 }}>🏆 ব্যাজ সিস্টেম</div>
        <div className="badges-grid">
          {allBadges.map((b, i) => (
            <div key={i} className={`badge-item${streak.current < b.needed ? ' badge-locked' : ''}`}>
              <div className="badge-icon">{b.name.split(' ').pop()}</div>
              <div>
                <div className="badge-name">{b.name}</div>
                <div className="badge-desc">{b.desc}</div>
                {streak.current < b.needed && (
                  <div style={{ fontSize: 11, color: 'var(--secondary)', marginTop: 2 }}>
                    আরও {b.needed - streak.current} দিন বাকি
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Habits;
