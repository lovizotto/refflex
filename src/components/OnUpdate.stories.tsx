import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnUpdate } from './OnUpdate';
import { createSignal } from '../core/createSignal';
import { useState, useEffect } from 'react';

const meta = {
  title: 'Components/OnUpdate',
  component: OnUpdate,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OnUpdate>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses OnUpdate with a simple counter
const CounterExample = () => {
  const [count, setCount] = createSignal(0);
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prev => [message, ...prev].slice(0, 5));
  };
  
  useEffect(() => {
    addLog('Component mounted');
  }, []);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>OnUpdate Counter Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <p>Count: {count()}</p>
        <button 
          onClick={() => setCount(count() + 1)}
          style={{ marginRight: '10px' }}
        >
          Increment
        </button>
        <button 
          onClick={() => setCount(count() - 1)}
        >
          Decrement
        </button>
      </div>
      
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '4px',
        maxHeight: '200px',
        overflow: 'auto'
      }}>
        <h4>Action Log:</h4>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
      
      <OnUpdate watch={count}>
        {(value) => {
          addLog(`Count updated to: ${value}`);
        }}
      </OnUpdate>
      
      <div style={{ padding: '10px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
        <p><strong>Note:</strong> The OnUpdate component calls the callback function whenever the count signal changes.</p>
      </div>
    </div>
  );
};

// Example component that uses OnUpdate with multiple signals
const MultipleSignalsExample = () => {
  const [firstName, setFirstName] = createSignal('John');
  const [lastName, setLastName] = createSignal('Doe');
  const [logs, setLogs] = useState<string[]>([]);
  
  const fullName = () => `${firstName()} ${lastName()}`;
  
  const addLog = (message: string) => {
    setLogs(prev => [message, ...prev].slice(0, 5));
  };
  
  useEffect(() => {
    addLog('Component mounted');
  }, []);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Multiple Signals Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>First Name:</label>
          <input
            type="text"
            value={firstName()}
            onChange={(e) => setFirstName(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
          />
        </div>
        
        <div style={{ marginBottom: '10px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Last Name:</label>
          <input
            type="text"
            value={lastName()}
            onChange={(e) => setLastName(e.target.value)}
            style={{ width: '100%', padding: '8px', borderRadius: '4px' }}
          />
        </div>
        
        <p><strong>Full Name:</strong> {fullName()}</p>
      </div>
      
      <div style={{ 
        marginBottom: '20px', 
        padding: '10px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '4px',
        maxHeight: '200px',
        overflow: 'auto'
      }}>
        <h4>Action Log:</h4>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
      
      <OnUpdate watch={firstName}>
        {(value) => {
          addLog(`First name updated to: ${value}`);
        }}
      </OnUpdate>
      
      <OnUpdate watch={lastName}>
        {(value) => {
          addLog(`Last name updated to: ${value}`);
        }}
      </OnUpdate>
      
      <OnUpdate watch={fullName}>
        {(value) => {
          addLog(`Full name updated to: ${value}`);
        }}
      </OnUpdate>
      
      <div style={{ padding: '10px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
        <p><strong>Note:</strong> The OnUpdate component can watch multiple signals independently, including computed signals.</p>
      </div>
    </div>
  );
};

// Example component that uses OnUpdate for side effects
const SideEffectExample = () => {
  const [theme, setTheme] = createSignal<'light' | 'dark'>('light');
  const [fontSize, setFontSize] = createSignal(16);
  const [logs, setLogs] = useState<string[]>([]);
  
  const addLog = (message: string) => {
    setLogs(prev => [message, ...prev].slice(0, 5));
  };
  
  useEffect(() => {
    addLog('Component mounted');
  }, []);
  
  const toggleTheme = () => {
    setTheme(theme() === 'light' ? 'dark' : 'light');
  };
  
  const themeStyles = () => ({
    backgroundColor: theme() === 'light' ? '#ffffff' : '#333333',
    color: theme() === 'light' ? '#333333' : '#ffffff',
    fontSize: `${fontSize()}px`,
    padding: '20px',
    borderRadius: '4px',
    transition: 'all 0.3s ease'
  });
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Side Effect Example</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <button 
          onClick={toggleTheme}
          style={{ marginRight: '10px' }}
        >
          Toggle Theme
        </button>
        
        <button 
          onClick={() => setFontSize(size => Math.max(12, size - 2))}
          style={{ marginRight: '10px' }}
        >
          Decrease Font
        </button>
        
        <button 
          onClick={() => setFontSize(size => Math.min(24, size + 2))}
        >
          Increase Font
        </button>
      </div>
      
      <div style={themeStyles()}>
        <h4>Themed Content</h4>
        <p>This content changes based on the theme and font size settings.</p>
        <p>Current theme: {theme()}</p>
        <p>Current font size: {fontSize()}px</p>
      </div>
      
      <div style={{ 
        margin: '20px 0', 
        padding: '10px', 
        backgroundColor: '#f0f0f0', 
        borderRadius: '4px',
        maxHeight: '200px',
        overflow: 'auto'
      }}>
        <h4>Action Log:</h4>
        <ul>
          {logs.map((log, index) => (
            <li key={index}>{log}</li>
          ))}
        </ul>
      </div>
      
      <OnUpdate watch={theme}>
        {(value) => {
          addLog(`Theme changed to: ${value}`);
          // In a real app, you might save the theme preference to localStorage here
        }}
      </OnUpdate>
      
      <OnUpdate watch={fontSize}>
        {(value) => {
          addLog(`Font size changed to: ${value}px`);
          // In a real app, you might save the font size preference to localStorage here
        }}
      </OnUpdate>
      
      <div style={{ padding: '10px', backgroundColor: '#fff7e6', borderRadius: '4px' }}>
        <p><strong>Note:</strong> The OnUpdate component is useful for performing side effects when signals change, such as saving preferences or updating external systems.</p>
      </div>
    </div>
  );
};

export const Counter: Story = {
  render: () => <CounterExample />,
};

export const MultipleSignals: Story = {
  render: () => <MultipleSignalsExample />,
};

export const SideEffects: Story = {
  render: () => <SideEffectExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <CounterExample />
      <div style={{ height: '20px' }} />
      <MultipleSignalsExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The OnUpdate component is a helper that watches a signal and calls a callback function when the signal changes.

\`\`\`tsx
import { OnUpdate } from './components/OnUpdate';
import { createSignal } from '../core/createSignal';

// Create a signal
const [count, setCount] = createSignal(0);

// Use OnUpdate to react to changes
<OnUpdate watch={count}>
  {(value) => {
    console.log('Count changed to:', value);
    // Perform side effects here
  }}
</OnUpdate>

// With a computed signal
const fullName = () => \`\${firstName()} \${lastName()}\`;

<OnUpdate watch={fullName}>
  {(value) => {
    console.log('Full name changed to:', value);
  }}
</OnUpdate>
\`\`\`

The OnUpdate component takes two props:
- \`watch\`: A function that returns a value to watch (typically a signal)
- \`children\`: A callback function that receives the current value of the watched signal

The component:
- Uses trackSignal to watch for changes in the signal
- Calls the callback function with the current value when the signal changes
- Returns null (renders nothing)

This component is useful for:
- Performing side effects when signals change
- Logging changes to signals
- Saving user preferences when they change
- Synchronizing state with external systems
        `,
      },
    },
  },
};