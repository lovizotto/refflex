/**
 * Storybook stories for the Action component.
 *
 * This file demonstrates various use cases of the Action component, showcasing
 * its integration with the modern signals library.
 */

import type { Meta, StoryObj } from '@storybook/react-vite';
import { Action } from "./Action";
import { useSignal } from '../hooks/useSignal';
import { S } from "./S";
import { Loop } from "./Loop";
import { BindInput } from "./BindInput"; // Assuming this exists

const meta = {
  title: 'Components/Action',
  component: Action,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: `
The Action component is a declarative utility for creating side-effects that react to changes in state.
It does not render any UI itself, but it provides a clean way to bind a function (an "action") to one or more signals.

### When to Use
- Triggering API calls when a filter signal changes.
- Saving state to \`localStorage\` automatically.
- Logging analytics events based on state transitions.

### Basic Usage
\`\`\`tsx
import { Action } from './components/Action';
import { useSignal } from '../hooks/useSignal';
import { S } from './components/S';

const MyComponent = () => {
  const count = useSignal(0);

  // This side-effect will run every time 'count' changes.
  const logChange = (newValue) => {
    console.log('Count changed to:', newValue);
  };

  return (
    <div>
      <p>Count: <S>{count}</S></p>
      <button onClick={() => count.set(count.peek() + 1)}>
        Increment
      </button>

      <Action watch={count} onTrigger={logChange} />
    </div>
  );
};
\`\`\`
        `,
      },
    },
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Action>;

export default meta;
type Story = StoryObj<typeof meta>;

// --- Basic Example ---
const BasicActionExample = () => {
  const count = useSignal(0);
  const lastAction = useSignal('None');

  return (
    <div className="p-5 border rounded-lg w-80">
      <h3 className="text-lg font-bold mb-2">Basic Action</h3>
      <div className="text-base mb-1">
        Count: <strong className="font-mono"><S>{count}</S></strong>
      </div>
      <div className="text-sm text-gray-600 h-5">
        Last Action: <span className="italic"><S>{lastAction}</S></span>
      </div>

      <button
        onClick={() => count.set(count.peek() + 1)}
        className="mt-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Increment Count
      </button>

      {/* The 'watch' prop receives the signal object directly */}
      <Action
        watch={count}
        onTrigger={(value) => lastAction.set(`Count changed to ${value}`)}
      />
    </div>
  );
};

// --- Multiple Watches Example ---
const MultiWatchExample = () => {
  const count = useSignal(0);
  const name = useSignal('');
  const log = useSignal<string[]>([]);

  const addLog = (message: string) => {
    log.set([message, ...log.peek()].slice(0, 5));
  };

  return (
    <div className="p-5 border rounded-lg w-96">
      <h3 className="text-lg font-bold mb-2">Multiple Watches</h3>
      <div className="flex gap-4 mb-2">
        <button
          onClick={() => count.set(count.peek() + 1)}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Count: <S>{count}</S>
        </button>
        <BindInput
          signal={name}
          placeholder="Enter name"
          className="p-1 border rounded"
        />
      </div>

      <div className="mt-4">
        <h4 className="text-sm font-semibold">Action Log:</h4>
        <ul className="mt-1 p-2 bg-gray-50 rounded h-32 overflow-auto text-xs font-mono">
          <Loop each={log}>
            {(entry) => <li>{entry}</li>}
          </Loop>
        </ul>
      </div>

      {/* 'watch' can take an array of signals */}
      <Action
        watch={[count, name] as any}
        onTrigger={(values) => {
          if (Array.isArray(values)) {
            addLog(`Count=${values[0]}, Name="${values[1]}"`);
          }
        }}
      />
    </div>
  );
};

// --- Immediate Trigger Example ---
const ImmediateActionExample = () => {
  const count = useSignal(0);
  const logs = useSignal<string[]>([]);

  const addLog = (message: string) => {
    logs.set([message, ...logs.peek()].slice(0, 5));
  };

  return (
    <div className="p-5 border rounded-lg w-80">
      <h3 className="text-lg font-bold mb-2">Immediate Action</h3>
      <p>Count: <strong className="font-mono"><S>{count}</S></strong></p>

      <button
        onClick={() => count.set(count.peek() + 1)}
        className="my-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Increment Count
      </button>

      <div className="mt-2">
        <h4 className="text-sm font-semibold">Logs:</h4>
        <ul className="mt-1 p-2 bg-gray-50 rounded h-32 overflow-auto text-xs font-mono">
          <Loop each={logs}>
            {(entry) => <li>{entry}</li>}
          </Loop>
        </ul>
      </div>

      {/* 'immediate' triggers the action on mount */}
      <Action
        watch={count}
        onTrigger={(value) => addLog(`Action triggered: count = ${value}`)}
        immediate={true}
      />
    </div>
  );
};


export const Default: Story = {
  name: "Basic: Watching a Single Signal",
  render: () => <BasicActionExample />,
  args: {
    // These args are placeholders to satisfy TypeScript's type inference.
    // The render function above is what's actually displayed.
    watch: [],
    onTrigger: () => {},
  },
};

export const MultipleWatches: Story = {
  name: "Advanced: Watching Multiple Signals",
  render: () => <MultiWatchExample />,
  args: {
    watch: [],
    onTrigger: () => {},
  },
};

export const ImmediateAction: Story = {
  name: "Option: Immediate Trigger",
  render: () => <ImmediateActionExample />,
  args: {
    watch: [],
    onTrigger: () => {},
    immediate: true,
  },
};
