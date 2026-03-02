import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useGameStore } from '../store/gameStore';
import { RocketSvg } from '../assets/svg/ui/RocketSvg';

export const RocketHUD: React.FC = () => {
  const { lives } = useGameStore();

  return (
    <View style={styles.container}>
      {[...Array(3)].map((_, i) => (
        <View key={i} style={styles.rocketWrapper}>
          <RocketSvg active={i < lives} size={22} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 4,
  },
  rocketWrapper: {
    marginHorizontal: 3,
  },
});
