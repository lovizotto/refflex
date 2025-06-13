import { useEffect, useState } from 'react';
import { trackSignal } from '../core/createSignal';

type SignalGetter<T> = () => T;

type SignalProps<T> = {
  value: SignalGetter<T>;
  children: (val: T) => React.ReactNode;
};

export function Signal<T>({ value, children }: SignalProps<T>) {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const rerender = () => {
      forceRender((x) => x + 1);
    };

    trackSignal(rerender, value);
  }, [value]);

  return <>{children(value())}</>;
}