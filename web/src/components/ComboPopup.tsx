import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface Props {
  multiplier: number;
}

export const ComboPopup: React.FC<Props> = ({ multiplier }) => {
  const controls = useAnimation();

  useEffect(() => {
    if (multiplier > 1) {
      controls.start({
        scale: [0, 1.4, 1, 1, 0],
        opacity: [0, 1, 1, 1, 0],
        transition: {
          duration: 1.5,
          times: [0, 0.15, 0.25, 0.85, 1],
        },
      });
    }
  }, [multiplier, controls]);

  if (multiplier <= 1) return null;

  const starColor = multiplier >= 3 ? '#FF6030' : '#F5C842';

  return (
    <motion.div
      animate={controls}
      style={{
        position: 'absolute',
        top: '28%',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <svg width={130} height={130} style={{ position: 'absolute' }}>
        {/* Starburst - 10 points */}
        <polygon
          points={Array.from({ length: 20 }, (_, i) => {
            const a = (i * 18 - 90) * Math.PI / 180;
            const r = i % 2 === 0 ? 65 : 30;
            return `${65 + r * Math.cos(a)},${65 + r * Math.sin(a)}`;
          }).join(' ')}
          fill={starColor}
        />
      </svg>
      <span style={{
        fontSize: 32,
        fontWeight: 'bold',
        color: 'white',
        textShadow: '2px 2px 3px rgba(0,0,0,0.6)',
        position: 'relative',
        zIndex: 1,
      }}>
        x{multiplier} COMBO!
      </span>
    </motion.div>
  );
};
