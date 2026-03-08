import { useEffect, useRef } from 'react';
import { useGameStore, GameState } from '../store/gameStore';
import { BATHROOM_BREAK_SCORE_INTERVAL } from '../constants/gameConstants';

export const useBathroomBreakTrigger = () => {
  const { gameState, score, lastBathroomBreakScore, startBathroomBreak } = useGameStore();
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (gameState !== GameState.PLAYING) {
      triggeredRef.current = false;
      return;
    }

    const nextMilestone = lastBathroomBreakScore + BATHROOM_BREAK_SCORE_INTERVAL;
    if (score >= nextMilestone && !triggeredRef.current) {
      triggeredRef.current = true;
      startBathroomBreak();
    }
  }, [score, gameState, lastBathroomBreakScore, startBathroomBreak]);
};
