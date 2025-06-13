import { isValidElement } from 'react';

export function ViewState({ state, children }: {
  state: () => string;
  children: React.ReactNode;
}) {
  const current = state();
  const all = Array.isArray(children) ? children : [children];

  const match = all.find(
    (c) => isValidElement(c) && c.type === State && c.props.name === current
  );

  return <>{match}</>;
}
export const State = ({ children }: { name: string; children: React.ReactNode }) => <>{children}</>;
