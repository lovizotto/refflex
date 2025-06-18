import { Signal } from "../core/signals";
import { isValidElement, useSyncExternalStore } from "react";

/**
 * A granular component that subscribes to a signal and renders only its value.
 * This is the key to fine-grained reactivity without re-rendering parent components.
 * @example <S>{counter}</S>
 */
export function S<T>({ children }: { children: Signal<T> }) {
  const synchronizedValue = useSyncExternalStore(
    children._subscribe,
    children._getSnapshot,
    children._getSnapshot, // server snapshot
  );
  // React can render most primitives, null, undefined, and arrays.
  // The primary cause of crashes is trying to render a plain object.
  // We check for this specific case to prevent the app from crashing and provide a helpful warning.
  if (
    typeof synchronizedValue === "object" &&
    synchronizedValue !== null &&
    !isValidElement(synchronizedValue) &&
    !Array.isArray(synchronizedValue)
  ) {
    console.warn(
      "Warning: The <S> component received a plain object, which cannot be rendered. " +
        "Consider using `useComputed` to extract a primitive value (string, number) from the object.",
      synchronizedValue,
    );
    // Return null to prevent the crash.
    return null;
  }

  // The value is safe to render. We cast to ReactNode for type safety.
  return <>{synchronizedValue}</>;
}
