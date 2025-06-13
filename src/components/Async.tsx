import React, { useEffect, useState, isValidElement, ReactNode } from 'react';

type AsyncProps<T> = {
  task: () => Promise<T>;
  children: ReactNode;
};

export function Async<T>({ task, children }: AsyncProps<T>) {
  const [state, setState] = useState<'pending' | 'fulfilled' | 'rejected'>('pending');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | unknown>(null);

  useEffect(() => {
    let mounted = true;

    task()
      .then((result) => {
        if (mounted) {
          setData(result);
          setState('fulfilled');
        }
      })
      .catch((err) => {
        if (mounted) {
          setError(err);
          setState('rejected');
        }
      });

    return () => {
      mounted = false;
    };
  }, [task]);

  const childArray = Array.isArray(children) ? children : [children];

  const Pending = childArray.find((c) => isValidElement(c) && c.type === AsyncPending) as React.ReactElement<{ children: ReactNode }> | undefined;
  const Fulfilled = childArray.find((c) => isValidElement(c) && c.type === AsyncFulfilled) as React.ReactElement<{ children: (data: T) => ReactNode }> | undefined;
  const Rejected = childArray.find((c) => isValidElement(c) && c.type === AsyncRejected) as React.ReactElement<{ children: (error: Error | unknown) => ReactNode }> | undefined;

  if (state === 'pending') return <>{Pending}</>;
  if (state === 'fulfilled') {
    return <>{isValidElement(Fulfilled) && typeof Fulfilled.props.children === 'function'
      ? Fulfilled.props.children(data as T)
      : Fulfilled}</>;
  }
  if (state === 'rejected') {
    return <>{isValidElement(Rejected) && typeof Rejected.props.children === 'function'
      ? Rejected.props.children(error)
      : Rejected}</>;
  }

  return null;
}

export const AsyncPending = ({ children }: { children: ReactNode }) => <>{children}</>;
export const AsyncFulfilled = <T = unknown,>({}: {
  children: (data: T) => ReactNode;
}) => null;
export const AsyncRejected = ({}: {
  children: (error: Error | unknown) => ReactNode;
}) => null;
export const EndAsync = () => null;
