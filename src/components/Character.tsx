import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Character as CharacterType, useGameStore } from '../store/gameStore';

interface CharacterProps {
  character: CharacterType;
}

export const Character: React.FC<CharacterProps> = ({ character }) => {
  const { updateStressMeter, removeCharacter } = useGameStore();
  const progress = useSharedValue(1);

  useEffect(() => {
    progress.value = withTiming(
      0,
      {
        duration: character.timer,
        easing: Easing.linear,
      },
      (finished) => {
        if (finished) {
          runOnJS(handleTimerExpire)();
        }
      }
    );
  }, []);

  const handleTimerExpire = () => {
    updateStressMeter(10); // Penalty for expiring timer
    removeCharacter(character.id);
  };

  const animatedCircleStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 0.2, 0.5, 1],
      ['#FF4444', '#FFBB33', '#00C851', '#00C851'] // Red, Yellow, Green
    );

    return {
      backgroundColor: color,
      transform: [{ scale: progress.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.bubbleContainer}>
        <Animated.View style={[styles.timerBubble, animatedCircleStyle]} />
        <View style={styles.needContainer}>
          <Text style={styles.needText}>{character.need}</Text>
        </View>
      </View>
      <View style={styles.characterVisual}>
        <Text style={styles.characterType}>{character.type}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
    width: 80,
  },
  bubbleContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  timerBubble: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: 30,
    opacity: 0.6,
  },
  needContainer: {
    backgroundColor: 'white',
    padding: 5,
    borderRadius: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  needText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  characterVisual: {
    backgroundColor: '#E0E0E0',
    width: 50,
    height: 70,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterType: {
    fontSize: 12,
    fontWeight: 'bold',
  },
});
