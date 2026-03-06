import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Flame, 
  ClipboardList, 
  BookOpen, 
  Dumbbell, 
  Smile, 
  Calendar, 
  Target,
  ArrowUpRight,
  TrendingUp,
  Loader2,
  Trophy,
  Zap,
  Activity,
  Award,
  ChevronRight,
  Map,
  Shield,
  Star,
  Brain,
  History,
  Timer,
  ArrowDownRight
} from 'lucide-react';
import { analyticsAPI } from '../utils/api';
import { 
  BarChart, 
  Bar, 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  CartesianGrid, 
  RadarChart, 
  Radar, 
  PolarGrid, 
  PolarAngleAxis,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import Loader from '../components/Common/Loader';

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
    contentStyle: { 
      backgroundColor: 'rgba(255, 255, 255, 0.9)', 
      backdropFilter: 'blur(10px)',
      border: '1px solid #e2e8f0', 
      borderRadius: '1.5rem', 
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
      padding: '12px 16px'
    },
    itemStyle: { fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' },
    labelStyle: { fontSize: '10px', color: '#64748b', fontWeight: '900', marginBottom: '4px', textTransform: 'uppercase' }
  };

  if (loading) return null;

  const stats = data?.stats || {};
  const charts = data?.charts || {};
  const studyProgress = data?.studyProgress || [];
  const recentWorkouts = data?.recentWorkouts || [];

  // Group heatmap by weeks
  const groupedHeatmap = [];
  if (heatmap.length > 0) {
    for (let i = 0; i < heatmap.length; i += 7) {
      groupedHeatmap.push(heatmap.slice(i, i + 7));
    }
  }

  const productivityScore = Math.round(
    (parseFloat(stats.avgHabitScore) / 7 * 40) + 
    (parseFloat(stats.avgRoutineCompletion) / 100 * 30) + 
    (Math.min(stats.totalStudyHours, 100) / 100 * 30)
  );

  const warriorRank = 
    productivityScore > 90 ? 'Eminent Overlord' :
    productivityScore > 75 ? 'Shadow Warden' :
    productivityScore > 50 ? 'Disciplined Knight' :
    productivityScore > 25 ? 'Steady Aspirant' : 'Wayward Soul';

  const radarData = [
    { category: 'Habits', value: (parseFloat(stats.avgHabitScore) / 7) * 100 },
    { category: 'Routines', value: parseFloat(stats.avgRoutineCompletion) || 0 },
    { category: 'Study', value: Math.min(100, (parseFloat(stats.totalStudyHours) / 50) * 100) },
    { category: 'Workout', value: Math.min(100, (stats.totalWorkouts / 15) * 100) },
    { category: 'Mindset', value: (parseFloat(stats.avgMood) / 10) * 100 },
  ];

  const milestonePie = [
    { name: 'Completed', value: stats.milestones?.completed || 0 },
    { name: 'Active', value: stats.milestones?.active || 0 },
    { name: 'Remaining', value: Math.max(0, (stats.milestones?.total || 0) - (stats.milestones?.completed || 0) - (stats.milestones?.active || 0)) },
  ];

  const PIE_COLORS = ['#10b981', '#3b82f6', '#f1f5f9'];

  return (
    <div className="animate-in fade-in duration-700 space-y-10 pb-24 overflow-x-hidden w-full">
      
      {/* 🏆 Hero: Warrior Status */}
      <div className="relative overflow-hidden rounded-[2.5rem] bg-emerald-950 shadow-2xl">
        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-500 rounded-full blur-[120px] -mr-40 -mt-40 opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[250px] h-[250px] bg-blue-500 rounded-full blur-[120px] -ml-32 -mb-32 opacity-10" />
        
        <div className="relative bg-white/5 backdrop-blur-xl rounded-[2.4rem] p-6 md:p-10 flex flex-col xl:flex-row items-center gap-8">
          
          <div className="relative group flex-shrink-0">
            <div className="w-36 h-36 md:w-48 md:h-48 rounded-full border-[10px] border-white/5 flex items-center justify-center p-2">
               <div className="w-full h-full rounded-full border-[8px] border-emerald-500/20 flex items-center justify-center">
                 <div className="flex flex-col items-center justify-center space-y-1">
                    <span className="text-4xl md:text-5xl font-black text-white">{productivityScore}</span>
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest leading-none">Power Level</span>
                 </div>
               </div>
            </div>
            <div className="absolute inset-0 rounded-full bg-emerald-500/10 blur-2xl" />
          </div>

          <div className="flex-1 space-y-5 text-center xl:text-left min-w-0">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3">
                 <span className="px-4 py-1 bg-emerald-500 rounded-full text-[10px] font-black text-emerald-950 uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-emerald-500/20">
                    <Award size={12} /> WARRIOR RANK
                 </span>
                 <span className="px-4 py-1 border border-white/10 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest">
                    LVL {Math.floor(stats.daysTracked / 10) + 1}
                 </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black text-white tracking-tighter leading-none">
                 {warriorRank}
              </h1>
              <p className="text-emerald-400/60 font-bold text-sm max-w-lg mx-auto xl:mx-0">
                 বিগত ৩০ দিনে তোমার শৃঙ্খলার রিপোর্ট।
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-2">
               {[
                 { label: 'TRACKED', val: stats.daysTracked, sub: 'Days', icon: <History size={14} /> },
                 { label: 'STUDY', val: stats.totalStudyHours, sub: 'Hours', icon: <Timer size={14} /> },
                 { label: 'STREAK', val: Math.round(parseFloat(stats.avgHabitScore)), sub: 'Score', icon: <Flame size={14} /> },
                 { label: 'GROWTH', val: stats.habitTrend, sub: '% Growth', icon: <TrendingUp size={14} />, negative: parseFloat(stats.habitTrend) < 0 }
               ].map((s, i) => (
                 <div key={i} className="bg-white/5 border border-white/5 rounded-2xl p-4 space-y-1">
                    <div className="flex items-center gap-1.5 text-emerald-400/40">
                      {s.icon} <span className="text-[8px] font-black uppercase tracking-widest">{s.label}</span>
                    </div>
                    <div className={`text-xl font-black tracking-tight ${s.negative ? 'text-rose-400' : 'text-white'}`}>
                      {parseFloat(s.val) > 0 && !s.negative ? '+' : ''}{s.val}
                    </div>
                    <p className="text-[8px] font-black text-white/20 uppercase tracking-widest leading-none">{s.sub}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      {/* 📊 Main Analytics Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Habit Intensity (Area Chart) */}
        <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-6 md:p-10 border border-emerald-50 shadow-sm overflow-hidden">
           <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              <div className="space-y-1">
                 <h3 className="text-xl font-black text-emerald-950 tracking-tight">শৃঙ্খলা ইনটেনসিটি</h3>
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">৩ সপ্তাহের রুটিন কমপ্লিশন ট্র্যান্ড</p>
              </div>
              <div className="px-4 py-2 bg-emerald-50 rounded-xl flex items-center gap-2 w-max">
                <div className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="text-[10px] font-black text-emerald-950 uppercase tracking-widest">ROUTINE</span>
              </div>
           </div>

           <div className="h-[240px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                 <AreaChart data={charts.routineTrend}>
                    <defs>
                      <linearGradient id="colorRoutine" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="5 5" stroke="#f1f5f9" vertical={false} />
                    <XAxis 
                       dataKey="date" 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}} 
                       tickFormatter={(str) => str.split('-').slice(1).join('/')}
                    />
                    <YAxis 
                       axisLine={false} 
                       tickLine={false} 
                       tick={{fill: '#94a3b8', fontSize: 10, fontWeight: 700}}
                       domain={[0, 100]}
                       tickFormatter={(val) => `${val}%`}
                       width={36}
                    />
                    <Tooltip {...tooltipStyle} cursor={{ stroke: '#e2e8f0' }} />
                    <Area 
                       type="monotone" 
                       dataKey="completion" 
                       name="কমপ্লিশন"
                       stroke="#059669" 
                       strokeWidth={3}
                       fillOpacity={1} 
                       fill="url(#colorRoutine)" 
                    />
                 </AreaChart>
              </ResponsiveContainer>
           </div>
        </div>

        {/* Radar: Strategic Balance */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-emerald-50 shadow-sm flex flex-col items-center overflow-hidden">
           <div className="w-full space-y-1 mb-6">
              <h3 className="text-xl font-black text-emerald-950 tracking-tight">ব্যালেন্স অডিট</h3>
              <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">৫টি প্রধান ক্যারেক্টারিস্টিকস</p>
           </div>
           
           <div className="w-full h-[260px]">
              <ResponsiveContainer width="100%" height="100%">
                 <RadarChart data={radarData}>
                    <PolarGrid stroke="#f1f5f9" strokeWidth={2} />
                    <PolarAngleAxis dataKey="category" tick={{ fill: '#64748b', fontSize: 9, fontWeight: 800 }} />
                    <Radar 
                       name="Current" 
                       dataKey="value" 
                       stroke="#10b981" 
                       fill="#10b981" 
                       fillOpacity={0.2} 
                       strokeWidth={3} 
                    />
                    <Tooltip {...tooltipStyle} />
                 </RadarChart>
              </ResponsiveContainer>
           </div>

           <div className="mt-4 flex flex-wrap justify-center gap-3">
              {radarData.map((r, i) => (
                <div key={i} className="flex flex-col items-center">
                   <div className="text-[9px] font-black text-emerald-950/20 uppercase tracking-widest mb-0.5">{r.category}</div>
                   <div className="text-sm font-black text-emerald-600">{Math.round(r.value)}%</div>
                </div>
              ))}
           </div>
        </div>

      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        
        {/* Study Map (By Subject) */}
        <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-emerald-50 shadow-sm space-y-8">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <h3 className="text-xl font-black text-emerald-950 tracking-tight">অ্যাকাডেমিক গ্রাফ</h3>
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">বিষয়ভিত্তিক সময় বণ্টন</p>
              </div>
              <div className="w-10 h-10 bg-white border border-emerald-50 rounded-2xl flex items-center justify-center text-emerald-500 shadow-sm">
                 <BookOpen size={20} />
              </div>
           </div>

           <div className="space-y-6">
              {studyProgress.length > 0 ? (
                studyProgress.map((s, i) => (
                  <div key={i} className="space-y-2">
                     <div className="flex items-end justify-between">
                        <div className="space-y-0.5">
                           <h4 className="text-sm font-black text-emerald-950 uppercase tracking-wide">{s.subject}</h4>
                           <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                             {s.totalHours} HRS · {s.completedTopics || 0}/{s.totalTopics || 0} TOPICS
                           </div>
                        </div>
                        <div className="text-xl font-black text-emerald-500">{s.totalTopics ? Math.round((s.completedTopics / s.totalTopics) * 100) : 0}%</div>
                     </div>
                     <div className="h-3 w-full bg-slate-50 rounded-full border border-slate-100 p-0.5 overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all duration-1000"
                          style={{ width: `${s.totalTopics ? (s.completedTopics / s.totalTopics) * 100 : 0}%` }}
                        />
                     </div>
                  </div>
                ))
              ) : (
                <div className="py-16 text-center">
                   <p className="text-sm font-black text-slate-300 uppercase tracking-widest italic">কোনো অ্যাকাডেমিক ডেটা পাওয়া যায়নি</p>
                </div>
              )}
           </div>
        </div>

        {/* Milestone Card */}
        <div className="bg-emerald-950 rounded-[2.5rem] p-6 md:p-10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row items-center gap-8">
            <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
               <Map size={200} />
            </div>

            <div className="relative z-10 w-full md:w-1/2 space-y-6 text-center md:text-left">
               <div className="space-y-1">
                  <h3 className="text-2xl font-black text-white tracking-tight">মাইলস্টোন রিপোর্ট</h3>
                  <p className="text-emerald-400/60 font-bold text-sm">তুমি তোমার স্বপ্নের কত কাছাকাছি?</p>
               </div>

               <div className="space-y-4">
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-[1.5rem] border border-white/5">
                     <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 flex items-center justify-center text-emerald-400 flex-shrink-0">
                        <Target size={24} />
                     </div>
                     <div>
                        <div className="text-xl font-black text-white">{stats.milestones?.completed || 0} / {stats.milestones?.total || 0}</div>
                        <p className="text-[9px] font-black text-emerald-500/40 uppercase tracking-widest">PHASES COMPLETED</p>
                     </div>
                  </div>
                  <div className="flex items-center gap-3 bg-white/5 p-4 rounded-[1.5rem] border border-white/5">
                     <div className="w-12 h-12 rounded-2xl bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">
                        <Shield size={24} />
                     </div>
                     <div>
                        <div className="text-xl font-black text-white">{stats.milestones?.active || 0}</div>
                        <p className="text-[9px] font-black text-blue-500/40 uppercase tracking-widest">ACTIVE OPERATIONS</p>
                     </div>
                  </div>
               </div>
            </div>

            <div className="relative z-10 w-full md:w-1/2 h-[240px] flex items-center justify-center">
               <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                     <Pie
                        data={milestonePie}
                        cx="50%"
                        cy="50%"
                        innerRadius={65}
                        outerRadius={90}
                        paddingAngle={8}
                        dataKey="value"
                        stroke="none"
                     >
                        {milestonePie.map((entry, index) => (
                           <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                     </Pie>
                     <Tooltip 
                        contentStyle={{ borderRadius: '1.5rem', border: 'none', backgroundColor: '#064e3b', color: '#fff' }}
                        itemStyle={{ color: '#fff', fontSize: '10px', textTransform: 'uppercase', fontWeight: 900 }}
                     />
                  </PieChart>
               </ResponsiveContainer>
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                  <span className="text-3xl font-black text-white">{stats.milestones?.progress}%</span>
                  <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Progress</span>
               </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
         {/* Mental Health & Mood */}
         <div className="bg-white rounded-[2.5rem] p-6 md:p-8 border border-emerald-50 shadow-sm">
            <div className="space-y-1 mb-6">
               <h3 className="text-xl font-black text-emerald-950 tracking-tight">মেন্টাল স্ট্যাবিলিটি</h3>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">মুড ট্র্যান্ড অডিট</p>
            </div>
            <div className="h-[180px]">
               <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={charts.moodTrend}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                     <XAxis dataKey="date" hide />
                     <YAxis hide domain={[1, 10]} />
                     <Tooltip {...tooltipStyle} />
                     <Area type="step" dataKey="mood" name="স্থিতিশীলতা" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.05} strokeWidth={3} />
                  </AreaChart>
               </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-50">
               <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
                     <Brain size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-black text-slate-700">{Math.round(parseFloat(stats.avgMood) * 10)}%</div>
                    <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Avg Stability</p>
                  </div>
               </div>
               <TrendingUp size={20} className="text-emerald-400" />
            </div>
         </div>

         {/* Workout Recap */}
         <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-6 md:p-10 border border-emerald-50 shadow-sm">
            <div className="flex items-center justify-between mb-6">
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-emerald-950 tracking-tight">ওয়ার্কআউট লগ</h3>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">সর্বশেষ ৫টি ব্যায়াম</p>
               </div>
               <div className="px-4 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap">
                  {stats.totalWorkouts || 0} sessions
               </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
               {recentWorkouts.length > 0 ? (
                 recentWorkouts.map((w, i) => (
                   <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-2xl hover:bg-emerald-50 hover:border-emerald-100 transition-all group">
                      <div className="w-12 h-12 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-emerald-600 shadow-sm group-hover:bg-emerald-600 group-hover:text-white transition-all flex-shrink-0">
                         <Dumbbell size={20} />
                      </div>
                      <div className="flex-1 min-w-0">
                         <div className="flex items-center justify-between gap-2">
                            <h4 className="text-sm font-black text-emerald-950 uppercase truncate">{w.type}</h4>
                            <span className="text-[10px] font-bold text-slate-400 whitespace-nowrap">{w.date.split('-').slice(1).join('/')}</span>
                         </div>
                         <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                            <span>{w.duration} MIN</span>
                            <div className="w-1 h-1 rounded-full bg-slate-300" />
                            <span className="text-emerald-500 uppercase">{w.intensity}</span>
                         </div>
                      </div>
                   </div>
                 ))
               ) : (
                <div className="col-span-2 py-10 text-center text-slate-300 italic font-black text-xs uppercase tracking-widest">
                    কোনো ব্যায়াম রেকর্ড করা হয়নি
                </div>
               )}
            </div>
         </div>
      </div>

      {/* 🧩 Heatmap Section */}
      <div className="bg-white rounded-[2.5rem] p-6 md:p-10 border border-emerald-50 shadow-sm space-y-8">
         <div className="flex items-center justify-between">
            <div className="space-y-1">
               <h3 className="text-xl font-black text-emerald-950 tracking-tight">ডিসিপ্লিন গ্রিড</h3>
               <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">হ্যাবিট হিটম্যাপ</p>
            </div>
            <div className="px-4 py-2 bg-emerald-50 rounded-xl text-[10px] font-black text-emerald-600 uppercase tracking-widest">
               {heatmap.length || 0} DAYS
            </div>
         </div>

          <div className="overflow-x-auto pb-2">
            {heatmap.length === 0 ? (
              <div className="py-16 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center text-slate-200">
                  <Calendar size={32} />
                </div>
                <p className="text-sm font-black text-slate-300 uppercase tracking-widest">কোনো ইনপুট নেই</p>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex gap-[3px]">
                  {groupedHeatmap.map((week, weekIdx) => (
                    <div key={weekIdx} className="flex flex-col gap-[3px]">
                      {week.map((day, dayIdx) => (
                        <div 
                          key={dayIdx}
                          title={`${day.date}: Score ${day.count}/7`}
                          className="w-[12px] h-[12px] rounded-[2px] transition-all duration-300 hover:scale-125 hover:z-20 cursor-pointer"
                          style={{ 
                            backgroundColor: day.count === 0 ? '#f1f5f9' : 
                                           day.count <= 2 ? '#dcfce7' : 
                                           day.count <= 4 ? '#86efac' : 
                                           day.count <= 6 ? '#22c55e' : '#15803d'
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>
                
                <div className="flex items-center justify-between">
                   <div className="flex items-center gap-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Score: {stats.avgHabitScore}/7</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Days: {stats.daysTracked}</span>
                      </div>
                   </div>
                   <div className="flex items-center gap-2">
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Low</span>
                      <div className="flex gap-1">
                         {[0, 2, 4, 6, 7].map(l => (
                            <div key={l} className="w-3 h-3 rounded-[2px]" style={{ 
                               backgroundColor: l === 0 ? '#f1f5f9' : 
                                              l <= 2 ? '#dcfce7' : 
                                              l <= 4 ? '#86efac' : 
                                              l <= 6 ? '#22c55e' : '#15803d'
                            }} />
                         ))}
                      </div>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">High</span>
                   </div>
                </div>
              </div>
            )}
          </div>
        </div>

    </div>
  );
};

export default Analytics;
