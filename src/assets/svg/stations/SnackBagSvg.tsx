import React from 'react';
import Svg, { Path, Rect, Ellipse, Text as SvgText, G } from 'react-native-svg';
import { THEME } from '../../theme';

interface SnackBagSvgProps {
  type?: 'BAMBA' | 'BISLI' | 'SNACK';
  width?: number;
  height?: number;
}

export const SnackBagSvg: React.FC<SnackBagSvgProps> = ({ type = 'SNACK', width = 56, height = 76 }) => {
  const isBamba = type === 'BAMBA';
  const isBisli = type === 'BISLI';
  const bgColor = isBamba ? '#FF8C00' : isBisli ? '#6644BB' : '#FFBB33';
  const bgDark = isBamba ? '#CC6600' : isBisli ? '#4422AA' : '#DD9900';
  const label = type === 'SNACK' ? 'SNACK' : type;

  return (
    <Svg width={width} height={height} viewBox="0 0 56 76">
      {/* Bag body */}
      <Path
        d="M 8 12 Q 4 8 6 4 L 50 4 Q 52 8 48 12 L 52 66 Q 52 72 48 72 L 8 72 Q 4 72 4 66 Z"
        fill={bgColor}
        stroke={THEME.colors.outline}
        strokeWidth={2.5}
      />

      {/* Bag crinkle/shine */}
      <Path
        d="M 10 14 Q 12 8 14 14 Q 12 24 10 30 Q 8 24 10 14 Z"
        fill={bgDark}
        opacity={0.3}
      />
      <Path
        d="M 16 10 Q 20 6 22 10 L 20 28 Q 18 22 16 10 Z"
        fill="white"
        opacity={0.18}
      />

      {/* Seal top */}
      <Path
        d="M 6 4 Q 28 10 50 4"
        stroke={THEME.colors.outline}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />

      {/* Label background */}
      <Rect x={9} y={26} width={38} height={28} rx={4} fill="white" opacity={0.88} />

      {/* Label text */}
      <SvgText
        x={28}
        y={44}
        textAnchor="middle"
        fontSize={label.length > 4 ? 8 : 10}
        fontWeight="bold"
        fill={bgDark}
      >
        {label}
      </SvgText>

      {/* Bamba peanut icon */}
      {isBamba && (
        <G>
          <Ellipse cx={28} cy={56} rx={7} ry={5} fill="#FFDD44" stroke={THEME.colors.outline} strokeWidth={1} />
          <Path d="M 22 56 Q 28 53 34 56" stroke={THEME.colors.outline} strokeWidth={1} fill="none" />
        </G>
      )}
      {/* Bisli spiral icon */}
      {isBisli && (
        <Path
          d="M 22 52 Q 28 48 34 52 Q 34 60 28 60 Q 22 60 22 52"
          stroke="#FFDD44"
          strokeWidth={2}
          fill="none"
          strokeLinecap="round"
        />
      )}
      {!isBamba && !isBisli && (
        <Ellipse cx={28} cy={56} rx={6} ry={4} fill="#FFEE88" opacity={0.7} />
      )}

      {/* Bottom seal */}
      <Path
        d="M 8 70 Q 28 67 48 70"
        stroke={THEME.colors.outline}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />
    </Svg>
  );
};
