let storage: import('react-native-mmkv').MMKV | null = null;
let mmkvFailed = false;

const getStorage = () => {
  if (mmkvFailed) return null;
  if (storage) return storage;
  try {
    const { MMKV } = require('react-native-mmkv');
    storage = new MMKV();
    return storage;
  } catch {
    mmkvFailed = true;
    return null;
  }
};

// In-memory fallback when MMKV is unavailable
const memoryStore: Record<string, string> = {};

const store = {
  set: (key: string, value: string) => {
    const s = getStorage();
    if (s) {
      s.set(key, value);
    } else {
      memoryStore[key] = value;
    }
  },
  getString: (key: string): string | undefined => {
    const s = getStorage();
    if (s) return s.getString(key);
    return memoryStore[key];
  },
  delete: (key: string) => {
    const s = getStorage();
    if (s) {
      s.delete(key);
    } else {
      delete memoryStore[key];
    }
  },
};

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

const LEADERBOARD_KEY = 'mamad_leaderboard';
const PLAYER_NAME_KEY = 'mamad_player_name';

export const storageService = {
  getPlayerName: (): string => {
    const data = store.getString(PLAYER_NAME_KEY);
    return data && data.trim() !== '' ? data : 'Guest';
  },

  setPlayerName: (name: string) => {
    store.set(PLAYER_NAME_KEY, name);
  },

  getRank: (score: number): string => {
    if (score >= 3001) return 'Chief of Home Front';
    if (score >= 1501) return 'Safe Room Pro';
    if (score >= 501) return 'Snack Commander';
    return 'Mamad Rookie';
  },

  saveScore: (entry: LeaderboardEntry) => {
    const newLeaderboard = [...storageService.getLeaderboard(), entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    store.set(LEADERBOARD_KEY, JSON.stringify(newLeaderboard));
  },

  getLeaderboard: (): LeaderboardEntry[] => {
    const data = store.getString(LEADERBOARD_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  clearLeaderboard: () => {
    store.delete(LEADERBOARD_KEY);
  },
};
