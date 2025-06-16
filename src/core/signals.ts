// core/signals.ts

type Effect = {
  execute: () => void;
  dependencies: Set<Set<Effect>>;
};

// This is our global tracker for automatic dependency detection.
let currentEffect: Effect | null = null;

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
  const subscribers = new Set<Effect>();

  const get = (): T => {
    // If there's an active effect, subscribe it to this signal.
    if (currentEffect) {
      subscribers.add(currentEffect);
      // The effect also tracks this signal's subscriber list as a dependency.
      currentEffect.dependencies.add(subscribers);
    }
    return value;
  };

  const set = (newValue: T) => {
    // Only update and notify if the value has changed.
    if (!Object.is(value, newValue)) {
      value = newValue;
      // Notify all subscribers about the change.
      // We create a copy to avoid issues if a subscriber unsubscribes during the loop.
      [...subscribers].forEach(effect => effect.execute());
    }
  };

  const peek = (): T => value;

  const subscribe = (callback: () => void): (() => void) => {
    // For manual subscriptions, we create a simple effect object.
    const effect: Effect = {
      execute: callback,
      dependencies: new Set(),
    };
    subscribers.add(effect);
    // Return an unsubscribe function.
    return () => subscribers.delete(effect);
  };

  return { get, set, peek, subscribe };
}

/**
 * Creates a side effect that re-runs whenever its dependent signals change.
 * This is now a robust implementation with proper cleanup.
 * @param effectFn The function to run as an effect.
 * @returns A dispose function to stop the effect and clean up all subscriptions.
 */
export function createEffect(effectFn: () => void): () => void {
  // The cleanup function iterates through all dependencies (signal subscriber sets)
  // and removes this effect from them.
  const cleanup = () => {
    effect.dependencies.forEach(dep => {
      dep.delete(effect);
    });
    effect.dependencies.clear();
  };

  // The effect object now holds its own dependencies.
  const effect: Effect = {
    execute: () => {
      // Before running the effect, clean up old dependencies.
      // This is crucial for correctness if dependencies are conditional.
      cleanup();
      // Set this as the current effect being tracked.
      currentEffect = effect;
      try {
        effectFn();
      } finally {
        // Unset the global tracker after the effect has run.
        currentEffect = null;
      }
    },
    dependencies: new Set(),
  };

  // Run the effect for the first time to establish initial subscriptions.
  effect.execute();

  // The returned dispose function is now fully functional.
  // It performs a final cleanup of all subscriptions.
  return cleanup;
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
