import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Track, Playlist } from '../types';
import { PlayIcon, CpuIcon, SearchIcon } from '../components/Icons';

interface HomeProps {
  onPlayTrack: (track: Track) => void;
  refreshTrigger?: number; // Added to trigger re-fetch without unmounting
}

const Home: React.FC<HomeProps> = ({ onPlayTrack, refreshTrigger = 0 }) => {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      // Don't set loading to true on refresh to prevent UI flickering
      if (refreshTrigger === 0) setLoading(true); 
      
      const [t, p] = await Promise.all([
        api.tracks.list(),
        api.playlists.list()
      ]);
      setTracks(t);
      setPlaylists(p);
      setLoading(false);
    };
    fetchData();
  }, [refreshTrigger]); // Re-run when refreshTrigger changes

  const handleSearch = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      setIsSearching(true);
      try {
        const results = await api.tracks.search(searchQuery);
        setTracks(results);
      } catch (error) {
        console.error("Search failed", error);
      } finally {
        setIsSearching(false);
      }
    }
  };

  const handleClearSearch = async () => {
      setSearchQuery('');
      // Optimistic UI update or quick fetch
      const allTracks = await api.tracks.list();
      setTracks(allTracks);
  }

  if (loading) {
     return <div className="p-20 text-zinc-500 ml-20">Loading Vibe Stream...</div>;
  }

  // Fallback if DB is empty
  const featuredTrack = tracks[1] || tracks[0];

  return (
    <div className="max-w-7xl mx-auto p-10 pt-10 pb-40 space-y-12 ml-20">
      
      {/* Search Header */}
      <header className="flex justify-between items-center">
         <div>
            <h1 className="text-3xl font-black tracking-tight text-white hidden md:block">GOOD EVENING</h1>
         </div>
         <div className="relative w-full md:w-96 group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <SearchIcon className={`w-5 h-5 transition-colors ${isSearching ? 'text-orange-500' : 'text-zinc-500'}`} />
            </div>
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
              placeholder="Search artists, tracks, moods..."
              className="w-full bg-zinc-900/60 backdrop-blur-md border border-white/10 rounded-full py-3 pl-12 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all shadow-lg"
            />
            {searchQuery && (
                <button onClick={handleClearSearch} className="absolute inset-y-0 right-4 text-zinc-500 hover:text-white text-xs">
                    CLEAR
                </button>
            )}
            {isSearching && (
                <div className="absolute right-12 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
            )}
         </div>
      </header>

      {/* Featured Stage - Hide if searching to focus on results */}
      {!searchQuery && (
        <section className="relative h-[450px] w-full rounded-[40px] overflow-hidden group cursor-pointer border border-white/5 animate-in fade-in duration-700">
            <img 
            src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=2070&auto=format&fit=crop" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105" 
            alt="Featured"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            <div className="absolute bottom-12 left-12 max-w-xl">
            <span className="bg-orange-600 text-black px-3 py-1 rounded-full text-xs font-black mb-4 inline-block uppercase tracking-widest">Featured Vibe</span>
            <h2 className="text-6xl font-black text-white leading-tight mb-4 tracking-tighter">NEON DREAMS GENERATOR</h2>
            <p className="text-zinc-300 text-lg mb-8 line-clamp-2">Immerse yourself in AI-curated soundscapes that adapt to your heart rate and environment.</p>
            {featuredTrack && (
                <button 
                onClick={() => onPlayTrack(featuredTrack)}
                className="bg-white text-black px-10 py-4 rounded-2xl font-black hover:bg-orange-500 transition-colors flex items-center gap-3 group/btn"
                >
                <PlayIcon className="w-5 h-5 group-hover/btn:scale-125 transition-transform" /> START EXPERIENCE
                </button>
            )}
            </div>
        </section>
      )}

      {/* Bento Grid Content */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Large Bento: Results or Daily Pulse */}
        <div className="md:col-span-2 bg-zinc-900/40 p-10 rounded-[40px] border border-white/5 flex flex-col justify-between group overflow-hidden relative min-h-[400px]">
          <div className="relative z-10">
            <h3 className="text-3xl font-black mb-2 tracking-tight">
                {searchQuery ? `SEARCH RESULTS: "${searchQuery}"` : "DAILY PULSE"}
            </h3>
            <p className="text-zinc-500 max-w-xs">
                {searchQuery ? "Tracks found across the Aura Network." : "Your musical signature updated every hour based on your mood history."}
            </p>
          </div>
          
          <div className="flex gap-4 mt-12 relative z-10 overflow-x-auto pb-4 no-scrollbar">
            {tracks.length === 0 ? (
                <div className="text-zinc-500 italic">No audio signals found via Search.</div>
            ) : (
                tracks.map((track) => (
                <div 
                    key={track.id}
                    onClick={() => onPlayTrack(track)}
                    className="flex-shrink-0 w-40 group/item cursor-pointer"
                >
                    <div className="relative mb-3 overflow-hidden rounded-2xl">
                    <img src={track.coverUrl} className="w-full aspect-square object-cover transition-transform duration-500 group-hover/item:scale-110" alt={track.title} />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/item:opacity-100 transition-opacity flex items-center justify-center">
                        <PlayIcon className="w-10 h-10 text-orange-500" />
                    </div>
                    </div>
                    <h4 className="text-white font-bold text-sm truncate">{track.title}</h4>
                    <p className="text-zinc-500 text-xs">{track.artist}</p>
                </div>
                ))
            )}
          </div>
          
          {/* Background Aura */}
          <div className="absolute -right-20 -bottom-20 w-80 h-80 bg-orange-600/10 blur-[100px] rounded-full group-hover:bg-orange-600/20 transition-all duration-700" />
        </div>

        {/* Vertical Bento: AI Detection */}
        <div className="bg-gradient-to-br from-zinc-800/40 to-black p-10 rounded-[40px] border border-white/5 flex flex-col justify-center items-center text-center space-y-6">
           <div className="w-20 h-20 bg-orange-500/20 rounded-3xl flex items-center justify-center border border-orange-500/30">
              <CpuIcon className="w-10 h-10 text-orange-500" />
           </div>
           <div>
             <h3 className="text-xl font-black mb-2 tracking-tight uppercase">SYNTH GUARDIAN</h3>
             <p className="text-zinc-400 text-sm">Real-time analysis active.</p>
           </div>
           <div className="flex gap-1">
              {[1,2,3,4,5].map(i => <div key={i} className="w-1.5 h-6 bg-orange-500/50 rounded-full animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />)}
           </div>
        </div>

        {/* Row of Playlists */}
        {!searchQuery && (
            <div className="md:col-span-3 grid grid-cols-2 md:grid-cols-4 gap-6">
            {playlists.map((playlist, idx) => (
                <div 
                key={playlist.id}
                className={`relative h-64 rounded-[40px] overflow-hidden p-8 flex flex-col justify-end group cursor-pointer border border-white/5 ${idx % 2 === 0 ? 'bg-zinc-900/40' : 'bg-white/5'}`}
                >
                    <img src={playlist.coverUrl} className="absolute inset-0 w-full h-full object-cover opacity-20 grayscale group-hover:grayscale-0 group-hover:opacity-40 transition-all duration-500" alt={playlist.name} />
                    <h4 className="text-2xl font-black relative z-10 tracking-tight leading-none mb-1">{playlist.name}</h4>
                    <p className="text-zinc-500 text-sm relative z-10 uppercase tracking-widest">{playlist.trackCount} Tracks</p>
                    <div className="absolute top-8 right-8 w-12 h-12 bg-white rounded-full flex items-center justify-center opacity-0 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                        <PlayIcon className="w-6 h-6 text-black ml-1" />
                    </div>
                </div>
            ))}
            </div>
        )}

      </section>
    </div>
  );
};

export default Home;