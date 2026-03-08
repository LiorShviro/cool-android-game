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
import { ITEM_PNGS, BACKPACK_PNG } from '../assets/png/items';
import { SUPPLY_RUN_ITEMS } from '../constants/gameConstants';
import { useGameStore } from '../store/gameStore';
import { THEME } from '../assets/theme';

const LANES = 5;
const RUN_DURATION_MS = 13000;
const ANNOUNCE_DURATION_MS = 2000;
const ITEM_SPAWN_INTERVAL = 800;
const ITEM_FALL_DURATION = 3800;

const { height: SCREEN_HEIGHT, width: SCREEN_WIDTH } = Dimensions.get('window');
const LANE_WIDTH = SCREEN_WIDTH / LANES;
const BACKPACK_SIZE = 72;
const ITEM_SIZE = 56;
const PLAYER_Y = SCREEN_HEIGHT - BACKPACK_SIZE - 80;

interface FallingItem {
  id: string;
  itemKey: string;
  lane: number;
  yAnim: Animated.Value;
}

interface Props {
  onComplete: (caught: boolean) => void;
}

const FallingItemView: React.FC<{
  item: FallingItem;
  onOffScreen: (id: string) => void;
}> = ({ item, onOffScreen }) => {
  useEffect(() => {
    Animated.timing(item.yAnim, {
      toValue: SCREEN_HEIGHT,
      duration: ITEM_FALL_DURATION,
      useNativeDriver: false,
    }).start(({ finished }) => {
      if (finished) onOffScreen(item.id);
    });
  }, []);

  const left = item.lane * LANE_WIDTH + (LANE_WIDTH - ITEM_SIZE) / 2;

  return (
    <Animated.View style={[styles.fallingItem, { left, transform: [{ translateY: item.yAnim }] }]}>
      <Image
        source={ITEM_PNGS[item.itemKey]}
        style={{ width: ITEM_SIZE, height: ITEM_SIZE }}
        resizeMode="contain"
      />
    </Animated.View>
  );
};

