import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check,
  Zap,
  Clock,
  Layout,
  MoreVertical,
  Calendar,
  Layers,
  Sparkles,
  Search,
  Settings,
  Sun,
  Moon,
  Coffee,
  Brain,
  Dumbbell,
  Target,
  Star,
  Activity,
  Smile,
  BookOpen
} from 'lucide-react';
import { routineAPI, authAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import { todayStr } from '../utils/helpers';
import { format, addDays, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../components/Common/Loader';

const categoryMeta = {
  Discipline: { icon: <Target size={14} />, color: 'bg-orange-50 text-orange-600', border: 'border-orange-100' },
  Study: { icon: <Brain size={14} />, color: 'bg-sky-50 text-sky-600', border: 'border-sky-100' },
  Health: { icon: <Dumbbell size={14} />, color: 'bg-rose-50 text-rose-600', border: 'border-rose-100' },
  Mindfulness: { icon: <Sparkles size={14} />, color: 'bg-purple-50 text-purple-600', border: 'border-purple-100' },
  Ibadat: { icon: <Moon size={14} />, color: 'bg-amber-50 text-amber-600', border: 'border-amber-100' },
  Other: { icon: <Layout size={14} />, color: 'bg-gray-50 text-gray-600', border: 'border-gray-100' }
};

const Routine = () => {
  const { user, updateUser } = useAuth();
  const [date, setDate] = useState(todayStr());
  const [activeName, setActiveName] = useState(user?.activeRoutineName || 'Daily');
  const [routineNames, setRoutineNames] = useState(['Daily', 'Ramadan']);
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [showNewRoutineModal, setShowNewRoutineModal] = useState(false);
  const [newRoutineName, setNewRoutineName] = useState('');
  const [newTask, setNewTask] = useState({ time: '', task: '', category: 'Discipline' });

  const fetchRoutineData = async (d, name) => {
    setLoading(true);
    try {
      const [routineRes, allRes] = await Promise.all([
        routineAPI.get(d, name),
        routineAPI.getAllForDate(d)
      ]);
      setRoutine(routineRes.data.routine);
      const names = allRes.data.routines?.map(r => r.name) || [];
      if (!names.includes('Daily')) names.unshift('Daily');
      if (!names.includes('Ramadan')) names.push('Ramadan');
      if (user?.activeRoutineName && !names.includes(user.activeRoutineName)) names.push(user.activeRoutineName);
      setRoutineNames([...new Set(names)]);

      // Special Ramadan Toast Notification
      const rName = routineRes.data.routineName || name;
      if ((rName === 'Ramadan' || rName === 'রমজান') && routineRes.data.routine?.tasks?.length > 0) {
        toast('🌙 আপনার জন্য রমজানের বিশেষ রুটিন লোড করা হয়েছে!', {
          icon: '✨',
          style: { borderRadius: '2rem', background: '#064e3b', color: '#fff', border: '1px solid #10b981' }
        });
      }
    } catch (e) {
      toast.error('ডেটা লোড করা যায়নি');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoutineData(date, activeName);
  }, [date, activeName]);

  const toggleTask = async (taskId, completed, index) => {
    try {
      if (!routine?._id) {
        // Not saved yet (using template), toggle locally and save the whole thing
        const updatedTasks = [...(routine?.tasks || [])];
        if (updatedTasks[index]) updatedTasks[index].completed = !completed;
        const res = await routineAPI.save({ date, name: activeName, tasks: updatedTasks });
        setRoutine(res.data.routine);
        if (!completed) toast.success('+5 XP অর্জিত! 🔥', { position: 'bottom-center' });
        return;
      }
      
      // If routine exists but taskId is somehow missing (fallback to index-based update)
      if (!taskId) {
        const updatedTasks = [...(routine?.tasks || [])];
        if (updatedTasks[index]) updatedTasks[index].completed = !completed;
        const res = await routineAPI.save({ date, name: activeName, tasks: updatedTasks });
        setRoutine(res.data.routine);
        if (!completed) toast.success('+5 XP অর্জিত! 🔥', { position: 'bottom-center' });
        return;
      }

      const res = await routineAPI.toggleTask(date, taskId, !completed, activeName);
      setRoutine(res.data.routine);
      if (!completed) toast.success('+5 XP অর্জিত! 🔥', { position: 'bottom-center' });
    } catch (e) {
      toast.error('আপডেট ব্যর্থ');
    }
  };

  const addTask = async () => {
    if (!newTask.task.trim()) { toast.error('টাস্কের নাম দিন'); return; }
    const tasks = [...(routine?.tasks || []), newTask];
    try {
      const res = await routineAPI.save({ date, name: activeName, tasks });
      setRoutine(res.data.routine);
      setNewTask({ time: '', task: '', category: 'Discipline' });
      setShowAdd(false);
      toast.success('টাস্ক যোগ হয়েছে');
    } catch (e) {
      toast.error('টাস্ক যোগ করা যায়নি');
    }
  };

  const deleteTask = async (taskId, index) => {
    try {
      if (!routine?._id) {
        // Not saved yet, just remove locally
        const updatedTasks = (routine?.tasks || []).filter((_, i) => i !== index);
        setRoutine({ ...routine, tasks: updatedTasks });
        toast.success('টাস্ক মুছে ফেলা হয়েছে');
        return;
      }
      
      const res = await routineAPI.deleteTask(date, taskId, activeName);
      setRoutine(res.data.routine);
      toast.success('টাস্ক মুছে ফেলা হয়েছে');
    } catch (e) {
      toast.error('মুছে ফেলা ব্যর্থ');
    }
  };

  const deleteFullRoutine = async () => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে এই (${activeName}) রুটিনটি আজ থেকে ডিলিট করতে চান?`)) return;
    try {
      await routineAPI.deleteRoutine(date, activeName);
      fetchRoutineData(date, activeName);
      toast.success('রুটিন পুরোপুরি ডিলিট করা হয়েছে');
    } catch (e) {
      toast.error('ডিলিট করা সম্ভব হয়নি');
    }
  };

  const createNewRoutine = () => {
    if (!newRoutineName.trim()) return;
    if (routineNames.includes(newRoutineName)) {
      setActiveName(newRoutineName);
    } else {
      setRoutineNames(prev => [...prev, newRoutineName]);
      setActiveName(newRoutineName);
    }
    setNewRoutineName('');
    setShowNewRoutineModal(false);
  };

  const changeDate = (delta) => {
    const d = addDays(parseISO(date), delta);
    setDate(format(d, 'yyyy-MM-dd'));
  };

  const completedCount = routine?.tasks?.filter(t => t.completed).length || 0;
  const totalCount = routine?.tasks?.length || 0;
  const completionRate = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  const handleRoutineChange = async (name) => {
    setActiveName(name);
    try {
      // Persist active routine choice to user profile
      const res = await authAPI.updateProfile({ activeRoutineName: name });
      updateUser(res.data.user);
    } catch (e) {
      console.error('Failed to save active routine preference');
    }
  };

  if (loading && !routine) return <Loader />;

  return (
    <div className="animate-in fade-in duration-700 pb-24 space-y-8">
      
      {/* 🚀 Header: Ultra Premium */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-emerald-50 pb-8 mt-4">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-emerald-500 text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
              ELITE DISCIPLINE
            </span>
            <span className="px-3 py-1 bg-emerald-50 border border-emerald-100 text-[10px] font-black text-emerald-600 rounded-full uppercase tracking-widest">
              LV.{Math.floor(completionRate / 10)} REWARDS
            </span>
          </div>
          <h1 className="text-4xl font-black tracking-tighter text-emerald-950 flex items-center gap-3">
            <div className="p-3 bg-white rounded-2xl shadow-sm border border-emerald-100 text-emerald-500">
               <ClipboardList size={28} />
            </div>
            দৈনিক রুটিন
          </h1>
          <p className="text-emerald-950/40 font-bold text-sm pl-1">শৃঙ্খলাই হলো সাফল্যের একমাত্র চাবিকাঠি</p>
        </div>

        <div className="flex items-center gap-3">
           <button 
             onClick={() => setShowAdd(!showAdd)}
             className={`px-6 py-4 rounded-3xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl ${showAdd ? 'bg-emerald-50 text-emerald-800' : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-emerald-600/20'}`}
           >
             {showAdd ? <X size={18} /> : <Plus size={18} />}
             {showAdd ? 'বাতিল' : 'নতুন টাস্ক'}
           </button>
           
           {routine?._id && (
             <button 
               onClick={deleteFullRoutine}
               className="p-4 bg-rose-50 border border-rose-100 text-rose-500 rounded-3xl hover:bg-rose-100 transition-all shadow-sm"
               title="আজকের রুটিন মুছুন"
             >
               <X size={20} />
             </button>
           )}
        </div>
      </div>

      {/* 📅 Date & Routine Meta Navigation */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        <div className="lg:col-span-4 flex items-center gap-3 bg-white p-2 rounded-[2rem] border border-emerald-50 shadow-sm w-max">
           <button onClick={() => changeDate(-1)} className="p-4 rounded-2xl hover:bg-emerald-50 text-emerald-600 transition-all"><ChevronLeft size={20} /></button>
           <div className="px-4 text-center">
              <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest leading-none mb-1">CURRENT DATE</p>
              <p className="text-sm font-black text-emerald-950">{format(parseISO(date), 'EEEE, dd MMM')}</p>
           </div>
           <button 
             onClick={() => changeDate(1)} 
             disabled={date === todayStr()}
             className="p-4 rounded-2xl hover:bg-emerald-50 text-emerald-600 transition-all disabled:opacity-30 disabled:hover:bg-transparent"
           ><ChevronRight size={20} /></button>
        </div>

        {/* 📚 Multiple Routine Tabs */}
        <div className="lg:col-span-8 flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
           <div className="flex items-center gap-2 bg-emerald-50/50 p-2 rounded-[2rem] border border-emerald-100/50">
              {routineNames.map(name => (
                <button
                  key={name}
                  onClick={() => handleRoutineChange(name)}
                  className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${activeName === name ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'text-emerald-900/50 hover:text-emerald-700'}`}
                >
                  <div className="flex items-center gap-2">
                    <Layers size={14} /> {name}
                  </div>
                </button>
              ))}
              <button 
                onClick={() => setShowNewRoutineModal(true)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-emerald-100 text-emerald-500 hover:bg-emerald-50 transition-all"
              >
                <Plus size={18} />
              </button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        
        {/* 📋 Main Task Area */}
        <div className="xl:col-span-8 space-y-6">
           
           {/* Progress Card */}
           <div className="p-8 rounded-[3rem] bg-white border border-emerald-100 shadow-sm space-y-6">
              <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    <div className="p-3 bg-emerald-50 rounded-2xl text-emerald-500 border border-emerald-100 shadow-inner">
                       <Target size={22} />
                    </div>
                    <div>
                       <h3 className="text-lg font-black text-emerald-950 uppercase tracking-tight">{activeName} প্রগ্রেস</h3>
                       <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">{completedCount} OF {totalCount} TASKS COMPLETED</p>
                    </div>
                 </div>
                 <div className="text-right">
                    <p className="text-3xl font-black text-emerald-500 leading-none">{completionRate}%</p>
                    <p className="text-[9px] font-black text-emerald-900/30 uppercase tracking-[0.2em] mt-1">SUCCESS RATE</p>
                 </div>
              </div>
              
              <div className="relative h-4 w-full bg-emerald-50 rounded-full border border-emerald-100 shadow-inner overflow-hidden p-1">
                 <div 
                   className="h-full rounded-full transition-all duration-1000 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
                   style={{ width: `${completionRate}%` }}
                 />
              </div>
           </div>

           {/* Add Task Form (Expanded) */}
           {showAdd && (
             <div className="p-8 rounded-[3rem] bg-emerald-50 border border-emerald-200 shadow-sm animate-in slide-in-from-top-4 duration-300">
                <div className="flex items-center justify-between mb-8">
                   <h3 className="text-xl font-black text-emerald-950 flex items-center gap-2">
                     <Plus className="text-emerald-500" /> নতুন টাস্ক যোগ করো
                   </h3>
                   <div className="p-2 bg-white rounded-xl text-emerald-900/20"><Settings size={16} /></div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   <div className="space-y-2">
                      <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">সময় নির্ধারণ (ঐচ্ছিক)</label>
                      <div className="relative">
                         <div className="absolute left-5 top-1/2 -translate-y-1/2 text-emerald-400"><Clock size={16} /></div>
                         <input 
                           type="time" 
                           className="w-full bg-white rounded-2xl px-12 py-4 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-emerald-950" 
                           value={newTask.time} 
                           onChange={e => setNewTask({...newTask, time: e.target.value})} 
                         />
                      </div>
                   </div>
                   <div className="space-y-2 lg:col-span-2">
                      <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">টাস্কের নাম</label>
                      <input 
                        type="text" 
                        placeholder="কি অর্জন করতে চাও আজ?" 
                        className="w-full bg-white rounded-2xl px-6 py-4 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-emerald-950" 
                        value={newTask.task} 
                        onChange={e => setNewTask({...newTask, task: e.target.value})} 
                      />
                   </div>
                </div>

                <div className="mt-8 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center gap-3 bg-white p-2 rounded-2xl border border-emerald-100 flex-wrap">
                       {['Discipline', 'Study', 'Health', 'Mindfulness', 'Ibadat'].map(cat => (
                          <button 
                            key={cat}
                            type="button"
                            onClick={() => setNewTask({...newTask, category: cat})}
                            className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${newTask.category === cat ? 'bg-emerald-500 text-white shadow-md' : 'text-emerald-900/40 hover:text-emerald-600'}`}
                          >
                            {cat}
                          </button>
                       ))}
                    </div>
                   <button 
                     onClick={addTask}
                     className="px-10 py-4 bg-emerald-600 text-white rounded-[1.8rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all flex items-center gap-3"
                   >
                     <Check size={18} /> রুটিন আপডেট করো
                   </button>
                </div>
             </div>
           )}

           {/* Task List Grid */}
           <div className="space-y-4">
              {routine?.tasks?.length > 0 ? (
                routine.tasks.map((task, i) => {
                  const meta = categoryMeta[task.category] || categoryMeta.Other;
                  return (
                    <div 
                      key={task._id || i} 
                      onClick={() => toggleTask(task._id, task.completed, i)}
                      className={`p-6 rounded-[2.5rem] bg-white border border-emerald-50 shadow-sm flex items-center gap-6 group transition-all hover:translate-x-2 cursor-pointer ${task.completed ? 'opacity-50 grayscale' : ''}`}
                    >
                       <div 
                         className={`w-12 h-12 rounded-2xl border-2 flex items-center justify-center transition-all ${task.completed ? 'bg-emerald-500 border-emerald-500 text-white rotate-[360deg]' : 'border-emerald-100 text-transparent hover:border-emerald-400 group-hover:scale-105 shadow-sm bg-gray-50/30'}`}
                       >
                         <Check size={20} className={task.completed ? 'scale-100' : 'scale-0'} />
                       </div>
                       
                       <div className="flex-1 space-y-1">
                          <div className="flex items-center gap-3">
                             <span className="text-xs font-black text-emerald-950/30 font-mono tracking-widest">{task.time || 'ANY TIME'}</span>
                             {task.completed && <span className="px-2 py-0.5 bg-emerald-100 text-[8px] font-black text-emerald-600 rounded-md uppercase tracking-widest">VICTORY</span>}
                          </div>
                          <p className={`text-base font-black text-emerald-950 ${task.completed ? 'line-through' : ''}`}>{task.task}</p>
                       </div>

                       <div className={`hidden md:flex items-center gap-2 px-4 py-1.5 rounded-xl border ${meta.color} ${meta.border} text-[10px] font-black uppercase tracking-widest shadow-sm`}>
                          {meta.icon} {task.category}
                       </div>
                       
                       <button 
                         onClick={(e) => { e.stopPropagation(); deleteTask(task._id, i); }}
                         className="p-3 rounded-2xl hover:bg-rose-50 text-rose-500/20 hover:text-rose-500 transition-all"
                       >
                          <X size={18} />
                       </button>
                    </div>
                  );
                })
              ) : (
                <div className="p-20 flex flex-col items-center justify-center text-center space-y-6 bg-emerald-50/20 rounded-[4rem] border-2 border-dashed border-emerald-100/50">
                   <div className="w-24 h-24 rounded-[2.5rem] bg-emerald-50 flex items-center justify-center text-emerald-200">
                      <ClipboardList size={48} strokeWidth={1} />
                   </div>
                   <div className="space-y-2">
                      <h4 className="text-xl font-black text-emerald-950">শূন্য রুটিন!</h4>
                      <p className="max-w-xs text-xs font-bold text-emerald-900/30">একটি মজবুত রুটিনই পারে তোমার দিনটিকে বদলে দিতে। আজই নতুন টাস্ক যোগ করো।</p>
                   </div>
                   <button onClick={() => setShowAdd(true)} className="px-8 py-3 bg-white border border-emerald-100 rounded-2xl text-[10px] font-black text-emerald-500 uppercase tracking-widest hover:bg-emerald-50 transition-all">শুরু করো <ChevronRight size={14} className="inline ml-1" /></button>
                </div>
              )}
           </div>
        </div>

        {/* 📋 Sidebar: Deep View & Templates */}
        <div className="xl:col-span-4 space-y-8">
           
           {/* Routine Summary Mini-Chart */}
           <div className="p-8 rounded-[3rem] bg-white border border-emerald-100 shadow-sm space-y-6">
              <h4 className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">CATEGORICAL LOAD</h4>
              <div className="space-y-4">
                  {['Discipline', 'Study', 'Health', 'Mindfulness', 'Ibadat'].map(cat => {
                    const count = routine?.tasks?.filter(t => t.category === cat).length || 0;
                    const meta = categoryMeta[cat] || categoryMeta.Other;
                    return (
                      <div key={cat} className="space-y-2">
                         <div className="flex justify-between items-center text-[10px] font-black">
                            <span className="flex items-center gap-2 text-emerald-950 uppercase">{meta.icon} {cat}</span>
                            <span className="text-emerald-400">{count} Tasks</span>
                         </div>
                         <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden p-[2px]">
                            <div className={`h-full rounded-full ${meta.color.split(' ')[1]}`} style={{ width: `${totalCount ? (count/totalCount)*100 : 0}%` }} />
                         </div>
                      </div>
                    );
                  })}
              </div>
           </div>

           {/* Motivational Quote for Routine */}
           <div className="p-8 rounded-[3rem] bg-emerald-950 text-white shadow-xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-400/10 rounded-full -mr-16 -mt-16 blur-xl" />
              <div className="relative z-10 space-y-4">
                 <div className="p-2 bg-white/10 rounded-xl w-max border border-white/10">
                    <Zap size={20} className="text-emerald-400" />
                 </div>
                 <p className="text-lg font-black leading-tight tracking-tight italic">"যে তার সকালের নিয়ন্ত্রণ হারিয়ে ফেলে, সে তার পুরো জীবনের নিয়ন্ত্রণ হারায়।"</p>
                 <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <span className="text-[9px] font-black text-emerald-400 uppercase tracking-widest">WARRIOR CODE</span>
                    <button className="text-[9px] font-black uppercase tracking-widest hover:text-emerald-400 transition-colors">READ MORE</button>
                 </div>
              </div>
           </div>

           {/* Today's Task Breakdown - Real Data */}
           <div className="p-8 rounded-[3rem] bg-white border border-emerald-100 shadow-sm space-y-6">
              <h4 className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest">আজকের রিয়েল ব্রেকডাউন</h4>
              <div className="space-y-5">
                 {/* Completion Rate Visual */}
                 <div className="flex items-center justify-between p-5 bg-emerald-50 rounded-2xl border border-emerald-100">
                    <div>
                       <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-1">TODAY'S SCORE</p>
                       <p className="text-3xl font-black text-emerald-950 leading-none">{completedCount}<span className="text-base text-emerald-400">/{totalCount}</span></p>
                       <p className="text-[9px] font-bold text-emerald-400/60 uppercase tracking-widest mt-1">Tasks Done</p>
                    </div>
                    <div className="w-20 h-20 relative flex items-center justify-center">
                       <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#ecfdf5" strokeWidth="3" />
                          <circle cx="18" cy="18" r="15.9" fill="none" stroke="#10b981" strokeWidth="3"
                            strokeDasharray={`${completionRate} ${100 - completionRate}`}
                            strokeLinecap="round"
                          />
                       </svg>
                       <span className="absolute text-sm font-black text-emerald-600">{completionRate}%</span>
                    </div>
                 </div>

                 {/* Pending tasks count */}
                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-amber-50 border border-amber-100">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                       <Clock size={18} />
                    </div>
                    <div>
                       <p className="text-xs font-black text-amber-700">{totalCount - completedCount} টি টাস্ক বাকি</p>
                       <p className="text-[9px] font-bold text-amber-500/60 uppercase tracking-widest">Remaining Today</p>
                    </div>
                 </div>

                 {/* Routine name tag */}
                 <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
                       <Layers size={18} />
                    </div>
                    <div>
                       <p className="text-xs font-black text-slate-700">{activeName} রুটিন</p>
                       <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Active Module</p>
                    </div>
                 </div>

              </div>
           </div>
        </div>
      </div>

      {/* 🚀 New Routine Modal */}
      {showNewRoutineModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-emerald-950/20 backdrop-blur-sm animate-in fade-in duration-300">
           <div className="w-full max-w-md bg-white rounded-[3rem] p-10 shadow-2xl border border-emerald-50 space-y-8 animate-in zoom-in-95 duration-300">
              <div className="text-center space-y-2">
                 <div className="w-16 h-16 bg-emerald-50 rounded-[1.8rem] flex items-center justify-center text-emerald-500 mx-auto shadow-inner border border-emerald-100">
                    <Layers size={32} />
                 </div>
                 <h3 className="text-2xl font-black text-emerald-950">নতুন রুটিন মডিউল</h3>
                 <p className="text-xs font-bold text-emerald-900/30 px-8">যেমন: Morning Routine, Exam Routine, বা Weekend Routine</p>
              </div>
              
              <div className="space-y-4">
                 <div className="space-y-4 pt-4 border-t border-emerald-50">
                    <p className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest text-center">দ্রুত সাজেশন</p>
                    <div className="flex flex-wrap gap-2 justify-center">
                       {['Ramadan', 'Morning', 'Study Focus', 'Weekend'].map(s => (
                          <button 
                            key={s}
                            onClick={() => { setNewRoutineName(s); }}
                            className="px-4 py-2 bg-emerald-50 text-[10px] font-black text-emerald-600 rounded-xl hover:bg-emerald-100 transition-all uppercase tracking-widest border border-emerald-100"
                          >
                             {s === 'Ramadan' ? '🌙 Ramadan' : s}
                          </button>
                       ))}
                    </div>
                 </div>

                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">রুটিনের নাম</label>
                    <div className="relative">
                       <input 
                         type="text" 
                         placeholder="যেমন: Work Focus" 
                         className="w-full bg-emerald-50/50 rounded-2xl px-6 py-4 border border-emerald-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-bold text-emerald-950" 
                         value={newRoutineName} 
                         onChange={e => setNewRoutineName(e.target.value)} 
                       />
                       {newRoutineName === 'Ramadan' && (
                         <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 animate-pulse">
                            <Moon size={16} />
                         </div>
                       )}
                    </div>
                 </div>
              </div>

              <div className="flex gap-4">
                 <button onClick={() => setShowNewRoutineModal(false)} className="flex-1 py-4 rounded-[1.5rem] font-black text-xs uppercase tracking-widest text-emerald-900/40 hover:bg-gray-50 transition-all">বাতিল</button>
                 <button 
                   onClick={createNewRoutine}
                   className="flex-1 py-4 bg-emerald-600 text-white rounded-[1.5rem] font-black text-xs uppercase tracking-widest hover:bg-emerald-700 shadow-xl shadow-emerald-600/20 transition-all"
                 >তৈরি করো</button>
              </div>
           </div>
        </div>
      )}

    </div>
  );
};

export default Routine;
