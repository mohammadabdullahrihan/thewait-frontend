import { Link } from 'react-router-dom';

const EMPTY_STATES = {
  routine: {
    emoji: '📋',
    title: 'রুটিন শূন্য!',
    desc: 'একটি মজবুত রুটিনই পারে তোমার দিনটি বদলে দিতে। আজই প্রথম টাস্কটি যোগ করো।',
    action: 'নতুন টাস্ক যোগ করো',
    link: null,
    illustration: (
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="20" y="10" width="80" height="80" rx="12" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="2"/>
        <rect x="32" y="28" width="56" height="8" rx="4" fill="#a7f3d0"/>
        <rect x="32" y="42" width="40" height="8" rx="4" fill="#d1fae5"/>
        <rect x="32" y="56" width="50" height="8" rx="4" fill="#d1fae5"/>
        <circle cx="28" cy="32" r="4" fill="#10b981"/>
        <circle cx="28" cy="46" r="4" fill="#a7f3d0"/>
        <circle cx="28" cy="60" r="4" fill="#a7f3d0"/>
        <path d="M85 75 L95 65 L100 70 L95 85 Z" fill="#10b981" opacity="0.6"/>
      </svg>
    )
  },
  habits: {
    emoji: '🔥',
    title: 'কোনো হ্যাবিট নেই!',
    desc: 'ছোট ছোট হ্যাবিটই বড় পরিবর্তন আনে। আজই তোমার প্রথম হ্যাবিট ট্র্যাক করো।',
    action: 'হ্যাবিট যোগ করো',
    link: '/habits',
    illustration: (
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="60" cy="50" r="36" fill="#fff7ed" stroke="#fed7aa" strokeWidth="2"/>
        <path d="M55 70 C55 70 45 58 48 46 C50 37 58 34 60 40 C62 34 70 37 72 46 C75 58 65 70 60 74 Z" fill="#f97316" opacity="0.8"/>
        <path d="M57 62 C57 62 52 56 54 50 C55 45 58 43 60 47" fill="#fde68a"/>
      </svg>
    )
  },
  journal: {
    emoji: '📔',
    title: 'জার্নাল খালি!',
    desc: 'প্রতিদিনের অভিজ্ঞতা লিখে রাখো। তোমার চিন্তাগুলোই তোমার ভবিষ্যৎ নির্ধারণ করে।',
    action: 'আজকের জার্নাল লিখো',
    link: '/journal',
    illustration: (
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="25" y="10" width="70" height="80" rx="10" fill="#f0fdf4" stroke="#bbf7d0" strokeWidth="2"/>
        <rect x="25" y="10" width="12" height="80" rx="6" fill="#10b981" opacity="0.3"/>
        <rect x="45" y="28" width="38" height="4" rx="2" fill="#bbf7d0"/>
        <rect x="45" y="38" width="30" height="4" rx="2" fill="#d1fae5"/>
        <rect x="45" y="48" width="34" height="4" rx="2" fill="#d1fae5"/>
        <rect x="45" y="58" width="24" height="4" rx="2" fill="#d1fae5"/>
        <path d="M80 70 L88 62 L92 66 L84 80 Z" fill="#10b981"/>
        <circle cx="91" cy="61" r="4" fill="#059669"/>
      </svg>
    )
  },
  study: {
    emoji: '📚',
    title: 'কোনো সাবজেক্ট নেই!',
    desc: 'জ্ঞানই শক্তি। একটি সাবজেক্ট বেছে পড়াশোনা শুরু করো।',
    action: 'স্টাডি শুরু করো',
    link: '/study',
    illustration: (
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="15" y="20" width="40" height="56" rx="6" fill="#eff6ff" stroke="#bfdbfe" strokeWidth="2"/>
        <rect x="25" y="30" width="22" height="4" rx="2" fill="#93c5fd"/>
        <rect x="25" y="40" width="18" height="4" rx="2" fill="#bfdbfe"/>
        <rect x="25" y="50" width="20" height="4" rx="2" fill="#bfdbfe"/>
        <rect x="65" y="15" width="40" height="56" rx="6" fill="#f0fdf4" stroke="#a7f3d0" strokeWidth="2"/>
        <rect x="75" y="25" width="22" height="4" rx="2" fill="#6ee7b7"/>
        <rect x="75" y="35" width="18" height="4" rx="2" fill="#a7f3d0"/>
        <rect x="75" y="45" width="20" height="4" rx="2" fill="#a7f3d0"/>
        <path d="M50 50 L70 40" stroke="#10b981" strokeWidth="2" strokeDasharray="3 2"/>
      </svg>
    )
  },
  workout: {
    emoji: '💪',
    title: 'ওয়ার্কআউট লগ নেই!',
    desc: 'শরীর ও মন একসাথে শক্তিশালী হয়। আজকের সেশন লগ করো।',
    action: 'ওয়ার্কআউট লগ করো',
    link: '/workout',
    illustration: (
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="48" y="42" width="24" height="16" rx="4" fill="#fce7f3" stroke="#f9a8d4" strokeWidth="2"/>
        <rect x="18" y="44" width="14" height="12" rx="4" fill="#f43f5e" opacity="0.7"/>
        <rect x="32" y="46" width="16" height="8" rx="3" fill="#fb7185"/>
        <rect x="72" y="46" width="16" height="8" rx="3" fill="#fb7185"/>
        <rect x="88" y="44" width="14" height="12" rx="4" fill="#f43f5e" opacity="0.7"/>
        <rect x="12" y="47" width="6" height="6" rx="2" fill="#ff1a4e" opacity="0.6"/>
        <rect x="102" y="47" width="6" height="6" rx="2" fill="#ff1a4e" opacity="0.6"/>
      </svg>
    )
  },
  general: {
    emoji: '✨',
    title: 'কিছুই নেই!',
    desc: 'শুরু করো, ছোট পদক্ষেপই বড় পরিবর্তন আনে।',
    action: 'শুরু করো',
    link: null,
    illustration: (
      <svg width="120" height="100" viewBox="0 0 120 100" fill="none">
        <circle cx="60" cy="50" r="30" fill="#f0fdf4" stroke="#a7f3d0" strokeWidth="2"/>
        <path d="M46 50 L55 59 L74 40" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="30" cy="25" r="6" fill="#f0fdf4" stroke="#a7f3d0" strokeWidth="1.5"/>
        <circle cx="90" cy="30" r="4" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1.5"/>
        <circle cx="20" cy="70" r="5" fill="#f0fdf4" stroke="#a7f3d0" strokeWidth="1.5"/>
      </svg>
    )
  }
};

