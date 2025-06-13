import { useEffect, useRef, useState } from 'react';

export function Deferred({ delay = 0, whenInView = false, children }: {
  delay?: number;
  whenInView?: boolean;
  children: React.ReactNode;
}) {
  const [visible, setVisible] = useState(!whenInView);
  const [ready, setReady] = useState(delay === 0);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (whenInView && ref.current) {
      const observer = new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      });
      observer.observe(ref.current);
      return () => observer.disconnect();
    }
  }, [whenInView]);

  useEffect(() => {
    if (delay > 0) {
      const timeout = setTimeout(() => setReady(true), delay);
      return () => clearTimeout(timeout);
    }
  }, [delay]);

  if (!visible || !ready) return <div ref={ref} />;
  return <>{children}</>;
}
