import { create } from 'zustand';

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  TUTORIAL = 'TUTORIAL',
  LEADERBOARD = 'LEADERBOARD',
  SUPPLY_RUN = 'SUPPLY_RUN',
}

export type PausedScreen = 'NONE' | 'TUTORIAL' | 'LEADERBOARD';

export type CharacterType = 'ADULT' | 'KID' | 'DOG';
export type NeedType = 'WATER' | 'BAMBA' | 'BISLI' | 'PET' | 'CHARGING' | 'RECEPTION';

export interface Character {
  id: string;
  type: CharacterType;
  need: string;
  speechLine?: string;
  timer: number;
  status: 'ACTIVE' | 'FULFILLED';
  fulfilledAt?: number;
  visualKey?: string;
}

interface GameStore {
  gameState: GameState;
  stressMeter: number;
  activeCharacters: Character[];
  lives: number;
  score: number;
  comboStreak: number;
  maxCombo: number;
  isPaused: boolean;
  pausedScreen: PausedScreen;
  playerName: string;
  runStartedAt: number | null;
  runEndedAt: number | null;
  needsFulfilled: number;
  needsFulfilledByNeed: Record<NeedType, number>;
  missedNeeds: number;
  lastSupplyRunScore: number;

  setGameState: (state: GameState) => void;
  startNewRun: () => void;
  startSupplyRun: () => void;
  endSupplyRun: (bonus: number) => void;
  setPlayerName: (name: string) => void;
  setPausedScreen: (screen: PausedScreen) => void;
  updateStressMeter: (amount: number) => void;
  addCharacter: (character: Character) => void;
  removeCharacter: (id: string, reason?: 'EXPIRED' | 'FULFILLED') => void;
  fulfillNeed: (need: string) => void;
  decrementLives: () => void;
  incrementScore: (amount: number) => void;
  togglePause: () => void;
  reset: () => void;
}

const initialState = {
  stressMeter: 0,
  activeCharacters: [],
  lives: 3,
  score: 0,
  comboStreak: 0,
  maxCombo: 0,
  isPaused: false,
  pausedScreen: 'NONE' as PausedScreen,
  playerName: 'Guest',
  runStartedAt: null as number | null,
  runEndedAt: null as number | null,
  needsFulfilled: 0,
  needsFulfilledByNeed: {
    WATER: 0,
    BAMBA: 0,
    BISLI: 0,
    PET: 0,
    CHARGING: 0,
    RECEPTION: 0,
  },
  missedNeeds: 0,
  lastSupplyRunScore: 0,
};

export const useGameStore = create<GameStore>((set) => ({
  gameState: GameState.START,
  ...initialState,

  setGameState: (state: GameState) => set({ gameState: state }),

  startNewRun: () =>
    set((state) => ({
      ...initialState,
      gameState: GameState.PLAYING,
      playerName: state.playerName,
      runStartedAt: Date.now(),
    })),

  startSupplyRun: () =>
    set({
      gameState: GameState.SUPPLY_RUN,
      isPaused: true,
    }),

  endSupplyRun: (bonus: number) =>
    set((state) => ({
      gameState: GameState.PLAYING,
      isPaused: false,
      score: state.score + bonus,
      lastSupplyRunScore: state.score + bonus,
    })),

  setPlayerName: (name: string) => set({ playerName: name }),

  setPausedScreen: (screen: PausedScreen) => set({ pausedScreen: screen }),

  updateStressMeter: (amount: number) =>
    set((state) => ({
      stressMeter: Math.max(0, Math.min(100, state.stressMeter + amount)),
    })),

  addCharacter: (character: Character) =>
    set((state) => ({
      activeCharacters: [
        ...state.activeCharacters,
        {
          ...character,
          status: character.status ?? 'ACTIVE',
        },
      ],
    })),

  removeCharacter: (id: string, reason: 'EXPIRED' | 'FULFILLED' = 'EXPIRED') =>
    set((state) => ({
      activeCharacters: state.activeCharacters.filter((c) => c.id !== id),
      comboStreak: reason === 'EXPIRED' ? 0 : state.comboStreak,
    })),

  fulfillNeed: (need: string) =>
    set((state) => {
      const charIndex = state.activeCharacters.findIndex((c) => c.need === need && c.status === 'ACTIVE');
      if (charIndex === -1) return state;

      const newCharacters = [...state.activeCharacters];
      const target = newCharacters[charIndex];
      newCharacters[charIndex] = {
        ...target,
        status: 'FULFILLED',
        fulfilledAt: Date.now(),
      };

      const newStreak = state.comboStreak + 1;
      const multiplier = Math.min(3, Math.floor(newStreak / 2) + 1);
      const addedScore = 100 * multiplier;

      const updatedNeedCounts: Record<NeedType, number> = { ...state.needsFulfilledByNeed };
      if (need in updatedNeedCounts) {
        updatedNeedCounts[need as NeedType] = updatedNeedCounts[need as NeedType] + 1;
      }

      return {
        activeCharacters: newCharacters,
        score: state.score + addedScore,
        comboStreak: newStreak,
        maxCombo: Math.max(state.maxCombo, newStreak),
        stressMeter: Math.max(0, state.stressMeter - 5),
        needsFulfilled: state.needsFulfilled + 1,
        needsFulfilledByNeed: { ...updatedNeedCounts },
      };
    }),

  decrementLives: () =>
    set((state) => {
      const newLives = Math.max(0, state.lives - 1);
      return {
        lives: newLives,
        missedNeeds: state.missedNeeds + 1,
        runEndedAt: newLives === 0 ? Date.now() : state.runEndedAt,
        gameState: newLives === 0 ? GameState.GAME_OVER : state.gameState,
      };
    }),

  incrementScore: (amount: number) =>
    set((state) => ({ score: state.score + amount })),

  togglePause: () =>
    set((state) => ({
      isPaused: !state.isPaused,
      pausedScreen: 'NONE',
    })),

  reset: () =>
    set((state) => ({
      ...initialState,
      gameState: GameState.START,
      playerName: state.playerName,
    })),
}));
