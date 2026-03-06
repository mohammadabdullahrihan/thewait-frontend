import { useState } from 'react';
import { 
  User, 
  PenTool, 
  Save, 
  Loader2, 
  Trophy, 
  Medal, 
  Zap, 
  Check, 
  Lock, 
  BarChart3, 
  Flame, 
  Target,
  Mail,
  Calendar,
  Award,
  Shield,
  Star,
  Activity,
  History,
  TrendingUp,
  Map,
  Rocket
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../utils/api';
import { xpToNextLevel } from '../utils/helpers';
import { format } from 'date-fns';
import toast from 'react-hot-toast';
import GamificationProfile from '../components/Gamification/Profile';

const Profile = () => {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name: user?.name || '', age: user?.age || '', goal: user?.goal || '' });
  const [saving, setSaving] = useState(false);
  const xp = xpToNextLevel(user?.experience || 0);

  const handleSave = async () => {
    setSaving(true);
    try {
      const res = await authAPI.updateProfile(form);
      updateUser(res.data.user);
      toast.success('প্রোফাইল আপডেট হয়েছে! ✨', {
        icon: '🏆',
        style: { borderRadius: '2rem', background: '#064e3b', color: '#fff' }
      });
    } catch (e) { 
      toast.error('আপডেট করা যায়নি'); 
    } finally { 
      setSaving(false); 
    }
  };

  return (
    <div className="animate-in fade-in duration-700 space-y-10 pb-24">
      
      {/* 🏆 Hero Section: The Warrior Identity */}
      <div className="relative overflow-hidden rounded-[3.5rem] bg-emerald-950 p-1 shadow-2xl">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500 rounded-full blur-[150px] -mr-64 -mt-64 opacity-20 animate-pulse" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500 rounded-full blur-[150px] -ml-40 -mb-40 opacity-10" />
        
        <div className="relative bg-white/5 backdrop-blur-xl rounded-[3.4rem] p-10 flex flex-col xl:flex-row items-center gap-12">
          
          <div className="relative group">
            <div className="w-56 h-56 rounded-full border-[12px] border-white/5 flex items-center justify-center p-2 bg-gradient-to-br from-emerald-500/10 to-blue-500/10 backdrop-blur-3xl shadow-inner">
               <div className="w-full h-full rounded-full border-[12px] border-emerald-500/20 flex items-center justify-center animate-spin-slow">
                 <div className="w-4 h-4 bg-emerald-400 rounded-full absolute top-0 shadow-[0_0_15px_rgba(52,211,153,0.8)]" />
               </div>
               <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-6xl font-black text-white drop-shadow-2xl">{user?.name?.[0]?.toUpperCase()}</span>
               </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-6 py-1 bg-emerald-500 rounded-full shadow-lg shadow-emerald-500/40">
               <span className="text-[10px] font-black text-emerald-950 uppercase tracking-widest whitespace-nowrap">LEVEL {xp.level} WARRIOR</span>
            </div>
          </div>

          <div className="flex-1 space-y-6 text-center xl:text-left">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-center xl:justify-start gap-3">
                 <span className="px-4 py-1 bg-white/10 border border-white/10 rounded-full text-[10px] font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                    <Award size={12} /> IDENTITY VERIFIED
                 </span>
                 <span className="px-4 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest">
                    SINCE {user?.createdAt ? format(new Date(user.createdAt), 'MMM yyyy') : 'N/A'}
                 </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter leading-none">
                 {user?.name}
              </h1>
              <div className="flex flex-wrap justify-center xl:justify-start gap-6 text-emerald-400/60 font-bold text-lg">
                 <span className="flex items-center gap-2"><Mail size={18} /> {user?.email}</span>
                 <span className="flex items-center gap-2"><Target size={18} /> {user?.goal || 'লক্ষ্যহীন যোদ্ধা'}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-4">
               {[
                 { label: 'EXPERIENCE', val: user?.experience || 0, sub: 'XP Points', icon: <Zap size={16} className="text-emerald-400" /> },
                 { label: 'LEVEL', val: xp.level, sub: 'Rank Up', icon: <TrendingUp size={16} className="text-blue-400" /> },
                 { label: 'BADGES', val: user?.badges?.length || 0, sub: 'Achievements', icon: <Award size={16} className="text-purple-400" /> },
                 { label: 'STREAK', val: user?.streak?.current || 0, sub: 'Current', icon: <Flame size={16} className="text-orange-400" /> }
               ].map((s, i) => (
                 <div key={i} className="bg-white/5 border border-white/5 rounded-3xl p-5 space-y-1 group hover:bg-white/[0.08] transition-all">
                    <div className="flex items-center gap-2">
                      {s.icon} <span className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">{s.label}</span>
                    </div>
                    <div className="text-2xl font-black tracking-tight text-white">
                      {s.val}
                    </div>
                    <p className="text-[9px] font-black text-white/20 uppercase tracking-widest leading-none">{s.sub}</p>
                 </div>
               ))}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* 🖊️ Edit Core Identity */}
        <div className="xl:col-span-1 bg-white rounded-[3.5rem] p-10 border border-emerald-50 shadow-sm space-y-10">
           <div className="flex items-center justify-between">
              <div className="space-y-1">
                 <h3 className="text-2xl font-black text-emerald-950 tracking-tight">প্রোফাইল এডিট</h3>
                 <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">আপনার কোর ডিটেইলস আপডেট করুন</p>
              </div>
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 shadow-inner">
                 <PenTool size={24} />
              </div>
           </div>

           <div className="space-y-6">
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">Full Name</label>
                 <input 
                   type="text" 
                   className="w-full bg-emerald-50/50 rounded-2xl px-6 py-4 border border-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm font-bold text-emerald-950 transition-all" 
                   value={form.name} 
                   onChange={e => setForm({...form, name: e.target.value})} 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">Target Goal</label>
                 <input 
                   type="text" 
                   className="w-full bg-emerald-50/50 rounded-2xl px-6 py-4 border border-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm font-bold text-emerald-950 transition-all" 
                   value={form.goal} 
                   onChange={e => setForm({...form, goal: e.target.value})} 
                 />
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-emerald-900/40 uppercase tracking-widest ml-4">Age</label>
                 <input 
                   type="number" 
                   className="w-full bg-emerald-50/50 rounded-2xl px-6 py-4 border border-emerald-100 focus:outline-none focus:ring-4 focus:ring-emerald-500/10 text-sm font-bold text-emerald-950 transition-all" 
                   value={form.age} 
                   onChange={e => setForm({...form, age: e.target.value})} 
                 />
              </div>

              <button 
                onClick={handleSave} 
                disabled={saving}
                className="w-full py-5 bg-emerald-950 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest hover:bg-black shadow-2xl transition-all flex items-center justify-center gap-3 active:scale-95 disabled:opacity-50"
              >
                {saving ? <Loader2 size={24} className="animate-spin" /> : <><Save size={24} /> আপডেট করো</>}
              </button>
           </div>
        </div>
        <div className="xl:col-span-2">
           <GamificationProfile user={user} />
        </div>

      </div>

    </div>
  );
};

export default Profile;
