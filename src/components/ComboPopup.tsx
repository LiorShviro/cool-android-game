import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
} from 'react-native-reanimated';
import { StarburstSvg } from '../assets/svg/ui/StarburstSvg';

interface ComboPopupProps {
  multiplier: number;
}

export const ComboPopup: React.FC<ComboPopupProps> = ({ multiplier }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (multiplier > 1) {
      scale.value = withSequence(
        withSpring(1.4),
        withTiming(1, { duration: 200 }),
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 300 })
      );
      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 300 })
      );
    }
  }, [multiplier, scale, opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  if (multiplier <= 1) return null;

  const starColor = multiplier >= 3 ? '#FF6030' : '#F5C842';

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <View style={styles.starburstWrapper}>
        <StarburstSvg size={130} color={starColor} rays={10} />
      </View>
      <View style={styles.textWrapper}>
        <Text style={styles.multiplierText}>x{multiplier} COMBO!</Text>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '28%',
    alignSelf: 'center',
    zIndex: 100,
    elevation: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starburstWrapper: {
    position: 'absolute',
  },
  textWrapper: {
    alignItems: 'center',
  },
  comboLabel: {
    color: 'white',
    fontSize: 13,
    fontWeight: 'bold',
    letterSpacing: 2,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  multiplierText: {
    color: 'white',
    fontSize: 32,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 3,
  },
});
