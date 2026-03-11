import React, { useState, useEffect } from 'react';
import { useGameStore, GameState } from './store/gameStore';
import { BACKGROUND_PNGS } from './assets/backgrounds';
import { THEME } from './assets/theme';
import { useUIScale } from './hooks/useUIScale';
import { useCharacterManager } from './hooks/useCharacterManager';
import { useSupplyRunTrigger } from './hooks/useSupplyRunTrigger';
import { storageService } from './services/storageService';

import { GameHUD } from './components/GameHUD';
import { Character } from './components/Character';
import { ComboPopup } from './components/ComboPopup';
import { PauseMenu } from './components/PauseMenu';
import { TutorialScreen } from './components/TutorialScreen';
import { LeaderboardScreen } from './components/LeaderboardScreen';
import { SupplyRun } from './components/SupplyRun';

import { WaterPitcher } from './components/stations/WaterPitcher';
import { SnackSorter } from './components/stations/SnackSorter';
import { DogDistraction } from './components/stations/DogDistraction';
import { ChargingStation } from './components/stations/ChargingStation';
import { ReceptionHunter } from './components/stations/ReceptionHunter';

// Inner component that uses game hooks (hooks need to be inside a component)
const GameContent: React.FC = () => {
  useCharacterManager();
  useSupplyRunTrigger();

  const {
    gameState,
    activeCharacters,
    score,
    lives,
    comboStreak,
    maxCombo,
    needsFulfilled,
    missedNeeds,
    needsFulfilledByNeed,
    runStartedAt,
    runEndedAt,
    playerName,
    isPaused,
    pausedScreen,
    fulfillNeed,
    startNewRun,
    setGameState,
    setPlayerName,
    setPausedScreen,
    togglePause,
    endSupplyRun,
  } = useGameStore();

  const { scale } = useUIScale();
  const [inputName, setInputName] = useState(() => storageService.getPlayerName());
  const [showFlash, setShowFlash] = useState(false);
  const [prevLives, setPrevLives] = useState(lives);

  const multiplier = Math.min(3, Math.floor(comboStreak / 2) + 1);
  const characterZoneMin = Math.round(80 * scale);

  // Life-lost flash
  useEffect(() => {
    if (lives < prevLives && gameState === GameState.PLAYING) {
      setShowFlash(true);
      const t = setTimeout(() => setShowFlash(false), 400);
      return () => clearTimeout(t);
    }
    setPrevLives(lives);
  }, [lives, prevLives, gameState]);

  // Save score on game over
  useEffect(() => {
    if (gameState === GameState.GAME_OVER) {
      storageService.saveScore({
        name: playerName,
        score,
        date: new Date().toLocaleDateString(),
      });
    }
  }, [gameState]);

  const handleStartGame = () => {
    const name = inputName.trim() || 'Guest';
    setPlayerName(name);
    storageService.setPlayerName(name);
    startNewRun();
  };

  const handleSupplyRunComplete = (caught: boolean) => {
    endSupplyRun(caught ? 500 : 0);
  };

  const bgOpacity = gameState === GameState.PLAYING ? 1 : 0.55;

  const renderScreen = () => {
    switch (gameState) {
      case GameState.START:
        return <StartScreen inputName={inputName} setInputName={setInputName} onStart={handleStartGame} onTutorial={() => setGameState(GameState.TUTORIAL)} onLeaderboard={() => setGameState(GameState.LEADERBOARD)} />;

      case GameState.PLAYING:
        return (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
            <GameHUD />

            {/* Character zone */}
            <div style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'row',
              flexWrap: 'nowrap',
              alignItems: 'flex-end',
              justifyContent: 'center',
              minHeight: characterZoneMin,
              padding: '0 4px',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {activeCharacters.map((char) => (
                <Character key={char.id} character={char} />
              ))}
              <ComboPopup multiplier={multiplier} />
            </div>

            {/* Station shelf */}
            <div style={{
              overflowX: 'auto',
              overflowY: 'hidden',
              overscrollBehavior: 'contain',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              padding: '4px 8px',
              backgroundColor: THEME.colors.wood,
              borderTop: `3px solid ${THEME.colors.outline}`,
              flexShrink: 0,
            }}>
              <WaterPitcher onSuccess={() => fulfillNeed('WATER')} />
              <SnackSorter onSuccess={(snack) => fulfillNeed(snack)} />
              <DogDistraction onSuccess={() => fulfillNeed('PET')} />
              <ChargingStation onSuccess={() => fulfillNeed('CHARGING')} />
              <ReceptionHunter onSuccess={() => fulfillNeed('RECEPTION')} />
            </div>

            {/* Life-lost flash */}
            {showFlash && (
              <div style={{
                position: 'absolute',
                inset: 0,
                backgroundColor: 'rgba(232,64,64,0.35)',
                pointerEvents: 'none',
                zIndex: 40,
              }} />
            )}

            {/* Pause overlay */}
            {isPaused && pausedScreen === 'NONE' && <PauseMenu />}
            {isPaused && pausedScreen === 'TUTORIAL' && (
              <TutorialScreen onBack={() => setPausedScreen('NONE')} />
            )}
            {isPaused && pausedScreen === 'LEADERBOARD' && (
              <LeaderboardScreen
                entries={storageService.getLeaderboard()}
                onBack={() => setPausedScreen('NONE')}
              />
            )}
          </div>
        );

      case GameState.SUPPLY_RUN:
        return <SupplyRun onComplete={handleSupplyRunComplete} />;

      case GameState.GAME_OVER:
        return (
          <GameOverScreen
            score={score}
            playerName={playerName}
            needsFulfilled={needsFulfilled}
            missedNeeds={missedNeeds}
            maxCombo={maxCombo}
            needsFulfilledByNeed={needsFulfilledByNeed}
            runStartedAt={runStartedAt}
            runEndedAt={runEndedAt}
            onRestart={handleStartGame}
            onLeaderboard={() => setGameState(GameState.LEADERBOARD)}
            onMenu={() => setGameState(GameState.START)}
          />
        );

      case GameState.TUTORIAL:
        return <TutorialScreen onBack={() => setGameState(GameState.START)} />;

      case GameState.LEADERBOARD:
        return (
          <LeaderboardScreen
            entries={storageService.getLeaderboard()}
            onBack={() => setGameState(GameState.START)}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div style={{
      position: 'relative',
      width: '100vw',
      height: '100dvh',
      overflow: 'hidden',
    }}>
      {/* Background image */}
      <img
        src={BACKGROUND_PNGS.mamadRoom}
        style={{
          position: 'absolute',
          inset: 0,
          width: '100%',
          height: '100%',
          objectFit: 'contain',
          opacity: bgOpacity,
          transition: 'opacity 0.3s',
          zIndex: 0,
        }}
        alt="mamad room"
      />

      {/* Screen content — centered narrow container to align with background */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 1, display: 'flex', justifyContent: 'center' }}>
        <div style={{ position: 'relative', width: '100%', maxWidth: 480, height: '100%' }}>
          {renderScreen()}
        </div>
      </div>
    </div>
  );
};

// --- Sub-screens ---

interface StartScreenProps {
  inputName: string;
  setInputName: (v: string) => void;
  onStart: () => void;
  onTutorial: () => void;
  onLeaderboard: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ inputName, setInputName, onStart, onTutorial, onLeaderboard }) => {
  const btnStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 0',
    borderRadius: THEME.borderRadius.pill,
    border: `2.5px solid ${THEME.colors.outline}`,
    fontSize: 18,
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: 12,
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px 32px',
    }}>
      {/* Logo */}
      <div style={{
        background: THEME.colors.orange,
        borderRadius: THEME.borderRadius.large,
        padding: '14px 28px',
        marginBottom: 8,
        border: `3px solid ${THEME.colors.outline}`,
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: 28, fontWeight: 'bold', color: 'white', textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
          🚀 MelechHaMamad
        </div>
        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.9)', marginTop: 2 }}>
          Safe Room Chaos
        </div>
      </div>

      <div style={{ marginBottom: 24 }}>
        <span style={{ fontSize: 40 }}>🏠</span>
      </div>

      {/* Name input */}
      <div style={{ width: '100%', maxWidth: 300, marginBottom: 20 }}>
        <label style={{ display: 'block', fontSize: 13, fontWeight: 'bold', color: THEME.colors.outline, marginBottom: 6 }}>
          Your Name
        </label>
        <input
          type="text"
          value={inputName}
          onChange={(e) => setInputName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && onStart()}
          placeholder="Enter your name..."
          maxLength={20}
          style={{
            width: '100%',
            padding: '10px 14px',
            fontSize: 16,
            borderRadius: THEME.borderRadius.medium,
            border: `2px solid ${THEME.colors.outline}`,
            backgroundColor: THEME.colors.offWhite,
            outline: 'none',
          }}
        />
      </div>

      {/* Buttons */}
      <div style={{ width: '100%', maxWidth: 300 }}>
        <button
          onClick={onStart}
          style={{ ...btnStyle, background: THEME.colors.green, color: 'white' }}
        >
          ▶ START GAME
        </button>
        <button
          onClick={onTutorial}
          style={{ ...btnStyle, background: THEME.colors.blue, color: 'white' }}
        >
          ❓ HOW TO PLAY
        </button>
        <button
          onClick={onLeaderboard}
          style={{ ...btnStyle, background: THEME.colors.yellow, color: THEME.colors.outline, marginBottom: 0 }}
        >
          🏆 LEADERBOARD
        </button>
      </div>
    </div>
  );
};

