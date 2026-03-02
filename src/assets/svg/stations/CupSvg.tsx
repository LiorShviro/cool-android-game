import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, G } from 'react-native-svg';
import Animated, { useAnimatedStyle } from 'react-native-reanimated';
import { THEME } from '../../theme';

interface CupSvgProps {
  fillProgress: Animated.SharedValue<number>;
  isOverfilled: boolean;
  scale?: number;
}

export const CupSvg: React.FC<CupSvgProps> = ({ fillProgress, isOverfilled, scale = 1 }) => {
  const width = Math.round(70 * scale);
  const height = Math.round(100 * scale);
  const waterHeightMax = Math.round(72 * scale);
  const waterInset = Math.round(7 * scale);

  // Animate a View overlay inside the cup to represent water fill
  const waterStyle = useAnimatedStyle(() => {
    const pct = Math.min(1, fillProgress.value / 1.5);
    const waterHeight = Math.max(0, pct * waterHeightMax);
    return {
      height: waterHeight,
      backgroundColor: fillProgress.value > 1.2 ? '#FF4444' : '#33b5e5',
    };
  });

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Water fill overlay (behind SVG outline) */}
      <View style={[styles.waterContainer, { left: waterInset, right: waterInset, height: waterHeightMax, bottom: Math.round(8 * scale) }]}>
        <Animated.View style={[styles.water, waterStyle]} />
      </View>

      {/* Cup outline SVG */}
      <Svg width={width} height={height} viewBox="0 0 70 100" style={StyleSheet.absoluteFill}>
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
    backgroundColor: 'white',
    // Cup trapezoid clip approximated with just the rect area
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'hidden',
  },
  waterContainer: {
    position: 'absolute',
    bottom: 8,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  water: {
    width: '100%',
    borderRadius: 2,
  },
});
