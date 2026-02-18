import { Track, SpotifyTrackRaw } from '../../types';

// Helper to generate a consistent color from a string (since Spotify API doesn't provide dominant colors)
const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Force warm colors for the Aura theme (Orange/Red/Amber spectrum)
  // We manipulate the Hue to stay in the 0-60 (Red to Yellow) or 300-360 (Pink/Red) range
  const h = Math.abs(hash % 60); 
  const s = 80 + (Math.abs(hash) % 20); // High saturation
  const l = 40 + (Math.abs(hash) % 20); // Medium-Dark lightness
  
  return `hsl(${h}, ${s}%, ${l}%)`;
};

export const mapSpotifyTrackToTrack = (spotifyTrack: SpotifyTrackRaw): Track => {
  return {
    id: spotifyTrack.id,
    title: spotifyTrack.name,
    artist: spotifyTrack.artists.map(a => a.name).join(', '),
    album: spotifyTrack.album.name,
    coverUrl: spotifyTrack.album.images[0]?.url || 'https://via.placeholder.com/300',
    duration: Math.floor(spotifyTrack.duration_ms / 1000),
    isAiGenerated: false, // Spotify API doesn't flag this, assume false
    primaryColor: stringToColor(spotifyTrack.album.id), // Generate consistent dynamic color
    moodValence: 0.5 + (Math.random() * 0.5), // Simulate mood (requires Audio Analysis endpoint for real data)
    previewUrl: spotifyTrack.preview_url
  };
};