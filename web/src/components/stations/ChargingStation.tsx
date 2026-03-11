import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, animate } from 'framer-motion';
import { useDrag } from '@use-gesture/react';
import { THEME } from '../../assets/theme';
import { useUIScale } from '../../hooks/useUIScale';
import { STATION_PNGS } from '../../assets/stations';
import { hapticService } from '../../services/hapticService';

interface ChargingStationProps {
  onSuccess: () => void;
}

export const ChargingStation: React.FC<ChargingStationProps> = ({ onSuccess }) => {
  const { scale } = useUIScale();
  const stationScale = scale * 0.7;
  const phoneRange = 50 * stationScale;
  const successDist = 40 * stationScale;
  const yThreshold = -25 * stationScale;

  const containerWidth = Math.round(130 * stationScale);
  const trackWidth = Math.round(120 * stationScale);
  const trackHeight = Math.round(150 * stationScale);
  const phoneW = Math.round(42 * stationScale);
  const phoneH = Math.round(58 * stationScale);
  const plugW = Math.round(34 * stationScale);
  const plugH = Math.round(44 * stationScale);

  const phoneX = useMotionValue(-phoneRange);
  const plugX = useMotionValue(0);
  const plugY = useMotionValue(0);
  const directionRef = useRef(1);
  const phoneXRef = useRef(-phoneRange);

  // Animate phone left-right
  useEffect(() => {
    let cancelled = false;
    const bounce = () => {
      if (cancelled) return;
      const target = directionRef.current === 1 ? phoneRange : -phoneRange;
      const controls = animate(phoneX, target, {
        duration: 2.5,
        ease: 'linear',
        onUpdate: (v) => { phoneXRef.current = v; },
        onComplete: () => {
          directionRef.current *= -1;
          if (!cancelled) bounce();
        },
      });
      return controls;
    };
    const ctrl = bounce();
    return () => {
      cancelled = true;
      ctrl?.stop();
    };
  }, [phoneRange, phoneX]);

  const bind = useDrag(
    ({ movement: [mx, my], last, event }) => {
      event.preventDefault();
      plugX.set(mx);
      plugY.set(my);

      if (last) {
        const dist = Math.abs(mx - phoneXRef.current);
        if (dist < successDist && my < yThreshold) {
          hapticService.success();
          onSuccess();
          animate(plugX, 0, { type: 'spring', stiffness: 300, damping: 25 });
          animate(plugY, 0, { type: 'spring', stiffness: 300, damping: 25 });
        } else {
          hapticService.warning();
          animate(plugX, 0, { type: 'spring', stiffness: 300, damping: 25 });
          animate(plugY, 0, { type: 'spring', stiffness: 300, damping: 25 });
        }
      }
    },
    { filterTaps: true }
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
          CHARGE
        </span>
      </div>

      {/* Track */}
      <div style={{
        width: trackWidth,
        height: trackHeight,
        backgroundColor: '#FFFDE0',
        borderRadius: 8,
        border: `1.5px solid ${THEME.colors.outline}`,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: Math.round(14 * stationScale),
        paddingBottom: Math.round(14 * stationScale),
        overflow: 'hidden',
        marginTop: Math.round(8 * stationScale),
        position: 'relative',
      }}>
        {/* Moving phone */}
        <motion.div style={{ x: phoneX, width: phoneW, height: phoneH }}>
          <img
            src={STATION_PNGS.chargePhone}
            style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            alt="phone"
          />
        </motion.div>

        {/* Draggable plug */}
        <motion.div
          {...(bind() as object)}
          style={{
            x: plugX,
            y: plugY,
            width: plugW,
            height: plugH,
            cursor: 'grab',
            touchAction: 'none',
            zIndex: 10,
          }}
        >
          <img
            src={STATION_PNGS.chargePlug}
            style={{ width: '100%', height: '100%', objectFit: 'contain', pointerEvents: 'none' }}
            alt="plug"
          />
        </motion.div>
      </div>
    </div>
  );
};
