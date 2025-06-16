import React, {
  useEffect,
  useLayoutEffect,
  Children,
  cloneElement,
  isValidElement,
  useRef,
  ReactNode,
} from "react";
import { Signal } from "../core/signals";

// Helper to check if a value is a signal object
function isSignal<T>(val: any): val is Signal<T> {
  return (
    typeof val === "object" &&
    val !== null &&
    "get" in val &&
    "subscribe" in val
  );
}

// Define the shape of the data the signal will hold.
type BoundsData = Omit<DOMRectReadOnly, "toJSON">;

// Define a default, empty bounds object.
const defaultBounds: BoundsData = {
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  top: 0,
  right: 0,
  bottom: 0,
  left: 0,
};

type BoundsProps = {
  /**
   * The signal that will be updated with the element's DOMRect data.
   */
  bind: Signal<BoundsData>;
  /**
   * The single child element to be measured.
   */
  children: ReactNode;
};

/**
 * A utility component that reactively tracks the dimensions and position (DOMRect)
 * of its child element and binds that data to a signal.
 */
export function Bounds({ bind: signal, children }: BoundsProps) {
  // We expect only a single, valid React element as a child.
  const child = Children.only(children);
  const elementRef = useRef<HTMLElement>(null);

  // useLayoutEffect is preferred over useEffect for measurements to avoid flicker.
  useLayoutEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // The ResizeObserver is the modern, performant way to watch for element size changes.
    const observer = new ResizeObserver(([entry]) => {
      if (entry) {
        // When the element's size or position changes, update the signal.
        signal.set(entry.contentRect);
      }
    });

    observer.observe(element);

    // Cleanup the observer when the component unmounts.
    return () => observer.disconnect();
  }, [signal]); // Re-run the effect only if the signal itself changes.

  // If the child is not a valid element, we can't attach a ref.
  if (!isValidElement(child)) {
    console.error(
      "Bounds component expects a single, valid React element as a child.",
    );
    return null;
  }

  // Clone the child element to attach our ref to it.
  // @ts-ignore
  return cloneElement(child, { ref: elementRef });
}
