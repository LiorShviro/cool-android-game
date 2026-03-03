import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSpring,
  runOnJS,
  Easing,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { hapticService } from '../../services/hapticService';
import Svg, { Rect, Circle } from 'react-native-svg';

import { THEME } from '../../assets/theme';
import { useUIScale } from '../../hooks/useUIScale';

interface ChargingStationProps {
  onSuccess: () => void;
}

const PhoneSvg: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <Svg width={Math.round(38 * scale)} height={Math.round(52 * scale)} viewBox="0 0 38 52">
    <Rect x={1} y={1} width={36} height={50} rx={5} fill="#222" stroke={THEME.colors.outline} strokeWidth={2} />
    <Rect x={4} y={5} width={30} height={36} rx={2} fill="#4A90D9" />
    {/* Screen content lines */}
    <Rect x={8} y={10} width={22} height={3} rx={1.5} fill="#88BBFF" opacity={0.7} />
    <Rect x={8} y={16} width={18} height={3} rx={1.5} fill="#88BBFF" opacity={0.5} />
    <Rect x={8} y={22} width={20} height={3} rx={1.5} fill="#88BBFF" opacity={0.5} />
    {/* Battery indicator */}
    <Rect x={13} y={27} width={12} height={8} rx={2} fill="none" stroke="#FF6060" strokeWidth={1.5} />
    <Rect x={13} y={27} width={4} height={8} rx={2} fill="#FF6060" opacity={0.7} />
    <Rect x={25} y={29} width={2} height={4} rx={1} fill="#FF6060" />
    {/* Home button */}
    <Circle cx={19} cy={47} r={2.5} fill="#555" stroke="#888" strokeWidth={1} />
    {/* Charging port */}
    <Rect x={15} y={48} width={8} height={3} rx={1.5} fill="#555" />
  </Svg>
);

const PlugSvg: React.FC<{ scale?: number }> = ({ scale = 1 }) => (
  <Svg width={Math.round(30 * scale)} height={Math.round(38 * scale)} viewBox="0 0 30 38">
    {/* Cable body */}
    <Rect x={12} y={0} width={6} height={16} rx={3} fill="#888" stroke={THEME.colors.outline} strokeWidth={1.5} />
    {/* Plug head */}
    <Rect x={6} y={14} width={18} height={14} rx={4} fill="#555" stroke={THEME.colors.outline} strokeWidth={2} />
    {/* Prongs */}
    <Rect x={9} y={28} width={4} height={10} rx={2} fill="#333" stroke={THEME.colors.outline} strokeWidth={1.5} />
    <Rect x={17} y={28} width={4} height={10} rx={2} fill="#333" stroke={THEME.colors.outline} strokeWidth={1.5} />
    {/* LED */}
    <Circle cx={15} cy={21} r={2} fill="#00FF88" opacity={0.8} />
  </Svg>
);

export const ChargingStation: React.FC<ChargingStationProps> = ({ onSuccess }) => {
  const { scale } = useUIScale();
  const phoneRange = 50 * scale;
  const phoneX = useSharedValue(-phoneRange);
  const plugX = useSharedValue(0);
  const plugY = useSharedValue(0);
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
      track: {
        width: Math.round(120 * scale),
        height: Math.round(150 * scale),
        paddingVertical: Math.round(14 * scale),
        marginTop: Math.round(8 * scale),
      },
      phone: {
        width: Math.round(38 * scale),
        height: Math.round(52 * scale),
      },
      plug: {
        width: Math.round(30 * scale),
        height: Math.round(38 * scale),
      },
    }),
    [scale]
  );
  const successDist = 40 * scale;
  const yThreshold = -25 * scale;

  useEffect(() => {
    phoneX.value = withRepeat(
      withTiming(phoneRange, { duration: 2500, easing: Easing.linear }),
      -1,
      true,
    );
  }, [phoneRange, phoneX]);

  const handleSuccess = () => {
    hapticService.success();
    onSuccess();
    plugX.value = withSpring(0);
    plugY.value = withSpring(0);
  };

  const handleMiss = () => {
    hapticService.warning();
    plugX.value = withSpring(0);
    plugY.value = withSpring(0);
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      plugX.value = e.translationX;
      plugY.value = e.translationY;
    })
    .onEnd(() => {
      const dist = Math.abs(plugX.value - phoneX.value);
      if (dist < successDist && plugY.value < yThreshold) {
        runOnJS(handleSuccess)();
      } else {
        runOnJS(handleMiss)();
      }
    });

  const phoneAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: phoneX.value }],
  }));

  const plugAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: plugX.value }, { translateY: plugY.value }],
  }));

  return (
    <View style={[styles.container, scaledStyles.container]}>
      <View style={[styles.shelfTop, scaledStyles.shelfTop]}>
        <Text style={[styles.stationLabel, scaledStyles.stationLabel]}>CHARGE</Text>
      </View>

      <View style={[styles.track, scaledStyles.track]}>
        <Animated.View style={[styles.phone, scaledStyles.phone, phoneAnimStyle]}>
          <PhoneSvg scale={scale} />
        </Animated.View>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.plug, scaledStyles.plug, plugAnimStyle]} testID="charging-plug">
            <PlugSvg scale={scale} />
          </Animated.View>
        </GestureDetector>
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
  track: {
    width: 100,
    height: 130,
    backgroundColor: '#FFFDE0',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: THEME.colors.outline,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    overflow: 'hidden',
    marginTop: 8,
  },
  phone: {
    width: 38,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plug: {
    width: 30,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
