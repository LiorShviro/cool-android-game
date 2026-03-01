import { renderHook } from '@testing-library/react-native';
import { useCharacterManager } from '../src/hooks/useCharacterManager';
import { useGameStore, GameState } from '../src/store/gameStore';
import { act } from 'react-test-renderer';

// Mock the store
jest.mock('../src/store/gameStore', () => {
  const actual = jest.requireActual('../src/store/gameStore');
  return {
    ...actual,
    useGameStore: jest.fn(),
  };
});

describe('useCharacterManager', () => {
  let mockAddCharacter: jest.Mock;
  let mockUpdateStressMeter: jest.Mock;

  beforeEach(() => {
    jest.useFakeTimers();
    mockAddCharacter = jest.fn();
    mockUpdateStressMeter = jest.fn();
    (useGameStore as any).mockReturnValue({
      gameState: GameState.PLAYING,
      addCharacter: mockAddCharacter,
      updateStressMeter: mockUpdateStressMeter,
      activeCharacters: [],
    });
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  it('should spawn a character after an interval', () => {
    renderHook(() => useCharacterManager());

    act(() => {
      jest.advanceTimersByTime(3000); // Wait for spawn interval
    });

    expect(mockAddCharacter).toHaveBeenCalled();
    const addedCharacter = mockAddCharacter.mock.calls[0][0];
    expect(['ADULT', 'KID', 'DOG']).toContain(addedCharacter.type);
  });

  it('should not spawn characters when game state is START', () => {
    (useGameStore as any).mockReturnValue({
      gameState: GameState.START,
      addCharacter: mockAddCharacter,
      updateStressMeter: mockUpdateStressMeter,
      activeCharacters: [],
    });

    renderHook(() => useCharacterManager());

    act(() => {
      jest.advanceTimersByTime(5000);
    });

    expect(mockAddCharacter).not.toHaveBeenCalled();
  });

  it('should stop spawning characters when game state changes to START', () => {
    const { rerender } = renderHook(() => useCharacterManager());

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockAddCharacter).toHaveBeenCalled();
    const callCountAfterFirstSpawn = mockAddCharacter.mock.calls.length;

    (useGameStore as any).mockReturnValue({
      gameState: GameState.START,
      addCharacter: mockAddCharacter,
      updateStressMeter: mockUpdateStressMeter,
      activeCharacters: [],
    });

    rerender({});

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockAddCharacter.mock.calls.length).toBe(callCountAfterFirstSpawn);
  });

  it('should not spawn more than 4 characters', () => {
    (useGameStore as any).mockReturnValue({
      gameState: GameState.PLAYING,
      addCharacter: mockAddCharacter,
      updateStressMeter: mockUpdateStressMeter,
      activeCharacters: new Array(4).fill({}),
    });

    renderHook(() => useCharacterManager());

    act(() => {
      jest.advanceTimersByTime(3000);
    });

    expect(mockAddCharacter).not.toHaveBeenCalled();
  });
});
