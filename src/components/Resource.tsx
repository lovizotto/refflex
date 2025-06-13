import { useEffect, useState, isValidElement, ReactNode } from 'react';

export function Resource<T>({ task, children }: {
  task: () => Promise<T>;
  children: ReactNode;
}) {
  const [state, setState] = useState<'pending' | 'fulfilled' | 'rejected'>('pending');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    task()
      .then(res => {
        setData(res);
        setState('fulfilled');
      })
      .catch(err => {
        setError(err);
        setState('rejected');
      });
  }, [task]);

  const all = Array.isArray(children) ? children : [children];
  const Pending = all.find(c => isValidElement(c) && c.type === ResourcePending);
  const Fulfilled = all.find(c => isValidElement(c) && c.type === ResourceFulfilled);
  const Rejected = all.find(c => isValidElement(c) && c.type === ResourceRejected);

  if (state === 'pending') return <>{Pending}</>;
  if (state === 'fulfilled') {
    return <>{isValidElement(Fulfilled) && typeof Fulfilled.props.children === 'function' ? Fulfilled.props.children(data) : Fulfilled}</>;
  }
  if (state === 'rejected') {
    return <>{isValidElement(Rejected) && typeof Rejected.props.children === 'function' ? Rejected.props.children(error) : Rejected}</>;
  }

  return null;
}

export const ResourcePending = ({ children }: { children: ReactNode }) => <>{children}</>;
export const ResourceFulfilled = ({ children }: { children: (data: any) => ReactNode }) => null;
export const ResourceRejected = ({ children }: { children: (err: any) => ReactNode }) => null;