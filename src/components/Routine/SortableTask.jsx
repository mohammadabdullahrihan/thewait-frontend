import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Check, X } from 'lucide-react';
import { motion, useAnimation } from 'framer-motion';

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

  const handleDragEnd = async (event, info) => {
    const offset = info.offset.x;
    if (offset > 100) {
      // Swiped right -> Complete
      if (!task.completed) {
         await toggleTask(task._id, task.completed, index);
      }
      controls.start({ x: 0 });
    } else if (offset < -100) {
      // Swiped left -> Delete
      deleteTask(task._id, index);
      controls.start({ x: 0 });
    } else {
      // Snap back
      controls.start({ x: 0 });
    }
  };

  return (
    <div ref={setNodeRef} style={style} className="relative w-full mb-4 group touch-pan-y">
      {/* Background Actions for Swipe */}
      <div className="absolute inset-0 rounded-[2.5rem] flex justify-between items-center px-8 bg-gradient-to-r from-emerald-500 to-rose-500 overflow-hidden shadow-inner">
        <div className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs">Complete</div>
        <div className="text-white font-black uppercase tracking-widest text-[10px] md:text-xs">Delete</div>
      </div>

      <motion.div
        drag="x"
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={0.2}
        onDragEnd={handleDragEnd}
        animate={controls}
        className={`relative z-10 p-5 md:p-6 rounded-[2.5rem] bg-white border shadow-sm flex items-center gap-3 md:gap-4 transition-all ${
          task.completed ? 'opacity-70 border-emerald-100 grayscale-[30%]' : 'border-emerald-50 hover:shadow-md'
        }`}
      >
        {/* Drag Handle */}
        <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing text-gray-300 hover:text-emerald-500 touch-none flex-shrink-0">
          <GripVertical size={20} />
        </div>

        <div 
          onClick={() => toggleTask(task._id, task.completed, index)}
          className={`w-10 h-10 md:w-12 md:h-12 shrink-0 rounded-2xl border-2 flex items-center justify-center transition-all cursor-pointer ${
            task.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-emerald-100 text-transparent hover:border-emerald-400 bg-gray-50/30'
          }`}
        >
          <Check size={18} className={task.completed ? 'scale-100' : 'scale-0 transition-transform'} />
        </div>
        
        <div className="flex-1 space-y-1 min-w-0 pr-2">
          <div className="flex items-center gap-3">
             <span className="text-[10px] md:text-xs font-black text-emerald-950/30 font-mono tracking-widest">{task.time || 'ANY TIME'}</span>
             {task.completed && <span className="px-2 py-0.5 bg-emerald-100 text-[8px] font-black text-emerald-600 rounded-md uppercase tracking-widest">DONE</span>}
          </div>
          <p className={`text-sm md:text-base font-black text-emerald-950 truncate ${task.completed ? 'line-through text-emerald-900/40' : ''}`}>
            {task.task}
          </p>
        </div>

        <div className={`hidden md:flex shrink-0 items-center gap-2 px-3 py-1.5 rounded-xl border ${meta.color} ${meta.border} text-[9px] font-black uppercase tracking-widest shadow-sm`}>
          {meta.icon} {task.category}
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); deleteTask(task._id, index); }}
          className="p-2 md:p-3 shrink-0 rounded-2xl hover:bg-rose-50 text-rose-300 hover:text-rose-500 transition-all cursor-pointer hidden md:block"
        >
          <X size={18} />
        </button>
      </motion.div>
    </div>
  );
};
