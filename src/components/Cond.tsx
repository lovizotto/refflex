import { useEffect, useState, isValidElement, ReactNode } from 'react';
import { trackSignal } from '../core/createSignal';

export function Cond({
  condition,
  children,
}: {
  condition: () => boolean;
  children: ReactNode;
}) {
  const [, forceRender] = useState(0);

  useEffect(() => {
    const rerender = () => forceRender((x) => x + 1);
    trackSignal(rerender, condition);
  }, [condition]);

  const validChildren = Array.isArray(children) ? children : [children];

  const elseIndex = validChildren.findIndex(
    (child) => isValidElement(child) && child.type === Otherwise,
  );

  const beforeElse =
    elseIndex >= 0 ? validChildren.slice(0, elseIndex) : validChildren;
  const afterElse = elseIndex >= 0 ? validChildren.slice(elseIndex + 1) : [];

  return condition() ? <>{beforeElse}</> : <>{afterElse}</>;
}

export const Otherwise = ({ children }: { children: ReactNode }) => null;
export const EndCond = () => null;
