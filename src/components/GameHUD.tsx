import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { RocketHUD } from './RocketHUD';

export const GameHUD: React.FC = () => {
  const { score, comboStreak, togglePause } = useGameStore();
  const multiplier = Math.min(3, Math.floor(comboStreak / 2) + 1);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <RocketHUD />
        <View style={styles.scoreContainer}>
          <Text style={styles.scoreText}>{score}</Text>
          {multiplier > 1 && (
            <Text style={styles.multiplierText}>x{multiplier}</Text>
          )}
        </View>
        <TouchableOpacity
          testID="pause-button"
          style={styles.pauseButton}
          onPress={togglePause}
        >
          <Text style={styles.pauseIcon}>â˘â˘</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 15,
    paddingTop: 10,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  scoreContainer: {
    alignItems: 'center',
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  multiplierText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#FFBB33',
  },
  pauseButton: {
    backgroundColor: '#DDD',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pauseIcon: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
  },
});
