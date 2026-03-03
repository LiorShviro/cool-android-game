import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
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
import { THEME } from '../../assets/theme';
import { useUIScale } from '../../hooks/useUIScale';
import { STATION_PNGS } from '../../assets/png/stations';

interface ChargingStationProps {
  onSuccess: () => void;
}

export const ChargingStation: React.FC<ChargingStationProps> = ({ onSuccess }) => {
  const { scale } = useUIScale();
  const stationScale = scale * 1.15;
  const phoneRange = 50 * stationScale;
  const phoneX = useSharedValue(-phoneRange);
  const plugX = useSharedValue(0);
  const plugY = useSharedValue(0);
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
        height: Math.round(150 * stationScale),
        paddingVertical: Math.round(14 * stationScale),
        marginTop: Math.round(8 * stationScale),
      },
      phone: {
        width: Math.round(38 * stationScale),
        height: Math.round(52 * stationScale),
      },
      plug: {
        width: Math.round(30 * stationScale),
        height: Math.round(38 * stationScale),
      },
    }),
    [stationScale]
  );
  const successDist = 40 * stationScale;
  const yThreshold = -25 * stationScale;

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
          <Image source={STATION_PNGS.chargePhone} style={styles.phoneImage} resizeMode="contain" />
        </Animated.View>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.plug, scaledStyles.plug, plugAnimStyle]} testID="charging-plug">
            <Image source={STATION_PNGS.chargePlug} style={styles.plugImage} resizeMode="contain" />
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
  phoneImage: {
    width: '100%',
    height: '100%',
  },
  plug: {
    width: 30,
    height: 38,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plugImage: {
    width: '100%',
    height: '100%',
  },
});
