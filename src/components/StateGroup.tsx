import { isValidElement, ReactNode, useMemo, memo } from 'react';

// Use memo to prevent unnecessary re-renders of the State component
export const State = memo(
  ({
    children,
  }: {
    name: string; // The 'name' prop is used by StateGroup, not directly by State's render
    children: ReactNode;
  }) => {
    // If you want to explicitly avoid the TS6133 warning without renaming,
    // you can "use" it in a non-rendering way, though it's often overkill.
    // console.log(name); // Or, if you have a custom linter setup that needs it:
    // if (process.env.NODE_ENV === 'development') { void name; } // common trick

    return <>{children}</>;
  },
);

export function StateGroup({ state, children, fallback = null }: {
  state: () => string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const activeState = state();

  // No need for useMemo here; the operation is cheap and children is already stable
  const allChildren = Array.isArray(children) ? children : [children];

  // Memoize the matching child if the list of children or activeState changes.
  // This is potentially useful if 'allChildren' could be very large,
  // but for a small number of states, it might not be a huge perf gain.
  const match = useMemo(() => {
    return allChildren.find(
      (child) => {
        // 1. Check if it's a valid React element
        // 2. Check if its 'type' property is exactly your 'State' component
        if (isValidElement(child) && child.type === State) {
          // 3. Now, TypeScript knows 'child' is a ReactElement.
          // We need to tell it that if child.type === State, then its props
          // must conform to the props of 'State'.
          // We can cast 'child' to a ReactElement specifically for your 'State' component.
          // This tells TypeScript: "I know for sure that if child.type is 'State', then its props are '{ name: string }'".
          const stateChild = child as React.ReactElement<{ name: string }>;
          return stateChild.props.name === activeState;
        }
        return false;
      }
    ) || fallback;
  }, [allChildren, activeState, fallback]);
  return <>{match}</>;
}