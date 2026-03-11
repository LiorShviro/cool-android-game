import React from 'react';
import { useGameStore } from '../store/gameStore';
import { THEME } from '../assets/theme';

export const GameHUD: React.FC = () => {
  const { score, lives, comboStreak, togglePause } = useGameStore();
  const multiplier = Math.min(3, Math.floor(comboStreak / 2) + 1);

  return (
    <div style={{ width: '100%', padding: '8px 12px', zIndex: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        {/* Lives */}
        <div style={{ display: 'flex', gap: 4 }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <span key={i} style={{ fontSize: 22, opacity: i < lives ? 1 : 0.25 }}>🚀</span>
          ))}
        </div>

        {/* Score */}
        <div style={{
          background: THEME.colors.orange,
          borderRadius: 14,
          padding: '6px 16px',
          border: `2.5px solid ${THEME.colors.outline}`,
          minWidth: 90,
          textAlign: 'center',
          position: 'relative',
        }}>
          <span style={{
            fontSize: 22,
            fontWeight: 'bold',
            color: 'white',
            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
          }}>
            {score}
          </span>
          {multiplier > 1 && (
            <span style={{
              position: 'absolute',
              top: 2,
              right: 6,
              fontSize: 11,
              fontWeight: 'bold',
              color: THEME.colors.yellow,
            }}>
              x{multiplier}
            </span>
          )}
        </div>

        {/* Pause */}
        <button
          onClick={togglePause}
          style={{
            background: THEME.colors.wall,
            border: `2px solid ${THEME.colors.outline}`,
            borderRadius: '50%',
            width: 36,
            height: 36,
            cursor: 'pointer',
            fontSize: 14,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          ⏸
        </button>
      </div>
      <div style={{
        textAlign: 'center',
        fontSize: 14,
        fontWeight: 'bold',
        color: THEME.colors.outline,
      }}>
        MelechHaMamad
      </div>
    </div>
  );
};
