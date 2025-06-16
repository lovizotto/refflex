import { useEffect, ReactNode } from "react";

type OnMountProps = {
  /**
   * The function to execute when the component mounts.
   */
  do: () => void;
};

/**
 * A declarative utility component that executes a function once, immediately
 * after the component has been mounted to the DOM.
 * It does not render any UI itself.
 *
 * @example
 * <OnMount do={() => console.log('Component has mounted!')} />
 */
export function OnMount({ do: action }: OnMountProps) {
  // useEffect with an empty dependency array runs only once after the initial render.
  useEffect(() => {
    action();
  }, [action]); // The action is included for correctness, but should be a stable function.

  return null; // This component is for side-effects only.
}
