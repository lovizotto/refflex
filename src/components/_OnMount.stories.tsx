import type { Meta, StoryObj } from '@storybook/react-vite';
import { OnMount } from './OnMount';
import { useState } from 'react';

const meta = {
  title: 'Components/OnMount',
  component: OnMount,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof OnMount>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses OnMount
const OnMountExample = () => {
  const [mountCount, setMountCount] = useState(0);
  const [showComponent, setShowComponent] = useState(true);
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>OnMount Component Example</h3>
      <p>Component has been mounted {mountCount} times</p>
      
      <button onClick={() => setShowComponent(!showComponent)}>
        {showComponent ? 'Unmount Component' : 'Mount Component'}
      </button>
      
      {showComponent && (
        <>
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            backgroundColor: '#f0f0f0', 
            borderRadius: '4px' 
          }}>
            Component is mounted
          </div>
          <OnMount do={() => setMountCount(prev => prev + 1)} />
        </>
      )}
    </div>
  );
};

// Example component that uses OnMount for data fetching
const DataFetchExample = () => {
  const [data, setData] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [key, setKey] = useState(0);
  
  const fetchData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setData('Successfully loaded data at ' + new Date().toLocaleTimeString());
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };
  
  const refetch = () => {
    setKey(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Data Fetching Example</h3>
      <button onClick={refetch} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Refetch Data'}
      </button>
      
      <div style={{ marginTop: '10px' }}>
        {isLoading ? (
          <div>Loading data...</div>
        ) : error ? (
          <div style={{ color: 'red' }}>{error}</div>
        ) : (
          <div>{data}</div>
        )}
      </div>
      
      <OnMount key={key} do={fetchData} />
    </div>
  );
};

export const Default: Story = {
  render: () => <OnMountExample />,
};

export const DataFetching: Story = {
  render: () => <DataFetchExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <OnMountExample />
      <div style={{ height: '20px' }} />
      <DataFetchExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The OnMount component is a helper that executes a callback function when the component mounts.

\`\`\`tsx
import { OnMount } from './components/OnMount';
import { useState } from 'react';

// Create state to track mount count
const [mountCount, setMountCount] = useState(0);

// Use the OnMount component to execute code on mount
<OnMount do={() => {
  console.log('Component mounted');
  setMountCount(prev => prev + 1);
}} />
\`\`\`

The OnMount component takes one prop:
- \`do\`: A callback function to execute when the component mounts

The component:
- Uses React's useEffect hook with an empty dependency array to run the callback once on mount
- Returns null (renders nothing)
- Is useful for side effects like data fetching, analytics tracking, or initialization

Common use cases:
- Fetching data when a component mounts
- Initializing third-party libraries
- Tracking analytics events
- Incrementing counters or updating state
        `,
      },
    },
  },
};