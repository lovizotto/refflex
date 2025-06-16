// hooks/useSignal.ts
import { useMemo, useSyncExternalStore } from 'react';
import { createSignal, createComputed, Signal } from '../core/signals';

/**
 * A hook to create a signal that is memoized for the component's lifecycle.
 * @param initialValue The initial value of the signal.
 * @returns A stable signal object.
 */
export function useSignal<T>(initialValue: T): Signal<T> {
  return useMemo(() => createSignal(initialValue), []);
}

/**
 * A hook to create a computed (derived) signal that is memoized.
 * It automatically updates when its underlying signals change.
 * @param computeFn The function to compute the value.
 * @returns A stable, read-only signal object.
 */
export function useComputed<T>(computeFn: () => T): Signal<T> {
  // The computeFn might not be stable, so we wrap it to ensure correctness
  // even though useMemo's dependencies are empty. The reactivity is handled by the signal system.
  const stableComputeFn = useMemo(() => computeFn, [computeFn]);
  return useMemo(() => createComputed(stableComputeFn), [stableComputeFn]);
}

/**
 * A hook that subscribes a component to a signal's value.
 * This will cause the component to re-render ONLY when the signal changes.
 * This is the primary bridge between signals and traditional React rendering.
 * @param signal The signal to subscribe to.
 * @returns The current value of the signal.
 */
export function useSignalValue<T>(signal: Signal<T>): T {
  // useSyncExternalStore is the canonical way to subscribe to external state in React.
  return useSyncExternalStore(
    signal.subscribe,
    signal.get,
    signal.peek // Server snapshot (optional but good practice)
  );
}
