import React, { useEffect, useState } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell } from 'recharts';
import { api } from '../services/api';
import { UserStats } from '../types';

const Stats: React.FC = () => {
  const [stats, setStats] = useState<UserStats | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const data = await api.user.stats();
      setStats(data);
    };
    fetchStats();
  }, []);

  // Warm palette for genres: Orange, Red, Amber, Brown
  const genreColors = ['#f97316', '#ef4444', '#f59e0b', '#78350f'];

  if (!stats) return <div className="p-8 text-zinc-500">Loading Analytics...</div>;

  return (
    <div className="p-8 pb-32 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="mb-8">
        <h2 className="text-4xl font-bold text-white mb-2">Your Audio DNA</h2>
        <p className="text-zinc-400">Deep dive into your listening habits, mood, and genre distribution.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Mood Graph */}
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
          <h3 className="text-xl font-bold text-white mb-6">Mood History (Valence)</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={stats.moodHistory}>
                <defs>
                  <linearGradient id="colorValence" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                <XAxis dataKey="date" stroke="#71717a" tick={{fill: '#71717a'}} axisLine={false} tickLine={false} />
                <YAxis hide domain={[0, 1]} />
                <Tooltip 
                    contentStyle={{ backgroundColor: '#18181b', borderColor: '#333', color: '#fff' }} 
                    itemStyle={{ color: '#f97316' }}
                />
                <Area type="monotone" dataKey="valence" stroke="#f97316" strokeWidth={3} fillOpacity={1} fill="url(#colorValence)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <p className="text-center text-xs text-zinc-500 mt-4">Higher values indicate happier, more energetic tracks.</p>
        </div>

        {/* Top Artists */}
        <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
           <h3 className="text-xl font-bold text-white mb-6">Lifetime Top Artists (Hours)</h3>
           <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.topArtists} layout="vertical">
                    <XAxis type="number" hide />
                    <YAxis dataKey="name" type="category" width={100} stroke="#a1a1aa" tick={{fill: '#e4e4e7', fontSize: 12}} axisLine={false} tickLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ backgroundColor: '#18181b', borderColor: '#333' }} />
                    <Bar dataKey="hours" radius={[0, 4, 4, 0]}>
                        {stats.topArtists.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#ea580c' : '#f97316'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
           </div>
        </div>
      </div>

      {/* Genre Distribution (Simple Visual) */}
      <div className="bg-zinc-900/50 p-6 rounded-2xl border border-white/5">
        <h3 className="text-xl font-bold text-white mb-6">Genre Distribution</h3>
        <div className="flex h-12 w-full rounded-full overflow-hidden">
            {stats.genreDistribution.map((genre, idx) => (
                <div 
                    key={genre.name}
                    style={{ width: `${genre.value}%`, backgroundColor: genreColors[idx % genreColors.length] }}
                    className="h-full flex items-center justify-center relative group"
                >
                    <span className="text-[10px] md:text-xs font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity absolute">{genre.name} {genre.value}%</span>
                </div>
            ))}
        </div>
        <div className="flex gap-4 mt-4 justify-center">
             {stats.genreDistribution.map((genre, idx) => (
                 <div key={genre.name} className="flex items-center gap-2">
                     <div className="w-3 h-3 rounded-full" style={{ backgroundColor: genreColors[idx % genreColors.length] }}></div>
                     <span className="text-xs text-zinc-400">{genre.name}</span>
                 </div>
             ))}
        </div>
      </div>
    </div>
  );
};

export default Stats;