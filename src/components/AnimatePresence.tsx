import React, { useState, useEffect, ReactNode } from "react";
import { Signal } from "../core/signals";
import { useSelector } from "../hooks/useSignal";

// Helper to check if a value is a signal object
function isSignal<T>(val: any): val is Signal<T> {
  return (
    typeof val === "object" &&
    val !== null &&
    "get" in val &&
    "subscribe" in val
  );
}

type AnimatePresenceProps = {
  /**
   * Controls whether the children are visible. Can be a boolean or a signal.
   */
  show: boolean | Signal<boolean>;
  /**
   * The content to be rendered with the fade animation.
   */
  children: ReactNode;
  /**
   * The duration of the fade animation in milliseconds.
   * @default 300
   */
  duration?: number;
};

/**
 * A component that provides a fade animation when showing or hiding content.
 * It keeps children in the DOM until the exit animation completes, and is
 * optimized to be controlled by signals.
 */
export function AnimatePresence({
  show,
  children,
  duration = 300,
}: AnimatePresenceProps) {
  // `useSelector` reactively gets the boolean value from either a signal or a plain prop.
  const isVisible = useSelector(() => (isSignal(show) ? show.get() : show));

  // This state determines if the children are in the DOM.
  const [shouldRender, setShouldRender] = useState(isVisible);

  useEffect(() => {
    if (isVisible) {
      // If showing, immediately add children to the DOM to start the fade-in animation.
      setShouldRender(true);
    } else {
      // If hiding, wait for the fade-out animation to finish before removing from the DOM.
      const timer = setTimeout(() => {
        setShouldRender(false);
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration]);

  return (
    <div
      style={{
        opacity: isVisible ? 1 : 0,
        transition: `opacity ${duration}ms ease-in-out`,
      }}
    >
      {/* The content remains mounted during the fade-out animation. */}
      {shouldRender && children}
    </div>
  );
}
