import React from 'react';
import { View } from '../types';
import { HomeIcon, SearchIcon, LibraryIcon, BarChartIcon, UsersIcon, LifeBuoyIcon } from './Icons';

interface SidebarProps {
  currentView: View;
  onChangeView: (view: View) => void;
  onOpenAddModal: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onChangeView, onOpenAddModal }) => {
  const items = [
    { view: View.HOME, icon: HomeIcon, label: 'Explore' },
    { view: View.STATS, icon: BarChartIcon, label: 'Analytics' },
    { view: View.SOCIAL, icon: UsersIcon, label: 'Social' },
    { view: View.SUPPORT, icon: LifeBuoyIcon, label: 'AI Oracle' },
  ];

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-6 p-3 bg-zinc-900/40 backdrop-blur-2xl border border-white/10 rounded-full shadow-2xl">
      <button 
        onClick={onOpenAddModal}
        className="w-10 h-10 bg-gradient-to-tr from-orange-600 to-amber-400 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-orange-600/20 hover:scale-110 transition-transform cursor-pointer group"
        title="Add Custom Track"
      >
         <span className="text-black font-black text-xl group-hover:rotate-90 transition-transform">+</span>
      </button>

      {items.map((item) => (
        <button
          key={item.label}
          onClick={() => onChangeView(item.view)}
          className={`group relative p-3 rounded-full transition-all duration-300 ${
            currentView === item.view 
              ? 'bg-orange-500 text-black scale-110 shadow-lg shadow-orange-500/40' 
              : 'text-zinc-500 hover:text-orange-400 hover:bg-white/5'
          }`}
          title={item.label}
        >
          <item.icon className="w-6 h-6" />
          <span className="absolute left-16 bg-zinc-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap border border-white/5">
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};

export default Sidebar;