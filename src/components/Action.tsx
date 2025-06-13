import { useEffect } from 'react';
import { trackSignal } from '../core/createSignal';

export function Action({
  watch,
  onTrigger,
  immediate = false,
}: {
  watch?: (() => any) | Array<() => any>;
  onTrigger: (val?: any) => void;
  immediate?: boolean;
}) {
  useEffect(() => {
    // Handle immediate trigger on mount
    if (immediate) {
      const val = Array.isArray(watch) ? watch.map((fn) => fn()) : watch?.();
      onTrigger?.(val);
    }

    // Handle single watch function
    if (watch && !Array.isArray(watch)) {
      const run = () => {
        const val = watch();
        onTrigger(val);
      };
      trackSignal(run, watch);
    }

    // Handle array of watch functions
    if (watch && Array.isArray(watch)) {
      // Create a single run function that gets all values
      const runAll = () => {
        const values = watch.map(fn => fn());
        onTrigger(values);
      };

      // Track each watch function individually
      watch.forEach(watchFn => {
        // Create a separate tracker for each watch function
        // that calls runAll when the watched value changes
        const tracker = () => runAll();
        trackSignal(tracker, watchFn);
      });
    }
  }, []);

  return null;
}
