import { Track, Playlist, UserStats, ChatMessage } from '../types';

// --- SIMULATED DATABASE STORAGE ---

const DB_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    coverUrl: 'https://picsum.photos/id/10/300/300',
    duration: 243,
    primaryColor: '#c2410c',
    moodValence: 0.8,
    isAiGenerated: false,
    previewUrl: null
  },
  {
    id: '2',
    title: 'Digital Silence',
    artist: 'AI Composite v4',
    album: 'Generated Dreams',
    coverUrl: 'https://picsum.photos/id/20/300/300',
    duration: 180,
    primaryColor: '#9f1239',
    moodValence: 0.4,
    isAiGenerated: true,
    previewUrl: null
  },
  {
    id: '3',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    coverUrl: 'https://picsum.photos/id/30/300/300',
    duration: 354,
    primaryColor: '#78350f',
    moodValence: 0.6,
    isAiGenerated: false,
    previewUrl: null
  },
  {
    id: '4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl: 'https://picsum.photos/id/40/300/300',
    duration: 200,
    primaryColor: '#991b1b',
    moodValence: 0.9,
    isAiGenerated: false,
    previewUrl: null
  },
   {
    id: '5',
    title: 'Nightcall',
    artist: 'Kavinsky',
    album: 'OutRun',
    coverUrl: 'https://picsum.photos/id/50/300/300',
    duration: 258,
    primaryColor: '#ea580c',
    moodValence: 0.5,
    isAiGenerated: false,
    previewUrl: null
  }
];

const DB_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Discover Weekly',
    coverUrl: 'https://picsum.photos/id/60/300/300',
    trackCount: 30,
    owner: 'Spotify',
    tracks: [DB_TRACKS[0], DB_TRACKS[1], DB_TRACKS[4]]
  },
  {
    id: 'p2',
    name: 'Synthwave Essentials',
    coverUrl: 'https://picsum.photos/id/70/300/300',
    trackCount: 50,
    owner: 'RetroLover',
    tracks: [DB_TRACKS[0], DB_TRACKS[3], DB_TRACKS[4]]
  }
];

const DB_STATS: UserStats = {
  topArtists: [
    { name: 'M83', hours: 120 },
    { name: 'The Weeknd', hours: 95 },
    { name: 'Queen', hours: 80 },
    { name: 'Daft Punk', hours: 60 },
    { name: 'Kavinsky', hours: 55 }
  ],
  moodHistory: [
    { date: 'Mon', valence: 0.4 },
    { date: 'Tue', valence: 0.6 },
    { date: 'Wed', valence: 0.3 },
    { date: 'Thu', valence: 0.8 },
    { date: 'Fri', valence: 0.9 },
    { date: 'Sat', valence: 0.85 },
    { date: 'Sun', valence: 0.7 }
  ],
  genreDistribution: [
    { name: 'Pop', value: 35 },
    { name: 'Synthwave', value: 35 },
    { name: 'Rock', value: 20 },
    { name: 'Jazz', value: 10 }
  ]
};

// --- ORM METHODS (Simulated) ---

export const db = {
  tracks: {
    findAll: () => [...DB_TRACKS],
    findById: (id: string) => DB_TRACKS.find(t => t.id === id),
    add: (track: Track) => {
      // Add to beginning of array so it shows up first
      DB_TRACKS.unshift(track);
      return track;
    }
  },
  playlists: {
    findAll: () => [...DB_PLAYLISTS],
  },
  stats: {
    get: () => ({ ...DB_STATS }),
  }
};