import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
  Easing,
  runOnJS,
  useAnimatedReaction,
} from 'react-native-reanimated';
import { Character as CharacterType, useGameStore } from '../store/gameStore';
import { hapticService } from '../services/hapticService';
import { SPEECH_LINES, CHARACTER_EMOJIS } from '../constants/gameConstants';

interface CharacterProps {
  character: CharacterType;
}

export const Character: React.FC<CharacterProps> = ({ character }) => {
  const { decrementLives, removeCharacter } = useGameStore();
  const progress = useSharedValue(1);

  const emoji = useMemo(() => {
    const options = CHARACTER_EMOJIS[character.type] ?? ['👤'];
    return options[Math.floor(Math.random() * options.length)];
  }, [character.type]);

  const speechText = SPEECH_LINES[character.need] ?? character.need;

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

  useAnimatedReaction(
    () => progress.value,
    (current, previous) => {
      if (current < 0.2 && previous && previous >= 0.2) {
        runOnJS(hapticService.warning)();
      }
    }
  );

  const handleTimerExpire = () => {
    hapticService.error();
    decrementLives();
    removeCharacter(character.id);
  };

  const timerBarStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 0.2, 0.5, 1],
      ['#FF4444', '#FFBB33', '#00C851', '#00C851']
    );
    return {
      width: `${progress.value * 100}%`,
      backgroundColor: color,
    };
  });

  const bubbleBorderStyle = useAnimatedStyle(() => {
    const color = interpolateColor(
      progress.value,
      [0, 0.2, 0.5, 1],
      ['#FF4444', '#FFBB33', '#00C851', '#00C851']
    );
    return { borderColor: color };
  });

  return (
    <View style={styles.container}>
      {/* Speech bubble */}
      <Animated.View style={[styles.speechBubble, bubbleBorderStyle]}>
        <Text style={styles.speechText}>{speechText}</Text>
      </Animated.View>
      {/* Bubble tail */}
      <View style={styles.bubbleTail} />

      {/* Emoji avatar */}
      <Text style={styles.avatar}>{emoji}</Text>

      {/* Timer bar */}
      <View style={styles.timerBarTrack}>
        <Animated.View style={[styles.timerBarFill, timerBarStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 8,
    width: 90,
  },
  speechBubble: {
    backgroundColor: 'white',
    borderRadius: 10,
    borderWidth: 2,
    paddingHorizontal: 6,
    paddingVertical: 4,
    maxWidth: 90,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  speechText: {
    fontSize: 9,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  bubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 5,
    borderRightWidth: 5,
    borderTopWidth: 6,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: 'white',
    marginTop: -1,
  },
  avatar: {
    fontSize: 36,
    marginTop: 2,
  },
  timerBarTrack: {
    width: 60,
    height: 5,
    backgroundColor: '#E0E0E0',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  timerBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
