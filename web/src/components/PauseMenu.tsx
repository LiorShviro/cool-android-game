import React from 'react';
import { useGameStore, GameState } from '../store/gameStore';
import { THEME } from '../assets/theme';

export const PauseMenu: React.FC = () => {
  const { togglePause, setPausedScreen, setGameState } = useGameStore();

  const btnStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 0',
    borderRadius: THEME.borderRadius.pill,
    border: `2.5px solid ${THEME.colors.outline}`,
    fontSize: 17,
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: 12,
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      backgroundColor: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 50,
    }}>
      <div style={{
        background: THEME.colors.wall,
        borderRadius: THEME.borderRadius.large,
        border: `3px solid ${THEME.colors.outline}`,
        padding: '28px 32px',
        width: '80%',
        maxWidth: 320,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        <span style={{ fontSize: 36, marginBottom: 8 }}>⏸</span>
        <h2 style={{
          fontSize: 24,
          fontWeight: 'bold',
          color: THEME.colors.outline,
          marginBottom: 24,
          textAlign: 'center',
        }}>
          PAUSED
        </h2>

        <button
          onClick={togglePause}
          style={{ ...btnStyle, background: THEME.colors.green, color: 'white' }}
        >
          ▶ RESUME
        </button>

        <button
          onClick={() => {
            setPausedScreen('TUTORIAL');
          }}
          style={{ ...btnStyle, background: THEME.colors.blue, color: 'white' }}
        >
          ❓ HOW TO PLAY
        </button>

        <button
          onClick={() => {
            setPausedScreen('LEADERBOARD');
          }}
          style={{ ...btnStyle, background: THEME.colors.yellow, color: THEME.colors.outline }}
        >
          🏆 LEADERBOARD
        </button>

        <button
          onClick={() => {
            setGameState(GameState.START);
          }}
          style={{ ...btnStyle, background: THEME.colors.red, color: 'white', marginBottom: 0 }}
        >
          🏠 QUIT TO MENU
        </button>
      </div>
    </div>
  );
};
