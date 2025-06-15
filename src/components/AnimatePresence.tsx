import { useEffect, useState } from 'react';

/**
 * AnimatePresence Component
 * 
 * A component that provides a fade animation when showing or hiding content.
 * It keeps the children in the DOM until the exit animation completes.
 * 
 * @component
 * @example
 * ```tsx
 * // Basic usage
 * <AnimatePresence show={isVisible}>
 *   <div>This content will fade in and out</div>
 * </AnimatePresence>
 * 
 * // Custom animation duration
 * <AnimatePresence show={isVisible} duration={500}>
 *   <div>This content will fade in and out over 500ms</div>
 * </AnimatePresence>
 * ```
 */
export function AnimatePresence({ 
  show, 
  children, 
  duration = 300 
}: {
  /** 
   * Controls whether the children are visible.
   * When true, children fade in; when false, children fade out.
   */
  show: boolean;

  /**
   * The content to be rendered with the fade animation.
   */
  children: React.ReactNode;

  /**
   * The duration of the fade animation in milliseconds.
   * Default is 300ms.
   */
  duration?: number;
}) {
  // State to control whether the children should be rendered in the DOM
  const [render, setRender] = useState(show);

  useEffect(() => {
    /**
     * This effect handles the mounting/unmounting of children:
     * 1. When 'show' becomes true, immediately render the children
     * 2. When 'show' becomes false, wait for the animation to complete
     *    before removing the children from the DOM
     */
    if (show) {
      // Immediately render when showing
      setRender(true);
    } else {
      // Delay unmounting until animation completes
      setTimeout(() => setRender(false), duration);
    }
  }, [show, duration]);

  return (
    <div
      style={{
        // Control opacity based on the 'show' prop
        opacity: show ? 1 : 0,
        // Apply CSS transition for smooth animation
        transition: `opacity ${duration}ms ease`,
      }}
    >
      {/* Only render children when the 'render' state is true */}
      {render && children}
    </div>
  );
}
