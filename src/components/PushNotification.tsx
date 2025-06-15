// components/PushNotification.tsx
import { useEffect, useRef } from 'react';

interface PushNotificationProps {
  // If true, the component will actively ask for permission if it's 'default'.
  askPermission?: boolean;
  // Callback for when permission is granted.
  onGranted?: () => void;
  // Callback for when permission is denied.
  onDenied?: () => void;
  // Callback for when a push message is received from the service worker.
  onMessage?: (data: any) => void;
}

export function PushNotification({
                                   askPermission = true,
                                   onGranted,
                                   onDenied,
                                   onMessage,
                                 }: PushNotificationProps) {
  // --- Step 1: Use refs to store the latest callbacks ---
  // This is a critical optimization to prevent infinite loops.
  // The main effects will not depend on the callback props directly. Instead, they will
  // read the latest version of the callback from this ref.
  const onGrantedRef = useRef(onGranted);
  const onDeniedRef = useRef(onDenied);
  const onMessageRef = useRef(onMessage);

  // This effect runs on every render to ensure the refs are always up-to-date.
  useEffect(() => {
    onGrantedRef.current = onGranted;
    onDeniedRef.current = onDenied;
    onMessageRef.current = onMessage;
  });

  // --- Step 2: Handle Notification Permission ---
  // This effect is responsible *only* for checking and requesting permission.
  // It runs only when the `askPermission` prop changes.
  useEffect(() => {
    // Check for browser support first.
    if (!('Notification' in window) || !('serviceWorker' in navigator)) {
      console.warn('Push notifications are not supported in this browser.');
      return;
    }

    const handlePermission = (permission: NotificationPermission) => {
      if (permission === 'granted') {
        onGrantedRef.current?.();
      } else {
        onDeniedRef.current?.();
      }
    };

    // If permission is already granted or denied, immediately call the callback.
    if (Notification.permission !== 'default') {
      handlePermission(Notification.permission);
      return;
    }

    // If permission is 'default' and we are asked to request it, do so.
    if (askPermission) {
      Notification.requestPermission().then(handlePermission);
    }
  }, [askPermission]); // Only depends on `askPermission`.

  // --- Step 3: Listen for Incoming Messages ---
  // This effect is responsible *only* for listening to messages.
  // It sets up listeners and cleans them up properly on unmount.
  useEffect(() => {
    // If there's no onMessage handler, there's nothing to do.
    if (!onMessage) {
      return;
    }

    // Handler for messages from the service worker.
    const serviceWorkerHandler = (event: MessageEvent) => {
      // A common pattern is to wrap pushed data in a recognizable object.
      if (event.data?.type === 'push-message') {
        onMessageRef.current?.(event.data.data);
      }
    };

    // An AbortController is a robust way to cancel async operations during cleanup.
    const controller = new AbortController();

    const setupServiceWorkerListener = async () => {
      try {
        // Wait for the service worker to be ready.
        await navigator.serviceWorker.ready;

        // If the component unmounted while we were waiting, do nothing.
        if (controller.signal.aborted) {
          return;
        }

        navigator.serviceWorker.addEventListener('message', serviceWorkerHandler);
      } catch (error) {
        console.error('Service worker registration failed:', error);
      }
    };

    setupServiceWorkerListener();

    // The cleanup function is returned from the effect.
    return () => {
      // Signal to any ongoing async setup that it should stop.
      controller.abort();
      // Always attempt to remove the listener. It's safe to call
      // removeEventListener even if the listener was never added.
      navigator.serviceWorker.removeEventListener('message', serviceWorkerHandler);
    };
  }, [onMessage]); // Effect depends on `onMessage` to enable/disable listening.

  // This is a side-effect component; it does not render anything.
  return null;
}