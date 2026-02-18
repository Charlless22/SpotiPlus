import React, { useState } from 'react';
import { api } from '../services/api';
import { Track } from '../types';

interface AddTrackModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTrackAdded: () => void;
}

const AddTrackModal: React.FC<AddTrackModalProps> = ({ isOpen, onClose, onTrackAdded }) => {
  const [formData, setFormData] = useState({
    title: '',
    artist: '',
    album: '',
    previewUrl: '',
    coverUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await api.tracks.add(formData);
      onTrackAdded();
      onClose();
      // Reset form
      setFormData({ title: '', artist: '', album: '', previewUrl: '', coverUrl: '' });
    } catch (error) {
      console.error(error);
      alert('Failed to add track. Please ensure Title and Artist are filled.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-zinc-900 border border-white/10 p-8 rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in-95 duration-300">
        <h2 className="text-2xl font-black text-white mb-1">IMPORT SOUND</h2>
        <p className="text-zinc-400 text-sm mb-6">Add a custom track to your local library.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Track Title *</label>
            <input 
              required
              type="text" 
              value={formData.title} 
              onChange={e => setFormData({...formData, title: e.target.value})}
              className="w-full bg-zinc-800 border-none rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="e.g. Neon Nights"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Artist *</label>
            <input 
              required
              type="text" 
              value={formData.artist} 
              onChange={e => setFormData({...formData, artist: e.target.value})}
              className="w-full bg-zinc-800 border-none rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="e.g. CyberPunk Collective"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Album (Opt)</label>
                <input 
                  type="text" 
                  value={formData.album} 
                  onChange={e => setFormData({...formData, album: e.target.value})}
                  className="w-full bg-zinc-800 border-none rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="Single"
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">Cover URL (Opt)</label>
                <input 
                  type="text" 
                  value={formData.coverUrl} 
                  onChange={e => setFormData({...formData, coverUrl: e.target.value})}
                  className="w-full bg-zinc-800 border-none rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  placeholder="https://..."
                />
             </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-zinc-500 uppercase mb-1">MP3 Preview URL (Opt)</label>
            <input 
              type="text" 
              value={formData.previewUrl} 
              onChange={e => setFormData({...formData, previewUrl: e.target.value})}
              className="w-full bg-zinc-800 border-none rounded-xl px-4 py-3 text-white focus:ring-2 focus:ring-orange-500 focus:outline-none"
              placeholder="https://example.com/audio.mp3"
            />
            <p className="text-[10px] text-zinc-600 mt-1">Leave blank for a dummy track.</p>
          </div>

          <div className="flex gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 py-3 rounded-xl font-bold text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="flex-1 py-3 bg-orange-600 rounded-xl font-bold text-white hover:bg-orange-500 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Importing...' : 'Add to Library'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddTrackModal;