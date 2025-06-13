import { useEffect, useState, isValidElement, ReactNode } from 'react';

type AsyncProps<T> = {
  task: () => Promise<T>;
  children: ReactNode;
};

export function Async<T>({ task, children }: AsyncProps<T>) {
  const [state, setState] = useState<'pending' | 'fulfilled' | 'rejected'>('pending');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

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

  const Pending = childArray.find((c) => isValidElement(c) && c.type === AsyncPending);
  const Fulfilled = childArray.find((c) => isValidElement(c) && c.type === AsyncFulfilled);
  const Rejected = childArray.find((c) => isValidElement(c) && c.type === AsyncRejected);

  if (state === 'pending') return <>{Pending}</>;
  if (state === 'fulfilled') {
    return <>{isValidElement(Fulfilled) && typeof Fulfilled.props.children === 'function'
      ? Fulfilled.props.children(data)
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
export const AsyncFulfilled = ({ children }: { children: (data: any) => ReactNode }) => null;
export const AsyncRejected = ({ children }: { children: (error: any) => ReactNode }) => null;
export const EndAsync = () => null;