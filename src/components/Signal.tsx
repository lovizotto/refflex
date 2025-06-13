// components/Signal.tsx
import React, { useSyncExternalStore, useCallback } from 'react';
import type { SignalRead } from '../core/createSignal';

type SignalProps<T> = {
  value: SignalRead<T>;
  children: (val: T) => React.ReactNode;
};

export function Signal<T>({ value: signalGetter, children }: SignalProps<T>) {
  const subscribe = useCallback(
    (callback: () => void) => {
      return signalGetter.subscribe(callback);
    },
    [signalGetter],
  );

  const getSnapshot = useCallback(() => {
    return signalGetter();
  }, [signalGetter]);

  const currentSignal = useSyncExternalStore(subscribe, getSnapshot);

  return <>{children(currentSignal)}</>;
}