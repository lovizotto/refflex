import { useEffect } from 'react';

export function OnResize({ on }: { on: (size: { width: number; height: number }) => void }) {
  useEffect(() => {
    const handler = () => {
      on({ width: window.innerWidth, height: window.innerHeight });
    };
    handler(); // trigger initially
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return null;
}