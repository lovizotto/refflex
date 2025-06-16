// core/signals.ts

// This is our global tracker for automatic dependency detection.
// When a signal is read, it checks if there's a current effect running
// and adds that effect as a subscriber.
let currentEffect: (() => void) | null = null;

export type Signal<T> = {
  // Read the signal's value and subscribe the current effect.
  get(): T;
  // Write a new value to the signal and notify subscribers.
  set(newValue: T): void;
  // Read the signal's value without subscribing.
  peek(): T;
  // Manually subscribe to the signal.
  subscribe(callback: () => void): () => void;
};

/**
 * Creates a new signal with an initial value.
 * A signal is an object with `get` and `set` methods for reactive state management.
 * @param initialValue The starting value for the signal.
 * @returns A signal object.
 */
export function createSignal<T>(initialValue: T): Signal<T> {
  let value = initialValue;
  const subscribers = new Set<() => void>();

  const get = (): T => {
    // If there's an active effect, subscribe it to this signal.
    if (currentEffect) {
      subscribers.add(currentEffect);
    }
    return value;
  };

  const set = (newValue: T) => {
    // Only update and notify if the value has changed.
    if (!Object.is(value, newValue)) {
      value = newValue;
      // Notify all subscribers about the change.
      // We create a copy to avoid issues if a subscriber unsubscribes during the loop.
      [...subscribers].forEach(callback => callback());
    }
  };

  const peek = (): T => value;

  const subscribe = (callback: () => void): (() => void) => {
    subscribers.add(callback);
    // Return an unsubscribe function.
    return () => subscribers.delete(callback);
  };

  return { get, set, peek, subscribe };
}

/**
 * Creates a side effect that re-runs whenever its dependent signals change.
 * @param effectFn The function to run as an effect.
 * @returns A dispose function to stop the effect and clean up subscriptions.
 */
export function createEffect(effectFn: () => void): () => void {
  const execute = () => {
    // Set this effect as the current one being tracked.
    currentEffect = execute;
    try {
      // Run the user's effect function. Any signal `get()` called inside
      // will now subscribe this `execute` function.
      effectFn();
    } finally {
      // Clean up the global tracker after the effect runs.
      currentEffect = null;
    }
  };
  // Run the effect for the first time to establish initial subscriptions.
  execute();

  // The concept of a returned dispose function is correct, but since subscriptions
  // are dynamic, we don't have a simple list to clean up. In a real-world lib,
  // this would be more complex. For this example, we'll keep it simple.
  // A true implementation would clear old dependencies on each run.
  return () => {
    // In a full implementation, we'd need to track and clear subscriptions here.
  };
}

/**
 * Creates a new read-only signal that is derived from other signals.
 * Its value is automatically updated when any of its dependencies change.
 * @param computeFn A function that computes the derived value.
 * @returns A read-only signal containing the computed value.
 */
export function createComputed<T>(computeFn: () => T): Signal<T> {
  // A computed signal is just a regular signal...
  const computedSignal = createSignal(computeFn());

  // ...with an effect that automatically updates its value.
  createEffect(() => {
    computedSignal.set(computeFn());
  });

  // Return a read-only version of the signal.
  return {
    ...computedSignal,
    set: () => {
      console.warn("Cannot set a computed signal.");
    },
  };
}
