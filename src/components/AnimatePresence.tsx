import { useEffect, useState } from 'react';

export function AnimatePresence({ show, children, duration = 300 }: {
  show: boolean;
  children: React.ReactNode;
  duration?: number;
}) {
  const [render, setRender] = useState(show);

  useEffect(() => {
    if (show) setRender(true);
    else setTimeout(() => setRender(false), duration);
  }, [show, duration]);

  return (
    <div
      style={{
        opacity: show ? 1 : 0,
        transition: `opacity ${duration}ms ease`,
      }}
    >
      {render && children}
    </div>
  );
}