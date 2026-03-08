import { useEffect, useRef, useCallback } from 'react';
import { useGameStore, GameState, CharacterType, Character } from '../store/gameStore';
import {
  CHARACTER_CONFIG,
  CHARACTER_VARIANTS,
  VARIANT_TO_PNG_KEY,
  SPAWN_INTERVAL,
  SPAWN_INTERVAL_DECAY_PER_1K,
  MIN_SPAWN_INTERVAL,
  TIMER_DECAY_PER_1K,
  MIN_TIMER,
  MAX_ACTIVE_CHARACTERS,
  MAX_ACTIVE_CHARACTERS_HIGH,
  HIGH_SCORE_THRESHOLD,
  pickSpeechLine,
} from '../constants/gameConstants';

export const useCharacterManager = () => {
  const { gameState, addCharacter, activeCharacters, score, isPaused } = useGameStore();
  const spawnTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Difficulty scaling: spawn faster as score increases
  const currentSpawnInterval = Math.max(
    MIN_SPAWN_INTERVAL,
    SPAWN_INTERVAL - Math.floor(score / 1000) * SPAWN_INTERVAL_DECAY_PER_1K
  );

  const maxActiveCharacters = score >= HIGH_SCORE_THRESHOLD ? MAX_ACTIVE_CHARACTERS_HIGH : MAX_ACTIVE_CHARACTERS;

  const spawnRandomCharacter = useCallback(() => {
    const types: CharacterType[] = ['ADULT', 'KID', 'DOG'];
    const randomType = types[Math.floor(Math.random() * types.length)];
    const config = CHARACTER_CONFIG[randomType];
    const randomNeed = config.needs[Math.floor(Math.random() * config.needs.length)];

    // Difficulty scaling: character timers get shorter
    const timerReduction = Math.floor(score / 1000) * TIMER_DECAY_PER_1K;
    const currentTimer = Math.max(MIN_TIMER, config.timer - timerReduction);

    // Pick a random visual variant for this character type
    const variants = CHARACTER_VARIANTS[randomType];
    const randomVariant = variants[Math.floor(Math.random() * variants.length)];
    const visualKey = VARIANT_TO_PNG_KEY[randomVariant];

    const newCharacter: Character = {
      id: Math.random().toString(36).substring(7),
      type: randomType,
      need: randomNeed,
      speechLine: pickSpeechLine(randomNeed),
      timer: currentTimer,
      status: 'ACTIVE',
      visualKey,
    };

    addCharacter(newCharacter);
  }, [addCharacter, score]);

  useEffect(() => {
    if (gameState === GameState.PLAYING && !isPaused) {
      spawnTimerRef.current = setInterval(() => {
        if (activeCharacters.length < maxActiveCharacters) {
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
  }, [gameState, activeCharacters.length, isPaused, currentSpawnInterval, spawnRandomCharacter, maxActiveCharacters]);
};
