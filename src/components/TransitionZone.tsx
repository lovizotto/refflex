import { startTransition } from 'react';
import { useState, useEffect } from 'react';

export function TransitionZone({ children }: { children: React.ReactNode }) {
  const [content, setContent] = useState<React.ReactNode>(null);

  useEffect(() => {
    startTransition(() => {
      setContent(children);
    });
  }, [children]);

  return <>{content}</>;
}
