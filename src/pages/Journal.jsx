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
  Zap,
  TrendingUp,
  Brain,
  History,
  Award,
  Trash2,
  Info,
  CheckCircle2,
  Layout,
  Clock,
  MessageSquare,
  Quote,
  Star,
  Wind,
  ArrowRight
} from 'lucide-react';
import { journalAPI, analyticsAPI } from '../utils/api';
import { todayStr, moodLabel } from '../utils/helpers';
import { format, addDays, parseISO, subDays } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../components/Common/Loader';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const MOOD_ICONS = [
  { score: 1, icon: <CloudRain size={20} />, label: 'Deeply Low', color: 'text-slate-400', bg: 'bg-slate-50' },
  { score: 3, icon: <Frown size={20} />, label: 'Struggling', color: 'text-indigo-400', bg: 'bg-indigo-50' },
  { score: 5, icon: <Meh size={20} />, label: 'Neutral', color: 'text-amber-400', bg: 'bg-amber-50' },
  { score: 7, icon: <Smile size={20} />, label: 'Positive', color: 'text-emerald-400', bg: 'bg-emerald-50' },
  { score: 9, icon: <Laugh size={20} />, label: 'Victor', color: 'text-orange-400', bg: 'bg-orange-50' },
  { score: 10, icon: <Flame size={20} />, label: 'unstoppable', color: 'text-rose-500', bg: 'bg-rose-50' },
];

