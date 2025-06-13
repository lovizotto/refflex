// components/Rf/Store.tsx
import React, { createContext, useContext, useReducer, useMemo, JSX } from 'react';
import { createSignal } from '../core/createSignal';

const StoreContext = createContext<any>(null);

export function Store({ reducer, initialState, children }: {
  reducer: (state: any, action: any) => any,
  initialState: any,
  children: React.ReactNode
}) {
  const [state, dispatch] = useReducer(reducer, initialState);

  const signals = useMemo(() => {
    return Object.keys(initialState).reduce((acc, key) => {
      const [get, set] = createSignal(state[key]);
      acc[key] = [get, set];
      return acc;
    }, {} as Record<string, ReturnType<typeof createSignal>>);
  }, []);

  useMemo(() => {
    for (const key in signals) {
      signals[key]?.[1](state[key]);
    }
  }, [state]);

  return (
    <StoreContext.Provider value={{ dispatch, signals }}>
      {children}
    </StoreContext.Provider>
  );
}

export function StoreValue({ storeKey, children }: {
  storeKey: string,
  children: (value: any) => JSX.Element
}) {
  const ctx = useContext(StoreContext);
  const [get] = ctx.signals[storeKey];
  return children(get());
}

export function Dispatch({ children }: {
  children: (dispatch: (action: any) => void) => JSX.Element
}) {
  const ctx = useContext(StoreContext);
  return children(ctx.dispatch);
}
