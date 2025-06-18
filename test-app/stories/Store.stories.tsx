import type { Meta, StoryObj } from "@storybook/react-vite";
import React, { useState } from "react";

import { S } from "refflex";
import { Loop } from "refflex";
import { Action } from "refflex";
import { Cond, When, Otherwise } from "refflex";
import { useSignalValue } from "../../src/hooks/useSignal";
import {
  StoreProvider,
  useStoreDispatch,
  useStoreSelector,
} from "refflex";

const meta = {
  title: "Components/StoreProvider",
  component: StoreProvider,
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component: `
The StoreProvider is a Redux-like state management solution that integrates seamlessly with the signals library.
It uses a standard React reducer for state logic and exposes the state as a reactive signal.

### Key Features
- **Centralized Logic:** Uses a familiar reducer pattern for predictable state updates.
- **Reactive Subscriptions:** Components subscribe to slices of state using the \`useStoreSelector\` hook, which returns a computed signal. This ensures components only re-render when the specific data they need changes.
- **Decoupled Dispatch:** The \`useStoreDispatch\` hook provides access to the dispatch function without causing re-renders.

### Advanced Patterns

#### Persistence with localStorage
You can achieve persistence by initializing state from localStorage and using the \`<Action />\` component to write back any changes.

\`\`\`tsx
const settingsState = useStoreSelector(state => state.settings);
// This action runs whenever the settings state changes.
<Action watch={settingsState} onTrigger={(newState) => {
  localStorage.setItem('app-settings', JSON.stringify(newState));
}} />
\`\`\`

#### Async Actions (Thunks)
Create functions that orchestrate async operations and dispatch actions.

\`\`\`tsx
const fetchUser = (id) => async (dispatch) => {
  dispatch({ type: 'USER_FETCH_START' });
  try {
    const user = await api.fetchUser(id);
    dispatch({ type: 'USER_FETCH_SUCCESS', payload: user });
  } catch (error) {
    dispatch({ type: 'USER_FETCH_ERROR', payload: error.message });
  }
};

// In your component:
const dispatch = useStoreDispatch();
<button onClick={() => fetchUser(1)(dispatch)}>Fetch User</button>
\`\`\`
        `,
      },
    },
  },
  tags: ["autodocs"],
} satisfies Meta<typeof StoreProvider>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Basic Counter Example ---

type CounterState = { count: number };
type CounterAction = { type: "INCREMENT" | "DECREMENT" | "RESET" };

const counterReducer = (
  state: CounterState,
  action: CounterAction,
): CounterState => {
  switch (action.type) {
    case "INCREMENT":
      return { count: state.count + 1 };
    case "DECREMENT":
      return { count: state.count - 1 };
    case "RESET":
      return { count: 0 };
    default:
      return state;
  }
};

const CounterDisplay = () => {
  const count = useStoreSelector((state: CounterState) => state.count);
  return (
    <p className="text-2xl font-mono">
      Count: <S>{count}</S>
    </p>
  );
};

const CounterControls = () => {
  const dispatch = useStoreDispatch<CounterAction>();
  return (
    <div className="flex gap-2 mt-4">
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => dispatch({ type: "INCREMENT" })}
      >
        +
      </button>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => dispatch({ type: "DECREMENT" })}
      >
        -
      </button>
      <button
        className="px-3 py-1 bg-gray-500 text-white rounded"
        onClick={() => dispatch({ type: "RESET" })}
      >
        Reset
      </button>
    </div>
  );
};

const BasicStoreExample = () => (
  <div className="p-5 border rounded-lg w-80 text-center">
    <h3 className="text-lg font-bold mb-2">Counter</h3>
    <StoreProvider
      reducer={counterReducer}
      initialState={{ count: 0 }}
    >
      <CounterDisplay />
      <CounterControls />
    </StoreProvider>
  </div>
);

// --- Persistence Example ---

type SettingsState = { theme: "light" | "dark"; notifications: boolean };
type SettingsAction =
  | { type: "SET_THEME"; payload: "light" | "dark" }
  | { type: "TOGGLE_NOTIFICATIONS" };

const settingsReducer = (
  state: SettingsState,
  action: SettingsAction,
): SettingsState => {
  switch (action.type) {
    case "SET_THEME":
      return { ...state, theme: action.payload };
    case "TOGGLE_NOTIFICATIONS":
      return { ...state, notifications: !state.notifications };
    default:
      return state;
  }
};

const getInitialSettings = (): SettingsState => {
  try {
    const saved = localStorage.getItem("app-settings");
    return saved ? JSON.parse(saved) : { theme: "light", notifications: true };
  } catch {
    return { theme: "light", notifications: true };
  }
};

