import { useState, useRef, useEffect } from 'react';
import { Play, Pause, FastForward, Rewind, Music, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, name: 'Deep Focus Lo-Fi', url: 'https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3?filename=lofi-study-112191.mp3' },
  { id: 2, name: 'Chill Vibes', url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_10fc1bb271.mp3?filename=lofi-chill-medium-version-11317.mp3' },
  { id: 3, name: 'Night Drive', url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_92425cbfa1.mp3?filename=night-city-with-cars-10023.mp3' }
];

const FocusMusicPlayer = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  
  const audioRef = useRef(new Audio(TRACKS[0].url));

  useEffect(() => {
    audioRef.current.volume = volume;
    audioRef.current.loop = true;
  }, []);

  useEffect(() => {
    audioRef.current.src = TRACKS[currentTrackIndex].url;
    audioRef.current.volume = isMuted ? 0 : volume;
    if (isPlaying) {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    audioRef.current.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play().catch(e => console.log('Audio play failed:', e));
    }
    setIsPlaying(!isPlaying);
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const toggleMute = () => setIsMuted(!isMuted);

  return (
    <div className="p-6 md:p-8 rounded-[2.5rem] md:rounded-[3rem] bg-indigo-950 text-white shadow-2xl relative overflow-hidden">
      {/* Visualizer Background */}
      <div className="absolute inset-0 opacity-10 flex items-end justify-between px-4 pb-4 pointer-events-none">
        {[...Array(12)].map((_, i) => (
          <div 
            key={i} 
            className={`w-3 md:w-4 bg-indigo-400 rounded-t-full transition-all duration-300 ${isPlaying ? 'animate-pulse' : 'h-2'}`}
            style={{ 
               height: isPlaying ? `${Math.max(10, Math.random() * 100)}%` : '10px',
               animationDelay: `${i * 0.1}s` 
            }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-6">
        <div className="flex items-center justify-between">
           <div className="flex items-center gap-3">
              <div className={`p-3 rounded-2xl ${isPlaying ? 'bg-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'bg-indigo-900 text-indigo-400'} transition-all`}>
                 <Music size={20} className={isPlaying ? 'animate-bounce' : ''} />
              </div>
              <div className="space-y-1">
                 <h4 className="text-xs md:text-sm font-black uppercase tracking-widest text-indigo-200">FOCUS AUDIO</h4>
                 <p className="text-sm md:text-base font-black truncate max-w-[150px] md:max-w-xs">{TRACKS[currentTrackIndex].name}</p>
              </div>
           </div>
           <button onClick={toggleMute} className="p-2 text-indigo-400 hover:text-white transition-colors">
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
           </button>
        </div>

        <div className="flex items-center justify-center gap-6">
           <button onClick={prevTrack} className="p-3 bg-indigo-900 rounded-full text-indigo-300 hover:text-white hover:bg-indigo-800 transition-all active:scale-90">
              <Rewind size={20} />
           </button>
           
           <button onClick={togglePlay} className="p-5 bg-indigo-500 rounded-full text-white shadow-[0_0_20px_rgba(99,102,241,0.4)] hover:scale-105 active:scale-95 transition-all">
              {isPlaying ? <Pause size={28} /> : <Play size={28} className="translate-x-0.5" />}
           </button>
           
           <button onClick={nextTrack} className="p-3 bg-indigo-900 rounded-full text-indigo-300 hover:text-white hover:bg-indigo-800 transition-all active:scale-90">
              <FastForward size={20} />
           </button>
        </div>
      </div>
    </div>
  );
};

export default FocusMusicPlayer;
