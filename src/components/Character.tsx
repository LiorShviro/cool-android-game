import React, { useEffect, useMemo, useRef, useCallback } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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
import { getCharacterPng, CharacterMood, CharacterPngKey } from '../assets/png/characters';
import { THEME } from '../assets/theme';
import { useUIScale } from '../hooks/useUIScale';

type Mood = CharacterMood;

interface CharacterProps {
  character: CharacterType;
}

const CharacterAvatar: React.FC<{ type: string; mood: Mood; variant: number; size: number }> = ({
  type,
  mood,
  variant,
  size,
}) => {
  const scaleMultiplier = type === 'DOG' ? 0.5625 : type === 'KID' ? 0.95 : 0.98;
  const adjustedSize = Math.round(size * scaleMultiplier);
  const key: CharacterPngKey =
    type === 'DOG' ? 'dog' : type === 'KID' ? 'teen' : variant % 2 === 0 ? 'saba' : 'parent';
  return (
    <Image
      source={getCharacterPng(key, mood)}
      style={{ width: adjustedSize, height: Math.round(adjustedSize * 1.3) }}
      resizeMode="contain"
    />
  );
};

export const Character: React.FC<CharacterProps> = ({ character }) => {
  const { decrementLives, removeCharacter, isPaused } = useGameStore();
  const progress = useSharedValue(1);
  const bobY = useSharedValue(0);
  const isMounted = useSharedValue(true);
  const lastMood = useSharedValue<Mood>('neutral');
  const isFulfilled = useSharedValue(false);
  const isInitialMount = useRef(true);
  const { scale } = useUIScale();
  const sizeScale = scale * 2.6;

  // Deterministic visual variant per character
  const variant = useMemo(() => {
    const num = parseInt(character.id.replace(/\D/g, '').slice(-2) || '0', 10);
    return num;
  }, [character.id]);

  const startBobAnimation = useCallback((durationMs: number) => {
    bobY.value = withRepeat(
      withSequence(
        withTiming(-6, { duration: durationMs, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: durationMs, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
  }, [bobY]);

  useEffect(() => {
    startBobAnimation(600);
  }, [startBobAnimation]);

  useEffect(() => {
    return () => {
      isMounted.value = false;
      cancelAnimation(progress);
      cancelAnimation(bobY);
    };
  }, [bobY, isMounted, progress]);

  useEffect(() => {
    if (character.status !== 'FULFILLED') return;
    isFulfilled.value = true;
    cancelAnimation(progress);
    cancelAnimation(bobY);
    const removalTimer = setTimeout(() => {
      removeCharacter(character.id, 'FULFILLED');
    }, 450);
    return () => clearTimeout(removalTimer);
  }, [bobY, character.id, character.status, isFulfilled, progress, removeCharacter]);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      progress.value = withTiming(
        0,
        { duration: character.timer, easing: Easing.linear },
        (finished) => {
          if (finished && isMounted.value && !isFulfilled.value) runOnJS(handleTimerExpire)();
        }
      );
      return;
    }

    if (isPaused) {
      cancelAnimation(progress);
      cancelAnimation(bobY);
    } else {
      if (isFulfilled.value) return;
      const remaining = progress.value * character.timer;
      progress.value = withTiming(
        0,
        { duration: remaining, easing: Easing.linear },
        (finished) => {
          if (finished && isMounted.value && !isFulfilled.value) runOnJS(handleTimerExpire)();
        }
      );
      startBobAnimation(600);
    }
  }, [character.timer, isMounted, isPaused, progress, startBobAnimation, bobY, handleTimerExpire, isFulfilled]);

  // Speed up bob when urgent
  useAnimatedReaction(
    () => progress.value,
    (current, previous) => {
      if (!isMounted.value) return;
      if (isFulfilled.value) return;
      if (current < 0.2 && previous && previous >= 0.2) {
        runOnJS(hapticService.warning)();
        runOnJS(startBobAnimation)(200);
      } else if (current < 0.5 && previous && previous >= 0.5) {
        runOnJS(startBobAnimation)(380);
      }
    }
  );

  const handleTimerExpire = useCallback(() => {
    if (isFulfilled.value) return;
    hapticService.error();
    decrementLives();
    removeCharacter(character.id, 'EXPIRED');
  }, [character.id, decrementLives, isFulfilled, removeCharacter]);

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

  const [currentMood, setCurrentMood] = React.useState<Mood>('neutral');
  useAnimatedReaction(
    () => progress.value,
    (current) => {
      if (!isMounted.value) return;
      if (isFulfilled.value) return;
      const newMood: Mood = current <= 0.2 ? 'urgent' : current <= 0.5 ? 'impatient' : 'neutral';
      if (newMood !== lastMood.value) {
        lastMood.value = newMood;
        runOnJS(setCurrentMood)(newMood);
      }
    }
  );

  const speechText = SPEECH_LINES[character.need] ?? character.need;
  const avatarSize = Math.round(72 * sizeScale);
  const scaledStyles = useMemo(
    () => ({
      container: {
        width: Math.round(110 * scale),
        margin: Math.round(8 * scale),
      },
      speechBubble: {
        maxWidth: Math.round(110 * scale * 0.8),
        paddingHorizontal: Math.round(7 * scale * 0.8),
        paddingVertical: Math.round(5 * scale * 0.8),
        borderRadius: Math.round(12 * scale * 0.8),
        borderWidth: Math.max(2, Math.round(2.5 * scale * 0.8)),
      },
      speechText: {
        fontSize: Math.max(8, Math.round(10 * scale * 0.8)),
      },
      bubbleTail: {
        borderLeftWidth: Math.max(4, Math.round(6 * scale * 0.8)),
        borderRightWidth: Math.max(4, Math.round(6 * scale * 0.8)),
        borderTopWidth: Math.max(5, Math.round(7 * scale * 0.8)),
      },
      timerBarTrack: {
        width: Math.round(78 * scale * 0.8),
        height: Math.max(5, Math.round(7 * scale * 0.8)),
        marginTop: Math.round(4 * scale * 0.8),
      },
      fulfilledBadge: {
        transform: [{ scale: scale * 0.9 }],
      },
      fulfilledText: {
        fontSize: Math.max(9, Math.round(11 * scale * 0.8)),
      },
    }),
    [scale, sizeScale]
  );

  return (
    <View style={[styles.container, scaledStyles.container]}>
      <Animated.View style={[styles.speechBubble, bubbleBorderStyle, scaledStyles.speechBubble]}>
        <Text style={[styles.speechText, scaledStyles.speechText]}>{speechText}</Text>
        {character.status === 'FULFILLED' && (
          <View style={[styles.fulfilledBadge, scaledStyles.fulfilledBadge]}>
            <Text style={[styles.fulfilledText, scaledStyles.fulfilledText]}>✓</Text>
          </View>
        )}
      </Animated.View>
      <View style={[styles.bubbleTail, scaledStyles.bubbleTail]} />
      <Animated.View style={bobStyle}>
        <CharacterAvatar type={character.type} mood={currentMood} variant={variant} size={avatarSize} />
      </Animated.View>
      <View style={[styles.timerBarTrack, scaledStyles.timerBarTrack]}>
        <Animated.View style={[styles.timerBarFill, timerBarStyle]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  speechBubble: {
    backgroundColor: THEME.colors.offWhite,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
  },
  speechText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
  fulfilledBadge: {
    position: 'absolute',
    right: -6,
    top: -8,
    backgroundColor: THEME.colors.green,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: THEME.colors.outline,
  },
  fulfilledText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  bubbleTail: {
    width: 0,
    height: 0,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: THEME.colors.offWhite,
    marginTop: -1,
  },
  timerBarTrack: {
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  timerBarFill: {
    height: '100%',
    borderRadius: 3,
  },
});
