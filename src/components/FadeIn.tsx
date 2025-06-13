import { useEffect, useState } from 'react';

export function FadeIn({ children, duration = 300 }: {
  children: React.ReactNode;
  duration?: number;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{
      opacity: visible ? 1 : 0,
      transition: `opacity ${duration}ms ease-in-out`
    }}>
      {children}
    </div>
  );
}