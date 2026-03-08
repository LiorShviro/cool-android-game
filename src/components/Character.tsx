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
import { pickSpeechLine } from '../constants/gameConstants';
import { getCharacterPng, CharacterMood, CharacterPngKey } from '../assets/png/characters';
import { THEME } from '../assets/theme';
import { useUIScale } from '../hooks/useUIScale';
import { STATION_PNGS } from '../assets/png/stations';

type Mood = CharacterMood;

interface CharacterProps {
  character: CharacterType;
}

// Characters with landscape art — use "cover" crop instead of "contain"
const LANDSCAPE_CHARS = new Set<CharacterPngKey>(['mother', 'male_teen', 'boy']);

// Downward shift (as fraction of adjustedSize) to compensate for transparent bottom padding in generated art
const VARIANT_Y_SHIFT: Partial<Record<CharacterPngKey, number>> = {
  girl: 0.12,
  grandma: 0.08,
  dog2: 0.08,
};

// Scale override for landscape chars that appear too large
const LANDSCAPE_SCALE: Partial<Record<CharacterPngKey, number>> = {
  boy: 0.78,
};

const CharacterAvatar: React.FC<{ type: string; mood: Mood; variant: number; size: number; visualKey?: string }> = ({
  type,
  mood,
  variant,
  size,
  visualKey,
}) => {
  const scaleMultiplier = type === 'DOG' ? 0.5625 : type === 'KID' ? 0.95 : 0.98;
  const adjustedSize = Math.round(size * scaleMultiplier);
  let key: CharacterPngKey;
  if (visualKey && (visualKey as CharacterPngKey)) {
    key = visualKey as CharacterPngKey;
  } else {
    key = type === 'DOG' ? 'dog' : type === 'KID' ? 'teen' : variant % 2 === 0 ? 'saba' : 'parent';
  }
  const isLandscape = LANDSCAPE_CHARS.has(key);
  const lsScale = LANDSCAPE_SCALE[key] ?? 1;
  const yShift = Math.round((VARIANT_Y_SHIFT[key] ?? 0) * adjustedSize);
  return (
    <View style={isLandscape ? { width: Math.round(adjustedSize * lsScale), height: Math.round(adjustedSize * 1.3 * lsScale), overflow: 'hidden' } : undefined}>
      <Image
        source={getCharacterPng(key, mood)}
        style={{ width: Math.round(adjustedSize * lsScale), height: Math.round(adjustedSize * 1.3 * lsScale), transform: yShift ? [{ translateY: yShift }] : undefined }}
        resizeMode={isLandscape ? 'cover' : 'contain'}
      />
    </View>
  );
};

const NEED_ICON = {
  WATER: STATION_PNGS.waterCupBase,
  BAMBA: STATION_PNGS.bamba,
  BISLI: STATION_PNGS.bisly,
  PET: STATION_PNGS.dogBall,
  CHARGING: STATION_PNGS.chargePhone,
  RECEPTION: STATION_PNGS.receptionHandPhone,
} as const;

