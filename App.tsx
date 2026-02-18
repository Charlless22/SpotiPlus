import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import AddTrackModal from './components/AddTrackModal';
import Home from './pages/Home';
import Stats from './pages/Stats';
import Support from './pages/Support';
import Social from './pages/Social';
import { View, Track } from './types';
import { api } from './services/api';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.HOME);
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  // Track refresh trigger to update views when data changes
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Initial Data Load
  useEffect(() => {
    const init = async () => {
      try {
        const tracks = await api.tracks.list();
        if (tracks.length > 0 && !currentTrack) {
          setCurrentTrack(tracks[0]);
        }
      } catch (e) {
        console.error("Failed to connect to backend");
      } finally {
        setIsLoading(false);
      }
    };
    init();
  }, []); // Only run on mount, sub-components handle refreshTrigger

  const primaryColor = currentTrack?.primaryColor || '#18181b';

  const handlePlayTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleNext = async () => {
    if(!currentTrack) return;
    const tracks = await api.tracks.list(); // In real app, rely on local state or context for list
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    const nextTrack = tracks[(idx + 1) % tracks.length];
    setCurrentTrack(nextTrack);
  };

  const handlePrev = async () => {
    if(!currentTrack) return;
    const tracks = await api.tracks.list();
    const idx = tracks.findIndex(t => t.id === currentTrack.id);
    const prevTrack = tracks[(idx - 1 + tracks.length) % tracks.length];
    setCurrentTrack(prevTrack);
  };
  
  const handleTrackAdded = () => {
      // Force refresh of data
      setRefreshTrigger(prev => prev + 1);
      // Switch to home to see the new track
      setCurrentView(View.HOME);
  };

  const renderView = () => {
    switch (currentView) {
      case View.HOME:
        // OPTIMIZATION: Removed key={key} to prevent full DOM destruction/recreation.
        // Passed refreshTrigger as prop for internal useEffect handling.
        return <Home onPlayTrack={handlePlayTrack} refreshTrigger={refreshTrigger} />;
      case View.STATS:
        return <div className="ml-20"><Stats /></div>;
      case View.SUPPORT:
        return <div className="ml-20"><Support /></div>;
      case View.SOCIAL:
        return <div className="ml-20"><Social /></div>;
      default:
        return <div className="ml-20 h-screen flex items-center justify-center text-zinc-600">Module offline</div>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#09090b] flex flex-col items-center justify-center gap-4">
        <div className="w-16 h-16 border-4 border-orange-500/30 border-t-orange-500 rounded-full animate-spin"></div>
        <p className="text-orange-500 font-mono text-sm animate-pulse">CONNECTING TO AURA CORE...</p>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[#09090b] text-white selection:bg-orange-500 selection:text-black overflow-x-hidden">
      
      {/* Immersive Background Blur - OPTIMIZED */}
      {/* Added transform-gpu to force hardware acceleration and reduced blur complexity */}
      <div 
        className="fixed top-[-20%] left-[-10%] w-[120%] h-[120%] opacity-20 pointer-events-none transition-colors duration-1000 blur-[120px] z-0 transform-gpu will-change-transform"
        style={{ background: `radial-gradient(circle at center, ${primaryColor}, transparent 60%)` }}
      />

      <Sidebar 
        currentView={currentView} 
        onChangeView={setCurrentView} 
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />
      
      <main className="relative z-10 w-full transition-opacity duration-500">
        {renderView()}
      </main>

      <Player 
        currentTrack={currentTrack} 
        isPlaying={isPlaying} 
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrev={handlePrev}
      />
      
      <AddTrackModal 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        onTrackAdded={handleTrackAdded}
      />
    </div>
  );
};

export default App;