// components/S.tsx
import { ReactNode } from 'react';
import { Signal } from '../core/signals';
import { useSignalValue } from '../hooks/useSignal';

type SProps = {
  // It accepts a signal as its child.
  children: Signal<any>;
};

/**
 * A special component that subscribes to a signal and renders its value.
 *
 * This is the key to fine-grained reactivity. The parent component that uses <S>
 * will NOT re-render when the signal changes. Only the <S> component itself,
 * which is extremely lightweight, will update its text content.
 *
 * @example
 * const counter = useSignal(0);
 * return <p>Count: <S>{counter}</S></p>;
 */
export function S({ children: signal }: SProps): ReactNode {
  // Subscribes this tiny component to the signal.
  const value = useSignalValue(signal);
  // Renders the primitive value directly. React is highly optimized for this.
  return value;
}