interface GameOverScreenProps {
  score: number;
  playerName: string;
  needsFulfilled: number;
  missedNeeds: number;
  maxCombo: number;
  needsFulfilledByNeed: Record<string, number>;
  runStartedAt: number | null;
  runEndedAt: number | null;
  onRestart: () => void;
  onLeaderboard: () => void;
  onMenu: () => void;
}

const NEED_EMOJI: Record<string, string> = {
  WATER: '💧',
  BAMBA: '🍿',
  BISLI: '🌀',
  PET: '🎾',
  CHARGING: '🔋',
  RECEPTION: '📡',
};

const GameOverScreen: React.FC<GameOverScreenProps> = ({
  score,
  playerName,
  needsFulfilled,
  missedNeeds,
  maxCombo,
  needsFulfilledByNeed,
  runStartedAt,
  runEndedAt,
  onRestart,
  onLeaderboard,
  onMenu,
}) => {
  const rank = storageService.getRank(score);
  const durationSec = runStartedAt && runEndedAt ? Math.round((runEndedAt - runStartedAt) / 1000) : 0;
  const minutes = Math.floor(durationSec / 60);
  const seconds = durationSec % 60;

  const btnStyle: React.CSSProperties = {
    width: '100%',
    padding: '14px 0',
    borderRadius: THEME.borderRadius.pill,
    border: `2.5px solid ${THEME.colors.outline}`,
    fontSize: 16,
    fontWeight: 'bold',
    cursor: 'pointer',
    marginBottom: 10,
  };

  return (
    <div style={{
      position: 'absolute',
      inset: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor: 'rgba(0,0,0,0.5)',
      overflowY: 'auto',
    }}>
      <div style={{
        background: THEME.colors.wall,
        borderRadius: THEME.borderRadius.large,
        border: `3px solid ${THEME.colors.outline}`,
        padding: '24px 20px',
        width: '100%',
        maxWidth: 340,
        boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div style={{ fontSize: 36, marginBottom: 4 }}>💥</div>
          <div style={{ fontSize: 22, fontWeight: 'bold', color: THEME.colors.outline }}>GAME OVER</div>
          <div style={{ fontSize: 14, color: '#666', marginTop: 2 }}>{playerName}</div>
        </div>

        {/* Score badge */}
        <div style={{
          background: THEME.colors.orange,
          borderRadius: THEME.borderRadius.large,
          padding: '12px 20px',
          textAlign: 'center',
          border: `2.5px solid ${THEME.colors.outline}`,
          marginBottom: 12,
        }}>
          <div style={{ fontSize: 40, fontWeight: 'bold', color: 'white', textShadow: '1px 1px 3px rgba(0,0,0,0.3)' }}>
            {score}
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.9)', fontWeight: '600' }}>{rank}</div>
        </div>

        {/* Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 8,
          marginBottom: 12,
        }}>
          <StatCard label="Duration" value={`${minutes}:${String(seconds).padStart(2, '0')}`} />
          <StatCard label="Fulfilled" value={String(needsFulfilled)} />
          <StatCard label="Missed" value={String(missedNeeds)} />
          <StatCard label="Max Combo" value={`x${maxCombo}`} />
        </div>

        {/* Per-need breakdown */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 6,
          marginBottom: 16,
          justifyContent: 'center',
        }}>
          {Object.entries(needsFulfilledByNeed).map(([need, count]) => (
            <div key={need} style={{
              background: THEME.colors.offWhite,
              border: `1.5px solid ${THEME.colors.outline}`,
              borderRadius: THEME.borderRadius.small,
              padding: '4px 8px',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
            }}>
              <span style={{ fontSize: 16 }}>{NEED_EMOJI[need] ?? '❓'}</span>
              <span style={{ fontSize: 14, fontWeight: 'bold', color: THEME.colors.outline }}>{count}</span>
            </div>
          ))}
        </div>

        {/* Buttons */}
        <button onClick={onRestart} style={{ ...btnStyle, background: THEME.colors.green, color: 'white' }}>
          🔄 PLAY AGAIN
        </button>
        <button onClick={onLeaderboard} style={{ ...btnStyle, background: THEME.colors.yellow, color: THEME.colors.outline }}>
          🏆 LEADERBOARD
        </button>
        <button onClick={onMenu} style={{ ...btnStyle, background: '#888', color: 'white', marginBottom: 0 }}>
          🏠 MAIN MENU
        </button>
      </div>
    </div>
  );
};

const StatCard: React.FC<{ label: string; value: string }> = ({ label, value }) => (
  <div style={{
    background: THEME.colors.offWhite,
    border: `1.5px solid ${THEME.colors.outline}`,
    borderRadius: THEME.borderRadius.small,
    padding: '8px 12px',
    textAlign: 'center',
  }}>
    <div style={{ fontSize: 18, fontWeight: 'bold', color: THEME.colors.outline }}>{value}</div>
    <div style={{ fontSize: 10, color: '#888', fontWeight: '600', marginTop: 2 }}>{label}</div>
  </div>
);

// Main App — just wraps GameContent
const App: React.FC = () => {
  return <GameContent />;
};

export default App;
