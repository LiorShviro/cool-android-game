import React from 'react';
import Svg, { Circle, Path, Ellipse } from 'react-native-svg';
import { THEME } from '../../theme';

interface TennisBallSvgProps {
  size?: number;
  tapsLeft?: number;
}

export const TennisBallSvg: React.FC<TennisBallSvgProps> = ({ size = 44, tapsLeft = 0 }) => {
  return (
    <Svg width={size} height={size} viewBox="0 0 44 44">
      {/* Ball body */}
      <Circle
        cx={22} cy={22}
        r={20}
        fill="#C8E840"
        stroke={THEME.colors.outline}
        strokeWidth={2.5}
      />

      {/* Seam lines (curved) */}
      <Path
        d="M 8 14 Q 16 22 8 30"
        stroke="white"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        opacity={0.9}
      />
      <Path
        d="M 36 14 Q 28 22 36 30"
        stroke="white"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
        opacity={0.9}
      />

      {/* Shine */}
      <Ellipse
        cx={14} cy={12}
        rx={5} ry={4}
        fill="white"
        opacity={0.35}
      />

      {/* Tap count indicator */}
      {tapsLeft > 0 && (
        <>
          <Circle cx={22} cy={22} r={10} fill="rgba(0,0,0,0.45)" />
          <Path
            d={
              tapsLeft === 2
                ? 'M 19 22 L 22 19 L 25 22'
                : tapsLeft === 1
                ? 'M 19 22 L 22 17 L 25 22'
                : ''
            }
            stroke="white"
            strokeWidth={2}
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}
    </Svg>
  );
};
