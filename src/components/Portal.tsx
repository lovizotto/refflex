import React, { useEffect, useState, ReactNode } from "react";
import { createPortal } from "react-dom";

type PortalProps = {
  /**
   * The content to be rendered inside the portal.
   */
  children: ReactNode;
  /**
   * An optional DOM element to mount the portal into.
   * @default document.body
   */
  mount?: HTMLElement;
};

/**
 * A declarative component that renders its children into a different part
 * of the DOM tree. This is useful for creating modals, tooltips, and other
 * UI elements that need to break out of their parent's stacking context.
 */
export function Portal({ children, mount = document.body }: PortalProps) {
  // Create a container div element only once when the component mounts.
  const [container] = useState(() => document.createElement("div"));

  useEffect(() => {
    // When the component mounts, append the container to the specified mount point.
    mount.appendChild(container);

    // When the component unmounts, clean up by removing the container.
    return () => {
      mount.removeChild(container);
    };
  }, [container, mount]); // The effect depends on the container and the mount point.

  // Use React's createPortal to render the children into the container element.
  return createPortal(children, container);
}
