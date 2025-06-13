import { useEffect } from 'react';

export function OnMount({ do: action }: { do: () => void }) {
  useEffect(() => {
    action();
  }, []);

  return null;
}