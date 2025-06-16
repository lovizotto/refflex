import React from 'react';
import { Signal } from '../../core/signals';
import { useSignalValue } from '../../hooks/useSignal';

/**
 * A simple input component two-way bound to a signal.
 */
const BindInput = (
  props: {
    signal: Signal<string>;
  } & React.InputHTMLAttributes<HTMLInputElement>,
) => {
  const { signal, ...rest } = props;
  const value = useSignalValue(signal);
  return (
    <input
      {...rest}
      value={value}
      onInput={(e) => signal.set(e.currentTarget.value)}
    />
  );
};

export default BindInput;