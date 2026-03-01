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

interface ReceptionHunterProps {
  onSuccess: () => void;
}

const randomSweetSpot = () => Math.random() * 120 - 60;

const HOLD_TICKS_REQUIRED = 40; // 40 * 50ms = 2s
const TICK_MS = 50;

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
    if (dist < 15) newBars = 3;
    else if (dist < 35) newBars = 2;
    else if (dist < 55) newBars = 1;
    setBars(newBars);

    if (newBars === 3) {
      startHoldTimer();
    } else {
      stopHoldTimer();
    }
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
      <View style={styles.track}>
        <View style={styles.signalBars}>
          {[1, 2, 3].map((n) => (
            <View
              key={n}
              style={[
                styles.bar,
                { height: 8 + n * 6 },
                bars >= n ? styles.barActive : styles.barInactive,
              ]}
            />
          ))}
        </View>
        <View style={styles.handTrack}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.hand, handAnimStyle]} testID="reception-hand">
              <Text style={styles.handIcon}>✋</Text>
            </Animated.View>
          </GestureDetector>
        </View>
        <View style={styles.holdBarContainer}>
          <View
            style={[styles.holdBarFill, { width: `${Math.round(holdProgress * 100)}%` }]}
          />
        </View>
      </View>
      <Text style={styles.title}>RECEPTION</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  track: {
    width: 100,
    height: 140,
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#A5D6A7',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
  signalBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 4,
    height: 30,
  },
  bar: {
    width: 10,
    borderRadius: 2,
  },
  barActive: {
    backgroundColor: '#00C851',
  },
  barInactive: {
    backgroundColor: '#CCC',
  },
  handTrack: {
    width: 80,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hand: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  handIcon: {
    fontSize: 22,
  },
  holdBarContainer: {
    width: 80,
    height: 8,
    backgroundColor: '#CCC',
    borderRadius: 4,
    overflow: 'hidden',
  },
  holdBarFill: {
    height: '100%',
    backgroundColor: '#00C851',
    borderRadius: 4,
  },
  title: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
