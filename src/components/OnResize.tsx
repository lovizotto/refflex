import { useEffect } from "react";

type OnResizeProps = {
  /**
   * The callback function to execute when the window is resized.
   * It receives an object with the new width and height. For performance,
   * if this function is defined within a component, it should be memoized
   * with `useCallback`.
   */
  on: (size: { width: number; height: number }) => void;
};

/**
 * A declarative utility component that runs a side-effect function
 * whenever the browser window is resized. It also triggers once on mount
 * to provide the initial size.
 */
export function OnResize({ on }: OnResizeProps) {
  useEffect(() => {
    // This handler will be called on mount and on every resize event.
    const handler = () => {
      on({ width: window.innerWidth, height: window.innerHeight });
    };

    // Trigger initially to get the starting size.
    handler();

    // Add the event listener for subsequent resizes.
    window.addEventListener("resize", handler);

    // Cleanup function to remove the listener on unmount or when the `on` prop changes.
    return () => window.removeEventListener("resize", handler);
  }, [on]); // The effect re-subscribes if the `on` callback function changes.

  return null; // This component is for side-effects only.
}
