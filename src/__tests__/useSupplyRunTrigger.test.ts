import { renderHook } from '@testing-library/react-native';
import { useSupplyRunTrigger } from '../hooks/useSupplyRunTrigger';
import { GameState } from '../store/gameStore';
import { act } from 'react-test-renderer';

const mockStartSupplyRun = jest.fn();
const mockStoreState = {
  gameState: GameState.PLAYING,
  score: 0,
  lastSupplyRunScore: 0,
  startSupplyRun: mockStartSupplyRun,
};

jest.mock('../store/gameStore', () => {
  const actual = jest.requireActual('../store/gameStore');
  return {
    ...actual,
    useGameStore: () => mockStoreState,
  };
});

describe('useSupplyRunTrigger', () => {
  beforeEach(() => {
    mockStartSupplyRun.mockClear();
    mockStoreState.gameState = GameState.PLAYING;
    mockStoreState.score = 0;
    mockStoreState.lastSupplyRunScore = 0;
  });

  it('should not trigger when score has not crossed milestone', () => {
    mockStoreState.score = 1999;
    renderHook(() => useSupplyRunTrigger());
    expect(mockStartSupplyRun).not.toHaveBeenCalled();
  });

  it('should trigger supply run when score crosses 2000 milestone', () => {
    mockStoreState.score = 2000;
    renderHook(() => useSupplyRunTrigger());
    expect(mockStartSupplyRun).toHaveBeenCalledTimes(1);
  });

  it('should not trigger when game is not PLAYING', () => {
    mockStoreState.gameState = GameState.GAME_OVER;
    mockStoreState.score = 2000;
    renderHook(() => useSupplyRunTrigger());
    expect(mockStartSupplyRun).not.toHaveBeenCalled();
  });

  it('should trigger at next milestone after lastSupplyRunScore', () => {
    mockStoreState.lastSupplyRunScore = 2000;
    mockStoreState.score = 4000;
    renderHook(() => useSupplyRunTrigger());
    expect(mockStartSupplyRun).toHaveBeenCalledTimes(1);
  });

  it('should not trigger again if score is between milestones', () => {
    mockStoreState.lastSupplyRunScore = 2000;
    mockStoreState.score = 3500;
    renderHook(() => useSupplyRunTrigger());
    expect(mockStartSupplyRun).not.toHaveBeenCalled();
  });
});
