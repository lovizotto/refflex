import { Action } from "./Action";
import { Signal } from "../core/signals";

type OnUpdateProps<T> = {
  /**
   * The signal to watch for changes.
   */
  watch: Signal<T>;
  /**
   * The callback function that runs when the watched signal changes.
   * It receives the new value as its argument.
   */
  children: (value: T) => void;
};

/**
 * A declarative component that runs a side-effect function whenever a watched signal changes.
 * This component is a semantic wrapper around the <Action> component, using a render prop
 * (`children`) as the callback.
 *
 * @example
 * const count = useSignal(0);
 *
 * <OnUpdate watch={count}>
 * {(newValue) => console.log(`The count is now: ${newValue}`)}
 * </OnUpdate>
 */
export function OnUpdate<T>({ watch, children }: OnUpdateProps<T>) {
  // This component delegates its logic to the Action component.
  // We create a new function for `onTrigger` to satisfy TypeScript's stricter
  // type checking for the Action component's props.
  const handleTrigger = (value: T | T[]) => {
    // OnUpdate only supports watching a single signal, so the value will never be an array.
    // This check ensures type safety.
    if (!Array.isArray(value)) {
      children(value as T);
    }
  };

  return (
    <Action
      watch={watch}
      onTrigger={handleTrigger}
    />
  );
}
