import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { hapticService } from '../../services/hapticService';
import { TennisBallSvg } from '../../assets/svg/stations/TennisBallSvg';
import { THEME } from '../../assets/theme';
import { useUIScale } from '../../hooks/useUIScale';

interface DogDistractionProps {
  onSuccess: () => void;
}

export const DogDistraction: React.FC<DogDistractionProps> = ({ onSuccess }) => {
  const [taps, setTaps] = useState(0);
  const translateY = useSharedValue(0);
  const { scale } = useUIScale();
  const bounceHeight = -48 * scale;
  const scaledStyles = useMemo(
    () => ({
      container: {
        minWidth: Math.round(130 * scale),
        margin: Math.round(8 * scale),
        paddingBottom: Math.round(12 * scale),
      },
      shelfTop: {
        paddingVertical: Math.round(6 * scale),
      },
      stationLabel: {
        fontSize: Math.max(11, Math.round(12 * scale)),
      },
      court: {
        width: Math.round(120 * scale),
        height: Math.round(125 * scale),
        marginTop: Math.round(8 * scale),
        paddingBottom: Math.round(26 * scale),
      },
      ground: {
        height: Math.round(22 * scale),
      },
      tapDot: {
        width: Math.round(8 * scale),
        height: Math.round(8 * scale),
        borderRadius: Math.round(4 * scale),
      },
    }),
    [scale]
  );

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(bounceHeight, { duration: 500, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) })
      ),
      -1,
      true
    );
  }, [bounceHeight, translateY]);

  const handleTap = () => {
    hapticService.light();
    const nextTaps = taps + 1;
    if (nextTaps >= 3) {
      hapticService.success();
      onSuccess();
      setTaps(0);
    } else {
      setTaps(nextTaps);
    }
  };

  const animatedBallStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  const tapsLeft = taps > 0 ? 3 - taps : 0;

  return (
    <View style={[styles.container, scaledStyles.container]}>
      <View style={[styles.shelfTop, scaledStyles.shelfTop]}>
        <Text style={[styles.stationLabel, scaledStyles.stationLabel]}>THROW BALL</Text>
      </View>

      <View style={[styles.court, scaledStyles.court]}>
        {/* Grass ground */}
        <View style={[styles.ground, scaledStyles.ground]} />

        <Pressable testID="dog-ball" onPress={handleTap}>
          <Animated.View style={animatedBallStyle}>
            <TennisBallSvg size={Math.round(50 * scale)} tapsLeft={tapsLeft} />
          </Animated.View>
        </Pressable>

        {/* Tap hint dots */}
        <View style={styles.tapDots}>
          {[0, 1, 2].map((i) => (
            <View
              key={i}
              style={[styles.tapDot, scaledStyles.tapDot, i < taps && styles.tapDotFilled]}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 8,
    backgroundColor: THEME.colors.cream,
    borderRadius: THEME.borderRadius.medium,
    borderWidth: 2.5,
    borderColor: THEME.colors.outline,
    paddingBottom: 10,
    minWidth: 110,
  },
  shelfTop: {
    width: '100%',
    backgroundColor: THEME.colors.woodLight,
    borderTopLeftRadius: THEME.borderRadius.medium - 2,
    borderTopRightRadius: THEME.borderRadius.medium - 2,
    paddingVertical: 5,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: THEME.colors.outline,
  },
  stationLabel: {
    fontSize: 11,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 1,
  },
  court: {
    width: 100,
    height: 110,
    backgroundColor: '#D4E8A0',
    borderRadius: 8,
    justifyContent: 'flex-end',
    alignItems: 'center',
    overflow: 'hidden',
    marginTop: 8,
    borderWidth: 1.5,
    borderColor: THEME.colors.outline,
    paddingBottom: 22,
  },
  ground: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 20,
    backgroundColor: '#8BBF48',
    borderTopWidth: 2,
    borderTopColor: THEME.colors.outline,
  },
  tapDots: {
    position: 'absolute',
    bottom: 6,
    flexDirection: 'row',
    gap: 6,
  },
  tapDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderWidth: 1.5,
    borderColor: THEME.colors.outline,
  },
  tapDotFilled: {
    backgroundColor: THEME.colors.green,
  },
});
