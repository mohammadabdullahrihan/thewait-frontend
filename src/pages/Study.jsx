import { useState, useEffect, useRef } from 'react';
import { 
  BookOpen, 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  Pause, 
  RefreshCw, 
  Check, 
  ClipboardList, 
  BarChart3, 
  Timer, 
  GraduationCap, 
  Calculator, 
  FlaskConical, 
  Globe, 
  PenTool,
  Sparkles,
  Plus,
  Loader2
} from 'lucide-react';
import { studyAPI } from '../utils/api';
import { todayStr } from '../utils/helpers';
import toast from 'react-hot-toast';

const SUBJECTS = [
  { name: 'Math', icon: 'Calculator', color: '#3b82f6' },
  { name: 'Science', icon: 'FlaskConical', color: '#22c55e' },
  { name: 'Social Studies', icon: 'Globe', color: '#f59e0b' },
  { name: 'Language Arts', icon: 'PenTool', color: '#8b5cf6' },
  { name: 'IELTS', icon: 'GraduationCap', color: '#ef4444' },
];

const SubjectIcon = ({ name, size = 20, color = 'currentColor' }) => {
  const icons = {
    Calculator: <Calculator size={size} color={color} />,
    FlaskConical: <FlaskConical size={size} color={color} />,
    Globe: <Globe size={size} color={color} />,
    PenTool: <PenTool size={size} color={color} />,
    GraduationCap: <GraduationCap size={size} color={color} />,
  };
  return icons[name] || <BookOpen size={size} color={color} />;
};

const POMODORO_DURATIONS = { work: 25 * 60, short: 5 * 60, long: 15 * 60 };

