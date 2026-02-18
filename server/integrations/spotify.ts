import { SpotifyTrackRaw } from '../../types';

// NOTE: In a real deployment, these should be environment variables.
// Users must provide their own keys to make the "Live" mode work.
const CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || '';
const CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || '';

class SpotifyService {
  private accessToken: string | null = null;
  private tokenExpiration: number = 0;

  private async authenticate(): Promise<string | null> {
    if (!CLIENT_ID || !CLIENT_SECRET) {
      console.warn("Spotify Credentials missing. Using Mock DB.");
      return null;
    }

    // Check if token is still valid
    if (this.accessToken && Date.now() < this.tokenExpiration) {
      return this.accessToken;
    }

    try {
      const response = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': 'Basic ' + btoa(CLIENT_ID + ':' + CLIENT_SECRET)
        },
        body: 'grant_type=client_credentials'
      });

      if (!response.ok) throw new Error('Spotify Auth Failed');

      const data = await response.json();
      this.accessToken = data.access_token;
      this.tokenExpiration = Date.now() + (data.expires_in * 1000);
      return this.accessToken;
    } catch (error) {
      console.error("Spotify Auth Error:", error);
      return null;
    }
  }

  async getNewReleases(limit = 10): Promise<SpotifyTrackRaw[] | null> {
    const token = await this.authenticate();
    if (!token) return null;

    try {
      // Get New Releases Albums first
      const albumRes = await fetch(`https://api.spotify.com/v1/browse/new-releases?limit=${limit}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const albumData = await albumRes.json();
      
      // We need tracks, but new-releases returns albums. 
      // For this demo, we'll fetch 'Top Tracks' of the first artist of each album to get playable tracks
      const tracks: SpotifyTrackRaw[] = [];
      
      // Parallel fetch for speed
      const promises = albumData.albums.items.map(async (album: any) => {
          try {
             // Get album tracks
             const tracksRes = await fetch(`https://api.spotify.com/v1/albums/${album.id}/tracks?limit=1`, {
                 headers: { 'Authorization': `Bearer ${token}` }
             });
             const tracksData = await tracksRes.json();
             const track = tracksData.items[0];
             
             // Enrich with album image which is not in the simplified track object
             if(track) {
                 track.album = album; 
                 return track;
             }
          } catch(e) { return null; }
      });

      const results = await Promise.all(promises);
      return results.filter(Boolean) as SpotifyTrackRaw[];

    } catch (error) {
      console.error("Spotify API Error:", error);
      return null;
    }
  }

  async search(query: string): Promise<SpotifyTrackRaw[] | null> {
    const token = await this.authenticate();
    if (!token) return null;

    try {
      const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      return data.tracks.items;
    } catch (error) {
      return null;
    }
  }
}

export const spotify = new SpotifyService();