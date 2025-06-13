export function BindText({ signal }: { signal: () => string }) {
  return <>{signal()}</>;
}