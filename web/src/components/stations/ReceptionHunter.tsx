import React, { useRef, useState, useEffect } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { THEME } from '../../assets/theme';
import { useUIScale } from '../../hooks/useUIScale';
import { STATION_PNGS } from '../../assets/stations';
import { hapticService } from '../../services/hapticService';

interface ReceptionHunterProps {
  onSuccess: () => void;
}

const randomSweetSpot = (range: number) => Math.random() * (range * 2) - range;
const HOLD_TICKS_REQUIRED = 20;
const TICK_MS = 50;

export const ReceptionHunter: React.FC<ReceptionHunterProps> = ({ onSuccess }) => {
  const { scale } = useUIScale();
  const stationScale = scale * 0.7;
  const clampRange = 60 * stationScale;

  const containerWidth = Math.round(130 * stationScale);
  const trackWidth = Math.round(120 * stationScale);
  const trackHeight = Math.round(155 * stationScale);
  const handW = Math.round(50 * stationScale);
  const handH = Math.round(56 * stationScale);
  const handTrackW = Math.round(92 * stationScale);
  const handTrackH = Math.round(60 * stationScale);
  const holdBarW = Math.round(92 * stationScale);
  const holdBarH = Math.round(10 * stationScale);

  const bar3Dist = 25 * stationScale;
  const bar2Dist = 45 * stationScale;
  const bar1Dist = 65 * stationScale;

  const sweetSpotX = useRef(randomSweetSpot(clampRange));
  const handX = useMotionValue(0);
  const [bars, setBars] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTicksRef = useRef(0);
  const holdIntervalRef = useRef<number | null>(null);

  const stopHoldTimer = () => {
    if (holdIntervalRef.current) {
      clearInterval(holdIntervalRef.current);
      holdIntervalRef.current = null;
    }
    holdTicksRef.current = 0;
    setHoldProgress(0);
  };

  const handleSuccess = () => {
    hapticService.success();
    onSuccess();
    sweetSpotX.current = randomSweetSpot(clampRange);
    animate(handX, 0, { type: 'spring', stiffness: 300, damping: 25 });
    setBars(0);
    stopHoldTimer();
  };

  const startHoldTimer = () => {
    if (holdIntervalRef.current) return;
    holdIntervalRef.current = window.setInterval(() => {
      holdTicksRef.current += 1;
      const progress = holdTicksRef.current / HOLD_TICKS_REQUIRED;
      setHoldProgress(progress);
      if (holdTicksRef.current >= HOLD_TICKS_REQUIRED) {
        stopHoldTimer();
        handleSuccess();
      }
    }, TICK_MS);
  };

  const updatePosition = (x: number) => {
    const dist = Math.abs(x - sweetSpotX.current);
    let newBars = 0;
    if (dist < bar3Dist) newBars = 3;
    else if (dist < bar2Dist) newBars = 2;
    else if (dist < bar1Dist) newBars = 1;
    setBars(newBars);
    if (newBars === 3) startHoldTimer();
    else stopHoldTimer();
  };

  const resetPosition = () => {
    setBars(0);
    stopHoldTimer();
  };

  useEffect(() => {
    sweetSpotX.current = randomSweetSpot(clampRange);
    return () => {
      if (holdIntervalRef.current) clearInterval(holdIntervalRef.current);
    };
  }, [clampRange]);

  const bind = useDrag(
    ({ movement: [mx], last, event }) => {
      event.preventDefault();
      const clampedX = Math.max(-clampRange, Math.min(clampRange, mx));
      handX.set(clampedX);
      updatePosition(clampedX);

      if (last) {
        animate(handX, 0, { type: 'spring', stiffness: 300, damping: 25 });
        resetPosition();
      }
    },
    { axis: 'x', filterTaps: true }
  );

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      minWidth: containerWidth,
      margin: Math.round(8 * stationScale),
      backgroundColor: THEME.colors.cream,
      borderRadius: THEME.borderRadius.medium,
      border: `2.5px solid ${THEME.colors.outline}`,
      paddingBottom: Math.round(12 * stationScale),
    }}>
      {/* Shelf label */}
      <div style={{
        width: '100%',
        backgroundColor: THEME.colors.woodLight,
        borderTopLeftRadius: THEME.borderRadius.medium - 2,
        borderTopRightRadius: THEME.borderRadius.medium - 2,
        paddingTop: Math.round(6 * stationScale),
        paddingBottom: Math.round(6 * stationScale),
        display: 'flex',
        justifyContent: 'center',
        borderBottom: `2px solid ${THEME.colors.outline}`,
      }}>
        <span style={{
          fontSize: Math.max(11, Math.round(12 * stationScale)),
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 1px 1px rgba(0,0,0,0.3)',
        }}>
          RECEPTION
        </span>
      </div>

      {/* Track */}
      <div style={{
        width: trackWidth,
        height: trackHeight,
        backgroundColor: '#E8F5E8',
        borderRadius: 8,
        border: `1.5px solid ${THEME.colors.outline}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingTop: Math.round(10 * stationScale),
        paddingBottom: Math.round(10 * stationScale),
        marginTop: Math.round(8 * stationScale),
      }}>
        {/* Signal bars */}
        <div style={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: Math.round(5 * stationScale),
          height: Math.round(40 * stationScale),
        }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{
              width: Math.round(12 * stationScale),
              height: Math.round((8 + n * 7) * scale),
              borderRadius: 3,
              backgroundColor: bars >= n ? THEME.colors.green : '#CCC',
            }} />
          ))}
        </div>

        {/* Hold progress bar */}
        <div style={{
          width: holdBarW,
          height: holdBarH,
          backgroundColor: 'rgba(0,0,0,0.12)',
          borderRadius: 4,
          overflow: 'hidden',
          border: `1px solid ${THEME.colors.outline}`,
        }}>
          <div style={{
            height: '100%',
            width: `${Math.round(holdProgress * 100)}%`,
            backgroundColor: THEME.colors.green,
            borderRadius: 4,
            transition: 'width 0.05s linear',
          }} />
        </div>

        {/* Hand track */}
        <div style={{
          width: handTrackW,
          height: handTrackH,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }}>
          <motion.div
            {...(bind() as object)}
            style={{
              x: handX,
              width: handW,
              height: handH,
              cursor: 'grab',
              touchAction: 'none',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <img
              src={STATION_PNGS.receptionHandPhone}
              style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
              alt="phone"
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
