import { useEffect } from 'react';
import { trackSignal } from '../core/createSignal';

export function OnUpdate<T>({
  watch,
  children,
}: {
  watch: () => T;
  children: (value: T) => void;
}) {
  useEffect(() => {
    const run = () => children(watch());
    trackSignal(run, watch);
  }, [watch]);

  return null;
}
