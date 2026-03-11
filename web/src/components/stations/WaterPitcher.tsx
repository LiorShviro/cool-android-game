import React, { useState, useRef, useEffect } from 'react';
import { THEME } from '../../assets/theme';
import { useUIScale } from '../../hooks/useUIScale';
import { STATION_PNGS } from '../../assets/stations';
import { hapticService } from '../../services/hapticService';

interface WaterPitcherProps {
  onSuccess: () => void;
}

export const WaterPitcher: React.FC<WaterPitcherProps> = ({ onSuccess }) => {
  const { scale } = useUIScale();
  const stationScale = scale * 0.7;
  const [isLocked, setIsLocked] = useState(false);
  const [fillProgress, setFillProgress] = useState(0); // 0 to 1.5
  const [isPouring, setIsPouring] = useState(false);
  const fillProgressRef = useRef(0);
  const pouringRef = useRef(false);
  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const lockTimerRef = useRef<number | null>(null);

  const FILL_DURATION = 3000; // ms to fill from 0 to 1.5

  const stopFilling = () => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isLocked) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    hapticService.light();
    fillProgressRef.current = 0;
    setFillProgress(0);
    pouringRef.current = true;
    setIsPouring(true);
    startTimeRef.current = Date.now();

    const tick = () => {
      if (!pouringRef.current) return;
      const elapsed = Date.now() - startTimeRef.current;
      const p = Math.min(1.5, (elapsed / FILL_DURATION) * 1.5);
      fillProgressRef.current = p;
      setFillProgress(p);
      if (p < 1.5) {
        animFrameRef.current = requestAnimationFrame(tick);
      }
    };
    animFrameRef.current = requestAnimationFrame(tick);
  };

  const handlePointerUp = () => {
    if (isLocked) return;
    pouringRef.current = false;
    setIsPouring(false);
    stopFilling();

    const finalFill = fillProgressRef.current;

    if (finalFill >= 0.65 && finalFill <= 1.2) {
      hapticService.success();
      onSuccess();
      setFillProgress(0);
      fillProgressRef.current = 0;
    } else if (finalFill > 1.2) {
      hapticService.error();
      triggerLock();
    } else {
      hapticService.warning();
      // Animate back to 0
      const startVal = finalFill;
      const startT = Date.now();
      const drain = () => {
        const elapsed = Date.now() - startT;
        const p = Math.max(0, startVal - (elapsed / 300) * startVal);
        setFillProgress(p);
        fillProgressRef.current = p;
        if (p > 0) requestAnimationFrame(drain);
      };
      requestAnimationFrame(drain);
    }
  };

  const triggerLock = () => {
    setIsLocked(true);
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    lockTimerRef.current = window.setTimeout(() => {
      setIsLocked(false);
      setFillProgress(0);
      fillProgressRef.current = 0;
    }, 1500);
  };

  useEffect(() => {
    return () => {
      stopFilling();
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, []);

  const containerWidth = Math.round(130 * stationScale);
  const cupWidth = Math.round(110 * stationScale);
  const cupHeight = Math.round(150 * stationScale);
  const waterMaxHeight = Math.round(114 * stationScale);
  const waterInset = Math.round(8 * stationScale);
  const fillBarHeight = Math.round(104 * stationScale);

  const displayFill = Math.min(1, fillProgress / 1.5);
  const waterColor = fillProgress > 1.2 ? '#FF4444' : '#33b5e5';
  const waterHeight = Math.max(0, displayFill * waterMaxHeight);
  const fillBarFill = Math.max(0, (fillProgress / 1.5) * fillBarHeight);

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
      paddingBottom: Math.round(10 * stationScale),
    }}>
      {/* Shelf label */}
      <div style={{
        width: '100%',
        backgroundColor: THEME.colors.woodLight,
        borderTopLeftRadius: THEME.borderRadius.medium - 2,
        borderTopRightRadius: THEME.borderRadius.medium - 2,
        paddingTop: Math.round(5 * stationScale),
        paddingBottom: Math.round(5 * stationScale),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottom: `2px solid ${THEME.colors.outline}`,
      }}>
        <span style={{
          fontSize: Math.max(11, Math.round(12 * stationScale)),
          fontWeight: 'bold',
          color: 'white',
          textShadow: '0 1px 1px rgba(0,0,0,0.3)',
        }}>
          WATER
        </span>
      </div>

      {/* Cup visual */}
      <div style={{
        width: cupWidth,
        height: cupHeight,
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {/* Water fill inside cup */}
        <div style={{
          position: 'absolute',
          left: waterInset,
          right: waterInset,
          bottom: Math.round(8 * stationScale),
          height: waterMaxHeight,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          overflow: 'hidden',
          zIndex: 1,
        }}>
          <div style={{
            width: '100%',
            height: waterHeight,
            backgroundColor: waterColor,
            borderRadius: 2,
            transition: 'background-color 0.3s',
          }} />
        </div>

        {/* Fill bar on right side */}
        <div style={{
          position: 'absolute',
          right: 6,
          bottom: 10,
          width: 10,
          height: fillBarHeight,
          borderRadius: 6,
          backgroundColor: 'rgba(0,0,0,0.15)',
          border: '2px solid #222',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-end',
          zIndex: 2,
        }}>
          <div style={{
            width: '100%',
            height: fillBarFill,
            backgroundColor: waterColor,
            borderRadius: 4,
            transition: 'background-color 0.3s',
          }} />
        </div>

        {/* Cup image overlay */}
        <img
          src={STATION_PNGS.waterCupBase}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            zIndex: 3,
          }}
          alt="cup"
        />

        {/* Lock overlay */}
        {isLocked && (
          <div style={{
            position: 'absolute',
            inset: 0,
            backgroundColor: 'rgba(255,68,68,0.35)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 6,
            zIndex: 4,
          }}>
            <span style={{
              color: 'white',
              fontWeight: 'bold',
              fontSize: Math.max(9, Math.round(10 * stationScale)),
              textShadow: '1px 1px 2px rgba(0,0,0,0.5)',
            }}>
              LOCKED
            </span>
          </div>
        )}
      </div>

      {/* Pour button */}
      <div
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
        style={{
          backgroundColor: isLocked ? '#999' : isPouring ? THEME.colors.blueDark : THEME.colors.blue,
          paddingTop: Math.round(8 * stationScale),
          paddingBottom: Math.round(8 * stationScale),
          paddingLeft: Math.round(14 * stationScale),
          paddingRight: Math.round(14 * stationScale),
          borderRadius: THEME.borderRadius.pill,
          border: `2px solid ${THEME.colors.outline}`,
          cursor: isLocked ? 'not-allowed' : 'pointer',
          transform: isPouring && !isLocked ? 'scale(0.95)' : 'scale(1)',
          transition: 'transform 0.1s, background-color 0.1s',
          touchAction: 'none',
        }}
      >
        <span style={{
          color: 'white',
          fontWeight: 'bold',
          fontSize: Math.max(9, Math.round(10 * stationScale)),
        }}>
          {isLocked ? 'WIPING...' : 'POUR'}
        </span>
      </div>
    </div>
  );
};