const Study = () => {
  const [allProgress, setAllProgress] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Pomodoro State
  const [pomMode, setPomMode] = useState('work');
  const [timeLeft, setTimeLeft] = useState(POMODORO_DURATIONS.work);
  const [pomRunning, setPomRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [pomTopic, setPomTopic] = useState('');
  const intervalRef = useRef(null);

  // Score form
  const [scoreForm, setScoreForm] = useState({ testName: '', score: '', maxScore: '100', notes: '' });
  const [topicForm, setTopicForm] = useState('');
  const [showTopicAdd, setShowTopicAdd] = useState(false);

  useEffect(() => {
    studyAPI.getAll().then(res => setAllProgress(res.data.progress || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const selectSubject = async (subjectName) => {
    setSelected(subjectName);
    try {
      const res = await studyAPI.get(subjectName);
      setSelectedData(res.data.progress);
    } catch (e) { toast.error('ডেটা লোড করা যায়নি'); }
  };

  // Pomodoro Timer
  useEffect(() => {
    if (pomRunning) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(intervalRef.current);
            setPomRunning(false);
            if (pomMode === 'work') {
              setSessions(s => s + 1);
              toast.success('পোমোডোরো সেশন শেষ! বিশ্রাম নাও 🔥');
              // Log session
              if (selected) {
                studyAPI.logSession(selected, { duration: 25, topic: pomTopic, date: todayStr() }).catch(() => {});
              }
            }
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
    }
    return () => clearInterval(intervalRef.current);
  }, [pomRunning, pomMode, selected, pomTopic]);

  const switchMode = (mode) => {
    setPomMode(mode);
    setPomRunning(false);
    setTimeLeft(POMODORO_DURATIONS[mode]);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const totalDuration = POMODORO_DURATIONS[pomMode];
  const progressPercent = (timeLeft / totalDuration) * 100;
  const circumference = 2 * Math.PI * 88;
  const strokeDashoffset = circumference * (1 - (totalDuration - timeLeft) / totalDuration);

  const addScore = async () => {
    if (!scoreForm.testName || !scoreForm.score) { toast.error('টেস্টের নাম এবং স্কোর দিন'); return; }
    try {
      const res = await studyAPI.addScore(selected, scoreForm);
      setSelectedData(res.data.progress);
      setScoreForm({ testName: '', score: '', maxScore: '100', notes: '' });
      toast.success('স্কোর সংরক্ষিত হয়েছে');
    } catch (e) { toast.error('স্কোর যোগ করা যায়নি'); }
  };

  const addTopic = async () => {
    if (!topicForm.trim()) { toast.error('টপিকের নাম দিন'); return; }
    try {
      const res = await studyAPI.addTopic(selected, { name: topicForm });
      setSelectedData(res.data.progress);
      setTopicForm('');
      setShowTopicAdd(false);
      toast.success('টপিক যোগ হয়েছে');
    } catch (e) { toast.error('টপিক যোগ করা যায়নি'); }
  };

  const toggleTopic = async (topicId, completed) => {
    try {
      const res = await studyAPI.toggleTopic(selected, topicId, !completed);
      setSelectedData(res.data.progress);
    } catch (e) { toast.error('আপডেট করা যায়নি'); }
  };

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <BookOpen size={28} color="var(--primary)" /> পড়াশোনা ট্র্যাকার
          </h1>
          <p className="page-subtitle">GED · IELTS · পোমোডোরো টাইমার</p>
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="subjects-grid" style={{ marginBottom: 28 }}>
        {SUBJECTS.map(sub => {
          const prog = allProgress.find(p => p.subject === sub.name);
          const completedTopics = prog?.topics?.filter(t => t.completed).length || 0;
          const totalTopics = prog?.topics?.length || 0;
          return (
            <div key={sub.name} className="subject-card" onClick={() => selectSubject(sub.name)}
              style={{ borderColor: selected === sub.name ? sub.color : 'var(--border-light)', borderWidth: selected === sub.name ? 2 : 1 }}>
              <div className="subject-icon" style={{ background: `${sub.color}15` }}>
                <SubjectIcon name={sub.icon} size={28} color={sub.color} />
              </div>
              <div className="subject-name">{sub.name}</div>
              <div className="subject-hours">
                <Timer size={14} style={{ marginRight: 6 }} />
                {prog?.totalHours?.toFixed(1) || 0} ঘন্টা
              </div>
              {totalTopics > 0 && (
                <div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 6 }}>{completedTopics}/{totalTopics} টপিক</div>
                  <div className="progress-bar-wrap" style={{ height: 6 }}>
                    <div className="progress-bar-fill green" style={{ width: `${totalTopics ? (completedTopics / totalTopics) * 100 : 0}%`, background: sub.color }} />
                  </div>
                </div>
              )}
              {prog?.testScores?.length > 0 && (
                <div style={{ marginTop: 8, fontSize: 12, color: sub.color, fontWeight: 600 }}>
                  শেষ স্কোর: {prog.testScores[prog.testScores.length - 1]?.score}%
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Pomodoro Timer */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="card-title" style={{ marginBottom: 20, display: 'flex', alignItems: 'center', gap: 10 }}>
          <Timer size={20} color="var(--primary)" /> পোমোডোরো টাইমার
        </div>
        <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
          <div className="pomodoro-container" style={{ flex: '0 0 220px' }}>
            <div className="timer-ring-wrap">
              <svg className="timer-ring" viewBox="0 0 200 200">
                <circle className="timer-ring-bg" cx="100" cy="100" r="88" />
                <circle
                  className="timer-ring-progress"
                  cx="100" cy="100" r="88"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  style={{ stroke: pomMode === 'work' ? 'var(--secondary)' : 'var(--accent)' }}
                />
              </svg>
              <div className="timer-text">
                <div className="timer-display">{formatTime(timeLeft)}</div>
                <div className="timer-session-type">
                  {pomMode === 'work' ? 'পড়াশোনা' : pomMode === 'short' ? 'ছোট বিরতি' : 'বড় বিরতি'}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginBottom: 16 }}>
              {[['work', '25 মিনিট'], ['short', '৫ মিনিট'], ['long', '১৫ মিনিট']].map(([mode, label]) => (
                <button key={mode} className={`btn btn-sm ${pomMode === mode ? 'btn-primary' : 'btn-ghost'}`} onClick={() => switchMode(mode)}>
                  {label}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
              <button className={`btn ${pomRunning ? 'btn-danger' : 'btn-success'}`} onClick={() => setPomRunning(!pomRunning)}>
                {pomRunning ? <Pause size={18} /> : <Play size={18} />}
              </button>
              <button className="btn btn-ghost" onClick={() => { setPomRunning(false); setTimeLeft(POMODORO_DURATIONS[pomMode]); }}>
                <RefreshCw size={18} />
              </button>
            </div>
            <div style={{ marginTop: 12, fontSize: 13, color: 'var(--secondary)', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
              <Check size={14} /> আজকের সেশন: {sessions}
            </div>
          </div>

          <div style={{ flex: 1 }}>
            <div className="form-group">
              <label className="form-label">বর্তমান বিষয়</label>
              <select className="form-select" value={selected || ''} onChange={e => { setSelected(e.target.value); selectSubject(e.target.value); }}>
                <option value="">বিষয় নির্বাচন করো</option>
                {SUBJECTS.map(s => <option key={s.name} value={s.name}>{s.name}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">টপিক (ঐচ্ছিক)</label>
              <input type="text" className="form-input" placeholder="কি পড়ছো?" value={pomTopic} onChange={e => setPomTopic(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {/* Selected Subject Detail */}
      {selected && (
        <div className="grid-2">
          {/* Topics */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <ClipboardList size={20} color="var(--primary)" /> টপিক লিস্ট
              </div>
              <button className="btn btn-sm btn-secondary" onClick={() => setShowTopicAdd(!showTopicAdd)}>
                {showTopicAdd ? <X size={14} /> : <Plus size={14} />}
              </button>
            </div>
            {showTopicAdd && (
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <input type="text" className="form-input" placeholder="টপিকের নাম" value={topicForm} onChange={e => setTopicForm(e.target.value)} />
                <button className="btn btn-primary btn-sm" onClick={addTopic}><Check size={16} /></button>
              </div>
            )}
            {!selectedData ? (
               <div style={{ textAlign: 'center', padding: 20 }}><Loader2 className="spin" /></div>
            ) : selectedData?.topics?.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: 14 }}>কোনো টপিক নেই। যোগ করো!</div>
            ) : (
              selectedData?.topics?.map((topic, i) => (
                <div key={topic._id || i} className="task-item" style={{ marginBottom: 6 }}>
                  <div className={`task-checkbox${topic.completed ? ' checked' : ''}`} onClick={() => topic._id && toggleTopic(topic._id, topic.completed)} style={{ cursor: 'pointer' }}>
                    {topic.completed && <Check size={14} />}
                  </div>
                  <span className={`task-name${topic.completed ? '' : ''}`} style={{ textDecoration: topic.completed ? 'line-through' : 'none', color: topic.completed ? 'var(--text-muted)' : 'var(--text-primary)' }}>
                    {topic.name}
                  </span>
                </div>
              ))
            )}
          </div>

          {/* Test Scores */}
          <div className="card">
            <div className="card-title" style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
              <BarChart3 size={20} color="var(--primary)" /> মক টেস্ট স্কোর
            </div>
            <div style={{ display: 'grid', gap: 8, marginBottom: 16 }}>
              <input type="text" className="form-input" placeholder="টেস্টের নাম" value={scoreForm.testName} onChange={e => setScoreForm({...scoreForm, testName: e.target.value})} />
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <input type="number" className="form-input" placeholder="স্কোর" value={scoreForm.score} onChange={e => setScoreForm({...scoreForm, score: e.target.value})} />
                <input type="number" className="form-input" placeholder="মোট" value={scoreForm.maxScore} onChange={e => setScoreForm({...scoreForm, maxScore: e.target.value})} />
              </div>
              <button className="btn btn-primary" onClick={addScore}><Plus size={16} /> স্কোর যোগ</button>
            </div>
            {selectedData?.testScores?.slice(-5).reverse().map((s, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px solid var(--border-light)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: 14 }}>{s.testName}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>{new Date(s.date).toLocaleDateString('bn-BD')}</div>
                </div>
                <div style={{ color: s.score / s.maxScore >= 0.7 ? 'var(--success)' : 'var(--warning)', fontWeight: 800, fontSize: 18 }}>
                  {s.score}/{s.maxScore}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Study;
