import type { Meta, StoryObj } from '@storybook/react-vite';
import { Signal } from './Signal';
import { createSignal } from '../core/createSignal';

const meta = {
  title: 'Components/Signal',
  component: Signal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Signal>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses Signal
const SignalExample = () => {
  const [count, setCount] = createSignal(0);
  
  return (
    <div>
      <button onClick={() => setCount(count() + 1)}>Increment</button>
      <Signal value={count}>
        {(value) => <div>Count: {value}</div>}
      </Signal>
    </div>
  );
};

export const Default: Story = {
  render: () => <SignalExample />,
};

export const WithDescription: Story = {
  render: () => <SignalExample />,
  parameters: {
    docs: {
      description: {
        story: `
The Signal component is a helper that subscribes to a signal value and re-renders when the value changes.

\`\`\`tsx
import { Signal } from './components/Signal';
import { createSignal } from './core/createSignal';

// Create a signal
const [count, setCount] = createSignal(0);

// Use the Signal component to subscribe to changes
<Signal value={count}>
  {(value) => <div>Count: {value}</div>}
</Signal>
\`\`\`

The Signal component takes two props:
- \`value\`: A function that returns the current value of the signal
- \`children\`: A render function that receives the current value and returns a React node
        `,
      },
    },
  },
};