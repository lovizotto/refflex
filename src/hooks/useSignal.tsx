// ===================================================================
// FILE: react/hooks-and-components.ts
// ===================================================================
import { useMemo } from "react";
import { createComputed, createSignal, Signal } from "../core/signals";

/**
 * [HOOK] Creates a reactive signal, memoized for the component's lifecycle.
 */
export function useSignal<T>(initialValue: T): Signal<T> {
  return useMemo(() => createSignal(initialValue), []);
}

/**
 * [HOOK] Creates a computed (derived) signal that is memoized.
 */
export function useComputed<T>(computeFn: () => T): Signal<T> {
  const stableComputeFn = useMemo(() => computeFn, [computeFn]);
  return useMemo(() => createComputed(stableComputeFn), [stableComputeFn]);
}
