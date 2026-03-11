export interface LeaderboardEntry {
  name: string;
  score: number;
  date: string;
}

const LEADERBOARD_KEY = 'mamad_leaderboard';
const PLAYER_NAME_KEY = 'mamad_player_name';

export const storageService = {
  getPlayerName: (): string => {
    try {
      const d = localStorage.getItem(PLAYER_NAME_KEY);
      return d?.trim() ? d : 'Guest';
    } catch {
      return 'Guest';
    }
  },

  setPlayerName: (name: string) => {
    try {
      localStorage.setItem(PLAYER_NAME_KEY, name);
    } catch {}
  },

  getRank: (score: number): string => {
    if (score >= 3001) return 'Chief of Home Front';
    if (score >= 1501) return 'Safe Room Pro';
    if (score >= 501) return 'Snack Commander';
    return 'MelechHaMamad Rookie';
  },

  saveScore: (entry: LeaderboardEntry) => {
    const board = [...storageService.getLeaderboard(), entry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
    try {
      localStorage.setItem(LEADERBOARD_KEY, JSON.stringify(board));
    } catch {}
  },

  getLeaderboard: (): LeaderboardEntry[] => {
    try {
      const d = localStorage.getItem(LEADERBOARD_KEY);
      return d ? JSON.parse(d) : [];
    } catch {
      return [];
    }
  },

  clearLeaderboard: () => {
    try {
      localStorage.removeItem(LEADERBOARD_KEY);
    } catch {}
  },
};
