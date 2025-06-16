import React, {
  createContext,
  useContext,
  useReducer,
  useMemo,
  ReactNode,
} from "react";
import { Signal } from "../core/signals";
import { useSignal, useComputed } from "../hooks/useSignal";

// Define the shape of the context value.
interface StoreContextValue<State, Action> {
  dispatch: React.Dispatch<Action>;
  stateSignal: Signal<State>;
}

// Create a generic, type-safe context.
const StoreContext = createContext<StoreContextValue<any, any> | null>(null);

/**
 * Provides a Redux-like store to the component tree. State updates are managed
 * by a standard reducer, and the state is exposed as a reactive signal tree.
 */
export function StoreProvider<State, Action>({
  reducer,
  initialState,
  children,
}: {
  reducer: React.Reducer<State, Action>;
  initialState: State;
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  // A single signal holds the entire state tree. `useSignal` ensures it's created only once.
  const stateSignal = useSignal(initialState);

  // When the reducer's state changes (after a dispatch), update the master signal.
  // This happens in a single, atomic update, which is highly efficient.
  React.useEffect(() => {
    stateSignal.set(state);
  }, [state, stateSignal]);

  // The context value is memoized for performance.
  const contextValue = useMemo(
    () => ({
      dispatch,
      stateSignal,
    }),
    [dispatch, stateSignal],
  );

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
}

/**
 * Custom hook to get the dispatch function from the nearest StoreProvider.
 */
export function useStoreDispatch<Action>() {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreDispatch must be used within a StoreProvider");
  }
  return context.dispatch as React.Dispatch<Action>;
}

/**
 * Custom hook to select a slice of the store's state.
 * It returns a memoized, computed signal for the selected state, ensuring
 * components only re-render when the specific data they depend on changes.
 *
 * @param selector A function that takes the full state and returns a slice of it.
 * @returns A read-only signal containing the selected state.
 */
export function useStoreSelector<State, Selected>(
  selector: (state: State) => Selected,
): Signal<Selected> {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error("useStoreSelector must be used within a StoreProvider");
  }

  // `useComputed` creates an efficient, derived signal that only updates
  // when the result of the selector function changes.
  const selectedSignal = useComputed(() => selector(context.stateSignal.get()));

  return selectedSignal;
}
