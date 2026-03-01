import React, { useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { hapticService } from '../../services/hapticService';

interface SnackSorterProps {
  onSuccess: (snack: 'BAMBA' | 'BISLI') => void;
}

export const SnackSorter: React.FC<SnackSorterProps> = ({ onSuccess }) => {
  const pan = useRef(new Animated.ValueXY()).current;

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > 30) {
          // Swipe Right
          hapticService.success();
          onSuccess('BAMBA');
        } else if (gestureState.dx < -30) {
          // Swipe Left
          hapticService.success();
          onSuccess('BISLI');
        } else {
          hapticService.light();
        }

        Animated.spring(pan, {
          toValue: { x: 0, y: 0 },
          useNativeDriver: false,
        }).start();
      },
    })
  ).current;

  return (
    <View style={styles.container}>
      <View style={styles.sorterArea}>
        <Animated.View
          testID="snack-sorter"
          style={[
            styles.snackBag,
            {
              transform: [{ translateX: pan.x }, { translateY: pan.y }],
            },
          ]}
          {...panResponder.panHandlers}
        >
          <Text style={styles.snackText}>SNACK</Text>
        </Animated.View>
      </View>
      <View style={styles.labels}>
        <Text style={styles.label}>BISLI (L)</Text>
        <Text style={styles.label}>BAMBA (R)</Text>
      </View>
      <Text style={styles.title}>SNACKS</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    margin: 10,
  },
  sorterArea: {
    width: 200,
    height: 100,
    backgroundColor: '#F0F0F0',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#CCC',
    borderStyle: 'dashed',
  },
  snackBag: {
    width: 60,
    height: 80,
    backgroundColor: '#FFBB33',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 2,
  },
  snackText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: 200,
    marginTop: 5,
  },
  label: {
    fontSize: 10,
    color: '#666',
  },
  title: {
    marginTop: 10,
    fontWeight: 'bold',
  },
});
