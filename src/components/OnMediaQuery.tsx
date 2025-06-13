import { JSX, useEffect, useState } from 'react';

interface OnMediaQueryProps {
  query: string;
  children?: React.ReactNode | ((matches: boolean) => JSX.Element);
  onMatch?: () => void;
  onUnmatch?: () => void;
}

export function OnMediaQuery({ query, children, onMatch, onUnmatch }: OnMediaQueryProps) {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mql = window.matchMedia(query);

    const handler = (e: MediaQueryListEvent) => {
      setMatches(e.matches);
      if (e.matches) onMatch?.();
      else onUnmatch?.();
    };

    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  }, [query]);

  if (typeof children === 'function') {
    return children(matches);
  }

  return matches ? <>{children}</> : null;
}