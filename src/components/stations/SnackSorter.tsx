import React, { useRef } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated } from 'react-native';
import { hapticService } from '../../services/hapticService';
import { SnackBagSvg } from '../../assets/svg/stations/SnackBagSvg';
import { THEME } from '../../assets/theme';

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
          hapticService.success();
          onSuccess('BAMBA');
        } else if (gestureState.dx < -30) {
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
      <View style={styles.shelfTop}>
        <Text style={styles.stationLabel}>SNACKS</Text>
      </View>

      <View style={styles.sorterArea}>
        {/* Left label */}
        <View style={styles.sideLabel}>
          <Text style={styles.sideLabelText}>BISLI</Text>
          <Text style={styles.arrowText}>←</Text>
        </View>

        {/* Draggable snack bag */}
        <Animated.View
          testID="snack-sorter"
          style={[
            styles.snackBag,
            { transform: [{ translateX: pan.x }, { translateY: pan.y }] },
          ]}
          {...panResponder.panHandlers}
        >
          <SnackBagSvg type="SNACK" width={52} height={70} />
        </Animated.View>

        {/* Right label */}
        <View style={styles.sideLabel}>
          <Text style={styles.arrowText}>→</Text>
          <Text style={styles.sideLabelText}>BAMBA</Text>
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
    minWidth: 200,
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
  sorterArea: {
    flexDirection: 'row',
    width: 200,
    height: 100,
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 8,
    marginTop: 6,
  },
  snackBag: {
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
  },
  sideLabel: {
    alignItems: 'center',
    width: 44,
  },
  sideLabelText: {
    fontSize: 9,
    fontWeight: 'bold',
    color: THEME.colors.outline,
  },
  arrowText: {
    fontSize: 14,
    color: THEME.colors.woodDark,
    fontWeight: 'bold',
  },
});
