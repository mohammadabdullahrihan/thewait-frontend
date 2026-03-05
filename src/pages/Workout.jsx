import { useState, useEffect } from 'react';
import { 
  Dumbbell, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Flame, 
  Plus, 
  X, 
  Timer, 
  Loader2, 
  ArrowRight,
  Accessibility,
  Trophy,
  Flower2,
  Calendar
} from 'lucide-react';
import { workoutAPI } from '../utils/api';
import { todayStr } from '../utils/helpers';
import { format, addDays, parseISO } from 'date-fns';
import toast from 'react-hot-toast';

const WORKOUT_TYPES = [
  { type: 'Cardio', icon: 'Activity', color: '#f43f5e' },
  { type: 'Calisthenics', icon: 'Accessibility', color: '#10b981' },
  { type: 'Core', icon: 'Flame', color: '#6366f1' },
  { type: 'Strength', icon: 'Dumbbell', color: '#3b82f6' },
  { type: 'Yoga', icon: 'Flower2', color: '#8b5cf6' },
  { type: 'Sports', icon: 'Trophy', color: '#22c55e' },
];

const WorkoutIcon = ({ name, size = 20, color = 'currentColor' }) => {
  const icons = {
    Activity: <Activity size={size} color={color} />,
    Accessibility: <Accessibility size={size} color={color} />,
    Flame: <Flame size={size} color={color} />,
    Dumbbell: <Dumbbell size={size} color={color} />,
    Flower2: <Flower2 size={size} color={color} />,
    Trophy: <Trophy size={size} color={color} />,
  };
  return icons[name] || <Dumbbell size={size} color={color} />;
};

const DEFAULT_EXERCISES = {
  Cardio: [{ name: 'দৌড়', duration: 1800 }],
  Calisthenics: [{ name: 'পুশআপ', sets: 3, reps: 20 }, { name: 'পুলআপ', sets: 3, reps: 10 }],
  Core: [{ name: 'প্ল্যাঙ্ক', duration: 60 }, { name: 'ক্রাঞ্চ', sets: 3, reps: 30 }],
  Strength: [{ name: 'স্কোয়াট', sets: 3, reps: 15 }],
  Yoga: [{ name: 'সূর্যনমস্কার', sets: 3 }],
  Sports: [{ name: 'খেলা', duration: 1800 }],
};

