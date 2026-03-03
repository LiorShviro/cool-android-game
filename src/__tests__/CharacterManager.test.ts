import { renderHook } from '@testing-library/react-native';
import { useCharacterManager } from '../hooks/useCharacterManager';
import { GameState } from '../store/gameStore';
import { act } from 'react-test-renderer';

// Mock the store dynamically
const mockStoreState = {
  gameState: GameState.PLAYING,
  addCharacter: jest.fn(),
  updateStressMeter: jest.fn(),
  activeCharacters: [],
  score: 0,
  isPaused: false,
};

jest.mock('../store/gameStore', () => {
  const actual = jest.requireActual('../store/gameStore');
  return {
    ...actual,
    useGameStore: () => mockStoreState,
  };
});

describe('useCharacterManager', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    mockStoreState.addCharacter.mockClear();
    mockStoreState.gameState = GameState.PLAYING;
    mockStoreState.activeCharacters = [];
    mockStoreState.score = 0;
    mockStoreState.isPaused = false;
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should spawn a character after an interval', () => {
    renderHook(() => useCharacterManager());

    act(() => {
      jest.advanceTimersByTime(4000);
    });

    expect(mockStoreState.addCharacter).toHaveBeenCalled();
  });

  it('should spawn characters faster as score increases', () => {
    mockStoreState.score = 2000; // Interval: 4000 - 1000 = 3000ms
    
    renderHook(() => useCharacterManager());
    
    act(() => {
      jest.advanceTimersByTime(3001);
    });
    expect(mockStoreState.addCharacter).toHaveBeenCalled();
  });

  it('should not spawn characters when paused', () => {
    mockStoreState.isPaused = true;
    
    renderHook(() => useCharacterManager());
    
    act(() => {
      jest.advanceTimersByTime(5000);
    });
    expect(mockStoreState.addCharacter).not.toHaveBeenCalled();
  });
});
