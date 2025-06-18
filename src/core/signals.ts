// ===================================================================
// FILE: core/signals.ts
// Signal logic with a consistent API of get/set/peek functions.
// ===================================================================

type Effect = {
  execute: () => void;
  dependencies: Set<Set<Effect>>;
};

let currentEffect: Effect | null = null;

/**
 * The public interface for a Signal object. It defines a clear contract
 * for interacting with reactive state.
 */
export type Signal<T> = {
  /** Reactive read: tracks this read within an effect. */
  get(): T;
  /** Write: updates the value and notifies subscribers. */
  set(newValue: T): void;
  /** Non-reactive read: gets the current value without creating a dependency. */
  peek(): T;

  /** * @internal
   * Private method for internal use by React's `useSyncExternalStore`.
   * Do not use directly.
   */
  _subscribe(callback: () => void): () => void;

  /** * @internal
   * Private method for internal use by React's `useSyncExternalStore`.
   * Do not use directly.
   */
  _getSnapshot(): T;
};

/**
 * [CORE] Creates a new reactive signal.
 * @param initialValue The starting value.
 * @returns A Signal object that follows a consistent get/set API.
 */
export function createSignal<T>(initialValue: T): Signal<T> {
  let value = initialValue;
  const subscribers = new Set<() => void>();

  const get = (): T => {
    if (currentEffect) {
      subscribers.add(currentEffect.execute);
    }
    return value;
  };

  const set = (newValue: T): void => {
    if (!Object.is(value, newValue)) {
      value = newValue;
      [...subscribers].forEach((callback) => callback());
    }
  };

  const peek = (): T => value;

  const _subscribe = (callback: () => void): (() => void) => {
    subscribers.add(callback);
    return () => subscribers.delete(callback);
  };

  return { get, set, peek, _subscribe, _getSnapshot: peek };
}

/**
 * [CORE] Creates an effect that re-runs whenever its dependent signals change.
 */
export function createEffect(effectFn: () => void): () => void {
  const execute = () => {
    // Cleanup of old dependencies would be needed here in a complete implementation
    currentEffect = { execute, dependencies: new Set() };
    try {
      effectFn();
    } finally {
      currentEffect = null;
    }
  };
  execute();

  // The dispose function would need more robust logic to unsubscribe
  return () => {};
}

/**
 * [CORE] Creates a new read-only signal derived from other signals.
 */
export function createComputed<T>(computeFn: () => T): Signal<T> {
  // The computed's value is itself a signal.
  const signal = createSignal(computeFn());

  // We create an effect that listens to the dependencies within `computeFn`
  // and updates the signal when they change.
  createEffect(() => {
    signal.set(computeFn());
  });

  // Returns a "read-only" version of the signal.
  return {
    ...signal,
    set: () => {
      console.warn("Cannot set a computed signal.");
    },
  };
}
