import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Character as CharacterType, useGameStore } from '../store/gameStore';
import { getCharacterPng, CharacterMood, CharacterPngKey } from '../assets/characters';
import { STATION_PNGS } from '../assets/stations';
import { hapticService } from '../services/hapticService';
import { pickSpeechLine } from '../constants/gameConstants';
import { THEME } from '../assets/theme';
import { useUIScale } from '../hooks/useUIScale';

const NEED_ICON: Record<string, string> = {
  WATER: STATION_PNGS.waterCupBase,
  BAMBA: STATION_PNGS.bamba,
  BISLI: STATION_PNGS.bisly,
  PET: STATION_PNGS.dogBall,
  CHARGING: STATION_PNGS.chargePhone,
  RECEPTION: STATION_PNGS.receptionHandPhone,
};

const LANDSCAPE_CHARS = new Set<CharacterPngKey>(['mother', 'male_teen', 'boy']);

interface Props {
  character: CharacterType;
}

export const Character: React.FC<Props> = ({ character }) => {
  const { decrementLives, removeCharacter, isPaused, activeCharacters } = useGameStore();
  const { scale } = useUIScale();
  const rowScale = activeCharacters.length >= 4 ? 0.85 : activeCharacters.length >= 3 ? 0.92 : 1;
  const sizeScale = scale * 1.8 * rowScale;
  const typeScale = character.type === 'DOG' ? 0.5625 : character.type === 'KID' ? 0.95 : 0.98;
  const avatarSize = Math.round(72 * sizeScale * typeScale);

  const [progress, setProgress] = useState(1);
  const [currentMood, setCurrentMood] = useState<CharacterMood>('neutral');
  const startTimeRef = useRef(Date.now());
  const pausedAtRef = useRef<number | null>(null);
  const elapsedRef = useRef(0);
  const isFulfilledRef = useRef(character.status === 'FULFILLED');
  const timerRef = useRef<number | null>(null);
  const isPausedRef = useRef(isPaused);

  const speechText = character.speechLine ?? pickSpeechLine(character.need);
  const visualKey = (character.visualKey ?? 'saba') as CharacterPngKey;
  const isLandscape = LANDSCAPE_CHARS.has(visualKey);

  const handleExpire = useCallback(() => {
    if (isFulfilledRef.current) return;
    hapticService.error();
    decrementLives();
    removeCharacter(character.id, 'EXPIRED');
  }, [character.id, decrementLives, removeCharacter]);

  // Keep isPausedRef in sync
  useEffect(() => { isPausedRef.current = isPaused; }, [isPaused]);

  // Timer tick
  useEffect(() => {
    if (character.status === 'FULFILLED') {
      isFulfilledRef.current = true;
      if (timerRef.current) clearInterval(timerRef.current);
      const t = window.setTimeout(() => removeCharacter(character.id, 'FULFILLED'), 450);
      return () => clearTimeout(t);
    }

    startTimeRef.current = Date.now();
    elapsedRef.current = 0;

    timerRef.current = window.setInterval(() => {
      if (isPausedRef.current) return;
      const elapsed = elapsedRef.current + (Date.now() - startTimeRef.current);
      const p = Math.max(0, 1 - elapsed / character.timer);
      setProgress(p);
      setCurrentMood(p <= 0.2 ? 'urgent' : p <= 0.5 ? 'impatient' : 'neutral');
      if (p <= 0) {
        clearInterval(timerRef.current!);
        handleExpire();
      }
    }, 50);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [character.status, character.timer, character.id, handleExpire, removeCharacter]);

  // Pause/resume
  useEffect(() => {
    if (isPaused) {
      pausedAtRef.current = Date.now();
    } else {
      if (pausedAtRef.current !== null) {
        elapsedRef.current += pausedAtRef.current - startTimeRef.current;
        startTimeRef.current = Date.now();
        pausedAtRef.current = null;
      }
    }
  }, [isPaused]);

  const timerColor = progress <= 0.2 ? '#FF4444' : progress <= 0.5 ? '#FFBB33' : '#00C851';
  const speechIcon = NEED_ICON[character.need];

  const containerWidth = Math.round(110 * scale * rowScale);
  const containerMargin = Math.round(6 * scale * rowScale);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: containerWidth,
      margin: containerMargin,
      position: 'relative',
    }}>
      {/* Speech bubble */}
      <div style={{
        background: THEME.colors.offWhite,
        borderRadius: 12,
        border: `2.5px solid ${timerColor}`,
        padding: '5px 8px',
        marginBottom: 4,
        maxWidth: Math.round(120 * scale * 0.85 * rowScale),
        display: 'flex',
        alignItems: 'center',
        gap: 4,
        boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
        position: 'relative',
      }}>
        {speechIcon && (
          <img
            src={speechIcon}
            style={{ width: 18, height: 18, objectFit: 'contain' }}
            alt=""
          />
        )}
        <span style={{
          fontSize: Math.max(8, Math.round(10 * scale * 0.8 * rowScale)),
          fontWeight: 'bold',
          color: '#333',
          whiteSpace: 'nowrap',
        }}>
          {speechText}
        </span>
        {character.status === 'FULFILLED' && (
          <div style={{
            position: 'absolute',
            right: -6,
            top: -8,
            background: THEME.colors.green,
            borderRadius: 10,
            padding: '2px 6px',
            border: `2px solid ${THEME.colors.outline}`,
          }}>
            <span style={{ color: 'white', fontSize: 10, fontWeight: 'bold' }}>✓</span>
          </div>
        )}
      </div>

      {/* Bubble tail */}
      <div style={{
        width: 0,
        height: 0,
        borderLeft: '6px solid transparent',
        borderRight: '6px solid transparent',
        borderTop: `7px solid ${THEME.colors.offWhite}`,
        marginTop: -1,
      }} />

      {/* Avatar bob animation */}
      <motion.div
        animate={{ y: [0, -4, 0] }}
        transition={{
          repeat: Infinity,
          duration: currentMood === 'urgent' ? 0.4 : currentMood === 'impatient' ? 0.76 : 1.2,
          ease: 'easeInOut',
        }}
      >
        <img
          src={getCharacterPng(visualKey, currentMood)}
          style={{
            width: Math.round(avatarSize * (isLandscape ? 0.78 : 1)),
            height: Math.round(avatarSize * 1.3 * (isLandscape ? 0.78 : 1)),
            objectFit: isLandscape ? 'cover' : 'contain',
          }}
          alt={character.type}
        />
      </motion.div>

      {/* Timer bar */}
      <div style={{
        width: Math.round(78 * scale * 0.8),
        height: Math.max(5, Math.round(7 * scale * 0.8)),
        background: 'rgba(0,0,0,0.15)',
        borderRadius: 3,
        overflow: 'hidden',
        marginTop: 2,
      }}>
        <div style={{
          width: `${progress * 100}%`,
          height: '100%',
          background: timerColor,
          borderRadius: 3,
          transition: 'background 0.3s',
        }} />
      </div>
    </div>
  );
};
