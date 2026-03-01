import { create } from 'zustand';

export enum GameState {
  START = 'START',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
}

export type CharacterType = 'ADULT' | 'KID' | 'DOG';

export interface Character {
  id: string;
  type: CharacterType;
  need: string;
  timer: number;
  spawnedAt: number;
}

interface GameStore {
  gameState: GameState;
  stressMeter: number;
  activeCharacters: Character[];
  score: number;
  comboStreak: number;
  setGameState: (state: GameState) => void;
  updateStressMeter: (amount: number) => void;
  addCharacter: (character: Character) => void;
  removeCharacter: (id: string) => void;
  fulfillNeed: (need: string) => void;
  reset: () => void;
}

const initialState = {
  gameState: GameState.START,
  stressMeter: 0,
  activeCharacters: [],
  score: 0,
  comboStreak: 0,
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
      comboStreak: 0,
    })),

  fulfillNeed: (need: string) =>
    set((state) => {
      const charIndex = state.activeCharacters.findIndex((c) => c.need === need);
      if (charIndex === -1) return state;

      const char = state.activeCharacters[charIndex];
      const newCharacters = [...state.activeCharacters];
      newCharacters.splice(charIndex, 1);

      const elapsed = Date.now() - char.spawnedAt;
      const isGreenZone = elapsed < char.timer * 0.5;
      const newComboStreak = state.comboStreak + 1;
      const comboMultiplier = Math.min(newComboStreak, 3);
      const pointsEarned = 100 * (isGreenZone ? 2 : 1) * comboMultiplier;

      return {
        activeCharacters: newCharacters,
        stressMeter: Math.max(0, state.stressMeter - 5),
        score: state.score + pointsEarned,
        comboStreak: newComboStreak,
      };
    }),

  reset: () => set(initialState),
}));
