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
            <Text style={styles.title}>Mamad Manager</Text>
            <Text style={styles.subtitle}>Safe Room Chaos</Text>
            <Text style={styles.versionText}>Build: 1.0 (Local)</Text>
            
            <TouchableOpacity style={styles.mainButton} onPress={startGame}>
              <Text style={styles.buttonText}>START GAME</Text>
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
      return (
        <SafeAreaView style={styles.fullScreen}>
          <View style={styles.centered}>
            <Text style={[styles.title, { color: '#FF4444' }]}>GAME OVER</Text>
            <Text style={styles.finalScore}>Final Score: {score}</Text>
            <Text style={styles.rankText}>Rank: {storageService.getRank(score)}</Text>
            
            <TouchableOpacity style={styles.mainButton} onPress={startGame}>
              <Text style={styles.buttonText}>TRY AGAIN</Text>
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

        <View style={styles.stationArea}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
      {renderScreen()}
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
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
    marginBottom: 15,
  },
  secondaryButton: {
    backgroundColor: '#FFF',
    borderWidth: 2,
    borderColor: '#00C851',
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButtonText: {
    color: '#00C851',
    fontSize: 16,
    fontWeight: 'bold',
  },
  finalScore: {
    fontSize: 24,
    marginBottom: 5,
  },
  rankText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00C851',
    marginBottom: 30,
  },
  header: {
    height: 80,
    justifyContent: 'center',
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
