import React from 'react';
import Svg, { Circle, Rect, Path, Ellipse } from 'react-native-svg';
import { THEME } from '../../theme';
import { Mood } from './SabaCharacter';

interface DogCharacterProps {
  mood?: Mood;
  size?: number;
}

export const DogCharacter: React.FC<DogCharacterProps> = ({ mood = 'neutral', size = 70 }) => {
  const eyeRy = mood === 'urgent' ? 4.5 : mood === 'impatient' ? 2 : 2.8;
  const eyeRx = mood === 'urgent' ? 3.5 : 2.5;
  // Tail wagging: neutral/impatient = curved up, urgent = drooping
  const tailPath = mood === 'urgent'
    ? 'M 65 45 Q 78 55 74 68'
    : 'M 65 42 Q 80 30 76 18';

  return (
    <Svg width={size} height={size * 1.0} viewBox="0 0 80 80">
      {/* Tail */}
      <Path
        d={tailPath}
        stroke={THEME.colors.charDogBrown}
        strokeWidth={8}
        fill="none"
        strokeLinecap="round"
      />
      <Path
        d={tailPath}
        stroke={THEME.colors.outline}
        strokeWidth={1.8}
        fill="none"
        strokeLinecap="round"
      />

      {/* Body */}
      <Ellipse
        cx={40} cy={52}
        rx={28} ry={20}
        fill={THEME.colors.charDogBrown}
        stroke={THEME.colors.outline}
        strokeWidth={2.5}
      />
      {/* Body spots */}
      <Ellipse cx={30} cy={56} rx={8} ry={6} fill={THEME.colors.charDogSpot} opacity={0.8} />
      <Ellipse cx={50} cy={48} rx={6} ry={5} fill={THEME.colors.charDogSpot} opacity={0.7} />

      {/* Legs */}
      <Rect x={16} y={64} width={10} height={14} rx={5} fill={THEME.colors.charDogBrown} stroke={THEME.colors.outline} strokeWidth={2} />
      <Rect x={30} y={66} width={10} height={12} rx={5} fill={THEME.colors.charDogBrown} stroke={THEME.colors.outline} strokeWidth={2} />
      <Rect x={44} y={66} width={10} height={12} rx={5} fill={THEME.colors.charDogBrown} stroke={THEME.colors.outline} strokeWidth={2} />
      <Rect x={58} y={64} width={10} height={14} rx={5} fill={THEME.colors.charDogBrown} stroke={THEME.colors.outline} strokeWidth={2} />

      {/* Head */}
      <Circle
        cx={16} cy={38}
        r={18}
        fill={THEME.colors.charDogBrown}
        stroke={THEME.colors.outline}
        strokeWidth={2.5}
      />
      {/* Lighter face patch */}
      <Ellipse cx={16} cy={41} rx={12} ry={10} fill="#E0A060" />

      {/* Ears (floppy) */}
      <Ellipse
        cx={4} cy={30}
        rx={7} ry={12}
        fill={THEME.colors.charDogSpot}
        stroke={THEME.colors.outline}
        strokeWidth={2}
      />
      <Ellipse
        cx={28} cy={26}
        rx={7} ry={12}
        fill={THEME.colors.charDogSpot}
        stroke={THEME.colors.outline}
        strokeWidth={2}
      />

      {/* Eyes */}
      <Ellipse cx={11} cy={34} rx={eyeRx} ry={eyeRy} fill={THEME.colors.outline} />
      <Ellipse cx={22} cy={34} rx={eyeRx} ry={eyeRy} fill={THEME.colors.outline} />
      <Circle cx={12.5} cy={32.5} r={1} fill="white" />
      <Circle cx={23.5} cy={32.5} r={1} fill="white" />

      {/* Nose */}
      <Ellipse cx={16} cy={43} rx={5} ry={3.5} fill="#2D2D2D" />
      <Circle cx={14.5} cy={42} r={1.5} fill="#555" />

      {/* Mouth */}
      {(mood === 'neutral' || mood === 'impatient') && (
        <>
          <Path d="M 11 46 Q 16 50 21 46" stroke={THEME.colors.outline} strokeWidth={2} fill="none" strokeLinecap="round" />
          {/* Tongue */}
          <Ellipse cx={16} cy={50} rx={5} ry={4} fill="#FF8888" stroke={THEME.colors.outline} strokeWidth={1.5} />
          <Path d="M 13 50 Q 16 54 19 50" stroke={THEME.colors.outline} strokeWidth={1} fill="none" />
        </>
      )}
      {mood === 'urgent' && (
        <>
          <Path d="M 11 45 Q 16 43 21 45" stroke={THEME.colors.outline} strokeWidth={2} fill="none" strokeLinecap="round" />
        </>
      )}

      {/* Eyebrows for mood */}
      {mood === 'impatient' && (
        <>
          <Path d="M 8 29 Q 11 27 14 29" stroke={THEME.colors.charDogSpot} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M 18 29 Q 21 27 25 29" stroke={THEME.colors.charDogSpot} strokeWidth={2} fill="none" strokeLinecap="round" />
        </>
      )}
      {mood === 'urgent' && (
        <>
          <Path d="M 7 28 Q 11 32 14 28" stroke={THEME.colors.charDogSpot} strokeWidth={2.5} fill="none" strokeLinecap="round" />
          <Path d="M 18 28 Q 21 32 25 28" stroke={THEME.colors.charDogSpot} strokeWidth={2.5} fill="none" strokeLinecap="round" />
        </>
      )}
    </Svg>
  );
};
