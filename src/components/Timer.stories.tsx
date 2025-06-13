import type { Meta, StoryObj } from '@storybook/react-vite';
import { Timer } from './Timer';
import { useState } from 'react';

const meta = {
  title: 'Components/Timer',
  component: Timer,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Timer>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses Timer with setTimeout
const TimeoutExample = () => {
  const [message, setMessage] = useState('Waiting for timeout...');
  const [key, setKey] = useState(0);
  
  const resetTimer = () => {
    setMessage('Waiting for timeout...');
    setKey(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Timeout Example (3 seconds)</h3>
      <p>{message}</p>
      <button onClick={resetTimer}>Reset Timer</button>
      
      <Timer 
        key={key}
        delay={3000} 
        do={() => setMessage('Timeout completed!')} 
        once={true} 
        interval={false} 
      />
    </div>
  );
};

// Example component that uses Timer with setInterval
const IntervalExample = () => {
  const [count, setCount] = useState(0);
  const [isRunning, setIsRunning] = useState(true);
  
  const toggleInterval = () => {
    setIsRunning(prev => !prev);
  };
  
  const resetCounter = () => {
    setCount(0);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Interval Example (1 second)</h3>
      <p>Count: {count}</p>
      <button onClick={toggleInterval}>{isRunning ? 'Pause' : 'Resume'}</button>
      <button onClick={resetCounter}>Reset Counter</button>
      
      {isRunning && (
        <Timer 
          delay={1000} 
          do={() => setCount(prev => prev + 1)} 
          once={false} 
          interval={true} 
        />
      )}
    </div>
  );
};

export const Timeout: Story = {
  render: () => <TimeoutExample />,
};

export const Interval: Story = {
  render: () => <IntervalExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <TimeoutExample />
      <div style={{ height: '20px' }} />
      <IntervalExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The Timer component is a helper that sets up either a setTimeout or setInterval and calls a callback function.

\`\`\`tsx
import { Timer } from './components/Timer';

// Use as a timeout (runs once)
<Timer 
  delay={3000} 
  do={() => console.log('3 seconds passed!')} 
  once={true} 
  interval={false} 
/>

// Use as an interval (runs repeatedly)
<Timer 
  delay={1000} 
  do={() => console.log('Every second')} 
  once={false} 
  interval={true} 
/>
\`\`\`

The Timer component takes these props:
- \`delay\`: The time in milliseconds before the callback is executed
- \`do\`: The callback function to execute
- \`once\`: Whether to run only once (default: true)
- \`interval\`: Whether to use setInterval instead of setTimeout (default: false)

The component:
- Sets up either a setTimeout or setInterval based on the interval prop
- Calls the action after the specified delay
- Cleans up the timeout/interval on unmount
- Renders nothing (returns null)
        `,
      },
    },
  },
};