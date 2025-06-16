import React from "react";
import { useSignalValue } from "../hooks/useSignal";
import { Signal } from "../core/signals";

// Helper to robustly check if a value is a signal object
function isSignal<T>(val: any): val is Signal<T> {
  return (
    typeof val === "object" &&
    val !== null &&
    "get" in val &&
    "subscribe" in val
  );
}

// Props for the signal-based variant (optimized)
type SignalVariant<T extends string | number> = {
  signal: Signal<T>;
  value?: never;
  onChange?: never;
};

// Props for the standard controlled component variant (compatible)
type ControlledVariant<T extends string | number> = {
  signal?: never;
  value: T;
  onChange: (newValue: T) => void;
};

// Combine variants with standard input attributes using a discriminated union.
type BindInputProps<T extends string | number> = (
  | SignalVariant<T>
  | ControlledVariant<T>
) &
  Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "value" | "onChange" | "onInput"
  >;

/**
 * A generic, type-safe input component for two-way data binding.
 * It is optimized for signals but is also fully compatible with standard
 * React state management via `value` and `onChange` props.
 */
export function BindInput<T extends string | number>({
  signal,
  value: controlledValue,
  onChange: controlledOnChange,
  type,
  ...rest
}: BindInputProps<T>) {
  // Determine if we are in signal mode and get the current value accordingly.
  // If using a signal, `useSignalValue` subscribes to changes without re-rendering the parent.
  const currentValue = isSignal(signal)
    ? useSignalValue(signal)
    : controlledValue;

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.currentTarget.value;
    // Ensure the new value has the correct type (string or number).
    const newValue = type === "number" ? Number(rawValue) : rawValue;

    // Update the state using the appropriate method.
    if (isSignal(signal)) {
      signal.set(newValue as T);
    } else if (controlledOnChange) {
      controlledOnChange(newValue as T);
    }
  };

  return (
    <input
      {...rest}
      type={type}
      value={currentValue}
      onInput={handleInput}
    />
  );
}
