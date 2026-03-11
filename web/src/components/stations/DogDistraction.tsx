import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../../assets/theme';
import { useUIScale } from '../../hooks/useUIScale';
import { STATION_PNGS } from '../../assets/stations';
import { hapticService } from '../../services/hapticService';

interface DogDistractionProps {
  onSuccess: () => void;
}

export const DogDistraction: React.FC<DogDistractionProps> = ({ onSuccess }) => {
  const { scale } = useUIScale();
  const stationScale = scale * 0.7;
  const [taps, setTaps] = useState(0);

  const containerWidth = Math.round(130 * stationScale);
  const courtWidth = Math.round(120 * stationScale);
  const courtHeight = Math.round(125 * stationScale);
  const ballSize = Math.round(50 * stationScale);
  const groundHeight = Math.round(22 * stationScale);
  const bounceHeight = 48 * stationScale;
  const dotSize = Math.round(8 * stationScale);

  const handleTap = () => {
    hapticService.light();
    const nextTaps = taps + 1;
    if (nextTaps >= 3) {
      hapticService.success();
      onSuccess();
      setTaps(0);
    } else {
      setTaps(nextTaps);
    }
  };

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
          THROW BALL
        </span>
      </div>

      {/* Court */}
      <div style={{
        width: courtWidth,
        height: courtHeight,
        backgroundColor: '#D4E8A0',
        borderRadius: 8,
        border: `1.5px solid ${THEME.colors.outline}`,
        position: 'relative',
        overflow: 'hidden',
        marginTop: Math.round(8 * stationScale),
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: Math.round(26 * stationScale),
      }}>
        {/* Ground */}
        <div style={{
          position: 'absolute',
          bottom: 0,
          width: '100%',
          height: groundHeight,
          backgroundColor: '#8BBF48',
          borderTop: `2px solid ${THEME.colors.outline}`,
        }} />

        {/* Bouncing ball */}
        <div
          onClick={handleTap}
          style={{ cursor: 'pointer', touchAction: 'manipulation', zIndex: 2 }}
        >
          <motion.div
            animate={{ y: [0, -bounceHeight, 0] }}
            transition={{
              repeat: Infinity,
              duration: 1,
              ease: ['easeOut', 'easeIn'],
            }}
          >
            <img
              src={STATION_PNGS.dogBall}
              style={{ width: ballSize, height: ballSize, objectFit: 'contain' }}
              alt="ball"
            />
          </motion.div>
        </div>

        {/* Tap hint dots */}
        <div style={{
          position: 'absolute',
          bottom: 6,
          display: 'flex',
          flexDirection: 'row',
          gap: 6,
          zIndex: 3,
        }}>
          {[0, 1, 2].map((i) => (
            <div key={i} style={{
              width: dotSize,
              height: dotSize,
              borderRadius: dotSize / 2,
              backgroundColor: i < taps ? THEME.colors.green : 'rgba(0,0,0,0.15)',
              border: `1.5px solid ${THEME.colors.outline}`,
            }} />
          ))}
        </div>
      </div>
    </div>
  );
};
