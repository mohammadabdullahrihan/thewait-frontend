import { useState, useEffect } from 'react';
import { 
  Home,
  Target, 
  Flame, 
  ClipboardList, 
  Zap, 
  BookOpen, 
  Globe, 
  BarChart3, 
  Smile,
  Frown,
  Trophy,
  ArrowUpRight,
  TrendingUp,
  Award,
  Calendar,
  Clock,
  ListChecks,
  MessageSquare,
  Timer,
  ChevronRight,
  Sun,
  Dumbbell,
  PenTool,
  Swords,
  Shield,
  Activity,
  Milestone,
  Brain,
  Rocket,
  Heart
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { analyticsAPI, habitAPI, routineAPI, journalAPI, studyAPI, workoutAPI } from '../utils/api';
import { getTodayQuote, xpToNextLevel, todayStr, daysUntil } from '../utils/helpers';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { format } from 'date-fns';
import Loader from '../components/Common/Loader';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [charts, setCharts] = useState(null);
  const [streak, setStreak] = useState({ current: 0, longest: 0 });
  const [loading, setLoading] = useState(true);
  const [recentReflection, setRecentReflection] = useState(null);
  const [todayHabits, setTodayHabits] = useState([]);
  const [studySubjects, setStudySubjects] = useState([]);
  const [todayWorkout, setTodayWorkout] = useState(null);
  
  const quote = getTodayQuote();
  const xp = xpToNextLevel(user?.experience || 0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [analyticsRes, streakRes, journalRes, habitRes, studyRes, workoutRes] = await Promise.all([
          analyticsAPI.getDashboard(),
          habitAPI.getStreak(),
          journalAPI.list(1),
          habitAPI.get(todayStr()),
          studyAPI.getAll(),
          workoutAPI.get(todayStr())
        ]);
        
        setStats(analyticsRes.data.stats);
        setCharts(analyticsRes.data.charts);
        setStreak(streakRes.data.streak || { current: 0, longest: 0 });
        
        if (journalRes.data.entries?.length > 0) {
          setRecentReflection(journalRes.data.entries[0]);
        }
        
        setTodayHabits(habitRes.data.habits || []);
        setStudySubjects(studyRes.data.subjects || []);
        setTodayWorkout(workoutRes.data.workout);
        
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.experience]);

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white/95 backdrop-blur-md border border-emerald-100 rounded-2xl p-4 shadow-xl animate-in zoom-in-95 duration-200">
          <p className="text-[10px] font-black uppercase tracking-widest text-emerald-800/40 mb-2">{label}</p>
          {payload.map((p, pIdx) => (
            <div key={pIdx} className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: p.color }} />
              <p className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>{p.value} {p.name === 'score' ? 'Points' : ''}</p>
            </div>
          ))}
        </div>
      );
    }
    return null;
  };

  const daysToEU = daysUntil('2027-03-01');

  if (loading) return <Loader />;

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-20">
      
      {/* 🚀 Dynamic Header: High Fidelity */}
      <div className="relative overflow-hidden rounded-[3rem] p-1 shadow-sm border border-emerald-100 bg-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-[80px] -mr-32 -mt-32 opacity-60" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-50 rounded-full blur-[60px] -ml-24 -mb-24 opacity-40" />
        
        <div className="relative px-8 py-10 flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div className="space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500 text-[10px] font-black text-white rounded-full uppercase tracking-[0.2em] shadow-lg shadow-emerald-500/20">
                ACTIVE WARRIOR
              </span>
              <span className="px-3 py-1 bg-white border border-emerald-100 text-[10px] font-black text-emerald-600 rounded-full uppercase tracking-[0.2em]">
                {format(new Date(), 'MMMM yyyy')}
              </span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-emerald-950">
                স্বাগতম, <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">{user?.name?.split(' ')[0]}</span>!
              </h1>
              <p className="text-emerald-950/40 font-bold text-sm">দিনটি শুরু করো সঠিক শৃঙ্খলার সাথে</p>
            </div>

            <div className="flex items-center gap-6 pt-2">
               <div className="flex items-center gap-2">
                 <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
                    <Flame size={20} fill="currentColor" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-orange-900/30 uppercase tracking-widest">CURRENT STREAK</p>
                    <p className="text-lg font-black text-orange-950">{streak.current} Days</p>
                 </div>
               </div>
               <div className="w-px h-10 bg-emerald-100" />
               <div className="flex items-center gap-2">
                 <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center text-purple-500 shadow-sm border border-purple-100">
                    <Zap size={20} fill="currentColor" />
                 </div>
                 <div>
                    <p className="text-[9px] font-black text-purple-900/30 uppercase tracking-widest">WARRIOR LEVEL</p>
                    <p className="text-lg font-black text-purple-950">Lv.{xp.level}</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-emerald-50/50 p-6 rounded-[2.5rem] border border-emerald-100/50 flex flex-col items-center gap-4 min-w-[200px] backdrop-blur-sm">
             <div className="relative">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-emerald-100" />
                  <circle cx="48" cy="48" r="40" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray={251.2} strokeDashoffset={251.2 - (251.2 * xp.percentage) / 100} className="text-emerald-500 transition-all duration-1000" strokeLinecap="round" />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-xl font-black text-emerald-950">{Math.round(xp.percentage)}%</span>
                  <span className="text-[8px] font-black text-emerald-500 uppercase">PROGRESS</span>
                </div>
             </div>
             <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest text-center">XP TO NEXT LEVEL: {1000 - (user?.experience % 1000)}</p>
          </div>
        </div>
      </div>

      {/* 🧭 Quick Vitals: 4-Column Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { icon: <ClipboardList size={22} />, label: 'DAILY ROUTINE', value: 'ডেইলি চেকলিস্ট', color: 'bg-emerald-50 text-emerald-600', link: '/routine', status: 'প্রক্রিয়াধীন' },
          { icon: <Dumbbell size={22} />, label: 'WORKOUT GOAL', value: todayWorkout ? 'ব্যায়াম শেষ' : 'ব্যায়াম বাকি', color: 'bg-rose-50 text-rose-600', link: '/workout', status: todayWorkout ? 'পূর্ণ' : 'বাকি' },
          { icon: <Activity size={22} />, label: 'HABIT VICTORY', value: `${todayHabits.filter(h => h.completed).length}/${todayHabits.length} টাস্ক`, color: 'bg-orange-50 text-orange-600', link: '/habits', status: 'চলমান' },
          { icon: <BookOpen size={22} />, label: 'STUDY FOCUS', value: studySubjects[0]?.name || 'কোনো মডিউল নেই', color: 'bg-sky-50 text-sky-600', link: '/study', status: 'স্টাডি টাইম' },
        ].map((item, i) => (
          <Link key={i} to={item.link} className="p-6 rounded-[2.5rem] bg-white border border-emerald-50 shadow-sm hover:shadow-md hover:translate-y-[-4px] transition-all group flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-start">
              <div className={`p-3 rounded-2xl ${item.color.split(' ')[0]} ${item.color.split(' ')[1]} shadow-inner`}>
                {item.icon}
              </div>
              <span className={`text-[8px] font-black px-2 py-1 rounded-md uppercase tracking-widest ${item.color.split(' ')[0]} ${item.color.split(' ')[1]}`}>
                {item.status}
              </span>
            </div>
            <div className="space-y-1">
              <p className="text-[9px] font-black text-emerald-900/30 uppercase tracking-[0.2em]">{item.label}</p>
              <p className="text-lg font-black text-emerald-950 truncate">{item.value}</p>
            </div>
          </Link>
        ))}
      </div>

      {/* 🛡️ Performance Grid: Level & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Warrior Statistics: Real Metrics */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          <div className="p-8 md:p-10 rounded-[3rem] border border-emerald-100 shadow-sm bg-white space-y-8 flex-1">
             <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-2xl font-black tracking-tight text-emerald-950">ওয়ারিয়র স্ট্যাটিস্টিকস</h3>
                   <p className="text-xs font-bold text-emerald-900/30 uppercase tracking-widest">আপনার দীর্ঘমিয়াদী প্রগতির গ্রাফ</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-[2rem] text-emerald-600 shadow-inner">
                   <BarChart3 size={24} />
                </div>
             </div>

             <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="p-6 rounded-[2rem] bg-emerald-50/50 border border-emerald-100/50 text-center space-y-2">
                   <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none">TOTAL BATTLES</p>
                   <p className="text-3xl font-black text-emerald-950">{(stats?.totalHabitsCompleted || 0) + (stats?.milestonesCount || 0)}</p>
                   <div className="flex items-center justify-center gap-1 text-[10px] font-black text-emerald-500 uppercase">
                      <TrendingUp size={10} /> +12% GROWTH
                   </div>
                </div>
                <div className="p-6 rounded-[2rem] bg-orange-50/50 border border-orange-100/50 text-center space-y-2">
                   <p className="text-[10px] font-black text-orange-900/40 uppercase tracking-widest leading-none">BEST STREAK</p>
                   <p className="text-3xl font-black text-orange-950">{streak.longest || 0}</p>
                   <div className="flex items-center justify-center gap-1 text-[10px] font-black text-orange-500 uppercase">
                      <Trophy size={10} /> ALL TIME RECORD
                   </div>
                </div>
                <div className="p-6 rounded-[2rem] bg-purple-50/50 border border-purple-100/50 text-center space-y-2">
                   <p className="text-[10px] font-black text-purple-900/40 uppercase tracking-widest leading-none">RANK STATUS</p>
                   <p className="text-3xl font-black text-purple-950">Vanguard</p>
                   <div className="flex items-center justify-center gap-1 text-[10px] font-black text-purple-500 uppercase">
                      <Shield size={10} /> DEFENSE STABLE
                   </div>
                </div>
             </div>

             <div className="pt-4 h-[240px] w-full">
                {charts?.weeklyHabitData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={charts.weeklyHabitData.map(d => ({ ...d, date: d.date?.slice(5) }))}>
                      <defs>
                        <linearGradient id="colorMain" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                          <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                      <XAxis dataKey="date" tick={{ fill: '#94a3b8', fontSize: 9, fontWeight: 900 }} axisLine={false} tickLine={false} dy={10} />
                      <YAxis hide domain={[0, 7]} />
                      <Tooltip content={customTooltip} cursor={{ stroke: '#10b981', strokeWidth: 1, strokeDasharray: '4 4' }} />
                      <Area type="monotone" dataKey="score" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorMain)" dot={{ r: 6, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#10b981' }} />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100 italic text-gray-400">
                     <Activity size={32} className="mb-2 opacity-20" />
                     <p className="text-sm">পর্যাপ্ত তথ্য নেই</p>
                  </div>
                )}
             </div>
          </div>
        </div>

        {/* Action Center: Mental State & Goal */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          <div className="p-8 rounded-[3rem] border border-emerald-100 shadow-sm bg-white space-y-6 flex flex-col justify-between">
             <div className="space-y-1">
                <h3 className="text-xl font-black tracking-tight text-emerald-950">মেন্টাল হেলথ</h3>
                <p className="text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">মুড অ্যানালাইসিস</p>
             </div>
             
             <div className="flex items-center justify-center py-4">
                <div className="relative w-40 h-40">
                   <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
                      <p className="text-3xl font-black text-emerald-950">7.5</p>
                      <p className="text-[8px] font-black text-emerald-400 uppercase">STABLE MIND</p>
                   </div>
                   <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                         <Pie data={[{ value: 75 }, { value: 25 }]} innerRadius={55} outerRadius={75} startAngle={90} endAngle={450} dataKey="value" stroke="none">
                            <Cell fill="#10b981" />
                            <Cell fill="#f1f5f9" />
                         </Pie>
                      </PieChart>
                   </ResponsiveContainer>
                </div>
             </div>

             <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50/50 border border-emerald-100/50">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-emerald-500">
                        <Smile size={18} />
                      </div>
                      <span className="text-xs font-black text-emerald-950">সুখী দিন</span>
                   </div>
                   <span className="text-xs font-black text-emerald-600">84%</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-2xl bg-orange-50/50 border border-orange-100/50">
                   <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm text-orange-500">
                        <Frown size={18} />
                      </div>
                      <span className="text-xs font-black text-emerald-950">চ্যালেঞ্জিং</span>
                   </div>
                   <span className="text-xs font-black text-orange-600">16%</span>
                </div>
             </div>
          </div>

          <div className="p-8 rounded-[3rem] border border-emerald-100 shadow-xl bg-[#064e3b] text-white relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-1000" />
             <div className="relative z-10 flex flex-col h-full justify-between gap-6">
                <div className="flex items-center justify-between">
                   <div className="p-3 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                      <Rocket size={20} className="text-emerald-400" />
                   </div>
                   <div className="px-3 py-1 bg-emerald-400 text-[9px] font-black text-emerald-950 rounded-full uppercase tracking-widest">IMPACT CARD</div>
                </div>
                <div className="space-y-2">
                   <p className="text-[10px] font-black text-emerald-400 uppercase tracking-[0.3em]">PRIMARY TARGET</p>
                   <h3 className="text-2xl font-black leading-[1.1] tracking-tight truncate">{user?.goal || 'সাম্রাজ্য গড়ে তোলো'}</h3>
                </div>
                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                   <div className="flex items-center gap-2">
                      <Heart size={14} className="text-rose-400 fill-rose-400" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-emerald-100">STAY DISCIPLINED</span>
                   </div>
                   <Link to="/milestones" className="text-[10px] font-black px-3 py-2 bg-white text-emerald-950 rounded-xl hover:bg-emerald-50 transition-colors uppercase tracking-widest">
                      VIEW GOAL
                   </Link>
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 🚀 Active Modules Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Study Portal */}
        <div className="p-8 md:p-10 rounded-[3rem] border border-emerald-100 shadow-sm bg-white space-y-8 group transition-all">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h3 className="text-xl font-black text-emerald-950">স্টাডি পোর্টাল</h3>
               <p className="text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">অর্জিত জ্ঞান ও প্রজ্ঞা</p>
            </div>
            <Link to="/study" className="p-4 bg-emerald-50 rounded-[2rem] text-emerald-600 hover:scale-105 transition-transform">
               <BookOpen size={24} />
            </Link>
          </div>
          
          <div className="p-6 rounded-[2.5rem] bg-emerald-50/50 border border-emerald-100 flex items-center gap-6">
             <div className="w-20 h-20 rounded-[1.8rem] bg-white shadow-lg flex items-center justify-center text-emerald-500 border border-emerald-50 group-hover:rotate-3 transition-transform">
                <Brain size={32} />
             </div>
             <div className="flex-1 space-y-2">
                <div>
                   <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">CURRENT TRACK</p>
                   <p className="text-xl font-black text-emerald-950 leading-tight">{studySubjects[0]?.name || 'কোনো মডিউল নেই'}</p>
                </div>
                <div className="flex items-center gap-4">
                   <div className="flex -space-x-2">
                      {[1,2,3].map(i => <div key={i} className="w-6 h-6 rounded-full border-2 border-white bg-emerald-100" />)}
                   </div>
                   <span className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">+5 EXPERTS ACTIVE</span>
                </div>
             </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="p-5 rounded-[2rem] bg-emerald-50/30 border border-emerald-100/30 text-center">
                <p className="text-[9px] font-black text-emerald-900/30 uppercase mb-1">COMPLETED TOPICS</p>
                <p className="text-2xl font-black text-emerald-950">{studySubjects[0]?.topics?.filter(t => t.completed).length || 0}</p>
             </div>
             <div className="p-5 rounded-[2rem] bg-emerald-50/30 border border-emerald-100/30 text-center">
                <p className="text-[9px] font-black text-emerald-900/30 uppercase mb-1">TOTAL XP EARNED</p>
                <p className="text-2xl font-black text-emerald-950">+840</p>
             </div>
          </div>
        </div>

        {/* Action Feed / Battles */}
        <div className="p-8 md:p-10 rounded-[3rem] border border-emerald-100 shadow-sm bg-white space-y-8">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h3 className="text-xl font-black text-orange-950">অ্যাকশন সেন্টার</h3>
               <p className="text-[10px] font-black text-orange-900/30 uppercase tracking-widest">আজকের যুদ্ধগুলো</p>
            </div>
            <Link to="/habits" className="p-4 bg-orange-50 rounded-[2rem] text-orange-600 hover:scale-105 transition-transform">
               <Swords size={24} />
            </Link>
          </div>

          <div className="space-y-3">
             {todayHabits.length > 0 ? (
                todayHabits.slice(0, 3).map((h, i) => (
                   <div key={i} className="flex items-center justify-between p-4 rounded-[1.8rem] bg-gray-50/50 border border-gray-100 group hover:bg-orange-50 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                         <div className={`p-3 rounded-2xl ${h.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-gray-400 shadow-sm'} transition-colors`}>
                            <Zap size={18} fill={h.completed ? "currentColor" : "none"} />
                         </div>
                         <div>
                            <p className="text-sm font-black text-emerald-950">{h.name}</p>
                            <p className="text-[9px] font-black text-orange-400/60 uppercase tracking-widest">{h.completed ? 'BATTLE WON' : 'PENDING'}</p>
                         </div>
                      </div>
                      <div className={`w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all ${h.completed ? 'bg-emerald-500 border-emerald-500' : 'border-gray-200'}`}>
                         {h.completed && <ListChecks size={14} className="text-white" />}
                      </div>
                   </div>
                ))
             ) : (
                <div className="py-12 flex flex-col items-center justify-center text-center opacity-30 italic">
                   <Shield size={48} className="mb-4" />
                   <p className="text-sm">কোনো যুদ্ধ নির্ধারিত নেই</p>
                </div>
             )}
          </div>

          <Link to="/habits" className="block w-full text-center py-4 rounded-[1.8rem] border-2 border-dashed border-orange-100 text-orange-400 text-xs font-black uppercase tracking-widest hover:bg-orange-50 transition-all">
             ম্যানেজ ব্যাটল লগ
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Dashboard;
