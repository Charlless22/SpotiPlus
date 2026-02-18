import { db } from './db';
import { spotify } from './integrations/spotify';
import { mapSpotifyTrackToTrack } from './utils/mappers';
import { GoogleGenAI } from "@google/genai";
import { Track } from '../types';

// Initialize AI
const apiKey = process.env.API_KEY || ''; 
const ai = new GoogleGenAI({ apiKey });

// --- CONTROLLERS ---

export const TrackController = {
  getAllTracks: async (): Promise<Track[]> => {
    // 1. Try fetching from real Spotify API
    const spotifyTracks = await spotify.getNewReleases(8);
    
    // Merge DB tracks (custom ones) with Spotify tracks if available
    const dbTracks = db.tracks.findAll();
    
    if (spotifyTracks && spotifyTracks.length > 0) {
        // 2. Map Spotify Data to App Data and merge
        // We put DB tracks first so newly added songs appear at the top
        return [...dbTracks, ...spotifyTracks.map(mapSpotifyTrackToTrack)];
    }

    // 3. Fallback to Mock Database if Spotify fails or no keys
    console.log("Using Mock DB (Spotify unavailable)");
    await new Promise(resolve => setTimeout(resolve, 300)); // Simulate latency
    return dbTracks;
  },

  searchTracks: async (query: string): Promise<Track[]> => {
    if (!query.trim()) return TrackController.getAllTracks();

    // 1. Try Spotify Search
    const spotifyResults = await spotify.search(query);
    let results: Track[] = [];

    if (spotifyResults && spotifyResults.length > 0) {
      results = spotifyResults.map(mapSpotifyTrackToTrack);
    }

    // 2. Also search/filter Local Mock DB
    const lowerQuery = query.toLowerCase();
    const localResults = db.tracks.findAll().filter(t => 
      t.title.toLowerCase().includes(lowerQuery) || 
      t.artist.toLowerCase().includes(lowerQuery)
    );

    return [...localResults, ...results];
  },

  addTrack: async (trackData: Partial<Track>): Promise<Track> => {
    // Basic validation
    if (!trackData.title || !trackData.artist) {
      throw new Error("Title and Artist are required");
    }

    const newTrack: Track = {
      id: Date.now().toString(), // Simple ID generation
      title: trackData.title,
      artist: trackData.artist,
      album: trackData.album || 'Custom Upload',
      coverUrl: trackData.coverUrl || `https://picsum.photos/seed/${Date.now()}/300/300`,
      duration: 180, // Default duration
      primaryColor: '#ea580c', // Default Orange
      moodValence: 0.5,
      isAiGenerated: false,
      previewUrl: trackData.previewUrl || null,
      ...trackData
    };

    return db.tracks.add(newTrack);
  }
};

export const PlaylistController = {
  getFeaturedPlaylists: async () => {
    // In a full implementation, we would fetch `spotify.getFeaturedPlaylists()`
    // For now, we return DB playlists but populated with potentially real tracks if needed
    await new Promise(resolve => setTimeout(resolve, 400));
    return db.playlists.findAll();
  }
};

export const UserController = {
  getStats: async () => {
    await new Promise(resolve => setTimeout(resolve, 600));
    return db.stats.get();
  }
};

export const AIController = {
  generateSupportResponse: async (query: string) => {
    if (!apiKey) return "System Offline: API Key missing in backend configuration.";
    
    try {
      const model = 'gemini-3-flash-preview';
      const systemInstruction = `You are "Oracle", the AI core of the Aura Music app.
      Your tone is futuristic, concise, and helpful.
      Context: User is asking about music, app features (Stats, Social Battles), or technical issues.
      Keep response under 30 words.`;

      const response = await ai.models.generateContent({
        model,
        contents: query,
        config: { systemInstruction }
      });

      return response.text || "Connection interrupted.";
    } catch (error) {
      console.error("Backend AI Error:", error);
      return "Oracle system currently unresponsive.";
    }
  }
};