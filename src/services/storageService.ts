export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

let leaderboardCache: LeaderboardEntry[] = [];

export const storageService = {
  saveScore: (entry: LeaderboardEntry) => {
    leaderboardCache = [...leaderboardCache, entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  },

  getLeaderboard: (): LeaderboardEntry[] => {
    return leaderboardCache;
  },

  clearLeaderboard: () => {
    leaderboardCache = [];
  },
};
