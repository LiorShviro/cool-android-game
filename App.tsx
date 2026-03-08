import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated as RNAnimated,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
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
import { BACKGROUND_PNGS } from './src/assets/png/backgrounds';
import { THEME } from './src/assets/theme';
import { useUIScale } from './src/hooks/useUIScale';
import { useSupplyRunTrigger } from './src/hooks/useSupplyRunTrigger';
import { SupplyRun } from './src/components/SupplyRun';

const App = () => {
  const {
    gameState,
    setGameState,
    startNewRun,
    playerName,
    setPlayerName,
    pausedScreen,
    setPausedScreen,
    isPaused,
    activeCharacters,
    score,
    comboStreak,
    maxCombo,
    needsFulfilled,
    needsFulfilledByNeed,
    missedNeeds,
    runStartedAt,
    runEndedAt,
    lives,
    fulfillNeed,
    endSupplyRun,
  } = useGameStore();

  useSupplyRunTrigger();
  const { width, height, scale } = useUIScale();
  const [nameInput, setNameInput] = useState('');

  // Life-lost red flash
  const lifeLostOpacity = useRef(new RNAnimated.Value(0)).current;
  const prevLives = useRef(3);
  useEffect(() => {
    if (lives < prevLives.current && gameState === GameState.PLAYING) {
      lifeLostOpacity.setValue(0.45);
      RNAnimated.timing(lifeLostOpacity, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start();
    }
    prevLives.current = lives;
  }, [lives, gameState, lifeLostOpacity]);
  const scaledLayout = React.useMemo(() => {
    const characterScale = scale * 2.3;
    const stationScale = scale * 1.15;
    return {
      characterZone: {
        minHeight: Math.round(80 * scale),
      },
      stationArea: {
        height: Math.round(230 * stationScale * 0.8),
      },
      stationScroll: {
        paddingHorizontal: Math.round(10 * stationScale),
        paddingVertical: Math.round(8 * stationScale),
      },
    };
  }, [scale]);

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    const savedName = storageService.getPlayerName();
    setPlayerName(savedName);
    setNameInput(savedName);
  }, [setPlayerName]);

  useEffect(() => {
    if (gameState === GameState.START || gameState === GameState.GAME_OVER || gameState === GameState.LEADERBOARD) {
      setLeaderboard(storageService.getLeaderboard());
    }
  }, [gameState]);

  useEffect(() => {
    if (gameState === GameState.GAME_OVER) {
      const resolvedName = playerName.trim() !== '' ? playerName.trim() : 'Guest';
      const newEntry = {
        name: resolvedName,
        score: score,
        date: new Date().toISOString(),
      };
      storageService.saveScore(newEntry);
      setLeaderboard(storageService.getLeaderboard());
    }
  }, [gameState, playerName, score]);

  const normalizeName = (value: string) => value.replace(/\s+/g, ' ').trim().slice(0, 14);

  const handleSaveName = () => {
    const cleaned = normalizeName(nameInput);
    const finalName = cleaned !== '' ? cleaned : 'Guest';
    setNameInput(finalName);
    setPlayerName(finalName);
    storageService.setPlayerName(finalName);
  };

  const startGame = () => {
    handleSaveName();
    startNewRun();
  };

  const formatDuration = (ms: number) => {
    const totalSeconds = Math.max(0, Math.floor(ms / 1000));
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const needSummary = [
    { key: 'WATER', label: 'Water cups handed' },
    { key: 'BISLI', label: 'Bisli given' },
    { key: 'BAMBA', label: 'Bamba given' },
    { key: 'PET', label: 'Dog calmed' },
    { key: 'CHARGING', label: 'Phones charged' },
    { key: 'RECEPTION', label: 'Reception found' },
  ];

  const renderScreen = () => {
    if (gameState === GameState.START) {
      return (
        <SafeAreaView style={styles.fullScreen}>
          <View style={styles.centered}>
            {/* Logo block */}
            <View style={styles.logoBadge}>
              <Text style={styles.logoTitle}>מלך</Text>
              <Text style={styles.logoSubtitle}>הממד</Text>
            </View>
            <Text style={styles.title}>MelechHaMamad</Text>
            <Text style={styles.subtitle}>Safe Room Chaos 🚀</Text>
            <Text style={styles.versionText}>Version: 1.0.0</Text>

            <View style={styles.nameCard}>
              <Text style={styles.nameLabel}>PLAYER NAME</Text>
              <View style={styles.nameInputRow}>
                <TextInput
                  style={styles.nameInput}
                  value={nameInput}
                  onChangeText={setNameInput}
                  onBlur={handleSaveName}
                  placeholder="Your name"
                  placeholderTextColor="#999"
                  maxLength={14}
                  autoCorrect={false}
                />
                <TouchableOpacity style={styles.nameSaveButton} onPress={handleSaveName}>
                  <Text style={styles.nameSaveText}>SAVE</Text>
                </TouchableOpacity>
              </View>
            </View>

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
      const durationMs = runStartedAt && runEndedAt ? runEndedAt - runStartedAt : 0;
      const durationText = formatDuration(durationMs);

      return (
        <SafeAreaView style={styles.fullScreen}>
          <ScrollView contentContainerStyle={styles.gameOverScroll} showsVerticalScrollIndicator={false}>
            <View style={styles.centered}>
            <View style={styles.shareCard}>
              <View style={styles.shareRibbon}>
                <Text style={styles.shareRibbonText}>RUN SUMMARY</Text>
              </View>
              <View style={[styles.logoBadge, styles.shareLogo]}>
                <Text style={styles.logoTitle}>מלך</Text>
                <Text style={styles.logoSubtitle}>הממד</Text>
              </View>
              <Text style={styles.shareTitle}>MelechHaMamad</Text>
              <Text style={styles.gameOverFlavor}>The safe room is in chaos!</Text>

              <View style={styles.scoreBadge}>
                <Text style={styles.finalScore}>{score}</Text>
                <Text style={styles.finalScoreLabel}>POINTS</Text>
              </View>
              <Text style={styles.rankText}>{storageService.getRank(score)}</Text>
              {positionText !== '' && (
                <Text style={styles.positionText}>{positionText}</Text>
              )}

              <View style={styles.summaryCard}>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>TIME</Text>
                  <Text style={styles.summaryValue}>{durationText}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>FULFILLED</Text>
                  <Text style={styles.summaryValue}>{needsFulfilled}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>MISSED</Text>
                  <Text style={styles.summaryValue}>{missedNeeds}</Text>
                </View>
                <View style={styles.summaryRow}>
                  <Text style={styles.summaryLabel}>MAX COMBO</Text>
                  <Text style={styles.summaryValue}>{maxCombo}</Text>
                </View>
              </View>

              <View style={styles.summaryCard}>
                <Text style={styles.summaryTitle}>NEEDS FILLED</Text>
                {needSummary.map((item) => (
                  <View key={item.key} style={styles.summaryRow}>
                    <Text style={styles.summaryLabel}>{item.label}</Text>
                    <Text style={styles.summaryValue}>{needsFulfilledByNeed[item.key as keyof typeof needsFulfilledByNeed] ?? 0}</Text>
                  </View>
                ))}
              </View>
            </View>

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
          </ScrollView>
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

    if (gameState === GameState.SUPPLY_RUN) {
      return (
        <SupplyRun
          onComplete={(caught) => endSupplyRun(caught ? 500 : 0)}
        />
      );
    }

    return (
      <SafeAreaView style={styles.fullScreen}>
        <CharacterManager />
        <PauseMenu />
        <ComboPopup multiplier={Math.min(3, Math.floor(comboStreak / 2) + 1)} />

        <GameHUD />

        {/* Red flash on life lost */}
        <RNAnimated.View
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.lifeLostFlash, { opacity: lifeLostOpacity }]}
        />

        {isPaused && pausedScreen === 'TUTORIAL' && (
          <View style={styles.pausedScreenOverlay}>
            <TutorialScreen onBack={() => setPausedScreen('NONE')} />
          </View>
        )}

        {isPaused && pausedScreen === 'LEADERBOARD' && (
          <View style={styles.pausedScreenOverlay}>
            <LeaderboardScreen
              entries={leaderboard}
              onBack={() => setPausedScreen('NONE')}
            />
          </View>
        )}

        <View style={styles.gameArea} pointerEvents="box-none">
          <View style={[styles.characterZone, scaledLayout.characterZone]} pointerEvents="box-none">
            {activeCharacters.map((char) => (
              <Character key={char.id} character={char} />
            ))}
          </View>
        </View>

        {/* Station shelf area */}
        <View style={[styles.stationArea, scaledLayout.stationArea]} pointerEvents="auto">
          <View style={styles.shelfEdge} />
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={[styles.stationScroll, scaledLayout.stationScroll]}>
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
          <Image
            source={BACKGROUND_PNGS.mamadRoom}
            style={styles.backgroundImage}
            resizeMode="contain"
            opacity={gameState === GameState.PLAYING ? 1 : 0.55}
          />
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
  backgroundImage: {
    width: '100%',
    height: '100%',
    transform: [{ scale: 0.95 }],
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
  nameCard: {
    width: '100%',
    backgroundColor: THEME.colors.offWhite,
    borderRadius: THEME.borderRadius.medium,
    padding: 12,
    marginBottom: 18,
    borderWidth: 2.5,
    borderColor: THEME.colors.outline,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  nameLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#777',
    letterSpacing: 1,
    marginBottom: 8,
  },
  nameInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  nameInput: {
    flex: 1,
    backgroundColor: 'white',
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 2,
    borderColor: THEME.colors.outline,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 14,
    color: THEME.colors.outline,
  },
  nameSaveButton: {
    backgroundColor: THEME.colors.blue,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 2,
    borderColor: THEME.colors.outline,
  },
  nameSaveText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
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
  shareCard: {
    width: '100%',
    backgroundColor: 'rgba(255,255,255,0.94)',
    borderRadius: THEME.borderRadius.large,
    padding: 18,
    marginBottom: 16,
    borderWidth: 3,
    borderColor: THEME.colors.outline,
    borderTopWidth: 6,
    borderTopColor: THEME.colors.orange,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 6,
    alignItems: 'center',
  },
  shareRibbon: {
    backgroundColor: THEME.colors.yellow,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 2,
    borderColor: THEME.colors.outline,
    marginBottom: 10,
  },
  shareRibbonText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: THEME.colors.outline,
    letterSpacing: 1,
  },
  shareLogo: {
    marginBottom: 10,
  },
  shareTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: THEME.colors.outline,
    marginBottom: 6,
  },
  gameOverFlavor: {
    fontSize: 15,
    color: THEME.colors.red,
    marginBottom: 16,
    textAlign: 'center',
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
  summaryCard: {
    width: '100%',
    backgroundColor: THEME.colors.offWhite,
    borderRadius: THEME.borderRadius.medium,
    padding: 14,
    marginBottom: 18,
    borderWidth: 2.5,
    borderColor: THEME.colors.outline,
  },
  summaryTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: THEME.colors.outline,
    letterSpacing: 1,
    marginBottom: 6,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryLabel: {
    fontSize: 12,
    color: '#777',
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: THEME.colors.outline,
  },
  gameOverScroll: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    alignItems: 'center',
  },
  gameArea: {
    flex: 1,
    justifyContent: 'flex-end',
    zIndex: 1,
  },
  characterZone: {
    flexDirection: 'row',
    flexWrap: 'nowrap',
    justifyContent: 'center',
    alignItems: 'flex-end',
    minHeight: 200,
    zIndex: 1,
  },
  stationArea: {
    height: 195,
    borderTopWidth: 3,
    borderTopColor: THEME.colors.outline,
    backgroundColor: THEME.colors.wall,
    zIndex: 5,
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
  pausedScreenOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.75)',
  },
  lifeLostFlash: {
    backgroundColor: '#FF4444',
    zIndex: 100,
  },
});

export default App;
