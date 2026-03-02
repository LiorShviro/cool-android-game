import { useGameStore, GameState } from '../store/gameStore';

describe('Game Store', () => {
  beforeEach(() => {
    useGameStore.getState().reset();
  });

  it('should initialize with correct default values', () => {
    const state = useGameStore.getState();
    expect(state.gameState).toBe(GameState.START);
    expect(state.stressMeter).toBe(0);
    expect(state.activeCharacters).toEqual([]);
    expect(state.lives).toBe(3);
    expect(state.score).toBe(0);
    expect(state.comboStreak).toBe(0);
    expect(state.maxCombo).toBe(0);
    expect(state.isPaused).toBe(false);
    expect(state.pausedScreen).toBe('NONE');
    expect(state.playerName).toBe('Guest');
    expect(state.needsFulfilled).toBe(0);
    expect(state.needsFulfilledByNeed).toEqual({
      WATER: 0,
      BAMBA: 0,
      BISLI: 0,
      PET: 0,
      CHARGING: 0,
      RECEPTION: 0,
    });
    expect(state.missedNeeds).toBe(0);
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
  });

  it('should decrement lives and trigger game over at 0', () => {
    const { decrementLives } = useGameStore.getState();
    decrementLives();
    expect(useGameStore.getState().lives).toBe(2);
    
    decrementLives();
    decrementLives();
    expect(useGameStore.getState().lives).toBe(0);
    expect(useGameStore.getState().gameState).toBe(GameState.GAME_OVER);
    expect(useGameStore.getState().missedNeeds).toBe(3);
  });

  it('should toggle pause', () => {
    const { togglePause } = useGameStore.getState();
    togglePause();
    expect(useGameStore.getState().isPaused).toBe(true);
    togglePause();
    expect(useGameStore.getState().isPaused).toBe(false);
  });

  it('should add and remove characters', () => {
    const { addCharacter, removeCharacter } = useGameStore.getState();
    const character = { id: '1', type: 'ADULT', need: 'WATER', timer: 15000 };
    
    addCharacter(character as any);
    expect(useGameStore.getState().activeCharacters).toContainEqual({
      ...character,
      status: 'ACTIVE',
    });
    
    removeCharacter('1');
    expect(useGameStore.getState().activeCharacters).toEqual([]);
  });

  it('should increment score and streak on fulfillment', () => {
    const { addCharacter, fulfillNeed } = useGameStore.getState();
    addCharacter({ id: '1', type: 'ADULT', need: 'WATER', timer: 15000 } as any);
    
    fulfillNeed('WATER');
    expect(useGameStore.getState().score).toBeGreaterThan(0);
    expect(useGameStore.getState().comboStreak).toBe(1);
    expect(useGameStore.getState().needsFulfilled).toBe(1);
    expect(useGameStore.getState().activeCharacters[0].status).toBe('FULFILLED');
    expect(useGameStore.getState().needsFulfilledByNeed.WATER).toBe(1);
  });

  it('should reset combo streak on character removal (timer expiration)', () => {
    const { addCharacter, fulfillNeed, removeCharacter } = useGameStore.getState();
    addCharacter({ id: '1', type: 'ADULT', need: 'WATER', timer: 15000 } as any);
    addCharacter({ id: '2', type: 'ADULT', need: 'CHARGING', timer: 15000 } as any);
    
    fulfillNeed('WATER');
    expect(useGameStore.getState().comboStreak).toBe(1);
    
    removeCharacter('2', 'EXPIRED');
    expect(useGameStore.getState().comboStreak).toBe(0);
  });

  it('should start a new run and set runStartedAt', () => {
    const { startNewRun } = useGameStore.getState();
    startNewRun();
    const state = useGameStore.getState();
    expect(state.gameState).toBe(GameState.PLAYING);
    expect(state.runStartedAt).not.toBeNull();
  });
});
