import { useState, useEffect } from 'react';
import { 
  Flame, 
  ChevronLeft, 
  ChevronRight, 
  Check, 
  Calendar, 
  Trophy,
  AlarmClock,
  Dumbbell,
  Book,
  Shield,
  MonitorOff,
  Moon,
  Scroll,
  Zap,
  Medal,
  Loader2
} from 'lucide-react';
import { habitAPI } from '../utils/api';
import { todayStr, getHabitEmoji, getHabitName } from '../utils/helpers';
import { format, addDays, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../components/Common/Loader';

const habitKeys = ['wakeUp6am', 'workout', 'study', 'noFap', 'noCartoon', 'sleep10pm', 'journal'];

const HabitIcon = ({ name, size = 20, color = 'currentColor' }) => {
  const icons = {
    AlarmClock: <AlarmClock size={size} color={color} />,
    Dumbbell: <Dumbbell size={size} color={color} />,
    Book: <Book size={size} color={color} />,
    Shield: <Shield size={size} color={color} />,
    MonitorOff: <MonitorOff size={size} color={color} />,
    Moon: <Moon size={size} color={color} />,
    Scroll: <Scroll size={size} color={color} />,
    Check: <Check size={size} color={color} />,
    Zap: <Zap size={size} color={color} />,
    Medal: <Medal size={size} color={color} />,
    Trophy: <Trophy size={size} color={color} />,
  };
  return icons[name] || icons.Check;
};

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
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  };

  useEffect(() => { 
    fetchData(date); 
  }, [date]);

  const toggleHabit = async (key) => {
    const updated = { ...habits, [key]: !habits[key] };
    setHabits(updated);
    const score = Object.values(updated).filter(Boolean).length;
    setHabitScore(score);
    try {
      await habitAPI.save(date, { habits: updated });
      if (updated[key]) toast.success(`+10 XP অর্জিত! 🔥`, { duration: 1500 });
    } catch (e) { toast.error('সেভ হয়নি'); }
  };

  const changeDate = (delta) => {
    const d = addDays(parseISO(date), delta);
    setDate(format(d, 'yyyy-MM-dd'));
  };

  const allBadges = [
    { name: 'Bronze Warrior', icon: 'Medal', color: '#cd7f32', needed: 7, desc: '৭ দিনের স্ট্রিক' },
    { name: 'Silver Warrior', icon: 'Medal', color: '#c0c0c0', needed: 30, desc: '৩০ দিনের স্ট্রিক' },
    { name: 'Gold Warrior', icon: 'Trophy', color: '#FFD700', needed: 90, desc: '৯০ দিনের স্ট্রিক' },
    { name: 'Streak Master', icon: 'Zap', color: '#22c55e', needed: 30, desc: '৩০ দিন নো-ফ্যাপ' },
  ];

  if (loading && history.length === 0) return <Loader />;

  return (
    <div className="fade-in animate-in fade-in duration-700">
      <div className="page-header mb-8">
        <div>
          <h1 className="text-3xl font-black mb-1 flex items-center gap-3" style={{ color: 'var(--text-primary)' }}>
            <Flame size={32} className="text-orange-500 fill-orange-500" /> হ্যাবিট ট্র্যাকার
          </h1>
          <p className="text-sm font-medium" style={{ color: 'var(--text-muted)' }}>ডোপামিন ডিটক্স · প্রতিদিনের ৭টি মূল হ্যাবিট</p>
        </div>
      </div>

      {/* Streak */}
      <div className="card mb-8 flex items-center justify-between p-8" style={{ background: 'var(--bg-card)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-6">
          <div className="bg-orange-50 p-4 rounded-2xl">
            <Flame size={48} className="text-orange-500 fill-orange-500" />
          </div>
          <div>
            <div className="text-5xl font-black" style={{ color: 'var(--text-primary)' }}>{streak.current || 0}</div>
            <div className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--secondary)' }}>দিনের টানা স্ট্রিক</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-black flex items-center justify-end gap-2" style={{ color: 'var(--text-primary)' }}>
            <Trophy size={20} className="text-yellow-400" />
            {streak.longest || 0}
          </div>
          <div className="text-[10px] font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>ব্যক্তিগত রেকর্ড</div>
        </div>
      </div>

      {/* Date Nav */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center bg-white rounded-2xl border shadow-sm p-1" style={{ borderColor: 'var(--border)' }}>
          <button className="p-2 hover:bg-emerald-50 rounded-xl transition-colors" onClick={() => changeDate(-1)}><ChevronLeft size={20} /></button>
          <div className="px-6 font-bold text-sm min-w-[160px] text-center">
            {format(parseISO(date), 'EEEE, dd MMM')}
            {date === todayStr() && <span className="ml-2 text-emerald-500">(আজ)</span>}
          </div>
          <button className="p-2 hover:bg-emerald-50 rounded-xl transition-colors disabled:opacity-30" onClick={() => changeDate(1)} disabled={date === todayStr()}><ChevronRight size={20} /></button>
        </div>
      </div>

      {/* Habit Score Card */}
      <div className="card mb-8">
        <div className="flex justify-between items-center mb-4">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-800/60">আজকের অগ্রগতি</span>
          <span className="text-2xl font-black text-emerald-600">{habitScore}/7</span>
        </div>
        <div className="h-3 w-full bg-emerald-50 rounded-full overflow-hidden border border-emerald-100">
          <div 
            className="h-full bg-emerald-500 shadow-lg shadow-emerald-500/20 transition-all duration-700" 
            style={{ width: `${(habitScore / 7) * 100}%` }} 
          />
        </div>
        <p className="text-[10px] font-bold uppercase tracking-widest mt-4 text-emerald-500">
          {habitScore >= 7 ? 'সব হ্যাবিট সম্পন্ন! অসাধারণ!' : `আরও ${7 - habitScore}টি হ্যাবিট বাকি`}
        </p>
      </div>

      {/* Habits Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {habitKeys.map(key => (
          <div
            key={key}
            onClick={() => toggleHabit(key)}
            className={`group cursor-pointer p-6 rounded-3xl border transition-all duration-300 ${habits[key] ? 'shadow-md scale-[1.02]' : 'hover:shadow-sm hover:translate-y-[-2px]'}`}
            style={{ 
              background: habits[key] ? 'var(--bg-card-hover)' : 'var(--bg-card)', 
              borderColor: habits[key] ? 'var(--secondary)' : 'var(--border)' 
            }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl transition-colors ${habits[key] ? 'bg-emerald-500 text-white' : 'bg-emerald-50 text-emerald-600'}`}>
                <HabitIcon name={getHabitEmoji(key)} size={24} />
              </div>
              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${habits[key] ? 'bg-emerald-500 border-emerald-500' : 'border-emerald-100'}`}>
                {habits[key] && <Check size={14} className="text-white font-bold" />}
              </div>
            </div>
            <div className={`text-sm font-bold transition-colors ${habits[key] ? 'text-emerald-900' : 'text-emerald-800/70 group-hover:text-emerald-900'}`}>{getHabitName(key)}</div>
          </div>
        ))}
      </div>

      {/* 30-day history view */}
      <div className="card mb-8">
        <h3 className="text-lg font-black mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Calendar size={18} className="text-emerald-500" /> ৩০ দিনের ইতিহাস
        </h3>
        
        {loading ? (
          <div className="flex justify-center p-12"><Loader2 className="animate-spin text-emerald-500" /></div>
        ) : history.length === 0 ? (
          <div className="p-12 text-center bg-emerald-50/50 rounded-2xl border border-dashed border-emerald-100">
            <Calendar size={48} className="mx-auto mb-4 text-emerald-100" />
            <p className="text-sm font-bold text-emerald-800/40 uppercase tracking-widest">No History Yet</p>
          </div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {history.slice(0, 30).map((h, i) => (
              <div key={i} title={`${h.date}: ${h.habitScore}/7`}
                className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold border transition-all hover:scale-110"
                style={{
                  background: h.habitScore >= 6 ? 'var(--secondary)' : h.habitScore >= 4 ? 'var(--secondary-dark)' : h.habitScore >= 1 ? 'var(--bg-card-hover)' : 'var(--bg-dark)',
                  color: h.habitScore >= 4 ? 'white' : 'var(--text-primary)',
                  borderColor: 'var(--border)'
                }}
              >
                {h.habitScore}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="card">
        <h3 className="text-lg font-black mb-6 flex items-center gap-2" style={{ color: 'var(--text-primary)' }}>
          <Trophy size={18} className="text-yellow-500 fill-yellow-500" /> গ্লোরি ব্যাজসমূহ
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allBadges.map((b, i) => (
            <div key={i} className={`p-5 rounded-2xl border transition-all ${streak.current < b.needed ? 'opacity-40 grayscale blur-[1px]' : 'bg-emerald-50/30 border-emerald-100 shadow-sm'}`}>
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-white shadow-sm">
                  <HabitIcon name={b.icon} size={24} color={streak.current >= b.needed ? b.color : '#94a3b8'} />
                </div>
                <div>
                  <div className="text-sm font-black text-emerald-900">{b.name}</div>
                  <div className="text-[10px] font-bold text-emerald-600/70 uppercase tracking-widest">{b.desc}</div>
                </div>
              </div>
              {streak.current < b.needed && (
                <div className="mt-3 text-[10px] font-black text-emerald-500 uppercase tracking-widest bg-emerald-50 py-1 px-2 rounded-lg inline-block">
                  আরও {b.needed - streak.current} দিন বাকি
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Habits;
