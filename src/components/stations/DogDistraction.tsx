import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';

interface DogDistractionProps {
  onSuccess: () => void;
}

export const DogDistraction: React.FC<DogDistractionProps> = ({ onSuccess }) => {
  const [taps, setTaps] = useState(0);
  const translateY = useSharedValue(0);

  useEffect(() => {
    translateY.value = withRepeat(
      withSequence(
        withTiming(-50, { duration: 500, easing: Easing.out(Easing.quad) }),
        withTiming(0, { duration: 500, easing: Easing.in(Easing.quad) })
      ),
      -1,
      true
    );
  }, []);

  const handleTap = () => {
    const nextTaps = taps + 1;
    if (nextTaps >= 4) {
      onSuccess();
      setTaps(0);
    } else {
      setTaps(nextTaps);
    }
  };

  const animatedBallStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  return (
    <View style={styles.container}>
      <View style={styles.court}>
        <Pressable testID="dog-ball" onPress={handleTap}>
          <Animated.View style={[styles.ball, animatedBallStyle]}>
            <Text style={styles.tapCount}>{taps > 0 ? 4 - taps : ''}</Text>
          </Animated.View>
        </Pressable>
      </View>
      <Text style={styles.title}>THROW BALL</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  court: {
    width: 100,
    height: 120,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#E8F5E9',
    borderRadius: 10,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#A5D6A7',
  },
  ball: {
    width: 40,
    height: 40,
    backgroundColor: '#FFEB3B',
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    marginBottom: 5,
  },
  tapCount: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  title: {
    marginTop: 10,
    fontWeight: 'bold',
  },
});
