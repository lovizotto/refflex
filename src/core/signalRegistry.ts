// Pode ficar em core/signalRegistry.ts

type Listener = () => void;
const registry = new WeakMap<Function, Set<Listener>>();

export function subscribeToSignal<T>(signal: () => T, fn: Listener) {
  if (!registry.has(signal)) {
    registry.set(signal, new Set());
  }
  registry.get(signal)!.add(fn);
  return () => registry.get(signal)!.delete(fn);
}

export function notify(signal: () => unknown) {
  registry.get(signal)?.forEach((fn) => fn());
}