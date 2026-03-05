import { useState, useEffect } from 'react';
import { 
  ClipboardList, 
  Plus, 
  X, 
  ChevronLeft, 
  ChevronRight, 
  Check,
  Sparkles
} from 'lucide-react';
import { routineAPI } from '../utils/api';
import { todayStr } from '../utils/helpers';
import { format, addDays, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const categoryClass = { Discipline: 'cat-discipline', Study: 'cat-study', Health: 'cat-health', Mindfulness: 'cat-mindfulness', Other: 'cat-other' };

const Routine = () => {
  const [date, setDate] = useState(todayStr());
  const [routine, setRoutine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [newTask, setNewTask] = useState({ time: '', task: '', category: 'Discipline' });

  const fetchRoutine = async (d) => {
    setLoading(true);
    try {
      const res = await routineAPI.get(d);
      setRoutine(res.data.routine);
    } catch (e) { toast.error('রুটিন লোড করা যায়নি'); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRoutine(date); }, [date]);

  const toggleTask = async (taskId, completed) => {
    if (!routine._id) {
      // Not saved yet, save first
      const res = await routineAPI.save({ date, tasks: routine.tasks });
      setRoutine(res.data.routine);
      return;
    }
    try {
      const res = await routineAPI.toggleTask(date, taskId, !completed);
      setRoutine(res.data.routine);
      if (!completed) toast.success('+5 XP অর্জিত! 🔥', { duration: 1500 });
    } catch (e) { toast.error('আপডেট করা যায়নি'); }
  };

  const addTask = async () => {
    if (!newTask.task.trim()) { toast.error('টাস্কের নাম দিন'); return; }
    const tasks = [...(routine?.tasks || []), newTask];
    try {
      const res = await routineAPI.save({ date, tasks });
      setRoutine(res.data.routine);
      setNewTask({ time: '', task: '', category: 'Discipline' });
      setShowAdd(false);
      toast.success('টাস্ক যোগ হয়েছে');
    } catch (e) { toast.error('টাস্ক যোগ করা যায়নি'); }
  };

  const changeDate = (delta) => {
    const d = addDays(parseISO(date), delta);
    setDate(format(d, 'yyyy-MM-dd'));
  };

  const completedCount = routine?.tasks?.filter(t => t.completed).length || 0;
  const totalCount = routine?.tasks?.length || 0;
  const completionRate = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <ClipboardList size={28} color="var(--primary)" /> দৈনিক রুটিন
          </h1>
          <p className="page-subtitle">প্রতিটি কাজ শেষ করাই তোমার পরিচয়</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowAdd(!showAdd)}>
          {showAdd ? <><X size={16} /> বাতিল</> : <><Plus size={16} /> টাস্ক যোগ</>}
        </button>
      </div>

      {/* Date Navigation */}
      <div className="date-nav" style={{ marginBottom: 20, display: 'inline-flex' }}>
        <button className="date-nav-btn" onClick={() => changeDate(-1)}><ChevronLeft size={18} /></button>
        <div className="date-nav-display">
          {format(parseISO(date), 'EEEE, dd MMM yyyy')}
          {date === todayStr() && <span style={{ color: 'var(--secondary)', marginLeft: 8, fontSize: 13 }}>আজ</span>}
        </div>
        <button className="date-nav-btn" onClick={() => changeDate(1)} disabled={date === todayStr()}><ChevronRight size={18} /></button>
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontWeight: 600 }}>আজকের প্রগ্রেস</span>
          <span style={{ color: 'var(--secondary)', fontWeight: 700, fontSize: 20 }}>{completionRate}%</span>
        </div>
        <div className="progress-bar-wrap">
          <div className="progress-bar-fill gold" style={{ width: `${completionRate}%` }} />
        </div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 8 }}>
          {completedCount}/{totalCount} টাস্ক শেষ
        </div>
      </div>

      {/* Add Task Form */}
      {showAdd && (
        <div className="card" style={{ marginBottom: 20, border: '1px solid rgba(34, 197, 94, 0.25)' }}>
          <div className="card-title" style={{ marginBottom: 16 }}>নতুন টাস্ক যোগ</div>
          <div className="grid-3" style={{ gap: 12 }}>
            <input type="time" className="form-input" value={newTask.time} onChange={e => setNewTask({...newTask, time: e.target.value})} />
            <input type="text" className="form-input" placeholder="টাস্কের নাম" value={newTask.task} onChange={e => setNewTask({...newTask, task: e.target.value})} style={{ gridColumn: 'span 1' }} />
            <select className="form-select" value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})}>
              {['Discipline', 'Study', 'Health', 'Mindfulness', 'Other'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 14 }} onClick={addTask}>
            <Check size={16} /> টাস্ক যোগ করো
          </button>
        </div>
      )}

      {/* Task List */}
      {loading ? (
        <div className="loading-screen" style={{ minHeight: 200, background: 'transparent' }}>
          <div className="loading-spinner" />
          <p style={{ color: 'var(--text-muted)' }}>লোড হচ্ছে...</p>
        </div>
      ) : routine?.tasks?.length === 0 ? (
        <div className="empty-state">
          <div className="empty-icon"><ClipboardList size={40} strokeWidth={1} /></div>
          <div className="empty-title">কোনো টাস্ক নেই</div>
          <div className="empty-desc">উপরে "+ টাস্ক যোগ" বাটনে ক্লিক করে টাস্ক যোগ করো</div>
        </div>
      ) : (
        <div>
          {routine?.tasks?.map((task, i) => (
            <div key={task._id || i} className={`task-item${task.completed ? ' completed' : ''}`}>
              <div
                className={`task-checkbox${task.completed ? ' checked' : ''}`}
                onClick={() => task._id && toggleTask(task._id, task.completed)}
                style={{ cursor: task._id ? 'pointer' : 'default' }}
              >
                {task.completed && <Check size={14} />}
              </div>
              {task.time && <span className="task-time">{task.time}</span>}
              <span className="task-name">{task.task}</span>
              <span className={`task-category ${categoryClass[task.category] || 'cat-other'}`}>{task.category}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Routine;
