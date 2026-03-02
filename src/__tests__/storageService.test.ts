import { storageService } from '../services/storageService';

// Mock MMKV
jest.mock('react-native-mmkv', () => {
  return {
    MMKV: jest.fn().mockImplementation(() => {
      let storage: Record<string, string> = {};
      return {
        set: jest.fn((key, value) => { storage[key] = value; }),
        getString: jest.fn((key) => storage[key]),
        delete: jest.fn((key) => { delete storage[key]; }),
      };
    }),
  };
});

describe('Storage Service', () => {
  beforeEach(() => {
    storageService.clearLeaderboard();
  });

  it('should save and retrieve scores', () => {
    storageService.saveScore({ name: 'Player 1', score: 100, date: '2026-03-01' });
    const scores = storageService.getLeaderboard();
    expect(scores).toHaveLength(1);
    expect(scores[0].score).toBe(100);
  });

  it('should return top 10 scores sorted by score descending', () => {
    storageService.saveScore({ name: 'P1', score: 50, date: '2026-03-01' });
    storageService.saveScore({ name: 'P2', score: 150, date: '2026-03-01' });
    storageService.saveScore({ name: 'P3', score: 100, date: '2026-03-01' });

    const scores = storageService.getLeaderboard();
    expect(scores[0].score).toBe(150);
    expect(scores[1].score).toBe(100);
    expect(scores[2].score).toBe(50);
  });

  it('should save and retrieve player name', () => {
    storageService.setPlayerName('Lior');
    expect(storageService.getPlayerName()).toBe('Lior');
  });
});
