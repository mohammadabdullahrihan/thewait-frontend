import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RefreshCw, 
  Check, 
  ClipboardList, 
  BarChart3, 
  Timer, 
  GraduationCap, 
  Calculator, 
  FlaskConical, 
  Globe, 
  PenTool,
  Sparkles,
  Plus,
  Loader2,
  X,
  Target,
  Zap,
  TrendingUp,
  Brain,
  History,
  Award,
  Circle,
  ArrowRight,
  ShieldCheck,
  Rocket,
  Flame,
  Layout
} from 'lucide-react';
import { studyAPI } from '../utils/api';
import { todayStr } from '../utils/helpers';
import toast from 'react-hot-toast';
import { ChartSkeleton } from '../components/Common/SkeletonLoader';
import FocusMusicPlayer from '../components/Study/FocusMusicPlayer';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { format, subDays, parseISO } from 'date-fns';
import { motion, AnimatePresence } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const SUBJECT_META = {
  Math: { icon: <Calculator size={20} />, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  Science: { icon: <FlaskConical size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  'Social Studies': { icon: <Globe size={20} />, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
  'Language Arts': { icon: <PenTool size={20} />, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
  IELTS: { icon: <GraduationCap size={20} />, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
  Other: { icon: <BookOpen size={20} />, color: 'text-slate-500', bg: 'bg-slate-50', border: 'border-slate-100' }
};

const POMODORO_DURATIONS = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };

const Study = () => {
  const [allProgress, setAllProgress] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pomodoro State
  const [pomMode, setPomMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATIONS.work);
  const [pomRunning, setPomRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [pomTopic, setPomTopic] = useState('');
  const intervalRef = useRef(null);

  // Forms
  const [scoreForm, setScoreForm] = useState({ testName: '', score: '', maxScore: '100', notes: '' });
  const [topicForm, setTopicForm] = useState('');
  const [showTopicAdd, setShowTopicAdd] = useState(false);
  const [showScoreAdd, setShowScoreAdd] = useState(false);

  const fetchAllData = async () => {
    try {
      const res = await studyAPI.getAll();
      setAllProgress(res.data.progress || []);
      
      // If none selected, default to the first one or null
      if (!selected && res.data.progress?.length > 0) {
        const firstSub = res.data.progress[0].subject;
        setSelected(firstSub);
        setSelectedData(res.data.progress[0]);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  const selectSubject = async (subjectName) => {
    setSelected(subjectName);
    try {
      const res = await studyAPI.get(subjectName);
      setSelectedData(res.data.progress);
    } catch (e) { toast.error('ডেটা লোড করা যায়নি'); }
  };

  // Pomodoro Timer Logic
  useEffect(() => {
    if (pomRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setPomRunning(false);
            if (pomMode === 'work') {
              setSessions(s => s + 1);
              toast.success('পোমোডোরো সেশন শেষ! বিশ্রাম নাও 🔥', {
                icon: '🚀',
                style: { borderRadius: '15px', background: '#064e3b', color: '#fff', fontWeight: 'bold' }
              });
              // Log session
              if (selected) {
                studyAPI.logSession(selected, { duration: 25, topic: pomTopic, date: todayStr() }).then(() => fetchAllData());
              }
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [pomRunning, pomMode, selected, pomTopic]);

  const switchMode = (mode) => {
    setPomMode(mode);
    setPomRunning(false);
    setTimeLeft(POMODORO_DURATIONS[mode]);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const circumference = 2 * Math.PI * 88;
  const totalDuration = POMODORO_DURATIONS[pomMode];
  const strokeDashoffset = circumference * (1 - (totalDuration - timeLeft) / totalDuration);

  const addScore = async () => {
    if (!scoreForm.testName || !scoreForm.score) { toast.error('টেস্টের নাম এবং স্কোর দিন'); return; }
    try {
      const res = await studyAPI.addScore(selected, scoreForm);
      setSelectedData(res.data.progress);
      setScoreForm({ testName: '', score: '', maxScore: '100', notes: '' });
      setShowScoreAdd(false);
      toast.success('স্কোর সংরক্ষিত হয়েছে');
      fetchAllData();
    } catch (e) { toast.error('স্কোর যোগ করা যায়নি'); }
  };

  const addTopic = async () => {
    if (!topicForm.trim()) { toast.error('টপিকের নাম দিন'); return; }
    try {
      const res = await studyAPI.addTopic(selected, { name: topicForm });
      setSelectedData(res.data.progress);
      setTopicForm('');
      setShowTopicAdd(false);
      toast.success('টপিক যোগ হয়েছে');
      fetchAllData();
    } catch (e) { toast.error('টপিক যোগ করা যায়নি'); }
  };

  const toggleTopic = async (topicId, completed) => {
    try {
      const res = await studyAPI.toggleTopic(selected, topicId, !completed);
      setSelectedData(res.data.progress);
      fetchAllData();
      if (!completed) toast.success('+15 Study XP! 🧠', { position: 'bottom-center' });
    } catch (e) { toast.error('আপডেট করা যায়নি'); }
  };

  // Calculate real metrics
  const totalHoursAll = allProgress.reduce((sum, p) => sum + (p.totalHours || 0), 0);
  const mostStudied = allProgress.reduce((prev, curr) => (curr.totalHours > (prev?.totalHours || 0) ? curr : prev), null);
  
  // Aggregate session logs for the last 7 days chart
  const getLast7DaysData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      let mins = 0;
      allProgress.forEach(sub => {
        sub.sessionsLog?.forEach(session => {
          if (session.date === d) mins += session.duration;
        });
      });
      days.push({ name: format(subDays(new Date(), i), 'EEE'), mins });
    }
    return days;
  };

  const chartData = getLast7DaysData();

  if (loading && allProgress.length === 0) return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-24">
      
      {/* 🚀 Header: Ultra Premium Knowledge Command Center */}
      <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-1 shadow-sm border border-emerald-100 bg-white group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-60 group-hover:scale-125 transition-transform duration-1000" />
        
        <div className="relative px-6 py-8 md:px-8 md:py-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8 md:gap-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-emerald-500 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                ACTIVE FOCUS
              </span>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 rounded-full uppercase tracking-widest">
                GED & IELTS PREP
              </span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-emerald-950">
                নলেজ <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">পোর্টাল</span>
              </h1>
              <p className="text-emerald-950/40 font-bold text-xs md:text-sm">শিখতে থাকা মানেই তুমি এগিয়ে আছো</p>
            </div>

            <div className="flex items-center gap-4 md:gap-6 pt-2">
               <div className="flex items-center gap-2 md:gap-3">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-sky-50 flex items-center justify-center text-sky-500 shadow-sm border border-sky-100">
                    <Timer size={20} className="md:w-6 md:h-6" />
                 </div>
                 <div>
                    <div className="text-xl md:text-2xl font-black text-emerald-950 leading-none">{totalHoursAll.toFixed(1)}h</div>
                    <p className="text-[8px] md:text-[9px] font-black text-sky-500 uppercase tracking-widest mt-1">TOTAL STUDY</p>
                 </div>
               </div>
               <div className="w-px h-8 md:h-10 bg-emerald-100" />
               <div className="flex items-center gap-2 md:gap-3">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-purple-50 flex items-center justify-center text-purple-500 shadow-sm border border-purple-100">
                    <Brain size={20} className="md:w-6 md:h-6" />
                 </div>
                 <div>
                    <div className="text-xl md:text-2xl font-black text-emerald-950 leading-none truncate max-w-[80px] md:max-w-none">{mostStudied?.subject || 'N/A'}</div>
                    <p className="text-[8px] md:text-[9px] font-black text-purple-500 uppercase tracking-widest mt-1">PRIMARY FOCUS</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-emerald-950 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] text-white space-y-4 min-w-full xl:min-w-[280px] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Award size={64} className="md:w-20 md:h-20" strokeWidth={1} />
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                   <Zap size={18} className="text-emerald-400 md:w-5 md:h-5" />
                </div>
                <div>
                   <p className="text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest">EXPERT STATUS</p>
                   <h3 className="text-base md:text-lg font-black">{totalHoursAll > 50 ? 'Master Scholar' : 'Initial Explorer'}</h3>
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase text-emerald-400">
                   <span>Next Badge</span>
                   <span>{totalHoursAll.toFixed(0)} / 100h</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: `${Math.min(100, (totalHoursAll/100)*100)}%` }} />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 📊 Section: Focus Zone & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
        
        {/* Pomodoro: The Core Focus Module */}
        <div className="lg:col-span-4 space-y-6">
          <div className="p-8 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-emerald-100 shadow-sm bg-white space-y-6 md:space-y-8 flex flex-col items-center">
             <div className="w-full flex justify-between items-center">
                <h3 className="text-[9px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-[0.3em]">FOCUS ZONE</h3>
                <div className={`px-3 py-1 rounded-full text-[8px] md:text-[9px] font-black uppercase tracking-widest ${pomRunning ? 'bg-orange-100 text-orange-600 animate-pulse' : 'bg-emerald-50 text-emerald-600'}`}>
                   {pomRunning ? 'SESSION ACTIVE' : 'READY TO WORK'}
                </div>
             </div>

             <motion.div 
                className="relative group cursor-pointer"
                animate={timeLeft === 0 && !pomRunning ? { scale: [1, 1.1, 1], filter: ['brightness(1)', 'brightness(1.3)', 'brightness(1)'] } : { scale: 1 }}
                transition={{ duration: 0.6 }}
             >
                <svg className="w-48 h-48 md:w-56 md:h-56 transform -rotate-90">
                   <circle cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-emerald-50 md:hidden" />
                   <circle 
                     cx="96" cy="96" r="86" stroke="currentColor" strokeWidth="10" fill="transparent" 
                     strokeDasharray={2 * Math.PI * 86} 
                     strokeDashoffset={2 * Math.PI * 86 * (1 - (totalDuration - timeLeft) / totalDuration)} 
                     className={`transition-all duration-1000 md:hidden ${pomMode === 'work' ? 'text-emerald-500' : 'text-sky-500'}`} 
                     strokeLinecap="round" 
                   />

                  <circle cx="112" cy="112" r="102" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-emerald-50 hidden md:block" />
                  <circle 
                    cx="112" cy="112" r="102" stroke="currentColor" strokeWidth="12" fill="transparent" 
                    strokeDasharray={2 * Math.PI * 102} 
                    strokeDashoffset={2 * Math.PI * 102 * (1 - (totalDuration - timeLeft) / totalDuration)} 
                    className={`transition-all duration-1000 hidden md:block ${pomMode === 'work' ? 'text-emerald-500 shadow-lg shadow-emerald-500/20' : 'text-sky-500'}`} 
                    strokeLinecap="round" 
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl md:text-5xl font-black text-emerald-950 tracking-tighter leading-none">{formatTime(timeLeft)}</span>
                  <span className="text-[8px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest mt-1">
                     {pomMode === 'work' ? 'পড়াশোনা' : 'বিরতি'}
                  </span>
                </div>
             </motion.div>

             <div className="flex gap-2 w-full">
                {[['work', 'WORK'], ['short', 'SHORT'], ['long', 'LONG']].map(([mode, label]) => (
                   <button 
                     key={mode} 
                     onClick={() => switchMode(mode)}
                     className={`flex-1 py-3 rounded-xl md:rounded-2xl text-[8px] md:text-[9px] font-black tracking-widest transition-all ${pomMode === mode ? 'bg-emerald-950 text-white shadow-xl' : 'bg-emerald-50 text-emerald-900/40 hover:bg-emerald-100'}`}
                   >
                     {label}
                   </button>
                ))}
             </div>

             <div className="flex items-center gap-3 w-full">
                <button 
                  onClick={() => setPomRunning(!pomRunning)}
                  className={`flex-[2] py-4 md:py-5 rounded-[1.8rem] md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest transition-all flex items-center justify-center gap-2 md:gap-3 shadow-xl ${pomRunning ? 'bg-rose-50 text-rose-600 shadow-rose-200/50' : 'bg-emerald-500 text-white shadow-emerald-600/20 hover:scale-105'}`}
                >
                  {pomRunning ? <><Pause size={18} className="md:w-5 md:h-5" fill="currentColor" /> PAUSE</> : <><Play size={18} className="md:w-5 md:h-5" fill="currentColor" /> START FOCUS</>}
                </button>
                <button 
                  onClick={() => { setPomRunning(false); setTimeLeft(POMODORO_DURATIONS[pomMode]); }}
                  className="flex-1 py-4 md:py-5 rounded-[1.8rem] md:rounded-[2rem] bg-gray-50 text-gray-400 hover:bg-gray-100 hover:text-emerald-600 transition-all flex items-center justify-center border border-gray-100"
                >
                  <RefreshCw size={18} className="md:w-5 md:h-5" />
                </button>
             </div>

             <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-black text-emerald-500 uppercase">
                <Zap size={12} className="md:w-3.5 md:h-3.5 fill-current" /> TODAY: {sessions} SESSIONS
             </div>
          </div>
        </div>

        {/* Analytics & Subjects */}
        <div className="lg:col-span-8 space-y-6 md:space-y-8">
           
           <FocusMusicPlayer />

           {/* Productivity Chart */}
           <div className="p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-emerald-100 shadow-sm bg-white space-y-6 md:space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                   <h3 className="text-xl md:text-2xl font-black text-emerald-950 tracking-tight">স্ট্যাডি ইনটেনসিটি</h3>
                   <p className="text-[9px] md:text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">গত ৭ দিনের রেকর্ড</p>
                </div>
                <div className="p-3 md:p-4 bg-sky-50 rounded-xl md:rounded-2xl text-sky-500 border border-sky-100">
                   <TrendingUp size={20} className="md:w-6 md:h-6" />
                </div>
              </div>

              <div className="h-[200px] md:h-[240px] w-full pt-4">
                 <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                       <defs>
                          <linearGradient id="studyGrad" x1="0" y1="0" x2="0" y2="1">
                             <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                             <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                          </linearGradient>
                       </defs>
                       <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                       <YAxis hide />
                       <Tooltip 
                         content={({ active, payload }) => active && payload?.[0] ? (
                           <div className="bg-white/95 backdrop-blur-md border border-emerald-100 p-3 rounded-2xl shadow-xl">
                              <p className="text-[9px] font-black text-emerald-900/30 uppercase mb-1">{payload[0].payload.name}</p>
                              <p className="text-sm font-black text-emerald-950">{payload[0].value} <span className="text-emerald-500">Mins</span></p>
                           </div>
                         ) : null}
                       />
                       <Area type="monotone" dataKey="mins" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#studyGrad)" dot={{ r: 3, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                    </AreaChart>
                 </ResponsiveContainer>
              </div>
           </div>

           {/* Subjects Grid (Updated to 2 columns on mobile) */}
           <motion.div 
             variants={containerVariants}
             initial="hidden"
             animate="show"
             className="grid grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6"
           >
              {Object.keys(SUBJECT_META).filter(k => k !== 'Other').map(sub => {
                const meta = SUBJECT_META[sub];
                const active = selected === sub;
                const progressData = allProgress.find(p => p.subject === sub);
                const completedCount = progressData?.topics?.filter(t => t.completed).length || 0;
                const totalTopics = progressData?.topics?.length || 0;
                const progPerc = totalTopics ? (completedCount / totalTopics) * 100 : 0;

                return (
                  <motion.div 
                    variants={itemVariants}
                    key={sub}
                    onClick={() => selectSubject(sub)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] border transition-all duration-300 cursor-pointer flex flex-col justify-between h-[130px] md:h-[160px] ${active ? 'bg-emerald-950 border-emerald-950 text-white shadow-2xl scale-[1.02]' : 'bg-white border-emerald-50 hover:border-emerald-200'}`}
                  >
                     <div className="flex justify-between items-start">
                        <div className={`p-2.5 md:p-3 rounded-xl md:rounded-2xl ${active ? 'bg-white/10 border border-white/10' : `${meta.bg} ${meta.color} ${meta.border}`} transition-all`}>
                           {active ? <div className="text-white">{meta.icon}</div> : meta.icon}
                        </div>
                        {progPerc > 0 && (
                           <div className={`text-[8px] md:text-[9px] font-black px-1.5 py-0.5 md:px-2 md:py-1 rounded-md md:rounded-lg ${active ? 'bg-emerald-400 text-emerald-950' : 'bg-emerald-50 text-emerald-600'}`}>
                              {progPerc.toFixed(0)}%
                           </div>
                        )}
                     </div>
                     <div className="space-y-1">
                        <p className={`text-[8px] md:text-[10px] font-black uppercase tracking-widest ${active ? 'text-emerald-400' : 'text-emerald-900/30'}`}>{sub}</p>
                        <p className="text-xs md:text-base font-black truncate">{progressData?.totalHours?.toFixed(1) || 0}h Logged</p>
                     </div>
                  </motion.div>
                );
              })}
           </motion.div>
        </div>
      </div>

      {/* 📚 Section: Deep Focus Module - Topics & Scores */}
      {selected && (
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 md:gap-8 items-start">
           
           {/* Module Control */}
           <div className="xl:col-span-12 flex flex-col lg:flex-row items-center justify-between p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] bg-emerald-50 border border-emerald-100 gap-6">
              <div className="flex items-center gap-4 md:gap-6 w-full lg:w-auto">
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-3xl bg-white shadow-sm flex items-center justify-center text-emerald-500 border border-emerald-100 shrink-0">
                    {SUBJECT_META[selected]?.icon || <BookOpen size={24} className="md:w-7 md:h-7" />}
                 </div>
                 <div className="min-w-0">
                    <h2 className="text-xl md:text-3xl font-black text-emerald-950 tracking-tighter truncate">{selected}</h2>
                    <p className="text-[10px] md:text-sm font-bold text-emerald-900/40 uppercase tracking-widest">সিলেবাস ও প্রগ্রেস</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-3 w-full lg:w-auto">
                 <button onClick={() => setShowTopicAdd(!showTopicAdd)} className="flex-1 lg:flex-none px-4 md:px-6 py-3.5 md:py-4 bg-emerald-600 text-white rounded-2xl md:rounded-[1.8rem] font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-2">
                    {showTopicAdd ? <X size={16} /> : <Plus size={16} />}
                    <span className="whitespace-nowrap">{showTopicAdd ? 'বাতিল' : 'নতুন টপিক'}</span>
                 </button>
                 <button onClick={() => setShowScoreAdd(!showScoreAdd)} className="flex-1 lg:flex-none px-4 md:px-6 py-3.5 md:py-4 bg-white text-emerald-950 rounded-2xl md:rounded-[1.8rem] border border-emerald-100 font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-2">
                    {showScoreAdd ? <X size={16} /> : <BarChart3 size={16} />}
                    <span className="whitespace-nowrap">{showScoreAdd ? 'বাতিল' : 'স্কোর কার্ড'}</span>
                 </button>
              </div>
           </div>

           {/* Curriculum List */}
           <div className="xl:col-span-7 space-y-4 md:space-y-6">
              {showTopicAdd && (
                <div className="p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-white border-2 border-dashed border-emerald-200 shadow-sm animate-in slide-in-from-top-4 duration-300">
                   <h4 className="text-[9px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest mb-4 ml-2">ADD NEW STUDY TOPIC</h4>
                   <div className="flex gap-3">
                      <input 
                        type="text" 
                        placeholder="টপিকের নাম..." 
                        className="flex-1 bg-emerald-50/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3.5 md:py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-emerald-950 border border-emerald-50" 
                        value={topicForm} 
                        onChange={e => setTopicForm(e.target.value)} 
                      />
                      <button onClick={addTopic} className="p-4 md:p-5 bg-emerald-500 text-white rounded-xl md:rounded-2xl shadow-lg hover:bg-emerald-600 transition-all">
                         <Check size={18} className="md:w-5 md:h-5" />
                      </button>
                   </div>
                </div>
              )}

              <div className="space-y-3 md:space-y-4">
                 {selectedData?.topics?.length > 0 ? (
                   selectedData.topics.map((topic, i) => (
                     <div key={topic._id || i} className={`p-4 md:p-6 rounded-[2rem] md:rounded-[2.5rem] bg-white border border-emerald-50 shadow-sm flex items-center gap-4 md:gap-6 group transition-all hover:bg-emerald-50/30 ${topic.completed ? 'opacity-50 grayscale' : ''}`}>
                        <div 
                          onClick={() => topic._id && toggleTopic(topic._id, topic.completed)}
                          className={`w-10 h-10 md:w-12 md:h-12 rounded-[1.2rem] md:rounded-2xl border-2 flex items-center justify-center cursor-pointer transition-all shrink-0 ${topic.completed ? 'bg-emerald-500 border-emerald-500 text-white rotate-[360deg]' : 'border-emerald-100 text-transparent hover:border-emerald-400 shadow-sm bg-gray-50/30 font-bold'}`}
                        >
                          <Check size={16} className={`md:w-5 md:h-5 ${topic.completed ? 'scale-100' : 'scale-0'}`} />
                        </div>
                        <div className="flex-1 min-w-0">
                           <p className={`text-sm md:text-base font-black text-emerald-950 truncate ${topic.completed ? 'line-through' : ''}`}>{topic.name}</p>
                           <p className="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest leading-none mt-1">{topic.completed ? 'MODULE FINISHED' : 'PENDING OBJECTIVE'}</p>
                        </div>
                        {!topic.completed && <div className="p-2 bg-emerald-50 text-emerald-500 rounded-xl hidden md:block opacity-0 group-hover:opacity-100 transition-opacity"><ArrowRight size={16} /></div>}
                     </div>
                   ))
                 ) : (
                    <div className="p-12 md:p-20 text-center space-y-4 bg-gray-50/50 rounded-[2.5rem] md:rounded-[4rem] border-2 border-dashed border-gray-100">
                       <Layout size={32} className="mx-auto text-gray-200 md:w-12 md:h-12" />
                       <p className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest">সিলিবাসে কোনো টপিক নেই</p>
                    </div>
                 )}
              </div>
           </div>

           {/* Performance Hub */}
           <div className="xl:col-span-5 space-y-6">
              {showScoreAdd && (
                <div className="p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-white border-2 border-emerald-100 shadow-xl space-y-6 animate-in zoom-in-95 duration-300">
                   <h4 className="text-[9px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest text-center">নতুন টেস্ট স্কোর</h4>
                   <div className="space-y-4">
                      <input type="text" placeholder="টেস্টের নাম" className="w-full bg-emerald-50/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3.5 md:py-4 border border-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-emerald-950" value={scoreForm.testName} onChange={e => setScoreForm({...scoreForm, testName: e.target.value})} />
                      <div className="grid grid-cols-2 gap-3">
                         <input type="number" placeholder="স্কোর" className="w-full bg-emerald-50/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3.5 md:py-4 border border-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-emerald-950" value={scoreForm.score} onChange={e => setScoreForm({...scoreForm, score: e.target.value})} />
                         <input type="number" placeholder="মোট" className="w-full bg-emerald-50/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3.5 md:py-4 border border-emerald-50 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-emerald-950" value={scoreForm.maxScore} onChange={e => setScoreForm({...scoreForm, maxScore: e.target.value})} />
                      </div>
                      <button onClick={addScore} className="w-full py-4 md:py-5 bg-emerald-600 text-white rounded-xl md:rounded-2xl font-black text-[10px] md:text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all">সংরক্ষণ করো</button>
                   </div>
                </div>
              )}

              <div className="p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-emerald-100 bg-white shadow-sm space-y-6 md:space-y-8">
                 <div className="flex justify-between items-center">
                    <h3 className="text-lg md:text-xl font-black text-emerald-950">পারফরম্যান্স</h3>
                    <div className="p-2.5 bg-white border border-emerald-50 rounded-xl text-yellow-500 shadow-sm"><Star size={18} className="md:w-5 md:h-5" fill="currentColor" /></div>
                 </div>

                 <div className="space-y-3 md:space-y-4">
                    {selectedData?.testScores?.length > 0 ? (
                      [...selectedData.testScores].reverse().slice(0, 3).map((s, i) => {
                        const perc = (s.score / s.maxScore) * 100;
                        return (
                          <div key={i} className="p-4 md:p-5 rounded-[1.8rem] md:rounded-3xl bg-emerald-50/30 border border-emerald-100/50 flex items-center justify-between group transition-all">
                             <div className="space-y-0.5 min-w-0">
                                <p className="text-xs md:text-sm font-black text-emerald-950 truncate">{s.testName}</p>
                                <p className="text-[8px] md:text-[9px] font-black text-emerald-400 uppercase tracking-widest">{new Date(s.date).toLocaleDateString('bn-BD')}</p>
                             </div>
                             <div className="text-right shrink-0">
                                <p className={`text-lg md:text-xl font-black leading-none ${perc >= 80 ? 'text-emerald-500' : perc >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>{s.score}/{s.maxScore}</p>
                                <p className="text-[7px] md:text-[8px] font-black text-emerald-900/20 uppercase tracking-widest mt-1">SCORE</p>
                             </div>
                          </div>
                        );
                      })
                    ) : (
                       <div className="py-8 md:py-10 text-center opacity-20 italic">
                          <History size={32} className="mx-auto mb-2 md:w-10 md:h-10" />
                          <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest">কোনো হিস্ট্রি নেই</p>
                       </div>
                    )}
                 </div>

                 <button className="w-full py-4 rounded-xl md:rounded-2xl border-2 border-dashed border-emerald-100 text-emerald-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all">
                    FULL MOCK HISTORY <ChevronRight size={10} className="inline ml-1" />
                 </button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Study;
