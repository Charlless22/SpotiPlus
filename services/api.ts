import { TrackController, PlaylistController, UserController, AIController } from '../server/controllers';
import { Track, Playlist, UserStats } from '../types';

// This file acts as the "Axios" or "Fetch" layer of the frontend.
// In a real app, these functions would do: fetch('/api/tracks')

export const api = {
  tracks: {
    list: async (): Promise<Track[]> => {
      return await TrackController.getAllTracks();
    },
    search: async (query: string): Promise<Track[]> => {
      return await TrackController.searchTracks(query);
    },
    add: async (trackData: Partial<Track>): Promise<Track> => {
      return await TrackController.addTrack(trackData);
    }
  },
  playlists: {
    list: async (): Promise<Playlist[]> => {
      return await PlaylistController.getFeaturedPlaylists();
    }
  },
  user: {
    stats: async (): Promise<UserStats> => {
      return await UserController.getStats();
    }
  },
  ai: {
    chat: async (message: string): Promise<string> => {
      return await AIController.generateSupportResponse(message);
    }
  }
};