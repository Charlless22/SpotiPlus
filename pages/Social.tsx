import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Track } from '../types';
import { UsersIcon, PlayIcon } from '../components/Icons';

const Social: React.FC = () => {
  const [battleTracks, setBattleTracks] = useState<Track[]>([]);

  useEffect(() => {
      const loadTracks = async () => {
          const tracks = await api.tracks.list();
          // Pick 2 random tracks for battle
          if(tracks.length >= 4) {
              setBattleTracks([tracks[0], tracks[3]]);
          }
      };
      loadTracks();
  }, []);

  if (battleTracks.length < 2) return <div className="p-20 text-zinc-500">Loading Social Hub...</div>;

  return (
    <div className="p-8 pb-32 space-y-12">
        <header>
            <h2 className="text-3xl font-bold text-white mb-2">Social Hub</h2>
            <p className="text-zinc-400">Battle playlists and listen with friends.</p>
        </header>

        {/* Playlist Battle */}
        <section className="bg-gradient-to-br from-orange-900/30 to-red-900/30 p-8 rounded-3xl border border-orange-500/20 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-32 bg-orange-500 rounded-full blur-[100px] opacity-10 pointer-events-none"></div>
             
             <div className="flex justify-between items-center mb-8 relative z-10">
                 <div>
                     <span className="bg-orange-500 text-black text-xs font-bold px-2 py-1 rounded mb-2 inline-block">LIVE NOW</span>
                     <h3 className="text-2xl font-bold text-white">Daily Playlist Battle: Synth vs Retro</h3>
                     <p className="text-zinc-300 text-sm">Vote for the best track to win points.</p>
                 </div>
                 <div className="text-right">
                     <div className="text-3xl font-mono font-bold text-orange-400">04:22:10</div>
                     <span className="text-xs text-zinc-500">TIME REMAINING</span>
                 </div>
             </div>

             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
                 {/* Contender A */}
                 <div className="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-orange-500/50 transition-colors group cursor-pointer">
                     <div className="flex items-center gap-4 mb-4">
                         <img src={battleTracks[0].coverUrl} className="w-16 h-16 rounded shadow-lg" alt="track" />
                         <div>
                             <h4 className="font-bold text-white">{battleTracks[0].title}</h4>
                             <p className="text-zinc-400 text-sm">{battleTracks[0].artist}</p>
                         </div>
                     </div>
                     <button className="w-full py-2 bg-white/10 group-hover:bg-orange-500 group-hover:text-black font-bold rounded-lg transition-all">
                         Vote Contender A
                     </button>
                 </div>

                 {/* Contender B */}
                 <div className="bg-black/40 p-4 rounded-xl border border-white/5 hover:border-orange-500/50 transition-colors group cursor-pointer">
                     <div className="flex items-center gap-4 mb-4">
                         <img src={battleTracks[1].coverUrl} className="w-16 h-16 rounded shadow-lg" alt="track" />
                         <div>
                             <h4 className="font-bold text-white">{battleTracks[1].title}</h4>
                             <p className="text-zinc-400 text-sm">{battleTracks[1].artist}</p>
                         </div>
                     </div>
                     <button className="w-full py-2 bg-white/10 group-hover:bg-orange-500 group-hover:text-black font-bold rounded-lg transition-all">
                         Vote Contender B
                     </button>
                 </div>
             </div>
        </section>

        {/* Active Sessions */}
        <section>
            <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                <UsersIcon className="w-5 h-5" /> Active Listening Sessions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="bg-zinc-900/50 p-6 rounded-xl border border-white/5 flex flex-col gap-4">
                        <div className="flex -space-x-2 overflow-hidden">
                            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-zinc-900" src={`https://picsum.photos/id/${100+i}/50`} alt="" />
                            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-zinc-900" src={`https://picsum.photos/id/${110+i}/50`} alt="" />
                            <img className="inline-block h-8 w-8 rounded-full ring-2 ring-zinc-900" src={`https://picsum.photos/id/${120+i}/50`} alt="" />
                        </div>
                        <div>
                            <h4 className="font-bold text-white">Chill Loft Beats</h4>
                            <p className="text-xs text-orange-400">Listening to Lofi Girl • 3 listeners</p>
                        </div>
                        <button className="mt-auto flex items-center justify-center gap-2 w-full py-2 bg-orange-600/20 text-orange-400 font-bold rounded-lg hover:bg-orange-600 hover:text-white transition-all text-sm">
                            <PlayIcon className="w-4 h-4" /> Join Session
                        </button>
                    </div>
                ))}
            </div>
        </section>
    </div>
  );
};

export default Social;