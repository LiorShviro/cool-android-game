import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useGameStore, GameState } from './src/store/gameStore';
import { CharacterManager } from './src/components/CharacterManager';
import { Character } from './src/components/Character';
import { GameHUD } from './src/components/GameHUD';
import { WaterPitcher } from './src/components/stations/WaterPitcher';
import { SnackSorter } from './src/components/stations/SnackSorter';
import { DogDistraction } from './src/components/stations/DogDistraction';
import { ChargingStation } from './src/components/stations/ChargingStation';
import { ReceptionHunter } from './src/components/stations/ReceptionHunter';
import { PauseMenu } from './src/components/PauseMenu';
import { ComboPopup } from './src/components/ComboPopup';
import { storageService, LeaderboardEntry } from './src/services/storageService';
import { TutorialScreen } from './src/components/TutorialScreen';
import { LeaderboardScreen } from './src/components/LeaderboardScreen';
import { MamadRoom } from './src/assets/svg/backgrounds/MamadRoom';
import { THEME } from './src/assets/theme';

const App = () => {
  const {
    gameState,
    setGameState,
    activeCharacters,
    score,
    comboStreak,
    fulfillNeed,
    reset,
  } = useGameStore();
  const { width, height } = useWindowDimensions();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (gameState === GameState.START || gameState === GameState.GAME_OVER || gameState === GameState.LEADERBOARD) {
      setLeaderboard(storageService.getLeaderboard());
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === GameState.GAME_OVER) {
      const newEntry = {
        name: 'Guest',
        score: score,
        date: new Date().toISOString(),
      };
      storageService.saveScore(newEntry);
      setLeaderboard(storageService.getLeaderboard());
    }
  }, [gameState, score]);

  const startGame = () => {
    reset();
    setGameState(GameState.PLAYING);
  };

  const renderScreen = () => {
    if (gameState === GameState.START) {
      return (
        <SafeAreaView style={styles.fullScreen}>
          <View style={styles.centered}>
            {/* Logo block */}
            <View style={styles.logoBadge}>
              <Text style={styles.logoTitle}>מממד</Text>
              <Text style={styles.logoSubtitle}>מנג׳ר</Text>
            </View>
            <Text style={styles.title}>Mamad Manager</Text>
            <Text style={styles.subtitle}>Safe Room Chaos 🚀</Text>
            <Text style={styles.versionText}>Build: 1.0 (Local)</Text>

            <TouchableOpacity style={styles.mainButton} onPress={startGame}>
              <Text style={styles.buttonText}>▶  START GAME</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => setGameState(GameState.TUTORIAL)}>
              <Text style={styles.secondaryButtonText}>HOW TO PLAY</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => setGameState(GameState.LEADERBOARD)}>
              <Text style={styles.secondaryButtonText}>LEADERBOARD</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    if (gameState === GameState.GAME_OVER) {
      const leaderboardPosition = leaderboard.findIndex((e) => e.score === score) + 1;
      const positionText = leaderboardPosition > 0 ? `#${leaderboardPosition} on leaderboard` : '';

      return (
        <SafeAreaView style={styles.fullScreen}>
          <View style={styles.centered}>
            <View style={[styles.logoBadge, { backgroundColor: THEME.colors.red }]}>
              <Text style={styles.gameOverIcon}>😱</Text>
            </View>
            <Text style={[styles.title, { color: THEME.colors.red }]}>GAME OVER</Text>
            <Text style={styles.gameOverFlavor}>The Mamad is in chaos!</Text>
            <View style={styles.scoreBadge}>
              <Text style={styles.finalScore}>{score}</Text>
              <Text style={styles.finalScoreLabel}>POINTS</Text>
            </View>
            <Text style={styles.rankText}>{storageService.getRank(score)}</Text>
            {positionText !== '' && (
              <Text style={styles.positionText}>{positionText}</Text>
            )}

            <TouchableOpacity style={styles.mainButton} onPress={startGame}>
              <Text style={styles.buttonText}>TRY AGAIN</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => setGameState(GameState.LEADERBOARD)}>
              <Text style={styles.secondaryButtonText}>LEADERBOARD</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.secondaryButton} onPress={() => setGameState(GameState.START)}>
              <Text style={styles.secondaryButtonText}>MAIN MENU</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    if (gameState === GameState.TUTORIAL) {
      return <TutorialScreen onBack={() => setGameState(GameState.START)} />;
    }

    if (gameState === GameState.LEADERBOARD) {
      return (
        <LeaderboardScreen
          entries={leaderboard}
          onBack={() => setGameState(GameState.START)}
        />
      );
    }

    return (
      <SafeAreaView style={styles.fullScreen}>
        <CharacterManager />
        <PauseMenu />
        <ComboPopup multiplier={Math.min(3, Math.floor(comboStreak / 2) + 1)} />

        <GameHUD />

        <View style={styles.gameArea}>
          <View style={styles.characterZone}>
            {activeCharacters.map((char) => (
              <Character key={char.id} character={char} />
            ))}
          </View>
        </View>

        {/* Station shelf area */}
        <View style={styles.stationArea}>
          <View style={styles.shelfEdge} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.stationScroll}>
            <WaterPitcher onSuccess={() => fulfillNeed('WATER')} />
            <SnackSorter onSuccess={(snack) => fulfillNeed(snack)} />
            <DogDistraction onSuccess={() => fulfillNeed('PET')} />
            <ChargingStation onSuccess={() => fulfillNeed('CHARGING')} />
            <ReceptionHunter onSuccess={() => fulfillNeed('RECEPTION')} />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* Full-screen Mamad Room background */}
        <View style={StyleSheet.absoluteFill} pointerEvents="none">
          <MamadRoom width={width} height={height} opacity={gameState === GameState.PLAYING ? 1 : 0.55} />
        </View>
        {renderScreen()}
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  fullScreen: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  logoBadge: {
    backgroundColor: THEME.colors.blastDoor,
    borderRadius: THEME.borderRadius.large,
    paddingHorizontal: 24,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: THEME.colors.outline,
    elevation: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    alignItems: 'center',
  },
  logoTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.4)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
  logoSubtitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: THEME.colors.yellow,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 6,
    color: THEME.colors.outline,
  },
  subtitle: {
    fontSize: 17,
    color: '#555',
    marginBottom: 8,
  },
  versionText: {
    fontSize: 11,
    color: '#888',
    marginBottom: 24,
  },
  mainButton: {
    backgroundColor: THEME.colors.green,
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: THEME.borderRadius.pill,
    elevation: 5,
    marginBottom: 14,
    borderWidth: 2.5,
    borderColor: THEME.colors.outline,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  secondaryButton: {
    backgroundColor: THEME.colors.offWhite,
    borderWidth: 2.5,
    borderColor: THEME.colors.outline,
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: THEME.borderRadius.pill,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  secondaryButtonText: {
    color: THEME.colors.outline,
    fontSize: 15,
    fontWeight: 'bold',
  },
  gameOverIcon: {
    fontSize: 42,
  },
  gameOverFlavor: {
    fontSize: 15,
    color: THEME.colors.red,
    marginBottom: 16,
  },
  scoreBadge: {
    backgroundColor: THEME.colors.orange,
    borderRadius: THEME.borderRadius.large,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderWidth: 2.5,
    borderColor: THEME.colors.outline,
    alignItems: 'center',
    marginBottom: 8,
    elevation: 4,
  },
  finalScore: {
    fontSize: 40,
    fontWeight: 'bold',
    color: 'white',
  },
  finalScoreLabel: {
    fontSize: 12,
    color: THEME.colors.yellow,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: THEME.colors.greenDark,
    marginBottom: 4,
  },
  positionText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 20,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
  },
  characterZone: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  stationArea: {
    height: 195,
    borderTopWidth: 3,
    borderTopColor: THEME.colors.outline,
    backgroundColor: THEME.colors.wall,
  },
  shelfEdge: {
    height: 10,
    backgroundColor: THEME.colors.woodLight,
    borderBottomWidth: 2,
    borderBottomColor: THEME.colors.woodDark,
  },
  stationScroll: {
    paddingHorizontal: 8,
    paddingVertical: 6,
    alignItems: 'center',
  },
});

export default App;
