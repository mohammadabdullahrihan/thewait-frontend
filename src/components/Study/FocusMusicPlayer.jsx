import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Music, 
  Volume2, VolumeX, Volume1, ChevronDown, ChevronUp,
  Radio, Headphones, Brain, Wind, Waves, Coffee, Zap,
  List, X
} from 'lucide-react';

const TRACKS = [
  // Lo-Fi Category
  {
    id: 1,
    name: 'Deep Focus Lo-Fi',
    artist: 'WarriorBeats',
    category: 'lofi',
    emoji: '🎧',
    color: 'from-indigo-600 to-indigo-900',
    accent: '#6366f1',
    url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3',
  },
  {
    id: 2,
    name: 'Chill Lo-Fi Study',
    artist: 'Serene Minds',
    category: 'lofi',
    emoji: '☕',
    color: 'from-amber-600 to-amber-900',
    accent: '#d97706',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_10fc1bb271.mp3?filename=lofi-chill-medium-version-11317.mp3',
  },
  {
    id: 3,
    name: 'Lofi Hip Hop Rain',
    artist: 'RainyFocus',
    category: 'lofi',
    emoji: '🌧️',
    color: 'from-slate-600 to-slate-900',
    accent: '#64748b',
    url: 'https://cdn.pixabay.com/download/audio/2023/06/07/audio_7b8f7b9e91.mp3?filename=lofi-study-calm-112191.mp3',
  },
  // Binaural Beats Category
  {
    id: 4,
    name: 'Alpha Waves - Deep Concentration',
    artist: 'BioSync',
    category: 'binaural',
    emoji: '🧠',
    color: 'from-emerald-600 to-emerald-900',
    accent: '#10b981',
    url: 'https://cdn.pixabay.com/download/audio/2022/08/25/audio_51929064b4.mp3?filename=meditation-music-ambient-10038.mp3',
  },
  {
    id: 5,
    name: 'Theta Healing Tones',
    artist: 'NeuroPulse',
    category: 'binaural',
    emoji: '🌊',
    color: 'from-cyan-600 to-cyan-900',
    accent: '#06b6d4',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_cee94c98f1.mp3?filename=healing-meditation-112343.mp3',
  },
  // Ambient / Nature Category
  {
    id: 6,
    name: 'Forest Rain Ambience',
    artist: 'Nature Sounds',
    category: 'nature',
    emoji: '🌿',
    color: 'from-green-600 to-green-900',
    accent: '#22c55e',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/10/audio_270f9f4e8e.mp3?filename=rain-and-thunder-16705.mp3',
  },
  {
    id: 7,
    name: 'Ocean Waves Focus',
    artist: 'Deep Waters',
    category: 'nature',
    emoji: '🌊',
    color: 'from-blue-600 to-blue-900',
    accent: '#3b82f6',
    url: 'https://cdn.pixabay.com/download/audio/2021/09/06/audio_3b47561a64.mp3?filename=ocean-waves-112906.mp3',
  },
  {
    id: 8,
    name: 'Campfire Crackling',
    artist: 'Warmth Sounds',
    category: 'nature',
    emoji: '🔥',
    color: 'from-orange-600 to-red-900',
    accent: '#f97316',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/30/audio_c4b2e1b6a7.mp3?filename=fireplace-crackle-6854.mp3',
  },
  // Instrumental Category
  {
    id: 9,
    name: 'Epic Study Session',
    artist: 'Warrior Orchestra',
    category: 'instrumental',
    emoji: '🎹',
    color: 'from-purple-600 to-purple-900',
    accent: '#8b5cf6',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/25/audio_d1b1fa3f3a.mp3?filename=motivational-background-music-116194.mp3',
  },
  {
    id: 10,
    name: 'Piano Concentration',
    artist: 'Classical Focus',
    category: 'instrumental',
    emoji: '🎼',
    color: 'from-rose-600 to-rose-900',
    accent: '#f43f5e',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_92425cbfa1.mp3?filename=night-city-with-cars-10023.mp3',
  },
  {
    id: 11,
    name: 'Jazz Study Cafe',
    artist: 'Midnight Jazz',
    category: 'instrumental',
    emoji: '🎷',
    color: 'from-yellow-600 to-yellow-900',
    accent: '#eab308',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/24/audio_6ca51e4eec.mp3?filename=jazz-background-music-116193.mp3',
  },
  // Whitenoise Category
  {
    id: 12,
    name: 'Pure White Noise',
    artist: 'Focus Lab',
    category: 'whitenoise',
    emoji: '📡',
    color: 'from-gray-600 to-gray-900',
    accent: '#6b7280',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/09/audio_9fc6f1d73a.mp3?filename=white-noise-16775.mp3',
  },
];

