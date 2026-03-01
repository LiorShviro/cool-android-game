import React, { useEffect } from 'react';
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

interface ChargingStationProps {
  onSuccess: () => void;
}

export const ChargingStation: React.FC<ChargingStationProps> = ({ onSuccess }) => {
  const phoneX = useSharedValue(-50);
  const plugX = useSharedValue(0);
  const plugY = useSharedValue(0);

  useEffect(() => {
    phoneX.value = withRepeat(
      withTiming(50, { duration: 2500, easing: Easing.linear }),
      -1,
      true,
    );
  }, [phoneX]);

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
      if (dist < 40 && plugY.value < -25) {
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
    <View style={styles.container}>
      <View style={styles.track}>
        <Animated.View style={[styles.phone, phoneAnimStyle]}>
          <Text style={styles.phoneIcon}>📱</Text>
        </Animated.View>
        <GestureDetector gesture={panGesture}>
          <Animated.View style={[styles.plug, plugAnimStyle]} testID="charging-plug">
            <Text style={styles.plugIcon}>🔌</Text>
          </Animated.View>
        </GestureDetector>
      </View>
      <Text style={styles.title}>CHARGE</Text>
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
    backgroundColor: '#FFF9C4',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F9A825',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    overflow: 'hidden',
  },
  phone: {
    width: 40,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneIcon: {
    fontSize: 28,
  },
  plug: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  plugIcon: {
    fontSize: 24,
  },
  title: {
    marginTop: 8,
    fontWeight: 'bold',
    fontSize: 12,
  },
});
