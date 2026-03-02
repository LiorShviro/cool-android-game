import React from 'react';
import Svg, { Circle, Rect, Path, Ellipse, G, Line } from 'react-native-svg';
import { THEME } from '../../theme';
import { Mood } from './SabaCharacter';

interface ParentCharacterProps {
  mood?: Mood;
  size?: number;
}

export const ParentCharacter: React.FC<ParentCharacterProps> = ({ mood = 'neutral', size = 70 }) => {
  const eyeRy = mood === 'impatient' ? 1.5 : mood === 'urgent' ? 4.5 : 2.5;
  const eyeRx = mood === 'urgent' ? 3.5 : 2.5;

  return (
    <Svg width={size} height={size * 1.3} viewBox="0 0 80 104">
      {/* Messy hair (multiple strokes) */}
      <Path
        d="M 22 19 Q 20 5 35 4 Q 40 2 45 4 Q 60 5 58 19"
        fill={THEME.colors.charHairBrown}
        stroke={THEME.colors.outline}
        strokeWidth={2}
      />
      {/* Hair tufts sticking out */}
      <Path d="M 24 16 Q 20 8 26 10" stroke={THEME.colors.charHairBrown} strokeWidth={4} fill="none" strokeLinecap="round" />
      <Path d="M 35 6 Q 38 1 41 5" stroke={THEME.colors.charHairBrown} strokeWidth={3.5} fill="none" strokeLinecap="round" />
      <Path d="M 50 8 Q 56 6 54 12" stroke={THEME.colors.charHairBrown} strokeWidth={3.5} fill="none" strokeLinecap="round" />

      {/* Head */}
      <Circle cx={40} cy={22} r={17} fill={THEME.colors.skin} stroke={THEME.colors.outline} strokeWidth={2.5} />

      {/* Eyebrows */}
      {mood === 'neutral' && (
        <>
          <Path d="M 29 15 Q 33 13 37 15" stroke={THEME.colors.charHairBrown} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M 43 15 Q 47 13 51 15" stroke={THEME.colors.charHairBrown} strokeWidth={2} fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === 'impatient' && (
        <>
          <Path d="M 29 14 Q 33 16 37 13" stroke={THEME.colors.charHairBrown} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path d="M 43 13 Q 47 16 51 14" stroke={THEME.colors.charHairBrown} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === 'urgent' && (
        <>
          <Path d="M 28 12 Q 33 17 37 12" stroke={THEME.colors.charHairBrown} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M 43 12 Q 47 17 52 12" stroke={THEME.colors.charHairBrown} strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Eyes */}
      <Ellipse cx={33} cy={22} rx={eyeRx} ry={eyeRy} fill={THEME.colors.outline} />
      <Ellipse cx={47} cy={22} rx={eyeRx} ry={eyeRy} fill={THEME.colors.outline} />
      <Circle cx={34.5} cy={20.5} r={1} fill="white" />
      <Circle cx={48.5} cy={20.5} r={1} fill="white" />

      {/* Tired under-eye bags (impatient/urgent) */}
      {(mood === 'impatient' || mood === 'urgent') && (
        <>
          <Path d="M 29 25 Q 33 27 37 25" stroke={THEME.colors.skinDark} strokeWidth={1.2} fill="none" />
          <Path d="M 43 25 Q 47 27 51 25" stroke={THEME.colors.skinDark} strokeWidth={1.2} fill="none" />
        </>
      )}

      {/* Nose */}
      <Path d="M 39 26 Q 37 30 40 31 Q 43 30 41 26" stroke={THEME.colors.skinDark} strokeWidth={1.5} fill="none" strokeLinecap="round" />

      {/* Mouth */}
      {mood === 'neutral' && <Path d="M 34 32 Q 40 37 46 32" stroke={THEME.colors.outline} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {mood === 'impatient' && <Path d="M 34 34 Q 40 31 46 34" stroke={THEME.colors.outline} strokeWidth={2} fill="none" strokeLinecap="round" />}
      {mood === 'urgent' && <Ellipse cx={40} cy={33} rx={6} ry={4.5} fill={THEME.colors.outline} />}

      {/* Neck */}
      <Rect x={36} y={37} width={8} height={7} fill={THEME.colors.skin} />

      {/* Body — pajamas (light blue with stripes) */}
      <Path
        d="M 20 44 L 60 44 L 58 82 L 22 82 Z"
        fill="#B8D4F0"
        stroke={THEME.colors.outline}
        strokeWidth={2.5}
      />
      {/* Pajama stripes */}
      {[50, 57, 64, 71].map((y) => (
        <Line
          key={`stripe-${y}`}
          x1={21} y1={y}
          x2={59} y2={y}
          stroke="#90B8E0"
          strokeWidth={2}
          opacity={0.7}
        />
      ))}
      {/* Collar */}
      <Path
        d="M 33 44 Q 40 52 47 44"
        stroke={THEME.colors.outline}
        strokeWidth={2}
        fill="none"
        strokeLinecap="round"
      />

      {/* Arms */}
      <Path d="M 22 47 Q 10 57 10 73" stroke="#B8D4F0" strokeWidth={10} strokeLinecap="round" fill="none" />
      <Path d="M 22 47 Q 10 57 10 73" stroke={THEME.colors.outline} strokeWidth={2} strokeLinecap="round" fill="none" />
      {/* Hand left (rubbing eye) */}
      <Circle cx={13} cy={74} r={6} fill={THEME.colors.skin} stroke={THEME.colors.outline} strokeWidth={1.5} />

      <Path d="M 58 47 Q 70 57 70 73" stroke="#B8D4F0" strokeWidth={10} strokeLinecap="round" fill="none" />
      <Path d="M 58 47 Q 70 57 70 73" stroke={THEME.colors.outline} strokeWidth={2} strokeLinecap="round" fill="none" />
      <Circle cx={67} cy={74} r={6} fill={THEME.colors.skin} stroke={THEME.colors.outline} strokeWidth={1.5} />

      {/* Pajama pants */}
      <Path
        d="M 22 81 L 58 81 L 56 100 L 42 100 L 40 93 L 38 100 L 24 100 Z"
        fill="#B8D4F0"
        stroke={THEME.colors.outline}
        strokeWidth={2.5}
      />
      {[85, 91, 97].map((y) => (
        <Line
          key={`pant-stripe-${y}`}
          x1={23} y1={y}
          x2={57} y2={y}
          stroke="#90B8E0"
          strokeWidth={2}
          opacity={0.7}
        />
      ))}

      {/* Slippers */}
      <Rect x={22} y={98} width={16} height={6} rx={4} fill="#FFD080" stroke={THEME.colors.outline} strokeWidth={1.5} />
      <Rect x={42} y={98} width={16} height={6} rx={4} fill="#FFD080" stroke={THEME.colors.outline} strokeWidth={1.5} />
    </Svg>
  );
};
