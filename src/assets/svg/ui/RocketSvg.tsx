import React from 'react';
import Svg, { Path, Ellipse, Rect, Circle, G } from 'react-native-svg';
import { THEME } from '../../theme';

interface RocketSvgProps {
  active?: boolean;
  size?: number;
}

export const RocketSvg: React.FC<RocketSvgProps> = ({ active = true, size = 28 }) => {
  const bodyColor = active ? '#E84040' : '#909090';
  const windowColor = active ? '#AAE0FF' : '#C0C0C0';
  const flameColor = active ? '#F5C842' : 'transparent';
  const flameInner = active ? '#FFFFFF' : 'transparent';
  const outlineColor = active ? THEME.colors.outline : '#707070';

  return (
    <Svg width={size} height={size * 1.6} viewBox="0 0 32 50">
      {/* Flame */}
      {active && (
        <G>
          <Ellipse cx={16} cy={46} rx={6} ry={6} fill={flameColor} opacity={0.9} />
          <Ellipse cx={16} cy={44} rx={3} ry={4} fill={flameInner} opacity={0.7} />
        </G>
      )}
      {/* Rocket body */}
      <Path
        d="M 16 2 Q 26 10 26 30 L 6 30 Q 6 10 16 2 Z"
        fill={bodyColor}
        stroke={outlineColor}
        strokeWidth={2}
      />
      {/* Nose cone */}
      <Path
        d="M 16 2 Q 20 8 20 16 L 12 16 Q 12 8 16 2 Z"
        fill={active ? '#FF6060' : '#B0B0B0'}
      />
      {/* Window */}
      <Circle cx={16} cy={21} r={5} fill={windowColor} stroke={outlineColor} strokeWidth={1.5} />
      <Circle cx={14.5} cy={19.5} r={1.5} fill="white" opacity={0.7} />
      {/* Side fins */}
      <Path
        d="M 6 30 L 2 40 L 10 34 Z"
        fill={active ? '#CC2020' : '#787878'}
        stroke={outlineColor}
        strokeWidth={1.5}
      />
      <Path
        d="M 26 30 L 30 40 L 22 34 Z"
        fill={active ? '#CC2020' : '#787878'}
        stroke={outlineColor}
        strokeWidth={1.5}
      />
      {/* Engine nozzle */}
      <Rect x={11} y={30} width={10} height={5} rx={2} fill={active ? '#880000' : '#505050'} stroke={outlineColor} strokeWidth={1.5} />
    </Svg>
  );
};
