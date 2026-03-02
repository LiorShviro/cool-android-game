import { useMemo } from 'react';
import { useWindowDimensions } from 'react-native';

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

export const useUIScale = () => {
  const { width, height } = useWindowDimensions();
  const scale = useMemo(() => clamp(width / 360, 0.92, 1.25), [width]);

  return {
    width,
    height,
    scale,
  };
};
