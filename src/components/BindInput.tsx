import { useSignalValue } from '../hooks/useSignal.ts';
import { Signal } from '../core/signals.ts';

/**
 * A generic, type-safe input component two-way bound to a signal.
 * Handles both `string` and `number` types automatically.
 */
export const BindInput = <T extends string | number>(props: { signal: Signal<T> } & Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onInput'>) => {
  const { signal, type, ...rest } = props;
  const value = useSignalValue(signal);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.currentTarget.value;
    // Set the signal's value with the correct type
    if (type === 'number') {
      signal.set(Number(rawValue) as T);
    } else {
      signal.set(rawValue as T);
    }
  };

  return <input {...rest} type={type} value={value} onInput={handleInput} />;
};
