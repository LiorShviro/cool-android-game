import { useState, useEffect } from 'react';

export const useUIScale = () => {
  const [dims, setDims] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handler = () => setDims({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const scale = Math.min(1.25, Math.max(0.92, dims.width / 360));
  return { width: dims.width, height: dims.height, scale };
};
