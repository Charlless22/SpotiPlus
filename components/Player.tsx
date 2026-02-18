import React, { useState, useEffect, useRef } from 'react';
import { Track } from '../types';
import { PlayIcon, PauseIcon, SkipBackIcon, SkipForwardIcon, HeartIcon, CpuIcon } from './Icons';

interface PlayerProps {
  currentTrack: Track | null;
  isPlaying: boolean;
  onPlayPause: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Player: React.FC<PlayerProps> = ({ currentTrack, isPlaying, onPlayPause, onNext, onPrev }) => {
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Handle Audio Element logic
  useEffect(() => {
    if (!audioRef.current || !currentTrack) return;

    if (isPlaying) {
      // Play
      const playPromise = audioRef.current.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Audio playback blocked or failed:", error);
          // Fallback logic if needed, or just UI update
        });
      }
    } else {
      audioRef.current.pause();
    }
  }, [isPlaying, currentTrack]);

  // Handle source change
  useEffect(() => {
    if(audioRef.current) {
        audioRef.current.load();
        setProgress(0);
        if(isPlaying) audioRef.current.play().catch(() => {});
    }
  }, [currentTrack]);

  // Update Progress Bar
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const duration = audioRef.current.duration || 30; // Default to 30s for previews
      const current = audioRef.current.currentTime;
      setProgress((current / duration) * 100);
      
      // Auto next when finished
      if(current >= duration && duration > 0) {
          onNext();
      }
    }
  };

  // Fallback timer if no previewUrl
  useEffect(() => {
    let interval: any;
    if (isPlaying && !currentTrack?.previewUrl) {
      interval = setInterval(() => {
        setProgress((prev) => (prev >= 100 ? 0 : prev + 0.2));
      }, 500);
    }
    return () => clearInterval(interval);
  }, [isPlaying, currentTrack]);

  if (!currentTrack) return null;

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] w-full max-w-2xl px-4">
      {/* Hidden Audio Element for Logic */}
      {currentTrack.previewUrl && (
          <audio 
            ref={audioRef}
            src={currentTrack.previewUrl}
            onTimeUpdate={handleTimeUpdate}
            onEnded={onNext}
          />
      )}

      <div className="bg-zinc-900/60 backdrop-blur-3xl border border-white/10 p-3 rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] flex items-center gap-4 relative overflow-hidden group">
        
        {/* Glow effect matching track color */}
        <div 
          className="absolute inset-0 opacity-10 pointer-events-none transition-colors duration-1000"
          style={{ background: `radial-gradient(circle at center, ${currentTrack.primaryColor}, transparent)` }}
        />

        {/* Artwork with rotation animation */}
        <div className="relative flex-shrink-0">
          <img 
            src={currentTrack.coverUrl} 
            className={`w-16 h-16 rounded-2xl object-cover shadow-xl transition-transform duration-500 ${isPlaying ? 'scale-105' : 'scale-95'}`}
            alt={currentTrack.title} 
          />
          {currentTrack.isAiGenerated && (
             <div className="absolute -top-1 -right-1 bg-orange-500 text-black p-1 rounded-full border-2 border-zinc-900 shadow-lg">
                <CpuIcon className="w-3 h-3" />
             </div>
          )}
        </div>

        {/* Info & Progress */}
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-end mb-1">
            <div className="truncate">
              <h4 className="text-white font-bold text-sm tracking-wide">{currentTrack.title}</h4>
              <p className="text-zinc-400 text-xs">{currentTrack.artist}</p>
            </div>
            <span className="text-[10px] font-mono text-zinc-500">
               {/* Display Real Time if available, else fake it */}
              {currentTrack.previewUrl ? 'PREVIEW' : 
                 `${Math.floor((progress/100) * currentTrack.duration / 60)}:${String(Math.floor((progress/100) * currentTrack.duration % 60)).padStart(2, '0')}`
              }
            </span>
          </div>
          
          <div className="relative h-1 w-full bg-white/5 rounded-full overflow-hidden">
             <div 
               className="absolute top-0 left-0 h-full bg-gradient-to-r from-orange-600 to-amber-400 transition-all duration-300" 
               style={{ width: `${progress}%` }}
             />
          </div>
        </div>

        {/* Compact Controls */}
        <div className="flex items-center gap-2">
          <button onClick={onPrev} className="p-2 text-zinc-400 hover:text-white transition-colors">
            <SkipBackIcon className="w-4 h-4" />
          </button>
          
          <button 
            onClick={onPlayPause} 
            className="w-12 h-12 bg-white text-black rounded-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg"
          >
            {isPlaying ? <PauseIcon className="w-6 h-6" /> : <PlayIcon className="w-6 h-6 ml-1" />}
          </button>

          <button onClick={onNext} className="p-2 text-zinc-400 hover:text-white transition-colors">
            <SkipForwardIcon className="w-4 h-4" />
          </button>
          
          <div className="w-px h-8 bg-white/10 mx-1" />
          
          <button className="p-2 text-zinc-400 hover:text-orange-500 transition-colors">
            <HeartIcon className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Player;