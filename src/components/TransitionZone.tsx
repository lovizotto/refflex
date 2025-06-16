import React, { useState, useEffect, ReactNode } from "react";

type TransitionZoneProps = {
  /**
   * The child content to render. The component will wrap updates to this
   * content in a non-urgent transition, keeping the UI responsive.
   */
  children: ReactNode;
  /**
   * An optional timeout for the transition.
   */
  timeoutMs?: number;
};

/**
 * A component that wraps its children's updates in a React Transition.
 * This is useful for keeping the UI responsive when a state change causes
 * a slow or complex re-render. It marks the update as non-urgent.
 */
export function TransitionZone({ children, timeoutMs }: TransitionZoneProps) {
  const [content, setContent] = useState(children);

  useEffect(() => {
    // React's startTransition marks the state update inside as non-urgent.
    // This allows other UI updates (like typing in an input) to remain responsive.
    React.startTransition(() => {
      setContent(children);
    });
  }, [children]); // The transition is triggered whenever the children prop changes.

  return <>{content}</>;
}
