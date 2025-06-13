import { useEffect } from 'react';

export function History({ onChange }: { onChange: (path: string) => void }) {
  useEffect(() => {
    const handler = () => onChange(window.location.pathname);
    window.addEventListener('popstate', handler);
    handler();
    return () => window.removeEventListener('popstate', handler);
  }, []);
  return null;
}

export function PushState({ to }: { to: string }) {
  useEffect(() => {
    window.history.pushState({}, '', to);
  }, [to]);
  return null;
}