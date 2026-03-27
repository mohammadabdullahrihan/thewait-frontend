import { useState } from 'react';
import {
  BookOpen,
  Clock,
  Target,
  Brain,
  Dumbbell,
  Sparkles,
  Moon,
  Layout,
  Sun,
  Coffee,
  Zap,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

// ─────────────────────────────────────────────
// ROUTINE DATA (read-only reference)
// ─────────────────────────────────────────────
const PHASES = {
  Daily: [
    {
      id: 'morning-control',
      phase: 'সকাল বেলা',
      subtitle: 'কন্ট্রোল ফেজ',
      icon: <Sun size={18} />,
      color: 'amber',
      tasks: [
        { time: '৫:৫০', task: 'ঘুম থেকে ওঠা — Snooze বন্ধ, কোনো শর্ত নেই', cat: 'Discipline' },
        { time: '৫:৫০', task: 'ঠান্ডা পানি মুখে + ১ গ্লাস পানি পান, ফোন নয়', cat: 'Health' },
        { time: '৬:০০', task: 'স্ট্রেচিং ১০ মিনিট + গভীর শ্বাস ৫ মিনিট', cat: 'Health' },
        { time: '৬:১৫', task: 'কার্ডিও/দৌড় ৪৫ মিনিট — Motivational Playlist', cat: 'Health' },
        { time: '৭:০০', task: 'স্ট্রেংথ: পুশ-আপ ৩×১৫, স্কোয়াট ৩×২০, প্ল্যাঙ্ক ৩×৪৫s', cat: 'Health' },
        { time: '৭:৩০', task: 'ঠান্ডা পানিতে গোসল (বাধ্যতামূলক) + প্রোটিন নাস্তা', cat: 'Discipline' },
      ],
    },
    {
      id: 'morning-study',
      phase: 'সকালের স্টাডি ব্লক',
      subtitle: 'মিশন ফেজ',
      icon: <Brain size={18} />,
      color: 'sky',
      tasks: [
        { time: '৮:০০', task: 'মাইন্ড সেট: চোখ বন্ধ ৫ মিনিট — "আজকের মিশন শুরু"', cat: 'Mindfulness' },
        { time: '৮:১৫', task: 'পোমোডোরো ১ — GED Math (২৫ মিনিট পড়া + ৫ মিনিট বিরতি)', cat: 'Study' },
        { time: '৮:৪৫', task: 'পোমোডোরো ২ — GED Math চালিয়ে (২৫+৫)', cat: 'Study' },
        { time: '৯:১৫', task: 'পোমোডোরো ৩ — GED Science (২৫+৫)', cat: 'Study' },
        { time: '৯:৪৫', task: 'পোমোডোরো ৪ — GED Science চালিয়ে (২৫+৫)', cat: 'Study' },
        { time: '১০:১৫', task: 'লং ব্রেক: হাঁটুন, পানি পান — ফোন দেখবেন না', cat: 'Discipline' },
      ],
    },
    {
      id: 'pre-noon',
      phase: 'দুপুরের আগে',
      subtitle: 'স্ট্র্যাটেজি ফেজ',
      icon: <Coffee size={18} />,
      color: 'teal',
      tasks: [
        { time: '১০:৩০', task: 'ইংরেজি লিসেনিং: VOA / BBC 6 Minute English (ইয়ারফোন)', cat: 'Study' },
        { time: '১১:০০', task: 'ভোকাবুলারি: ১০টি নতুন ইংরেজি শব্দ (Anki)', cat: 'Study' },
        { time: '১১:৩০', task: 'রাইটিং প্র্যাকটিস: ১টি ইংরেজি প্যারাগ্রাফ (Google Keep)', cat: 'Study' },
        { time: '১২:০০', task: 'ইউরোপ বিশ্ববিদ্যালয় রিসার্চ: ১টি বিশ্ববিদ্যালয় (Notion)', cat: 'Study' },
        { time: '১২:৩০', task: 'ফ্রি টাইম (ফোন ছাড়া) — নিজের মতো কাটান', cat: 'Discipline' },
      ],
    },
    {
      id: 'afternoon-recharge',
      phase: 'দুপুরের ব্লক',
      subtitle: 'রিচার্জ ফেজ',
      icon: <Moon size={18} />,
      color: 'violet',
      tasks: [
        { time: '১:০০', task: 'দুপুরের খাবার — ফোন বন্ধ, শুধু খাওয়ায় ফোকাস', cat: 'Discipline' },
        { time: '১:৪০', task: 'Power Nap / হালকা বিশ্রাম (টাইমার ২৫ মিনিট)', cat: 'Health' },
        { time: '২:১০', task: 'ডে প্ল্যান রিভিউ: বাকি কাজ চেক (Todoist / Tasks)', cat: 'Discipline' },
      ],
    },
    {
      id: 'afternoon-study',
      phase: 'বিকালের স্টাডি ব্লক',
      subtitle: 'এক্সিকিউশন ফেজ',
      icon: <Brain size={18} />,
      color: 'sky',
      tasks: [
        { time: '২:৩০', task: 'পোমোডোরো ৫ — GED Social Studies (২৫+৫)', cat: 'Study' },
        { time: '৩:০০', task: 'পোমোডোরো ৬ — GED RLA Reading (২৫+৫)', cat: 'Study' },
        { time: '৩:৩০', task: 'পোমোডোরো ৭ — IELTS Listening Practice (২৫+৫)', cat: 'Study' },
        { time: '৪:০০', task: 'পোমোডোরো ৮ — IELTS Reading Practice (২৫+৫)', cat: 'Study' },
        { time: '৪:৩০', task: 'লং ব্রেক: হাঁটুন, চা/কফি', cat: 'Discipline' },
      ],
    },
    {
      id: 'evening-workout',
      phase: 'বিকালের ওয়ার্কআউট',
      subtitle: 'স্ট্রেন্থ ফেজ',
      icon: <Dumbbell size={18} />,
      color: 'rose',
      tasks: [
        { time: '৫:০০', task: 'ওয়ার্ম আপ: স্ট্রেচিং, জাম্পিং জ্যাক', cat: 'Health' },
        { time: '৫:১৫', task: 'দিন ১,৩,৫: পুশ-আপ, পুল-আপ, ডিপস | দিন ২,৪,৬: দৌড়/স্কিপিং, স্কোয়াট, লাঞ্জ', cat: 'Health' },
        { time: '৫:৪৫', task: 'কুল ডাউন: স্ট্রেচিং, গভীর শ্বাস', cat: 'Health' },
        { time: '৬:০০', task: 'গোসল + পোশাক পরিবর্তন', cat: 'Health' },
      ],
    },
    {
      id: 'evening-family',
      phase: 'সন্ধ্যার ব্লক',
      subtitle: 'ফ্যামিলি + রিল্যাক্স ফেজ',
      icon: <Sparkles size={18} />,
      color: 'emerald',
      tasks: [
        { time: '৬:৩০', task: 'পরিবারের সাথে সময় — ফোন অন্য রুমে রেখে দাও', cat: 'Discipline' },
        { time: '৭:৩০', task: 'রাতের খাবার পরিবারের সাথে — খাওয়ার সময় ফোন নেই', cat: 'Discipline' },
        { time: '৮:১৫', task: 'হালকা রিডিং: গল্পের বই বা স্ট্র্যাটেজি', cat: 'Mindfulness' },
        { time: '৮:৪৫', task: 'ইবাদত/ধ্যান: ১৫ মিনিট শান্ত হয়ে বসুন', cat: 'Ibadat' },
      ],
    },
    {
      id: 'night-review',
      phase: 'রাতের ব্লক',
      subtitle: 'রিভিউ + প্রিপারেশন ফেজ',
      icon: <Moon size={18} />,
      color: 'slate',
      tasks: [
        { time: '৯:০০', task: 'ডে রিভিউ: কন্ট্রোল? ডিটাচমেন্ট? অপসিক? মিশন ফার্স্ট? কী শিখলাম?', cat: 'Mindfulness' },
        { time: '৯:১৫', task: 'আগামীকালের To-Do লিস্ট তৈরি (Todoist)', cat: 'Discipline' },
        { time: '৯:৩০', task: 'ডিজিটাল ডিটক্স: মোবাইল বন্ধ — বই পড়ো বা ডায়েরি লেখো', cat: 'Discipline' },
        { time: '১০:০০', task: 'ঘুম — ফোন চার্জারে অন্য রুমে, অ্যালার্ম ৫:৫০ AM', cat: 'Discipline' },
      ],
    },
  ],
  Friday: [
    {
      id: 'friday-morning',
      phase: 'সকাল',
      subtitle: 'রিচার্জ শুরু',
      icon: <Sun size={18} />,
      color: 'teal',
      tasks: [
        { time: '৬:০০', task: 'স্বাভাবিক সময়ে উঠুন — কোনো চাপ নেই', cat: 'Discipline' },
        { time: '৬:৩০', task: 'হালকা যোগব্যায়াম / স্ট্রেচিং (ভারী ওয়ার্কআউট নয়)', cat: 'Health' },
        { time: '৭:৩০', task: 'নাস্তা + পানি পান', cat: 'Health' },
      ],
    },
    {
      id: 'friday-study',
      phase: 'সকালের হালকা পড়া',
      subtitle: 'রিভিশন অনলি',
      icon: <Brain size={18} />,
      color: 'sky',
      tasks: [
        { time: '৮:০০', task: 'রিভিশন — GED Math (নতুন কিছু নয়, পুরনো রিভিউ)', cat: 'Study' },
        { time: '৯:০০', task: 'রিভিশন — GED Science রিভিউ', cat: 'Study' },
      ],
    },
    {
      id: 'friday-ibadat',
      phase: 'জুমার ওয়াক্ত',
      subtitle: 'ইবাদত ফেজ',
      icon: <Moon size={18} />,
      color: 'amber',
      tasks: [
        { time: '১০:০০', task: 'জুমার নামাজের প্রস্তুতি + মসজিদে যাওয়া', cat: 'Ibadat' },
      ],
    },
    {
      id: 'friday-family',
      phase: 'বিকাল — রাত',
      subtitle: 'পরিবার ও রিচার্জ',
      icon: <Sparkles size={18} />,
      color: 'emerald',
      tasks: [
        { time: '১২:০০', task: 'পরিবারের সাথে সময় কাটান — ফোন ছাড়া', cat: 'Discipline' },
        { time: '২:০০', task: 'বিশ্রাম / Power Nap', cat: 'Health' },
        { time: '৩:০০', task: 'বাইরে হাঁটতে যান বা পরিবারের সাথে ঘুরতে যান', cat: 'Health' },
        { time: '৬:০০', task: 'হালকা রিডিং: গল্পের বই বা মোটিভেশনাল বই', cat: 'Mindfulness' },
        { time: '৭:৩০', task: 'রাতের খাবার পরিবারের সাথে', cat: 'Discipline' },
        { time: '৯:০০', task: 'সাপ্তাহিক রিভিউ: এই সপ্তাহে কী করলাম? কী শিখলাম?', cat: 'Mindfulness' },
        { time: '৯:৩০', task: 'আগামী সপ্তাহের প্ল্যান তৈরি করো', cat: 'Discipline' },
        { time: '১০:০০', task: 'ঘুম — অ্যালার্ম ৬:০০ AM', cat: 'Discipline' },
      ],
    },
  ],
  Saturday: [
    {
      id: 'sat-workout',
      phase: 'সকাল — কমান্ডো ওয়ার্কআউট',
      subtitle: 'স্ট্রেন্থ ফেজ',
      icon: <Dumbbell size={18} />,
      color: 'rose',
      tasks: [
        { time: '৬:০০', task: 'উঠুন — কমান্ডো ডে শুরু!', cat: 'Discipline' },
        { time: '৬:৩০', task: 'লং রান ৫-১০ কিমি অথবা লং ওয়ার্কআউট সেশন', cat: 'Health' },
        { time: '৮:০০', task: 'ঠান্ডা পানিতে গোসল + প্রোটিন নাস্তা', cat: 'Discipline' },
      ],
    },
    {
      id: 'sat-test',
      phase: 'মডেল টেস্ট ব্লক',
      subtitle: 'পুরো সেট',
      icon: <Brain size={18} />,
      color: 'sky',
      tasks: [
        { time: '৯:০০', task: 'মডেল টেস্ট — GED Math (পুরো সেট)', cat: 'Study' },
        { time: '১০:০০', task: 'মডেল টেস্ট — GED Science (পুরো সেট)', cat: 'Study' },
        { time: '১১:০০', task: 'মডেল টেস্ট — GED Social Studies', cat: 'Study' },
        { time: '১২:০০', task: 'মডেল টেস্ট — GED RLA Reading', cat: 'Study' },
        { time: '১:০০', task: 'দুপুরের খাবার + বিশ্রাম', cat: 'Health' },
      ],
    },
    {
      id: 'sat-weakness',
      phase: 'দুর্বল বিষয় ফোকাস',
      subtitle: 'এক্সট্রা ওয়ার্ক',
      icon: <Target size={18} />,
      color: 'orange',
      tasks: [
        { time: '৩:০০', task: 'দুর্বল বিষয়ে এক্সট্রা কাজ — ভুলগুলো বিশ্লেষণ করো', cat: 'Study' },
        { time: '৪:০০', task: 'IELTS Practice — দুর্বল সেকশনে ফোকাস', cat: 'Study' },
      ],
    },
    {
      id: 'sat-evening',
      phase: 'বিকাল — রাত',
      subtitle: 'রিলাক্স + রিভিউ',
      icon: <Sparkles size={18} />,
      color: 'emerald',
      tasks: [
        { time: '৫:০০', task: 'নিজের মতো কাটান — বিশ্রাম, পরিবার, বা হাঁটা', cat: 'Discipline' },
        { time: '৭:৩০', task: 'রাতের খাবার', cat: 'Discipline' },
        { time: '৯:০০', task: 'কমান্ডো মিশন রিভিউ: কেমন গেল?', cat: 'Mindfulness' },
        { time: '৯:৩০', task: 'আগামীকাল থেকে Daily রুটিনে ফিরে যাওয়ার প্ল্যান', cat: 'Discipline' },
        { time: '১০:০০', task: 'ঘুম — অ্যালার্ম ৫:৫০ AM (রবিবার থেকে Daily মিশন)', cat: 'Discipline' },
      ],
    },
  ],
};

const CHECKLIST = [
  '৫:৫০ AM উঠেছি',
  'ঠান্ডা পানিতে গোসল করেছি',
  '৪৫ মিনিট ওয়ার্কআউট করেছি',
  'GED পড়া (৪ পোমোডোরো) করেছি',
  'ইংরেজি প্র্যাকটিস করেছি',
  'বিশ্ববিদ্যালয় রিসার্চ করেছি',
  'বিকালে ওয়ার্কআউট করেছি',
  'পরিবারের সাথে সময় দিয়েছি',
  'ডে রিভিউ লিখেছি',
  '১০:০০ PM ঘুমিয়েছি',
  'আজ কোনো কার্টুন দেখিনি',
  'ডোপামিন ফাস্ট মেইনটেইন করেছি',
];

const CAT_COLORS = {
  Discipline: 'bg-orange-50 text-orange-600 border-orange-100',
  Study: 'bg-sky-50 text-sky-600 border-sky-100',
  Health: 'bg-rose-50 text-rose-600 border-rose-100',
  Mindfulness: 'bg-purple-50 text-purple-600 border-purple-100',
  Ibadat: 'bg-amber-50 text-amber-600 border-amber-100',
};

const PHASE_COLORS = {
  amber: { bg: 'bg-amber-50', border: 'border-amber-200', badge: 'bg-amber-500', icon: 'text-amber-600', title: 'text-amber-700' },
  sky: { bg: 'bg-sky-50', border: 'border-sky-200', badge: 'bg-sky-500', icon: 'text-sky-600', title: 'text-sky-700' },
  teal: { bg: 'bg-teal-50', border: 'border-teal-200', badge: 'bg-teal-500', icon: 'text-teal-600', title: 'text-teal-700' },
  violet: { bg: 'bg-violet-50', border: 'border-violet-200', badge: 'bg-violet-500', icon: 'text-violet-600', title: 'text-violet-700' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-200', badge: 'bg-rose-500', icon: 'text-rose-600', title: 'text-rose-700' },
  emerald: { bg: 'bg-emerald-50', border: 'border-emerald-200', badge: 'bg-emerald-500', icon: 'text-emerald-600', title: 'text-emerald-700' },
  slate: { bg: 'bg-slate-50', border: 'border-slate-200', badge: 'bg-slate-500', icon: 'text-slate-600', title: 'text-slate-700' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-200', badge: 'bg-orange-500', icon: 'text-orange-600', title: 'text-orange-700' },
};

const TABS = [
  { key: 'Daily', label: 'ডেইলি রুটিন', emoji: '⚔️', badge: '৩৭ টাস্ক', color: 'emerald' },
  { key: 'Friday', label: 'শুক্রবার', emoji: '🌿', badge: 'রিচার্জ ডে', color: 'teal' },
  { key: 'Saturday', label: 'শনিবার', emoji: '🔥', badge: 'কমান্ডো ডে', color: 'rose' },
];

const WARRIOR_RULES = [
  'রুটিন মানে জেল নয়। এটি তোমার অস্ত্র। অস্ত্র ছেড়ে দিও না।',
  'পারফেক্ট হতে হবে না। ভাঙবে, আবার শুরু করবে। শুধু থেমো না।',
  'প্রথম ৭ দিন কঠিন হবে। ২১ দিনে অভ্যস্ত। ৯০ দিনে সেকেন্ড নেচার।',
  'অ্যাপ টুলস, মাস্টার নয়। অ্যাপ তোমার জন্য, তুমি অ্যাপের জন্য নয়।',
  'প্রতিদিন সকালে বলো — "আজ আমি কন্ট্রোলে থাকব। আজ আমি মিশনে যাচ্ছি।"',
];

// ─────────────────────────────────────────────
// PHASE CARD COMPONENT
// ─────────────────────────────────────────────
const PhaseCard = ({ phase }) => {
  const [open, setOpen] = useState(true);
  const c = PHASE_COLORS[phase.color] || PHASE_COLORS.emerald;

  return (
    <div className={`rounded-[1.5rem] sm:rounded-[2rem] border-2 ${c.border} ${c.bg} overflow-hidden transition-all`}>
      <button
        onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-4 sm:p-5 md:p-6 text-left"
      >
        <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
          <div className={`p-2 sm:p-2.5 rounded-xl bg-white/80 border flex-shrink-0 ${c.border} ${c.icon}`}>
            {phase.icon}
          </div>
          <div className="min-w-0">
            <p className={`font-black text-sm md:text-base truncate ${c.title}`}>{phase.phase}</p>
            <p className="text-[9px] font-black text-emerald-900/40 uppercase tracking-widest">{phase.subtitle}</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0 ml-2">
          <span className={`text-[9px] font-black text-white px-2 py-0.5 rounded-full uppercase tracking-widest ${c.badge} hidden xs:inline`}>
            {phase.tasks.length} টাস্ক
          </span>
          <div className={`p-1.5 rounded-xl bg-white/60 ${c.title}`}>
            {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </div>
        </div>
      </button>

      {open && (
        <div className="px-3 pb-3 sm:px-5 sm:pb-5 md:px-6 md:pb-6 space-y-2">
          {phase.tasks.map((task, i) => (
            <div key={i} className="flex items-start gap-2.5 sm:gap-3 bg-white/70 rounded-xl sm:rounded-2xl p-3 sm:p-3.5 border border-white/80">
              <div className={`text-[9px] sm:text-[10px] font-black px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-lg sm:rounded-xl border whitespace-nowrap flex-shrink-0 mt-0.5 ${CAT_COLORS[task.cat] || 'bg-gray-50 text-gray-500 border-gray-100'}`}>
                {task.time}
              </div>
              <p className="text-xs sm:text-sm font-bold text-emerald-950 leading-snug">{task.task}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// MAIN PAGE
// ─────────────────────────────────────────────
const RoutineGuide = () => {
  const [activeTab, setActiveTab] = useState('Daily');

  const tabColors = {
    emerald: { active: 'bg-emerald-600 text-white shadow-emerald-600/20', border: 'border-emerald-200' },
    teal: { active: 'bg-teal-600 text-white shadow-teal-600/20', border: 'border-teal-200' },
    rose: { active: 'bg-rose-600 text-white shadow-rose-600/20', border: 'border-rose-200' },
  };

  return (
    <div className="animate-in fade-in duration-700 pb-28 space-y-5 sm:space-y-8">

      {/* ── Header ── */}
      <div className="flex flex-col gap-4 sm:gap-6 border-b border-emerald-50 pb-5 sm:pb-8 mt-3 sm:mt-4">
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 bg-emerald-500 text-[9px] sm:text-[10px] font-black text-white rounded-full uppercase tracking-widest shadow-lg shadow-emerald-500/20">
              WARRIOR MANUAL
            </span>
            <span className="px-2.5 py-1 bg-emerald-50 border border-emerald-100 text-[9px] sm:text-[10px] font-black text-emerald-600 rounded-full uppercase tracking-widest">
              READ ONLY
            </span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black tracking-tighter text-emerald-950 flex items-center gap-2 sm:gap-3">
            <div className="p-2 sm:p-3 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-emerald-100 text-emerald-500 flex-shrink-0">
              <BookOpen size={20} className="sm:hidden" />
              <BookOpen size={28} className="hidden sm:block" />
            </div>
            রুটিন গাইড
          </h1>
          <p className="text-emerald-950/40 font-bold text-xs sm:text-sm pl-1">
            তোমার সম্পূর্ণ দৈনিক মিশন — শুধু পড়ার জন্য
          </p>
        </div>

        {/* Quick info */}
        <div className="flex gap-2 sm:gap-3">
          {[
            { label: 'মোট টাস্ক', value: '৩৭', color: 'emerald' },
            { label: 'শুক্রবার', value: '১৪', color: 'teal' },
            { label: 'শনিবার', value: '১৫', color: 'rose' },
          ].map(s => (
            <div key={s.label} className={`flex-1 p-3 sm:p-4 bg-${s.color}-50 border border-${s.color}-100 rounded-xl sm:rounded-2xl text-center`}>
              <p className={`text-xl sm:text-2xl font-black text-${s.color}-600 leading-none`}>{s.value}</p>
              <p className={`text-[8px] sm:text-[9px] font-black text-${s.color}-500/60 uppercase tracking-widest mt-1`}>{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Tab Switcher ── */}
      <div className="flex items-center gap-1.5 sm:gap-2 bg-white p-1 sm:p-1.5 rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-100 shadow-sm w-full overflow-x-auto scrollbar-hide">
        {TABS.map(tab => {
          const tc = tabColors[tab.color] || tabColors.emerald;
          const isActive = activeTab === tab.key;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex-1 sm:flex-none px-3 sm:px-5 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-[10px] sm:text-[11px] font-black uppercase tracking-widest transition-all whitespace-nowrap flex items-center justify-center gap-1 sm:gap-2 ${isActive ? `${tc.active} shadow-lg` : 'text-emerald-900/50 hover:text-emerald-700'}`}
            >
              <span>{tab.emoji}</span>
              <span className="hidden xs:inline sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(' ')[0]}</span>
              <span className={`text-[7px] sm:text-[8px] font-black px-1 sm:px-1.5 py-0.5 rounded-full hidden sm:inline ${isActive ? 'bg-white/20' : 'bg-emerald-100 text-emerald-500'}`}>
                {tab.badge}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Phase Cards ── */}
      <div className="space-y-4">
        {(PHASES[activeTab] || []).map(phase => (
          <PhaseCard key={phase.id} phase={phase} />
        ))}
      </div>

      {/* ── Daily Checklist (only for Daily tab) ── */}
      {activeTab === 'Daily' && (
        <div className="p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] bg-emerald-950 text-white shadow-xl space-y-4 sm:space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 sm:p-2.5 bg-white/10 rounded-xl border border-white/10">
              <Zap size={18} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="font-black text-base sm:text-lg">দৈনিক চেকলিস্ট</h3>
              <p className="text-[9px] sm:text-[10px] font-black text-emerald-400 uppercase tracking-widest">প্রতিদিন রাতে মিলিয়ে দেখো</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
            {CHECKLIST.map((item, i) => (
              <div key={i} className="flex items-start gap-2.5 sm:gap-3 p-3 sm:p-3.5 bg-white/5 rounded-xl sm:rounded-2xl border border-white/10">
                <div className="w-4.5 h-4.5 sm:w-5 sm:h-5 rounded-md border-2 border-emerald-500/40 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm font-bold text-white/80 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Warrior Rules ── */}
      <div className="p-5 sm:p-8 rounded-[2rem] sm:rounded-[3rem] bg-white border border-emerald-100 shadow-sm space-y-4 sm:space-y-5">
        <div className="flex items-center gap-3">
          <div className="p-2 sm:p-2.5 bg-amber-50 rounded-xl border border-amber-100 text-amber-500">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="font-black text-base sm:text-lg text-emerald-950">মার্সেনারি কোড</h3>
            <p className="text-[9px] sm:text-[10px] font-black text-emerald-900/30 uppercase tracking-widest">৫টি নিয়ম — মনে রেখো সবসময়</p>
          </div>
        </div>
        <div className="space-y-2 sm:space-y-3">
          {WARRIOR_RULES.map((rule, i) => (
            <div key={i} className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 bg-emerald-50 rounded-xl sm:rounded-2xl border border-emerald-100">
              <span className="w-6 h-6 sm:w-7 sm:h-7 flex-shrink-0 rounded-lg sm:rounded-xl bg-emerald-500 text-white flex items-center justify-center text-[10px] sm:text-[11px] font-black">
                {i + 1}
              </span>
              <p className="text-xs sm:text-sm font-bold text-emerald-800 leading-snug">{rule}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default RoutineGuide;
