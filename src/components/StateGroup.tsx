import { isValidElement, ReactNode } from 'react';

export function StateGroup({ state, children }: {
  state: () => string;
  children: React.ReactNode;
}) {
  const activeState = state();
  const all = Array.isArray(children) ? children : [children];

  const match = all.find(
    (c) => isValidElement(c) && c.type === State && c.props.name === activeState
  );

  return <>{match}</>;
}

export const State = ({ children }: { name: string; children: ReactNode }) => <>{children}</>;