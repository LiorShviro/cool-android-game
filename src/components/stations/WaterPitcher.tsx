import React, { useState, useRef, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, Image } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, cancelAnimation, Easing } from 'react-native-reanimated';
import { hapticService } from '../../services/hapticService';
import { THEME } from '../../assets/theme';
import { useUIScale } from '../../hooks/useUIScale';
import { STATION_PNGS } from '../../assets/png/stations';

interface WaterPitcherProps {
  onSuccess: () => void;
}

const CupPng: React.FC<{ fillProgress: ReturnType<typeof useSharedValue>; scale: number }> = ({
  fillProgress,
  scale,
}) => {
  const width = Math.round(90 * scale);
  const height = Math.round(126 * scale);
  const waterHeightMax = Math.round(98 * scale);
  const waterInset = Math.round(7 * scale);

  const waterStyle = useAnimatedStyle(() => {
    const pct = Math.min(1, fillProgress.value / 1.5);
    const waterHeight = Math.max(0, pct * waterHeightMax);
    return {
      height: waterHeight,
      backgroundColor: fillProgress.value > 1.2 ? '#FF4444' : '#33b5e5',
    };
  });

  return (
    <View style={[styles.cupContainer, { width, height }]}>
      <View
        style={[
          styles.waterContainer,
          { left: waterInset, right: waterInset, height: waterHeightMax, bottom: Math.round(8 * scale) },
        ]}
      >
        <Animated.View style={[styles.water, waterStyle]} />
      </View>
      <View style={styles.fillTrack}>
        <Animated.View style={[styles.fillBar, waterStyle]} />
      </View>
      <Image source={STATION_PNGS.waterCupBase} style={StyleSheet.absoluteFill} resizeMode="contain" />
    </View>
  );
};

export const WaterPitcher: React.FC<WaterPitcherProps> = ({ onSuccess }) => {
  const [isLocked, setIsLocked] = useState(false);
  const fillProgress = useSharedValue(0);
  const lockTimerRef = useRef<NodeJS.Timeout | null>(null);
  const { scale } = useUIScale();
  const stationScale = scale * 1.15;
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
      button: {
        paddingVertical: Math.round(9 * stationScale),
        paddingHorizontal: Math.round(16 * stationScale),
      },
      buttonText: {
        fontSize: Math.max(11, Math.round(12 * stationScale)),
      },
      lockText: {
        fontSize: Math.max(11, Math.round(12 * stationScale)),
      },
    }),
    [stationScale]
  );

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
    <View style={[styles.container, scaledStyles.container]}>
      {/* Station label shelf */}
      <View style={[styles.shelfTop, scaledStyles.shelfTop]}>
        <Text style={[styles.stationLabel, scaledStyles.stationLabel]}>WATER</Text>
      </View>

      {/* Cup visual */}
      <View style={styles.cupWrapper}>
        <CupPng fillProgress={fillProgress} scale={stationScale} />
        {isLocked && (
          <View style={styles.lockOverlay}>
            <Text style={[styles.lockText, scaledStyles.lockText]}>LOCKED</Text>
          </View>
        )}
      </View>

      <Pressable
        testID="water-pitcher-pressable"
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        style={({ pressed }) => [
          styles.button,
          scaledStyles.button,
          pressed && !isLocked && styles.buttonPressed,
          isLocked && styles.buttonLocked,
        ]}
        disabled={isLocked}
      >
        <Text style={[styles.buttonText, scaledStyles.buttonText]}>{isLocked ? 'WIPING...' : 'POUR'}</Text>
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
  cupContainer: {
    backgroundColor: 'transparent',
    borderBottomLeftRadius: 8,
    borderBottomRightRadius: 8,
    overflow: 'visible',
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
  fillTrack: {
    position: 'absolute',
    right: 6,
    bottom: 10,
    width: 10,
    height: 88,
    borderRadius: 6,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderWidth: 2,
    borderColor: '#222',
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  fillBar: {
    width: '100%',
    borderRadius: 4,
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
