import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check, X } from 'lucide-react';
import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';

export const SortableTask = ({ task, id, toggleTask, deleteTask, index, meta }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: id || `task-${index}` });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const controls = useAnimation();
  const x = useMotionValue(0);
  
  // Color transforms for swipe hints
  const bgOpacity = useTransform(x, [-120, -60, 0, 60, 120], [1, 0.6, 0, 0.6, 1]);
  const leftColor = useTransform(x, [0, 80, 120], ['rgba(16,185,129,0)', 'rgba(16,185,129,0.15)', 'rgba(16,185,129,0.3)']);
  const rightColor = useTransform(x, [0, -80, -120], ['rgba(244,63,94,0)', 'rgba(244,63,94,0.15)', 'rgba(244,63,94,0.3)']);

  const handleDragEnd = async (event, info) => {
    const offset = info.offset.x;
    const velocity = info.velocity.x;

    if (offset > 80 || velocity > 500) {
      // Swiped right - Complete
      await controls.start({ x: 160, opacity: 0, transition: { duration: 0.2 } });
      if (!task.completed) {
        await toggleTask(task._id, task.completed, index);
      }
      controls.start({ x: 0, opacity: 1, transition: { duration: 0.3 } });
    } else if (offset < -80 || velocity < -500) {
      // Swiped left - Delete
      await controls.start({ x: -160, opacity: 0, transition: { duration: 0.2 } });
      deleteTask(task._id, index);
    } else {
      // Snap back with spring
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 500, damping: 30 } });
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="relative w-full mb-4 group touch-pan-y select-none">
      {/* Swipe hint backgrounds */}
      <motion.div
        className="absolute inset-0 rounded-[2.5rem] flex justify-between items-center px-8 overflow-hidden pointer-events-none"
        style={{ opacity: bgOpacity }}
      >
        {/* Left: Complete hint (green) */}
        <motion.div
          className="flex items-center gap-2"
          style={{ backgroundColor: leftColor }}
        >
          <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center shadow-lg">
            <Check size={20} className="text-white" />
          </div>
          <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest hidden sm:block">সম্পন্ন</span>
        </motion.div>
        
        {/* Right: Delete hint (red) */}
        <motion.div
          className="flex items-center gap-2 flex-row-reverse"
          style={{ backgroundColor: rightColor }}
        >
          <div className="w-10 h-10 rounded-2xl bg-rose-500 flex items-center justify-center shadow-lg">
            <X size={20} className="text-white" />
          </div>
          <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest hidden sm:block">মুছুন</span>
        </motion.div>
      </motion.div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.15}
        onDragEnd={handleDragEnd}
        animate={controls}
        style={{ x }}
        whileDrag={{ scale: 1.02, boxShadow: '0 20px 40px -12px rgba(0,0,0,0.15)' }}
        className={`relative z-10 p-5 md:p-6 rounded-[2.5rem] bg-white border shadow-sm flex items-center gap-3 md:gap-4 cursor-grab active:cursor-grabbing transition-colors ${
          task.completed 
            ? 'opacity-70 border-emerald-100 grayscale-[30%]' 
            : 'border-emerald-50 hover:border-emerald-100 hover:shadow-md'
        }`}
      >
        {/* Drag Handle */}
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing text-gray-200 hover:text-emerald-400 touch-none flex-shrink-0 transition-colors"
        >
          <GripVertical size={20} />
        </div>

        {/* Complete Toggle */}
        <motion.div
          onClick={() => toggleTask(task._id, task.completed, index)}
          whileTap={{ scale: 0.85 }}
          className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer ${
            task.completed 
              ? 'bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
              : 'border-emerald-100 text-transparent hover:border-emerald-400 bg-gray-50/30'
          }`}
        >
          <motion.div
            initial={false}
            animate={{ scale: task.completed ? 1 : 0, opacity: task.completed ? 1 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          >
            <Check size={18} />
          </motion.div>
        </motion.div>
        
        <div className="flex-1 space-y-1 min-w-0 pr-2">
          <div className="flex items-center gap-3">
            <span className="text-[10px] md:text-xs font-black text-emerald-950/30 font-mono tracking-widest">
              {task.time || 'ANY TIME'}
            </span>
            {task.completed && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="px-2 py-0.5 bg-emerald-100 text-[8px] font-black text-emerald-600 rounded-md uppercase tracking-widest"
              >
                DONE ✓
              </motion.span>
            )}
          </div>
          <p className={`text-sm md:text-base font-black text-emerald-950 truncate transition-all ${
            task.completed ? 'line-through text-emerald-900/40' : ''
          }`}>
            {task.task}
          </p>
        </div>

        {/* Category Badge - Desktop only */}
        <div className={`hidden md:flex shrink-0 items-center gap-2 px-3 py-1.5 rounded-xl border ${meta.color} ${meta.border} text-[9px] font-black uppercase tracking-widest shadow-sm`}>
          {meta.icon} {task.category}
        </div>
        
        {/* Delete Button - Desktop */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={(e) => { e.stopPropagation(); deleteTask(task._id, index); }}
          className="p-2 md:p-3 shrink-0 rounded-2xl hover:bg-rose-50 text-rose-200 hover:text-rose-500 transition-all cursor-pointer hidden md:block"
        >
          <X size={18} />
        </motion.button>
      </motion.div>
      
      {/* Mobile swipe hint text (first task only) */}
      {index === 0 && (
        <div className="mt-1 text-center md:hidden">
          <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">
            ← মুছুন &nbsp;•&nbsp; সম্পন্ন →
          </span>
        </div>
      )}
    </div>
  );
};
