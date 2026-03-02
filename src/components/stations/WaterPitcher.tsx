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
import { CupSvg } from '../../assets/svg/stations/CupSvg';
import { THEME } from '../../assets/theme';

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
      1.5,
      { duration: 3000, easing: Easing.linear }
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

  return (
    <View style={styles.container}>
      {/* Station label shelf */}
      <View style={styles.shelfTop}>
        <Text style={styles.stationLabel}>WATER</Text>
      </View>

      {/* Cup visual */}
      <View style={styles.cupWrapper}>
        <CupSvg fillProgress={fillProgress} isOverfilled={isLocked} />
        {isLocked && (
          <View style={styles.lockOverlay}>
            <Text style={styles.lockText}>LOCKED</Text>
          </View>
        )}
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
        <Text style={styles.buttonText}>{isLocked ? 'WIPING...' : 'POUR'}</Text>
      </Pressable>
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
  cupWrapper: {
    marginVertical: 8,
    position: 'relative',
  },
  lockOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255, 68, 68, 0.35)',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 6,
  },
  lockText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    backgroundColor: THEME.colors.blue,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: THEME.borderRadius.pill,
    borderWidth: 2,
    borderColor: THEME.colors.outline,
    alignItems: 'center',
  },
  buttonPressed: {
    backgroundColor: THEME.colors.blueDark,
    transform: [{ scale: 0.95 }],
  },
  buttonLocked: {
    backgroundColor: '#999',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 11,
  },
});
