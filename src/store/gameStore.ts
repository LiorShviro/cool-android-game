import { create } from 'zustand';

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  TUTORIAL = 'TUTORIAL',
  LEADERBOARD = 'LEADERBOARD',
}

export type CharacterType = 'ADULT' | 'KID' | 'DOG';

export interface Character {
  id: string;
  type: CharacterType;
  need: string;
  timer: number;
}

interface GameStore {
  gameState: GameState;
  stressMeter: number;
  activeCharacters: Character[];
  lives: number;
  score: number;
  comboStreak: number;
  isPaused: boolean;
  
  setGameState: (state: GameState) => void;
  updateStressMeter: (amount: number) => void;
  addCharacter: (character: Character) => void;
  removeCharacter: (id: string) => void;
  fulfillNeed: (need: string) => void;
  decrementLives: () => void;
  incrementScore: (amount: number) => void;
  togglePause: () => void;
  reset: () => void;
}

const initialState = {
  gameState: GameState.START,
  stressMeter: 0,
  activeCharacters: [],
  lives: 3,
  score: 0,
  comboStreak: 0,
  isPaused: false,
};

export const useGameStore = create<GameStore>((set) => ({
  ...initialState,

  setGameState: (state: GameState) => set({ gameState: state }),

  updateStressMeter: (amount: number) =>
    set((state) => ({
      stressMeter: Math.max(0, Math.min(100, state.stressMeter + amount)),
    })),

  addCharacter: (character: Character) =>
    set((state) => ({
      activeCharacters: [...state.activeCharacters, character],
    })),

  removeCharacter: (id: string) =>
    set((state) => ({
      activeCharacters: state.activeCharacters.filter((c) => c.id !== id),
      comboStreak: 0, // Reset combo if a character is removed (expired)
    })),

  fulfillNeed: (need: string) =>
    set((state) => {
      const charIndex = state.activeCharacters.findIndex((c) => c.need === need);
      if (charIndex === -1) return state;

      const newCharacters = [...state.activeCharacters];
      newCharacters.splice(charIndex, 1);
      
      const newStreak = state.comboStreak + 1;
      const multiplier = Math.min(3, Math.floor(newStreak / 2) + 1); // Simple multiplier logic
      const addedScore = 100 * multiplier;

      return {
        activeCharacters: newCharacters,
        score: state.score + addedScore,
        comboStreak: newStreak,
        stressMeter: Math.max(0, state.stressMeter - 5),
      };
    }),

  decrementLives: () =>
    set((state) => {
      const newLives = Math.max(0, state.lives - 1);
      return {
        lives: newLives,
        gameState: newLives === 0 ? GameState.GAME_OVER : state.gameState,
      };
    }),

  incrementScore: (amount: number) =>
    set((state) => ({ score: state.score + amount })),

  togglePause: () => set((state) => ({ isPaused: !state.isPaused })),

  reset: () => set(initialState),
}));
