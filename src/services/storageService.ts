import { MMKV } from 'react-native-mmkv';

let storage: MMKV | null = null;

const getStorage = (): MMKV => {
  if (!storage) {
    storage = new MMKV();
  }
  return storage;
};

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

const LEADERBOARD_KEY = 'mamad_leaderboard';

export const storageService = {
  getRank: (score: number): string => {
    if (score >= 3001) return 'Chief of Home Front';
    if (score >= 1501) return 'Safe Room Pro';
    if (score >= 501) return 'Snack Commander';
    return 'Mamad Rookie';
  },

  saveScore: (entry: LeaderboardEntry) => {
    const currentLeaderboard = storageService.getLeaderboard();
    const newLeaderboard = [...currentLeaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    getStorage().set(LEADERBOARD_KEY, JSON.stringify(newLeaderboard));
  },

  getLeaderboard: (): LeaderboardEntry[] => {
    const data = getStorage().getString(LEADERBOARD_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  clearLeaderboard: () => {
    getStorage().delete(LEADERBOARD_KEY);
  },
};
