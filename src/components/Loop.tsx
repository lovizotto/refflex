import React from "react";
import { Signal } from "../core/signals";
import { useSignalValue } from "../hooks/useSignal";

interface LoopProps<T> {
  /**
   * The array to iterate over. It can be:
   * 1. A plain array (T[]): The Loop will only re-render if a new array reference is passed from the parent.
   * 2. A signal (Signal<T[]>): The Loop will automatically react to changes in the signal, ensuring granular re-renders.
   */
  each: T[] | Signal<T[]>;
  /**
   * A function that renders each item of the array.
   * Receives the item and its index.
   */
  children: (item: T, index: number) => React.ReactNode;
  /**
   * (Optional) A function to extract a unique key from each item.
   * If not provided, the Loop will try to use 'item.id' or the index as a fallback.
   */
  keyExtractor?: (item: T, index: number) => React.Key;
}

/**
 * A declarative and flexible Loop component.
 * It accepts both plain arrays and array signals for granular re-rendering.
 */
export function Loop<T>({ each, children, keyExtractor }: LoopProps<T>) {
  // 1. Unconditionally check if 'each' is a signal.
  // This check is robust for the new signal object structure.
  const isSignal =
    typeof each === "object" &&
    each !== null &&
    "get" in each &&
    "subscribe" in each;

  // 2. Unconditionally get the array value.
  // The useSignalValue hook is called at the top level, respecting the Rules of Hooks.
  // The conditional logic is inside the expression, which is perfectly fine.
  const items = isSignal ? useSignalValue(each as Signal<T[]>) : (each as T[]);

  // 3. Unconditionally run an effect for warnings.
  React.useEffect(() => {
    if (!isSignal) {
      console.warn(
        "Loop: You are using a plain array for the 'each' prop. This component will not automatically react to mutations of the array. It will only re-render if the parent passes a new array reference. For automatic reactivity, use a signal.",
      );
    }
  }, [isSignal, each]); // Dependency array ensures this runs only when necessary.

  // 4. Unconditionally define the key extraction logic.
  const getRenderKey = React.useCallback(
    (item: T, index: number): React.Key => {
      if (keyExtractor) {
        return keyExtractor(item, index);
      }
      if (
        typeof item === "object" &&
        item !== null &&
        "id" in item &&
        (typeof (item as any).id === "string" ||
          typeof (item as any).id === "number")
      ) {
        return (item as any).id;
      }
      return index; // Fallback to index if no key is found.
    },
    [keyExtractor],
  );

  return (
    <>
      {items.map((item, index) => {
        const key = getRenderKey(item, index);
        // The key is applied here directly, not passed down to children.
        // Using a Fragment ensures we can apply a key without adding an extra DOM element.
        return (
          <React.Fragment key={key}>{children(item, index)}</React.Fragment>
        );
      })}
    </>
  );
}
