import React from 'react';
import Svg, { Circle, Rect, Path, Ellipse, G, Line } from 'react-native-svg';
import { THEME } from '../../theme';

export type Mood = 'neutral' | 'impatient' | 'urgent';

interface SabaCharacterProps {
  mood?: Mood;
  size?: number;
}

export const SabaCharacter: React.FC<SabaCharacterProps> = ({ mood = 'neutral', size = 70 }) => {
  const eyeRy = mood === 'impatient' ? 1.8 : mood === 'urgent' ? 4.5 : 2.8;
  const eyeRx = mood === 'urgent' ? 3.5 : 2.5;

  return (
    <Svg width={size} height={size * 1.3} viewBox="0 0 80 104">
      {/* Hair tufts at sides (back layer) */}
      <Ellipse cx={22} cy={16} rx={9} ry={6} fill={THEME.colors.charHairGray} />
      <Ellipse cx={58} cy={16} rx={9} ry={6} fill={THEME.colors.charHairGray} />

      {/* Head */}
      <Circle cx={40} cy={22} r={18} fill={THEME.colors.skin} stroke={THEME.colors.outline} strokeWidth={2.5} />

      {/* Eyebrows */}
      {mood === 'neutral' && (
        <>
          <Path d="M 28 13 Q 33 11 36 13" stroke={THEME.colors.charHairGray} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M 44 13 Q 47 11 52 13" stroke={THEME.colors.charHairGray} strokeWidth={2} fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === 'impatient' && (
        <>
          <Path d="M 28 12 Q 33 14 36 12" stroke={THEME.colors.charHairGray} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path d="M 44 12 Q 47 14 52 12" stroke={THEME.colors.charHairGray} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === 'urgent' && (
        <>
          <Path d="M 27 11 Q 32 15 36 11" stroke={THEME.colors.charHairGray} strokeWidth={3} fill="none" strokeLinecap="round" />
          <Path d="M 44 11 Q 48 15 53 11" stroke={THEME.colors.charHairGray} strokeWidth={3} fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Glasses frames */}
      <Ellipse cx={32} cy={21} rx={7} ry={5.5} fill="white" fillOpacity={0.7} stroke={THEME.colors.outline} strokeWidth={1.8} />
      <Ellipse cx={48} cy={21} rx={7} ry={5.5} fill="white" fillOpacity={0.7} stroke={THEME.colors.outline} strokeWidth={1.8} />
      <Line x1={39} y1={21} x2={41} y2={21} stroke={THEME.colors.outline} strokeWidth={1.8} />
      <Line x1={25} y1={21} x2={22} y2={20} stroke={THEME.colors.outline} strokeWidth={1.5} />
      <Line x1={55} y1={21} x2={58} y2={20} stroke={THEME.colors.outline} strokeWidth={1.5} />

      {/* Eyes */}
      <Ellipse cx={32} cy={21} rx={eyeRx} ry={eyeRy} fill={THEME.colors.outline} />
      <Ellipse cx={48} cy={21} rx={eyeRx} ry={eyeRy} fill={THEME.colors.outline} />
      {/* Eye shine */}
      <Circle cx={33.5} cy={19.5} r={1} fill="white" />
      <Circle cx={49.5} cy={19.5} r={1} fill="white" />

      {/* Nose */}
      <Ellipse cx={40} cy={27} rx={2.5} ry={2} fill={THEME.colors.skinDark} />

      {/* Mouth */}
      {mood === 'neutral' && <Path d="M 33 32 Q 40 38 47 32" stroke={THEME.colors.outline} strokeWidth={2.2} fill="none" strokeLinecap="round" />}
      {mood === 'impatient' && <Path d="M 33 35 Q 40 31 47 35" stroke={THEME.colors.outline} strokeWidth={2.2} fill="none" strokeLinecap="round" />}
      {mood === 'urgent' && <Ellipse cx={40} cy={34} rx={6} ry={4.5} fill={THEME.colors.outline} />}

      {/* Neck */}
      <Rect x={35} y={38} width={10} height={7} fill={THEME.colors.skin} />

      {/* Body — white tank top with wide belly */}
      <Path
        d="M 18 45 L 62 45 L 66 82 L 14 82 Z"
        fill="white"
        stroke={THEME.colors.outline}
        strokeWidth={2.5}
      />
      {/* Belly bulge */}
      <Ellipse
        cx={40} cy={66}
        rx={22} ry={17}
        fill={THEME.colors.skin}
        stroke={THEME.colors.outline}
        strokeWidth={2.5}
      />
      {/* Tank top straps */}
      <Rect x={27} y={45} width={9} height={20} fill="white" stroke={THEME.colors.outline} strokeWidth={1.5} rx={1} />
      <Rect x={44} y={45} width={9} height={20} fill="white" stroke={THEME.colors.outline} strokeWidth={1.5} rx={1} />

      {/* Arms */}
      <Path d="M 20 48 Q 8 58 10 73" stroke={THEME.colors.skin} strokeWidth={9} strokeLinecap="round" fill="none" />
      <Path d="M 60 48 Q 72 58 70 73" stroke={THEME.colors.skin} strokeWidth={9} strokeLinecap="round" fill="none" />
      {/* Arm outlines */}
      <Path d="M 20 48 Q 8 58 10 73" stroke={THEME.colors.outline} strokeWidth={2} strokeLinecap="round" fill="none" />
      <Path d="M 60 48 Q 72 58 70 73" stroke={THEME.colors.outline} strokeWidth={2} strokeLinecap="round" fill="none" />

      {/* Shorts */}
      <Path
        d="M 16 81 L 64 81 L 62 97 L 43 97 L 40 90 L 37 97 L 18 97 Z"
        fill={THEME.colors.charClothBlue}
        stroke={THEME.colors.outline}
        strokeWidth={2.5}
      />

      {/* Feet/sandals */}
      <Rect x={20} y={95} width={16} height={6} rx={3} fill={THEME.colors.wood} stroke={THEME.colors.outline} strokeWidth={1.5} />
      <Rect x={44} y={95} width={16} height={6} rx={3} fill={THEME.colors.wood} stroke={THEME.colors.outline} strokeWidth={1.5} />
    </Svg>
  );
};
