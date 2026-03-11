import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { THEME } from '../../assets/theme';
import { useUIScale } from '../../hooks/useUIScale';
import { STATION_PNGS } from '../../assets/stations';
import { hapticService } from '../../services/hapticService';

interface SnackSorterProps {
  onSuccess: (snack: 'BAMBA' | 'BISLI') => void;
}

export const SnackSorter: React.FC<SnackSorterProps> = ({ onSuccess }) => {
  const { scale } = useUIScale();
  const stationScale = scale * 0.7;
  const swipeThreshold = 30 * stationScale;

  const containerWidth = Math.round(230 * stationScale);
  const sorterWidth = Math.round(230 * stationScale);
  const sorterHeight = Math.round(115 * stationScale);
  const snackW = Math.round(60 * stationScale);
  const snackH = Math.round(80 * stationScale);
  const sideW = Math.round(50 * stationScale);
  const sideSnackW = Math.round(42 * stationScale);
  const sideSnackH = Math.round(56 * stationScale);

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
          SNACKS
        </span>
      </div>

      {/* Sorter area */}
      <div style={{
        width: sorterWidth,
        height: sorterHeight,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: Math.round(10 * stationScale),
        paddingRight: Math.round(10 * stationScale),
        marginTop: Math.round(6 * stationScale),
        overflow: 'hidden',
      }}>
        {/* Left: BISLI */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: sideW }}>
          <span style={{ fontSize: Math.max(9, Math.round(10 * stationScale)), fontWeight: 'bold', color: THEME.colors.outline }}>BISLI</span>
          <span style={{ fontSize: Math.max(14, Math.round(16 * stationScale)), color: THEME.colors.woodDark, fontWeight: 'bold' }}>←</span>
          <img src={STATION_PNGS.bisly} style={{ width: sideSnackW, height: sideSnackH, objectFit: 'contain' }} alt="bisli" />
        </div>

        {/* Draggable snack bag using framer-motion drag */}
        <motion.div
          drag="x"
          dragConstraints={{ left: -80, right: 80 }}
          dragElastic={0.2}
          dragSnapToOrigin
          onDragEnd={(_, info) => {
            const dx = info.offset.x;
            if (dx > swipeThreshold) {
              hapticService.success();
              onSuccess('BAMBA');
            } else if (dx < -swipeThreshold) {
              hapticService.success();
              onSuccess('BISLI');
            } else {
              hapticService.light();
            }
          }}
          style={{
            cursor: 'grab',
            touchAction: 'none',
            zIndex: 10,
            boxShadow: '0 2px 8px rgba(0,0,0,0.25)',
          }}
          whileDrag={{ cursor: 'grabbing' }}
        >
          <img
            src={STATION_PNGS.snackBag}
            style={{ width: snackW, height: snackH, objectFit: 'contain', pointerEvents: 'none' }}
            alt="snack"
          />
        </motion.div>

        {/* Right: BAMBA */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: sideW }}>
          <span style={{ fontSize: Math.max(14, Math.round(16 * stationScale)), color: THEME.colors.woodDark, fontWeight: 'bold' }}>→</span>
          <span style={{ fontSize: Math.max(9, Math.round(10 * stationScale)), fontWeight: 'bold', color: THEME.colors.outline }}>BAMBA</span>
          <img src={STATION_PNGS.bamba} style={{ width: sideSnackW, height: sideSnackH, objectFit: 'contain' }} alt="bamba" />
        </div>
      </div>
    </div>
  );
};
