import { useState, useEffect } from 'react';
import { 
  PenTool, 
  ChevronLeft, 
  ChevronRight, 
  Save, 
  Loader2, 
  Calendar, 
  BookOpen, 
  Sparkles, 
  Lightbulb, 
  Target, 
  Heart, 
  Hash,
  Frown,
  Meh,
  Smile,
  Laugh,
  Flame,
  CloudRain,
  MehIcon,
  SmileIcon
} from 'lucide-react';
import { journalAPI } from '../utils/api';
import { todayStr, moodLabel } from '../utils/helpers';
import { format, addDays, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const MoodIcon = ({ score, size = 20, color = 'currentColor' }) => {
  if (score <= 2) return <CloudRain size={size} color={color} />;
  if (score <= 4) return <Frown size={size} color={color} />;
  if (score <= 6) return <Meh size={size} color={color} />;
  if (score <= 8) return <Smile size={size} color={color} />;
  return <Flame size={size} color={color} />;
};

const MOOD_ICONS = [
  { score: 1, icon: CloudRain },
  { score: 2, icon: CloudRain },
  { score: 3, icon: Frown },
  { score: 4, icon: Frown },
  { score: 5, icon: Meh },
  { score: 6, icon: Meh },
  { score: 7, icon: Smile },
  { score: 8, icon: Smile },
  { score: 9, icon: Flame },
  { score: 10, icon: Flame },
];

const Journal = () => {
  const [date, setDate] = useState(todayStr());
  const [entry, setEntry] = useState({ goodThings: '', learned: '', improvements: '', gratitude: '', mood: 5, freeWrite: '' });
  const [recentEntries, setRecentEntries] = useState([]);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async (d) => {
    setLoading(true);
    try {
      const [entryRes, listRes] = await Promise.all([
        journalAPI.get(d),
        journalAPI.list(7)
      ]);
      setEntry(entryRes.data.entry);
      setRecentEntries(listRes.data.entries || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchData(date); }, [date]);

  const changeDate = (delta) => {
    const d = addDays(parseISO(date), delta);
    setDate(format(d, 'yyyy-MM-dd'));
  };

  const saveEntry = async () => {
    setSaving(true);
    try {
      await journalAPI.save(date, entry);
      toast.success('ডায়েরি সংরক্ষিত হয়েছে');
      fetchData(date);
    } catch (e) { toast.error('সেভ হয়নি'); }
    finally { setSaving(false); }
  };

  const mood = moodLabel(entry.mood);

  const prompts = [
    { key: 'goodThings', icon: <Sparkles size={16} />, label: 'আজ আমি কী ভালো করলাম?', placeholder: 'আজকের ভালো মুহূর্তগুলো লিখো...' },
    { key: 'learned', icon: <Lightbulb size={16} />, label: 'আজ আমি কী শিখলাম?', placeholder: 'নতুন কি জানলে আজ?' },
    { key: 'improvements', icon: <Target size={16} />, label: 'আগামীকাল আমি কী উন্নতি করব?', placeholder: 'আগামীকালের পরিকল্পনা...' },
    { key: 'gratitude', icon: <Heart size={16} />, label: 'আজ কিসের জন্য কৃতজ্ঞ?', placeholder: 'কৃতজ্ঞতা প্রকাশ করো...' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <PenTool size={28} color="var(--primary)" /> জার্নাল
          </h1>
          <p className="page-subtitle">প্রতিদিনের চিন্তা, অনুভূতি এবং পরিকল্পনা</p>
        </div>
      </div>

      {/* Date Nav */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <div className="date-nav" style={{ display: 'inline-flex' }}>
          <button className="date-nav-btn" onClick={() => changeDate(-1)}><ChevronLeft size={18} /></button>
          <div className="date-nav-display">
            {format(parseISO(date), 'EEEE, dd MMMM yyyy')}
            {date === todayStr() && <span style={{ color: 'var(--secondary)', marginLeft: 8, fontSize: 13 }}>আজ</span>}
          </div>
          <button className="date-nav-btn" onClick={() => changeDate(1)} disabled={date === todayStr()}><ChevronRight size={18} /></button>
        </div>
        <button className="btn btn-primary" onClick={saveEntry} disabled={saving}>
          {saving ? <Loader2 size={16} className="spin" /> : <><Save size={16} /> সেভ</>}
        </button>
      </div>

      <div className="grid-2">
        {/* Main Journal */}
        <div>
          {/* Mood Selector */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
              <MoodIcon score={entry.mood} size={20} color="var(--secondary)" />
              মুড: <span style={{ color: 'var(--secondary)', marginLeft: 4 }}>{mood.label} ({entry.mood}/10)</span>
            </div>
            <div className="mood-selector">
              {MOOD_ICONS.map((m, idx) => {
                const Icon = m.icon;
                return (
                  <button key={idx} className={`mood-btn${entry.mood === m.score ? ' selected' : ''}`}
                    onClick={() => setEntry({...entry, mood: m.score})} title={`${m.score}/10`}>
                    <Icon size={20} />
                  </button>
                );
              })}
            </div>
          </div>

          {/* Journal Prompts */}
          {prompts.map(({ key, icon, label, placeholder }) => (
            <div className="card" style={{ marginBottom: 16 }} key={key}>
              <label className="form-label" style={{ fontSize: 14, textTransform: 'none', letterSpacing: 0, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
                {icon} {label}
              </label>
              <textarea
                className="form-textarea"
                placeholder={placeholder}
                value={entry[key] || ''}
                onChange={e => setEntry({...entry, [key]: e.target.value})}
                style={{ minHeight: 100 }}
              />
            </div>
          ))}

          {/* Free Write */}
          <div className="card" style={{ marginBottom: 16 }}>
            <label className="form-label" style={{ fontSize: 14, textTransform: 'none', letterSpacing: 0, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 8 }}>
              <PenTool size={16} /> মুক্ত লেখা (মনের যা আসে লিখো)
            </label>
            <textarea
              className="form-textarea"
              placeholder="আজ মনে যা এলো..."
              value={entry.freeWrite || ''}
              onChange={e => setEntry({...entry, freeWrite: e.target.value})}
              style={{ minHeight: 160 }}
            />
          </div>

          <button className="btn btn-primary btn-full btn-lg" onClick={saveEntry} disabled={saving}>
            {saving ? <><Loader2 size={18} className="spin" /> সংরক্ষণ হচ্ছে...</> : <><Save size={18} /> ডায়েরি সংরক্ষণ করো</>}
          </button>
        </div>

        {/* Recent Entries */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <Calendar size={18} color="var(--primary)" /> সাম্প্রতিক এন্ট্রি
            </div>
            {loading ? (
              <div style={{ padding: 20, textAlign: 'center' }}><div className="loading-spinner" /></div>
            ) : recentEntries.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><BookOpen size={40} strokeWidth={1} /></div>
                <div className="empty-title">কোনো এন্ট্রি নেই</div>
                <div className="empty-desc">প্রথম ডায়েরি লিখো</div>
              </div>
            ) : (
              recentEntries.map((e, i) => {
                return (
                  <div key={i}
                    onClick={() => setDate(e.date)}
                    style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid var(--border-light)', marginBottom: 8, cursor: 'pointer', transition: 'all 0.2s', background: date === e.date ? 'rgba(34, 197, 94, 0.08)' : 'transparent', borderColor: date === e.date ? 'var(--secondary)' : 'var(--border-light)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: date === e.date ? 'var(--secondary)' : 'inherit' }}>{format(parseISO(e.date), 'dd MMM')}</span>
                      <span style={{ fontSize: 16 }}><MoodIcon score={e.mood} size={16} color={date === e.date ? 'var(--secondary)' : 'var(--text-muted)'} /></span>
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {e.goodThings || e.freeWrite || 'এন্ট্রি আছে'}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Mood Motivational tip */}
          <div className="quote-card">
            <p className="quote-text">
              {entry.mood >= 8 ? '"তুমি আজ দুর্দান্ত ছিলে! এই শক্তি ধরে রাখো।"' :
               entry.mood >= 6 ? '"ভালো দিন, কিন্তু আরো ভালো হতে পারে। চেষ্টা চালিয়ে যাও।"' :
               entry.mood >= 4 ? '"কঠিন দিন গেছে, কিন্তু তুমি এখনও লড়াই করছো। এটাই যথেষ্ট।"' :
               '"অন্ধকার রাতের পরেই ভোর হয়। হাল ছেড়ো না।"'}
            </p>
            <p className="quote-author">— অপেক্ষা</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Journal;
