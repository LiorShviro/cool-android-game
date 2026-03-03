import React, { useEffect, useRef, useState, useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  runOnJS,
} from 'react-native-reanimated';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { hapticService } from '../../services/hapticService';
import { THEME } from '../../assets/theme';
import { useUIScale } from '../../hooks/useUIScale';
import { STATION_PNGS } from '../../assets/png/stations';

interface ReceptionHunterProps {
  onSuccess: () => void;
}

const randomSweetSpot = (range: number) => Math.random() * (range * 2) - range;
const HOLD_TICKS_REQUIRED = 20;
const TICK_MS = 50;

export const ReceptionHunter: React.FC<ReceptionHunterProps> = ({ onSuccess }) => {
  const { scale } = useUIScale();
  const stationScale = scale * 1.35;
  const clampRange = 60 * stationScale;
  const sweetSpotX = useRef(randomSweetSpot(clampRange));
  const handX = useSharedValue(0);
  const [bars, setBars] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTicksRef = useRef(0);
  const holdIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const scaledStyles = useMemo(
    () => ({
      container: {
        minWidth: Math.round(130 * stationScale),
        margin: Math.round(8 * stationScale),
        paddingBottom: Math.round(12 * stationScale),
      },
      shelfTop: {
        paddingVertical: Math.round(6 * stationScale),
      },
      stationLabel: {
        fontSize: Math.max(11, Math.round(12 * stationScale)),
      },
      track: {
        width: Math.round(120 * stationScale),
        height: Math.round(155 * stationScale),
        marginTop: Math.round(8 * stationScale),
        paddingVertical: Math.round(10 * stationScale),
      },
      signalDisplay: {
        height: Math.round(40 * stationScale),
        gap: Math.round(5 * stationScale),
      },
      bar: {
        width: Math.round(12 * stationScale),
      },
      holdBarContainer: {
        width: Math.round(92 * stationScale),
        height: Math.round(10 * stationScale),
      },
      handTrack: {
        width: Math.round(92 * stationScale),
        height: Math.round(60 * stationScale),
      },
      handImage: {
        width: Math.round(44 * stationScale),
        height: Math.round(50 * stationScale),
      },
    }),
    [stationScale]
  );
  const bar3Dist = 25 * stationScale;
  const bar2Dist = 45 * stationScale;
  const bar1Dist = 65 * stationScale;

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
              <Image source={STATION_PNGS.receptionHandPhone} style={scaledStyles.handImage} resizeMode="contain" />
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
