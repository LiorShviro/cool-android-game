import React, { useEffect, useMemo, useRef } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withRepeat,
  withSequence,
  interpolateColor,
  Easing,
  runOnJS,
  useAnimatedReaction,
  cancelAnimation,
} from 'react-native-reanimated';
import { Character as CharacterType, useGameStore } from '../store/gameStore';
import { hapticService } from '../services/hapticService';
import { SPEECH_LINES } from '../constants/gameConstants';
import { SabaCharacter, Mood } from '../assets/svg/characters/SabaCharacter';
import { TeenCharacter } from '../assets/svg/characters/TeenCharacter';
import { ParentCharacter } from '../assets/svg/characters/ParentCharacter';
import { DogCharacter } from '../assets/svg/characters/DogCharacter';
import { THEME } from '../assets/theme';

interface CharacterProps {
  character: CharacterType;
}

const CharacterAvatar: React.FC<{ type: string; mood: Mood; variant: number }> = ({ type, mood, variant }) => {
  if (type === 'DOG') return <DogCharacter mood={mood} size={68} />;
  if (type === 'KID') return <TeenCharacter mood={mood} size={62} />;
  // ADULT: alternate between Saba and Parent based on variant
  if (variant % 2 === 0) return <SabaCharacter mood={mood} size={62} />;
  return <ParentCharacter mood={mood} size={62} />;
};

export const Character: React.FC<CharacterProps> = ({ character }) => {
  const { decrementLives, removeCharacter, isPaused } = useGameStore();
  const progress = useSharedValue(1);
  const bobY = useSharedValue(0);
  const isInitialMount = useRef(true);

  // Deterministic visual variant per character
  const variant = useMemo(() => {
    const num = parseInt(character.id.replace(/\D/g, '').slice(-2) || '0', 10);
    return num;
  }, [character.id]);

  const startBobAnimation = (durationMs: number) => {
    bobY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: durationMs, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: durationMs, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  };

  useEffect(() => {
    startBobAnimation(600);
  }, []);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      progress.value = withTiming(
        0,
        { duration: character.timer, easing: Easing.linear },
        (finished) => {
          if (finished) runOnJS(handleTimerExpire)();
        }
      );
      return;
    }

    if (isPaused) {
      cancelAnimation(progress);
      cancelAnimation(bobY);
    } else {
      const remaining = progress.value * character.timer;
      progress.value = withTiming(
        0,
        { duration: remaining, easing: Easing.linear },
        (finished) => {
          if (finished) runOnJS(handleTimerExpire)();
        }
      );
      startBobAnimation(600);
    }
  }, [isPaused]);

  // Speed up bob when urgent
  useAnimatedReaction(
    () => progress.value,
    (current, previous) => {
      if (current < 0.2 && previous && previous >= 0.2) {
        runOnJS(hapticService.warning)();
        runOnJS(startBobAnimation)(200);
      } else if (current < 0.5 && previous && previous >= 0.5) {
        runOnJS(startBobAnimation)(380);
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

  const bobStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: bobY.value }],
  }));

  const mood: Mood = useMemo(() => {
    // We can't read shared values in useMemo, so we derive from character timer
    // Mood is updated via state change — for initial render default to neutral
    return 'neutral';
  }, [character.id]);

  // Track mood reactively via a separate shared value we expose as state
  const moodState = useRef<Mood>('neutral');
  useAnimatedReaction(
    () => progress.value,
    (current) => {
      const newMood: Mood = current <= 0.2 ? 'urgent' : current <= 0.5 ? 'impatient' : 'neutral';
      if (newMood !== moodState.current) {
        runOnJS((m: Mood) => { moodState.current = m; })(newMood);
      }
    }
  );

  const [currentMood, setCurrentMood] = React.useState<Mood>('neutral');
  useAnimatedReaction(
    () => progress.value,
    (current) => {
      const newMood: Mood = current <= 0.2 ? 'urgent' : current <= 0.5 ? 'impatient' : 'neutral';
      runOnJS(setCurrentMood)(newMood);
    }
  );

  const speechText = SPEECH_LINES[character.need] ?? character.need;

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.speechBubble, bubbleBorderStyle]}>
        <Text style={styles.speechText}>{speechText}</Text>
      </Animated.View>
      <View style={styles.bubbleTail} />
      <Animated.View style={bobStyle}>
        <CharacterAvatar type={character.type} mood={currentMood} variant={variant} />
      </Animated.View>
      <View style={styles.timerBarTrack}>
        <Animated.View style={[styles.timerBarFill, timerBarStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 6,
    width: 96,
  },
  speechBubble: {
    backgroundColor: THEME.colors.offWhite,
    borderRadius: 10,
    borderWidth: 2.5,
    paddingHorizontal: 6,
    paddingVertical: 4,
    maxWidth: 96,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
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
    borderTopColor: THEME.colors.offWhite,
    marginTop: -1,
  },
  timerBarTrack: {
    width: 64,
    height: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
    marginTop: 4,
  },
  timerBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
