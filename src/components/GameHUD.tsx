import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Svg, { Rect } from 'react-native-svg';
import { useGameStore } from '../store/gameStore';
import { RocketHUD } from './RocketHUD';
import { THEME } from '../assets/theme';

const PauseButtonSvg: React.FC = () => (
  <Svg width={36} height={36} viewBox="0 0 36 36">
    <Rect x={0} y={0} width={36} height={36} rx={18} fill={THEME.colors.wall} stroke={THEME.colors.outline} strokeWidth={2} />
    <Rect x={11} y={10} width={5} height={16} rx={2.5} fill={THEME.colors.outline} />
    <Rect x={20} y={10} width={5} height={16} rx={2.5} fill={THEME.colors.outline} />
  </Svg>
);

export const GameHUD: React.FC = () => {
  const { score, comboStreak, togglePause } = useGameStore();
  const multiplier = Math.min(3, Math.floor(comboStreak / 2) + 1);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <RocketHUD />

        {/* Score badge */}
        <View style={styles.scoreBadge}>
          <Svg width={90} height={44} viewBox="0 0 90 44" style={StyleSheet.absoluteFill}>
            <Rect x={2} y={2} width={86} height={40} rx={14} fill={THEME.colors.orange} stroke={THEME.colors.outline} strokeWidth={2.5} />
            <Rect x={2} y={2} width={86} height={20} rx={14} fill={THEME.colors.orangeLight} opacity={0.4} />
          </Svg>
          <Text style={styles.scoreText}>{score}</Text>
          {multiplier > 1 && (
            <Text style={styles.multiplierText}>x{multiplier}</Text>
          )}
        </View>

        <TouchableOpacity
          testID="pause-button"
          onPress={togglePause}
          activeOpacity={0.7}
        >
          <PauseButtonSvg />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scoreBadge: {
    width: 90,
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  multiplierText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: THEME.colors.yellow,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 1,
    position: 'absolute',
    right: 6,
    top: 4,
  },
});
