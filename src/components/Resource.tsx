import React, { ReactNode, useEffect, useState, isValidElement } from "react";
import { createEffect } from "../core/signals";

/**
 * Slot component to render the UI for the 'pending' state.
 */
export const ResourcePending = ({ children }: { children: ReactNode }) => (
  <>{children}</>
);

/**
 * Slot component for the 'fulfilled' state. It uses a render prop
 * to receive the data and return the appropriate UI.
 */
export const ResourceFulfilled = <T,>({
  children,
}: {
  children: (data: T) => ReactNode;
}) => null;

/**
 * Slot component for the 'rejected' state. It uses a render prop
 * to receive the error and return the appropriate UI.
 */
export const ResourceRejected = ({
  children,
}: {
  children: (err: any) => ReactNode;
}) => null;

// Define the expected prop shapes for the slot components to help TypeScript.
type ResourceFulfilledProps<T> = { children: (data: T) => ReactNode };
type ResourceRejectedProps = { children: (err: any) => ReactNode };

type ResourceProps<T> = {
  /**
   * An async function that fetches the data. If this function reads any signals,
   * the component will automatically re-run the task when those signals change.
   */
  task: () => Promise<T>;
  children: ReactNode;
};

/**
 * A generic component to handle asynchronous operations. It's optimized for signals
 * but remains backward compatible with standard async functions.
 */
export function Resource<T>({ task, children }: ResourceProps<T>) {
  const [state, setState] = useState<"pending" | "fulfilled" | "rejected">(
    "pending",
  );
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let isCancelled = false;

    // `createEffect` will automatically re-run this entire block whenever a signal
    // read inside the `task()` function changes.
    const dispose = createEffect(() => {
      setState("pending");
      setData(null);
      setError(null);

      task()
        .then((res) => {
          if (!isCancelled) {
            setData(res);
            setState("fulfilled");
          }
        })
        .catch((err) => {
          if (!isCancelled) {
            setError(err);
            setState("rejected");
          }
        });
    });

    // The cleanup function runs when the component unmounts or the `task` prop changes.
    return () => {
      isCancelled = true;
      dispose(); // This cleans up the signal subscriptions.
    };
  }, [task]); // Still depends on `task` to support non-signal use cases.

  // --- Slot Rendering Logic ---
  const allChildren = Array.isArray(children) ? children : [children];

  const Pending = allChildren.find(
    (c) => isValidElement(c) && c.type === ResourcePending,
  );
  const Fulfilled = allChildren.find(
    (c) => isValidElement(c) && c.type === ResourceFulfilled,
  );
  const Rejected = allChildren.find(
    (c) => isValidElement(c) && c.type === ResourceRejected,
  );

  if (state === "pending") {
    return <>{Pending}</>;
  }

  if (state === "fulfilled") {
    // By providing a generic type to `isValidElement`, we inform TypeScript about
    // the shape of `props`, which resolves the "props is of type unknown" error.
    if (
      isValidElement<ResourceFulfilledProps<T>>(Fulfilled) &&
      typeof Fulfilled.props.children === "function"
    ) {
      return <>{Fulfilled.props.children(data as T)}</>;
    }
    return <>{Fulfilled}</>;
  }

  if (state === "rejected") {
    // Applying the same fix for the rejected state.
    if (
      isValidElement<ResourceRejectedProps>(Rejected) &&
      typeof Rejected.props.children === "function"
    ) {
      return <>{Rejected.props.children(error)}</>;
    }
    return <>{Rejected}</>;
  }

  return null;
}
