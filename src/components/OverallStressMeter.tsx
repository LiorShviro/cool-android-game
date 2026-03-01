import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { useGameStore } from '../store/gameStore';

export const OverallStressMeter: React.FC = () => {
  const { stressMeter } = useGameStore();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(stressMeter / 100, { duration: 500 });
  }, [stressMeter]);

  const animatedBarStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 0.5, 0.8, 1],
      ['#00C851', '#FFBB33', '#FF4444', '#CC0000']
    );

    return {
      width: `${progress.value * 100}%`,
      backgroundColor: color,
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.meterContainer}>
        <Animated.View style={[styles.bar, animatedBarStyle]} />
      </View>
      <Text style={styles.label}>{Math.round(stressMeter)}%</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  meterContainer: {
    height: 20,
    width: '80%',
    backgroundColor: '#E0E0E0',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: '#333',
  },
  bar: {
    height: '100%',
  },
  label: {
    marginTop: 5,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
