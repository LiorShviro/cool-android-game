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
}

interface GameStore {
  gameState: GameState;
  stressMeter: number;
  activeCharacters: Character[];
  setGameState: (state: GameState) => void;
  updateStressMeter: (amount: number) => void;
  addCharacter: (character: Character) => void;
  removeCharacter: (id: string) => void;
  reset: () => void;
}

const initialState = {
  gameState: GameState.START,
  stressMeter: 0,
  activeCharacters: [],
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
    })),

  reset: () => set(initialState),
}));
