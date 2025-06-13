import { useMemo } from 'react';

export function Memo<T>({ deps, compute, children }: {
  deps: React.DependencyList;
  compute: () => T;
  children: (value: T) => React.ReactNode;
}) {
  const result = useMemo(compute, deps);
  return <>{children(result)}</>;
}