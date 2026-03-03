import React, { useRef, useMemo } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, Image } from 'react-native';
import { hapticService } from '../../services/hapticService';
import { THEME } from '../../assets/theme';
import { useUIScale } from '../../hooks/useUIScale';
import { STATION_PNGS } from '../../assets/png/stations';

interface SnackSorterProps {
  onSuccess: (snack: 'BAMBA' | 'BISLI') => void;
}

export const SnackSorter: React.FC<SnackSorterProps> = ({ onSuccess }) => {
  const pan = useRef(new Animated.ValueXY()).current;
  const { scale } = useUIScale();
  const stationScale = scale * 1.35;
  const swipeThreshold = 30 * stationScale;
  const scaledStyles = useMemo(
    () => ({
      container: {
        minWidth: Math.round(230 * stationScale),
        margin: Math.round(8 * stationScale),
        paddingBottom: Math.round(12 * stationScale),
      },
      shelfTop: {
        paddingVertical: Math.round(6 * stationScale),
      },
      stationLabel: {
        fontSize: Math.max(11, Math.round(12 * stationScale)),
      },
      sorterArea: {
        width: Math.round(230 * stationScale),
        height: Math.round(115 * stationScale),
        marginTop: Math.round(6 * stationScale),
        paddingHorizontal: Math.round(10 * stationScale),
      },
      sideLabel: {
        width: Math.round(50 * stationScale),
      },
      sideLabelText: {
        fontSize: Math.max(9, Math.round(10 * stationScale)),
      },
      arrowText: {
        fontSize: Math.max(14, Math.round(16 * stationScale)),
      },
      snackSize: {
        width: Math.round(60 * stationScale),
        height: Math.round(80 * stationScale),
      },
    }),
    [stationScale]
  );

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: Animated.event([null, { dx: pan.x, dy: pan.y }], {
        useNativeDriver: false,
      }),
      onPanResponderRelease: (e, gestureState) => {
        if (gestureState.dx > swipeThreshold) {
          hapticService.success();
          onSuccess('BAMBA');
        } else if (gestureState.dx < -swipeThreshold) {
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
    <View style={[styles.container, scaledStyles.container]}>
      <View style={[styles.shelfTop, scaledStyles.shelfTop]}>
        <Text style={[styles.stationLabel, scaledStyles.stationLabel]}>SNACKS</Text>
      </View>

      <View style={[styles.sorterArea, scaledStyles.sorterArea]}>
        {/* Left label */}
        <View style={[styles.sideLabel, scaledStyles.sideLabel]}>
          <Text style={[styles.sideLabelText, scaledStyles.sideLabelText]}>BISLI</Text>
          <Text style={[styles.arrowText, scaledStyles.arrowText]}>←</Text>
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
          <Image source={STATION_PNGS.snackBag} style={scaledStyles.snackSize} resizeMode="contain" />
        </Animated.View>

        {/* Right label */}
        <View style={[styles.sideLabel, scaledStyles.sideLabel]}>
          <Text style={[styles.arrowText, scaledStyles.arrowText]}>→</Text>
          <Text style={[styles.sideLabelText, scaledStyles.sideLabelText]}>BAMBA</Text>
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
