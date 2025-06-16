import React from 'react';
import { Signal } from '../core/signals';
import { useComputed, useSignal, useSignalValue } from '../hooks/useSignal';
import { S } from '../components/S';
import { Loop } from '../components/Loop';
import { PerformanceBenchmark } from '../components/Benchmark';
import { Timer } from '../components/Timer.tsx';
import { Action } from '../components/Action.tsx';

// --- Reusable Helper Components for Signals ---

/**
 * Conditionally renders children only when the signal's value is truthy.
 */
const Show = ({
  when,
  children,
}: {
  when: Signal<boolean>;
  children: React.ReactNode;
}) => {
  const shouldShow = useSignalValue(when);
  return shouldShow ? <>{children}</> : null;
};

/**
 * A simple input component two-way bound to a signal.
 */
const BindInput = (
  props: {
    signal: Signal<string>;
  } & React.InputHTMLAttributes<HTMLInputElement>,
) => {
  const { signal, ...rest } = props;
  const value = useSignalValue(signal);
  return (
    <input
      {...rest}
      value={value}
      onInput={(e) => signal.set(e.currentTarget.value)}
    />
  );
};

// --- Main Page ---

const ExamplesPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Modern Signal Components Examples
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <ExampleCard title="Signal & S Component">
          <SignalExample />
        </ExampleCard>
        <ExampleCard title="Show (Conditional Rendering)">
          <ShowExample />
        </ExampleCard>
        <ExampleCard title="Action (Side Effect)">
          <ActionExample />
        </ExampleCard>
        <ExampleCard title="Computed Signal">
          <MemoExample />
        </ExampleCard>
        <ExampleCard title="Loop (Reactive List)">
          <LoopExample />
        </ExampleCard>
        <ExampleCard title="BindInput (Two-way Binding)">
          <BindInputExample />
        </ExampleCard>
        <ExampleCard title="Performance Benchmark">
          <PerformanceBenchmark />
        </ExampleCard>
        <ExampleCard title="Timer Component">
          <TimerExample />
        </ExampleCard>
      </div>
    </div>
  );
};

// Reusable card component for examples
const ExampleCard = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
    <div className="bg-blue-500 text-white py-2 px-4">
      <h2 className="text-xl font-semibold">{title}</h2>
    </div>
    <div className="p-4 flex-grow">{children}</div>
  </div>
);

// --- Individual Examples ---

const SignalExample = () => {
  const count = useSignal(0); // Use hook for component-local state

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => count.set(count.peek() + 1)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
      >
        Increment
      </button>
      <div className="text-lg font-medium">
        Count: <S>{count}</S>
      </div>
    </div>
  );
};

const ShowExample = () => {
  const isVisible = useSignal(true);
  const buttonText = useComputed(() =>
    isVisible.get() ? 'Hide Content' : 'Show Content',
  );

  return (
    <div className="flex flex-col items-center">
      <button
        onClick={() => isVisible.set(!isVisible.peek())}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3"
      >
        <S>{buttonText}</S>
      </button>
      <Show when={isVisible}>
        <div className="bg-gray-100 p-3 rounded text-center">
          This content is conditionally rendered.
        </div>
      </Show>
    </div>
  );
};

const ActionExample = () => {
  // 1. Load the theme from localStorage on init, or default to 'light'.
  const initialTheme = localStorage.getItem('theme-preference') || 'light';
  const theme = useSignal(initialTheme);
  const status = useSignal('Ready');

  // 2. Define the side-effect: save the theme to storage and update status.
  const saveThemeToStorage = (newTheme: string) => {
    localStorage.setItem('theme-preference', newTheme);
    status.set(`Theme '${newTheme}' saved.`);
    setTimeout(() => status.set('Ready'), 2000); // Reset status message
  };

  return (
    <div className="flex flex-col">
      <p className="text-sm text-gray-600 mb-2">
        Select a theme. The change will be saved to localStorage automatically.
      </p>

      <fieldset className="flex space-x-4 mb-4">
        <legend className="sr-only">Theme</legend>
        <label className="flex items-center">
          <input
            type="radio"
            name="theme"
            value="light"
            checked={useSignalValue(theme) === 'light'}
            onChange={() => theme.set('light')}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="ml-2">Light</span>
        </label>
        <label className="flex items-center">
          <input
            type="radio"
            name="theme"
            value="dark"
            checked={useSignalValue(theme) === 'dark'}
            onChange={() => theme.set('dark')}
            className="form-radio h-4 w-4 text-blue-600"
          />
          <span className="ml-2">Dark</span>
        </label>
      </fieldset>

      <div className="bg-gray-100 p-3 rounded">
        <div className="text-sm text-gray-600">Current Theme:</div>
        <div className="font-bold text-lg uppercase">
          <S>{theme}</S>
        </div>
        <div className="text-xs text-green-600 h-4 mt-1">
          <S>{status}</S>
        </div>
      </div>

      <p className="text-xs text-gray-500 mt-2">
        Try changing the theme, then reload the page. Your preference will be
        remembered.
      </p>

      {/* 3. The Action component declaratively binds the side-effect to the signal. */}
      <Action watch={theme} onTrigger={saveThemeToStorage} />
    </div>
  );
};

