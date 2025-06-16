import { Signal } from '../core/signals.ts';
import { useSignalValue } from '../hooks/useSignal.ts';
import { useEffect } from 'react';

/**
 * A declarative timer component for side-effects.
 * It can be controlled by a boolean signal or a plain boolean prop.
 */
export const Timer = ({
  delay,
  do: action,
  interval = false,
  enabled = true,
}: {
  delay: number;
  do: () => void;
  interval?: boolean;
  enabled?: boolean | Signal<boolean>;
}) => {
  // Check if 'enabled' is a signal
  const isSignal =
    typeof enabled === 'object' && enabled !== null && 'get' in enabled;
  // Get the boolean value, either from the signal or directly
  const isEnabled = isSignal
    ? useSignalValue(enabled as Signal<boolean>)
    : enabled;

  useEffect(() => {
    // Only set up the timer if it's enabled
    if (isEnabled) {
      const id = interval
        ? setInterval(action, delay)
        : setTimeout(action, delay);
      // The cleanup function will run when isEnabled becomes false or on unmount
      return () => {
        interval ? clearInterval(id) : clearTimeout(id);
      };
    }
  }, [delay, action, interval, isEnabled]); // Depend on the resolved boolean value

  return null; // This component is for side-effects only
};
