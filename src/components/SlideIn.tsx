import { useEffect, useState } from 'react';

export function SlideIn({ children, from = 'left', distance = 20, duration = 300 }: {
  children: React.ReactNode;
  from?: 'left' | 'right' | 'top' | 'bottom';
  distance?: number;
  duration?: number;
}) {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), 10);
    return () => clearTimeout(t);
  }, []);

  const transformMap: Record<string, string> = {
    left: `translateX(-${distance}px)`,
    right: `translateX(${distance}px)`,
    top: `translateY(-${distance}px)`,
    bottom: `translateY(${distance}px)`
  };

  return (
    <div
      style={{
        transform: entered ? 'translate(0, 0)' : transformMap[from],
        transition: `transform ${duration}ms ease-in-out`
      }}
    >
      {children}
    </div>
  );
}