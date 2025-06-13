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
    // Check if browser supports Notifications and service workers
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('Push notifications are not supported in this browser');
      return;
    }

    // Request permission if needed
    if (askPermission && Notification.permission === 'default') {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') onGranted?.();
        else onDenied?.();
      });
    } else {
      if (Notification.permission === 'granted') onGranted?.();
      else if (Notification.permission === 'denied') onDenied?.();
    }

    // Handler for push messages from service worker
    const serviceWorkerHandler = (event: MessageEvent) => {
      if (event.data?.type === 'push') {
        onMessage?.(event.data.data);
      }
    };

    // Handler for push messages from window (for testing/storybook)
    const windowHandler = (event: MessageEvent) => {
      if (event.data?.type === 'push') {
        onMessage?.(event.data.data);
      }
    };

    // Set up event listeners
    let cleanup: (() => void) | undefined;

    // Add window event listener for testing/storybook
    window.addEventListener('message', windowHandler);

    // Set up service worker event listener if ready
    navigator.serviceWorker.ready
      .then(() => {
        navigator.serviceWorker.addEventListener('message', serviceWorkerHandler);
        cleanup = () => {
          navigator.serviceWorker.removeEventListener('message', serviceWorkerHandler);
          window.removeEventListener('message', windowHandler);
        };
      })
      .catch(error => {
        console.error('Service worker registration failed:', error);
        // Still need to clean up window event listener
        cleanup = () => {
          window.removeEventListener('message', windowHandler);
        };
      });

    // Clean up function
    return () => {
      if (cleanup) cleanup();
    };
  }, [askPermission, onGranted, onDenied, onMessage]);

  return null;
}