export const SupplyRun: React.FC<Props> = ({ onComplete }) => {
  const { decrementLives } = useGameStore();

  const targetItem = useRef(SUPPLY_RUN_ITEMS[Math.floor(Math.random() * SUPPLY_RUN_ITEMS.length)]).current;

  const arrowOpacity = useRef(new Animated.Value(1)).current;
  const hasSwiped = useRef(false);

  const [phase, setPhase] = useState<'announce' | 'run'>('announce');
  const [playerLane, setPlayerLane] = useState(2);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(RUN_DURATION_MS / 1000);

  const playerLaneRef = useRef(2);
  const fallingItemsRef = useRef<FallingItem[]>([]);
  const completedRef = useRef(false);
  const spawnIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const collisionRef = useRef<NodeJS.Timeout | null>(null);

  const complete = useCallback(
    (caught: boolean) => {
      if (completedRef.current) return;
      completedRef.current = true;
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (collisionRef.current) clearInterval(collisionRef.current);
      onComplete(caught);
    },
    [onComplete]
  );

  // Pulse the swipe arrows until first swipe
  useEffect(() => {
    const anim = Animated.loop(
      Animated.sequence([
        Animated.timing(arrowOpacity, { toValue: 0.25, duration: 500, useNativeDriver: true }),
        Animated.timing(arrowOpacity, { toValue: 1.0, duration: 500, useNativeDriver: true }),
      ])
    );
    anim.start();
    return () => anim.stop();
  }, [arrowOpacity]);

  // Announcement phase — transition to run after 2s
  useEffect(() => {
    const timer = setTimeout(() => setPhase('run'), ANNOUNCE_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  // Countdown (only during run phase)
  useEffect(() => {
    if (phase !== 'run') return;
    countdownRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) {
          complete(false);
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [phase, complete]);

  // Item spawning (only during run phase)
  useEffect(() => {
    if (phase !== 'run') return;
    spawnIntervalRef.current = setInterval(() => {
      const lane = Math.floor(Math.random() * LANES);
      const randomItem = SUPPLY_RUN_ITEMS[Math.floor(Math.random() * SUPPLY_RUN_ITEMS.length)];
      const newItem: FallingItem = {
        id: Math.random().toString(36).substring(7),
        itemKey: randomItem.key,
        lane,
        yAnim: new Animated.Value(-ITEM_SIZE),
      };
      fallingItemsRef.current = [...fallingItemsRef.current, newItem];
      setFallingItems((prev) => [...prev, newItem]);
    }, ITEM_SPAWN_INTERVAL);
    return () => { if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current); };
  }, [phase]);

  // Collision detection: poll item y values
  useEffect(() => {
    if (phase !== 'run') return;
    collisionRef.current = setInterval(() => {
      const toRemove: string[] = [];
      fallingItemsRef.current.forEach((item) => {
        if (item.lane !== playerLaneRef.current) return;
        // @ts-ignore — _value is internal but stable
        const y = item.yAnim._value as number;
        if (y >= PLAYER_Y - 40 && y <= PLAYER_Y + 40) {
          toRemove.push(item.id);
          if (item.itemKey === targetItem.key) {
            complete(true);
          } else {
            decrementLives();
            complete(false);
          }
        }
      });
      if (toRemove.length > 0) {
        const hitSet = new Set(toRemove);
        fallingItemsRef.current = fallingItemsRef.current.filter((o) => !hitSet.has(o.id));
        setFallingItems((prev) => prev.filter((o) => !hitSet.has(o.id)));
      }
    }, 80);
    return () => { if (collisionRef.current) clearInterval(collisionRef.current); };
  }, [phase, complete, decrementLives, targetItem.key]);

  const removeItem = useCallback((id: string) => {
    fallingItemsRef.current = fallingItemsRef.current.filter((o) => o.id !== id);
    setFallingItems((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const startLaneRef = useRef(2);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        startLaneRef.current = playerLaneRef.current;
      },
      onPanResponderMove: (_, gs) => {
        if (!hasSwiped.current && Math.abs(gs.dx) > 10) {
          hasSwiped.current = true;
          Animated.timing(arrowOpacity, { toValue: 0, duration: 300, useNativeDriver: true }).start();
        }
        const next = Math.min(LANES - 1, Math.max(0, startLaneRef.current + Math.round(gs.dx / LANE_WIDTH)));
        playerLaneRef.current = next;
        setPlayerLane(next);
      },
    })
  ).current;

  const playerLeft = playerLane * LANE_WIDTH + (LANE_WIDTH - BACKPACK_SIZE) / 2;
  const timerColor = timeLeft <= 5 ? THEME.colors.red : THEME.colors.yellow;

  if (phase === 'announce') {
    return (
      <View style={StyleSheet.absoluteFill} testID="supply-run-announce">
        <Image source={BACKGROUND_PNGS.supplyRun} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
        <View style={styles.dimOverlay} />
        <View style={styles.announceContainer}>
          <Text style={styles.announceTitle}>האזעקה הפסיקה!</Text>
          <Text style={styles.announceSubtitle}>מהר! תתפוס את...</Text>
          <View style={styles.targetBadge}>
            <Image
              source={ITEM_PNGS[targetItem.key]}
              style={{ width: 100, height: 100 }}
              resizeMode="contain"
            />
            <Text style={styles.targetName}>{targetItem.displayName}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers} testID="supply-run-game">
      <Image source={BACKGROUND_PNGS.supplyRun} style={StyleSheet.absoluteFillObject} resizeMode="cover" />
      <View style={styles.dimOverlay} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SUPPLY RUN!</Text>
        <Text style={[styles.timerText, { color: timerColor }]}>{timeLeft}s</Text>
        <View style={styles.targetRow}>
          <Text style={styles.targetLabel}>תתפוס: </Text>
          <Image
            source={ITEM_PNGS[targetItem.key]}
            style={{ width: 32, height: 32 }}
            resizeMode="contain"
          />
          <Text style={styles.targetLabel}> {targetItem.displayName}</Text>
        </View>
      </View>

      <Text style={styles.hint}>גרור שמאל/ימין לתפוס!</Text>

      {/* Lane dividers */}
      {Array.from({ length: LANES - 1 }, (_, i) => (
        <View key={i} style={[styles.laneDivider, { left: (i + 1) * LANE_WIDTH }]} />
      ))}

      {/* Falling items */}
      {fallingItems.map((item) => (
        <FallingItemView
          key={item.id}
          item={item}
          onOffScreen={removeItem}
        />
      ))}

      {/* Backpack (player) */}
      <View style={[styles.backpack, { left: playerLeft }]}>
        <Image
          source={BACKPACK_PNG}
          style={{ width: BACKPACK_SIZE, height: BACKPACK_SIZE }}
          resizeMode="contain"
        />
      </View>

      {/* Swipe direction arrows — pulse until first drag */}
      <Animated.Text style={[styles.swipeArrow, styles.swipeArrowLeft, { opacity: arrowOpacity, left: playerLeft - 30 }]}>
        {'◀'}
      </Animated.Text>
      <Animated.Text style={[styles.swipeArrow, styles.swipeArrowRight, { opacity: arrowOpacity, left: playerLeft + BACKPACK_SIZE + 8 }]}>
        {'▶'}
      </Animated.Text>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>Catch the right item → +500 bonus!</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  dimOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  announceContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 30,
  },
  announceTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
    marginBottom: 8,
  },
  announceSubtitle: {
    fontSize: 22,
    color: THEME.colors.yellow,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 24,
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  targetBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  targetName: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 12,
    textShadowColor: 'rgba(0,0,0,0.7)',
    textShadowOffset: { width: 1, height: 2 },
    textShadowRadius: 4,
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
  targetRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  targetLabel: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    textShadowColor: 'rgba(0,0,0,0.6)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  hint: {
    position: 'absolute',
    top: 195,
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
  fallingItem: {
    position: 'absolute',
    top: 0,
  },
  backpack: {
    position: 'absolute',
    top: PLAYER_Y,
  },
  swipeArrow: {
    position: 'absolute',
    top: PLAYER_Y + BACKPACK_SIZE / 2 - 12,
    fontSize: 22,
    color: 'white',
    textShadowColor: 'rgba(0,0,0,0.8)',
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    zIndex: 20,
  },
  swipeArrowLeft: {},
  swipeArrowRight: {},
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