const EmptyState = ({ type = 'general', onAction, compact = false }) => {
  const state = EMPTY_STATES[type] || EMPTY_STATES.general;

  if (compact) {
    return (
      <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 bg-gradient-to-b from-emerald-50/30 to-transparent rounded-[3rem] border-2 border-dashed border-emerald-100">
        <div className="w-16 h-16 bg-white rounded-[1.5rem] flex items-center justify-center shadow-sm border border-emerald-100 text-2xl">
          {state.emoji}
        </div>
        <div className="space-y-1 px-6">
          <h4 className="text-base font-black text-emerald-950">{state.title}</h4>
          <p className="text-xs font-bold text-emerald-900/40 max-w-[240px]">{state.desc}</p>
        </div>
        {(onAction || state.link) && (
          state.link ? (
            <Link
              to={state.link}
              className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              {state.action} →
            </Link>
          ) : (
            <button
              onClick={onAction}
              className="px-6 py-3 bg-emerald-600 text-white rounded-2xl text-xs font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-600/20 hover:scale-105 active:scale-95"
            >
              {state.action} →
            </button>
          )
        )}
      </div>
    );
  }

  return (
    <div className="py-16 md:py-24 flex flex-col items-center justify-center text-center space-y-6 bg-gradient-to-b from-emerald-50/20 to-transparent rounded-[3.5rem] border-2 border-dashed border-emerald-100/50 animate-in fade-in zoom-in-95 duration-500">
      {/* Illustration */}
      <div className="relative">
        <div className="w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center shadow-sm border border-emerald-100 mx-auto group hover:shadow-md transition-all hover:-translate-y-1">
          {state.illustration}
        </div>
        <div className="absolute -top-2 -right-2 w-10 h-10 bg-emerald-500 rounded-2xl flex items-center justify-center text-lg shadow-lg shadow-emerald-500/30 animate-bounce">
          {state.emoji}
        </div>
      </div>

      {/* Text */}
      <div className="space-y-3 px-8">
        <h4 className="text-xl md:text-2xl font-black text-emerald-950">{state.title}</h4>
        <p className="text-sm font-bold text-emerald-900/40 max-w-[320px] leading-relaxed">{state.desc}</p>
      </div>

      {/* Action button */}
      {(onAction || state.link) && (
        state.link ? (
          <Link
            to={state.link}
            className="px-8 py-4 bg-emerald-950 text-white rounded-[1.8rem] text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-emerald-950/20 flex items-center gap-3 hover:scale-105 active:scale-95"
          >
            <span>{state.action}</span>
            <span className="text-emerald-400">→</span>
          </Link>
        ) : (
          <button
            onClick={onAction}
            className="px-8 py-4 bg-emerald-950 text-white rounded-[1.8rem] text-xs font-black uppercase tracking-widest hover:bg-black transition-all shadow-2xl shadow-emerald-950/20 flex items-center gap-3 hover:scale-105 active:scale-95"
          >
            <span>{state.action}</span>
            <span className="text-emerald-400">→</span>
          </button>
        )
      )}

      {/* Helpful tips */}
      <p className="text-[10px] font-bold text-emerald-900/20 uppercase tracking-widest">
        💡 ছোট শুরুই বড় পরিবর্তনের পথ
      </p>
    </div>
  );
};

export default EmptyState;
