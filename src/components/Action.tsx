import { useEffect } from 'react';
import { trackSignal } from '../core/createSignal';

/**
 * Action Component
 * 
 * A utility component that watches for changes in values and triggers a callback when they change.
 * This component doesn't render anything visible but provides reactive functionality.
 * 
 * @component
 * @example
 * ```tsx
 * // Watch a single value
 * <Action 
 *   watch={() => count()} 
 *   onTrigger={(value) => console.log('Count changed:', value)} 
 * />
 * 
 * // Watch multiple values
 * <Action 
 *   watch={[() => count(), () => name()]} 
 *   onTrigger={(values) => console.log('Values changed:', values)} 
 * />
 * 
 * // Trigger immediately on mount
 * <Action 
 *   watch={() => count()} 
 *   onTrigger={(value) => console.log('Initial count:', value)} 
 *   immediate={true} 
 * />
 * ```
 */
export function Action({
  watch,
  onTrigger,
  immediate = false,
}: {
  /** 
   * A function or array of functions that return values to watch for changes.
   * Each function should return a value that can be tracked.
   */
  watch?: (() => any) | Array<() => any>;

  /**
   * Callback function that is called when the watched values change.
   * Receives the new value(s) as its argument.
   */
  onTrigger: (val?: any) => void;

  /**
   * If true, the onTrigger callback will be called immediately when the component mounts.
   * Default is false.
   */
  immediate?: boolean;
}) {
  useEffect(() => {
    /**
     * This effect runs only once on component mount (empty dependency array).
     * It sets up the reactive tracking for the watched values.
     */

    // Handle immediate trigger on mount if the immediate flag is true
    if (immediate) {
      // If watch is an array, call each function and collect the results
      // Otherwise, call the single watch function
      const val = Array.isArray(watch) ? watch.map((fn) => fn()) : watch?.();
      // Trigger the callback with the initial value(s)
      onTrigger?.(val);
    }

    // Case 1: Handle single watch function
    if (watch && !Array.isArray(watch)) {
      /**
       * Create a run function that:
       * 1. Gets the current value from the watch function
       * 2. Calls onTrigger with that value
       */
      const run = () => {
        const val = watch();
        onTrigger(val);
      };
      // Set up tracking for the watch function
      // This will re-run the run function whenever the watched value changes
      trackSignal(run, watch);
    }

    // Case 2: Handle array of watch functions
    if (watch && Array.isArray(watch)) {
      /**
       * Create a single runAll function that:
       * 1. Gets all current values from all watch functions
       * 2. Calls onTrigger with an array of those values
       */
      const runAll = () => {
        const values = watch.map(fn => fn());
        onTrigger(values);
      };

      /**
       * For each watch function in the array:
       * 1. Create a tracker function that calls runAll
       * 2. Set up tracking for that watch function
       * 
       * This ensures that whenever ANY of the watched values changes,
       * the runAll function is called, which collects ALL current values
       * and passes them to onTrigger.
       */
      watch.forEach(watchFn => {
        const tracker = () => runAll();
        trackSignal(tracker, watchFn);
      });
    }
  }, []);

  return null;
}
