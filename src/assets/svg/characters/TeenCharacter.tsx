import React from 'react';
import Svg, { Circle, Rect, Path, Ellipse, Line, G } from 'react-native-svg';
import { THEME } from '../../theme';
import { Mood } from './SabaCharacter';

interface TeenCharacterProps {
  mood?: Mood;
  size?: number;
}

export const TeenCharacter: React.FC<TeenCharacterProps> = ({ mood = 'neutral', size = 70 }) => {
  const eyeRy = mood === 'impatient' ? 1.5 : mood === 'urgent' ? 4 : 2.5;
  const eyeRx = mood === 'urgent' ? 3.5 : 2.5;

  return (
    <Svg width={size} height={size * 1.3} viewBox="0 0 80 104">
      {/* Hair (dark, slightly messy/floppy) */}
      <Path
        d="M 22 20 Q 18 8 30 6 Q 40 2 50 6 Q 62 8 58 20 Q 55 12 40 11 Q 25 12 22 20 Z"
        fill={THEME.colors.charHairDark}
        stroke={THEME.colors.outline}
        strokeWidth={1.5}
      />
      {/* Hair overhang */}
      <Path
        d="M 24 18 Q 26 12 34 10 Q 28 16 24 18 Z"
        fill={THEME.colors.charHairDark}
      />

      {/* Head */}
      <Ellipse cx={40} cy={22} rx={17} ry={18} fill={THEME.colors.skin} stroke={THEME.colors.outline} strokeWidth={2.5} />

      {/* Earphones */}
      <Circle cx={23} cy={22} r={4} fill="#333" stroke={THEME.colors.outline} strokeWidth={1.5} />
      <Circle cx={57} cy={22} r={4} fill="#333" stroke={THEME.colors.outline} strokeWidth={1.5} />
      <Path d="M 23 18 Q 40 10 57 18" stroke="#444" strokeWidth={1.5} fill="none" />

      {/* Eyebrows — teen style */}
      {mood === 'neutral' && (
        <>
          <Path d="M 29 16 L 37 15" stroke={THEME.colors.charHairDark} strokeWidth={2} strokeLinecap="round" />
          <Path d="M 43 15 L 51 16" stroke={THEME.colors.charHairDark} strokeWidth={2} strokeLinecap="round" />
        </>
      )}
      {mood === 'impatient' && (
        <>
          <Path d="M 29 15 L 37 17" stroke={THEME.colors.charHairDark} strokeWidth={2.5} strokeLinecap="round" />
          <Path d="M 43 17 L 51 15" stroke={THEME.colors.charHairDark} strokeWidth={2.5} strokeLinecap="round" />
        </>
      )}
      {mood === 'urgent' && (
        <>
          <Path d="M 28 13 Q 33 18 37 13" stroke={THEME.colors.charHairDark} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path d="M 43 13 Q 47 18 52 13" stroke={THEME.colors.charHairDark} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Eyes */}
      <Ellipse cx={33} cy={22} rx={eyeRx} ry={eyeRy} fill={THEME.colors.outline} />
      <Ellipse cx={47} cy={22} rx={eyeRx} ry={eyeRy} fill={THEME.colors.outline} />
      <Circle cx={34.5} cy={20.5} r={1} fill="white" />
      <Circle cx={48.5} cy={20.5} r={1} fill="white" />

      {/* Nose */}
      <Path d="M 39 26 Q 37 29 40 30 Q 43 29 41 26" stroke={THEME.colors.skinDark} strokeWidth={1.5} fill="none" strokeLinecap="round" />

      {/* Mouth */}
      {mood === 'neutral' && <Path d="M 35 33 L 45 33" stroke={THEME.colors.outline} strokeWidth={2} strokeLinecap="round" />}
      {mood === 'impatient' && <Path d="M 35 34 Q 40 31 45 34" stroke={THEME.colors.outline} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {mood === 'urgent' && <Ellipse cx={40} cy={33} rx={5} ry={4} fill={THEME.colors.outline} />}

      {/* Neck (slouched) */}
      <Rect x={36} y={38} width={8} height={6} fill={THEME.colors.skin} />

      {/* Body — T-shirt, slightly slouched */}
      <Path
        d="M 24 44 L 56 44 L 54 82 L 26 82 Z"
        fill={THEME.colors.charClothGreen}
        stroke={THEME.colors.outline}
        strokeWidth={2.5}
      />

      {/* T-shirt pocket */}
      <Rect x={38} y={50} width={10} height={8} rx={2} fill={THEME.colors.charClothBlue} stroke={THEME.colors.outline} strokeWidth={1.5} />

      {/* Left arm (hanging down) */}
      <Path d="M 26 47 Q 14 55 14 72" stroke={THEME.colors.skin} strokeWidth={8} strokeLinecap="round" fill="none" />
      <Path d="M 26 47 Q 14 55 14 72" stroke={THEME.colors.outline} strokeWidth={1.8} strokeLinecap="round" fill="none" />

      {/* Right arm (holding phone) */}
      <Path d="M 54 47 Q 66 52 64 65" stroke={THEME.colors.skin} strokeWidth={8} strokeLinecap="round" fill="none" />
      <Path d="M 54 47 Q 66 52 64 65" stroke={THEME.colors.outline} strokeWidth={1.8} strokeLinecap="round" fill="none" />
      {/* Phone in hand */}
      <Rect x={59} y={62} width={12} height={18} rx={2} fill="#222" stroke={THEME.colors.outline} strokeWidth={1.5} />
      <Rect x={61} y={64} width={8} height={13} rx={1} fill="#4488DD" />
      <Circle cx={65} cy={79} r={1} fill="#888" />

      {/* Jeans */}
      <Path
        d="M 26 81 L 54 81 L 52 100 L 42 100 L 40 93 L 38 100 L 28 100 Z"
        fill={THEME.colors.charClothBlue}
        stroke={THEME.colors.outline}
        strokeWidth={2.5}
      />
      {/* Jeans seam detail */}
      <Line x1={40} y1={82} x2={40} y2={93} stroke={THEME.colors.outline} strokeWidth={1} strokeOpacity={0.5} />

      {/* Shoes */}
      <Rect x={28} y={98} width={14} height={6} rx={3} fill="#333" stroke={THEME.colors.outline} strokeWidth={1.5} />
      <Rect x={38} y={98} width={14} height={6} rx={3} fill="#333" stroke={THEME.colors.outline} strokeWidth={1.5} />
    </Svg>
  );
};
