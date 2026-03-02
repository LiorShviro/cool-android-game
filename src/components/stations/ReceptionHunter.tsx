import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { hapticService } from '../../services/hapticService';
import Svg, { Rect, Path, Circle, G } from 'react-native-svg';
import { THEME } from '../../assets/theme';
import { useUIScale } from '../../hooks/useUIScale';

interface ReceptionHunterProps {
  onSuccess: () => void;
}

const randomSweetSpot = (range: number) => Math.random() * (range * 2) - range;
const HOLD_TICKS_REQUIRED = 20;
const TICK_MS = 50;

const HandWithPhoneSvg: React.FC<{ bars: number; scale?: number }> = ({ bars, scale = 1 }) => (
  <Svg width={Math.round(44 * scale)} height={Math.round(50 * scale)} viewBox="0 0 44 50">
    {/* Phone */}
    <Rect x={14} y={0} width={20} height={30} rx={3} fill="#222" stroke={THEME.colors.outline} strokeWidth={1.5} />
    <Rect x={16} y={3} width={16} height={20} rx={1} fill="#4A90D9" />
    {/* Signal bars on phone screen */}
    {[1, 2, 3].map((n) => (
      <Rect
        key={n}
        x={16 + (n - 1) * 5}
        y={13 - n * 2}
        width={4}
        height={n * 2 + 2}
        rx={1}
        fill={bars >= n ? '#00FF88' : '#555'}
      />
    ))}
    <Circle cx={24} cy={27} r={1.5} fill="#555" />
    {/* Hand */}
    <Path
      d="M 10 28 Q 6 30 6 40 L 38 40 Q 38 30 34 28 Z"
      fill={THEME.colors.skin}
      stroke={THEME.colors.outline}
      strokeWidth={2}
    />
    {/* Fingers */}
    <Rect x={8} y={38} width={6} height={12} rx={3} fill={THEME.colors.skin} stroke={THEME.colors.outline} strokeWidth={1.5} />
    <Rect x={16} y={36} width={6} height={14} rx={3} fill={THEME.colors.skin} stroke={THEME.colors.outline} strokeWidth={1.5} />
    <Rect x={24} y={36} width={6} height={14} rx={3} fill={THEME.colors.skin} stroke={THEME.colors.outline} strokeWidth={1.5} />
    <Rect x={32} y={38} width={6} height={12} rx={3} fill={THEME.colors.skin} stroke={THEME.colors.outline} strokeWidth={1.5} />
  </Svg>
);

export const ReceptionHunter: React.FC<ReceptionHunterProps> = ({ onSuccess }) => {
  const { scale } = useUIScale();
  const clampRange = 60 * scale;
  const sweetSpotX = useRef(randomSweetSpot(clampRange));
  const handX = useSharedValue(0);
  const [bars, setBars] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTicksRef = useRef(0);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
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
        height: Math.round(155 * scale),
        marginTop: Math.round(8 * scale),
        paddingVertical: Math.round(10 * scale),
      },
      signalDisplay: {
        height: Math.round(40 * scale),
        gap: Math.round(5 * scale),
      },
      bar: {
        width: Math.round(12 * scale),
      },
      holdBarContainer: {
        width: Math.round(92 * scale),
        height: Math.round(10 * scale),
      },
      handTrack: {
        width: Math.round(92 * scale),
        height: Math.round(60 * scale),
      },
    }),
    [scale]
  );
  const bar3Dist = 25 * scale;
  const bar2Dist = 45 * scale;
  const bar1Dist = 65 * scale;

  const stopHoldTimer = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    holdTicksRef.current = 0;
    setHoldProgress(0);
  };

  const handleSuccess = () => {
    hapticService.success();
    onSuccess();
    sweetSpotX.current = randomSweetSpot(clampRange);
    handX.value = withSpring(0);
    setBars(0);
    stopHoldTimer();
  };

  const startHoldTimer = () => {
    if (holdIntervalRef.current) return;
    holdIntervalRef.current = setInterval(() => {
      holdTicksRef.current += 1;
      const progress = holdTicksRef.current / HOLD_TICKS_REQUIRED;
      setHoldProgress(progress);
      if (holdTicksRef.current >= HOLD_TICKS_REQUIRED) {
        stopHoldTimer();
        handleSuccess();
      }
    }, TICK_MS);
  };

  const updatePosition = (x: number) => {
    const dist = Math.abs(x - sweetSpotX.current);
    let newBars = 0;
    if (dist < bar3Dist) newBars = 3;
    else if (dist < bar2Dist) newBars = 2;
    else if (dist < bar1Dist) newBars = 1;
    setBars(newBars);
    if (newBars === 3) startHoldTimer();
    else stopHoldTimer();
  };

  const resetPosition = () => {
    setBars(0);
    stopHoldTimer();
  };

  useEffect(() => {
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, []);

  useEffect(() => {
    sweetSpotX.current = randomSweetSpot(clampRange);
  }, [clampRange]);

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const clampedX = Math.max(-clampRange, Math.min(clampRange, e.translationX));
      handX.value = clampedX;
      runOnJS(updatePosition)(clampedX);
    })
    .onEnd(() => {
      handX.value = withSpring(0);
      runOnJS(resetPosition)();
    });

  const handAnimStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: handX.value }],
  }));

  return (
    <View style={[styles.container, scaledStyles.container]}>
      <View style={[styles.shelfTop, scaledStyles.shelfTop]}>
        <Text style={[styles.stationLabel, scaledStyles.stationLabel]}>RECEPTION</Text>
      </View>

      <View style={[styles.track, scaledStyles.track]}>
        {/* Signal bars display */}
        <View style={[styles.signalDisplay, scaledStyles.signalDisplay]}>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={[
                styles.bar,
                scaledStyles.bar,
                { height: Math.round((8 + n * 7) * scale) },
                bars >= n ? styles.barActive : styles.barInactive,
              ]}
            />
          ))}
        </View>

        {/* Hold progress bar */}
        <View style={[styles.holdBarContainer, scaledStyles.holdBarContainer]}>
          <View style={[styles.holdBarFill, { width: `${Math.round(holdProgress * 100)}%` }]} />
        </View>

        {/* Hand with phone */}
        <View style={[styles.handTrack, scaledStyles.handTrack]}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.hand, handAnimStyle]} testID="reception-hand">
              <HandWithPhoneSvg bars={bars} scale={scale} />
            </Animated.View>
          </GestureDetector>
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
  track: {
    width: 100,
    height: 140,
    backgroundColor: '#E8F5E8',
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: THEME.colors.outline,
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
    marginTop: 8,
  },
  signalDisplay: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 5,
    height: 36,
  },
  bar: {
    width: 12,
    borderRadius: 3,
  },
  barActive: {
    backgroundColor: THEME.colors.green,
  },
  barInactive: {
    backgroundColor: '#CCC',
  },
  holdBarContainer: {
    width: 80,
    height: 8,
    backgroundColor: 'rgba(0,0,0,0.12)',
    borderRadius: 4,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: THEME.colors.outline,
  },
  holdBarFill: {
    height: '100%',
    backgroundColor: THEME.colors.green,
    borderRadius: 4,
  },
  handTrack: {
    width: 80,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hand: {
    width: 44,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
