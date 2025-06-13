// components/Rf/ServiceWorker.tsx
import { useEffect } from 'react';

interface ServiceWorkerProps {
  path: string;
  onRegistered?: (reg: ServiceWorkerRegistration) => void;
  onUpdate?: () => void;
  onError?: (err: unknown) => void;
}

export function ServiceWorker({ path, onRegistered, onUpdate, onError }: ServiceWorkerProps) {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return;

    navigator.serviceWorker.register(path)
      .then((registration) => {
        onRegistered?.(registration);

        registration.onupdatefound = () => {
          const installing = registration.installing;
          if (!installing) return;

          installing.onstatechange = () => {
            if (installing.state === 'installed' && navigator.serviceWorker.controller) {
              onUpdate?.();
            }
          };
        };
      })
      .catch((err) => onError?.(err));
  }, [path]);

  return null;
}
