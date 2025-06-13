export function BindInput({ signal, ...props }: {
  signal: [() => string, (val: string) => void];
  [key: string]: any;
}) {
  const [get, set] = signal;
  return <input value={get()} onChange={(e) => set(e.target.value)} {...props} />;
}