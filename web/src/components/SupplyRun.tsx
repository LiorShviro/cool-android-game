import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { BACKGROUND_PNGS } from '../assets/backgrounds';
import { SUPPLY_RUN_ITEMS } from '../constants/gameConstants';
import { useGameStore } from '../store/gameStore';
import { THEME } from '../assets/theme';

const LANES = 5;
const RUN_DURATION_MS = 13000;
const ANNOUNCE_DURATION_MS = 2000;
const ITEM_SPAWN_INTERVAL = 800;
const ITEM_FALL_DURATION = 3800;

const BASE = import.meta.env.BASE_URL + 'assets/items/';
const BACKPACK_URL = import.meta.env.BASE_URL + 'assets/items/backpack.png';

const getItemUrl = (key: string) => `${BASE}${key}.png`;

interface FallingItem {
  id: string;
  itemKey: string;
  lane: number;
  startTime: number;
}

interface Props {
  onComplete: (caught: boolean) => void;
}

const FallingItemView: React.FC<{
  item: FallingItem;
  screenHeight: number;
  laneWidth: number;
  itemSize: number;
  onOffScreen: (id: string) => void;
}> = ({ item, screenHeight, laneWidth, itemSize, onOffScreen }) => {
  const left = item.lane * laneWidth + (laneWidth - itemSize) / 2;

  return (
    <motion.div
      style={{
        position: 'absolute',
        left,
        top: -itemSize,
        width: itemSize,
        height: itemSize,
      }}
      animate={{ y: screenHeight + itemSize }}
      transition={{ duration: ITEM_FALL_DURATION / 1000, ease: 'linear' }}
      onAnimationComplete={() => onOffScreen(item.id)}
    >
      <img
        src={getItemUrl(item.itemKey)}
        style={{ width: itemSize, height: itemSize, objectFit: 'contain' }}
        alt={item.itemKey}
      />
    </motion.div>
  );
};

