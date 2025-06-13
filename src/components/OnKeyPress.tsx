import { useEffect } from 'react';

export function OnKeyPress({ key, on }: { key: string; on: () => void }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === key) on();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [key]);
  return null;
}