const SettingsManager = () => {
  const settings = useStoreSelector((state: SettingsState) => state);
  const theme = useStoreSelector((s: SettingsState) => s.theme);
  const notifications = useStoreSelector((s: SettingsState) =>
    s.notifications.toString(),
  );
  return (
    <>
      <div className="font-mono text-xs bg-gray-100 p-2 rounded">
        Theme: <S>{theme}</S>
        <br />
        Notifications: <S>{notifications}</S>
      </div>
      {/* This action declaratively persists state changes to localStorage */}
      <Action
        watch={settings}
        onTrigger={(newState) => {
          console.log("Saving to localStorage:", newState);
          localStorage.setItem("app-settings", JSON.stringify(newState));
        }}
      />
    </>
  );
};

const SettingsControls = () => {
  const dispatch = useStoreDispatch<SettingsAction>();
  return (
    <div className="flex flex-col gap-2 mt-4">
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => dispatch({ type: "SET_THEME", payload: "dark" })}
      >
        Set Dark Theme
      </button>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => dispatch({ type: "SET_THEME", payload: "light" })}
      >
        Set Light Theme
      </button>
      <button
        className="px-3 py-1 bg-blue-500 text-white rounded"
        onClick={() => dispatch({ type: "TOGGLE_NOTIFICATIONS" })}
      >
        Toggle Notifications
      </button>
    </div>
  );
};

const PersistenceExample = () => (
  <div className="p-5 border rounded-lg w-80 text-center">
    <h3 className="text-lg font-bold mb-2">Settings (with Persistence)</h3>
    <p className="text-xs text-gray-500 mb-2">
      Changes are saved to localStorage. Try reloading the page.
    </p>
    <StoreProvider
      reducer={settingsReducer}
      initialState={getInitialSettings()}
    >
      <SettingsManager />
      <SettingsControls />
    </StoreProvider>
  </div>
);

// --- Async (Thunk) Example ---

type UserState = {
  loading: boolean;
  data: { name: string } | null;
  error: string | null;
};
type UserAction =
  | { type: "FETCH_START" }
  | { type: "FETCH_SUCCESS"; payload: { name: string } }
  | { type: "FETCH_ERROR"; payload: string };

const userReducer = (state: UserState, action: UserAction): UserState => {
  switch (action.type) {
    case "FETCH_START":
      return { ...state, loading: true, error: null };
    case "FETCH_SUCCESS":
      return { loading: false, error: null, data: action.payload };
    case "FETCH_ERROR":
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

const fetchUser =
  (userId: number) => async (dispatch: React.Dispatch<UserAction>) => {
    dispatch({ type: "FETCH_START" });
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      if (userId === 0) throw new Error("Invalid user ID");
      const user = { name: `User #${userId}` };
      dispatch({ type: "FETCH_SUCCESS", payload: user });
    } catch (error: any) {
      dispatch({ type: "FETCH_ERROR", payload: error.message });
    }
  };

const UserDisplay = () => {
  const state = useStoreSelector((state: UserState) => state);

  return (
    <div className="mt-4 h-20 flex items-center justify-center p-3 bg-gray-100 rounded">
      <Cond>
        <When
          is={useSignalValue(useStoreSelector((s: UserState) => s.loading))}
        >
          <p>Loading...</p>
        </When>
        <When
          is={!!useSignalValue(useStoreSelector((s: UserState) => s.error))}
        >
          <p className="text-red-500">
            Error: <S>{useStoreSelector((s: UserState) => s.error)}</S>
          </p>
        </When>
        <When is={!!useSignalValue(useStoreSelector((s: UserState) => s.data))}>
          <p className="text-green-600">
            Welcome, <S>{useStoreSelector((s: UserState) => s.data?.name)}</S>!
          </p>
        </When>
        <Otherwise>
          <p>Click a button to fetch user data.</p>
        </Otherwise>
      </Cond>
    </div>
  );
};

const AsyncExample = () => {
  const dispatch = useStoreDispatch<UserAction>();
  return (
    <div className="p-5 border rounded-lg w-80 text-center">
      <h3 className="text-lg font-bold mb-2">Async Data Fetch</h3>
      <div className="flex gap-2">
        <button
          className="px-3 py-1 bg-green-500 text-white rounded w-full"
          onClick={() => fetchUser(1)(dispatch)}
        >
          Fetch User 1
        </button>
        <button
          className="px-3 py-1 bg-red-500 text-white rounded w-full"
          onClick={() => fetchUser(0)(dispatch)}
        >
          Trigger Error
        </button>
      </div>
      <UserDisplay />
    </div>
  );
};

const AsyncStoreExampleWrapper = () => (
  <StoreProvider
    reducer={userReducer}
    initialState={{ loading: false, data: null, error: null }}
  >
    <AsyncExample />
  </StoreProvider>
);

export const Basic: Story = {
  name: "Basic Usage (Counter)",
  render: () => <BasicStoreExample />,
  args: { initialState: {}, reducer: () => ({}), children: null },
};

export const Persistence: Story = {
  name: "Persistence (localStorage)",
  render: () => <PersistenceExample />,
  args: { initialState: {}, reducer: () => ({}), children: null },
};

export const Async: Story = {
  name: "Async Actions (Thunk)",
  render: () => <AsyncStoreExampleWrapper />,
  args: { initialState: {}, reducer: () => ({}), children: null },
};
