import { createComputed, createSignal } from "refflex";
import { useState } from "react";
import ExamplesPage from "./src";
import { PerformanceBenchmark } from "./stories/Benchmark";

import { S } from "refflex";
import { Loop } from "refflex";
import { OnResize } from "refflex";
// Assuming Rf is a library of lifecycle components

// --- State Definition (Module Level) ---

// This signal holds an object.
const windowSize = createSignal({
  width: window.innerWidth,
  height: window.innerHeight,
});

// These are derived, read-only signals. They automatically update
// when `windowSize` changes.
const windowWidth = createComputed(() => windowSize.get().width);
const windowHeight = createComputed(() => windowSize.get().height);

// The list of users.
const users = createSignal([
  { id: 1, name: "Alice" },
  { id: 2, name: "Bob" },
  { id: 3, name: "Charlie" },
]);

// --- View Component ---

function App() {
  const [showExamples, setShowExamples] = useState(false);

  // This is a standard React state for UI toggling, which is perfectly fine.
  if (showExamples) {
    return (
      <div className="examples-container">
        <button
          onClick={() => setShowExamples(false)}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded fixed top-4 left-4 z-50"
        >
          Back to App
        </button>
        <ExamplesPage />
      </div>
    );
  }

  // The main App component is now free of `useSignalValue` and will only render once.
  return (
    <div className="p-8">
      <button
        onClick={() => setShowExamples(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-6"
      >
        View Component Examples
      </button>
      <PerformanceBenchmark />

      {/* Lifecycle components that update signals are a great use case. */}
      <OnResize
        on={({ width, height }) => {
          // This updates the signal without causing this App component to re-render.
          windowSize.set({ width, height });
        }}
      />

      <div className="window-size bg-white p-4 rounded-lg shadow-md mt-6">
        <h2 className="text-xl font-bold mb-2">Window Size</h2>
        <p className="text-gray-700">
          {/* Use the computed signals here inside <S> for granular updates */}
          Width: <S>{windowWidth}</S>px
        </p>
        <p className="text-gray-700">
          Height: <S>{windowHeight}</S>px
        </p>
      </div>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">User List</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* The <Loop> component now handles the subscription internally.
            We pass the signal directly, without using `useSignalValue`.
            This prevents the App component from re-rendering when the user list changes.
          */}
          <Loop each={users}>
            {(user) => (
              <div className="item p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                <h3 className="text-lg font-medium">
                  {user.id} - {user.name}
                </h3>
              </div>
            )}
          </Loop>
        </div>
      </div>
    </div>
  );
}

export default App;
