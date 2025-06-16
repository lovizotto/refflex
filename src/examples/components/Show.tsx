import React from 'react';
import { Signal } from '../../core/signals';
import { useSignalValue } from '../../hooks/useSignal';

/**
 * Conditionally renders children only when the signal's value is truthy.
 */
const Show = ({
  when,
  children,
}: {
  when: Signal<boolean>;
  children: React.ReactNode;
}) => {
  const shouldShow = useSignalValue(when);
  return shouldShow ? <>{children}</> : null;
};

export default Show;