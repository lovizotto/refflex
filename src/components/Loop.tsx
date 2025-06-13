export function Loop<T>({ each, children }: {
  each: () => T[];
  children: (item: T, index: number) => React.ReactNode;
}) {
  const arr = typeof each === 'function' ? each() : each;
  return <>{arr.map((item, i) => children(item, i))}</>;
}