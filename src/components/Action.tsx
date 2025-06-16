import { useEffect, useRef } from 'react';
import { createEffect, Signal } from '../core/signals';

// Helper to robustly check if a value is a signal object
function isSignal<T>(val: any): val is Signal<T> {
  return typeof val === 'object' && val !== null && 'get' in val && 'subscribe' in val;
}

type ActionProps<T> = {
  /**
   * The value(s) to watch. Can be a signal, a plain value (from useState),
   * or an array of signals/values.
   */
  watch: T | Signal<T> | (T | Signal<T>)[];
  /**
   * The callback function that is triggered when any of the watched values change.
   * It receives the new value or an array of new values.
   */
  onTrigger: (value: T | T[]) => void;
  /**
   * If true, the onTrigger callback will be called immediately when the component mounts.
   * @default false
   */
  immediate?: boolean;
};

/**
 * A utility component that creates a reactive side-effect. It watches for changes
 * in signals or plain React state and triggers a callback function in response.
 * This component does not render any visible UI.
 */
export function Action<T>({
                            watch,
                            onTrigger,
                            immediate = false,
                          }: ActionProps<T>) {
  // Use a ref to track the initial render, ensuring the 'immediate' flag is respected.
  const isInitialMount = useRef(true);

  useEffect(() => {
    // Check if we are watching a signal or an array of signals.
    const isWatchingSignal = Array.isArray(watch)
      ? watch.length > 0 && isSignal(watch[0])
      : isSignal(watch);

    if (isWatchingSignal) {
      // --- Signal-based reactivity ---
      const dispose = createEffect(() => {
        // Automatically subscribes to all signals read within this block.
        const value = Array.isArray(watch)
          ? (watch as Signal<T>[]).map(s => s.get())
          : (watch as Signal<T>).get();

        if (isInitialMount.current && !immediate) {
          // Don't trigger on the first run if 'immediate' is false.
        } else {
          onTrigger(value);
        }

        isInitialMount.current = false;
      });

      // Cleanup the signal effect when the component unmounts or props change.
      return () => {
        dispose();
        isInitialMount.current = true; // Reset for the next effect setup.
      };
    } else {
      // --- Standard React reactivity (for useState values) ---
      // This logic runs because 'watch' is in the dependency array.
      if (isInitialMount.current && !immediate) {
        // Skip the initial trigger if not immediate.
      } else {
        onTrigger(watch as T | T[]);
      }

      isInitialMount.current = false;
    }
  }, [watch, onTrigger, immediate]); // This dependency array drives the reactivity for plain values.

  return null; // This component does not render anything.
}