const CATEGORIES = [
  { id: 'all', label: 'সব', icon: <Music size={14} />, color: 'bg-white text-emerald-700' },
  { id: 'lofi', label: 'Lo-Fi', icon: <Headphones size={14} />, color: 'bg-indigo-100 text-indigo-700' },
  { id: 'binaural', label: 'Binaural', icon: <Brain size={14} />, color: 'bg-emerald-100 text-emerald-700' },
  { id: 'nature', label: 'প্রকৃতি', icon: <Wind size={14} />, color: 'bg-green-100 text-green-700' },
  { id: 'instrumental', label: 'Instrumental', icon: <Radio size={14} />, color: 'bg-purple-100 text-purple-700' },
  { id: 'whitenoise', label: 'White Noise', icon: <Waves size={14} />, color: 'bg-gray-100 text-gray-700' },
];

// Animated visualizer bars
const Visualizer = ({ isPlaying, accent }) => {
  const bars = [3, 5, 8, 6, 4, 9, 7, 5, 3, 6, 8, 4, 7, 5, 9, 3, 6, 4, 8, 5];
  return (
    <div className="flex items-end gap-[3px] h-10 overflow-hidden opacity-60">
      {bars.map((h, i) => (
        <div
          key={i}
          className="w-1 rounded-full transition-all"
          style={{
            backgroundColor: accent || '#6366f1',
            height: isPlaying ? `${h * 10}%` : '15%',
            animation: isPlaying ? `visualizer-bar ${0.5 + (i % 5) * 0.15}s ease-in-out ${i * 0.05}s infinite alternate` : 'none',
          }}
        />
      ))}
    </div>
  );
};

const getVolumeIcon = (vol, muted) => {
  if (muted || vol === 0) return <VolumeX size={18} />;
  if (vol < 0.4) return <Volume1 size={18} />;
  return <Volume2 size={18} />;
};

const FocusMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const [category, setCategory] = useState('all');
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef(null);

  // Filtered tracks
  const filteredTracks = category === 'all' ? TRACKS : TRACKS.filter(t => t.category === category);
  const currentTrack = TRACKS[currentTrackIndex];

  // Init audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    audioRef.current.src = TRACKS[0].url;

    const handleEnded = () => setIsPlaying(false);
    audioRef.current.addEventListener('ended', handleEnded);
    return () => {
      audioRef.current?.pause();
      audioRef.current?.removeEventListener('ended', handleEnded);
    };
  }, []);

  // When track changes
  useEffect(() => {
    if (!audioRef.current) return;
    setIsLoading(true);
    audioRef.current.pause();
    audioRef.current.src = TRACKS[currentTrackIndex].url;
    audioRef.current.load();
    audioRef.current.volume = isMuted ? 0 : volume;
    if (isPlaying) {
      audioRef.current.play()
        .then(() => setIsLoading(false))
        .catch(() => { setIsPlaying(false); setIsLoading(false); });
    } else {
      setIsLoading(false);
    }
  }, [currentTrackIndex]);

  // Volume change
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      setIsLoading(true);
      audioRef.current.play()
        .then(() => { setIsPlaying(true); setIsLoading(false); })
        .catch(() => setIsLoading(false));
    }
  };

  const nextTrack = useCallback(() => {
    setCurrentTrackIndex(prev => (prev + 1) % TRACKS.length);
  }, []);

  const prevTrack = useCallback(() => {
    setCurrentTrackIndex(prev => (prev - 1 + TRACKS.length) % TRACKS.length);
  }, []);

  const selectTrack = (trackId) => {
    const idx = TRACKS.findIndex(t => t.id === trackId);
    if (idx !== -1) setCurrentTrackIndex(idx);
    setShowPlaylist(false);
    setIsPlaying(true);
  };

  const stepVolume = (delta) => {
    setVolume(prev => Math.min(1, Math.max(0, parseFloat((prev + delta).toFixed(2)))));
    setIsMuted(false);
  };

  return (
    <div
      className={`relative rounded-[2.5rem] md:rounded-[3rem] bg-gradient-to-br ${currentTrack?.color || 'from-indigo-600 to-indigo-900'} text-white shadow-2xl overflow-hidden transition-all duration-700`}
    >
      {/* Visualizer bg */}
      <div className="absolute inset-0 flex items-end justify-between px-4 pb-0 gap-0.5 pointer-events-none opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="flex-1 rounded-t-full"
            style={{
              backgroundColor: 'white',
              height: isPlaying ? `${20 + Math.sin(i * 0.8) * 60}%` : '5%',
              animation: isPlaying ? `visualizer-bar ${0.6 + (i % 6) * 0.12}s ease-in-out ${i * 0.04}s infinite alternate` : 'none',
              transition: 'height 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* Glow orb */}
      <div
        className="absolute -top-10 -right-10 w-44 h-44 rounded-full blur-3xl opacity-30"
        style={{ backgroundColor: currentTrack?.accent }}
      />

      <div className="relative z-10 p-6 md:p-8 space-y-5">
        {/* Header row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-2xl border border-white/20 backdrop-blur-md transition-all ${isPlaying ? 'shadow-lg' : 'opacity-60'}`}
              style={{ backgroundColor: `${currentTrack?.accent}33` }}
            >
              <Music size={18} className={isPlaying ? 'animate-bounce' : ''} />
            </div>
            <div>
              <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/50">FOCUS AUDIO</p>
              <p className="text-[10px] font-black text-white/70">{currentTrack?.artist}</p>
            </div>
          </div>
          <button
            onClick={() => setShowPlaylist(v => !v)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider"
          >
            <List size={14} /> Playlist
          </button>
        </div>

        {/* Track Title + Visualizer */}
        <div className="space-y-3">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-xs font-black text-white/50 uppercase tracking-widest mb-1">
                {currentTrack?.emoji} {CATEGORIES.find(c => c.id === currentTrack?.category)?.label}
              </p>
              <h3 className="text-lg md:text-xl font-black leading-tight truncate">{currentTrack?.name}</h3>
            </div>
            <Visualizer isPlaying={isPlaying} accent={currentTrack?.accent} />
          </div>
        </div>

        {/* Category Filter */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-1 px-1">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[9px] font-black uppercase tracking-wider transition-all ${
                category === cat.id
                  ? 'bg-white text-gray-900 shadow-lg shadow-white/20'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Controls + Volume */}
        <div className="flex items-center gap-4">
          {/* Prev / Play / Next */}
          <div className="flex items-center gap-3">
            <button
              onClick={prevTrack}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all active:scale-90"
            >
              <SkipBack size={18} />
            </button>
            <button
              onClick={togglePlay}
              disabled={isLoading}
              className="p-4 rounded-full text-white shadow-xl hover:scale-105 active:scale-95 transition-all border-2 border-white/30"
              style={{ backgroundColor: currentTrack?.accent }}
            >
              {isLoading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isPlaying ? (
                <Pause size={22} />
              ) : (
                <Play size={22} className="translate-x-0.5" />
              )}
            </button>
            <button
              onClick={nextTrack}
              className="p-2.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white/70 hover:text-white transition-all active:scale-90"
            >
              <SkipForward size={18} />
            </button>
          </div>

          {/* Volume Controls */}
          <div className="flex-1 flex items-center gap-2">
            <button
              onClick={() => setIsMuted(v => !v)}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white/70 transition-all shrink-0"
            >
              {getVolumeIcon(volume, isMuted)}
            </button>

            {/* Volume Slider */}
            <div className="flex-1 relative h-2 bg-white/20 rounded-full overflow-hidden cursor-pointer group">
              <div
                className="h-full rounded-full transition-all duration-150"
                style={{
                  width: `${(isMuted ? 0 : volume) * 100}%`,
                  backgroundColor: currentTrack?.accent || 'white',
                }}
              />
              <input
                type="range"
                min={0}
                max={1}
                step={0.02}
                value={isMuted ? 0 : volume}
                onChange={e => { setVolume(Number(e.target.value)); setIsMuted(false); }}
                className="absolute inset-0 w-full opacity-0 cursor-pointer"
              />
            </div>

            {/* -/+ buttons */}
            <button
              onClick={() => stepVolume(-0.1)}
              className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-base flex items-center justify-center transition-all active:scale-90 shrink-0"
            >−</button>
            <button
              onClick={() => stepVolume(0.1)}
              className="w-7 h-7 rounded-xl bg-white/10 hover:bg-white/20 text-white font-black text-base flex items-center justify-center transition-all active:scale-90 shrink-0"
            >+</button>
          </div>
        </div>

        {/* Volume % */}
        <p className="text-[9px] font-black text-white/30 uppercase tracking-widest text-right">
          {isMuted ? 'MUTED' : `VOL ${Math.round(volume * 100)}%`}
        </p>
      </div>

      {/* ======== Playlist Drawer ======== */}
      <div
        className={`absolute inset-0 bg-black/90 backdrop-blur-md z-20 transition-all duration-300 rounded-[2.5rem] md:rounded-[3rem] overflow-hidden flex flex-col ${
          showPlaylist ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-white/10">
          <div>
            <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">PLAYLIST</p>
            <h4 className="text-base font-black text-white">{filteredTracks.length} Tracks</h4>
          </div>
          <button
            onClick={() => setShowPlaylist(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Category filter inside playlist */}
        <div className="flex gap-2 overflow-x-auto px-4 py-3 scrollbar-none border-b border-white/10">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all ${
                category === cat.id ? 'bg-white text-gray-900' : 'bg-white/10 text-white/50 hover:bg-white/20'
              }`}
            >
              {cat.icon} {cat.label}
            </button>
          ))}
        </div>

        {/* Track list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {filteredTracks.map((track) => {
            const isActive = track.id === currentTrack?.id;
            return (
              <button
                key={track.id}
                onClick={() => selectTrack(track.id)}
                className={`w-full flex items-center gap-4 px-4 py-3 rounded-2xl transition-all text-left group ${
                  isActive
                    ? 'bg-white/20 shadow-lg'
                    : 'hover:bg-white/10'
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-2xl flex items-center justify-center text-lg flex-shrink-0 bg-gradient-to-br ${track.color} border border-white/10`}
                >
                  {track.emoji}
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-black truncate ${isActive ? 'text-white' : 'text-white/80'}`}>
                    {track.name}
                  </p>
                  <p className="text-[9px] font-bold text-white/40 uppercase tracking-widest">{track.artist}</p>
                </div>
                {isActive && isPlaying && (
                  <div className="flex items-end gap-0.5 h-4 shrink-0">
                    {[1,2,3].map(i => (
                      <div
                        key={i}
                        className="w-1 rounded-full bg-white"
                        style={{
                          height: '60%',
                          animation: `visualizer-bar ${0.5 + i * 0.15}s ease-in-out infinite alternate`,
                        }}
                      />
                    ))}
                  </div>
                )}
                {isActive && !isPlaying && (
                  <div className="w-2 h-2 rounded-full bg-white shrink-0" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* CSS for visualizer animation */}
      <style>{`
        @keyframes visualizer-bar {
          from { transform: scaleY(0.3); }
          to   { transform: scaleY(1); }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
        input[type=range]::-webkit-slider-thumb { 
          -webkit-appearance: none; 
          width: 14px; height: 14px; 
          border-radius: 50%; 
          background: white; 
          cursor: pointer;
          box-shadow: 0 0 6px rgba(0,0,0,0.3);
        }
      `}</style>
    </div>
  );
};

export default FocusMusicPlayer;
