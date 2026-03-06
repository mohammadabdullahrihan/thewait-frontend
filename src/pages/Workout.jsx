import { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Flame, 
  Plus, 
  X, 
  Timer, 
  Loader2, 
  ArrowRight,
  Accessibility,
  Trophy,
  Flower2,
  Calendar,
  Zap,
  TrendingUp,
  Circle,
  Award,
  Trash2,
  Info,
  CheckCircle2,
  Layout,
  Clock
} from 'lucide-react';
import { workoutAPI, analyticsAPI } from '../utils/api';
import { todayStr } from '../utils/helpers';
import { format, addDays, parseISO, subDays } from 'date-fns';
import toast from 'react-hot-toast';
import { ChartSkeleton } from '../components/Common/SkeletonLoader';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const WORKOUT_TYPES = [
  { type: 'Cardio', icon: <Activity size={20} />, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
  { type: 'Calisthenics', icon: <Accessibility size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  { type: 'Core', icon: <Flame size={20} />, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-100' },
  { type: 'Strength', icon: <Dumbbell size={20} />, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  { type: 'Yoga', icon: <Flower2 size={20} />, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-100' },
  { type: 'Sports', icon: <Trophy size={20} />, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
];

const DEFAULT_EXERCISES = {
  Cardio: [{ name: 'Running', duration: 1800 }],
  Calisthenics: [{ name: 'Pushups', sets: 3, reps: 20 }, { name: 'Pullups', sets: 3, reps: 10 }],
  Core: [{ name: 'Plank', duration: 60 }, { name: 'Crunches', sets: 3, reps: 30 }],
  Strength: [{ name: 'Squats', sets: 3, reps: 15 }],
  Yoga: [{ name: 'Sun Salutation', sets: 3 }],
  Sports: [{ name: 'Football/Practice', duration: 1800 }],
};

const Workout = () => {
  const [date, setDate] = useState(todayStr());
  const [workouts, setWorkouts] = useState([]);
  const [history, setHistory] = useState([]);
  const [stats, setStats] = useState(null);
  const [muscleStats, setMuscleStats] = useState([]);
  const [selectedType, setSelectedType] = useState('Calisthenics');
  const [muscleGroup, setMuscleGroup] = useState('None');
  const [exercises, setExercises] = useState(DEFAULT_EXERCISES['Calisthenics']);
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(true);
  const [logging, setLogging] = useState(false);
  const [restTimer, setRestTimer] = useState(0);

  const MUSCLE_GROUPS = ['Chest', 'Back', 'Legs', 'Shoulders', 'Arms', 'Core', 'Full Body', 'None'];

  useEffect(() => {
    let interval;
    if (restTimer > 0) {
      interval = setInterval(() => setRestTimer(t => t - 1), 1000);
    } else if (restTimer === 0 && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [restTimer]);

  const startRestTimer = (seconds = 60) => setRestTimer(seconds);

  const fetchData = async (d) => {
    try {
      const [workoutRes, historyRes, analyticsRes, muscleRes] = await Promise.all([
        workoutAPI.get(d),
        workoutAPI.history(30),
        analyticsAPI.getDashboard(),
        workoutAPI.getMuscleStats()
      ]);
      setWorkouts(workoutRes.data.workouts || []);
      setHistory(historyRes.data.workouts || []);
      setStats(analyticsRes.data.stats);
      setMuscleStats(muscleRes.data.muscleStats || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(date);
  }, [date]);

  const changeDate = (delta) => {
    const d = addDays(parseISO(date), delta);
    setDate(format(d, 'yyyy-MM-dd'));
  };

  const selectType = (type) => {
    setSelectedType(type);
    setExercises(DEFAULT_EXERCISES[type] || [{ name: '', sets: 3, reps: 10 }]);
  };

  const addExercise = () => setExercises([...exercises, { name: '', sets: 3, reps: 10 }]);
  const updateExercise = (i, field, val) => {
    const updated = [...exercises];
    updated[i] = { ...updated[i], [field]: val };
    setExercises(updated);
  };
  const removeExercise = (i) => setExercises(exercises.filter((_, idx) => idx !== i));

  const logWorkout = async () => {
    setLogging(true);
    try {
      const res = await workoutAPI.log({ date, type: selectedType, muscleGroup, exercises, totalDuration: duration, notes });
      setWorkouts([...workouts, res.data.workout]);
      toast.success('ওয়ার্কআউট লগ করা হয়েছে! 🔥', {
        icon: '💪',
        style: { borderRadius: '15px', background: '#064e3b', color: '#fff', fontWeight: 'bold' }
      });
      setNotes('');
      fetchData(date);
    } catch (e) { 
      toast.error('লগ করা যায়নি'); 
    } finally { 
      setLogging(false); 
    }
  };

  const deleteWorkout = async (id) => {
    try {
      await workoutAPI.delete(id);
      setWorkouts(workouts.filter(w => w._id !== id));
      toast.success('মুছে ফেলা হয়েছে');
      fetchData(date);
    } catch (e) { toast.error('ডিলিট করা যায়নি'); }
  };

  // Chart Data preparation
  const getChartData = () => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = format(subDays(new Date(), i), 'yyyy-MM-dd');
      const dayWorkouts = history.filter(w => w.date === d);
      const totalMins = dayWorkouts.reduce((sum, w) => sum + w.totalDuration, 0);
      days.push({ name: format(subDays(new Date(), i), 'EEE'), mins: totalMins });
    }
    return days;
  };

  const chartData = getChartData();

  if (loading && history.length === 0) return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  );

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-24">
      
      {/* 🚀 Header: Ultra Premium Warrior Fitness Command */}
      <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-1 shadow-sm border border-emerald-100 bg-white group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-60 group-hover:scale-125 transition-transform duration-1000" />
        
        <div className="relative px-6 py-8 md:px-8 md:py-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8 md:gap-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-rose-500 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-rose-500/20">
                WARRIOR STRENGTH
              </span>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 rounded-full uppercase tracking-widest">
                ACTIVE RECOVERY
              </span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-emerald-950">
                ব্যাটল <span className="bg-gradient-to-r from-rose-600 to-orange-500 bg-clip-text text-transparent">ট্রেনিং</span>
              </h1>
              <p className="text-emerald-950/40 font-bold text-xs md:text-sm">শক্তি আর শৃঙ্খলাই তোমার প্রধান অস্ত্র</p>
            </div>

            <div className="flex items-center gap-4 md:gap-6 pt-2">
               <div className="flex items-center gap-2 md:gap-3">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 shadow-sm border border-rose-100">
                    <Dumbbell size={20} className="md:w-6 md:h-6" />
                 </div>
                 <div>
                    <div className="text-xl md:text-2xl font-black text-emerald-950 leading-none">{stats?.totalWorkouts || 0}</div>
                    <p className="text-[8px] md:text-[9px] font-black text-rose-500 uppercase tracking-widest mt-1">TOTAL LOGS</p>
                 </div>
               </div>
               <div className="w-px h-8 md:h-10 bg-emerald-100" />
               <div className="flex items-center gap-2 md:gap-3">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-orange-50 flex items-center justify-center text-orange-500 shadow-sm border border-orange-100">
                    <Flame size={20} className="md:w-6 md:h-6" fill="currentColor" />
                 </div>
                 <div>
                    <div className="text-xl md:text-2xl font-black text-emerald-950 leading-none">{(history.reduce((a,b)=>a+b.totalDuration, 0)).toFixed(0)}m</div>
                    <p className="text-[8px] md:text-[9px] font-black text-orange-500 uppercase tracking-widest mt-1">TOTAL MINS</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-rose-950 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] text-white space-y-4 min-w-full xl:min-w-[280px] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Trophy size={64} className="md:w-20 md:h-20" strokeWidth={1} />
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                   <Zap size={18} className="text-orange-400 md:w-5 md:h-5" />
                </div>
                <div>
                   <p className="text-[9px] md:text-[10px] font-black text-rose-400 uppercase tracking-widest">FITNESS STATUS</p>
                   <h3 className="text-base md:text-lg font-black">{stats?.totalWorkouts > 10 ? 'Elite Athlete' : 'Recruit'}</h3>
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase text-rose-400">
                   <span>Power Level</span>
                   <span>{Math.min(100, (stats?.totalWorkouts || 0) * 5)}%</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.5)]" style={{ width: `${Math.min(100, (stats?.totalWorkouts || 0) * 5)}%` }} />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 📅 Date Navigation */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 md:gap-3 bg-white p-1.5 md:p-2 rounded-[2rem] border border-emerald-50 shadow-sm w-full md:w-max">
           <button onClick={() => changeDate(-1)} className="p-3 md:p-4 rounded-2xl hover:bg-emerald-50 text-emerald-600 transition-all flex-shrink-0"><ChevronLeft size={20} /></button>
           <div className="flex-1 text-center min-w-0">
              <p className="text-[8px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none mb-1">SESSION DATE</p>
              <p className="text-xs md:text-sm font-black text-emerald-950 truncate">
                 {format(parseISO(date), 'EEEE, dd MMM')}
                 {date === todayStr() && <span className="ml-1 md:ml-2 text-emerald-500 text-[8px] md:text-[10px] uppercase whitespace-nowrap">● আজ</span>}
              </p>
           </div>
           <button 
             onClick={() => changeDate(1)} 
             disabled={date === todayStr()}
             className="p-3 md:p-4 rounded-2xl hover:bg-emerald-50 text-emerald-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent flex-shrink-0"
           ><ChevronRight size={20} /></button>
        </div>

        <div className="flex items-center gap-3 md:gap-4 bg-white px-5 md:px-6 py-3 md:py-4 rounded-[1.8rem] md:rounded-[2rem] border border-emerald-50 shadow-sm w-full md:w-auto justify-center">
           <Activity size={16} className="text-emerald-400" />
           <p className="text-[10px] md:text-xs font-black text-emerald-950 uppercase tracking-widest">আজকের রেকর্ড: <span className="text-emerald-500">{workouts.length} সেশন</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* 📋 Left: Workout Logging Hub */}
        <div className="xl:col-span-12 lg:col-span-12 grid grid-cols-1 lg:grid-cols-2 gap-8">
           
           {/* Section: Log Form */}
           <div className="p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-white border border-emerald-100 shadow-sm space-y-6 md:space-y-8">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-black text-emerald-950 tracking-tight">নতুন সেশন লগ</h3>
                    <p className="text-[9px] md:text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">অনুশীলনের বিবরণ দিন</p>
                 </div>
                 <div className="p-3 md:p-4 bg-rose-50 rounded-xl md:rounded-2xl text-rose-500 border border-rose-100 shadow-inner">
                    <Plus size={20} className="md:w-6 md:h-6" />
                 </div>
              </div>
              {/* Options Grid */}
              <div className="space-y-4">
                 <h4 className="text-[9px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">WORKOUT TYPE</h4>
                 <div className="grid grid-cols-3 gap-2 md:gap-3">
                    {WORKOUT_TYPES.map((t) => (
                       <button 
                         key={t.type}
                         onClick={() => selectType(t.type)}
                         className={`p-3 md:p-4 rounded-2xl md:rounded-[2rem] border transition-all flex flex-col items-center gap-2 group ${selectedType === t.type ? 'bg-emerald-950 border-emerald-950 text-white shadow-xl scale-[1.05]' : 'bg-white border-emerald-50 text-emerald-900/40 hover:border-emerald-200'}`}
                       >
                          <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all ${selectedType === t.type ? 'bg-white/10' : `${t.bg} ${t.color}`}`}>
                             <div className="md:scale-100 scale-75">
                                {t.icon}
                             </div>
                          </div>
                          <span className="text-[8px] md:text-[10px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">{t.type}</span>
                       </button>
                    ))}
                 </div>
              </div>

              <div className="space-y-4">
                 <h4 className="text-[9px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">PRIMARY MUSCLE GROUP</h4>
                 <div className="flex flex-wrap gap-2">
                    {MUSCLE_GROUPS.map(mg => (
                       <button
                         key={mg}
                         onClick={() => setMuscleGroup(mg)}
                         className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                           muscleGroup === mg 
                             ? 'bg-rose-600 text-white border-rose-600 shadow-md' 
                             : 'bg-white text-emerald-900/60 border-emerald-100 hover:border-emerald-300 hover:bg-emerald-50'
                         }`}
                       >
                         {mg}
                       </button>
                    ))}
                 </div>
              </div>

              {/* Exercises Management */}
              <div className="space-y-4">
                 <h4 className="text-[9px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">EXERCISES</h4>
                 <div className="space-y-3">
                    {exercises.map((ex, i) => (
                       <div key={i} className="flex flex-col md:flex-row gap-3 p-4 md:p-5 bg-emerald-50/50 rounded-2xl md:rounded-[2.5rem] border border-emerald-100 relative">
                          <input 
                            type="text" 
                            placeholder="Exercise Name" 
                            className="flex-1 bg-white rounded-xl md:rounded-2xl px-4 md:px-5 py-3 text-xs md:text-sm font-bold focus:outline-none border border-emerald-100"
                            value={ex.name} 
                            onChange={e => updateExercise(i, 'name', e.target.value)} 
                          />
                          <div className="flex gap-2">
                             <input 
                               type="number" 
                               placeholder="Sets" 
                               className="flex-1 md:w-20 bg-white rounded-xl md:rounded-2xl px-3 py-3 text-xs md:text-sm font-bold text-center border border-emerald-100 min-w-0"
                               value={ex.sets || ''} 
                               onChange={e => updateExercise(i, 'sets', +e.target.value)} 
                             />
                             <input 
                               type="number" 
                               placeholder="Reps" 
                               className="flex-1 md:w-20 bg-white rounded-xl md:rounded-2xl px-3 py-3 text-xs md:text-sm font-bold text-center border border-emerald-100 min-w-0"
                               value={ex.reps || ''} 
                               onChange={e => updateExercise(i, 'reps', +e.target.value)} 
                             />
                             <button 
                               onClick={() => removeExercise(i)}
                               className="p-3 bg-white text-rose-500 rounded-xl md:rounded-2xl hover:bg-rose-50 transition-all border border-rose-100 shrink-0"
                             >
                                <X size={16} />
                             </button>
                          </div>
                       </div>
                    ))}
                 </div>
                 <button 
                   onClick={addExercise}
                   className="w-full py-4 rounded-xl md:rounded-[1.8rem] border-2 border-dashed border-emerald-100 text-emerald-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                 >
                    <Plus size={14} /> ADD EXERCISE
                 </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                 <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">DURATION (MINS)</label>
                    <div className="relative">
                       <input 
                         type="number" 
                         className="w-full bg-emerald-50/50 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-xs md:text-sm font-black text-emerald-950" 
                         value={duration} 
                         onChange={e => setDuration(+e.target.value)} 
                       />
                       <Clock size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-emerald-200" />
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[9px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">NOTES (OPTIONAL)</label>
                    <input 
                      type="text" 
                      placeholder="How do you feel?" 
                      className="w-full bg-emerald-50/50 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-rose-500/20 text-xs md:text-sm font-black text-emerald-950" 
                      value={notes} 
                      onChange={e => setNotes(e.target.value)} 
                    />
                 </div>
              </div>

              <button 
                onClick={logWorkout} 
                disabled={logging}
                className="w-full py-5 md:py-6 bg-rose-600 text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-rose-700 shadow-2xl shadow-rose-600/30 transition-all flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                {logging ? <Loader2 size={18} className="animate-spin md:w-6 md:h-6" /> : <><CheckCircle2 size={18} className="md:w-6 md:h-6" /> সেশন কমপ্লিট করো</>}
              </button>
           </div>

           {/* Section: Real Charts & History */}
           <div className="space-y-6 md:space-y-8">
              
              {/* Performance Curve */}
              <div className="p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-emerald-100 shadow-sm bg-white space-y-6 md:space-y-8">
                 <div className="flex items-center justify-between">
                    <div className="space-y-1">
                       <h3 className="text-xl md:text-2xl font-black text-emerald-950 tracking-tight">ট্রেনিং ভলিউম</h3>
                       <p className="text-[9px] md:text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">গত ৭ দিনের রেকর্ড</p>
                    </div>
                    <div className="p-3 md:p-4 bg-orange-50 rounded-xl md:rounded-2xl text-orange-500 border border-orange-100">
                       <TrendingUp size={20} className="md:w-6 md:h-6" />
                    </div>
                 </div>

                 <div className="h-[200px] md:h-[240px] w-full pt-4">
                    <ResponsiveContainer width="100%" height="100%">
                       <AreaChart data={chartData}>
                          <defs>
                             <linearGradient id="workoutGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                             </linearGradient>
                          </defs>
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                          <YAxis hide />
                          <Tooltip 
                            content={({ active, payload }) => active && payload?.[0] ? (
                              <div className="bg-white/95 backdrop-blur-md border border-rose-100 p-3 rounded-2xl shadow-xl">
                                 <p className="text-[9px] font-black text-rose-900/30 uppercase mb-1">{payload[0].payload.name}</p>
                                 <p className="text-sm font-black text-emerald-950">{payload[0].value} <span className="text-rose-500">Mins</span></p>
                              </div>
                            ) : null}
                          />
                          <Area type="monotone" dataKey="mins" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#workoutGrad)" dot={{ r: 3, fill: '#fff', stroke: '#f43f5e', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                       </AreaChart>
                    </ResponsiveContainer>
                 </div>
              </div>

               {/* Muscle Focus Chart & Rest Timer */}
               <div className="space-y-6 md:space-y-8">
                  <div className="p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] border border-emerald-100 shadow-sm bg-white space-y-6">
                     <div className="flex justify-between items-center">
                        <div className="space-y-1">
                           <h3 className="text-lg md:text-xl font-black text-emerald-950 tracking-tight">মাসল ফোকাস (৭ দিন)</h3>
                           <p className="text-[9px] md:text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">কিভাবে পেশী কাজ করছে</p>
                        </div>
                     </div>
                     <div className="flex flex-col gap-4">
                        {muscleStats.length > 0 ? (
                           muscleStats.filter(m => m.group !== 'None').map(m => (
                              <div key={m.group} className="space-y-2">
                                 <div className="flex justify-between text-xs font-black text-emerald-950">
                                    <span>{m.group}</span>
                                    <span className="text-rose-500">{m.sessions} Sessions</span>
                                 </div>
                                 <div className="h-2.5 w-full bg-rose-50 rounded-full overflow-hidden">
                                    <div 
                                      className="h-full bg-rose-500 rounded-full shadow-[0_0_10px_rgba(244,63,94,0.3)] transition-all duration-1000" 
                                      style={{ width: `${Math.min(100, (m.sessions / Math.max(...muscleStats.map(x=>x.sessions))) * 100)}%` }} 
                                    />
                                 </div>
                              </div>
                           ))
                        ) : (
                           <p className="text-xs text-emerald-900/40 italic text-center py-6">এখনো নির্দিষ্ট কোনো মাসল টার্গেট করা হয়নি</p>
                        )}
                     </div>
                  </div>

                  {/* Rest Timer Widget */}
                  <div className="p-6 md:p-8 rounded-[2.5rem] bg-indigo-950 text-white flex flex-col items-center gap-4 text-center relative overflow-hidden shadow-2xl">
                     <div className="absolute top-0 right-0 p-4 opacity-10"><Timer size={80} /></div>
                     <p className="text-[10px] font-black uppercase tracking-widest text-indigo-400">REST TIMER</p>
                     {restTimer > 0 ? (
                        <>
                           <h2 className="text-5xl md:text-6xl font-black text-white tracking-tighter">{Math.floor(restTimer/60)}:{(restTimer%60).toString().padStart(2, '0')}</h2>
                           <button onClick={() => setRestTimer(0)} className="px-5 py-2.5 mt-2 bg-rose-500/20 text-rose-300 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-rose-500 hover:text-white transition-all active:scale-95 border border-rose-500/30">Stop Timer</button>
                        </>
                     ) : (
                        <div className="flex gap-2 w-full max-w-[240px]">
                           <button onClick={() => startRestTimer(30)} className="flex-1 py-3.5 bg-white/5 rounded-xl text-xs font-black hover:bg-white/10 transition-all active:scale-95 border border-white/10 text-indigo-200">30s</button>
                           <button onClick={() => startRestTimer(60)} className="flex-1 py-3.5 bg-white/5 rounded-xl text-xs font-black hover:bg-white/10 transition-all active:scale-95 border border-white/10 text-indigo-200">60s</button>
                           <button onClick={() => startRestTimer(90)} className="flex-1 py-3.5 bg-white/5 rounded-xl text-xs font-black hover:bg-white/10 transition-all active:scale-95 border border-white/10 text-indigo-200">90s</button>
                        </div>
                     )}
                     <p className="text-[8px] md:text-[9px] font-bold text-indigo-300 mt-2">সেটের মাঝে পর্যাপ্ত রেস্ট নিন</p>
                  </div>
               </div>

              {/* Today's Stats Cards */}
              <div className="grid grid-cols-2 gap-3 md:gap-4">
                 <div className="p-6 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] bg-indigo-950 text-white space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 md:p-4 opacity-10"><Zap size={32} className="md:w-10 md:h-10" /></div>
                    <p className="text-[8px] md:text-[10px] font-black text-indigo-400 uppercase tracking-widest">POWER SCORE</p>
                    <h4 className="text-2xl md:text-3xl font-black">{workouts.length * 150}</h4>
                    <p className="text-[7px] md:text-[8px] font-bold text-white/40 uppercase">POINTS TODAY</p>
                 </div>
                 <div className="p-6 md:p-8 rounded-[1.8rem] md:rounded-[2.5rem] bg-emerald-950 text-white space-y-2 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-3 md:p-4 opacity-10"><Award size={32} className="md:w-10 md:h-10" /></div>
                    <p className="text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest">RANK UP</p>
                    <h4 className="text-2xl md:text-3xl font-black">+{stats?.totalWorkouts}</h4>
                    <p className="text-[7px] md:text-[8px] font-bold text-white/40 uppercase">LIFETIME BATTLES</p>
                 </div>
              </div>

           </div>
        </div>

        {/* 📋 Lower: Historical Logs Feed */}
        <div className="xl:col-span-12 space-y-6">
           <div className="flex items-center justify-between px-2 md:px-4">
              <h3 className="text-lg md:text-xl font-black text-emerald-950 tracking-tight">অনুশীলনের লগ</h3>
              <div className="flex items-center gap-2 text-[8px] md:text-[10px] font-black text-emerald-900/30 uppercase tracking-[0.2em]">
                 <Layout size={12} className="md:w-3.5 md:h-3.5" /> <span className="hidden sm:inline">FILTER BY TYPE</span>
              </div>
           </div>

           <div className="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-6">
              {workouts.length > 0 ? (
                workouts.map(w => {
                  const typeMeta = WORKOUT_TYPES.find(t => t.type === w.type) || WORKOUT_TYPES[0];
                  return (
                    <div key={w._id} className="p-4 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-white border border-emerald-50 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
                       <div className="flex flex-col sm:flex-row justify-between items-start mb-4 md:mb-6 gap-3">
                          <div className="flex items-center gap-3 md:gap-4">
                             <div className={`p-2.5 md:p-4 rounded-xl md:rounded-2xl ${typeMeta.bg} ${typeMeta.color} border ${typeMeta.border} shadow-inner`}>
                                <div className="md:scale-100 scale-75">
                                   {typeMeta.icon}
                                </div>
                             </div>
                             <div className="min-w-0">
                                <h4 className="text-sm md:text-lg font-black text-emerald-950 truncate tracking-tight">{w.type}</h4>
                                <div className="flex items-center gap-1.5 text-[8px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest">
                                   <Clock size={10} /> {w.totalDuration}m
                                </div>
                             </div>
                          </div>
                          <button 
                            onClick={() => deleteWorkout(w._id)}
                            className="absolute top-4 right-4 p-2 md:p-3 bg-gray-50 text-gray-300 rounded-xl md:rounded-2xl hover:bg-rose-50 hover:text-rose-500 transition-all opacity-0 group-hover:opacity-100 shrink-0"
                          >
                             <Trash2 size={14} className="md:w-4 md:h-4" />
                          </button>
                       </div>

                       <div className="space-y-2 md:space-y-3">
                          {w.exercises?.slice(0, 3).map((ex, i) => (
                             <div key={i} className="flex items-center justify-between p-2.5 md:p-4 rounded-xl md:rounded-2xl bg-gray-50/50 border border-gray-100">
                                <div className="flex items-center gap-2 md:gap-3 min-w-0">
                                   <div className="w-1 md:w-1.5 h-1 md:h-1.5 rounded-full bg-emerald-400 shrink-0" />
                                   <span className="text-[10px] md:text-xs font-black text-emerald-950 truncate">{ex.name}</span>
                                </div>
                                <span className="text-[7px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest shrink-0 ml-1">
                                   {ex.sets && ex.reps ? `${ex.sets}×${ex.reps}` : `${Math.floor(ex.duration / 60)}m`}
                                </span>
                             </div>
                          ))}
                          {w.exercises?.length > 3 && (
                             <p className="text-[8px] font-bold text-center text-emerald-900/20 uppercase tracking-widest">+{w.exercises.length - 3} MORE</p>
                          )}
                       </div>

                       {w.notes && (
                         <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-xl md:rounded-2xl bg-rose-50/30 border border-rose-100 italic text-[9px] md:text-xs text-rose-700/60 leading-relaxed relative">
                            <Info size={12} className="absolute -top-1 -left-1 text-rose-300 bg-white rounded-full md:w-3.5 md:h-3.5" />
                            <span className="line-clamp-2">"{w.notes}"</span>
                         </div>
                       )}
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full py-12 md:py-24 flex flex-col items-center justify-center text-center space-y-4 bg-emerald-50/10 rounded-[2.5rem] md:rounded-[4rem] border-2 border-dashed border-emerald-100/50">
                    <Accessibility size={48} md:size={64} strokeWidth={1} className="text-emerald-100" />
                    <p className="text-[10px] md:text-sm font-black text-emerald-900/20 uppercase tracking-[0.3em]">অনুশীলনের কোনো রেকর্ড নেই</p>
                </div>
              )}
           </div>
        </div>

      </div>

    </div>
  );
};

export default Workout;
