import React from "react";
import { useComputed, useSignalValue } from "../hooks/useSignal";

type RunProps<T> = {
  /**
   * A function that computes a value from one or more signals or state values.
   * The component will re-render when this computed value changes.
   */
  watch: () => T;
  /**
   * A render-prop function that receives the computed value.
   */
  children: (value: T) => React.ReactNode;
};

/**
 * A component that computes a value based on signals or props and re-renders
 * its children whenever that value changes. It is optimized for signals,
 * preventing parent re-renders, but remains compatible with plain state.
 *
 * @example
 * // With a signal (optimized)
 * const count = useSignal(0);
 * <Run watch={() => `Count is ${count.get()}`}>
 * {(text) => <p>{text}</p>}
 * </Run>
 *
 * // With useState (compatible)
 * const [count, setCount] = useState(0);
 * <Run watch={() => `Count is ${count}`}>
 * {(text) => <p>{text}</p>}
 * </Run>
 */
export function Run<T>({ watch, children }: RunProps<T>) {
  // 1. Create a memoized, derived signal from the watch function.
  // `useComputed` handles the effect and dependency tracking automatically.
  // It subscribes to signals if `get()` is used, or re-evaluates on re-render for plain values.
  const computedSignal = useComputed(watch);

  // 2. Subscribe this component to the computed signal.
  // This will cause the Run component (and only this component) to re-render
  // when the computed signal's value changes.
  const value = useSignalValue(computedSignal);

  // 3. Render the children with the latest reactive value.
  const result = children(value);

  // Handle cases where the render prop might return undefined.
  return result === undefined ? null : <>{result}</>;
}
