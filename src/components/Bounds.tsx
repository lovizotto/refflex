import { useLayoutEffect } from 'react';

export function Bounds({ of, onChange }: { of: React.RefObject<HTMLElement>, onChange: (rect: DOMRect) => void }) {
  useLayoutEffect(() => {
    if (!of.current) return;
    const observer = new ResizeObserver(() => {
      if (of.current) {
        onChange(of.current.getBoundingClientRect());
      }
    });
    observer.observe(of.current);
    return () => observer.disconnect();
  }, [of, onChange]);
  return null;
}
