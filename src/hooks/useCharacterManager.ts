import { useEffect, useRef } from 'react';
import { useGameStore, GameState, CharacterType, Character } from '../store/gameStore';
import { CHARACTER_CONFIG, SPAWN_INTERVAL } from '../constants/gameConstants';

export const useCharacterManager = () => {
  const { gameState, addCharacter, activeCharacters } = useGameStore();
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (gameState === GameState.PLAYING) {
      spawnTimerRef.current = setInterval(() => {
        // Only spawn if we have less than 4 characters for now
        if (activeCharacters.length < 4) {
          spawnRandomCharacter();
        }
      }, SPAWN_INTERVAL);
    } else {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    }

    return () => {
      if (spawnTimerRef.current) {
        clearInterval(spawnTimerRef.current);
      }
    };
  }, [gameState, activeCharacters.length, addCharacter]);

  const spawnRandomCharacter = () => {
    const types: CharacterType[] = ['ADULT', 'KID', 'DOG'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const config = CHARACTER_CONFIG[randomType];
    const randomNeed = config.needs[Math.floor(Math.random() * config.needs.length)];

    const newCharacter: Character = {
      id: Math.random().toString(36).substring(7),
      type: randomType,
      need: randomNeed,
      timer: config.timer,
      spawnedAt: Date.now(),
    };

    addCharacter(newCharacter);
  };
};
