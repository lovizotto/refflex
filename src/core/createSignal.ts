// core/createSignal.ts
import { unstable_batchedUpdates } from 'react-dom';

export type Subscriber = () => void;

export type SignalRead<T> = {
  (): T;
  subscribe(fn: Subscriber): () => void;
};

export function createSignal<T>(initial: T): readonly [SignalRead<T>, (next: T) => void] {
  let value = initial;
  const subscribers = new Set<Subscriber>();

  const read = (() => {
    if (currentTracker) {
      subscribers.add(currentTracker);
    }
    return value;
  }) as SignalRead<T>;

  read.subscribe = (fn: Subscriber): (() => void) => {
    subscribers.add(fn);
    return () => {
      subscribers.delete(fn);
    };
  };

  const write = (next: T) => {
    if (Object.is(value, next)) return;
    value = next;
    unstable_batchedUpdates(() => {
      subscribers.forEach(fn => fn());
    });
  };

  return [read, write] as const;
}

let currentTracker: Subscriber | null = null;

export function trackSignal(subscriber: Subscriber, readFn: () => void) {
  currentTracker = subscriber;
  readFn();
  currentTracker = null;
}