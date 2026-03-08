import { useEffect, useRef } from 'react';
import { useGameStore, GameState } from '../store/gameStore';
import { SUPPLY_RUN_SCORE_INTERVAL } from '../constants/gameConstants';

export const useSupplyRunTrigger = () => {
  const { gameState, score, lastSupplyRunScore, startSupplyRun } = useGameStore();
  const triggeredRef = useRef(false);

  useEffect(() => {
    if (gameState !== GameState.PLAYING) {
      triggeredRef.current = false;
      return;
    }

    const nextMilestone = lastSupplyRunScore + SUPPLY_RUN_SCORE_INTERVAL;
    if (score >= nextMilestone && !triggeredRef.current) {
      triggeredRef.current = true;
      startSupplyRun();
    }
  }, [score, gameState, lastSupplyRunScore, startSupplyRun]);
};
