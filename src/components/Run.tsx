import { useEffect, useState } from 'react';
import { trackSignal } from '../core/createSignal';

export function Run<T>({
  watch,
  children,
}: {
  watch: () => T;
  children: (val: T) => React.ReactNode;
}) {
  const [, forceRender] = useState(0);
  const [current, setCurrent] = useState(watch());

  useEffect(() => {
    const rerun = () => {
      setCurrent(watch());
      forceRender((x) => x + 1);
    };
    trackSignal(rerun, watch);
  }, [watch]);

  const result = children(current);
  return typeof result === 'undefined' ? null : <>{result}</>;
}
