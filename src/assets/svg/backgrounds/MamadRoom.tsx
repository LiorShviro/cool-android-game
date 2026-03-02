import React from 'react';
import Svg, { Rect, Path, Circle, Ellipse, Line, G } from 'react-native-svg';
import { THEME } from '../../theme';

interface MamadRoomProps {
  width: number;
  height: number;
  opacity?: number;
}

export const MamadRoom: React.FC<MamadRoomProps> = ({ width, height, opacity = 1 }) => {
  const vw = 360;
  const vh = 740;

  return (
    <Svg
      width={width}
      height={height}
      viewBox={`0 0 ${vw} ${vh}`}
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity }}
    >
      {/* Background wall */}
      <Rect x={0} y={0} width={vw} height={vh} fill={THEME.colors.wall} />

      {/* Ceiling shade */}
      <Rect x={0} y={0} width={vw} height={18} fill={THEME.colors.wallShade} />

      {/* Floor */}
      <Rect x={0} y={vh * 0.72} width={vw} height={vh * 0.28} fill={THEME.colors.floor} />
      {/* Floor highlight */}
      <Rect x={0} y={vh * 0.72} width={vw} height={8} fill={THEME.colors.floorDark} />

      {/* Floor tiles */}
      {[0, 60, 120, 180, 240, 300, 360].map((x) => (
        <Line
          key={`vtile-${x}`}
          x1={x} y1={vh * 0.72}
          x2={x} y2={vh}
          stroke={THEME.colors.floorDark}
          strokeWidth={1.5}
          strokeOpacity={0.4}
        />
      ))}
      {[vh * 0.75, vh * 0.82, vh * 0.89, vh * 0.96].map((y) => (
        <Line
          key={`htile-${y}`}
          x1={0} y1={y}
          x2={vw} y2={y}
          stroke={THEME.colors.floorDark}
          strokeWidth={1.5}
          strokeOpacity={0.4}
        />
      ))}

      {/* Wall outline at floor */}
      <Line x1={0} y1={vh * 0.72} x2={vw} y2={vh * 0.72} stroke={THEME.colors.outline} strokeWidth={2.5} />

      {/* === BLAST DOOR (right center) === */}
      <G>
        {/* Door frame */}
        <Rect
          x={240} y={vh * 0.35}
          width={100} height={vh * 0.37}
          rx={8}
          fill={THEME.colors.blastDoorDark}
          stroke={THEME.colors.outline}
          strokeWidth={3}
        />
        {/* Door face */}
        <Rect
          x={246} y={vh * 0.36}
          width={88} height={vh * 0.35}
          rx={6}
          fill={THEME.colors.blastDoor}
        />
        {/* Door horizontal ribs */}
        {[0.39, 0.44, 0.49, 0.54, 0.59, 0.64].map((yFrac, i) => (
          <Rect
            key={`rib-${i}`}
            x={250} y={vh * yFrac}
            width={80} height={5}
            rx={2.5}
            fill={THEME.colors.blastDoorDark}
            opacity={0.7}
          />
        ))}
        {/* Door handle */}
        <Rect
          x={252} y={vh * 0.52}
          width={16} height={6}
          rx={3}
          fill={THEME.colors.outline}
        />
        {/* Highlight */}
        <Rect
          x={248} y={vh * 0.37}
          width={6} height={vh * 0.33}
          rx={3}
          fill={THEME.colors.blastDoorHighlight}
          opacity={0.5}
        />
      </G>

      {/* === AIR FILTER / Baraf (top left) === */}
      <G>
        <Rect
          x={14} y={40}
          width={80} height={50}
          rx={4}
          fill="#D0D0D0"
          stroke={THEME.colors.outline}
          strokeWidth={2}
        />
        {/* Vents */}
        {[48, 54, 60, 66, 72, 78].map((y) => (
          <Line
            key={`vent-${y}`}
            x1={20} y1={y}
            x2={88} y2={y}
            stroke="#A0A0A0"
            strokeWidth={2.5}
          />
        ))}
        {/* LED dot */}
        <Circle cx={84} cy={47} r={3} fill="#00CC44" />
        <Rect
          x={14} y={40}
          width={80} height={50}
          rx={4}
          fill="none"
          stroke={THEME.colors.outline}
          strokeWidth={2}
        />
      </G>

      {/* === FOLDED MATTRESS (left wall) === */}
      <G>
        <Rect
          x={14} y={vh * 0.38}
          width={55} height={vh * 0.25}
          rx={6}
          fill="#E8D8C0"
          stroke={THEME.colors.outline}
          strokeWidth={2}
        />
        {/* Mattress stripes */}
        {[0.40, 0.44, 0.48, 0.52, 0.56, 0.60].map((yFrac, i) => (
          <Rect
            key={`stripe-${i}`}
            x={14} y={vh * yFrac}
            width={55} height={4}
            fill="#D4C4AA"
            opacity={0.8}
          />
        ))}
        {/* Fold line */}
        <Line
          x1={14} y1={vh * 0.505}
          x2={69} y2={vh * 0.505}
          stroke={THEME.colors.outline}
          strokeWidth={2}
        />
        {/* Buckle straps */}
        <Rect x={28} y={vh * 0.38} width={8} height={vh * 0.25} rx={3} fill="#C4A060" opacity={0.6} />
        <Rect x={48} y={vh * 0.38} width={8} height={vh * 0.25} rx={3} fill="#C4A060" opacity={0.6} />
      </G>

      {/* === CEILING LIGHT === */}
      <G>
        <Rect
          x={vw / 2 - 40} y={8}
          width={80} height={22}
          rx={6}
          fill="#FFFDE0"
          stroke={THEME.colors.outline}
          strokeWidth={2}
        />
        {/* Light glow effect */}
        <Ellipse
          cx={vw / 2} cy={30}
          rx={60} ry={20}
          fill="#FFFDE0"
          opacity={0.25}
        />
      </G>

      {/* === SMALL WALL OUTLET (right low) === */}
      <G>
        <Rect
          x={200} y={vh * 0.67}
          width={24} height={18}
          rx={3}
          fill="#F0E8D0"
          stroke={THEME.colors.outline}
          strokeWidth={1.5}
        />
        <Circle cx={207} cy={vh * 0.67 + 9} r={2.5} fill={THEME.colors.outline} />
        <Circle cx={217} cy={vh * 0.67 + 9} r={2.5} fill={THEME.colors.outline} />
      </G>

      {/* === GUITAR ON WALL (top right, near door) === */}
      <G>
        {/* Body */}
        <Ellipse
          cx={220} cy={vh * 0.25}
          rx={14} ry={18}
          fill="#C07840"
          stroke={THEME.colors.outline}
          strokeWidth={2}
        />
        {/* Waist */}
        <Rect x={213} y={vh * 0.22} width={14} height={10} fill="#C07840" />
        {/* Neck */}
        <Rect
          x={217} y={vh * 0.08}
          width={6} height={vh * 0.14}
          rx={3}
          fill="#8B5820"
          stroke={THEME.colors.outline}
          strokeWidth={1.5}
        />
        {/* Head */}
        <Rect
          x={215} y={vh * 0.07}
          width={10} height={10}
          rx={3}
          fill="#6B4010"
          stroke={THEME.colors.outline}
          strokeWidth={1.5}
        />
        {/* Sound hole */}
        <Circle
          cx={220} cy={vh * 0.26}
          r={5}
          fill="none"
          stroke={THEME.colors.outline}
          strokeWidth={1.5}
        />
        {/* Strings */}
        {[-2, 0, 2].map((offset) => (
          <Line
            key={`string-${offset}`}
            x1={220 + offset} y1={vh * 0.14}
            x2={220 + offset} y2={vh * 0.32}
            stroke="#D0A060"
            strokeWidth={0.8}
          />
        ))}
      </G>
    </Svg>
  );
};
