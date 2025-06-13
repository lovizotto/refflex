import { useEffect } from 'react';

interface PushNotificationProps {
  askPermission?: boolean;
  onGranted?: () => void;
  onDenied?: () => void;
  onMessage?: (data: any) => void;
}

export function PushNotification({
  askPermission = true,
  onGranted,
  onDenied,
  onMessage,
}: PushNotificationProps) {
  useEffect(() => {
    if (!('Notification' in window) || !('serviceWorker' in navigator)) return;

    // Solicita permissão se necessário
    if (askPermission && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') onGranted?.();
        else onDenied?.();
      });
    } else {
      if (Notification.permission === 'granted') onGranted?.();
      else if (Notification.permission === 'denied') onDenied?.();
    }

    // Escuta mensagens vindas do service worker
    const handler = (event: MessageEvent) => {
      if (event.data?.type === 'push') {
        onMessage?.(event.data.data);
      }
    };

    navigator.serviceWorker.addEventListener('message', handler);

    return () => {
      navigator.serviceWorker.removeEventListener('message', handler);
    };
  }, [askPermission, onGranted, onDenied, onMessage]);

  return null;
}
