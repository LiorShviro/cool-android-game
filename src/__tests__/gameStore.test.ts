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
    expect(state.score).toBe(0);
    expect(state.comboStreak).toBe(0);
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
    const character = { id: '1', type: 'ADULT', need: 'WATER', timer: 10000, spawnedAt: Date.now() };

    addCharacter(character as any);
    expect(useGameStore.getState().activeCharacters).toContainEqual(character);

    removeCharacter('1');
    expect(useGameStore.getState().activeCharacters).toEqual([]);
  });

  it('should award base score (100) for late fulfillment (no green bonus)', () => {
    const { addCharacter, fulfillNeed } = useGameStore.getState();
    const spawnedAt = Date.now() - 10000; // 10s ago, timer=15s → elapsed > 50% → no green
    addCharacter({ id: '1', type: 'ADULT', need: 'WATER', timer: 15000, spawnedAt } as any);

    fulfillNeed('WATER');
    expect(useGameStore.getState().score).toBe(100); // 100 * 1 * 1
  });

  it('should award 2x score for green zone fulfillment (< 50% timer elapsed)', () => {
    const { addCharacter, fulfillNeed } = useGameStore.getState();
    const spawnedAt = Date.now() - 1000; // 1s ago, timer=15s → elapsed < 7500ms → green
    addCharacter({ id: '1', type: 'ADULT', need: 'WATER', timer: 15000, spawnedAt } as any);

    fulfillNeed('WATER');
    expect(useGameStore.getState().score).toBe(200); // 100 * 2 * 1
  });

  it('should apply combo multiplier x2 on second consecutive fulfillment', () => {
    const { addCharacter, fulfillNeed } = useGameStore.getState();
    const now = Date.now();
    addCharacter({ id: '1', type: 'ADULT', need: 'WATER', timer: 15000, spawnedAt: now - 10000 } as any);
    addCharacter({ id: '2', type: 'ADULT', need: 'RECEPTION', timer: 15000, spawnedAt: now - 10000 } as any);

    fulfillNeed('WATER');   // comboStreak=1: 100*1*1=100
    fulfillNeed('RECEPTION'); // comboStreak=2: 100*1*2=200

    expect(useGameStore.getState().score).toBe(300);
    expect(useGameStore.getState().comboStreak).toBe(2);
  });

  it('should cap combo multiplier at x3', () => {
    const { addCharacter, fulfillNeed } = useGameStore.getState();
    const now = Date.now();
    addCharacter({ id: '1', type: 'ADULT', need: 'WATER', timer: 15000, spawnedAt: now - 10000 } as any);
    addCharacter({ id: '2', type: 'ADULT', need: 'CHARGING', timer: 15000, spawnedAt: now - 10000 } as any);
    addCharacter({ id: '3', type: 'ADULT', need: 'RECEPTION', timer: 15000, spawnedAt: now - 10000 } as any);
    addCharacter({ id: '4', type: 'KID', need: 'BAMBA', timer: 10000, spawnedAt: now - 6000 } as any);

    fulfillNeed('WATER');      // streak=1: 100*1*1=100
    fulfillNeed('CHARGING');   // streak=2: 100*1*2=200
    fulfillNeed('RECEPTION');  // streak=3: 100*1*3=300
    fulfillNeed('BAMBA');      // streak=4 capped at 3: 100*1*3=300

    expect(useGameStore.getState().score).toBe(900);
    expect(useGameStore.getState().comboStreak).toBe(4);
  });

  it('should reset combo streak when a character expires (removeCharacter)', () => {
    const { addCharacter, fulfillNeed, removeCharacter } = useGameStore.getState();
    const now = Date.now();
    addCharacter({ id: '1', type: 'ADULT', need: 'WATER', timer: 15000, spawnedAt: now - 10000 } as any);
    addCharacter({ id: '2', type: 'ADULT', need: 'RECEPTION', timer: 15000, spawnedAt: now - 10000 } as any);

    fulfillNeed('WATER');           // comboStreak=1
    removeCharacter('2');           // expiry → comboStreak=0
    expect(useGameStore.getState().comboStreak).toBe(0);

    addCharacter({ id: '3', type: 'KID', need: 'BAMBA', timer: 10000, spawnedAt: now - 6000 } as any);
    fulfillNeed('BAMBA');           // comboStreak=1 again: 100*1*1=100

    expect(useGameStore.getState().score).toBe(200); // 100 + 100
    expect(useGameStore.getState().comboStreak).toBe(1);
  });
});

