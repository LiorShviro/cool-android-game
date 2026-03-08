import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  PanResponder,
  Dimensions,
  Animated,
} from 'react-native';
import { BACKGROUND_PNGS } from '../assets/png/backgrounds';
import { OBSTACLE_PNGS, RUNNER_PNG } from '../assets/png/obstacles';
import { THEME } from '../assets/theme';

const LANES = 5;
const OBSTACLE_KEYS = Object.keys(OBSTACLE_PNGS) as (keyof typeof OBSTACLE_PNGS)[];
const BREAK_DURATION_MS = 15000;
const OBSTACLE_SPAWN_INTERVAL = 900;
const OBSTACLE_FALL_DURATION = 2000;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const LANE_WIDTH = SCREEN_WIDTH / LANES;
const RUNNER_SIZE = 72;
const OBSTACLE_SIZE = 56;
const PLAYER_Y = SCREEN_HEIGHT - RUNNER_SIZE - 80;

interface ObstacleData {
  id: string;
  lane: number;
  obsKey: string;
  yAnim: Animated.Value;
}

interface Props {
  onComplete: (survived: boolean) => void;
}

const FallingObstacle: React.FC<{ obstacle: ObstacleData; onOffScreen: (id: string) => void }> = ({
  obstacle,
  onOffScreen,
}) => {
  useEffect(() => {
    Animated.timing(obstacle.yAnim, {
      toValue: SCREEN_HEIGHT,
      duration: OBSTACLE_FALL_DURATION,
      useNativeDriver: true,
    }).start(({ finished }) => {
      if (finished) onOffScreen(obstacle.id);
    });
  }, []);

  const left = obstacle.lane * LANE_WIDTH + (LANE_WIDTH - OBSTACLE_SIZE) / 2;

  return (
    <Animated.View style={[styles.obstacle, { left, transform: [{ translateY: obstacle.yAnim }] }]}>
      <Image
        source={OBSTACLE_PNGS[obstacle.obsKey as keyof typeof OBSTACLE_PNGS]}
        style={{ width: OBSTACLE_SIZE, height: OBSTACLE_SIZE }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

export const BathroomBreak: React.FC<Props> = ({ onComplete }) => {
  const [playerLane, setPlayerLane] = useState(2);
  const [obstacles, setObstacles] = useState<ObstacleData[]>([]);
  const [timeLeft, setTimeLeft] = useState(BREAK_DURATION_MS / 1000);
  const [hits, setHits] = useState(0);

  const playerLaneRef = useRef(2);
  const obstaclesRef = useRef<ObstacleData[]>([]);
  const hitsRef = useRef(0);
  const completedRef = useRef(false);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const collisionRef = useRef<NodeJS.Timeout | null>(null);

  const complete = useCallback(
    (survived: boolean) => {
      if (completedRef.current) return;
      completedRef.current = true;
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (collisionRef.current) clearInterval(collisionRef.current);
      onComplete(survived);
    },
    [onComplete]
  );

  // Countdown
  useEffect(() => {
    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          complete(true);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [complete]);

  // Obstacle spawning
  useEffect(() => {
    spawnIntervalRef.current = setInterval(() => {
      const lane = Math.floor(Math.random() * LANES);
      const obsKey = OBSTACLE_KEYS[Math.floor(Math.random() * OBSTACLE_KEYS.length)];
      const newObs: ObstacleData = {
        id: Math.random().toString(36).substring(7),
        lane,
        obsKey,
        yAnim: new Animated.Value(-OBSTACLE_SIZE),
      };
      obstaclesRef.current = [...obstaclesRef.current, newObs];
      setObstacles((prev) => [...prev, newObs]);
    }, OBSTACLE_SPAWN_INTERVAL);
    return () => { if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current); };
  }, []);

  // Collision detection: poll obstacle y values via listener
  useEffect(() => {
    collisionRef.current = setInterval(() => {
      const toRemove: string[] = [];
      obstaclesRef.current.forEach((obs) => {
        if (obs.lane !== playerLaneRef.current) return;
        // @ts-ignore — _value is internal but stable
        const y = obs.yAnim._value as number;
        if (y >= PLAYER_Y - 40 && y <= PLAYER_Y + 40) {
          toRemove.push(obs.id);
          hitsRef.current += 1;
          setHits(hitsRef.current);
          if (hitsRef.current >= 3) {
            complete(false);
          }
        }
      });
      if (toRemove.length > 0) {
        const hitSet = new Set(toRemove);
        obstaclesRef.current = obstaclesRef.current.filter((o) => !hitSet.has(o.id));
        setObstacles((prev) => prev.filter((o) => !hitSet.has(o.id)));
      }
    }, 80);
    return () => { if (collisionRef.current) clearInterval(collisionRef.current); };
  }, [complete]);

  const removeObstacle = useCallback((id: string) => {
    obstaclesRef.current = obstaclesRef.current.filter((o) => o.id !== id);
    setObstacles((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gs) => {
        // Real-time lane change as user drags
        const laneDelta = Math.round(gs.dx / LANE_WIDTH);
        if (laneDelta === 0) return;
        setPlayerLane((prev) => {
          const next = Math.min(LANES - 1, Math.max(0, prev + laneDelta));
          playerLaneRef.current = next;
          return next;
        });
      },
    })
  ).current;

  const playerLeft = playerLane * LANE_WIDTH + (LANE_WIDTH - RUNNER_SIZE) / 2;
  const heartsLeft = Math.max(0, 3 - hits);
  const timerColor = timeLeft <= 5 ? THEME.colors.red : THEME.colors.yellow;

  return (
    <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
      <Image source={BACKGROUND_PNGS.corridor} style={StyleSheet.absoluteFillObject} resizeMode="cover" />

      {/* Dim overlay so text is readable */}
      <View style={styles.dimOverlay} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BATHROOM BREAK!</Text>
        <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>
        <Text style={styles.livesText}>
          {'❤️'.repeat(heartsLeft)}{'🖤'.repeat(3 - heartsLeft)}
        </Text>
      </View>

      <Text style={styles.hint}>Drag left/right to dodge!</Text>

      {/* Lane dividers */}
      {Array.from({ length: LANES - 1 }, (_, i) => (
        <View key={i} style={[styles.laneDivider, { left: (i + 1) * LANE_WIDTH }]} />
      ))}

      {/* Falling obstacles */}
      {obstacles.map((obs) => (
        <FallingObstacle key={obs.id} obstacle={obs} onOffScreen={removeObstacle} />
      ))}

      {/* Player */}
      <View style={[styles.runner, { left: playerLeft }]}>
        <Image source={RUNNER_PNG} style={{ width: RUNNER_SIZE, height: RUNNER_SIZE }} resizeMode="contain" />
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Survive → +500 bonus points!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  header: {
    position: 'absolute',
    top: 52,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    letterSpacing: 1,
  },
  timerText: {
    fontSize: 40,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  livesText: {
    fontSize: 22,
    marginTop: 4,
  },
  hint: {
    position: 'absolute',
    top: 180,
    left: 0,
    right: 0,
    textAlign: 'center',
    color: 'rgba(255,255,255,0.75)',
    fontSize: 15,
    fontWeight: 'bold',
    zIndex: 10,
  },
  laneDivider: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  obstacle: {
    position: 'absolute',
    top: 0,
  },
  runner: {
    position: 'absolute',
    top: PLAYER_Y,
  },
  footer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  footerText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
