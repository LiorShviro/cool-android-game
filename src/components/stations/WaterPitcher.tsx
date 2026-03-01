import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { hapticService } from '../../services/hapticService';

interface WaterPitcherProps {
  onSuccess: () => void;
}

export const WaterPitcher: React.FC<WaterPitcherProps> = ({ onSuccess }) => {
  const [isLocked, setIsLocked] = useState(false);
  const fillProgress = useSharedValue(0);
  const lockTimerRef = useRef<NodeJS.Timeout | null>(null);

  const handlePressIn = () => {
    if (isLocked) return;
    
    hapticService.light();
    fillProgress.value = 0;
    fillProgress.value = withTiming(
      1.5, // Allow overfilling up to 150%
      {
        duration: 3000, // 2s for 100%, 3s for 150%
        easing: Easing.linear,
      }
    );
  };

  const handlePressOut = () => {
    if (isLocked) return;

    const finalFill = fillProgress.value;
    cancelAnimation(fillProgress);

    if (finalFill >= 0.65 && finalFill <= 1.2) {
      hapticService.success();
      onSuccess();
      fillProgress.value = withTiming(0, { duration: 500 });
    } else if (finalFill > 1.2) {
      hapticService.error();
      triggerLock();
    } else {
      // Too early - just reset
      hapticService.warning();
      fillProgress.value = withTiming(0, { duration: 300 });
    }
  };

  const triggerLock = () => {
    setIsLocked(true);
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    
    lockTimerRef.current = setTimeout(() => {
      setIsLocked(false);
      fillProgress.value = 0;
    }, 1500);
  };

  const animatedWaterStyle = useAnimatedStyle(() => {
    return {
      height: `${Math.min(100, fillProgress.value * 100)}%`,
      backgroundColor: fillProgress.value > 1.2 ? '#FF4444' : '#33b5e5',
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.pitcherContainer}>
        <View style={styles.cup}>
          <Animated.View style={[styles.water, animatedWaterStyle]} />
          {isLocked && (
            <View style={styles.lockOverlay}>
              <Text style={styles.lockText}>LOCKED</Text>
            </View>
          )}
        </View>
      </View>
      <Pressable
        testID="water-pitcher-pressable"
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.button,
          pressed && !isLocked && styles.buttonPressed,
          isLocked && styles.buttonLocked,
        ]}
        disabled={isLocked}
      >
        <Text style={styles.buttonText}>{isLocked ? 'WIPING...' : 'WATER'}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  pitcherContainer: {
    width: 80,
    height: 100,
    justifyContent: 'flex-end',
    marginBottom: 10,
  },
  cup: {
    width: 60,
    height: 80,
    borderWidth: 3,
    borderColor: '#333',
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#FFF',
    justifyContent: 'flex-end',
    alignSelf: 'center',
  },
  water: {
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 68, 68, 0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  lockText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
  button: {
    backgroundColor: '#33b5e5',
    padding: 15,
    borderRadius: 30,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: '#0099cc',
    transform: [{ scale: 0.95 }],
  },
  buttonLocked: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
