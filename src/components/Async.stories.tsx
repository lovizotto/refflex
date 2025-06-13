import type { Meta, StoryObj } from '@storybook/react-vite';
import { Async, AsyncPending, AsyncFulfilled, AsyncRejected } from './Async';
import { useState } from 'react';

const meta = {
  title: 'Components/Async',
  component: Async,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Async>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses Async with a successful task
const SuccessExample = () => {
  const [key, setKey] = useState(0);
  
  const fetchData = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { name: 'John Doe', email: 'john@example.com' };
  };
  
  const resetTask = () => {
    setKey(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Async Success Example</h3>
      <button onClick={resetTask}>Restart Task</button>
      
      <div style={{ marginTop: '10px' }}>
        <Async key={key} task={fetchData}>
          <AsyncPending>
            <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              Loading user data...
            </div>
          </AsyncPending>
          
          <AsyncFulfilled>
            {(data) => (
              <div style={{ padding: '10px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                <h4>User Data Loaded</h4>
                <p>Name: {data.name}</p>
                <p>Email: {data.email}</p>
              </div>
            )}
          </AsyncFulfilled>
          
          <AsyncRejected>
            {(error) => (
              <div style={{ padding: '10px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
                <h4>Error Loading Data</h4>
                <p>{error?.message || 'Unknown error'}</p>
              </div>
            )}
          </AsyncRejected>
        </Async>
      </div>
    </div>
  );
};

// Example component that uses Async with a failing task
const ErrorExample = () => {
  const [key, setKey] = useState(0);
  
  const fetchData = async () => {
    // Simulate API call that fails
    await new Promise((_, reject) => setTimeout(() => reject(new Error('Failed to fetch data')), 2000));
    return null;
  };
  
  const resetTask = () => {
    setKey(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Async Error Example</h3>
      <button onClick={resetTask}>Restart Task</button>
      
      <div style={{ marginTop: '10px' }}>
        <Async key={key} task={fetchData}>
          <AsyncPending>
            <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              Attempting to load data...
            </div>
          </AsyncPending>
          
          <AsyncFulfilled>
            {(data) => (
              <div style={{ padding: '10px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                <h4>Data Loaded</h4>
                <p>This should never be shown</p>
              </div>
            )}
          </AsyncFulfilled>
          
          <AsyncRejected>
            {(error) => (
              <div style={{ padding: '10px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
                <h4>Error Loading Data</h4>
                <p>{error?.message || 'Unknown error'}</p>
              </div>
            )}
          </AsyncRejected>
        </Async>
      </div>
    </div>
  );
};

export const Success: Story = {
  render: () => <SuccessExample />,
};

export const Error: Story = {
  render: () => <ErrorExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <SuccessExample />
      <div style={{ height: '20px' }} />
      <ErrorExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The Async component is a helper for handling asynchronous operations with declarative state handling.

\`\`\`tsx
import { Async, AsyncPending, AsyncFulfilled, AsyncRejected } from './components/Async';

// Define an async task
const fetchUserData = async () => {
  const response = await fetch('https://api.example.com/user');
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
};

// Use the Async component to handle the task
<Async task={fetchUserData}>
  <AsyncPending>
    <div>Loading user data...</div>
  </AsyncPending>
  
  <AsyncFulfilled>
    {(userData) => (
      <div>
        <h2>User Profile</h2>
        <p>Name: {userData.name}</p>
        <p>Email: {userData.email}</p>
      </div>
    )}
  </AsyncFulfilled>
  
  <AsyncRejected>
    {(error) => (
      <div>
        <h2>Error</h2>
        <p>{error.message}</p>
      </div>
    )}
  </AsyncRejected>
</Async>
\`\`\`

The Async component takes two props:
- \`task\`: A function that returns a Promise
- \`children\`: Child components for different states (AsyncPending, AsyncFulfilled, AsyncRejected)

The component:
- Executes the task when mounted
- Manages the state of the async operation (pending, fulfilled, rejected)
- Renders the appropriate child component based on the state
- Passes the result data to AsyncFulfilled and the error to AsyncRejected
- Handles cleanup when unmounted to prevent state updates on unmounted components
        `,
      },
    },
  },
};