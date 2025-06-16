import React, { useEffect, useRef, useState, ReactNode } from "react";

type DeferredProps = {
  /**
   * The delay in milliseconds before attempting to render the children.
   * @default 0
   */
  delay?: number;
  /**
   * If true, rendering will be deferred until the component scrolls into the viewport.
   * @default false
   */
  whenInView?: boolean;
  /**
   * The content to be deferred.
   */
  children: ReactNode;
  /**
   * Optional placeholder to render while waiting.
   * Defaults to an empty div to hold space.
   */
  placeholder?: ReactNode;
};

/**
 * A utility component that defers rendering its children until certain conditions are met,
 * such as a time delay or when the component enters the viewport. This is useful for
 * performance optimizations like lazy-loading content.
 */
export function Deferred({
  delay = 0,
  whenInView = false,
  children,
  placeholder = <div />,
}: DeferredProps) {
  const [shouldRender, setShouldRender] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;
    let observer: IntersectionObserver;

    const startDeferredRender = () => {
      // If there's a delay, wait for it. Otherwise, render immediately.
      if (delay > 0) {
        timeoutId = setTimeout(() => setShouldRender(true), delay);
      } else {
        setShouldRender(true);
      }
    };

    if (whenInView) {
      // If we need to wait for the component to be in view...
      const element = ref.current;
      if (element) {
        observer = new IntersectionObserver(([entry]) => {
          // When the element is intersecting (visible), start the render process.
          if (entry.isIntersecting) {
            startDeferredRender();
            // We only need to observe once.
            observer.disconnect();
          }
        });
        observer.observe(element);
      }
    } else {
      // If not waiting for view, just start the render process directly.
      startDeferredRender();
    }

    // Cleanup function to clear timeouts and disconnect observers on unmount.
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      if (observer) observer.disconnect();
    };
  }, [delay, whenInView]); // Re-run effect only if these props change.

  // The placeholder needs the ref attached to it for the IntersectionObserver to work.
  // @ts-ignore
  const placeholderWithRef = React.isValidElement(placeholder)
    ? // @ts-ignore
      React.cloneElement(placeholder, { ref })
    : placeholder;

  // Render the children if conditions are met, otherwise render the placeholder.
  return shouldRender ? <>{children}</> : placeholderWithRef;
}
