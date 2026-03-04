import { useEffect, useRef, useCallback } from 'react';
import { useGameStore, GameState, CharacterType, Character } from '../store/gameStore';
import { CHARACTER_CONFIG, SPAWN_INTERVAL, pickSpeechLine } from '../constants/gameConstants';

export const useCharacterManager = () => {
  const { gameState, addCharacter, activeCharacters, score, isPaused } = useGameStore();
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Difficulty scaling: spawn faster as score increases
  const currentSpawnInterval = Math.max(
    1000,
    SPAWN_INTERVAL - Math.floor(score / 1000) * 500
  );

  const spawnRandomCharacter = useCallback(() => {
    const types: CharacterType[] = ['ADULT', 'KID', 'DOG'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const config = CHARACTER_CONFIG[randomType];
    const randomNeed = config.needs[Math.floor(Math.random() * config.needs.length)];

    // Difficulty scaling: character timers get shorter
    const timerReduction = Math.floor(score / 1000) * 1000;
    const currentTimer = Math.max(3000, config.timer - timerReduction);

    const newCharacter: Character = {
      id: Math.random().toString(36).substring(7),
      type: randomType,
      need: randomNeed,
      speechLine: pickSpeechLine(randomNeed),
      timer: currentTimer,
      status: 'ACTIVE',
    };

    addCharacter(newCharacter);
  }, [addCharacter, score]);

  useEffect(() => {
    if (gameState === GameState.PLAYING && !isPaused) {
      spawnTimerRef.current = setInterval(() => {
        if (activeCharacters.length < 4) {
          spawnRandomCharacter();
        }
      }, currentSpawnInterval);
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
  }, [gameState, activeCharacters.length, isPaused, currentSpawnInterval, spawnRandomCharacter]);
};