const MemoExample = () => {
  const a = useSignal(2);
  const b = useSignal(3);

  // createComputed creates a memoized, derived signal.
  const sum = useComputed(() => {
    console.log('Calculating sum...'); // This will only log when a or b changes
    return a.get() + b.get();
  });

  return (
    <div className="flex flex-col">
      <div className="flex space-x-4 mb-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value A
          </label>
          <BindInput
            signal={a}
            type="number"
            className="border border-gray-300 rounded px-3 py-2 w-20"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Value B
          </label>
          <BindInput
            signal={b}
            type="number"
            className="border border-gray-300 rounded px-3 py-2 w-20"
          />
        </div>
      </div>
      <div className="bg-gray-100 p-3 rounded">
        <div className="text-lg font-medium">
          Memoized Sum: <S>{sum}</S>
        </div>
      </div>
    </div>
  );
};

const LoopExample = () => {
  const items = useSignal([
    { id: 1, name: 'Item 1' },
    { id: 2, name: 'Item 2' },
  ]);

  const addItem = () => {
    const currentItems = items.peek();
    const newId =
      currentItems.length > 0
        ? Math.max(...currentItems.map((item) => item.id)) + 1
        : 1;
    items.set([...currentItems, { id: newId, name: `Item ${newId}` }]);
  };

  const removeItem = (idToRemove: number) => {
    items.set(items.peek().filter((item) => item.id !== idToRemove));
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={addItem}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-3 self-start"
      >
        Add Item
      </button>
      <div className="space-y-2">
        <Loop each={items}>
          {(item) => (
            <div className="flex justify-between items-center bg-gray-100 p-2 rounded">
              <span>{item.name}</span>
              <button
                onClick={() => removeItem(item.id)}
                className="bg-red-500 hover:bg-red-600 text-white font-medium py-1 px-2 rounded text-xs"
              >
                Remove
              </button>
            </div>
          )}
        </Loop>
      </div>
    </div>
  );
};

const BindInputExample = () => {
  const text = useSignal('');

  return (
    <div className="flex flex-col">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Enter text:
      </label>
      <BindInput
        signal={text}
        className="border border-gray-300 rounded px-3 py-2 mb-3"
        placeholder="Type something..."
      />
      <div className="bg-gray-100 p-3 rounded">
        <div className="text-sm text-gray-600 mb-1">You typed:</div>
        <div className="text-lg font-medium break-words">
          {/* We can use <S> for a reactive display */}
          <S>{text}</S>
        </div>
      </div>
    </div>
  );
};

const TimerExample = () => {
  const seconds = useSignal(0);
  const isRunning = useSignal(false);

  return (
    <div className="flex flex-col items-center">
      <div className="flex space-x-2 mb-3">
        <button
          onClick={() => isRunning.set(true)}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
          disabled={useSignalValue(isRunning)}
        >
          Start
        </button>
        <button
          onClick={() => isRunning.set(false)}
          className="bg-red-500 hover:bg-red-600 text-white font-medium py-2 px-4 rounded disabled:opacity-50"
          disabled={!useSignalValue(isRunning)}
        >
          Stop
        </button>
        <button
          onClick={() => seconds.set(0)}
          className="bg-gray-500 hover:bg-gray-600 text-white font-medium py-2 px-4 rounded"
        >
          Reset
        </button>
      </div>

      <div className="text-2xl font-bold">
        <S>{seconds}</S>s
      </div>

      <Timer
        delay={1000}
        interval={true}
        enabled={isRunning}
        do={() => seconds.set(seconds.peek() + 1)}
      />
    </div>
  );
};

export default ExamplesPage;
