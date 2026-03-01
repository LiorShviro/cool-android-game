import { useGameStore, GameState } from '../src/store/gameStore';

describe('Game Store', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('should initialize with correct default values', () => {
    const state = useGameStore.getState();
    expect(state.gameState).toBe(GameState.START);
    expect(state.stressMeter).toBe(0);
    expect(state.activeCharacters).toEqual([]);
  });

  it('should update game state correctly', () => {
    const { setGameState } = useGameStore.getState();
    setGameState(GameState.PLAYING);
    expect(useGameStore.getState().gameState).toBe(GameState.PLAYING);
  });

  it('should update stress meter correctly', () => {
    const { updateStressMeter } = useGameStore.getState();
    updateStressMeter(10);
    expect(useGameStore.getState().stressMeter).toBe(10);
    
    updateStressMeter(-5);
    expect(useGameStore.getState().stressMeter).toBe(5);
  });

  it('should clamp stress meter between 0 and 100', () => {
    const { updateStressMeter } = useGameStore.getState();
    updateStressMeter(110);
    expect(useGameStore.getState().stressMeter).toBe(100);
    
    updateStressMeter(-150);
    expect(useGameStore.getState().stressMeter).toBe(0);
  });

  it('should add and remove characters', () => {
    const { addCharacter, removeCharacter } = useGameStore.getState();
    const character = { id: '1', type: 'ADULT', need: 'WATER', timer: 10 };
    
    addCharacter(character as any);
    expect(useGameStore.getState().activeCharacters).toContainEqual(character);
    
    removeCharacter('1');
    expect(useGameStore.getState().activeCharacters).toEqual([]);
  });
});