const Workout = () => {
  const [date, setDate] = useState(todayStr());
  const [workouts, setWorkouts] = useState([]);
  const [selectedType, setSelectedType] = useState('Calisthenics');
  const [exercises, setExercises] = useState(DEFAULT_EXERCISES['Calisthenics']);
  const [duration, setDuration] = useState(30);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    workoutAPI.get(date).then(res => setWorkouts(res.data.workouts || [])).catch(() => {});
  }, [date]);

  const changeDate = (delta) => {
    const d = addDays(parseISO(date), delta);
    setDate(format(d, 'yyyy-MM-dd'));
  };

  const selectType = (type) => {
    setSelectedType(type);
    setExercises(DEFAULT_EXERCISES[type] || [{ name: '', sets: 3, reps: 10 }]);
  };

  const addExercise = () => setExercises([...exercises, { name: '', sets: 3, reps: 10 }]);
  const updateExercise = (i, field, val) => {
    const updated = [...exercises];
    updated[i] = { ...updated[i], [field]: val };
    setExercises(updated);
  };
  const removeExercise = (i) => setExercises(exercises.filter((_, idx) => idx !== i));

  const logWorkout = async () => {
    setLoading(true);
    try {
      const res = await workoutAPI.log({ date, type: selectedType, exercises, totalDuration: duration, notes });
      setWorkouts([...workouts, res.data.workout]);
      toast.success('ওয়ার্কআউট লগ করা হয়েছে! 🔥');
      setNotes('');
    } catch (e) { toast.error('লগ করা যায়নি'); }
    finally { setLoading(false); }
  };

  const deleteWorkout = async (id) => {
    try {
      await workoutAPI.delete(id);
      setWorkouts(workouts.filter(w => w._id !== id));
      toast.success('মুছে ফেলা হয়েছে');
    } catch (e) { toast.error('ডিলিট করা যায়নি'); }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Dumbbell size={28} color="var(--primary)" /> ওয়ার্কআউট ট্র্যাকার
          </h1>
          <p className="page-subtitle">শক্তি আসে অনুশীলন থেকে</p>
        </div>
      </div>

      {/* Date Nav */}
      <div className="date-nav" style={{ marginBottom: 20, display: 'inline-flex' }}>
        <button className="date-nav-btn" onClick={() => changeDate(-1)}><ChevronLeft size={18} /></button>
        <div className="date-nav-display">
          {format(parseISO(date), 'dd MMM yyyy')}
          {date === todayStr() && <span style={{ color: 'var(--secondary)', marginLeft: 8, fontSize: 13 }}>আজ</span>}
        </div>
        <button className="date-nav-btn" onClick={() => changeDate(1)} disabled={date === todayStr()}><ChevronRight size={18} /></button>
      </div>

      <div className="grid-2">
        {/* Log Workout */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 20 }}>+ নতুন ওয়ার্কআউট লগ</div>

          {/* Type Selection */}
          <div className="form-group">
            <label className="form-label">ওয়ার্কআউট টাইপ</label>
            <div className="workout-type-grid">
              {WORKOUT_TYPES.map(({ type, icon, color }) => (
                <div key={type} className={`workout-type-btn${selectedType === type ? ' selected' : ''}`}
                  onClick={() => selectType(type)}
                  style={{ borderColor: selectedType === type ? color : 'var(--border-light)', color: selectedType === type ? color : 'var(--text-secondary)' }}>
                  <span className="workout-type-icon">
                    <WorkoutIcon name={icon} size={20} color={selectedType === type ? color : 'var(--text-muted)'} />
                  </span>
                  {type}
                </div>
              ))}
            </div>
          </div>

          {/* Exercises */}
          <div className="form-group">
            <label className="form-label">এক্সারসাইজ</label>
            {exercises.map((ex, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                <input type="text" className="form-input" placeholder="নাম" value={ex.name} onChange={e => updateExercise(i, 'name', e.target.value)} />
                <input type="number" className="form-input" placeholder="Sets" value={ex.sets || ''} onChange={e => updateExercise(i, 'sets', +e.target.value)} />
                <input type="number" className="form-input" placeholder="Reps" value={ex.reps || ''} onChange={e => updateExercise(i, 'reps', +e.target.value)} />
                <button className="btn btn-danger btn-sm" onClick={() => removeExercise(i)}><X size={14} /></button>
              </div>
            ))}
            <button className="btn btn-ghost btn-sm" onClick={addExercise}><Plus size={14} /> এক্সারসাইজ যোগ</button>
          </div>

          <div className="form-group">
            <label className="form-label">মোট সময় (মিনিট)</label>
            <input type="number" className="form-input" value={duration} onChange={e => setDuration(+e.target.value)} min="5" max="180" />
          </div>

          <div className="form-group">
            <label className="form-label">নোট (ঐচ্ছিক)</label>
            <textarea className="form-textarea" placeholder="কেমন লাগলো?" value={notes} onChange={e => setNotes(e.target.value)} style={{ minHeight: 80 }} />
          </div>

          <button className="btn btn-primary btn-full" onClick={logWorkout} disabled={loading}>
            {loading ? <><Loader2 size={18} className="spin" /> সেভ হচ্ছে...</> : <><Dumbbell size={18} /> ওয়ার্কআউট লগ করো</>}
          </button>
        </div>

        {/* Today's Workouts */}
        <div className="card">
          <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Calendar size={18} color="var(--primary)" /> {format(parseISO(date), 'dd MMM')} এর ওয়ার্কআউট
          </div>
          {workouts.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon"><Dumbbell size={40} strokeWidth={1} /></div>
              <div className="empty-title">কোনো ওয়ার্কআউট নেই</div>
              <div className="empty-desc">আজকের ওয়ার্কআউট লগ করো</div>
            </div>
          ) : (
            workouts.map(w => {
              const typeInfo = WORKOUT_TYPES.find(t => t.type === w.type) || WORKOUT_TYPES[0];
              return (
                <div key={w._id} style={{ padding: 14, background: 'rgba(255,255,255,0.03)', borderRadius: 10, marginBottom: 10, border: '1px solid var(--border-light)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <WorkoutIcon name={typeInfo.icon} size={20} color={typeInfo.color} />
                      <span style={{ fontWeight: 700, color: typeInfo.color }}>{w.type}</span>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        <Timer size={14} /> {w.totalDuration} মিনিট
                      </span>
                      <button className="btn btn-danger btn-sm" onClick={() => deleteWorkout(w._id)}><X size={14} /></button>
                    </div>
                  </div>
                  {w.exercises?.map((ex, i) => (
                    <div key={i} style={{ fontSize: 13, color: 'var(--text-secondary)', marginLeft: 4, marginBottom: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                      <ArrowRight size={10} color="var(--text-muted)" />
                      {ex.name} {ex.sets && ex.reps ? `${ex.sets}×${ex.reps}` : ''}
                      {ex.duration ? ` ${Math.floor(ex.duration / 60)} মিনিট` : ''}
                    </div>
                  ))}
                  {w.notes && <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 10, fontStyle: 'italic', borderLeft: '2px solid var(--border-light)', paddingLeft: 10 }}>"{w.notes}"</div>}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Workout;
