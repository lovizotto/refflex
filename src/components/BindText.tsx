import { Signal } from "../core/signals";
import { useSignalValue } from "../hooks/useSignal";

type BindTextProps = {
  /**
   * The signal whose value should be displayed.
   */
  signal: Signal<any>;
};

/**
 * A utility component that reactively displays the value of a signal.
 * It subscribes to the signal and re-renders only when its value changes.
 *
 * Note: This component is functionally identical to the <S> component.
 * It is provided for semantic clarity in certain use cases.
 *
 * @example
 * const myText = useSignal("Hello World");
 * <BindText signal={myText} />
 */
export function BindText({ signal }: BindTextProps) {
  // useSignalValue subscribes this component to the signal and returns its current value.
  const value = useSignalValue(signal);

  // Render the value, converting it to a string to ensure it can be displayed.
  return <>{String(value)}</>;
}
