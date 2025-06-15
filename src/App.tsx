
import { createSignal } from './core/createSignal.ts';
import { useState } from 'react';
import ExamplesPage from './examples/index';
import { Rf } from './Rf.tsx';

const [windowSize, setWindowSize] = createSignal({ width: 0, height: 0 });
const [, setWindowSize2] = createSignal({ width: 0, height: 0 });
const [users, ] = createSignal([
  { id: 1, name: 'Alice' },
  { id: 2, name: 'Bob' },
  { id: 3, name: 'Charlie' },
]);

function App() {
  const [showExamples, setShowExamples] = useState(false);

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

  return (
    <div className="p-8">
      <button 
        onClick={() => setShowExamples(true)}
        className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded mb-6"
      >
        View Component Examples
      </button>

      <Rf.OnMount
        do={() =>
          setWindowSize2({
            width: window.innerWidth,
            height: window.innerHeight,
          })
        }
      />
      <Rf.OnResize
        on={({ width, height }) => {
          setWindowSize({ width, height });
        }}
      />

      <Rf.Signal value={windowSize}>
        {(size) => (
          <div className="window-size bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-2">Window Size</h2>
            <p className="text-gray-700">Width: {size.width}px</p>
            <p className="text-gray-700">Height: {size.height}px</p>
          </div>
        )}
      </Rf.Signal>

      <div className="mt-6">
        <h2 className="text-xl font-bold mb-2">User List</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <Rf.Loop each={users} keyExtractor={(user) => user.id}>
            {(user) => (
              <div className="item p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
                <h3 className="text-lg font-medium">
                  {user.id} - {user.name}
                </h3>
              </div>
            )}
          </Rf.Loop>
        </div>
      </div>
    </div>
  );
}

export default App;
