import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';

export const RocketHUD: React.FC = () => {
  const { lives } = useGameStore();

  return (
    <View style={styles.container}>
      {[...Array(3)].map((_, i) => (
        <Text key={i} style={[styles.rocket, i >= lives && styles.lost]}>
          🚀
        </Text>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 5,
  },
  rocket: {
    fontSize: 24,
    marginHorizontal: 2,
  },
  lost: {
    opacity: 0.2,
  },
});
