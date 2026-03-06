import { useState, useEffect } from 'react';
import { awardAPI } from '../../utils/api';
import { Award, Shield, Star, Crown, Zap, Flame, Trophy } from 'lucide-react';
import Loader from '../Common/Loader';
import { xpToNextLevel } from '../../utils/helpers';

const RARITY_COLORS = {
  Common: 'bg-slate-100 text-slate-600 border-slate-200',
  Rare: 'bg-emerald-100 text-emerald-600 border-emerald-200',
  Epic: 'bg-purple-100 text-purple-600 border-purple-200',
  Legendary: 'bg-orange-100 text-orange-600 border-orange-200 shadow-[0_0_15px_rgba(251,146,60,0.4)]',
};

const RARITY_ICONS = {
  Common: <Star size={24} />,
  Rare: <Shield size={24} />,
  Epic: <Zap size={24} />,
  Legendary: <Crown size={24} />,
};

const GamificationProfile = ({ user }) => {
  const [catalog, setCatalog] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBadges = async () => {
      try {
        const res = await awardAPI.getBadges();
        setCatalog(res.data.catalog || []);
      } catch (error) {
        console.error('Failed to load badges:', error);
      } finally {
        setLoading(false);
      }
    };
    loadBadges();
  }, []);

  if (loading) return <Loader />;

  const xpData = xpToNextLevel(user?.experience || 0);

  return (
    <div className="space-y-8">
      {/* 🚀 Hero Profile Banner */}
      <div className="relative overflow-hidden rounded-[2.5rem] md:rounded-[3.5rem] bg-gradient-to-br from-emerald-950 to-slate-900 text-white p-8 md:p-12 shadow-2xl">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Trophy size={200} />
        </div>
        
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-12">
          {/* Level Avatar */}
          <div className="relative">
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-slate-800 border-4 border-emerald-500 shadow-[0_0_30px_rgba(16,185,129,0.3)] flex items-center justify-center p-2">
              <div className="w-full h-full rounded-full bg-emerald-900/50 flex flex-col items-center justify-center gap-1 border border-emerald-500/30">
                <Crown size={32} className="text-emerald-400" />
                <span className="text-3xl font-black text-white">{xpData.level}</span>
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-400">Level</span>
              </div>
            </div>
            <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 px-4 py-1.5 bg-emerald-500 rounded-full text-[10px] font-black uppercase tracking-widest shadow-lg whitespace-nowrap">
              {xpData.level >= 30 ? 'Supreme Overlord' : xpData.level >= 15 ? 'Elite Commander' : xpData.level >= 5 ? 'Shadow Warrior' : 'Vanguard Recruit'}
            </div>
          </div>

          <div className="space-y-5 text-center md:text-left flex-1 w-full">
            <div>
              <h1 className="text-3xl md:text-5xl font-black tracking-tight">{user?.name}</h1>
              <p className="text-emerald-400/80 font-bold uppercase tracking-widest text-xs mt-1">Warrior Profile</p>
            </div>
            
            <div className="space-y-2 max-w-sm">
              <div className="flex justify-between text-xs font-black uppercase text-slate-300">
                <span>XP Progress</span>
                <span className="text-emerald-400">{xpData.progress} / {xpData.needed}</span>
              </div>
              <div className="h-3 w-full bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                <div 
                  className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" 
                  style={{ width: `${Math.min(100, Math.max(0, xpData.percentage))}%` }} 
                />
              </div>
              <p className="text-[10px] text-slate-400 font-bold">Total Power: <span className="text-emerald-400">{user?.experience || 0} XP</span></p>
            </div>
          </div>
        </div>
      </div>

      {/* 🎖️ Badges & Achievements */}
      <div className="p-6 md:p-10 rounded-[2.5rem] bg-white border border-slate-100 shadow-sm space-y-8">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-orange-50 text-orange-500 rounded-2xl">
            <Award size={24} />
          </div>
          <div>
            <h3 className="text-2xl font-black text-slate-900 tracking-tight">Warrior Badges</h3>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Unlock achievements</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
          {catalog.map(badge => {
            const owned = user?.badges?.some(b => b.id === badge.id);
            return (
              <div 
                key={badge.id} 
                className={`p-6 rounded-[2rem] flex flex-col items-center gap-4 text-center transition-all border ${
                  owned 
                    ? RARITY_COLORS[badge.rarity] + " scale-100 opacity-100"
                    : 'bg-slate-50 border-slate-100 text-slate-400 opacity-60 grayscale'
                }`}
              >
                <div className={`p-4 rounded-2xl ${owned ? 'bg-white/20' : 'bg-white shadow-inner'} border border-current/20`}>
                  {RARITY_ICONS[badge.rarity] || <Award size={32} />}
                </div>
                <div>
                  <h4 className="text-sm font-black mb-1">{badge.name}</h4>
                  <p className="text-[10px] font-bold opacity-80 leading-snug">{badge.description}</p>
                </div>
                <div className="mt-auto pt-2">
                   <span className="px-3 py-1 bg-black/5 rounded-full text-[9px] font-black uppercase tracking-widest">
                     {badge.rarity} {owned ? '• UNLOCKED' : ''}
                   </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GamificationProfile;