const Journal = () => {
  const [date, setDate] = useState(todayStr());
  const [entry, setEntry] = useState({ goodThings: '', learned: '', improvements: '', gratitude: '', mood: 5, freeWrite: '' });
  const [recentEntries, setRecentEntries] = useState([]);
  const [moodTrend, setMoodTrend] = useState([]);
  const [stats, setStats] = useState(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchData = async (d) => {
    try {
      const [entryRes, listRes, trendRes, analyticsRes] = await Promise.all([
        journalAPI.get(d),
        journalAPI.list(10),
        journalAPI.moodTrend(),
        analyticsAPI.getDashboard()
      ]);
      setEntry(entryRes.data.entry);
      setRecentEntries(listRes.data.entries || []);
      setMoodTrend(trendRes.data.moodData || []);
      setStats(analyticsRes.data.stats);
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

  const saveEntry = async () => {
    setSaving(true);
    try {
      await journalAPI.save(date, entry);
      toast.success('মাইন্ডসেট আর্কাইভ সেভ হয়েছে! 📔', {
        icon: '📔',
        style: { borderRadius: '15px', background: '#064e3b', color: '#fff', fontWeight: 'bold' }
      });
      fetchData(date);
    } catch (e) { 
      toast.error('সেভ করতে সমস্যা হয়েছে'); 
    } finally { 
      setSaving(false); 
    }
  };

  const prompts = [
    { key: 'goodThings', icon: <Sparkles size={20} />, label: 'আজ আমি কী ভালো করলাম?', placeholder: 'আপনার আজকের সাফল্যগুলো এখানে লিখুন...', color: 'text-emerald-500', border: 'border-emerald-100' },
    { key: 'learned', icon: <Lightbulb size={20} />, label: 'আজ আমি কী শিখলাম?', placeholder: 'নতুন জ্ঞানের কথা এখানে লিখুন...', color: 'text-amber-500', border: 'border-amber-100' },
    { key: 'improvements', icon: <Target size={20} />, label: 'আগামীকাল আমি কী উন্নতি করব?', placeholder: 'কিভাবে নিজেকে আরও উন্নত করবেন?', color: 'text-rose-500', border: 'border-rose-100' },
    { key: 'gratitude', icon: <Heart size={20} />, label: 'আজ কিসের জন্য কৃতজ্ঞ?', placeholder: 'আপনার কৃতজ্ঞতার তালিকা এখানে লিখুন...', color: 'text-sky-500', border: 'border-sky-100' },
  ];

  // Prepare chart data (last 7 recorded days)
  const chartData = [...moodTrend].reverse().map(m => ({
    name: format(parseISO(m.date), 'dd MMM'),
    mood: m.mood
  }));

  if (loading && recentEntries.length === 0) return <Loader />;

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-24">
      
      {/* 🚀 Header: Ultra Premium Mindset Command Center */}
      <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-1 shadow-sm border border-emerald-100 bg-white group">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-50 rounded-full blur-[100px] -mr-40 -mt-40 opacity-60 group-hover:scale-125 transition-transform duration-1000" />
        
        <div className="relative px-6 py-8 md:px-8 md:py-10 flex flex-col xl:flex-row xl:items-center justify-between gap-8 md:gap-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 bg-emerald-600 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                MINDSET ARCHIVE
              </span>
              <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 rounded-full uppercase tracking-widest">
                REFLECTION CORE
              </span>
            </div>
            
            <div className="space-y-1">
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter text-emerald-950">
                মাইন্ডসেট <span className="bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent">মাস্টারি</span>
              </h1>
              <p className="text-emerald-950/40 font-bold text-xs md:text-sm">তোমার চিন্তাগুলোই তোমার ভবিতব্য নির্ধারণ করে</p>
            </div>

            <div className="flex items-center gap-4 md:gap-6 pt-2">
               <div className="flex items-center gap-2 md:gap-3">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                    <MessageSquare size={20} className="md:w-6 md:h-6" />
                 </div>
                 <div>
                    <div className="text-xl md:text-2xl font-black text-emerald-950 leading-none">{recentEntries.length}</div>
                    <p className="text-[8px] md:text-[9px] font-black text-emerald-500 uppercase tracking-widest mt-1">TOTAL ENTRIES</p>
                 </div>
               </div>
               <div className="w-px h-8 md:h-10 bg-emerald-100" />
               <div className="flex items-center gap-2 md:gap-3">
                 <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600 shadow-sm border border-amber-100">
                    <Wind size={20} className="md:w-6 md:h-6" />
                 </div>
                 <div>
                    <div className="text-xl md:text-2xl font-black text-emerald-950 leading-none">{entry.mood}/10</div>
                    <p className="text-[8px] md:text-[9px] font-black text-amber-500 uppercase tracking-widest mt-1">CURRENT STATE</p>
                 </div>
               </div>
            </div>
          </div>

          <div className="bg-emerald-950 p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] text-white space-y-4 min-w-full xl:min-w-[280px] shadow-2xl relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-10">
                <Brain size={64} className="md:w-20 md:h-20" strokeWidth={1} />
             </div>
             <div className="flex items-center gap-3">
                <div className="p-2 bg-white/10 rounded-xl">
                   <Target size={18} className="text-emerald-400 md:w-5 md:h-5" />
                </div>
                <div>
                   <p className="text-[9px] md:text-[10px] font-black text-emerald-400 uppercase tracking-widest">RESILIENCE SCALE</p>
                   <h3 className="text-base md:text-lg font-black">{entry.mood >= 8 ? 'Unshakable' : 'Building Strength'}</h3>
                </div>
             </div>
             <div className="space-y-2">
                <div className="flex justify-between text-[9px] md:text-[10px] font-black uppercase text-emerald-400">
                   <span>Mental State</span>
                   <span>{entry.mood * 10}% Stability</span>
                </div>
                <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                   <div className="h-full bg-emerald-400 rounded-full shadow-[0_0_10px_rgba(52,211,153,0.5)]" style={{ width: `${entry.mood * 10}%` }} />
                </div>
             </div>
          </div>
        </div>
      </div>

      {/* 📅 Date Navigation & Save */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2 md:gap-3 bg-white p-1.5 md:p-2 rounded-[2rem] border border-emerald-50 shadow-sm w-full md:w-max">
           <button onClick={() => changeDate(-1)} className="p-3 md:p-4 rounded-2xl hover:bg-emerald-50 text-emerald-600 transition-all flex-shrink-0"><ChevronLeft size={20} /></button>
           <div className="flex-1 text-center min-w-0 md:min-w-[180px]">
              <p className="text-[8px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none mb-1">RECORD DATE</p>
              <p className="text-xs md:text-sm font-black text-emerald-950 truncate">
                 {format(parseISO(date), 'EEEE, dd MMMM')}
                 {date === todayStr() && <span className="ml-1 md:ml-2 text-emerald-500 text-[8px] md:text-[10px] uppercase whitespace-nowrap">● আজ</span>}
              </p>
           </div>
           <button 
             onClick={() => changeDate(1)} 
             disabled={date === todayStr()}
             className="p-3 md:p-4 rounded-2xl hover:bg-emerald-50 text-emerald-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent flex-shrink-0"
           ><ChevronRight size={20} /></button>
        </div>

        <button 
          onClick={saveEntry}
          disabled={saving}
          className="flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-4 md:py-5 rounded-[1.8rem] md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 disabled:opacity-50 w-full md:w-auto"
        >
           {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> সেভ আর্কাইভ</>}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* 🖊️ Left: Journal Entry Column */}
        <div className="xl:col-span-8 space-y-8">
           
           {/* Mood Mastery Selector */}
           <div className="p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-white border border-emerald-100 shadow-sm space-y-6 md:space-y-8">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h3 className="text-xl md:text-2xl font-black text-emerald-950 tracking-tight">মুড মেট্রিক্স</h3>
                    <p className="text-[9px] md:text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">মানসিক অবস্থা নির্বাচন করো</p>
                 </div>
                 <div className={`p-3 md:p-4 rounded-xl md:rounded-2xl border bg-white shadow-inner ${MOOD_ICONS.find(m => entry.mood <= m.score)?.color || 'text-emerald-500'}`}>
                    <div className="md:scale-100 scale-75">
                       {MOOD_ICONS.find(m => entry.mood <= m.score)?.icon || <Meh size={24} />}
                    </div>
                 </div>
              </div>

              <div className="grid grid-cols-3 md:flex md:flex-wrap gap-2 md:gap-3">
                 {MOOD_ICONS.map((m) => (
                    <button 
                      key={m.score}
                      onClick={() => setEntry({...entry, mood: m.score})}
                      className={`p-3 md:p-4 rounded-2xl md:rounded-[2rem] border transition-all flex flex-col items-center gap-2 group ${entry.mood === m.score ? 'bg-emerald-950 border-emerald-950 text-white shadow-xl scale-[1.05]' : 'bg-white border-emerald-50 text-emerald-900/40 hover:border-emerald-200'}`}
                    >
                       <div className={`p-2 md:p-3 rounded-xl md:rounded-2xl transition-all ${entry.mood === m.score ? 'bg-white/10' : `${m.bg} ${m.color}`}`}>
                          <div className="md:scale-100 scale-75">
                             {m.icon}
                          </div>
                       </div>
                       <span className="text-[8px] md:text-[9px] font-black uppercase tracking-widest whitespace-nowrap overflow-hidden text-ellipsis w-full text-center">{m.label}</span>
                    </button>
                 ))}
              </div>
           </div>

           {/* Guided Reflection Prompts */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              {prompts.map((p) => (
                 <div key={p.key} className={`p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] bg-white border ${p.border} shadow-sm space-y-4 group hover:shadow-md transition-all`}>
                    <div className="flex items-center gap-3">
                       <div className={`p-2 rounded-xl bg-gray-50 ${p.color} transition-all group-hover:scale-110`}>
                          <div className="md:scale-100 scale-90">{p.icon}</div>
                       </div>
                       <h4 className="text-[10px] md:text-xs font-black text-emerald-950 uppercase tracking-widest leading-tight">{p.label}</h4>
                    </div>
                    <textarea 
                      className="w-full bg-gray-50/50 rounded-xl md:rounded-2xl px-4 md:px-6 py-3.5 md:py-4 border border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 transition-all text-xs md:text-sm font-bold text-emerald-950 min-h-[100px] md:min-h-[120px] outline-none"
                      placeholder={p.placeholder}
                      value={entry[p.key] || ''}
                      onChange={e => setEntry({...entry, [p.key]: e.target.value})}
                    />
                 </div>
              ))}
           </div>

           {/* Free Write: Deep Reflection */}
           <div className="p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-white border border-emerald-100 shadow-sm space-y-6">
              <div className="flex items-center gap-3 ml-2 md:ml-4">
                 <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
                    <PenTool size={18} className="md:w-5 md:h-5" />
                 </div>
                 <h4 className="text-[10px] md:text-xs font-black text-emerald-950 uppercase tracking-widest">মুক্ত লেখা (মনের যা আসে লিখো)</h4>
              </div>
              <textarea 
                className="w-full bg-slate-50/30 rounded-[1.8rem] md:rounded-[2.5rem] px-6 md:px-8 py-6 md:py-8 border border-slate-100 focus:bg-white focus:border-emerald-200 focus:ring-4 md:focus:ring-8 focus:ring-emerald-500/5 transition-all text-sm md:text-base font-medium text-emerald-950 min-h-[250px] md:min-h-[300px] outline-none leading-relaxed"
                placeholder="आज আপনার মনে কী চলছে? আপনার চিন্তাগুলো এখানে বিস্তারিত লিখুন..."
                value={entry.freeWrite || ''}
                onChange={e => setEntry({...entry, freeWrite: e.target.value})}
              />
           </div>

           <button 
             onClick={saveEntry}
             disabled={saving}
             className="w-full py-5 md:py-6 bg-emerald-950 text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-98"
           >
              {saving ? <Loader2 size={24} className="animate-spin" /> : <><CheckCircle2 size={18} className="md:w-6 md:h-6" /> পুরোদিন আর্কাইভ করো</>}
           </button>
        </div>

        {/* 📊 Right: Analytics & History Column */}
        <div className="xl:col-span-4 space-y-8">
           
           {/* Mood Trend Chart */}
           <div className="p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-emerald-100 shadow-sm bg-white space-y-6 md:space-y-8">
              <div className="flex items-center justify-between">
                 <div className="space-y-1">
                    <h3 className="text-lg md:text-xl font-black text-emerald-950 tracking-tight">মানসিক ভারসাম্য</h3>
                    <p className="text-[9px] md:text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">গত ১০ দিনের মুড ট্রেন্ড</p>
                 </div>
                 <div className="p-2.5 md:p-3 bg-emerald-50 rounded-xl md:rounded-2xl text-emerald-500 border border-emerald-100">
                    <TrendingUp size={18} className="md:w-5 md:h-5" />
                 </div>
              </div>

              <div className="h-[180px] md:h-[200px] w-full">
                 {chartData.length > 0 ? (
                   <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={chartData}>
                         <defs>
                            <linearGradient id="moodGrad" x1="0" y1="0" x2="0" y2="1">
                               <stop offset="5%" stopColor="#10b981" stopOpacity={0.2}/>
                               <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                            </linearGradient>
                         </defs>
                         <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
                         <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 8, fontWeight: 900, fill: '#94a3b8' }} dy={10} />
                         <YAxis hide domain={[0, 10]} />
                         <Tooltip 
                           content={({ active, payload }) => active && payload?.[0] ? (
                             <div className="bg-white/95 backdrop-blur-md border border-emerald-100 p-3 rounded-2xl shadow-xl">
                                <p className="text-[9px] font-black text-emerald-900/30 uppercase mb-1">{payload[0].payload.name}</p>
                                <p className="text-sm font-black text-emerald-950">স্কোর: <span className="text-emerald-600">{payload[0].value}/10</span></p>
                             </div>
                           ) : null}
                         />
                         <Area type="monotone" dataKey="mood" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#moodGrad)" dot={{ r: 3, fill: '#fff', stroke: '#10b981', strokeWidth: 2 }} activeDot={{ r: 5 }} />
                      </AreaChart>
                   </ResponsiveContainer>
                 ) : (
                   <div className="h-full flex items-center justify-center opacity-20 italic text-[10px]">কোনো তথ্য নেই</div>
                 )}
              </div>
           </div>

           {/* Quotes / Motivational Card */}
           <div className="p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-br from-emerald-600 to-emerald-900 text-white space-y-6 relative overflow-hidden shadow-2xl">
              <Quote size={40} className="absolute -top-2 -right-2 opacity-10" />
              <p className="text-sm font-medium italic leading-relaxed relative z-10">
                 {entry.mood >= 8 ? '"তুমি আজ দুর্দান্ত ছিলে! এই পজিটিভ এনার্জি তোমার আগামীকালের সাফল্যের জ্বালানি হবে। লিখে রাখো এটি।"' :
                  entry.mood >= 6 ? '"তুমি সঠিক পথে আছো। ছোট ছোট জয়গুলোই একদিন বড় সাফল্যে রূপ নেবে। হার মানবে না।"' :
                  entry.mood >= 4 ? '"কঠিন সময় চিরস্থায়ী নয়, কিন্তু ধৈর্যশীল মানুষরা চিরজয়ী হয়। আজকের লড়াকু মানসিকতাই তোমাকে যোদ্ধা বানাবে।"' :
                  '"অন্ধকার যত গভীর হয়, ভোরের আলো তত কাছে থাকে। তোমার এই মুহূর্তের প্রতিটি অনুভূতিই গুরুত্বপূর্ণ। শান্ত থাকো।"'}
              </p>
              <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                    <Star size={18} className="text-yellow-400" fill="currentColor" />
                 </div>
                 <p className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-200">WARRIOR WISDOM</p>
              </div>
           </div>

           {/* Recent Entries Feed */}
           <div className="p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] border border-emerald-100 bg-white shadow-sm space-y-6 md:space-y-8">
              <div className="flex justify-between items-center">
                 <h3 className="text-lg md:text-xl font-black text-emerald-950">সাম্প্রতিক আর্কাইভ</h3>
                 <History size={18} className="text-emerald-300 md:w-5 md:h-5" />
              </div>

              <div className="space-y-3 md:space-y-4">
                 {recentEntries.length > 0 ? (
                   recentEntries.map((e, i) => {
                     const isCurrent = date === e.date;
                     const mIcon = MOOD_ICONS.find(m => e.mood <= m.score) || MOOD_ICONS[2];
                     return (
                       <div 
                         key={i} 
                         onClick={() => setDate(e.date)}
                         className={`p-4 md:p-5 rounded-[1.8rem] md:rounded-[2rem] border transition-all cursor-pointer group flex items-center justify-between ${isCurrent ? 'bg-emerald-50 border-emerald-200 shadow-inner' : 'bg-white border-emerald-50 hover:bg-gray-50'}`}
                       >
                          <div className="flex items-center gap-3 md:gap-4 truncate">
                             <div className={`p-2.5 md:p-3 rounded-xl transition-all shrink-0 ${isCurrent ? 'bg-white text-emerald-600 shadow-sm' : `${mIcon.bg} ${mIcon.color}`}`}>
                                <div className="md:scale-100 scale-90">{mIcon.icon}</div>
                             </div>
                             <div className="truncate">
                                <p className="text-xs md:text-sm font-black text-emerald-950 truncate">{format(parseISO(e.date), 'dd MMMM')}</p>
                                <p className="text-[8px] md:text-[9px] font-black text-emerald-400 uppercase tracking-widest">{mIcon.label}</p>
                             </div>
                          </div>
                          <ChevronRight size={14} className={`transition-all shrink-0 ${isCurrent ? 'text-emerald-600 translate-x-1' : 'text-gray-200 group-hover:text-emerald-200'}`} />
                       </div>
                     );
                   })
                 ) : (
                    <div className="py-8 text-center opacity-20 italic text-[10px]">কোনো এন্ট্রি নেই</div>
                 )}
              </div>

              <button className="w-full py-4 rounded-xl md:rounded-2xl border-2 border-dashed border-emerald-100 text-emerald-400 text-[9px] md:text-[10px] font-black uppercase tracking-widest hover:bg-emerald-50 transition-all">
                 VIEW ALL ARCHIVES <ArrowRight size={10} className="inline ml-1" />
              </button>
           </div>
        </div>

      </div>

    </div>
  );
};

export default Journal;
