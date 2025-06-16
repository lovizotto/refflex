import React, { useEffect, useState } from "react";
import { createEffect, Signal } from "../core/signals";

// Helper to check if a value is a signal object
function isSignal<T>(val: any): val is Signal<T> {
  return (
    typeof val === "object" &&
    val !== null &&
    "get" in val &&
    "subscribe" in val
  );
}

type TimerProps = {
  /**
   * The delay in milliseconds between triggers.
   */
  delay: number;
  /**
   * The action to perform when the timer triggers.
   */
  do: () => void;
  /**
   * If true, the timer will run repeatedly at the given delay.
   * If false, it will run only once.
   * @default false
   */
  interval?: boolean;
  /**
   * A boolean or a signal that controls whether the timer is active.
   * @default true
   */
  enabled?: boolean | Signal<boolean>;
};

/**
 * A declarative component for creating side-effects based on timers.
 * It is optimized to react to signals but is also compatible with plain boolean props,
 * making it versatile for different state management strategies.
 */
export function Timer({
  delay,
  do: action,
  interval = false,
  enabled = true,
}: TimerProps) {
  // Unify the 'enabled' prop (which can be a signal or a boolean) into a single state variable.
  // This respects the Rules of Hooks by not calling hooks conditionally.
  const [isEnabled, setIsEnabled] = useState(() =>
    isSignal(enabled) ? enabled.peek() : enabled,
  );

  // This effect synchronizes the internal `isEnabled` state with the `enabled` prop.
  useEffect(() => {
    // If the prop is a signal, create a reactive effect to listen for changes.
    if (isSignal(enabled)) {
      const dispose = createEffect(() => {
        setIsEnabled(enabled.get());
      });
      // The dispose function cleans up the signal subscription.
      return dispose;
    }
    // If the prop is a plain value, just update the state when the prop changes.
    else {
      setIsEnabled(enabled);
    }
  }, [enabled]);

  // This effect manages the actual timer logic (setTimeout/setInterval).
  useEffect(() => {
    // Only set up the timer if it's currently enabled.
    if (isEnabled) {
      const id = interval
        ? setInterval(action, delay)
        : setTimeout(action, delay);

      // The cleanup function runs when `isEnabled` becomes false or on unmount.
      return () => {
        interval ? clearInterval(id) : clearTimeout(id);
      };
    }
  }, [delay, action, interval, isEnabled]); // This effect correctly depends on the unified `isEnabled` state.

  return null; // This component is for side-effects only.
}
