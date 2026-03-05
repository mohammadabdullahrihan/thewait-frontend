import { getMilestones, daysUntil } from '../utils/helpers';

const Milestones = () => {
  const milestones = getMilestones();

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title">🎯 মাইলস্টোন ও টাইমলাইন</h1>
          <p className="page-subtitle">এপ্রিল ২০২৫ — মার্চ ২০২৭ · তোমার পুরো যাত্রার মানচিত্র</p>
        </div>
      </div>

      {/* Journey Countdown */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: 28 }}>
        {[
          { label: 'EU Journey', date: '2027-03-01', icon: '🌍', color: 'var(--secondary)' },
          { label: 'IELTS Target', date: '2026-09-30', icon: '🎓', color: 'var(--info)' },
          { label: 'GED Target', date: '2026-03-31', icon: '📚', color: 'var(--accent)' },
        ].map(item => {
          const days = daysUntil(item.date);
          return (
            <div key={item.label} className="stat-card" style={{ textAlign: 'center', borderTop: `3px solid ${item.color}` }}>
              <div style={{ fontSize: 32 }}>{item.icon}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: item.color, fontFamily: 'Montserrat', lineHeight: 1 }}>
                {days > 0 ? days : '✅'}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: 0.5 }}>
                {days > 0 ? 'দিন বাকি' : 'সম্পন্ন'}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600 }}>{item.label}</div>
            </div>
          );
        })}
      </div>

      {/* Timeline */}
      <div className="card" style={{ marginBottom: 0 }}>
        <div className="card-title" style={{ marginBottom: 24 }}>📅 ফেজ ভিত্তিক পরিকল্পনা</div>
        <div className="timeline">
          {milestones.map((m, i) => (
            <div key={i} className={`timeline-item${m.status === 'completed' ? ' completed' : m.status === 'active' ? ' active' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8 }}>
                <div>
                  <div className="timeline-phase">{m.phase}</div>
                  <div className="timeline-title">{m.title}</div>
                  <div className="timeline-dates">
                    📅 {m.start} {m.end && `→ ${m.end}`}
                  </div>
                </div>
                <div>
                  {m.status === 'active' && <span style={{ background: 'rgba(255,184,0,0.15)', color: 'var(--secondary)', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700, border: '1px solid rgba(255,184,0,0.3)' }}>🔥 চলমান</span>}
                  {m.status === 'completed' && <span style={{ background: 'rgba(34,197,94,0.15)', color: 'var(--success)', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 700 }}>✅ সম্পন্ন</span>}
                  {m.status === 'upcoming' && <span style={{ background: 'rgba(255,255,255,0.06)', color: 'var(--text-muted)', padding: '4px 12px', borderRadius: 20, fontSize: 11, fontWeight: 600 }}>⏳ আসছে</span>}
                </div>
              </div>

              <div style={{ marginTop: 14, display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                {m.tasks.map((task, j) => (
                  <span key={j} style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-secondary)', padding: '4px 10px', borderRadius: 20, fontSize: 12, border: '1px solid var(--border-light)' }}>
                    {task}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Milestones;
