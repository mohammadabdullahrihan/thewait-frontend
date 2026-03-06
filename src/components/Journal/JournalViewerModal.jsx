import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, Calendar, Star, Wind, Brain, Target, 
  Lightbulb, Sparkles, Heart, Tag, BookOpen, Quote
} from 'lucide-react';
import { format, parseISO } from 'date-fns';

const PRESET_TAGS = ['success', 'learning', 'struggle', 'grateful', 'motivated', 'tired', 'focused', 'breakthrough'];

const JournalViewerModal = ({ entry, onClose }) => {
  if (!entry) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[1000] flex justify-center items-end md:items-center bg-emerald-950/40 backdrop-blur-sm p-4 md:p-8 overflow-y-auto"
        onClick={onClose}
      >
        <motion.div
          initial={{ y: '100%', opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: '100%', opacity: 0, scale: 0.95 }}
          transition={{ type: 'spring', damping: 25, stiffness: 250 }}
          className="bg-white w-full max-w-4xl rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden shadow-emerald-900/20 my-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="relative p-6 md:p-10 bg-gradient-to-br from-emerald-600 to-emerald-900 text-white overflow-hidden">
             <BookOpen size={120} className="absolute -bottom-10 -right-10 opacity-10 text-white" />
             <div className="flex justify-between items-start relative z-10">
                <div className="space-y-2">
                   <div className="inline-flex items-center gap-2 bg-white/20 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest text-emerald-50 backdrop-blur-md">
                      <Calendar size={12} /> {format(parseISO(entry.date), 'EEEE, dd MMMM, yyyy')}
                   </div>
                   <h2 className="text-3xl md:text-5xl font-black tracking-tight leading-tight mt-2">
                      মাইন্ডসেট আর্কাইভ
                   </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl md:rounded-[1.5rem] transition-colors active:scale-95"
                >
                  <X size={20} />
                </button>
             </div>

             <div className="flex items-center gap-6 mt-8 relative z-10">
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-emerald-600 shadow-lg">
                      <Wind size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">MOOD SCORE</p>
                      <p className="text-2xl font-black">{entry.mood}/10</p>
                   </div>
                </div>
                <div className="w-px h-10 bg-white/20" />
                <div className="flex items-center gap-3">
                   <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-white backdrop-blur-sm">
                      <Brain size={24} />
                   </div>
                   <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-emerald-200">STATE</p>
                      <p className="text-lg font-black">{entry.mood >= 8 ? 'Unshakable' : (entry.mood >= 5 ? 'Stable' : 'Building')}</p>
                   </div>
                </div>
             </div>
          </div>

          {/* Content Body */}
          <div className="p-6 md:p-10 space-y-8 bg-slate-50">
             
             {/* Free Write Content */}
             {entry.freeWrite && (
                <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-emerald-50 shadow-sm space-y-4 relative">
                   <Quote size={40} className="absolute top-6 right-6 text-emerald-50 opacity-50" />
                   <h4 className="text-[10px] md:text-xs font-black text-emerald-400 uppercase tracking-widest flex items-center gap-2">
                      <Wind size={14} /> অবারিত ভাবনা
                   </h4>
                   <p className="text-sm md:text-base font-medium text-emerald-950 leading-relaxed whitespace-pre-wrap">
                      {entry.freeWrite}
                   </p>
                </div>
             )}

             {/* 4 Prompts Grid */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                {entry.goodThings && (
                  <div className="bg-white p-5 md:p-6 rounded-[1.5rem] border border-emerald-50 shadow-sm space-y-3">
                     <h4 className="flex items-center gap-2 text-[10px] font-black text-emerald-500 uppercase tracking-widest">
                        <Sparkles size={14} /> ভালো কাজ
                     </h4>
                     <p className="text-sm font-bold text-emerald-950 leading-relaxed">{entry.goodThings}</p>
                  </div>
                )}
                {entry.learned && (
                  <div className="bg-white p-5 md:p-6 rounded-[1.5rem] border border-amber-50 shadow-sm space-y-3">
                     <h4 className="flex items-center gap-2 text-[10px] font-black text-amber-500 uppercase tracking-widest">
                        <Lightbulb size={14} /> শিক্ষা
                     </h4>
                     <p className="text-sm font-bold text-amber-950 leading-relaxed">{entry.learned}</p>
                  </div>
                )}
                {entry.improvements && (
                  <div className="bg-white p-5 md:p-6 rounded-[1.5rem] border border-rose-50 shadow-sm space-y-3">
                     <h4 className="flex items-center gap-2 text-[10px] font-black text-rose-500 uppercase tracking-widest">
                        <Target size={14} /> উন্নতি
                     </h4>
                     <p className="text-sm font-bold text-rose-950 leading-relaxed">{entry.improvements}</p>
                  </div>
                )}
                {entry.gratitude && (
                  <div className="bg-white p-5 md:p-6 rounded-[1.5rem] border border-sky-50 shadow-sm space-y-3">
                     <h4 className="flex items-center gap-2 text-[10px] font-black text-sky-500 uppercase tracking-widest">
                        <Heart size={14} /> কৃতজ্ঞতা
                     </h4>
                     <p className="text-sm font-bold text-sky-950 leading-relaxed">{entry.gratitude}</p>
                  </div>
                )}
             </div>

             {/* Photo Attachment */}
             {entry.photoUrl && (
                <div className="bg-white p-5 md:p-6 rounded-[2rem] border border-emerald-50 shadow-sm space-y-4">
                   <h4 className="text-[10px] md:text-xs font-black text-emerald-400 uppercase tracking-widest">📸 ফটো</h4>
                   <div className="rounded-[1.5rem] overflow-hidden border border-emerald-100">
                      <img src={entry.photoUrl} alt="Journal Memory" className="w-full max-h-96 object-cover" />
                   </div>
                </div>
             )}

             {/* Footer with Tags */}
             {entry.tags && entry.tags.length > 0 && (
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-emerald-50">
                   <Tag size={14} className="text-emerald-300 mr-2" />
                   {entry.tags.map((tag, idx) => (
                      <span key={idx} className="px-3 py-1.5 bg-emerald-50 text-emerald-600 rounded-xl text-[10px] font-black uppercase tracking-widest">
                         #{tag}
                      </span>
                   ))}
                </div>
             )}

          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default JournalViewerModal;
