import { Track, Playlist, UserStats } from '../types';

export const MOCK_TRACKS: Track[] = [
  {
    id: '1',
    title: 'Midnight City',
    artist: 'M83',
    album: 'Hurry Up, We\'re Dreaming',
    coverUrl: 'https://picsum.photos/id/10/300/300',
    duration: 243,
    primaryColor: '#c2410c', // Was Blue, now Dark Orange
    moodValence: 0.8,
    isAiGenerated: false
  },
  {
    id: '2',
    title: 'Digital Silence',
    artist: 'AI Composite v4',
    album: 'Generated Dreams',
    coverUrl: 'https://picsum.photos/id/20/300/300',
    duration: 180,
    primaryColor: '#9f1239', // Was Purple, now Rose/Red
    moodValence: 0.4,
    isAiGenerated: true
  },
  {
    id: '3',
    title: 'Bohemian Rhapsody',
    artist: 'Queen',
    album: 'A Night at the Opera',
    coverUrl: 'https://picsum.photos/id/30/300/300',
    duration: 354,
    primaryColor: '#78350f', // Warm Brown
    moodValence: 0.6,
    isAiGenerated: false
  },
  {
    id: '4',
    title: 'Blinding Lights',
    artist: 'The Weeknd',
    album: 'After Hours',
    coverUrl: 'https://picsum.photos/id/40/300/300',
    duration: 200,
    primaryColor: '#991b1b', // Red
    moodValence: 0.9,
    isAiGenerated: false
  }
];

export const MOCK_PLAYLISTS: Playlist[] = [
  {
    id: 'p1',
    name: 'Discover Weekly',
    coverUrl: 'https://picsum.photos/id/50/300/300',
    trackCount: 30,
    owner: 'Spotify',
    tracks: MOCK_TRACKS
  },
  {
    id: 'p2',
    name: 'Synthwave Essentials',
    coverUrl: 'https://picsum.photos/id/60/300/300',
    trackCount: 50,
    owner: 'RetroLover',
    tracks: [MOCK_TRACKS[0], MOCK_TRACKS[3]]
  }
];

export const MOCK_STATS: UserStats = {
  topArtists: [
    { name: 'M83', hours: 120 },
    { name: 'The Weeknd', hours: 95 },
    { name: 'Queen', hours: 80 },
    { name: 'Daft Punk', hours: 60 },
    { name: 'Pink Floyd', hours: 45 }
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
    { name: 'Pop', value: 40 },
    { name: 'Rock', value: 30 },
    { name: 'Electronic', value: 20 },
    { name: 'Jazz', value: 10 }
  ]
};