export const Character: React.FC<CharacterProps> = ({ character }) => {
  const { decrementLives, removeCharacter, isPaused, activeCharacters } = useGameStore();
  const progress = useSharedValue(1);
  const bobY = useSharedValue(0);
  const isMounted = useSharedValue(true);
  const lastMood = useSharedValue<Mood>('neutral');
  const isFulfilled = useSharedValue(false);
  const isInitialMount = useRef(true);
  const { scale } = useUIScale();
  const rowScale = activeCharacters.length >= 4 ? 0.85 : activeCharacters.length >= 3 ? 0.92 : 1;
  const sizeScale = scale * 2.6 * rowScale;

  // Deterministic visual variant per character
  const variant = useMemo(() => {
    const num = parseInt(character.id.replace(/\D/g, '').slice(-2) || '0', 10);
    return num;
  }, [character.id]);

  const startBobAnimation = useCallback((durationMs: number) => {
    bobY.value = withRepeat(
      withSequence(
        withTiming(-2, { duration: durationMs, easing: Easing.inOut(Easing.sin) }),
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

  const speechText = useMemo(
    () => character.speechLine ?? pickSpeechLine(character.need),
    [character.need, character.speechLine, character.id]
  );
  const speechIcon = NEED_ICON[character.need as keyof typeof NEED_ICON];
  const avatarSize = Math.round(72 * sizeScale);
  const avatarHeight = Math.round(avatarSize * 1.3);
  const timerBarHeight = Math.max(5, Math.round(7 * scale * 0.8));
  const scaledStyles = useMemo(
    () => ({
      container: {
        width: Math.round(110 * scale * rowScale),
        margin: Math.round(6 * scale * rowScale),
        height: Math.round(avatarHeight + timerBarHeight + 4 * scale),
      },
      bubbleWrap: {
        position: 'absolute',
        top: Math.round(-2 * scale),
        left: 0,
        right: 0,
        alignItems: 'center',
        zIndex: 2,
      },
      speechBubble: {
        maxWidth: Math.round(120 * scale * 0.85 * rowScale),
        paddingHorizontal: Math.round(7 * scale * 0.8 * rowScale),
        paddingVertical: Math.round(5 * scale * 0.8 * rowScale),
        borderRadius: Math.round(12 * scale * 0.8),
        borderWidth: Math.max(2, Math.round(2.5 * scale * 0.8)),
      },
      speechIcon: {
        width: Math.round(18 * scale * 0.8 * rowScale),
        height: Math.round(18 * scale * 0.8 * rowScale),
        marginRight: Math.round(4 * scale * 0.8),
      },
      speechText: {
        fontSize: Math.max(8, Math.round(10 * scale * 0.8 * rowScale)),
      },
      bubbleTail: {
        borderLeftWidth: Math.max(4, Math.round(6 * scale * 0.8)),
        borderRightWidth: Math.max(4, Math.round(6 * scale * 0.8)),
        borderTopWidth: Math.max(5, Math.round(7 * scale * 0.8)),
      },
      timerBarTrack: {
        width: Math.round(78 * scale * 0.8),
        height: timerBarHeight,
        position: 'absolute',
        bottom: Math.round(1 * scale),
        alignSelf: 'center',
      },
      avatarWrap: {
        height: avatarHeight,
        width: '100%',
        justifyContent: 'flex-end',
      },
      avatarHolder: {
        height: avatarHeight,
      },
      groundShadow: {
        width: Math.round(avatarSize * 0.7),
        height: Math.round(avatarSize * 0.12),
        borderRadius: Math.round(avatarSize * 0.2),
      },
      groundAnchor: {
        width: Math.round(avatarSize * 0.35),
        height: Math.round(avatarSize * 0.06),
        borderRadius: Math.round(avatarSize * 0.12),
      },
      fulfilledBadge: {
        transform: [{ scale: scale * 0.9 }],
      },
      fulfilledText: {
        fontSize: Math.max(9, Math.round(11 * scale * 0.8)),
      },
    }),
    [scale, sizeScale, avatarHeight, timerBarHeight, rowScale, activeCharacters.length]
  );

  return (
    <View style={[styles.container, scaledStyles.container]}>
      <View style={[styles.bubbleWrap, scaledStyles.bubbleWrap]}>
        <Animated.View style={[styles.speechBubble, bubbleBorderStyle, scaledStyles.speechBubble]}>
          <View style={styles.speechContent}>
            {speechIcon && <Image source={speechIcon} style={[styles.speechIcon, scaledStyles.speechIcon]} resizeMode="contain" />}
            <Text style={[styles.speechText, scaledStyles.speechText]}>{speechText}</Text>
          </View>
          {character.status === 'FULFILLED' && (
            <View style={[styles.fulfilledBadge, scaledStyles.fulfilledBadge]}>
              <Text style={[styles.fulfilledText, scaledStyles.fulfilledText]}>✓</Text>
            </View>
          )}
        </Animated.View>
        <View style={[styles.bubbleTail, scaledStyles.bubbleTail]} />
      </View>

      <View style={[styles.avatarWrap, scaledStyles.avatarWrap]}>
        <View style={[styles.groundShadow, scaledStyles.groundShadow]} />
        <View style={[styles.groundAnchor, scaledStyles.groundAnchor]} />
        <Animated.View style={[styles.avatarHolder, scaledStyles.avatarHolder, bobStyle]}>
          <CharacterAvatar type={character.type} mood={currentMood} variant={variant} size={avatarSize} visualKey={character.visualKey} />
        </Animated.View>
      </View>

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
  bubbleWrap: {
    alignItems: 'center',
  },
  speechContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  speechIcon: {
    tintColor: undefined,
  },
  speechText: {
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
    flexShrink: 1,
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
  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'flex-end',
    position: 'relative',
  },
  avatarHolder: {
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  groundShadow: {
    backgroundColor: 'rgba(0,0,0,0.22)',
    position: 'absolute',
    bottom: 0,
  },
  groundAnchor: {
    backgroundColor: 'rgba(0,0,0,0.32)',
    position: 'absolute',
    bottom: 0,
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
