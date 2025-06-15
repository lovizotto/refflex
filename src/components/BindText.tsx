import { useSyncExternalStore } from 'react';
import { Rf } from '../Rf';

export function BindText({ name }: { name: string }) {
    const value = useSyncExternalStore(
        Rf.createSignal(name).subscribe,
        () => Rf.createSignal(name).get(),
    );

  return <>{String(value)}</>;
}