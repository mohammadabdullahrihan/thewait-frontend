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
  TrendingUp,
  Target,
  BarChart3,
  Activity,
  Award,
  Star,
  Sparkles,
  Info,
  Clock,
  ArrowRight
} from 'lucide-react';
import { habitAPI, analyticsAPI } from '../utils/api';
import { todayStr, getHabitEmoji, getHabitName } from '../utils/helpers';
import { format, addDays, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../components/Common/Loader';
import confetti from 'canvas-confetti';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';

const habitKeys = ['wakeUp6am', 'workout', 'study', 'noFap', 'noCartoon', 'sleep10pm', 'journal'];

const HabitIcon = ({ name, size = 20, className = "" }) => {
  const icons = {
    AlarmClock: <AlarmClock size={size} className={className} />,
    Dumbbell: <Dumbbell size={size} className={className} />,
    Book: <Book size={size} className={className} />,
    Shield: <Shield size={size} className={className} />,
    MonitorOff: <MonitorOff size={size} className={className} />,
    Moon: <Moon size={size} className={className} />,
    Scroll: <Scroll size={size} className={className} />,
    Check: <Check size={size} className={className} />,
    Zap: <Zap size={size} className={className} />,
    Medal: <Medal size={size} className={className} />,
    Trophy: <Trophy size={size} className={className} />,
    Star: <Star size={size} className={className} />,
  };
  return icons[name] || <Check size={size} className={className} />;
};

const Habits = () => {
  const [date, setDate] = useState(todayStr());
  const [habits, setHabits] = useState({ wakeUp6am: false, workout: false, study: false, noFap: false, noCartoon: false, sleep10pm: false, journal: false });
  const [habitScore, setHabitScore] = useState(0);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [history, setHistory] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchData = async (d) => {
    setLoading(true);
    try {
      const [habitRes, streakRes, historyRes, analyticsRes] = await Promise.all([
        habitAPI.get(d),
        habitAPI.getStreak(),
        habitAPI.getHistory(30),
        analyticsAPI.getDashboard()
      ]);
      setHabits(habitRes.data.habit.habits || habits);
      setHabitScore(habitRes.data.habit.habitScore || 0);
      setStreak(streakRes.data.streak || { current: 0, longest: 0 });
      setHistory(historyRes.data.habits || []);
      setAnalytics(analyticsRes.data);
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
    if (navigator.vibrate) navigator.vibrate(50);
    const updated = { ...habits, [key]: !habits[key] };
    const score = Object.values(updated).filter(Boolean).length;
    
    // Optimistic UI
    setHabits(updated);
    setHabitScore(score);

    try {
      await habitAPI.save(date, { habits: updated });
      if (updated[key]) {
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        toast.success(`+10 XP অর্জিত! 🔥`, { 
          icon: '🔥',
          style: { borderRadius: '15px', background: '#064e3b', color: '#fff', fontWeight: 'bold' } 
        });
      }
    } catch (e) { 
      // Revert if failed
      fetchData(date);
      toast.error('সেভ করতে সমস্যা হয়েছে'); 
    }
  };

  const changeDate = (delta) => {
    const d = addDays(parseISO(date), delta);
    setDate(format(d, 'yyyy-MM-dd'));
  };

  const allBadges = [
    { name: 'Bronze Warrior', icon: 'Medal', color: 'text-orange-400', needed: 7, desc: '৭ দিনের টানা স্ট্রিক' },
    { name: 'Silver Warrior', icon: 'Medal', color: 'text-slate-400', needed: 30, desc: '৩০ দিনের টানা স্ট্রিক' },
    { name: 'Gold Warrior', icon: 'Trophy', color: 'text-yellow-400', needed: 90, desc: '৯০ দিনের টানা স্ট্রিক' },
    { name: 'Zen Master', icon: 'Star', color: 'text-purple-400', needed: 15, desc: '১৫ দিন টানা মেডিটেশন/জার্নাল' },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-emerald-100 p-3 rounded-2xl shadow-xl">
          <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-1">{label}</p>
          <p className="text-sm font-black text-emerald-950">স্কোর: <span className="text-emerald-500">{payload[0].value}/7</span></p>
        </div>
      );
    }
    return null;
  };

  if (loading && history.length === 0) return <Loader />;

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-24">
      
      {/* 🚀 Header: Ultra Premium Consistency View */}
      <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3rem] p-1 shadow-sm border border-emerald-100 bg-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-60" />
        
        <div className="relative px-6 py-8 md:px-8 md:py-10 flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-orange-500 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-orange-500/20">
                STREAK ACTIVE
              </span>
              <span className="px-3 py-1 bg-white border border-emerald-100 text-[10px] font-black text-emerald-600 rounded-full uppercase tracking-widest">
                DOPAMINE DETOX
              </span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-emerald-950">
                হ্যাবিট <span className="text-emerald-500">ট্র্যাকার</span>
              </h1>
              <p className="text-emerald-950/40 font-bold text-xs md:text-sm">চরিত্র গঠন হয় প্রতিটি ছোট অভ্যাসে</p>
            </div>

            <div className="flex items-center gap-4 md:gap-6 pt-2">
               <div className="flex items-center gap-2 md:gap-3">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
                    <Flame size={20} className="md:w-6 md:h-6" fill="currentColor" />
                 </div>
                 <div>
                    <div className="text-xl md:text-2xl font-black text-emerald-950 leading-none">{streak.current}</div>
                    <p className="text-[8px] md:text-[9px] font-black text-orange-500 uppercase tracking-widest mt-1">DAY STREAK</p>
                 </div>
               </div>
               <div className="w-px h-8 md:h-10 bg-emerald-100" />
               <div className="flex items-center gap-2 md:gap-3">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-yellow-50 flex items-center justify-center text-yellow-600 shadow-sm border border-yellow-100">
                    <Trophy size={20} className="md:w-6 md:h-6" />
                 </div>
                 <div>
                    <div className="text-xl md:text-2xl font-black text-emerald-950 leading-none">{streak.longest}</div>
                    <p className="text-[8px] md:text-[9px] font-black text-yellow-600 uppercase tracking-widest mt-1">BEST RECORD</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-emerald-50/50 p-6 rounded-[2rem] md:rounded-[2.5rem] border border-emerald-100/50 flex flex-row lg:flex-col items-center justify-center gap-6 lg:gap-4 min-w-full lg:min-w-[220px] backdrop-blur-sm">
             <div className="relative">
                <svg className="w-20 h-20 md:w-28 md:h-28 transform -rotate-90">
                   <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-100 md:hidden" />
                   <circle cx="40" cy="40" r="34" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={213.6} strokeDashoffset={213.6 - (213.6 * habitScore) / 7} className="text-emerald-500 transition-all duration-1000 md:hidden" strokeLinecap="round" />
                   
                   <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-emerald-100 hidden md:block" />
                   <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="10" fill="transparent" strokeDasharray={301.6} strokeDashoffset={301.6 - (301.6 * habitScore) / 7} className="text-emerald-500 transition-all duration-1000 hidden md:block" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl md:text-2xl font-black text-emerald-950 leading-none">{habitScore}/7</span>
                  <span className="text-[7px] md:text-[8px] font-black text-emerald-500 uppercase mt-1">TODAY</span>
                </div>
             </div>
             <div className="flex flex-col items-start lg:items-center">
                <p className="text-[9px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest text-left lg:text-center">
                   {habitScore >= 7 ? 'PERFECT DAY ACHIEVED' : `REMAINING: ${7-habitScore} TASKS`}
                </p>
                <div className="mt-1 h-1 w-24 bg-emerald-100 rounded-full lg:hidden overflow-hidden">
                   <div className="h-full bg-emerald-500" style={{ width: `${(habitScore/7)*100}%` }} />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 📅 Date & Overview */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-6">
        <div className="flex items-center gap-2 md:gap-3 bg-white p-1.5 md:p-2 rounded-[2rem] border border-emerald-50 shadow-sm w-full md:w-max">
           <button onClick={() => changeDate(-1)} className="p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-emerald-50 text-emerald-600 transition-all"><ChevronLeft size={18} className="md:w-5 md:h-5" /></button>
           <div className="flex-1 px-2 md:px-6 text-center">
              <p className="text-[8px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none mb-1">SELECTED DATE</p>
              <p className="text-xs md:text-sm font-black text-emerald-950 whitespace-nowrap">
                 {format(parseISO(date), 'EEEE, dd MMM')}
              </p>
           </div>
           <button 
             onClick={() => changeDate(1)} 
             disabled={date === todayStr()}
             className="p-3 md:p-4 rounded-xl md:rounded-2xl hover:bg-emerald-50 text-emerald-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
           ><ChevronRight size={18} className="md:w-5 md:h-5" /></button>
        </div>

        <div className="flex items-center gap-4 bg-white px-6 py-4 rounded-[2rem] border border-emerald-50 shadow-sm w-full md:w-auto justify-center">
           <Activity size={18} className="text-emerald-400" />
           <p className="text-xs font-black text-emerald-950 uppercase tracking-widest">সাফল্যের হার: <span className="text-emerald-500">{(habitScore/7*100).toFixed(0)}%</span></p>
        </div>
      </div>

      {/* 🏹 Habits Battle Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {habitKeys.map(key => {
          const isCompleted = habits[key];
          return (
            <div
              key={key}
              onClick={() => toggleHabit(key)}
              className={`p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border group transition-all duration-500 cursor-pointer flex flex-col justify-between min-h-[140px] md:min-h-[180px] relative overflow-hidden ${isCompleted ? 'bg-emerald-600 border-emerald-600 text-white shadow-xl shadow-emerald-600/20' : 'bg-white border-emerald-50 hover:border-emerald-200'}`}
            >
              {isCompleted && <div className="absolute -right-4 -top-4 w-12 md:w-16 h-12 md:h-16 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform duration-700" />}
              
              <div className="flex justify-between items-start relative z-10">
                <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl transition-all duration-500 ${isCompleted ? 'bg-white/20 text-white rotate-[360deg]' : 'bg-emerald-50 text-emerald-500 shadow-inner'}`}>
                  <HabitIcon name={getHabitEmoji(key)} size={22} className="md:w-7 md:h-7" />
                </div>
                <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full border-2 flex items-center justify-center transition-all duration-500 ${isCompleted ? 'bg-white border-white text-emerald-600' : 'border-emerald-100 text-transparent hover:border-emerald-300 shadow-sm bg-gray-50/30'}`}>
                  <Check size={14} className={`md:w-4 md:h-4 ${isCompleted ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`} />
                </div>
              </div>
              
              <div className="space-y-1 relative z-10">
                <p className={`text-[7px] md:text-[9px] font-black uppercase tracking-[0.2em] transition-colors ${isCompleted ? 'text-emerald-100/50' : 'text-emerald-900/30'}`}>HABIT MODULE</p>
                <p className={`text-sm md:text-lg font-black leading-tight transition-colors ${isCompleted ? 'text-white' : 'text-emerald-950'}`}>{getHabitName(key)}</p>
              </div>
            </div>
          );
        })}
        
        {/* Info Card */}
        <div className="col-span-2 sm:col-span-1 p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] bg-emerald-950 text-white flex flex-col justify-between border border-white/10 group cursor-help transition-all min-h-[140px] md:min-h-[180px]">
           <div className="flex justify-between items-start">
              <div className="p-3 bg-white/10 rounded-xl md:rounded-2xl border border-white/5">
                 <Info size={20} className="text-emerald-400 md:w-5 md:h-5" />
              </div>
              <Sparkles size={14} className="text-yellow-400 animate-pulse md:w-4 md:h-4" />
           </div>
           <div className="space-y-1">
              <p className="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest">HABIT CODE</p>
              <p className="text-xs md:text-sm font-black italic group-hover:text-emerald-300 transition-colors leading-snug">"আমরা যা বারবার করি তাই আমাদের চরিত্র।"</p>
           </div>
        </div>
      </div>

      {/* 📊 Historical Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Consistency Analytics */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="p-8 md:p-10 rounded-[3rem] border border-emerald-100 shadow-sm bg-white space-y-8 flex-1">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-2xl font-black tracking-tight text-emerald-950">কনসিস্টেন্সি অ্যানালিটিক্স</h3>
                   <p className="text-xs font-bold text-emerald-900/30 uppercase tracking-widest">গত ৩০ দিনের সাফল্যের রেকর্ড</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-[2rem] text-emerald-600 shadow-inner">
                   <BarChart3 size={24} />
                </div>
             </div>

             <div className="pt-4 h-[280px] w-full">
                {history.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={history.map(h => ({ ...h, d: format(parseISO(h.date), 'dd') })).reverse()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="d" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis hide domain={[0, 7]} />
                      <Tooltip content={<CustomTooltip />} cursor={{ fill: '#10b981', fillOpacity: 0.05, radius: 12 }} />
                      <Bar dataKey="habitScore" radius={[8, 8, 8, 8]} barSize={14}>
                        {history.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.habitScore >= 6 ? '#10b981' : entry.habitScore >= 4 ? '#34d399' : entry.habitScore > 0 ? '#fbbf24' : '#f1f5f9'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center opacity-30 italic text-center">
                     <Activity size={48} className="mb-4" />
                     <p>অ্যানালিটিক্স লোড করার মতো পর্যাপ্ত তথ্য নেই</p>
                  </div>
                )}
             </div>

             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-emerald-50 pt-8">
                <div className="text-center space-y-1">
                   <p className="text-[10px] font-black text-emerald-900/30 uppercase">DAYS TRACKED</p>
                   <p className="text-2xl font-black text-emerald-950">{history.length}</p>
                </div>
                <div className="text-center space-y-1">
                   <p className="text-[10px] font-black text-emerald-900/30 uppercase">PERFECT DAYS</p>
                   <p className="text-2xl font-black text-emerald-500">{history.filter(h => h.habitScore === 7).length}</p>
                </div>
                <div className="text-center space-y-1">
                   <p className="text-[10px] font-black text-emerald-900/30 uppercase">AVG SCORE</p>
                   <p className="text-2xl font-black text-emerald-950">{(history.reduce((a,b)=>a+b.habitScore,0)/history.length || 0).toFixed(1)}</p>
                </div>
                <div className="text-center space-y-1">
                   <p className="text-[10px] font-black text-emerald-900/30 uppercase">TOTAL WINS</p>
                   <p className="text-2xl font-black text-emerald-950">{history.reduce((a,b)=>a+b.habitScore,0)}</p>
                </div>
             </div>
          </div>
        </div>

        {/* 🏆 Glory Badges Section */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-8 rounded-[3rem] border border-emerald-100 shadow-sm bg-white space-y-8 flex-1">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-xl font-black text-emerald-950">গ্লোরি রিওয়ার্ডস</h3>
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">অর্জনসমূহ</p>
                </div>
                <Medal size={24} className="text-yellow-500" />
             </div>

             <div className="space-y-4">
                {allBadges.map((b, i) => {
                  const isUnlocked = streak.current >= b.needed;
                  const progress = Math.min(100, (streak.current / b.needed) * 100);
                  return (
                    <div key={i} className={`p-4 rounded-[2rem] border transition-all ${isUnlocked ? 'bg-emerald-50/50 border-emerald-100 shadow-sm' : 'bg-gray-50/30 border-gray-100 opacity-60'}`}>
                       <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-2xl bg-white shadow-sm transition-all ${isUnlocked ? b.color : 'text-gray-300 grayscale'}`}>
                             <HabitIcon name={b.icon} size={20} />
                          </div>
                          <div className="flex-1 min-w-0">
                             <h4 className="text-sm font-black text-emerald-950 truncate">{b.name}</h4>
                             <p className="text-[9px] font-bold text-emerald-900/30 uppercase truncate">{b.desc}</p>
                          </div>
                          {isUnlocked ? (
                            <div className="p-1 px-2 bg-emerald-500 text-white rounded-lg text-[8px] font-black uppercase">UNLOCKED</div>
                          ) : (
                            <span className="text-[10px] font-black text-emerald-400">{streak.current}/{b.needed}</span>
                          )}
                       </div>
                       {!isUnlocked && (
                         <div className="mt-3 h-1.5 w-full bg-gray-100 rounded-full overflow-hidden p-[1px]">
                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${progress}%` }} />
                         </div>
                       )}
                    </div>
                  );
                })}
             </div>

             <button className="w-full py-4 rounded-2xl border-2 border-dashed border-emerald-100 text-emerald-400 text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all">
                VIEW FULL COLLECTION <ArrowRight size={10} className="inline ml-1" />
             </button>
          </div>
        </div>
      </div>

    </div>
  );
};

export default Habits;
