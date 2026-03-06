import { useState, useEffect, useRef } from 'react';
import { Search, X, ClipboardList, Flame, BookOpen, PenTool, Target, Dumbbell, ChevronRight, Loader2 } from 'lucide-react';
import { routineAPI, habitAPI, journalAPI, studyAPI } from '../../utils/api';
import { todayStr } from '../../utils/helpers';
import { useNavigate } from 'react-router-dom';

const CATEGORY_META = {
  routine: { icon: <ClipboardList size={16} />, label: 'রুটিন', color: 'text-emerald-600', bg: 'bg-emerald-50', link: '/routine' },
  habit: { icon: <Flame size={16} />, label: 'হ্যাবিট', color: 'text-orange-600', bg: 'bg-orange-50', link: '/habits' },
  journal: { icon: <PenTool size={16} />, label: 'জার্নাল', color: 'text-purple-600', bg: 'bg-purple-50', link: '/journal' },
  study: { icon: <BookOpen size={16} />, label: 'স্টাডি', color: 'text-sky-600', bg: 'bg-sky-50', link: '/study' },
  milestone: { icon: <Target size={16} />, label: 'মাইলস্টোন', color: 'text-indigo-600', bg: 'bg-indigo-50', link: '/milestones' },
};

const GlobalSearch = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const inputRef = useRef(null);
  const navigate = useNavigate();

  // Pre-load all searchable data once
  useEffect(() => {
    if (!isOpen) return;
    const loadData = async () => {
      try {
        const [routineRes, habitRes, journalRes, studyRes] = await Promise.allSettled([
          routineAPI.get(todayStr()),
          habitAPI.get(todayStr()),
          journalAPI.list(20),
          studyAPI.getAll(),
        ]);

        const items = [];

        // Routine tasks
        if (routineRes.status === 'fulfilled') {
          const tasks = routineRes.value?.data?.routine?.tasks || [];
          tasks.forEach(t => items.push({
            id: t._id || t.task,
            type: 'routine',
            title: t.task,
            subtitle: `${t.time || 'যেকোনো সময়'} • ${t.category || 'ডিসিপ্লিন'}`,
            completed: t.completed,
          }));
        }

        // Habits
        if (habitRes.status === 'fulfilled') {
          const habits = habitRes.value?.data?.habits || [];
          habits.forEach(h => items.push({
            id: h._id || h.name,
            type: 'habit',
            title: h.name,
            subtitle: h.completed ? '✅ আজ সম্পন্ন' : '⏳ চলমান',
            completed: h.completed,
          }));
        }

        // Journal
        if (journalRes.status === 'fulfilled') {
          const entries = journalRes.value?.data?.entries || [];
          entries.forEach(e => items.push({
            id: e._id || e.date,
            type: 'journal',
            title: e.goodThings || e.freeWrite?.slice(0, 60) || `${e.date} এর জার্নাল`,
            subtitle: `তারিখ: ${e.date} • মুড: ${e.mood}/10`,
          }));
        }

        // Study subjects/topics
        if (studyRes.status === 'fulfilled') {
          const subjects = studyRes.value?.data?.subjects || [];
          subjects.forEach(sub => {
            items.push({
              id: sub._id || sub.name,
              type: 'study',
              title: sub.name || sub.subject,
              subtitle: `${sub.totalHours?.toFixed(1) || 0}h পড়াশোনা • ${sub.topics?.length || 0} টপিক`,
            });
          });
        }

        setAllData(items);
      } catch (err) {
        console.error('Search data load error:', err);
      }
    };
    loadData();
    setTimeout(() => inputRef.current?.focus(), 100);
  }, [isOpen]);

  // Debounced search
  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    setLoading(true);
    const timer = setTimeout(() => {
      const q = query.toLowerCase();
      const filtered = allData.filter(item =>
        item.title?.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q)
      ).slice(0, 12);
      setResults(filtered);
      setLoading(false);
    }, 200);
    return () => clearTimeout(timer);
  }, [query, allData]);

  const handleSelect = (item) => {
    navigate(CATEGORY_META[item.type]?.link || '/dashboard');
    onClose();
    setQuery('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') { onClose(); setQuery(''); }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-start justify-center pt-[10vh] px-4"
      onClick={(e) => { if (e.target === e.currentTarget) { onClose(); setQuery(''); } }}>
      {/* Backdrop */}
      <div className="absolute inset-0 bg-emerald-950/40 backdrop-blur-sm animate-in fade-in duration-200" />

      {/* Search Panel */}
      <div className="relative w-full max-w-2xl animate-in slide-in-from-top-8 duration-300 zoom-in-95">
        {/* Search Input */}
        <div className="bg-white rounded-[2rem] shadow-2xl border border-emerald-100 overflow-hidden">
          <div className="flex items-center gap-4 px-6 py-4 border-b border-gray-100">
            {loading ? (
              <Loader2 size={20} className="text-emerald-400 animate-spin flex-shrink-0" />
            ) : (
              <Search size={20} className="text-emerald-400 flex-shrink-0" />
            )}
            <input
              ref={inputRef}
              type="text"
              placeholder="টাস্ক, হ্যাবিট, জার্নাল বা স্টাডি খুঁজুন..."
              className="flex-1 text-sm md:text-base font-bold text-emerald-950 placeholder:text-gray-300 outline-none bg-transparent"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            {query && (
              <button onClick={() => setQuery('')} className="p-1.5 rounded-xl hover:bg-gray-100 text-gray-400 transition-colors">
                <X size={16} />
              </button>
            )}
            <button
              onClick={() => { onClose(); setQuery(''); }}
              className="px-3 py-1.5 text-[10px] font-black uppercase tracking-widest text-gray-400 bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors"
            >
              ESC
            </button>
          </div>

          {/* Results */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!query && (
              <div className="p-8 text-center space-y-3">
                <div className="w-16 h-16 bg-emerald-50 rounded-[1.5rem] flex items-center justify-center mx-auto">
                  <Search size={28} className="text-emerald-300" />
                </div>
                <p className="text-sm font-black text-emerald-950/40 uppercase tracking-widest">সার্চ করুন</p>
                <p className="text-xs text-gray-400 font-bold">রুটিন, হ্যাবিট, জার্নাল বা স্টাডি থেকে যা খুশি খুঁজুন</p>
                <div className="flex flex-wrap justify-center gap-2 pt-2">
                  {Object.entries(CATEGORY_META).map(([key, meta]) => (
                    <span key={key} className={`px-3 py-1. flex items-center gap-1.5 rounded-xl text-[10px] font-black ${meta.bg} ${meta.color} border border-current/10`}>
                      {meta.icon} {meta.label}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {query && results.length === 0 && !loading && (
              <div className="p-10 text-center space-y-2">
                <p className="text-2xl">🔍</p>
                <p className="text-sm font-black text-emerald-950/40">"<span className="text-emerald-600">{query}</span>" খুঁজে পাওয়া যায়নি</p>
                <p className="text-xs text-gray-400 font-bold">ভিন্ন শব্দ দিয়ে আবার চেষ্টা করুন</p>
              </div>
            )}

            {results.length > 0 && (
              <div className="p-3 space-y-1">
                {/* Group by type */}
                {Object.keys(CATEGORY_META).map(type => {
                  const group = results.filter(r => r.type === type);
                  if (!group.length) return null;
                  const meta = CATEGORY_META[type];
                  return (
                    <div key={type}>
                      <div className="px-3 py-2 flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${meta.bg} ${meta.color}`}>{meta.icon}</div>
                        <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">{meta.label}</span>
                      </div>
                      {group.map(item => (
                        <button
                          key={item.id}
                          onClick={() => handleSelect(item)}
                          className="w-full flex items-center gap-4 px-4 py-3 rounded-2xl hover:bg-emerald-50 transition-all text-left group"
                        >
                          <div className={`p-2 rounded-xl shrink-0 ${meta.bg} ${meta.color}`}>
                            {meta.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className={`text-sm font-black text-emerald-950 truncate ${item.completed ? 'line-through text-emerald-900/40' : ''}`}>
                              {item.title}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 truncate">{item.subtitle}</p>
                          </div>
                          <ChevronRight size={14} className="text-gray-300 group-hover:text-emerald-500 group-hover:translate-x-0.5 transition-all shrink-0" />
                        </button>
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Footer hint */}
          {results.length > 0 && (
            <div className="px-6 py-3 border-t border-gray-100 flex items-center gap-3 text-[10px] font-bold text-gray-400">
              <span>↵ খুলতে এন্টার চাপুন</span>
              <span>•</span>
              <span>{results.length} ফলাফল পাওয়া গেছে</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearch;
