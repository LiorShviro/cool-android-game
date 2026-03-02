import React, { useEffect, useRef, useState } from 'react';
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

interface ReceptionHunterProps {
  onSuccess: () => void;
}

const randomSweetSpot = () => Math.random() * 120 - 60;
const HOLD_TICKS_REQUIRED = 20;
const TICK_MS = 50;

const HandWithPhoneSvg: React.FC<{ bars: number }> = ({ bars }) => (
  <Svg width={44} height={50} viewBox="0 0 44 50">
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
  const sweetSpotX = useRef(randomSweetSpot());
  const handX = useSharedValue(0);
  const [bars, setBars] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTicksRef = useRef(0);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);

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
    sweetSpotX.current = randomSweetSpot();
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
    if (dist < 25) newBars = 3;
    else if (dist < 45) newBars = 2;
    else if (dist < 65) newBars = 1;
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

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const clampedX = Math.max(-60, Math.min(60, e.translationX));
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
    <View style={styles.container}>
      <View style={styles.shelfTop}>
        <Text style={styles.stationLabel}>RECEPTION</Text>
      </View>

      <View style={styles.track}>
        {/* Signal bars display */}
        <View style={styles.signalDisplay}>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={[
                styles.bar,
                { height: 8 + n * 7 },
                bars >= n ? styles.barActive : styles.barInactive,
              ]}
            />
          ))}
        </View>

        {/* Hold progress bar */}
        <View style={styles.holdBarContainer}>
          <View style={[styles.holdBarFill, { width: `${Math.round(holdProgress * 100)}%` }]} />
        </View>

        {/* Hand with phone */}
        <View style={styles.handTrack}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.hand, handAnimStyle]} testID="reception-hand">
              <HandWithPhoneSvg bars={bars} />
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
