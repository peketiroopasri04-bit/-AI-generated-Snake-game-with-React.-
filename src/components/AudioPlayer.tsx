import { useState, useEffect, useRef } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, Music } from 'lucide-react';

const TRACKS = [
  {
    id: 1,
    title: 'Neon Grid (AI Mix)',
    artist: 'Synthetic Mind',
    url: 'https://cdn.pixabay.com/download/audio/2022/10/18/audio_31c2730e64.mp3?filename=lofi-study-112191.mp3', // Lofi cyber track
  },
  {
    id: 2,
    title: 'Cybernetic Dreams',
    artist: 'Neural Network',
    url: 'https://cdn.pixabay.com/download/audio/2022/03/15/audio_a1ed93e828.mp3?filename=chillwave-112134.mp3', // Synthwave track
  },
  {
    id: 3,
    title: 'Bitstream Runner',
    artist: 'Deep Learning',
    url: 'https://cdn.pixabay.com/download/audio/2022/01/18/audio_d0c6ff1bc0.mp3?filename=synthwave-80s-111124.mp3', // Retro 80s synth
  }
];

export default function AudioPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = TRACKS[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(console.error);
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
    setIsPlaying(true);
  };

  const handleEnded = () => {
    nextTrack();
  };

  return (
    <div className="w-full max-w-md mx-auto p-4 rounded-xl border border-pink-500/30 bg-zinc-900/50 backdrop-blur-md box-glow-pink">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="flex items-center space-x-4 mb-4">
        <div className="w-12 h-12 rounded-lg bg-pink-500/20 flex items-center justify-center flex-shrink-0 animate-pulse border border-pink-500/50">
          <Music className="w-6 h-6 text-pink-400" />
        </div>
        <div className="overflow-hidden flex-1">
          <div className="truncate text-pink-100 font-semibold text-lg text-glow-pink">
            {currentTrack.title}
          </div>
          <div className="text-zinc-400 text-sm font-mono truncate">
            {currentTrack.artist}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMuted(!isMuted)}
            className="p-2 text-zinc-400 hover:text-pink-400 transition-colors"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-20 accent-pink-500"
          />
        </div>

        <div className="flex items-center space-x-3">
          <button 
            onClick={prevTrack} 
            className="p-2 text-zinc-300 hover:text-white transition-colors"
          >
            <SkipBack className="w-5 h-5 fill-current" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="w-12 h-12 flex items-center justify-center rounded-full bg-pink-600 hover:bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)] transition-all transform hover:scale-105 active:scale-95"
          >
            {isPlaying ? (
              <Pause className="w-5 h-5 fill-current" />
            ) : (
              <Play className="w-5 h-5 fill-current ml-1" />
            )}
          </button>
          
          <button 
            onClick={nextTrack} 
            className="p-2 text-zinc-300 hover:text-white transition-colors"
          >
            <SkipForward className="w-5 h-5 fill-current" />
          </button>
        </div>
      </div>
      
      {/* Equalizer generic visualizer animation */}
      <div className="h-1 flex items-end justify-center space-x-1 mt-4 overflow-hidden mask-image-linear">
         {[...Array(20)].map((_, i) => (
            <div 
              key={i} 
              className="w-full bg-pink-500/50 rounded-t-sm transition-all duration-300"
              style={{
                height: isPlaying ? `${Math.max(20, Math.random() * 100)}%` : '20%',
                opacity: isPlaying ? 0.8 : 0.3
              }}
            />
         ))}
      </div>
    </div>
  );
}
