import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  History, ArrowLeft, Search, Calendar, ChevronRight, 
  CloudRain, Frown, Meh, Smile, Laugh, Flame, FolderOpen
} from 'lucide-react';
import { journalAPI } from '../utils/api';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Common/Loader';
import JournalViewerModal from '../components/Journal/JournalViewerModal';

const MOOD_ICONS = [
  { score: 1, icon: <CloudRain size={20} />, label: 'Deeply Low', color: 'text-slate-400', bg: 'bg-slate-50' },
  { score: 3, icon: <Frown size={20} />, label: 'Struggling', color: 'text-indigo-400', bg: 'bg-indigo-50' },
  { score: 5, icon: <Meh size={20} />, label: 'Neutral', color: 'text-amber-400', bg: 'bg-amber-50' },
  { score: 7, icon: <Smile size={20} />, label: 'Positive', color: 'text-emerald-400', bg: 'bg-emerald-50' },
  { score: 9, icon: <Laugh size={20} />, label: 'Victor', color: 'text-orange-400', bg: 'bg-orange-50' },
  { score: 10, icon: <Flame size={20} />, label: 'Unstoppable', color: 'text-rose-500', bg: 'bg-rose-50' },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { staggerChildren: 0.05 } }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

const JournalArchives = () => {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedEntry, setSelectedEntry] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const res = await journalAPI.list(100);
        setEntries(res.data.entries || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const filteredEntries = entries.filter(e => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    const dateStr = format(parseISO(e.date), 'dd MMMM yyyy').toLowerCase();
    const textSearch = `${e.freeWrite || ''} ${e.goodThings || ''} ${e.learned || ''}`.toLowerCase();
    const tagMatch = (e.tags || []).some(t => t.toLowerCase().includes(term));
    return dateStr.includes(term) || textSearch.includes(term) || tagMatch;
  });

  if (loading) return <Loader full message="মাইন্ডসেট আর্কাইভ লোড হচ্ছে..." />;

  return (
    <div className="animate-in fade-in duration-700 space-y-8 pb-24 max-w-5xl mx-auto">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 px-2">
         <div className="flex items-center gap-4">
            <button 
              onClick={() => navigate('/journal')}
              className="p-3 bg-white text-emerald-600 rounded-2xl hover:bg-emerald-50 border border-emerald-100 shadow-sm transition-all active:scale-95"
            >
               <ArrowLeft size={20} />
            </button>
            <div className="space-y-1">
               <h1 className="text-2xl md:text-3xl font-black text-emerald-950 tracking-tight flex items-center gap-3">
                  সব আর্কাইভ <span className="bg-emerald-100 text-emerald-600 text-xs px-3 py-1 rounded-full">{entries.length}</span>
               </h1>
               <p className="text-[10px] md:text-xs font-black text-emerald-900/40 uppercase tracking-widest">
                  তোমার অতীতের সমস্ত চিন্তা ও অভিজ্ঞতা
               </p>
            </div>
         </div>

         <div className="relative w-full md:w-72">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-emerald-300" />
            <input 
              type="text"
              placeholder="সার্চ করো (তারিখ, ট্যাগ, লিখা)..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 md:py-4 bg-white border border-emerald-100 rounded-[1.5rem] md:rounded-[2rem] text-xs md:text-sm font-bold text-emerald-950 shadow-sm focus:outline-none focus:ring-4 focus:ring-emerald-500/10 placeholder-emerald-900/30 transition-all"
            />
         </div>
      </div>

      {/* List */}
      <div className="bg-white rounded-[2.5rem] md:rounded-[3.5rem] p-6 md:p-10 border border-emerald-100 shadow-sm min-h-[50vh]">
         {filteredEntries.length > 0 ? (
           <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6"
           >
              {filteredEntries.map(e => {
                const mIcon = MOOD_ICONS.find(m => e.mood <= m.score) || MOOD_ICONS[2];
                return (
                  <motion.div 
                    variants={itemVariants}
                    key={e._id} 
                    onClick={() => setSelectedEntry(e)}
                    whileHover={{ scale: 1.02, y: -4 }}
                    whileTap={{ scale: 0.98 }}
                    className="p-5 md:p-6 rounded-[2rem] border border-emerald-50 bg-slate-50/50 hover:bg-white hover:border-emerald-200 hover:shadow-xl hover:shadow-emerald-900/5 transition-all cursor-pointer group flex flex-col justify-between gap-4"
                  >
                     <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-3">
                           <div className={`p-3 rounded-2xl transition-all ${mIcon.bg} ${mIcon.color} shadow-sm group-hover:scale-110`}>
                              {mIcon.icon}
                           </div>
                           <div>
                              <p className="text-sm md:text-base font-black text-emerald-950">{format(parseISO(e.date), 'EEEE, dd MMMM')}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[8px] md:text-[9px] font-black uppercase tracking-widest ${mIcon.color}`}>
                                   {mIcon.label}
                                </span>
                                <span className="w-1 h-1 rounded-full bg-slate-300" />
                                <span className="text-[8px] md:text-[9px] font-black text-slate-400 uppercase tracking-widest">
                                   Score: {e.mood}/10
                                </span>
                              </div>
                           </div>
                        </div>
                     </div>

                     <div className="space-y-3">
                        {e.freeWrite && (
                          <p className="text-xs font-bold text-emerald-900/60 line-clamp-2 italic leading-relaxed">
                            "{e.freeWrite}"
                          </p>
                        )}
                        {(e.tags || []).length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-2 border-t border-emerald-50">
                             {e.tags.slice(0, 3).map(tag => (
                               <span key={tag} className="px-2 py-1 bg-white border border-emerald-100 text-emerald-600 rounded-lg text-[8px] font-black uppercase tracking-wider">
                                  #{tag}
                               </span>
                             ))}
                             {e.tags.length > 3 && (
                               <span className="px-2 py-1 bg-slate-100 text-slate-400 rounded-lg text-[8px] font-black uppercase tracking-wider">
                                  +{e.tags.length - 3}
                               </span>
                             )}
                          </div>
                        )}
                     </div>
                  </motion.div>
                );
              })}
           </motion.div>
         ) : (
            <div className="w-full h-full min-h-[40vh] flex flex-col items-center justify-center text-center space-y-4">
               <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-200">
                  <FolderOpen size={40} />
               </div>
               <div className="space-y-1">
                  <h3 className="text-xl font-black text-emerald-950">কোনো আর্কাইভ পাওয়া যায়নি</h3>
                  <p className="text-xs font-bold text-emerald-900/40 uppercase tracking-widest">সার্চ টার্ম পরিবর্তন করে দেখুন</p>
               </div>
            </div>
         )}
      </div>

      {selectedEntry && (
        <JournalViewerModal 
          entry={selectedEntry} 
          onClose={() => setSelectedEntry(null)} 
        />
      )}
    </div>
  );
};

export default JournalArchives;
