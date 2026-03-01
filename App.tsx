import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useGameStore, GameState } from './src/store/gameStore';
import { CharacterManager } from './src/components/CharacterManager';
import { Character } from './src/components/Character';
import { OverallStressMeter } from './src/components/OverallStressMeter';
import { WaterPitcher } from './src/components/stations/WaterPitcher';
import { ChargingStation } from './src/components/stations/ChargingStation';
import { ReceptionHunter } from './src/components/stations/ReceptionHunter';
import { SnackSorter } from './src/components/stations/SnackSorter';
import { DogDistraction } from './src/components/stations/DogDistraction';
import { storageService, LeaderboardEntry } from './src/services/storageService';

const App = () => {
  const {
    gameState,
    setGameState,
    activeCharacters,
    stressMeter,
    score,
    comboStreak,
    fulfillNeed,
    reset,
  } = useGameStore();

  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    if (stressMeter >= 100 && gameState === GameState.PLAYING) {
      setGameState(GameState.GAME_OVER);
      const newEntry = {
        name: 'Guest',
        score: score,
        date: new Date().toISOString(),
      };
      storageService.saveScore(newEntry);
      setLeaderboard(storageService.getLeaderboard());
    }
  }, [stressMeter, gameState, setGameState, score]);

  useEffect(() => {
    if (gameState === GameState.START || gameState === GameState.GAME_OVER) {
      setLeaderboard(storageService.getLeaderboard());
    }
  }, [gameState]);

  const startGame = () => {
    reset();
    setGameState(GameState.PLAYING);
  };

  const renderScreen = () => {
    if (gameState === GameState.START) {
      return (
        <SafeAreaView style={styles.fullScreen}>
          <View style={styles.centered}>
            <Text style={styles.title}>Mamad Manager</Text>
            <Text style={styles.subtitle}>Safe Room Chaos</Text>
            <Text style={styles.versionText}>Build: 1.0 (Local)</Text>

            {leaderboard.length > 0 && (
              <View style={styles.leaderboardContainer}>
                <Text style={styles.leaderboardTitle}>TOP SCORES</Text>
                {leaderboard.slice(0, 5).map((entry, index) => (
                  <Text key={index} style={styles.leaderboardEntry}>
                    {index + 1}. {entry.name}: {entry.score}
                  </Text>
                ))}
              </View>
            )}

            <TouchableOpacity style={styles.mainButton} onPress={startGame}>
              <Text style={styles.buttonText}>START GAME</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    if (gameState === GameState.GAME_OVER) {
      return (
        <SafeAreaView style={styles.fullScreen}>
          <View style={styles.centered}>
            <Text style={[styles.title, { color: '#FF4444' }]}>GAME OVER</Text>

            <View style={styles.leaderboardContainer}>
              <Text style={styles.leaderboardTitle}>TOP SCORES</Text>
              {leaderboard.map((entry, index) => (
                <Text key={index} style={styles.leaderboardEntry}>
                  {index + 1}. {entry.name}: {entry.score}
                </Text>
              ))}
            </View>

            <TouchableOpacity style={styles.mainButton} onPress={startGame}>
              <Text style={styles.buttonText}>TRY AGAIN</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      );
    }

    const comboDisplay = Math.min(comboStreak, 3);

    return (
      <SafeAreaView style={styles.fullScreen}>
        <CharacterManager />

        <View style={styles.header}>
          <OverallStressMeter />
          <View style={styles.scoreRow}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            {comboStreak > 1 && (
              <Text style={styles.comboText}>x{comboDisplay}</Text>
            )}
          </View>
        </View>

        <View style={styles.gameArea}>
          <View style={styles.characterZone}>
            {activeCharacters.map((char) => (
              <Character key={char.id} character={char} />
            ))}
          </View>
        </View>

        <View style={styles.stationArea}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <WaterPitcher onSuccess={() => fulfillNeed('WATER')} />
            <ChargingStation onSuccess={() => fulfillNeed('CHARGING')} />
            <ReceptionHunter onSuccess={() => fulfillNeed('RECEPTION')} />
            <SnackSorter onSuccess={(snack) => fulfillNeed(snack)} />
            <DogDistraction onSuccess={() => fulfillNeed('PET')} />
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };

  return (
    <GestureHandlerRootView style={styles.root}>
      {renderScreen()}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
  fullScreen: {
    flex: 1,
    backgroundColor: '#FAFAFA',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 40,
  },
  versionText: {
    fontSize: 12,
    color: '#AAA',
    marginBottom: 20,
  },
  mainButton: {
    backgroundColor: '#00C851',
    paddingVertical: 15,
    paddingHorizontal: 40,
    borderRadius: 30,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  leaderboardContainer: {
    width: '80%',
    padding: 20,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 30,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  leaderboardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#444',
  },
  leaderboardEntry: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666',
  },
  header: {
    paddingVertical: 8,
    justifyContent: 'center',
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    marginTop: 4,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  comboText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FF8C00',
    backgroundColor: '#FFF3CD',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
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
    height: 200,
    backgroundColor: '#EEE',
    borderTopWidth: 2,
    borderTopColor: '#CCC',
    paddingVertical: 10,
  },
});

export default App;
