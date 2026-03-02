import React from 'react';
import Svg, { Path, Circle } from 'react-native-svg';

interface StarburstSvgProps {
  size?: number;
  color?: string;
  rays?: number;
}

export const StarburstSvg: React.FC<StarburstSvgProps> = ({
  size = 120,
  color = '#F5C842',
  rays = 8,
}) => {
  const cx = 60;
  const cy = 60;
  const outerR = 55;
  const innerR = 35;

  // Build star polygon path
  const points: string[] = [];
  for (let i = 0; i < rays * 2; i++) {
    const angle = (Math.PI / rays) * i - Math.PI / 2;
    const r = i % 2 === 0 ? outerR : innerR;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(1)} ${y.toFixed(1)}`);
  }
  const starPath = points.join(' ') + ' Z';

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Path d={starPath} fill={color} opacity={0.92} />
      <Circle cx={cx} cy={cy} r={innerR - 4} fill={color} opacity={0.6} />
    </Svg>
  );
};
