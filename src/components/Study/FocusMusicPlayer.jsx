import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Play, Pause, SkipForward, SkipBack, Music, 
  Volume2, VolumeX, Volume1, ChevronDown, ChevronUp,
  Radio, Headphones, Brain, Wind, Waves, Coffee, Zap,
  List, X, Disc
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const TRACKS = [
  {
    id: 1,
    name: 'Deep Focus Lo-Fi',
    artist: 'SoundHelix',
    emoji: '🎧',
    color: 'from-indigo-600 to-indigo-900',
    accent: '#6366f1',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
  },
  {
    id: 2,
    name: 'Patience (Lo-Fi Beat)',
    artist: 'Serene Minds',
    emoji: '☕',
    color: 'from-amber-600 to-amber-900',
    accent: '#d97706',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
  },
  {
    id: 3,
    name: 'Chill Lo-Fi Song',
    artist: 'RainyFocus',
    emoji: '🎵',
    color: 'from-slate-600 to-slate-900',
    accent: '#64748b',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-13.mp3',
  },
  {
    id: 4,
    name: 'Aesthetic Chill',
    artist: 'Lofi Vibes',
    emoji: '🌆',
    color: 'from-fuchsia-600 to-fuchsia-900',
    accent: '#d946ef',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-14.mp3',
  },
  {
    id: 5,
    name: 'Midnight Relaxing LoFi',
    artist: 'Night Owl Beats',
    emoji: '🌙',
    color: 'from-blue-600 to-blue-900',
    accent: '#3b82f6',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-15.mp3',
  },
  {
    id: 6,
    name: 'Smooth Study Beat',
    artist: 'Focus Lab',
    emoji: '📚',
    color: 'from-emerald-600 to-emerald-900',
    accent: '#10b981',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-16.mp3',
  },
  {
    id: 7,
    name: 'Morning Coffee Chill',
    artist: 'Cafe Sounds',
    emoji: '🍩',
    color: 'from-orange-500 to-orange-800',
    accent: '#f97316',
    url: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-17.mp3',
  }
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
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  const currentTrack = TRACKS[currentTrackIndex];

  // Helper formatting mm:ss
  const formatTime = (seconds) => {
    if (!seconds || isNaN(seconds)) return '0:00';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  // Init audio
  useEffect(() => {
    audioRef.current = new Audio();
    audioRef.current.loop = true;
    audioRef.current.volume = 0.5;
    audioRef.current.src = TRACKS[0].url;

    const handleEnded = () => setIsPlaying(false);
    const handleTimeUpdate = () => setPlayed(audioRef.current.currentTime);
    const handleLoadedMetadata = () => setDuration(audioRef.current.duration);

    audioRef.current.addEventListener('ended', handleEnded);
    audioRef.current.addEventListener('timeupdate', handleTimeUpdate);
    audioRef.current.addEventListener('loadedmetadata', handleLoadedMetadata);

    return () => {
      audioRef.current?.pause();
      audioRef.current?.removeEventListener('ended', handleEnded);
      audioRef.current?.removeEventListener('timeupdate', handleTimeUpdate);
      audioRef.current?.removeEventListener('loadedmetadata', handleLoadedMetadata);
    };
  }, []);

  // When track changes
  useEffect(() => {
    if (!audioRef.current) return;
    setIsLoading(true);
    setPlayed(0);
    audioRef.current.pause();
    
    // Safety check just in case we get an out-of-bounds index due to filtered categories
    const validTrack = TRACKS[currentTrackIndex] || TRACKS[0];
    
    audioRef.current.src = validTrack.url;
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

  const seekAudio = (e) => {
    if (!audioRef.current) return;
    const newTime = parseFloat(e.target.value);
    audioRef.current.currentTime = newTime;
    setPlayed(newTime);
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
            <motion.div
              animate={isPlaying ? { rotate: 360 } : { rotate: 0 }}
              transition={{ repeat: isPlaying ? Infinity : 0, duration: 4, ease: 'linear' }}
              className={`p-2.5 rounded-full border border-white/20 backdrop-blur-md transition-all ${isPlaying ? 'shadow-[0_0_20px_rgba(255,255,255,0.3)] opacity-100 scale-105' : 'opacity-60'}`}
              style={{ backgroundColor: `${currentTrack?.accent}55` }}
            >
              <Disc size={20} className={isPlaying ? 'text-white' : 'text-white/70'} />
            </motion.div>
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
                {currentTrack?.emoji} LO-FI AUDIO
              </p>
              <h3 className="text-lg md:text-xl font-black leading-tight truncate">{currentTrack?.name}</h3>
            </div>
            <Visualizer isPlaying={isPlaying} accent={currentTrack?.accent} />
          </div>

          {/* Progress Bar */}
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white/50 w-8">{formatTime(played)}</span>
            <div className="flex-1 relative h-1.5 bg-white/20 rounded-full cursor-pointer group flex items-center">
              <div 
                className="absolute h-full rounded-full pointer-events-none transition-all duration-75"
                style={{ width: `${(played / (duration || 1)) * 100}%`, backgroundColor: currentTrack?.accent || 'white' }}
              />
              <input 
                type="range"
                min={0}
                max={duration || 100}
                value={played}
                onChange={seekAudio}
                className="absolute inset-0 w-full opacity-0 cursor-pointer h-full"
              />
            </div>
            <span className="text-[10px] font-bold text-white/50 w-8 text-right">{formatTime(duration)}</span>
          </div>
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
            <h4 className="text-base font-black text-white">{TRACKS.length} Tracks</h4>
          </div>
          <button
            onClick={() => setShowPlaylist(false)}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Track list */}
        <div className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
          {TRACKS.map((track) => {
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
