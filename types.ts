export interface Track {
  id: string;
  title: string;
  artist: string;
  album: string;
  coverUrl: string;
  duration: number; // in seconds
  isAiGenerated?: boolean;
  lyrics?: string[];
  primaryColor?: string; // For dynamic theme
  moodValence?: number; // 0-1
  previewUrl?: string | null; // URL for actual audio playback
}

export interface Playlist {
  id: string;
  name: string;
  coverUrl: string;
  trackCount: number;
  owner: string;
  tracks: Track[];
}

export interface UserStats {
  topArtists: { name: string; hours: number }[];
  moodHistory: { date: string; valence: number }[];
  genreDistribution: { name: string; value: number }[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'bot' | 'agent';
  text: string;
  timestamp: Date;
}

export enum View {
  HOME = 'HOME',
  SEARCH = 'SEARCH',
  LIBRARY = 'LIBRARY',
  STATS = 'STATS',
  SOCIAL = 'SOCIAL',
  SUPPORT = 'SUPPORT',
  ARTIST = 'ARTIST'
}

// --- SPOTIFY RAW TYPES (For Internal Backend Use) ---

export interface SpotifyImage {
  url: string;
  height: number;
  width: number;
}

export interface SpotifyArtist {
  id: string;
  name: string;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: SpotifyImage[];
  release_date: string;
}

export interface SpotifyTrackRaw {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  preview_url: string | null;
  popularity: number;
}
