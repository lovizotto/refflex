import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';

export function Portal({ children }: { children: React.ReactNode }) {
  const [el] = useState(() => document.createElement('div'));

  useEffect(() => {
    document.body.appendChild(el);
    return () => void document.body.removeChild(el);
  }, [el]);

  return createPortal(children, el);
}
