import type { Meta, StoryObj } from '@storybook/react-vite';
import { Resource, ResourcePending, ResourceFulfilled, ResourceRejected } from './Resource';
import { useState } from 'react';

const meta = {
  title: 'Components/Resource',
  component: Resource,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Resource>;

export default meta;
type Story = StoryObj<typeof meta>;

// Example component that uses Resource to fetch a user
const UserResourceExample = () => {
  const [key, setKey] = useState(0);
  
  const fetchUser = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    return { 
      id: 1, 
      name: 'Jane Smith', 
      email: 'jane@example.com',
      role: 'Administrator',
      lastLogin: new Date().toLocaleString()
    };
  };
  
  const resetResource = () => {
    setKey(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>User Resource Example</h3>
      <button onClick={resetResource}>Reload User</button>
      
      <div style={{ marginTop: '10px' }}>
        <Resource key={key} task={fetchUser}>
          <ResourcePending>
            <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              <div>Loading user profile...</div>
              <div style={{ marginTop: '10px', height: '10px', backgroundColor: '#ddd', borderRadius: '5px' }}>
                <div 
                  style={{ 
                    width: '30%', 
                    height: '100%', 
                    backgroundColor: '#1890ff',
                    borderRadius: '5px',
                    animation: 'progress 2s infinite linear',
                  }}
                />
              </div>
            </div>
          </ResourcePending>
          
          <ResourceFulfilled>
            {(user) => (
              <div style={{ padding: '10px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                <h4>User Profile</h4>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <tbody>
                    <tr>
                      <td style={{ padding: '4px', fontWeight: 'bold' }}>ID:</td>
                      <td style={{ padding: '4px' }}>{user.id}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px', fontWeight: 'bold' }}>Name:</td>
                      <td style={{ padding: '4px' }}>{user.name}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px', fontWeight: 'bold' }}>Email:</td>
                      <td style={{ padding: '4px' }}>{user.email}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px', fontWeight: 'bold' }}>Role:</td>
                      <td style={{ padding: '4px' }}>{user.role}</td>
                    </tr>
                    <tr>
                      <td style={{ padding: '4px', fontWeight: 'bold' }}>Last Login:</td>
                      <td style={{ padding: '4px' }}>{user.lastLogin}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </ResourceFulfilled>
          
          <ResourceRejected>
            {(error) => (
              <div style={{ padding: '10px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
                <h4>Error Loading User</h4>
                <p>{error?.message || 'Unknown error'}</p>
              </div>
            )}
          </ResourceRejected>
        </Resource>
      </div>
    </div>
  );
};

// Example component that uses Resource with a failing task
const ProductResourceErrorExample = () => {
  const [key, setKey] = useState(0);
  
  const fetchProduct = async () => {
    // Simulate API call that fails
    await new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Product not found or server error')), 1500)
    );
    return null;
  };
  
  const resetResource = () => {
    setKey(prev => prev + 1);
  };
  
  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h3>Product Resource Error Example</h3>
      <button onClick={resetResource}>Retry</button>
      
      <div style={{ marginTop: '10px' }}>
        <Resource key={key} task={fetchProduct}>
          <ResourcePending>
            <div style={{ padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
              <p>Fetching product details...</p>
            </div>
          </ResourcePending>
          
          <ResourceFulfilled>
            {(product) => (
              <div style={{ padding: '10px', backgroundColor: '#f6ffed', borderRadius: '4px' }}>
                <h4>Product Details</h4>
                <p>This will never be shown</p>
              </div>
            )}
          </ResourceFulfilled>
          
          <ResourceRejected>
            {(error) => (
              <div style={{ padding: '10px', backgroundColor: '#fff1f0', borderRadius: '4px' }}>
                <h4>Error Loading Product</h4>
                <p>{error?.message || 'Unknown error'}</p>
                <button 
                  onClick={resetResource}
                  style={{ marginTop: '10px', padding: '4px 8px' }}
                >
                  Try Again
                </button>
              </div>
            )}
          </ResourceRejected>
        </Resource>
      </div>
    </div>
  );
};

export const UserResource: Story = {
  render: () => <UserResourceExample />,
};

export const ErrorResource: Story = {
  render: () => <ProductResourceErrorExample />,
};

export const WithDescription: Story = {
  render: () => (
    <div>
      <UserResourceExample />
      <div style={{ height: '20px' }} />
      <ProductResourceErrorExample />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: `
The Resource component is a helper for handling asynchronous data fetching with declarative state handling.

\`\`\`tsx
import { Resource, ResourcePending, ResourceFulfilled, ResourceRejected } from './components/Resource';

// Define a data fetching function
const fetchProduct = async (id) => {
  const response = await fetch(\`https://api.example.com/products/\${id}\`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
};

// Use the Resource component to handle the data fetching
<Resource task={() => fetchProduct(123)}>
  <ResourcePending>
    <div>Loading product...</div>
  </ResourcePending>
  
  <ResourceFulfilled>
    {(product) => (
      <div>
        <h2>{product.name}</h2>
        <p>{product.description}</p>
        <p>Price: ${product.price}</p>
      </div>
    )}
  </ResourceFulfilled>
  
  <ResourceRejected>
    {(error) => (
      <div>
        <h2>Error</h2>
        <p>{error.message}</p>
      </div>
    )}
  </ResourceRejected>
</Resource>
\`\`\`

The Resource component takes two props:
- \`task\`: A function that returns a Promise
- \`children\`: Child components for different states (ResourcePending, ResourceFulfilled, ResourceRejected)

The component:
- Executes the task when mounted
- Manages the state of the async operation (pending, fulfilled, rejected)
- Renders the appropriate child component based on the state
- Passes the result data to ResourceFulfilled and the error to ResourceRejected

This component is similar to the Async component but with different naming conventions.
        `,
      },
    },
  },
};