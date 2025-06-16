import { isValidElement, ReactNode, useEffect, useState } from 'react';

/**
 * A generic component to handle asynchronous operations and render different UI
 * based on the state of the promise (pending, fulfilled, or rejected).
 * It uses a "slot" pattern for rendering, where children components
 * like `ResourcePending`, `ResourceFulfilled`, and `ResourceRejected` define the UI for each state.
 * @param {() => Promise<T>} task The async function to be executed.
 * @param {ReactNode} children The slot components that define the UI for each state.
 */
export function Resource<T>({ task, children }: {
  task: () => Promise<T>;
  children: ReactNode;
}) {
  // State to track the status of the promise: 'pending', 'fulfilled', or 'rejected'.
  const [state, setState] = useState<'pending' | 'fulfilled' | 'rejected'>('pending');
  // State to store the successfully resolved data from the promise.
  const [data, setData] = useState<T | null>(null);
  // State to store the error if the promise is rejected.
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    // Reset state on new task. This is useful if the task changes.
    setState('pending');
    setData(null);
    setError(null);

    // Execute the async task.
    task()
      .then(res => {
        // On success, update data and set state to 'fulfilled'.
        setData(res);
        setState('fulfilled');
      })
      .catch(err => {
        // On failure, update error and set state to 'rejected'.
        setError(err);
        setState('rejected');
      });
    // IMPORTANT: The 'task' prop should be memoized with `useCallback` in the parent component
    // to prevent this effect from running on every render, which would cause an infinite loop.
  }, [task]);

  // Ensure children are in an array to simplify processing.
  const allChildren = Array.isArray(children) ? children : [children];

  // Find the specific slot components from the children.
  const Pending = allChildren.find(c => isValidElement(c) && c.type === ResourcePending);
  const Fulfilled = allChildren.find(c => isValidElement(c) && c.type === ResourceFulfilled);
  const Rejected = allChildren.find(c => isValidElement(c) && c.type === ResourceRejected);

  // Render the appropriate component based on the current state.
  if (state === 'pending') {
    return <>{Pending}</>;
  }

  if (state === 'fulfilled') {
    // For the 'fulfilled' state, if the child is a function (render prop pattern),
    // call it with the data. Otherwise, render the component directly.
    return <>{isValidElement(Fulfilled) && typeof Fulfilled.props.children === 'function' ? Fulfilled.props.children(data) : Fulfilled}</>;
  }

  if (state === 'rejected') {
    // For the 'rejected' state, if the child is a function,
    // call it with the error. Otherwise, render the component directly.
    return <>{isValidElement(Rejected) && typeof Rejected.props.children === 'function' ? Rejected.props.children(error) : Rejected}</>;
  }

  // This should ideally not be reached if the state logic is correct.
  return null;
}

/**
 * Slot component to render the UI for the 'pending' state.
 */
export const ResourcePending = ({ children }: { children: ReactNode }) => <>{children}</>;

/**
 * Slot component for the 'fulfilled' state. It uses a render prop
 * to receive the data and return the appropriate UI.
 * This component itself doesn't render anything.
 */
export const ResourceFulfilled = <T,>({ children }: { children: (data: T) => ReactNode }) => null;

/**
 * Slot component for the 'rejected' state. It uses a render prop
 * to receive the error and return the appropriate UI.
 * This component itself doesn't render anything.
 */
export const ResourceRejected = ({ children }: { children: (err: any) => ReactNode }) => null;