export const SupplyRun: React.FC<Props> = ({ onComplete }) => {
  const { decrementLives } = useGameStore();
  const targetItem = useRef(SUPPLY_RUN_ITEMS[Math.floor(Math.random() * SUPPLY_RUN_ITEMS.length)]).current;

  const [phase, setPhase] = useState<'announce' | 'run'>('announce');
  const [playerLane, setPlayerLane] = useState(2);
  const [fallingItems, setFallingItems] = useState<FallingItem[]>([]);
  const [timeLeft, setTimeLeft] = useState(RUN_DURATION_MS / 1000);
  const [hasSwiped, setHasSwiped] = useState(false);
  const [arrowOpacity, setArrowOpacity] = useState(1);
  const [containerWidth, setContainerWidth] = useState(Math.min(window.innerWidth, 480));
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
  }, []);

  const screenWidth = containerWidth;
  const screenHeight = window.innerHeight;
  const laneWidth = screenWidth / LANES;
  const backpackSize = 72;
  const itemSize = 56;
  const playerY = screenHeight - backpackSize - 80;

  const playerLaneRef = useRef(2);
  const fallingItemsRef = useRef<FallingItem[]>([]);
  const completedRef = useRef(false);
  const spawnIntervalRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);
  const collisionRef = useRef<number | null>(null);
  const startLaneRef = useRef(2);
  const dragStartXRef = useRef(0);
  const arrowAnimRef = useRef<number | null>(null);
  const arrowDirRef = useRef(-1);

  const complete = useCallback(
    (caught: boolean) => {
      if (completedRef.current) return;
      completedRef.current = true;
      if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (collisionRef.current) clearInterval(collisionRef.current);
      if (arrowAnimRef.current) cancelAnimationFrame(arrowAnimRef.current);
      onComplete(caught);
    },
    [onComplete]
  );

  // Arrow pulse animation
  useEffect(() => {
    if (hasSwiped) {
      setArrowOpacity(0);
      return;
    }
    let opacity = 1;
    let dir = -1;
    const tick = () => {
      opacity += dir * 0.025;
      if (opacity <= 0.25) dir = 1;
      if (opacity >= 1) dir = -1;
      setArrowOpacity(opacity);
      arrowAnimRef.current = requestAnimationFrame(tick);
    };
    arrowAnimRef.current = requestAnimationFrame(tick);
    return () => { if (arrowAnimRef.current) cancelAnimationFrame(arrowAnimRef.current); };
  }, [hasSwiped]);

  // Announcement phase
  useEffect(() => {
    const timer = setTimeout(() => setPhase('run'), ANNOUNCE_DURATION_MS);
    return () => clearTimeout(timer);
  }, []);

  // Countdown
  useEffect(() => {
    if (phase !== 'run') return;
    countdownRef.current = window.setInterval(() => {
      setTimeLeft((prev) => {
        const next = prev - 1;
        if (next <= 0) { complete(false); return 0; }
        return next;
      });
    }, 1000);
    return () => { if (countdownRef.current) clearInterval(countdownRef.current); };
  }, [phase, complete]);

  // Item spawning
  useEffect(() => {
    if (phase !== 'run') return;
    spawnIntervalRef.current = window.setInterval(() => {
      const lane = Math.floor(Math.random() * LANES);
      const randomItem = SUPPLY_RUN_ITEMS[Math.floor(Math.random() * SUPPLY_RUN_ITEMS.length)];
      const newItem: FallingItem = {
        id: Math.random().toString(36).substring(7),
        itemKey: randomItem.key,
        lane,
        startTime: Date.now(),
      };
      fallingItemsRef.current = [...fallingItemsRef.current, newItem];
      setFallingItems((prev) => [...prev, newItem]);
    }, ITEM_SPAWN_INTERVAL);
    return () => { if (spawnIntervalRef.current) clearInterval(spawnIntervalRef.current); };
  }, [phase]);

  // Collision detection
  useEffect(() => {
    if (phase !== 'run') return;
    collisionRef.current = window.setInterval(() => {
      const now = Date.now();
      const toRemove: string[] = [];
      fallingItemsRef.current.forEach((item) => {
        if (item.lane !== playerLaneRef.current) return;
        const elapsed = now - item.startTime;
        const y = -itemSize + (elapsed / ITEM_FALL_DURATION) * (screenHeight + itemSize);
        if (y >= playerY - 40 && y <= playerY + 40) {
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
  }, [phase, complete, decrementLives, targetItem.key, itemSize, playerY, screenHeight]);

  const removeItem = useCallback((id: string) => {
    fallingItemsRef.current = fallingItemsRef.current.filter((o) => o.id !== id);
    setFallingItems((prev) => prev.filter((o) => o.id !== id));
  }, []);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragStartXRef.current = e.clientX;
    startLaneRef.current = playerLaneRef.current;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    const dx = e.clientX - dragStartXRef.current;
    if (!hasSwiped && Math.abs(dx) > 10) setHasSwiped(true);
    const next = Math.min(LANES - 1, Math.max(0, startLaneRef.current + Math.round(dx / laneWidth)));
    playerLaneRef.current = next;
    setPlayerLane(next);
  };

  const playerLeft = playerLane * laneWidth + (laneWidth - backpackSize) / 2;
  const timerColor = timeLeft <= 5 ? THEME.colors.red : THEME.colors.yellow;

  if (phase === 'announce') {
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        zIndex: 80,
        overflow: 'hidden',
      }}>
        <img
          src={BACKGROUND_PNGS.supplyRun}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          alt="background"
        />
        <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)' }} />
        <div style={{
          position: 'relative',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          paddingLeft: 30,
          paddingRight: 30,
          zIndex: 1,
        }}>
          <span style={{
            fontSize: 34,
            fontWeight: 'bold',
            color: 'white',
            textAlign: 'center',
            textShadow: '1px 2px 4px rgba(0,0,0,0.8)',
            marginBottom: 8,
          }}>
            האזעקה הפסיקה!
          </span>
          <span style={{
            fontSize: 22,
            color: THEME.colors.yellow,
            fontWeight: 'bold',
            textAlign: 'center',
            marginBottom: 24,
            textShadow: '1px 1px 3px rgba(0,0,0,0.6)',
          }}>
            מהר! תתפוס את...
          </span>
          <div style={{
            backgroundColor: 'rgba(255,255,255,0.15)',
            borderRadius: 20,
            padding: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            border: '2px solid rgba(255,255,255,0.4)',
          }}>
            <img
              src={getItemUrl(targetItem.key)}
              style={{ width: 100, height: 100, objectFit: 'contain' }}
              alt={targetItem.displayName}
            />
            <span style={{
              fontSize: 26,
              fontWeight: 'bold',
              color: 'white',
              marginTop: 12,
              textShadow: '1px 2px 4px rgba(0,0,0,0.7)',
            }}>
              {targetItem.displayName}
            </span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      style={{
        position: 'absolute',
        inset: 0,
        zIndex: 80,
        overflow: 'hidden',
        touchAction: 'none',
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
    >
      <img
        src={BACKGROUND_PNGS.supplyRun}
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
        alt="background"
      />
      <div style={{ position: 'absolute', inset: 0, backgroundColor: 'rgba(0,0,0,0.45)' }} />

      {/* Header */}
      <div style={{
        position: 'absolute',
        top: 52,
        left: 0,
        right: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        zIndex: 10,
      }}>
        <span style={{
          fontSize: 28,
          fontWeight: 'bold',
          color: 'white',
          textShadow: '1px 2px 4px rgba(0,0,0,0.8)',
          letterSpacing: 1,
        }}>
          SUPPLY RUN!
        </span>
        <span style={{
          fontSize: 40,
          fontWeight: 'bold',
          color: timerColor,
          textShadow: '1px 1px 3px rgba(0,0,0,0.7)',
        }}>
          {timeLeft}s
        </span>
        <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
          <span style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.6)' }}>
            תתפוס:{' '}
          </span>
          <img src={getItemUrl(targetItem.key)} style={{ width: 32, height: 32, objectFit: 'contain' }} alt={targetItem.displayName} />
          <span style={{ color: 'white', fontSize: 16, fontWeight: 'bold', textShadow: '1px 1px 2px rgba(0,0,0,0.6)', marginLeft: 4 }}>
            {targetItem.displayName}
          </span>
        </div>
      </div>

      {/* Hint */}
      <span style={{
        position: 'absolute',
        top: 195,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'rgba(255,255,255,0.75)',
        fontSize: 15,
        fontWeight: 'bold',
        zIndex: 10,
      }}>
        גרור שמאל/ימין לתפוס!
      </span>

      {/* Lane dividers */}
      {Array.from({ length: LANES - 1 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          left: (i + 1) * laneWidth,
          width: 1,
          backgroundColor: 'rgba(255,255,255,0.15)',
        }} />
      ))}

      {/* Falling items */}
      {fallingItems.map((item) => (
        <FallingItemView
          key={item.id}
          item={item}
          screenHeight={screenHeight}
          laneWidth={laneWidth}
          itemSize={itemSize}
          onOffScreen={removeItem}
        />
      ))}

      {/* Backpack */}
      <div style={{
        position: 'absolute',
        top: playerY,
        left: playerLeft,
        width: backpackSize,
        height: backpackSize,
        transition: 'left 0.08s',
      }}>
        <img
          src={BACKPACK_URL}
          style={{ width: backpackSize, height: backpackSize, objectFit: 'contain' }}
          alt="backpack"
        />
      </div>

      {/* Arrow hints */}
      <span style={{
        position: 'absolute',
        top: playerY + backpackSize / 2 - 12,
        left: playerLeft - 30,
        fontSize: 22,
        color: 'white',
        opacity: arrowOpacity,
        textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
        zIndex: 20,
        pointerEvents: 'none',
      }}>
        ◀
      </span>
      <span style={{
        position: 'absolute',
        top: playerY + backpackSize / 2 - 12,
        left: playerLeft + backpackSize + 8,
        fontSize: 22,
        color: 'white',
        opacity: arrowOpacity,
        textShadow: '1px 1px 3px rgba(0,0,0,0.8)',
        zIndex: 20,
        pointerEvents: 'none',
      }}>
        ▶
      </span>

      {/* Footer */}
      <div style={{
        position: 'absolute',
        bottom: 20,
        left: 0,
        right: 0,
        display: 'flex',
        justifyContent: 'center',
        zIndex: 10,
      }}>
        <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: 14, fontWeight: 'bold' }}>
          Catch the right item → +500 bonus!
        </span>
      </div>
    </div>
  );
};
