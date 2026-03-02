import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { THEME } from '../../theme';

interface CupSvgProps {
  fillProgress: Animated.SharedValue<number>;
  isOverfilled: boolean;
}

export const CupSvg: React.FC<CupSvgProps> = ({ fillProgress, isOverfilled }) => {
  // Animate a View overlay inside the cup to represent water fill
  const waterStyle = useAnimatedStyle(() => {
    const pct = Math.min(1, fillProgress.value / 1.5);
    const waterHeight = Math.max(0, pct * 72);
    return {
      height: waterHeight,
      backgroundColor: fillProgress.value > 1.2 ? '#FF4444' : '#33b5e5',
    };
  });

  return (
    <View style={styles.container}>
      {/* Water fill overlay (behind SVG outline) */}
      <View style={styles.waterContainer}>
        <Animated.View style={[styles.water, waterStyle]} />
      </View>

      {/* Cup outline SVG */}
      <Svg width={70} height={100} viewBox="0 0 70 100" style={StyleSheet.absoluteFill}>
        {/* Cup body outline */}
        <Path
          d="M 6 10 L 64 10 L 58 92 L 12 92 Z"
          fill="none"
          stroke={THEME.colors.outline}
          strokeWidth={2.5}
        />
        {/* Handle */}
        <Path
          d="M 58 28 Q 68 28 68 50 Q 68 72 58 72"
          stroke={THEME.colors.outline}
          strokeWidth={2.5}
          fill="none"
          strokeLinecap="round"
        />
        {/* Rim highlight */}
        <Path
          d="M 8 10 L 62 10"
          stroke="white"
          strokeWidth={2}
          strokeLinecap="round"
          opacity={0.5}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 70,
    height: 100,
    backgroundColor: 'white',
    // Cup trapezoid clip approximated with just the rect area
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  waterContainer: {
    position: 'absolute',
    bottom: 8,
    left: 7,
    right: 7,
    height: 72,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  water: {
    width: '100%',
    borderRadius: 2,
  },
});
