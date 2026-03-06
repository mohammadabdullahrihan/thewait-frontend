import { useState, useEffect } from 'react';
import { 
  Target, 
  Globe, 
  GraduationCap, 
  BookOpen, 
  Check, 
  Calendar, 
  Flame, 
  Timer, 
  Plus, 
  Trash2, 
  Edit3, 
  ChevronRight, 
  Map, 
  Compass, 
  Rocket, 
  Flag, 
  Star,
  Loader2,
  X,
  Zap,
  TrendingUp,
  Activity,
  Layout,
  Clock,
  Briefcase,
  Plane,
  Heart,
  ArrowRight,
  Circle,
  Eye,
  ArrowUpRight,
  ShieldCheck,
  ChevronLeft
} from 'lucide-react';
import { milestoneAPI } from '../utils/api';
import { daysUntil } from '../utils/helpers';
import { format, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import Loader from '../components/Common/Loader';

const CATEGORY_META = {
  education: { icon: <GraduationCap size={20} />, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-100' },
  career: { icon: <Briefcase size={20} />, color: 'text-indigo-500', bg: 'bg-indigo-50', border: 'border-indigo-100' },
  travel: { icon: <Plane size={20} />, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-100' },
  personal: { icon: <Heart size={20} />, color: 'text-rose-500', bg: 'bg-rose-50', border: 'border-rose-100' },
  finance: { icon: <Zap size={20} />, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-100' },
};

const Milestones = () => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewingMilestone, setViewingMilestone] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    phase: '',
    startDate: '',
    endDate: '',
    status: 'upcoming',
    category: 'education',
    tasks: [],
    priority: 2
  });
  const [newTask, setNewTask] = useState('');

  const fetchMilestones = async () => {
    try {
      const res = await milestoneAPI.get();
      setMilestones(res.data.milestones || []);
    } catch (e) {
      console.error(e);
      toast.error('মাইলস্টোন লোড করা যায়নি');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await milestoneAPI.update(editingId, formData);
        toast.success('মাইলস্টোন আপডেট হয়েছে');
      } else {
        await milestoneAPI.save(formData);
        toast.success('নতুন মাইলস্টোন যুক্ত হয়েছে');
      }
      closeModals();
      fetchMilestones();
    } catch (e) {
      toast.error('সেভ করা যায়নি');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('আপনি কি নিশ্চিত যে এটি মুছে ফেলতে চান?')) return;
    try {
      await milestoneAPI.delete(id);
      toast.success('মুছে ফেলা হয়েছে');
      fetchMilestones();
    } catch (e) {
      toast.error('মুছে ফেলা যায়নি');
    }
  };

  const openEdit = (m) => {
    setEditingId(m._id);
    setFormData({ ...m });
    setShowModal(true);
  };

  const openView = (m) => {
    setViewingMilestone(m);
    setShowViewModal(true);
  };

  const closeModals = () => {
    setShowModal(false);
    setShowViewModal(false);
    setEditingId(null);
    setViewingMilestone(null);
    setFormData({ title: '', phase: '', startDate: '', endDate: '', status: 'upcoming', category: 'education', tasks: [], priority: 2 });
  };

  const addTask = () => {
    if (!newTask.trim()) return;
    setFormData({ ...formData, tasks: [...formData.tasks, newTask.trim()] });
    setNewTask('');
  };

  const removeTask = (idx) => {
    setFormData({ ...formData, tasks: formData.tasks.filter((_, i) => i !== idx) });
  };

  const seedDefault = async () => {
    const defaults = [
      { phase: "Phase 1", title: "SSC Preparation", startDate: "2025-04-01", endDate: "2025-09-30", status: "active", category: "education", tasks: ["সিলেবাস কমপ্লিট", "প্র্যাকটিস পেপার", "মক টেস্ট"] },
      { phase: "Phase 2", title: "GED Preparation", startDate: "2025-10-01", endDate: "2026-03-31", status: "upcoming", category: "education", tasks: ["Math", "Science", "Social Studies", "Language Arts"] },
      { phase: "Phase 3", title: "IELTS Preparation", startDate: "2026-04-01", endDate: "2026-09-30", status: "upcoming", category: "education", tasks: ["Listening", "Reading", "Writing", "Speaking"] },
      { phase: "Phase 4", title: "University Application", startDate: "2026-10-01", endDate: "2026-12-31", status: "upcoming", category: "career", tasks: ["SOP লেখা", "রেকমেন্ডেশন লেটার", "Application Submit"] },
      { phase: "Phase 5", title: "Visa Process", startDate: "2027-01-01", endDate: "2027-02-28", status: "upcoming", category: "travel", tasks: ["ডকুমেন্টস সংগ্রহ", "Visa Apply", "Interview"] },
      { phase: "Phase 6", title: "Journey to EU", startDate: "2027-03-01", endDate: "2027-12-31", status: "upcoming", category: "travel", tasks: ["নতুন জীবনের শুরু"] },
    ];
    setLoading(true);
    try {
      for (const d of defaults) {
        await milestoneAPI.save(d);
      }
      fetchMilestones();
      toast.success('ডিফল্ট টাইমলাইন সেট আপ হয়েছে');
    } catch (e) {
      toast.error('সেট আপ করা যায়নি');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showModal || showViewModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [showModal, showViewModal]);

  if (loading && milestones.length === 0) return <Loader />;

  // Calculate stats
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const progressPercent = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;
  const mainTarget = milestones.find(m => m.title.toLowerCase().includes('eu')) || milestones[milestones.length - 1];

  return (
    <>
      <div className="animate-in fade-in duration-700 space-y-8 pb-24">
      
      {/* 🚀 Hero: The Grand Map of Destiny */}
      <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] p-1 shadow-sm border border-emerald-100 bg-white group">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-50 rounded-full blur-[120px] -mr-40 -mt-40 opacity-60 group-hover:scale-125 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-50 rounded-full blur-[100px] -ml-20 -mb-20 opacity-40" />
        
        <div className="relative px-6 py-10 md:px-8 md:py-12 flex flex-col xl:flex-row xl:items-center justify-between gap-10 md:gap-12">
          <div className="space-y-6 max-w-2xl">
            <div className="flex flex-wrap items-center gap-3">
              <span className="px-3 py-1 bg-emerald-600 text-[9px] md:text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
                LIFETIME JOURNEY
              </span>
              <span className="px-3 py-1 bg-white border border-emerald-100 text-[9px] md:text-[10px] font-black text-emerald-600 rounded-full uppercase tracking-widest flex items-center gap-2">
                <Compass size={10} className="animate-spin-slow md:w-3 md:h-3" /> NAVIGATION ACTIVE
              </span>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-3xl md:text-6xl font-black tracking-tighter text-emerald-950 leading-tight">
                তোমার ভবিষ্যতের <span className="bg-gradient-to-r from-emerald-600 to-blue-500 bg-clip-text text-transparent">মাস্টার ম্যাপ</span>
              </h1>
              <p className="text-emerald-950/40 font-bold text-base md:text-lg max-w-lg leading-relaxed">
                প্রতিটি মাইলস্টোন তোমার বড় লক্ষ্যের একেকটি ধাপ। শৃঙ্খলার সাথে প্রতিটি ধাপ জয় করো।
              </p>
            </div>

            <div className="flex items-center gap-6 md:gap-8 pt-2 md:pt-4">
               <div className="flex items-center gap-3 md:gap-4">
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[2rem] bg-emerald-950 flex items-center justify-center text-white shadow-xl">
                    <Flag size={20} className="md:w-7 md:h-7" />
                 </div>
                 <div>
                    <div className="text-xl md:text-3xl font-black text-emerald-950 leading-none">{milestones.length}</div>
                    <p className="text-[8px] md:text-[10px] font-black text-emerald-50 uppercase tracking-widest mt-1">TOTAL PHASES</p>
                 </div>
               </div>
               <div className="w-px h-10 md:h-12 bg-emerald-100" />
               <div className="flex items-center gap-3 md:gap-4">
                 <div className="w-12 h-12 md:w-16 md:h-16 rounded-[1.5rem] md:rounded-[2rem] bg-blue-50 flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                    <Rocket size={20} className="md:w-7 md:h-7" />
                 </div>
                 <div>
                    <div className="text-xl md:text-3xl font-black text-emerald-950 leading-none">{Math.round(progressPercent)}%</div>
                    <p className="text-[8px] md:text-[10px] font-black text-blue-500 uppercase tracking-widest mt-1">OVERALL PROGRESS</p>
                 </div>
               </div>
            </div>
          </div>

          {mainTarget && (
            <div className="bg-emerald-950 p-8 md:p-10 rounded-[3rem] md:rounded-[4rem] text-white space-y-6 md:space-y-8 min-w-full xl:min-w-[320px] shadow-2xl relative overflow-hidden group/target">
               <div className="absolute top-0 right-0 p-6 opacity-5 group-hover/target:scale-110 transition-transform duration-700">
                  <Globe size={180} strokeWidth={1} />
               </div>
               
               <div className="space-y-2 relative z-10">
                  <p className="text-[9px] md:text-[11px] font-black text-emerald-400 uppercase tracking-[0.2em]">ULTIMATE TARGET</p>
                  <h3 className="text-2xl md:text-3xl font-black tracking-tight">{mainTarget.title}</h3>
                  <div className="flex items-center gap-2 text-emerald-400/60 font-bold text-xs md:text-sm">
                     <Calendar size={14} /> {mainTarget.startDate}
                  </div>
               </div>

               <div className="space-y-4 relative z-10">
                  <div className="flex items-end justify-between">
                     <div className="text-4xl md:text-5xl font-black tracking-tighter text-white">
                        {daysUntil(mainTarget.startDate) > 0 ? daysUntil(mainTarget.startDate) : 0}
                        <span className="text-base md:text-lg font-black ml-2 text-emerald-400">DAYS</span>
                     </div>
                     <p className="text-[9px] md:text-[10px] font-black uppercase text-emerald-500 mb-1 leading-none">REMAINING</p>
                  </div>
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                     <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" style={{ width: `${progressPercent}%` }} />
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      {/* 🛠️ Action Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 px-2 md:px-4">
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
           <button 
             onClick={() => setShowModal(true)}
             className="flex items-center justify-center gap-3 bg-emerald-600 text-white px-8 py-4 md:py-5 rounded-[1.8rem] md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest shadow-xl shadow-emerald-600/20 hover:bg-emerald-700 transition-all active:scale-95 w-full sm:w-auto"
           >
              <Plus size={20} /> নতুন ধাপ
           </button>
           {milestones.length === 0 && (
             <button 
                onClick={seedDefault}
                className="flex items-center justify-center gap-3 bg-white border border-emerald-100 text-emerald-600 px-8 py-4 md:py-5 rounded-[1.8rem] md:rounded-[2rem] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-emerald-50 transition-all w-full sm:w-auto"
             >
                <Zap size={20} /> টাইমলাইন সেট আপ করো
             </button>
           )}
        </div>

        <div className="flex items-center justify-center gap-3 md:gap-4 bg-white px-5 md:px-6 py-3.5 md:py-4 rounded-[1.8rem] md:rounded-[2rem] border border-emerald-50 shadow-sm w-full md:w-auto">
           <Activity size={16} className="text-emerald-400" />
           <p className="text-[10px] md:text-xs font-black text-emerald-950 uppercase tracking-widest">বর্তমানে <span className="text-emerald-500">{milestones.filter(m=>m.status==='active').length} টি ফেজ</span> চলমান</p>
        </div>
      </div>

      {/* 🗺️ Timeline Explorer */}
      <div className="relative">
         {/* The Vertical Line */}
         <div className="absolute left-8 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-100 via-blue-100 to-emerald-50 rounded-full hidden lg:block" />

         <div className="space-y-12 relative z-10">
            {milestones.length > 0 ? (
              milestones.map((m, idx) => {
                const meta = CATEGORY_META[m.category] || CATEGORY_META.personal;
                const isActive = m.status === 'active';
                const isCompleted = m.status === 'completed';

                return (
                  <div key={m._id} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start group">
                     
                     {/* Horizontal Connector (Hidden on Mobile) */}
                     <div className="hidden lg:flex lg:col-span-1 justify-center relative pt-10">
                        <div className={`w-6 h-6 rounded-full border-4 relative z-10 transition-all duration-500 shadow-lg ${isActive ? 'bg-emerald-600 border-emerald-100 scale-125 ring-8 ring-emerald-500/10' : isCompleted ? 'bg-blue-500 border-blue-50' : 'bg-white border-gray-100 group-hover:border-emerald-200'}`} />
                        <div className="absolute right-0 top-13 w-full h-[2px] bg-emerald-50" />
                     </div>

                     <div className="lg:col-span-11">
                        <div className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[3.5rem] bg-white border transition-all duration-500 flex flex-col md:flex-row xl:flex-row gap-6 md:gap-10 items-start ${isActive ? 'border-emerald-200 shadow-2xl scale-[1.01] ring-1 ring-emerald-100' : 'border-emerald-50 shadow-sm hover:border-emerald-100'}`}>
                           
                           {/* Info Section */}
                           <div className="flex-1 space-y-4 md:space-y-6 w-full">
                              <div className="flex flex-wrap items-center gap-2 md:gap-3">
                                 <span className={`px-3 md:px-4 py-1.5 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest flex items-center gap-2 ${meta.bg} ${meta.color} border ${meta.border}`}>
                                    <div className="md:scale-100 scale-75">{meta.icon}</div> {m.category}
                                 </span>
                                 <span className="text-[8px] md:text-[10px] font-black text-emerald-900/30 uppercase tracking-widest leading-none">{m.phase}</span>
                              </div>

                              <div className="space-y-2">
                                 <h3 className="text-xl md:text-3xl font-black text-emerald-950 tracking-tight flex items-center gap-3">
                                    {m.title}
                                    {isCompleted && <Check className="text-emerald-500 md:w-6 md:h-6" size={20} />}
                                 </h3>
                                 <div className="flex flex-wrap items-center gap-3 md:gap-4 text-emerald-900/40 font-bold text-[10px] md:text-sm">
                                    <div className="flex items-center gap-2 bg-slate-50 px-2 md:px-3 py-1 rounded-lg border border-slate-100">
                                       <Calendar size={12} className="md:w-3.5 md:h-3.5" /> {m.startDate} {m.endDate && <><ArrowRight size={10} className="md:w-3 md:h-3" /> {m.endDate}</>}
                                    </div>
                                    <div className="flex items-center gap-1 leading-none">
                                       <Clock size={12} className="md:w-3.5 md:h-3.5" /> {daysUntil(m.startDate) > 0 ? `${daysUntil(m.startDate)} দিন বাকি` : 'শুরু হয়েছে'}
                                    </div>
                                 </div>
                              </div>

                              {m.tasks && m.tasks.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-1 md:pt-2">
                                   {m.tasks.map((t, i) => (
                                      <span key={i} className="px-3 md:px-5 py-2 md:py-2.5 rounded-xl md:rounded-2xl bg-gray-50/50 border border-gray-100 text-[10px] md:text-xs font-black text-emerald-900/60 flex items-center gap-2">
                                         <Circle size={6} className="text-emerald-300 md:w-2 md:h-2" /> {t}
                                      </span>
                                   ))}
                                </div>
                              )}
                           </div>

                           {/* Status & Actions */}
                           <div className="w-full md:w-max xl:w-auto flex flex-col gap-3 md:gap-4 shrink-0">
                              <div className={`px-6 md:px-8 py-4 md:py-5 rounded-[1.8rem] md:rounded-[2.5rem] border text-center ${isActive ? 'bg-emerald-950 border-emerald-950 text-white shadow-xl shadow-emerald-950/20' : isCompleted ? 'bg-blue-50 border-blue-100 text-blue-600' : 'bg-gray-50 border-gray-100 text-gray-400'}`}>
                                 <p className="text-[8px] md:text-[9px] font-black uppercase tracking-widest mb-1 opacity-60">PHASE STATUS</p>
                                 <h4 className="text-base md:text-lg font-black uppercase tracking-tight flex items-center justify-center gap-2">
                                    {isActive ? <><Flame size={18} className="text-orange-400 md:w-5 md:h-5" /> ACTIVE</> : isCompleted ? <><Star size={18} className="text-blue-500 md:w-5 md:h-5" /> DONE</> : <><Timer size={18} className="md:w-5 md:h-5" /> PENDING</>}
                                 </h4>
                              </div>

                              <div className="grid grid-cols-3 gap-2 w-full">
                                 <button onClick={() => openEdit(m)} className="p-4 md:p-5 rounded-2xl md:rounded-[1.8rem] bg-white border border-emerald-50 text-emerald-950 hover:bg-emerald-50 transition-all flex items-center justify-center">
                                    <Edit3 size={16} className="md:w-4.5 md:h-4.5" />
                                 </button>
                                 <button onClick={() => handleDelete(m._id)} className="p-4 md:p-5 rounded-2xl md:rounded-[1.8rem] bg-white border border-rose-50 text-rose-500 hover:bg-rose-50 transition-all flex items-center justify-center">
                                    <Trash2 size={16} className="md:w-4.5 md:h-4.5" />
                                 </button>
                                 <button onClick={() => openView(m)} className="p-4 md:p-5 rounded-2xl md:rounded-[1.8rem] bg-emerald-600 text-white hover:bg-emerald-700 transition-all flex items-center justify-center shadow-lg shadow-emerald-600/20 active:scale-95 group/btn">
                                    <Eye size={18} className="md:w-5 md:h-5 group-hover/btn:scale-110 transition-transform" />
                                 </button>
                              </div>
                           </div>
                        </div>
                     </div>
                  </div>
                );
              })
            ) : (
               <div className="col-span-full py-24 flex flex-col items-center justify-center text-center space-y-6 bg-emerald-50/10 rounded-[4rem] border-2 border-dashed border-emerald-100/50">
                   <div className="w-24 h-24 rounded-full bg-white border border-emerald-50 flex items-center justify-center text-emerald-100 shadow-inner">
                      <Rocket size={48} strokeWidth={1} />
                   </div>
                   <div className="space-y-2">
                      <p className="text-lg font-black text-emerald-950 uppercase tracking-widest">কোনো মাইলস্টোন নেই</p>
                      <p className="text-xs font-bold text-emerald-900/30">আপনার জীবনযাত্রার মানচিত্র তৈরি করতে টাইমলাইন সেট আপ করুন</p>
                   </div>
                   <button onClick={seedDefault} className="px-10 py-5 bg-emerald-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:scale-105 transition-all shadow-2xl">
                      সেট আপ টাইমলাইন
                   </button>
               </div>
            )}
         </div>
      </div>

      </div>

      {/* 📝 Milestone Edit/Add Modal */}
      {showModal && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center p-0 md:p-4 overflow-y-auto">
           <div className="fixed inset-0 bg-emerald-950/40 backdrop-blur-md" onClick={closeModals} />
           <div className="relative bg-white w-full max-w-2xl rounded-t-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden animate-in slide-in-from-top duration-500 flex flex-col mt-10 md:mt-0">
              
              <div className="p-6 md:p-10 flex items-center justify-between border-b border-gray-100 bg-white sticky top-0 z-20">
                 <div className="space-y-1">
                    <h2 className="text-2xl md:text-3xl font-black text-emerald-950 tracking-tight">{editingId ? 'মাইলস্টোন আপডেট' : 'নতুন মাইলস্টোন'}</h2>
                    <p className="text-[9px] md:text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">লক্ষ্য নির্ধারণ করুন</p>
                 </div>
                 <button onClick={closeModals} className="p-3 md:p-4 bg-gray-50 rounded-xl md:rounded-2xl text-gray-400 hover:text-rose-500 transition-all"><X size={20} className="md:w-6 md:h-6" /></button>
              </div>

              <div className="flex-1 p-6 md:p-10 space-y-8">
                 <form onSubmit={handleSave} className="space-y-6 md:space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                       <div className="space-y-2 col-span-2">
                          <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">TITLE</label>
                          <input 
                            className="w-full bg-gray-50 rounded-2xl px-6 py-4 border border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold text-emerald-950 outline-none"
                            placeholder="e.g. Journey to EU, IELTS Success"
                            value={formData.title}
                            onChange={e => setFormData({...formData, title: e.target.value})}
                            required
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">PHASE NAME</label>
                          <input 
                            className="w-full bg-gray-50 rounded-2xl px-6 py-4 border border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold text-emerald-950 outline-none"
                            placeholder="e.g. Phase 1"
                            value={formData.phase}
                            onChange={e => setFormData({...formData, phase: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">CATEGORY</label>
                          <select 
                            className="w-full bg-gray-50 rounded-2xl px-6 py-4 border border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold text-emerald-950 outline-none appearance-none"
                            value={formData.category}
                            onChange={e => setFormData({...formData, category: e.target.value})}
                          >
                             {Object.keys(CATEGORY_META).map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                          </select>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">START DATE</label>
                          <input 
                            type="date"
                            className="w-full bg-gray-50 rounded-2xl px-6 py-4 border border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold text-emerald-950 outline-none"
                            value={formData.startDate}
                            onChange={e => setFormData({...formData, startDate: e.target.value})}
                            required
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">END DATE (OPTIONAL)</label>
                          <input 
                            type="date"
                            className="w-full bg-gray-50 rounded-2xl px-6 py-4 border border-transparent focus:bg-white focus:border-emerald-100 focus:ring-4 focus:ring-emerald-500/5 transition-all text-sm font-bold text-emerald-950 outline-none"
                            value={formData.endDate}
                            onChange={e => setFormData({...formData, endDate: e.target.value})}
                          />
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">STATUS</label>
                          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                             {['upcoming', 'active', 'completed'].map(s => (
                               <button 
                                 key={s}
                                 type="button"
                                 onClick={() => setFormData({...formData, status: s})}
                                 className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.status === s ? 'bg-emerald-950 text-white shadow-xl' : 'text-gray-400 hover:text-emerald-600'}`}
                               >
                                  {s}
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="space-y-2">
                          <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">PRIORITY</label>
                          <div className="flex bg-gray-50 p-1.5 rounded-2xl border border-gray-100">
                             {[1, 2, 3].map(p => (
                               <button 
                                 key={p}
                                 type="button"
                                 onClick={() => setFormData({...formData, priority: p})}
                                 className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${formData.priority === p ? 'bg-emerald-950 text-white shadow-xl' : 'text-gray-400 hover:text-emerald-600'}`}
                               >
                                  {p === 1 ? 'High' : p === 2 ? 'Mid' : 'Low'}
                               </button>
                             ))}
                          </div>
                       </div>
                    </div>

                     <div className="space-y-4">
                        <label className="text-[9px] md:text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">TASKS & STEPS</label>
                        <div className="flex gap-2">
                           <input 
                             className="flex-1 bg-gray-50 rounded-xl md:rounded-2xl px-5 md:px-6 py-3.5 md:py-4 border border-transparent focus:bg-white focus:border-emerald-100 transition-all text-sm font-bold text-emerald-950 outline-none"
                             placeholder="নতুন টাস্ক..."
                             value={newTask}
                             onChange={e => setNewTask(e.target.value)}
                           />
                           <button type="button" onClick={addTask} className="p-3.5 md:p-4 bg-emerald-950 text-white rounded-xl md:rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"><Plus size={20} /></button>
                        </div>
                        <div className="flex flex-wrap gap-2">
                           {formData.tasks.map((t, i) => (
                              <span key={i} className="px-4 md:px-5 py-2.5 md:py-3 bg-white text-emerald-700 rounded-xl md:rounded-2xl text-[10px] md:text-[11px] font-black flex items-center gap-2 border border-emerald-50 shadow-sm animate-in slide-in-from-left-2 transition-all">
                                 <Circle size={6} className="text-emerald-300 md:w-2 md:h-2" /> {t} <X size={14} className="cursor-pointer text-emerald-200 hover:text-rose-500" onClick={() => removeTask(i)} />
                              </span>
                           ))}
                           {formData.tasks.length === 0 && <p className="text-[10px] md:text-[11px] font-bold text-gray-300 italic px-4">কোনো টাস্ক যুক্ত করা হয়নি</p>}
                        </div>
                     </div>

                  </form>
                  
                  <div className="pt-8 md:pt-10">
                     <button 
                        onClick={handleSave}
                        className="w-full py-5 md:py-6 bg-emerald-950 text-white rounded-[2rem] md:rounded-[2.5rem] font-black text-xs md:text-sm uppercase tracking-widest hover:bg-black shadow-2xl shadow-emerald-950/20 transition-all active:scale-98"
                     >
                        সফলভাবে ডিভাইন করো
                     </button>
                  </div>
               </div>
            </div>
         </div>
      )}

      {/* 🔍 View Milestone Detail Modal */}
      {showViewModal && viewingMilestone && (
        <div className="fixed inset-0 z-[9999] flex items-start justify-center p-0 md:p-4 overflow-y-auto">
           <div className="fixed inset-0 bg-emerald-950/60 backdrop-blur-xl" onClick={closeModals} />
           <div className="relative bg-white w-full max-w-2xl rounded-t-[3rem] md:rounded-[4rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom duration-500 flex flex-col mt-10 md:mt-0">
              
              {/* Header Immersive */}
              <div className="relative p-8 md:p-12 bg-emerald-950 text-white overflow-hidden shrink-0">
                 <div className="absolute top-0 right-0 p-8 md:p-12 opacity-5 scale-110 md:scale-150 rotate-12">
                    {CATEGORY_META[viewingMilestone.category]?.icon || <Globe size={200} />}
                 </div>
                 
                 <div className="relative z-10 space-y-4 md:space-y-6">
                    <div className="flex items-center gap-2 md:gap-3">
                       <span className="px-4 md:px-5 py-1.5 md:py-2 bg-white/10 text-emerald-400 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest border border-white/5">
                          {viewingMilestone.category}
                       </span>
                       <span className="px-4 md:px-5 py-1.5 md:py-2 bg-emerald-500 text-emerald-950 rounded-xl md:rounded-2xl text-[8px] md:text-[10px] font-black uppercase tracking-widest">
                          {viewingMilestone.status}
                       </span>
                    </div>

                    <div className="space-y-1 md:space-y-2">
                       <h2 className="text-3xl md:text-5xl font-black tracking-tighter leading-tight bg-gradient-to-r from-white to-emerald-400 bg-clip-text text-transparent">
                          {viewingMilestone.title}
                       </h2>
                       <p className="text-white/40 font-bold text-sm md:text-lg">{viewingMilestone.phase} — দ্য গ্র্যান্ড টাইমলাইন</p>
                    </div>

                    <div className="flex flex-wrap gap-6 md:gap-8 pt-2 md:pt-4">
                       <div className="space-y-1">
                          <p className="text-[8px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest">TIMELINE</p>
                          <div className="flex items-center gap-2 md:gap-3 text-sm md:text-lg font-black italic">
                             <Calendar size={16} className="text-emerald-400 md:w-4.5 md:h-4.5" />
                             {viewingMilestone.startDate} <ChevronLeft className="rotate-180 md:w-3.5 md:h-3.5" size={14} /> {viewingMilestone.endDate || 'Ongoing'}
                          </div>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Tasks Content */}
              <div className="flex-1 p-8 md:p-12 space-y-8 md:space-y-10">
                 <div className="space-y-4 md:space-y-6">
                    <div className="flex items-center justify-between">
                       <h4 className="text-lg md:text-xl font-black text-emerald-950 tracking-tight">অপারেশনাল টাস্ক লিস্ট</h4>
                       <span className="text-[10px] md:text-xs font-black text-emerald-300 uppercase tracking-[0.2em]">{viewingMilestone.tasks?.length || 0} ITEMS</span>
                    </div>
                    
                    <div className="space-y-3 md:space-y-4">
                       {viewingMilestone.tasks && viewingMilestone.tasks.length > 0 ? (
                          viewingMilestone.tasks.map((task, i) => (
                             <div key={i} className="flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-2xl md:rounded-3xl bg-gray-50 border border-gray-100 group transition-all hover:bg-emerald-50 hover:border-emerald-100">
                                <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl md:rounded-2xl bg-white border border-gray-100 flex items-center justify-center text-emerald-600 shadow-sm transition-all group-hover:bg-emerald-600 group-hover:text-white shrink-0 text-xs md:text-sm">
                                   {i + 1}
                                </div>
                                <p className="text-sm md:text-base font-bold text-emerald-950">{task}</p>
                             </div>
                          ))
                       ) : (
                          <div className="py-8 md:py-12 text-center bg-gray-50 rounded-[2rem] md:rounded-[3rem] border border-dashed border-gray-200">
                             <p className="text-xs md:text-sm font-bold text-gray-400 italic">কোনো ইনডিভিজুয়াল টাস্ক ডিফাইন করা নেই</p>
                          </div>
                       )}
                    </div>
                 </div>

                 <div className="p-6 md:p-8 bg-emerald-50 rounded-[2.5rem] md:rounded-[3rem] border border-emerald-100 flex items-center justify-between">
                    <div className="flex items-center gap-3 md:gap-4">
                       <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-sm shrink-0">
                          <TrendingUp size={20} className="md:w-6 md:h-6" />
                       </div>
                       <div className="min-w-0">
                          <p className="text-[8px] md:text-[10px] font-black text-emerald-500 uppercase tracking-widest leading-none mb-1">DAYS REMAINING</p>
                          <p className="text-sm md:text-lg font-black text-emerald-950 tracking-tight truncate">{daysUntil(viewingMilestone.startDate) > 0 ? daysUntil(viewingMilestone.startDate) : 0} Days Until Start</p>
                       </div>
                    </div>
                    <ArrowUpRight size={20} className="text-emerald-300 md:w-6 md:h-6 shrink-0" />
                 </div>

                 {/* Modal Footer (Inside scroll content for mobile accessibility) */}
                 <div className="pt-4 flex items-center justify-center">
                    <button onClick={closeModals} className="w-full md:w-auto px-12 py-5 bg-emerald-950 text-white rounded-[2rem] font-black text-xs uppercase tracking-widest hover:bg-black shadow-2xl shadow-emerald-950/20 active:scale-95 transition-all">
                       ক্লোজ ভিউ
                    </button>
                 </div>
              </div>
           </div>
        </div>
      )}
    </>
  );
};

export default Milestones;
