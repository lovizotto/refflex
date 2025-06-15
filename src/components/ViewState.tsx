import { isValidElement, memo, useMemo } from 'react';

// Use memo to prevent unnecessary re-renders of the State component
export const State = memo(({ children }: { name: string; children: React.ReactNode }) => {
  return <>{children}</>;
});

export function ViewState({ state, children, fallback = null }: {
  state: () => string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}) {
  const current = state();
  const all = Array.isArray(children) ? children : [children];

  // Memoize the matching child if the list of children or current state changes
  const match = useMemo(() => {
    return all.find(
      (c) => isValidElement(c) && c.type === State && c.props.name === current
    ) || fallback;
  }, [all, current, fallback]);

  return <>{match}</>;
}
