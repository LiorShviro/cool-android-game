import { MMKV } from 'react-native-mmkv';

const storage = new MMKV();

export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

const LEADERBOARD_KEY = 'mamad_leaderboard';

export const storageService = {
  saveScore: (entry: LeaderboardEntry) => {
    const currentLeaderboard = storageService.getLeaderboard();
    const newLeaderboard = [...currentLeaderboard, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    
    storage.set(LEADERBOARD_KEY, JSON.stringify(newLeaderboard));
  },

  getLeaderboard: (): LeaderboardEntry[] => {
    const data = storage.getString(LEADERBOARD_KEY);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  clearLeaderboard: () => {
    storage.delete(LEADERBOARD_KEY);
  },
};
